<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTheme } from '@/composables/useTheme'
import { toast } from 'vue-sonner'
import {
  SEMANTIC_TOKENS,
  SEMANTIC_TOKEN_CATEGORIES,
  TAILWIND_V4_PALETTE,
  type SemanticTokenSpec,
  type TailwindShadeSpec,
} from '@/data/colorTokensData'
import { rakanSalesGuidelinesMarkdown } from '@/data/designSystemGuidelines'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  Sun,
  Moon,
  Copy,
  Check,
  Search,
  Palette,
  Layers,
  Type,
  Box,
  ShieldCheck,
  Sparkles,
  RotateCcw,
  ArrowUpRight,
  Sliders,
  Eye,
  Code2,
  Terminal,
  Contrast,
  Grid,
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
  PanelLeft,
  LayoutGrid,
  FileCode2,
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const { isDark, toggleTheme } = useTheme()

// Navigation sections within Foundation & Token Studio
const activeSection = ref<'overview' | 'comparator' | 'tailwind' | 'typography' | 'prompt'>('comparator')

const sections = [
  { id: 'overview', label: 'Overview', icon: Layers },
  { id: 'comparator', label: 'Light vs Dark Tokens', icon: Contrast },
  { id: 'tailwind', label: 'Tailwind Colors', icon: Palette },
  { id: 'typography', label: 'Type, Space & Shadows', icon: Type },
  { id: 'prompt', label: 'AI Prompt', icon: Terminal },
] as const

// Semantic Token Comparator state
const selectedCategory = ref<string>('all')
const tokenSearch = ref('')
const tokenDisplayFormat = ref<'class' | 'var' | 'oklch' | 'hex'>('class')
const copiedKey = ref<string | null>(null)

// Live Token Studio state (allows testing any Tailwind v4 color on a semantic token in real-time!)
const activeStudioToken = ref<string>('--primary')
const studioTargetOptions = [
  { cssVar: '--primary', label: 'Primary Action (--primary)' },
  { cssVar: '--brand', label: 'Brand Accent (--brand)' },
  { cssVar: '--stage-1', label: 'Stage 1: New (--stage-1)' },
  { cssVar: '--stage-2', label: 'Stage 2: Acknowledged (--stage-2)' },
  { cssVar: '--stage-3', label: 'Stage 3: Qualifying (--stage-3)' },
  { cssVar: '--stage-4', label: 'Stage 4: Proposal (--stage-4)' },
  { cssVar: '--stage-5', label: 'Stage 5: Follow Up (--stage-5)' },
  { cssVar: '--stage-6', label: 'Stage 6: Purple (--stage-6)' },
  { cssVar: '--stage-7', label: 'Stage 7: Magenta (--stage-7)' },
  { cssVar: '--stage-8', label: 'Stage 8: Lime (--stage-8)' },
  { cssVar: '--chart-1', label: 'Chart 1: Royal Blue (--chart-1)' },
  { cssVar: '--chart-2', label: 'Chart 2: Cyan (--chart-2)' },
  { cssVar: '--chart-3', label: 'Chart 3: Gold (--chart-3)' },
  { cssVar: '--chart-4', label: 'Chart 4: Purple (--chart-4)' },
  { cssVar: '--chart-5', label: 'Chart 5: Sky Blue (--chart-5)' },
  { cssVar: '--chart-6', label: 'Chart 6: Magenta (--chart-6)' },
  { cssVar: '--chart-7', label: 'Chart 7: Orange (--chart-7)' },
  { cssVar: '--chart-8', label: 'Chart 8: Lime (--chart-8)' },
  { cssVar: '--success', label: 'Success Status (--success)' },
  { cssVar: '--warning', label: 'Warning Status (--warning)' },
  { cssVar: '--info', label: 'Info Status (--info)' },
  { cssVar: '--destructive', label: 'Destructive (--destructive)' },
  { cssVar: '--card', label: 'Card Surface (--card)' },
  { cssVar: '--background', label: 'Page Canvas (--background)' },
]
const customTokenOverrides = ref<Record<string, { oklch: string; hex: string; label: string }>>({})

const filteredSemanticTokens = computed(() => {
  return SEMANTIC_TOKENS.filter((token) => {
    const matchesCategory = selectedCategory.value === 'all' || token.category === selectedCategory.value
    const q = tokenSearch.value.trim().toLowerCase()
    const matchesQuery =
      !q ||
      token.name.toLowerCase().includes(q) ||
      token.cssVar.toLowerCase().includes(q) ||
      token.twBgClass.toLowerCase().includes(q) ||
      token.usage.toLowerCase().includes(q) ||
      token.tailwindMatchLight.toLowerCase().includes(q) ||
      token.tailwindMatchDark.toLowerCase().includes(q)
    return matchesCategory && matchesQuery
  })
})

// Tailwind v4 Color Library state
const selectedPaletteGroup = ref<string>('All')
const paletteSearch = ref('')
const tailwindCopyMode = ref<'tw-bg' | 'tw-text' | 'oklch' | 'hex' | 'assign'>('tw-bg')
const showOnlySystemFamilies = ref(false)

const paletteGroups = ['All', 'Neutral & Slate', 'Emerald & Brand', 'Warm & Alert', 'Cool & Info', 'Vibrant & Violet']

const filteredTailwindFamilies = computed(() => {
  return TAILWIND_V4_PALETTE.filter((family) => {
    const matchesGroup = selectedPaletteGroup.value === 'All' || family.group === selectedPaletteGroup.value
    const matchesSys = !showOnlySystemFamilies.value || family.isSystemFamily
    const q = paletteSearch.value.trim().toLowerCase()
    const matchesSearch =
      !q ||
      family.name.toLowerCase().includes(q) ||
      family.description.toLowerCase().includes(q) ||
      family.shades.some(
        (s) =>
          s.hex.toLowerCase().includes(q) ||
          s.oklch.toLowerCase().includes(q) ||
          (s.systemTokenMatch && s.systemTokenMatch.toLowerCase().includes(q))
      )
    return matchesGroup && matchesSys && matchesSearch
  })
})

// Shadow & Radius live controls
const shadowsEnabled = ref(true)
const activeRadiusRem = ref('0.3rem')
const radiusPresets = [
  { label: 'Sharp (0rem)', value: '0rem', px: '0px' },
  { label: 'Crisp Default (0.3rem)', value: '0.3rem', px: '4.8px' },
  { label: 'Balanced (0.5rem)', value: '0.5rem', px: '8px' },
  { label: 'Soft (0.75rem)', value: '0.75rem', px: '12px' },
]

function setGlobalRadius(val: string) {
  activeRadiusRem.value = val
  document.documentElement.style.setProperty('--radius', val)
  toast.success(`Global --radius updated to ${val}`)
}

function toggleGlobalShadows(enabled: boolean) {
  shadowsEnabled.value = enabled
  const root = document.documentElement
  if (!enabled) {
    root.style.setProperty('--rks-shadow-sm', 'none')
    root.style.setProperty('--rks-shadow', 'none')
    root.style.setProperty('--rks-shadow-md', 'none')
    root.style.setProperty('--rks-shadow-lg', 'none')
    toast.info('Flat border-only mode enabled (--rks-shadow-* set to none)')
  } else {
    root.style.removeProperty('--rks-shadow-sm')
    root.style.removeProperty('--rks-shadow')
    root.style.removeProperty('--rks-shadow-md')
    root.style.removeProperty('--rks-shadow-lg')
    toast.success('Diffused elevation shadows restored')
  }
}

