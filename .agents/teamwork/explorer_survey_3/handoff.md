# Survey Handoff Report: R3 (Charts & Documentation Alignment), Audit Script & Codemod Tooling

**Agent**: Explorer Survey 3 (`explorer_survey_3`)  
**Mission**: Investigate R3 (Charts & Documentation Alignment), Audit Script & Tokenization Codemod Tooling  
**Target File**: `.agents/teamwork/explorer_survey_3/handoff.md`  
**Date**: 2026-10-30  

---

## 1. Observation

### 1.1 Chart Dependencies & Implementations
From `package.json` (lines 15, 16, 19, 43):
- `"apexcharts": "^6.10.0"`
- `"vue3-apexcharts": "^1.11.1"`
- `"@unovis/ts": "^1.6.5"`
- `"@unovis/vue": "^1.6.5"`
- `"canvas-confetti": "^1.9.4"`
- `"recharts": "^3.8.0"` (present in `package.json` dependencies and referenced in legacy docs, but Recharts is a React library and has 0 component imports in `src/`).

### 1.2 Comprehensive Chart Inventory
Exhaustive codebase search revealed that chart components are concentrated in 3 primary locations:

#### Location A: `src/views/DashboardView.vue` (18 ApexCharts instances)
1. **Line 266**: Area Sparkline — `:options="sparklineBlueOptions" :series="sparklinePipelineSeries"`
2. **Line 288**: Area Sparkline — `:options="sparklinePurpleOptions" :series="sparklineConvSeries"`
3. **Line 310**: Area Sparkline — `:options="sparklineOrangeOptions" :series="sparklineRespSeries"`
4. **Line 344**: RadialBar SLA — `:options="slaRadialOptions" :series="[hasSampleData ? 92 : 0]"`
5. **Line 376**: Area Win Rate — `:options="winRateTrendOptions" :series="winRateTrendSeries"`
6. **Line 423**: Area Spline Revenue vs Target — `:options="revenueApexOptions" :series="revenueApexSeries"`
7. **Line 470**: Horizontal Funnel Bar — `:options="funnelApexOptions" :series="funnelApexSeries"`
8. **Line 532**: Donut Channel Attribution — `:options="channelDonutOptions" :series="channelDonutSeries"`
9. **Line 651**: Horizontal Velocity Bar — `:options="velocityApexOptions" :series="velocityApexSeries"`
10. **Line 687**: Donut Lost Reason — `:options="lostReasonDonutOptions" :series="lostReasonDonutSeries"`
11. **Line 912**: Donut Marketing Attribution — `:options="attributionApexOptions" :series="attributionApexSeries"`
12. **Line 938**: Grouped Column Channel Bar — `:options="channelBarApexOptions" :series="channelBarApexSeries"`
13. **Line 973**: Dual-Axis Line Sessions vs Events — `:options="sessionsDualApexOptions" :series="sessionsDualApexSeries"`
14. **Line 985**: 100% Stacked Bar Lead Quality — `:options="qualityStackedApexOptions" :series="qualityStackedApexSeries"`
15. **Line 1149**: Line Sparkline Support Conversations — `:options="supportConversationsSparklineOptions" :series="supportConversationsSparklineSeries"`
16. **Line 1172**: Line Sparkline Support Resolved — `:options="supportResolvedSparklineOptions" :series="supportResolvedSparklineSeries"`
17. **Line 1194**: Line Sparkline Support Avg Response — `:options="supportAvgResponseSparklineOptions" :series="supportAvgResponseSparklineSeries"`
18. **Line 1336**: Donut Support Channel Breakdown — `:options="supportChannelDonutOptions" :series="supportChannelDonutSeries"`

#### Location B: `src/views/partner/PartnerOverviewView.vue` (2 ApexCharts instances)
1. **Line 317**: Donut Sales Track Funnel — `:options="salesApexDonutOptions" :series="salesApexDonutSeries"`
2. **Line 487**: Donut Referral Track Funnel — `:options="pipelineApexDonutOptions" :series="pipelineApexDonutSeries"`

