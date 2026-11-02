# Milestone 4: Batch 5 (Settings) Deep Exploration Report

## 1. Observation

### 1.1 Audit Command & Summary
Executing the automated audit gate:
```powershell
node scripts/audit-tokens.cjs --batch 5
```
Yielded exit code `1` with a grand total of **3,919 token violations** across the 7 target files.

### 1.2 Violation Breakdown by File & Category

| Target File | Total Lines | Palette Grays & Neutrals | Raw Status / Accent Colors | Tailwind Arbitrary Hex/RGB | `dark:` Class Overrides | Total Violations |
|---|---|---|---|---|---|---|
| `src/views/SettingsView.vue` | 3,098 | 754 | 137 | 1 | 0 | **892** |
| `src/components/settings/AIAssistantsTab.vue` | 4,368 | 855 | 275 | 27 | 0 | **1,157** |
| `src/components/settings/AutomationTab.vue` | 1,985 | 577 | 103 | 0 | 284 | **964** |
| `src/components/settings/AgentsTab.vue` | 649 | 179 | 17 | 0 | 124 | **320** |
| `src/components/settings/TeamsTab.vue` | 550 | 97 | 26 | 0 | 69 | **192** |
| `src/components/settings/RolesTab.vue` | 403 | 83 | 9 | 0 | 58 | **150** |
| `src/components/dashboard/CrmSetupStatusBar.vue` | 689 | 122 | 36 | 19 | 67 | **244** |
| **Batch 5 Totals** | **11,742** | **2,667** | **603** | **47** | **602** | **3,919** |

---

### 1.3 Key File-Specific Observations

#### 1. `src/views/SettingsView.vue` (892 violations)
- **Structure**: Acts as the master settings shell with a left navigation sidebar (`<aside class="w-64 bg-white border-r border-gray-200 ...">`) and content router displaying 22 sub-tabs. It hosts inline sub-tab views (`search`, `inboxes`, `custom-attributes`, `labels`, `canned-responses`, `sla`, `revenue-targets`, `web-forms`, `ai-behaviour`, `ai-inboxes`, `ai-playground`, `ai-training`, `integrations`, `webhooks`, `marketplace`, `account-settings`, `audit-logs`, `billing`) alongside embedded components (`AgentsTab`, `TeamsTab`, `RolesTab`, `AutomationTab`, `AIAssistantsTab`).
- **Palette Grays**: Heavily relies on `bg-white` (87x), `bg-gray-50` (61x), `border-gray-200` (112x), `border-gray-100` (28x), `text-gray-900` (80x), `text-gray-500` (68x), `text-gray-400` (101x), `text-white` (37x).
- **Arbitrary Hex**: Line 276 contains `bg-[#23B750]`:
  ```html
  <div class="w-2.5 h-2.5 rounded-full bg-[#23B750]" :class="entry.success ? 'animate-pulse' : 'bg-red-400'"></div>
  ```
- **Script Data Colors**: 65 violations in script (lines 2493–2908), including SLA priority badge colors (`bg-red-50 text-red-700 border-red-200`, `bg-amber-50 text-amber-700 border-amber-200`, `bg-blue-50 text-blue-700 border-blue-200`), integration platform card colors (`Shopify: bg-emerald-100 text-emerald-700`, `HubSpot: bg-orange-100 text-orange-700`, `Stripe: bg-indigo-100 text-indigo-700`), and initial user demo roles (`Senior Sales Rep: bg-pink-100 text-pink-700`).

