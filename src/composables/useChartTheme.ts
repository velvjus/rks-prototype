import { computed, type ComputedRef } from 'vue';
import { useTheme } from './useTheme';

export interface UseChartThemeColors {
  primary: string;
  brand: string;
  brandSecondary: string;
  success: string;
  warning: string;
  info: string;
  destructive: string;
  border: string;
  muted: string;
  mutedForeground: string;
  foreground: string;
  background: string;
  card: string;
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
  chart6: string;
  chart7: string;
  chart8: string;
  stage1: string;
  stage2: string;
  stage3: string;
  stage4: string;
  stage5: string;
  stage6: string;
  stage7: string;
  stage8: string;
  tag1: string;
  tag2: string;
  tag3: string;
  tag4: string;
  tag5: string;
  tag6: string;
  [key: string]: string;
}

export interface UseChartThemeReturn {
  isDark: ComputedRef<boolean>;
  resolveToken: (cssVarName: string, fallback?: string) => string;
  chartBase: ComputedRef<{
    chart: { background: string; foreColor: string; fontFamily: string; toolbar: { show: boolean } };
    theme: { mode: 'light' | 'dark' };
    markers: { strokeColors: string };
    grid: { borderColor: string; strokeDashArray: number };
    tooltip: { theme: 'light' | 'dark' };
    xaxis: { labels: { style: { colors: string } } };
    yaxis: { labels: { style: { colors: string } } };
  }>;
  colors: ComputedRef<UseChartThemeColors>;
}

// Fallback values when running without DOM or before CSS is parsed
const FALLBACKS_LIGHT: Record<string, string> = {
  '--primary': '#16A34A',
  '--brand': '#16A34A',
  '--brand-secondary': '#62D816',
  '--success': '#16A34A',
  '--warning': '#F59E0B',
  '--info': '#2563EB',
  '--destructive': '#EF4444',
  '--border': '#e2e8f0',
  '--muted': '#f1f5f9',
  '--muted-foreground': '#64748b',
  '--foreground': '#0f172a',
  '--background': '#ffffff',
  '--card': '#ffffff',
  '--chart-1': '#165DFF',
  '--chart-2': '#14C9C9',
  '--chart-3': '#F7BA1E',
  '--chart-4': '#722ED1',
  '--chart-5': '#3491FA',
  '--chart-6': '#D91AD9',
  '--chart-7': '#FF7D00',
  '--chart-8': '#9FDB1D',
  '--stage-1': '#3B82F6',
  '--stage-2': '#00D2C4',
  '--stage-3': '#FFCC00',
  '--stage-4': '#FF8800',
  '--stage-5': '#10B981',
  '--stage-6': '#722ED1',
  '--stage-7': '#D91AD9',
  '--stage-8': '#9FDB1D',
  '--tag-1': '#165DFF',
  '--tag-2': '#10B981',
  '--tag-3': '#F7BA1E',
  '--tag-4': '#722ED1',
  '--tag-5': '#D91AD9',
  '--tag-6': '#14C9C9',
};

const FALLBACKS_DARK: Record<string, string> = {
  '--primary': '#22C55E',
  '--brand': '#22C55E',
  '--brand-secondary': '#62D816',
  '--success': '#22c55e',
  '--warning': '#F59E0B',
  '--info': '#38bdf8',
  '--destructive': '#EF4444',
  '--border': 'rgba(255, 255, 255, 0.1)',
  '--muted': '#27272a',
  '--muted-foreground': '#94a3b8',
  '--foreground': '#f8fafc',
  '--background': '#0f172a',
  '--card': '#1e293b',
  '--chart-1': '#165DFF',
  '--chart-2': '#14C9C9',
  '--chart-3': '#F7BA1E',
  '--chart-4': '#722ED1',
  '--chart-5': '#3491FA',
  '--chart-6': '#D91AD9',
  '--chart-7': '#FF7D00',
  '--chart-8': '#9FDB1D',
  '--stage-1': '#3B82F6',
  '--stage-2': '#00D2C4',
  '--stage-3': '#FFCC00',
  '--stage-4': '#FF8800',
  '--stage-5': '#10B981',
  '--stage-6': '#722ED1',
  '--stage-7': '#D91AD9',
  '--stage-8': '#9FDB1D',
  '--tag-1': '#3491FA',
  '--tag-2': '#10B981',
  '--tag-3': '#F7BA1E',
  '--tag-4': '#722ED1',
  '--tag-5': '#D91AD9',
  '--tag-6': '#14C9C9',
};

