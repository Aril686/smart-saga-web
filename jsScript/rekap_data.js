/* JAM */
setInterval(()=>{
  document.getElementById("jam").innerText =
    new Date().toLocaleTimeString("id-ID");
},1000);

/* FORMAT TANGGAL */
function tanggalIndo(tanggal){
  return new Date(tanggal).toLocaleDateString("id-ID",{
    day:'2-digit', month:'long', year:'numeric'
  });
}

/* LOAD DATA */
async function loadData(){
  const bulan = document.getElementById("bulan").value;
  const tahun = document.getElementById("tahun").value;

  const res = await fetch(`/api/absensi-rekap?bulan=${bulan}&tahun=${tahun}`);
  const data = await res.json();

  const tbody = document.getElementById("tabel-data");
  tbody.innerHTML = "";

  if(data.length === 0){
    tbody.innerHTML = `<tr><td colspan="5">Tidak ada data</td></tr>`;
    return;
  }

  data.forEach(d=>{
    tbody.innerHTML += `
      <tr>
        <td>${d.nama || "-"}</td>
        <td>${d.kelas || "-"}</td>
        <td>${tanggalIndo(d.tanggal)}</td>
        <td>${d.jam_masuk}</td>
        <td>
          <span class="status ${d.status.toLowerCase()}">
            ${d.status}
          </span>
        </td>
      </tr>
    `;
  });
}

/* EVENT FILTER */
document.getElementById("bulan").addEventListener("change", loadData);
document.getElementById("tahun").addEventListener("change", loadData);

/* USER */
async function loadUser(){
  const res = await fetch("/api/me");
  const user = await res.json();
  document.getElementById("hello-user").innerText =
    `Halo, ${user.username}`;
}

function exportExcel() {
  const bulan = document.getElementById("bulan").value;
  const tahun = document.getElementById("tahun").value;
  window.open(`/api/export_excelBulan?bulan=${bulan}&tahun=${tahun}`, "_blank");
}
/* INIT */
loadUser();
loadData();
