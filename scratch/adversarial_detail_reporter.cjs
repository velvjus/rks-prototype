const fs = require('fs');

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

for (const filePath of targetFiles) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    const hex = line.match(/#[0-9a-fA-F]{3,8}\b/g);
    const rgba = line.match(/rgba?\s*\(/g);
    const gray = line.match(/\b(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|divide(?:-[xy])?|fill|stroke|outline|placeholder|shadow|accent|caret|from|to|via)-(?:gray|slate|zinc|neutral|stone)-\d+\b/g);
    const whiteBlack = line.match(/\b(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|divide(?:-[xy])?|fill|stroke|outline|shadow|accent|caret)-(?:white|black)\b/g);
    const dark = line.match(/\bdark:[^\s"'`>]+/g);

    if (hex || rgba || gray || whiteBlack || dark) {
      console.log(`[${filePath}:${idx + 1}]`);
      if (hex) console.log(`  HEX: ${hex.join(', ')}`);
      if (rgba) console.log(`  RGBA: ${rgba.join(', ')}`);
      if (gray) console.log(`  GRAY: ${gray.join(', ')}`);
      if (whiteBlack) console.log(`  WHITE/BLACK: ${whiteBlack.join(', ')}`);
      if (dark) console.log(`  DARK: ${dark.join(', ')}`);
      console.log(`  LINE: ${line.trim()}`);
    }
  });
}
