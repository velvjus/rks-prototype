/**
 * Empirical Unit Test Harness for src/composables/useTheme.ts
 */

// Step 1: Mock DOM environment before importing useTheme
const storage = new Map();
const classList = new Set();
let mediaListeners = [];
let mediaMatches = false;

globalThis.localStorage = {
  getItem: (k) => storage.get(k) ?? null,
  setItem: (k, v) => storage.set(k, String(v)),
  removeItem: (k) => storage.delete(k),
  clear: () => storage.clear()
};

globalThis.document = {
  createElement: (tag) => ({
    tagName: tag.toUpperCase(),
    innerHTML: '',
    content: { cloneNode: () => ({}) }
  }),
  head: {
    appendChild: () => {}
  },
  documentElement: {
    classList: {
      add: (cls) => classList.add(cls),
      remove: (cls) => classList.delete(cls),
      toggle: (cls, force) => {
        if (force === undefined) {
          if (classList.has(cls)) classList.delete(cls);
          else classList.add(cls);
        } else if (force) {
          classList.add(cls);
        } else {
          classList.delete(cls);
        }
      },
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

function assert(cond, msg) {
  total++;
  if (!cond) {
    console.error(`\x1b[31m[FAIL] ${msg}\x1b[0m`);
    throw new Error(`Assertion failed: ${msg}`);
  } else {
    passed++;
    console.log(`\x1b[32m[PASS] ${msg}\x1b[0m`);
  }
}

async function run() {
  console.log('='.repeat(60));
  console.log('RUNNING USETHEME EMPIRICAL UNIT TESTS');
  console.log('='.repeat(60));

  // Dynamically import useTheme after mock environment setup
  const { useTheme } = await import('../../src/composables/useTheme.ts');

  const theme = useTheme();

  // TEST 1: Interface contract conformance
  assert(typeof theme.mode.value === 'string', 'theme.mode is a reactive ref');
  assert(typeof theme.isDark.value === 'boolean', 'theme.isDark is a computed ref');
  assert(typeof theme.setMode === 'function', 'theme.setMode is a function');
  assert(typeof theme.toggleTheme === 'function', 'theme.toggleTheme is a function');

  // TEST 2: Initial mode defaults to 'system'
  assert(theme.mode.value === 'system', `Initial mode is 'system' (got ${theme.mode.value})`);
  assert(theme.isDark.value === false, 'Initial isDark is false when system prefers light');
  assert(!classList.has('dark'), 'document.documentElement does not have "dark" class');

  // TEST 3: System preference change when mode is 'system'
  mediaMatches = true;
  mediaListeners.forEach(cb => cb({ matches: true }));
  assert(theme.isDark.value === true, 'isDark updates to true when media query changes');
  assert(classList.has('dark'), 'document.documentElement gains "dark" class on media change');

  mediaMatches = false;
  mediaListeners.forEach(cb => cb({ matches: false }));
  assert(theme.isDark.value === false, 'isDark updates to false when media query reverts');
  assert(!classList.has('dark'), 'document.documentElement loses "dark" class on media revert');

  // TEST 4: setMode('dark')
  theme.setMode('dark');
  assert(theme.mode.value === 'dark', 'mode is set to "dark"');
  assert(theme.isDark.value === true, 'isDark is true');
  assert(classList.has('dark'), 'classList has "dark"');
  assert(storage.get('rks-theme') === 'dark', 'localStorage "rks-theme" is "dark"');
  assert(storage.get('rks-dark') === 'true', 'localStorage legacy "rks-dark" is "true"');

  // TEST 5: setMode('light')
  theme.setMode('light');
  assert(theme.mode.value === 'light', 'mode is set to "light"');
  assert(theme.isDark.value === false, 'isDark is false');
  assert(!classList.has('dark'), 'classList does NOT have "dark"');
  assert(storage.get('rks-theme') === 'light', 'localStorage "rks-theme" is "light"');
  assert(storage.get('rks-dark') === 'false', 'localStorage legacy "rks-dark" is "false"');

  // TEST 6: toggleTheme() from light to dark
  theme.toggleTheme();
  assert(theme.mode.value === 'dark', 'toggleTheme switched light -> dark');
  assert(theme.isDark.value === true, 'isDark is true after toggle');
  assert(classList.has('dark'), 'classList has "dark" after toggle');

  // TEST 7: toggleTheme() from dark to light
  theme.toggleTheme();
  assert(theme.mode.value === 'light', 'toggleTheme switched dark -> light');
  assert(theme.isDark.value === false, 'isDark is false after toggle');
  assert(!classList.has('dark'), 'classList loses "dark" after toggle');

  // TEST 8: Singleton reactivity across multiple useTheme() calls
  const theme2 = useTheme();
  theme2.setMode('dark');
  assert(theme.mode.value === 'dark', 'theme1 reflects change made by theme2 instance');
  assert(theme.isDark.value === true, 'theme1 isDark reflects change made by theme2');

  console.log('\n' + '='.repeat(60));
  console.log(`USETHEME TESTS SUMMARY: ${passed}/${total} PASSED`);
  console.log('='.repeat(60) + '\n');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
