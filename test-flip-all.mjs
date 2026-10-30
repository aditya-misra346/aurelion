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

async function clickCard() {
  await send('Runtime.evaluate', {
    expression: `
      const card = document.querySelector('.perspective-1000');
      if (card) card.click();
    `
  });
  await new Promise(r => setTimeout(r, 700));
}

async function selectCardVariant(index) {
  await send('Runtime.evaluate', {
    expression: `
      // In the variant selector row at bottom of studio
      const swatches = Array.from(document.querySelectorAll('button')).filter(b => b.querySelector('p.font-mono'));
      if (swatches[${index}]) swatches[${index}].click();
    `
  });
  await new Promise(r => setTimeout(r, 400));
}

// 1. Obsidian Front
await capture('test_obsidian_front.png');

// 2. Obsidian Back (Click card to flip)
await clickCard();
await capture('test_obsidian_back.png');

// 3. Obsidian Front again (Click card to flip back)
await clickCard();
await capture('test_obsidian_front_again.png');

// 4. Switch to Champagne Reserve (index 1)
await selectCardVariant(1);
await capture('test_champagne_front.png');

// 5. Champagne Back
await clickCard();
await capture('test_champagne_back.png');

// 6. Switch to Arctic Silver (index 2)
await selectCardVariant(2);
await capture('test_arctic_front.png');

// 7. Arctic Back
await clickCard();
await capture('test_arctic_back.png');

ws.close();
chrome.kill();
process.exit(0);