#### Location C: `src/components/ui/chart/` (Unovis Primitive Components)
- `ChartCrosshair.vue`
- `ChartLegend.vue`
- `ChartSingleTooltip.vue`
- `ChartTooltip.vue`
- `interface.ts`
- `index.ts`
*Observation*: `src/components/ui/chart/index.ts` (lines 13-14) uses `hsl(var(--vis-primary-color) / ...)` and `hsl(var(--vis-secondary-color) / ...)`. However, in `src/assets/index.css`, neither `--vis-primary-color` nor `--vis-secondary-color` is defined.

#### Location D: Canvas Particle Confetti
- `src/components/dashboard/CrmSetupStatusBar.vue` (lines 626–640): hardcoded hex array `['#23B750', '#62D816', '#10B981', '#34D399', '#3B82F6', '#F59E0B']`.
- `src/views/OnboardingView.vue` (lines 307–330): hardcoded confetti colors.
- `src/views/SetupWizardView.vue` (lines 414–440): hardcoded confetti colors.

---

### 1.3 Chart Configuration Observations & Dark Mode Deficiencies
Inspection of `DashboardView.vue` and `PartnerOverviewView.vue` chart definitions revealed:
1. **Static Plain Objects (Non-reactive to Theme Toggle)**:
   - `sparklineBlueOptions`, `sparklinePurpleOptions`, `sparklineOrangeOptions`, `slaRadialOptions`, `winRateTrendOptions`, `velocityApexOptions`, `channelBarApexOptions`, `sessionsDualApexOptions`, `qualityStackedApexOptions`, `supportConversationsSparklineOptions`, `supportResolvedSparklineOptions`, `supportAvgResponseSparklineOptions` are declared as static JS objects (`const sparklineBlueOptions = { ... }`).
   - When the theme is toggled between light and dark, these static options are never re-evaluated by Vue.
2. **Hardcoded Hex Values**:
   - Series colors: `['#2E91E5']`, `['#7C3AED']`, `['#F97316']`, `['#23B750']`, `['#62D816']`, `['#EF4444']`, `['#cbd5e1']`, `['#3b82f6']`.
   - Gridlines: `grid: { borderColor: '#e2e8f0' }` (lines 1745, 2094, 2123). Renders light grey borders in dark mode.
   - Radial track: `track: { background: '#e5e7eb' }` (line 1681). Renders a bright white track ring in dark mode.
   - Axis labels: `labels: { style: { colors: '#94a3b8' } }`, `labels: { style: { colors: '#64748b' } }`.
3. **Missing Theme Mode & Background**:
   - ApexCharts root `theme: { mode: 'light' | 'dark' }` is omitted.
   - `chart: { background: 'transparent' }` is omitted on most charts, which can cause white background bleeding in dark mode.
   - Tooltips are hardcoded to `tooltip: { theme: 'dark' }` everywhere rather than adapting dynamically.
4. **ApexCharts CSS Variable Resolution Mechanism**:
   - In `node_modules/apexcharts/src/utils/Utils.js` (lines 544–574), ApexCharts provides `Utils.getThemeColor(color)`. It detects `var(...)` strings and mounts an offscreen element to resolve `getComputedStyle(tempElem).color`.
   - However, `Utils.getThemeColor` is ONLY called on `fillColor` in `Fill.js`. It is NOT called on `grid.borderColor`, `xaxis.labels.style.colors`, `yaxis.labels.style.colors`, or `plotOptions.radialBar.track.background`. Therefore, passing raw `var(...)` strings directly into grid or axis options can produce unparsed CSS variable strings in SVG attributes.

---

### 1.4 Documentation Discrepancies: `DESIGN.md` vs `AGENTS.md`
A side-by-side comparison between `DESIGN.md` (147 lines) and `AGENTS.md` (23 lines) revealed major discrepancies:

