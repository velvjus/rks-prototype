const ngrok = require('ngrok');

(async () => {
  try {
    const url = await ngrok.connect(5173);
    console.log('NGROK_URL=' + url);
    console.log('ngrok tunnel is running. Press Ctrl+C to stop.');
    // Keep process alive
    process.stdin.resume();
  } catch (e) {
    console.error('Error:', e.message || e);
    process.exit(1);
  }
})();
