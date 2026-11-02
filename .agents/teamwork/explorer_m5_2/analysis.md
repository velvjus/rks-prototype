# Batch 8 Steps & Steppers Token Analysis and Replacement Plan

**Investigator**: explorer_m5_2 (Teamwork Explorer)  
**Target Scope**: 17 Step & Stepper Components across `src/components/onboarding/` (v1 and v2)  
**Date**: 2026-10-31  
**Project Guidelines**: `AGENTS.md`, `src/assets/index.css`, `tailwind.config.js`

---

## 1. Executive Summary & Inventory

Feature 16 of `PROJECT.md` dictates the migration of Batch 8 (Auth & Onboarding), comprising:
- 4 Primary Views: `AuthView.vue`, `OnboardingView.vue`, `OnboardingV1View.vue`, `SetupWizardView.vue` (investigated by `explorer_m5_1`)
- **17 Step & Stepper Components**: 7 in `src/components/onboarding/` (v1) and 10 in `src/components/onboarding/v2/` (investigated by `explorer_m5_2`)

Running `node scripts/audit-tokens.cjs --batch 8` detects a total of **1,413 violations** across Batch 8:
- **309 violations** in the 4 primary views
- **1,104 violations** in the 17 step and stepper components

### 17 Component Inventory & Violation Count

| # | Component Path | Category | Violations | Palette Grays | Hex/RGB Classes | Raw Status |
|---|----------------|----------|------------|---------------|-----------------|------------|
| 1 | `src/components/onboarding/StepBusiness.vue` | v1 Step | 70 | 51 | 15 | 4 |
| 2 | `src/components/onboarding/StepPlan.vue` | v1 Step | 54 | 40 | 10 | 4 |
| 3 | `src/components/onboarding/StepReady.vue` | v1 Step | 59 | 30 | 14 | 15 |
| 4 | `src/components/onboarding/StepSetupChecklist.vue` | v1 Step | 57 | 32 | 22 | 3 |
| 5 | `src/components/onboarding/StepTeam.vue` | v1 Step | 58 | 43 | 9 | 6 |
| 6 | `src/components/onboarding/StepWebsiteWidget.vue` | v1 Step | 126 | 101 | 18 | 7 |
| 7 | `src/components/onboarding/StepWhatsApp.vue` | v1 Step | 120 | 67 | 17 | 36 |
| 8 | `src/components/onboarding/v2/OnboardingSideNav.vue` | v2 Stepper | 41 | 30 | 8 | 3 |
| 9 | `src/components/onboarding/v2/OnboardingTopStepper.vue` | v2 Stepper | 7 | 5 | 2 | 0 |
| 10 | `src/components/onboarding/v2/SetupWizardTopStepper.vue` | v2 Stepper | 7 | 5 | 2 | 0 |
| 11 | `src/components/onboarding/v2/StepCompanyNameType.vue` | v2 Step | 24 | 16 | 7 | 1 |
| 12 | `src/components/onboarding/v2/StepCountryCurrency.vue` | v2 Step | 21 | 17 | 4 | 0 |
| 13 | `src/components/onboarding/v2/StepPlanSelection.vue` | v2 Step | 67 | 48 | 14 | 5 |
| 14 | `src/components/onboarding/v2/StepTeamIndustry.vue` | v2 Step | 33 | 22 | 9 | 2 |
| 15 | `src/components/onboarding/v2/StepWizardLiveChat.vue` | v2 Step | 149 | 116 | 26 | 7 |
| 16 | `src/components/onboarding/v2/StepWizardTeam.vue` | v2 Step | 58 | 42 | 12 | 4 |
| 17 | `src/components/onboarding/v2/StepWizardWhatsApp.vue` | v2 Step | 153 | 91 | 32 | 30 |
| **Total** | **All 17 Step & Stepper Components** | | **1,104** | **756** | **221** | **127** |

**Zero `dark:` Class Overrides**: None of the 17 step/stepper components contain `dark:` class overrides.  
**Zero Scoped / Inline Style Violations**: All styling is driven through template class strings (or runtime variables in `:style="{ backgroundColor: data.widgetColor }"`).

---

## 2. Canonical Token Mapping Rules

All token replacements must strictly utilize semantic utility classes mapped in `src/assets/index.css` via `@theme inline` and `tailwind.config.js`:

| Raw Class Pattern | Semantic Token Replacement | Rationale / Context |
|---|---|---|
| `bg-white` (card, modal, step container) | `bg-card` | Surface background for cards, inputs, dialogs in light & dark mode |
| `bg-white` (full page canvas / base) | `bg-background` | Root view backdrop |
| `bg-gray-50`, `bg-gray-50/50` | `bg-muted/50` or `bg-card` | Subdued surface container, input initial state |
| `bg-gray-100`, `bg-gray-200` | `bg-muted` | Segmented pill container, secondary buttons, neutral tags |
| `text-gray-900` | `text-foreground` | High-contrast body, titles, section headings |
| `text-gray-800`, `text-gray-700` | `text-foreground` (or `text-foreground/85`) | Primary labels, subtitle headings |
| `text-gray-600`, `text-gray-500` | `text-muted-foreground` | Secondary helper descriptions, inactive pill text |
| `text-gray-400` | `text-muted-foreground` | Placeholder text, tertiary captions, hints |
| `text-gray-300` | `text-muted-foreground/40` or `text-border` | Subtle divider dots (`·`) |
| `border-gray-100`, `border-gray-200` | `border-border` (or `border-border/60`) | Standard card boundaries and dividers |
| `border-gray-300`, `border-gray-400` | `border-input` or `border-border` | Unfocused form fields, inactive radio borders |
| `border-gray-900`, `ring-gray-900` | `border-foreground`, `ring-foreground/20` | Selected color swatch border ring |
| `border-black/10` | `border-border` | Unselected color swatch border |
| `bg-[#23B750]`, `bg-[#008236]` | `bg-primary` | Primary brand green action background |
| `text-[#23B750]`, `text-[#008236]` | `text-primary` | Primary brand text accents and links |
| `border-[#23B750]`, `border-[#008236]` | `border-primary` | Active / focused border highlights |
| `ring-[#23B750]`, `ring-[#008236]` | `ring-ring` or `ring-primary` | Focus rings |
| `hover:bg-[#1a943e]`, `hover:bg-[#1fa347]` | `hover:bg-primary/90` | Primary button hover state |
| `active:bg-[#1b8e3e]` | `active:bg-primary/80` | Primary button active pressed state |
| `text-white` (on primary button/badge) | `text-primary-foreground` | Accessible high-contrast text on primary background |
| `bg-emerald-50`, `bg-emerald-100` | `bg-success/10` (or `bg-primary/10`) | Soft success/brand badge background |
| `text-emerald-700`, `text-emerald-800` | `text-success` (or `text-primary`) | Semantic success/brand text |
| `border-emerald-200` | `border-success/20` (or `border-primary/20`) | Semantic status badge border |
| `text-red-500`, `text-rose-600` | `text-destructive` | Form validation asterisks `*` and delete button hover |
| `bg-red-600` | `bg-destructive` | Discount badge background |
| `bg-blue-100`, `text-blue-800` | `bg-info/10 text-info` | Cloud API / information badge |
| `bg-sky-50`, `border-sky-200`, `text-sky-700` | `bg-info/10 border-info/20 text-info` | AI feature badges |
| `bg-[#FF5F56]`, `bg-[#FFBD2E]`, `bg-[#27C93F]` | `bg-destructive`, `bg-warning`, `bg-success` | Mac browser window controls |
| `caret-[#23B750]` | `caret-primary` | Input cursor brand color |
| `shadow-[0_3px_10px_rgba(35,183,80,0.25)]` | `shadow-sm` (or `shadow-primary/25`) | Primary action glow |