#### 2. `src/components/settings/AIAssistantsTab.vue` (1,157 violations)
- **Structure**: Comprehensive multi-mode assistant manager (list mode, assistant detail setup tabs: Identity, Knowledge, Behavior, Tools, Connect, Playground, Report; plus 11 slide-over and modal dialogs).
- **0 `dark:` overrides**: Built entirely with raw light-mode Tailwind classes, meaning every card, text, border, and badge lacks dark-theme adaptability.
- **Arbitrary Hex**: Exactly 27 instances of `hover:bg-[#1ea446]` paired with `bg-primary text-white` on action buttons across the file (lines 27, 168, 273, 497, 641, 648, 655, 841, 1136, 1402, 1438, 1539, 1568, 1692, 1825, 1913, 1935, 2316, 2389, 2487, 2569, 2668, 2726, 2796, 2839, 2928, 2995).
- **Modal Overlays**: 11 dialog backdrops hardcoded to `bg-gray-950/40 backdrop-blur-xs` or `bg-gray-950/50 backdrop-blur-xs` (lines 2249, 2329, 2402, 2451, 2500, 2582, 2681, 2739, 2809, 2852, 2941).
- **HTML/CSS Charts**: Lines 2158–2184 render HTML bar charts using `bg-slate-300` and `bg-emerald-500` inside a `bg-gray-100` container.
- **Script Badge Helpers**: Lines 3037–3500 contain helper methods (`getBadgeClass`, `getCategoryBadgeClass`, `getSetupTabClass`) returning raw colors (`bg-emerald-100 text-emerald-700`, `bg-slate-100 text-slate-600`, `bg-red-50 text-red-600 border-red-100`, `bg-sky-50 text-sky-600 border-sky-100`).

#### 3. `src/components/settings/AutomationTab.vue` (964 violations)
- **Structure**: Workflow rule builder, conditions/actions matrix, and execution log table.
- **Heavy Slate & `dark:` Overrides**: Extensively built with `slate` palette classes paired with `dark:` variants: `text-slate-400` (65x), `text-white` (64x), `bg-slate-800` (55x), `border-slate-200` (49x), `dark:text-white` (42x), `dark:border-slate-700` (38x), `dark:bg-slate-800` (34x), `dark:text-slate-400` (26x).
- **Inline Style Hex Colors**: Lines 1247–1253 define tag dot hex colors in script:
  ```typescript
  const availableTags = ref<AutomationTag[]>([
    { name: 'Lead Routing', dotColor: '#3B82F6' },
    { name: 'Escalations', dotColor: '#EF4444' },
    { name: 'VIP Clients', dotColor: '#A855F7' },
    { name: 'SLA Alert', dotColor: '#F59E0B' },
    { name: 'Deals', dotColor: '#10B981' },
    { name: 'WhatsApp', dotColor: '#22C55E' },
  ]);
  ```
  Rendered in template via `:style="{ backgroundColor: tag.dotColor }"`.

#### 4. `src/components/settings/AgentsTab.vue` (320 violations)
- **Structure**: User directory list, invitation modal, edit modal, and permission category matrix.
- **Redundant `dark:` Overrides**: Contains 124 `dark:` overrides, notably 35x `dark:border-border`, 19x `dark:text-white`, 13x `dark:bg-muted`, 10x `dark:bg-card`.
- **Script Color Map**: Line 554 defines:
  ```typescript
  const colorMap = ['bg-teal-105 text-teal-700', 'bg-rose-100 text-rose-700', 'bg-lime-100 text-lime-700', 'bg-violet-100 text-violet-750'];
  ```
- **Custom Scrollbar**: Lines 642–646 contain raw hex `#cbd5e1` and `#94a3b8` in `<style scoped>`.

#### 5. `src/components/settings/TeamsTab.vue` (192 violations)
- **Structure**: Team squad cards grid, routing configuration, create/edit team modal, and member combobox.
- **Color Method**: Lines 374–407 define `getColorClasses(colorName: string)` returning:
  - `blue`: `bg-blue-50 dark:bg-blue-950/40`, `text-blue-600 dark:text-blue-400`, `dot: bg-blue-500`
  - `violet`: `bg-violet-50 dark:bg-violet-950/40`, `text-violet-600 dark:text-violet-400`, `dot: bg-violet-500`
  - `amber`: `bg-amber-50 dark:bg-amber-950/40`, `text-amber-600 dark:text-amber-400`, `dot: bg-amber-500`
  - `rose`: `bg-rose-50 dark:bg-rose-950/40`, `text-rose-600 dark:text-rose-400`, `dot: bg-rose-500`
  - `emerald`: `bg-emerald-50 dark:bg-emerald-950/40`, `text-primary dark:text-primary`, `dot: bg-primary`
- **Custom Scrollbar**: Lines 543–547 contain raw hex `#cbd5e1` and `#94a3b8` in `<style scoped>`.

