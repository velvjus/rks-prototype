/**
 * Adversarial Theme Integration Test Harness
 * Milestone 2: App Shell & UI Components
 * 
 * Verifies:
 * 1. useTheme() composable reactivity, toggleTheme(), localStorage sync, and DOM synchronization
 * 2. Multi-instance singleton sync (TopNav <-> MainLayout communication)
 * 3. Adversarial edge cases: localStorage throwing SecurityError, invalid values, rapid toggles, system preference decoupling
 * 4. TopNav.vue and MainLayout.vue AST / contract analysis
 */

import fs from 'fs';
import path from 'path';

// Step 1: Mock DOM & Browser Environment
const storage = new Map();
const classList = new Set();
let mediaListeners = [];
let mediaMatches = false;
let throwStorageError = false;

globalThis.localStorage = {
  getItem: (k) => {
    if (throwStorageError) throw new Error('SecurityError: Access to localStorage is denied');
    return storage.get(k) ?? null;
  },
  setItem: (k, v) => {
    if (throwStorageError) throw new Error('SecurityError: Access to localStorage is denied');
    storage.set(k, String(v));
  },
  removeItem: (k) => {
    if (throwStorageError) throw new Error('SecurityError: Access to localStorage is denied');
    storage.delete(k);
  },
  clear: () => {
    if (throwStorageError) throw new Error('SecurityError: Access to localStorage is denied');
    storage.clear();
  }
};

globalThis.document = {
  createElement: (tag) => ({
    tagName: tag.toUpperCase(),
    innerHTML: '',
    content: { cloneNode: () => ({}) }
  }),
  head: { appendChild: () => {} },
  documentElement: {
    classList: {
      add: (cls) => classList.add(cls),
      remove: (cls) => classList.delete(cls),
      contains: (cls) => classList.has(cls)
    }
  }
};

globalThis.window = {
  matchMedia: (query) => ({
    matches: mediaMatches,
    media: query,
    addEventListener: (evt, cb) => {
      if (evt === 'change') mediaListeners.push(cb);
    },
    removeEventListener: (evt, cb) => {
      mediaListeners = mediaListeners.filter(l => l !== cb);
    }
  })
};

