const fs = require('fs');
const path = require('path');

function getAllFiles(dir, exts = ['.vue', '.ts', '.js']) {
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

const files = getAllFiles('src');
const hexMatches = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('audit-ignore')) continue;
    const m = line.match(/#[0-9a-fA-F]{6}\b/g);
    if (m) {
      hexMatches.push({ file, line: i + 1, matches: m, text: line.trim() });
    }
  }
}

console.log('Total hex occurrences in src (.vue, .ts, .js):', hexMatches.length);
const filesWithHex = [...new Set(hexMatches.map(h => h.file))];
console.log('Files with hex (' + filesWithHex.length + '):');
filesWithHex.forEach(f => {
  const count = hexMatches.filter(h => h.file === f).length;
  console.log(` - ${f} (${count} matches)`);
});

console.log('\nSample breakdown:');
filesWithHex.forEach(f => {
  console.log(`\n=== ${f} ===`);
  const matches = hexMatches.filter(h => h.file === f).slice(0, 10);
  matches.forEach(m => console.log(`  Line ${m.line}: ${m.matches.join(', ')} -> ${m.text.slice(0, 80)}`));
});
