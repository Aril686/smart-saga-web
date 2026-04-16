// ====================== DASHBOARD.JS ======================

// Real-time clock
function updateClock() {
  const now = new Date();
  const timeString = now.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  const clockElement = document.getElementById("realtime-clock");
  if (clockElement) clockElement.innerText = timeString;
}

setInterval(updateClock, 1000);
updateClock();

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

  document.getElementById("total-hadir").innerText = data.hadir;
  document.getElementById("total-izin").innerText = data.izin;
  document.getElementById("total-alpha").innerText = data.alpha;
  document.getElementById("persentase-kehadiran").innerText =
    data.persentase + "%";
}
loadStatistik();
setInterval(loadStatistik, 5000);


/* ================= TAP TERBARU ================= */
async function loadLatest() {
  const res = await fetch("/api/latest");
  const data = await res.json();

  const latestBox = document.querySelector(".latest-tap");
  latestBox.innerHTML = `<h2>🔔 Tap Terbaru</h2>` +
    data.map(d => `
      <p><b>${d.nama || "Unknown"}</b><br>
      ${tanggalIndo(d.tanggal)} ${d.jam_masuk} ${d.kelas}</p>
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

    // tampilkan sukses
    document.getElementById("btnAbsen").style.display = "block";

    // reset input
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
window.onload = function () {
  console.log("Dashboard initialized");
};

// global
window.openIzinPopup = openIzinPopup;
window.closeIzinPopup = closeIzinPopup;