# BRIEFING — 2026-10-31T21:46:00Z

## Mission
Investigate Batch 8 Auth & Onboarding views (AuthView.vue, OnboardingView.vue, SetupWizardView.vue) for raw color violations, hardcoded palette classes, dark: overrides, inline styles, and canvas confetti, and produce a token replacement plan.

## 🔒 My Identity
- Archetype: explorer
- Roles: investigation, synthesis
- Working directory: c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\explorer_m5_1
- Original parent: 3b0e86d0-7830-457c-8320-889844c38415
- Milestone: milestone_5 (Batch 8 Primary Views)

## 🔒 Key Constraints
- Read-only investigation — do NOT implement / do NOT modify codebase source files
- All styling must flow from semantic tokens in src/assets/index.css
- No raw palette grays/neutrals, no hex/rgb classes, no dark: color overrides
- Write reports only to working directory

## Current Parent
- Conversation ID: 3b0e86d0-7830-457c-8320-889844c38415
- Updated: 2026-10-31T21:46:00Z

## Investigation State
- **Explored paths**:
  - `scripts/audit-tokens.cjs`: mapped 21 files in Batch 8 with 1,413 total violations.
  - `src/views/AuthView.vue`: 150 violations.
  - `src/views/OnboardingView.vue`: 48 violations.
  - `src/views/SetupWizardView.vue`: 57 violations.
  - `src/views/OnboardingV1View.vue`: 54 violations.
  - `src/components/onboarding/` (17 components): 1,104 violations.
  - `src/assets/index.css` & `tailwind.config.js`: verified all required replacement tokens exist.
  - `node_modules/canvas-confetti/src/confetti.js`: verified internal `hexToRgb` parsing requirements.
- **Key findings**:
  - Zero `dark:` overrides across all 3 views.
  - Zero raw inline `style` colors.
  - AuthView right visual showcase panel should use `--rail` tokens (`bg-rail`, `border-rail-border`, `text-rail-foreground`, `text-rail-muted-foreground`, `bg-rail-active`) to maintain dark theme invariance.
  - Confetti cannons in OnboardingView and SetupWizardView use hardcoded hex arrays; designed `getConfettiColors()` helper for dynamic DOM resolution.
  - Full project build passes cleanly via `npm.cmd run build` (4.54s).
- **Unexplored areas**:
  - Batch 8 step/stepper child components and OnboardingV1View line-by-line replacement tables (deferred to child component migration).

## Key Decisions Made
- AuthView Right Visual Showcase mapped to Rail tokens to preserve dark aesthetic in both themes.
- Confetti particle colors resolved dynamically via DOM temporary element to satisfy `canvas-confetti`'s internal hex parsing.

## Artifact Index
- DISPATCH.md — Initial dispatch instructions
- progress.md — Liveness heartbeat and milestone tracking
- analysis.md — Full audit analysis and replacement plan
- handoff.md — Standard 5-component hard handoff report
