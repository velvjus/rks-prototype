#!/usr/bin/env node

/**
 * Challenger 1: Adversarial Verification & Stress Test Suite
 * Milestone 3: CRM Core & Omnichannel (Batches 3 & 4)
 */

const fs = require('fs');
const path = require('path');

const targetFiles = [
  // Batch 3 (CRM Core)
  'src/views/DashboardView.vue',
  'src/views/DealsView.vue',
  'src/views/ContactsView.vue',
  'src/components/omnichannel/ContactDrawer.vue',
  'src/components/omnichannel/FiltersModal.vue',
  'src/views/CompaniesView.vue',
  'src/views/CalendarView.vue',
  'src/views/EventsView.vue',
  // Batch 4 (Omnichannel)
  'src/views/OmnichannelView.vue',
  'src/components/omnichannel/ConversationItem.vue',
  'src/components/omnichannel/OmnichannelTutorialModal.vue',
  'src/components/omnichannel/TemplatePickerModal.vue',
  'src/views/webforms/ManageTemplatesView.vue',
  'src/components/omnichannel/PlatformIcon.vue'
];

let totalViolations = 0;
let totalChecks = 0;
let passedChecks = 0;

function assert(condition, message) {
  totalChecks++;
  if (!condition) {
    console.error(`  \x1b[31m✖ FAIL:\x1b[0m ${message}`);
    totalViolations++;
  } else {
    passedChecks++;
    console.log(`  \x1b[32m✔ PASS:\x1b[0m ${message}`);
  }
}

console.log('='.repeat(75));
console.log('CHALLENGER 1: ADVERSARIAL STRESS TEST - MILESTONE 3 (BATCHES 3 & 4)');
console.log('='.repeat(75));

// =========================================================================
// SECTION 1: Independent Regex Scans across all 14 files
// =========================================================================
console.log('\n[Suite 1] Independent Token & Strict Constraint Scanning across 14 Files');