---

## 3. Special UI Patterns & Edge Cases

### Pattern 1: Mac Browser Mockup Window Controls
In `StepWebsiteWidget.vue` (lines 133–135) and `StepWizardLiveChat.vue` (lines 176–178), the interactive mock browser features three window dots:
```html
<!-- BEFORE -->
<span class="w-2 h-2 rounded-full bg-[#FF5F56]"></span>
<span class="w-2 h-2 rounded-full bg-[#FFBD2E]"></span>
<span class="w-2 h-2 rounded-full bg-[#27C93F]"></span>

<!-- AFTER -->
<span class="w-2 h-2 rounded-full bg-destructive"></span>
<span class="w-2 h-2 rounded-full bg-warning"></span>
<span class="w-2 h-2 rounded-full bg-success"></span>
```

### Pattern 2: Toggle Switches (Established Codebase Precedent)
In `StepPlan.vue`, `StepWebsiteWidget.vue`, `StepWizardTeam.vue`, and `StepWizardWhatsApp.vue`, custom checkbox toggles are styled with raw palette grays:
```html
<!-- BEFORE -->
<div class="w-8 h-4.5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[#23B750] shadow-2xs"></div>

<!-- AFTER (Aligned with BookingPagesView:377) -->
<div class="w-8 h-4.5 bg-input peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-primary-foreground after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-card after:border-border after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-primary shadow-2xs"></div>
```

### Pattern 3: Sub-Step Pill Switchers
Across `StepWebsiteWidget.vue`, `StepWhatsApp.vue`, `StepWizardWhatsApp.vue`, and `StepWizardLiveChat.vue`:
```html
<!-- Container -->
<div class="shrink-0 flex items-center p-1 bg-muted rounded-xl w-full max-w-sm mx-auto text-xs border border-border shadow-2xs select-none">
  <!-- Pill Button -->
  <button :class="subStep === 1 ? 'bg-card text-foreground shadow-2xs font-semibold' : 'text-muted-foreground hover:text-foreground font-medium'">
    <!-- Pill Counter -->
    <span :class="subStep === 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'">1</span>
    <span>Method</span>
  </button>
</div>
```

### Pattern 4: Plan Selection Card Header Gradients & Features String Templates
In `StepPlanSelection.vue` (lines 194, 216, 241, 266), the plan objects define gradients and HTML feature strings:
```typescript
// BEFORE:
headerBg: 'bg-gradient-to-b from-[#23B750] to-[#108F37]',
features: ['<strong class="font-semibold text-gray-900">2</strong> Team Members', ...],

headerBg: 'bg-gradient-to-b from-[#4DC7C7] to-[#059898]',
headerBg: 'bg-gradient-to-b from-[#3A9EF2] to-[#225B8C]',
headerBg: 'bg-gradient-to-b from-[#115E2E] to-[#003916]',

// AFTER:
headerBg: 'bg-gradient-to-b from-primary to-primary/80',
features: ['<strong class="font-semibold text-foreground">2</strong> Team Members', ...],

headerBg: 'bg-gradient-to-b from-tag-6 to-tag-6-foreground', // or from-info to-info/80
headerBg: 'bg-gradient-to-b from-tag-1 to-tag-1-foreground', // or from-info to-info/80
headerBg: 'bg-gradient-to-b from-tag-2 to-tag-2-foreground', // or from-primary/80 to-primary/60
```
*Note*: `audit-tokens.cjs` parses all script literals, so replacing `text-gray-900` with `text-foreground` in the `features` array eliminates 20 violations!

### Pattern 5: Steppers (OnboardingSideNav & TopSteppers)
In `OnboardingSideNav.vue`:
- Container: `bg-card border-border`
- Completed step node: `bg-primary text-primary-foreground`
- Active step node: `border-2 border-primary text-primary bg-card ring-4 ring-primary/20`
- Pending step node: `border border-border text-muted-foreground bg-card group-hover:border-foreground/40`
- Pips (requirement indicator dots):
  - Completed: `bg-primary`
  - Current: `bg-primary ring-2 ring-primary/30`
  - Inactive: `bg-muted hover:bg-muted-foreground/30`

In `OnboardingTopStepper.vue` & `SetupWizardTopStepper.vue`:
- Step counter: `text-primary`
- Subtitle: `text-muted-foreground`
- Divider dot: `text-muted-foreground/40`
- Exit link: `text-muted-foreground hover:text-foreground`
- Segmented bar:
  - Completed / Active: `bg-primary`
  - Inactive: `bg-muted`

---

## 4. File-by-File Concrete Token Replacement Plans

### Group A: 7 v1 Step Components (`src/components/onboarding/`)

#### 1. `StepBusiness.vue` (70 violations)
- **Header (lines 5–6)**: `text-gray-900` → `text-foreground`; `text-gray-500` → `text-muted-foreground`.
- **Form Labels & Asterisks (lines 13–14, 26, 70–71, 93, 113, 134)**: `text-gray-700` → `text-foreground`; `text-red-500` → `text-destructive`.
- **Input Fields & Selects (lines 20, 76, 97)**:
  `bg-gray-50/50 hover:bg-white focus:bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-xs font-normal text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-3 focus:ring-[#23B750]/15 focus:border-[#23B750]`
  →
  `bg-muted/40 hover:bg-card focus:bg-card border border-input hover:border-border rounded-xl text-xs font-normal text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary`
- **Company Type Card Selection (lines 35–37, 45–46, 53, 59–60)**:
  - Active: `border-[#23B750] bg-emerald-50/50 ring-1 ring-[#23B750]` → `border-primary bg-primary/10 ring-1 ring-primary`
  - Inactive: `border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/60` → `border-border bg-card hover:border-border hover:bg-muted/50`
  - Icon active: `bg-[#23B750] text-white` → `bg-primary text-primary-foreground`
  - Icon inactive: `bg-gray-100 text-gray-600 group-hover:bg-gray-200/70` → `bg-muted text-muted-foreground group-hover:bg-muted/80`
  - Check badge: `bg-[#23B750] text-white` → `bg-primary text-primary-foreground`
  - Text: `text-gray-900` → `text-foreground`; `text-gray-500` → `text-muted-foreground`
- **Team Size Buttons (lines 122–125)**:
  - Active: `border-[#23B750] bg-emerald-50 text-[#008236] font-semibold ring-1 ring-[#23B750]` → `border-primary bg-primary/10 text-primary font-semibold ring-1 ring-primary`
  - Inactive: `border-gray-200 bg-gray-50/40 hover:bg-white hover:border-gray-300 text-gray-700` → `border-border bg-muted/40 hover:bg-card hover:border-border text-foreground`
- **Industry Pills (lines 143–146)**:
  - Active: `bg-[#23B750] text-white border-[#23B750]` → `bg-primary text-primary-foreground border-primary`
  - Inactive: `bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50/80` → `bg-card text-foreground border-border hover:border-border hover:bg-muted/50`
- **Dropdown Chevrons (lines 87, 106)**: `text-gray-400` → `text-muted-foreground`.

