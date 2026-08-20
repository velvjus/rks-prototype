<script setup lang="ts">
import { ref, computed } from 'vue'

defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ (e: 'update:modelValue', val: boolean): void }>()
const close = () => emit('update:modelValue', false)

// Tab navigation: 0=Overview, 1=Workflow, 2=Reference
const currentStep = ref(0)
const totalSteps  = 3
const isOverview  = computed(() => currentStep.value === 0)
const isWorkflow  = computed(() => currentStep.value === 1)
const isReference = computed(() => currentStep.value === 2)

// Active chapter within the Reference tab (0=Header, 1=Filters, 2=Rows)
const activeChapter = ref(0)

// Carousel state — only active on Overview tab
const overviewSlide = ref(0)
const totalSlides   = 5
const isLastSlide   = computed(() => overviewSlide.value === totalSlides - 1)
const isLastStep    = computed(() => currentStep.value === totalSteps - 1)

const goNext = () => {
  if (isOverview.value) {
    if (!isLastSlide.value) { overviewSlide.value++ }
    else { currentStep.value++; overviewSlide.value = 0 }
  } else if (!isLastStep.value) {
    currentStep.value++
  } else {
    close()
  }
}

const goBack = () => {
  if (isOverview.value) {
    if (overviewSlide.value > 0) overviewSlide.value--
  } else {
    currentStep.value--
    if (currentStep.value === 0) overviewSlide.value = totalSlides - 1
  }
}

const canGoBack = computed(() => !(isOverview.value && overviewSlide.value === 0))

const nextLabel = computed(() => {
  if (isLastStep.value) return 'Got it!'
  if (isOverview.value && isLastSlide.value) return 'Workflow Guide →'
  if (isWorkflow.value) return 'See Reference'
  return 'Next'
})

// ─── Overview carousel steps ──────────────────────────────────────────────
const workflowSteps = [
  {
    number: '1',
    headline: 'Scan the badges, know the priority',
    body: 'Each row shows a badge on the right — <strong class="text-gray-800">Late</strong> = overdue, <strong class="text-gray-800">Reply</strong> = act now, <strong class="text-gray-800">Waiting</strong> = their turn. The count at the top shows total · unread.',
    imageSrc: '/guide/guide_01.png',
  },
  {
    number: '2',
    headline: 'Start every day with the Late filter',
    body: 'Tap <strong class="text-gray-800">Late</strong> in the quick filters to surface overdue conversations. Then work through <strong class="text-gray-800">Unread</strong>, <strong class="text-gray-800">Focus</strong>, and <strong class="text-gray-800">Pinned</strong> — in that order.',
    imageSrc: '/guide/guide_02.png',
  },
  {
    number: '3',
    headline: 'Filter down to what needs you',
    body: 'Switch to <strong class="text-gray-800">Mine</strong> in the inbox dropdown to narrow to your own queue. Combine with <strong class="text-gray-800">Late</strong> or <strong class="text-gray-800">Unread</strong> for a precise view of what needs action.',
    imageSrc: '/guide/guide_06.png',
  },
  {
    number: '4',
    headline: 'Pin vs. Focus — know the difference',
    body: '<strong class="text-gray-800">Pin</strong> keeps a thread at the top for the whole team to see. <strong class="text-gray-800">Focus</strong> is private — your personal bookmark to revisit a conversation later.',
    imageSrc: '/guide/guide_04.png',
  },
  {
    number: '5',
    headline: 'Leave the panel clean every day',
    body: 'Before signing off: clear your Late filter, tidy your Focus list, review pinned relevance, and make sure all your assigned threads are in the correct state.',
    imageSrc: '/guide/guide_09.png',
  },
]

const currentSlide = computed(() => workflowSteps[overviewSlide.value])

