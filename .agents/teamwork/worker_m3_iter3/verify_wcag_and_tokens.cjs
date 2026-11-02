/**
 * Independent WCAG & CSS Variable Contrast Verification Script
 * Milestone 3 (Iteration 3) Worker Verification
 */
const fs = require('fs');
const path = require('path');

// 1. Parse OKLCH values from src/assets/index.css
const cssContent = fs.readFileSync('src/assets/index.css', 'utf8');

function extractOklch(css, selector, variableName) {
  const blockRegex = new RegExp(`${selector}\\s*\\{([^}]+)\\}`, 's');
  const blockMatch = css.match(blockRegex);
  if (!blockMatch) throw new Error(`Selector ${selector} not found`);
  const varRegex = new RegExp(`${variableName}:\\s*oklch\\(([^)]+)\\)`);
  const varMatch = blockMatch[1].match(varRegex);
  if (!varMatch) throw new Error(`Variable ${variableName} not found in ${selector}`);
  const parts = varMatch[1].trim().split(/\s+/).map(Number);
  return { L: parts[0], C: parts[1], H: parts[2] };
}

const darkPrimary = extractOklch(cssContent, '\\.dark', '--primary');
const darkBrand = extractOklch(cssContent, '\\.dark', '--brand');
const darkCard = extractOklch(cssContent, '\\.dark', '--card');
const darkMuted = extractOklch(cssContent, '\\.dark', '--muted');
const darkMutedFg = extractOklch(cssContent, '\\.dark', '--muted-foreground');
const darkFg = extractOklch(cssContent, '\\.dark', '--foreground');

console.log('Parsed Dark Mode CSS Variables from src/assets/index.css:');
console.log('  --primary:', darkPrimary);
console.log('  --brand:', darkBrand);
console.log('  --card:', darkCard);

// 2. OKLCH to linear sRGB & sRGB conversion
function oklchToRgb(L, C, H_deg, alpha = 1) {
  const H_rad = (H_deg * Math.PI) / 180;
  const a = C * Math.cos(H_rad);
  const b = C * Math.sin(H_rad);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  const r_lin = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g_lin = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const b_lin = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  return {
    rLin: clamp01(r_lin),
    gLin: clamp01(g_lin),
    bLin: clamp01(b_lin)
  };
}

function relativeLuminance(rgb) {
  return 0.2126 * rgb.rLin + 0.7152 * rgb.gLin + 0.0722 * rgb.bLin;
}

function contrastRatio(rgb1, rgb2) {
  const lum1 = relativeLuminance(rgb1);
  const lum2 = relativeLuminance(rgb2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

const rgbPrimary = oklchToRgb(darkPrimary.L, darkPrimary.C, darkPrimary.H);
const rgbBrand = oklchToRgb(darkBrand.L, darkBrand.C, darkBrand.H);
const rgbCard = oklchToRgb(darkCard.L, darkCard.C, darkCard.H);

const ratioPrimaryVsCard = contrastRatio(rgbPrimary, rgbCard);
const ratioBrandVsCard = contrastRatio(rgbBrand, rgbCard);

console.log('\n--- Contrast Calculations (WCAG 2.1 SC 1.4.11 Non-Text Contrast >= 3.0:1) ---');
console.log(`Dark Mode --primary (${darkPrimary.L} ${darkPrimary.C} ${darkPrimary.H}) vs --card: ${ratioPrimaryVsCard.toFixed(2)}:1 [${ratioPrimaryVsCard >= 3.0 ? 'PASS' : 'FAIL'}]`);
console.log(`Dark Mode --brand (${darkBrand.L} ${darkBrand.C} ${darkBrand.H}) vs --card: ${ratioBrandVsCard.toFixed(2)}:1 [${ratioBrandVsCard >= 3.0 ? 'PASS' : 'FAIL'}]`);

// 3. Inspect Actual Components
const dealsContent = fs.readFileSync('src/views/DealsView.vue', 'utf8');
const omniContent = fs.readFileSync('src/views/OmnichannelView.vue', 'utf8');

console.log('\n--- Component Token Usage Checks ---');
const dealsSpinnerHasBrand = dealsContent.includes('border-t-brand animate-spin');
console.log(`DealsView loading spinner uses border-t-brand: ${dealsSpinnerHasBrand ? 'PASS' : 'FAIL'}`);

const omniAiGlowHasBrand = omniContent.includes('border-brand ring-3 ring-brand/25');
console.log(`OmnichannelView AI Draft Glow uses border-brand: ${omniAiGlowHasBrand ? 'PASS' : 'FAIL'}`);

// 4. Double opacity check
const doubleOpacityRegex = /\b(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|divide(?:-[xy])?)-[a-zA-Z0-9_-]+\/\d+\/\d+\b/g;
const dealsDouble = dealsContent.match(doubleOpacityRegex) || [];
const omniDouble = omniContent.match(doubleOpacityRegex) || [];

console.log(`DealsView double opacity remnants: ${dealsDouble.length} [${dealsDouble.length === 0 ? 'PASS' : 'FAIL'}]`);
console.log(`OmnichannelView double opacity remnants: ${omniDouble.length} [${omniDouble.length === 0 ? 'PASS' : 'FAIL'}]`);
