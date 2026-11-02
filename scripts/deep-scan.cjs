const fs = require('fs');
const path = require('path');

const files = [
  'src/views/SettingsView.vue',
  'src/components/settings/AIAssistantsTab.vue',
  'src/components/settings/AutomationTab.vue',
  'src/components/settings/AgentsTab.vue',
  'src/components/settings/TeamsTab.vue',
  'src/components/settings/RolesTab.vue',
  'src/components/dashboard/CrmSetupStatusBar.vue',
  'src/views/webforms/FormBuilderView.vue',
  'src/views/webforms/WebFormsDashboardView.vue',
  'src/views/webforms/FormDetailView.vue',
  'src/views/webforms/SubmissionsView.vue',
  'src/views/BookingPagesView.vue',
  'src/views/ScanNameCardView.vue',
  'src/views/AddonsView.vue',
  'src/views/partner/PartnerReferralsView.vue',
  'src/views/partner/PartnerOverviewView.vue',
  'src/views/partner/PartnerWithdrawalView.vue',
  'src/views/partner/PartnerProgramView.vue',
  'src/views/PartnerRegisterView.vue',
  'src/views/partner/PartnerCommissionsView.vue',
  'src/views/partner/PartnerKitView.vue',
  'src/components/partner/PartnerTrackSwitcher.vue'
];

let totalViolations = 0;

files.forEach(f => {
  const fullPath = path.resolve(__dirname, '..', f);
  const content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    // 1. Any hex color in class attribute: class="...#..." or :class="...#..."
    const hexClassMatch = line.match(/(?:class|:class)=["'][^"']*#([0-9a-fA-F]{3,8})[^"']*["']/);
    if (hexClassMatch) {
      console.log(`[HEX CLASS] ${f}:${idx + 1}: ${hexClassMatch[0].trim()}`);
      totalViolations++;
    }

    // 2. Any inline style with hex color
    const hexStyleMatch = line.match(/(?:style|:style)=["'][^"']*#([0-9a-fA-F]{3,8})[^"']*["']/);
    if (hexStyleMatch) {
      // Exclude SVG path fill in inline SVG if acceptable, but let's check
      console.log(`[HEX STYLE] ${f}:${idx + 1}: ${hexStyleMatch[0].trim()}`);
      totalViolations++;
    }

    // 3. Raw tailwind colors
    const rawColorMatch = line.match(/\b(bg|text|border|ring|accent)-(red|green|blue|yellow|indigo|purple|pink|emerald|teal|cyan|sky|amber|lime|violet|fuchsia|rose)-\d{2,3}\b/);
    if (rawColorMatch) {
      console.log(`[RAW COLOR] ${f}:${idx + 1}: ${rawColorMatch[0]}`);
      totalViolations++;
    }

    // 4. Raw palette grays
    const rawGrayMatch = line.match(/\b(bg|text|border|ring)-(gray|slate|zinc|neutral|stone)-\d{2,3}\b/);
    if (rawGrayMatch) {
      console.log(`[RAW GRAY] ${f}:${idx + 1}: ${rawGrayMatch[0]}`);
      totalViolations++;
    }

    // 5. dark: prefix
    const darkMatch = line.match(/\bdark:[a-zA-Z0-9_\-\[\]#:\/]+/);
    if (darkMatch) {
      console.log(`[DARK OVERRIDE] ${f}:${idx + 1}: ${darkMatch[0]}`);
      totalViolations++;
    }
  });
});

console.log(`\nDeep Scan Complete. Total violations: ${totalViolations}`);
