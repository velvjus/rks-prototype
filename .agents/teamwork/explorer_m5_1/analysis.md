# Token Audit & Migration Analysis: Batch 8 Primary Views

**Date**: 2026-10-31  
**Agent**: `explorer_m5_1` (Teamwork Explorer)  
**Scope**: Batch 8 (Auth & Onboarding) Primary Views  
**Target Files**:
1. `src/views/AuthView.vue` (150 violations)
2. `src/views/OnboardingView.vue` (48 violations)
3. `src/views/SetupWizardView.vue` (57 violations)
*(Additional context: `scripts/audit-tokens.cjs` Batch 8 mapping across 21 files, 1,413 total violations)*

---

## 1. Executive Summary & Batch 8 Scope

### 1.1 Batch 8 Architectural Mapping in `scripts/audit-tokens.cjs`
In `scripts/audit-tokens.cjs`, Batch 8 is declared as:
```javascript
8: {
  name: 'Batch 8 (Auth & Onboarding)',
  directory: 'src/components/onboarding',
  files: [
    'src/views/AuthView.vue',
    'src/views/OnboardingView.vue',
    'src/views/OnboardingV1View.vue',
    'src/views/SetupWizardView.vue'
  ]
}
```
A complete scan of Batch 8 reveals **21 files** with **1,413 total token violations**:
- **Primary Views (Focus of this Investigation)**:
  - `src/views/AuthView.vue`: **150 violations** (90 palette grays, 30 arbitrary hex/rgb, 30 raw status)
  - `src/views/OnboardingView.vue`: **48 violations** (27 palette grays, 16 arbitrary hex/rgb, 5 raw status)
  - `src/views/SetupWizardView.vue`: **57 violations** (36 palette grays, 12 arbitrary hex/rgb, 9 raw status)
  - *Primary Views Subtotal*: **255 violations**
- **Companion View**:
  - `src/views/OnboardingV1View.vue`: **54 violations**
- **17 Onboarding Child Step & Stepper Components (`src/components/onboarding/`)**:
  - Root: `StepBusiness.vue` (70), `StepPlan.vue` (54), `StepReady.vue` (59), `StepSetupChecklist.vue` (57), `StepTeam.vue` (58), `StepWebsiteWidget.vue` (126), `StepWhatsApp.vue` (120)
  - v2: `OnboardingSideNav.vue` (41), `OnboardingTopStepper.vue` (7), `SetupWizardTopStepper.vue` (7), `StepCompanyNameType.vue` (24), `StepCountryCurrency.vue` (21), `StepPlanSelection.vue` (67), `StepTeamIndustry.vue` (33), `StepWizardLiveChat.vue` (149), `StepWizardTeam.vue` (58), `StepWizardWhatsApp.vue` (153)

### 1.2 Key Insights on the 3 Primary Views
1. **Zero `dark:` Class Overrides**: None of the 3 primary views use `dark:` overrides. All styling was written assuming a pure light mode.
2. **Zero Raw Inline `style=""` Attributes**: None of the 3 views have hardcoded hex colors inside template `style` attributes.
3. **Canvas Confetti Invocations**: Both `OnboardingView.vue` (line 312, 321, 328) and `SetupWizardView.vue` (line 420, 430, 437) invoke `canvas-confetti` with hardcoded hex arrays (`['#23B750', '#62D816', '#10B981', '#34D399', '#3B82F6', '#F59E0B']`). Because `canvas-confetti` parses colors using an internal `hexToRgb` regex parser, a dynamic token resolver is required to supply valid computed hex colors derived from CSS variables.
4. **AuthView Right Visual Showcase**: Lines 326–368 contain a high-tech dark preview panel (`from-gray-900 to-gray-950`). Following the precedent established in Milestone 1 and Batch 1 (App Shell), this surface should use the dedicated rail tokens (`bg-rail`, `border-rail-border`, `text-rail-foreground`, `text-rail-muted-foreground`, `bg-rail-active`) so it remains a dark visual showcase across both light and dark themes while being 100% token-driven.
5. **Full Token Availability**: Every replacement token needed (`bg-background`, `bg-card`, `bg-muted`, `text-foreground`, `text-muted-foreground`, `border-border`, `border-input`, `ring-ring`, `bg-primary`, `text-primary-foreground`, `bg-success/10`, `text-success`, `bg-warning/10`, `text-warning`, `text-destructive`, `bg-rail`, etc.) is already fully defined in `src/assets/index.css` and mapped in `tailwind.config.js`.

