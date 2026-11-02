# Batch 9 (Docs & Guidelines) Investigation & Migration Analysis

**Investigator**: explorer_m5_3  
**Date**: 2026-10-31  
**Scope**: Batch 9 Files (`src/views/DesignSystemView.vue`, `src/views/GuidelinesView.vue`), plus related documentation/data (`src/data/designSystemGuidelines.ts`, `DESIGN.md`, `src/data/componentsList.ts`).

---

## 1. Executive Summary

Batch 9 comprises the design documentation, component catalog, living showroom, and brand guidelines views of the RakanSales application.

Running `node scripts/audit-tokens.cjs --batch 9` reveals **1,846 total violations** across the two primary batch views:
1. `src/views/DesignSystemView.vue`: **1,468 violations**
2. `src/views/GuidelinesView.vue`: **378 violations**

Additionally, auditing `src/data/designSystemGuidelines.ts` (which is imported and displayed directly by `DesignSystemView.vue`) reveals **36 violations**, and `DESIGN.md` contains the same legacy classes. `src/data/componentsList.ts` was audited and passed with **0 violations**.

The primary cause of the large violation count is that `DesignSystemView.vue` and `GuidelinesView.vue` were created as early reference prototypes containing:
- Manual `dark:` class overrides across every container (e.g., `bg-white dark:bg-card`, `border-gray-200 dark:border-border`, `text-gray-900 dark:text-foreground`).
- Raw palette grays (`gray-`, `slate-`, `zinc-`, `neutral-`, `white`, `black`).
- Hardcoded brand green hexes (`#23B750`, `#008236`, `#1fa346`, `#62d816`).
- Legacy Kanban stage hexes (`#3b82f6`, `#00D2C4`, `#FFCC00`, `#FF8800`, `#10B981`) instead of the newly standardized `--tag-1` through `--tag-6` categorical tag tokens.
- An unmigrated embedded copy of the Omnichannel 3-pane chat simulator (Category 9 in `DesignSystemView.vue`) containing raw neutrals and hardcoded status colors.
- Scoped `<style>` blocks with raw `rgba(16, 185, 129, ...)` colors.

Both files can be migrated to 100% semantic tokens without loss of functionality, achieving **0 violations** in `audit-tokens.cjs` while dramatically improving readability in dark mode.

---

## 2. Audit Tool (`scripts/audit-tokens.cjs`) Evaluation

### 2.1 How the Script Evaluates Batch 9
The audit tool scans Batch 9 based on `BATCHES[9]` in `scripts/audit-tokens.cjs`:
```javascript
9: {
  name: 'Batch 9 (Docs & Guidelines)',
  files: [
    'src/views/DesignSystemView.vue',
    'src/views/GuidelinesView.vue'
  ]
}
```
Evaluation mechanics:
- **Line-by-line regex scanning**: It does not parse Vue templates into an AST. It tests each line against regex patterns: `paletteGrays`, `hexRgbClasses`, `rawStatusColors`, `darkOverrides`, `inlineHexStyles`, `malformedDoubleOpacity`, and `scopedStyleHexRgb`.
- **Exemptions**: Pure comment lines (`//`, `/* ... */`, `*`) and lines containing `/* audit-ignore */` or `<!-- audit-ignore -->` are skipped.
- **Data objects vs. template strings**: Plain JS variable definitions like `{ hex: '#23B750' }` are **not** flagged because they do not match `bg-[#...]` or `style="...#..."`. However, string literals containing class names (like `border: 'border-t-[#3b82f6]'`) **are** matched and flagged by the regex rules.

### 2.2 Baseline Audit Results

```
======================================================================
 RAKANSALES TOKEN AUDIT REPORT
======================================================================
Scanned: 2 file(s)
Batch: 9 (Batch 9 (Docs & Guidelines))
----------------------------------------------------------------------
✖ src/views/DesignSystemView.vue (1468 violations)
✖ src/views/GuidelinesView.vue (378 violations)
----------------------------------------------------------------------
VIOLATIONS BY CATEGORY:
  - Tailwind Arbitrary Hex/RGB Classes: 111
  - Palette Grays & Neutrals: 964
  - dark: Class Overrides: 341
  - Raw Status / Accent Colors: 426
  - Inline Hex/RGB Styles: 1
  - Scoped <style> Raw Hex/RGB Colors: 3
TOTAL VIOLATIONS: 1846
======================================================================
```

---

## 3. UI Container Classes vs. Data & Sample Displays

