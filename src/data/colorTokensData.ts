/* audit-ignore-file: Intentional reference data for Semantic Tokens & Tailwind CSS v4 Color Palette */

export interface SemanticTokenSpec {
  id: string
  name: string
  cssVar: string
  category: 'surface' | 'brand' | 'status' | 'navigation' | 'stages' | 'tags' | 'charts' | 'accents'
  twBgClass: string
  twTextClass: string
  twBorderClass: string
  pairedForegroundVar?: string
  lightOklch: string
  lightHex: string
  lightForegroundOklch: string
  darkOklch: string
  darkHex: string
  darkForegroundOklch: string
  contrastLight: string
  contrastDark: string
  tailwindMatchLight: string
  tailwindMatchDark: string
  usage: string
}

export interface TailwindShadeSpec {
  step: '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | '950'
  oklch: string
  hex: string
  systemTokenMatch?: string
}

export interface TailwindColorFamily {
  name: string
  slug: string
  group: 'Neutral & Slate' | 'Warm & Alert' | 'Emerald & Brand' | 'Cool & Info' | 'Vibrant & Violet'
  description: string
  isSystemFamily?: boolean
  shades: TailwindShadeSpec[]
}

export const SEMANTIC_TOKEN_CATEGORIES = [
  { id: 'all', label: 'All Tokens', count: 56 },
  { id: 'surface', label: 'Core Surfaces & Text', count: 10 },
  { id: 'brand', label: 'Brand & Actions', count: 5 },
  { id: 'status', label: 'Status & Feedback', count: 4 },
  { id: 'navigation', label: 'Rail & Sidebar', count: 7 },
  { id: 'stages', label: 'Pipeline Stage Accents (1–8)', count: 8 },
  { id: 'tags', label: 'Pipeline Tags (1–6)', count: 6 },
  { id: 'charts', label: 'Data Viz (1–8)', count: 8 },
  { id: 'accents', label: 'Vibrant Accents (8)', count: 8 },
] as const

