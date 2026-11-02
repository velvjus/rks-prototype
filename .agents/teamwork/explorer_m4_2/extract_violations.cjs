const fs = require('fs');
const { execSync } = require('child_process');

const files = [
  'src/views/webforms/FormBuilderView.vue',
  'src/views/webforms/WebFormsDashboardView.vue',
  'src/views/webforms/FormDetailView.vue',
  'src/views/webforms/SubmissionsView.vue',
  'src/views/BookingPagesView.vue',
  'src/views/ScanNameCardView.vue',
  'src/views/AddonsView.vue'
];

const report = {};

files.forEach(f => {
  let output;
  try {
    output = execSync(`node scripts/audit-tokens.cjs --file "${f}" --json`).toString();
  } catch (err) {
    output = err.stdout.toString();
  }
  const json = JSON.parse(output);
  report[f] = json.reports[0].violations;
});

fs.writeFileSync('.agents/teamwork/explorer_m4_2/all_violations.json', JSON.stringify(report, null, 2));
console.log('Saved all violations to .agents/teamwork/explorer_m4_2/all_violations.json');
