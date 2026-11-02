/**
 * Empirical Stress Test Suite: Anti-FOUC Script & useTheme Composable Error Isolation
 * Run with: node --experimental-strip-types scratch/challenger_m1/test_anti_fouc_and_theme_stress.mjs
 */

import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../..');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failureDetails = [];

function check(cond, name, details = '') {
  totalTests++;
  if (cond) {
    passedTests++;
    console.log(`\x1b[32m[PASS]\x1b[0m ${name}`);
  } else {
    failedTests++;
    failureDetails.push({ name, details });
    console.log(`\x1b[31m[FAIL]\x1b[0m ${name} ${details ? '— ' + details : ''}`);
  }
}

// -----------------------------------------------------------------------------
// PART 1: index.html Anti-FOUC Script Stress Testing
// -----------------------------------------------------------------------------

console.log('='.repeat(75));
console.log('PART 1: index.html ANTI-FOUC INLINE SCRIPT STRESS TESTS');
console.log('='.repeat(75));

// 1. Read index.html and extract the anti-FOUC script
const indexHtmlContent = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
const scriptMatch = indexHtmlContent.match(/<head>[\s\S]*?<script>([\s\S]*?)<\/script>[\s\S]*?<\/head>/i);

if (!scriptMatch) {
  console.error('[FATAL] Failed to extract anti-FOUC inline script from index.html head!');
  process.exit(1);
}

const antiFoucCode = scriptMatch[1];

function createMockDomContext(opts = {}) {
  const classes = new Set(opts.initialClasses || []);
  let storage = { ...(opts.storage || {}) };

  const classList = {
    add: (cls) => classes.add(cls),
    remove: (cls) => classes.delete(cls),
    contains: (cls) => classes.has(cls),
    has: (cls) => classes.has(cls),
    toString: () => Array.from(classes).join(' ')
  };

  const documentElement = {
    classList
  };

  const document = {
    documentElement
  };

  let localStorageObj;
  if (opts.storageSecurityErrorOnAccess) {
    localStorageObj = undefined;
  } else {
    localStorageObj = {
      getItem: (key) => {
        if (opts.storageSecurityErrorOnGet) {
          const err = new Error('The operation is insecure.');
          err.name = 'SecurityError';
          throw err;
        }
        return storage[key] !== undefined ? storage[key] : null;
      },
      setItem: (key, val) => {
        if (opts.storageSecurityErrorOnSet) {
          const err = new Error('The operation is insecure.');
          err.name = 'SecurityError';
          throw err;
        }
        storage[key] = String(val);
      }
    };
  }

  let matchMediaFn;
  if (opts.matchMediaThrows) {
    matchMediaFn = () => { throw new Error('matchMedia query failed'); };
  } else if (opts.matchMediaMissing) {
    matchMediaFn = undefined;
  } else {
    matchMediaFn = (query) => {
      const prefersDark = !!opts.systemPrefersDark;
      return {
        matches: query.includes('dark') ? prefersDark : !prefersDark,
        media: query
      };
    };
  }

  const contextObj = {
    document,
    console: { log: () => {}, error: () => {} }
  };

  if (opts.storageSecurityErrorOnAccess) {
    Object.defineProperty(contextObj, 'localStorage', {
      get() {
        const err = new Error('Failed to read localStorage: Access is denied.');
        err.name = 'SecurityError';
        throw err;
      }
    });
  } else {
    contextObj.localStorage = localStorageObj;
  }

  contextObj.window = {
    matchMedia: matchMediaFn,
    document
  };

  if (opts.storageSecurityErrorOnAccess) {
    Object.defineProperty(contextObj.window, 'localStorage', {
      get() {
        const err = new Error('Failed to read localStorage: Access is denied.');
        err.name = 'SecurityError';
        throw err;
      }
    });
  } else {
    contextObj.window.localStorage = localStorageObj;
  }

  const ctx = vm.createContext(contextObj);
  return { ctx, classes, storage };
}

function runAntiFoucScript(opts) {
  const { ctx, classes } = createMockDomContext(opts);
  let uncaughtError = null;
  try {
    vm.runInContext(antiFoucCode, ctx);
  } catch (err) {
    uncaughtError = err;
  }
  return { classes, uncaughtError, isDark: classes.has('dark') };
}