const rules = [
  {
    name: 'Raw Palette Grays / Neutrals',
    regex: /\b(?:bg|text|border|ring|divide|fill|stroke|placeholder|from|to|via)-(?:gray|slate|zinc|neutral|stone)-(?:50|100|200|300|400|500|600|700|800|900|950)\b|\b(?:bg|text|border|ring|divide|fill|stroke|outline)-(?:white|black)\b/g,
    scope: 'all'
  },
  {
    name: 'Dark Mode Overrides (dark:)',
    regex: /\bdark:(?:[a-zA-Z0-9_\-\[\]#:\/]+)\b/g,
    scope: 'all'
  },
  {
    name: 'Raw Status / Accent Colors (Tailwind classes)',
    regex: /\b(?:bg|text|border|ring|divide|fill|stroke|placeholder|from|to|via)-(?:red|green|emerald|blue|sky|indigo|purple|violet|amber|yellow|orange|rose|teal|cyan|lime|fuchsia|pink)-(?:50|100|200|300|400|500|600|700|800|900|950)\b/g,
    scope: 'all'
  },
  {
    name: 'Arbitrary Hex/RGB Classes (bg-[#...])',
    regex: /\b(?:bg|text|border|ring|divide|fill|stroke|outline|from|to|via)-\[(?:#[0-9a-fA-F]{3,8}|rgba?\([^\]]+\))\]/g,
    scope: 'all'
  },
  {
    name: 'Inline Hex/RGB Styles (style="...#...")',
    regex: /(?:style|:style)\s*=\s*(?:"[^"]*(?:#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))[^"]*"|'[^']*(?:#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))[^']*')/g,
    scope: 'all'
  }
];

const fileReports = [];

for (const relPath of targetFiles) {
  const fullPath = path.resolve(relPath);
  if (!fs.existsSync(fullPath)) {
    assert(false, `File exists: ${relPath}`);
    continue;
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split(/\r?\n/);
  const violations = [];

  // Parse Vue blocks
  let currentBlock = 'none'; // 'script' | 'template' | 'style'
  const blockLines = { script: [], template: [], style: [] };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    if (line.includes('<script')) currentBlock = 'script';
    else if (line.includes('</script>')) { currentBlock = 'none'; continue; }
    else if (line.includes('<template')) currentBlock = 'template';
    else if (line.includes('</template>')) { currentBlock = 'none'; continue; }
    else if (line.includes('<style')) currentBlock = 'style';
    else if (line.includes('</style>')) { currentBlock = 'none'; continue; }

    // Check rules
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || (trimmed.startsWith('/*') && trimmed.endsWith('*/')) || (trimmed.startsWith('<!--') && trimmed.endsWith('-->'))) {
      continue;
    }

    for (const rule of rules) {
      rule.regex.lastIndex = 0;
      let match;
      while ((match = rule.regex.exec(line)) !== null) {
        violations.push({
          line: lineNum,
          rule: rule.name,
          match: match[0],
          block: currentBlock,
          snippet: trimmed
        });
      }
    }
  }

  fileReports.push({ file: relPath, violations });
}

for (const report of fileReports) {
  if (report.violations.length === 0) {
    assert(true, `${report.file} has 0 token / dark: / raw color violations`);
  } else {
    assert(false, `${report.file} has ${report.violations.length} violations:\n` +
      report.violations.map(v => `    L${v.line} [${v.block}] ${v.rule}: "${v.match}" in: ${v.snippet}`).join('\n')
    );
  }
}

// =========================================================================
// SECTION 2: Raw Hex Scan Breakdown (Template vs Style vs Script)
// =========================================================================
console.log('\n[Suite 2] In-depth Hex Value Breakdown (#...) across Blocks');

const hexRegex = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})\b/g;

for (const relPath of targetFiles) {
  const content = fs.readFileSync(path.resolve(relPath), 'utf8');
  const lines = content.split(/\r?\n/);

  let currentBlock = 'none';
  const hexByBlock = { template: [], style: [], script: [] };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    if (line.includes('<script')) currentBlock = 'script';
    else if (line.includes('</script>')) { currentBlock = 'none'; continue; }
    else if (line.includes('<template')) currentBlock = 'template';
    else if (line.includes('</template>')) { currentBlock = 'none'; continue; }
    else if (line.includes('<style')) currentBlock = 'style';
    else if (line.includes('</style>')) { currentBlock = 'none'; continue; }

    const trimmed = line.trim();
    if (trimmed.startsWith('//') || (trimmed.startsWith('/*') && trimmed.endsWith('*/')) || (trimmed.startsWith('<!--') && trimmed.endsWith('-->'))) {
      continue;
    }

    hexRegex.lastIndex = 0;
    let match;
    while ((match = hexRegex.exec(line)) !== null) {
      // Ignore anchors or URL fragments (e.g. href="#...")
      if (line.includes('href="#"') || line.includes("href='#'")) continue;
      // Ignore HTML entities like &#123; or &#125;
      const matchIndex = match.index;
      if (matchIndex > 0 && line[matchIndex - 1] === '&') continue;
      if (currentBlock in hexByBlock) {
        hexByBlock[currentBlock].push({ line: lineNum, match: match[0], snippet: trimmed });
      }
    }
  }

  // Check template hex: MUST BE 0
  assert(hexByBlock.template.length === 0, `${relPath} template has 0 raw hex colors (found ${hexByBlock.template.length})`);
  if (hexByBlock.template.length > 0) {
    hexByBlock.template.forEach(h => console.error(`    L${h.line}: ${h.match} in ${h.snippet}`));
  }

  // Check style hex: MUST BE 0
  assert(hexByBlock.style.length === 0, `${relPath} <style> has 0 raw hex colors (found ${hexByBlock.style.length})`);
  if (hexByBlock.style.length > 0) {
    hexByBlock.style.forEach(h => console.error(`    L${h.line}: ${h.match} in ${h.snippet}`));
  }

  // Script hex analysis:
  if (hexByBlock.script.length > 0) {
    if (relPath.endsWith('PlatformIcon.vue')) {
      console.log(`  ℹ NOTE: ${relPath} has ${hexByBlock.script.length} brand hex colors in brandColors dictionary (Platform official brand colors). Template uses semantic classes for badges.`);
    } else if (relPath.endsWith('DashboardView.vue')) {
      console.log(`  ℹ NOTE: ${relPath} has ${hexByBlock.script.length} chart hex colors in ApexCharts options (Feature 19 / Milestone 6 chart adaptation boundary).`);
    } else {
      assert(false, `Unexpected raw hex in <script> of ${relPath}: ${hexByBlock.script.map(h => `L${h.line} ${h.match}`).join(', ')}`);
    }
  }
}

// =========================================================================
// SECTION 3: Kanban & Dynamic Color Mechanics in DealsView.vue
// =========================================================================
console.log('\n[Suite 3] DealsView.vue Kanban Dynamic Color & CSS Mechanics');

const dealsContent = fs.readFileSync(path.resolve('src/views/DealsView.vue'), 'utf8');

// 3.1 Extract and verify stageColors definition
const stageColorsMatch = dealsContent.match(/const stageColors:\s*Record<string,\s*\{[^}]+\}>\s*=\s*(\{[\s\S]*?\n\})/);
assert(stageColorsMatch !== null, 'DealsView.vue contains stageColors dictionary');

