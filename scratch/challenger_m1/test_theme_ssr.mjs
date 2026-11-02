/**
 * Test useTheme.ts in pure Node.js SSR context (no window, no document, no localStorage)
 */
async function testSSR() {
  console.log('Testing useTheme in SSR / Node environment (no DOM globals):');
  
  // Ensure DOM globals are undefined
  delete globalThis.window;
  delete globalThis.document;
  delete globalThis.localStorage;

  try {
    const { useTheme } = await import('../../src/composables/useTheme.ts');
    const theme = useTheme();
    console.log('Successfully imported and initialized useTheme in SSR mode!');
    console.log('theme.mode.value:', theme.mode.value);
    console.log('theme.isDark.value:', theme.isDark.value);
    
    // Test setMode in SSR (should not throw)
    theme.setMode('dark');
    console.log('theme.setMode("dark") in SSR succeeded without error.');
    
    theme.toggleTheme();
    console.log('theme.toggleTheme() in SSR succeeded without error.');
    
    console.log('\x1b[32m[PASS] SSR compatibility verified\x1b[0m\n');
  } catch (err) {
    console.error('\x1b[31m[FAIL] SSR error:\x1b[0m', err);
    process.exit(1);
  }
}

testSSR();
