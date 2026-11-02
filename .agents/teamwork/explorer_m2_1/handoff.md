# Batch 1 (App Shell) Deep Investigation & Token Replacement Blueprint

**Explorer Report**: Explorer 1 (`explorer_m2_1`)  
**Target Recipient**: Parent Orchestrator (`57c50def-4689-4a65-86f1-14dce8a95cbf`) & Implementer Agent  
**Milestone**: Milestone 2: App Shell & UI Components (Batches 1 & 2)  
**Date**: 2026-10-30T10:50:00Z  

---

## 1. Observation

### 1.1 Automated Audit Command & Results
Running the canonical token audit command:
```powershell
node scripts/audit-tokens.cjs --batch 1
```
Resulted in **318 total violations** detected across 8 files in Batch 1:

| # | File Path | Total Lines | Palette Grays | Tailwind Hex | Status Colors | `dark:` Overrides | Total Violations |
|---|---|---|---|---|---|---|---|
| 1 | `src/layouts/MainLayout.vue` | 506 | 82 | 0 | 0 | 33 | **115** |
| 2 | `src/components/layout/TopNav.vue` | 527 | 70 | 2 | 30 | 0 | **102** |
| 3 | `src/components/omnichannel/InboxDropdown.vue` | 204 | 26 | 16 | 10 | 0 | **52** |
| 4 | `src/components/layout/SecondaryPanel.vue` | 409 | 17 | 2 | 1 | 0 | **20** |
| 5 | `src/components/layout/SidebarItem.vue` | 81 | 17 | 0 | 0 | 0 | **17** |
| 6 | `src/components/omnichannel/ToastNotifications.vue` | 49 | 3 | 3 | 0 | 0 | **6** |
| 7 | `src/components/layout/AppShell.vue` | 66 | 3 | 0 | 0 | 0 | **3** |
| 8 | `src/components/layout/Sidebar.vue` | 133 | 3 | 0 | 0 | 0 | **3** |
| 9 | `src/App.vue` | 20 | 0 | 0 | 0 | 0 | **0** |
| | **TOTALS** | **2,015** | **221** | **23** | **41** | **33** | **318** |

### 1.2 Codemod Dry-Run Analysis
Running the automated codemod dry-run tool:
```powershell
node scripts/codemod-tokens.cjs --batch 1 --dry-run
```
Output:
- `src/layouts/MainLayout.vue`: 20 replacement(s)
- `src/components/layout/SecondaryPanel.vue`: 2 replacement(s)
- `src/components/layout/TopNav.vue`: 4 replacement(s)
- `src/components/omnichannel/InboxDropdown.vue`: 16 replacement(s)
- `src/components/omnichannel/ToastNotifications.vue`: 1 replacement(s)
- **Total automated replacements: 43 out of 318 violations (13.5%)**.

The dry run proves that regex-based codemod only captures a small fraction of repetitive pairs (e.g. `bg-white dark:bg-card`). The remaining **275 violations** (86.5%) consist of:
1. **Outer rail classes** (`bg-gray-950`, `border-gray-800`, `bg-gray-800`, `text-gray-300`, `text-gray-400`, `text-white`) which require semantic mapping to dedicated rail tokens (`bg-rail`, `border-rail-border`, `bg-rail-active`, `text-rail-foreground`, `text-rail-muted-foreground`).
2. **Hardcoded status colors & arbitrary hexes** in `TopNav.vue` and `InboxDropdown.vue` (`bg-emerald-50`, `text-emerald-700`, `border-emerald-200`, `bg-blue-50`, `text-purple-600`, `bg-indigo-500`, `bg-amber-400`).
3. **App shell background containers** (`bg-gray-50`) in `AppShell.vue`.
4. **Toast notification borders and icon colors** in `ToastNotifications.vue`.
5. **Secondary panel scoped scrollbar styles** in `SecondaryPanel.vue`.

### 1.3 Available Foundation Tokens in `src/assets/index.css`
Verified that Milestone 1 established the required CSS variables and `@theme inline` mappings:
- Outer Rail tokens:
  - `--rail: oklch(0.13 0.028 261.692)` (light) / `oklch(0.12 0.02 260)` (dark) -> class `bg-rail`
  - `--rail-foreground: oklch(0.985 0 0)` -> class `text-rail-foreground`
  - `--rail-muted-foreground: oklch(0.708 0 0)` -> class `text-rail-muted-foreground`
  - `--rail-border: oklch(0.269 0 0)` / `oklch(1 0 0 / 10%)` -> class `border-rail-border`
  - `--rail-active: oklch(0.269 0 0)` -> class `bg-rail-active`
- Semantic Status tokens:
  - `--success` / `--success-foreground` -> class `bg-success`, `text-success`, `border-success/20`, `bg-success/10`
  - `--warning` / `--warning-foreground` -> class `bg-warning`, `text-warning`, `border-warning/20`, `bg-warning/10`
  - `--info` / `--info-foreground` -> class `bg-info`, `text-info`, `border-info/20`, `bg-info/10`
  - `--destructive` / `--destructive-foreground` -> class `bg-destructive`, `text-destructive`, `border-destructive/20`
- Brand tokens:
  - `--primary` / `--primary-foreground` -> class `bg-primary`, `text-primary`, `border-primary`
  - `--brand-secondary: oklch(0.81 0.22 135)` -> class `text-brand-secondary` (for "Sales" logo lockup)