| Location in `DESIGN.md` | Content in `DESIGN.md` | Rule in `AGENTS.md` & Discrepancy |
|---|---|---|
| **Section 1 (Tech Stack)** | Mentions `Unovis/Recharts` | `Recharts` is a React library not used in Vue 3. Should cite `ApexCharts` and `@unovis/vue`. |
| **Section 2 (Color Strategy)** | Lists `--rks-green #23B750`, `--rks-green-dark #1A943E`, `--rks-lime #62D816`, `--rks-blue #2E91E5`, `--rks-warning #F59E0B`, `--destructive #EF4444` | Directly contradicts `AGENTS.md`: "No hex/rgb values in classes or inline styles: `bg-[#23B750]`... use status tokens (`success`, `warning`, `info`, `destructive`)". |
| **Section 2 (Color Strategy)** | Lists Outer Rail as `(--rks-gray-900) #111827` and Outer Rail Active as `(--rks-gray-800) #1F2937` | `ORIGINAL_REQUEST.md` (R1) mandates dedicated rail tokens: `--rail`, `--rail-foreground`, `--rail-muted-foreground`, `--rail-active`. |
| **Section 2 (Color Strategy)** | Ommits semantic status & categorical tag tokens | Missing: `success`, `warning`, `info`, `--tag-1` through `--tag-6`. |
| **Section 3 (Typography)** | Table specifies: `text-gray-900 dark:text-foreground`, `text-gray-800 dark:text-foreground`, `text-gray-600 dark:text-muted-foreground`, `text-gray-700 dark:text-foreground`, `text-gray-500` | Directly violates `AGENTS.md`: "No raw palette grays/neutrals: text-gray-*" AND "Do NOT add `dark:` color overrides". Must use semantic tokens (`text-foreground`, `text-muted-foreground`). |
| **Section 4 (App Shell Blueprint)** | Outer Rail: `Dark bg-gray-900`<br>Inner Sidebar: `Light w-60 bg-white dark:bg-card border-r`<br>Top Header: `h-16 bg-white dark:bg-card border-b`<br>Canvas: `bg-gray-50 dark:bg-background` | Violates token-only rules and promotes `dark:` overrides. Must use `bg-rail`, `bg-sidebar border-sidebar-border`, `bg-card border-border`, and `bg-background text-foreground`. |
| **Section 6 (Canonical Views)** | Deals Kanban: stripes `#3b82f6`, `#00D2C4`, `#FFCC00`, `#FF8800`, `#10B981`. Card: `text-gray-900 group-hover:text-[#23B750]`. Hot Lead: `text-amber-600 bg-amber-500/10 border-amber-500/20` | Violates raw hex and raw status colors. Must recommend `--tag-1`..`--tag-5`, `text-foreground group-hover:text-primary`, and `text-warning bg-warning/10 border-warning/20`. |
| **Section 6 (Canonical Views)** | Omnichannel: unread counter `#EF4444`, pulse dot `bg-[#23B750]`, agent bubble `bg-[#23B750] text-white`, audit logs `bg-green-50 text-green-700 border-green-200`, private note `bg-[#FEF9C3]/80 border-[#FEF08A] text-[#854D0E]` | Violates raw hex and raw status color rules. Must use `bg-destructive`, `bg-primary`, `bg-success/10 text-success`, and `bg-warning/10 border-warning/20 text-warning`. |
| **Section 7 (New Page Checklist)** | Item 3: `bg-primary hover:bg-primary-dark` with white text.<br>Item 4: `bg-emerald-50 text-emerald-600 border border-emerald-200` | Item 4 is a direct verbatim violation of `AGENTS.md` Rule 18. Must use `bg-success/10 text-success border-success/20`. Needs negative constraint: no raw grays, no hex, no `dark:` overrides. |

