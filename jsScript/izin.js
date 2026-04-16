fetch("/api/perizinan/manage")
  .then(async (res) => {
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text);
    }
    return res.json();
  })
  .then(data => {
    const tbody = document.getElementById("data-izin");
    tbody.innerHTML = "";

    data.forEach(d => {
      tbody.innerHTML += `
        <tr>
          <td>${d.nama_siswa}</td>
          <td>${d.kelas_siswa}</td>
          <td>${d.alasan}</td>

          <td class="foto-cell">
            ${d.bukti ? `
              <img src="/uploads/${d.bukti}" alt="Bukti Izin">
              <br>
              <a href="/uploads/${d.bukti}" target="_blank">Lihat</a> |
              <a href="/uploads/${d.bukti}" download>Download</a>
            ` : "-"}
          </td>

          <td class="status">${d.status}</td>

          <td>
            ${d.status === "pending" ? `
              <button onclick="updateStatus(${d.id}, 'disetujui')">Setujui</button>
              <button onclick="updateStatus(${d.id}, 'ditolak')">Tolak</button>
            ` : "-"}
          </td>
        </tr>
      `;
    });
  })
  .catch(err => {
    console.error("Fetch Error:", err.message);
    alert("Gagal memuat data. Pastikan login sebagai admin.");
  });

function updateStatus(id, status) {
  fetch("/api/perizinan/manage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, status })
  }).then(() => location.reload());
}