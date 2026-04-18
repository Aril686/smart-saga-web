// ====================== DASHBOARD.JS ======================

// Form submission
document.getElementById("formIzin")?.addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData();
  formData.append("nama_siswa", document.getElementById("nama_siswa").value);
  formData.append("kelas_siswa", document.getElementById("kelas_siswa").value);
  formData.append("alasan", document.getElementById("alasan").value);

  const bukti = document.getElementById("bukti").files[0];
  if (bukti) {
    formData.append("bukti", bukti);
  }

  fetch("/api/perizinan", {
    method: "POST",
    body: formData
  })
  .then(() => {
    const successEl = document.getElementById("success");
    if (successEl) {
      successEl.style.display = "block";
    }
    document.getElementById("formIzin").reset();
    
    setTimeout(() => {
      if (successEl) successEl.style.display = "none";
    }, 3000);
  })
  .catch(() => {
    alert("Gagal mengirim pengajuan");
  });
});

// ====================== RIWAYAT PERIZINAN ======================

async function openIzinPopup() {
  console.log("openIzinPopup dipanggil");

  const modal = document.getElementById("izinModal");
  if (!modal) return;

  modal.style.display = "flex";

  try {
    const res = await fetch("/api/riwayatperizinan");

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    const tbody = document.getElementById("izinTable");

    if (!tbody) return;

    tbody.innerHTML = "";

    if (!data.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center;">Tidak ada data</td>
        </tr>
      `;
      return;
    }

    data.forEach(row => {
      const nama_siswa = escapeHtml(row.nama_siswa);
      const kelas_siswa = escapeHtml(row.kelas_siswa);
      const alasan = escapeHtml(row.alasan);
      const bukti =  row.bukti 
        ? `<img src="/uploads/perizinan/${row.bukti}" alt="bukti" style="max-width:100px; height:auto;"/>` 
        : "-";

      const created_at = tanggalIndo(row.created_at);
      const statusClass = getStatusClass(row.status);
      const statusText = getStatusText(row.status);

      tbody.innerHTML += `
        <tr>
          <td>${nama_siswa}</td>
          <td>${kelas_siswa}</td>
          <td>${created_at}</td>
          <td>${alasan}</td>
          <td><span class="status-badge ${statusClass}">${statusText}</span></td>
          <td>${bukti}</td>
        </tr>
      `;
    });

  } catch (err) {
    console.error(err);
  }
}

/* ================= STATISTIK ================= */
async function loadStatistik() {
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
}
loadStatistik();
setInterval(loadStatistik, 5000);


/* ================= TAP TERBARU ================= */
async function loadLatest() {
  const res = await fetch("/api/latest");
  const data = await res.json();

  const latestBox = document.querySelector(".latest-tap");
  if (!latestBox) return;

  latestBox.innerHTML = `<h2>🔔 Tap Terbaru</h2>` +
    data.map(d => `
      <p><b>${d.nama || "Unknown"}</b><br>
      ${tanggalIndo(d.tanggal)} ${d.jam_masuk} ${d.kelas || ""}</p>
    `).join("");
}

//=========================== absen manual ===========
async function absenNama() {
  const nama = document.getElementById("namaInput").value.trim();

  if (!nama) {
    alert("Isi nama dulu!");
    return;
  }

  try {
    const res = await fetch("/api/absen-manual", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ nama })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    const btn = document.getElementById("btnAbsen");
    if (btn) btn.style.display = "block";

    document.getElementById("namaInput").value = "";

  } catch (err) {
    console.error(err);
    alert("Gagal absen manual");
  }
}

// ====================== HELPER ======================

function getStatusClass(status) {
  switch ((status || "").toLowerCase()) {
    case "disetujui": return "status-approved";
    case "ditolak": return "status-rejected";
    default: return "status-pending";
  }
}

function getStatusText(status) {
  switch ((status || "").toLowerCase()) {
    case "disetujui": return "Disetujui";
    case "ditolak": return "Ditolak";
    default: return "Pending";
  }
}

function tanggalIndo(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID");
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text || "";
  return div.innerHTML;
}

function closeIzinPopup() {
  const modal = document.getElementById("izinModal");
  if (modal) modal.style.display = "none";
}


// ====================== INIT ======================
loadLatest();
setInterval(loadLatest, 3000);

// global assignments moved to script bottom or common.js
window.openIzinPopup = openIzinPopup;
window.closeIzinPopup = closeIzinPopup;
window.absenNama = absenNama;