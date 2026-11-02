# Survey Phase — Batches 1 to 9 Component Inventory & Violation Analysis

**Explorer 2 Handoff Report**
**Target**: Parent Orchestrator (`57c50def-4689-4a65-86f1-14dce8a95cbf`)
**Date**: 2026-10-30T10:15:00Z
**Scope**: Codebase-wide audit across all 9 Batches (App Shell, UI Components, CRM Core, Omnichannel, Settings, Forms & Booking, Partner Portal, Auth & Onboarding, Docs & Guidelines).

---

## 1. Observation

A comprehensive AST- and regex-based survey of all Vue and TypeScript files across `src/` was executed using automated scanners and file inspections (`scratch/survey_scanner.cjs` and `scratch/survey_details.cjs`). 

### 1.1 Summary Matrix Across All 9 Batches

| Batch ID & Name | Total Files | Total Lines | Palette Grays / Neutrals | Arbitrary Hex / RGB | Inline Hex / RGB | Raw Status Colors | `dark:` Overrides | JS Hex Literals | Total Violations | Complex UI Patterns Detected |
|---|---|---|---|---|---|---|---|---|---|---|
| **Batch 1 (App Shell)** | 9 | 1,995 | 220 | 23 | 0 | 41 | 33 | 0 | **317** | Rail dark mode, Gradients (5), TopNav status badges |
| **Batch 2 (UI Components)** | 349 | 9,092 | 17 | 6 | 0 | 2 | 4 | 0 | **29** | Unovis charts (3), Button CVA variants, Dialog/Overlay backdrops |
| **Batch 3 (CRM Core)** | 8 | 13,724 | 2,622 | 333 | 5 | 667 | 987 | 84 | **4,614** | 19 ApexCharts, 5-stage Kanban pipeline, SVG progress meters |
| **Batch 4 (Omnichannel)** | 6 | 6,714 | 973 | 216 | 0 | 295 | 0 | 22 | **1,484** | 0 dark: overrides (pure light hardcoding), Chat bubbles, PlatformIcon channel badges |
| **Batch 5 (Settings)** | 7 | 11,742 | 2,543 | 47 | 0 | 576 | 602 | 52 | **3,768** | AIAssistants live prompt tester, CrmSetupStatusBar, confetti |
| **Batch 6 (Forms & Booking)** | 7 | 7,460 | 1,119 | 1 | 0 | 633 | 667 | 12 | **2,420** | FormBuilder canvas & DND, NameCard camera viewfinder, Addons grid |
| **Batch 7 (Partner Portal)** | 8 | 8,867 | 2,739 | 497 | 12 | 638 | 1,363 | 21 | **5,249** | 2 ApexCharts, Extreme `dark:bg-[#0B0F19]` overrides, PartnerRegister SVGs |
| **Batch 8 (Auth & Onboarding)** | 21 | 5,459 | 938 | 287 | 0 | 179 | 0 | 45 | **1,404** | 0 dark: overrides, 3 steppers, LiveChat & WhatsApp QR simulators |
| **Batch 9 (Docs & Guidelines)** | 2 | 5,873 | 917 | 105 | 6 | 413 | 341 | 37 | **1,782** | Living design system catalog (30+ component sections), SVG swatches |
| **TOTALS** | **417** | **70,926** | **12,088** | **1,515** | **23** | **3,444** | **3,997** | **273** | **21,067** | |

*(Note: Total violations count = Palette Grays + Hex Classes + Inline Hex + Status Colors + `dark:` Overrides. JS Hex literals are tracked separately for chart/data configs).*

---

### 1.2 Batch 1: App Shell (9 Files, 1,995 Lines, 317 Violations)

#### Exact File Inventory & Breakdown:
1. `src/layouts/MainLayout.vue` (506 lines) — 115 violations (82 palette, 0 hex, 0 status, 33 `dark:` overrides)
2. `src/components/layout/AppShell.vue` (66 lines) — 3 violations (3 palette)
3. `src/components/layout/Sidebar.vue` (133 lines) — 3 violations (3 palette)
4. `src/components/layout/SidebarItem.vue` (81 lines) — 17 violations (17 palette)
5. `src/components/layout/SecondaryPanel.vue` (409 lines) — 20 violations (17 palette, 2 hex, 1 status)
6. `src/components/layout/TopNav.vue` (527 lines) — 101 violations (69 palette, 2 hex, 30 status)
7. `src/components/omnichannel/InboxDropdown.vue` (204 lines) — 52 violations (26 palette, 16 hex, 10 status)
8. `src/components/omnichannel/ToastNotifications.vue` (49 lines) — 6 violations (3 palette, 3 hex)
9. `src/App.vue` (20 lines) — 0 violations (coupled entry wrapper)

