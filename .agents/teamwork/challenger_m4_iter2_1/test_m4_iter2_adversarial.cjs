#!/usr/bin/env node

/**
 * Adversarial Stress Testing & Verification Suite — Milestone 4 Iteration 2
 * Agent: challenger_m4_iter2_1
 * Roles: critic, specialist
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

console.log('='.repeat(80));
console.log('CHALLENGER M4 ITERATION 2 — EXPANDED ADVERSARIAL STRESS TEST SUITE');
console.log('Timestamp: ' + new Date().toISOString());
console.log('='.repeat(80));

// =========================================================================
// SUITE 1: Target Files Accessibility & Integrity
// =========================================================================
console.log('\n[Suite 1] File Existence & Structural Integrity');
for (const relPath of TARGET_FILES) {
  const fullPath = path.resolve(relPath);
  const exists = fs.existsSync(fullPath);
  const stat = exists ? fs.statSync(fullPath) : null;
  assert(exists && stat.size > 500, `File exists and non-empty: ${relPath} (${stat ? stat.size : 0} bytes)`);
}

// =========================================================================
// SUITE 2: Specific Verification of 5 Remediated Issues (Iteration 2 Targets)
// =========================================================================
console.log('\n[Suite 2] Specific Verification of 5 Remediated Issues');

// 2.1 PartnerProgramView: Absence of accent-[#...]
const partnerProgramContent = fs.readFileSync(path.resolve('src/views/partner/PartnerProgramView.vue'), 'utf8');
const hasAccentHex = /accent-\[#[0-9a-fA-F]{3,8}\]/.test(partnerProgramContent);
const usesAccentPrimary = partnerProgramContent.includes('accent-primary');
assert(!hasAccentHex, 'PartnerProgramView: Zero accent-[#...] arbitrary hex classes found');
assert(usesAccentPrimary, 'PartnerProgramView: Range & checkbox correctly use semantic accent-primary token');

// 2.2 PartnerRegisterView: Absence of raw SVG logo with raw hex fills
const partnerRegisterContent = fs.readFileSync(path.resolve('src/views/PartnerRegisterView.vue'), 'utf8');
const hasRawSvgLogo = /viewBox=["']0 0 1085 160["']/.test(partnerRegisterContent);
const hasRawHexFills = /fill=["']#(?:23b750|62d816)["']/i.test(partnerRegisterContent);
const desktopHeaderHasImgLogo = partnerRegisterContent.includes('<img :src="isDark ? darkLogoUrl : lightLogoUrl" class="h-7 w-auto transition-transform group-hover/logo:scale-102" alt="RakanSales Logo" />');
assert(!hasRawSvgLogo, 'PartnerRegisterView: Hardcoded 12-path desktop hover SVG logo is completely removed');
assert(!hasRawHexFills, 'PartnerRegisterView: Zero raw hex fills (#23b750 / #62d816) found');
assert(desktopHeaderHasImgLogo, 'PartnerRegisterView: Desktop hover slide-down header uses dynamic isDark image logo');

// 2.3 SettingsView: Absence of shadow-amber, scrollbar hex, and CRM tag hex
const settingsContent = fs.readFileSync(path.resolve('src/views/SettingsView.vue'), 'utf8');
const hasShadowAmber = /shadow-amber(-\d+)?(\/\d+)?/.test(settingsContent);
const hasScrollbarHex = /#e2e8f0|#cbd5e1/.test(settingsContent);
const hasRawPastelTags = /#(?:F3E8FF|7E22CE|D1FAE5|047857|DBEAFE|1D4ED8|FEF3C7|B45309|FEE2E2|B91C1C|E0F2FE|0369A1)/i.test(settingsContent);
const hasBrokenBadgeConcat = /\bcolor\.text\s*\+\s*['"]30['"]/.test(settingsContent);
const usesTagTokens = settingsContent.includes('var(--tag-1)') && settingsContent.includes('var(--tag-6)');
assert(!hasShadowAmber, 'SettingsView: Zero shadow-amber raw status color shadows');
assert(!hasScrollbarHex, 'SettingsView: Zero scrollbar hex codes (#e2e8f0, #cbd5e1) in scoped CSS');
assert(!hasRawPastelTags, 'SettingsView: Zero hardcoded pastel hex colors in CRM pipeline tags');
assert(!hasBrokenBadgeConcat, 'SettingsView: Zero broken badge opacity string concatenations (color.text + "30")');
assert(usesTagTokens, 'SettingsView: CRM tags mapped directly to categorical tokens var(--tag-1) to var(--tag-6)');

// 2.4 AddonsView: Absence of raw hex in sliderBackground
const addonsContent = fs.readFileSync(path.resolve('src/views/AddonsView.vue'), 'utf8');
const hasSliderHex = /#1e293b|#e2e8f0|#23B750/.test(addonsContent);
const usesSliderCssVars = addonsContent.includes('var(--primary)') && addonsContent.includes('var(--border)');
assert(!hasSliderHex, 'AddonsView: Zero raw hex colors (#1e293b, #e2e8f0, #23B750) in sliderBackground');
assert(usesSliderCssVars, 'AddonsView: sliderBackground dynamically computes track fill via CSS variables var(--primary) and var(--border)');

// 2.5 AutomationTab: Absence of #94A3B8 and semantic status mapping
const autoTabContent = fs.readFileSync(path.resolve('src/components/settings/AutomationTab.vue'), 'utf8');
const has94A3B8 = /#94A3B8/i.test(autoTabContent);
const usesHslFallback = autoTabContent.includes("'hsl(var(--muted-foreground))'") || autoTabContent.includes('"hsl(var(--muted-foreground))"');
const usesSuccessStatus = autoTabContent.includes('bg-success') && autoTabContent.includes('text-success');
assert(!has94A3B8, 'AutomationTab: Zero instances of unmapped fallback #94A3B8');
assert(usesHslFallback, 'AutomationTab: Tag dot color fallback cleanly mapped to hsl(var(--muted-foreground))');
assert(usesSuccessStatus, 'AutomationTab: Active automations and execution logs use semantic success status tokens');

// =========================================================================
// SUITE 3: Hardened Deep Token Audit Across All 22 Milestone 4 Files
// =========================================================================
console.log('\n[Suite 3] Hardened Regex Deep Token Audit across 22 Target Files');

const rules = [
  {
    id: 'PALETTE_GRAYS',
    name: 'Raw Palette Grays / Neutrals',
    regex: /\b(?:[a-zA-Z:-]+:)?(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|divide(?:-[xy])?|fill|stroke|outline|placeholder|shadow|accent|caret|from|to|via)-(?:gray|slate|zinc|neutral|stone)-(?:50|100|150|200|250|300|350|400|450|500|550|600|650|700|750|800|850|900|950)\b|\b(?:[a-zA-Z:-]+:)?(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|divide(?:-[xy])?|fill|stroke|outline|shadow|accent|caret)-(?:white|black)\b/g,
    scope: 'all'
  },
  {
    id: 'RAW_STATUS_COLORS',
    name: 'Raw Status / Accent Palette Colors',
    regex: /\b(?:[a-zA-Z:-]+:)?(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|divide(?:-[xy])?|fill|stroke|outline|placeholder|shadow|accent|caret|from|to|via)-(?:red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|150|200|250|300|350|400|450|500|550|600|650|700|750|800|850|900|950)\b/g,
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
    name: 'Arbitrary Hex / RGB Classes (e.g. bg-[#...], accent-[#...])',
    regex: /\b(?:[a-zA-Z:-]+)-\[(?:#[0-9a-fA-F]{3,8}|rgba?\([^\]]+\))\]|\bshadow-\[[^\]]*(?:#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))[^\]]*\]/g,
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
    id: 'SCOPED_STYLE_HEX',
    name: 'Scoped <style> Raw Hex/RGB Colors',
    regex: /#[0-9a-fA-F]{3,8}\b|\brgba?\(\s*\d+/g,
    scope: 'style'
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
      if (rule.scope === 'style' && currentBlock !== 'style') continue;
      if (rule.scope === 'all' && currentBlock === 'style') continue;

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
// SUITE 4: Hardened Audit Tool CLI Verification (scripts/audit-tokens.cjs)
// =========================================================================
console.log('\n[Suite 4] Hardened Audit Tool CLI Verification');

const { BATCHES, auditFile } = require(path.resolve('scripts/audit-tokens.cjs'));

// Check Batches 5, 6, 7
for (const b of [5, 6, 7]) {
  const batchDef = BATCHES[b];
  let violationsInBatch = 0;
  for (const f of batchDef.files) {
    const res = auditFile(f);
    violationsInBatch += res.total;
  }
  assert(violationsInBatch === 0, `Audit Tool Batch ${b} (${batchDef.name}): 0 violations across ${batchDef.files.length} files`);
}

// Check Regression Batches 1, 2, 3, 4
console.log('\n[Suite 5] Regression Verifications (Batches 1 - 4)');
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
// SUITE 6: Production Build Verification
// =========================================================================
console.log('\n[Suite 6] Full TypeScript & Production Vite Build Execution');
let buildPassed = false;
let buildErrorOutput = '';
try {
  const buildResult = execSync('cmd.exe /c "npm run build"', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
  buildPassed = buildResult.includes('built in') || buildResult.includes('transforming');
  console.log('Build output summary: ' + buildResult.split('\n').filter(l => l.includes('built in') || l.includes('modules transformed')).join(' | '));
} catch (err) {
  buildPassed = false;
  buildErrorOutput = (err.stdout || '') + '\n' + (err.stderr || '') + '\n' + err.message;
}
assert(buildPassed, 'Production build (cmd.exe /c "npm run build") completes with exit code 0', buildErrorOutput);

// =========================================================================
// FINAL SUMMARY
// =========================================================================
console.log('\n' + '='.repeat(80));
console.log(`MILESTONE 4 ITERATION 2 ADVERSARIAL STRESS TEST SUMMARY:`);
console.log(`  Total Checks: ${totalChecks}`);
console.log(`  Passed: ${passedChecks}`);
console.log(`  Failed: ${failedChecks}`);
console.log('='.repeat(80));

if (failedChecks > 0) {
  console.error('\n\x1b[31mCRITICAL DEFECTS DETECTED:\x1b[0m');
  for (const f of failureDetails) {
    console.error(`- [${f.testName}]:\n  ${f.details}`);
  }
  process.exit(1);
} else {
  console.log('\n\x1b[32m✔ ALL ADVERSARIAL CHALLENGES PASSED EMPIRICALLY! ZERO DEFECTS DETECTED.\x1b[0m\n');
  process.exit(0);
}
