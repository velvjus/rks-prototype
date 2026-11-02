<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { Button } from '@/components/ui/button';
import {
 Calendar as CalendarIcon,
 MessageSquare,
 Clock,
 Settings as SettingsIcon,
 Check,
 Copy,
 Plus,
 RefreshCw,
 Video,
 Globe,
 Sparkles,
 Phone,
 ArrowRight,
 User,
 Bot
} from 'lucide-vue-next';

// Setup Panel Form State
const meetingName = ref('1-on-1 Product Demo');
const duration = ref(30);
const locationType = ref('zoom');
const timezone = ref('Asia/Kuala_Lumpur (GMT+8)');
const selectedDays = ref(['mon', 'tue', 'wed', 'thu', 'fri']);
const startTime = ref('09:00');
const endTime = ref('17:00');
const isAiEnabled = ref(true);
const aiSystemPrompt = ref(
 'Greet the client, inquire about their primary goals for the CRM demo, and then offer available slots for next Tuesday or Thursday. Upon slot selection, collect their name and email, and finalize the calendar booking.'
);

// Copy Link helper
const copySuccess = ref(false);
const shareableLink = computed(() => {
 const slug = meetingName.value.toLowerCase().replace(/[^a-z0-9]+/g, '-');
 return `https://rakansales.com/book/${slug || 'meeting'}`;
});

function copyLink() {
 navigator.clipboard.writeText(shareableLink.value);
 copySuccess.value = true;
 setTimeout(() => {
 copySuccess.value = false;
 }, 2000);
}

// Chat Simulator State
interface Message {
 id: string;
 sender: 'agent' | 'client';
 type: 'text' | 'slots' | 'form' | 'success';
 text: string;
 options?: string[];
 slots?: string[];
}

const chatMessages = ref<Message[]>([]);
const isTyping = ref(false);
const simStep = ref(0);
const clientForm = ref({ name: '', email: '' });
const selectedTimeSlot = ref('');
const isSimComplete = ref(false);

// Generate list of slots dynamically based on setup time
const availableSlots = computed(() => {
 return ['09:30 AM', '10:00 AM', '11:30 AM', '02:30 PM'];
});

// Initialize simulation
function initSimulation() {
 simStep.value = 0;
 isSimComplete.value = false;
 clientForm.value = { name: '', email: '' };
 selectedTimeSlot.value = '';
 chatMessages.value = [
 {
 id: 'm1',
 sender: 'agent',
 type: 'text',
 text: `Hello! Welcome to RakanSales. How can I help you today?`,
 options: ['📅 Book an Appointment', '💬 Make an Enquiry']
 }
 ];
}