---

### 1.5 Scan of Current Violations across the Repository
Running `node scratch/survey_scanner.cjs` across all 9 batches yielded:
- **Total Files Scanned**: 417 files (70,926 lines of code)
- **Grand Total Violations**: 21,067 violations
  * Palette Grays / Neutrals: 12,088
  * Tailwind Hex / RGB Classes (`bg-[#...]`): 1,515
  * Inline Style Hex / RGB: 23
  * Raw Status Colors (`bg-emerald-*`, `text-red-*`): 3,444
  * `dark:` Class Overrides: 3,997
  * JavaScript Hex Literals in UI: 273

### 1.6 Build Verification
- Running `npm run build` directly in PowerShell triggers a Windows script execution policy restriction:
  `File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled on this system.`
- Executing via `cmd.exe /c "npm run build"` runs cleanly and succeeds:
  `vue-tsc -b && vite build` -> **Exit Code 0**, 0 TypeScript errors.

---

## 2. Logic Chain

1. **Why charts fail in dark mode**:
   - In Vue, components re-render when reactive state changes.
   - Because 12 out of 18 charts in `DashboardView.vue` use non-reactive static objects (`const sparklineBlueOptions = { ... }`), toggling dark mode will never cause those charts to update.
   - For computed options (`revenueApexOptions`, `funnelApexOptions`, `channelDonutOptions`, `attributionApexOptions`), they currently depend only on filter refs (`revenuePeriod`, `funnelMode`, `hasSampleData`), with NO reactive theme dependency.
   - Therefore, when dark mode is toggled via `document.documentElement.classList.toggle('dark')`, ApexCharts does not detect the class change and retains its original light SVG styles (e.g. `#e2e8f0` gridlines and `#94a3b8` text).

2. **Why dynamic CSS variable reading requires a dedicated reactive helper**:
   - `getComputedStyle(document.documentElement).getPropertyValue('--border')` reads synchronous DOM styles, but plain JS functions called outside reactive computed dependencies will not trigger re-renders when the class changes.
   - By creating a `useChartTheme()` helper connected to `useTheme().isDark`, any computed options referencing `useChartTheme()` will automatically re-run whenever `isDark` changes.
   - Furthermore, because ApexCharts does not resolve `var(...)` strings in grid borders, axis labels, and radial tracks, `useChartTheme` must resolve the CSS variable to an active sRGB/RGB color string (`rgb(...)` or hex) so that SVG attributes (`stroke`, `fill`) receive valid, resolved colors.

3. **Why `DESIGN.md` causes agent drift if left unaligned**:
   - `DESIGN.md` explicitly instructs agents to write `text-gray-900 dark:text-foreground` and `bg-emerald-50 text-emerald-600 border border-emerald-200`.
   - When developers or subagents reference `DESIGN.md`, they generate code that directly breaks `AGENTS.md`.
   - Aligning `DESIGN.md` to reflect the semantic token system is required to stop recurring violations during future feature additions.

4. **Why an automated audit script and codemod are necessary**:
   - With 21,067 violations across 417 files, manual migration by hand across 9 batches is error-prone and tedious.
   - An automated codemod script (`scripts/codemod-tokens.ts`) with deterministic replacement rules can safely handle 80–90% of standard patterns (`bg-white dark:bg-gray-900` -> `bg-card`, `text-gray-900 dark:text-foreground` -> `text-foreground`, `border-gray-200 dark:border-gray-800` -> `border-border`, status badges).
   - An automated audit script (`scripts/audit-tokens.ts`) serves as an objective gatekeeper in CI and development, verifying that migrated files reach exactly 0 violations.

---

## 3. Caveats

1. **Third-Party Official Brand Logos**:
   - Multi-color SVG icons for third-party platforms (e.g. Google "G" multicolored logo in OAuth, WhatsApp brand logo, Facebook blue) require specific brand colors. These should be protected with an `/* audit-ignore */` comment or a dedicated `data-brand-icon` attribute rather than forced into generic tokens.
