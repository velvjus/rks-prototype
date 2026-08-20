<script setup lang="ts">
import { ref, reactive, computed, onUnmounted, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { 
  X, 
  RotateCcw, 
  Calendar, 
  ChevronDown, 
  Plus,
  Hourglass,
  Inbox,
  Flame,
  AlertTriangle,
  Radio,
  User,
  Users,
  Tag,
  Clock,
  Search,
  Check
} from 'lucide-vue-next'
import PlatformIcon from '@/components/omnichannel/PlatformIcon.vue'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'apply', filters: any): void
  (e: 'toast', message: string, type: 'success' | 'info'): void
}>()

const modalContainerRef = ref<HTMLElement | null>(null)
onClickOutside(modalContainerRef, () => {
  closeAllDropdowns()
  emit('close')
})

const initialFilters = {
  quick: {
    status: 'All' as 'All' | 'Open' | 'Resolved' | 'Pending' | 'Archived',
    assigned: 'All' as 'All' | 'Mine' | 'Participating' | 'Unassigned',
    temperature: 'All' as 'All' | 'Hot' | 'Warm' | 'Cold',
    priority: 'All' as 'All' | 'High' | 'Medium' | 'Low'
  },
  more: {
    channels: ['WhatsApp', 'Instagram'] as string[],
    assignees: ['Liv'] as string[],
    teamNames: ['Sales'] as string[],
    campaignNames: ['Q4 Promo'] as string[],
    createdAt: 'in the last month',
    inboxNames: [] as string[],
    countries: [] as string[],
    services: [] as string[],
    lastActivity: 'in the last hour'
  }
}

const filters = reactive(JSON.parse(JSON.stringify(initialFilters)))

const visibleRows = reactive({
  channels: true,
  assignees: true,
  teamNames: true,
  campaignNames: true,
  createdAt: true,
  inboxNames: false,
  countries: false,
  services: false,
  lastActivity: false
})

const allChannelOptions = [
  'WhatsApp',
  'Messenger',
  'Instagram',
  'Telegram',
  'LinkedIn',
  'Mail',
  'LiveChat',
  'Facebook',
  'Webform',
  'SMS'
]

const allAgentOptions = [
  { id: 'Liv', name: 'Olivia (Me)' },
  { id: 'Faizal', name: 'Faizal' },
  { id: 'Aisyah', name: 'Aisyah' },
  { id: 'Rajesh', name: 'Rajesh' },
  { id: 'WeiJie', name: 'WeiJie' },
  { id: 'Zac', name: 'Zac Goh' },
  { id: 'Unassigned', name: 'Unassigned' }
]

const allTeamOptions = [
  'Sales',
  'Support',
  'Marketing',
  'Enterprise',
  'Growth & Retention',
  'Customer Success',
  'Billing & Operations'
]

const allCampaignOptions = [
  'Q4 Promo',
  'Black Friday',
  'Google Ads Inbound',
  'Webinar Leads',
  'Product Launch',
  'Referral Program',
  'Meta Retargeting'
]

const statusOptions = ['All', 'Open', 'Resolved', 'Pending', 'Archived'] as const
const scopeOptions = ['All', 'Mine', 'Participating', 'Unassigned'] as const
const tempOptions = ['All', 'Hot', 'Warm', 'Cold'] as const
const priorityOptions = ['All', 'High', 'Medium', 'Low'] as const
const createdAtOptions = ['in the last month', 'in the last week', 'in the last 24 hours', 'custom range']

const activeFilterCount = computed(() => {
  let count = 0
  if (filters.quick.status !== 'All') count++
  if (filters.quick.assigned !== 'All') count++
  if (filters.quick.temperature !== 'All') count++
  if (filters.quick.priority !== 'All') count++
  if (filters.more.channels.length > 0) count++
  if (filters.more.assignees.length > 0) count++
  if (filters.more.teamNames.length > 0) count++
  if (filters.more.campaignNames.length > 0) count++
  return count
})

// Popover states, positions, and search queries
const isAddFilterDropdownOpen = ref(false)
const isAddChannelOpen = ref(false)
const isAddAgentOpen = ref(false)
const isAddTeamOpen = ref(false)
const isAddCampaignOpen = ref(false)

const channelDropdownStyle = ref({ top: '0px', left: '0px' })
const agentDropdownStyle = ref({ top: '0px', left: '0px' })
const teamDropdownStyle = ref({ top: '0px', left: '0px' })
const campaignDropdownStyle = ref({ top: '0px', left: '0px' })
const addFilterDropdownStyle = ref({ top: '0px', left: '0px' })

const channelSearch = ref('')
const agentSearch = ref('')
const teamSearch = ref('')
const campaignSearch = ref('')
const filterFieldSearch = ref('')

