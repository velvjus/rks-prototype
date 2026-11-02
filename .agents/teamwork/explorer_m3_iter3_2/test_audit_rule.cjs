const fs = require('fs');
const path = require('path');

const rule = {
  name: 'Malformed Double-Slash Opacity Classes',
  pattern: /\b(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|divide(?:-[xy])?)-[a-zA-Z0-9_-]+\/\d+\/\d+\b/g
};

const BATCHES = {
  1: [
    'src/layouts/MainLayout.vue',
    'src/components/layout/AppShell.vue',
    'src/components/layout/Sidebar.vue',
    'src/components/layout/SidebarItem.vue',
    'src/components/layout/SecondaryPanel.vue',
    'src/components/layout/TopNav.vue',
    'src/components/omnichannel/InboxDropdown.vue',
    'src/components/omnichannel/ToastNotifications.vue',
    'src/App.vue'
  ],
  2: getAllFiles('src/components/ui'),
  3: [
    'src/views/DashboardView.vue',
    'src/views/DealsView.vue',
    'src/views/ContactsView.vue',
    'src/components/omnichannel/ContactDrawer.vue',
    'src/components/omnichannel/FiltersModal.vue',
    'src/views/CompaniesView.vue',
    'src/views/CalendarView.vue',
    'src/views/EventsView.vue'
  ],
  4: [
    'src/views/OmnichannelView.vue',
    'src/components/omnichannel/ConversationItem.vue',
    'src/components/omnichannel/OmnichannelTutorialModal.vue',
    'src/components/omnichannel/TemplatePickerModal.vue',
    'src/views/webforms/ManageTemplatesView.vue',
    'src/components/omnichannel/PlatformIcon.vue'
  ]
};

function getAllFiles(dir, exts = ['.vue', '.ts', '.js', '.css']) {
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

let totalMatches = 0;
for (const [batchNum, files] of Object.entries(BATCHES)) {
  console.log(`\n--- Batch ${batchNum} ---`);
  let batchMatches = 0;
  for (const f of files) {
    if (!fs.existsSync(f)) {
      console.log(`Missing file: ${f}`);
      continue;
    }
    const content = fs.readFileSync(f, 'utf8');
    const lines = content.split(/\r?\n/);
    lines.forEach((line, idx) => {
      rule.pattern.lastIndex = 0;
      let match;
      while ((match = rule.pattern.exec(line)) !== null) {
        console.log(`[Batch ${batchNum}] ${f}:${idx + 1} -> "${match[0]}" in "${line.trim()}"`);
        batchMatches++;
        totalMatches++;
      }
    });
  }
  console.log(`Batch ${batchNum} total matches: ${batchMatches}`);
}
console.log(`\nTotal matches across Batches 1-4: ${totalMatches}`);