#### 2. `StepPlan.vue` (54 violations)
- **Header & Subtitle (lines 7–8)**: `text-gray-900` → `text-foreground`; `text-gray-500` → `text-muted-foreground`.
- **Billing Cycle Toggle Bar (lines 12–39)**:
  - Container: `bg-gray-100 border border-gray-200/60` → `bg-muted border border-border`
  - Inactive pill: `text-gray-500 hover:text-gray-900` → `text-muted-foreground hover:text-foreground`
  - Monthly active: `bg-white text-gray-900 shadow-xs font-semibold` → `bg-card text-foreground shadow-xs font-semibold`
  - Yearly active: `bg-[#23B750] text-white shadow-xs font-semibold` → `bg-primary text-primary-foreground shadow-xs font-semibold`
  - Discount tag: `bg-emerald-100 text-emerald-800` → `bg-success/20 text-success` (and active: `bg-primary-foreground/25 text-primary-foreground`)
- **Plan Cards (lines 51–55, 59, 67, 72–74, 79, 84–94, 99–108, 119–120)**:
  - Selected card: `border-[#23B750] bg-white ring-1 ring-[#23B750]` → `border-primary bg-card ring-1 ring-primary`
  - Unselected card: `border-gray-200/90 bg-white hover:border-gray-300` → `border-border bg-card hover:border-border`
  - Trial badge: `bg-[#23B750] text-white` → `bg-primary text-primary-foreground`
  - Plan name: `text-gray-900` → `text-foreground`
  - Radio check circle: `bg-[#23B750] text-white` → `bg-primary text-primary-foreground`; inactive: `border border-gray-300 text-transparent` → `border border-border text-transparent`
  - Tagline: `text-gray-500` → `text-muted-foreground`
  - Price text: `text-gray-900` → `text-foreground`; `/mo`: `text-gray-400` → `text-muted-foreground`
  - Savings caption: `text-emerald-700` → `text-success`; monthly caption: `text-gray-400` → `text-muted-foreground`
  - Feature items: `text-gray-700` → `text-foreground`; `text-[#23B750]` → `text-primary`; `text-gray-600` → `text-muted-foreground`; `text-emerald-700` → `text-success`
  - Select button: active `bg-[#23B750] text-white` → `bg-primary text-primary-foreground`; inactive `bg-gray-100 text-gray-700 group-hover:bg-gray-200/80` → `bg-secondary text-secondary-foreground group-hover:bg-secondary/80`
- **Demo Data Switch (lines 130–147)**:
  - Box: `bg-gray-50/80 border border-gray-200/80` → `bg-muted/40 border border-border`
  - Icon & heading: `text-[#23B750]` → `text-primary`; `text-gray-900` → `text-foreground`
  - Subtext: `text-gray-500` → `text-muted-foreground`
  - Toggle switch (line 147):
    `w-9 h-5 bg-gray-200 peer peer-checked:after:border-white after:bg-white peer-checked:bg-[#23B750]`
    →
    `w-9 h-5 bg-input peer peer-checked:after:border-primary-foreground after:bg-card after:border-border after:border peer-checked:bg-primary`

#### 3. `StepReady.vue` (59 violations)
- **Milestone Celebration Header (lines 5–10)**:
  - Icon badge: `bg-emerald-100 text-[#23B750] ring-6 ring-emerald-50/80` → `bg-primary/10 text-primary ring-6 ring-primary/20`
  - Title & subtitle: `text-gray-900` → `text-foreground`; `text-gray-500` → `text-muted-foreground`
- **Summary Cards (lines 17–91)**:
  - Card containers: `bg-white border border-gray-200/90 hover:border-gray-300` → `bg-card border border-border hover:border-border`
  - Icon boxes: `bg-emerald-50 text-[#23B750]` → `bg-primary/10 text-primary`
  - Title: `text-gray-900` → `text-foreground`
  - Check badges: `bg-emerald-100 text-[#23B750]` → `bg-primary/20 text-primary`; `bg-gray-100 text-gray-600` → `bg-muted text-muted-foreground`
  - Subtexts: `text-gray-500` → `text-muted-foreground`
- **Tip Box (lines 95–99)**:
  - Container: `bg-emerald-50/60 border border-emerald-200/80` → `bg-success/10 border border-success/20`
  - Icon box: `bg-emerald-100 text-[#23B750]` → `bg-success/20 text-success`
  - Tip text: `text-emerald-950` → `text-foreground`
- **Launch Actions (lines 109, 118)**:
  - Primary button:
    `bg-[#23B750] hover:bg-[#1fa347] active:bg-[#1b8e3e] text-white shadow-[0_3px_10px_rgba(35,183,80,0.25)] hover:shadow-[0_4px_14px_rgba(35,183,80,0.35)]`
    →
    `bg-primary hover:bg-primary/90 active:bg-primary/80 text-primary-foreground shadow-sm hover:shadow-md`
  - Secondary button:
    `bg-gray-100/90 hover:bg-gray-200/80 text-gray-700 border border-gray-200/60`
    →
    `bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border`

#### 4. `StepSetupChecklist.vue` (57 violations)
- **Header & Subtitle (lines 5–8)**: `text-gray-900` → `text-foreground`; `text-gray-500` → `text-muted-foreground`.
- **Progress Meter (lines 16–21)**:
  - Meter label: `text-gray-500` → `text-muted-foreground`; `text-gray-900` → `text-foreground`
  - Track: `bg-gray-200/80` → `bg-muted`
  - Fill bar: `bg-[#23B750]` → `bg-primary`
- **Checklist Cards (Items 1, 2, 3 - lines 36–37, 44, 52, 55, 61, 74–75, 82, 90, 93, 99, 112–113, 120, 128, 131, 137)**:
  - Completed card: `border-[#23B750] bg-emerald-50/40 ring-1 ring-[#23B750]/20` → `border-primary bg-primary/10 ring-1 ring-primary/20`
  - Pending card: `border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/60` → `border-border bg-card hover:border-border hover:bg-muted/50`
  - Node icon completed: `bg-[#23B750] text-white` → `bg-primary text-primary-foreground`
  - Node icon pending: `bg-gray-100 text-gray-500 group-hover:bg-[#23B750]/10 group-hover:text-[#23B750]` → `bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary`
  - Title: `text-gray-900` → `text-foreground`; Description: `text-gray-500` → `text-muted-foreground`
  - Action link: `text-[#23B750]` → `text-primary`
  - Focus visible: `focus-visible:ring-[#23B750]` → `focus-visible:ring-ring`

#### 5. `StepTeam.vue` (58 violations)
- **Header (lines 5–6)**: `text-gray-900` → `text-foreground`; `text-gray-500` → `text-muted-foreground`.
- **Invite Input Container (lines 10–11, 19, 26, 32, 41)**:
  - Container box: `bg-white border border-gray-200/90` → `bg-card border border-border`
  - Label: `text-gray-700` → `text-foreground`
  - Email input & select:
    `bg-gray-50/50 hover:bg-white focus:bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-xs font-normal text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-3 focus:ring-[#23B750]/15 focus:border-[#23B750]`
    →
    `bg-muted/40 hover:bg-card focus:bg-card border border-input hover:border-border rounded-xl text-xs font-normal text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary`
  - Select text & chevron: `text-gray-800` → `text-foreground`; `text-gray-400` → `text-muted-foreground`
  - Invite button: `bg-[#23B750] hover:bg-[#1fa347] disabled:hover:bg-[#23B750] text-white` → `bg-primary hover:bg-primary/90 disabled:hover:bg-primary text-primary-foreground`
