<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
 Select,
 SelectTrigger,
 SelectValue,
 SelectContent,
 SelectItem
} from '@/components/ui/select'
import {
 Scan,
 Camera,
 CheckCircle2,
 Sparkles,
 Send,
 User,
 Building,
 Mail,
 Phone,
 Globe,
 Tag,
 Flame,
 Sun,
 Snowflake,
 AlertCircle,
 ArrowRight,
 ArrowLeft,
 RotateCcw,
 Check,
 Plus,
 X,
 MessageSquare,
 DollarSign,
 Smartphone,
 Info,
 ChevronRight,
 ChevronLeft,
 ChevronDown,
 ChevronUp,
 Briefcase,
 SlidersHorizontal,
 LogOut,
 Zap,
 MapPin,
 Compass,
 UserPlus,
 Home,
 Settings,
 Layers,
 Grid,
 Hash,
 Users
} from 'lucide-vue-next'

const router = useRouter()

// --- Simulation Step State Machine ---
const currentStep = ref<number>(1)

const stepsList = [
 { id: 1, title: 'Contacts View', icon: User },
 { id: 2, title: 'Scanning Card', icon: Camera },
 { id: 3, title: 'Review Contacts', icon: CheckCircle2 },
 { id: 4, title: 'Add Labels', icon: Tag },
 { id: 5, title: 'Action Choice', icon: SlidersHorizontal },
 { id: 6, title: 'Send Greeting', icon: Send },
 { id: 7, title: 'Complete', icon: Sparkles }
]

interface ContactItem {
 id: string
 name: string
 title: string
 company: string
 phone: string
 email: string
 website?: string
 street?: string
 city?: string
 state?: string
 postcode?: string
 country?: string
 temperature: 'hot' | 'warm' | 'cold'
 priority: 'high' | 'medium' | 'low'
 notes?: string
 customTags?: string[]
}

// --- Mock Card OCR Samples ---
const sampleCards: ContactItem[] = [
 {
 id: 'c1',
 name: 'Sarah Tan',
 title: 'Chief Technology Officer',
 company: 'Nexus AI Solutions',
 phone: '+60 12-889 4321',
 email: 'sarah.tan@nexusai.io',
 website: 'https://nexusai.io',
 street: 'Level 18, Menara Telecom, Jalan Pantai Baharu',
 city: 'Kuala Lumpur',
 state: 'Wilayah Persekutuan',
 postcode: '59200',
 country: 'Malaysia',
 temperature: 'hot',
 priority: 'high',
 notes: 'Met at AI Tech Expo. Interested in enterprise CRM solution.',
 customTags: ['Tech Expo 2026', 'VIP Lead', 'Key Account']
 },
 {
 id: 'c2',
 name: 'Marcus Wong',
 title: 'VP of Global Procurement',
 company: 'AeroTech Dynamics',
 phone: '+65 9123 4567',
 email: 'm.wong@aerotech.sg',
 website: 'https://aerotech.sg',
 street: '8 Changi Business Park Ave 1',
 city: 'Singapore',
 state: 'Singapore',
 postcode: '486018',
 country: 'Singapore',
 temperature: 'warm',
 priority: 'medium',
 notes: 'Key decision maker for Asia procurement.',
 customTags: ['Procurement', 'Regional']
 },
 {
 id: 'c3',
 name: 'Amanda Lin',
 title: 'Managing Director',
 company: 'Vanguard Retail Asia',
 phone: '+60 16-443 8900',
 email: 'a.lin@vanguardasia.com',
 website: 'https://vanguardasia.com',
 street: 'Mid Valley City, Lingkaran Syed Putra',
 city: 'Kuala Lumpur',
 state: 'Wilayah Persekutuan',
 postcode: '59200',
 country: 'Malaysia',
 temperature: 'hot',
 priority: 'high',
 notes: 'Looking to expand retail CRM omnichannel.',
 customTags: ['Retail', 'Omnichannel']
 }
]

// Multi-contact batch queue state
const scannedContacts = ref<ContactItem[]>([
 { ...sampleCards[0] }
])

const activeContactIndex = ref(0)
const isScanningAnimation = ref(false)
const showFloatingMenu = ref(false)
const isQueueCollapsed = ref(false)

// Step 4 Tab State: 'all' or specific contact index
const activeLabelTab = ref<'all' | number>('all')

const currentContact = computed(() => scannedContacts.value[activeContactIndex.value] || scannedContacts.value[0])

// Floating (+) Expandable Menu Actions
const handleScanFromFloatingButton = () => {
 showFloatingMenu.value = false
 triggerScan()
}

const handleManualFromFloatingButton = () => {
 showFloatingMenu.value = false
 const newCard: ContactItem = {
 id: `c-${Date.now()}`,
 name: '',
 title: '',
 company: '',
 phone: '',
 email: '',
 website: '',
 street: '',
 city: '',
 state: '',
 postcode: '',
 country: 'Malaysia',
 temperature: 'warm',
 priority: 'medium',
 notes: 'Manual entry contact.',
 customTags: ['Manual Entry']
 }
 scannedContacts.value.push(newCard)
 activeContactIndex.value = scannedContacts.value.length - 1
 currentStep.value = 3
}

// Add Card in Review step opens camera scanner UI to scan next card
const handleAddCardInReview = () => {
 triggerScan()
}

const addMockCardToQueue = () => {
 const nextSample = sampleCards[(scannedContacts.value.length) % sampleCards.length]
 const newCard: ContactItem = {
 ...nextSample,
 id: `c-${Date.now()}`
 }
 scannedContacts.value.push(newCard)
 activeContactIndex.value = scannedContacts.value.length - 1
 syncDealTitle()
}

const removeContactFromQueue = (index: number) => {
 if (scannedContacts.value.length > 1) {
 scannedContacts.value.splice(index, 1)
 activeContactIndex.value = Math.min(activeContactIndex.value, scannedContacts.value.length - 1)
 }
}

// --- Universal & Individual Labeling Handlers for Step 4 ---
const setTemperature = (val: 'hot' | 'warm' | 'cold') => {
 if (activeLabelTab.value === 'all') {
 scannedContacts.value.forEach(c => c.temperature = val)
 } else {
 currentContact.value.temperature = val
 }
}

const setPriority = (val: 'high' | 'medium' | 'low') => {
 if (activeLabelTab.value === 'all') {
 scannedContacts.value.forEach(c => c.priority = val)
 } else {
 currentContact.value.priority = val
 }
}

const setNotes = (val: string) => {
 if (activeLabelTab.value === 'all') {
 scannedContacts.value.forEach(c => c.notes = val)
 } else {
 currentContact.value.notes = val
 }
}

// Custom Tags Management
const newTagInput = ref('')
const presetTagOptions = ['Tech Expo 2026', 'VIP Lead', 'Enterprise', 'Decision Maker', 'Urgent Follow-up']

