# Comprehensive Analysis: ApexCharts & Unovis Chart Dynamic Theming (Milestone 6 / Requirement R3)

**Author:** `explorer_m6_1` (Teamwork Explorer Agent)  
**Date:** 2026-11-01  
**Working Directory:** `.agents/teamwork/explorer_m6_1`  
**Status:** Complete Investigation (Read-Only)

---

## 1. Executive Summary

Milestone 6 (Requirement R3) mandates updating ApexCharts and Unovis charts across RakanSales to dynamically adapt between light and dark themes by resolving colors from CSS variables (e.g. via `getComputedStyle`).

This investigation revealed three critical discoveries:
1. **Critical Engine Constraint (ApexCharts Color Parser)**: ApexCharts' internal color manipulation utilities (`Utils.hexToRgba`, `shadeColor`, `getContrastRatio` in `apexcharts.esm.js:956–1060`) strictly require `#hex` or `rgb(...)` / `rgba(...)` strings. They do **not** support CSS `oklch(...)` or `var(...)` strings. Passing `var(--primary)` or raw `oklch` directly into ApexCharts options causes `hexToRgba` to fallback to `#999999` (gray), produces `NaN` in shading calculations, and breaks gradient stops. Therefore, `useChartTheme.ts` must resolve CSS tokens to `#RRGGBB` hex or `rgba(...)` format.
2. **Dashboard Reactivity Gap**: In `src/views/DashboardView.vue`, **11 out of 18 charts** are declared as static plain JavaScript objects (`const options = { ... }`), rather than reactive Vue `computed()` properties. The remaining 7 charts are computed but have hardcoded hex colors and no reactive dependency on `isDark`. Consequently, toggling the theme currently triggers zero updates on any chart in `DashboardView.vue`.
3. **Custom SVG Chart in `DesignSystemView.vue`**: Lines 2444–2508 contain an interactive SVG Spline Revenue Trending Chart with hardcoded inline hex colors (`#23B750`, `#62D816`, `#22c55e`, `#0f172a`, `rgba(255,255,255,0.05)`). This chart must be refactored to use semantic token classes or resolved dynamic colors.

---

## 2. Codebase Inventory of Charts

### 2.1 `src/views/DashboardView.vue` (18 ApexCharts)

Every chart in `DashboardView.vue` is cataloged below with its current variable type, hardcoded colors, axis/grid properties, and tooltip configuration:

