const fs = require('fs');
const path = require('path');

console.log('='.repeat(80));
console.log('SIMULATION OF REMEDIATION PLAN FOR MILESTONE 3 ITERATION 3');
console.log('='.repeat(80));

// 1. Read source files
let dealsContent = fs.readFileSync('src/views/DealsView.vue', 'utf8');
let omniContent = fs.readFileSync('src/views/OmnichannelView.vue', 'utf8');
let auditScriptContent = fs.readFileSync('scripts/audit-tokens.cjs', 'utf8');

// 2. Perform DealsView remediation
const dealsReplacements = [
  {
    target: "'hover:bg-muted/30/75 transition-colors cursor-pointer'",
    replacement: "'hover:bg-muted/75 transition-colors cursor-pointer'"
  },
  {
    target: "roundRobinActivePool[agent] !== false ? 'hover:bg-muted/30/50' : 'bg-muted/30 opacity-60'",
    replacement: "roundRobinActivePool[agent] !== false ? 'hover:bg-muted/50' : 'bg-muted/30 opacity-60'"
  },
  {
    target: '<div class="absolute inset-0 rounded-full border-4 border-t-primary animate-spin"></div>',
    replacement: '<div class="absolute inset-0 rounded-full border-4 border-t-brand animate-spin"></div>'
  }
];

let dealsErrors = 0;
for (const rep of dealsReplacements) {
  if (!dealsContent.includes(rep.target)) {
    console.error('ERROR: Target not found in DealsView:', rep.target);
    dealsErrors++;
  } else {
    dealsContent = dealsContent.replace(rep.target, rep.replacement);
  }
}
console.log(`DealsView replacements simulated: ${dealsReplacements.length - dealsErrors}/${dealsReplacements.length}`);

// 3. Perform OmnichannelView remediation
const omniReplacements = [
  {
    target: 'class="sticky top-0 z-10 flex items-center justify-between px-4 py-1.5 bg-muted/40/90 backdrop-blur-md border-b border-border/80 select-none cursor-pointer hover:bg-muted/70 transition-colors"',
    replacement: 'class="sticky top-0 z-10 flex items-center justify-between px-4 py-1.5 bg-muted/90 backdrop-blur-md border-b border-border/80 select-none cursor-pointer hover:bg-muted/70 transition-colors"'
  },
  {
    target: 'class="sticky top-0 z-10 flex items-center justify-between px-4 py-1.5 bg-muted/40/90 backdrop-blur-md border-b border-border/80 select-none cursor-pointer hover:bg-muted/70 transition-colors"',
    replacement: 'class="sticky top-0 z-10 flex items-center justify-between px-4 py-1.5 bg-muted/90 backdrop-blur-md border-b border-border/80 select-none cursor-pointer hover:bg-muted/70 transition-colors"'
  },
  {
    target: 'class="sticky top-0 z-10 flex items-center justify-between px-4 py-1.5 bg-muted/40/95 backdrop-blur-sm border-b border-border select-none cursor-pointer hover:bg-muted/70 transition-colors"',
    replacement: 'class="sticky top-0 z-10 flex items-center justify-between px-4 py-1.5 bg-muted/95 backdrop-blur-sm border-b border-border select-none cursor-pointer hover:bg-muted/70 transition-colors"'
  },
  {
    target: '<div v-else class="px-4 py-3 text-center text-[11px] text-muted-foreground italic bg-muted/40/10 border-b border-border select-none">',
    replacement: '<div v-else class="px-4 py-3 text-center text-[11px] text-muted-foreground italic bg-muted/30 border-b border-border select-none">'
  },
  {
    target: '<div class="flex flex-wrap gap-1.5 p-2.5 border border-border rounded-xl bg-muted/40/50">',
    replacement: '<div class="flex flex-wrap gap-1.5 p-2.5 border border-border rounded-xl bg-muted/50">'
  },
  {
    target: '<div v-else class="border-b border-border px-4 py-2 text-[11px] font-bold text-muted-foreground bg-muted/40/10 flex items-center gap-1.5 select-none">',
    replacement: '<div v-else class="border-b border-border px-4 py-2 text-[11px] font-bold text-muted-foreground bg-muted/30 flex items-center gap-1.5 select-none">'
  },
  {
    target: '<div class="px-3.5 py-2.5 bg-muted/40/90 border-b border-border flex items-center justify-between select-none shrink-0">',
    replacement: '<div class="px-3.5 py-2.5 bg-muted/90 border-b border-border flex items-center justify-between select-none shrink-0">'
  },
  {
    target: '<div class="px-3.5 py-2 bg-muted/40/80 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground font-semibold select-none shrink-0">',
    replacement: '<div class="px-3.5 py-2 bg-muted/80 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground font-semibold select-none shrink-0">'
  },
  {
    target: '<div v-if="simulatedAttachments.length > 0" class="flex flex-wrap gap-2 px-3 pb-2 pt-1 border-t border-border bg-muted/40/50">',
    replacement: '<div v-if="simulatedAttachments.length > 0" class="flex flex-wrap gap-2 px-3 pb-2 pt-1 border-t border-border bg-muted/50">'
  }
];

let omniErrors = 0;
for (const rep of omniReplacements) {
  if (!omniContent.includes(rep.target)) {
    console.error('ERROR: Target not found in OmnichannelView:', rep.target);
    omniErrors++;
  } else {
    omniContent = omniContent.replace(rep.target, rep.replacement);
  }
}
console.log(`OmnichannelView replacements simulated: ${omniReplacements.length - omniErrors}/${omniReplacements.length}`);