A core directive of this investigation is distinguishing between **UI container classes** and **data/sample displays**:

### 3.1 UI Container Classes (Must use 100% Semantic Tokens)
UI containers define the shell, cards, modals, tabs, and navigation of the documentation pages.
- **Top Layout Canvas**: Replace `bg-gradient-to-tr from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-slate-900/90 dark:to-slate-950` with `bg-background text-foreground`.
- **Top Tabs Bar & Switchers**: Replace `bg-gray-200 dark:bg-muted border-gray-200 dark:border-border` and manual active state classes `bg-white dark:bg-card text-gray-900 dark:text-foreground` with `bg-muted border-border` and active `bg-card text-foreground shadow-sm`.
- **Overview & Hero Banners**: Replace `bg-gradient-to-r from-slate-950 via-slate-900 to-zinc-950 text-white border-slate-800` with `bg-card text-foreground border-border` (or dedicated invariant rail token `bg-rail text-rail-foreground border-rail-border`).
- **Section Cards & Panels**: Replace `CardHeader dark:text-slate-200`, `CardContent`, and `Card` borders with `bg-card border-border text-foreground`.
- **Tooltips, Popovers, & Hover Cards**: Replace hardcoded `bg-slate-950/90` with standard Shadcn token classes `bg-popover text-popover-foreground border-border`.
- **Search & Input Fields**: Replace `bg-gray-50 dark:bg-slate-950 border-gray-200 dark:border-slate-800` with `bg-muted/50 border-border text-foreground placeholder:text-muted-foreground`.
- **Spotlight Modal (Cmd+K)**: Replace `bg-card dark:bg-slate-900 border-border` with `bg-card border-border text-foreground`, hover item `hover:bg-accent hover:text-accent-foreground` or `hover:bg-primary/10 hover:text-primary`.
- **Floating Back-to-Top**: Replace `bg-gray-900/90 dark:bg-slate-800/90 text-white` with `bg-primary text-primary-foreground shadow-xl`.

### 3.2 Data and Sample Displays
`DesignSystemView.vue` is a living showcase demonstrating color tokens, typography scales, deals pipeline stages, and component states.

1. **Kanban Pipeline Stages (Section 8)**:
   - **Current issue**: Lines 479-485 define `stageColorConfig` using legacy hex strings (`#3b82f6`, `#00D2C4`, `#FFCC00`, `#FF8800`, `#10B981`) and template line 3763 applies `:style="{ backgroundColor: stageColorConfig[stage].headerBar }"`.
   - **Tokenized Solution**: Align 1:1 with `DealsView.vue` (Batch 3) using the categorical tag tokens (`--tag-1` through `--tag-5`):
     ```typescript
     const stageColorConfig: Record<string, { border: string; bg: string; text: string; headerBar: string }> = {
       New: { border: 'border-t-tag-1', bg: 'bg-tag-1/10', text: 'text-tag-1-foreground', headerBar: 'bg-tag-1' },
       Acknowledged: { border: 'border-t-tag-2', bg: 'bg-tag-2/10', text: 'text-tag-2-foreground', headerBar: 'bg-tag-2' },
       Qualifying: { border: 'border-t-tag-3', bg: 'bg-tag-3/10', text: 'text-tag-3-foreground', headerBar: 'bg-tag-3' },
       'Proposal / Quotation': { border: 'border-t-tag-4', bg: 'bg-tag-4/10', text: 'text-tag-4-foreground', headerBar: 'bg-tag-4' },
       'Follow Up': { border: 'border-t-tag-5', bg: 'bg-tag-5/10', text: 'text-tag-5-foreground', headerBar: 'bg-tag-5' }
     }
     ```
     In the template, replace `:style="{ backgroundColor: ... }"` with `:class="['h-1.5 w-full rounded-full shrink-0', stageColorConfig[stage].headerBar]"`. This completely removes all hex classes and inline styles from the Kanban board.

