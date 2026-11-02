const { RULES, auditFile } = require('../../scripts/audit-tokens.cjs');
const { transformFile, TRANSFORMS } = require('../../scripts/codemod-tokens.cjs');

console.log('Testing variants and edge cases in audit-tokens.cjs:');

const testCases = [
  { name: 'hover:bg-slate-500', input: '<div class="hover:bg-slate-500">', expectedRule: 'paletteGrays' },
  { name: 'focus:ring-gray-300', input: '<input class="focus:ring-gray-300">', expectedRule: 'paletteGrays' },
  { name: 'bg-slate-500/50', input: '<div class="bg-slate-500/50">', expectedRule: 'paletteGrays' },
  { name: 'from-green-500', input: '<div class="from-green-500 to-emerald-600">', expectedRule: 'rawStatusColors' },
  { name: 'placeholder-red-400', input: '<input class="placeholder-red-400">', expectedRule: 'rawStatusColors' },
  { name: 'outline-blue-500', input: '<button class="outline-blue-500">', expectedRule: 'rawStatusColors' },
  { name: ':style="{ color: \'#111827\' }"', input: '<div :style="{ color: \'#111827\' }">', expectedRule: 'inlineHexStyles' },
  { name: ':style="`color: ${x ? \'#fff\' : \'#000\'}`"', input: '<div :style="`color: #fff`">', expectedRule: 'inlineHexStyles' },
  { name: 'style="color: #111827"', input: '<div style="color: #111827">', expectedRule: 'inlineHexStyles' },
  { name: '<style> .foo { color: #111827; } </style>', input: '<style>.foo { color: #111827; }</style>', expectedRule: 'any' }
];

testCases.forEach(tc => {
  let matched = [];
  for (const [rKey, r] of Object.entries(RULES)) {
    r.pattern.lastIndex = 0;
    const m = tc.input.match(r.pattern);
    if (m) matched.push({ rule: rKey, match: m });
  }
  console.log(`[${matched.length > 0 ? 'MATCH' : 'MISS'}] "${tc.name}" ->`, matched.map(m => `${m.rule}: ${m.match.join(', ')}`));
});
