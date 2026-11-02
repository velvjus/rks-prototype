# Milestone 2: Holistic Integration Analysis & Implementation Blueprint (Batches 1 & 2)

**Author**: Explorer 3 (Holistic Integration & Verification)  
**Date**: 2026-10-30T10:52:00Z  
**Target Milestone**: Milestone 2 — App Shell & UI Components (Batches 1 & 2)  
**Recipient**: Parent Orchestrator (`57c50def-4689-4a65-86f1-14dce8a95cbf`)  

---

## 1. Observation

### 1.1 Build Baseline Verification
Execution of `cmd.exe /c "npm run build"` (`vue-tsc -b && vite build`):
- **Exit Code**: `0` (Success)
- **Duration**: `5.84s`
- **Modules Transformed**: `2,960`
- **Output Artifacts**: `dist/index.html` (1.51 kB), `dist/assets/index-euvbsshH.css` (401.07 kB), `dist/assets/index-DcLLWlKl.js` (2,359.95 kB).
- **TypeScript & CSS Errors**: Exactly `0`. The codebase build is completely green.

### 1.2 Audit Baseline: Batch 1 (App Shell)
Execution of `node scripts/audit-tokens.cjs --batch 1`:
- **Exit Code**: `1`
- **Scanned Files**: 9 files
- **Total Violations**: **318** across 8 non-compliant files:
  1. `src/layouts/MainLayout.vue` — **115 violations** (82 palette grays, 33 `dark:` overrides)
  2. `src/components/layout/AppShell.vue` — **3 violations** (3 palette grays: `bg-gray-50` lines 2, 6, 27)
  3. `src/components/layout/Sidebar.vue` — **3 violations** (3 palette grays: `bg-gray-950`, `border-gray-800` lines 3, 17)
  4. `src/components/layout/SidebarItem.vue` — **17 violations** (17 palette grays: `bg-gray-800`, `text-white`, `text-gray-300`, `ring-gray-400`, `text-gray-400`, `text-gray-500` lines 6, 7, 19, 36, 38, 43, 44, 50)
  5. `src/components/layout/SecondaryPanel.vue` — **20 violations** (17 palette grays, 2 hex classes, 1 status color: lines 12, 17, 18, 21, 35, 38, 51, 52, 61, 65, 73)
  6. `src/components/layout/TopNav.vue` — **102 violations** (69 palette grays, 2 hex classes, 31 status colors: lines 2, 7, 13, 14, 23, 28, 30, 44, 55, 58, 60, 61, 65, 75, 77, 80, 81, 83, 90, 92, 95, 96, 98, 105, 107, 110, 111, 113, 117, 122, 124, 127, 128, 130, 138, 140, 144, 146, 149, 151, 157, 160, 163, 165, 168, 175, 181, 182, 184, 185, 191, 192, 197, 200, 207)
  7. `src/components/omnichannel/InboxDropdown.vue` — **52 violations** (26 palette grays, 16 hex classes, 10 status colors: lines 71, 72, 75, 87, 105, 107, 116, 117, 120, 123, 130, 131, 134, 137, 144, 145, 148, 151, 158, 159, 162, 165, 169, 175, 176, 179, 182, 189, 190, 193, 196)
  8. `src/components/omnichannel/ToastNotifications.vue` — **6 violations** (3 palette grays, 3 hex classes: lines 27, 29, 30, 31, 36, 39, 42)
  9. `src/App.vue` — **0 violations** (Clean wrapper)
- **Violation Categories**: Palette Grays (221), `dark:` Overrides (33), Arbitrary Hex/RGB (23), Raw Status Colors (41).