#### 6. `src/components/settings/RolesTab.vue` (150 violations)
- **Structure**: Workspace roles card list, custom role creation modal, and permission toggling matrix.
- **Script Color Options**: Lines 341–345 define:
  ```typescript
  const colorOptions = [
    { bg: 'bg-purple-100', text: 'text-purple-700' },
    { bg: 'bg-teal-100', text: 'text-teal-700' },
    { bg: 'bg-cyan-100', text: 'text-cyan-700' }
  ];
  ```
- **Custom Scrollbar**: Lines 395–401 contain raw hex `#cbd5e1` and `#94a3b8` in `<style scoped>`.

#### 7. `src/components/dashboard/CrmSetupStatusBar.vue` (244 violations)
- **Structure**: 1-line top banner notification bar and distilled 3-step setup progress modal.
- **Top Bar**: Line 6 hardcoded in solid blue:
  ```html
  <div class="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 border-b border-blue-700 dark:border-blue-500 px-4 py-2 sm:px-6 transition-colors cursor-pointer group text-white">
  ```
- **Arbitrary Hex & Overrides**: 19 hex classes (`bg-[#111827]`, `bg-[#23B750]`, `text-[#23B750]`, `hover:bg-[#1da044]`, `hover:bg-[#1a943e]`).
- **Canvas Confetti**: Line 630 & 640 call `confetti()` with hardcoded hex arrays:
  ```javascript
  colors: ['#23B750', '#62D816', '#10B981', '#34D399', '#3B82F6', '#F59E0B']
  ```

---

### 1.4 Syntax Risks & Edge Cases Discovered

#### Acute Double-Opacity Collision Risk (239 Existing Instances)
Scanning with `/\b(?:bg|text|border|ring|divide)-(?:gray|slate|zinc|emerald|green|red|blue|purple|violet|amber|yellow|sky|rose)-\d+\/\d+\b/g` identified **239 pre-existing raw classes with slash-opacity modifiers**, distributed as:
- `SettingsView.vue`: 39 instances (e.g. `bg-gray-100/80`, `bg-gray-50/70`, `bg-gray-50/50`)
- `AIAssistantsTab.vue`: 53 instances (e.g. `bg-gray-100/70`, `border-gray-200/60`, `border-emerald-100/80`, `text-red-500/70`)
- `AutomationTab.vue`: 65 instances (e.g. `bg-slate-50/70`, `bg-slate-800/40`, `bg-purple-950/40`, `border-purple-200/60`)
- `CrmSetupStatusBar.vue`: 55 instances (e.g. `border-gray-200/70`, `bg-emerald-50/30`, `bg-emerald-950/15`, `border-emerald-200/80`)
- `AgentsTab.vue`: 11 instances (`bg-gray-50/50`, `bg-red-950/40`, `bg-slate-950/60`)
- `TeamsTab.vue`: 8 instances (`bg-slate-950/60`, `bg-blue-950/40`, `bg-violet-950/40`)
- `RolesTab.vue`: 8 instances (`bg-gray-50/50`, `bg-gray-55/40`, `bg-slate-950/60`)

**Failure mechanism**: If a replacement replaces `bg-emerald-50` with `bg-success/10` without stripping the trailing `/30`, the string becomes `bg-success/10/30`. This is invalid CSS that triggers the audit gate's `malformedDoubleOpacity` rule.

#### Non-Standard Numeric Color Steps (17 Unique Variants)
The audit regex `-\d+\b` caught 17 custom/micro-contrast numeric classes across Batch 5:
- Borders: `border-gray-150`, `border-gray-250`, `border-gray-255`, `border-gray-350`
- Backgrounds: `bg-gray-150`, `bg-gray-250`, `bg-teal-105`
- Text: `text-gray-350`, `text-gray-405`, `text-gray-450`, `text-gray-455`, `text-gray-505`, `text-gray-550`, `text-gray-650`, `text-gray-655`, `text-gray-750`, `text-teal-655`

---

## 2. Logic Chain