#### Verbatim Evidence & Line References:
- **Outer Rail Hardcoded Neutrals** (`Sidebar.vue:3`, `SidebarItem.vue:6-7`):
  ```html
  <!-- Sidebar.vue:3 -->
  <aside class="flex flex-col h-full bg-gray-950 border-r border-gray-800 shrink-0 transition-all ...">
  <!-- SidebarItem.vue:6-7 -->
  <span :class="[isActive ? 'bg-gray-800 text-white font-semibold' : 'text-gray-300 hover:bg-gray-800 ...']">
  ```
- **Redundant `dark:` Overrides** (`MainLayout.vue:124, 343, 346`):
  ```html
  <!-- MainLayout.vue:124 -->
  <div class="flex-1 min-w-0 flex flex-col h-screen overflow-hidden bg-gray-50 dark:bg-background">
  <!-- MainLayout.vue:343 -->
  <div class="p-4 bg-white dark:bg-card border border-border dark:border-border rounded-xl">
  ```
- **Hardcoded Brand Hex and Status Colors in TopNav & Dropdown** (`TopNav.vue:14, 61`, `InboxDropdown.vue:71, 75`):
  ```html
  <!-- TopNav.vue:14 -->
  <span class="text-xs font-bold text-[#23B750]">Pro</span>
  <!-- TopNav.vue:61 -->
  <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
  <!-- InboxDropdown.vue:71 -->
  <span class="text-xs font-semibold text-[#23B750] bg-green-50 px-2 py-0.5 rounded-full">
  ```

---

### 1.3 Batch 2: UI Components (`src/components/ui/`, 349 Files, 9,092 Lines, 29 Violations)

#### Exact Inventory:
349 files spread across 48 component folders:
`accordion`, `alert`, `alert-dialog`, `aspect-ratio`, `auto-form`, `avatar`, `badge`, `breadcrumb`, `button`, `calendar`, `card`, `carousel`, `chart`, `checkbox`, `collapsible`, `combobox`, `command`, `context-menu`, `dialog`, `drawer`, `dropdown-menu`, `form`, `hover-card`, `input`, `label`, `menubar`, `navigation-menu`, `number-field`, `pagination`, `pin-input`, `popover`, `progress`, `radio-group`, `range-calendar`, `resizable`, `scroll-area`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `slider`, `sonner`, `stepper`, `switch`, `table`, `tabs`, `tags-input`, `textarea`, `toggle`, `toggle-group`, `tooltip`.

#### Verbatim Evidence & Violations:
The standard Shadcn-Vue components are already well-tokenized (`bg-background`, `text-foreground`, `border-border`). Violations are concentrated in 7 files:
1. `src/components/ui/button/index.ts` (23 violations):
   ```typescript
   // Lines 17-21:
   brand: "bg-[#23B750] text-white hover:bg-[#1a943e] shadow-sm",
   gradient: "bg-gradient-to-r from-[#23B750] to-[#62D816] text-white hover:opacity-95 shadow-sm",
   success: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm",
   danger: "bg-[#EF4444] text-white hover:bg-[#DC2626] shadow-sm",
   soft: "bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-800 dark:border-slate-700",
   ```
2. Overlay Backdrops with Hardcoded `bg-black/80`:
   - `src/components/ui/alert-dialog/AlertDialogContent.vue:24`: `bg-black/80`
   - `src/components/ui/dialog/DialogContent.vue:26`: `bg-black/80`
   - `src/components/ui/dialog/DialogScrollContent.vue:26`: `bg-black/80`
   - `src/components/ui/drawer/DrawerOverlay.vue:14`: `bg-black/80`
   - `src/components/ui/sheet/SheetContent.vue:38`: `bg-black/80`
3. Redundant `dark:` override:
   - `src/components/ui/alert/index.ts:15`: `dark:border-destructive`
4. Unovis Chart Token Binding:
   - `src/components/ui/chart/index.ts:13-14`: Currently generates colors using `hsl(var(--vis-primary-color) / ...)`, which does not link with `--chart-1` through `--chart-5`.

---

### 1.4 Batch 3: CRM Core (8 Files, 13,724 Lines, 4,614 Violations)

#### Exact File Inventory & Breakdown:
1. `src/views/DashboardView.vue` (2,329 lines) — 1,345 violations (747 palette, 130 hex, 79 status, 389 `dark:` overrides, 73 JS hex)
2. `src/views/DealsView.vue` (3,471 lines) — 742 violations (508 palette, 150 hex, 84 status, 0 `dark:`, 6 JS hex)
3. `src/views/ContactsView.vue` (1,522 lines) — 476 violations (185 palette, 9 hex, 105 status, 177 `dark:`)
4. `src/components/omnichannel/ContactDrawer.vue` (2,350 lines) — 524 violations (345 palette, 8 hex, 171 status, 0 `dark:`)
5. `src/components/omnichannel/FiltersModal.vue` (953 lines) — 251 violations (215 palette, 29 hex, 7 status, 0 `dark:`)
6. `src/views/CompaniesView.vue` (94 lines) — 21 violations (21 palette)
7. `src/views/CalendarView.vue` (890 lines) — 221 violations (137 palette, 66 status, 18 `dark:`)
8. `src/views/EventsView.vue` (2,115 lines) — 1,034 violations (464 palette, 7 hex, 5 inline hex, 155 status, 403 `dark:`, 5 JS hex)

