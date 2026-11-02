const fs = require('fs');
const { execSync } = require('child_process');

function getStats(files) {
  return files.map((f, idx) => {
    const lines = fs.readFileSync(f, 'utf8').split(/\r?\n/).length;
    let output;
    try {
      output = execSync(`node scripts/audit-tokens.cjs --file "${f}" --json`).toString();
    } catch (err) {
      output = err.stdout.toString();
    }
    const json = JSON.parse(output);
    const byRule = json.violationCountsByRule || {};
    return {
      file: f,
      lines,
      total: json.totalViolations || 0,
      grays: byRule['Palette Grays & Neutrals'] || 0,
      hex: byRule['Tailwind Arbitrary Hex/RGB Classes'] || 0,
      status: byRule['Raw Status / Accent Colors'] || 0,
      dark: byRule['dark: Class Overrides'] || 0,
      styles: byRule['Inline Hex/RGB Styles'] || 0,
      doubleOp: byRule['Malformed Double Opacity Classes'] || 0
    };
  });
}

const b7Files = [
  'src/views/partner/PartnerReferralsView.vue',
  'src/views/partner/PartnerOverviewView.vue',
  'src/views/partner/PartnerWithdrawalView.vue',
  'src/views/partner/PartnerProgramView.vue',
  'src/views/PartnerRegisterView.vue',
  'src/views/partner/PartnerCommissionsView.vue',
  'src/views/partner/PartnerKitView.vue',
  'src/components/partner/PartnerTrackSwitcher.vue'
];

const results = getStats(b7Files);

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

results.forEach((r, idx) => {
  grandTotalLines += r.lines;
  grandTotal += r.total;
  grandGrays += r.grays;
  grandHex += r.hex;
  grandStatus += r.status;
  grandDark += r.dark;
  grandStyles += r.styles;
  grandDoubleOpacity += r.doubleOp;

  console.log(`| ${idx + 1} | \`${r.file}\` | ${r.lines} | **${r.total}** | ${r.grays} | ${r.hex} | ${r.status} | ${r.dark} | ${r.styles} | ${r.doubleOp} |`);
});

console.log(`| **TOTAL** | **8 Files** | **${grandTotalLines}** | **${grandTotal}** | **${grandGrays}** | **${grandHex}** | **${grandStatus}** | **${grandDark}** | **${grandStyles}** | **${grandDoubleOpacity}** |`);
