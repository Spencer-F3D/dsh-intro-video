// ? Chrome headless shell ????? 1920 ????? 100px ????????
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const chrome = 'node_modules/.remotion/chrome-headless-shell/win64/chrome-headless-shell-win64/chrome-headless-shell.exe';
const files = ['dsh-home.png', 'dsh-workflow-01.png', 'dsh-workflow-02.png'];
for (const f of files) {
  const src = path.resolve('public/assets', f).replace(/\\/g, '/');
  const html = `<html><body style="margin:0;background:#000">
  <div style="position:relative;width:1920px;height:1080px">
    <img src="file:///${src}" style="position:absolute;left:0;top:0;width:1920px">
    <svg width="1920" height="1080" style="position:absolute;left:0;top:0">
      ${Array.from({length:20},(_,i)=>`<line x1="${i*100}" y1="0" x2="${i*100}" y2="1080" stroke="rgba(255,0,0,.45)" stroke-width="1"/>`).join('')}
      ${Array.from({length:11},(_,i)=>`<line x1="0" y1="${i*100}" x2="1920" y2="${i*100}" stroke="rgba(255,0,0,.45)" stroke-width="1"/>`).join('')}
      ${Array.from({length:20},(_,i)=>`<text x="${i*100+4}" y="20" fill="#ff0" font-size="16" font-family="monospace">${i*100}</text>`).join('')}
      ${Array.from({length:11},(_,i)=>`<text x="4" y="${i*100+18}" fill="#ff0" font-size="16" font-family="monospace">${i*100}</text>`).join('')}
    </svg>
  </div></body></html>`;
  const htmlPath = path.resolve('out/check/grid.html');
  fs.writeFileSync(htmlPath, html, 'utf8');
  const outFile = 'out/check/grid-' + f.replace('.png', '.png');
  spawnSync(chrome, ['--headless', '--disable-gpu', '--allow-file-access-from-files', '--hide-scrollbars',
    '--screenshot=' + path.resolve(outFile), '--window-size=1920,1080', 'file:///' + htmlPath.replace(/\\/g, '/')],
    { stdio: 'ignore' });
  console.log('grid:', outFile, fs.existsSync(outFile) ? fs.statSync(outFile).size : 'FAILED');
}