| # | Chart Name | Type | Current Declaration | Current Series Colors | Labels / Grid / Track Colors | Tooltip Theme | Series Binding |
|---|---|---|---|---|---|---|---|
| 1 | `sparklineBlueOptions` | area | `const` (plain object) | `['#2E91E5']` (info blue) | None (sparkline) | `{ fixed: { enabled: false }, x: { show: false } }` (missing theme) | `sparklinePipelineSeries` |
| 2 | `sparklinePurpleOptions` | area | `const` (plain object) | `['#7C3AED']` (tag-4 purple) | None (sparkline) | `{ fixed: { enabled: false }, x: { show: false } }` | `sparklineConvSeries` |
| 3 | `sparklineOrangeOptions` | area | `const` (plain object) | `['#F97316']` (warning orange) | None (sparkline) | `{ fixed: { enabled: false }, x: { show: false } }` | `sparklineRespSeries` |
| 4 | `slaRadialOptions` | radialBar | `const` (plain object) | `['#23B750']` (brand green) | `track.background: '#e5e7eb'` (raw gray) | None | `[hasSampleData ? 92 : 0]` |
| 5 | `winRateTrendOptions` | area | `const` (plain object) | `['#23B750']` (brand green) | None (sparkline) | None | `winRateTrendSeries` |
| 6 | `revenueApexOptions` | area | `computed(() => ({...}))` | `['#23B750']`, gradient: `#23B750` to `#62D816` | `xaxis.labels: '#94a3b8'`, `yaxis.labels: '#94a3b8'`, `grid: '#e2e8f0'` | `theme: 'dark'` (hardcoded) | `revenueApexSeries` |
| 7 | `funnelApexOptions` | bar (horiz) | `computed(() => ({...}))` | `['#23B750']` | `yaxis.labels: '#64748b'` | `theme: 'dark'` (hardcoded) | `funnelApexSeries` |
| 8 | `channelDonutOptions` | donut | `computed(() => ({...}))` | `['#2E91E5', '#7C3AED']` | Donut total label | `theme: 'dark'` (hardcoded) | `channelDonutSeries` |
| 9 | `velocityApexOptions` | bar (horiz) | `const` (plain object) | Ranges: `#F97316` (8–15), `#23B750` (0–7.9) | `yaxis.labels: '#64748b'` | `theme: 'dark'` (hardcoded) | `velocityApexSeries` |
| 10 | `lostReasonDonutOptions` | donut | `computed(() => ({...}))` | `['#2E91E5', '#F97316', '#EF4444', '#23B750']` | Donut total label | `theme: 'dark'` (hardcoded) | `lostReasonDonutSeries` |
| 11 | `attributionApexOptions` | donut | `computed(() => ({...}))` | Dynamic from `activeAttributionChannels`: `#23B750`, `#62D816`, `#7C3AED`, `#F97316` | Donut total label | `theme: 'dark'` (hardcoded) | `attributionApexSeries` |
| 12 | `channelBarApexOptions` | bar (grouped) | `const` (plain object) | `['#23B750', '#2E91E5']` | `xaxis.labels: '#64748b'`, `yaxis.labels: '#94a3b8'`, `legend: '#64748b'`, `grid: '#e2e8f0'` | `theme: 'dark'` (hardcoded) | `channelBarApexSeries` |
| 13 | `sessionsDualApexOptions` | line (dual-axis) | `const` (plain object) | `['#2E91E5', '#23B750']` | `xaxis: '#94a3b8'`, `yaxis[0]: '#2E91E5'`, `yaxis[1]: '#23B750'`, `grid: '#e2e8f0'` | `theme: 'dark'` (hardcoded) | `sessionsDualApexSeries` |
| 14 | `qualityStackedApexOptions` | bar (100% stacked) | `const` (plain object) | `['#23B750', '#cbd5e1']` (`#cbd5e1` raw slate!) | `xaxis: '#94a3b8'`, `yaxis: '#64748b'`, `legend: '#64748b'` | `theme: 'dark'` (hardcoded) | `qualityStackedApexSeries` |
| 15 | `supportConversationsSparklineOptions` | line | `const` (plain object) | `['#2E91E5']` | None (sparkline) | `{ fixed: { enabled: false }, x: { show: false } }` | `supportConversationsSparklineSeries` |
| 16 | `supportResolvedSparklineOptions` | line | `const` (plain object) | `['#7C3AED']` | None (sparkline) | `{ fixed: { enabled: false }, x: { show: false } }` | `supportResolvedSparklineSeries` |
| 17 | `supportAvgResponseSparklineOptions` | line | `const` (plain object) | `['#F97316']` | None (sparkline) | `{ fixed: { enabled: false }, x: { show: false } }` | `supportAvgResponseSparklineSeries` |
| 18 | `supportChannelDonutOptions` | donut | `computed(() => ({...}))` | `['#2E91E5', '#EF4444']` | Donut total label | `theme: 'dark'` (hardcoded) | `supportChannelDonutSeries` |

### 2.2 `src/views/partner/PartnerOverviewView.vue` (2 ApexCharts)

| # | Chart Name | Type | Current Declaration | Current Series Colors | Tooltip Theme | Observations |
|---|---|---|---|---|---|---|
| 1 | `salesApexDonutOptions` (line 1616) | donut | `computed(() => ({...}))` | Empty: `['#E5E7EB']`, Active: `['#F59E0B', '#8B5CF6', '#F43F5E', '#23B750']` | `theme: 'dark'` (hardcoded) | Lacks `chart.background: 'transparent'`; hardcoded empty state gray |
| 2 | `pipelineApexDonutOptions` (line 1659) | donut | `computed(() => ({...}))` | Empty: `['#E5E7EB']`, Active: `['#F59E0B', '#F43F5E', '#23B750']` | `theme: 'dark'` (hardcoded) | Lacks `chart.background: 'transparent'`; hardcoded empty state gray |

### 2.3 `src/views/DesignSystemView.vue` (Interactive SVG Chart)

