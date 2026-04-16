/* ================= JAM ================= */
setInterval(() => {
  const jam = document.getElementById("realtime-clock");
  if (jam) {
    jam.innerText = new Date().toLocaleTimeString("id-ID");
  }
}, 1000);


/* ================= STATISTIK ================= */
async function loadStatistik() {
  try {
    const res = await fetch("/api/statistik");
    const data = await res.json();

    const hadir = document.getElementById("total-hadir");
    const izin = document.getElementById("total-izin");
    const alpha = document.getElementById("total-alpha");
    const persen = document.getElementById("persentase-kehadiran");

    if (hadir) hadir.innerText = data.hadir;
    if (izin) izin.innerText = data.izin;
    if (alpha) alpha.innerText = data.alpha;
    if (persen) persen.innerText = data.persentase + "%";

  } catch (err) {
    console.error("STATISTIK ERROR:", err);
  }
}
loadStatistik();
setInterval(loadStatistik, 5000);


function exportExcel() {
  window.location.href = "/api/export_excel";
}


/* ================= ABSENSI TABLE ================= */
let absensiData = [];

async function loadAbsensi() {
  try {
    const res = await fetch("/api/absensi");
    absensiData = await res.json();
    renderTable();
  } catch (err) {
    console.error("ABSENSI ERROR:", err);
  }
}

function tanggalIndo(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta"
  });
}

function renderTable() {
  const tbody = document.getElementById("absensi-body");
  const select = document.getElementById("kelas-select");

  if (!tbody) return;

  tbody.innerHTML = "";

  const kelas = select ? select.value : null;

  const filtered = kelas
    ? absensiData.filter(d => d.kelas === kelas)
    : absensiData;

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7">Belum ada data</td></tr>`;
    return;
  }

  filtered.forEach(d => {
    tbody.innerHTML += `
      <tr>
        <td>${d.nama || "-"}</td>
        <td>${d.mac || "-"}</td>
        <td>${tanggalIndo(d.tanggal)}</td>
        <td>${d.jam_masuk}</td>
        <td>
          <span class="status ${d.status.toLowerCase()}">
            ${d.status}
          </span>
        </td>
        <td>${d.kelas || "-"}</td>
      </tr>
    `;
  });
}

/* ✅ AMAN EVENT LISTENER */
const select = document.getElementById("kelas-select");
if (select) {
  select.addEventListener("change", renderTable);
}


/* ================= TAP TERBARU ================= */
async function loadLatest() {
  try {
    const res = await fetch("/api/latest");
    const data = await res.json();

    const latestBox = document.querySelector(".latest-tap");
    if (!latestBox) return;

    latestBox.innerHTML =
      `<h2>🔔 Tap Terbaru</h2>` +
      data.map(d => `
        <p><b>${d.nama || "Unknown"}</b><br>
        ${tanggalIndo(d.tanggal)} ${d.jam_masuk} ${d.kelas || ""}</p>
      `).join("");

  } catch (err) {
    console.error("LATEST ERROR:", err);
  }
}


/* ================= USER ================= */
async function loadUser() {
  try {
    const res = await fetch("/api/me");
    if (!res.ok) return;

    const user = await res.json();

    const el = document.getElementById("hello-user");
    if (el) {
      el.innerText = `Welcome Admin, ${user.username}`;
    }

  } catch (err) {
    console.error("USER ERROR:", err);
  }
}


/* ================= INIT ================= */
document.addEventListener("DOMContentLoaded", () => {
  loadUser();
  loadAbsensi();
  loadLatest();

  setInterval(loadLatest, 3000);
  setInterval(loadAbsensi, 5000);
});


/* ================= LOGOUT ================= */
function logout() {
  if (confirm("Yakin nih ingin logout?")) {
    window.location.href = "login.html";
  }
}