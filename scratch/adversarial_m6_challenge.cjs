const fs = require('fs');
const path = require('path');
const { auditFile, RULES, BATCHES } = require('../scripts/audit-tokens.cjs');

console.log('='.repeat(70));
console.log(' ADVERSARIAL CHALLENGE SUITE: MILESTONE 6 ITERATION 2');
console.log('='.repeat(70));

let failures = 0;
let passes = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    passes++;
    console.log(`\x1b[32m[PASS]\x1b[0m ${testName}`);
  } else {
    failures++;
    console.log(`\x1b[31m[FAIL]\x1b[0m ${testName}: ${details}`);
  }
}

// 1. Bypass & Comment Evasion Tests
const filesToCheckBypasses = [
  'src/data/designSystemGuidelines.ts',
  'DESIGN.md'
];

for (const relPath of filesToCheckBypasses) {
  const fullPath = path.resolve(__dirname, '..', relPath);
  const content = fs.readFileSync(fullPath, 'utf8');

  // Check 1: Zero audit-ignore comments
  const hasAuditIgnore = content.toLowerCase().includes('audit-ignore');
  assert(!hasAuditIgnore, `Zero audit-ignore comments in ${relPath}`);

  // Check 2: Zero HTML comments <!-- ... -->
  const htmlComments = content.match(/<!--[\s\S]*?-->/g) || [];
  assert(htmlComments.length === 0, `Zero HTML comments in ${relPath}`, `Found: ${JSON.stringify(htmlComments)}`);

  // Check 3: Zero audit-tokens bypass markers of any kind
  const bypassKeywords = ['audit-disable', 'token-ignore', 'disable-audit', 'eslint-disable', 'stylelint-disable'];
  const foundBypass = bypassKeywords.filter(kw => content.toLowerCase().includes(kw));
  assert(foundBypass.length === 0, `Zero alternate bypass markers in ${relPath}`, `Found: ${foundBypass.join(', ')}`);

  // Check 4: Audit script reports 0 violations on intact file
  const res = auditFile(fullPath);
  assert(res.total === 0, `auditFile reports 0 violations for ${relPath}`, `Violations: ${JSON.stringify(res.violations)}`);

  // Check 5: Stripping all code comments (if any) and auditing
  // Ensures auditFile is not skipping lines due to comments
  const noComments = content.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*/g, '');
  const tempPath = path.resolve(__dirname, `temp_no_comments_${path.basename(relPath)}`);
  fs.writeFileSync(tempPath, noComments);
  const resNoComments = auditFile(tempPath);
  assert(resNoComments.total === 0, `Zero violations in comment-stripped ${relPath}`, `Violations: ${JSON.stringify(resNoComments.violations)}`);
  fs.unlinkSync(tempPath);
}

// 2. Sensitivity / Positive Control Test (Negative Testing)
// Verify that if a violation is injected into designSystemGuidelines.ts, audit-tokens.cjs CATCHES it!
{
  const target = path.resolve(__dirname, '../src/data/designSystemGuidelines.ts');
  const original = fs.readFileSync(target, 'utf8');

  const dirtyCases = [
    { label: 'bg-white', badLine: 'export const dummy = "bg-white";', expectedRule: 'paletteGrays' },
    { label: 'bg-[#23B750]', badLine: 'export const dummy = "bg-[#23B750]";', expectedRule: 'hexRgbClasses' },
    { label: 'bg-green-100', badLine: 'export const dummy = "bg-green-100";', expectedRule: 'rawStatusColors' },
    { label: 'dark:bg-card', badLine: 'export const dummy = "dark:bg-card";', expectedRule: 'darkOverrides' }
  ];

  for (const tc of dirtyCases) {
    const tempF = path.resolve(__dirname, `temp_dirty_${tc.label.replace(/[^a-z0-9]/gi, '_')}.ts`);
    fs.writeFileSync(tempF, original + '\n' + tc.badLine + '\n');
    const res = auditFile(tempF);
    fs.unlinkSync(tempF);

    const caught = res.violations.some(v => v.rule === tc.expectedRule);
    assert(caught, `Positive control: audit-tokens catches injected ${tc.label} in designSystemGuidelines.ts`, `got: ${JSON.stringify(res.violations)}`);
  }
}

// 3. Sensitivity / Positive Control on DESIGN.md
{
  const target = path.resolve(__dirname, '../DESIGN.md');
  const original = fs.readFileSync(target, 'utf8');

  const dirtyCases = [
    { label: 'bg-black', badLine: 'Some doc text with `bg-black` class.', expectedRule: 'paletteGrays' },
    { label: 'text-[#111827]', badLine: 'Some doc text with `text-[#111827]`.', expectedRule: 'hexRgbClasses' },
    { label: 'text-red-600', badLine: 'Some doc text with `text-red-600`.', expectedRule: 'rawStatusColors' },
    { label: 'dark:text-foreground', badLine: 'Some doc text with `dark:text-foreground`.', expectedRule: 'darkOverrides' }
  ];

  for (const tc of dirtyCases) {
    const tempF = path.resolve(__dirname, `temp_dirty_${tc.label.replace(/[^a-z0-9]/gi, '_')}.md`);
    fs.writeFileSync(tempF, original + '\n' + tc.badLine + '\n');
    const res = auditFile(tempF);
    fs.unlinkSync(tempF);

    const caught = res.violations.some(v => v.rule === tc.expectedRule);
    assert(caught, `Positive control: audit-tokens catches injected ${tc.label} in DESIGN.md`, `got: ${JSON.stringify(res.violations)}`);
  }
}

console.log('-'.repeat(70));
console.log(`Adversarial Suite Summary: ${passes} Passed, ${failures} Failed`);
console.log('='.repeat(70));

process.exit(failures > 0 ? 1 : 0);
