#!/usr/bin/env node

/**
 * Challenger 1 (Milestone 3 Iteration 2): Deep Adversarial Stress Test Suite
 * Exhaustively stress-tests:
 *  1. Remediated Files Verification (DealsView, EventsView, OmnichannelView)
 *  2. Directional border classes (border-t-, border-b-, border-l-, border-r-, border-x-, border-y-, border-s-, border-e-)
 *  3. Non-standard numeric gray/status classes (gray-150, gray-255, gray-350, gray-505, gray-550, gray-655, emerald-350, amber-605, blue-605, etc.)
 *  4. All 17 Tailwind non-gray palette colors (red, orange, amber, yellow, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, pink, rose)
 *  5. Arbitrary shadow RGBA and hex syntax (shadow-[...rgba(...)...], shadow-[...#...])
 *  6. Inline hex/RGB styles in <template>
 *  7. Dark mode class overrides (dark:...) across all Batches 1, 3, 4
 *  8. Vue Template & Style raw hex scan (#...) across Batches 3 & 4
 *  9. Batch 2 (UI Components, 349 files) broad adversarial scan
 * 10. Code Hygiene: Malformed double-slash opacity modifiers (e.g. bg-muted/40/90)
 */

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
      'src/components/ui/ToastNotifications.vue',
      'src/components/layout/UserNav.vue'
    ]
  },
  3: {
    name: 'Batch 3 (CRM Core)',
    files: [
      'src/views/DashboardView.vue',
      'src/views/DealsView.vue',
      'src/views/ContactsView.vue',
      'src/components/omnichannel/ContactDrawer.vue',
      'src/components/omnichannel/FiltersModal.vue',
      'src/views/CompaniesView.vue',
      'src/views/CalendarView.vue',
      'src/views/EventsView.vue'
    ]
  },
  4: {
    name: 'Batch 4 (Omnichannel)',
    files: [
      'src/views/OmnichannelView.vue',
      'src/components/omnichannel/ConversationItem.vue',
      'src/components/omnichannel/OmnichannelTutorialModal.vue',
      'src/components/omnichannel/TemplatePickerModal.vue',
      'src/views/webforms/ManageTemplatesView.vue',
      'src/components/omnichannel/PlatformIcon.vue'
    ]
  }
};

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;
const failureDetails = [];
const advisoryFindings = [];

