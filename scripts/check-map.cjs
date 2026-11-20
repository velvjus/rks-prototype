#!/usr/bin/env node

/**
 * Project Map Drift Checker for RakanSales C4
 *
 * Verifies that every route in src/router/index.ts, every view in src/views/,
 * and every Pinia store in src/stores/ is documented in .context/PROJECT_MAP.md.
 *
 * Usage:
 *   node scripts/check-map.cjs
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const MAP_PATH = path.join(ROOT, '.context', 'PROJECT_MAP.md');
const ROUTER_PATH = path.join(ROOT, 'src', 'router', 'index.ts');
const VIEWS_DIR = path.join(ROOT, 'src', 'views');
const STORES_DIR = path.join(ROOT, 'src', 'stores');

function walkFiles(dir, ext) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkFiles(full, ext));
    } else if (entry.name.endsWith(ext)) {
      results.push(full);
    }
  }
  return results;
}

if (!fs.existsSync(MAP_PATH)) {
  console.error('ERROR: .context/PROJECT_MAP.md not found.');
  process.exit(1);
}

const mapContent = fs.readFileSync(MAP_PATH, 'utf8');
const routerContent = fs.readFileSync(ROUTER_PATH, 'utf8');

const issues = [];

// 1. Check all route paths in src/router/index.ts
const routeRegex = /path:\s*['"]([^'"]+)['"]/g;
let match;
const routes = [];
while ((match = routeRegex.exec(routerContent)) !== null) {
  routes.push(match[1]);
}

for (const routePath of routes) {
  if (!mapContent.includes(`\`${routePath}\``)) {
    issues.push(`Undocumented route in .context/PROJECT_MAP.md: ${routePath}`);
  }
}

// 2. Check all Vue views in src/views/
const viewFiles = walkFiles(VIEWS_DIR, '.vue');
for (const absPath of viewFiles) {
  const baseName = path.basename(absPath);
  const relPath = path.relative(ROOT, absPath).replace(/\\/g, '/');
  if (!mapContent.includes(baseName) && !mapContent.includes(relPath)) {
    issues.push(`Undocumented view in .context/PROJECT_MAP.md: ${relPath}`);
  }
}

// 3. Check all Pinia stores in src/stores/
const storeFiles = walkFiles(STORES_DIR, '.ts');
for (const absPath of storeFiles) {
  const relPath = path.relative(ROOT, absPath).replace(/\\/g, '/');
  if (!mapContent.includes(relPath)) {
    issues.push(`Undocumented store in .context/PROJECT_MAP.md: ${relPath}`);
  }
}

// 4. Warn if PROJECT_MAP.md is getting bloated
const mapLines = mapContent.split(/\r?\n/).length;
const warnings = [];
if (mapLines > 250) {
  warnings.push(
    `.context/PROJECT_MAP.md has ${mapLines} lines (recommended max ~250). Move detailed notes into .context/modules/ or .context/TASK_LOG.md.`
  );
}

if (issues.length > 0) {
  console.error(`\n[map:check] Found ${issues.length} drift issue(s):\n`);
  for (const issue of issues) {
    console.error(`  - ${issue}`);
  }
  console.error('\nPlease update .context/PROJECT_MAP.md before finishing your task.\n');
  process.exit(1);
}

console.log(
  `[map:check] OK — ${routes.length} routes, ${viewFiles.length} views, and ${storeFiles.length} stores verified in .context/PROJECT_MAP.md (${mapLines} lines).`
);

for (const w of warnings) {
  console.warn(`[map:check] WARNING: ${w}`);
}
