# Milestone 6 Investigation: Documentation Alignment & Full Codebase Audit

**Agent**: `explorer_m6_2`  
**Date**: 2026-11-01  
**Milestone**: Milestone 6 (Final Codebase Polish, Design System Documentation Alignment & Full Audit Pass)  
**Status**: Investigation Complete  

---

## Executive Summary

1. **`DESIGN.md` Critical Non-Compliance**: `DESIGN.md` currently contains **36 token violations** across 4 categories (12 palette grays, 8 `dark:` class overrides, 7 arbitrary hex classes, 9 raw status colors). It advertises obsolete color guidelines (`text-gray-900 dark:text-foreground`, `bg-gray-900`, `bg-[#23B750]`, raw stage hexes `#3b82f6`..`#10B981`) that directly contradict `AGENTS.md`. A clean, 100% token-compliant replacement has been drafted and validated (`proposed_DESIGN.md`) achieving **0 violations** on audit.
2. **`scripts/audit-tokens.cjs` Batch 9 Discrepancy**: Batch 9 currently includes only `src/views/DesignSystemView.vue` and `src/views/GuidelinesView.vue`, omitting `src/data/designSystemGuidelines.ts`. Adding `src/data/designSystemGuidelines.ts` to `BATCHES[9].files` ensures the in-app design system documentation string is explicitly audited under Batch 9.
3. **Full-Codebase Audit Status (444 files)**: The full codebase audit (`node scripts/audit-tokens.cjs`) currently passes across all **444 files** in `src/` with **0 violations**. All individual batches 1 through 9 pass with 0 violations.
4. **Remaining Non-Tokenized Targets (157 Hex References across 14 Files)**: While Tailwind utility classes are 100% tokenized, deep scanning identified 157 literal hex codes across 14 files. These cleanly group into:
   - **ApexCharts JS Configs** (69 occurrences in `DashboardView.vue` and `PartnerOverviewView.vue` — target of M6 Feature 19).
   - **Canvas Confetti Particle Colors** (9 occurrences in `CrmSetupStatusBar.vue`, `OnboardingView.vue`, `SetupWizardView.vue` — target of M6 Feature 20).
   - **Mock SVG Chart Attributes** (7 occurrences in `DesignSystemView.vue` — e.g. `stroke="#23B750"`).
   - **Documentation Swatches** (in `GuidelinesView.vue` and `DesignSystemView.vue`).
   - **User Customization Color Pickers** (in `FormBuilderView.vue`, `webforms.ts`, `StepWebsiteWidget.vue`, `StepWizardLiveChat.vue`).
   - **Third-Party Social Brand Logos** (`PlatformIcon.vue`).
5. **Build Verification**: `npm.cmd run build` (`vue-tsc -b && vite build`) executes cleanly in **4.32s with 0 errors**.

---

## 1. Documentation Alignment: `DESIGN.md` vs `AGENTS.md`

### 1.1 Direct Audit of Existing `DESIGN.md`
Running `node scripts/audit-tokens.cjs --file DESIGN.md` reveals **36 violations**:

```
VIOLATIONS BY CATEGORY:
  - Palette Grays & Neutrals: 12 (e.g. text-gray-900, text-gray-800, text-gray-600, bg-gray-900, bg-gray-50)
  - dark: Class Overrides: 8 (e.g. dark:text-foreground, dark:text-muted-foreground, dark:bg-card, dark:bg-background)
  - Tailwind Arbitrary Hex/RGB Classes: 7 (e.g. group-hover:text-[#23B750], bg-[#23B750], bg-[#FEF9C3]/80)
  - Raw Status / Accent Colors: 9 (e.g. text-amber-600, bg-green-50, bg-emerald-50, text-emerald-600)
TOTAL VIOLATIONS: 36
```

### 1.2 Section-by-Section Divergence Analysis

