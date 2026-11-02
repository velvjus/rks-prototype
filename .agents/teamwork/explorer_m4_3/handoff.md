# Milestone 4 — Explorer 3 Handoff Report
## Batch 7 (Partner Portal) Deep Exploration & Holistic Integration Synthesis

- **Agent**: `explorer_m4_3`
- **Working Directory**: `c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\.agents\teamwork\explorer_m4_3`
- **Target Recipient**: Orchestrator (`57c50def-4689-4a65-86f1-14dce8a95cbf`)
- **Date**: 2026-10-31T17:21:00Z
- **Scope**: Batch 7 (Partner Portal — 8 target files) & Milestone 4 Holistic Synthesis (Batches 5, 6, and 7 — 22 files total)

---

## 1. Observation

### 1.1 Tool Command Execution & Baseline Violation Counts
Execution of `node scripts/audit-tokens.cjs --batch 7` detected **5,276 violations** across 8 target files (8,867 lines total).

```bash
$ node scripts/audit-tokens.cjs --batch 7
Scanned: 8 file(s)
Batch: 7 (Batch 7 (Partner Portal))
VIOLATIONS BY CATEGORY:
  - Palette Grays & Neutrals: 2,753
  - Tailwind Arbitrary Hex/RGB Classes: 504
  - dark: Class Overrides: 1,363
  - Raw Status / Accent Colors: 656
TOTAL VIOLATIONS: 5,276
```

### 1.2 Per-File Audit Matrix (Batch 7)

| # | Target File | Total Lines | Total Violations | Palette Grays | Tailwind Hex/RGB | Raw Status | `dark:` Overrides | Inline Styles | Malformed Double Opacity |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `src/views/partner/PartnerReferralsView.vue` | 1,994 | **1,409** | 762 | 106 | 132 | 409 | 0 | 0 |
| 2 | `src/views/partner/PartnerOverviewView.vue` | 1,796 | **1,258** | 550 | 92 | 254 | 362 | 0 | 0 |
| 3 | `src/views/partner/PartnerWithdrawalView.vue` | 1,351 | **777** | 435 | 58 | 56 | 228 | 0 | 0 |
| 4 | `src/views/partner/PartnerProgramView.vue` | 1,190 | **777** | 397 | 80 | 98 | 202 | 0 | 0 |
| 5 | `src/views/PartnerRegisterView.vue` | 1,523 | **492** | 302 | 118 | 72 | 0 | 0 | 0 |
| 6 | `src/views/partner/PartnerCommissionsView.vue` | 651 | **417** | 228 | 29 | 33 | 127 | 0 | 0 |
| 7 | `src/views/partner/PartnerKitView.vue` | 277 | **111** | 60 | 16 | 7 | 28 | 0 | 0 |
| 8 | `src/components/partner/PartnerTrackSwitcher.vue` | 85 | **35** | 19 | 5 | 4 | 7 | 0 | 0 |
| **TOTAL** | **8 Files** | **8,867** | **5,276** | **2,753** | **504** | **656** | **1,363** | **0** | **0** |

### 1.3 Verbatim Snippet Observations

1. **Root Canvas `dark:bg-[#0B0F19]` Overrides (9 exact occurrences)**:
   - `PartnerReferralsView.vue:2`:
     ```html
     <div class="h-full flex flex-col bg-gray-50/50 dark:bg-[#0B0F19] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200">
     ```
   - `PartnerOverviewView.vue:2`:
     ```html
     <div class="h-full flex flex-col bg-gray-50/50 dark:bg-[#0B0F19] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200">
     ```
   - `PartnerWithdrawalView.vue:2`:
     ```html
     <div class="h-full flex flex-col min-h-0 bg-gray-50/50 dark:bg-[#0B0F19] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200">
     ```
   - `PartnerProgramView.vue:2`:
     ```html
     <div class="h-full flex flex-col min-h-0 bg-gray-50/50 dark:bg-[#0B0F19] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200">
     ```
   - `PartnerProgramView.vue:64`:
     ```html
     <div class="relative bg-gray-950 dark:bg-[#0B0F19] border border-gray-800 rounded-2xl p-6 sm:p-8 text-white overflow-hidden shadow-xs">
     ```
   - `PartnerProgramView.vue:132`:
     ```html
     <div class="relative w-full rounded-2xl overflow-hidden border border-emerald-500/25 dark:border-emerald-500/30 shadow-2xl bg-[#0B0F19] group">
     ```
   - `PartnerCommissionsView.vue:2`:
     ```html
     <div class="h-full flex flex-col bg-gray-50/50 dark:bg-[#0B0F19] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200">
     ```
   - `PartnerKitView.vue:2`:
     ```html
     <div class="h-full flex flex-col min-h-0 bg-gray-50/50 dark:bg-[#0B0F19] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200">
     ```
   - `PartnerOverviewView.vue:185`:
     ```html
     <div class="relative bg-gray-950 dark:bg-[#0B0F19] border border-gray-800 rounded-2xl p-6 sm:p-8 text-white overflow-hidden shadow-xs">
     ```

2. **Card & Header Surface `dark:bg-[#0E131F]` Overrides (51 occurrences)**:
   - Found across sticky headers (`bg-white/80 dark:bg-[#0E131F]/80`), card bodies (`bg-white dark:bg-[#0E131F]`), and track switcher (`bg-white/95 dark:bg-[#0E131F]/95`).

3. **Brand Green Raw Hex Classes (398 occurrences)**:
   - `#23B750`: 147 `text-[#23B750]`, 77 `bg-[#23B750]`, 72 `ring-[#23B750]`, 60 `border-[#23B750]`, 14 `shadow-[#23B750]`, 5 `via-[#23B750]`
   - Hover & shade variants: 22 `bg-[#1fa848]`, 6 `text-[#1fa848]`, 4 `text-[#1a943e]`, 3 `bg-[#1a943e]`, 2 `text-[#62D816]`, 2 `text-[#157a33]`

