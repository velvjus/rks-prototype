const fs = require('fs');
const path = require('path');

const BATCHES = {
  1: {
    name: 'Batch 1 (App Shell)',
    files: [
      'src/layouts/MainLayout.vue',
      'src/components/layout/AppShell.vue',
      'src/components/layout/Sidebar.vue',
      'src/components/layout/SidebarItem.vue',
      'src/components/layout/SecondaryPanel.vue',
      'src/components/layout/TopNav.vue',
      'src/components/omnichannel/InboxDropdown.vue',
      'src/components/omnichannel/ToastNotifications.vue',
      'src/App.vue'
    ]
  },
  2: {
    name: 'Batch 2 (UI Components)',
    directory: 'src/components/ui'
  }
};

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

function auditFile(filePath) {
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

    for (const [ruleKey, rule] of Object.entries(RULES)) {
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

let totalViolations = 0;

for (const [batchNum, batch] of Object.entries(BATCHES)) {
  console.log(`\n========================================`);
  console.log(`Testing Hardened Audit on ${batch.name}`);
  console.log(`========================================`);
  let filesToScan = [];
  if (batch.files) {
    filesToScan = filesToScan.concat(batch.files);
  }
  if (batch.directory) {
    filesToScan = filesToScan.concat(getAllFiles(batch.directory));
  }

  let batchViolations = 0;
  for (const f of filesToScan) {
    const res = auditFile(f);
    if (res.total > 0) {
      console.log(`\n❌ ${res.file} (${res.total} violations):`);
      for (const v of res.violations) {
        console.log(`   Line ${v.line} [${v.rule}]: ${v.match}  -->  ${v.snippet}`);
      }
      batchViolations += res.total;
    } else {
      console.log(`✔ ${res.file} (0 violations)`);
    }
  }
  console.log(`Batch ${batchNum} Total Violations: ${batchViolations}`);
  totalViolations += batchViolations;
}

console.log(`\nGrand Total Violations in Batches 1 & 2: ${totalViolations}`);
if (totalViolations === 0) {
  console.log('SUCCESS: ZERO false positives across all Batch 1 & Batch 2 files!');
} else {
  console.error('FAILURE: False positives found!');
}
