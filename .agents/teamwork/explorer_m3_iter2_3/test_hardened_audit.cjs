const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '../../../');
const auditScriptPath = path.join(projectRoot, 'scripts/audit-tokens.cjs');
const { BATCHES } = require(auditScriptPath);

// Fully Hardened Proposed Rules
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

function auditFileWithRules(filePath, rules) {
  const norm = normalizePath(filePath);
  if (!fs.existsSync(norm)) {
    return { file: norm, error: 'File not found', violations: [], total: 0 };
  }

  const content = fs.readFileSync(norm, 'utf8');
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
      if (trimmed.startsWith(':root') || trimmed.startsWith('.dark')) {
        inExemptBlock = true;
      }
      if (inExemptBlock) {
        if (trimmed === '}' || trimmed.startsWith('}')) {
          inExemptBlock = false;
        }
        continue;
      }
      if (trimmed.startsWith('--') && trimmed.includes(':')) {
        continue;
      }
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

  return {
    file: norm,
    violations,
    total: violations.length
  };
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

console.log('Testing Fully Hardened Rules against Batches 1, 2, 3, 4:');
for (const b of [1, 2, 3, 4]) {
  const files = getBatchFiles(b);
  let batchViolations = 0;
  const failingFiles = [];
  for (const f of files) {
    const res = auditFileWithRules(f, PROPOSED_RULES);
    if (res.total > 0) {
      batchViolations += res.total;
      failingFiles.push(res);
    }
  }
  console.log(`\nBatch ${b} (${files.length} files): ${batchViolations} violations`);
  for (const ff of failingFiles) {
    const relPath = path.relative(projectRoot, ff.file);
    console.log(`  File: ${relPath} (${ff.total} violations)`);
    for (const v of ff.violations) {
      console.log(`    L${v.line} [${v.ruleName}] ${v.match} -> ${v.snippet.slice(0, 90)}`);
    }
  }
}