#### Verbatim Evidence & Complex UI:
- **19 ApexCharts in `DashboardView.vue`** (Lines 266, 288, 310, 344, 376, 423, 470, 532, 651, 687, 912, 938, 973, 985, 1149, 1172, 1194, 1336):
  ```typescript
  // DashboardView.vue:1635-1640 (Overview tab sparkline options)
  const sparklineBlueOptions = computed(() => ({
    colors: ['#3b82f6'],
    chart: { sparkline: { enabled: true } },
    stroke: { curve: 'smooth', width: 2 }
  }));
  ```
- **5 Kanban Stage Stripes in `DealsView.vue`** (Lines 871-873, 883-885):
  ```typescript
  // DealsView.vue:871-873
  New: { border: 'border-t-[#3b82f6]', bg: 'bg-[#3b82f6]/10', text: 'text-[#3b82f6]', headerBar: 'bg-[#3b82f6]' },
  Acknowledged: { border: 'border-t-[#00D2C4]', bg: 'bg-[#00D2C4]/10', text: 'text-[#00D2C4]', headerBar: 'bg-[#00D2C4]' },
  Qualifying: { border: 'border-t-[#FFCC00]', bg: 'bg-[#FFCC00]/10', text: 'text-[#FFCC00]', headerBar: 'bg-[#FFCC00]' },
  ```
- **Inline SVG Progress Rings in `EventsView.vue`** (Lines 863-866):
  ```html
  <circle stroke="#e2e8f0" stroke-width="6" fill="transparent" r="28" cx="32" cy="32"/>
  <circle stroke="#22c55e" stroke-width="6" stroke-linecap="round" fill="transparent" r="28" cx="32" cy="32"/>
  ```

---

### 1.5 Batch 4: Omnichannel (6 Files, 6,714 Lines, 1,484 Violations)

#### Exact File Inventory & Breakdown:
1. `src/views/OmnichannelView.vue` (4,029 lines) — 882 violations (605 palette, 132 hex, 145 status, 0 `dark:`, 6 JS hex)
2. `src/components/omnichannel/ConversationItem.vue` (1,027 lines) — 334 violations (200 palette, 53 hex, 81 status, 0 `dark:`)
3. `src/components/omnichannel/OmnichannelTutorialModal.vue` (491 lines) — 127 violations (89 palette, 25 hex, 13 status, 0 `dark:`)
4. `src/components/omnichannel/TemplatePickerModal.vue` (445 lines) — 92 violations (69 palette, 6 hex, 17 status, 0 `dark:`)
5. `src/views/webforms/ManageTemplatesView.vue` (491 lines) — 10 violations (3 palette, 7 status, 0 `dark:`)
6. `src/components/omnichannel/PlatformIcon.vue` (231 lines) — 39 violations (7 palette, 32 status, 16 JS hex)

#### Critical Observation — Complete Absence of Dark Mode:
- Batch 4 has **0 `dark:` overrides across all 6,714 lines**! It is hardcoded purely for light mode (`bg-white`, `border-gray-200`, `text-gray-900`, `bg-gray-100`, `bg-[#23B750]`).
- Outgoing chat bubbles are hardcoded to `bg-[#23B750] text-white` (`OmnichannelView.vue:1956`), incoming to `bg-gray-100 text-gray-800`.
- `PlatformIcon.vue` contains hardcoded platform background colors:
  ```typescript
  // PlatformIcon.vue:114-118
  whatsapp: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  telegram: 'bg-sky-50 text-sky-700 border-sky-200',
  facebook: 'bg-blue-50 text-blue-700 border-blue-200'
  ```

---

### 1.6 Batch 5: Settings (7 Files, 11,742 Lines, 3,768 Violations)

#### Exact File Inventory & Breakdown:
1. `src/views/SettingsView.vue` (3,098 lines) — 843 violations (719 palette, 1 hex, 123 status, 0 `dark:`, 34 JS hex)
2. `src/components/settings/AIAssistantsTab.vue` (4,368 lines) — 1,131 violations (830 palette, 27 hex, 274 status, 0 `dark:`)
3. `src/components/settings/AutomationTab.vue` (1,985 lines) — 964 violations (577 palette, 0 hex, 103 status, 284 `dark:`, 7 JS hex)
4. `src/components/settings/AgentsTab.vue` (649 lines) — 282 violations (148 palette, 0 hex, 10 status, 124 `dark:`)
5. `src/components/settings/TeamsTab.vue` (550 lines) — 176 violations (82 palette, 0 hex, 25 status, 69 `dark:`)
6. `src/components/settings/RolesTab.vue` (403 lines) — 132 violations (69 palette, 0 hex, 5 status, 58 `dark:`)
7. `src/components/dashboard/CrmSetupStatusBar.vue` (689 lines) — 240 violations (118 palette, 19 hex, 36 status, 67 `dark:`, 11 JS hex)