- Tag tokens:
  - `--tag-1` through `--tag-6` with paired foregrounds (e.g. `--tag-4` is purple/violet) -> class `text-tag-4-foreground`, `bg-tag-4`
- Theme Composable:
  - `src/composables/useTheme.ts` exposes `mode`, `isDark`, `setMode`, `toggleTheme`.
- Build Baseline:
  - `cmd /c npm run build` compiles with **0 errors** (2,960 modules transformed).

---

## 2. Logic Chain

1. **Duality of Navigation Rails in Batch 1**:
   - `Sidebar.vue`, `SidebarItem.vue`, `SecondaryPanel.vue`, and the outer rail in `MainLayout.vue` and `TopNav.vue` are designed to maintain a consistent dark aesthetic regardless of whether the application is in light or dark theme.
   - Using standard `bg-card` or `bg-background` would invert the outer rail to pure white in light mode, violating product requirements.
   - Dedicated rail tokens (`bg-rail`, `border-rail-border`, `text-rail-foreground`, `text-rail-muted-foreground`, `bg-rail-active`) provide the exact semantic abstraction required by `AGENTS.md` while remaining dark in both `:root` and `.dark` scopes.
2. **Elimination of `dark:` Class Overrides**:
   - `MainLayout.vue` contains 33 instances of `dark:` classes (e.g. `bg-white dark:bg-card`, `border-gray-200 dark:border-border`, `text-gray-800 dark:text-foreground`).
   - By replacing the pair with the semantic token class directly (`bg-card`, `border-border`, `text-foreground`), the component is automatically theme-reactive via CSS variables without any `dark:` modifier in the template.
3. **TopNav Theme Toggle Integration**:
   - `TopNav.vue` currently lacks a theme switch. Users cannot toggle dark mode from the standard application header.
   - By importing `useTheme` from `@/composables/useTheme` and `Sun`, `Moon` from `lucide-vue-next`, a discrete theme toggle button placed in the header right cluster (next to Help and Notifications) gives immediate control over the global theme.
4. **De-duplicating Theme Logic in `MainLayout.vue`**:
   - `MainLayout.vue` previously implemented its own private `isDark = ref(localStorage.getItem('rks-dark') === 'true')` and `applyDark` function.
   - This must be replaced with `const { isDark, toggleTheme } = useTheme()` to ensure single-source-of-truth synchronization across all views, headers, and tabs.
5. **Popovers, Dropdowns, and Dialogs**:
   - Dropdowns (`InboxDropdown.vue`, Help dropdown in `TopNav.vue`) and modals (How-To-Use dialog in `TopNav.vue`) currently have hardcoded `bg-white border-gray-200 text-gray-900`.
   - In dark mode, these floating panels must use `bg-popover` (or `bg-card`), `border-border`, and `text-popover-foreground` (`text-foreground`).

---

## 3. Caveats

1. **Codemod vs Manual Precision**:
   Running `node scripts/codemod-tokens.cjs --batch 1` will automatically apply 43 replacements. However, because the remaining 275 replacements require contextual token choices (e.g. distinguishing `bg-rail` for navigation rails vs `bg-background` for page canvas vs `bg-card` for popovers), the implementer agent should follow the explicit line-by-line instructions provided below.
2. **`TopNav.vue` Logo Lockup**:
   `<span class="text-[#23B750]">Rakan</span><span class="text-[#62D816]">Sales</span>` must be replaced with `<span class="text-primary">Rakan</span><span class="text-brand-secondary">Sales</span>`. Both `--color-primary` and `--color-brand-secondary` are defined in `@theme inline` in `index.css`.
3. **`SecondaryPanel.vue` Scoped `<style>` Block**:
   Lines 402 and 406 have hardcoded `#1f2937` and `#374151` in scrollbar thumb styles. These should be replaced with `var(--rail-active)` and `var(--rail-muted-foreground)`.
4. **`App.vue` Scope**:
   `src/App.vue` was scanned and audited; it has 0 violations and requires no modifications.

---

## 4. Conclusion & Line-by-Line Implementation Plan

Below is the complete, exact line-by-line plan for the implementer agent to achieve **0 audit violations** across all 8 files in Batch 1.

---

### 4.1 `src/components/layout/AppShell.vue` (3 Violations)

Replace all 3 occurrences of `bg-gray-50` with `bg-background`:

- **Line 2**:
  ```html
  <!-- Before -->
  <div v-if="route.meta.standalone" class="h-screen w-full overflow-y-auto bg-gray-50 font-sans">
  <!-- After -->
  <div v-if="route.meta.standalone" class="h-screen w-full overflow-y-auto bg-background font-sans">
  ```
- **Line 6**:
  ```html
  <!-- Before -->
  <div v-else class="h-screen w-full flex flex-col bg-gray-50 overflow-hidden font-sans">
  <!-- After -->
  <div v-else class="h-screen w-full flex flex-col bg-background overflow-hidden font-sans">
  ```
- **Line 27**:
  ```html
  <!-- Before -->
  <main :class="['flex-1 bg-gray-50 transition-all duration-200 relative', route.meta.fullWidth ? 'overflow-hidden h-full max-h-full flex flex-col min-h-0' : 'overflow-y-auto [scrollbar-gutter:stable]']">
  <!-- After -->
  <main :class="['flex-1 bg-background transition-all duration-200 relative', route.meta.fullWidth ? 'overflow-hidden h-full max-h-full flex flex-col min-h-0' : 'overflow-y-auto [scrollbar-gutter:stable]']">
  ```