---

## 2. Detailed Audit & Token Replacement Plan: `src/views/AuthView.vue`

`src/views/AuthView.vue` is the interactive portal preview demonstrating the 3 authentication steps: Sign Up, OTP Verification, and Login (with split showcase).

### 2.1 Violation Catalog (150 Violations)
- **Palette Grays & Neutrals (90)**: `bg-gray-50`, `bg-white`, `border-gray-200`, `text-gray-500`, `text-gray-900`, `bg-gray-100`, `text-gray-700`, `text-gray-400`, `text-gray-600`, `border-gray-100`, `text-white`, `border-gray-300`, `from-gray-900`, `to-gray-950`, `bg-gray-800`, `border-gray-700`, `text-gray-200`, `bg-gray-900`, `text-gray-100`.
- **Arbitrary Hex/RGB Classes (30)**: `bg-[#23B750]`, `text-[#23B750]`, `ring-[#23B750]`, `border-[#23B750]`, `bg-[#1a943e]`, `from-[#23B750]`, `to-[#62D816]`.
- **Raw Status Colors (30)**: `text-emerald-900`, `bg-emerald-50`, `text-emerald-700`, `border-emerald-200`, `text-emerald-800`, `bg-emerald-100`, `bg-emerald-500`, `text-emerald-400`, `text-emerald-300`, `border-emerald-500`, `text-emerald-200`.

### 2.2 Concrete Replacement Table

