// extract the list of ionic icons used in the project  
// and copy them to the svg directory
// This is used by the vite-plugin-static-copy plugin
// to copy the icons to the dist directory during build
import fs from 'fs';
import path from 'path';

const SRC_DIR = './src';

const jsxRegex = /<ion-icon\s+[^>]*name=["']([\w-]+)["']/g;
const mithrilRegex = /m\(\s*["']ion-icon["']\s*,\s*{[^}]*name\s*:\s*["']([\w-]+)["']/g;

const usedIcons = [];

function scanDirectory(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      scanDirectory(fullPath);
   } else if (/\.(js|ts|jsx|tsx|html)$/.test(file)) {
      const content = fs.readFileSync(fullPath, 'utf-8');

      let match;
       while ((match = jsxRegex.exec(content)) !== null) {
        usedIcons.push(match[1]);
      }
      while ((match = mithrilRegex.exec(content)) !== null) {
        usedIcons.push(match[1]);
      }
    }
  });
}
export default function extractIcons(source, dst) {
  scanDirectory(SRC_DIR);
  return usedIcons.map(name => ({
    src: `${source}/${name}.svg`,
    dest: dst
  }));
}