4. **Script-Side Dynamic Classes Returning Raw Colors**:
   - `PartnerReferralsView.vue:114-180`: Stage config array with `dotClass: 'bg-slate-400 dark:bg-slate-500'`, `pillClass: 'bg-slate-50 text-slate-700 dark:bg-slate-900/60 dark:text-slate-300 border-slate-200 dark:border-slate-700'`, etc.
   - `PartnerReferralsView.vue:1671-1682`: `getPlanBadgeClass(plan)` returning `bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200...`.
   - `PartnerOverviewView.vue:100-112`: Pipeline badge helper returning `bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40...`.
   - `PartnerRegisterView.vue:120-186`: Password strength computed properties returning `bg-amber-100 text-amber-900...`, `bg-emerald-50 text-emerald-800...`.

5. **ApexCharts in `PartnerOverviewView.vue`**:
   - Line 317: `<apexchart type="donut" width="78" height="78" :options="salesApexDonutOptions" :series="salesApexDonutSeries" />` (Sales Track active pipeline funnel)
   - Line 487: `<apexchart type="donut" width="78" height="78" :options="pipelineApexDonutOptions" :series="pipelineApexDonutSeries" />` (Referral Track pipeline donut)
   - Lines 1629 & 1672: Hardcoded options `colors: isPreviewEmpty.value ? ['#E5E7EB'] : ['#F59E0B', '#8B5CF6', '#F43F5E', '#23B750']`, `tooltip: { theme: 'dark' }`. Container wrappers currently use `p-3.5 bg-gray-50/90 dark:bg-gray-900/60 rounded-xl border border-gray-100 dark:border-gray-800`.

---

## 2. Logic Chain

1. **Elimination of `dark:` Overrides**:
   - **Premise (AGENTS.md)**: *"Do NOT add dark: color overrides (e.g. bg-white dark:bg-gray-900). If a token doesn't look right in dark mode, fix the token value under .dark in index.css — not the component."*
   - **Reasoning**: The current Batch 7 implementation used a parallel theming model where light classes (`bg-gray-50/50`, `text-gray-900`, `border-gray-200`, `bg-white`) were paired with bespoke dark classes (`dark:bg-[#0B0F19]`, `dark:text-white`, `dark:border-gray-800`, `dark:bg-[#0E131F]`).
   - **Deduction**: In the canonical design system established in `index.css`:
     - `:root { --background: oklch(1 0 0); --foreground: oklch(0.145 0 0); --card: oklch(1 0 0); --border: oklch(0.922 0 0); }`
     - `.dark { --background: oklch(0.145 0 0); --foreground: oklch(0.985 0 0); --card: oklch(0.205 0 0); --border: oklch(1 0 0 / 10%); }`
   - Therefore, replacing `bg-gray-50/50 dark:bg-[#0B0F19] text-gray-900 dark:text-gray-100` with `bg-background text-foreground` guarantees exact light/dark switching natively with zero `dark:` classes.
   - Replacing `bg-white dark:bg-[#0E131F]` with `bg-card` automatically shifts from pure white to rich dark card background.
   - Replacing `border-gray-200 dark:border-gray-800` with `border-border` automatically matches borders to theme mode.

2. **Brand Green Normalization**:
   - The hex color `#23B750` is the canonical RakanSales brand green (`--brand` and `--primary` in `index.css`).
   - Replacing `text-[#23B750]` with `text-brand` (or `text-primary`), `bg-[#23B750]` with `bg-brand` (or `bg-primary`), `ring-[#23B750]` with `ring-brand`, and `border-[#23B750]` with `border-brand` resolves 398 violations and keeps styling centralized.

3. **Status Color Normalization**:
   - `bg-emerald-50 dark:bg-emerald-950/40 text-[#23B750]` $\rightarrow$ `bg-success/10 text-success border border-success/20`.
   - `bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400` $\rightarrow$ `bg-warning/10 text-warning border border-warning/20`.
   - `bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400` $\rightarrow$ `bg-destructive/10 text-destructive border border-destructive/20`.
   - `bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400` $\rightarrow$ `bg-info/10 text-info border border-info/20`.
   - `bg-purple-50 ...` $\rightarrow$ `bg-tag-4 text-tag-4-foreground border border-tag-4-foreground/20` (utilizing categorical pipeline tag token).

4. **Double-Opacity Prevention**:
   - Lessons from Milestone 3 showed that automated replacements replacing `bg-gray-50/50` with `bg-muted/30/50` break Tailwind v4 CSS rule generation.
   - All recipes must strictly enforce single opacity slashes (`bg-muted/50`, `bg-card/80`, `border-border/80`).

5. **`PartnerRegisterView.vue` Brand Logo Theme Awareness**:
   - `PartnerRegisterView.vue` is a standalone full-page view without `MainLayout`.
   - It currently imports only `lightLogoUrl from '@/assets/logo/RKS Logo Lockup 01.svg'`.
   - In dark mode, `RKS Logo Lockup 01.svg` has dark text that becomes invisible against dark backgrounds.
   - Solution: import `darkLogoUrl from '@/assets/logo/RKS Logo Lockup 02.svg'`, query `useTheme()`, and bind `:src="isDark ? darkLogoUrl : lightLogoUrl"`.

---

## 3. Caveats

1. **ApexCharts Color Options Adaptation Deferred to M6**:
   - The 2 donut charts in `PartnerOverviewView.vue` (lines 317 & 487) currently have static color hex arrays in their options (`#F59E0B`, `#8B5CF6`, `#F43F5E`, `#23B750`).
   - Per `PROJECT.md` Feature 18–19 and Dispatch task 4, dynamic chart adaptation with `useChartTheme.ts` is explicitly scheduled for Milestone 6.
   - For Milestone 4, the chart container cards, headings, legends, stage filter buttons, and center count labels MUST be 100% tokenized (`bg-card`, `border-border`, `text-foreground`, `text-muted-foreground`), while leaving the internal ApexCharts options structure intact for M6.

2. **Inline SVG in `PartnerRegisterView.vue`**:
   - Lines 46–59 in `PartnerRegisterView.vue` contain a large inline SVG mark with hardcoded `fill="#23b750"` and `fill="#62d816"`.
   - Note that `scripts/audit-tokens.cjs` does NOT flag SVG XML attributes (`fill="..."`), but it DOES flag CSS classes (`text-[#23B750]`).
   - However, for consistency with the design system, replacing `fill="#23b750"` with `class="text-brand fill-current"` is recommended.

