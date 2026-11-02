#!/usr/bin/env node

/**
 * Token Audit Tool for RakanSales C4
 * 
 * Scans files for:
 * 1. Palette grays & neutrals (gray-, slate-, zinc-, neutral-, stone-, white, black)
 * 2. Arbitrary hex/rgb classes (bg-[#...], text-[rgba(...)], etc.)
 * 3. Raw status colors (bg-green-, text-red-, etc.)
 * 4. dark: overrides (e.g. dark:bg-gray-900, dark:text-foreground)
 * 5. Inline hex/rgb styles (style="...#...")
 * 
 * Usage:
 *   node scripts/audit-tokens.cjs [--batch <1..9>] [--file <path>] [--json] [--quiet]
 */

const fs = require('fs');
const path = require('path');

// Canonical Batch Definitions
const BATCHES = {
  1: {
    name: 'Batch 1 (App Shell)',
    files: [
      'src/layouts/MainLayout.vue',
      'src/components/layout/AppShell.vue',
      'src/components/layout/Sidebar.vue',
      'src/components/layout/SidebarItem.vue',
      'src/components/layout/SecondaryPanel.vue',
      'src/components/layout/TopNav.vue',
      'src/components/omnichannel/InboxDropdown.vue',
      'src/components/omnichannel/ToastNotifications.vue',
      'src/App.vue'
    ]
  },
  2: {
    name: 'Batch 2 (UI Components)',
    directory: 'src/components/ui'
  },
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
  },
  5: {
    name: 'Batch 5 (Settings)',
    files: [
      'src/views/SettingsView.vue',
      'src/components/settings/AIAssistantsTab.vue',
      'src/components/settings/AutomationTab.vue',
      'src/components/settings/AgentsTab.vue',
      'src/components/settings/TeamsTab.vue',
      'src/components/settings/RolesTab.vue',
      'src/components/dashboard/CrmSetupStatusBar.vue'
    ]
  },
  6: {
    name: 'Batch 6 (Forms, Booking & Tools)',
    files: [
      'src/views/webforms/FormBuilderView.vue',
      'src/views/webforms/WebFormsDashboardView.vue',
      'src/views/webforms/FormDetailView.vue',
      'src/views/webforms/SubmissionsView.vue',
      'src/views/BookingPagesView.vue',
      'src/views/ScanNameCardView.vue',
      'src/views/AddonsView.vue'
    ]
  },
  7: {
    name: 'Batch 7 (Partner Portal)',
    files: [
      'src/views/partner/PartnerReferralsView.vue',
      'src/views/partner/PartnerOverviewView.vue',
      'src/views/partner/PartnerWithdrawalView.vue',
      'src/views/partner/PartnerProgramView.vue',
      'src/views/PartnerRegisterView.vue',
      'src/views/partner/PartnerCommissionsView.vue',
      'src/views/partner/PartnerKitView.vue',
      'src/components/partner/PartnerTrackSwitcher.vue'
    ]
  },
  8: {
    name: 'Batch 8 (Auth & Onboarding)',
    directory: 'src/components/onboarding',
    files: [
      'src/views/AuthView.vue',
      'src/views/OnboardingView.vue',
      'src/views/OnboardingV1View.vue',
      'src/views/SetupWizardView.vue'
    ]
  },
  9: {
    name: 'Batch 9 (Docs & Guidelines)',
    files: [
      'src/views/DesignSystemView.vue',
      'src/views/GuidelinesView.vue',
      'src/data/designSystemGuidelines.ts'
    ]
  }
};

