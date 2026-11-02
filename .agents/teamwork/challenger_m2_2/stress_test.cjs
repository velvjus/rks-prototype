const fs = require('fs');
const path = require('path');

// Colors & Luminance calculation helpers
function oklchToLinearRgb(L, C, hDeg) {
  const hRad = (hDeg * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;

  const rLinear = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const gLinear = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bLinear = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  return [rLinear, gLinear, bLinear];
}

function relativeLuminance(rLinear, gLinear, bLinear) {
  const rClamped = Math.max(0, Math.min(1, rLinear));
  const gClamped = Math.max(0, Math.min(1, gLinear));
  const bClamped = Math.max(0, Math.min(1, bLinear));
  return 0.2126 * rClamped + 0.7152 * gClamped + 0.0722 * bClamped;
}

function contrastRatio(l1, l2) {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

const results = {
  task1: {},
  task2: {},
  task3: {},
  summary: { total: 0, passed: 0, failed: 0 }
};

function record(suite, testName, passed, details) {
  results.summary.total++;
  if (passed) results.summary.passed++;
  else results.summary.failed++;
  results[suite][testName] = { passed, details };
  const icon = passed ? '✔' : '✖';
  console.log(`[${icon}] ${suite.toUpperCase()} > ${testName}: ${passed ? 'PASSED' : 'FAILED'}`);
  if (details) console.log(`    Details:`, JSON.stringify(details));
}

console.log('======================================================================');
console.log(' CHALLENGER 2 ADVERSARIAL STRESS TEST SUITE (MILESTONE 2)');
console.log('======================================================================\n');

// ======================================================================
// TASK 1: Outer Rail Invariance & Contrast
// ======================================================================
console.log('--- 1. Outer Rail Invariance & Contrast ---');
const indexCssPath = path.resolve('src/assets/index.css');
const indexCss = fs.readFileSync(indexCssPath, 'utf8');

// 1.1 Verify --rail definition in :root and .dark
const rootBlock = indexCss.match(/:root\s*\{([^}]+)\}/s);
const darkBlock = indexCss.match(/\.dark\s*\{([^}]+)\}/s);

const rootHasRail = rootBlock && /--rail:\s*oklch\([^)]+\);/.test(rootBlock[1]);
const darkHasRail = darkBlock && /--rail:\s*oklch\([^)]+\);/.test(darkBlock[1]);

record('task1', 'CSS :root has --rail definition', rootHasRail, {
  match: rootBlock ? (rootBlock[1].match(/--rail:[^;]+;/) || [null])[0] : null
});

record('task1', 'CSS .dark has --rail definition', darkHasRail, {
  match: darkBlock ? (darkBlock[1].match(/--rail:[^;]+;/) || [null])[0] : null
});

// 1.2 Calculate contrast between text-rail-foreground and bg-rail
// Light mode:
// --rail: oklch(0.13 0.028 261.692);
// --rail-foreground: oklch(0.985 0 0);
const [rFgLin, gFgLin, bFgLin] = oklchToLinearRgb(0.985, 0, 0);
const [rBgLinLight, gBgLinLight, bBgLinLight] = oklchToLinearRgb(0.13, 0.028, 261.692);
const lumFg = relativeLuminance(rFgLin, gFgLin, bFgLin);
const lumBgLight = relativeLuminance(rBgLinLight, gBgLinLight, bBgLinLight);
const contrastLight = contrastRatio(lumFg, lumBgLight);

// Dark mode:
// --rail: oklch(0.12 0.02 260);
const [rBgLinDark, gBgLinDark, bBgLinDark] = oklchToLinearRgb(0.12, 0.02, 260);
const lumBgDark = relativeLuminance(rBgLinDark, gBgLinDark, bBgLinDark);
const contrastDark = contrastRatio(lumFg, lumBgDark);

record('task1', 'Light mode Rail contrast ratio (WCAG AAA >= 7.0:1)', contrastLight >= 7.0, {
  contrastRatio: contrastLight.toFixed(2) + ':1',
  wcagAAA: contrastLight >= 7.0,
  wcagAA: contrastLight >= 4.5
});

record('task1', 'Dark mode Rail contrast ratio (WCAG AAA >= 7.0:1)', contrastDark >= 7.0, {
  contrastRatio: contrastDark.toFixed(2) + ':1',
  wcagAAA: contrastDark >= 7.0,
  wcagAA: contrastDark >= 4.5
});

// 1.3 Check Sidebar.vue and SidebarItem.vue for light flips / raw colors
const sidebarContent = fs.readFileSync('src/components/layout/Sidebar.vue', 'utf8');
const sidebarItemContent = fs.readFileSync('src/components/layout/SidebarItem.vue', 'utf8');

const forbiddenInRail = /\b(bg-white|bg-gray-\d+|bg-slate-\d+|bg-zinc-\d+|text-gray-\d+|text-slate-\d+|text-zinc-\d+|bg-background|bg-card|dark:)/i;

