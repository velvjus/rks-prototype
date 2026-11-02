const fs = require('fs');
const { BATCHES } = require('../scripts/audit-tokens.cjs');

const RULES = {
  paletteGrays: /\b(?:bg|text|border|ring|divide|fill|stroke|outline|placeholder|from|to|via)-(?:gray|slate|zinc|neutral|stone)-(?:50|100|200|300|400|500|600|700|800|900|950)\b|\b(?:bg|text|border|ring|divide|fill|stroke|outline)-(?:white|black)\b/g,
  hexRgbClasses: /\b(?:bg|text|border|ring|divide|fill|stroke|outline|from|to|via)-\[(?:#[0-9a-fA-F]{3,8}|rgba?\([^\]]+\))\]/g,
  rawStatusColors: /\b(?:bg|text|border|ring|divide|fill|stroke|outline|placeholder|from|to|via)-(?:red|green|emerald|blue|sky|indigo|purple|violet|amber|yellow|orange|rose)-(?:50|100|200|300|400|500|600|700|800|900|950)\b/g,
  darkOverrides: /\bdark:(?:bg|text|border|ring|fill|stroke|divide|from|to|via|placeholder|shadow)-[^\s"'>]+|\bdark:(?:[a-zA-Z0-9_\-\[\]#:\/]+)\b/g,
  inlineHexStyles: /(?:style|:style)\s*=\s*(?:"[^"]*(?:#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))[^"]*"|'[^']*(?:#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))[^']*')/g
};

const counts = {};
const perCategory = { paletteGrays: 0, hexRgbClasses: 0, rawStatusColors: 0, darkOverrides: 0, inlineHexStyles: 0 };
const perFile = {};

BATCHES[4].files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  perFile[file] = { total: 0, byRule: {} };
  for (const [rName, reg] of Object.entries(RULES)) {
    reg.lastIndex = 0;
    let m;
    while ((m = reg.exec(content)) !== null) {
      counts[m[0]] = (counts[m[0]] || 0) + 1;
      perCategory[rName]++;
      perFile[file].total++;
      perFile[file].byRule[rName] = (perFile[file].byRule[rName] || 0) + 1;
    }
  }
});

console.log('=== PER FILE SUMMARY ===');
for (const [f, d] of Object.entries(perFile)) {
  console.log(`${f}: ${d.total}`);
  for (const [r, c] of Object.entries(d.byRule)) {
    console.log(`   ${r}: ${c}`);
  }
}

console.log('\n=== TOTAL PER CATEGORY ===');
console.log(perCategory);

console.log('\n=== TOP 40 VIOLATION TOKENS IN BATCH 4 ===');
const sorted = Object.entries(counts).sort((a,b) => b[1] - a[1]);
sorted.slice(0, 45).forEach(([tok, cnt]) => {
  console.log(`${tok.padEnd(25)} : ${cnt}`);
});
