const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '../../../');
const { BATCHES } = require(path.join(projectRoot, 'scripts/audit-tokens.cjs'));

const PROPOSED_RULES = {
  paletteGrays: {
    name: 'Palette Grays & Neutrals',
    pattern: /\b(?:bg|text|border(?:-[trblxy])?|ring|divide|fill|stroke|outline|placeholder|from|to|via)-(?:gray|slate|zinc|neutral|stone)-(?:\d{2,3})\b|\b(?:bg|text|border(?:-[trblxy])?|ring|divide|fill|stroke|outline)-(?:white|black)\b/g
  },
  hexRgbClasses: {
    name: 'Tailwind Arbitrary Hex/RGB Classes',
    pattern: /\b(?:bg|text|border(?:-[trblxy])?|ring|divide|fill|stroke|outline|shadow|from|to|via)-\[[^\]]*(?:#[0-9a-fA-F]{3,8}|rgba?\([^\]]+\))[^\]]*\]/g
  },
  rawStatusColors: {
    name: 'Raw Status / Accent Colors',
    pattern: /\b(?:bg|text|border(?:-[trblxy])?|ring|divide|fill|stroke|outline|placeholder|from|to|via)-(?:red|green|emerald|blue|sky|indigo|purple|violet|amber|yellow|orange|rose|pink|cyan|teal|fuchsia|lime)-(?:50|100|200|300|400|500|600|700|800|900|950|\d{2,3})\b/g
  },
  darkOverrides: {
    name: 'dark: Class Overrides',
    pattern: /\bdark:(?:bg|text|border|ring|fill|stroke|divide|from|to|via|placeholder|shadow)-[^\s"'>]+|\bdark:(?:[a-zA-Z0-9_\-\[\]#:\/]+)\b/g
  },
  inlineHexStyles: {
    name: 'Inline Hex/RGB Styles',
    pattern: /(?:style|:style)\s*=\s*(?:"[^"]*(?:#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))[^"]*"|'[^']*(?:#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))[^']*')/g
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

function normalizePath(p) {
  return p.replace(/\\/g, '/');
}

// Function to simulate in-memory fixes for the target files
function getSimulatedContent(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const norm = normalizePath(filePath);

  if (norm.endsWith('src/views/DealsView.vue')) {
    content = content
      .replaceAll('bg-pink-100', 'bg-muted')
      .replaceAll('hover:text-gray-655', 'hover:text-foreground')
      .replaceAll('border-gray-350', 'border-border')
      .replaceAll('border-gray-255', 'border-border')
      .replaceAll('text-gray-505', 'text-muted-foreground')
      .replaceAll('text-amber-605', 'text-warning')
      .replaceAll('text-blue-605', 'text-primary')
      .replaceAll('border border-emerald-250', 'border border-success/30')
      .replaceAll('text-red-505/80', 'text-destructive/80')
      .replaceAll('border-gray-150', 'border-border')
      .replaceAll('text-gray-550', 'text-muted-foreground')
      .replaceAll('border-t-[#23B750]', 'border-t-primary')
      .replaceAll('border-gray-155', 'border-border')
      .replaceAll("hover:shadow-[0_8px_20px_rgba(35,183,80,0.08)]", "hover:shadow-md hover:shadow-primary/10")
      .replaceAll("shadow-[0_18px_42px_-8px_rgba(15,23,42,0.16),0_4px_12px_-2px_rgba(15,23,42,0.06)]", "shadow-2xl")
      .replaceAll("shadow-[0_10px_22px_-4px_rgba(22,134,56,0.35)]", "shadow-lg shadow-success/30")
      .replaceAll("shadow-[0_10px_22px_-4px_rgba(220,38,38,0.35)]", "shadow-lg shadow-destructive/30")
      .replaceAll("shadow-[0_10px_22px_-4px_rgba(30,41,59,0.28)]", "shadow-lg")
      .replaceAll("shadow-[0_14px_32px_-6px_rgba(15,23,42,0.14),0_4px_10px_-2px_rgba(15,23,42,0.06)]", "shadow-xl")
      .replaceAll("shadow-[0_32px_90px_rgba(15,23,42,0.28)]", "shadow-2xl");
  } else if (norm.endsWith('src/views/EventsView.vue')) {
    content = content
      .replaceAll('bg-emerald-350', 'bg-success')
      .replaceAll('bg-cyan-500', 'bg-tag-6')
      .replaceAll('text-gray-550', 'text-muted-foreground');
  } else if (norm.endsWith('src/views/OmnichannelView.vue')) {
    content = content
      .replaceAll("shadow-[0_0_24px_rgba(35,183,80,0.28)]", "shadow-lg shadow-primary/25")
      .replaceAll("bg-[var(--warning)]/20 border-[var(--warning)]", "bg-warning/10 border-warning/30");
  }

  return content;
}

function auditFileSimulated(filePath, rules) {
  const norm = normalizePath(filePath);
  if (!fs.existsSync(norm)) {
    return { file: norm, error: 'File not found', violations: [], total: 0 };
  }

  const content = getSimulatedContent(norm);
  const lines = content.split(/\r?\n/);
  const violations = [];

  const isIndexCss = norm.endsWith('src/assets/index.css');
  let inExemptBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    if (line.includes('/* audit-ignore */') || line.includes('<!-- audit-ignore -->')) {
      continue;
    }

    if (isIndexCss) {
      const trimmed = line.trim();
      if (trimmed.startsWith(':root') || trimmed.startsWith('.dark')) inExemptBlock = true;
      if (inExemptBlock) {
        if (trimmed === '}' || trimmed.startsWith('}')) inExemptBlock = false;
        continue;
      }
      if (trimmed.startsWith('--') && trimmed.includes(':')) continue;
    }

    const trimmed = line.trim();
    if (trimmed.startsWith('//') || (trimmed.startsWith('/*') && trimmed.endsWith('*/')) || trimmed.startsWith('*')) {
      continue;
    }

    for (const [ruleKey, rule] of Object.entries(rules)) {
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
  }

  return { file: norm, violations, total: violations.length };
}

function getBatchFiles(batchNum) {
  const batchDef = BATCHES[batchNum];
  let files = [];
  if (batchDef.files) {
    files = batchDef.files.map(f => path.resolve(projectRoot, f).replace(/\\/g, '/'));
  }
  if (batchDef.directory) {
    const dirFiles = getAllFiles(path.resolve(projectRoot, batchDef.directory));
    files = files.concat(dirFiles);
  }
  return [...new Set(files)];
}

console.log('SIMULATING REMEDIATION ON BATCHES 1, 2, 3, 4:');
let totalAll = 0;
for (const b of [1, 2, 3, 4]) {
  const files = getBatchFiles(b);
  let batchViolations = 0;
  for (const f of files) {
    const res = auditFileSimulated(f, PROPOSED_RULES);
    batchViolations += res.total;
    if (res.total > 0) {
      console.log(`  ✖ Failure in ${f}: ${res.total} violations remaining!`);
      for (const v of res.violations) {
        console.log(`    L${v.line} [${v.ruleName}] ${v.match}`);
      }
    }
  }
  console.log(`Batch ${b} (${files.length} files): ${batchViolations} violations`);
  totalAll += batchViolations;
}
console.log(`\nTOTAL REMAINING VIOLATIONS: ${totalAll}`);