#### Verbatim Evidence & Complex UI:
- **`dark:` Override Anti-Patterns** (`AutomationTab.vue:4-10`, `AgentsTab.vue:4-8`, `RolesTab.vue:4-8`):
  ```html
  <!-- Lines 4-8 across AutomationTab, AgentsTab, TeamsTab, RolesTab -->
  <div class="border border-gray-200 dark:border-border rounded-xl bg-white dark:bg-card">
    <h3 class="text-slate-900 dark:text-white font-semibold">...</h3>
    <p class="text-gray-500 dark:text-gray-400">...</p>
  ```
  *(Replacing these with `border-border bg-card text-foreground text-muted-foreground` eliminates hundreds of redundant overrides).*
- **`AIAssistantsTab.vue`**: 4,368 lines, live chat simulator for agent prompt testing, hardcoded `#1ea446` green buttons, status chips.
- **`CrmSetupStatusBar.vue`**: Uses `canvas-confetti` with hex color array upon completing setup wizard checklist.

---

### 1.7 Batch 6: Forms, Booking & Tools (7 Files, 7,460 Lines, 2,420 Violations)

#### Exact File Inventory & Breakdown:
1. `src/views/webforms/FormBuilderView.vue` (2,134 lines) — 669 violations (278 palette, 204 status, 187 `dark:`, 10 JS hex)
2. `src/views/webforms/WebFormsDashboardView.vue` (861 lines) — 87 violations (36 palette, 36 status, 15 `dark:`)
3. `src/views/webforms/FormDetailView.vue` (634 lines) — 109 violations (33 palette, 49 status, 27 `dark:`)
4. `src/views/webforms/SubmissionsView.vue` (307 lines) — 18 violations (2 palette, 13 status, 3 `dark:`)
5. `src/views/BookingPagesView.vue` (562 lines) — 140 violations (95 palette, 45 status, 0 `dark:`)
6. `src/views/ScanNameCardView.vue` (1,332 lines) — 574 violations (357 palette, 76 status, 141 `dark:`)
7. `src/views/AddonsView.vue` (1,630 lines) — 823 violations (318 palette, 1 hex, 210 status, 294 `dark:`, 2 JS hex)

#### Verbatim Evidence & Complex UI:
- **`FormBuilderView.vue` Custom Canvas & Properties Inspector**:
  ```html
  <!-- FormBuilderView.vue:307 -->
  <div class="h-full flex flex-col bg-slate-100 dark:bg-zinc-800 ...">
  <!-- FormBuilderView.vue:320 -->
  <div class="p-4 bg-gray-100 dark:bg-zinc-900/90 border-b border-border">
  ```
- **`ScanNameCardView.vue` Camera Frame & OCR Overlay**:
  ```html
  <!-- ScanNameCardView.vue:348 -->
  <div class="bg-white dark:bg-card border border-gray-200 dark:border-border rounded-xl">
  ```
- **Closely Coupled Store**: `src/stores/webforms.ts` (Lines 47, 60) defines hardcoded `thumbnailColor: '#F2F4F7'` and `'#EBF5EE'`, which must be adapted for theme safety.

---

### 1.8 Batch 7: Partner Portal (8 Files, 8,867 Lines, 5,249 Violations)

#### Exact File Inventory & Breakdown:
1. `src/views/partner/PartnerReferralsView.vue` (1,994 lines) — 1,404 violations (760 palette, 103 hex, 132 status, 409 `dark:`)
2. `src/views/partner/PartnerOverviewView.vue` (1,796 lines) — 1,248 violations (549 palette, 91 hex, 246 status, 362 `dark:`, 9 JS hex)
3. `src/views/partner/PartnerWithdrawalView.vue` (1,351 lines) — 775 violations (434 palette, 57 hex, 56 status, 228 `dark:`)
4. `src/views/partner/PartnerProgramView.vue` (1,190 lines) — 762 violations (392 palette, 80 hex, 88 status, 202 `dark:`)
5. `src/views/PartnerRegisterView.vue` (1,523 lines) — 504 violations (302 palette, 118 hex, 12 inline hex, 72 status, 0 `dark:`, 12 JS hex)
6. `src/views/partner/PartnerCommissionsView.vue` (651 lines) — 413 violations (225 palette, 28 hex, 33 status, 127 `dark:`)
7. `src/views/partner/PartnerKitView.vue` (277 lines) — 108 violations (58 palette, 15 hex, 7 status, 28 `dark:`)
8. `src/components/partner/PartnerTrackSwitcher.vue` (85 lines) — 35 violations (19 palette, 5 hex, 4 status, 7 `dark:`)

