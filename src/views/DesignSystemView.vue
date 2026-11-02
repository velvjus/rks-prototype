<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTheme } from '@/composables/useTheme'
import { toast } from 'vue-sonner'
import { componentsList, type DesignSystemComponent } from '@/data/componentsList'
import { SEMANTIC_TOKENS } from '@/data/colorTokensData'
import { rakanSalesGuidelinesMarkdown } from '@/data/designSystemGuidelines'

// Core Refined UI Primitives
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from '@/components/ui/alert'

// Icons
import {
  Sun,
  Moon,
  Copy,
  Check,
  Search,
  Palette,
  LayoutGrid,
  Sliders,
  Box,
  Layers,
  Sparkles,
  ArrowUpRight,
  Code2,
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
  Loader2,
  Plus,
  Send,
  Filter,
  Download,
  Trash2,
  MessageSquare,
  Briefcase,
  Users,
  Clock,
  Flame,
  Paperclip,
  Bell,
  ShieldCheck,
  Contrast,
  ExternalLink,
  Terminal,
  Eye,
  TrendingUp,
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const { isDark, toggleTheme } = useTheme()

// Top-level Workbench Tabs
const activeTab = ref<'workbench' | 'catalog' | 'patterns' | 'tokens'>('workbench')

const workspaceTabs = [
  { id: 'workbench', label: 'Prop Workbench', icon: Sliders },
  { id: 'catalog', label: 'Component Registry', icon: Box },
  { id: 'patterns', label: 'CRM Patterns', icon: Layers },
  { id: 'tokens', label: 'Token Strip', icon: Contrast },
] as const

// =========================================================================
// 1. INTERACTIVE COMPONENT PROP WORKBENCH STATE
// =========================================================================
type WorkbenchComponentId =
  | 'button'
  | 'badge'
  | 'input-select'
  | 'card-kpi'
  | 'table-grid'
  | 'tabs-controls'
  | 'feedback-sonner'

const activePrimitive = ref<WorkbenchComponentId>('button')
const splitLightDarkPreview = ref(true)

const workbenchPrimitives = [
  { id: 'button', name: 'Button', file: 'src/components/ui/button/index.ts', count: '14 Variants • 8 Sizes' },
  { id: 'badge', name: 'Badge & Pipeline Tags', file: 'src/components/ui/badge/index.ts', count: '15 Variants (Tags 1–6)' },
  { id: 'input-select', name: 'Input, Select & Switch', file: 'src/components/ui/input/Input.vue', count: 'Form Controls' },
  { id: 'card-kpi', name: 'Card & Metric Surface', file: 'src/components/ui/card/Card.vue', count: 'Elevated Containers' },
  { id: 'table-grid', name: 'High-Density Data Table', file: 'src/components/ui/table/Table.vue', count: 'Tabular CRM Grid' },
  { id: 'tabs-controls', name: 'Tabs, Slider & Progress', file: 'src/components/ui/tabs/Tabs.vue', count: 'Interactive State' },
  { id: 'feedback-sonner', name: 'Sonner Toast, Alert & Dialog', file: 'src/components/ui/sonner/Sonner.vue', count: 'Overlays & Toasts' },
] as const

// Button Workbench Controls
const btnVariant = ref<
  'default' | 'primary' | 'brand' | 'secondary' | 'outline' | 'soft' | 'ghost' | 'link' | 'success' | 'warning' | 'info' | 'destructive' | 'dark' | 'gradient'
>('default')
const btnSize = ref<'xs' | 'sm' | 'default' | 'lg' | 'icon'>('default')
const btnLabel = ref('Create Deal')
const btnDisabled = ref(false)
const btnLoading = ref(false)
const btnWithIcon = ref(true)

const buttonVariantList = [
  'default',
  'primary',
  'brand',
  'secondary',
  'outline',
  'soft',
  'ghost',
  'link',
  'success',
  'warning',
  'info',
  'destructive',
  'dark',
  'gradient',
] as const

const buttonSizeList = ['xs', 'sm', 'default', 'lg', 'icon'] as const

// Badge Workbench Controls
const bdgVariant = ref<
  'success' | 'warning' | 'info' | 'destructive' | 'tag-1' | 'tag-2' | 'tag-3' | 'tag-4' | 'tag-5' | 'tag-6' | 'secondary' | 'outline' | 'muted' | 'default' | 'destructive-solid'
>('success')
const bdgLabel = ref('SLA Met • 98.4%')

const badgeGroups = [
  {
    tier: 'Tier 1: Soft Status (Table & Card Standard)',
    note: '10% fill + 20% 1px border — never competes with primary CTA buttons.',
    variants: [
      { id: 'success' as const, sample: 'SLA Met • 98.4%' },
      { id: 'warning' as const, sample: '85% Quota Used' },
      { id: 'info' as const, sample: 'Meta Ads Synced' },
      { id: 'destructive' as const, sample: 'SLA Breached' },
    ],
  },
  {
    tier: 'Tier 2: Categorical Pipeline Stages (Classification)',
    note: 'Color-codes pipeline stages & segments without implying success or error.',
    variants: [
      { id: 'tag-1' as const, sample: 'Stage 1: New' },
      { id: 'tag-2' as const, sample: 'Stage 2: Acknowledged' },
      { id: 'tag-3' as const, sample: 'Stage 3: Qualifying' },
      { id: 'tag-4' as const, sample: 'Stage 4: Proposal' },
      { id: 'tag-5' as const, sample: 'Stage 5: Follow Up' },
      { id: 'tag-6' as const, sample: 'Stage 6: Custom' },
    ],
  },
  {
    tier: 'Tier 3: Structural & Neutral Metadata',
    note: 'Low-emphasis UI chrome, seat counts, version tags, and soft brand pills.',
    variants: [
      { id: 'secondary' as const, sample: '50 Seats' },
      { id: 'outline' as const, sample: 'v4.0' },
      { id: 'muted' as const, sample: 'AI Copilot' },
    ],
  },
  {
    tier: 'Tier 4: Solid-Filled Counters (Use Sparingly)',
    note: 'Reserved strictly for unread message counters and single focal alerts.',
    variants: [
      { id: 'default' as const, sample: '12 Unread' },
      { id: 'destructive-solid' as const, sample: '3 Urgent SLA' },
    ],
  },
]

const badgeVariantList = [
  'success',
  'warning',
  'info',
  'destructive',
  'tag-1',
  'tag-2',
  'tag-3',
  'tag-4',
  'tag-5',
  'tag-6',
  'secondary',
  'outline',
  'muted',
  'default',
  'destructive-solid',
] as const

function selectBadgeVariant(v: typeof bdgVariant.value, sampleText?: string) {
  bdgVariant.value = v
  if (sampleText) bdgLabel.value = sampleText
}

// Form Controls Workbench State
const demoInputValue = ref('Synergy Tech Sdn Bhd')
const demoSelectValue = ref('qualifying')
const demoSwitchValue = ref(true)
const demoCheckboxValue = ref(true)
const demoDisabledForm = ref(false)

// Tabs / Slider / Progress State
const demoTabValue = ref('pipeline')
const demoSliderValue = ref([72])
const demoProgressValue = ref(78)

// Generated Code Snippet for the Active Primitive
const generatedVueSnippet = computed(() => {
  if (activePrimitive.value === 'button') {
    const props: string[] = []
    if (btnVariant.value !== 'default') props.push(`variant="${btnVariant.value}"`)
    if (btnSize.value !== 'default') props.push(`size="${btnSize.value}"`)
    if (btnDisabled.value || btnLoading.value) props.push(':disabled="true"')
    const propStr = props.length ? ' ' + props.join(' ') : ''
    const iconMarkup = btnLoading.value
      ? `\n    <Loader2 class="animate-spin" />`
      : btnWithIcon.value
        ? `\n    <Plus />`
        : ''
    const labelMarkup = btnSize.value === 'icon' ? '' : `\n    <span>${btnLabel.value}</span>`
    return `<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Plus, Loader2 } from 'lucide-vue-next'
<\/script>

<template>
  <Button${propStr}>${iconMarkup}${labelMarkup}
  </Button>
</template>`
  }

  if (activePrimitive.value === 'badge') {
    return `<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
<\/script>

<template>
  <Badge variant="${bdgVariant.value}">
    ${bdgLabel.value}
  </Badge>
</template>`
  }

  if (activePrimitive.value === 'input-select') {
    return `<script setup lang="ts">
import { ref } from 'vue'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

const company = ref('${demoInputValue.value}')
const stage = ref('${demoSelectValue.value}')
const autoAssign = ref(${demoSwitchValue.value})
<\/script>

<template>
  <div class="space-y-3">
    <Input v-model="company" placeholder="Company name..." />
    <Select v-model="stage">
      <SelectTrigger><SelectValue placeholder="Select stage" /></SelectTrigger>
      <SelectContent>
        <SelectItem value="new">Stage 1: New</SelectItem>
        <SelectItem value="qualifying">Stage 3: Qualifying</SelectItem>
      </SelectContent>
    </Select>
    <Switch v-model="autoAssign" />
  </div>
</template>`
  }

  if (activePrimitive.value === 'card-kpi') {
    return `<script setup lang="ts">
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
<\/script>

<template>
  <Card class="p-4 space-y-2">
    <div class="flex items-center justify-between">
      <span class="text-xs font-medium text-muted-foreground">Pipeline Revenue</span>
      <Badge variant="success">+18.4%</Badge>
    </div>
    <div class="text-2xl font-bold font-mono tabular-nums text-foreground">
      RM 428,900
    </div>
  </Card>
</template>`
  }

  if (activePrimitive.value === 'table-grid') {
    return `<script setup lang="ts">
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
<\/script>

<template>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Company</TableHead>
        <TableHead>Stage</TableHead>
        <TableHead class="text-right">Value</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell class="font-semibold">Synergy Tech Sdn Bhd</TableCell>
        <TableCell><Badge variant="tag-3">Qualifying</Badge></TableCell>
        <TableCell class="text-right font-mono font-semibold">RM 92,000</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>`
  }

  if (activePrimitive.value === 'tabs-controls') {
    return `<script setup lang="ts">
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
<\/script>

<template>
  <Tabs default-value="pipeline">
    <TabsList>
      <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
      <TabsTrigger value="sla">SLA Metrics</TabsTrigger>
    </TabsList>
    <TabsContent value="pipeline">
      <Progress :model-value="${demoProgressValue.value}" />
    </TabsContent>
  </Tabs>
</template>`
  }

  return `<script setup lang="ts">
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
<\/script>

<template>
  <Button variant="success" @click="toast.success('Deal moved to Proposal', { description: 'RM 92,000 • Synergy Tech Sdn Bhd' })">
    Trigger Rich Sonner Toast
  </Button>
</template>`
})

// =========================================================================
// 2. FULL 65-COMPONENT CATALOG STATE
// =========================================================================
const catalogSearch = ref('')
const catalogCategory = ref<string>('All')
const catalogOnlyInstalled = ref(true)

const catalogCategories = ['All', 'Inputs', 'Data Display', 'Feedback', 'Navigation', 'Overlay', 'Layout', 'Utility']

const filteredCatalog = computed(() => {
  return componentsList.filter((item) => {
    const matchesCat = catalogCategory.value === 'All' || item.category === catalogCategory.value
    const matchesInst = !catalogOnlyInstalled.value || item.installed
    const q = catalogSearch.value.trim().toLowerCase()
    const matchesSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    return matchesCat && matchesInst && matchesSearch
  })
})

function getComponentImportStatement(comp: DesignSystemComponent): string {
  const folder = comp.name.toLowerCase().replace(/\s+/g, '-')
  const pascal = comp.name.replace(/\s+/g, '')
  return `import { ${pascal} } from '@/components/ui/${folder}'`
}

// =========================================================================
// 3. CRM PATTERN BLUEPRINTS SAMPLE DATA
// =========================================================================
const sampleDeals = [
  {
    id: 'DL-401',
    title: 'Enterprise WhatsApp API Rollout',
    company: 'Synergy Tech Sdn Bhd',
    stage: 'New',
    tagVariant: 'tag-1' as const,
    value: 'RM 68,500',
    agent: 'AF',
    hot: true,
    days: '2d',
  },
  {
    id: 'DL-402',
    title: 'Multi-Branch Omnichannel License',
    company: 'Petronas Dagangan Retail',
    stage: 'Qualifying',
    tagVariant: 'tag-3' as const,
    value: 'RM 142,000',
    agent: 'NR',
    hot: true,
    days: '5d',
  },
  {
    id: 'DL-403',
    title: 'Annual CRM Seat Expansion (50 Seats)',
    company: 'Axiata Digital Labs',
    stage: 'Proposal',
    tagVariant: 'tag-4' as const,
    value: 'RM 94,000',
    agent: 'JL',
    hot: false,
    days: '4d',
  },
]

const chatReplyMode = ref<'reply' | 'note'>('reply')
const chatComposerText = ref('Hi Dato’ Farid, attached is the revised Q4 Enterprise Quotation for 50 seats.')

// Sonner Toast Triggers
function triggerDemoToast(type: 'success' | 'warning' | 'info' | 'error') {
  if (type === 'success') {
    toast.success('Deal Won • RM 142,000', {
      description: 'Petronas Dagangan Retail moved to Closed Won by Ahmad Faizal.',
    })
  } else if (type === 'warning') {
    toast.warning('SLA Response Threshold (85%)', {
      description: '3 VIP WhatsApp conversations require response within 4 minutes.',
    })
  } else if (type === 'info') {
    toast.info('Meta Lead Ads Synced', {
      description: '14 new qualified leads imported into Stage 1 (New).',
    })
  } else {
    toast.error('WhatsApp Webhook Disconnected', {
      description: 'Token expired for +60 12-345 6789. Re-authenticate in Settings.',
    })
  }
}

async function copyText(val: string, label?: string) {
  try {
    await navigator.clipboard.writeText(val)
    toast.success(`Copied ${label || 'snippet'}`, {
      description: val.length > 75 ? val.slice(0, 75) + '...' : val,
    })
  } catch {
    toast.error('Copy failed')
  }
}

// Scoped CSS custom property map for the Counterpart Theme Mirror pane:
// When global theme is Light (:root), the mirror scopes Dark (.dark) tokens;
// when global theme is Dark (.dark), the mirror scopes Light (:root) tokens.
const lightThemeVarMap: Record<string, string> = {
  '--background': 'oklch(1 0 0)',
  '--foreground': 'oklch(0.145 0 0)',
  '--card': 'oklch(1 0 0)',
  '--card-foreground': 'oklch(0.145 0 0)',
  '--popover': 'oklch(1 0 0)',
  '--popover-foreground': 'oklch(0.145 0 0)',
  '--primary': 'oklch(0.527 0.154 150.069)',
  '--primary-foreground': 'oklch(0.982 0.018 155.826)',
  '--secondary': 'oklch(0.967 0.001 286.375)',
  '--secondary-foreground': 'oklch(0.21 0.006 285.885)',
  '--muted': 'oklch(0.97 0 0)',
  '--muted-foreground': 'oklch(0.556 0 0)',
  '--accent': 'oklch(0.97 0 0)',
  '--accent-foreground': 'oklch(0.205 0 0)',
  '--destructive': 'oklch(0.577 0.245 27.325)',
  '--destructive-foreground': 'oklch(0.985 0 0)',
  '--border': 'oklch(0.922 0 0)',
  '--input': 'oklch(0.922 0 0)',
  '--ring': 'oklch(0.708 0 0)',
  '--success': 'oklch(0.627 0.194 149.214)',
  '--success-foreground': 'oklch(0.985 0 0)',
  '--warning': 'oklch(0.769 0.188 70.08)',
  '--warning-foreground': 'oklch(0.145 0 0)',
  '--info': 'oklch(0.623 0.188 250.3)',
  '--info-foreground': 'oklch(0.985 0 0)',
  '--brand': 'oklch(0.627 0.194 149.214)',
  '--brand-foreground': 'oklch(0.985 0 0)',
  '--brand-secondary': 'oklch(0.81 0.22 135)',
  '--rail': 'oklch(0.13 0.028 261.692)',
  '--rail-foreground': 'oklch(0.985 0 0)',
  '--rail-muted-foreground': 'oklch(0.708 0 0)',
  '--rail-border': 'oklch(0.269 0 0)',
  '--rail-active': 'oklch(0.269 0 0)',
  '--tag-1': 'oklch(0.95 0.04 240)',
  '--tag-1-foreground': 'oklch(0.42 0.16 245)',
  '--tag-2': 'oklch(0.95 0.05 150)',
  '--tag-2-foreground': 'oklch(0.38 0.15 150)',
  '--tag-3': 'oklch(0.95 0.06 75)',
  '--tag-3-foreground': 'oklch(0.45 0.16 65)',
  '--tag-4': 'oklch(0.95 0.05 300)',
  '--tag-4-foreground': 'oklch(0.42 0.18 300)',
  '--tag-5': 'oklch(0.95 0.05 25)',
  '--tag-5-foreground': 'oklch(0.45 0.18 25)',
  '--tag-6': 'oklch(0.95 0.05 195)',
  '--tag-6-foreground': 'oklch(0.42 0.14 195)',
}

const darkThemeVarMap: Record<string, string> = {
  '--background': 'oklch(0.145 0 0)',
  '--foreground': 'oklch(0.985 0 0)',
  '--card': 'oklch(0.205 0 0)',
  '--card-foreground': 'oklch(0.985 0 0)',
  '--popover': 'oklch(0.205 0 0)',
  '--popover-foreground': 'oklch(0.985 0 0)',
  '--primary': 'oklch(0.65 0.18 149.2)',
  '--primary-foreground': 'oklch(0.982 0.018 155.826)',
  '--secondary': 'oklch(0.274 0.006 286.033)',
  '--secondary-foreground': 'oklch(0.985 0 0)',
  '--muted': 'oklch(0.269 0 0)',
  '--muted-foreground': 'oklch(0.708 0 0)',
  '--accent': 'oklch(0.269 0 0)',
  '--accent-foreground': 'oklch(0.985 0 0)',
  '--destructive': 'oklch(0.704 0.191 22.216)',
  '--destructive-foreground': 'oklch(0.985 0 0)',
  '--border': 'oklch(1 0 0 / 10%)',
  '--input': 'oklch(1 0 0 / 15%)',
  '--ring': 'oklch(0.556 0 0)',
  '--success': 'oklch(0.69 0.17 150)',
  '--success-foreground': 'oklch(0.985 0 0)',
  '--warning': 'oklch(0.78 0.16 70)',
  '--warning-foreground': 'oklch(0.145 0 0)',
  '--info': 'oklch(0.68 0.16 250)',
  '--info-foreground': 'oklch(0.985 0 0)',
  '--brand': 'oklch(0.65 0.18 149.2)',
  '--brand-foreground': 'oklch(0.985 0 0)',
  '--brand-secondary': 'oklch(0.78 0.20 135)',
  '--rail': 'oklch(0.12 0.02 260)',
  '--rail-foreground': 'oklch(0.985 0 0)',
  '--rail-muted-foreground': 'oklch(0.708 0 0)',
  '--rail-border': 'oklch(1 0 0 / 10%)',
  '--rail-active': 'oklch(0.269 0 0)',
  '--tag-1': 'oklch(0.25 0.06 245)',
  '--tag-1-foreground': 'oklch(0.85 0.10 240)',
  '--tag-2': 'oklch(0.25 0.07 150)',
  '--tag-2-foreground': 'oklch(0.85 0.12 150)',
  '--tag-3': 'oklch(0.27 0.07 70)',
  '--tag-3-foreground': 'oklch(0.86 0.14 75)',
  '--tag-4': 'oklch(0.26 0.08 300)',
  '--tag-4-foreground': 'oklch(0.85 0.12 300)',
  '--tag-5': 'oklch(0.26 0.08 25)',
  '--tag-5-foreground': 'oklch(0.85 0.12 25)',
  '--tag-6': 'oklch(0.25 0.06 195)',
  '--tag-6-foreground': 'oklch(0.85 0.10 195)',
}

const counterpartThemeVars = computed(() => (isDark.value ? lightThemeVarMap : darkThemeVarMap))
</script>

<template>
  <!-- THESIS: RakanSales Nova v4.0 Interactive Component Workbench & Pattern Explorer — a live engineering showroom where designers and developers test refined UI primitives across Light & Dark mode simultaneously, inspect props, and copy production Vue 3 snippets.
       OWN-WORLD: High-density B2B sales CRM aesthetic powered by semantic tokens (--primary, --card, --rail, --tag-1..6) and 1px structural hairlines.
       STORY: 1. Interactive Component Prop Workbench (with Split Light/Dark Preview) -> 2. Searchable 51-Component Registry -> 3. Canonical CRM Pattern Blueprints -> 4. Quick Token Strip & Guidelines Bridge.
       FIRST VIEWPORT: Unified Design System header bar, workspace mode switcher, and interactive component workbench with live prop controls + side-by-side Light/Dark preview stage.
       FORM: Seed key 8a9c6c30 — dealt structure index 5 leading (Interactive Specification Matrix & Live Token/Component Workbench).
       FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md -->
  <div class="h-full flex-1 min-h-0 overflow-y-auto bg-background text-foreground flex flex-col">
    <!-- Unified Top Header Bar (Synchronized with /guidelines) -->
    <header class="sticky top-0 z-30 bg-card/95 backdrop-blur border-b border-border px-4 lg:px-6 py-3">
      <div class="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-3">
        <!-- Left: Title & Version -->
        <div class="flex items-center gap-3">
          <div class="size-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <LayoutGrid class="size-4" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-base font-bold tracking-tight text-foreground">
                RakanSales Component Workbench &amp; Pattern Library
              </h1>
              <Badge variant="muted">Nova v4.0</Badge>
            </div>
            <p class="text-xs text-muted-foreground">
              Interactive prop playground, refined <code class="font-mono text-foreground">@/components/ui</code> primitives, and side-by-side Light/Dark verification.
            </p>
          </div>
        </div>

        <!-- Right: Route Switcher & Global Theme Toggle -->
        <div class="flex flex-wrap items-center gap-2">
          <!-- Route Switcher between /guidelines and /design-system -->
          <div class="inline-flex items-center rounded-lg bg-muted p-1 border border-border">
            <button
              type="button"
              @click="router.push('/guidelines')"
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer"
              :class="route.path === '/guidelines' ? 'bg-card text-foreground shadow-soft' : 'text-muted-foreground hover:text-foreground'"
            >
              <Palette class="size-3.5" />
              Foundation &amp; Colors
              <ArrowUpRight class="size-3 opacity-60" />
            </button>
            <button
              type="button"
              @click="router.push('/design-system')"
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer"
              :class="route.path === '/design-system' ? 'bg-card text-foreground shadow-soft' : 'text-muted-foreground hover:text-foreground'"
            >
              <LayoutGrid class="size-3.5 text-primary" />
              Component Workbench
            </button>
          </div>

          <!-- Split Light/Dark Preview Toggle -->
          <Button
            variant="outline"
            size="sm"
            @click="splitLightDarkPreview = !splitLightDarkPreview"
            class="gap-1.5"
          >
            <Contrast class="size-3.5 text-primary" />
            <span>Split Light/Dark: {{ splitLightDarkPreview ? 'ON' : 'OFF' }}</span>
          </Button>

          <!-- Global Theme Switcher -->
          <Button
            variant="outline"
            size="sm"
            @click="toggleTheme"
            class="gap-1.5 font-semibold"
          >
            <Sun v-if="!isDark" class="size-3.5 text-warning" />
            <Moon v-else class="size-3.5 text-info" />
            <span>{{ isDark ? 'Dark (.dark)' : 'Light (:root)' }}</span>
          </Button>

          <Button
            variant="default"
            size="sm"
            @click="copyText(rakanSalesGuidelinesMarkdown, 'Nova v4.0 System Prompt')"
          >
            <Copy class="size-3.5" />
            Copy AI Prompt
          </Button>
        </div>
      </div>

      <!-- Sub-Navigation Tabs -->
      <div class="max-w-[1600px] mx-auto mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between gap-2 overflow-x-auto">
        <div class="flex items-center gap-1">
          <button
            v-for="tab in workspaceTabs"
            :key="tab.id"
            type="button"
            @click="activeTab = tab.id"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all whitespace-nowrap cursor-pointer"
            :class="
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground shadow-soft'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            "
          >
            <component :is="tab.icon" class="size-3.5" />
            <span>{{ tab.label }}</span>
          </button>
        </div>

        <div class="hidden xl:flex items-center gap-2 text-xs text-muted-foreground">
          <span>Need the full 22-family Tailwind CSS v4 color library?</span>
          <button
            type="button"
            @click="router.push('/guidelines')"
            class="font-semibold text-primary hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            Open Color &amp; Token Studio
            <ArrowUpRight class="size-3" />
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="flex-1 max-w-[1600px] w-full mx-auto p-4 lg:p-6 space-y-6">
      <!-- =====================================================================
           TAB 1: INTERACTIVE COMPONENT PROP WORKBENCH
           ===================================================================== -->
      <section v-if="activeTab === 'workbench'" class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <!-- Left 3 Cols: Primitive Selector List -->
        <Card class="lg:col-span-3 p-3 space-y-1.5">
          <div class="px-2 py-1.5 border-b border-border mb-1 flex items-center justify-between">
            <span class="text-xs font-bold text-foreground">Refined Core Primitives</span>
            <Badge variant="outline" class="font-mono">7 Groups</Badge>
          </div>

          <button
            v-for="item in workbenchPrimitives"
            :key="item.id"
            type="button"
            @click="activePrimitive = item.id"
            class="w-full p-2.5 rounded-lg text-left transition-all flex flex-col gap-0.5 cursor-pointer"
            :class="
              activePrimitive === item.id
                ? 'bg-primary/10 border border-primary/25 text-primary'
                : 'hover:bg-muted text-foreground border border-transparent'
            "
          >
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold">{{ item.name }}</span>
              <span class="text-[10px] font-mono text-muted-foreground">{{ item.count }}</span>
            </div>
            <span class="text-[10px] font-mono text-muted-foreground truncate">{{ item.file }}</span>
          </button>

          <div class="pt-2 mt-2 border-t border-border px-2 space-y-2">
            <div class="flex items-center justify-between text-xs">
              <span class="font-medium text-muted-foreground">Side-by-Side Light/Dark</span>
              <Switch v-model="splitLightDarkPreview" />
            </div>
            <p class="text-[11px] text-muted-foreground leading-relaxed">
              Toggle <strong>Side-by-Side Light/Dark</strong> to compare how each component renders on <code class="font-mono">:root</code> and <code class="font-mono">.dark</code> surfaces simultaneously.
            </p>
          </div>
        </Card>

        <!-- Right 9 Cols: Live Stage + Prop Controls + Generated Code -->
        <div class="lg:col-span-9 space-y-5">
          <!-- Prop Controls Bar -->
          <Card class="p-4 space-y-4">
            <div class="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
              <div>
                <h2 class="text-sm font-bold text-foreground">
                  {{ workbenchPrimitives.find((p) => p.id === activePrimitive)?.name }} — Live Prop Controls
                </h2>
                <p class="text-xs text-muted-foreground font-mono">
                  {{ workbenchPrimitives.find((p) => p.id === activePrimitive)?.file }}
                </p>
              </div>
              <div class="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="xs"
                  @click="copyText(generatedVueSnippet, 'Vue 3 Component Snippet')"
                >
                  <Copy class="size-3" />
                  Copy Vue 3 Snippet
                </Button>
              </div>
            </div>

            <!-- Controls for BUTTON -->
            <div v-if="activePrimitive === 'button'" class="space-y-3">
              <div class="space-y-1.5">
                <span class="text-xs font-semibold text-foreground">Variant (<code class="font-mono">variant</code>)</span>
                <div class="flex flex-wrap gap-1.5">
                  <button
                    v-for="v in buttonVariantList"
                    :key="v"
                    type="button"
                    @click="btnVariant = v"
                    class="px-2.5 py-1 rounded-md text-xs font-mono font-semibold border transition-all cursor-pointer"
                    :class="
                      btnVariant === v
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted'
                    "
                  >
                    {{ v }}
                  </button>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div class="space-y-1.5">
                  <span class="text-xs font-semibold text-foreground">Size (<code class="font-mono">size</code>)</span>
                  <div class="flex flex-wrap gap-1">
                    <button
                      v-for="sz in buttonSizeList"
                      :key="sz"
                      type="button"
                      @click="btnSize = sz"
                      class="px-2.5 py-1 rounded-md text-xs font-mono font-semibold border transition-all cursor-pointer"
                      :class="
                        btnSize === sz
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-background text-muted-foreground hover:text-foreground'
                      "
                    >
                      {{ sz }}
                    </button>
                  </div>
                </div>

                <div class="space-y-1.5">
                  <span class="text-xs font-semibold text-foreground">Button Label</span>
                  <Input v-model="btnLabel" class="h-8 text-xs" />
                </div>

                <div class="flex items-center gap-4 pt-5">
                  <label class="inline-flex items-center gap-1.5 text-xs font-medium cursor-pointer">
                    <Switch v-model="btnWithIcon" />
                    <span>Leading Icon</span>
                  </label>
                  <label class="inline-flex items-center gap-1.5 text-xs font-medium cursor-pointer">
                    <Switch v-model="btnLoading" />
                    <span>Loading</span>
                  </label>
                  <label class="inline-flex items-center gap-1.5 text-xs font-medium cursor-pointer">
                    <Switch v-model="btnDisabled" />
                    <span>Disabled</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Controls for BADGE -->
            <div v-else-if="activePrimitive === 'badge'" class="space-y-3">
              <div class="space-y-1.5">
                <span class="text-xs font-semibold text-foreground">Badge Variant (<code class="font-mono">variant</code>)</span>
                <div class="flex flex-wrap gap-1.5">
                  <button
                    v-for="v in badgeVariantList"
                    :key="v"
                    type="button"
                    @click="selectBadgeVariant(v)"
                    class="px-2.5 py-1 rounded-md text-xs font-mono font-semibold border transition-all cursor-pointer"
                    :class="
                      bdgVariant === v
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted'
                    "
                  >
                    {{ v }}
                  </button>
                </div>
              </div>
              <div class="w-64 space-y-1 pt-1">
                <span class="text-xs font-semibold text-foreground">Badge Label</span>
                <Input v-model="bdgLabel" class="h-8 text-xs" />
              </div>
            </div>

            <!-- Controls for FORM INPUTS -->
            <div v-else-if="activePrimitive === 'input-select'" class="flex flex-wrap items-center gap-6">
              <label class="inline-flex items-center gap-2 text-xs font-medium cursor-pointer">
                <Switch v-model="demoDisabledForm" />
                <span>Disable All Form Controls (<code class="font-mono">:disabled="true"</code>)</span>
              </label>
              <span class="text-xs text-muted-foreground">
                Refined <code class="font-mono">h-9 text-xs</code> controls with <code class="font-mono">focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:border-primary</code>.
              </span>
            </div>

            <!-- Controls for TABS / PROGRESS -->
            <div v-else-if="activePrimitive === 'tabs-controls'" class="flex flex-wrap items-center gap-6">
              <div class="flex items-center gap-3">
                <span class="text-xs font-semibold text-foreground">Quota Progress:</span>
                <Button variant="outline" size="xs" @click="demoProgressValue = Math.max(10, demoProgressValue - 15)">-15%</Button>
                <span class="font-mono text-xs font-bold">{{ demoProgressValue }}%</span>
                <Button variant="outline" size="xs" @click="demoProgressValue = Math.min(100, demoProgressValue + 15)">+15%</Button>
              </div>
            </div>

            <!-- Info for CARD / TABLE / SONNER -->
            <div v-else class="text-xs text-muted-foreground">
              Interact directly with the live component stage below. Toggle <strong>Split Light/Dark</strong> to compare both themes side-by-side.
            </div>
          </Card>

          <!-- Live Preview Stage (Supports Single Active Theme OR Side-by-Side Light + Dark Comparison) -->
          <div
            class="grid gap-4"
            :class="splitLightDarkPreview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'"
          >
            <!-- Stage Pane 1: Active Theme (or Light Mode when Split is ON) -->
            <div
              class="rounded-xl border border-border p-5 space-y-4 transition-colors"
              :class="splitLightDarkPreview ? 'bg-background text-foreground' : 'bg-card text-card-foreground'"
            >
              <div class="flex items-center justify-between border-b border-border pb-2.5">
                <div class="flex items-center gap-2">
                  <Sun v-if="!isDark" class="size-3.5 text-warning" />
                  <Moon v-else class="size-3.5 text-info" />
                  <span class="text-xs font-bold">
                    Live Active Theme Canvas ({{ isDark ? '.dark' : ':root' }})
                  </span>
                </div>
                <Badge variant="outline" class="font-mono">Interactive</Badge>
              </div>

              <!-- 1. BUTTON SHOWCASE -->
              <div v-if="activePrimitive === 'button'" class="space-y-5">
                <div class="p-6 rounded-lg bg-muted/40 border border-border flex flex-wrap items-center justify-center gap-4">
                  <Button
                    :variant="btnVariant"
                    :size="btnSize"
                    :disabled="btnDisabled || btnLoading"
                    @click="toast.success(`Clicked ${btnVariant} button`)"
                  >
                    <Loader2 v-if="btnLoading" class="animate-spin" />
                    <Plus v-else-if="btnWithIcon" />
                    <span v-if="btnSize !== 'icon'">{{ btnLabel }}</span>
                  </Button>
                </div>

                <!-- All Button Variants Matrix -->
                <div class="space-y-2">
                  <div class="text-[11px] font-semibold text-muted-foreground">All 14 Button Variants Matrix</div>
                  <div class="flex flex-wrap gap-2">
                    <Button
                      v-for="v in buttonVariantList"
                      :key="v"
                      :variant="v"
                      size="sm"
                      @click="btnVariant = v"
                    >
                      {{ v }}
                    </Button>
                  </div>
                </div>

                <!-- All Sizes Matrix -->
                <div class="space-y-2">
                  <div class="text-[11px] font-semibold text-muted-foreground">Height &amp; Density Scale (xs: 28px, sm: 32px, default: 36px, lg: 40px)</div>
                  <div class="flex flex-wrap items-center gap-2">
                    <Button variant="default" size="xs">Size xs (h-7)</Button>
                    <Button variant="default" size="sm">Size sm (h-8)</Button>
                    <Button variant="default" size="default">Default (h-9)</Button>
                    <Button variant="default" size="lg">Size lg (h-10)</Button>
                    <Button variant="outline" size="icon" title="Icon button"><Plus /></Button>
                  </div>
                </div>
              </div>

              <!-- 2. BADGE & TAGS SHOWCASE -->
              <div v-else-if="activePrimitive === 'badge'" class="space-y-4">
                <div class="p-5 rounded-lg bg-muted/40 border border-border flex items-center justify-center">
                  <Badge :variant="bdgVariant" class="text-xs px-3 py-1">
                    {{ bdgLabel }}
                  </Badge>
                </div>

                <!-- 4-Tier Structured Badge Hierarchy -->
                <div
                  v-for="grp in badgeGroups"
                  :key="grp.tier"
                  class="p-3 rounded-lg border border-border bg-card/50 space-y-2"
                >
                  <div class="flex flex-wrap items-baseline justify-between gap-1">
                    <span class="text-xs font-bold text-foreground">{{ grp.tier }}</span>
                    <span class="text-[10px] text-muted-foreground">{{ grp.note }}</span>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <Badge
                      v-for="item in grp.variants"
                      :key="item.id"
                      :variant="item.id"
                      class="cursor-pointer"
                      @click="selectBadgeVariant(item.id, item.sample)"
                    >
                      {{ item.sample }}
                    </Badge>
                  </div>
                </div>
              </div>

              <!-- 3. INPUT, SELECT & SWITCH SHOWCASE -->
              <div v-else-if="activePrimitive === 'input-select'" class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="space-y-1.5">
                    <Label class="text-xs font-semibold">Company Name (<code class="font-mono">Input.vue</code>)</Label>
                    <Input
                      v-model="demoInputValue"
                      :disabled="demoDisabledForm"
                      placeholder="Enter company name..."
                    />
                  </div>

                  <div class="space-y-1.5">
                    <Label class="text-xs font-semibold">Pipeline Stage (<code class="font-mono">Select.vue</code>)</Label>
                    <Select v-model="demoSelectValue" :disabled="demoDisabledForm">
                      <SelectTrigger>
                        <SelectValue placeholder="Choose stage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">Stage 1: New Lead</SelectItem>
                        <SelectItem value="acknowledged">Stage 2: Acknowledged</SelectItem>
                        <SelectItem value="qualifying">Stage 3: Qualifying</SelectItem>
                        <SelectItem value="proposal">Stage 4: Proposal Sent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div class="p-3.5 rounded-lg bg-muted/40 border border-border flex flex-wrap items-center justify-between gap-4">
                  <label class="inline-flex items-center gap-2.5 text-xs font-medium cursor-pointer">
                    <Switch v-model="demoSwitchValue" :disabled="demoDisabledForm" />
                    <span>AI Auto-Reply Routing (<code class="font-mono">Switch.vue</code>)</span>
                  </label>

                  <label class="inline-flex items-center gap-2 text-xs font-medium cursor-pointer">
                    <Checkbox v-model="demoCheckboxValue" :disabled="demoDisabledForm" />
                    <span>Require Manager Approval (<code class="font-mono">Checkbox.vue</code>)</span>
                  </label>
                </div>
              </div>

              <!-- 4. CARD & METRIC SURFACE SHOWCASE -->
              <div v-else-if="activePrimitive === 'card-kpi'" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card class="p-4 space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-medium text-muted-foreground">Closed-Won Revenue</span>
                    <Badge variant="success">+18.4% MoM</Badge>
                  </div>
                  <div class="text-2xl font-bold font-mono tabular-nums text-foreground">
                    RM 428,900
                  </div>
                  <p class="text-[11px] text-muted-foreground">34 enterprise deals closed this quarter</p>
                </Card>

                <Card class="p-4 space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-medium text-muted-foreground">Median WhatsApp SLA</span>
                    <Badge variant="info">Target &lt; 5m</Badge>
                  </div>
                  <div class="text-2xl font-bold font-mono tabular-nums text-foreground">
                    01m 42s
                  </div>
                  <p class="text-[11px] text-muted-foreground">98.7% within first-response SLA</p>
                </Card>
              </div>

              <!-- 5. HIGH-DENSITY DATA TABLE SHOWCASE -->
              <div v-else-if="activePrimitive === 'table-grid'" class="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Deal &amp; Company</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead class="text-right">Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow v-for="deal in sampleDeals" :key="deal.id">
                      <TableCell>
                        <div class="font-bold text-foreground">{{ deal.company }}</div>
                        <div class="text-[11px] text-muted-foreground">{{ deal.title }}</div>
                      </TableCell>
                      <TableCell>
                        <Badge :variant="deal.tagVariant">{{ deal.stage }}</Badge>
                      </TableCell>
                      <TableCell>
                        <div class="inline-flex items-center gap-1.5">
                          <Avatar class="size-5">
                            <AvatarFallback class="text-[10px] font-bold bg-primary/10 text-primary">{{ deal.agent }}</AvatarFallback>
                          </Avatar>
                          <span class="font-mono text-[11px]">{{ deal.days }}</span>
                        </div>
                      </TableCell>
                      <TableCell class="text-right font-mono font-bold text-foreground">
                        {{ deal.value }}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <!-- 6. TABS, SLIDER & PROGRESS SHOWCASE -->
              <div v-else-if="activePrimitive === 'tabs-controls'" class="space-y-4">
                <Tabs v-model="demoTabValue" class="w-full">
                  <TabsList class="grid w-full grid-cols-3">
                    <TabsTrigger value="pipeline">Pipeline Quota</TabsTrigger>
                    <TabsTrigger value="sla">SLA Compliance</TabsTrigger>
                    <TabsTrigger value="credits">AI Credits</TabsTrigger>
                  </TabsList>
                  <TabsContent value="pipeline" class="p-4 rounded-lg border border-border bg-muted/30 space-y-3 mt-2">
                    <div class="flex items-center justify-between text-xs">
                      <span class="font-semibold">Q4 Team Quota Attainment</span>
                      <span class="font-mono font-bold text-primary">{{ demoProgressValue }}%</span>
                    </div>
                    <Progress :model-value="demoProgressValue" />
                  </TabsContent>
                  <TabsContent value="sla" class="p-4 rounded-lg border border-border bg-muted/30 space-y-2 mt-2">
                    <div class="text-xs font-semibold">Omnichannel First Response Target: 98.4%</div>
                    <p class="text-[11px] text-muted-foreground">All WhatsApp &amp; Instagram queues operating normally.</p>
                  </TabsContent>
                  <TabsContent value="credits" class="p-4 rounded-lg border border-border bg-muted/30 space-y-2 mt-2">
                    <div class="text-xs font-semibold">AI Assistant Token Pool: 14,200 / 20,000 remaining</div>
                  </TabsContent>
                </Tabs>

                <div class="space-y-2 pt-2">
                  <div class="flex justify-between text-xs">
                    <span class="font-semibold">Lead Scoring Confidence Threshold (<code class="font-mono">Slider.vue</code>)</span>
                    <span class="font-mono font-bold text-primary">{{ demoSliderValue[0] }}%</span>
                  </div>
                  <Slider v-model="demoSliderValue" :max="100" :step="1" />
                </div>
              </div>

              <!-- 7. SONNER TOAST, ALERT & DIALOG SHOWCASE -->
              <div v-else-if="activePrimitive === 'feedback-sonner'" class="space-y-4">
                <div class="space-y-2">
                  <div class="text-xs font-semibold text-foreground">Interactive Sonner Toast Triggers (<code class="font-mono">vue-sonner</code>)</div>
                  <div class="flex flex-wrap gap-2">
                    <Button variant="success" size="sm" @click="triggerDemoToast('success')">
                      <CheckCircle2 />
                      Success Toast
                    </Button>
                    <Button variant="warning" size="sm" @click="triggerDemoToast('warning')">
                      <AlertTriangle />
                      Warning Toast
                    </Button>
                    <Button variant="info" size="sm" @click="triggerDemoToast('info')">
                      <Info />
                      Info Toast
                    </Button>
                    <Button variant="destructive" size="sm" @click="triggerDemoToast('error')">
                      <XCircle />
                      Error Toast
                    </Button>
                  </div>
                </div>

                <Alert class="border-primary/25 bg-primary/5">
                  <Sparkles class="size-4 text-primary" />
                  <AlertTitle class="text-xs font-bold">Inline Status Callout (Alert.vue)</AlertTitle>
                  <AlertDescription class="text-xs text-muted-foreground">
                    Uses semantic <code class="font-mono">border-primary/25 bg-primary/5</code> with crisp 1px borders.
                  </AlertDescription>
                </Alert>

                <div>
                  <Dialog>
                    <DialogTrigger as-child>
                      <Button variant="outline" size="sm">Open Modal Dialog Preview</Button>
                    </DialogTrigger>
                    <DialogContent class="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle class="text-sm font-bold">Reassign Deal Pipeline Owner</DialogTitle>
                        <DialogDescription class="text-xs">
                          Select a sales representative to take ownership of Synergy Tech Sdn Bhd.
                        </DialogDescription>
                      </DialogHeader>
                      <div class="py-3 space-y-2">
                        <Label class="text-xs">Assigned Representative</Label>
                        <Input default-value="Ahmad Faizal (Senior AE)" />
                      </div>
                      <DialogFooter>
                        <Button variant="default" size="sm" @click="toast.success('Deal reassigned to Ahmad Faizal')">
                          Confirm Assignment
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>

            <!-- Stage Pane 2: Opposite Theme Comparison Mirror (Visible when Split Light/Dark is ON) -->
            <div
              v-if="splitLightDarkPreview"
              class="rounded-xl border border-border bg-background text-foreground p-5 space-y-4 transition-colors"
              :style="counterpartThemeVars"
            >
              <div class="flex items-center justify-between border-b border-border pb-2.5">
                <div class="flex items-center gap-2">
                  <Sun v-if="isDark" class="size-3.5 text-warning" />
                  <Moon v-else class="size-3.5 text-info" />
                  <span class="text-xs font-bold text-foreground">
                    Counterpart Theme Mirror ({{ isDark ? 'Simulated Light :root' : 'Simulated Dark .dark' }})
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="xs"
                  @click="toggleTheme"
                >
                  Swap Global Theme &rarr;
                </Button>
              </div>

              <!-- 1. MIRRORED BUTTON SHOWCASE -->
              <div v-if="activePrimitive === 'button'" class="space-y-5">
                <div class="p-6 rounded-lg bg-muted/40 border border-border flex flex-wrap items-center justify-center gap-4">
                  <Button
                    :variant="btnVariant"
                    :size="btnSize"
                    :disabled="btnDisabled || btnLoading"
                    @click="toast.success(`Clicked ${btnVariant} button in counterpart theme`)"
                  >
                    <Loader2 v-if="btnLoading" class="animate-spin" />
                    <Plus v-else-if="btnWithIcon" />
                    <span v-if="btnSize !== 'icon'">{{ btnLabel }}</span>
                  </Button>
                </div>

                <!-- All Button Variants Matrix -->
                <div class="space-y-2">
                  <div class="text-[11px] font-semibold text-muted-foreground">All 14 Button Variants Matrix ({{ isDark ? ':root' : '.dark' }})</div>
                  <div class="flex flex-wrap gap-2">
                    <Button
                      v-for="v in buttonVariantList"
                      :key="v"
                      :variant="v"
                      size="sm"
                      @click="btnVariant = v"
                    >
                      {{ v }}
                    </Button>
                  </div>
                </div>

                <!-- All Sizes Matrix -->
                <div class="space-y-2">
                  <div class="text-[11px] font-semibold text-muted-foreground">Height &amp; Density Scale (xs: 28px, sm: 32px, default: 36px, lg: 40px)</div>
                  <div class="flex flex-wrap items-center gap-2">
                    <Button variant="default" size="xs">Size xs (h-7)</Button>
                    <Button variant="default" size="sm">Size sm (h-8)</Button>
                    <Button variant="default" size="default">Default (h-9)</Button>
                    <Button variant="default" size="lg">Size lg (h-10)</Button>
                    <Button variant="outline" size="icon" title="Icon button"><Plus /></Button>
                  </div>
                </div>
              </div>

              <!-- 2. MIRRORED BADGE & TAGS SHOWCASE -->
              <div v-else-if="activePrimitive === 'badge'" class="space-y-4">
                <div class="p-5 rounded-lg bg-muted/40 border border-border flex items-center justify-center">
                  <Badge :variant="bdgVariant" class="text-xs px-3 py-1">
                    {{ bdgLabel }}
                  </Badge>
                </div>

                <!-- 4-Tier Structured Badge Hierarchy (Counterpart Theme) -->
                <div
                  v-for="grp in badgeGroups"
                  :key="grp.tier"
                  class="p-3 rounded-lg border border-border bg-card/50 space-y-2"
                >
                  <div class="flex flex-wrap items-baseline justify-between gap-1">
                    <span class="text-xs font-bold text-foreground">{{ grp.tier }}</span>
                    <span class="text-[10px] text-muted-foreground">{{ grp.note }}</span>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <Badge
                      v-for="item in grp.variants"
                      :key="item.id"
                      :variant="item.id"
                      class="cursor-pointer"
                      @click="selectBadgeVariant(item.id, item.sample)"
                    >
                      {{ item.sample }}
                    </Badge>
                  </div>
                </div>
              </div>

              <!-- 3. MIRRORED INPUT, SELECT & SWITCH SHOWCASE -->
              <div v-else-if="activePrimitive === 'input-select'" class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="space-y-1.5">
                    <Label class="text-xs font-semibold">Company Name (<code class="font-mono">Input.vue</code>)</Label>
                    <Input
                      v-model="demoInputValue"
                      :disabled="demoDisabledForm"
                      placeholder="Enter company name..."
                    />
                  </div>

                  <div class="space-y-1.5">
                    <Label class="text-xs font-semibold">Pipeline Stage (<code class="font-mono">Select.vue</code>)</Label>
                    <Select v-model="demoSelectValue" :disabled="demoDisabledForm">
                      <SelectTrigger>
                        <SelectValue placeholder="Choose stage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">Stage 1: New Lead</SelectItem>
                        <SelectItem value="acknowledged">Stage 2: Acknowledged</SelectItem>
                        <SelectItem value="qualifying">Stage 3: Qualifying</SelectItem>
                        <SelectItem value="proposal">Stage 4: Proposal Sent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div class="p-3.5 rounded-lg bg-muted/40 border border-border flex flex-wrap items-center justify-between gap-4">
                  <label class="inline-flex items-center gap-2.5 text-xs font-medium cursor-pointer">
                    <Switch v-model="demoSwitchValue" :disabled="demoDisabledForm" />
                    <span>AI Auto-Reply Routing (<code class="font-mono">Switch.vue</code>)</span>
                  </label>

                  <label class="inline-flex items-center gap-2 text-xs font-medium cursor-pointer">
                    <Checkbox v-model="demoCheckboxValue" :disabled="demoDisabledForm" />
                    <span>Require Manager Approval (<code class="font-mono">Checkbox.vue</code>)</span>
                  </label>
                </div>
              </div>

              <!-- 4. MIRRORED CARD & METRIC SURFACE SHOWCASE -->
              <div v-else-if="activePrimitive === 'card-kpi'" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card class="p-4 space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-medium text-muted-foreground">Closed-Won Revenue</span>
                    <Badge variant="success">+18.4% MoM</Badge>
                  </div>
                  <div class="text-2xl font-bold font-mono tabular-nums text-foreground">
                    RM 428,900
                  </div>
                  <p class="text-[11px] text-muted-foreground">34 enterprise deals closed this quarter</p>
                </Card>

                <Card class="p-4 space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-medium text-muted-foreground">Median WhatsApp SLA</span>
                    <Badge variant="info">Target &lt; 5m</Badge>
                  </div>
                  <div class="text-2xl font-bold font-mono tabular-nums text-foreground">
                    01m 42s
                  </div>
                  <p class="text-[11px] text-muted-foreground">98.7% within first-response SLA</p>
                </Card>
              </div>

              <!-- 5. MIRRORED HIGH-DENSITY DATA TABLE SHOWCASE -->
              <div v-else-if="activePrimitive === 'table-grid'" class="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Deal &amp; Company</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead class="text-right">Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow v-for="deal in sampleDeals" :key="deal.id">
                      <TableCell>
                        <div class="font-bold text-foreground">{{ deal.company }}</div>
                        <div class="text-[11px] text-muted-foreground">{{ deal.title }}</div>
                      </TableCell>
                      <TableCell>
                        <Badge :variant="deal.tagVariant">{{ deal.stage }}</Badge>
                      </TableCell>
                      <TableCell>
                        <div class="inline-flex items-center gap-1.5">
                          <Avatar class="size-5">
                            <AvatarFallback class="text-[10px] font-bold bg-primary/10 text-primary">{{ deal.agent }}</AvatarFallback>
                          </Avatar>
                          <span class="font-mono text-[11px]">{{ deal.days }}</span>
                        </div>
                      </TableCell>
                      <TableCell class="text-right font-mono font-bold text-foreground">
                        {{ deal.value }}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <!-- 6. MIRRORED TABS, SLIDER & PROGRESS SHOWCASE -->
              <div v-else-if="activePrimitive === 'tabs-controls'" class="space-y-4">
                <Tabs v-model="demoTabValue" class="w-full">
                  <TabsList class="grid w-full grid-cols-3">
                    <TabsTrigger value="pipeline">Pipeline Quota</TabsTrigger>
                    <TabsTrigger value="sla">SLA Compliance</TabsTrigger>
                    <TabsTrigger value="credits">AI Credits</TabsTrigger>
                  </TabsList>
                  <TabsContent value="pipeline" class="p-4 rounded-lg border border-border bg-muted/30 space-y-3 mt-2">
                    <div class="flex items-center justify-between text-xs">
                      <span class="font-semibold">Q4 Team Quota Attainment</span>
                      <span class="font-mono font-bold text-primary">{{ demoProgressValue }}%</span>
                    </div>
                    <Progress :model-value="demoProgressValue" />
                  </TabsContent>
                  <TabsContent value="sla" class="p-4 rounded-lg border border-border bg-muted/30 space-y-2 mt-2">
                    <div class="text-xs font-semibold">Omnichannel First Response Target: 98.4%</div>
                    <p class="text-[11px] text-muted-foreground">All WhatsApp &amp; Instagram queues operating normally.</p>
                  </TabsContent>
                  <TabsContent value="credits" class="p-4 rounded-lg border border-border bg-muted/30 space-y-2 mt-2">
                    <div class="text-xs font-semibold">AI Assistant Token Pool: 14,200 / 20,000 remaining</div>
                  </TabsContent>
                </Tabs>

                <div class="space-y-2 pt-2">
                  <div class="flex justify-between text-xs">
                    <span class="font-semibold">Lead Scoring Confidence Threshold (<code class="font-mono">Slider.vue</code>)</span>
                    <span class="font-mono font-bold text-primary">{{ demoSliderValue[0] }}%</span>
                  </div>
                  <Slider v-model="demoSliderValue" :max="100" :step="1" />
                </div>
              </div>

              <!-- 7. MIRRORED SONNER TOAST, ALERT & DIALOG SHOWCASE -->
              <div v-else-if="activePrimitive === 'feedback-sonner'" class="space-y-4">
                <div class="space-y-2">
                  <div class="text-xs font-semibold text-foreground">Interactive Sonner Toast Triggers (<code class="font-mono">vue-sonner</code>)</div>
                  <div class="flex flex-wrap gap-2">
                    <Button variant="success" size="sm" @click="triggerDemoToast('success')">
                      <CheckCircle2 />
                      Success Toast
                    </Button>
                    <Button variant="warning" size="sm" @click="triggerDemoToast('warning')">
                      <AlertTriangle />
                      Warning Toast
                    </Button>
                    <Button variant="info" size="sm" @click="triggerDemoToast('info')">
                      <Info />
                      Info Toast
                    </Button>
                    <Button variant="destructive" size="sm" @click="triggerDemoToast('error')">
                      <XCircle />
                      Error Toast
                    </Button>
                  </div>
                </div>

                <Alert class="border-primary/25 bg-primary/5">
                  <Sparkles class="size-4 text-primary" />
                  <AlertTitle class="text-xs font-bold">Inline Status Callout (Alert.vue)</AlertTitle>
                  <AlertDescription class="text-xs text-muted-foreground">
                    Uses semantic <code class="font-mono">border-primary/25 bg-primary/5</code> with crisp 1px borders.
                  </AlertDescription>
                </Alert>

                <div>
                  <Dialog>
                    <DialogTrigger as-child>
                      <Button variant="outline" size="sm">Open Modal Dialog Preview</Button>
                    </DialogTrigger>
                    <DialogContent class="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle class="text-sm font-bold">Reassign Deal Pipeline Owner</DialogTitle>
                        <DialogDescription class="text-xs">
                          Select a sales representative to take ownership of Synergy Tech Sdn Bhd.
                        </DialogDescription>
                      </DialogHeader>
                      <div class="py-3 space-y-2">
                        <Label class="text-xs">Assigned Representative</Label>
                        <Input default-value="Ahmad Faizal (Senior AE)" />
                      </div>
                      <DialogFooter>
                        <Button variant="default" size="sm" @click="toast.success('Deal reassigned to Ahmad Faizal')">
                          Confirm Assignment
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>

          <!-- Generated Vue 3 Code Block -->
          <Card class="p-4 space-y-2.5">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Code2 class="size-4 text-primary" />
                <span class="text-xs font-bold text-foreground">Generated Vue 3 SFC Snippet</span>
              </div>
              <Button
                variant="ghost"
                size="xs"
                @click="copyText(generatedVueSnippet, 'Vue 3 Snippet')"
              >
                <Copy class="size-3" />
                Copy Code
              </Button>
            </div>
            <pre class="p-3.5 rounded-lg bg-muted/60 border border-border text-xs font-mono text-foreground overflow-x-auto leading-relaxed">{{ generatedVueSnippet }}</pre>
          </Card>
        </div>
      </section>

      <!-- =====================================================================
           TAB 2: FULL SEARCHABLE UI COMPONENT REGISTRY (51 INSTALLED)
           ===================================================================== -->
      <section v-if="activeTab === 'catalog'" class="space-y-4">
        <Card class="p-4">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div class="flex flex-wrap items-center gap-1.5">
              <button
                v-for="cat in catalogCategories"
                :key="cat"
                type="button"
                @click="catalogCategory = cat"
                class="px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer"
                :class="
                  catalogCategory === cat
                    ? 'bg-primary text-primary-foreground shadow-soft'
                    : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
                "
              >
                {{ cat }}
              </button>
            </div>

            <div class="flex flex-wrap items-center gap-3">
              <label class="inline-flex items-center gap-2 text-xs font-medium cursor-pointer">
                <Switch v-model="catalogOnlyInstalled" />
                <span>Installed Only ({{ componentsList.filter((c) => c.installed).length }})</span>
              </label>

              <div class="relative w-64">
                <Search class="size-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
                <Input
                  v-model="catalogSearch"
                  placeholder="Search 65 UI components..."
                  class="pl-8 h-8 text-xs"
                />
              </div>
            </div>
          </div>
        </Card>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <Card
            v-for="comp in filteredCatalog"
            :key="comp.name"
            class="p-4 flex flex-col justify-between gap-3"
          >
            <div class="space-y-1.5">
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <h3 class="text-sm font-bold text-foreground">{{ comp.name }}</h3>
                  <Badge :variant="comp.installed ? 'success' : 'outline'">
                    {{ comp.installed ? 'Installed' : 'Planned' }}
                  </Badge>
                </div>
                <Badge variant="secondary">{{ comp.category }}</Badge>
              </div>
              <p class="text-xs text-muted-foreground leading-relaxed">
                {{ comp.description }}
              </p>
            </div>

            <div class="pt-2 border-t border-border flex items-center justify-between gap-2">
              <button
                type="button"
                @click="copyText(getComponentImportStatement(comp), `${comp.name} import`)"
                class="flex-1 min-w-0 flex items-center justify-between gap-1.5 px-2.5 py-1 rounded bg-muted/60 hover:bg-muted text-[11px] font-mono text-foreground truncate cursor-pointer"
                title="Click to copy import statement"
              >
                <span class="truncate">{{ getComponentImportStatement(comp) }}</span>
                <Copy class="size-3 shrink-0 text-muted-foreground" />
              </button>

              <a
                :href="comp.href"
                target="_blank"
                rel="noopener noreferrer"
                class="p-1.5 rounded border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                title="View Shadcn/Reka Docs"
              >
                <ExternalLink class="size-3.5" />
              </a>
            </div>
          </Card>
        </div>
      </section>

      <!-- =====================================================================
           TAB 3: CANONICAL CRM PATTERN BLUEPRINTS
           ===================================================================== -->
      <section v-if="activeTab === 'patterns'" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Pattern 1: Deals & Pipeline Kanban Card Specification -->
        <Card class="p-5 space-y-4">
          <div class="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h2 class="text-sm font-bold text-foreground">1. Deals &amp; Pipeline Kanban Pattern</h2>
              <p class="text-xs text-muted-foreground">
                Uses <code class="font-mono">tag-1..5</code> stage badges, <code class="font-mono">font-mono</code> currency values, and 1px card hairlines.
              </p>
            </div>
            <Button variant="outline" size="xs" @click="router.push('/deals')">
              Open /deals
              <ArrowUpRight class="size-3" />
            </Button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div
              v-for="deal in sampleDeals"
              :key="deal.id"
              class="rounded-xl border border-border bg-background p-3.5 space-y-2.5 shadow-soft hover:border-primary/40 transition-all"
            >
              <div class="flex items-center justify-between gap-1">
                <Badge :variant="deal.tagVariant">{{ deal.stage }}</Badge>
                <span
                  v-if="deal.hot"
                  class="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-warning/10 text-warning border border-warning/20 text-[10px] font-bold"
                >
                  <Flame class="size-2.5" />
                  Hot
                </span>
              </div>

              <div>
                <div class="text-xs font-bold text-foreground leading-snug">{{ deal.title }}</div>
                <div class="text-[11px] font-medium text-muted-foreground mt-0.5">{{ deal.company }}</div>
              </div>

              <div class="pt-2 border-t border-border flex items-center justify-between">
                <span class="font-mono text-xs font-bold text-foreground">{{ deal.value }}</span>
                <div class="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono">
                  <Clock class="size-3" />
                  <span>{{ deal.days }}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <!-- Pattern 2: Omnichannel WhatsApp Conversation & Multi-Mode Composer -->
        <Card class="p-5 space-y-4">
          <div class="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h2 class="text-sm font-bold text-foreground">2. Omnichannel Chat &amp; Internal Note Pattern</h2>
              <p class="text-xs text-muted-foreground">
                Outgoing bubbles use <code class="font-mono">bg-primary text-primary-foreground</code>; private notes use <code class="font-mono">bg-warning/10 text-warning</code>.
              </p>
            </div>
            <Button variant="outline" size="xs" @click="router.push('/omnichannel')">
              Open /omnichannel
              <ArrowUpRight class="size-3" />
            </Button>
          </div>

          <div class="rounded-xl border border-border bg-background p-3.5 space-y-3">
            <!-- Incoming Customer Bubble -->
            <div class="max-w-[82%] rounded-2xl rounded-tl-xs border border-border bg-card p-3 text-xs space-y-1">
              <div class="font-bold text-foreground">Dato’ Farid (Synergy Tech)</div>
              <p class="text-muted-foreground">Can we include WhatsApp AI Auto-Reply for our 12 regional branches?</p>
            </div>

            <!-- Outgoing Agent Bubble -->
            <div class="ml-auto max-w-[82%] rounded-2xl rounded-tr-xs bg-primary text-primary-foreground p-3 text-xs space-y-1">
              <p>Yes! All 12 branches are covered under the Enterprise Omnichannel tier.</p>
              <div class="text-[10px] opacity-80 text-right font-mono">14:22 • ✓✓</div>
            </div>

            <!-- Composer Switcher -->
            <div
              class="rounded-lg border p-2.5 space-y-2 transition-colors"
              :class="chatReplyMode === 'note' ? 'border-warning/40 bg-warning/5' : 'border-border bg-card'"
            >
              <div class="flex items-center justify-between">
                <div class="inline-flex rounded-md bg-muted p-0.5">
                  <button
                    type="button"
                    @click="chatReplyMode = 'reply'"
                    class="px-2.5 py-0.5 rounded text-[11px] font-semibold cursor-pointer"
                    :class="chatReplyMode === 'reply' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'"
                  >
                    WhatsApp Reply
                  </button>
                  <button
                    type="button"
                    @click="chatReplyMode = 'note'"
                    class="px-2.5 py-0.5 rounded text-[11px] font-semibold cursor-pointer"
                    :class="chatReplyMode === 'note' ? 'bg-warning text-warning-foreground' : 'text-muted-foreground'"
                  >
                    Private Team Note
                  </button>
                </div>
                <Button size="xs" :variant="chatReplyMode === 'note' ? 'warning' : 'default'" @click="toast.success('Message dispatched')">
                  <Send class="size-3" />
                  Send
                </Button>
              </div>
              <Input v-model="chatComposerText" class="h-8 text-xs" />
            </div>
          </div>
        </Card>
      </section>

      <!-- =====================================================================
           TAB 4: QUICK TOKEN STRIP & BRIDGE TO /GUIDELINES
           ===================================================================== -->
      <section v-if="activeTab === 'tokens'" class="space-y-4">
        <Card class="p-5 space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
            <div>
              <h2 class="text-sm font-bold text-foreground">Core Semantic Tokens Quick Reference</h2>
              <p class="text-xs text-muted-foreground">
                Showing Light (<code class="font-mono">:root</code>) and Dark (<code class="font-mono">.dark</code>) values side-by-side. Open <code class="font-mono">/guidelines</code> for the full 22-family Tailwind CSS v4 palette.
              </p>
            </div>
            <Button variant="default" size="sm" @click="router.push('/guidelines')">
              <Palette class="size-3.5" />
              Open Full Tailwind v4 Color Studio
              <ArrowUpRight class="size-3.5" />
            </Button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div
              v-for="token in SEMANTIC_TOKENS.slice(0, 16)"
              :key="token.id"
              class="p-3 rounded-xl border border-border bg-background flex flex-col justify-between gap-2.5"
            >
              <div class="flex items-center justify-between gap-2">
                <span class="text-xs font-bold text-foreground truncate">{{ token.name }}</span>
                <button
                  type="button"
                  @click="copyText(token.twBgClass, token.name)"
                  class="font-mono text-[10px] px-1.5 py-0.5 rounded bg-muted text-foreground hover:text-primary cursor-pointer"
                >
                  {{ token.twBgClass }}
                </button>
              </div>

              <div class="grid grid-cols-2 gap-2">
                <div
                  class="p-2 rounded-lg border border-border/60 text-[10px] font-mono"
                  :style="{ backgroundColor: token.lightOklch, color: token.lightForegroundOklch }"
                >
                  <div class="font-bold">:root</div>
                  <div class="truncate opacity-85">{{ token.tailwindMatchLight }}</div>
                </div>
                <div
                  class="p-2 rounded-lg border border-border/60 text-[10px] font-mono"
                  :style="{ backgroundColor: token.darkOklch, color: token.darkForegroundOklch }"
                >
                  <div class="font-bold">.dark</div>
                  <div class="truncate opacity-85">{{ token.tailwindMatchDark }}</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>
    </main>
  </div>
</template>
