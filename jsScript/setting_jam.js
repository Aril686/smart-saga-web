
let chart;

// LOAD JAM
async function loadJam(){
  const res = await fetch("/api/setting-jam");
  const data = await res.json();

  document.getElementById("jamMasuk").value = data.jam_masuk;
  document.getElementById("jamPulang").value = data.jam_pulang;
}

// SAVE JAM
async function saveJam(){
  const jam_masuk = document.getElementById("jamMasuk").value;
  const jam_pulang = document.getElementById("jamPulang").value;

  await fetch("/api/setting-jam", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({ jam_masuk, jam_pulang })
  });

  alert("Berhasil disimpan");
}

// LOAD STATISTIK
async function loadStatistik(){
  const res = await fetch("/api/statistik");
  const data = await res.json();

  document.getElementById("hadir").innerText = data.hadir;
  document.getElementById("izin").innerText = data.izin;
  document.getElementById("alpha").innerText = data.alpha;

  const ctx = document.getElementById("chartAbsensi");

  if(chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Hadir", "Izin", "Alpha"],
      datasets: [{
        data: [data.hadir, data.izin, data.alpha],
        backgroundColor: ["#00c853","#ffab00","#ff5252"]
      }]
    }
  });
}

// AUTO REFRESH (REALTIME FEEL)
setInterval(loadStatistik, 5000);

// INIT
loadJam();
loadStatistik();
