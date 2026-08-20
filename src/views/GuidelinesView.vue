<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import lightLogoUrl from '@/assets/logo/RKS Logo Lockup 01.svg'
import darkLogoUrl from '@/assets/logo/RKS Logo Lockup 02.svg'
import logomarkColoredUrl from '@/assets/logo/RKS Logomark 01.svg'
import { 
  Check, 
  X, 
  Info, 
  Palette, 
  Type, 
  Grid, 
  Bookmark, 
  HelpCircle,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  Download
} from 'lucide-vue-next'

const activeSection = ref('logo')

// --- Intersection Observer (Scroll Spy) ---
let observer: IntersectionObserver | null = null

onMounted(() => {
  const sections = document.querySelectorAll('section[id]')
  
  observer = new IntersectionObserver((entries) => {
    const visibleSection = entries.find(entry => entry.isIntersecting)
    if (visibleSection) {
      activeSection.value = visibleSection.target.id
    }
  }, {
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0.1
  })

  sections.forEach(section => observer?.observe(section))
})

onUnmounted(() => {
  observer?.disconnect()
})

const snappyPulse = ref(false)
const fluidSlide = ref(false)

const triggerSnappy = () => {
  snappyPulse.value = true
  setTimeout(() => { snappyPulse.value = false }, 500)
}

const triggerFluid = () => {
  fluidSlide.value = true
  setTimeout(() => { fluidSlide.value = false }, 800)
}

const identity = [
  { id: 'logo',       label: 'Logo System',      num: '01' },
  { id: 'colors',     label: 'Color Palette',    num: '02' },
  { id: 'typography', label: 'Typography',       num: '03' },
]
const foundation = [
  { id: 'spacing',    label: 'Spacing & Layout', num: '04' },
  { id: 'grids',      label: 'Grids & Breakpoints', num: '05' },
  { id: 'elevation',  label: 'Shadow & Elevation', num: '06' },
  { id: 'motion',     label: 'Motion & Animation', num: '07' },
  { id: 'iconography',label: 'Iconography Rules',num: '08' },
]
const elements = [
  { id: 'copywriting',label: 'Voice & Tone Copy',num: '09' },
  { id: 'principles', label: 'Design Principles', num: '10' },
]

const colors = [
  { hex: '#23B750', name: 'RKS Green (Primary)',  use: 'Primary action buttons, selected states, success indicators', contrastLight: 'Pass (3.2:1 - Bold)', contrastDark: 'Pass (6.5:1)' },
  { hex: '#62D816', name: 'RKS Lime (Accent)',    use: 'Subtle gradients, brand accent highlights, VIP alerts', contrastLight: 'Fail (1.7:1 - Use Dark Text)', contrastDark: 'Pass (12.3:1)' },
  { hex: '#2E91E5', name: 'RKS Blue (Info)',       use: 'Information alerts, timeline indicators, system messaging', contrastLight: 'Pass (3.1:1 - Bold)', contrastDark: 'Pass (6.6:1)' },
  { hex: '#2EE1E5', name: 'RKS Cyan',              use: 'New tag chips, active filters, custom secondary actions', contrastLight: 'Fail (1.8:1 - Use Dark Text)', contrastDark: 'Pass (11.5:1)' },
  { hex: '#EF4444', name: 'Danger / Error',        use: 'Destructive CTAs, validation errors, warnings', contrastLight: 'Pass (4.5:1)', contrastDark: 'Pass (4.5:1)' },
  { hex: '#F59E0B', name: 'Warning',               use: 'Pending states, attention-required reminders', contrastLight: 'Fail (2.2:1 - Use Dark Text)', contrastDark: 'Pass (9.5:1)' },
]

const neutrals = [
  { hex: '#0A0D12', name: 'Gray 950 (Dark Surfaces)' },
  { hex: '#252B37', name: 'Gray 800 (Sidebar Active)' },
  { hex: '#414651', name: 'Gray 700 (Subtitles)' },
  { hex: '#717680', name: 'Gray 500 (Muted Text)' },
  { hex: '#9DA3AE', name: 'Gray 400 (Placeholders)' },
  { hex: '#E4E7EB', name: 'Gray 200 (Borders)' },
  { hex: '#F2F4F7', name: 'Gray 100 (Table Headers)' },
  { hex: '#F9FAFB', name: 'Gray 50 (App Canvas Base)' },
]

const spacingItems = [
  { name: 'Base space unit', value: 4 },
  { name: 'Tight spacing', value: 8 },
  { name: 'Card padding / Grid gap', value: 16 },
  { name: 'Section gap / Modal padding', value: 24 },
  { name: 'Large layouts / Container gap', value: 32 },
  { name: 'Hero section / Massive margin', value: 48 },
]

const standardIcons = [
  { name: 'Search', desc: 'Fuzzy search, input text boxes', size: '16px / w-4 h-4', stroke: 'Standard' },
  { name: 'Check', desc: 'Success markers, selected badges', size: '14px / w-3.5 h-3.5', stroke: 'stroke-[3.5] (Bold)' },
  { name: 'Info / HelpCircle', desc: 'Informational tips, tooltip triggers', size: '14px / w-3.5 h-3.5', stroke: 'Standard' },
  { name: 'AlertTriangle', desc: 'Validation errors, alert logs', size: '16px / w-4 h-4', stroke: 'Standard' },
  { name: 'TrendingUp / Sliders', desc: 'Configuration screens, layout triggers', size: '20px / w-5 h-5', stroke: 'stroke-[2.25] (Medium)' },
]

const tonePrinciples = [
  { title: 'Action-oriented', desc: 'Lead with strong verbs. Instruct the user clearly what is happening or what they should do next.' },
  { title: 'Concise & Scannable', desc: 'Ditch passive, wordy expressions. Value active scannability to support rapid daily operations.' },
  { title: 'Empathetic & Solution-focused', desc: 'Avoid leaving them stranded when errors surface. Explain why it occurred and how to resolve it.' },
]

