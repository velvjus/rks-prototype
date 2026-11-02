const fs = require('fs');

const RULES = {
  paletteGrays: {
    name: 'Palette Grays & Neutrals',
    pattern: /\b(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|divide(?:-[xy])?|fill|stroke|outline|placeholder|from|to|via)-(?:gray|slate|zinc|neutral|stone)-\d+\b|\b(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|divide(?:-[xy])?|fill|stroke|outline)-(?:white|black)\b/g
  },
  hexRgbClasses: {
    name: 'Tailwind Arbitrary Hex/RGB Classes',
    pattern: /\b(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|divide(?:-[xy])?|fill|stroke|outline|from|to|via)-\[(?:#[0-9a-fA-F]{3,8}|rgba?\([^\]]+\))\]|\bshadow-\[[^\]]*(?:#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))[^\]]*\]/g
  },
  rawStatusColors: {
    name: 'Raw Status / Accent Colors',
    pattern: /\b(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|divide(?:-[xy])?|fill|stroke|outline|placeholder|from|to|via)-(?:red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+\b/g
  }
};

const testCases = [
  // Should match hexRgbClasses:
  { text: 'border-t-[#23B750]', expectRule: 'hexRgbClasses' },
  { text: 'hover:border-t-[#23B750]', expectRule: 'hexRgbClasses' },
  { text: 'shadow-[0_0_24px_rgba(35,183,80,0.28)]', expectRule: 'hexRgbClasses' },
  { text: 'shadow-[0_18px_42px_-8px_rgba(15,23,42,0.16),0_4px_12px_-2px_rgba(15,23,42,0.06)]', expectRule: 'hexRgbClasses' },
  { text: 'shadow-[0_4px_12px_#23B750]', expectRule: 'hexRgbClasses' },
  { text: 'border-b-[#ff0000]', expectRule: 'hexRgbClasses' },
  { text: 'divide-x-[#123456]', expectRule: 'hexRgbClasses' },

  // Should match rawStatusColors:
  { text: 'bg-pink-100', expectRule: 'rawStatusColors' },
  { text: 'bg-cyan-500', expectRule: 'rawStatusColors' },
  { text: 'text-lime-600', expectRule: 'rawStatusColors' },
  { text: 'border-fuchsia-400', expectRule: 'rawStatusColors' },
  { text: 'border-t-teal-300', expectRule: 'rawStatusColors' },
  { text: 'divide-y-pink-200', expectRule: 'rawStatusColors' },
  { text: 'text-red-500', expectRule: 'rawStatusColors' },

  // Should match paletteGrays:
  { text: 'border-gray-150', expectRule: 'paletteGrays' },
  { text: 'hover:text-gray-655', expectRule: 'paletteGrays' },
  { text: 'border-gray-350', expectRule: 'paletteGrays' },
  { text: 'border-gray-255', expectRule: 'paletteGrays' },
  { text: 'text-gray-505', expectRule: 'paletteGrays' },
  { text: 'text-gray-550', expectRule: 'paletteGrays' },
  { text: 'border-gray-155', expectRule: 'paletteGrays' },
  { text: 'border-t-gray-200', expectRule: 'paletteGrays' },
  { text: 'divide-y-slate-100', expectRule: 'paletteGrays' },
  { text: 'bg-white', expectRule: 'paletteGrays' },
  { text: 'text-black', expectRule: 'paletteGrays' },

  // Should NOT match any rule:
  { text: 'bg-primary', expectRule: null },
  { text: 'bg-card', expectRule: null },
  { text: 'text-foreground', expectRule: null },
  { text: 'border-border', expectRule: null },
  { text: 'border-t-primary', expectRule: null },
  { text: 'border-input', expectRule: null },
  { text: 'bg-warning/10', expectRule: null },
  { text: 'border-warning/30', expectRule: null },
  { text: 'ring-3 ring-primary/25', expectRule: null },
  { text: 'shadow-lg shadow-primary/25', expectRule: null },
  { text: 'shadow-md', expectRule: null },
  { text: 'shadow-none', expectRule: null },
  { text: 'shadow-[0_0_24px_var(--primary)]', expectRule: null },
  { text: 'bg-tag-1', expectRule: null },
  { text: 'bg-tag-6', expectRule: null },
  { text: 'text-tag-2-foreground', expectRule: null },
  { text: 'border-t-tag-3', expectRule: null }
];

let failed = 0;
for (const tc of testCases) {
  let matchedRule = null;
  let matchSnippet = null;
  for (const [key, rule] of Object.entries(RULES)) {
    rule.pattern.lastIndex = 0;
    const m = rule.pattern.exec(tc.text);
    if (m) {
      matchedRule = key;
      matchSnippet = m[0];
      break;
    }
  }

  if (matchedRule !== tc.expectRule) {
    console.error(`FAIL: "${tc.text}" -> expected ${tc.expectRule}, got ${matchedRule} (match: "${matchSnippet}")`);
    failed++;
  } else {
    console.log(`PASS: "${tc.text}" -> ${matchedRule || 'NO MATCH (OK)'}`);
  }
}

if (failed === 0) {
  console.log('\nAll unit test cases PASSED!');
} else {
  console.error(`\n${failed} test cases FAILED!`);
}