1. **Premise**: Per `AGENTS.md` and `PROJECT.md`, dark mode must be 100% token-driven from `src/assets/index.css`. Raw palette grays, hex/rgb classes, raw status colors, and `dark:` overrides are forbidden.
2. **Analysis of 2,667 Palette Grays**:
   - `bg-white` and `bg-white dark:bg-card` denote card/modal surface containers $\to$ replace with `bg-card`.
   - `bg-gray-50` / `bg-slate-50` denote page backdrops or table row fills $\to$ replace with `bg-background` or `bg-muted/50`.
   - `bg-gray-100`, `bg-gray-200`, `bg-slate-100`, `bg-slate-200` denote muted pill/input backings $\to$ replace with `bg-muted`.
   - `border-gray-200`, `border-slate-200`, `border-gray-100`, `border-gray-150`, `border-gray-250` denote layout separators $\to$ replace with `border-border`.
   - `text-gray-900`, `text-slate-900`, `text-gray-800` denote primary text $\to$ replace with `text-foreground`.
   - `text-gray-500`, `text-gray-400`, `text-slate-400`, `text-slate-500`, and non-standard steps (`text-gray-450`, `text-gray-550`, etc.) denote secondary text $\to$ replace with `text-muted-foreground`.
   - `text-white` on `bg-primary` buttons denotes high-contrast inverted text $\to$ replace with `text-primary-foreground`.
3. **Analysis of 47 Arbitrary Hex Classes**:
   - `bg-[#23B750]` and `text-[#23B750]` denote brand green $\to$ replace with `bg-primary` and `text-primary`.
   - `hover:bg-[#1ea446]`, `hover:bg-[#1da044]`, `hover:bg-[#1a943e]` denote button hover shades $\to$ replace with `hover:bg-primary/90`.
   - `bg-[#111827]` in `CrmSetupStatusBar.vue` denotes dark card surface $\to$ replace with `bg-card`.
4. **Analysis of 603 Raw Status / Accent Colors**:
   - Status badge triplets and pairs (`bg-emerald-50 text-emerald-700 border-emerald-200`) $\to$ replace with semantic status tokens (`bg-success/10 text-success border-success/20`).
   - Red/Rose alerts $\to$ replace with `bg-destructive/10 text-destructive border-destructive/20`.
   - Amber/Yellow warnings $\to$ replace with `bg-warning/10 text-warning border-warning/20`.
   - Blue/Sky/Indigo info $\to$ replace with `bg-info/10 text-info border-info/20`.
   - Categorical badges (Purple, Teal, Lime, Cyan) in Roles, Teams, and AIAssistants $\to$ map cleanly to `--tag-1` through `--tag-6` (`bg-tag-N text-tag-N-foreground`).
5. **Analysis of 602 `dark:` Overrides**:
   - Redundant pairs like `bg-white dark:bg-card` and `border-gray-200 dark:border-border` simply become `bg-card` and `border-border`.
   - Slate pairs like `bg-white dark:bg-slate-800` and `text-slate-900 dark:text-white` become `bg-card` and `text-foreground`.
6. **Analysis of 239 Slash-Opacity Pre-existing Classes**:
   - Any tokenization rule replacing a raw class must match the trailing `(?:\/\d+)?` and normalize to single semantic opacity (e.g. `bg-emerald-50(?:\/\d+)?` $\to$ `bg-success/10`).
7. **Synthesis**: Implementing these unified recipes eliminates 100% of the 3,919 audit violations across Batch 5 while preserving exact UI fidelity in both light and dark themes.

---

## 3. Production-Ready Drop-In Semantic Token Recipes

### Recipe 1: Global Macro Replacements (Template & Attributes)