export const SEMANTIC_TOKENS: SemanticTokenSpec[] = [
  // 1. Core Surfaces & Text
  {
    id: 'background',
    name: 'Page Canvas Background',
    cssVar: '--background',
    category: 'surface',
    twBgClass: 'bg-background',
    twTextClass: 'text-foreground',
    twBorderClass: 'border-border',
    pairedForegroundVar: '--foreground',
    lightOklch: 'oklch(0.984 0.003 247.858)',
    lightHex: '#F8FAFC', /* audit-ignore */
    lightForegroundOklch: 'oklch(0.208 0.042 265.755)',
    darkOklch: 'oklch(0.141 0.005 285.823)',
    darkHex: '#09090B', /* audit-ignore */
    darkForegroundOklch: 'oklch(0.985 0 0)',
    contrastLight: '17.1:1 AAA',
    contrastDark: '19.4:1 AAA',
    tailwindMatchLight: 'Slate 50',
    tailwindMatchDark: 'Zinc 950',
    usage: 'Primary workspace canvas (#F8FAFC Slate 50 in light mode, #09090B Zinc 950 in dark mode).'
  },
  {
    id: 'foreground',
    name: 'Primary Foreground Text',
    cssVar: '--foreground',
    category: 'surface',
    twBgClass: 'bg-foreground',
    twTextClass: 'text-foreground',
    twBorderClass: 'border-foreground',
    pairedForegroundVar: '--background',
    lightOklch: 'oklch(0.208 0.042 265.755)',
    lightHex: '#0F172A', /* audit-ignore */
    lightForegroundOklch: 'oklch(0.984 0.003 247.858)',
    darkOklch: 'oklch(0.985 0 0)',
    darkHex: '#FAFAFA', /* audit-ignore */
    darkForegroundOklch: 'oklch(0.141 0.005 285.823)',
    contrastLight: '17.1:1 AAA',
    contrastDark: '19.4:1 AAA',
    tailwindMatchLight: 'Slate 900',
    tailwindMatchDark: 'Zinc 50',
    usage: 'Headings, primary body copy, active table cells, and high-emphasis data.'
  },
  {
    id: 'card',
    name: 'Card & Elevated Surface',
    cssVar: '--card',
    category: 'surface',
    twBgClass: 'bg-card',
    twTextClass: 'text-card-foreground',
    twBorderClass: 'border-border',
    pairedForegroundVar: '--card-foreground',
    lightOklch: 'oklch(1 0 0)',
    lightHex: '#FFFFFF', /* audit-ignore */
    lightForegroundOklch: 'oklch(0.208 0.042 265.755)',
    darkOklch: 'oklch(0.21 0.006 285.885)',
    darkHex: '#18181B', /* audit-ignore */
    darkForegroundOklch: 'oklch(0.985 0 0)',
    contrastLight: '18.1:1 AAA',
    contrastDark: '17.1:1 AAA',
    tailwindMatchLight: 'White',
    tailwindMatchDark: 'Zinc 900',
    usage: 'KPI cards, Kanban deal cards, data tables, and elevated containers.'
  },
  {
    id: 'popover',
    name: 'Popover & Modal Surface',
    cssVar: '--popover',
    category: 'surface',
    twBgClass: 'bg-popover',
    twTextClass: 'text-popover-foreground',
    twBorderClass: 'border-border',
    pairedForegroundVar: '--popover-foreground',
    lightOklch: 'oklch(1 0 0)',
    lightHex: '#FFFFFF', /* audit-ignore */
    lightForegroundOklch: 'oklch(0.208 0.042 265.755)',
    darkOklch: 'oklch(0.21 0.006 285.885)',
    darkHex: '#18181B', /* audit-ignore */
    darkForegroundOklch: 'oklch(0.985 0 0)',
    contrastLight: '18.1:1 AAA',
    contrastDark: '17.1:1 AAA',
    tailwindMatchLight: 'White',
    tailwindMatchDark: 'Zinc 900',
    usage: 'Floating dropdown menus, select lists, date pickers, dialogs, and command palettes.'
  },
  {
    id: 'muted',
    name: 'Muted Container & Sub-Surface',
    cssVar: '--muted',
    category: 'surface',
    twBgClass: 'bg-muted',
    twTextClass: 'text-muted-foreground',
    twBorderClass: 'border-border',
    pairedForegroundVar: '--muted-foreground',
    lightOklch: 'oklch(0.968 0.007 247.896)',
    lightHex: '#F1F5F9', /* audit-ignore */
    lightForegroundOklch: 'oklch(0.554 0.046 257.417)',
    darkOklch: 'oklch(0.274 0.006 286.033)',
    darkHex: '#27272A', /* audit-ignore */
    darkForegroundOklch: 'oklch(0.705 0.015 286.067)',
    contrastLight: '4.6:1 AA',
    contrastDark: '5.2:1 AA',
    tailwindMatchLight: 'Slate 100',
    tailwindMatchDark: 'Zinc 800',
    usage: 'Table header rows, recessed wells, inactive tab tracks, code blocks, and skeleton loaders.'
  },
  {
    id: 'muted-foreground',
    name: 'Muted Secondary Text',
    cssVar: '--muted-foreground',
    category: 'surface',
    twBgClass: 'bg-muted-foreground',
    twTextClass: 'text-muted-foreground',
    twBorderClass: 'border-muted-foreground',
    pairedForegroundVar: '--background',
    lightOklch: 'oklch(0.554 0.046 257.417)',
    lightHex: '#64748B', /* audit-ignore */
    lightForegroundOklch: 'oklch(0.984 0.003 247.858)',
    darkOklch: 'oklch(0.705 0.015 286.067)',
    darkHex: '#A1A1AA', /* audit-ignore */
    darkForegroundOklch: 'oklch(0.141 0.005 285.823)',
    contrastLight: '4.8:1 AA',
    contrastDark: '7.6:1 AAA',
    tailwindMatchLight: 'Slate 500',
    tailwindMatchDark: 'Zinc 400',
    usage: 'Subtitles, timestamps, field descriptions, empty-state captions, and table column labels.'
  },
  {
    id: 'accent',
    name: 'Interactive Hover Accent',
    cssVar: '--accent',
    category: 'surface',
    twBgClass: 'bg-accent',
    twTextClass: 'text-accent-foreground',
    twBorderClass: 'border-border',
    pairedForegroundVar: '--accent-foreground',
    lightOklch: 'oklch(0.968 0.007 247.896)',
    lightHex: '#F1F5F9', /* audit-ignore */
    lightForegroundOklch: 'oklch(0.208 0.042 265.755)',
    darkOklch: 'oklch(0.274 0.006 286.033)',
    darkHex: '#27272A', /* audit-ignore */
    darkForegroundOklch: 'oklch(0.985 0 0)',
    contrastLight: '16.4:1 AAA',
    contrastDark: '12.6:1 AAA',
    tailwindMatchLight: 'Slate 100',
    tailwindMatchDark: 'Zinc 800',
    usage: 'Hover states on ghost buttons, dropdown menu items, and selectable table rows.'
  },
  {
    id: 'border',
    name: 'Structural Hairline Border',
    cssVar: '--border',
    category: 'surface',
    twBgClass: 'bg-border',
    twTextClass: 'text-foreground',
    twBorderClass: 'border-border',
    pairedForegroundVar: '--foreground',
    lightOklch: 'oklch(0.929 0.013 255.508)',
    lightHex: '#E2E8F0', /* audit-ignore */
    lightForegroundOklch: 'oklch(0.208 0.042 265.755)',
    darkOklch: 'oklch(0.274 0.006 286.033)',
    darkHex: '#27272A', /* audit-ignore */
    darkForegroundOklch: 'oklch(0.985 0 0)',
    contrastLight: '1.2:1 Hairline',
    contrastDark: '1.3:1 Hairline',
    tailwindMatchLight: 'Slate 200',
    tailwindMatchDark: 'Zinc 800',
    usage: '1px card boundaries, section dividers, table row separators, and panel splits.'
  },
  {
    id: 'input',
    name: 'Form Control Border',
    cssVar: '--input',
    category: 'surface',
    twBgClass: 'bg-input',
    twTextClass: 'text-foreground',
    twBorderClass: 'border-input',
    pairedForegroundVar: '--foreground',
    lightOklch: 'oklch(0.929 0.013 255.508)',
    lightHex: '#E2E8F0', /* audit-ignore */
    lightForegroundOklch: 'oklch(0.208 0.042 265.755)',
    darkOklch: 'oklch(0.274 0.006 286.033)',
    darkHex: '#27272A', /* audit-ignore */
    darkForegroundOklch: 'oklch(0.985 0 0)',
    contrastLight: '1.2:1 Control',
    contrastDark: '1.3:1 Control',
    tailwindMatchLight: 'Slate 200',
    tailwindMatchDark: 'Zinc 800',
    usage: 'Text inputs, select triggers, checkboxes, comboboxes, and search bars.'
  },
  {
    id: 'ring',
    name: 'Keyboard Focus Ring',
    cssVar: '--ring',
    category: 'surface',
    twBgClass: 'bg-ring',
    twTextClass: 'text-foreground',
    twBorderClass: 'border-ring',
    pairedForegroundVar: '--background',
    lightOklch: 'oklch(0.704 0.04 256.788)',
    lightHex: '#94A3B8', /* audit-ignore */
    lightForegroundOklch: 'oklch(0.208 0.042 265.755)',
    darkOklch: 'oklch(0.552 0.016 285.938)',
    darkHex: '#71717A', /* audit-ignore */
    darkForegroundOklch: 'oklch(0.985 0 0)',
    contrastLight: '3.1:1 UI',
    contrastDark: '3.9:1 UI',
    tailwindMatchLight: 'Slate 400',
    tailwindMatchDark: 'Zinc 500',
    usage: 'Accessible focus-visible outlines on interactive buttons, inputs, and dialogs.'
  },

  // 2. Brand & Primary Actions
  {
    id: 'primary',
    name: 'Primary Action Green (--brand)',
    cssVar: '--primary',
    category: 'brand',
    twBgClass: 'bg-primary',
    twTextClass: 'text-primary',
    twBorderClass: 'border-primary',
    pairedForegroundVar: '--primary-foreground',
    lightOklch: 'oklch(0.627 0.194 149.214)',
    lightHex: '#16A34A', /* audit-ignore */
    lightForegroundOklch: 'oklch(0.982 0.018 155.826)',
    darkOklch: 'oklch(0.65 0.18 149.2)',
    darkHex: '#22C55E', /* audit-ignore */
    darkForegroundOklch: 'oklch(0.982 0.018 155.826)',
    contrastLight: '4.5:1 AA',
    contrastDark: '4.6:1 AA',
    tailwindMatchLight: 'Green 600',
    tailwindMatchDark: 'Green 500',
    usage: 'Vibrant RakanSales brand green for primary CTAs, active navigation pills, outgoing WhatsApp bubbles, and checked states.'
  },
  {
    id: 'primary-foreground',
    name: 'Primary Action On-Text',
    cssVar: '--primary-foreground',
    category: 'brand',
    twBgClass: 'bg-primary-foreground',
    twTextClass: 'text-primary-foreground',
    twBorderClass: 'border-primary-foreground',
    pairedForegroundVar: '--primary',
    lightOklch: 'oklch(0.982 0.018 155.826)',
    lightHex: '#F0FDF4', /* audit-ignore */
    lightForegroundOklch: 'oklch(0.627 0.194 149.214)',
    darkOklch: 'oklch(0.982 0.018 155.826)',
    darkHex: '#F0FDF4', /* audit-ignore */
    darkForegroundOklch: 'oklch(0.65 0.18 149.2)',
    contrastLight: '4.5:1 AA',
    contrastDark: '4.6:1 AA',
    tailwindMatchLight: 'Green 50',
    tailwindMatchDark: 'Green 50',
    usage: 'High-contrast crisp label text and icons placed directly on bg-primary surfaces.'
  },
  {
    id: 'brand',
    name: 'RakanSales Brand Vibrant Green',
    cssVar: '--brand',
    category: 'brand',
    twBgClass: 'bg-brand',
    twTextClass: 'text-brand',
    twBorderClass: 'border-brand',
    pairedForegroundVar: '--brand-foreground',
    lightOklch: 'oklch(0.627 0.194 149.214)',
    lightHex: '#16A34A', /* audit-ignore */
    lightForegroundOklch: 'oklch(0.984 0.003 247.858)',
    darkOklch: 'oklch(0.65 0.18 149.2)',
    darkHex: '#22C55E', /* audit-ignore */
    darkForegroundOklch: 'oklch(0.984 0.003 247.858)',
    contrastLight: '4.5:1 AA',
    contrastDark: '4.6:1 AA',
    tailwindMatchLight: 'Green 600',
    tailwindMatchDark: 'Green 500',
    usage: 'Brand logomarks, active accent indicators, pulse dots, and brand badges.'
  },
  {
    id: 'brand-secondary',
    name: 'Brand Accent Highlight',
    cssVar: '--brand-secondary',
    category: 'brand',
    twBgClass: 'bg-brand-secondary',
    twTextClass: 'text-brand-secondary',
    twBorderClass: 'border-brand-secondary',
    pairedForegroundVar: '--foreground',
    lightOklch: 'oklch(0.81 0.22 135)',
    lightHex: '#65D61E', /* audit-ignore */
    lightForegroundOklch: 'oklch(0.208 0.042 265.755)',
    darkOklch: 'oklch(0.78 0.20 135)',
    darkHex: '#5CE11D', /* audit-ignore */
    darkForegroundOklch: 'oklch(0.208 0.042 265.755)',
    contrastLight: '10.8:1 AAA',
    contrastDark: '10.2:1 AAA',
    tailwindMatchLight: 'Green 400 / Lime 500',
    tailwindMatchDark: 'Green 400',
    usage: 'Secondary brand gradient endpoint and high-visibility chart/metric accents.'
  },
  {
    id: 'secondary',
    name: 'Secondary Neutral Action',
    cssVar: '--secondary',
    category: 'brand',
    twBgClass: 'bg-secondary',
    twTextClass: 'text-secondary-foreground',
    twBorderClass: 'border-border',
    pairedForegroundVar: '--secondary-foreground',
    lightOklch: 'oklch(0.968 0.007 247.896)',
    lightHex: '#F1F5F9', /* audit-ignore */
    lightForegroundOklch: 'oklch(0.208 0.042 265.755)',
    darkOklch: 'oklch(0.274 0.006 286.033)',
    darkHex: '#27272A', /* audit-ignore */
    darkForegroundOklch: 'oklch(0.985 0 0)',
    contrastLight: '16.4:1 AAA',
    contrastDark: '12.6:1 AAA',
    tailwindMatchLight: 'Slate 100',
    tailwindMatchDark: 'Zinc 800',
    usage: 'Secondary action buttons, filter pills, neutral chips, and cancel actions.'
  },

  // 3. Semantic Status States
  {
    id: 'success',
    name: 'Success & SLA Met',
    cssVar: '--success',
    category: 'status',
    twBgClass: 'bg-success',
    twTextClass: 'text-success',
    twBorderClass: 'border-success',
    pairedForegroundVar: '--success-foreground',
    lightOklch: 'oklch(0.627 0.194 149.214)',
    lightHex: '#16A34A', /* audit-ignore */
    lightForegroundOklch: 'oklch(0.984 0.003 247.858)',
    darkOklch: 'oklch(0.69 0.17 150)',
    darkHex: '#34D399', /* audit-ignore */
    darkForegroundOklch: 'oklch(0.208 0.042 265.755)',
    contrastLight: '4.5:1 AA',
    contrastDark: '9.6:1 AAA',
    tailwindMatchLight: 'Green 600',
    tailwindMatchDark: 'Green 400',
    usage: 'Deal won status, WhatsApp connected badge, positive revenue delta (+14.2%), and SLA met.'
  },
  {
    id: 'warning',
    name: 'Warning & SLA Attention',
    cssVar: '--warning',
    category: 'status',
    twBgClass: 'bg-warning',
    twTextClass: 'text-warning',
    twBorderClass: 'border-warning',
    pairedForegroundVar: '--warning-foreground',
    lightOklch: 'oklch(0.769 0.188 70.08)',
    lightHex: '#F59E0B', /* audit-ignore */
    lightForegroundOklch: 'oklch(0.208 0.042 265.755)',
    darkOklch: 'oklch(0.78 0.16 70)',
    darkHex: '#FBBF24', /* audit-ignore */
    darkForegroundOklch: 'oklch(0.208 0.042 265.755)',
    contrastLight: '8.9:1 AAA',
    contrastDark: '11.2:1 AAA',
    tailwindMatchLight: 'Amber 500',
    tailwindMatchDark: 'Amber 400',
    usage: 'Hot lead flame tags, internal private chat notes, quota approaching 80%, and pending approvals.'
  },
  {
    id: 'info',
    name: 'Informational & Sync',
    cssVar: '--info',
    category: 'status',
    twBgClass: 'bg-info',
    twTextClass: 'text-info',
    twBorderClass: 'border-info',
    pairedForegroundVar: '--info-foreground',
    lightOklch: 'oklch(0.623 0.188 250.3)',
    lightHex: '#2563EB', /* audit-ignore */
    lightForegroundOklch: 'oklch(0.984 0.003 247.858)',
    darkOklch: 'oklch(0.68 0.16 250)',
    darkHex: '#60A5FA', /* audit-ignore */
    darkForegroundOklch: 'oklch(0.208 0.042 265.755)',
    contrastLight: '5.2:1 AA',
    contrastDark: '7.8:1 AAA',
    tailwindMatchLight: 'Blue 600',
    tailwindMatchDark: 'Blue 400',
    usage: 'System sync notices, AI assistant drafts, timeline events, and informational banners.'
  },
  {
    id: 'destructive',
    name: 'Destructive & Critical Breach',
    cssVar: '--destructive',
    category: 'status',
    twBgClass: 'bg-destructive',
    twTextClass: 'text-destructive',
    twBorderClass: 'border-destructive',
    pairedForegroundVar: '--destructive-foreground',
    lightOklch: 'oklch(0.637 0.237 25.331)',
    lightHex: '#EF4444', /* audit-ignore */
    lightForegroundOklch: 'oklch(0.984 0.003 247.858)',
    darkOklch: 'oklch(0.704 0.191 22.216)',
    darkHex: '#F87171', /* audit-ignore */
    darkForegroundOklch: 'oklch(0.984 0.003 247.858)',
    contrastLight: '4.5:1 AA',
    contrastDark: '4.8:1 AA',
    tailwindMatchLight: 'Red 500 (#EF4444)',
    tailwindMatchDark: 'Red 400 (#F87171)',
    usage: 'Delete confirmations, overdue SLA breach alerts, deal lost badges, and unread counters.'
  },

  // 4. Navigation Rail & Contextual Sidebar
  {
    id: 'rail',
    name: 'Invariant Outer Rail & TopNav Surface',
    cssVar: '--rail',
    category: 'navigation',
    twBgClass: 'bg-rail',
    twTextClass: 'text-rail-foreground',
    twBorderClass: 'border-rail-border',
    pairedForegroundVar: '--rail-foreground',
    lightOklch: 'oklch(0.129 0.042 264.695)',
    lightHex: '#020617', /* audit-ignore */
    lightForegroundOklch: 'oklch(0.984 0.003 247.858)',
    darkOklch: 'oklch(0.141 0.005 285.823)',
    darkHex: '#09090B', /* audit-ignore */
    darkForegroundOklch: 'oklch(0.985 0 0)',
    contrastLight: '19.4:1 AAA',
    contrastDark: '19.4:1 AAA',
    tailwindMatchLight: 'Slate 950',
    tailwindMatchDark: 'Zinc 950',
    usage: 'Dark primary navigation rail (Sidebar.vue) and top header bar (TopNav.vue).'
  },
  {
    id: 'rail-active',
    name: 'Outer Rail Active Item',
    cssVar: '--rail-active',
    category: 'navigation',
    twBgClass: 'bg-rail-active',
    twTextClass: 'text-rail-foreground',
    twBorderClass: 'border-rail-border',
    pairedForegroundVar: '--rail-foreground',
    lightOklch: 'oklch(0.279 0.041 260.031)',
    lightHex: '#1E293B', /* audit-ignore */
    lightForegroundOklch: 'oklch(0.984 0.003 247.858)',
    darkOklch: 'oklch(0.274 0.006 286.033)',
    darkHex: '#27272A', /* audit-ignore */
    darkForegroundOklch: 'oklch(0.985 0 0)',
    contrastLight: '12.6:1 AAA',
    contrastDark: '12.6:1 AAA',
    tailwindMatchLight: 'Slate 800',
    tailwindMatchDark: 'Zinc 800',
    usage: 'Selected and hovered module icon button inside the dark outer rail and top header bar.'
  },
  {
    id: 'rail-muted-foreground',
    name: 'Outer Rail Inactive Icon/Label',
    cssVar: '--rail-muted-foreground',
    category: 'navigation',
    twBgClass: 'bg-rail-muted-foreground',
    twTextClass: 'text-rail-muted-foreground',
    twBorderClass: 'border-rail-border',
    pairedForegroundVar: '--rail',
    lightOklch: 'oklch(0.869 0.022 252.894)',
    lightHex: '#CBD5E1', /* audit-ignore */
    lightForegroundOklch: 'oklch(0.129 0.042 264.695)',
    darkOklch: 'oklch(0.871 0.006 286.286)',
    darkHex: '#D4D4D8', /* audit-ignore */
    darkForegroundOklch: 'oklch(0.141 0.005 285.823)',
    contrastLight: '11.4:1 AAA',
    contrastDark: '11.4:1 AAA',
    tailwindMatchLight: 'Slate 300',
    tailwindMatchDark: 'Zinc 300',
    usage: 'Unselected navigation icons and collapsed tooltips on the outer rail and top header bar.'
  },
  {
    id: 'rail-border',
    name: 'Outer Rail Divider',
    cssVar: '--rail-border',
    category: 'navigation',
    twBgClass: 'bg-rail-border',
    twTextClass: 'text-rail-foreground',
    twBorderClass: 'border-rail-border',
    pairedForegroundVar: '--rail-foreground',
    lightOklch: 'oklch(0.279 0.041 260.031)',
    lightHex: '#1E293B', /* audit-ignore */
    lightForegroundOklch: 'oklch(0.984 0.003 247.858)',
    darkOklch: 'oklch(0.274 0.006 286.033)',
    darkHex: '#27272A', /* audit-ignore */
    darkForegroundOklch: 'oklch(0.985 0 0)',
    contrastLight: '1.4:1 Divider',
    contrastDark: '1.4:1 Divider',
    tailwindMatchLight: 'Slate 800',
    tailwindMatchDark: 'Zinc 800',
    usage: 'Subtle horizontal and vertical borders inside the dark outer rail and top header bar.'
  },
  {
    id: 'sidebar',
    name: 'Contextual Secondary Sidebar',
    cssVar: '--sidebar',
    category: 'navigation',
    twBgClass: 'bg-sidebar',
    twTextClass: 'text-sidebar-foreground',
    twBorderClass: 'border-sidebar-border',
    pairedForegroundVar: '--sidebar-foreground',
    lightOklch: 'oklch(0.129 0.042 264.695)',
    lightHex: '#020617', /* audit-ignore */
    lightForegroundOklch: 'oklch(0.984 0.003 247.858)',
    darkOklch: 'oklch(0.141 0.005 285.823)',
    darkHex: '#09090B', /* audit-ignore */
    darkForegroundOklch: 'oklch(0.985 0 0)',
    contrastLight: '19.4:1 AAA',
    contrastDark: '19.4:1 AAA',
    tailwindMatchLight: 'Slate 950',
    tailwindMatchDark: 'Zinc 950',
    usage: 'Inner 240px contextual panel (SecondaryPanel.vue) for sub-routes and inbox folders.'
  },
  {
    id: 'sidebar-primary',
    name: 'Sidebar Active Accent',
    cssVar: '--sidebar-primary',
    category: 'navigation',
    twBgClass: 'bg-sidebar-primary',
    twTextClass: 'text-sidebar-primary',
    twBorderClass: 'border-sidebar-primary',
    pairedForegroundVar: '--sidebar-primary-foreground',
    lightOklch: 'oklch(0.627 0.194 149.214)',
    lightHex: '#16A34A', /* audit-ignore */
    lightForegroundOklch: 'oklch(0.982 0.018 155.826)',
    darkOklch: 'oklch(0.723 0.219 149.579)',
    darkHex: '#22C55E', /* audit-ignore */
    darkForegroundOklch: 'oklch(0.21 0.034 264.665)',
    contrastLight: '4.5:1 AA',
    contrastDark: '8.9:1 AAA',
    tailwindMatchLight: 'Green 600',
    tailwindMatchDark: 'Green 500',
    usage: 'Active sub-navigation indicator and selected folder counter inside SecondaryPanel.'
  },
  {
    id: 'sidebar-accent',
    name: 'Sidebar Hover Item',
    cssVar: '--sidebar-accent',
    category: 'navigation',
    twBgClass: 'bg-sidebar-accent',
    twTextClass: 'text-sidebar-accent-foreground',
    twBorderClass: 'border-sidebar-border',
    pairedForegroundVar: '--sidebar-accent-foreground',
    lightOklch: 'oklch(0.279 0.041 260.031)',
    lightHex: '#1E293B', /* audit-ignore */
    lightForegroundOklch: 'oklch(0.984 0.003 247.858)',
    darkOklch: 'oklch(0.274 0.006 286.033)',
    darkHex: '#27272A', /* audit-ignore */
    darkForegroundOklch: 'oklch(0.985 0 0)',
    contrastLight: '12.6:1 AAA',
    contrastDark: '12.6:1 AAA',
    tailwindMatchLight: 'Slate 800',
    tailwindMatchDark: 'Zinc 800',
    usage: 'Hovered sub-menu item background inside SecondaryPanel.'
  },

  // 5A. Pipeline Stage Column Header Accents (1-5)
  {
    id: 'stage-1',
    name: 'Stage 1 Accent — New (Blue)',
    cssVar: '--stage-1',
    category: 'stages',
    twBgClass: 'bg-stage-1',
    twTextClass: 'text-stage-1',
    twBorderClass: 'border-stage-1',
    pairedForegroundVar: '--primary-foreground',
    lightOklch: 'oklch(0.623 0.214 259.815)',
    lightHex: '#3B82F6', /* audit-ignore */
    lightForegroundOklch: 'oklch(0.984 0.003 247.858)',
    darkOklch: 'oklch(0.623 0.214 259.815)',
    darkHex: '#3B82F6', /* audit-ignore */
    darkForegroundOklch: 'oklch(0.984 0.003 247.858)',
    contrastLight: '3.7:1 Accent',
    contrastDark: '5.3:1 AA',
    tailwindMatchLight: 'Blue 500 (#3B82F6)',
    tailwindMatchDark: 'Blue 500 (#3B82F6)',
    usage: 'Deals Kanban column top stripe & Agent Performance bar for Stage 1 (New Leads).'
  },
  {
    id: 'stage-2',
    name: 'Stage 2 Accent — Acknowledged (Teal/Aqua)',
    cssVar: '--stage-2',
    category: 'stages',
    twBgClass: 'bg-stage-2',
    twTextClass: 'text-stage-2',
    twBorderClass: 'border-stage-2',
    pairedForegroundVar: '--foreground',
    lightOklch: 'oklch(0.784 0.146 187.8)',
    lightHex: '#00D2C4', /* audit-ignore */
    lightForegroundOklch: 'oklch(0.208 0.042 265.755)',
    darkOklch: 'oklch(0.784 0.146 187.8)',
    darkHex: '#00D2C4', /* audit-ignore */
    darkForegroundOklch: 'oklch(0.208 0.042 265.755)',
    contrastLight: '9.8:1 AAA',
    contrastDark: '10.4:1 AAA',
    tailwindMatchLight: 'Teal 400 / Custom Aqua (#00D2C4)',
    tailwindMatchDark: 'Teal 400 / Custom Aqua (#00D2C4)',
    usage: 'Deals Kanban column top stripe & Agent Performance bar for Stage 2 (Acknowledged).'
  },
  {
    id: 'stage-3',
    name: 'Stage 3 Accent — Qualifying (Golden Yellow)',
    cssVar: '--stage-3',
    category: 'stages',
    twBgClass: 'bg-stage-3',
    twTextClass: 'text-stage-3',
    twBorderClass: 'border-stage-3',
    pairedForegroundVar: '--foreground',
    lightOklch: 'oklch(0.865 0.179 90.4)',
    lightHex: '#FFCC00', /* audit-ignore */
    lightForegroundOklch: 'oklch(0.208 0.042 265.755)',
    darkOklch: 'oklch(0.865 0.179 90.4)',
    darkHex: '#FFCC00', /* audit-ignore */
    darkForegroundOklch: 'oklch(0.208 0.042 265.755)',
    contrastLight: '12.6:1 AAA',
    contrastDark: '13.4:1 AAA',
    tailwindMatchLight: 'Yellow 400 / Custom Gold (#FFCC00)',
    tailwindMatchDark: 'Yellow 400 / Custom Gold (#FFCC00)',
    usage: 'Deals Kanban column top stripe & Agent Performance bar for Stage 3 (Qualifying).'
  },
  {
    id: 'stage-4',
    name: 'Stage 4 Accent — Proposal / Quotation (Vibrant Orange)',
    cssVar: '--stage-4',
    category: 'stages',
    twBgClass: 'bg-stage-4',
    twTextClass: 'text-stage-4',
    twBorderClass: 'border-stage-4',
    pairedForegroundVar: '--foreground',
    lightOklch: 'oklch(0.738 0.188 52.8)',
    lightHex: '#FF8800', /* audit-ignore */
    lightForegroundOklch: 'oklch(0.208 0.042 265.755)',
    darkOklch: 'oklch(0.738 0.188 52.8)',
    darkHex: '#FF8800', /* audit-ignore */
    darkForegroundOklch: 'oklch(0.208 0.042 265.755)',
    contrastLight: '8.2:1 AAA',
    contrastDark: '8.7:1 AAA',
    tailwindMatchLight: 'Orange 500 (#FF8800)',
    tailwindMatchDark: 'Orange 500 (#FF8800)',
    usage: 'Deals Kanban column top stripe & Agent Performance bar for Stage 4 (Proposal / Quotation).'
  },
  {
    id: 'stage-5',
    name: 'Stage 5 Accent — Follow Up (Emerald)',
    cssVar: '--stage-5',
    category: 'stages',
    twBgClass: 'bg-stage-5',
    twTextClass: 'text-stage-5',
    twBorderClass: 'border-stage-5',
    pairedForegroundVar: '--primary-foreground',
    lightOklch: 'oklch(0.696 0.17 162.48)',
    lightHex: '#10B981', /* audit-ignore */
    lightForegroundOklch: 'oklch(0.984 0.003 247.858)',
    darkOklch: 'oklch(0.696 0.17 162.48)',
    darkHex: '#10B981', /* audit-ignore */
    darkForegroundOklch: 'oklch(0.208 0.042 265.755)',
    contrastLight: '7.4:1 AAA',
    contrastDark: '8.9:1 AAA',
    tailwindMatchLight: 'Emerald 500 (#10B981)',
    tailwindMatchDark: 'Emerald 500 (#10B981)',
    usage: 'Deals Kanban column top stripe & Agent Performance bar for Stage 5 (Follow Up / Negotiation).'
  },
  {
    id: 'stage-6',
    name: 'Stage 6 Accent — Custom / Enterprise (Royal Purple)',
    cssVar: '--stage-6',
    category: 'stages',
    twBgClass: 'bg-stage-6',
    twTextClass: 'text-stage-6',
    twBorderClass: 'border-stage-6',
    pairedForegroundVar: '--primary-foreground',
    lightOklch: 'oklch(0.491 0.241 293.36)',
    lightHex: '#722ED1', /* audit-ignore */
    lightForegroundOklch: 'oklch(0.984 0.003 247.858)',
    darkOklch: 'oklch(0.491 0.241 293.36)',
    darkHex: '#722ED1', /* audit-ignore */
    darkForegroundOklch: 'oklch(0.984 0.003 247.858)',
    contrastLight: '6.8:1 AA',
    contrastDark: '6.8:1 AA',
    tailwindMatchLight: 'Purple 600 (#722ED1)',
    tailwindMatchDark: 'Purple 600 (#722ED1)',
    usage: 'Expanded pipeline stage 6 header stripe and categorical stage series.'
  },
  {
    id: 'stage-7',
    name: 'Stage 7 Accent — Custom / Escalation (Magenta)',
    cssVar: '--stage-7',
    category: 'stages',
    twBgClass: 'bg-stage-7',
    twTextClass: 'text-stage-7',
    twBorderClass: 'border-stage-7',
    pairedForegroundVar: '--primary-foreground',
    lightOklch: 'oklch(0.592 0.276 328.36)',
    lightHex: '#D91AD9', /* audit-ignore */
    lightForegroundOklch: 'oklch(0.984 0.003 247.858)',
    darkOklch: 'oklch(0.592 0.276 328.36)',
    darkHex: '#D91AD9', /* audit-ignore */
    darkForegroundOklch: 'oklch(0.984 0.003 247.858)',
    contrastLight: '4.5:1 AA',
    contrastDark: '5.8:1 AA',
    tailwindMatchLight: 'Fuchsia 600 (#D91AD9)',
    tailwindMatchDark: 'Fuchsia 600 (#D91AD9)',
    usage: 'Expanded pipeline stage 7 header stripe and categorical stage series.'
  },
  {
    id: 'stage-8',
    name: 'Stage 8 Accent — Custom / Renewal (Lime Green)',
    cssVar: '--stage-8',
    category: 'stages',
    twBgClass: 'bg-stage-8',
    twTextClass: 'text-stage-8',
    twBorderClass: 'border-stage-8',
    pairedForegroundVar: '--foreground',
    lightOklch: 'oklch(0.825 0.205 124.89)',
    lightHex: '#9FDB1D', /* audit-ignore */
    lightForegroundOklch: 'oklch(0.208 0.042 265.755)',
    darkOklch: 'oklch(0.825 0.205 124.89)',
    darkHex: '#9FDB1D', /* audit-ignore */
    darkForegroundOklch: 'oklch(0.208 0.042 265.755)',
    contrastLight: '11.2:1 AAA',
    contrastDark: '11.8:1 AAA',
    tailwindMatchLight: 'Lime 400 (#9FDB1D)',
    tailwindMatchDark: 'Lime 400 (#9FDB1D)',
    usage: 'Expanded pipeline stage 8 header stripe and categorical stage series.'
  },

  // 5B. Categorical Pipeline Tag Channels (1-6)
  {
    id: 'tag-1',
    name: 'Tag 1 — Stage: New (Blue)',
    cssVar: '--tag-1',
    category: 'tags',
    twBgClass: 'bg-tag-1',
    twTextClass: 'text-tag-1-foreground',
    twBorderClass: 'border-tag-1',
    pairedForegroundVar: '--tag-1-foreground',
    lightOklch: 'oklch(0.95 0.04 240)',
    lightHex: '#E0F2FE', /* audit-ignore */
    lightForegroundOklch: 'oklch(0.42 0.16 245)',
    darkOklch: 'oklch(0.25 0.06 245)',
    darkHex: '#0C2D48', /* audit-ignore */
    darkForegroundOklch: 'oklch(0.85 0.10 240)',
    contrastLight: '6.8:1 AA',
    contrastDark: '7.4:1 AAA',
    tailwindMatchLight: 'Sky 100 / Blue 700',
    tailwindMatchDark: 'Sky 950 / Sky 300',
    usage: 'Pipeline Stage 1 (New Leads), cold inbound tags, and categorical chip 1.'
  },
  {
    id: 'tag-2',
    name: 'Tag 2 — Stage: Acknowledged (Green)',
    cssVar: '--tag-2',
    category: 'tags',
    twBgClass: 'bg-tag-2',
    twTextClass: 'text-tag-2-foreground',
    twBorderClass: 'border-tag-2',
    pairedForegroundVar: '--tag-2-foreground',
    lightOklch: 'oklch(0.95 0.05 150)',
    lightHex: '#DCFCE7', /* audit-ignore */
    lightForegroundOklch: 'oklch(0.38 0.15 150)',
    darkOklch: 'oklch(0.25 0.07 150)',
    darkHex: '#063722', /* audit-ignore */
    darkForegroundOklch: 'oklch(0.85 0.12 150)',
    contrastLight: '7.5:1 AAA',
    contrastDark: '7.9:1 AAA',
    tailwindMatchLight: 'Green 100 / Green 800',
    tailwindMatchDark: 'Green 950 / Green 300',
    usage: 'Pipeline Stage 2 (Acknowledged), verified contacts, and categorical chip 2.'
  },
  {
    id: 'tag-3',
    name: 'Tag 3 — Stage: Qualifying (Amber)',
    cssVar: '--tag-3',
    category: 'tags',
    twBgClass: 'bg-tag-3',
    twTextClass: 'text-tag-3-foreground',
    twBorderClass: 'border-tag-3',
    pairedForegroundVar: '--tag-3-foreground',
    lightOklch: 'oklch(0.95 0.06 75)',
    lightHex: '#FEF3C7', /* audit-ignore */
    lightForegroundOklch: 'oklch(0.45 0.16 65)',
    darkOklch: 'oklch(0.27 0.07 70)',
    darkHex: '#3B2506', /* audit-ignore */
    darkForegroundOklch: 'oklch(0.86 0.14 75)',
    contrastLight: '6.4:1 AA',
    contrastDark: '8.1:1 AAA',
    tailwindMatchLight: 'Amber 100 / Amber 800',
    tailwindMatchDark: 'Amber 950 / Amber 300',
    usage: 'Pipeline Stage 3 (Qualifying), active discovery deals, and categorical chip 3.'
  },
  {
    id: 'tag-4',
    name: 'Tag 4 — Stage: Proposal (Purple)',
    cssVar: '--tag-4',
    category: 'tags',
    twBgClass: 'bg-tag-4',
    twTextClass: 'text-tag-4-foreground',
    twBorderClass: 'border-tag-4',
    pairedForegroundVar: '--tag-4-foreground',
    lightOklch: 'oklch(0.95 0.05 300)',
    lightHex: '#F3E8FF', /* audit-ignore */
    lightForegroundOklch: 'oklch(0.42 0.18 300)',
    darkOklch: 'oklch(0.26 0.08 300)',
    darkHex: '#2E1045', /* audit-ignore */
    darkForegroundOklch: 'oklch(0.85 0.12 300)',
    contrastLight: '6.9:1 AA',
    contrastDark: '7.6:1 AAA',
    tailwindMatchLight: 'Purple 100 / Purple 800',
    tailwindMatchDark: 'Purple 950 / Purple 300',
    usage: 'Pipeline Stage 4 (Proposal / Quotation), enterprise tier tags, and categorical chip 4.'
  },
  {
    id: 'tag-5',
    name: 'Tag 5 — Stage: Follow Up (Rose)',
    cssVar: '--tag-5',
    category: 'tags',
    twBgClass: 'bg-tag-5',
    twTextClass: 'text-tag-5-foreground',
    twBorderClass: 'border-tag-5',
    pairedForegroundVar: '--tag-5-foreground',
    lightOklch: 'oklch(0.95 0.05 25)',
    lightHex: '#FFE4E6', /* audit-ignore */
    lightForegroundOklch: 'oklch(0.45 0.18 25)',
    darkOklch: 'oklch(0.26 0.08 25)',
    darkHex: '#3D0F18', /* audit-ignore */
    darkForegroundOklch: 'oklch(0.85 0.12 25)',
    contrastLight: '6.5:1 AA',
    contrastDark: '7.5:1 AAA',
    tailwindMatchLight: 'Rose 100 / Rose 800',
    tailwindMatchDark: 'Rose 950 / Rose 300',
    usage: 'Pipeline Stage 5 (Follow Up / Negotiation), high-touch accounts, and categorical chip 5.'
  },
  {
    id: 'tag-6',
    name: 'Tag 6 — Stage: Custom (Teal/Cyan)',
    cssVar: '--tag-6',
    category: 'tags',
    twBgClass: 'bg-tag-6',
    twTextClass: 'text-tag-6-foreground',
    twBorderClass: 'border-tag-6',
    pairedForegroundVar: '--tag-6-foreground',
    lightOklch: 'oklch(0.95 0.05 195)',
    lightHex: '#CCFBF1', /* audit-ignore */
    lightForegroundOklch: 'oklch(0.42 0.14 195)',
    darkOklch: 'oklch(0.25 0.06 195)',
    darkHex: '#08333A', /* audit-ignore */
    darkForegroundOklch: 'oklch(0.85 0.10 195)',
    contrastLight: '6.7:1 AA',
    contrastDark: '7.8:1 AAA',
    tailwindMatchLight: 'Teal 100 / Teal 800',
    tailwindMatchDark: 'Teal 950 / Teal 300',
    usage: 'Custom pipeline stages, partner referral badges, and categorical chip 6.'
  },

  // 6. Data Visualization & Categorical Pie/Chart Palette (1-8)
  {
    id: 'chart-1',
    name: 'Chart Series 1 — Royal Blue (#165DFF)',
    cssVar: '--chart-1',
    category: 'charts',
    twBgClass: 'bg-chart-1',
    twTextClass: 'text-chart-1',
    twBorderClass: 'border-chart-1',
    pairedForegroundVar: '--primary-foreground',
    lightOklch: 'oklch(0.548 0.242 262.87)',
    lightHex: '#165DFF', /* audit-ignore */
    lightForegroundOklch: 'oklch(0.985 0 0)',
    darkOklch: 'oklch(0.548 0.242 262.87)',
    darkHex: '#165DFF', /* audit-ignore */
    darkForegroundOklch: 'oklch(0.985 0 0)',
    contrastLight: '5.1:1 AA',
    contrastDark: '5.1:1 AA',
    tailwindMatchLight: 'Blue 600 (#165DFF)',
    tailwindMatchDark: 'Blue 600 (#165DFF)',
    usage: 'Primary categorical chart series 1 (Pie/Donut Slice 1, WhatsApp Direct, Pipeline Sparkline).'
  },
  {
    id: 'chart-2',
    name: 'Chart Series 2 — Cyan / Teal (#14C9C9)',
    cssVar: '--chart-2',
    category: 'charts',
    twBgClass: 'bg-chart-2',
    twTextClass: 'text-chart-2',
    twBorderClass: 'border-chart-2',
    pairedForegroundVar: '--foreground',
    lightOklch: 'oklch(0.759 0.131 194.77)',
    lightHex: '#14C9C9', /* audit-ignore */
    lightForegroundOklch: 'oklch(0.145 0 0)',
    darkOklch: 'oklch(0.759 0.131 194.77)',
    darkHex: '#14C9C9', /* audit-ignore */
    darkForegroundOklch: 'oklch(0.145 0 0)',
    contrastLight: '9.4:1 AAA',
    contrastDark: '9.4:1 AAA',
    tailwindMatchLight: 'Teal 400 (#14C9C9)',
    tailwindMatchDark: 'Teal 400 (#14C9C9)',
    usage: 'Categorical chart series 2 (Pie/Donut Slice 2, Direct Website Search, Shipping category).'
  },
  {
    id: 'chart-3',
    name: 'Chart Series 3 — Golden Amber (#F7BA1E)',
    cssVar: '--chart-3',
    category: 'charts',
    twBgClass: 'bg-chart-3',
    twTextClass: 'text-chart-3',
    twBorderClass: 'border-chart-3',
    pairedForegroundVar: '--foreground',
    lightOklch: 'oklch(0.817 0.165 81.38)',
    lightHex: '#F7BA1E', /* audit-ignore */
    lightForegroundOklch: 'oklch(0.145 0 0)',
    darkOklch: 'oklch(0.817 0.165 81.38)',
    darkHex: '#F7BA1E', /* audit-ignore */
    darkForegroundOklch: 'oklch(0.145 0 0)',
    contrastLight: '11.2:1 AAA',
    contrastDark: '11.2:1 AAA',
    tailwindMatchLight: 'Amber 400 (#F7BA1E)',
    tailwindMatchDark: 'Amber 400 (#F7BA1E)',
    usage: 'Categorical chart series 3 (Pie/Donut Slice 3, Meta Ads, Billing & Budget analysis).'
  },
  {
    id: 'chart-4',
    name: 'Chart Series 4 — Royal Purple (#722ED1)',
    cssVar: '--chart-4',
    category: 'charts',
    twBgClass: 'bg-chart-4',
    twTextClass: 'text-chart-4',
    twBorderClass: 'border-chart-4',
    pairedForegroundVar: '--primary-foreground',
    lightOklch: 'oklch(0.491 0.241 293.36)',
    lightHex: '#722ED1', /* audit-ignore */
    lightForegroundOklch: 'oklch(0.985 0 0)',
    darkOklch: 'oklch(0.491 0.241 293.36)',
    darkHex: '#722ED1', /* audit-ignore */
    darkForegroundOklch: 'oklch(0.985 0 0)',
    contrastLight: '6.8:1 AA',
    contrastDark: '6.8:1 AA',
    tailwindMatchLight: 'Purple 600 (#722ED1)',
    tailwindMatchDark: 'Purple 600 (#722ED1)',
    usage: 'Categorical chart series 4 (Pie/Donut Slice 4, Email Inbound, Google Organic, Conversion Sparkline).'
  },
  {
    id: 'chart-5',
    name: 'Chart Series 5 — Sky Blue (#3491FA)',
    cssVar: '--chart-5',
    category: 'charts',
    twBgClass: 'bg-chart-5',
    twTextClass: 'text-chart-5',
    twBorderClass: 'border-chart-5',
    pairedForegroundVar: '--primary-foreground',
    lightOklch: 'oklch(0.654 0.187 253.58)',
    lightHex: '#3491FA', /* audit-ignore */
    lightForegroundOklch: 'oklch(0.985 0 0)',
    darkOklch: 'oklch(0.654 0.187 253.58)',
    darkHex: '#3491FA', /* audit-ignore */
    darkForegroundOklch: 'oklch(0.985 0 0)',
    contrastLight: '4.1:1 Series',
    contrastDark: '6.5:1 AA',
    tailwindMatchLight: 'Blue 400 (#3491FA)',
    tailwindMatchDark: 'Blue 400 (#3491FA)',
    usage: 'Categorical chart series 5 (Pie/Donut Slice 5, Messenger, Technical Support category).'
  },
  {
    id: 'chart-6',
    name: 'Chart Series 6 — Vibrant Magenta (#D91AD9)',
    cssVar: '--chart-6',
    category: 'charts',
    twBgClass: 'bg-chart-6',
    twTextClass: 'text-chart-6',
    twBorderClass: 'border-chart-6',
    pairedForegroundVar: '--primary-foreground',
    lightOklch: 'oklch(0.592 0.276 328.36)',
    lightHex: '#D91AD9', /* audit-ignore */
    lightForegroundOklch: 'oklch(0.985 0 0)',
    darkOklch: 'oklch(0.592 0.276 328.36)',
    darkHex: '#D91AD9', /* audit-ignore */
    darkForegroundOklch: 'oklch(0.985 0 0)',
    contrastLight: '4.5:1 AA',
    contrastDark: '5.8:1 AA',
    tailwindMatchLight: 'Fuchsia 600 (#D91AD9)',
    tailwindMatchDark: 'Fuchsia 600 (#D91AD9)',
    usage: 'Categorical chart series 6 (Pie/Donut Slice 6, Instagram / Social campaign cohorts).'
  },
  {
    id: 'chart-7',
    name: 'Chart Series 7 — Vibrant Orange (#FF7D00)',
    cssVar: '--chart-7',
    category: 'charts',
    twBgClass: 'bg-chart-7',
    twTextClass: 'text-chart-7',
    twBorderClass: 'border-chart-7',
    pairedForegroundVar: '--foreground',
    lightOklch: 'oklch(0.722 0.196 49.38)',
    lightHex: '#FF7D00', /* audit-ignore */
    lightForegroundOklch: 'oklch(0.145 0 0)',
    darkOklch: 'oklch(0.722 0.196 49.38)',
    darkHex: '#FF7D00', /* audit-ignore */
    darkForegroundOklch: 'oklch(0.145 0 0)',
    contrastLight: '7.8:1 AAA',
    contrastDark: '7.8:1 AAA',
    tailwindMatchLight: 'Orange 500 (#FF7D00)',
    tailwindMatchDark: 'Orange 500 (#FF7D00)',
    usage: 'Categorical chart series 7 (Pie/Donut Slice 7, Response Time Sparkline, Returns category).'
  },
  {
    id: 'chart-8',
    name: 'Chart Series 8 — Lime Green (#9FDB1D)',
    cssVar: '--chart-8',
    category: 'charts',
    twBgClass: 'bg-chart-8',
    twTextClass: 'text-chart-8',
    twBorderClass: 'border-chart-8',
    pairedForegroundVar: '--foreground',
    lightOklch: 'oklch(0.825 0.205 124.89)',
    lightHex: '#9FDB1D', /* audit-ignore */
    lightForegroundOklch: 'oklch(0.145 0 0)',
    darkOklch: 'oklch(0.825 0.205 124.89)',
    darkHex: '#9FDB1D', /* audit-ignore */
    darkForegroundOklch: 'oklch(0.145 0 0)',
    contrastLight: '11.2:1 AAA',
    contrastDark: '11.2:1 AAA',
    tailwindMatchLight: 'Lime 400 (#9FDB1D)',
    tailwindMatchDark: 'Lime 400 (#9FDB1D)',
    usage: 'Categorical chart series 8 (Pie/Donut Slice 8, Growth & secondary positive series).'
  },

  // 7. Vibrant Accent Palette Tokens (8)
  {
    id: 'accent-purple',
    name: 'Vibrant Accent Purple (VIP Crown)',
    cssVar: '--accent-purple',
    category: 'accents',
    twBgClass: 'bg-accent-purple',
    twTextClass: 'text-accent-purple',
    twBorderClass: 'border-accent-purple',
    pairedForegroundVar: '--primary-foreground',
    lightOklch: 'oklch(0.627 0.265 303.9)',
    lightHex: '#A855F7', /* audit-ignore */
    lightForegroundOklch: 'oklch(0.985 0 0)',
    darkOklch: 'oklch(0.627 0.265 303.9)',
    darkHex: '#A855F7', /* audit-ignore */
    darkForegroundOklch: 'oklch(0.985 0 0)',
    contrastLight: '4.5:1 AA',
    contrastDark: '5.8:1 AA',
    tailwindMatchLight: 'Purple 500 (#A855F7)',
    tailwindMatchDark: 'Purple 500 (#A855F7)',
    usage: 'Omnichannel VIP crown icons, VIP contact badges (bg-accent-purple/10 text-accent-purple), and purple feature accents.'
  },
  {
    id: 'accent-blue',
    name: 'Vibrant Accent Blue',
    cssVar: '--accent-blue',
    category: 'accents',
    twBgClass: 'bg-accent-blue',
    twTextClass: 'text-accent-blue',
    twBorderClass: 'border-accent-blue',
    pairedForegroundVar: '--primary-foreground',
    lightOklch: 'oklch(0.623 0.214 259.815)',
    lightHex: '#3B82F6', /* audit-ignore */
    lightForegroundOklch: 'oklch(0.985 0 0)',
    darkOklch: 'oklch(0.707 0.165 254.624)',
    darkHex: '#60A5FA', /* audit-ignore */
    darkForegroundOklch: 'oklch(0.145 0 0)',
    contrastLight: '4.5:1 AA',
    contrastDark: '7.8:1 AAA',
    tailwindMatchLight: 'Blue 500 (#3B82F6)',
    tailwindMatchDark: 'Blue 400 (#60A5FA)',
    usage: 'Crisp blue icon accents, active bookmark/focus stars, and interactive blue highlights.'
  },
  {
    id: 'accent-cyan',
    name: 'Vibrant Accent Cyan',
    cssVar: '--accent-cyan',
    category: 'accents',
    twBgClass: 'bg-accent-cyan',
    twTextClass: 'text-accent-cyan',
    twBorderClass: 'border-accent-cyan',
    pairedForegroundVar: '--foreground',
    lightOklch: 'oklch(0.715 0.143 215.221)',
    lightHex: '#06B6D4', /* audit-ignore */
    lightForegroundOklch: 'oklch(0.145 0 0)',
    darkOklch: 'oklch(0.789 0.154 211.53)',
    darkHex: '#22D3EE', /* audit-ignore */
    darkForegroundOklch: 'oklch(0.145 0 0)',
    contrastLight: '7.4:1 AAA',
    contrastDark: '10.2:1 AAA',
    tailwindMatchLight: 'Cyan 500 (#06B6D4)',
    tailwindMatchDark: 'Cyan 400 (#22D3EE)',
    usage: 'Cyan icon highlights, AI/automation accents, and secondary cool badges.'
  },
  {
    id: 'accent-teal',
    name: 'Vibrant Accent Teal',
    cssVar: '--accent-teal',
    category: 'accents',
    twBgClass: 'bg-accent-teal',
    twTextClass: 'text-accent-teal',
    twBorderClass: 'border-accent-teal',
    pairedForegroundVar: '--foreground',
    lightOklch: 'oklch(0.704 0.14 182.503)',
    lightHex: '#14B8A6', /* audit-ignore */
    lightForegroundOklch: 'oklch(0.145 0 0)',
    darkOklch: 'oklch(0.777 0.152 181.912)',
    darkHex: '#2DD4BF', /* audit-ignore */
    darkForegroundOklch: 'oklch(0.145 0 0)',
    contrastLight: '7.2:1 AAA',
    contrastDark: '10.1:1 AAA',
    tailwindMatchLight: 'Teal 500 (#14B8A6)',
    tailwindMatchDark: 'Teal 400 (#2DD4BF)',
    usage: 'Teal icon accents, acknowledged status indicators, and partner badges.'
  },
  {
    id: 'accent-amber',
    name: 'Vibrant Accent Amber',
    cssVar: '--accent-amber',
    category: 'accents',
    twBgClass: 'bg-accent-amber',
    twTextClass: 'text-accent-amber',
    twBorderClass: 'border-accent-amber',
    pairedForegroundVar: '--foreground',
    lightOklch: 'oklch(0.769 0.188 70.08)',
    lightHex: '#F59E0B', /* audit-ignore */
    lightForegroundOklch: 'oklch(0.145 0 0)',
    darkOklch: 'oklch(0.828 0.189 84.429)',
    darkHex: '#FBBF24', /* audit-ignore */
    darkForegroundOklch: 'oklch(0.145 0 0)',
    contrastLight: '8.9:1 AAA',
    contrastDark: '11.4:1 AAA',
    tailwindMatchLight: 'Amber 500 (#F59E0B)',
    tailwindMatchDark: 'Amber 400 (#FBBF24)',
    usage: 'Star ratings, warm gold badges, and high-visibility amber icons.'
  },
  {
    id: 'accent-orange',
    name: 'Vibrant Accent Orange',
    cssVar: '--accent-orange',
    category: 'accents',
    twBgClass: 'bg-accent-orange',
    twTextClass: 'text-accent-orange',
    twBorderClass: 'border-accent-orange',
    pairedForegroundVar: '--primary-foreground',
    lightOklch: 'oklch(0.705 0.213 47.604)',
    lightHex: '#F97316', /* audit-ignore */
    lightForegroundOklch: 'oklch(0.985 0 0)',
    darkOklch: 'oklch(0.75 0.183 55.934)',
    darkHex: '#FB923C', /* audit-ignore */
    darkForegroundOklch: 'oklch(0.145 0 0)',
    contrastLight: '6.8:1 AA',
    contrastDark: '8.6:1 AAA',
    tailwindMatchLight: 'Orange 500 (#F97316)',
    tailwindMatchDark: 'Orange 400 (#FB923C)',
    usage: 'Hot lead flame icons, proposal accents, and warm orange highlights.'
  },
  {
    id: 'accent-pink',
    name: 'Vibrant Accent Pink',
    cssVar: '--accent-pink',
    category: 'accents',
    twBgClass: 'bg-accent-pink',
    twTextClass: 'text-accent-pink',
    twBorderClass: 'border-accent-pink',
    pairedForegroundVar: '--primary-foreground',
    lightOklch: 'oklch(0.656 0.241 354.308)',
    lightHex: '#EC4899', /* audit-ignore */
    lightForegroundOklch: 'oklch(0.985 0 0)',
    darkOklch: 'oklch(0.718 0.202 349.761)',
    darkHex: '#F472B6', /* audit-ignore */
    darkForegroundOklch: 'oklch(0.145 0 0)',
    contrastLight: '4.6:1 AA',
    contrastDark: '7.5:1 AAA',
    tailwindMatchLight: 'Pink 500 (#EC4899)',
    tailwindMatchDark: 'Pink 400 (#F472B6)',
    usage: 'Instagram/social campaign accents, creative badges, and pink icon highlights.'
  },
  {
    id: 'accent-indigo',
    name: 'Vibrant Accent Indigo',
    cssVar: '--accent-indigo',
    category: 'accents',
    twBgClass: 'bg-accent-indigo',
    twTextClass: 'text-accent-indigo',
    twBorderClass: 'border-accent-indigo',
    pairedForegroundVar: '--primary-foreground',
    lightOklch: 'oklch(0.585 0.233 277.117)',
    lightHex: '#6366F1', /* audit-ignore */
    lightForegroundOklch: 'oklch(0.985 0 0)',
    darkOklch: 'oklch(0.673 0.182 276.935)',
    darkHex: '#818CF8', /* audit-ignore */
    darkForegroundOklch: 'oklch(0.145 0 0)',
    contrastLight: '5.1:1 AA',
    contrastDark: '7.1:1 AAA',
    tailwindMatchLight: 'Indigo 500 (#6366F1)',
    tailwindMatchDark: 'Indigo 400 (#818CF8)',
    usage: 'AI copilot accents, deep indigo badges, and enterprise feature highlights.'
  },
]

