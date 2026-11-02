const fs = require('fs');
const path = require('path');
const auditModule = require('../../../scripts/audit-tokens.cjs');

// Test the updated patterns:
const updatedRules = {
  paletteGrays: {
    name: 'Palette Grays & Neutrals',
    pattern: /\b(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|divide(?:-[xy])?|fill|stroke|outline|placeholder|shadow|accent|caret|from|to|via)-(?:gray|slate|zinc|neutral|stone)-\d+\b|\b(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|divide(?:-[xy])?|fill|stroke|outline|shadow|accent|caret)-(?:white|black)\b/g
  },
  hexRgbClasses: {
    name: 'Tailwind Arbitrary Hex/RGB Classes',
    pattern: /\b(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|divide(?:-[xy])?|fill|stroke|outline|accent|caret|from|to|via)-\[(?:#[0-9a-fA-F]{3,8}|rgba?\([^\]]+\))\]|\bshadow-\[[^\]]*(?:#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))[^\]]*\]/g
  },
  rawStatusColors: {
    name: 'Raw Status / Accent Colors',
    pattern: /\b(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|divide(?:-[xy])?|fill|stroke|outline|placeholder|shadow|accent|caret|from|to|via)-(?:red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+\b/g
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
  },
  scopedStyleHexRgb: {
    name: 'Scoped Style Raw Hex/RGB Colors',
    pattern: /#[0-9a-fA-F]{3,8}\b|\brgba?\(\s*\d+/g
  }
};

function getAllFiles(dir, exts = ['.vue', '.ts', '.js', '.css']) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(fullPath, exts));
    } else {
      if (exts.some(ext => file.endsWith(ext))) {
        results.push(fullPath.replace(/\\/g, '/'));
      }
    }
  }
  return results;
}

function auditFileTest(filePath, overrideContent = null) {
  const norm = filePath.replace(/\\/g, '/');
  const content = overrideContent !== null ? overrideContent : fs.readFileSync(norm, 'utf8');
  const lines = content.split(/\r?\n/);
  const violations = [];
  const isIndexCss = norm.endsWith('src/assets/index.css');
  const isVue = norm.endsWith('.vue');
  let inExemptBlock = false;
  let inStyleBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;
    if (line.includes('/* audit-ignore */') || line.includes('<!-- audit-ignore -->')) continue;

    if (isIndexCss) {
      const trimmed = line.trim();
      if (trimmed.startsWith(':root') || trimmed.startsWith('.dark')) inExemptBlock = true;
      if (inExemptBlock) {
        if (trimmed === '}' || trimmed.startsWith('}')) inExemptBlock = false;
        continue;
      }
      if (trimmed.startsWith('--') && trimmed.includes(':')) continue;
    }

    if (isVue) {
      if (line.includes('<style')) inStyleBlock = true;
    }

    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
      if (trimmed.startsWith('//') || (trimmed.startsWith('/*') && trimmed.endsWith('*/')) || trimmed.startsWith('*')) {
        if (isVue && inStyleBlock && line.includes('</style>')) inStyleBlock = false;
        continue;
      }
    }

    for (const [ruleKey, rule] of Object.entries(updatedRules)) {
      if (ruleKey === 'scopedStyleHexRgb' && !inStyleBlock) continue;
      if (ruleKey !== 'scopedStyleHexRgb' && inStyleBlock) continue;

      rule.pattern.lastIndex = 0;
      let match;
      while ((match = rule.pattern.exec(line)) !== null) {
        violations.push({
          line: lineNum,
          rule: ruleKey,
          ruleName: rule.name,
          match: match[0],
          snippet: line.trim()
        });
      }
    }

    if (isVue && inStyleBlock && line.includes('</style>')) {
      inStyleBlock = false;
    }
  }

  return { file: norm, violations, total: violations.length };
}

// Test on each batch:
console.log('--- Testing Batches 1 to 7 (Current Codebase) ---');
for (let b = 1; b <= 7; b++) {
  const batch = auditModule.BATCHES[b];
  let files = [];
  if (batch.files) files = files.concat(batch.files);
  if (batch.directory) files = files.concat(getAllFiles(batch.directory, ['.vue', '.ts', '.js']));
  
  let batchViolations = 0;
  const failing = [];
  for (const f of files) {
    const r = auditFileTest(f);
    if (r.total > 0) {
      batchViolations += r.total;
      failing.push(r);
    }
  }
  console.log(`Batch ${b}: ${files.length} files scanned, ${batchViolations} violations found.`);
  if (failing.length > 0) {
    failing.forEach(item => {
      console.log(`  File: ${item.file}`);
      item.violations.forEach(v => console.log(`    Line ${v.line} [${v.rule}]: "${v.match}" -> ${v.snippet.slice(0, 80)}`));
    });
  }
}

console.log('\n--- Testing Simulated Post-Remediation Code ---');
// 1. SettingsView.vue remediation simulation:
let settingsContent = fs.readFileSync('src/views/SettingsView.vue', 'utf8');
settingsContent = settingsContent.replace('shadow-amber-500/5', 'shadow-warning/5');
settingsContent = settingsContent.replace('background: #e2e8f0;', 'background: var(--border);');
settingsContent = settingsContent.replace('background: #cbd5e1;', 'background: var(--muted-foreground);');
const resSettings = auditFileTest('src/views/SettingsView.vue', settingsContent);
console.log(`Remediated SettingsView.vue: ${resSettings.total} violations (Expected: 0)`);

// 2. PartnerProgramView.vue remediation simulation:
let partnerProgContent = fs.readFileSync('src/views/partner/PartnerProgramView.vue', 'utf8');
partnerProgContent = partnerProgContent.replace(/accent-\[#23B750\]/g, 'accent-primary');
const resPartner = auditFileTest('src/views/partner/PartnerProgramView.vue', partnerProgContent);
console.log(`Remediated PartnerProgramView.vue: ${resPartner.total} violations (Expected: 0)`);