---

### 4.2 `src/components/layout/Sidebar.vue` (3 Violations)

Replace outer rail classes with dedicated rail tokens:

- **Line 3**:
  ```html
  <!-- Before -->
  class="bg-gray-950 flex flex-col h-full border-r border-gray-800 shrink-0 transition-all duration-200 z-[60]"
  <!-- After -->
  class="bg-rail flex flex-col h-full border-r border-rail-border shrink-0 transition-all duration-200 z-[60]"
  ```
- **Line 17**:
  ```html
  <!-- Before -->
  <div class="my-1.5 border-t border-gray-800"></div>
  <!-- After -->
  <div class="my-1.5 border-t border-rail-border"></div>
  ```

---

### 4.3 `src/components/layout/SidebarItem.vue` (17 Violations)

Replace rail item text, background, and hover classes with dedicated rail tokens:

- **Lines 4–8**:
  ```html
  <!-- Before -->
  :class="[
    selected
      ? 'bg-gray-800 text-white'
      : 'text-gray-300 hover:bg-gray-800/60 hover:text-white focus-visible:ring-2 focus-visible:ring-gray-400',
    isCollapsed ? 'px-0 justify-center' : 'px-2.5',
  ]"
  <!-- After -->
  :class="[
    selected
      ? 'bg-rail-active text-rail-foreground'
      : 'text-rail-muted-foreground hover:bg-rail-active/60 hover:text-rail-foreground focus-visible:ring-2 focus-visible:ring-rail-muted-foreground',
    isCollapsed ? 'px-0 justify-center' : 'px-2.5',
  ]"
  ```
- **Line 19**:
  ```html
  <!-- Before -->
  selected ? 'text-white' : 'text-gray-400 group-hover:text-gray-300',
  <!-- After -->
  selected ? 'text-rail-foreground' : 'text-rail-muted-foreground group-hover:text-rail-foreground',
  ```
- **Lines 36–38**:
  ```html
  <!-- Before -->
  class="ml-2 px-1.5 py-0.5 text-[10px] bg-gray-800 rounded-full text-gray-300 group-hover:text-white"
  :class="selected ? 'text-white' : ''"
  <!-- After -->
  class="ml-2 px-1.5 py-0.5 text-[10px] bg-rail-active rounded-full text-rail-muted-foreground group-hover:text-rail-foreground"
  :class="selected ? 'text-rail-foreground' : ''"
  ```
- **Line 43**:
  ```html
  <!-- Before -->
  <ChevronRight v-if="item.hasSubmenu && !selected" class="w-4 h-4 ml-auto text-gray-500 transition-transform duration-150" />
  <!-- After -->
  <ChevronRight v-if="item.hasSubmenu && !selected" class="w-4 h-4 ml-auto text-rail-muted-foreground transition-transform duration-150" />
  ```
- **Line 44**:
  ```html
  <!-- Before -->
  <ChevronDown v-if="item.hasSubmenu && selected" class="w-4 h-4 ml-auto text-white transition-transform duration-150" />
  <!-- After -->
  <ChevronDown v-if="item.hasSubmenu && selected" class="w-4 h-4 ml-auto text-rail-foreground transition-transform duration-150" />
  ```
- **Line 50**:
  ```html
  <!-- Before -->
  class="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg whitespace-nowrap z-50"
  <!-- After -->
  class="absolute left-full ml-2 px-2 py-1 bg-rail-active text-rail-foreground text-xs rounded shadow-lg whitespace-nowrap z-50"
  ```

---

### 4.4 `src/components/layout/SecondaryPanel.vue` (20 Violations)

Replace all hardcoded gray, emerald, and hex classes with rail and semantic tokens:

- **Line 12**:
  ```html
  <!-- Before -->
  class="absolute top-0 bottom-0 bg-gray-950 border-r border-gray-800 flex flex-col z-40 shadow-2xl transition-all duration-200"
  <!-- After -->
  class="absolute top-0 bottom-0 bg-rail border-r border-rail-border flex flex-col z-40 shadow-2xl transition-all duration-200"
  ```
- **Line 17**:
  ```html
  <!-- Before -->
  <div class="h-10 px-3 flex items-center justify-between border-b border-gray-800 shrink-0">
  <!-- After -->
  <div class="h-10 px-3 flex items-center justify-between border-b border-rail-border shrink-0">
  ```
- **Line 18**:
  ```html
  <!-- Before -->
  <h2 class="text-xs font-bold text-white uppercase tracking-wider">{{ title }}</h2>
  <!-- After -->
  <h2 class="text-xs font-bold text-rail-foreground uppercase tracking-wider">{{ title }}</h2>
  ```
- **Line 21**:
  ```html
  <!-- Before -->
  class="p-1 text-gray-400 hover:text-white rounded transition-colors"
  <!-- After -->
  class="p-1 text-rail-muted-foreground hover:text-rail-foreground rounded transition-colors"
  ```
- **Line 35**:
  ```html
  <!-- Before -->
  class="px-2.5 py-1 text-[9px] font-bold text-gray-500 uppercase tracking-widest flex items-center justify-between"
  <!-- After -->
  class="px-2.5 py-1 text-[9px] font-bold text-rail-muted-foreground uppercase tracking-widest flex items-center justify-between"
  ```
- **Line 38**:
  ```html
  <!-- Before -->
  <span v-if="group.badge" class="bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded text-[8px]">
  <!-- After -->
  <span v-if="group.badge" class="bg-rail-active text-rail-muted-foreground px-1.5 py-0.5 rounded text-[8px]">
  ```