const channelDropdownEl = ref<HTMLElement | null>(null)
const agentDropdownEl = ref<HTMLElement | null>(null)
const teamDropdownEl = ref<HTMLElement | null>(null)
const campaignDropdownEl = ref<HTMLElement | null>(null)
const addFilterDropdownEl = ref<HTMLElement | null>(null)

const channelBtnRef = ref<HTMLElement | null>(null)
const agentBtnRef = ref<HTMLElement | null>(null)
const teamBtnRef = ref<HTMLElement | null>(null)
const campaignBtnRef = ref<HTMLElement | null>(null)
const addFilterBtnRef = ref<HTMLElement | null>(null)

onClickOutside(channelDropdownEl, () => { isAddChannelOpen.value = false }, { ignore: [channelBtnRef] })
onClickOutside(agentDropdownEl, () => { isAddAgentOpen.value = false }, { ignore: [agentBtnRef] })
onClickOutside(teamDropdownEl, () => { isAddTeamOpen.value = false }, { ignore: [teamBtnRef] })
onClickOutside(campaignDropdownEl, () => { isAddCampaignOpen.value = false }, { ignore: [campaignBtnRef] })
onClickOutside(addFilterDropdownEl, () => { isAddFilterDropdownOpen.value = false }, { ignore: [addFilterBtnRef] })

const closeAllDropdowns = () => {
  isAddChannelOpen.value = false
  isAddAgentOpen.value = false
  isAddTeamOpen.value = false
  isAddCampaignOpen.value = false
  isAddFilterDropdownOpen.value = false
}

const toggleDropdown = (type: 'channel' | 'agent' | 'team' | 'campaign' | 'filter', event: MouseEvent) => {
  event.stopPropagation()
  const btn = event.currentTarget as HTMLElement
  const rect = btn.getBoundingClientRect()
  
  // Calculate position avoiding offscreen clipping
  const popoverWidth = 220
  const popoverHeight = 240
  let left = rect.left
  if (left + popoverWidth > window.innerWidth - 20) {
    left = window.innerWidth - popoverWidth - 20
  }
  
  let top = rect.bottom + 6
  if (top + popoverHeight > window.innerHeight - 20) {
    top = Math.max(10, rect.top - popoverHeight - 6)
  }

  const style = { top: `${top}px`, left: `${left}px` }

  if (type === 'channel') {
    const wasOpen = isAddChannelOpen.value
    closeAllDropdowns()
    if (!wasOpen) {
      channelDropdownStyle.value = style
      channelSearch.value = ''
      isAddChannelOpen.value = true
    }
  } else if (type === 'agent') {
    const wasOpen = isAddAgentOpen.value
    closeAllDropdowns()
    if (!wasOpen) {
      agentDropdownStyle.value = style
      agentSearch.value = ''
      isAddAgentOpen.value = true
    }
  } else if (type === 'team') {
    const wasOpen = isAddTeamOpen.value
    closeAllDropdowns()
    if (!wasOpen) {
      teamDropdownStyle.value = style
      teamSearch.value = ''
      isAddTeamOpen.value = true
    }
  } else if (type === 'campaign') {
    const wasOpen = isAddCampaignOpen.value
    closeAllDropdowns()
    if (!wasOpen) {
      campaignDropdownStyle.value = style
      campaignSearch.value = ''
      isAddCampaignOpen.value = true
    }
  } else if (type === 'filter') {
    const wasOpen = isAddFilterDropdownOpen.value
    closeAllDropdowns()
    if (!wasOpen) {
      addFilterDropdownStyle.value = style
      filterFieldSearch.value = ''
      isAddFilterDropdownOpen.value = true
    }
  }
}

// Filtered lists based on search
const filteredChannels = computed(() => {
  const q = channelSearch.value.trim().toLowerCase()
  if (!q) return allChannelOptions
  return allChannelOptions.filter(ch => ch.toLowerCase().includes(q))
})

const filteredAgents = computed(() => {
  const q = agentSearch.value.trim().toLowerCase()
  if (!q) return allAgentOptions
  return allAgentOptions.filter(a => a.name.toLowerCase().includes(q) || a.id.toLowerCase().includes(q))
})

const filteredTeams = computed(() => {
  const q = teamSearch.value.trim().toLowerCase()
  if (!q) return allTeamOptions
  return allTeamOptions.filter(t => t.toLowerCase().includes(q))
})

const filteredCampaigns = computed(() => {
  const q = campaignSearch.value.trim().toLowerCase()
  if (!q) return allCampaignOptions
  return allCampaignOptions.filter(c => c.toLowerCase().includes(q))
})

const filteredHiddenFilterFields = computed(() => {
  const q = filterFieldSearch.value.trim().toLowerCase()
  const list = Object.entries(visibleRows)
    .filter(([_, isVisible]) => !isVisible)
    .map(([key]) => key)
  if (!q) return list
  return list.filter(k => k.toLowerCase().includes(q))
})

const resetQuickFilter = (type: keyof typeof filters.quick) => {
  filters.quick[type] = 'All' as any
}

