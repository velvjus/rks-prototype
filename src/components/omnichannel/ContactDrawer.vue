<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useRouter } from 'vue-router'
import {
  Crown, MoreVertical, Phone, Mail, Building2, Globe, List, LayoutGrid, ChevronRight,
  ChevronDown, X, Link2, MapPin, Tag, Briefcase, Clock, Users, MessageSquare, Calendar,
  Flame, AlertTriangle, Plus, Sparkles, Info, Copy, Trash2, Download, ShieldAlert, Check
} from 'lucide-vue-next'

import type { Conversation } from '@/components/omnichannel/ConversationItem.vue'
import PlatformIcon from '@/components/omnichannel/PlatformIcon.vue'

const props = defineProps<{
  activeConversation: Conversation
  scratchNote: string
  availableTags: string[]
}>()

const emit = defineEmits<{
  (e: 'update:scratchNote', value: string): void
  (e: 'saveNote'): void
  (e: 'addTag', tag: string): void
  (e: 'removeTag', tag: string): void
  (e: 'close'): void
  (e: 'toggleSnooze'): void
  (e: 'toggleResolve'): void
  (e: 'toast', message: string, type?: 'success' | 'info' | 'warning'): void
}>()

const router = useRouter()

// View Mode state ('grid' = stylized card layout, 'list' = compact, high-density key-value layout)
const viewMode = ref<'grid' | 'list'>('grid')

// Accordion Expand/Collapse Switch States
const isConversationInfoOpen = ref(true)
const isDealInfoOpen = ref(true)
const isCompanyInfoOpen = ref(true)  // Default Open as requested
const isActionsOpen = ref(false)     // Default Closed for optimal progressive disclosure

// Assignee Custom Dropdown
const isAssigneeDropdownOpen = ref(false)
const assigneeDropdownRef = ref<HTMLElement | null>(null)

onClickOutside(assigneeDropdownRef, () => {
  isAssigneeDropdownOpen.value = false
})

// Kebab Menu Dropdown (MoreVertical)
const isKebabOpen = ref(false)
const kebabRef = ref<HTMLElement | null>(null)
const isDeleteContactModalOpen = ref(false)

onClickOutside(kebabRef, () => {
  isKebabOpen.value = false
})

// ==========================================
// VIP TOGGLEABLE STATE (Directly synced with activeConversation.icons)
// ==========================================
const isVipActive = computed(() => {
  return props.activeConversation?.icons?.includes('crown') || false
})

const toggleVip = () => {
  if (!props.activeConversation) return
  if (!props.activeConversation.icons) {
    props.activeConversation.icons = []
  }
  const hasVip = props.activeConversation.icons.includes('crown')
  if (hasVip) {
    props.activeConversation.icons = props.activeConversation.icons.filter(i => i !== 'crown')
    emit('toast', `${profile.value.name} unmarked as VIP`, 'info')
  } else {
    props.activeConversation.icons.push('crown')
    emit('toast', `${profile.value.name} marked as VIP contact`, 'success')
  }
}

// ==========================================
// SOURCE, TEMPERATURE, PRIORITY DROPDOWNS (Directly synced with activeConversation)
// ==========================================

// Source (Platform) State
const isSourceDropdownOpen = ref(false)
const sourceDropdownRef = ref<HTMLElement | null>(null)
onClickOutside(sourceDropdownRef, () => {
  isSourceDropdownOpen.value = false
})

const currentSource = computed(() => {
  return props.activeConversation?.platform || 'WhatsApp'
})

const sourceOptions = [
  { label: 'WhatsApp', key: 'WhatsApp', color: 'border-green-200 bg-green-50/80 text-green-700 hover:bg-green-100/90' },
  { label: 'Messenger', key: 'Messenger', color: 'border-blue-200 bg-blue-50/80 text-blue-700 hover:bg-blue-100/90' },
  { label: 'Instagram', key: 'Instagram', color: 'border-pink-200 bg-pink-50/80 text-pink-700 hover:bg-pink-100/90' },
  { label: 'Telegram', key: 'Telegram', color: 'border-cyan-200 bg-cyan-50/80 text-cyan-700 hover:bg-cyan-100/90' },
  { label: 'LinkedIn', key: 'LinkedIn', color: 'border-blue-200 bg-blue-50/80 text-blue-700 hover:bg-blue-100/90' },
  { label: 'Email', key: 'Mail', color: 'border-purple-200 bg-purple-50/80 text-purple-700 hover:bg-purple-100/90' },
  { label: 'Live Chat', key: 'LiveChat', color: 'border-emerald-200 bg-emerald-50/80 text-emerald-700 hover:bg-emerald-100/90' },
  { label: 'Facebook', key: 'Facebook', color: 'border-blue-200 bg-blue-50/80 text-blue-700 hover:bg-blue-100/90' }
]

const setSource = (src: string) => {
  if (props.activeConversation) {
    props.activeConversation.platform = src
    emit('toast', `Source platform updated to ${src}`, 'success')
  }
  isSourceDropdownOpen.value = false
}

// Temperature State (Synced with tags: VIP-Tier -> Hot, Temp-Warm -> Warm, Temp-Cold -> Cold)
const isTempDropdownOpen = ref(false)
const tempDropdownRef = ref<HTMLElement | null>(null)
onClickOutside(tempDropdownRef, () => {
  isTempDropdownOpen.value = false
})

const currentTemperature = computed(() => {
  const tags = props.activeConversation?.tags || []
  if (tags.includes('VIP-Tier')) return 'Hot'
  if (tags.includes('Temp-Warm')) return 'Warm'
  if (tags.includes('Temp-Cold')) return 'Cold'
  return 'Hot'
})

const tempOptions = [
  { label: 'Hot', key: 'Hot', color: 'border-orange-200 bg-orange-50/80 text-orange-700 hover:bg-orange-100/90', icon: 'Flame' },
  { label: 'Warm', key: 'Warm', color: 'border-amber-200 bg-amber-50/80 text-amber-700 hover:bg-amber-100/90', icon: 'Sparkles' },
  { label: 'Cold', key: 'Cold', color: 'border-cyan-200 bg-cyan-50/80 text-cyan-700 hover:bg-cyan-100/90', icon: 'Sparkles' }
]

const setTemperature = (temp: string) => {
  if (!props.activeConversation) return
  if (!props.activeConversation.tags) {
    props.activeConversation.tags = []
  }
  // Clear previous temperature tags
  props.activeConversation.tags = props.activeConversation.tags.filter(
    t => t !== 'VIP-Tier' && t !== 'Temp-Warm' && t !== 'Temp-Cold'
  )
  if (temp === 'Hot') {
    props.activeConversation.tags.push('VIP-Tier')
  } else if (temp === 'Warm') {
    props.activeConversation.tags.push('Temp-Warm')
  } else if (temp === 'Cold') {
    props.activeConversation.tags.push('Temp-Cold')
  }
  emit('toast', `Lead temperature set to ${temp}`, 'success')
  isTempDropdownOpen.value = false
}

// Priority State (Synced with icons: alert -> High, alert-medium -> Medium, alert-low -> Low)
const isPriorityDropdownOpen = ref(false)
const priorityDropdownRef = ref<HTMLElement | null>(null)
onClickOutside(priorityDropdownRef, () => {
  isPriorityDropdownOpen.value = false
})

const currentPriority = computed(() => {
  const icons = props.activeConversation?.icons || []
  if (icons.includes('alert')) return 'High'
  if (icons.includes('alert-medium')) return 'Medium'
  if (icons.includes('alert-low')) return 'Low'
  return 'Normal'
})

const priorityOptions = [
  { label: 'High / Urgent', key: 'High', color: 'border-red-200 bg-red-50/80 text-red-700 hover:bg-red-100/90' },
  { label: 'Medium', key: 'Medium', color: 'border-yellow-200 bg-yellow-50/80 text-yellow-800 hover:bg-yellow-100/90' },
  { label: 'Low', key: 'Low', color: 'border-gray-200 bg-gray-50/80 text-gray-600 hover:bg-gray-100/90' }
]

const setPriority = (pri: string) => {
  if (!props.activeConversation) return
  if (!props.activeConversation.icons) {
    props.activeConversation.icons = []
  }
  props.activeConversation.icons = props.activeConversation.icons.filter(
    i => i !== 'alert' && i !== 'alert-medium' && i !== 'alert-low'
  )
  if (pri === 'High' || pri === 'Urgent') {
    props.activeConversation.icons.push('alert')
  } else if (pri === 'Medium') {
    props.activeConversation.icons.push('alert-medium')
  } else if (pri === 'Low') {
    props.activeConversation.icons.push('alert-low')
  }
  emit('toast', `Priority set to ${pri}`, 'success')
  isPriorityDropdownOpen.value = false
}

// Agent directory using exact mock data from Deals Panel (names and profile pictures)
interface Agent {
  name: string
  key: string
  avatar: string
}

const agents: Agent[] = [
  { name: 'Olivia (Me)', key: 'Liv', avatar: '/avatars/agent_11_chinese_female_mint.png' },
  { name: 'Ahmad Faizal', key: 'Faizal', avatar: '/avatars/agent_10_malay_male_coral.png' },
  { name: 'Siti Nur Aisyah', key: 'Aisyah', avatar: '/avatars/agent_13_malay_female_hijab_peach.png' },
  { name: 'Rajesh Kumar', key: 'Rajesh', avatar: '/avatars/agent_12_indian_male_lavender.png' },
  { name: 'Lim Wei Jie', key: 'WeiJie', avatar: '/avatars/agent_14_chinese_male_skyblue.png' },
  { name: 'Nurul Huda', key: 'Huda', avatar: '/avatars/agent_18_malay_female_hijab_rose.png' },
  { name: 'Mohd Hafiz', key: 'Hafiz', avatar: '/avatars/agent_16_malay_male_teal.png' },
  { name: 'Unassigned', key: 'Unassigned', avatar: '/avatars/agent_15_indian_female_yellow.png' }
]

// Watchers / Participants state (Dynamic per conversation using Deals Panel names/avatars)
const conversationParticipants = ref<Record<string, string[]>>({
  'conv-3': ['Siti Nur Aisyah', 'Rajesh Kumar'],
  'conv-1': ['Nurul Huda', 'Mohd Hafiz']
})

const participants = computed(() => {
  const convId = props.activeConversation?.id
  return convId ? (conversationParticipants.value[convId] || ['Ahmad Faizal', 'Siti Nur Aisyah']) : ['Ahmad Faizal', 'Siti Nur Aisyah']
})

const newParticipant = ref('')
const isParticipantSuggestionsVisible = ref(false)
const activeParticipantSuggestionIndex = ref(0)
const participantInputRef = ref<HTMLInputElement | null>(null)
const participantInputWrapperRef = ref<HTMLElement | null>(null)

onClickOutside(participantInputWrapperRef, () => {
  isParticipantSuggestionsVisible.value = false
})

const focusParticipantInput = () => {
  participantInputRef.value?.focus()
  isParticipantSuggestionsVisible.value = true
}

const filteredParticipantSuggestions = computed(() => {
  const query = newParticipant.value.trim().toLowerCase()
  const activeParticipants = participants.value
  
  return agents.filter(agent => 
    agent.name.toLowerCase().includes(query) && !activeParticipants.includes(agent.name)
  )
})

const navigateParticipantSuggestions = (direction: number) => {
  const len = filteredParticipantSuggestions.value.length
  if (len === 0) return
  activeParticipantSuggestionIndex.value = (activeParticipantSuggestionIndex.value + direction + len) % len
}

const addParticipantName = (name: string) => {
  const convId = props.activeConversation?.id
  if (convId) {
    if (!conversationParticipants.value[convId]) {
      conversationParticipants.value[convId] = []
    }
    if (!conversationParticipants.value[convId].includes(name)) {
      conversationParticipants.value[convId] = [...conversationParticipants.value[convId], name]
      emit('toast', `Added participant: ${name}`, 'success')
    }
  }
  newParticipant.value = ''
  activeParticipantSuggestionIndex.value = 0
  isParticipantSuggestionsVisible.value = false
}