const addTag = (tagText?: string) => {
 const tagToAdd = (tagText || newTagInput.value).trim()
 if (!tagToAdd) return

 if (activeLabelTab.value === 'all') {
 scannedContacts.value.forEach(c => {
 if (!c.customTags) c.customTags = []
 if (!c.customTags.includes(tagToAdd)) c.customTags.push(tagToAdd)
 })
 } else {
 if (!currentContact.value.customTags) currentContact.value.customTags = []
 if (!currentContact.value.customTags.includes(tagToAdd)) currentContact.value.customTags.push(tagToAdd)
 }
 newTagInput.value = ''
}

const removeTag = (tag: string) => {
 if (activeLabelTab.value === 'all') {
 scannedContacts.value.forEach(c => {
 if (c.customTags) c.customTags = c.customTags.filter(t => t !== tag)
 })
 } else {
 if (currentContact.value.customTags) {
 currentContact.value.customTags = currentContact.value.customTags.filter(t => t !== tag)
 }
 }
}

// --- Greeting & Messaging State ---
const selectedInbox = ref('Justin (Sales Director)')
const messageMode = ref<'template' | 'custom' | 'ai'>('ai')
const selectedTemplate = ref('Post-Event Follow-up')
const customMessageText = ref('')
const isGeneratingAI = ref(false)

const aiGeneratedMessage = ref(
 `Hi ${currentContact.value.name},\n\nIt was great connecting at the expo! I loved learning more about your work as ${currentContact.value.title} at ${currentContact.value.company}.\n\nLet's schedule a quick 10-min catch-up to explore how RakanSales can streamline your lead pipeline. Looking forward to speaking soon!`
)

// Deal Option
const createDeal = ref(true)
const dealTitle = ref('')
const dealValue = ref('45000')
const dealStage = ref('Qualified Lead')

// Sync default deal title when contact changes
const syncDealTitle = () => {
 dealTitle.value = `${currentContact.value.company || 'New Partner'} - Enterprise Expansion`
}
syncDealTitle()

// --- Helper Functions & Workflow Handlers ---
const loadSampleCard = (idx: number) => {
 scannedContacts.value = [{ ...sampleCards[idx] }]
 activeContactIndex.value = 0
 syncDealTitle()
 generateAIGreeting()
}

const triggerScan = () => {
 currentStep.value = 2
 isScanningAnimation.value = true
 setTimeout(() => {
 isScanningAnimation.value = false
 if (scannedContacts.value.length >= 1 && currentContact.value.name !== '') {
 const nextSample = sampleCards[(scannedContacts.value.length) % sampleCards.length]
 const newCard: ContactItem = {
 ...nextSample,
 id: `c-${Date.now()}`
 }
 scannedContacts.value.push(newCard)
 activeContactIndex.value = scannedContacts.value.length - 1
 }
 currentStep.value = 3
 syncDealTitle()
 }, 2200)
}

const generateAIGreeting = () => {
 isGeneratingAI.value = true
 setTimeout(() => {
 aiGeneratedMessage.value = `Hi ${currentContact.value.name},\n\nIt was a pleasure meeting you today! As ${currentContact.value.title} at ${currentContact.value.company}, I think you'll find our automated CRM integration very aligned with your growth plans.\n\nWould you be open to a short call next Tuesday?\n\nBest regards,\n${selectedInbox.value.split(' ')[0]}`
 isGeneratingAI.value = false
 }, 1000)
}

const resetSimulation = () => {
 currentStep.value = 1
 loadSampleCard(0)
 createDeal.value = true
 activeLabelTab.value = 'all'
}
</script>

