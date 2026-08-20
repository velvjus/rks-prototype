<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { Icon } from '@iconify/vue'
import { componentsList, type DesignSystemComponent } from '@/data/componentsList'
import mockLeads from '@/data/mock/leads.json'
import mockTasks from '@/data/mock/tasks.json'
import { toast } from 'vue-sonner'
import { Toaster } from '@/components/ui/sonner'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Calendar } from '@/components/ui/calendar'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Checkbox } from '@/components/ui/checkbox'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Label } from '@/components/ui/label'
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarTrigger } from '@/components/ui/menubar'
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationFirst, PaginationItem, PaginationLast, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Toggle } from '@/components/ui/toggle'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

// Advanced UI Imports
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemText, TagsInputItemDelete } from '@/components/ui/tags-input'
import { PinInput, PinInputGroup, PinInputSlot, PinInputSeparator } from '@/components/ui/pin-input'
import { NumberField, NumberFieldContent, NumberFieldDecrement, NumberFieldIncrement, NumberFieldInput } from '@/components/ui/number-field'
import { Stepper, StepperItem, StepperTrigger, StepperTitle, StepperDescription, StepperIndicator, StepperSeparator } from '@/components/ui/stepper'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable'

import { 
  Search, 
  CalendarDays,
  ExternalLink, 
  Check, 
  Compass, 
  HelpCircle,
  Terminal,
  AlertCircle,
  FolderDot,
  FileText,
  Sliders,
  Play,
  RotateCcw,
  Sparkles,
  User,
  Plus,
  Tags,
  Hash,
  TrendingUp,
  Split,
  Code2,
  Lock,
  ChevronRight,
  Info,
  Building2,
  Users,
  Bell,
  Settings,
  ArrowRight,
  Mail,
  Puzzle,
  Copy,
  CheckCheck,
  Palette,
  Type,
  ArrowUp,
  Command,
  Download,
  BookOpen,
  FileCode,
  CheckCircle2,
  Layers,
  Activity,
  Share2,
  Flame,
  Paperclip,
  MessageSquare,
  Clock,
  FolderKanban,
  Phone,
  Crown,
  Smile,
  MoreVertical,
  Send,
  Filter
} from 'lucide-vue-next'
import { rakanSalesGuidelinesMarkdown } from '@/data/designSystemGuidelines'

// Active view modes: 'showroom' | 'catalog' | 'guidelines'
const activeTab = ref<'showroom' | 'catalog' | 'guidelines'>('showroom')

// Guidelines View Mode: 'rendered' | 'raw'
const guidelinesViewMode = ref<'rendered' | 'raw'>('rendered')
const isCopiedFullMarkdown = ref(false)

const copyFullMarkdown = () => {
  navigator.clipboard.writeText(rakanSalesGuidelinesMarkdown).then(() => {
    isCopiedFullMarkdown.value = true
    toast.success('RakanSales System Prompt Copied! 📋', {
      description: 'Complete Markdown guideline copied to clipboard. Ready to paste into LLMs or project briefs.'
    })
    setTimeout(() => { isCopiedFullMarkdown.value = false }, 2500)
  }).catch(() => {
    toast.error('Failed to copy to clipboard')
  })
}

const downloadMarkdownFile = () => {
  const blob = new Blob([rakanSalesGuidelinesMarkdown], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'RakanSales_Design_System_Prompt_Nova_v4.md'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  toast.success('Downloaded RakanSales_Design_System_Prompt_Nova_v4.md!')
}

// Scroll Container & Scroll Spy States
const scrollContainer = ref<HTMLElement | null>(null)
const showBackToTop = ref(false)
const scrollProgress = ref(0)
const activeShowroomSection = ref('sec-inputs')
const searchInputRef = ref<HTMLInputElement | null>(null)

// Catalog Filters
const searchQuery = ref('')
const selectedCategory = ref('All')
const selectedStatus = ref('All')

const categories = [
  'All',
  'Inputs',
  'Data Display',
  'Feedback',
  'Navigation',
  'Overlay',
  'Layout',
  'Utility'
]

// Visual approval audit playground states
const isDarkMode = ref(false)
const densitySetting = ref<'compact' | 'standard' | 'comfortable'>('standard')
const radiusValue = ref([10]) // in pixels (default is 10px / 0.625rem)

// Sync --radius to document root live
watch(radiusValue, (newVal) => {
  const remValue = newVal[0] / 16
  document.documentElement.style.setProperty('--radius', `${remValue}rem`)
})

// Dynamic Layout Density padding classes mapping
const densityClasses = computed(() => {
  if (densitySetting.value === 'compact') {
    return {
      cardContent: 'p-4 space-y-4 text-xs',
      cardHeader: 'py-2.5 px-4',
      sectionSpacing: 'space-y-4',
      itemPadding: 'p-2',
      buttonSize: 'xs' as const,
      inputHeight: 'h-8 text-xs',
      tableCell: 'py-1.5 pl-4'
    }
  } else if (densitySetting.value === 'comfortable') {
    return {
      cardContent: 'p-8 space-y-8 text-base',
      cardHeader: 'py-6 px-8',
      sectionSpacing: 'space-y-8',
      itemPadding: 'p-5',
      buttonSize: 'default' as const,
      inputHeight: 'h-11 text-sm',
      tableCell: 'py-3.5 pl-5'
    }
  }
  // Standard default
  return {
    cardContent: 'p-6 space-y-6 text-sm',
    cardHeader: 'py-4.5 px-6',
    sectionSpacing: 'space-y-6',
    itemPadding: 'p-4',
    buttonSize: 'sm' as const,
    inputHeight: 'h-9.5 text-xs',
    tableCell: 'py-2.5 pl-4'
  }
})

// Showroom interactive state populated from centralized mock data
const todoItems = ref(mockTasks)

const notificationsEnabled = ref(true)
const devToolsEnabled = ref(false)
const sliderValue = ref([45])
const roleSelection = ref('agent')
const progressValue = ref(68)
const collapsibleOpen = ref(false)
const calendarDate = ref<any>(undefined)

// Advanced Component Reactive States
const tagsValue = ref(['CRM', 'Enterprise', 'Lead'])
const pinValue = ref([])
const numberValue = ref(15)
const activeStep = ref(2)

// Pagination interactive active state
const activePage = ref(1)
watch(activePage, (newPage) => {
  toast.info(`Switched to page ${newPage}`, {
    description: `Displaying leads index offset ${(newPage - 1) * 10} - ${newPage * 10} of 100.`
  })
})

// Premium UI/UX Interactions States

// 1. Spline Revenue Chart Hover Interactivity & Multi-Metric / Timeframe Toggle
const activeChartMetric = ref<'revenue' | 'conversions'>('revenue')
const selectedTimeframe = ref<'Q1' | 'Q2' | 'YTD'>('YTD')

const chartDatasets = {
  Q1: {
    revenue: [
      { x: 0,    y: 150,  val: 12050, month: 'Jan' },
      { x: 500,  y: 100,  val: 15400, month: 'Feb' },
      { x: 1000, y: 55,   val: 18200, month: 'Mar' }
    ],
    conversions: [
      { x: 0,    y: 165,  val: 45,  month: 'Jan' },
      { x: 500,  y: 110,  val: 78,  month: 'Feb' },
      { x: 1000, y: 40,   val: 112, month: 'Mar' }
    ],
    pathRevenue: 'M 0 150 C 250 150, 250 100, 500 100 C 750 100, 750 55, 1000 55',
    areaRevenue: 'M 0 150 C 250 150, 250 100, 500 100 C 750 100, 750 55, 1000 55 L 1000 200 L 0 200 Z',
    pathConversions: 'M 0 165 C 250 165, 250 110, 500 110 C 750 110, 750 40, 1000 40',
    areaConversions: 'M 0 165 C 250 165, 250 110, 500 110 C 750 110, 750 40, 1000 40 L 1000 200 L 0 200 Z'
  },
  Q2: {
    revenue: [
      { x: 0,    y: 130,  val: 21900, month: 'Apr' },
      { x: 500,  y: 60,   val: 24050, month: 'May' },
      { x: 1000, y: 25,   val: 28900, month: 'Jun (Est)' }
    ],
    conversions: [
      { x: 0,    y: 120,  val: 95,  month: 'Apr' },
      { x: 500,  y: 45,   val: 168, month: 'May' },
      { x: 1000, y: 20,   val: 210, month: 'Jun (Est)' }
    ],
    pathRevenue: 'M 0 130 C 250 130, 250 60, 500 60 C 750 60, 750 25, 1000 25',
    areaRevenue: 'M 0 130 C 250 130, 250 60, 500 60 C 750 60, 750 25, 1000 25 L 1000 200 L 0 200 Z',
    pathConversions: 'M 0 120 C 250 120, 250 45, 500 45 C 750 45, 750 20, 1000 20',
    areaConversions: 'M 0 120 C 250 120, 250 45, 500 45 C 750 45, 750 20, 1000 20 L 1000 200 L 0 200 Z'
  },
  YTD: {
    revenue: [
      { x: 0,    y: 150,  val: 12050, month: 'Jan' },
      { x: 250,  y: 100,  val: 15400, month: 'Feb' },
      { x: 500,  y: 125,  val: 18200, month: 'Mar' },
      { x: 750,  y: 62.5, val: 21900, month: 'Apr' },
      { x: 1000, y: 37.5, val: 24050, month: 'May' }
    ],
    conversions: [
      { x: 0,    y: 165,  val: 45,  month: 'Jan' },
      { x: 250,  y: 120,  val: 78,  month: 'Feb' },
      { x: 500,  y: 95,   val: 112, month: 'Mar' },
      { x: 750,  y: 115,  val: 95,  month: 'Apr' },
      { x: 1000, y: 45,   val: 168, month: 'May' }
    ],
    pathRevenue: 'M 0 150 C 125 150, 125 100, 250 100 C 375 100, 375 125, 500 125 C 625 125, 625 62.5, 750 62.5 C 875 62.5, 875 37.5, 1000 37.5',
    areaRevenue: 'M 0 150 C 125 150, 125 100, 250 100 C 375 100, 375 125, 500 125 C 625 125, 625 62.5, 750 62.5 C 875 62.5, 875 37.5, 1000 37.5 L 1000 200 L 0 200 Z',
    pathConversions: 'M 0 165 C 125 165, 125 120, 250 120 C 375 120, 375 95, 500 95 C 625 95, 625 115, 750 115 C 875 115, 875 45, 1000 45',
    areaConversions: 'M 0 165 C 125 165, 125 120, 250 120 C 375 120, 375 95, 500 95 C 625 95, 625 115, 750 115 C 875 115, 875 45, 1000 45 L 1000 200 L 0 200 Z'
  }
}

const currentDataset = computed(() => chartDatasets[selectedTimeframe.value])

const chartData = computed(() => {
  return activeChartMetric.value === 'revenue' 
    ? currentDataset.value.revenue 
    : currentDataset.value.conversions
})

const activePath = computed(() => {
  return activeChartMetric.value === 'revenue'
    ? currentDataset.value.pathRevenue
    : currentDataset.value.pathConversions
})

const activeArea = computed(() => {
  return activeChartMetric.value === 'revenue'
    ? currentDataset.value.areaRevenue
    : currentDataset.value.areaConversions
})

const hoveredPointIndex = ref<number | null>(null)
const isChartHovered = ref(false)
const hoverPointData = computed(() => {
  if (hoveredPointIndex.value === null) return null
  return chartData.value[hoveredPointIndex.value]
})

// 2. Advanced Tags Autocomplete
const availableTags = ['CRM', 'Enterprise', 'Lead', 'Developer', 'Urgent', 'Follow-up', 'Design', 'Frontend', 'Sales']
const tagInputFocused = ref(false)
const tagSearchQuery = ref('')
const filteredAvailableTags = computed(() => {
  const query = tagSearchQuery.value.toLowerCase().trim()
  return availableTags.filter(tag => {
    if (tagsValue.value.includes(tag)) return false
    return !query || tag.toLowerCase().includes(query)
  })
})
const addAutocompleteTag = (tag: string) => {
  if (!tagsValue.value.includes(tag)) {
    tagsValue.value.push(tag)
  }
  tagSearchQuery.value = ''
  tagInputFocused.value = false
}

const handleTagInputBlur = () => {
  setTimeout(() => {
    tagInputFocused.value = false
  }, 200)
}


// 3. OTP PIN Paste Handler & Physical Shake feedback
const pinError = ref(false)
const handlePinPaste = (event: ClipboardEvent) => {
  event.preventDefault()
  const text = event.clipboardData?.getData('text') || ''
  const cleanDigits = text.replace(/\D/g, '').slice(0, 4)
  if (cleanDigits.length === 4) {
    pinValue.value = cleanDigits.split('') as any
    toast.success('OTP auto-filled successfully!')
  } else {
    pinError.value = true
    setTimeout(() => { pinError.value = false }, 500)
    toast.error('Invalid OTP', { description: 'Pasted content must be exactly 4 digits.' })
  }
}

// 4. Double-Click Splitting Sidebar Panel snaps collapse
const isSidebarCollapsed = ref(false)
const toggleSidebarCollapse = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
  toast.success(isSidebarCollapsed.value ? 'Left Panel Collapsed' : 'Left Panel Restored')
}

// 5. Deal Stage Inline Update Table Action, Multi-Select & Advanced Data Filtering
const leads = ref(mockLeads)
const leadSearchQuery = ref('')
const selectedLeadStageFilter = ref('All')
const selectedLeadIds = ref<number[]>([])

const filteredLeads = computed(() => {
  return leads.value.filter((lead: any) => {
    const matchesSearch = lead.name.toLowerCase().includes(leadSearchQuery.value.toLowerCase())
    const matchesStage = selectedLeadStageFilter.value === 'All' || lead.stage === selectedLeadStageFilter.value
    return matchesSearch && matchesStage
  })
})

const isAllLeadsSelected = computed(() => {
  return filteredLeads.value.length > 0 && filteredLeads.value.every((l: any) => selectedLeadIds.value.includes(l.id))
})

const toggleSelectAllLeads = () => {
  if (isAllLeadsSelected.value) {
    selectedLeadIds.value = []
  } else {
    selectedLeadIds.value = filteredLeads.value.map((l: any) => l.id)
  }
}

const toggleSelectLead = (id: number) => {
  const idx = selectedLeadIds.value.indexOf(id)
  if (idx > -1) {
    selectedLeadIds.value.splice(idx, 1)
  } else {
    selectedLeadIds.value.push(id)
  }
}

const clearLeadSelection = () => {
  selectedLeadIds.value = []
}

const bulkUpdateLeadStage = (newStage: string) => {
  const count = selectedLeadIds.value.length
  leads.value.forEach((lead: any) => {
    if (selectedLeadIds.value.includes(lead.id)) {
      lead.stage = newStage
    }
  })
  toast.success(`Updated ${count} leads to stage "${newStage}"!`)
  selectedLeadIds.value = []
}

const totalPipelineValue = computed(() => {
  const budgetMap: Record<number, number> = { 1: 24500, 2: 18200, 3: 42000, 4: 8400 }
  return filteredLeads.value.reduce((acc: number, l: any) => acc + (budgetMap[l.id] || 15000), 0)
})

const updateLeadStage = (leadId: number, newStage: string) => {
  const lead = leads.value.find((l: any) => l.id === leadId)
  if (lead) {
    lead.stage = newStage
    toast.success(`Updated lead stage to ${newStage}!`)
  }
}

// 6. Live Theme Accent Color Switcher in Top Sandbox
const selectedAccent = ref<'green' | 'emerald' | 'indigo' | 'amber'>('green')
const changeAccent = (accent: 'green' | 'emerald' | 'indigo' | 'amber') => {
  selectedAccent.value = accent
  const root = document.documentElement
  if (accent === 'green') {
    root.style.setProperty('--primary', 'oklch(0.527 0.154 150.069)')
    root.style.setProperty('--primary-foreground', 'oklch(0.985 0 0)')
  } else if (accent === 'emerald') {
    root.style.setProperty('--primary', 'oklch(0.596 0.145 163.225)')
    root.style.setProperty('--primary-foreground', 'oklch(0.985 0 0)')
  } else if (accent === 'indigo') {
    root.style.setProperty('--primary', 'oklch(0.511 0.262 276.966)')
    root.style.setProperty('--primary-foreground', 'oklch(0.985 0 0)')
  } else if (accent === 'amber') {
    root.style.setProperty('--primary', 'oklch(0.666 0.179 58.318)')
    root.style.setProperty('--primary-foreground', 'oklch(0.145 0 0)')
  }
  toast.success(`Theme accent preview: ${accent.toUpperCase()}`)
}

// 7. Interactive Kanban Deal Pipeline Board State (Synced 1:1 with DealsView.vue)
interface KanbanDeal {
  id: number
  title: string
  clientName: string
  owner: string
  value: number
  description: string
  avatar: string
  attachments: number
  comments: number
  age: string
  hotLead: string
  stage: 'New' | 'Acknowledged' | 'Qualifying' | 'Proposal / Quotation' | 'Follow Up'
}

const kanbanStages = ['New', 'Acknowledged', 'Qualifying', 'Proposal / Quotation', 'Follow Up'] as const

const stageColorConfig: Record<string, { border: string; bg: string; text: string; headerBar: string }> = {
  New: { border: 'border-t-[#3b82f6]', bg: 'bg-[#3b82f6]/10', text: 'text-[#3b82f6]', headerBar: '#3b82f6' },
  Acknowledged: { border: 'border-t-[#00D2C4]', bg: 'bg-[#00D2C4]/10', text: 'text-[#00D2C4]', headerBar: '#00D2C4' },
  Qualifying: { border: 'border-t-[#FFCC00]', bg: 'bg-[#FFCC00]/10', text: 'text-[#FFCC00]', headerBar: '#FFCC00' },
  'Proposal / Quotation': { border: 'border-t-[#FF8800]', bg: 'bg-[#FF8800]/10', text: 'text-[#FF8800]', headerBar: '#FF8800' },
  'Follow Up': { border: 'border-t-[#10B981]', bg: 'bg-[#10B981]/10', text: 'text-[#10B981]', headerBar: '#10B981' }
}

const kanbanDeals = ref<KanbanDeal[]>([
  {
    id: 99,
    title: 'KK Steel Manufacturing Web Design',
    owner: 'Ahmad Faizal',
    value: 90000,
    description: 'Web Design & SEO',
    avatar: '/avatars/agent_10_malay_male_coral.png',
    attachments: 2,
    comments: 4,
    age: '3m',
    hotLead: 'Hot',
    stage: 'Qualifying',
    clientName: 'Mel Wong'
  },
  {
    id: 1,
    title: 'Tech Solutions Malaysia Sdn Bhd',
    owner: 'Ahmad Faizal',
    value: 35500,
    description: 'Cybersecurity Assessment',
    avatar: '/avatars/agent_10_malay_male_coral.png',
    attachments: 1,
    comments: 3,
    age: '10d',
    hotLead: '1h',
    stage: 'New',
    clientName: 'Muhammad Ali'
  },
  {
    id: 2,
    title: 'Sistem Pintar Sdn Bhd',
    owner: 'Siti Nur Aisyah',
    value: 50000,
    description: 'Data Analytics Suite',
    avatar: '/avatars/agent_11_chinese_female_mint.png',
    attachments: 1,
    comments: 2,
    age: '15d',
    hotLead: '1.5h',
    stage: 'New',
    clientName: 'Sarah Tan'
  },
  {
    id: 3,
    title: 'Inovasi Digital Sdn Bhd',
    owner: 'Rajesh Kumar',
    value: 28000,
    description: 'Software Development',
    avatar: '/avatars/agent_12_indian_male_lavender.png',
    attachments: 1,
    comments: 4,
    age: '5d',
    hotLead: '1h',
    stage: 'Acknowledged',
    clientName: 'Rajesh Ganesan'
  },
  {
    id: 4,
    title: 'Harimau Ventures Group',
    owner: 'Lim Wei Jie',
    value: 33000,
    description: 'AI Implementation',
    avatar: '/avatars/agent_14_chinese_male_skyblue.png',
    attachments: 1,
    comments: 4,
    age: '5d',
    hotLead: '1h',
    stage: 'Qualifying',
    clientName: 'Lim Guan Eng'
  },
  {
    id: 5,
    title: 'Tech Innovators Inc.',
    owner: 'Nurul Huda',
    value: 45000,
    description: 'Blockchain Research',
    avatar: '/avatars/agent_13_malay_female_hijab_peach.png',
    attachments: 2,
    comments: 3,
    age: '3w',
    hotLead: '2d',
    stage: 'Proposal / Quotation',
    clientName: 'Nurul Izzah'
  },
  {
    id: 6,
    title: 'Kreatif IT Sdn Bhd',
    owner: 'Mohd Hafiz',
    value: 60000,
    description: 'IT Infrastructure Setup',
    avatar: '/avatars/agent_16_malay_male_teal.png',
    attachments: 1,
    comments: 1,
    age: '20d',
    hotLead: '4h',
    stage: 'Follow Up',
    clientName: 'Mohd Faiz'
  }
])

const moveKanbanDeal = (dealId: number, direction: 'prev' | 'next') => {
  const deal = kanbanDeals.value.find(d => d.id === dealId)
  if (!deal) return
  const currIdx = kanbanStages.indexOf(deal.stage)
  const nextIdx = direction === 'next' ? currIdx + 1 : currIdx - 1
  if (nextIdx >= 0 && nextIdx < kanbanStages.length) {
    deal.stage = kanbanStages[nextIdx]
    toast.success(`Moved "${deal.title}" to ${deal.stage}!`)
    if (deal.stage === 'Follow Up') {
      celebrateWon()
    }
  }
}

const getStageDeals = (stage: string) => {
  return kanbanDeals.value.filter(d => d.stage === stage)
}

const getStageWeightedValueSum = (stage: string) => {
  const total = getStageDeals(stage).reduce((sum, d) => sum + d.value, 0)
  if (total >= 1000) {
    return `RM ${(total / 1000).toFixed(0)}k`
  }
  return `RM ${total}`
}

// 8. Omnichannel WhatsApp Chat Simulator State (Synced 100% 1:1 with OmnichannelView.vue)
interface OmnichannelConv {
  id: string
  sender: string
  company: string
  phone: string
  email: string
  dealValue: string
  stage: string
  platform: 'WhatsApp' | 'Telegram' | 'Mail'
  avatar: string
  lastMessage: string
  time: string
  unreadCount: number
  isVip?: boolean
  isLate?: boolean
  assignedTo: string
  tags: string[]
}

const omnichannelConversations = ref<OmnichannelConv[]>([
  {
    id: 'conv-1',
    sender: 'Mel Wong',
    company: 'KK Steel Manufacturing',
    phone: '+6012 3456 7890',
    email: 'melwong@kksteel.com',
    dealValue: 'RM 90,000',
    stage: 'Qualifying Stage',
    platform: 'WhatsApp',
    avatar: '/avatars/agent_11_chinese_female_mint.png',
    lastMessage: 'Does this tier include WhatsApp API broadcast automation?',
    time: '14:25',
    unreadCount: 2,
    isVip: true,
    isLate: true,
    assignedTo: 'Ahmad Faizal',
    tags: ['VIP', 'High Priority', 'Steel & Manufacturing']
  },
  {
    id: 'conv-2',
    sender: 'Muhammad Ali',
    company: 'Tech Solutions Malaysia',
    phone: '+6017 8899 1234',
    email: 'ali@techsolutions.my',
    dealValue: 'RM 35,500',
    stage: 'Proposal / Quotation',
    platform: 'WhatsApp',
    avatar: '/avatars/agent_10_malay_male_coral.png',
    lastMessage: 'Received the cybersecurity audit report, thank you!',
    time: '12:40',
    unreadCount: 0,
    isVip: false,
    isLate: false,
    assignedTo: 'Ahmad Faizal',
    tags: ['Enterprise SLA', 'Cybersecurity']
  },
  {
    id: 'conv-3',
    sender: 'Sarah Tan',
    company: 'Sistem Pintar Sdn Bhd',
    phone: '+6019 4567 8901',
    email: 'sarah@sistempintar.com',
    dealValue: 'RM 50,000',
    stage: 'New Inquiries',
    platform: 'WhatsApp',
    avatar: '/avatars/agent_15_indian_female_yellow.png',
    lastMessage: 'Can we schedule a demo call tomorrow at 3 PM?',
    time: 'Yesterday',
    unreadCount: 0,
    isVip: true,
    isLate: false,
    assignedTo: 'Siti Nur Aisyah',
    tags: ['Analytics Suite', 'Warm Lead']
  }
])

const activeOmnichannelConvId = ref('conv-1')
const activeOmnichannelConv = computed(() => {
  return omnichannelConversations.value.find(c => c.id === activeOmnichannelConvId.value) || omnichannelConversations.value[0]
})

const omnichannelSearch = ref('')
const omnichannelFilter = ref<'all' | 'late' | 'unread'>('all')

const filteredOmnichannelConversations = computed(() => {
  let list = omnichannelConversations.value
  if (omnichannelSearch.value.trim()) {
    const q = omnichannelSearch.value.toLowerCase()
    list = list.filter(c => c.sender.toLowerCase().includes(q) || c.company.toLowerCase().includes(q) || c.lastMessage.toLowerCase().includes(q))
  }
  if (omnichannelFilter.value === 'late') return list.filter(c => c.isLate)
  if (omnichannelFilter.value === 'unread') return list.filter(c => c.unreadCount > 0)
  return list
})

interface ChatMessage {
  id: string
  sender: string
  isSelf: boolean
  text: string
  time: string
  type?: 'message' | 'system-log' | 'private-note'
  status?: 'sent' | 'delivered' | 'read'
  quote?: { sender: string; text: string }
  attachment?: { name: string; size: string; type: string }
}

const chatMessagesByConv = ref<Record<string, ChatMessage[]>>({
  'conv-1': [
    {
      id: 'm1',
      sender: 'Mel Wong',
      isSelf: false,
      text: 'Hi Ahmad! We reviewed the initial web design brief for KK Steel Manufacturing. Can you share the formal quotation and scope breakdown for the SEO integration?',
      time: '14:20'
    },
    {
      id: 'm2',
      sender: 'You',
      isSelf: true,
      text: 'Hi Mel! Absolutely. I have prepared the quotation including the responsive design suite and technical SEO setup.',
      time: '14:22',
      status: 'read'
    },
    {
      id: 'm3',
      sender: 'You',
      isSelf: true,
      text: 'Here is the detailed quotation document for KK Steel.',
      time: '14:23',
      status: 'read',
      attachment: { name: 'KK_Steel_WebDesign_SEO_Quotation.pdf', size: '2.4 MB', type: 'PDF' }
    },
    {
      id: 'sys1',
      sender: 'System',
      isSelf: false,
      text: 'Ahmad Faizal was assigned to this lead. Associated Tags: VIP, High Priority',
      time: '14:24',
      type: 'system-log'
    },
    {
      id: 'm4',
      sender: 'Mel Wong',
      isSelf: false,
      text: 'Thanks Ahmad! Does this tier include WhatsApp API broadcast automation for our sales reps?',
      time: '14:25',
      quote: {
        sender: 'You',
        text: 'Here is the detailed quotation document for KK Steel.'
      }
    }
  ],
  'conv-2': [
    {
      id: 'm2-1',
      sender: 'Muhammad Ali',
      isSelf: false,
      text: 'Hi Ahmad, we are looking for the updated cybersecurity audit contract.',
      time: '12:30'
    },
    {
      id: 'm2-2',
      sender: 'You',
      isSelf: true,
      text: 'Dispatched the latest audit report to your email and attached here as well.',
      time: '12:38',
      status: 'read'
    },
    {
      id: 'm2-3',
      sender: 'Muhammad Ali',
      isSelf: false,
      text: 'Received the cybersecurity audit report, thank you!',
      time: '12:40'
    }
  ],
  'conv-3': [
    {
      id: 'm3-1',
      sender: 'Sarah Tan',
      isSelf: false,
      text: 'Hi Siti, we want to explore the Data Analytics package.',
      time: 'Yesterday'
    },
    {
      id: 'm3-2',
      sender: 'Sarah Tan',
      isSelf: false,
      text: 'Can we schedule a demo call tomorrow at 3 PM?',
      time: 'Yesterday'
    }
  ]
})

const currentChatMessages = computed(() => {
  return chatMessagesByConv.value[activeOmnichannelConvId.value] || []
})

const chatComposerText = ref('')
const omnichannelComposerMode = ref<'reply' | 'note'>('reply')
const isAiAutoReplyOn = ref(true)
const isHumanResponseBannerOpen = ref(true)
const isBotTyping = ref(false)

