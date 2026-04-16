async function simpanKartu() {
  const card_uid = document.getElementById("card_uid").value;
  const nama = document.getElementById("nama").value;
  const kelas = document.getElementById("kelas").value;

  if (!card_uid || !nama || !kelas) {
    alert("Semua field wajib diisi!");
    return;
  }

  try {
    const res = await fetch("/api/kartu", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ card_uid, nama, kelas })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Gagal menyimpan");
      return;
    }

    alert("✅ Data kartu berhasil disimpan");

    // reset form
    document.getElementById("card_uid").value = "";
    document.getElementById("nama").value = "";
    document.getElementById("kelas").value = "";

  } catch (err) {
    alert("❌ Tidak bisa terhubung ke server");
    console.error(err);
  }
}