3. **No Caveats on Layout or Navigation**:
   - All 8 files preserve existing Vue Router navigation, responsive grid layouts, drag-and-drop mechanics in the Kanban board, and store state reactivity with `usePartnerStore()`.

---

## 4. Conclusion & Concrete Implementation Recipes

### 4.1 Exhaustive Catalog of `dark:` Overrides to Eliminate (136 Unique Overrides, 1,363 Occurrences)

Every one of the following 136 `dark:` overrides must be completely removed in Batch 7:

```
[Backgrounds]
dark:bg-[#0B0F19]          -> bg-background
dark:bg-[#0E131F]          -> bg-card
dark:bg-[#0E131F]/80       -> bg-card/80
dark:bg-[#0E131F]/95       -> bg-card/95
dark:bg-[#111827]          -> bg-popover (or bg-card)
dark:bg-gray-800           -> bg-muted (or bg-card)
dark:bg-gray-900           -> bg-card (or bg-muted)
dark:bg-gray-700           -> bg-muted
dark:bg-gray-850           -> bg-card
dark:bg-gray-800/40        -> bg-muted/40
dark:bg-gray-900/40        -> bg-muted/40
dark:bg-gray-900/60        -> bg-muted/60
dark:bg-gray-900/30        -> bg-muted/30
dark:bg-gray-800/60        -> bg-muted/60
dark:bg-gray-800/30        -> bg-muted/30
dark:bg-gray-900/50        -> bg-muted/50
dark:bg-gray-800/80        -> bg-muted/80
dark:bg-gray-800/70        -> bg-muted/70
dark:bg-gray-850/50        -> bg-muted/50
dark:bg-gray-850/80        -> bg-muted/80
dark:bg-gray-850/60        -> bg-muted/60
dark:bg-slate-800          -> bg-muted
dark:bg-slate-500          -> bg-muted-foreground
dark:bg-slate-900/60       -> bg-muted/60

[Status & Accent Backgrounds]
dark:bg-emerald-950/40     -> bg-success/10
dark:bg-emerald-950/60     -> bg-success/20
dark:bg-emerald-950/20     -> bg-success/10
dark:bg-emerald-950/50     -> bg-success/15
dark:bg-emerald-950/30     -> bg-success/10
dark:bg-emerald-950/80     -> bg-success/25
dark:bg-emerald-950/10     -> bg-success/10
dark:bg-emerald-950        -> bg-success/20
dark:bg-emerald-800/60     -> bg-success/20
dark:bg-emerald-900/60     -> bg-success/20
dark:bg-emerald-500/25     -> bg-success/25
dark:bg-amber-950/40       -> bg-warning/10
dark:bg-amber-950/60       -> bg-warning/20
dark:bg-amber-950/50       -> bg-warning/15
dark:bg-amber-950/20       -> bg-warning/10
dark:bg-amber-500/25       -> bg-warning/25
dark:bg-rose-950/40        -> bg-destructive/10
dark:bg-rose-950/50        -> bg-destructive/15
dark:bg-rose-950/20        -> bg-destructive/10
dark:bg-rose-500/25        -> bg-destructive/25
dark:bg-blue-950/40        -> bg-info/10
dark:bg-blue-950/60        -> bg-info/20
dark:bg-purple-950/40      -> bg-tag-4
dark:bg-purple-950/50      -> bg-tag-4

[Text Colors]
dark:text-white            -> text-foreground
dark:text-gray-100         -> text-foreground
dark:text-gray-200         -> text-muted-foreground (or text-foreground)
dark:text-gray-300         -> text-muted-foreground
dark:text-gray-400         -> text-muted-foreground
dark:text-gray-500         -> text-muted-foreground
dark:text-gray-600         -> text-muted-foreground
dark:text-gray-700         -> text-muted-foreground
dark:text-gray-900         -> text-foreground
dark:text-slate-200        -> text-foreground
dark:text-slate-300        -> text-muted-foreground
dark:text-emerald-400      -> text-success
dark:text-emerald-300      -> text-success
dark:text-emerald-200      -> text-success
dark:text-emerald-400/80   -> text-success
dark:text-emerald-300/80   -> text-success
dark:text-amber-400        -> text-warning
dark:text-amber-300        -> text-warning
dark:text-amber-300/80     -> text-warning
dark:text-rose-400         -> text-destructive
dark:text-rose-300         -> text-destructive
dark:text-rose-300/80      -> text-destructive
dark:text-blue-400         -> text-info
dark:text-purple-400       -> text-tag-4-foreground
dark:text-purple-300       -> text-tag-4-foreground
dark:text-[#23B750]        -> text-brand
dark:text-[#62D816]        -> text-brand-secondary

[Borders & Divides]
dark:border-gray-800       -> border-border
dark:border-gray-800/80    -> border-border/80 (or border-border)
dark:border-gray-800/60    -> border-border/60 (or border-border)
dark:border-gray-700       -> border-border
dark:border-gray-700/60    -> border-border
dark:border-gray-700/80    -> border-border
dark:border-gray-300       -> border-border
dark:border-slate-700      -> border-border
dark:divide-gray-800       -> divide-border
dark:divide-gray-800/80    -> divide-border
dark:divide-gray-800/60    -> divide-border
dark:border-emerald-800    -> border-success/20
dark:border-emerald-800/60 -> border-success/20
dark:border-emerald-800/80 -> border-success/30
dark:border-emerald-800/50 -> border-success/20
dark:border-emerald-500/30 -> border-success/20
dark:border-emerald-600/40 -> border-success/20
dark:border-amber-800      -> border-warning/20
dark:border-amber-800/60   -> border-warning/20
dark:border-amber-800/50   -> border-warning/20
dark:border-amber-600/40   -> border-warning/20
dark:border-rose-800       -> border-destructive/20
dark:border-rose-800/60    -> border-destructive/20
dark:border-rose-900/50    -> border-destructive/20
dark:border-rose-600/40    -> border-destructive/20
dark:border-blue-800       -> border-info/20
dark:border-blue-800/60    -> border-info/20
dark:border-purple-800     -> border-tag-4-foreground/20
dark:border-purple-800/60  -> border-tag-4-foreground/20

[Hovers & Misc]
dark:hover:text-white      -> hover:text-foreground
dark:hover:text-gray-200   -> hover:text-foreground
dark:hover:text-gray-300   -> hover:text-foreground
dark:hover:text-gray-900   -> hover:text-foreground
dark:hover:text-emerald-400-> hover:text-success
dark:hover:text-red-400    -> hover:text-destructive
dark:hover:text-[#23B750]  -> hover:text-brand
dark:hover:bg-gray-800     -> hover:bg-muted
dark:hover:bg-gray-800/40  -> hover:bg-muted/40
dark:hover:bg-gray-800/80  -> hover:bg-muted/80
dark:hover:bg-gray-800/30  -> hover:bg-muted/30
dark:hover:bg-gray-800/60  -> hover:bg-muted/60
dark:hover:bg-gray-750     -> hover:bg-muted
dark:hover:bg-gray-700     -> hover:bg-muted
dark:hover:bg-gray-700/40  -> hover:bg-muted/40
dark:hover:bg-gray-600     -> hover:bg-muted
dark:hover:bg-emerald-900  -> hover:bg-success/20
dark:hover:bg-emerald-900/60-> hover:bg-success/20
dark:hover:bg-rose-950/40  -> hover:bg-destructive/20
dark:hover:border-gray-700 -> hover:border-border
dark:hover:border-gray-600 -> hover:border-border
dark:hover:border-[#23B750]-> hover:border-brand
dark:shadow-black/20       -> shadow-lg
```