| Section in `DESIGN.md` | Current Legacy Content | `AGENTS.md` Mandate & Token Architecture | Required Fix |
|---|---|---|---|
| **Section 2: Segmented Hybrid Color Strategy** | Lists raw hex table (`#008236`, `#23B750`, `#62D816`, `#2E91E5`, `#F59E0B`, `#EF4444`, `#111827`, `#1F2937`, `#F9FAFB`/`#090D16`). Outdated rail variables (`--rks-gray-900`). | CSS variables in `index.css` are the Single Source of Truth (`:root` and `.dark`). No raw hex/rgb or raw status colors in UI code. | Restructure to document the token architecture: Base tokens, semantic status tokens (`--success`, `--warning`, `--info`, `--destructive`), brand tokens (`--brand`, `--brand-secondary`), invariant rail tokens (`--rail`, `--rail-foreground`, `--rail-active`), and categorical tag tokens (`--tag-1` through `--tag-6`). |
| **Section 3: Typography & Sizing Hierarchy** | Uses raw grays and `dark:` overrides: `text-gray-900 dark:text-foreground`, `text-gray-600 dark:text-muted-foreground`, `text-gray-500`. | **No raw palette grays** and **No `dark:` overrides**. Tokens adapt automatically in `index.css`. | Replace with `text-foreground` and `text-muted-foreground`. |
| **Section 4: App Shell & Layout Blueprint** | `Outer Rail (Dark bg-gray-900)`, `Inner Sidebar (Light w-60 bg-white dark:bg-card)`, `Top Header (bg-white dark:bg-card)`, `Canvas (bg-gray-50 dark:bg-background)`. | Outer rail uses invariant `--rail` tokens; inner panels and canvas use semantic `bg-card` and `bg-background`. | Change to `bg-rail text-rail-foreground`, `bg-card border-border`, `bg-card border-border`, `bg-background text-foreground`. |
| **Section 6: CRM View Specifications (Deals)** | Stage top bar stripes with raw hexes (`#3b82f6`, `#00D2C4`, `#FFCC00`, `#FF8800`, `#10B981`). Deal title `group-hover:text-[#23B750]`, hot lead pill `text-amber-600 bg-amber-500/10`. | Pipeline stages use categorical tag tokens (`--tag-1` through `--tag-5`). Semantic status tokens for badges. | Change stages to `border-t-tag-1` through `border-t-tag-5`. Deal title to `text-foreground group-hover:text-primary`. Hot lead pill to `text-warning bg-warning/10 border-warning/20`. |
| **Section 6: Omnichannel Specification** | Unread badge `#EF4444`, pulse dot `bg-[#23B750]`, agent outgoing bubble `bg-[#23B750] text-white`, audit log `bg-green-50 text-green-700`, private note `bg-[#FEF9C3]/80 border-[#FEF08A] text-[#854D0E]`. | Incoming/outgoing bubbles, status badges, and notes must use semantic tokens. | Unread badge `bg-destructive text-destructive-foreground`, pulse dot `bg-primary`, outgoing bubble `bg-primary text-primary-foreground`, audit log `bg-success/10 text-success`, private note `bg-warning/10 border-warning/20 text-warning`. |
| **Section 7: New Page Checklist** | Button `hover:bg-primary-dark`, badge `bg-emerald-50 text-emerald-600 border border-emerald-200`. Missing chart and audit rules. | Explicit prohibition on raw status colors and requirement for dynamic chart token querying. | Button `hover:bg-primary/90 text-primary-foreground`, badge `bg-success/10 text-success border border-success/20`. Add chart token resolution rule, zero raw colors rule, and dual-mode audit gate. |

### 1.3 Synchronization with `src/data/designSystemGuidelines.ts`
- `src/data/designSystemGuidelines.ts` exports `rakanSalesGuidelinesMarkdown` which is rendered in the app under `DesignSystemView.vue` (Guidelines tab) and copied to clipboard by users.
- In Milestone 5, `src/data/designSystemGuidelines.ts` was partially updated with semantic classes and currently passes `node scripts/audit-tokens.cjs --file src/data/designSystemGuidelines.ts` with 0 violations.
- However, `src/data/designSystemGuidelines.ts` is missing the categorical tag token section, rail border/muted tokens, chart theming rules, and strict quality checklist.
- **Both `DESIGN.md` and `src/data/designSystemGuidelines.ts` must be kept 100% identical and synchronized.**

