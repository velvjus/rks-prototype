/**
 * Empirical CSS Variable Integrity & Symmetry Validator
 */
const fs = require('fs');
const path = require('path');

const indexCssPath = path.resolve('src/assets/index.css');
const tailwindConfigPath = path.resolve('tailwind.config.js');

function parseCssVariables() {
  const content = fs.readFileSync(indexCssPath, 'utf8');

  // Extract :root block inside @layer base
  const rootMatch = content.match(/:root\s*\{([\s\S]*?)\n\s*\}/);
  if (!rootMatch) throw new Error('Could not find :root block in index.css');
  const rootBlock = rootMatch[1];

  // Extract .dark block inside @layer base
  const darkMatch = content.match(/\.dark\s*\{([\s\S]*?)\n\s*\}/);
  if (!darkMatch) throw new Error('Could not find .dark block in index.css');
  const darkBlock = darkMatch[1];

  const varRegex = /(--[a-zA-Z0-9\-_]+)\s*:\s*([^;]+);/g;

  const rootVars = new Map();
  let m;
  while ((m = varRegex.exec(rootBlock)) !== null) {
    rootVars.set(m[1].trim(), m[2].trim());
  }

  const darkVars = new Map();
  varRegex.lastIndex = 0;
  while ((m = varRegex.exec(darkBlock)) !== null) {
    darkVars.set(m[1].trim(), m[2].trim());
  }

  // Extract @theme inline block
  const themeInlineMatch = content.match(/@theme inline\s*\{([\s\S]*?)\n\}/);
  const themeInlineBlock = themeInlineMatch ? themeInlineMatch[1] : '';
  const themeInlineVars = new Map();
  varRegex.lastIndex = 0;
  while ((m = varRegex.exec(themeInlineBlock)) !== null) {
    themeInlineVars.set(m[1].trim(), m[2].trim());
  }

  return { rootVars, darkVars, themeInlineVars };
}