Lines 2444–2508 contain a custom SVG CRM Revenue Trending Chart with manual bezier curve rendering:
- Grid lines: `stroke="rgba(255,255,255,0.05)"`
- Area gradient stops: `<stop stop-color="rgba(35, 183, 80, 0.35)" />` and `<stop stop-color="rgba(35, 183, 80, 0)" />`
- Spline path: `stroke="#23B750"`
- Vertical tracking line: `stroke="rgba(34, 197, 94, 0.35)"`
- Node circles: `fill="#62D816"` / `fill="#23B750"`, `stroke="#0f172a"`
- Hover ring: `fill="rgba(34, 197, 94, 0.25)"`, `fill="#22c55e" stroke="#ffffff"`

### 2.4 `src/components/ui/chart/` (Unovis Components)

- `ChartCrosshair.vue`: Renders `<VisCrosshair>` and `<VisTooltip>`, maps items with colors.
- `ChartLegend.vue`: Renders `<VisBulletLegend>`, sets `--vis-legend-bullet-size: 16px`.
- `ChartSingleTooltip.vue`: Queries `getComputedStyle(elements[i])` for point `fill` color and mounts `ChartTooltip`.
- `ChartTooltip.vue`: Renders card with colored bullet SVGs.
- `index.ts`: Exports `defaultColors(count)` mapping to `var(--chart-1)` through `var(--chart-5)`.

### 2.5 Confetti Particles (`OnboardingView.vue` & `SetupWizardView.vue`)

Both `OnboardingView.vue` (lines 311–335) and `SetupWizardView.vue` (lines 418–442) implement `getConfettiColors()`:
```typescript
const tokens = ['--primary', '--brand-secondary', '--success', '--info', '--warning'];
```
They create an offscreen `div`, set `temp.style.color = var(--token)`, and parse RGB into hex. `useChartTheme.ts` can export a shared utility or these can remain self-contained.

---

## 3. Core Technical Discoveries & Engine Constraints

### 3.1 ApexCharts Color Parser Analysis

In `node_modules/apexcharts/dist/apexcharts.esm.js`:
```javascript
// Line 956
static hexToRgba(hex = "#999999", opacity = 0.6) {
  if (hex.substring(0, 1) !== "#") {
    hex = "#999999"; // <--- FALLBACK TO GRAY!
  }
  const hexStr = hex.replace("#", "");
  ...
}

// Line 1026
static rgb2hex(rgb) {
  rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
  ...
}

// Line 1054
shadeColor(p2, color) {
  if (Utils.isColorHex(color)) {
    return this.shadeHexColor(p2, color);
  } else {
    return this.shadeRGBColor(p2, color); // expects rgb(...) format
  }
}
```

**Implication**:
- If `colors: ['var(--primary)']` or `colors: ['oklch(0.527 0.154 150.069)']` is passed to ApexCharts, `hexToRgba` sees that `hex.substring(0,1) !== '#'`, replacing the color with `#999999` (dull gray).
- In gradient fills (`revenueApexOptions`), color stops fail because `hexToRgba` cannot interpolate OKLCH.
- Therefore, `resolveToken` in `useChartTheme.ts` **must return standard sRGB `#RRGGBB` or `rgba(...)` strings**.

### 3.2 Reactivity Mechanism with `useTheme.ts`

`src/composables/useTheme.ts` provides:
- `isDark: ComputedRef<boolean>`
- `mode: Ref<'light' | 'dark' | 'system'>`
- `setMode(mode)` / `toggleTheme()`

When `toggleTheme()` is called:
1. `isDark.value` changes.
2. `vue3-apexcharts` component monitors `:options` with a deep watcher:
   ```javascript
   watch(() => props.options, () => chart.updateOptions(props.options), { deep: true })
   ```
3. When `options` is a `computed(() => ({ ... }))` that references `isDark.value` (or `chartBase.value`), Vue invalidates the computed cache, creates a fresh options object, and passes it to `vue3-apexcharts`.
4. ApexCharts automatically calls `updateOptions()` and seamlessly repaints the chart in under 16ms without page flicker or full component remounting.

---

## 4. Architectural Design for `src/composables/useChartTheme.ts`

### 4.1 Interface Contract (from `PROJECT.md`)

```typescript
export interface UseChartThemeReturn {
  isDark: ComputedRef<boolean>;
  resolveToken: (cssVarName: string, fallback?: string) => string;
  chartBase: ComputedRef<{
    chart: { background: string; foreColor: string; fontFamily: string; toolbar: { show: boolean } };
    theme: { mode: 'light' | 'dark' };
    grid: { borderColor: string; strokeDashArray: number };
    tooltip: { theme: 'light' | 'dark' };
    xaxis: { labels: { style: { colors: string } } };
    yaxis: { labels: { style: { colors: string } } };
  }>;
  colors: ComputedRef<Record<string, string>>;
}
```