---

## 2. Tooling & Batch Mapping: `scripts/audit-tokens.cjs`

### 2.1 Batch Coverage Verification
We tested every individual batch using `node scripts/audit-tokens.cjs --batch <N>`:

| Batch | Name | Files Scanned | Audit Result | Notes |
|---|---|---|---|---|
| **Batch 1** | App Shell | 9 files | **PASS (0 violations)** | MainLayout, AppShell, Sidebar, SidebarItem, SecondaryPanel, TopNav, InboxDropdown, ToastNotifications, App.vue |
| **Batch 2** | UI Components | 357 files | **PASS (0 violations)** | `src/components/ui/` primitive catalog |
| **Batch 3** | CRM Core | 8 files | **PASS (0 violations)** | DashboardView, DealsView, ContactsView, ContactDrawer, FiltersModal, CompaniesView, CalendarView, EventsView |
| **Batch 4** | Omnichannel | 6 files | **PASS (0 violations)** | OmnichannelView, ConversationItem, OmnichannelTutorialModal, TemplatePickerModal, ManageTemplatesView, PlatformIcon |
| **Batch 5** | Settings | 7 files | **PASS (0 violations)** | SettingsView, AIAssistantsTab, AutomationTab, AgentsTab, TeamsTab, RolesTab, CrmSetupStatusBar |
| **Batch 6** | Forms, Booking & Tools | 7 files | **PASS (0 violations)** | FormBuilderView, WebFormsDashboardView, FormDetailView, SubmissionsView, BookingPagesView, ScanNameCardView, AddonsView |
| **Batch 7** | Partner Portal | 8 files | **PASS (0 violations)** | PartnerReferralsView, PartnerOverviewView, PartnerWithdrawalView, PartnerProgramView, PartnerRegisterView, PartnerCommissionsView, PartnerKitView, PartnerTrackSwitcher |
| **Batch 8** | Auth & Onboarding | 21 files | **PASS (0 violations)** | `src/components/onboarding/` (17 files), AuthView, OnboardingView, OnboardingV1View, SetupWizardView |
| **Batch 9** | Docs & Guidelines | 2 files | **PASS (0 violations)** | DesignSystemView.vue, GuidelinesView.vue. *(Missing `src/data/designSystemGuidelines.ts`)* |

### 2.2 Missing File in Batch 9 Definition
In `scripts/audit-tokens.cjs` lines 111-118:
```javascript
  9: {
    name: 'Batch 9 (Docs & Guidelines)',
    files: [
      'src/views/DesignSystemView.vue',
      'src/views/GuidelinesView.vue'
    ]
  }
```
`src/data/designSystemGuidelines.ts` is the data source backing `DesignSystemView.vue` and contains the markdown system prompt. It is currently omitted from `BATCHES[9].files`.
**Proposed Fix**:
```javascript
  9: {
    name: 'Batch 9 (Docs & Guidelines)',
    files: [
      'src/views/DesignSystemView.vue',
      'src/views/GuidelinesView.vue',
      'src/data/designSystemGuidelines.ts'
    ]
  }
```

### 2.3 Full Codebase Audit Behavior across 444 Files
- When run without `--batch`, `scripts/audit-tokens.cjs` calls `getAllFiles('src', ['.vue', '.ts', '.js', '.css'])` (filtering out `tw-animate-css.css`).
- Total files scanned: **444 files**.
- Total violations detected: **0 violations**.
- The 19 files in `src/` not explicitly listed in any specific batch (such as `useTheme.ts`, `router/index.ts`, data files, stores) **are fully scanned and validated during the default full codebase audit pass**.

---

## 3. Deep Scan: Remaining Raw Colors, Styles & Illustrations

To ensure zero blind spots, we executed custom regex scans across all 444 source files to uncover any raw hex, inline styles, or hardcoded SVG colors outside the scope of Tailwind class detection.

### 3.1 Inventory of 157 Hex References across 14 Files