// Handle client option selection
function selectOption(optionText: string) {
 // Add client message
 chatMessages.value.push({
 id: 'c-' + Date.now(),
 sender: 'client',
 type: 'text',
 text: optionText
 });
 
 // Clear options from last agent message
 if (chatMessages.value.length >= 2) {
 const prevAgentMsg = chatMessages.value[chatMessages.value.length - 2];
 if (prevAgentMsg && prevAgentMsg.sender === 'agent') {
 prevAgentMsg.options = [];
 }
 }

 isTyping.value = true;
 
 setTimeout(() => {
 isTyping.value = false;
 
 // Check option values to branch flows
 if (optionText.includes('Book an Appointment') || optionText.includes('Yes, book a demo') || optionText.includes('appointment instead')) {
 simStep.value = 10; // Start booking flow
 chatMessages.value.push({
 id: 'a-' + Date.now(),
 sender: 'agent',
 type: 'text',
 text: `Hi there! I am Justin's scheduling assistant. I can help you book a ${meetingName.value} (${duration.value} mins). What day works best for you next week?`,
 options: ['Next Tuesday morning (July 14)', 'Next Thursday afternoon (July 16)', 'Check all availability']
 });
 } else if (optionText.includes('Make an Enquiry') || optionText.includes('Back to enquiries')) {
 simStep.value = 20; // Start enquiry flow
 chatMessages.value.push({
 id: 'a-' + Date.now(),
 sender: 'agent',
 type: 'text',
 text: `Certainly! I'd be happy to help answer your questions about RakanSales. What would you like to know?`,
 options: ['What are your pricing plans?', 'Do you support custom integrations?', 'I\'m ready to book an appointment instead']
 });
 } else if (optionText.includes('pricing plans')) {
 chatMessages.value.push({
 id: 'a-' + Date.now(),
 sender: 'agent',
 type: 'text',
 text: `RakanSales offers three main plans tailored to your growth:\n\n• Starter: $49/mo (up to 3 users, core pipelines)\n• Professional: $129/mo (unlimited contacts, automation macros)\n• Enterprise: Custom pricing (advanced AI training hub, custom SLAs)\n\nWould you like to book a demo to explore these features?`,
 options: ['📅 Yes, book a demo', '⬅️ Back to enquiries']
 });
 } else if (optionText.includes('custom integrations')) {
 chatMessages.value.push({
 id: 'a-' + Date.now(),
 sender: 'agent',
 type: 'text',
 text: `Yes, we support extensive integrations! Out of the box, you can connect RakanSales with WhatsApp Business, Telegram, Facebook Messenger, Slack, and Gmail. We also provide full REST APIs and webhooks for custom developments.\n\nWould you like to schedule a product demo with our integration engineer?`,
 options: ['📅 Yes, book a demo', '⬅️ Back to enquiries']
 });
 } else {
 // Proceeding with booking sub-steps
 if (simStep.value === 10) {
 const selectedDayName = optionText.includes('Tuesday') ? 'Tuesday, July 14' : 'Thursday, July 16';
 simStep.value = 11; // Move to slots picker
 chatMessages.value.push({
 id: 'a-' + Date.now(),
 sender: 'agent',
 type: 'slots',
 text: `Great choice! Here are the open slots I found for ${selectedDayName}, 2026 (in your local timezone, ${timezone.value.split(' ')[0]}):`,
 slots: availableSlots.value
 });
 }
 }
 }, 1000);
}

// Handle slot pick
function pickSlot(slot: string) {
 selectedTimeSlot.value = slot;
 
 // Add client message showing selection
 chatMessages.value.push({
 id: 'c-' + Date.now(),
 sender: 'client',
 type: 'text',
 text: `I'll book the ${slot} slot.`
 });

 isTyping.value = true;
 simStep.value = 12; // Move to form step

 setTimeout(() => {
 isTyping.value = false;
 chatMessages.value.push({
 id: 'a-' + Date.now(),
 sender: 'agent',
 type: 'form',
 text: `Excellent. Let's reserve that slot: Tuesday, July 14 at ${slot}. Please fill in your name and email to finalize the booking.`
 });
 }, 1000);
}

// Handle booking confirmation submit
function confirmBooking() {
 if (!clientForm.value.name || !clientForm.value.email) return;

 // Add client message
 chatMessages.value.push({
 id: 'c-' + Date.now(),
 sender: 'client',
 type: 'text',
 text: `Confirming details: ${clientForm.value.name} (${clientForm.value.email})`
 });

 isTyping.value = true;
 
 setTimeout(() => {
 isTyping.value = false;
 isSimComplete.value = true;
 
 const locName = locationType.value === 'zoom' ? 'Zoom Call' : (locationType.value === 'meet' ? 'Google Meet' : 'Phone Call');
 chatMessages.value.push({
 id: 'a-' + Date.now(),
 sender: 'agent',
 type: 'success',
 text: `🎉 Booking Confirmed!\n\nYou're all set! I've scheduled your ${meetingName.value} with Justin for Tuesday, July 14 at ${selectedTimeSlot.value}. A calendar invite containing the ${locName} link has been sent to ${clientForm.value.email}.`
 });
 }, 1200);
}

// Watch name or duration changes to reset simulation greeting context
watch([meetingName, duration], () => {
 initSimulation();
});

onMounted(() => {
 initSimulation();
});
</script>

