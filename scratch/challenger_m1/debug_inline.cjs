const { RULES } = require('../../scripts/audit-tokens.cjs');

const tests = [
  'style="color: #111827"',
  ':style="{ color: \'#23B750\' }"',
  ":style=\"{ background: 'rgba(0,0,0,0.5)' }\"",
  "style='background-color: #EF4444'",
  ':style="{ color: \"#23B750\" }"'
];

tests.forEach((t, i) => {
  RULES.inlineHexStyles.pattern.lastIndex = 0;
  const match = RULES.inlineHexStyles.pattern.exec(t);
  console.log(`Test ${i + 1}: ${t} -> ${match ? 'MATCHED: ' + match[0] : 'FAILED TO MATCH'}`);
});