- **Member List (lines 49–51, 56, 58, 62–69, 76, 79–85, 89, 95)**:
  - Section divider & counter: `border-gray-100` → `border-border`; `text-gray-400` → `text-muted-foreground`
  - Owner row: `bg-gray-50/70` → `bg-muted/50`
  - Owner avatar: `bg-[#23B750] text-white` → `bg-primary text-primary-foreground`
  - Name: `text-gray-900` → `text-foreground`; Role caption: `text-gray-400` → `text-muted-foreground`
  - Owner badge: `bg-emerald-100 text-emerald-800` → `bg-success/20 text-success`
  - Invited teammate row: `bg-white border border-gray-200/90 hover:border-gray-300` → `bg-card border border-border hover:border-border`
  - Initials circle: `bg-emerald-50 text-emerald-800 border border-emerald-200/60` → `bg-primary/10 text-primary border border-primary/20`
  - Teammate email: `text-gray-900` → `text-foreground`; subtext: `text-gray-500` → `text-muted-foreground`
  - Role pill: `bg-gray-100 text-gray-700` → `bg-muted text-muted-foreground`
  - Trash button: `text-gray-400 hover:text-red-500` → `text-muted-foreground hover:text-destructive`
- **Share Link Box (lines 107–118)**:
  - Container: `bg-gray-50/70 border border-gray-200/80` → `bg-muted/40 border border-border`
  - Icon & text: `text-[#23B750]` → `text-primary`; `text-gray-600` → `text-foreground`; `text-gray-500` → `text-muted-foreground`
  - Copy button: `bg-white hover:bg-gray-50 text-gray-700 border border-gray-200/90` → `bg-card hover:bg-muted text-foreground border border-border`

#### 6. `StepWebsiteWidget.vue` (126 violations)
- **Header (lines 5–6)**: `text-gray-900` → `text-foreground`; `text-gray-500` → `text-muted-foreground`.
- **Sub-step Pills (lines 10–41)**:
  - Container: `bg-gray-100 border border-gray-200/60` → `bg-muted border border-border`
  - Active button: `bg-white text-gray-900 shadow-xs font-semibold` → `bg-card text-foreground shadow-xs font-semibold`
  - Inactive button: `text-gray-500 hover:text-gray-900 font-medium` → `text-muted-foreground hover:text-foreground font-medium`
  - Active pill badge: `bg-[#23B750] text-white` → `bg-primary text-primary-foreground`
  - Inactive pill badge: `bg-gray-200 text-gray-600` → `bg-muted-foreground/30 text-muted-foreground`
- **Sub-Step 1 Inputs (lines 51, 56, 61, 66, 72, 81, 92, 97, 102–113)**:
  - Labels: `text-gray-700` → `text-foreground`
  - Inputs: `bg-gray-50/50 hover:bg-white focus:bg-white border border-gray-200 hover:border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-[#23B750]/15 focus:border-[#23B750]` → `bg-muted/40 hover:bg-card focus:bg-card border border-input hover:border-border text-foreground placeholder:text-muted-foreground focus:ring-ring focus:border-primary`
  - Color palette selection (line 81): `border-gray-900 ring-2 ring-gray-900/20` → `border-foreground ring-2 ring-foreground/20`
  - Auto-greeting box: `bg-gray-50/70 border border-gray-200/80` → `bg-muted/40 border border-border`
  - Auto-greeting text: `text-gray-800` → `text-foreground`; `text-gray-500` → `text-muted-foreground`
  - Checkbox toggle switch (line 113):
    `w-8 h-4.5 bg-gray-200 peer peer-checked:after:border-white after:bg-white peer-checked:bg-[#23B750]`
    →
    `w-8 h-4.5 bg-input peer peer-checked:after:border-primary-foreground after:bg-card after:border-border after:border peer-checked:bg-primary`
- **Sub-Step 1 Mock Browser Canvas (lines 120–170)**:
  - Preview title: `text-gray-400` → `text-muted-foreground`; Live badge: `text-emerald-800` → `text-success`; pulse dot: `bg-[#23B750]` → `bg-success`
  - Browser container: `bg-white border border-gray-200/90` → `bg-card border border-border`
  - Browser top bar: `bg-gray-100/90 border-b border-gray-200/80 text-gray-500` → `bg-muted border-b border-border text-muted-foreground`
  - Window dots (lines 133–135): `bg-[#FF5F56]` → `bg-destructive`; `bg-[#FFBD2E]` → `bg-warning`; `bg-[#27C93F]` → `bg-success`
  - Address bar: `bg-white text-gray-600 border border-gray-200/70` → `bg-card text-muted-foreground border border-border`
  - Mock canvas: `bg-gradient-to-b from-gray-50/40 to-gray-100/20` → `bg-gradient-to-b from-muted/30 to-muted/10`
  - Canvas placeholder bars: `bg-gray-300` → `bg-muted-foreground/30`; `bg-gray-200` → `bg-muted`
  - Floating greeting bubble: `bg-white border border-gray-200/90 text-gray-900` → `bg-card border border-border text-foreground`; text: `text-gray-500` → `text-muted-foreground`
- **Sub-Step 2 Assign Agents (lines 182–210)**:
  - Banner: `bg-emerald-50/60 border border-emerald-200/80 text-emerald-800` → `bg-primary/10 border border-primary/20 text-primary`; `text-[#23B750]` → `text-primary`
  - Agent rows: `bg-white border border-gray-200/90 hover:border-gray-300` → `bg-card border border-border hover:border-border`
  - Initials circle: `bg-emerald-50 text-emerald-800 border border-emerald-200/60` → `bg-primary/10 text-primary border border-primary/20`
  - Agent name & role: `text-gray-900` → `text-foreground`; `text-gray-500` → `text-muted-foreground`
  - Toggle switch (line 210): `bg-gray-200 peer-checked:after:border-white after:bg-white peer-checked:bg-[#23B750]` → `bg-input peer-checked:after:border-primary-foreground after:bg-card after:border-border after:border peer-checked:bg-primary`
- **Sub-Step 3 Install Code (lines 218–250)**:
  - Card container: `bg-white border border-gray-200/90` → `bg-card border border-border`
  - Title & subtitle: `text-gray-900` → `text-foreground`; `text-gray-500` → `text-muted-foreground`
  - Copy code button: `bg-[#23B750] hover:bg-[#1fa347] text-white` → `bg-primary hover:bg-primary/90 text-primary-foreground`
  - Code snippet box: `bg-gray-50 border border-gray-200 text-gray-700` → `bg-muted/50 border border-border text-foreground`
  - Webmaster banner: `bg-gray-50/80 border border-gray-200/80 text-gray-600` → `bg-muted/40 border border-border text-muted-foreground`; icon: `text-gray-500` → `text-muted-foreground`
  - Email dev button: `bg-white border border-gray-200/90 hover:bg-gray-50 text-gray-700` → `bg-card border border-border hover:bg-muted text-foreground`

#### 7. `StepWhatsApp.vue` (120 violations)
- **Header (lines 5–6)**: `text-gray-900` → `text-foreground`; `text-gray-500` → `text-muted-foreground`.
- **Sub-step Pills (lines 10–41)**:
  - Container: `bg-gray-100 border border-gray-200/60` → `bg-muted border border-border`
  - Active button: `bg-white text-gray-900 shadow-xs font-semibold` → `bg-card text-foreground shadow-xs font-semibold`
  - Inactive button: `text-gray-500 hover:text-gray-900 font-medium` → `text-muted-foreground hover:text-foreground font-medium`
  - Active counter: `bg-[#23B750] text-white` → `bg-primary text-primary-foreground`; inactive: `bg-gray-200 text-gray-600` → `bg-muted-foreground/30 text-muted-foreground`