const sendChatMessage = (customText?: string) => {
  const textToSend = customText || chatComposerText.value.trim()
  if (!textToSend) return
  const convId = activeOmnichannelConvId.value
  if (!chatMessagesByConv.value[convId]) {
    chatMessagesByConv.value[convId] = []
  }

  const isNote = omnichannelComposerMode.value === 'note'
  const newMsg: ChatMessage = {
    id: 'm' + Date.now(),
    sender: isNote ? 'Private Note (Ahmad Faizal)' : 'You',
    isSelf: !isNote,
    text: textToSend,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    type: isNote ? 'private-note' : 'message',
    status: 'sent'
  }
  chatMessagesByConv.value[convId].push(newMsg)
  if (!customText) chatComposerText.value = ''
  setTimeout(() => {
    newMsg.status = 'read'
  }, 600)

  if (!isNote) {
    isBotTyping.value = true
    setTimeout(() => {
      isBotTyping.value = false
      chatMessagesByConv.value[convId].push({
        id: 'bot' + Date.now(),
        sender: activeOmnichannelConv.value.sender,
        isSelf: false,
        text: 'Perfect! That matches our operational requirements. Let\'s proceed with scheduling the project kickoff call.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      })
      toast.success(`New WhatsApp reply from ${activeOmnichannelConv.value.sender}!`)
    }, 1500)
  } else {
    toast.success('Private internal note added to thread!')
  }
}

// 9. Interactive Command Palette (Cmd+K Spotlight) State
const isCommandPaletteOpen = ref(false)
const commandPaletteQuery = ref('')

const commandPaletteActions = [
  { id: 'act-lead', title: 'Create New Lead Account', category: 'Quick Actions', icon: 'lucide:user-plus', shortcut: 'N', action: () => { toast.success('Opened: Create New Lead Modal'); isCommandPaletteOpen.value = false } },
  { id: 'act-wa', title: 'Dispatch WhatsApp Broadcast', category: 'Quick Actions', icon: 'simple-icons:whatsapp', shortcut: 'W', action: () => { toast.info('Opened: WhatsApp Campaign Composer'); isCommandPaletteOpen.value = false } },
  { id: 'act-export', title: 'Export Pipeline CSV Report', category: 'Quick Actions', icon: 'lucide:download', shortcut: 'E', action: () => { toast.success('Exporting Pipeline Data...'); isCommandPaletteOpen.value = false } },
  { id: 'deal-1', title: 'KK Steel Manufacturing (RM 90,000)', category: 'Recent Deals', icon: 'lucide:building-2', shortcut: '⏎', action: () => { toast.info('Opening KK Steel Manufacturing deal...'); isCommandPaletteOpen.value = false } },
  { id: 'deal-2', title: 'Tech Solutions Malaysia (RM 35,500)', category: 'Recent Deals', icon: 'lucide:building-2', shortcut: '⏎', action: () => { toast.info('Opening Tech Solutions Malaysia deal...'); isCommandPaletteOpen.value = false } },
  { id: 'nav-kanban', title: 'Jump to Kanban Pipeline Board', category: 'Navigation', icon: 'lucide:kanban', shortcut: 'G K', action: () => { scrollToSection('sec-kanban'); isCommandPaletteOpen.value = false } },
  { id: 'nav-chat', title: 'Jump to WhatsApp Chat Simulator', category: 'Navigation', icon: 'simple-icons:whatsapp', shortcut: 'G W', action: () => { scrollToSection('sec-omnichannel'); isCommandPaletteOpen.value = false } },
  { id: 'nav-guidelines', title: 'View System Guidelines & Prompt', category: 'Navigation', icon: 'lucide:book-open', shortcut: 'G G', action: () => { activeTab.value = 'guidelines'; isCommandPaletteOpen.value = false } },
]

const filteredCommandPaletteActions = computed(() => {
  const q = commandPaletteQuery.value.toLowerCase().trim()
  if (!q) return commandPaletteActions
  return commandPaletteActions.filter(a => a.title.toLowerCase().includes(q) || a.category.toLowerCase().includes(q))
})

const openCommandPalette = () => {
  isCommandPaletteOpen.value = true
  commandPaletteQuery.value = ''
}


// 6. Stepper "Won" stage celebration timers
const showWonCelebration = ref(false)
const celebrateWon = () => {
  showWonCelebration.value = true
  setTimeout(() => { showWonCelebration.value = false }, 3000)
  toast.success('Deal Won! 🎉', {
    description: 'Your sales funnel victory has been recorded.'
  })
}

// Watch stepper to celebrate when "Won" (step 3) is selected
watch(activeStep, (newStep) => {
  if (newStep === 3) {
    celebrateWon()
  }
})

// Simulated loading state for button showcase
const isButtonLoading = ref(false)
const triggerLoadingShowcase = () => {
  if (isButtonLoading.value) return
  isButtonLoading.value = true
  toast.info('Simulating API Submission...')
  setTimeout(() => {
    isButtonLoading.value = false
    toast.success('API submission completed successfully!')
  }, 2000)
}

// Code Inspector Expanders
const inspectorOpen = ref({
  inputs: false,
  overlays: false,
  data: false,
  feedback: false
})

const toggleInspector = (key: 'inputs' | 'overlays' | 'data' | 'feedback') => {
  inspectorOpen.value[key] = !inspectorOpen.value[key]
}

const incrementProgress = () => {
  if (progressValue.value >= 100) {
    progressValue.value = 0
  } else {
    progressValue.value += 8
  }
}

const triggerNotification = () => {
  toast.success('Visual Overview Sync Successful!', {
    description: '42 components are verified and compiled natively in Vue 3.',
    action: {
      label: 'Dismiss',
      onClick: () => {}
    }
  })
}

// Copy Import Map for visual checkmark state
const copiedImportMap = ref<Record<string, boolean>>({})

const getComponentImportSnippet = (comp: DesignSystemComponent) => {
  const kebab = comp.name.toLowerCase().replace(/\s+/g, '-')
  const pascal = comp.name.replace(/\s+/g, '')
  return `import { ${pascal} } from '@/components/ui/${kebab}'`
}

const copyComponentImport = (comp: DesignSystemComponent, e?: Event) => {
  if (e) e.stopPropagation()
  const snippet = getComponentImportSnippet(comp)
  navigator.clipboard.writeText(snippet).then(() => {
    copiedImportMap.value[comp.name] = true
    toast.success(`Copied import statement for ${comp.name}!`, {
      description: snippet
    })
    setTimeout(() => {
      copiedImportMap.value[comp.name] = false
    }, 2000)
  }).catch(() => {
    toast.error('Failed to copy to clipboard')
  })
}

const scrollToSection = (id: string) => {
  activeShowroomSection.value = id
  const element = document.getElementById(id)
  if (element && scrollContainer.value) {
    const containerRect = scrollContainer.value.getBoundingClientRect()
    const elRect = element.getBoundingClientRect()
    const targetScrollTop = scrollContainer.value.scrollTop + (elRect.top - containerRect.top) - 100
    scrollContainer.value.scrollTo({ top: Math.max(0, targetScrollTop), behavior: 'smooth' })
  }
}

const scrollToTop = () => {
  scrollContainer.value?.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleScroll = () => {
  if (!scrollContainer.value) return
  const { scrollTop, scrollHeight, clientHeight } = scrollContainer.value
  showBackToTop.value = scrollTop > 280
  const maxScroll = scrollHeight - clientHeight
  scrollProgress.value = maxScroll > 0 ? Math.min(100, Math.round((scrollTop / maxScroll) * 100)) : 0

  if (activeTab.value === 'showroom') {
    const sections = [
      'sec-inputs',
      'sec-overlays',
      'sec-data',
      'sec-feedback',
      'sec-iconography',
      'sec-colors-typography',
      'sec-dashboard-widgets',
      'sec-kanban',
      'sec-omnichannel'
    ]
    const containerRect = scrollContainer.value.getBoundingClientRect()
    for (const secId of sections) {
      const el = document.getElementById(secId)
      if (el) {
        const rect = el.getBoundingClientRect()
        const relativeTop = rect.top - containerRect.top
        const relativeBottom = rect.bottom - containerRect.top
        if (relativeTop <= 160 && relativeBottom > 60) {
          activeShowroomSection.value = secId
          break
        }
      }
    }
  }
}

const copyCodeSnippet = (snippet: string) => {
  navigator.clipboard.writeText(snippet).then(() => {
    toast.success('Code copied to clipboard!', {
      description: 'You can now paste the ESM component block directly into your Vue file.'
    })
  }).catch((err: any) => {
    toast.error('Failed to copy code', {
      description: err?.message || 'Clipboard access denied.'
    })
  })
}

const triggerToast = (type: 'success' | 'info' | 'warning' | 'error') => {
  if (type === 'success') {
    toast.success('Action Completed Successfully', {
      description: 'The CRM pipeline record has been synchronized with all cluster nodes.',
      action: {
        label: 'Undo',
        onClick: () => toast.info('Action undone')
      }
    })
  } else if (type === 'info') {
    toast.info('System Diagnostic Update', {
      description: 'Sync background worker has successfully flushed 12 inactive memory pages.',
    })
  } else if (type === 'warning') {
    toast.warning('API Rate-Limit Alert', {
      description: 'Standard tier quota is at 84%. Consider top-up to prevent API request queuing.',
    })
  } else if (type === 'error') {
    toast.error('Connection Failed', {
      description: 'Failed to establish tunnel handshake with API proxy cluster nodes.',
      action: {
        label: 'Retry',
        onClick: () => toast.success('Connection restored!')
      }
    })
  }
}

const viewInShowroom = (category: string) => {
  activeTab.value = 'showroom'
  let sectionId = 'sec-inputs'
  const catLower = category.toLowerCase().trim()
  if (catLower.includes('input')) {
    sectionId = 'sec-inputs'
  } else if (catLower.includes('overlay')) {
    sectionId = 'sec-overlays'
  } else if (catLower.includes('data')) {
    sectionId = 'sec-data'
  } else if (catLower.includes('feedback') || catLower.includes('nav')) {
    sectionId = 'sec-feedback'
  } else if (catLower.includes('icon') || catLower.includes('brand') || catLower.includes('visual')) {
    sectionId = 'sec-iconography'
  } else if (catLower.includes('color') || catLower.includes('type') || catLower.includes('font') || catLower.includes('typography')) {
    sectionId = 'sec-colors-typography'
  } else if (catLower.includes('addon') || catLower.includes('add-on') || catLower.includes('utility') || catLower.includes('layout') || catLower.includes('widget') || catLower.includes('dashboard')) {
    sectionId = 'sec-dashboard-widgets'
  }
  
  nextTick(() => {
    setTimeout(() => {
      scrollToSection(sectionId)
    }, 120)
  })
}

// Global Keyboard Shortcuts: Alt+1/2/3 (Tabs), Ctrl+K / Cmd+K (Command Palette), '/' (Search)
const handleGlobalKeyDown = (e: KeyboardEvent) => {
  const isInputActive = ['INPUT', 'TEXTAREA', 'SELECT'].includes((document.activeElement?.tagName || ''))
  
  if (e.altKey && e.key === '1') {
    e.preventDefault()
    activeTab.value = 'showroom'
    toast.info('Switched to Interactive Showroom (Alt+1)')
  } else if (e.altKey && e.key === '2') {
    e.preventDefault()
    activeTab.value = 'catalog'
    toast.info('Switched to Components Catalog (Alt+2)')
  } else if (e.altKey && e.key === '3') {
    e.preventDefault()
    activeTab.value = 'guidelines'
    toast.info('Switched to System Guidelines & Prompt (Alt+3)')
  }

  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    isCommandPaletteOpen.value = !isCommandPaletteOpen.value
    if (isCommandPaletteOpen.value) {
      commandPaletteQuery.value = ''
    }
  } else if (e.key === 'Escape' && isCommandPaletteOpen.value) {
    isCommandPaletteOpen.value = false
  } else if (e.key === '/' && !isInputActive) {
    e.preventDefault()
    if (activeTab.value !== 'catalog') {
      activeTab.value = 'catalog'
    }
    nextTick(() => {
      searchInputRef.value?.focus()
      searchInputRef.value?.select()
    })
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeyDown)
})

// Components list is imported from '@/data/componentsList'

const filteredComponents = computed(() => {
  return componentsList.filter(item => {
    // 1. Search Query filter
    const query = searchQuery.value.toLowerCase().trim()
    const matchesSearch = !query || 
      item.name.toLowerCase().includes(query) || 
      item.description.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    
    // 2. Category filter
    const matchesCategory = selectedCategory.value === 'All' || 
      item.category === selectedCategory.value

    // 3. Status filter
    const matchesStatus = selectedStatus.value === 'All' || 
      (selectedStatus.value === 'Installed' && item.installed) || 
      (selectedStatus.value === 'Registry' && !item.installed)

    return matchesSearch && matchesCategory && matchesStatus
  })
})

const categoryCounts = computed(() => {
  const counts: Record<string, number> = { All: componentsList.length }
  for (const cat of categories) {
    if (cat !== 'All') {
      counts[cat] = componentsList.filter(c => c.category === cat).length
    }
  }
  return counts
})
</script>

<template>
  <div
    ref="scrollContainer"
    @scroll="handleScroll"
    class="h-full w-full overflow-y-auto scroll-smooth bg-gradient-to-tr from-slate-50 via-gray-50/80 to-slate-100 dark:from-slate-950 dark:via-slate-900/90 dark:to-slate-950 text-foreground transition-colors duration-200"
  >
    <div class="p-6 md:p-8 space-y-8 max-w-7xl mx-auto relative pb-28">
      
      <!-- Top Header & Navigation -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-gray-200 dark:border-border">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-foreground tracking-tight mb-1 flex items-center gap-2.5">
            Design System Console
            <span class="inline-flex items-center text-xs font-bold bg-primary/10 text-primary px-2.5 py-0.5 rounded-full border border-primary/20">
              Nova v4.0
            </span>
          </h1>
          <p class="text-xs md:text-sm text-gray-500 dark:text-muted-foreground font-medium">Complete component catalog & interactive visual showroom for RakanSales CRM.</p>
        </div>

        <!-- Tab & Link Navigation -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 self-stretch md:self-auto">
          <!-- Quick Copy Prompt Button -->
          <button
            @click="copyFullMarkdown"
            :class="[
              'px-3.5 py-2 text-xs font-bold rounded-xl border transition-all duration-200 flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-95',
              isCopiedFullMarkdown 
                ? 'bg-emerald-500 text-white border-emerald-600' 
                : 'bg-white dark:bg-card hover:bg-gray-50 dark:hover:bg-muted text-gray-700 dark:text-foreground border-gray-200 dark:border-border'
            ]"
            title="Copy complete RakanSales Markdown guidelines / system prompt for LLMs or other projects"
          >
            <component :is="isCopiedFullMarkdown ? CheckCheck : Copy" class="w-4 h-4 text-emerald-500" :class="{ 'text-white': isCopiedFullMarkdown }" />
            <span>{{ isCopiedFullMarkdown ? 'Prompt Copied! 🎉' : 'Copy System Prompt' }}</span>
          </button>

          <!-- 3-Way Tab Switcher -->
          <div class="flex items-center p-1 rounded-xl border border-gray-200 dark:border-border bg-gray-200/60 dark:bg-muted">
            <button 
              @click="activeTab = 'showroom'"
              :class="[
                'px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-1.5',
                activeTab === 'showroom' 
                  ? 'bg-white dark:bg-card text-gray-900 dark:text-foreground shadow-sm' 
                  : 'text-gray-600 dark:text-muted-foreground hover:text-gray-900 dark:hover:text-foreground'
              ]"
            >
              <Sparkles class="w-3.5 h-3.5 text-emerald-500" />
              <span>Showroom</span>
              <kbd class="hidden xl:inline text-[9px] font-mono px-1 py-0.2 bg-muted-foreground/10 text-muted-foreground rounded">Alt+1</kbd>
            </button>
            <button 
              @click="activeTab = 'catalog'"
              :class="[
                'px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-1.5',
                activeTab === 'catalog' 
                  ? 'bg-white dark:bg-card text-gray-900 dark:text-foreground shadow-sm' 
                  : 'text-gray-600 dark:text-muted-foreground hover:text-gray-900 dark:hover:text-foreground'
              ]"
            >
              <FolderDot class="w-3.5 h-3.5 text-primary" />
              <span>Catalog</span>
              <kbd class="hidden xl:inline text-[9px] font-mono px-1 py-0.2 bg-muted-foreground/10 text-muted-foreground rounded">Alt+2</kbd>
            </button>
            <button 
              @click="activeTab = 'guidelines'"
              :class="[
                'px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-1.5',
                activeTab === 'guidelines' 
                  ? 'bg-white dark:bg-card text-gray-900 dark:text-foreground shadow-sm' 
                  : 'text-gray-600 dark:text-muted-foreground hover:text-gray-900 dark:hover:text-foreground'
              ]"
            >
              <BookOpen class="w-3.5 h-3.5 text-blue-500" />
              <span>Guidelines</span>
              <kbd class="hidden xl:inline text-[9px] font-mono px-1 py-0.2 bg-muted-foreground/10 text-muted-foreground rounded">Alt+3</kbd>
            </button>
          </div>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════════════════
           TAB 1: COMPONENTS CATALOG EXPLORER
      ════════════════════════════════════════════════════════════════ -->
      <div v-if="activeTab === 'catalog'" class="space-y-6 animate-in fade-in duration-250">
        
        <!-- Statistics Summary Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="bg-white dark:bg-card p-5 rounded-2xl border border-gray-200 dark:border-border flex items-center gap-4 shadow-sm">
            <div class="p-3 bg-primary/10 rounded-xl text-primary flex-shrink-0">
              <FolderDot class="w-6 h-6" />
            </div>
            <div>
              <div class="text-2xl font-bold text-gray-900 dark:text-foreground leading-none">{{ componentsList.length }}</div>
              <div class="text-xs font-semibold text-gray-500 dark:text-muted-foreground mt-1">Total Cataloged</div>
            </div>
          </div>

          <div class="bg-white dark:bg-card p-5 rounded-2xl border border-gray-200 dark:border-border flex items-center gap-4 shadow-sm">
            <div class="p-3 bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400 flex-shrink-0">
              <Check class="w-6 h-6 stroke-[3]" />
            </div>
            <div>
              <div class="text-2xl font-bold text-gray-900 dark:text-foreground leading-none">{{ componentsList.filter(c => c.installed).length }}</div>
              <div class="text-xs font-semibold text-gray-500 dark:text-muted-foreground mt-1">Natively Installed (Vue 3)</div>
            </div>
          </div>

          <div class="bg-white dark:bg-card p-5 rounded-2xl border border-gray-200 dark:border-border flex items-center gap-4 shadow-sm">
            <div class="p-3 bg-amber-500/10 rounded-xl text-amber-600 dark:text-amber-400 flex-shrink-0">
              <Compass class="w-6 h-6" />
            </div>
            <div>
              <div class="text-2xl font-bold text-gray-900 dark:text-foreground leading-none">{{ componentsList.filter(c => !c.installed).length }}</div>
              <div class="text-xs font-semibold text-gray-500 dark:text-muted-foreground mt-1">Registry References</div>
            </div>
          </div>
        </div>

        <!-- Search & Dynamic Filter Controls -->
        <div class="space-y-4 bg-white dark:bg-card p-5 rounded-2xl border border-gray-200 dark:border-border shadow-sm">
          <div class="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            
            <!-- Global Search Field with Keyboard Shortcut -->
            <div class="relative flex-1">
              <Search class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                ref="searchInputRef"
                v-model="searchQuery"
                type="text" 
                placeholder="Search components, keywords, categories (Press / or Ctrl+K)..." 
                class="w-full pl-10 pr-24 py-2.5 bg-gray-50 dark:bg-muted/60 border border-gray-200 dark:border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-gray-900 dark:text-foreground placeholder:text-gray-400"
              />
              <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                <button 
                  v-if="searchQuery" 
                  @click="searchQuery = ''" 
                  class="text-xs font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer px-1.5 py-0.5"
                >
                  Clear
                </button>
                <kbd class="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono font-bold text-gray-400 bg-gray-100 dark:bg-muted border border-gray-200 dark:border-border rounded-md select-none">
                  <Command class="w-2.5 h-2.5" />K
                </kbd>
              </div>
            </div>

            <!-- Status Filter Switcher -->
            <div class="flex items-center bg-gray-100 dark:bg-muted p-1 rounded-xl self-stretch lg:self-auto">
              <button 
                @click="selectedStatus = 'All'"
                :class="[
                  'flex-1 lg:flex-initial px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 cursor-pointer',
                  selectedStatus === 'All' 
                    ? 'bg-white dark:bg-card text-gray-900 dark:text-foreground shadow-sm' 
                    : 'text-gray-500 dark:text-muted-foreground hover:text-gray-900 dark:hover:text-foreground'
                ]"
              >
                All ({{ componentsList.length }})
              </button>
              <button 
                @click="selectedStatus = 'Installed'"
                :class="[
                  'flex-1 lg:flex-initial px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 cursor-pointer',
                  selectedStatus === 'Installed' 
                    ? 'bg-white dark:bg-card text-gray-900 dark:text-foreground shadow-sm' 
                    : 'text-gray-500 dark:text-muted-foreground hover:text-gray-900 dark:hover:text-foreground'
                ]"
              >
                Installed ({{ componentsList.filter(c => c.installed).length }})
              </button>
              <button 
                @click="selectedStatus = 'Registry'"
                :class="[
                  'flex-1 lg:flex-initial px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 cursor-pointer',
                  selectedStatus === 'Registry' 
                    ? 'bg-white dark:bg-card text-gray-900 dark:text-foreground shadow-sm' 
                    : 'text-gray-500 dark:text-muted-foreground hover:text-gray-900 dark:hover:text-foreground'
                ]"
              >
                Registry ({{ componentsList.filter(c => !c.installed).length }})
              </button>
            </div>
          </div>

          <!-- Category Horizontal Pills with Counts -->
          <div class="flex flex-wrap gap-2 border-t border-gray-100 dark:border-border pt-4">
            <button 
              v-for="cat in categories" 
              :key="cat"
              @click="selectedCategory = cat"
              :class="[
                'px-3.5 py-1.5 text-xs font-medium rounded-full border transition-all cursor-pointer duration-150 flex items-center gap-1.5',
                selectedCategory === cat 
                  ? 'bg-primary border-primary text-white font-semibold shadow-sm' 
                  : 'bg-gray-50 dark:bg-muted/40 border-gray-200 dark:border-border text-gray-600 dark:text-muted-foreground hover:bg-gray-100 dark:hover:bg-muted hover:text-gray-900 dark:hover:text-foreground'
              ]"
            >
              <span>{{ cat }}</span>
              <span 
                :class="[
                  'text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold',
                  selectedCategory === cat 
                    ? 'bg-white/20 text-white' 
                    : 'bg-gray-200 dark:bg-muted text-gray-500 dark:text-muted-foreground'
                ]"
              >
                {{ categoryCounts[cat] || 0 }}
              </span>
            </button>
          </div>
        </div>

        <!-- Empty Search Fallback State -->
        <div v-if="filteredComponents.length === 0" class="text-center py-16 bg-white dark:bg-card rounded-2xl border border-dashed border-gray-200 dark:border-border">
          <HelpCircle class="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3 animate-pulse" />
          <h3 class="text-base font-bold text-gray-900 dark:text-foreground">No components match your search</h3>
          <p class="text-xs text-gray-500 dark:text-muted-foreground mt-1 max-w-sm mx-auto leading-relaxed">Try adjusting your keywords or clearing the category and status filters.</p>
          <button 
            @click="searchQuery = ''; selectedCategory = 'All'; selectedStatus = 'All'" 
            class="mt-5 px-5 py-2 bg-gray-900 hover:bg-gray-800 dark:bg-muted dark:hover:bg-muted/80 text-white rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer shadow-sm"
          >
            Reset All Filters
          </button>
        </div>

        <!-- Components Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="comp in filteredComponents" 
            :key="comp.name"
            class="group flex flex-col justify-between p-5 bg-white dark:bg-card border border-gray-200 dark:border-border rounded-2xl hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 relative overflow-hidden"
          >
            <!-- Left accent bar for installed components -->
            <div v-if="comp.installed" class="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>

            <div>
              <div class="flex justify-between items-center gap-2 mb-3">
                <span class="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 bg-gray-100 dark:bg-muted text-gray-600 dark:text-muted-foreground rounded-md">
                  {{ comp.category }}
                </span>
                
                <span 
                  v-if="comp.installed"
                  class="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800"
                >
                  <Check class="w-3 h-3 stroke-[2.5]" />
                  Installed (Vue 3)
                </span>
                <span 
                  v-else
                  class="text-[10px] font-medium text-gray-400 dark:text-muted-foreground bg-gray-50 dark:bg-muted/50 px-2 py-0.5 rounded-full border border-gray-100 dark:border-border"
                >
                  Registry
                </span>
              </div>

              <div class="flex items-center justify-between gap-1.5 mb-1.5">
                <h3 class="font-bold text-gray-900 dark:text-foreground text-base tracking-tight group-hover:text-primary transition-colors">
                  {{ comp.name }}
                </h3>
              </div>

              <p class="text-xs text-gray-500 dark:text-muted-foreground line-clamp-2 leading-relaxed mb-4">
                {{ comp.description }}
              </p>
            </div>

            <!-- Action Toolbar per Card -->
            <div class="border-t border-gray-100 dark:border-border pt-3 mt-2 flex items-center justify-between gap-2 text-xs">
              
              <!-- Copy ESM Import Button -->
              <button
                @click="copyComponentImport(comp, $event)"
                :title="'Copy: ' + getComponentImportSnippet(comp)"
                class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-50 dark:bg-muted/60 hover:bg-gray-100 dark:hover:bg-muted text-gray-600 dark:text-muted-foreground text-[11px] font-medium transition-colors cursor-pointer border border-gray-200 dark:border-border"
              >
                <component :is="copiedImportMap[comp.name] ? CheckCheck : Copy" class="w-3.5 h-3.5 text-primary" />
                <span>{{ copiedImportMap[comp.name] ? 'Copied' : 'Copy Import' }}</span>
              </button>

              <!-- Showroom Demo Link / Registry Link -->
              <button
                v-if="comp.installed"
                @click="viewInShowroom(comp.category)"
                class="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-bold text-xs cursor-pointer group-hover:translate-x-0.5 transition-transform"
              >
                <span>Live Demo</span>
                <Sparkles class="w-3.5 h-3.5 text-emerald-500" />
              </button>
              <a
                v-else
                :href="comp.href"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1 text-gray-500 dark:text-muted-foreground hover:text-primary font-medium text-xs group-hover:translate-x-0.5 transition-transform"
              >
                <span>Docs</span>
                <ExternalLink class="w-3.5 h-3.5" />
              </a>

            </div>
          </div>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════════════════
           TAB 2: INTERACTIVE VISUAL SHOWROOM
      ════════════════════════════════════════════════════════════════ -->
    <div v-if="activeTab === 'showroom'" class="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      <!-- Overview Banner -->
      <div class="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-zinc-950 text-white p-7 rounded-3xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <!-- Shiny backdrop pulse glow -->
        <div class="absolute -right-16 -top-16 w-48 h-48 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute -left-16 -bottom-16 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl animate-pulse"></div>

        <div class="space-y-2 relative z-10">
          <div class="flex items-center gap-2.5">
            <span class="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-wider bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/25 uppercase">
              <span class="size-2 bg-emerald-500 rounded-full animate-ping"></span>
              LIVE DIAGNOSTICS ACTIVE
            </span>
            <span class="text-[10px] font-semibold text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700 uppercase tracking-wider">
              51 SFC Elements Compiled
            </span>
          </div>
          <h2 class="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            Showroom & Live Diagnostics Console
          </h2>
          <p class="text-xs text-slate-400 max-w-xl leading-relaxed">
            Interact with the custom front-end wrapper components. Toggle interactive states to audit rendering compliance and custom style overrides natively.
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-3 relative z-10 self-stretch sm:self-auto">
          <Button 
            @click="triggerNotification" 
            variant="primary" 
            class="font-semibold text-xs px-4 py-2.5 bg-primary hover:bg-primary-dark text-white border-transparent cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
          >
            <Activity class="w-4 h-4" />
            <span>Diagnostics Scan</span>
          </Button>
          <button 
            @click="activeTab = 'guidelines'" 
            class="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-800 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 transition-all duration-150 cursor-pointer shadow-sm"
          >
            <BookOpen class="w-4 h-4 text-emerald-400" />
            <span>System Guidelines & Prompt ↗</span>
          </button>
        </div>
      </div>

      <!-- Visual Audit Interactive Sandbox Panel -->
      <div class="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col xl:flex-row gap-6 justify-between items-stretch xl:items-center relative z-10 shadow-sm">
        
        <!-- Theme Mode Toggle -->
        <div class="flex items-center gap-3 flex-1 min-w-[200px]">
          <div class="p-2.5 bg-primary/10 rounded-xl text-primary flex-shrink-0">
            <Sparkles class="w-5 h-5" />
          </div>
          <div>
            <Label class="text-xs font-semibold text-muted-foreground">Theme Preview</Label>
            <div class="flex items-center gap-1 mt-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
              <button 
                @click="isDarkMode = false"
                :class="[
                  'px-2.5 py-1 text-xs font-medium rounded-lg transition-all duration-150 cursor-pointer',
                  !isDarkMode 
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-semibold' 
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                ]"
              >
                🌞 Light
              </button>
              <button 
                @click="isDarkMode = true"
                :class="[
                  'px-2.5 py-1 text-xs font-medium rounded-lg transition-all duration-150 cursor-pointer',
                  isDarkMode 
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-semibold' 
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                ]"
              >
                🌙 Dark
              </button>
            </div>
          </div>
        </div>

        <!-- Live Accent Color Switcher -->
        <div class="flex items-center gap-3 flex-1 min-w-[220px]">
          <div class="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400 flex-shrink-0">
            <Palette class="w-5 h-5" />
          </div>
          <div>
            <Label class="text-xs font-semibold text-muted-foreground">Brand Accent Tint</Label>
            <div class="flex items-center gap-1 mt-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
              <button 
                v-for="acc in [
                  { id: 'green', label: 'Nova', color: '#008236' },
                  { id: 'emerald', label: 'Emerald', color: '#10b981' },
                  { id: 'indigo', label: 'Indigo', color: '#6366f1' },
                  { id: 'amber', label: 'Amber', color: '#f59e0b' }
                ] as const"
                :key="acc.id"
                @click="changeAccent(acc.id)"
                :class="[
                  'px-2 py-1 text-[11px] font-medium rounded-lg transition-all duration-150 cursor-pointer flex items-center gap-1',
                  selectedAccent === acc.id 
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-semibold' 
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                ]"
              >
                <span class="size-2 rounded-full shrink-0" :style="{ backgroundColor: acc.color }"></span>
                <span>{{ acc.label }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- UI Density Switcher -->
        <div class="flex items-center gap-3 flex-1 min-w-[220px]">
          <div class="p-2.5 bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400 flex-shrink-0">
            <Sliders class="w-5 h-5" />
          </div>
          <div>
            <Label class="text-xs font-semibold text-muted-foreground">UI Density</Label>
            <div class="flex items-center gap-1 mt-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
              <button 
                v-for="d in ['compact', 'standard', 'comfortable'] as const"
                :key="d"
                @click="densitySetting = d"
                :class="[
                  'px-2.5 py-1 text-xs font-medium rounded-lg capitalize transition-all duration-150 cursor-pointer',
                  densitySetting === d 
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-semibold' 
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                ]"
              >
                {{ d }}
              </button>
            </div>
          </div>
        </div>

        <!-- Dynamic Border Radius Slider -->
        <div class="flex items-center gap-3 flex-1 min-w-[200px]">
          <div class="p-2.5 bg-amber-500/10 rounded-xl text-amber-600 dark:text-amber-400 flex-shrink-0">
            <Layers class="w-5 h-5" />
          </div>
          <div class="flex-1 space-y-1.5">
            <div class="flex justify-between items-center text-xs">
              <Label class="font-semibold text-muted-foreground">Corner Radius</Label>
              <span class="font-mono font-bold text-primary text-[11px]">{{ radiusValue[0] }}px</span>
            </div>
            <Slider 
              v-model="radiusValue" 
              :min="0" 
              :max="16" 
              :step="2" 
              class="w-full cursor-pointer py-1"
            />
          </div>
        </div>

      </div>

      <!-- Showroom Category Quick Navigation (Sticky with ScrollSpy) -->
      <div class="sticky top-2 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 p-2 rounded-2xl flex flex-wrap gap-1.5 items-center justify-center shadow-sm animate-in fade-in duration-200">
        <span class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2 select-none">Quick Jump:</span>
        <button 
          @click="scrollToSection('sec-inputs')" 
          :class="[
            'px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 border',
            activeShowroomSection === 'sec-inputs'
              ? 'bg-primary text-white border-primary shadow-sm'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 border-transparent'
          ]"
        >
          <Sliders class="w-3.5 h-3.5" />
          Inputs
        </button>
        <button 
          @click="scrollToSection('sec-overlays')" 
          :class="[
            'px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 border',
            activeShowroomSection === 'sec-overlays'
              ? 'bg-primary text-white border-primary shadow-sm'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 border-transparent'
          ]"
        >
          <Sparkles class="w-3.5 h-3.5 text-emerald-400" />
          Overlays
        </button>
        <button 
          @click="scrollToSection('sec-data')" 
          :class="[
            'px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 border',
            activeShowroomSection === 'sec-data'
              ? 'bg-primary text-white border-primary shadow-sm'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 border-transparent'
          ]"
        >
          <TrendingUp class="w-3.5 h-3.5 text-emerald-400" />
          Data Display
        </button>
        <button 
          @click="scrollToSection('sec-feedback')" 
          :class="[
            'px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 border',
            activeShowroomSection === 'sec-feedback'
              ? 'bg-primary text-white border-primary shadow-sm'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 border-transparent'
          ]"
        >
          <Sliders class="w-3.5 h-3.5 text-amber-400" />
          Feedback & Nav
        </button>
        <button 
          @click="scrollToSection('sec-iconography')" 
          :class="[
            'px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 border',
            activeShowroomSection === 'sec-iconography'
              ? 'bg-primary text-white border-primary shadow-sm'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 border-transparent'
          ]"
        >
          <Compass class="w-3.5 h-3.5" />
          Iconography
        </button>
        <button 
          @click="scrollToSection('sec-colors-typography')" 
          :class="[
            'px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 border',
            activeShowroomSection === 'sec-colors-typography'
              ? 'bg-primary text-white border-primary shadow-sm'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 border-transparent'
          ]"
        >
          <Palette class="w-3.5 h-3.5" />
          Colors & Type
        </button>
        <button 
          @click="scrollToSection('sec-dashboard-widgets')" 
          :class="[
            'px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 border',
            activeShowroomSection === 'sec-dashboard-widgets'
              ? 'bg-primary text-white border-primary shadow-sm'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 border-transparent'
          ]"
        >
          <Puzzle class="w-3.5 h-3.5 text-emerald-400" />
          Dashboard Elements
        </button>
        <button 
          @click="scrollToSection('sec-kanban')" 
          :class="[
            'px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 border',
            activeShowroomSection === 'sec-kanban'
              ? 'bg-primary text-white border-primary shadow-sm'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 border-transparent'
          ]"
        >
          <Icon icon="lucide:kanban" class="w-3.5 h-3.5 text-blue-500" />
          Kanban Pipeline
        </button>
        <button 
          @click="scrollToSection('sec-omnichannel')" 
          :class="[
            'px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 border',
            activeShowroomSection === 'sec-omnichannel'
              ? 'bg-primary text-white border-primary shadow-sm'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 border-transparent'
          ]"
        >
          <Icon icon="simple-icons:whatsapp" class="w-3.5 h-3.5 text-[#25D366]" />
          WhatsApp Simulator
        </button>
        <button 
          @click="openCommandPalette" 
          class="px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 border border-primary/30 bg-primary/10 text-primary hover:bg-primary hover:text-white ml-1 shadow-sm"
        >
          <Command class="w-3.5 h-3.5" />
          <span>Spotlight (Ctrl+K)</span>
        </button>
      </div>

      <!-- Visual Showroom Container Sandbox Frame -->
      <div 
        :class="[ 'rounded-3xl transition-colors duration-300 space-y-8 p-6 md:p-8 border ', isDarkMode ? 'dark bg-background border-border text-foreground' : 'bg-white/60 border-slate-200 text-slate-900 ' ]"
      >
        <div class="flex justify-between items-center px-4 py-2.5 rounded-2xl animate-in fade-in duration-200 border"
          :class="isDarkMode ? 'bg-muted/40 border-border' : 'bg-slate-50 border-slate-200'">
          <span class="text-[10px] font-semibold flex items-center gap-1.5 whitespace-nowrap tracking-wider uppercase" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
            <span class="size-2 rounded-full animate-ping" :class="isDarkMode ? 'bg-emerald-500' : 'bg-primary'"></span>
            THEME PREVIEW ENVIRONMENT ACTIVE
          </span>
          <span class="text-[10px] font-mono font-semibold whitespace-nowrap tracking-wider" :class="isDarkMode ? 'text-slate-500' : 'text-slate-400'">RADIX + SHADCN COMPLIANCE VALIDATION</span>
        </div>

        <!-- Main Showroom List - spacious 1-column sequential flow -->
        <div class="space-y-10">
            
            <!-- Category 1: Inputs & Controls -->
            <Card id="sec-inputs" class="scroll-mt-24 border-border/70 hover:border-border transition-all duration-300 overflow-hidden bg-card/95 backdrop-blur-sm">
              <CardHeader :class="[densityClasses.cardHeader, 'border-b border-border/60 bg-muted/40 py-4.5 px-6 flex flex-row items-center justify-between gap-4']">
                <div class="space-y-1">
                  <div class="flex items-center gap-2 text-foreground">
                    <Sliders class="w-4.5 h-4.5 text-primary stroke-[2.25]" />
                    <CardTitle class="text-base font-semibold tracking-tight">1. Inputs & Controls</CardTitle>
                  </div>
                  <CardDescription class="text-xs text-muted-foreground">Interactive buttons, fields, toggles, selectors, and tag editors.</CardDescription>
                </div>
                <button 
                  @click="toggleInspector('inputs')" 
                  class="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-secondary hover:bg-secondary/80 rounded-lg text-xs font-semibold text-secondary-foreground cursor-pointer transition-colors border border-border"
                >
                  <Code2 class="w-3.5 h-3.5" />
                  {{ inspectorOpen.inputs ? 'Hide Code' : 'Inspect ESM' }}
                </button>
              </CardHeader>

              <!-- Collapsible Code Inspector Block -->
              <div 
                v-if="inspectorOpen.inputs" 
                class="border-b border-slate-800 bg-slate-900 text-slate-350 p-5 font-mono text-[10px] leading-relaxed space-y-3 animate-in slide-in-from-top-2 duration-200"
              >
                <div class="flex justify-between items-center">
                  <div class="text-[9px] font-bold tracking-widest text-emerald-400 uppercase">ESM Implementation Code</div>
                  <button 
                    @click="copyCodeSnippet(`import { Button } from '@/components/ui/button'\nimport { TagsInput } from '@/components/ui/tags-input'\nimport { PinInput } from '@/components/ui/pin-input'\n\n<!-- 10 Custom brand buttons, reactive tags list, and secure OTP grids -->`)"
                    class="px-2 py-1 bg-slate-800 hover:bg-slate-700 active:bg-slate-650 rounded text-[9px] font-bold text-slate-300 border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Copy class="w-3 h-3 text-emerald-400" />
                    Copy
                  </button>
                </div>
                <pre class="overflow-x-auto bg-slate-950 p-3 rounded-lg border border-slate-800/80"><code><span class="text-amber-400">import</span> { Button } <span class="text-amber-400">from</span> <span class="text-emerald-300">'@/components/ui/button'</span>
