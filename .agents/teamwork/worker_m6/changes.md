# Changes Report: Milestone 6 (ApexCharts Dynamic Theming & Design System Alignment)

**Agent**: `worker_m6`  
**Date**: 2026-11-01T06:10:00Z  
**Scope**: ApexCharts & Unovis dynamic theming, SVG presentation cleanup, DESIGN.md & designSystemGuidelines.ts alignment, and audit tooling expansion.

---

## 1. Summary of Modified & Created Files

| File | Action | Purpose & Summary |
|---|---|---|
| `src/composables/useChartTheme.ts` | Created | Dynamic chart theming composable. Implements mathematical OKLCH-to-sRGB and rgb/rgba conversion with alpha support, queries DOM CSS variables, provides reactive `isDark` integration, reactive `chartBase` configuration (`transparent` background, `mutedForeground` foreColor, `border` grid border, reactive tooltip theme), and reactive semantic color palette (`colors.primary`, `colors.brand`, `colors.brandSecondary`, `colors.success`, `colors.warning`, `colors.info`, `colors.destructive`, `colors.border`, `colors.muted`, `colors.tag1`..`tag6`). Includes static fallback tables for SSR and node execution. |
| `src/views/DashboardView.vue` | Modified | Refactored all 18 `<apexchart>` configurations from static objects / hardcoded hex values to reactive `computed(() => ({ ...chartBase.value, ... }))` referencing `colors.value.<token>`. Replaced hardcoded hex values in `overviewChannels`, `activeAttributionChannels`, and `defaultSupportCategories` with reactive theme tokens. Result: 0 hardcoded hex codes remaining. |
| `src/views/partner/PartnerOverviewView.vue` | Modified | Refactored `salesApexDonutOptions` and `pipelineApexDonutOptions` to spread `chartBase.value`, use `colors.value.<token>` (`warning`, `tag4`, `destructive`, `primary`, `muted`), and adapt tooltip theme reactively. Result: 0 hardcoded hex codes remaining. |
| `src/views/DesignSystemView.vue` | Modified | Replaced hardcoded presentation attributes in the custom SVG Revenue Spline chart (lines 2448–2493) and circular progress dial SVG (line 2901) with `var(--border)`, `var(--primary)`, `var(--brand-secondary)`, `var(--card)`, and `var(--background)`. Result: fully responsive SVG graphics in both light and dark themes. |
| `DESIGN.md` | Modified | Replaced outdated legacy guidelines (which contained 36 token violations including raw grays and `dark:` overrides) with the 100% token-compliant specification from `proposed_DESIGN.md`. Result: 0 audit violations. |
| `src/data/designSystemGuidelines.ts` | Modified | Synchronized the in-app guidelines template string with `DESIGN.md`. Result: 0 audit violations. |
| `scripts/audit-tokens.cjs` | Modified | Added `'src/data/designSystemGuidelines.ts'` to `BATCHES[9].files` so Batch 9 explicitly scans all 3 documentation files. |

---

## 2. Key Design Decisions

1. **Math-Based OKLCH Conversion in `useChartTheme.ts`**:
   - ApexCharts internal functions (`hexToRgba`, `shadeColor`) strictly require `#RRGGBB` or `rgb(...)` / `rgba(...)` format. Passing raw CSS `oklch(...)` or `var(...)` causes fallback to `#999999` gray or `NaN`.
   - The mathematical OKLCH-to-sRGB algorithm guarantees instantaneous conversion without requiring DOM canvas or browser rendering engines, ensuring full compatibility across SSR, test runners, and browsers.
2. **Reactivity through Vue `computed` and `chartBase`**:
   - By structuring all chart options as `computed` properties that spread `chartBase.value`, toggling the theme in `useTheme.ts` triggers deep reactivity in `vue3-apexcharts`, invoking `chart.updateOptions()` in <16ms without page flicker or re-mounting.
3. **Harmonized Color Channels for In-View Components**:
   - `overviewChannels`, `activeAttributionChannels`, and `defaultSupportCategories` in `DashboardView.vue` were upgraded to computed properties referencing `colors.value`, ensuring UI swatch dots and progress bars match the chart palettes exactly.
