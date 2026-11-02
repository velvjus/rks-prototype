/**
 * Independent Forensic Audit Suite for Milestone 5 (Batch 8 & Batch 9)
 * Executed independently by auditor_m5_1.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname, '../../..');

const BATCH_8_FILES = [
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
];

const BATCH_9_FILES = [
  'src/views/DesignSystemView.vue',
  'src/views/GuidelinesView.vue',
  'src/data/designSystemGuidelines.ts'
];

const ALL_M5_FILES = [...BATCH_8_FILES, ...BATCH_9_FILES];

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;
const failureDetails = [];

function assert(condition, testName, details = '') {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  ✔ PASS: ${testName}`);
  } else {
    failedChecks++;
    console.error(`  ✖ FAIL: ${testName}`);
    if (details) {
      console.error(`    > ${details}`);
      failureDetails.push({ testName, details });
    }
  }
}

console.log('='.repeat(75));
console.log(' INDEPENDENT FORENSIC AUDIT SUITE — MILESTONE 5 (BATCHES 8 & 9)');
console.log('='.repeat(75));

// SUITE 1: File Existence, Sizing & Non-Trivial Implementation (Anti-Facade)
console.log('\n[Suite 1] File Integrity & Non-Trivial Implementation:');
for (const relPath of ALL_M5_FILES) {
  const fullPath = path.join(PROJECT_ROOT, relPath);
  const exists = fs.existsSync(fullPath);
  assert(exists, `File exists: ${relPath}`);
  if (exists) {
    const stat = fs.statSync(fullPath);
    const content = fs.readFileSync(fullPath, 'utf8');
    // Ensure file is not empty or trivial stub
    assert(stat.size > 500, `Non-trivial size (>500B): ${relPath} (${stat.size} bytes)`);
    // Ensure not stubbed with NotImplemented or empty component
    assert(!content.includes('NotImplementedError') && !content.includes('TODO: Implement'),
      `No dummy stub markers: ${relPath}`);
  }
}

// SUITE 2: Specific Logic & Business Feature Preservation
console.log('\n[Suite 2] Business Logic & Feature Preservation:');

// AuthView.vue
const authContent = fs.readFileSync(path.join(PROJECT_ROOT, 'src/views/AuthView.vue'), 'utf8');
assert(authContent.includes("mode = 'signup'") && authContent.includes("mode = 'verify'") && authContent.includes("mode = 'login'"),
  'AuthView retains 3 interactive auth modes (signup, verify, login)');
assert(authContent.includes('loginPassword') && authContent.includes('submitLogin'),
  'AuthView retains login password input and submitLogin handling');

// OnboardingView.vue & SetupWizardView.vue
const onboardingContent = fs.readFileSync(path.join(PROJECT_ROOT, 'src/views/OnboardingView.vue'), 'utf8');
const setupWizardContent = fs.readFileSync(path.join(PROJECT_ROOT, 'src/views/SetupWizardView.vue'), 'utf8');
assert(onboardingContent.includes('getConfettiColors') && onboardingContent.includes('confetti('),
  'OnboardingView has dynamic CSS token confetti resolver and triggers confetti');
assert(setupWizardContent.includes('getConfettiColors') && setupWizardContent.includes('confetti('),
  'SetupWizardView has dynamic CSS token confetti resolver and triggers confetti');
assert(setupWizardContent.includes('showSkipConfirmModal') && setupWizardContent.includes('confirmSkipAnyway'),
  'SetupWizardView retains skip modal confirmation workflow');

// DesignSystemView.vue
const designSystemContent = fs.readFileSync(path.join(PROJECT_ROOT, 'src/views/DesignSystemView.vue'), 'utf8');
assert(designSystemContent.includes('stageColorConfig') && designSystemContent.includes('border-t-tag-1'),
  'DesignSystemView Kanban board uses categorical tag tokens (border-t-tag-1..5)');
assert(designSystemContent.includes('activeTab') || designSystemContent.includes('selectedCategory'),
  'DesignSystemView retains category navigation tabs');
assert(designSystemContent.includes('bg-rail') && designSystemContent.includes('text-rail-foreground'),
  'DesignSystemView code blocks and terminals use dark invariant --rail tokens');
assert(!designSystemContent.includes('rgba(16, 185, 129'),
  'DesignSystemView scoped style eliminated raw rgba shimmer');

// GuidelinesView.vue
const guidelinesContent = fs.readFileSync(path.join(PROJECT_ROOT, 'src/views/GuidelinesView.vue'), 'utf8');
assert(guidelinesContent.includes('guidelines') || guidelinesContent.includes('sections') || guidelinesContent.includes('activeSection'),
  'GuidelinesView maintains navigation and brand guideline structure');
assert(guidelinesContent.includes('bg-rail'),
  'GuidelinesView dark invariant logo container uses --rail token');

// SUITE 3: Strict AGENTS.md Conformance (Palette Grays, Hex/RGB, Raw Status, Dark: Overrides)
console.log('\n[Suite 3] Strict Token Rules Conformance (AGENTS.md):');

const STRICT_RULES = {
  paletteGrays: /\b(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|divide(?:-[xy])?|fill|stroke|outline|placeholder|shadow|accent|caret)-(?:gray|slate|zinc|neutral|stone)-\d+\b|\b(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|divide(?:-[xy])?|fill|stroke|outline|shadow|accent|caret)-(?:white|black)\b/g,
  hexRgbClasses: /\b(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|divide(?:-[xy])?|fill|stroke|outline|accent|caret)-(?:\[(?:#[0-9a-fA-F]{3,8}|rgba?\([^\]]+\))\])|\bshadow-\[[^\]]*(?:#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))[^\]]*\]/g,
  rawStatusColors: /\b(?:bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|divide(?:-[xy])?|fill|stroke|outline|placeholder|shadow|accent|caret)-(?:red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+\b/g,
  darkOverrides: /\bdark:(?:bg|text|border|ring|fill|stroke|divide|placeholder|shadow)-[^\s"'>]+|\bdark:(?:[a-zA-Z0-9_\-\[\]#:\/]+)\b/g,
  inlineHexStyles: /(?:style|:style)\s*=\s*(?:"[^"]*(?:#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))[^"]*"|'[^']*(?:#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))[^']*')/g
};

for (const relPath of ALL_M5_FILES) {
  const fullPath = path.join(PROJECT_ROOT, relPath);
  const content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split(/\r?\n/);
  let fileViolations = 0;
  const violationsList = [];

  let inScript = false;
  let inStyle = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;
    const trimmed = line.trim();

    if (line.includes('<style')) inStyle = true;
    if (line.includes('</style>')) { inStyle = false; continue; }
    if (line.includes('<script')) inScript = true;
    if (line.includes('</script>')) { inScript = false; continue; }

    // Skip pure comment lines
    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*') || (trimmed.startsWith('<!--') && trimmed.endsWith('-->'))) {
      continue;
    }

    if (!inStyle) {
      for (const [rName, regex] of Object.entries(STRICT_RULES)) {
        regex.lastIndex = 0;
        let match;
        while ((match = regex.exec(line)) !== null) {
          fileViolations++;
          violationsList.push(`Line ${lineNum} [${rName}]: ${match[0]}`);
        }
      }
    } else {
      // Inside <style>, verify no raw hex or rgb
      const scopedHex = /#[0-9a-fA-F]{3,8}\b|\brgba?\(\s*\d+/g;
      let sMatch;
      while ((sMatch = scopedHex.exec(line)) !== null) {
        fileViolations++;
        violationsList.push(`Line ${lineNum} [scopedHex]: ${sMatch[0]}`);
      }
    }
  }

  assert(fileViolations === 0, `Zero strict token violations: ${relPath}`,
    violationsList.slice(0, 5).join('; '));
}

// SUITE 4: Anti-Tampering & Script Integrity
console.log('\n[Suite 4] Anti-Tampering & Tool Integrity:');

const auditScriptContent = fs.readFileSync(path.join(PROJECT_ROOT, 'scripts/audit-tokens.cjs'), 'utf8');
assert(!auditScriptContent.includes('// audit-disable') && !auditScriptContent.includes('bypass'),
  'scripts/audit-tokens.cjs has no bypass switches or disable comments');
assert(auditScriptContent.includes('scopedStyleHexRgb') && auditScriptContent.includes('malformedDoubleOpacity'),
  'scripts/audit-tokens.cjs maintains hardened AST & scoped style checks');
assert(auditScriptContent.includes('paletteGrays') && auditScriptContent.includes('darkOverrides'),
  'scripts/audit-tokens.cjs enforces paletteGrays and darkOverrides');

// Verify git status of scripts/audit-tokens.cjs
const gitDiffAudit = execSync('git diff scripts/audit-tokens.cjs', { cwd: PROJECT_ROOT }).toString();
assert(gitDiffAudit.trim() === '', 'scripts/audit-tokens.cjs has zero git uncommitted diffs');

console.log('\n' + '='.repeat(75));
console.log(`FORENSIC AUDIT SUMMARY: Total: ${totalChecks} | Passed: ${passedChecks} | Failed: ${failedChecks}`);
console.log('='.repeat(75) + '\n');

if (failedChecks > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
