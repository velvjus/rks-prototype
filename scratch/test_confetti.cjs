// Test harness for getConfettiColors simulation
function testConfetti(computedColorResponses) {
  for (const resp of computedColorResponses) {
    const match = resp.match(/\d+/g);
    let hex = null;
    if (match && match.length >= 3) {
      const [r, g, b] = match.map(Number);
      hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    }
    console.log(`Input: "${resp}" -> match: ${JSON.stringify(match)} -> hex: ${hex}`);
  }
}

testConfetti([
  'rgb(35, 183, 80)',
  'rgb(16, 185, 129)',
  'rgb(59, 130, 246)',
  'rgba(35, 183, 80, 1)',
  'color(srgb 0.137 0.717 0.313)', // edge case: if browser returns color(srgb)
  '', // empty string
  'none'
]);
