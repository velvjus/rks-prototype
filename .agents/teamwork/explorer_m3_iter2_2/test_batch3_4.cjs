const fs = require('fs');
const path = require('path');

const BATCHES = {
  3: {
    name: 'Batch 3 (CRM Core)',
    files: [
      'src/views/DashboardView.vue',
      'src/views/DealsView.vue',
      'src/views/ContactsView.vue',
      'src/components/omnichannel/ContactDrawer.vue',
      'src/components/omnichannel/FiltersModal.vue',
      'src/views/CompaniesView.vue',
      'src/views/CalendarView.vue',
      'src/views/EventsView.vue'
    ]
  },
  4: {
    name: 'Batch 4 (Omnichannel)',
    files: [
      'src/views/OmnichannelView.vue',
      'src/components/omnichannel/ConversationItem.vue',
      'src/components/omnichannel/OmnichannelTutorialModal.vue',
      'src/components/omnichannel/TemplatePickerModal.vue',
      'src/views/webforms/ManageTemplatesView.vue',
      'src/components/omnichannel/PlatformIcon.vue'
    ]
  }
};

const RULES = {
  paletteGrays: {
    name: 'Palette Grays & Neutrals',
    pattern: /\b(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|divide(?:-[xy])?|fill|stroke|outline|placeholder|from|to|via)-(?:gray|slate|zinc|neutral|stone)-\d+\b|\b(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|divide(?:-[xy])?|fill|stroke|outline)-(?:white|black)\b/g
  },
  hexRgbClasses: {
    name: 'Tailwind Arbitrary Hex/RGB Classes',
    pattern: /\b(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|divide(?:-[xy])?|fill|stroke|outline|from|to|via)-\[(?:#[0-9a-fA-F]{3,8}|rgba?\([^\]]+\))\]|\bshadow-\[[^\]]*(?:#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))[^\]]*\]/g
  },
  rawStatusColors: {
    name: 'Raw Status / Accent Colors',
    pattern: /\b(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|divide(?:-[xy])?|fill|stroke|outline|placeholder|from|to|via)-(?:red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+\b/g
  },
  darkOverrides: {
    name: 'dark: Class Overrides',
    pattern: /\bdark:(?:bg|text|border|ring|fill|stroke|divide|from|to|via|placeholder|shadow)-[^\s"'>]+|\bdark:(?:[a-zA-Z0-9_\-\[\]#:\/]+)\b/g
  },
  inlineHexStyles: {
    name: 'Inline Hex/RGB Styles',
    pattern: /(?:style|:style)\s*=\s*(?:"[^"]*(?:#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))[^"]*"|'[^']*(?:#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))[^']*')/g
  }
};

function normalizePath(p) {
  return p.replace(/\\/g, '/');
}

function auditFile(filePath) {
  const norm = normalizePath(filePath);
  if (!fs.existsSync(norm)) {
    return { file: norm, error: 'File not found', violations: [], total: 0 };
  }

  const content = fs.readFileSync(norm, 'utf8');
  const lines = content.split(/\r?\n/);
  const violations = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    if (line.includes('/* audit-ignore */') || line.includes('<!-- audit-ignore -->')) {
      continue;
    }

    const trimmed = line.trim();
    if (trimmed.startsWith('//') || (trimmed.startsWith('/*') && trimmed.endsWith('*/')) || trimmed.startsWith('*')) {
      continue;
    }

    for (const [ruleKey, rule] of Object.entries(RULES)) {
      rule.pattern.lastIndex = 0;
      let match;
      while ((match = rule.pattern.exec(line)) !== null) {
        violations.push({
          line: lineNum,
          rule: ruleKey,
          ruleName: rule.name,
          match: match[0],
          snippet: line.trim()
        });
      }
    }
  }

  return {
    file: norm,
    violations,
    total: violations.length
  };
}

for (const [batchNum, batch] of Object.entries(BATCHES)) {
  console.log(`\n========================================`);
  console.log(`Testing Hardened Audit on ${batch.name}`);
  console.log(`========================================`);

  for (const f of batch.files) {
    const res = auditFile(f);
    if (res.total > 0) {
      console.log(`\n❌ ${res.file} (${res.total} violations):`);
      for (const v of res.violations) {
        console.log(`   Line ${v.line} [${v.rule}]: ${v.match}  -->  ${v.snippet}`);
      }
    } else {
      console.log(`✔ ${res.file} (0 violations)`);
    }
  }
}
