<script setup lang="ts">
import { ref, computed, nextTick, watch, onMounted } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { mockData } from '@/data/mockData'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-vue-next'

// Import modular components
import ToastNotifications from '@/components/omnichannel/ToastNotifications.vue'
import InboxDropdown from '@/components/omnichannel/InboxDropdown.vue'
import ConversationItem, { type Conversation } from '@/components/omnichannel/ConversationItem.vue'
import ContactDrawer from '@/components/omnichannel/ContactDrawer.vue'
import FiltersModal from '@/components/omnichannel/FiltersModal.vue'
import OmnichannelTutorialModal from '@/components/omnichannel/OmnichannelTutorialModal.vue'
import PlatformIcon from '@/components/omnichannel/PlatformIcon.vue'
import TemplatePickerModal from '@/components/omnichannel/TemplatePickerModal.vue'
import { 
  type CrmTemplate, 
  defaultCrmTemplates, 
  resolveTemplateVariables 
} from '@/data/crmTemplates'


// Toast Alerts State
interface Toast {
  id: string
  message: string
  type: 'success' | 'info' | 'warning'
}
const toasts = ref<Toast[]>([])

const addToast = (message: string, type: 'success' | 'info' | 'warning' = 'success', duration = 3000) => {
  const id = `toast-${Date.now()}`
  toasts.value.push({ id, message, type })
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }, duration)
}

// Sidebar View Mode ('sales' vs 'admin')
const viewMode = ref<'sales' | 'admin'>('sales')



// Search and Active Filter States
const searchQuery = ref('')
const activeFilter = ref<'all' | 'reply' | 'late-reply' | 'unread' | 'mine' | 'focus'>('all')
const isBulkSelected = ref(false)
const isFiltersModalOpen = ref(false)

// Active Inbox filter scope state
const selectedInbox = ref<'All' | 'Mine' | 'Unassigned' | 'Participating' | 'Resolved' | 'Archived'>('All')
const customerSearchQuery = ref('')
const isHeaderAssignDropdownOpen = ref(false)
const isRightDrawerOpen = ref(true)
const isLifecycleDropdownOpen = ref(false)

const headerAssignDropdownRef = ref<HTMLElement | null>(null)
const headerLifecycleDropdownRef = ref<HTMLElement | null>(null)

onClickOutside(headerAssignDropdownRef, () => {
  isHeaderAssignDropdownOpen.value = false
})