### 1.3 Audit Baseline: Batch 2 (UI Components)
Execution of `node scripts/audit-tokens.cjs --batch 2`:
- **Exit Code**: `1`
- **Scanned Files**: 357 files across 48 component directories in `src/components/ui/`
- **Clean Files**: **350 files** (98%) have exactly 0 violations!
- **Total Violations**: **29** concentrated in exactly 7 files:
  1. `src/components/ui/alert/index.ts` — **1 violation** (redundant `dark:border-destructive` line 15)
  2. `src/components/ui/alert-dialog/AlertDialogContent.vue` — **1 violation** (`bg-black/80` overlay line 24)
  3. `src/components/ui/button/index.ts` — **23 violations** (`text-white`, `bg-[#23B750]`, `bg-[#1a943e]`, `from-[#23B750]`, `to-[#62D816]`, `bg-emerald-600`, `bg-emerald-700`, `bg-[#EF4444]`, `bg-[#DC2626]`, `bg-slate-900`, `hover:bg-slate-800`, `dark:bg-slate-800`, `border-slate-800` lines 12, 17, 18, 19, 20, 21)
  4. `src/components/ui/dialog/DialogContent.vue` — **1 violation** (`bg-black/80` overlay line 26)
  5. `src/components/ui/dialog/DialogScrollContent.vue` — **1 violation** (`bg-black/80` overlay line 26)
  6. `src/components/ui/drawer/DrawerOverlay.vue` — **1 violation** (`bg-black/80` overlay line 14)
  7. `src/components/ui/sheet/SheetContent.vue` — **1 violation** (`bg-black/80` overlay line 38)
- **Violation Categories**: Palette Grays (17), Tailwind Hex (6), `dark:` Overrides (4), Raw Status Colors (2).

### 1.4 Token Foundation Readiness (`src/assets/index.css` & `tailwind.config.js`)
Milestone 1 successfully established all necessary token foundations:
- **Dedicated Rail Tokens** (Dark-invariant in both light and dark):
  - `:root`: `--rail: oklch(0.13 0.028 261.692);`, `--rail-foreground: oklch(0.985 0 0);`, `--rail-muted-foreground: oklch(0.708 0 0);`, `--rail-border: oklch(0.269 0 0);`, `--rail-active: oklch(0.269 0 0);`
  - `.dark`: `--rail: oklch(0.12 0.02 260);`, `--rail-foreground: oklch(0.985 0 0);`, `--rail-muted-foreground: oklch(0.708 0 0);`, `--rail-border: oklch(1 0 0 / 10%);`, `--rail-active: oklch(0.269 0 0);`
  - `@theme inline`: `--color-rail`, `--color-rail-foreground`, `--color-rail-muted-foreground`, `--color-rail-border`, `--color-rail-active` mapped.
- **Sidebar Tokens** (Adaptive light/dark):
  - `:root`: `--sidebar: oklch(0.985 0 0);`, `--sidebar-foreground: oklch(0.145 0 0);`, `--sidebar-border: oklch(0.922 0 0);`
  - `.dark`: `--sidebar: oklch(0.205 0 0);`, `--sidebar-foreground: oklch(0.985 0 0);`, `--sidebar-border: oklch(1 0 0 / 10%);`
- **Semantic Status Tokens**: `--success`, `--warning`, `--info`, `--brand` and foregrounds present in both `:root` and `.dark`.
- **Categorical Tag Tokens**: `--tag-1` through `--tag-6` present in both `:root` and `.dark`.
- **Theme Composable**: `src/composables/useTheme.ts` provides `mode`, `isDark`, `setMode`, `toggleTheme`, reactive `watch` applying `.dark` to `document.documentElement`, localStorage persistence (`rks-theme` / `rks-dark`), and system media query sync.

---

## 2. Logic Chain

### 2.1 The Multi-Tier Shell Hierarchy & Theme Toggle Interaction
1. **Observation**: Currently `TopNav.vue` has no theme toggle button, and is hardcoded with `bg-gray-950 border-b border-gray-800`.
2. **Design Requirement**: When a user clicks the theme toggle button in `TopNav.vue`:
   - The toggle triggers `useTheme().toggleTheme()`.
   - `useTheme` adds/removes `.dark` on `document.documentElement`.
   - The multi-tier surface hierarchy must behave as follows:
     - **Navigation Rail (`Sidebar.vue`)**: Must remain a sleek, dark neutral rail in BOTH light and dark modes (`bg-rail text-rail-foreground border-rail-border`). Because `--rail` is dark OKLCH in `:root` and `.dark`, it maintains 100% brand consistency without raw colors.
     - **Secondary Flyout Panel (`SecondaryPanel.vue`)**: Must adapt dynamically to the theme (`bg-sidebar text-sidebar-foreground border-sidebar-border`). In light mode, `--sidebar` is clean white/light gray (`oklch(0.985 0 0)`); in dark mode, it is rich dark slate (`oklch(0.205 0 0)`). This creates clear depth separation from the outer rail.
     - **Top Header (`TopNav.vue`)**: Must adapt to the content theme (`bg-card text-card-foreground border-border`). In light mode, it renders a crisp light header with dark typography and primary brand accents; in dark mode, it renders an elevated dark header with subtle border demarcation.
     - **Main Content Canvas (`AppShell.vue`)**: Must transition between `bg-background` (`oklch(1 0 0)` in light, `oklch(0.145 0 0)` in dark).