### 4.2 Multi-Tier Dynamic Token Resolver (`resolveToken`)

To reliably convert OKLCH and CSS tokens into ApexCharts-compatible hex/rgb in all environments (browser, SSR, jsdom):

```
Token Name ('--primary') 
       │
       ▼
Is window / DOM available?
       ├── NO ──► Lookup from Static Token Map (Light/Dark fallback)
       └── YES
            │
            ▼
Query computed style: getComputedStyle(document.documentElement).getPropertyValue(token)
            │
            ├── Format: #hex ─────────────► Return #hex directly
            ├── Format: rgb/rgba ─────────► Return rgb/rgba (or hex)
            ├── Format: oklch(L C H ...) ──► Convert OKLCH to sRGB Hex (via Canvas 2D or Math)
            └── Empty / Unresolved ───────► Fallback to Static Token Map
```

#### Precise OKLCH to sRGB Math Algorithm
```typescript
function oklchToHex(l: number, c: number, h: number): string {
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.2914855480 * b;
  const l3 = l_ * l_ * l_;
  const m3 = m_ * m_ * m_;
  const s3 = s_ * s_ * s_;
  const rLin = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  const gLin = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  const bLin = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3;
  const tf = (val: number) => val <= 0.0031308 ? 12.92 * val : 1.055 * Math.pow(Math.max(0, val), 1 / 2.4) - 0.055;
  const r = Math.min(255, Math.max(0, Math.round(tf(rLin) * 255)));
  const g = Math.min(255, Math.max(0, Math.round(tf(gLin) * 255)));
  const bVal = Math.min(255, Math.max(0, Math.round(tf(bLin) * 255)));
  return '#' + [r, g, bVal].map(x => x.toString(16).padStart(2, '0')).join('');
}
```

Verification test on `--primary: oklch(0.527 0.154 150.069)` yields `#008236` (exact match to `DESIGN.md`).

### 4.3 Static Token Fallback Table

For fast resolution and SSR fallback:

| Token | Light Mode Hex | Dark Mode Hex | Usage in Charts |
|---|---|---|---|
| `--primary` | `#008236` | `#23B750` | Revenue line, won deals, SLA radial, win rate |
| `--brand-secondary` | `#62D816` | `#62D816` | Gradient stops, active hover anchors |
| `--info` | `#2E91E5` | `#2E91E5` | Lead sparklines, WhatsApp channels, sessions |
| `--warning` | `#F59E0B` | `#F59E0B` | Response time sparklines, budget lost deals |
| `--destructive` | `#EF4444` | `#EF4444` | Unreachable lost deals, critical support issues |
| `--border` | `#e2e8f0` | `#27272a` (or `rgba(255,255,255,0.1)`) | Chart grid lines (`grid.borderColor`) |
| `--muted` | `#f1f5f9` | `#27272a` | SLA radial track, unqualified stacked bars |
| `--muted-foreground`| `#64748b` | `#94a3b8` | Axis labels (`xaxis`, `yaxis`), legend text |
| `--foreground` | `#0f172a` | `#f8fafc` | Donut center total labels, dataLabels |
| `--tag-1` | `#2E91E5` | `#38bdf8` | Stage 1 (Contacted) |
| `--tag-2` | `#22c55e` | `#4ade80` | Stage 2 (Technical Qual) |
| `--tag-3` | `#f59e0b` | `#fbbf24` | Stage 3 (Proposal / Quote) |
| `--tag-4` | `#7C3AED` | `#a78bfa` | Stage 4 (Negotiation / Sparkline Purple) |
| `--tag-5` | `#f43f5e` | `#fb7185` | Stage 5 (Closed Won / Referral track) |

---

## 5. Detailed Implementation Blueprint

### 5.1 Proposed Code for `src/composables/useChartTheme.ts`