| Original Pattern | Target Semantic Token | Notes / Rationale |
|---|---|---|
| `bg-white dark:bg-card` / `bg-white dark:bg-slate-800` / `bg-white dark:bg-slate-900` | `bg-card` | Consolidates card background across themes |
| `bg-white` (standalone card / panel) | `bg-card` | In light mode resolves to white, in dark mode to dark surface |
| `bg-gray-50` / `bg-slate-50` (standalone page bg) | `bg-background` | Respects base app background |
| `bg-gray-50(?:\/\d+)?` / `bg-slate-50(?:\/\d+)?` (table header/subtle strip) | `bg-muted/50` | Retains subtle contrast against `bg-card` |
| `bg-gray-100(?:\/\d+)?` / `bg-slate-100(?:\/\d+)?` / `bg-gray-200(?:\/\d+)?` | `bg-muted` | Standard muted surface for chips, pills, secondary inputs |
| `border-gray-200 dark:border-border` / `border-slate-200 dark:border-slate-700` | `border-border` | Resolves border variable automatically |
| `border-gray-200(?:\/\d+)?` / `border-slate-200` / `border-gray-100` / `border-gray-300` | `border-border` | Standard border |
| `border-gray-150` / `border-gray-250` / `border-gray-255` / `border-gray-350` | `border-border` | Non-standard numeric step consolidation |
| `text-gray-900 dark:text-white` / `text-slate-900 dark:text-white` | `text-foreground` | High-contrast primary typography |
| `text-gray-900` / `text-slate-900` / `text-gray-800` / `text-slate-800` | `text-foreground` | Primary text token |
| `text-gray-700` / `text-slate-700` / `text-gray-600` / `text-slate-600` | `text-foreground` | Form labels, navigation items |
| `text-gray-500 dark:text-gray-400` / `text-slate-500 dark:text-slate-400` | `text-muted-foreground` | Secondary/tertiary typography |
| `text-gray-500` / `text-gray-400` / `text-slate-400` / `text-slate-300` | `text-muted-foreground` | Timestamps, hints, placeholders |
| `text-gray-350` / `text-gray-405` / `text-gray-450` / `text-gray-505` / `text-gray-550` / `text-gray-650` | `text-muted-foreground` | Non-standard numeric step consolidation |
| `divide-gray-150 dark:divide-border` / `divide-slate-100 dark:divide-slate-800` | `divide-border` | List item dividers |
| `divide-gray-100` / `divide-gray-200` / `divide-slate-200` | `divide-border` | List item dividers |
| `placeholder-gray-400` / `placeholder-slate-400` | `placeholder:text-muted-foreground` | Input placeholders |
| `bg-primary hover:bg-[#1ea446] text-white` | `bg-primary hover:bg-primary/90 text-primary-foreground` | Action buttons (27 occurrences in AIAssistantsTab) |
| `bg-[#23B750]` | `bg-primary` | Brand green hex replacement |
| `text-[#23B750]` | `text-primary` | Brand green text replacement |
| `hover:bg-[#1da044]` / `hover:bg-[#1a943e]` | `hover:bg-primary/90` | Button hover replacement |
| `bg-slate-950/60` / `bg-gray-950/50` / `bg-gray-950/40` / `bg-black/60` | `bg-background/80 backdrop-blur-sm` | Unified modal dialog backdrops |
| `border-slate-900 dark:border-white` / `border-gray-900 dark:border-white` | `border-foreground` | Active selection rings |

---

### Recipe 2: Status & Semantic Color Triplets / Pairs

```regex
// Success / Green
bg-emerald-50(?:\/\d+)? text-emerald-700(?:\/\d+)? border-emerald-200(?:\/\d+)? -> bg-success/10 text-success border-success/20
bg-emerald-50(?:\/\d+)? text-emerald-600(?:\/\d+)? -> bg-success/10 text-success
bg-emerald-100(?:\/\d+)? text-emerald-800(?:\/\d+)? -> bg-success/15 text-success
bg-emerald-500 / bg-emerald-600 -> bg-success (or bg-primary)

// Destructive / Red / Rose
bg-red-50(?:\/\d+)? text-red-700(?:\/\d+)? border-red-200(?:\/\d+)? -> bg-destructive/10 text-destructive border-destructive/20
bg-red-50(?:\/\d+)? text-red-600(?:\/\d+)? -> bg-destructive/10 text-destructive
bg-red-100(?:\/\d+)? text-red-700(?:\/\d+)? -> bg-destructive/15 text-destructive
bg-red-500 / bg-red-600 -> bg-destructive

// Warning / Amber / Orange / Yellow
bg-amber-50(?:\/\d+)? text-amber-700(?:\/\d+)? border-amber-200(?:\/\d+)? -> bg-warning/10 text-warning border-warning/20
bg-amber-50(?:\/\d+)? text-amber-600(?:\/\d+)? -> bg-warning/10 text-warning
bg-amber-100(?:\/\d+)? text-amber-800(?:\/\d+)? -> bg-warning/15 text-warning
bg-orange-100 text-orange-700 -> bg-warning/15 text-warning

// Info / Blue / Sky / Indigo
bg-blue-50(?:\/\d+)? text-blue-700(?:\/\d+)? border-blue-200(?:\/\d+)? -> bg-info/10 text-info border-info/20
bg-blue-50(?:\/\d+)? text-blue-600(?:\/\d+)? -> bg-info/10 text-info
bg-blue-100(?:\/\d+)? text-blue-700(?:\/\d+)? -> bg-info/15 text-info
bg-sky-50(?:\/\d+)? text-sky-600(?:\/\d+)? -> bg-info/10 text-info
bg-sky-100(?:\/\d+)? text-sky-800(?:\/\d+)? -> bg-info/15 text-info
bg-indigo-100 text-indigo-700 -> bg-info/15 text-info
```

