#!/usr/bin/env node

/**
 * Independent Adversarial Token Compliance Scanner
 * Milestone 2: App Shell & UI Components (Batches 1 & 2)
 */

const fs = require('fs');
const path = require('path');

const targetFiles = [
  'src/layouts/MainLayout.vue',
  'src/components/layout/AppShell.vue',
  'src/components/layout/Sidebar.vue',
  'src/components/layout/SidebarItem.vue',
  'src/components/layout/SecondaryPanel.vue',
  'src/components/layout/TopNav.vue',
  'src/components/omnichannel/InboxDropdown.vue',
  'src/components/omnichannel/ToastNotifications.vue',
  'src/components/ui/button/index.ts',
  'src/components/ui/alert/index.ts',
  'src/components/ui/alert-dialog/AlertDialogContent.vue',
  'src/components/ui/dialog/DialogContent.vue',
  'src/components/ui/dialog/DialogScrollContent.vue',
  'src/components/ui/drawer/DrawerOverlay.vue',
  'src/components/ui/sheet/SheetContent.vue',
  'src/components/ui/chart/index.ts'
];

const patterns = [
  {
    name: 'Raw Hex Color',
    // Matches #123, #1234, #123456, #12345678, but not href="#" or anchor fragments like #section
    regex: /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})\b/g,
    filter: (match, line) => {
      // Ignore if inside an import or asset path or url fragment
      if (line.includes('href="#"')) return false;
      return true;
    }
  },
  {
    name: 'Raw Palette Grays / Neutrals',
    regex: /\b(?:bg|text|border|ring|divide|fill|stroke|placeholder|from|to|via)-(?:gray|slate|zinc|neutral|stone)-(?:50|100|200|300|400|500|600|700|800|900|950)\b|\b(?:bg|text|border|ring|divide|fill|stroke|outline)-(?:white|black)\b/g
  },
  {
    name: 'Dark Mode Override (dark:)',
    regex: /\bdark:(?:[a-zA-Z0-9_\-\[\]#:\/]+)\b/g
  },
  {
    name: 'Raw Status / Accent Colors',
    regex: /\b(?:bg|text|border|ring|divide|fill|stroke|placeholder|from|to|via)-(?:red|green|emerald|blue|sky|indigo|purple|violet|amber|yellow|orange|rose|teal|cyan|lime|fuchsia|pink)-(?:50|100|200|300|400|500|600|700|800|900|950)\b/g
  },
  {
    name: 'Arbitrary Hex/RGB Class',
    regex: /\b(?:bg|text|border|ring|divide|fill|stroke|outline|from|to|via)-\[(?:#[0-9a-fA-F]{3,8}|rgba?\([^\]]+\))\]/g
  },
  {
    name: 'Inline RGB/RGBA Style',
    regex: /rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+(?:\s*,\s*[\d.]+%?)?\s*\)/g
  }
];

let totalViolations = 0;
const results = [];

console.log('='.repeat(70));
console.log('ADVERSARIAL STRESS TEST: TOKEN COMPLIANCE SCANNER');
console.log('='.repeat(70));

for (const relPath of targetFiles) {
  const fullPath = path.resolve(relPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`ERROR: Target file not found: ${relPath}`);
    totalViolations++;
    continue;
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split(/\r?\n/);
  const fileViolations = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    // Skip comments
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || (trimmed.startsWith('/*') && trimmed.endsWith('*/')) || (trimmed.startsWith('<!--') && trimmed.endsWith('-->'))) {
      continue;
    }

    for (const rule of patterns) {
      rule.regex.lastIndex = 0;
      let match;
      while ((match = rule.regex.exec(line)) !== null) {
        if (rule.filter && !rule.filter(match[0], line)) {
          continue;
        }
        fileViolations.push({
          line: lineNum,
          rule: rule.name,
          match: match[0],
          snippet: trimmed
        });
      }
    }
  }

  if (fileViolations.length > 0) {
    console.log(`\n❌ VIOLATIONS IN: ${relPath} (${fileViolations.length})`);
    for (const v of fileViolations) {
      console.log(`   Line ${v.line}: [${v.rule}] "${v.match}" -> ${v.snippet.slice(0, 80)}`);
    }
    totalViolations += fileViolations.length;
  } else {
    console.log(`✔ PASS: ${relPath}`);
  }
}

console.log('\n' + '='.repeat(70));
if (totalViolations === 0) {
  console.log(`VERDICT: 100% CLEAN. 0 violations found across all ${targetFiles.length} files.`);
  process.exit(0);
} else {
  console.log(`VERDICT: FAILED. Found ${totalViolations} violations.`);
  process.exit(1);
}
