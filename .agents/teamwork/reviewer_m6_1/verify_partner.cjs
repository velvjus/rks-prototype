const fs = require('fs');

console.log('=== PARTNER OVERVIEW CHARTS ===');
const content = fs.readFileSync('src/views/partner/PartnerOverviewView.vue', 'utf8');

const regex = /<apexchart\b[^>]*:options="([^"]+)"[^>]*>/g;
let match;
const chartBindings = [];
while ((match = regex.exec(content)) !== null) {
  chartBindings.push(match[1]);
}
console.log(`ApexCharts in PartnerOverviewView.vue (${chartBindings.length}):`);
chartBindings.forEach((b, i) => console.log(`${i+1}: ${b}`));

const scriptMatch = content.match(/<script[\s\S]*?<\/script>/);
const script = scriptMatch ? scriptMatch[0] : '';
const uniqueBindings = [...new Set(chartBindings)];

for (const b of uniqueBindings) {
  const startIndex = script.indexOf(`const ${b} = computed(`);
  console.log(`\nChecking ${b} (found at index ${startIndex}):`);
  if (startIndex !== -1) {
    const slice = script.slice(startIndex, startIndex + 1500);
    const lines = slice.split('\n').slice(0, 20);
    console.log(lines.join('\n'));
    console.log('Spreads chartBase.value:', slice.includes('...chartBase.value'));
    console.log('Uses colors.value:', slice.includes('colors.value'));
  }
}

const hexMatches = content.match(/#[0-9a-fA-F]{3,8}\b/g) || [];
console.log(`\nLiteral hex matches in PartnerOverviewView.vue: ${hexMatches.length}`);