---

### 4.2 Exact Drop-In Recipes by File

#### Recipe 1: `src/components/partner/PartnerTrackSwitcher.vue` (35 violations)
- **Line 4**:
  - *Before*: `bg-white/95 dark:bg-[#0E131F]/95 backdrop-blur-md border border-gray-200/90 dark:border-gray-800 rounded-xl shadow-lg shadow-black/5 dark:shadow-black/20 text-xs`
  - *After*: `bg-card/95 backdrop-blur-md border border-border rounded-xl shadow-lg text-xs`
- **Lines 14–17** (Referral tab button):
  - *Before*: `focus-visible:ring-blue-500` and `partnerStore.activeTrack === 'referral' ? 'bg-blue-600 text-white shadow-2xs' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'`
  - *After*: `focus-visible:ring-info` and `partnerStore.activeTrack === 'referral' ? 'bg-info text-info-foreground shadow-2xs' : 'text-muted-foreground hover:text-foreground'`
- **Lines 31–35** (Sales tab button):
  - *Before*: `focus-visible:ring-[#23B750]` and `partnerStore.activeTrack === 'sales' ? 'bg-[#23B750] text-white shadow-2xs' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'`
  - *After*: `focus-visible:ring-brand` and `partnerStore.activeTrack === 'sales' ? 'bg-brand text-brand-foreground shadow-2xs' : 'text-muted-foreground hover:text-foreground'`
- **Line 55** (Floating toast modal):
  - *Before*: `bg-gray-950/95 text-white border border-gray-800 rounded-2xl px-4 py-3 shadow-xl`
  - *After*: `bg-popover/95 text-popover-foreground border border-border rounded-2xl px-4 py-3 shadow-xl`
- **Line 59**:
  - *Before*: `partnerStore.activeTrack === 'sales' ? 'bg-[#23B750]/20 text-[#23B750]' : 'bg-blue-500/20 text-blue-400'`
  - *After*: `partnerStore.activeTrack === 'sales' ? 'bg-brand/20 text-brand' : 'bg-info/20 text-info'`
- **Line 64**:
  - *Before*: `text-gray-100` $\rightarrow$ *After*: `text-foreground`
- **Line 68**:
  - *Before*: `text-gray-400 hover:text-white` $\rightarrow$ *After*: `text-muted-foreground hover:text-foreground`

#### Recipe 2: `src/views/partner/PartnerKitView.vue` (111 violations)
- **Line 2** (Root container):
  - *Before*: `bg-gray-50/50 dark:bg-[#0B0F19] text-gray-900 dark:text-gray-100`
  - *After*: `bg-background text-foreground`
- **Line 4** (Header):
  - *Before*: `border-b border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-[#0E131F]/80`
  - *After*: `border-b border-border bg-card/80`
- **Line 8**:
  - *Before*: `text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800`
  - *After*: `text-muted-foreground hover:text-foreground px-2.5 py-1.5 rounded-lg hover:bg-muted`
- **Line 15**:
  - *Before*: `bg-gray-200 dark:bg-gray-800` $\rightarrow$ *After*: `bg-border`
- **Line 22** (Badge):
  - *Before*: `bg-emerald-50 dark:bg-emerald-950/60 text-[#23B750] border border-emerald-200/60 dark:border-emerald-800/60`
  - *After*: `bg-success/10 text-success border border-success/20`
- **Line 35** (Download All CTA):
  - *Before*: `text-white bg-[#23B750] hover:bg-[#1fa848] rounded-xl shadow-sm shadow-[#23B750]/20`
  - *After*: `text-brand-foreground bg-brand hover:bg-brand/90 rounded-xl shadow-sm`
- **Line 48** (Hero banner card):
  - *Before*: `bg-gradient-to-br from-gray-900 via-[#0E131F] to-gray-900 text-white rounded-2xl p-6 sm:p-8 border border-gray-800`
  - *After*: `bg-card text-card-foreground rounded-2xl p-6 sm:p-8 border border-border`
- **Line 51**:
  - *Before*: `bg-emerald-950/60 text-emerald-300 border border-emerald-500/30`
  - *After*: `bg-success/15 text-success border border-success/30`
- **Lines 70–73** (Filter pills):
  - *Active*: `bg-brand text-brand-foreground shadow-xs`
  - *Inactive*: `bg-card text-muted-foreground border border-border hover:bg-muted`
- **Lines 84–115** (Asset cards & download buttons):
  - *Card*: `bg-card border border-border rounded-2xl p-5 shadow-xs hover:border-brand/50`
  - *Format tag*: `bg-muted text-foreground`
  - *Download button*: `text-foreground bg-muted hover:bg-brand hover:text-brand-foreground rounded-xl transition-all`
