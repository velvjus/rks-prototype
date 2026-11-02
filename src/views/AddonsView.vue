<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
 Dialog, 
 DialogClose, 
 DialogContent, 
 DialogDescription, 
 DialogFooter, 
 DialogHeader, 
 DialogTitle, 
 DialogTrigger 
} from '@/components/ui/dialog'
import {
 Select,
 SelectContent,
 SelectGroup,
 SelectItem,
 SelectLabel,
 SelectTrigger,
 SelectValue,
} from '@/components/ui/select'
import { toast } from 'vue-sonner'
import { Toaster } from '@/components/ui/sonner'
import {
 Sparkles,
 Mail,
 PhoneCall,
 Search,
 Send,
 Brain,
 Info,
 ShieldCheck,
 Check,
 Lock,
 ChevronRight,
 SlidersHorizontal,
 ArrowRight,
 MessageSquare,
 HelpCircle,
 PlayCircle,
 CalendarDays,
 Flame,
 Linkedin
} from 'lucide-vue-next'

// Active Filter States
const activeCategory = ref('All')
const sortBy = ref('popular')
const searchQuery = ref('')

// Interactive Dialog states
const isHowItWorksOpen = ref(false)
const selectedAddon = ref<Addon | null>(null)
const isDetailsOpen = ref(false)
const isChatOpen = ref(false)

// Usage Overview pop-up logs states
const isUsageLogsOpen = ref(false)
const selectedUsageCategory = ref<string | null>(null)

// Detailed Modal Multiplier State
const multiplier = ref(1)

// Multi-stage Checkout & Deactivation states
const checkoutStep = ref<'configure' | 'checkout' | 'processing' | 'success' | 'deactivate_confirm'>('configure')
const loaderText = ref('Connecting to secure payment gateway...')
const paymentMethod = ref('visa-4242')
const deactivationChecked = ref(false)
const termsChecked = ref(false)

// Collapsible Consumption History state
const showHistory = ref(false)

// Active states of add-ons
const activatedAddons = ref<Record<string, boolean>>({
 'ai-tokens': true,
 'email-sending': true,
})

interface Addon {
 id: string
 name: string
 description: string
 category: string
 price: string
 priceValue: number // for sorting & volume arithmetic
 priceUnit: string
 badgeText?: string
 badgeClass?: string
 icon: any
 isIconify?: boolean
 iconBg: string
 iconBgDark: string
 iconColor: string
 popular: boolean
 details: string[]
}

// Addon Catalog Dataset
const addonsList: Addon[] = [
 {
 id: 'ai-tokens',
 name: 'AI Tokens',
 description: 'Get more AI tokens to power AI features like content generation, insights, and more.',
 category: 'AI & Automation',
 price: '$10.00',
 priceValue: 10,
 priceUnit: '/ 10,000 tokens',
 badgeText: '🔥 Popular',
 badgeClass: 'bg-destructive/10 text-destructive border border-destructive/20',
 icon: Sparkles,
 iconBg: 'bg-primary/10',
 iconBgDark: '',
 iconColor: 'text-primary',
 popular: true,
 details: [
 'No expiration date on purchased tokens.',
 'Usable across all RakanSales AI modules (Smart reply, follow-ups, and transcriptions).',
 'Shared seamlessly among all workspace team members.',
 'Access to high-speed dedicated AI compute clusters.'
 ]
 },
 {
 id: 'email-sending',
 name: 'Email Sending',
 description: 'Increase your email sending limit and reach more prospects with ease.',
 category: 'Communication',
 price: '$15.00',
 priceValue: 15,
 priceUnit: '/ 10,000 emails',
 badgeText: '🔥 Popular',
 badgeClass: 'bg-destructive/10 text-destructive border border-destructive/20',
 icon: Mail,
 iconBg: 'bg-primary/10',
 iconBgDark: '',
 iconColor: 'text-primary',
 popular: true,
 details: [
 'Dedicated IP address warm-up support.',
 'Deliverability diagnostics tool included.',
 'Advanced real-time tracking (open rate, bounce rate, click maps).',
 'Full compatibility with HTML templates and bulk sequences.'
 ]
 },
 {
 id: 'ai-voice-agent',
 name: 'AI Voice Agent',
 description: 'Add more voice minutes for your AI Voice Agents to call, engage and convert leads.',
 category: 'Voice & Calling',
 price: '$20.00',
 priceValue: 20,
 priceUnit: '/ 1,000 minutes',
 badgeText: 'New',
 badgeClass: 'bg-info/10 text-info border border-info/20',
 icon: PhoneCall,
 iconBg: 'bg-primary/10',
 iconBgDark: '',
 iconColor: 'text-primary',
 popular: false,
 details: [
 'Real-time streaming conversation latency < 400ms.',
 'Fully customizable speech patterns, accents, and local dialects.',
 'Automatically schedules and notes CRM action items from phone calls.',
 'Pre-configured legal compliance check (auto-DNC list scrubbing).'
 ]
 },
 {
 id: 'linkedin-enrichment',
 name: 'LinkedIn Enrichment',
 description: 'Enrich more LinkedIn profiles with verified data to build better lists and connect smarter.',
 category: 'Lead Intelligence',
 price: '$12.00',
 priceValue: 12,
 priceUnit: '/ 1,000 credits',
 badgeText: '🔥 Popular',
 badgeClass: 'bg-destructive/10 text-destructive border border-destructive/20',
 icon: 'simple-icons:linkedin',
 isIconify: true,
 iconBg: 'bg-primary/10',
 iconBgDark: '',
 iconColor: 'text-primary',
 popular: true,
 details: [
 'Identifies and structures current role, tenure, and recent company funding milestones.',
 'Includes active phone number lookup and professional mail address verification.',
 'Automatically logs and notifies about contact changes or departures.',
 'Direct API support for custom prospecting pipelines.'
 ]
 },
 {
 id: 'lead-scraping',
 name: 'Lead Scraping',
 description: 'Scrape more leads from multiple sources and fuel your pipeline with quality prospects.',
 category: 'Lead Intelligence',
 price: '$15.00',
 priceValue: 15,
 priceUnit: '/ 5,000 leads',
 badgeText: 'New',
 badgeClass: 'bg-info/10 text-info border border-info/20',
 icon: Search,
 iconBg: 'bg-primary/10',
 iconBgDark: '',
 iconColor: 'text-primary',
 popular: false,
 details: [
 'Extracts contact databases from company sites and registries.',
 'Granular search filters by geographical radius, sector, and company size.',
 'Built-in de-duplication mechanism prevents database duplicates.',
 'One-click synchronization with active RakanSales deals board.'
 ]
 },
 {
 id: 'ai-follow-up-pro',
 name: 'AI Follow-Up Pro',
 description: 'Unlock advanced AI follow-ups with multi-channel sequences and smart personalization.',
 category: 'AI & Automation',
 price: '$19.00',
 priceValue: 19,
 priceUnit: '/ 10,000 contacts',
 badgeText: 'New',
 badgeClass: 'bg-info/10 text-info border border-info/20',
 icon: Send,
 iconBg: 'bg-primary/10',
 iconBgDark: '',
 iconColor: 'text-primary',
 popular: false,
 details: [
 'Orchestrates automated follow-ups via WhatsApp, SMS, and Email.',
 'Context-aware content generation that mimics agent communication history.',
 'Auto-detects client intent (e.g. positive response, meeting requests, delays).',
 'Advanced split A/B path sequence analytics.'
 ]
 },
 {
 id: 'ai-sales-advisor',
 name: 'AI Sales Advisor',
 description: 'Get AI-powered sales advice, deal insights and actionable recommendations.',
 category: 'AI & Automation',
 price: '$29.00',
 priceValue: 29,
 priceUnit: '/ month',
 badgeText: 'New',
 badgeClass: 'bg-info/10 text-info border border-info/20',
 icon: Brain,
 iconBg: 'bg-primary/10',
 iconBgDark: '',
 iconColor: 'text-primary',
 popular: false,
 details: [
 'Daily analytical scan of current sales negotiations.',
 'Provides real-time objections coaching and negotiation recommendations.',
 'Proactively alerts about churn risks or deal stagnation.',
 'Helps to prioritize high win-probability accounts.'
 ]
 }
]