2. **Color Palette Swatches & System States (Section 6)**:
   - **Current issue**: Hardcoded `#62D816` inline style on line 3355, `bg-slate-900 dark:bg-slate-950` on line 3369, and hardcoded `bg-emerald-500`, `bg-blue-500`, `bg-amber-500`, `bg-red-500` for system states.
   - **Tokenized Solution**:
     - Primary Green swatch: `bg-primary`, text `text-primary-foreground`, label `bg-primary / var(--primary)`.
     - Secondary Lime swatch: `bg-brand-secondary`, label `bg-brand-secondary / var(--brand-secondary)`.
     - Rail / Dark Charcoal swatch: `bg-rail`, text `text-rail-foreground`, label `bg-rail / var(--rail)`.
     - Muted swatch: `bg-muted`, text `text-muted-foreground`, label `bg-muted / var(--muted)`.
     - System states:
       - Success: `bg-success/10 text-success border-success/20`, dot `bg-success`, copies `text-success` or `bg-success`.
       - Info: `bg-info/10 text-info border-info/20`, dot `bg-info`, copies `text-info` or `bg-info`.
       - Warning: `bg-warning/10 text-warning border-warning/20`, dot `bg-warning`, copies `text-warning` or `bg-warning`.
       - Destructive / Danger: `bg-destructive/10 text-destructive border-destructive/20`, dot `bg-destructive`, copies `text-destructive` or `bg-destructive`.

3. **ESM Implementation Code Blocks (Sections 1 through 7)**:
   - **Current issue**: Every section has a code block `<pre class="bg-slate-950 border-slate-800/80">` with syntax highlighted spans: `text-amber-400` (keywords), `text-emerald-300` (strings), `text-slate-400` (comments), and `bg-slate-800` (copy buttons).
   - **Tokenized Solution**:
     - Container: `bg-rail border-rail-border text-rail-foreground font-mono` (or `bg-muted/80 border-border text-foreground font-mono`). `--rail` is dark invariant in both light and dark modes, perfectly preserving code block terminal contrast!
     - Keywords: `text-warning font-semibold`
     - Strings: `text-primary` or `text-success`
     - Comments: `text-muted-foreground`
     - Copy button: `bg-card hover:bg-muted text-foreground border-border`

4. **Omnichannel Chat Simulator (Category 9, lines 3886-4378)**:
   - **Current issue**: Contains an unmigrated copy of Omnichannel with `border-gray-200`, `dark:border-slate-800`, `bg-[#F9FAFB]`, `text-[#23B750]`, `bg-[#23B750]`, `bg-red-400`, `text-[#9F5CF8]`, etc.
   - **Tokenized Solution**: Align 1:1 with `OmnichannelView.vue` (Batch 4, which passed with 0 violations):
     - Agent outgoing message bubble: `bg-primary text-primary-foreground border-transparent`
     - Customer incoming message bubble: `bg-card text-foreground border-border`
     - Quoted reply card: `bg-muted/60 text-foreground` with left bar `bg-primary`
     - Conversation item active: `bg-card ring-1 ring-primary/40 shadow-xs`
     - SLA badge: `bg-destructive/10 text-destructive border-destructive/20`
     - Unread badge: `bg-destructive text-destructive-foreground`
     - VIP badge: `bg-tag-4 text-tag-4-foreground border-tag-4-foreground/20`

5. **Guidelines View (Logo Showcase, Color Tables, & Principles)**:
   - Logo system dark container: Replace `bg-slate-950` with `bg-rail` (dark outer rail token) and button `border-rail-border hover:bg-rail-active text-rail-foreground`.
   - Clear space visualizer: Replace `bg-emerald-50/10 border-emerald-400/30 text-emerald-600` with `bg-primary/10 border-primary/30 text-primary`.
   - Color spectrum swatches: Use semantic tokens (`bg-primary`, `bg-brand-secondary`, `bg-info`, `bg-warning`, `bg-destructive`, `bg-rail`).
   - Contrast rating badges: Pass -> `bg-success/10 text-success border-success/20`, Fail -> `bg-destructive/10 text-destructive border-destructive/20`.
   - Copywriting Good/Bad panels: Good -> `bg-success/10 border-success/20 text-success`, Bad -> `bg-destructive/10 border-destructive/20 text-destructive`.

---

## 4. Detailed File-by-File Investigation

### 4.1 `src/views/DesignSystemView.vue` (1,468 violations)