- **Lines 133–138** (Toast notification):
  - *Before*: `bg-gray-900 text-white ... border border-gray-700`
  - *After*: `bg-popover text-popover-foreground ... border border-border`

#### Recipe 3: `src/views/partner/PartnerCommissionsView.vue` (417 violations)
- **Line 2**: `bg-background text-foreground`
- **Line 4**: `border-b border-border bg-card/80`
- **Lines 8–10**: `text-muted-foreground hover:text-foreground hover:bg-muted`
- **Line 17**: `bg-border`
- **Line 32**: `text-brand-foreground bg-brand hover:bg-brand/90 rounded-xl shadow-sm`
- **Lines 46, 79, 106** (3 Metric cards):
  - Card container: `bg-card border border-border rounded-2xl p-5 shadow-xs`
  - Metric label: `text-xs font-semibold text-muted-foreground`
  - Icon pill 1 (Wallet): `bg-success/10 text-success`
  - Big number 1: `text-2xl font-extrabold font-mono text-brand`
  - Icon pill 2 (Clock): `bg-warning/10 text-warning`
  - Big number 2: `text-2xl font-extrabold font-mono text-warning`
  - Icon pill 3 (Banknote): `bg-muted text-muted-foreground`
  - Big number 3: `text-2xl font-extrabold font-mono text-foreground`
  - Card footer divider: `border-t border-border`
  - Action link: `text-brand hover:text-brand/80`
- **Lines 136–212** (Sales recurring RevShare cohort table):
  - Card wrapper: `bg-card border border-border rounded-2xl shadow-xs overflow-hidden`
  - Subheader strip: `border-b border-border`
  - Margin pill: `bg-success/10 text-success border border-success/20`
  - Table thead: `border-b border-border bg-muted/50 text-muted-foreground`
  - Table tbody row: `hover:bg-muted/50 transition-colors`
  - Table divider: `divide-y divide-border`
  - MRR progress track: `bg-muted` with fill `bg-brand`
- **Lines 218–330** (Referral ledger toolbar & tab bar):
  - Search input: `bg-muted/50 border border-input rounded-xl text-foreground focus:outline-none focus:border-brand`
  - Sort button active: `border-brand bg-success/10 text-brand`
  - Sort button inactive: `border-border bg-card text-muted-foreground hover:bg-muted`
  - Sort popover menu: `bg-popover border border-border text-popover-foreground rounded-xl shadow-xl`
  - Segmented tab bar container: `bg-muted/80 rounded-xl border border-border`
  - Tab button active: `bg-card text-foreground font-bold shadow-xs border border-border`
  - Tab button inactive: `text-muted-foreground hover:text-foreground font-medium hover:bg-muted`
- **Lines 331–478** (Ledger table & pagination):
  - Table thead: `bg-muted/50 text-muted-foreground border-b border-border`
  - Status pill:
    - Cleared: `bg-success/10 text-success border border-success/20`
    - In Clearance / Pending: `bg-warning/10 text-warning border border-warning/20`
  - Table footer: `bg-muted/30 border-t border-border text-muted-foreground`
  - Page size select & pagination buttons: `bg-card border border-border text-muted-foreground hover:bg-muted disabled:opacity-40`

#### Recipe 4: `src/views/PartnerRegisterView.vue` (492 violations)
- **Line 2**: `min-h-screen lg:h-screen w-full bg-background flex flex-col font-sans selection:bg-brand/20 selection:text-foreground text-foreground overflow-x-hidden lg:overflow-hidden relative`
- **Lines 6–16** (Mobile Header): `bg-card/95 backdrop-blur-md border-b border-border px-4 py-2.5`
  - Back link: `text-muted-foreground hover:text-foreground border border-border bg-card shadow-2xs`
  - Logo adaptation: import `darkLogoUrl` and bind `:src="isDark ? darkLogoUrl : lightLogoUrl"`
- **Lines 41–124** (Revealable desktop top header):
  - Header: `bg-card/95 backdrop-blur-md border-b border-border shadow-md`
  - Network pill: `text-success bg-success/10 px-2.5 py-0.5 rounded-full border border-success/20`
  - Step switcher nav: `bg-muted/80 p-1 rounded-xl text-xs font-semibold`
  - Step button active: `bg-card text-foreground shadow-xs font-bold`
  - Step button inactive: `text-muted-foreground hover:text-foreground`
  - Step 4 active: `bg-brand text-brand-foreground shadow-xs font-bold`
  - Back button: `text-muted-foreground hover:text-foreground hover:bg-muted border border-border shadow-2xs focus-visible:ring-brand`
- **Lines 132–138** (Left form pane):
  - Section wrapper: `bg-background lg:border-r border-border`
  - Form inputs: `bg-card border border-input hover:border-input/80 rounded-xl text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-brand/30 focus:border-brand caret-brand shadow-2xs transition-all`
  - Country code pill (+60): `bg-muted/50 border-r border-input text-foreground`
- **Lines 560–650** (Password strength meter card):
  - Card: `bg-card rounded-xl border border-border shadow-2xs space-y-2.5`
  - Shield icon: `bg-success/15 text-success` (when strong) vs `bg-muted text-muted-foreground`
  - Segmented progress tracks: active `bg-brand` (or `bg-warning`), inactive `bg-muted`
  - Checklist item active: `text-success font-medium` with check pill `bg-success/15 text-success`
  - Checklist item inactive: `text-muted-foreground` with dot `bg-muted`
- **Lines 1053–1083** (Right marketing pane):
  - Background: `bg-gradient-to-b from-card via-muted/30 to-muted/60 flex-col justify-end items-center relative overflow-hidden select-none border-l border-border`
  - Headings: `text-foreground` and `<span class="text-brand">Earn Together.</span>`
