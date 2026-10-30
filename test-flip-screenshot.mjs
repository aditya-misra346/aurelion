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
await new Promise(r => setTimeout(r, 1000));

async function capture(filename) {
  const { data } = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`/Users/aditya/.gemini/antigravity/brain/c2a20268-54d8-4789-ace5-fd86844c8ac0/${filename}`, Buffer.from(data, 'base64'));
  console.log(`Saved ${filename}`);
}

// 1. Capture initial front face
await capture('card_test_1_front.png');

// 2. Click Flip
await send('Runtime.evaluate', {
  expression: `
    const btns = Array.from(document.querySelectorAll('button'));
    const flipBtn = btns.find(b => b.textContent && b.textContent.includes('Flip'));
    if (flipBtn) flipBtn.click();
  `
});
await new Promise(r => setTimeout(r, 700));

// 3. Capture back face
await capture('card_test_2_back.png');

// 4. Click Front (flip back)
await send('Runtime.evaluate', {
  expression: `
    const btns = Array.from(document.querySelectorAll('button'));
    const frontBtn = btns.find(b => b.textContent && b.textContent.includes('Front'));
    if (frontBtn) frontBtn.click();
  `
});
await new Promise(r => setTimeout(r, 700));

// 5. Capture front face again
await capture('card_test_3_front_again.png');

ws.close();
chrome.kill();
process.exit(0);
