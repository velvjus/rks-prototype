import { spawn } from 'child_process';
import fs from 'fs';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9350;

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
    browserProc.kill();
    return;
  }

  const targetRes = await fetch(`http://127.0.0.1:${port}/json/new?http://localhost:5173/partner/referrals`, { method: 'PUT' });
  const targetData = await targetRes.json();
  const ws = new WebSocket(targetData.webSocketDebuggerUrl);

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

  await send('Runtime.evaluate', {
    expression: `(() => {
      localStorage.setItem('rks_partner_track', 'sales');
      window.location.reload();
    })()`
  });
  await new Promise(r => setTimeout(r, 1500));

  // 1. Capture clean resting board
  const snapResting = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_draggable_kanban.png', Buffer.from(snapResting.data, 'base64'));
  console.log('Saved scratch/snap_draggable_kanban.png');

  // 2. Trigger dragging state to display Bottom Action Dock
  await send('Runtime.evaluate', {
    expression: `(() => {
      // Find first draggable card
      const card = document.querySelector('[draggable="true"]');
      if (card) {
        // Dispatch dragstart
        const dt = new DataTransfer();
        const ev = new DragEvent('dragstart', { dataTransfer: dt, bubbles: true });
        card.dispatchEvent(ev);
      }
    })()`
  });
  await new Promise(r => setTimeout(r, 400));

  const snapDock = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_drag_bottom_dock.png', Buffer.from(snapDock.data, 'base64'));
  console.log('Saved scratch/snap_drag_bottom_dock.png');

  // 3. Open pop-up modal to verify Mark Lost & Archive buttons
  await send('Runtime.evaluate', {
    expression: `(() => {
      const card = document.querySelector('[draggable="true"]');
      if (card) {
        card.dispatchEvent(new DragEvent('dragend', { bubbles: true }));
      }
      const cardTitle = document.querySelector('h4');
      if (cardTitle) cardTitle.click();
    })()`
  });
  await new Promise(r => setTimeout(r, 600));

  const snapModal = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_modal_with_actions.png', Buffer.from(snapModal.data, 'base64'));
  console.log('Saved scratch/snap_modal_with_actions.png');

  ws.close();
  browserProc.kill();
}

run().catch(console.error);
