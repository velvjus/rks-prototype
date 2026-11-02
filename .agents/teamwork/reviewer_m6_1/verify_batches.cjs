const { execSync } = require('child_process');

console.log('Testing Batches 1 to 9:');
let allPassed = true;
for (let b = 1; b <= 9; b++) {
  try {
    const output = execSync(`node scripts/audit-tokens.cjs --batch ${b}`, { encoding: 'utf8' });
    const success = output.includes('✔ SUCCESS: 0 token violations detected');
    console.log(`Batch ${b}: ${success ? 'PASS' : 'FAIL'}`);
    if (!success) {
      console.log(output);
      allPassed = false;
    }
  } catch (err) {
    console.error(`Batch ${b}: ERROR (exit code ${err.status})`);
    console.error(err.stdout || err.message);
    allPassed = false;
  }
}

console.log('\nTesting DESIGN.md:');
try {
  const dOut = execSync('node scripts/audit-tokens.cjs --file DESIGN.md', { encoding: 'utf8' });
  console.log('DESIGN.md:', dOut.includes('✔ SUCCESS: 0 token violations detected') ? 'PASS' : 'FAIL');
} catch (err) {
  console.error('DESIGN.md: ERROR', err.stdout || err.message);
  allPassed = false;
}

console.log('\nTesting src/data/designSystemGuidelines.ts:');
try {
  const gOut = execSync('node scripts/audit-tokens.cjs --file src/data/designSystemGuidelines.ts', { encoding: 'utf8' });
  console.log('designSystemGuidelines.ts:', gOut.includes('✔ SUCCESS: 0 token violations detected') ? 'PASS' : 'FAIL');
} catch (err) {
  console.error('designSystemGuidelines.ts: ERROR', err.stdout || err.message);
  allPassed = false;
}

console.log('\nAll tests passed:', allPassed);
