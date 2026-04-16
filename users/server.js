// ====================== IMPORT ======================
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise");
const mqtt = require("mqtt");

const app = express();
const PORT = 3000;

// ====================== DEBUG PATH ======================
console.log("DIRNAME:", __dirname);

// ====================== MIDDLEWARE ======================
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Serve static file dari folder ini (admin)
app.use(express.static(__dirname));

// ====================== KONFIGURASI DATABASE ======================
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "db_smart-saga",
};

// ====================== KONFIGURASI MQTT ======================
const mqttConfig = {
  mqtt_server: "d4074ff835754387b943f21e95168512.s1.eu.hivemq.cloud",
  mqtt_port: 8883,
  mqtt_user: "school-absensi",
  mqtt_password: "School12",
  mqtt_topic: "absensi/rfid",
};

// ====================== ROUTES ======================

// ROOT → ADMIN DASHBOARD (FIX ENOENT)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});

// ====================== API ABSENSI ======================
app.get("/api/absensi", async (req, res) => {
  try {
    const db = await mysql.createConnection(dbConfig);
    const [rows] = await db.execute(`
      SELECT 
        a.card_uid,
        a.mac,
        a.tanggal,
        a.jam_masuk AS jam,
        a.status,
        a.lokasi,
        a.jam_pulang,
        m.nama
      FROM absensi_log a
      LEFT JOIN data_mapping m ON a.card_uid = m.card_uid
      ORDER BY a.id DESC
    `);
    await db.end();
    res.json(rows);
  } catch (err) {
    console.error("API /api/absensi:", err.message);
    res.status(500).json({ error: "Gagal mengambil data absensi" });
  }
});

// ====================== API LATEST TAP ======================
app.get("/api/latest", async (req, res) => {
  try {
    const db = await mysql.createConnection(dbConfig);
    const [rows] = await db.execute(`
      SELECT 
        a.card_uid,
        a.mac,
        a.tanggal,
        a.jam_masuk AS jam,
        a.status,
        a.jam_pulang,
        m.nama
      FROM absensi_log a
      LEFT JOIN data_mapping m ON a.card_uid = m.card_uid
      ORDER BY a.id DESC
      LIMIT 5
    `);
    await db.end();
    res.json(rows);
  } catch (err) {
    console.error("API /api/latest:", err.message);
    res.status(500).json({ error: "Gagal mengambil tap terbaru" });
  }
});

// ====================== API STATISTIK ======================
app.get("/api/statistik", async (req, res) => {
  try {
    const db = await mysql.createConnection(dbConfig);
    const [rows] = await db.execute(`
      SELECT status, COUNT(*) AS jumlah
      FROM absensi_log
      WHERE tanggal = CURDATE()
      GROUP BY status
    `);
    await db.end();

    let hadir = 0, izin = 0, alpha = 0;

    rows.forEach(r => {
      if (r.status === "Hadir") hadir = r.jumlah;
      if (r.status === "Izin") izin = r.jumlah;
      if (r.status === "Alpha") alpha = r.jumlah;
    });

    const total = hadir + izin + alpha;
    const persentase = total ? Math.round((hadir / total) * 100) : 0;

    res.json({ total, hadir, izin, alpha, persentase });
  } catch (err) {
    console.error("API /api/statistik:", err.message);
    res.status(500).json({ error: "Gagal menghitung statistik" });
  }
});

// ====================== API TAMBAH KARTU ======================
app.post("/api/kartu", async (req, res) => {
  const { card_uid, nama, kelas } = req.body;

  if (!card_uid || !nama || !kelas) {
    return res.status(400).json({ error: "Semua field wajib diisi" });
  }

  try {
    const db = await mysql.createConnection(dbConfig);
    await db.execute(
      "INSERT INTO data_mapping (card_uid, nama, lokasi) VALUES (?, ?, ?)",
      [card_uid.trim(), nama.trim(), kelas.trim()]
    );
    await db.end();

    res.json({ success: true, message: "Kartu siswa berhasil disimpan" });
  } catch (err) {
    console.error("API /api/kartu:", err.message);

    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "ID kartu sudah terdaftar" });
    }

    res.status(500).json({ error: "Gagal menyimpan kartu siswa" });
  }
});

// ====================== MQTT INIT ======================
async function initMQTT() {
  console.log("🔌 Menghubungkan ke HiveMQ Cloud...");

  const client = mqtt.connect({
    host: mqttConfig.mqtt_server,
    port: mqttConfig.mqtt_port,
    protocol: "mqtts",
    username: mqttConfig.mqtt_user,
    password: mqttConfig.mqtt_password,
    clientId: "node-" + Math.random().toString(16).substr(2, 8),
    reconnectPeriod: 5000,
  });

  client.on("connect", () => {
    console.log("✅ MQTT Terhubung");
    client.subscribe(mqttConfig.mqtt_topic);
  });

  client.on("message", async (topic, message) => {
    let payload;
    try {
      payload = JSON.parse(message.toString());
    } catch {
      return console.error("❌ Payload bukan JSON");
    }

    const cardUID = payload.rf_id || "Unknown";
    const mac = payload.mac || "Unknown";
    let lokasi = payload.lokasi || null;

    try {
      const db = await mysql.createConnection(dbConfig);

      const [map] = await db.execute(
        "SELECT nama, lokasi FROM data_mapping WHERE card_uid = ?",
        [cardUID]
      );

      let nama = "Tanpa Nama";
      if (map.length > 0) {
        nama = map[0].nama;
        lokasi = lokasi || map[0].lokasi;
      }

      const now = new Date();
      const tanggal = now.toISOString().slice(0, 10);
      const jam = now.toTimeString().slice(0, 8);

      let status = "Hadir";
      let jamPulang = null;

      if (jam >= "16:00:00") {
        status = "Pulang";
        jamPulang = jam;
      } else if (jam > "09:30:00") {
        status = "Telat";
      }

      await db.execute(
        "INSERT INTO absensi_log (card_uid, mac, tanggal, jam_masuk, status, lokasi, nama, jam_pulang) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [cardUID, mac, tanggal, jam, status, lokasi, nama, jamPulang]
      );

      await db.end();
      console.log(`✅ ${nama} (${status})`);
    } catch (err) {
      console.error("DB Error MQTT:", err.message);
    }
  });
}

// ====================== START SERVER ======================
app.listen(PORT, () => {
  console.log(`🚀 Server running di http://localhost:${PORT}`);
  initMQTT();
});
