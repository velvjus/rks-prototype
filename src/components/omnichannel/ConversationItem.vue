<script setup lang="ts">
import { ref, computed } from 'vue'
import PlatformIcon from '@/components/omnichannel/PlatformIcon.vue'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
  ContextMenuLabel,
} from '@/components/ui/context-menu'

export interface Conversation {
  id: string
  sender: string
  platform: string
  avatar: string
  avatarFallback: string
  status: string
  time: string
  unreadCount: number
  rightBadge: string
  icons?: string[]
  section: string
  message: string
  isYou: boolean
  selected: boolean
  assignedTo: string
  tags?: string[]
  lifecycleState?: 'open' | 'closed' | 'archived'
  isUnreadGray?: boolean
  checked?: boolean
  isPinned?: boolean
  pinnedAt?: number
  isSnoozed?: boolean
  snoozedAt?: number
  isFocus?: boolean
  focusAddedAt?: number
  updatedAt?: number
}

const props = withDefaults(
  defineProps<{
    item: Conversation
    selected: boolean
    checked?: boolean
    viewMode?: 'admin' | 'sales'
  }>(),
  {
    checked: false,
    viewMode: 'sales'
  }
)

const emit = defineEmits<{
  (e: 'select', id: string): void
  (e: 'toggleSnooze', item: Conversation): void
  (e: 'toggleUnread', item: Conversation): void
  (e: 'toggleCheck', id: string): void
  (e: 'contextMenuAction', type: string, item: Conversation): void
  (e: 'contextMenuUpdateAttribute', field: 'priority' | 'vip' | 'temperature' | 'agent' | 'add-tag' | 'remove-tag', value: any, item: Conversation): void
}>()

const hasIcon = (icons: string[] | undefined | null, iconName: string): boolean => {
  if (!icons) return false
  return icons.includes(iconName)
}

const getCustomLabels = (tags?: string[]): string[] => {
  if (!tags) return []
  return tags.filter(tag => !['VIP-Tier', 'Temp-Warm', 'Temp-Cold'].includes(tag) && !tag.startsWith('Temp-'))
}

const newTagInput = ref('')
const rowRef = ref<HTMLElement | null>(null)

const focusTooltip = computed(() => {
  if (!props.item.focusAddedAt) return 'Focus Thread'
  const date = new Date(props.item.focusAddedAt)
  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const dateStr = date.toLocaleDateString([], { month: 'short', day: 'numeric' })
  return `Added to Focus on ${dateStr} at ${timeStr}`
})

const addTag = () => {
  const tag = newTagInput.value.trim()
  if (tag) {
    emit('contextMenuUpdateAttribute', 'add-tag', tag, props.item)
    newTagInput.value = ''
  }
}

const copyToClipboard = (text: string, label: string) => {
  navigator.clipboard.writeText(text)
  emit('contextMenuAction', 'copy-toast-' + label, props.item)
}

const openContextMenu = (e: MouseEvent) => {
  const triggerEl = rowRef.value
  if (triggerEl) {
    const customEvent = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: e.clientX,
      clientY: e.clientY
    })
    triggerEl.dispatchEvent(customEvent)
  }
}

const agentSearchQuery = ref('')

const agentOptions = [
  { value: 'Liv', label: 'Olivia (Me)', avatar: 'OL', role: 'Account Exec' },
  { value: 'Faizal', label: 'Ahmad Faizal', avatar: 'AF', role: 'Sales Representative' },
  { value: 'Aisyah', label: 'Siti Nur Aisyah', avatar: 'SN', role: 'Sales Representative' },
  { value: 'Rajesh', label: 'Rajesh Kumar', avatar: 'RK', role: 'Senior Consultant' },
  { value: 'WeiJie', label: 'Lim Wei Jie', avatar: 'LW', role: 'Support Specialist' },
  { value: 'Huda', label: 'Nurul Huda', avatar: 'NH', role: 'Sales Representative' },
  { value: 'Hafiz', label: 'Mohd Hafiz', avatar: 'MH', role: 'Sales Manager' },
  { value: 'Unassigned', label: 'Unassigned', avatar: 'UN', role: 'Queue' }
] as const

const filteredAgentOptions = computed(() => {
  const q = agentSearchQuery.value.toLowerCase().trim()
  if (!q) return agentOptions
  return agentOptions.filter(a => 
    a.label.toLowerCase().includes(q) || 
    a.value.toLowerCase().includes(q) ||
    (a.role && a.role.toLowerCase().includes(q))
  )
})

const isSlaBreached = (item: Conversation): boolean => {
  if (item.section === 'Resolved' || item.lifecycleState === 'closed' || item.lifecycleState === 'archived') return false
  if (item.rightBadge === 'Late' || item.rightBadge === 'Late Reply') return true
  
  const timeStr = item.time.toLowerCase().trim()
  if (timeStr.includes('d')) {
    return true
  }
  if (timeStr.includes('hr') || timeStr.includes('h')) {
    const hours = parseInt(timeStr)
    return !isNaN(hours) && hours >= 4
  }
  return false
}

const getSlaBreachTooltip = (item: Conversation): string => {
  const timeStr = item.time.toLowerCase().trim()
  let elapsedMinutes = 0
  if (timeStr.includes('m')) {
    elapsedMinutes = parseInt(timeStr) || 0
  } else if (timeStr.includes('hr') || timeStr.includes('h')) {
    elapsedMinutes = (parseInt(timeStr) || 0) * 60
  } else if (timeStr.includes('d')) {
    elapsedMinutes = (parseInt(timeStr) || 0) * 24 * 60
  } else if (timeStr === 'yesterday') {
    elapsedMinutes = 24 * 60
  }
  
  const slaThresholdMinutes = 240
  const breachDelayMinutes = elapsedMinutes - slaThresholdMinutes
  
  const now = new Date()
  const breachTime = new Date(now.getTime() - breachDelayMinutes * 60 * 1000)
  
  const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' }
  if (breachTime.toDateString() !== now.toDateString()) {
    options.month = 'short'
    options.day = 'numeric'
  }
  return `SLA breached at ${breachTime.toLocaleTimeString([], options)}`
}

const getSnoozeCountdown = (item: Conversation): string => {
  if (!item.snoozedAt) return '12h 00m remaining'
  const elapsedMs = Date.now() - item.snoozedAt
  const twelveHoursMs = 12 * 60 * 60 * 1000
  const remainingMs = twelveHoursMs - elapsedMs
  if (remainingMs <= 0) return '0m remaining'
  const hours = Math.floor(remainingMs / (3600 * 1000))
  const minutes = Math.floor((remainingMs % (3600 * 1000)) / (60 * 1000))
  return `${hours}h ${minutes}m remaining`
}
</script>

