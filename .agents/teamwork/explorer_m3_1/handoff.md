# Milestone 3 (CRM Core & Omnichannel) — Batch 3 Deep Investigation Report

**Explorer 1 Handoff Report**  
**Working Directory**: `c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\explorer_m3_1`  
**Target Recipient**: Parent Orchestrator (`57c50def-4689-4a65-86f1-14dce8a95cbf`)  
**Date**: 2026-10-31T09:12:00Z  
**Status**: Investigation Complete (Read-Only)  

---

## 1. Observation

### 1.1 Baseline Build & Audit Verification
1. **Build Baseline**:
   - Command: `cmd.exe /c "npm run build"`
   - Result: Exit code 0, 0 TypeScript errors, 2,961 modules transformed, build completed cleanly in 4.39s (`dist/index.html` 1.51 kB).
2. **Batch 3 Audit**:
   - Command: `node scripts/audit-tokens.cjs --batch 3`
   - Result: 8 files scanned, **4,634 total violations** detected across 4 violation categories.
3. **Automated Codemod Dry-Run**:
   - Command: `node scripts/codemod-tokens.cjs --batch 3 --dry-run`
   - Result: **603 automated replacements** achievable via standard multi-pass codemod (leaving 4,031 violations requiring targeted replacement).

---

### 1.2 Exact Violation Breakdown per File in Batch 3

| # | File Path | Total Lines | Total Violations | Palette Grays & Neutrals | Arbitrary Hex / RGB | `dark:` Overrides | Raw Status / Accents | Codemod Dry-Run Hits |
|---|---|---|---|---|---|---|---|---|
| 1 | `src/views/DashboardView.vue` | 2,329 | **1,345** | 747 | 130 | 389 | 79 | 253 |
| 2 | `src/views/DealsView.vue` | 3,471 | **742** | 508 | 150 | 0 | 84 | 70 |
| 3 | `src/views/ContactsView.vue` | 1,522 | **476** | 185 | 9 | 177 | 105 | 70 |
| 4 | `src/components/omnichannel/ContactDrawer.vue` | 2,350 | **542** | 349 | 8 | 0 | 185 | 7 |
| 5 | `src/components/omnichannel/FiltersModal.vue` | 953 | **251** | 215 | 29 | 0 | 7 | 28 |
| 6 | `src/views/CompaniesView.vue` | 94 | **21** | 21 | 0 | 0 | 0 | 0 |
| 7 | `src/views/CalendarView.vue` | 890 | **221** | 137 | 0 | 18 | 66 | 2 |
| 8 | `src/views/EventsView.vue` | 2,115 | **1,036** | 464 | 7 | 403 | 162 | 173 |
| **TOTAL** | **8 Files** | **13,724** | **4,634** | **2,626** | **333** | **987** | **688** | **603** |

*(Note: File locations verified: `ContactDrawer.vue` and `FiltersModal.vue` reside under `src/components/omnichannel/` rather than `src/components/contacts/`.)*

---

### 1.3 Verbatim Observations & High-Impact UI Patterns

#### Pattern A: `DealsView.vue` Kanban Pipeline Stages & Categorical Tags
- **Lines 870–879 (`stageColors` object)**:
  ```typescript
  // Current DealsView.vue:870-879
  const stageColors: Record<string, { border: string; bg: string; text: string; headerBar: string }> = {
    New: { border: 'border-t-[#3b82f6]', bg: 'bg-[#3b82f6]/10', text: 'text-[#3b82f6]', headerBar: 'bg-[#3b82f6]' },
    Acknowledged: { border: 'border-t-[#00D2C4]', bg: 'bg-[#00D2C4]/10', text: 'text-[#00D2C4]', headerBar: 'bg-[#00D2C4]' },
    Qualifying: { border: 'border-t-[#FFCC00]', bg: 'bg-[#FFCC00]/10', text: 'text-[#FFCC00]', headerBar: 'bg-[#FFCC00]' },
    'Proposal / Quotation': { border: 'border-t-[#FF8800]', bg: 'bg-[#FF8800]/10', text: 'text-[#FF8800]', headerBar: 'bg-[#FF8800]' },
    'Follow Up': { border: 'border-t-[#10B981]', bg: 'bg-[#10B981]/10', text: 'text-[#10B981]', headerBar: 'bg-[#10B981]' },
    Won: { border: 'border-t-[#23B750]', bg: 'bg-[#23B750]/10', text: 'text-[#168638]', headerBar: 'bg-[#23B750]' },
    Lost: { border: 'border-t-red-500', bg: 'bg-red-50', text: 'text-red-600', headerBar: 'bg-red-500' },
    Archived: { border: 'border-t-slate-400', bg: 'bg-slate-100', text: 'text-slate-600', headerBar: 'bg-slate-400' }
  }
  ```