onClickOutside(headerLifecycleDropdownRef, () => {
  isLifecycleDropdownOpen.value = false
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

const parseTimeToMinutes = (timeStr: string): number => {
  if (!timeStr) return 999999
  const s = timeStr.toLowerCase().trim()
  if (s === 'just now' || s === 'now' || s.startsWith('just') || s === '0m' || s === '1m' || s.includes('sec')) return 0
  if (s === 'yesterday') return 24 * 60
  if (s.includes('min') || (s.includes('m') && !s.includes('mo'))) {
    const num = parseInt(s)
    return isNaN(num) ? 0 : num
  }
  if (s.includes('hr') || s.includes('h') || s.includes('hour')) {
    const num = parseInt(s)
    return isNaN(num) ? 60 : num * 60
  }
  if (s.includes('d') || s.includes('day')) {
    const num = parseInt(s)
    return isNaN(num) ? 24 * 60 : num * 24 * 60
  }
  if (s.includes('w') || s.includes('week')) {
    const num = parseInt(s)
    return isNaN(num) ? 7 * 24 * 60 : num * 7 * 24 * 60
  }
  if (s.includes('mo') || s.includes('month')) {
    const num = parseInt(s)
    return isNaN(num) ? 30 * 24 * 60 : num * 30 * 24 * 60
  }
  return 999999
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

const changeActiveLifecycleState = (state: 'open' | 'closed' | 'archived') => {
  if (!activeConversation.value) return
  activeConversation.value.lifecycleState = state
  if (state === 'archived') {
    activeConversation.value.section = 'Resolved'
    addToast(`Conversation archived`, 'success')
  } else if (state === 'open') {
    activeConversation.value.section = 'Reply Required'
    addToast(`Conversation restored to Active`, 'success')
  } else if (state === 'closed') {
    activeConversation.value.section = 'Resolved'
    addToast(`Conversation closed`, 'info')
  }
  isLifecycleDropdownOpen.value = false
}

const crmCardState = ref<'unknown' | 'potential' | 'match-found' | 'matches-found' | 'new-channel'>('unknown')

const handleCrmCreateContact = () => {
  crmCardState.value = 'potential'
  addToast('Created potential lead profile in RakanSales', 'success')
}
const handleCrmReviewMatch = () => {
  crmCardState.value = 'match-found'
  addToast('Opening lead duplicate review workspace', 'info')
}
const handleCrmLinkEmail = () => {
  crmCardState.value = 'new-channel'
  addToast('Email melwong@kksteel.com linked to contact Mel Wong successfully!', 'success')
}

const inlineAssignAgent = ref('Ahmad Faizal')
const inlineAssignTags = ref(['Ahmad Faizal', 'Siti Nur Aisyah'])
const handleInlineAssignSave = () => {
  if (activeConversation.value) {
    activeConversation.value.assignedTo = inlineAssignAgent.value
    activeConversation.value.tags = [...inlineAssignTags.value]
    
    const id = activeConversation.value.id
    if (!chatMessages.value[id]) {
      chatMessages.value[id] = []
    }
    
    chatMessages.value[id].push({
      id: `sys-assign-${Date.now()}`,
      sender: 'System',
      isSelf: false,
      text: `${inlineAssignAgent.value} was assigned to this lead. Associated Tags: ${inlineAssignTags.value.join(', ')}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'system-log',
      logIcon: 'user',
      logClass: 'bg-green-50 text-green-700 border-green-200'
    })
    
    addToast(`Lead assigned to ${inlineAssignAgent.value} and tagged with ${inlineAssignTags.value.join(', ')}`, 'success')
  }
}

const selectedTemplate = ref('')
const templateOptions = [
  { value: 'follow_up', label: 'RakanSales Follow Up Template' },
  { value: 'welcome', label: 'Welcome/Intro Template' },
  { value: 'closing', label: 'Inactive Chat Closure Notification' }
]
const templatePreviews: Record<string, string> = {
  follow_up: "Hi Mel! Just checking if you have any questions about the plans we discussed earlier. Let us know!",
  welcome: "Hi! Thanks for contacting RakanSales. How can we help you accelerate your sales execution today?",
  closing: "Hi, we have not received a response from you for quite some time and will be closing this chat. Feel free to hit us up for any future enquiries, thank you!"
}
const handleSendTemplateInline = () => {
  if (!selectedTemplate.value) {
    addToast('Please select a template first', 'warning')
    return
  }
  const txt = templatePreviews[selectedTemplate.value]
  addToast('WhatsApp Template message sent successfully!', 'success')
  const id = selectedConversationId.value
  if (!chatMessages.value[id]) {
    chatMessages.value[id] = []
  }
  chatMessages.value[id].push({
    id: `tpl-sent-${Date.now()}`,
    sender: 'You',
    isSelf: true,
    text: txt,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    type: 'message',
    status: 'delivered',
    metaLabel: 'Template'
  })
  selectedTemplate.value = ''
  nextTick(() => {
    if (chatMessagesContainer.value) {
      chatMessagesContainer.value.scrollTop = chatMessagesContainer.value.scrollHeight
    }
  })
}

const composerMode = ref<'reply' | 'note'>('reply')
const newMessage = ref('')
const composerTextareaRef = ref<HTMLTextAreaElement | null>(null)
const slashMenuContainerRef = ref<HTMLElement | null>(null)
const slashPopupRef = ref<HTMLElement | null>(null)

// Slash Command State
const slashMenuOpen = ref(false)
const slashQuery = ref('')
const slashHighlightedIndex = ref(0)

onClickOutside(slashPopupRef, () => {
  slashMenuOpen.value = false
})

// Helper to resolve dynamic CRM template variables against active conversation contact details
const resolveTemplateForActiveContact = (template: CrmTemplate) => {
  const contact = activeConversation.value
  const fullName = contact?.sender || 'Valued Customer'
  const firstName = fullName.split(' ')[0] || 'Customer'
  const company = (contact as any)?.company || 'KK Steel Manufacturing Sdn Bhd'
  const phone = (contact as any)?.phone || '+6012 3456 7890'
  const email = (contact as any)?.email || 'customer@kksteel.com'
  const agent = 'Olivia Rhye'
  const agentFirst = 'Olivia'

  const context: Record<string, string> = {
    'contact.name': fullName,
    'contact.first_name': firstName,
    'company.name': company,
    'contact.phone': phone,
    'contact.email': email,
    'agent.name': agent,
    'agent.first_name': agentFirst,
    'meeting.link': 'https://cal.rakansales.com/discovery',
    'today.date': new Date().toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return resolveTemplateVariables(template.content, context)
}

// Filtered slash templates based on slashQuery
const filteredSlashTemplates = computed(() => {
  const q = slashQuery.value.trim().toLowerCase()
  if (!q) return defaultCrmTemplates.slice(0, 6)
  
  return defaultCrmTemplates.filter(t => 
    t.shortcut.toLowerCase().replace('/', '').includes(q) ||
    t.title.toLowerCase().includes(q) ||
    t.category.toLowerCase().includes(q) ||
    t.content.toLowerCase().includes(q)
  ).slice(0, 6)
})

// Scroll active item into view when navigating via arrow keys
const scrollSlashItemIntoView = () => {
  nextTick(() => {
    if (!slashMenuContainerRef.value) return
    const activeEl = slashMenuContainerRef.value.querySelector('.slash-item-active') as HTMLElement
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' })
    }
  })
}

// Handle slash trigger detection on input or cursor movements
const checkSlashCommand = () => {
  const text = newMessage.value
  const textarea = composerTextareaRef.value
  const cursorPos = textarea ? textarea.selectionStart : text.length
  const textBeforeCursor = text.slice(0, cursorPos)
  
  // Detect if user has typed a slash command token before cursor (e.g. "/" or "/welcome" or "hello /demo")
  const match = textBeforeCursor.match(/(?:^|\s)\/([a-zA-Z0-9_-]*)$/)
  
  if (match) {
    slashQuery.value = match[1].toLowerCase()
    slashMenuOpen.value = true
    slashHighlightedIndex.value = 0
  } else {
    slashMenuOpen.value = false
    slashQuery.value = ''
  }
}

// Insert selected slash template into message draft
const insertSlashTemplate = (template: CrmTemplate) => {
  const resolvedText = resolveTemplateForActiveContact(template)
  const text = newMessage.value
  const textarea = composerTextareaRef.value
  const cursorPos = textarea ? textarea.selectionStart : text.length
  const textBeforeCursor = text.slice(0, cursorPos)
  const textAfterCursor = text.slice(cursorPos)
  
  // Replace the trailing slash command match
  const replacedBefore = textBeforeCursor.replace(/(?:^|\s)\/[a-zA-Z0-9_-]*$/, (match) => {
    return match.startsWith(' ') ? ' ' + resolvedText : resolvedText
  })
  
  newMessage.value = replacedBefore + textAfterCursor
  slashMenuOpen.value = false
  slashQuery.value = ''
  
  addToast(`Template "${template.title}" inserted into draft!`, 'success')
  
  nextTick(() => {
    if (textarea) {
      textarea.focus()
      const newPos = replacedBefore.length
      textarea.setSelectionRange(newPos, newPos)
    }
  })
}

// Send standard chat reply message
const sendChatMessage = () => {
  const text = newMessage.value.trim()
  if (!text) return
  
  const id = selectedConversationId.value
  if (!chatMessages.value[id]) {
    chatMessages.value[id] = []
  }
  
  chatMessages.value[id].push({
    id: `msg-${Date.now()}`,
    sender: 'You',
    isSelf: true,
    text,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    type: 'message',
    status: 'delivered'
  })
  
  const conv = conversationsList.value.find(c => c.id === id)
  if (conv) {
    conv.message = `You: ${text}`
    conv.time = 'Just now'
    conv.isYou = true
    conv.updatedAt = Date.now()
    if (conv.section === 'Reply Required') {
      conv.rightBadge = ''
    }
  }
  
  newMessage.value = ''
  slashMenuOpen.value = false
  slashQuery.value = ''
  
  addToast('Message sent successfully!', 'success')
  scrollToBottom()
}

// Keyboard navigation in composer
const handleComposerKeydown = (e: KeyboardEvent) => {
  if (slashMenuOpen.value && filteredSlashTemplates.value.length > 0) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      slashHighlightedIndex.value = (slashHighlightedIndex.value + 1) % filteredSlashTemplates.value.length
      scrollSlashItemIntoView()
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      slashHighlightedIndex.value = (slashHighlightedIndex.value - 1 + filteredSlashTemplates.value.length) % filteredSlashTemplates.value.length
      scrollSlashItemIntoView()
      return
    }
    if (e.key === 'Enter' && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
      e.preventDefault()
      const target = filteredSlashTemplates.value[slashHighlightedIndex.value]
      if (target) {
        insertSlashTemplate(target)
      }
      return
    }
    if (e.key === 'Tab') {
      e.preventDefault()
      const target = filteredSlashTemplates.value[slashHighlightedIndex.value]
      if (target) {
        insertSlashTemplate(target)
      }
      return
    }
    if (e.key === 'Escape') {
      e.preventDefault()
      slashMenuOpen.value = false
      return
    }
  }

  // Ctrl+Enter or Cmd+Enter to send message
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault()
    if (composerMode.value === 'note') {
      addPrivateNoteFromComposer()
    } else {
      sendChatMessage()
    }
  }
}

const isAiAutoReplyOn = ref(true)
const toggleAiAutoReply = () => {
  isAiAutoReplyOn.value = !isAiAutoReplyOn.value
  addToast(isAiAutoReplyOn.value ? 'AI Auto-Reply enabled for this thread' : 'AI Auto-Reply disabled', 'info')
}

const activeFont = ref('Inter')
const activeFontSize = ref('16px')
const isFontDropdownOpen = ref(false)
const isFontSizeDropdownOpen = ref(false)

const emailTo = ref('melwong@kksteel.com')
const emailSubject = ref('RE: Looking for Website Design Agencies to Compete')
const emailVia = ref('jams@rakansales.com')
const isCcBccOpen = ref(false)
const emailCc = ref('')
const emailBcc = ref('lincoln@rakansales.com')

const fontOptions = ['Inter', 'Roboto', 'Outfit', 'Arial', 'Times New Roman']
const fontSizeOptions = ['12px', '14px', '16px', '18px', '24px']

const isHumanResponseBannerOpen = ref(true)
const isAiCasualResponseBannerOpen = ref(true)

// Typographic toolbar active states
const isBoldActive = ref(false)
const isItalicActive = ref(false)
const isUnderlineActive = ref(false)
const activeTextColor = ref('#1E293B')
const activeTextAlign = ref('left')
const isColorDropdownOpen = ref(false)

const composerStyles = computed(() => {
  return {
    fontFamily: activeFont.value === 'Inter' ? 'var(--font-inter, sans-serif)' : activeFont.value,
    fontSize: activeFontSize.value,
    fontWeight: isBoldActive.value ? 'bold' : 'normal',
    fontStyle: isItalicActive.value ? 'italic' : 'normal',
    textDecoration: isUnderlineActive.value ? 'underline' : 'none',
    color: activeTextColor.value,
    textAlign: activeTextAlign.value
  } as any
})

// Composer Prototype modals and popovers states
const isComposerTemplatePickerOpen = ref(false)
const isComposerSummaryOpen = ref(false)
const isComposerSummaryLoading = ref(false)
const isComposerMeetingOpen = ref(false)
const isComposerEmojiOpen = ref(false)
const isComposerAttachmentOpen = ref(false)
const isTypographyToolbarOpen = ref(false)

// Simulated attachment uploads progress
interface AttachmentFile {
  name: string
  size: string
  progress: number
  uploaded: boolean
}
const simulatedAttachments = ref<AttachmentFile[]>([])

// Simulated custom meeting values
const meetingTitle = ref('Discovery Call')
const meetingDate = ref('2026-06-01')
const meetingTime = ref('14:00')

const handleCasualResponseState = (state: string) => {
  addToast(`Conversation state updated to ${state}`, 'success')
  if (activeConversation.value) {
    activeConversation.value.rightBadge = state === 'Check In' ? 'Reply' : (state === 'Waiting' ? 'Waiting' : 'Reply')
  }
  isAiCasualResponseBannerOpen.value = false
}

const handleAcknowledgeAiReply = () => {
  isAiCasualResponseBannerOpen.value = false
  isAiAutoReplyOn.value = true
  
  if (activeConversation.value) {
    const id = activeConversation.value.id
    if (!chatMessages.value[id]) chatMessages.value[id] = []
    chatMessages.value[id].push({
      id: `sys-ack-${Date.now()}`,
      sender: 'System',
      isSelf: false,
      text: 'AI-Automated Reply acknowledged by Olivia Rhye. Active auto-reply begins in 5 hours.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'system-log',
      logIcon: 'sparkles',
      logClass: 'text-emerald-800 font-semibold bg-emerald-50/90 border-emerald-200 shadow-2xs'
    })
  }
  addToast('AI Automated Reply Acknowledged!', 'success')
}

const addPrivateNoteFromComposer = () => {
  const text = newMessage.value.trim()
  if (!text) return
  
  const id = selectedConversationId.value
  if (!chatMessages.value[id]) {
    chatMessages.value[id] = []
  }
  
  chatMessages.value[id].push({
    id: `note-${Date.now()}`,
    sender: 'Olivia Rhye',
    isSelf: false,
    text,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    type: 'private-note',
    noteAuthor: 'Olivia',
    noteAuthorAvatar: 'OL'
  })
  
  addToast('Internal Private Note recorded successfully!', 'success')
  newMessage.value = ''
  
  nextTick(() => {
    if (chatMessagesContainer.value) {
      chatMessagesContainer.value.scrollTop = chatMessagesContainer.value.scrollHeight
    }
  })
}

// Emoji insertion
const insertEmoji = (emoji: string) => {
  newMessage.value += emoji
  isComposerEmojiOpen.value = false
  addToast(`Inserted emoji: ${emoji}`, 'info')
}

// Simulated file attachments
const uploadMockFile = (name: string, size: string) => {
  if (simulatedAttachments.value.some(f => f.name === name)) {
    addToast('File already uploaded or uploading', 'warning')
    return
  }
  
  const newFile = ref<AttachmentFile>({
    name,
    size,
    progress: 0,
    uploaded: false
  })
  
  simulatedAttachments.value.push(newFile.value)
  
  const interval = setInterval(() => {
    if (newFile.value.progress < 100) {
      newFile.value.progress += 25
    } else {
      newFile.value.uploaded = true
      clearInterval(interval)
      addToast(`Uploaded ${name} successfully!`, 'success')
    }
  }, 200)
}

// Select a template from picker (insert into draft)
const handleSelectTemplate = (text: string, template: any) => {
  newMessage.value = text
  addToast(`Template "${template.title}" inserted into draft!`, 'success')
}

// Send template immediately
const handleSendTemplateDirect = (text: string, template: any) => {
  const id = selectedConversationId.value
  if (!chatMessages.value[id]) {
    chatMessages.value[id] = []
  }
  chatMessages.value[id].push({
    id: `msg-${Date.now()}`,
    sender: 'You',
    isSelf: true,
    text,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    type: 'message',
    status: 'delivered',
    metaLabel: template.shortcut || 'Template'
  })
  const conv = conversationsList.value.find(c => c.id === id)
  if (conv) {
    conv.message = `You: ${text}`
    conv.time = 'Just now'
    conv.isYou = true
    conv.updatedAt = Date.now()
  }
  addToast(`Sent "${template.title}" template message!`, 'success')
  scrollToBottom()
}

// Legacy fallback helper
const selectComposerTemplate = (text: string) => {
  newMessage.value = text
  isComposerTemplatePickerOpen.value = false
  addToast('Template inserted into composer draft!', 'success')
}

// AI Assistant Contextual Draft Generator
const isGeneratingAiDraft = ref(false)

const generateAiDraft = () => {
  if (isGeneratingAiDraft.value) return
  isGeneratingAiDraft.value = true
  
  const id = selectedConversationId.value
  const activeName = activeConversation.value?.sender || 'Customer'
  const firstName = activeName.split(' ')[0]
  
  let suggestedText = ''
  
  if (id === 'conv-1') {
    suggestedText = `Hi ${firstName}, regarding automated duplicate merging: RakanSales AI parses incoming webhooks in real time to match phone numbers and domains. If a match is flagged, agents can execute a 1-click merge right from the client drawer. Let me know if you'd like me to show you the workflow!`
  } else if (id === 'conv-2') {
    suggestedText = `Hi ${firstName}, you're very welcome! Feel free to let us know whenever you need help fine-tuning your team settings or integrations.`
  } else if (id === 'conv-3') {
    suggestedText = `Hi ${firstName}, thanks for reaching out! We'd love to walk you through our omnichannel sales integration tools. Would you be free for a 15-minute discovery demo this week? You can pick a convenient slot here: https://cal.rakansales.com/discovery`
  } else {
    if (newMessage.value.trim().length > 3) {
      suggestedText = `Hi ${firstName}, ${newMessage.value.trim()}. Please feel free to let us know if you need any further details!`
    } else {
      suggestedText = `Hi ${firstName}, thank you for reaching out to RakanSales! How can we assist your team with sales execution today?`
    }
  }

  setTimeout(() => {
    newMessage.value = suggestedText
    isGeneratingAiDraft.value = false
    addToast('✨ AI assistant generated reply draft from conversation context!', 'success')
  }, 400)
}

// Trigger AI auto-summarizer
const triggerComposerSummary = () => {
  isComposerSummaryOpen.value = true
  isComposerSummaryLoading.value = true
  
  setTimeout(() => {
    isComposerSummaryLoading.value = false
  }, 750)
}

// Add generated summary as private note to feed
const addSummaryAsPrivateNote = () => {
  const summaryText = `✨ [AI Conversation Summary]\n\n• Prospect Mel Wong (KK Steel) is interested in our C4 sales execution integration tools.\n• Lead Status: Hot Lead (High signature matching in active lead databases).\n• Next steps: reps should immediately target discovery meeting scheduling to qualify deal sizing.`
  
  const id = selectedConversationId.value
  if (!chatMessages.value[id]) {
    chatMessages.value[id] = []
  }
  
  chatMessages.value[id].push({
    id: `note-ai-${Date.now()}`,
    sender: 'AI Assistant',
    isSelf: false,
    text: summaryText,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    type: 'private-note',
    noteAuthor: 'AI Assistant',
    noteAuthorAvatar: 'AI'
  })
  
  isComposerSummaryOpen.value = false
  addToast('AI Conversation Summary appended to timeline!', 'success')
  
  nextTick(() => {
    if (chatMessagesContainer.value) {
      chatMessagesContainer.value.scrollTop = chatMessagesContainer.value.scrollHeight
    }
  })
}

// Schedule calendar meeting
const scheduleComposerMeeting = () => {
  if (!meetingTitle.value.trim()) {
    addToast('Please enter a meeting title', 'warning')
    return
  }
  
  const id = selectedConversationId.value
  if (!chatMessages.value[id]) {
    chatMessages.value[id] = []
  }
  
  const formattedTime = `${meetingDate.value} at ${meetingTime.value}`
  chatMessages.value[id].push({
    id: `sys-meet-${Date.now()}`,
    sender: 'System',
    isSelf: false,
    text: `📅 Meeting Scheduled: ${meetingTitle.value} with ${activeConversation.value.sender} on ${formattedTime}`,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    type: 'system-log',
    logIcon: 'clock',
    logClass: 'bg-blue-50/90 text-blue-700 border-blue-200 shadow-2xs'
  })
  
  isComposerMeetingOpen.value = false
  addToast(`Meeting scheduled for ${formattedTime}`, 'success')
  
  nextTick(() => {
    if (chatMessagesContainer.value) {
      chatMessagesContainer.value.scrollTop = chatMessagesContainer.value.scrollHeight
    }
  })
}

// Sidebar View Style ('chrono' vs 'queue')
const viewStyle = ref<'chrono' | 'queue'>('chrono')
const isPinnedExpanded = ref(true)
const expandedSections = ref<Record<string, boolean>>({
  today: true,
  yesterday: true,
  older: true
})

// Sorting Dropdown states
const isSortDropdownOpen = ref(false)
const sortContainerRef = ref<HTMLElement | null>(null)
const activeSort = ref<'newest' | 'oldest' | 'unread' | 'platform'>('newest')

onClickOutside(sortContainerRef, () => {
  isSortDropdownOpen.value = false
})

const sortConversations = (list: Conversation[]): Conversation[] => {
  const result = [...list]
  if (activeSort.value === 'newest') {
    result.sort((a, b) => {
      const diff = parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time)
      if (diff !== 0) return diff
      return (b.updatedAt || 0) - (a.updatedAt || 0)
    })
  } else if (activeSort.value === 'oldest') {
    result.sort((a, b) => {
      const diff = parseTimeToMinutes(b.time) - parseTimeToMinutes(a.time)
      if (diff !== 0) return diff
      return (a.updatedAt || 0) - (b.updatedAt || 0)
    })
  } else if (activeSort.value === 'unread') {
    result.sort((a, b) => b.unreadCount - a.unreadCount)
  } else if (activeSort.value === 'platform') {
    result.sort((a, b) => a.platform.localeCompare(b.platform))
  }
  return result
}

// Resizable Sidebar width state
const sidebarWidth = ref(380)
const isResizing = ref(false)
let startX = 0
let startWidth = 0

const startResize = (e: MouseEvent) => {
  isResizing.value = true
  startX = e.clientX
  startWidth = sidebarWidth.value
  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
  document.body.style.userSelect = 'none'
  document.body.style.cursor = 'col-resize'
}

const handleResize = (e: MouseEvent) => {
  if (!isResizing.value) return
  // Compute resizing delta from mousedown starting coordinate X
  const deltaX = e.clientX - startX
  // Clamp between 300px and 480px
  const newWidth = Math.max(300, Math.min(480, startWidth + deltaX))
  sidebarWidth.value = newWidth
  nextTick(() => {
    checkScroll()
  })
}

const stopResize = () => {
  isResizing.value = false
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
  document.body.style.userSelect = ''
  document.body.style.cursor = ''
}

const headerAgentSearchQuery = ref('')

const agentAssignOptions = [
  { value: 'Liv', label: 'Olivia (Me)', avatar: 'OL', role: 'Account Exec' },
  { value: 'Faizal', label: 'Ahmad Faizal', avatar: 'AF', role: 'Sales Representative' },
  { value: 'Aisyah', label: 'Siti Nur Aisyah', avatar: 'SN', role: 'Sales Representative' },
  { value: 'Rajesh', label: 'Rajesh Kumar', avatar: 'RK', role: 'Senior Consultant' },
  { value: 'WeiJie', label: 'Lim Wei Jie', avatar: 'LW', role: 'Support Specialist' },
  { value: 'Huda', label: 'Nurul Huda', avatar: 'NH', role: 'Sales Representative' },
  { value: 'Hafiz', label: 'Mohd Hafiz', avatar: 'MH', role: 'Sales Manager' },
  { value: 'Unassigned', label: 'Unassigned', avatar: 'UN', role: 'Queue' }
] as const

const headerFilteredAgents = computed(() => {
  const q = headerAgentSearchQuery.value.toLowerCase().trim()
  if (!q) return agentAssignOptions
  return agentAssignOptions.filter(a => 
    a.label.toLowerCase().includes(q) || 
    a.value.toLowerCase().includes(q) ||
    (a.role && a.role.toLowerCase().includes(q))
  )
})

// Re-map mock conversations to local reactive reference, adding assignedTo fields
const conversationsList = ref<Conversation[]>(
  mockData.omnichannel.conversations.map(c => ({
    ...c,
    assignedTo: c.isYou ? 'Faizal' : (c.id === 'conv-3' ? 'Faizal' : (c.id === 'conv-1' ? 'WeiJie' : (c.id === 'conv-2' ? 'Hafiz' : 'Unassigned'))),
    tags: c.tags ? [...c.tags] : [],
    selected: c.id === 'conv-1',
    lifecycleState: c.id === 'conv-6' ? 'archived' : (c.id === 'conv-7' ? 'closed' : 'open') as 'open' | 'closed' | 'archived',
    checked: false,
    isPinned: false,
    pinnedAt: 0,
    isFocus: (c as any).isFocus || false,
    focusAddedAt: (c as any).isFocus ? Date.now() - 3600000 : undefined
  }))
)

// Scrollable filter row controls
const pillsContainer = ref<HTMLElement | null>(null)
const showLeftArrow = ref(false)
const showRightArrow = ref(false)

const checkScroll = () => {
  const el = pillsContainer.value
  if (!el) return
  showLeftArrow.value = el.scrollLeft > 2
  showRightArrow.value = el.scrollLeft < (el.scrollWidth - el.clientWidth - 2)
}

const scrollContainer = (direction: 'left' | 'right') => {
  const el = pillsContainer.value
  if (!el) return
  const scrollAmount = direction === 'left' ? -120 : 120
  el.scrollBy({ left: scrollAmount, behavior: 'smooth' })
}

// Watchers and lifecycle hooks to refresh arrows
watch([viewMode, activeFilter], () => {
  nextTick(() => {
    checkScroll()
  })
})

const handleWindowResize = () => {
  checkScroll()
  if (window.innerWidth < 1150) {
    isRightDrawerOpen.value = false
  }
}

onMounted(() => {
  nextTick(() => {
    checkScroll()
    setTimeout(checkScroll, 150)
    if (window.innerWidth < 1150) {
      isRightDrawerOpen.value = false
    }
    window.addEventListener('resize', handleWindowResize)
    
    // Scroll the message feed container to the bottom so that newest messages are visible first
    scrollToBottom(false)
    setTimeout(() => {
      scrollToBottom(false)
    }, 100)
    setTimeout(() => {
      scrollToBottom(false)
    }, 250)
  })
})

// Selection states & helpers
const isAllChecked = computed(() => {
  const visible = filteredConversations.value
  return visible.length > 0 && visible.every(c => c.checked)
})

const checkedCount = computed(() => {
  return conversationsList.value.filter(c => c.checked).length
})

const toggleSelectAll = (e: Event) => {
  const checked = (e.target as HTMLInputElement).checked
  const visibleIds = filteredConversations.value.map(c => c.id)
  conversationsList.value.forEach(c => {
    if (visibleIds.includes(c.id)) {
      c.checked = checked
    }
  })
  addToast(checked ? `Selected all ${visibleIds.length} conversations` : 'Deselected all conversations', 'info')
}

const toggleSelectAllEvents = () => {
  conversationsList.value.forEach(c => c.checked = false)
  addToast('Deselected all conversations', 'info')
}

const handleToggleCheck = (id: string) => {
  const conv = conversationsList.value.find(c => c.id === id)
  if (conv) {
    conv.checked = !conv.checked
  }
}

// Bulk Actions Implementation
const bulkMarkRead = () => {
  const checkedItems = conversationsList.value.filter(c => c.checked)
  checkedItems.forEach(c => {
    c.unreadCount = 0
  })
  addToast(`Marked ${checkedItems.length} conversations as read`, 'success')
  conversationsList.value.forEach(c => c.checked = false)
}

const bulkManageTags = () => {
  const checkedItems = conversationsList.value.filter(c => c.checked)
  checkedItems.forEach(c => {
    if (!c.tags) c.tags = []
    if (!c.tags.includes('SMEAievent2026')) {
      c.tags.push('SMEAievent2026')
    }
  })
  addToast(`Added tag "SMEAievent2026" to ${checkedItems.length} conversations`, 'success')
  conversationsList.value.forEach(c => c.checked = false)
}

const bulkSync = () => {
  const checkedItems = conversationsList.value.filter(c => c.checked)
  checkedItems.forEach(c => {
    c.isSnoozed = !c.isSnoozed
    if (c.isSnoozed) {
      c.snoozedAt = Date.now()
    } else {
      delete c.snoozedAt
    }
  })
  addToast(`Updated snooze state for ${checkedItems.length} conversations`, 'info')
  conversationsList.value.forEach(c => c.checked = false)
}

const bulkAssignAgent = () => {
  const checkedItems = conversationsList.value.filter(c => c.checked)
  checkedItems.forEach(c => {
    c.assignedTo = 'Liv'
  })
  addToast(`Reassigned ${checkedItems.length} conversations to Me (Liv)`, 'success')
  conversationsList.value.forEach(c => c.checked = false)
}

const bulkDelete = () => {
  const checkedIds = conversationsList.value.filter(c => c.checked).map(c => c.id)
  conversationsList.value = conversationsList.value.filter(c => !checkedIds.includes(c.id))
  addToast(`Deleted ${checkedIds.length} conversations`, 'warning')
  
  if (checkedIds.includes(selectedConversationId.value)) {
    const remaining = conversationsList.value.filter(c => c.section !== 'Resolved')
    if (remaining.length > 0) selectConversation(remaining[0].id)
  }
}

// Applied Filters State from modal
const appliedFilters = ref<any>(null)

// Get currently selected conversation ID (defaults to 'conv-3' - Mel Wong)
const selectedConversationId = ref('conv-1')

interface QuotedMessage {
  sender: string
  text: string
  isSelf?: boolean
}

interface TimelineNode {
  id: string
  sender: string
  isSelf: boolean
  text: string
  time: string
  type?: 'message' | 'audio' | 'crm-match' | 'assign-lead' | 'session-expired' | 'private-note' | 'system-log'
  status?: 'sending' | 'sent' | 'delivered' | 'failed' | 'expired'
  audioUrl?: string
  audioDuration?: string
  crmMatchState?: 'unknown' | 'potential' | 'match-found' | 'matches-found' | 'new-channel'
  noteAuthor?: string
  noteAuthorAvatar?: string
  logIcon?: string
  logClass?: string
  metaLabel?: string
  quote?: QuotedMessage
}

// Set up rich historical chat transcripts mapped by conversation ID
const chatMessages = ref<Record<string, TimelineNode[]>>({
  'conv-1': [
    {
      id: 'm1_1',
      sender: 'Mei Ting',
      isSelf: false,
      text: "Hey Olivia! We're reviewing some of our import pipelines for duplicate lead detection. Can you share how your system flags duplicates?",
      time: '10:42 AM'
    },
    {
      id: 'm1_2',
      sender: 'You',
      isSelf: true,
      text: "Hey Mei Ting! Sure, RakanSales runs real-time matching checks. If you ping our AI chatbot here, it can actually show you the exact merge flow details!",
      time: '10:45 AM'
    },
    {
      id: 'm1_3',
      sender: 'Mei Ting',
      isSelf: false,
      text: "Actually, can I ask how RakanSales AI handles duplicate leads automatically?",
      time: '02:15 PM'
    },
    {
      id: 'm1_ai_1',
      sender: 'AI Chatbot',
      isSelf: true,
      text: "Hi Mei Ting! RakanSales AI cross-checks incoming customer contacts across active CRM databases. If a matching phone number, email domain, or company profile exists, it flags it as a 'Match Found' in the client details drawer so that agents can review and merge records with a single click. Would you like me to explain our deduplication rules?",
      time: '02:16 PM',
      type: 'message',
      metaLabel: 'AI Response'
    },
    {
      id: 'm1_4',
      sender: 'Mei Ting',
      isSelf: false,
      text: "That sounds simple enough. Does it support WhatsApp webhooks for automated merging?",
      time: '02:18 PM'
    },
    {
      id: 'm1_ai_2',
      sender: 'AI Chatbot',
      isSelf: true,
      quote: {
        sender: 'Mei Ting',
        text: "That sounds simple enough. Does it support WhatsApp webhooks for automated merging?"
      },
      text: "Yes, absolutely! WhatsApp messages received via our webhook system trigger real-time profile lookup pipelines. If the system resolves a duplicate, it sends a high-priority tag event to your team channel.",
      time: '02:19 PM',
      type: 'message',
      metaLabel: 'AI Response'
    }
  ],
  'conv-2': [
    {
      id: 'm2_1',
      sender: 'Chong Wei Jian',
      isSelf: false,
      text: 'Hey Liv — just wanted to say thank you for the help on setting up the company profiles!',
      time: '09:12 AM'
    },
    {
      id: 'm2_2',
      sender: 'You',
      isSelf: true,
      text: "You're very welcome, Chong! Let me know if you run into any other challenges with the platform integrations.",
      time: '09:15 AM'
    }
  ],
  'conv-3': [
    {
      id: 'm3_1',
      sender: 'Mel Wong',
      isSelf: false,
      text: 'Hello, interesting to learn about your product...',
      time: '11:40 AM',
      type: 'message'
    },
    {
      id: 'm3_audio',
      sender: 'Mel Wong',
      isSelf: false,
      text: '',
      time: '11:40 AM',
      type: 'audio',
      audioDuration: '00:08'
    },
    {
      id: 'm3_2',
      sender: 'You',
      isSelf: true,
      text: "Hey Mel, it's Olivia. Nice to meet you! Heard you're interested about our product.",
      time: '11:41 AM',
      type: 'message',
      status: 'delivered',
      metaLabel: 'Olivia'
    },
    {
      id: 'm3_auto',
      sender: 'You',
      isSelf: true,
      text: "Hey Mel, haven't heard back from you for awhile! Let us know if you are still interested.",
      time: '11:41 AM',
      type: 'message',
      status: 'delivered',
      metaLabel: 'Automated Reply'
    },
    {
      id: 'm3_tpl',
      sender: 'You',
      isSelf: true,
      text: "Hey Mel, haven't heard back from you for awhile! Let us know if you are still interested.",
      time: '11:41 AM',
      type: 'message',
      status: 'delivered',
      metaLabel: 'Template'
    },
    {
      id: 'm3_unread_divider',
      sender: 'System',
      isSelf: false,
      text: 'New Unread Messages',
      time: '',
      type: 'system-log',
      logIcon: 'bell',
      logClass: 'bg-rose-50 text-rose-700 border-rose-200 font-bold select-none m3_unread_divider_el shadow-2xs'
    },
    {
      id: 'm3_failed',
      sender: 'You',
      isSelf: true,
      text: "Nice to meet you!",
      time: '11:41 AM',
      type: 'message',
      status: 'failed'
    },
    {
      id: 'm3_expired',
      sender: 'You',
      isSelf: true,
      text: "Nice to meet you!",
      time: '11:41 AM',
      type: 'message',
      status: 'expired'
    },
    {
      id: 'm3_crm',
      sender: 'Mel Wong',
      isSelf: false,
      text: '',
      time: '11:41 AM',
      type: 'crm-match',
      crmMatchState: 'unknown'
    },
    {
      id: 'm3_assign',
      sender: 'System',
      isSelf: false,
      text: '',
      time: '11:42 AM',
      type: 'assign-lead'
    },
    {
      id: 'm3_session',
      sender: 'System',
      isSelf: false,
      text: '',
      time: '11:42 AM',
      type: 'session-expired'
    },
    {
      id: 'm3_note',
      sender: 'Olivia Rhye',
      isSelf: false,
      text: "Hi, we have not received a response from you for quite some time and will be closing this chat. Feel free to hit us up for any future enquiries, thank you!",
      time: '11:43 AM',
      type: 'private-note',
      noteAuthor: 'Olivia',
      noteAuthorAvatar: 'OL'
    },
    {
      id: 'm3_log1',
      sender: 'System',
      isSelf: false,
      text: 'New Contact Created',
      time: '11:43 AM',
      type: 'system-log',
      logIcon: 'check',
      logClass: 'bg-green-50 text-green-700 border-green-200'
    },
    {
      id: 'm3_log2',
      sender: 'System',
      isSelf: false,
      text: 'SuperAdmin assigned conversation to Olivia',
      time: '11:43 AM',
      type: 'system-log',
      logIcon: 'user'
    },
    {
      id: 'm3_log3',
      sender: 'System',
      isSelf: false,
      text: 'AI-Automated Reply will initiate in 5 hours. Stop Auto Reply',
      time: '11:44 AM',
      type: 'system-log',
      logIcon: 'sparkles',
      logClass: 'text-green-600 font-medium'
    },
    {
      id: 'm3_log4',
      sender: 'System',
      isSelf: false,
      text: 'Email melwong@kksteel.com linked to Mel Wong',
      time: '11:44 AM',
      type: 'system-log',
      logIcon: 'mail'
    },
    {
      id: 'm3_log5',
      sender: 'System',
      isSelf: false,
      text: 'Chat Snoozed for 12 hours. Unresolved at 9:00am.',
      time: '11:45 AM',
      type: 'system-log',
      logIcon: 'bell'
    },
    {
      id: 'm3_log6',
      sender: 'System',
      isSelf: false,
      text: 'Conversation reopened for free-form replies',
      time: '11:45 AM',
      type: 'system-log',
      logIcon: 'unlock'
    },
    {
      id: 'm3_log7',
      sender: 'System',
      isSelf: false,
      text: 'Snooze Thread Request',
      time: '11:46 AM',
      type: 'system-log',
      logIcon: 'clock',
      logClass: 'bg-gray-100 text-gray-700 border-gray-200'
    }
  ],
  'conv-4': [
    {
      id: 'm4_1',
      sender: 'Daniel Imran',
      isSelf: false,
      text: 'Thanks! Looks great! The dashboard is super quick.',
      time: 'Yesterday'
    }
  ],
  'conv-5': [
    {
      id: 'm5_1',
      sender: 'You',
      isSelf: true,
      text: "Hey Zac, it's been awhile since we synced. Let's schedule a brief call regarding RakanSales v4 details.",
      time: '3 days ago'
    }
  ],
  'conv-6': [
    {
      id: 'm6_1',
      sender: 'You',
      isSelf: true,
      text: 'Good news!! Jack accepted the custom contract proposal.',
      time: '1 day ago'
    }
  ],
  'conv-7': [
    {
      id: 'm7_1',
      sender: 'You',
      isSelf: true,
      text: "Sure thing, I'll have a look today and give you my feedback.",
      time: '1 hour ago'
    }
  ],
  'conv-8': [
    {
      id: 'm8_1',
      sender: 'You',
      isSelf: true,
      text: "I've just published the site again. Let me know if the assets load correctly on your end.",
      time: '2 hours ago'
    }
  ]
})

// Scratch Notepad state
const customerNotes = ref<Record<string, string>>({})
const scratchNote = ref('')

const loadScratchNote = () => {
  if (activeConversation.value) {
    scratchNote.value = customerNotes.value[activeConversation.value.id] || ''
  }
}

const saveCustomerNote = () => {
  if (!activeConversation.value) return
  customerNotes.value[activeConversation.value.id] = scratchNote.value
  addToast(`Scratch note updated for ${activeConversation.value.sender}`, 'success')
}

// Sync selection to refresh notebooks
const selectConversation = (id: string) => {
  selectedConversationId.value = id
  conversationsList.value.forEach(c => {
    c.selected = c.id === id
  })
  nextTick(() => {
    loadScratchNote()
    scrollToBottom(false)
    setTimeout(() => {
      scrollToBottom(false)
    }, 50)
    setTimeout(() => {
      scrollToBottom(false)
    }, 150)
  })
}

// Toggle selection filters
const setFilter = (filter: 'all' | 'reply' | 'late-reply' | 'unread' | 'mine' | 'focus') => {
  if (activeFilter.value === filter) {
    activeFilter.value = 'all'
    if (filter === 'mine') selectedInbox.value = 'All'
  } else {
    activeFilter.value = filter
    if (filter === 'mine') {
      selectedInbox.value = 'Mine'
    } else {
      selectedInbox.value = 'All'
    }
  }
}


const handleContextMenuAction = (type: string, item: Conversation) => {
  if (type === 'reply-required') {
    item.section = 'Reply Required'
    item.rightBadge = 'Reply'
    addToast(`Marked ${item.sender} as reply required`, 'success')
  } else if (type === 'snooze') {
    toggleSnooze(item)
  } else if (type === 'toggle-unread') {
    toggleUnread(item)
  } else if (type === 'toggle-snooze') {
    toggleSnooze(item)
  } else if (type === 'mute') {
    addToast(`Muted notifications for ${item.sender}`, 'info')
  } else if (type === 'archive') {
    item.section = 'Resolved'
    item.lifecycleState = 'archived'
    addToast(`Archived conversation with ${item.sender}`, 'success')
    if (selectedConversationId.value === item.id) {
      const remaining = conversationsList.value.filter(c => c.section !== 'Resolved')
      if (remaining.length > 0) selectConversation(remaining[0].id)
    }
  } else if (type === 'open-new-tab') {
    addToast(`Opening conversation with ${item.sender} in a new tab...`, 'info')
  } else if (type.startsWith('copy-toast-')) {
    const label = type.replace('copy-toast-', '')
    addToast(`Copied ${label} to clipboard!`, 'success')
  } else if (type === 'mark-spam') {
    addToast(`Marked ${item.sender} as spam and filtered from view`, 'warning')
    item.section = 'Resolved'
  } else if (type === 'delete') {
    conversationsList.value = conversationsList.value.filter(c => c.id !== item.id)
    addToast(`Deleted conversation with ${item.sender}`, 'warning')
    if (selectedConversationId.value === item.id) {
      const remaining = conversationsList.value.filter(c => c.section !== 'Resolved')
      if (remaining.length > 0) selectConversation(remaining[0].id)
    }
  } else if (type === 'toggle-focus') {
    item.isFocus = !item.isFocus
    if (item.isFocus) {
      item.focusAddedAt = Date.now()
    } else {
      item.focusAddedAt = undefined
    }
    addToast(item.isFocus ? `Added ${item.sender} to Focus` : `Removed ${item.sender} from Focus`, 'success')
  } else if (type === 'toggle-pin') {
    const isCurrentlyPinned = item.isPinned
    if (!isCurrentlyPinned) {
      // Limit to max 10 pins
      const pinnedCount = conversationsList.value.filter(c => c.isPinned).length
      if (pinnedCount >= 10) {
        addToast('Maximum limit of 10 pinned conversations reached!', 'warning')
        return
      }
      item.isPinned = true
      item.pinnedAt = Date.now()
      addToast(`Pinned conversation with ${item.sender}`, 'success')
    } else {
      item.isPinned = false
      item.pinnedAt = 0
      addToast(`Unpinned conversation with ${item.sender}`, 'info')
    }
  }
}

const handleContextMenuUpdateAttribute = (field: 'priority' | 'vip' | 'temperature' | 'agent' | 'add-tag' | 'remove-tag', value: any, item: Conversation) => {
  const target = conversationsList.value.find(c => c.id === item.id)
  if (!target) return
  
  if (field === 'priority') {
    if (!target.icons) target.icons = []
    target.icons = target.icons.filter(i => i !== 'alert' && i !== 'alert-medium' && i !== 'alert-low')
    
    if (value === 'High') {
      target.icons.push('alert')
      addToast(`Set priority of ${target.sender} to High`, 'success')
    } else if (value === 'Medium') {
      target.icons.push('alert-medium')
      addToast(`Set priority of ${target.sender} to Medium`, 'success')
    } else if (value === 'Low') {
      target.icons.push('alert-low')
      addToast(`Set priority of ${target.sender} to Low`, 'success')
    } else {
      addToast(`Set priority of ${target.sender} to Normal`, 'info')
    }
  } else if (field === 'vip') {
    if (!target.icons) target.icons = []
    if (value) {
      if (!target.icons.includes('crown')) target.icons.push('crown')
      addToast(`${target.sender} marked as VIP`, 'success')
    } else {
      target.icons = target.icons.filter(i => i !== 'crown')
      addToast(`${target.sender} removed from VIP status`, 'info')
    }
  } else if (field === 'temperature') {
    if (!target.tags) target.tags = []
    
    const isHotActive = target.tags.includes('VIP-Tier')
    const isWarmActive = target.tags.includes('Temp-Warm')
    const isColdActive = target.tags.includes('Temp-Cold')
    
    // Clear all existing temperature tags first
    target.tags = target.tags.filter(t => t !== 'VIP-Tier' && t !== 'Temp-Warm' && t !== 'Temp-Cold')
    
    if (value === 'Hot') {
      if (isHotActive) {
        addToast(`Removed lead temperature for ${target.sender}`, 'info')
      } else {
        target.tags.push('VIP-Tier')
        addToast(`Set lead temperature for ${target.sender} to Hot`, 'success')
      }
    } else if (value === 'Warm') {
      if (isWarmActive) {
        addToast(`Removed lead temperature for ${target.sender}`, 'info')
      } else {
        target.tags.push('Temp-Warm')
        addToast(`Set lead temperature for ${target.sender} to Warm`, 'success')
      }
    } else if (value === 'Cold') {
      if (isColdActive) {
        addToast(`Removed lead temperature for ${target.sender}`, 'info')
      } else {
        target.tags.push('Temp-Cold')
        addToast(`Set lead temperature for ${target.sender} to Cold`, 'success')
      }
    } else if (value === 'Reset') {
      addToast(`Removed lead temperature for ${target.sender}`, 'info')
    }
  } else if (field === 'agent') {
    target.assignedTo = value
    const found = agentAssignOptions.find(a => a.value === value)
    const label = found ? found.label : (value === 'Liv' ? 'Me (Liv)' : value)
    addToast(`Reassigned ${target.sender} to ${label}`, 'success')
  } else if (field === 'add-tag') {
    if (!target.tags) target.tags = []
    if (!target.tags.includes(value)) {
      target.tags.push(value)
      addToast(`Added tag "${value}" to ${target.sender}`, 'success')
    }
  } else if (field === 'remove-tag') {
    if (!target.tags) target.tags = []
    target.tags = target.tags.filter(t => t !== value)
    addToast(`Removed tag "${value}" from ${target.sender}`, 'info')
  }
}

const handleAssigneeFilterSelect = (val: 'All' | 'Mine' | 'Unassigned' | 'Participating' | 'Resolved' | 'Archived') => {
  selectedInbox.value = val
  if (val === 'All') {
    activeFilter.value = 'all'
  } else if (val === 'Mine') {
    activeFilter.value = 'mine'
  } else {
    activeFilter.value = 'all'
  }
  const label = val === 'All' ? 'All Conversations' : val === 'Mine' ? 'Mine' : val
  addToast(`Filtering by Quick Filter: ${label}`, 'info')
}

const handleFiltersApply = (filters: any) => {
  appliedFilters.value = JSON.parse(JSON.stringify(filters))
  
  // Connect applied filters directly to active filter and selected assignee states
  if (filters.quick.assigned === 'Mine') {
    selectedInbox.value = 'Mine'
    activeFilter.value = 'mine'
  } else if (filters.quick.assigned === 'All') {
    selectedInbox.value = 'All'
    activeFilter.value = 'all'
  }

  if (filters.quick.status === 'Resolved' || filters.quick.status === 'Resolve') {
    selectedInbox.value = 'Resolved'
    addToast('Status filter set to Resolved threads.', 'info')
  }
}

// Dynamic Filter logic (Excluding resolved items unless on Resolved filter)
const filteredConversations = computed(() => {
  let list = (selectedInbox.value === 'Resolved' || (appliedFilters.value && (appliedFilters.value.quick.status === 'Resolved' || appliedFilters.value.quick.status === 'Resolve')))
    ? conversationsList.value.filter(c => c.section === 'Resolved' || c.lifecycleState === 'closed')
    : conversationsList.value.filter(c => c.section !== 'Resolved' && c.lifecycleState !== 'closed')

  // Apply search query filter
  const query = searchQuery.value.toLowerCase().trim()
  if (query) {
    list = list.filter(c => 
      c.sender.toLowerCase().includes(query) || 
      c.message.toLowerCase().includes(query)
    )
  }

  // Apply active pill filter
  if (activeFilter.value === 'reply') {
    list = list.filter(c => c.rightBadge === 'Reply' && !isSlaBreached(c))
  } else if (activeFilter.value === 'late-reply') {
    list = list.filter(c => c.rightBadge === 'Late' || c.rightBadge === 'Late Reply' || isSlaBreached(c))
  } else if (activeFilter.value === 'unread') {
    list = list.filter(c => c.unreadCount > 0)
  } else if (activeFilter.value === 'focus') {
    list = list.filter(c => c.isFocus)
  }

  // Apply selected inbox filter scope
  if (selectedInbox.value === 'Mine') {
    list = list.filter(c => c.assignedTo === 'Liv')
  } else if (selectedInbox.value === 'Unassigned') {
    list = list.filter(c => c.assignedTo === 'Unassigned')
  } else if (selectedInbox.value === 'Participating') {
    list = list.filter(c => {
      const hasSelfMsg = chatMessages.value[c.id]?.some(m => m.isSelf)
      return c.assignedTo === 'Liv' || hasSelfMsg
    })
  } else if (selectedInbox.value === 'Archived') {
    list = list.filter(c => c.lifecycleState === 'archived')
  }

  // Apply Advanced Modal Filters if set
  if (appliedFilters.value) {
    const af = appliedFilters.value
    
    // Quick Status Filter
    if (af.quick.status === 'Open') {
      list = list.filter(c => c.lifecycleState === 'open' && c.section !== 'Resolved')
    } else if (af.quick.status === 'Resolved' || af.quick.status === 'Resolve') {
      list = conversationsList.value.filter(c => c.section === 'Resolved' || c.lifecycleState === 'closed')
    } else if (af.quick.status === 'Pending') {
      list = list.filter(c => c.section === 'Waiting & Snoozed' || c.isSnoozed)
    } else if (af.quick.status === 'Archived') {
      list = conversationsList.value.filter(c => c.lifecycleState === 'archived')
    }

    // Quick Temperature Filter
    if (af.quick.temperature === 'Hot') {
      list = list.filter(c => c.tags && c.tags.includes('VIP-Tier'))
    } else if (af.quick.temperature === 'Warm') {
      list = list.filter(c => c.tags && c.tags.includes('Temp-Warm'))
    } else if (af.quick.temperature === 'Cold') {
      list = list.filter(c => c.tags && c.tags.includes('Temp-Cold'))
    }

    // Quick Priority Filter
    if (af.quick.priority === 'High') {
      list = list.filter(c => (c.icons as string[] | undefined)?.includes('alert'))
    } else if (af.quick.priority === 'Medium') {
      list = list.filter(c => (c.icons as string[] | undefined)?.includes('alert-medium'))
    } else if (af.quick.priority === 'Low') {
      list = list.filter(c => (c.icons as string[] | undefined)?.includes('alert-low'))
    }

    // Attributes: Channel Filter (supports multi-channel array or string)
    if (af.more.channels && af.more.channels.length > 0) {
      list = list.filter(c => af.more.channels.some((ch: string) => c.platform.toLowerCase().includes(ch.toLowerCase())))
    } else if (af.more.channel && af.more.channel !== 'All') {
      list = list.filter(c => c.platform.toLowerCase() === af.more.channel.toLowerCase())
    }

    // Attributes: Assignee matching (supports multi-assignee array or string)
    if (af.more.assignees && af.more.assignees.length > 0) {
      list = list.filter(c => af.more.assignees.includes(c.assignedTo))
    } else if (af.more.assignee && af.more.assignee !== 'All') {
      list = list.filter(c => c.assignedTo === af.more.assignee)
    }

    // Attributes: Inbox Name matching
    if (af.more.inboxNames && af.more.inboxNames.length > 0) {
      list = list.filter(c => {
        return af.more.inboxNames.some((inbox: string) => 
          c.sender.toLowerCase().includes(inbox.replace('_', '').toLowerCase())
        )
      })
    }

    // Attributes: Team Name matching
    if (af.more.teamNames && af.more.teamNames.length > 0) {
      list = list.filter(c => {
        return af.more.teamNames.some((team: string) => 
          c.assignedTo === 'Liv' && team.toLowerCase() === 'sales'
        )
      })
    }
  }

  return list
})

// Pinned conversations computed (sorted oldest-pin-first)
const pinnedConversations = computed(() => {
  return filteredConversations.value.filter(c => c.isPinned).sort((a, b) => (a.pinnedAt || 0) - (b.pinnedAt || 0))
})

// Sections computed filters (excluding pinned items to prevent duplication)
const replyRequiredConversations = computed(() => {
  const list = filteredConversations.value.filter(c => c.section === 'Reply Required' && !c.isPinned)
  return sortConversations(list)
})

const waitingConversations = computed(() => {
  const list = filteredConversations.value.filter(c => c.section === 'Waiting & Snoozed' && !c.isPinned)
  return sortConversations(list)
})

// Unpinned chronological conversations for time-relative view (sorted chronologically, most recent first)
const unpinnedChronoConversations = computed(() => {
  const list = filteredConversations.value.filter(c => !c.isPinned)
  return sortConversations(list)
})

// Grouped chronological conversations by Today, Yesterday, and Older
const groupedChronoConversations = computed(() => {
  const list = unpinnedChronoConversations.value
  const groups = [
    { id: 'today', title: 'Today', items: [] as Conversation[] },
    { id: 'yesterday', title: 'Yesterday', items: [] as Conversation[] },
    { id: 'older', title: 'Older', items: [] as Conversation[] }
  ]
  
  list.forEach(c => {
    const min = parseTimeToMinutes(c.time)
    if (min < 24 * 60) {
      groups[0].items.push(c)
    } else if (min >= 24 * 60 && min <= 48 * 60) {
      groups[1].items.push(c)
    } else {
      groups[2].items.push(c)
    }
  })
  
  return groups.filter(g => g.items.length > 0)
})

// Current active conversation details
const activeConversation = computed(() => {
  return conversationsList.value.find(c => c.id === selectedConversationId.value) || conversationsList.value[2]
})

// Dynamic Mock Chat Messages based on user selection
const activeChatMessages = computed(() => {
  const id = selectedConversationId.value
  return chatMessages.value[id] || []
})

const chatMessagesContainer = ref<HTMLElement | null>(null)
const showJumpToLatest = ref(false)

const handleChatScroll = (e: Event) => {
  const el = e.target as HTMLElement
  if (!el) return
  showJumpToLatest.value = (el.scrollHeight - el.scrollTop - el.clientHeight) > 200
}

const scrollToBottom = (smooth: boolean | Event = true) => {
  const isSmooth = typeof smooth === 'boolean' ? smooth : true
  nextTick(() => {
    if (chatMessagesContainer.value) {
      if (isSmooth) {
        chatMessagesContainer.value.scrollTo({
          top: chatMessagesContainer.value.scrollHeight,
          behavior: 'smooth'
        })
      } else {
        chatMessagesContainer.value.scrollTop = chatMessagesContainer.value.scrollHeight
      }
    }
  })
}

// Side Shortcuts: Snoozing & Unread
const toggleSnooze = (item: any) => {
  item.isSnoozed = !item.isSnoozed
  if (item.isSnoozed) {
    item.snoozedAt = Date.now()
    item.section = 'Waiting & Snoozed'
    item.rightBadge = 'Waiting'
    addToast(`Muted / Snoozed conversation with ${item.sender} for 12 hours`, 'info')
  } else {
    delete item.snoozedAt
    item.section = 'Reply Required'
    item.rightBadge = 'Reply'
    addToast(`Unmuted / Reactivated conversation with ${item.sender}`, 'success')
  }
}

const toggleUnread = (item: any) => {
  if (item.unreadCount > 0) {
    item.unreadCount = 0
    addToast(`Marked ${item.sender} as read`, 'success')
  } else {
    item.unreadCount = 3
    addToast(`Marked ${item.sender} as unread`, 'info')
  }
}

const reassignActiveConversation = (agent: string) => {
  if (activeConversation.value) {
    activeConversation.value.assignedTo = agent
    const found = agentAssignOptions.find(a => a.value === agent)
    const label = found ? found.label : (agent === 'Liv' ? 'Me (Liv)' : agent)
    addToast(`Assigned thread to ${label}`, 'success')
    
    const id = activeConversation.value.id
    if (!chatMessages.value[id]) {
      chatMessages.value[id] = []
    }
    chatMessages.value[id].push({
      id: `sys-assign-${Date.now()}`,
      sender: 'System',
      isSelf: false,
      text: `Thread assigned to ${label}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'system-log',
      logIcon: 'user',
      logClass: 'bg-green-50 text-green-700 border-green-200'
    })
  }
  isHeaderAssignDropdownOpen.value = false
}

const resolveActiveConversation = () => {
  if (!activeConversation.value) return
  const name = activeConversation.value.sender
  activeConversation.value.section = 'Resolved'
  activeConversation.value.lifecycleState = 'closed'
  addToast(`Resolved thread with ${name}`, 'success')
  
  // Auto-select another active conversation
  const remaining = conversationsList.value.filter(c => c.section !== 'Resolved')
  if (remaining.length > 0) {
    selectConversation(remaining[0].id)
  }
}

const reopenActiveConversation = () => {
  if (!activeConversation.value) return
  activeConversation.value.section = 'Reply Required'
  activeConversation.value.rightBadge = 'Reply'
  activeConversation.value.lifecycleState = 'open'
  addToast(`Reopened conversation with ${activeConversation.value.sender}`, 'success')
}

// Custom Tags Editor
const availableTags = ['SMEAievent2026', '2026Q2', 'VIP-Tier', 'Lead-Nurture', 'Follow-up']

const addCustomTag = (tag: string) => {
  if (!activeConversation.value) return
  if (!activeConversation.value.tags) activeConversation.value.tags = []
  if (!activeConversation.value.tags.includes(tag)) {
    activeConversation.value.tags.push(tag)
    addToast(`Added tag "${tag}"`, 'success')
  }
}

const removeCustomTag = (tag: string) => {
  if (!activeConversation.value || !activeConversation.value.tags) return
  activeConversation.value.tags = activeConversation.value.tags.filter(t => t !== tag)
  addToast(`Removed tag "${tag}"`, 'info')
}

// Tutorial Modal State
const isTutorialOpen = ref(false)

// COMPOSE NEW CONVERSATION INTERACTION (Custom Modal)
const isComposeOpen = ref(false)
const composeName = ref('')
const composeMessage = ref('')
const composePlatform = ref('WhatsApp')

const handleCreateConversation = () => {
  if (!composeName.value.trim() || !composeMessage.value.trim()) return

  const newId = `conv-${Date.now()}`
  const newConv = {
    id: newId,
    sender: composeName.value.trim(),
    platform: composePlatform.value,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    avatarFallback: 'NC',
    status: 'online',
    time: 'Just now',
    unreadCount: 0,
    rightBadge: 'Reply',
    icons: [],
    section: 'Reply Required',
    message: composeMessage.value.trim(),
    isYou: false,
    selected: false,
    assignedTo: 'Liv',
    tags: [],
    lifecycleState: 'open' as const
  }

  // Prepend to list
  conversationsList.value.unshift(newConv)

  // Load initial chat message thread
  chatMessages.value[newId] = [
    {
      id: `msg-init-${Date.now()}`,
      sender: newConv.sender,
      isSelf: false,
      text: newConv.message,
      time: 'Just now'
    }
  ]

  // Select it
  selectConversation(newId)

  // Reset fields
  composeName.value = ''
  composeMessage.value = ''
  isComposeOpen.value = false
  addToast(`New thread created for ${newConv.sender}`, 'success')
}

// Initialize scratchpad notes
nextTick(() => {
  loadScratchNote()
})
</script>

<template>
  <div class="flex h-full w-full bg-white overflow-hidden text-sm relative">

    <!-- TOAST ALERTS OVERLAY -->
    <ToastNotifications :toasts="toasts" />

    <!-- HOW TO USE TUTORIAL MODAL -->
    <OmnichannelTutorialModal v-model="isTutorialOpen" />

    <!-- LEFT PANEL: Conversation List Sidebar (Resizable) -->
    <aside 
      :style="{ width: sidebarWidth + 'px', maxWidth: sidebarWidth + 'px', minWidth: '300px' }"
      class="border-r border-gray-200 flex flex-col bg-white h-full shrink-0 select-none relative z-10"
    >
      <!-- Resizer Handle -->
      <div 
        @mousedown="startResize" 
        class="absolute top-0 right-0 w-[4px] h-full cursor-col-resize hover:bg-[#23B750]/40 active:bg-[#23B750]/60 transition-all select-none z-30 group/resizer"
      >
        <div class="w-[1.5px] h-10 bg-gray-300 absolute top-1/2 -translate-y-1/2 right-[1px] rounded opacity-0 group-hover/resizer:opacity-100 transition-opacity"></div>
      </div>
      
      <!-- Conversations Header -->
      <div class="px-4 pt-4 pb-3 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <h1 class="text-xl font-bold text-gray-900 tracking-tight">Conversations</h1>
          <!-- Dynamic Count Badging Pill -->
          <!-- Counter pill with tooltip -->
          <div class="relative group">
            <div class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gray-100 text-xs font-semibold text-gray-500 cursor-default">
              <span>{{ conversationsList.filter(c => c.section !== 'Resolved').length }}</span>
              <span class="text-gray-300 font-normal select-none">•</span>
              <span class="text-red-500 font-bold">{{ conversationsList.filter(c => c.unreadCount > 0 && c.section !== 'Resolved').length }}</span>
            </div>
            <!-- Tooltip -->
            <div class="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-[9999] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              <div class="bg-gray-900 text-white text-[11px] leading-snug rounded-lg px-3 py-2 shadow-xl whitespace-nowrap flex flex-col gap-1">
                <div class="flex items-center gap-2">
                  <span class="inline-block w-2 h-2 rounded-full bg-gray-400"></span>
                  <span class="text-gray-300">Total active:</span>
                  <span class="font-semibold text-white">{{ conversationsList.filter(c => c.section !== 'Resolved').length }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="inline-block w-2 h-2 rounded-full bg-red-400"></span>
                  <span class="text-gray-300">Unread:</span>
                  <span class="font-semibold text-red-400">{{ conversationsList.filter(c => c.unreadCount > 0 && c.section !== 'Resolved').length }}</span>
                </div>
              </div>
              <!-- Arrow -->
              <div class="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 bg-gray-900 rotate-45 rounded-sm"></div>
            </div>
          </div>

          <!-- How to Use button (Dev mode trigger) -->
          <button
            @click="isTutorialOpen = true"
            title="How to Use — Omnichannel Guide"
            class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-gray-200 bg-white text-[11px] font-semibold text-gray-400 hover:text-[#23B750] hover:border-[#23B750]/40 hover:bg-[#23B750]/5 transition-all cursor-pointer select-none"
          >
            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            <span>Guide</span>
          </button>
        </div>
        
        <!-- Compose action button triggers custom modal -->
        <button 
          @click="isComposeOpen = true"
          class="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors border border-gray-200 bg-white cursor-pointer"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 20h9"/>
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
          </svg>
        </button>
      </div>

      <!-- Search Bar and Action Controls -->
      <div class="px-4 pb-3 flex items-center gap-2">
        <div class="relative flex-1">
          <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search Conversations" 
            class="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-gray-250 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-gray-400 font-medium"
          />
        </div>
        
        <!-- Sort Dropdown selector container -->
        <div ref="sortContainerRef" class="relative">
          <button 
            type="button"
            @click.stop="isSortDropdownOpen = !isSortDropdownOpen"
            title="Sort conversations"
            class="p-1.5 rounded-md transition-all border border-gray-200 bg-white text-gray-500 hover:text-gray-800 hover:bg-gray-50 cursor-pointer outline-none hover:scale-105 active:scale-95 flex items-center justify-center shrink-0"
          >
            <!-- Sort icon -->
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m21 16-4 4-4-4"/>
              <path d="M17 20V4"/>
              <path d="m3 8 4-4 4 4"/>
              <path d="M7 4v16"/>
            </svg>
          </button>

          <!-- Sorting Options Dropdown overlay -->
          <div 
            v-if="isSortDropdownOpen"
            class="absolute right-0 mt-1.5 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-[100] py-1 select-none font-semibold text-[11px]"
          >
            <div class="px-3 py-1 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Sort by</div>
            
            <button 
              type="button"
              @click="activeSort = 'newest'; isSortDropdownOpen = false"
              class="w-full text-left px-3 py-2 flex items-center justify-between cursor-pointer rounded-md transition-colors"
              :class="[activeSort === 'newest' ? 'bg-[#23B750] text-white font-bold' : 'text-slate-700 hover:bg-slate-50']"
            >
              <span>Newest Message</span>
              <svg v-if="activeSort === 'newest'" class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            </button>

            <button 
              type="button"
              @click="activeSort = 'oldest'; isSortDropdownOpen = false"
              class="w-full text-left px-3 py-2 flex items-center justify-between cursor-pointer rounded-md transition-colors"
              :class="[activeSort === 'oldest' ? 'bg-[#23B750] text-white font-bold' : 'text-slate-700 hover:bg-slate-50']"
            >
              <span>Oldest Message</span>
              <svg v-if="activeSort === 'oldest'" class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            </button>

            <button 
              type="button"
              @click="activeSort = 'unread'; isSortDropdownOpen = false"
              class="w-full text-left px-3 py-2 flex items-center justify-between cursor-pointer rounded-md transition-colors"
              :class="[activeSort === 'unread' ? 'bg-[#23B750] text-white font-bold' : 'text-slate-700 hover:bg-slate-50']"
            >
              <span>Unread Count</span>
              <svg v-if="activeSort === 'unread'" class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            </button>

            <button 
              type="button"
              @click="activeSort = 'platform'; isSortDropdownOpen = false"
              class="w-full text-left px-3 py-2 flex items-center justify-between cursor-pointer rounded-md transition-colors"
              :class="[activeSort === 'platform' ? 'bg-[#23B750] text-white font-bold' : 'text-slate-700 hover:bg-slate-50']"
            >
              <span>Platform Name</span>
              <svg v-if="activeSort === 'platform'" class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            </button>
          </div>
        </div>
        
        <!-- Funnel filter button with notification badge 3 to open full-fidelity Filter Modal -->
        <button 
          @click="isFiltersModalOpen = true"
          title="Open Filters"
          class="relative p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors border border-gray-200 bg-white cursor-pointer"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
          </svg>
          <span class="absolute -top-1 -right-1 w-4 h-4 bg-[#23B750] text-white rounded-full text-[9px] font-bold flex items-center justify-center border border-white">3</span>
        </button>
      </div>

      <!-- Filters and Actions Header Row (Dynamic Transition) -->
      <div class="px-4 pb-3 min-h-[40px] flex items-center select-none overflow-visible relative z-30 bg-white">
        <transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 -translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-1"
          mode="out-in"
          @after-enter="checkScroll"
        >
          <!-- Inline Bulk Actions Bar (Shown when items are selected) -->
          <div v-if="checkedCount > 0" key="bulk-actions" class="w-full flex items-center justify-between">
            <div class="flex items-center gap-3">
              <!-- Green active checkbox -->
              <div 
                @click="toggleSelectAllEvents"
                class="w-6 h-6 rounded-md bg-[#23B750] text-white flex items-center justify-center cursor-pointer shadow-none hover:bg-[#1f9f45] transition-all hover:scale-105 active:scale-95"
              >
                <svg class="w-4 h-4 stroke-current stroke-[3.5]" fill="none" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span class="text-[13px] font-bold text-gray-800 tracking-tight leading-none">
                {{ checkedCount }} Selected
              </span>
            </div>

            <!-- Outlined Grey Action Buttons -->
            <div class="flex items-center gap-1.5">
              <!-- Button 1: Mark Read -->
              <button 
                @click="bulkMarkRead"
                title="Mark as Read"
                class="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 text-gray-400 hover:text-gray-700 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-none"
              >
                <svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                  <polyline points="9 11 12 14 16 9" class="stroke-[2.5]" />
                </svg>
              </button>

              <!-- Button 2: Tag -->
              <button 
                @click="bulkManageTags"
                title="Add Tag"
                class="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 text-gray-400 hover:text-gray-700 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-none"
              >
                <svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                  <line x1="7" y1="7" x2="7.01" y2="7" stroke-width="2.5" stroke-linecap="round"/>
                </svg>
              </button>

              <!-- Button 3: Sync/Snooze -->
              <button 
                @click="bulkSync"
                title="Snooze / Toggle Waiting"
                class="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 text-gray-400 hover:text-gray-700 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-none"
              >
                <svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
                </svg>
              </button>

              <!-- Button 4: Reassign -->
              <button 
                @click="bulkAssignAgent"
                title="Assign to Me"
                class="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 text-gray-400 hover:text-gray-700 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-none"
              >
                <svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </button>

              <!-- Button 5: Delete -->
              <button 
                @click="bulkDelete"
                title="Delete Conversations"
                class="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 text-red-400 hover:text-red-600 hover:border-red-200 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-none"
              >
                <svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  <line x1="10" y1="11" x2="10" y2="17"/>
                  <line x1="14" y1="11" x2="14" y2="17"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Quick Filters Pills Row with Scroll Overlay (Shown when no items selected) -->
          <div v-else key="filters" class="w-full flex items-center gap-1.5 overflow-visible select-none">
            <!-- Scrollable Sub-container (Pills) -->
            <div class="relative flex-1 min-w-0 overflow-hidden flex items-center h-8">
              
              <!-- Left dynamic gradient scroll overlay -->
              <transition
                enter-active-class="transition duration-200"
                enter-from-class="opacity-0 translate-x-[-4px]"
                enter-to-class="opacity-100 translate-x-0"
                leave-active-class="transition duration-150"
                leave-from-class="opacity-100 translate-x-0"
                leave-to-class="opacity-0 translate-x-[-4px]"
              >
                <div v-if="showLeftArrow" class="absolute left-0 top-0 bottom-0 flex items-center justify-start w-16 bg-gradient-to-r from-white via-white/90 to-transparent z-30 pointer-events-none">
                  <button 
                    type="button"
                    @click="scrollContainer('left')"
                    class="w-5 h-5 rounded-full border border-gray-200 bg-white shadow-none flex items-center justify-center text-gray-500 hover:text-gray-800 transition-all hover:scale-110 active:scale-95 cursor-pointer ml-0.5 pointer-events-auto"
                  >
                    <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="15 18 9 12 15 6"/>
                    </svg>
                  </button>
                </div>
              </transition>
              <!-- Scrollable pills list -->
              <div 
                ref="pillsContainer"
                @scroll="checkScroll"
                class="flex gap-1.5 items-center overflow-x-auto scrollbar-none scroll-smooth w-full px-0.5 py-0.5"
              >

                
                <InboxDropdown 
                  class="flex-shrink-0"
                  :selected-inbox="selectedInbox"
                  v-model:customer-search-query="customerSearchQuery"
                  @select="handleAssigneeFilterSelect"
                />
                <!-- Sales Mode status pills -->
                <template v-if="viewMode === 'sales'">
                  <button 
                    @click="setFilter('late-reply')"
                    :class="[
                      'px-3.5 py-1 text-[11px] font-medium transition-all duration-200 flex-shrink-0 cursor-pointer rounded-full border shadow-none outline-none h-7 flex items-center justify-center',
                      activeFilter === 'late-reply'
                        ? 'border-green-200 bg-green-50 text-[#23B750]'
                        : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100/70 hover:text-gray-900 hover:border-gray-300'
                    ]"
                  >
                    Late <span class="text-gray-300 font-normal select-none mx-0.5">•</span> {{ conversationsList.filter(c => c.section !== 'Resolved' && (c.rightBadge === 'Late' || c.rightBadge === 'Late Reply' || isSlaBreached(c))).length }}
                  </button>
                  
                  <button 
                    @click="setFilter('focus')"
                    :class="[
                      'px-3.5 py-1 text-[11px] font-medium transition-all duration-200 flex-shrink-0 cursor-pointer rounded-full border shadow-none outline-none h-7 flex items-center justify-center',
                      activeFilter === 'focus'
                        ? 'border-green-200 bg-green-50 text-[#23B750]'
                        : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100/70 hover:text-gray-900 hover:border-gray-300'
                    ]"
                  >
                    Focus <span class="text-gray-300 font-normal select-none mx-0.5">•</span> {{ conversationsList.filter(c => c.section !== 'Resolved' && c.isFocus).length }}
                  </button>

                  <button 
                    @click="setFilter('unread')"
                    :class="[
                      'px-3.5 py-1 text-[11px] font-medium transition-all duration-200 flex-shrink-0 cursor-pointer rounded-full border shadow-none outline-none h-7 flex items-center justify-center',
                      activeFilter === 'unread'
                        ? 'border-green-200 bg-green-50 text-[#23B750]'
                        : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100/70 hover:text-gray-900 hover:border-gray-300'
                    ]"
                  >
                    Unread <span class="text-gray-300 font-normal select-none mx-0.5">•</span> {{ conversationsList.filter(c => c.section !== 'Resolved' && c.unreadCount > 0).length }}
                  </button>
                </template>

                <!-- Admin Mode status pills -->
                <template v-else>
                  <button 
                    @click="setFilter('late-reply')"
                    :class="[
                      'px-3.5 py-1 text-[11px] font-medium transition-all duration-200 flex-shrink-0 cursor-pointer rounded-full border shadow-none outline-none h-7 flex items-center justify-center',
                      activeFilter === 'late-reply'
                        ? 'border-green-200 bg-green-50 text-[#23B750]'
                        : 'border-gray-255 bg-gray-50 text-gray-600 hover:bg-gray-100/70 hover:text-gray-900 hover:border-gray-300'
                    ]"
                  >
                    Late <span class="text-gray-300 font-normal select-none mx-0.5">•</span> {{ conversationsList.filter(c => c.section !== 'Resolved' && (c.rightBadge === 'Late' || c.rightBadge === 'Late Reply' || isSlaBreached(c))).length }}
                  </button>

                  <button 
                    @click="setFilter('focus')"
                    :class="[
                      'px-3.5 py-1 text-[11px] font-medium transition-all duration-200 flex-shrink-0 cursor-pointer rounded-full border shadow-none outline-none h-7 flex items-center justify-center',
                      activeFilter === 'focus'
                        ? 'border-green-200 bg-green-50 text-[#23B750]'
                        : 'border-gray-255 bg-gray-50 text-gray-600 hover:bg-gray-100/70 hover:text-gray-900 hover:border-gray-300'
                    ]"
                  >
                    Focus <span class="text-gray-300 font-normal select-none mx-0.5">•</span> {{ conversationsList.filter(c => c.section !== 'Resolved' && c.isFocus).length }}
                  </button>

                  <button 
                    @click="setFilter('unread')"
                    :class="[
                      'px-3.5 py-1 text-[11px] font-medium transition-all duration-200 flex-shrink-0 cursor-pointer rounded-full border shadow-none outline-none h-7 flex items-center justify-center',
                      activeFilter === 'unread'
                        ? 'border-green-200 bg-green-50 text-[#23B750]'
                        : 'border-gray-255 bg-gray-50 text-gray-600 hover:bg-gray-100/70 hover:text-gray-900 hover:border-gray-300'
                    ]"
                  >
                    Unread <span class="text-gray-300 font-normal select-none mx-0.5">•</span> {{ conversationsList.filter(c => c.section !== 'Resolved' && c.unreadCount > 0).length }}
                  </button>
                </template>
              </div>

              <!-- Right dynamic gradient scroll overlay -->
              <transition
                enter-active-class="transition duration-200"
                enter-from-class="opacity-0 translate-x-[4px]"
                enter-to-class="opacity-100 translate-x-0"
                leave-active-class="transition duration-150"
                leave-from-class="opacity-100 translate-x-0"
                leave-to-class="opacity-0 translate-x-[4px]"
              >
                <div v-if="showRightArrow" class="absolute right-0 top-0 bottom-0 flex items-center justify-end w-16 bg-gradient-to-l from-white via-white/90 to-transparent z-30 pointer-events-none">
                  <button 
                    type="button"
                    @click="scrollContainer('right')"
                    class="w-5 h-5 rounded-full border border-gray-200 bg-white shadow-none flex items-center justify-center text-gray-500 hover:text-gray-800 transition-all hover:scale-110 active:scale-95 cursor-pointer mr-0.5 pointer-events-auto"
                  >
                    <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </button>
                </div>
              </transition>

            </div>
          </div>
        </transition>
      </div>

      <!-- Scrollable Message List Canvas (Supports Chrono & Work Queue ViewStyles) -->
      <div class="flex-1 overflow-y-auto min-h-0 border-t border-gray-100 divide-y divide-gray-100 scrollbar-thin">
        
        <!-- ================= CHRONO VIEW STYLE ================= -->
        <template v-if="viewStyle === 'chrono'">
          <!-- Pinned conversations section at top of time-relative view -->
          <div v-if="pinnedConversations.length > 0" class="flex flex-col">
            <div 
              @click="isPinnedExpanded = !isPinnedExpanded"
              class="sticky top-0 z-10 flex items-center justify-between px-4 py-1.5 bg-gray-50/90 backdrop-blur-md border-b border-gray-150/80 select-none cursor-pointer hover:bg-gray-100/70 transition-colors"
            >
              <div class="flex items-center gap-1.5">
                <svg class="w-3 h-3 text-gray-400 transform transition-transform duration-200" :class="[isPinnedExpanded ? 'rotate-180' : '']" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
                <span class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Pinned</span>
              </div>
              <span class="text-[10px] font-semibold text-gray-500 bg-white border border-gray-200/80 px-2 py-0.5 rounded-full font-mono shadow-2xs leading-none">{{ pinnedConversations.length }} / 10</span>
            </div>
            
            <div v-if="isPinnedExpanded" class="flex flex-col">
              <ConversationItem 
                v-for="item in pinnedConversations"
                :key="item.id"
                :item="item"
                :selected="item.selected"
                :checked="item.checked"
                :view-mode="viewMode"
                @select="selectConversation"
                @toggle-snooze="toggleSnooze"
                @toggle-unread="toggleUnread"
                @context-menu-action="handleContextMenuAction"
                @context-menu-update-attribute="handleContextMenuUpdateAttribute"
                @toggle-check="handleToggleCheck"
              />
            </div>
          </div>

          <!-- Main Chronological Grouped List -->
          <div class="flex flex-col">
            <!-- Grouped by Today, Yesterday, Older -->
            <div v-if="unpinnedChronoConversations.length > 0" class="flex flex-col">
              <div 
                v-for="group in groupedChronoConversations" 
                :key="group.id" 
                class="flex flex-col"
              >
                <!-- Group Header (sticky, clean typography) -->
                <div 
                  @click="expandedSections[group.id] = !expandedSections[group.id]"
                  class="sticky top-0 z-10 flex items-center justify-between px-4 py-1.5 bg-gray-50/90 backdrop-blur-md border-b border-gray-150/80 select-none cursor-pointer hover:bg-gray-100/70 transition-colors"
                >
                  <div class="flex items-center gap-1.5">
                    <svg class="w-3 h-3 text-gray-400 transform transition-transform duration-200" :class="[expandedSections[group.id] ? 'rotate-180' : '']" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                    <span class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{{ group.title }}</span>
                  </div>
                  <span class="text-[10px] font-semibold text-gray-500 bg-white border border-gray-200/80 px-2 py-0.5 rounded-full font-mono shadow-2xs leading-none">{{ group.items.length }}</span>
                </div>
                <!-- Group Items -->
                <template v-if="expandedSections[group.id]">
                  <ConversationItem 
                    v-for="item in group.items"
                    :key="item.id"
                    :item="item"
                    :selected="item.selected"
                    :checked="item.checked"
                    :view-mode="viewMode"
                    @select="selectConversation"
                    @toggle-snooze="toggleSnooze"
                    @toggle-unread="toggleUnread"
                    @context-menu-action="handleContextMenuAction"
                    @context-menu-update-attribute="handleContextMenuUpdateAttribute"
                    @toggle-check="handleToggleCheck"
                  />
                </template>
              </div>
            </div>
            
            <!-- Premium Empty State when no conversations are present -->
            <div v-else class="flex flex-col items-center justify-center py-14 px-6 text-center bg-white select-none animate-fade-in">
              <div class="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 border border-gray-100 mb-3.5 shadow-sm">
                <svg class="w-6 h-6 stroke-[1.8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8.684 10.742h.01m3.985 0h.01m3.985 0h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 class="text-xs font-bold text-gray-800 mb-1">No Active Threads</h3>
              <p class="text-[11px] text-gray-400 font-medium max-w-[200px] leading-relaxed">
                All conversations are caught up. Check other filters or assignments.
              </p>
            </div>
          </div>
        </template>

        <!-- ================= WORK QUEUE VIEW STYLE ================= -->
        <template v-else>
          <!-- Pinned strip section header -->
          <div class="flex flex-col">
            <div 
              @click="isPinnedExpanded = !isPinnedExpanded"
              class="sticky top-0 z-10 flex items-center justify-between px-4 py-1.5 bg-gray-50/95 backdrop-blur-sm border-b border-gray-150 select-none cursor-pointer hover:bg-gray-100/70 transition-colors"
            >
              <div class="flex items-center gap-1.5">
                <svg class="w-3 h-3 text-gray-400 transform transition-transform duration-200" :class="[isPinnedExpanded ? 'rotate-180' : '']" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
                <span class="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Pinned</span>
              </div>
              <span class="text-[9px] font-semibold text-gray-400 bg-white border border-gray-200/50 px-1.5 py-0.2 rounded-full">{{ pinnedConversations.length }} / 10</span>
            </div>

            <!-- Collapsed Strip: Avatar bubbles list -->
            <div v-if="!isPinnedExpanded && pinnedConversations.length > 0" class="flex items-center gap-3.5 px-4 py-3 border-b border-gray-100 overflow-x-auto scrollbar-none bg-gray-50/20 select-none">
              <div 
                v-for="item in pinnedConversations" 
                :key="item.id" 
                @click="selectConversation(item.id)"
                class="relative group cursor-pointer flex-shrink-0"
                :title="`Pinned: ${item.sender}`"
              >
                <img 
                  :src="item.avatar" 
                  class="w-10 h-10 rounded-full object-cover border border-gray-100 transition-all hover:scale-105"
                  :class="[item.selected ? 'ring-2 ring-[#23B750] ring-offset-2' : '']"
                />
                <!-- Unread counter badge overlay -->
                <span 
                  v-if="item.unreadCount > 0" 
                  class="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-[#EF4444] text-white text-[9px] font-extrabold flex items-center justify-center border border-white leading-none font-mono"
                >
                  {{ item.unreadCount }}
                </span>
              </div>
            </div>
            
            <!-- Expanded Strip: Full conversation rows list -->
            <div v-else-if="isPinnedExpanded && pinnedConversations.length > 0" class="flex flex-col border-b border-gray-100">
              <ConversationItem 
                v-for="item in pinnedConversations"
                :key="item.id"
                :item="item"
                :selected="item.selected"
                :checked="item.checked"
                :view-mode="viewMode"
                @select="selectConversation"
                @toggle-snooze="toggleSnooze"
                @toggle-unread="toggleUnread"
                @context-menu-action="handleContextMenuAction"
                @context-menu-update-attribute="handleContextMenuUpdateAttribute"
                @toggle-check="handleToggleCheck"
              />
            </div>
            
            <!-- Empty Pinned Strip View -->
            <div v-else class="px-4 py-3 text-center text-[11px] text-gray-400 italic bg-gray-50/10 border-b border-gray-100 select-none">
              No pinned conversations yet. Right-click to pin.
            </div>
          </div>

          <!-- SECTION 1: REPLY REQUIRED -->
          <div class="flex flex-col">
            <!-- Section Header -->
            <div class="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-150 select-none">
              <div class="flex items-center gap-2 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest leading-none">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                Reply Required
              </div>
              <span class="text-[10px] font-bold text-gray-450">{{ replyRequiredConversations.length }}</span>
            </div>

            <!-- Section Items -->
            <ConversationItem 
              v-for="item in replyRequiredConversations"
              :key="item.id"
              :item="item"
              :selected="item.selected"
              :checked="item.checked"
              :view-mode="viewMode"
              @select="selectConversation"
              @toggle-snooze="toggleSnooze"
              @toggle-unread="toggleUnread"
              @context-menu-action="handleContextMenuAction"
              @context-menu-update-attribute="handleContextMenuUpdateAttribute"
              @toggle-check="handleToggleCheck"
            />
          </div>

          <!-- SECTION 2: WAITING & SNOOZED -->
          <div class="flex flex-col">
            <!-- Section Header -->
            <div class="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-150 select-none">
              <div class="flex items-center gap-2 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest leading-none">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                Waiting & Snoozed
              </div>
              <span class="text-[10px] font-bold text-gray-455">{{ waitingConversations.length }}</span>
            </div>

            <!-- Section Items -->
            <ConversationItem 
              v-for="item in waitingConversations"
              :key="item.id"
              :item="item"
              :selected="item.selected"
              :checked="item.checked"
              :view-mode="viewMode"
              @select="selectConversation"
              @toggle-snooze="toggleSnooze"
              @toggle-unread="toggleUnread"
              @context-menu-action="handleContextMenuAction"
              @context-menu-update-attribute="handleContextMenuUpdateAttribute"
              @toggle-check="handleToggleCheck"
            />
          </div>
        </template>

        <!-- Reached the end footer -->
        <div v-if="filteredConversations.length > 0" class="pt-8 pb-16 px-4 flex flex-col items-center justify-center select-none bg-gray-50/20 border-t border-gray-100/50">
          <div class="flex items-center gap-2.5">
            <div class="h-[1px] w-8 bg-gray-200"></div>
            <span class="text-[10px] font-bold text-gray-400 tracking-wider uppercase">You're all caught up</span>
            <div class="h-[1px] w-8 bg-gray-200"></div>
          </div>
        </div>

      </div>

      <!-- Removed old prototype bulk action bar in favor of premium inline bulk actions bar -->
      
      <!-- Floating Switcher — hidden by default, appears on hover near the bottom -->
      <div class="absolute bottom-0 left-0 right-0 h-14 z-30 group/switcher flex items-end justify-center pb-3 pointer-events-auto">
        <!-- The switcher pill itself: invisible until parent hover -->
        <div class="bg-white/90 backdrop-blur-md border border-gray-200 shadow-sm rounded-full p-1 flex gap-1 items-center select-none transition-all duration-250 ease-out opacity-0 translate-y-2 pointer-events-none group-hover/switcher:opacity-100 group-hover/switcher:translate-y-0 group-hover/switcher:pointer-events-auto">
          <button 
            type="button"
            @click="viewMode = 'sales'" 
            :class="[
              'px-3 py-1.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase transition-all duration-200 flex items-center gap-1 cursor-pointer outline-none',
              viewMode === 'sales'
                ? 'bg-[#23B750] text-white shadow-none'
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
            ]"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            Sales
          </button>
          <button 
            type="button"
            @click="viewMode = 'admin'" 
            :class="[
              'px-3 py-1.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase transition-all duration-200 flex items-center gap-1 cursor-pointer outline-none',
              viewMode === 'admin'
                ? 'bg-[#23B750] text-white shadow-none'
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
            ]"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/>
            </svg>
            Admin
          </button>
        </div>
      </div>
      
    </aside>

    <!-- MIDDLE PANEL: Active Conversation Details View -->
    <main class="flex-1 h-full min-w-0 bg-gray-50 flex flex-col relative">
      
      <!-- Top header bar -->
      <header class="min-h-16 bg-white border-b border-gray-200 flex flex-nowrap items-center justify-between px-6 py-2.5 md:py-0 gap-3 flex-shrink-0 select-none relative z-10">
        <div class="flex items-center gap-3 max-w-full min-w-0">
          <!-- Avatar with online status -->
          <div class="relative shrink-0">
            <img :src="activeConversation.avatar" class="w-10 h-10 rounded-full object-cover border" alt="Active avatar" />
            <span class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white bg-[#23B750] animate-pulse-glow" title="Active now (Last active 2m ago)"></span>
          </div>
          <div class="min-w-0 flex flex-col justify-center gap-0.5">
            <div class="flex items-center gap-1.5 min-w-0">
              <h2 class="font-bold text-gray-800 text-[15px] leading-tight truncate shrink-0">
                {{ activeConversation.sender }}
              </h2>
              <span v-if="activeConversation.icons?.includes('crown')" title="VIP Contact" class="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-extrabold border border-purple-200 bg-purple-50 text-purple-700 leading-none shrink-0 select-none">
                <svg viewBox="0 0 24 24" class="w-2.5 h-2.5 fill-current text-[#9F5CF8]"><path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5ZM19 19C19 19.55 18.55 20 18 20H6C5.45 20 5 19.55 5 19V18H19V19Z"/></svg>
                <span>VIP</span>
              </span>
              <!-- Red Late SLA Badge if breached -->
              <span 
                v-if="isSlaBreached(activeConversation)" 
                title="SLA response threshold exceeded"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border border-[#FDE8E8] bg-[#FDF2F2] text-[#B91C1C] leading-none shrink-0 select-none"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-[#B91C1C] animate-pulse"></span>
                <span>Late</span>
              </span>
            </div>
            <div class="flex items-center gap-x-1.5 text-xs text-gray-500 font-medium whitespace-nowrap select-none">
              <span class="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 flex items-center justify-center shrink-0">
                <PlatformIcon :platform="activeConversation.platform" size="sm" variant="colored" />
              </span>
              <span class="text-gray-300 font-normal select-none">•</span>
              <!-- Clickable Assign Agent Dropdown in Header with Search -->
              <div ref="headerAssignDropdownRef" class="relative inline-block shrink-0">
                <button 
                  @click="isHeaderAssignDropdownOpen = !isHeaderAssignDropdownOpen"
                  class="hover:underline cursor-pointer flex items-center gap-1 font-semibold text-gray-700 hover:text-gray-900 transition-colors select-none"
                  title="Click to reassign agent"
                >
                  <span>Assigned to <span class="font-bold text-gray-900">{{ activeConversation.assignedTo === 'Liv' ? 'Olivia' : (activeConversation.assignedTo === 'Unassigned' ? 'Unassigned' : activeConversation.assignedTo) }}</span></span>
                  <svg class="w-2.5 h-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M19 9l-7 7-7-7"/></svg>
                </button>

                <!-- Searchable Dropdown Menu -->
                <div 
                  v-if="isHeaderAssignDropdownOpen" 
                  @click.stop 
                  class="absolute left-0 mt-1.5 w-52 bg-white border border-gray-200 rounded-xl shadow-lg z-30 p-1.5 flex flex-col gap-1 focus:outline-none select-none"
                >
                  <div class="px-2 py-0.5 flex items-center justify-between">
                    <span class="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Assign Agent</span>
                    <span class="text-[9px] text-gray-400 font-medium font-mono">{{ headerFilteredAgents.length }}</span>
                  </div>
                  
                  <!-- Agent Search Bar -->
                  <div class="px-1 py-0.5">
                    <div class="relative">
                      <svg class="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"/>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                      </svg>
                      <input 
                        v-model="headerAgentSearchQuery"
                        type="text" 
                        placeholder="Search agent..." 
                        class="w-full pl-7 pr-5 py-1 text-[11px] bg-gray-50 border border-gray-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#23B750] focus:border-[#23B750] transition-all placeholder:text-gray-400 font-medium"
                      />
                      <button 
                        v-if="headerAgentSearchQuery"
                        type="button"
                        @click="headerAgentSearchQuery = ''"
                        class="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
                      >
                        <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <!-- Agent Options List -->
                  <div class="max-h-[170px] overflow-y-auto flex flex-col gap-0.5 scrollbar-thin">
                    <button 
                      v-for="agent in headerFilteredAgents" 
                      :key="agent.value"
                      type="button"
                      @click="reassignActiveConversation(agent.value)"
                      class="flex items-center justify-between w-full px-2 py-1.5 rounded-md hover:bg-gray-50 transition-colors text-left cursor-pointer outline-none border border-transparent"
                      :class="activeConversation.assignedTo === agent.value ? 'bg-green-50/50 border-green-100 text-emerald-950 font-semibold' : 'text-[#334155]'"
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
                      <svg v-if="activeConversation.assignedTo === agent.value" class="w-3 h-3 text-[#23B750] stroke-current stroke-[3] shrink-0" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12"/></svg>
                    </button>

                    <div v-if="headerFilteredAgents.length === 0" class="py-3 text-center text-[10px] text-gray-400 select-none">
                      No agents matching "<span class="font-semibold text-gray-600">{{ headerAgentSearchQuery }}</span>"
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex gap-2 items-center flex-nowrap">
          <!-- Primary Resolve / Reopen Action Button -->
          <button
            v-if="activeConversation.section !== 'Resolved' && activeConversation.lifecycleState !== 'closed' && activeConversation.lifecycleState !== 'archived'"
            @click="resolveActiveConversation"
            class="inline-flex items-center justify-center gap-1.5 px-3.5 h-8.5 rounded-lg bg-[#23B750] hover:bg-[#1fa346] text-white text-xs font-bold shadow-2xs cursor-pointer active:scale-95 transition-all outline-none select-none shrink-0"
            title="Mark conversation as resolved"
          >
            <svg class="w-3.5 h-3.5 stroke-current stroke-[3]" fill="none" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
            <span>Resolve</span>
          </button>
          <button
            v-else
            @click="reopenActiveConversation"
            class="inline-flex items-center justify-center gap-1.5 px-3.5 h-8.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold shadow-2xs cursor-pointer active:scale-95 transition-all outline-none select-none shrink-0"
            title="Reopen conversation to active"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            <span>Reopen</span>
          </button>

          <!-- Lifecycle Dropdown (Active vs Resolved vs Archived) -->
          <div ref="headerLifecycleDropdownRef" class="relative flex-shrink-0">
            <button
              @click="isLifecycleDropdownOpen = !isLifecycleDropdownOpen"
              class="inline-flex items-center justify-center gap-2 px-3 h-8.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 cursor-pointer shadow-2xs outline-none select-none"
            >
              <span class="w-2 h-2 rounded-full shrink-0" :class="[ activeConversation.lifecycleState === 'open' ? 'bg-[#23B750]' : activeConversation.lifecycleState === 'closed' ? 'bg-gray-400' : 'bg-amber-400' ]"></span>
              <span class="font-bold text-gray-800">{{ activeConversation.lifecycleState === 'open' ? 'Active' : activeConversation.lifecycleState === 'closed' ? 'Resolved' : 'Archived' }}</span>
              <svg class="w-3 h-3 text-gray-400 transition-transform" :class="[isLifecycleDropdownOpen ? 'rotate-180' : '']" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            
            <div 
              v-if="isLifecycleDropdownOpen"
              class="absolute right-0 mt-1.5 w-36 bg-white border border-gray-200 rounded-xl shadow-lg z-40 py-1.5 focus:outline-none"
            >
              <button
                @click="changeActiveLifecycleState('open')"
                class="w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors text-gray-700 cursor-pointer"
                :class="[activeConversation.lifecycleState === 'open' ? 'bg-green-50/40 text-emerald-800 font-semibold' : '']"
              >
                <div class="flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-[#23B750]"></span>
                  <span>Active</span>
                </div>
                <svg v-if="activeConversation.lifecycleState === 'open'" class="w-3.5 h-3.5 text-[#23B750]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              </button>
              
              <button
                @click="changeActiveLifecycleState('closed')"
                class="w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors text-gray-700 cursor-pointer"
                :class="[activeConversation.lifecycleState === 'closed' ? 'bg-gray-100 text-gray-900 font-semibold' : '']"
              >
                <div class="flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-gray-400"></span>
                  <span>Resolved</span>
                </div>
                <svg v-if="activeConversation.lifecycleState === 'closed'" class="w-3.5 h-3.5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              </button>

              <button
                @click="changeActiveLifecycleState('archived')"
                class="w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors text-gray-700 cursor-pointer"
                :class="[activeConversation.lifecycleState === 'archived' ? 'bg-amber-50 text-amber-900 font-semibold' : '']"
              >
                <div class="flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span>Archived</span>
                </div>
                <svg v-if="activeConversation.lifecycleState === 'archived'" class="w-3.5 h-3.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              </button>
            </div>
          </div>

          <!-- Toggle Right Sidebar Info Button -->
          <button 
            @click="isRightDrawerOpen = !isRightDrawerOpen"
            title="Toggle Details Drawer"
            class="h-8.5 w-8.5 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 border border-gray-200 rounded-lg bg-white cursor-pointer transition-colors shrink-0 shadow-2xs"
            :class="[isRightDrawerOpen ? 'bg-gray-100 text-gray-800' : '']"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <line x1="9" y1="3" x2="9" y2="21"/>
            </svg>
          </button>
        </div>
      </header>

      <!-- Middle message canvas wrapper with proper relative positioning -->
      <div class="flex-1 relative min-h-0 flex flex-col">
        <!-- Scrollable Message Canvas with Custom Visual Chat Bubbles -->
        <div 
          ref="chatMessagesContainer"
          class="flex-1 p-6 bg-gray-50 flex flex-col gap-5 overflow-y-auto min-h-0 scrollbar-thin"
          @scroll="handleChatScroll"
        >
          <template v-for="msg in activeChatMessages" :key="msg.id">
            <!-- 1. System Logs Card -->
            <div v-if="msg.type === 'system-log'" class="w-full flex items-center justify-center py-2 select-none animate-in fade-in duration-200">
              <div 
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] border font-bold max-w-[90%] shadow-none"
                :class="msg.logClass || 'bg-gray-100/50 border-gray-200 text-gray-500'"
              >
                <!-- Dynamic system log icon -->
                <svg v-if="msg.logIcon === 'check'" class="w-3 h-3 text-[#23B750]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3.5"><polyline points="20 6 9 17 4 12"/></svg>
                <svg v-else-if="msg.logIcon === 'user'" class="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <svg v-else-if="msg.logIcon === 'sparkles'" class="w-3.5 h-3.5 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M9.813 15.904L9 21l-.813-5.096L3.096 15 8.187 14.187 9 9l.813 5.187L14.904 15z"/></svg>
                <svg v-else-if="msg.logIcon === 'mail'" class="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                <svg v-else-if="msg.logIcon === 'bell'" class="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                <svg v-else-if="msg.logIcon === 'unlock'" class="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>
                <svg v-else-if="msg.logIcon === 'clock'" class="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span>{{ msg.text }}</span>
              </div>
            </div>

            <!-- 2. CRM Match States Cards -->
            <div v-else-if="msg.type === 'crm-match'" class="w-full flex items-center justify-center py-3 select-none animate-in fade-in duration-200">
              <div class="w-full max-w-[85%] bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col items-center text-center gap-4 relative">
                
                <!-- State A: Unknown Sender -->
                <template v-if="crmCardState === 'unknown'">
                  <div class="relative w-12 h-12 select-none">
                    <img :src="activeConversation.avatar" class="w-12 h-12 rounded-full object-cover border border-gray-150" />
                    <span class="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white bg-gray-400"></span>
                  </div>
                  <span class="text-[10px] font-extrabold uppercase bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded-full -mt-2">Unknown Sender</span>
                  <div class="flex items-center gap-1.5 text-gray-800 font-bold text-sm">
                    <svg viewBox="0 0 24 24" class="w-4 h-4 fill-current text-[#25D366]"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.455L0 24zm6.59-4.846c1.66.986 3.298 1.504 5.353 1.505 5.503 0 9.977-4.477 9.98-9.983.002-2.667-1.031-5.176-2.909-7.054C17.195 1.745 14.69 .713 12.012.713c-5.51 0-9.985 4.479-9.988 9.987-.001 2.148.567 4.24 1.644 6.1 l-.995 3.635 3.737-.981zm11.393-7.513c-.3-.15-1.77-.874-2.043-.974-.275-.1-.475-.15-.675.15-.2.3-.775.974-.95 1.174-.175.2-.35.225-.65.075-1.02-.513-1.695-.97-2.368-2.128-.176-.3-.176-.5-.075-.65.09-.137.2-.238.3-.35.1-.1.125-.2.187-.3.063-.1.031-.2-.013-.3-.044-.1-.4-.974-.55-1.324-.145-.35-.29-.303-.4-.308-.104-.005-.224-.005-.344-.005-.12 0-.315.04-.48.22-.165.18-.63.616-.63 1.503 0 .887.645 1.744.735 1.87.09.124 1.27 1.94 3.076 2.718.428.188.764.3 1.024.384.43.137.82.117 1.13.07.34-.05.177-.874.243-1.124.066-.25-.09-.387-.29-.537z"/></svg>
                    <span>+6012 3456 7890</span>
                  </div>
                  <div class="text-xs text-gray-500 font-semibold -mt-2">~Mel Wong • No email captured</div>
                  <div class="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-4 text-xs font-bold text-gray-500">
                    Not saved in CRM / only channel profile available
                  </div>
                  <div class="w-full grid grid-cols-2 gap-3 mt-1">
                    <button @click="addToast('Sender block listed', 'warning')" class="py-2 border border-red-200 text-red-500 hover:bg-red-50 rounded-xl text-xs font-extrabold transition-colors cursor-pointer select-none">
                      🚫 Block / Spam
                    </button>
                    <button @click="handleCrmCreateContact" class="py-2 border border-green-200 text-[#23B750] hover:bg-green-50 rounded-xl text-xs font-extrabold transition-colors cursor-pointer select-none">
                      👤 Create New Contact
                    </button>
                  </div>
                </template>

                <!-- State B: Potential Contact -->
                <template v-else-if="crmCardState === 'potential'">
                  <div class="relative w-12 h-12 select-none">
                    <img :src="activeConversation.avatar" class="w-12 h-12 rounded-full object-cover border border-gray-150" />
                    <span class="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white bg-[#23B750]"></span>
                  </div>
                  <span class="text-[10px] font-extrabold uppercase bg-orange-100 text-orange-600 px-2.5 py-0.5 rounded-full -mt-2">Potential Contact</span>
                  <div class="flex items-center gap-1.5 text-gray-800 font-bold text-sm">
                    <svg viewBox="0 0 24 24" class="w-4 h-4 fill-current text-[#25D366]"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.455L0 24zm6.59-4.846c1.66.986 3.298 1.504 5.353 1.505 5.503 0 9.977-4.477 9.98-9.983.002-2.667-1.031-5.176-2.909-7.054C17.195 1.745 14.69 .713 12.012.713c-5.51 0-9.985 4.479-9.988 9.987-.001 2.148.567 4.24 1.644 6.1 l-.995 3.635 3.737-.981zm11.393-7.513c-.3-.15-1.77-.874-2.043-.974-.275-.1-.475-.15-.675.15-.2.3-.775.974-.95 1.174-.175.2-.35.225-.65.075-1.02-.513-1.695-.97-2.368-2.128-.176-.3-.176-.5-.075-.65.09-.137.2-.238.3-.35.1-.1.125-.2.187-.3.063-.1.031-.2-.013-.3-.044-.1-.4-.974-.55-1.324-.145-.35-.29-.303-.4-.308-.104-.005-.224-.005-.344-.005-.12 0-.315.04-.48.22-.165.18-.63.616-.63 1.503 0 .887.645 1.744.735 1.87.09.124 1.27 1.94 3.076 2.718.428.188.764.3 1.024.384.43.137.82.117 1.13.07.34-.05.177-.874.243-1.124.066-.25-.09-.387-.29-.537z"/></svg>
                    <span>+6012 3456 7890</span>
                  </div>
                  <div class="text-xs text-gray-500 font-semibold -mt-2">~Mel Wong • Not saved in CRM</div>
                  <div class="text-[10px] text-gray-400 font-semibold -mt-2">WhatsApp business account • Joined Oct 2025</div>
                  <div class="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-4 text-xs font-bold text-gray-500">
                    Enough profile details to create contact
                  </div>
                  <div class="w-full grid grid-cols-2 gap-3 mt-1">
                    <button @click="addToast('Sender block listed', 'warning')" class="py-2 border border-red-200 text-red-500 hover:bg-red-50 rounded-xl text-xs font-extrabold transition-colors cursor-pointer select-none">
                      🚫 Block / Spam
                    </button>
                    <button @click="handleCrmReviewMatch" class="py-2 border border-green-200 text-[#23B750] hover:bg-green-50 rounded-xl text-xs font-extrabold transition-colors cursor-pointer select-none">
                      👤 Create New Contact
                    </button>
                  </div>
                </template>

                <!-- State C: Possible Match Found -->
                <template v-else-if="crmCardState === 'match-found'">
                  <div class="relative w-12 h-12 select-none">
                    <img :src="activeConversation.avatar" class="w-12 h-12 rounded-full object-cover border border-gray-150" />
                    <span class="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white bg-gray-400"></span>
                  </div>
                  <span class="text-[10px] font-extrabold uppercase bg-amber-100 text-amber-700 px-2.5 py-0.5 rounded-full -mt-2">Possible Match Found</span>
                  <div class="flex items-center gap-1.5 text-gray-800 font-bold text-sm">
                    <svg viewBox="0 0 24 24" class="w-4 h-4 fill-current text-[#EA4335]"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                    <span>Mel Wong</span>
                  </div>
                  <div class="text-xs text-gray-500 font-semibold -mt-2">melwong@kksteel.com • ~+6012 3456 7890</div>
                  <div class="text-[10px] text-gray-400 font-semibold -mt-2">KK Steel Sdn Bhd • kksteel.com.my</div>
                  
                  <div class="w-full bg-amber-50/20 border border-amber-150 rounded-2xl p-3.5 flex flex-col gap-2 text-left">
                    <span class="text-[10px] font-extrabold uppercase text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full self-start leading-none">Strong Match</span>
                    <p class="text-[11px] text-gray-500 font-bold leading-normal">Email signature contains this contact's phone number.</p>
                    
                    <div class="flex items-center justify-between border border-gray-150 rounded-xl p-2.5 bg-white">
                      <div class="flex items-center gap-2.5 min-w-0">
                        <img :src="activeConversation.avatar" class="w-8 h-8 rounded-full object-cover" />
                        <div class="min-w-0 flex flex-col">
                          <div class="flex items-center gap-1">
                            <span class="font-bold text-xs text-gray-800 truncate">Mel Wong</span>
                            <svg viewBox="0 0 24 24" class="w-3 h-3 fill-[#9F5CF8] shrink-0"><path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5z"/><path d="M19 19H5v-1h14v1z"/></svg>
                          </div>
                          <span class="text-[10px] text-gray-400 font-semibold truncate">+6012 3456 7890</span>
                          <span class="text-[10px] text-gray-400 font-semibold truncate">melwong@kksteel.com</span>
                        </div>
                      </div>
                      <button class="p-1 hover:bg-gray-100 rounded text-gray-400"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/><circle cx="5" cy="12" r="1.5"/></svg></button>
                    </div>
                  </div>
                  
                  <div class="w-full grid grid-cols-2 gap-3 mt-1">
                    <button @click="handleCrmReviewMatch" class="py-2 border border-orange-200 text-orange-600 hover:bg-orange-50 rounded-xl text-xs font-extrabold transition-colors cursor-pointer select-none">
                      🔍 Review Match
                    </button>
                    <button @click="handleCrmCreateContact" class="py-2 border border-green-200 text-[#23B750] hover:bg-green-50 rounded-xl text-xs font-extrabold transition-colors cursor-pointer select-none">
                      👤 Create New Contact
                    </button>
                  </div>
                </template>

                <!-- State E: Existing Contact, New Channel -->
                <template v-else-if="crmCardState === 'new-channel'">
                  <div class="relative w-12 h-12 select-none">
                    <img :src="activeConversation.avatar" class="w-12 h-12 rounded-full object-cover border border-gray-150" />
                    <span class="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white bg-[#23B750]"></span>
                  </div>
                  <span class="text-[10px] font-extrabold uppercase bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full -mt-2">Existing Contact, New Channel</span>
                  <div class="flex items-center gap-1.5 text-gray-800 font-bold text-sm">
                    <svg viewBox="0 0 24 24" class="w-4 h-4 fill-current text-[#EA4335]"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                    <span>Mel Wong</span>
                  </div>
                  <div class="text-xs text-gray-500 font-semibold -mt-2">melwong@kksteel.com</div>
                  <div class="text-[10px] text-gray-400 font-semibold -mt-2">KK Steel Sdn Bhd • kksteel.com.my</div>
                  
                  <div class="w-full bg-green-50/20 border border-green-150 rounded-2xl p-3.5 flex flex-col gap-2 text-left">
                    <span class="text-[10px] font-extrabold uppercase text-green-700 bg-green-100 px-2.5 py-0.5 rounded-full self-start leading-none">New email channel detected</span>
                    <p class="text-[11px] text-gray-500 font-bold leading-normal">This email can be linked to an existing contact.</p>
                    
                    <div class="flex items-center justify-between border border-gray-150 rounded-xl p-2.5 bg-white">
                      <div class="flex items-center gap-2.5 min-w-0">
                        <img :src="activeConversation.avatar" class="w-8 h-8 rounded-full object-cover" />
                        <div class="min-w-0 flex flex-col">
                          <div class="flex items-center gap-1">
                            <span class="font-bold text-xs text-gray-800 truncate">Mel Wong</span>
                            <svg viewBox="0 0 24 24" class="w-3 h-3 fill-[#9F5CF8] shrink-0"><path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5z"/><path d="M19 19H5v-1h14v1z"/></svg>
                          </div>
                          <span class="text-[10px] text-gray-400 font-semibold truncate">+6012 3456 7890</span>
                          <span class="text-[10px] text-gray-400 font-semibold truncate">melwong@kksteel.com</span>
                        </div>
                      </div>
                      <button class="p-1 hover:bg-gray-100 rounded text-gray-400"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/><circle cx="5" cy="12" r="1.5"/></svg></button>
                    </div>
                  </div>
                  
                  <div class="w-full grid grid-cols-2 gap-3 mt-1">
                    <button @click="addToast('Opening contact profile drawer...', 'info')" class="py-2 border border-gray-250 text-gray-650 hover:bg-gray-50 rounded-xl text-xs font-extrabold transition-colors cursor-pointer select-none">
                      View Contact
                    </button>
                    <button @click="handleCrmLinkEmail" class="py-2 border border-green-200 text-[#23B750] hover:bg-green-50 rounded-xl text-xs font-extrabold transition-colors cursor-pointer select-none">
                      ✉️ Link Email
                    </button>
                  </div>
                </template>
                
                <!-- State Switch Helper Icon -->
                <button @click="crmCardState = crmCardState === 'unknown' ? 'potential' : crmCardState === 'potential' ? 'match-found' : crmCardState === 'match-found' ? 'new-channel' : 'unknown'" class="absolute top-3 right-3 w-6 h-6 rounded-full hover:bg-gray-50 flex items-center justify-center text-gray-400 transition-colors border border-gray-100" title="Cycle through match states demo">
                  <svg class="w-3.5 h-3.5 fill-none stroke-current" viewBox="0 0 24 24" stroke-width="2.5"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
                </button>

              </div>
            </div>

            <!-- 3. Assign Lead inline card -->
            <div v-else-if="msg.type === 'assign-lead'" class="w-full flex items-center justify-center py-3 select-none animate-in fade-in duration-200">
              <div class="w-full max-w-[85%] bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
                <span class="text-xs font-bold text-gray-700">Assign Lead</span>
                
                <div class="flex flex-col gap-3">
                  <select v-model="inlineAssignAgent" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs bg-white text-gray-700 font-bold focus:outline-none focus:border-green-200">
                    <option>Ahmad Faizal</option>
                    <option>Siti Nur Aisyah</option>
                    <option>Rajesh Kumar</option>
                    <option>Lim Wei Jie</option>
                    <option>Nurul Huda</option>
                    <option>Mohd Hafiz</option>
                  </select>
                  
                  <!-- Tags Selector box -->
                  <div class="flex flex-wrap gap-1.5 p-2.5 border border-gray-150 rounded-xl bg-gray-50/50">
                    <span v-for="tag in inlineAssignTags" :key="tag" class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs border border-gray-200 bg-white font-bold text-gray-600 shadow-none leading-none h-6 select-none">
                      <span>{{ tag }}</span>
                      <button @click="inlineAssignTags = inlineAssignTags.filter(t => t !== tag)" class="hover:text-red-500 font-semibold cursor-pointer outline-none ml-0.5">×</button>
                    </span>
                    <input @keyup.enter="(e) => { const val = (e.target as HTMLInputElement).value.trim(); if(val && !inlineAssignTags.includes(val)) { inlineAssignTags.push(val); (e.target as HTMLInputElement).value = ''; } }" placeholder="+ Tag..." class="text-xs bg-transparent focus:outline-none px-1 py-0.5 w-16 text-gray-600 font-semibold placeholder:text-gray-400" />
                  </div>
                </div>
                
                <button @click="handleInlineAssignSave" class="w-full py-2.5 bg-[#23B750] hover:bg-[#1f9f45] text-white rounded-xl text-xs font-bold transition-all cursor-pointer select-none">
                  Save
                </button>
              </div>
            </div>

            <!-- 4. WhatsApp Session Expired selector card -->
            <div v-else-if="msg.type === 'session-expired'" class="w-full flex items-center justify-center py-3 select-none animate-in fade-in duration-200">
              <div class="w-full max-w-[85%] bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
                <div class="flex items-start gap-2.5">
                  <div class="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                    <svg class="w-4.5 h-4.5 fill-none stroke-current" viewBox="0 0 24 24" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  </div>
                  <div class="flex-1 flex flex-col min-w-0">
                    <h4 class="text-xs font-bold text-gray-900 leading-tight">WhatsApp Session Expired | Template Required</h4>
                    <p class="text-[11px] text-gray-400 font-semibold leading-normal mt-1">Message failed: 24-hour WhatsApp window expired.</p>
                  </div>
                </div>
                
                <div class="flex flex-col gap-3">
                  <select v-model="selectedTemplate" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs bg-white text-gray-700 font-bold focus:outline-none focus:border-green-200">
                    <option value="" disabled>Select a template</option>
                    <option v-for="opt in templateOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                  </select>
                  
                  <div v-if="selectedTemplate" class="border border-gray-200 rounded-xl p-3 bg-gray-50 flex flex-col gap-1.5 select-none relative animate-in fade-in duration-200">
                    <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none">Preview</span>
                    <p class="text-xs text-gray-600 leading-relaxed font-semibold pr-6">{{ templatePreviews[selectedTemplate] }}</p>
                    <button @click="addToast('Template content copied to clipboard!', 'success')" class="absolute top-2.5 right-2.5 text-gray-450 hover:text-gray-700"><svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>
                  </div>
                </div>
                
                <button @click="handleSendTemplateInline" class="w-full py-2.5 bg-[#23B750] hover:bg-[#1f9f45] text-white rounded-xl text-xs font-bold transition-all cursor-pointer select-none">
                  Send Template
                </button>
              </div>
            </div>

            <!-- 5. Private Note tan/yellow Card -->
            <div v-else-if="msg.type === 'private-note'" class="w-full flex justify-center py-2 select-none animate-in fade-in duration-200">
              <div class="w-full max-w-[85%] bg-[#FEF9C3]/75 border border-[#FEF08A] rounded-2xl p-4 flex flex-col gap-2 shadow-sm">
                <div class="flex items-center justify-between text-xs text-[#854D0E] font-bold border-b border-[#FEF08A] pb-2 leading-none h-6">
                  <div class="flex items-center gap-2">
                    <span class="font-extrabold uppercase tracking-wider text-[9px] bg-[#FEF08A] px-2 py-1 rounded-full leading-none">Private Note</span>
                    <div class="flex items-center gap-1.5">
                      <div class="w-5 h-5 rounded-full bg-[#EAB308] text-white flex items-center justify-center font-bold text-[9px]">OL</div>
                      <span class="font-bold text-[#713F12]">{{ msg.noteAuthor }}</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-2 text-gray-500">
                    <span>{{ msg.time }}</span>
                    <button @click="addToast('Copied note details!', 'success')" class="p-0.5 hover:bg-[#FEF08A]/80 rounded transition-colors text-[#713F12]"><svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>
                    <button @click="addToast('Opening note options...', 'info')" class="p-0.5 hover:bg-[#FEF08A]/80 rounded transition-colors text-[#713F12]"><svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/><circle cx="5" cy="12" r="1.5"/></svg></button>
                  </div>
                </div>
                <div class="text-xs text-[#713F12] leading-relaxed font-semibold mt-1">
                  {{ msg.text }}
                </div>
              </div>
            </div>

            <!-- 6. Playable Audio wave bubble player -->
            <div v-else-if="msg.type === 'audio'" class="flex flex-col gap-1 w-full max-w-[70%] self-start items-start select-none animate-in fade-in duration-200">
              <div class="flex items-center gap-1.5 px-1 select-none text-[10px] text-gray-400 font-bold">
                <span class="font-bold text-gray-600">{{ msg.sender }}</span>
                <span>{{ msg.time }}</span>
              </div>
              <div class="flex items-center gap-3.5 p-3 rounded-2xl bg-white border border-gray-200 shadow-sm w-64 h-13.5">
                <!-- Audio play toggle button -->
                <button @click="addToast('Playing voice message playback...', 'info')" class="w-8 h-8 rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0">
                  <svg class="w-4 h-4 fill-current ml-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </button>
                <div class="flex-1 flex flex-col gap-1">
                  <!-- Audio waveform lines -->
                  <div class="flex items-end gap-[2px] h-5 mb-0.5">
                    <span class="w-[3px] bg-[#7C3AED] rounded-full" style="height: 12px"></span>
                    <span class="w-[3px] bg-[#7C3AED] rounded-full" style="height: 18px"></span>
                    <span class="w-[3px] bg-gray-200 rounded-full" style="height: 6px"></span>
                    <span class="w-[3px] bg-[#7C3AED] rounded-full" style="height: 14px"></span>
                    <span class="w-[3px] bg-[#7C3AED] rounded-full" style="height: 20px"></span>
                    <span class="w-[3px] bg-gray-200 rounded-full" style="height: 10px"></span>
                    <span class="w-[3px] bg-gray-200 rounded-full" style="height: 16px"></span>
                    <span class="w-[3px] bg-[#7C3AED] rounded-full" style="height: 8px"></span>
                    <span class="w-[3px] bg-[#7C3AED] rounded-full" style="height: 15px"></span>
                    <span class="w-[3px] bg-gray-200 rounded-full" style="height: 12px"></span>
                    <span class="w-[3px] bg-gray-200 rounded-full" style="height: 4px"></span>
                    <span class="w-[3px] bg-[#7C3AED] rounded-full" style="height: 18px"></span>
                    <span class="w-[3px] bg-[#7C3AED] rounded-full" style="height: 12px"></span>
                    <span class="w-[3px] bg-gray-200 rounded-full" style="height: 8px"></span>
                    <span class="w-[3px] bg-gray-200 rounded-full" style="height: 14px"></span>
                    <span class="w-[3px] bg-[#7C3AED] rounded-full" style="height: 6px"></span>
                  </div>
                  <div class="flex items-center justify-between text-[9px] text-gray-400 font-extrabold leading-none">
                    <span>{{ msg.audioDuration || '00:00' }}</span>
                    <span>11:40 AM</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 7. Premium Chat Message (With failed outbox banners & checks) -->
            <div 
              v-else
              class="flex flex-col gap-1 w-full max-w-[75%] transition-all duration-200"
              :class="[msg.isSelf ? 'self-end items-end' : 'self-start items-start']"
            >
              <!-- Sender name and timestamp -->
              <div class="flex items-center gap-1.5 px-1 select-none text-[10px] text-gray-400 font-bold">
                <span class="font-bold text-gray-600" v-if="!msg.isSelf">{{ msg.sender }}</span>
                <span>{{ msg.time }}</span>
              </div>
              
              <!-- Chat bubble styling with red markers for failures -->
              <div class="flex items-center gap-2 relative max-w-full">
                
                <!-- Left side red alert circle info icon for delivery failure of outbox bubbles -->
                <div 
                  v-if="msg.isSelf && (msg.status === 'failed' || msg.status === 'expired')" 
                  class="flex items-center justify-center w-5 h-5 rounded-full text-red-500 bg-red-100 animate-pulse-glow mr-1 shrink-0"
                  title="Delivery Failure Notice"
                >
                  <span class="text-xs font-extrabold leading-none select-none">ⓘ</span>
                </div>

                <div 
                  class="p-3.5 rounded-2xl text-xs leading-relaxed shadow-none border select-text max-w-full"
                  :class="[
                    msg.isSelf 
                      ? (msg.status === 'failed' || msg.status === 'expired'
                        ? 'bg-red-50 text-red-700 border-red-150 rounded-tr-sm rounded-bl-2xl rounded-br-2xl' 
                        : 'bg-[#23B750] text-white border-transparent rounded-tr-sm rounded-bl-2xl rounded-br-2xl') 
                      : 'bg-white text-gray-800 border-gray-200 rounded-tl-sm rounded-bl-2xl rounded-br-2xl'
                  ]"
                >
                  <!-- WhatsApp-style Quoted Reply Box -->
                  <div 
                    v-if="msg.quote"
                    class="mb-2 p-2 rounded-lg text-left select-none overflow-hidden flex gap-2 items-stretch"
                    :class="[
                      msg.isSelf 
                        ? 'bg-black/15 text-white' 
                        : 'bg-gray-100/80 text-gray-800'
                    ]"
                  >
                    <!-- Left Accent Bar -->
                    <span 
                      class="w-1 rounded-full shrink-0" 
                      :class="[msg.isSelf ? 'bg-white' : 'bg-[#23B750]']"
                    ></span>

                    <div class="flex-1 min-w-0 flex flex-col justify-center">
                      <div 
                        class="text-[11px] font-bold leading-tight mb-0.5 truncate"
                        :class="[msg.isSelf ? 'text-white' : 'text-[#23B750]']"
                      >
                        {{ msg.quote.sender }}
                      </div>
                      <div 
                        class="text-[11px] leading-tight line-clamp-2"
                        :class="[msg.isSelf ? 'text-white/90' : 'text-gray-600']"
                      >
                        {{ msg.quote.text }}
                      </div>
                    </div>
                  </div>

                  <div>{{ msg.text }}</div>
                </div>
              </div>

              <!-- Outbox checks and captions -->
              <div class="flex items-center gap-1 select-none text-[10px] font-bold text-gray-400 mt-0.5 h-3.5">
                <template v-if="msg.isSelf">
                  <!-- Check if AI Chatbot -->
                  <template v-if="msg.sender === 'AI Chatbot'">
                    <span class="text-green-600 font-bold select-none flex items-center gap-1">
                      <svg class="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M9.813 15.904L9 21l-.813-5.096L3.096 15 8.187 14.187 9 9l.813 5.187L14.904 15z"/></svg>
                      <span>Sent by RakanSalesAI (Internal Note)</span>
                    </span>
                  </template>
                  <template v-else>
                    <!-- Double checks indicators for success -->
                    <span v-if="!msg.status || msg.status === 'delivered' || msg.status === 'sent'" class="text-[#23B750] flex items-center leading-none">
                      <svg class="w-3.5 h-3.5 stroke-current stroke-[2.5]" fill="none" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    
                    <!-- Failed Send Alert texts -->
                    <span v-if="msg.status === 'failed'" class="text-red-500 font-extrabold select-none">Message Failed to Send</span>
                    <span v-else-if="msg.status === 'expired'" class="text-red-500 font-extrabold select-none">Message failed: 24-hour Whatsapp window expired</span>
                    <span v-else-if="msg.metaLabel" class="text-gray-500 font-semibold">{{ msg.metaLabel }}</span>
                  </template>
                </template>
                <template v-else-if="msg.metaLabel">
                  <span class="text-gray-500 font-semibold">{{ msg.metaLabel }}</span>
                </template>
              </div>
            </div>
          </template>
          
          <!-- Empty state placeholder if no messages -->
          <div v-if="activeChatMessages.length === 0" class="flex-grow flex flex-col items-center justify-center text-center p-12 select-none">
            <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
              <svg class="w-6 h-6 stroke-[1.75]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 class="text-sm font-semibold text-gray-800">No message history</h3>
            <p class="text-xs text-gray-500 mt-1 max-w-xs">Start the conversation by typing a reply in the composer below.</p>
          </div>
        </div>

        <!-- Floating Jump to Latest Button (Positioned cleanly inside canvas bottom-right above composer) -->
        <transition
          enter-active-class="transition ease-out duration-300"
          enter-from-class="opacity-0 translate-y-3 scale-95"
          enter-to-class="opacity-100 translate-y-0 scale-100"
          leave-active-class="transition ease-in duration-200"
          leave-from-class="opacity-100 translate-y-0 scale-100"
          leave-to-class="opacity-0 translate-y-3 scale-95"
        >
          <button 
            v-if="showJumpToLatest" 
            @click="scrollToBottom" 
            class="absolute bottom-4 right-6 bg-[#23B750] hover:bg-[#1fa346] text-white font-bold text-xs px-3.5 py-2 rounded-full shadow-md z-10 flex items-center gap-1.5 cursor-pointer outline-none hover:scale-105 active:scale-95 transition-all select-none"
          >
            <svg class="w-3.5 h-3.5 fill-none stroke-current" viewBox="0 0 24 24" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
            <span>Jump to latest</span>
          </button>
        </transition>
      </div>

      <!-- PERSISTENT FOOTER BANNERS SECTION -->
      <div class="flex flex-col border-t border-gray-150 select-none">
        <!-- Banner 1: Snoozed Alert Banner (red-tinted) -->
        <div v-if="activeConversation?.isSnoozed" class="bg-red-50/75 border-b border-red-100 px-6 py-2.5 flex items-center justify-between text-xs font-semibold animate-in slide-in-from-bottom duration-300">
          <div class="flex items-center gap-2 text-red-700">
            <svg class="w-4 h-4 text-red-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              <path d="M18.63 13A17.89 17.89 0 0 1 18 8"/>
              <path d="M6.26 6.26A5.86 5.86 0 0 0 6 8v7a3 3 0 0 1-3 3h15"/>
              <path d="m2 2 20 20"/>
              <path d="M10 4a2 2 0 0 1 4 0v.18"/>
            </svg>
            <span>Chat is Muted / Snoozed ({{ getSnoozeCountdown(activeConversation) }})</span>
          </div>
          <div class="flex items-center gap-3">
            <button @click="toggleSnooze(activeConversation)" class="text-red-750 hover:text-red-900 cursor-pointer outline-none font-extrabold">Unsnooze</button>
          </div>
        </div>

        <!-- Banner 2: Ready for Human Response Banner (green-tinted) -->
        <div v-if="isHumanResponseBannerOpen" class="bg-green-50/75 border-b border-green-150 px-6 py-2.5 flex items-center justify-between text-xs font-semibold animate-in slide-in-from-bottom duration-300">
          <div class="flex items-center gap-2 text-green-700">
            <svg class="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <span>Chat ready for human response</span>
          </div>
          <div class="flex items-center gap-3">
            <button @click="addToast('Opening agent transfer drawer...', 'info')" class="text-green-750 hover:text-green-900 cursor-pointer outline-none font-extrabold">Reassign</button>
            <span class="text-green-200 font-normal">|</span>
            <button @click="isHumanResponseBannerOpen = false" class="text-green-555 hover:text-green-750 cursor-pointer outline-none font-extrabold">Dismiss</button>
          </div>
        </div>

        <!-- Removed AI Detected Casual Response Widget -->
      </div>

      <!-- Textbox message sender bar / Resolved Banner wrapper -->
      <div class="p-3.5 bg-white border-t border-gray-200 flex-shrink-0 select-none">
        <!-- RESOLVED LOCK FLOW PANEL -->
        <div v-if="activeConversation.section === 'Resolved'" class="flex items-center justify-between bg-green-50/40 border border-green-150 rounded-xl p-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-[#23B750] flex-shrink-0">
              <svg class="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            </div>
            <div>
              <h4 class="text-xs font-bold text-gray-900 leading-none">Conversation Resolved</h4>
              <p class="text-[11px] text-gray-500 mt-1.5">This conversation is resolved and archived. Reopen thread to continue writing messages.</p>
            </div>
          </div>
          <button 
            @click="reopenActiveConversation" 
            class="px-4 py-2 text-xs font-bold text-white bg-[#23B750] hover:bg-[#1a923f] rounded-lg transition-colors cursor-pointer"
          >
            Reopen Thread
          </button>
        </div>
        
        <div v-else class="flex flex-col w-full animate-in fade-in duration-200">
          <!-- Switcher Mode Tabs & AI Toggle -->
          <div class="flex items-center justify-between border-b border-gray-150 pb-0.5">
            <div class="flex gap-1.5">
              <button 
                @click="composerMode = 'reply'"
                class="px-4 py-1.5 text-xs font-bold transition-all border-b-2 outline-none h-8 flex items-center justify-center cursor-pointer"
                :class="composerMode === 'reply' ? 'border-[#23B750] text-[#23B750] font-extrabold' : 'border-transparent text-gray-400 hover:text-gray-700'"
              >
                Reply
              </button>
              <button 
                @click="composerMode = 'note'"
                class="px-4 py-1.5 text-xs font-bold transition-all border-b-2 outline-none h-8 flex items-center justify-center cursor-pointer"
                :class="composerMode === 'note' ? 'border-[#23B750] text-[#23B750] font-extrabold' : 'border-transparent text-gray-400 hover:text-gray-700'"
              >
                Private Note
              </button>
            </div>
            
            <!-- AI Auto-Reply Switcher -->
            <div class="flex items-center gap-2 pr-2 select-none shrink-0">
              <span class="text-[10px] font-extrabold tracking-wider uppercase text-gray-400">AI Auto-Reply</span>
              <button 
                @click="toggleAiAutoReply"
                class="w-8 h-4 rounded-full relative transition-colors focus:outline-none cursor-pointer"
                :class="isAiAutoReplyOn ? 'bg-[#23B750]' : 'bg-gray-200'"
              >
                <span class="w-3.5 h-3.5 bg-white rounded-full absolute top-[0.5px] transition-all" :class="isAiAutoReplyOn ? 'left-[17px]' : 'left-[1px]'"></span>
              </button>
            </div>
          </div>

          <!-- Tan/Yellow background wrapper for Private Note mode vs Plain White for Reply -->
          <div 
            class="flex flex-col border border-gray-250/80 rounded-xl mt-3.5 transition-colors duration-300 relative"
            :class="composerMode === 'note' ? 'bg-[#FEF9C3]/20 border-[#FEF08A]' : 'bg-white'"
          >
            <!-- SENDER IDENTITIES / EMAIL HEADERS -->
            <template v-if="composerMode === 'reply'">
              <!-- Email format parameters -->
              <div v-if="activeConversation.platform === 'Mail'" class="flex flex-col">
                <div class="flex items-center justify-between border-b border-gray-150 px-4 py-2 text-xs font-bold text-gray-500 bg-gray-50/20">
                  <div class="flex items-center gap-2 flex-1 min-w-0">
                    <span class="text-gray-400 w-8 select-none">TO</span>
                    <input v-model="emailTo" class="flex-1 bg-transparent focus:outline-none font-semibold text-gray-700 text-xs" />
                  </div>
                  <div class="flex items-center gap-2 select-none">
                    <button @click="isCcBccOpen = !isCcBccOpen" class="text-[11px] font-bold text-gray-400 hover:text-gray-700 cursor-pointer outline-none">CC Bcc</button>
                  </div>
                </div>
                
                <div v-if="isCcBccOpen" class="flex flex-col border-b border-gray-150 select-none bg-gray-50/20">
                  <div class="flex items-center border-b border-gray-150 px-4 py-2 text-xs font-bold text-gray-500">
                    <span class="text-gray-400 w-8">CC</span>
                    <input v-model="emailCc" placeholder="Cc addresses..." class="flex-1 bg-transparent focus:outline-none font-semibold text-gray-700 text-xs" />
                  </div>
                  <div class="flex items-center border-b border-gray-150 px-4 py-2 text-xs font-bold text-gray-500">
                    <span class="text-gray-400 w-8">BCC</span>
                    <input v-model="emailBcc" placeholder="Bcc addresses..." class="flex-1 bg-transparent focus:outline-none font-semibold text-gray-700 text-xs" />
                  </div>
                </div>
                
                <div class="flex items-center border-b border-gray-150 px-4 py-2 text-xs font-bold text-gray-500 bg-gray-50/20">
                  <span class="text-gray-400 w-8 select-none">VIA</span>
                  <input v-model="emailVia" class="flex-1 bg-transparent focus:outline-none font-semibold text-gray-700 text-xs" />
                </div>
                <div class="flex items-center border-b border-gray-150 px-4 py-2 text-xs font-bold text-gray-500 bg-gray-50/20">
                  <span class="text-gray-400 w-8 select-none">SUB</span>
                  <input v-model="emailSubject" class="flex-1 bg-transparent focus:outline-none font-semibold text-gray-700 text-xs" />
                </div>
              </div>
              
              <!-- Direct message parameters -->
              <div v-else class="border-b border-gray-150 px-4 py-2 text-[11px] font-bold text-gray-500 bg-gray-50/10 flex items-center gap-1.5 select-none">
                <span>Replying as Janice Lee (+6012 3456 7890)</span>
              </div>
            </template>

            <!-- TYPOGRAPHY FORMATTING TOOLBAR -->
            <!-- Reply Mode formatting toolbar (shown if Mail platform OR isTypographyToolbarOpen is active) -->
            <div v-if="composerMode === 'reply' && (activeConversation.platform === 'Mail' || isTypographyToolbarOpen)" class="flex items-center gap-1.5 border-b border-gray-150 px-3 py-1.5 bg-gray-55/50 overflow-x-auto scrollbar-none select-none h-11 animate-in slide-in-from-top-1 duration-150">
              <!-- Font selector dropdown -->
              <div class="relative flex-shrink-0">
                <button @click.stop="isFontDropdownOpen = !isFontDropdownOpen" class="h-7 px-2.5 rounded-lg border border-gray-200 bg-white text-[11px] font-bold text-gray-600 flex items-center gap-1 outline-none cursor-pointer">
                  <span>{{ activeFont }}</span>
                  <svg class="w-3 h-3 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 9l-7 7-7-7"/></svg>
                </button>
                <div v-if="isFontDropdownOpen" class="absolute left-0 mt-1 w-28 bg-white border border-gray-200 rounded-lg shadow-md z-30 py-1">
                  <button v-for="font in fontOptions" :key="font" @click="activeFont = font; isFontDropdownOpen = false" class="w-full text-left px-2.5 py-1.5 text-xs hover:bg-gray-50 font-semibold text-gray-700">{{ font }}</button>
                </div>
              </div>

              <!-- Size selector dropdown -->
              <div class="relative flex-shrink-0">
                <button @click.stop="isFontSizeDropdownOpen = !isFontSizeDropdownOpen" class="h-7 px-2 rounded-lg border border-gray-200 bg-white text-[11px] font-bold text-gray-600 flex items-center gap-1 outline-none cursor-pointer">
                  <span>{{ activeFontSize }}</span>
                  <svg class="w-3 h-3 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 9l-7 7-7-7"/></svg>
                </button>
                <div v-if="isFontSizeDropdownOpen" class="absolute left-0 mt-1 w-20 bg-white border border-gray-200 rounded-lg shadow-md z-30 py-1">
                  <button v-for="size in fontSizeOptions" :key="size" @click="activeFontSize = size; isFontSizeDropdownOpen = false" class="w-full text-left px-2.5 py-1.5 text-xs hover:bg-gray-50 font-semibold text-gray-700">{{ size }}</button>
                </div>
              </div>

              <button @click="isBoldActive = !isBoldActive; addToast(isBoldActive ? 'Bold formatting active' : 'Bold deactivated', 'info')" class="w-7 h-7 rounded-lg border flex items-center justify-center font-bold text-[11px] cursor-pointer outline-none transition-colors duration-150" :class="[isBoldActive ? 'bg-[#23B750] text-white border-[#23B750] shadow-2xs' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900']">B</button>
              <button @click="isItalicActive = !isItalicActive; addToast(isItalicActive ? 'Italic formatting active' : 'Italic deactivated', 'info')" class="w-7 h-7 rounded-lg border flex items-center justify-center font-bold text-[11px] italic cursor-pointer outline-none transition-colors duration-150" :class="[isItalicActive ? 'bg-[#23B750] text-white border-[#23B750] shadow-2xs' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900']">I</button>
              <button @click="isUnderlineActive = !isUnderlineActive; addToast(isUnderlineActive ? 'Underline formatting active' : 'Underline deactivated', 'info')" class="w-7 h-7 rounded-lg border flex items-center justify-center font-bold text-[11px] underline cursor-pointer outline-none transition-colors duration-150" :class="[isUnderlineActive ? 'bg-[#23B750] text-white border-[#23B750] shadow-2xs' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900']">U</button>
              
              <span class="text-gray-300 font-normal select-none px-0.5">|</span>

              <!-- Text color picker dropdown popover -->
              <div class="relative shrink-0 flex items-center">
                <button @click.stop="isColorDropdownOpen = !isColorDropdownOpen" class="w-7 h-7 rounded-lg border flex items-center justify-center cursor-pointer outline-none transition-colors duration-200 bg-white" :style="{ borderColor: activeTextColor }">
                  <span class="w-3.5 h-3.5 rounded-full" :style="{ backgroundColor: activeTextColor }"></span>
                </button>
                <div v-if="isColorDropdownOpen" class="absolute bottom-9 left-0 bg-white border border-gray-200 rounded-xl shadow-lg p-2.5 z-45 w-32 flex flex-wrap gap-1.5 animate-in slide-in-from-bottom-2 duration-150">
                  <button v-for="c in ['#1E293B', '#EF4444', '#10B981', '#3B82F6', '#8B5CF6']" :key="c" @click="activeTextColor = c; isColorDropdownOpen = false; addToast('Active text color set successfully!', 'info')" class="w-5.5 h-5.5 rounded-full border border-gray-150 hover:scale-110 active:scale-95 transition-all cursor-pointer" :style="{ backgroundColor: c }"></button>
                </div>
              </div>

              <span class="text-gray-300 font-normal select-none px-0.5">|</span>

              <button @click="activeTextAlign = 'left'; addToast('Text alignment: Left', 'info')" class="p-1 rounded cursor-pointer outline-none transition-colors" :class="[activeTextAlign === 'left' ? 'bg-[#23B750] text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900']"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg></button>
              <button @click="activeTextAlign = 'center'; addToast('Text alignment: Center', 'info')" class="p-1 rounded cursor-pointer outline-none transition-colors" :class="[activeTextAlign === 'center' ? 'bg-[#23B750] text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900']"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="10" x2="6" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="18" y1="14" x2="6" y2="14"/><line x1="21" y1="18" x2="3" y2="18"/></svg></button>
              <button @click="addToast('Applied list styling', 'info')" class="p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 cursor-pointer outline-none transition-colors"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6" stroke-width="3"/><line x1="3" y1="12" x2="3.01" y2="12" stroke-width="3"/><line x1="3" y1="18" x2="3.01" y2="18" stroke-width="3"/></svg></button>
              
              <span class="text-gray-300 font-normal select-none px-0.5">|</span>

              <button @click="addToast('Inserting hyper link...', 'info')" class="p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 cursor-pointer outline-none transition-colors"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></button>
              <button @click="addToast('Uploading image...', 'info')" class="p-1 hover:bg-gray-150 rounded text-gray-600 hover:text-gray-900 cursor-pointer outline-none transition-colors"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></button>
              <button 
                @click="generateAiDraft" 
                class="p-1 hover:bg-blue-50 rounded text-[#2563EB] cursor-pointer outline-none transition-colors"
                :class="isGeneratingAiDraft ? 'animate-pulse opacity-70' : ''"
                title="AI Assistant: Generate Contextual Reply Draft"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M15.2 3.8a2.5 2.5 0 0 1 3.5 3.5L6.5 19.5l-4.5 1 1-4.5L15.2 3.8z"/>
                  <path d="M19 1l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7L19 1z" fill="currentColor" stroke="none"/>
                </svg>
              </button>
            </div>
            
            <!-- Private Note Mode Toolbar -->
            <div v-else-if="composerMode === 'note'" class="flex items-center gap-1.5 border-b border-gray-150 px-3 py-1.5 bg-gray-55/50 overflow-x-auto scrollbar-none select-none h-11">
              <button @click="isBoldActive = !isBoldActive; addToast(isBoldActive ? 'Bold active' : 'Bold inactive', 'info')" class="w-7 h-7 rounded-lg border flex items-center justify-center font-bold text-[11px] cursor-pointer outline-none transition-colors duration-150" :class="[isBoldActive ? 'bg-amber-600 text-white border-amber-600 shadow-2xs' : 'bg-white border-amber-200 text-amber-900 hover:bg-amber-50']">B</button>
              <button @click="isItalicActive = !isItalicActive; addToast(isItalicActive ? 'Italic active' : 'Italic inactive', 'info')" class="w-7 h-7 rounded-lg border flex items-center justify-center font-bold text-[11px] italic cursor-pointer outline-none transition-colors duration-150" :class="[isItalicActive ? 'bg-amber-600 text-white border-amber-600 shadow-2xs' : 'bg-white border-amber-200 text-amber-900 hover:bg-amber-50']">I</button>
              <button @click="isUnderlineActive = !isUnderlineActive; addToast(isUnderlineActive ? 'Underline active' : 'Underline inactive', 'info')" class="w-7 h-7 rounded-lg border flex items-center justify-center font-bold text-[11px] underline cursor-pointer outline-none transition-colors duration-150" :class="[isUnderlineActive ? 'bg-amber-600 text-white border-amber-600 shadow-2xs' : 'bg-white border-amber-200 text-amber-900 hover:bg-amber-50']">U</button>
              
              <span class="text-gray-300 font-normal select-none px-0.5">|</span>
              
              <button @click="activeTextAlign = 'left'; addToast('Text alignment: Left', 'info')" class="p-1 rounded cursor-pointer outline-none transition-colors" :class="[activeTextAlign === 'left' ? 'bg-amber-600 text-white' : 'text-amber-900 hover:bg-amber-100']"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg></button>
              <button @click="activeTextAlign = 'center'; addToast('Text alignment: Center', 'info')" class="p-1 rounded cursor-pointer outline-none transition-colors" :class="[activeTextAlign === 'center' ? 'bg-amber-600 text-white' : 'text-amber-900 hover:bg-amber-100']"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="10" x2="6" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="18" y1="14" x2="6" y2="14"/><line x1="21" y1="18" x2="3" y2="18"/></svg></button>
              <button @click="addToast('Applied list styling', 'info')" class="p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 cursor-pointer outline-none transition-colors"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6" stroke-width="3"/><line x1="3" y1="12" x2="3.01" y2="12" stroke-width="3"/><line x1="3" y1="18" x2="3.01" y2="18" stroke-width="3"/></svg></button>
            </div>

            <!-- TEXTAREA INPUT WINDOW WITH FLOATING /SLASH TEMPLATES POPOVER -->
            <div class="p-2 select-none flex flex-col gap-1 relative">
              <!-- FLOATING /SLASH COMMAND TEMPLATE SELECTION MENU POPOVER -->
              <transition
                enter-active-class="transition ease-out duration-150"
                enter-from-class="opacity-0 translate-y-2 scale-98"
                enter-to-class="opacity-100 translate-y-0 scale-100"
                leave-active-class="transition ease-in duration-100"
                leave-from-class="opacity-100 translate-y-0 scale-100"
                leave-to-class="opacity-0 translate-y-2 scale-98"
              >
                <div 
                  v-if="slashMenuOpen" 
                  ref="slashPopupRef"
                  class="absolute bottom-full mb-2 left-0 right-0 sm:right-auto sm:w-[520px] bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
                >
                  <!-- Slash Header Bar -->
                  <div class="px-3.5 py-2.5 bg-gray-50/90 border-b border-gray-150 flex items-center justify-between select-none shrink-0">
                    <div class="flex items-center gap-2">
                      <span class="w-5 h-5 rounded-md bg-[#23B750]/15 text-[#23B750] flex items-center justify-center font-mono font-black text-xs">/</span>
                      <span class="text-xs font-extrabold text-gray-900">CRM Template Shortcuts</span>
                      <span v-if="slashQuery" class="text-[11px] font-mono font-bold text-gray-600 bg-gray-200/80 px-1.5 py-0.5 rounded leading-none">/{{ slashQuery }}</span>
                    </div>
                    <button 
                      type="button"
                      @click="isComposerTemplatePickerOpen = true; slashMenuOpen = false" 
                      class="text-[11px] font-bold text-[#23B750] hover:text-[#1fa346] flex items-center gap-1 cursor-pointer outline-none transition-colors"
                    >
                      <span>Browse Library (Modal)</span>
                      <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </button>
                  </div>

                  <!-- Slash Template Items List -->
                  <div ref="slashMenuContainerRef" class="max-h-64 overflow-y-auto p-1.5 space-y-1 scrollbar-thin">
                    <template v-if="filteredSlashTemplates.length > 0">
                      <div 
                        v-for="(template, idx) in filteredSlashTemplates" 
                        :key="template.id"
                        @click="insertSlashTemplate(template)"
                        @mouseenter="slashHighlightedIndex = idx"
                        class="p-2.5 rounded-xl cursor-pointer transition-all select-none border"
                        :class="[
                          slashHighlightedIndex === idx 
                            ? 'bg-green-50/70 border-green-200 shadow-2xs slash-item-active' 
                            : 'border-transparent hover:bg-gray-50'
                        ]"
                      >
                        <div class="flex items-center justify-between gap-2">
                          <div class="flex items-center gap-2 min-w-0">
                            <span 
                              class="px-2 py-0.5 rounded-md font-mono text-[11px] font-extrabold border shrink-0 transition-colors"
                              :class="slashHighlightedIndex === idx ? 'bg-white text-[#23B750] border-green-300 shadow-2xs' : 'bg-gray-100 text-gray-700 border-gray-200'"
                            >
                              {{ template.shortcut }}
                            </span>
                            <span class="text-xs font-extrabold text-gray-900 truncate">{{ template.title }}</span>
                          </div>
                          
                          <div class="flex items-center gap-1.5 shrink-0">
                            <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">{{ template.category }}</span>
                            <span v-if="slashHighlightedIndex === idx" class="text-[10px] font-bold text-[#23B750] flex items-center gap-0.5">
                              ↵ Insert
                            </span>
                          </div>
                        </div>

                        <!-- Snippet Preview with dynamic variable resolution -->
                        <p class="text-[11px] text-gray-500 leading-snug line-clamp-1 mt-1 font-medium pl-0.5">
                          {{ resolveTemplateForActiveContact(template) }}
                        </p>
                      </div>
                    </template>

                    <!-- Empty State -->
                    <div v-else class="py-6 px-4 text-center flex flex-col items-center justify-center gap-1 select-none">
                      <span class="text-xs font-bold text-gray-600">No template matching "/{{ slashQuery }}"</span>
                      <span class="text-[11px] text-gray-400">Press <kbd class="px-1 py-0.5 bg-gray-100 rounded border text-[10px] font-mono">Esc</kbd> to dismiss or click Browse Library above.</span>
                    </div>
                  </div>

                  <!-- Slash Footer Bar -->
                  <div class="px-3.5 py-2 bg-gray-50/80 border-t border-gray-150 flex items-center justify-between text-[11px] text-gray-400 font-semibold select-none shrink-0">
                    <span>↑↓ Navigate • ↵ / Tab Select • Esc Dismiss</span>
                    <span>{{ filteredSlashTemplates.length }} templates</span>
                  </div>
                </div>
              </transition>

              <!-- TEXTAREA -->
              <textarea 
                ref="composerTextareaRef"
                v-model="newMessage"
                :placeholder="composerMode === 'note' ? 'Write an internal private note...' : (activeConversation.platform === 'Mail' ? 'Write an email reply... (Type / for templates)' : `Message ${activeConversation.sender}... (Type / for templates)`)" 
                class="w-full text-xs border-0 bg-transparent focus:outline-none focus:ring-0 resize-none font-medium h-20 placeholder:text-[13px] placeholder:text-gray-400 leading-relaxed text-gray-700 outline-none transition-all duration-150"
                :style="composerStyles"
                @input="checkSlashCommand"
                @keydown="handleComposerKeydown"
              ></textarea>
              <button @click="addToast('Editor expanded to full window focus!', 'info')" class="absolute top-2 right-2 text-gray-400 hover:text-gray-655 cursor-pointer outline-none" title="Expand composer size"><svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg></button>
            </div>

            <!-- Attachment Pills List -->
            <div v-if="simulatedAttachments.length > 0" class="flex flex-wrap gap-2 px-3 pb-2 pt-1 border-t border-gray-100 bg-gray-50/50">
              <span 
                v-for="file in simulatedAttachments" 
                :key="file.name"
                class="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border text-xs font-bold bg-white"
                :class="file.uploaded ? 'border-gray-200 text-gray-700' : 'border-blue-150 text-blue-600'"
              >
                <svg v-if="!file.uploaded" class="w-3.5 h-3.5 animate-spin text-blue-500" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" class="opacity-25" stroke-dasharray="80" stroke-dashoffset="60"/><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" class="opacity-75"/></svg>
                <svg v-else class="w-3.5 h-3.5 text-[#23B750]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>{{ file.name }}</span>
                <span v-if="!file.uploaded" class="text-[10px] text-gray-400 font-medium font-mono">({{ file.progress }}%)</span>
                <button @click="simulatedAttachments = simulatedAttachments.filter(f => f.name !== file.name)" class="text-gray-450 hover:text-red-500 font-extrabold ml-1 font-sans cursor-pointer outline-none">×</button>
              </span>
            </div>

            <!-- TOOLBAR / ACTIONS persistence bar -->
            <div class="flex items-center justify-between border-t border-gray-150 px-4 py-2 bg-gray-55 select-none shrink-0 h-11 relative rounded-b-xl">
              <div class="flex items-center gap-1.5">
                <!-- Floating Emoji Picker -->
                <div class="relative shrink-0 flex items-center">
                  <button 
                    @click="isComposerEmojiOpen = !isComposerEmojiOpen; if (isComposerEmojiOpen) isComposerAttachmentOpen = false" 
                    class="p-1 hover:bg-gray-150 rounded text-gray-400 hover:text-gray-650 cursor-pointer outline-none transition-colors" 
                    :class="isComposerEmojiOpen ? 'bg-gray-200 text-gray-800' : '' "
                    title="Insert emoji"
                  >
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9" stroke-width="2.5"/><line x1="15" y1="9" x2="15.01" y2="9" stroke-width="2.5"/></svg>
                  </button>
                  <div 
                    v-if="isComposerEmojiOpen" 
                    class="absolute bottom-full mb-2 left-0 bg-white border border-gray-200 rounded-xl shadow-xl p-2.5 z-50 w-52 flex flex-col gap-1.5 animate-in slide-in-from-bottom-2 duration-150 select-none"
                  >
                    <div class="flex items-center justify-between border-b border-gray-100 pb-1 px-0.5">
                      <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Quick Emojis</span>
                      <button @click="isComposerEmojiOpen = false" class="text-gray-400 hover:text-gray-600 text-xs font-bold">×</button>
                    </div>
                    <div class="grid grid-cols-6 gap-1 pt-0.5">
                      <button v-for="emoji in ['😊', '👍', '👋', '✨', '🔥', '📅', '💬', '🚀', '💡', '🎉', '❤️', '👏', '🤝', '⭐', '⚡', '🎯', '✅', '🙌']" :key="emoji" @click="insertEmoji(emoji)" class="text-base hover:scale-125 hover:bg-gray-50 rounded transition-transform p-1 flex items-center justify-center cursor-pointer select-none">{{ emoji }}</button>
                    </div>
                  </div>
                </div>

                <!-- Floating File Attachment Picker -->
                <div class="relative shrink-0 flex items-center">
                  <button 
                    @click="isComposerAttachmentOpen = !isComposerAttachmentOpen; if (isComposerAttachmentOpen) isComposerEmojiOpen = false" 
                    class="p-1 hover:bg-gray-150 rounded text-gray-400 hover:text-gray-655 cursor-pointer outline-none transition-colors" 
                    :class="isComposerAttachmentOpen ? 'bg-gray-200 text-gray-800' : '' "
                    title="Attach file"
                  >
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                  </button>
                  <div 
                    v-if="isComposerAttachmentOpen" 
                    class="absolute bottom-full mb-2 left-0 bg-white border border-gray-200 rounded-2xl shadow-xl p-3 z-50 w-72 flex flex-col gap-2.5 animate-in slide-in-from-bottom-2 duration-150 select-none"
                  >
                    <div class="flex items-center justify-between border-b border-gray-100 pb-1.5">
                      <span class="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Select File to Attach</span>
                      <button @click="isComposerAttachmentOpen = false" class="text-gray-400 hover:text-gray-600 text-xs font-bold">×</button>
                    </div>
                    <div class="flex flex-col gap-1.5">
                      <button @click="uploadMockFile('RakanSales_Proposal_v4.pdf', '1.2 MB')" class="w-full text-left p-2 hover:bg-gray-50 border border-gray-100 rounded-xl text-xs font-semibold text-gray-700 flex items-center justify-between cursor-pointer transition-colors">
                        <span class="flex items-center gap-1.5 truncate">📂 Proposal_v4.pdf</span>
                        <span class="text-[10px] text-gray-400 shrink-0 font-normal">1.2MB</span>
                      </button>
                      <button @click="uploadMockFile('Contract_Draft_KK_Steel.docx', '420 KB')" class="w-full text-left p-2 hover:bg-gray-50 border border-gray-100 rounded-xl text-xs font-semibold text-gray-700 flex items-center justify-between cursor-pointer transition-colors">
                        <span class="flex items-center gap-1.5 truncate">📂 Contract_Draft.docx</span>
                        <span class="text-[10px] text-gray-400 shrink-0 font-normal">420KB</span>
                      </button>
                      <button @click="uploadMockFile('Mockup_Attachment.png', '2.4 MB')" class="w-full text-left p-2 hover:bg-gray-50 border border-gray-100 rounded-xl text-xs font-semibold text-gray-700 flex items-center justify-between cursor-pointer transition-colors">
                        <span class="flex items-center gap-1.5 truncate">📂 Mockup_Attachment.png</span>
                        <span class="text-[10px] text-gray-400 shrink-0 font-normal">2.4MB</span>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Typography toggle button -->
                <button 
                  @click="isTypographyToolbarOpen = !isTypographyToolbarOpen" 
                  class="p-1 hover:bg-gray-150 rounded text-gray-400 hover:text-gray-650 cursor-pointer outline-none transition-colors"
                  :class="isTypographyToolbarOpen ? 'bg-gray-200 text-gray-800 font-bold' : ''"
                  title="Toggle typography formatting toolbar"
                >
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>
                </button>
                <button 
                  @click="generateAiDraft" 
                  class="p-1 hover:bg-blue-50 rounded text-[#2563EB] cursor-pointer outline-none transition-colors flex items-center justify-center"
                  :class="isGeneratingAiDraft ? 'animate-pulse opacity-70' : ''"
                  title="AI Assistant: Generate Contextual Reply Draft"
                >
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M15.2 3.8a2.5 2.5 0 0 1 3.5 3.5L6.5 19.5l-4.5 1 1-4.5L15.2 3.8z"/>
                    <path d="M19 1l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7L19 1z" fill="currentColor" stroke="none"/>
                  </svg>
                </button>
                
                <template v-if="composerMode === 'reply' && activeConversation.platform !== 'Mail'">
                  <span class="text-gray-300 font-normal select-none px-0.5">|</span>
                  <button @click="isComposerTemplatePickerOpen = true" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-600 cursor-pointer outline-none transition-all duration-200">
                    <svg class="w-3.5 h-3.5 text-gray-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    <span>Template</span>
                  </button>
                  <button @click="triggerComposerSummary" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-600 cursor-pointer outline-none transition-all duration-200">
                    <svg class="w-3.5 h-3.5 text-[#2563EB] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M4 10h16M4 14h12M4 18h8"/></svg>
                    <span>Summarize</span>
                  </button>
                  <button @click="isComposerMeetingOpen = true" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-600 cursor-pointer outline-none transition-all duration-200">
                    <svg class="w-3.5 h-3.5 text-gray-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    <span>Meeting</span>
                  </button>
                </template>
              </div>
              
              <div>
                <button 
                  v-if="composerMode === 'note'"
                  @click="addPrivateNoteFromComposer"
                  class="px-4 py-1.5 text-xs font-bold text-white bg-[#1E823B] hover:bg-[#15612c] rounded-lg transition-colors cursor-pointer select-none outline-none"
                >
                  + Add Note
                </button>
                <button
                  v-else
                  @click="sendChatMessage"
                  class="px-4 py-1.5 text-xs font-bold text-white bg-[#23B750] hover:bg-[#1a923f] rounded-lg transition-colors cursor-pointer select-none outline-none"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </main>

    <!-- RIGHT PANEL: Collapsible Customer Details Drawer Component -->
    <transition
      enter-active-class="transition ease-out duration-300 transform"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition ease-in duration-200 transform"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <ContactDrawer 
        v-if="isRightDrawerOpen"
        :active-conversation="activeConversation"
        v-model:scratch-note="scratchNote"
        :available-tags="availableTags"
        @save-note="saveCustomerNote"
        @toggle-resolve="activeConversation.section === 'Resolved' || activeConversation.lifecycleState === 'closed' ? reopenActiveConversation() : resolveActiveConversation()"
        @close="isRightDrawerOpen = false"
        @toast="addToast"
      />
    </transition>

    <!-- CUSTOM COMPOSE CONVERSATION MODAL DIALOG -->
    <Teleport to="body">
      <transition 
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div v-if="isComposeOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs select-none">
          <div class="bg-white rounded-2xl max-w-md w-full p-6 border border-gray-100 shadow-none flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
            <div class="flex items-center justify-between pb-2 border-b border-gray-100">
              <h2 class="text-base font-extrabold text-gray-900 flex items-center gap-2">
                <svg class="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
                </svg>
                Compose New Conversation
              </h2>
              <button @click="isComposeOpen = false" class="text-gray-450 hover:text-gray-700 cursor-pointer">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            
            <div class="space-y-4">
              <div>
                <label class="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Contact Name</label>
                <input 
                  v-model="composeName"
                  type="text" 
                  placeholder="e.g. Sarah Jenkins"
                  class="w-full text-xs bg-gray-50 border border-gray-250 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-semibold text-gray-700"
                />
              </div>
              
              <div>
                <label class="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Channel Platform</label>
                <select 
                  v-model="composePlatform"
                  class="w-full text-xs bg-gray-50 border border-gray-250 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer font-semibold text-gray-700"
                >
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Telegram">Telegram</option>
                  <option value="Facebook">Facebook Messenger</option>
                  <option value="Mail">Email (Mail)</option>
                </select>
              </div>
              
              <div>
                <label class="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">First Message</label>
                <textarea 
                  v-model="composeMessage"
                  rows="3" 
                  placeholder="Type the initial message details..."
                  class="w-full text-xs bg-gray-50 border border-gray-255 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none font-medium text-gray-700"
                ></textarea>
              </div>
            </div>
            
            <div class="flex justify-end gap-2.5 pt-2 border-t border-gray-100">
              <button 
                @click="isComposeOpen = false" 
                class="px-4 py-2 text-xs font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-md cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button 
                @click="handleCreateConversation" 
                class="px-4 py-2 text-xs font-bold text-white bg-primary hover:bg-primary-dark rounded-md cursor-pointer transition-colors"
              >
                Create Thread
              </button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>

    <!-- HIGH-FIDELITY FILTERS MODAL -->
    <FiltersModal 
      :is-open="isFiltersModalOpen"
      @close="isFiltersModalOpen = false"
      @apply="handleFiltersApply"
      @toast="addToast"
    />

    <!-- UPGRADED ENTERPRISE CRM TEMPLATE PICKER MODAL -->
    <TemplatePickerModal
      v-model="isComposerTemplatePickerOpen"
      :active-contact="{
        name: activeConversation?.sender || 'Customer',
        firstName: activeConversation?.sender?.split(' ')[0],
        company: (activeConversation as any)?.company || 'KK Steel Sdn Bhd',
        phone: (activeConversation as any)?.phone || '+6012 3456 7890',
        email: (activeConversation as any)?.email || 'customer@company.com',
        platform: activeConversation?.platform
      }"
      agent-name="Olivia Rhye"
      @select="handleSelectTemplate"
      @send="handleSendTemplateDirect"
      @manage="addToast('Navigating to Template Editor & Management...', 'info')"
    />

    <!-- HIGH-FIDELITY AI SUMMARIZER MODAL -->
    <Teleport to="body">
      <transition 
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div v-if="isComposerSummaryOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs select-none">
          <div class="bg-white rounded-2xl max-w-md w-full p-6 border border-gray-100 shadow-xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
            <div class="flex items-center justify-between pb-2 border-b border-gray-100">
              <h2 class="text-base font-extrabold text-gray-900 flex items-center gap-2">
                <svg class="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.813 15.904L9 21l-.813-5.096L3.096 15 8.187 14.187 9 9l.813 5.187L14.904 15z"/></svg>
                <span>AI Conversation Summary</span>
              </h2>
              <button @click="isComposerSummaryOpen = false" class="text-gray-450 hover:text-gray-700 cursor-pointer">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            
            <!-- Loading state -->
            <div v-if="isComposerSummaryLoading" class="py-12 flex flex-col items-center justify-center gap-3">
              <svg class="w-8 h-8 animate-spin text-blue-500" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" class="opacity-25" stroke-dasharray="80" stroke-dashoffset="60"/><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" class="opacity-75"/></svg>
              <span class="text-xs font-bold text-gray-500 animate-pulse">AI analyzing thread transcripts...</span>
            </div>
            
            <!-- Summary output -->
            <div v-else class="space-y-4">
              <div class="p-4 bg-blue-50/20 border border-blue-150 rounded-xl flex flex-col gap-2">
                <span class="text-[10px] font-extrabold uppercase text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full self-start leading-none">Context</span>
                <p class="text-xs text-gray-700 font-bold leading-relaxed">Prospect Mel Wong (KK Steel) is interested in our C4 sales execution integration tools.</p>
              </div>
              
              <div class="p-4 bg-orange-50/20 border border-orange-150 rounded-xl flex flex-col gap-2">
                <span class="text-[10px] font-extrabold uppercase text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full self-start leading-none">Prospect Grade</span>
                <p class="text-xs text-gray-700 font-bold leading-relaxed">🔥 Hot Lead (High signature matching in active lead databases).</p>
              </div>
              
              <div class="p-4 bg-green-50/20 border border-green-150 rounded-xl flex flex-col gap-2">
                <span class="text-[10px] font-extrabold uppercase text-green-700 bg-green-100 px-2 py-0.5 rounded-full self-start leading-none">Next Action Plan</span>
                <p class="text-xs text-gray-700 font-bold leading-relaxed">Schedule deep-dive discovery meeting this week to qualify deal sizing.</p>
              </div>
            </div>
            
            <div class="flex justify-end gap-2.5 pt-2 border-t border-gray-100">
              <button 
                @click="isComposerSummaryOpen = false" 
                class="px-4 py-2 text-xs font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-md cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button 
                v-if="!isComposerSummaryLoading"
                @click="addSummaryAsPrivateNote" 
                class="px-4 py-2 text-xs font-bold text-white bg-[#23B750] hover:bg-[#1a923f] rounded-md cursor-pointer transition-colors"
              >
                Add as Private Note
              </button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>

    <!-- HIGH-FIDELITY MEETING SCHEDULER MODAL -->
    <Teleport to="body">
      <transition 
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div v-if="isComposerMeetingOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs select-none">
          <div class="bg-white rounded-2xl max-w-md w-full p-6 border border-gray-150 shadow-xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
            <div class="flex items-center justify-between pb-2 border-b border-gray-100">
              <h2 class="text-base font-extrabold text-gray-900 flex items-center gap-2">
                <span>📅 Book Discovery / Demo Meeting</span>
              </h2>
              <button @click="isComposerMeetingOpen = false" class="text-gray-450 hover:text-gray-700 cursor-pointer">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            
            <div class="space-y-4">
              <div>
                <label class="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Meeting Title</label>
                <input 
                  v-model="meetingTitle" 
                  type="text" 
                  class="w-full text-xs bg-gray-50 border border-gray-250 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-semibold text-gray-700"
                />
              </div>
              
              <div>
                <label class="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Date</label>
                <input 
                  v-model="meetingDate" 
                  type="date" 
                  class="w-full text-xs bg-gray-50 border border-gray-250 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-semibold text-gray-700"
                />
              </div>
              
              <div>
                <label class="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Time</label>
                <input 
                  v-model="meetingTime" 
                  type="time" 
                  class="w-full text-xs bg-gray-50 border border-gray-250 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-semibold text-gray-700"
                />
              </div>
            </div>
            
            <div class="flex justify-end gap-2.5 pt-2 border-t border-gray-150">
              <button 
                @click="isComposerMeetingOpen = false" 
                class="px-4 py-2 text-xs font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-md cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button 
                @click="scheduleComposerMeeting" 
                class="px-4 py-2 text-xs font-bold text-white bg-[#23B750] hover:bg-[#1a923f] rounded-md cursor-pointer transition-colors"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>

  </div>
</template>

<style scoped>
/* Hidden elegant scrollbar overrides */
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>