<template>
  <ContextMenu>
    <ContextMenuTrigger as-child>
      <div 
        ref="rowRef"
        @click="emit('select', item.id)"
        class="flex items-start gap-3 p-3.5 relative cursor-pointer transition-all duration-200 border-b border-gray-100 group select-none"
        :class="[selected ? 'bg-gray-100/70 hover:bg-gray-100/80' : 'bg-white hover:bg-gray-50/80']"
      >
        <!-- Left border selected indicator (Image 2 style: straight 3px green bar) -->
        <div v-if="selected" class="absolute left-0 top-0 bottom-0 w-[3px] bg-[#23B750]"></div>
        
        <!-- Premium Enhanced Hover Shortcuts Overlay (Hidden to allow hovering SLA Late Reply badges and tooltips) -->
        <div class="hidden absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-white/95 backdrop-blur-md border border-gray-250/80 px-2 py-1 rounded-full z-20 transition-all duration-300 opacity-0 translate-x-2 pointer-events-none h-9">
          <!-- Waiting/Clock-sync icon for Reply Required, Checkmark-speech bubble for Waiting -->
          <button 
            type="button"
            @click.stop="emit('toggleSnooze', item)" 
            :title="item.section === 'Reply Required' ? 'Move to Waiting' : 'Move to Reply Now'"
            class="p-1.5 text-[#475569] hover:bg-emerald-50 hover:text-emerald-700 rounded-full transition-all flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 outline-none"
          >
            <!-- Circular Sync Clock Icon for Move to Waiting -->
            <svg v-if="item.section === 'Reply Required'" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21.5 2v6h-6" />
              <path d="M21.34 15.57a10 10 0 1 1-.57-8.38l.73-.73" />
              <path d="M12 7v5l3 2" />
            </svg>
            <!-- Checkmark-infused speech bubble SVG for Reactivate to Reply Now -->
            <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5" />
              <polyline points="16 5 19 8 23 4" />
            </svg>
          </button>

          <!-- Toggle Read/Unread Status Button (Speech bubble with absolute overlaid red dot) -->
          <button 
            type="button"
            @click.stop="emit('toggleUnread', item)" 
            :title="item.unreadCount > 0 ? 'Mark as Read' : 'Mark as Unread'"
            class="p-1.5 rounded-full transition-all flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 outline-none relative group/unreadhover"
            :class="[item.unreadCount > 0 ? 'text-red-700 bg-red-50 hover:bg-red-100 hover:text-red-800' : 'text-[#475569] hover:bg-red-50 hover:text-red-700']"
          >
            <!-- Message bubble icon integrated with red dot -->
            <svg class="w-4 h-4" :class="[item.unreadCount > 0 ? 'fill-red-600/10' : 'group-hover/unreadhover:fill-red-600/10']" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <!-- Dynamic Red Dot overlays message bubble -->
            <span v-if="item.unreadCount > 0" class="absolute top-1 right-1 w-2 h-2 rounded-full border border-white bg-red-500 block transition-transform"></span>
          </button>

          <!-- Context Menu Trigger Button ("...") -->
          <button 
            type="button"
            @click.stop="openContextMenu($event)" 
            title="More Actions..."
            class="p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-full transition-all flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 outline-none"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="1.5"/>
              <circle cx="19" cy="12" r="1.5"/>
              <circle cx="5" cy="12" r="1.5"/>
            </svg>
          </button>
        </div>

        <!-- Avatar with Status Dot (fixed square) -->
        <div class="relative flex-shrink-0 group/avatar w-10 h-10 select-none">
          <img 
            :src="item.avatar" 
            class="w-10 h-10 rounded-full object-cover border border-gray-100 transition-opacity duration-200" 
            :class="[checked ? 'opacity-30' : '']"
            alt="Avatar" 
          />
          <span v-if="item.status === 'online'" class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white bg-[#23B750] transition-opacity" :class="[checked ? 'opacity-0' : '']"></span>
          <span v-else class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white bg-gray-400 transition-opacity" :class="[checked ? 'opacity-0' : '']"></span>
          
          <!-- Checkbox overlay: appears on hover of group/avatar, or is always visible if checked is true -->
          <div 
            @click.stop="emit('toggleCheck', item.id)"
            class="absolute inset-0 flex items-center justify-center rounded-full bg-black/5 cursor-pointer z-10 transition-opacity duration-200"
            :class="[checked ? 'opacity-100' : 'opacity-0 group-hover/avatar:opacity-100']"
          >
            <div 
              class="w-5 h-5 rounded flex items-center justify-center transition-all border"
              :class="[ checked ? 'bg-[#23B750] border-[#23B750] text-white ' : 'bg-white/90 border-gray-300 hover:border-gray-400 text-transparent' ]"
            >
              <svg class="w-3.5 h-3.5 stroke-current stroke-[3.5]" fill="none" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Content Area -->
        <div class="flex-1 min-w-0 flex flex-col">
          <!-- ROW 1: Name, Source icons, attribute icons, workcycle state tag and timestamp -->
          <div class="flex items-center justify-between min-w-0 mb-0.5">
            <!-- Left Side: Name and Icons -->
            <div class="flex items-center min-w-0 shrink">
              <span class="font-bold text-[13px] text-gray-900 truncate shrink-0">{{ item.sender }}</span>
              
              <!-- Metadata Icons beside name -->
              <div class="flex items-center gap-1 ml-1.5 flex-shrink-0">
                <!-- 1. ALWAYS FIRST: Source Platform Icon -->
                <PlatformIcon :platform="item.platform" size="sm" variant="colored" />
      
                <!-- 2. FOLLOWING: VIP Crown -->
                <span v-if="hasIcon(item.icons, 'crown')" title="VIP Account">
                  <svg viewBox="0 0 24 24" class="w-3.5 h-3.5 fill-current text-[#9F5CF8]"><path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5ZM19 19C19 19.55 18.55 20 18 20H6C5.45 20 5 19.55 5 19V18H19V19Z"/></svg>
                </span>
      
                <!-- 3. FOLLOWING: Warning Priority Sign (High, Medium, Low) -->
                <span v-if="hasIcon(item.icons, 'alert')" title="High Priority Alert">
                  <svg viewBox="0 0 24 24" class="w-3.5 h-3.5 fill-none stroke-current stroke-2 text-[#EF4444]"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                </span>
                <span v-else-if="hasIcon(item.icons, 'alert-medium')" title="Medium Priority Alert">
                  <svg viewBox="0 0 24 24" class="w-3.5 h-3.5 fill-none stroke-current stroke-2 text-[#F59E0B]"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                </span>
                <span v-else-if="hasIcon(item.icons, 'alert-low')" title="Low Priority Alert">
                  <svg viewBox="0 0 24 24" class="w-3.5 h-3.5 fill-none stroke-current stroke-2 text-[#9CA3AF]"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                </span>
      
                <!-- 4. FOLLOWING: Archive Box (revived) -->
                <span v-if="hasIcon(item.icons, 'box')" title="Archive Status">
                  <svg viewBox="0 0 24 24" class="w-3.5 h-3.5 fill-none stroke-current stroke-2 text-gray-400"><path d="M21 8V21H3V8"/><path d="M23 3H1V8H23V3Z"/><path d="M10 12H14"/></svg>
                </span>
              </div>

              <!-- 5. ALWAYS LAST IN ADMIN VIEW (Image 2): Assignee Name Tag -->
              <div v-if="viewMode === 'admin'" class="flex items-center gap-1 text-[11px] text-gray-550 ml-2 font-medium bg-gray-50 border border-gray-200/50 px-1.5 py-0.2 rounded shrink-0 select-none">
                <svg class="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span class="text-gray-500 font-semibold">{{ agentOptions.find(a => a.value === item.assignedTo)?.label || (item.assignedTo === 'Liv' ? 'Olivia' : item.assignedTo) }}</span>
              </div>
            </div>

            <!-- Right Side: Workcycle State Badge and Time -->
            <div class="flex items-center gap-1.5 flex-shrink-0 ml-2">
              <!-- Gray Pinned Icon -->
              <svg v-if="item.isPinned" class="w-3.5 h-3.5 text-gray-400 select-none shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" title="Pinned">
                <line x1="12" y1="17" x2="12" y2="22"/>
                <path d="M5 17h14v-1.76a2 2 0 0 0-.44-1.24l-2.78-3.58A2 2 0 0 1 15 9.18V5a3 3 0 0 0-6 0v4.18a2 2 0 0 1-.78 1.24l-2.78 3.58a2 2 0 0 0-.44 1.24z"/>
              </svg>

              <!-- Late Badge -->
              <div 
                v-if="isSlaBreached(item)"
                class="relative group/tooltip flex-shrink-0"
              >
                <span 
                  class="px-[10px] py-[3px] text-[11px] font-bold text-[#B91C1C] bg-[#FDF2F2] border border-[#FDE8E8] rounded-full leading-none select-none"
                >
                  Late
                </span>
                <div class="absolute right-0 top-full mt-1.5 opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-200 bg-gray-900/95 backdrop-blur-md text-white text-[10px] font-semibold py-1 px-2.5 rounded-lg shadow-lg border border-white/10 whitespace-nowrap z-50">
                  {{ getSlaBreachTooltip(item) }}
                </div>
              </div>

              <!-- Focus Badge -->
              <div
                v-if="item.isFocus"
                class="relative group/tooltip flex-shrink-0"
              >
                <span
                  class="inline-flex items-center gap-1 px-[10px] py-[3px] text-[11px] font-semibold text-violet-700 bg-violet-50 border border-violet-100 rounded-full leading-none select-none animate-fade-in"
                >
                  <svg class="w-3.5 h-3.5 text-violet-600 fill-current" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2.5"/>
                    <circle cx="12" cy="12" r="3" fill="currentColor"/>
                  </svg>
                  Focus
                </span>
                <div class="absolute right-0 top-full mt-1.5 opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-200 bg-gray-900/95 backdrop-blur-md text-white text-[10px] font-semibold py-1 px-2.5 rounded-lg shadow-lg border border-white/10 whitespace-nowrap z-50">
                  {{ focusTooltip }}
                </div>
              </div>

              <!-- Time metadata -->
              <span class="text-[11px] text-gray-500 font-medium font-mono whitespace-nowrap leading-none ml-1">{{ item.time }}</span>
            </div>
          </div>
 
          <!-- ROW 1.5: Company Name sub-row (Only inside Admin View Mode - Image 2) -->
          <div v-if="viewMode === 'admin'" class="text-[11px] font-semibold text-gray-400 leading-tight mb-1 select-none">
            KK Steel Sdn Bhd
          </div>
 
          <!-- ROW 2: Message preview and unread count -->
          <div class="flex items-center justify-between min-w-0">
            <!-- Message preview -->
            <div class="min-w-0 truncate pr-2">
              <p class="text-[12px] truncate leading-normal flex items-center gap-1.5" :class="[item.unreadCount > 0 && !item.isUnreadGray && !item.isSnoozed ? 'text-gray-900 font-semibold' : 'text-gray-500 font-normal']">
                <svg v-if="item.isYou" class="w-3.5 h-3.5 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" title="You Replied">
                  <polyline points="9 17 4 12 9 7"/>
                  <path d="M20 18v-2a4 4 0 0 0-4-4H4"/>
                </svg>
                <span class="truncate">{{ item.isYou ? item.message.replace(/^You:\s*/, '') : item.message }}</span>
              </p>
            </div>
            
            <!-- Unread Count Bubble -->
            <div class="flex-shrink-0 flex items-center justify-end min-w-[20px]">
              <span 
                v-if="item.unreadCount > 0"
                class="min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center font-mono leading-none"
                :class="[ (item.isUnreadGray || item.isSnoozed) ? 'bg-gray-400 text-white border-none' : 'bg-[#EF4444] text-white shadow-2xs' ]"
              >
                {{ item.unreadCount }}
              </span>
            </div>
          </div>

          <!-- Inline tags row for tags inside rows (Image 2 bottom tags placement - only inside Admin viewMode) -->
          <div v-if="viewMode === 'admin' && getCustomLabels(item.tags).length > 0" class="flex flex-wrap gap-1.5 mt-2 select-none">
            <span 
              v-for="tag in getCustomLabels(item.tags)" 
              :key="tag"
              class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border"
              :class="[ tag === 'SMEAievent2026' ? 'text-teal-605 bg-teal-50 border-teal-150' : tag === '2026Q2' ? 'text-orange-605 bg-orange-50 border-orange-150' : tag === 'Lead-Nurture' ? 'text-blue-655 bg-blue-50 border-blue-150' : 'text-yellow-605 bg-yellow-50 border-yellow-150' ]"
            >
              <span 
                class="w-1.5 h-1.5 rounded-full"
                :class="[ tag === 'SMEAievent2026' ? 'bg-teal-500' : tag === '2026Q2' ? 'bg-orange-500' : tag === 'Lead-Nurture' ? 'bg-blue-500' : 'bg-yellow-500' ]"
              ></span>
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </ContextMenuTrigger>

    <!-- HIGH-FIDELITY SHADCN CONTEXT MENU CONTENT PANEL -->
    <ContextMenuContent class="w-[230px] bg-white border border-gray-200 rounded-xl p-2 flex flex-col gap-2 select-none z-[9999]">
      
      <!-- TOP ROW: 4 Synced Quick Actions Icons -->
      <div class="grid grid-cols-4 gap-1.5 border-b border-gray-100 pb-2">
        <!-- 1. Mark Read/Unread Icon -->
        <ContextMenuItem
          as-child
          @select="(e) => { e.preventDefault(); emit('contextMenuAction', 'toggle-unread', item); }"
        >
          <button 
            type="button"
            class="flex items-center justify-center p-1.5 rounded-lg transition-all cursor-pointer outline-none relative hover:scale-110 active:scale-95 group/unreadbtn"
            :class="[item.unreadCount > 0 ? 'text-red-700 bg-red-50 hover:bg-red-100 hover:text-red-800' : 'text-[#475569] hover:text-red-700 hover:bg-red-50']"
            :title="item.unreadCount > 0 ? 'Mark as Read' : 'Mark as Unread'"
          >
            <svg class="w-4 h-4" :class="[item.unreadCount > 0 ? 'fill-red-600/10' : 'group-hover/unreadbtn:fill-red-600/10']" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span v-if="item.unreadCount > 0" class="absolute top-1 right-1 w-2 h-2 rounded-full border border-white bg-red-500 block transition-transform"></span>
          </button>
        </ContextMenuItem>

        <!-- 2. Focus / Unfocus Conversation (Swapped) -->
        <ContextMenuItem
          as-child
          @select="(e) => { e.preventDefault(); emit('contextMenuAction', 'toggle-focus', item); }"
        >
          <button 
            type="button"
            class="flex items-center justify-center p-1.5 rounded-lg transition-all cursor-pointer outline-none hover:scale-110 active:scale-95 group/focusbtn"
            :class="[item.isFocus ? 'text-violet-700 bg-violet-50 hover:bg-violet-100 hover:text-violet-800' : 'text-[#475569] hover:text-violet-700 hover:bg-violet-50']"
            :title="item.isFocus ? 'Remove from Focus' : 'Add to Focus'"
          >
            <svg class="w-4 h-4" :class="[item.isFocus ? 'fill-violet-600/10' : 'group-hover/focusbtn:fill-violet-600/10']" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <circle cx="12" cy="12" r="3" :class="[item.isFocus ? 'fill-violet-600' : 'group-hover/focusbtn:fill-violet-600']"/>
            </svg>
          </button>
        </ContextMenuItem>

        <!-- 3. Snooze / Wait Icon -->
        <ContextMenuItem
          as-child
          @select="(e) => { e.preventDefault(); emit('contextMenuAction', 'snooze', item); }"
        >
          <button 
            type="button"
            class="flex items-center justify-center p-1.5 rounded-lg transition-all cursor-pointer outline-none hover:scale-110 active:scale-95"
            :class="[item.isSnoozed ? 'text-blue-700 bg-blue-50' : 'text-[#475569] hover:text-blue-700 hover:bg-blue-50']"
            :title="item.isSnoozed ? 'Unsnooze Thread' : 'Snooze / Wait Thread'"
          >
            <svg class="w-4 h-4" :class="[item.isSnoozed ? 'fill-blue-500/10' : '']" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              <path d="M18.63 13A17.89 17.89 0 0 1 18 8"/>
              <path d="M6.26 6.26A5.86 5.86 0 0 0 6 8v7a3 3 0 0 1-3 3h15"/>
              <path d="m2 2 20 20"/>
              <path d="M10 4a2 2 0 0 1 4 0v.18"/>
            </svg>
          </button>
        </ContextMenuItem>

        <!-- 4. Archive Box Icon -->
        <ContextMenuItem
          as-child
          @select="(e) => { e.preventDefault(); emit('contextMenuAction', 'archive', item); }"
        >
          <button 
            type="button"
            class="flex items-center justify-center p-1.5 rounded-lg text-[#475569] hover:text-orange-700 hover:bg-orange-50 transition-all cursor-pointer outline-none hover:scale-110 active:scale-95"
            title="Archive Conversation"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5" rx="1"/><line x1="10" y1="12" x2="14" y2="12"/>
            </svg>
          </button>
        </ContextMenuItem>
      </div>

      <!-- CUSTOMER PROFILE CARD -->
      <div class="flex items-center gap-2 p-0.5">
        <div class="relative flex-shrink-0">
          <img :src="item.avatar" class="w-8 h-8 rounded-full object-cover border border-gray-150" alt="Avatar" />
          <span class="absolute bottom-0 right-0 w-2 h-2 rounded-full border border-white bg-[#23B750]"></span>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-1 min-w-0">
            <span class="font-bold text-xs text-gray-900 truncate leading-none">{{ item.sender }}</span>
            <svg viewBox="0 0 24 24" class="w-3 h-3 fill-current text-[#25D366] flex-shrink-0"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.455L0 24zm6.59-4.846c1.66.986 3.298 1.504 5.353 1.505 5.503 0 9.977-4.477 9.98-9.983.002-2.667-1.031-5.176-2.909-7.054C17.195 1.745 14.69 .713 12.012.713c-5.51 0-9.985 4.479-9.988 9.987-.001 2.148.567 4.24 1.644 6.1 l-.995 3.635 3.737-.981zm11.393-7.513c-.3-.15-1.77-.874-2.043-.974-.275-.1-.475-.15-.675.15-.2.3-.775.974-.95 1.174-.175.2-.35.225-.65.075-1.02-.513-1.695-.97-2.368-2.128-.176-.3-.176-.5-.075-.65.09-.137.2-.238.3-.35.1-.1.125-.2.187-.3.063-.1.031-.2-.013-.3-.044-.1-.4-.974-.55-1.324-.145-.35-.29-.303-.4-.308-.104-.005-.224-.005-.344-.005-.12 0-.315.04-.48.22-.165.18-.63.616-.63 1.503 0 .887.645 1.744.735 1.87.09.124 1.27 1.94 3.076 2.718.428.188.764.3 1.024.384.43.137.82.117 1.13.07.34-.05.177-.874.243-1.124.066-.25-.09-.387-.29-.537z"/></svg>
          </div>
          <div class="flex items-center gap-1 mt-0.5 text-[10px] text-gray-500 font-medium">
            <span>+6012 3456 7890</span>
            <button 
              type="button"
              @click.stop="copyToClipboard('+6012 3456 7890', 'phone')"
              title="Copy Phone Number"
              class="p-0.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded cursor-pointer transition-colors outline-none"
            >
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- ATTRIBUTE CONFIGURATION FIELDS (Restored visual left icons & Radix Submenus) -->
      <div class="flex flex-col gap-0.5 border-t border-b border-gray-100 py-1.5">
        
        <!-- PRIORITY SUBMENU -->
        <ContextMenuSub>
          <ContextMenuSubTrigger class="flex items-center justify-between w-full px-1.5 py-1 text-[11px] font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer outline-none focus:bg-gray-50 data-[state=open]:bg-gray-50">
            <div class="flex-1 flex items-center justify-between min-w-0 mr-1">
              <div class="flex items-center gap-2 text-gray-500 font-semibold select-none">
                <svg class="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                <span>Priority</span>
              </div>
              <div class="flex items-center gap-1 pr-0.5 shrink-0">
                <div v-if="hasIcon(item.icons, 'alert')" class="inline-flex items-center gap-1 px-1.5 py-0 rounded-full border border-gray-200 bg-white text-[10px] font-bold text-gray-700 select-none shadow-none leading-none h-5 animate-fade-in">
                  <svg viewBox="0 0 24 24" class="w-2.5 h-2.5 fill-none stroke-[#9CA3AF] stroke-[3]"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  <span>High</span>
                </div>
                <div v-else-if="hasIcon(item.icons, 'alert-medium')" class="inline-flex items-center gap-1 px-1.5 py-0 rounded-full border border-gray-200 bg-white text-[10px] font-bold text-gray-700 select-none shadow-none leading-none h-5 animate-fade-in">
                  <svg viewBox="0 0 24 24" class="w-2.5 h-2.5 fill-none stroke-[#9CA3AF] stroke-[3]"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  <span>Medium</span>
                </div>
                <div v-else-if="hasIcon(item.icons, 'alert-low')" class="inline-flex items-center gap-1 px-1.5 py-0 rounded-full border border-gray-200 bg-white text-[10px] font-bold text-gray-700 select-none shadow-none leading-none h-5 animate-fade-in">
                  <svg viewBox="0 0 24 24" class="w-2.5 h-2.5 fill-none stroke-[#9CA3AF] stroke-[3]"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  <span>Low</span>
                </div>
                <span v-else class="text-gray-400 font-medium text-[10px]">Normal</span>
              </div>
            </div>
          </ContextMenuSubTrigger>
          <ContextMenuSubContent class="w-[180px] bg-white border border-gray-200 rounded-lg p-1 flex flex-col gap-0.5 z-[10000]">
            <ContextMenuLabel class="px-2 py-0.5 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Priority</ContextMenuLabel>
            <ContextMenuItem
              @select="(e) => { e.preventDefault(); emit('contextMenuUpdateAttribute', 'priority', 'High', item); }"
              class="flex items-center justify-between w-full px-2 py-1.5 rounded-md hover:bg-gray-50 transition-colors text-left cursor-pointer outline-none border border-transparent"
              :class="[hasIcon(item.icons, 'alert') ? 'bg-red-50/40 border border-red-100' : '']"
            >
              <div class="flex items-center gap-2">
                <svg viewBox="0 0 24 24" class="w-3.5 h-3.5 fill-none stroke-current stroke-2 text-[#EF4444]"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                <span class="text-[11px] font-bold text-gray-900">High</span>
              </div>
              <svg v-if="hasIcon(item.icons, 'alert')" class="w-3 h-3 text-[#EF4444] stroke-current stroke-[3]" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12"/></svg>
            </ContextMenuItem>
            
            <ContextMenuItem
              @select="(e) => { e.preventDefault(); emit('contextMenuUpdateAttribute', 'priority', 'Medium', item); }"
              class="flex items-center justify-between w-full px-2 py-1.5 rounded-md hover:bg-gray-50 transition-colors text-left cursor-pointer outline-none border border-transparent"
              :class="[hasIcon(item.icons, 'alert-medium') ? 'bg-orange-50/40 border border-orange-100' : '']"
            >
              <div class="flex items-center gap-2">
                <svg viewBox="0 0 24 24" class="w-3.5 h-3.5 fill-none stroke-current stroke-2 text-[#F59E0B]"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                <span class="text-[11px] font-bold text-gray-900">Medium</span>
              </div>
              <svg v-if="hasIcon(item.icons, 'alert-medium')" class="w-3 h-3 text-[#F59E0B] stroke-current stroke-[3]" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12"/></svg>
            </ContextMenuItem>

            <ContextMenuItem
              @select="(e) => { e.preventDefault(); emit('contextMenuUpdateAttribute', 'priority', 'Low', item); }"
              class="flex items-center justify-between w-full px-2 py-1.5 rounded-md hover:bg-gray-50 transition-colors text-left cursor-pointer outline-none border border-transparent"
              :class="[hasIcon(item.icons, 'alert-low') ? 'bg-gray-50 border border-gray-150' : '']"
            >
              <div class="flex items-center gap-2">
                <svg viewBox="0 0 24 24" class="w-3.5 h-3.5 fill-none stroke-[#9CA3AF] stroke-2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                <span class="text-[11px] font-bold text-gray-900">Low</span>
              </div>
              <svg v-if="hasIcon(item.icons, 'alert-low')" class="w-3 h-3 text-[#9CA3AF] stroke-current stroke-[3]" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12"/></svg>
            </ContextMenuItem>

            <ContextMenuSeparator class="bg-gray-100 my-0.5" />

            <ContextMenuItem
              @select="(e) => { e.preventDefault(); emit('contextMenuUpdateAttribute', 'priority', 'Normal', item); }"
              class="flex items-center justify-between w-full px-2 py-1.5 rounded-md hover:bg-gray-50 transition-colors text-left cursor-pointer outline-none border border-transparent"
              :class="[!hasIcon(item.icons, 'alert') && !hasIcon(item.icons, 'alert-medium') && !hasIcon(item.icons, 'alert-low') ? 'bg-gray-50 border border-gray-150' : '']"
            >
              <span class="text-[11px] font-bold text-gray-900 pl-5.5">Normal Priority</span>
              <svg v-if="!hasIcon(item.icons, 'alert') && !hasIcon(item.icons, 'alert-medium') && !hasIcon(item.icons, 'alert-low')" class="w-3 h-3 text-gray-550 stroke-current stroke-[3]" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12"/></svg>
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        <!-- VIP ROW -->
        <ContextMenuSub>
          <ContextMenuSubTrigger class="flex items-center justify-between w-full px-1.5 py-1 text-[11px] font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer outline-none focus:bg-gray-50 data-[state=open]:bg-gray-50">
            <div class="flex-1 flex items-center justify-between min-w-0 mr-1">
              <div class="flex items-center gap-2 text-gray-500 font-semibold select-none">
                <svg class="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5z"/>
                  <path d="M19 19H5v-1h14v1z"/>
                </svg>
                <span>VIP</span>
              </div>
              <div class="flex items-center gap-1 pr-0.5 shrink-0">
                <div v-if="hasIcon(item.icons, 'crown')" class="w-5 h-5 flex items-center justify-center rounded-full border border-gray-200 bg-white shadow-none select-none animate-fade-in">
                  <svg viewBox="0 0 24 24" class="w-2.5 h-2.5 fill-[#9CA3AF]"><path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5z"/><path d="M19 19H5v-1h14v1z"/></svg>
                </div>
                <span v-else class="text-gray-400 font-medium text-[10px]">No</span>
              </div>
            </div>
          </ContextMenuSubTrigger>
          <ContextMenuSubContent class="w-[180px] bg-white border border-gray-200 rounded-lg p-1 flex flex-col gap-0.5 z-[10000]">
            <ContextMenuLabel class="px-2 py-0.5 text-[9px] font-bold text-gray-400 uppercase tracking-wider">VIP Status</ContextMenuLabel>
            <ContextMenuItem
              @select="(e) => { e.preventDefault(); emit('contextMenuUpdateAttribute', 'vip', true, item); }"
              class="flex items-center justify-between w-full px-2 py-1.5 rounded-md hover:bg-gray-50 transition-colors text-left cursor-pointer outline-none border border-transparent"
              :class="[hasIcon(item.icons, 'crown') ? 'bg-purple-50/40 border border-purple-100' : '']"
            >
              <div class="flex items-center gap-2">
                <svg viewBox="0 0 24 24" class="w-3.5 h-3.5 fill-current text-[#9F5CF8]"><path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5ZM19 19C19 19.55 18.55 20 18 20H6C5.45 20 5 19.55 5 19V18H19V19Z"/></svg>
                <span class="text-[11px] font-bold text-gray-900">VIP Client</span>
              </div>
              <svg v-if="hasIcon(item.icons, 'crown')" class="w-3 h-3 text-[#9F5CF8] stroke-current stroke-[3]" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12"/></svg>
            </ContextMenuItem>

            <ContextMenuItem
              @select="(e) => { e.preventDefault(); emit('contextMenuUpdateAttribute', 'vip', false, item); }"
              class="flex items-center justify-between w-full px-2 py-1.5 rounded-md hover:bg-gray-50 transition-colors text-left cursor-pointer outline-none border border-transparent"
              :class="[!hasIcon(item.icons, 'crown') ? 'bg-gray-50 border border-gray-150' : '']"
            >
              <div class="flex items-center gap-2">
                <svg class="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M6 18L18 6M6 6l12 12"/></svg>
                <span class="text-[11px] font-bold text-gray-900">Regular Client</span>
              </div>
              <svg v-if="!hasIcon(item.icons, 'crown')" class="w-3 h-3 text-gray-455 stroke-current stroke-[3]" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12"/></svg>
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        <!-- TEMPERATURE ROW -->
        <ContextMenuSub>
          <ContextMenuSubTrigger class="flex items-center justify-between w-full px-1.5 py-1 text-[11px] font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer outline-none focus:bg-gray-50 data-[state=open]:bg-gray-50">
            <div class="flex-1 flex items-center justify-between min-w-0 mr-1">
              <div class="flex items-center gap-2 text-gray-500 font-semibold select-none">
                <svg class="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
                </svg>
                <span>Temperature</span>
              </div>
              <div class="flex items-center gap-1 pr-0.5 shrink-0">
                <div v-if="item.tags && item.tags.includes('VIP-Tier')" class="inline-flex items-center gap-1 px-1.5 py-0 rounded-full border border-gray-200 bg-white text-[10px] font-bold text-gray-700 select-none shadow-none leading-none h-5 animate-fade-in">
                  <svg class="w-2.5 h-2.5 fill-[#EF4444]" viewBox="0 0 24 24"><path d="M12 2C12 2 17 6.5 17 11.5c0 2.5-2 4.5-4.5 4.5S8 14 8 11.5C8 6.5 12 2 12 2zm-1.5 16c0 1.93 1.57 3.5 3.5 3.5s3.5-1.57 3.5-3.5h-7z"/></svg>
                  <span>Hot</span>
                </div>
                <div v-else-if="item.tags && item.tags.includes('Temp-Warm')" class="inline-flex items-center gap-1 px-1.5 py-0 rounded-full border border-gray-200 bg-white text-[10px] font-bold text-gray-700 select-none shadow-none leading-none h-5 animate-fade-in">
                  <svg class="w-2.5 h-2.5 fill-[#F59E0B]" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/></svg>
                  <span>Warm</span>
                </div>
                <div v-else-if="item.tags && item.tags.includes('Temp-Cold')" class="inline-flex items-center gap-1 px-1.5 py-0 rounded-full border border-gray-200 bg-white text-[10px] font-bold text-gray-700 select-none shadow-none leading-none h-5 animate-fade-in">
                  <svg class="w-2.5 h-2.5 text-[#3B82F6] fill-none stroke-current stroke-[2.5]" viewBox="0 0 24 24"><line x1="12" y1="2" x2="12" y2="22"/><line x1="17" y1="5" x2="7" y2="19"/><line x1="19" y1="12" x2="5" y2="12"/><line x1="17" y1="19" x2="7" y2="5"/></svg>
                  <span>Cold</span>
                </div>
                <span v-else class="text-gray-400 font-medium text-[10px]">None</span>
              </div>
            </div>
          </ContextMenuSubTrigger>
          <ContextMenuSubContent class="w-[180px] bg-white border border-gray-200 rounded-lg p-1 flex flex-col gap-0.5 z-[10000]">
            <ContextMenuLabel class="flex items-center justify-between px-2 py-0.5 text-[9px] font-bold text-gray-400 uppercase tracking-wider select-none">
              <span>Temperature</span>
              <button 
                type="button"
                @click.stop="emit('contextMenuUpdateAttribute', 'temperature', 'Reset', item)"
                title="Reset Temperature"
                class="p-0.5 hover:bg-gray-100 hover:text-gray-905 rounded transition-colors cursor-pointer outline-none shrink-0"
              >
                <svg class="w-3 h-3 text-gray-500 hover:text-gray-805" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21.5 2v6h-6" />
                  <path d="M21.34 15.57a10 10 0 1 1-.57-8.38l.73-.73" />
                </svg>
              </button>
            </ContextMenuLabel>
            <ContextMenuItem
              @select="(e) => { e.preventDefault(); emit('contextMenuUpdateAttribute', 'temperature', 'Hot', item); }"
              class="flex items-center justify-between w-full px-2 py-1.5 rounded-md hover:bg-gray-50 transition-colors text-left cursor-pointer outline-none border border-transparent"
              :class="[item.tags && item.tags.includes('VIP-Tier') ? 'bg-red-50/40 border border-red-100' : '']"
            >
              <div class="flex items-center gap-2">
                <svg class="w-3.5 h-3.5 fill-current text-[#EF4444]" viewBox="0 0 24 24"><path d="M12 2C12 2 17 6.5 17 11.5c0 2.5-2 4.5-4.5 4.5S8 14 8 11.5C8 6.5 12 2 12 2zm-1.5 16c0 1.93 1.57 3.5 3.5 3.5s3.5-1.57 3.5-3.5h-7z"/></svg>
                <span class="text-[11px] font-bold text-gray-900">Hot Lead</span>
              </div>
              <svg v-if="item.tags && item.tags.includes('VIP-Tier')" class="w-3 h-3 text-[#EF4444] stroke-current stroke-[3]" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12"/></svg>
            </ContextMenuItem>

            <ContextMenuItem
              @select="(e) => { e.preventDefault(); emit('contextMenuUpdateAttribute', 'temperature', 'Warm', item); }"
              class="flex items-center justify-between w-full px-2 py-1.5 rounded-md hover:bg-gray-50 transition-colors text-left cursor-pointer outline-none border border-transparent"
              :class="[item.tags && item.tags.includes('Temp-Warm') ? 'bg-yellow-50/40 border border-yellow-100' : '']"
            >
              <div class="flex items-center gap-2">
                <svg class="w-3.5 h-3.5 fill-current text-[#F59E0B]" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/></svg>
                <span class="text-[11px] font-bold text-gray-900">Warm Lead</span>
              </div>
              <svg v-if="item.tags && item.tags.includes('Temp-Warm')" class="w-3 h-3 text-[#F59E0B] stroke-current stroke-[3]" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12"/></svg>
            </ContextMenuItem>

            <ContextMenuItem
              @select="(e) => { e.preventDefault(); emit('contextMenuUpdateAttribute', 'temperature', 'Cold', item); }"
              class="flex items-center justify-between w-full px-2 py-1.5 rounded-md hover:bg-gray-50 transition-colors text-left cursor-pointer outline-none border border-transparent"
              :class="[item.tags && item.tags.includes('Temp-Cold') ? 'bg-blue-50/40 border border-blue-100' : '']"
            >
              <div class="flex items-center gap-2">
                <svg class="w-3.5 h-3.5 text-[#3B82F6] stroke-current stroke-2" fill="none" viewBox="0 0 24 24"><line x1="12" y1="2" x2="12" y2="22"/><line x1="17" y1="5" x2="7" y2="19"/><line x1="19" y1="12" x2="5" y2="12"/><line x1="17" y1="19" x2="7" y2="5"/></svg>
                <span class="text-[11px] font-bold text-gray-900">Cold Lead</span>
              </div>
              <svg v-if="item.tags && item.tags.includes('Temp-Cold')" class="w-3 h-3 text-[#3B82F6] stroke-current stroke-[3]" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12"/></svg>
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        <!-- AGENT ASSIGNEE ROW -->
        <ContextMenuSub>
          <ContextMenuSubTrigger class="flex items-center justify-between w-full px-1.5 py-1 text-[11px] font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer outline-none focus:bg-gray-50 data-[state=open]:bg-gray-50">
            <div class="flex-1 flex items-center justify-between min-w-0 mr-1">
              <div class="flex items-center gap-2 text-gray-500 font-semibold select-none">
                <svg class="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <span>Agent</span>
              </div>
              <div class="flex items-center gap-1 pr-0.5 shrink-0">
                <div class="inline-flex items-center gap-1 px-1.5 py-0 rounded-full border border-gray-200 bg-white text-[10px] font-bold text-gray-700 select-none shadow-none leading-none h-5 animate-fade-in">
                  <div class="w-3 h-3 rounded-full bg-gray-100 flex items-center justify-center font-extrabold text-[7px] text-gray-600 border border-gray-200 shrink-0 select-none">
                    {{ agentOptions.find(a => a.value === item.assignedTo)?.avatar || 'UN' }}
                  </div>
                  <span>{{ agentOptions.find(a => a.value === item.assignedTo)?.label || (item.assignedTo === 'Liv' ? 'Olivia' : item.assignedTo) }}</span>
                </div>
              </div>
            </div>
          </ContextMenuSubTrigger>
          <ContextMenuSubContent class="w-[210px] bg-white border border-gray-150 rounded-xl p-1.5 flex flex-col gap-1 shadow-lg z-[10000]">
            <div class="px-2 py-0.5 flex items-center justify-between">
              <span class="text-[9px] font-bold text-gray-400 uppercase tracking-wider select-none">Assign Agent</span>
              <span class="text-[9px] text-gray-400 font-medium font-mono select-none">{{ filteredAgentOptions.length }}</span>
            </div>
            
            <!-- Search input for Agent search -->
            <div class="px-1 py-0.5" @click.stop @mousedown.stop @keydown.stop>
              <div class="relative">
                <svg class="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input 
                  v-model="agentSearchQuery"
                  type="text" 
                  placeholder="Search agent..." 
                  class="w-full pl-7 pr-5 py-1 text-[11px] bg-gray-50 border border-gray-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#23B750] focus:border-[#23B750] transition-all placeholder:text-gray-400 font-medium"
                />
                <button 
                  v-if="agentSearchQuery"
                  type="button"
                  @click="agentSearchQuery = ''"
                  class="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
                >
                  <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Agent options list -->
            <div class="max-h-[170px] overflow-y-auto flex flex-col gap-0.5 scrollbar-thin">
              <ContextMenuItem
                v-for="agent in filteredAgentOptions"
                :key="agent.value"
                @select="(e) => { e.preventDefault(); emit('contextMenuUpdateAttribute', 'agent', agent.value, item); }"
                class="flex items-center justify-between w-full px-2 py-1.5 rounded-md hover:bg-gray-50 transition-colors text-left cursor-pointer outline-none border border-transparent"
                :class="item.assignedTo === agent.value ? 'bg-green-50/50 border-green-100 text-emerald-950 font-semibold' : 'text-[#334155]'"
              >
                <div class="flex items-center gap-2 min-w-0">
                  <div class="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[9px] text-gray-600 border border-gray-200 shrink-0">
                    {{ agent.avatar }}
                  </div>
                  <div class="flex flex-col min-w-0">
                    <span class="text-[11px] font-bold truncate leading-tight">{{ agent.label }}</span>
                    <span v-if="agent.role" class="text-[9px] text-gray-400 font-normal leading-tight truncate">{{ agent.role }}</span>
                  </div>
                </div>
                <svg v-if="item.assignedTo === agent.value" class="w-3 h-3 text-[#23B750] stroke-current stroke-[3] shrink-0" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12"/></svg>
              </ContextMenuItem>

              <!-- Empty state if no search matches -->
              <div v-if="filteredAgentOptions.length === 0" class="py-3 text-center text-[10px] text-gray-400 select-none">
                No agents matching "<span class="font-semibold text-gray-600">{{ agentSearchQuery }}</span>"
              </div>
            </div>
          </ContextMenuSubContent>
        </ContextMenuSub>

        <!-- NEW CUSTOM LABEL SECTION -->
        <ContextMenuSub>
          <ContextMenuSubTrigger class="flex items-center justify-between w-full px-1.5 py-1 text-[11px] font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer outline-none focus:bg-gray-50 data-[state=open]:bg-gray-50">
            <div class="flex-1 flex items-center justify-between min-w-0 mr-1">
              <div class="flex items-center gap-2 text-gray-500 font-semibold select-none">
                <svg class="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                  <line x1="7" y1="7" x2="7.01" y2="7"/>
                </svg>
                <span>Custom Label</span>
              </div>
              <div class="flex items-center gap-1 pr-0.5 shrink-0">
                <div v-if="getCustomLabels(item.tags).length > 0" class="inline-flex items-center gap-1 px-1.5 py-0 rounded-full border border-gray-200 bg-white text-[10px] font-bold text-gray-700 select-none shadow-none leading-none h-5 animate-fade-in">
                  <span>{{ getCustomLabels(item.tags).length }} Label{{ getCustomLabels(item.tags).length > 1 ? 's' : '' }}</span>
                </div>
                <span v-else class="text-gray-400 font-medium text-[10px]">None</span>
              </div>
            </div>
          </ContextMenuSubTrigger>
          <ContextMenuSubContent 
            @click.stop
            @mousedown.stop
            @keydown.stop
            class="w-[200px] bg-white border border-gray-150 rounded-lg p-2.5 flex flex-col gap-2.5 shadow-md z-[10000]"
          >
            <ContextMenuLabel class="px-0 py-0 text-[9px] font-bold text-gray-400 uppercase tracking-wider select-none">Custom Labels</ContextMenuLabel>
            
            <div class="flex flex-col gap-1 select-none">
              <span class="text-[8px] font-bold text-gray-400 uppercase tracking-wider block">Active Tags</span>
              <div v-if="getCustomLabels(item.tags).length > 0" class="flex flex-wrap gap-1 max-h-[110px] overflow-y-auto p-1 border border-gray-100 rounded-lg bg-gray-50/50">
                <span 
                  v-for="tag in getCustomLabels(item.tags)" 
                  :key="tag"
                  class="inline-flex items-center gap-0.5 px-1.5 py-0 rounded-full text-[9px] font-bold border border-gray-200 bg-white text-gray-705"
                >
                  <span>{{ tag }}</span>
                  <button 
                    type="button"
                    @click.stop="emit('contextMenuUpdateAttribute', 'remove-tag', tag, item)" 
                    class="p-0.5 hover:bg-gray-100 hover:text-red-500 rounded-full transition-colors cursor-pointer outline-none"
                  >
                    <svg class="w-2 h-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                      <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              </div>
              <div v-else class="text-[10px] text-gray-400 italic text-center py-3 bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
                No custom labels yet.
              </div>
            </div>

            <div class="flex flex-col gap-1.5 mt-0.5">
              <label class="text-[8px] font-bold text-gray-400 uppercase tracking-wider block select-none">Create New Label</label>
              <div class="relative">
                <input 
                  v-model="newTagInput"
                  @keydown.enter.prevent="addTag"
                  type="text"
                  placeholder="Type label..."
                  class="w-full text-[10px] bg-gray-50 border border-gray-250 rounded-lg px-2 py-1 pr-6 focus:outline-none focus:ring-2 focus:ring-[#23B750]/30 focus:border-[#23B750] font-semibold text-gray-750 placeholder-gray-400"
                />
                <button 
                  type="button"
                  @click.stop="addTag"
                  class="absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-[#23B750] transition-colors cursor-pointer outline-none"
                >
                  <svg class="w-3.5 h-3.5 stroke-current stroke-[2.5]" fill="none" viewBox="0 0 24 24">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
              </div>
            </div>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </div>

      <!-- GENERAL ACTIONS LIST -->
      <div class="flex flex-col gap-0.5">
        <!-- Pin / Unpin Conversation -->
        <ContextMenuItem 
          @select="(e) => { e.preventDefault(); emit('contextMenuAction', 'toggle-pin', item); }"
          class="w-full text-left px-1.5 py-1 text-[11px] font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer flex items-center gap-2 outline-none focus:bg-gray-50 focus:text-gray-700"
        >
          <svg class="w-3.5 h-3.5" :class="[item.isPinned ? 'text-[#23B750] fill-[#23B750]/20' : 'text-gray-400']" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="17" x2="12" y2="22"/>
            <path d="M5 17h14v-1.76a2 2 0 0 0-.44-1.24l-2.78-3.58A2 2 0 0 1 15 9.18V5a3 3 0 0 0-6 0v4.18a2 2 0 0 1-.78 1.24l-2.78 3.58a2 2 0 0 0-.44 1.24z"/>
          </svg>
          <span>{{ item.isPinned ? 'Unpin Conversation' : 'Pin Conversation' }}</span>
        </ContextMenuItem>


        <!-- Open in new tab -->
        <ContextMenuItem 
          @select="(e) => { e.preventDefault(); emit('contextMenuAction', 'open-new-tab', item); }"
          class="w-full text-left px-1.5 py-1 text-[11px] font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer flex items-center gap-2 outline-none focus:bg-gray-50 focus:text-gray-700"
        >
          <svg class="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          <span>Open in new tab</span>
        </ContextMenuItem>

        <!-- Copy conversation link -->
        <ContextMenuItem 
          @select="(e) => { e.preventDefault(); copyToClipboard('https://rakansales.com/omni/' + item.id, 'link'); }"
          class="w-full text-left px-1.5 py-1 text-[11px] font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer flex items-center gap-2 outline-none focus:bg-gray-50 focus:text-gray-700"
        >
          <svg class="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
          <span>Copy conversation link</span>
        </ContextMenuItem>

        <!-- Mark as Spam -->
        <ContextMenuItem 
          @select="(e) => { e.preventDefault(); emit('contextMenuAction', 'mark-spam', item); }"
          class="w-full text-left px-1.5 py-1 text-[11px] font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer flex items-center gap-2 border-t border-gray-100 mt-0.5 pt-1 outline-none focus:bg-gray-50 focus:text-gray-700"
        >
          <svg class="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          <span>Mark as Spam</span>
        </ContextMenuItem>

        <!-- Delete Conversation -->
        <ContextMenuItem 
          @select="(e) => { e.preventDefault(); emit('contextMenuAction', 'delete', item); }"
          class="w-full text-left px-1.5 py-1 text-[11px] font-semibold text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer flex items-center gap-2 outline-none focus:bg-red-50/50 focus:text-red-500"
        >
          <svg class="w-3.5 h-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
          </svg>
          <span>Delete Conversation</span>
        </ContextMenuItem>
      </div>

    </ContextMenuContent>
  </ContextMenu>
</template>

<style scoped>
.text-teal-605 { color: #0f766e; }
.text-orange-605 { color: #c2410c; }
.text-purple-605 { color: #6d28d9; }
.text-blue-655 { color: #1d4ed8; }
.text-yellow-605 { color: #a16207; }

/* Pulsing text glow effect */
.animate-pulse-glow {
  box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
  animation: pulse-glow 2s infinite;
}

@keyframes pulse-glow {
  0% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.5);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(239, 68, 68, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
  }
}
</style>
