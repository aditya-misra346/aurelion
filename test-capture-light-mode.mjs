import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
  '--headless',
  '--remote-debugging-port=9222',
  '--disable-gpu',
  '--window-size=1440,960',
  'http://localhost:5173/'
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

// Set light mode in localStorage and on root element
await send('Runtime.evaluate', {
  expression: `
    localStorage.setItem('aurelion_theme', 'light');
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  `
});

async function captureRoute(route, filename) {
  await send('Page.navigate', { url: `http://localhost:5173${route}` });
  await new Promise(r => setTimeout(r, 1200));
  const { data } = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`/Users/aditya/.gemini/antigravity/brain/c2a20268-54d8-4789-ace5-fd86844c8ac0/${filename}`, Buffer.from(data, 'base64'));
  console.log(`Captured ${filename}`);
}

await captureRoute('/', 'light_mode_home.png');
await captureRoute('/dashboard', 'light_mode_dashboard.png');
await captureRoute('/cards', 'light_mode_cards.png');
await captureRoute('/accounts', 'light_mode_accounts.png');
await captureRoute('/dashboard/transactions', 'light_mode_transactions.png');

ws.close();
chrome.kill();
process.exit(0);