| Section & Line(s) | Current Code (Violations) | Replacement Code (Semantic Tokens) | Rationale |
|---|---|---|---|
| **Root Canvas** (L2) | `bg-gray-50 flex flex-col font-sans selection:bg-[#23B750]/20 selection:text-emerald-900 custom-scrollbar` | `bg-background flex flex-col font-sans selection:bg-primary/20 selection:text-primary custom-scrollbar` | Standard page canvas and theme-aware text selection |
| **Header Banner** (L4) | `bg-white border-b border-gray-200 px-6 py-5 shrink-0` | `bg-card border-b border-border px-6 py-5 shrink-0` | In-app header card background and border |
| **Breadcrumb** (L7, L12) | `text-gray-500 mb-1`, `text-[#23B750] font-bold` | `text-muted-foreground mb-1`, `text-primary font-bold` | Muted hierarchy with brand active crumb |
| **Title & Badge** (L15, L18) | `text-gray-900 tracking-tight`, `bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200` | `text-foreground tracking-tight`, `bg-success/10 text-success text-xs font-bold border border-success/20` | Semantic success status pill badge |
| **Mode Switcher** (L26) | `bg-gray-100 rounded-xl text-xs font-semibold` | `bg-muted rounded-xl text-xs font-semibold` | Tab switcher container track |
| **Mode Tabs** (L32, L42, L52) | `mode === '...' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'` | `mode === '...' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'` | Active tab card elevation vs muted hoverable tabs |
| **Open Wizard CTA** (L61) | `text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200` | `text-success hover:text-success/90 bg-success/10 hover:bg-success/20 px-3 py-1.5 rounded-lg border border-success/20` | Semantic success soft button |
| **Sign Up Card** (L75) | `bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm` | `bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm text-card-foreground` | Standard elevated auth card |
| **Sign Up Icon** (L78) | `bg-emerald-50 text-[#23B750]` | `bg-primary/10 text-primary` | Brand icon container |
| **Sign Up Headings** (L81, L82) | `text-gray-900`, `text-gray-500` | `text-foreground`, `text-muted-foreground` | High-contrast typography |
| **Form Labels** (L89, L99, L112, L124, L166) | `text-gray-700 mb-1` | `text-foreground mb-1` | Standard accessible form labels |
| **Inputs (Sign Up)** (L95, L105, L118, L131, L172) | `bg-white border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#23B750]/20 focus:border-[#23B750]` | `bg-background border border-input rounded-xl text-xs font-medium text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary` | Standard form inputs with input border and primary focus ring |
| **Password Toggle** (L136) | `text-gray-400 hover:text-gray-600` | `text-muted-foreground hover:text-foreground` | Muted eye icon toggle |
| **Password Checklist Box** (L144) | `bg-gray-50 rounded-xl border border-gray-100` | `bg-muted/50 rounded-xl border border-border` | Subtle grouped checklist container |
| **Password Checklist Items** (L145, L149, L153, L157) | `:class="... ? 'text-emerald-700 font-bold' : 'text-gray-400'"` | `:class="... ? 'text-success font-bold' : 'text-muted-foreground'"` | Status success for fulfilled rules, muted for pending |
| **Primary Buttons** (L178, L229, L310) | `bg-[#23B750] hover:bg-[#1a943e] text-white font-bold text-xs rounded-xl shadow-xs` | `bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs rounded-xl shadow-xs` | Canonical primary brand action button |
| **Links / Terms** (L185, L187, L190) | `text-gray-500`, `text-emerald-700 hover:underline`, `text-emerald-700 font-bold hover:underline` | `text-muted-foreground`, `text-primary hover:underline`, `text-primary font-bold hover:underline` | Accessible interactive text links |
| **OTP Card & Icon** (L198, L200) | `bg-white border border-gray-200`, `bg-emerald-50 text-[#23B750]` | `bg-card border border-border text-card-foreground`, `bg-primary/10 text-primary` | Verification card container & brand badge |
| **OTP Headings & Email** (L205, L206, L207) | `text-gray-900`, `text-gray-500`, `text-gray-900 font-medium` | `text-foreground`, `text-muted-foreground`, `text-foreground font-medium` | Typography hierarchy |
| **OTP Input Boxes** (L222) | `bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#23B750] focus:bg-white` | `bg-muted/50 border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:bg-background` | Individual OTP digits with theme awareness |
| **OTP Footer** (L236, L242, L248) | `text-gray-500`, `text-emerald-700 font-bold hover:underline`, `text-gray-400 hover:text-gray-700` | `text-muted-foreground`, `text-primary font-bold hover:underline`, `text-muted-foreground hover:text-foreground` | Resend and back navigation |
| **Login Split Card** (L258) | `bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden` | `bg-card border border-border rounded-3xl shadow-sm overflow-hidden text-card-foreground` | Split login container |
| **Login Brand Logo** (L264, L267, L268) | `bg-gradient-to-br from-[#23B750] to-[#62D816] text-white`, `text-gray-900`, `text-[#23B750]` | `bg-gradient-to-br from-primary to-brand-secondary text-primary-foreground`, `text-foreground`, `text-primary` | Brand gradient mark and company title |
| **Login Inputs** (L285, L296) | `bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#23B750]/20 focus:border-[#23B750]` | `bg-background border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary` | Form inputs |
| **Remember Checkbox** (L301, L302, L305) | `text-gray-600`, `border-gray-300 text-[#23B750] focus:ring-[#23B750]`, `text-emerald-700` | `text-muted-foreground`, `border-input text-primary focus:ring-primary bg-background`, `text-primary` | Checkbox label, accent color, forgot password link |
| **Login Footer** (L317, L319) | `text-gray-500 border-t border-gray-100`, `text-emerald-700 font-bold hover:underline` | `text-muted-foreground border-t border-border`, `text-primary font-bold hover:underline` | Switch to sign up |
| **Right Showcase Canvas** (L326) | `bg-gradient-to-br from-gray-900 to-gray-950 p-8 text-white flex flex-col justify-between relative overflow-hidden text-left` | `bg-rail border-l border-rail-border p-8 text-rail-foreground flex flex-col justify-between relative overflow-hidden text-left` | Token-driven dark showcase panel using rail tokens |
| **Showcase Pill & Title** (L328, L331, L334) | `bg-emerald-500/20 text-emerald-400`, `text-white`, `text-gray-400` | `bg-primary/20 text-primary`, `text-rail-foreground`, `text-rail-muted-foreground` | Showcase header hierarchy |
| **Showcase Inner Card** (L340, L341, L342, L343) | `bg-gray-800/80 border border-gray-700/60`, `border-gray-700/50`, `text-gray-200`, `bg-emerald-500/20 text-emerald-300` | `bg-rail-active/60 border border-rail-border`, `border-rail-border`, `text-rail-foreground`, `bg-primary/20 text-primary` | Inner card representing Omnichannel preview |
| **Showcase Row 1** (L346, L348, L352, L353, L356) | `bg-gray-900/80`, `bg-emerald-500 text-white`, `text-gray-100`, `text-gray-400`, `text-emerald-400` | `bg-rail/80`, `bg-primary text-primary-foreground`, `text-rail-foreground`, `text-rail-muted-foreground`, `text-primary` | Mock conversation item |
| **Showcase AI Box** (L359) | `bg-emerald-500/10 border border-emerald-500/30 text-emerald-200` | `bg-primary/15 border border-primary/30 text-primary` | Mock AI assistant response bubble |
| **Showcase Copyright** (L365) | `text-gray-500` | `text-rail-muted-foreground` | Muted footer note in rail panel |