const resetMoreFilter = (key: keyof typeof filters.more) => {
  const k = key as string
  const moreFilters = filters.more as Record<string, any>
  const initMore = initialFilters.more as Record<string, any>
  if (Array.isArray(moreFilters[k])) {
    moreFilters[k] = [...initMore[k]]
  } else {
    moreFilters[k] = initMore[k]
  }
}

const removeMoreFilterRow = (key: keyof typeof visibleRows) => {
  visibleRows[key] = false
}

const addFilterRow = (key: keyof typeof visibleRows) => {
  visibleRows[key] = true
  isAddFilterDropdownOpen.value = false
  filterFieldSearch.value = ''
}

const toggleChannel = (ch: string) => {
  if (filters.more.channels.includes(ch)) {
    filters.more.channels = filters.more.channels.filter((c: string) => c !== ch)
  } else {
    filters.more.channels.push(ch)
  }
}

const toggleAgent = (agentId: string) => {
  if (filters.more.assignees.includes(agentId)) {
    filters.more.assignees = filters.more.assignees.filter((a: string) => a !== agentId)
  } else {
    filters.more.assignees.push(agentId)
  }
}

const toggleTeam = (team: string) => {
  if (filters.more.teamNames.includes(team)) {
    filters.more.teamNames = filters.more.teamNames.filter((t: string) => t !== team)
  } else {
    filters.more.teamNames.push(team)
  }
}

const toggleCampaign = (camp: string) => {
  if (filters.more.campaignNames.includes(camp)) {
    filters.more.campaignNames = filters.more.campaignNames.filter((c: string) => c !== camp)
  } else {
    filters.more.campaignNames.push(camp)
  }
}

const addNewTeamFromSearch = () => {
  const val = teamSearch.value.trim()
  if (val && !filters.more.teamNames.includes(val)) {
    filters.more.teamNames.push(val)
    teamSearch.value = ''
  }
}

const addNewCampaignFromSearch = () => {
  const val = campaignSearch.value.trim()
  if (val && !filters.more.campaignNames.includes(val)) {
    filters.more.campaignNames.push(val)
    campaignSearch.value = ''
  }
}

const removeChip = (key: 'channels' | 'assignees' | 'teamNames' | 'campaignNames' | 'inboxNames' | 'countries' | 'services', chip: string) => {
  filters.more[key] = filters.more[key].filter((t: string) => t !== chip)
}

const handleClearAll = () => {
  Object.assign(filters.quick, initialFilters.quick)
  Object.assign(filters.more, {
    channels: [],
    assignees: [],
    inboxNames: [],
    teamNames: [],
    campaignNames: [],
    countries: [],
    services: [],
    createdAt: 'in the last month',
    lastActivity: 'in the last hour'
  })
  emit('toast', 'Reset all filters', 'info')
}