- **Lines 50–53**:
  ```html
  <!-- Before -->
  :class="[
    item.route && route.path === item.route
      ? 'bg-emerald-950/60 text-[#23B750] font-semibold'
      : 'text-gray-300 hover:bg-gray-800 hover:text-white',
    item.undesigned ? 'opacity-80' : ''
  ]"
  <!-- After -->
  :class="[
    item.route && route.path === item.route
      ? 'bg-primary/20 text-primary font-semibold'
      : 'text-rail-muted-foreground hover:bg-rail-active hover:text-rail-foreground',
    item.undesigned ? 'opacity-80' : ''
  ]"
  ```
- **Lines 60–62**:
  ```html
  <!-- Before -->
  :class="[
    'w-[15px] h-[15px] mr-1.5 shrink-0',
    item.route && route.path === item.route ? 'text-[#23B750]' : 'text-gray-500 group-hover:text-gray-300'
  ]"
  <!-- After -->
  :class="[
    'w-[15px] h-[15px] mr-1.5 shrink-0',
    item.route && route.path === item.route ? 'text-primary' : 'text-rail-muted-foreground group-hover:text-rail-foreground'
  ]"
  ```
- **Line 65**:
  ```html
  <!-- Before -->
  <span v-if="item.badge" class="ml-2 bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded text-[8px]">
  <!-- After -->
  <span v-if="item.badge" class="ml-2 bg-rail-active text-rail-muted-foreground px-1.5 py-0.5 rounded text-[8px]">
  ```
- **Line 73**:
  ```html
  <!-- Before -->
  <div v-else class="p-4 text-gray-500 text-sm italic">
  <!-- After -->
  <div v-else class="p-4 text-rail-muted-foreground text-sm italic">
  ```
- **Lines 402 and 406** (`<style scoped>`):
  ```css
  /* Before */
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #1f2937;
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #374151;
  }
  /* After */
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: var(--rail-active);
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: var(--rail-muted-foreground);
  }
  ```

---

### 4.5 `src/components/layout/TopNav.vue` (102 Violations + Theme Toggle)

#### 4.5.1 Theme Toggle Integration
1. **Script Additions**:
   ```typescript
   // In <script setup lang="ts">:
   import { Sun, Moon, ... } from 'lucide-vue-next'; // Add Sun, Moon to imports
   import { useTheme } from '@/composables/useTheme';

   const theme = useTheme();
   ```
2. **Template Button Addition** (Insert right before the notification utility button around line 137):
   ```html
   <!-- Theme Toggle Button -->
   <button
     @click="theme.toggleTheme()"
     class="relative p-1.5 text-rail-muted-foreground hover:text-rail-foreground rounded-full hover:bg-rail-active transition-colors outline-none focus-visible:ring-2 focus-visible:ring-rail-muted-foreground cursor-pointer"
     :title="theme.isDark.value ? 'Switch to light mode' : 'Switch to dark mode'"
     aria-label="Toggle theme"
   >
     <Sun v-if="theme.isDark.value" class="w-[18px] h-[18px]" />
     <Moon v-else class="w-[18px] h-[18px]" />
   </button>
   ```

#### 4.5.2 Complete Header & Popup Tokenization
- **Line 2**:
  `class="h-[52px] bg-gray-950 border-b border-gray-800 flex items-center justify-between px-4 shrink-0 z-[60]"` ->
  `class="h-[52px] bg-rail border-b border-rail-border flex items-center justify-between px-4 shrink-0 z-[60]"`
- **Line 7**:
  `class="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-gray-400"` ->
  `class="p-1.5 text-rail-muted-foreground hover:text-rail-foreground rounded-lg hover:bg-rail-active transition-colors outline-none focus-visible:ring-2 focus-visible:ring-rail-muted-foreground"`
- **Lines 13–15**:
  ```html
  <!-- Before -->
  <span class="text-white font-bold text-base tracking-tight select-none">
    <span class="text-[#23B750]">Rakan</span><span class="text-[#62D816]">Sales</span>
  </span>
  <!-- After -->
  <span class="text-rail-foreground font-bold text-base tracking-tight select-none">
    <span class="text-primary">Rakan</span><span class="text-brand-secondary">Sales</span>
  </span>
  ```
- **Line 23**:
  `<Search class="h-3.5 w-3.5 text-gray-400" />` -> `<Search class="h-3.5 w-3.5 text-rail-muted-foreground" />`
- **Line 28**:
  ```html
  <!-- Before -->
  class="block w-full pl-9 pr-12 py-1.5 bg-gray-800 border-transparent rounded-full text-xs text-white placeholder-gray-400 focus:border-gray-600 focus:bg-gray-700 focus:ring-0 outline-none transition-colors"
  <!-- After -->
  class="block w-full pl-9 pr-12 py-1.5 bg-rail-active border-transparent rounded-full text-xs text-rail-foreground placeholder:text-rail-muted-foreground focus:border-rail-border focus:bg-rail-active focus:ring-0 outline-none transition-colors"
  ```
- **Line 32**:
  `text-[10px] text-gray-500 font-medium tracking-widest` -> `text-[10px] text-rail-muted-foreground font-medium tracking-widest`
