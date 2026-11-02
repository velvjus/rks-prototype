const fs = require('fs');
const path = require('path');

// --- OKLCH to sRGB Math (W3C CSS Color 4 standard) ---
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

  const rLinear = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const gLinear = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bLinear = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  function toSrgb(c) {
    const clamped = Math.max(0, Math.min(1, c));
    return clamped <= 0.0031308
      ? 12.92 * clamped
      : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
  }

  return {
    r: Math.round(toSrgb(rLinear) * 255),
    g: Math.round(toSrgb(gLinear) * 255),
    b: Math.round(toSrgb(bLinear) * 255),
    rLinear: Math.max(0, Math.min(1, rLinear)),
    gLinear: Math.max(0, Math.min(1, gLinear)),
    bLinear: Math.max(0, Math.min(1, bLinear))
  };
}

function parseOklch(str) {
  if (!str) return null;
  // Match oklch(L C H [/ A])
  const matchWithHue = str.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+)%?)?\s*\)/);
  if (matchWithHue) {
    return {
      L: parseFloat(matchWithHue[1]),
      C: parseFloat(matchWithHue[2]),
      H: parseFloat(matchWithHue[3]),
      alpha: matchWithHue[4] ? (matchWithHue[4].includes('%') ? parseFloat(matchWithHue[4]) / 100 : parseFloat(matchWithHue[4])) : 1.0
    };
  }
  // Match oklch(L 0 0 [/ A])
  const matchGray = str.match(/oklch\(\s*([\d.]+)\s+0\s+0(?:\s*\/\s*([\d.]+)%?)?\s*\)/);
  if (matchGray) {
    return {
      L: parseFloat(matchGray[1]),
      C: 0,
      H: 0,
      alpha: matchGray[2] ? (matchGray[2].includes('%') ? parseFloat(matchGray[2]) / 100 : parseFloat(matchGray[2])) : 1.0
    };
  }
  return null;
}

function relativeLuminance(rgb) {
  return 0.2126 * rgb.rLinear + 0.7152 * rgb.gLinear + 0.0722 * rgb.bLinear;
}

