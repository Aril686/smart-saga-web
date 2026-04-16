let users = [];
let editId = null;

// Load data users
async function loadUsers() {
  try {
    const res = await fetch("/admin/management_users");
    users = await res.json();
    const tbody = document.getElementById("data-users");
    tbody.innerHTML = "";

    users.forEach(u => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${u.id}</td>
        <td>${u.username}</td>
        <td>${u.password}</td>
        <td>${u.role}</td>
        <td>
          <button class="edit-btn" onclick="openEdit(${u.id})">Edit</button>
          <button class="delete-btn" onclick="deleteUser(${u.id})">Hapus</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
    alert("Gagal load data users");
  }
}


// ---- Load all users ----
async function loadUsers() {
  try {
    const res = await fetch("/admin/management_users");
    if (!res.ok) throw new Error("Gagal fetch data users");
    users = await res.json();
    const tbody = document.getElementById("data-users");
    tbody.innerHTML = "";

    users.forEach(u => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${u.id}</td>
        <td>${u.username}</td>
        <td>${u.role}</td>
        <td>
          <button class="edit-btn" onclick="openEdit(${u.id})">Edit</button>
          <button class="delete-btn" onclick="deleteUser(${u.id})">Hapus</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
    alert("Gagal load data users");
  }
}

// ---- Open modal edit ----
function openEdit(id) {
  editId = id;
  const user = users.find(u => u.id === id);
  if (!user) return alert("User tidak ditemukan");
  document.getElementById("editUsername").value = user.username;
  document.getElementById("editPassword").value = "";
  document.getElementById("editRole").value = user.role.toLowerCase() === "admin" ? "1" : "2";
  document.getElementById("modal").style.display = "flex";
}

// ---- Cancel modal ----
document.getElementById("cancelBtn").addEventListener("click", () => {
  document.getElementById("modal").style.display = "none";
});

// ---- Save edit ----
document.getElementById("saveBtn").addEventListener("click", async () => {
  const username = document.getElementById("editUsername").value.trim();
  const password = document.getElementById("editPassword").value.trim();
  const roles_id = parseInt(document.getElementById("editRole").value);

  if (!username) return alert("Username wajib diisi");

  try {
    const res = await fetch(`/admin/management_users/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, roles_id })
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Server response:", text);
      throw new Error("Gagal update user");
    }

    const data = await res.json();
    alert(data.message);
    document.getElementById("modal").style.display = "none";
    loadUsers();

  } catch (err) {
    console.error(err);
    alert("Gagal update user");
  }
});

// ---- Delete user ----
async function deleteUser(id) {
  if (!confirm("Yakin ingin hapus user ini?")) return;
  try {
    const res = await fetch(`/admin/management_users/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const text = await res.text();
      console.error("Server response:", text);
      throw new Error("Gagal hapus user");
    }
    const data = await res.json();
    alert(data.message);
    loadUsers();
  } catch (err) {
    console.error(err);
    alert("Gagal hapus user");
  }
}

// ---- Initial load ----
loadUsers();