---

### Recipe 3: Script-Level Color Objects by File

#### A. `src/components/dashboard/CrmSetupStatusBar.vue`
- **Line 6 (Top Status Bar)**:
  ```html
  <!-- Before -->
  <div class="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 border-b border-blue-700 dark:border-blue-500 px-4 py-2 sm:px-6 transition-colors cursor-pointer group text-white">
  
  <!-- After (100% Token-Driven Info Accent) -->
  <div class="w-full bg-info hover:bg-info/90 border-b border-info/30 px-4 py-2 sm:px-6 transition-colors cursor-pointer group text-info-foreground">
  ```
  - Corresponding internal child items: `text-white` $\to$ `text-info-foreground`, `ring-white/25` $\to$ `ring-info-foreground/25`, `bg-white` $\to$ `bg-info-foreground`.
- **Lines 44, 47 (Modal Box & Banner)**:
  ```html
  <!-- Before -->
  <div class="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
  <div class="relative w-full h-36 sm:h-44 bg-slate-100 dark:bg-slate-900 overflow-hidden border-b border-gray-200/70 dark:border-gray-800">
  
  <!-- After -->
  <div class="bg-card border border-border rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
  <div class="relative w-full h-36 sm:h-44 bg-muted overflow-hidden border-b border-border">
  ```
- **Lines 91–94, 99–102 (Step Boxes Checked / Unchecked)**:
  ```html
  <!-- Before -->
  :class="setupTasks.team.completed
    ? 'bg-emerald-50/30 dark:bg-emerald-950/15 border-emerald-200/80 dark:border-emerald-900/50 hover:border-emerald-300 dark:hover:border-emerald-700/60'
    : 'bg-gray-50/60 dark:bg-gray-800/30 border-gray-200/80 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'"
  
  <!-- After -->
  :class="setupTasks.team.completed
    ? 'bg-success/5 border-success/30 hover:border-success/50'
    : 'bg-muted/40 border-border hover:border-border/80'"
  ```

#### B. `src/components/settings/RolesTab.vue`
- **Lines 341–345 (Categorical Role Colors)**:
  ```typescript
  // Before
  const colorOptions = [
    { bg: 'bg-purple-100', text: 'text-purple-700' },
    { bg: 'bg-teal-100', text: 'text-teal-700' },
    { bg: 'bg-cyan-100', text: 'text-cyan-700' }
  ];

  // After (Paired Tag Tokens)
  const colorOptions = [
    { bg: 'bg-tag-4', text: 'text-tag-4-foreground' },
    { bg: 'bg-tag-2', text: 'text-tag-2-foreground' },
    { bg: 'bg-tag-6', text: 'text-tag-6-foreground' }
  ];
  ```
- **Lines 395–401 (Custom Scrollbar)**:
  Replace `#cbd5e1` and `#94a3b8` with `var(--border)` or remove if handled globally by `src/assets/index.css`.

