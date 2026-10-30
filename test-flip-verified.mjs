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

async function toggleFlip() {
  const res = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const btn = btns.find(b => b.innerText.includes('Flip') || b.innerText.includes('Front'));
        if (btn) {
          const oldText = btn.innerText;
          btn.click();
          return 'Clicked button with text: ' + oldText;
        }
        return 'Not found';
      })()
    `,
    returnByValue: true
  });
  console.log('toggleFlip result:', res.value);
  await new Promise(r => setTimeout(r, 800));
}

async function selectCard(idx) {
  const res = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const swatches = Array.from(document.querySelectorAll('button')).filter(b => b.querySelector('p.font-mono'));
        if (swatches[${idx}]) {
          swatches[${idx}].click();
          return 'Selected swatch ' + ${idx};
        }
        return 'Swatch not found';
      })()
    `,
    returnByValue: true
  });
  console.log('selectCard result:', res.value);
  await new Promise(r => setTimeout(r, 500));
}

// 1. Initial Obsidian Front
await capture('v2_obsidian_1_front.png');

// 2. Flip to Obsidian Back
await toggleFlip();
await capture('v2_obsidian_2_back.png');

// 3. Flip back to Obsidian Front
await toggleFlip();
await capture('v2_obsidian_3_front.png');

// 4. Switch to Champagne Reserve
await selectCard(1);
await capture('v2_champagne_1_front.png');

// 5. Flip to Champagne Back
await toggleFlip();
await capture('v2_champagne_2_back.png');

// 6. Flip back to Champagne Front
await toggleFlip();
await capture('v2_champagne_3_front.png');

// 7. Switch to Arctic Silver
await selectCard(2);
await capture('v2_arctic_1_front.png');

// 8. Flip to Arctic Back
await toggleFlip();
await capture('v2_arctic_2_back.png');

ws.close();
chrome.kill();
process.exit(0);
