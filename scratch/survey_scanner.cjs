const fs = require('fs');
const path = require('path');

// Batch definitions based on R2 and repository structure
const batches = {
  1: {
    name: 'Batch 1 (App Shell)',
    description: 'MainLayout.vue, AppShell.vue, Sidebar.vue, SidebarItem, SecondaryPanel.vue, TopNav, InboxDropdown, ToastNotifications',
    files: [
      'src/layouts/MainLayout.vue',
      'src/components/layout/AppShell.vue',
      'src/components/layout/Sidebar.vue',
      'src/components/layout/SidebarItem.vue',
      'src/components/layout/SecondaryPanel.vue',
      'src/components/layout/TopNav.vue',
      'src/components/omnichannel/InboxDropdown.vue',
      'src/components/omnichannel/ToastNotifications.vue',
      'src/App.vue' // coupled entry layout wrapper
    ]
  },
  2: {
    name: 'Batch 2 (UI Components)',
    description: 'All components in src/components/ui/',
    directory: 'src/components/ui'
  },
  3: {
    name: 'Batch 3 (CRM Core)',
    description: 'DashboardView, DealsView, ContactsView, ContactDrawer, FiltersModal, CompaniesView, CalendarView, EventsView',
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
    description: 'OmnichannelView, ConversationItem, OmnichannelTutorialModal, TemplatePickerModal, ManageTemplatesView, PlatformIcon',
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
    description: 'SettingsView, AIAssistantsTab, AutomationTab, AgentsTab, TeamsTab, RolesTab, CrmSetupStatusBar',
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
    description: 'FormBuilderView, WebFormsDashboardView, FormDetailView, SubmissionsView, BookingPagesView, ScanNameCardView, AddonsView',
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
    description: 'PartnerReferrals, PartnerOverview, PartnerWithdrawal, PartnerProgram, PartnerRegister, PartnerCommissions, PartnerKit, PartnerTrackSwitcher',
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
    description: 'AuthView, OnboardingView, SetupWizardView, steps, steppers',
    files: [
      'src/views/AuthView.vue',
      'src/views/OnboardingView.vue',
      'src/views/OnboardingV1View.vue',
      'src/views/SetupWizardView.vue',
      'src/components/onboarding/StepBusiness.vue',
      'src/components/onboarding/StepPlan.vue',
      'src/components/onboarding/StepReady.vue',
      'src/components/onboarding/StepSetupChecklist.vue',
      'src/components/onboarding/StepTeam.vue',
      'src/components/onboarding/StepWebsiteWidget.vue',
      'src/components/onboarding/StepWhatsApp.vue',
      'src/components/onboarding/v2/OnboardingSideNav.vue',
      'src/components/onboarding/v2/OnboardingTopStepper.vue',
      'src/components/onboarding/v2/SetupWizardTopStepper.vue',
      'src/components/onboarding/v2/StepCompanyNameType.vue',
      'src/components/onboarding/v2/StepCountryCurrency.vue',
      'src/components/onboarding/v2/StepPlanSelection.vue',
      'src/components/onboarding/v2/StepTeamIndustry.vue',
      'src/components/onboarding/v2/StepWizardLiveChat.vue',
      'src/components/onboarding/v2/StepWizardTeam.vue',
      'src/components/onboarding/v2/StepWizardWhatsApp.vue'
    ]
  },
  9: {
    name: 'Batch 9 (Docs & Guidelines)',
    description: 'DesignSystemView, GuidelinesView',
    files: [
      'src/views/DesignSystemView.vue',
      'src/views/GuidelinesView.vue'
    ]
  }
};