- **Lines 1089–1190** (Unlock modal dialog):
  - Modal overlay: `fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-xs p-4`
  - Modal card: `bg-card text-card-foreground w-full max-w-sm sm:max-w-[410px] rounded-2xl shadow-2xl border border-border p-5 sm:p-7 space-y-4`
  - Close button: `text-muted-foreground hover:text-foreground`
  - Unlock pill: `bg-warning/10 border border-warning/20 text-warning text-[11px] font-semibold`
  - Code container: `bg-muted/50 border border-border rounded-xl space-y-2 text-left`
  - Code input: `bg-card border border-input text-foreground placeholder:text-muted-foreground focus:ring-brand/30 focus:border-brand`
  - Unlock button: `bg-brand hover:bg-brand/90 text-brand-foreground`
  - Primary button: `bg-brand hover:bg-brand/90 text-brand-foreground font-bold rounded-xl shadow-xs`
- **Script additions**:
  - `import { useTheme } from '@/composables/useTheme';`
  - `import darkLogoUrl from '@/assets/logo/RKS Logo Lockup 02.svg';`
  - `const { isDark } = useTheme();`
  - Update `passwordStrengthBadgeClass` and `passwordStrengthBg` computed properties to return semantic status tokens (`bg-warning/15 text-warning border-warning/30`, `bg-success/15 text-success border-success/30`, `bg-brand`, `bg-warning`, etc.).

#### Recipe 5: `src/views/partner/PartnerProgramView.vue` (777 violations)
- **Line 2**: `bg-background text-foreground`
- **Line 4**: `border-b border-border bg-card/80`
- **Lines 7–13**: `text-muted-foreground hover:text-foreground hover:bg-muted`
- **Line 16**: `bg-border`
- **Line 32**: Share button `text-muted-foreground bg-card hover:bg-muted border border-border rounded-xl`
- **Lines 38–53**: Upgrade button `text-brand-foreground bg-brand hover:bg-brand/90 rounded-xl` vs Accredited pill `bg-success/10 border border-success/20 text-success`
- **Lines 64–140** (Hero banner card & artwork container):
  - Banner container: `bg-card border border-border rounded-2xl p-6 sm:p-8 text-foreground overflow-hidden shadow-xs`
  - Accent top line: `bg-gradient-to-r from-transparent via-brand/50 to-transparent`
  - Partnership badge: `bg-success/10 border border-success/20 text-success`
  - Heading: `text-foreground` with `<span class="text-brand">compounding revenue</span>`
  - Subtitle: `text-muted-foreground`
  - Direct referral input: `bg-muted/50 border border-border text-foreground font-mono focus:border-brand`
  - Copy button: `bg-brand hover:bg-brand/90 text-brand-foreground`
  - Share options button: `text-foreground hover:text-foreground bg-muted hover:bg-muted/80 border border-border`
  - Right artwork frame: `border border-success/25 bg-card`
- **Sections 2–5** (Track comparison columns, tier tables, feature matrices):
  - Track cards: `bg-card border border-border rounded-2xl p-6 shadow-xs`
  - Active track badge: `bg-success/10 text-success border border-success/20`
  - Feature table header: `bg-muted/50 text-muted-foreground border-b border-border`
  - Feature row hover: `hover:bg-muted/50 border-b border-border`
  - Check icons: `text-success` vs crosses `text-muted-foreground`
  - Modals (ShareModal, UpgradeModal): `bg-background/80 backdrop-blur-xs` backdrop with `bg-card border border-border text-card-foreground` dialog

#### Recipe 6: `src/views/partner/PartnerWithdrawalView.vue` (777 violations)
- **Line 2**: `bg-background text-foreground`
- **Line 4**: `border-b border-border bg-card/80`
- **Lines 26–83** (Segmented tab bar & balance strip):
  - Navigation container border: `border-b border-border`
  - Tab bar: `bg-muted/80 rounded-xl border border-border`
  - Active tab: `bg-card text-foreground shadow-xs font-semibold`
  - Inactive tab: `text-muted-foreground hover:text-foreground`
  - Count pill: `bg-muted text-muted-foreground`
  - Balance number: `text-brand`
- **Lines 90–250** (Cashier & Remittance cards):
  - Card: `bg-card border border-border rounded-2xl p-6 shadow-xs`
  - Dividers: `border-b border-border` and `border-t border-border`
  - Payout amount input: `bg-muted/50 border border-input rounded-xl text-foreground font-mono text-xl focus:border-brand`
  - Bank select dropdown: `bg-card border border-input rounded-xl text-foreground`
  - Disburse button: `bg-brand hover:bg-brand/90 text-brand-foreground font-bold rounded-xl shadow-xs`
- **Lines 251–500** (Disbursement Ledger / Remittance History):
  - Table wrapper: `bg-card border border-border rounded-2xl shadow-xs overflow-hidden`
  - Table thead: `bg-muted/50 text-muted-foreground border-b border-border`
  - Table row: `hover:bg-muted/50 transition-colors`
  - Status pill (Settled / Completed): `bg-success/10 text-success border border-success/20`
  - Status pill (Processing / In Clearance): `bg-warning/10 text-warning border border-warning/20`
  - Status pill (Failed / Rejected): `bg-destructive/10 text-destructive border border-destructive/20`
- **Lines 501–800** (Linked Bank Accounts tab & Add Bank Modal):
  - Bank card: `bg-card border border-border rounded-2xl p-5 shadow-xs`
  - Primary account badge: `bg-success/10 text-success border border-success/20`
  - Add bank modal: `bg-background/80` overlay, `bg-card border border-border text-card-foreground` dialog

#### Recipe 7: `src/views/partner/PartnerOverviewView.vue` (1,258 violations)
- **Line 2**: `bg-background text-foreground`
- **Line 7**: `border-b border-border bg-card/80`
- **Metric Cards Grid**:
  - 4 Metric cards: `bg-card border border-border rounded-2xl p-5 shadow-xs`
  - Labels: `text-muted-foreground`
  - Numbers: `text-foreground` (or `text-brand` for earnings)
  - Sparkline / trend indicators: `text-success` / `text-warning`