- **Lines 881–890 (`getHeaderBarColor` function)**:
  ```typescript
  // Current DealsView.vue:881-890
  const getHeaderBarColor = (stage: string) => {
    const colors: Record<string, string> = {
      New: '#3b82f6',
      Acknowledged: '#00D2C4',
      Qualifying: '#FFCC00',
      'Proposal / Quotation': '#FF8800',
      'Follow Up': '#10B981'
    }
    return colors[stage] || '#3b82f6'
  }
  ```
- **Line 1626 (Drag-and-Drop column highlight)**:
  ```html
  :style="draggedOverStage === stage ? { border: '2px dashed ' + getHeaderBarColor(stage), borderRadius: '16px', backgroundColor: getHeaderBarColor(stage) + '0d' } : {}"
  ```
  *(Observation: `getHeaderBarColor(stage) + '0d'` relies on string concatenation of hex alpha. When migrating to CSS variable tokens like `var(--tag-1)`, concatenation results in invalid syntax `var(--tag-1)0d`. It must use `color-mix(in srgb, var(--tag-1) 5%, transparent)` instead).*
- **Lines 2040–2052 & 2089–2117 (Forecast breakdown progress bars)**:
  Hardcoded hex segments: `bg-[#3b82f6]`, `bg-[#00D2C4]`, `bg-[#FFCC00]`, `bg-[#FF8800]`, `bg-[#10B981]`.
- **Lines 2169, 2230 (Bottom Quick-Drop toolbar)**:
  Hardcoded `bg-emerald-50/85 border-dashed border-emerald-400 text-[#146c2e]`, `bg-red-50`, `bg-slate-50`.
- **Lines 3368–3383 (Custom Scrollbar in `<style scoped>`)**:
  Hardcoded `#cbd5e1` and `#94a3b8` in `scrollbar-color` and `::-webkit-scrollbar-thumb`.

---

#### Pattern B: `DashboardView.vue` Surfaces & ApexCharts Scope Boundary
- **18 ApexCharts instances**: Lines 266, 288, 310, 344, 376, 423, 470, 532, 651, 687, 912, 938, 973, 985, 1149, 1172, 1194, 1336.
  *(Scope Note: Dynamic JavaScript theming of chart series and grid options is formally scheduled for Milestone 6 via `useChartTheme.ts`. However, in Milestone 3, all surrounding HTML card wrappers, metrics containers, tooltips, table surfaces, and filter popovers must be strictly tokenized).*
- **Card Surface & Dark Override Repetition**:
  ```html
  <!-- Lines 8, 271, 293, 335, 412, etc. -->
  <div class="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-5 rounded-2xl ...">
  ```
  *(Observation: 389 `dark:` overrides in DashboardView.vue exist because dark mode was previously hacked with `dark:bg-[#111827]`, `dark:border-gray-800`, `dark:text-white`. Directly converting `bg-white dark:bg-[#111827]` to `bg-card` and `border-gray-200 dark:border-gray-800` to `border-border` eliminates over 700 violations cleanly).*

---

#### Pattern C: Zero `dark:` Overrides in `DealsView.vue`, `ContactDrawer.vue`, `FiltersModal.vue`
- Across `DealsView.vue` (3,471 lines), `ContactDrawer.vue` (2,350 lines), and `FiltersModal.vue` (953 lines), there are **zero `dark:` overrides**.
- They are hardcoded exclusively in light palette grays (`bg-white`, `border-gray-200`, `text-gray-900`, `text-gray-700`, `bg-gray-50`) and brand green (`bg-[#23B750]`, `hover:bg-[#1f9f46]`).
- Migrating them to root tokens (`bg-card`, `border-border`, `text-foreground`, `text-muted-foreground`, `bg-muted`, `bg-primary`) immediately confers dark mode support without adding a single `dark:` class.

