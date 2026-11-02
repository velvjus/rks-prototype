const fs = require('fs');

const files = [
  'src/views/DashboardView.vue',
  'src/views/DealsView.vue',
  'src/views/ContactsView.vue',
  'src/components/omnichannel/ContactDrawer.vue',
  'src/components/omnichannel/FiltersModal.vue',
  'src/views/CompaniesView.vue',
  'src/views/CalendarView.vue',
  'src/views/EventsView.vue',
  'src/views/OmnichannelView.vue',
  'src/components/omnichannel/ConversationItem.vue',
  'src/components/omnichannel/OmnichannelTutorialModal.vue',
  'src/components/omnichannel/TemplatePickerModal.vue',
  'src/views/webforms/ManageTemplatesView.vue',
  'src/components/omnichannel/PlatformIcon.vue'
];

const colorPalettes = [
  'slate', 'gray', 'zinc', 'neutral', 'stone',
  'red', 'orange', 'amber', 'yellow', 'lime',
  'green', 'emerald', 'teal', 'cyan', 'sky',
  'blue', 'indigo', 'violet', 'purple', 'fuchsia',
  'pink', 'rose'
];

for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split(/\r?\n/);

  let firstTemplateIdx = -1;
  let lastTemplateIdx = -1;

  for (let i = 0; i < lines.length; i++) {
    if (firstTemplateIdx === -1 && lines[i].includes('<template')) {
      firstTemplateIdx = i;
    }
    if (lines[i].includes('</template>')) {
      lastTemplateIdx = i;
    }
  }

  lines.forEach((l, i) => {
    if (i < firstTemplateIdx || i > lastTemplateIdx) return;

    const trimmed = l.trim();
    if (trimmed.startsWith('<!--') && trimmed.endsWith('-->')) return;

    // Check raw palette classes
    for (const c of colorPalettes) {
      // match any class with prefix-(color)-(number)
      const reg = new RegExp(`\\b(?:bg|text|border|ring|divide|fill|stroke|placeholder|from|to|via|shadow)-(?:hover:|focus:|active:|group-hover:)?${c}-\\d+\\b`, 'g');
      let m;
      while ((m = reg.exec(l)) !== null) {
        console.log(`${f}:${i + 1} PALETTE [${c}]: ${m[0]} in: ${trimmed}`);
      }
      // also check non-standard hover:text-gray-655 or border-gray-150
      const reg2 = new RegExp(`\\b(?:[a-zA-Z0-9:-]+)?${c}-\\d+\\b`, 'g');
      let m2;
      while ((m2 = reg2.exec(l)) !== null) {
        const token = m2[0];
        // filter out already matched or false positives like translate-x-0
        if (!token.includes('translate') && !token.includes('rotate') && !token.includes('duration') && !token.includes('scale')) {
          // check if it was caught by reg
          if (!l.includes(token)) return;
        }
      }
    }

    // Check dark: overrides
    const darkMatch = l.match(/\bdark:[^\s"'`>]+/g);
    if (darkMatch) {
      console.log(`${f}:${i + 1} DARK: ${darkMatch.join(', ')}`);
    }

    // Check raw hex in class
    const hexClass = l.match(/\b[a-zA-Z0-9:-]+-\[#[0-9a-fA-F]+\]/g);
    if (hexClass) {
      console.log(`${f}:${i + 1} HEX_CLASS: ${hexClass.join(', ')}`);
    }
  });
}