function runValidation() {
  console.log('='.repeat(60));
  console.log('RUNNING CSS VARIABLE INTEGRITY & SYMMETRY VALIDATION');
  console.log('='.repeat(60));

  const { rootVars, darkVars, themeInlineVars } = parseCssVariables();

  console.log(`Discovered ${rootVars.size} CSS variables in :root`);
  console.log(`Discovered ${darkVars.size} CSS variables in .dark`);
  console.log(`Discovered ${themeInlineVars.size} mappings in @theme inline`);

  let failures = 0;
  let passes = 0;

  function check(condition, message) {
    if (!condition) {
      console.error(`\x1b[31m[FAIL] ${message}\x1b[0m`);
      failures++;
    } else {
      console.log(`\x1b[32m[PASS] ${message}\x1b[0m`);
      passes++;
    }
  }

  // 1. Core Semantic Token Symmetry
  const coreTokens = [
    '--background', '--foreground',
    '--card', '--card-foreground',
    '--popover', '--popover-foreground',
    '--primary', '--primary-foreground',
    '--secondary', '--secondary-foreground',
    '--muted', '--muted-foreground',
    '--accent', '--accent-foreground',
    '--destructive', '--destructive-foreground',
    '--border', '--input', '--ring',
    '--chart-1', '--chart-2', '--chart-3', '--chart-4', '--chart-5',
    '--sidebar', '--sidebar-foreground',
    '--sidebar-primary', '--sidebar-primary-foreground',
    '--sidebar-accent', '--sidebar-accent-foreground',
    '--sidebar-border', '--sidebar-ring',
    '--success', '--success-foreground',
    '--warning', '--warning-foreground',
    '--info', '--info-foreground',
    '--brand', '--brand-foreground', '--brand-secondary',
    '--rail', '--rail-foreground', '--rail-muted-foreground', '--rail-border', '--rail-active',
    '--tag-1', '--tag-1-foreground',
    '--tag-2', '--tag-2-foreground',
    '--tag-3', '--tag-3-foreground',
    '--tag-4', '--tag-4-foreground',
    '--tag-5', '--tag-5-foreground',
    '--tag-6', '--tag-6-foreground'
  ];

  for (const token of coreTokens) {
    check(rootVars.has(token), `Token ${token} defined in :root`);
    check(darkVars.has(token), `Token ${token} defined in .dark`);
  }

  // 2. Rail Token Theme Invariance
  // Outer rail must remain dark in both light (:root) and dark (.dark)
  const rootRail = rootVars.get('--rail');
  const darkRail = darkVars.get('--rail');
  console.log(`--rail in :root: ${rootRail}`);
  console.log(`--rail in .dark: ${darkRail}`);
  check(rootRail && rootRail.includes('oklch(0.13'), `--rail in :root is dark OKLCH (0.13 lightness)`);
  check(darkRail && darkRail.includes('oklch(0.12'), `--rail in .dark is dark OKLCH (0.12 lightness)`);

  const rootRailFg = rootVars.get('--rail-foreground');
  const darkRailFg = darkVars.get('--rail-foreground');
  check(rootRailFg && rootRailFg.includes('oklch(0.985'), `--rail-foreground in :root is light text (oklch 0.985)`);
  check(darkRailFg && darkRailFg.includes('oklch(0.985'), `--rail-foreground in .dark is light text (oklch 0.985)`);

  // 3. Asymmetry inspection: check variables in :root not in .dark
  const rootOnly = [];
  for (const [k, v] of rootVars) {
    if (!darkVars.has(k)) rootOnly.push(k);
  }
  console.log('\nVariables present in :root but not in .dark:', rootOnly);
  // Expected intentional invariants: --radius, brand hex constants (--rks-green, --rks-lime, etc.)
  check(rootOnly.includes('--radius'), '--radius is structurally invariant');

  // 4. Variables present in .dark but not in :root
  const darkOnly = [];
  for (const [k, v] of darkVars) {
    if (!rootVars.has(k)) darkOnly.push(k);
  }
  console.log('Variables present in .dark but not in :root:', darkOnly);
  check(darkOnly.length === 0, `No extraneous variables in .dark that are missing from :root (count: ${darkOnly.length})`);

  // 5. @theme inline validation
  console.log('\nValidating @theme inline variable resolution:');
  const themeVarRefRegex = /var\((--[a-zA-Z0-9\-_]+)\)/g;
  for (const [key, value] of themeInlineVars) {
    let match;
    themeVarRefRegex.lastIndex = 0;
    while ((match = themeVarRefRegex.exec(value)) !== null) {
      const referencedVar = match[1];
      check(rootVars.has(referencedVar) || themeInlineVars.has(referencedVar), `@theme inline ${key} resolves to declared variable ${referencedVar}`);
    }
  }

  // 6. tailwind.config.js validation
  console.log('\nValidating tailwind.config.js:');
  const tailwindContent = fs.readFileSync(tailwindConfigPath, 'utf8');

  // Check no raw hex colors in extend.colors
  const extendColorsMatch = tailwindContent.match(/colors:\s*\{([\s\S]*?)\n\s*\},/);
  if (extendColorsMatch) {
    const extendColorsBlock = extendColorsMatch[1];
    const rawHexMatch = extendColorsBlock.match(/#[0-9a-fA-F]{3,8}/g);
    check(!rawHexMatch, `tailwind.config.js colors has NO raw hex colors (found: ${rawHexMatch ? rawHexMatch.join(', ') : 'none'})`);

    const hslMatch = extendColorsBlock.match(/hsl\(var\(--/g);
    check(!hslMatch, `tailwind.config.js colors has NO invalid hsl(var(--...)) wrappers (found: ${hslMatch ? hslMatch.length : 0})`);

    // Verify all referenced CSS variables exist in index.css
    const varRefs = extendColorsBlock.match(/var\((--[a-zA-Z0-9\-_]+)\)/g) || [];
    for (const ref of varRefs) {
      const varName = ref.replace('var(', '').replace(')', '');
      check(rootVars.has(varName), `tailwind color ${ref} exists in :root in index.css`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`CSS VARIABLE INTEGRITY SUMMARY: ${passes} PASSED, ${failures} FAILED`);
  console.log('='.repeat(60) + '\n');

  if (failures > 0) process.exit(1);
}

runValidation();