---

## 3. Detailed Audit & Token Replacement Plan: `src/views/OnboardingView.vue`

`src/views/OnboardingView.vue` is the primary continuous 5-step onboarding flow (Company, Country/Currency, Team/Industry, Plan Selection, Provisioning Spinner, Success/Completion).

### 3.1 Violation Catalog (48 Violations)
- **Palette Grays & Neutrals (27)**: `text-slate-800`, `border-gray-200`, `text-gray-500`, `text-gray-900`, `text-white`, `bg-gray-200`, `text-gray-400`, `bg-white`, `bg-gray-50`, `text-gray-700`.
- **Arbitrary Hex/RGB Classes (16)**: `bg-[#f9fafb]`, `bg-[#23B750]`, `ring-[#23B750]`, `bg-[#1a943e]`, `text-[#23B750]`.
- **Raw Status Colors (5)**: `text-emerald-900`, `bg-emerald-50`, `border-emerald-200`.

### 3.2 Concrete Replacement Table

| Section & Line(s) | Current Code (Violations) | Replacement Code (Semantic Tokens) | Rationale |
|---|---|---|---|
| **Root Canvas** (L2) | `bg-[#f9fafb] flex flex-col font-sans selection:bg-[#23B750]/20 selection:text-emerald-900 text-slate-800` | `bg-background flex flex-col font-sans selection:bg-primary/20 selection:text-primary text-foreground` | Semantic page canvas and root text color |
| **Footer (Steps 1–3)** (L51) | `border-t border-gray-200/70 flex items-center justify-between` | `border-t border-border flex items-center justify-between` | Locked stage footer border |
| **Back Button (Steps 1–3)** (L57) | `text-gray-500 hover:text-gray-900 transition-colors` | `text-muted-foreground hover:text-foreground transition-colors` | Muted back navigation |
| **Continue Button Base** (L70) | `'h-11 px-6 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-[#23B750]'` | `'h-11 px-6 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-ring'` | Button dimensions and accessible focus ring |
| **Continue Button States** (L71–74) | `isValid ? 'bg-[#23B750] hover:bg-[#1a943e] active:scale-[0.99] text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'` | `isValid ? 'bg-primary hover:bg-primary/90 active:scale-[0.99] text-primary-foreground' : 'bg-muted text-muted-foreground cursor-not-allowed'` | Semantic active primary button vs disabled muted button |
| **Footer (Step 4)** (L97, L101) | `border-gray-200/70`, `text-gray-500 hover:text-gray-900` | `border-border`, `text-muted-foreground hover:text-foreground` | Constrained footer container & back button |
| **Continue Button (Step 4)** (L112–116) | `text-white focus-visible:ring-[#23B750]`, `isValid ? 'bg-[#23B750] hover:bg-[#1a943e] text-white' : 'bg-gray-200 text-gray-400'` | `text-primary-foreground focus-visible:ring-ring`, `isValid ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : 'bg-muted text-muted-foreground'` | Step 4 complete action button |
| **Provisioning Badge & Spinner** (L133, L134) | `bg-emerald-50 border border-emerald-200/80 text-[#23B750]`, `text-[#23B750]` | `bg-primary/10 border border-primary/20 text-primary`, `text-primary` | Provisioning animated loader badge |
| **Provisioning Headings** (L138, L141, L143) | `text-gray-900`, `text-gray-500`, `text-gray-900 font-semibold` | `text-foreground`, `text-muted-foreground`, `text-foreground font-semibold` | Loading stage message hierarchy |
| **Provisioning Progress Track** (L148, L149) | `bg-gray-200/80 rounded-full`, `bg-[#23B750] rounded-full` | `bg-muted rounded-full`, `bg-primary rounded-full` | Provisioning progress bar |
| **Success Icon Badge** (L161) | `bg-emerald-50 border border-emerald-200/80 text-[#23B750]` | `bg-primary/10 border border-primary/20 text-primary` | Completion checkmark badge |
| **Success Headings** (L166, L169, L171, L173) | `text-gray-900`, `text-gray-500`, `text-gray-900 font-semibold`, `text-[#23B750] font-semibold` | `text-foreground`, `text-muted-foreground`, `text-foreground font-semibold`, `text-primary font-semibold` | Completion summary message |
| **Launch Dashboard Secondary Button** (L182, L184) | `bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 border border-gray-200`, `text-gray-500` | `bg-card hover:bg-muted text-foreground border border-border`, `text-muted-foreground` | Secondary outline action button |
| **Complete Setting Up Primary Button** (L191) | `bg-[#23B750] hover:bg-[#1a943e] active:scale-[0.99] text-white focus-visible:ring-[#23B750]` | `bg-primary hover:bg-primary/90 active:scale-[0.99] text-primary-foreground focus-visible:ring-ring` | Primary wizard transition button |

