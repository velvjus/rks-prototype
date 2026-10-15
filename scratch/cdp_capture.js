import { spawn } from 'child_process';
import fs from 'fs';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9333;

async function run() {
  const browserProc = spawn(edgePath, [
    `--remote-debugging-port=${port}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank'
  ]);

  // Wait for edge CDP to be ready
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

  console.log('Connected to Edge CDP:', wsUrl);

  // Create a new target/page
  const targetRes = await fetch(`http://127.0.0.1:${port}/json/new?http://localhost:5173/partner/register`, { method: 'PUT' });
  const targetData = await targetRes.json();
  const pageWsUrl = targetData.webSocketDebuggerUrl;

  const ws = new WebSocket(pageWsUrl);

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

  // Set iPhone mobile viewport
  await send('Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 812,
    deviceScaleFactor: 2,
    mobile: true,
    screenOrientation: { angle: 0, type: 'portraitPrimary' }
  });

  await send('Emulation.setTouchEmulationEnabled', {
    enabled: true,
    maxTouchPoints: 5
  });

  // Wait for page to render
  await new Promise(r => setTimeout(r, 1200));

  // Helper to capture screenshot
  async function capture(filename) {
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(shot.data, 'base64');
    const path = `C:\\Users\\justi\\.gemini\\antigravity\\brain\\02db9c75-0e82-4b42-9cb5-8b4755838089\\${filename}`;
    fs.writeFileSync(path, buffer);
    console.log(`Saved: ${filename}`);
  }

  // 1. Capture Step 1 Mobile
  await capture('mobile_step1_cdp.png');

  // Helper to evaluate script
  async function evaluate(expression) {
    return await send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true
    });
  }

  // Click "Continue to Track Selection"
  await evaluate(`
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Continue to Track Selection'));
    if (btn) btn.click();
  `);
  await new Promise(r => setTimeout(r, 600));

  // 2. Capture Step 2 Track Selection Mobile
  await capture('mobile_step2_track_cdp.png');

  // Click Sales Partner to open modal
  await evaluate(`
    const cards = Array.from(document.querySelectorAll('[role="button"]'));
    const salesCard = cards.find(c => c.textContent.includes('Sales Partner'));
    if (salesCard) salesCard.click();
  `);
  await new Promise(r => setTimeout(r, 600));

  // 3. Capture Friendly Modal on Mobile
  await capture('mobile_modal_cdp.png');

  // Click Continue on Referral Track in modal
  await evaluate(`
    const contBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Continue on Referral Track'));
    if (contBtn) contBtn.click();
  `);
  await new Promise(r => setTimeout(r, 500));

  // Continue to Step 3 Form
  await evaluate(`
    const nextBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Continue as Referral Partner'));
    if (nextBtn) nextBtn.click();
  `);
  await new Promise(r => setTimeout(r, 600));

  // 4. Capture Step 3 Form Mobile
  await capture('mobile_step3_form_cdp.png');

  ws.close();
  browserProc.kill();
  console.log('Finished capturing all mobile steps!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
