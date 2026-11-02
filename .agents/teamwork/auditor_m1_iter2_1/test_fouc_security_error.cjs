// Simulate index.html anti-FOUC script when localStorage throws SecurityError
let classList = new Set();
let document = {
  documentElement: {
    classList: {
      add: (c) => classList.add(c),
      remove: (c) => classList.delete(c)
    }
  }
};
let localStorage = {
  getItem: () => { throw new Error('SecurityError: The operation is insecure.'); }
};
let window = {
  matchMedia: (q) => ({ matches: true }) // OS is in dark mode
};

(function() {
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
})();

console.log('Result when localStorage throws SecurityError and OS prefers dark:');
console.log('classList contains "dark":', classList.has('dark'));
if (classList.has('dark')) {
  console.log('[PASS] Anti-FOUC correctly applied dark mode despite localStorage SecurityError!');
} else {
  console.log('[FAIL] Anti-FOUC failed to apply dark mode.');
}