// Suite 1.1: Standard storage scenarios
{
  const r1 = runAntiFoucScript({ storage: { 'rks-theme': 'dark' }, systemPrefersDark: false });
  check(r1.uncaughtError === null && r1.isDark === true, 'Anti-FOUC standard: theme="dark" adds .dark class');

  const r2 = runAntiFoucScript({ storage: { 'rks-theme': 'light' }, systemPrefersDark: true, initialClasses: ['dark'] });
  check(r2.uncaughtError === null && r2.isDark === false, 'Anti-FOUC standard: theme="light" removes .dark class even if OS dark');

  const r3 = runAntiFoucScript({ storage: { 'rks-theme': 'system' }, systemPrefersDark: true });
  check(r3.uncaughtError === null && r3.isDark === true, 'Anti-FOUC standard: theme="system" + OS dark adds .dark class');

  const r4 = runAntiFoucScript({ storage: { 'rks-theme': 'system' }, systemPrefersDark: false, initialClasses: ['dark'] });
  check(r4.uncaughtError === null && r4.isDark === false, 'Anti-FOUC standard: theme="system" + OS light removes .dark class');

  const r5 = runAntiFoucScript({ storage: { 'rks-dark': 'true' }, systemPrefersDark: false });
  check(r5.uncaughtError === null && r5.isDark === true, 'Anti-FOUC legacy: legacy "true" adds .dark class');

  const r6 = runAntiFoucScript({ storage: { 'rks-dark': 'false' }, systemPrefersDark: true, initialClasses: ['dark'] });
  check(r6.uncaughtError === null && r6.isDark === false, 'Anti-FOUC legacy: legacy "false" removes .dark class');

  const r7 = runAntiFoucScript({ storage: {}, systemPrefersDark: true });
  check(r7.uncaughtError === null && r7.isDark === true, 'Anti-FOUC uninitialized: empty storage + OS dark adds .dark class');

  const r8 = runAntiFoucScript({ storage: {}, systemPrefersDark: false, initialClasses: ['dark'] });
  check(r8.uncaughtError === null && r8.isDark === false, 'Anti-FOUC uninitialized: empty storage + OS light removes .dark class');
}

// Suite 1.2: Safari Private Browsing - localStorage.getItem throws SecurityError
{
  const r1 = runAntiFoucScript({ storageSecurityErrorOnGet: true, systemPrefersDark: true });
  check(
    r1.uncaughtError === null && r1.isDark === true,
    'Anti-FOUC Safari Private: localStorage.getItem throws SecurityError -> evaluates OS dark and adds .dark',
    `isDark: ${r1.isDark}, err: ${r1.uncaughtError?.message}`
  );

  const r2 = runAntiFoucScript({ storageSecurityErrorOnGet: true, systemPrefersDark: false, initialClasses: ['dark'] });
  check(
    r2.uncaughtError === null && r2.isDark === false,
    'Anti-FOUC Safari Private: localStorage.getItem throws SecurityError -> evaluates OS light and removes .dark',
    `isDark: ${r2.isDark}, err: ${r2.uncaughtError?.message}`
  );
}

// Suite 1.3: Sandboxed iframe - Accessing window.localStorage throws SecurityError
{
  const r1 = runAntiFoucScript({ storageSecurityErrorOnAccess: true, systemPrefersDark: true });
  check(
    r1.uncaughtError === null && r1.isDark === true,
    'Anti-FOUC Sandboxed Iframe: localStorage property getter throws SecurityError -> catches and applies OS dark',
    `isDark: ${r1.isDark}, err: ${r1.uncaughtError?.message}`
  );

  const r2 = runAntiFoucScript({ storageSecurityErrorOnAccess: true, systemPrefersDark: false, initialClasses: ['dark'] });
  check(
    r2.uncaughtError === null && r2.isDark === false,
    'Anti-FOUC Sandboxed Iframe: localStorage property getter throws SecurityError -> catches and removes .dark',
    `isDark: ${r2.isDark}, err: ${r2.uncaughtError?.message}`
  );
}

// Suite 1.4: Missing / unpolyfilled window.matchMedia in restricted environments
{
  const r1 = runAntiFoucScript({ matchMediaMissing: true, storageSecurityErrorOnGet: true });
  check(
    r1.uncaughtError === null && r1.isDark === false,
    'Anti-FOUC Double-Fault: localStorage SecurityError + matchMedia missing -> no crash, graceful light fallback',
    `err: ${r1.uncaughtError?.message}`
  );

  const r2 = runAntiFoucScript({ matchMediaMissing: true, storage: { 'rks-theme': 'dark' } });
  check(
    r2.uncaughtError === null && r2.isDark === true,
    'Anti-FOUC matchMedia missing: theme="dark" still applies .dark class cleanly',
    `isDark: ${r2.isDark}`
  );
}