const handleParticipantEnterKey = () => {
  const len = filteredParticipantSuggestions.value.length
  if (len > 0 && activeParticipantSuggestionIndex.value >= 0 && activeParticipantSuggestionIndex.value < len) {
    addParticipantName(filteredParticipantSuggestions.value[activeParticipantSuggestionIndex.value].name)
  } else {
    const query = newParticipant.value.trim()
    const match = agents.find(a => a.name.toLowerCase() === query.toLowerCase())
    if (match && !participants.value.includes(match.name)) {
      addParticipantName(match.name)
    }
  }
}

const handleParticipantBackspace = (e: KeyboardEvent) => {
  if (e.key === 'Backspace' && !newParticipant.value) {
    const activeParticipants = participants.value
    if (activeParticipants.length > 0) {
      const lastParticipant = activeParticipants[activeParticipants.length - 1]
      removeParticipant(lastParticipant)
    }
  }
}

const removeParticipant = (name: string) => {
  const convId = props.activeConversation?.id
  if (convId && conversationParticipants.value[convId]) {
    conversationParticipants.value[convId] = conversationParticipants.value[convId].filter(p => p !== name)
    emit('toast', `Removed participant: ${name}`, 'info')
  }
}

// Full-Row Autocomplete Tags input logic
const newTagText = ref('')
const isSuggestionsVisible = ref(false)
const activeSuggestionIndex = ref(0)
const tagInputRef = ref<HTMLInputElement | null>(null)
const tagInputWrapperRef = ref<HTMLElement | null>(null)

onClickOutside(tagInputWrapperRef, () => {
  isSuggestionsVisible.value = false
})

const focusTagInput = () => {
  tagInputRef.value?.focus()
  isSuggestionsVisible.value = true
}

const localSuggestions = ref<string[]>([...props.availableTags])

watch(() => props.availableTags, (newVal) => {
  newVal.forEach(t => {
    if (!localSuggestions.value.includes(t)) {
      localSuggestions.value.push(t)
    }
  })
}, { immediate: true })

const filteredSuggestions = computed(() => {
  const query = newTagText.value.trim().toLowerCase()
  const activeTags = props.activeConversation?.tags || []
  
  const matches = localSuggestions.value.filter(t => 
    t.toLowerCase().includes(query) && !activeTags.includes(t)
  )
  
  // Suggest creating a new tag if query doesn't match any exist in localSuggestions or activeTags
  if (query && !localSuggestions.value.some(t => t.toLowerCase() === query) && !activeTags.some(t => t.toLowerCase() === query)) {
    matches.push(newTagText.value.trim())
  }
  
  return matches
})

const navigateSuggestions = (direction: number) => {
  const len = filteredSuggestions.value.length
  if (len === 0) return
  activeSuggestionIndex.value = (activeSuggestionIndex.value + direction + len) % len
}

const addSuggestedTag = (tag: string) => {
  emit('addTag', tag)
  
  if (!localSuggestions.value.includes(tag)) {
    localSuggestions.value.push(tag)
  }
  
  newTagText.value = ''
  activeSuggestionIndex.value = 0
  isSuggestionsVisible.value = false
  emit('toast', `Added tag: ${tag}`, 'success')
}

const handleEnterKey = () => {
  const query = newTagText.value.trim()
  if (!query) return
  
  const len = filteredSuggestions.value.length
  if (len > 0 && activeSuggestionIndex.value >= 0 && activeSuggestionIndex.value < len) {
    addSuggestedTag(filteredSuggestions.value[activeSuggestionIndex.value])
  } else {
    addSuggestedTag(query)
  }
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Backspace' && !newTagText.value) {
    const activeTags = props.activeConversation?.tags || []
    if (activeTags.length > 0) {
      const lastTag = activeTags[activeTags.length - 1]
      emit('removeTag', lastTag)
      emit('toast', `Removed tag: ${lastTag}`, 'info')
    }
  }
}

// Create Deal Modal and Form States
const isCreateDealOpen = ref(false)
const isSuccessModalOpen = ref(false)
const createdDealTitle = ref('')
const conversationDeals = ref<Record<string, any>>({})

const dealPipeline = ref('Sales Pipeline')
const dealStage = ref('New Leads')
const dealAssignee = ref('Amirah Tan')
const dealTitle = ref('')
const dealDescription = ref('')

// Validation: title must contain at least one letter
const isTitleValid = computed(() => {
  return /[a-zA-Z]/.test(dealTitle.value)
})

const openCreateDealModal = () => {
  dealPipeline.value = 'Sales Pipeline'
  dealStage.value = 'New Leads'
  dealAssignee.value = 'Amirah Tan'
  dealTitle.value = ''
  dealDescription.value = ''
  isCreateDealOpen.value = true
}

const generateAiDealTitle = () => {
  const contactName = profile.value.name
  const companyName = profile.value.companyFull || profile.value.company || 'Acme'
  dealTitle.value = `${contactName} - ${companyName} Web Design`
  emit('toast', 'AI suggested a new deal title based on client info!', 'success')
}

const getAgentAvatar = (name: string) => {
  if (name === 'Amirah Tan') return '/avatars/agent_11_chinese_female_mint.png'
  if (name === 'Kausalya') return '/avatars/agent_15_indian_female_yellow.png'
  const agent = agents.find(a => a.name.toLowerCase().includes(name.toLowerCase()) || a.key.toLowerCase().includes(name.toLowerCase()))
  return agent?.avatar || '/avatars/agent_14_chinese_male_skyblue.png'
}

// Clean stage dictionary lookup mapping to replace inline nested ternary loops
const dealStageMap: Record<string, string> = {
  'New Leads': 'New',
  'Contacted': 'Acknowledged',
  'Qualified': 'Qualifying',
  'Proposal Sent': 'Proposal / Quotation',
  'Negotiation': 'Follow Up'
}

const submitCreateDeal = () => {
  if (!isTitleValid.value) return
  
  const convId = props.activeConversation?.id
  const newDealObj = {
    id: Date.now(),
    title: dealTitle.value,
    pipeline: dealPipeline.value,
    stage: dealStageMap[dealStage.value] || 'New',
    owner: dealAssignee.value,
    assignee: dealAssignee.value,
    description: dealDescription.value,
    clientName: profile.value.name,
    email: profile.value.email,
    phone: profile.value.phone,
    company: profile.value.companyFull || profile.value.company || 'Acme Corp',
    value: 25000,
    avatar: getAgentAvatar(dealAssignee.value)
  }
  
  if (convId) {
    conversationDeals.value[convId] = newDealObj
  }
  
  // Save to localStorage
  const existingCreated = localStorage.getItem('rakansales_created_deals')
  const createdDealsList = existingCreated ? JSON.parse(existingCreated) : []
  createdDealsList.push(newDealObj)
  localStorage.setItem('rakansales_created_deals', JSON.stringify(createdDealsList))
  
  createdDealTitle.value = dealTitle.value
  isCreateDealOpen.value = false
  isSuccessModalOpen.value = true
  emit('toast', `Deal "${dealTitle.value}" created successfully!`, 'success')
}

const currentActiveDeal = computed(() => {
  const convId = props.activeConversation?.id
  return convId ? conversationDeals.value[convId] : null
})

// Mock database for contact profiles
interface ContactProfile {
  name: string
  avatar: string
  email: string
  phone: string
  company: string
  website: string
  leadStatus: string
  tags: string[]
  dateAdded: string
  companyFull?: string
  companyWebsite?: string
  companyLocation?: string
  companyIndustry?: string
  companySize?: string
}

const contactProfiles: Record<string, Partial<ContactProfile>> = {
  'conv-1': {
    name: 'Mei Ting',
    email: 'meiting@acme.com',
    phone: '+6012 9876 5432',
    company: 'Acme Corp Sdn Bhd',
    website: 'acme.com',
    leadStatus: 'VIP',
    tags: ['WhatsApp', 'Warm', 'Medium'],
    dateAdded: '1 day ago',
    companyFull: 'Acme Corp Sdn Bhd',
    companyWebsite: 'acme.com',
    companyLocation: '10, Jalan Ampang, 50450 Kuala Lumpur',
    companyIndustry: 'Enterprise Software & Cloud',
    companySize: 'Mid-Market (150-500)'
  },
  'conv-2': {
    name: 'Chong Wei Jian',
    email: 'chong@apexlogistics.com',
    phone: '+6017 8899 001',
    company: 'Apex Logistics Bhd',
    website: 'apexlogistics.com.my',
    leadStatus: 'VIP',
    tags: ['Messenger', 'Hot', 'High'],
    dateAdded: '5 hours ago',
    companyFull: 'Apex Global Logistics Berhad',
    companyWebsite: 'apexlogistics.com.my',
    companyLocation: '88, Persiaran Barat, 46050 Petaling Jaya, Selangor',
    companyIndustry: 'Supply Chain & Freight Logistics',
    companySize: 'Enterprise (1,000+)'
  },
  'conv-3': {
    name: 'Mel Wong',
    email: 'melwong@kksteel.com',
    phone: '+6012 3456 7890',
    company: 'KK Steel Manufacturing Sdn...',
    website: 'kksteel.com',
    leadStatus: 'VIP',
    tags: ['Telegram', 'Hot', 'High'],
    dateAdded: '3 hours ago',
    companyFull: 'KK Steel Manufacturing Sdn Bhd',
    companyWebsite: 'kksteel.com.my',
    companyLocation: '29, Jalan Riong, Bangsar, 59100 Kuala Lumpur',
    companyIndustry: 'Industrial & Construction Steel',
    companySize: 'Enterprise (500+)'
  },
  'conv-4': {
    name: 'Daniel Imran',
    email: 'daniel@imrandigital.io',
    phone: '+6011 2345 6789',
    company: 'Imran Digital Studios',
    website: 'imrandigital.io',
    leadStatus: 'Lead',
    tags: ['Instagram', 'Warm', 'Low'],
    dateAdded: 'Yesterday',
    companyFull: 'Imran Digital Creative Agency',
    companyWebsite: 'imrandigital.io',
    companyLocation: 'Unit 12-3, Oval Damansara, TTDI, Kuala Lumpur',
    companyIndustry: 'Digital Marketing & Media Production',
    companySize: 'Growth / SMB (25-50)'
  },
  'conv-5': {
    name: 'Zac Goh',
    email: 'zacgoh@zactech.co',
    phone: '+6013 4455 6677',
    company: 'Zac Tech Sdn Bhd',
    website: 'zactech.co',
    leadStatus: 'VIP',
    tags: ['LiveChat', 'Hot', 'High'],
    dateAdded: '2 days ago',
    companyFull: 'Zac Tech Innovations Sdn Bhd',
    companyWebsite: 'zactech.co',
    companyLocation: '15, Jalan Sultan Ismail, 50250 Kuala Lumpur',
    companyIndustry: 'AI CRM & Automation Software',
    companySize: 'Scale-up (50-150)'
  },
  'conv-6': {
    name: 'Kavitha Krishnan',
    email: 'kavitha@solarsolutions.my',
    phone: '+6014 9988 776',
    company: 'Solar Solutions Asia',
    website: 'solarsolutions.my',
    leadStatus: 'Lead',
    tags: ['Mail', 'Hot', 'High'],
    dateAdded: '1 day ago',
    companyFull: 'Solar Solutions Asia Sdn Bhd',
    companyWebsite: 'solarsolutions.my',
    companyLocation: 'Level 5, Axiata Tower, KL Sentral, Kuala Lumpur',
    companyIndustry: 'Clean Energy & Solar Infrastructure',
    companySize: 'Mid-Market (100-250)'
  },
  'conv-7': {
    name: 'Kevin Nguyen',
    email: 'kevin@nguyenretail.vn',
    phone: '+6016 5544 332',
    company: 'Nguyen Retail Holdings',
    website: 'nguyenretail.com',
    leadStatus: 'VIP',
    tags: ['WhatsApp', 'Warm', 'Medium'],
    dateAdded: 'Yesterday',
    companyFull: 'Nguyen Retail Global Corporation',
    companyWebsite: 'nguyenretail.com',
    companyLocation: 'Mid Valley City, Lingkaran Syed Putra, Kuala Lumpur',
    companyIndustry: 'Omnichannel Retail & E-Commerce',
    companySize: 'Enterprise (2,500+)'
  },
  'conv-8': {
    name: 'Nurul Ain',
    email: 'nurul@greengrocer.com.my',
    phone: '+6018 7766 554',
    company: 'GreenGrocer Mart Sdn Bhd',
    website: 'greengrocer.com.my',
    leadStatus: 'VIP',
    tags: ['Mail', 'Hot', 'High'],
    dateAdded: '3 days ago',
    companyFull: 'GreenGrocer Fresh Produce Distribution',
    companyWebsite: 'greengrocer.com.my',
    companyLocation: 'Pusat Bandar Puchong, 47100 Puchong, Selangor',
    companyIndustry: 'Food & Beverage Supply Chain',
    companySize: 'Growth / SMB (50-100)'
  }
}