// Filter and Sort Addons (Combined Pill Filter AND Search Term Input)
const filteredAndSortedAddons = computed(() => {
 let list = [...addonsList]
 
 // 1. Category Pill Filter
 if (activeCategory.value !== 'All') {
 list = list.filter(addon => addon.category === activeCategory.value)
 }
 
 // 2. Search Text Filtering
 if (searchQuery.value.trim() !== '') {
 const q = searchQuery.value.toLowerCase()
 list = list.filter(addon => 
 addon.name.toLowerCase().includes(q) || 
 addon.category.toLowerCase().includes(q) || 
 addon.description.toLowerCase().includes(q)
 )
 }
 
 // 3. Sorting logic
 if (sortBy.value === 'popular') {
 list.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0))
 } else if (sortBy.value === 'price-low') {
 list.sort((a, b) => a.priceValue - b.priceValue)
 } else if (sortBy.value === 'price-high') {
 list.sort((a, b) => b.priceValue - a.priceValue)
 }
 
 return list
})

// Categories tabs
const categories = [
 'All',
 'AI & Automation',
 'Communication',
 'Lead Intelligence',
 'Voice & Calling'
]

// Usage Overview Mock Data with dynamic alert boundaries
const usageList = ref([
 {
 id: 'ai-tokens',
 name: 'AI Tokens',
 used: 4700, // 94% -> DANGER alert state
 total: 5000,
 unit: 'tokens',
 percent: 94,
 icon: Sparkles,
 iconColor: 'text-primary',
 iconBg: 'bg-primary/10',
 iconBgDark: '',
 },
 {
 id: 'email-credits',
 name: 'Email Credits',
 used: 2100, // 84% -> WARNING alert state
 total: 2500,
 unit: 'emails',
 percent: 84,
 icon: Mail,
 iconColor: 'text-primary',
 iconBg: 'bg-primary/10',
 iconBgDark: '',
 },
 {
 id: 'ai-voice-minutes',
 name: 'AI Voice Minutes',
 used: 350,
 total: 1000,
 unit: 'minutes',
 percent: 35,
 icon: PhoneCall,
 iconColor: 'text-primary',
 iconBg: 'bg-primary/10',
 iconBgDark: '',
 },
 {
 id: 'linkedin-credits',
 name: 'LinkedIn Credits',
 used: 150,
 total: 1000,
 unit: 'credits',
 percent: 15,
 icon: 'simple-icons:linkedin',
 isIconify: true,
 iconColor: 'text-primary',
 iconBg: 'bg-primary/10',
 iconBgDark: '',
 }
])

// Helper to calculate mathematically accurate reactive usage percentage
const getUsagePercent = (usage: any) => {
 if (!usage.total) return 0
 return Math.min(Math.round((usage.used / usage.total) * 100), 100)
}

// Custom progressive coloring class helper based on alert thresholds
const getProgressBarClass = (usage: any) => {
 const percent = getUsagePercent(usage)
 if (percent >= 90) return 'bg-destructive animate-pulse'
 if (percent >= 80) return 'bg-warning'
 
 switch (usage.id) {
 case 'ai-tokens': return 'bg-tag-1'
 case 'email-credits': return 'bg-info'
 case 'ai-voice-minutes': return 'bg-brand'
 case 'linkedin-credits': return 'bg-tag-2'
 default: return 'bg-primary'
 }
}

// Consumption logs audit records dataset
const historyLogs = [
 {
 id: 1,
 category: 'AI Tokens',
 message: '1,200 tokens consumed for Smart follow-up sequence',
 time: '2 hours ago',
 icon: Sparkles,
 iconColor: 'text-tag-1-foreground'
 },
 {
 id: 2,
 category: 'Email Credits',
 message: '450 emails sent for Outbound Campaign B',
 time: '5 hours ago',
 icon: Mail,
 iconColor: 'text-info'
 },
 {
 id: 3,
 category: 'AI Voice Minutes',
 message: '35 minutes used for outbound AI voice agent calls',
 time: 'Yesterday',
 icon: PhoneCall,
 iconColor: 'text-brand'
 },
 {
 id: 4,
 category: 'LinkedIn Credits',
 message: '15 credits used for profile data enrichments',
 time: '2 days ago',
 icon: 'simple-icons:linkedin',
 isIconify: true,
 iconColor: 'text-tag-2-foreground'
 }
]

// Category logs popup calculation
const computedCategoryLogs = computed(() => {
 if (!selectedUsageCategory.value) return []
 return historyLogs.filter(log => log.category === selectedUsageCategory.value)
})

// Timeline logs popup trigger
const openUsageLogs = (categoryName: string) => {
 selectedUsageCategory.value = categoryName
 isUsageLogsOpen.value = true
}

// Quick Top-up navigation trigger mapping
const handleQuickTopUp = (usageId: string) => {
 let addonId = usageId
 if (usageId === 'email-credits') addonId = 'email-sending'
 if (usageId === 'linkedin-credits') addonId = 'linkedin-enrichment'
 
 const matched = addonsList.find(a => a.id === addonId)
 if (matched) {
 openDetails(matched)
 }
}

// Map storing the active quantity package multiplier of each add-on
const addonMultipliers = ref<Record<string, number>>({
 'ai-tokens': 1,
 'email-sending': 1,
})

// Dynamic track fill gradient calculation for range inputs
const sliderBackground = computed(() => {
  const pct = ((multiplier.value - 1) / 9) * 100
  return `linear-gradient(to right, var(--primary) 0%, var(--primary) ${pct}%, var(--border) ${pct}%, var(--border) 100%)`
})

// Modal activation logic with resetting multiplier
const openDetails = (addon: Addon) => {
 selectedAddon.value = addon
 
 // Pre-load slider to currently active quantity, or 1 if not active
 const ownedMultiplier = activatedAddons.value[addon.id] ? (addonMultipliers.value[addon.id] || 1) : 1
 multiplier.value = ownedMultiplier
 
 checkoutStep.value = 'configure' // Default to configure step
 deactivationChecked.value = false // Reset checkbox
 termsChecked.value = false // Reset B2B terms check
 isDetailsOpen.value = true
}

const activeOwnedMultiplier = computed(() => {
 if (!selectedAddon.value) return 0
 const id = selectedAddon.value.id
 return activatedAddons.value[id] ? (addonMultipliers.value[id] || 1) : 0
})

const computedActiveOwnedPrice = computed(() => {
 if (!selectedAddon.value || activeOwnedMultiplier.value === 0) return 0
 const base = selectedAddon.value.priceValue
 let total = base * activeOwnedMultiplier.value
 if (activeOwnedMultiplier.value >= 5) {
 total = total * 0.9
 }
 return total
})

const priceDelta = computed(() => {
 return computedPrice.value - computedActiveOwnedPrice.value
})

const applyCreditsAllocation = () => {
 if (!selectedAddon.value) return
 
 const id = selectedAddon.value.id
 let usageId = id
 if (id === 'email-sending') usageId = 'email-credits'
 if (id === 'linkedin-enrichment') usageId = 'linkedin-credits'
 
 // Extract packages package unit size
 const unit = selectedAddon.value.priceUnit
 const cleanNumber = unit.replace(/[^0-9]/g, '')
 const packageUnitSize = parseInt(cleanNumber, 10) || 0
 
 const wasActive = activatedAddons.value[id]
 const oldMultiplier = wasActive ? (addonMultipliers.value[id] || 1) : 0
 const newMultiplier = multiplier.value
 
 // Update state multiplier map
 addonMultipliers.value[id] = newMultiplier
 
 const usageItem = usageList.value.find(u => u.id === usageId)
 if (usageItem) {
 if (packageUnitSize > 0) {
 // Calculate delta credits
 const oldCredits = packageUnitSize * oldMultiplier
 const newCredits = packageUnitSize * newMultiplier
 const deltaCredits = newCredits - oldCredits
 
 usageItem.total += deltaCredits
 // Recalculate percentage
 usageItem.percent = Math.min(Math.round((usageItem.used / usageItem.total) * 100), 100)
 }
 } else {
 // Dynamically append new credit tracking widget!
 let unitText = selectedAddon.value.priceUnit.replace(/[0-9,\/ ]/g, '')
 const totalAllocated = packageUnitSize * newMultiplier
 
 usageList.value.push({
 id: selectedAddon.value.id,
 name: selectedAddon.value.name,
 used: 0,
 total: totalAllocated || 1000,
 unit: unitText || 'credits',
 percent: 0,
 icon: selectedAddon.value.icon,
 isIconify: selectedAddon.value.isIconify,
 iconColor: selectedAddon.value.iconColor,
 iconBg: selectedAddon.value.iconBg,
 iconBgDark: selectedAddon.value.iconBgDark
 })
 }
 
 // Push to history logs list
 let logMsg = ''
 if (oldMultiplier === 0) {
 logMsg = `${computedCreditsAllocated.value} allocated successfully via secure invoice activation.`
 } else if (newMultiplier > oldMultiplier) {
 const additionalCredits = packageUnitSize * (newMultiplier - oldMultiplier)
 logMsg = `Subscription upgraded: added ${additionalCredits.toLocaleString()} credits (Total: ${computedCreditsAllocated.value}).`
 } else if (newMultiplier < oldMultiplier) {
 const reducedCredits = packageUnitSize * (oldMultiplier - newMultiplier)
 logMsg = `Subscription downgraded: reduced ${reducedCredits.toLocaleString()} credits (Total: ${computedCreditsAllocated.value}).`
 } else {
 logMsg = `Subscription updated: package quantity maintained at ${newMultiplier}x.`
 }
 
 const newLog = {
 id: historyLogs.length + 1,
 category: selectedAddon.value.name,
 message: logMsg,
 time: 'Just now',
 icon: selectedAddon.value.icon,
 isIconify: selectedAddon.value.isIconify,
 iconColor: selectedAddon.value.iconColor
 }
 historyLogs.unshift(newLog)
}

