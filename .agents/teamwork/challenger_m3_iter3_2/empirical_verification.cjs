const fs = require('fs');
const path = require('path');

console.log('================================================================================');
console.log('   CHALLENGER M3 ITER 3.2 — RIGOROUS EMPIRICAL VERIFICATION HARNESS');
console.log('================================================================================');

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;

function assertCheck(name, condition, details = '') {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  [PASS] ${name} ${details ? '(' + details + ')' : ''}`);
  } else {
    failedChecks++;
    console.error(`  [FAIL] ${name} ${details ? '(' + details + ')' : ''}`);
  }
}

// -----------------------------------------------------------------------------
// 1. WCAG 2.1 SC 1.4.11 Non-Text Contrast Math Engine (OKLCH -> sRGB -> Luminance)
// -----------------------------------------------------------------------------
console.log('\n--- SUITE 1: WCAG 2.1 SC 1.4.11 Non-Text Contrast Empirical Verification ---');

function oklchToLinearRgb(L, C, H_deg) {
  const h_rad = (H_deg * Math.PI) / 180;
  const a = C * Math.cos(h_rad);
  const b = C * Math.sin(h_rad);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  const r_lin = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g_lin = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const b_lin = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  return {
    r: Math.max(0, Math.min(1, r_lin)),
    g: Math.max(0, Math.min(1, g_lin)),
    b: Math.max(0, Math.min(1, b_lin))
  };
}

function linToSrgb(lin) {
  return lin <= 0.0031308 ? 12.92 * lin : 1.055 * Math.pow(lin, 1 / 2.4) - 0.055;
}

function srgbToLin(s) {
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

function getRelativeLuminance(rgbLin) {
  return 0.2126 * rgbLin.r + 0.7152 * rgbLin.g + 0.0722 * rgbLin.b;
}

function getContrastRatio(L1, L2) {
  const lum1 = Math.max(L1, L2);
  const lum2 = Math.min(L1, L2);
  return (lum1 + 0.05) / (lum2 + 0.05);
}

// Read index.css to dynamically parse dark mode variables
const indexCssPath = path.resolve('src/assets/index.css');
const indexCss = fs.readFileSync(indexCssPath, 'utf8');

const darkBlockMatch = indexCss.match(/\.dark\s*\{([^}]+)\}/);
if (!darkBlockMatch) {
  console.error('Failed to locate .dark block in src/assets/index.css');
  process.exit(1);
}
const darkBlock = darkBlockMatch[1];

function parseOklchVar(block, varName) {
  const regex = new RegExp(`${varName}:\\s*oklch\\(\\s*([0-9.]+)\\s+([0-9.]+)\\s+([0-9.]+)(?:\\s*\\/\\s*([0-9.%]+))?\\s*\\)`);
  const match = block.match(regex);
  if (!match) return null;
  return {
    L: parseFloat(match[1]),
    C: parseFloat(match[2]),
    H: parseFloat(match[3]),
    alpha: match[4] ? (match[4].endsWith('%') ? parseFloat(match[4]) / 100 : parseFloat(match[4])) : 1
  };
}

const darkBrand = parseOklchVar(darkBlock, '--brand');
const darkPrimary = parseOklchVar(darkBlock, '--primary');
const darkCard = parseOklchVar(darkBlock, '--card');

console.log('Parsed active CSS tokens (.dark):');
console.log('  --brand:  ', darkBrand);
console.log('  --primary:', darkPrimary);
console.log('  --card:   ', darkCard);

const brandLin = oklchToLinearRgb(darkBrand.L, darkBrand.C, darkBrand.H);
const primaryLin = oklchToLinearRgb(darkPrimary.L, darkPrimary.C, darkPrimary.H);
const cardLin = oklchToLinearRgb(darkCard.L, darkCard.C, darkCard.H);

const brandLum = getRelativeLuminance(brandLin);
const primaryLum = getRelativeLuminance(primaryLin);
const cardLum = getRelativeLuminance(cardLin);

console.log(`Luminance values: --brand = ${brandLum.toFixed(5)}, --primary = ${primaryLum.toFixed(5)}, --card = ${cardLum.toFixed(5)}`);

const brandVsCardContrast = getContrastRatio(brandLum, cardLum);
const primaryVsCardContrast = getContrastRatio(primaryLum, cardLum);

console.log(`Calculated contrast ratios against --card (${darkCard.L} ${darkCard.C} ${darkCard.H}):`);
console.log(`  --brand   vs --card = ${brandVsCardContrast.toFixed(2)}:1`);
console.log(`  --primary vs --card = ${primaryVsCardContrast.toFixed(2)}:1`);

assertCheck('Dark mode --brand vs --card >= 3.0:1 (WCAG 2.1 SC 1.4.11)', brandVsCardContrast >= 3.0, `${brandVsCardContrast.toFixed(2)}:1`);
assertCheck('Dark mode --primary vs --card >= 3.0:1 (WCAG 2.1 SC 1.4.11)', primaryVsCardContrast >= 3.0, `${primaryVsCardContrast.toFixed(2)}:1`);

// Browser CSS standard alpha compositing for the spinner track (border-border on card):
// card in sRGB:
const cardSrgb = linToSrgb(cardLin.r);
// 10% white over card in sRGB compositing:
const trackSrgb = cardSrgb * 0.9 + 1.0 * 0.1;
const trackLinVal = srgbToLin(trackSrgb);
const trackLum = trackLinVal; // achromatic
const brandVsTrackContrast = getContrastRatio(brandLum, trackLum);
console.log(`  --brand vs spinner track (border-border on card in sRGB) = ${brandVsTrackContrast.toFixed(2)}:1`);
assertCheck('Dark mode --brand vs spinner track (border-border on card) >= 3.0:1', brandVsTrackContrast >= 3.0, `${brandVsTrackContrast.toFixed(2)}:1`);


// -----------------------------------------------------------------------------
// 2. Component Token Verification
// -----------------------------------------------------------------------------
console.log('\n--- SUITE 2: Component Token Verification in Source Code ---');

const dealsViewSrc = fs.readFileSync('src/views/DealsView.vue', 'utf8');
const omnichannelViewSrc = fs.readFileSync('src/views/OmnichannelView.vue', 'utf8');

// Loading spinner check:
const hasSpinnerBorderTBrand = dealsViewSrc.includes('border-t-brand animate-spin');
assertCheck('DealsView loading spinner uses border-t-brand', hasSpinnerBorderTBrand);

const hasOldSpinnerBorderTPrimary = dealsViewSrc.includes('border-t-primary animate-spin');
assertCheck('DealsView loading spinner does NOT use border-t-primary', !hasOldSpinnerBorderTPrimary);

// AI draft glow check:
const hasAiDraftBorderBrand = omnichannelViewSrc.includes('border-brand ring-3 ring-brand/25 bg-brand/5 shadow-lg shadow-brand/25');
assertCheck('OmnichannelView AI draft glow uses border-brand', hasAiDraftBorderBrand);


// -----------------------------------------------------------------------------
// 3. Double Opacity Class Normalization & Bundle Compilation
// -----------------------------------------------------------------------------
console.log('\n--- SUITE 3: Double Opacity Class Elimination & Bundle Compilation ---');

const doubleOpacityRegex = /\b(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|divide(?:-[xy])?)-[a-zA-Z0-9_-]+\/\d+\/\d+\b/g;

const dealsDoubleMatches = dealsViewSrc.match(doubleOpacityRegex) || [];
assertCheck('DealsView.vue has 0 double-slash opacity classes', dealsDoubleMatches.length === 0, `found ${dealsDoubleMatches.length}: ${JSON.stringify(dealsDoubleMatches)}`);

const omniDoubleMatches = omnichannelViewSrc.match(doubleOpacityRegex) || [];
assertCheck('OmnichannelView.vue has 0 double-slash opacity classes', omniDoubleMatches.length === 0, `found ${omniDoubleMatches.length}: ${JSON.stringify(omniDoubleMatches)}`);

// Find the main compiled index-*.css in dist/assets
const distAssetsDir = path.resolve('dist/assets');
const distFiles = fs.readdirSync(distAssetsDir);
const mainCssFile = distFiles.find(f => f.startsWith('index-') && f.endsWith('.css'));

if (!mainCssFile) {
  console.error('Production CSS bundle not found in dist/assets!');
  process.exit(1);
}
console.log(`Inspecting production bundle: dist/assets/${mainCssFile}`);
const compiledCss = fs.readFileSync(path.join(distAssetsDir, mainCssFile), 'utf8');

// Verify that the old malformed classes are NOT present in CSS bundle (they were dropped anyway)
assertCheck('Bundle does NOT contain malformed bg-muted/40/90', !compiledCss.includes('bg-muted/40/90'));
assertCheck('Bundle does NOT contain malformed bg-muted/30/75', !compiledCss.includes('bg-muted/30/75'));

// Verify that all replacement classes ARE generated into the production bundle
// Note: Tailwind escapes special characters in CSS selectors, e.g. .bg-muted\/90, .hover\:bg-muted\/75
const classesToVerifyInBundle = [
  'bg-muted\\/90',
  'bg-muted\\/95',
  'bg-muted\\/50',
  'bg-muted\\/80',
  'bg-muted\\/30',
  'hover\\:bg-muted\\/75',
  'hover\\:bg-muted\\/50',
  'border-t-brand',
  'border-brand',
  'ring-brand\\/25',
  'bg-brand\\/5'
];

classesToVerifyInBundle.forEach(cls => {
  const exists = compiledCss.includes(cls);
  assertCheck(`Compiled bundle contains rule for '${cls}'`, exists);
});


// -----------------------------------------------------------------------------
// 4. Audit Tokens Script Rule Verification
// -----------------------------------------------------------------------------
console.log('\n--- SUITE 4: Audit Tool Hardening Verification ---');
const auditScriptSrc = fs.readFileSync('scripts/audit-tokens.cjs', 'utf8');
const hasMalformedRule = auditScriptSrc.includes('malformedDoubleOpacity') &&
                         auditScriptSrc.includes('/\\b(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|divide(?:-[xy])?)-[a-zA-Z0-9_-]+\\/\\d+\\/\\d+\\b/g');
assertCheck('scripts/audit-tokens.cjs includes malformedDoubleOpacity rule', hasMalformedRule);


// -----------------------------------------------------------------------------
// Summary
// -----------------------------------------------------------------------------
console.log('\n================================================================================');
console.log(`TOTAL CHECKS: ${totalChecks} | PASSED: ${passedChecks} | FAILED: ${failedChecks}`);
console.log('================================================================================');

if (failedChecks > 0) {
  console.error('\n❌ EMPIRICAL CHALLENGER VERIFICATION FAILED!');
  process.exit(1);
} else {
  console.log('\n✔ ALL EMPIRICAL CHALLENGER CHECKS PASSED FLAWLESSLY!');
  process.exit(0);
}