#### Violation Distribution by File Section
| Section | Line Range | Violations | Dominant Violation Types |
|---|---|---|---|
| `<script setup>` & Page Header | 1 – 1,250 | 73 | `border-t-[#3b82f6]`, `bg-[#...]`, `from-slate-50`, `dark:bg-card`, `dark:text-foreground` |
| Catalog Explorer Tab | 1,251 – 1,480 | 161 | `bg-white dark:bg-card`, `border-gray-200 dark:border-border`, `text-gray-900 dark:text-foreground` |
| Showroom Header & Sandbox | 1,481 – 1,775 | 214 | `from-slate-950`, `bg-slate-800`, `text-slate-400`, `dark:bg-slate-900`, `dark:border-slate-800` |
| Sec 1 Inputs & Controls | 1,776 – 2,078 | 43 | `text-amber-400`, `text-emerald-300`, `border-slate-800`, `bg-slate-950` |
| Sec 2 Overlays & Dialogs | 2,079 – 2,333 | 63 | `bg-slate-950`, `text-white`, `border-white`, `bg-white` |
| Sec 3 Data Display & Funnel | 2,334 – 2,994 | 119 | `text-white`, `text-emerald-400`, `text-neutral-400`, `bg-neutral-950`, `border-slate-800` |
| Sec 4 Navigation & Feedback | 2,995 – 3,243 | 49 | `border-emerald-500`, `text-amber-400`, `text-emerald-400`, `bg-slate-950` |
| Sec 5 Iconography | 3244 – 3317 | 13 | `text-slate-200`, `bg-emerald-50`, `dark:bg-emerald-950`, `text-[#25D366]` |
| Sec 6 Colors & Typography | 3318 – 3494 | 55 | `style="background-color: #62D816;"`, `bg-slate-900`, `bg-emerald-500`, `text-emerald-600` |
| Sec 7 Dashboard & Toast | 3495 – 3740 | 78 | `bg-emerald-500`, `text-emerald-600`, `bg-amber-500`, `text-amber-600`, `bg-indigo-500` |
| Sec 8 Kanban Pipeline Board | 3741 – 4378 | 441 | `text-[#23B750]`, `bg-[#23B750]`, `bg-[#F9FAFB]`, `dark:border-slate-800`, `dark:bg-slate-950` |
| Guidelines Tab & Spotlight | 4379 – 4860 | 156 | `from-slate-950`, `bg-slate-950`, `border-slate-800`, `bg-emerald-50`, `text-[#008236]` |
| Scoped `<style>` Block | 4861 – 4917 | 3 | `rgba(16, 185, 129, ...)` in `.skeleton-shimmer::after` |

#### Key Replacement Patterns for `DesignSystemView.vue`

1. **Kanban Stage Colors (`stageColorConfig`)**:
   ```typescript
   // BEFORE:
   const stageColorConfig = {
     New: { border: 'border-t-[#3b82f6]', bg: 'bg-[#3b82f6]/10', text: 'text-[#3b82f6]', headerBar: '#3b82f6' },
     Acknowledged: { border: 'border-t-[#00D2C4]', bg: 'bg-[#00D2C4]/10', text: 'text-[#00D2C4]', headerBar: '#00D2C4' },
     Qualifying: { border: 'border-t-[#FFCC00]', bg: 'bg-[#FFCC00]/10', text: 'text-[#FFCC00]', headerBar: '#FFCC00' },
     'Proposal / Quotation': { border: 'border-t-[#FF8800]', bg: 'bg-[#FF8800]/10', text: 'text-[#FF8800]', headerBar: '#FF8800' },
     'Follow Up': { border: 'border-t-[#10B981]', bg: 'bg-[#10B981]/10', text: 'text-[#10B981]', headerBar: '#10B981' }
   }

   // AFTER:
   const stageColorConfig = {
     New: { border: 'border-t-tag-1', bg: 'bg-tag-1/10', text: 'text-tag-1-foreground', headerBar: 'bg-tag-1' },
     Acknowledged: { border: 'border-t-tag-2', bg: 'bg-tag-2/10', text: 'text-tag-2-foreground', headerBar: 'bg-tag-2' },
     Qualifying: { border: 'border-t-tag-3', bg: 'bg-tag-3/10', text: 'text-tag-3-foreground', headerBar: 'bg-tag-3' },
     'Proposal / Quotation': { border: 'border-t-tag-4', bg: 'bg-tag-4/10', text: 'text-tag-4-foreground', headerBar: 'bg-tag-4' },
     'Follow Up': { border: 'border-t-tag-5', bg: 'bg-tag-5/10', text: 'text-tag-5-foreground', headerBar: 'bg-tag-5' }
   }
   ```

2. **Top Canvas & Page Headers**:
   ```html
   <!-- BEFORE: -->
   <div class="h-full w-full overflow-y-auto scroll-smooth bg-gradient-to-tr from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-slate-900/90 dark:to-slate-950 text-foreground">
     <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-foreground tracking-tight">
     <p class="text-xs md:text-sm text-gray-500 dark:text-muted-foreground font-medium">

   <!-- AFTER: -->
   <div class="h-full w-full overflow-y-auto scroll-smooth bg-background text-foreground">
     <h1 class="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
     <p class="text-xs md:text-sm text-muted-foreground font-medium">
   ```