---

#### Pattern D: `CalendarView.vue` Event Categories
- **Lines 286–302 (`getCategoryClasses`)**:
  ```typescript
  // Current CalendarView.vue:286-302
  function getCategoryClasses(cat: CalendarEvent['category']): string {
    switch (cat) {
      case 'work':
        return 'bg-pink-50 text-pink-700 border-pink-500 dark:bg-pink-950/20 dark:text-pink-400 dark:border-pink-850';
      case 'personal':
        return 'bg-emerald-50 text-emerald-700 border-emerald-500 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-850';
      case 'design':
        return 'bg-blue-50 text-blue-700 border-blue-500 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-850';
      case 'marketing':
        return 'bg-purple-50 text-purple-700 border-purple-500 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-850';
      case 'client':
        return 'bg-orange-50 text-orange-700 border-orange-500 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-850';
      case 'team':
      default:
        return 'bg-gray-50 text-gray-700 border-gray-400 dark:bg-gray-800/40 dark:text-gray-300 dark:border-gray-600';
    }
  }
  ```
  *(Observation: These 18 `dark:` overrides directly match categorical tag tokens `--tag-1` through `--tag-6`).*

---

#### Pattern E: `EventsView.vue` Inline SVG Progress Rings
- **Lines 862–868**:
  ```html
  <svg class="w-36 h-36 transform -rotate-95" viewBox="0 0 42 42">
    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#e2e8f0" stroke-width="4.5" />
    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#22c55e" stroke-width="4.5" stroke-dasharray="35 65" stroke-dashoffset="0" />
    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#3b82f6" stroke-width="4.5" stroke-dasharray="15 85" stroke-dashoffset="-35" />
    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#06b6d4" stroke-width="4.5" stroke-dasharray="40 60" stroke-dashoffset="-50" />
    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f97316" stroke-width="4.5" stroke-dasharray="10 90" stroke-dashoffset="-90" />
  </svg>
  ```
  *(Observation: Hardcoded stroke hexes in SVG circles can be replaced with `stroke="var(--border)"`, `stroke="var(--success)"`, `stroke="var(--tag-1)"`, `stroke="var(--tag-2)"`, and `stroke="var(--tag-5)"` or utility classes `stroke-border`, `stroke-success`, etc.).*

---

## 2. Logic Chain

1. **Premise 1 (Single Source of Truth Rule from `AGENTS.md`)**:
   All styling must derive from CSS variables in `src/assets/index.css`. Raw palette grays (`gray-*`, `slate-*`, `zinc-*`, `white`, `black`), arbitrary hex/rgb values (`#...`), raw status colors (`bg-green-50`, `text-red-600`), and `dark:` overrides are forbidden.
2. **Premise 2 (Categorical Tag Architecture from Milestone 1)**:
   In Milestone 1, 6 paired categorical tag tokens were established in `:root` and `.dark` (`--tag-1` through `--tag-6` and `--tag-N-foreground`) and mapped in `@theme inline` as `--color-tag-1` through `--color-tag-6`.
3. **Inference 1 (Deals Pipeline Mapping)**:
   In `DealsView.vue`, the 5 primary Kanban stages ("New", "Acknowledged", "Qualifying", "Proposal / Quotation", "Follow Up") map directly onto `--tag-1` through `--tag-5`. Terminal stages ("Won", "Lost", "Archived") map directly to semantic tokens (`--success`, `--destructive`, `--muted-foreground`).
   By remapping `stageColors` and `getHeaderBarColor`, all 150 arbitrary hex classes and inline style issues are resolved cleanly in both light and dark modes.
4. **Inference 2 (Dark Mode Override Collapse in Dashboard & Events)**:
   Between `DashboardView.vue` (389 `dark:` overrides) and `EventsView.vue` (403 `dark:` overrides), over 790 manual dark mode overrides exist solely because surfaces were written as `bg-white dark:bg-card` or `bg-white dark:bg-[#111827]`, text as `text-gray-900 dark:text-foreground`, and borders as `border-gray-200 dark:border-border`.
   Replacing the paired expressions with single semantic tokens (`bg-card`, `text-foreground`, `border-border`) collapses 790 `dark:` overrides and 1,200 palette gray violations with zero loss in visual appearance.
