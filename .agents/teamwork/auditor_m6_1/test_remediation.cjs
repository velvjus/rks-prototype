const fs = require('fs');
const path = require('path');
const { auditFile } = require('../../../scripts/audit-tokens.cjs');

const targetPath = path.resolve(__dirname, '../../../src/data/designSystemGuidelines.ts');
let content = fs.readFileSync(targetPath, 'utf8');

// Replace the 4 offending lines taking into account the escaped backticks \`
content = content.replace(
  /Never use \\`bg-white\\`, \\`bg-black\\`, \\`text-gray-\*\\`, \\`bg-slate-\*\\`, \\`border-zinc-\*\\`, \\`neutral-\*\\`, \\`stone-\*\\`\. <!-- audit-ignore -->/,
  'Never use raw white, black, gray-*, slate-*, zinc-*, neutral-*, or stone-* classes.'
);
content = content.replace(
  /Never use \\`bg-\[#23B750\]\\`, \\`text-\[#111827\]\\`, \\`style="color: #\.\.\."\\`, or \\`rgba\(\.\.\.\)\\`\. <!-- audit-ignore -->/,
  'Never use hardcoded hex classes (e.g. #23B750, #111827), inline hex styles, or rgba values.'
);
content = content.replace(
  /Never use \\`bg-green-100\\`, \\`text-red-600\\`, \\`bg-amber-50\\`, \\`text-blue-500\\`\. Use semantic status tokens with opacity modifiers \(e\.g\. \\`bg-success\/10 text-success border-success\/20\\`\)\. <!-- audit-ignore -->/,
  'Never use raw status color classes (e.g. green-100, red-600, amber-50, blue-500). Use semantic status tokens with opacity modifiers (e.g. \\`bg-success/10 text-success border-success/20\\`).'
);
content = content.replace(
  /Never write \\`dark:bg-\.\.\.\\` or \\`dark:text-\.\.\.\\` in components\. The semantic token itself adapts automatically between light and dark modes in \\`index\.css\\`\. <!-- audit-ignore -->/,
  'Never write dark: modifier classes in components. The semantic token itself adapts automatically between light and dark modes in \\`index.css\\`.'
);

const tempPath = path.resolve(__dirname, 'temp_remediation.ts');
fs.writeFileSync(tempPath, content);

const res = auditFile(tempPath);
console.log('Remediated file violations count:', res.total);
if (res.total > 0) {
  console.log(res.violations);
}

// Check for any remaining audit-ignore
const hasAuditIgnore = content.includes('audit-ignore');
console.log('Contains audit-ignore:', hasAuditIgnore);

fs.unlinkSync(tempPath);