3. **Interactive Visual Showroom Sandbox Frame (Line 1762)**:
   ```html
   <!-- BEFORE: -->
   <div :class="[ 'rounded-3xl transition-colors duration-300 space-y-8 p-6 md:p-8 border ', isDarkMode ? 'dark bg-background border-border text-foreground' : 'bg-white/60 border-slate-200 text-slate-900 ' ]">

   <!-- AFTER: -->
   <div :class="[ 'rounded-3xl transition-colors duration-300 space-y-8 p-6 md:p-8 border ', isDarkMode ? 'dark bg-background border-border text-foreground' : 'bg-card/60 border-border text-foreground ' ]">
   ```

4. **Section 6 Swatches & System States**:
   ```html
   <!-- BEFORE: -->
   <div class="h-10 w-full rounded-lg bg-slate-900 dark:bg-slate-950 mb-2 flex items-center justify-center border border-black/5">
     <span class="text-[10px] font-mono font-bold text-white">#0f172a / #020617</span>
   </div>
   <div class="h-10 w-full rounded-lg mb-2 flex items-center justify-center border border-black/5" style="background-color: #62D816;">
     <span class="text-[10px] font-mono font-bold text-slate-800">--rks-lime</span>
   </div>
   <button @click="copyCodeSnippet('text-emerald-500')" class="... bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 ...">
     <span class="size-3 rounded-full bg-emerald-500 ..."></span>

   <!-- AFTER: -->
   <div class="h-10 w-full rounded-lg bg-rail mb-2 flex items-center justify-center border border-border">
     <span class="text-[10px] font-mono font-bold text-rail-foreground">var(--rail)</span>
   </div>
   <div class="h-10 w-full rounded-lg bg-brand-secondary mb-2 flex items-center justify-center border border-border">
     <span class="text-[10px] font-mono font-bold text-primary-foreground">var(--brand-secondary)</span>
   </div>
   <button @click="copyCodeSnippet('text-success')" class="... bg-success/10 border-success/20 text-success ...">
     <span class="size-3 rounded-full bg-success ..."></span>
   ```

5. **Scoped `<style>` Shimmer Effect (Line 4890)**:
   ```css
   /* BEFORE: */
   .skeleton-shimmer::after {
     background: linear-gradient(
       90deg,
       transparent,
       rgba(16, 185, 129, 0.08) 20%,
       rgba(16, 185, 129, 0.22) 50%,
       rgba(16, 185, 129, 0.08) 80%,
       transparent
     );
   }

   /* AFTER: */
   .skeleton-shimmer::after {
     background: linear-gradient(
       90deg,
       transparent,
       color-mix(in oklch, var(--primary) 8%, transparent) 20%,
       color-mix(in oklch, var(--primary) 22%, transparent) 50%,
       color-mix(in oklch, var(--primary) 8%, transparent) 80%,
       transparent
     );
   }
   ```

---

### 4.2 `src/views/GuidelinesView.vue` (378 violations)

#### Violation Distribution by Section
| Section | Line Range | Violations | Description |
|---|---|---|---|
| Sidebar Table of Contents | 1 – 220 | 40 | Navigation links, brand logo lockup, Showroom button |
| Header & Introduction | 221 – 257 | 12 | Brand guidelines hero title, subtitle, sandbox banner |
| 01 — Logo System | 258 – 377 | 60 | Light/dark logo display containers, download SVG links, clear space rule visualizer |
| 02 — Color Palette | 378 – 447 | 25 | Swatches grid, contrast pass/fail pills, neutral spectrum table |
| 03 — Typography | 448 – 526 | 41 | Typography hierarchy, font families, usage guidance cards |
| 04 — Spacing & Layout | 527 – 551 | 9 | Spacing bars visualizer, density rules |
| 05 — Grids & Breakpoints | 552 – 613 | 39 | Breakpoint specifications, column demo cards |
| 06 — Shadow & Elevation | 614 – 690 | 41 | Shadow preview cards, elevation hierarchy |
| 07 — Motion & Animation | 691 – 795 | 50 | Interactive snappy/fluid buttons, transition timing blocks |
| 08 — Iconography Rules | 796 – 836 | 16 | Standard icon sizes, stroke weights |
| 09 — Voice & Tone Copy | 837 – 888 | 26 | Action-oriented principles, good vs. bad examples |
| 10 — Design Principles | 889 – 956 | 19 | Core tenets cards |