3. **Inference**: By binding `Sidebar` to `rail` tokens, `SecondaryPanel` to `sidebar` tokens, and `TopNav` to `card`/`popover` tokens, toggling `.dark` on `document.documentElement` immediately achieves the intended multi-tiered contrast without a single line of component-level conditional JS or raw hex styles.

### 2.2 UI Components Integration (Batch 2)
1. **Observation**: 350 of 357 components in `src/components/ui/` are already pristine. The 29 violations are isolated in 7 files.
2. **Button Variants (`src/components/ui/button/index.ts`)**:
   - `destructive`: Replace `text-white` with `text-destructive-foreground`.
   - `primary`: Replace `bg-[#23B750] text-white hover:bg-[#1a943e]` with `bg-primary text-primary-foreground hover:bg-primary/90`.
   - `gradient`: Replace `from-[#23B750] to-[#62D816] text-white` with `bg-gradient-to-r from-primary to-brand-secondary text-primary-foreground`.
   - `success`: Replace `bg-emerald-600 text-white hover:bg-emerald-700` with `bg-success text-success-foreground hover:bg-success/90`.
   - `danger`: Replace `bg-[#EF4444] text-white hover:bg-[#DC2626]` with `bg-destructive text-destructive-foreground hover:bg-destructive/90`.
   - `dark`: Replace `bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-800 ...` with `bg-rail text-rail-foreground hover:bg-rail-active border border-rail-border`.
3. **Backdrop Overlays (`AlertDialogContent.vue`, `DialogContent.vue`, `DialogScrollContent.vue`, `DrawerOverlay.vue`, `SheetContent.vue`)**:
   - Currently all 5 files use `bg-black/80`.
   - `audit-tokens.cjs` flags `bg-black` under rule `paletteGrays`.
   - In light and dark mode, modal overlays should remain dark and translucent (dimming the page behind the modal).
   - `--rail` is `oklch(0.13 ...)` in light mode and `oklch(0.12 ...)` in dark mode.
   - Using `bg-rail/80 backdrop-blur-sm` satisfies both the visual requirement (dimmed page backdrop) and the token requirement (100% token-driven, 0 violations in `audit-tokens.cjs`).
4. **Alert Redundancy (`src/components/ui/alert/index.ts`)**:
   - Removing `dark:border-destructive` eliminates the redundant override and passes audit.

### 2.3 Popovers and Toasts Integration
1. **`InboxDropdown.vue`**:
   - Flyout container must use `bg-popover text-popover-foreground border-border`.
   - Active filter option uses `bg-primary/10 text-primary font-bold`.
   - Filter pill button uses `border-border bg-card text-card-foreground` when inactive, and `border-primary/30 bg-primary/10 text-primary` when filtered.
2. **`ToastNotifications.vue`**:
   - Toast container uses `bg-card text-card-foreground border-border shadow-lg`.
   - State indicator left borders use `border-l-success`, `border-l-info`, `border-l-warning`.
   - State icons use `text-success`, `text-info`, `text-warning`.
3. **`TopNav.vue` Dropdowns and Dialog**:
   - Help dropdown uses `bg-popover text-popover-foreground border-border`.
   - "How to use" dialog uses `DialogContent` with `bg-card text-card-foreground border-border`.

---

## 3. Caveats

1. **Standalone Prototypes Outside Vite Bundle**:
   - `html/setup-wizard.html`, `html/partner-register.html`, and `html/onboarding-wizard.html` are standalone HTML files with inline Tailwind CDN scripts. They are not part of the `npm run build` bundle and are not scanned by `audit-tokens.cjs`.