const handleApply = () => {
  closeAllDropdowns()
  emit('apply', filters)
  emit('close')
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs select-none">
    <div 
      ref="modalContainerRef" 
      class="bg-white rounded-2xl w-full max-w-2xl flex flex-col max-h-[88vh] overflow-hidden border border-gray-200 shadow-2xl animate-modal-slide-up"
    >
      <!-- Header -->
      <header class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div class="flex items-center gap-2">
          <h2 class="text-sm font-bold text-gray-900">Filters</h2>
          <span v-if="activeFilterCount > 0" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#23B750] text-white font-mono">
            {{ activeFilterCount }}
          </span>
        </div>

        <div class="flex items-center gap-3">
          <button 
            @click="handleClearAll" 
            class="text-xs text-gray-400 hover:text-gray-700 transition-colors cursor-pointer font-medium"
          >
            Reset
          </button>
          <button 
            @click="emit('close')" 
            class="text-gray-400 hover:text-gray-700 cursor-pointer p-1 rounded-md hover:bg-gray-100 transition-colors"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </header>

      <!-- Scrollable Body -->
      <div class="flex-1 overflow-y-auto px-6 py-5 space-y-6 scrollbar-thin">
        
        <!-- SECTION 1: QUICK FILTERS -->
        <div class="space-y-4">
          <h3 class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Quick Filters</h3>
          
          <div class="space-y-3.5">
            <!-- 1. Status Row -->
            <div class="flex items-center justify-between gap-4 text-xs">
              <div class="flex items-center gap-2 w-32 text-gray-600 font-medium shrink-0">
                <Hourglass class="w-3.5 h-3.5 text-gray-400" />
                <span>Status</span>
              </div>
              <div class="flex-1 flex flex-wrap gap-1.5">
                <button 
                  v-for="opt in statusOptions" 
                  :key="opt"
                  @click="filters.quick.status = opt"
                  class="px-3 py-1 rounded-full text-[11px] border transition-all duration-150 cursor-pointer"
                  :class="[ 
                    filters.quick.status === opt 
                      ? 'bg-[#23B750] border-[#23B750] text-white font-bold shadow-2xs' 
                      : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50' 
                  ]"
                >
                  {{ opt }}
                </button>
              </div>
              <button @click="resetQuickFilter('status')" title="Reset" class="text-gray-300 hover:text-gray-600 p-1 cursor-pointer">
                <RotateCcw class="w-3 h-3" />
              </button>
            </div>

            <!-- 2. Scope Row -->
            <div class="flex items-center justify-between gap-4 text-xs">
              <div class="flex items-center gap-2 w-32 text-gray-600 font-medium shrink-0">
                <Inbox class="w-3.5 h-3.5 text-gray-400" />
                <span>Scope</span>
              </div>
              <div class="flex-1 flex flex-wrap gap-1.5">
                <button 
                  v-for="opt in scopeOptions" 
                  :key="opt"
                  @click="filters.quick.assigned = opt"
                  class="px-3 py-1 rounded-full text-[11px] border transition-all duration-150 cursor-pointer"
                  :class="[ 
                    filters.quick.assigned === opt 
                      ? 'bg-[#23B750] border-[#23B750] text-white font-bold shadow-2xs' 
                      : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50' 
                  ]"
                >
                  {{ opt }}
                </button>
              </div>
              <button @click="resetQuickFilter('assigned')" title="Reset" class="text-gray-300 hover:text-gray-600 p-1 cursor-pointer">
                <RotateCcw class="w-3 h-3" />
              </button>
            </div>

            <!-- 3. Temperature Row -->
            <div class="flex items-center justify-between gap-4 text-xs">
              <div class="flex items-center gap-2 w-32 text-gray-600 font-medium shrink-0">
                <Flame class="w-3.5 h-3.5 text-gray-400" />
                <span>Temperature</span>
              </div>
              <div class="flex-1 flex flex-wrap gap-1.5">
                <button 
                  v-for="opt in tempOptions" 
                  :key="opt"
                  @click="filters.quick.temperature = opt"
                  class="px-3 py-1 rounded-full text-[11px] border transition-all duration-150 cursor-pointer"
                  :class="[ 
                    filters.quick.temperature === opt 
                      ? 'bg-[#23B750] border-[#23B750] text-white font-bold shadow-2xs' 
                      : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50' 
                  ]"
                >
                  {{ opt }}
                </button>
              </div>
              <button @click="resetQuickFilter('temperature')" title="Reset" class="text-gray-300 hover:text-gray-600 p-1 cursor-pointer">
                <RotateCcw class="w-3 h-3" />
              </button>
            </div>

            <!-- 4. Priority Row -->
            <div class="flex items-center justify-between gap-4 text-xs">
              <div class="flex items-center gap-2 w-32 text-gray-600 font-medium shrink-0">
                <AlertTriangle class="w-3.5 h-3.5 text-gray-400" />
                <span>Priority</span>
              </div>
              <div class="flex-1 flex flex-wrap gap-1.5">
                <button 
                  v-for="opt in priorityOptions" 
                  :key="opt"
                  @click="filters.quick.priority = opt"
                  class="px-3 py-1 rounded-full text-[11px] border transition-all duration-150 cursor-pointer"
                  :class="[ 
                    filters.quick.priority === opt 
                      ? 'bg-[#23B750] border-[#23B750] text-white font-bold shadow-2xs' 
                      : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50' 
                  ]"
                >
                  {{ opt }}
                </button>
              </div>
              <button @click="resetQuickFilter('priority')" title="Reset" class="text-gray-300 hover:text-gray-600 p-1 cursor-pointer">
                <RotateCcw class="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        <div class="border-t border-gray-100"></div>

        <!-- SECTION 2: ATTRIBUTES & ROUTING -->
        <div class="space-y-4">
          <h3 class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Attributes & Routing</h3>
          
          <div class="space-y-3.5">
            <!-- 1. Multi-Select Channels Row -->
            <div v-if="visibleRows.channels" class="flex items-center justify-between gap-4 text-xs">
              <div class="flex items-center gap-2 w-32 text-gray-600 font-medium shrink-0">
                <Radio class="w-3.5 h-3.5 text-gray-400" />
                <span>Channel</span>
              </div>
              <div class="flex-1 flex gap-2 items-center">
                <span class="px-2 py-1 bg-gray-50 border border-gray-200 rounded text-gray-400 text-[11px] font-medium">is</span>
                <div class="flex-1 flex flex-wrap gap-1.5 items-center min-h-[34px]">
                  <span 
                    v-for="ch in filters.more.channels" 
                    :key="ch"
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-gray-50 border border-gray-200 text-gray-800"
                  >
                    <PlatformIcon :platform="ch" size="xs" variant="colored" />
                    <span>{{ ch }}</span>
                    <button @click="removeChip('channels', ch)" class="p-0.5 hover:text-red-500 rounded cursor-pointer text-gray-400"><X class="w-2.5 h-2.5" /></button>
                  </span>
                  
                  <!-- Add Channel Popover Trigger -->
                  <button 
                    ref="channelBtnRef"
                    type="button"
                    @click="toggleDropdown('channel', $event)"
                    class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-dashed border-gray-300 text-[11px] font-medium text-gray-500 hover:text-gray-800 hover:border-gray-400 hover:bg-gray-50 cursor-pointer"
                  >
                    <Plus class="w-3 h-3 text-[#23B750]" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
              <div class="flex items-center gap-1 text-gray-300">
                <button @click="resetMoreFilter('channels')" title="Reset" class="hover:text-gray-600 p-1 cursor-pointer"><RotateCcw class="w-3 h-3" /></button>
                <button @click="removeMoreFilterRow('channels')" title="Remove" class="hover:text-gray-600 p-1 cursor-pointer"><X class="w-3 h-3" /></button>
              </div>
            </div>

            <!-- 2. Multi-Select Assignees Row -->
            <div v-if="visibleRows.assignees" class="flex items-center justify-between gap-4 text-xs">
              <div class="flex items-center gap-2 w-32 text-gray-600 font-medium shrink-0">
                <User class="w-3.5 h-3.5 text-gray-400" />
                <span>Agent</span>
              </div>
              <div class="flex-1 flex gap-2 items-center">
                <span class="px-2 py-1 bg-gray-50 border border-gray-200 rounded text-gray-400 text-[11px] font-medium">is</span>
                <div class="flex-1 flex flex-wrap gap-1.5 items-center min-h-[34px]">
                  <span 
                    v-for="agentId in filters.more.assignees" 
                    :key="agentId"
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-gray-50 border border-gray-200 text-gray-800"
                  >
                    <span class="w-3.5 h-3.5 rounded-full bg-gray-200 text-[9px] font-bold flex items-center justify-center text-gray-600">{{ agentId.slice(0, 1) }}</span>
                    <span>{{ allAgentOptions.find(a => a.id === agentId)?.name || agentId }}</span>
                    <button @click="removeChip('assignees', agentId)" class="p-0.5 hover:text-red-500 rounded cursor-pointer text-gray-400"><X class="w-2.5 h-2.5" /></button>
                  </span>
                  
                  <!-- Add Agent Popover Trigger -->
                  <button 
                    ref="agentBtnRef"
                    type="button"
                    @click="toggleDropdown('agent', $event)"
                    class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-dashed border-gray-300 text-[11px] font-medium text-gray-500 hover:text-gray-800 hover:border-gray-400 hover:bg-gray-50 cursor-pointer"
                  >
                    <Plus class="w-3 h-3 text-[#23B750]" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
              <div class="flex items-center gap-1 text-gray-300">
                <button @click="resetMoreFilter('assignees')" title="Reset" class="hover:text-gray-600 p-1 cursor-pointer"><RotateCcw class="w-3 h-3" /></button>
                <button @click="removeMoreFilterRow('assignees')" title="Remove" class="hover:text-gray-600 p-1 cursor-pointer"><X class="w-3 h-3" /></button>
              </div>
            </div>

            <!-- 3. Multi-Select Team Row -->
            <div v-if="visibleRows.teamNames" class="flex items-center justify-between gap-4 text-xs">
              <div class="flex items-center gap-2 w-32 text-gray-600 font-medium shrink-0">
                <Users class="w-3.5 h-3.5 text-gray-400" />
                <span>Team</span>
              </div>
              <div class="flex-1 flex gap-2 items-center">
                <span class="px-2 py-1 bg-gray-50 border border-gray-200 rounded text-gray-400 text-[11px] font-medium">is</span>
                <div class="flex-1 flex flex-wrap gap-1.5 items-center min-h-[34px]">
                  <span 
                    v-for="chip in filters.more.teamNames" 
                    :key="chip"
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-gray-50 border border-gray-200 text-gray-800"
                  >
                    <span>{{ chip }}</span>
                    <button @click="removeChip('teamNames', chip)" class="p-0.5 hover:text-red-500 rounded cursor-pointer text-gray-400"><X class="w-2.5 h-2.5" /></button>
                  </span>
                  
                  <!-- Add Team Popover Trigger -->
                  <button 
                    ref="teamBtnRef"
                    type="button"
                    @click="toggleDropdown('team', $event)"
                    class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-dashed border-gray-300 text-[11px] font-medium text-gray-500 hover:text-gray-800 hover:border-gray-400 hover:bg-gray-50 cursor-pointer"
                  >
                    <Plus class="w-3 h-3 text-[#23B750]" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
              <div class="flex items-center gap-1 text-gray-300">
                <button @click="resetMoreFilter('teamNames')" title="Reset" class="hover:text-gray-600 p-1 cursor-pointer"><RotateCcw class="w-3 h-3" /></button>
                <button @click="removeMoreFilterRow('teamNames')" title="Remove" class="hover:text-gray-600 p-1 cursor-pointer"><X class="w-3 h-3" /></button>
              </div>
            </div>

            <!-- 4. Campaign Row -->
            <div v-if="visibleRows.campaignNames" class="flex items-center justify-between gap-4 text-xs">
              <div class="flex items-center gap-2 w-32 text-gray-600 font-medium shrink-0">
                <Tag class="w-3.5 h-3.5 text-gray-400" />
                <span>Campaign</span>
              </div>
              <div class="flex-1 flex gap-2 items-center">
                <span class="px-2 py-1 bg-gray-50 border border-gray-200 rounded text-gray-400 text-[11px] font-medium">is</span>
                <div class="flex-1 flex flex-wrap gap-1.5 items-center min-h-[34px]">
                  <span 
                    v-for="chip in filters.more.campaignNames" 
                    :key="chip"
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-gray-50 border border-gray-200 text-gray-800"
                  >
                    <span>{{ chip }}</span>
                    <button @click="removeChip('campaignNames', chip)" class="p-0.5 hover:text-red-500 rounded cursor-pointer text-gray-400"><X class="w-2.5 h-2.5" /></button>
                  </span>
                  
                  <!-- Add Campaign Popover Trigger -->
                  <button 
                    ref="campaignBtnRef"
                    type="button"
                    @click="toggleDropdown('campaign', $event)"
                    class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-dashed border-gray-300 text-[11px] font-medium text-gray-500 hover:text-gray-800 hover:border-gray-400 hover:bg-gray-50 cursor-pointer"
                  >
                    <Plus class="w-3 h-3 text-[#23B750]" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
              <div class="flex items-center gap-1 text-gray-300">
                <button @click="resetMoreFilter('campaignNames')" title="Reset" class="hover:text-gray-600 p-1 cursor-pointer"><RotateCcw class="w-3 h-3" /></button>
                <button @click="removeMoreFilterRow('campaignNames')" title="Remove" class="hover:text-gray-600 p-1 cursor-pointer"><X class="w-3 h-3" /></button>
              </div>
            </div>

            <!-- 5. Created Date Row -->
            <div v-if="visibleRows.createdAt" class="flex items-center justify-between gap-4 text-xs">
              <div class="flex items-center gap-2 w-32 text-gray-600 font-medium shrink-0">
                <Clock class="w-3.5 h-3.5 text-gray-400" />
                <span>Created Date</span>
              </div>
              <div class="flex-1 flex gap-2">
                <span class="px-2 py-1.5 bg-gray-50 border border-gray-200 rounded text-gray-400 text-[11px] font-medium">is</span>
                <div class="relative flex-1">
                  <select 
                    v-model="filters.more.createdAt"
                    class="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 text-xs text-gray-800 font-medium focus:outline-none focus:border-[#23B750] appearance-none cursor-pointer pr-8"
                  >
                    <option v-for="opt in createdAtOptions" :key="opt" :value="opt">{{ opt }}</option>
                  </select>
                  <ChevronDown class="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <button class="px-2.5 py-1.5 border border-gray-200 bg-white hover:bg-gray-50 rounded flex items-center justify-center cursor-pointer transition-colors text-gray-500">
                  <Calendar class="w-3.5 h-3.5" />
                </button>
              </div>
              <div class="flex items-center gap-1 text-gray-300">
                <button @click="resetMoreFilter('createdAt')" title="Reset" class="hover:text-gray-600 p-1 cursor-pointer"><RotateCcw class="w-3 h-3" /></button>
                <button @click="removeMoreFilterRow('createdAt')" title="Remove" class="hover:text-gray-600 p-1 cursor-pointer"><X class="w-3 h-3" /></button>
              </div>
            </div>

            <!-- Add Extra Field Button -->
            <div class="relative pt-2 pb-8">
              <button 
                ref="addFilterBtnRef"
                type="button"
                @click="toggleDropdown('filter', $event)"
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-dashed border-gray-300 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:border-[#23B750] hover:bg-green-50/40 transition-colors cursor-pointer"
              >
                <Plus class="w-3.5 h-3.5 text-[#23B750]" />
                <span>Add filter field</span>
              </button>
            </div>

          </div>
        </div>

      </div>

      <!-- Footer -->
      <footer class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-white">
        <button 
          @click="emit('close')" 
          class="px-4 py-2 border border-gray-200 bg-white hover:bg-gray-50 text-xs font-medium text-gray-700 rounded-lg cursor-pointer transition-colors"
        >
          Cancel
        </button>
        <button 
          @click="handleApply" 
          class="px-5 py-2 bg-[#23B750] hover:bg-[#1fa346] text-xs font-bold text-white rounded-lg cursor-pointer shadow-xs active:scale-95 transition-all"
        >
          Apply Filters
        </button>
      </footer>
    </div>

    <!-- ================= TELEPORTED FLOATING DROPDOWNS (UNCLIPPED Z-INDEX) ================= -->
    <teleport to="body">
      <!-- 1. Channel Dropdown -->
      <div 
        v-if="isAddChannelOpen"
        ref="channelDropdownEl"
        :style="channelDropdownStyle"
        class="fixed w-56 bg-white border border-gray-200 rounded-xl shadow-2xl z-[99999] py-1.5 animate-in fade-in zoom-in-95 duration-100 select-none"
      >
        <div class="px-2.5 pb-1.5 pt-0.5 border-b border-gray-100">
          <div class="relative flex items-center">
            <Search class="w-3 h-3 text-gray-400 absolute left-2 pointer-events-none" />
            <input 
              v-model="channelSearch"
              type="text" 
              placeholder="Search channels..." 
              class="w-full bg-gray-50 border border-gray-200 rounded-md pl-6 pr-2 py-1 text-xs text-gray-800 placeholder:text-gray-400 outline-none focus:border-[#23B750] focus:bg-white"
            />
          </div>
        </div>
        <div class="max-h-52 overflow-y-auto py-1 scrollbar-thin">
          <button 
            v-for="ch in filteredChannels" 
            :key="ch"
            @click="toggleChannel(ch)"
            class="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 flex items-center justify-between cursor-pointer"
          >
            <div class="flex items-center gap-2">
              <PlatformIcon :platform="ch" size="xs" variant="colored" />
              <span>{{ ch }}</span>
            </div>
            <Check v-if="filters.more.channels.includes(ch)" class="w-3.5 h-3.5 text-[#23B750]" />
          </button>
          <div v-if="filteredChannels.length === 0" class="px-3 py-2 text-[11px] text-gray-400 italic text-center">
            No channels found
          </div>
        </div>
      </div>

      <!-- 2. Agent Dropdown -->
      <div 
        v-if="isAddAgentOpen"
        ref="agentDropdownEl"
        :style="agentDropdownStyle"
        class="fixed w-56 bg-white border border-gray-200 rounded-xl shadow-2xl z-[99999] py-1.5 animate-in fade-in zoom-in-95 duration-100 select-none"
      >
        <div class="px-2.5 pb-1.5 pt-0.5 border-b border-gray-100">
          <div class="relative flex items-center">
            <Search class="w-3 h-3 text-gray-400 absolute left-2 pointer-events-none" />
            <input 
              v-model="agentSearch"
              type="text" 
              placeholder="Search agents..." 
              class="w-full bg-gray-50 border border-gray-200 rounded-md pl-6 pr-2 py-1 text-xs text-gray-800 placeholder:text-gray-400 outline-none focus:border-[#23B750] focus:bg-white"
            />
          </div>
        </div>
        <div class="max-h-52 overflow-y-auto py-1 scrollbar-thin">
          <button 
            v-for="agent in filteredAgents" 
            :key="agent.id"
            @click="toggleAgent(agent.id)"
            class="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 flex items-center justify-between cursor-pointer"
          >
            <div class="flex items-center gap-2">
              <span class="w-4 h-4 rounded-full bg-gray-100 text-[9px] font-bold flex items-center justify-center text-gray-600">{{ agent.id.slice(0, 1) }}</span>
              <span>{{ agent.name }}</span>
            </div>
            <Check v-if="filters.more.assignees.includes(agent.id)" class="w-3.5 h-3.5 text-[#23B750]" />
          </button>
          <div v-if="filteredAgents.length === 0" class="px-3 py-2 text-[11px] text-gray-400 italic text-center">
            No agents found
          </div>
        </div>
      </div>

      <!-- 3. Team Dropdown -->
      <div 
        v-if="isAddTeamOpen"
        ref="teamDropdownEl"
        :style="teamDropdownStyle"
        class="fixed w-56 bg-white border border-gray-200 rounded-xl shadow-2xl z-[99999] py-1.5 animate-in fade-in zoom-in-95 duration-100 select-none"
      >
        <div class="px-2.5 pb-1.5 pt-0.5 border-b border-gray-100">
          <div class="relative flex items-center">
            <Search class="w-3 h-3 text-gray-400 absolute left-2 pointer-events-none" />
            <input 
              v-model="teamSearch"
              type="text" 
              placeholder="Search teams..." 
              class="w-full bg-gray-50 border border-gray-200 rounded-md pl-6 pr-2 py-1 text-xs text-gray-800 placeholder:text-gray-400 outline-none focus:border-[#23B750] focus:bg-white"
              @keyup.enter="addNewTeamFromSearch"
            />
          </div>
        </div>
        <div class="max-h-52 overflow-y-auto py-1 scrollbar-thin">
          <button 
            v-for="team in filteredTeams" 
            :key="team"
            @click="toggleTeam(team)"
            class="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 flex items-center justify-between cursor-pointer"
          >
            <span>{{ team }}</span>
            <Check v-if="filters.more.teamNames.includes(team)" class="w-3.5 h-3.5 text-[#23B750]" />
          </button>
          <div 
            v-if="teamSearch.trim() && !allTeamOptions.some(t => t.toLowerCase() === teamSearch.trim().toLowerCase())"
            @click="addNewTeamFromSearch"
            class="px-3 py-1.5 text-xs text-[#23B750] hover:bg-green-50/50 cursor-pointer font-medium flex items-center gap-1 border-t border-gray-100"
          >
            <Plus class="w-3 h-3" />
            <span>Add "{{ teamSearch.trim() }}"</span>
          </div>
          <div v-if="filteredTeams.length === 0 && !teamSearch.trim()" class="px-3 py-2 text-[11px] text-gray-400 italic text-center">
            No teams found
          </div>
        </div>
      </div>

      <!-- 4. Campaign Dropdown -->
      <div 
        v-if="isAddCampaignOpen"
        ref="campaignDropdownEl"
        :style="campaignDropdownStyle"
        class="fixed w-56 bg-white border border-gray-200 rounded-xl shadow-2xl z-[99999] py-1.5 animate-in fade-in zoom-in-95 duration-100 select-none"
      >
        <div class="px-2.5 pb-1.5 pt-0.5 border-b border-gray-100">
          <div class="relative flex items-center">
            <Search class="w-3 h-3 text-gray-400 absolute left-2 pointer-events-none" />
            <input 
              v-model="campaignSearch"
              type="text" 
              placeholder="Search campaigns..." 
              class="w-full bg-gray-50 border border-gray-200 rounded-md pl-6 pr-2 py-1 text-xs text-gray-800 placeholder:text-gray-400 outline-none focus:border-[#23B750] focus:bg-white"
              @keyup.enter="addNewCampaignFromSearch"
            />
          </div>
        </div>
        <div class="max-h-52 overflow-y-auto py-1 scrollbar-thin">
          <button 
            v-for="camp in filteredCampaigns" 
            :key="camp"
            @click="toggleCampaign(camp)"
            class="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 flex items-center justify-between cursor-pointer"
          >
            <span>{{ camp }}</span>
            <Check v-if="filters.more.campaignNames.includes(camp)" class="w-3.5 h-3.5 text-[#23B750]" />
          </button>
          <div 
            v-if="campaignSearch.trim() && !allCampaignOptions.some(c => c.toLowerCase() === campaignSearch.trim().toLowerCase())"
            @click="addNewCampaignFromSearch"
            class="px-3 py-1.5 text-xs text-[#23B750] hover:bg-green-50/50 cursor-pointer font-medium flex items-center gap-1 border-t border-gray-100"
          >
            <Plus class="w-3 h-3" />
            <span>Add "{{ campaignSearch.trim() }}"</span>
          </div>
          <div v-if="filteredCampaigns.length === 0 && !campaignSearch.trim()" class="px-3 py-2 text-[11px] text-gray-400 italic text-center">
            No campaigns found
          </div>
        </div>
      </div>

      <!-- 5. Add Filter Field Dropdown -->
      <div 
        v-if="isAddFilterDropdownOpen"
        ref="addFilterDropdownEl"
        :style="addFilterDropdownStyle"
        class="fixed w-52 bg-white border border-gray-200 rounded-xl shadow-2xl z-[99999] py-1.5 animate-in fade-in zoom-in-95 duration-100 select-none"
      >
        <div class="px-2.5 pb-1.5 pt-0.5 border-b border-gray-100">
          <div class="relative flex items-center">
            <Search class="w-3 h-3 text-gray-400 absolute left-2 pointer-events-none" />
            <input 
              v-model="filterFieldSearch"
              type="text" 
              placeholder="Search fields..." 
              class="w-full bg-gray-50 border border-gray-200 rounded-md pl-6 pr-2 py-1 text-xs text-gray-800 placeholder:text-gray-400 outline-none focus:border-[#23B750] focus:bg-white"
            />
          </div>
        </div>
        <div class="max-h-52 overflow-y-auto py-1 scrollbar-thin">
          <button 
            v-for="key in filteredHiddenFilterFields" 
            :key="key"
            @click="addFilterRow(key as any)"
            class="w-full text-left px-3.5 py-1.5 text-xs text-gray-700 hover:bg-gray-50 flex items-center justify-between cursor-pointer"
          >
            <span class="capitalize">{{ key.replace(/([A-Z])/g, ' $1') }}</span>
            <Plus class="w-3.5 h-3.5 text-gray-400" />
          </button>
          <div v-if="filteredHiddenFilterFields.length === 0" class="px-3 py-2 text-[11px] text-gray-400 italic text-center">
            All fields added
          </div>
        </div>
      </div>
    </teleport>

  </div>
</template>

<style scoped>
.animate-modal-slide-up {
  animation: modal-slide-up 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes modal-slide-up {
  from {
    transform: translateY(12px) scale(0.98);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
  }
}
</style>
