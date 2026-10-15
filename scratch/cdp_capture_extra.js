import { spawn } from 'child_process';
import fs from 'fs';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9334;

async function run() {
  const browserProc = spawn(edgePath, [
    `--remote-debugging-port=${port}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank'
  ]);

  let wsUrl = null;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 200));
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      const data = await res.json();
      wsUrl = data.webSocketDebuggerUrl;
      break;
    } catch (e) {}
  }

  if (!wsUrl) {
    console.error('Failed to get CDP wsUrl');
    browserProc.kill();
    return;
  }

  const targetRes = await fetch(`http://127.0.0.1:${port}/json/new?http://localhost:5173/partner/register`, { method: 'PUT' });
  const targetData = await targetRes.json();
  const ws = new WebSocket(targetData.webSocketDebuggerUrl);

  let idCounter = 1;
  const pending = new Map();

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(msg.error);
      else resolve(msg.result);
    }
  };

  const send = (method, params = {}) => {
    return new Promise((resolve, reject) => {
      const id = idCounter++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  };

  await new Promise(r => ws.onopen = r);
  await send('Page.enable');
  await send('DOM.enable');

  await send('Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 812,
    deviceScaleFactor: 2,
    mobile: true,
    screenOrientation: { angle: 0, type: 'portraitPrimary' }
  });

  await new Promise(r => setTimeout(r, 1000));

  async function capture(filename) {
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(shot.data, 'base64');
    const path = `C:\\Users\\justi\\.gemini\\antigravity\\brain\\02db9c75-0e82-4b42-9cb5-8b4755838089\\${filename}`;
    fs.writeFileSync(path, buffer);
    console.log(`Saved: ${filename}`);
  }

  async function evaluate(expression) {
    return await send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true
    });
  }

  // Go to step 3 new partner
  await evaluate(`
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Continue to Track Selection'));
    if (btn) btn.click();
  `);
  await new Promise(r => setTimeout(r, 400));
  await evaluate(`
    const nextBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Continue as Referral Partner'));
    if (nextBtn) nextBtn.click();
  `);
  await new Promise(r => setTimeout(r, 500));

  // Scroll down to the bottom of the section
  await evaluate(`
    const scrollContainer = document.querySelector('.overflow-y-auto') || document.documentElement;
    scrollContainer.scrollTop = scrollContainer.scrollHeight;
  `);
  await new Promise(r => setTimeout(r, 600));

  await capture('mobile_step3_bottom_cdp.png');

  // Now reload and test Existing Account flow
  await send('Page.navigate', { url: 'http://localhost:5173/partner/register' });
  await new Promise(r => setTimeout(r, 1000));

  // Click Link Existing Account card
  await evaluate(`
    const cards = Array.from(document.querySelectorAll('[role="button"]'));
    const existCard = cards.find(c => c.textContent.includes('Link Existing Account'));
    if (existCard) existCard.click();
  `);
  await new Promise(r => setTimeout(r, 400));

  // Click continue to Link CRM Account
  await evaluate(`
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Continue to Link CRM Account'));
    if (btn) btn.click();
  `);
  await new Promise(r => setTimeout(r, 500));

  await capture('mobile_existing_step2_cdp.png');

  ws.close();
  browserProc.kill();
  console.log('Finished capturing additional mobile states!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