```typescript
import { computed, type ComputedRef } from 'vue';
import { useTheme } from './useTheme';

export interface UseChartThemeReturn {
  isDark: ComputedRef<boolean>;
  resolveToken: (cssVarName: string, fallback?: string) => string;
  chartBase: ComputedRef<{
    chart: { background: string; foreColor: string; fontFamily: string; toolbar: { show: boolean } };
    theme: { mode: 'light' | 'dark' };
    grid: { borderColor: string; strokeDashArray: number };
    tooltip: { theme: 'light' | 'dark' };
    xaxis: { labels: { style: { colors: string } } };
    yaxis: { labels: { style: { colors: string } } };
  }>;
  colors: ComputedRef<{
    primary: string;
    brand: string;
    brandSecondary: string;
    info: string;
    warning: string;
    destructive: string;
    border: string;
    muted: string;
    mutedForeground: string;
    foreground: string;
    background: string;
    card: string;
    tag1: string;
    tag2: string;
    tag3: string;
    tag4: string;
    tag5: string;
    tag6: string;
  }>;
}

// Fallback values when running without DOM or before CSS is parsed
const FALLBACKS_LIGHT: Record<string, string> = {
  '--primary': '#008236',
  '--brand': '#23B750',
  '--brand-secondary': '#62D816',
  '--info': '#2E91E5',
  '--warning': '#F59E0B',
  '--destructive': '#EF4444',
  '--border': '#e2e8f0',
  '--muted': '#f1f5f9',
  '--muted-foreground': '#64748b',
  '--foreground': '#0f172a',
  '--background': '#ffffff',
  '--card': '#ffffff',
  '--tag-1': '#2E91E5',
  '--tag-2': '#22c55e',
  '--tag-3': '#f59e0b',
  '--tag-4': '#7C3AED',
  '--tag-5': '#f43f5e',
  '--tag-6': '#06b6d4',
};

const FALLBACKS_DARK: Record<string, string> = {
  '--primary': '#23B750',
  '--brand': '#23B750',
  '--brand-secondary': '#62D816',
  '--info': '#38bdf8',
  '--warning': '#F59E0B',
  '--destructive': '#EF4444',
  '--border': '#27272a',
  '--muted': '#27272a',
  '--muted-foreground': '#94a3b8',
  '--foreground': '#f8fafc',
  '--background': '#0f172a',
  '--card': '#1e293b',
  '--tag-1': '#38bdf8',
  '--tag-2': '#4ade80',
  '--tag-3': '#fbbf24',
  '--tag-4': '#a78bfa',
  '--tag-5': '#fb7185',
  '--tag-6': '#22d3ee',
};

function oklchToHex(l: number, c: number, h: number): string {
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.2914855480 * b;
  const l3 = l_ * l_ * l_;
  const m3 = m_ * m_ * m_;
  const s3 = s_ * s_ * s_;
  const rLin = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  const gLin = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  const bLin = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3;
  const tf = (val: number) => val <= 0.0031308 ? 12.92 * val : 1.055 * Math.pow(Math.max(0, val), 1 / 2.4) - 0.055;
  const r = Math.min(255, Math.max(0, Math.round(tf(rLin) * 255)));
  const g = Math.min(255, Math.max(0, Math.round(tf(gLin) * 255)));
  const bVal = Math.min(255, Math.max(0, Math.round(tf(bLin) * 255)));
  return '#' + [r, g, bVal].map(x => x.toString(16).padStart(2, '0')).join('');
}

export function useChartTheme(): UseChartThemeReturn {
  const { isDark } = useTheme();

  function resolveToken(cssVarName: string, fallback?: string): string {
    const varName = cssVarName.startsWith('--') ? cssVarName : `--${cssVarName}`;
    const defaultFallback = (isDark.value ? FALLBACKS_DARK[varName] : FALLBACKS_LIGHT[varName]) ?? fallback ?? '#23B750';

    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return defaultFallback;
    }

    try {
      const rawValue = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
      if (!rawValue) return defaultFallback;

      if (rawValue.startsWith('#')) return rawValue;

      if (rawValue.startsWith('oklch(')) {
        const match = rawValue.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)/i);
        if (match) {
          const [, l, c, h] = match.map(Number);
          return oklchToHex(l, c, h);
        }
      }

      if (rawValue.startsWith('rgb')) {
        const digits = rawValue.match(/\d+/g);
        if (digits && digits.length >= 3) {
          const [r, g, b] = digits.map(Number);
          return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
        }
        return rawValue;
      }

      return defaultFallback;
    } catch {
      return defaultFallback;
    }
  }

  const colors = computed(() => ({
    primary: resolveToken('--primary'),
    brand: resolveToken('--brand'),
    brandSecondary: resolveToken('--brand-secondary'),
    info: resolveToken('--info'),
    warning: resolveToken('--warning'),
    destructive: resolveToken('--destructive'),
    border: resolveToken('--border'),
    muted: resolveToken('--muted'),
    mutedForeground: resolveToken('--muted-foreground'),
    foreground: resolveToken('--foreground'),
    background: resolveToken('--background'),
    card: resolveToken('--card'),
    tag1: resolveToken('--tag-1'),
    tag2: resolveToken('--tag-2'),
    tag3: resolveToken('--tag-3'),
    tag4: resolveToken('--tag-4'),
    tag5: resolveToken('--tag-5'),
    tag6: resolveToken('--tag-6'),
  }));

  const chartBase = computed(() => {
    const mode = isDark.value ? 'dark' : 'light';
    const foreColor = colors.value.mutedForeground;
    const borderColor = colors.value.border;

    return {
      chart: {
        background: 'transparent',
        foreColor,
        fontFamily: 'Inter, sans-serif',
        toolbar: { show: false },
      },
      theme: { mode },
      grid: {
        borderColor,
        strokeDashArray: 3,
      },
      tooltip: {
        theme: mode,
      },
      xaxis: {
        labels: {
          style: { colors: foreColor },
        },
      },
      yaxis: {
        labels: {
          style: { colors: foreColor },
        },
      },
    };
  });

  return {
    isDark,
    resolveToken,
    chartBase,
    colors,
  };
}
```