// Suite 1.5: matchMedia throwing exception
{
  const r1 = runAntiFoucScript({ matchMediaThrows: true, storage: {} });
  check(
    r1.uncaughtError === null,
    'Anti-FOUC matchMedia exception: second try/catch swallows query exception without leaking to window',
    `err: ${r1.uncaughtError?.message}`
  );
}

// -----------------------------------------------------------------------------
// PART 2: src/composables/useTheme.ts Composable Stress Testing
// -----------------------------------------------------------------------------

console.log('\n' + '='.repeat(75));
console.log('PART 2: src/composables/useTheme.ts COMPOSABLE STRESS TESTS');
console.log('='.repeat(75));

// Helper to run isolated child node processes executing useTheme.ts with mock setups
function runIsolatedComposableTest(testScript) {
  const child = spawnSync('node', ['--experimental-strip-types', '-e', testScript], {
    cwd: ROOT_DIR,
    encoding: 'utf8'
  });
  return {
    status: child.status,
    stdout: child.stdout.trim(),
    stderr: child.stderr.trim()
  };
}

const COMMON_DOM_MOCK = `
  const classList = new Set();
  globalThis.document = {
    createElement: (tag) => ({
      tagName: tag.toUpperCase(),
      innerHTML: '',
      content: { cloneNode: () => ({}) }
    }),
    head: { appendChild: () => {} },
    documentElement: {
      classList: {
        add: (c) => classList.add(c),
        remove: (c) => classList.delete(c),
        contains: (c) => classList.has(c)
      }
    }
  };
`;

// Test 2.1: window.matchMedia is completely missing / undefined
{
  const script = `
    ${COMMON_DOM_MOCK}
    globalThis.window = {
      // matchMedia is deliberately undefined
    };
    globalThis.localStorage = {
      getItem: () => null,
      setItem: () => {}
    };

    import('./src/composables/useTheme.ts').then(({ useTheme }) => {
      const theme = useTheme();
      if (typeof theme.mode.value !== 'string') throw new Error('mode ref not created');
      if (theme.isDark.value !== false) throw new Error('isDark should default false when matchMedia missing');
      
      theme.setMode('dark');
      if (theme.mode.value !== 'dark') throw new Error('setMode dark failed');
      if (theme.isDark.value !== true) throw new Error('isDark should be true after setMode dark');
      if (!classList.has('dark')) throw new Error('classList missing dark after setMode dark');

      theme.toggleTheme();
      if (theme.mode.value !== 'light') throw new Error('toggleTheme failed');
      if (theme.isDark.value !== false) throw new Error('isDark should be false after toggleTheme');
      if (classList.has('dark')) throw new Error('classList has dark after toggleTheme to light');

      console.log('SUCCESS_MATCHMEDIA_UNDEFINED');
    }).catch(err => {
      console.error(err);
      process.exit(1);
    });
  `;

  const res = runIsolatedComposableTest(script);
  check(
    res.status === 0 && res.stdout.includes('SUCCESS_MATCHMEDIA_UNDEFINED'),
    'useTheme with window.matchMedia undefined: initializes and toggles without TypeError',
    res.stderr || res.stdout
  );
}

// Test 2.2: window.matchMedia exists but lacks addEventListener (older Safari / partial polyfill)
{
  const script = `
    ${COMMON_DOM_MOCK}
    globalThis.window = {
      matchMedia: (query) => ({
        matches: true, // OS prefers dark
        media: query
        // addEventListener is deliberately missing
      })
    };
    globalThis.localStorage = {
      getItem: () => null,
      setItem: () => {}
    };

    import('./src/composables/useTheme.ts').then(({ useTheme }) => {
      const theme = useTheme();
      if (theme.isDark.value !== true) throw new Error('isDark should be true from matchMedia.matches=true');
      if (!classList.has('dark')) throw new Error('classList should have dark applied');
      
      console.log('SUCCESS_NO_ADDEVENTLISTENER');
    }).catch(err => {
      console.error(err);
      process.exit(1);
    });
  `;

  const res = runIsolatedComposableTest(script);
  check(
    res.status === 0 && res.stdout.includes('SUCCESS_NO_ADDEVENTLISTENER'),
    'useTheme with matchMedia lacking addEventListener: safely initializes query without throwing TypeError',
    res.stderr || res.stdout
  );
}

