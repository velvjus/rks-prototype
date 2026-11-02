# Orchestrator 2 Plan: Completion of Dark Mode Migration

## Overview
Orchestrator 1 completed Milestones 1 through 4 (Token Foundation, App Shell, UI Components, CRM Core, Omnichannel, Settings, Forms & Tools, Partner Portal). All 380+ files across Batches 1 to 7 have 0 token violations and pass clean production build.
Orchestrator 2 will execute the remaining milestones to fulfill all project acceptance criteria:
- **Milestone 5 (Batches 8 & 9: Auth, Onboarding & Documentation Views)**
  - Batch 8: `AuthView.vue`, `OnboardingView.vue`, `SetupWizardView.vue`, steps, steppers.
  - Batch 9: `DesignSystemView.vue`, `GuidelinesView.vue`.
  - Quality target: 0 violations via `node scripts/audit-tokens.cjs --batch 8` and `--batch 9`.
  - Gate check: Reviewers APPROVE, Challengers APPROVE, Auditor CLEAN.
- **Milestone 6 (Charts Dynamic Theming, Documentation Alignment & Verification Gate)**
  - Dynamic ApexCharts & Unovis theming via `useChartTheme.ts` reading CSS variables (`getComputedStyle`).
  - Documentation: Update `DESIGN.md` to align with token rules in `AGENTS.md`.
  - Full-codebase 0-violation token audit.
  - Full-codebase clean production build (`npm run build`).
  - Gate check: Reviewers APPROVE, Challengers APPROVE, Auditor CLEAN.

## Execution Steps

### Milestone 5
1. **Exploration**: Spawn 3 parallel Explorers (`explorer_m5_1`, `explorer_m5_2`, `explorer_m5_3`) to analyze Batch 8 & Batch 9 files, identify all violations, raw colors, canvas/svg issues, and provide concrete replacement plans.
2. **Implementation**: Spawn 1 Worker (`worker_m5`) with explorer recommendations to apply token replacements, verify with audit script and `npm run build`.
3. **Review & Challenge**: Spawn 2 Reviewers (`reviewer_m5_1`, `reviewer_m5_2`) and 2 Challengers (`challenger_m5_1`, `challenger_m5_2`) in parallel.
4. **Integrity Audit**: Spawn 1 Forensic Auditor (`auditor_m5_1`) to verify authentic token usage and no hardcoded workarounds.
5. **Gate Evaluation**: Check Gate 5 criteria. If all pass, proceed to Milestone 6.

### Milestone 6
1. **Exploration**: Spawn Explorers for Charts dynamic theming and DESIGN.md alignment.
2. **Implementation**: Spawn Worker to implement dynamic chart theming composable and update all charts, confetti, DESIGN.md.
3. **Review & Challenge**: Reviewers & Challengers verify dynamic reactivity to theme changes and full codebase build/audit.
4. **Integrity Audit**: Auditor runs full forensic checks.
5. **Gate Evaluation**: Final acceptance criteria verification and reporting.
