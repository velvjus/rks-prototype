const fs = require('fs');
const path = require('path');

const files = [
  'src/views/webforms/FormBuilderView.vue',
  'src/views/webforms/WebFormsDashboardView.vue',
  'src/views/webforms/FormDetailView.vue',
  'src/views/webforms/SubmissionsView.vue',
  'src/views/BookingPagesView.vue',
  'src/views/ScanNameCardView.vue',
  'src/views/AddonsView.vue'
];

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
  },
  darkOverrides: {
    name: 'dark: Class Overrides',
    pattern: /\bdark:(?:bg|text|border|ring|fill|stroke|divide|from|to|via|placeholder|shadow)-[^\s"'>]+|\bdark:(?:[a-zA-Z0-9_\-\[\]#:\/]+)\b/g
  },
  inlineHexStyles: {
    name: 'Inline Hex/RGB Styles',
    pattern: /(?:style|:style)\s*=\s*(?:"[^"]*(?:#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))[^"]*"|'[^']*(?:#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))[^']*')/g
  },
  malformedDoubleOpacity: {
    name: 'Malformed Double Opacity Classes',
    pattern: /\b(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|divide(?:-[xy])?)-[a-zA-Z0-9_-]+\/\d+\/\d+\b/g
  }
};

const results = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split(/\r?\n/);
  const counts = {
    file,
    totalLines: lines.length,
    paletteGrays: 0,
    hexRgbClasses: 0,
    rawStatusColors: 0,
    darkOverrides: 0,
    inlineHexStyles: 0,
    malformedDoubleOpacity: 0,
    total: 0
  };

  const matchesByRule = {
    paletteGrays: new Set(),
    hexRgbClasses: new Set(),
    rawStatusColors: new Set(),
    darkOverrides: new Set(),
    inlineHexStyles: new Set(),
    malformedDoubleOpacity: new Set()
  };

  lines.forEach((line, idx) => {
    if (line.includes('/* audit-ignore */') || line.includes('<!-- audit-ignore -->')) return;
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || (trimmed.startsWith('/*') && trimmed.endsWith('*/')) || trimmed.startsWith('*')) return;

    for (const [key, rule] of Object.entries(RULES)) {
      rule.pattern.lastIndex = 0;
      let m;
      while ((m = rule.pattern.exec(line)) !== null) {
        counts[key]++;
        counts.total++;
        matchesByRule[key].add(m[0]);
      }
    }
  });

  results.push({
    ...counts,
    distinctMatches: {
      paletteGrays: Array.from(matchesByRule.paletteGrays),
      hexRgbClasses: Array.from(matchesByRule.hexRgbClasses),
      rawStatusColors: Array.from(matchesByRule.rawStatusColors),
      darkOverrides: Array.from(matchesByRule.darkOverrides),
      inlineHexStyles: Array.from(matchesByRule.inlineHexStyles),
      malformedDoubleOpacity: Array.from(matchesByRule.malformedDoubleOpacity)
    }
  });
}

console.log(JSON.stringify(results, null, 2));
