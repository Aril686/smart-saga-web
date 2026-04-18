/* ================= SMART SAGA COMMON JS ================= */

// 1. Sinkronisasi Jam (Jika elemen ada)
setInterval(() => {
  const jam = document.getElementById("realtime-clock");
  if (jam) {
    jam.innerText = new Date().toLocaleTimeString("id-ID");
  }
}, 1000);

// 2. Sidebar Toggle Mobile
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const sidebar = document.querySelector(".sidebar");
  
  if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", () => {
      sidebar.classList.toggle("active");
      console.log("📱 Sidebar Toggled");
    });
  }
});

// 3. Logout System
function logout() {
  if (confirm("Yakin nih ingin logout?")) {
    window.location.href = "/logout";
  }
}

// Make globally accessible
window.logout = logout;
