# Handoff Report: Milestone 6 (Requirement R3) ApexCharts & Unovis Dynamic Theming

**From:** `explorer_m6_1` (Teamwork Explorer Agent)  
**To:** `orchestrator_1` / Implementer Agent  
**Date:** 2026-11-01  
**Working Directory:** `.agents/teamwork/explorer_m6_1`  
**Handoff Type:** Hard (Investigation complete, actionable architecture and blueprints ready)

---

## 1. Observation

1. **Dashboard Charts Inventory (`src/views/DashboardView.vue`)**:
   - Exactly 18 `<apexchart>` component invocations exist across 4 tabs:
     - Overview Tab: Line 266 (`sparklineBlueOptions`), Line 288 (`sparklinePurpleOptions`), Line 310 (`sparklineOrangeOptions`), Line 344 (`slaRadialOptions`), Line 376 (`winRateTrendOptions`), Line 423 (`revenueApexOptions`), Line 470 (`funnelApexOptions`), Line 532 (`channelDonutOptions`).
     - Pipeline Tab: Line 651 (`velocityApexOptions`), Line 687 (`lostReasonDonutOptions`).
     - Marketing Tab: Line 912 (`attributionApexOptions`), Line 938 (`channelBarApexOptions`), Line 973 (`sessionsDualApexOptions`), Line 985 (`qualityStackedApexOptions`).
     - Support Tab: Line 1149 (`supportConversationsSparklineOptions`), Line 1172 (`supportResolvedSparklineOptions`), Line 1194 (`supportAvgResponseSparklineOptions`), Line 1336 (`supportChannelDonutOptions`).
   - 11 of the 18 options are defined as static non-reactive JavaScript objects (`const`):
     - Lines 1642 (`sparklineBlueOptions`), 1653 (`sparklinePurpleOptions`), 1664 (`sparklineOrangeOptions`), 1676 (`slaRadialOptions`), 1696 (`winRateTrendOptions`), 1878 (`velocityApexOptions`), 2076 (`channelBarApexOptions`), 2103 (`sessionsDualApexOptions`), 2132 (`qualityStackedApexOptions`), 2180 (`supportConversationsSparklineOptions`), 2190 (`supportResolvedSparklineOptions`), 2200 (`supportAvgResponseSparklineOptions`).
   - The remaining 7 chart options are `computed(() => ({...}))` but have hardcoded hex values (`#23B750`, `#94a3b8`, `#e2e8f0`) with zero reactive references to `isDark`.

2. **Partner Overview Charts Inventory (`src/views/partner/PartnerOverviewView.vue`)**:
   - Line 317: `<apexchart type="donut" width="78" height="78" :options="salesApexDonutOptions" :series="salesApexDonutSeries" />`
   - Line 487: `<apexchart type="donut" width="78" height="78" :options="pipelineApexDonutOptions" :series="pipelineApexDonutSeries" />`
   - Line 1616: `const salesApexDonutOptions = computed(() => ({ ... colors: isPreviewEmpty.value ? ['#E5E7EB'] : ['#F59E0B', '#8B5CF6', '#F43F5E', '#23B750'], tooltip: { theme: 'dark' } }))`
   - Line 1659: `const pipelineApexDonutOptions = computed(() => ({ ... colors: isPreviewEmpty.value ? ['#E5E7EB'] : ['#F59E0B', '#F43F5E', '#23B750'], tooltip: { theme: 'dark' } }))`
   - Both lack `chart: { background: 'transparent' }` and hardcode tooltip `theme: 'dark'`.

3. **SVG Spline Chart in `src/views/DesignSystemView.vue`**:
   - Lines 2444–2508: Custom SVG revenue chart with hardcoded inline hex colors:
     - Line 2448–2450: `<line stroke="rgba(255,255,255,0.05)" ... />`
     - Line 2454–2457: `<stop stop-color="rgba(35, 183, 80, 0.35)" />`
     - Line 2469: `<path stroke="#23B750" ... />`
     - Line 2476: `<line stroke="rgba(34, 197, 94, 0.35)" ... />`
     - Line 2485: `:fill="idx === chartData.length - 1 ? '#62D816' : '#23B750'"`
     - Line 2486: `stroke="#0f172a"`
     - Line 2493: `fill="#22c55e" stroke="#ffffff"`

4. **Unovis Components in `src/components/ui/chart/`**:
   - `index.ts:6`: `defaultColors(count)` maps colors to `var(--chart-1)` through `var(--chart-5)`.
   - `ChartSingleTooltip.vue:45`: Uses `getComputedStyle(elements[i])` for data point fill color.
   - `ChartCrosshair.vue`, `ChartLegend.vue`, and `ChartTooltip.vue` rely on Unovis standard styles.

5. **ApexCharts Core Engine Source Inspection (`node_modules/apexcharts/dist/apexcharts.esm.js`)**:
   - Line 956–959:
     ```javascript
     static hexToRgba(hex = "#999999", opacity = 0.6) {
       if (hex.substring(0, 1) !== "#") {
         hex = "#999999";
       }
     ```
   - Line 1026–1031: `rgb2hex` parses `rgba?(\d+),(\d+),(\d+)`.
   - Line 1054–1060: `shadeColor` calls `shadeHexColor` if hex, else calls `shadeRGBColor` (which executes `parseInt(f[0].slice(4))` on an `rgb(...)` string).
   - Verbatim finding: If an `oklch(...)` or `var(--token)` string is passed to ApexCharts, `hexToRgba` replaces the color with `#999999` (fallback gray), and `shadeColor` produces `NaN`.