2. **`MainLayout.vue` Legacy Status vs Batch 1 Scope**:
   - `MainLayout.vue` is not rendered by `App.vue` (which renders `AppShell.vue`), but it is explicitly listed under Batch 1 in `audit-tokens.cjs` and user requirements. It must be migrated to zero violations to ensure the Batch 1 audit gate passes.
3. **Unovis Chart Token Binding**:
   - `src/components/ui/chart/index.ts` currently references `--vis-primary-color`. Milestone 6 specifically handles dynamic chart adaptation across ApexCharts and Unovis. Linking Unovis `defaultColors` to `var(--chart-1)` through `var(--chart-5)` in M2 prevents any future discrepancy.

---

## 4. Conclusion & Implementation Blueprint for the Worker

To complete Milestone 2 with 0 audit violations and 0 build errors, the Worker must execute modifications across the cataloged 15 files in two phases:

### Phase 1: Batch 2 (UI Components) — 7 Files (Remediate 29 Violations)

#### File 1: `src/components/ui/button/index.ts`
- **Lines 10–22**:
```typescript
<<<< BEFORE
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/85",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        primary: "bg-[#23B750] text-white hover:bg-[#1a943e] font-semibold transition-all",
        gradient: "bg-gradient-to-r from-[#23B750] to-[#62D816] text-white hover:opacity-95 font-bold transition-all",
        success: "bg-emerald-600 text-white hover:bg-emerald-700 font-semibold transition-all",
        danger: "bg-[#EF4444] text-white hover:bg-[#DC2626] font-semibold transition-all",
        dark: "bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-800 dark:border-slate-700 font-semibold transition-all",
==== AFTER
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/85",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        primary: "bg-primary text-primary-foreground hover:bg-primary/90 font-semibold transition-all",
        gradient: "bg-gradient-to-r from-primary to-brand-secondary text-primary-foreground hover:opacity-95 font-bold transition-all",
        success: "bg-success text-success-foreground hover:bg-success/90 font-semibold transition-all",
        danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90 font-semibold transition-all",
        dark: "bg-rail text-rail-foreground hover:bg-rail-active border border-rail-border font-semibold transition-all",
>>>>
```

#### File 2: `src/components/ui/alert/index.ts`
- **Line 15**:
```typescript
<<<< BEFORE
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
==== AFTER
        destructive:
          "border-destructive/50 text-destructive [&>svg]:text-destructive",
>>>>
```

#### Files 3 to 7: Modal & Overlay Backdrops
Replace `bg-black/80` with `bg-rail/80 backdrop-blur-sm`:
- `src/components/ui/alert-dialog/AlertDialogContent.vue` (Line 24):
  `class="fixed inset-0 z-50 bg-rail/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"`
- `src/components/ui/dialog/DialogContent.vue` (Line 26):
  `class="fixed inset-0 z-50 bg-rail/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"`
- `src/components/ui/dialog/DialogScrollContent.vue` (Line 26):
  `class="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-rail/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"`
- `src/components/ui/drawer/DrawerOverlay.vue` (Line 14):
  `<DrawerOverlay v-bind="delegatedProps" :class="cn('fixed inset-0 z-50 bg-rail/80 backdrop-blur-sm', props.class)" />`
- `src/components/ui/sheet/SheetContent.vue` (Line 38):
  `class="fixed inset-0 z-50 bg-rail/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"`

---

### Phase 2: Batch 1 (App Shell) — 8 Files (Remediate 318 Violations)

#### File 8: `src/components/layout/AppShell.vue`
- Replace `bg-gray-50` on lines 2, 6, and 27 with `bg-background`:
```html
<<<< BEFORE
  <div v-if="route.meta.standalone" class="h-screen w-full overflow-y-auto bg-gray-50 font-sans">
...
  <div v-else class="h-screen w-full flex flex-col bg-gray-50 overflow-hidden font-sans">
...
      <main :class="['flex-1 bg-gray-50 transition-all duration-200 relative', route.meta.fullWidth ? 'overflow-hidden h-full max-h-full flex flex-col min-h-0' : 'overflow-y-auto [scrollbar-gutter:stable]']">
==== AFTER
  <div v-if="route.meta.standalone" class="h-screen w-full overflow-y-auto bg-background font-sans">
...
  <div v-else class="h-screen w-full flex flex-col bg-background overflow-hidden font-sans">
...
      <main :class="['flex-1 bg-background transition-all duration-200 relative', route.meta.fullWidth ? 'overflow-hidden h-full max-h-full flex flex-col min-h-0' : 'overflow-y-auto [scrollbar-gutter:stable]']">
>>>>
```

