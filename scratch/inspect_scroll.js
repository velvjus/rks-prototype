import { spawn } from 'child_process';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9336;

async function run() {
  const proc = spawn(edgePath, ['--remote-debugging-port=' + port, '--headless=new', 'about:blank']);
  await new Promise(r => setTimeout(r, 1000));
  const res = await fetch('http://127.0.0.1:' + port + '/json/new?http://localhost:5173/partner/register', { method: 'PUT' });
  const data = await res.json();
  const ws = new WebSocket(data.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);
  let id = 1;
  const send = (method, params = {}) => new Promise(resolve => {
    const cur = id++;
    const handler = (e) => {
      const m = JSON.parse(e.data);
      if (m.id === cur) { ws.removeEventListener('message', handler); resolve(m.result); }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: cur, method, params }));
  });
  await send('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 2, mobile: true });
  await new Promise(r => setTimeout(r, 1000));

  // Navigate to step 3
  await send('Runtime.evaluate', {
    expression: `(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const cont = btns.find(b => b.textContent.includes('Continue to Track Selection'));
      if (cont) cont.click();
    })()`
  });
  await new Promise(r => setTimeout(r, 500));

  await send('Runtime.evaluate', {
    expression: `(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const cont = btns.find(b => b.textContent.includes('Continue as Referral Partner'));
      if (cont) cont.click();
    })()`
  });
  await new Promise(r => setTimeout(r, 500));

  const scrollInfo = await send('Runtime.evaluate', {
    expression: `(() => {
      const els = Array.from(document.querySelectorAll('*'));
      const scrollable = els.filter(el => el.scrollHeight > el.clientHeight && el.clientHeight > 0).map(el => ({
        tag: el.tagName,
        id: el.id,
        cls: el.className,
        scrollHeight: el.scrollHeight,
        clientHeight: el.clientHeight,
        scrollTop: el.scrollTop
      }));
      return {
        windowHeight: window.innerHeight,
        bodyScrollHeight: document.body.scrollHeight,
        docScrollHeight: document.documentElement.scrollHeight,
        docScrollTop: document.documentElement.scrollTop,
        scrollable
      };
    })()`,
    returnByValue: true
  });
  console.log(JSON.stringify(scrollInfo.result.value, null, 2));

  proc.kill();
  process.exit(0);
}

run().catch(console.error);