// Audit Rules
const RULES = {
  paletteGrays: {
    name: 'Palette Grays & Neutrals',
    pattern: /\b(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|divide(?:-[xy])?|fill|stroke|outline|placeholder|shadow|accent|caret|from|to|via)-(?:gray|slate|zinc|neutral|stone)-\d+\b|\b(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|divide(?:-[xy])?|fill|stroke|outline|shadow|accent|caret)-(?:white|black)\b/g
  },
  hexRgbClasses: {
    name: 'Tailwind Arbitrary Hex/RGB Classes',
    pattern: /\b(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|divide(?:-[xy])?|fill|stroke|outline|accent|caret|from|to|via)-\[(?:#[0-9a-fA-F]{3,8}|rgba?\([^\]]+\))\]|\bshadow-\[[^\]]*(?:#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))[^\]]*\]/g
  },
  rawStatusColors: {
    name: 'Raw Status / Accent Colors',
    pattern: /\b(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|divide(?:-[xy])?|fill|stroke|outline|placeholder|shadow|accent|caret|from|to|via)-(?:red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+\b/g
  },
  darkOverrides: {
    name: 'dark: Class Overrides',
    pattern: /\bdark:(?:bg|text|border|ring|fill|stroke|divide|from|to|via|placeholder|shadow)-[^\s"'>]+|\bdark:(?:[a-zA-Z0-9_\-\[\]#:\/]+)\b/g
  },
  inlineHexStyles: {
    name: 'Inline Hex/RGB Styles',
    pattern: /(?:style|:style)\s*=\s*(?:"[^"]*(?:#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))[^"]*"|'[^']*(?:#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))[^']*')/g
  },
  malformedDoubleOpacity: {
    name: 'Malformed Double Opacity Classes',
    pattern: /\b(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|divide(?:-[xy])?)-[a-zA-Z0-9_-]+\/\d+\/\d+\b/g
  },
  scopedStyleHexRgb: {
    name: 'Scoped <style> Raw Hex/RGB Colors',
    pattern: /#[0-9a-fA-F]{3,8}\b|\brgba?\(\s*\d+/g
  }
};

function getAllFiles(dir, exts = ['.vue', '.ts', '.js', '.css']) {
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

  const isIndexCss = norm.endsWith('src/assets/index.css');
  const isVue = norm.endsWith('.vue');
  let inExemptBlock = false;
  let inStyleBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    // Line-level audit ignore comments
    if (line.includes('/* audit-ignore */') || line.includes('<!-- audit-ignore -->')) {
      continue;
    }

    // src/assets/index.css special handling:
    // :root and .dark blocks define the actual CSS custom properties (tokens) in OKLCH/hex.
    // They are exempt, but scrollbar and other utilities in index.css are checked.
    if (isIndexCss) {
      const trimmed = line.trim();
      if (trimmed.startsWith(':root') || trimmed.startsWith('.dark')) {
        inExemptBlock = true;
      }
      if (inExemptBlock) {
        if (trimmed === '}' || trimmed.startsWith('}')) {
          inExemptBlock = false;
        }
        continue;
      }
      // Also ignore variable definitions `--token: ...;`
      if (trimmed.startsWith('--') && trimmed.includes(':')) {
        continue;
      }
    }

    // Track <style> blocks in Vue SFCs
    if (isVue && line.includes('<style')) {
      inStyleBlock = true;
    }

    // Skip pure comment lines in CSS/JS
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
      // If it's a full single-line comment, skip
      if (trimmed.startsWith('//') || (trimmed.startsWith('/*') && trimmed.endsWith('*/')) || trimmed.startsWith('*')) {
        if (isVue && inStyleBlock && line.includes('</style>')) {
          inStyleBlock = false;
        }
        continue;
      }
    }

    // Check rules
    for (const [ruleKey, rule] of Object.entries(RULES)) {
      // scopedStyleHexRgb applies only inside <style> blocks in .vue files
      if (ruleKey === 'scopedStyleHexRgb' && !inStyleBlock) {
        continue;
      }
      // standard rules audit template, classes, and scripts outside <style> blocks
      if (ruleKey !== 'scopedStyleHexRgb' && inStyleBlock) {
        continue;
      }

      // Reset regex state
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

    if (isVue && inStyleBlock && line.includes('</style>')) {
      inStyleBlock = false;
    }
  }

  return {
    file: norm,
    violations,
    total: violations.length
  };
}

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    batch: null,
    file: null,
    json: false,
    quiet: false
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--batch' && args[i + 1]) {
      options.batch = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '--file' && args[i + 1]) {
      options.file = args[i + 1];
      i++;
    } else if (args[i] === '--json') {
      options.json = true;
    } else if (args[i] === '--quiet') {
      options.quiet = true;
    }
  }

  return options;
}

function main() {
  const options = parseArgs();
  let filesToScan = [];

  if (options.file) {
    filesToScan = [options.file];
  } else if (options.batch) {
    const batch = BATCHES[options.batch];
    if (!batch) {
      console.error(`Error: Unknown batch number ${options.batch}. Must be 1..9.`);
      process.exit(1);
    }
    if (batch.files) {
      filesToScan = filesToScan.concat(batch.files);
    }
    if (batch.directory) {
      filesToScan = filesToScan.concat(getAllFiles(batch.directory, ['.vue', '.ts', '.js']));
    }
  } else {
    // Default: scan all files in src/
    filesToScan = getAllFiles('src', ['.vue', '.ts', '.js', '.css']).filter(f => {
      return !f.includes('tw-animate-css.css');
    });
  }

  // Deduplicate files
  filesToScan = Array.from(new Set(filesToScan.map(normalizePath)));

  const reports = [];
  let totalViolations = 0;
  const violationCountsByRule = {};

  for (const f of filesToScan) {
    const res = auditFile(f);
    reports.push(res);
    totalViolations += res.total;
    for (const v of res.violations) {
      violationCountsByRule[v.ruleName] = (violationCountsByRule[v.ruleName] || 0) + 1;
    }
  }

  if (options.json) {
    console.log(JSON.stringify({
      scannedFilesCount: filesToScan.length,
      totalViolations,
      violationCountsByRule,
      reports: reports.filter(r => r.total > 0)
    }, null, 2));
    process.exit(totalViolations > 0 ? 1 : 0);
  }

  console.log('='.repeat(70));
  console.log(' RAKANSALES TOKEN AUDIT REPORT');
  console.log('='.repeat(70));
  console.log(`Scanned: ${filesToScan.length} file(s)`);
  if (options.batch) console.log(`Batch: ${options.batch} (${BATCHES[options.batch]?.name})`);
  if (options.file) console.log(`File: ${options.file}`);
  console.log('-'.repeat(70));

  const failingFiles = reports.filter(r => r.total > 0);

  if (failingFiles.length === 0) {
    console.log(`\x1b[32m✔ SUCCESS: 0 token violations detected across all ${filesToScan.length} scanned files!\x1b[0m\n`);
    process.exit(0);
  }

  if (!options.quiet) {
    for (const report of failingFiles) {
      console.log(`\n\x1b[31m✖ ${report.file} (${report.total} violations)\x1b[0m`);
      for (const v of report.violations.slice(0, 10)) {
        console.log(`  Line ${v.line}: [${v.ruleName}] "${v.match}"`);
        console.log(`    > ${v.snippet.slice(0, 90)}`);
      }
      if (report.violations.length > 10) {
        console.log(`  ... and ${report.violations.length - 10} more violations.`);
      }
    }
  }

  console.log('\n' + '-'.repeat(70));
  console.log('VIOLATIONS BY CATEGORY:');
  for (const [ruleName, count] of Object.entries(violationCountsByRule)) {
    console.log(`  - ${ruleName}: ${count}`);
  }
  console.log(`\x1b[31mTOTAL VIOLATIONS: ${totalViolations}\x1b[0m`);
  console.log('='.repeat(70) + '\n');

  process.exit(1);
}

if (require.main === module) {
  main();
}

module.exports = {
  auditFile,
  BATCHES,
  RULES
};
