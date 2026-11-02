const fs = require('fs');

// 1. OmnichannelView.vue
let omnichannel = fs.readFileSync('src/views/OmnichannelView.vue', 'utf8');
const omniReplacements = [
  ['bg-muted/40/90 backdrop-blur-md border-b border-border/80', 'bg-muted/90 backdrop-blur-md border-b border-border/80'],
  ['bg-muted/40/90 backdrop-blur-md border-b border-border/80', 'bg-muted/90 backdrop-blur-md border-b border-border/80'],
  ['bg-muted/40/95 backdrop-blur-sm', 'bg-muted/95 backdrop-blur-sm'],
  ['italic bg-muted/40/10 border-b', 'italic bg-muted/30 border-b'],
  ['rounded-xl bg-muted/40/50', 'rounded-xl bg-muted/50'],
  ['text-muted-foreground bg-muted/40/10 flex items-center', 'text-muted-foreground bg-muted/30 flex items-center'],
  ['py-2.5 bg-muted/40/90 border-b', 'py-2.5 bg-muted/90 border-b'],
  ['py-2 bg-muted/40/80 border-t', 'py-2 bg-muted/80 border-t'],
  ['border-t border-border bg-muted/40/50', 'border-t border-border bg-muted/50']
];

for (const [from, to] of omniReplacements) {
  if (!omnichannel.includes(from)) {
    console.error(`ERROR: Target string not found: "${from}"`);
    process.exit(1);
  }
  omnichannel = omnichannel.replace(from, to);
}
fs.writeFileSync('.agents/teamwork/explorer_m3_iter3_2/OmnichannelView.vue.proposed', omnichannel, 'utf8');
console.log('Successfully wrote OmnichannelView.vue.proposed');

// 2. audit-tokens.cjs
let audit = fs.readFileSync('scripts/audit-tokens.cjs', 'utf8');
const searchBlock = `  inlineHexStyles: {
    name: 'Inline Hex/RGB Styles',
    pattern: /(?:style|:style)\\s*=\\s*(?:"[^"]*(?:#[0-9a-fA-F]{3,8}|rgba?\\([^)]+\\))[^"]*"|'[^']*(?:#[0-9a-fA-F]{3,8}|rgba?\\([^)]+\\))[^']*')/g
  }`;

const replaceBlock = `  inlineHexStyles: {
    name: 'Inline Hex/RGB Styles',
    pattern: /(?:style|:style)\\s*=\\s*(?:"[^"]*(?:#[0-9a-fA-F]{3,8}|rgba?\\([^)]+\\))[^"]*"|'[^']*(?:#[0-9a-fA-F]{3,8}|rgba?\\([^)]+\\))[^']*')/g
  },
  malformedDoubleOpacity: {
    name: 'Malformed Double-Slash Opacity Classes',
    pattern: /\\b(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|divide(?:-[xy])?)-[a-zA-Z0-9_-]+\\/\\d+\\/\\d+\\b/g
  }`;

if (!audit.includes(searchBlock)) {
  console.error('ERROR: searchBlock not found in audit-tokens.cjs');
  process.exit(1);
}
audit = audit.replace(searchBlock, replaceBlock);
fs.writeFileSync('.agents/teamwork/explorer_m3_iter3_2/audit-tokens.cjs.proposed', audit, 'utf8');
console.log('Successfully wrote audit-tokens.cjs.proposed');