2. **`index.css` Exemption**:
   - `src/assets/index.css` is the token definition source of truth and must contain raw color definitions (oklch, hex). The audit script must explicitly ignore `:root` and `.dark` blocks in `index.css`.
3. **ApexCharts Re-render Flicker**:
   - In some versions of ApexCharts, dynamically updating options can trigger full chart re-draw animations. Setting `chart.animations: { enabled: false }` or setting a fast speed during theme transitions prevents jarring layout shifts.
4. **Unovis Components Usage**:
   - Unovis components exist under `src/components/ui/chart/` as reusable primitives, but currently have no direct usage in page views (all CRM charts currently use ApexCharts). However, `src/components/ui/chart/index.ts` must still have `--vis-primary-color` and `--vis-secondary-color` mapped in `index.css` so Unovis components remain fully functional and token-compliant.

---

## 4. Conclusion & Actionable Recommendations

### 4.1 Recommended Reactive Chart System Architecture
Create `src/composables/useChartTheme.ts`:

```typescript
import { computed } from 'vue';
import { useTheme } from './useTheme'; // From R1

export function useChartTheme() {
  const { isDark } = useTheme();

  /**
   * Resolves a CSS variable on documentElement to a computed sRGB string.
   * Creates a reactive dependency on isDark.value.
   */
  const resolveToken = (varName: string, fallback = ''): string => {
    // Touch reactive ref to establish Vue dependency
    const _ = isDark.value;
    if (typeof window === 'undefined') return fallback;

    const dummy = document.createElement('div');
    dummy.style.color = `var(${varName})`;
    document.body.appendChild(dummy);
    const resolved = getComputedStyle(dummy).color;
    document.body.removeChild(dummy);

    return resolved || fallback;
  };

  /**
   * Standardized chart configuration defaults reacting to light/dark themes
   */
  const chartBase = computed(() => {
    const textColor = resolveToken('--muted-foreground', isDark.value ? '#94A3B8' : '#6B7280');
    const borderColor = resolveToken('--border', isDark.value ? 'rgba(255,255,255,0.1)' : '#E9E9E9');

    return {
      chart: {
        background: 'transparent',
        foreColor: textColor,
        fontFamily: 'Inter, sans-serif',
        toolbar: { show: false }
      },
      theme: {
        mode: isDark.value ? ('dark' as const) : ('light' as const)
      },
      grid: {
        borderColor: borderColor,
        strokeDashArray: 3
      },
      tooltip: {
        theme: isDark.value ? ('dark' as const) : ('light' as const)
      },
      xaxis: {
        labels: { style: { colors: textColor, fontSize: '11px' } },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: {
        labels: { style: { colors: textColor, fontSize: '11px' } }
      }
    };
  });

  return {
    isDark,
    resolveToken,
    chartBase
  };
}
```

#### Application in `DashboardView.vue` and `PartnerOverviewView.vue`:
1. Convert all 12 static chart options objects (`sparklineBlueOptions`, `channelBarApexOptions`, etc.) into `computed(() => ({ ... }))`.
2. Spread `chartBase.value` into each chart's options:
   ```typescript
   const channelBarApexOptions = computed(() => ({
     ...chartBase.value,
     chart: { ...chartBase.value.chart, type: 'bar' },
     colors: [resolveToken('--primary'), resolveToken('--info')],
     plotOptions: { bar: { horizontal: false, columnWidth: '50%', borderRadius: 3 } },
     // ...
   }));
   ```
3. Update `<apexchart>` in template with a key:
   ```html
   <apexchart :key="isDark ? 'dark' : 'light'" type="area" height="200" :options="revenueApexOptions" :series="revenueApexSeries" />
   ```

---