- **Lines 43–44**:
  ```html
  <!-- Before -->
  class="relative p-1.5 rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-gray-400 cursor-pointer"
  :class="isHelpDropdownOpen ? 'text-white bg-gray-800 ring-1 ring-gray-700' : 'text-gray-400 hover:text-white hover:bg-gray-800'"
  <!-- After -->
  class="relative p-1.5 rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-rail-muted-foreground cursor-pointer"
  :class="isHelpDropdownOpen ? 'text-rail-foreground bg-rail-active ring-1 ring-rail-border' : 'text-rail-muted-foreground hover:text-rail-foreground hover:bg-rail-active'"
  ```
- **Line 55**:
  `class="w-72 bg-white border border-gray-200 text-gray-800 shadow-xl rounded-xl p-1.5 z-[70]"` ->
  `class="w-72 bg-popover border border-border text-popover-foreground shadow-xl rounded-xl p-1.5 z-[70]"`
- **Line 58**:
  `<div class="px-2.5 py-2 border-b border-gray-100 mb-1">` -> `<div class="px-2.5 py-2 border-b border-border mb-1">`
- **Line 60**:
  `text-[10px] font-bold text-gray-500 uppercase tracking-wider` -> `text-[10px] font-bold text-muted-foreground uppercase tracking-wider`
- **Line 61**:
  `bg-emerald-50 text-emerald-700 border border-emerald-200` -> `bg-success/10 text-success border border-success/20`
- **Line 65**:
  `text-[11px] text-gray-600 mt-1 line-clamp-2 leading-relaxed` -> `text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed`
- **Lines 75, 90, 105**:
  `hover:bg-gray-50 focus:bg-gray-50 text-gray-800 transition-colors` -> `hover:bg-muted focus:bg-muted text-popover-foreground transition-colors`
- **Line 77**:
  `<BookOpen class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />` -> `<BookOpen class="w-4 h-4 text-success shrink-0 mt-0.5" />`
- **Lines 80, 95, 110**:
  `text-xs font-semibold text-gray-900` -> `text-xs font-semibold text-foreground`
- **Line 81**:
  `<ExternalLink class="w-3 h-3 text-gray-400" />` -> `<ExternalLink class="w-3 h-3 text-muted-foreground" />`
- **Lines 83, 98, 113, 130**:
  `text-[11px] text-gray-500` -> `text-[11px] text-muted-foreground`
- **Line 92**:
  `<FileQuestion class="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />` -> `<FileQuestion class="w-4 h-4 text-info shrink-0 mt-0.5" />`
- **Line 96**:
  `bg-blue-50 text-blue-700 font-medium border border-blue-100` -> `bg-info/10 text-info font-medium border border-info/20`
- **Line 107**:
  `<Compass class="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />` -> `<Compass class="w-4 h-4 text-tag-4-foreground shrink-0 mt-0.5" />`
- **Line 111**:
  `bg-purple-50 text-purple-700 font-medium border border-purple-100` -> `bg-tag-4 text-tag-4-foreground font-medium border border-tag-4-foreground/20`
- **Line 117**:
  `<DropdownMenuSeparator class="my-1 bg-gray-100" />` -> `<DropdownMenuSeparator class="my-1 bg-border" />`
- **Line 122**:
  `hover:bg-emerald-50/70 focus:bg-emerald-50/70 text-emerald-950 transition-colors group` -> `hover:bg-success/15 focus:bg-success/15 text-foreground transition-colors group`
- **Line 124**:
  `<Sparkles class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />` -> `<Sparkles class="w-4 h-4 text-success shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />`
- **Line 127**:
  `text-xs font-semibold text-emerald-800` -> `text-xs font-semibold text-success`
- **Line 128**:
  `bg-emerald-100 text-emerald-800 font-bold border border-emerald-200` -> `bg-success/20 text-success font-bold border border-success/30`
- **Line 138**:
  `class="relative p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-gray-400"` ->
  `class="relative p-1.5 text-rail-muted-foreground hover:text-rail-foreground rounded-full hover:bg-rail-active transition-colors outline-none focus-visible:ring-2 focus-visible:ring-rail-muted-foreground"`
- **Line 140**:
  `ring-2 ring-gray-950` -> `ring-2 ring-rail`
- **Line 144**:
  `hover:bg-gray-800 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-gray-400` ->
  `hover:bg-rail-active transition-colors outline-none focus-visible:ring-2 focus-visible:ring-rail-muted-foreground`
- **Line 149**:
  `ring-2 ring-gray-950` -> `ring-2 ring-rail`
- **Line 151**:
  `text-gray-400` -> `text-rail-muted-foreground`
- **Line 157** (How to use dialog):
  `class="max-w-md bg-white border border-gray-200 text-gray-900 p-6 rounded-2xl shadow-2xl z-[80]"` ->
  `class="max-w-md bg-card border border-border text-foreground p-6 rounded-2xl shadow-2xl z-[80]"`
- **Line 160**:
  `bg-blue-50 text-blue-600 border border-blue-100` -> `bg-info/10 text-info border border-info/20`
- **Line 163**:
  `text-[10px] uppercase tracking-wider font-bold text-gray-500` -> `text-[10px] uppercase tracking-wider font-bold text-muted-foreground`
- **Line 165**:
  `text-base font-bold text-gray-900` -> `text-base font-bold text-foreground`
- **Line 168**:
  `text-xs text-gray-500` -> `text-xs text-muted-foreground`