// Evaluate stageColors in a safe sandbox
let stageColors = null;
try {
  const evalCode = `stageColors = ${stageColorsMatch[1]}`;
  eval(evalCode);
  assert(typeof stageColors === 'object' && stageColors !== null, 'stageColors evaluates to valid JavaScript object');
} catch (err) {
  assert(false, `stageColors failed to evaluate: ${err.message}`);
}

const expectedStages = [
  'New',
  'Acknowledged',
  'Qualifying',
  'Proposal / Quotation',
  'Follow Up',
  'Won',
  'Lost',
  'Archived'
];

for (const stage of expectedStages) {
  const conf = stageColors[stage];
  assert(conf !== undefined, `stageColors has configuration for '${stage}'`);
  if (conf) {
    assert(!conf.border.includes('#') && !conf.bg.includes('#') && !conf.text.includes('#') && !conf.headerBar.includes('#'),
      `Stage '${stage}' classes do NOT contain raw hex`
    );
    assert(!conf.border.includes('gray-') && !conf.bg.includes('gray-') && !conf.text.includes('gray-') && !conf.headerBar.includes('gray-'),
      `Stage '${stage}' classes do NOT contain raw grays`
    );
    assert(
      (conf.headerBar.startsWith('bg-tag-') || conf.headerBar.startsWith('bg-success') || conf.headerBar.startsWith('bg-destructive') || conf.headerBar.startsWith('bg-muted')),
      `Stage '${stage}' headerBar uses semantic token: '${conf.headerBar}'`
    );
  }
}

// 3.2 Extract and verify getHeaderBarColor function
const getHeaderBarColorMatch = dealsContent.match(/const getHeaderBarColor\s*=\s*\((?:stage: string|stage)\)\s*=>\s*\{([\s\S]*?\n\})/);
assert(getHeaderBarColorMatch !== null, 'DealsView.vue contains getHeaderBarColor function');

let getHeaderBarColor = null;
try {
  // Strip TypeScript annotations like ": Record<string, string>"
  const cleanBody = '{' + getHeaderBarColorMatch[1].replace(/:\s*Record<[^>]+>/g, '');
  getHeaderBarColor = eval('(function(stage) ' + cleanBody + ')');
  assert(typeof getHeaderBarColor === 'function', 'getHeaderBarColor evaluates to callable function');
} catch (err) {
  assert(false, `getHeaderBarColor failed to evaluate: ${err.message}`);
}

// Test getHeaderBarColor across all stages and invalid/edge-case inputs
const stageTokenMap = {
  New: 'var(--tag-1)',
  Acknowledged: 'var(--tag-2)',
  Qualifying: 'var(--tag-3)',
  'Proposal / Quotation': 'var(--tag-4)',
  'Follow Up': 'var(--tag-5)',
  Won: 'var(--success)',
  Lost: 'var(--destructive)',
  Archived: 'var(--muted-foreground)'
};

