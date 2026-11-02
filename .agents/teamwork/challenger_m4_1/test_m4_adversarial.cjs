#!/usr/bin/env node

/**
 * Adversarial Verification & Stress Test Suite — Milestone 4 (Batches 5, 6, 7)
 * Agent: challenger_m4_1
 */

const fs = require('fs');
const path = require('path');

const TARGET_FILES = [
  // Batch 5 (Settings - 7 files)
  'src/views/SettingsView.vue',
  'src/components/settings/AIAssistantsTab.vue',
  'src/components/settings/AutomationTab.vue',
  'src/components/settings/AgentsTab.vue',
  'src/components/settings/TeamsTab.vue',
  'src/components/settings/RolesTab.vue',
  'src/components/dashboard/CrmSetupStatusBar.vue',

  // Batch 6 (Forms, Booking & Tools - 7 files)
  'src/views/webforms/FormBuilderView.vue',
  'src/views/webforms/WebFormsDashboardView.vue',
  'src/views/webforms/FormDetailView.vue',
  'src/views/webforms/SubmissionsView.vue',
  'src/views/BookingPagesView.vue',
  'src/views/ScanNameCardView.vue',
  'src/views/AddonsView.vue',

  // Batch 7 (Partner Portal - 8 files)
  'src/views/partner/PartnerReferralsView.vue',
  'src/views/partner/PartnerOverviewView.vue',
  'src/views/partner/PartnerWithdrawalView.vue',
  'src/views/partner/PartnerProgramView.vue',
  'src/views/PartnerRegisterView.vue',
  'src/views/partner/PartnerCommissionsView.vue',
  'src/views/partner/PartnerKitView.vue',
  'src/components/partner/PartnerTrackSwitcher.vue'
];

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;
const failureDetails = [];