// ─── Workflow guide sections ───────────────────────────────────────────────
const workflowSections = [
  {
    icon: 'sunrise',
    label: 'Morning Triage',
    color: 'text-[#23B750]',
    bg: 'bg-[#23B750]/8',
    headline: 'Start your day in 3 minutes',
    body: 'Before jumping into replies, run through 5 quick steps: check the counter, hit Late first, then Unread, then Focus, then scan your Pinned conversations. This gives you a complete picture before you type a single word.',
    tip: 'Work Late before Unread — missed SLAs hurt more than new messages.',
    imageSrc: '/guide/guide_02.png',
    imageAlt: 'Morning triage 5-step checklist',
  },
  {
    icon: 'counter',
    label: 'The Counter',
    color: 'text-gray-600',
    bg: 'bg-gray-100',
    headline: 'Know your load at a glance',
    body: 'The pill counter beside "Conversations" tells you everything at once. The gray number is total active conversations. The red number is unread. Hover it for a detailed tooltip breakdown.',
    tip: null,
    imageSrc: '/guide/guide_01.png',
    imageAlt: 'Counter tooltip showing total active and unread',
  },
  {
    icon: 'reply',
    label: 'Handling Incoming',
    color: 'text-[#23B750]',
    bg: 'bg-[#23B750]/8',
    headline: 'The reply cycle',
    body: 'Open the conversation, read context, reply, then update the conversation state. If you can\'t reply right now — don\'t leave it and hope you remember. Right-click → Focus to bookmark it privately for later.',
    tip: null,
    imageSrc: '/guide/guide_03.png',
    imageAlt: 'Active conversation open in detail panel',
  },
  {
    icon: 'pin',
    label: 'Pin vs. Focus',
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    headline: 'Two tools, different purposes',
    body: 'Pin is visible to the whole team and keeps a conversation permanently at the top — use it for high-stakes, ongoing deals (limit: 10). Focus is private to you — use it as a personal follow-up bookmark with no limit.',
    tip: 'Rule of thumb: Pin is for team awareness. Focus is for your own list.',
    imageSrc: '/guide/guide_04.png',
    imageAlt: 'Pin vs Focus side-by-side comparison',
  },
  {
    icon: 'late',
    label: 'Managing Late',
    color: 'text-red-500',
    bg: 'bg-red-50',
    headline: 'How to clear your Late queue',
    body: 'Filter by Late to see all breached threads. Sort by Oldest to find the most overdue first. After replying, change the state back to Reply or None — this removes the Late badge and keeps the panel accurate for everyone.',
    tip: 'If you\'ve replied and are waiting on the customer, set state to None — don\'t leave it as Late.',
    imageSrc: '/guide/guide_05.png',
    imageAlt: 'Late filter selected with overdue conversations',
  },
  {
    icon: 'mine',
    label: 'Your Assigned Queue',
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    headline: 'Stay on top of Mine',
    body: 'Use the Mine scope (Inbox dropdown or quick filter chip) to narrow the panel to just your conversations. Build a rhythm: Morning = Mine + Unread. Midday = Mine + Late. End of day = Mine + Focus.',
    tip: null,
    imageSrc: '/guide/guide_06.png',
    imageAlt: 'Mine filter selected from inbox scope dropdown',
  },
  {
    icon: 'sections',
    label: 'Chronological Sections',
    color: 'text-gray-500',
    bg: 'bg-gray-100',
    headline: 'Use Today / Yesterday / Older wisely',
    body: 'These collapsible sections show conversation age at a glance. During busy periods, collapse Older to reduce noise. During quieter moments, use it for housekeeping — resolve stale threads or escalate anything sitting too long.',
    tip: null,
    imageSrc: '/guide/guide_07.png',
    imageAlt: 'Collapsible Today, Yesterday, Older sections',
  },
  {
    icon: 'rightclick',
    label: 'Right-Click Actions',
    color: 'text-gray-600',
    bg: 'bg-gray-100',
    headline: 'Act without opening the thread',
    body: 'Right-clicking any conversation gives you instant access to Focus, Pin, Mark as Read, Assign, Resolve, and Delete — without ever loading the full thread. This is the fastest way to triage at volume.',
    tip: null,
    imageSrc: '/guide/guide_08.png',
    imageAlt: 'Right-click context menu with all actions',
  },
  {
    icon: 'eod',
    label: 'End of Day',
    color: 'text-[#23B750]',
    bg: 'bg-[#23B750]/8',
    headline: 'Leave the panel clean',
    body: 'Before signing off: clear Late, tidy Focus, review Pinned for relevance, and ensure all assigned threads are in the correct state. A clean panel means you — or a teammate covering you — can pick up clearly tomorrow.',
    tip: null,
    imageSrc: '/guide/guide_09.png',
    imageAlt: 'End of day checklist card',
  },
  {
    icon: 'admin',
    label: 'Admin Oversight',
    color: 'text-violet-500',
    bg: 'bg-violet-50',
    headline: 'Manage the team queue',
    body: 'Set Inbox scope to All. Filter by Late to find SLA breaches and who owns them. Sort by Oldest to spot untouched threads. Use the Assignee filter to check individual agent load. Reassign or escalate as needed.',
    tip: 'Use Bulk Select to reassign high volumes of unassigned conversations in one action.',
    imageSrc: '/guide/guide_10.png',
    imageAlt: 'Admin view with Late filter and team assignments',
  },
  {
    icon: 'loop',
    label: 'The Daily Loop',
    color: 'text-[#23B750]',
    bg: 'bg-[#23B750]/8',
    headline: 'Morning → Day → Night → repeat',
    body: 'The panel is designed around a daily rhythm. Morning triage sets you up. During the day you react, reply, and bookmark with Focus. End of day you close the loop. Stick to this cycle and nothing falls through the cracks.',
    tip: null,
    imageSrc: '/guide/guide_11.png',
    imageAlt: 'The daily loop — morning, during the day, end of day',
  },
]

