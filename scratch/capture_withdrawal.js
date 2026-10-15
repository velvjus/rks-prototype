import { spawn } from 'child_process';
import fs from 'fs';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9338;

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

  const targetRes = await fetch(`http://127.0.0.1:${port}/json/new?http://localhost:5173/partner/withdrawal`, { method: 'PUT' });
  const targetData = await targetRes.json();
  const pageWsUrl = targetData.webSocketDebuggerUrl;

  const { WebSocket } = await import('ws');
  const ws = new WebSocket(pageWsUrl);

  let id = 1;
  const send = (method, params = {}) => {
    return new Promise((resolve) => {
      const msgId = id++;
      const handler = (data) => {
        const msg = JSON.parse(data.toString());
        if (msg.id === msgId) {
          ws.off('message', handler);
          resolve(msg.result);
        }
      };
      ws.on('message', handler);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  };

  await new Promise(r => ws.on('open', r));

  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1280,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  // Ensure Referral Track
  await send('Runtime.evaluate', {
    expression: `(() => {
      localStorage.setItem('rks_partner_track', 'referral');
      window.location.reload();
    })()`
  });
  await new Promise(r => setTimeout(r, 1200));

  // 1. Referral Track Tab 1
  const snapReferral = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_referral_cashier.png', Buffer.from(snapReferral.data, 'base64'));
  console.log('Saved scratch/snap_referral_cashier.png');

  // Switch to Sales Track
  await send('Runtime.evaluate', {
    expression: `(() => {
      localStorage.setItem('rks_partner_track', 'sales');
      window.location.reload();
    })()`
  });
  await new Promise(r => setTimeout(r, 1200));

  // 2. Sales Track Tab 1 (Auto-remittance console)
  const snapSalesRemittance = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_sales_remittance.png', Buffer.from(snapSalesRemittance.data, 'base64'));
  console.log('Saved scratch/snap_sales_remittance.png');

  // 3. Sales Track Tab 2 (Statements ledger)
  await send('Runtime.evaluate', {
    expression: `(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const histBtn = btns.find(b => b.textContent.includes('Remittance Ledger') || b.textContent.includes('History'));
      if (histBtn) histBtn.click();
    })()`
  });
  await new Promise(r => setTimeout(r, 500));
  const snapSalesHistory = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_sales_history.png', Buffer.from(snapSalesHistory.data, 'base64'));
  console.log('Saved scratch/snap_sales_history.png');

  ws.close();
  browserProc.kill();
}

run().catch(console.error);