// Test 2.3: Safari Private Browsing - localStorage throws SecurityError on both read and write
{
  const script = `
    ${COMMON_DOM_MOCK}
    globalThis.window = {
      matchMedia: (query) => ({
        matches: true,
        media: query,
        addEventListener: () => {}
      })
    };
    globalThis.localStorage = {
      getItem: () => {
        const err = new Error('The operation is insecure.');
        err.name = 'SecurityError';
        throw err;
      },
      setItem: () => {
        const err = new Error('The operation is insecure.');
        err.name = 'SecurityError';
        throw err;
      }
    };

    import('./src/composables/useTheme.ts').then(({ useTheme }) => {
      const theme = useTheme();
      if (theme.mode.value !== 'system') throw new Error('mode should fallback to system when storage throws');
      if (theme.isDark.value !== true) throw new Error('isDark should evaluate OS dark scheme when storage throws');
      
      // Attempt to change theme - storage.setItem will throw, composable should catch and continue
      theme.setMode('light');
      if (theme.mode.value !== 'light') throw new Error('setMode light should update reactive mode even if storage throws');
      if (theme.isDark.value !== false) throw new Error('isDark should be false after setMode light');
      if (classList.has('dark')) throw new Error('classList should have removed dark');

      console.log('SUCCESS_STORAGE_SECURITY_ERROR');
    }).catch(err => {
      console.error(err);
      process.exit(1);
    });
  `;

  const res = runIsolatedComposableTest(script);
  check(
    res.status === 0 && res.stdout.includes('SUCCESS_STORAGE_SECURITY_ERROR'),
    'useTheme under Safari Private Browsing (SecurityError on getItem/setItem): functions cleanly with in-memory fallback',
    res.stderr || res.stdout
  );
}

// Test 2.4: SSR Environment (typeof window === 'undefined')
{
  const script = `
    // No window, document, or localStorage
    import('./src/composables/useTheme.ts').then(({ useTheme }) => {
      const theme = useTheme();
      if (theme.mode.value !== 'system') throw new Error('SSR initial mode must be system');
      if (theme.isDark.value !== false) throw new Error('SSR initial isDark must be false');
      theme.setMode('dark');
      if (theme.mode.value !== 'dark') throw new Error('SSR setMode failed');
      console.log('SUCCESS_SSR');
    }).catch(err => {
      console.error(err);
      process.exit(1);
    });
  `;

  const res = runIsolatedComposableTest(script);
  check(
    res.status === 0 && res.stdout.includes('SUCCESS_SSR'),
    'useTheme in SSR environment (window/document undefined): imports and runs without errors',
    res.stderr || res.stdout
  );
}

// Test 2.5: Dynamic OS Scheme Transition while mode is 'system' vs explicit 'dark'/'light'
{
  const script = `
    ${COMMON_DOM_MOCK}
    let changeHandler = null;
    let queryMatches = false;

    globalThis.window = {
      matchMedia: (query) => ({
        get matches() { return queryMatches; },
        media: query,
        addEventListener: (evt, cb) => {
          if (evt === 'change') changeHandler = cb;
        }
      })
    };
    globalThis.localStorage = {
      getItem: () => 'system',
      setItem: () => {}
    };

    import('./src/composables/useTheme.ts').then(({ useTheme }) => {
      const theme = useTheme();
      if (theme.isDark.value !== false) throw new Error('Expected light initially');
      if (classList.has('dark')) throw new Error('Should not have dark class');

      // Simulate OS switching to dark
      queryMatches = true;
      if (changeHandler) changeHandler({ matches: true });
      if (theme.isDark.value !== true) throw new Error('Expected dark after OS transition');
      if (!classList.has('dark')) throw new Error('Expected .dark class added');

      // Explicitly lock to 'light'
      theme.setMode('light');
      if (theme.isDark.value !== false) throw new Error('Expected light after setMode light');
      if (classList.has('dark')) throw new Error('Expected .dark removed');

      // Trigger another OS change event; since mode is 'light', DOM should NOT gain .dark
      queryMatches = false;
      if (changeHandler) changeHandler({ matches: false });
      queryMatches = true;
      if (changeHandler) changeHandler({ matches: true });
      if (classList.has('dark')) throw new Error('Explicit light mode was overridden by OS change!');

      console.log('SUCCESS_DYNAMIC_TRANSITION');
    }).catch(err => {
      console.error(err);
      process.exit(1);
    });
  `;

  const res = runIsolatedComposableTest(script);
  check(
    res.status === 0 && res.stdout.includes('SUCCESS_DYNAMIC_TRANSITION'),
    'useTheme dynamic OS transitions: responds when mode="system", ignores OS transitions when explicitly locked to light/dark',
    res.stderr || res.stdout
  );
}

// -----------------------------------------------------------------------------
// SUMMARY
// -----------------------------------------------------------------------------

console.log('\n' + '='.repeat(75));
console.log(`CHALLENGER 2 ITERATION 2 RESULTS: ${passedTests}/${totalTests} PASSED (${failedTests} FAILED)`);
console.log('='.repeat(75) + '\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