### 3.3 Canvas Confetti Dynamic Token Adaptation
Lines 307–331 in `src/views/OnboardingView.vue`:
```typescript
// CURRENT (violates raw hex rules):
function fireConfetti() {
  confetti({
    particleCount: 90,
    spread: 75,
    origin: { y: 0.6 },
    colors: ['#23B750', '#62D816', '#10B981', '#34D399', '#3B82F6', '#F59E0B'],
  });
  ...
}
```
**Architecture Rationale & Replacement**:
`canvas-confetti` accepts an array of strings in HEX format (`hexToRgb` is called internally by the library). To satisfy `AGENTS.md` and `PROJECT.md` Feature 20 without breaking particle rendering:
```typescript
/**
 * Resolves CSS token custom properties from the DOM and converts them to hex colors
 * for canvas-confetti particle cannons.
 */
function getConfettiColors(): string[] {
  if (typeof window === 'undefined') {
    return ['#23B750', '#10B981', '#3B82F6', '#F59E0B'];
  }
  const root = document.documentElement;
  const temp = document.createElement('div');
  temp.style.display = 'none';
  document.body.appendChild(temp);

  const tokens = ['--primary', '--brand-secondary', '--success', '--info', '--warning'];
  const hexColors: string[] = [];

  for (const token of tokens) {
    temp.style.color = `var(${token})`;
    const computed = getComputedStyle(temp).color; // returns "rgb(r, g, b)"
    const match = computed.match(/\d+/g);
    if (match && match.length >= 3) {
      const [r, g, b] = match.map(Number);
      const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
      hexColors.push(hex);
    }
  }

  document.body.removeChild(temp);
  return hexColors.length > 0 ? hexColors : ['#23B750', '#10B981', '#3B82F6', '#F59E0B'];
}
```
In `fireConfetti()`:
```typescript
function fireConfetti() {
  const colors = getConfettiColors();
  confetti({
    particleCount: 90,
    spread: 75,
    origin: { y: 0.6 },
    colors,
  });

  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors,
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors,
    });
  }, 250);
}
```

---

## 4. Detailed Audit & Token Replacement Plan: `src/views/SetupWizardView.vue`

`src/views/SetupWizardView.vue` is the post-onboarding setup checklist wizard (Checklist overview, Team invitation, WhatsApp linkage, LiveChat widget configuration, Provisioning spinner, Success/Dashboard launch, and Skip Confirmation modal).

### 4.1 Violation Catalog (57 Violations)
- **Palette Grays & Neutrals (36)**: `text-slate-800`, `bg-white`, `bg-gray-50`, `text-gray-400`, `border-gray-200`, `text-gray-500`, `text-gray-900`, `text-gray-700`, `text-white`, `bg-gray-200`, `bg-gray-300`, `bg-black`, `border-gray-100`, `text-gray-600`, `bg-gray-100`, `bg-gray-900`.
- **Arbitrary Hex/RGB Classes (12)**: `bg-[#f9fafb]`, `bg-[#23B750]`, `ring-[#23B750]`, `bg-[#1a943e]`, `text-[#23B750]`.
- **Raw Status Colors (9)**: `text-emerald-900`, `text-rose-600`, `bg-emerald-50`, `border-emerald-200`, `bg-amber-50`, `border-amber-200`, `text-amber-600`.