function getAllFiles(dir, exts = ['.vue', '.ts', '.js']) {
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

// Regex rules for violations
const rules = {
  paletteGrays: {
    name: 'Palette Grays & Neutrals',
    pattern: /\b(?:bg|text|border|ring|divide|fill|stroke|outline)-(?:gray|slate|zinc|neutral|stone)-(?:50|100|200|300|400|500|600|700|800|900|950)\b|\b(?:bg|text|border|ring|divide|fill|stroke|outline)-(?:white|black)\b/g
  },
  hexRgbClasses: {
    name: 'Tailwind Hex/RGB Arbitrary Values',
    pattern: /\b(?:bg|text|border|ring|divide|fill|stroke|outline|from|to|via)-\[(?:#[0-9a-fA-F]{3,8}|rgba?\([^\]]+\))\]/g
  },
  inlineHexRgb: {
    name: 'Inline Style / Attribute Hex/RGB',
    pattern: /(?:style|:style)\s*=\s*["'][^"']*(?:#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))[^"']*["']|fill\s*=\s*["']#(?:[0-9a-fA-F]{3,8})["']|stroke\s*=\s*["']#(?:[0-9a-fA-F]{3,8})["']/g
  },
  jsHexLiterals: {
    name: 'JavaScript Hex/RGB Literals',
    pattern: /['"]#(?:[0-9a-fA-F]{3,8})['"]|['"]rgba?\([^'"]+\)['"]/g
  },
  rawStatusColors: {
    name: 'Raw Status / Accent Colors',
    pattern: /\b(?:bg|text|border|ring|divide|fill|stroke)-(?:red|green|emerald|blue|sky|indigo|purple|violet|amber|yellow|orange|rose)-(?:50|100|200|300|400|500|600|700|800|900|950)\b/g
  },
  darkOverrides: {
    name: 'dark: Overrides',
    pattern: /\bdark:(?:[a-zA-Z0-9_\-\[\]#:\/]+)\b/g
  }
};

// Patterns for complex UI patterns
const complexPatterns = {
  apexCharts: /<apexchart|ApexCharts|import.*apexcharts/i,
  unovisCharts: /@unovis\/vue|VisXYContainer|VisLine|VisArea|VisAxis|VisCrosshair/i,
  canvas: /<canvas|getContext\(['"]2d['"]\)/i,
  svgWithHex: /<svg[^>]*>[\s\S]*?(?:#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))[\s\S]*?<\/svg>/i,
  gradients: /\b(?:bg-gradient-to-[a-z]+|from-[^\s"'>]+|to-[^\s"'>]+|via-[^\s"'>]+)\b|linear-gradient\([^)]+\)/i,
  customBadgeStatusMap: /(?:badgeVariant|statusColors|statusClass|typeColorMap|colorMap)\s*[=:]/i
};

function analyzeFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return { error: 'File not found: ' + filePath };
  }
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  const fileReport = {
    filePath,
    totalLines: lines.length,
    violations: {
      paletteGrays: [],
      hexRgbClasses: [],
      inlineHexRgb: [],
      jsHexLiterals: [],
      rawStatusColors: [],
      darkOverrides: []
    },
    counts: {
      paletteGrays: 0,
      hexRgbClasses: 0,
      inlineHexRgb: 0,
      jsHexLiterals: 0,
      rawStatusColors: 0,
      darkOverrides: 0,
      total: 0
    },
    complexUI: {
      apexCharts: complexPatterns.apexCharts.test(content),
      unovisCharts: complexPatterns.unovisCharts.test(content),
      canvas: complexPatterns.canvas.test(content),
      svgWithHex: complexPatterns.svgWithHex.test(content),
      gradients: complexPatterns.gradients.test(content),
      customBadgeStatusMap: complexPatterns.customBadgeStatusMap.test(content)
    }
  };

  // Inspect line by line for precise line numbers
  lines.forEach((line, index) => {
    const lineNum = index + 1;

    for (const [key, rule] of Object.entries(rules)) {
      // For jsHexLiterals, don't count if already matched by inlineHexRgb or hexRgbClasses
      let matches = line.match(rule.pattern);
      if (matches) {
        matches.forEach(m => {
          fileReport.violations[key].push({ line: lineNum, match: m });
          fileReport.counts[key]++;
        });
      }
    }
  });

  // Calculate total violations
  fileReport.counts.total =
    fileReport.counts.paletteGrays +
    fileReport.counts.hexRgbClasses +
    fileReport.counts.inlineHexRgb +
    fileReport.counts.rawStatusColors +
    fileReport.counts.darkOverrides;

  return fileReport;
}

// Execute analysis across all batches
const batchResults = {};

for (const [batchId, batch] of Object.entries(batches)) {
  let fileList = [];
  if (batch.directory) {
    fileList = getAllFiles(batch.directory, ['.vue', '.ts']);
  } else {
    fileList = batch.files;
  }

  const results = {
    batchId,
    name: batch.name,
    description: batch.description,
    fileCount: fileList.length,
    files: {},
    totals: {
      totalLines: 0,
      paletteGrays: 0,
      hexRgbClasses: 0,
      inlineHexRgb: 0,
      jsHexLiterals: 0,
      rawStatusColors: 0,
      darkOverrides: 0,
      totalViolations: 0
    },
    complexSummary: {
      apexCharts: [],
      unovisCharts: [],
      canvas: [],
      svgWithHex: [],
      gradients: [],
      customBadgeStatusMap: []
    }
  };

  fileList.forEach(file => {
    const rep = analyzeFile(file);
    results.files[file] = rep;
    if (!rep.error) {
      results.totals.totalLines += rep.totalLines;
      results.totals.paletteGrays += rep.counts.paletteGrays;
      results.totals.hexRgbClasses += rep.counts.hexRgbClasses;
      results.totals.inlineHexRgb += rep.counts.inlineHexRgb;
      results.totals.jsHexLiterals += rep.counts.jsHexLiterals;
      results.totals.rawStatusColors += rep.counts.rawStatusColors;
      results.totals.darkOverrides += rep.counts.darkOverrides;
      results.totals.totalViolations += rep.counts.total;

      if (rep.complexUI.apexCharts) results.complexSummary.apexCharts.push(file);
      if (rep.complexUI.unovisCharts) results.complexSummary.unovisCharts.push(file);
      if (rep.complexUI.canvas) results.complexSummary.canvas.push(file);
      if (rep.complexUI.svgWithHex) results.complexSummary.svgWithHex.push(file);
      if (rep.complexUI.gradients) results.complexSummary.gradients.push(file);
      if (rep.complexUI.customBadgeStatusMap) results.complexSummary.customBadgeStatusMap.push(file);
    }
  });

  batchResults[batchId] = results;
}

// Summary overview
console.log('========================================================================');
console.log('                   BATCH SURVEY SUMMARY OVERVIEW                        ');
console.log('========================================================================');
let grandTotalFiles = 0;
let grandTotalLines = 0;
let grandTotalViolations = 0;

for (const [id, b] of Object.entries(batchResults)) {
  grandTotalFiles += b.fileCount;
  grandTotalLines += b.totals.totalLines;
  grandTotalViolations += b.totals.totalViolations;

  console.log(`[Batch ${id}] ${b.name} (${b.fileCount} files, ${b.totals.totalLines} lines)`);
  console.log(`  - Total Violations: ${b.totals.totalViolations}`);
  console.log(`    * Palette Grays/Neutrals: ${b.totals.paletteGrays}`);
  console.log(`    * Hex/RGB Classes:       ${b.totals.hexRgbClasses}`);
  console.log(`    * Inline Style Hex/RGB:   ${b.totals.inlineHexRgb}`);
  console.log(`    * Raw Status Colors:      ${b.totals.rawStatusColors}`);
  console.log(`    * dark: Overrides:        ${b.totals.darkOverrides}`);
  console.log(`    * JS Hex Literals:        ${b.totals.jsHexLiterals}`);
  console.log(`  - Complex UI: ApexCharts=${b.complexSummary.apexCharts.length}, Unovis=${b.complexSummary.unovisCharts.length}, Canvas=${b.complexSummary.canvas.length}, Gradients=${b.complexSummary.gradients.length}`);
}

console.log('------------------------------------------------------------------------');
console.log(`GRAND TOTALS: ${grandTotalFiles} files, ${grandTotalLines} lines, ${grandTotalViolations} total violations`);
console.log('========================================================================');

// Output JSON file for detailed extraction
fs.writeFileSync('scratch/survey_results.json', JSON.stringify(batchResults, null, 2));
console.log('Detailed survey results written to scratch/survey_results.json');