#### File 9: `src/components/layout/Sidebar.vue`
- Replace rail container and divider neutrals with rail tokens (lines 3, 17):
```html
<<<< BEFORE
  <nav
    class="bg-gray-950 flex flex-col h-full border-r border-gray-800 shrink-0 transition-all duration-200 z-[60]"
    :class="ui.isSidebarCollapsed ? 'w-[58px]' : 'w-[210px]'"
  >
...
      <div class="my-1.5 border-t border-gray-800"></div>
==== AFTER
  <nav
    class="bg-rail flex flex-col h-full border-r border-rail-border shrink-0 transition-all duration-200 z-[60]"
    :class="ui.isSidebarCollapsed ? 'w-[58px]' : 'w-[210px]'"
  >
...
      <div class="my-1.5 border-t border-rail-border"></div>
>>>>
```

#### File 10: `src/components/layout/SidebarItem.vue`
- Replace hardcoded item colors with `rail` tokens:
```html
<<<< BEFORE
    :class="[
      selected
        ? 'bg-gray-800 text-white'
        : 'text-gray-300 hover:bg-gray-800/60 hover:text-white focus-visible:ring-2 focus-visible:ring-gray-400',
      isCollapsed ? 'px-0 justify-center' : 'px-2.5',
    ]"
...
      :class="[
        selected ? 'text-white' : 'text-gray-400 group-hover:text-gray-300',
        isCollapsed ? '' : 'mr-2',
      ]"
...
      <span
        v-if="item.badge"
        class="ml-2 px-1.5 py-0.5 text-[10px] bg-gray-800 rounded-full text-gray-300 group-hover:text-white"
        :class="selected ? 'text-white' : ''"
      >
...
      <ChevronRight v-if="item.hasSubmenu && !selected" class="w-4 h-4 ml-auto text-gray-500 transition-transform duration-150" />
      <ChevronDown v-if="item.hasSubmenu && selected" class="w-4 h-4 ml-auto text-white transition-transform duration-150" />
...
    <div
      v-if="isCollapsed && isHovered"
      class="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg whitespace-nowrap z-50"
    >
==== AFTER
    :class="[
      selected
        ? 'bg-rail-active text-rail-foreground'
        : 'text-rail-muted-foreground hover:bg-rail-active/60 hover:text-rail-foreground focus-visible:ring-2 focus-visible:ring-rail-muted-foreground',
      isCollapsed ? 'px-0 justify-center' : 'px-2.5',
    ]"
...
      :class="[
        selected ? 'text-rail-foreground' : 'text-rail-muted-foreground group-hover:text-rail-foreground',
        isCollapsed ? '' : 'mr-2',
      ]"
...
      <span
        v-if="item.badge"
        class="ml-2 px-1.5 py-0.5 text-[10px] bg-rail-active rounded-full text-rail-muted-foreground group-hover:text-rail-foreground"
        :class="selected ? 'text-rail-foreground' : ''"
      >
...
      <ChevronRight v-if="item.hasSubmenu && !selected" class="w-4 h-4 ml-auto text-rail-muted-foreground transition-transform duration-150" />
      <ChevronDown v-if="item.hasSubmenu && selected" class="w-4 h-4 ml-auto text-rail-foreground transition-transform duration-150" />
...
    <div
      v-if="isCollapsed && isHovered"
      class="absolute left-full ml-2 px-2 py-1 bg-rail-active text-rail-foreground border border-rail-border text-xs rounded shadow-lg whitespace-nowrap z-50"
    >
>>>>
```

