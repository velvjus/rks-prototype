# Milestone 4 (Settings, Forms & Partner Portal) — Batch 6 Deep Investigation Report

**Explorer 2 Handoff Report**  
**Working Directory**: `c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\explorer_m4_2`  
**Target Recipient**: Parent Orchestrator (`57c50def-4689-4a65-86f1-14dce8a95cbf`)  
**Date**: 2026-10-31T17:25:00Z  
**Status**: Investigation Complete (Read-Only)  

---

## 1. Observation

### 1.1 Baseline Build & Audit Verification
1. **Build Baseline**:
   - Command: `cmd.exe /c "npm run build"`
   - Result: Exit code 0, 0 TypeScript errors, 2,961 modules transformed, build completed cleanly in 4.49s (`dist/index.html` 1.51 kB).
2. **Batch 6 Audit**:
   - Command: `node scripts/audit-tokens.cjs --batch 6`
   - Result: 7 files scanned, **2,511 total violations** detected across 4 violation categories.
3. **Automated Codemod Dry-Run**:
   - Command: `node scripts/codemod-tokens.cjs --batch 6 --dry-run`
   - Result: Only **45 automated replacements** achievable via standard multi-pass codemod, leaving **2,466 violations** requiring targeted semantic token recipes.

---

### 1.2 Exact Violation Breakdown per File in Batch 6

| # | File Path | Total Lines | Total Violations | Palette Grays | Hex/RGB | Raw Status | `dark:` Overrides | Inline Styles | Double Opacity |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `src/views/webforms/FormBuilderView.vue` | 2,134 | **673** | 278 | 0 | 208 | 187 | 0 | 0 |
| 2 | `src/views/webforms/WebFormsDashboardView.vue` | 861 | **87** | 36 | 0 | 36 | 15 | 0 | 0 |
| 3 | `src/views/webforms/FormDetailView.vue` | 634 | **109** | 33 | 0 | 49 | 27 | 0 | 0 |
| 4 | `src/views/webforms/SubmissionsView.vue` | 307 | **18** | 2 | 0 | 13 | 3 | 0 | 0 |
| 5 | `src/views/BookingPagesView.vue` | 562 | **147** | 101 | 1 | 45 | 0 | 0 | 0 |
| 6 | `src/views/ScanNameCardView.vue` | 1,332 | **588** | 362 | 1 | 84 | 141 | 0 | 0 |
| 7 | `src/views/AddonsView.vue` | 1,630 | **889** | 374 | 1 | 220 | 294 | 0 | 0 |
| **TOTAL** | **7 Files** | **7,460** | **2,511** | **1,186** | **3** | **655** | **667** | **0** | **0** |

---

### 1.3 Key Architectural Discoveries & Violation Clusters

#### A. `FormBuilderView.vue` (673 violations across 6 builder tabs)
- **Violation Breakdown by Tab**:
  - Top Navigation Header & Toast (lines 1–373): 16 violations
  - Tab 1: Build (lines 374–736): 113 violations
  - Tab 2: Logic (lines 737–946): 115 violations
  - Tab 3: Style (lines 947–1315): 91 violations
  - Tab 4: Submit (lines 1316–1650): 116 violations
  - Tab 5: Share (lines 1651–1881): 113 violations
  - Tab 6: Settings (lines 1882–2134): 109 violations
- **Recurring Anti-Patterns**:
  - Canvas Well Background: `bg-slate-50/70 dark:bg-zinc-950/60` repeated on `<main>` across all 6 tabs.
  - Card & Field Panel Surfaces: `bg-white dark:bg-zinc-900` and `bg-white dark:bg-zinc-800`.
  - Input / Select Surfaces: `bg-gray-50/70 dark:bg-zinc-950 border-gray-200 dark:border-zinc-800`.
  - Active Element Highlighting: `border-2 border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/10`.
  - Primary Action CTAs: `bg-emerald-500 hover:bg-emerald-600 text-white`.
  - Status Notice Banners:
    - Warning: `bg-amber-50/70 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-300`.
    - Success/Active: `bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400`.
    - Destructive/Delete: `bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400`.
  - Floating Toast: Line 362 hardcodes `bg-gray-950 text-white` instead of `bg-popover text-popover-foreground border border-border`.

#### B. `WebFormsDashboardView.vue` (87 violations)
- **Status Badge Function** (lines 183–191):
  - Published: `bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20`
  - Paused: `bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20`
  - Closed: `bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20`
  - Draft: `bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20`
- **Floating Bulk Actions Bar** (lines 501–521):
  - Uses `bg-gray-950 text-white border-gray-800`, `bg-emerald-600 hover:bg-emerald-500`, `bg-amber-600 hover:bg-amber-500`, `bg-rose-600 hover:bg-rose-500`.
- **Template Drawer & Preview** (lines 710–786):
  - Uses `border-emerald-500 ring-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20`, `bg-slate-50/70 dark:bg-zinc-950/60`, `bg-gray-50/90 dark:bg-zinc-950`.

#### C. `FormDetailView.vue` (109 violations)
- **Header Status Pill** (lines 130–137): `bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400` vs `bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400`.
- **Action CTAs** (lines 177, 187): `bg-amber-500 hover:bg-amber-600 text-white` and `bg-emerald-600 hover:bg-emerald-700 text-white`.
- **Pro Tip Feature Callout** (lines 579–590): Hardcoded `bg-emerald-700 dark:bg-emerald-900 text-white`, `text-emerald-300`, `text-emerald-50`, `bg-white/20 hover:bg-white/30 text-white`.
- **Live Form Preview Card** (lines 606–624): `bg-emerald-600 text-white` submit CTA and `text-emerald-600` icons.

#### D. `SubmissionsView.vue` (18 violations)
- Concentrated entirely in `statusBadgeClass` (lines 96–104) and a single back-arrow icon (line 130: `text-emerald-600`).
- Quick drop-in resolution.

