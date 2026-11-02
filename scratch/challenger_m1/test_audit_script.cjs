/**
 * Comprehensive Empirical Stress Test Suite for scripts/audit-tokens.cjs
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { auditFile, RULES } = require('../../scripts/audit-tokens.cjs');

const TEMP_DIR = path.join(__dirname, 'temp_audit');

function setup() {
  if (fs.existsSync(TEMP_DIR)) fs.rmSync(TEMP_DIR, { recursive: true, force: true });
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

function cleanup() {
  if (fs.existsSync(TEMP_DIR)) fs.rmSync(TEMP_DIR, { recursive: true, force: true });
}

let passed = 0;
let failed = 0;
const failures = [];

function check(cond, name, details = '') {
  if (cond) {
    passed++;
    console.log(`\x1b[32m[PASS]\x1b[0m ${name}`);
  } else {
    failed++;
    failures.push({ name, details });
    console.log(`\x1b[31m[FAIL]\x1b[0m ${name} ${details ? '— ' + details : ''}`);
  }
}

function runAuditTests() {
  console.log('='.repeat(70));
  console.log(' AUDIT-TOKENS.CJS EMPIRICAL STRESS TEST SUITE');
  console.log('='.repeat(70));
  setup();

  try {
    // 1. Palette Grays
    {
      const f = path.join(TEMP_DIR, 'grays.vue');
      fs.writeFileSync(f, `<div class="bg-slate-500 text-gray-900 border-zinc-200 bg-white text-black divide-neutral-100 from-stone-900 to-gray-800"></div>`);
      const res = auditFile(f);
      check(res.total === 8, 'Palette grays: detects all 8 violations', `got ${res.total}`);
    }

    // 2. Arbitrary Hex/RGB Classes
    {
      const f = path.join(TEMP_DIR, 'hex_rgb.vue');
      fs.writeFileSync(f, `<div class="bg-[#23B750] text-[#111827] border-[#EF4444] bg-[rgba(0,0,0,0.5)] text-[rgb(255,0,0)] bg-[#FFF] border-[#aabbccdd]"></div>`);
      const res = auditFile(f);
      check(res.total === 7, 'Arbitrary Hex/RGB: detects all 7 violations', `got ${res.total}`);
    }

    // 3. Raw Status Colors
    {
      const f = path.join(TEMP_DIR, 'status.vue');
      fs.writeFileSync(f, `<div class="bg-green-500 text-red-600 border-amber-400 text-blue-700 bg-emerald-500 text-purple-600 bg-yellow-100 text-rose-800 stroke-indigo-500"></div>`);
      const res = auditFile(f);
      check(res.total === 9, 'Raw status colors: detects all 9 violations', `got ${res.total}`);
    }

    // 4. Gradient and Outline Status Prefixes (Adversarial Challenge)
    {
      const f = path.join(TEMP_DIR, 'status_prefixes.vue');
      fs.writeFileSync(f, `<div class="from-green-500 to-emerald-600 placeholder-red-400 outline-blue-500"></div>`);
      const res = auditFile(f);
      check(res.total === 4, 'Raw status color prefixes: covers from-, to-, placeholder-, outline-', `missed, got ${res.total} (rawStatusColors pattern lacks these prefixes)`);
    }

    // 5. dark: Overrides
    {
      const f = path.join(TEMP_DIR, 'dark_overrides.vue');
      fs.writeFileSync(f, `<div class="dark:bg-black dark:bg-gray-900 dark:text-white dark:border-zinc-800 dark:bg-card dark:text-foreground dark:bg-[#111827]"></div>`);
      const res = auditFile(f);
      const darkViolations = res.violations.filter(v => v.rule === 'darkOverrides');
      check(darkViolations.length === 7, 'dark: overrides: detects all 7 dark: classes', `got ${darkViolations.length}`);
    }

    // 6. Inline Static Hex Styles
    {
      const f = path.join(TEMP_DIR, 'inline_static.vue');
      fs.writeFileSync(f, `<div style="color: #111827"><span style='background-color: #EF4444'></span></div>`);
      const res = auditFile(f);
      check(res.total === 2, 'Inline static styles: detects style="..." and style=\'...\'', `got ${res.total}`);
    }

    // 7. Inline Dynamic Object Styles (Adversarial Challenge)
    {
      const f = path.join(TEMP_DIR, 'inline_dynamic.vue');
      fs.writeFileSync(f, `<div :style="{ color: '#111827', background: 'rgba(0,0,0,0.5)' }"></div>`);
      const res = auditFile(f);
      check(res.total >= 1, 'Inline dynamic Vue :style="{ color: \'#...\' }": detects hex/rgba inside object bindings', `got ${res.total} (regex [^"']* terminates on internal single quote)`);
    }

    // 8. Line-level audit-ignore comments
    {
      const f = path.join(TEMP_DIR, 'ignore.vue');
      fs.writeFileSync(f, `
        <div class="bg-[#23B750] text-[#111827]"> /* audit-ignore */ </div>
        <span class="bg-slate-500 text-green-500"> <!-- audit-ignore --> </span>
        <p class="bg-red-500"></p>
      `);
      const res = auditFile(f);
      check(res.total === 1 && res.violations[0].line === 4, 'audit-ignore comments: accurately bypasses ignored lines and catches line 4', `got ${res.total}`);
    }

    // 9. Clean token file (True negatives)
    {
      const f = path.join(TEMP_DIR, 'clean.vue');
      fs.writeFileSync(f, `
        <div class="bg-background text-foreground border-border ring-ring">
          <span class="bg-card text-card-foreground bg-primary text-primary-foreground"></span>
          <div class="bg-rail text-rail-foreground border-rail-border"></div>
          <div class="bg-tag-1 text-tag-1-foreground bg-success/10 text-success"></div>
          <span class="font-black backdrop-blur-sm opacity-50 grayscale"></span>
        </div>
      `);
      const res = auditFile(f);
      check(res.total === 0, 'Clean file: 0 false positives on valid tokens & utility classes', `got ${res.total}`);
    }

    // 10. CLI Exit Codes & Batch Scanning
    {
      const cleanF = path.join(TEMP_DIR, 'clean.vue');
      const dirtyF = path.join(TEMP_DIR, 'grays.vue');

      let cleanCode = 0;
      try { execSync(`node scripts/audit-tokens.cjs --file "${cleanF}"`, { stdio: 'pipe' }); }
      catch (e) { cleanCode = e.status; }
      check(cleanCode === 0, 'CLI exit code: returns 0 on clean file', `got ${cleanCode}`);

      let dirtyCode = 0;
      try { execSync(`node scripts/audit-tokens.cjs --file "${dirtyF}"`, { stdio: 'pipe' }); }
      catch (e) { dirtyCode = e.status; }
      check(dirtyCode === 1, 'CLI exit code: returns 1 on file with violations', `got ${dirtyCode}`);

      let cssCode = 0;
      try { execSync(`node scripts/audit-tokens.cjs --file src/assets/index.css`, { stdio: 'pipe' }); }
      catch (e) { cssCode = e.status; }
      check(cssCode === 0, 'Real file verification: src/assets/index.css passes with exit code 0', `got ${cssCode}`);
    }

  } finally {
    cleanup();
  }

  console.log('-'.repeat(70));
  console.log(`Audit Suite Results: ${passed} Passed, ${failed} Failed`);
  console.log('='.repeat(70) + '\n');
}

runAuditTests();