### 5.2 Refactoring `src/views/DashboardView.vue`

1. **Import `useChartTheme`**:
   ```typescript
   import { useChartTheme } from '@/composables/useChartTheme';
   const { isDark, chartBase, colors, resolveToken } = useChartTheme();
   ```

2. **Convert all 11 static chart options to `computed` properties**:
   - `sparklineBlueOptions = computed(() => ({ ...chartBase.value, chart: { ...chartBase.value.chart, type: 'area', sparkline: { enabled: true } }, colors: [colors.value.info] }))`
   - `sparklinePurpleOptions = computed(() => ({ ...chartBase.value, chart: { ...chartBase.value.chart, type: 'area', sparkline: { enabled: true } }, colors: [colors.value.tag4] }))`
   - `sparklineOrangeOptions = computed(() => ({ ...chartBase.value, chart: { ...chartBase.value.chart, type: 'area', sparkline: { enabled: true } }, colors: [colors.value.warning] }))`
   - `slaRadialOptions = computed(() => ({ ...chartBase.value, chart: { ...chartBase.value.chart, type: 'radialBar', sparkline: { enabled: true } }, colors: [colors.value.primary], plotOptions: { radialBar: { track: { background: colors.value.muted }, ... } } }))`
   - `winRateTrendOptions = computed(() => ({ ...chartBase.value, chart: { ...chartBase.value.chart, type: 'area', sparkline: { enabled: true } }, colors: [colors.value.primary] }))`
   - `velocityApexOptions = computed(() => ({ ...chartBase.value, chart: { ...chartBase.value.chart, type: 'bar' }, plotOptions: { bar: { colors: { ranges: [{ from: 8, to: 15, color: colors.value.warning }, { from: 0, to: 7.9, color: colors.value.primary }] } } } }))`
   - `channelBarApexOptions = computed(() => ({ ...chartBase.value, chart: { ...chartBase.value.chart, type: 'bar' }, colors: [colors.value.primary, colors.value.info] }))`
   - `sessionsDualApexOptions = computed(() => ({ ...chartBase.value, chart: { ...chartBase.value.chart, type: 'line' }, colors: [colors.value.info, colors.value.primary] }))`
   - `qualityStackedApexOptions = computed(() => ({ ...chartBase.value, chart: { ...chartBase.value.chart, type: 'bar', stacked: true, stackType: '100%' }, colors: [colors.value.primary, colors.value.muted] }))`
   - `supportConversationsSparklineOptions = computed(() => ({ ...chartBase.value, chart: { ...chartBase.value.chart, type: 'line', sparkline: { enabled: true } }, colors: [colors.value.info] }))`
   - `supportResolvedSparklineOptions = computed(() => ({ ...chartBase.value, chart: { ...chartBase.value.chart, type: 'line', sparkline: { enabled: true } }, colors: [colors.value.tag4] }))`
   - `supportAvgResponseSparklineOptions = computed(() => ({ ...chartBase.value, chart: { ...chartBase.value.chart, type: 'line', sparkline: { enabled: true } }, colors: [colors.value.warning] }))`

