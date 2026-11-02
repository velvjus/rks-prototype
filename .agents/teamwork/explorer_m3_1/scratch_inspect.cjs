const fs = require('fs');
const path = require('path');

const files = [
  'src/views/DashboardView.vue',
  'src/views/DealsView.vue',
  'src/views/ContactsView.vue',
  'src/components/omnichannel/ContactDrawer.vue',
  'src/components/omnichannel/FiltersModal.vue',
  'src/views/CompaniesView.vue',
  'src/views/CalendarView.vue',
  'src/views/EventsView.vue'
];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  console.log(`\n=================== ${file} ===================`);
  
  // 1. dark: overrides
  const darkMatches = content.match(/\bdark:[^\s"'`>]+/g) || [];
  const darkCounts = {};
  darkMatches.forEach(m => darkCounts[m] = (darkCounts[m] || 0) + 1);
  const topDarks = Object.entries(darkCounts).sort((a,b) => b[1] - a[1]);
  console.log(`-- dark: Overrides (Total: ${darkMatches.length}, Unique: ${topDarks.length}) --`);
  topDarks.slice(0, 10).forEach(([k, c]) => console.log(`   ${c}x ${k}`));

  // 2. Arbitrary Hex in classes
  const hexClassMatches = content.match(/\b(?:bg|text|border|ring|fill|stroke)-\[#[0-9a-fA-F]+(?:\/[0-9]+)?\]/g) || [];
  const hexClassCounts = {};
  hexClassMatches.forEach(m => hexClassCounts[m] = (hexClassCounts[m] || 0) + 1);
  const topHexClasses = Object.entries(hexClassCounts).sort((a,b) => b[1] - a[1]);
  console.log(`-- Hex Classes (Total: ${hexClassMatches.length}, Unique: ${topHexClasses.length}) --`);
  topHexClasses.slice(0, 10).forEach(([k, c]) => console.log(`   ${c}x ${k}`));

  // 3. Raw Status Colors
  const statusMatches = content.match(/\b(?:bg|text|border|ring)-(?:emerald|green|red|amber|yellow|blue|sky|pink|purple|indigo)-[0-9]+(?:\/[0-9]+)?\b/g) || [];
  const statusCounts = {};
  statusMatches.forEach(m => statusCounts[m] = (statusCounts[m] || 0) + 1);
  const topStatus = Object.entries(statusCounts).sort((a,b) => b[1] - a[1]);
  console.log(`-- Raw Status / Accents (Total: ${statusMatches.length}, Unique: ${topStatus.length}) --`);
  topStatus.slice(0, 10).forEach(([k, c]) => console.log(`   ${c}x ${k}`));

  // 4. Palette Grays
  const grayMatches = content.match(/\b(?:bg|text|border|ring|divide)-(?:gray|slate|zinc|neutral|stone)-[0-9]+(?:\/[0-9]+)?\b|\b(?:bg|text)-(?:white|black)\b/g) || [];
  const grayCounts = {};
  grayMatches.forEach(m => grayCounts[m] = (grayCounts[m] || 0) + 1);
  const topGrays = Object.entries(grayCounts).sort((a,b) => b[1] - a[1]);
  console.log(`-- Palette Grays & Neutrals (Total: ${grayMatches.length}, Unique: ${topGrays.length}) --`);
  topGrays.slice(0, 10).forEach(([k, c]) => console.log(`   ${c}x ${k}`));
}