### 4.2 Exact Updates Required for `DESIGN.md`
A pull request / replacement plan for `DESIGN.md` must implement:
1. **Section 1**: Replace `Unovis/Recharts` with `ApexCharts, Unovis`.
2. **Section 2**: Replace the hex table with semantic token mappings:
   - Outer Rail: `--rail` (`#111827`), `--rail-foreground` (`#F8FAFC`), `--rail-muted-foreground` (`#94A3B8`), `--rail-active` (`#1F2937`).
   - Semantic Status: `--success`, `--warning`, `--info`, `--destructive`.
   - Categorical Tags: `--tag-1` through `--tag-6` with light/dark bg+fg pairs.
   - Add Token Mandate: "Never use raw palette grays, hex classes, or dark: overrides."
3. **Section 3**: Replace all `text-gray-900 dark:text-foreground` and `text-gray-600 dark:text-muted-foreground` with standard tokens (`text-foreground`, `text-muted-foreground`).
4. **Section 4**: Replace `Dark bg-gray-900`, `Light w-60 bg-white dark:bg-card`, `bg-gray-50 dark:bg-background` with semantic tokens (`bg-rail`, `bg-sidebar`, `bg-background`).
5. **Section 6**: Replace all raw kanban colors, raw status badges, and WhatsApp simulator raw hex (`#23B750`, `#EF4444`, `#FEF9C3`) with semantic status and brand tokens.
6. **Section 7**: Rewrite New Page Checklist to forbid raw colors and mandate dynamic CSS variable chart rendering.

---

### 4.3 Automated Audit Script Specification (`scripts/audit-tokens.ts`)
Create `scripts/audit-tokens.ts` (executable via `npx tsx scripts/audit-tokens.ts` or `cmd.exe /c "npm run audit"`):

```typescript
import fs from 'fs';
import path from 'path';

interface Violation {
  file: string;
  line: number;
  rule: string;
  match: string;
  snippet: string;
}

const RULES: Record<string, RegExp> = {
  paletteGrays: /\b(?:bg|text|border|ring|divide|fill|stroke|outline)-(?:gray|slate|zinc|neutral|stone)-(?:50|100|200|300|400|500|600|700|800|900|950)\b|\b(?:bg|text|border|ring|divide|fill|stroke|outline)-(?:white|black)\b/g,
  hexRgbClasses: /\b(?:bg|text|border|ring|divide|fill|stroke|outline|from|to|via)-\[(?:#[0-9a-fA-F]{3,8}|rgba?\([^\]]+\))\]/g,
  rawStatusColors: /\b(?:bg|text|border|ring|divide|fill|stroke)-(?:red|green|emerald|blue|sky|indigo|purple|violet|amber|yellow|orange|rose)-(?:50|100|200|300|400|500|600|700|800|900|950)\b/g,
  darkOverrides: /\bdark:(?:bg|text|border|ring|fill|stroke|divide|from|to|via)-[a-zA-Z0-9_\-\[\]#:\/]+/g,
  inlineHexStyles: /(?:style|:style)\s*=\s*["'][^"']*(?:#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))[^"']*["']/g
};

// Ignore filters
const EXCLUDED_FILES = [
  'src/assets/index.css',
  'src/assets/tw-animate-css.css'
];

export function runAudit(targetBatch?: number, specificFiles?: string[]) {
  // Scans files, flags violations, outputs formatted summary table
  // Returns { violations: Violation[], totalCount: number }
  // Exits with process.exit(totalCount > 0 ? 1 : 0)
}
```

**Key Features**:
- Scans `.vue`, `.ts`, `.tsx`, `.css` in `src/`.
- Supports CLI flags: `--batch <1..9>`, `--file <path>`, `--json`, `--fix` (invokes codemod).
- Ignores lines containing `/* audit-ignore */` or `<!-- audit-ignore -->`.
- Returns exit code `0` on 0 violations, `1` if violations are found.

---

