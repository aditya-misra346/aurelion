// Connect to Chrome via DevTools protocol to flip card and take screenshot
import http from 'node:http';
import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
  '--headless',
  '--remote-debugging-port=9222',
  '--disable-gpu',
  '--window-size=1280,900',
  'http://localhost:5173/cards'
]);

await new Promise(r => setTimeout(r, 2000));

// Query JSON endpoints
const targets = await fetch('http://localhost:9222/json').then(r => r.json());
const page = targets.find(t => t.type === 'page');

if (!page) {
  console.error('No page target found');
  chrome.kill();
  process.exit(1);
}

const ws = new WebSocket(page.webSocketDebuggerUrl);

function send(method, params = {}) {
  return new Promise((resolve) => {
    const id = Math.floor(Math.random() * 100000);
    const handler = (evt) => {
      const data = JSON.parse(evt.data);
      if (data.id === id) {
        ws.removeEventListener('message', handler);
        resolve(data.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

await new Promise(r => ws.onopen = r);

// Wait 1s for page load
await new Promise(r => setTimeout(r, 1000));

// Click the "Flip" button
await send('Runtime.evaluate', {
  expression: `
    const btns = Array.from(document.querySelectorAll('button'));
    const flipBtn = btns.find(b => b.textContent && b.textContent.includes('Flip'));
    if (flipBtn) flipBtn.click();
  `
});

// Wait 700ms for 3D flip animation to finish
await new Promise(r => setTimeout(r, 700));

// Take screenshot of flipped state
const { data } = await send('Page.captureScreenshot', { format: 'png' });
fs.writeFileSync('/Users/aditya/.gemini/antigravity/brain/c2a20268-54d8-4789-ace5-fd86844c8ac0/cards_flipped_current.png', Buffer.from(data, 'base64'));

console.log('Flipped screenshot captured');
ws.close();
chrome.kill();
process.exit(0);