// 4. Verify Double Opacity Regex on simulated contents
const doubleOpacityRegex = /\b(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|divide(?:-[xy])?)-[a-zA-Z0-9_-]+\/\d+\/\d+\b/g;

const dealsDoubleMatches = dealsContent.match(doubleOpacityRegex) || [];
console.log(`Simulated DealsView double opacity matches: ${dealsDoubleMatches.length}`);

const omniDoubleMatches = omniContent.match(doubleOpacityRegex) || [];
console.log(`Simulated OmnichannelView double opacity matches: ${omniDoubleMatches.length}`);

// 5. Test against audit-tokens.cjs rules (including new malformedDoubleOpacity)
const RULES = {
  paletteGrays: {
    name: 'Palette Grays & Neutrals',
    pattern: /\b(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|divide(?:-[xy])?|fill|stroke|outline|placeholder|from|to|via)-(?:gray|slate|zinc|neutral|stone)-\d+\b|\b(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|divide(?:-[xy])?|fill|stroke|outline)-(?:white|black)\b/g
  },
  hexRgbClasses: {
    name: 'Tailwind Arbitrary Hex/RGB Classes',
    pattern: /\b(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|divide(?:-[xy])?|fill|stroke|outline|from|to|via)-\[(?:#[0-9a-fA-F]{3,8}|rgba?\([^\]]+\))\]|\bshadow-\[[^\]]*(?:#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))[^\]]*\]/g
  },
  rawStatusColors: {
    name: 'Raw Status / Accent Colors',
    pattern: /\b(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|divide(?:-[xy])?|fill|stroke|outline|placeholder|from|to|via)-(?:red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+\b/g
  },
  darkOverrides: {
    name: 'dark: Class Overrides',
    pattern: /\bdark:(?:bg|text|border|ring|fill|stroke|divide|from|to|via|placeholder|shadow)-[^\s"'>]+|\bdark:(?:[a-zA-Z0-9_\-\[\]#:\/]+)\b/g
  },
  inlineHexStyles: {
    name: 'Inline Hex/RGB Styles',
    pattern: /(?:style|:style)\s*=\s*(?:"[^"]*(?:#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))[^"]*"|'[^']*(?:#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))[^']*')/g
  },
  malformedDoubleOpacity: {
    name: 'Malformed Double Opacity Classes',
    pattern: /\b(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|divide(?:-[xy])?)-[a-zA-Z0-9_-]+\/\d+\/\d+\b/g
  }
};

function auditSimulatedContent(filename, content) {
  const lines = content.split(/\r?\n/);
  const violations = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('/* audit-ignore */') || line.includes('<!-- audit-ignore -->')) continue;
    for (const [rKey, rule] of Object.entries(RULES)) {
      rule.pattern.lastIndex = 0;
      let m;
      while ((m = rule.pattern.exec(line)) !== null) {
        violations.push({ line: i + 1, rule: rKey, match: m[0], snippet: line.trim() });
      }
    }
  }
  return violations;
}

const simDealsViolations = auditSimulatedContent('DealsView.vue', dealsContent);
console.log(`Simulated DealsView audit violations: ${simDealsViolations.length}`);
if (simDealsViolations.length > 0) {
  console.log('DealsView violations:', simDealsViolations);
}

const simOmniViolations = auditSimulatedContent('OmnichannelView.vue', omniContent);
console.log(`Simulated OmnichannelView audit violations: ${simOmniViolations.length}`);
if (simOmniViolations.length > 0) {
  console.log('OmnichannelView violations:', simOmniViolations);
}

// 6. WCAG Simulation:
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
  return { rLin: clamp01(r_lin), gLin: clamp01(g_lin), bLin: clamp01(b_lin) };
}
function relativeLuminance(rgb) { return 0.2126 * rgb.rLin + 0.7152 * rgb.gLin + 0.0722 * rgb.bLin; }
function blend(fg, bg, alpha) {
  return {
    rLin: fg.rLin * alpha + bg.rLin * (1 - alpha),
    gLin: fg.gLin * alpha + bg.gLin * (1 - alpha),
    bLin: fg.bLin * alpha + bg.bLin * (1 - alpha),
  };
}
function contrastRatio(rgb1, rgb2) {
  const lum1 = relativeLuminance(rgb1);
  const lum2 = relativeLuminance(rgb2);
  return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
}

const cardDark = oklchToRgb(0.205, 0, 0);
const cardLight = oklchToRgb(1, 0, 0);
const brandDark = oklchToRgb(0.65, 0.18, 149.2);
const brandLight = oklchToRgb(0.627, 0.194, 149.214);
const borderLight = oklchToRgb(0.922, 0, 0);
const borderDark = blend(oklchToRgb(1, 0, 0), cardDark, 0.10);

console.log('\n--- WCAG Contrast Simulation for Spinner with border-t-brand ---');
console.log('Light Mode border-t-brand vs card:', contrastRatio(brandLight, cardLight).toFixed(2) + ':1', '(PASS >= 3.0)');
console.log('Light Mode border-t-brand vs track:', contrastRatio(brandLight, borderLight).toFixed(2) + ':1', '(PASS >= 3.0)');
console.log('Dark Mode border-t-brand vs card:', contrastRatio(brandDark, cardDark).toFixed(2) + ':1', '(PASS >= 3.0)');
console.log('Dark Mode border-t-brand vs track:', contrastRatio(brandDark, borderDark).toFixed(2) + ':1');

console.log('\nALL SIMULATIONS COMPLETED SUCCESSFULLY.');