let passed = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (!condition) {
    console.error(`  \x1b[31m✖ FAIL:\x1b[0m ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  } else {
    passed++;
    console.log(`  \x1b[32m✔ PASS:\x1b[0m ${message}`);
  }
}

async function runTests() {
  console.log('='.repeat(70));
  console.log('ADVERSARIAL THEME INTEGRATION & STRESS TEST SUITE');
  console.log('='.repeat(70));

  // --- SUITE 1: useTheme() Core Logic & Singleton Reactivity ---
  console.log('\n[Suite 1] useTheme() Composable Logic & Reactivity');
  const { useTheme } = await import('../../../src/composables/useTheme.ts');

  // Instance A (simulates TopNav)
  const navTheme = useTheme();
  // Instance B (simulates MainLayout)
  const layoutTheme = useTheme();

  assert(typeof navTheme.toggleTheme === 'function', 'navTheme.toggleTheme is a function');
  assert(typeof layoutTheme.toggleTheme === 'function', 'layoutTheme.toggleTheme is a function');
  assert(typeof navTheme.isDark.value === 'boolean', 'navTheme.isDark is reactive boolean');
  assert(typeof layoutTheme.isDark.value === 'boolean', 'layoutTheme.isDark is reactive boolean');

  // Initial state check
  navTheme.setMode('light');
  assert(navTheme.mode.value === 'light', 'navTheme mode is light');
  assert(navTheme.isDark.value === false, 'navTheme isDark is false');
  assert(layoutTheme.isDark.value === false, 'layoutTheme isDark is synced (false)');
  assert(!classList.has('dark'), 'document.documentElement does not have "dark" class');
  assert(storage.get('rks-theme') === 'light', 'localStorage "rks-theme" is "light"');
  assert(storage.get('rks-dark') === 'false', 'localStorage "rks-dark" is "false"');

  // Trigger toggleTheme from navTheme
  console.log('\n[Suite 2] Cross-Component Theme Toggle Synchronization');
  navTheme.toggleTheme();
  assert(navTheme.mode.value === 'dark', 'navTheme toggled light -> dark');
  assert(navTheme.isDark.value === true, 'navTheme.isDark is now true');
  assert(layoutTheme.isDark.value === true, 'layoutTheme.isDark automatically synced to true');
  assert(layoutTheme.mode.value === 'dark', 'layoutTheme.mode automatically synced to dark');
  assert(classList.has('dark'), 'document.documentElement has "dark" class');
  assert(storage.get('rks-theme') === 'dark', 'localStorage updated to "dark"');
  assert(storage.get('rks-dark') === 'true', 'localStorage legacy updated to "true"');

  // Trigger toggleTheme from layoutTheme
  layoutTheme.toggleTheme();
  assert(layoutTheme.mode.value === 'light', 'layoutTheme toggled dark -> light');
  assert(layoutTheme.isDark.value === false, 'layoutTheme.isDark is now false');
  assert(navTheme.isDark.value === false, 'navTheme.isDark automatically synced to false');
  assert(!classList.has('dark'), 'document.documentElement removed "dark" class');
  assert(storage.get('rks-theme') === 'light', 'localStorage updated to "light"');

  // --- SUITE 3: Adversarial Stress: Rapid 100-cycle Toggle ---
  console.log('\n[Suite 3] Adversarial Stress: Rapid 100 Toggles');
  for (let i = 0; i < 100; i++) {
    if (i % 2 === 0) {
      navTheme.toggleTheme();
    } else {
      layoutTheme.toggleTheme();
    }
  }
  // After 100 toggles starting from light, should return to light
  assert(navTheme.mode.value === 'light', 'State consistent after 100 rapid toggles (mode is light)');
  assert(navTheme.isDark.value === false, 'isDark is false');
  assert(!classList.has('dark'), 'classList is clean');
  assert(storage.get('rks-theme') === 'light', 'localStorage is consistent');

  // --- SUITE 4: Adversarial Stress: LocalStorage Security Exception Handling ---
  console.log('\n[Suite 4] Adversarial Stress: Storage Access Exceptions');
  throwStorageError = true;
  try {
    // Should NOT throw an uncaught error even if localStorage throws SecurityError
    navTheme.toggleTheme();
    assert(navTheme.isDark.value === true, 'Theme toggles in-memory gracefully when storage access is denied');
    assert(classList.has('dark'), 'DOM class still updates when storage access is denied');
  } catch (err) {
    assert(false, `Unexpected throw when localStorage access is restricted: ${err.message}`);
  } finally {
    throwStorageError = false;
  }

  // --- SUITE 5: System Preference Handling vs Explicit Mode ---
  console.log('\n[Suite 5] System Preference Decoupling');
  navTheme.setMode('light');
  // System changes to dark
  mediaMatches = true;
  mediaListeners.forEach(cb => cb({ matches: true }));
  assert(navTheme.mode.value === 'light', 'Explicit light mode is preserved when system prefers dark');
  assert(navTheme.isDark.value === false, 'isDark remains false when explicit light is set');
  assert(!classList.has('dark'), 'classList does not gain dark when user explicitly chose light');

  // Switch to system mode
  navTheme.setMode('system');
  assert(navTheme.mode.value === 'system', 'Mode switched to system');
  assert(navTheme.isDark.value === true, 'isDark reflects system preference (dark)');
  assert(classList.has('dark'), 'document.documentElement gains "dark" from system preference');

  // --- SUITE 6: Source Code Contract Verification (TopNav.vue) ---
  console.log('\n[Suite 6] TopNav.vue Contract Verification');
  const topNavSource = fs.readFileSync(path.resolve('src/components/layout/TopNav.vue'), 'utf8');

  assert(
    topNavSource.includes("import { useTheme } from '@/composables/useTheme'"),
    'TopNav imports useTheme from "@/composables/useTheme"'
  );
  assert(
    topNavSource.includes("const theme = useTheme()"),
    'TopNav instantiates const theme = useTheme()'
  );
  assert(
    topNavSource.includes("@click=\"theme.toggleTheme()\""),
    'TopNav theme toggle button calls theme.toggleTheme()'
  );
  assert(
    topNavSource.includes("Sun v-if=\"theme.isDark.value\"") && topNavSource.includes("Moon v-else"),
    'TopNav conditionally renders Sun icon for dark and Moon icon for light'
  );
  assert(
    !topNavSource.includes("dark:"),
    'TopNav has 0 dark: class overrides'
  );

  // --- SUITE 7: Source Code Contract Verification (MainLayout.vue) ---
  console.log('\n[Suite 7] MainLayout.vue Contract Verification');
  const mainLayoutSource = fs.readFileSync(path.resolve('src/layouts/MainLayout.vue'), 'utf8');

  assert(
    mainLayoutSource.includes("import { useTheme } from '@/composables/useTheme'"),
    'MainLayout imports useTheme from "@/composables/useTheme"'
  );
  assert(
    mainLayoutSource.includes("const { isDark, toggleTheme: toggleDark } = useTheme()"),
    'MainLayout binds isDark and toggleDark from useTheme()'
  );
  assert(
    mainLayoutSource.includes("@click=\"toggleDark\""),
    'MainLayout has dark mode toggle button calling toggleDark'
  );
  assert(
    mainLayoutSource.includes(":is=\"isDark ? Sun : Moon\""),
    'MainLayout switches Sun/Moon icon dynamically based on isDark'
  );
  assert(
    !mainLayoutSource.includes("dark:"),
    'MainLayout has 0 dark: class overrides'
  );

  console.log('\n' + '='.repeat(70));
  console.log(`THEME INTEGRATION TEST RESULTS: ${passed}/${total} PASSED (100%)`);
  console.log('='.repeat(70));
}

runTests().catch(err => {
  console.error('\n❌ TEST SUITE FAILED:', err);
  process.exit(1);
});
