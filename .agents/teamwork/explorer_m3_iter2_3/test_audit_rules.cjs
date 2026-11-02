const fs = require('fs');
const path = require('path');

// Test hardened rules against all files in Batch 1, Batch 2, Batch 3, Batch 4
const auditScript = require('../../../scripts/audit-tokens.cjs');
