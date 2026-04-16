const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, 'admin');
const files = fs.readdirSync(adminDir).filter(f => f.endsWith('.html'));

const beautifulHeader = `
  <div class="sidebar-header" style="text-align: center; margin-bottom: 25px;">
    <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #3b82f6, #6366f1); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: bold; margin: 0 auto 10px; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);">SS</div>
    <h2 style="font-size: 1.2rem; color: #1e293b !important; margin: 0; font-weight: 700;">Smart <span style="color: #3b82f6;">Saga</span></h2>
    <div id="hello-user" style="font-size: 0.85rem; color: #64748b; font-weight: 500; margin-top: 5px;">Admin Panel</div>
  </div>`;

for (const file of files) {
  const filePath = path.join(adminDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  let updated = content;
  updated = updated.replace(/<h2>Admin Smart Saga<\/h2>/g, beautifulHeader.trim());
  updated = updated.replace(/<h2 id="hello-user">Hello<\/h2>/g, beautifulHeader.trim());

  if (content !== updated) {
    fs.writeFileSync(filePath, updated);
    console.log('Fixed', file);
  }
}