#### Verbatim Evidence & Complex UI:
- **Massive Repetition of Arbitrary Dark Hex Overrides**:
  Across every file in `src/views/partner/`:
  ```html
  <!-- PartnerReferralsView.vue:2, PartnerOverviewView.vue:2, PartnerWithdrawalView.vue:2, etc. -->
  <div class="min-h-screen bg-gray-50 dark:bg-[#0B0F19] text-gray-900 dark:text-gray-100">
    <div class="bg-white dark:bg-[#0E131F]/80 border border-gray-200 dark:border-gray-800/80 rounded-2xl">
  ```
  *(1,363 `dark:` overrides and 497 arbitrary hex classes in this batch alone! Direct replacement with `bg-background`, `bg-card`, `border-border`, `text-foreground` collapses over 2,500 violations in one stroke).*
- **2 ApexCharts in `PartnerOverviewView.vue`** (Lines 317, 487):
  Hardcoded referral growth area chart and commission earnings bar chart.
- **Standalone Layout in `PartnerRegisterView.vue`**:
  Has its own standalone container (not inside AppShell layout) and inline SVGs with `fill="#23b750"`.

---

### 1.9 Batch 8: Auth & Onboarding (21 Files, 5,459 Lines, 1,404 Violations)

#### Exact File Inventory & Breakdown:
1. `src/views/AuthView.vue` (430 lines) — 148 violations (88 palette, 30 hex, 30 status)
2. `src/views/OnboardingView.vue` (415 lines) — 48 violations (27 palette, 16 hex, 5 status, 14 JS hex)
3. `src/views/OnboardingV1View.vue` (273 lines) — 54 violations (35 palette, 11 hex, 8 status, 1 JS hex)
4. `src/views/SetupWizardView.vue` (567 lines) — 57 violations (36 palette, 12 hex, 9 status, 16 JS hex)
5. `src/components/onboarding/StepBusiness.vue` (215 lines) — 70 violations
6. `src/components/onboarding/StepPlan.vue` (234 lines) — 54 violations
7. `src/components/onboarding/StepReady.vue` (153 lines) — 57 violations
8. `src/components/onboarding/StepSetupChecklist.vue` (182 lines) — 57 violations
9. `src/components/onboarding/StepTeam.vue` (187 lines) — 58 violations
10. `src/components/onboarding/StepWebsiteWidget.vue` (326 lines) — 124 violations
11. `src/components/onboarding/StepWhatsApp.vue` (310 lines) — 120 violations
12. `src/components/onboarding/v2/OnboardingSideNav.vue` (167 lines) — 41 violations
13. `src/components/onboarding/v2/OnboardingTopStepper.vue` (88 lines) — 7 violations
14. `src/components/onboarding/v2/SetupWizardTopStepper.vue` (88 lines) — 7 violations
15. `src/components/onboarding/v2/StepCompanyNameType.vue` (107 lines) — 24 violations
16. `src/components/onboarding/v2/StepCountryCurrency.vue` (122 lines) — 21 violations
17. `src/components/onboarding/v2/StepPlanSelection.vue` (290 lines) — 67 violations
18. `src/components/onboarding/v2/StepTeamIndustry.vue` (161 lines) — 32 violations
19. `src/components/onboarding/v2/StepWizardLiveChat.vue` (437 lines) — 147 violations
20. `src/components/onboarding/v2/StepWizardTeam.vue` (286 lines) — 58 violations
21. `src/components/onboarding/v2/StepWizardWhatsApp.vue` (421 lines) — 153 violations

#### Verbatim Evidence & Complex UI:
- **0 `dark:` overrides across all 21 files**: Auth and Onboarding are currently completely untokenized for dark mode.
- Stepper indicators:
  ```html
  <!-- OnboardingSideNav.vue:28 -->
  <div class="w-6 h-6 rounded-full bg-[#008236] text-white flex items-center justify-center text-xs">
  ```
- Interactive Simulators:
  - `StepWizardLiveChat.vue` (live chat widget mockup with client/agent bubbles)
  - `StepWizardWhatsApp.vue` (QR code frame and connection simulator)
  - `StepPlanSelection.vue` (tier comparison pricing cards with green radio selections)

---

### 1.10 Batch 9: Docs & Guidelines (2 Files, 5,873 Lines, 1,782 Violations)

#### Exact File Inventory:
1. `src/views/DesignSystemView.vue` (4,917 lines) — 1,424 violations (649 palette, 74 hex, 6 inline hex, 354 status, 341 `dark:`, 23 JS hex)
2. `src/views/GuidelinesView.vue` (956 lines) — 358 violations (268 palette, 31 hex, 59 status, 0 `dark:`, 14 JS hex)
3. Coupled Documentation: `DESIGN.md` (147 lines) and `src/data/designSystemGuidelines.ts` (148 lines).

