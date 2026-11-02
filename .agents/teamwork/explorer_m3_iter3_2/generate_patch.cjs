const { spawnSync } = require('child_process');
const fs = require('fs');

function getDiff(fileA, fileB, targetName) {
  const p = spawnSync('git', ['diff', '--no-index', fileA, fileB], { encoding: 'utf8' });
  let diff = p.stdout;
  diff = diff.split(fileA).join(targetName);
  diff = diff.split(fileB).join(targetName);
  return diff;
}

const d1 = getDiff('src/views/OmnichannelView.vue', '.agents/teamwork/explorer_m3_iter3_2/OmnichannelView.vue.proposed', 'src/views/OmnichannelView.vue');
const d2 = getDiff('scripts/audit-tokens.cjs', '.agents/teamwork/explorer_m3_iter3_2/audit-tokens.cjs.proposed', 'scripts/audit-tokens.cjs');

fs.writeFileSync('.agents/teamwork/explorer_m3_iter3_2/changes.patch', d1 + '\n' + d2, 'utf8');
console.log('Wrote .agents/teamwork/explorer_m3_iter3_2/changes.patch');

const check = spawnSync('git', ['apply', '--check', '.agents/teamwork/explorer_m3_iter3_2/changes.patch'], { encoding: 'utf8' });
if (check.status === 0) {
  console.log('git apply --check SUCCESS! Patch applies cleanly with 0 errors.');
} else {
  console.log('git apply --check status:', check.status);
  console.log('stderr:', check.stderr);
  console.log('stdout:', check.stdout);
}