<span class="text-amber-400">import</span> { TagsInput } <span class="text-amber-400">from</span> <span class="text-emerald-300">'@/components/ui/tags-input'</span>
<span class="text-amber-400">import</span> { PinInput } <span class="text-amber-400">from</span> <span class="text-emerald-300">'@/components/ui/pin-input'</span>

<span class="text-slate-400">&lt;!-- 10 Custom brand buttons, reactive tags list, and secure OTP grids --&gt;</span></code></pre>
              </div>

              <CardContent :class="[densityClasses.cardContent, 'dark:text-slate-200']">
                
                <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pt-2">
                  
                  <!-- Buttons Grid - spans full width -->
                  <div class="col-span-1 md:col-span-2 xl:col-span-3 space-y-3">
                    <div class="flex justify-between items-center">
                      <Label class="text-xs font-medium text-foreground">Button System</Label>
                      <span class="text-[9px] font-bold px-2 py-0.5 bg-primary/10 text-primary rounded-md uppercase tracking-wider">10 Core Variants</span>
                    </div>
                    <div class="bg-muted/40 p-4 rounded-2xl border border-border/60 flex flex-wrap gap-2.5 items-center">
                      <div class="w-full text-[10px] font-bold text-muted-foreground uppercase mb-1">Standard Presets</div>
                      <Button :size="densityClasses.buttonSize" class="transition-all duration-150 active:scale-[0.97] hover:scale-[1.01] cursor-pointer">Primary Default</Button>
                      <Button variant="outline" :size="densityClasses.buttonSize" class="transition-all duration-150 active:scale-[0.97] hover:scale-[1.01] cursor-pointer">Outline</Button>
                      <Button variant="secondary" :size="densityClasses.buttonSize" class="transition-all duration-150 active:scale-[0.97] hover:scale-[1.01] cursor-pointer">Lime Sec</Button>
                      <Button variant="destructive" :size="densityClasses.buttonSize" class="transition-all duration-150 active:scale-[0.97] hover:scale-[1.01] cursor-pointer">Danger Muted</Button>
                      <Button variant="ghost" :size="densityClasses.buttonSize" class="transition-all duration-150 active:scale-[0.97] hover:scale-[1.01] cursor-pointer">Ghost</Button>
                      
                      <div class="w-full border-t border-border/50 my-1"></div>
                      <div class="w-full text-[10px] font-bold text-muted-foreground uppercase mb-1">RKS Premium Brand Skins & Interactive States</div>
                      <Button variant="primary" :size="densityClasses.buttonSize" class="transition-all duration-200 active:scale-[0.97] hover:scale-[1.01] ease-out cursor-pointer">RKS Green</Button>
                      <Button variant="gradient" :size="densityClasses.buttonSize" class="transition-all duration-500 active:scale-[0.97] hover:scale-[1.01] ease-out bg-gradient-to-r from-emerald-500 via-primary to-emerald-600 bg-[size:200%] hover:bg-right cursor-pointer">RKS Gradient</Button>
                      <Button variant="success" :size="densityClasses.buttonSize" class="transition-all duration-200 active:scale-[0.97] hover:scale-[1.01] ease-out cursor-pointer">RKS Success</Button>
                      <Button variant="danger" :size="densityClasses.buttonSize" class="transition-all duration-200 active:scale-[0.97] hover:scale-[1.01] ease-out cursor-pointer">RKS Danger</Button>
                      <Button variant="dark" :size="densityClasses.buttonSize" class="transition-all duration-200 active:scale-[0.97] hover:scale-[1.01] ease-out cursor-pointer">Dark Charcoal</Button>
                      
                      <!-- Dynamic Loading Showcase Button -->
                      <Button 
                        variant="primary" 
                        :size="densityClasses.buttonSize"
                        :disabled="isButtonLoading"
                        @click="triggerLoadingShowcase"
                        class="relative overflow-hidden transition-all duration-200 active:scale-[0.97] hover:scale-[1.01] ease-out cursor-pointer"
                      >
                        <Icon v-if="isButtonLoading" icon="lucide:loader-2" class="w-3.5 h-3.5 mr-1.5 animate-spin text-white" />
                        {{ isButtonLoading ? 'Submitting...' : 'Interactive Submit' }}
                      </Button>
                    </div>
                  </div>

                  <!-- Checkboxes -->
                  <div class="space-y-3">
                    <div class="flex justify-between items-center">
                      <Label class="text-xs font-medium text-foreground">Checkboxes (Task List)</Label>
                    </div>
                    <div class="space-y-1.5 bg-muted/40 p-3 rounded-2xl border border-border/60">
                      <div v-for="item in todoItems" :key="item.id" class="group flex items-center justify-between text-xs p-1.5 rounded-xl hover:bg-card/75 dark:hover:bg-slate-900/60 border border-transparent hover:border-border/30 transition-all duration-150">
                        <div class="flex items-center space-x-2.5">
                          <Checkbox :id="'todo-' + item.id" :checked="item.checked" @update:checked="item.checked = !item.checked" />
                          <label :for="'todo-' + item.id" class="relative overflow-hidden inline-flex items-center cursor-pointer">
                            <span :class="['font-semibold cursor-pointer select-none transition-all duration-300', item.checked ? 'text-muted-foreground/50' : 'text-foreground']">
                              {{ item.text }}
                            </span>
                            <span 
                              class="absolute left-0 right-0 h-[1.25px] bg-muted-foreground/40 transition-all duration-350 ease-out origin-left scale-x-0"
                              :class="{ 'scale-x-100': item.checked }"
                            ></span>
                          </label>
                        </div>
                        <!-- Micro CRM Actions revealed on hover -->
                        <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1.5 select-none">
                          <span class="text-[9px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded-md border border-primary/15 flex items-center gap-0.5" title="Due Date">
                            <Icon icon="lucide:calendar" class="size-2.5" />
                            May 24
                          </span>
                          <span class="size-5 rounded-full bg-secondary border border-border/60 flex items-center justify-center text-secondary-foreground hover:bg-muted cursor-pointer" title="Assignee">
                            <Icon icon="lucide:user" class="size-2.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Switches -->
                  <div class="space-y-3">
                    <div class="flex justify-between items-center">
                      <Label class="text-xs font-medium text-foreground">Switches (Settings Toggle)</Label>
                    </div>
                    <div class="space-y-2 bg-muted/40 p-2.5 rounded-2xl border border-border/60 flex flex-col justify-center gap-1">
                      
                      <!-- Notification Switch -->
                      <div class="flex items-center justify-between text-xs px-2.5 py-1.5 rounded-xl transition-all duration-200" :class="notificationsEnabled ? 'bg-card border border-border/50 ' : 'bg-transparent border border-transparent'">
                        <div class="flex flex-col gap-0.5">
                          <label for="switch-notif" class="font-medium text-foreground cursor-pointer flex items-center gap-1.5 select-none">
                            System Notifications
                            <span v-if="notificationsEnabled" class="size-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                          </label>
                          <span class="text-[9px] text-muted-foreground select-none">Receive real-time alerts.</span>
                        </div>
                        <Switch id="switch-notif" v-model:checked="notificationsEnabled" class="transition-all duration-200 ease-out active:scale-95 cursor-pointer" />
                      </div>

                      <!-- Developer Switch -->
                      <div class="flex items-center justify-between text-xs px-2.5 py-1.5 rounded-xl transition-all duration-200" :class="devToolsEnabled ? 'bg-card border border-border/50 ' : 'bg-transparent border border-transparent'">
                        <div class="flex flex-col gap-0.5">
                          <label for="switch-dev" class="font-medium text-foreground cursor-pointer flex items-center gap-1.5 select-none">
                            Developer Settings
                            <span v-if="devToolsEnabled" class="size-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                          </label>
                          <span class="text-[9px] text-muted-foreground select-none">Enables debugger consoles.</span>
                        </div>
                        <Switch id="switch-dev" v-model:checked="devToolsEnabled" class="transition-all duration-200 ease-out active:scale-95 cursor-pointer" />
                      </div>

                    </div>
                  </div>

                  <!-- Advanced Tags Input Showcase -->
                  <div class="space-y-3">
                    <div class="flex justify-between items-center">
                      <Label class="text-xs font-medium text-foreground">Advanced Tags Input</Label>
                      <span class="text-[9.5px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-900 uppercase tracking-wider">Premium Element</span>
                    </div>
                    <div class="bg-muted/40 p-4 rounded-2xl border border-border/60 space-y-2 relative">
                      <p class="text-[10px] text-muted-foreground leading-relaxed select-none">Fuzzy-add key labels inside the input:</p>
                      
                      <div class="relative w-full">
                        <TagsInput v-model="tagsValue" class="bg-card border-border rounded-xl min-h-10 p-1.5 focus-within:ring-2 focus-within:ring-primary/20">
                          <TagsInputItem v-for="item in tagsValue" :key="item" :value="item" class="bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 transition-all text-xs font-semibold rounded-lg px-2 py-0.5">
                            <TagsInputItemText />
                            <TagsInputItemDelete class="hover:text-primary transition-colors cursor-pointer" />
                          </TagsInputItem>
                          <TagsInputInput 
                            placeholder="Add CRM tag..." 
                            class="text-xs" 
                            v-model="tagSearchQuery"
                            @focus="tagInputFocused = true"
                            @blur="handleTagInputBlur"
                          />
                        </TagsInput>

                        <!-- Floating Autocomplete Dropdown -->
                        <div 
                          v-if="tagInputFocused && filteredAvailableTags.length > 0"
                          class="absolute z-50 left-0 right-0 mt-1 bg-popover dark:bg-slate-950 border border-border/70 rounded-xl p-1.5 max-h-48 overflow-y-auto animate-in slide-in-from-top-1.5 fade-in duration-200"
                        >
                          <div class="text-[9px] font-bold text-muted-foreground px-2 py-1 select-none uppercase tracking-widest border-b border-border/40 pb-1 mb-1">CRM Suggestions</div>
                          <div 
                            v-for="tag in filteredAvailableTags" 
                            :key="tag"
                            @mousedown="addAutocompleteTag(tag)"
                            class="flex items-center justify-between px-2.5 py-1.5 hover:bg-muted dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors text-xs font-semibold text-foreground"
                          >
                            <div class="flex items-center gap-1.5">
                              <Icon icon="lucide:hash" class="w-3.5 h-3.5 text-muted-foreground" />
                              {{ tag }}
                            </div>
                            <span class="text-[9px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/15">Add</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Advanced Number Field & PIN Security Steppers -->
                  <div class="space-y-3">
                    <div class="flex justify-between items-center">
                      <Label class="text-xs font-medium text-foreground">Numeric & PIN Verification</Label>
                    </div>
                    <div class="bg-muted/40 p-3.5 rounded-2xl border border-border/60 space-y-3">
                      <!-- Number Field -->
                      <div class="space-y-1.5">
                        <Label class="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Interactive Stepper Input</Label>
                        <NumberField v-model="numberValue" :min="1" :max="100">
                          <NumberFieldContent class="relative flex items-center bg-card border border-border rounded-xl overflow-hidden h-9">
                            <NumberFieldDecrement class="px-2.5 h-full hover:bg-accent border-r border-border flex items-center justify-center cursor-pointer transition-colors text-muted-foreground font-bold" />
                            <NumberFieldInput class="text-center font-bold text-foreground text-xs w-full bg-transparent focus:outline-none" />
                            <NumberFieldIncrement class="px-2.5 h-full hover:bg-accent border-l border-border flex items-center justify-center cursor-pointer transition-colors text-muted-foreground font-bold" />
                          </NumberFieldContent>
                        </NumberField>
                      </div>

                      <!-- PIN input OTP -->
                      <div class="space-y-1.5">
                        <Label class="text-[10px] font-medium text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                          <span>Secure PIN Input</span>
                          <span class="text-[8px] font-semibold text-muted-foreground normal-case">Paste support</span>
                        </Label>
                        <div 
                          class="flex flex-col justify-center h-9 transition-all duration-300"
                          :class="pinError ? 'border-destructive/60 bg-destructive/5 animate-[shake_0.4s_ease-in-out]' : ''"
                        >
                          <PinInput id="pin-input" v-model="pinValue" placeholder="•" class="flex gap-2 justify-center" @paste="handlePinPaste">
                            <PinInputGroup class="flex gap-1.5">
                              <PinInputSlot 
                                v-for="(id, index) in 4" 
                                :key="id" 
                                :index="index" 
                                class="size-8 text-center border border-border rounded-lg text-xs font-bold bg-card text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                                :class="pinError ? 'border-destructive text-destructive' : ''"
                              />
                            </PinInputGroup>
                          </PinInput>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Fields, Selects & Sliders -->
                  <div class="space-y-3">
                    <div class="flex justify-between items-center">
                      <Label class="text-xs font-medium text-foreground">Field & Range Controls</Label>
                    </div>
                    <div class="bg-muted/40 p-3.5 rounded-2xl border border-border/60 space-y-3.5">
                      <div class="grid grid-cols-2 gap-2.5">
                        <!-- Input field -->
                        <div class="space-y-1.5">
                          <Label for="showroom-input" class="text-[9px] font-medium text-muted-foreground uppercase tracking-wider">Customer Email</Label>
                          <Input id="showroom-input" placeholder="Email..." :class="['rounded-xl border-border bg-card', densityClasses.inputHeight]" />
                        </div>

                        <!-- Select Role -->
                        <div class="space-y-1.5">
                          <Label for="showroom-select" class="text-[9px] font-medium text-muted-foreground uppercase tracking-wider">User Role</Label>
                          <Select v-model="roleSelection">
                            <SelectTrigger id="showroom-select" :class="['rounded-xl border-border bg-card focus:ring-0', densityClasses.inputHeight]">
                              <SelectValue placeholder="Role..." />
                            </SelectTrigger>
                            <SelectContent class="bg-card border border-border">
                              <SelectGroup>
                                <SelectLabel class="text-[9px] font-bold text-muted-foreground tracking-wider">User Roles</SelectLabel>
                                <SelectItem value="owner">Owner</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="agent">Agent</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <!-- Slider Range -->
                      <div class="space-y-1.5">
                        <div class="flex justify-between items-center text-[10px] font-bold">
                          <Label class="text-[9px] font-medium text-muted-foreground uppercase tracking-wider">Search Radius</Label>
                          <span class="text-primary font-mono bg-primary/10 px-1.5 py-0.2 rounded">{{ sliderValue[0] }} km</span>
                        </div>
                        <Slider v-model="sliderValue" :max="100" :step="1" class="cursor-pointer" />
                      </div>
                    </div>
                  </div>

                  <!-- Date Calendar - Centered on full row -->
                  <div class="col-span-1 md:col-span-2 xl:col-span-3 flex flex-col items-center justify-center space-y-3 pt-2">
                    <div class="flex justify-center items-center">
                      <Label class="text-xs font-medium text-foreground text-center">Compact Calendar Widget</Label>
                    </div>
                    <div class="flex justify-center p-4 bg-card rounded-3xl border border-border/70 w-full max-w-sm">
                      <Calendar v-model="calendarDate" class="rounded-xl border-0 bg-transparent" />
                    </div>
                  </div>

                </div>

              </CardContent>
            </Card>

            <!-- Category 2: Overlays, Popups & Dialogs -->
            <Card id="sec-overlays" class="scroll-mt-24 border-border/70 hover:border-border transition-all duration-300 overflow-hidden bg-card/95 backdrop-blur-sm">
              <CardHeader :class="[densityClasses.cardHeader, 'border-b border-border/60 bg-muted/40 py-4.5 px-6 flex flex-row items-center justify-between gap-4']">
                <div class="space-y-1">
                  <div class="flex items-center gap-2 text-foreground">
                    <Sparkles class="w-4.5 h-4.5 text-emerald-500 stroke-[2.25]" />
                    <CardTitle class="text-base font-semibold tracking-tight">2. Overlays & Dialogs</CardTitle>
                  </div>
                  <CardDescription class="text-xs text-muted-foreground">Modals, slide-out sheets, tooltips, and interactive profile cards.</CardDescription>
                </div>
                <button 
                  @click="toggleInspector('overlays')" 
                  class="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-secondary hover:bg-secondary/80 rounded-lg text-xs font-semibold text-secondary-foreground cursor-pointer transition-colors border border-border"
                >
                  <Code2 class="w-3.5 h-3.5" />
                  {{ inspectorOpen.overlays ? 'Hide Code' : 'Inspect ESM' }}
                </button>
              </CardHeader>

              <!-- Collapsible Code Inspector Block -->
              <div 
                v-if="inspectorOpen.overlays" 
                class="border-b border-slate-800 bg-slate-900 text-slate-350 p-5 font-mono text-[10px] leading-relaxed space-y-3 animate-in slide-in-from-top-2 duration-200"
              >
                <div class="flex justify-between items-center">
                  <div class="text-[9px] font-bold tracking-widest text-emerald-400 uppercase">ESM Implementation Code</div>
                  <button 
                    @click="copyCodeSnippet(`import { Dialog } from '@/components/ui/dialog'\nimport { HoverCard } from '@/components/ui/hover-card'\nimport { Popover } from '@/components/ui/popover'\n\n<!-- Interactive sheet drawer configurations and popover layouts -->`)"
                    class="px-2 py-1 bg-slate-800 hover:bg-slate-700 active:bg-slate-650 rounded text-[9px] font-bold text-slate-350 border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Copy class="w-3 h-3 text-emerald-400" />
                    Copy
                  </button>
                </div>
                <pre class="overflow-x-auto bg-slate-950 p-3 rounded-lg border border-slate-800/80"><code><span class="text-amber-400">import</span> { Dialog } <span class="text-amber-400">from</span> <span class="text-emerald-300">'@/components/ui/dialog'</span>
<span class="text-amber-400">import</span> { HoverCard } <span class="text-amber-400">from</span> <span class="text-emerald-300">'@/components/ui/hover-card'</span>
<span class="text-amber-400">import</span> { Popover } <span class="text-amber-400">from</span> <span class="text-emerald-300">'@/components/ui/popover'</span>

