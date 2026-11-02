const fs = require('fs');

const content = fs.readFileSync('src/views/DashboardView.vue', 'utf8');

const regex = /<apexchart\b[^>]*:options="([^"]+)"[^>]*>/g;
let match;
const chartBindings = [];
while ((match = regex.exec(content)) !== null) {
  chartBindings.push(match[1]);
}
console.log(`Found apexchart options bindings (${chartBindings.length}):`);
chartBindings.forEach((b, i) => console.log(`${i+1}: ${b}`));

const scriptMatch = content.match(/<script[\s\S]*?<\/script>/);
const scriptContent = scriptMatch ? scriptMatch[0] : '';

console.log('\nChecking all 18 options in DashboardView.vue:');
const uniqueBindings = [...new Set(chartBindings)];
let allPass = true;

for (const b of uniqueBindings) {
  const startIndex = scriptContent.indexOf(`const ${b} = computed(`);
  if (startIndex === -1) {
    console.error(`FAIL: ${b} is not defined with computed()`);
    allPass = false;
    continue;
  }
  // Take next 1200 characters from startIndex
  const slice = scriptContent.slice(startIndex, startIndex + 1500);
  const spreadsChartBase = slice.includes('...chartBase.value');
  const usesColors = slice.includes('colors.value');
  
  if (!spreadsChartBase) {
    console.error(`FAIL: ${b} does not spread chartBase.value`);
    allPass = false;
  }
  if (!usesColors) {
    console.error(`FAIL: ${b} does not use colors.value`);
    allPass = false;
  }
  console.log(`PASS: ${b} -> computed: true, spreadsChartBase: ${spreadsChartBase}, usesColors: ${usesColors}`);
}

console.log(`\nAll 18 charts spread chartBase.value and use colors.value: ${allPass}`);
