const fs = require('fs');
const data = JSON.parse(fs.readFileSync('scratch/survey_results.json', 'utf8'));

const batchArg = process.argv[2];

if (batchArg) {
  const b = data[batchArg];
  if (!b) {
    console.log('No batch ' + batchArg);
    process.exit(1);
  }
  console.log('=== ' + b.name + ' ===');
  console.log('Files: ' + b.fileCount + ', Lines: ' + b.totals.totalLines + ', Violations: ' + b.totals.totalViolations);
  console.log('Breakdown: Palette=' + b.totals.paletteGrays + ', Hex=' + b.totals.hexRgbClasses + ', InlineStyle=' + b.totals.inlineHexRgb + ', Status=' + b.totals.rawStatusColors + ', dark:=' + b.totals.darkOverrides + ', JSHex=' + b.totals.jsHexLiterals);
  console.log('Complex: ' + JSON.stringify(b.complexSummary));
  console.log('\n--- Files in Batch ' + batchArg + ' ---');
  for (const [file, rep] of Object.entries(b.files)) {
    console.log('\n* ' + file + ' (' + rep.totalLines + ' lines): ' + rep.counts.total + ' violations');
    console.log('  Palette: ' + rep.counts.paletteGrays + ', HexClass: ' + rep.counts.hexRgbClasses + ', InlineHex: ' + rep.counts.inlineHexRgb + ', Status: ' + rep.counts.rawStatusColors + ', dark: ' + rep.counts.darkOverrides + ', JSHex: ' + rep.counts.jsHexLiterals);
    
    // show some sample violations
    const samples = [];
    ['paletteGrays', 'hexRgbClasses', 'inlineHexRgb', 'rawStatusColors', 'darkOverrides'].forEach(cat => {
      if (rep.violations[cat].length > 0) {
        const unique = [...new Set(rep.violations[cat].map(v => v.match + ' (L' + v.line + ')'))].slice(0, 4);
        samples.push(cat + ': ' + unique.join(', '));
      }
    });
    if (samples.length > 0) {
      console.log('  Samples: ' + samples.join(' | '));
    }
  }
} else {
  for (const [id, b] of Object.entries(data)) {
    console.log('Batch ' + id + ': ' + b.name + ' (' + b.fileCount + ' files, ' + b.totals.totalLines + ' lines, ' + b.totals.totalViolations + ' violations)');
  }
}