<template>
 <div class="space-y-6">
 <!-- Top Header & Instructions Bar -->
 <div class="bg-card border border-border p-6 rounded-2xl shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
 <div>
 <div class="flex items-center gap-2">
 <Badge variant="outline" class="bg-primary/10 text-primary border-primary/20 px-2.5 py-0.5 font-semibold text-xs rounded-full">
 Mobile Prototype
 </Badge>
 <h1 class="text-2xl font-bold tracking-tight text-foreground">Scan Name Card Simulation</h1>
 </div>
 <p class="text-xs text-muted-foreground mt-1">
 Interactive mobile flow simulation: Contacts -> Camera Scan -> OCR Extraction -> Labels & Location -> Actions -> Personalised Greeting.
 </p>
 </div>

 <!-- Quick Action Simulation Switcher -->
 <div class="flex items-center gap-2">
 <Button variant="outline" size="sm" @click="resetSimulation" class="gap-2 rounded-xl">
 <RotateCcw class="w-4 h-4 text-muted-foreground" />
 Restart Flow
 </Button>
 <Button
 variant="primary"
 size="sm"
 @click="router.push('/contacts')"
 class="gap-2 rounded-xl"
 >
 View All Contacts
 </Button>
 </div>
 </div>

 <!-- Stepper Tracker -->
 <div class="bg-card border border-border p-4 rounded-2xl shadow-sm overflow-x-auto">
 <div class="flex items-center justify-between min-w-[700px] px-2">
 <div
 v-for="step in stepsList"
 :key="step.id"
 class="flex items-center gap-2 cursor-pointer transition-all"
 @click="currentStep = step.id"
 >
 <div
 :class="[
 'w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all',
 currentStep === step.id
 ? 'bg-primary text-primary-foreground ring-4 ring-primary/20 shadow-md'
 : currentStep > step.id
 ? 'bg-primary text-primary-foreground'
 : 'bg-muted text-muted-foreground'
 ]"
 >
 <Check v-if="currentStep > step.id" class="w-4 h-4" />
 <component :is="step.icon" v-else class="w-4 h-4" />
 </div>
 <span
 :class="[
 'text-xs font-medium whitespace-nowrap',
 currentStep === step.id
 ? 'text-primary font-bold'
 : currentStep > step.id
 ? 'text-muted-foreground'
 : 'text-muted-foreground'
 ]"
 >
 {{ step.title }}
 </span>
 <ChevronRight v-if="step.id < 7" class="w-4 h-4 text-muted-foreground mx-1" />
 </div>
 </div>
 </div>

 <!-- MAIN SIMULATOR LAYOUT (Left: Phone Screen, Right: Stage Inspector / Direct Controls) -->
 <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

 <!-- LEFT COLUMN: Realistic Mobile Device Viewport -->
 <div class="lg:col-span-5 flex justify-center sticky top-6">
 <div class="relative w-[375px] h-[720px] max-h-[720px] min-h-[720px] bg-rail rounded-[48px] p-3 shadow-2xl ring-1 ring-rail-border flex flex-col flex-shrink-0">
 <!-- Notch / Speaker Bar -->
 <div class="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-6 bg-rail rounded-b-2xl z-30 flex items-center justify-center gap-2">
 <div class="w-12 h-1.5 bg-muted rounded-full"></div>
 <div class="w-2.5 h-2.5 bg-card rounded-full border border-border"></div>
 </div>

 <!-- Inside Screen Container -->
 <div class="w-full h-full bg-background rounded-[38px] overflow-hidden flex flex-col relative z-20 text-foreground min-h-0">

 <!-- Mobile Status Bar -->
 <div class="h-10 px-6 pt-3 flex justify-between items-center text-[11px] font-semibold text-muted-foreground flex-shrink-0 z-20">
 <span>09:41</span>
 <div class="flex items-center gap-1.5">
 <span class="text-[10px]">5G</span>
 <div class="w-5 h-2.5 border border-border rounded-sm relative p-0.5">
 <div class="w-full h-full bg-primary rounded-2xs"></div>
 </div>
 </div>
 </div>

 <!-- MOBILE SCREEN CONTENT BY STEP -->
 <div class="flex-1 overflow-y-auto flex flex-col relative min-h-0">

 <!-- 📱 STEP 1: Contacts Main Page -->
 <div v-if="currentStep === 1" class="flex-1 flex flex-col justify-between relative overflow-hidden h-full">
 <!-- STICKY TOP TITLE BAR -->
 <div class="sticky top-0 bg-card/95 backdrop-blur-md border-b border-border p-4 z-20 shadow-2xs">
 <div class="flex justify-between items-center">
 <div>
 <h2 class="text-lg font-bold">Contacts</h2>
 <p class="text-[10px] text-muted-foreground">2,500 records saved</p>
 </div>
 <div class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
 JS
 </div>
 </div>
 </div>

 <!-- Scrollable Content Area -->
 <div class="p-4 space-y-3 flex-1 overflow-y-auto">
 <!-- Search -->
 <div class="bg-card border border-border rounded-xl px-3 py-2 text-xs flex items-center gap-2 shadow-xs">
 <User class="w-4 h-4 text-muted-foreground" />
 <span class="text-muted-foreground">Search contacts...</span>
 </div>

 <!-- Existing Contact Cards List (Mock) -->
 <div class="space-y-2 pt-1">
 <div class="bg-card p-3 rounded-xl border border-border flex items-center justify-between">
 <div class="flex items-center gap-3">
 <div class="w-9 h-9 rounded-full bg-info/10 text-info font-bold text-xs flex items-center justify-center">
 ST
 </div>
 <div>
 <p class="font-medium text-xs">Sarah Tan</p>
 <p class="text-[10px] text-muted-foreground">CTO • Nexus AI Solutions</p>
 </div>
 </div>
 <Badge variant="outline" class="text-[9px] bg-destructive/10 text-destructive border-destructive/20">Hot 🔥</Badge>
 </div>

 <div class="bg-card p-3 rounded-xl border border-border flex items-center justify-between">
 <div class="flex items-center gap-3">
 <div class="w-9 h-9 rounded-full bg-tag-1 text-tag-1-foreground font-bold text-xs flex items-center justify-center">
 MW
 </div>
 <div>
 <p class="font-medium text-xs">Marcus Wong</p>
 <p class="text-[10px] text-muted-foreground">VP Procurement • AeroTech</p>
 </div>
 </div>
 <Badge variant="outline" class="text-[9px] bg-warning/10 text-warning border-warning/20">Warm ☀️</Badge>
 </div>

 <div class="bg-card p-3 rounded-xl border border-border flex items-center justify-between">
 <div class="flex items-center gap-3">
 <div class="w-9 h-9 rounded-full bg-success/10 text-success font-bold text-xs flex items-center justify-center">
 AL
 </div>
 <div>
 <p class="font-medium text-xs">Amanda Lin</p>
 <p class="text-[10px] text-muted-foreground">Managing Director • Vanguard Asia</p>
 </div>
 </div>
 <Badge variant="outline" class="text-[9px] bg-destructive/10 text-destructive border-destructive/20">Hot 🔥</Badge>
 </div>
 </div>
 </div>

 <!-- Floating Expandable Action Menu Overlay -->
 <div v-if="showFloatingMenu" class="absolute bottom-16 right-4 left-4 bg-popover/95 border border-border text-popover-foreground rounded-2xl p-3 shadow-2xl z-40 backdrop-blur-md space-y-2 animate-in fade-in slide-in-from-bottom-3">
 <div class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2">Add New Contact</div>
 
 <button
 @click="handleScanFromFloatingButton"
 class="w-full flex items-center gap-3 p-2.5 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-xs font-semibold hover:opacity-95 cursor-pointer shadow-md"
 >
 <Scan class="w-4 h-4 animate-pulse" />
 <span>Scan Name Card (AI OCR)</span>
 </button>

 <button
 @click="handleManualFromFloatingButton"
 class="w-full flex items-center gap-3 p-2.5 rounded-xl bg-muted text-foreground text-xs font-semibold hover:bg-muted/80 cursor-pointer"
 >
 <UserPlus class="w-4 h-4 text-primary" />
 <span>Manual Entry</span>
 </button>
 </div>

 <!-- FLOATING (+) ACTION BUTTON (FAB) -->
 <div class="absolute bottom-16 right-4 z-30">
 <button
 @click="showFloatingMenu = !showFloatingMenu"
 class="w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer ring-4 ring-primary/20"
 >
 <Plus :class="['w-6 h-6 transition-transform duration-200', showFloatingMenu ? 'rotate-45' : '']" />
 </button>
 </div>

 <!-- FULL-WIDTH MOBILE BOTTOM NAVIGATION BAR -->
 <div class="sticky bottom-0 w-full bg-card border-t border-border flex items-center justify-around py-3 px-2 text-[10px] font-medium text-muted-foreground shrink-0 z-20 shadow-md">
 <div class="flex flex-col items-center gap-0.5 text-primary font-bold">
 <User class="w-4 h-4" />
 <span>Contacts</span>
 </div>
 <div class="flex flex-col items-center gap-0.5 hover:text-foreground cursor-pointer">
 <MessageSquare class="w-4 h-4" />
 <span>Chats</span>
 </div>
 <div class="flex flex-col items-center gap-0.5 hover:text-foreground cursor-pointer">
 <Briefcase class="w-4 h-4" />
 <span>Deals</span>
 </div>
 <div class="flex flex-col items-center gap-0.5 hover:text-foreground cursor-pointer">
 <Settings class="w-4 h-4" />
 <span>Settings</span>
 </div>
 </div>
 </div>

 <!-- 📷 STEP 2: Live Camera Viewfinder Screen -->
 <div v-else-if="currentStep === 2" class="flex-1 bg-card text-card-foreground flex flex-col justify-between p-4 relative overflow-hidden">
 <!-- Top Camera Bar -->
 <div class="flex justify-between items-center z-10">
 <button @click="currentStep = 1" class="p-2 rounded-full bg-card/10 text-primary-foreground">
 <ArrowLeft class="w-4 h-4" />
 </button>
 <span class="text-xs font-medium bg-card/20 backdrop-blur-md px-3 py-1 rounded-full">
 Scan Name Card
 </span>
 <div class="w-8"></div>
 </div>

 <!-- Viewfinder Scanner Area -->
 <div class="relative w-full aspect-[1.58/1] rounded-2xl border-2 border-dashed border-primary/80 my-auto flex flex-col items-center justify-center overflow-hidden bg-muted/40 backdrop-blur-xs">
 <!-- Name Card Camera Mock -->
 <div class="w-full h-full bg-card flex flex-col items-center justify-center text-center p-4">
 <Building class="w-8 h-8 text-primary mb-1 animate-pulse" />
 <p class="text-xs font-bold text-primary-foreground">{{ sampleCards[(scannedContacts.length) % sampleCards.length].name }}</p>
 <p class="text-[10px] text-primary">{{ sampleCards[(scannedContacts.length) % sampleCards.length].company }}</p>
 </div>

 <!-- Animated Laser Scanning Line -->
 <div
 v-if="isScanningAnimation"
 class="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-xs glow animate-bounce z-20"
 style="animation-duration: 1.2s;"
 ></div>

 <!-- Frame Corner Crosshairs -->
 <div class="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-primary"></div>
 <div class="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-primary"></div>
 <div class="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-primary"></div>
 <div class="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-primary"></div>

 <div class="absolute bottom-3 bg-card/60 backdrop-blur-md text-[10px] px-2.5 py-1 rounded-full text-primary font-medium z-10 flex items-center gap-1.5">
 <Sparkles class="w-3 h-3 animate-spin" />
 AI OCR Extracting Details...
 </div>
 </div>

 <!-- Bottom Shutter Button Bar -->
 <div class="flex justify-around items-center pt-2 z-10">
 <div class="w-10 h-10 rounded-full bg-card/10 flex items-center justify-center">
 <Zap class="w-4 h-4 text-warning" />
 </div>
 <button
 @click="currentStep = 3"
 class="w-16 h-16 rounded-full border-4 border-primary-foreground p-1 flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all"
 >
 <div class="w-full h-full bg-primary rounded-full flex items-center justify-center">
 <Camera class="w-6 h-6 text-primary-foreground" />
 </div>
 </button>
 <div class="w-10 h-10 rounded-full bg-card/10 flex items-center justify-center">
 <RotateCcw class="w-4 h-4 text-primary-foreground" />
 </div>
 </div>
 </div>

 <!-- 📋 STEP 3: Review Contacts (Sticky Header & Collapsible Sticky Queue Box) -->
 <div v-else-if="currentStep === 3" class="flex-1 flex flex-col justify-between relative overflow-hidden h-full">
 <!-- STICKY TOP TITLE BAR -->
 <div class="sticky top-0 bg-card/95 backdrop-blur-md border-b border-border px-4 py-3 z-20 shadow-2xs flex items-center justify-between">
 <div class="flex items-center gap-2">
 <button @click="currentStep = 1" class="p-1 rounded-lg text-muted-foreground hover:text-foreground">
 <ArrowLeft class="w-4 h-4" />
 </button>
 <div>
 <h2 class="text-sm font-bold">Review Contacts</h2>
 <p class="text-[9px] text-muted-foreground">Basic Info & Location extraction</p>
 </div>
 </div>
 <Badge variant="outline" class="bg-success/10 text-success border-success/20 text-[10px] font-bold">
 {{ scannedContacts.length }} Contact{{ scannedContacts.length > 1 ? 's' : '' }}
 </Badge>
 </div>

 <!-- COLLAPSIBLE STICKY QUEUE BOX CONTAINER -->
 <div class="sticky top-[53px] z-10 bg-card/95 backdrop-blur-md border-b border-border p-2.5 transition-all duration-300 shadow-2xs">
 <div class="flex items-center justify-between">
 <button @click="isQueueCollapsed = !isQueueCollapsed" class="flex items-center gap-1.5 text-left cursor-pointer">
 <Layers class="w-3.5 h-3.5 text-primary" />
 <span class="text-[10px] font-bold text-foreground uppercase tracking-wider">
 Scanned Cards Queue ({{ scannedContacts.length }})
 </span>
 <ChevronDown :class="['w-3.5 h-3.5 text-muted-foreground transition-transform duration-200', isQueueCollapsed ? '' : 'rotate-180']" />
 </button>

 <button
 @click="handleAddCardInReview"
 class="bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground px-2.5 py-0.5 rounded-full text-[9px] font-bold shadow-xs flex items-center gap-1 hover:opacity-95 active:scale-95 transition-all cursor-pointer"
 >
 <Camera class="w-3 h-3" />
 <Plus class="w-3 h-3 -ml-0.5" />
 <span>Add Card</span>
 </button>
 </div>

 <!-- Expanded Queue Badge Grid -->
 <div v-if="!isQueueCollapsed" class="flex flex-wrap gap-1.5 pt-2 animate-in fade-in duration-150">
 <div
 v-for="(contact, index) in scannedContacts"
 :key="contact.id"
 @click="activeContactIndex = index"
 :class="[
 'flex items-center gap-1.5 px-2 py-0.5 rounded-xl text-xs font-semibold cursor-pointer transition-all border',
 activeContactIndex === index
 ? 'bg-primary text-primary-foreground border-primary shadow-xs font-bold'
 : 'bg-muted text-muted-foreground border-border'
 ]"
 >
 <span class="w-3.5 h-3.5 rounded-full bg-card/20 text-[8px] flex items-center justify-center font-bold">
 {{ index + 1 }}
 </span>
 <span class="truncate max-w-[85px] text-[11px]">{{ contact.name || `Card ${index + 1}` }}</span>
 <button
 v-if="scannedContacts.length > 1"
 @click.stop="removeContactFromQueue(index)"
 class="hover:text-destructive p-0.5 rounded-full"
 >
 <X class="w-3 h-3" />
 </button>
 </div>
 </div>
 </div>

 <!-- Scrollable Form Area -->
 <div class="p-4 space-y-3 flex-1 overflow-y-auto">
 <!-- SECTION 1: BASIC INFORMATION -->
 <div class="bg-card p-3 rounded-xl border border-border space-y-2">
 <div class="flex items-center gap-1.5 border-b pb-1.5 text-xs font-bold text-foreground ">
 <User class="w-3.5 h-3.5 text-primary" />
 <span>Basic Information</span>
 </div>

 <div class="space-y-2 pt-1">
 <div>
 <label class="text-[10px] font-semibold text-muted-foreground">Full Name</label>
 <Input v-model="currentContact.name" class="h-8 text-xs bg-muted/40" />
 </div>
 <div>
 <label class="text-[10px] font-semibold text-muted-foreground">Job Title</label>
 <Input v-model="currentContact.title" class="h-8 text-xs bg-muted/40" />
 </div>
 <div>
 <label class="text-[10px] font-semibold text-muted-foreground">Company</label>
 <Input v-model="currentContact.company" class="h-8 text-xs bg-muted/40" />
 </div>
 <div class="grid grid-cols-2 gap-2">
 <div>
 <label class="text-[10px] font-semibold text-muted-foreground">Phone</label>
 <Input v-model="currentContact.phone" class="h-8 text-xs bg-muted/40" />
 </div>
 <div>
 <label class="text-[10px] font-semibold text-muted-foreground">Email</label>
 <Input v-model="currentContact.email" class="h-8 text-xs bg-muted/40" />
 </div>
 </div>
 </div>
 </div>

 <!-- SECTION 2: LOCATION INFORMATION -->
 <div class="bg-card p-3 rounded-xl border border-border space-y-2">
 <div class="flex items-center gap-1.5 border-b pb-1.5 text-xs font-bold text-foreground ">
 <MapPin class="w-3.5 h-3.5 text-success" />
 <span>Location</span>
 </div>

 <div class="space-y-2 pt-1">
 <div>
 <label class="text-[10px] font-semibold text-muted-foreground">Street Address</label>
 <Input v-model="currentContact.street" placeholder="e.g. Level 18, Menara Telecom" class="h-8 text-xs bg-muted/40" />
 </div>
 <div class="grid grid-cols-2 gap-2">
 <div>
 <label class="text-[10px] font-semibold text-muted-foreground">City</label>
 <Input v-model="currentContact.city" placeholder="Kuala Lumpur" class="h-8 text-xs bg-muted/40" />
 </div>
 <div>
 <label class="text-[10px] font-semibold text-muted-foreground">State / Province</label>
 <Input v-model="currentContact.state" placeholder="Selangor" class="h-8 text-xs bg-muted/40" />
 </div>
 </div>
 <div class="grid grid-cols-2 gap-2">
 <div>
 <label class="text-[10px] font-semibold text-muted-foreground">Post Code</label>
 <Input v-model="currentContact.postcode" placeholder="59200" class="h-8 text-xs bg-muted/40" />
 </div>
 <div>
 <label class="text-[10px] font-semibold text-muted-foreground">Country</label>
 <Input v-model="currentContact.country" placeholder="Malaysia" class="h-8 text-xs bg-muted/40" />
 </div>
 </div>
 </div>
 </div>
 </div>

 <!-- STICKY BOTTOM ACTION BUTTON BAR -->
 <div class="sticky bottom-0 w-full p-3 bg-card/95 backdrop-blur-md border-t border-border z-30 shrink-0 shadow-lg">
 <button
 @click="currentStep = 4"
 class="w-full bg-primary text-primary-foreground py-2.5 rounded-xl font-semibold text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-95 transition-all"
 >
 <span>Confirm & Add Labels ({{ scannedContacts.length }})</span>
 <ArrowRight class="w-4 h-4" />
 </button>
 </div>
 </div>

 <!-- 🏷️ STEP 4: Add Contact Labels (With Universal "ALL" Tab & Styled Custom Tags) -->
 <div v-else-if="currentStep === 4" class="flex-1 flex flex-col justify-between relative overflow-hidden h-full">
 <!-- STICKY TOP TITLE BAR -->
 <div class="sticky top-0 bg-card/95 backdrop-blur-md border-b border-border px-4 py-3 z-20 shadow-2xs flex items-center justify-between">
 <div class="flex items-center gap-2">
 <button @click="currentStep = 3" class="p-1 rounded-lg text-muted-foreground">
 <ArrowLeft class="w-4 h-4" />
 </button>
 <div>
 <h2 class="text-sm font-bold">Add Contact Labels</h2>
 <p class="text-[9px] text-muted-foreground">Categorize leads individually or universally</p>
 </div>
 </div>
 </div>

 <!-- Scrollable Area -->
 <div class="p-4 space-y-3 flex-1 overflow-y-auto">
 <!-- PER-CONTACT SWITCHER BAR INCLUDING UNIVERSAL "ALL" TAB -->
 <div class="flex flex-wrap gap-1.5 shrink-0 bg-card p-2 rounded-xl border border-border shadow-xs">
 <!-- Universal ALL Tab -->
 <button
 @click="activeLabelTab = 'all'"
 :class="[
 'px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all border flex items-center gap-1',
 activeLabelTab === 'all'
 ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-primary shadow-xs'
 : 'bg-muted text-muted-foreground border-border'
 ]"
 >
 <Users class="w-3 h-3" />
 <span>ALL (Universal)</span>
 </button>

 <!-- Individual Contact Tabs -->
 <button
 v-for="(contact, index) in scannedContacts"
 :key="contact.id"
 @click="activeLabelTab = index; activeContactIndex = index"
 :class="[
 'px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all border',
 activeLabelTab === index
 ? 'bg-primary text-primary-foreground border-primary shadow-xs font-bold'
 : 'bg-muted text-muted-foreground border-border'
 ]"
 >
 <span>{{ contact.name || `Contact ${index + 1}` }}</span>
 </button>
 </div>

 <!-- Universal Mode Active Banner -->
 <div v-if="activeLabelTab === 'all'" class="bg-primary/10 border border-primary/20 p-2.5 rounded-xl text-[10px] font-semibold text-primary flex items-center gap-2">
 <Sparkles class="w-4 h-4 shrink-0" />
 <span>Universal Mode: Selecting labels here applies to all {{ scannedContacts.length }} contacts. Click individual tabs to customize per contact.</span>
 </div>

 <!-- Labeling Controls -->
 <div class="space-y-3 pt-1">
 <!-- Temperature -->
 <div class="bg-card p-3 rounded-xl border border-border space-y-2">
 <div class="flex justify-between items-center">
 <label class="text-[11px] font-bold text-muted-foreground ">Lead Temperature</label>
 <span class="text-[9px] font-semibold text-muted-foreground">
 {{ activeLabelTab === 'all' ? 'All Contacts' : currentContact.name }}
 </span>
 </div>
 <div class="grid grid-cols-3 gap-2">
 <button
 @click="setTemperature('hot')"
 :class="[
 'p-2 rounded-lg text-xs font-semibold flex flex-col items-center gap-1 border transition-all cursor-pointer',
 (activeLabelTab === 'all' ? scannedContacts.every(c => c.temperature === 'hot') : currentContact.temperature === 'hot')
 ? 'bg-destructive/10 border-destructive text-destructive ring-2 ring-destructive/20'
 : 'bg-muted border-border text-muted-foreground '
 ]"
 >
 <Flame class="w-4 h-4 text-destructive" />
 <span>Hot 🔥</span>
 </button>

 <button
 @click="setTemperature('warm')"
 :class="[
 'p-2 rounded-lg text-xs font-semibold flex flex-col items-center gap-1 border transition-all cursor-pointer',
 (activeLabelTab === 'all' ? scannedContacts.every(c => c.temperature === 'warm') : currentContact.temperature === 'warm')
 ? 'bg-warning/10 border-warning text-warning ring-2 ring-warning/20'
 : 'bg-muted border-border text-muted-foreground '
 ]"
 >
 <Sun class="w-4 h-4 text-warning" />
 <span>Warm ☀️</span>
 </button>

 <button
 @click="setTemperature('cold')"
 :class="[
 'p-2 rounded-lg text-xs font-semibold flex flex-col items-center gap-1 border transition-all cursor-pointer',
 (activeLabelTab === 'all' ? scannedContacts.every(c => c.temperature === 'cold') : currentContact.temperature === 'cold')
 ? 'bg-info/10 border-info text-info ring-2 ring-info/20'
 : 'bg-muted border-border text-muted-foreground '
 ]"
 >
 <Snowflake class="w-4 h-4 text-info" />
 <span>Cold ❄️</span>
 </button>
 </div>
 </div>

 <!-- Priority -->
 <div class="bg-card p-3 rounded-xl border border-border space-y-2">
 <label class="text-[11px] font-bold text-muted-foreground ">Priority Level</label>
 <div class="grid grid-cols-3 gap-2">
 <button
 @click="setPriority('high')"
 :class="[
 'py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer',
 (activeLabelTab === 'all' ? scannedContacts.every(c => c.priority === 'high') : currentContact.priority === 'high') ? 'bg-destructive text-destructive-foreground border-destructive font-bold' : 'bg-muted text-muted-foreground'
 ]"
 >
 High
 </button>
 <button
 @click="setPriority('medium')"
 :class="[
 'py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer',
 (activeLabelTab === 'all' ? scannedContacts.every(c => c.priority === 'medium') : currentContact.priority === 'medium') ? 'bg-warning text-warning-foreground border-warning font-bold' : 'bg-muted text-muted-foreground'
 ]"
 >
 Medium
 </button>
 <button
 @click="setPriority('low')"
 :class="[
 'py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer',
 (activeLabelTab === 'all' ? scannedContacts.every(c => c.priority === 'low') : currentContact.priority === 'low') ? 'bg-primary text-primary-foreground border-primary font-bold' : 'bg-muted text-muted-foreground'
 ]"
 >
 Low
 </button>
 </div>
 </div>

 <!-- Notes -->
 <div class="bg-card p-3 rounded-xl border border-border space-y-2">
 <div class="flex items-center justify-between">
 <label class="text-[11px] font-bold text-muted-foreground ">Contact Notes</label>
 <span class="text-[9px] text-muted-foreground">
 {{ activeLabelTab === 'all' ? 'Universal Notes' : currentContact.name }}
 </span>
 </div>
 <Textarea
 :value="activeLabelTab === 'all' ? scannedContacts[0]?.notes : currentContact.notes"
 @input="(e: any) => setNotes(e.target.value)"
 placeholder="Add conversation details or specific requirements..."
 class="text-xs h-20 bg-muted/40"
 />
 </div>

 <!-- RICHLY STYLED CUSTOM TAGS SECTION -->
 <div class="bg-card border border-primary/20 p-4 rounded-2xl border border-border shadow-xs space-y-3">
 <div class="flex items-center justify-between">
 <label class="text-[11px] font-bold text-foreground flex items-center gap-1.5">
 <Tag class="w-3.5 h-3.5 text-primary" />
 <span>Custom Sales Tags</span>
 </label>
 <span class="text-[9px] text-muted-foreground">
 {{ activeLabelTab === 'all' ? 'Applies to All' : currentContact.name }}
 </span>
 </div>

 <!-- Active Tags Pill List -->
 <div class="flex flex-wrap gap-1.5 min-h-7 items-center">
 <span
 v-for="tag in (currentContact.customTags || ['Tech Expo 2026', 'VIP Lead'])"
 :key="tag"
 class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20 hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive transition-all cursor-pointer group shadow-2xs"
 >
 <Hash class="w-3 h-3 text-primary/60 group-hover:text-destructive" />
 <span>{{ tag }}</span>
 <button @click="removeTag(tag)" class="p-0.5 rounded-full hover:bg-destructive/20">
 <X class="w-3 h-3" />
 </button>
 </span>
 </div>

 <!-- Preset Quick Tag Recommendation Chips -->
 <div class="space-y-1 pt-1 border-t border-border ">
 <span class="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Quick Suggestions</span>
 <div class="flex flex-wrap gap-1">
 <button
 v-for="preset in presetTagOptions"
 :key="preset"
 @click="addTag(preset)"
 class="px-2 py-0.5 rounded-lg text-[9px] font-medium bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all border border-border cursor-pointer"
 >
 + {{ preset }}
 </button>
 </div>
 </div>

 <!-- Tag Input Box -->
 <div class="flex gap-1.5 pt-1">
 <Input
 v-model="newTagInput"
 placeholder="Type custom tag name..."
 class="h-8 text-xs bg-card border-border rounded-xl"
 @keyup.enter="addTag()"
 />
 <Button size="sm" class="h-8 px-3 rounded-xl gap-1 text-xs" @click="addTag()">
 <Plus class="w-3.5 h-3.5" />
 Add
 </Button>
 </div>
 </div>
 </div>
 </div>

 <!-- STICKY BOTTOM ACTION BUTTON BAR -->
 <div class="sticky bottom-0 w-full p-3 bg-card/95 backdrop-blur-md border-t border-border z-30 shrink-0 shadow-lg">
 <button
 @click="currentStep = 5"
 class="w-full bg-primary text-primary-foreground py-2.5 rounded-xl font-semibold text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-95 transition-all"
 >
 <span>Proceed to Action</span>
 <ArrowRight class="w-4 h-4" />
 </button>
 </div>
 </div>

 <!-- ⚙️ STEP 5: Post-Scan Action Choice -->
 <div v-else-if="currentStep === 5" class="flex-1 flex flex-col p-4 space-y-4 justify-center">
 <div class="text-center space-y-1">
 <div class="w-12 h-12 rounded-full bg-success/15 text-success flex items-center justify-center mx-auto mb-2">
 <CheckCircle2 class="w-6 h-6" />
 </div>
 <h2 class="text-lg font-bold">Contacts Saved!</h2>
 <p class="text-xs text-muted-foreground">What would you like to do next?</p>
 </div>

 <div class="space-y-3">
 <!-- Choice A: Send Greeting -->
 <button
 @click="currentStep = 6"
 class="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 rounded-2xl shadow-md text-left flex items-center justify-between group cursor-pointer hover:opacity-95 transition-all"
 >
 <div class="space-y-0.5">
 <div class="flex items-center gap-1.5 font-bold text-xs">
 <Send class="w-4 h-4" />
 <span>Send Greeting Message</span>
 </div>
 <p class="text-[10px] text-primary-foreground/80">Configure WhatsApp/Email intro message now</p>
 </div>
 <ChevronRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
 </button>

 <!-- Choice B: Save & Exit -->
 <button
 @click="currentStep = 7"
 class="w-full bg-card border border-border p-4 rounded-2xl text-left flex items-center justify-between group cursor-pointer hover:bg-muted transition-all"
 >
 <div class="space-y-0.5">
 <div class="flex items-center gap-1.5 font-bold text-xs text-foreground ">
 <LogOut class="w-4 h-4 text-muted-foreground" />
 <span>Save & Exit</span>
 </div>
 <p class="text-[10px] text-muted-foreground">Return to contact database directly</p>
 </div>
 <ChevronRight class="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
 </button>
 </div>
 </div>

 <!-- 💬 STEP 6: Send Greeting Configuration (With Sticky Header & Sticky Bottom Action Button) -->
 <div v-else-if="currentStep === 6" class="flex-1 flex flex-col justify-between relative overflow-hidden h-full">
 <!-- STICKY TOP TITLE BAR -->
 <div class="sticky top-0 bg-card/95 backdrop-blur-md border-b border-border px-4 py-3 z-20 shadow-2xs flex items-center gap-2">
 <button @click="currentStep = 5" class="p-1 rounded-lg text-muted-foreground">
 <ArrowLeft class="w-4 h-4" />
 </button>
 <h2 class="text-sm font-bold">Configure Greeting</h2>
 </div>

 <!-- Scrollable Area -->
 <div class="p-4 space-y-3 flex-1 overflow-y-auto">
 <!-- Sender Inbox Selector -->
 <div class="space-y-1">
 <label class="text-[10px] font-bold text-muted-foreground">Send As (Inbox Account)</label>
 <Select v-model="selectedInbox">
 <SelectTrigger class="h-8 text-xs bg-card">
 <SelectValue />
 </SelectTrigger>
 <SelectContent>
 <SelectItem value="Justin (Sales Director)">Justin (Sales Director)</SelectItem>
 <SelectItem value="Rakan Auto-Bot">Rakan Auto-Bot (WhatsApp)</SelectItem>
 <SelectItem value="Support Team">Support Team</SelectItem>
 </SelectContent>
 </Select>
 </div>

 <!-- Message Composition Mode Tabs -->
 <div class="space-y-2">
 <label class="text-[10px] font-bold text-muted-foreground">Message Content</label>
 <div class="grid grid-cols-3 gap-1 bg-muted p-1 rounded-lg text-[10px] font-semibold text-center">
 <button
 @click="messageMode = 'ai'"
 :class="['py-1 rounded-md transition-all', messageMode === 'ai' ? 'bg-card text-primary shadow-xs' : 'text-muted-foreground']"
 >
 ✨ AI Personal
 </button>
 <button
 @click="messageMode = 'template'"
 :class="['py-1 rounded-md transition-all', messageMode === 'template' ? 'bg-card text-primary shadow-xs' : 'text-muted-foreground']"
 >
 Templates
 </button>
 <button
 @click="messageMode = 'custom'"
 :class="['py-1 rounded-md transition-all', messageMode === 'custom' ? 'bg-card text-primary shadow-xs' : 'text-muted-foreground']"
 >
 Custom Text
 </button>
 </div>

 <!-- AI Mode Output -->
 <div v-if="messageMode === 'ai'" class="space-y-2">
 <div class="flex items-center justify-between text-[10px]">
 <span class="text-primary font-bold flex items-center gap-1">
 <Sparkles class="w-3 h-3" /> Personalized for {{ currentContact.company }}
 </span>
 <button @click="generateAIGreeting" class="text-muted-foreground hover:text-primary flex items-center gap-1">
 <RotateCcw class="w-3 h-3" /> Regenerate
 </button>
 </div>
 <Textarea v-model="aiGeneratedMessage" class="text-xs h-24 bg-card leading-relaxed" />
 </div>

 <!-- Template Mode Output -->
 <div v-else-if="messageMode === 'template'" class="space-y-2">
 <Select v-model="selectedTemplate">
 <SelectTrigger class="h-8 text-xs bg-card">
 <SelectValue />
 </SelectTrigger>
 <SelectContent>
 <SelectItem value="Post-Event Follow-up">Post-Event Follow-up</SelectItem>
 <SelectItem value="Quick Intro">Quick Executive Intro</SelectItem>
 <SelectItem value="Product Pitch">Product Demo Offer</SelectItem>
 </SelectContent>
 </Select>
 <div class="p-2.5 bg-muted rounded-lg text-xs text-muted-foreground border border-border">
 Hi {{ currentContact.name }}, thank you for sharing your contact card at the event. We look forward to partnering with {{ currentContact.company }}.
 </div>
 </div>

 <!-- Custom Mode Output -->
 <div v-else class="space-y-1">
 <Textarea v-model="customMessageText" placeholder="Write your greeting message here..." class="text-xs h-24 bg-card" />
 </div>
 </div>

 <!-- Create Deal Checkbox -->
 <div class="bg-primary/5 border border-primary/20 p-3 rounded-xl space-y-2">
 <div class="flex items-center gap-2">
 <Checkbox id="dealCheck" v-model="createDeal" />
 <label for="dealCheck" class="text-xs font-bold text-foreground cursor-pointer">
 Create Pipeline Deal Automatically
 </label>
 </div>

 <div v-if="createDeal" class="space-y-2 pl-5 pt-1">
 <Input v-model="dealTitle" placeholder="Deal Title" class="h-7 text-xs bg-card" />
 <div class="grid grid-cols-2 gap-2">
 <div>
 <label class="text-[9px] font-semibold text-muted-foreground">Value (MYR)</label>
 <Input v-model="dealValue" class="h-7 text-xs bg-card" />
 </div>
 <div>
 <label class="text-[9px] font-semibold text-muted-foreground">Stage</label>
 <Input v-model="dealStage" class="h-7 text-xs bg-card" />
 </div>
 </div>
 </div>
 </div>
 </div>

 <!-- STICKY BOTTOM ACTION BUTTON BAR -->
 <div class="sticky bottom-0 w-full p-3 bg-card/95 backdrop-blur-md border-t border-border z-30 shrink-0 shadow-lg">
 <button
 @click="currentStep = 7"
 class="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-3 rounded-xl font-semibold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer hover:opacity-95 transition-all"
 >
 <Send class="w-4 h-4" />
 <span>Send Message & Complete</span>
 </button>
 </div>
 </div>

 <!-- 🎉 STEP 7: Completed Summary State -->
 <div v-else-if="currentStep === 7" class="flex-1 flex flex-col p-4 space-y-4 justify-center items-center text-center">
 <div class="w-16 h-16 rounded-full bg-success/15 text-success flex items-center justify-center shadow-lg animate-bounce">
 <CheckCircle2 class="w-10 h-10" />
 </div>

 <div>
 <h2 class="text-xl font-bold">Workflow Completed!</h2>
 <p class="text-xs text-muted-foreground mt-1">Contact record created and greeting dispatched.</p>
 </div>

 <!-- Summary Card -->
 <div class="w-full bg-card border border-border p-4 rounded-2xl text-left space-y-2 text-xs">
 <div class="flex justify-between items-center border-b pb-2">
 <span class="font-bold text-foreground ">
 {{ scannedContacts.length }} Contact{{ scannedContacts.length > 1 ? 's' : '' }} Processed
 </span>
 <Badge variant="outline" class="bg-destructive/10 text-destructive border-destructive/20 text-[9px]">Processed</Badge>
 </div>
 
 <div class="space-y-1.5 max-h-32 overflow-y-auto">
 <div v-for="c in scannedContacts" :key="c.id" class="p-2 bg-muted/40 rounded-lg space-y-0.5 text-[11px]">
 <div class="flex justify-between font-bold">
 <span>{{ c.name }}</span>
 <span class="text-destructive capitalize">{{ c.temperature }} 🔥</span>
 </div>
 <p class="text-[10px] text-muted-foreground">{{ c.title }} • {{ c.company }}</p>
 <p v-if="c.city" class="text-[9px] text-muted-foreground">{{ c.city }}, {{ c.country }}</p>
 </div>
 </div>

 <div v-if="createDeal" class="pt-2 text-[10px] text-success font-semibold flex items-center gap-1 border-t">
 <Sparkles class="w-3.5 h-3.5" /> Deal created: {{ dealTitle }} (RM {{ Number(dealValue).toLocaleString() }})
 </div>
 </div>

 <div class="w-full space-y-2">
 <button
 @click="resetSimulation"
 class="w-full bg-primary text-primary-foreground py-2.5 rounded-xl font-semibold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer"
 >
 <RotateCcw class="w-4 h-4" />
 <span>Scan Another Card</span>
 </button>
 <button
 @click="router.push('/contacts')"
 class="w-full bg-muted text-muted-foreground py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer"
 >
 <span>Go to Contacts Database</span>
 </button>
 </div>
 </div>

 </div>

 <!-- Mobile Bottom Indicator Bar -->
 <div class="h-5 flex items-center justify-center flex-shrink-0 bg-card border-t border-border ">
 <div class="w-28 h-1 bg-muted-foreground rounded-full"></div>
 </div>
 </div>
 </div>
 </div>

 <!-- RIGHT COLUMN: Workflow Stage Inspector & Control Guidance Panel -->
 <div class="lg:col-span-7 space-y-6">
 <!-- Stage Information Card -->
 <div class="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4">
 <div class="flex items-center justify-between border-b pb-4">
 <div>
 <span class="text-xs font-bold text-primary uppercase tracking-wider">Current Stage Details</span>
 <h2 class="text-lg font-bold text-foreground">
 Step {{ currentStep }}: {{ stepsList[currentStep - 1].title }}
 </h2>
 </div>
 <div class="p-2.5 rounded-xl bg-primary/10 text-primary">
 <component :is="stepsList[currentStep - 1].icon" class="w-6 h-6" />
 </div>
 </div>

 <!-- Detailed Descriptions for each step -->
 <div class="text-xs text-muted-foreground leading-relaxed">
 <p v-if="currentStep === 1">
 Starting from the mobile <strong>Contacts List</strong>. The floating <strong>(+)</strong> action button expands to select between <strong>Scan Name Card</strong> or <strong>Manual Entry</strong>.
 </p>
 <p v-else-if="currentStep === 2">
 The camera viewfinder activates with <strong>OCR edge detection</strong>. Computer vision extracts structured fields (Name, Phone, Email, Company, Job Title, Location).
 </p>
 <p v-else-if="currentStep === 3">
 Review extracted OCR data categorized under <strong>Basic Information</strong> and <strong>Location</strong> sections. Clicking <strong>Add Card</strong> opens the camera UI again to scan a second card.
 </p>
 <p v-else-if="currentStep === 4">
 Assign individual contact tags including <strong>Lead Temperature</strong> (Hot/Warm/Cold), <strong>Priority Level</strong>, <strong>Notes</strong>, and custom event tags per contact.
 </p>
 <p v-else-if="currentStep === 5">
 Choose immediate next action: jump directly into sending an omnichannel greeting or save and exit to continue scanning cards.
 </p>
 <p v-else-if="currentStep === 6">
 Configure the outgoing greeting. Select sender inbox, choose between standard templates, custom text, or <strong>AI-personalized intro message</strong>, and automatically spawn a pipeline deal.
 </p>
 <p v-else-if="currentStep === 7">
 Workflow complete! All data is synced back into RakanSales contacts & deal pipeline seamlessly.
 </p>
 </div>

 <!-- Step Inspector Matrix Summary -->
 <div class="grid grid-cols-2 gap-3 pt-2">
 <div class="p-3 bg-muted/50 rounded-xl border border-border ">
 <span class="text-[10px] text-muted-foreground uppercase font-bold">Active Contact ({{ scannedContacts.length }} Total)</span>
 <p class="font-semibold text-xs mt-0.5 text-foreground">{{ currentContact.name || 'New Contact' }}</p>
 <p class="text-[10px] text-muted-foreground">{{ currentContact.company }}</p>
 </div>

 <div class="p-3 bg-muted/50 rounded-xl border border-border ">
 <span class="text-[10px] text-muted-foreground uppercase font-bold">Temp & Location</span>
 <div class="flex items-center gap-1.5 mt-0.5">
 <Badge variant="outline" class="text-[9px] capitalize">{{ currentContact.temperature }} 🔥</Badge>
 <span class="text-[10px] text-muted-foreground truncate">{{ currentContact.city || 'Kuala Lumpur' }}</span>
 </div>
 </div>
 </div>
 </div>

 <!-- Preset Switcher Card for Quick Demonstration -->
 <div class="bg-card text-card-foreground border border-border p-6 rounded-2xl shadow-md space-y-4">
 <div class="flex items-center justify-between">
 <div class="flex items-center gap-2">
 <Sparkles class="w-5 h-5 text-warning" />
 <h3 class="font-bold text-sm">Interactive Demo Controls</h3>
 </div>
 <Button size="xs" variant="outline" @click="addMockCardToQueue" class="text-xs gap-1 border-border text-primary-foreground hover:bg-card/10">
 <Plus class="w-3.5 h-3.5" /> Add Mock Contact
 </Button>
 </div>
 <p class="text-xs text-muted-foreground">
 Switch between mock business cards or test adding 5+ contacts to see the sticky collapsible queue box and universal ALL tab in action!
 </p>

 <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
 <button
 v-for="(card, i) in sampleCards"
 :key="i"
 @click="loadSampleCard(i)"
 :class="[
 'p-3 rounded-xl border text-left transition-all cursor-pointer',
 activeContactIndex === i
 ? 'bg-primary/20 border-primary text-primary-foreground font-semibold ring-2 ring-primary/40'
 : 'bg-card/5 border-border text-muted-foreground hover:bg-card/10'
 ]"
 >
 <div class="flex items-center justify-between">
 <span class="text-xs font-bold">{{ card.name }}</span>
 <Badge v-if="activeContactIndex === i" class="text-[8px] bg-primary text-primary-foreground">Active</Badge>
 </div>
 <p class="text-[10px] text-muted-foreground mt-1">{{ card.title }}</p>
 <p class="text-[10px] text-primary font-medium">{{ card.company }}</p>
 </button>
 </div>
 </div>
 </div>

 </div>
 </div>
</template>