- **Funnel & ApexChart Cards (Lines 312–520)**:
  - Outer card: `bg-card border border-border rounded-2xl p-5 shadow-xs`
  - Donut chart left box (lines 315 & 485):
    - *Before*: `p-3.5 bg-gray-50/90 dark:bg-gray-900/60 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center gap-3.5 h-full`
    - *After*: `p-3.5 bg-muted/50 rounded-xl border border-border flex items-center gap-3.5 h-full`
  - Center count label (lines 325 & 495): `text-foreground`
  - Stage filter button inactive: `hover:bg-card border border-transparent text-muted-foreground`
  - Stage filter button active:
    - Discovery: `bg-warning/10 border-warning/30 text-warning`
    - Proposal: `bg-tag-4 border-tag-4-foreground/30 text-tag-4-foreground`
    - Clearance: `bg-destructive/10 border-destructive/30 text-destructive`
    - Won: `bg-success/10 border-success/30 text-success`
- **Activity Feed & Recent Deals Table**:
  - Table container: `bg-card border border-border rounded-2xl shadow-xs overflow-hidden`
  - Table thead: `bg-muted/50 text-muted-foreground border-b border-border`
  - Table rows: `hover:bg-muted/50 border-b border-border`
  - Stage badges helper (`getStageBadgeClass` lines 100–112):
    - Convert return statements to: `bg-warning/10 text-warning border border-warning/20`, `bg-tag-4 text-tag-4-foreground border border-tag-4-foreground/20`, `bg-success/10 text-success border border-success/20`, etc.

#### Recipe 8: `src/views/partner/PartnerReferralsView.vue` (1,409 violations)
- **Line 2**: `bg-background text-foreground`
- **Line 4**: `border-b border-border bg-card/80`
- **Lines 8–15**: `text-muted-foreground hover:text-foreground hover:bg-muted`
- **Line 17**: `bg-border`
- **Line 26**: 120-Day Lock pill `bg-success/10 text-success border border-success/20`
- **Line 45**: Dashboard button `text-muted-foreground hover:bg-muted border border-border`
- **Lines 52–58**: Share link CTA `bg-brand hover:bg-brand/90 text-brand-foreground`
- **Lines 62–81**: Kanban / Table toggle switch:
  - Container: `bg-muted rounded-xl border border-border`
  - Active: `bg-card text-foreground shadow-2xs font-bold`
  - Inactive: `text-muted-foreground hover:text-foreground`
- **Lines 84–90**: Register Deal CTA `bg-brand hover:bg-brand/90 text-brand-foreground`
- **Lines 103–220** (5 Metric cards):
  - Cards: `bg-card border border-border rounded-xl p-4 shadow-2xs`
  - Headings: `text-muted-foreground`
  - Numbers: `text-foreground` (and `text-brand`)
  - Footers: `border-t border-border text-muted-foreground`
- **Kanban Board (Lines 221–343)**:
  - Column wrapper: `bg-muted/40 border border-border rounded-xl p-3 flex flex-col min-w-[280px]`
  - Column header: `text-foreground` with count pill `bg-muted text-muted-foreground`
  - Drop target preview: `border-2 border-dashed border-brand bg-success/10 text-brand`
  - Deal card: `bg-card border border-border rounded-xl p-3 shadow-2xs hover:shadow-md hover:border-brand/50 flex flex-col justify-between`
  - Plan tier badge: `getPlanBadgeClass(deal.planTier)`
  - Card internal dividers: `border-t border-border`
  - RevShare number: `text-brand`
  - Lock duration pill: `text-warning` (if $\le$ 30d) vs `text-muted-foreground`
- **Script Stage Config & Plan Badges**:
  - Line 114–180: Replace `dotClass` and `pillClass` in stage definitions with `bg-muted-foreground`, `bg-warning`, `bg-brand`, `bg-success/10 text-success border-success/20`, `bg-warning/10 text-warning border-warning/20`, etc.
  - Line 1671–1682 (`getPlanBadgeClass`):
    ```typescript
    function getPlanBadgeClass(plan: string): string {
      switch (plan) {
        case 'Enterprise':
          return 'bg-tag-1 text-tag-1-foreground border border-tag-1-foreground/20 font-semibold';
        case 'Growth':
          return 'bg-tag-2 text-tag-2-foreground border border-tag-2-foreground/20';
        case 'Pro':
          return 'bg-tag-3 text-tag-3-foreground border border-tag-3-foreground/20';
        default:
          return 'bg-muted text-muted-foreground border border-border';
      }
    }
    ```
- **Table View (Lines 345–550)**:
  - Table card: `bg-card border border-border rounded-xl shadow-2xs overflow-hidden`
  - Table thead: `bg-muted/50 text-muted-foreground border-b border-border text-[11px] font-bold`
  - Table row: `hover:bg-muted/50 border-b border-border`
- **Modals & Drawers (Lines 551–1400)**:
  - Modal backdrops: `bg-background/80 backdrop-blur-xs`
  - Modal contents & drawers: `bg-card border border-border text-card-foreground shadow-2xl`
  - Form inputs: `bg-card border border-input text-foreground focus:ring-brand/30 focus:border-brand`

---

## 5. Milestone 4 Holistic Integration & Synthesis (Batches 5, 6, and 7)

### 5.1 The Milestone 4 Landscape
Milestone 4 represents the largest milestone in the entire dark mode migration, encompassing **22 files, 20,432 lines of code, and 11,706 violations**:

| Batch | Scope / Domain | Target Files | Total Lines | Total Violations | Key Architectural Characteristics |
|---|---|---|---|---|---|
| **Batch 5** | Settings & Administration | 7 files | 5,618 | **3,919** | Complex nested tabs, AI prompt editors, automation node graph, RBAC matrix |
| **Batch 6** | WebForms, Booking & Tools | 7 files | 5,947 | **2,511** | Drag-and-drop form canvas, OCR card scanner, booking calendar scheduler, addon catalog |
| **Batch 7** | Partner Portal | 8 files | 8,867 | **5,276** | Dual-track switcher (Referral vs Sales), Kanban drag board, 2 ApexCharts, full-screen wizard |
| **TOTAL** | **Milestone 4** | **22 files** | **20,432** | **11,706** | **100% Token-Based Architecture across Business Surfaces** |

### 5.2 Unified Implementation Strategy for Milestone 4 Worker

To maximize speed, safety, and avoid regressions, the Milestone 4 Worker should execute in 3 coordinated phases:

