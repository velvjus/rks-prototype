const { transformFile, TRANSFORMS } = require('../../../scripts/codemod-tokens.cjs');
const { auditFile, RULES } = require('../../../scripts/audit-tokens.cjs');

console.log('Testing codemod regex against hover:bg-[#23B750] and similar variants:');

for (const group of TRANSFORMS) {
  for (const [pattern, repl] of group.rules) {
    const test1 = 'hover:bg-[#23B750]';
    if (pattern.test(test1)) {
      console.log(`Pattern ${pattern} matched ${test1} -> would replace with ${repl}`);
    }
  }
}

// Test audit script against various tricky inputs
console.log('\nTesting audit script RULES:');
const testCases = [
  // 1. Multiple styles on same line or complex styles
  '<div :style="`color: ${val ? \'#111827\' : \'#ffffff\'}`"></div>',
  '<div :style="{ borderColor: \'#EF4444\', backgroundColor: \'#23B750\' }"></div>',
  '<div style="color: #23B750; background-color: rgba(255, 255, 255, 0.8)"></div>',
  // 2. Gradients & outlines
  '<div class="from-red-500 via-amber-400 to-green-500 outline-purple-600"></div>',
  // 3. Dark overrides with modifiers
  '<div class="dark:hover:bg-gray-800 dark:focus:ring-white"></div>',
  // 4. Valid tokens (should not flag)
  '<div class="bg-primary hover:bg-primary/90 text-foreground border-border bg-rail text-tag-1"></div>'
];

for (const tc of testCases) {
  let matched = [];
  for (const [key, rule] of Object.entries(RULES)) {
    rule.pattern.lastIndex = 0;
    let m;
    while ((m = rule.pattern.exec(tc)) !== null) {
      matched.push({ rule: key, match: m[0] });
    }
  }
  console.log(`\nInput: ${tc}`);
  console.log(`Detected ${matched.length} violations:`, matched);
}