// ─── Reference chapter (Conversation Rows only) ──────────────────────────────────
const referenceChapter = {
  title: 'Conversation Rows', subtitle: 'Badges, labels & quick actions',
  items: [
    { icon: 'avatar',        label: 'Avatar & Online Dot',       description: 'Green dot = contact online. Hover avatar to reveal multi-select checkbox.' },
    { icon: 'platform',      label: 'Platform Icon',             description: 'Shows the channel — WhatsApp, LinkedIn, Instagram, Email, etc.' },
    { icon: 'vip',           label: 'Crown = VIP',               description: 'Purple crown marks a VIP contact. Right-click any row to set or clear.' },
    { icon: 'priority',      label: 'Triangle = Priority',       description: 'Red = High, Amber = Medium, Gray = Low priority.' },
    { icon: 'late-chip',     label: 'Late badge',                description: 'Red pill — response deadline exceeded. Clear by replying and updating state.' },
    { icon: 'reply-chip',    label: 'Focus badge',               description: 'Blue pill — you have privately bookmarked this thread. Only visible to you.' },
    { icon: 'badge',         label: 'Work-State Badge',          description: 'Reply = needs response. Waiting = their turn. zZ = snoozed. AI = AI has acted.' },
    { icon: 'unread-bubble', label: 'Unread Count Bubble',       description: 'Green = new unread messages. Gray = muted thread.' },
    { icon: 'hover',         label: 'Right-Click Menu',          description: 'Right-click any row: Open, Mark Read/Unread, Focus, Pin, Assign, Resolve, Delete.' },
    { icon: 'count',         label: 'Pinned Section',            description: 'Up to 10 pinned conversations stay at the top. Counter shows X/10 remaining.' },
    { icon: 'title',         label: 'Today / Yesterday / Older', description: 'Collapsible time sections. Click the header to collapse and reduce visual noise.' },
  ]
}

const steps = [
  { id: 'overview',  title: 'Overview',  isReference: false, isWorkflow: false },
  { id: 'workflow',  title: 'Workflow',  isReference: false, isWorkflow: true  },
  { id: 'reference', title: 'Reference', isReference: true,  isWorkflow: false },
]

const currentRefChapter = computed(() => referenceChapter)
</script>