- **Sub-Step 1 Method Selection (lines 55–107)**:
  - QR card selected: `border-[#23B750] bg-emerald-50/50 ring-1 ring-[#23B750]` → `border-primary bg-primary/10 ring-1 ring-primary`
  - QR card unselected: `border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/60` → `border-border bg-card hover:border-border hover:bg-muted/50`
  - Cloud API card selected / unselected: same token pattern
  - Fastest badge: `bg-emerald-100 text-emerald-800` → `bg-success/20 text-success`
  - Official API badge: `bg-blue-100 text-blue-800` → `bg-info/20 text-info`
  - Title & subtitle: `text-gray-900` → `text-foreground`; `text-gray-500` → `text-muted-foreground`
  - Card footer divider & text: `border-gray-100` → `border-border`; `text-emerald-800` → `text-primary`; `text-blue-700` → `text-info`
- **Sub-Step 2 Connection States (lines 119–231)**:
  - Channel name input: `border-gray-200 text-gray-900 bg-white focus:ring-[#23B750]/15 focus:border-[#23B750]` → `border-input text-foreground bg-card focus:ring-ring focus:border-primary`
  - Label & asterisk: `text-gray-700` → `text-foreground`; `text-red-500` → `text-destructive`
  - Generating state box: `bg-white border border-gray-200/90` → `bg-card border border-border`; icon: `bg-emerald-50 text-[#23B750]` → `bg-primary/10 text-primary`
  - Progress track & bar: `bg-gray-100` → `bg-muted`; `bg-[#23B750]` → `bg-primary`
  - QR scan frame: `bg-gray-50/80 border border-gray-200` → `bg-muted/50 border border-border`; `text-gray-700` → `text-foreground`
  - QR image container: `bg-white border border-gray-200` → `bg-card border border-border`
  - Simulate scan button: `bg-[#23B750] hover:bg-[#1fa347] text-white` → `bg-primary hover:bg-primary/90 text-primary-foreground`
  - How to scan instructions: `text-gray-800` → `text-foreground`; `text-gray-600` → `text-muted-foreground`; step badges: `bg-emerald-50 text-emerald-800 border-emerald-200` → `bg-primary/10 text-primary border-primary/20`
  - Success linked box: `bg-white border border-emerald-200` → `bg-card border border-success/30`; icon: `bg-emerald-50 text-[#23B750] border-emerald-200/70` → `bg-success/10 text-success border-success/20`; title: `text-gray-900` → `text-foreground`; subtext: `text-gray-500` → `text-muted-foreground`
  - Disconnect button: `text-gray-400 hover:text-red-500` → `text-muted-foreground hover:text-destructive`
- **Sub-Step 3 Assign Team (lines 244–250)**:
  - Phone header: `bg-emerald-50/60 border border-emerald-200/70` → `bg-primary/10 border border-primary/20`; `bg-[#23B750] text-white` → `bg-primary text-primary-foreground`; `text-gray-900` → `text-foreground`; `text-gray-500` → `text-muted-foreground`
  - Teammate rows: `bg-white border border-gray-200/90 hover:border-gray-300` → `bg-card border border-border hover:border-border`
  - Avatar: `bg-emerald-50 text-emerald-800 border border-emerald-200/60` → `bg-primary/10 text-primary border border-primary/20`
  - Toggle switch (line 250): `bg-gray-200 peer-checked:after:border-white after:bg-white peer-checked:bg-[#23B750]` → `bg-input peer-checked:after:border-primary-foreground after:bg-card after:border-border after:border peer-checked:bg-primary`

---

### Group B: 10 v2 Step and Stepper Components (`src/components/onboarding/v2/`)

#### 8. `v2/OnboardingSideNav.vue` (41 violations)
- **Aside Layout (lines 2, 6, 9, 132)**:
  - Panel: `bg-white border-b lg:border-b-0 lg:border-r border-gray-100` → `bg-card border-b lg:border-b-0 lg:border-r border-border`
  - Header: `text-gray-400` → `text-muted-foreground`; `text-gray-900` → `text-foreground`
  - Bottom note: `border-gray-100 text-gray-400` → `border-border text-muted-foreground`
- **Step 1 & Step 2 Nodes (lines 27–31, 43–46, 98–102, 114–117)**:
  - Completed: `bg-[#008236] text-white` → `bg-primary text-primary-foreground`
  - Active: `border-2 border-[#008236] text-[#008236] bg-white ring-4 ring-emerald-50` → `border-2 border-primary text-primary bg-card ring-4 ring-primary/20`
  - Inactive: `border border-gray-300 text-gray-400 bg-white group-hover:border-gray-400` → `border border-border text-muted-foreground bg-card group-hover:border-foreground/30`
  - Step title active: `font-bold text-gray-900` → `font-bold text-foreground`
  - Step title completed: `font-medium text-gray-700` → `font-medium text-foreground`
  - Step title inactive: `text-gray-400 group-hover:text-gray-600` → `text-muted-foreground group-hover:text-foreground`
- **Requirement Pips (lines 66–69, 73)**:
  - Completed pip: `bg-[#008236]` → `bg-primary`
  - Active pip: `bg-[#23B750] ring-2 ring-emerald-100` → `bg-primary ring-2 ring-primary/30`
  - Inactive pip: `bg-gray-200 hover:bg-gray-300` → `bg-muted hover:bg-muted-foreground/30`
  - Requirement caption: `text-gray-400` → `text-muted-foreground`

#### 9. `v2/OnboardingTopStepper.vue` (7 violations)
- **Step Counter (line 6)**: `text-[#23B750]` → `text-primary`.
- **Subtitle & Dot (lines 10, 13)**: `text-gray-400` → `text-muted-foreground`; `text-gray-300` → `text-muted-foreground/40`.
- **Exit Link (line 16)**: `text-gray-400 hover:text-gray-700` → `text-muted-foreground hover:text-foreground`.
- **Segmented Progress Bar (line 39)**:
  - Active: `bg-[#23B750]` → `bg-primary`
  - Inactive: `bg-gray-200/80` → `bg-muted`

#### 10. `v2/SetupWizardTopStepper.vue` (7 violations)
- **Step Counter (line 6)**: `text-[#23B750]` → `text-primary`.
- **Subtitle & Dot (lines 10, 13)**: `text-gray-400` → `text-muted-foreground`; `text-gray-300` → `text-muted-foreground/40`.
- **Exit Link (line 16)**: `text-gray-400 hover:text-gray-700` → `text-muted-foreground hover:text-foreground`.
- **Segmented Progress Bar (line 39)**:
  - Active: `bg-[#23B750]` → `bg-primary`
  - Inactive: `bg-gray-200/80` → `bg-muted`

#### 11. `v2/StepCompanyNameType.vue` (24 violations)
- **Header (lines 5, 8)**: `text-gray-900` → `text-foreground`; `text-gray-500` → `text-muted-foreground`.
- **Input Field (lines 17, 25)**:
  - Label: `text-gray-700` → `text-foreground`
  - Input: `bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-[#23B750]/20 focus:border-[#23B750]` → `bg-card border border-input text-foreground placeholder:text-muted-foreground focus:ring-ring focus:border-primary`