5. **Inference 3 (Light-Only Component Awakening)**:
   `DealsView.vue`, `ContactDrawer.vue`, `FiltersModal.vue`, and `CompaniesView.vue` contain 0 `dark:` overrides. Because semantic tokens automatically resolve light/dark colors at the CSS variable layer, migrating these components to standard tokens simultaneously eliminates all 1,556 light-mode violations and introduces dark mode support with zero additional code.

---

## 3. Caveats

1. **ApexCharts Options Isolation (Milestone 6 Dependency)**:
   `DashboardView.vue` contains 18 ApexCharts instances configured via script options (`colors: ['#3b82f6']`, etc.). These JS chart configuration objects will be systematically converted to reactive computed properties in Milestone 6 via `useChartTheme.ts`. In Milestone 3, our implementation boundary is 100% of the Vue template markup, cards, dialogs, popovers, badges, and tables.
2. **Dynamic Drag Highlighting Syntax in `DealsView.vue`**:
   Line 1626 constructs `backgroundColor: getHeaderBarColor(stage) + '0d'`. When `getHeaderBarColor` returns `var(--tag-1)`, string-appending `'0d'` produces invalid CSS. The implementer must replace this with `color-mix(in srgb, ' + getHeaderBarColor(stage) + ' 5%, transparent)'`.
3. **Contact Drawer File Paths**:
   The prompt dispatch listed `src/components/contacts/ContactDrawer.vue` and `src/components/contacts/FiltersModal.vue`. The codebase actually houses these components in `src/components/omnichannel/ContactDrawer.vue` and `src/components/omnichannel/FiltersModal.vue`. The audit tool and implementation must use the actual omnichannel path.
4. **Scoped Scrollbar Styles in `DealsView.vue`**:
   Lines 3368–3383 in `<style scoped>` contain raw `#cbd5e1` and `#94a3b8` rules. The implementer must tokenize these to `var(--border)` and `var(--muted-foreground)`.

---

## 4. Conclusion & Concrete Token Mappings

### 4.1 Master Token Replacement Map for Batch 3