| File | Matches | Nature of Hex Codes | Status & M6 Recommendation |
|---|---|---|---|
| `src/views/DashboardView.vue` | 65 | ApexCharts options: `colors: ['#2E91E5']`, `track: { background: '#e5e7eb' }`, `labels: { style: { colors: '#94a3b8' } }` | **Milestone 6 Feature 19 Target**: Convert 18 charts to use `useChartTheme.ts` computed options resolving CSS variables dynamically. |
| `src/views/partner/PartnerOverviewView.vue` | 4 | ApexCharts options: `colors: isDark ? ... : ['#F59E0B', '#8B5CF6', '#F43F5E', '#23B750']` | **Milestone 6 Feature 19 Target**: Convert 2 charts to use `useChartTheme.ts`. |
| `src/components/dashboard/CrmSetupStatusBar.vue` | 2 | `canvas-confetti` color options: `colors: ['#23B750', '#62D816', '#10B981', '#34D399', '#3B82F6', '#F59E0B']` | **Milestone 6 Feature 20 Target**: Update confetti helper to read theme status tokens. |
| `src/views/OnboardingView.vue` | 2 | `canvas-confetti` color arrays | **Milestone 6 Feature 20 Target**: Confetti token adaptation. |
| `src/views/SetupWizardView.vue` | 4 | `canvas-confetti` color arrays & default livechat widget color preview | **Milestone 6 Feature 20 Target** + Widget user preview. |
| `src/views/OnboardingV1View.vue` | 1 | Default widget color preview | User widget preview fallback. |
| `src/views/DesignSystemView.vue` | 16 | Mock SVG chart attributes (`stroke="#23B750"`, `:fill="... ? '#62D816' : '#23B750'"`, `stroke="#0f172a"`) and interactive accent tint demo | **M6 Polish Target**: Update SVG mock charts to use `var(--primary)`, `var(--brand)`, `var(--border)`. |
| `src/views/GuidelinesView.vue` | 15 | Documentation swatch color objects: `{ hex: '#23B750', name: 'RKS Green (Primary)' }`, `{ hex: '#0A0D12', name: 'Gray 950' }` | **Legitimate Documentation**: Swatches demonstrating the brand spectrum and WCAG contrast ratios. |
| `src/components/omnichannel/PlatformIcon.vue` | 14 | Third-party brand palette: `whatsapp: '#25D366'`, `messenger: '#0084FF'`, `instagram: '#E1306C'` | **Legitimate Third-Party Identity**: Standard external brand trademark colors. Container badges already use tokenized `bg-success/10 text-success`. |
| `src/stores/webforms.ts` | 13 | Default form builder template color choices (`thumbnailColor: '#F2F4F7'`, `primaryColor: '#23B750'`) | **User Customization**: End-user form styling presets. |
| `src/views/webforms/FormBuilderView.vue` | 6 | Color picker palette for public web forms | **User Customization**: End-user form styling presets. |
| `src/views/webforms/FormDetailView.vue` | 1 | Text description: `<li>• Brand Green (#23B750)</li>` | Informational label. |
| `src/components/onboarding/StepWebsiteWidget.vue` | 5 | Customer chat widget color picker presets | **User Customization**: Live chat bubble color on end-user website. |
| `src/components/onboarding/v2/StepWizardLiveChat.vue` | 9 | Customer chat widget color picker presets | **User Customization**: Live chat bubble color on end-user website. |

### 3.2 Illustrations & Media Assets Audit
- **Public Brand Assets**: `public/brand-assets/partner/sales-partner-illustration.png`, `referral-partner-illustration.png`, `partner-earnings-hero.png`, `partner-program-hero.jpg`.
- **Logos**: `logo/RKS Logo Lockup 01.svg` (light mode), `logo/RKS Logo Lockup 02.svg` (dark mode), `logo/RKS Logomark 01.svg`, `logo/RKS Logomark 02.svg`.
- **Theme Adaptation Verification**: `MainLayout.vue`, `PartnerRegisterView.vue`, `TopNav.vue`, and `GuidelinesView.vue` dynamically switch between `lightLogoUrl` and `darkLogoUrl` based on the reactive `isDark` composable state.
- **Backgrounds**: Transparent PNG illustrations and vector SVG lockups adapt cleanly against both `oklch(1 0 0)` light and `oklch(0.145 0 0)` dark background canvases without hardcoded clipping backgrounds.