const profile = computed<ContactProfile>(() => {
  const defaultProfile: ContactProfile = {
    name: props.activeConversation?.sender || 'Unknown Contact',
    avatar: props.activeConversation?.avatar || '',
    email: (props.activeConversation?.sender || 'contact').toLowerCase().replace(/\s+/g, '') + '@company.com',
    phone: '+6012 3456 7890',
    company: 'Acme Corp',
    website: 'company.com',
    leadStatus: props.activeConversation?.icons?.includes('crown') ? 'VIP' : 'Lead',
    tags: [props.activeConversation?.platform || 'WhatsApp', 'Hot', 'High'],
    dateAdded: '3 hours ago',
    companyFull: 'Acme Manufacturing Sdn Bhd',
    companyWebsite: 'company.com.my',
    companyLocation: '29, Jalan Riong, Bangsar, 59100 Kuala Lumpur',
    companyIndustry: 'Healthcare',
    companySize: 'Enterprise'
  }
  
  const id = props.activeConversation?.id
  if (id && contactProfiles[id]) {
    return { ...defaultProfile, ...contactProfiles[id] }
  }
  return defaultProfile
})

const currentAgent = computed(() => {
  const assigned = props.activeConversation?.assignedTo
  return agents.find(a => a.key === assigned) || agents.find(a => a.name === assigned) || agents[0]
})

const handleAssign = (agent: Agent) => {
  if (props.activeConversation) {
    props.activeConversation.assignedTo = agent.key
  }
  isAssigneeDropdownOpen.value = false
  emit('toast', `Assigned thread to ${agent.name}`, 'success')
}

// Kebab Menu Handlers
const handleDuplicateContact = () => {
  emit('toast', `Duplicated contact: ${profile.value.name} (Copy)`, 'success')
  isKebabOpen.value = false
}

const handleExportContact = () => {
  emit('toast', `Exported vCard for ${profile.value.name}`, 'info')
  isKebabOpen.value = false
}

const handleMarkSpam = () => {
  emit('toast', `Marked ${profile.value.name} as spam`, 'warning')
  isKebabOpen.value = false
}

const handleDeleteContact = () => {
  isKebabOpen.value = false
  isDeleteContactModalOpen.value = true
}

const confirmDeleteContact = () => {
  emit('toast', `Contact ${profile.value.name} deleted`, 'info')
  isDeleteContactModalOpen.value = false
  emit('close')
}

// ==========================================
// HIGH FIDELITY INTERACTIVE PROTOTYPE STATES
// ==========================================

// 1. Tasks state
interface TaskItem {
  id: number
  text: string
  completed: boolean
}

const conversationTasks = ref<Record<string, TaskItem[]>>({
  'conv-3': [
    { id: 1, text: 'Confirm custom plate pricing quote details', completed: true },
    { id: 2, text: 'Draft specification proposal document', completed: false },
    { id: 3, text: 'Schedule a discovery zoom call session', completed: false }
  ],
  'conv-1': [
    { id: 1, text: 'Email welcome pack with product catalog pdf', completed: true },
    { id: 2, text: 'Establish direct channel with tech lead', completed: false }
  ]
})

const activeTasks = computed(() => {
  const convId = props.activeConversation?.id
  if (!convId) return []
  if (!conversationTasks.value[convId]) {
    conversationTasks.value[convId] = [
      { id: Date.now(), text: `Follow up introductory steps with ${profile.value.name}`, completed: false }
    ]
  }
  return conversationTasks.value[convId]
})

const completedTasksCount = computed(() => {
  return activeTasks.value.filter(t => t.completed).length
})

const newTaskText = ref('')
const showTasksPanel = ref(false)

const addTask = () => {
  const text = newTaskText.value.trim()
  if (!text) return
  const convId = props.activeConversation?.id
  if (convId) {
    if (!conversationTasks.value[convId]) {
      conversationTasks.value[convId] = []
    }
    conversationTasks.value[convId].push({
      id: Date.now(),
      text,
      completed: false
    })
    emit('toast', `Added task: "${text}"`, 'success')
    newTaskText.value = ''
  }
}

// 2. Private Note Logs state
interface NoteItem {
  id: number
  text: string
  time: string
}

const conversationNotes = ref<Record<string, NoteItem[]>>({
  'conv-3': [
    { id: 1, text: 'Client requested raw material catalog. Sent pricing files.', time: '2 hours ago' },
    { id: 2, text: 'Ahmad Faizal: Discussed steel grade preferences. Prefers structural carbon steel.', time: 'Yesterday' }
  ],
  'conv-1': [
    { id: 1, text: 'Lim Wei Jie: Expressed strong interest in CRM integrations with WhatsApp API.', time: '1 day ago' }
  ]
})

const activeNotes = computed(() => {
  const convId = props.activeConversation?.id
  if (!convId) return []
  if (!conversationNotes.value[convId]) {
    conversationNotes.value[convId] = []
  }
  return conversationNotes.value[convId]
})

const newNoteContent = ref('')
const showNotesPanel = ref(false)

const addNote = () => {
  const text = newNoteContent.value.trim()
  if (!text) return
  const convId = props.activeConversation?.id
  if (convId) {
    if (!conversationNotes.value[convId]) {
      conversationNotes.value[convId] = []
    }
    conversationNotes.value[convId].unshift({
      id: Date.now(),
      text,
      time: 'Just now'
    })
    emit('toast', 'Private note logged successfully!', 'success')
    newNoteContent.value = ''
  }
}

const deleteNote = (noteId: number) => {
  const convId = props.activeConversation?.id
  if (convId && conversationNotes.value[convId]) {
    conversationNotes.value[convId] = conversationNotes.value[convId].filter(n => n.id !== noteId)
    emit('toast', 'Note deleted from logs.', 'info')
  }
}

// 3. Meeting Scheduler state
interface MeetingInfo {
  date: string
  time: string
  type: string
}

const conversationMeetings = ref<Record<string, MeetingInfo>>({
  'conv-3': { date: '2026-08-20', time: '14:00', type: 'Product Demo' }
})

const scheduledMeeting = computed(() => {
  const convId = props.activeConversation?.id
  return convId ? conversationMeetings.value[convId] : null
})

const isCalendarModalOpen = ref(false)
const meetingDate = ref('2026-08-20')
const meetingTime = ref('10:00')
const meetingType = ref('Introductory Call')

const submitScheduleMeeting = () => {
  const convId = props.activeConversation?.id
  if (convId) {
    conversationMeetings.value[convId] = {
      date: meetingDate.value,
      time: meetingTime.value,
      type: meetingType.value
    }
    isCalendarModalOpen.value = false
    emit('toast', `Booked ${meetingType.value} for ${meetingDate.value} at ${meetingTime.value}`, 'success')
  }
}

// Action button handlers
const handleAction = (type: string) => {
  if (type === 'tasks') {
    showTasksPanel.value = !showTasksPanel.value
    showNotesPanel.value = false
  } else if (type === 'watchers') {
    // Focus and scroll to the participants input field
    focusParticipantInput()
    emit('toast', 'Focused participants field to add co-agents', 'info')
  } else if (type === 'chat') {
    showNotesPanel.value = !showNotesPanel.value
    showTasksPanel.value = false
  } else if (type === 'calendar') {
    isCalendarModalOpen.value = true
  }
}

const getTagChipClass = (tag: string) => {
  if (tag === 'SMEAievent2026' || tag === 'SMEAIEvent2026') return 'text-teal-900 bg-teal-50 border-teal-200'
  if (tag === '2026Q2') return 'text-orange-900 bg-orange-50 border-orange-200'
  return 'text-gray-700 bg-gray-50 border-gray-200'
}

const snoozeButtonClass = computed(() => {
  return props.activeConversation?.isSnoozed 
    ? 'border-blue-200 bg-blue-50 text-blue-900 hover:bg-blue-100' 
    : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
})

const resolveButtonClass = computed(() => {
  const isResolved = props.activeConversation?.section === 'Resolved' || props.activeConversation?.lifecycleState === 'closed'
  return isResolved 
    ? 'border-emerald-300 bg-emerald-50 text-emerald-900 hover:bg-emerald-100' 
    : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
})
</script>