#### Key Replacement Patterns for `GuidelinesView.vue`

1. **Root Layout & Sidebar**:
   ```html
   <!-- BEFORE: -->
   <div class="flex min-h-screen bg-gray-50 text-slate-800 font-sans">
     <aside class="w-[240px] shrink-0 border-r border-gray-200 bg-white sticky top-0 h-screen overflow-y-auto hidden lg:flex flex-col">
       <div class="px-6 py-6 border-b border-gray-100">
         <span class="font-bold text-base tracking-tight"><span class="text-[#23B750]">Rakan</span><span class="text-[#62d816]">Sales</span></span>
         <p class="text-[10px] font-bold text-gray-400 mt-2 tracking-wider">BRAND GUIDELINES V1.0</p>
       </div>
       <RouterLink to="/design-system" class="... bg-[#23B750] hover:bg-emerald-600 text-white ...">

   <!-- AFTER: -->
   <div class="flex min-h-screen bg-background text-foreground font-sans">
     <aside class="w-[240px] shrink-0 border-r border-border bg-card sticky top-0 h-screen overflow-y-auto hidden lg:flex flex-col">
       <div class="px-6 py-6 border-b border-border">
         <span class="font-bold text-base tracking-tight"><span class="text-primary">Rakan</span><span class="text-brand-secondary">Sales</span></span>
         <p class="text-[10px] font-bold text-muted-foreground mt-2 tracking-wider">BRAND GUIDELINES V1.0</p>
       </div>
       <RouterLink to="/design-system" class="... bg-primary hover:bg-primary/90 text-primary-foreground ...">
   ```

2. **Active Section Navigation Pill**:
   ```html
   <!-- BEFORE: -->
   :class="['group flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-all duration-150', 
            activeSection === s.id ? 'bg-emerald-50 text-[#23B750] font-semibold' : 'text-gray-600 hover:bg-gray-50']"
   <div :class="['w-5 h-5 flex items-center justify-center rounded-md text-[10px] font-bold transition-colors',
                activeSection === s.id ? 'bg-[#23B750] text-white' : 'bg-gray-100 text-gray-400']">

   <!-- AFTER: -->
   :class="['group flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-all duration-150', 
            activeSection === s.id ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-muted']"
   <div :class="['w-5 h-5 flex items-center justify-center rounded-md text-[10px] font-bold transition-colors',
                activeSection === s.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground']">
   ```

3. **Logo System Containers (Light & Dark Canvas)**:
   ```html
   <!-- BEFORE: -->
   <!-- Light Logo Container -->
   <div class="p-8 bg-white border border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-6 ...">
     <span class="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">Primary Logo (Light Canvas)</span>
     <a class="... text-gray-600 hover:text-slate-900 border border-gray-200 rounded-lg hover:bg-gray-50 ...">
       <Download class="w-3.5 h-3.5 text-[#23B750]" />

   <!-- Dark Logo Container -->
   <div class="p-8 bg-slate-950 rounded-2xl flex flex-col items-center justify-center gap-6 ...">
     <span class="text-[10px] font-semibold tracking-wider text-gray-500 uppercase">Primary Logo (Dark Canvas)</span>
     <a class="... text-gray-300 hover:text-white border border-slate-800 rounded-lg hover:bg-slate-900 ...">
       <Download class="w-3.5 h-3.5 text-[#23B750]" />

   <!-- AFTER: -->
   <!-- Light Logo Container -->
   <div class="p-8 bg-card border border-border rounded-2xl flex flex-col items-center justify-center gap-6 ...">
     <span class="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">Primary Logo (Light Canvas)</span>
     <a class="... text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted ...">
       <Download class="w-3.5 h-3.5 text-primary" />

   <!-- Dark Logo Container (Uses dedicated dark rail token invariant) -->
   <div class="p-8 bg-rail rounded-2xl flex flex-col items-center justify-center gap-6 border border-rail-border">
     <span class="text-[10px] font-semibold tracking-wider text-rail-muted-foreground uppercase">Primary Logo (Dark Canvas)</span>
     <a class="... text-rail-foreground/80 hover:text-rail-foreground border border-rail-border rounded-lg hover:bg-rail-active ...">
       <Download class="w-3.5 h-3.5 text-primary" />
   ```