- **Line 175**:
  `p-3 bg-gray-50 rounded-xl border border-gray-200/80 text-xs text-gray-700 leading-relaxed` ->
  `p-3 bg-muted/50 rounded-xl border border-border text-xs text-muted-foreground leading-relaxed`
- **Line 181**:
  `text-xs font-semibold text-gray-900 uppercase tracking-wide mb-2` -> `text-xs font-semibold text-foreground uppercase tracking-wide mb-2`
- **Line 182**:
  `space-y-1.5 text-xs text-gray-600` -> `space-y-1.5 text-xs text-muted-foreground`
- **Line 184**:
  `text-emerald-600 font-bold mt-0.5 text-xs` -> `text-success font-bold mt-0.5 text-xs`
- **Line 185**:
  `text-gray-700` -> `text-foreground`
- **Line 191**:
  `p-2.5 bg-blue-50/70 border border-blue-100 rounded-lg flex items-center gap-2 text-[11px] text-blue-700` ->
  `p-2.5 bg-info/10 border border-info/20 rounded-lg flex items-center gap-2 text-[11px] text-info`
- **Line 192**:
  `text-blue-600` -> `text-info`
- **Line 197**:
  `border-t border-gray-100 mt-2` -> `border-t border-border mt-2`
- **Line 200**:
  `text-xs text-emerald-600 hover:text-emerald-700 font-medium transition-colors cursor-pointer` ->
  `text-xs text-success hover:text-success/90 font-medium transition-colors cursor-pointer`
- **Line 207**:
  `px-4 py-1.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer` ->
  `px-4 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-xs font-medium transition-colors cursor-pointer`

---

### 4.6 `src/components/omnichannel/InboxDropdown.vue` (52 Violations)

Replace all trigger and dropdown overlay colors with semantic tokens:

- **Line 71**:
  ```html
  <!-- Before -->
  ? 'border-green-250 bg-green-50 text-[#23B750] hover:bg-green-100/50 font-bold'
  <!-- After -->
  ? 'border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 font-bold'
  ```
- **Line 72**:
  ```html
  <!-- Before -->
  : 'border-gray-250 bg-gray-50 text-gray-700 hover:bg-gray-100/70 hover:text-gray-900 hover:border-gray-300'
  <!-- After -->
  : 'border-input bg-background text-foreground hover:bg-muted hover:text-foreground hover:border-border'
  ```
- **Line 75**:
  ```html
  <!-- Before -->
  :class="[selectedInbox !== 'All' ? 'text-[#23B750]' : 'text-gray-400']"
  <!-- After -->
  :class="[selectedInbox !== 'All' ? 'text-primary' : 'text-muted-foreground']"
  ```
- **Line 87**:
  ```html
  <!-- Before -->
  :class="[isOpen ? 'rotate-180 text-[#23B750]' : 'text-gray-400']"
  <!-- After -->
  :class="[isOpen ? 'rotate-180 text-primary' : 'text-muted-foreground']"
  ```
- **Line 105**:
  ```html
  <!-- Before -->
  class="fixed w-52 bg-white border border-gray-200 rounded-2xl z-[999] py-2 shadow-lg focus:outline-none select-none"
  <!-- After -->
  class="fixed w-52 bg-popover border border-border text-popover-foreground rounded-2xl z-[999] py-2 shadow-lg focus:outline-none select-none"
  ```
- **Line 107**:
  `text-gray-400` -> `text-muted-foreground`
- **Lines 116, 130, 144, 158, 175, 189**:
  `hover:bg-gray-50 transition-colors cursor-pointer` -> `hover:bg-muted transition-colors cursor-pointer`
- **Lines 117, 131, 145, 159, 176, 190**:
  ```html
  <!-- Before -->
  :class="[selectedInbox === '<name>' ? 'text-[#23B750] font-bold bg-green-50/30' : 'text-gray-700']"
  <!-- After -->
  :class="[selectedInbox === '<name>' ? 'text-primary font-bold bg-primary/10' : 'text-foreground']"
  ```
- **Line 120**:
  `<span class="w-2 h-2 rounded-full border border-gray-300 bg-white"></span>` ->
  `<span class="w-2 h-2 rounded-full border border-border bg-card"></span>`
- **Lines 123, 137, 151, 165, 182, 196**:
  `text-[#23B750]` -> `text-primary`
- **Line 134**:
  `bg-[#23B750]` -> `bg-primary`
- **Line 148**:
  `bg-indigo-500` -> `bg-info`
- **Line 162**:
  `bg-gray-400` -> `bg-muted-foreground`
- **Line 169**:
  `border-t border-gray-150 mx-3.5` -> `border-t border-border mx-3.5`
- **Line 179**:
  `bg-slate-400` -> `bg-muted-foreground/60`
- **Line 193**:
  `bg-amber-400` -> `bg-warning`

---

### 4.7 `src/components/omnichannel/ToastNotifications.vue` (6 Violations)

Replace hardcoded white card and status colors:

- **Line 27**:
  ```html
  <!-- Before -->
  class="pointer-events-auto flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-gray-200 text-sm font-medium text-gray-800 overflow-hidden"
  <!-- After -->
  class="pointer-events-auto flex items-center gap-3 px-4 py-3 bg-card rounded-xl border border-border text-sm font-medium text-foreground overflow-hidden"
  ```
