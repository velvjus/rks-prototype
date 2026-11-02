const { auditFile } = require('../../../scripts/audit-tokens.cjs');
const fs = require('fs');
const path = require('path');

const testCases = [
  { name: 'palette gray', line: '<div class="text-gray-500"></div>', expectedRule: 'paletteGrays' },
  { name: 'hex class', line: '<div class="bg-[#abcdef]"></div>', expectedRule: 'hexRgbClasses' },
  { name: 'raw status', line: '<div class="bg-red-500"></div>', expectedRule: 'rawStatusColors' },
  { name: 'dark override', line: '<div class="dark:bg-card"></div>', expectedRule: 'darkOverrides' },
  { name: 'inline style', line: '<div style="color: #123456"></div>', expectedRule: 'inlineHexStyles' },
  { name: 'audit ignore', line: '<div class="text-gray-500"></div> /* audit-ignore */', expectedRule: null }
];

const testFilePath = path.join(__dirname, 'temp_test_fixture.vue');
let allPassed = true;

for (const tc of testCases) {
  fs.writeFileSync(testFilePath, tc.line, 'utf8');
  const res = auditFile(testFilePath);
  if (tc.expectedRule === null) {
    if (res.total !== 0) {
      console.error('FAIL: audit-ignore failed, got violations:', res.violations);
      allPassed = false;
    } else {
      console.log('PASS: audit-ignore ignored violation as expected');
    }
  } else {
    const matched = res.violations.some(v => v.rule === tc.expectedRule);
    if (!matched) {
      console.error('FAIL:', tc.name, 'expected rule', tc.expectedRule, 'got', res.violations);
      allPassed = false;
    } else {
      console.log('PASS:', tc.name, 'detected', tc.expectedRule);
    }
  }
}

if (fs.existsSync(testFilePath)) {
  fs.unlinkSync(testFilePath);
}

if (!allPassed) {
  process.exit(1);
} else {
  console.log('All synthetic rule tests PASSED successfully.');
}
