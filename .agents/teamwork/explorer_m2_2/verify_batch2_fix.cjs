const fs = require('fs');
const path = require('path');

// Read the audit script logic
const auditScriptContent = fs.readFileSync('scripts/audit-tokens.cjs', 'utf8');

// Candidate replacements:
const replacements = {
  'src/components/ui/alert/index.ts': [
    {
      find: 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
      replace: 'border-destructive/50 text-destructive [&>svg]:text-destructive'
    }
  ],
  'src/components/ui/alert-dialog/AlertDialogContent.vue': [
    {
      find: 'bg-black/80',
      replace: 'bg-background/80 backdrop-blur-sm'
    }
  ],
  'src/components/ui/dialog/DialogContent.vue': [
    {
      find: 'bg-black/80',
      replace: 'bg-background/80 backdrop-blur-sm'
    }
  ],
  'src/components/ui/dialog/DialogScrollContent.vue': [
    {
      find: 'bg-black/80',
      replace: 'bg-background/80 backdrop-blur-sm'
    }
  ],
  'src/components/ui/drawer/DrawerOverlay.vue': [
    {
      find: 'bg-black/80',
      replace: 'bg-background/80 backdrop-blur-sm'
    }
  ],
  'src/components/ui/sheet/SheetContent.vue': [
    {
      find: 'bg-black/80',
      replace: 'bg-background/80 backdrop-blur-sm'
    }
  ],
  'src/components/ui/button/index.ts': [
    {
      find: 'destructive: "bg-destructive text-white hover:bg-destructive/90",',
      replace: 'destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",'
    },
    {
      find: 'primary: "bg-[#23B750] text-white hover:bg-[#1a943e] font-semibold transition-all",',
      replace: `primary: "bg-primary text-primary-foreground hover:bg-primary/90 font-semibold transition-all",\n        brand: "bg-brand text-brand-foreground hover:bg-brand/90 font-semibold transition-all",`
    },
    {
      find: 'gradient: "bg-gradient-to-r from-[#23B750] to-[#62D816] text-white hover:opacity-95 font-bold transition-all",',
      replace: 'gradient: "bg-gradient-to-r from-brand to-brand-secondary text-brand-foreground hover:opacity-95 font-bold transition-all",'
    },
    {
      find: 'success: "bg-emerald-600 text-white hover:bg-emerald-700 font-semibold transition-all",',
      replace: 'success: "bg-success text-success-foreground hover:bg-success/90 font-semibold transition-all",'
    },
    {
      find: 'danger: "bg-[#EF4444] text-white hover:bg-[#DC2626] font-semibold transition-all",',
      replace: 'danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90 font-semibold transition-all",'
    },
    {
      find: 'dark: "bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-800 dark:border-slate-700 font-semibold transition-all",',
      replace: `dark: "bg-rail text-rail-foreground hover:bg-rail-active border border-rail-border font-semibold transition-all",\n        soft: "bg-muted text-foreground hover:bg-muted/80 font-medium transition-all",`
    }
  ]
};

// Check each replacement
console.log('--- Verifying Replacements on Actual File Contents ---');
let allFound = true;
for (const [filePath, fileReplacements] of Object.entries(replacements)) {
  const content = fs.readFileSync(filePath, 'utf8');
  for (const { find } of fileReplacements) {
    if (!content.includes(find)) {
      console.error(`ERROR: Target substring NOT found in ${filePath}:\n"${find}"`);
      allFound = false;
    } else {
      console.log(`OK: Found target in ${filePath}`);
    }
  }
}

if (!allFound) {
  process.exit(1);
}

// Now test auditing simulated files
const RULES = {
  paletteGrays: {
    name: 'Palette Grays & Neutrals',
    pattern: /\b(?:bg|text|border|ring|divide|fill|stroke|outline|placeholder|from|to|via)-(?:gray|slate|zinc|neutral|stone)-(?:50|100|200|300|400|500|600|700|800|900|950)\b|\b(?:bg|text|border|ring|divide|fill|stroke|outline)-(?:white|black)\b/g
  },
  hexRgbClasses: {
    name: 'Tailwind Arbitrary Hex/RGB Classes',
    pattern: /\b(?:bg|text|border|ring|divide|fill|stroke|outline|from|to|via)-\[(?:#[0-9a-fA-F]{3,8}|rgba?\([^\]]+\))\]/g
  },
  rawStatusColors: {
    name: 'Raw Status / Accent Colors',
    pattern: /\b(?:bg|text|border|ring|divide|fill|stroke|outline|placeholder|from|to|via)-(?:red|green|emerald|blue|sky|indigo|purple|violet|amber|yellow|orange|rose)-(?:50|100|200|300|400|500|600|700|800|900|950)\b/g
  },
  darkOverrides: {
    name: 'dark: Class Overrides',
    pattern: /\bdark:(?:bg|text|border|ring|fill|stroke|divide|from|to|via|placeholder|shadow)-[^\s"'>]+|\bdark:(?:[a-zA-Z0-9_\-\[\]#:\/]+)\b/g
  },
  inlineHexStyles: {
    name: 'Inline Hex/RGB Styles',
    pattern: /(?:style|:style)\s*=\s*(?:"[^"]*(?:#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))[^"]*"|'[^']*(?:#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))[^']*')/g
  }
};

let simulatedTotalViolations = 0;
for (const [filePath, fileReplacements] of Object.entries(replacements)) {
  let content = fs.readFileSync(filePath, 'utf8');
  for (const { find, replace } of fileReplacements) {
    content = content.replace(find, replace);
  }
  const lines = content.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
      if (trimmed.startsWith('//') || (trimmed.startsWith('/*') && trimmed.endsWith('*/')) || trimmed.startsWith('*')) {
        continue;
      }
    }
    for (const [ruleKey, rule] of Object.entries(RULES)) {
      rule.pattern.lastIndex = 0;
      let match;
      while ((match = rule.pattern.exec(line)) !== null) {
        console.error(`SIMULATED VIOLATION in ${filePath}:${i+1} [${rule.name}]: ${match[0]}`);
        simulatedTotalViolations++;
      }
    }
  }
}

console.log('----------------------------------------------------');
console.log(`TOTAL SIMULATED VIOLATIONS AFTER PROPOSED FIXES: ${simulatedTotalViolations}`);
if (simulatedTotalViolations === 0) {
  console.log('SUCCESS: All 29 violations across all 7 files will be completely resolved to 0!');
}
