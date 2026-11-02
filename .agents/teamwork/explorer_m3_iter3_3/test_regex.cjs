const fs = require('fs');
const path = require('path');

const reg = /\b(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|divide(?:-[xy])?)-[a-zA-Z0-9_-]+\/\d+\/\d+\b/g;

console.log('Testing regex:');
console.log('hover:bg-muted/30/75 ->', reg.test('hover:bg-muted/30/75'));
reg.lastIndex = 0;
console.log('bg-muted/40/90 ->', reg.test('bg-muted/40/90'));
reg.lastIndex = 0;
console.log('bg-muted/90 (normal) ->', reg.test('bg-muted/90'));
reg.lastIndex = 0;
console.log('bg-muted/30 (normal) ->', reg.test('bg-muted/30'));
reg.lastIndex = 0;
console.log('border-border/80 (normal) ->', reg.test('border-border/80'));
reg.lastIndex = 0;
console.log('border-warning/30/50 (double) ->', reg.test('border-warning/30/50'));