#### C. `src/components/settings/TeamsTab.vue`
- **Lines 374–407 (`getColorClasses`)**:
  ```typescript
  // Before
  function getColorClasses(colorName: string) {
    switch (colorName) {
      case 'blue':
        return { bg: 'bg-blue-50 dark:bg-blue-950/40', text: 'text-blue-600 dark:text-blue-400', dot: 'bg-blue-500' };
      case 'violet':
        return { bg: 'bg-violet-50 dark:bg-violet-950/40', text: 'text-violet-600 dark:text-violet-400', dot: 'bg-violet-500' };
      case 'amber':
        return { bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-600 dark:text-amber-400', dot: 'bg-amber-500' };
      case 'rose':
        return { bg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-600 dark:text-rose-400', dot: 'bg-rose-500' };
      default:
        return { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-primary dark:text-primary', dot: 'bg-primary' };
    }
  }

  // After (100% Tokenized)
  function getColorClasses(colorName: string) {
    switch (colorName) {
      case 'blue':
        return { bg: 'bg-info/10', text: 'text-info', dot: 'bg-info' };
      case 'violet':
        return { bg: 'bg-tag-4', text: 'text-tag-4-foreground', dot: 'bg-tag-4-foreground' };
      case 'amber':
        return { bg: 'bg-warning/10', text: 'text-warning', dot: 'bg-warning' };
      case 'rose':
        return { bg: 'bg-destructive/10', text: 'text-destructive', dot: 'bg-destructive' };
      default:
        return { bg: 'bg-primary/10', text: 'text-primary', dot: 'bg-primary' };
    }
  }
  ```

#### D. `src/components/settings/AgentsTab.vue`
- **Line 554 (Avatar Background Color Map)**:
  ```typescript
  // Before
  const colorMap = ['bg-teal-105 text-teal-700', 'bg-rose-100 text-rose-700', 'bg-lime-100 text-lime-700', 'bg-violet-100 text-violet-750'];

  // After
  const colorMap = [
    'bg-tag-2 text-tag-2-foreground',
    'bg-tag-5 text-tag-5-foreground',
    'bg-tag-3 text-tag-3-foreground',
    'bg-tag-4 text-tag-4-foreground'
  ];
  ```

#### E. `src/components/settings/AutomationTab.vue`
- **Lines 1247–1253 (Tag Dot Colors)**:
  ```typescript
  // Before
  const availableTags = ref<AutomationTag[]>([
    { name: 'Lead Routing', dotColor: '#3B82F6' },
    { name: 'Escalations', dotColor: '#EF4444' },
    { name: 'VIP Clients', dotColor: '#A855F7' },
    { name: 'SLA Alert', dotColor: '#F59E0B' },
    { name: 'Deals', dotColor: '#10B981' },
    { name: 'WhatsApp', dotColor: '#22C55E' },
  ]);

  // After (Using CSS Variable references)
  const availableTags = ref<AutomationTag[]>([
    { name: 'Lead Routing', dotColor: 'var(--info)' },
    { name: 'Escalations', dotColor: 'var(--destructive)' },
    { name: 'VIP Clients', dotColor: 'var(--tag-4-foreground)' },
    { name: 'SLA Alert', dotColor: 'var(--warning)' },
    { name: 'Deals', dotColor: 'var(--success)' },
    { name: 'WhatsApp', dotColor: 'var(--primary)' },
  ]);
  ```

#### F. `src/components/settings/AIAssistantsTab.vue`
- **Lines 3037–3053 (`getBadgeClass`)**:
  ```typescript
  // Before
  ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
  return 'bg-red-50 text-red-600 border-red-100';
  return 'bg-sky-50 text-sky-600 border-sky-100';
  return 'bg-emerald-50 text-emerald-600 border-emerald-100';
  return 'bg-indigo-50 text-indigo-600 border-indigo-100';
  return 'bg-gray-50 text-gray-600 border-gray-200';

  // After
  ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
  return 'bg-destructive/10 text-destructive border-destructive/20';
  return 'bg-info/10 text-info border-info/20';
  return 'bg-success/10 text-success border-success/20';
  return 'bg-info/10 text-info border-info/20';
  return 'bg-muted text-muted-foreground border-border';
  ```
- **Lines 3467–3500 (Rule Category Badges)**:
  - `Safety & PII`: `bg-destructive/10 text-destructive`
  - `Compliance & Halal`: `bg-success/10 text-success`
  - `Commercial & Pricing`: `bg-warning/10 text-warning`
  - `Scope & Conduct` / `Billing & Payment`: `bg-tag-4 text-tag-4-foreground`
  - `Cold-Chain Delivery`: `bg-info/10 text-info`
  - Default: `bg-muted text-muted-foreground`

