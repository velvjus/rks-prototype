#!/usr/bin/env node

/**
 * Tokenization Codemod Helper for RakanSales C4
 * 
 * Safely migrates raw colors to semantic tokens across Vue and TS files.
 * 
 * Usage:
 *   node scripts/codemod-tokens.cjs [--batch <1..9>] [--file <path>] [--dry-run]
 */

const fs = require('fs');
const path = require('path');
const { BATCHES } = require('./audit-tokens.cjs');

// Multi-pass transformation rules
const TRANSFORMS = [
  // Pass 1: Dark override pairs (highest confidence)
  {
    name: 'Dark Override Pairs - Backgrounds',
    rules: [
      [/\bbg-white\s+dark:bg-gray-900\b/g, 'bg-card'],
      [/\bbg-white\s+dark:bg-card\b/g, 'bg-card'],
      [/\bbg-gray-50\s+dark:bg-gray-900\b/g, 'bg-background'],
      [/\bbg-gray-50\s+dark:bg-background\b/g, 'bg-background'],
      [/\bbg-gray-100\s+dark:bg-gray-800\b/g, 'bg-muted'],
      [/\bbg-gray-100\s+dark:bg-muted\b/g, 'bg-muted']
    ]
  },
  {
    name: 'Dark Override Pairs - Text',
    rules: [
      [/\btext-gray-900\s+dark:text-foreground\b/g, 'text-foreground'],
      [/\btext-gray-900\s+dark:text-white\b/g, 'text-foreground'],
      [/\btext-gray-800\s+dark:text-foreground\b/g, 'text-foreground'],
      [/\btext-gray-600\s+dark:text-gray-400\b/g, 'text-muted-foreground'],
      [/\btext-gray-600\s+dark:text-muted-foreground\b/g, 'text-muted-foreground'],
      [/\btext-gray-500\s+dark:text-gray-400\b/g, 'text-muted-foreground'],
      [/\btext-gray-500\s+dark:text-muted-foreground\b/g, 'text-muted-foreground']
    ]
  },
  {
    name: 'Dark Override Pairs - Borders',
    rules: [
      [/\bborder-gray-200\s+dark:border-gray-800\b/g, 'border-border'],
      [/\bborder-gray-100\s+dark:border-gray-800\b/g, 'border-border'],
      [/\bborder-gray-200\s+dark:border-gray-700\b/g, 'border-border'],
      [/\bborder-gray-300\s+dark:border-gray-700\b/g, 'border-border'],
      [/\bborder-gray-200\s+dark:border-border\b/g, 'border-border']
    ]
  },

  // Pass 2: Status badge triplets & pairs
  {
    name: 'Status Badge Combinations',
    rules: [
      [/\bbg-emerald-50\s+text-emerald-600\s+border-emerald-200\b/g, 'bg-success/10 text-success border-success/20'],
      [/\bbg-green-50\s+text-green-700\s+border-green-200\b/g, 'bg-success/10 text-success border-success/20'],
      [/\bbg-green-50\s+text-green-600\s+border-green-200\b/g, 'bg-success/10 text-success border-success/20'],
      [/\bbg-amber-50\s+text-amber-600\s+border-amber-200\b/g, 'bg-warning/10 text-warning border-warning/20'],
      [/\bbg-blue-50\s+text-blue-600\s+border-blue-200\b/g, 'bg-info/10 text-info border-info/20'],
      [/\bbg-red-50\s+text-red-600\s+border-red-200\b/g, 'bg-destructive/10 text-destructive border-destructive/20'],
      [/\bbg-emerald-50\s+text-emerald-600\b/g, 'bg-success/10 text-success'],
      [/\bbg-emerald-50\s+text-emerald-700\b/g, 'bg-success/10 text-success'],
      [/\bbg-green-50\s+text-green-700\b/g, 'bg-success/10 text-success'],
      [/\bbg-green-50\s+text-green-600\b/g, 'bg-success/10 text-success'],
      [/\bbg-amber-50\s+text-amber-700\b/g, 'bg-warning/10 text-warning'],
      [/\bbg-amber-50\s+text-amber-600\b/g, 'bg-warning/10 text-warning'],
      [/\bbg-blue-50\s+text-blue-700\b/g, 'bg-info/10 text-info'],
      [/\bbg-blue-50\s+text-blue-600\b/g, 'bg-info/10 text-info'],
      [/\bbg-red-50\s+text-red-700\b/g, 'bg-destructive/10 text-destructive'],
      [/\bbg-red-50\s+text-red-600\b/g, 'bg-destructive/10 text-destructive']
    ]
  },

  // Pass 3: Brand & Hex mappings
  {
    name: 'Brand & Hex Mappings',
    rules: [
      [/\bbg-\[#23B750\](?=[\s"'>]|$)/g, 'bg-primary'],
      [/\btext-\[#23B750\](?=[\s"'>]|$)/g, 'text-primary'],
      [/\bborder-\[#23B750\](?=[\s"'>]|$)/g, 'border-primary'],
      [/\bhover:bg-\[#1a943e\](?=[\s"'>]|$)/g, 'hover:bg-primary/90'],
      [/\bbg-\[#EF4444\](?=[\s"'>]|$)/g, 'bg-destructive'],
      [/\btext-\[#EF4444\](?=[\s"'>]|$)/g, 'text-destructive'],
      [/\bborder-\[#EF4444\](?=[\s"'>]|$)/g, 'border-destructive']
    ]
  }
];

function getAllFiles(dir, exts = ['.vue', '.ts', '.js']) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(fullPath, exts));
    } else {
      if (exts.some(ext => file.endsWith(ext))) {
        results.push(fullPath.replace(/\\/g, '/'));
      }
    }
  }
  return results;
}

function normalizePath(p) {
  return p.replace(/\\/g, '/');
}

function transformFile(filePath, dryRun = false) {
  const norm = normalizePath(filePath);
  if (!fs.existsSync(norm)) {
    return { file: norm, modified: false, error: 'File not found' };
  }

  // Never codemod index.css or vendor stylesheets
  if (norm.endsWith('src/assets/index.css') || norm.endsWith('tw-animate-css.css')) {
    return { file: norm, modified: false, skipped: true };
  }

  const original = fs.readFileSync(norm, 'utf8');
  let current = original;
  let totalReplacements = 0;

  for (const group of TRANSFORMS) {
    for (const [pattern, replacement] of group.rules) {
      const matches = current.match(pattern);
      if (matches) {
        totalReplacements += matches.length;
        current = current.replace(pattern, replacement);
      }
    }
  }

  const modified = current !== original;

  if (modified && !dryRun) {
    fs.writeFileSync(norm, current, 'utf8');
  }

  return {
    file: norm,
    modified,
    replacements: totalReplacements
  };
}

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    batch: null,
    file: null,
    dryRun: false
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--batch' && args[i + 1]) {
      options.batch = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '--file' && args[i + 1]) {
      options.file = args[i + 1];
      i++;
    } else if (args[i] === '--dry-run') {
      options.dryRun = true;
    }
  }

  return options;
}

function main() {
  const options = parseArgs();
  let filesToProcess = [];

  if (options.file) {
    filesToProcess = [options.file];
  } else if (options.batch) {
    const batch = BATCHES[options.batch];
    if (!batch) {
      console.error(`Error: Unknown batch number ${options.batch}. Must be 1..9.`);
      process.exit(1);
    }
    if (batch.files) {
      filesToProcess = filesToProcess.concat(batch.files);
    }
    if (batch.directory) {
      filesToProcess = filesToProcess.concat(getAllFiles(batch.directory, ['.vue', '.ts', '.js']));
    }
  } else {
    console.log('Please specify --batch <1..9> or --file <path>');
    process.exit(1);
  }

  filesToProcess = Array.from(new Set(filesToProcess.map(normalizePath)));

  console.log('='.repeat(70));
  console.log(' RAKANSALES TOKEN CODEMOD');
  console.log(` Mode: ${options.dryRun ? 'DRY RUN (no files modified)' : 'APPLY (modifying files in place)'}`);
  console.log(` Target: ${filesToProcess.length} file(s)`);
  console.log('='.repeat(70));

  let modifiedCount = 0;
  let replacementCount = 0;

  for (const f of filesToProcess) {
    const res = transformFile(f, options.dryRun);
    if (res.modified) {
      modifiedCount++;
      replacementCount += res.replacements;
      console.log(`\x1b[32m✔ ${res.file}: ${res.replacements} replacement(s)\x1b[0m`);
    }
  }

  console.log('-'.repeat(70));
  console.log(`Modified: ${modifiedCount} file(s)`);
  console.log(`Total replacements: ${replacementCount}`);
  console.log('='.repeat(70) + '\n');
}

if (require.main === module) {
  main();
}

module.exports = {
  transformFile,
  TRANSFORMS
};