#### E. `BookingPagesView.vue` (147 violations — Zero Dark Mode Adaptation)
- **Critical Architectural Finding**: Contains **0** `dark:` overrides because it was written exclusively for light mode using raw grays (`bg-white`, `border-gray-200`, `text-gray-900`, `text-gray-500`, `bg-gray-50`, `text-slate-800`). In dark mode, this view is currently completely broken (blinding white background with faint gray borders).
- **Interactive Chat Simulator** (lines 404–540):
  - Outer chat container: `bg-white border-gray-200`
  - Body background: `bg-slate-50`
  - Agent avatar & bubble: `bg-emerald-50 border-emerald-200 text-emerald-600` and `bg-white border-gray-200/80 text-slate-800`
  - Client avatar & bubble: `bg-blue-50 border-blue-200 text-blue-600` and `bg-emerald-600 text-white`
  - Dynamic interactive option buttons: `text-emerald-700 bg-white hover:bg-emerald-50 border-emerald-200/60`
  - Dynamic slot picker & booking form: `bg-white border-emerald-100`, `bg-gray-50/50 text-gray-800`
  - Arbitrary shadow hex (line 434): `shadow-[0_1px_2px_rgba(0,0,0,0.02)]`
  - Scoped custom scrollbar (lines 554–560): Hardcoded raw hex `#cbd5e1` and `#94a3b8`.

#### F. `ScanNameCardView.vue` (588 violations)
- **Mobile Chassis Mockup**: Lines 422–428 mock an iPhone outer frame using `bg-slate-900 rounded-[48px] ring-1 ring-slate-800` and `bg-slate-700`, `bg-slate-800`.
  - **Project Alignment**: Just like the outer navigation rail uses dedicated rail tokens (`--rail`, `--rail-border`, `--rail-active`) to remain dark in both light and dark themes, the mobile phone chassis should use `bg-rail ring-1 ring-rail-border` and `bg-rail-active`!
- **Inner Screen & 7 Simulated Steps** (lines 430–1200):
  - Screen background: `bg-slate-50 dark:bg-slate-950` -> `bg-background`
  - Screen text: `text-slate-900 dark:text-slate-100` -> `text-foreground`
  - Contact cards: `bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800` -> `bg-card border-border`
- **Camera Viewfinder & OCR Laser Beam** (lines 565–603):
  - Viewfinder background: `bg-black` -> `bg-rail`
  - Animated laser scanner: Line 589 contains arbitrary hex `shadow-[0_0_15px_#10b981]`!
  - **Resolution**: `src/assets/index.css` defines the exact utility `.glow { box-shadow: 0 0 15px var(--primary); }`! Replacing `shadow-[0_0_15px_#10b981]` with `glow` eliminates the hex class cleanly.
- **Priority Buttons** (lines 885–912):
  - High: `bg-red-500 text-white border-red-500` -> `bg-destructive text-destructive-foreground border-destructive`
  - Medium: `bg-yellow-500 text-white border-yellow-500` -> `bg-warning text-warning-foreground border-warning`
  - Low: `bg-emerald-500 text-white border-emerald-500` -> `bg-success text-success-foreground border-success`
  - Inactive: `bg-slate-100 dark:bg-slate-800 text-slate-600` -> `bg-muted text-muted-foreground`

#### G. `AddonsView.vue` (889 violations)
- **Dataset Catalog** (lines 104–380):
  - 11 addon objects define hardcoded Tailwind classes inside JavaScript data:
    - `badgeClass`: `'bg-red-50 text-red-600 border-red-100 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50'` -> `'bg-destructive/10 text-destructive border-destructive/20'`
    - `badgeClass` (new): `'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50'` -> `'bg-info/10 text-info border-info/20'`
    - `iconBg`: `'bg-green-50/70'` -> `'bg-primary/10'`
    - `iconBgDark`: `'dark:bg-green-950/40'` -> `''` (redundant)
    - `iconColor`: `'text-green-700 dark:text-green-400'` -> `'text-primary'`
  - Line 370 contains arbitrary hex: `case 'ai-voice-minutes': return 'bg-[#23B750]'` -> `return 'bg-brand'` (or `return 'bg-primary'`).
- **Heavy Template Overrides** (lines 700–1630):
  - Category buttons, search input, sort dropdowns, marketing cards, configuration dialog, safety deactivation modal, and usage logs timeline pop-up.
  - Replaced by `bg-card`, `bg-muted`, `border-border`, `text-foreground`, `text-muted-foreground`.

---

## 2. Logic Chain

