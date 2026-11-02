#!/usr/bin/env node

/**
 * Challenger M3 Iteration 3: Comprehensive Empirical Adversarial Stress Test Harness
 * 
 * Objectives:
 *  1. Double-slash opacity classes across all Vue files in src/
 *  2. Directional & non-directional border classes across Batches 1, 2, 3, 4
 *  3. Non-standard numeric palette steps across Batches 1, 2, 3, 4
 *  4. Arbitrary shadow RGBA, hex, and raw palette syntax across Batches 1, 2, 3, 4
 *  5. Dynamic OKLCH WCAG 2.1 contrast mathematical oracle from live src/assets/index.css
 *  6. DealsView and OmnichannelView critical remediations verification
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
      'src/components/omnichannel/ToastNotifications.vue',
      'src/components/layout/UserNav.vue',
      'src/App.vue'
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
const failures = [];

function check(condition, testName, details = null) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  \x1b[32m✔ PASS:\x1b[0m ${testName}`);
  } else {
    failedChecks++;
    console.error(`  \x1b[31m✖ FAIL:\x1b[0m ${testName}`);
    if (details) {
      console.error(`    Details:`, JSON.stringify(details, null, 2));
      failures.push({ testName, details });
    }
  }
}

function getAllFiles(dir, exts = ['.vue', '.ts', '.js']) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const f of list) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results = results.concat(getAllFiles(full, exts));
    } else if (exts.some(ext => f.endsWith(ext))) {
      results.push(full.replace(/\\/g, '/'));
    }
  }
  return results;
}

console.log('='.repeat(80));
console.log('CHALLENGER M3 ITERATION 3: EMPIRICAL ADVERSARIAL STRESS TEST HARNESS');
console.log('='.repeat(80));

// ---------------------------------------------------------------------------
// SUITE 1: Double-Slash Opacity Classes Across ALL Vue Files in src/
// ---------------------------------------------------------------------------
console.log('\n[Suite 1] Malformed Double-Slash Opacity Classes Across Entire src/ Directory');

const allSrcVueFiles = getAllFiles(path.resolve('src'), ['.vue']);
console.log(`  Scanning all ${allSrcVueFiles.length} .vue files in src/...`);

const doubleOpacityRegex = /\b(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|divide(?:-[xy])?|from|to|via|fill|stroke|shadow)-[a-zA-Z0-9_-]+\/\d+\/\d+\b/g;
let doubleOpacityOccurrences = [];

for (const filePath of allSrcVueFiles) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  lines.forEach((l, idx) => {
    let m;
    while ((m = doubleOpacityRegex.exec(l)) !== null) {
      doubleOpacityOccurrences.push({
        file: path.relative(process.cwd(), filePath).replace(/\\/g, '/'),
        line: idx + 1,
        match: m[0],
        snippet: l.trim()
      });
    }
  });
}

check(
  doubleOpacityOccurrences.length === 0,
  `Zero malformed double-slash opacity class remnants across entire src/ (${allSrcVueFiles.length} files scanned, found ${doubleOpacityOccurrences.length})`,
  doubleOpacityOccurrences
);

// ---------------------------------------------------------------------------
// SUITE 2: Remediated Files Specific Line-by-Line Assertions
// ---------------------------------------------------------------------------
console.log('\n[Suite 2] Specific Remediated Files Verification (DealsView & OmnichannelView)');

// DealsView checks
const dealsContent = fs.readFileSync(path.resolve('src/views/DealsView.vue'), 'utf8');
check(!dealsContent.includes('hover:bg-muted/30/75'), 'DealsView line 1840: hover:bg-muted/30/75 removed');
check(dealsContent.includes('hover:bg-muted/75 transition-colors cursor-pointer'), 'DealsView: hover:bg-muted/75 installed');
check(!dealsContent.includes('hover:bg-muted/30/50'), 'DealsView line 3268: hover:bg-muted/30/50 removed');
check(dealsContent.includes('hover:bg-muted/50'), 'DealsView: hover:bg-muted/50 installed');
check(!dealsContent.includes('border-t-primary animate-spin'), 'DealsView line 3212: border-t-primary replaced');
check(dealsContent.includes('border-t-brand animate-spin'), 'DealsView line 3212: border-t-brand installed');

// OmnichannelView checks
const omniContent = fs.readFileSync(path.resolve('src/views/OmnichannelView.vue'), 'utf8');
const omniDoubleSlashes = (omniContent.match(/bg-muted\/\d+\/\d+/g) || []);
check(omniDoubleSlashes.length === 0, `OmnichannelView: 0 double-slash opacity remnants (found ${omniDoubleSlashes.length})`, omniDoubleSlashes);
check(omniContent.includes('bg-muted/90 backdrop-blur-md border-b border-border/80'), 'OmnichannelView: sticky headers use bg-muted/90');
check(omniContent.includes('bg-muted/95 backdrop-blur-sm border-b border-border'), 'OmnichannelView: channel group header uses bg-muted/95');
check(omniContent.includes('border-brand ring-3 ring-brand/25 bg-brand/5 shadow-lg shadow-brand/25'), 'OmnichannelView line 3359: AI draft glow uses brand token');

// ---------------------------------------------------------------------------
// SUITE 3: Border Classes Adversarial Stress Test across Batches 1, 2, 3, 4
// ---------------------------------------------------------------------------
console.log('\n[Suite 3] Border Classes Adversarial Stress Test across Batches 1, 2, 3, 4');

const allPalettes = 'gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose';

// Regex for raw palette borders: border-gray-*, border-t-gray-*, border-emerald-*, etc.
const rawPaletteBordersRegex = new RegExp(
  `\\b(?:hover:|focus:|active:|group-hover:)?border-(?:(?:[trblxyse]|t|r|b|l|x|y|s|e)-)?(?:(?:${allPalettes})-\\d+|white|black)\\b`,
  'g'
);

// Regex for arbitrary hex/rgb borders: border-[#...], border-t-[rgba(...)]
const arbitraryHexRgbBorderRegex = /\b(?:hover:|focus:|active:|group-hover:)?border-(?:(?:[trblxyse]|t|r|b|l|x|y|s|e)-)?\[(?:#[0-9a-fA-F]{3,8}|rgba?\([^\]]+\))\]\b/g;

// Collect all files in Batches 1, 3, 4
const batch134Files = [
  ...BATCHES[1].files,
  ...BATCHES[3].files,
  ...BATCHES[4].files
];

for (const relPath of batch134Files) {
  const fullPath = path.resolve(relPath);
  if (!fs.existsSync(fullPath)) continue;
  const content = fs.readFileSync(fullPath, 'utf8');
  
  const rawMatches = content.match(rawPaletteBordersRegex) || [];
  check(rawMatches.length === 0, `${relPath}: 0 raw palette border classes`, rawMatches);

  const arbMatches = content.match(arbitraryHexRgbBorderRegex) || [];
  check(arbMatches.length === 0, `${relPath}: 0 arbitrary hex/rgb border classes`, arbMatches);
}

// Batch 2 (UI Components)
const batch2Files = getAllFiles(path.resolve('src/components/ui'));
let b2RawBorders = 0;
let b2ArbBorders = 0;
for (const f of batch2Files) {
  const content = fs.readFileSync(f, 'utf8');
  if (rawPaletteBordersRegex.test(content)) b2RawBorders++;
  if (arbitraryHexRgbBorderRegex.test(content)) b2ArbBorders++;
}
check(b2RawBorders === 0, `Batch 2 (${batch2Files.length} UI files): 0 raw palette border classes (found ${b2RawBorders})`);
check(b2ArbBorders === 0, `Batch 2 (${batch2Files.length} UI files): 0 arbitrary hex/rgb border classes (found ${b2ArbBorders})`);

// ---------------------------------------------------------------------------
// SUITE 4: Non-Standard Numeric Palette Steps Stress Test
// ---------------------------------------------------------------------------
console.log('\n[Suite 4] Non-Standard Numeric Palette Steps Stress Test');

// Check for ANY non-standard step number: e.g. 150, 155, 250, 255, 350, 505, 550, 605, 655
const propertyPrefixes = 'bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|divide(?:-[xy])?|fill|stroke|outline|placeholder|from|to|via|accent|caret|shadow';
const nonStandardStepsRegex = new RegExp(
  `\\b(?:(?:${propertyPrefixes})-(?:${allPalettes})-(?!50\\b|100\\b|200\\b|300\\b|400\\b|500\\b|600\\b|700\\b|800\\b|900\\b|950\\b)\\d+)\\b`,
  'g'
);

for (const relPath of batch134Files) {
  const fullPath = path.resolve(relPath);
  if (!fs.existsSync(fullPath)) continue;
  const content = fs.readFileSync(fullPath, 'utf8');
  const matches = content.match(nonStandardStepsRegex) || [];
  check(matches.length === 0, `${relPath}: 0 non-standard numeric palette steps`, matches);
}

let b2NonStandard = 0;
for (const f of batch2Files) {
  const content = fs.readFileSync(f, 'utf8');
  if (nonStandardStepsRegex.test(content)) b2NonStandard++;
}
check(b2NonStandard === 0, `Batch 2 (${batch2Files.length} UI files): 0 non-standard numeric palette steps (found ${b2NonStandard})`);

// ---------------------------------------------------------------------------
// SUITE 5: Arbitrary Shadows RGBA, Hex, and Raw Palette Syntax
// ---------------------------------------------------------------------------
console.log('\n[Suite 5] Arbitrary Shadow RGBA, Hex, and Raw Palette Syntax');

// Arbitrary shadows with hex or rgba
const arbitraryShadowColorRegex = /\b(?:hover:|focus:|group-hover:)?shadow-\[[^\]]*(?:#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))[^\]]*\]/g;
// Raw palette shadow colors: shadow-emerald-500, shadow-red-500, etc.
const rawPaletteShadowRegex = new RegExp(`\\bshadow-(?:${allPalettes})-\\d+\\b`, 'g');

for (const relPath of batch134Files) {
  const fullPath = path.resolve(relPath);
  if (!fs.existsSync(fullPath)) continue;
  const content = fs.readFileSync(fullPath, 'utf8');
  const arbMatches = content.match(arbitraryShadowColorRegex) || [];
  check(arbMatches.length === 0, `${relPath}: 0 arbitrary hex/rgba shadow classes`, arbMatches);
  const palMatches = content.match(rawPaletteShadowRegex) || [];
  check(palMatches.length === 0, `${relPath}: 0 raw palette shadow classes`, palMatches);
}

let b2ArbShadows = 0;
let b2PalShadows = 0;
for (const f of batch2Files) {
  const content = fs.readFileSync(f, 'utf8');
  if (arbitraryShadowColorRegex.test(content)) b2ArbShadows++;
  if (rawPaletteShadowRegex.test(content)) b2PalShadows++;
}
check(b2ArbShadows === 0, `Batch 2 (${batch2Files.length} UI files): 0 arbitrary hex/rgba shadow classes (found ${b2ArbShadows})`);
check(b2PalShadows === 0, `Batch 2 (${batch2Files.length} UI files): 0 raw palette shadow classes (found ${b2PalShadows})`);

// ---------------------------------------------------------------------------
// SUITE 6: Dynamic OKLCH Color Contrast & WCAG 2.1 Oracle from index.css
// ---------------------------------------------------------------------------
console.log('\n[Suite 6] Dynamic OKLCH Color Contrast & WCAG 2.1 Mathematical Oracle');

// Exact OKLCH to sRGB conversion functions
function oklchToRgb(L, C, H) {
  const hRad = (H * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  const rLinear = +4.0767434036 * l - 3.3077115913 * m + 0.2309699292 * s;
  const gLinear = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bLinear = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  function toGamut(val) {
    const clamped = Math.max(0, Math.min(1, val));
    return clamped <= 0.0031308
      ? 12.92 * clamped
      : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
  }

  return [toGamut(rLinear), toGamut(gLinear), toGamut(bLinear)];
}

function getRelativeLuminance(rgb) {
  function linearize(val) {
    return val <= 0.04045 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  }
  const r = linearize(rgb[0]);
  const g = linearize(rgb[1]);
  const b = linearize(rgb[2]);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function getContrastRatio(rgb1, rgb2) {
  const lum1 = getRelativeLuminance(rgb1);
  const lum2 = getRelativeLuminance(rgb2);
  const brighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (brighter + 0.05) / (darker + 0.05);
}

// Parse src/assets/index.css
const indexCssContent = fs.readFileSync(path.resolve('src/assets/index.css'), 'utf8');

function parseCssVar(css, blockSelector, varName) {
  const blockIdx = css.indexOf(blockSelector);
  if (blockIdx === -1) return null;
  const blockEnd = css.indexOf('}', blockIdx);
  const blockText = css.substring(blockIdx, blockEnd);
  const regex = new RegExp(`${varName}:\\s*oklch\\(([\\d.]+)\\s+([\\d.]+)\\s+([\\d.]+)(?:\\s*\\/\\s*([\\d%]+))?\\);`);
  const match = blockText.match(regex);
  if (!match) return null;
  return {
    L: parseFloat(match[1]),
    C: parseFloat(match[2]),
    H: parseFloat(match[3]),
    alpha: match[4] || '100%'
  };
}

const darkPrimary = parseCssVar(indexCssContent, '.dark {', '--primary');
const darkBrand = parseCssVar(indexCssContent, '.dark {', '--brand');
const darkCard = parseCssVar(indexCssContent, '.dark {', '--card');
const darkBackground = parseCssVar(indexCssContent, '.dark {', '--background');
const darkCardForeground = parseCssVar(indexCssContent, '.dark {', '--card-foreground');
const darkDestructive = parseCssVar(indexCssContent, '.dark {', '--destructive');
const darkSuccess = parseCssVar(indexCssContent, '.dark {', '--success');
const darkWarning = parseCssVar(indexCssContent, '.dark {', '--warning');

console.log('  Live tokens extracted from index.css (.dark):');
console.log('    --primary:', darkPrimary);
console.log('    --brand:', darkBrand);
console.log('    --card:', darkCard);

const rgbDarkPrimary = oklchToRgb(darkPrimary.L, darkPrimary.C, darkPrimary.H);
const rgbDarkBrand = oklchToRgb(darkBrand.L, darkBrand.C, darkBrand.H);
const rgbDarkCard = oklchToRgb(darkCard.L, darkCard.C, darkCard.H);
const rgbDarkBackground = oklchToRgb(darkBackground.L, darkBackground.C, darkBackground.H);
const rgbDarkCardForeground = oklchToRgb(darkCardForeground.L, darkCardForeground.C, darkCardForeground.H);

const contrastPrimaryVsCard = getContrastRatio(rgbDarkPrimary, rgbDarkCard);
const contrastBrandVsCard = getContrastRatio(rgbDarkBrand, rgbDarkCard);
const contrastPrimaryVsBg = getContrastRatio(rgbDarkPrimary, rgbDarkBackground);
const contrastBrandVsBg = getContrastRatio(rgbDarkBrand, rgbDarkBackground);
const contrastCardFgVsCard = getContrastRatio(rgbDarkCardForeground, rgbDarkCard);

console.log(`  Contrast Results:`);
console.log(`    --primary vs --card: ${contrastPrimaryVsCard.toFixed(2)}:1`);
console.log(`    --brand vs --card: ${contrastBrandVsCard.toFixed(2)}:1`);
console.log(`    --primary vs --background: ${contrastPrimaryVsBg.toFixed(2)}:1`);
console.log(`    --brand vs --background: ${contrastBrandVsBg.toFixed(2)}:1`);
console.log(`    --card-foreground vs --card: ${contrastCardFgVsCard.toFixed(2)}:1`);

check(contrastPrimaryVsCard >= 3.0, `Dark mode --primary vs --card contrast (${contrastPrimaryVsCard.toFixed(2)}:1 >= 3.0:1) [WCAG 2.1 SC 1.4.11 PASS]`);
check(contrastBrandVsCard >= 3.0, `Dark mode --brand vs --card contrast (${contrastBrandVsCard.toFixed(2)}:1 >= 3.0:1) [WCAG 2.1 SC 1.4.11 PASS]`);
check(contrastPrimaryVsBg >= 3.0, `Dark mode --primary vs --background contrast (${contrastPrimaryVsBg.toFixed(2)}:1 >= 3.0:1) [WCAG 2.1 SC 1.4.11 PASS]`);
check(contrastBrandVsBg >= 3.0, `Dark mode --brand vs --background contrast (${contrastBrandVsBg.toFixed(2)}:1 >= 3.0:1) [WCAG 2.1 SC 1.4.11 PASS]`);
check(contrastCardFgVsCard >= 4.5, `Dark mode --card-foreground vs --card contrast (${contrastCardFgVsCard.toFixed(2)}:1 >= 4.5:1) [WCAG 2.1 SC 1.4.3 PASS]`);

// ---------------------------------------------------------------------------
// SUITE 7: Audit Script Hardening Verification
// ---------------------------------------------------------------------------
console.log('\n[Suite 7] Token Audit Tool (scripts/audit-tokens.cjs) Hardening Verification');

const auditContent = fs.readFileSync(path.resolve('scripts/audit-tokens.cjs'), 'utf8');
check(auditContent.includes('malformedDoubleOpacity:'), 'audit-tokens.cjs includes malformedDoubleOpacity rule');
check(auditContent.includes('Malformed Double Opacity Classes'), 'audit-tokens.cjs has descriptive rule name');

// ---------------------------------------------------------------------------
// SUMMARY & VERDICT
// ---------------------------------------------------------------------------
console.log('\n' + '='.repeat(80));
console.log(`TOTAL ADVERSARIAL CHECKS: ${totalChecks} | PASSED: ${passedChecks} | FAILED: ${failedChecks}`);
console.log('='.repeat(80));

if (failedChecks > 0) {
  console.error('\nFAILURES ENCOUNTERED:');
  for (const f of failures) {
    console.error(`- ${f.testName}:`, f.details);
  }
  process.exit(1);
} else {
  console.log('\n\x1b[32m✔ EMPIRICAL VERIFICATION COMPLETE: ALL ADVERSARIAL STRESS TESTS PASSED.\x1b[0m\n');
  process.exit(0);
}
