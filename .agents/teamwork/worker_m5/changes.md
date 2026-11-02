# Batch 8 & Batch 9 Semantic Token Migration Changes

**Agent**: worker_m5  
**Milestone**: Milestone 5  
**Date**: 2026-11-01  
**Scope**: 24 total files (Batch 8: 21 files; Batch 9: 3 files)

---

## 1. Executive Summary

Milestone 5 dark mode semantic token migration is 100% complete across all 24 assigned files:
- **Batch 8 (Auth & Onboarding)**: 21 files scanned, **0 token violations**.
- **Batch 9 (Docs & Guidelines)**: 2 views + 1 guidelines data file scanned, **0 token violations** (1,846 baseline violations eliminated!).
- **TypeScript & Bundling Gate**: `npm.cmd run build` (`vue-tsc -b && vite build`) passed with exit code 0 in 4.63s across 2,961 modules.

---

## 2. File Modification Details

### 2.1 Batch 8 — Primary Views (4 files)

1. **`src/views/AuthView.vue`**
   - Migrated left branding showcase banner to invariant dark rail tokens: `bg-rail`, `border-rail-border`, `text-rail-foreground`, `text-rail-muted-foreground`.
   - Replaced raw colors and dark overrides in right authentication card: `bg-card`, `border-border`, `text-foreground`, `text-muted-foreground`.
   - Primary submit button and active tab pills now use `bg-primary`, `text-primary-foreground`.
   - Audit result: **0 violations**.

2. **`src/views/OnboardingView.vue`**
   - Implemented dynamic DOM-to-sRGB resolver `getConfettiColors()`:
     ```typescript
     function getConfettiColors(): string[] {
       const probe = document.createElement('div')
       probe.style.display = 'none'
       document.body.appendChild(probe)
       const resolve = (cls: string): string => {
         probe.className = cls
         return getComputedStyle(probe).backgroundColor || '#008236'
       }
       const colors = [
         resolve('bg-primary'),
         resolve('bg-brand-secondary'),
         resolve('bg-info'),
         resolve('bg-warning')
       ]
       document.body.removeChild(probe)
       return colors
     }
     ```
   - Replaced all raw neutrals and dark class overrides with semantic tokens.
   - Audit result: **0 violations**.

3. **`src/views/SetupWizardView.vue`**
   - Added `getConfettiColors()` helper to resolve CSS variables into sRGB strings for `canvas-confetti`.
   - Fully tokenized wizard layout, progress stepper, and step cards with semantic tokens.
   - Audit result: **0 violations**.

4. **`src/views/OnboardingV1View.vue`**
   - Tokenized legacy onboarding view: `bg-background`, `bg-card`, `border-border`, `text-foreground`, `text-muted-foreground`.
   - Replaced hardcoded status colors and buttons with `bg-primary` and `bg-success/10`.
   - Audit result: **0 violations**.

---

### 2.2 Batch 8 — Group A Onboarding Components (7 files)

5. **`src/components/onboarding/StepBusiness.vue`**: Replaced form control borders and text with `bg-card`, `border-border`, `text-foreground`, `text-muted-foreground`. (0 violations)
6. **`src/components/onboarding/StepPlan.vue`**: Replaced plan selection pricing cards with semantic tokens. Popular badge migrated to `bg-primary text-primary-foreground`. (0 violations)
7. **`src/components/onboarding/StepReady.vue`**: Tokenized completion celebration screen, checklist badges with `bg-success/10 text-success border-success/20`. (0 violations)
8. **`src/components/onboarding/StepSetupChecklist.vue`**: Migrated checklist task items, status indicators, and action triggers to semantic tokens. (0 violations)
9. **`src/components/onboarding/StepTeam.vue`**: Migrated team member invitation inputs, role selectors, and tags to semantic tokens. (0 violations)
10. **`src/components/onboarding/StepWebsiteWidget.vue`**: Migrated widget preview container, embed code block to `bg-rail border-rail-border text-rail-foreground font-mono`. (0 violations)
11. **`src/components/onboarding/StepWhatsApp.vue`**: Migrated QR code verification card, connection status pings to semantic tokens. (0 violations)

---

### 2.3 Batch 8 — Group B V2 Onboarding Components (10 files)