| Current Violation Pattern | Semantic Token Replacement | Target Usage |
|---|---|---|
| `bg-white`, `bg-white/95`, `dark:bg-[#111827]`, `dark:bg-card` | `bg-card` | Metric cards, modals, popovers, headers, drawers |
| `bg-gray-50`, `bg-[#FAF5FF]/30`, `bg-[#F3F4F6]`, `bg-[#F9FAFB]`, `dark:bg-[#0B0F17]`, `dark:bg-background` | `bg-background` | Page container background, canvasses |
| `bg-gray-100`, `bg-gray-150`, `bg-slate-100`, `dark:bg-gray-800`, `dark:bg-muted` | `bg-muted` | Inactive tabs, pill backgrounds, table zebra rows |
| `border-gray-200`, `border-gray-100`, `border-gray-250`, `border-slate-800`, `dark:border-gray-800`, `dark:border-border` | `border-border` | Component cards, table dividers, panel borders |
| `border-gray-300`, `border-gray-350` | `border-input` | Form input borders |
| `text-gray-900`, `text-gray-950`, `text-gray-955`, `text-slate-900`, `text-black`, `dark:text-white`, `dark:text-foreground` | `text-foreground` | Primary titles, table headers, values |
| `text-gray-700`, `text-gray-800`, `text-slate-800` | `text-foreground/90` or `text-foreground` | Secondary headings, labels, button text |
| `text-gray-500`, `text-gray-600`, `text-slate-400`, `text-slate-500`, `dark:text-gray-400`, `dark:text-muted-foreground` | `text-muted-foreground` | Captions, subtitle text, timestamps |
| `text-gray-300`, `text-gray-400` (disabled/subtle) | `text-muted-foreground/70` | Subtle indicators, placeholder text |
| `divide-gray-100`, `divide-gray-200`, `dark:divide-gray-800` | `divide-border` | Table and list dividers |
| `bg-[#23B750]`, `text-[#23B750]`, `border-[#23B750]`, `ring-[#23B750]` | `bg-primary`, `text-primary`, `border-primary`, `ring-primary` | Brand interactive actions, active states |
| `hover:bg-[#1a943e]`, `hover:bg-[#1f9f46]`, `bg-[#168638]` | `hover:bg-primary/90`, `bg-primary` (or `success`) | Brand hover/active states |
| `bg-emerald-50`, `bg-green-50`, `dark:bg-emerald-950/40` | `bg-success/10` | Success badge & alert backgrounds |
| `text-emerald-600`, `text-emerald-700`, `text-green-700`, `dark:text-emerald-400` | `text-success` | Success text and icons |
| `border-emerald-200`, `border-green-200`, `dark:border-emerald-900/50` | `border-success/20` | Success badge borders |
| `bg-emerald-500`, `bg-emerald-600`, `bg-green-500` | `bg-success` | Success filled buttons and indicators |
| `bg-[#EF4444]`, `bg-red-500`, `bg-red-600` | `bg-destructive` | Destructive buttons, badges |
| `text-[#EF4444]`, `text-red-500`, `text-red-600`, `dark:text-red-400` | `text-destructive` | Destructive text, alert icons |
| `bg-red-50`, `bg-red-100`, `dark:bg-red-950/40` | `bg-destructive/10` | Error badge & alert backgrounds |
| `border-red-200`, `dark:border-red-900/50` | `border-destructive/20` | Error badge borders |
| `bg-amber-500`, `bg-amber-600` | `bg-warning` | Warning buttons, indicators |
| `text-amber-500`, `text-amber-600`, `text-amber-700` | `text-warning` | Warning text |
| `bg-amber-50`, `bg-yellow-50` | `bg-warning/10` | Warning backgrounds |
| `bg-blue-600`, `bg-sky-600` | `bg-info` | Information buttons, indicators |
| `text-blue-600`, `text-blue-700`, `text-sky-600`, `dark:text-blue-400` | `text-info` | Information text |
| `bg-blue-50`, `dark:bg-blue-950/20` | `bg-info/10` | Information backgrounds |
| `border-blue-200` | `border-info/20` | Information borders |

---

### 4.2 Detailed Recommendations by File

#### 1. `src/views/DealsView.vue`
- **Remap `stageColors` (Lines 870–879)**:
  ```typescript
  // Recommended Token Replacement
  const stageColors: Record<string, { border: string; bg: string; text: string; headerBar: string }> = {
    New: { border: 'border-t-tag-1', bg: 'bg-tag-1/10', text: 'text-tag-1-foreground', headerBar: 'bg-tag-1' },
    Acknowledged: { border: 'border-t-tag-2', bg: 'bg-tag-2/10', text: 'text-tag-2-foreground', headerBar: 'bg-tag-2' },
    Qualifying: { border: 'border-t-tag-3', bg: 'bg-tag-3/10', text: 'text-tag-3-foreground', headerBar: 'bg-tag-3' },
    'Proposal / Quotation': { border: 'border-t-tag-4', bg: 'bg-tag-4/10', text: 'text-tag-4-foreground', headerBar: 'bg-tag-4' },
    'Follow Up': { border: 'border-t-tag-5', bg: 'bg-tag-5/10', text: 'text-tag-5-foreground', headerBar: 'bg-tag-5' },
    Won: { border: 'border-t-success', bg: 'bg-success/10', text: 'text-success', headerBar: 'bg-success' },
    Lost: { border: 'border-t-destructive', bg: 'bg-destructive/10', text: 'text-destructive', headerBar: 'bg-destructive' },
    Archived: { border: 'border-t-muted-foreground', bg: 'bg-muted', text: 'text-muted-foreground', headerBar: 'bg-muted-foreground' }
  }
  ```
- **Remap `getHeaderBarColor` (Lines 881–890)**:
  ```typescript
  // Recommended Token Replacement
  const getHeaderBarColor = (stage: string) => {
    const colors: Record<string, string> = {
      New: 'var(--tag-1)',
      Acknowledged: 'var(--tag-2)',
      Qualifying: 'var(--tag-3)',
      'Proposal / Quotation': 'var(--tag-4)',
      'Follow Up': 'var(--tag-5)',
      Won: 'var(--success)',
      Lost: 'var(--destructive)',
      Archived: 'var(--muted-foreground)'
    }
    return colors[stage] || 'var(--tag-1)'
  }
  ```