### 4.4 Tokenization Codemod Tooling Specification (`scripts/codemod-tokens.ts`)
Create `scripts/codemod-tokens.ts` for safe, automated batch migrations:

**Safe Replacement Pipeline**:
1. **Pass 1 — Dark Override Merging (Highest Confidence)**:
   - `bg-white dark:bg-gray-900` -> `bg-card`
   - `bg-gray-50 dark:bg-gray-900` -> `bg-background`
   - `bg-gray-100 dark:bg-gray-800` -> `bg-muted`
   - `text-gray-900 dark:text-foreground` -> `text-foreground`
   - `text-gray-900 dark:text-white` -> `text-foreground`
   - `text-gray-600 dark:text-gray-400` -> `text-muted-foreground`
   - `border-gray-200 dark:border-gray-800` -> `border-border`
   - `border-gray-100 dark:border-gray-800` -> `border-border`
2. **Pass 2 — Semantic Status Badge Combinations**:
   - `bg-emerald-50 text-emerald-600 border-emerald-200` -> `bg-success/10 text-success border-success/20`
   - `bg-amber-50 text-amber-600 border-amber-200` -> `bg-warning/10 text-warning border-warning/20`
   - `bg-blue-50 text-blue-600 border-blue-200` -> `bg-info/10 text-info border-info/20`
   - `bg-red-50 text-red-600 border-red-200` -> `bg-destructive/10 text-destructive border-destructive/20`
3. **Pass 3 — Individual Tokens**:
   - `text-gray-900`, `text-slate-900` -> `text-foreground`
   - `text-gray-500`, `text-gray-600`, `text-slate-500` -> `text-muted-foreground`
   - `border-gray-200`, `border-slate-200` -> `border-border`
   - `bg-[#23B750]`, `text-[#23B750]` -> `bg-primary`, `text-primary`
   - `hover:bg-[#1a943e]` -> `hover:bg-primary/90`
   - `bg-[#EF4444]`, `text-[#EF4444]` -> `bg-destructive`, `text-destructive`
4. **Safety Controls**:
   - `--dry-run`: prints diff to stdout without writing files.
   - Batch scoping: `--batch 1` through `--batch 9`.
   - Automatic execution of `cmd.exe /c "npm run build"` post-transformation to verify build integrity.

---

## 5. Verification Method

To independently verify the observations and conclusions in this report:

1. **Verify Chart Inventory**:
   Run in PowerShell:
   ```powershell
   Get-ChildItem -Path "src" -Recurse -Include "*.vue","*.ts" | Select-String "<apexchart"
   ```
   *Expected Result*: 18 matches in `DashboardView.vue` and 2 matches in `PartnerOverviewView.vue`.

2. **Verify Static Chart Options in DashboardView.vue**:
   Inspect lines 1642–1701 and 1878–2210 of `src/views/DashboardView.vue` to confirm static objects (`sparklineBlueOptions`, `slaRadialOptions`, etc.) and hardcoded hex values (`#23B750`, `#e2e8f0`, `#94a3b8`).

3. **Verify Documentation Discrepancies**:
   Inspect `DESIGN.md` lines 21–38, 46–55, 75–78, 102–121, and 143. Compare with `AGENTS.md` lines 12–22.

4. **Verify Total Violation Baseline**:
   Run:
   ```powershell
   node scratch/survey_scanner.cjs
   ```
   *Expected Result*: Confirms 21,067 total violations across 417 files.

5. **Verify Build Command**:
   Run:
   ```powershell
   cmd.exe /c "npm run build"
   ```
   *Expected Result*: Build completes with exit code 0 (`vue-tsc -b && vite build` succeeds).

### Invalidation Conditions
This report is invalidated if:
- Other charting engines (e.g. Chart.js, ECharts, or custom D3) are added.
- ApexCharts is replaced with a CSS-first charting library.
- `AGENTS.md` rules are relaxed to permit raw colors or `dark:` overrides.