3. **Update the existing 7 computed options**:
   - `revenueApexOptions`: Replace hardcoded `#23B750` / `#62D816` stops with `colors.value.primary` and `colors.value.brandSecondary`. Set `chart.background = 'transparent'`, `grid.borderColor = chartBase.value.grid.borderColor`, `tooltip.theme = chartBase.value.tooltip.theme`.
   - `funnelApexOptions`: `colors: [colors.value.primary]`, `yaxis.labels.style.colors: chartBase.value.yaxis.labels.style.colors`, `tooltip.theme = chartBase.value.tooltip.theme`.
   - `channelDonutOptions`: `colors: [colors.value.info, colors.value.tag4]`, `tooltip.theme = chartBase.value.tooltip.theme`.
   - `lostReasonDonutOptions`: `colors: [colors.value.info, colors.value.warning, colors.value.destructive, colors.value.primary]`, `tooltip.theme = chartBase.value.tooltip.theme`.
   - `attributionApexOptions`: `tooltip.theme = chartBase.value.tooltip.theme`.
   - `supportChannelDonutOptions`: `colors: [colors.value.info, colors.value.destructive]`, `tooltip.theme = chartBase.value.tooltip.theme`.

### 5.3 Refactoring `src/views/partner/PartnerOverviewView.vue`

1. **Import `useChartTheme`**:
   ```typescript
   import { useChartTheme } from '@/composables/useChartTheme';
   const { chartBase, colors } = useChartTheme();
   ```
2. In `salesApexDonutOptions`:
   - Empty colors: `[colors.value.muted]` (replaces raw `#E5E7EB`).
   - Active colors: `[colors.value.warning, colors.value.tag4, colors.value.destructive, colors.value.primary]` (replaces `#F59E0B`, `#8B5CF6`, `#F43F5E`, `#23B750`).
   - Chart background: `'transparent'`.
   - Tooltip: `tooltip: { theme: chartBase.value.tooltip.theme }`.
3. In `pipelineApexDonutOptions`:
   - Empty colors: `[colors.value.muted]` (replaces raw `#E5E7EB`).
   - Active colors: `[colors.value.warning, colors.value.destructive, colors.value.primary]`.
   - Chart background: `'transparent'`.
   - Tooltip: `tooltip: { theme: chartBase.value.tooltip.theme }`.

### 5.4 Refactoring SVG Spline Chart in `DesignSystemView.vue`

In `src/views/DesignSystemView.vue` (lines 2444–2508):
- Grid lines: replace `stroke="rgba(255,255,255,0.05)"` with `class="stroke-border"` (or `stroke="var(--border)"`).
- Linear gradient `<stop>`: use `stop-color="var(--primary)"` with `stop-opacity="0.35"` and `stop-opacity="0"`.
- Spline `<path>`: replace `stroke="#23B750"` with `class="stroke-primary"` (or `stroke="var(--primary)"`).
- Anchor circles: replace `:fill="idx === chartData.length - 1 ? '#62D816' : '#23B750'"` with `:fill="idx === chartData.length - 1 ? 'var(--brand-secondary)' : 'var(--primary)'"`, and `stroke="#0f172a"` with `class="stroke-card"`.

### 5.5 Documentation Alignment (`DESIGN.md`)

Update `DESIGN.md` and `src/data/designSystemGuidelines.ts`:
- Replace remaining raw gray class examples (`text-gray-900`, `text-gray-600`) with semantic token classes (`text-foreground`, `text-muted-foreground`).
- Remove obsolete raw hex color mappings.
- Document `useChartTheme.ts` usage pattern for future chart authors.

---

## 6. Verification Plan

1. **Static Analysis & Type Checking**:
   - Run `vue-tsc -b` to guarantee zero TypeScript compiler errors.
   - Run `node scripts/audit-tokens.cjs` to verify zero raw color violations.
2. **Build Verification**:
   - Run `npm run build` (`vite build`) to confirm production bundle generation.
3. **Runtime & Reactivity Verification**:
   - In browser preview, verify all 18 dashboard charts render in light mode.
   - Click theme toggle button in `TopNav.vue` (`useTheme().toggleTheme()`).
   - Verify every chart dynamically updates its grid lines, axis labels, tooltips, and series colors without page refresh or errors.