#### File 11: `src/components/layout/SecondaryPanel.vue`
- Migrate panel to semantic `sidebar` and `primary` tokens (lines 12–75):
```html
<<<< BEFORE
    <aside
      v-if="isOpen"
      class="absolute top-0 bottom-0 bg-gray-950 border-r border-gray-800 flex flex-col z-40 shadow-2xl transition-all duration-200"
...
      <div class="h-10 px-3 flex items-center justify-between border-b border-gray-800 shrink-0">
        <h2 class="text-xs font-bold text-white uppercase tracking-wider">{{ title }}</h2>
        <button
          @click="$emit('close')"
          class="p-1 text-gray-400 hover:text-white rounded transition-colors"
...
              class="px-2.5 py-1 text-[9px] font-bold text-gray-500 uppercase tracking-widest flex items-center justify-between"
...
                <span v-if="group.badge" class="bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded text-[8px]">
...
              :class="[
                item.route && route.path === item.route
                  ? 'bg-emerald-950/60 text-[#23B750] font-semibold'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white',
                item.undesigned ? 'opacity-80' : ''
              ]"
...
                  item.route && route.path === item.route ? 'text-[#23B750]' : 'text-gray-500 group-hover:text-gray-300'
...
              <span v-if="group.badge" class="ml-2 bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded text-[8px]">
...
        <div v-else class="p-4 text-gray-500 text-sm italic">
==== AFTER
    <aside
      v-if="isOpen"
      class="absolute top-0 bottom-0 bg-sidebar border-r border-sidebar-border flex flex-col z-40 shadow-2xl transition-all duration-200"
...
      <div class="h-10 px-3 flex items-center justify-between border-b border-sidebar-border shrink-0">
        <h2 class="text-xs font-bold text-sidebar-foreground uppercase tracking-wider">{{ title }}</h2>
        <button
          @click="$emit('close')"
          class="p-1 text-muted-foreground hover:text-sidebar-foreground rounded transition-colors"
...
              class="px-2.5 py-1 text-[9px] font-bold text-muted-foreground uppercase tracking-widest flex items-center justify-between"
...
                <span v-if="group.badge" class="bg-sidebar-accent text-sidebar-accent-foreground px-1.5 py-0.5 rounded text-[8px]">
...
              :class="[
                item.route && route.path === item.route
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                item.undesigned ? 'opacity-80' : ''
              ]"
...
                  item.route && route.path === item.route ? 'text-primary' : 'text-muted-foreground group-hover:text-sidebar-foreground'
...
              <span v-if="group.badge" class="ml-2 bg-sidebar-accent text-sidebar-accent-foreground px-1.5 py-0.5 rounded text-[8px]">
...
        <div v-else class="p-4 text-muted-foreground text-sm italic">
>>>>
```

#### File 12: `src/components/layout/TopNav.vue`
- Migrate header shell to `bg-card border-border text-card-foreground`.
- Add `useTheme()` theme toggle button with `Sun` and `Moon` icons right beside `CircleHelp` in the right cluster:
```typescript
import { useTheme } from '@/composables/useTheme';
import { Sun, Moon } from 'lucide-vue-next';
const { isDark, toggleTheme } = useTheme();
```
```html
<!-- Theme Toggle Button -->
<button
  @click="toggleTheme"
  class="relative p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
  :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
  :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
>
  <Sun v-if="isDark" class="w-[18px] h-[18px] transition-transform duration-200 rotate-0 hover:rotate-45" />
  <Moon v-else class="w-[18px] h-[18px] transition-transform duration-200 -rotate-12 hover:rotate-0" />
</button>
```
- Replace hardcoded header styles:
  - Header: `h-[52px] bg-card border-b border-border flex items-center justify-between px-4 shrink-0 z-[60]`
  - Sidebar toggle button: `text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring`
  - Logo text: `<span class="text-foreground font-bold text-base tracking-tight select-none"><span class="text-primary">Rakan</span><span class="text-brand-secondary">Sales</span></span>`
  - Search input: `bg-muted/50 border border-border rounded-full text-xs text-foreground placeholder:text-muted-foreground focus:border-ring focus:bg-background outline-none transition-colors`
  - Dropdown content: `bg-popover border border-border text-popover-foreground shadow-xl rounded-xl p-1.5 z-[70]`
  - Badges & items: `bg-success/10 text-success border border-success/20`, `bg-info/10 text-info border border-info/20`, `bg-tag-4 text-tag-4-foreground border border-tag-4/20`.
  - Notification indicator ring: `ring-card`.
  - Avatar: `bg-primary/20 text-primary font-medium text-xs flex items-center justify-center`.
  - Dialog modal: `bg-card border border-border text-card-foreground p-6 rounded-2xl shadow-2xl z-[80]`.

