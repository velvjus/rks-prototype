import { spawn } from 'child_process';
import fs from 'fs';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9347;

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
  await send('DOM.enable');
  await send('CSS.enable');
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

  // Find exact card coordinates for "Klang Valley Retailers Consortium"
  const coords = await send('Runtime.evaluate', {
    expression: `(() => {
      const cards = Array.from(document.querySelectorAll('.group'));
      console.log('Total group elements:', cards.length);
      const card = cards.find(c => c.textContent.includes('Klang Valley'));
      if (card) {
        const r = card.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2, width: r.width, height: r.height };
      }
      return null;
    })()`,
    returnByValue: true
  });
  console.log('Target card coords:', coords.result.value);

  if (coords.result.value) {
    // Dispatch mouse moved over the card
    await send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: Math.round(coords.result.value.x),
      y: Math.round(coords.result.value.y)
    });
    await new Promise(r => setTimeout(r, 600));
  }

  const snapHover = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_kanban_forced_hover.png', Buffer.from(snapHover.data, 'base64'));
  console.log('Saved scratch/snap_kanban_forced_hover.png');

  ws.close();
  browserProc.kill();
}

run().catch(console.error);