#### Verbatim Evidence & Complex UI:
- `DesignSystemView.vue` is a comprehensive living design catalog containing over 30 interactive sections displaying color chips, badges, button variants, charts, and form controls.
- The view itself contains extensive raw classes on its shell, headers, and tabs:
  ```html
  <!-- DesignSystemView.vue:1175-1182 -->
  <div class="min-h-screen bg-slate-900 dark:from-slate-950 dark:via-slate-900/90 dark:to-slate-950 text-slate-100">
    <div class="border-b border-gray-200 dark:border-border">
      <h1 class="text-2xl font-bold text-gray-900">Design System</h1>
  ```
- `DESIGN.md` and `designSystemGuidelines.ts` currently instruct developers to use `text-gray-900 dark:text-foreground` and hardcoded stage hexes (`#3b82f6`, `#00D2C4`), which directly violates the token rules in `AGENTS.md`.

---

## 2. Logic Chain

1. **Premise 1 (Single Source of Truth Rule from `AGENTS.md`)**:
   Styling must flow strictly from CSS variables in `index.css`. Raw palette grays/neutrals, hex/rgb arbitrary values, raw status colors, and `dark:` overrides are forbidden.
2. **Observation Step 1**:
   The audit identified 21,067 violations across 417 files. However, 82% of these violations (17,297) fall into just three repetitive patterns:
   - Palette grays (`bg-white`, `border-gray-200`, `text-gray-900`, `text-gray-500`): 12,088 instances.
   - `dark:` overrides (`dark:bg-[#0B0F19]`, `dark:border-border`, `dark:text-white`): 3,997 instances.
   - Arbitrary brand hex (`bg-[#23B750]`, `text-[#23B750]`): 1,515 instances.
3. **Inference 1 (Token Equivalence Collapse)**:
   By mapping these repetitive patterns directly to standard semantic tokens (`bg-background`, `bg-card`, `border-border`, `text-foreground`, `text-muted-foreground`, `bg-primary`), the vast majority of violations in Batches 3, 5, 6, 7, 8 can be systematically resolved using deterministic tokenization codemods without touching layout structure or business logic.
4. **Observation Step 2 (The Asymmetric Dark Mode Problem)**:
   - Batches 3, 5, 6, 7 have high numbers of manual `dark:` overrides (e.g. Batch 7 has 1,363 `dark:` overrides using arbitrary hexes like `dark:bg-[#0B0F19]`).
   - Conversely, Batches 4 (Omnichannel) and 8 (Auth & Onboarding) have **zero** `dark:` overrides. They were built entirely assuming light mode.
5. **Inference 2 (Universal Tokenization Strategy)**:
   Because semantic tokens resolve light and dark values automatically at the CSS variable layer, migrating both groups to the SAME semantic tokens simultaneously:
   - Strips the messy manual `dark:` hacks from Batches 3, 5, 6, 7.
   - Instantly grants native dark mode support to Batches 4 and 8 without needing to write any manual `dark:` classes.
6. **Observation Step 3 (Outer Rail Requirement R1)**:
   `Sidebar.vue` and `SidebarItem.vue` (Batch 1) currently rely on `bg-gray-950`, `border-gray-800`, `text-white`, `text-gray-300`, `bg-gray-800` to remain dark in both light and dark modes.
7. **Inference 3 (Dedicated Rail Tokens)**:
   As mandated in R1, dedicated rail tokens (`--rail`, `--rail-foreground`, `--rail-muted-foreground`, `--rail-active`, `--rail-border`) must be introduced into `index.css` and mapped in `@theme inline`. Replacing the hardcoded gray classes in Batch 1 with `bg-rail`, `text-rail-foreground`, `text-rail-muted-foreground`, `bg-rail-active`, `border-rail-border` keeps the rail dark across all themes while fully token-compliant.
8. **Observation Step 4 (Pipeline Stages & Categorical Tags)**:
   `DealsView.vue` (Batch 3) and `DESIGN.md` hardcode 5 pipeline stage colors (`#3b82f6`, `#00D2C4`, `#FFCC00`, `#FF8800`, `#10B981`).
9. **Inference 4 (Tag Tokens `--tag-1` to `--tag-6`)**:
   Adding `--tag-1` through `--tag-6` with light/dark bg and fg token pairs in `index.css` enables `DealsView.vue` to replace all 150 arbitrary hex classes with `border-tag-1`, `bg-tag-1/10`, `text-tag-1`, maintaining crisp visual differentiation and accessible contrast in both themes.
10. **Observation Step 5 (Charts Adaptation R3)**:
    - `DashboardView.vue` has 19 ApexCharts and `PartnerOverviewView.vue` has 2 ApexCharts, all with hardcoded hex arrays in reactive options.
    - `src/components/ui/chart/index.ts` uses `hsl(var(--vis-primary-color))` for Unovis.
11. **Inference 5 (Dynamic Chart Theming Composable)**:
    Charts do not automatically read CSS variable changes unless configured via computed properties that query `getComputedStyle(document.documentElement)` or react to theme toggle events. A lightweight chart helper function must be provided to supply resolved color tokens to ApexCharts series/options.