4. **Cards, Tables, & Principle Callouts**:
   ```html
   <!-- BEFORE: -->
   <div class="p-5 bg-white border border-gray-200 rounded-2xl flex flex-col justify-between ...">
   <h2 class="text-2xl font-bold text-slate-900">
   <p class="text-sm text-gray-500 max-w-2xl leading-relaxed">
   <span class="px-2 py-0.5 rounded-full text-[10px] font-bold" :class="c.contrastLight.startsWith('Pass') ? 'bg-emerald-55 text-emerald-700' : 'bg-red-50 text-red-600'">

   <!-- AFTER: -->
   <div class="p-5 bg-card border border-border rounded-2xl flex flex-col justify-between ...">
   <h2 class="text-2xl font-bold text-foreground">
   <p class="text-sm text-muted-foreground max-w-2xl leading-relaxed">
   <span class="px-2 py-0.5 rounded-full text-[10px] font-bold" :class="c.contrastLight.startsWith('Pass') ? 'bg-success/10 text-success border border-success/20' : 'bg-destructive/10 text-destructive border border-destructive/20'">
   ```

---

### 4.3 `src/data/designSystemGuidelines.ts` (36 violations)
Contains `export const rakanSalesGuidelinesMarkdown = ...`.  
Legacy class violations occur inside markdown documentation tables and blueprints:
- Replace `text-gray-900 dark:text-foreground` -> `text-foreground`
- Replace `text-gray-800 dark:text-foreground` -> `text-foreground`
- Replace `text-gray-600 dark:text-muted-foreground` -> `text-muted-foreground`
- Replace `text-gray-700 dark:text-foreground` -> `text-foreground`
- Replace `text-gray-500` -> `text-muted-foreground`
- Replace `bg-white dark:bg-card` -> `bg-card`
- Replace `bg-gray-50 dark:bg-background` -> `bg-background`
- Replace `bg-gray-900` outer rail -> `bg-rail`
- Replace `#3b82f6`, `#00D2C4`, `#FFCC00`, `#FF8800`, `#10B981` with `tag-1` through `tag-5`
- Replace `bg-[#23B750] text-white` -> `bg-primary text-primary-foreground`
- Replace `bg-green-50 text-green-700` -> `bg-success/10 text-success`
- Replace `bg-red-50 text-red-600` -> `bg-destructive/10 text-destructive`

Updating this file aligns the exported markdown prompt, the visual guidelines rendered tab in `DesignSystemView.vue`, clipboard copies, and `DESIGN.md`.

---

## 5. Token Replacement Mapping Table

| Legacy Class / Pattern | Semantic Token Class | Scope & Application |
|---|---|---|
| `bg-gray-50`, `bg-slate-50`, `bg-[#F9FAFB]` | `bg-background` | Outer page container, view canvas, main area |
| `bg-white` | `bg-card` | Cards, panels, modals, dropdowns |
| `border-gray-200`, `border-gray-100`, `border-slate-200` | `border-border` | All structural borders and dividers |
| `border-gray-100 dark:border-border` | `border-border` | Component cards and sections |
| `text-slate-900`, `text-slate-800`, `text-gray-900` | `text-foreground` | Primary titles, headings, body text |
| `text-gray-500`, `text-gray-400`, `text-slate-400` | `text-muted-foreground` | Subtitles, labels, placeholders, timestamps |
| `text-gray-600`, `text-slate-600` | `text-muted-foreground` | Description text, secondary nav links |
| `bg-gray-100`, `bg-slate-100` | `bg-muted` | Inactive pill backgrounds, search inputs, code blocks |
| `hover:bg-gray-50`, `hover:bg-gray-100`, `hover:bg-slate-100` | `hover:bg-muted` or `hover:bg-accent` | Button and link hover states |
| `text-[#23B750]`, `text-[#008236]` | `text-primary` | Brand accents, key links, icons |
| `bg-[#23B750]`, `bg-[#008236]` | `bg-primary` | Primary action buttons, active tabs |
| `hover:bg-emerald-600`, `hover:bg-[#1fa346]` | `hover:bg-primary/90` | Primary button hover state |
| `text-white` (on primary elements) | `text-primary-foreground` | Text on primary buttons, badges, and chips |
| `bg-emerald-50`, `bg-emerald-500/10` | `bg-success/10` or `bg-primary/10` | Status badges, live diagnostics pings |
| `border-emerald-200`, `border-emerald-500/20` | `border-success/20` or `border-primary/20` | Tinted status badge borders |
| `text-emerald-600`, `text-emerald-400`, `text-emerald-500` | `text-success` or `text-primary` | Success text, verified checkmarks |
| `bg-amber-500/10`, `bg-amber-50` | `bg-warning/10` | Warning badges, pending tags, SLA reminders |
| `border-amber-500/20`, `border-amber-200` | `border-warning/20` | Warning badge borders |
| `text-amber-600`, `text-amber-400`, `text-amber-500` | `text-warning` | Warning text, quota indicators |
| `bg-red-500/10`, `bg-red-50`, `bg-[#EF4444]` | `bg-destructive/10` | Error alerts, late SLA badges, critical alerts |
| `border-red-500/20`, `border-red-200` | `border-destructive/20` | Error badge borders |
| `text-red-600`, `text-red-400`, `text-red-500` | `text-destructive` | Destructive text, error messages |
| `bg-blue-500/10`, `bg-indigo-500/10` | `bg-info/10` | Info badges, AI assistant indicators |
| `border-blue-500/20`, `border-indigo-500/20` | `border-info/20` | Info badge borders |
| `text-blue-600`, `text-blue-400`, `text-indigo-500` | `text-info` | Info text, live stream indicators |
| `bg-slate-950`, `from-slate-950 via-slate-900 to-zinc-950` | `bg-rail border-rail-border text-rail-foreground` | Invariant dark containers (code blocks, dark logo canvas) |
| `border-slate-800`, `border-slate-700` | `border-rail-border` | Invariant dark container borders |
| `text-slate-300`, `text-slate-400` (on dark) | `text-rail-foreground/80` or `text-rail-muted-foreground` | Invariant dark container text |
| `hover:bg-slate-800`, `hover:bg-slate-700` | `hover:bg-rail-active` | Invariant dark container button hovers |
| Kanban stages `#3b82f6`, `#00D2C4`, `#FFCC00`, `#FF8800`, `#10B981` | `tag-1`, `tag-2`, `tag-3`, `tag-4`, `tag-5` | Deals stages (New, Ack, Qual, Prop, Follow Up) |
| `dark:bg-card`, `dark:text-foreground`, `dark:border-border` | Single semantic token without `dark:` prefix | Codebase rule: all dark overrides removed |