function assert(condition, testName, details = '') {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  \x1b[32m✔ PASS:\x1b[0m ${testName}`);
  } else {
    failedChecks++;
    console.error(`  \x1b[31m✖ FAIL:\x1b[0m ${testName}`);
    if (details) {
      console.error(`    ${details}`);
      failureDetails.push({ testName, details });
    }
  }
}

console.log('='.repeat(75));
console.log('ADVERSARIAL STRESS TEST SUITE — MILESTONE 4 (BATCHES 5, 6, 7)');
console.log('Target files count: ' + TARGET_FILES.length);
console.log('='.repeat(75));

// =========================================================================
// SUITE 1: Target File Existence & Accessibility
// =========================================================================
console.log('\n[Suite 1] File Existence & Readability');
for (const relPath of TARGET_FILES) {
  const fullPath = path.resolve(relPath);
  const exists = fs.existsSync(fullPath);
  assert(exists, `File exists: ${relPath}`);
}

// =========================================================================
// SUITE 2: Strict Independent Regex Token Auditing Across All 22 Files
// =========================================================================
console.log('\n[Suite 2] Strict Independent Token & Styling Audits across 22 Files');

const rules = [
  {
    id: 'PALETTE_GRAYS',
    name: 'Raw Palette Grays / Neutrals',
    regex: /\b(?:[a-zA-Z:-]+:)?(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|divide(?:-[xy])?|fill|stroke|outline|placeholder|shadow|accent|caret)-(?:gray|slate|zinc|neutral|stone)-(?:50|100|150|200|250|300|350|400|450|500|550|600|650|700|750|800|850|900|950)\b|\b(?:[a-zA-Z:-]+:)?(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|divide(?:-[xy])?|fill|stroke|outline|shadow|accent|caret)-(?:white|black)\b/g,
    scope: 'all'
  },
  {
    id: 'RAW_STATUS_COLORS',
    name: 'Raw Status / Accent Palette Colors (including shadow-)',
    regex: /\b(?:[a-zA-Z:-]+:)?(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|divide(?:-[xy])?|fill|stroke|outline|placeholder|shadow|accent|caret)-(?:red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|150|200|250|300|350|400|450|500|550|600|650|700|750|800|850|900|950)\b/g,
    scope: 'all'
  },
  {
    id: 'DARK_OVERRIDES',
    name: 'dark: Variant Overrides',
    regex: /\bdark:(?:[a-zA-Z0-9_\-\[\]#:\/]+)\b/g,
    scope: 'all'
  },
  {
    id: 'ARBITRARY_HEX_CLASSES',
    name: 'Arbitrary Hex / RGB Classes (e.g. bg-[#...])',
    regex: /\b(?:[a-zA-Z:-]+)-\[(?:#[0-9a-fA-F]{3,8}|rgba?\([^\]]+\))\]/g,
    scope: 'all'
  },
  {
    id: 'INLINE_HEX_STYLES',
    name: 'Inline Hex / RGB Style Strings in Template',
    regex: /(?:style|:style)\s*=\s*(?:"[^"]*(?:#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))[^"]*"|'[^']*(?:#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))[^']*')/g,
    scope: 'template'
  },
  {
    id: 'DOUBLE_SLASH_OPACITY',
    name: 'Double-Slash Opacity Remnants (e.g. token/10/20)',
    regex: /\b(?:[a-zA-Z0-9_-]+)\/\d+\/\d+\b/g,
    scope: 'all'
  },
  {
    id: 'NON_STANDARD_STEPS',
    name: 'Non-Standard Numeric Steps on Semantic Tokens (e.g. border-border-200)',
    regex: /\b(?:bg|text|border|ring|divide)-(?:card|background|foreground|muted|popover|primary|destructive|success|warning|info|border|input|ring|tag-[1-6])-(?:50|100|150|200|250|300|350|400|450|500|550|600|650|700|750|800|850|900|950)\b/g,
    scope: 'all'
  },
  {
    id: 'ARBITRARY_HEX_SHADOWS',
    name: 'Arbitrary Shadows with Hardcoded Hex / RGB',
    regex: /\bshadow-\[[^\]]*(?:#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))[^\]]*\]/g,
    scope: 'all'
  },
  {
    id: 'SVG_INLINE_HEX',
    name: 'SVG Inline fill/stroke Hex Literals',
    regex: /(?:fill|stroke)\s*=\s*["']#(?:[0-9a-fA-F]{3,8})["']/g,
    scope: 'template'
  }
];

const perFileViolations = {};

for (const relPath of TARGET_FILES) {
  perFileViolations[relPath] = [];
  const fullPath = path.resolve(relPath);
  const content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split(/\r?\n/);

  let currentBlock = 'none';

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

    for (const rule of rules) {
      if (rule.scope === 'template' && currentBlock !== 'template') continue;

      rule.regex.lastIndex = 0;
      let match;
      while ((match = rule.regex.exec(line)) !== null) {
        // Exclude stroke-width, stroke-linecap, stroke-linejoin, etc.
        if (match[0].includes('stroke-width') || match[0].includes('stroke-linecap') || match[0].includes('stroke-linejoin')) continue;

        perFileViolations[relPath].push({
          line: lineNum,
          block: currentBlock,
          rule: rule.name,
          match: match[0],
          snippet: trimmed
        });
      }
    }
  }

  const vCount = perFileViolations[relPath].length;
  assert(
    vCount === 0,
    `${relPath} — 0 strict token violations`,
    vCount > 0 ? perFileViolations[relPath].map(v => `L${v.line} [${v.block}] ${v.rule}: "${v.match}" in: ${v.snippet}`).join('\n    ') : ''
  );
}

// =========================================================================
// SUITE 3: Architectural Integrity & Verification of Worker Claims
// =========================================================================
console.log('\n[Suite 3] Verification of Worker Claims & Edge-Case Integrity');

// 3.1 PartnerRegisterView: Claim that logo uses useTheme() with :src="isDark ? darkLogoUrl : lightLogoUrl"
const regContent = fs.readFileSync(path.resolve('src/views/PartnerRegisterView.vue'), 'utf8');
const usesUseTheme = regContent.includes('useTheme');
const bindsIsDarkLogo = regContent.includes(':src="isDark ?') || regContent.includes(':src="isDark?');
assert(
  usesUseTheme && bindsIsDarkLogo,
  'PartnerRegisterView fulfills worker claim: uses useTheme() and binds logo dynamically via isDark',
  `usesUseTheme: ${usesUseTheme}, bindsIsDarkLogo: ${bindsIsDarkLogo}. Worker claimed in handoff: "logo bound to isDark ? darkLogoUrl : lightLogoUrl", but file retains raw SVG paths.`
);

// 3.2 PartnerRegisterView: Scoped scrollbar token check
const hasBorderVar = regContent.includes('var(--border)');
const hasMutedVar = regContent.includes('var(--muted-foreground)');
assert(hasBorderVar && hasMutedVar, 'PartnerRegisterView scrollbars use CSS variables (--border, --muted-foreground)');

// 3.3 SettingsView: Toast notification raw status color check
const settingsContent = fs.readFileSync(path.resolve('src/views/SettingsView.vue'), 'utf8');
const hasShadowAmber = settingsContent.includes('shadow-amber-500');
assert(
  !hasShadowAmber,
  'SettingsView line 2112 uses semantic shadow token instead of shadow-amber-500/5',
  'Found shadow-amber-500/5 on line 2112. Expected: shadow-warning/5 or similar semantic token.'
);

// 3.4 FormBuilderView: Drag / Drop & Palette Classes Check
const formBuilderContent = fs.readFileSync(path.resolve('src/views/webforms/FormBuilderView.vue'), 'utf8');
const hasRawBuilderColors = /bg-gray-[0-9]+|border-gray-[0-9]+|text-gray-[0-9]+/.test(formBuilderContent);
assert(!hasRawBuilderColors, 'FormBuilderView has no residual gray-* classes in drag/builder canvas');

// 3.5 SettingsView: Modal & Backdrop Overlay Check
const hasGrayBackdrop = /bg-gray-950\/(?:40|50|60|70|80)|bg-black\/(?:40|50|60|70|80)/.test(settingsContent);
assert(!hasGrayBackdrop, 'SettingsView does not contain hardcoded raw dark backdrops (bg-gray-950/* or bg-black/*)');

// 3.6 AIAssistantsTab & AutomationTab Tag/Status Semantic Mapping Check
const aiTabContent = fs.readFileSync(path.resolve('src/components/settings/AIAssistantsTab.vue'), 'utf8');
const autoTabContent = fs.readFileSync(path.resolve('src/components/settings/AutomationTab.vue'), 'utf8');
const aiHasSemanticBadges = aiTabContent.includes('bg-success/') || aiTabContent.includes('text-success');
const autoHasSemanticBadges = autoTabContent.includes('bg-success/') || autoTabContent.includes('text-success');
assert(aiHasSemanticBadges, 'AIAssistantsTab utilizes semantic status tokens for active states');
assert(autoHasSemanticBadges, 'AutomationTab utilizes semantic status tokens for active states');

// 3.7 BookingPagesView Calendar / Time-slots Semantic Tokens
const bookingContent = fs.readFileSync(path.resolve('src/views/BookingPagesView.vue'), 'utf8');
const bookingHasPaletteGrays = /\b(?:bg|text|border)-(?:gray|slate|zinc)-\d+\b/.test(bookingContent);
assert(!bookingHasPaletteGrays, 'BookingPagesView calendar and time slot selectors contain zero palette grays');

// 3.8 ScanNameCardView Camera / Upload Box Semantic Tokens
const scanContent = fs.readFileSync(path.resolve('src/views/ScanNameCardView.vue'), 'utf8');
const scanHasPaletteGrays = /\b(?:bg|text|border)-(?:gray|slate|zinc)-\d+\b/.test(scanContent);
assert(!scanHasPaletteGrays, 'ScanNameCardView camera interface contains zero palette grays');

// 3.9 PartnerKitView & PartnerCommissionsView Data Grids
const kitContent = fs.readFileSync(path.resolve('src/views/partner/PartnerKitView.vue'), 'utf8');
const commContent = fs.readFileSync(path.resolve('src/views/partner/PartnerCommissionsView.vue'), 'utf8');
const kitHasPaletteGrays = /\b(?:bg|text|border)-(?:gray|slate|zinc)-\d+\b/.test(kitContent);
const commHasPaletteGrays = /\b(?:bg|text|border)-(?:gray|slate|zinc)-\d+\b/.test(commContent);
assert(!kitHasPaletteGrays, 'PartnerKitView contains zero palette grays');
assert(!commHasPaletteGrays, 'PartnerCommissionsView contains zero palette grays');

// =========================================================================
// SUITE 4: Regression Verifications Across Batches 1 - 4
// =========================================================================
console.log('\n[Suite 4] Milestone 1 - 3 Batch Regression Audits');
const { BATCHES, auditFile } = require(path.resolve('scripts/audit-tokens.cjs'));

for (let b = 1; b <= 4; b++) {
  const batchDef = BATCHES[b];
  let files = [];
  if (batchDef.files) files = files.concat(batchDef.files);
  if (batchDef.directory) {
    const getAll = (dir) => {
      let r = [];
      for (const item of fs.readdirSync(dir)) {
        const full = path.join(dir, item);
        if (fs.statSync(full).isDirectory()) r = r.concat(getAll(full));
        else if (item.endsWith('.vue') || item.endsWith('.ts')) r.push(full.replace(/\\/g, '/'));
      }
      return r;
    };
    files = files.concat(getAll(batchDef.directory));
  }

  let violationsInBatch = 0;
  for (const f of files) {
    const res = auditFile(f);
    violationsInBatch += res.total;
  }

  assert(violationsInBatch === 0, `Regression check Batch ${b} (${batchDef.name}): 0 violations across ${files.length} files`);
}

// =========================================================================
// FINAL SUMMARY
// =========================================================================
console.log('\n' + '='.repeat(75));
console.log(`MILESTONE 4 ADVERSARIAL STRESS TEST SUMMARY:`);
console.log(`  Total Checks: ${totalChecks}`);
console.log(`  Passed: ${passedChecks}`);
console.log(`  Failed: ${failedChecks}`);
console.log('='.repeat(75));

if (failedChecks > 0) {
  console.error('\n\x1b[31mCRITICAL DEFECTS DETECTED:\x1b[0m');
  for (const f of failureDetails) {
    console.error(`- [${f.testName}]:\n  ${f.details}`);
  }
  process.exit(1);
} else {
  console.log('\n\x1b[32m✔ ALL ADVERSARIAL CHALLENGES PASSED EMPIRICALLY!\x1b[0m\n');
  process.exit(0);
}
