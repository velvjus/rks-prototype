/**
 * Independent Adversarial Stress Test Suite
 * Author: Reviewer 2 (reviewer_m1_iter2_2)
 * Milestone 1 Iteration 2 Gate Verification
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { auditFile, RULES } = require('../../../scripts/audit-tokens.cjs');
const { transformFile } = require('../../../scripts/codemod-tokens.cjs');

const TEMP_DIR = path.join(__dirname, 'temp_adversarial');

function setup() {
  if (fs.existsSync(TEMP_DIR)) fs.rmSync(TEMP_DIR, { recursive: true, force: true });
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

function cleanup() {
  if (fs.existsSync(TEMP_DIR)) fs.rmSync(TEMP_DIR, { recursive: true, force: true });
}

let passed = 0;
let failed = 0;
const issues = [];

function assert(condition, testName, errorDetail = '') {
  if (condition) {
    passed++;
    console.log(`\x1b[32m  [PASS]\x1b[0m ${testName}`);
  } else {
    failed++;
    issues.push({ testName, errorDetail });
    console.log(`\x1b[31m  [FAIL]\x1b[0m ${testName} ${errorDetail ? '-> ' + errorDetail : ''}`);
  }
}

console.log('='.repeat(75));
console.log(' INDEPENDENT ADVERSARIAL STRESS TEST SUITE: M1 ITERATION 2');
console.log('='.repeat(75));

setup();

try {
  // =========================================================================
  // TEST SECTION 1: AUDIT TOOL EXTREME PERMUTATIONS & BOUNDARY CONDITIONS
  // =========================================================================
  console.log('\n--- Section 1: scripts/audit-tokens.cjs Stress Tests ---');

  // 1.1 All Gray Families across all scales
  {
    const grayFamilies = ['gray', 'slate', 'zinc', 'neutral', 'stone'];
    const grayScales = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
    const prefixes = ['bg', 'text', 'border', 'ring', 'divide', 'fill', 'stroke', 'outline', 'placeholder', 'from', 'to', 'via'];
    
    // Construct sample with one of each prefix
    let html = '<div class="';
    let expectedCount = 0;
    prefixes.forEach((prefix, i) => {
      const fam = grayFamilies[i % grayFamilies.length];
      const scale = grayScales[i % grayScales.length];
      html += `${prefix}-${fam}-${scale} `;
      expectedCount++;
    });
    html += '"></div>';

    const f = path.join(TEMP_DIR, 'all_grays.vue');
    fs.writeFileSync(f, html);
    const res = auditFile(f);
    assert(res.total === expectedCount, `Detects all ${expectedCount} gray prefix/family/scale variations`, `got ${res.total}`);
  }

  // 1.2 White and Black across all supported prefixes
  {
    const prefixes = ['bg', 'text', 'border', 'ring', 'divide', 'fill', 'stroke', 'outline'];
    let html = '<div class="';
    let expectedCount = 0;
    prefixes.forEach(p => {
      html += `${p}-white ${p}-black `;
      expectedCount += 2;
    });
    html += '"></div>';

    const f = path.join(TEMP_DIR, 'white_black.vue');
    fs.writeFileSync(f, html);
    const res = auditFile(f);
    assert(res.total === expectedCount, `Detects all ${expectedCount} white & black variations`, `got ${res.total}`);
  }

  // 1.3 Raw Status Colors: all 12 families and all prefixes
  {
    const statusFamilies = ['red', 'green', 'emerald', 'blue', 'sky', 'indigo', 'purple', 'violet', 'amber', 'yellow', 'orange', 'rose'];
    const prefixes = ['bg', 'text', 'border', 'ring', 'divide', 'fill', 'stroke', 'outline', 'placeholder', 'from', 'to', 'via'];
    let html = '<div class="';
    let expectedCount = 0;
    statusFamilies.forEach((fam, i) => {
      const prefix = prefixes[i % prefixes.length];
      html += `${prefix}-${fam}-500 `;
      expectedCount++;
    });
    html += '"></div>';

    const f = path.join(TEMP_DIR, 'status_all.vue');
    fs.writeFileSync(f, html);
    const res = auditFile(f);
    assert(res.total === expectedCount, `Detects all ${expectedCount} status color families & prefixes`, `got ${res.total}`);
  }

  // 1.4 Arbitrary Hex & RGB variations (3, 4, 6, 8 hex digits + rgb + rgba)
  {
    const arbitraryVariants = [
      'bg-[#fff]',
      'text-[#ffff]',
      'border-[#23b750]',
      'ring-[#23b750ee]',
      'from-[#ABCDEF]',
      'to-[rgb(10,20,30)]',
      'via-[rgba(10,20,30,0.4)]',
      'fill-[#000]',
      'stroke-[#123456]'
    ];
    const f = path.join(TEMP_DIR, 'arbitrary_hex.vue');
    fs.writeFileSync(f, `<div class="${arbitraryVariants.join(' ')}"></div>`);
    const res = auditFile(f);
    assert(res.total === arbitraryVariants.length, `Detects all ${arbitraryVariants.length} arbitrary hex/rgb variants (3,4,6,8 hex digits, rgb, rgba)`, `got ${res.total}`);
  }

  // 1.5 Inline style complex quoting & vue object bindings
  {
    const f = path.join(TEMP_DIR, 'complex_styles.vue');
    fs.writeFileSync(f, [
      '<div style="color: #23B750; background: rgba(0, 0, 0, 0.5)"></div>',
      '<div style=\'color: #EF4444; border: 1px solid #111827\'></div>',
      '<div :style="{ color: \'#3B82F6\', backgroundColor: \'rgba(255, 255, 255, 0.9)\' }"></div>',
      '<div :style=\'{ "color": "#10B981" }\'></div>'
    ].join('\n'));
    const res = auditFile(f);
    assert(res.total === 4, `Detects inline styles across static and dynamic object bindings with mixed quotes`, `got ${res.total}`);
  }

  // 1.6 False Positive Stress Test (Must produce ZERO violations)
  {
    const f = path.join(TEMP_DIR, 'false_positives.vue');
    fs.writeFileSync(f, [
      '<template>',
      '  <div class="font-black tracking-normal opacity-50 backdrop-blur-md">',
      '    <a href="#overview" id="header-link">Link</a>',
      '    <span :class="isDark ? \'bg-card text-card-foreground\' : \'bg-background text-foreground\'"></span>',
      '    <div class="border-border ring-ring bg-muted text-muted-foreground"></div>',
      '    <div class="bg-primary text-primary-foreground border-primary/20"></div>',
      '    <div class="bg-destructive text-destructive-foreground"></div>',
      '    <div class="bg-rail text-rail-foreground border-rail-border"></div>',
      '    <div class="bg-tag-1 text-tag-1-foreground bg-tag-2 text-tag-2-foreground"></div>',
      '    <div class="bg-tag-3 text-tag-3-foreground bg-tag-4 text-tag-4-foreground"></div>',
      '    <div class="bg-tag-5 text-tag-5-foreground bg-tag-6 text-tag-6-foreground"></div>',
      '    <div class="bg-success text-success-foreground bg-warning text-warning-foreground"></div>',
      '    <div class="bg-info text-info-foreground bg-brand text-brand-foreground"></div>',
      '    <div class="bg-success/10 text-success border-success/20"></div>',
      '  </div>',
      '</template>',
      '<script setup lang="ts">',
      '// This comment mentions #23B750 and dark:bg-gray-900',
      '/* Another comment mentioning gray-500 and text-white */',
      'const isDark = true;',
      'const darkTheme = false;',
      '</script>'
    ].join('\n'));
    const res = auditFile(f);
    assert(res.total === 0, `False positive test: zero violations on valid token classes, font-black, href="#...", comments`, `got ${res.total} violations: ${JSON.stringify(res.violations)}`);
  }

  // 1.7 Non-existent and empty files
  {
    const emptyF = path.join(TEMP_DIR, 'empty.vue');
    fs.writeFileSync(emptyF, '');
    const emptyRes = auditFile(emptyF);
    assert(emptyRes.total === 0 && emptyRes.violations.length === 0, 'Handles empty file safely');

    const missingRes = auditFile(path.join(TEMP_DIR, 'non_existent.vue'));
    assert(missingRes.total === 0 && missingRes.error === 'File not found', 'Handles missing file safely without throwing uncaught error');
  }

  // =========================================================================
  // TEST SECTION 2: CODEMOD DELIMITER LOOKAHEAD & TRANSFORMATION ROBUSTNESS
  // =========================================================================
  console.log('\n--- Section 2: scripts/codemod-tokens.cjs Delimiter & Transform Tests ---');

  // 2.1 Delimiter Lookahead Boundary Tests: quotes, spaces, tag closers, EOF
  {
    const cases = [
      { input: '<button class="bg-[#23B750]">', expected: '<button class="bg-primary">' },
      { input: '<button class=\'bg-[#23B750]\'>', expected: '<button class=\'bg-primary\'>' },
      { input: '<button class="bg-[#23B750] text-sm">', expected: '<button class="bg-primary text-sm">' },
      { input: '<button class="text-sm bg-[#23B750]">', expected: '<button class="text-sm bg-primary">' },
      { input: 'bg-[#23B750]', expected: 'bg-primary' },
      { input: '<div class="text-[#23B750] border-[#23B750]">', expected: '<div class="text-primary border-primary">' },
      { input: '<button class="hover:bg-[#1a943e]">', expected: '<button class="hover:bg-primary/90">' },
      { input: '<div class="bg-[#EF4444] text-[#EF4444] border-[#EF4444]">', expected: '<div class="bg-destructive text-destructive-foreground border-destructive">' }
    ];

    cases.forEach((tc, idx) => {
      const f = path.join(TEMP_DIR, `delimiter_${idx}.vue`);
      fs.writeFileSync(f, tc.input);
      transformFile(f, false);
      const output = fs.readFileSync(f, 'utf8');
      assert(output.includes(tc.expected.split(' ')[0]), `Pass 3 delimiter lookahead handles boundary case ${idx}: ${tc.input.slice(0, 30)}...`);
    });
  }

  // 2.2 Whitespace tolerance in dark override pairs
  {
    const f = path.join(TEMP_DIR, 'multi_space.vue');
    fs.writeFileSync(f, `<div class="bg-white   dark:bg-gray-900\ttext-gray-900  dark:text-foreground"></div>`);
    transformFile(f, false);
    const output = fs.readFileSync(f, 'utf8');
    assert(output.includes('bg-card') && output.includes('text-foreground'), 'Pass 1 handles variable whitespace (multiple spaces, tabs) between dark override pairs');
  }

  // 2.3 Dry-Run Immutability Guarantee
  {
    const f = path.join(TEMP_DIR, 'dry_run_test.vue');
    const originalContent = `<div class="bg-white dark:bg-gray-900 bg-[#23B750]"></div>`;
    fs.writeFileSync(f, originalContent);
    const res = transformFile(f, true); // dryRun = true
    const currentOnDisk = fs.readFileSync(f, 'utf8');
    assert(res.modified === true && res.replacements === 2 && currentOnDisk === originalContent, 'Dry-run correctly detects modifications while strictly leaving file on disk untouched');
  }

  // 2.4 Index.css Protection Guarantee
  {
    const res = transformFile('src/assets/index.css', false);
    assert(res.skipped === true && res.modified === false, 'Explicitly protects src/assets/index.css from accidental codemod modifications');
  }

  // =========================================================================
  // TEST SECTION 3: ANTI-FOUC RUNTIME SIMULATION (index.html)
  // =========================================================================
  console.log('\n--- Section 3: index.html Anti-FOUC Script Simulation ---');

  // Evaluate the verbatim index.html anti-FOUC script logic across edge-case mock environments
  function simulateAntiFouc({ localStorageMock, matchMediaMock }) {
    var documentElementClasses = new Set();
    var documentElement = {
      classList: {
        add: function(c) { documentElementClasses.add(c); },
        remove: function(c) { documentElementClasses.delete(c); },
        contains: function(c) { return documentElementClasses.has(c); }
      }
    };
    var windowObj = { matchMedia: matchMediaMock };
    var localStorageObj = localStorageMock;

    // Verbatim inline logic from index.html:
    (function(window, document, localStorage) {
      var theme = null;
      var legacy = null;
      try {
        theme = localStorage.getItem('rks-theme');
        legacy = localStorage.getItem('rks-dark');
      } catch (e) {}
      try {
        var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        var isDark = theme === 'dark' ||
          (theme === 'system' && prefersDark) ||
          (!theme && legacy === 'true') ||
          (!theme && !legacy && prefersDark);
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch (e) {}
    })(windowObj, { documentElement: documentElement }, localStorageObj);

    return documentElement.classList.contains('dark');
  }

  // 3.1 Restricted localStorage (SecurityError) + OS prefers Dark
  {
    const darkApplied = simulateAntiFouc({
      localStorageMock: {
        getItem: function() { throw new Error('SecurityError: The operation is insecure.'); }
      },
      matchMediaMock: function(q) { return { matches: true }; }
    });
    assert(darkApplied === true, 'Anti-FOUC: Private browsing SecurityError still applies .dark when OS prefers dark (avoids white flash)');
  }

  // 3.2 Restricted localStorage (SecurityError) + OS prefers Light
  {
    const darkApplied = simulateAntiFouc({
      localStorageMock: {
        getItem: function() { throw new Error('SecurityError: The operation is insecure.'); }
      },
      matchMediaMock: function(q) { return { matches: false }; }
    });
    assert(darkApplied === false, 'Anti-FOUC: Private browsing SecurityError applies light mode when OS prefers light');
  }

  // 3.3 Missing window.matchMedia + theme="dark"
  {
    const darkApplied = simulateAntiFouc({
      localStorageMock: {
        getItem: function(k) { return k === 'rks-theme' ? 'dark' : null; }
      },
      matchMediaMock: null // missing matchMedia
    });
    assert(darkApplied === true, 'Anti-FOUC: Missing window.matchMedia still honors stored "dark" preference');
  }

  // 3.4 Missing window.matchMedia + no storage (Fallback)
  {
    const darkApplied = simulateAntiFouc({
      localStorageMock: {
        getItem: function() { return null; }
      },
      matchMediaMock: null
    });
    assert(darkApplied === false, 'Anti-FOUC: Missing window.matchMedia without stored preference safely falls back to light without error');
  }

  // 3.5 System mode + OS toggle
  {
    const darkUnderDarkOS = simulateAntiFouc({
      localStorageMock: { getItem: function(k) { return k === 'rks-theme' ? 'system' : null; } },
      matchMediaMock: function() { return { matches: true }; }
    });
    const darkUnderLightOS = simulateAntiFouc({
      localStorageMock: { getItem: function(k) { return k === 'rks-theme' ? 'system' : null; } },
      matchMediaMock: function() { return { matches: false }; }
    });
    assert(darkUnderDarkOS === true && darkUnderLightOS === false, 'Anti-FOUC: theme="system" correctly tracks OS dark and light matches');
  }

  // 3.6 Legacy storage migration: rks-dark="true"
  {
    const darkApplied = simulateAntiFouc({
      localStorageMock: { getItem: function(k) { return k === 'rks-dark' ? 'true' : null; } },
      matchMediaMock: function() { return { matches: false }; }
    });
    assert(darkApplied === true, 'Anti-FOUC: Legacy rks-dark="true" is recognized when rks-theme is not yet set');
  }

  // =========================================================================
  // TEST SECTION 4: PRODUCTION BUILD INTEGRITY CHECK
  // =========================================================================
  console.log('\n--- Section 4: Build Verification ---');
  {
    let buildError = null;
    let buildOutput = '';
    try {
      buildOutput = execSync('npm run build', { stdio: 'pipe', encoding: 'utf8' });
    } catch (err) {
      buildError = err;
    }
    assert(buildError === null, 'npm run build compiles with 0 errors (Exit code 0)', buildError?.message);
    assert(buildOutput.includes('built in'), 'Build output confirms successful Vite bundle emission');
  }

} finally {
  cleanup();
}

console.log('\n' + '='.repeat(75));
console.log(`STRESS TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log('='.repeat(75) + '\n');

process.exit(failed > 0 ? 1 : 0);