12. **`src/components/onboarding/v2/OnboardingSideNav.vue`**: Tokenized sidebar navigation links and active step indicators. (0 violations)
13. **`src/components/onboarding/v2/OnboardingTopStepper.vue`**: Tokenized top horizontal stepper bar. (0 violations)
14. **`src/components/onboarding/v2/SetupWizardTopStepper.vue`**: Tokenized wizard step indicators and connector lines. (0 violations)
15. **`src/components/onboarding/v2/StepCompanyNameType.vue`**: Tokenized organization profile form fields. (0 violations)
16. **`src/components/onboarding/v2/StepCountryCurrency.vue`**: Tokenized country and currency selection dropdowns and tags. (0 violations)
17. **`src/components/onboarding/v2/StepPlanSelection.vue`**: Tokenized v2 plan tiers, pricing cards, and feature lists. (0 violations)
18. **`src/components/onboarding/v2/StepTeamIndustry.vue`**: Tokenized industry selector and team size buttons. (0 violations)
19. **`src/components/onboarding/v2/StepWizardLiveChat.vue`**: Tokenized live chat setup preview and widget settings. (0 violations)
20. **`src/components/onboarding/v2/StepWizardTeam.vue`**: Tokenized wizard team member invitation table and modal inputs. (0 violations)
21. **`src/components/onboarding/v2/StepWizardWhatsApp.vue`**: Tokenized wizard WhatsApp Cloud API connection controls. (0 violations)

---

### 2.4 Batch 9 — Docs & Guidelines (3 files)

22. **`src/data/designSystemGuidelines.ts`**
   - Replaced legacy color classes and hardcoded hex values in exported markdown documentation strings:
     - `text-gray-900 dark:text-foreground` -> `text-foreground`
     - `bg-white dark:bg-card` -> `bg-card`
     - `bg-gray-50 dark:bg-background` -> `bg-background`
     - `bg-gray-900` outer rail -> `bg-rail`
     - Pipeline hexes `#3b82f6`, `#00D2C4`, `#FFCC00`, `#FF8800`, `#10B981` -> `--tag-1` through `--tag-5`
     - `bg-[#23B750] text-white` -> `bg-primary text-primary-foreground`
   - Audit result: **0 violations**.

23. **`src/views/GuidelinesView.vue`**
   - Replaced 378 baseline violations across all 10 brand guideline sections.
   - Migrated outer layout and sidebar navigation: `bg-background text-foreground`, `border-border bg-card`.
   - Dark logo canvas migrated to invariant rail tokens: `bg-rail border-rail-border text-rail-foreground`.
   - Clear space visualizer and contrast rating badges converted to semantic tokens (`bg-primary/10`, `bg-success/10`, `bg-destructive/10`).
   - Copywriting Good/Bad panels converted to `bg-success/10` and `bg-destructive/10`.
   - Audit result: **0 violations**.

24. **`src/views/DesignSystemView.vue`**
   - Replaced 1,468 baseline violations across all 10 showroom and catalog sections.
   - **Kanban Stage Colors (`stageColorConfig`)**: Updated from legacy hexes to categorical tag tokens (`border-t-tag-1` through `border-t-tag-5`, `bg-tag-N/10`, `text-tag-N-foreground`, `bg-tag-N`).
   - **Scoped `<style>` Shimmer**: Replaced `rgba(16, 185, 129, ...)` with `color-mix(in oklch, var(--primary) ..., transparent)`.
   - **ESM Code Blocks**: Migrated all inspector containers and code snippets to invariant dark rail tokens: `bg-rail border-rail-border text-rail-foreground font-mono`, syntax highlights to `text-warning`, `text-primary`, `text-rail-muted-foreground`.
   - **Showroom Interactive Sandbox**: Migrated theme toggle, accent tint picker, density switcher, and sticky category quick navigation to semantic tokens without `dark:` overrides.
   - **Section 6 Color Swatches**: Migrated lime accent to `bg-brand-secondary`, charcoal to `bg-rail`, and system states to `bg-success`, `bg-info`, `bg-warning`, `bg-destructive`.
   - **Category 9 Omnichannel Chat Simulator**: Synchronized 1:1 with `OmnichannelView.vue` (outgoing bubbles: `bg-primary text-primary-foreground`, incoming bubbles: `bg-card text-foreground border-border`, SLA badge: `bg-destructive/10 text-destructive`, unread: `bg-destructive text-destructive-foreground`, VIP: `bg-tag-4/10 text-tag-4-foreground border-tag-4/20`).
   - Audit result: **0 violations**.

---

## 3. Verification Commands & Outputs

```powershell
# Batch 8 Verification
node scripts/audit-tokens.cjs --batch 8
# ✔ SUCCESS: 0 token violations detected across all 21 scanned files!

# Batch 9 Verification
node scripts/audit-tokens.cjs --batch 9
# ✔ SUCCESS: 0 token violations detected across all 2 scanned files!

# Design System Guidelines Data Verification
node scripts/audit-tokens.cjs --file src/data/designSystemGuidelines.ts
# ✔ SUCCESS: 0 token violations detected across all 1 scanned files!

# TypeScript & Production Build Verification
npm.cmd run build
# vue-tsc -b && vite build
# ✓ 2961 modules transformed.
# ✓ built in 4.63s
```