- **Lines 28–32**:
  ```html
  <!-- Before -->
  :class="{
    'border-l-4 border-l-[#23B750]': toast.type === 'success',
    'border-l-4 border-l-[#3B82F6]': toast.type === 'info',
    'border-l-4 border-l-[#F59E0B]': toast.type === 'warning',
  }"
  <!-- After -->
  :class="{
    'border-l-4 border-l-success': toast.type === 'success',
    'border-l-4 border-l-info': toast.type === 'info',
    'border-l-4 border-l-warning': toast.type === 'warning',
  }"
  ```
- **Line 36**:
  `<svg class="w-4 h-4 text-[#23B750]"` -> `<svg class="w-4 h-4 text-success"`
- **Line 39**:
  `<svg class="w-4 h-4 text-[#3B82F6]"` -> `<svg class="w-4 h-4 text-info"`
- **Line 42**:
  `<svg class="w-4 h-4 text-[#F59E0B]"` -> `<svg class="w-4 h-4 text-warning"`

---

### 4.8 `src/layouts/MainLayout.vue` (115 Violations)

#### 4.8.1 Theme Management Harmonization
Replace manual localStorage/DOM logic with centralized `useTheme`:
```typescript
// Replace lines 41-59 with:
import { useTheme } from '@/composables/useTheme'

const { isDark, toggleTheme } = useTheme()
// In template (line 264): replace @click="toggleDark" with @click="toggleTheme"
```

#### 4.8.2 Outer Rail Tokenization (Lines 124–328)
- **Line 124**:
  `class="flex h-screen w-full bg-gray-50 dark:bg-background overflow-hidden text-sm"` ->
  `class="flex h-screen w-full bg-background overflow-hidden text-sm"`
- **Line 131**:
  `'h-full bg-gray-900 flex flex-col items-center py-4 flex-shrink-0 z-20 transition-all duration-250 ease-in-out'` ->
  `'h-full bg-rail flex flex-col items-center py-4 flex-shrink-0 z-20 transition-all duration-250 ease-in-out'`
- **Line 140**:
  `text-white font-bold text-sm tracking-tight leading-none whitespace-nowrap overflow-hidden transition-all duration-200` ->
  `text-rail-foreground font-bold text-sm tracking-tight leading-none whitespace-nowrap overflow-hidden transition-all duration-200`
- **Line 155**:
  `'rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-150 flex items-center gap-3 overflow-hidden'` ->
  `'rounded-md text-rail-muted-foreground hover:text-rail-foreground hover:bg-rail-active transition-all duration-150 flex items-center gap-3 overflow-hidden'`
- **Line 158**:
  `active-class="!text-primary bg-gray-800"` -> `active-class="!text-primary bg-rail-active"`
- **Line 178**:
  `route.path.startsWith('/contacts') ? '!text-primary bg-gray-800 font-semibold' : 'text-gray-400 hover:text-white hover:bg-gray-800'` ->
  `route.path.startsWith('/contacts') ? '!text-primary bg-rail-active font-semibold' : 'text-rail-muted-foreground hover:text-rail-foreground hover:bg-rail-active'`
- **Line 195**:
  `:class="['w-4 h-4 transition-transform duration-200 ml-1 text-gray-400', isContactsExpanded ? 'rotate-90 text-white' : '']"` ->
  `:class="['w-4 h-4 transition-transform duration-200 ml-1 text-rail-muted-foreground', isContactsExpanded ? 'rotate-90 text-rail-foreground' : '']"`
- **Line 202**:
  `class="absolute left-full top-0 ml-2 w-48 bg-gray-900 border border-gray-800 rounded-lg p-2 shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150 z-50 flex flex-col gap-1"` ->
  `class="absolute left-full top-0 ml-2 w-48 bg-rail border border-rail-border rounded-lg p-2 shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150 z-50 flex flex-col gap-1"`
- **Line 204**:
  `text-gray-500 uppercase tracking-wider` -> `text-rail-muted-foreground uppercase tracking-wider`
- **Line 213**:
  `route.path === sub.to ? 'text-primary bg-gray-800 font-semibold' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'` ->
  `route.path === sub.to ? 'text-primary bg-rail-active font-semibold' : 'text-rail-muted-foreground hover:text-rail-foreground hover:bg-rail-active/50'`
- **Line 222**:
  `border-l border-gray-800 mt-1` -> `border-l border-rail-border mt-1`
- **Line 229**:
  `route.path === sub.to ? 'text-primary bg-gray-800/80 font-semibold' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'` ->
  `route.path === sub.to ? 'text-primary bg-rail-active/80 font-semibold' : 'text-rail-muted-foreground hover:text-rail-foreground hover:bg-rail-active/50'`
- **Lines 249, 267, 280, 296**:
  `'rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-150 flex items-center gap-3 overflow-hidden w-full'` ->
  `'rounded-md text-rail-muted-foreground hover:text-rail-foreground hover:bg-rail-active transition-all duration-150 flex items-center gap-3 overflow-hidden w-full'`
- **Line 299**:
  `active-class="!text-primary bg-gray-800 opacity-100"` -> `active-class="!text-primary bg-rail-active opacity-100"`
- **Line 315**:
  `'rounded-md text-gray-500 hover:text-white hover:bg-gray-800 transition-all duration-150 flex items-center gap-3 overflow-hidden w-full mt-1 border-t border-gray-800 pt-3'` ->
  `'rounded-md text-rail-muted-foreground hover:text-rail-foreground hover:bg-rail-active transition-all duration-150 flex items-center gap-3 overflow-hidden w-full mt-1 border-t border-rail-border pt-3'`
- **Line 323**:
  `text-gray-500` -> `text-rail-muted-foreground`

