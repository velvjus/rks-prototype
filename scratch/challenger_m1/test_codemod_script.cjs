/**
 * Comprehensive Empirical Stress Test Suite for scripts/codemod-tokens.cjs
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { transformFile } = require('../../scripts/codemod-tokens.cjs');

const TEMP_DIR = path.join(__dirname, 'temp_codemod');

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

function runCodemodTests() {
  console.log('='.repeat(70));
  console.log(' CODEMOD-TOKENS.CJS EMPIRICAL STRESS TEST SUITE');
  console.log('='.repeat(70));
  setup();

  try {
    // 1. Dry run preservation
    {
      const f = path.join(TEMP_DIR, 'dry_run.vue');
      const content = `<div class="bg-white dark:bg-gray-900"></div>`;
      fs.writeFileSync(f, content, 'utf8');

      const res = transformFile(f, true);
      check(res.modified === true, 'Dry-run: reports modified === true');
      check(res.replacements === 1, 'Dry-run: reports 1 replacement', `got ${res.replacements}`);
      const diskContent = fs.readFileSync(f, 'utf8');
      check(diskContent === content, 'Dry-run: file on disk remains unmodified');
    }

    // 2. Pass 1: Dark override pairs
    {
      const f = path.join(TEMP_DIR, 'pass1.vue');
      const content = `<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-foreground border-gray-200 dark:border-gray-800"></div>`;
      fs.writeFileSync(f, content, 'utf8');

      const res = transformFile(f, false);
      check(res.replacements === 3, 'Pass 1 (Dark pairs): executes 3 replacements', `got ${res.replacements}`);
      const updated = fs.readFileSync(f, 'utf8');
      check(updated.includes('bg-card text-foreground border-border'), 'Pass 1: generates correct semantic classes');
    }

    // 3. Pass 2: Status badge combinations
    {
      const f = path.join(TEMP_DIR, 'pass2.vue');
      const content = `<span class="bg-emerald-50 text-emerald-600 border-emerald-200"></span><span class="bg-amber-50 text-amber-600"></span>`;
      fs.writeFileSync(f, content, 'utf8');

      const res = transformFile(f, false);
      check(res.replacements === 2, 'Pass 2 (Status badges): executes 2 replacements', `got ${res.replacements}`);
      const updated = fs.readFileSync(f, 'utf8');
      check(updated.includes('bg-success/10 text-success border-success/20') && updated.includes('bg-warning/10 text-warning'), 'Pass 2: generates correct status badge tokens');
    }

    // 4. Pass 3: Brand & Hex Mappings in Real HTML Attributes (Adversarial Challenge)
    {
      const f = path.join(TEMP_DIR, 'pass3.vue');
      const content = `<button class="bg-[#23B750] hover:bg-[#1a943e] text-[#EF4444]"></button>`;
      fs.writeFileSync(f, content, 'utf8');

      const res = transformFile(f, false);
      check(res.replacements === 3, 'Pass 3 (Brand & Hex Mappings): replaces bg-[#23B750], hover:bg-[#1a943e], text-[#EF4444]', `got ${res.replacements} (trailing \\]\\\\b prevents matching before quotes/spaces)`);
    }

    // 5. Idempotence test
    {
      const f = path.join(TEMP_DIR, 'pass1.vue');
      const contentBefore = fs.readFileSync(f, 'utf8');
      const res = transformFile(f, false);
      check(res.modified === false && res.replacements === 0, 'Idempotence: second execution performs 0 modifications');
      const contentAfter = fs.readFileSync(f, 'utf8');
      check(contentBefore === contentAfter, 'Idempotence: file content is byte-for-byte identical');
    }

    // 6. Exclusion safety
    {
      const res = transformFile('src/assets/index.css', false);
      check(res.skipped === true && res.modified === false, 'Safety: src/assets/index.css is strictly skipped');
    }

    // 7. Non-adjacent class pairs (Limitation documentation)
    {
      const f = path.join(TEMP_DIR, 'non_adjacent.vue');
      fs.writeFileSync(f, `<div class="bg-white p-4 shadow-sm dark:bg-gray-900"></div>`, 'utf8');
      const res = transformFile(f, true);
      check(res.replacements === 0, 'Adjacency limitation: non-adjacent classes are safely skipped rather than malformed', `got ${res.replacements}`);
    }

  } finally {
    cleanup();
  }

  console.log('-'.repeat(70));
  console.log(`Codemod Suite Results: ${passed} Passed, ${failed} Failed`);
  console.log('='.repeat(70) + '\n');
}

runCodemodTests();
