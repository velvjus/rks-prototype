import { spawn } from 'child_process';
import fs from 'fs';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9346;

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

  // Find card coordinates for "Klang Valley Retailers Consortium" in Discovery column
  const posRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const titles = Array.from(document.querySelectorAll('h4'));
      const cardTitle = titles.find(t => t.textContent.includes('Klang Valley'));
      if (cardTitle) {
        const card = cardTitle.closest('.group');
        const rect = card.getBoundingClientRect();
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      }
      return null;
    })()`,
    returnByValue: true
  });

  if (posRes.value) {
    // Dispatch mouse movement to trigger hover state
    await send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: posRes.value.x,
      y: posRes.value.y
    });
    await new Promise(r => setTimeout(r, 400));
  }

  const snapHover = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_kanban_hover.png', Buffer.from(snapHover.data, 'base64'));
  console.log('Saved scratch/snap_kanban_hover.png');

  ws.close();
  browserProc.kill();
}

run().catch(console.error);