function assert(condition, testName, details = null) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  \x1b[32m✔ PASS:\x1b[0m ${testName}`);
  } else {
    failedChecks++;
    console.error(`  \x1b[31m✖ FAIL:\x1b[0m ${testName}`);
    if (details) {
      console.error(`    Details: ${JSON.stringify(details, null, 2)}`);
      failureDetails.push({ testName, details });
    }
  }
}

console.log('='.repeat(80));
console.log('CHALLENGER 1 (M3 ITERATION 2): DEEP ADVERSARIAL STRESS TEST');
console.log('='.repeat(80));

// ---------------------------------------------------------------------------
// SUITE 1: Targeted Stress Testing on Remediated Files (DealsView, EventsView, OmnichannelView)
// ---------------------------------------------------------------------------
console.log('\n[Suite 1] Explicit Verification of Remediated Files against Previous Residual Violations');

const remediatedFiles = {
  'src/views/DealsView.vue': [
    { name: 'Residual bg-pink-100', pattern: /\bbg-pink-100\b/g },
    { name: 'Residual border-t-[#23B750]', pattern: /border-t-\[#23B750\]/g },
    { name: 'Residual border-gray-150', pattern: /\bborder-gray-150\b/g },
    { name: 'Residual border-gray-155', pattern: /\bborder-gray-155\b/g },
    { name: 'Residual border-gray-255', pattern: /\bborder-gray-255\b/g },
    { name: 'Residual border-gray-350', pattern: /\bborder-gray-350\b/g },
    { name: 'Residual text-gray-505', pattern: /\btext-gray-505\b/g },
    { name: 'Residual text-gray-550', pattern: /\btext-gray-550\b/g },
    { name: 'Residual hover:text-gray-655', pattern: /\bhover:text-gray-655\b/g },
    { name: 'Residual text-amber-605', pattern: /\btext-amber-605\b/g },
    { name: 'Residual text-blue-605', pattern: /\btext-blue-605\b/g },
    { name: 'Residual border-emerald-250', pattern: /\bborder-emerald-250\b/g },
    { name: 'Residual text-red-505', pattern: /\btext-red-505\b/g },
    { name: 'Residual double opacity bg-destructive/10/85', pattern: /bg-destructive\/10\/85/g },
    { name: 'Residual double opacity bg-success/10/40', pattern: /bg-success\/10\/40/g },
    { name: 'Arbitrary shadow in Won dropzone', pattern: /shadow-\[0_0_50px_rgba\(34,197,94/g },
    { name: 'Arbitrary shadow in Lost dropzone', pattern: /shadow-\[0_0_50px_rgba\(239,68,68/g },
    { name: 'Arbitrary shadow in Dock', pattern: /shadow-\[0_18px_42px/g },
    { name: 'Arbitrary hover shadow', pattern: /hover:shadow-\[0_8px_20px_rgba\(35,183,80/g }
  ],
  'src/views/EventsView.vue': [
    { name: 'Residual bg-cyan-500', pattern: /\bbg-cyan-500\b/g },
    { name: 'Residual bg-emerald-350', pattern: /\bbg-emerald-350\b/g },
    { name: 'Residual text-gray-550', pattern: /\btext-gray-550\b/g },
    { name: 'Residual shadow-emerald-500', pattern: /shadow-emerald-500/g },
    { name: 'Residual shadow-red-500', pattern: /shadow-red-500/g }
  ],
  'src/views/OmnichannelView.vue': [
    { name: 'Residual malformed double opacity bg-muted/40/20', pattern: /bg-muted\/40\/20/g },
    { name: 'Residual arbitrary border in composer', pattern: /border-\[#\w+\]/g }
  ]
};

for (const [filePath, checks] of Object.entries(remediatedFiles)) {
  const content = fs.readFileSync(path.resolve(filePath), 'utf8');
  for (const chk of checks) {
    const matches = content.match(chk.pattern);
    assert(!matches || matches.length === 0, `${filePath}: ${chk.name} eliminated`, matches);
  }
}

// ---------------------------------------------------------------------------
// SUITE 2: Directional Border Classes Adversarial Scan
// ---------------------------------------------------------------------------
console.log('\n[Suite 2] Directional Border Adversarial Stress Test (border-[trblxyse]-*)');

const directionalBorderAdversarialRegex = /\b(?:hover:|focus:|active:|group-hover:)?border-(?:[trblxyse]|t|r|b|l|x|y|s|e)-(?:(?:gray|slate|zinc|neutral|stone)-\d+|(?:red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+|white|black|\[(?:#[0-9a-fA-F]{3,8}|rgba?\([^\]]+\))\])\b/g;

for (const [bId, batch] of Object.entries(BATCHES)) {
  for (const relPath of batch.files) {
    const fullPath = path.resolve(relPath);
    if (!fs.existsSync(fullPath)) continue;
    const content = fs.readFileSync(fullPath, 'utf8');
    const matches = [];
    let m;
    while ((m = directionalBorderAdversarialRegex.exec(content)) !== null) {
      matches.push(m[0]);
    }
    assert(matches.length === 0, `[${batch.name}] ${relPath}: 0 directional border violations`, matches);
  }
}

// ---------------------------------------------------------------------------
// SUITE 3: Non-Standard Numeric Palette Steps Stress Test
// ---------------------------------------------------------------------------
console.log('\n[Suite 3] Non-Standard Numeric Palette Steps (e.g. 150, 155, 250, 255, 350, 505, 550, 605, 655)');

const allPalettes = 'gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose';
const propertyPrefixes = 'bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|divide(?:-[xy])?|fill|stroke|outline|placeholder|from|to|via|accent|caret|shadow';

const nonStandardNumericRegex = new RegExp(
  `\\b(?:(?:${propertyPrefixes})-(?:${allPalettes})-(?!50\\b|100\\b|200\\b|300\\b|400\\b|500\\b|600\\b|700\\b|800\\b|900\\b|950\\b)\\d+)\\b`,
  'g'
);

for (const [bId, batch] of Object.entries(BATCHES)) {
  for (const relPath of batch.files) {
    const fullPath = path.resolve(relPath);
    if (!fs.existsSync(fullPath)) continue;
    const content = fs.readFileSync(fullPath, 'utf8');
    const matches = [];
    let m;
    while ((m = nonStandardNumericRegex.exec(content)) !== null) {
      matches.push(m[0]);
    }
    assert(matches.length === 0, `[${batch.name}] ${relPath}: 0 non-standard numeric palette steps`, matches);
  }
}

// ---------------------------------------------------------------------------
// SUITE 4: All 17 Tailwind Non-Gray Palette Colors (Comprehensive)
// ---------------------------------------------------------------------------
console.log('\n[Suite 4] All 17 Tailwind Non-Gray Palette Colors (red, orange, amber, yellow, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, pink, rose)');

const nonGrayPalettesRegex = new RegExp(
  `\\b(?:(?:${propertyPrefixes})-(?:red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\\d+)\\b`,
  'g'
);

for (const [bId, batch] of Object.entries(BATCHES)) {
  for (const relPath of batch.files) {
    const fullPath = path.resolve(relPath);
    if (!fs.existsSync(fullPath)) continue;
    const content = fs.readFileSync(fullPath, 'utf8');
    const matches = [];
    let m;
    while ((m = nonGrayPalettesRegex.exec(content)) !== null) {
      matches.push(m[0]);
    }
    assert(matches.length === 0, `[${batch.name}] ${relPath}: 0 non-gray palette color classes`, matches);
  }
}

// ---------------------------------------------------------------------------
// SUITE 5: Arbitrary Shadow RGBA and Hex Syntax (shadow-[...rgba(...)...])
// ---------------------------------------------------------------------------
console.log('\n[Suite 5] Arbitrary Shadow RGBA and Hex Syntax (shadow-[...])');

const arbitraryShadowColorRegex = /\b(?:hover:|focus:|group-hover:)?shadow-\[[^\]]*(?:#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))[^\]]*\]/g;

for (const [bId, batch] of Object.entries(BATCHES)) {
  for (const relPath of batch.files) {
    const fullPath = path.resolve(relPath);
    if (!fs.existsSync(fullPath)) continue;
    const content = fs.readFileSync(fullPath, 'utf8');
    const matches = [];
    let m;
    while ((m = arbitraryShadowColorRegex.exec(content)) !== null) {
      matches.push(m[0]);
    }
    assert(matches.length === 0, `[${batch.name}] ${relPath}: 0 arbitrary shadow RGBA/Hex classes`, matches);
  }
}

// ---------------------------------------------------------------------------
// SUITE 6: Inline Hex/RGB Styles in <template>
// ---------------------------------------------------------------------------
console.log('\n[Suite 6] Inline Hex/RGB Styles in <template> and <style>');

const inlineHexRegex = /style=.*?(?:#[0-9a-fA-F]{3,8}|rgba?\()/;

for (const [bId, batch] of Object.entries(BATCHES)) {
  for (const relPath of batch.files) {
    const fullPath = path.resolve(relPath);
    if (!fs.existsSync(fullPath)) continue;
    const lines = fs.readFileSync(fullPath, 'utf8').split(/\r?\n/);
    const violations = [];
    lines.forEach((l, i) => {
      if (inlineHexRegex.test(l)) violations.push({ line: i + 1, snippet: l.trim() });
    });
    assert(violations.length === 0, `[${batch.name}] ${relPath}: 0 inline hex/rgb styles`, violations);
  }
}

// ---------------------------------------------------------------------------
// SUITE 7: Dark Mode Class Overrides (dark:...) across Batches 1, 3, 4
// ---------------------------------------------------------------------------
console.log('\n[Suite 7] Dark Mode Class Overrides (dark:...) Scan');

const darkOverrideRegex = /\bdark:(?:bg|text|border|ring|fill|stroke|divide|from|to|via|placeholder|shadow)-[^\s"'>]+|\bdark:(?:[a-zA-Z0-9_\-\[\]#:\/]+)\b/g;

for (const [bId, batch] of Object.entries(BATCHES)) {
  for (const relPath of batch.files) {
    const fullPath = path.resolve(relPath);
    if (!fs.existsSync(fullPath)) continue;
    const content = fs.readFileSync(fullPath, 'utf8');
    const matches = [];
    let m;
    while ((m = darkOverrideRegex.exec(content)) !== null) {
      matches.push(m[0]);
    }
    assert(matches.length === 0, `[${batch.name}] ${relPath}: 0 dark: class overrides`, matches);
  }
}

// ---------------------------------------------------------------------------
// SUITE 8: Vue Template & Style Raw Hex Analysis across Batches 3 & 4
// ---------------------------------------------------------------------------
console.log('\n[Suite 8] Template and Style Block Raw Hex Verification (#...)');

const hexRegex = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})\b/g;
const batch34Files = [...BATCHES[3].files, ...BATCHES[4].files];

for (const relPath of batch34Files) {
  const fullPath = path.resolve(relPath);
  const content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split(/\r?\n/);

  let currentBlock = 'none';
  const templateViolations = [];
  const styleViolations = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    if (line.includes('<script')) currentBlock = 'script';
    else if (line.includes('</script>')) { currentBlock = 'none'; continue; }
    else if (line.includes('<template')) currentBlock = 'template';
    else if (line.includes('</template>')) { currentBlock = 'none'; continue; }
    else if (line.includes('<style')) currentBlock = 'style';
    else if (line.includes('</style>')) { currentBlock = 'none'; continue; }

    const trimmed = line.trim();
    if (trimmed.startsWith('//') || (trimmed.startsWith('/*') && trimmed.endsWith('*/')) || (trimmed.startsWith('<!--') && trimmed.endsWith('-->'))) {
      continue;
    }

    hexRegex.lastIndex = 0;
    let match;
    while ((match = hexRegex.exec(line)) !== null) {
      if (line.includes('href="#"') || line.includes("href='#'")) continue;
      const idx = match.index;
      if (idx > 0 && line[idx - 1] === '&') continue;

      if (currentBlock === 'template') {
        templateViolations.push({ line: lineNum, hex: match[0], snippet: trimmed });
      } else if (currentBlock === 'style') {
        styleViolations.push({ line: lineNum, hex: match[0], snippet: trimmed });
      }
    }
  }

  assert(templateViolations.length === 0, `${relPath}: template has 0 raw hex values`, templateViolations);
  assert(styleViolations.length === 0, `${relPath}: <style> has 0 raw hex values`, styleViolations);
}

// ---------------------------------------------------------------------------
// SUITE 9: Batch 2 (UI Components) Broad Regex Verification
// ---------------------------------------------------------------------------
console.log('\n[Suite 9] Batch 2 (UI Components) Broad Regex Verification');

function getAllVueAndTsFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const f of list) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results = results.concat(getAllVueAndTsFiles(full));
    } else if (f.endsWith('.vue') || f.endsWith('.ts')) {
      results.push(full);
    }
  }
  return results;
}

const batch2Files = getAllVueAndTsFiles(path.resolve('src/components/ui'));
console.log(`  Scanned ${batch2Files.length} files in src/components/ui`);

let batch2DirectionalViolations = 0;
let batch2NonGrayViolations = 0;
let batch2ShadowViolations = 0;
let batch2DarkViolations = 0;

for (const f of batch2Files) {
  const content = fs.readFileSync(f, 'utf8');
  if (directionalBorderAdversarialRegex.test(content)) batch2DirectionalViolations++;
  if (nonGrayPalettesRegex.test(content)) batch2NonGrayViolations++;
  if (arbitraryShadowColorRegex.test(content)) batch2ShadowViolations++;
  if (darkOverrideRegex.test(content)) batch2DarkViolations++;
}

assert(batch2DirectionalViolations === 0, `Batch 2 (349 UI files) has 0 directional border violations (found ${batch2DirectionalViolations})`);
assert(batch2NonGrayViolations === 0, `Batch 2 (349 UI files) has 0 non-gray palette violations (found ${batch2NonGrayViolations})`);
assert(batch2ShadowViolations === 0, `Batch 2 (349 UI files) has 0 arbitrary shadow color violations (found ${batch2ShadowViolations})`);
assert(batch2DarkViolations === 0, `Batch 2 (349 UI files) has 0 dark: class overrides (found ${batch2DarkViolations})`);

// ---------------------------------------------------------------------------
// SUITE 10: Code Hygiene (Advisory): Malformed Double-Slash Opacity Classes
// ---------------------------------------------------------------------------
console.log('\n[Suite 10] Code Hygiene (Advisory): Malformed Double Opacity Classes (e.g. token/10/40)');

const malformedDoubleOpacityRegex = /\b(?:bg|text|border|ring|divide)-[a-zA-Z0-9_-]+\/\d+\/\d+\b/g;

for (const [bId, batch] of Object.entries(BATCHES)) {
  for (const relPath of batch.files) {
    const fullPath = path.resolve(relPath);
    if (!fs.existsSync(fullPath)) continue;
    const lines = fs.readFileSync(fullPath, 'utf8').split(/\r?\n/);
    lines.forEach((l, i) => {
      let m;
      while ((m = malformedDoubleOpacityRegex.exec(l)) !== null) {
        advisoryFindings.push({
          file: relPath,
          line: i + 1,
          match: m[0],
          snippet: l.trim()
        });
      }
    });
  }
}

if (advisoryFindings.length > 0) {
  console.log(`  ℹ ADVISORY: Found ${advisoryFindings.length} malformed double-slash opacity class remnants (syntax ignored by Tailwind, non-blocking for theme tokens):`);
  for (const adv of advisoryFindings) {
    console.log(`    - ${adv.file}:${adv.line}: "${adv.match}" in: ${adv.snippet}`);
  }
} else {
  console.log(`  ✔ 0 double-slash opacity class remnants found.`);
}

console.log('\n' + '='.repeat(80));
console.log(`CORE HARDENED ADVERSARIAL CHECKS: ${totalChecks} | PASSED: ${passedChecks} | FAILED: ${failedChecks}`);
console.log('='.repeat(80));

if (failedChecks > 0) {
  console.error('\nFAILED TESTS SUMMARY:');
  for (const fail of failureDetails) {
    console.error(`- ${fail.testName}:`, fail.details);
  }
  process.exit(1);
} else {
  console.log('\n\x1b[32m✔ ALL CORE ADVERSARIAL STRESS TESTS PASSED WITH ZERO VIOLATIONS.\x1b[0m\n');
  process.exit(0);
}
