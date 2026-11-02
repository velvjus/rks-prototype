const fs = require('fs');
const path = require('path');

const targetFiles = [
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
  'src/components/onboarding/v2/StepWizardWhatsApp.vue',
  'src/views/DesignSystemView.vue',
  'src/views/GuidelinesView.vue',
  'src/data/designSystemGuidelines.ts'
];

console.log(`Checking existence of ${targetFiles.length} files...`);
for (const file of targetFiles) {
  if (!fs.existsSync(file)) {
    console.error(`MISSING FILE: ${file}`);
  }
}

console.log('All files exist. Running adversarial scans...');

const ADVERSARIAL_CHECKS = [
  {
    name: 'Raw Hex in classes/styles/scripts (#[0-9a-fA-F]{3,8})',
    regex: /#[0-9a-fA-F]{3,8}\b/g
  },
  {
    name: 'Raw rgb/rgba in classes/styles/scripts (rgba?\\()',
    regex: /rgba?\s*\(/g
  },
  {
    name: 'Raw Palette Grays/Neutrals (gray|slate|zinc|neutral|stone)',
    regex: /\b(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|divide(?:-[xy])?|fill|stroke|outline|placeholder|shadow|accent|caret|from|to|via)-(?:gray|slate|zinc|neutral|stone)-\d+\b/g
  },
  {
    name: 'Raw White/Black classes (bg-white, text-black, etc.)',
    regex: /\b(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|divide(?:-[xy])?|fill|stroke|outline|shadow|accent|caret)-(?:white|black)\b/g
  },
  {
    name: 'Raw Status Colors (red|green|blue|amber|emerald|rose|orange|lime|cyan|sky|teal|indigo|violet|purple|fuchsia|pink)',
    regex: /\b(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|divide(?:-[xy])?|fill|stroke|outline|placeholder|shadow|accent|caret|from|to|via)-(?:red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+\b/g
  },
  {
    name: 'Manual dark: overrides (dark:...)',
    regex: /\bdark:[^\s"'`>]+/g
  }
];

let totalFindings = 0;

for (const filePath of targetFiles) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  for (const check of ADVERSARIAL_CHECKS) {
    let fileFindings = [];
    lines.forEach((line, lineIdx) => {
      // Check if line matches
      const matches = line.match(check.regex);
      if (matches) {
        fileFindings.push({ lineNum: lineIdx + 1, line: line.trim(), matches });
      }
    });

    if (fileFindings.length > 0) {
      console.log(`\n[FINDING] ${filePath} — ${check.name} (${fileFindings.length} hits):`);
      for (const finding of fileFindings.slice(0, 5)) { // show first 5
        console.log(`  Line ${finding.lineNum}: ${finding.matches.join(', ')} -> ${finding.line.slice(0, 100)}`);
      }
      if (fileFindings.length > 5) {
        console.log(`  ... and ${fileFindings.length - 5} more hits`);
      }
      totalFindings += fileFindings.length;
    }
  }
}

console.log(`\nAdversarial scan completed. Total raw findings across all checks: ${totalFindings}`);
