import { spawn } from 'node:child_process';
import fs from 'node:fs';

const tmpDir = `/tmp/chrome-test-${Date.now()}`;
fs.mkdirSync(tmpDir, { recursive: true });

const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
  '--headless',
  '--remote-debugging-port=9222',
  '--disable-gpu',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1440,960',
  'http://localhost:5173/'
]);

await new Promise(r => setTimeout(r, 2500));

let targets;
for (let i = 0; i < 5; i++) {
  try {
    targets = await fetch('http://localhost:9222/json').then(r => r.json());
    if (targets) break;
  } catch (e) {
    await new Promise(r => setTimeout(r, 1000));
  }
}

const page = targets?.find(t => t.type === 'page');

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

async function setMode(mode) {
  await send('Runtime.evaluate', {
    expression: `
      localStorage.setItem('aurelion_theme', '${mode}');
      if ('${mode}' === 'dark') {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      }
    `
  });
  await new Promise(r => setTimeout(r, 500));
}

async function captureRoute(route, filename) {
  await send('Page.navigate', { url: `http://localhost:5173${route}` });
  await new Promise(r => setTimeout(r, 1500));
  const { data } = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`/Users/aditya/.gemini/antigravity/brain/c2a20268-54d8-4789-ace5-fd86844c8ac0/${filename}`, Buffer.from(data, 'base64'));
  console.log(`Captured ${filename}`);
}

// 1. Capture Light Mode
await setMode('light');
await captureRoute('/', 'light_elevated_home.png');
await captureRoute('/dashboard', 'light_elevated_dashboard.png');
await captureRoute('/cards', 'light_elevated_cards.png');
await captureRoute('/accounts', 'light_elevated_accounts.png');
await captureRoute('/dashboard/transactions', 'light_elevated_transactions.png');

// 2. Capture Dark Mode (to strictly verify zero regressions)
await setMode('dark');
await captureRoute('/', 'dark_verified_home.png');
await captureRoute('/dashboard', 'dark_verified_dashboard.png');
await captureRoute('/cards', 'dark_verified_cards.png');
await captureRoute('/accounts', 'dark_verified_accounts.png');
await captureRoute('/dashboard/transactions', 'dark_verified_transactions.png');

ws.close();
chrome.kill();
console.log('Finished capturing all comparisons');
process.exit(0);
