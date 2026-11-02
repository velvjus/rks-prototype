const fs = require('fs');

const candidate = `
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/85",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        primary: "bg-primary text-primary-foreground hover:bg-primary/90 font-semibold transition-all",
        brand: "bg-brand text-brand-foreground hover:bg-brand/90 font-semibold transition-all",
        gradient: "bg-gradient-to-r from-brand to-brand-secondary text-brand-foreground hover:opacity-95 font-bold transition-all",
        success: "bg-success text-success-foreground hover:bg-success/90 font-semibold transition-all",
        danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90 font-semibold transition-all",
        dark: "bg-rail text-rail-foreground hover:bg-rail-active border border-rail-border font-semibold transition-all",
        soft: "bg-muted text-foreground hover:bg-muted/80 font-medium transition-all",
`;

const RULES = {
  paletteGrays: /\b(?:bg|text|border|ring|divide|fill|stroke|outline|placeholder|from|to|via)-(?:gray|slate|zinc|neutral|stone)-(?:50|100|200|300|400|500|600|700|800|900|950)\b|\b(?:bg|text|border|ring|divide|fill|stroke|outline)-(?:white|black)\b/g,
  hexRgbClasses: /\b(?:bg|text|border|ring|divide|fill|stroke|outline|from|to|via)-\[(?:#[0-9a-fA-F]{3,8}|rgba?\([^\]]+\))\]/g,
  rawStatusColors: /\b(?:bg|text|border|ring|divide|fill|stroke|outline|placeholder|from|to|via)-(?:red|green|emerald|blue|sky|indigo|purple|violet|amber|yellow|orange|rose)-(?:50|100|200|300|400|500|600|700|800|900|950)\b/g,
  darkOverrides: /\bdark:(?:bg|text|border|ring|fill|stroke|divide|from|to|via|placeholder|shadow)-[^\s"'>]+|\bdark:(?:[a-zA-Z0-9_\-\[\]#:\/]+)\b/g,
  inlineHexStyles: /(?:style|:style)\s*=\s*(?:"[^"]*(?:#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))[^"]*"|'[^']*(?:#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))[^']*')/g
};

let totalViolations = 0;
for (const [key, rule] of Object.entries(RULES)) {
  const matches = candidate.match(rule);
  if (matches) {
    console.log(`FAIL [${key}]:`, matches);
    totalViolations += matches.length;
  } else {
    console.log(`PASS [${key}]`);
  }
}
console.log('Total violations in candidate:', totalViolations);