// Copy & Live Token Assignment Helpers
async function copyText(value: string, label?: string) {
  try {
    await navigator.clipboard.writeText(value)
    copiedKey.value = value
    toast.success(`Copied ${label || value}`, {
      description: value.length > 80 ? value.slice(0, 80) + '...' : value,
    })
    setTimeout(() => {
      if (copiedKey.value === value) copiedKey.value = null
    }, 1800)
  } catch {
    toast.error('Clipboard copy failed')
  }
}

function formatTokenValue(token: SemanticTokenSpec, mode: 'light' | 'dark'): string {
  if (tokenDisplayFormat.value === 'class') return token.twBgClass
  if (tokenDisplayFormat.value === 'var') return `var(${token.cssVar})`
  if (tokenDisplayFormat.value === 'oklch') return mode === 'light' ? token.lightOklch : token.darkOklch
  return mode === 'light' ? token.lightHex : token.darkHex
}

function assignTailwindShadeToToken(familySlug: string, shade: TailwindShadeSpec, targetVar = activeStudioToken.value) {
  document.documentElement.style.setProperty(targetVar, shade.oklch)
  customTokenOverrides.value[targetVar] = {
    oklch: shade.oklch,
    hex: shade.hex,
    label: `${familySlug}-${shade.step}`,
  }
  toast.success(`Live-assigned ${familySlug}-${shade.step} to ${targetVar}`, {
    description: `${targetVar}: ${shade.oklch} (${shade.hex})`,
  })
}

function handleShadeClick(familySlug: string, shade: TailwindShadeSpec) {
  if (tailwindCopyMode.value === 'assign') {
    assignTailwindShadeToToken(familySlug, shade)
    return
  }
  let output = ''
  if (tailwindCopyMode.value === 'tw-bg') output = `bg-${familySlug}-${shade.step}`
  else if (tailwindCopyMode.value === 'tw-text') output = `text-${familySlug}-${shade.step}`
  else if (tailwindCopyMode.value === 'oklch') output = shade.oklch
  else output = shade.hex

  copyText(output, `${familySlug}-${shade.step}`)
}

function resetTokenOverrides() {
  Object.keys(customTokenOverrides.value).forEach((cssVar) => {
    document.documentElement.style.removeProperty(cssVar)
  })
  customTokenOverrides.value = {}
  document.documentElement.style.removeProperty('--radius')
  activeRadiusRem.value = '0.3rem'
  if (!shadowsEnabled.value) toggleGlobalShadows(true)
  toast.info('Reset all live token overrides to index.css defaults')
}

function copyOverridesCssBlock() {
  const entries = Object.entries(customTokenOverrides.value)
  if (!entries.length) {
    copyText(`/* All tokens currently match src/assets/index.css defaults */`, 'CSS Block')
    return
  }
  const selector = isDark.value ? '.dark' : ':root'
  const lines = entries.map(([k, v]) => `  ${k}: ${v.oklch}; /* ${v.label} (${v.hex}) */`)
  const cssBlock = `${selector} {\n${lines.join('\n')}\n}`
  copyText(cssBlock, 'Custom CSS Variables Block')
}

// Determine readable text color on a Tailwind shade step (50-400 dark text, 500-950 light text)
function getShadeForegroundOklch(step: string): string {
  const numeric = Number(step)
  return numeric <= 400 ? 'oklch(0.145 0 0)' : 'oklch(0.985 0 0)'
}

const typographySpecs = [
  {
    role: 'Page Display Heading',
    sample: 'Pipeline Revenue RM 1,428,900',
    classes: 'text-2xl font-bold tracking-tight text-foreground',
    size: '24px / 1.5rem',
    weight: '700 (font-bold — System Maximum)',
    usage: 'Top-level route headers and primary dashboard KPI callouts.',
  },
  {
    role: 'Section & Drawer Header',
    sample: 'Omnichannel SLA Performance',
    classes: 'text-base font-bold tracking-tight text-foreground',
    size: '16px / 1rem',
    weight: '700 (font-bold)',
    usage: 'Major workspace section titles, modal headers, and drawer titles.',
  },
  {
    role: 'Card & Widget Title',
    sample: 'Active WhatsApp Conversations',
    classes: 'text-sm font-semibold text-foreground',
    size: '14px / 0.875rem',
    weight: '600 (font-semibold)',
    usage: 'Card headers, dialog subheadings, and active navigation groups.',
  },
  {
    role: 'Standard Body Copy',
    sample: 'All incoming leads from Meta Ads and WhatsApp Business are routed automatically.',
    classes: 'text-xs text-muted-foreground leading-relaxed',
    size: '12px / 0.75rem',
    weight: '400 (font-normal)',
    usage: 'Default descriptions, form helper text, and chat message previews.',
  },
  {
    role: 'High-Density Table & Control',
    sample: 'Synergy Tech Sdn Bhd • Assigned to Ahmad Faizal',
    classes: 'text-xs font-medium text-foreground',
    size: '12px / 0.75rem',
    weight: '500 (font-medium)',
    usage: 'Data table cells, input values, button labels, and select triggers.',
  },
  {
    role: 'Tabular Monospace Numerals',
    sample: 'RM 94,500.00 • 00:04:12 SLA • #INV-2026-089',
    classes: 'font-mono text-xs font-semibold tabular-nums text-foreground',
    size: '12px / 0.75rem',
    weight: '600 (font-semibold + tabular-nums)',
    usage: 'Currency values, SLA countdown timers, phone numbers, and token codes.',
  },
]

const spacingScale = [
  { token: 'p-1 / gap-1', rem: '0.25rem', px: '4px', usage: 'Inline icon-to-badge micro gap' },
  { token: 'p-1.5 / gap-1.5', rem: '0.375rem', px: '6px', usage: 'Compact pill & sidebar item padding' },
  { token: 'p-2 / gap-2', rem: '0.5rem', px: '8px', usage: 'Standard button icon gap & dense row spacing' },
  { token: 'p-3 / gap-3', rem: '0.75rem', px: '12px', usage: 'Kanban card padding & form control spacing' },
  { token: 'p-4 / gap-4', rem: '1.0rem', px: '16px', usage: 'Standard card content padding & grid gap' },
  { token: 'p-6 / gap-6', rem: '1.5rem', px: '24px', usage: 'Page canvas padding & major section rhythm' },
]
</script>