- **Remap Drag Highlight (Line 1626)**:
  ```html
  <!-- Before -->
  :style="draggedOverStage === stage ? { border: '2px dashed ' + getHeaderBarColor(stage), borderRadius: '16px', backgroundColor: getHeaderBarColor(stage) + '0d' } : {}"
  
  <!-- After -->
  :style="draggedOverStage === stage ? { border: '2px dashed ' + getHeaderBarColor(stage), borderRadius: '16px', backgroundColor: 'color-mix(in srgb, ' + getHeaderBarColor(stage) + ' 5%, transparent)' } : {}"
  ```
- **Forecast Segment Bars (Lines 2040–2052 & 2089–2117)**:
  Replace `bg-[#3b82f6]` -> `bg-tag-1`, `bg-[#00D2C4]` -> `bg-tag-2`, `bg-[#FFCC00]` -> `bg-tag-3`, `bg-[#FF8800]` -> `bg-tag-4`, `bg-[#10B981]` -> `bg-tag-5`.
- **Bulk Action Bar (Line 1329)**:
  Replace `bg-slate-900 border-b border-slate-800 text-white` with `bg-card border-b border-border text-foreground shadow-md`.
- **Scrollbar Styling (Lines 3368–3383)**:
  Replace `#cbd5e1` with `var(--border)` and `#94a3b8` with `var(--muted-foreground)`.

#### 2. `src/views/DashboardView.vue`
- **Shell & Navigation (Lines 2–28)**:
  - Line 2: `bg-[#FAF5FF]/30 dark:bg-[#0B0F17] text-gray-900 dark:text-gray-100` -> `bg-background text-foreground`
  - Line 8: `bg-white/95 dark:bg-[#111827]/95 border-b border-gray-200/90 dark:border-gray-800/90` -> `bg-card/95 border-b border-border/90`
  - Line 11: `bg-gray-100 dark:bg-gray-800/70 border-gray-200/70 dark:border-gray-700/60` -> `bg-muted border-border`
  - Line 21: `bg-white dark:bg-gray-900 text-[#23B750] dark:text-[#23B750]` -> `bg-card text-primary`
  - Line 22: `text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white` -> `text-muted-foreground hover:text-foreground`
- **Date Range Picker (Line 35)**:
  - `bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300` -> `bg-card border-border text-foreground`
- **Metric Cards (Lines 271, 293, 335, etc.)**:
  - `bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800` -> `bg-card border border-border`
  - `text-gray-900 dark:text-white` -> `text-foreground`
  - `text-gray-500 dark:text-gray-400` -> `text-muted-foreground`
- **Tooltips (Line 277)**:
  - `bg-gray-900 text-white border border-gray-700` -> `bg-popover text-popover-foreground border border-border`

#### 3. `src/views/ContactsView.vue`
- **Toasts (Lines 591–601)**:
  - `bg-white/95 dark:bg-card/95` -> `bg-card/95`
  - `border-emerald-200 text-emerald-800 dark:border-emerald-900/50 dark:text-emerald-400` -> `border-success/30 text-success bg-success/10`
  - `border-blue-200 text-blue-800 dark:border-blue-900/50 dark:text-blue-400` -> `border-info/30 text-info bg-info/10`
  - `border-red-200 text-red-800 dark:border-red-900/50 dark:text-red-400` -> `border-destructive/30 text-destructive bg-destructive/10`
  - `bg-[#23B750]` -> `bg-success`
- **Stats Cards (Lines 621–680)**:
  - `bg-white dark:bg-card border border-gray-200 dark:border-border` -> `bg-card border border-border`
  - `text-gray-900 dark:text-foreground` -> `text-foreground`
  - `bg-emerald-50 dark:bg-emerald-950/20 text-[#23B750]` -> `bg-success/10 text-success`
  - `bg-purple-50 dark:bg-purple-950/20 text-purple-500` -> `bg-tag-4/10 text-tag-4-foreground`
  - `bg-blue-50 dark:bg-blue-950/20 text-blue-500` -> `bg-info/10 text-info`