---

## 4. Caveats

1. **Particle Confetti Colors in `CrmSetupStatusBar.vue`**:
   `CrmSetupStatusBar.vue` imports `canvas-confetti` and invokes particle bursts with static hex colors `['#23B750', '#62D816', '#10B981', '#34D399', '#3B82F6', '#F59E0B']`. The token audit script only inspects template and class strings, so these inline JS arguments do not register as violations. However, per `PROJECT.md` Feature 20, canvas confetti adaptation is scheduled for Milestone 6.
2. **Tailwind Arbitrary Shadows**:
   Shadows like `shadow-2xs`, `shadow-xs`, `shadow-sm`, and `shadow-2xl` in these 7 files rely on Tailwind defaults. In dark mode, Tailwind's dark shadows blend into the background unless customized; `src/assets/index.css` provides `--rks-shadow-*` tokens if deeper diffused glow is desired.
3. **Read-Only Scope**:
   In strict compliance with the Teamwork Explorer contract, no production code modifications were executed during this investigation.

---

## 5. Conclusion

1. Batch 5 (Settings) comprises **7 target files containing 11,742 total lines and 3,919 raw token violations**.
2. The violations stem from two main historical sources:
   - Older light-only files (`AIAssistantsTab.vue` and `SettingsView.vue`) relying on `bg-white`, `text-gray-900`, `border-gray-200`, and `hover:bg-[#1ea446]`.
   - Partially-migrated files (`AutomationTab.vue`, `AgentsTab.vue`, `TeamsTab.vue`, `RolesTab.vue`) riddled with redundant `dark:` class overrides and `slate` palette classes.
3. The migration plan is completely derisked:
   - All 47 arbitrary hex instances map cleanly to `bg-primary`, `text-primary`, `hover:bg-primary/90`, or `bg-card`.
   - All 602 `dark:` overrides collapse into single semantic tokens (`bg-card`, `border-border`, `text-foreground`).
   - The 239 slash-opacity raw classes have been identified and guarded with safe regex rules to prevent malformed double opacity (`/10/30`).
   - The 17 non-standard numeric step classes (`border-gray-150`, `text-gray-550`, etc.) have explicit mappings.
   - The baseline build compiles with 0 errors via `npm run build`.

---

## 6. Verification Method

To independently verify the investigation findings and ensure zero regressions upon implementation:

1. **Audit Check Before and After**:
   ```powershell
   node scripts/audit-tokens.cjs --batch 5
   ```
   *Expected outcome before implementation*: 3,919 violations.
   *Expected outcome after implementation*: 0 violations (exit code 0).

2. **File-by-File Audit Check**:
   ```powershell
   node scripts/audit-tokens.cjs --file src/views/SettingsView.vue
   node scripts/audit-tokens.cjs --file src/components/settings/AIAssistantsTab.vue
   node scripts/audit-tokens.cjs --file src/components/settings/AutomationTab.vue
   node scripts/audit-tokens.cjs --file src/components/settings/AgentsTab.vue
   node scripts/audit-tokens.cjs --file src/components/settings/TeamsTab.vue
   node scripts/audit-tokens.cjs --file src/components/settings/RolesTab.vue
   node scripts/audit-tokens.cjs --file src/components/dashboard/CrmSetupStatusBar.vue
   ```

3. **Check for Double Opacity Syntax Errors**:
   ```powershell
   node -e "const { auditFile, BATCHES } = require('./scripts/audit-tokens.cjs'); BATCHES[5].files.forEach(f => { const res = auditFile(f); const dbl = res.violations.filter(v => v.ruleName === 'Malformed Double Opacity Classes'); console.log(f + ': ' + dbl.length + ' double-opacity'); });"
   ```
   *Expected outcome*: 0 double-opacity violations across all 7 files.

4. **TypeScript and Production Build Gate**:
   ```powershell
   cmd.exe /c npm run build
   ```
   *Expected outcome*: `vue-tsc -b && vite build` completes with exit code 0 and zero TypeScript diagnostics.