6. **Canvas Confetti Inspection**:
   - `src/views/OnboardingView.vue:311–335` and `src/views/SetupWizardView.vue:418–442`: Both implement `getConfettiColors()`, creating an offscreen element and converting CSS tokens (`--primary`, `--brand-secondary`, `--success`, `--info`, `--warning`) to hex colors.

7. **Project Baseline Health**:
   - `node scripts/audit-tokens.cjs`: 0 violations across 444 scanned files.
   - `cmd /c "npm run build"`: Built successfully in 4.32 seconds with 0 TypeScript errors.

---

## 2. Logic Chain

1. **Reactivity Gap**: Because 11 chart options in `DashboardView.vue` are static objects (Observation 1), and the other 7 chart options do not depend on any reactive theme variable (Observation 1), calling `toggleTheme()` in `useTheme.ts` does not invalidate any chart options. Therefore, the charts remain unchanged across theme toggles.
2. **ApexCharts Incompatibility with Raw Tokens**: Because ApexCharts parses colors using string matching (`#` prefix and `rgb(`) in `hexToRgba` and `shadeColor` (Observation 5), passing `var(--primary)` or `oklch(...)` directly into ApexCharts options fails and forces colors to `#999999` gray.
3. **Required Resolution Mechanism**: To resolve tokens without breaking ApexCharts, `resolveToken` in `useChartTheme.ts` must query the computed property from the DOM (`getComputedStyle`) and mathematically convert OKLCH to sRGB hex (`#RRGGBB`).
4. **Reactive Unification**: By defining `useChartTheme.ts` with a reactive `chartBase` computed property that references `isDark` (from `useTheme.ts`), wrapping all 18 dashboard charts and 2 partner charts in `computed(() => ({ ... }))`, and spreading `chartBase.value` into each option object, any theme switch automatically recalculates the options.
5. **Seamless Repainting**: Because `vue3-apexcharts` has a deep watcher on `:options` that triggers `chart.updateOptions()`, updating the computed options seamlessly repaints all charts with theme-aware borders, backgrounds, tooltips, and series colors.
6. **SVG & Documentation Consistency**: Refactoring the SVG chart in `DesignSystemView.vue` to use semantic token classes (Observation 3) and updating `DESIGN.md` eliminates all remaining raw hex/gray remnants in accordance with `AGENTS.md`.

---

## 3. Caveats

- **DOM Availability**: `getComputedStyle` is only available in a browser environment. In SSR or test runners without a DOM, `resolveToken` must fallback to the static token table (`FALLBACKS_LIGHT` / `FALLBACKS_DARK`).
- **Animations on Theme Toggle**: ApexCharts provides animations on `updateOptions`. Rapid theme toggling should not cause performance degradation because `useChartTheme` computes colors synchronously without re-rendering the whole Vue SFC.
- **Scope Limit**: As an explorer agent, I have performed read-only analysis and have not modified codebase source files. Implementation will be handled by the designated implementer.

---

## 4. Conclusion

The technical strategy for Milestone 6 (Requirement R3) is fully scoped, mathematically validated, and ready for immediate implementation:
1. Create `src/composables/useChartTheme.ts` implementing `UseChartThemeReturn` with OKLCH-to-sRGB resolution, reactive `chartBase`, and semantic `colors` getters.
2. Refactor `src/views/DashboardView.vue`: convert all 11 static options to `computed()`, spread `chartBase.value`, and replace all hardcoded hex values with `colors.value.<token>`.
3. Refactor `src/views/partner/PartnerOverviewView.vue`: update `salesApexDonutOptions` and `pipelineApexDonutOptions` to use `chartBase` and `colors`.
4. Refactor `src/views/DesignSystemView.vue`: replace inline hex SVG attributes with `var(--primary)`, `var(--brand-secondary)`, and `stroke-border`.
5. Align `DESIGN.md` and `src/data/designSystemGuidelines.ts` with `AGENTS.md` rules.

---

## 5. Verification Method

To independently verify after implementation:

1. **Token Audit**:
   ```powershell
   node scripts/audit-tokens.cjs
   ```
   *Expected result*: 0 violations detected across all files.

2. **TypeScript & Production Build**:
   ```powershell
   cmd /c "npm run build"
   ```
   *Expected result*: Command exits with code 0 with zero TypeScript or Vite errors.

3. **Visual & Reactivity Inspection**:
   - Run `cmd /c "npm run dev"`.
   - Open browser to `http://localhost:5173/` (Dashboard).
   - Verify all 18 charts render properly in light mode with transparent backgrounds, subtle gray gridlines, and clear data labels.
   - Click the theme toggle icon in TopNav to activate dark mode.
   - Verify all 18 charts dynamically adapt: gridlines shift to dark borders, axis labels to light muted foreground, tooltips to dark cards, and series colors retain vibrant contrast.
   - Navigate to `/partner` (Partner Overview) and verify both sales and pipeline donut charts adapt seamlessly.
   - Navigate to `/design-system` and verify the SVG revenue chart renders crisp primary/lime gradients in both modes.

*Invalidation conditions*: Any build error, any audit violation, chart falling back to `#999999` gray, or chart failing to react when clicking the theme toggle.