---

## 4. Concrete Implementation Proposals

### 4.1 Proposal for `DESIGN.md` and `src/data/designSystemGuidelines.ts`
Replace the contents of `DESIGN.md` and the template literal in `src/data/designSystemGuidelines.ts` with the tested, 0-violation markdown structure drafted in `.agents/teamwork/explorer_m6_2/proposed_DESIGN.md`.

**Key Enhancements**:
1. **Section 2 Restructured**: Establishes `src/assets/index.css` as Single Source of Truth; details the 4 strict theming rules from `AGENTS.md`.
2. **Canonical Token Catalog**: Documents `--primary`, `--brand`, `--brand-secondary`, `--success`, `--warning`, `--info`, `--destructive`, `--rail`, `--rail-active`, `--rail-muted-foreground`, `--rail-border`, `--background`, `--card`, `--muted`, `--border`, `--foreground`.
3. **Categorical Tag Tokens**: Explicitly documents `--tag-1` through `--tag-6` with their light/dark paired backgrounds and text tokens for CRM pipeline stages.
4. **All Raw Colors Eliminated**: Cleans out `text-gray-900`, `bg-white`, `bg-[#23B750]`, raw stage hexes, and all `dark:` overrides.
5. **Quality Checklist Updated**: Mandates dynamic chart theming, dual-mode verification, and zero audit script violations.

### 4.2 Proposal for `scripts/audit-tokens.cjs`
Update `BATCHES[9]` in `scripts/audit-tokens.cjs` from:
```javascript
  9: {
    name: 'Batch 9 (Docs & Guidelines)',
    files: [
      'src/views/DesignSystemView.vue',
      'src/views/GuidelinesView.vue'
    ]
  }
```
to:
```javascript
  9: {
    name: 'Batch 9 (Docs & Guidelines)',
    files: [
      'src/views/DesignSystemView.vue',
      'src/views/GuidelinesView.vue',
      'src/data/designSystemGuidelines.ts'
    ]
  }
```

### 4.3 Proposed Follow-up Polish for `DesignSystemView.vue` (M6 Implementer Task)
In `src/views/DesignSystemView.vue`:
- Line 2469: change `stroke="#23B750"` to `stroke="var(--primary)"` or `class="stroke-primary"`.
- Line 2476: change `stroke="rgba(34, 197, 94, 0.35)"` to `stroke="color-mix(in srgb, var(--primary) 35%, transparent)"`.
- Line 2485: change `:fill="idx === chartData.length - 1 ? '#62D816' : '#23B750'"` to `:fill="idx === chartData.length - 1 ? 'var(--brand-secondary)' : 'var(--primary)'"`.
- Line 2486: change `stroke="#0f172a"` to `stroke="var(--background)"`.
- Line 2492: change `fill="rgba(34, 197, 94, 0.25)"` to `fill="color-mix(in srgb, var(--primary) 25%, transparent)"`.
- Line 2493: change `fill="#22c55e" stroke="#ffffff"` to `fill="var(--primary)" stroke="var(--background)"`.
- Line 2901: change `stroke="#23B750"` to `stroke="var(--primary)"`.

---

## 5. Verification Commands for Handoff

```bash
# 1. Verify all individual batches 1 through 9
1..9 | ForEach-Object { node scripts/audit-tokens.cjs --batch $_ }

# 2. Verify proposed DESIGN.md passes token audit with 0 violations
node scripts/audit-tokens.cjs --file .agents/teamwork/explorer_m6_2/proposed_DESIGN.md

# 3. Verify in-app guidelines pass token audit with 0 violations
node scripts/audit-tokens.cjs --file src/data/designSystemGuidelines.ts

# 4. Verify full codebase audit across all 444 files
node scripts/audit-tokens.cjs

# 5. Verify full production build succeeds with 0 errors
npm.cmd run build
```