### 4.2 Concrete Replacement Table

| Section & Line(s) | Current Code (Violations) | Replacement Code (Semantic Tokens) | Rationale |
|---|---|---|---|
| **Root Canvas** (L2) | `bg-[#f9fafb] flex flex-col font-sans selection:bg-[#23B750]/20 selection:text-emerald-900 text-slate-800` | `bg-background flex flex-col font-sans selection:bg-primary/20 selection:text-primary text-foreground` | Semantic page canvas and root text color |
| **Secret Reset Button** (L8) | `bg-white hover:bg-gray-50 text-gray-400 hover:text-rose-600 border border-gray-200/90 shadow-2xs` | `bg-card hover:bg-muted text-muted-foreground hover:text-destructive border border-border shadow-2xs` | Secret dev utility button with destructive hover |
| **Footer (Steps 1–4)** (L71) | `border-t border-gray-200/70 flex items-center justify-between` | `border-t border-border flex items-center justify-between` | Viewport locked footer bar |
| **Back Button (Steps 1–4)** (L77) | `text-gray-500 hover:text-gray-900 transition-colors` | `text-muted-foreground hover:text-foreground transition-colors` | Back navigation |
| **Skip Step Link** (L90) | `text-gray-400 hover:text-gray-700 px-2.5 py-1.5` | `text-muted-foreground hover:text-foreground px-2.5 py-1.5` | Muted secondary skip button |
| **Continue Button Base** (L99) | `'h-10 px-6 active:scale-[0.99] text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#23B750]'` | `'h-10 px-6 active:scale-[0.99] text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-ring'` | Standard focus ring |
| **Continue Button States** (L100–103) | `(currentStep === 1 \|\| isCurrentStepConfigured) ? 'bg-[#23B750] hover:bg-[#1a943e] text-white shadow-xs' : 'bg-gray-200 hover:bg-gray-300 text-gray-700 shadow-2xs'` | `(currentStep === 1 \|\| isCurrentStepConfigured) ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs' : 'bg-muted hover:bg-muted/80 text-muted-foreground shadow-2xs'` | Configured (primary) vs unconfigured/prompt-to-skip (muted) button states |
| **Provisioning Badge & Spinner** (L120, L121) | `bg-emerald-50 border border-emerald-200/80 text-[#23B750]`, `text-[#23B750]` | `bg-primary/10 border border-primary/20 text-primary`, `text-primary` | Animated loading badge |
| **Provisioning Headings** (L125, L128, L130) | `text-gray-900`, `text-gray-500`, `text-gray-900 font-semibold` | `text-foreground`, `text-muted-foreground`, `text-foreground font-semibold` | Loading stage message hierarchy |
| **Provisioning Progress Track** (L135, L136) | `bg-gray-200/80 rounded-full`, `bg-[#23B750] rounded-full` | `bg-muted rounded-full`, `bg-primary rounded-full` | Progress bar indicator |
| **Success Icon Badge** (L148) | `bg-emerald-50 border border-emerald-200/80 text-[#23B750]` | `bg-primary/10 border border-primary/20 text-primary` | Completion badge |
| **Success Headings** (L153, L156) | `text-gray-900`, `text-gray-500` | `text-foreground`, `text-muted-foreground` | Completion text |
| **Launch Dashboard Button** (L166) | `bg-[#23B750] hover:bg-[#1a943e] active:scale-[0.99] text-white focus-visible:ring-[#23B750]` | `bg-primary hover:bg-primary/90 active:scale-[0.99] text-primary-foreground focus-visible:ring-ring` | Primary completion button |
| **Omnichannel Direct Link** (L175) | `text-gray-500 hover:text-gray-900 transition-colors` | `text-muted-foreground hover:text-foreground transition-colors` | Secondary navigation link |
| **Skip Modal Backdrop** (L190) | `bg-black/40 backdrop-blur-xs` | `bg-background/80 backdrop-blur-xs` | Standard dialog overlay backdrop |
| **Skip Modal Card** (L194) | `bg-white rounded-2xl max-w-sm w-full p-5 border border-gray-200/90 shadow-xl` | `bg-card rounded-2xl max-w-sm w-full p-5 border border-border shadow-xl text-card-foreground` | Dialog card container |
| **Warning Icon Container** (L197) | `bg-amber-50 border border-amber-200/60 text-amber-600` | `bg-warning/10 border border-warning/20 text-warning` | Semantic warning badge |
| **Modal Title & Text** (L201, L204) | `text-gray-900`, `text-gray-500` | `text-foreground`, `text-muted-foreground` | Modal message |
| **Modal Footer Border** (L210) | `border-gray-100` | `border-border` | Modal action divider |
| **Cancel Button ("Keep Configuring")** (L214) | `text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200/80` | `text-foreground bg-muted hover:bg-muted/80` | Secondary modal button |
| **Confirm Button ("Skip Anyway")** (L221) | `text-white bg-gray-900 hover:bg-black rounded-xl transition-all shadow-xs` | `text-background bg-foreground hover:bg-foreground/90 rounded-xl transition-all shadow-xs` | High-contrast confirm button (adapts gracefully across themes) |