---

## 3. Caveats

1. **Untested Dynamic Values**: Some status colors or tag classes in mock data or external API responses (e.g. `thumbnailColor` in `src/stores/webforms.ts`) could be injected as inline styles. These must be checked when migrating Batch 6.
2. **Third-Party Messaging Brand Logos**: In Batch 4 (`PlatformIcon.vue`, `OmnichannelTutorialModal.vue`) and Batch 8 (`StepWhatsApp.vue`), official platform logos (WhatsApp, Meta/Facebook, Instagram, Telegram) contain specific brand-registered hex colors (`#25D366` for WhatsApp green, `#0088cc` for Telegram blue). These brand logos should retain their official identity icons while ensuring the surrounding badge container uses semantic status/tag tokens.
3. **DesignSystemView Intentional Swatches**: `DesignSystemView.vue` (Batch 9) intentionally displays sample swatches of various color palettes to document the system. Care must be taken during migration to tokenize the view's chrome, cards, and UI components while preserving the descriptive preview swatches themselves.
4. **Starter Component**: `src/components/HelloWorld.vue` is an unused boilerplate component and can be safely deleted or ignored during the batch rollout.

---

## 4. Conclusion & Recommended Migration Roadmap

### 4.1 Master Token Replacement Table

| Existing Violation Pattern | Recommended Semantic Token Replacement | Notes / Usage Boundary |
|---|---|---|
| `bg-white` | `bg-card` (for cards/modals/popovers) or `bg-background` (for page canvasses) | Auto light/dark surface |
| `bg-gray-50`, `bg-[#f9fafb]`, `bg-[#FAFAFA]` | `bg-background` | Base application canvas |
| `bg-gray-100`, `bg-slate-100`, `bg-zinc-100` | `bg-muted` | Inactive tabs, muted containers |
| `bg-gray-200`, `bg-slate-200` | `bg-muted/80` or `bg-accent` | Hover states, pill badges |
| `text-gray-900`, `text-slate-900`, `text-black` | `text-foreground` | High-contrast primary text |
| `text-gray-700`, `text-gray-800`, `text-slate-800` | `text-foreground/90` or `text-foreground` | Card titles, labels |
| `text-gray-500`, `text-gray-600`, `text-slate-500`, `text-gray-400` | `text-muted-foreground` | Secondary/helper text, timestamps |
| `text-gray-300`, `text-slate-300` | `text-muted-foreground/70` | Subtle indicators |
| `border-gray-200`, `border-slate-200`, `border-gray-100` | `border-border` | All card & component borders |
| `border-gray-300`, `border-slate-300` | `border-input` or `border-border` | Form input borders |
| `divide-gray-200` | `divide-border` | Table and list dividers |
| `bg-gray-950`, `bg-[#111827]` (Outer Rail only) | `bg-rail` | Rail dark background in both themes |
| `bg-gray-800`, `bg-[#1F2937]` (Outer Rail only) | `bg-rail-active` | Rail active/hovered background |
| `text-white` (Outer Rail only) | `text-rail-foreground` | Rail icons and labels |
| `text-gray-400`, `text-gray-300` (Outer Rail only) | `text-rail-muted-foreground` | Rail inactive icons |
| `border-gray-800` (Outer Rail only) | `border-rail-border` (or `border-border/10`) | Rail border divider |
| `bg-[#23B750]`, `text-[#23B750]`, `border-[#23B750]`, `ring-[#23B750]` | `bg-primary`, `text-primary`, `border-primary`, `ring-primary` | Main interactive brand actions |
| `bg-[#1a943e]`, `bg-[#1fa848]`, `bg-[#008236]` | `hover:bg-primary/90` or `bg-primary` | Hover or darker active brand states |
| `bg-emerald-50`, `bg-green-50` | `bg-success/10` | Success banner/badge backgrounds |
| `text-emerald-700`, `text-emerald-800`, `text-green-700` | `text-success` | Success text and icons |
| `border-emerald-200`, `border-green-200` | `border-success/20` | Success badge borders |
| `bg-emerald-500`, `bg-green-500` | `bg-success` | Filled success badges / buttons |
| `bg-[#EF4444]`, `bg-[#DC2626]`, `bg-red-500`, `bg-red-600` | `bg-destructive` | Destructive actions, error badges |
| `text-red-500`, `text-red-600`, `text-red-700` | `text-destructive` | Error text, danger icons |
| `bg-red-50`, `bg-red-100` | `bg-destructive/10` | Error banner/badge backgrounds |
| `border-red-200`, `border-red-100` | `border-destructive/20` | Error badge borders |
| `bg-amber-500`, `bg-yellow-500`, `bg-amber-600` | `bg-warning` | Warning buttons, alerts |
| `text-amber-600`, `text-amber-700`, `text-amber-800` | `text-warning` | Warning text |
| `bg-amber-50`, `bg-amber-100`, `bg-yellow-50` | `bg-warning/10` | Warning badge/callout backgrounds |
| `border-amber-200`, `border-amber-300` | `border-warning/20` | Warning badge borders |
| `bg-blue-500`, `bg-blue-600`, `bg-sky-500` | `bg-info` | Information action/indicators |
| `text-blue-600`, `text-blue-700`, `text-sky-600` | `text-info` | Information text |
| `bg-blue-50`, `bg-blue-100`, `bg-sky-50` | `bg-info/10` | Information callout backgrounds |
| `border-blue-200` | `border-info/20` | Information borders |
| Stage "New" (`#3b82f6` blue) | `border-tag-1 text-tag-1 bg-tag-1/10` | Deals Kanban & Categorical tags |
| Stage "Acknowledged" (`#00D2C4` cyan) | `border-tag-2 text-tag-2 bg-tag-2/10` | Deals Kanban & Categorical tags |
| Stage "Qualifying" (`#FFCC00` amber) | `border-tag-3 text-tag-3 bg-tag-3/10` | Deals Kanban & Categorical tags |
| Stage "Proposal" (`#FF8800` orange) | `border-tag-4 text-tag-4 bg-tag-4/10` | Deals Kanban & Categorical tags |
| Stage "Follow Up" (`#10B981` emerald) | `border-tag-5 text-tag-5 bg-tag-5/10` | Deals Kanban & Categorical tags |
| Purple / Violet categories | `border-tag-6 text-tag-6 bg-tag-6/10` | Deals Kanban & Categorical tags |
| `dark:bg-[#...]`, `dark:text-white`, `dark:border-border` | REMOVE `dark:` prefix entirely | Use the root token class directly |