- **Table & Search (Lines 700–850)**:
  - `bg-white dark:bg-card border-gray-200 dark:border-border` -> `bg-card border-border`
  - `divide-gray-100 dark:divide-border` -> `divide-border`

#### 4. `src/components/omnichannel/ContactDrawer.vue`
- **Drawer Shell (Line 891)**:
  - `border-l border-gray-200 bg-white` -> `border-l border-border bg-card`
- **Headers & Dividers (Lines 894, 930)**:
  - `border-b border-gray-100` -> `border-b border-border`
  - `text-gray-955` -> `text-foreground`
- **Badges & Channel Indicators**:
  - `bg-green-50 text-green-700 border-green-200` -> `bg-success/10 text-success border-success/20`
  - `bg-blue-50/80 text-blue-700 border-blue-200` -> `bg-info/10 text-info border-info/20`
  - `bg-[#23B750]` -> `bg-primary`
  - `bg-[#67D3B5]` / `bg-[#5bc1a4]` -> `bg-brand` / `bg-success`

#### 5. `src/components/omnichannel/FiltersModal.vue`
- **Modal Overlay & Container (Lines 379–385)**:
  - `bg-black/40 backdrop-blur-xs` -> `bg-background/80 backdrop-blur-sm`
  - `bg-white ... border border-gray-200 shadow-2xl` -> `bg-card ... border border-border shadow-2xl`
  - `border-b border-gray-100` -> `border-b border-border`
  - `text-gray-900` -> `text-foreground`
- **Quick Filters & Chips (Lines 428–434)**:
  - Active: `bg-[#23B750] border-[#23B750] text-white font-bold` -> `bg-primary border-primary text-primary-foreground font-bold`
  - Inactive: `bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50` -> `bg-card border-border text-foreground hover:border-input hover:bg-muted`
- **Footer Buttons**:
  - `bg-[#23B750] text-white hover:bg-[#1fa346]` -> `bg-primary text-primary-foreground hover:bg-primary/90`

#### 6. `src/views/CompaniesView.vue`
- Fully map all 21 violations:
  - Line 12: `text-gray-900` -> `text-foreground`
  - Line 22: `bg-white p-4 rounded-2xl border border-gray-200` -> `bg-card p-4 rounded-2xl border border-border`
  - Line 24: `text-gray-400` -> `text-muted-foreground`
  - Line 28: `border border-gray-200 ... bg-gray-50` -> `border border-input ... bg-background`
  - Lines 32, 36: `text-gray-600 bg-gray-50 hover:bg-gray-100` -> `text-foreground bg-muted hover:bg-muted/80`
  - Line 43: `bg-white rounded-2xl border border-gray-200` -> `bg-card rounded-2xl border border-border`
  - Line 57: `divide-y divide-gray-100` -> `divide-y divide-border`
  - Lines 64, 67: `text-gray-900` -> `text-foreground`
  - Lines 65, 66: `text-gray-600` -> `text-muted-foreground`
  - Line 76: `text-gray-500` -> `text-muted-foreground`
  - Line 84: `border-t border-gray-100` -> `border-t border-border`

#### 7. `src/views/CalendarView.vue`
- **Category Classes Function (Lines 286–302)**:
  ```typescript
  // Recommended Token Replacement
  function getCategoryClasses(cat: CalendarEvent['category']): string {
    switch (cat) {
      case 'work':
        return 'bg-tag-4/10 text-tag-4-foreground border-tag-4/30';
      case 'personal':
        return 'bg-success/10 text-success border-success/30';
      case 'design':
        return 'bg-tag-1/10 text-tag-1-foreground border-tag-1/30';
      case 'marketing':
        return 'bg-tag-6/10 text-tag-6-foreground border-tag-6/30';
      case 'client':
        return 'bg-tag-5/10 text-tag-5-foreground border-tag-5/30';
      case 'team':
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  }
  ```
