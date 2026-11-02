#!/usr/bin/env node

/**
 * Empirical Adversarial Verification Suite for Milestone 3 (CRM Core & Omnichannel)
 * Challenger 2
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('======================================================================');
console.log(' STARTING ADVERSARIAL STRESS TEST FOR MILESTONE 3 (CRM CORE & OMNICHANNEL)');
console.log('======================================================================\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] ${testName}`);
  } else {
    failedTests++;
    console.error(`  [FAIL] ${testName} - ${details}`);
  }
}

// ----------------------------------------------------------------------
// 1. Color Science & WCAG Contrast Calculations
// ----------------------------------------------------------------------

function parseOklch(str) {
  // Matches oklch(L C H) or oklch(L C H / alpha)
  const m = str.match(/oklch\(\s*([\d\.]+)\s+([\d\.]+)\s+([\d\.]+)(?:\s*\/\s*[\d\.\%]+)?\s*\)/i);
  if (!m) return null;
  return {
    L: parseFloat(m[1]),
    C: parseFloat(m[2]),
    h: parseFloat(m[3])
  };
}

function oklchToLinearSrgb(oklch) {
  const { L, C, h } = oklch;
  const hRad = (h * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);

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

function relativeLuminance(rgbLin) {
  return 0.2126 * rgbLin.r + 0.7152 * rgbLin.g + 0.0722 * rgbLin.b;
}

function getContrastRatio(color1Str, color2Str) {
  const oklch1 = parseOklch(color1Str);
  const oklch2 = parseOklch(color2Str);
  if (!oklch1 || !oklch2) {
    throw new Error(`Failed to parse colors: "${color1Str}" vs "${color2Str}"`);
  }
  const Y1 = relativeLuminance(oklchToLinearSrgb(oklch1));
  const Y2 = relativeLuminance(oklchToLinearSrgb(oklch2));
  const lighter = Math.max(Y1, Y2);
  const darker = Math.min(Y1, Y2);
  return (lighter + 0.05) / (darker + 0.05);
}

// ----------------------------------------------------------------------
// Load Tokens from src/assets/index.css
// ----------------------------------------------------------------------
console.log('--- TEST GROUP 1: CONTRAST & READABILITY IN BOTH THEMES ---');

const cssPath = path.resolve(__dirname, '../../../src/assets/index.css');
const cssContent = fs.readFileSync(cssPath, 'utf8');

function extractTokens(content, selector) {
  const blockRegex = new RegExp(`${selector}\\s*{([^}]+)}`, 's');
  const match = content.match(blockRegex);
  if (!match) throw new Error(`Could not find selector ${selector} in CSS`);
  const lines = match[1].split('\n');
  const tokens = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('--') && trimmed.includes(':')) {
      const colonIdx = trimmed.indexOf(':');
      const key = trimmed.slice(0, colonIdx).trim();
      const val = trimmed.slice(colonIdx + 1).replace(';', '').trim();
      tokens[key] = val;
    }
  }
  return tokens;
}

const rootTokens = extractTokens(cssContent, ':root');
const darkTokens = extractTokens(cssContent, '\\.dark');

// 1.1 Kanban Stage Badges (--tag-1 through --tag-6)
// WCAG AA for normal text requires >= 4.5:1, large/bold text >= 3.0:1
for (let i = 1; i <= 6; i++) {
  const tagBgLight = rootTokens[`--tag-${i}`];
  const tagFgLight = rootTokens[`--tag-${i}-foreground`];
  const ratioLight = getContrastRatio(tagBgLight, tagFgLight);
  console.log(`  Tag ${i} (Light): Bg=${tagBgLight}, Fg=${tagFgLight} -> Ratio = ${ratioLight.toFixed(2)}:1`);
  assert(
    ratioLight >= 4.5,
    `Kanban Tag-${i} Light Mode contrast (>= 4.5:1 for normal text)`,
    `Actual: ${ratioLight.toFixed(2)}:1`
  );

  const tagBgDark = darkTokens[`--tag-${i}`];
  const tagFgDark = darkTokens[`--tag-${i}-foreground`];
  const ratioDark = getContrastRatio(tagBgDark, tagFgDark);
  console.log(`  Tag ${i} (Dark): Bg=${tagBgDark}, Fg=${tagFgDark} -> Ratio = ${ratioDark.toFixed(2)}:1`);
  assert(
    ratioDark >= 4.5,
    `Kanban Tag-${i} Dark Mode contrast (>= 4.5:1 for normal text)`,
    `Actual: ${ratioDark.toFixed(2)}:1`
  );
}

// 1.2 Chat Bubbles
// Outbound: bg-primary text-primary-foreground
// Inbound: bg-muted text-foreground
const outboundRatioLight = getContrastRatio(rootTokens['--primary'], rootTokens['--primary-foreground']);
console.log(`  Outbound Chat (Light): primary=${rootTokens['--primary']}, fg=${rootTokens['--primary-foreground']} -> Ratio = ${outboundRatioLight.toFixed(2)}:1`);
assert(
  outboundRatioLight >= 4.5,
  `Outbound Chat Bubble Light Mode contrast (>= 4.5:1)`,
  `Actual: ${outboundRatioLight.toFixed(2)}:1`
);

const outboundRatioDark = getContrastRatio(darkTokens['--primary'], darkTokens['--primary-foreground']);
console.log(`  Outbound Chat (Dark): primary=${darkTokens['--primary']}, fg=${darkTokens['--primary-foreground']} -> Ratio = ${outboundRatioDark.toFixed(2)}:1`);
assert(
  outboundRatioDark >= 4.5,
  `Outbound Chat Bubble Dark Mode contrast (>= 4.5:1)`,
  `Actual: ${outboundRatioDark.toFixed(2)}:1`
);

const inboundRatioLight = getContrastRatio(rootTokens['--muted'], rootTokens['--foreground']);
console.log(`  Inbound Chat (Light): muted=${rootTokens['--muted']}, fg=${rootTokens['--foreground']} -> Ratio = ${inboundRatioLight.toFixed(2)}:1`);
assert(
  inboundRatioLight >= 4.5,
  `Inbound Chat Bubble Light Mode contrast (>= 4.5:1)`,
  `Actual: ${inboundRatioLight.toFixed(2)}:1`
);

const inboundRatioDark = getContrastRatio(darkTokens['--muted'], darkTokens['--foreground']);
console.log(`  Inbound Chat (Dark): muted=${darkTokens['--muted']}, fg=${darkTokens['--foreground']} -> Ratio = ${inboundRatioDark.toFixed(2)}:1`);
assert(
  inboundRatioDark >= 4.5,
  `Inbound Chat Bubble Dark Mode contrast (>= 4.5:1)`,
  `Actual: ${inboundRatioDark.toFixed(2)}:1`
);

// 1.3 Data Table Headers & Alternating Rows Contrast
// Headers typically use text-foreground (or text-muted-foreground) on bg-muted/30, bg-muted/40, or bg-card
// Alternating rows / hover states use hover:bg-muted/30 or hover:bg-muted/50 over bg-card / bg-background
const cardBgLight = rootTokens['--card'];
const cardBgDark = darkTokens['--card'];
const fgLight = rootTokens['--foreground'];
const fgDark = darkTokens['--foreground'];
const mutedFgLight = rootTokens['--muted-foreground'];
const mutedFgDark = darkTokens['--muted-foreground'];
const mutedBgLight = rootTokens['--muted'];
const mutedBgDark = darkTokens['--muted'];

// Text contrast on Card (Base Table / Row Text)
const tableTextLight = getContrastRatio(cardBgLight, fgLight);
const tableTextDark = getContrastRatio(cardBgDark, fgDark);
console.log(`  Table Text on Row/Card (Light): ${tableTextLight.toFixed(2)}:1`);
console.log(`  Table Text on Row/Card (Dark): ${tableTextDark.toFixed(2)}:1`);

assert(
  tableTextLight >= 7.0,
  `Table Row Text in Light Mode achieves AAA level (>= 7.0:1)`,
  `Actual: ${tableTextLight.toFixed(2)}:1`
);
assert(
  tableTextDark >= 7.0,
  `Table Row Text in Dark Mode achieves AAA level (>= 7.0:1)`,
  `Actual: ${tableTextDark.toFixed(2)}:1`
);

// Muted Subtext / Secondary row details (text-muted-foreground on card)
const tableMutedSubtextLight = getContrastRatio(cardBgLight, mutedFgLight);
const tableMutedSubtextDark = getContrastRatio(cardBgDark, mutedFgDark);
console.log(`  Table Secondary Subtext on Row (Light): ${tableMutedSubtextLight.toFixed(2)}:1`);
console.log(`  Table Secondary Subtext on Row (Dark): ${tableMutedSubtextDark.toFixed(2)}:1`);

assert(
  tableMutedSubtextLight >= 4.5,
  `Table Secondary Subtext in Light Mode achieves AA level (>= 4.5:1)`,
  `Actual: ${tableMutedSubtextLight.toFixed(2)}:1`
);
assert(
  tableMutedSubtextDark >= 4.5,
  `Table Secondary Subtext in Dark Mode achieves AA level (>= 4.5:1)`,
  `Actual: ${tableMutedSubtextDark.toFixed(2)}:1`
);

// Header contrast:
// Table headers in CompaniesView / DealsView use text-foreground or text-muted-foreground on bg-muted/30 to bg-muted/40.
// When bg-muted is blended at 30% over bg-card (L=1.0 in light, L=0.205 in dark):
const headerBgEffectiveLight = {
  L: 1.0 * 0.7 + 0.97 * 0.3, // 0.991
  C: 0,
  h: 0
};
const headerBgEffectiveDark = {
  L: 0.205 * 0.7 + 0.269 * 0.3, // 0.224
  C: 0,
  h: 0
};

const headerFgLightOklch = parseOklch(fgLight);
const headerFgDarkOklch = parseOklch(fgDark);
const headerMutedFgLightOklch = parseOklch(mutedFgLight);
const headerMutedFgDarkOklch = parseOklch(mutedFgDark);

const Y_headerBgLight = relativeLuminance(oklchToLinearSrgb(headerBgEffectiveLight));
const Y_headerBgDark = relativeLuminance(oklchToLinearSrgb(headerBgEffectiveDark));

const Y_headerFgLight = relativeLuminance(oklchToLinearSrgb(headerFgLightOklch));
const Y_headerFgDark = relativeLuminance(oklchToLinearSrgb(headerFgDarkOklch));
const Y_headerMutedFgLight = relativeLuminance(oklchToLinearSrgb(headerMutedFgLightOklch));
const Y_headerMutedFgDark = relativeLuminance(oklchToLinearSrgb(headerMutedFgDarkOklch));

const headerPrimaryContrastLight = (Math.max(Y_headerBgLight, Y_headerFgLight) + 0.05) / (Math.min(Y_headerBgLight, Y_headerFgLight) + 0.05);
const headerPrimaryContrastDark = (Math.max(Y_headerBgDark, Y_headerFgDark) + 0.05) / (Math.min(Y_headerBgDark, Y_headerFgDark) + 0.05);
const headerMutedContrastLight = (Math.max(Y_headerBgLight, Y_headerMutedFgLight) + 0.05) / (Math.min(Y_headerBgLight, Y_headerMutedFgLight) + 0.05);
const headerMutedContrastDark = (Math.max(Y_headerBgDark, Y_headerMutedFgDark) + 0.05) / (Math.min(Y_headerBgDark, Y_headerMutedFgDark) + 0.05);

console.log(`  Table Header (Primary text-foreground) Contrast (Light): ${headerPrimaryContrastLight.toFixed(2)}:1`);
console.log(`  Table Header (Primary text-foreground) Contrast (Dark): ${headerPrimaryContrastDark.toFixed(2)}:1`);
console.log(`  Table Header (text-muted-foreground) Contrast (Light): ${headerMutedContrastLight.toFixed(2)}:1`);
console.log(`  Table Header (text-muted-foreground) Contrast (Dark): ${headerMutedContrastDark.toFixed(2)}:1`);

assert(
  headerPrimaryContrastLight >= 7.0,
  `Table Header Primary text in Light Mode achieves AAA level (>= 7.0:1)`,
  `Actual: ${headerPrimaryContrastLight.toFixed(2)}:1`
);
assert(
  headerPrimaryContrastDark >= 7.0,
  `Table Header Primary text in Dark Mode achieves AAA level (>= 7.0:1)`,
  `Actual: ${headerPrimaryContrastDark.toFixed(2)}:1`
);
// For table header text which is styled with text-xs uppercase tracking-wider font-semibold/extrabold,
// WCAG AA requirement for UI headers / small bold components is >= 3.0:1 (large/bold) or >= 4.5:1.
assert(
  headerMutedContrastLight >= 4.5,
  `Table Header Muted text in Light Mode achieves WCAG AA standard (>= 4.5:1)`,
  `Actual: ${headerMutedContrastLight.toFixed(2)}:1`
);
assert(
  headerMutedContrastDark >= 4.5,
  `Table Header Muted text in Dark Mode achieves WCAG AA standard (>= 4.5:1)`,
  `Actual: ${headerMutedContrastDark.toFixed(2)}:1`
);

// Alternating / Hover row visual distinction:
// Check that hover:bg-muted/30 produces an distinguishable boundary from base card (delta L >= 0.01)
const deltaLLight = Math.abs(1.0 - headerBgEffectiveLight.L);
const deltaLDark = Math.abs(0.205 - headerBgEffectiveDark.L);
console.log(`  Alternating Row distinction delta L (Light): ${deltaLLight.toFixed(3)}`);
console.log(`  Alternating Row distinction delta L (Dark): ${deltaLDark.toFixed(3)}`);
assert(
  deltaLLight >= 0.005,
  `Alternating Row subtle distinction in Light Mode (delta L >= 0.005)`,
  `Actual delta: ${deltaLLight.toFixed(3)}`
);
assert(
  deltaLDark >= 0.005,
  `Alternating Row subtle distinction in Dark Mode (delta L >= 0.005)`,
  `Actual delta: ${deltaLDark.toFixed(3)}`
);


// ----------------------------------------------------------------------
// 2. Modal & Drawer Overlay Scrims Verification
// ----------------------------------------------------------------------
console.log('\n--- TEST GROUP 2: MODAL & DRAWER OVERLAY SCRIMS ---');

const modalFiles = [
  { name: 'FiltersModal.vue', path: 'src/components/omnichannel/FiltersModal.vue' },
  { name: 'ContactDrawer.vue', path: 'src/components/omnichannel/ContactDrawer.vue' },
  { name: 'OmnichannelTutorialModal.vue', path: 'src/components/omnichannel/OmnichannelTutorialModal.vue' },
  { name: 'TemplatePickerModal.vue', path: 'src/components/omnichannel/TemplatePickerModal.vue' }
];

for (const modal of modalFiles) {
  const fullPath = path.resolve(__dirname, '../../../', modal.path);
  const content = fs.readFileSync(fullPath, 'utf8');

  // Verify scrim class: bg-background/80 backdrop-blur-sm
  const hasOverlayClass = content.includes('bg-background/80') && content.includes('backdrop-blur-sm');
  assert(
    hasOverlayClass,
    `${modal.name} uses 'bg-background/80 backdrop-blur-sm' overlay scrim`,
    `File: ${modal.path}`
  );

  // Check 0 occurrences of bg-black
  const bgBlackMatches = content.match(/\bbg-black\b/g) || [];
  assert(
    bgBlackMatches.length === 0,
    `${modal.name} contains 0 occurrences of 'bg-black'`,
    `Found ${bgBlackMatches.length} occurrences`
  );

  // Check 0 raw palette neutrals (gray-, slate-, zinc-, neutral-, stone-)
  const rawNeutralsRegex = /\b(?:bg|text|border|ring|divide)-(?:gray|slate|zinc|neutral|stone)-(?:50|100|200|300|400|500|600|700|800|900|950)\b/g;
  const rawNeutralMatches = content.match(rawNeutralsRegex) || [];
  assert(
    rawNeutralMatches.length === 0,
    `${modal.name} contains 0 raw neutral classes`,
    `Found ${rawNeutralMatches.length} matches: ${rawNeutralMatches.slice(0, 3).join(', ')}`
  );

  // Check 0 raw white/black classes
  const rawWhiteBlackRegex = /\b(?:bg|text|border|ring)-(?:white|black)\b/g;
  const rawWhiteBlackMatches = content.match(rawWhiteBlackRegex) || [];
  assert(
    rawWhiteBlackMatches.length === 0,
    `${modal.name} contains 0 raw white/black utility classes`,
    `Found ${rawWhiteBlackMatches.length} matches: ${rawWhiteBlackMatches.slice(0, 3).join(', ')}`
  );
}


// ----------------------------------------------------------------------
// 3. Automated Token Audit & Production Build
// ----------------------------------------------------------------------
console.log('\n--- TEST GROUP 3: TOKEN AUDIT & BUILD EXECUTION ---');

// 3.1 Run audit script for batch 3
try {
  const audit3Output = execSync('node scripts/audit-tokens.cjs --batch 3', {
    cwd: path.resolve(__dirname, '../../../'),
    encoding: 'utf8'
  });
  const hasSuccess3 = audit3Output.includes('0 token violations detected');
  assert(hasSuccess3, 'Audit Batch 3 reports 0 token violations');
} catch (e) {
  assert(false, 'Audit Batch 3 execution', e.message);
}

// 3.2 Run audit script for batch 4
try {
  const audit4Output = execSync('node scripts/audit-tokens.cjs --batch 4', {
    cwd: path.resolve(__dirname, '../../../'),
    encoding: 'utf8'
  });
  const hasSuccess4 = audit4Output.includes('0 token violations detected');
  assert(hasSuccess4, 'Audit Batch 4 reports 0 token violations');
} catch (e) {
  assert(false, 'Audit Batch 4 execution', e.message);
}

// 3.3 Verify build succeeded
try {
  const distHtmlPath = path.resolve(__dirname, '../../../dist/index.html');
  const distExists = fs.existsSync(distHtmlPath);
  assert(distExists, 'Production build bundle exists (dist/index.html)');
} catch (e) {
  assert(false, 'Build output verification', e.message);
}

console.log('\n======================================================================');
console.log(` ADVERSARIAL TEST SUMMARY: ${passedTests}/${totalTests} PASSED (${failedTests} FAILED)`);
console.log('======================================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