- **Company Type Cards (lines 32, 43–46, 53–54, 63–64)**:
  - Label: `text-gray-700` → `text-foreground`
  - Card active: `border-[#23B750] bg-emerald-50/50 ring-2 ring-[#23B750]/15` → `border-primary bg-primary/10 ring-2 ring-primary/15`
  - Card inactive: `border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/60` → `border-border bg-card hover:border-border hover:bg-muted/50`
  - Focus visible: `focus-visible:ring-[#23B750]` → `focus-visible:ring-ring`
  - Icon active: `bg-[#23B750]/10 text-[#23B750]` → `bg-primary/15 text-primary`
  - Icon inactive: `bg-gray-100 text-gray-500` → `bg-muted text-muted-foreground`
  - Title: `text-gray-900` → `text-foreground`; Subtitle: `text-gray-500` → `text-muted-foreground`

#### 12. `v2/StepCountryCurrency.vue` (21 violations)
- **Header & Reassurance (lines 5, 8, 59–61)**:
  - Title: `text-gray-900` → `text-foreground`; Subtitle & reassurance: `text-gray-500` → `text-muted-foreground`; Globe icon: `text-gray-400` → `text-muted-foreground`
- **Select Dropdowns (lines 17, 25, 32, 38, 46, 53)**:
  - Labels: `text-gray-700` → `text-foreground`
  - Select fields: `bg-white border border-gray-200 hover:border-gray-300 text-gray-900 focus:ring-[#23B750]/30 focus:border-[#23B750]` → `bg-card border border-input hover:border-border text-foreground focus:ring-ring focus:border-primary`
  - Chevron icons: `text-gray-400` → `text-muted-foreground`

#### 13. `v2/StepPlanSelection.vue` (67 violations)
- **Header & Subtitle (lines 5, 8)**: `text-gray-900` → `text-foreground`; `text-gray-500` → `text-muted-foreground`.
- **Billing Switcher (lines 20–38)**:
  - Container: `bg-gray-100 border border-gray-200/60` → `bg-muted border border-border`
  - Monthly active: `bg-white text-gray-900 shadow-2xs font-semibold` → `bg-card text-foreground shadow-2xs font-semibold`
  - Yearly active: `bg-white text-gray-900 shadow-2xs font-semibold` → `bg-card text-foreground shadow-2xs font-semibold`
  - Inactive: `text-gray-500 hover:text-gray-900` → `text-muted-foreground hover:text-foreground`
  - Discount badge (line 38): `bg-red-600 text-white` → `bg-destructive text-destructive-foreground`
- **Plan Cards Template (lines 55–133)**:
  - Selected card: `border-[#23B750] bg-white ring-2 ring-[#23B750]/20` → `border-primary bg-card ring-2 ring-primary/20`
  - Unselected card: `border-gray-200 bg-white hover:border-gray-300` → `border-border bg-card hover:border-border`
  - Focus visible: `focus-visible:ring-[#23B750]` → `focus-visible:ring-ring`
  - Check circle active: `bg-[#23B750] text-white` → `bg-primary text-primary-foreground`; inactive: `border border-gray-300 text-transparent` → `border border-border text-transparent`
  - Audience subtext: `text-gray-500` → `text-muted-foreground`
  - Price: `text-gray-900` → `text-foreground`; period: `text-gray-500` → `text-muted-foreground`
  - Original price: `text-gray-400` → `text-muted-foreground`
  - Monthly billing subtext: `text-gray-400` → `text-muted-foreground`
  - Select button active: `bg-[#23B750] text-white` → `bg-primary text-primary-foreground`; inactive: `bg-gray-100 text-gray-800 hover:bg-gray-200` → `bg-secondary text-secondary-foreground hover:bg-secondary/80`
  - Divider: `border-gray-100` → `border-border`
  - Feature items: `text-gray-700` → `text-foreground`; check icon: `text-[#23B750]` → `text-primary`
  - AI Badges (lines 125–127): `bg-sky-50/90 border border-sky-200/60 text-sky-700` → `bg-info/10 border border-info/20 text-info`; icon: `text-sky-600` → `text-info`
  - Standard automations subtext: `text-gray-400` → `text-muted-foreground`
- **Script Plan Objects (lines 194, 204–207, 216, 226–229, 241, 251–254, 266, 276–278)**:
  - `headerBg` gradients:
    - Basic: `'bg-gradient-to-b from-[#23B750] to-[#108F37]'` → `'bg-gradient-to-b from-primary to-primary/80'`
    - Growth: `'bg-gradient-to-b from-[#4DC7C7] to-[#059898]'` → `'bg-gradient-to-b from-tag-6 to-tag-6-foreground'`
    - Pro: `'bg-gradient-to-b from-[#3A9EF2] to-[#225B8C]'` → `'bg-gradient-to-b from-tag-1 to-tag-1-foreground'`
    - Enterprise: `'bg-gradient-to-b from-[#115E2E] to-[#003916]'` → `'bg-gradient-to-b from-tag-2 to-tag-2-foreground'`
  - All `text-gray-900` in the `features` arrays → `text-foreground`

#### 14. `v2/StepTeamIndustry.vue` (33 violations)
- **Header (lines 5, 8)**: `text-gray-900` → `text-foreground`; `text-gray-500` → `text-muted-foreground`.
- **Team Size Grid (lines 17, 27–31)**:
  - Label: `text-gray-700` → `text-foreground`
  - Active button: `border-[#23B750] bg-emerald-50/50 text-emerald-900 ring-2 ring-[#23B750]/15` → `border-primary bg-primary/10 text-primary ring-2 ring-primary/15`
  - Inactive button: `border-gray-200 bg-white hover:border-gray-300 text-gray-700 hover:bg-gray-50/60` → `border-border bg-card hover:border-border text-foreground hover:bg-muted/50`
  - Focus visible: `focus-visible:ring-[#23B750]` → `focus-visible:ring-ring`
- **Industry Pills (lines 41, 44, 53–57)**:
  - Label: `text-gray-700` → `text-foreground`; Subtitle: `text-gray-400` → `text-muted-foreground`
  - Selected pill: `bg-[#23B750] text-white border-[#23B750]` → `bg-primary text-primary-foreground border-primary`
  - Unselected pill: `bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50` → `bg-card text-foreground border-border hover:border-border hover:bg-muted/50`
- **Other Industry Input (lines 66, 75)**:
  - Label: `text-gray-700` → `text-foreground`
  - Input: `bg-white border border-gray-200 hover:border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-[#23B750]/30 focus:border-[#23B750] caret-[#23B750]` → `bg-card border border-input hover:border-border text-foreground placeholder:text-muted-foreground focus:ring-ring focus:border-primary caret-primary`

#### 15. `v2/StepWizardLiveChat.vue` (149 violations)
- **Header (lines 5, 8)**: `text-gray-900` → `text-foreground`; `text-gray-500` → `text-muted-foreground`.
- **Sub-step Pills (lines 14–48)**:
  - Container: `bg-gray-100 border border-gray-200/60` → `bg-muted border border-border`
  - Active button: `bg-white text-gray-900 shadow-2xs font-semibold` → `bg-card text-foreground shadow-2xs font-semibold`
  - Inactive button: `text-gray-500 hover:text-gray-900 font-medium` → `text-muted-foreground hover:text-foreground font-medium`
  - Active number circle: `bg-[#23B750] text-white` → `bg-primary text-primary-foreground`; inactive: `bg-gray-200 text-gray-600` → `bg-muted-foreground/30 text-muted-foreground`