const confirmPayment = () => {
 if (!selectedAddon.value) return
 
 checkoutStep.value = 'processing'
 loaderText.value = 'Connecting to secure payment gateway...'
 
 setTimeout(() => {
 loaderText.value = 'Authorizing B2B subscription adjustment...'
 
 setTimeout(() => {
 loaderText.value = 'Modifying active cloud nodes & credit limits...'
 
 setTimeout(() => {
 if (selectedAddon.value) {
 const wasActive = activatedAddons.value[selectedAddon.value.id]
 applyCreditsAllocation()
 activatedAddons.value[selectedAddon.value.id] = true
 
 if (wasActive) {
 toast.success(`Subscription updated successfully!`, {
 description: `New limit: ${computedCreditsAllocated.value} allocated.`
 })
 } else {
 toast.success(`${selectedAddon.value.name} activated successfully!`, {
 description: `Payment authorized. Allocation: ${computedCreditsAllocated.value}.`
 })
 }
 
 checkoutStep.value = 'success'
 }
 }, 900)
 }, 900)
 }, 900)
}

const confirmDeactivation = () => {
 if (!selectedAddon.value) return
 
 const id = selectedAddon.value.id
 
 // Calculate final reduction to limits
 const usageId = id === 'email-sending' ? 'email-credits' : id === 'linkedin-enrichment' ? 'linkedin-credits' : id
 const usageItem = usageList.value.find(u => u.id === usageId)
 
 const unit = selectedAddon.value.priceUnit
 const cleanNumber = unit.replace(/[^0-9]/g, '')
 const packageUnitSize = parseInt(cleanNumber, 10) || 0
 const ownedMultiplier = addonMultipliers.value[id] || 1
 
 if (usageItem && packageUnitSize > 0) {
 // Subtract currently owned credits
 usageItem.total = Math.max(usageItem.total - (packageUnitSize * ownedMultiplier), usageItem.used)
 usageItem.percent = Math.min(Math.round((usageItem.used / usageItem.total) * 100), 100)
 }
 
 // Reset multipliers map & status
 addonMultipliers.value[id] = 1
 activatedAddons.value[id] = false
 
 // Add audit trail for deactivation
 const newLog = {
 id: historyLogs.length + 1,
 category: selectedAddon.value.name,
 message: `Add-on deactivated. Standard features frozen and limits reduced.`,
 time: 'Just now',
 icon: Info,
 iconColor: 'text-destructive'
 }
 historyLogs.unshift(newLog)
 
 toast.info(`${selectedAddon.value.name} deactivated.`, {
 description: 'Cloud nodes deallocated. Changes apply at end of cycle.'
 })
 
 isDetailsOpen.value = false
}

// Volume & Discount arithmetic calculations based on package slider multiplier
const computedPrice = computed(() => {
 if (!selectedAddon.value) return 0
 const base = selectedAddon.value.priceValue
 let total = base * multiplier.value
 
 // Apply 10% discount for 5x multiplier or above
 if (multiplier.value >= 5) {
 total = total * 0.9
 }
 return total
})

const computedOriginalPrice = computed(() => {
 if (!selectedAddon.value) return 0
 return selectedAddon.value.priceValue * multiplier.value
})

const computedCreditsAllocated = computed(() => {
 if (!selectedAddon.value) return ''
 
 const unit = selectedAddon.value.priceUnit
 const cleanNumber = unit.replace(/[^0-9]/g, '')
 const numericValue = parseInt(cleanNumber, 10) || 0
 const textLabel = unit.replace(/[0-9,\/ ]/g, '')
 
 if (numericValue === 0) return unit // e.g. "/ month"
 
 const totalAllocated = numericValue * multiplier.value
 return `${totalAllocated.toLocaleString()} ${textLabel}`
})

const openChat = () => {
 isChatOpen.value = true
}
</script>