&lt;!-- Interactive sheet drawer configurations and popover layouts --&gt;</code></pre>
              </div>

              <CardContent :class="[densityClasses.cardContent, 'dark:text-slate-200']">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-2">
                  
                  <!-- Left Side: Modals & Configuration Drawers -->
                  <div class="space-y-4">
                    <div class="flex justify-between items-center">
                      <Label class="text-xs font-medium text-foreground">Modals & Configuration Drawers</Label>
                      <span class="text-[9px] font-bold px-2 py-0.5 bg-primary/10 text-primary rounded-md uppercase tracking-wider font-mono">Dynamic Overlays</span>
                    </div>
                    <div class="bg-muted/40 p-4.5 rounded-2xl border border-border/60 flex flex-col gap-3.5 justify-center min-h-[220px]">
                      
                      <!-- Dialog Item -->
                      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-card rounded-xl border border-border/60 -sm transition-all duration-200">
                        <div class="space-y-0.5">
                          <div class="text-[11px] font-bold text-foreground">Standard Modal Form</div>
                          <div class="text-[9.5px] text-muted-foreground">Standard popup form layout for data entries.</div>
                        </div>
                        <!-- Dialog -->
                        <Dialog>
                          <DialogTrigger as-child>
                            <Button variant="outline" :size="densityClasses.buttonSize" class="rounded-xl font-bold bg-background text-foreground hover:bg-accent border-border cursor-pointer shrink-0">
                              Open Dialog
                            </Button>
                          </DialogTrigger>
                          <DialogContent class="sm:max-w-md bg-card rounded-2xl border border-border p-6">
                            <DialogHeader class="space-y-1">
                              <DialogTitle class="text-foreground font-bold tracking-tight">Create CRM Record</DialogTitle>
                              <DialogDescription class="text-xs text-muted-foreground">Add a new company profile to your workspace index.</DialogDescription>
                            </DialogHeader>
                            <div class="space-y-3.5 py-4 text-xs">
                              <div class="space-y-1.5">
                                <Label for="dialog-company" class="font-medium text-foreground">Company Name</Label>
                                <Input id="dialog-company" placeholder="e.g. VeecoTech Solutions" class="rounded-xl text-xs border-border bg-background" />
                              </div>
                            </div>
                            <DialogFooter class="flex gap-2">
                              <DialogClose as-child>
                                <Button size="sm" class="rounded-xl px-4 cursor-pointer font-bold">Save Company Profile</Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>

                      <!-- Alert Dialog Item -->
                      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-card rounded-xl border border-border/60 -sm transition-all duration-200">
                        <div class="space-y-0.5">
                          <div class="text-[11px] font-bold text-foreground">Confirmation Alert Dialog</div>
                          <div class="text-[9.5px] text-muted-foreground">Destructive actions requesting user friction.</div>
                        </div>
                        <!-- Alert Dialog -->
                        <AlertDialog>
                          <AlertDialogTrigger as-child>
                            <Button variant="destructive" :size="densityClasses.buttonSize" class="rounded-xl font-bold cursor-pointer shrink-0">
                              Trigger Alert
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent class="bg-card rounded-2xl border border-border p-6">
                            <AlertDialogHeader class="space-y-2">
                              <AlertDialogTitle class="text-foreground font-bold flex items-center gap-2">
                                <AlertCircle class="w-5 h-5 text-destructive" />
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription class="text-xs text-muted-foreground leading-relaxed">
                                This action cannot be undone. This will permanently delete the customer profile, remove their pipeline status, and terminate sync logs from our cluster nodes.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter class="flex gap-2 pt-3">
                              <AlertDialogCancel class="rounded-xl font-semibold border-border bg-secondary cursor-pointer text-secondary-foreground hover:bg-secondary/80">Cancel</AlertDialogCancel>
                              <AlertDialogAction class="rounded-xl font-semibold cursor-pointer bg-destructive hover:bg-destructive-dark text-white border-transparent">
                                Delete Permanently
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>

                      <!-- Slideout Sheet Item -->
                      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-card rounded-xl border border-border/60 -sm transition-all duration-200">
                        <div class="space-y-0.5">
                          <div class="text-[11px] font-bold text-foreground">Settings Sheet Drawer</div>
                          <div class="text-[9.5px] text-muted-foreground">Side overlay for deep settings and configuration inputs.</div>
                        </div>
                        <!-- Slideout Sheet -->
                        <Sheet>
                          <SheetTrigger as-child>
                            <Button variant="dark" :size="densityClasses.buttonSize" class="rounded-xl font-bold cursor-pointer shrink-0">
                              Slide Sheet
                            </Button>
                          </SheetTrigger>
                          <SheetContent class="bg-card border-l border-border p-6 flex flex-col justify-between">
                            <div class="space-y-5">
                              <SheetHeader class="space-y-1 border-b border-border/80 pb-4">
                                <SheetTitle class="text-foreground font-bold tracking-tight">Admin Configurations</SheetTitle>
                                <SheetDescription class="text-xs text-muted-foreground">Configure core sales stages and lead labels.</SheetDescription>
                              </SheetHeader>
                              <div class="space-y-4 text-xs">
                                <div class="space-y-1.5">
                                  <Label for="sheet-user" class="font-medium text-foreground">Sales Agent Lead Assignee</Label>
                                  <Input id="sheet-user" value="Justin Tan (Lead Architect)" disabled class="rounded-xl bg-muted dark:bg-background border-border text-muted-foreground font-semibold" />
                                </div>
                              </div>
                            </div>
                            <SheetFooter class="border-t border-border/80 pt-4">
                              <SheetClose as-child>
                                <Button class="w-full rounded-xl cursor-pointer font-bold py-2.5">
                                  Apply Parameters
                                </Button>
                              </SheetClose>
                            </SheetFooter>
                          </SheetContent>
                        </Sheet>
                      </div>

                    </div>
                  </div>

                  <!-- Right Side: Hover Overlays & Context -->
                  <div class="space-y-4">
                    <div class="flex justify-between items-center">
                      <Label class="text-xs font-medium text-foreground">Contextual Elements</Label>
                      <span class="text-[9px] font-bold px-2 py-0.5 bg-emerald-500/10 text-emerald-600 rounded-md uppercase tracking-wider font-mono">Hover & Click</span>
                    </div>
                    <div class="space-y-4 min-h-[220px]">
                      
                      <!-- Tooltips & Popovers card -->
                      <div class="space-y-3 bg-muted/40 p-4 rounded-2xl border border-border/60 flex flex-col justify-center">
                        <Label class="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Contextual Tooltips & Popovers</Label>
                        <div class="flex items-center gap-3">
                          
                          <!-- Tooltip -->
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger as-child>
                                <Button variant="outline" size="sm" class="rounded-xl bg-background border-border text-foreground cursor-pointer hover:bg-accent text-[11px] font-bold transition-all active:scale-[0.97]">
                                  Hover Tooltip
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent class="bg-slate-950/90 dark:bg-slate-950/90 backdrop-blur-md text-white border border-white/10 rounded-xl px-3 py-1.5 text-[10px] relative select-none">
                                <p class="font-bold flex items-center gap-1.5">
                                  <Icon icon="lucide:info" class="size-3 text-emerald-450" />
                                  Direct diagnostic helper details!
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <!-- Popover -->
                          <Popover>
                            <PopoverTrigger as-child>
                              <Button variant="outline" size="sm" class="rounded-xl bg-background border-border text-foreground cursor-pointer hover:bg-accent text-[11px] font-bold transition-all active:scale-[0.97]">
                                Click Popover
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent class="w-56 p-4 bg-slate-950/90 dark:bg-slate-950/90 backdrop-blur-md border border-white/10 text-white rounded-2xl animate-in zoom-in-95 duration-200">
                              <div class="space-y-2 text-xs">
                                <h4 class="font-bold leading-none text-white flex items-center gap-1.5 select-none">
                                  <Info class="w-3.5 h-3.5 text-emerald-450 animate-pulse" />
                                  Quick Settings
                                </h4>
                                <p class="text-[10px] text-slate-400 font-semibold select-none">Immediate parameters tuning</p>
                                <Separator class="my-1.5 bg-white/10" />
                                <div class="flex items-center justify-between text-[11px] select-none">
                                  <span class="font-bold text-slate-300">Sandbox Mode</span>
                                  <span class="text-[9px] font-bold bg-emerald-500/20 text-emerald-450 px-1.5 py-0.5 rounded border border-emerald-500/30 uppercase tracking-wide">Active</span>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>

                        </div>
                      </div>

                      <!-- Hover Card Profile -->
                      <div class="space-y-3 bg-muted/40 p-4 rounded-2xl border border-border/60 flex flex-col justify-center">
                        <Label class="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Hover Card Profile Preview</Label>
                        <div class="flex items-center gap-2">
                          <span class="text-xs text-muted-foreground font-semibold">Hover link:</span>
                          <HoverCard>
                            <HoverCardTrigger as-child>
                              <a href="#" class="text-xs font-bold text-primary hover:text-primary-dark underline underline-offset-4 cursor-pointer flex items-center gap-0.5 transition-colors">
                                @justin_tan
                              </a>
                            </HoverCardTrigger>
                            <HoverCardContent class="w-72 p-4 bg-slate-950/95 dark:bg-slate-950/95 backdrop-blur-md border border-white/10 text-white rounded-2xl animate-in zoom-in-95 duration-200">
                              <div class="flex space-x-3.5 text-xs">
                                <Avatar class="size-9.5 border border-white/10 shrink-0">
                                  <AvatarFallback class="bg-primary/20 text-primary font-bold text-xs">JT</AvatarFallback>
                                </Avatar>
                                <div class="space-y-1.5 flex-1 min-w-0">
                                  <h4 class="text-xs font-bold text-white leading-none">Justin Tan</h4>
                                  <p class="text-[10px] text-slate-300 leading-relaxed">Lead Front-End Architect building the CRM Nova v4 showroom shell.</p>
                                  <div class="flex items-center text-[9px] text-slate-400 font-bold border-t border-white/5 pt-1.5 mt-1 select-none">
                                    <CalendarDays class="w-3.5 h-3.5 mr-1 text-slate-400" />
                                    Joined May 2026
                                  </div>
                                  <div class="flex gap-1.5 pt-2 border-t border-white/5 mt-2 select-none">
                                    <a href="mailto:justin@veecotech.com" class="flex-1 text-center py-1 bg-primary/25 border border-primary/30 rounded-lg text-[9px] font-bold text-primary hover:bg-primary/35 transition-colors cursor-pointer">Email</a>
                                    <span class="flex-1 text-center py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-bold text-slate-200 hover:bg-white/10 transition-colors cursor-pointer">Slack DM</span>
                                  </div>
                                </div>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        </div>
                      </div>

                    </div>
                  </div>
                  
                </div>
              </CardContent>
            </Card>

                         <!-- Category 3: Data Display & Disclosures -->
            <Card id="sec-data" class="scroll-mt-24 border-border/70 hover:border-border transition-all duration-300 overflow-hidden bg-card/95 backdrop-blur-sm">
              <CardHeader :class="[densityClasses.cardHeader, 'border-b border-border/60 bg-muted/40 py-4.5 px-6 flex flex-row items-center justify-between gap-4']">
                <div class="space-y-1">
                  <div class="flex items-center gap-2 text-foreground">
                    <TrendingUp class="w-4.5 h-4.5 text-emerald-500 stroke-[2.25]" />
                    <CardTitle class="text-base font-semibold tracking-tight">3. Data Display & Disclosures</CardTitle>
                  </div>
                  <CardDescription class="text-xs text-muted-foreground">Data grids, revenue charts, resizable splits, accordions, and galleries.</CardDescription>
                </div>
                <button 
                  @click="toggleInspector('data')" 
                  class="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-secondary hover:bg-secondary/80 rounded-lg text-xs font-semibold text-secondary-foreground cursor-pointer transition-colors border border-border"
                >
                  <Code2 class="w-3.5 h-3.5" />
                  {{ inspectorOpen.data ? 'Hide Code' : 'Inspect ESM' }}
                </button>
              </CardHeader>

              <!-- Collapsible Code Inspector Block -->
              <div 
                v-if="inspectorOpen.data" 
                class="border-b border-slate-800 bg-slate-900 text-slate-350 p-5 font-mono text-[10px] leading-relaxed space-y-3 animate-in slide-in-from-top-2 duration-200"
              >
                <div class="flex justify-between items-center">
                  <div class="text-[9px] font-bold tracking-widest text-emerald-400 uppercase">ESM Implementation Code</div>
                  <button 
                    @click="copyCodeSnippet(`import { ResizablePanelGroup } from '@/components/ui/resizable'\nimport { Accordion } from '@/components/ui/accordion'\n\n<!-- Glowing SVG CRM revenue chart models and split detail drawers -->`)"
                    class="px-2 py-1 bg-slate-800 hover:bg-slate-700 active:bg-slate-650 rounded text-[9px] font-bold text-slate-300 border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Copy class="w-3 h-3 text-emerald-400" />
                    Copy
                  </button>
                </div>
                <pre class="overflow-x-auto bg-slate-950 p-3 rounded-lg border border-slate-800/80"><code><span class="text-amber-400">import</span> { ResizablePanelGroup } <span class="text-amber-400">from</span> <span class="text-emerald-300">'@/components/ui/resizable'</span>