---

## 6. Implementation Plan for Implementer Agent

1. **Step 1: Migrate `src/views/GuidelinesView.vue`**
   - Replace layout wrapper `bg-gray-50 text-slate-800` with `bg-background text-foreground`.
   - Replace aside navigation and header with `bg-card border-border text-foreground`.
   - Update dark logo canvas to use `bg-rail border-rail-border text-rail-foreground`.
   - Replace raw status colors (`bg-emerald-50`, `text-[#23B750]`, `bg-red-50`, `text-red-600`) with semantic status tokens (`bg-primary/10`, `text-primary`, `bg-destructive/10`, `text-destructive`).
   - Run `node scripts/audit-tokens.cjs --file src/views/GuidelinesView.vue` and verify 0 violations.

2. **Step 2: Migrate `src/views/DesignSystemView.vue`**
   - Update `stageColorConfig` in `<script setup>` from hex values to `tag-1` through `tag-5`.
   - Replace page layout wrapper and 3 top tabs buttons with semantic classes (remove `dark:` overrides).
   - Replace Overview Banner and visual sandbox controls with semantic tokens.
   - Update ESM code blocks (Sections 1-7) to use `bg-rail` and semantic syntax tokens (`text-warning`, `text-primary`, `text-info`, `text-muted-foreground`).
   - Update Section 6 swatches and system states to use semantic tokens (`bg-primary`, `bg-brand-secondary`, `bg-rail`, `bg-success`, `bg-info`, `bg-warning`, `bg-destructive`).
   - Tokenize the embedded Omnichannel simulator in Section 8 (Category 9) following `OmnichannelView.vue`.
   - Update Guidelines tab (visual cards, token table, layout diagram, command palette spotlight).
   - Replace scoped `<style>` shimmer rgba with `color-mix(in oklch, var(--primary) ..., transparent)`.
   - Run `node scripts/audit-tokens.cjs --file src/views/DesignSystemView.vue` and verify 0 violations.

3. **Step 3: Align `src/data/designSystemGuidelines.ts` and `DESIGN.md`**
   - Replace legacy class references in markdown strings with semantic tokens.
   - Run `node scripts/audit-tokens.cjs --file src/data/designSystemGuidelines.ts` and verify 0 violations.

4. **Step 4: Execute Batch 9 Gate Verification**
   - Run `node scripts/audit-tokens.cjs --batch 9` and verify 0 violations.
   - Run `npm run build` and ensure TypeScript and Vite build passes with 0 errors.