<template>
  <aside 
    class="w-[320px] border-l border-gray-200 bg-white flex flex-col h-full shrink-0 select-none overflow-y-auto scrollbar-thin z-10 animate-in slide-in-from-right duration-250"
  >
    <!-- Drawer Header with Dynamic List / Grid View Switcher -->
    <div class="px-5 py-4 flex items-center justify-between border-b border-gray-100 shrink-0">
      <h2 class="text-sm font-bold text-gray-955">Contact Information</h2>
      <div class="flex items-center gap-2">
        <!-- List / Grid View Switch Button: When in grid view, shows List icon to switch; when in list view, shows Grid icon to switch -->
        <button 
          v-if="viewMode === 'grid'"
          @click="viewMode = 'list'"
          class="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-1.5 rounded-lg transition-colors cursor-pointer border-0 bg-transparent flex items-center justify-center" 
          title="Switch to List View (Compact)"
        >
          <List class="w-4 h-4" />
        </button>
        <button 
          v-else
          @click="viewMode = 'grid'"
          class="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-1.5 rounded-lg transition-colors cursor-pointer border-0 bg-transparent flex items-center justify-center" 
          title="Switch to Grid View (Stylized)"
        >
          <LayoutGrid class="w-4 h-4" />
        </button>

        <button 
          @click="emit('close')"
          class="text-gray-400 hover:text-gray-655 p-1 rounded transition-colors cursor-pointer flex items-center justify-center border-0 bg-transparent" 
          title="Close panel"
        >
          <ChevronRight class="w-4.5 h-4.5" />
        </button>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- VIEW 1: GRID VIEW (Stylized Cards & Accordions Layout)   -->
    <!-- ======================================================== -->
    <div v-if="viewMode === 'grid'" class="flex flex-col flex-1">
      <!-- Profile Card Section -->
      <div class="p-5 border-b border-gray-100 flex flex-col gap-4">
        <!-- Image & Details Grid -->
        <div class="flex items-start gap-4">
          <!-- Avatar with status dot -->
          <div class="relative shrink-0">
            <img :src="profile.avatar" class="w-14 h-14 rounded-full object-cover border border-gray-150" alt="Contact Avatar" />
            <span class="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full border-2 border-white bg-[#23B750]"></span>
          </div>
          
          <!-- Details Column -->
          <div class="flex-1 min-w-0">
            <!-- Name & Toggleable VIP Badge & Kebab Actions Menu -->
            <div class="flex items-center justify-between gap-1.5 mb-1.5">
              <div class="flex items-center gap-1.5 min-w-0">
                <h3 class="font-extrabold text-gray-900 text-sm truncate">{{ profile.name }}</h3>
                
                <!-- Toggleable VIP Badge (Green when active, gray/faded when inactive) -->
                <button 
                  @click="toggleVip"
                  class="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold shrink-0 leading-none cursor-pointer transition-all duration-150 select-none border"
                  :class="[
                    isVipActive 
                      ? 'border-green-300 text-green-700 bg-green-50 hover:bg-green-100 shadow-2xs font-extrabold' 
                      : 'border-gray-200 text-gray-400 bg-gray-50/70 hover:bg-gray-100 hover:text-gray-600 opacity-60 hover:opacity-100'
                  ]"
                  :title="isVipActive ? 'VIP Contact (Click to disable)' : 'Standard Contact (Click to mark as VIP)'"
                >
                  <Crown class="w-2.5 h-2.5" :class="isVipActive ? 'text-green-600' : 'text-gray-400'" />
                  <span>VIP</span>
                </button>
              </div>

              <!-- Kebab Action Button & Dropdown Menu -->
              <div class="relative shrink-0" ref="kebabRef">
                <button 
                  @click="isKebabOpen = !isKebabOpen"
                  class="text-gray-400 hover:text-gray-700 cursor-pointer p-1 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center border-0 bg-transparent"
                  title="Contact options"
                >
                  <MoreVertical class="w-4 h-4" />
                </button>

                <!-- Kebab Floating Menu -->
                <transition
                  enter-active-class="transition duration-100 ease-out"
                  enter-from-class="transform scale-95 opacity-0 -translate-y-1"
                  enter-to-class="transform scale-100 opacity-100 translate-y-0"
                  leave-active-class="transition duration-75 ease-in"
                  leave-from-class="transform scale-100 opacity-100 translate-y-0"
                  leave-to-class="transform scale-95 opacity-0 -translate-y-1"
                >
                  <div 
                    v-if="isKebabOpen"
                    class="absolute right-0 mt-1.5 w-44 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1 text-left text-xs font-semibold text-gray-700"
                  >
                    <button 
                      @click="handleDuplicateContact"
                      class="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 cursor-pointer border-0 bg-transparent text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      <Copy class="w-3.5 h-3.5 text-gray-400" />
                      <span>Duplicate Contact</span>
                    </button>
                    <button 
                      @click="handleExportContact"
                      class="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 cursor-pointer border-0 bg-transparent text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      <Download class="w-3.5 h-3.5 text-gray-400" />
                      <span>Export vCard</span>
                    </button>
                    <button 
                      @click="handleMarkSpam"
                      class="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 cursor-pointer border-0 bg-transparent text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      <ShieldAlert class="w-3.5 h-3.5 text-gray-400" />
                      <span>Mark as Spam</span>
                    </button>
                    <div class="border-t border-gray-100 my-1"></div>
                    <button 
                      @click="handleDeleteContact"
                      class="w-full px-3 py-2 text-left hover:bg-red-50 flex items-center gap-2 cursor-pointer border-0 bg-transparent text-red-600 font-bold transition-colors"
                    >
                      <Trash2 class="w-3.5 h-3.5 text-red-500" />
                      <span>Delete Contact</span>
                    </button>
                  </div>
                </transition>
              </div>
            </div>
            
            <!-- Contact rows -->
            <div class="space-y-1.5 text-xs text-gray-500 font-medium">
              <div class="flex items-center gap-2">
                <Phone class="w-3.5 h-3.5 text-gray-455 shrink-0" />
                <span class="truncate">{{ profile.phone }}</span>
              </div>
              <div class="flex items-center gap-2">
                <Mail class="w-3.5 h-3.5 text-gray-455 shrink-0" />
                <span class="truncate text-gray-600">{{ profile.email }}</span>
              </div>
              <div class="flex items-center gap-2">
                <Building2 class="w-3.5 h-3.5 text-gray-455 shrink-0" />
                <span class="truncate text-gray-600">{{ profile.company }}</span>
              </div>
              <div class="flex items-center gap-2">
                <Globe class="w-3.5 h-3.5 text-gray-455 shrink-0" />
                <span class="truncate text-gray-655">{{ profile.website }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Interactive Status Badges (Strictly in 1 Row without sizing shifts, with soft-fading hover chevrons) -->
        <div class="flex flex-col gap-2.5">
          <div class="flex items-center gap-1.5 w-full">
            
            <!-- 1. Source (Platform) Badge Dropdown -->
            <div class="relative flex-1 min-w-0" ref="sourceDropdownRef">
              <button 
                @click="isSourceDropdownOpen = !isSourceDropdownOpen"
                class="relative group/badge w-full inline-flex items-center justify-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold border transition-all cursor-pointer select-none shadow-2xs hover:shadow-xs overflow-hidden h-7"
                :class="[
                  currentSource === 'WhatsApp' ? 'border-green-200 bg-green-50/80 text-green-700 hover:bg-green-100/90' :
                  currentSource === 'Messenger' ? 'border-blue-200 bg-blue-50/80 text-blue-700 hover:bg-blue-100/90' :
                  currentSource === 'Instagram' ? 'border-pink-200 bg-pink-50/80 text-pink-700 hover:bg-pink-100/90' :
                  currentSource === 'Email' ? 'border-purple-200 bg-purple-50/80 text-purple-700 hover:bg-purple-100/90' :
                  'border-gray-200 bg-gray-50/80 text-gray-700 hover:bg-gray-100/90'
                ]"
                title="Click to change source platform"
              >
                <!-- Content row: Icon + Label -->
                <div class="flex items-center gap-1.5 min-w-0 truncate">
                  <PlatformIcon :platform="currentSource" size="xs" variant="colored" />
                  <span class="truncate">{{ currentSource }}</span>
                </div>

                <!-- Hover Chevron overlay with soft fade over the text -->
                <div 
                  class="absolute right-0 inset-y-0 w-6 flex items-center justify-end pr-1.5 opacity-0 group-hover/badge:opacity-100 transition-opacity duration-150 rounded-r-full"
                  :class="[
                    currentSource === 'WhatsApp' ? 'bg-gradient-to-l from-green-100 via-green-100/90 to-transparent' :
                    currentSource === 'Messenger' ? 'bg-gradient-to-l from-blue-100 via-blue-100/90 to-transparent' :
                    currentSource === 'Instagram' ? 'bg-gradient-to-l from-pink-100 via-pink-100/90 to-transparent' :
                    currentSource === 'Mail' || currentSource === 'Email' ? 'bg-gradient-to-l from-purple-100 via-purple-100/90 to-transparent' :
                    'bg-gradient-to-l from-gray-100 via-gray-100/90 to-transparent'
                  ]"
                >
                  <ChevronDown class="w-3 h-3 opacity-80" />
                </div>
              </button>

              <!-- Source Dropdown Popup -->
              <transition
                enter-active-class="transition duration-100 ease-out"
                enter-from-class="transform scale-95 opacity-0 -translate-y-1"
                enter-to-class="transform scale-100 opacity-100 translate-y-0"
                leave-active-class="transition duration-75 ease-in"
                leave-from-class="transform scale-100 opacity-100 translate-y-0"
                leave-to-class="transform scale-95 opacity-0 -translate-y-1"
              >
                <div 
                  v-if="isSourceDropdownOpen"
                  class="absolute left-0 mt-1.5 w-40 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1 text-xs font-semibold text-gray-700"
                >
                  <div class="px-2.5 py-1 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Select Source</div>
                  <button 
                    v-for="src in sourceOptions" 
                    :key="src.key"
                    @click="setSource(src.key)"
                    class="w-full px-3 py-1.5 text-left hover:bg-gray-50 flex items-center justify-between cursor-pointer border-0 bg-transparent text-gray-700 hover:text-gray-900 transition-colors"
                    :class="currentSource === src.key ? 'bg-green-50/50 text-green-700 font-extrabold' : ''"
                  >
                    <div class="flex items-center gap-2">
                      <PlatformIcon :platform="src.key" size="sm" variant="colored" />
                      <span>{{ src.label }}</span>
                    </div>
                    <Check v-if="currentSource === src.key" class="w-3 h-3 text-green-600 font-bold" />
                  </button>
                </div>
              </transition>
            </div>

            <!-- 2. Temperature Status Dropdown -->
            <div class="relative flex-1 min-w-0" ref="tempDropdownRef">
              <button 
                @click="isTempDropdownOpen = !isTempDropdownOpen"
                class="relative group/badge w-full inline-flex items-center justify-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold border transition-all cursor-pointer select-none shadow-2xs hover:shadow-xs overflow-hidden h-7"
                :class="[
                  currentTemperature === 'Hot' ? 'border-orange-200 bg-orange-50/80 text-orange-755 hover:bg-orange-100/90' :
                  currentTemperature === 'Warm' ? 'border-amber-200 bg-amber-50/80 text-amber-700 hover:bg-amber-100/90' :
                  'border-cyan-200 bg-cyan-50/80 text-cyan-700 hover:bg-cyan-100/90'
                ]"
                title="Click to change temperature"
              >
                <!-- Content row: Icon + Label -->
                <div class="flex items-center gap-1 min-w-0 truncate">
                  <Flame v-if="currentTemperature === 'Hot'" class="w-3 h-3 text-orange-500 fill-current shrink-0" />
                  <Sparkles v-else-if="currentTemperature === 'Warm'" class="w-3 h-3 text-amber-500 fill-current shrink-0" />
                  <Sparkles v-else class="w-3 h-3 text-cyan-500 shrink-0" />
                  <span class="truncate">{{ currentTemperature }}</span>
                </div>

                <!-- Hover Chevron overlay with soft fade over the text -->
                <div 
                  class="absolute right-0 inset-y-0 w-6 flex items-center justify-end pr-1.5 opacity-0 group-hover/badge:opacity-100 transition-opacity duration-150 rounded-r-full"
                  :class="[
                    currentTemperature === 'Hot' ? 'bg-gradient-to-l from-orange-100 via-orange-100/90 to-transparent' :
                    currentTemperature === 'Warm' ? 'bg-gradient-to-l from-amber-100 via-amber-100/90 to-transparent' :
                    'bg-gradient-to-l from-cyan-100 via-cyan-100/90 to-transparent'
                  ]"
                >
                  <ChevronDown class="w-3 h-3 opacity-80" />
                </div>
              </button>

              <!-- Temperature Dropdown Popup -->
              <transition
                enter-active-class="transition duration-100 ease-out"
                enter-from-class="transform scale-95 opacity-0 -translate-y-1"
                enter-to-class="transform scale-100 opacity-100 translate-y-0"
                leave-active-class="transition duration-75 ease-in"
                leave-from-class="transform scale-100 opacity-100 translate-y-0"
                leave-to-class="transform scale-95 opacity-0 -translate-y-1"
              >
                <div 
                  v-if="isTempDropdownOpen"
                  class="absolute left-1/2 -translate-x-1/2 mt-1.5 w-32 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1 text-xs font-semibold text-gray-700"
                >
                  <div class="px-2.5 py-1 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Temperature</div>
                  <button 
                    v-for="t in tempOptions" 
                    :key="t.key"
                    @click="setTemperature(t.key)"
                    class="w-full px-3 py-1.5 text-left hover:bg-gray-50 flex items-center justify-between cursor-pointer border-0 bg-transparent text-gray-700 hover:text-gray-900 transition-colors"
                    :class="currentTemperature === t.key ? 'bg-orange-50/50 text-orange-700 font-extrabold' : ''"
                  >
                    <div class="flex items-center gap-1.5">
                      <Flame v-if="t.key === 'Hot'" class="w-3.5 h-3.5 text-orange-500 fill-current" />
                      <Sparkles v-else-if="t.key === 'Warm'" class="w-3.5 h-3.5 text-amber-500 fill-current" />
                      <Sparkles v-else class="w-3.5 h-3.5 text-cyan-500" />
                      <span>{{ t.label }}</span>
                    </div>
                    <Check v-if="currentTemperature === t.key" class="w-3 h-3 text-orange-600 font-bold" />
                  </button>
                </div>
              </transition>
            </div>

            <!-- 3. Priority Status Dropdown -->
            <div class="relative flex-1 min-w-0" ref="priorityDropdownRef">
              <button 
                @click="isPriorityDropdownOpen = !isPriorityDropdownOpen"
                class="relative group/badge w-full inline-flex items-center justify-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold border transition-all cursor-pointer select-none shadow-2xs hover:shadow-xs overflow-hidden h-7"
                :class="[
                  currentPriority === 'High' ? 'border-orange-200 bg-orange-50/80 text-orange-700 hover:bg-orange-100/90' :
                  currentPriority === 'Medium' ? 'border-yellow-200 bg-yellow-50/80 text-yellow-800 hover:bg-yellow-100/90' :
                  'border-gray-200 bg-gray-50/80 text-gray-600 hover:bg-gray-100/90'
                ]"
                title="Click to change priority"
              >
                <!-- Content row: Icon + Label -->
                <div class="flex items-center gap-1 min-w-0 truncate">
                  <AlertTriangle class="w-3 h-3 shrink-0" :class="currentPriority === 'High' ? 'text-orange-500' : currentPriority === 'Medium' ? 'text-yellow-600' : 'text-gray-400'" />
                  <span class="truncate">{{ currentPriority }}</span>
                </div>

                <!-- Hover Chevron overlay with soft fade over the text -->
                <div 
                  class="absolute right-0 inset-y-0 w-6 flex items-center justify-end pr-1.5 opacity-0 group-hover/badge:opacity-100 transition-opacity duration-150 rounded-r-full"
                  :class="[
                    currentPriority === 'High' ? 'bg-gradient-to-l from-orange-100 via-orange-100/90 to-transparent' :
                    currentPriority === 'Medium' ? 'bg-gradient-to-l from-yellow-100 via-yellow-100/90 to-transparent' :
                    'bg-gradient-to-l from-gray-100 via-gray-100/90 to-transparent'
                  ]"
                >
                  <ChevronDown class="w-3 h-3 opacity-80" />
                </div>
              </button>

              <!-- Priority Dropdown Popup -->
              <transition
                enter-active-class="transition duration-100 ease-out"
                enter-from-class="transform scale-95 opacity-0 -translate-y-1"
                enter-to-class="transform scale-100 opacity-100 translate-y-0"
                leave-active-class="transition duration-75 ease-in"
                leave-from-class="transform scale-100 opacity-100 translate-y-0"
                leave-to-class="transform scale-95 opacity-0 -translate-y-1"
              >
                <div 
                  v-if="isPriorityDropdownOpen"
                  class="absolute right-0 mt-1.5 w-32 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1 text-xs font-semibold text-gray-700"
                >
                  <div class="px-2.5 py-1 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Priority</div>
                  <button 
                    v-for="p in priorityOptions" 
                    :key="p.key"
                    @click="setPriority(p.key)"
                    class="w-full px-3 py-1.5 text-left hover:bg-gray-50 flex items-center justify-between cursor-pointer border-0 bg-transparent text-gray-700 hover:text-gray-900 transition-colors"
                    :class="currentPriority === p.key ? 'bg-orange-50/50 text-orange-700 font-extrabold' : ''"
                  >
                    <div class="flex items-center gap-1.5">
                      <span class="w-2 h-2 rounded-full" :class="p.key === 'High' ? 'bg-orange-500' : p.key === 'Medium' ? 'bg-yellow-500' : 'bg-gray-400'"></span>
                      <span>{{ p.label }}</span>
                    </div>
                    <Check v-if="currentPriority === p.key" class="w-3 h-3 text-orange-600 font-bold" />
                  </button>
                </div>
              </transition>
            </div>
          </div>
          
          <!-- Upgraded Secondary Tag Autocomplete Row Editor (Seamless borderless design) -->
          <div class="relative w-full border-t border-gray-100 pt-2" ref="tagInputWrapperRef">
            <div class="relative w-full">
              <!-- Seamless borderless tag row container -->
              <div 
                class="flex flex-wrap items-center gap-1.5 w-full cursor-text bg-transparent transition-all duration-150 py-0.5"
                @click="focusTagInput"
              >
                <!-- Active tag chips -->
                <span 
                  v-for="tag in activeConversation.tags" 
                  :key="tag"
                  class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border leading-none h-6 select-none shadow-2xs"
                  :class="getTagChipClass(tag)"
                >
                  <span 
                    class="w-1.5 h-1.5 rounded-full"
                    :class="[ tag === 'SMEAievent2026' || tag === 'SMEAIEvent2026' ? 'bg-teal-500' : tag === '2026Q2' ? 'bg-orange-500' : 'bg-gray-400' ]"
                  ></span>
                  <span>{{ tag }}</span>
                  <button 
                    @click.stop="emit('removeTag', tag)" 
                    class="w-3.5 h-3.5 rounded-full hover:bg-black/5 flex items-center justify-center text-current opacity-60 hover:opacity-100 ml-0.5 cursor-pointer transition-all border-0 bg-transparent p-0"
                  >
                    <X class="w-2.5 h-2.5" />
                  </button>
                </span>
                
                <!-- Inline tag input field with plus placeholder -->
                <div class="flex items-center gap-1 flex-1 min-w-[85px]">
                  <input 
                    ref="tagInputRef"
                    v-model="newTagText"
                    @keydown.enter.prevent="handleEnterKey"
                    @keydown.down.prevent="navigateSuggestions(1)"
                    @keydown.up.prevent="navigateSuggestions(-1)"
                    @keydown.backspace="handleKeyDown"
                    @focus="isSuggestionsVisible = true"
                    placeholder="+ Add tag..."
                    class="text-xs bg-transparent focus:outline-none flex-1 text-gray-700 font-semibold py-1 placeholder:text-gray-400 border-0 outline-none"
                  />
                </div>
              </div>
              
              <!-- Floating Autocomplete Suggestions Dropdown -->
              <transition
                enter-active-class="transition duration-100 ease-out"
                enter-from-class="transform scale-95 opacity-0 -translate-y-1"
                enter-to-class="transform scale-100 opacity-100 translate-y-0"
                leave-active-class="transition duration-75 ease-in"
                leave-from-class="transform scale-100 opacity-100 translate-y-0"
                leave-to-class="transform scale-95 opacity-0 -translate-y-1"
              >
                <div 
                  v-if="isSuggestionsVisible && filteredSuggestions.length > 0"
                  class="absolute left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl z-30 shadow-lg max-h-48 overflow-y-auto py-1"
                >
                  <button 
                    v-for="(sug, index) in filteredSuggestions" 
                    :key="sug"
                    @click="addSuggestedTag(sug)"
                    @mouseenter="activeSuggestionIndex = index"
                    class="w-full text-left px-3 py-1.5 text-xs flex items-center justify-between cursor-pointer font-semibold"
                    :class="activeSuggestionIndex === index ? 'bg-gray-50 text-gray-900' : 'text-gray-700'"
                  >
                    <div class="flex items-center gap-2">
                      <span 
                        class="w-1.5 h-1.5 rounded-full"
                        :class="[ sug === 'SMEAievent2026' || sug === 'SMEAIEvent2026' ? 'bg-teal-500' : sug === '2026Q2' ? 'bg-orange-500' : 'bg-green-500' ]"
                      ></span>
                      <span>{{ sug }}</span>
                    </div>
                    <!-- Show New label if tag does not exist in base availableTags -->
                    <span v-if="!availableTags.includes(sug)" class="text-[9px] font-bold text-green-600 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-md leading-none shrink-0">New</span>
                  </button>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>

      <!-- COLLAPSIBLE SECTION: Conversation Info -->
      <div class="border-b border-gray-100">
        <!-- Section Header -->
        <div class="px-5 py-3.5 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <h4 class="text-sm font-bold text-gray-800">Conversation Info</h4>
            <!-- Reply indicator -->
            <span 
              v-if="activeConversation.rightBadge"
              class="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-green-50 text-green-700 border border-green-200/80 leading-none"
            >
              {{ activeConversation.rightBadge }}
            </span>
          </div>
          <!-- Custom Switch -->
          <button 
            @click="isConversationInfoOpen = !isConversationInfoOpen"
            class="w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none cursor-pointer border border-gray-200 bg-gray-100 flex items-center"
            :class="isConversationInfoOpen ? 'bg-gray-200' : 'bg-gray-100'"
          >
            <div 
              class="w-4 h-4 bg-white rounded-full shadow-xs transform duration-200"
              :class="isConversationInfoOpen ? 'translate-x-4' : 'translate-x-0'"
            ></div>
          </button>
        </div>
        
        <!-- Section Content -->
        <transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 max-h-0 overflow-hidden"
          enter-to-class="opacity-100 max-h-[300px]"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 max-h-[300px]"
          leave-to-class="opacity-0 max-h-0 overflow-hidden"
        >
          <div v-show="isConversationInfoOpen" class="px-5 pb-4 space-y-3">
            <!-- Date Added Row -->
            <div class="flex items-center justify-between text-xs py-0.5">
              <span class="text-gray-400 font-semibold flex items-center gap-1.5">
                <Clock class="w-3.5 h-3.5 text-gray-400" /> Date Added
              </span>
              <span class="text-gray-655 font-bold">{{ profile.dateAdded }}</span>
            </div>

            <!-- Dynamic Scheduled Meeting Info Banner (Updates live upon scheduling) -->
            <div v-if="scheduledMeeting" class="flex items-center justify-between text-xs py-1 border-t border-gray-100 pt-2 animate-in fade-in slide-in-from-top-1 duration-200">
              <span class="text-gray-400 font-semibold flex items-center gap-1.5">
                <Calendar class="w-3.5 h-3.5 text-green-500" /> Scheduled Call
              </span>
              <span class="text-green-800 font-bold bg-green-50 px-2 py-0.5 rounded border border-green-200/50 text-[10px] truncate max-w-[170px]" :title="scheduledMeeting.type">
                {{ scheduledMeeting.type }}: {{ scheduledMeeting.date }} {{ scheduledMeeting.time }}
              </span>
            </div>
            
            <!-- Assigned Agent Dropdown -->
            <div class="relative" ref="assigneeDropdownRef">
              <button 
                @click="isAssigneeDropdownOpen = !isAssigneeDropdownOpen"
                class="w-full flex items-center justify-between border border-gray-200 rounded-xl px-3 py-2 text-xs bg-white hover:bg-gray-50 cursor-pointer outline-none font-semibold text-gray-705 transition-colors"
              >
                <div class="flex items-center gap-2">
                  <img :src="currentAgent.avatar" class="w-5 h-5 rounded-full object-cover" />
                  <span>{{ currentAgent.name }}</span>
                </div>
                <ChevronDown class="w-4 h-4 text-gray-400" />
              </button>
              
              <!-- Dropdown Options -->
              <transition
                enter-active-class="transition duration-100 ease-out"
                enter-from-class="transform scale-95 opacity-0 -translate-y-1"
                enter-to-class="transform scale-100 opacity-100 translate-y-0"
                leave-active-class="transition duration-75 ease-in"
                leave-from-class="transform scale-100 opacity-100 translate-y-0"
                leave-to-class="transform scale-95 opacity-0 -translate-y-1"
              >
                <div 
                  v-if="isAssigneeDropdownOpen"
                  class="absolute left-0 right-0 mt-1 bg-white border border-gray-250 rounded-xl z-30 py-1 shadow-md max-h-48 overflow-y-auto"
                >
                  <button 
                    v-for="agent in agents" 
                    :key="agent.name"
                    @click="handleAssign(agent)"
                    class="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 flex items-center justify-between cursor-pointer"
                    :class="currentAgent.key === agent.key ? 'bg-gray-50/50' : ''"
                  >
                    <div class="flex items-center gap-2 font-medium text-gray-700">
                      <img :src="agent.avatar" class="w-5 h-5 rounded-full object-cover" />
                      <span>{{ agent.name }}</span>
                    </div>
                    <!-- Tick mark if active -->
                    <span v-if="currentAgent.key === agent.key" class="text-green-500 font-bold">✓</span>
                  </button>
                </div>
              </transition>
            </div>
            
            <!-- Participants Autocomplete Combobox Row with Internal Right-Aligned Info Icon -->
            <div class="w-full relative" ref="participantInputWrapperRef">
              <!-- Row of chips, input, and absolute info icon -->
              <div 
                class="flex flex-wrap gap-1.5 pl-2 pr-8 py-2 border border-gray-150 rounded-xl bg-gray-55 min-h-[42px] items-center cursor-text focus-within:bg-white focus-within:border-green-300 transition-all duration-150 relative"
                @click="focusParticipantInput"
              >
                <!-- Participant chips -->
                <span 
                  v-for="pName in participants" 
                  :key="pName"
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border border-gray-200 bg-white font-bold text-gray-655 shadow-none leading-none h-6 select-none animate-in fade-in zoom-in-95 duration-100"
                >
                  <img :src="getAgentAvatar(pName)" class="w-3.5 h-3.5 rounded-full object-cover mr-0.5" />
                  <span>{{ pName }}</span>
                  <button 
                    @click.stop="removeParticipant(pName)" 
                    class="hover:text-red-500 font-semibold cursor-pointer outline-none ml-1 text-gray-405 border-0 bg-transparent p-0 flex items-center"
                  >
                    ×
                  </button>
                </span>
                
                <input 
                  ref="participantInputRef"
                  v-model="newParticipant"
                  @focus="isParticipantSuggestionsVisible = true"
                  @keydown.down.prevent="navigateParticipantSuggestions(1)"
                  @keydown.up.prevent="navigateParticipantSuggestions(-1)"
                  @keydown.enter.prevent="handleParticipantEnterKey"
                  @keydown.backspace="handleParticipantBackspace"
                  :placeholder="participants.length === 0 ? '+ Add Participants' : '+ Add...'"
                  class="text-xs bg-transparent focus:outline-none flex-1 min-w-[70px] text-gray-700 font-semibold py-0.5"
                />

                <!-- Info Icon with Hoverable Toolbox Popover (Absolute-aligned inside right-2) -->
                <div class="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center justify-center group/info">
                  <button 
                    class="text-gray-400 hover:text-gray-655 transition-colors p-1 rounded-full hover:bg-gray-150 cursor-pointer outline-none border-0 flex items-center justify-center"
                    title="How to use Participants"
                    type="button"
                    @click.stop
                  >
                    <Info class="w-3.5 h-3.5" />
                  </button>
                  
                  <!-- Floating Info Toolbox Card -->
                  <div 
                    class="absolute right-0 bottom-full mb-2.5 w-64 bg-white/95 backdrop-blur-md border border-gray-200 rounded-2xl shadow-xl z-40 p-4 text-left pointer-events-none opacity-0 scale-95 group-hover/info:opacity-100 group-hover/info:scale-100 group-hover/info:pointer-events-auto transition-all duration-200 origin-bottom-right"
                  >
                    <div class="flex items-center gap-1.5 border-b border-gray-100 pb-2 mb-2">
                      <Users class="w-4 h-4 text-green-600" />
                      <h5 class="text-xs font-extrabold text-gray-900">Conversation Participants</h5>
                    </div>
                    <ul class="space-y-2 text-[11px] text-gray-500 font-bold leading-normal list-none p-0 m-0">
                      <li class="flex items-start gap-1.5">
                        <span class="w-1.5 h-1.5 rounded-full bg-green-500 mt-1 shrink-0"></span>
                        <span>Add sales agents to follow and monitor this conversation.</span>
                      </li>
                      <li class="flex items-start gap-1.5">
                        <span class="w-1.5 h-1.5 rounded-full bg-green-500 mt-1 shrink-0"></span>
                        <span>Participants receive notifications for incoming customer messages.</span>
                      </li>
                      <li class="flex items-start gap-1.5">
                        <span class="w-1.5 h-1.5 rounded-full bg-green-500 mt-1 shrink-0"></span>
                        <span>Allows seamless collaboration and internal private notes inside the team.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Floating Autocomplete Suggestions Dropdown -->
              <transition
                enter-active-class="transition duration-100 ease-out"
                enter-from-class="transform scale-95 opacity-0 -translate-y-1"
                enter-to-class="transform scale-100 opacity-100 translate-y-0"
                leave-active-class="transition duration-75 ease-in"
                leave-from-class="transform scale-100 opacity-100 translate-y-0"
                leave-to-class="transform scale-95 opacity-0 -translate-y-1"
              >
                <div 
                  v-if="isParticipantSuggestionsVisible && filteredParticipantSuggestions.length > 0"
                  class="absolute left-0 right-0 mt-1.5 bg-white border border-gray-250 rounded-xl z-30 shadow-lg max-h-48 overflow-y-auto py-1"
                >
                  <button 
                    v-for="(agent, index) in filteredParticipantSuggestions" 
                    :key="agent.name"
                    @click="addParticipantName(agent.name)"
                    @mouseenter="activeParticipantSuggestionIndex = index"
                    class="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 flex items-center justify-between cursor-pointer font-semibold"
                    :class="activeParticipantSuggestionIndex === index ? 'bg-gray-50 text-gray-900' : 'text-gray-700'"
                  >
                    <div class="flex items-center gap-2">
                      <img :src="agent.avatar" class="w-5 h-5 rounded-full object-cover" />
                      <span>{{ agent.name }}</span>
                    </div>
                  </button>
                </div>
              </transition>
            </div>
          </div>
        </transition>
      </div>

      <!-- COLLAPSIBLE SECTION: Deal Info -->
      <div class="border-b border-gray-100">
        <!-- Section Header with hover trigger for + button -->
        <div class="px-5 py-3.5 flex items-center justify-between group">
          <div class="flex items-center gap-1.5">
            <h4 class="text-sm font-bold text-gray-800">Deal Info</h4>
            <!-- + button, visible only on hover of group -->
            <button 
              @click="openCreateDealModal"
              class="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-all duration-150 cursor-pointer outline-none flex items-center justify-center border-0 bg-transparent"
              title="Create Deal"
            >
              <Plus class="w-4 h-4" />
            </button>
          </div>
          
          <!-- Custom Switch -->
          <button 
            @click="isDealInfoOpen = !isDealInfoOpen"
            class="w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none cursor-pointer border border-gray-200 bg-gray-100 flex items-center"
            :class="isDealInfoOpen ? 'bg-gray-200' : 'bg-gray-100'"
          >
            <div 
              class="w-4 h-4 bg-white rounded-full shadow-xs transform duration-200"
              :class="isDealInfoOpen ? 'translate-x-4' : 'translate-x-0'"
            ></div>
          </button>
        </div>
        
        <!-- Section Content -->
        <transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 max-h-0 overflow-hidden"
          enter-to-class="opacity-100 max-h-[150px]"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 max-h-[150px]"
          leave-to-class="opacity-0 max-h-0 overflow-hidden"
        >
          <div v-show="isDealInfoOpen" class="px-5 pb-4">
            <div v-if="currentActiveDeal" class="border border-gray-200 rounded-xl p-3.5 bg-white hover:shadow-xs transition-shadow">
              <h5 class="font-extrabold text-gray-900 text-xs leading-tight mb-1.5">{{ currentActiveDeal.title }}</h5>
              <div class="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                <span>{{ currentActiveDeal.stage }}</span>
                <span class="text-gray-305">•</span>
                <span>{{ currentActiveDeal.pipeline }}</span>
              </div>
            </div>
            <!-- Empty state indicating there is no active deal, which turns into a + Create Deal button on hover -->
            <div 
              v-else
              @click="openCreateDealModal"
              class="text-xs text-gray-450 italic text-center p-3 bg-gray-50 rounded-xl border border-dashed border-gray-200 leading-normal cursor-pointer transition-all duration-200 group hover:border-[#23B750] select-none flex items-center justify-center min-h-[46px]"
            >
              <span class="group-hover:hidden">No active deal for this conversation.</span>
              <span class="hidden group-hover:inline-flex items-center gap-1 font-bold text-[#23B750]">
                <Plus class="w-3.5 h-3.5" /> Create Deal
              </span>
            </div>
          </div>
        </transition>
      </div>

      <!-- COLLAPSIBLE SECTION: Company Info (DEFAULT OPEN) -->
      <div class="border-b border-gray-100">
        <!-- Section Header -->
        <div class="px-5 py-3.5 flex items-center justify-between">
          <h4 class="text-sm font-bold text-gray-800">Company Info</h4>
          <!-- Custom Switch -->
          <button 
            @click="isCompanyInfoOpen = !isCompanyInfoOpen"
            class="w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none cursor-pointer border border-gray-200 bg-gray-100 flex items-center"
            :class="isCompanyInfoOpen ? 'bg-gray-200' : 'bg-gray-100'"
          >
            <div 
              class="w-4 h-4 bg-white rounded-full shadow-xs transform duration-200"
              :class="isCompanyInfoOpen ? 'translate-x-4' : 'translate-x-0'"
            ></div>
          </button>
        </div>
        
        <!-- Section Content -->
        <transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 max-h-0 overflow-hidden"
          enter-to-class="opacity-100 max-h-[300px]"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 max-h-[300px]"
          leave-to-class="opacity-0 max-h-0 overflow-hidden"
        >
          <div v-show="isCompanyInfoOpen" class="px-5 pb-4 space-y-3.5 text-xs text-gray-500 font-medium">
            <div class="flex items-start gap-2.5">
              <Building2 class="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
              <span class="text-gray-700 leading-normal">{{ profile.companyFull }}</span>
            </div>
            <div class="flex items-start gap-2.5">
              <Link2 class="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
              <a :href="'https://' + profile.companyWebsite" target="_blank" class="text-primary hover:underline leading-normal truncate">{{ profile.companyWebsite }}</a>
            </div>
            <div class="flex items-start gap-2.5">
              <MapPin class="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
              <span class="leading-relaxed text-gray-655">{{ profile.companyLocation }}</span>
            </div>
            <div class="flex items-center gap-2.5">
              <Tag class="w-4 h-4 text-gray-405 shrink-0" />
              <span class="leading-normal">{{ profile.companyIndustry }}</span>
            </div>
            <div class="flex items-center gap-2.5">
              <Briefcase class="w-4 h-4 text-gray-455 shrink-0" />
              <span class="leading-normal text-gray-700">{{ profile.companySize }}</span>
            </div>
          </div>
        </transition>
      </div>

      <!-- COLLAPSIBLE SECTION: Actions -->
      <div>
        <!-- Section Header -->
        <div class="px-5 py-3.5 flex items-center justify-between">
          <h4 class="text-sm font-bold text-gray-800">Actions</h4>
          <!-- Custom Switch -->
          <button 
            @click="isActionsOpen = !isActionsOpen"
            class="w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none cursor-pointer border border-gray-200 bg-gray-100 flex items-center"
            :class="isActionsOpen ? 'bg-gray-200' : 'bg-gray-100'"
          >
            <div 
              class="w-4 h-4 bg-white rounded-full shadow-xs transform duration-200"
              :class="isActionsOpen ? 'translate-x-4' : 'translate-x-0'"
            ></div>
          </button>
        </div>
        
        <!-- Section Content -->
        <transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 max-h-0 overflow-hidden"
          enter-to-class="opacity-100 max-h-[480px]"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 max-h-[480px]"
          leave-to-class="opacity-0 max-h-0 overflow-hidden"
        >
          <div v-show="isActionsOpen" class="px-5 pb-6">
            <div class="grid grid-cols-4 gap-3.5">
              <!-- Tasks Button -->
              <button 
                @click="handleAction('tasks')"
                class="aspect-square bg-amber-500 hover:bg-amber-600 active:scale-95 text-white rounded-xl flex items-center justify-center relative transition-all cursor-pointer shadow-xs border-0 outline-none"
                :class="showTasksPanel ? 'ring-2 ring-amber-300 bg-amber-600' : ''"
                title="Tasks Checklist"
              >
                <Clock class="w-5 h-5" />
                <!-- Completed vs Active Tasks Badge -->
                <span class="absolute -top-1.5 -right-1.5 bg-gray-100 text-gray-800 text-[10px] font-extrabold w-5 h-5 rounded-full border border-white flex items-center justify-center shadow-xs">
                  {{ activeTasks.length }}
                </span>
              </button>
              
              <!-- Watchers / Participants focus Button -->
              <button 
                @click="handleAction('watchers')"
                class="aspect-square bg-purple-500 hover:bg-purple-655 active:scale-95 text-white rounded-xl flex items-center justify-center relative transition-all cursor-pointer shadow-xs border-0 outline-none"
                title="Focus Watchers / Participants"
              >
                <Users class="w-5 h-5" />
                <!-- Badge -->
                <span class="absolute -top-1.5 -right-1.5 bg-gray-100 text-gray-800 text-[10px] font-extrabold w-5 h-5 rounded-full border border-white flex items-center justify-center shadow-xs">
                  {{ participants.length }}
                </span>
              </button>
              
              <!-- Chat bubble Note Logger Button -->
              <button 
                @click="handleAction('chat')"
                class="aspect-square bg-cyan-500 hover:bg-cyan-600 active:scale-95 text-white rounded-xl flex items-center justify-center relative transition-all cursor-pointer shadow-xs border-0 outline-none"
                :class="showNotesPanel ? 'ring-2 ring-cyan-300 bg-cyan-650' : ''"
                title="Private Note Logs"
              >
                <MessageSquare class="w-5 h-5" />
              </button>
              
              <!-- Calendar Scheduler Modal Button -->
              <button 
                @click="handleAction('calendar')"
                class="aspect-square bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl flex items-center justify-center relative transition-all cursor-pointer shadow-xs border-0 outline-none"
                title="Schedule Meeting"
              >
                <Calendar class="w-5 h-5" />
              </button>
            </div>

            <!-- Quick Snooze & Quick Resolve Buttons -->
            <div class="grid grid-cols-2 gap-2 mt-3">
              <button 
                @click="emit('toggleSnooze')"
                class="px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5"
                :class="snoozeButtonClass"
              >
                <Clock class="w-3.5 h-3.5 text-current" />
                <span>{{ activeConversation.isSnoozed ? 'Unsnooze' : 'Snooze' }}</span>
              </button>

              <button 
                @click="emit('toggleResolve')"
                class="px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5"
                :class="resolveButtonClass"
              >
                <Check class="w-3.5 h-3.5 text-current" />
                <span>{{ activeConversation.section === 'Resolved' || activeConversation.lifecycleState === 'closed' ? 'Reopen' : 'Resolve' }}</span>
              </button>
            </div>

            <!-- Prototype Tasks Checklist Panel (Inline) -->
            <transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="opacity-0 max-h-0 overflow-hidden"
              enter-to-class="opacity-100 max-h-[300px]"
              leave-active-class="transition ease-in duration-150"
              leave-from-class="opacity-100 max-h-[300px]"
              leave-to-class="opacity-0 max-h-0 overflow-hidden"
            >
              <div v-show="showTasksPanel" class="mt-4 border border-gray-150 rounded-xl p-3.5 bg-gray-50/70 space-y-3 text-left">
                <div class="flex items-center justify-between">
                  <h5 class="text-xs font-extrabold text-gray-800">Tasks Checklist</h5>
                  <span class="text-[10px] font-bold text-gray-600 bg-white border border-gray-200 px-2 py-0.5 rounded-full select-none">
                    {{ completedTasksCount }}/{{ activeTasks.length }} done
                  </span>
                </div>
                
                <!-- Checklist Items -->
                <ul class="space-y-2 max-h-36 overflow-y-auto pr-1">
                  <li v-for="task in activeTasks" :key="task.id" class="flex items-start gap-2.5 text-xs">
                    <input 
                      type="checkbox" 
                      v-model="task.completed" 
                      class="w-4 h-4 accent-green-600 rounded border-gray-300 focus:ring-0 cursor-pointer shrink-0 mt-0.5" 
                    />
                    <span class="font-semibold leading-tight" :class="task.completed ? 'line-through text-gray-400 font-medium' : 'text-gray-700'">
                      {{ task.text }}
                    </span>
                  </li>
                </ul>
                
                <!-- Add new checklist task -->
                <div class="flex gap-1.5 border-t border-gray-100 pt-2.5">
                  <input 
                    type="text" 
                    v-model="newTaskText" 
                    @keyup.enter="addTask" 
                    placeholder="Add a checklist task..." 
                    class="flex-1 text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:border-green-300 font-semibold text-gray-800"
                  />
                  <button 
                    @click="addTask" 
                    class="px-2.5 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-bold border-0 cursor-pointer transition-colors flex items-center justify-center shrink-0"
                  >
                    <Plus class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </transition>

            <!-- Prototype Private Note Logs Panel (Inline) -->
            <transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="opacity-0 max-h-0 overflow-hidden"
              enter-to-class="opacity-100 max-h-[350px]"
              leave-active-class="transition ease-in duration-150"
              leave-from-class="opacity-100 max-h-[350px]"
              leave-to-class="opacity-0 max-h-0 overflow-hidden"
            >
              <div v-show="showNotesPanel" class="mt-4 border border-gray-150 rounded-xl p-3.5 bg-gray-50/70 space-y-3 text-left">
                <h5 class="text-xs font-extrabold text-gray-800">Private logs / Notes</h5>
                
                <!-- Log feed list -->
                <div v-if="activeNotes.length > 0" class="space-y-2 max-h-40 overflow-y-auto pr-1">
                  <div v-for="note in activeNotes" :key="note.id" class="p-2.5 bg-white border border-gray-150 rounded-lg text-[11px] font-semibold text-gray-700 shadow-2xs relative group/note">
                    <p class="leading-relaxed pr-4 whitespace-pre-wrap">{{ note.text }}</p>
                    <span class="text-[9px] text-gray-400 block mt-1 font-bold">{{ note.time }}</span>
                    <button 
                      @click="deleteNote(note.id)" 
                      class="absolute right-1 top-1 text-gray-300 hover:text-red-500 opacity-0 group-hover/note:opacity-100 transition-opacity p-1 cursor-pointer bg-transparent border-0 flex items-center justify-center"
                      title="Delete log"
                    >
                      <X class="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div v-else class="text-[11px] text-gray-400 italic text-center py-4 bg-white border border-gray-100 rounded-lg">
                  No logs or notes registered for this contact.
                </div>
                
                <!-- Note Input text box -->
                <div class="flex flex-col gap-1.5 border-t border-gray-100 pt-2.5">
                  <textarea 
                    rows="2" 
                    v-model="newNoteContent" 
                    placeholder="Add details, updates, or logs..." 
                    class="w-full text-xs border border-gray-200 rounded-lg p-2.5 bg-white focus:outline-none focus:border-green-300 font-semibold text-gray-800 resize-none leading-relaxed"
                  ></textarea>
                  <button 
                    @click="addNote" 
                    class="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-bold border-0 cursor-pointer transition-colors flex items-center justify-center"
                  >
                    Save Note Log
                  </button>
                </div>
              </div>
            </transition>
          </div>
        </transition>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- VIEW 2: LIST VIEW (Clean, High-Density Key-Value Layout) -->
    <!-- ======================================================== -->
    <div v-else class="flex flex-col flex-1 p-4 space-y-4 text-xs font-medium animate-in fade-in duration-200">
      
      <!-- Contact Header (Compact) -->
      <div class="flex items-center gap-3 pb-3 border-b border-gray-100">
        <img :src="profile.avatar" class="w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0" />
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-1.5 mb-0.5">
            <h3 class="font-extrabold text-gray-900 text-sm truncate">{{ profile.name }}</h3>
            <!-- Toggleable VIP Badge in List View -->
            <button 
              @click="toggleVip"
              class="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-bold border shrink-0 cursor-pointer transition-all duration-150 select-none"
              :class="[
                isVipActive 
                  ? 'border-green-300 text-green-700 bg-green-50 font-extrabold' 
                  : 'border-gray-200 text-gray-400 bg-gray-50 opacity-60'
              ]"
              :title="isVipActive ? 'VIP Contact (Click to disable)' : 'Standard Contact (Click to mark as VIP)'"
            >
              <Crown class="w-2.5 h-2.5" :class="isVipActive ? 'text-green-600' : 'text-gray-400'" />
              <span>VIP</span>
            </button>
          </div>
          <p class="text-[11px] text-gray-400 truncate">{{ profile.email }}</p>
        </div>
      </div>

      <!-- Section: Properties (Key-Value Density) -->
      <div class="space-y-2">
        <h5 class="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Properties</h5>
        
        <div class="bg-gray-50/70 border border-gray-100 rounded-xl divide-y divide-gray-100 text-xs">
          <!-- Phone -->
          <div class="flex items-center justify-between px-3 py-2">
            <span class="text-gray-400 font-semibold flex items-center gap-1.5"><Phone class="w-3 h-3 text-gray-400" /> Phone</span>
            <span class="text-gray-800 font-bold truncate">{{ profile.phone }}</span>
          </div>
          <!-- Platform / Source -->
          <div class="flex items-center justify-between px-3 py-2">
            <span class="text-gray-400 font-semibold flex items-center gap-1.5"><PlatformIcon :platform="currentSource" size="xs" variant="colored" /> Source</span>
            <PlatformIcon :platform="currentSource" size="xs" variant="badge" />
          </div>
          <!-- Temperature -->
          <div class="flex items-center justify-between px-3 py-2">
            <span class="text-gray-400 font-semibold flex items-center gap-1.5"><Flame class="w-3 h-3 text-orange-400" /> Temperature</span>
            <span class="text-orange-700 font-extrabold bg-orange-50 px-2 py-0.5 rounded border border-orange-200/50 text-[10px]">{{ currentTemperature }}</span>
          </div>
          <!-- Priority -->
          <div class="flex items-center justify-between px-3 py-2">
            <span class="text-gray-400 font-semibold flex items-center gap-1.5"><AlertTriangle class="w-3 h-3 text-amber-400" /> Priority</span>
            <span class="text-gray-800 font-bold">{{ currentPriority }}</span>
          </div>
          <!-- Assignee -->
          <div class="flex items-center justify-between px-3 py-2">
            <span class="text-gray-400 font-semibold flex items-center gap-1.5"><Users class="w-3 h-3 text-gray-400" /> Assignee</span>
            <div class="flex items-center gap-1 text-gray-800 font-bold">
              <img :src="currentAgent.avatar" class="w-4 h-4 rounded-full object-cover" />
              <span>{{ currentAgent.name }}</span>
            </div>
          </div>
          <!-- Date Added -->
          <div class="flex items-center justify-between px-3 py-2">
            <span class="text-gray-400 font-semibold flex items-center gap-1.5"><Clock class="w-3 h-3 text-gray-400" /> Date Added</span>
            <span class="text-gray-700 font-bold">{{ profile.dateAdded }}</span>
          </div>
        </div>
      </div>

      <!-- Section: Tags List -->
      <div class="space-y-1.5">
        <h5 class="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Tags</h5>
        <div class="flex flex-wrap gap-1.5">
          <span 
            v-for="t in activeConversation.tags" 
            :key="t" 
            class="px-2 py-0.5 rounded-md text-[10px] font-bold border border-gray-200 bg-white text-gray-700"
          >
            {{ t }}
          </span>
          <span v-if="!activeConversation.tags || activeConversation.tags.length === 0" class="text-gray-400 italic text-[11px]">
            No tags attached
          </span>
        </div>
      </div>

      <!-- Section: Deal Information (Simple) -->
      <div class="space-y-1.5">
        <div class="flex items-center justify-between">
          <h5 class="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Deal</h5>
          <button 
            v-if="!currentActiveDeal" 
            @click="openCreateDealModal" 
            class="text-[10px] text-green-600 font-bold hover:underline cursor-pointer border-0 bg-transparent p-0"
          >
            + Create Deal
          </button>
        </div>
        <div class="bg-gray-50/70 border border-gray-100 rounded-xl p-2.5">
          <div v-if="currentActiveDeal">
            <div class="font-bold text-gray-900 text-xs truncate">{{ currentActiveDeal.title }}</div>
            <div class="text-[10px] text-gray-500 mt-0.5">{{ currentActiveDeal.stage }} • {{ currentActiveDeal.pipeline }}</div>
          </div>
          <div v-else class="text-[11px] text-gray-400 italic">
            No active deal registered
          </div>
        </div>
      </div>

      <!-- Section: Company Information (Simple List) -->
      <div class="space-y-1.5">
        <h5 class="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Company Details</h5>
        <div class="bg-gray-50/70 border border-gray-100 rounded-xl divide-y divide-gray-100 text-xs">
          <div class="flex items-center justify-between px-3 py-1.5">
            <span class="text-gray-400 font-semibold">Name</span>
            <span class="text-gray-800 font-bold truncate max-w-[170px]">{{ profile.companyFull || profile.company }}</span>
          </div>
          <div class="flex items-center justify-between px-3 py-1.5">
            <span class="text-gray-400 font-semibold">Website</span>
            <a :href="'https://' + profile.companyWebsite" target="_blank" class="text-primary hover:underline truncate max-w-[170px] font-bold">{{ profile.companyWebsite }}</a>
          </div>
          <div class="flex items-center justify-between px-3 py-1.5">
            <span class="text-gray-400 font-semibold">Industry</span>
            <span class="text-gray-800 font-bold">{{ profile.companyIndustry }}</span>
          </div>
          <div class="flex items-center justify-between px-3 py-1.5">
            <span class="text-gray-400 font-semibold">Size</span>
            <span class="text-gray-800 font-bold">{{ profile.companySize }}</span>
          </div>
        </div>
      </div>

      <!-- Quick Action Buttons Strip in List View -->
      <div class="pt-2 border-t border-gray-100 flex items-center gap-2">
        <button 
          @click="openCreateDealModal"
          class="flex-1 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer border-0 flex items-center justify-center gap-1 shadow-2xs"
        >
          <Plus class="w-3.5 h-3.5" /> Deal
        </button>
        <button 
          @click="isCalendarModalOpen = true"
          class="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer border-0 flex items-center justify-center gap-1 shadow-2xs"
        >
          <Calendar class="w-3.5 h-3.5" /> Call
        </button>
      </div>

    </div>

    <!-- CREATE DEAL MODAL DIALOG (Teleported to body to prevent stacking context clipping) -->
    <Teleport to="body">
      <transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div 
          v-if="isCreateDealOpen" 
          class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs select-none"
        >
          <div 
            class="bg-white rounded-2xl max-w-lg w-full p-6 border border-gray-100 shadow-2xl flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-200"
          >
            <!-- Header -->
            <div class="flex items-center justify-between pb-1">
              <h2 class="text-base font-extrabold text-gray-900">Create Deal</h2>
              <button 
                @click="isCreateDealOpen = false" 
                class="text-gray-400 hover:text-gray-700 cursor-pointer p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X class="w-5 h-5" />
              </button>
            </div>
            
            <!-- Form Fields Grid -->
            <div class="space-y-4">
              <!-- Pipeline Select -->
              <div class="grid grid-cols-3 items-center gap-4">
                <label class="text-sm font-semibold text-gray-700">Choose Pipeline</label>
                <div class="col-span-2 relative flex items-center">
                  <select 
                    v-model="dealPipeline" 
                    class="w-full border border-gray-200 rounded-xl pl-3.5 pr-10 py-2.5 text-xs bg-white font-bold text-gray-700 focus:outline-none focus:border-green-300 transition-colors cursor-pointer appearance-none"
                  >
                    <option value="Sales Pipeline">Sales Pipeline</option>
                    <option value="Marketing Pipeline">Marketing Pipeline</option>
                    <option value="Support Pipeline">Support Pipeline</option>
                  </select>
                  <ChevronDown class="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              
              <!-- Stage Select -->
              <div class="grid grid-cols-3 items-center gap-4">
                <label class="text-sm font-semibold text-gray-700">Stage</label>
                <div class="col-span-2 relative flex items-center">
                  <select 
                    v-model="dealStage" 
                    class="w-full border border-gray-200 rounded-xl pl-9 pr-10 py-2.5 text-xs bg-white font-bold text-gray-700 focus:outline-none focus:border-green-300 transition-colors cursor-pointer appearance-none"
                  >
                    <option value="New Leads">New Leads</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Proposal Sent">Proposal Sent</option>
                    <option value="Negotiation">Negotiation</option>
                  </select>
                  <span class="absolute left-3.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500 pointer-events-none"></span>
                  <ChevronDown class="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              
              <!-- Assignee Select -->
              <div class="grid grid-cols-3 items-center gap-4">
                <label class="text-sm font-semibold text-gray-700">Assignee</label>
                <div class="col-span-2 relative flex items-center">
                  <select 
                    v-model="dealAssignee" 
                    class="w-full border border-gray-200 rounded-xl pl-9 pr-10 py-2.5 text-xs bg-white font-bold text-gray-700 focus:outline-none focus:border-green-300 transition-colors cursor-pointer appearance-none"
                  >
                    <option value="Amirah Tan">Amirah Tan</option>
                    <option v-for="agent in agents" :key="agent.name" :value="agent.name">{{ agent.name }}</option>
                  </select>
                  <Users class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <ChevronDown class="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              
              <!-- Deal Title Input -->
              <div class="grid grid-cols-3 items-start gap-4">
                <label class="text-sm font-semibold text-gray-700 pt-2.5">Deal title</label>
                <div class="col-span-2 flex flex-col gap-1.5 min-h-[58px]">
                  <div class="relative flex items-center">
                    <input 
                      type="text" 
                      v-model="dealTitle" 
                      class="w-full border border-gray-200 rounded-xl pl-3.5 pr-14 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none focus:border-green-300 transition-colors" 
                      placeholder="Deal Title"
                    />
                    <button 
                      @click="generateAiDealTitle"
                      class="absolute right-2.5 h-7 px-2 bg-gray-55 border border-gray-200 hover:bg-gray-100 rounded-lg text-[10px] font-bold text-gray-655 flex items-center gap-1 transition-colors cursor-pointer outline-none"
                      title="Generate with AI"
                    >
                      <Sparkles class="w-3 h-3 text-purple-650" />
                      AI
                    </button>
                  </div>
                  <span 
                    v-if="!isTitleValid"
                    class="text-[11px] text-red-500 font-bold leading-none animate-in fade-in duration-150"
                  >
                    Title must contain at least one letter.
                  </span>
                </div>
              </div>
              
              <!-- Description Textarea -->
              <div class="grid grid-cols-3 items-start gap-4">
                <label class="text-sm font-semibold text-gray-700 pt-2.5">Description</label>
                <div class="col-span-2">
                  <textarea 
                    rows="3" 
                    v-model="dealDescription"
                    class="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-850 placeholder:text-gray-400 focus:outline-none focus:border-green-300 transition-colors resize-none leading-relaxed" 
                    placeholder="Description"
                  ></textarea>
                </div>
              </div>
            </div>
            
            <!-- Horizontal separator line -->
            <div class="border-t border-gray-150 mt-2"></div>
            
            <!-- Action Buttons -->
            <div class="flex items-center justify-end gap-3 select-none">
              <button 
                @click="isCreateDealOpen = false" 
                class="px-4 py-2.5 text-xs font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer outline-none"
              >
                Cancel
              </button>
              <button 
                @click="submitCreateDeal"
                :disabled="!isTitleValid"
                class="px-5 py-2.5 text-xs font-bold text-white rounded-xl transition-all select-none border-0 outline-none flex items-center justify-center shadow-xs"
                :class="isTitleValid ? 'bg-[#67D3B5] hover:bg-[#5bc1a4] cursor-pointer' : 'bg-gray-200 text-gray-400 cursor-not-allowed'"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>

    <!-- DEAL CREATED SUCCESS MODAL DIALOG (Centered) -->
    <Teleport to="body">
      <transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div 
          v-if="isSuccessModalOpen" 
          class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs select-none"
        >
          <div 
            class="bg-white rounded-2xl max-w-sm w-full p-6 border border-gray-100 shadow-2xl flex flex-col items-center text-center gap-5 animate-in fade-in zoom-in-95 duration-200"
          >
            <div class="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center border border-green-200">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="w-7 h-7 text-[#23B750]"><path d="M20 6L9 17l-5-5"/></svg>
            </div>
            
            <div class="space-y-2">
              <h2 class="text-base font-extrabold text-gray-900">Deal Created Successfully!</h2>
              <p class="text-xs text-gray-500 font-bold leading-normal px-2">
                The deal <span class="text-gray-800 font-extrabold">"{{ createdDealTitle }}"</span> has been successfully added to your sales pipeline.
              </p>
            </div>
            
            <div class="flex flex-col w-full gap-2 mt-2">
              <button 
                @click="router.push('/deals')"
                class="w-full py-2.5 bg-[#23B750] hover:bg-[#1fa347] active:scale-[0.98] text-white text-xs font-bold rounded-xl transition-all border-0 cursor-pointer outline-none shadow-xs"
              >
                Go to Deals Pipeline
              </button>
              <button 
                @click="isSuccessModalOpen = false"
                class="w-full py-2.5 bg-gray-50 hover:bg-gray-100 active:scale-[0.98] text-gray-500 hover:text-gray-700 text-xs font-bold rounded-xl transition-all border border-gray-200 cursor-pointer outline-none"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>

    <!-- CALENDAR / MEETING SCHEDULER MODAL DIALOG (Centered) -->
    <Teleport to="body">
      <transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div 
          v-if="isCalendarModalOpen" 
          class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs select-none"
        >
          <div 
            class="bg-white rounded-2xl max-w-sm w-full p-5 border border-gray-100 shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200"
          >
            <div class="flex items-center justify-between pb-1 border-b border-gray-50 pb-2">
              <h2 class="text-sm font-extrabold text-gray-900">Schedule Meeting</h2>
              <button 
                @click="isCalendarModalOpen = false" 
                class="text-gray-400 hover:text-gray-700 cursor-pointer p-1 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center border-0 bg-transparent"
              >
                <X class="w-4 h-4" />
              </button>
            </div>
            
            <div class="space-y-3.5 text-left">
              <div>
                <label class="text-[11px] font-extrabold text-gray-500 block mb-1">Meeting Date</label>
                <input type="date" v-model="meetingDate" class="w-full border border-gray-250 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 focus:outline-none focus:border-green-300" />
              </div>
              <div>
                <label class="text-[11px] font-extrabold text-gray-500 block mb-1">Meeting Time</label>
                <input type="time" v-model="meetingTime" class="w-full border border-gray-255 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 focus:outline-none focus:border-green-300" />
              </div>
              <div class="relative">
                <label class="text-[11px] font-extrabold text-gray-500 block mb-1">Meeting Type</label>
                <div class="relative flex items-center">
                  <select v-model="meetingType" class="w-full border border-gray-255 rounded-xl pl-3 pr-10 py-2.5 text-xs bg-white font-bold text-gray-700 focus:outline-none focus:border-green-300 transition-colors cursor-pointer appearance-none">
                    <option value="Introductory Call">Introductory Call</option>
                    <option value="Product Demo">Product Demo</option>
                    <option value="Proposal & Pricing Review">Proposal & Pricing Review</option>
                    <option value="Onboarding & Training">Onboarding & Training</option>
                  </select>
                  <ChevronDown class="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
            
            <div class="flex items-center justify-end gap-2.5 mt-2">
              <button 
                @click="isCalendarModalOpen = false" 
                class="px-3.5 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-55 rounded-xl transition-colors cursor-pointer outline-none border-0 bg-transparent"
              >
                Cancel
              </button>
              <button 
                @click="submitScheduleMeeting"
                class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-xl transition-all cursor-pointer outline-none flex items-center justify-center shadow-xs border-0"
              >
                Book Meeting
              </button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>

    <!-- DELETE CONTACT CONFIRMATION MODAL -->
    <Teleport to="body">
      <transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div 
          v-if="isDeleteContactModalOpen" 
          class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs select-none"
        >
          <div 
            class="bg-white rounded-2xl max-w-xs w-full p-5 border border-gray-100 shadow-2xl flex flex-col items-center text-center gap-4 animate-in fade-in zoom-in-95 duration-200"
          >
            <div class="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center border border-red-200">
              <Trash2 class="w-6 h-6" />
            </div>
            <div class="space-y-1">
              <h3 class="text-sm font-extrabold text-gray-900">Delete Contact?</h3>
              <p class="text-xs text-gray-500 font-medium leading-relaxed">
                Are you sure you want to remove <span class="font-bold text-gray-800">{{ profile.name }}</span>? This action cannot be undone.
              </p>
            </div>
            <div class="flex items-center justify-center gap-2.5 w-full mt-1">
              <button 
                @click="isDeleteContactModalOpen = false"
                class="flex-1 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors border border-gray-200 bg-white cursor-pointer"
              >
                Cancel
              </button>
              <button 
                @click="confirmDeleteContact"
                class="flex-1 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors border-0 cursor-pointer shadow-xs"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </aside>
</template>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #f1f1f1;
  border-radius: 10px;
}
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #e2e8f0;
}
</style>