<template>
 <div class="space-y-8 select-none max-w-7xl mx-auto pb-12 animate-in fade-in duration-300">
 <!-- Header Block -->
 <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
 <div>
 <h1 class="text-3xl font-bold tracking-tight text-foreground mb-1.5">Add-ons</h1>
 <p class="text-sm text-muted-foreground">Supercharge your sales with powerful add-ons. Pay only for what you need.</p>
 </div>

 <!-- How Add-ons Work CTA Button -->
 <button 
 @click="isHowItWorksOpen = true"
 class="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary-dark hover:underline transition-colors self-start lg:self-auto cursor-pointer"
 >
 <PlayCircle class="w-4 h-4" />
 How Add-ons work
 </button>
 </div>

 <!-- Category Pill Filters & Sort/Search Row (Aligned in a Single Row on Desktop xl) -->
 <div class="flex flex-col xl:flex-row xl:items-start justify-between gap-4 border-b border-border pb-5">
 <!-- Category Tab Pills -->
 <div class="flex flex-wrap gap-1.5">
 <button 
 v-for="cat in categories" 
 :key="cat"
 @click="activeCategory = cat"
 :class="[
 'px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all duration-200 cursor-pointer flex items-center gap-1.5 select-none',
 activeCategory === cat 
 ? 'bg-primary border-primary text-primary-foreground' 
 : 'bg-card border-border text-muted-foreground hover:bg-muted hover:text-foreground hover:border-border'
 ]"
 >
 <component 
 v-if="cat !== 'All'" 
 :is="cat === 'AI & Automation' ? Sparkles : cat === 'Communication' ? Mail : cat === 'Lead Intelligence' ? Search : PhoneCall"
 class="w-3.5 h-3.5"
 :class="activeCategory === cat ? 'text-primary-foreground' : 'text-muted-foreground'" 
 />
 <SlidersHorizontal 
 v-else 
 class="w-3.5 h-3.5"
 :class="activeCategory === cat ? 'text-primary-foreground' : 'text-muted-foreground'" 
 />
 {{ cat === 'All' ? 'All Add-ons' : cat }}
 </button>
 </div>

 <!-- Sort, Search & Filter Actions -->
 <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 self-stretch xl:self-auto shrink-0">
 <!-- Interactive search input -->
 <div class="relative flex-1 sm:flex-initial">
 <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
 <input 
 v-model="searchQuery"
 type="text" 
 placeholder="Search add-ons..." 
 class="pl-9 pr-3 py-1.5 w-full sm:w-40 xl:w-44 bg-card border border-border rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground h-9"
 />
 <button 
 v-if="searchQuery" 
 @click="searchQuery = ''"
 class="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-muted-foreground text-xs font-bold font-sans cursor-pointer"
 >
 ×
 </button>
 </div>

 <div class="flex items-center gap-2.5">
 <!-- Sort Select -->
 <div class="flex items-center gap-1.5">
 <span class="text-xs text-muted-foreground font-medium whitespace-nowrap">Sort:</span>
 <Select v-model="sortBy">
 <SelectTrigger class="w-32 bg-card border-border rounded-lg text-xs font-semibold focus:ring-1 focus:ring-primary h-9">
 <SelectValue placeholder="Sort..." />
 </SelectTrigger>
 <SelectContent class="bg-card border-border text-xs">
 <SelectGroup>
 <SelectItem value="popular">Popular first</SelectItem>
 <SelectItem value="price-low">Price: Low-High</SelectItem>
 <SelectItem value="price-high">Price: High-Low</SelectItem>
 </SelectGroup>
 </SelectContent>
 </Select>
 </div>

 <!-- Filter Button -->
 <Button variant="outline" size="sm" class="rounded-lg bg-card border-border text-xs font-bold text-foreground hover:bg-muted flex items-center gap-2 h-9 cursor-pointer">
 <SlidersHorizontal class="w-3.5 h-3.5 text-muted-foreground" />
 Filter
 </Button>
 </div>
 </div>
 </div>

 <!-- Zero Results state -->
 <div v-if="filteredAndSortedAddons.length === 0" class="py-16 text-center space-y-4">
 <div class="w-14 h-14 bg-muted rounded-full flex items-center justify-center mx-auto text-muted-foreground">
 <Search class="w-6 h-6" />
 </div>
 <div class="space-y-1">
 <p class="font-extrabold text-sm text-foreground">No add-ons match your search</p>
 <p class="text-xs text-muted-foreground max-w-xs mx-auto">Try correcting the spelling or clearing filters to view all add-ons.</p>
 </div>
 <Button variant="outline" size="sm" @click="searchQuery = ''; activeCategory = 'All'" class="rounded-xl font-bold mt-2">
 Reset filters
 </Button>
 </div>

 <!-- Add-ons Cards Responsive Grid (4 Column Layout) -->
 <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
 <!-- Dynamic list rendering of filtered Add-ons -->
 <Card 
 v-for="addon in filteredAndSortedAddons" 
 :key="addon.id"
 class="group shadow-none border-border rounded-2xl flex flex-col justify-between overflow-hidden bg-card hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-200"
 >
 <CardHeader class="p-4.5 pb-2 flex flex-col space-y-3">
 <div class="flex justify-between items-start">
 <!-- Icon with colored round container -->
 <div :class="[addon.iconBg, addon.iconBgDark, 'p-2.5 rounded-xl flex items-center justify-center border border-border']">
 <Icon v-if="addon.isIconify" :icon="addon.icon" :class="[addon.iconColor, 'w-5 h-5 shrink-0']" />
 <component v-else :is="addon.icon" :class="[addon.iconColor, 'w-5 h-5 shrink-0']" />
 </div>

 <!-- Popular / New Status Badges -->
 <span 
 v-if="addon.badgeText"
 :class="[addon.badgeClass, 'inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 select-none']"
 >
 <Flame v-if="addon.badgeText.includes('Popular')" class="w-3 h-3 fill-destructive text-destructive shrink-0" />
 {{ addon.badgeText.replace('🔥 ', '') }}
 </span>
 </div>

 <div>
 <h3 class="font-bold text-foreground text-base leading-tight tracking-tight group-hover:text-primary transition-colors duration-150">
 {{ addon.name }}
 </h3>
 
 <!-- Category and glowing status badge -->
 <div class="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground font-semibold">
 <span>{{ addon.category }}</span>
 <span v-if="activatedAddons[addon.id]" class="inline-flex items-center gap-1 text-[9px] font-bold text-success bg-success/10 px-1.5 py-0.2 rounded border border-success/20">
 <span class="size-1 bg-success rounded-full animate-pulse"></span>
 Active
 </span>
 </div>
 </div>
 </CardHeader>

 <CardContent class="p-4.5 pt-0 flex flex-col justify-between flex-1 space-y-4">
 <!-- Description text -->
 <p class="text-xs text-muted-foreground line-clamp-3 leading-relaxed mt-1">
 {{ addon.description }}
 </p>

 <!-- Pricing & Context-aware View Details Action -->
 <div class="space-y-3.5 pt-2 border-t border-border">
 <div class="flex flex-col">
 <span class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">From</span>
 <span class="text-sm font-extrabold text-foreground mt-0.5">
 {{ addon.price }}
 <span class="text-xs text-muted-foreground font-medium font-sans">{{ addon.priceUnit }}</span>
 </span>
 </div>

 <!-- Contextual action button (Manage Add-on vs View Details) -->
 <Button 
 @click="openDetails(addon)"
 :variant="activatedAddons[addon.id] ? 'outline' : 'default'"
 class="w-full text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 py-2 cursor-pointer h-9 transition-all duration-200 focus-visible:ring-primary "
 :class="[
 activatedAddons[addon.id] 
 ? 'border-primary/30 bg-primary/10 text-primary hover:bg-primary/15 shadow-none' 
 : 'bg-primary hover:bg-primary/90 text-primary-foreground'
 ]"
 >
 <span v-if="activatedAddons[addon.id]" class="flex items-center gap-1 select-none">
 Manage Add-on
 <Check class="w-3.5 h-3.5 text-primary stroke-[3.5]" />
 </span>
 <span v-else class="flex items-center gap-1 select-none">
 View Details
 <ArrowRight class="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-250" />
 </span>
 </Button>
 </div>
 </CardContent>
 </Card>

 <!-- 8th Unique Marketing value card -->
 <div 
 class="border-none shadow-none rounded-2xl flex flex-col justify-between overflow-hidden bg-transparent select-none"
 >
 <div class="p-4.5 pb-2">
 <div class="flex items-center gap-2">
 <div class="p-2 bg-info/10 rounded-xl text-info border border-info/20 ">
 <ShieldCheck class="w-5 h-5 shrink-0" />
 </div>
 <h3 class="font-bold text-foreground text-sm tracking-tight leading-tight">
 Secure. Transparent. Flexible.
 </h3>
 </div>
 </div>

 <div class="p-4.5 pt-0 flex flex-col justify-between flex-1 space-y-4">
 <!-- Bulleted marketing checklists -->
 <ul class="space-y-2.5 text-xs text-muted-foreground mt-2 font-medium">
 <li class="flex items-center gap-2">
 <Check class="w-4 h-4 text-info stroke-[3]" />
 <span>Pay only for what you use</span>
 </li>
 <li class="flex items-center gap-2">
 <Check class="w-4 h-4 text-info stroke-[3]" />
 <span>No hidden fees</span>
 </li>
 <li class="flex items-center gap-2">
 <Check class="w-4 h-4 text-info stroke-[3]" />
 <span>Add or remove anytime</span>
 </li>
 <li class="flex items-center gap-2">
 <Check class="w-4 h-4 text-info stroke-[3]" />
 <span>Instant activation</span>
 </li>
 </ul>

 <!-- Live Help Support Box -->
 <div 
 @click="openChat"
 class="bg-info/10 hover:bg-info/10 border border-info/20 p-3 rounded-xl flex items-center justify-between gap-2.5 cursor-pointer transition-colors"
 >
 <div class="flex items-center gap-2">
 <MessageSquare class="w-4 h-4 text-info shrink-0" />
 <div class="text-[10px] leading-snug">
 <p class="font-extrabold text-info ">Need help choosing?</p>
 <p class="font-bold text-info mt-0.5">Chat with our team</p>
 </div>
 </div>
 <ChevronRight class="w-4 h-4 text-info shrink-0" />
 </div>
 </div>
 </div>
 </div>

 <!-- Your Usage Overview Bottom Panel (Credit Tracking Widgets with Hover Overlays & Timeline logs) -->
 <div class="space-y-5 bg-card border border-border rounded-2xl p-5 shadow-none">
 <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
 <div>
 <h2 class="text-lg font-bold tracking-tight text-foreground">Your Usage Overview</h2>
 <p class="text-xs text-muted-foreground font-semibold mt-0.5">Hover on any card to quickly Top-Up credits or review history timeline pop-ups.</p>
 </div>
 
 <button class="text-xs font-semibold text-primary hover:text-primary-dark hover:underline flex items-center gap-1.5 cursor-pointer select-none self-start sm:self-auto">
 View all usage
 <ArrowRight class="w-3.5 h-3.5" />
 </button>
 </div>

 <!-- 4 Column Usage Stats Grid with Threshold Alerts and Overlay Controls on Hover -->
 <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
 <div 
 v-for="usage in usageList" 
 :key="usage.id"
 class="group/usage relative overflow-hidden border border-border/70 p-3.5 rounded-xl bg-muted/50 hover:border-border transition-colors"
 >
 <!-- Default Main Card view -->
 <div>
 <div class="flex items-center justify-between gap-3 mb-3">
 <div class="flex items-center gap-2">
 <div :class="[usage.iconBg || 'bg-primary/10', usage.iconBgDark || '', 'p-1.5 rounded-lg border border-primary/20 flex items-center justify-center shrink-0']">
 <Icon v-if="usage.isIconify" :icon="usage.icon" :class="[usage.iconColor, 'w-4 h-4 shrink-0']" />
 <component v-else :is="usage.icon" :class="[usage.iconColor, 'w-4 h-4 shrink-0']" />
 </div>
 <span class="font-extrabold text-xs text-foreground truncate">{{ usage.name }}</span>
 </div>
 
 <!-- High Usage / Danger Threshold badges -->
 <span 
 v-if="getUsagePercent(usage) >= 90" 
 class="inline-flex items-center gap-0.5 text-[9px] font-bold text-destructive bg-destructive/10 px-1.5 py-0.2 rounded border border-destructive/20 "
 >
 [!] Danger
 </span>
 <span 
 v-else-if="getUsagePercent(usage) >= 80" 
 class="inline-flex items-center gap-0.5 text-[9px] font-bold text-warning bg-warning/10 px-1.5 py-0.2 rounded border border-warning/20 "
 >
 [!] High Usage
 </span>
 <span v-else class="text-[10px] font-bold text-muted-foreground font-mono">{{ getUsagePercent(usage) }}% used</span>
 </div>

 <!-- Usage limits digits -->
 <div class="flex items-baseline gap-1 text-xs">
 <span class="text-sm font-black text-foreground">{{ usage.used.toLocaleString() }}</span>
 <span class="text-muted-foreground font-medium">/ {{ usage.total.toLocaleString() }} {{ usage.unit }}</span>
 </div>

 <!-- Interactive colorful progress bar reflecting thresholds -->
 <div class="h-1.5 w-full bg-muted rounded-full overflow-hidden mt-3">
 <div 
 class="h-full rounded-full transition-all duration-300"
 :class="getProgressBarClass(usage)"
 :style="{ width: getUsagePercent(usage) + '%' }"
 ></div>
 </div>
 </div>

 <!-- Premium Hover Overlay offering Top-up and Pop-up Timeline Log -->
 <div class="absolute inset-0 bg-card/95 opacity-0 group-hover/usage:opacity-100 transition-opacity duration-200 flex flex-col justify-center items-center gap-2 p-3.5 border border-border rounded-xl">
 <!-- Action Button A: Top-Up modal slider shortcut -->
 <Button 
 size="xs" 
 @click="handleQuickTopUp(usage.id)"
 class="w-full text-[10.5px] font-bold bg-primary hover:bg-primary/95 text-primary-foreground h-7 flex items-center justify-center gap-1.5 cursor-pointer rounded-lg shadow-none"
 >
 <Sparkles class="w-3.5 h-3.5" />
 Top-Up Credits
 </Button>
 
 <!-- Action Button B: View History modal timeline -->
 <Button 
 size="xs" 
 variant="outline"
 @click="openUsageLogs(usage.name)"
 class="w-full text-[10.5px] font-bold h-7 flex items-center justify-center gap-1.5 cursor-pointer border-border hover:bg-muted/50 rounded-lg"
 >
 <Info class="w-3.5 h-3.5" />
 View History
 </Button>
 </div>
 </div>
 </div>

 <!-- Collapsible Consumption History Accordion -->
 <div class="border-t border-border/60 pt-4 flex flex-col space-y-3">
 <button 
 @click="showHistory = !showHistory"
 class="flex items-center justify-between text-xs font-bold text-muted-foreground hover:text-primary transition-colors cursor-pointer select-none py-1 focus:outline-none"
 >
 <span class="flex items-center gap-1.5">
 <Info class="w-3.5 h-3.5 text-muted-foreground" />
 Show consumption history & billing log
 </span>
 <ChevronRight 
 class="w-4 h-4 text-muted-foreground transition-transform duration-200" 
 :class="{ 'rotate-90 text-primary': showHistory }"
 />
 </button>
 
 <!-- Accordion log elements -->
 <div 
 v-if="showHistory"
 class="space-y-2.5 animate-in slide-in-from-top-2 duration-200 pl-1"
 >
 <div 
 v-for="log in historyLogs" 
 :key="log.id"
 class="flex items-center justify-between text-xs p-2.5 rounded-xl border border-border bg-muted/50 hover:border-border transition-colors"
 >
 <div class="flex items-center gap-2.5">
 <div class="p-1 rounded-lg bg-card border flex items-center justify-center shrink-0">
 <Icon v-if="log.isIconify" :icon="log.icon" class="text-muted-foreground w-3.5 h-3.5 shrink-0" />
 <component v-else :is="log.icon" class="text-muted-foreground w-3.5 h-3.5 shrink-0" />
 </div>
 <div>
 <span class="font-extrabold text-foreground mr-1.5">{{ log.category }}:</span>
 <span class="text-muted-foreground font-medium">{{ log.message }}</span>
 </div>
 </div>
 <span class="text-[10px] font-bold text-muted-foreground font-mono whitespace-nowrap">{{ log.time }}</span>
 </div>
 </div>
 </div>
 </div>

 <!-- Padlocked Secure Encryption Footer Note -->
 <div class="flex items-center justify-center gap-2 text-[11px] text-muted-foreground font-bold pt-4 border-t border-border/40">
 <Lock class="w-3.5 h-3.5 text-muted-foreground" />
 <span>All transactions are secure and encrypted.</span>
 </div>

 <!-- DIALOG 1: "How Add-ons Work" Interactive Overlay -->
 <Dialog v-model:open="isHowItWorksOpen">
 <DialogContent class="bg-card border-border p-6 rounded-2xl max-w-md">
 <DialogHeader class="space-y-1.5">
 <DialogTitle class="text-foreground font-bold tracking-tight text-lg flex items-center gap-2">
 <PlayCircle class="w-5 h-5 text-primary" />
 How Add-ons Work
 </DialogTitle>
 <DialogDescription class="text-xs text-muted-foreground">
 Learn about billing adjustments, usage allocations, and deactivations.
 </DialogDescription>
 </DialogHeader>

 <div class="space-y-4 py-3 text-xs text-muted-foreground leading-relaxed font-medium">
 <div class="space-y-1.5 p-3 bg-muted/50 rounded-xl border ">
 <h4 class="font-extrabold text-foreground ">1. Instant Allocation</h4>
 <p>Credits, tokens, or minutes are allocated immediately to your active workspace upon activating any add-on.</p>
 </div>
 
 <div class="space-y-1.5 p-3 bg-muted/50 rounded-xl border ">
 <h4 class="font-extrabold text-foreground ">2. Pro-rated Billing</h4>
 <p>Pricing is pro-rated for the current billing cycle. Automatic renewals occur synchronously alongside your RakanSales baseline plan.</p>
 </div>

 <div class="space-y-1.5 p-3 bg-muted/50 rounded-xl border ">
 <h4 class="font-extrabold text-foreground ">3. Flexible Cancellation</h4>
 <p>You can toggle off or downgrade add-ons at any point. Current allocations remain active until your renewal date.</p>
 </div>
 </div>

 <DialogFooter>
 <DialogClose as-child>
 <Button size="sm" class="rounded-xl px-4 cursor-pointer font-bold w-full bg-primary hover:bg-primary/90 text-primary-foreground">Got it</Button>
 </DialogClose>
 </DialogFooter>
 </DialogContent>
 </Dialog>

 <!-- DIALOG 2: Detailed Individual Add-on Dialog with Interactive Volume Slider -->
 <Dialog v-model:open="isDetailsOpen">
 <DialogContent class="bg-card border-border p-6 rounded-2xl max-w-lg" v-if="selectedAddon">
 <DialogHeader class="space-y-2 pb-3 border-b ">
 <div class="flex justify-between items-start gap-4">
 <div class="flex items-center gap-3">
 <div :class="[selectedAddon.iconBg, selectedAddon.iconBgDark, 'p-2.5 rounded-xl border flex items-center justify-center shrink-0']">
 <Icon v-if="selectedAddon.isIconify" :icon="selectedAddon.icon" :class="[selectedAddon.iconColor, 'w-6 h-6 shrink-0']" />
 <component v-else :is="selectedAddon.icon" :class="[selectedAddon.iconColor, 'w-6 h-6 shrink-0']" />
 </div>
 <div>
 <DialogTitle class="text-foreground font-bold tracking-tight text-lg leading-tight">
 {{ selectedAddon.name }}
 </DialogTitle>
 <p class="text-xs text-muted-foreground font-semibold mt-0.5">
 {{ selectedAddon.category }}
 </p>
 </div>
 </div>

 <span 
 v-if="selectedAddon.badgeText"
 :class="[selectedAddon.badgeClass, 'inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 select-none']"
 >
 <Flame v-if="selectedAddon.badgeText.includes('Popular')" class="w-3 h-3 fill-destructive text-destructive shrink-0" />
 {{ selectedAddon.badgeText.replace('🔥 ', '') }}
 </span>
 </div>
 </DialogHeader>

 <!-- STEP 1: CONFIGURE (DEFAULT) -->
 <div v-if="checkoutStep === 'configure'" class="space-y-4 py-4 text-xs font-medium animate-in fade-in duration-200">
 <p class="text-muted-foreground leading-relaxed">
 {{ selectedAddon.description }}
 </p>

 <!-- Interactive package pricing range slider -->
 <div class="space-y-3 bg-muted/50 border p-4.5 rounded-xl">
 <div class="flex items-center justify-between">
 <span class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Select Package Quantity</span>
 <span class="font-extrabold text-xs text-primary bg-primary/10 px-2.5 py-0.5 rounded border border-primary/20">
 {{ multiplier }}x Package{{ multiplier > 1 ? 's' : '' }}
 </span>
 </div>
 
 <div class="flex items-center gap-4 py-1">
 <span class="text-[10px] text-muted-foreground font-bold">1x</span>
 <input 
 v-model.number="multiplier"
 type="range" 
 min="1" 
 max="10" 
 step="1"
 class="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
 :style="{ background: sliderBackground }"
 />
 <span class="text-[10px] text-muted-foreground font-bold">10x</span>
 </div>

 <div class="flex justify-between items-center text-[10px] text-muted-foreground font-bold pt-1">
 <span>Allocated: <strong class="text-foreground ">{{ computedCreditsAllocated }}</strong></span>
 
 <!-- 10% auto discount note -->
 <span v-if="multiplier >= 5" class="text-primary animate-pulse font-extrabold">
 10% Volume Discount Applied!
 </span>
 <span v-else class="text-muted-foreground font-medium">Buy 5x or more to save 10%</span>
 </div>
 </div>

 <!-- Core specifications -->
 <div class="space-y-2.5">
 <h4 class="font-extrabold text-foreground uppercase tracking-wider text-[10px]">What's Included:</h4>
 <ul class="space-y-2">
 <li 
 v-for="(detail, idx) in selectedAddon.details" 
 :key="idx"
 class="flex items-start gap-2 text-muted-foreground leading-relaxed"
 >
 <Check class="w-4 h-4 text-primary shrink-0 stroke-[3] mt-0.5" />
 <span>{{ detail }}</span>
 </li>
 </ul>
 </div>

 <!-- Price Highlight representing multiplier discounts -->
 <div class="bg-muted/50 p-4 rounded-xl border flex justify-between items-center mt-2">
 <div>
 <span class="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Pricing details</span>
 <div class="flex items-baseline gap-2 mt-0.5">
 <p class="text-lg font-black text-foreground leading-none">
 ${{ computedPrice.toFixed(2) }}
 <span class="text-xs text-muted-foreground font-medium font-sans">/ month</span>
 </p>
 
 <!-- Crossed out original price if volume discount triggered -->
 <p v-if="multiplier >= 5" class="text-xs text-muted-foreground line-through leading-none font-bold">
 ${{ computedOriginalPrice.toFixed(2) }}
 </p>
 </div>
 </div>
 
 <Badge variant="outline" class="rounded-lg text-[10px] uppercase font-bold bg-card">
 Cancel Anytime
 </Badge>
 </div>
 <DialogFooter class="flex justify-between items-center border-t pt-4 mt-4 gap-2">
 <div class="flex gap-2">
 <Button 
 v-if="activatedAddons[selectedAddon.id]"
 size="sm"
 @click="checkoutStep = 'deactivate_confirm'"
 variant="destructive"
 class="rounded-xl px-4 cursor-pointer font-bold h-9 bg-destructive/100 hover:bg-destructive/100 text-destructive border border-destructive/20 shadow-none "
 >
 Deactivate
 </Button>
 <Button 
 variant="outline" 
 size="sm" 
 @click="isDetailsOpen = false"
 class="rounded-xl border-border font-semibold cursor-pointer text-muted-foreground hover:bg-muted/50 h-9"
 >
 Cancel
 </Button>
 </div>
 
 <div class="flex gap-2">
 <Button 
 v-if="activatedAddons[selectedAddon.id] && multiplier === activeOwnedMultiplier"
 size="sm"
 disabled
 class="rounded-xl px-4 font-bold h-9 bg-muted text-muted-foreground border opacity-60 cursor-not-allowed"
 >
 Keep Current Plan
 </Button>
 <Button 
 v-else-if="activatedAddons[selectedAddon.id] && multiplier > activeOwnedMultiplier"
 size="sm"
 @click="checkoutStep = 'checkout'"
 class="rounded-xl px-4 cursor-pointer font-bold h-9 bg-primary hover:bg-primary/95 text-primary-foreground shadow-none"
 >
 Upgrade Plan 📈
 </Button>
 <Button 
 v-else-if="activatedAddons[selectedAddon.id] && multiplier < activeOwnedMultiplier"
 size="sm"
 @click="checkoutStep = 'checkout'"
 class="rounded-xl px-4 cursor-pointer font-bold h-9 bg-warning hover:bg-warning/90 text-warning-foreground shadow-none"
 >
 Downgrade Plan 📉
 </Button>
 <Button 
 v-else
 size="sm"
 @click="checkoutStep = 'checkout'"
 class="rounded-xl px-4 cursor-pointer font-bold h-9 bg-primary hover:bg-primary/95 text-primary-foreground shadow-none"
 >
 Proceed to Checkout
 </Button>
 </div>
 </DialogFooter>
 </div>

 <!-- STEP 2: CHECKOUT INVOICE REVIEW -->
 <div v-else-if="checkoutStep === 'checkout'" class="space-y-3.5 py-3 text-xs font-medium animate-in slide-in-from-right-3 duration-250">
 
 <!-- Premium Product Spotlight Card for Obvious Clarity -->
 <div class="flex items-center gap-3 p-3 bg-card rounded-xl border shadow-none">
 <div :class="[selectedAddon.iconBg, selectedAddon.iconBgDark, 'p-2.5 rounded-xl border flex items-center justify-center shrink-0 shadow-none']">
 <Icon v-if="selectedAddon.isIconify" :icon="selectedAddon.icon" :class="[selectedAddon.iconColor, 'w-6 h-6 shrink-0']" />
 <component v-else :is="selectedAddon.icon" :class="[selectedAddon.iconColor, 'w-6 h-6 shrink-0']" />
 </div>
 <div class="flex-1 min-w-0">
 <div class="flex items-center justify-between gap-2">
 <span class="text-xs font-black text-foreground truncate select-none">{{ selectedAddon.name }}</span>
 <span class="bg-primary/10 text-primary border border-primary/20 rounded-md font-bold text-[9px] px-2 py-0.5 shrink-0 select-none">
 {{ multiplier }}x Package{{ multiplier > 1 ? 's' : '' }}
 </span>
 </div>
 <p class="text-[9px] text-muted-foreground font-extrabold uppercase tracking-wide mt-0.5 select-none">{{ selectedAddon.category }}</p>
 <p class="text-[10px] text-muted-foreground mt-1 leading-relaxed line-clamp-1 select-none font-semibold">
 {{ selectedAddon.description }}
 </p>
 </div>
 </div>

 <div class="p-4 bg-muted/50 rounded-xl border space-y-3.5">
 <h4 class="font-extrabold text-xs text-foreground border-b pb-2 border-dashed">
 {{ activeOwnedMultiplier > 0 ? 'B2B Subscription Adjustment Invoice' : 'B2B Invoice Subscription Summary' }}
 </h4>
 
 <div class="space-y-2">
 <div class="flex justify-between items-center text-muted-foreground">
 <span>Add-on Line Item:</span>
 <span class="font-bold text-foreground ">{{ selectedAddon.name }}</span>
 </div>
 
 <div v-if="activeOwnedMultiplier > 0" class="flex justify-between items-center text-muted-foreground">
 <span>Current Active Plan:</span>
 <span class="font-bold text-muted-foreground">
 {{ activeOwnedMultiplier }}x Package{{ activeOwnedMultiplier > 1 ? 's' : '' }} (${{ computedActiveOwnedPrice.toFixed(2) }}/mo)
 </span>
 </div>
 
 <div class="flex justify-between items-center text-muted-foreground">
 <span>{{ activeOwnedMultiplier > 0 ? 'Proposed Plan Level:' : 'Quantity Selected:' }}</span>
 <span class="font-bold text-foreground ">
 {{ multiplier }}x Package{{ multiplier > 1 ? 's' : '' }}
 </span>
 </div>

 <div class="flex justify-between items-center text-muted-foreground">
 <span>Baseline Price Rate:</span>
 <span class="font-bold font-sans">${{ selectedAddon.priceValue.toFixed(2) }} / pack</span>
 </div>

 <div v-if="multiplier >= 5" class="flex justify-between items-center text-primary font-bold">
 <span>10% Volume Discount:</span>
 <span>-${{ (computedOriginalPrice - computedPrice).toFixed(2) }}</span>
 </div>

 <!-- Upgrade Delta line item -->
 <div v-if="activeOwnedMultiplier > 0 && priceDelta > 0" class="flex justify-between items-center text-primary font-extrabold border-t pt-2">
 <span>Immediate Pro-rated Charge:</span>
 <span class="font-sans text-sm">+${{ priceDelta.toFixed(2) }}</span>
 </div>

 <!-- Downgrade Delta line item -->
 <div v-else-if="activeOwnedMultiplier > 0 && priceDelta < 0" class="flex justify-between items-center text-warning font-extrabold border-t pt-2">
 <span>Statement Credit Delta:</span>
 <span class="font-sans text-sm">-${{ Math.abs(priceDelta).toFixed(2) }} (statement credit)</span>
 </div>

 <div class="flex justify-between items-center text-muted-foreground border-t pt-2 font-bold">
 <span>New Recurring Monthly Bill:</span>
 <span class="text-sm font-extrabold text-foreground font-sans">${{ computedPrice.toFixed(2) }} / mo</span>
 </div>
 </div>
 </div>

 <!-- Payment Option Section -->
 <div class="space-y-2.5 bg-muted/50 border p-4 rounded-xl">
 <label class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Payment Method Selector</label>
 <div class="relative">
 <select 
 v-model="paymentMethod" 
 class="w-full bg-card border-border p-2.5 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary text-foreground cursor-pointer appearance-none"
 >
 <option value="visa-4242">Corporate Visa (Ending in 4242) — ACTIVE</option>
 <option value="master-1903">Executive Mastercard (Ending in 1903)</option>
 <option value="line-credit">Corporate Credit Line (Billing ID: #9832-B2B)</option>
 </select>
 <ChevronRight class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rotate-90 text-muted-foreground pointer-events-none" />
 </div>
 <p class="text-[10px] text-muted-foreground leading-normal">
 Charges are pro-rated and added to your next consolidated RakanSales monthly statement on June 1st.
 </p>
 </div>

 <!-- B2B Subscription Agreement & Terms Compliance Checkbox -->
 <div class="p-3.5 bg-muted/50 border rounded-xl space-y-2 select-none">
 <label class="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">B2B Purchase Terms Agreement</label>
 <div class="flex items-start gap-2.5">
 <input 
 v-model="termsChecked"
 id="purchase-terms-checkbox"
 type="checkbox" 
 class="w-3.5 h-3.5 rounded text-primary focus:ring-primary focus:ring-offset-0 bg-card border-border cursor-pointer mt-0.5"
 />
 <label for="purchase-terms-checkbox" class="text-[9.5px] text-muted-foreground leading-relaxed cursor-pointer font-medium">
 I agree to the <span class="text-primary hover:underline font-bold">RakanSales SaaS Terms of Service</span>. I authorize immediate pro-rated charges and recurring monthly billing adjustments to my active corporate payment source.
 </label>
 </div>
 </div>

 <DialogFooter class="flex gap-2 border-t pt-4 mt-4">
 <Button 
 variant="outline" 
 size="sm" 
 @click="checkoutStep = 'configure'"
 class="rounded-xl border-border font-semibold cursor-pointer text-muted-foreground hover:bg-muted/50 h-9"
 >
 Back to Configuration
 </Button>
 
 <Button 
 size="sm"
 @click="confirmPayment"
 :disabled="!termsChecked"
 class="rounded-xl px-4 cursor-pointer font-bold h-9 bg-primary hover:bg-primary/95 text-primary-foreground flex items-center gap-1.5 shadow-none transition-all duration-205"
 :class="{ 'opacity-50 cursor-not-allowed shadow-none': !termsChecked }"
 >
 💳 {{ activeOwnedMultiplier > 0 ? (priceDelta > 0 ? 'Confirm Upgrade' : 'Confirm Downgrade') : 'Authorize Payment & Activate' }}
 </Button>
 </DialogFooter>
 </div>

 <!-- STEP 3: TRANSACTION PROCESSING LOADER -->
 <div v-else-if="checkoutStep === 'processing'" class="py-12 flex flex-col items-center justify-center space-y-5 text-center animate-in fade-in duration-200">
 <div class="relative w-16 h-16 flex items-center justify-center">
 <!-- Sleek premium spinning loaders -->
 <div class="absolute inset-0 rounded-full border-4 border-primary/10"></div>
 <div class="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
 <Lock class="w-6 h-6 text-primary animate-pulse" />
 </div>
 
 <div class="space-y-1.5">
 <h4 class="font-extrabold text-sm text-foreground">Securing B2B Payment Session</h4>
 <p class="text-xs text-muted-foreground animate-pulse font-semibold">
 {{ loaderText }}
 </p>
 </div>
 </div>

 <!-- STEP 4: TRANSACTION SUCCESS RECEIPT -->
 <div v-else-if="checkoutStep === 'success'" class="py-8 flex flex-col items-center justify-center space-y-5 text-center animate-in zoom-in-95 duration-300">
 <div class="w-16 h-16 bg-primary/10 text-primary rounded-full border border-primary/30 flex items-center justify-center shadow-none">
 <Check class="w-8 h-8 stroke-[3.5]" />
 </div>
 
 <div class="space-y-2">
 <h4 class="font-black text-lg text-foreground leading-tight">
 {{ activeOwnedMultiplier > 0 ? 'Subscription Updated Successfully!' : 'Add-on Activated Successfully!' }}
 </h4>
 <p class="text-xs text-muted-foreground max-w-sm leading-relaxed">
 We have authorized your subscription changes and updated your workspace allocations to <strong class="text-foreground ">{{ computedCreditsAllocated }}</strong>.
 </p>
 </div>

 <div class="w-full bg-muted/50 p-4 rounded-xl border text-left space-y-2.5 text-[11px] font-medium text-muted-foreground">
 <div class="flex justify-between">
 <span>{{ activeOwnedMultiplier > 0 ? 'Recurring Cost Rate:' : 'Payment Authorized:' }}</span>
 <span class="font-bold text-foreground font-mono">${{ computedPrice.toFixed(2) }} / mo</span>
 </div>
 <div class="flex justify-between">
 <span>Card Billed:</span>
 <span class="font-bold text-foreground font-mono">Corporate Visa (ending in 4242)</span>
 </div>
 <div class="flex justify-between border-t pt-2 text-[10px]">
 <span>Consolidated invoice date:</span>
 <span class="font-bold text-muted-foreground ">June 1st, 2026</span>
 </div>
 </div>

 <Button 
 size="sm"
 @click="isDetailsOpen = false"
 class="w-full rounded-xl cursor-pointer font-bold h-9 bg-primary hover:bg-primary/95 text-primary-foreground"
 >
 Return to Add-ons Dashboard
 </Button>
 </div>

 <!-- STEP 5: SAFETY DEACTIVATION SAFEGUARD -->
 <div v-else-if="checkoutStep === 'deactivate_confirm'" class="space-y-4 py-4 text-xs font-medium animate-in slide-in-from-left-3 duration-250">
 <div class="bg-destructive/100 border border-destructive/20 p-4 rounded-xl flex gap-3 text-destructive ">
 <Info class="w-5 h-5 shrink-0 mt-0.5 text-destructive" />
 <div class="space-y-1.5 leading-relaxed">
 <h4 class="font-extrabold text-destructive ">Critical Integration Risk Warning</h4>
 <p>
 Deactivating <strong class="font-black">{{ selectedAddon.name }}</strong> will pause automated CRM features, freeze sequence tasks, and block pipeline automations immediately at the end of the billing cycle.
 </p>
 </div>
 </div>

 <!-- Bulleted checklist of risks -->
 <div class="space-y-2.5 pl-1.5">
 <h4 class="font-extrabold text-foreground uppercase tracking-wider text-[10px]">Expected Workspace Impacts:</h4>
 <ul class="space-y-2 text-muted-foreground ">
 <li class="flex items-start gap-2">
 <span class="size-1.5 rounded-full bg-destructive/100 mt-1.5 shrink-0"></span>
 <span>All automated content sequences for {{ selectedAddon.name }} will freeze.</span>
 </li>
 <li class="flex items-start gap-2">
 <span class="size-1.5 rounded-full bg-destructive/100 mt-1.5 shrink-0"></span>
 <span>Collaborating workspace members will lose immediate access to active allocations.</span>
 </li>
 <li class="flex items-start gap-2">
 <span class="size-1.5 rounded-full bg-destructive/100 mt-1.5 shrink-0"></span>
 <span>Any custom models, IP addresses or configured pipelines will be scheduled for termination.</span>
 </li>
 </ul>
 </div>

 <!-- Mandatory Checked Box Friction -->
 <div class="p-3.5 bg-muted/50 rounded-xl border flex items-start gap-2.5">
 <input 
 v-model="deactivationChecked"
 id="deactivate-confirm-checkbox"
 type="checkbox" 
 class="w-4 h-4 rounded text-destructive focus:ring-destructive focus:ring-offset-0 bg-transparent border-border cursor-pointer mt-0.5"
 />
 <label for="deactivate-confirm-checkbox" class="text-[11px] text-muted-foreground font-semibold leading-normal cursor-pointer select-none">
 I understand the risks and authorize deactivating {{ selectedAddon.name }} along with scheduling all background pipelines for termination.
 </label>
 </div>

 <DialogFooter class="flex gap-2 border-t pt-4 mt-4">
 <Button 
 variant="outline" 
 size="sm" 
 @click="checkoutStep = 'configure'"
 class="rounded-xl border-border font-semibold cursor-pointer text-muted-foreground hover:bg-muted/50 h-9"
 >
 Back to Configuration
 </Button>
 
 <Button 
 size="sm"
 @click="confirmDeactivation"
 :disabled="!deactivationChecked"
 variant="destructive"
 class="rounded-xl px-4 cursor-pointer font-bold h-9 flex items-center gap-1.5"
 :class="{ 'opacity-50 cursor-not-allowed': !deactivationChecked }"
 >
 💀 Confirm Terminate Add-on
 </Button>
 </DialogFooter>
 </div>
 </DialogContent>
 </Dialog>

 <!-- DIALOG 3: Live Help / Chat Dialog -->
 <Dialog v-model:open="isChatOpen">
 <DialogContent class="bg-card border-border p-6 rounded-2xl max-w-sm">
 <DialogHeader class="space-y-1.5 pb-2 border-b ">
 <DialogTitle class="text-foreground font-bold tracking-tight text-lg flex items-center gap-2">
 <MessageSquare class="w-5 h-5 text-info" />
 RakanSales Support
 </DialogTitle>
 <DialogDescription class="text-xs text-muted-foreground">
 Let our account representatives assist you with details.
 </DialogDescription>
 </DialogHeader>

 <div class="py-4 text-center space-y-4 text-xs font-medium">
 <div class="w-12 h-12 bg-info/10 text-info rounded-full flex items-center justify-center mx-auto shadow-none">
 <MessageSquare class="w-6 h-6" />
 </div>
 
 <div class="space-y-1.5">
 <p class="text-foreground font-extrabold text-sm">Chat session initiating...</p>
 <p class="text-muted-foreground max-w-xs mx-auto leading-relaxed">
 We are connecting you to an active RakanSales accounts lead. Standard support hours: 9 AM - 6 PM (UTC+8).
 </p>
 </div>
 </div>

 <DialogFooter>
 <Button 
 size="sm" 
 @click="isChatOpen = false"
 class="w-full rounded-xl cursor-pointer font-bold bg-primary hover:bg-primary/90 text-primary-foreground h-9"
 >
 Acknowledge
 </Button>
 </DialogFooter>
 </DialogContent>
 </Dialog>

 <!-- DIALOG 4: Localized Usage Logs Timeline Pop-up Modal -->
 <Dialog v-model:open="isUsageLogsOpen">
 <DialogContent class="bg-card border-border p-6 rounded-2xl max-w-md animate-in fade-in zoom-in-95 duration-200">
 <DialogHeader class="space-y-1.5 pb-2 border-b ">
 <DialogTitle class="text-foreground font-bold tracking-tight text-lg flex items-center gap-2">
 <Info class="w-5 h-5 text-primary" />
 {{ selectedUsageCategory }} Audit Log
 </DialogTitle>
 <DialogDescription class="text-xs text-muted-foreground">
 Real-time audit record of credit transactions and background activities.
 </DialogDescription>
 </DialogHeader>

 <!-- Dynamic Allocation Reset Date Notification -->
 <div class="mt-3 p-3 bg-info/10 border border-info/20 rounded-xl flex items-center gap-2.5 text-info animate-in fade-in slide-in-from-top-1 duration-200">
 <CalendarDays class="w-4 h-4 text-info shrink-0" />
 <div class="text-[10px] leading-snug">
 <p class="font-extrabold uppercase tracking-wide">Next Limits Reset Cycle</p>
 <p class="font-bold text-info mt-0.5">June 1st, 2026 (Consolidated billing cycle resets in 13 days)</p>
 </div>
 </div>

 <!-- Dynamic Category-specific logs in timeline list -->
 <div class="py-4 space-y-4 max-h-64 overflow-y-auto pr-1">
 <div v-if="computedCategoryLogs.length === 0" class="text-center py-8 space-y-2">
 <Info class="w-8 h-8 text-muted-foreground mx-auto" />
 <p class="text-xs font-bold text-muted-foreground">No recent activities recorded</p>
 </div>

 <div v-else class="relative border-l border-border ml-3.5 space-y-5">
 <!-- Dynamic timeline node -->
 <div 
 v-for="log in computedCategoryLogs" 
 :key="log.id" 
 class="relative pl-6 animate-in slide-in-from-left-2 duration-200"
 >
 <!-- Glowing timeline node dot -->
 <span class="absolute -left-2.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-card border-2 border-primary">
 <span class="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
 </span>
 
 <div class="space-y-1">
 <div class="flex items-center justify-between gap-4">
 <p class="font-extrabold text-xs text-foreground ">{{ selectedUsageCategory }} Consumption</p>
 <span class="text-[9px] font-bold text-muted-foreground font-mono whitespace-nowrap bg-muted/50 border px-1.5 py-0.2 rounded">{{ log.time }}</span>
 </div>
 <p class="text-xs text-muted-foreground font-medium leading-relaxed">
 {{ log.message }}
 </p>
 </div>
 </div>
 </div>
 </div>

 <DialogFooter class="border-t pt-4">
 <Button 
 size="sm" 
 @click="isUsageLogsOpen = false"
 class="w-full rounded-xl cursor-pointer font-bold bg-primary hover:bg-primary/90 text-primary-foreground h-9"
 >
 Close History
 </Button>
 </DialogFooter>
 </DialogContent>
 </Dialog>

 <!-- Toast toaster registry -->
 <Toaster />
 </div>
</template>