<template>
  <Teleport to="body">
    <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100"
                leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="modelValue" class="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/30 backdrop-blur-[2px]" @click="close" />

        <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 scale-95 translate-y-2"
                    enter-to-class="opacity-100 scale-100 translate-y-0" leave-active-class="transition duration-150 ease-in"
                    leave-from-class="opacity-100 scale-100 translate-y-0" leave-to-class="opacity-0 scale-95 translate-y-2" appear>
          <div v-if="modelValue" class="relative bg-white rounded-2xl shadow-2xl border border-gray-150 w-full max-w-[720px] flex flex-col overflow-hidden" style="height: min(640px, 92vh);">

            <!-- ── Modal Header ─────────────────────────────────────────── -->
            <div class="flex items-start justify-between px-7 pt-6 pb-0 shrink-0">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-[#23B750]/10 flex items-center justify-center shrink-0">
                  <svg class="w-[18px] h-[18px] text-[#23B750]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
                  </svg>
                </div>
                <div>
                  <p class="text-[10px] font-bold text-[#23B750] uppercase tracking-widest leading-none mb-0.5">How to Use</p>
                  <h2 class="text-[17px] font-extrabold text-gray-900 leading-tight tracking-tight">Omnichannel Conversations</h2>
                </div>
              </div>
              <button @click="close" class="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all cursor-pointer outline-none shrink-0 mt-0.5">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <!-- ── Step Tabs ─────────────────────────────────────────────── -->
            <div class="flex items-center gap-1 px-7 pt-5 pb-0 shrink-0 flex-wrap">
              <button v-for="(step, idx) in steps" :key="step.id" @click="currentStep = idx; overviewSlide = 0"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer outline-none border"
                :class="[currentStep===idx ? 'bg-[#23B750]/10 text-[#23B750] border-[#23B750]/25' : idx<currentStep ? 'bg-gray-50 text-gray-500 border-gray-150 hover:bg-gray-100' : 'bg-white text-gray-400 border-gray-150 hover:bg-gray-50']">
                <span class="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-extrabold shrink-0"
                  :class="[currentStep===idx ? 'bg-[#23B750] text-white' : idx<currentStep ? 'bg-gray-400 text-white' : 'bg-gray-200 text-gray-500']">
                  <svg v-if="idx<currentStep" class="w-2.5 h-2.5 stroke-current stroke-[3]" fill="none" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                  <span v-else>{{ idx+1 }}</span>
                </span>
                {{ step.title }}
              </button>
            </div>

            <div class="h-px bg-gray-100 mx-7 mt-4 shrink-0" />

            <!-- ── Content ──────────────────────────────────────────────── -->
            <div class="flex-1 min-h-0 overflow-hidden flex flex-col">

              <!-- ══ OVERVIEW CAROUSEL ══════════════════════════════════════ -->
              <div v-if="isOverview" class="flex-1 flex overflow-hidden">
                <!-- Left: Image panel -->
                <div class="w-[52%] shrink-0 bg-gray-50 border-r border-gray-100 flex items-center justify-center p-5 relative overflow-hidden">
                  <Transition
                    enter-active-class="transition duration-300 ease-out"
                    enter-from-class="opacity-0 translate-x-3"
                    enter-to-class="opacity-100 translate-x-0"
                    leave-active-class="transition duration-200 ease-in"
                    leave-from-class="opacity-100 translate-x-0"
                    leave-to-class="opacity-0 -translate-x-3"
                    mode="out-in"
                  >
                    <img
                      :key="overviewSlide"
                      :src="currentSlide.imageSrc"
                      :alt="currentSlide.headline"
                      class="w-full h-full object-contain object-top rounded-lg"
                      style="max-height: 340px;"
                      draggable="false"
                    />
                  </Transition>
                </div>

                <!-- Right: Text panel -->
                <div class="flex-1 flex flex-col justify-between px-7 py-6 overflow-y-auto">
                  <div>
                    <div class="flex items-center gap-2 mb-5">
                      <span class="w-7 h-7 rounded-full bg-[#23B750] text-white text-[11px] font-extrabold flex items-center justify-center shrink-0 shadow-sm">
                        {{ currentSlide.number }}
                      </span>
                      <span class="text-[10.5px] text-gray-400 font-semibold tracking-wide">
                        Step {{ currentSlide.number }} of {{ totalSlides }}
                      </span>
                    </div>

                    <h3 class="text-[15px] font-extrabold text-gray-900 leading-snug mb-3">{{ currentSlide.headline }}</h3>
                    <p class="text-[12.5px] text-gray-500 leading-relaxed" v-html="currentSlide.body" />
                  </div>

                  <!-- Slide dots -->
                  <div class="flex items-center gap-1.5 mt-6">
                    <button
                      v-for="(_, idx) in workflowSteps"
                      :key="idx"
                      @click="overviewSlide = idx"
                      class="rounded-full transition-all duration-200 cursor-pointer outline-none"
                      :class="[overviewSlide===idx ? 'w-5 h-2 bg-[#23B750]' : 'w-2 h-2 bg-gray-200 hover:bg-gray-300']"
                    />
                  </div>

                  <p class="text-[10.5px] text-gray-400 mt-4 leading-snug">
                    See the <span class="font-semibold text-gray-500">Workflow</span> tab for a full day-by-day productivity guide.
                  </p>
                </div>
              </div>

              <!-- ══ WORKFLOW GUIDE ══════════════════════════════════════════ -->
              <div v-else-if="isWorkflow" class="flex-1 overflow-y-auto">
                <!-- Section intro -->
                <div class="px-7 pt-5 pb-3 shrink-0 border-b border-gray-100 bg-gradient-to-r from-[#23B750]/5 to-transparent">
                  <h3 class="text-[14px] font-extrabold text-gray-900">How to stay productive, every day</h3>
                  <p class="text-[11.5px] text-gray-500 mt-0.5">A step-by-step guide to working the panel — not your memory.</p>
                </div>

                <!-- Workflow sections feed -->
                <div class="px-7 py-4 flex flex-col gap-7">
                  <div
                    v-for="(section, idx) in workflowSections"
                    :key="idx"
                    class="flex flex-col gap-3"
                  >
                    <!-- Section header -->
                    <div class="flex items-center gap-2">
                      <span class="w-5 h-5 rounded-full bg-gray-900 text-white text-[9px] font-extrabold flex items-center justify-center shrink-0">{{ idx + 1 }}</span>
                      <span :class="['text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-md', section.color, section.bg]">{{ section.label }}</span>
                    </div>

                    <!-- Side-by-side card: image left, text right -->
                    <div class="flex gap-4 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 min-h-[200px]">

                      <!-- Image — 55% width, fills height -->
                      <div class="w-[55%] shrink-0 bg-white border-r border-gray-100 flex items-center justify-center overflow-hidden p-3">
                        <img
                          :src="section.imageSrc"
                          :alt="section.imageAlt"
                          class="w-full h-full object-contain object-center"
                          style="max-height: 280px;"
                          draggable="false"
                        />
                      </div>

                      <!-- Text — right side -->
                      <div class="flex-1 flex flex-col justify-center py-4 pr-4">
                        <h4 class="text-[13px] font-extrabold text-gray-900 mb-2 leading-snug">{{ section.headline }}</h4>
                        <p class="text-[11.5px] text-gray-500 leading-relaxed">{{ section.body }}</p>

                        <!-- Tip -->
                        <div v-if="section.tip" class="mt-3 flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                          <svg class="w-3 h-3 text-amber-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                          <p class="text-[11px] text-amber-700 leading-relaxed font-medium">{{ section.tip }}</p>
                        </div>
                      </div>

                    </div>

                    <!-- Divider (not last) -->
                    <div v-if="idx < workflowSections.length - 1" class="h-px bg-gray-100 mt-1" />
                  </div>

                  <!-- Bottom padding -->
                  <div class="h-4" />
                </div>
              </div>

              <!-- ══ REFERENCE (single chapter, no sidebar) ══════════════════ -->
              <div v-else-if="isReference" class="flex-1 overflow-y-auto p-5">

                <!-- Heading -->
                <div class="mb-4">
                  <span class="inline-flex items-center gap-1 text-[9px] font-bold text-gray-400 uppercase tracking-widest bg-gray-100 px-2 py-1 rounded-md mb-1.5">
                    <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                    Reference
                  </span>
                  <h3 class="text-[14px] font-extrabold text-gray-900 leading-tight">{{ currentRefChapter.title }}</h3>
                  <p class="text-[11.5px] text-gray-500 mt-0.5">{{ currentRefChapter.subtitle }}</p>
                </div>

                <!-- 2-column items grid -->
                <div class="grid grid-cols-2 gap-2">
                  <div
                    v-for="item in currentRefChapter.items"
                    :key="item.label"
                    class="flex items-start gap-2.5 p-3 rounded-xl border border-gray-100 bg-gray-50/70 hover:bg-gray-50 hover:border-gray-200 transition-colors group"
                  >
                    <div class="w-7 h-7 rounded-lg bg-white border border-gray-150 flex items-center justify-center shrink-0 mt-0.5 group-hover:border-gray-250 transition-colors">
                      <svg v-if="item.icon==='title'"        class="w-3 h-3 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                      <svg v-else-if="item.icon==='count'"   class="w-3 h-3 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      <svg v-else-if="item.icon==='search'"  class="w-3 h-3 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                      <svg v-else-if="item.icon==='inbox'"   class="w-3 h-3 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      <svg v-else-if="item.icon==='reply-chip'"  class="w-3 h-3 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      <svg v-else-if="item.icon==='late-chip'"   class="w-3 h-3 text-[#EF4444]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      <svg v-else-if="item.icon==='sort'"    class="w-3 h-3 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="9" y1="18" x2="15" y2="18"/></svg>
                      <svg v-else-if="item.icon==='avatar'"  class="w-3 h-3 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/></svg>
                      <svg v-else-if="item.icon==='platform'" class="w-3 h-3 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.455L0 24z"/></svg>
                      <svg v-else-if="item.icon==='vip'"     class="w-3 h-3 text-[#9F5CF8]" viewBox="0 0 24 24" fill="currentColor"><path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5ZM19 19C19 19.55 18.55 20 18 20H6C5.45 20 5 19.55 5 19V18H19V19Z"/></svg>
                      <svg v-else-if="item.icon==='priority'" class="w-3 h-3 text-[#EF4444]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                      <svg v-else-if="item.icon==='badge'"   class="w-3 h-3 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="8" width="20" height="8" rx="4"/><line x1="7" y1="12" x2="7.01" y2="12" stroke-width="3"/></svg>
                      <svg v-else-if="item.icon==='hover'"   class="w-3 h-3 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/><circle cx="5" cy="12" r="1.5"/></svg>
                      <svg v-else-if="item.icon==='unread-bubble'" class="w-3 h-3 text-[#23B750]" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="8"/></svg>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-[11px] font-bold text-gray-900 leading-tight mb-0.5 tracking-tight">{{ item.label }}</p>
                      <p class="text-[10.5px] text-gray-500 leading-relaxed">{{ item.description }}</p>
                    </div>
                  </div>
                </div>

              </div>

            </div><!-- end content -->

            <div class="h-px bg-gray-100 mx-7 shrink-0" />

            <!-- ── Footer ──────────────────────────────────────────────── -->
            <div class="flex items-center justify-between px-7 py-4 shrink-0">
              <div class="flex items-center gap-3">
                <span class="text-[11px] text-gray-400 font-medium tabular-nums" v-if="isOverview">
                  {{ overviewSlide + 1 }} / {{ totalSlides }} steps
                </span>
                <span class="text-[11px] text-gray-400 font-medium" v-else-if="isWorkflow">
                  {{ workflowSections.length }} sections
                </span>
                <span class="text-[11px] text-gray-400 font-medium" v-else-if="isReference">
                  {{ currentRefChapter.items.length }} items
                </span>
              </div>

              <div class="flex items-center gap-2">
                <button v-if="canGoBack" @click="goBack"
                  class="px-4 py-2 text-[12px] font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all cursor-pointer outline-none border border-gray-200">
                  Back
                </button>
                <button @click="goNext"
                  class="px-5 py-2 text-[12px] font-bold rounded-lg transition-all cursor-pointer outline-none flex items-center gap-1.5 active:scale-95"
                  :class="[isLastStep ? 'bg-[#23B750] text-white hover:bg-[#1fa344]' : 'bg-gray-900 text-white hover:bg-gray-800']">
                  <span>{{ nextLabel }}</span>
                  <svg v-if="!isLastStep" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  <svg v-if="isLastStep" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </button>
              </div>
            </div>

          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