- **Inputs & Color Palette (lines 56–122)**:
  - Labels: `text-gray-700` → `text-foreground`
  - Inputs: `bg-white border border-gray-200 hover:border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-[#23B750]/20 focus:border-[#23B750]` → `bg-card border border-input hover:border-border text-foreground placeholder:text-muted-foreground focus:ring-ring focus:border-primary`
  - Preset color swatches (line 92):
    `data.widgetColor.toLowerCase() === color.hex.toLowerCase() ? 'border-gray-900 ring-2 ring-gray-900/20 scale-110' : 'border-black/10 hover:scale-105'`
    →
    `data.widgetColor.toLowerCase() === color.hex.toLowerCase() ? 'border-foreground ring-2 ring-foreground/20 scale-110' : 'border-border hover:scale-105'`
  - Custom hex input box (line 107): `border-gray-900 ring-2 ring-gray-900/20` → `border-foreground ring-2 ring-foreground/20`; border: `border-gray-200` → `border-border`
  - Auto-greeting toggle container: `bg-gray-50 border border-gray-200/80` → `bg-muted/40 border border-border`
  - Toggle switch (line 160): `bg-gray-200 peer-checked:after:border-white after:bg-white peer-checked:bg-[#23B750]` → `bg-input peer-checked:after:border-primary-foreground after:bg-card after:border-border after:border peer-checked:bg-primary`
- **Interactive Mock Browser (lines 172–227)**:
  - Browser container: `bg-white border border-gray-200` → `bg-card border border-border`
  - Top bar: `bg-gray-100 border-b border-gray-200 text-gray-500` → `bg-muted border-b border-border text-muted-foreground`
  - Window dots (lines 176–178): `bg-[#FF5F56]` → `bg-destructive`; `bg-[#FFBD2E]` → `bg-warning`; `bg-[#27C93F]` → `bg-success`
  - URL bar: `bg-white text-gray-600 border border-gray-200` → `bg-card text-muted-foreground border border-border`
  - Canvas: `bg-gradient-to-b from-gray-50/40 to-gray-100/20` → `bg-gradient-to-b from-muted/30 to-muted/10`
  - Canvas placeholder bars: `bg-gray-300` → `bg-muted-foreground/30`; `bg-gray-200` → `bg-muted`
  - Floating greeting bubble: `bg-white border border-gray-200 text-gray-900` → `bg-card border border-border text-foreground`; subtext: `text-gray-500` → `text-muted-foreground`
  - Continue button: `bg-[#23B750] hover:bg-[#1a943e] text-white` → `bg-primary hover:bg-primary/90 text-primary-foreground`
- **Sub-Step 2 Assign Agents (lines 237–283)**:
  - Banner: `bg-emerald-50/60 border border-emerald-200/70` → `bg-primary/10 border border-primary/20`; `text-[#23B750]` → `text-primary`; `text-emerald-900` → `text-primary`
  - Agent list container: `bg-gray-50 border border-gray-200/80` → `bg-muted/40 border border-border`; `text-gray-800` → `text-foreground`; `text-gray-500` → `text-muted-foreground`
  - Agent rows: `bg-white border border-gray-200/90 hover:border-gray-300` → `bg-card border border-border hover:border-border`
  - Initials circle: `bg-emerald-50 text-emerald-800 border border-emerald-200/60` → `bg-primary/10 text-primary border border-primary/20`
  - Toggle switch (line 272): `bg-gray-200 peer-checked:after:border-white after:bg-white peer-checked:bg-[#23B750]` → `bg-input peer-checked:after:border-primary-foreground after:bg-card after:border-border after:border peer-checked:bg-primary`
  - Continue button: `bg-[#23B750] hover:bg-[#1a943e] text-white` → `bg-primary hover:bg-primary/90 text-primary-foreground`
- **Sub-Step 3 Install Code (lines 292–325)**:
  - Card container: `bg-white border border-gray-200/90` → `bg-card border border-border`
  - Title & subtitle: `text-gray-900` → `text-foreground`; `text-gray-500` → `text-muted-foreground`
  - Copy code button: `bg-[#23B750] hover:bg-[#1a943e] text-white` → `bg-primary hover:bg-primary/90 text-primary-foreground`
  - Code snippet box: `bg-gray-50 border border-gray-200 text-gray-800` → `bg-muted/50 border border-border text-foreground`
  - Webmaster banner: `bg-gray-50/80 border border-gray-200/80 text-gray-500` → `bg-muted/40 border border-border text-muted-foreground`
  - Email dev button: `bg-white border border-gray-200/90 hover:bg-gray-50 text-gray-700` → `bg-card border border-border hover:bg-muted text-foreground`

#### 16. `v2/StepWizardTeam.vue` (58 violations)
- **Header (lines 5, 8)**: `text-gray-900` → `text-foreground`; `text-gray-500` → `text-muted-foreground`.
- **Multi-Email Invite Section (lines 15, 24, 31, 37, 52, 60, 66, 76, 85, 89)**:
  - Label: `text-gray-700` → `text-foreground`
  - Multi-email box: `bg-white border border-gray-200 focus-within:ring-[#23B750]/20 focus-within:border-[#23B750]` → `bg-card border border-input focus-within:ring-ring focus-within:border-primary`
  - Email chip: `bg-gray-100 border border-gray-200 text-gray-800` → `bg-muted border border-border text-foreground`
  - Chip remove icon: `text-gray-400 hover:text-gray-700 hover:bg-gray-200` → `text-muted-foreground hover:text-foreground hover:bg-muted-foreground/20`
  - Input: `text-gray-900 placeholder:text-gray-400` → `text-foreground placeholder:text-muted-foreground`
  - Role select: `bg-white border border-gray-200 text-gray-800 focus:ring-[#23B750]/20 focus:border-[#23B750]` → `bg-card border border-input text-foreground focus:ring-ring focus:border-primary`; chevron: `text-gray-400` → `text-muted-foreground`
  - Submit button: `bg-[#23B750] hover:bg-[#1a943e] disabled:hover:bg-[#23B750] text-white` → `bg-primary hover:bg-primary/90 disabled:hover:bg-primary text-primary-foreground`
  - Invite link option: `text-gray-400` → `text-muted-foreground`; link text: `text-[#23B750] hover:text-[#1a943e]` → `text-primary hover:text-primary/90`
- **Workspace Members Container (lines 99, 101–102, 108, 110, 114, 117, 120, 127, 130, 134–135, 144, 151, 157)**:
  - Container: `bg-gray-50 border border-gray-200/80` → `bg-muted/40 border border-border`; `text-gray-800` → `text-foreground`; `text-gray-500` → `text-muted-foreground`
  - Owner card: `bg-white border border-gray-200/90` → `bg-card border border-border`
  - Owner avatar: `bg-[#23B750] text-white` → `bg-primary text-primary-foreground`
  - Owner title: `text-gray-900` → `text-foreground`; `text-gray-400` → `text-muted-foreground`
  - Owner tag: `bg-gray-100 text-gray-700` → `bg-muted text-muted-foreground`
  - Teammate cards: `bg-white border border-gray-200/90 hover:border-gray-300` → `bg-card border border-border hover:border-border`
  - Initials circle: `bg-emerald-50 text-emerald-800 border border-emerald-200/70` → `bg-primary/10 text-primary border border-primary/20`
  - Email: `text-gray-900` → `text-foreground`; `text-gray-500` → `text-muted-foreground`
  - In-line role select: `bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-800 focus:ring-[#23B750]/20 focus:border-[#23B750]` → `bg-muted hover:bg-muted/80 border border-input text-foreground focus:ring-ring focus:border-primary`; chevron: `text-gray-500` → `text-muted-foreground`
  - Delete button: `text-gray-400 hover:text-rose-600 hover:bg-gray-100` → `text-muted-foreground hover:text-destructive hover:bg-destructive/10`