<span class="text-amber-400">import</span> { Accordion } <span class="text-amber-400">from</span> <span class="text-emerald-300">'@/components/ui/accordion'</span>
<span class="text-slate-400">&lt;!-- Glowing SVG CRM revenue chart models and split detail drawers --&gt;</span></code></pre>
              </div>

              <CardContent :class="[densityClasses.cardContent, 'dark:text-slate-200']">
                <div class="space-y-8">
                  <!-- Row 1: Interactive CRM revenue trending chart (Full Width) -->
                  <div class="space-y-3">
                    <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                      <Label class="text-xs font-semibold text-foreground flex items-center gap-1">
                        <TrendingUp class="size-3.5 text-primary" />
                        CRM Sales Performance & Funnel Trends
                      </Label>
                      
                      <!-- Multi-Metric & Timeframe Selector Toolbar -->
                      <div class="flex flex-wrap items-center gap-2">
                        <!-- Timeframe Filter -->
                        <div class="flex bg-muted/70 border border-border p-0.5 rounded-xl">
                          <button 
                            v-for="tf in ['Q1', 'Q2', 'YTD'] as const"
                            :key="tf"
                            @click="selectedTimeframe = tf"
                            :class="[
                              'text-[9px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer select-none',
                              selectedTimeframe === tf 
                                ? 'bg-card text-foreground shadow-sm border border-border' 
                                : 'text-muted-foreground hover:text-foreground'
                            ]"
                          >
                            {{ tf }}
                          </button>
                        </div>

                        <!-- Metric Toggle -->
                        <div class="flex items-center gap-1 bg-muted/70 border border-border p-0.5 rounded-xl">
                          <button 
                            @click="activeChartMetric = 'revenue'" 
                            :class="[ 'text-[9.5px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer select-none', activeChartMetric === 'revenue' ? 'bg-primary text-white shadow-soft' : 'text-muted-foreground hover:text-foreground' ]"
                          >
                            Revenue Pipeline
                          </button>
                          <button 
                            @click="activeChartMetric = 'conversions'" 
                            :class="[ 'text-[9.5px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer select-none', activeChartMetric === 'conversions' ? 'bg-primary text-white shadow-soft' : 'text-muted-foreground hover:text-foreground' ]"
                          >
                            Leads Conversions
                          </button>
                        </div>
                      </div>
                    </div>

                    <div class="bg-gradient-to-b from-neutral-950 to-neutral-900 text-neutral-50 p-6 rounded-2xl border border-border/80 space-y-4 relative overflow-hidden">
                      <div class="flex flex-wrap justify-between items-center gap-4">
                        <div>
                          <div class="text-[10px] font-bold text-neutral-400 uppercase tracking-wider font-mono">
                            {{ activeChartMetric === 'revenue' ? `${selectedTimeframe} Revenue Pipeline (${selectedTimeframe === 'YTD' ? 'Jan-May' : selectedTimeframe === 'Q1' ? 'Jan-Mar' : 'Apr-Jun'})` : `${selectedTimeframe} Lead Conversion Volume` }}
                          </div>
                          <div class="text-xl font-bold text-white mt-0.5 flex items-baseline gap-2">
                            <span v-if="hoverPointData">
                              {{ activeChartMetric === 'revenue' ? '$' + hoverPointData.val.toLocaleString() : hoverPointData.val.toLocaleString() + ' leads' }}
                              <span class="text-[10px] font-bold text-neutral-400 ml-1 font-mono">in {{ hoverPointData.month }}</span>
                            </span>
                            <span v-else>
                              {{ activeChartMetric === 'revenue' 
                                  ? (selectedTimeframe === 'Q1' ? '$45,650 USD' : selectedTimeframe === 'Q2' ? '$74,850 USD' : '$91,600 USD') 
                                  : (selectedTimeframe === 'Q1' ? '235 leads' : selectedTimeframe === 'Q2' ? '473 leads' : '640 leads') }}
                              <span class="text-xs font-bold text-emerald-400 font-sans">+18.4% YoY</span>
                            </span>
                          </div>
                        </div>

                        <!-- Macro KPI Pills -->
                        <div class="flex items-center gap-2 font-mono text-[10px]">
                          <span class="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-neutral-300">
                            Peak: <strong class="text-emerald-400">{{ selectedTimeframe === 'Q1' ? 'Mar ($18.2k)' : selectedTimeframe === 'Q2' ? 'Jun ($28.9k)' : 'May ($24.1k)' }}</strong>
                          </span>
                          <span class="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/25 rounded-lg text-emerald-400 font-bold uppercase tracking-wider">
                            Live Telemetry
                          </span>
                        </div>
                      </div>

                      <!-- SVG Chart line drawing -->
                      <div class="relative w-full aspect-[5/1] min-h-[160px] md:min-h-[220px] pt-2 select-none">
                        <svg class="w-full h-full overflow-visible" viewBox="0 0 1000 200" preserveAspectRatio="none">
                          <!-- Grid lines -->
                          <line x1="0" y1="50" x2="1000" y2="50" stroke="rgba(255,255,255,0.05)" stroke-dasharray="3" />
                          <line x1="0" y1="100" x2="1000" y2="100" stroke="rgba(255,255,255,0.05)" stroke-dasharray="3" />
                          <line x1="0" y1="150" x2="1000" y2="150" stroke="rgba(255,255,255,0.05)" stroke-dasharray="3" />
                          
                          <!-- Linear Gradient shading -->
                          <defs>
                            <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stop-color="rgba(35, 183, 80, 0.35)" />
                              <stop offset="100%" stop-color="rgba(35, 183, 80, 0)" />
                            </linearGradient>
                          </defs>
                          <path 
                            :d="activeArea" 
                            fill="url(#chartGlow)" 
                            class="transition-all duration-500 ease-in-out"
                          />
                          
                          <!-- Core Bezier Spline -->
                          <path 
                            :d="activePath" 
                            fill="none" 
                            stroke="#23B750" 
                            stroke-width="2.5" 
                            stroke-linecap="round"
                            class="transition-all duration-500 ease-in-out"
                          />
                          
                          <!-- Dashed interactive vertical tracking line -->
                          <line v-if="hoverPointData" :x1="hoverPointData.x" y1="0" :x2="hoverPointData.x" y2="200" stroke="rgba(34, 197, 94, 0.35)" stroke-dasharray="3" stroke-width="1.5" />

                          <!-- Static Data Anchor Nodes -->
                          <circle 
                            v-for="(pt, idx) in chartData" 
                            :key="pt.month" 
                            :cx="pt.x" 
                            :cy="pt.y" 
                            :r="idx === chartData.length - 1 ? 4.5 : 3.5" 
                            :fill="idx === chartData.length - 1 ? '#62D816' : '#23B750'" 
                            stroke="#0f172a" 
                            stroke-width="1.5" 
                            class="transition-all duration-500" 
                          />

                          <!-- Active Hovering Pulsing Ring -->
                          <circle v-if="hoverPointData" :cx="hoverPointData.x" :cy="hoverPointData.y" r="7.5" fill="rgba(34, 197, 94, 0.25)" class="animate-ping" style="transform-origin: center;" />
                          <circle v-if="hoverPointData" :cx="hoverPointData.x" :cy="hoverPointData.y" r="4.5" fill="#22c55e" stroke="#ffffff" stroke-width="1.5" />

                          <!-- Invisible Sensing Columns -->
                          <rect 
                            v-for="(pt, idx) in chartData" 
                            :key="'sense-' + idx"
                            :x="idx === 0 ? 0 : pt.x - (1000 / (chartData.length * 2))" 
                            y="0" 
                            :width="1000 / chartData.length" 
                            height="200" 
                            fill="transparent" 
                            class="cursor-pointer" 
                            @mouseenter="hoveredPointIndex = idx; isChartHovered = true" 
                            @mouseleave="hoveredPointIndex = null; isChartHovered = false" 
                          />
                        </svg>

                        <!-- Gliding Floating Tooltip -->
                        <div 
                          v-if="hoverPointData" 
                          class="absolute bg-neutral-950/95 border border-white/10 rounded-xl px-2.5 py-1 text-[10px] font-bold text-white flex flex-col pointer-events-none transition-all duration-150 ease-out z-20"
                          :style="{
                            left: `calc(${(hoverPointData.x / 1000) * 100}% - 48px)`,
                            bottom: `calc(${((200 - hoverPointData.y) / 200) * 100}% + 12px)`
                          }"
                        >
                          <span class="text-[8px] text-neutral-400 uppercase font-bold tracking-wider leading-none mb-0.5 font-mono">{{ hoverPointData.month }} metric</span>
                          <span class="text-emerald-400 font-mono font-bold text-[11px]">
                            {{ activeChartMetric === 'revenue' ? '$' + hoverPointData.val.toLocaleString() : hoverPointData.val.toLocaleString() + ' leads' }}
                          </span>
                        </div>
                      </div>

                      <div class="flex justify-between items-center text-[9px] font-bold text-neutral-400 px-1 border-t border-neutral-800/40 pt-2.5 font-mono">
                        <span 
                          v-for="(pt, idx) in chartData" 
                          :key="'lbl-' + pt.month"
                          :class="[
                            hoveredPointIndex === idx || (hoveredPointIndex === null && idx === chartData.length - 1) ? 'text-white font-bold font-sans' : '',
                            'font-semibold'
                          ]"
                        >
                          {{ pt.month }} {{ idx === chartData.length - 1 ? '(Active)' : '' }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Row 2: Interactive Resizable Layout Panel Group (Full Width) -->
                  <div class="space-y-3">
                    <div class="flex justify-between items-center">
                      <Label class="text-xs font-semibold text-foreground flex items-center gap-1">
                        <Split class="size-3.5 text-primary" />
                        Advanced Resizable Workspace Panel
                      </Label>
                      <span class="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20 uppercase tracking-wider font-mono">Double-Click Divider to Collapse</span>
                    </div>
                    <div class="bg-muted/40 p-4 rounded-2xl border border-border/60 space-y-2">
                      <p class="text-xs text-muted-foreground leading-relaxed mb-1.5">Drag the divider bar to resize the left navigation and right detail workspace:</p>
                      
                      <ResizablePanelGroup direction="horizontal" class="min-h-[160px] rounded-xl border border-border bg-card overflow-hidden shadow-soft">
                        
                        <!-- Left Panel (Sidebar Workspace) -->
                        <ResizablePanel :size="isSidebarCollapsed ? 0 : 30" :min-size="isSidebarCollapsed ? 0 : 15" class="bg-muted/20 min-w-[0px] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
                          <div v-if="!isSidebarCollapsed" class="p-3.5 space-y-3 animate-in fade-in duration-200">
                            <div class="text-[9px] font-bold text-muted-foreground uppercase tracking-widest font-mono select-none">CRM Active Deals</div>
                            <div class="space-y-1.5">
                              <div class="text-[10px] font-bold text-foreground bg-card px-2.5 py-2 rounded-xl border border-border leading-none flex items-center justify-between hover:border-primary/30 transition-all select-none">
                                <span class="truncate">VeecoTech HQ</span>
                                <span class="size-1.5 bg-emerald-500 rounded-full flex-shrink-0 animate-pulse"></span>
                              </div>
                              <div class="text-[10px] font-semibold text-muted-foreground px-2.5 py-1.5 rounded-lg leading-none flex items-center justify-between select-none">
                                <span class="truncate">RakanSales Dev</span>
                                <span class="size-1.5 bg-slate-400 rounded-full flex-shrink-0"></span>
                              </div>
                            </div>
                          </div>
                        </ResizablePanel>
                        
                        <ResizableHandle 
                          class="w-1.5 bg-border hover:bg-primary/45 transition-colors duration-200 cursor-col-resize flex items-center justify-center group relative border-x border-background" 
                          @dblclick="toggleSidebarCollapse"
                        >
                          <!-- Grip indicator dots -->
                          <div class="flex flex-col gap-0.5 items-center justify-center w-1 py-2 rounded-full bg-muted-foreground/20 group-hover:bg-primary/60 transition-colors">
                            <span class="size-0.5 rounded-full bg-slate-450"></span>
                            <span class="size-0.5 rounded-full bg-slate-450"></span>
                            <span class="size-0.5 rounded-full bg-slate-450"></span>
                          </div>
                        </ResizableHandle>
                        
                        <!-- Right Panel (Content View) -->
                        <ResizablePanel :size="isSidebarCollapsed ? 100 : 70" class="p-4 flex flex-col justify-between min-w-[120px] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] bg-card">
                          <div class="space-y-2">
                            <div class="flex justify-between items-start">
                              <div class="text-[9px] font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded uppercase tracking-wider font-mono font-bold">Enterprise Plan</div>
                              <button 
                                v-if="isSidebarCollapsed"
                                @click="toggleSidebarCollapse"
                                class="text-[9px] font-bold text-primary hover:underline cursor-pointer flex items-center gap-0.5"
                              >
                                <ChevronRight class="size-2.5" /> Show Deals
                              </button>
                            </div>
                            <div>
                              <h4 class="text-xs font-bold text-foreground truncate">Nova Guidelines Pipeline Sync</h4>
                              <p class="text-[10px] text-muted-foreground font-semibold font-mono mt-0.5 flex items-center gap-1.5">
                                <span>Budget: <strong class="text-foreground">$24,500 USD</strong></span>
                                <span class="size-1 bg-border rounded-full"></span>
                                <span>Owner: <strong class="text-foreground">Justin Tan</strong></span>
                              </p>
                            </div>
                          </div>
                          
                          <!-- Progress bar layout -->
                          <div class="mt-3.5">
                            <div class="flex justify-between text-[8px] font-bold text-muted-foreground mb-1 select-none font-mono">
                              <span>Funnel Progress</span>
                              <span class="text-primary">68% Done</span>
                            </div>
                            <div class="h-1.5 w-full bg-muted rounded-full overflow-hidden border border-black/5">
                              <div class="h-full bg-primary rounded-full" style="width: 68%"></div>
                            </div>
                          </div>

                          <div class="flex items-center justify-between border-t border-border/50 pt-2.5 mt-3 select-none">
                            <span class="text-[9px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 dark:text-emerald-450 font-mono">
                              Proposal stage
                            </span>
                            <span class="text-[8px] text-muted-foreground font-bold font-mono">Updated 10m ago</span>
                          </div>
                        </ResizablePanel>
                      </ResizablePanelGroup>
                    </div>
                  </div>

                  <!-- Row 3: Customer Stage Index Table (Interactive Multi-Select Data Grid!) -->
                  <div class="space-y-3">
                    <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                      <Label class="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <Users class="size-3.5 text-primary" />
                        <span>CRM Live Lead Directory Grid</span>
                        <span class="text-[10px] font-bold text-muted-foreground font-mono">({{ filteredLeads.length }} active)</span>
                      </Label>
                      
                      <!-- Filters bar -->
                      <div class="flex items-center gap-2 max-w-full">
                        <div class="relative w-36 sm:w-44">
                          <Search class="absolute left-2 top-2 size-3 text-muted-foreground" />
                          <Input 
                            v-model="leadSearchQuery" 
                            placeholder="Search leads..." 
                            class="pl-7 pr-2.5 h-7 text-[10px] font-semibold bg-background/50 border-border rounded-lg"
                          />
                        </div>
                        <div class="flex bg-muted/65 border border-border p-0.5 rounded-lg shrink-0">
                          <button 
                            v-for="filter in ['All', 'Enterprise', 'Developer', 'Lead']"
                            :key="filter"
                            @click="selectedLeadStageFilter = filter"
                            :class="[ 'text-[8.5px] font-bold px-2 py-0.5 rounded-md cursor-pointer transition-all select-none', selectedLeadStageFilter === filter ? 'bg-card text-foreground border border-border shadow-sm' : 'text-muted-foreground hover:text-foreground' ]"
                          >
                            {{ filter }}
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- Floating Multi-Select Bulk Actions Bar -->
                    <div 
                      v-if="selectedLeadIds.length > 0"
                      class="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900 text-white rounded-xl border border-slate-800 animate-in slide-in-from-top-2 duration-200 shadow-lg text-xs"
                    >
                      <div class="flex items-center gap-2">
                        <span class="size-2 bg-emerald-400 rounded-full animate-ping"></span>
                        <span class="font-bold font-mono text-[11px]">{{ selectedLeadIds.length }} leads selected</span>
                      </div>

                      <div class="flex flex-wrap items-center gap-2">
                        <Button size="xs" variant="primary" @click="bulkUpdateLeadStage('Enterprise')" class="text-[10px] font-bold h-7 px-2.5 cursor-pointer">
                          Set Enterprise
                        </Button>
                        <Button size="xs" variant="outline" @click="bulkUpdateLeadStage('Developer')" class="text-[10px] font-bold h-7 px-2.5 text-slate-200 bg-slate-800 border-slate-700 hover:bg-slate-700 cursor-pointer">
                          Set Developer
                        </Button>
                        <Button size="xs" variant="outline" @click="toast.success(`Exporting ${selectedLeadIds.length} leads to CSV!`)" class="text-[10px] font-bold h-7 px-2.5 text-slate-200 bg-slate-800 border-slate-700 hover:bg-slate-700 cursor-pointer flex items-center gap-1">
                          <Download class="size-3" /> Export CSV
                        </Button>
                        <button @click="clearLeadSelection" class="text-[10px] text-slate-400 hover:text-white underline cursor-pointer ml-1">
                          Cancel
                        </button>
                      </div>
                    </div>

                    <!-- Table Data Grid -->
                    <div class="border border-border rounded-2xl bg-card overflow-hidden text-xs shadow-soft">
                      <Table>
                        <TableHeader class="bg-muted/50 font-bold text-muted-foreground border-b border-border">
                          <TableRow>
                            <TableCell class="w-10 pl-4 py-2.5">
                              <Checkbox 
                                :checked="isAllLeadsSelected" 
                                @update:checked="toggleSelectAllLeads" 
                                aria-label="Select all leads"
                              />
                            </TableCell>
                            <TableCell :class="[densityClasses.tableCell, 'font-bold']">Customer Profile</TableCell>
                            <TableCell :class="[densityClasses.tableCell, 'font-bold']">Account Stage</TableCell>
                            <TableCell :class="[densityClasses.tableCell, 'font-bold text-right pr-6']">Actions</TableCell>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow 
                            v-for="lead in filteredLeads" 
                            :key="lead.id" 
                            :class="[
                              'border-b border-border/80 transition-colors',
                              selectedLeadIds.includes(lead.id) ? 'bg-primary/5 dark:bg-primary/10' : 'hover:bg-muted/30'
                            ]"
                          >
                            <TableCell class="pl-4 py-2">
                              <Checkbox 
                                :checked="selectedLeadIds.includes(lead.id)" 
                                @update:checked="toggleSelectLead(lead.id)"
                                :aria-label="'Select lead ' + lead.name"
                              />
                            </TableCell>
                            <TableCell :class="[densityClasses.tableCell, 'font-semibold text-foreground']">
                              <div class="flex items-center gap-2">
                                <Avatar class="size-7.5 border border-border shrink-0 select-none">
                                  <AvatarFallback class="bg-primary/10 text-primary font-bold text-[9px] uppercase">
                                    {{ lead.name.slice(0, 2) }}
                                  </AvatarFallback>
                                </Avatar>
                                <div class="min-w-0">
                                  <div class="font-bold text-[11.5px] truncate">{{ lead.name }}</div>
                                  <div class="text-[9px] text-muted-foreground font-mono font-medium truncate mt-0.5">
                                    {{ lead.id === 1 ? 'Budget: $24,500' : lead.id === 2 ? 'Budget: $18,200' : lead.id === 3 ? 'Budget: $42,000' : 'Budget: $8,400' }}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell :class="densityClasses.tableCell">
                              <!-- Clickable Stage badge with Inline Dropdown Menu Selection -->
                              <DropdownMenu>
                                <DropdownMenuTrigger as-child>
                                  <button
                                    type="button"
                                    :class="[
                                      'cursor-pointer hover:opacity-85 active:scale-95 transition-all select-none flex items-center justify-between w-[120px] rounded-lg border px-2.5 py-1 text-[10px] font-bold font-sans focus:outline-none',
                                      lead.stage === 'Enterprise'
                                        ? 'bg-emerald-500/10 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-500/25 dark:border-emerald-800'
                                        : lead.stage === 'Developer'
                                          ? 'bg-blue-500/10 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-500/25 dark:border-blue-800'
                                          : 'bg-muted text-muted-foreground border-border'
                                    ]"
                                  >
                                    <span>{{ lead.stage }}</span>
                                    <Icon icon="lucide:chevron-down" class="size-3 text-current opacity-75 shrink-0 ml-auto" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" class="w-36 bg-popover border border-border rounded-xl p-1.5 animate-in zoom-in-95 duration-150 z-50">
                                  <div class="text-[9px] font-bold text-muted-foreground px-2 py-1 select-none uppercase tracking-widest border-b border-border/40 pb-1 mb-1 font-mono">Set Stage</div>
                                  <DropdownMenuItem 
                                    v-for="stage in ['Enterprise', 'Developer', 'Lead']" 
                                    :key="stage"
                                    @click="updateLeadStage(lead.id, stage)"
                                    class="px-2 py-1.5 hover:bg-muted dark:hover:bg-slate-850 rounded-lg cursor-pointer transition-colors text-xs font-semibold text-foreground flex items-center justify-between"
                                  >
                                    {{ stage }}
                                    <Check v-if="lead.stage === stage" class="w-3.5 h-3.5 text-primary stroke-[3]" />
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                            <TableCell :class="[densityClasses.tableCell, 'text-right pr-6']">
                              <Button 
                                variant="ghost" 
                                size="xs" 
                                class="h-6.5 px-2.5 rounded-lg text-[10px] font-bold cursor-pointer" 
                                @click="toast.info(`Inspecting profile for ${lead.name}`, { description: 'Opening analytical deep-dive logs...' })"
                              >
                                Inspect
                              </Button>
                            </TableCell>
                          </TableRow>
                          
                          <!-- Empty State if no leads found -->
                          <TableRow v-if="filteredLeads.length === 0">
                            <TableCell colspan="4" class="py-8 text-center text-muted-foreground font-semibold">
                              <div class="flex flex-col items-center gap-1 text-[11px]">
                                <Icon icon="lucide:search-slash" class="size-5 text-muted-foreground/60 mb-1" />
                                No matching lead records found.
                              </div>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                        
                        <!-- Table Aggregate Summary Footer -->
                        <TableFooter v-if="filteredLeads.length > 0" class="bg-muted/40 border-t border-border font-mono text-[11px]">
                          <TableRow>
                            <TableCell colspan="2" class="pl-4 py-2.5 text-muted-foreground font-semibold">
                              Displaying {{ filteredLeads.length }} lead accounts
                            </TableCell>
                            <TableCell colspan="2" class="pr-6 py-2.5 text-right font-bold text-foreground">
                              Total Pipeline: <span class="text-primary font-bold">${{ totalPipelineValue.toLocaleString() }} USD</span>
                            </TableCell>
                          </TableRow>
                        </TableFooter>
                      </Table>
                    </div>
                  </div>

                  <!-- Row 4: Grid 2 Columns for FAQs, Carousel, Avatars, Badges, Aspect Ratio -->
                  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-2">
                    
                    <!-- Left Side Column -->
                    <div class="space-y-6">
                      
                      <!-- Accordion FAQs -->
                      <div class="space-y-3">
                        <div class="flex justify-between items-center">
                          <Label class="text-xs font-semibold text-foreground">Accordion FAQ Disclosures</Label>
                        </div>
                        <Accordion type="single" collapsible class="w-full bg-card rounded-2xl border border-border p-2 text-xs shadow-soft">
                          <AccordionItem value="item-1" class="border-b border-border/50">
                            <AccordionTrigger class="px-3 py-2.5 font-bold text-foreground hover:text-primary transition-all hover:no-underline text-left">
                              What is the RakanSales Nova Design System?
                            </AccordionTrigger>
                            <AccordionContent class="px-3 pb-3 pt-1 text-muted-foreground leading-relaxed font-semibold">
                              Nova is a hyper-premium, low-density Tailwind + Radix Vue components system crafted to maintain visual parity and strict consistent guidelines across all CRM front-end modules.
                            </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="item-2" class="border-none">
                            <AccordionTrigger class="px-3 py-2.5 font-bold text-foreground hover:text-primary transition-all hover:no-underline text-left">
                              Are all 65 elements natively integrated?
                            </AccordionTrigger>
                            <AccordionContent class="px-3 pb-3 pt-1 text-muted-foreground leading-relaxed font-semibold">
                              Yes! 51 components are natively downloaded and compiled under `@/components/ui`, while 14 community library references are cataloged in our live explorer registry list.
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>

                      <!-- Avatar & Status Badges Grouped -->
                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        
                        <!-- Avatar Stack -->
                        <div class="space-y-2 bg-muted/40 p-4 rounded-2xl border border-border/60 flex flex-col justify-center min-h-[96px] shadow-soft">
                          <div class="flex justify-between items-center">
                            <Label class="text-xs font-semibold text-foreground">Team Avatars Group</Label>
                          </div>
                          <div class="flex items-center -space-x-2.5 pt-1.5 select-none">
                            <Avatar class="size-8 border-2 border-background ring-1 ring-border shadow-soft">
                              <AvatarFallback class="bg-lime-500 text-white font-bold text-[9px]">JT</AvatarFallback>
                            </Avatar>
                            <Avatar class="size-8 border-2 border-background ring-1 ring-border shadow-soft">
                              <AvatarFallback class="bg-primary text-white font-bold text-[9px]">VM</AvatarFallback>
                            </Avatar>
                            <Avatar class="size-8 border-2 border-background ring-1 ring-border shadow-soft">
                              <AvatarFallback class="bg-slate-900 text-white font-bold text-[9px]">VT</AvatarFallback>
                            </Avatar>
                            <div class="flex items-center justify-center size-8 rounded-full border-2 border-background bg-secondary text-secondary-foreground font-bold text-[8.5px] ring-1 ring-border shadow-soft">
                              +4
                            </div>
                          </div>
                        </div>

                        <!-- Status Badges -->
                        <div class="space-y-2 bg-muted/40 p-4 rounded-2xl border border-border/60 flex flex-col justify-center min-h-[96px] shadow-soft">
                          <div class="flex justify-between items-center">
                            <Label class="text-xs font-semibold text-foreground">Showroom Status Badges</Label>
                          </div>
                          <div class="flex flex-wrap gap-1.5 pt-1 select-none">
                            <Badge variant="vibrant">Vibrant</Badge>
                            <Badge variant="muted">Muted</Badge>
                            <Badge variant="secondary">Lime</Badge>
                            <Badge variant="outline" class="bg-background border-border">Outline</Badge>
                          </div>
                        </div>

                      </div>

                    </div>

                    <!-- Right Side Column -->
                    <div class="space-y-6">
                      
                      <!-- Embla Carousel Widget (Analytical Slide widgets!) -->
                      <div class="space-y-3">
                        <div class="flex justify-between items-center">
                          <Label class="text-xs font-semibold text-foreground flex items-center gap-1">
                            Swipeable Slide Diagnostics
                          </Label>
                        </div>
                        <div class="bg-muted/40 px-6 sm:px-12 py-5 rounded-2xl border border-border/60 shadow-soft">
                          <Carousel class="w-full max-w-[240px] sm:max-w-xs mx-auto">
                            <CarouselContent>
                              
                              <!-- Slide 1: circular progress analytics dial -->
                              <CarouselItem>
                                <div class="p-1 select-none">
                                  <Card class="border border-border rounded-2xl overflow-hidden bg-card shadow-soft p-3">
                                    <div class="flex items-center gap-3">
                                      <div class="relative size-14 shrink-0 flex items-center justify-center">
                                        <!-- Ring dial SVG circle -->
                                        <svg class="size-full transform -rotate-90">
                                          <circle cx="28" cy="28" r="22" stroke="var(--border)" stroke-width="3" fill="transparent" />
                                          <circle cx="28" cy="28" r="22" stroke="#23B750" stroke-width="4.5" fill="transparent" stroke-dasharray="138" stroke-dashoffset="7" stroke-linecap="round" />
                                        </svg>
                                        <span class="absolute text-[9px] font-extrabold text-foreground font-mono">94.8%</span>
                                      </div>
                                      <div class="min-w-0">
                                        <div class="text-[8px] font-bold text-primary font-mono uppercase tracking-wider">AI Lead Diagnostics</div>
                                        <h5 class="font-bold text-[11px] text-foreground truncate mt-0.5">High Victory Precision</h5>
                                        <p class="text-[9px] text-muted-foreground truncate leading-relaxed"> funnels conversion vector</p>
                                      </div>
                                    </div>
                                  </Card>
                                </div>
                              </CarouselItem>

                              <!-- Slide 2: Stacked channels share bar widget -->
                              <CarouselItem>
                                <div class="p-1 select-none">
                                  <Card class="border border-border rounded-2xl overflow-hidden bg-card shadow-soft p-3">
                                    <div class="space-y-2">
                                      <div class="flex justify-between items-center text-[8.5px] font-bold font-mono">
                                        <span class="text-muted-foreground uppercase">Omnichannel Share</span>
                                        <span class="text-emerald-500">Live API</span>
                                      </div>
                                      <div class="h-3.5 w-full bg-muted rounded-lg overflow-hidden flex border border-black/5">
                                        <div class="h-full bg-[#25D366]" style="width: 45%" title="WhatsApp: 45%"></div>
                                        <div class="h-full bg-[#26A69A]" style="width: 30%" title="Telegram: 30%"></div>
                                        <div class="h-full bg-[#E4405F]" style="width: 25%" title="Instagram: 25%"></div>
                                      </div>
                                      <div class="flex justify-between items-center text-[8px] font-bold font-mono text-muted-foreground">
                                        <span class="flex items-center gap-1"><span class="size-1.5 bg-[#25D366] rounded-full"></span>WA 45%</span>
                                        <span class="flex items-center gap-1"><span class="size-1.5 bg-[#26A69A] rounded-full"></span>TG 30%</span>
                                        <span class="flex items-center gap-1"><span class="size-1.5 bg-[#E4405F] rounded-full"></span>IG 25%</span>
                                      </div>
                                    </div>
                                  </Card>
                                </div>
                              </CarouselItem>

                              <!-- Slide 3: Velocity metric bar -->
                              <CarouselItem>
                                <div class="p-1 select-none">
                                  <Card class="border border-border rounded-2xl overflow-hidden bg-card shadow-soft p-3">
                                    <div class="flex items-center justify-between gap-3">
                                      <div class="min-w-0 flex-1">
                                        <div class="text-[8px] font-bold text-amber-600 dark:text-amber-400 font-mono uppercase tracking-wider">Top Agent Performance</div>
                                        <h5 class="font-bold text-[11px] text-foreground truncate mt-0.5">Justin Tan</h5>
                                        <p class="text-[9px] text-muted-foreground truncate leading-relaxed">Avg Response Time: &lt;3m</p>
                                      </div>
                                      <div class="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 px-2 py-1.5 rounded-xl text-center shrink-0">
                                        <span class="block text-[11px] font-extrabold font-mono leading-none">114%</span>
                                        <span class="text-[6.5px] uppercase font-bold tracking-wide mt-0.5 block select-none">Quota</span>
                                      </div>
                                    </div>
                                  </Card>
                                </div>
                              </CarouselItem>

                            </CarouselContent>
                            <CarouselPrevious class="size-7 -left-5 sm:-left-9 text-muted-foreground border border-border bg-card hover:text-foreground cursor-pointer transition-all duration-150" />
                            <CarouselNext class="size-7 -right-5 sm:-right-9 text-muted-foreground border border-border bg-card hover:text-foreground cursor-pointer transition-all duration-150" />
                          </Carousel>
                        </div>
                      </div>

                      <!-- Fixed Aspect Ratio Box -->
                      <div class="space-y-3">
                        <div class="flex justify-between items-center">
                          <Label class="text-xs font-semibold text-foreground">Aspect Ratio Container (16:9 Canvas)</Label>
                        </div>
                        <div class="w-full overflow-hidden rounded-2xl border border-border bg-muted shadow-soft">
                          <AspectRatio :ratio="16 / 9" class="bg-gradient-to-br from-neutral-900 to-neutral-850 flex flex-col items-center justify-center text-xs text-neutral-400 dark:text-neutral-500 font-semibold font-mono gap-1 select-none">
                            <span class="text-primary font-bold text-xs animate-pulse">Nova Aspect Ratio Canvas</span>
                            <span class="text-[9px] text-neutral-500 font-bold">[16:9 Render Pipeline Viewport]</span>
                          </AspectRatio>
                        </div>
                      </div>

                    </div>

                  </div>

                </div>
              </CardContent>
            </Card>


            
            <!-- Category 4: Navigation & Feedback Showcase -->
            <Card id="sec-feedback" class="scroll-mt-24 border-border/70 hover:border-border transition-all duration-300 overflow-hidden bg-card/95 backdrop-blur-sm">
              <CardHeader :class="[densityClasses.cardHeader, 'border-b border-border/60 bg-muted/40 py-4.5 px-6 flex flex-row items-center justify-between gap-4']">
                <div class="space-y-1">
                  <div class="flex items-center gap-2 text-foreground">
                    <Sliders class="w-4.5 h-4.5 text-amber-500 stroke-[2.25]" />
                    <CardTitle class="text-base font-semibold tracking-tight">4. Navigation & Feedback Showcase</CardTitle>
                  </div>
                  <CardDescription class="text-xs text-muted-foreground">Horizontal steppers, breadcrumbs, loaders, progress bars, and pagination pages.</CardDescription>
                </div>
                <button 
                  @click="toggleInspector('feedback')" 
                  class="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-secondary hover:bg-secondary/80 rounded-lg text-xs font-semibold text-secondary-foreground cursor-pointer transition-colors border border-border"
                >
                  <Code2 class="w-3.5 h-3.5" />
                  {{ inspectorOpen.feedback ? 'Hide Code' : 'Inspect ESM' }}
                </button>
              </CardHeader>

              <!-- Collapsible Code Inspector Block -->
              <div 
                v-if="inspectorOpen.feedback" 
                class="border-b border-slate-800 bg-slate-900 text-slate-350 p-5 font-mono text-[10px] leading-relaxed space-y-3 animate-in slide-in-from-top-2 duration-200"
              >
                <div class="flex justify-between items-center">
                  <div class="text-[9px] font-bold tracking-widest text-emerald-400 uppercase">ESM Implementation Code</div>
                  <button 
                    @click="copyCodeSnippet(`import { Stepper } from '@/components/ui/stepper'\nimport { Progress } from '@/components/ui/progress'\nimport { Pagination } from '@/components/ui/pagination'\n\n<!-- 3-step active sales pipelines, loaders, and breadcrumb indicators -->`)"
                    class="px-2 py-1 bg-slate-800 hover:bg-slate-700 active:bg-slate-650 rounded text-[9px] font-bold text-slate-300 border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Copy class="w-3 h-3 text-emerald-400" />
                    Copy
                  </button>
                </div>
                <pre class="overflow-x-auto bg-slate-950 p-3 rounded-lg border border-slate-800/80"><code><span class="text-amber-400">import</span> { Stepper } <span class="text-amber-400">from</span> <span class="text-emerald-300">'@/components/ui/stepper'</span>
<span class="text-amber-400">import</span> { Progress } <span class="text-amber-400">from</span> <span class="text-emerald-300">'@/components/ui/progress'</span>
<span class="text-amber-400">import</span> { Pagination } <span class="text-amber-400">from</span> <span class="text-emerald-300">'@/components/ui/pagination'</span>