<template>
 <div class="space-y-6">
 <!-- Header -->
 <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
 <div>
 <h1 class="text-3xl font-extrabold tracking-tight text-foreground">Appointments Panel</h1>
 <p class="text-sm text-muted-foreground mt-1">Configure automated scheduling and test the interactive booking assistant flow.</p>
 </div>
 <div class="flex items-center gap-2">
 <Button variant="outline" @click="initSimulation" class="gap-1.5 border-border rounded-xl font-semibold hover:bg-muted/50 text-xs shadow-sm bg-card cursor-pointer py-2">
 <RefreshCw class="w-3.5 h-3.5" />
 Reset Chat Demo
 </Button>
 </div>
 </div>

 <!-- Main Two-Column Layout -->
 <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
 
 <!-- LEFT COLUMN: Automated Setup Panel -->
 <div class="lg:col-span-5 space-y-6">
 
 <!-- Section 1: Meeting Definition -->
 <div class="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
 <h2 class="text-sm font-extrabold text-foreground flex items-center gap-2 pb-3 border-b border-border">
 <SettingsIcon class="w-4 h-4 text-primary" />
 Scheduling Rules Setup
 </h2>

 <!-- Event Name -->
 <div class="space-y-1.5">
 <label class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Meeting Name</label>
 <input
 v-model="meetingName"
 type="text"
 class="w-full px-3.5 py-2 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-muted/40 font-medium text-foreground"
 />
 </div>

 <!-- Duration and Location -->
 <div class="grid grid-cols-2 gap-4">
 <div class="space-y-1.5">
 <label class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Duration</label>
 <select
 v-model="duration"
 class="w-full px-3.5 py-2 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-card font-medium text-foreground"
 >
 <option :value="15">15 minutes</option>
 <option :value="30">30 minutes</option>
 <option :value="45">45 minutes</option>
 <option :value="60">60 minutes</option>
 </select>
 </div>
 <div class="space-y-1.5">
 <label class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Location</label>
 <select
 v-model="locationType"
 class="w-full px-3.5 py-2 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-card font-medium text-foreground"
 >
 <option value="zoom">Zoom Video</option>
 <option value="meet">Google Meet</option>
 <option value="phone">Phone Call</option>
 </select>
 </div>
 </div>

 <!-- Share Link Block -->
 <div class="space-y-1.5 pt-2">
 <label class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Shareable Booking Link</label>
 <div class="flex gap-2">
 <input
 type="text"
 readonly
 :value="shareableLink"
 class="flex-1 px-3.5 py-2 text-xs border border-border rounded-xl bg-muted/50 text-muted-foreground outline-none select-all truncate"
 />
 <button
 @click="copyLink"
 class="px-3 py-2 border border-border rounded-xl hover:bg-muted/50 text-muted-foreground transition-colors bg-card flex items-center justify-center cursor-pointer shadow-sm min-w-[40px]"
 title="Copy Link"
 >
 <Check v-if="copySuccess" class="w-4 h-4 text-primary animate-in fade-in duration-200" />
 <Copy v-else class="w-4 h-4" />
 </button>
 </div>
 </div>
 </div>

 <!-- Section 2: Availability Calendar Setup -->
 <div class="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
 <h2 class="text-sm font-extrabold text-foreground flex items-center gap-2 pb-3 border-b border-border">
 <Clock class="w-4 h-4 text-primary" />
 Weekly Time Windows
 </h2>

 <div class="space-y-1.5">
 <label class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Timezone</label>
 <div class="flex items-center gap-2 px-3 py-1.5 bg-muted/50 border border-border rounded-xl text-xs text-muted-foreground font-medium">
 <Globe class="w-3.5 h-3.5 text-muted-foreground" />
 {{ timezone }}
 </div>
 </div>

 <!-- Weekly availability days -->
 <div class="space-y-2">
 <label class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Available Days</label>
 <div class="flex gap-1.5 justify-between">
 <button
 v-for="day in ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']"
 :key="day"
 @click="selectedDays.includes(day) ? selectedDays = selectedDays.filter(d => d !== day) : selectedDays.push(day)"
 class="w-8 h-8 rounded-full border text-xs font-bold flex items-center justify-center uppercase transition-all cursor-pointer shadow-sm"
 :class="selectedDays.includes(day) ? 'bg-primary/10 border-primary text-primary font-extrabold' : 'bg-card border-border text-muted-foreground hover:bg-muted'"
 >
 {{ day[0] }}
 </button>
 </div>
 </div>

 <!-- Hours range -->
 <div class="grid grid-cols-2 gap-4">
 <div class="space-y-1.5">
 <label class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Daily Start</label>
 <input
 v-model="startTime"
 type="time"
 class="w-full px-3.5 py-2 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-card font-medium text-foreground"
 />
 </div>
 <div class="space-y-1.5">
 <label class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Daily End</label>
 <input
 v-model="endTime"
 type="time"
 class="w-full px-3.5 py-2 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-card font-medium text-foreground"
 />
 </div>
 </div>
 </div>

 <!-- Section 3: AI Assistant Behavior -->
 <div class="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
 <div class="flex items-center justify-between pb-3 border-b border-border">
 <h2 class="text-sm font-extrabold text-foreground flex items-center gap-2">
 <Sparkles class="w-4 h-4 text-primary" />
 AI Chat Scheduler
 </h2>
 <label class="relative inline-flex items-center cursor-pointer">
 <input type="checkbox" v-model="isAiEnabled" class="sr-only peer" />
 <div class="w-9 h-5 bg-input peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-primary-foreground after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-card after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
 </label>
 </div>

 <div v-if="isAiEnabled" class="space-y-3 animate-in fade-in duration-200">
 <div class="space-y-1.5">
 <label class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Assistant System Prompt</label>
 <textarea
 v-model="aiSystemPrompt"
 rows="4"
 class="w-full px-3.5 py-2 text-xs border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-muted/40 text-muted-foreground leading-relaxed font-medium"
 ></textarea>
 </div>
 <p class="text-[10px] text-muted-foreground leading-normal flex items-start gap-1 font-medium">
 <span>ℹ️</span>
 This system instruction dictates how the AI agent qualifies clients and proposes open appointments in the chat.
 </p>
 </div>
 <div v-else class="py-6 text-center text-xs text-muted-foreground italic">
 AI scheduler is disabled. Clients will see a standard calendar grid.
 </div>
 </div>

 </div>

 <!-- RIGHT COLUMN: Client Booking Chat Simulation -->
 <div class="lg:col-span-7 flex flex-col">
 <div class="bg-card border border-border rounded-2xl shadow-sm flex-1 flex flex-col overflow-hidden min-h-[580px] lg:max-h-[640px]">
 
 <!-- Simulator Header -->
 <div class="p-4 border-b border-border bg-muted/50 flex items-center justify-between">
 <div class="flex items-center gap-2">
 <span class="w-2.5 h-2.5 rounded-full bg-primary animate-ping"></span>
 <span class="text-xs font-extrabold text-foreground uppercase tracking-wider">Live Booking Simulator</span>
 </div>
 <div class="text-[10px] text-muted-foreground font-bold bg-card px-2 py-0.5 rounded border border-border shadow-sm">
 Client Perspective
 </div>
 </div>

 <!-- Chat Window Body -->
 <div class="flex-1 p-5 overflow-y-auto bg-muted/30 space-y-4 custom-scrollbar flex flex-col justify-end">
 
 <div v-for="msg in chatMessages" :key="msg.id" class="space-y-2">
 <!-- Text Message Bubble -->
 <div class="flex flex-col" :class="msg.sender === 'client' ? 'items-end' : 'items-start'">
 <div class="flex items-start gap-2.5 max-w-[80%]" :class="msg.sender === 'client' ? 'flex-row-reverse' : 'flex-row'">
 
 <!-- Avatar -->
 <div class="w-7 h-7 rounded-full flex items-center justify-center shrink-0 border shadow-sm"
 :class="msg.sender === 'agent' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-info/10 border-info/20 text-info'"
 >
 <Bot v-if="msg.sender === 'agent'" class="w-4 h-4" />
 <User v-else class="w-4 h-4" />
 </div>

 <!-- Bubble -->
 <div class="rounded-2xl px-4 py-2.5 text-sm shadow-xs"
 :class="msg.sender === 'agent' 
 ? 'bg-card border border-border/80 text-foreground' 
 : 'bg-primary text-primary-foreground font-medium'"
 >
 <p class="whitespace-pre-line leading-relaxed">{{ msg.text }}</p>
 </div>
 </div>
 </div>

 <!-- Interactive Widgets (Right Aligned Client Actions) -->
 <!-- Dynamic Block: Option Buttons -->
 <div v-if="msg.options && msg.options.length" class="flex flex-col items-end pl-9 animate-in fade-in duration-200">
 <div class="w-[80%] max-w-sm space-y-2">
 <button
 v-for="opt in msg.options"
 :key="opt"
 @click="selectOption(opt)"
 class="w-full text-left px-3.5 py-2.5 text-xs font-bold text-primary bg-card hover:bg-primary/10 rounded-xl border border-primary/20 shadow-xs transition-all cursor-pointer flex items-center justify-between hover:scale-[1.01]"
 >
 {{ opt }}
 <ArrowRight class="w-3.5 h-3.5 text-primary" />
 </button>
 </div>
 </div>

 <!-- Dynamic Block: Time Slot Picker -->
 <div v-if="msg.slots && msg.slots.length && !selectedTimeSlot" class="flex flex-col items-end pl-9 animate-in fade-in duration-200">
 <div class="w-[80%] max-w-sm bg-card border border-primary/20 rounded-2xl p-4 shadow-sm space-y-3">
 <div class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Select an open slot</div>
 <div class="grid grid-cols-2 gap-2">
 <button
 v-for="slot in msg.slots"
 :key="slot"
 @click="pickSlot(slot)"
 class="px-2.5 py-2 text-xs font-bold border border-border text-foreground hover:text-primary hover:bg-primary/10 bg-card rounded-lg text-center transition-all cursor-pointer hover:scale-[1.02]"
 >
 {{ slot }}
 </button>
 </div>
 </div>
 </div>

 <!-- Dynamic Block: Contact Details Form -->
 <div v-if="msg.type === 'form' && !isSimComplete" class="flex flex-col items-end pl-9 animate-in fade-in duration-200">
 <div class="w-[80%] max-w-sm bg-card border border-primary/20 rounded-2xl p-4 shadow-sm space-y-3.5">
 <div class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Your Booking Info</div>
 <div class="space-y-2.5">
 <div class="space-y-1">
 <label class="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">Full Name</label>
 <input
 v-model="clientForm.name"
 type="text"
 placeholder="John Doe"
 autocomplete="new-password"
 class="w-full px-3 py-1.5 text-xs border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary bg-muted/40 font-medium"
 />
 </div>
 <div class="space-y-1">
 <label class="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">Email Address</label>
 <input
 v-model="clientForm.email"
 type="text"
 placeholder="johndoe@example.com"
 autocomplete="new-password"
 class="w-full px-3 py-1.5 text-xs border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary bg-muted/40 font-medium"
 />
 </div>
 </div>
 <button
 @click="confirmBooking"
 :disabled="!clientForm.name || !clientForm.email"
 class="w-full py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-xs font-bold transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none hover:scale-[1.01]"
 >
 Confirm Appointment
 </button>
 </div>
 </div>
 </div>

 <!-- Typing Indicator Simulation -->
 <div v-if="isTyping" class="flex items-center gap-2.5 max-w-[80%] animate-in fade-in duration-100">
 <div class="w-7 h-7 rounded-full flex items-center justify-center shrink-0 border bg-primary/10 border-primary/20 text-primary">
 <Bot class="w-4 h-4 animate-bounce" />
 </div>
 <div class="bg-card border border-border/80 rounded-2xl px-4 py-2.5 flex items-center gap-1.5">
 <span class="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce"></span>
 <span class="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.2s]"></span>
 <span class="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.4s]"></span>
 </div>
 </div>

 </div>

 <!-- Bottom controls / input simulator placeholder -->
 <div class="p-4 border-t border-border bg-card flex items-center justify-between text-xs text-muted-foreground font-medium select-none">
 <div>
 <span>Interactive Simulator: Click buttons to respond.</span>
 </div>
 <button @click="initSimulation" class="text-primary hover:text-primary font-bold transition-colors flex items-center gap-1 cursor-pointer">
 <RefreshCw class="w-3 h-3" />
 Restart Demo
 </button>
 </div>

 </div>
 </div>

 </div>
 </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
 width: 4px;
 height: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
 background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
 background: hsl(var(--border));
 border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
 background: hsl(var(--muted-foreground));
}
</style>