#### 17. `v2/StepWizardWhatsApp.vue` (153 violations)
- **Header (lines 5, 8)**: `text-gray-900` → `text-foreground`; `text-gray-500` → `text-muted-foreground`.
- **Sub-step Pills (lines 14–48)**:
  - Container: `bg-gray-100 border border-gray-200/60` → `bg-muted border border-border`
  - Active button: `bg-white text-gray-900 shadow-2xs font-semibold` → `bg-card text-foreground shadow-2xs font-semibold`
  - Inactive button: `text-gray-500 hover:text-gray-900 font-medium` → `text-muted-foreground hover:text-foreground font-medium`
  - Active circle: `bg-[#23B750] text-white` → `bg-primary text-primary-foreground`; inactive: `bg-gray-200 text-gray-600` → `bg-muted-foreground/30 text-muted-foreground`
- **Sub-Step 1 Method Selection (lines 60–140)**:
  - Cards active: `border-[#23B750] bg-emerald-50/50 ring-2 ring-[#23B750]/15` → `border-primary bg-primary/10 ring-2 ring-primary/15`
  - Cards inactive: `border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/60` → `border-border bg-card hover:border-border hover:bg-muted/50`
  - Focus visible: `focus-visible:ring-[#23B750]` → `focus-visible:ring-ring`
  - Icon active: `bg-[#23B750]/10 text-[#23B750]` → `bg-primary/15 text-primary`; inactive: `bg-gray-100 text-gray-600` → `bg-muted text-muted-foreground`
  - Fastest badge: `bg-emerald-100 text-emerald-800` → `bg-success/20 text-success`
  - Official API badge: `bg-blue-100 text-blue-800` → `bg-info/20 text-info`
  - Card titles & subtexts: `text-gray-900` → `text-foreground`; `text-gray-500` → `text-muted-foreground`
  - Card footers: `border-gray-100` → `border-border`; `text-[#23B750]` → `text-primary`; `text-gray-600 group-hover:text-gray-900` → `text-muted-foreground group-hover:text-foreground`
  - Continue button: `bg-[#23B750] hover:bg-[#1a943e] disabled:hover:bg-[#23B750] text-white` → `bg-primary hover:bg-primary/90 disabled:hover:bg-primary text-primary-foreground`
- **Sub-Step 2 Connection States (lines 150–280)**:
  - Channel name input: `bg-white border border-gray-200 text-gray-900 focus:ring-[#23B750]/20 focus:border-[#23B750]` → `bg-card border border-input text-foreground focus:ring-ring focus:border-primary`
  - Label & asterisk: `text-gray-700` → `text-foreground`; `text-red-500` → `text-destructive`
  - Generating state: `bg-white border border-gray-200/90` → `bg-card border border-border`; icon: `bg-emerald-50 text-[#23B750]` → `bg-primary/10 text-primary`; track & bar: `bg-gray-100` → `bg-muted`; `bg-[#23B750]` → `bg-primary`
  - QR frame: `bg-gray-50/80 border border-gray-200` → `bg-muted/50 border border-border`; `text-gray-700` → `text-foreground`
  - QR image box: `bg-white border border-gray-200` → `bg-card border border-border`
  - Simulate scan button: `bg-[#23B750] hover:bg-[#1a943e] text-white` → `bg-primary hover:bg-primary/90 text-primary-foreground`
  - How to scan: `text-gray-800` → `text-foreground`; `text-gray-600` → `text-muted-foreground`; step badges: `bg-emerald-50 text-emerald-800 border-emerald-200` → `bg-primary/10 text-primary border-primary/20`
  - Linking state: `bg-white border border-gray-200/90` → `bg-card border border-border`; icon: `bg-emerald-50 text-[#23B750]` → `bg-primary/10 text-primary`; bar: `bg-[#23B750]` → `bg-primary`; track: `bg-gray-100` → `bg-muted`
  - Connected state: `bg-white border border-emerald-200` → `bg-card border border-success/30`; icon: `bg-emerald-50 text-[#23B750] border-emerald-200/70` → `bg-success/10 text-success border-success/20`; title: `text-gray-900` → `text-foreground`; subtext: `text-gray-500` → `text-muted-foreground`; strong: `text-gray-900` → `text-foreground`
  - Disconnect button: `text-gray-400 hover:text-red-500` → `text-muted-foreground hover:text-destructive`
  - Assign Team Reps button: `bg-[#23B750] hover:bg-[#1a943e] text-white` → `bg-primary hover:bg-primary/90 text-primary-foreground`
- **Sub-Step 3 Assign Team (lines 291–333)**:
  - Phone banner: `bg-emerald-50/60 border border-emerald-200/70` → `bg-primary/10 border border-primary/20`; icon: `bg-[#23B750] text-white` → `bg-primary text-primary-foreground`; text: `text-gray-900` → `text-foreground`; `text-gray-500` → `text-muted-foreground`
  - List container: `bg-gray-50 border border-gray-200/80` → `bg-muted/40 border border-border`; `text-gray-800` → `text-foreground`; `text-gray-500` → `text-muted-foreground`
  - Teammate cards: `bg-white border border-gray-200/90 hover:border-gray-300` → `bg-card border border-border hover:border-border`
  - Initials circle: `bg-emerald-50 text-emerald-800 border border-emerald-200/60` → `bg-primary/10 text-primary border border-primary/20`
  - Name & role: `text-gray-900` → `text-foreground`; `text-gray-500` → `text-muted-foreground`
  - Toggle switch (line 331): `bg-gray-200 peer-checked:after:border-white after:bg-white peer-checked:bg-[#23B750]` → `bg-input peer-checked:after:border-primary-foreground after:bg-card after:border-border after:border peer-checked:bg-primary`

---

## 5. Verification Protocol & Quality Gates

To ensure zero regressions and 100% adherence to project guidelines:
1. **Target File Isolation**:
   Verify that each of the 17 files passes individual audit cleanly:
   ```bash
   node scripts/audit-tokens.cjs --file src/components/onboarding/StepBusiness.vue
   # ... repeat for all 17 components
   ```
2. **Batch 8 Gate**:
   Once worker finishes Batch 8 views and steps:
   ```bash
   node scripts/audit-tokens.cjs --batch 8
   ```
   Must yield:
   `✔ SUCCESS: 0 token violations detected across all 21 scanned files!`
3. **TypeScript & Build Gate**:
   ```bash
   npm run build
   ```
   Must succeed with exit code 0 and 0 compiler errors.
4. **Visual Contrast Verification**:
   Inspect in light and dark mode:
   - Form controls, input text, and placeholder contrast
   - Selected vs unselected card outlines and background tints
   - Mac browser window control dots (red, yellow, green)
   - Toggle switch thumb visibility in both checked and unchecked states
   - Stepper circles and requirement indicator pips