#### Phase 1: High-Density Views with Script-Side Classes (Batch 7 First)
- **Why start with Batch 7?**: Batch 7 contains 45% of Milestone 4 violations (5,276) and shares reusable patterns across all 8 files. Tackling Batch 7 establishes immediate momentum.
- **Sequence**:
  1. `PartnerTrackSwitcher.vue` (35 violations) $\rightarrow$ Establishes track switching tokens (`info` vs `brand`).
  2. `PartnerKitView.vue` (111 violations) $\rightarrow$ Fast, clean view to calibrate download badges and filter pills.
  3. `PartnerCommissionsView.vue` (417 violations) $\rightarrow$ Itemized financial ledger and status pills.
  4. `PartnerRegisterView.vue` (492 violations) $\rightarrow$ Dual logo support (`isDark ? darkLogoUrl : lightLogoUrl`), password strength tokens.
  5. `PartnerProgramView.vue` (777 violations) $\rightarrow$ Hero banner card and accreditation badges.
  6. `PartnerWithdrawalView.vue` (777 violations) $\rightarrow$ Bank accounts and remittance tables.
  7. `PartnerOverviewView.vue` (1,258 violations) $\rightarrow$ ApexChart card containers, pipeline filter buttons, activity feeds.
  8. `PartnerReferralsView.vue` (1,409 violations) $\rightarrow$ Kanban drag columns, table rows, `getPlanBadgeClass`, deal drawer.
- **Verification Gate**: Run `node scripts/audit-tokens.cjs --batch 7`. Must achieve **0 violations**.

#### Phase 2: WebForms, Booking & Tools (Batch 6)
- **Sequence**:
  1. `SubmissionsView.vue` (18 violations) $\rightarrow$ Quick win.
  2. `WebFormsDashboardView.vue` (87 violations) $\rightarrow$ Form list cards.
  3. `FormDetailView.vue` (109 violations) $\rightarrow$ Embed snippet boxes.
  4. `BookingPagesView.vue` (147 violations) $\rightarrow$ Slot selector and calendar cards.
  5. `ScanNameCardView.vue` (588 violations) $\rightarrow$ Camera viewport and confidence pills.
  6. `FormBuilderView.vue` (673 violations) $\rightarrow$ Drag-and-drop form canvas and property inspector.
  7. `AddonsView.vue` (889 violations) $\rightarrow$ Marketplace app tiles.
- **Verification Gate**: Run `node scripts/audit-tokens.cjs --batch 6`. Must achieve **0 violations**.

#### Phase 3: Settings & Administration (Batch 5)
- **Sequence**:
  1. `RolesTab.vue` (150 violations) $\rightarrow$ RBAC permission table.
  2. `TeamsTab.vue` (192 violations) $\rightarrow$ Team member rosters.
  3. `CrmSetupStatusBar.vue` (244 violations) $\rightarrow$ Setup progress track.
  4. `AgentsTab.vue` (320 violations) $\rightarrow$ Agent roster cards.
  5. `SettingsView.vue` (892 violations) $\rightarrow$ Outer settings layout and sidebar navigation.
  6. `AutomationTab.vue` (964 violations) $\rightarrow$ Automation triggers and node cards.
  7. `AIAssistantsTab.vue` (1,157 violations) $\rightarrow$ AI model parameters and chat simulator.
- **Verification Gate**: Run `node scripts/audit-tokens.cjs --batch 5`. Must achieve **0 violations**.

### 5.3 Golden Rules for Milestone 4 Worker to Prevent Rejection
1. **Never Introduce Malformed Double Opacity**:
   - `bg-gray-50/50` $\rightarrow$ `bg-background` (or `bg-muted/50`). **NEVER** `bg-background/50/50` or `bg-muted/40/90`.
   - `scripts/audit-tokens.cjs` now has a dedicated rule (`malformedDoubleOpacity`) that strictly fails on any double-slash syntax.
2. **Never Leave `dark:` Classes on Component Elements**:
   - Strip both `bg-white` AND `dark:bg-[#0E131F]` $\rightarrow$ `bg-card`.
   - Strip `text-gray-900` AND `dark:text-white` $\rightarrow$ `text-foreground`.
   - Strip `border-gray-200` AND `dark:border-gray-800` $\rightarrow$ `border-border`.
3. **Always Update `<script>` Block Class Strings**:
   - In `PartnerReferralsView.vue`, `PartnerOverviewView.vue`, and `PartnerRegisterView.vue`, ensure JS helper functions and computed properties return semantic tokens.
4. **Preserve Chart Wrapper Aesthetics for M6**:
   - Keep the chart options structure intact in `PartnerOverviewView.vue`, but ensure all surrounding containers, legends, and center count labels use token classes (`bg-muted/50`, `border-border`, `text-foreground`).
5. **Verify Clean Production Build**:
   - Run `npm run build` after editing to ensure zero TypeScript errors and zero missing Tailwind classes.

---

## 6. Verification Method

To independently verify the Batch 7 findings and recipes:

1. **Batch 7 Audit Verification**:
   ```bash
   node scripts/audit-tokens.cjs --batch 7
   ```
   - Current state: Returns exit code 1 with 5,276 violations.
   - Target post-worker state: Returns exit code 0 with `TOTAL VIOLATIONS: 0`.

2. **Milestone 4 Combined Audit Verification**:
   ```bash
   node scripts/audit-tokens.cjs --batch 5
   node scripts/audit-tokens.cjs --batch 6
   node scripts/audit-tokens.cjs --batch 7
   ```
   - Target post-worker state: All 3 batches pass with 0 violations across 22 files.

3. **Production Build Gate**:
   ```bash
   npm run build
   ```
   - Asserts TypeScript compilation and asset bundling succeed with 0 errors.

4. **Visual Contrast Check**:
   - Inspect `PartnerTrackSwitcher.vue` in light and dark mode: ensure active Referral tab has distinct blue/info background and Sales tab has distinct green/brand background.
   - Inspect `PartnerRegisterView.vue`: verify logo toggles between light and dark SVG lockups.
   - Inspect `PartnerReferralsView.vue`: verify Kanban stage cards and deal drop targets have legible borders and readable contrast in both themes.