<span class="text-slate-400">&lt;!-- 3-step active sales pipelines, loaders, and breadcrumb indicators --&gt;</span></code></pre>
              </div>

              <CardContent :class="[densityClasses.cardContent, 'dark:text-slate-200']">
                
                <!-- Advanced Stepper Showcase -->
                <div class="space-y-3">
                  <div class="flex justify-between items-center">
                    <Label class="text-xs font-medium text-foreground">Advanced 3-Step Deal Pipeline</Label>
                    <span class="text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-900 uppercase tracking-wider">Stepper Element</span>
                  </div>
                  <div class="bg-muted/40 p-4 rounded-2xl border border-border/60 space-y-4 relative overflow-hidden">
                    <!-- Celebration victory particle burst overlay -->
                    <transition name="fade">
                      <div v-if="showWonCelebration" class="absolute inset-0 z-40 pointer-events-none flex flex-col items-center justify-center bg-emerald-500/10 backdrop-blur-[2px] transition-all duration-300">
                        <div class="absolute size-32 rounded-full border-4 border-emerald-500/40 animate-ping"></div>
                        <div class="absolute size-48 rounded-full border-2 border-emerald-500/20 animate-pulse"></div>
                        <div class="text-center animate-in zoom-in-95 duration-300 flex flex-col items-center justify-center">
                          <span class="text-4xl filter drop-shadow-md">🎉</span>
                          <span class="text-[10px] font-semibold text-emerald-400 tracking-widest mt-2 bg-slate-950 px-2.5 py-1 rounded-full border border-emerald-500/30">DEAL WON SUCCESS</span>
                        </div>
                      </div>
                    </transition>
                    <p class="text-xs text-muted-foreground leading-relaxed text-center">Interactive sales pipeline stages (click trigger to jump phases):</p>
                    
                    <div class="relative w-full max-w-md mx-auto py-2">
                      <!-- Background timeline bar -->
                      <div class="absolute top-[18px] left-[32px] right-[32px] h-[2.5px] bg-border rounded-full">
                        <!-- Colored progress line filler -->
                        <div 
                          class="h-full bg-primary rounded-full transition-all duration-500 ease-in-out" 
                          :style="{ width: activeStep === 1 ? '0%' : activeStep === 2 ? '50%' : '100%' }"
                        ></div>
                      </div>
                      
                      <Stepper v-model="activeStep" class="relative flex w-full items-start justify-between z-10">
                        <template 
                          v-for="step in [
                             { value: 1, title: 'Qualify' },
                             { value: 2, title: 'Proposal' },
                             { value: 3, title: 'Won' }
                          ]" 
                          :key="step.value"
                        >
                          <StepperItem 
                            :step="step.value" 
                            class="flex flex-col items-center gap-2 cursor-pointer focus:outline-none w-20"
                          >
                            <StepperTrigger class="flex flex-col items-center gap-2 focus:outline-none">
                              <StepperIndicator 
                                class="size-8 text-xs font-semibold rounded-full flex items-center justify-center transition-all duration-300 shrink-0 border"
                                :class="[ activeStep >= step.value ? 'bg-primary border-primary text-white scale-110' : 'bg-background border-border text-muted-foreground hover:border-muted-foreground/50' ]"
                              >
                                <Check v-if="activeStep > step.value" class="w-4 h-4 stroke-[3.5]" />
                                <span v-else>{{ step.value }}</span>
                              </StepperIndicator>
                              <span 
                                class="text-xs font-semibold transition-colors duration-150 text-center whitespace-nowrap"
                                :class="[activeStep >= step.value ? 'text-foreground' : 'text-muted-foreground']"
                              >
                                {{ step.title }}
                              </span>
                            </StepperTrigger>
                          </StepperItem>
                        </template>
                      </Stepper>
                    </div>
                  </div>
                </div>

                <!-- Breadcrumbs & Feedback grid wrapper -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  
                  <!-- Left Side Column -->
                  <div class="space-y-6">
                    
                    <!-- Breadcrumbs Navigation -->
                    <div class="space-y-3">
                      <div class="flex justify-between items-center">
                        <Label class="text-xs font-medium text-foreground">Breadcrumb Navigation Paths</Label>
                      </div>
                      <div class="p-3.5 bg-muted/40 rounded-2xl border border-border/60">
                        <Breadcrumb class="text-xs font-medium">
                          <BreadcrumbList>
                            <BreadcrumbItem>
                              <BreadcrumbLink href="#" class="hover:text-foreground transition-colors">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator class="text-muted-foreground" />
                            <BreadcrumbItem>
                              <BreadcrumbLink href="#" class="hover:text-foreground transition-colors">Workspace</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator class="text-muted-foreground" />
                            <BreadcrumbItem>
                              <BreadcrumbPage class="font-bold text-foreground">Nova Console</BreadcrumbPage>
                            </BreadcrumbItem>
                          </BreadcrumbList>
                        </Breadcrumb>
                      </div>
                    </div>

                    <!-- Interactive Loading Progress -->
                    <div class="space-y-3 bg-muted/40 p-4 rounded-2xl border border-border/60">
                      <div class="flex justify-between items-center text-xs">
                        <Label class="font-medium text-foreground">Database Query Progress</Label>
                        <div class="flex items-center gap-2">
                          <button 
                            @click="incrementProgress" 
                            class="size-6 text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg bg-background flex items-center justify-center cursor-pointer hover:bg-accent"
                          >
                            <Plus class="w-4.5 h-4.5" />
                          </button>
                          <span class="font-bold text-primary font-mono bg-primary/10 px-2 py-0.5 rounded">{{ progressValue }}%</span>
                        </div>
                      </div>
                      <Progress :model-value="progressValue" class="h-2 rounded-full bg-muted overflow-hidden" />
                    </div>

                  </div>

                  <!-- Right Side Column -->
                  <div class="space-y-6">

                    <!-- Pagination Navigation -->
                    <div class="space-y-3">
                      <div class="flex justify-between items-center">
                        <Label class="text-xs font-medium text-foreground">Pagination Lists Interface</Label>
                      </div>
                      <div class="flex flex-col items-center bg-muted/40 p-5 rounded-2xl border border-border/60 gap-4">
                                   <!-- Dynamic counter display for high-fidelity engagement -->
                        <div class="text-center space-y-1 select-none">
                          <div class="text-[10px] font-semibold text-primary uppercase tracking-wider">Workspace Leads Console</div>
                          <div class="text-base font-bold text-foreground">
                            Displaying Segment Leads #<span class="text-emerald-500 font-mono text-lg font-bold">{{ (activePage - 1) * 10 + 1 }}</span> to <span class="text-emerald-500 font-mono text-lg font-bold">{{ activePage * 10 }}</span>
                          </div>
                          <p class="text-xs text-muted-foreground">Segment Index: 100 records • Range bounds calculated dynamically</p>
                        </div>
                        
                        <!-- Mini paginated leads list showing instant data updates -->
                        <div :key="activePage" class="w-full max-w-sm space-y-2">
                          <div 
                            v-for="i in 3" 
                            :key="i" 
                            class="flex justify-between items-center bg-card p-3 rounded-xl border border-border/60 animate-in fade-in slide-in-from-bottom-2 duration-300"
                          >
                            <div class="flex items-center gap-2.5 min-w-0">
                               <span class="size-6 rounded-full bg-emerald-500/10 text-emerald-600 font-mono text-[10px] flex items-center justify-center font-semibold shrink-0 border border-emerald-500/15">
                                 {{ (activePage - 1) * 10 + i }}
                               </span>
                              <div class="truncate">
                                <div class="text-xs font-semibold text-foreground truncate">Lead Partner {{ (activePage - 1) * 10 + i }}</div>
                                <div class="text-xs text-muted-foreground">Auto-generated segment record</div>
                              </div>
                            </div>
                            <span class="text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-lg border border-emerald-500/20 font-mono shrink-0">
                              ${{ (15200 + ((activePage * i) * 650)).toLocaleString() }} USD
                            </span>
                          </div>
                        </div>

                        <Separator class="w-full bg-border/60 my-1" />

                        <Pagination 
                          v-model:page="activePage"
                          v-slot="{ page }"
                          :total="100"
                          :items-per-page="10"
                          :sibling-count="1"
                          class="text-xs"
                        >
                          <PaginationContent v-slot="{ items }" class="flex gap-1.5 items-center">
                            <PaginationFirst class="cursor-pointer hover:bg-accent hover:scale-105 active:scale-95 transition-all duration-150" />
                            <PaginationPrevious class="cursor-pointer hover:bg-accent hover:scale-105 active:scale-95 transition-all duration-150" />
                            <template v-for="(item, index) in items" :key="index">
                              <PaginationItem 
                                v-if="item.type === 'page'" 
                                :value="item.value"
                                :is-active="item.value === activePage"
                                :class="[ 'cursor-pointer select-none rounded-xl transition-all duration-200 w-9 h-9 flex items-center justify-center font-bold text-xs', item.value === activePage ? 'bg-primary text-white scale-110 font-bold border-transparent' : 'hover:bg-muted dark:hover:bg-slate-800' ]"
                              >
                                {{ item.value }}
                              </PaginationItem>
                              <PaginationEllipsis v-else :index="index" />
                            </template>
                            <PaginationNext class="cursor-pointer hover:bg-accent hover:scale-105 active:scale-95 transition-all duration-150" />
                            <PaginationLast class="cursor-pointer hover:bg-accent hover:scale-105 active:scale-95 transition-all duration-150" />
                          </PaginationContent>
                        </Pagination>
                      </div>
                    </div>

                    <!-- Loading Skeletons -->
                    <div class="space-y-3">
                      <div class="flex justify-between items-center">
                        <Label class="text-xs font-medium text-foreground">Loading Skeleton Animations</Label>
                      </div>
                      <div class="flex items-center space-x-4 bg-muted/40 p-4 rounded-2xl border border-border/60">
                        <Skeleton class="h-10 w-10 rounded-full bg-muted/65 skeleton-shimmer" />
                        <div class="space-y-2 flex-1">
                          <Skeleton class="h-4 w-[75%] rounded-lg bg-muted/65 skeleton-shimmer" />
                          <Skeleton class="h-3.5 w-[50%] rounded-lg bg-muted/65 skeleton-shimmer" />
                        </div>
                      </div>
                    </div>

                  </div>

                </div>

              </CardContent>
            </Card>

            <!-- Category 5: Visual Iconography & Brand Standards (New!) -->
            <Card id="sec-iconography" class="scroll-mt-24 border-border/70 hover:border-border transition-all duration-300 overflow-hidden bg-card/95 backdrop-blur-sm">
              <CardHeader :class="[densityClasses.cardHeader, 'border-b border-border/60 bg-muted/40 py-4.5 px-6 flex flex-row items-center justify-between gap-4']">
                <div class="space-y-1">
                  <div class="flex items-center gap-2 text-foreground">
                    <Compass class="w-4.5 h-4.5 text-primary stroke-[2.25]" />
                    <CardTitle class="text-base font-semibold tracking-tight">5. Iconography & Brand Standards</CardTitle>
                  </div>
                  <CardDescription class="text-xs text-muted-foreground">Exclusively use Lucide system icons, and Iconify simple-icons for brand logos.</CardDescription>
                </div>
              </CardHeader>
              <CardContent :class="[densityClasses.cardContent, 'dark:text-slate-200']">
                
                <!-- System Iconography (Lucide-Vue-Next) -->
                <div class="space-y-3">
                  <div class="flex justify-between items-center">
                    <Label class="text-xs font-medium text-foreground">Standard System Icons (Lucide-Vue-Next)</Label>
                    <span class="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20 uppercase tracking-wider">Stroke 2.0</span>
                  </div>
                  <p class="text-xs text-muted-foreground leading-relaxed">System UI elements must exclusively use Lucide-Vue-Next styled with standard strokes.</p>
                  <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 bg-muted/40 p-4 rounded-2xl border border-border/60 text-center">
                    <div class="flex flex-col items-center gap-1.5 p-3 bg-card rounded-xl border border-border/60 hover:-translate-y-0.5 transition-all">
                      <Search class="w-5 h-5 text-foreground stroke-[2.0]" />
                      <span class="text-[10px] font-medium text-muted-foreground">Search</span>
                    </div>
                    <div class="flex flex-col items-center gap-1.5 p-3 bg-card rounded-xl border border-border/60 hover:-translate-y-0.5 transition-all">
                      <Settings class="w-5 h-5 text-foreground stroke-[2.0]" />
                      <span class="text-[10px] font-medium text-muted-foreground">Settings</span>
                    </div>
                    <div class="flex flex-col items-center gap-1.5 p-3 bg-card rounded-xl border border-border/60 hover:-translate-y-0.5 transition-all">
                      <Users class="w-5 h-5 text-foreground stroke-[2.0]" />
                      <span class="text-[10px] font-medium text-muted-foreground">Users</span>
                    </div>
                    <div class="flex flex-col items-center gap-1.5 p-3 bg-card rounded-xl border border-border/60 hover:-translate-y-0.5 transition-all">
                      <Bell class="w-5 h-5 text-foreground stroke-[2.0]" />
                      <span class="text-[10px] font-medium text-muted-foreground">Alerts</span>
                    </div>
                    <div class="flex flex-col items-center gap-1.5 p-3 bg-card rounded-xl border border-border/60 col-span-2 sm:col-span-1 hover:-translate-y-0.5 transition-all">
                      <Building2 class="w-5 h-5 text-foreground stroke-[2.0]" />
                      <span class="text-[10px] font-medium text-muted-foreground">Company</span>
                    </div>
                  </div>
                </div>
                
                <!-- Brand Logotypes (Iconify Simple-Icons) -->
                <div class="space-y-3">
                  <div class="flex justify-between items-center">
                    <Label class="text-xs font-medium text-foreground">Social & Brand Logotypes (Iconify Vue)</Label>
                    <span class="text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-900 uppercase tracking-wider">Simple-Icons</span>
                  </div>
                  <p class="text-xs text-muted-foreground leading-relaxed">Lucide does not have brand icons. Brand elements must render with Iconify simple-icons.</p>
                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-3.5 bg-muted/40 p-4 rounded-2xl border border-border/60 text-center">
                    <div class="flex flex-col items-center gap-1.5 p-3.5 bg-card rounded-xl border border-border/60 hover:-translate-y-0.5 transition-all">
                      <Icon icon="simple-icons:whatsapp" class="w-6 h-6 text-[#25D366]" />
                      <span class="text-[10px] font-medium text-muted-foreground mt-1">WhatsApp</span>
                    </div>
                    <div class="flex flex-col items-center gap-1.5 p-3.5 bg-card rounded-xl border border-border/60 hover:-translate-y-0.5 transition-all">
                      <Icon icon="simple-icons:telegram" class="w-6 h-6 text-[#26A69A]" />
                      <span class="text-[10px] font-medium text-muted-foreground mt-1">Telegram</span>
                    </div>
                    <div class="flex flex-col items-center gap-1.5 p-3.5 bg-card rounded-xl border border-border/60 hover:-translate-y-0.5 transition-all">
                      <Icon icon="simple-icons:instagram" class="w-6 h-6 text-[#E4405F]" />
                      <span class="text-[10px] font-medium text-muted-foreground mt-1">Instagram</span>
                    </div>
                    <div class="flex flex-col items-center gap-1.5 p-3.5 bg-card rounded-xl border border-border/60 hover:-translate-y-0.5 transition-all">
                      <Icon icon="simple-icons:facebook" class="w-6 h-6 text-[#1877F2]" />
                      <span class="text-[10px] font-medium text-muted-foreground mt-1">Facebook</span>
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>

            <!-- Category 6: Colors & Typography Swatches (New!) -->
            <Card id="sec-colors-typography" class="scroll-mt-24 border-border/70 hover:border-border transition-all duration-300 overflow-hidden bg-card/95 backdrop-blur-sm">
              <CardHeader :class="[densityClasses.cardHeader, 'border-b border-border/60 bg-muted/40 py-4.5 px-6 flex flex-row items-center justify-between gap-4']">
                <div class="space-y-1">
                  <div class="flex items-center gap-2 text-foreground">
                    <Palette class="w-4.5 h-4.5 text-primary stroke-[2.25]" />
                    <CardTitle class="text-base font-semibold tracking-tight">6. Color Palette & Typography Atoms</CardTitle>
                  </div>
                  <CardDescription class="text-xs text-muted-foreground">Standardized colors, system state levels, and typography scale with one-click copyable class utilities.</CardDescription>
                </div>
              </CardHeader>
              <CardContent :class="[densityClasses.cardContent, 'dark:text-slate-200']">
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-2">
                  
                  <!-- Color Palette Section -->
                  <div class="space-y-4">
                    <div class="flex justify-between items-center">
                      <Label class="text-xs font-semibold text-foreground flex items-center gap-1">
                        <Palette class="size-3.5 text-primary" />
                        CRM Color Palette
                      </Label>
                      <span class="text-[9px] font-bold px-2 py-0.5 bg-primary/10 text-primary rounded-md uppercase tracking-wider font-mono">Tailwind Theme Swatches</span>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-3.5 bg-muted/40 p-4 rounded-2xl border border-border/60">
                      
                      <!-- Primary Brand Green -->
                      <div class="flex flex-col p-2.5 bg-card rounded-xl border border-border/60 hover:-translate-y-0.5 transition-all">
                        <div class="h-10 w-full rounded-lg bg-primary mb-2 flex items-center justify-center border border-black/5">
                          <span class="text-[10px] font-mono font-bold text-white">hsl(var(--primary))</span>
                        </div>
                        <div class="flex justify-between items-center text-[10px] font-bold text-foreground">
                          <span>Primary Green</span>
                          <button @click="copyCodeSnippet('bg-primary')" class="text-muted-foreground hover:text-primary transition-colors cursor-pointer" title="Copy Class">
                            <Copy class="size-3" />
                          </button>
                        </div>
                        <span class="text-[9px] text-muted-foreground font-mono mt-0.5">bg-primary / #23B750</span>
                      </div>

                      <!-- RKS Lime Accent -->
                      <div class="flex flex-col p-2.5 bg-card rounded-xl border border-border/60 hover:-translate-y-0.5 transition-all">
                        <div class="h-10 w-full rounded-lg mb-2 flex items-center justify-center border border-black/5" style="background-color: #62D816;">
                          <span class="text-[10px] font-mono font-bold text-slate-800">--rks-lime</span>
                        </div>
                        <div class="flex justify-between items-center text-[10px] font-bold text-foreground">
                          <span>RKS Lime (Accent)</span>
                          <button @click="copyCodeSnippet('[background-color:var(--rks-lime)]')" class="text-muted-foreground hover:text-primary transition-colors cursor-pointer" title="Copy Class">
                            <Copy class="size-3" />
                          </button>
                        </div>
                        <span class="text-[9px] text-muted-foreground font-mono mt-0.5">--rks-lime / #62D816</span>
                      </div>

                      <!-- Dark Charcoal / Background -->
                      <div class="flex flex-col p-2.5 bg-card rounded-xl border border-border/60 hover:-translate-y-0.5 transition-all">
                        <div class="h-10 w-full rounded-lg bg-slate-900 dark:bg-slate-950 mb-2 flex items-center justify-center border border-black/5">
                          <span class="text-[10px] font-mono font-bold text-white">#0f172a / #020617</span>
                        </div>
                        <div class="flex justify-between items-center text-[10px] font-bold text-foreground">
                          <span>Dark Charcoal</span>
                          <button @click="copyCodeSnippet('bg-slate-900')" class="text-muted-foreground hover:text-primary transition-colors cursor-pointer" title="Copy Class">
                            <Copy class="size-3" />
                          </button>
                        </div>
                        <span class="text-[9px] text-muted-foreground font-mono mt-0.5">bg-slate-900</span>
                      </div>

                      <!-- Muted / Background -->
                      <div class="flex flex-col p-2.5 bg-card rounded-xl border border-border/60 hover:-translate-y-0.5 transition-all">
                        <div class="h-10 w-full rounded-lg bg-muted mb-2 flex items-center justify-center border border-black/5">
                          <span class="text-[10px] font-mono font-bold text-muted-foreground">hsl(var(--muted))</span>
                        </div>
                        <div class="flex justify-between items-center text-[10px] font-bold text-foreground">
                          <span>Muted Background</span>
                          <button @click="copyCodeSnippet('bg-muted')" class="text-muted-foreground hover:text-primary transition-colors cursor-pointer" title="Copy Class">
                            <Copy class="size-3" />
                          </button>
                        </div>
                        <span class="text-[9px] text-muted-foreground font-mono mt-0.5">bg-muted</span>
                      </div>

                      <!-- System States: Success, Info, Warning, Danger -->
                      <div class="col-span-2 border-t border-border/50 pt-3 mt-1.5">
                        <Label class="text-[9px] font-bold text-muted-foreground uppercase tracking-wider select-none mb-2 block">System States</Label>
                        <div class="grid grid-cols-4 gap-2">
                          <button @click="copyCodeSnippet('text-emerald-500')" class="flex flex-col items-center gap-1 p-2 bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/20 rounded-lg text-center cursor-pointer group transition-all">
                            <span class="size-3 rounded-full bg-emerald-500 border border-black/5"></span>
                            <span class="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 group-hover:underline">Success</span>
                          </button>
                          <button @click="copyCodeSnippet('text-blue-500')" class="flex flex-col items-center gap-1 p-2 bg-blue-500/10 hover:bg-blue-500/15 border border-blue-500/20 rounded-lg text-center cursor-pointer group transition-all">
                            <span class="size-3 rounded-full bg-blue-500 border border-black/5"></span>
                            <span class="text-[9px] font-bold text-blue-600 dark:text-blue-400 group-hover:underline">Info</span>
                          </button>
                          <button @click="copyCodeSnippet('text-amber-500')" class="flex flex-col items-center gap-1 p-2 bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/20 rounded-lg text-center cursor-pointer group transition-all">
                            <span class="size-3 rounded-full bg-amber-500 border border-black/5"></span>
                            <span class="text-[9px] font-bold text-amber-600 dark:text-amber-400 group-hover:underline">Warning</span>
                          </button>
                          <button @click="copyCodeSnippet('text-red-500')" class="flex flex-col items-center gap-1 p-2 bg-red-500/10 hover:bg-red-500/15 border border-red-500/20 rounded-lg text-center cursor-pointer group transition-all">
                            <span class="size-3 rounded-full bg-red-500 border border-black/5"></span>
                            <span class="text-[9px] font-bold text-red-600 dark:text-red-400 group-hover:underline">Danger</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>

                  <!-- Typography Scale Section -->
                  <div class="space-y-4">
                    <div class="flex justify-between items-center">
                      <Label class="text-xs font-semibold text-foreground flex items-center gap-1">
                        <Type class="size-3.5 text-primary" />
                        CRM Typography Scale
                      </Label>
                      <span class="text-[9px] font-bold px-2 py-0.5 bg-primary/10 text-primary rounded-md uppercase tracking-wider font-mono">Font Hierarchy</span>
                    </div>

                    <div class="space-y-3.5 bg-muted/40 p-4 rounded-2xl border border-border/60">
                      
                      <!-- Title 3xl -->
                      <div class="flex items-center justify-between gap-4 p-2 bg-card rounded-xl border border-border/60">
                        <div class="min-w-0">
                          <span class="text-[8px] font-bold text-muted-foreground uppercase font-mono">3xl Heading • tracking-tight</span>
                          <h3 class="text-sm font-bold text-foreground truncate mt-0.5">RakanSales CRM</h3>
                        </div>
                        <button @click="copyCodeSnippet('text-3xl font-bold tracking-tight')" class="px-2 py-1 bg-secondary text-secondary-foreground hover:bg-muted rounded-lg text-[9px] font-bold border border-border shrink-0 flex items-center gap-1 transition-colors cursor-pointer">
                          <Copy class="size-2.5" />
                          Copy
                        </button>
                      </div>

                      <!-- Subtitle lg -->
                      <div class="flex items-center justify-between gap-4 p-2 bg-card rounded-xl border border-border/60">
                        <div class="min-w-0">
                          <span class="text-[8px] font-bold text-muted-foreground uppercase font-mono">lg Medium Subtitle</span>
                          <p class="text-xs font-semibold text-foreground truncate mt-0.5">Pipeline Manager Console</p>
                        </div>
                        <button @click="copyCodeSnippet('text-lg font-semibold')" class="px-2 py-1 bg-secondary text-secondary-foreground hover:bg-muted rounded-lg text-[9px] font-bold border border-border shrink-0 flex items-center gap-1 transition-colors cursor-pointer">
                          <Copy class="size-2.5" />
                          Copy
                        </button>
                      </div>

                      <!-- Body Standard -->
                      <div class="flex items-center justify-between gap-4 p-2 bg-card rounded-xl border border-border/60">
                        <div class="min-w-0">
                          <span class="text-[8px] font-bold text-muted-foreground uppercase font-mono">Standard Body (text-xs)</span>
                          <p class="text-xs text-muted-foreground truncate mt-0.5">Organize contacts and optimize deals flows.</p>
                        </div>
                        <button @click="copyCodeSnippet('text-xs text-muted-foreground')" class="px-2 py-1 bg-secondary text-secondary-foreground hover:bg-muted rounded-lg text-[9px] font-bold border border-border shrink-0 flex items-center gap-1 transition-colors cursor-pointer">
                          <Copy class="size-2.5" />
                          Copy
                        </button>
                      </div>

                      <!-- Monospace / Code -->
                      <div class="flex items-center justify-between gap-4 p-2 bg-card rounded-xl border border-border/60">
                        <div class="min-w-0">
                          <span class="text-[8px] font-bold text-muted-foreground uppercase font-mono">Monospace Data (font-mono)</span>
                          <p class="text-xs font-mono text-emerald-600 dark:text-emerald-400 truncate mt-0.5">$24,050 USD • API Done</p>
                        </div>
                        <button @click="copyCodeSnippet('text-xs font-mono')" class="px-2 py-1 bg-secondary text-secondary-foreground hover:bg-muted rounded-lg text-[9px] font-bold border border-border shrink-0 flex items-center gap-1 transition-colors cursor-pointer">
                          <Copy class="size-2.5" />
                          Copy
                        </button>
                      </div>

                    </div>
                  </div>

                </div>

              </CardContent>
            </Card>

            <!-- Category 7: Dashboard Elements & Toast Feedback -->
            <Card id="sec-dashboard-widgets" class="scroll-mt-24 border-border/70 hover:border-border transition-all duration-300 overflow-hidden bg-card/95 backdrop-blur-sm">
              <CardHeader :class="[densityClasses.cardHeader, 'border-b border-border/60 bg-muted/40 py-4.5 px-6 flex flex-row items-center justify-between gap-4']">
                <div class="space-y-1">
                  <div class="flex items-center gap-2 text-foreground">
                    <Puzzle class="w-4.5 h-4.5 text-emerald-500 stroke-[2.25]" />
                    <CardTitle class="text-base font-semibold tracking-tight">7. Dashboard Widgets & Toast Systems</CardTitle>
                  </div>
                  <CardDescription class="text-xs text-muted-foreground">General-purpose dashboard feature modules, toast notification consoles, and visual threshold progress metrics.</CardDescription>
                </div>
              </CardHeader>
              <CardContent :class="[densityClasses.cardContent, 'dark:text-slate-200']">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-2">
                  
                  <!-- Column 1: Feature Card Component -->
                  <div class="space-y-3">
                    <div class="flex justify-between items-center">
                      <Label class="text-xs font-medium text-foreground">Premium Analytics Widget Card</Label>
                    </div>
                    <p class="text-xs text-muted-foreground leading-relaxed">Reusable card block showing category tag, glowing active status, brief description, and button actions.</p>
                    
                    <div class="max-w-xs mx-auto border border-border rounded-2xl p-4.5 bg-card hover:border-primary/20 transition-all duration-200 shadow-soft">
                      <div class="flex justify-between items-start mb-3">
                        <div class="p-2.5 bg-indigo-500/10 rounded-xl border border-border">
                          <Sparkles class="text-indigo-500 w-5 h-5 shrink-0" />
                        </div>
                        <span class="bg-indigo-500/15 text-indigo-650 border border-indigo-500/25 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-900/50 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                          AI Model
                        </span>
                      </div>
                      <h4 class="font-bold text-foreground text-base">Smart Assistant</h4>
                      
                      <div class="flex items-center gap-1.5 mt-0.5 text-[10px] text-muted-foreground font-medium">
                        <span>Lead Insights</span>
                        <span class="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                          <span class="size-1 bg-emerald-500 rounded-full animate-pulse"></span>
                          Operational
                        </span>
                      </div>

                      <p class="text-xs text-muted-foreground line-clamp-2 leading-relaxed mt-2.5">
                        Automatically analyze communication history to evaluate deal victory potential index.
                      </p>
                      <div class="mt-4 pt-3 border-t border-border/60 flex flex-col space-y-3">
                        <div>
                          <span class="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Metrics</span>
                          <p class="text-sm font-bold text-foreground mt-0.5">
                            94.8% <span class="text-xs text-muted-foreground font-medium font-sans">prediction precision</span>
                          </p>
                        </div>
                        <Button size="sm" @click="toast.success('AI Diagnostics scanner started!')" class="w-full text-xs font-semibold border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 rounded-xl h-8 flex items-center justify-center gap-1 cursor-pointer">
                          Activate Insights
                          <Check class="w-3.5 h-3.5 stroke-[3.5]" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <!-- Column 2: Interactive Toast Console -->
                  <div class="space-y-3">
                    <div class="flex justify-between items-center">
                      <Label class="text-xs font-medium text-foreground">Interactive Sonner Toast Control Pad</Label>
                    </div>
                    <p class="text-xs text-muted-foreground leading-relaxed">Directly verify toast popups. Each triggers a unique premium toast state with corresponding color actions.</p>
                    
                    <div class="grid grid-cols-1 gap-2.5 bg-muted/40 p-4.5 rounded-2xl border border-border/60 max-w-xs mx-auto">
                      <Button size="sm" variant="success" @click="triggerToast('success')" class="w-full text-xs font-bold rounded-xl h-9.5 flex items-center justify-center gap-2 cursor-pointer shadow-soft">
                        <Check class="size-4" />
                        Trigger Success Toast
                      </Button>
                      <Button size="sm" variant="outline" @click="triggerToast('info')" class="w-full text-xs font-bold rounded-xl h-9.5 bg-card hover:bg-accent border-border text-foreground flex items-center justify-center gap-2 cursor-pointer shadow-soft">
                        <Info class="size-4 text-blue-500" />
                        Trigger Info Toast
                      </Button>
                      <Button size="sm" variant="dark" @click="triggerToast('warning')" class="w-full text-xs font-bold rounded-xl h-9.5 bg-amber-500/10 hover:bg-amber-500/15 border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center gap-2 cursor-pointer shadow-soft">
                        <AlertCircle class="size-4" />
                        Trigger Warning Toast
                      </Button>
                      <Button size="sm" variant="danger" @click="triggerToast('error')" class="w-full text-xs font-bold rounded-xl h-9.5 flex items-center justify-center gap-2 cursor-pointer shadow-soft">
                        <AlertCircle class="size-4" />
                        Trigger Error Toast
                      </Button>
                    </div>
                  </div>

                  <!-- Column 3: Threshold Progress Meters -->
                  <div class="space-y-3">
                    <div class="flex justify-between items-center">
                      <Label class="text-xs font-medium text-foreground">Threshold Progress Metrics</Label>
                    </div>
                    <p class="text-xs text-muted-foreground leading-relaxed">Status meters supporting automatic warnings (Amber warning >= 80%, Red pulsing danger >= 90%).</p>
                    
                    <div class="grid grid-cols-1 gap-3.5 bg-muted/40 p-3.5 rounded-2xl border border-border/60 max-w-xs mx-auto">
                      
                      <!-- Normal State -->
                      <div class="border border-border p-3 rounded-xl bg-card">
                        <div class="flex items-center justify-between gap-3 mb-1.5">
                          <span class="font-bold text-[11px] text-foreground">Storage Allocation</span>
                          <span class="inline-flex items-center gap-0.5 text-[9px] font-semibold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-800">
                            Normal
                          </span>
                        </div>
                        <div class="flex items-baseline gap-1 text-[10px] mb-2">
                          <span class="text-xs font-bold text-foreground">3.2 GB</span>
                          <span class="text-muted-foreground font-medium">/ 10 GB quota</span>
                        </div>
                        <div class="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                          <div class="h-full rounded-full bg-primary" style="width: 32%"></div>
                        </div>
                      </div>

                      <!-- Warning State -->
                      <div class="border border-border p-3 rounded-xl bg-card">
                        <div class="flex items-center justify-between gap-3 mb-1.5">
                          <span class="font-bold text-[11px] text-foreground">API Quota Usage</span>
                          <span class="inline-flex items-center gap-0.5 text-[9px] font-semibold text-amber-600 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-100 dark:bg-amber-950/20 dark:border-amber-800">
                            High Usage
                          </span>
                        </div>
                        <div class="flex items-baseline gap-1 text-[10px] mb-2">
                          <span class="text-xs font-bold text-foreground">8,400</span>
                          <span class="text-muted-foreground font-medium">/ 10,000 queries</span>
                        </div>
                        <div class="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                          <div class="h-full rounded-full bg-amber-500 dark:bg-amber-400" style="width: 84%"></div>
                        </div>
                      </div>

                      <!-- Danger State -->
                      <div class="border border-border p-3 rounded-xl bg-card">
                        <div class="flex items-center justify-between gap-3 mb-1.5">
                          <span class="font-bold text-[11px] text-foreground">Memory Buffer Pages</span>
                          <span class="inline-flex items-center gap-0.5 text-[9px] font-semibold text-red-600 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-100 dark:bg-red-950/20 dark:border-red-800">
                            Critical Alert
                          </span>
                        </div>
                        <div class="flex items-baseline gap-1 text-[10px] mb-2">
                          <span class="text-xs font-bold text-foreground">468</span>
                          <span class="text-muted-foreground font-medium">/ 500 pages limit</span>
                        </div>
                        <div class="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                          <div class="h-full rounded-full bg-red-500 dark:bg-red-400 animate-pulse" style="width: 93.6%"></div>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>

                <!-- Row 2: Customer Activity Timeline Feed (CRM Multi-Channel Touchpoints) -->
                <div class="mt-8 pt-6 border-t border-border/60 space-y-4">
                  <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <div>
                      <Label class="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <Activity class="size-3.5 text-primary" />
                        <span>Real-Time Customer Activity Timeline Feed</span>
                      </Label>
                      <p class="text-xs text-muted-foreground mt-0.5">Chronological omnichannel touchpoints across WhatsApp, VoIP phone calls, funnel changes, and calendar bookings.</p>
                    </div>
                    <span class="text-[10px] font-mono font-bold px-2 py-0.5 bg-primary/10 text-primary rounded-md border border-primary/20 shrink-0">
                      Live Stream: 4 Events
                    </span>
                  </div>

                  <div class="bg-muted/30 p-5 rounded-2xl border border-border/70 space-y-4">
                    <div class="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-border">
                      
                      <!-- Event 1: Phone Call -->
                      <div class="relative group">
                        <div class="absolute -left-6 top-0.5 size-6 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 dark:text-emerald-400 bg-card">
                          <Icon icon="lucide:phone-call" class="size-3" />
                        </div>
                        <div class="bg-card p-3 rounded-xl border border-border hover:border-primary/40 transition-colors shadow-soft">
                          <div class="flex items-center justify-between gap-2">
                            <span class="font-bold text-xs text-foreground">Outbound Discovery Call (12m 45s)</span>
                            <span class="text-[9px] font-mono text-muted-foreground">10 mins ago</span>
                          </div>
                          <p class="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                            Sarah Jenkins spoke with CEO Alex Rivera regarding 50-seat team deployment. Client requested customized SLA proposal.
                          </p>
                          <div class="mt-2 flex items-center gap-2">
                            <Badge variant="outline" class="text-[9px] font-mono bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Call Recorded</Badge>
                            <span class="text-[10px] text-muted-foreground font-semibold">Rep: Sarah Jenkins</span>
                          </div>
                        </div>
                      </div>

                      <!-- Event 2: WhatsApp Automated Message -->
                      <div class="relative group">
                        <div class="absolute -left-6 top-0.5 size-6 rounded-full bg-green-500/10 border-2 border-[#25D366] flex items-center justify-center text-[#25D366] bg-card">
                          <Icon icon="simple-icons:whatsapp" class="size-3" />
                        </div>
                        <div class="bg-card p-3 rounded-xl border border-border hover:border-primary/40 transition-colors shadow-soft">
                          <div class="flex items-center justify-between gap-2">
                            <span class="font-bold text-xs text-foreground">WhatsApp Bot Auto-Dispatched PDF</span>
                            <span class="text-[9px] font-mono text-muted-foreground">28 mins ago</span>
                          </div>
                          <p class="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                            Delivered <code class="font-mono text-primary bg-primary/10 px-1 py-0.5 rounded text-[10px]">RakanSales_Enterprise_Deck_2026.pdf</code> via WhatsApp Cloud API webhook.
                          </p>
                          <div class="mt-2 flex items-center gap-2">
                            <Badge variant="outline" class="text-[9px] font-mono bg-blue-500/10 text-blue-600 border-blue-500/20">Read Receipt 14:12</Badge>
                            <span class="text-[10px] text-muted-foreground font-semibold">Channel: +60 12-345 6789</span>
                          </div>
                        </div>
                      </div>

                      <!-- Event 3: Stage Update -->
                      <div class="relative group">
                        <div class="absolute -left-6 top-0.5 size-6 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center text-primary bg-card">
                          <TrendingUp class="size-3" />
                        </div>
                        <div class="bg-card p-3 rounded-xl border border-border hover:border-primary/40 transition-colors shadow-soft">
                          <div class="flex items-center justify-between gap-2">
                            <span class="font-bold text-xs text-foreground">Pipeline Deal Stage Advanced</span>
                            <span class="text-[9px] font-mono text-muted-foreground">1 hour ago</span>
                          </div>
                          <p class="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                            Lead <strong class="text-foreground">Acme Corp</strong> upgraded from <em>Qualified Lead</em> to <strong class="text-emerald-500">Proposal Stage ($24,500 USD)</strong>.
                          </p>
                        </div>
                      </div>

                      <!-- Event 4: Demo Meeting Booked -->
                      <div class="relative group">
                        <div class="absolute -left-6 top-0.5 size-6 rounded-full bg-amber-500/10 border-2 border-amber-500 flex items-center justify-center text-amber-600 bg-card">
                          <Icon icon="lucide:calendar" class="size-3" />
                        </div>
                        <div class="bg-card p-3 rounded-xl border border-border hover:border-primary/40 transition-colors shadow-soft">
                          <div class="flex items-center justify-between gap-2">
                            <span class="font-bold text-xs text-foreground">Technical Demo Scheduled</span>
                            <span class="text-[9px] font-mono text-muted-foreground">Tomorrow at 3:00 PM</span>
                          </div>
                          <p class="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                            Google Meet invitation sent to engineering team (justin@veecotech.com.my).
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <!-- Category 8: Interactive Kanban Deal Pipeline Board -->
            <Card id="sec-kanban" class="scroll-mt-24 border-border/70 hover:border-border transition-all duration-300 overflow-hidden bg-card/95 backdrop-blur-sm">
              <CardHeader :class="[densityClasses.cardHeader, 'border-b border-border/60 bg-muted/40 py-4.5 px-6 flex flex-row items-center justify-between gap-4']">
                <div class="space-y-1">
                  <div class="flex items-center gap-2 text-foreground">
                    <Icon icon="lucide:kanban" class="w-4.5 h-4.5 text-[#23B750] stroke-[2.25]" />
                    <CardTitle class="text-base font-semibold tracking-tight">8. Interactive Kanban Deal Pipeline Board</CardTitle>
                  </div>
                  <CardDescription class="text-xs text-muted-foreground">Synchronized 1:1 with Deals View (RM currency, hot lead flame indicators, weighted values, and stage stripes).</CardDescription>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-[10px] font-mono font-bold px-2 py-0.5 bg-primary/10 text-primary rounded-md border border-primary/20">
                    Total Pipeline: RM {{ kanbanDeals.reduce((a, b) => a + b.value, 0).toLocaleString() }}
                  </span>
                </div>
              </CardHeader>
              <CardContent :class="[densityClasses.cardContent, 'p-6 dark:text-slate-200']">
                <div class="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
                  
                  <!-- Column Lane -->
                  <div 
                    v-for="stage in kanbanStages" 
                    :key="stage" 
                    class="bg-muted/30 p-3 rounded-2xl border border-border/70 flex flex-col space-y-2.5"
                  >
                    <!-- Stage Column Header top stripe (Matching DealsView.vue) -->
                    <div
                      class="h-1.5 w-full rounded-full shrink-0"
                      :style="{ backgroundColor: stageColorConfig[stage].headerBar }"
                    ></div>

                    <!-- Column Header Text and Actions -->
                    <div class="px-1 flex flex-col gap-1 shrink-0 w-full pb-1 border-b border-border/50">
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-1.5 min-w-0">
                          <span class="font-extrabold text-xs text-foreground truncate leading-none">{{ stage }}</span>
                          <span class="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-muted text-muted-foreground font-mono">
                            {{ getStageDeals(stage).length }}
                          </span>
                        </div>
                      </div>
                      <!-- Weighted values indicator -->
                      <div class="text-[10px] text-muted-foreground flex items-center justify-between">
                        <span>Weighted value:</span>
                        <span class="text-[#23B750] font-bold font-mono">{{ getStageWeightedValueSum(stage) }}</span>
                      </div>
                    </div>

                    <!-- Cards Container -->
                    <div class="space-y-2 flex-1 min-h-[220px]">
                      <div 
                        v-for="deal in getStageDeals(stage)" 
                        :key="deal.id"
                        class="w-full bg-card rounded-xl border border-border hover:border-emerald-400/80 hover:shadow-[0_8px_20px_rgba(35,183,80,0.08)] hover:-translate-y-0.5 p-2.5 shadow-soft transition-all duration-200 cursor-pointer group relative flex flex-col gap-1.5 flex-shrink-0"
                      >
                        <!-- Card top line: Title, hot tag, menu -->
                        <div class="flex items-center justify-between gap-1.5 w-full min-w-0">
                          <div class="flex items-center gap-1.5 flex-1 min-w-0">
                            <h3 class="font-bold text-xs text-foreground group-hover:text-[#23B750] transition-colors leading-tight truncate flex-1 min-w-0" :title="deal.title">
                              {{ deal.title }}
                            </h3>
                          </div>
                          <div class="flex items-center gap-1 shrink-0">
                            <div
                              v-if="deal.hotLead"
                              class="flex items-center gap-0.5 text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1 py-0.2 rounded text-[8px] font-bold font-mono"
                            >
                              <Flame class="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                              <span>{{ deal.hotLead }}</span>
                            </div>
                          </div>
                        </div>

                        <!-- Client Name (not Sales Agent name) -->
                        <div class="text-[10px] text-muted-foreground font-semibold -mt-1 truncate w-full">
                          {{ deal.clientName }}
                        </div>

                        <!-- Value Badge & Subtitle -->
                        <div class="flex items-center gap-1.5 flex-wrap w-full min-w-0">
                          <span class="border border-border bg-card text-foreground text-[10px] font-bold px-1.5 py-0.5 rounded shadow-2xs leading-none shrink-0 font-mono">
                            RM {{ deal.value.toLocaleString() }}
                          </span>
                          <span class="text-[10px] text-muted-foreground/40 font-semibold shrink-0">•</span>
                          <span class="text-[10px] text-muted-foreground truncate flex-1 min-w-0 leading-none">{{ deal.description }}</span>
                        </div>

                        <div class="border-t border-border/60 my-0.5 w-full"></div>
                        
                        <div class="flex items-center justify-between w-full min-w-0 pt-0.5">
                          <!-- Assignee Avatar -->
                          <div class="flex items-center gap-1">
                            <div class="w-5 h-5 rounded-full overflow-hidden border border-border bg-muted flex items-center justify-center shrink-0">
                              <img :src="deal.avatar" class="w-full h-full object-cover" alt="owner" />
                            </div>
                            <span class="text-[9px] text-muted-foreground font-medium truncate max-w-[65px]">{{ deal.owner.split(' ')[0] }}</span>
                          </div>

                          <!-- Icons container + Stage controls -->
                          <div class="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground shrink-0">
                            <div class="flex items-center gap-0.5" title="Attachments">
                              <Paperclip class="w-3 h-3" />
                              <span class="font-mono text-[9px]">{{ deal.attachments }}</span>
                            </div>
                            <div class="flex items-center gap-0.5" title="Comments">
                              <MessageSquare class="w-3 h-3" />
                              <span class="font-mono text-[9px]">{{ deal.comments }}</span>
                            </div>
                            <div class="flex items-center gap-0.5" title="Days in pipeline">
                              <Clock class="w-3 h-3" />
                              <span class="font-mono text-[9px]">{{ deal.age }}</span>
                            </div>

                            <!-- Move Stage Controls -->
                            <div class="flex items-center gap-0.5 ml-1">
                              <button 
                                v-if="deal.stage !== 'New'"
                                @click.stop="moveKanbanDeal(deal.id, 'prev')" 
                                title="Move to previous stage"
                                class="p-0.5 rounded bg-muted hover:bg-muted-foreground/20 text-foreground text-[9px] transition-colors cursor-pointer"
                              >
                                ←
                              </button>
                              <button 
                                v-if="deal.stage !== 'Follow Up'"
                                @click.stop="moveKanbanDeal(deal.id, 'next')" 
                                title="Advance to next stage"
                                class="p-0.5 rounded bg-[#23B750] text-white hover:bg-[#1fa346] text-[9px] font-bold transition-colors cursor-pointer"
                              >
                                →
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Empty column indicator -->
                      <div
                        v-if="getStageDeals(stage).length === 0"
                        class="border-2 border-dashed border-border/60 rounded-xl p-6 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-1.5 h-32 w-full"
                      >
                        <FolderKanban class="w-6 h-6 text-muted-foreground/40" />
                        <span class="text-[10px] font-semibold">No deals in stage</span>
                      </div>
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>

            <!-- Category 9: Omnichannel Communications & WhatsApp Chat Simulator -->
            <Card id="sec-omnichannel" class="scroll-mt-24 border-border/70 hover:border-border transition-all duration-300 overflow-hidden bg-card/95 backdrop-blur-sm">
              <CardHeader :class="[densityClasses.cardHeader, 'border-b border-border/60 bg-muted/40 py-4.5 px-6 flex flex-row items-center justify-between gap-4']">
                <div class="space-y-1">
                  <div class="flex items-center gap-2 text-foreground">
                    <Icon icon="simple-icons:whatsapp" class="w-4.5 h-4.5 text-[#23B750] stroke-[2.25]" />
                    <CardTitle class="text-base font-semibold tracking-tight">9. Omnichannel Communications & WhatsApp Chat Simulator</CardTitle>
                  </div>
                  <CardDescription class="text-xs text-muted-foreground">Synchronized 1:1 with Omnichannel View (Multi-conversation inbox, authentic green outgoing bubbles, quoted reply cards, and rich composer toolbar).</CardDescription>
                </div>
                <div class="flex items-center gap-2">
                  <Badge variant="outline" class="font-mono text-[10px] bg-green-500/10 text-[#23B750] border-[#23B750]/30">
                    WhatsApp Business Channel
                  </Badge>
                </div>
              </CardHeader>
              <CardContent :class="[densityClasses.cardContent, 'p-4 lg:p-6 dark:text-slate-200']">
                
                <!-- Full 3-Panel Omnichannel Workspace (Matching OmnichannelView.vue) -->
                <div class="grid grid-cols-1 xl:grid-cols-12 gap-0 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm bg-white dark:bg-slate-900 min-h-[620px]">
                  
                  <!-- PANEL 1: Conversation List (xl:col-span-4) -->
                  <div class="xl:col-span-4 border-r border-gray-200 dark:border-slate-800 bg-[#F9FAFB] dark:bg-slate-950 flex flex-col min-h-0">
                    
                    <!-- Inbox Search & Filter Header -->
                    <div class="p-3 border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2 select-none">
                      <div class="flex items-center justify-between">
                        <span class="text-xs font-bold text-gray-800 dark:text-slate-200">Conversations</span>
                        <span class="text-[10px] font-mono font-bold text-gray-400 bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                          {{ filteredOmnichannelConversations.length }} active
                        </span>
                      </div>
                      
                      <div class="relative">
                        <Search class="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <Input 
                          v-model="omnichannelSearch"
                          placeholder="Search WhatsApp contacts..." 
                          class="pl-8 pr-3 h-8 text-xs bg-gray-50 dark:bg-slate-950 border-gray-200 dark:border-slate-800 rounded-lg focus-visible:ring-[#23B750]"
                        />
                      </div>

                      <!-- Filter Pills -->
                      <div class="flex items-center gap-1 pt-0.5">
                        <button
                          type="button"
                          @click="omnichannelFilter = 'all'"
                          class="px-2.5 py-1 rounded-md text-[10px] font-bold transition-colors cursor-pointer"
                          :class="omnichannelFilter === 'all' ? 'bg-[#23B750] text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'"
                        >
                          All
                        </button>
                        <button
                          type="button"
                          @click="omnichannelFilter = 'late'"
                          class="px-2.5 py-1 rounded-md text-[10px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                          :class="omnichannelFilter === 'late' ? 'bg-destructive text-destructive-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'"
                        >
                          <span class="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                          Late SLA
                        </button>
                        <button
                          type="button"
                          @click="omnichannelFilter = 'unread'"
                          class="px-2.5 py-1 rounded-md text-[10px] font-bold transition-colors cursor-pointer"
                          :class="omnichannelFilter === 'unread' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'"
                        >
                          Unread
                        </button>
                      </div>
                    </div>

                    <!-- Conversation Items List -->
                    <div class="flex-1 overflow-y-auto divide-y divide-gray-150 dark:divide-slate-800/80">
                      <div 
                        v-for="conv in filteredOmnichannelConversations" 
                        :key="conv.id"
                        @click="activeOmnichannelConvId = conv.id"
                        class="p-3 transition-colors cursor-pointer relative select-none flex items-start gap-3"
                        :class="[
                          activeOmnichannelConvId === conv.id 
                            ? 'bg-white dark:bg-slate-900 ring-1 ring-[#23B750]/40 shadow-2xs' 
                            : 'hover:bg-gray-100/70 dark:hover:bg-slate-900/50'
                        ]"
                      >
                        <!-- Avatar with platform icon badge -->
                        <div class="relative shrink-0 mt-0.5">
                          <img :src="conv.avatar" class="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-slate-700" :alt="conv.sender" />
                          <span class="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 flex items-center justify-center">
                            <Icon icon="simple-icons:whatsapp" class="size-2.5 text-[#25D366]" />
                          </span>
                        </div>

                        <!-- Info & Snippet -->
                        <div class="flex-1 min-w-0">
                          <div class="flex items-center justify-between gap-1 mb-0.5">
                            <div class="flex items-center gap-1.5 min-w-0">
                              <span class="font-bold text-xs text-gray-900 dark:text-white truncate">{{ conv.sender }}</span>
                              <span v-if="conv.isVip" class="inline-flex items-center gap-0.5 px-1 py-0.2 rounded-full text-[8px] font-extrabold bg-purple-50 dark:bg-purple-950/50 text-[#9F5CF8] border border-purple-200 dark:border-purple-800 shrink-0">
                                <Crown class="w-2.5 h-2.5" />
                                <span>VIP</span>
                              </span>
                              <span v-if="conv.isLate" class="inline-flex items-center gap-0.5 px-1 py-0.2 rounded-full text-[8px] font-bold bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 shrink-0">
                                <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                                <span>Late</span>
                              </span>
                            </div>
                            <span class="text-[10px] font-mono text-gray-400 shrink-0">{{ conv.time }}</span>
                          </div>

                          <p class="text-[11px] text-gray-500 dark:text-slate-400 truncate leading-snug font-medium">
                            {{ conv.lastMessage }}
                          </p>

                          <div class="flex items-center justify-between mt-1.5 text-[10px] text-gray-400">
                            <span class="truncate text-gray-400 font-semibold">{{ conv.company }}</span>
                            <span v-if="conv.unreadCount > 0" class="min-w-[18px] h-4.5 px-1 rounded-full bg-[#EF4444] text-white text-[9px] font-extrabold flex items-center justify-center font-mono shrink-0">
                              {{ conv.unreadCount }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                  <!-- PANEL 2: Active Live Chat Window (xl:col-span-5) -->
                  <div class="xl:col-span-5 bg-gray-50 dark:bg-slate-950 flex flex-col min-h-0 border-r border-gray-200 dark:border-slate-800">
                    
                    <!-- Middle Header Bar -->
                    <div class="min-h-14 px-4 py-2.5 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between select-none">
                      <div class="flex items-center gap-2.5 min-w-0">
                        <div class="relative shrink-0">
                          <img :src="activeOmnichannelConv.avatar" class="w-9 h-9 rounded-full object-cover border border-gray-200 dark:border-slate-700" :alt="activeOmnichannelConv.sender" />
                          <span class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900 bg-[#23B750] animate-pulse-glow" title="Active now"></span>
                        </div>
                        <div class="min-w-0 flex flex-col justify-center">
                          <div class="flex items-center gap-1.5">
                            <h3 class="font-bold text-gray-900 dark:text-white text-xs leading-tight truncate">
                              {{ activeOmnichannelConv.sender }}
                            </h3>
                            <span v-if="activeOmnichannelConv.isVip" class="inline-flex items-center gap-0.5 px-1 py-0.2 rounded-full text-[8px] font-extrabold bg-purple-50 dark:bg-purple-950/50 text-[#9F5CF8] border border-purple-200 dark:border-purple-800 shrink-0">
                              <Crown class="w-2.5 h-2.5" />
                              <span>VIP</span>
                            </span>
                            <span v-if="activeOmnichannelConv.isLate" class="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[8px] font-bold bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 shrink-0">
                              <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                              <span>Late</span>
                            </span>
                          </div>
                          <div class="flex items-center gap-1 text-[10px] text-gray-500 dark:text-slate-400 font-medium">
                            <span class="bg-gray-100 dark:bg-slate-800 px-1 py-0.2 rounded text-emerald-600 flex items-center justify-center">
                              <Icon icon="simple-icons:whatsapp" class="size-2.5 text-[#25D366]" />
                            </span>
                            <span>•</span>
                            <span class="font-semibold text-gray-700 dark:text-slate-300">Assigned to {{ activeOmnichannelConv.assignedTo }}</span>
                          </div>
                        </div>
                      </div>

                      <div class="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          @click="toast.success(`Conversation with ${activeOmnichannelConv.sender} marked as resolved!`)"
                          class="inline-flex items-center justify-center gap-1 px-3 h-7.5 rounded-lg bg-[#23B750] hover:bg-[#1fa346] text-white text-[11px] font-bold shadow-2xs cursor-pointer active:scale-95 transition-all"
                        >
                          <Check class="w-3.5 h-3.5 stroke-[3]" />
                          <span>Resolve</span>
                        </button>
                        <Badge variant="outline" class="text-[10px] font-bold text-gray-600 dark:text-slate-300 border-gray-300 dark:border-slate-700">
                          Active
                        </Badge>
                      </div>
                    </div>

                    <!-- SLA Human Response Alert Banner -->
                    <div v-if="isHumanResponseBannerOpen" class="bg-green-50/80 dark:bg-green-950/30 border-b border-green-200 dark:border-green-800/50 px-4 py-1.5 flex items-center justify-between text-[11px] font-semibold text-green-800 dark:text-green-300 select-none">
                      <div class="flex items-center gap-1.5">
                        <Sparkles class="w-3.5 h-3.5 text-[#23B750]" />
                        <span>Chat ready for human response</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <button @click="toast.info('Reassign modal opened')" class="text-green-700 dark:text-green-400 font-extrabold hover:underline cursor-pointer">Reassign</button>
                        <span class="text-green-300 dark:text-green-700">|</span>
                        <button @click="isHumanResponseBannerOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer">Dismiss</button>
                      </div>
                    </div>

                    <!-- Message Feed (Canonical Omnichannel Styling) -->
                    <div class="flex-1 p-4 space-y-3 overflow-y-auto bg-gray-50 dark:bg-slate-950 min-h-[260px] max-h-[360px]">
                      <div 
                        v-for="msg in currentChatMessages" 
                        :key="msg.id"
                        class="w-full flex flex-col"
                      >
                        <!-- 1. System Audit Log -->
                        <div v-if="msg.type === 'system-log'" class="my-1.5 mx-auto max-w-sm px-3 py-1 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800/60 rounded-full text-center text-[10px] text-green-700 dark:text-green-300 font-bold flex items-center justify-center gap-1.5 shadow-2xs select-none">
                          <CheckCircle2 class="size-3 text-[#23B750]" />
                          <span>{{ msg.text }}</span>
                        </div>

                        <!-- 2. Private Note Yellow Card -->
                        <div v-else-if="msg.type === 'private-note'" class="my-1.5 mx-auto w-full max-w-[92%] p-3 bg-[#FEF9C3]/80 dark:bg-amber-950/30 border border-[#FEF08A] dark:border-amber-800/50 rounded-2xl flex flex-col gap-1 text-[#854D0E] dark:text-amber-300 shadow-2xs">
                          <div class="flex items-center justify-between text-[10px] font-extrabold border-b border-[#FEF08A] dark:border-amber-800/50 pb-1">
                            <span class="bg-[#FEF08A] dark:bg-amber-900/50 px-2 py-0.5 rounded-full uppercase tracking-wider text-[9px]">Private Note</span>
                            <span class="font-mono text-gray-500">{{ msg.time }}</span>
                          </div>
                          <p class="text-xs font-medium leading-relaxed mt-0.5">{{ msg.text }}</p>
                        </div>

                        <!-- 3. Standard Chat Message Bubble -->
                        <div 
                          v-else
                          class="flex flex-col gap-1 w-full max-w-[84%] transition-all duration-200"
                          :class="[msg.isSelf ? 'self-end items-end' : 'self-start items-start']"
                        >
                          <!-- Sender & Time header -->
                          <div class="flex items-center gap-1.5 px-1 select-none text-[10px] text-gray-400 font-bold">
                            <span v-if="!msg.isSelf" class="text-gray-600 dark:text-slate-300 font-bold">{{ msg.sender }}</span>
                            <span>{{ msg.time }}</span>
                          </div>

                          <!-- Bubble Content: SOLID GREEN FOR OUTGOING, WHITE FOR INCOMING -->
                          <div 
                            class="p-3.5 rounded-2xl text-xs leading-relaxed shadow-none select-text max-w-full"
                            :class="[
                              msg.isSelf 
                                ? 'bg-[#23B750] text-white border border-transparent rounded-tr-sm rounded-bl-2xl rounded-br-2xl' 
                                : 'bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-100 border border-gray-200 dark:border-slate-800 rounded-tl-sm rounded-bl-2xl rounded-br-2xl'
                            ]"
                          >
                            <!-- WhatsApp Quoted Reply Box -->
                            <div 
                              v-if="msg.quote"
                              class="mb-2 p-2 rounded-lg text-left select-none overflow-hidden flex gap-2 items-stretch"
                              :class="[
                                msg.isSelf 
                                  ? 'bg-black/20 text-white' 
                                  : 'bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-200'
                              ]"
                            >
                              <span 
                                class="w-1 rounded-full shrink-0" 
                                :class="[msg.isSelf ? 'bg-white' : 'bg-[#23B750]']"
                              ></span>
                              <div class="flex-1 min-w-0 flex flex-col justify-center">
                                <div class="text-[10px] font-bold leading-tight truncate" :class="[msg.isSelf ? 'text-white' : 'text-[#23B750]']">
                                  {{ msg.quote.sender }}
                                </div>
                                <div class="text-[10px] leading-tight line-clamp-1 opacity-90">
                                  {{ msg.quote.text }}
                                </div>
                              </div>
                            </div>

                            <!-- PDF Attachment Card -->
                            <div v-if="msg.attachment" class="flex items-center gap-2 p-2 rounded-xl border mb-1.5" :class="[msg.isSelf ? 'bg-black/15 border-white/20 text-white' : 'bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700']">
                              <div class="p-1.5 bg-red-500/20 text-red-500 rounded-lg">
                                <FileText class="size-4" />
                              </div>
                              <div class="min-w-0 flex-1">
                                <div class="font-bold text-[11px] truncate">{{ msg.attachment.name }}</div>
                                <div class="text-[9px] opacity-80 font-mono">{{ msg.attachment.size }} • {{ msg.attachment.type }}</div>
                              </div>
                              <Download class="size-3.5 shrink-0 cursor-pointer hover:opacity-80" @click="toast.success('Downloaded ' + msg.attachment.name)" />
                            </div>

                            <div>{{ msg.text }}</div>
                          </div>

                          <!-- Read Receipts Double Blue Checkmarks -->
                          <div v-if="msg.isSelf" class="flex items-center gap-1 select-none text-[10px] font-bold text-gray-400 mt-0.5">
                            <span class="text-[#23B750] flex items-center leading-none">
                              <svg class="w-3.5 h-3.5 stroke-current stroke-[2.5]" fill="none" viewBox="0 0 24 24">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </span>
                          </div>
                        </div>

                      </div>

                      <!-- Bot Typing Indicator -->
                      <div v-if="isBotTyping" class="flex items-center gap-1.5 p-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl rounded-tl-xs w-24 text-gray-500 animate-pulse shadow-2xs">
                        <span class="size-1.5 rounded-full bg-[#23B750] animate-ping"></span>
                        <span class="text-[10px] font-mono">Typing...</span>
                      </div>
                    </div>

                    <!-- AI Suggested Templates -->
                    <div class="p-2 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 flex flex-wrap gap-1.5 items-center select-none">
                      <span class="text-[9px] font-bold text-[#23B750] uppercase font-mono px-1 flex items-center gap-1">
                        <Sparkles class="size-3" /> Quick:
                      </span>
                      <button 
                        type="button"
                        @click="sendChatMessage('Hi Mel! Just following up regarding the scope of the responsive redesign. Let us know if you need any adjustments.')" 
                        class="px-2.5 py-0.8 rounded-md bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 text-[10px] font-semibold transition-colors cursor-pointer border border-gray-200 dark:border-slate-700 flex items-center gap-1"
                      >
                        <span>💬 Follow Up</span>
                      </button>
                      <button 
                        type="button"
                        @click="sendChatMessage('Here is the official quotation and pricing schedule for KK Steel.')" 
                        class="px-2.5 py-0.8 rounded-md bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 text-[10px] font-semibold transition-colors cursor-pointer border border-gray-200 dark:border-slate-700 flex items-center gap-1"
                      >
                        <span>📄 Send Quote</span>
                      </button>
                      <button 
                        type="button"
                        @click="sendChatMessage('Can we book a 15-minute quick walkthrough demo for tomorrow at 3 PM?')" 
                        class="px-2.5 py-0.8 rounded-md bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 text-[10px] font-semibold transition-colors cursor-pointer border border-gray-200 dark:border-slate-700 flex items-center gap-1"
                      >
                        <span>📅 Book Demo</span>
                      </button>
                    </div>

                    <!-- Composer Form (Reply Mode & Private Note Mode) -->
                    <div class="p-3 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 flex flex-col gap-2">
                      
                      <!-- Composer Mode Tabs -->
                      <div class="flex items-center justify-between border-b border-gray-150 dark:border-slate-800 pb-1">
                        <div class="flex gap-2">
                          <button 
                            type="button"
                            @click="omnichannelComposerMode = 'reply'"
                            class="text-xs font-bold transition-all border-b-2 outline-none pb-1 flex items-center gap-1 cursor-pointer"
                            :class="omnichannelComposerMode === 'reply' ? 'border-[#23B750] text-[#23B750] font-extrabold' : 'border-transparent text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'"
                          >
                            Reply
                          </button>
                          <button 
                            type="button"
                            @click="omnichannelComposerMode = 'note'"
                            class="text-xs font-bold transition-all border-b-2 outline-none pb-1 flex items-center gap-1 cursor-pointer"
                            :class="omnichannelComposerMode === 'note' ? 'border-amber-500 text-amber-600 font-extrabold' : 'border-transparent text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'"
                          >
                            Private Note
                          </button>
                        </div>

                        <div class="flex items-center gap-1.5 text-[10px] font-extrabold text-gray-400 uppercase select-none">
                          <span>AI Auto-Reply</span>
                          <button 
                            type="button"
                            @click="isAiAutoReplyOn = !isAiAutoReplyOn"
                            class="w-7 h-3.5 rounded-full relative transition-colors focus:outline-none cursor-pointer"
                            :class="isAiAutoReplyOn ? 'bg-[#23B750]' : 'bg-gray-200 dark:bg-slate-700'"
                          >
                            <span class="w-3 h-3 bg-white rounded-full absolute top-[1px] transition-all" :class="isAiAutoReplyOn ? 'left-[15px]' : 'left-[1px]'"></span>
                          </button>
                        </div>
                      </div>

                      <!-- Textarea input container -->
                      <div 
                        class="rounded-xl border p-2 flex flex-col gap-1.5 transition-colors"
                        :class="[
                          omnichannelComposerMode === 'note' 
                            ? 'bg-[#FEF9C3]/20 border-[#FEF08A] dark:border-amber-800/40' 
                            : 'bg-gray-50 dark:bg-slate-950 border-gray-200 dark:border-slate-800'
                        ]"
                      >
                        <textarea
                          v-model="chatComposerText"
                          @keydown.enter.exact.prevent="sendChatMessage()"
                          :placeholder="omnichannelComposerMode === 'note' ? 'Write an internal private note for your team...' : `Message ${activeOmnichannelConv.sender}... (Press Enter to send)`"
                          rows="2"
                          class="w-full text-xs bg-transparent border-0 focus:outline-none resize-none font-medium placeholder:text-gray-400 text-foreground"
                        ></textarea>

                        <!-- Action Toolbar -->
                        <div class="flex items-center justify-between pt-1 border-t border-gray-200/50 dark:border-slate-800/80">
                          <div class="flex items-center gap-1">
                            <button @click="toast.info('Emoji picker opened')" class="p-1 hover:bg-gray-200 dark:hover:bg-slate-800 rounded text-gray-400 hover:text-gray-600 transition-colors" title="Insert Emoji">
                              <Smile class="w-4 h-4" />
                            </button>
                            <button @click="toast.info('File attachment dialog opened')" class="p-1 hover:bg-gray-200 dark:hover:bg-slate-800 rounded text-gray-400 hover:text-gray-600 transition-colors" title="Attach Document">
                              <Paperclip class="w-4 h-4" />
                            </button>
                            <button @click="toast.info('Formatting toolbar toggled')" class="p-1 hover:bg-gray-200 dark:hover:bg-slate-800 rounded text-gray-400 hover:text-gray-600 transition-colors" title="Text Formatting">
                              <Type class="w-4 h-4" />
                            </button>
                            <button @click="chatComposerText = 'Hi Mel! Thank you for getting in touch. I am happy to assist you with your quotation.'" class="p-1 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded text-blue-600 transition-colors" title="AI Draft Assistant">
                              <Sparkles class="w-4 h-4" />
                            </button>
                          </div>

                          <Button 
                            size="xs" 
                            @click="sendChatMessage()" 
                            class="h-7.5 px-3 font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                            :class="omnichannelComposerMode === 'note' ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-[#23B750] hover:bg-[#1fa346] text-white'"
                          >
                            <span>{{ omnichannelComposerMode === 'note' ? '+ Add Note' : 'Send' }}</span>
                            <Send class="size-3" />
                          </Button>
                        </div>
                      </div>

                    </div>

                  </div>

                  <!-- PANEL 3: Contextual Contact Drawer (xl:col-span-3) -->
                  <div class="xl:col-span-3 bg-white dark:bg-slate-900 p-4 flex flex-col gap-4 text-xs select-none">
                    
                    <div class="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-slate-800">
                      <span class="font-bold text-gray-900 dark:text-white">Contact Profile</span>
                      <Badge variant="outline" class="font-mono text-[9px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                        Active Lead
                      </Badge>
                    </div>

                    <!-- Contact Details -->
                    <div class="space-y-2.5 text-[11px]">
                      <div class="flex justify-between py-1 border-b border-gray-100 dark:border-slate-800/60">
                        <span class="text-gray-400 font-medium">Contact:</span>
                        <strong class="text-gray-900 dark:text-white">{{ activeOmnichannelConv.sender }}</strong>
                      </div>
                      <div class="flex justify-between py-1 border-b border-gray-100 dark:border-slate-800/60">
                        <span class="text-gray-400 font-medium">Company:</span>
                        <strong class="text-gray-900 dark:text-white">{{ activeOmnichannelConv.company }}</strong>
                      </div>
                      <div class="flex justify-between py-1 border-b border-gray-100 dark:border-slate-800/60">
                        <span class="text-gray-400 font-medium">Phone:</span>
                        <span class="font-mono text-gray-700 dark:text-slate-300 font-semibold">{{ activeOmnichannelConv.phone }}</span>
                      </div>
                      <div class="flex justify-between py-1 border-b border-gray-100 dark:border-slate-800/60">
                        <span class="text-gray-400 font-medium">Email:</span>
                        <span class="font-mono text-gray-700 dark:text-slate-300 truncate max-w-[140px]">{{ activeOmnichannelConv.email }}</span>
                      </div>
                      <div class="flex justify-between py-1 border-b border-gray-100 dark:border-slate-800/60">
                        <span class="text-gray-400 font-medium">Pipeline Value:</span>
                        <strong class="text-[#23B750] font-mono font-bold">{{ activeOmnichannelConv.dealValue }}</strong>
                      </div>
                      <div class="flex justify-between py-1 border-b border-gray-100 dark:border-slate-800/60">
                        <span class="text-gray-400 font-medium">Lead Stage:</span>
                        <span class="font-bold text-[#FFCC00]">{{ activeOmnichannelConv.stage }}</span>
                      </div>
                      <div class="flex justify-between py-1 border-b border-gray-100 dark:border-slate-800/60">
                        <span class="text-gray-400 font-medium">Assigned Rep:</span>
                        <span class="font-semibold text-gray-800 dark:text-slate-200">{{ activeOmnichannelConv.assignedTo }}</span>
                      </div>
                    </div>

                    <!-- Associated Tags -->
                    <div class="space-y-1.5">
                      <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Associated Tags</span>
                      <div class="flex flex-wrap gap-1">
                        <span 
                          v-for="tag in activeOmnichannelConv.tags" 
                          :key="tag" 
                          class="px-2 py-0.5 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 text-[10px] font-bold rounded-md border border-gray-200 dark:border-slate-700"
                        >
                          {{ tag }}
                        </span>
                      </div>
                    </div>

                    <!-- CRM Actions -->
                    <div class="pt-2 space-y-2 mt-auto">
                      <Button 
                        size="sm" 
                        class="w-full text-xs font-bold rounded-xl h-8.5 bg-[#23B750] hover:bg-[#1fa346] text-white cursor-pointer" 
                        @click="toast.success(`Generated official quotation PDF for ${activeOmnichannelConv.company}!`)"
                      >
                        Generate Quotation PDF
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        class="w-full text-xs font-semibold rounded-xl h-8.5 bg-card border-border text-foreground cursor-pointer" 
                        @click="toast.info(`Viewing full contact profile for ${activeOmnichannelConv.sender}...`)"
                      >
                        Open Full Contact Drawer
                      </Button>
                    </div>

                  </div>

                </div>

              </CardContent>
            </Card>

          </div>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════════════════
           TAB 3: SYSTEM GUIDELINES & PROMPT (MARKDOWN)
      ════════════════════════════════════════════════════════════════ -->
      <div v-if="activeTab === 'guidelines'" class="space-y-8 animate-in fade-in duration-300">
        
        <!-- Guidelines Hero Header -->
        <div class="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-zinc-950 text-white p-7 rounded-3xl border border-slate-800 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 shadow-xl">
          <!-- Backdrop pulse blur -->
          <div class="absolute -right-16 -top-16 w-56 h-56 bg-primary/15 rounded-full blur-3xl animate-pulse"></div>
          <div class="absolute -left-16 -bottom-16 w-56 h-56 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>

          <div class="space-y-2 relative z-10 max-w-2xl">
            <div class="flex flex-wrap items-center gap-2.5">
              <span class="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wider bg-emerald-500/15 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/25 uppercase">
                <span class="size-2 bg-emerald-500 rounded-full animate-ping"></span>
                CANONICAL SPECIFICATION
              </span>
              <span class="text-[10px] font-bold text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700 uppercase tracking-wider">
                Nova v4.0 System Prompt
              </span>
              <span class="text-[10px] font-mono text-emerald-300 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/50">
                100% LLM-Ready
              </span>
            </div>
            <h2 class="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              RakanSales System Guidelines & Prompt
            </h2>
            <p class="text-xs text-slate-400 leading-relaxed">
              Use these guidelines as the authoritative reference for drafting new CRM views or copy the full Markdown prompt to bootstrap UI in other projects and LLMs.
            </p>
          </div>

          <!-- Actions Toolbar -->
          <div class="flex flex-wrap items-center gap-3 relative z-10 self-stretch sm:self-auto">
            <!-- Copy Full Markdown -->
            <Button 
              @click="copyFullMarkdown" 
              variant="primary" 
              class="font-semibold text-xs px-4 py-2.5 bg-primary hover:bg-primary-dark text-white border-transparent cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 shadow-lg"
            >
              <component :is="isCopiedFullMarkdown ? CheckCheck : Copy" class="w-4 h-4" />
              <span>{{ isCopiedFullMarkdown ? 'Prompt Copied!' : 'Copy Full Markdown' }}</span>
            </Button>

            <!-- Download .md -->
            <button 
              @click="downloadMarkdownFile" 
              class="inline-flex items-center gap-2 px-3.5 py-2.5 bg-slate-800/80 hover:bg-slate-700 active:bg-slate-800 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-all duration-150 cursor-pointer"
              title="Download Markdown Prompt (.md)"
            >
              <Download class="w-4 h-4 text-slate-400" />
              <span>Export .md</span>
            </button>

            <!-- Toggle Rendered / Raw -->
            <div class="flex items-center bg-slate-900/90 border border-slate-800 rounded-xl p-1">
              <button 
                @click="guidelinesViewMode = 'rendered'"
                :class="[
                  'px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5',
                  guidelinesViewMode === 'rendered' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'
                ]"
              >
                <BookOpen class="w-3.5 h-3.5" />
                <span>Visual</span>
              </button>
              <button 
                @click="guidelinesViewMode = 'raw'"
                :class="[
                  'px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5',
                  guidelinesViewMode === 'raw' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'
                ]"
              >
                <FileCode class="w-3.5 h-3.5" />
                <span>Raw Markdown</span>
              </button>
            </div>
          </div>
        </div>

        <!-- ═════════════════════════════════════════════════════════════
             VIEW MODE 1: VISUAL RENDERED SYSTEM GUIDELINES
        ═══════════════════════════════════════════════════════════════ -->
        <div v-if="guidelinesViewMode === 'rendered'" class="space-y-8 animate-in fade-in duration-200">
          
          <!-- Key System Badges Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-white dark:bg-card p-4.5 rounded-2xl border border-border shadow-sm flex items-start gap-3.5">
              <div class="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                <Palette class="w-5 h-5" />
              </div>
              <div>
                <h4 class="font-bold text-xs text-foreground">Hybrid Green Hierarchy</h4>
                <p class="text-[11px] text-muted-foreground mt-0.5 leading-normal">Deep Base (#008236) for 4.5:1+ contrast + #23B750 accent highlights.</p>
              </div>
            </div>

            <div class="bg-white dark:bg-card p-4.5 rounded-2xl border border-border shadow-sm flex items-start gap-3.5">
              <div class="p-2.5 bg-primary/10 rounded-xl text-primary flex-shrink-0">
                <Layers class="w-5 h-5" />
              </div>
              <div>
                <h4 class="font-bold text-xs text-foreground">Dual-Rail Layout</h4>
                <p class="text-[11px] text-muted-foreground mt-0.5 leading-normal">Dark collapsible outer rail (w-16/w-56) + dismissible light sub-panel (w-60).</p>
              </div>
            </div>

            <div class="bg-white dark:bg-card p-4.5 rounded-2xl border border-border shadow-sm flex items-start gap-3.5">
              <div class="p-2.5 bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400 flex-shrink-0">
                <Type class="w-5 h-5" />
              </div>
              <div>
                <h4 class="font-bold text-xs text-foreground">Inter Variable + Monospace</h4>
                <p class="text-[11px] text-muted-foreground mt-0.5 leading-normal">Clean sans hierarchy with tabular numbers for timestamps and revenue.</p>
              </div>
            </div>

            <div class="bg-white dark:bg-card p-4.5 rounded-2xl border border-border shadow-sm flex items-start gap-3.5">
              <div class="p-2.5 bg-amber-500/10 rounded-xl text-amber-600 dark:text-amber-400 flex-shrink-0">
                <Activity class="w-5 h-5" />
              </div>
              <div>
                <h4 class="font-bold text-xs text-foreground">Diffused Soft Shadows</h4>
                <p class="text-[11px] text-muted-foreground mt-0.5 leading-normal">Large blur, low opacity modern shadows with instant flat mode toggle.</p>
              </div>
            </div>
          </div>

          <!-- Section 1: Color System & Tokens -->
          <Card class="border-border shadow-sm overflow-hidden bg-card">
            <CardHeader class="border-b border-border/60 bg-muted/30 py-4 px-6 flex flex-row items-center justify-between">
              <div>
                <CardTitle class="text-base font-bold flex items-center gap-2">
                  <Palette class="w-4.5 h-4.5 text-primary" />
                  1. Brand Palette & Color Token Specifications
                </CardTitle>
                <CardDescription class="text-xs text-muted-foreground">Standardized color tokens ensuring WCAG AA/AAA compliance across CRM controls.</CardDescription>
              </div>
              <button 
                @click="copyCodeSnippet(`--primary: oklch(0.527 0.154 150.069); /* #008236 */\n--rks-green: #23B750;\n--rks-lime: #62D816;\n--rks-gray-900: #111827;\n--border: oklch(0.922 0 0); /* #E9E9E9 */`)"
                class="px-2.5 py-1 bg-secondary text-secondary-foreground hover:bg-muted rounded-lg text-xs font-semibold border border-border flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Copy class="w-3.5 h-3.5 text-primary" />
                Copy Tokens
              </button>
            </CardHeader>
            <CardContent class="p-6 space-y-4">
              <div class="overflow-x-auto">
                <table class="w-full text-left text-xs">
                  <thead class="bg-muted/60 text-muted-foreground font-bold text-[10px] uppercase tracking-wider">
                    <tr>
                      <th class="p-3 pl-4 rounded-l-xl">Color Role</th>
                      <th class="p-3">Token Variable</th>
                      <th class="p-3">Hex / OKLCH</th>
                      <th class="p-3">Contrast Ratio</th>
                      <th class="p-3 pr-4 rounded-r-xl">Functional Application</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-border/60">
                    <tr class="hover:bg-muted/30 transition-colors">
                      <td class="p-3 pl-4 font-bold flex items-center gap-2">
                        <span class="size-3.5 rounded-full bg-[#008236] shadow-sm"></span>
                        Base Primary Green
                      </td>
                      <td class="p-3 font-mono text-[11px] text-primary font-bold">--primary</td>
                      <td class="p-3 font-mono text-[11px]">#008236 / oklch(0.527...)</td>
                      <td class="p-3"><span class="px-2 py-0.5 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 font-bold rounded-full border border-emerald-200 dark:border-emerald-800 text-[10px]">Pass (4.8:1 - WCAG AA)</span></td>
                      <td class="p-3 text-muted-foreground">Solid primary action buttons, active navigation states, filled badges.</td>
                    </tr>
                    <tr class="hover:bg-muted/30 transition-colors">
                      <td class="p-3 pl-4 font-bold flex items-center gap-2">
                        <span class="size-3.5 rounded-full bg-[#23B750] shadow-sm"></span>
                        Brand Accent Green
                      </td>
                      <td class="p-3 font-mono text-[11px] text-emerald-600 font-bold">--rks-green</td>
                      <td class="p-3 font-mono text-[11px]">#23B750</td>
                      <td class="p-3"><span class="px-2 py-0.5 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 font-bold rounded-full border border-emerald-200 dark:border-emerald-800 text-[10px]">Pass (6.5:1 Dark)</span></td>
                      <td class="p-3 text-muted-foreground">Logomark highlights, active border lines, focus rings, status pings.</td>
                    </tr>
                    <tr class="hover:bg-muted/30 transition-colors">
                      <td class="p-3 pl-4 font-bold flex items-center gap-2">
                        <span class="size-3.5 rounded-full bg-[#62D816] shadow-sm"></span>
                        Secondary Lime
                      </td>
                      <td class="p-3 font-mono text-[11px] text-lime-600 font-bold">--rks-lime</td>
                      <td class="p-3 font-mono text-[11px]">#62D816</td>
                      <td class="p-3"><span class="px-2 py-0.5 bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 font-bold rounded-full border border-amber-200 dark:border-amber-800 text-[10px]">Gradient Endpoint</span></td>
                      <td class="p-3 text-muted-foreground">Used exclusively in gradient contexts (\`from-[#23B750] to-[#62D816]\`).</td>
                    </tr>
                    <tr class="hover:bg-muted/30 transition-colors">
                      <td class="p-3 pl-4 font-bold flex items-center gap-2">
                        <span class="size-3.5 rounded-full bg-[#111827] shadow-sm"></span>
                        Outer Rail Dark
                      </td>
                      <td class="p-3 font-mono text-[11px] text-gray-700 dark:text-gray-300 font-bold">--rks-gray-900</td>
                      <td class="p-3 font-mono text-[11px]">#111827</td>
                      <td class="p-3"><span class="px-2 py-0.5 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-bold rounded-full border border-slate-200 text-[10px]">High Contrast</span></td>
                      <td class="p-3 text-muted-foreground">Outer expandable navigation rail background in all views.</td>
                    </tr>
                    <tr class="hover:bg-muted/30 transition-colors">
                      <td class="p-3 pl-4 font-bold flex items-center gap-2">
                        <span class="size-3.5 rounded-full bg-[#EF4444] shadow-sm"></span>
                        Destructive / Danger
                      </td>
                      <td class="p-3 font-mono text-[11px] text-red-600 font-bold">--destructive</td>
                      <td class="p-3 font-mono text-[11px]">#EF4444</td>
                      <td class="p-3"><span class="px-2 py-0.5 bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 font-bold rounded-full border border-red-200 dark:border-red-800 text-[10px]">Pass (4.5:1)</span></td>
                      <td class="p-3 text-muted-foreground">Destructive actions, error alerts, unread badges, critical threshold meters.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <!-- Section 2: Layout & App Shell Blueprint -->
          <Card class="border-border shadow-sm overflow-hidden bg-card">
            <CardHeader class="border-b border-border/60 bg-muted/30 py-4 px-6">
              <CardTitle class="text-base font-bold flex items-center gap-2">
                <Layers class="w-4.5 h-4.5 text-primary" />
                2. App Shell & Dual-Rail Architecture Blueprint
              </CardTitle>
              <CardDescription class="text-xs text-muted-foreground">The master structural scaffolding powering all views across RakanSales CRM.</CardDescription>
            </CardHeader>
            <CardContent class="p-6 space-y-4">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                <div class="space-y-3">
                  <h4 class="font-bold text-xs text-foreground uppercase tracking-wider">Shell Layout Components</h4>
                  <div class="space-y-2.5 text-xs text-muted-foreground leading-relaxed">
                    <div class="p-3 rounded-xl border border-border bg-muted/30 space-y-1">
                      <div class="font-bold text-foreground flex items-center gap-2">
                        <span class="size-2 rounded-full bg-slate-900"></span>
                        1. Outer Rail (Expandable Dark Bar)
                      </div>
                      <p class="text-[11px]">Collapsible from w-56 to w-16. Houses primary CRM modules, theme toggle, and rail expander.</p>
                    </div>

                    <div class="p-3 rounded-xl border border-border bg-muted/30 space-y-1">
                      <div class="font-bold text-foreground flex items-center gap-2">
                        <span class="size-2 rounded-full bg-emerald-500"></span>
                        2. Inner Sidebar (Contextual Sub-Nav)
                      </div>
                      <p class="text-[11px]">Width w-60, light surface, user-dismissible. Contains module-level filters and sub-menus.</p>
                    </div>

                    <div class="p-3 rounded-xl border border-border bg-muted/30 space-y-1">
                      <div class="font-bold text-foreground flex items-center gap-2">
                        <span class="size-2 rounded-full bg-blue-500"></span>
                        3. Top Navigation Header (h-16)
                      </div>
                      <p class="text-[11px]">Dynamic route breadcrumb, reopen sidebar button, notification alerts, and user avatar.</p>
                    </div>

                    <div class="p-3 rounded-xl border border-border bg-muted/30 space-y-1">
                      <div class="font-bold text-foreground flex items-center gap-2">
                        <span class="size-2 rounded-full bg-primary"></span>
                        4. Main Content Canvas
                      </div>
                      <p class="text-[11px]">Fluid container with <code class="text-primary font-mono text-[10px]">h-full overflow-y-auto scroll-smooth p-4 lg:p-6</code>.</p>
                    </div>
                  </div>
                </div>

                <!-- Visual Layout Ascii Diagram -->
                <div class="bg-slate-950 p-4.5 rounded-2xl border border-slate-800 text-slate-300 font-mono text-[11px] leading-relaxed flex flex-col justify-between">
                  <div class="flex justify-between items-center pb-2 border-b border-slate-800">
                    <span class="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Layout ASCII Blueprint</span>
                    <button @click="copyCodeSnippet(`<div class='flex h-screen w-full bg-gray-50 dark:bg-background overflow-hidden'>\n  <aside class='w-56 bg-gray-900 h-full'>...</aside>\n  <aside class='w-60 bg-white border-r'>...</aside>\n  <main class='flex-1 h-full flex flex-col min-w-0'>\n    <header class='h-16 border-b'>...</header>\n    <div class='flex-1 overflow-y-auto p-6'>...</div>\n  </main>\n</div>`)" class="text-[9px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer">
                      <Copy class="size-2.5" />
                      Copy Template
                    </button>
                  </div>
                  <pre class="overflow-x-auto py-3 text-slate-400 text-[10px]">
+-------------------------------------------------------------+
| [Outer Rail: Dark w-16/w-56] | [Inner: w-60] | [Top Nav]    |
|                              |               | Breadcrumb   |
| - Brand Logomark             | - Sub-menu    +--------------+
| - Omnichannel                | - Filters     | [Canvas]     |
| - Contacts (Accordion)       |               |              |
| - Add-ons                    | (Dismissible) | <RouterView/>|
| - Collapse / Theme           |               |              |
+-------------------------------------------------------------+</pre>
                  <div class="text-[10px] text-slate-500 pt-2 border-t border-slate-800">
                    Rule: Whenever adding a new page, register in <span class="text-slate-300">AppShell.vue</span> & <span class="text-slate-300">Sidebar.vue</span>.
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>

          <!-- Section 3: New Page Creation Pre-flight Checklist -->
          <Card class="border-border shadow-sm overflow-hidden bg-card">
            <CardHeader class="border-b border-border/60 bg-muted/30 py-4 px-6">
              <CardTitle class="text-base font-bold flex items-center gap-2">
                <CheckCircle2 class="w-4.5 h-4.5 text-emerald-500" />
                3. Pre-Flight Checklist for New RakanSales Pages
              </CardTitle>
              <CardDescription class="text-xs text-muted-foreground">Verify these items whenever authoring new CRM pages or exporting mockups.</CardDescription>
            </CardHeader>
            <CardContent class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div class="p-3.5 bg-muted/30 rounded-xl border border-border space-y-2">
                  <div class="font-bold text-foreground flex items-center gap-2">
                    <span class="size-5 rounded-md bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">1</span>
                    Routing & Navigation
                  </div>
                  <p class="text-muted-foreground text-[11px] leading-relaxed">
                    Registered in <code class="font-mono text-primary">src/router/index.ts</code> and reflected in <code class="font-mono">Sidebar.vue</code> and <code class="font-mono">SecondaryPanel.vue</code>.
                  </p>
                </div>

                <div class="p-3.5 bg-muted/30 rounded-xl border border-border space-y-2">
                  <div class="font-bold text-foreground flex items-center gap-2">
                    <span class="size-5 rounded-md bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">2</span>
                    Scroll Container Isolation
                  </div>
                  <p class="text-muted-foreground text-[11px] leading-relaxed">
                    Top-level container uses <code class="font-mono text-primary">h-full w-full overflow-y-auto scroll-smooth</code> to prevent clipping under full-width layouts.
                  </p>
                </div>

                <div class="p-3.5 bg-muted/30 rounded-xl border border-border space-y-2">
                  <div class="font-bold text-foreground flex items-center gap-2">
                    <span class="size-5 rounded-md bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">3</span>
                    Color Contrast & Buttons
                  </div>
                  <p class="text-muted-foreground text-[11px] leading-relaxed">
                    Primary CTAs use <code class="font-mono text-primary">bg-primary text-white</code>. Status chips use tinted backgrounds with colored text.
                  </p>
                </div>

                <div class="p-3.5 bg-muted/30 rounded-xl border border-border space-y-2">
                  <div class="font-bold text-foreground flex items-center gap-2">
                    <span class="size-5 rounded-md bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">4</span>
                    Typography & Number Formats
                  </div>
                  <p class="text-muted-foreground text-[11px] leading-relaxed">
                    Headings use <code class="font-mono">tracking-tight</code>. All revenue metrics, timestamps, phone numbers, and IDs use <code class="font-mono text-primary">font-mono</code>.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        <!-- ═════════════════════════════════════════════════════════════
             VIEW MODE 2: RAW MARKDOWN CODE BLOCK
        ═══════════════════════════════════════════════════════════════ -->
        <div v-else class="space-y-4 animate-in fade-in duration-200">
          <div class="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-800">
              <div>
                <div class="text-xs font-bold text-emerald-400 font-mono flex items-center gap-2">
                  <FileCode class="w-4 h-4" />
                  RakanSales_Design_System_Prompt_Nova_v4.md
                </div>
                <div class="text-[11px] text-slate-400 mt-0.5">Ready to copy and paste into Claude, GPT, Cursor, or Antigravity system prompts.</div>
              </div>
              <div class="flex items-center gap-2">
                <Button 
                  @click="copyFullMarkdown" 
                  size="sm" 
                  variant="primary" 
                  class="text-xs font-bold bg-primary hover:bg-primary-dark text-white cursor-pointer flex items-center gap-1.5"
                >
                  <component :is="isCopiedFullMarkdown ? CheckCheck : Copy" class="w-3.5 h-3.5" />
                  <span>{{ isCopiedFullMarkdown ? 'Copied' : 'Copy Raw Markdown' }}</span>
                </Button>
                <button 
                  @click="downloadMarkdownFile" 
                  class="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                  title="Download File"
                >
                  <Download class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Monospace Code Output -->
            <pre class="font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto p-4 bg-slate-900/90 rounded-2xl border border-slate-800/80 max-h-[600px] overflow-y-auto selection:bg-primary selection:text-white"><code>{{ rakanSalesGuidelinesMarkdown }}</code></pre>
          </div>
        </div>

      </div>

    </div>

    <!-- Floating Back to Top Action Button with Scroll Spy -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-4 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-4 scale-95"
    >
      <button
        v-if="showBackToTop"
        @click="scrollToTop"
        title="Back to Top (Scroll)"
        class="fixed bottom-6 right-6 z-50 p-3 bg-gray-900/90 dark:bg-slate-800/90 text-white rounded-full shadow-xl hover:bg-gray-800 dark:hover:bg-slate-700 active:scale-95 transition-all duration-200 backdrop-blur-md border border-white/15 flex items-center justify-center cursor-pointer group"
      >
        <ArrowUp class="w-5 h-5 group-hover:-translate-y-0.5 transition-transform duration-200" />
      </button>
    </transition>

    <!-- Active Global Toaster -->
    <Toaster rich-colors />

    <!-- Global Interactive Command Palette Spotlight Modal (Cmd+K / Ctrl+K) -->
    <div 
      v-if="isCommandPaletteOpen" 
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 p-4 animate-in fade-in duration-150"
      @click.self="isCommandPaletteOpen = false"
    >
      <div 
        class="bg-card dark:bg-slate-900 border border-border w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[500px]"
      >
        <!-- Search Input Bar -->
        <div class="p-3.5 border-b border-border flex items-center gap-3 bg-muted/30">
          <Search class="size-4 text-muted-foreground shrink-0" />
          <input 
            v-model="commandPaletteQuery"
            placeholder="Type a command or search recent deals..."
            class="bg-transparent border-none outline-none text-xs md:text-sm text-foreground placeholder:text-muted-foreground w-full font-medium"
            autofocus
            @keydown.esc="isCommandPaletteOpen = false"
          />
          <kbd class="text-[10px] font-mono px-1.5 py-0.5 bg-muted text-muted-foreground rounded border border-border shrink-0">ESC</kbd>
        </div>

        <!-- Action Items List -->
        <div class="p-2 overflow-y-auto space-y-3 text-xs divide-y divide-border/40">
          
          <!-- Categories -->
          <div 
            v-for="cat in ['Quick Actions', 'Recent Deals', 'Navigation']" 
            :key="cat"
            class="space-y-1 pt-1 first:pt-0"
          >
            <div class="px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-muted-foreground font-mono">
              {{ cat }}
            </div>

            <button 
              v-for="item in filteredCommandPaletteActions.filter(a => a.category === cat)"
              :key="item.id"
              @click="item.action()"
              class="w-full px-3 py-2 rounded-xl text-left hover:bg-primary/10 hover:text-primary transition-colors flex items-center justify-between group cursor-pointer"
            >
              <div class="flex items-center gap-2.5 min-w-0">
                <Icon :icon="item.icon" class="size-4 text-muted-foreground group-hover:text-primary shrink-0" />
                <span class="font-semibold truncate text-foreground group-hover:text-primary">{{ item.title }}</span>
              </div>
              <kbd class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-muted border border-border text-muted-foreground group-hover:border-primary/30 group-hover:text-primary">
                {{ item.shortcut }}
              </kbd>
            </button>
          </div>

          <!-- Empty Search State -->
          <div v-if="filteredCommandPaletteActions.length === 0" class="py-8 text-center text-muted-foreground">
            <p class="text-xs">No actions or records match "{{ commandPaletteQuery }}".</p>
          </div>

        </div>

        <!-- Footer -->
        <div class="p-2.5 bg-muted/40 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground font-mono px-4">
          <div class="flex items-center gap-3">
            <span>Navigation: <kbd class="px-1 bg-muted rounded border">↑</kbd> <kbd class="px-1 bg-muted rounded border">↓</kbd></span>
            <span>Select: <kbd class="px-1 bg-muted rounded border">↵</kbd></span>
          </div>
          <span class="text-primary font-semibold">RakanSales Spotlight</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* PIN OTP Physical Shake Feedback Animation */
@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  20%, 60% {
    transform: translateX(-5px);
  }
  40%, 80% {
    transform: translateX(5px);
  }
}

.animate-shake {
  animation: shake 0.4s ease-in-out;
}

/* Premium High-Tech Skeleton Shimmer Beam */
.skeleton-shimmer {
  position: relative;
  overflow: hidden;
}

.skeleton-shimmer::after {
  content: '';
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(
    90deg,
    transparent,
    rgba(16, 185, 129, 0.08) 20%,
    rgba(16, 185, 129, 0.22) 50%,
    rgba(16, 185, 129, 0.08) 80%,
    transparent
  );
  animation: shimmer-beam 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
}

@keyframes shimmer-beam {
  100% {
    transform: translateX(100%);
  }
}

/* Local Fade Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