// Complete Official Tailwind CSS v4 Color Library (22 Families, Steps 50-950)
// Reference: https://tailwindcss.com/docs/colors
export const TAILWIND_V4_PALETTE: TailwindColorFamily[] = [
  {
    name: 'Slate',
    slug: 'slate',
    group: 'Neutral & Slate',
    description: 'Light Mode (:root) primary RakanSales surface & structural scale — powers --background (#f8fafc), --foreground, --muted, --border, --sidebar, and --rail in Light Mode.',
    isSystemFamily: true,
    shades: [
      { step: '50', oklch: 'oklch(0.984 0.003 247.858)', hex: '#f8fafc', systemTokenMatch: '--background (:root) / --rail-foreground (:root)' }, /* audit-ignore */
      { step: '100', oklch: 'oklch(0.968 0.007 247.896)', hex: '#f1f5f9', systemTokenMatch: '--muted (:root) / --accent (:root) / --secondary (:root)' }, /* audit-ignore */
      { step: '200', oklch: 'oklch(0.929 0.013 255.508)', hex: '#e2e8f0', systemTokenMatch: '--border (:root) / --input (:root)' }, /* audit-ignore */
      { step: '300', oklch: 'oklch(0.869 0.022 252.894)', hex: '#cbd5e1', systemTokenMatch: '--rail-muted-foreground (:root)' }, /* audit-ignore */
      { step: '400', oklch: 'oklch(0.704 0.04 256.788)', hex: '#94a3b8', systemTokenMatch: '--ring (:root)' }, /* audit-ignore */
      { step: '500', oklch: 'oklch(0.554 0.046 257.417)', hex: '#64748b', systemTokenMatch: '--muted-foreground (:root)' }, /* audit-ignore */
      { step: '600', oklch: 'oklch(0.446 0.043 257.281)', hex: '#475569' }, /* audit-ignore */
      { step: '700', oklch: 'oklch(0.372 0.044 257.287)', hex: '#334155' }, /* audit-ignore */
      { step: '800', oklch: 'oklch(0.279 0.041 260.031)', hex: '#1e293b', systemTokenMatch: '--rail-active (:root) / --rail-border (:root)' }, /* audit-ignore */
      { step: '900', oklch: 'oklch(0.208 0.042 265.755)', hex: '#0f172a', systemTokenMatch: '--foreground (:root)' }, /* audit-ignore */
      { step: '950', oklch: 'oklch(0.129 0.042 264.695)', hex: '#020617', systemTokenMatch: '--rail (:root) / --sidebar (:root)' }, /* audit-ignore */
    ]
  },
  {
    name: 'Gray',
    slug: 'gray',
    group: 'Neutral & Slate',
    description: 'Classic subtle cool gray scale.',
    shades: [
      { step: '50', oklch: 'oklch(0.985 0.002 247.839)', hex: '#f9fafb' }, /* audit-ignore */
      { step: '100', oklch: 'oklch(0.967 0.003 264.542)', hex: '#f3f4f6' }, /* audit-ignore */
      { step: '200', oklch: 'oklch(0.928 0.006 264.531)', hex: '#e5e7eb' }, /* audit-ignore */
      { step: '300', oklch: 'oklch(0.872 0.01 258.338)', hex: '#d1d5db' }, /* audit-ignore */
      { step: '400', oklch: 'oklch(0.707 0.022 261.325)', hex: '#9ca3af' }, /* audit-ignore */
      { step: '500', oklch: 'oklch(0.551 0.027 264.364)', hex: '#6b7280' }, /* audit-ignore */
      { step: '600', oklch: 'oklch(0.446 0.03 256.802)', hex: '#4b5563' }, /* audit-ignore */
      { step: '700', oklch: 'oklch(0.373 0.034 259.733)', hex: '#374151' }, /* audit-ignore */
      { step: '800', oklch: 'oklch(0.278 0.033 256.848)', hex: '#1f2937' }, /* audit-ignore */
      { step: '900', oklch: 'oklch(0.21 0.034 264.665)', hex: '#111827' }, /* audit-ignore */
      { step: '950', oklch: 'oklch(0.13 0.028 261.692)', hex: '#030712' }, /* audit-ignore */
    ]
  },
  {
    name: 'Neutral',
    slug: 'neutral',
    group: 'Neutral & Slate',
    description: 'Pure achromatic gray scale with zero hue chroma.',
    shades: [
      { step: '50', oklch: 'oklch(0.985 0 0)', hex: '#fafafa' }, /* audit-ignore */
      { step: '100', oklch: 'oklch(0.97 0 0)', hex: '#f5f5f5' }, /* audit-ignore */
      { step: '200', oklch: 'oklch(0.922 0 0)', hex: '#e5e5e5' }, /* audit-ignore */
      { step: '300', oklch: 'oklch(0.87 0 0)', hex: '#d4d4d4' }, /* audit-ignore */
      { step: '400', oklch: 'oklch(0.708 0 0)', hex: '#a3a3a3' }, /* audit-ignore */
      { step: '500', oklch: 'oklch(0.556 0 0)', hex: '#737373' }, /* audit-ignore */
      { step: '600', oklch: 'oklch(0.439 0 0)', hex: '#525252' }, /* audit-ignore */
      { step: '700', oklch: 'oklch(0.371 0 0)', hex: '#404040' }, /* audit-ignore */
      { step: '800', oklch: 'oklch(0.269 0 0)', hex: '#262626' }, /* audit-ignore */
      { step: '900', oklch: 'oklch(0.205 0 0)', hex: '#171717' }, /* audit-ignore */
      { step: '950', oklch: 'oklch(0.145 0 0)', hex: '#0a0a0a' }, /* audit-ignore */
    ]
  },
  {
    name: 'Zinc',
    slug: 'zinc',
    group: 'Neutral & Slate',
    description: 'Dark Mode (.dark) primary RakanSales surface & structural scale — powers --background (#09090b), --foreground, --card, --muted, --border, --sidebar, and --rail in Dark Mode.',
    isSystemFamily: true,
    shades: [
      { step: '50', oklch: 'oklch(0.985 0 0)', hex: '#fafafa', systemTokenMatch: '--foreground (.dark) / --rail-foreground (.dark)' }, /* audit-ignore */
      { step: '100', oklch: 'oklch(0.967 0.001 286.375)', hex: '#f4f4f5' }, /* audit-ignore */
      { step: '200', oklch: 'oklch(0.92 0.004 286.32)', hex: '#e4e4e7' }, /* audit-ignore */
      { step: '300', oklch: 'oklch(0.871 0.006 286.286)', hex: '#d4d4d8', systemTokenMatch: '--rail-muted-foreground (.dark)' }, /* audit-ignore */
      { step: '400', oklch: 'oklch(0.705 0.015 286.067)', hex: '#a1a1aa', systemTokenMatch: '--muted-foreground (.dark)' }, /* audit-ignore */
      { step: '500', oklch: 'oklch(0.552 0.016 285.938)', hex: '#71717a', systemTokenMatch: '--ring (.dark)' }, /* audit-ignore */
      { step: '600', oklch: 'oklch(0.442 0.017 285.786)', hex: '#52525b' }, /* audit-ignore */
      { step: '700', oklch: 'oklch(0.37 0.013 285.805)', hex: '#3f3f46' }, /* audit-ignore */
      { step: '800', oklch: 'oklch(0.274 0.006 286.033)', hex: '#27272a', systemTokenMatch: '--muted (.dark) / --border (.dark) / --rail-active (.dark)' }, /* audit-ignore */
      { step: '900', oklch: 'oklch(0.21 0.006 285.885)', hex: '#18181b', systemTokenMatch: '--card (.dark) / --popover (.dark)' }, /* audit-ignore */
      { step: '950', oklch: 'oklch(0.141 0.005 285.823)', hex: '#09090b', systemTokenMatch: '--background (.dark) / --rail (.dark) / --sidebar (.dark)' }, /* audit-ignore */
    ]
  },
  {
    name: 'Stone',
    slug: 'stone',
    group: 'Neutral & Slate',
    description: 'Warm organic editorial gray with subtle earthy undertones.',
    shades: [
      { step: '50', oklch: 'oklch(0.985 0.001 106.423)', hex: '#fafaf9' }, /* audit-ignore */
      { step: '100', oklch: 'oklch(0.97 0.001 106.424)', hex: '#f5f5f4' }, /* audit-ignore */
      { step: '200', oklch: 'oklch(0.923 0.003 48.717)', hex: '#e7e5e4' }, /* audit-ignore */
      { step: '300', oklch: 'oklch(0.869 0.005 56.366)', hex: '#d6d3d1' }, /* audit-ignore */
      { step: '400', oklch: 'oklch(0.709 0.01 56.259)', hex: '#a8a29e' }, /* audit-ignore */
      { step: '500', oklch: 'oklch(0.553 0.013 58.071)', hex: '#78716c' }, /* audit-ignore */
      { step: '600', oklch: 'oklch(0.444 0.011 73.639)', hex: '#57534e' }, /* audit-ignore */
      { step: '700', oklch: 'oklch(0.374 0.01 67.558)', hex: '#44403c' }, /* audit-ignore */
      { step: '800', oklch: 'oklch(0.268 0.007 34.298)', hex: '#292524' }, /* audit-ignore */
      { step: '900', oklch: 'oklch(0.216 0.006 56.043)', hex: '#1c1917' }, /* audit-ignore */
      { step: '950', oklch: 'oklch(0.147 0.004 49.25)', hex: '#0c0a09' }, /* audit-ignore */
    ]
  },
  {
    name: 'Green',
    slug: 'green',
    group: 'Emerald & Brand',
    description: 'Primary RakanSales Brand family — anchors --primary, --brand, --success, and --chart-1..5.',
    isSystemFamily: true,
    shades: [
      { step: '50', oklch: 'oklch(0.982 0.018 155.826)', hex: '#f0fdf4', systemTokenMatch: '--primary-foreground' }, /* audit-ignore */
      { step: '100', oklch: 'oklch(0.962 0.044 156.743)', hex: '#dcfce7', systemTokenMatch: '--tag-2 (:root)' }, /* audit-ignore */
      { step: '200', oklch: 'oklch(0.925 0.084 155.995)', hex: '#bbf7d0' }, /* audit-ignore */
      { step: '300', oklch: 'oklch(0.871 0.15 154.449)', hex: '#86efac', systemTokenMatch: '--chart-1' }, /* audit-ignore */
      { step: '400', oklch: 'oklch(0.792 0.209 151.711)', hex: '#4ade80' }, /* audit-ignore */
      { step: '500', oklch: 'oklch(0.723 0.219 149.579)', hex: '#22c55e', systemTokenMatch: '--chart-2 / --primary (.dark) / --brand (.dark)' }, /* audit-ignore */
      { step: '600', oklch: 'oklch(0.627 0.194 149.214)', hex: '#16a34a', systemTokenMatch: '--primary (:root) / --brand (:root) / --success (:root) / --chart-3' }, /* audit-ignore */
      { step: '700', oklch: 'oklch(0.527 0.154 150.069)', hex: '#15803d', systemTokenMatch: '--chart-4' }, /* audit-ignore */
      { step: '800', oklch: 'oklch(0.448 0.119 151.328)', hex: '#166534', systemTokenMatch: '--chart-5' }, /* audit-ignore */
      { step: '900', oklch: 'oklch(0.393 0.095 152.535)', hex: '#14532d' }, /* audit-ignore */
      { step: '950', oklch: 'oklch(0.266 0.065 152.934)', hex: '#052e16', systemTokenMatch: '--tag-2 (.dark)' }, /* audit-ignore */
    ]
  },
  {
    name: 'Emerald',
    slug: 'emerald',
    group: 'Emerald & Brand',
    description: 'Blue-shifted jewel green — great for financial growth indicators and verified badges.',
    shades: [
      { step: '50', oklch: 'oklch(0.979 0.021 166.113)', hex: '#ecfdf5' }, /* audit-ignore */
      { step: '100', oklch: 'oklch(0.95 0.052 163.051)', hex: '#d1fae5' }, /* audit-ignore */
      { step: '200', oklch: 'oklch(0.905 0.093 164.15)', hex: '#a7f3d0' }, /* audit-ignore */
      { step: '300', oklch: 'oklch(0.845 0.143 164.978)', hex: '#6ee7b7' }, /* audit-ignore */
      { step: '400', oklch: 'oklch(0.765 0.177 163.223)', hex: '#34d399' }, /* audit-ignore */
      { step: '500', oklch: 'oklch(0.696 0.17 162.48)', hex: '#10b981' }, /* audit-ignore */
      { step: '600', oklch: 'oklch(0.596 0.145 163.225)', hex: '#059669' }, /* audit-ignore */
      { step: '700', oklch: 'oklch(0.508 0.118 165.612)', hex: '#047857' }, /* audit-ignore */
      { step: '800', oklch: 'oklch(0.432 0.095 166.913)', hex: '#065f46' }, /* audit-ignore */
      { step: '900', oklch: 'oklch(0.378 0.077 168.94)', hex: '#064e3b' }, /* audit-ignore */
      { step: '950', oklch: 'oklch(0.262 0.051 172.552)', hex: '#022c22' }, /* audit-ignore */
    ]
  },
  {
    name: 'Teal',
    slug: 'teal',
    group: 'Emerald & Brand',
    description: 'Balanced cyan-green — powers RakanSales --tag-6 custom pipeline stage.',
    isSystemFamily: true,
    shades: [
      { step: '50', oklch: 'oklch(0.984 0.014 180.72)', hex: '#f0fdfa' }, /* audit-ignore */
      { step: '100', oklch: 'oklch(0.953 0.051 180.801)', hex: '#ccfbf1', systemTokenMatch: '--tag-6 (:root)' }, /* audit-ignore */
      { step: '200', oklch: 'oklch(0.91 0.096 180.426)', hex: '#99f6e4' }, /* audit-ignore */
      { step: '300', oklch: 'oklch(0.855 0.138 181.071)', hex: '#5eead4' }, /* audit-ignore */
      { step: '400', oklch: 'oklch(0.777 0.152 181.912)', hex: '#2dd4bf' }, /* audit-ignore */
      { step: '500', oklch: 'oklch(0.704 0.14 182.503)', hex: '#14b8a6' }, /* audit-ignore */
      { step: '600', oklch: 'oklch(0.6 0.118 184.704)', hex: '#0d9488' }, /* audit-ignore */
      { step: '700', oklch: 'oklch(0.511 0.096 186.391)', hex: '#0f766e' }, /* audit-ignore */
      { step: '800', oklch: 'oklch(0.437 0.078 188.216)', hex: '#115e59' }, /* audit-ignore */
      { step: '900', oklch: 'oklch(0.386 0.063 188.416)', hex: '#134e4a' }, /* audit-ignore */
      { step: '950', oklch: 'oklch(0.277 0.046 192.524)', hex: '#042f2e', systemTokenMatch: '--tag-6 (.dark)' }, /* audit-ignore */
    ]
  },
  {
    name: 'Lime',
    slug: 'lime',
    group: 'Emerald & Brand',
    description: 'High-energy yellow-green — used as secondary brand highlight (--brand-secondary).',
    shades: [
      { step: '50', oklch: 'oklch(0.986 0.031 120.757)', hex: '#f7fee7' }, /* audit-ignore */
      { step: '100', oklch: 'oklch(0.967 0.067 122.328)', hex: '#ecfccb' }, /* audit-ignore */
      { step: '200', oklch: 'oklch(0.938 0.127 124.321)', hex: '#d9f99d' }, /* audit-ignore */
      { step: '300', oklch: 'oklch(0.897 0.196 126.665)', hex: '#bef264' }, /* audit-ignore */
      { step: '400', oklch: 'oklch(0.841 0.238 128.85)', hex: '#a3e635' }, /* audit-ignore */
      { step: '500', oklch: 'oklch(0.768 0.233 130.85)', hex: '#84cc16', systemTokenMatch: '--brand-secondary' }, /* audit-ignore */
      { step: '600', oklch: 'oklch(0.648 0.2 131.684)', hex: '#65a30d' }, /* audit-ignore */
      { step: '700', oklch: 'oklch(0.532 0.157 131.589)', hex: '#4d7c0f' }, /* audit-ignore */
      { step: '800', oklch: 'oklch(0.453 0.124 130.933)', hex: '#3f6212' }, /* audit-ignore */
      { step: '900', oklch: 'oklch(0.405 0.101 131.063)', hex: '#365314' }, /* audit-ignore */
      { step: '950', oklch: 'oklch(0.274 0.072 132.109)', hex: '#1a2e05' }, /* audit-ignore */
    ]
  },
  {
    name: 'Red',
    slug: 'red',
    group: 'Warm & Alert',
    description: 'High-urgency crimson — powers RakanSales --destructive states and SLA breach indicators.',
    isSystemFamily: true,
    shades: [
      { step: '50', oklch: 'oklch(0.971 0.013 17.38)', hex: '#fef2f2' }, /* audit-ignore */
      { step: '100', oklch: 'oklch(0.936 0.032 17.717)', hex: '#fee2e2' }, /* audit-ignore */
      { step: '200', oklch: 'oklch(0.885 0.062 18.334)', hex: '#fecaca' }, /* audit-ignore */
      { step: '300', oklch: 'oklch(0.808 0.114 19.571)', hex: '#fca5a5' }, /* audit-ignore */
      { step: '400', oklch: 'oklch(0.704 0.191 22.216)', hex: '#f87171', systemTokenMatch: '--destructive (.dark)' }, /* audit-ignore */
      { step: '500', oklch: 'oklch(0.637 0.237 25.331)', hex: '#ef4444' }, /* audit-ignore */
      { step: '600', oklch: 'oklch(0.577 0.245 27.325)', hex: '#dc2626', systemTokenMatch: '--destructive (:root)' }, /* audit-ignore */
      { step: '700', oklch: 'oklch(0.505 0.213 27.518)', hex: '#b91c1c' }, /* audit-ignore */
      { step: '800', oklch: 'oklch(0.444 0.177 26.899)', hex: '#991b1b' }, /* audit-ignore */
      { step: '900', oklch: 'oklch(0.396 0.141 25.723)', hex: '#7f1d1d' }, /* audit-ignore */
      { step: '950', oklch: 'oklch(0.258 0.092 26.042)', hex: '#450a0a' }, /* audit-ignore */
    ]
  },
  {
    name: 'Amber',
    slug: 'amber',
    group: 'Warm & Alert',
    description: 'Warm golden caution — powers RakanSales --warning states, private notes, and --tag-3.',
    isSystemFamily: true,
    shades: [
      { step: '50', oklch: 'oklch(0.987 0.022 95.277)', hex: '#fffbeb' }, /* audit-ignore */
      { step: '100', oklch: 'oklch(0.962 0.059 95.617)', hex: '#fef3c7', systemTokenMatch: '--tag-3 (:root)' }, /* audit-ignore */
      { step: '200', oklch: 'oklch(0.924 0.12 95.746)', hex: '#fde68a' }, /* audit-ignore */
      { step: '300', oklch: 'oklch(0.879 0.169 91.605)', hex: '#fcd34d' }, /* audit-ignore */
      { step: '400', oklch: 'oklch(0.828 0.189 84.429)', hex: '#fbbf24', systemTokenMatch: '--warning (.dark)' }, /* audit-ignore */
      { step: '500', oklch: 'oklch(0.769 0.188 70.08)', hex: '#f59e0b', systemTokenMatch: '--warning (:root)' }, /* audit-ignore */
      { step: '600', oklch: 'oklch(0.666 0.179 58.318)', hex: '#d97706' }, /* audit-ignore */
      { step: '700', oklch: 'oklch(0.555 0.163 48.998)', hex: '#b45309' }, /* audit-ignore */
      { step: '800', oklch: 'oklch(0.473 0.137 46.201)', hex: '#92400e' }, /* audit-ignore */
      { step: '900', oklch: 'oklch(0.414 0.112 45.904)', hex: '#78350f' }, /* audit-ignore */
      { step: '950', oklch: 'oklch(0.279 0.077 45.635)', hex: '#451a03', systemTokenMatch: '--tag-3 (.dark)' }, /* audit-ignore */
    ]
  },
  {
    name: 'Orange',
    slug: 'orange',
    group: 'Warm & Alert',
    description: 'Energetic tangerine — great for hot deal flame indicators and priority escalations.',
    shades: [
      { step: '50', oklch: 'oklch(0.98 0.016 73.684)', hex: '#fff7ed' }, /* audit-ignore */
      { step: '100', oklch: 'oklch(0.954 0.038 75.164)', hex: '#ffedd5' }, /* audit-ignore */
      { step: '200', oklch: 'oklch(0.901 0.076 70.697)', hex: '#fed7aa' }, /* audit-ignore */
      { step: '300', oklch: 'oklch(0.837 0.128 66.29)', hex: '#fdba74' }, /* audit-ignore */
      { step: '400', oklch: 'oklch(0.75 0.183 55.934)', hex: '#fb923c' }, /* audit-ignore */
      { step: '500', oklch: 'oklch(0.705 0.213 47.604)', hex: '#f97316' }, /* audit-ignore */
      { step: '600', oklch: 'oklch(0.646 0.222 41.116)', hex: '#ea580c' }, /* audit-ignore */
      { step: '700', oklch: 'oklch(0.553 0.195 38.402)', hex: '#c2410c' }, /* audit-ignore */
      { step: '800', oklch: 'oklch(0.47 0.157 37.304)', hex: '#9a3412' }, /* audit-ignore */
      { step: '900', oklch: 'oklch(0.408 0.123 38.172)', hex: '#7c2d12' }, /* audit-ignore */
      { step: '950', oklch: 'oklch(0.266 0.079 36.259)', hex: '#431407' }, /* audit-ignore */
    ]
  },
  {
    name: 'Yellow',
    slug: 'yellow',
    group: 'Warm & Alert',
    description: 'Bright solar yellow — useful for star ratings, VIP crowns, and highlight markers.',
    shades: [
      { step: '50', oklch: 'oklch(0.987 0.026 102.212)', hex: '#fefce8' }, /* audit-ignore */
      { step: '100', oklch: 'oklch(0.973 0.071 103.193)', hex: '#fef9c3' }, /* audit-ignore */
      { step: '200', oklch: 'oklch(0.945 0.129 101.54)', hex: '#fef08a' }, /* audit-ignore */
      { step: '300', oklch: 'oklch(0.905 0.182 98.111)', hex: '#fde047' }, /* audit-ignore */
      { step: '400', oklch: 'oklch(0.852 0.199 91.936)', hex: '#facc15' }, /* audit-ignore */
      { step: '500', oklch: 'oklch(0.795 0.184 86.047)', hex: '#eab308' }, /* audit-ignore */
      { step: '600', oklch: 'oklch(0.681 0.162 75.834)', hex: '#ca8a04' }, /* audit-ignore */
      { step: '700', oklch: 'oklch(0.554 0.135 66.442)', hex: '#a16207' }, /* audit-ignore */
      { step: '800', oklch: 'oklch(0.476 0.114 61.907)', hex: '#854d0e' }, /* audit-ignore */
      { step: '900', oklch: 'oklch(0.421 0.095 57.708)', hex: '#713f12' }, /* audit-ignore */
      { step: '950', oklch: 'oklch(0.286 0.066 53.813)', hex: '#422006' }, /* audit-ignore */
    ]
  },
  {
    name: 'Blue',
    slug: 'blue',
    group: 'Cool & Info',
    description: 'Trustworthy cobalt blue — powers RakanSales --info state and --tag-1 (Stage: New).',
    isSystemFamily: true,
    shades: [
      { step: '50', oklch: 'oklch(0.97 0.014 254.604)', hex: '#eff6ff' }, /* audit-ignore */
      { step: '100', oklch: 'oklch(0.932 0.032 255.585)', hex: '#dbeafe', systemTokenMatch: '--tag-1 (:root)' }, /* audit-ignore */
      { step: '200', oklch: 'oklch(0.882 0.059 254.128)', hex: '#bfdbfe' }, /* audit-ignore */
      { step: '300', oklch: 'oklch(0.809 0.105 251.813)', hex: '#93c5fd' }, /* audit-ignore */
      { step: '400', oklch: 'oklch(0.707 0.165 254.624)', hex: '#60a5fa', systemTokenMatch: '--info (.dark)' }, /* audit-ignore */
      { step: '500', oklch: 'oklch(0.623 0.214 259.815)', hex: '#3b82f6', systemTokenMatch: '--info (:root)' }, /* audit-ignore */
      { step: '600', oklch: 'oklch(0.546 0.245 262.881)', hex: '#2563eb' }, /* audit-ignore */
      { step: '700', oklch: 'oklch(0.488 0.243 264.376)', hex: '#1d4ed8' }, /* audit-ignore */
      { step: '800', oklch: 'oklch(0.424 0.199 265.638)', hex: '#1e40af' }, /* audit-ignore */
      { step: '900', oklch: 'oklch(0.379 0.146 265.522)', hex: '#1e3a8a' }, /* audit-ignore */
      { step: '950', oklch: 'oklch(0.282 0.091 267.935)', hex: '#172554', systemTokenMatch: '--tag-1 (.dark)' }, /* audit-ignore */
    ]
  },
  {
    name: 'Sky',
    slug: 'sky',
    group: 'Cool & Info',
    description: 'Crisp azure sky — ideal for cloud sync indicators, links, and Telegram channel accents.',
    shades: [
      { step: '50', oklch: 'oklch(0.977 0.013 236.62)', hex: '#f0f9ff' }, /* audit-ignore */
      { step: '100', oklch: 'oklch(0.951 0.026 236.824)', hex: '#e0f2fe' }, /* audit-ignore */
      { step: '200', oklch: 'oklch(0.901 0.058 230.902)', hex: '#bae6fd' }, /* audit-ignore */
      { step: '300', oklch: 'oklch(0.828 0.111 230.318)', hex: '#7dd3fc' }, /* audit-ignore */
      { step: '400', oklch: 'oklch(0.746 0.16 232.661)', hex: '#38bdf8' }, /* audit-ignore */
      { step: '500', oklch: 'oklch(0.685 0.169 237.323)', hex: '#0ea5e9' }, /* audit-ignore */
      { step: '600', oklch: 'oklch(0.588 0.158 241.966)', hex: '#0284c7' }, /* audit-ignore */
      { step: '700', oklch: 'oklch(0.5 0.134 242.749)', hex: '#0369a1' }, /* audit-ignore */
      { step: '800', oklch: 'oklch(0.443 0.11 240.79)', hex: '#075985' }, /* audit-ignore */
      { step: '900', oklch: 'oklch(0.391 0.09 240.876)', hex: '#0c4a6e' }, /* audit-ignore */
      { step: '950', oklch: 'oklch(0.293 0.066 243.157)', hex: '#082f49' }, /* audit-ignore */
    ]
  },
  {
    name: 'Cyan',
    slug: 'cyan',
    group: 'Cool & Info',
    description: 'Luminous aqua cyan — high-contrast technical accent for telemetry and analytics.',
    shades: [
      { step: '50', oklch: 'oklch(0.984 0.019 200.873)', hex: '#ecfeff' }, /* audit-ignore */
      { step: '100', oklch: 'oklch(0.956 0.045 203.388)', hex: '#cffafe' }, /* audit-ignore */
      { step: '200', oklch: 'oklch(0.917 0.08 205.041)', hex: '#a5f3fc' }, /* audit-ignore */
      { step: '300', oklch: 'oklch(0.865 0.127 207.078)', hex: '#67e8f9' }, /* audit-ignore */
      { step: '400', oklch: 'oklch(0.789 0.154 211.53)', hex: '#22d3ee' }, /* audit-ignore */
      { step: '500', oklch: 'oklch(0.715 0.143 215.221)', hex: '#06b6d4' }, /* audit-ignore */
      { step: '600', oklch: 'oklch(0.609 0.126 221.723)', hex: '#0891b2' }, /* audit-ignore */
      { step: '700', oklch: 'oklch(0.52 0.105 223.128)', hex: '#0e7490' }, /* audit-ignore */
      { step: '800', oklch: 'oklch(0.45 0.085 224.283)', hex: '#155e75' }, /* audit-ignore */
      { step: '900', oklch: 'oklch(0.398 0.07 227.392)', hex: '#164e63' }, /* audit-ignore */
      { step: '950', oklch: 'oklch(0.302 0.056 229.695)', hex: '#083344' }, /* audit-ignore */
    ]
  },
  {
    name: 'Indigo',
    slug: 'indigo',
    group: 'Cool & Info',
    description: 'Deep enterprise indigo — ideal for AI assistant features and enterprise role badges.',
    shades: [
      { step: '50', oklch: 'oklch(0.962 0.018 272.314)', hex: '#eef2ff' }, /* audit-ignore */
      { step: '100', oklch: 'oklch(0.93 0.034 272.788)', hex: '#e0e7ff' }, /* audit-ignore */
      { step: '200', oklch: 'oklch(0.87 0.065 274.039)', hex: '#c7d2fe' }, /* audit-ignore */
      { step: '300', oklch: 'oklch(0.785 0.115 274.713)', hex: '#a5b4fc' }, /* audit-ignore */
      { step: '400', oklch: 'oklch(0.673 0.182 276.935)', hex: '#818cf8' }, /* audit-ignore */
      { step: '500', oklch: 'oklch(0.585 0.233 277.117)', hex: '#6366f1' }, /* audit-ignore */
      { step: '600', oklch: 'oklch(0.511 0.262 276.966)', hex: '#4f46e5' }, /* audit-ignore */
      { step: '700', oklch: 'oklch(0.457 0.24 277.023)', hex: '#4338ca' }, /* audit-ignore */
      { step: '800', oklch: 'oklch(0.398 0.195 277.366)', hex: '#3730a3' }, /* audit-ignore */
      { step: '900', oklch: 'oklch(0.359 0.144 278.697)', hex: '#312e81' }, /* audit-ignore */
      { step: '950', oklch: 'oklch(0.257 0.09 281.288)', hex: '#1e1b4b' }, /* audit-ignore */
    ]
  },
  {
    name: 'Purple',
    slug: 'purple',
    group: 'Vibrant & Violet',
    description: 'Regal amethyst purple — powers RakanSales --tag-4 (Stage: Proposal / Quotation).',
    isSystemFamily: true,
    shades: [
      { step: '50', oklch: 'oklch(0.977 0.014 308.299)', hex: '#faf5ff' }, /* audit-ignore */
      { step: '100', oklch: 'oklch(0.946 0.033 307.174)', hex: '#f3e8ff', systemTokenMatch: '--tag-4 (:root)' }, /* audit-ignore */
      { step: '200', oklch: 'oklch(0.902 0.063 306.703)', hex: '#e9d5ff' }, /* audit-ignore */
      { step: '300', oklch: 'oklch(0.827 0.119 306.383)', hex: '#d8b4fe' }, /* audit-ignore */
      { step: '400', oklch: 'oklch(0.714 0.203 305.504)', hex: '#c084fc' }, /* audit-ignore */
      { step: '500', oklch: 'oklch(0.627 0.265 303.9)', hex: '#a855f7' }, /* audit-ignore */
      { step: '600', oklch: 'oklch(0.558 0.288 302.321)', hex: '#9333ea' }, /* audit-ignore */
      { step: '700', oklch: 'oklch(0.496 0.265 301.924)', hex: '#7e22ce' }, /* audit-ignore */
      { step: '800', oklch: 'oklch(0.438 0.218 303.724)', hex: '#6b21a8' }, /* audit-ignore */
      { step: '900', oklch: 'oklch(0.381 0.176 304.987)', hex: '#581c87' }, /* audit-ignore */
      { step: '950', oklch: 'oklch(0.291 0.149 302.717)', hex: '#3b0764', systemTokenMatch: '--tag-4 (.dark)' }, /* audit-ignore */
    ]
  },
  {
    name: 'Violet',
    slug: 'violet',
    group: 'Vibrant & Violet',
    description: 'Modern electric violet — great for AI copilot badges and workflow automation triggers.',
    shades: [
      { step: '50', oklch: 'oklch(0.969 0.016 293.756)', hex: '#f5f3ff' }, /* audit-ignore */
      { step: '100', oklch: 'oklch(0.943 0.029 294.588)', hex: '#ede9fe' }, /* audit-ignore */
      { step: '200', oklch: 'oklch(0.894 0.057 293.283)', hex: '#ddd6fe' }, /* audit-ignore */
      { step: '300', oklch: 'oklch(0.811 0.111 293.571)', hex: '#c4b5fd' }, /* audit-ignore */
      { step: '400', oklch: 'oklch(0.702 0.183 293.541)', hex: '#a78bfa' }, /* audit-ignore */
      { step: '500', oklch: 'oklch(0.606 0.25 292.717)', hex: '#8b5cf6' }, /* audit-ignore */
      { step: '600', oklch: 'oklch(0.541 0.281 293.009)', hex: '#7c3aed' }, /* audit-ignore */
      { step: '700', oklch: 'oklch(0.491 0.27 292.581)', hex: '#6d28d9' }, /* audit-ignore */
      { step: '800', oklch: 'oklch(0.432 0.232 292.759)', hex: '#5b21b6' }, /* audit-ignore */
      { step: '900', oklch: 'oklch(0.38 0.189 293.745)', hex: '#4c1d95' }, /* audit-ignore */
      { step: '950', oklch: 'oklch(0.283 0.141 291.089)', hex: '#2e1065' }, /* audit-ignore */
    ]
  },
  {
    name: 'Fuchsia',
    slug: 'fuchsia',
    group: 'Vibrant & Violet',
    description: 'Vivid magenta-purple — high-contrast accent for marketing campaigns and Instagram channels.',
    shades: [
      { step: '50', oklch: 'oklch(0.977 0.017 320.058)', hex: '#fdf4ff' }, /* audit-ignore */
      { step: '100', oklch: 'oklch(0.952 0.037 318.852)', hex: '#fae8ff' }, /* audit-ignore */
      { step: '200', oklch: 'oklch(0.903 0.076 319.62)', hex: '#f5d0fe' }, /* audit-ignore */
      { step: '300', oklch: 'oklch(0.833 0.145 321.434)', hex: '#f0abfc' }, /* audit-ignore */
      { step: '400', oklch: 'oklch(0.74 0.238 322.16)', hex: '#e879f9' }, /* audit-ignore */
      { step: '500', oklch: 'oklch(0.667 0.295 322.15)', hex: '#d946ef' }, /* audit-ignore */
      { step: '600', oklch: 'oklch(0.591 0.293 322.896)', hex: '#c026d3' }, /* audit-ignore */
      { step: '700', oklch: 'oklch(0.518 0.253 323.949)', hex: '#a21caf' }, /* audit-ignore */
      { step: '800', oklch: 'oklch(0.452 0.211 324.591)', hex: '#86198f' }, /* audit-ignore */
      { step: '900', oklch: 'oklch(0.401 0.17 325.612)', hex: '#701a75' }, /* audit-ignore */
      { step: '950', oklch: 'oklch(0.293 0.136 325.661)', hex: '#4a044e' }, /* audit-ignore */
    ]
  },
  {
    name: 'Pink',
    slug: 'pink',
    group: 'Vibrant & Violet',
    description: 'Playful rose-pink — useful for creative tags, events, and social engagement badges.',
    shades: [
      { step: '50', oklch: 'oklch(0.971 0.014 343.198)', hex: '#fdf2f8' }, /* audit-ignore */
      { step: '100', oklch: 'oklch(0.948 0.028 342.258)', hex: '#fce7f3' }, /* audit-ignore */
      { step: '200', oklch: 'oklch(0.899 0.061 343.231)', hex: '#fbcfe8' }, /* audit-ignore */
      { step: '300', oklch: 'oklch(0.823 0.12 346.018)', hex: '#f9a8d4' }, /* audit-ignore */
      { step: '400', oklch: 'oklch(0.718 0.202 349.761)', hex: '#f472b6' }, /* audit-ignore */
      { step: '500', oklch: 'oklch(0.656 0.241 354.308)', hex: '#ec4899' }, /* audit-ignore */
      { step: '600', oklch: 'oklch(0.592 0.249 0.584)', hex: '#db2777' }, /* audit-ignore */
      { step: '700', oklch: 'oklch(0.525 0.223 3.958)', hex: '#be185d' }, /* audit-ignore */
      { step: '800', oklch: 'oklch(0.459 0.187 3.815)', hex: '#9d174d' }, /* audit-ignore */
      { step: '900', oklch: 'oklch(0.408 0.153 2.432)', hex: '#831843' }, /* audit-ignore */
      { step: '950', oklch: 'oklch(0.284 0.109 3.907)', hex: '#500724' }, /* audit-ignore */
    ]
  },
  {
    name: 'Rose',
    slug: 'rose',
    group: 'Vibrant & Violet',
    description: 'Warm coral-crimson — powers RakanSales --tag-5 (Stage: Follow Up).',
    isSystemFamily: true,
    shades: [
      { step: '50', oklch: 'oklch(0.969 0.015 12.422)', hex: '#fff1f2' }, /* audit-ignore */
      { step: '100', oklch: 'oklch(0.941 0.03 12.58)', hex: '#ffe4e6', systemTokenMatch: '--tag-5 (:root)' }, /* audit-ignore */
      { step: '200', oklch: 'oklch(0.892 0.058 10.001)', hex: '#fecdd3' }, /* audit-ignore */
      { step: '300', oklch: 'oklch(0.81 0.117 11.638)', hex: '#fda4af' }, /* audit-ignore */
      { step: '400', oklch: 'oklch(0.712 0.194 13.428)', hex: '#fb7185' }, /* audit-ignore */
      { step: '500', oklch: 'oklch(0.645 0.246 16.439)', hex: '#f43f5e' }, /* audit-ignore */
      { step: '600', oklch: 'oklch(0.586 0.253 17.585)', hex: '#e11d48' }, /* audit-ignore */
      { step: '700', oklch: 'oklch(0.514 0.222 16.935)', hex: '#be123c' }, /* audit-ignore */
      { step: '800', oklch: 'oklch(0.455 0.188 13.697)', hex: '#9f1239' }, /* audit-ignore */
      { step: '900', oklch: 'oklch(0.41 0.159 10.272)', hex: '#881337' }, /* audit-ignore */
      { step: '950', oklch: 'oklch(0.271 0.105 12.094)', hex: '#4c0519', systemTokenMatch: '--tag-5 (.dark)' }, /* audit-ignore */
    ]
  },
]