#### File 13: `src/components/omnichannel/InboxDropdown.vue`
- Migrate button filter and dropdown overlay (lines 71–197):
  - Filter button active: `border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 font-bold`
  - Filter button inactive: `border-border bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground hover:border-input`
  - Dropdown container: `fixed w-52 bg-popover text-popover-foreground border border-border rounded-2xl z-[999] py-2 shadow-lg focus:outline-none select-none`
  - Items hover: `hover:bg-accent hover:text-accent-foreground`
  - Selected item: `text-primary font-bold bg-primary/10`
  - Divider: `border-border`
  - Dots:
    - All: `border border-border bg-background`
    - Mine: `bg-primary`
    - Participating: `bg-info`
    - Unassigned: `bg-muted-foreground`
    - Resolved: `bg-muted-foreground/60`
    - Archived: `bg-warning`

#### File 14: `src/components/omnichannel/ToastNotifications.vue`
- Migrate toast stack (lines 27–42):
  - Card: `pointer-events-auto flex items-center gap-3 px-4 py-3 bg-card rounded-xl border border-border text-sm font-medium text-card-foreground shadow-lg overflow-hidden`
  - Type borders:
    - `'border-l-4 border-l-success': toast.type === 'success'`
    - `'border-l-4 border-l-info': toast.type === 'info'`
    - `'border-l-4 border-l-warning': toast.type === 'warning'`
  - Type icon colors: `text-success`, `text-info`, `text-warning`.

#### File 15: `src/layouts/MainLayout.vue`
- Replace local `isDark` / `applyDark` state with `import { useTheme } from '@/composables/useTheme'; const { isDark, toggleTheme: toggleDark } = useTheme();`.
- Replace all 115 violations:
  - Outer rail: `bg-rail`, `border-rail-border`, `text-rail-foreground`, `text-rail-muted-foreground`, `bg-rail-active`.
  - Secondary / inner sidebar: `bg-sidebar text-sidebar-foreground border-sidebar-border`.
  - Main container: `bg-background`.
  - Header: `bg-card text-card-foreground border-border`.
  - Delete all 33 `dark:` overrides (`dark:bg-background`, `dark:bg-card`, `dark:border-border`, etc.).

---

## 5. Verification Method

### 5.1 Step-by-Step Verification Commands
1. **Audit Verification for Batch 1**:
   ```bash
   node scripts/audit-tokens.cjs --batch 1
   ```
   **Pass Condition**: `TOTAL VIOLATIONS: 0`, process exits with code `0`.

2. **Audit Verification for Batch 2**:
   ```bash
   node scripts/audit-tokens.cjs --batch 2
   ```
   **Pass Condition**: `TOTAL VIOLATIONS: 0`, process exits with code `0`.

3. **Build & Typecheck Integrity Gate**:
   ```powershell
   cmd.exe /c "npm run build"
   ```
   **Pass Condition**: `vue-tsc -b && vite build` exits with code `0` and 0 errors.

4. **Runtime Theme Toggling Verification**:
   - Serve application: `npm run dev` or `npm run preview`.
   - Click the theme toggle button in `TopNav.vue`.
   - Verify:
     - `document.documentElement` toggles `.dark`.
     - `localStorage.getItem('rks-theme')` updates to `'dark'` or `'light'`.
     - Navigation rail (`Sidebar.vue`) remains invariant dark neutral (`bg-rail`).
     - Secondary panel (`SecondaryPanel.vue`) switches between light (`bg-sidebar`) and dark.
     - Top header (`TopNav.vue`) transitions cleanly between light and dark surfaces.
     - Toast notifications and dropdowns retain crisp legibility and high contrast in both themes.

### 5.2 Invalidation Conditions
This report and implementation plan would be invalidated if:
1. Any file in Batch 1 or Batch 2 retains a raw palette class (`gray-*`, `slate-*`, `zinc-*`, `white`, `black`) or arbitrary hex class (`bg-[#...]`).
2. The outer rail (`Sidebar.vue`) flips to white in light mode.
3. The build command fails with TypeScript compilation or CSS parsing errors.
