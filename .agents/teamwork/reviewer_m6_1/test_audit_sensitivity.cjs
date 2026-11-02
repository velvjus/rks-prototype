const { auditFile } = require('../../../scripts/audit-tokens.cjs');
const fs = require('fs');
const tempFile = 'temp_test_violation.vue';
fs.writeFileSync(tempFile, '<template><div class="bg-white text-gray-500 bg-[#123456] dark:bg-black"></div></template>');
const res = auditFile(tempFile);
fs.unlinkSync(tempFile);
console.log('Test violations detected:', res.total);
res.violations.forEach(v => console.log(' - ' + v.ruleName + ': ' + v.match));