function oklchToColorString(l: number, c: number, h: number, alpha?: number): string {
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

  if (alpha !== undefined && alpha < 1) {
    return `rgba(${r}, ${g}, ${bVal}, ${alpha})`;
  }
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
        const match = rawValue.match(/oklch\(\s*([\d.]+)\s+([\d.]+)(?:\s+([\d.]+))?(?:\s*\/\s*([\d.]+%?))?\s*\)/i);
        if (match) {
          const l = parseFloat(match[1]);
          const c = parseFloat(match[2]);
          const h = match[3] ? parseFloat(match[3]) : 0;
          let alpha: number | undefined;
          if (match[4]) {
            alpha = match[4].endsWith('%') ? parseFloat(match[4]) / 100 : parseFloat(match[4]);
          }
          return oklchToColorString(l, c, h, alpha);
        }
      }

      if (rawValue.startsWith('rgb')) {
        const digits = rawValue.match(/[\d.]+/g);
        if (digits && digits.length >= 3) {
          const r = Math.round(parseFloat(digits[0]));
          const g = Math.round(parseFloat(digits[1]));
          const b = Math.round(parseFloat(digits[2]));
          if (digits.length >= 4) {
            const a = parseFloat(digits[3]);
            if (a < 1) {
              return `rgba(${r}, ${g}, ${b}, ${a})`;
            }
          }
          return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
        }
        return rawValue;
      }

      return defaultFallback;
    } catch {
      return defaultFallback;
    }
  }

  const colors = computed<UseChartThemeColors>(() => {
    // Reference isDark to ensure reactivity when theme changes
    const _dark = isDark.value;
    return {
      primary: resolveToken('--primary'),
      brand: resolveToken('--brand'),
      brandSecondary: resolveToken('--brand-secondary'),
      success: resolveToken('--success'),
      warning: resolveToken('--warning'),
      info: resolveToken('--info'),
      destructive: resolveToken('--destructive'),
      border: resolveToken('--border'),
      muted: resolveToken('--muted'),
      mutedForeground: resolveToken('--muted-foreground'),
      foreground: resolveToken('--foreground'),
      background: resolveToken('--background'),
      card: resolveToken('--card'),
      chart1: resolveToken('--chart-1'),
      chart2: resolveToken('--chart-2'),
      chart3: resolveToken('--chart-3'),
      chart4: resolveToken('--chart-4'),
      chart5: resolveToken('--chart-5'),
      chart6: resolveToken('--chart-6'),
      chart7: resolveToken('--chart-7'),
      chart8: resolveToken('--chart-8'),
      stage1: resolveToken('--stage-1'),
      stage2: resolveToken('--stage-2'),
      stage3: resolveToken('--stage-3'),
      stage4: resolveToken('--stage-4'),
      stage5: resolveToken('--stage-5'),
      stage6: resolveToken('--stage-6'),
      stage7: resolveToken('--stage-7'),
      stage8: resolveToken('--stage-8'),
      tag1: resolveToken('--chart-1'),
      tag2: resolveToken('--stage-5'),
      tag3: resolveToken('--chart-3'),
      tag4: resolveToken('--chart-4'),
      tag5: resolveToken('--chart-6'),
      tag6: resolveToken('--chart-2'),
    };
  });

  const chartBase = computed(() => {
    const mode = isDark.value ? 'dark' : 'light';
    const foreColor = colors.value.mutedForeground;
    const borderColor = colors.value.border;
    const cardColor = colors.value.card;

    return {
      chart: {
        background: 'transparent',
        foreColor,
        fontFamily: 'Inter, sans-serif',
        toolbar: { show: false },
      },
      theme: { mode: mode as 'light' | 'dark' },
      markers: {
        strokeColors: cardColor,
      },
      grid: {
        borderColor,
        strokeDashArray: 3,
      },
      tooltip: {
        theme: mode as 'light' | 'dark',
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
