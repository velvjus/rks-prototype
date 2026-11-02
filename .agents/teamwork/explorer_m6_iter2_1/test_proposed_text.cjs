const fs = require('fs');
const path = require('path');
const { auditFile } = require('../../../scripts/audit-tokens.cjs');

// Test 1: src/data/designSystemGuidelines.ts with remediation
const tsPath = path.resolve(__dirname, '../../../src/data/designSystemGuidelines.ts');
let tsContent = fs.readFileSync(tsPath, 'utf8');

const tsTargetOld = `   - **No raw palette grays/neutrals**: Never use \\\`bg-white\\\`, \\\`bg-black\\\`, \\\`text-gray-*\\\`, \\\`bg-slate-*\\\`, \\\`border-zinc-*\\\`, \\\`neutral-*\\\`, \\\`stone-*\\\`. <!-- audit-ignore -->
   - **No hex/rgb values in classes or inline styles**: Never use \\\`bg-[#23B750]\\\`, \\\`text-[#111827]\\\`, \\\`style="color: #..."\\\`, or \\\`rgba(...)\\\`. <!-- audit-ignore -->
   - **No raw status colors**: Never use \\\`bg-green-100\\\`, \\\`text-red-600\\\`, \\\`bg-amber-50\\\`, \\\`text-blue-500\\\`. Use semantic status tokens with opacity modifiers (e.g. \\\`bg-success/10 text-success border-success/20\\\`). <!-- audit-ignore -->
3. **No \\\`dark:\\\` Color Overrides**: Never write \\\`dark:bg-...\\\` or \\\`dark:text-...\\\` in components. The semantic token itself adapts automatically between light and dark modes in \\\`index.css\\\`. <!-- audit-ignore -->`;

const tsTargetNew = `   - **No raw palette grays/neutrals**: Never use raw white, black, gray-*, slate-*, zinc-*, neutral-*, or stone-* classes.
   - **No hex/rgb values in classes or inline styles**: Never use hardcoded hex classes (e.g. #23B750, #111827), inline hex styles, or rgba values.
   - **No raw status colors**: Never use raw status color classes (e.g. green-100, red-600, amber-50, blue-500). Use semantic status tokens with opacity modifiers (e.g. \\\`bg-success/10 text-success border-success/20\\\`).
3. **No \\\`dark:\\\` Color Overrides**: Never write dark: modifier classes in components. The semantic token itself adapts automatically between light and dark modes in \\\`index.css\\\`.`;

if (!tsContent.includes(tsTargetOld)) {
  console.error('ERROR: tsTargetOld not found in src/data/designSystemGuidelines.ts');
} else {
  console.log('SUCCESS: tsTargetOld matched exactly in src/data/designSystemGuidelines.ts');
}

const remediatedTs = tsContent.replace(tsTargetOld, tsTargetNew);
const tempTsPath = path.resolve(__dirname, 'temp_test_guidelines.ts');
fs.writeFileSync(tempTsPath, remediatedTs);
const tsResult = auditFile(tempTsPath);
console.log('Remediated TS audit violations:', tsResult.total);
if (tsResult.total > 0) {
  console.dir(tsResult.violations, { depth: null });
}
console.log('Remediated TS has audit-ignore:', remediatedTs.includes('audit-ignore'));
fs.unlinkSync(tempTsPath);

// Test 2: DESIGN.md with remediation
const mdPath = path.resolve(__dirname, '../../../DESIGN.md');
let mdContent = fs.readFileSync(mdPath, 'utf8');

const mdTargetOld = `   - **No raw palette grays/neutrals**: Never use \`bg-white\`, \`bg-black\`, \`text-gray-*\`, \`bg-slate-*\`, \`border-zinc-*\`, \`neutral-*\`, \`stone-*\`. <!-- audit-ignore -->
   - **No hex/rgb values in classes or inline styles**: Never use \`bg-[#23B750]\`, \`text-[#111827]\`, \`style="color: #..."\`, or \`rgba(...)\`. <!-- audit-ignore -->
   - **No raw status colors**: Never use \`bg-green-100\`, \`text-red-600\`, \`bg-amber-50\`, \`text-blue-500\`. Use semantic status tokens with opacity modifiers (e.g. \`bg-success/10 text-success border-success/20\`). <!-- audit-ignore -->
3. **No \`dark:\` Color Overrides**: Never write \`dark:bg-...\` or \`dark:text-...\` in components. The semantic token itself adapts automatically between light and dark modes in \`index.css\`. <!-- audit-ignore -->`;

const mdTargetNew = `   - **No raw palette grays/neutrals**: Never use raw white, black, gray-*, slate-*, zinc-*, neutral-*, or stone-* classes.
   - **No hex/rgb values in classes or inline styles**: Never use hardcoded hex classes (e.g. #23B750, #111827), inline hex styles, or rgba values.
   - **No raw status colors**: Never use raw status color classes (e.g. green-100, red-600, amber-50, blue-500). Use semantic status tokens with opacity modifiers (e.g. \`bg-success/10 text-success border-success/20\`).
3. **No \`dark:\` Color Overrides**: Never write dark: modifier classes in components. The semantic token itself adapts automatically between light and dark modes in \`index.css\`.`;

if (!mdContent.includes(mdTargetOld)) {
  console.error('ERROR: mdTargetOld not found in DESIGN.md');
} else {
  console.log('SUCCESS: mdTargetOld matched exactly in DESIGN.md');
}

const remediatedMd = mdContent.replace(mdTargetOld, mdTargetNew);
const tempMdPath = path.resolve(__dirname, 'temp_test_DESIGN.md');
fs.writeFileSync(tempMdPath, remediatedMd);
const mdResult = auditFile(tempMdPath);
console.log('Remediated MD audit violations:', mdResult.total);
if (mdResult.total > 0) {
  console.dir(mdResult.violations, { depth: null });
}
console.log('Remediated MD has audit-ignore:', remediatedMd.includes('audit-ignore'));
fs.unlinkSync(tempMdPath);