for (const [stage, expectedToken] of Object.entries(stageTokenMap)) {
  const resolved = getHeaderBarColor(stage);
  assert(resolved === expectedToken, `getHeaderBarColor('${stage}') resolves to ${expectedToken} (got '${resolved}')`);
}

// Edge cases: unknown stages, null, undefined, empty string
const edgeCases = ['', 'UnknownStage', 'Invalid', null, undefined];
for (const ec of edgeCases) {
  let res;
  try {
    res = getHeaderBarColor(ec);
    assert(typeof res === 'string' && res.startsWith('var(--'), `getHeaderBarColor(${JSON.stringify(ec)}) safely returned valid fallback: '${res}'`);
  } catch (e) {
    assert(false, `getHeaderBarColor(${JSON.stringify(ec)}) threw error: ${e.message}`);
  }
}

// 3.3 Test drag highlight color-mix calculation
console.log('\n[Suite 4] color-mix Drag Highlight Calculation');

// Line 1629 in DealsView:
// :style="draggedOverStage === stage ? { border: '2px dashed ' + getHeaderBarColor(stage), borderRadius: '16px', backgroundColor: 'color-mix(in srgb, ' + getHeaderBarColor(stage) + ' 5%, transparent)' } : {}"
for (const stage of Object.keys(stageTokenMap)) {
  const token = getHeaderBarColor(stage);
  const border = '2px dashed ' + token;
  const bg = 'color-mix(in srgb, ' + token + ' 5%, transparent)';

  // Verify CSS validity
  assert(border === `2px dashed ${stageTokenMap[stage]}`, `Border style correctly formatted for '${stage}': '${border}'`);
  assert(bg === `color-mix(in srgb, ${stageTokenMap[stage]} 5%, transparent)`, `Background color-mix correctly formatted for '${stage}': '${bg}'`);

  // Verify no raw string concatenation bug like var(--tag-1)0d
  assert(!bg.includes(')0d') && !bg.includes(')5%'), `No invalid custom property concatenation in: '${bg}'`);
  // Verify color-mix syntax structure
  const colorMixSyntaxValid = /^color-mix\(in srgb, var\(--[a-zA-Z0-9-]+\) 5%, transparent\)$/.test(bg);
  assert(colorMixSyntaxValid, `Valid W3C color-mix CSS syntax: '${bg}'`);
}

// =========================================================================
// SECTION 4: CSS Variable Definition Invariance in index.css
// =========================================================================
console.log('\n[Suite 5] Token Definitions in index.css (:root and .dark)');

const indexCss = fs.readFileSync(path.resolve('src/assets/index.css'), 'utf8');

const requiredTokens = [
  '--tag-1', '--tag-1-foreground',
  '--tag-2', '--tag-2-foreground',
  '--tag-3', '--tag-3-foreground',
  '--tag-4', '--tag-4-foreground',
  '--tag-5', '--tag-5-foreground',
  '--tag-6', '--tag-6-foreground',
  '--success', '--success-foreground',
  '--destructive', '--destructive-foreground',
  '--muted-foreground'
];

// Extract :root and .dark blocks
const rootBlock = indexCss.match(/:root\s*\{([\s\S]*?)\}/)?.[1] || '';
const darkBlock = indexCss.match(/\.dark\s*\{([\s\S]*?)\}/)?.[1] || '';

assert(rootBlock.length > 0, ':root block found in index.css');
assert(darkBlock.length > 0, '.dark block found in index.css');

for (const tok of requiredTokens) {
  assert(rootBlock.includes(`${tok}:`), `:root defines ${tok}`);
  assert(darkBlock.includes(`${tok}:`), `.dark defines ${tok}`);
}

// Summary
console.log('\n' + '='.repeat(75));
console.log(`STRESS TEST SUMMARY: ${passedChecks}/${totalChecks} checks passed. Total violations: ${totalViolations}`);
console.log('='.repeat(75));

if (totalViolations > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
