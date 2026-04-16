async function simpanUsers() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const roles_id = document.getElementById("roles_id").value;

  if (!username || !password || !roles_id) {
    alert("Semua field wajib diisi!");
    return;
  }

  try {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password, roles_id })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Gagal menyimpan");
      return;
    }

    alert("✅ Data kartu berhasil disimpan");

    // reset form
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    document.getElementById("roles_id").value = "";

  } catch (err) {
    alert("❌ Tidak bisa terhubung ke server");
    console.error(err);
  }
};