### 4.3 Canvas Confetti Dynamic Token Adaptation
Lines 414–440 in `src/views/SetupWizardView.vue`:
Apply identical `getConfettiColors()` helper resolving tokens (`--primary`, `--brand-secondary`, `--success`, `--info`, `--warning`) dynamically to maintain brand party aesthetics without hardcoded hex colors.

---

## 5. Token Verification & Consistency Cross-Check

### 5.1 Token Alignment with `src/assets/index.css`
| Semantic Token Category | Light Mode Value | Dark Mode Value | Status in Batch 8 Primary Views |
|---|---|---|---|
| `--background` | `oklch(1 0 0)` | `oklch(0.145 0 0)` | Replaces `bg-[#f9fafb]`, `bg-gray-50` |
| `--foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` | Replaces `text-gray-900`, `text-slate-800` |
| `--card` / `--card-foreground` | `oklch(1 0 0)` / `oklch(0.145 0 0)` | `oklch(0.205 0 0)` / `oklch(0.985 0 0)` | Replaces `bg-white`, modal cards |
| `--muted` / `--muted-foreground` | `oklch(0.97 0 0)` / `oklch(0.556 0 0)` | `oklch(0.269 0 0)` / `oklch(0.708 0 0)` | Replaces `bg-gray-100`, `text-gray-500`, `text-gray-400` |
| `--border` / `--input` / `--ring` | `oklch(0.922 0 0)` | `oklch(1 0 0 / 10%)` | Replaces `border-gray-200`, `border-gray-100`, `ring-[#23B750]` |
| `--primary` / `--primary-foreground` | `oklch(0.527 0.154 150.069)` | `oklch(0.65 0.18 149.2)` | Replaces `bg-[#23B750]`, `text-[#23B750]`, `text-white` |
| `--success` / `--success-foreground` | `oklch(0.627 0.194 149.214)` | `oklch(0.69 0.17 150)` | Replaces `bg-emerald-50`, `text-emerald-700` |
| `--warning` / `--warning-foreground` | `oklch(0.769 0.188 70.08)` | `oklch(0.78 0.16 70)` | Replaces `bg-amber-50`, `text-amber-600` |
| `--destructive` | `oklch(0.577 0.245 27.325)` | `oklch(0.704 0.191 22.216)` | Replaces `text-rose-600` |
| `--rail` / `--rail-foreground` / `--rail-muted-foreground` | `oklch(0.13 0.028 261.692)` | `oklch(0.12 0.02 260)` | Replaces `from-gray-900 to-gray-950` in AuthView showcase |

---

## 6. Verification Method & Success Criteria for Implementation

### 6.1 Individual File Verification
To verify the primary views after code application:
```bash
# 1. Audit AuthView
node scripts/audit-tokens.cjs --file src/views/AuthView.vue

# 2. Audit OnboardingView
node scripts/audit-tokens.cjs --file src/views/OnboardingView.vue

# 3. Audit SetupWizardView
node scripts/audit-tokens.cjs --file src/views/SetupWizardView.vue
```
Expected output: `✔ SUCCESS: 0 token violations detected across all 1 scanned files!` for each view.

### 6.2 Build Verification
```powershell
npm.cmd run build
```
Expected output: Build finishes successfully with zero TypeScript compilation errors.