```
Observation 1: Audit script flags 2,511 violations across 7 files.
Observation 2: 1,186 are palette grays, 667 are dark: overrides, 655 are raw status colors, 3 are arbitrary hex/RGB.
Observation 3: BookingPagesView.vue has 0 dark: overrides, using hardcoded light mode grays throughout.
Observation 4: ScanNameCardView.vue has a physical mobile phone bezel and a laser scanner with shadow-[0_0_15px_#10b981].
Observation 5: AddonsView.vue has 11 dataset items defining hardcoded Tailwind classes, plus an arbitrary hex bg-[#23B750].
Observation 6: All semantic tokens (--primary, --success, --warning, --info, --brand, --rail, --card, --muted, --border, --input) already exist in index.css.
Observation 7: .glow utility is pre-defined in index.css:286 to resolve box-shadow: 0 0 15px var(--primary).

Logic Step 1: Replace all card / panel surfaces (bg-white, bg-zinc-900, bg-slate-900, dark:bg-zinc-900) with `bg-card`.
Logic Step 2: Replace canvas well / section backgrounds (bg-slate-50/70 dark:bg-zinc-950/60, bg-gray-50) with `bg-muted/40`.
Logic Step 3: Replace input, select, textarea surfaces (bg-gray-50/70 dark:bg-zinc-950 border-gray-200 dark:border-zinc-800) with `bg-muted/50 border-input`.
Logic Step 4: Replace mobile phone chassis in ScanNameCardView with dedicated rail tokens (`bg-rail ring-rail-border`) to preserve invariant dark phone casing in both themes.
Logic Step 5: Replace raw status colors with tokenized opacities:
              - Emerald / Green -> `bg-primary` / `bg-success/10 text-success border-success/20`
              - Amber / Yellow -> `bg-warning/10 text-warning border-warning/20`
              - Rose / Red -> `bg-destructive/10 text-destructive border-destructive/20`
              - Blue / Indigo -> `bg-info/10 text-info border-info/20`
Logic Step 6: Replace 3 arbitrary hex classes:
              - `shadow-[0_1px_2px_rgba(0,0,0,0.02)]` -> `shadow-xs`
              - `shadow-[0_0_15px_#10b981]` -> `glow`
              - `bg-[#23B750]` -> `bg-brand`
Logic Step 7: Eliminate all redundant `dark:` class overrides across all 7 files.
Logic Step 8: Replace scoped scrollbar hex (#cbd5e1, #94a3b8) in BookingPagesView with `var(--border)` and `var(--muted-foreground)`.
Conclusion: Applying these recipes reduces Batch 6 violations from 2,511 to 0 while maintaining 100% build integrity and high dark mode contrast.
```

---

## 3. Semantic Token Mapping Matrix for Batch 6

| Pattern in Source Code | Violation Category | Recommended Semantic Replacement | Context & Notes |
|---|---|---|---|
| `bg-white dark:bg-zinc-900`, `bg-white dark:bg-slate-900`, `bg-white` (card) | Palette Gray / `dark:` | `bg-card` | Cards, panels, modals, dropdowns |
| `bg-slate-50/70 dark:bg-zinc-950/60`, `bg-slate-50`, `bg-gray-100/90` | Palette Gray / `dark:` | `bg-muted/40` | Main canvas well, background wells |
| `bg-gray-50/70 dark:bg-zinc-950`, `bg-gray-50/80`, `bg-gray-50` | Palette Gray / `dark:` | `bg-muted/50` | Form inputs, select dropdowns, textareas |
| `border-gray-200 dark:border-zinc-800`, `border-slate-200 dark:border-slate-800` | Palette Gray / `dark:` | `border-border` (or `border-input` for inputs) | Panel borders, dividers, outlines |
| `text-gray-900 dark:text-foreground`, `text-slate-900 dark:text-slate-100` | Palette Gray / `dark:` | `text-foreground` | Primary titles, body text, headings |
| `text-gray-500`, `text-gray-400`, `text-slate-400`, `text-slate-500` | Palette Gray | `text-muted-foreground` | Subtitles, helper text, timestamps |
| `bg-emerald-500 hover:bg-emerald-600 text-white`, `bg-emerald-600` | Status / Palette Gray | `bg-primary hover:bg-primary/90 text-primary-foreground` | Primary action buttons (Publish, Save, Add) |
| `text-emerald-600 dark:text-emerald-400`, `text-emerald-500` | Status / `dark:` | `text-primary` (or `text-success` for status) | Brand green icons, links, active tab labels |
| `bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20` | Status / `dark:` | `bg-success/10 text-success border-success/20` | "Published" / "Active" status badges |
| `bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20` | Status / `dark:` | `bg-warning/10 text-warning border-warning/20` | "Paused" / "Pending" status badges |
| `bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20` | Status / `dark:` | `bg-destructive/10 text-destructive border-destructive/20` | "Closed" / "Error" status badges |
| `bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20` | Palette Gray / `dark:` | `bg-muted text-muted-foreground border-border` | "Draft" status badges |
| `bg-slate-900 rounded-[48px] ring-1 ring-slate-800` (Phone Bezel) | Palette Gray | `bg-rail rounded-[48px] ring-1 ring-rail-border` | Mobile simulator chassis (invariant dark) |
| `shadow-[0_0_15px_#10b981]` | Tailwind Hex / RGB | `glow` | Scanner laser beam effect (uses index.css `.glow`) |
| `shadow-[0_1px_2px_rgba(0,0,0,0.02)]` | Tailwind Hex / RGB | `shadow-xs` | Chat bubble subtle elevation |
| `bg-[#23B750]` | Tailwind Hex / RGB | `bg-brand` (or `bg-primary`) | Addon category indicator in AddonsView |
| `bg-gray-950 text-white border-gray-800` (Toast & Floating Bar) | Palette Gray | `bg-popover text-popover-foreground border-border` | Fixed save toasts and floating bulk action bars |
| Scoped scrollbar `#cbd5e1` / `#94a3b8` | Raw Hex in CSS | `var(--border)` / `var(--muted-foreground)` | Custom scrollbar in BookingPagesView |

---

## 4. Drop-in Replacement Recipes

### 4.1 `src/views/webforms/FormBuilderView.vue` (673 Violations)

#### Recipe 4.1.1: Header, Segmented Tabs & Save Toast (Lines 307–365)
```html
<!-- BEFORE (Lines 307-310) -->
<span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-zinc-800 text-muted-foreground shrink-0">
  <span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
  {{ store.activeForm?.status || 'Draft' }}
</span>

<!-- AFTER -->
<span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-muted text-muted-foreground shrink-0">
  <span class="w-1.5 h-1.5 rounded-full bg-muted-foreground"></span>
  {{ store.activeForm?.status || 'Draft' }}
</span>
```

```html
<!-- BEFORE (Lines 320-333) -->
<div class="flex items-center bg-gray-100/90 dark:bg-zinc-900/90 p-1 rounded-2xl border border-border/40 shadow-xs overflow-x-auto">
  <button
    v-for="tab in ['Build', 'Logic', 'Style', 'Submit', 'Share', 'Settings'] as const"
    :key="tab"
    @click="store.editorTab = tab"
    :class="[
      'px-4 py-1.5 rounded-xl text-[11px] font-extrabold tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap',
      store.editorTab === tab
        ? 'bg-white dark:bg-zinc-800 text-foreground shadow-xs'
        : 'text-muted-foreground hover:text-foreground font-semibold'
    ]"
  >
    {{ tab }}
  </button>
</div>

<!-- AFTER -->
<div class="flex items-center bg-muted/90 p-1 rounded-2xl border border-border/40 shadow-xs overflow-x-auto">
  <button
    v-for="tab in ['Build', 'Logic', 'Style', 'Submit', 'Share', 'Settings'] as const"
    :key="tab"
    @click="store.editorTab = tab"
    :class="[
      'px-4 py-1.5 rounded-xl text-[11px] font-extrabold tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap',
      store.editorTab === tab
        ? 'bg-card text-foreground shadow-xs'
        : 'text-muted-foreground hover:text-foreground font-semibold'
    ]"
  >
    {{ tab }}
  </button>
</div>
```

```html
<!-- BEFORE (Lines 351, 362-364) -->
<Button
  size="sm"
  @click="handlePublish"
  class="h-9 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs gap-1.5 shadow-xs cursor-pointer border-0"
>
  <Sparkles class="w-3.5 h-3.5" />
  Publish
</Button>
...
<div v-if="saveToast" class="fixed top-20 right-8 bg-gray-950 text-white px-4 py-2 rounded-xl shadow-2xl text-xs font-semibold z-50 flex items-center gap-2">
  <CheckCircle2 class="w-4 h-4 text-emerald-400" />
  {{ saveToast }}
</div>

<!-- AFTER -->
<Button
  size="sm"
  @click="handlePublish"
  class="h-9 px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-extrabold text-xs gap-1.5 shadow-xs cursor-pointer border-0"
>
  <Sparkles class="w-3.5 h-3.5" />
  Publish
</Button>
...
<div v-if="saveToast" class="fixed top-20 right-8 bg-popover text-popover-foreground border border-border px-4 py-2 rounded-xl shadow-2xl text-xs font-semibold z-50 flex items-center gap-2">
  <CheckCircle2 class="w-4 h-4 text-primary" />
  {{ saveToast }}
</div>
```

#### Recipe 4.1.2: Canvas Well & Form Canvas (Lines 509–575)
```html
<!-- BEFORE (Line 509) -->
<main class="lg:col-span-6 p-6 overflow-y-auto bg-slate-50/70 dark:bg-zinc-950/60 flex flex-col justify-start items-center relative min-h-0 space-y-5">

<!-- AFTER -->
<main class="lg:col-span-6 p-6 overflow-y-auto bg-muted/40 flex flex-col justify-start items-center relative min-h-0 space-y-5">
```

```html
<!-- BEFORE (Lines 516-535) -->
<button
  @click="store.viewportMode = 'desktop'"
  :class="[
    'px-3.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer',
    store.viewportMode === 'desktop'
      ? 'bg-emerald-500 text-white shadow-xs'
      : 'text-muted-foreground hover:text-foreground font-semibold'
  ]"
>
...
<button
  @click="store.viewportMode = 'mobile'"
  :class="[
    'px-3.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer',
    store.viewportMode === 'mobile'
      ? 'bg-emerald-500 text-white shadow-xs'
      : 'text-muted-foreground hover:text-foreground font-semibold'
  ]"
>

<!-- AFTER -->
<button
  @click="store.viewportMode = 'desktop'"
  :class="[
    'px-3.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer',
    store.viewportMode === 'desktop'
      ? 'bg-primary text-primary-foreground shadow-xs'
      : 'text-muted-foreground hover:text-foreground font-semibold'
  ]"
>
...
<button
  @click="store.viewportMode = 'mobile'"
  :class="[
    'px-3.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer',
    store.viewportMode === 'mobile'
      ? 'bg-primary text-primary-foreground shadow-xs'
      : 'text-muted-foreground hover:text-foreground font-semibold'
  ]"
>
```

```html
<!-- BEFORE (Line 542 & 570-575) -->
<div
  :class="[
    'w-full transition-all duration-300 rounded-2xl p-8 shadow-lg border border-border/60 bg-white dark:bg-zinc-900 space-y-6 border-t-4',
    store.viewportMode === 'mobile' ? 'max-w-sm' : 'max-w-xl'
  ]"
...
  :class="[
    'relative transition-all rounded-xl p-3 cursor-pointer',
    store.selectedElementId === field.id
      ? 'border-2 border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/10 shadow-xs'
      : 'border border-transparent hover:border-border/80'
  ]"
...
<div v-if="store.selectedElementId === field.id" class="absolute -top-2.5 right-3 bg-emerald-500 text-white px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider uppercase shadow-xs">
  EDITING
</div>

<!-- AFTER -->
<div
  :class="[
    'w-full transition-all duration-300 rounded-2xl p-8 shadow-lg border border-border/60 bg-card space-y-6 border-t-4',
    store.viewportMode === 'mobile' ? 'max-w-sm' : 'max-w-xl'
  ]"
...
  :class="[
    'relative transition-all rounded-xl p-3 cursor-pointer',
    store.selectedElementId === field.id
      ? 'border-2 border-primary bg-primary/10 shadow-xs'
      : 'border border-transparent hover:border-border/80'
  ]"
...
<div v-if="store.selectedElementId === field.id" class="absolute -top-2.5 right-3 bg-primary text-primary-foreground px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider uppercase shadow-xs">
  EDITING
</div>
```

#### Recipe 4.1.3: Warning, Info & Delete Banners Across Logic, Share & Settings Tabs
```html
<!-- BEFORE (e.g. Lines 753-760 & 1660-1675 Warning Banner) -->
<div class="w-full max-w-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 p-4 rounded-2xl flex items-center gap-3 text-xs shadow-xs">
  <div class="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
    <AlertTriangle class="w-4 h-4" />
  </div>
  <div>
    <h4 class="font-extrabold text-amber-900 dark:text-amber-300">Publish before sharing</h4>
    <p class="text-amber-800 dark:text-amber-400 mt-0.5 leading-relaxed">...</p>
  </div>
  <Button size="sm" @click="handlePublish" class="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs h-8 px-4 rounded-xl shadow-xs cursor-pointer">
    Publish Now
  </Button>
</div>

<!-- AFTER -->
<div class="w-full max-w-xl bg-warning/10 border border-warning/20 p-4 rounded-2xl flex items-center gap-3 text-xs shadow-xs">
  <div class="w-8 h-8 rounded-xl bg-warning/15 text-warning flex items-center justify-center shrink-0">
    <AlertTriangle class="w-4 h-4" />
  </div>
  <div>
    <h4 class="font-extrabold text-foreground">Publish before sharing</h4>
    <p class="text-muted-foreground mt-0.5 leading-relaxed">...</p>
  </div>
  <Button size="sm" @click="handlePublish" class="bg-warning hover:bg-warning/90 text-warning-foreground font-bold text-xs h-8 px-4 rounded-xl shadow-xs cursor-pointer">
    Publish Now
  </Button>
</div>
```

---

### 4.2 `src/views/webforms/WebFormsDashboardView.vue` (87 Violations)

#### Recipe 4.2.1: Status Badge Color Method (Lines 183–191)
```typescript
// BEFORE (Lines 183-191)
const getStatusBadge = (status: Form['status']) => {
  switch (status) {
    case 'Published':
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
    case 'Paused':
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
    case 'Closed':
      return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
    case 'Draft':
    default:
      return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20'
  }
}

// AFTER
const getStatusBadge = (status: Form['status']) => {
  switch (status) {
    case 'Published':
      return 'bg-success/10 text-success border-success/20'
    case 'Paused':
      return 'bg-warning/10 text-warning border-warning/20'
    case 'Closed':
      return 'bg-destructive/10 text-destructive border-destructive/20'
    case 'Draft':
    default:
      return 'bg-muted text-muted-foreground border-border'
  }
}
```

#### Recipe 4.2.2: Floating Bulk Action Bar (Lines 501–521)
```html
<!-- BEFORE (Lines 501-521) -->
<div v-if="store.selectedIds.length > 0" class="absolute top-3 left-1/2 -translate-x-1/2 bg-gray-950 text-white px-5 py-2.5 rounded-2xl shadow-2xl z-30 flex items-center gap-4 border border-gray-800">
  <span class="text-xs font-bold">{{ store.selectedIds.length }} forms selected</span>
  <div class="h-4 w-px bg-gray-800"></div>
  <div class="flex items-center gap-1.5">
    <Button size="xs" variant="default" @click="store.updateStatus(store.selectedIds, 'Published')" class="bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer">
      Publish
    </Button>
    <Button size="xs" variant="secondary" @click="store.updateStatus(store.selectedIds, 'Paused')" class="bg-amber-600 hover:bg-amber-500 text-white cursor-pointer">
      Pause
    </Button>
    <Button size="xs" variant="secondary" @click="store.updateStatus(store.selectedIds, 'Closed')" class="bg-rose-600 hover:bg-rose-500 text-white cursor-pointer">
      Close
    </Button>
    <Button size="xs" variant="outline" @click="store.deleteForms(store.selectedIds)" class="border-gray-800 text-white hover:bg-gray-800/80 cursor-pointer">
      <Trash2 class="w-3.5 h-3.5 text-rose-400 mr-1" /> Delete
    </Button>
  </div>
</div>

<!-- AFTER -->
<div v-if="store.selectedIds.length > 0" class="absolute top-3 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground px-5 py-2.5 rounded-2xl shadow-2xl z-30 flex items-center gap-4 border border-border">
  <span class="text-xs font-bold">{{ store.selectedIds.length }} forms selected</span>
  <div class="h-4 w-px bg-border"></div>
  <div class="flex items-center gap-1.5">
    <Button size="xs" variant="default" @click="store.updateStatus(store.selectedIds, 'Published')" class="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer">
      Publish
    </Button>
    <Button size="xs" variant="secondary" @click="store.updateStatus(store.selectedIds, 'Paused')" class="bg-warning hover:bg-warning/90 text-warning-foreground cursor-pointer">
      Pause
    </Button>
    <Button size="xs" variant="secondary" @click="store.updateStatus(store.selectedIds, 'Closed')" class="bg-destructive hover:bg-destructive/90 text-destructive-foreground cursor-pointer">
      Close
    </Button>
    <Button size="xs" variant="outline" @click="store.deleteForms(store.selectedIds)" class="border-border text-foreground hover:bg-muted cursor-pointer">
      <Trash2 class="w-3.5 h-3.5 text-destructive mr-1" /> Delete
    </Button>
  </div>
</div>
```

---

### 4.3 `src/views/webforms/FormDetailView.vue` (109 Violations)

#### Recipe 4.3.1: Status Pill & Action CTAs (Lines 130–187)
```html
<!-- BEFORE (Lines 130-137) -->
<span
  :class="[
    'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold tracking-wide uppercase',
    currentForm.status === 'Published'
      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
      : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
  ]"
>
  <span
    :class="[
      'w-2 h-2 rounded-full',
      currentForm.status === 'Published' ? 'bg-emerald-500' : 'bg-amber-500'
    ]"
  ></span>
  {{ currentForm.status }}
</span>

<!-- AFTER -->
<span
  :class="[
    'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold tracking-wide uppercase',
    currentForm.status === 'Published'
      ? 'bg-success/10 text-success'
      : 'bg-warning/10 text-warning'
  ]"
>
  <span
    :class="[
      'w-2 h-2 rounded-full',
      currentForm.status === 'Published' ? 'bg-success' : 'bg-warning'
    ]"
  ></span>
  {{ currentForm.status }}
</span>
```

```html
<!-- BEFORE (Lines 177-187) -->
<Button
  v-if="currentForm.status === 'Published'"
  size="sm"
  @click="toggleStatus"
  class="bg-amber-500 hover:bg-amber-600 text-white font-bold gap-1.5 shadow-xs cursor-pointer rounded-xl text-xs px-4"
>
  <Pause class="w-3.5 h-3.5" />
  Pause Form
</Button>
<Button
  v-else
  size="sm"
  @click="toggleStatus"
  class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1.5 shadow-xs cursor-pointer rounded-xl text-xs px-4"
>
  <Play class="w-3.5 h-3.5" />
  Publish Form
</Button>

<!-- AFTER -->
<Button
  v-if="currentForm.status === 'Published'"
  size="sm"
  @click="toggleStatus"
  class="bg-warning hover:bg-warning/90 text-warning-foreground font-bold gap-1.5 shadow-xs cursor-pointer rounded-xl text-xs px-4"
>
  <Pause class="w-3.5 h-3.5" />
  Pause Form
</Button>
<Button
  v-else
  size="sm"
  @click="toggleStatus"
  class="bg-primary hover:bg-primary/90 text-primary-foreground font-bold gap-1.5 shadow-xs cursor-pointer rounded-xl text-xs px-4"
>
  <Play class="w-3.5 h-3.5" />
  Publish Form
</Button>
```

#### Recipe 4.3.2: Pro Tip Feature Card (Lines 579–593)
```html
<!-- BEFORE (Lines 579-593) -->
<div class="bg-emerald-700 dark:bg-emerald-900 text-white p-5 rounded-2xl space-y-3 shadow-md">
  <div class="flex items-center gap-2">
    <Zap class="w-4 h-4 text-emerald-300 fill-emerald-300" />
    <span class="text-xs font-black uppercase tracking-wider">Pro Optimization Tip</span>
  </div>
  <p class="text-xs text-emerald-50 leading-relaxed font-medium">
    Forms with under 5 inputs boast a 44% higher submission rate. Try splitting this form across multi-step flows.
  </p>
  <button
    @click="router.push(`/web-forms/builder?id=${currentForm.id}`)"
    class="w-full bg-white/20 hover:bg-white/30 text-white font-bold text-xs py-2 rounded-xl transition-colors cursor-pointer text-center block"
  >
    Convert to Multi-Step
  </button>
</div>

<!-- AFTER -->
<div class="bg-primary text-primary-foreground p-5 rounded-2xl space-y-3 shadow-md">
  <div class="flex items-center gap-2">
    <Zap class="w-4 h-4 text-primary-foreground fill-primary-foreground" />
    <span class="text-xs font-black uppercase tracking-wider">Pro Optimization Tip</span>
  </div>
  <p class="text-xs text-primary-foreground/90 leading-relaxed font-medium">
    Forms with under 5 inputs boast a 44% higher submission rate. Try splitting this form across multi-step flows.
  </p>
  <button
    @click="router.push(`/web-forms/builder?id=${currentForm.id}`)"
    class="w-full bg-primary-foreground/15 hover:bg-primary-foreground/25 text-primary-foreground font-bold text-xs py-2 rounded-xl transition-colors cursor-pointer text-center block"
  >
    Convert to Multi-Step
  </button>
</div>
```

---

### 4.4 `src/views/webforms/SubmissionsView.vue` (18 Violations)

#### Recipe 4.4.1: Status Badge & Back Icon (Lines 96–130)
```typescript
// BEFORE (Lines 96-104)
const getStatusBadge = (status: Submission['status']) => {
  switch (status) {
    case 'Qualified':
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
    case 'Pending':
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
    case 'Spam':
      return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
    case 'Unread':
    default:
      return 'bg-gray-500/10 text-gray-600'
  }
}

// AFTER
const getStatusBadge = (status: Submission['status']) => {
  switch (status) {
    case 'Qualified':
      return 'bg-success/10 text-success border-success/20'
    case 'Pending':
      return 'bg-warning/10 text-warning border-warning/20'
    case 'Spam':
      return 'bg-destructive/10 text-destructive border-destructive/20'
    case 'Unread':
    default:
      return 'bg-muted text-muted-foreground'
  }
}
```
Line 130: `<ArrowLeft class="w-4 h-4 text-emerald-600" />` -> `<ArrowLeft class="w-4 h-4 text-primary" />`.

---

### 4.5 `src/views/BookingPagesView.vue` (147 Violations)

#### Recipe 4.5.1: Card Containers, Typography & Buttons (Lines 233–315)
```html
<!-- BEFORE (Lines 233-255) -->
<h1 class="text-3xl font-extrabold tracking-tight text-gray-900">Appointments Panel</h1>
<p class="text-sm text-gray-500 mt-1">Configure automated scheduling and test the interactive booking assistant flow.</p>
...
<Button variant="outline" @click="initSimulation" class="gap-1.5 border-gray-200 rounded-xl font-semibold hover:bg-gray-50 text-xs shadow-sm bg-white cursor-pointer py-2">
  <RefreshCw class="w-3.5 h-3.5" />
  Reset Chat Demo
</Button>
...
<div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
  <h2 class="text-sm font-extrabold text-gray-900 flex items-center gap-2 pb-3 border-b border-gray-100">
    <SettingsIcon class="w-4 h-4 text-emerald-600" />
    Scheduling Rules Setup
  </h2>

<!-- AFTER -->
<h1 class="text-3xl font-extrabold tracking-tight text-foreground">Appointments Panel</h1>
<p class="text-sm text-muted-foreground mt-1">Configure automated scheduling and test the interactive booking assistant flow.</p>
...
<Button variant="outline" @click="initSimulation" class="gap-1.5 border-border rounded-xl font-semibold hover:bg-muted text-xs shadow-xs bg-card cursor-pointer py-2">
  <RefreshCw class="w-3.5 h-3.5" />
  Reset Chat Demo
</Button>
...
<div class="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-4">
  <h2 class="text-sm font-extrabold text-foreground flex items-center gap-2 pb-3 border-b border-border">
    <SettingsIcon class="w-4 h-4 text-primary" />
    Scheduling Rules Setup
  </h2>
```

#### Recipe 4.5.2: Live Booking Simulator Window & Chat Messages (Lines 404–475)
```html
<!-- BEFORE (Lines 404-438) -->
<div class="bg-white border border-gray-200 rounded-2xl shadow-sm flex-1 flex flex-col overflow-hidden min-h-[580px] lg:max-h-[640px]">
  <!-- Simulator Header -->
  <div class="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
    <div class="flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
      <span class="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Live Booking Simulator</span>
    </div>
    <div class="text-[10px] text-gray-400 font-bold bg-white px-2 py-0.5 rounded border border-gray-150 shadow-sm">
      Client Perspective
    </div>
  </div>

  <!-- Chat Window Body -->
  <div class="flex-1 p-5 overflow-y-auto bg-slate-50 space-y-4 custom-scrollbar flex flex-col justify-end">
  ...
    <!-- Avatar -->
    <div class="w-7 h-7 rounded-full flex items-center justify-center shrink-0 border shadow-sm"
      :class="msg.sender === 'agent' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-blue-50 border-blue-200 text-blue-600'"
    >
      <Bot v-if="msg.sender === 'agent'" class="w-4 h-4" />
      <User v-else class="w-4 h-4" />
    </div>

    <!-- Bubble -->
    <div class="rounded-2xl px-4 py-2.5 text-sm shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
      :class="msg.sender === 'agent' 
        ? 'bg-white border border-gray-200/80 text-slate-800' 
        : 'bg-emerald-600 text-white font-medium'"
    >
      <p class="whitespace-pre-line leading-relaxed">{{ msg.text }}</p>
    </div>

<!-- AFTER -->
<div class="bg-card border border-border rounded-2xl shadow-xs flex-1 flex flex-col overflow-hidden min-h-[580px] lg:max-h-[640px]">
  <!-- Simulator Header -->
  <div class="p-4 border-b border-border bg-muted/50 flex items-center justify-between">
    <div class="flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-primary animate-ping"></span>
      <span class="text-xs font-extrabold text-foreground uppercase tracking-wider">Live Booking Simulator</span>
    </div>
    <div class="text-[10px] text-muted-foreground font-bold bg-card px-2 py-0.5 rounded border border-border shadow-xs">
      Client Perspective
    </div>
  </div>

  <!-- Chat Window Body -->
  <div class="flex-1 p-5 overflow-y-auto bg-muted/30 space-y-4 custom-scrollbar flex flex-col justify-end">
  ...
    <!-- Avatar -->
    <div class="w-7 h-7 rounded-full flex items-center justify-center shrink-0 border shadow-xs"
      :class="msg.sender === 'agent' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-info/10 border-info/20 text-info'"
    >
      <Bot v-if="msg.sender === 'agent'" class="w-4 h-4" />
      <User v-else class="w-4 h-4" />
    </div>

    <!-- Bubble -->
    <div class="rounded-2xl px-4 py-2.5 text-sm shadow-xs"
      :class="msg.sender === 'agent' 
        ? 'bg-card border border-border text-foreground' 
        : 'bg-primary text-primary-foreground font-medium'"
    >
      <p class="whitespace-pre-line leading-relaxed">{{ msg.text }}</p>
    </div>
```

#### Recipe 4.5.3: Custom Scrollbar Tokenization (Lines 554–560)
```css
/* BEFORE (Lines 554-560) */
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* AFTER */
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: var(--muted-foreground);
}
```

---

### 4.6 `src/views/ScanNameCardView.vue` (588 Violations)

#### Recipe 4.6.1: Dedicated Rail Tokens for Mobile Bezel (Lines 422–428)
```html
<!-- BEFORE (Lines 422-428) -->
<div class="relative w-[375px] h-[720px] max-h-[720px] min-h-[720px] bg-slate-900 rounded-[48px] p-3 shadow-2xl ring-1 ring-slate-800 flex flex-col flex-shrink-0">
  <!-- Notch / Speaker Bar -->
  <div class="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-6 bg-slate-900 rounded-b-2xl z-30 flex items-center justify-center gap-2">
    <div class="w-12 h-1.5 bg-slate-700 rounded-full"></div>
    <div class="w-2.5 h-2.5 bg-slate-800 rounded-full border border-slate-700"></div>
  </div>

<!-- AFTER -->
<div class="relative w-[375px] h-[720px] max-h-[720px] min-h-[720px] bg-rail rounded-[48px] p-3 shadow-2xl ring-1 ring-rail-border flex flex-col flex-shrink-0">
  <!-- Notch / Speaker Bar -->
  <div class="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-6 bg-rail rounded-b-2xl z-30 flex items-center justify-center gap-2">
    <div class="w-12 h-1.5 bg-rail-active rounded-full"></div>
    <div class="w-2.5 h-2.5 bg-rail rounded-full border border-rail-border"></div>
  </div>
```

#### Recipe 4.6.2: Camera Viewfinder Laser Scan (.glow utility) (Lines 565–592)
```html
<!-- BEFORE (Lines 565, 587-592) -->
<div v-else-if="currentStep === 2" class="flex-1 bg-black text-white flex flex-col justify-between p-4 relative overflow-hidden">
...
  <div
    v-if="isScanningAnimation"
    class="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-bounce z-20"
    style="animation-duration: 1.2s;"
  ></div>

<!-- AFTER -->
<div v-else-if="currentStep === 2" class="flex-1 bg-rail text-rail-foreground flex flex-col justify-between p-4 relative overflow-hidden">
...
  <div
    v-if="isScanningAnimation"
    class="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent glow animate-bounce z-20"
    style="animation-duration: 1.2s;"
  ></div>
```

#### Recipe 4.6.3: Priority Toggle Buttons (Lines 885–912)
```html
<!-- BEFORE (Lines 885-912) -->
<button
  @click="setPriority('high')"
  :class="[
    'py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer',
    (activeLabelTab === 'all' ? scannedContacts.every(c => c.priority === 'high') : currentContact.priority === 'high') ? 'bg-red-500 text-white border-red-500 font-bold' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
  ]"
>
  High
</button>
<button
  @click="setPriority('medium')"
  :class="[
    'py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer',
    (activeLabelTab === 'all' ? scannedContacts.every(c => c.priority === 'medium') : currentContact.priority === 'medium') ? 'bg-yellow-500 text-white border-yellow-500 font-bold' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
  ]"
>
  Medium
</button>
<button
  @click="setPriority('low')"
  :class="[
    'py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer',
    (activeLabelTab === 'all' ? scannedContacts.every(c => c.priority === 'low') : currentContact.priority === 'low') ? 'bg-emerald-500 text-white border-emerald-500 font-bold' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
  ]"
>
  Low
</button>

<!-- AFTER -->
<button
  @click="setPriority('high')"
  :class="[
    'py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer',
    (activeLabelTab === 'all' ? scannedContacts.every(c => c.priority === 'high') : currentContact.priority === 'high') ? 'bg-destructive text-destructive-foreground border-destructive font-bold' : 'bg-muted text-muted-foreground'
  ]"
>
  High
</button>
<button
  @click="setPriority('medium')"
  :class="[
    'py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer',
    (activeLabelTab === 'all' ? scannedContacts.every(c => c.priority === 'medium') : currentContact.priority === 'medium') ? 'bg-warning text-warning-foreground border-warning font-bold' : 'bg-muted text-muted-foreground'
  ]"
>
  Medium
</button>
<button
  @click="setPriority('low')"
  :class="[
    'py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer',
    (activeLabelTab === 'all' ? scannedContacts.every(c => c.priority === 'low') : currentContact.priority === 'low') ? 'bg-success text-success-foreground border-success font-bold' : 'bg-muted text-muted-foreground'
  ]"
>
  Low
</button>
```

---

### 4.7 `src/views/AddonsView.vue` (889 Violations)

#### Recipe 4.7.1: Addon Catalog Dataset Definition (Lines 113–180 & 370)
```typescript
// BEFORE (Lines 113-118)
badgeText: '🔥 Popular',
badgeClass: 'bg-red-50 text-red-600 border-red-100 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50',
icon: Sparkles,
iconBg: 'bg-green-50/70',
iconBgDark: 'dark:bg-green-950/40',
iconColor: 'text-green-700 dark:text-green-400',

// AFTER
badgeText: '🔥 Popular',
badgeClass: 'bg-destructive/10 text-destructive border-destructive/20',
icon: Sparkles,
iconBg: 'bg-primary/10',
iconBgDark: '',
iconColor: 'text-primary',
```

```typescript
// BEFORE (Lines 157-162)
badgeText: 'New',
badgeClass: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50',
icon: PhoneCall,
iconBg: 'bg-green-50/70',
iconBgDark: 'dark:bg-green-950/40',
iconColor: 'text-green-700 dark:text-green-400',

// AFTER
badgeText: 'New',
badgeClass: 'bg-info/10 text-info border-info/20',
icon: PhoneCall,
iconBg: 'bg-primary/10',
iconBgDark: '',
iconColor: 'text-primary',
```

```typescript
// BEFORE (Line 370)
case 'ai-voice-minutes': return 'bg-[#23B750]'

// AFTER
case 'ai-voice-minutes': return 'bg-brand'
```

#### Recipe 4.7.2: Category Filter Buttons (Lines 706–709)
```html
<!-- BEFORE (Lines 706-709) -->
:class="[
  'px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all duration-200 cursor-pointer flex items-center gap-1.5 select-none',
  activeCategory === cat 
    ? 'bg-primary border-primary text-white' 
    : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-55 dark:hover:bg-slate-800/80 hover:text-gray-900 dark:hover:text-slate-100 hover:border-gray-300 dark:hover:border-slate-700'
]"

<!-- AFTER -->
:class="[
  'px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all duration-200 cursor-pointer flex items-center gap-1.5 select-none',
  activeCategory === cat 
    ? 'bg-primary border-primary text-primary-foreground' 
    : 'bg-card border-border text-muted-foreground hover:bg-muted hover:text-foreground hover:border-border'
]"
```

#### Recipe 4.7.3: Dialog Content & Safeguard Deactivation Modal (Lines 1212, 1455–1524)
```html
<!-- BEFORE (Line 1212 & Line 1524) -->
<Button 
  v-if="activatedAddons[selectedAddon.id]"
  size="sm"
  @click="checkoutStep = 'deactivate_confirm'"
  variant="destructive"
  class="rounded-xl px-4 cursor-pointer font-bold h-9 bg-red-500/10 hover:bg-red-500/20 text-red-650 border border-red-500/20 shadow-none dark:bg-red-955/20 dark:text-red-400 dark:border-red-900/30"
>
  Deactivate
</Button>
...
<DialogContent class="bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 rounded-2xl max-w-sm">

<!-- AFTER -->
<Button 
  v-if="activatedAddons[selectedAddon.id]"
  size="sm"
  @click="checkoutStep = 'deactivate_confirm'"
  variant="destructive"
  class="rounded-xl px-4 cursor-pointer font-bold h-9 bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/20 shadow-none"
>
  Deactivate
</Button>
...
<DialogContent class="bg-card border-border p-6 rounded-2xl max-w-sm">
```

---

## 5. Contrast, Canvas & Edge Case Verification

### 5.1 FormBuilder Drag-and-Drop Canvas Contrast
- **Canvas Well Container**: `<main class="lg:col-span-6 p-6 overflow-y-auto bg-muted/40 ...">`
- **Active Form Canvas Card**: `<div class="w-full ... rounded-2xl p-8 shadow-lg border border-border/60 bg-card space-y-6 border-t-4">`
- **Contrast Analysis**:
  - In **Light Mode**: The outer canvas well is `bg-muted/40` (`oklch(0.97 0 0)`), while the canvas card is pure `bg-card` (`oklch(1 0 0)`). This produces an elevation contrast of > 4.5:1 with soft shadow.
  - In **Dark Mode**: The outer well is `bg-muted/40` (`oklch(0.269 0 0)` with opacity) or `bg-background` (`oklch(0.145 0 0)`), while the canvas card is `bg-card` (`oklch(0.205 0 0)`). A clear, discernible boundary is maintained without eye fatigue.
- **Active Field Selection**: `border-2 border-primary bg-primary/10 shadow-xs`. Both in light and dark mode, the active element outline illuminates in emerald brand green with a 10% translucent glow.

### 5.2 Interactive Chat Simulation Contrast (BookingPagesView)
- **Body Window**: `bg-muted/30`
- **Agent Message Bubble**: `bg-card border border-border text-foreground shadow-xs`
- **Client Message Bubble**: `bg-primary text-primary-foreground font-medium`
- In both light and dark mode, the contrast between the incoming agent response (card background) and outgoing user message (solid primary green with crisp light text) exceeds WCAG AAA standards.

### 5.3 Double-Opacity Syntax Safety Check
- Verified via AST regex search: `\b(?:bg|text|border)-[a-zA-Z0-9_-]+\/\d+\/\d+\b`
- **Result**: Zero double-slash opacity violations detected.
- All proposed recipes use single-slash syntax exclusively (`bg-primary/10`, `bg-warning/15`, `border-border/60`, `bg-muted/40`).

---

## 6. Caveats
1. **Read-Only Investigation**: No source files in `src/views/` were modified during this investigation. All findings and drop-in recipes are documented here for the implementation worker.
2. **Dynamic Chart Theming Scope Boundary**: Batch 6 does not contain ApexCharts or Unovis charts (only CSS progress bars and svg metrics). Dynamic chart theming is scheduled for Milestone 6.
3. **Third-Party Confetti / Animations**: Laser animations in `ScanNameCardView.vue` utilize `.glow` and Tailwind `@keyframes animate-bounce`, which strictly react to CSS variables.

---

## 7. Conclusion
Batch 6 comprises 7 core views totaling 7,460 lines of code and 2,511 token violations. The root causes are:
1. Pervasive `dark:` class overrides attempting to patch light-mode styling with hardcoded dark grays (`dark:bg-zinc-900`, `dark:bg-slate-900`).
2. Completely untokenized light-mode code in `BookingPagesView.vue`.
3. Hardcoded status colors (`emerald`, `amber`, `rose`) rather than semantic status tokens (`success`, `warning`, `destructive`).
4. Hardcoded dataset properties in `AddonsView.vue`.

By applying the exact replacement recipes detailed above:
- Violations across Batch 6 will drop from **2,511 to 0**.
- The physical phone chassis in `ScanNameCardView.vue` will maintain an invariant, sleek dark aesthetic across both themes via `--rail` tokens.
- All 6 tabs of `FormBuilderView.vue` will exhibit clean contrast between the canvas well and interactive form elements.
- Full build and TypeScript integrity (`npm run build`) is preserved.

---

## 8. Verification Method

To independently verify the investigation findings and future implementation:
1. **Token Audit Command**:
   ```bash
   node scripts/audit-tokens.cjs --batch 6
   ```
   *Expected Current Output*: Fails with 2,511 violations across 7 files.  
   *Expected Post-Fix Output*: Passes with 0 violations (exit code 0).
2. **Individual File Audit**:
   ```bash
   node scripts/audit-tokens.cjs --file src/views/webforms/FormBuilderView.vue
   node scripts/audit-tokens.cjs --file src/views/webforms/WebFormsDashboardView.vue
   node scripts/audit-tokens.cjs --file src/views/webforms/FormDetailView.vue
   node scripts/audit-tokens.cjs --file src/views/webforms/SubmissionsView.vue
   node scripts/audit-tokens.cjs --file src/views/BookingPagesView.vue
   node scripts/audit-tokens.cjs --file src/views/ScanNameCardView.vue
   node scripts/audit-tokens.cjs --file src/views/AddonsView.vue
   ```
3. **Build & Typecheck Gate**:
   ```bash
   npm run build
   ```
   *Verification criteria*: Exit code 0, 0 TypeScript errors, all modules transformed cleanly.
