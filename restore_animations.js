const fs = require('fs');
const path = require('path');

const cssFolder = path.join(__dirname, 'cssFolder');
const publicDir = path.join(__dirname, 'public');

const filesToFix = fs.readdirSync(cssFolder)
  .filter(f => f.endsWith('.css'))
  .map(f => path.join(cssFolder, f));

filesToFix.push(path.join(publicDir, 'login.html'));

for (const filePath of filesToFix) {
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf8');

  // Remove the broken leftover keyframes
  content = content.replace(/\s*50%\s*\{\s*background-position:[^\}]+\}\s*100%\s*\{\s*background-position:[^\}]+\}\s*\}/g, '');
  
  // Also clean up any lingering 'animation: gradientBG...' just in case
  content = content.replace(/animation:\s*gradientBG[^;]+;?/g, '');

  if (filePath.endsWith('login.html') || filePath.endsWith('login.css')) {
    // Add back the animation to body
    content = content.replace(/background-size:\s*400%\s*400%;/, 'background-size: 400% 400%;\n      animation: gradientBG 15s ease infinite;');
    
    // Add back the keyframe block right before .config-container
    if (!content.includes('@keyframes gradientBG')) {
      content = content.replace(/\.config-container/, `@keyframes gradientBG {\n      0% { background-position: 0% 50%; }\n      50% { background-position: 100% 50%; }\n      100% { background-position: 0% 50%; }\n    }\n\n    .config-container`);
    }
  } else {
    // Other admin CSS files
    content = content.replace(/background-size:\s*400%\s*400%\s*!important;/, 'background-size: 400% 400% !important;\n  animation: gradientBG 15s ease infinite !important;');
    
    if (!content.includes('@keyframes gradientBG')) {
      content += `\n@keyframes gradientBG {\n  0% { background-position: 0% 50%; }\n  50% { background-position: 100% 50%; }\n  100% { background-position: 0% 50%; }\n}\n`;
    }
  }

  fs.writeFileSync(filePath, content);
  console.log('Restored animation in', path.basename(filePath));
}