<template>
  <!-- THESIS: RakanSales Nova v4.0 Foundation & Token Studio — an interactive specification matrix where designers and developers inspect Light/Dark semantic tokens side-by-side and live-test the complete 22-family Tailwind CSS v4 color library.
       OWN-WORLD: High-density B2B sales workspace with invariant dark outer rail (--rail), crisp 1px borders (--border), and RakanSales vibrant green (--primary / --brand).
       STORY: 1. System Overview & Architecture -> 2. Side-by-Side Light vs Dark Semantic Token Comparator -> 3. Full 22-Family Tailwind v4 Color Matrix & Live Token Studio -> 4. Typography, Spacing & Elevation -> 5. Developer & AI System Prompt.
       FIRST VIEWPORT: Unified Design System header bar with global Light/Dark switcher, Live Token Studio bar, and immediate side-by-side Light/Dark token matrix.
       FORM: Seed key 8a9c6c30 — dealt structure index 5 leading (Interactive Specification Matrix & Live Token/Component Workbench).
       FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md -->
  <div class="h-full flex-1 min-h-0 overflow-y-auto bg-background text-foreground flex flex-col">
    <!-- Top Unified Design System & Guidelines Header -->
    <header class="sticky top-0 z-30 bg-card/95 backdrop-blur border-b border-border px-4 lg:px-6 py-3">
      <div class="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-3">
        <!-- Left: Title & Route Switcher -->
        <div class="flex items-center gap-3">
          <div class="size-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <Palette class="size-4" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-base font-bold tracking-tight text-foreground">
                RakanSales Design Foundation &amp; Token Studio
              </h1>
              <Badge variant="muted">Nova v4.0</Badge>
            </div>
            <p class="text-xs text-muted-foreground">
              Single source of truth for semantic Light/Dark CSS variables, Tailwind CSS v4 color palette, and system architecture.
            </p>
          </div>
        </div>

        <!-- Center/Right: Dual-Page Switcher & Global Theme Controls -->
        <div class="flex flex-wrap items-center gap-2">
          <!-- Route Switcher between /guidelines and /design-system -->
          <div class="inline-flex items-center rounded-lg bg-muted p-1 border border-border">
            <button
              type="button"
              @click="router.push('/guidelines')"
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer"
              :class="route.path === '/guidelines' ? 'bg-card text-foreground shadow-soft' : 'text-muted-foreground hover:text-foreground'"
            >
              <Palette class="size-3.5 text-primary" />
              Foundation &amp; Colors
            </button>
            <button
              type="button"
              @click="router.push('/design-system')"
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer"
              :class="route.path === '/design-system' ? 'bg-card text-foreground shadow-soft' : 'text-muted-foreground hover:text-foreground'"
            >
              <LayoutGrid class="size-3.5" />
              Component Workbench
              <ArrowUpRight class="size-3 opacity-60" />
            </button>
          </div>

          <!-- Global Theme Toggle -->
          <Button
            variant="outline"
            size="sm"
            @click="toggleTheme"
            class="gap-1.5 font-semibold"
          >
            <Sun v-if="!isDark" class="size-3.5 text-warning" />
            <Moon v-else class="size-3.5 text-info" />
            <span>Active Theme: {{ isDark ? 'Dark (.dark)' : 'Light (:root)' }}</span>
          </Button>

          <!-- Reset Overrides (if any active) -->
          <Button
            v-if="Object.keys(customTokenOverrides).length > 0"
            variant="secondary"
            size="sm"
            @click="resetTokenOverrides"
            class="gap-1.5"
          >
            <RotateCcw class="size-3.5" />
            Reset ({{ Object.keys(customTokenOverrides).length }})
          </Button>

          <!-- Copy System Prompt -->
          <Button
            variant="default"
            size="sm"
            @click="copyText(rakanSalesGuidelinesMarkdown, 'Nova v4.0 System Prompt')"
            class="gap-1.5"
          >
            <Copy class="size-3.5" />
            Copy AI Prompt
          </Button>
        </div>
      </div>

      <!-- Section Sub-Navigation Bar -->
      <div class="max-w-[1600px] mx-auto mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between gap-2 overflow-x-auto">
        <div class="flex items-center gap-1">
          <button
            v-for="sec in sections"
            :key="sec.id"
            type="button"
            @click="activeSection = sec.id"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all whitespace-nowrap cursor-pointer"
            :class="
              activeSection === sec.id
                ? 'bg-primary text-primary-foreground shadow-soft'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            "
          >
            <component :is="sec.icon" class="size-3.5" />
            <span>{{ sec.label }}</span>
          </button>
        </div>

        <!-- Live Studio Active Target Indicator -->
        <div class="hidden xl:flex items-center gap-2 text-xs">
          <span class="text-muted-foreground">Live Token Target:</span>
          <select
            v-model="activeStudioToken"
            aria-label="Live Token Studio target variable"
            class="h-7 rounded-md border border-input bg-background px-2 text-xs font-mono font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
          >
            <option v-for="opt in studioTargetOptions" :key="opt.cssVar" :value="opt.cssVar">
              {{ opt.label }}
            </option>
          </select>
          <Button
            v-if="Object.keys(customTokenOverrides).length > 0"
            variant="outline"
            size="xs"
            @click="copyOverridesCssBlock"
          >
            <Code2 class="size-3" />
            Copy Custom CSS
          </Button>
        </div>
      </div>
    </header>

    <!-- Main Workspace Body -->
    <main class="flex-1 max-w-[1600px] w-full mx-auto p-4 lg:p-6 space-y-6">
      <!-- =====================================================================
           SECTION 1: SYSTEM OVERVIEW & ARCHITECTURE BLUEPRINT
           ===================================================================== -->
      <section v-if="activeSection === 'overview'" class="space-y-6">
        <!-- Quick Metric Strip -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card class="p-4 flex items-start justify-between">
            <div class="space-y-1">
              <span class="text-xs font-medium text-muted-foreground">Semantic CSS Variables</span>
              <div class="text-2xl font-bold font-mono tabular-nums text-foreground">37 Tokens</div>
              <p class="text-[11px] text-muted-foreground">Dual-mapped in <code class="font-mono text-foreground">:root</code> &amp; <code class="font-mono text-foreground">.dark</code></p>
            </div>
            <div class="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Contrast class="size-4" />
            </div>
          </Card>

          <Card class="p-4 flex items-start justify-between">
            <div class="space-y-1">
              <span class="text-xs font-medium text-muted-foreground">Tailwind CSS v4 Library</span>
              <div class="text-2xl font-bold font-mono tabular-nums text-foreground">22 Families</div>
              <p class="text-[11px] text-muted-foreground">242 official OKLCH &amp; Hex shades (50–950)</p>
            </div>
            <div class="size-9 rounded-lg bg-info/10 text-info flex items-center justify-center">
              <Palette class="size-4" />
            </div>
          </Card>

          <Card class="p-4 flex items-start justify-between">
            <div class="space-y-1">
              <span class="text-xs font-medium text-muted-foreground">UI Component Primitives</span>
              <div class="text-2xl font-bold font-mono tabular-nums text-foreground">51 Modules</div>
              <p class="text-[11px] text-muted-foreground">Refined Shadcn/Vue + Reka UI in <code class="font-mono text-foreground">@/components/ui</code></p>
            </div>
            <div class="size-9 rounded-lg bg-success/10 text-success flex items-center justify-center">
              <Box class="size-4" />
            </div>
          </Card>

          <Card class="p-4 flex items-start justify-between">
            <div class="space-y-1">
              <span class="text-xs font-medium text-muted-foreground">Token Audit Gate</span>
              <div class="text-2xl font-bold font-mono tabular-nums text-success">0 Violations</div>
              <p class="text-[11px] text-muted-foreground">Enforced via <code class="font-mono text-foreground">scripts/audit-tokens.cjs</code></p>
            </div>
            <div class="size-9 rounded-lg bg-warning/10 text-warning flex items-center justify-center">
              <ShieldCheck class="size-4" />
            </div>
          </Card>
        </div>

        <!-- Architecture & Philosophy Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- Left 7 cols: Interactive AppShell Architecture Blueprint -->
          <Card class="lg:col-span-7 p-5 space-y-4">
            <div class="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h2 class="text-sm font-bold text-foreground">Dual-Rail AppShell Architecture</h2>
                <p class="text-xs text-muted-foreground">
                  Every route renders inside <code class="font-mono text-foreground">AppShell.vue</code> with an invariant dark outer rail and adaptive content canvas.
                </p>
              </div>
              <Badge variant="outline" class="font-mono">AppShell.vue</Badge>
            </div>

            <!-- Visual Miniature Diagram of AppShell -->
            <div class="rounded-xl border border-border overflow-hidden bg-background shadow-soft">
              <div class="flex h-64">
                <!-- 1. Invariant Outer Rail -->
                <div class="w-16 bg-rail text-rail-foreground border-r border-rail-border p-2 flex flex-col justify-between shrink-0">
                  <div class="space-y-2">
                    <div class="size-8 mx-auto rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">
                      R
                    </div>
                    <div class="h-7 rounded-md bg-rail-active flex items-center justify-center text-[10px] font-mono text-rail-foreground">
                      Active
                    </div>
                    <div class="h-7 rounded-md flex items-center justify-center text-[10px] font-mono text-rail-muted-foreground">
                      Icon
                    </div>
                    <div class="h-7 rounded-md flex items-center justify-center text-[10px] font-mono text-rail-muted-foreground">
                      Icon
                    </div>
                  </div>
                  <div class="text-[9px] font-mono text-center text-rail-muted-foreground leading-tight">
                    --rail<br />(Invariant)
                  </div>
                </div>

                <!-- 2. Secondary Contextual Sidebar -->
                <div class="w-40 bg-sidebar text-sidebar-foreground border-r border-sidebar-border p-3 flex flex-col justify-between shrink-0">
                  <div class="space-y-2">
                    <div class="text-[11px] font-bold text-sidebar-foreground flex items-center justify-between">
                      <span>SecondaryPanel</span>
                      <span class="font-mono text-[9px] text-muted-foreground">220px</span>
                    </div>
                    <div class="px-2 py-1.5 rounded bg-primary/10 text-primary text-[11px] font-semibold">
                      Active Sub-Route
                    </div>
                    <div class="px-2 py-1.5 rounded bg-sidebar-accent text-sidebar-accent-foreground text-[11px]">
                      Hovered Item
                    </div>
                    <div class="px-2 py-1.5 text-[11px] text-muted-foreground">
                      Default Item
                    </div>
                  </div>
                  <div class="text-[10px] font-mono text-muted-foreground">
                    bg-sidebar / border-sidebar-border
                  </div>
                </div>

                <!-- 3. Main Content Area -->
                <div class="flex-1 flex flex-col bg-background">
                  <!-- TopNav -->
                  <div class="h-10 bg-rail border-b border-rail-border px-3 flex items-center justify-between text-[11px]">
                    <span class="font-semibold text-rail-foreground">TopNav.vue (h-14)</span>
                    <span class="font-mono text-rail-muted-foreground">bg-rail border-rail-border</span>
                  </div>
                  <!-- Canvas -->
                  <div class="flex-1 p-3 space-y-2.5 overflow-hidden">
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-bold text-foreground">MainLayout Canvas (bg-background)</span>
                      <Badge variant="success">Adaptive Light/Dark</Badge>
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                      <div class="rounded-lg border border-border bg-card p-2.5">
                        <div class="text-[10px] text-muted-foreground">Card Surface</div>
                        <div class="text-xs font-bold font-mono text-foreground mt-0.5">bg-card / border-border</div>
                      </div>
                      <div class="rounded-lg border border-border bg-muted p-2.5">
                        <div class="text-[10px] text-muted-foreground">Recessed Well</div>
                        <div class="text-xs font-bold font-mono text-foreground mt-0.5">bg-muted / text-muted-foreground</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div class="p-3 rounded-lg bg-muted/50 border border-border">
                <div class="text-xs font-bold text-foreground">1. Outer Rail (<code class="font-mono">Sidebar.vue</code>)</div>
                <p class="text-[11px] text-muted-foreground mt-1">
                  Stays deep dark (<code class="font-mono">bg-rail</code>) in both Light and Dark mode to anchor workspace hierarchy.
                </p>
              </div>
              <div class="p-3 rounded-lg bg-muted/50 border border-border">
                <div class="text-xs font-bold text-foreground">2. Sub-Panel (<code class="font-mono">SecondaryPanel.vue</code>)</div>
                <p class="text-[11px] text-muted-foreground mt-1">
                  Contextual drawer (<code class="font-mono">bg-sidebar</code>) that adapts cleanly between light and dark themes.
                </p>
              </div>
              <div class="p-3 rounded-lg bg-muted/50 border border-border">
                <div class="text-xs font-bold text-foreground">3. Canvas (<code class="font-mono">MainLayout.vue</code>)</div>
                <p class="text-[11px] text-muted-foreground mt-1">
                  High-density workspace using <code class="font-mono">bg-background</code> and elevated <code class="font-mono">bg-card</code> containers.
                </p>
              </div>
            </div>
          </Card>

          <!-- Right 5 cols: The 4 Non-Negotiable Governance Rules -->
          <Card class="lg:col-span-5 p-5 flex flex-col justify-between space-y-4">
            <div class="space-y-3">
              <div class="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h2 class="text-sm font-bold text-foreground">Design &amp; Engineering Rules</h2>
                  <p class="text-xs text-muted-foreground">How designers &amp; developers collaborate in RakanSales C4.</p>
                </div>
                <Badge variant="default">Strict Policy</Badge>
              </div>

              <div class="space-y-2.5">
                <div class="p-3 rounded-lg border border-border bg-background flex items-start gap-3">
                  <CheckCircle2 class="size-4 text-success shrink-0 mt-0.5" />
                  <div class="space-y-0.5">
                    <div class="text-xs font-bold text-foreground">1. Single Source of Truth (<code class="font-mono">src/assets/index.css</code>)</div>
                    <p class="text-[11px] text-muted-foreground">
                      Never hardcode raw Tailwind grays, hex codes, or <code class="font-mono">dark:*</code> overrides in components. Change the CSS variable in <code class="font-mono">index.css</code> and every page updates automatically.
                    </p>
                  </div>
                </div>

                <div class="p-3 rounded-lg border border-border bg-background flex items-start gap-3">
                  <CheckCircle2 class="size-4 text-success shrink-0 mt-0.5" />
                  <div class="space-y-0.5">
                    <div class="text-xs font-bold text-foreground">2. Semantic Status &amp; Opacity Modifiers</div>
                    <p class="text-[11px] text-muted-foreground">
                      Use <code class="font-mono">bg-success/10 text-success border-success/20</code> for soft status pills, and <code class="font-mono">bg-tag-1 text-tag-1-foreground</code> for pipeline stages.
                    </p>
                  </div>
                </div>

                <div class="p-3 rounded-lg border border-border bg-background flex items-start gap-3">
                  <CheckCircle2 class="size-4 text-success shrink-0 mt-0.5" />
                  <div class="space-y-0.5">
                    <div class="text-xs font-bold text-foreground">3. Typography Ceiling (<code class="font-mono">font-bold</code> Max)</div>
                    <p class="text-[11px] text-muted-foreground">
                      Use <code class="font-mono">Inter Variable</code> with <code class="font-mono">font-bold</code> (700) as the maximum weight. Never use <code class="font-mono">font-extrabold</code> or <code class="font-mono">font-black</code>. Use <code class="font-mono">tabular-nums</code> on metrics.
                    </p>
                  </div>
                </div>

                <div class="p-3 rounded-lg border border-border bg-background flex items-start gap-3">
                  <CheckCircle2 class="size-4 text-success shrink-0 mt-0.5" />
                  <div class="space-y-0.5">
                    <div class="text-xs font-bold text-foreground">4. Navigation Registration on New Pages</div>
                    <p class="text-[11px] text-muted-foreground">
                      Every new view added to <code class="font-mono">src/views/</code> must be registered in <code class="font-mono">Sidebar.vue</code> or <code class="font-mono">SecondaryPanel.vue</code> and verified in both Light &amp; Dark mode.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="pt-2 border-t border-border flex items-center justify-between gap-2">
              <Button variant="outline" size="sm" @click="activeSection = 'comparator'">
                Inspect Light vs Dark Tokens
              </Button>
              <Button variant="default" size="sm" @click="router.push('/design-system')">
                Open Component Workbench
                <ArrowUpRight class="size-3.5" />
              </Button>
            </div>
          </Card>
        </div>
      </section>

      <!-- =====================================================================
           SECTION 2: SIDE-BY-SIDE LIGHT VS DARK SEMANTIC TOKEN COMPARATOR
           ===================================================================== -->
      <section v-if="activeSection === 'comparator'" class="space-y-5">
        <!-- Controls Bar -->
        <Card class="p-4">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <!-- Category Filter Pills -->
            <div class="flex flex-wrap items-center gap-1.5">
              <button
                v-for="cat in SEMANTIC_TOKEN_CATEGORIES"
                :key="cat.id"
                type="button"
                @click="selectedCategory = cat.id"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer"
                :class="
                  selectedCategory === cat.id
                    ? 'bg-primary text-primary-foreground shadow-soft'
                    : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
                "
              >
                <span>{{ cat.label }}</span>
                <span
                  class="px-1.5 py-0.2 rounded text-[10px] font-mono"
                  :class="selectedCategory === cat.id ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-background text-muted-foreground'"
                >
                  {{ cat.count }}
                </span>
              </button>
            </div>

            <!-- Right: Search + Copy Format Switcher -->
            <div class="flex flex-wrap items-center gap-2">
              <div class="relative w-full sm:w-64">
                <Search class="size-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  v-model="tokenSearch"
                  placeholder="Search token, class, or Tailwind shade..."
                  class="pl-8 h-8 text-xs"
                />
              </div>

              <div class="inline-flex items-center rounded-md bg-muted p-0.5 border border-border text-xs">
                <button
                  v-for="fmt in [
                    { id: 'class', label: 'Class' },
                    { id: 'var', label: 'CSS Var' },
                    { id: 'oklch', label: 'OKLCH' },
                    { id: 'hex', label: 'Hex' },
                  ]"
                  :key="fmt.id"
                  type="button"
                  @click="tokenDisplayFormat = fmt.id as any"
                  class="px-2.5 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer"
                  :class="tokenDisplayFormat === fmt.id ? 'bg-card text-foreground shadow-soft' : 'text-muted-foreground hover:text-foreground'"
                >
                  {{ fmt.label }}
                </button>
              </div>
            </div>
          </div>
        </Card>

        <!-- Side-by-Side Light vs Dark UI Mini-Preview Strip -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <!-- Simulated Light Mode Preview Card -->
          <div
            class="rounded-xl border border-border p-4 space-y-3 shadow-soft"
            :style="{ backgroundColor: 'oklch(0.984 0.003 247.858)', color: 'oklch(0.208 0.042 265.755)' }"
          >
            <div class="flex items-center justify-between border-b pb-2.5" :style="{ borderColor: 'oklch(0.929 0.013 255.508)' }">
              <div class="flex items-center gap-2">
                <Sun class="size-4" :style="{ color: 'oklch(0.769 0.188 70.08)' }" />
                <span class="text-xs font-bold">Light Mode Surface Preview (<code class="font-mono">:root</code>)</span>
              </div>
              <span
                class="px-2 py-0.5 rounded text-[10px] font-mono font-semibold"
                :style="{ backgroundColor: 'oklch(0.968 0.007 247.896)', color: 'oklch(0.554 0.046 257.417)' }"
              >
                --background: #F8FAFC (Slate 50)
              </span>
            </div>

            <div class="grid grid-cols-3 gap-2.5">
              <div class="p-2.5 rounded-lg border" :style="{ backgroundColor: 'oklch(1 0 0)', borderColor: 'oklch(0.929 0.013 255.508)' }">
                <div class="text-[10px]" :style="{ color: 'oklch(0.554 0.046 257.417)' }">Monthly Pipeline</div>
                <div class="text-sm font-bold font-mono mt-0.5">RM 428,000</div>
              </div>
              <div class="p-2.5 rounded-lg" :style="{ backgroundColor: 'oklch(0.627 0.194 149.214)', color: 'oklch(0.982 0.018 155.826)' }">
                <div class="text-[10px] opacity-85">Primary Action (--brand)</div>
                <div class="text-xs font-bold font-mono mt-0.5">Green 600 (4.5:1)</div>
              </div>
              <div class="p-2.5 rounded-lg" :style="{ backgroundColor: 'oklch(0.129 0.042 264.695)', color: 'oklch(0.984 0.003 247.858)' }">
                <div class="text-[10px] opacity-75">Rail &amp; TopNav</div>
                <div class="text-xs font-bold font-mono mt-0.5">Slate 950 (--rail)</div>
              </div>
            </div>
          </div>

          <!-- Simulated Dark Mode Preview Card -->
          <div
            class="rounded-xl border border-border p-4 space-y-3 shadow-soft"
            :style="{ backgroundColor: 'oklch(0.141 0.005 285.823)', color: 'oklch(0.985 0 0)' }"
          >
            <div class="flex items-center justify-between border-b pb-2.5" :style="{ borderColor: 'oklch(0.274 0.006 286.033)' }">
              <div class="flex items-center gap-2">
                <Moon class="size-4" :style="{ color: 'oklch(0.68 0.16 250)' }" />
                <span class="text-xs font-bold">Dark Mode Surface Preview (<code class="font-mono">.dark</code>)</span>
              </div>
              <span
                class="px-2 py-0.5 rounded text-[10px] font-mono font-semibold"
                :style="{ backgroundColor: 'oklch(0.274 0.006 286.033)', color: 'oklch(0.705 0.015 286.067)' }"
              >
                --background: #09090B (Zinc 950)
              </span>
            </div>

            <div class="grid grid-cols-3 gap-2.5">
              <div class="p-2.5 rounded-lg border" :style="{ backgroundColor: 'oklch(0.21 0.006 285.885)', borderColor: 'oklch(0.274 0.006 286.033)' }">
                <div class="text-[10px]" :style="{ color: 'oklch(0.705 0.015 286.067)' }">Monthly Pipeline</div>
                <div class="text-sm font-bold font-mono mt-0.5">RM 428,000</div>
              </div>
              <div class="p-2.5 rounded-lg" :style="{ backgroundColor: 'oklch(0.65 0.18 149.2)', color: 'oklch(0.982 0.018 155.826)' }">
                <div class="text-[10px] opacity-85">Primary Action (--brand)</div>
                <div class="text-xs font-bold font-mono mt-0.5">Green 500 (4.6:1)</div>
              </div>
              <div class="p-2.5 rounded-lg" :style="{ backgroundColor: 'oklch(0.141 0.005 285.823)', color: 'oklch(0.985 0 0)' }">
                <div class="text-[10px] opacity-75">Rail &amp; TopNav</div>
                <div class="text-xs font-bold font-mono mt-0.5">Zinc 950 (--rail)</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Side-by-Side Comparison Matrix Table -->
        <Card class="overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-border bg-muted/50 text-[11px] font-bold text-muted-foreground">
                  <th class="py-2.5 px-4">Semantic Token &amp; Utility Class</th>
                  <th class="py-2.5 px-4">Light Mode (<code class="font-mono">:root</code>)</th>
                  <th class="py-2.5 px-4">Dark Mode (<code class="font-mono">.dark</code>)</th>
                  <th class="py-2.5 px-4">Live Active Swatch</th>
                  <th class="py-2.5 px-4">Role &amp; Usage in RakanSales</th>
                  <th class="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border text-xs">
                <tr
                  v-for="token in filteredSemanticTokens"
                  :key="token.id"
                  class="hover:bg-muted/30 transition-colors group"
                >
                  <!-- Col 1: Token Identity -->
                  <td class="py-3 px-4 align-middle">
                    <div class="flex items-center gap-2">
                      <span class="font-bold text-foreground">{{ token.name }}</span>
                      <Badge v-if="customTokenOverrides[token.cssVar]" variant="warning">Live Edited</Badge>
                    </div>
                    <div class="flex flex-wrap items-center gap-1.5 mt-1">
                      <button
                        type="button"
                        @click="copyText(token.twBgClass, 'Tailwind Class')"
                        class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted text-foreground font-mono text-[11px] hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                        title="Click to copy Tailwind class"
                      >
                        <span>{{ token.twBgClass }}</span>
                        <Copy class="size-2.5 opacity-60" />
                      </button>
                      <button
                        type="button"
                        @click="copyText(`var(${token.cssVar})`, 'CSS Variable')"
                        class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-border text-muted-foreground font-mono text-[10px] hover:text-foreground transition-colors cursor-pointer"
                        title="Click to copy CSS variable"
                      >
                        <span>{{ token.cssVar }}</span>
                      </button>
                    </div>
                  </td>

                  <!-- Col 2: Explicit Light Mode Swatch -->
                  <td class="py-3 px-4 align-middle">
                    <button
                      type="button"
                      @click="copyText(formatTokenValue(token, 'light'), `${token.name} (Light)`)"
                      class="w-full max-w-[230px] flex items-center gap-2.5 p-1.5 rounded-lg border border-border bg-background hover:border-primary/50 transition-all text-left cursor-pointer"
                      title="Click to copy Light Mode value"
                    >
                      <div
                        class="size-9 rounded-md border border-border/60 flex items-center justify-center font-mono text-[10px] font-bold shrink-0 shadow-soft"
                        :style="{ backgroundColor: token.lightOklch, color: token.lightForegroundOklch }"
                      >
                        Aa
                      </div>
                      <div class="min-w-0 flex-1">
                        <div class="flex items-center justify-between gap-1">
                          <span class="font-semibold text-[11px] text-foreground truncate">{{ token.tailwindMatchLight }}</span>
                          <span class="text-[10px] font-mono text-muted-foreground shrink-0">{{ token.contrastLight }}</span>
                        </div>
                        <div class="font-mono text-[10px] text-muted-foreground truncate">
                          {{ tokenDisplayFormat === 'hex' ? token.lightHex : token.lightOklch }}
                        </div>
                      </div>
                    </button>
                  </td>

                  <!-- Col 3: Explicit Dark Mode Swatch -->
                  <td class="py-3 px-4 align-middle">
                    <button
                      type="button"
                      @click="copyText(formatTokenValue(token, 'dark'), `${token.name} (Dark)`)"
                      class="w-full max-w-[230px] flex items-center gap-2.5 p-1.5 rounded-lg border border-border bg-background hover:border-primary/50 transition-all text-left cursor-pointer"
                      title="Click to copy Dark Mode value"
                    >
                      <div
                        class="size-9 rounded-md border border-border/60 flex items-center justify-center font-mono text-[10px] font-bold shrink-0 shadow-soft"
                        :style="{ backgroundColor: token.darkOklch, color: token.darkForegroundOklch }"
                      >
                        Aa
                      </div>
                      <div class="min-w-0 flex-1">
                        <div class="flex items-center justify-between gap-1">
                          <span class="font-semibold text-[11px] text-foreground truncate">{{ token.tailwindMatchDark }}</span>
                          <span class="text-[10px] font-mono text-muted-foreground shrink-0">{{ token.contrastDark }}</span>
                        </div>
                        <div class="font-mono text-[10px] text-muted-foreground truncate">
                          {{ tokenDisplayFormat === 'hex' ? token.darkHex : token.darkOklch }}
                        </div>
                      </div>
                    </button>
                  </td>

                  <!-- Col 4: Live Reactive CSS Variable Swatch -->
                  <td class="py-3 px-4 align-middle">
                    <div class="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-border bg-muted/40">
                      <div
                        class="size-6 rounded border border-border shrink-0"
                        :style="{ backgroundColor: `var(${token.cssVar})` }"
                      ></div>
                      <div class="text-[10px] font-mono">
                        <div class="font-semibold text-foreground">
                          {{ customTokenOverrides[token.cssVar]?.label || (isDark ? 'Active .dark' : 'Active :root') }}
                        </div>
                        <div class="text-muted-foreground">var({{ token.cssVar }})</div>
                      </div>
                    </div>
                  </td>

                  <!-- Col 5: Usage Description -->
                  <td class="py-3 px-4 align-middle max-w-xs text-muted-foreground leading-relaxed">
                    {{ token.usage }}
                  </td>

                  <!-- Col 6: Quick Actions -->
                  <td class="py-3 px-4 align-middle text-right whitespace-nowrap">
                    <div class="inline-flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="xs"
                        @click="
                          activeStudioToken = token.cssVar;
                          tailwindCopyMode = 'assign';
                          activeSection = 'tailwind';
                          toast.info(`Select any Tailwind shade below to test on ${token.cssVar}`);
                        "
                        title="Test a Tailwind color on this token"
                      >
                        <Palette class="size-3" />
                        Test Shade
                      </Button>
                      <Button
                        variant="outline"
                        size="icon-xs"
                        @click="copyText(token.twBgClass, token.name)"
                        title="Copy Tailwind class"
                      >
                        <Check v-if="copiedKey === token.twBgClass" class="size-3 text-success" />
                        <Copy v-else class="size-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      <!-- =====================================================================
           SECTION 3: COMPLETE TAILWIND CSS V4 COLOR LIBRARY (22 FAMILIES)
           ===================================================================== -->
      <section v-if="activeSection === 'tailwind'" class="space-y-5">
        <!-- Interactive Studio & Filter Bar -->
        <Card class="p-4 space-y-3">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-sm font-bold text-foreground">
                  Official Tailwind CSS v4 Color Palette (22 Families • Steps 50–950)
                </h2>
                <Badge variant="muted">OKLCH + Hex</Badge>
              </div>
              <p class="text-xs text-muted-foreground mt-0.5">
                Click any swatch to copy its Tailwind class, OKLCH, or Hex value — or switch to <strong>Live-Assign Mode</strong> to test any shade directly on RakanSales semantic tokens.
              </p>
            </div>

            <!-- Click Action Mode Selector -->
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-xs font-semibold text-muted-foreground">On Swatch Click:</span>
              <div class="inline-flex items-center rounded-lg bg-muted p-0.5 border border-border">
                <button
                  v-for="mode in [
                    { id: 'tw-bg', label: 'Copy bg-*' },
                    { id: 'tw-text', label: 'Copy text-*' },
                    { id: 'oklch', label: 'Copy OKLCH' },
                    { id: 'hex', label: 'Copy Hex' },
                    { id: 'assign', label: 'Live-Assign to Token' },
                  ]"
                  :key="mode.id"
                  type="button"
                  @click="tailwindCopyMode = mode.id as any"
                  class="px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer"
                  :class="
                    tailwindCopyMode === mode.id
                      ? mode.id === 'assign'
                        ? 'bg-primary text-primary-foreground shadow-soft'
                        : 'bg-card text-foreground shadow-soft'
                      : 'text-muted-foreground hover:text-foreground'
                  "
                >
                  {{ mode.label }}
                </button>
              </div>
            </div>
          </div>

          <!-- Second Row: Group Filters, System Family Filter, and Live Target Selector -->
          <div class="pt-3 border-t border-border flex flex-wrap items-center justify-between gap-3">
            <div class="flex flex-wrap items-center gap-1.5">
              <button
                v-for="grp in paletteGroups"
                :key="grp"
                type="button"
                @click="selectedPaletteGroup = grp"
                class="px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer"
                :class="
                  selectedPaletteGroup === grp
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
                "
              >
                {{ grp }}
              </button>

              <label class="inline-flex items-center gap-2 ml-2 text-xs font-medium text-foreground cursor-pointer select-none">
                <Switch v-model="showOnlySystemFamilies" />
                <span>Only RakanSales Core Families</span>
              </label>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <div v-if="tailwindCopyMode === 'assign'" class="flex items-center gap-1.5 bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-md">
                <Sparkles class="size-3.5 text-primary" />
                <span class="text-xs font-semibold text-primary">Assigning to:</span>
                <select
                  v-model="activeStudioToken"
                  aria-label="Target semantic token to assign Tailwind color"
                  class="bg-card border border-border rounded px-2 py-0.5 text-xs font-mono font-bold text-foreground cursor-pointer"
                >
                  <option v-for="opt in studioTargetOptions" :key="opt.cssVar" :value="opt.cssVar">
                    {{ opt.label }}
                  </option>
                </select>
              </div>

              <div class="relative w-56">
                <Search class="size-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
                <Input
                  v-model="paletteSearch"
                  placeholder="Filter family or #hex..."
                  class="pl-8 h-8 text-xs"
                />
              </div>
            </div>
          </div>
        </Card>

        <!-- 22-Family Matrix -->
        <div class="space-y-4">
          <Card
            v-for="family in filteredTailwindFamilies"
            :key="family.slug"
            class="p-4 space-y-3"
          >
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div class="flex items-center gap-2.5">
                <h3 class="text-sm font-bold text-foreground">{{ family.name }}</h3>
                <Badge v-if="family.isSystemFamily" variant="muted">Used in RakanSales</Badge>
                <span class="text-xs text-muted-foreground">{{ family.description }}</span>
              </div>
              <span class="text-[11px] font-mono text-muted-foreground">
                {{ family.slug }}-50 &rarr; {{ family.slug }}-950
              </span>
            </div>

            <!-- 11-Shade Grid (50 to 950) -->
            <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-2">
              <button
                v-for="shade in family.shades"
                :key="shade.step"
                type="button"
                @click="handleShadeClick(family.slug, shade)"
                class="group relative flex flex-col rounded-lg border transition-all text-left overflow-hidden cursor-pointer hover:-translate-y-0.5 hover:shadow-md"
                :class="shade.systemTokenMatch ? 'border-primary ring-1 ring-primary/30' : 'border-border'"
              >
                <!-- Color Swatch Box -->
                <div
                  class="h-14 w-full px-2 py-1.5 flex flex-col justify-between transition-transform"
                  :style="{
                    backgroundColor: shade.oklch,
                    color: getShadeForegroundOklch(shade.step),
                  }"
                >
                  <div class="flex items-center justify-between w-full">
                    <span class="font-mono text-[11px] font-bold">{{ shade.step }}</span>
                    <Check
                      v-if="
                        copiedKey === `bg-${family.slug}-${shade.step}` ||
                        copiedKey === shade.oklch ||
                        copiedKey === shade.hex
                      "
                      class="size-3.5"
                    />
                    <Copy v-else class="size-3 opacity-0 group-hover:opacity-90 transition-opacity" />
                  </div>

                  <span
                    v-if="shade.systemTokenMatch"
                    class="inline-block px-1 py-0.2 rounded text-[9px] font-mono font-bold truncate bg-background/85 text-foreground"
                    :title="shade.systemTokenMatch"
                  >
                    {{ shade.systemTokenMatch }}
                  </span>
                </div>

                <!-- Metadata Footer -->
                <div class="p-2 bg-card space-y-0.5">
                  <div class="flex items-center justify-between">
                    <span class="font-mono text-[11px] font-semibold text-foreground uppercase">{{ shade.hex }}</span>
                    <span class="text-[9px] font-mono text-muted-foreground">{{ family.slug }}-{{ shade.step }}</span>
                  </div>
                  <div class="font-mono text-[9px] text-muted-foreground truncate" :title="shade.oklch">
                    {{ shade.oklch }}
                  </div>
                </div>
              </button>
            </div>
          </Card>
        </div>
      </section>

      <!-- =====================================================================
           SECTION 4: TYPOGRAPHY, SPACING, RADIUS & ELEVATION SPECS
           ===================================================================== -->
      <section v-if="activeSection === 'typography'" class="space-y-6">
        <!-- Typography Hierarchy Table -->
        <Card class="p-5 space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
            <div>
              <h2 class="text-sm font-bold text-foreground">Typography Scale &amp; Weight Ceiling</h2>
              <p class="text-xs text-muted-foreground">
                Primary typeface: <code class="font-mono text-foreground">Inter Variable</code>. Maximum weight in RakanSales is <code class="font-mono text-foreground">font-bold</code> (700) — never use <code class="font-mono">font-extrabold</code> or <code class="font-mono">font-black</code>.
              </p>
            </div>
            <Badge variant="success">Max Weight: 700 (Bold)</Badge>
          </div>

          <div class="divide-y divide-border">
            <div
              v-for="spec in typographySpecs"
              :key="spec.role"
              class="py-3.5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              <div class="space-y-1 lg:w-1/4">
                <div class="text-xs font-bold text-foreground">{{ spec.role }}</div>
                <div class="text-[11px] font-mono text-muted-foreground">{{ spec.size }} • {{ spec.weight }}</div>
                <p class="text-[11px] text-muted-foreground">{{ spec.usage }}</p>
              </div>

              <div class="lg:flex-1 p-3 rounded-lg bg-muted/40 border border-border">
                <div :class="spec.classes">{{ spec.sample }}</div>
              </div>

              <div class="lg:w-64 flex items-center justify-end gap-2">
                <button
                  type="button"
                  @click="copyText(spec.classes, spec.role)"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-border bg-background hover:bg-muted font-mono text-[11px] text-foreground transition-colors cursor-pointer"
                >
                  <span class="truncate max-w-[180px]">{{ spec.classes }}</span>
                  <Copy class="size-3 shrink-0 text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>
        </Card>

        <!-- Spacing, Corner Radius & Elevation Controls -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- 4px Spacing Scale -->
          <Card class="p-5 space-y-4">
            <div class="border-b border-border pb-3">
              <h2 class="text-sm font-bold text-foreground">4px Spatial Grid &amp; Density Rhythm</h2>
              <p class="text-xs text-muted-foreground">Consistent spacing tokens used across cards, tables, and forms.</p>
            </div>

            <div class="space-y-2.5">
              <div
                v-for="sp in spacingScale"
                :key="sp.token"
                class="flex items-center justify-between gap-3 p-2.5 rounded-lg border border-border bg-background"
              >
                <div class="flex items-center gap-3">
                  <div class="h-4 bg-primary rounded-xs" :style="{ width: sp.px }"></div>
                  <span class="font-mono text-xs font-bold text-foreground">{{ sp.token }}</span>
                </div>
                <div class="text-right">
                  <span class="font-mono text-xs text-primary font-semibold">{{ sp.px }} ({{ sp.rem }})</span>
                  <p class="text-[11px] text-muted-foreground">{{ sp.usage }}</p>
                </div>
              </div>
            </div>
          </Card>

          <!-- Interactive Corner Radius & Elevation Studio -->
          <Card class="p-5 space-y-5">
            <div class="border-b border-border pb-3 flex items-center justify-between">
              <div>
                <h2 class="text-sm font-bold text-foreground">Corner Radius &amp; Toggleable Shadows</h2>
                <p class="text-xs text-muted-foreground">Live-test <code class="font-mono">--radius</code> and <code class="font-mono">--rks-shadow-*</code> elevation tokens.</p>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xs text-muted-foreground">Diffused Shadows</span>
                <Switch :model-value="shadowsEnabled" @update:model-value="toggleGlobalShadows" />
              </div>
            </div>

            <!-- Radius Switcher -->
            <div class="space-y-2">
              <div class="text-xs font-semibold text-foreground">Global Base Radius (<code class="font-mono">--radius</code>)</div>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  v-for="preset in radiusPresets"
                  :key="preset.value"
                  type="button"
                  @click="setGlobalRadius(preset.value)"
                  class="p-2.5 rounded-lg border text-left transition-all cursor-pointer"
                  :class="
                    activeRadiusRem === preset.value
                      ? 'border-primary bg-primary/10 text-primary font-bold'
                      : 'border-border bg-background text-foreground hover:bg-muted'
                  "
                >
                  <div class="text-xs font-semibold">{{ preset.label }}</div>
                  <div class="text-[10px] font-mono text-muted-foreground mt-0.5">{{ preset.px }} base</div>
                </button>
              </div>
            </div>

            <!-- Shadow Elevation Tiers -->
            <div class="space-y-2">
              <div class="text-xs font-semibold text-foreground">Shadow Tokens (<code class="font-mono">src/assets/index.css</code>)</div>
              <div class="grid grid-cols-2 gap-3">
                <div class="p-3.5 rounded-xl border border-border bg-card shadow-soft">
                  <div class="font-mono text-xs font-bold text-foreground">.shadow-soft</div>
                  <div class="text-[11px] text-muted-foreground mt-0.5">var(--rks-shadow-sm) • Default Card</div>
                </div>
                <div class="p-3.5 rounded-xl border border-border bg-card shadow-success-glow">
                  <div class="font-mono text-xs font-bold text-success">.shadow-success-glow</div>
                  <div class="text-[11px] text-muted-foreground mt-0.5">var(--rks-shadow-success) • SLA Toast</div>
                </div>
                <div class="p-3.5 rounded-xl border border-border bg-card shadow-warning-glow">
                  <div class="font-mono text-xs font-bold text-warning">.shadow-warning-glow</div>
                  <div class="text-[11px] text-muted-foreground mt-0.5">var(--rks-shadow-warning) • Quota Alert</div>
                </div>
                <div class="p-3.5 rounded-xl border border-border bg-card shadow-danger-glow">
                  <div class="font-mono text-xs font-bold text-destructive">.shadow-danger-glow</div>
                  <div class="text-[11px] text-muted-foreground mt-0.5">var(--rks-shadow-danger) • Breach Alert</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <!-- =====================================================================
           SECTION 5: DEVELOPER & AI SYSTEM PROMPT REFERENCE
           ===================================================================== -->
      <section v-if="activeSection === 'prompt'" class="space-y-4">
        <Card class="p-5 space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
            <div>
              <h2 class="text-sm font-bold text-foreground">Canonical Nova v4.0 Markdown Specification</h2>
              <p class="text-xs text-muted-foreground">
                Exported from <code class="font-mono text-foreground">src/data/designSystemGuidelines.ts</code> — paste directly into AI coding assistants or developer onboarding docs.
              </p>
            </div>
            <Button
              variant="default"
              size="sm"
              @click="copyText(rakanSalesGuidelinesMarkdown, 'Nova v4.0 Markdown Prompt')"
            >
              <Copy class="size-3.5" />
              Copy Full Markdown Specification
            </Button>
          </div>

          <pre class="p-4 rounded-xl bg-muted/60 border border-border text-xs font-mono text-foreground overflow-x-auto max-h-[540px] leading-relaxed whitespace-pre-wrap">{{ rakanSalesGuidelinesMarkdown }}</pre>
        </Card>
      </section>
    </main>
  </div>
</template>
