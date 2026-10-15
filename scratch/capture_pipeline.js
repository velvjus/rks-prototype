import { spawn } from 'child_process';
import fs from 'fs';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9345;

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

  const targetRes = await fetch(`http://127.0.0.1:${port}/json/new?http://localhost:5173/partner/referrals`, { method: 'PUT' });
  const targetData = await targetRes.json();
  const pageWsUrl = targetData.webSocketDebuggerUrl;

  const ws = new WebSocket(pageWsUrl);

  let id = 1;
  const send = (method, params = {}) => {
    return new Promise((resolve) => {
      const msgId = id++;
      const handler = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id === msgId) {
          ws.removeEventListener('message', handler);
          resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  };

  await new Promise(r => ws.addEventListener('open', r, { once: true }));

  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1340,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  // Ensure Sales Track
  await send('Runtime.evaluate', {
    expression: `(() => {
      localStorage.setItem('rks_partner_track', 'sales');
      window.location.reload();
    })()`
  });
  await new Promise(r => setTimeout(r, 1500));

  // 1. Capture Sales Kanban (Resting State: Clean untruncated names)
  const snapKanban = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_sales_kanban.png', Buffer.from(snapKanban.data, 'base64'));
  console.log('Saved scratch/snap_sales_kanban.png');

  // 2. Click Advance on first deal to trigger Undo Toast
  await send('Runtime.evaluate', {
    expression: `(() => {
      // Find advance button in first column
      const advanceBtn = document.querySelector('button[title="Advance to Discovery & Demo"]');
      if (advanceBtn) advanceBtn.click();
    })()`
  });
  await new Promise(r => setTimeout(r, 600));

  const snapUndoToast = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_undo_toast.png', Buffer.from(snapUndoToast.data, 'base64'));
  console.log('Saved scratch/snap_undo_toast.png');

  // 3. Click first card to open modal with stage dropdown
  await send('Runtime.evaluate', {
    expression: `(() => {
      const card = document.querySelector('h4');
      if (card) card.click();
    })()`
  });
  await new Promise(r => setTimeout(r, 600));

  const snapModal = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_deal_popup_modal.png', Buffer.from(snapModal.data, 'base64'));
  console.log('Saved scratch/snap_deal_popup_modal.png');

  ws.close();
  browserProc.kill();
}

run().catch(console.error);
