const fs = require('fs');
const files = [
  'src/views/webforms/FormBuilderView.vue',
  'src/views/webforms/WebFormsDashboardView.vue',
  'src/views/webforms/FormDetailView.vue',
  'src/views/webforms/SubmissionsView.vue',
  'src/views/BookingPagesView.vue',
  'src/views/ScanNameCardView.vue',
  'src/views/AddonsView.vue'
];
const { execSync } = require('child_process');

console.log('| # | File Path | Total Lines | Total Violations | Palette Grays | Hex/RGB | Raw Status | dark: Overrides | Inline Styles | Double Opacity |');
console.log('|---|---|---|---|---|---|---|---|---|---|');

let grandTotalLines = 0;
let grandTotal = 0;
let grandGrays = 0;
let grandHex = 0;
let grandStatus = 0;
let grandDark = 0;
let grandStyles = 0;
let grandDoubleOpacity = 0;

files.forEach((f, idx) => {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split(/\r?\n/).length;
  grandTotalLines += lines;
  
  let output;
  try {
    output = execSync(`node scripts/audit-tokens.cjs --file "${f}" --json`).toString();
  } catch (err) {
    output = err.stdout.toString();
  }
  const json = JSON.parse(output);
  const byRule = json.violationCountsByRule || {};
  
  const grays = byRule['Palette Grays & Neutrals'] || 0;
  const hex = byRule['Tailwind Arbitrary Hex/RGB Classes'] || 0;
  const status = byRule['Raw Status / Accent Colors'] || 0;
  const dark = byRule['dark: Class Overrides'] || 0;
  const styles = byRule['Inline Hex/RGB Styles'] || 0;
  const doubleOp = byRule['Malformed Double Opacity Classes'] || 0;
  const total = json.totalViolations || 0;

  grandTotal += total;
  grandGrays += grays;
  grandHex += hex;
  grandStatus += status;
  grandDark += dark;
  grandStyles += styles;
  grandDoubleOpacity += doubleOp;

  console.log(`| ${idx + 1} | \`${f}\` | ${lines} | **${total}** | ${grays} | ${hex} | ${status} | ${dark} | ${styles} | ${doubleOp} |`);
});

console.log(`| **TOTAL** | **7 Files** | **${grandTotalLines}** | **${grandTotal}** | **${grandGrays}** | **${grandHex}** | **${grandStatus}** | **${grandDark}** | **${grandStyles}** | **${grandDoubleOpacity}** |`);