---

### 4.2 Batch Rollout Sequencing & Dependencies

```
[Phase 1: Foundation (R1)]
   ├── Deduplicate index.css (:root & .dark)
   ├── Add semantic tokens: success, warning, info, rail, tag-1..tag-6
   ├── Clean tailwind.config.js (remove hardcoded hex primary/secondary/accent)
   └── Extract useTheme.ts & build verification script
         │
         ▼
[Phase 2: Core Skeleton]
   ├── Batch 1 (App Shell: MainLayout, Sidebar, Rail tokens, TopNav)
   └── Batch 2 (UI Components: Button variants, overlay backdrops, chart tokens)
         │
         ▼
[Phase 3: Core Business Modules]
   ├── Batch 3 (CRM Core: Deals Kanban tags, Dashboard ApexCharts)
   ├── Batch 4 (Omnichannel: Chat bubbles, PlatformIcon, zero dark: migration)
   └── Batch 5 (Settings: AI Assistants, Automation tabs, setup status bar)
         │
         ▼
[Phase 4: Extended Applications]
   ├── Batch 6 (Forms & Booking: FormBuilder canvas, NameCard, Addons)
   ├── Batch 7 (Partner Portal: Overview ApexCharts, collapse 5,249 violations)
   └── Batch 8 (Auth & Onboarding: Steppers, setup wizard, zero dark: migration)
         │
         ▼
[Phase 5: Documentation & Alignment (R3)]
   ├── Batch 9 (Docs & Guidelines: DesignSystemView, GuidelinesView)
   └── Update DESIGN.md & designSystemGuidelines.ts with AGENTS.md token rules
```

---

## 5. Verification Method

### 5.1 Independent Codebase Scan Verification
Run the survey inspector from PowerShell / Terminal to independently verify the file counts and violation tallies:
```bash
node scratch/survey_scanner.cjs
```
To inspect any specific batch (e.g. Batch 1 or Batch 7):
```bash
node scratch/survey_details.cjs 1
node scratch/survey_details.cjs 7
```

### 5.2 Build & Type Integrity
Ensure clean compilation without TypeScript errors:
```bash
npm run build
```

### 5.3 Automated Zero-Violation Audit (Post-Migration)
During migration phases, verify each batch reaches 0 violations using an automated lint rule or check script:
```bash
node -e "
const fs = require('fs');
const content = fs.readFileSync('src/layouts/MainLayout.vue', 'utf8');
const violations = content.match(/\b(?:bg|text|border)-(?:gray|slate|zinc|emerald|green|red|blue)-[0-9]+\b|\b(?:bg|text|border)-\[#[0-9a-fA-F]+\]\b|\bdark:[a-zA-Z0-9_\-\[\]#:\/]+\b/g) || [];
console.log('Violations remaining:', violations.length);
if (violations.length > 0) console.log('Samples:', [...new Set(violations)].slice(0, 10));
"
```

### 5.4 Invalidation Conditions
This survey report would be invalidated if:
1. New unlisted `.vue` components are introduced outside the cataloged 417 files.
2. The CSS variable architecture in `src/assets/index.css` deviates from the specified semantic token names (`rail`, `success`, `warning`, `info`, `tag-1`..`tag-6`).