const sidebarRaw = forbiddenInRail.test(sidebarContent);
record('task1', 'Sidebar.vue never flips to light (no bg-white, no bg-gray, no dark:)', !sidebarRaw, {
  hasForbiddenClass: sidebarRaw
});

const sidebarItemRaw = forbiddenInRail.test(sidebarItemContent);
record('task1', 'SidebarItem.vue never flips to light (no bg-white, no bg-gray, no dark:)', !sidebarItemRaw, {
  hasForbiddenClass: sidebarItemRaw
});

console.log('');

// ======================================================================
// TASK 2: Button Variant Completeness & Invariance
// ======================================================================
console.log('--- 2. Button Variant Completeness & Invariance ---');
const buttonIndexPath = path.resolve('src/components/ui/button/index.ts');
const buttonContent = fs.readFileSync(buttonIndexPath, 'utf8');

const requiredVariants = [
  'default',
  'destructive',
  'outline',
  'secondary',
  'ghost',
  'link',
  'primary',
  'brand',
  'gradient',
  'success',
  'danger',
  'dark',
  'soft'
];

// Extract variant block
const variantSectionMatch = buttonContent.match(/variants:\s*\{[\s\S]*?variant:\s*\{([\s\S]*?)\},\s*size:/);
let extractedVariants = {};
if (variantSectionMatch) {
  const lines = variantSectionMatch[1].split('\n');
  for (const line of lines) {
    const m = line.match(/^\s*([a-z]+):\s*"([^"]+)",?/);
    if (m) {
      extractedVariants[m[1]] = m[2];
    }
  }
}

const rawColorCheck = /\b(white|black|gray-\d+|slate-\d+|zinc-\d+|neutral-\d+|stone-\d+|red-\d+|orange-\d+|amber-\d+|yellow-\d+|lime-\d+|green-\d+|emerald-\d+|teal-\d+|cyan-\d+|sky-\d+|blue-\d+|indigo-\d+|violet-\d+|purple-\d+|fuchsia-\d+|pink-\d+|rose-\d+|#[0-9a-fA-F]{3,8}|rgba?\(|dark:)/;

let allVariantsComplete = true;
let allVariantsSemantic = true;
const variantDetails = {};

for (const variant of requiredVariants) {
  const classes = extractedVariants[variant];
  if (!classes) {
    allVariantsComplete = false;
    variantDetails[variant] = { status: 'MISSING' };
    continue;
  }
  const hasRaw = rawColorCheck.test(classes);
  if (hasRaw) {
    allVariantsSemantic = false;
    const forbidden = classes.match(rawColorCheck);
    variantDetails[variant] = { status: 'CONTAINS_RAW_COLOR', forbidden: forbidden ? forbidden[0] : null, classes };
  } else {
    variantDetails[variant] = { status: 'VALID_SEMANTIC', classes };
  }
}

record('task2', 'All 13 button variants defined', allVariantsComplete, {
  totalRequired: requiredVariants.length,
  foundCount: Object.keys(extractedVariants).length,
  missing: requiredVariants.filter(v => !extractedVariants[v])
});

record('task2', 'All button variants contain ONLY semantic tokens (no raw colors, no dark:)', allVariantsSemantic, variantDetails);

console.log('');

// ======================================================================
// TASK 3: Dialog Scrim & Accessibility
// ======================================================================
console.log('--- 3. Dialog Scrim & Accessibility ---');
const overlayFiles = [
  'src/components/ui/alert-dialog/AlertDialogContent.vue',
  'src/components/ui/dialog/DialogContent.vue',
  'src/components/ui/dialog/DialogScrollContent.vue',
  'src/components/ui/drawer/DrawerOverlay.vue',
  'src/components/ui/sheet/SheetContent.vue'
];

let allOverlaysCorrect = true;
const overlayDetails = {};

for (const relPath of overlayFiles) {
  const fullPath = path.resolve(relPath);
  const exists = fs.existsSync(fullPath);
  if (!exists) {
    allOverlaysCorrect = false;
    overlayDetails[relPath] = { status: 'FILE_NOT_FOUND' };
    continue;
  }
  const code = fs.readFileSync(fullPath, 'utf8');
  const hasBgBlack = /\bbg-black\b/.test(code);
  const hasTargetScrim = /bg-background\/80/.test(code) && /backdrop-blur-sm/.test(code);

  const passed = !hasBgBlack && hasTargetScrim;
  if (!passed) allOverlaysCorrect = false;

  overlayDetails[path.basename(relPath)] = {
    hasBgBlack,
    hasTargetScrim,
    passed
  };

  record('task3', `${path.basename(relPath)} overlay scrim`, passed, overlayDetails[path.basename(relPath)]);
}

console.log('');
console.log('======================================================================');
console.log(` SUITE SUMMARY: ${results.summary.passed}/${results.summary.total} tests passed (${results.summary.failed} failed)`);
console.log('======================================================================');

if (results.summary.failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
