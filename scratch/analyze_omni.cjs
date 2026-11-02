const fs = require('fs');

const RULES = {
  paletteGrays: /\b(?:bg|text|border|ring|divide|fill|stroke|outline|placeholder|from|to|via)-(?:gray|slate|zinc|neutral|stone)-(?:50|100|200|300|400|500|600|700|800|900|950)\b|\b(?:bg|text|border|ring|divide|fill|stroke|outline)-(?:white|black)\b/g,
  hexRgbClasses: /\b(?:bg|text|border|ring|divide|fill|stroke|outline|from|to|via)-\[(?:#[0-9a-fA-F]{3,8}|rgba?\([^\]]+\))\]/g,
  rawStatusColors: /\b(?:bg|text|border|ring|divide|fill|stroke|outline|placeholder|from|to|via)-(?:red|green|emerald|blue|sky|indigo|purple|violet|amber|yellow|orange|rose)-(?:50|100|200|300|400|500|600|700|800|900|950)\b/g,
  darkOverrides: /\bdark:(?:bg|text|border|ring|fill|stroke|divide|from|to|via|placeholder|shadow)-[^\s"'>]+|\bdark:(?:[a-zA-Z0-9_\-\[\]#:\/]+)\b/g,
  inlineHexStyles: /(?:style|:style)\s*=\s*(?:"[^"]*(?:#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))[^"]*"|'[^']*(?:#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))[^']*')/g
};

const content = fs.readFileSync('src/views/OmnichannelView.vue', 'utf8');
const lines = content.split(/\r?\n/);

const counts = {};
const scriptViolations = [];
const templateViolations = [];

lines.forEach((line, idx) => {
  const lineNum = idx + 1;
  const isScript = lineNum < 1939;
  for (const [rName, reg] of Object.entries(RULES)) {
    reg.lastIndex = 0;
    let m;
    while ((m = reg.exec(line)) !== null) {
      const match = m[0];
      counts[match] = (counts[match] || 0) + 1;
      if (isScript) {
        scriptViolations.push({ lineNum, rule: rName, match, line: line.trim() });
      } else {
        templateViolations.push({ lineNum, rule: rName, match, line: line.trim() });
      }
    }
  }
});

console.log('Script violations count:', scriptViolations.length);
console.log('Template violations count:', templateViolations.length);
console.log('\nScript violations breakdown by rule:');
const sByRule = {};
scriptViolations.forEach(v => sByRule[v.rule] = (sByRule[v.rule] || 0) + 1);
console.log(sByRule);

console.log('\nAll script violations:');
scriptViolations.forEach(v => console.log(`Line ${v.lineNum} [${v.rule}] (${v.match}): ${v.line}`));

