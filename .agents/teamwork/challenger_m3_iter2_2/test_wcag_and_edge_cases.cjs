/**
 * Empirical WCAG Contrast & Edge Case Test Harness
 * Milestone 3 (Iteration 2) Challenger 2
 */

// OKLCH to linear sRGB & sRGB conversion
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

  // Clamped linear RGB
  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  const r_lin_c = clamp01(r_lin);
  const g_lin_c = clamp01(g_lin);
  const b_lin_c = clamp01(b_lin);

  // Gamma transfer function
  const gamma = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);

  return {
    rLin: r_lin_c,
    gLin: g_lin_c,
    bLin: b_lin_c,
    r: Math.round(clamp01(gamma(r_lin_c)) * 255),
    g: Math.round(clamp01(gamma(g_lin_c)) * 255),
    b: Math.round(clamp01(gamma(b_lin_c)) * 255),
    a: alpha
  };
}

// Relative luminance from linear sRGB
function relativeLuminance(rgb) {
  return 0.2126 * rgb.rLin + 0.7152 * rgb.gLin + 0.0722 * rgb.bLin;
}

// Contrast ratio
function contrastRatio(rgb1, rgb2) {
  const lum1 = relativeLuminance(rgb1);
  const lum2 = relativeLuminance(rgb2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Alpha blend fg over bg
function blend(fg, bg, alpha) {
  const rLin = fg.rLin * alpha + bg.rLin * (1 - alpha);
  const gLin = fg.gLin * alpha + bg.gLin * (1 - alpha);
  const bLin = fg.bLin * alpha + bg.bLin * (1 - alpha);
  return {
    rLin,
    gLin,
    bLin,
    r: Math.round(rLin * 255),
    g: Math.round(gLin * 255),
    b: Math.round(bLin * 255),
    a: 1
  };
}

// Design Tokens Definitions
const lightTokens = {
  background: oklchToRgb(1, 0, 0),
  foreground: oklchToRgb(0.145, 0, 0),
  card: oklchToRgb(1, 0, 0),
  cardForeground: oklchToRgb(0.145, 0, 0),
  primary: oklchToRgb(0.527, 0.154, 150.069),
  primaryForeground: oklchToRgb(0.982, 0.018, 155.826),
  muted: oklchToRgb(0.97, 0, 0),
  mutedForeground: oklchToRgb(0.556, 0, 0),
  border: oklchToRgb(0.922, 0, 0),
  success: oklchToRgb(0.627, 0.194, 149.214),
  successForeground: oklchToRgb(0.985, 0, 0),
  warning: oklchToRgb(0.769, 0.188, 70.08),
  warningForeground: oklchToRgb(0.145, 0, 0),
  info: oklchToRgb(0.623, 0.188, 250.3),
  infoForeground: oklchToRgb(0.985, 0, 0),
  destructive: oklchToRgb(0.577, 0.245, 27.325),
  destructiveForeground: oklchToRgb(0.985, 0, 0),
  tag6: oklchToRgb(0.95, 0.05, 195),
  tag6Foreground: oklchToRgb(0.42, 0.14, 195),
};

const darkTokens = {
  background: oklchToRgb(0.145, 0, 0),
  foreground: oklchToRgb(0.985, 0, 0),
  card: oklchToRgb(0.205, 0, 0),
  cardForeground: oklchToRgb(0.985, 0, 0),
  primary: oklchToRgb(0.448, 0.119, 151.328),
  primaryForeground: oklchToRgb(0.982, 0.018, 155.826),
  muted: oklchToRgb(0.269, 0, 0),
  mutedForeground: oklchToRgb(0.708, 0, 0),
  border: blend(oklchToRgb(1, 0, 0), oklchToRgb(0.205, 0, 0), 0.10), // oklch(1 0 0 / 10%) on card
  success: oklchToRgb(0.69, 0.17, 150),
  successForeground: oklchToRgb(0.985, 0, 0),
  warning: oklchToRgb(0.78, 0.16, 70),
  warningForeground: oklchToRgb(0.145, 0, 0),
  info: oklchToRgb(0.68, 0.16, 250),
  infoForeground: oklchToRgb(0.985, 0, 0),
  destructive: oklchToRgb(0.704, 0.191, 22.216),
  destructiveForeground: oklchToRgb(0.985, 0, 0),
  tag6: oklchToRgb(0.25, 0.06, 195),
  tag6Foreground: oklchToRgb(0.85, 0.10, 195),
};

console.log("==========================================================================");
console.log(" EMPIRICAL WCAG CONTRAST AUDIT: LIGHT (:root) & DARK (.dark) MODES");
console.log("==========================================================================");

let totalPassed = 0;
let totalFailed = 0;

function evaluateCheck(name, ratio, minRequired, standard) {
  const pass = ratio >= minRequired;
  if (pass) {
    totalPassed++;
    console.log(`  ✔ PASS [${standard}]: ${name} -> ${ratio.toFixed(2)}:1 (min ${minRequired}:1)`);
  } else {
    totalFailed++;
    console.log(`  ❌ FAIL [${standard}]: ${name} -> ${ratio.toFixed(2)}:1 (requires ${minRequired}:1)`);
  }
}

// 1. DealsView.vue Avatar Fallbacks: User icon (text-muted-foreground) on bg-muted
console.log("\n[1. Avatar Component Fallbacks: text-muted-foreground on bg-muted]");
{
  const ratioLight = contrastRatio(lightTokens.mutedForeground, lightTokens.muted);
  // Graphical/UI icon contrast standard WCAG 2.1 SC 1.4.11 is 3.0:1
  evaluateCheck("Light Mode User icon on bg-muted", ratioLight, 3.0, "WCAG 2.1 AA UI");
  
  const ratioDark = contrastRatio(darkTokens.mutedForeground, darkTokens.muted);
  evaluateCheck("Dark Mode User icon on bg-muted", ratioDark, 3.0, "WCAG 2.1 AA UI");

  // Avatar border on card
  const borderLight = contrastRatio(lightTokens.border, lightTokens.card);
  const borderDark = contrastRatio(darkTokens.border, darkTokens.card);
  console.log(`  ℹ Info: Avatar border-border on card: Light ${borderLight.toFixed(2)}:1, Dark ${borderDark.toFixed(2)}:1`);
}

// 2. DealsView.vue Loading Spinner: border-t-primary on card and against border-border track
console.log("\n[2. Loading Spinner: border-t-primary active indicator]");
{
  const spinLightCard = contrastRatio(lightTokens.primary, lightTokens.card);
  evaluateCheck("Light Mode border-t-primary vs card background", spinLightCard, 3.0, "WCAG 2.1 AA UI");
  
  const spinLightTrack = contrastRatio(lightTokens.primary, lightTokens.border);
  evaluateCheck("Light Mode border-t-primary vs border-border track", spinLightTrack, 3.0, "WCAG 2.1 AA UI");

  const spinDarkCard = contrastRatio(darkTokens.primary, darkTokens.card);
  evaluateCheck("Dark Mode border-t-primary vs card background", spinDarkCard, 3.0, "WCAG 2.1 AA UI");

  // Also check spinner label text
  const labelLight = contrastRatio(lightTokens.foreground, lightTokens.card);
  evaluateCheck("Light Mode spinner label text-foreground vs card", labelLight, 7.0, "WCAG 2.1 AAA Text");

  const labelDark = contrastRatio(darkTokens.foreground, darkTokens.card);
  evaluateCheck("Dark Mode spinner label text-foreground vs card", labelDark, 7.0, "WCAG 2.1 AAA Text");
}

// 3. EventsView.vue bg-tag-6 legend dot & categorical text
console.log("\n[3. EventsView.vue bg-tag-6 Legend Dot & Categorical Badges]");
{
  // bg-tag-6 dot on card
  const tag6DotLight = contrastRatio(lightTokens.tag6, lightTokens.card);
  // Note: in light mode tag-6 is subtle pastel bg oklch(0.95 0.05 195).
  // Against card (1.0), it has subtle contrast, but let's check tag-6-foreground on tag-6 and text-foreground
  const tag6BadgeTextLight = contrastRatio(lightTokens.tag6Foreground, lightTokens.tag6);
  evaluateCheck("Light Mode tag-6-foreground on tag-6 background", tag6BadgeTextLight, 4.5, "WCAG 2.1 AA Text");

  const tag6BadgeTextDark = contrastRatio(darkTokens.tag6Foreground, darkTokens.tag6);
  evaluateCheck("Dark Mode tag-6-foreground on tag-6 background", tag6BadgeTextDark, 4.5, "WCAG 2.1 AA Text");

  // The legend label in EventsView: <span class="font-bold text-foreground">14.78%</span>
  const legendTextLight = contrastRatio(lightTokens.foreground, lightTokens.card);
  evaluateCheck("Light Mode legend label text-foreground on card", legendTextLight, 7.0, "WCAG 2.1 AAA Text");
  
  const legendTextDark = contrastRatio(darkTokens.foreground, darkTokens.card);
  evaluateCheck("Dark Mode legend label text-foreground on card", legendTextDark, 7.0, "WCAG 2.1 AAA Text");
}

// 4. OmnichannelView.vue: Note mode bg-warning/10 border-warning/30 and AI Draft Glow
console.log("\n[4. OmnichannelView.vue Composer Modes]");
{
  // Light mode private note
  const noteBgLight = blend(lightTokens.warning, lightTokens.card, 0.10);
  const noteBorderLight = blend(lightTokens.warning, lightTokens.card, 0.30);
  const noteTextLight = contrastRatio(lightTokens.foreground, noteBgLight);
  evaluateCheck("Light Mode Note text-foreground on bg-warning/10", noteTextLight, 7.0, "WCAG 2.1 AAA Text");
  
  const noteBorderContrastLight = contrastRatio(noteBorderLight, lightTokens.card);
  console.log(`  ℹ Info: Light Mode Note border-warning/30 vs card: ${noteBorderContrastLight.toFixed(2)}:1`);

  // Dark mode private note
  const noteBgDark = blend(darkTokens.warning, darkTokens.card, 0.10);
  const noteBorderDark = blend(darkTokens.warning, darkTokens.card, 0.30);
  const noteTextDark = contrastRatio(darkTokens.foreground, noteBgDark);
  evaluateCheck("Dark Mode Note text-foreground on bg-warning/10", noteTextDark, 7.0, "WCAG 2.1 AAA Text");

  // AI draft glow: border-primary on card
  const aiBorderLight = contrastRatio(lightTokens.primary, lightTokens.card);
  evaluateCheck("Light Mode AI glow border-primary vs card", aiBorderLight, 3.0, "WCAG 2.1 AA UI");

  const aiBorderDark = contrastRatio(darkTokens.primary, darkTokens.card);
  evaluateCheck("Dark Mode AI glow border-primary vs card", aiBorderDark, 3.0, "WCAG 2.1 AA UI");
}

// 5. DealsView Drop Zones (Won / Lost / Archive)
console.log("\n[5. DealsView.vue Drop Zones (Won, Lost, Archive)]");
{
  // Won zone: bg-success/10 border-success/30
  const wonBgLight = blend(lightTokens.success, lightTokens.card, 0.10);
  const wonTextLight = contrastRatio(lightTokens.foreground, wonBgLight);
  evaluateCheck("Light Mode Won drop zone text-foreground vs bg-success/10", wonTextLight, 7.0, "WCAG 2.1 AAA Text");

  const wonBgDark = blend(darkTokens.success, darkTokens.card, 0.10);
  const wonTextDark = contrastRatio(darkTokens.foreground, wonBgDark);
  evaluateCheck("Dark Mode Won drop zone text-foreground vs bg-success/10", wonTextDark, 7.0, "WCAG 2.1 AAA Text");

  // Lost zone: bg-destructive/10 border-destructive/30
  const lostBgLight = blend(lightTokens.destructive, lightTokens.card, 0.10);
  const lostTextLight = contrastRatio(lightTokens.foreground, lostBgLight);
  evaluateCheck("Light Mode Lost drop zone text-foreground vs bg-destructive/10", lostTextLight, 7.0, "WCAG 2.1 AAA Text");

  const lostBgDark = blend(darkTokens.destructive, darkTokens.card, 0.10);
  const lostTextDark = contrastRatio(darkTokens.foreground, lostBgDark);
  evaluateCheck("Dark Mode Lost drop zone text-foreground vs bg-destructive/10", lostTextDark, 7.0, "WCAG 2.1 AAA Text");
}

// 6. Core Typography & Hover States
console.log("\n[6. Typography & Interactive Hover States]");
{
  const textMutedLight = contrastRatio(lightTokens.mutedForeground, lightTokens.card);
  evaluateCheck("Light Mode text-muted-foreground on card", textMutedLight, 4.5, "WCAG 2.1 AA Text");

  const textMutedDark = contrastRatio(darkTokens.mutedForeground, darkTokens.card);
  evaluateCheck("Dark Mode text-muted-foreground on card", textMutedDark, 4.5, "WCAG 2.1 AA Text");

  const textFgLight = contrastRatio(lightTokens.foreground, lightTokens.card);
  evaluateCheck("Light Mode text-foreground on card", textFgLight, 7.0, "WCAG 2.1 AAA Text");

  const textFgDark = contrastRatio(darkTokens.foreground, darkTokens.card);
  evaluateCheck("Dark Mode text-foreground on card", textFgDark, 7.0, "WCAG 2.1 AAA Text");
}

console.log("\n==========================================================================");
console.log(`TOTAL WCAG CHECKS: ${totalPassed + totalFailed} | PASSED: ${totalPassed} | FAILED: ${totalFailed}`);
console.log("==========================================================================");

if (totalFailed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