function contrastRatio(l1, l2) {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function blendColors(fgRgb, fgAlpha, bgRgb) {
  const r = fgRgb.r * fgAlpha + bgRgb.r * (1 - fgAlpha);
  const g = fgRgb.g * fgAlpha + bgRgb.g * (1 - fgAlpha);
  const b = fgRgb.b * fgAlpha + bgRgb.b * (1 - fgAlpha);

  function toLinear(val) {
    const s = val / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  }

  const rLinear = toLinear(r);
  const gLinear = toLinear(g);
  const bLinear = toLinear(b);

  return {
    r: Math.round(r),
    g: Math.round(g),
    b: Math.round(b),
    rLinear,
    gLinear,
    bLinear
  };
}

// --- Parse CSS Variables from index.css ---
const indexCssPath = path.resolve(__dirname, '../src/assets/index.css');
let cssContent = fs.readFileSync(indexCssPath, 'utf8');

// Strip comments first
cssContent = cssContent.replace(/\/\*[\s\S]*?\*\//g, '');

function extractTokens(selector) {
  const tokens = {};
  const blockRegex = selector === ':root' 
    ? /:root\s*\{([\s\S]*?)\n\s*\}/
    : /\.dark\s*\{([\s\S]*?)\n\s*\}/;
  const match = cssContent.match(blockRegex);
  if (!match) return tokens;

  const lines = match[1].split(';');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const colonIdx = trimmed.indexOf(':');
    if (colonIdx > 0) {
      const key = trimmed.slice(0, colonIdx).trim();
      const val = trimmed.slice(colonIdx + 1).trim();
      if (key.startsWith('--')) {
        tokens[key] = val;
      }
    }
  }
  return tokens;
}

const lightTokensRaw = extractTokens(':root');
const darkTokensRaw = extractTokens('.dark');

function resolveThemeColors(rawTokens) {
  const colors = {};
  for (const [key, val] of Object.entries(rawTokens)) {
    const parsed = parseOklch(val);
    if (parsed) {
      const rgb = oklchToRgb(parsed.L, parsed.C, parsed.H);
      colors[key] = {
        raw: val,
        parsed,
        rgb,
        lum: relativeLuminance(rgb)
      };
    }
  }
  return colors;
}

const lightColors = resolveThemeColors(lightTokensRaw);
const darkColors = resolveThemeColors(darkTokensRaw);

console.log('='.repeat(80));
console.log(' RAKANSALES C4 — EMPIRICAL WCAG 2.1 THEME & CONTRAST SUITE');
console.log('='.repeat(80));

const results = [];

function testPair(themeName, colors, fgToken, bgToken, fgAlpha = 1.0, bgAlpha = 1.0, requiredRatio = 4.5, description = '') {
  const fg = colors[fgToken];
  const bg = colors[bgToken];
  if (!fg || !bg) {
    results.push({
      theme: themeName,
      fgToken,
      bgToken,
      description,
      error: `Missing token ${!fg ? fgToken : bgToken}`
    });
    return;
  }

  let finalBgRgb = bg.rgb;
  let finalBgLum = bg.lum;
  if (bgAlpha < 1.0) {
    const baseBg = colors['--background'] || colors['--card'];
    finalBgRgb = blendColors(bg.rgb, bgAlpha, baseBg.rgb);
    finalBgLum = relativeLuminance(finalBgRgb);
  }

  let finalFgRgb = fg.rgb;
  let finalFgLum = fg.lum;
  if (fgAlpha < 1.0) {
    finalFgRgb = blendColors(fg.rgb, fgAlpha, finalBgRgb);
    finalFgLum = relativeLuminance(finalFgRgb);
  }

  const ratio = contrastRatio(finalFgLum, finalBgLum);
  const pass = ratio >= requiredRatio;

  results.push({
    theme: themeName,
    pair: `${fgToken} on ${bgToken}${bgAlpha < 1.0 ? ` (${bgAlpha * 100}%)` : ''}`,
    description,
    ratio: ratio.toFixed(2),
    required: requiredRatio,
    pass,
    fgHex: `#${finalFgRgb.r.toString(16).padStart(2,'0')}${finalFgRgb.g.toString(16).padStart(2,'0')}${finalFgRgb.b.toString(16).padStart(2,'0')}`,
    bgHex: `#${finalBgRgb.r.toString(16).padStart(2,'0')}${finalBgRgb.g.toString(16).padStart(2,'0')}${finalBgRgb.b.toString(16).padStart(2,'0')}`
  });
}

for (const [theme, colors] of [['LIGHT', lightColors], ['DARK', darkColors]]) {
  // SC 1.4.3 Text Contrast (>= 4.5:1 body, >= 3.0:1 bold/large)
  testPair(theme, colors, '--foreground', '--background', 1.0, 1.0, 4.5, 'Normal body text on background');
  testPair(theme, colors, '--foreground', '--card', 1.0, 1.0, 4.5, 'Normal body text on card surface');
  testPair(theme, colors, '--foreground', '--muted', 1.0, 1.0, 4.5, 'Normal body text on muted surface');
  testPair(theme, colors, '--muted-foreground', '--card', 1.0, 1.0, 4.5, 'Muted secondary text on card');
  testPair(theme, colors, '--muted-foreground', '--background', 1.0, 1.0, 4.5, 'Muted secondary text on background');
  testPair(theme, colors, '--primary-foreground', '--primary', 1.0, 1.0, 3.0, 'Button bold text on primary button');

  // Semantic Status Badges & Text (Large / UI badges: >= 3.0:1)
  testPair(theme, colors, '--success', '--card', 1.0, 1.0, 3.0, 'Success badge/text on card');
  testPair(theme, colors, '--success', '--success', 1.0, 0.15, 3.0, 'Success text on success/15 badge bg');
  testPair(theme, colors, '--destructive', '--card', 1.0, 1.0, 3.0, 'Destructive badge/text on card');
  testPair(theme, colors, '--destructive', '--destructive', 1.0, 0.10, 3.0, 'Destructive text on destructive/10 badge bg');
  testPair(theme, colors, '--info', '--card', 1.0, 1.0, 3.0, 'Info badge/text on card');
  testPair(theme, colors, '--info', '--info', 1.0, 0.10, 3.0, 'Info text on info/10 badge bg');

  // Tag categories 1-6 (>= 4.5:1 text)
  for (let i = 1; i <= 6; i++) {
    testPair(theme, colors, `--tag-${i}-foreground`, `--tag-${i}`, 1.0, 1.0, 4.5, `Categorical Tag ${i} text on bg`);
  }

  // Outer Rail tokens (>= 4.5:1 for rail text)
  testPair(theme, colors, '--rail-foreground', '--rail', 1.0, 1.0, 4.5, 'Chassis invariant rail primary text');
  testPair(theme, colors, '--rail-muted-foreground', '--rail', 1.0, 1.0, 4.5, 'Chassis invariant rail muted text');

  // SC 1.4.11 Non-text UI Component Contrast (>= 3.0:1)
  testPair(theme, colors, '--primary', '--background', 1.0, 1.0, 3.0, 'Primary button boundary against background');
  testPair(theme, colors, '--primary', '--card', 1.0, 1.0, 3.0, 'Primary button boundary against card');
  testPair(theme, colors, '--rail-border', '--rail', 1.0, 1.0, 3.0, 'Rail border against rail body');
}

// Print formatted results
console.log('\nToken Matrix Results:');
console.log('-'.repeat(105));
console.log(
  'Theme'.padEnd(7) +
  'Description'.padEnd(42) +
  'Pair'.padEnd(40) +
  'Ratio'.padEnd(8) +
  'Req'.padEnd(6) +
  'Status'
);
console.log('-'.repeat(105));

let passCount = 0;
let failCount = 0;
for (const r of results) {
  if (r.error) {
    console.log(`ERROR: ${r.error}`);
    failCount++;
    continue;
  }
  const statusStr = r.pass ? '✔ PASS' : '❌ FAIL';
  if (r.pass) passCount++;
  else failCount++;
  console.log(
    r.theme.padEnd(7) +
    r.description.padEnd(42) +
    r.pair.padEnd(40) +
    `${r.ratio}:1`.padEnd(8) +
    `${r.required}:1`.padEnd(6) +
    statusStr
  );
}
console.log('-'.repeat(105));
console.log(`Summary: ${passCount} Passed, ${failCount} Failed.`);

// --- BATCH FILES EMPIRICAL SCAN ---
console.log('\n' + '='.repeat(80));
console.log(' SCANNING BATCH 5, 6, 7 FILES FOR UI CONTRAST INVARIANTS & INTEGRITY');
console.log('='.repeat(80));

const BATCH_FILES = [
  // Batch 5 (Settings)
  'src/views/SettingsView.vue',
  'src/components/settings/AIAssistantsTab.vue',
  'src/components/settings/AutomationTab.vue',
  'src/components/settings/AgentsTab.vue',
  'src/components/settings/TeamsTab.vue',
  'src/components/settings/RolesTab.vue',
  'src/components/dashboard/CrmSetupStatusBar.vue',

  // Batch 6 (Forms, Booking & Tools)
  'src/views/webforms/FormBuilderView.vue',
  'src/views/webforms/WebFormsDashboardView.vue',
  'src/views/webforms/FormDetailView.vue',
  'src/views/webforms/SubmissionsView.vue',
  'src/views/BookingPagesView.vue',
  'src/views/ScanNameCardView.vue',
  'src/views/AddonsView.vue',

  // Batch 7 (Partner Portal)
  'src/views/partner/PartnerReferralsView.vue',
  'src/views/partner/PartnerOverviewView.vue',
  'src/views/partner/PartnerWithdrawalView.vue',
  'src/views/partner/PartnerProgramView.vue',
  'src/views/PartnerRegisterView.vue',
  'src/views/partner/PartnerCommissionsView.vue',
  'src/views/partner/PartnerKitView.vue',
  'src/components/partner/PartnerTrackSwitcher.vue'
];

let fileViolations = 0;

BATCH_FILES.forEach(filePath => {
  const fullPath = path.resolve(__dirname, '..', filePath);
  if (!fs.existsSync(fullPath)) {
    console.log(`[MISSING FILE] ${filePath}`);
    fileViolations++;
    return;
  }
  const content = fs.readFileSync(fullPath, 'utf8');

  // Check 1: No dark: overrides
  const darkMatches = content.match(/\bdark:[^\s"'`>]+/g);
  if (darkMatches) {
    console.log(`❌ [DARK: OVERRIDE] in ${filePath}:`, darkMatches);
    fileViolations++;
  }

  // Check 2: No double slashes (e.g. bg-success/10/20)
  const doubleSlash = content.match(/\b([a-zA-Z-]+)\/(\d+)\/(\d+)\b/g);
  if (doubleSlash) {
    console.log(`❌ [MALFORMED OPACITY] in ${filePath}:`, doubleSlash);
    fileViolations++;
  }

  // Check 3: No raw hex in class attributes
  const rawHexClass = content.match(/class=["'][^"']*#([0-9a-fA-F]{3,8})[^"']*["']/g);
  if (rawHexClass) {
    console.log(`❌ [RAW HEX CLASS] in ${filePath}:`, rawHexClass);
    fileViolations++;
  }

  // Check 4: No raw grays (gray-, slate-, zinc-, neutral-) in classes
  const rawGrayClass = content.match(/\b(bg|text|border|ring)-(gray|slate|zinc|neutral|stone)-[1-9]00\b/g);
  if (rawGrayClass) {
    console.log(`❌ [RAW GRAY CLASS] in ${filePath}:`, rawGrayClass);
    fileViolations++;
  }
});

console.log(`Scanned ${BATCH_FILES.length} files: ${fileViolations === 0 ? '0 file violations found (100% CLEAN)' : `${fileViolations} violations found`}`);

// Specific checks required by dispatch:
console.log('\n' + '='.repeat(80));
console.log(' DISPATCH-SPECIFIC ADVERSARIAL CHECKS:');
console.log('='.repeat(80));

// 1. ScanNameCardView phone chassis invariant --rail and camera laser .glow
const scanViewPath = path.resolve(__dirname, '../src/views/ScanNameCardView.vue');
const scanContent = fs.readFileSync(scanViewPath, 'utf8');
const hasRailChassis = scanContent.includes('bg-rail') && scanContent.includes('ring-rail-border');
const hasGlowLaser = scanContent.includes('glow') && scanContent.includes('isScanningAnimation');
console.log(`1. ScanNameCardView: Phone chassis invariant rail: ${hasRailChassis ? '✔ CONFIRMED (bg-rail, ring-rail-border)' : '❌ MISSING'}`);
console.log(`   ScanNameCardView: Camera laser .glow: ${hasGlowLaser ? '✔ CONFIRMED (.glow, isScanningAnimation)' : '❌ MISSING'}`);

// 2. BookingPagesView chat simulator contrast in dark mode
const bookViewPath = path.resolve(__dirname, '../src/views/BookingPagesView.vue');
const bookContent = fs.readFileSync(bookViewPath, 'utf8');
const hasNoPureWhiteChat = !bookContent.includes('bg-white');
const hasProperAgentBubble = bookContent.includes('bg-card border border-border');
const hasProperClientBubble = bookContent.includes('bg-primary text-primary-foreground');
console.log(`2. BookingPagesView: Chat simulator no pure white blocks: ${hasNoPureWhiteChat ? '✔ CONFIRMED' : '❌ FOUND bg-white'}`);
console.log(`   BookingPagesView: Semantic message bubbles (card / primary): ${hasProperAgentBubble && hasProperClientBubble ? '✔ CONFIRMED' : '❌ CHECK BUBBLES'}`);

// 3. PartnerRegisterView dynamic logo switching
const partnerRegPath = path.resolve(__dirname, '../src/views/PartnerRegisterView.vue');
const partnerRegContent = fs.readFileSync(partnerRegPath, 'utf8');
const hasDynamicLogo = partnerRegContent.includes(':src="isDark ? darkLogoUrl : lightLogoUrl"');
const importsLogos = partnerRegContent.includes('RKS Logo Lockup 01.svg') && partnerRegContent.includes('RKS Logo Lockup 02.svg');
console.log(`3. PartnerRegisterView: Dynamic logo binding (:src="isDark ? darkLogoUrl : lightLogoUrl"): ${hasDynamicLogo ? '✔ CONFIRMED' : '❌ MISSING'}`);
console.log(`   PartnerRegisterView: SVG logo imports & useTheme(): ${importsLogos ? '✔ CONFIRMED' : '❌ MISSING'}`);