- **Calendar Grid (Lines 515–548)**:
  - `bg-gray-100 gap-px` -> `bg-border gap-px`
  - `bg-white ... text-gray-400 border-b border-gray-100` -> `bg-card ... text-muted-foreground border-b border-border`
  - Day cells: `bg-white min-h-[130px] ... border-b border-r border-gray-100 hover:bg-slate-50/50` -> `bg-card min-h-[130px] ... border-b border-r border-border hover:bg-muted/50`
  - Inactive month: `bg-gray-50/30 text-gray-300` -> `bg-muted/30 text-muted-foreground/60`
  - Selected day: `bg-emerald-600 text-white` -> `bg-primary text-primary-foreground`
  - Today: `border border-emerald-500 text-emerald-600` -> `border border-primary text-primary`

#### 8. `src/views/EventsView.vue`
- **Shell & Toast (Lines 2–28)**:
  - Line 2: `bg-gray-50 dark:bg-background` -> `bg-background`
  - Line 15: `bg-white dark:bg-slate-900 border border-gray-255 dark:border-slate-800` -> `bg-card border border-border`
  - Line 21: `toast.type === 'success' ? 'text-emerald-500' : 'text-red-500'` -> `toast.type === 'success' ? 'text-success' : 'text-destructive'`
  - Line 24: `text-gray-950 dark:text-foreground` -> `text-foreground`
- **Metrics Cards (Lines 80–134)**:
  - `bg-white dark:bg-card border border-gray-250 dark:border-border` -> `bg-card border border-border`
  - Icon buttons: `bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400` -> `bg-success/10 hover:bg-success/20 text-success`
- **Inline SVG Progress Rings (Lines 862–868)**:
  ```html
  <!-- Before -->
  <svg class="w-36 h-36 transform -rotate-95" viewBox="0 0 42 42">
    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#e2e8f0" stroke-width="4.5" />
    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#22c55e" stroke-width="4.5" stroke-dasharray="35 65" stroke-dashoffset="0" />
    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#3b82f6" stroke-width="4.5" stroke-dasharray="15 85" stroke-dashoffset="-35" />
    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#06b6d4" stroke-width="4.5" stroke-dasharray="40 60" stroke-dashoffset="-50" />
    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f97316" stroke-width="4.5" stroke-dasharray="10 90" stroke-dashoffset="-90" />
  </svg>
  
  <!-- After -->
  <svg class="w-36 h-36 transform -rotate-95" viewBox="0 0 42 42">
    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--border)" stroke-width="4.5" />
    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--success)" stroke-width="4.5" stroke-dasharray="35 65" stroke-dashoffset="0" />
    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--tag-1)" stroke-width="4.5" stroke-dasharray="15 85" stroke-dashoffset="-35" />
    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--tag-2)" stroke-width="4.5" stroke-dasharray="40 60" stroke-dashoffset="-50" />
    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--tag-5)" stroke-width="4.5" stroke-dasharray="10 90" stroke-dashoffset="-90" />
  </svg>
  ```

---

## 5. Verification Method

### 5.1 Pre- and Post-Migration Audit
To check the current state (or verify 0 violations post-migration) for Batch 3:
```bash
node scripts/audit-tokens.cjs --batch 3
```
Expected post-migration: **0 violations across all 8 files**.

To audit any individual file during implementation:
```bash
node scripts/audit-tokens.cjs --file src/views/DealsView.vue
node scripts/audit-tokens.cjs --file src/views/DashboardView.vue
node scripts/audit-tokens.cjs --file src/views/ContactsView.vue
node scripts/audit-tokens.cjs --file src/components/omnichannel/ContactDrawer.vue
node scripts/audit-tokens.cjs --file src/components/omnichannel/FiltersModal.vue
node scripts/audit-tokens.cjs --file src/views/CompaniesView.vue
node scripts/audit-tokens.cjs --file src/views/CalendarView.vue
node scripts/audit-tokens.cjs --file src/views/EventsView.vue
```

### 5.2 Build Verification
Ensure clean compilation without TypeScript errors:
```bash
cmd.exe /c "npm run build"
```
Must pass with exit code 0.

### 5.3 Invalidation Conditions
This investigation report would be invalidated if:
1. Canonical categorical tag tokens (`--tag-1` through `--tag-6`) in `src/assets/index.css` are modified or renamed.
2. The location of `ContactDrawer.vue` or `FiltersModal.vue` is altered from `src/components/omnichannel/`.
3. New uncataloged Vue files or subcomponents are introduced to CRM Core.