const copywritingExamples = [
  { scenario: 'Saving a new customer lead', bad: 'The customer lead details have been successfully saved into our systems.', good: 'Lead created. 🎉' },
  { scenario: 'Bad input inside email address field', bad: 'The specific email address string that you entered is incorrect. Review formatting and submit.', good: 'Enter a valid email address.' },
  { scenario: 'Search keyword returns zero records', bad: 'No records matching those search terms were detected within the active registry.', good: 'No leads found. Refine your filters.' },
]
</script>

<template>
  <div class="flex min-h-screen bg-gray-50 text-slate-800 font-sans">
    
    <!-- Sidebar Table of Contents -->
    <aside class="w-[240px] shrink-0 border-r border-gray-200 bg-white sticky top-0 h-screen overflow-y-auto hidden lg:flex flex-col">
      <div class="px-6 py-6 border-b border-gray-100">
        <div class="flex items-center gap-2">
          <img :src="logomarkColoredUrl" class="w-7 h-7 flex-shrink-0" alt="RakanSales Logomark" />
          <span class="font-bold text-base tracking-tight"><span class="text-[#23B750]">Rakan</span><span class="text-[#62d816]">Sales</span></span>
        </div>
        <p class="text-[10px] font-bold text-gray-400 mt-2 tracking-wider">BRAND GUIDELINES V1.0</p>
      </div>

      <nav class="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        <div class="px-1 mb-4">
          <RouterLink 
            to="/design-system"
            class="flex items-center justify-center gap-2 w-full py-2 bg-[#23B750] hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all duration-200 shadow-sm hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <Sparkles class="w-3.5 h-3.5" />
            UI Showroom ↗
          </RouterLink>
        </div>
        <!-- Identity -->
        <div>
          <p class="text-[10px] font-bold tracking-[0.08em] uppercase text-gray-400 px-3 mb-2">Identity</p>
          <div class="space-y-1">
            <a 
              v-for="s in identity" 
              :key="s.id" 
              :href="`#${s.id}`"
              @click="activeSection = s.id"
              :class="['group flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-all duration-150', 
                       activeSection === s.id ? 'bg-emerald-50 text-[#23B750] font-semibold' : 'text-gray-600 hover:bg-gray-50']"
            >
              <div :class="['w-5 h-5 flex items-center justify-center rounded-md text-[10px] font-bold transition-colors',
                           activeSection === s.id ? 'bg-[#23B750] text-white' : 'bg-gray-100 text-gray-400']">
                {{ s.num }}
              </div>
              <span class="text-xs">{{ s.label }}</span>
            </a>
          </div>
        </div>

        <!-- Foundation -->
        <div>
          <p class="text-[10px] font-bold tracking-[0.08em] uppercase text-gray-400 px-3 mb-2">Foundation</p>
          <div class="space-y-1">
            <a 
              v-for="s in foundation" 
              :key="s.id" 
              :href="`#${s.id}`"
              @click="activeSection = s.id"
              :class="['group flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-all duration-150', 
                       activeSection === s.id ? 'bg-emerald-50 text-[#23B750] font-semibold' : 'text-gray-600 hover:bg-gray-50']"
            >
              <div :class="['w-5 h-5 flex items-center justify-center rounded-md text-[10px] font-bold transition-colors',
                           activeSection === s.id ? 'bg-[#23B750] text-white' : 'bg-gray-100 text-gray-400']">
                {{ s.num }}
              </div>
              <span class="text-xs">{{ s.label }}</span>
            </a>
          </div>
        </div>

        <!-- Principles -->
        <div>
          <p class="text-[10px] font-bold tracking-[0.08em] uppercase text-gray-400 px-3 mb-2">Governance</p>
          <div class="space-y-1">
            <a 
              v-for="s in elements" 
              :key="s.id" 
              :href="`#${s.id}`"
              @click="activeSection = s.id"
              :class="['group flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-all duration-150', 
                       activeSection === s.id ? 'bg-emerald-50 text-[#23B750] font-semibold' : 'text-gray-600 hover:bg-gray-50']"
            >
              <div :class="['w-5 h-5 flex items-center justify-center rounded-md text-[10px] font-bold transition-colors',
                           activeSection === s.id ? 'bg-[#23B750] text-white' : 'bg-gray-100 text-gray-400']">
                {{ s.num }}
              </div>
              <span class="text-xs">{{ s.label }}</span>
            </a>
          </div>
        </div>
      </nav>
      
      <div class="px-6 py-4 border-t border-gray-100 text-[10px] text-gray-400">
        RakanSales Guidelines · 2026
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 min-w-0 scroll-smooth">
      <div class="max-w-4xl mx-auto px-6 py-12 md:py-16 space-y-16">
        
        <!-- Header -->
        <div class="space-y-4">
          <div class="flex items-center gap-2 text-xs font-bold tracking-widest text-[#23B750] uppercase">
            <Bookmark class="w-4 h-4" />
            Product Guidelines
          </div>
          <h1 class="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            RakanSales Brand Guidelines
          </h1>
          <p class="text-base text-gray-500 max-w-2xl leading-relaxed">
            The complete visual language and design principles for RakanSales. Discover our identity, color spectrum, spacing system, and standard UI patterns.
          </p>
          <div class="mt-4 p-4.5 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div class="space-y-1">
              <h4 class="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles class="w-4 h-4 text-[#23B750]" />
                Interactive UI Component Sandbox
              </h4>
              <p class="text-xs text-gray-500 leading-relaxed max-w-xl">
                Ready to build? Jump into our live diagnostics playground to inspect copy-pasteable Vue 3 code blocks and preview layout density standards.
              </p>
            </div>
            <RouterLink 
              to="/design-system"
              class="px-4 py-2 bg-[#23B750] hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-1.5 whitespace-nowrap self-stretch sm:self-auto justify-center"
            >
              Launch Showroom Console
              <ExternalLink class="w-3.5 h-3.5" />
            </RouterLink>
          </div>
        </div>

        <hr class="border-gray-200" />

        <!-- 01 — Logo System -->
        <section id="logo" class="space-y-6 scroll-mt-6">
          <div class="space-y-1">
            <span class="text-[10px] font-bold tracking-wider text-gray-400 uppercase font-mono">01 — Identity</span>
            <h2 class="text-2xl font-bold text-slate-900">Logo System</h2>
          </div>
          <p class="text-sm text-gray-500 max-w-2xl leading-relaxed">
            Our identity stands for trust, connectivity, and accelerating conversions. It merges the conversation bubble element with a growth dot indicator.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <!-- Light Logo Container -->
            <div class="p-8 bg-white border border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-6 hover:shadow-md transition-shadow relative group">
              <img :src="lightLogoUrl" class="w-full max-w-[280px]" alt="RakanSales Logo Light" />
              <div class="flex flex-col items-center gap-2">
                <span class="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">Primary Logo (Light Canvas)</span>
                <a 
                  :href="lightLogoUrl"
                  download="rakansales-logo-light.svg"
                  class="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-gray-600 hover:text-slate-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  <Download class="w-3.5 h-3.5 text-[#23B750]" />
                  Download SVG
                </a>
              </div>
            </div>

            <!-- Dark Logo Container -->
            <div class="p-8 bg-slate-950 rounded-2xl flex flex-col items-center justify-center gap-6 hover:shadow-md transition-shadow relative group">
              <img :src="darkLogoUrl" class="w-full max-w-[280px]" alt="RakanSales Logo Dark" />
              <div class="flex flex-col items-center gap-2">
                <span class="text-[10px] font-semibold tracking-wider text-gray-500 uppercase">Primary Logo (Dark Canvas)</span>
                <a 
                  :href="darkLogoUrl"
                  download="rakansales-logo-dark.svg"
                  class="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-gray-300 hover:text-white border border-slate-800 rounded-lg hover:bg-slate-900 transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  <Download class="w-3.5 h-3.5 text-[#23B750]" />
                  Download SVG
                </a>
              </div>
            </div>
          </div>

          <!-- Brand Logo Sizing & Clear Space Rules (Identity Sub-Topic) -->
          <div class="mt-8 border-t border-gray-100 pt-6 space-y-4">
            <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              Logo Integrity & Placement Specs
              <span class="h-[1px] flex-1 bg-gray-150"></span>
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Clear Space Visualizer -->
              <div class="p-6 bg-white border border-gray-200 rounded-2xl space-y-4">
                <div class="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wide">
                  <Bookmark class="w-4 h-4 text-[#23B750]" />
                  Logo Clear Space Rule (The "X" Margin)
                </div>
                <p class="text-[11px] text-gray-500 leading-relaxed">
                  To preserve visual impact, always maintain a minimum clear space surrounding the lockup. This zone must remain completely free of any text, borders, or competing UI graphics.
                </p>
                <div class="p-4 bg-gray-50/50 border border-dashed border-gray-250 rounded-xl flex items-center justify-center relative select-none">
                  <!-- Visual Clear Space Wrapper -->
                  <div class="relative p-6 border border-emerald-400/30 bg-emerald-50/10 rounded-md">
                    <!-- Clear Space Margin Indicators -->
                    <span class="absolute top-1 left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold text-emerald-600 bg-white border border-emerald-200/50 px-1 rounded">X Space Margin</span>
                    <span class="absolute bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold text-emerald-600 bg-white border border-emerald-200/50 px-1 rounded">X Space Margin</span>
                    <span class="absolute left-1 top-1/2 -translate-y-1/2 text-[9px] font-mono font-bold text-emerald-600 bg-white border border-emerald-200/50 px-1 rounded origin-center -rotate-90">X Space</span>
                    <span class="absolute right-1 top-1/2 -translate-y-1/2 text-[9px] font-mono font-bold text-emerald-600 bg-white border border-emerald-200/50 px-1 rounded origin-center rotate-90">X Space</span>
                    
                    <!-- Inner Logo representation -->
                    <div class="px-6 py-3 bg-white border border-gray-200 rounded shadow-sm">
                      <img :src="lightLogoUrl" class="h-6 w-auto" alt="Logo space visualization" />
                    </div>
                  </div>
                </div>
                <div class="text-[10px] text-gray-400 italic">
                  * Note: The "X" margin unit corresponds to exactly 50% of the logomark's bounding width.
                </div>
              </div>

              <!-- Minimum Sizing Visualizer -->
              <div class="p-6 bg-white border border-gray-200 rounded-2xl space-y-4 flex flex-col justify-between">
                <div class="space-y-4">
                  <div class="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wide">
                    <Bookmark class="w-4 h-4 text-[#23B750]" />
                    Minimum Render Scales
                  </div>
                  <p class="text-[11px] text-gray-500 leading-relaxed">
                    Our vectors are highly optimized for dense screen readability. To prevent anti-aliasing artifacts and display blur, never render assets below the following scales:
                  </p>
                  
                  <div class="space-y-3.5 pt-1.5">
                    <div class="flex items-center justify-between border-b border-gray-55 pb-2">
                      <span class="text-xs font-bold text-slate-900">Brand Logomark minimum:</span>
                      <div class="flex items-center gap-3">
                        <img :src="logomarkColoredUrl" class="h-4 w-auto" alt="Logomark minimum" />
                        <span class="font-mono text-[10px] font-bold text-slate-950">16px height</span>
                      </div>
                    </div>
                    
                    <div class="flex items-center justify-between border-b border-gray-55 pb-2">
                      <span class="text-xs font-bold text-slate-900">Logo Lockup minimum:</span>
                      <div class="flex items-center gap-3">
                        <img :src="lightLogoUrl" class="h-6 w-auto" alt="Lockup minimum" />
                        <span class="font-mono text-[10px] font-bold text-slate-950">24px height</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="p-3 bg-[#e8f5ed]/40 border border-emerald-100 rounded-xl text-[10px] text-emerald-800 flex items-start gap-2 mt-4 leading-relaxed font-semibold">
                  <Info class="w-3.5 h-3.5 shrink-0 text-[#23B750] mt-0.5" />
                  Always use original vector SVG assets directly inside Vue layout shells rather than compiling custom binary rasterizations (like png/jpg).
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 02 — Color Palette -->
        <section id="colors" class="space-y-6 scroll-mt-6">
          <div class="space-y-1">
            <span class="text-[10px] font-bold tracking-wider text-gray-400 uppercase font-mono">02 — Identity</span>
            <h2 class="text-2xl font-bold text-slate-900">Color Palette</h2>
          </div>
          <p class="text-sm text-gray-500 max-w-2xl leading-relaxed">
            Our brand color spectrum is vibrant, optimized for light and dark layouts. The core brand signature is RKS Green (Primary).
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
            <div 
              v-for="c in colors" 
              :key="c.hex" 
              class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow transition-shadow flex flex-col justify-between"
            >
              <div>
                <div class="h-16 w-full" :style="{ backgroundColor: c.hex }"></div>
                <div class="p-4 space-y-2">
                  <div class="flex items-center justify-between gap-1">
                    <span class="text-xs font-bold text-slate-900 leading-tight">{{ c.name }}</span>
                    <span class="text-[10px] font-mono text-gray-400 font-bold select-all">{{ c.hex }}</span>
                  </div>
                  <p class="text-[11px] text-gray-500 leading-relaxed">{{ c.use }}</p>
                </div>
              </div>
              
              <!-- WCAG Contrast Matrix Section -->
              <div class="px-4 pb-4 pt-2 border-t border-gray-50 bg-gray-50/50 space-y-1.5 text-[10px] font-medium text-gray-500">
                <div class="font-bold text-[9px] text-gray-400 uppercase tracking-wider select-none mb-1 font-mono">Contrast Metrics</div>
                <div class="flex justify-between items-center">
                  <span>Light Canvas (#FFF):</span>
                  <span 
                    :class="['px-1.5 py-0.5 rounded text-[9px] font-bold font-mono', 
                             c.contrastLight.startsWith('Pass') ? 'bg-emerald-55 text-emerald-700' : 'bg-red-50 text-red-600']"
                  >
                    {{ c.contrastLight }}
                  </span>
                </div>
                <div class="flex justify-between items-center">
                  <span>Dark Canvas (#0A0D):</span>
                  <span class="px-1.5 py-0.5 bg-emerald-55 text-emerald-700 rounded text-[9px] font-bold font-mono">
                    {{ c.contrastDark }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-3 pt-4">
            <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              Neutral Spectrum
              <span class="h-[1px] flex-1 bg-gray-200"></span>
            </h3>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div 
                v-for="n in neutrals" 
                :key="n.hex" 
                class="bg-white border border-gray-200 rounded-lg overflow-hidden flex items-center p-2.5 gap-2.5"
              >
                <div class="w-8 h-8 rounded border border-gray-100" :style="{ backgroundColor: n.hex }"></div>
                <div class="flex flex-col">
                  <span class="text-[10px] font-bold text-slate-900 leading-tight">{{ n.name }}</span>
                  <span class="text-[9px] font-mono text-gray-400 font-semibold mt-0.5">{{ n.hex }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 03 — Typography -->
        <section id="typography" class="space-y-6 scroll-mt-6">
          <div class="space-y-1">
            <span class="text-[10px] font-bold tracking-wider text-gray-400 uppercase font-mono">03 — Identity</span>
            <h2 class="text-2xl font-bold text-slate-900">Typography</h2>
          </div>
          <p class="text-sm text-gray-500 max-w-2xl leading-relaxed">
            RakanSales uses <strong>Inter Variable</strong> as its primary typography system, selected for its absolute screen clarity across a wide range of weights.
          </p>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
            <!-- Sans-Serif Preview -->
            <div class="bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
              <div class="flex justify-between items-center pb-4 border-b border-gray-100">
                <div class="space-y-1">
                  <span class="text-2xl font-bold text-slate-900 tracking-tight">Aa Bb Cc</span>
                  <p class="text-[10px] font-bold text-gray-400 uppercase">Inter Typeface (Sans)</p>
                </div>
                <div class="flex gap-2">
                  <span class="px-2 py-0.5 text-[9px] font-bold bg-gray-100 rounded text-gray-600">Light</span>
                  <span class="px-2 py-0.5 text-[9px] font-bold bg-gray-100 rounded text-gray-600 font-medium">Medium</span>
                  <span class="px-2 py-0.5 text-[9px] font-bold bg-gray-100 rounded text-gray-600 font-bold">Bold</span>
                </div>
              </div>

              <div class="space-y-4 text-slate-900">
                <div class="flex flex-col gap-1 border-b border-gray-50 pb-3">
                  <h3 class="text-xl font-bold tracking-tight">This is a Display Heading</h3>
                  <p class="text-[10px] text-gray-400 mt-1">Weight: Bold (700) · Size: 20px</p>
                </div>

                <div class="flex flex-col gap-1 border-b border-gray-50 pb-3">
                  <h4 class="text-base font-bold">This is a section header title</h4>
                  <p class="text-[10px] text-gray-400 mt-1">Weight: Bold (700) · Size: 16px</p>
                </div>

                <div class="flex flex-col gap-1">
                  <p class="text-xs text-gray-600 leading-relaxed">
                    This is standard body copy. RakanSales focuses on high-legibility layout systems for fast B2B SaaS workflows.
                  </p>
                  <p class="text-[10px] text-gray-400 mt-1">Weight: Regular (400) · Size: 12px</p>
                </div>
              </div>
            </div>

            <!-- Monospace Preview -->
            <div class="bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
              <div class="flex justify-between items-center pb-4 border-b border-gray-100">
                <div class="space-y-1">
                  <span class="text-2xl font-bold text-slate-900 tracking-tight font-mono">01_code_1x</span>
                  <p class="text-[10px] font-bold text-gray-400 uppercase">System Mono (Monospace)</p>
                </div>
                <div class="flex gap-2">
                  <span class="px-2 py-0.5 text-[9px] font-bold bg-gray-100 rounded text-gray-600 font-mono">regular</span>
                  <span class="px-2 py-0.5 text-[9px] font-bold bg-gray-100 rounded text-gray-600 font-semibold font-mono">semibold</span>
                </div>
              </div>

              <div class="space-y-4 text-slate-900 font-mono">
                <div class="flex flex-col gap-1 border-b border-gray-50 pb-3">
                  <span class="text-sm font-semibold text-slate-900 select-all">#23B750 (oklch)</span>
                  <p class="text-[10px] text-gray-400 mt-1">Weight: Semibold (600) · Size: 14px</p>
                </div>

                <div class="flex flex-col gap-1 border-b border-gray-50 pb-3">
                  <span class="text-xs text-slate-800">duration-250 / ease-out</span>
                  <p class="text-[10px] text-gray-400 mt-1">Weight: Regular (400) · Size: 12px</p>
                </div>

                <div class="flex flex-col gap-1">
                  <p class="text-[11px] text-gray-505 bg-gray-50 p-2.5 rounded-lg border border-gray-150 leading-normal">
                    const oklch = '0.698 0.177 146.5';
                  </p>
                  <p class="text-[10px] text-gray-400 mt-1">Weight: Regular (400) · Size: 11px</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 04 — Spacing & Layout -->
        <section id="spacing" class="space-y-6 scroll-mt-6">
          <div class="space-y-1">
            <span class="text-[10px] font-bold tracking-wider text-gray-400 uppercase font-mono">04 — Foundation</span>
            <h2 class="text-2xl font-bold text-slate-900">Spacing & Layout</h2>
          </div>
          <p class="text-sm text-gray-500 max-w-2xl leading-relaxed">
            Predictable grids start with clean increments. Our spacing rules use an absolute base unit of <strong>4px</strong>. All padding and margin attributes map strictly to this scale.
          </p>

          <div class="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
            <div v-for="item in spacingItems" :key="item.value" class="flex items-center gap-4">
              <div class="w-40 shrink-0">
                <span class="text-xs font-bold text-slate-900">{{ item.name }}</span>
              </div>
              <div class="w-16 shrink-0 font-mono text-[10px] text-gray-400 font-bold">
                {{ item.value }}px ({{ item.value / 16 }}rem)
              </div>
              <div class="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div class="bg-[#23B750] h-full rounded-full" :style="{ width: `${item.value * 2}px` }"></div>
              </div>
            </div>
          </div>
        </section>

        <!-- 05 — Grids & Breakpoints -->
        <section id="grids" class="space-y-6 scroll-mt-6">
          <div class="space-y-1">
            <span class="text-[10px] font-bold tracking-wider text-gray-400 uppercase font-mono">05 — Foundation</span>
            <h2 class="text-2xl font-bold text-slate-900">Grids & Breakpoints</h2>
          </div>
          <p class="text-sm text-gray-500 max-w-2xl leading-relaxed">
            RakanSales screens use a structured fluid grid to organize sales workflows. Standardizing responsive breaks prevents visual collisions and ensures layout symmetry.
          </p>

          <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden text-xs">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-gray-50 border-b border-gray-200 font-bold text-slate-800">
                  <th class="p-3 pl-4">Breakpoint</th>
                  <th class="p-3">Min-Width Threshold</th>
                  <th class="p-3">Grid Column Structure</th>
                  <th class="p-3 pr-4">App Shell Adaptive State</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-b border-gray-150 hover:bg-gray-50/50 transition-colors">
                  <td class="p-3 pl-4 font-bold text-slate-900 flex items-center gap-2">
                    <span class="px-1.5 py-0.5 bg-gray-100 rounded font-mono text-[10px] font-bold">xs</span>
                    Mobile
                  </td>
                  <td class="p-3 font-mono text-gray-500">&lt; 640px</td>
                  <td class="p-3 font-bold text-slate-800">1-Column Fluid Layout</td>
                  <td class="p-3 text-gray-400 font-medium">Sidebar rail collapses. Content expands 100% width.</td>
                </tr>
                <tr class="border-b border-gray-150 hover:bg-gray-50/50 transition-colors">
                  <td class="p-3 pl-4 font-bold text-slate-900 flex items-center gap-2">
                    <span class="px-1.5 py-0.5 bg-emerald-50 text-[#23B750] rounded font-mono text-[10px] font-bold">sm / md</span>
                    Tablet
                  </td>
                  <td class="p-3 font-mono text-gray-500">&ge; 640px / 768px</td>
                  <td class="p-3 font-bold text-slate-800">2-Column Grid Gap</td>
                  <td class="p-3 text-gray-400 font-medium">Split list/detail views adapt. Sidebar toggle floats.</td>
                </tr>
                <tr class="border-b border-gray-150 hover:bg-gray-50/50 transition-colors">
                  <td class="p-3 pl-4 font-bold text-slate-900 flex items-center gap-2">
                    <span class="px-1.5 py-0.5 bg-emerald-55 text-emerald-700 rounded font-mono text-[10px] font-bold">lg</span>
                    Laptop
                  </td>
                  <td class="p-3 font-mono text-gray-500">&ge; 1024px</td>
                  <td class="p-3 font-bold text-slate-800">3-Column Workspaces</td>
                  <td class="p-3 text-gray-400 font-medium">Expanded rail sidebar active. Right utilities panel docks.</td>
                </tr>
                <tr class="border-b border-gray-150 hover:bg-gray-50/50 transition-colors">
                  <td class="p-3 pl-4 font-bold text-slate-900 flex items-center gap-2">
                    <span class="px-1.5 py-0.5 bg-emerald-55 text-emerald-700 rounded font-mono text-[10px] font-bold">xl / 2xl</span>
                    Desktop
                  </td>
                  <td class="p-3 font-mono text-gray-500">&ge; 1280px / 1536px</td>
                  <td class="p-3 font-bold text-slate-800">12-Column Structured Grid</td>
                  <td class="p-3 text-gray-400 font-medium">Layout bounds clamped to maximum comfort width (1440px).</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- 06 — Shadow & Elevation -->
        <section id="elevation" class="space-y-6 scroll-mt-6">
          <div class="space-y-1">
            <span class="text-[10px] font-medium tracking-widest text-gray-400 uppercase font-mono">06 — Foundation</span>
            <h2 class="text-2xl font-bold text-slate-900">Shadow & Elevation</h2>
          </div>
          <p class="text-sm text-gray-500 max-w-2xl leading-relaxed">
            Depth models structure our application hierarchy. Standardized shadows indicate which elements float over the CRM layout canvas.
          </p>

          <!-- Toggleable Info Callout -->
          <div class="p-4 bg-emerald-50/40 border border-emerald-100 rounded-2xl flex items-start gap-3 text-xs leading-relaxed text-emerald-800">
            <Info class="w-4.5 h-4.5 shrink-0 text-[#23B750] mt-0.5" />
            <div>
              <span class="font-bold">Toggleable CSS Variables Shadow System:</span> Shadows are driven by high-blur custom CSS variables (`--rks-shadow-...`). If a purely flat border-only aesthetic is preferred, the entire system can be turned off instantly by uncommenting the shadows disabler block in <code class="bg-emerald-50 text-[10px]">src/assets/index.css</code>.
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            <!-- Flat Card -->
            <div class="p-5 bg-white border border-gray-200 rounded-2xl flex flex-col justify-between hover:border-gray-300 transition-all duration-200">
              <div class="space-y-3">
                <div class="h-10 w-full bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center text-[10px] font-mono font-bold text-gray-400 uppercase select-none">
                  Flat Surface
                </div>
                <div class="space-y-1">
                  <h4 class="text-xs font-bold text-slate-950 uppercase tracking-wider">Level 0 — Flat</h4>
                  <p class="text-[10px] text-gray-400 leading-relaxed font-semibold">Border: gray-200 / Shadow: none</p>
                </div>
                <p class="text-[11px] text-gray-500 leading-relaxed">Used for standard background layout containers, main data tables, list panels, and standard dividers. Form inputs/fields explicitly disable shadows to maintain a clean border-only look.</p>
              </div>
            </div>

            <!-- Low Elevation -->
            <div class="p-5 bg-white border border-gray-200 rounded-2xl flex flex-col justify-between hover:shadow-sm transition-all duration-200">
              <div class="space-y-3">
                <div class="h-10 w-full bg-gray-50 border border-gray-200 shadow-sm rounded-xl flex items-center justify-center text-[10px] font-mono font-bold text-[#23B750] uppercase select-none">
                  shadow-sm
                </div>
                <div class="space-y-1">
                  <h4 class="text-xs font-bold text-slate-950 uppercase tracking-wider">Level 1 — Low</h4>
                  <p class="text-[10px] text-gray-400 leading-relaxed font-semibold">Tailwind class: shadow-sm</p>
                </div>
                <p class="text-[11px] text-gray-500 leading-relaxed">Used for hovering lists, action cards, clickable item filters, and action anchors.</p>
              </div>
            </div>

            <!-- Medium Elevation -->
            <div class="p-5 bg-white border border-gray-200 rounded-2xl flex flex-col justify-between hover:shadow-md transition-all duration-200">
              <div class="space-y-3">
                <div class="h-10 w-full bg-gray-50 border border-gray-200 shadow-md rounded-xl flex items-center justify-center text-[10px] font-mono font-bold text-[#23B750] uppercase select-none">
                  shadow-md
                </div>
                <div class="space-y-1">
                  <h4 class="text-xs font-bold text-slate-950 uppercase tracking-wider">Level 2 — Mid</h4>
                  <p class="text-[10px] text-gray-400 leading-relaxed font-semibold">Tailwind class: shadow-md</p>
                </div>
                <p class="text-[11px] text-gray-500 leading-relaxed">Standard card hover elevation. All dashboard cards and KPIs are flat by default and transition to Level 2 only when hovered.</p>
              </div>
            </div>

            <!-- High Elevation -->
            <div class="p-5 bg-white border border-gray-200 shadow-xl rounded-2xl flex flex-col justify-between hover:shadow-2xl transition-all duration-200">
              <div class="space-y-3">
                <div class="h-10 w-full bg-gray-50 border border-gray-200 shadow-xl rounded-xl flex items-center justify-center text-[10px] font-mono font-bold text-[#23B750] uppercase select-none">
                  shadow-xl
                </div>
                <div class="space-y-1">
                  <h4 class="text-xs font-bold text-slate-950 uppercase tracking-wider">Level 3 — High</h4>
                  <p class="text-[10px] text-gray-400 leading-relaxed font-semibold">Tailwind class: shadow-xl</p>
                </div>
                <p class="text-[11px] text-gray-500 leading-relaxed">Used for floating action dialogs, modal frames, settings panels, dropdowns, and alerts/toasts with state-colored glows.</p>
              </div>
            </div>
          </div>
        </section>

        <!-- 07 — Motion & Animation -->
        <section id="motion" class="space-y-6 scroll-mt-6">
          <div class="space-y-1">
            <span class="text-[10px] font-bold tracking-wider text-gray-400 uppercase font-mono">07 — Foundation</span>
            <h2 class="text-2xl font-bold text-slate-900">Motion & Animation</h2>
          </div>
          <p class="text-sm text-gray-500 max-w-2xl leading-relaxed">
            Snappy, tactile animations make workflows feel fast. We align all transitions to standardized timing scales and natural deceleration eases.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <!-- Animation Duration Scale -->
            <div class="p-6 bg-white border border-gray-200 rounded-2xl space-y-4">
              <div class="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wide">
                <TrendingUp class="w-4 h-4 text-[#23B750]" />
                Standard Timing Tokens
              </div>
              <p class="text-[11px] text-gray-500 leading-relaxed">
                Standard animation times optimize for rapid human action. Never use slow fades that impede user clicks.
              </p>

              <div class="space-y-3.5 pt-2">
                <div class="flex items-center justify-between border-b border-gray-55 pb-2">
                  <div class="space-y-0.5">
                    <span class="text-xs font-bold text-slate-900 block">Snappy duration (150ms)</span>
                    <span class="text-[9px] font-mono text-gray-400">Class: duration-150</span>
                  </div>
                  <span class="text-[10px] text-gray-500 leading-none bg-gray-50 border border-gray-100 px-2 py-1 rounded font-mono font-bold">Button hovers, check toggle states</span>
                </div>

                <div class="flex items-center justify-between border-b border-gray-55 pb-2">
                  <div class="space-y-0.5">
                    <span class="text-xs font-bold text-slate-900 block">Comfortable standard (250ms)</span>
                    <span class="text-[9px] font-mono text-gray-400">Class: duration-250</span>
                  </div>
                  <span class="text-[10px] text-gray-500 leading-none bg-gray-50 border border-gray-100 px-2 py-1 rounded font-mono font-bold">Accordion collapses, card expansions</span>
                </div>

                <div class="flex items-center justify-between border-b border-gray-55 pb-2">
                  <div class="space-y-0.5">
                    <span class="text-xs font-bold text-slate-950 block">Tactile Extended (350ms)</span>
                    <span class="text-[9px] font-mono text-gray-400">Class: duration-350</span>
                  </div>
                  <span class="text-[10px] text-gray-500 leading-none bg-gray-50 border border-gray-100 px-2 py-1 rounded font-mono font-bold">Side-drawers, complex modal transitions</span>
                </div>
              </div>
            </div>

            <!-- Easing & Interactive Preview -->
            <div class="p-6 bg-white border border-gray-200 rounded-2xl space-y-4 flex flex-col justify-between">
              <div class="space-y-4">
                <div class="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wide">
                  <Sparkles class="w-4 h-4 text-[#23B750]" />
                  Tactile Easing Curve Demos
                </div>
                <p class="text-[11px] text-gray-500 leading-relaxed">
                  We avoid generic linear slides. Deceleration eases curves create a premium, reactive user experience. Click the preview actions below to see them in motion.
                </p>

                <!-- Interactive Canvas -->
                <div class="p-4.5 bg-gray-50/50 border border-gray-200 rounded-xl space-y-3.5 relative overflow-hidden">
                  <!-- Snappy Box -->
                  <div class="flex items-center justify-between">
                    <button 
                      @click="triggerSnappy"
                      class="px-2.5 py-1.5 bg-[#23B750] hover:bg-emerald-600 active:scale-95 text-white text-[9px] font-bold rounded-lg transition-transform duration-100 cursor-pointer whitespace-nowrap shadow-sm select-none"
                    >
                      Trigger Snappy (150ms)
                    </button>
                    <div 
                      :class="['h-6 w-16 bg-emerald-100 border border-emerald-300 rounded-md transition-all duration-150 ease-in-out flex items-center justify-center font-mono text-[9px] font-bold text-emerald-800 select-none',
                               snappyPulse ? 'scale-110 !bg-emerald-300' : '']"
                    >
                      Snappy Box
                    </div>
                  </div>

                  <!-- Tactile Slide Box -->
                  <div class="flex items-center justify-between pt-1 border-t border-gray-200/50">
                    <button 
                      @click="triggerFluid"
                      class="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-850 active:scale-95 text-white text-[9px] font-bold rounded-lg transition-transform duration-100 cursor-pointer whitespace-nowrap shadow-sm select-none"
                    >
                      Trigger Tactile (800ms)
                    </button>
                    <!-- Sliding Bounding Box -->
                    <div class="w-24 h-6 bg-slate-100 border border-slate-200 rounded-md overflow-hidden relative">
                      <div 
                        :class="['absolute top-0 bottom-0 left-0 bg-[#23B750]/20 border-r border-[#23B750] transition-all duration-[600ms] flex items-center justify-center font-mono text-[8px] font-bold text-[#23B750] select-none',
                                 fluidSlide ? 'w-full' : 'w-0']"
                      >
                        Tactile
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="text-[10px] text-gray-400 italic">
                * Note: The Tactile slide uses `cubic-bezier(0.16, 1, 0.3, 1)` for clean fluid deceleration.
              </div>
            </div>
          </div>
        </section>

        <!-- 08 — Iconography Rules -->
        <section id="iconography" class="space-y-6 scroll-mt-6">
          <div class="space-y-1">
            <span class="text-[10px] font-bold tracking-wider text-gray-400 uppercase font-mono">08 — Foundation</span>
            <h2 class="text-2xl font-bold text-slate-900">Iconography Rules</h2>
          </div>
          <p class="text-sm text-gray-500 max-w-2xl leading-relaxed">
            RakanSales relies strictly on standard Lucide-vue-next icons to support scannability and quick interactions. Standard sizing structures prevent vertical stretching or misalignments.
          </p>

          <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden text-xs">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-gray-50 border-b border-gray-200 font-bold text-slate-800">
                  <th class="p-3 pl-4">Standard Icon</th>
                  <th class="p-3">Scenario & Usage Context</th>
                  <th class="p-3">Sizing & Utility Specs</th>
                  <th class="p-3 pr-4">Visual Stroke Width</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="icon in standardIcons" :key="icon.name" class="border-b border-gray-150 hover:bg-gray-50/50 transition-colors">
                  <td class="p-3 pl-4 font-bold text-slate-900 flex items-center gap-2">
                    <span class="p-1.5 bg-emerald-50 rounded-lg text-[#23B750]">
                      <Bookmark class="w-3.5 h-3.5" v-if="icon.name === 'Search'" />
                      <Check class="w-3.5 h-3.5" v-else-if="icon.name.includes('Check')" />
                      <Info class="w-3.5 h-3.5" v-else-if="icon.name.includes('Info')" />
                      <AlertTriangle class="w-3.5 h-3.5" v-else-if="icon.name.includes('Alert')" />
                      <TrendingUp class="w-3.5 h-3.5" v-else />
                    </span>
                    {{ icon.name }}
                  </td>
                  <td class="p-3 text-gray-500">{{ icon.desc }}</td>
                  <td class="p-3 font-mono font-bold text-slate-950">{{ icon.size }}</td>
                  <td class="p-3 text-gray-400 font-semibold font-mono text-[10px]">{{ icon.stroke }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- 09 — Voice & Tone Copy -->
        <section id="copywriting" class="space-y-6 scroll-mt-6">
          <div class="space-y-1">
            <span class="text-[10px] font-bold tracking-wider text-gray-400 uppercase font-mono">09 — Governance</span>
            <h2 class="text-2xl font-bold text-slate-900">Voice & Tone Specifications</h2>
          </div>
          <p class="text-sm text-gray-500 max-w-2xl leading-relaxed">
            Words on the screen guide customer interactions. At RakanSales, we focus on an active, transparent style, keeping developers and sales representatives moving efficiently.
          </p>

          <!-- Core copywriting principles -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div 
              v-for="p in tonePrinciples" 
              :key="p.title" 
              class="bg-white border border-gray-200 rounded-xl p-4.5 space-y-1.5 shadow-sm hover:shadow transition-shadow"
            >
              <h4 class="text-xs font-bold text-slate-950 uppercase tracking-widest">{{ p.title }}</h4>
              <p class="text-[11px] text-gray-500 leading-relaxed">{{ p.desc }}</p>
            </div>
          </div>

          <!-- Do and Don't Copy comparison -->
          <div class="space-y-3 pt-4">
            <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              Writing Comparison Framework
              <span class="h-[1px] flex-1 bg-gray-200"></span>
            </h3>
            <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden text-xs">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-gray-50 border-b border-gray-200 font-bold text-slate-800">
                    <th class="p-3 pl-4">Scenario Context</th>
                    <th class="p-3 text-red-600 bg-red-50/10">Avoid Wordy Copy (Don't)</th>
                    <th class="p-3 text-emerald-700 bg-emerald-50/10 pr-4">Concise RKS Copy (Do)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="ex in copywritingExamples" :key="ex.scenario" class="border-b border-gray-150 hover:bg-gray-50/50 transition-colors">
                    <td class="p-3 pl-4 font-bold text-slate-900">{{ ex.scenario }}</td>
                    <td class="p-3 text-gray-400 italic bg-red-50/5">{{ ex.bad }}</td>
                    <td class="p-3 font-semibold text-slate-900 bg-emerald-50/5 pr-4 flex items-center gap-1.5">
                      <Check class="w-3.5 h-3.5 text-emerald-600 stroke-[3.5] shrink-0" />
                      {{ ex.good }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- 10 — Design Principles -->
        <section id="principles" class="space-y-6 scroll-mt-6">
          <div class="space-y-1">
            <span class="text-[10px] font-bold tracking-wider text-gray-400 uppercase font-mono">10 — Governance</span>
            <h2 class="text-2xl font-bold text-slate-900">Design Principles</h2>
          </div>
          <p class="text-sm text-gray-500 max-w-2xl leading-relaxed">
            Consistent design makes an interface feel responsive, intentional, and cohesive.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- DOs -->
            <div class="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6 space-y-4">
              <div class="flex items-center gap-2 text-emerald-800 font-bold text-sm uppercase tracking-wide">
                <Check class="w-5 h-5 text-emerald-600 stroke-[3]" />
                Best Practices (DO)
              </div>
              <ul class="space-y-2.5 text-xs text-emerald-950/80 leading-relaxed font-medium">
                <li class="flex items-start gap-2">
                  <span class="text-emerald-600 select-none mt-0.5">•</span>
                  Use primary green accent exclusively for active primary actions and validation success states.
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-emerald-600 select-none mt-0.5">•</span>
                  Strictly respect the 4px padding/margin alignments to maintain grid symmetry.
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-emerald-600 select-none mt-0.5">•</span>
                  Apply a maximum level of 2-column or 3-column structures to avoid cognitive overload.
                </li>
              </ul>
            </div>

            <!-- DONTs -->
            <div class="bg-red-50/40 border border-red-100 rounded-2xl p-6 space-y-4">
              <div class="flex items-center gap-2 text-red-800 font-bold text-sm uppercase tracking-wide">
                <X class="w-5 h-5 text-red-500 stroke-[3]" />
                Pitfalls to Avoid (DON'T)
              </div>
              <ul class="space-y-2.5 text-xs text-red-950/80 leading-relaxed font-medium">
                <li class="flex items-start gap-2">
                  <span class="text-red-500 select-none mt-0.5">•</span>
                  Never introduce custom color variations outside the registered 6-color palette.
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-red-500 select-none mt-0.5">•</span>
                  Avoid mixing multiple typeface families. Stick exclusively to the Inter family.
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-red-500 select-none mt-0.5">•</span>
                  Do not add raw, harsh drop shadows. Always use our custom diffused `--rks-shadow-...` variables or keep them flat.
                </li>
              </ul>
            </div>
          </div>
        </section>

      </div>
    </main>

  </div>
</template>

<style scoped>
html {
  scroll-behavior: smooth;
}
</style>