#### 4.8.3 Inner Sidebar & Header Tokenization (Lines 343–501)
- **Line 343**:
  `class="w-60 h-full bg-white dark:bg-card border-r border-gray-200 dark:border-border flex flex-col flex-shrink-0 z-10"` ->
  `class="w-60 h-full bg-card border-r border-border flex flex-col flex-shrink-0 z-10"`
- **Line 346**:
  `<div class="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-border">` ->
  `<div class="h-16 flex items-center justify-between px-4 border-b border-border">`
- **Line 347**:
  `<h2 class="font-semibold text-gray-800 dark:text-foreground text-sm">{{ pageTitle }}</h2>` ->
  `<h2 class="font-semibold text-foreground text-sm">{{ pageTitle }}</h2>`
- **Line 351**:
  `class="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-muted transition-colors cursor-pointer"` ->
  `class="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"`
- **Line 360**:
  `<Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />` ->
  `<Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />`
- **Line 364**:
  `class="w-full pl-9 pr-3 py-1.5 bg-gray-50 dark:bg-muted border border-gray-200 dark:border-border rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"` ->
  `class="w-full pl-9 pr-3 py-1.5 bg-muted/50 border border-border rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"`
- **Lines 382, 392, 416, 426, 436**:
  `route.path === '...' ? 'bg-primary/10 text-primary font-semibold' : 'text-gray-600 dark:text-muted-foreground hover:bg-gray-100 dark:hover:bg-muted'` ->
  `route.path === '...' ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:text-foreground hover:bg-muted'`
- **Line 445**:
  `class="flex items-center gap-3 px-3 py-2 rounded-md bg-gray-100 dark:bg-muted text-primary"` ->
  `class="flex items-center gap-3 px-3 py-2 rounded-md bg-muted text-primary"`
- **Lines 449, 453**:
  `class="flex items-center gap-3 px-3 py-2 rounded-md text-gray-600 dark:text-muted-foreground hover:bg-gray-50 dark:hover:bg-muted/50 transition-colors"` ->
  `class="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"`
- **Lines 450, 454**:
  `<span class="w-2 h-2 rounded-full bg-gray-300 flex-shrink-0"></span>` ->
  `<span class="w-2 h-2 rounded-full bg-muted-foreground/30 flex-shrink-0"></span>`
- **Line 468**:
  `class="h-16 bg-white dark:bg-card border-b border-gray-200 dark:border-border flex items-center justify-between px-6 flex-shrink-0"` ->
  `class="h-16 bg-card border-b border-border flex items-center justify-between px-6 flex-shrink-0"`
- **Line 469**:
  `<div class="font-medium text-gray-800 dark:text-foreground flex items-center gap-2">` ->
  `<div class="font-medium text-foreground flex items-center gap-2">`
- **Line 475**:
  `class="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-muted transition-colors cursor-pointer mr-1"` ->
  `class="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer mr-1"`
- **Line 482**:
  `<span class="text-sm font-semibold text-gray-800 dark:text-foreground">{{ pageTitle }}</span>` ->
  `<span class="text-sm font-semibold text-foreground">{{ pageTitle }}</span>`
- **Line 485**:
  `class="relative text-gray-500 dark:text-muted-foreground hover:text-gray-700 dark:hover:text-foreground transition-colors"` ->
  `class="relative text-muted-foreground hover:text-foreground transition-colors"`
- **Line 487**:
  `<span class="absolute top-0 right-0 w-2 h-2 bg-destructive rounded-full border border-white dark:border-card"></span>` ->
  `<span class="absolute top-0 right-0 w-2 h-2 bg-destructive rounded-full border border-card"></span>`
- **Line 498**:
  ```html
  <!-- Before -->
  route.path === '/omnichannel' ? 'overflow-hidden p-0 bg-white dark:bg-background' : 'overflow-auto bg-gray-50 dark:bg-background p-4 lg:p-6'
  <!-- After -->
  route.path === '/omnichannel' ? 'overflow-hidden p-0 bg-background' : 'overflow-auto bg-background p-4 lg:p-6'
  ```

---

## 5. Verification Method

### 5.1 Token Audit Check
After changes are applied, verify zero token violations remain in Batch 1:
```powershell
node scripts/audit-tokens.cjs --batch 1
```
Expected output:
```
✔ SUCCESS: 0 token violations detected across all 9 scanned files!
```

### 5.2 Build & Type Check
Verify that the full application builds cleanly without TypeScript or Vite compilation errors:
```powershell
cmd /c npm run build
```
Expected exit code: 0.

### 5.3 Theme Toggle Functional Verification
- Load app in browser.
- Verify `TopNav.vue` displays the theme toggle button with a `Moon` icon in light mode and `Sun` icon in dark mode.
- Click the button: verify `.dark` class toggles on `document.documentElement`, `localStorage` key `rks-theme` updates between `'light'` and `'dark'`.
- Verify the outer rail (`Sidebar.vue`, `SidebarItem.vue`, `TopNav.vue`) remains dark with crisp white text and emerald active states in both light and dark themes.
- Open `InboxDropdown.vue`: verify popover matches dark background when dark mode is active and light background when light mode is active.

### 5.4 Invalidation Conditions
This investigation report is invalidated if:
1. New files are added to Batch 1 outside the 8 cataloged components.
2. The CSS token naming in `src/assets/index.css` is modified (e.g. changing `--rail` to `--nav-rail`).
