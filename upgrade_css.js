const fs = require('fs');
const path = require('path');

const cssFolder = path.join(__dirname, 'cssFolder');
const files = fs.readdirSync(cssFolder).filter(f => f.endsWith('.css') && f !== 'login.css');

const cssInject = `
/* ========================================================= */
/* 🌟 LIGHT GLASSMORPHISM OVERRIDE - BY ANTIGRAVITY 🌟 */
/* ========================================================= */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

body {
  font-family: 'Inter', sans-serif !important;
  background: linear-gradient(-45deg, #F3F4F6, #e0e7ff, #DBEAFE, #F3E8FF) !important;
  background-size: 400% 400% !important;
  animation: gradientBG 15s ease infinite !important;
  color: #334155 !important;
}

@keyframes gradientBG {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.sidebar {
  background: rgba(255, 255, 255, 0.5) !important;
  backdrop-filter: blur(20px) !important;
  -webkit-backdrop-filter: blur(20px) !important;
  border-right: 1px solid rgba(255, 255, 255, 0.8) !important;
  color: #1e293b !important;
  box-shadow: 4px 0 24px rgba(0,0,0,0.02) !important;
}

.sidebar h2 {
  color: #2563eb !important;
  font-weight: 700 !important;
}

.sidebar a {
  color: #475569 !important;
  transition: all 0.3s ease !important;
}

.sidebar a:hover {
  background: rgba(255, 255, 255, 0.8) !important;
  color: #2563eb !important;
  transform: translateX(5px) !important;
  box-shadow: 0 4px 12px rgba(37,99,235,0.1) !important;
}

.sidebar .logout-btn {
  background: rgba(239, 68, 68, 0.1) !important;
  color: #ef4444 !important;
}

.sidebar .logout-btn:hover {
  background: rgba(239, 68, 68, 0.2) !important;
  color: #dc2626 !important;
}

.navbar {
  background: rgba(255, 255, 255, 0.6) !important;
  backdrop-filter: blur(16px) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.8) !important;
  color: #1e293b !important;
  box-shadow: 0 4px 20px rgba(0,0,0,0.02) !important;
}

.navbar h1 {
  color: #1e293b !important;
  font-weight: 700 !important;
  font-size: 1.5rem !important;
}

.time-display {
  background: rgba(255, 255, 255, 0.9) !important;
  color: #2563eb !important;
  border: 1px solid rgba(255, 255, 255, 1) !important;
  box-shadow: 0 4px 12px rgba(37,99,235,0.1) !important;
}

.card, .stat-card, .latest-tap {
  background: rgba(255, 255, 255, 0.65) !important;
  backdrop-filter: blur(16px) !important;
  border: 1px solid rgba(255, 255, 255, 0.8) !important;
  box-shadow: 0 8px 32px rgba(31,38,135,0.05) !important;
  color: #334155 !important;
  transition: transform 0.3s ease, box-shadow 0.3s ease !important;
}

.card:hover, .stat-card:hover {
  transform: translateY(-4px) !important;
  box-shadow: 0 12px 40px rgba(31,38,135,0.08) !important;
}

.stat-card.hadir { border-left-color: #10b981 !important; }
.stat-card.izin  { border-left-color: #f59e0b !important; }
.stat-card.alpha { border-left-color: #ef4444 !important; }

.stat-value {
  color: #1e293b !important;
}

table th {
  background: rgba(255, 255, 255, 0.8) !important;
  color: #475569 !important;
}

table tr:hover td {
  background: rgba(255, 255, 255, 0.9) !important;
}

button {
  background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%) !important;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3) !important;
  transition: all 0.3s ease !important;
  color: white !important;
}

button:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4) !important;
}

input, select {
  background: rgba(255, 255, 255, 0.7) !important;
  border: 1px solid rgba(255, 255, 255, 0.9) !important;
  transition: all 0.3s ease !important;
}

input:focus, select:focus {
  background: rgba(255, 255, 255, 1) !important;
  border-color: #93c5fd !important;
  box-shadow: 0 0 0 3px rgba(147, 197, 253, 0.4) !important;
  outline: none !important;
}

.latest-tap {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%) !important;
  border-left: 4px solid #3b82f6 !important;
}

.latest-tap h2, .latest-tap p {
  color: #1e293b !important;
}
`;

for (const file of files) {
  const filePath = path.join(cssFolder, file);
  const content = fs.readFileSync(filePath, 'utf8');
  // Avoid appending if already appended
  if (!content.includes('LIGHT GLASSMORPHISM OVERRIDE')) {
    fs.appendFileSync(filePath, '\n' + cssInject);
    console.log('Appended to', file);
  } else {
    console.log('Skipped', file);
  }
}
