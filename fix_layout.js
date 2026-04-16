const fs = require('fs');
const path = require('path');

const cssFolder = path.join(__dirname, 'cssFolder');
const publicFolder = path.join(__dirname, 'public');

// Process all CSS files to string-replace animation rules
const cssFiles = fs.readdirSync(cssFolder).filter(f => f.endsWith('.css'));
for (const file of cssFiles) {
  const filePath = path.join(cssFolder, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Remove animation lines
  content = content.replace(/animation:\s*gradientBG[^;]+;?/g, '');
  content = content.replace(/animation:\s*gradientBG[^!]+!important;?/g, '');
  
  // Remove keyframes
  content = content.replace(/@keyframes\s+gradientBG\s*\{[\s\S]*?\}/g, '');

  // Specific layout fix for dashboard grids
  if (file === 'admin.css' || file === 'dashboard.css') {
    if (!content.includes('.main-content > .card')) {
      content += `
/* LAYOUT BUG FIX */
.main-content {
  min-width: 0;
}
.main-content > .card {
  min-width: 0;
  overflow-x: auto;
}
.container {
  overflow-x: hidden;
}
`;
    }
  }

  fs.writeFileSync(filePath, content);
}

// Same for public/login.html
const loginHtml = path.join(publicFolder, 'login.html');
if (fs.existsSync(loginHtml)) {
  let htmlContent = fs.readFileSync(loginHtml, 'utf8');
  htmlContent = htmlContent.replace(/animation:\s*gradientBG[^;]+;?/g, '');
  htmlContent = htmlContent.replace(/@keyframes\s+gradientBG\s*\{[\s\S]*?\}/g, '');
  fs.writeFileSync(loginHtml, htmlContent);
}

console.log('Animation removed and layout patched.');
