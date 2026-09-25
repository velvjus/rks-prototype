<template>
  <div class="h-full flex flex-col bg-gray-50/80 dark:bg-[#090D14] text-gray-900 dark:text-gray-100 font-sans antialiased overflow-hidden">
    
    <!-- ═════════════════════════════════════════════════════════
         TOP HEADER BAR
         ═════════════════════════════════════════════════════════ -->
    <header class="bg-white dark:bg-[#0E131F] border-b border-gray-200/80 dark:border-gray-800/80 px-6 sm:px-8 py-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0 z-20">
      <div class="flex items-center gap-3">
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-lg font-bold tracking-tight text-gray-900 dark:text-white">Partner Portal</h1>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400">Referral pipeline, active trials, and payout commissions.</p>
        </div>
      </div>

      <!-- Header Controls: Date Filter, CSV Export & Withdrawal CTA -->
      <div class="flex flex-wrap items-center gap-2">
        
        <!-- Date Range Filter -->
        <div class="relative">
          <button
            @click="isDateOpen = !isDateOpen"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium shadow-2xs transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#23B750] focus-visible:outline-none"
            aria-haspopup="true"
            :aria-expanded="isDateOpen"
            aria-label="Select date range"
          >
            <Calendar class="w-3.5 h-3.5 text-gray-400" />
            <span class="tabular-nums font-semibold">{{ selectedDateRangeLabel }}</span>
            <ChevronDown class="w-3 h-3 text-gray-400 transition-transform duration-200" :class="{ 'rotate-180': isDateOpen }" />
          </button>

          <!-- Date Dropdown Popover -->
          <div
            v-if="isDateOpen"
            class="absolute right-0 mt-1 w-44 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg p-1 z-50 text-xs space-y-0.5 animate-in fade-in zoom-in-95 duration-100"
          >
            <button
              v-for="preset in datePresets"
              :key="preset.id"
              @click="setDateRange(preset)"
              :class="[
                'w-full text-left px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center justify-between',
                selectedPresetId === preset.id
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-[#23B750] font-bold'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60'
              ]"
            >
              <span>{{ preset.label }}</span>
              <span v-if="selectedPresetId === preset.id" class="w-1.5 h-1.5 rounded-full bg-[#23B750]"></span>
            </button>
          </div>
        </div>

        <!-- Export CSV CTA -->
        <button
          @click="downloadCSV"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#23B750] focus-visible:outline-none"
          title="Download referral commissions as CSV"
        >
          <Download class="w-3.5 h-3.5 text-gray-400" />
          <span>Export CSV</span>
        </button>

        <!-- Primary Action: Withdraw -->
        <button
          @click="openWithdrawModal"
          class="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#23B750] hover:bg-[#1fa848] active:scale-[0.98] text-white rounded-lg text-xs font-bold shadow-sm shadow-[#23B750]/20 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#23B750] focus-visible:outline-none"
        >
          <Banknote class="w-3.5 h-3.5" />
          <span>Withdraw</span>
        </button>

        <!-- Preview State Switcher -->
        <div class="inline-flex items-center p-0.5 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-xs">
          <button
            type="button"
            @click="isPreviewEmpty = false"
            :class="[
              'px-2 py-0.5 rounded-md font-semibold transition-all text-[11px] cursor-pointer',
              !isPreviewEmpty ? 'bg-white dark:bg-gray-900 text-[#23B750] shadow-2xs' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            ]"
            title="Preview with active referrals"
          >
            Active
          </button>
          <button
            type="button"
            @click="isPreviewEmpty = true"
            :class="[
              'px-2 py-0.5 rounded-md font-semibold transition-all text-[11px] cursor-pointer',
              isPreviewEmpty ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-2xs' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            ]"
            title="Preview zero-state view"
          >
            New
          </button>
        </div>

      </div>
    </header>

    <!-- Notification Toast Banner -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="toastMessage"
        class="fixed top-4 right-4 z-50 bg-gray-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5 text-xs border border-gray-700"
      >
        <span class="w-2 h-2 rounded-full bg-[#23B750]"></span>
        <span>{{ toastMessage }}</span>
        <button @click="toastMessage = ''" class="ml-2 text-gray-400 hover:text-white cursor-pointer" aria-label="Dismiss message">✕</button>
      </div>
    </transition>

    <!-- ═════════════════════════════════════════════════════════
         SCROLLABLE CONTENT CANVAS (Compact, Breathing Side Margins)
         ═════════════════════════════════════════════════════════ -->
    <main class="flex-1 overflow-y-auto pt-6 pb-0 scroll-smooth w-full [scrollbar-gutter:stable]">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        <!-- ═════════════════════════════════════════════════════════
             SECTION 1: TITLE HERO CARD ("Share & Earn" Command Card)
             High-impact flagship banner with animated abstract green gradient
             ═════════════════════════════════════════════════════════ -->
        <div 
          class="relative bg-[#02130a] border border-emerald-500/20 rounded-2xl p-6 sm:p-7 shadow-2xl shadow-emerald-950/50 text-white overflow-hidden partner-hero-card"
        >
          
          <!-- Darkened Ambient Emerald Mesh Orbs -->
          <div class="absolute -top-20 -right-20 w-96 h-96 bg-[#23B750]/20 rounded-full blur-3xl pointer-events-none abstract-orb-1"></div>
          <div class="absolute -bottom-20 -left-20 w-96 h-96 bg-emerald-700/20 rounded-full blur-3xl pointer-events-none abstract-orb-2"></div>
          <div class="absolute top-1/4 left-1/3 w-80 h-80 bg-teal-800/15 rounded-full blur-2xl pointer-events-none abstract-orb-3"></div>
          <!-- Subtle animated light sweep across card -->
          <div class="absolute inset-0 bg-gradient-to-tr from-transparent via-emerald-400/5 to-transparent pointer-events-none abstract-shimmer"></div>
          <!-- Subtle top edge highlight -->
          <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent"></div>

          <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            <!-- Left 7 Cols: Value Prop & Sharing Console -->
            <div class="lg:col-span-7 space-y-4">
              <div class="flex items-center gap-2 text-xs font-semibold">
                <span class="text-[#23B750]">Official Partner Program</span>
                <span class="text-[#23B750]/60">&bull;</span>
                <span class="text-[#23B750]">Starter Tier</span>
              </div>

              <div>
                <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                  Earn <span class="text-[#23B750] drop-shadow-xs">RM 300</span> for every deal.
                </h2>
                <p class="text-xs sm:text-sm text-gray-300 mt-1 max-w-lg leading-relaxed">
                  Share your link with businesses. When their paid plan activates, your commission is credited instantly.
                </p>
              </div>

              <!-- Sleek High-Contrast Sharing Console (Referral Link only) -->
              <div class="pt-1 max-w-lg">
                <div class="relative flex items-center">
                  <input
                    type="text"
                    readonly
                    :value="referralLink"
                    aria-label="Direct referral link"
                    class="w-full pl-3.5 pr-26 py-2.5 text-xs bg-black/40 border border-emerald-500/30 hover:border-emerald-500/50 rounded-xl text-emerald-100 font-mono focus:outline-none focus:border-[#23B750] focus:ring-2 focus:ring-[#23B750]/30 transition-all select-all shadow-inner"
                  />
                  <button
                    @click="copyReferralLink"
                    class="absolute right-1 px-3 py-1.5 bg-[#23B750] hover:bg-[#1fa848] active:scale-95 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-sm hover:shadow-md hover:shadow-emerald-500/20"
                    title="Copy Link to Clipboard"
                  >
                    <component :is="isLinkCopied ? Check : Copy" class="w-3.5 h-3.5" />
                    <span>{{ isLinkCopied ? 'Copied' : 'Copy Link' }}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Right 5 Cols: Integrated High-Contrast Commercial Metrics Cluster (Minimal, No Icons) -->
            <div class="lg:col-span-5 bg-black/35 border border-emerald-500/20 rounded-xl p-4.5 backdrop-blur-md grid grid-cols-2 gap-3.5 shadow-inner">
              
              <!-- Metric 1: Available Balance -->
              <div class="space-y-1">
                <div class="text-xs text-gray-300 font-medium leading-tight">
                  Available Balance
                </div>
                <div class="text-2xl font-extrabold font-mono text-white tracking-tight">
                  RM {{ isPreviewEmpty ? '0' : '1,200' }}
                </div>
                <button
                  @click="openWithdrawModal"
                  class="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 hover:underline inline-flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Withdraw balance</span>
                  <span>&rarr;</span>
                </button>
              </div>

              <!-- Metric 2: In Clearance -->
              <div class="space-y-1">
                <div class="text-xs text-gray-300 font-medium leading-tight">
                  In Clearance
                </div>
                <div class="text-2xl font-extrabold font-mono text-white tracking-tight">
                  RM {{ isPreviewEmpty ? '0' : '1,500' }}
                </div>
                <p class="text-[11px] text-gray-400 font-medium">{{ isPreviewEmpty ? 'No pending payouts' : 'Clearing in 30 days' }}</p>
              </div>

              <!-- Metric 3: Converted Deals -->
              <div class="space-y-1 border-t border-white/10 pt-2.5">
                <div class="text-xs text-gray-300 font-medium leading-tight">
                  Converted Deals
                </div>
                <div class="text-xl sm:text-2xl font-extrabold font-mono text-white tracking-tight">
                  {{ isPreviewEmpty ? '0' : '9' }}
                </div>
                <p class="text-[11px] text-gray-400 font-medium">{{ isPreviewEmpty ? '0% conversion rate' : '75% conversion rate' }}</p>
              </div>

              <!-- Metric 4: Total Commission Earned -->
              <div class="space-y-1 border-t border-white/10 pt-2.5">
                <div class="text-xs text-gray-300 font-medium leading-tight">
                  Total Commission Earned
                </div>
                <div class="text-xl sm:text-2xl font-extrabold font-mono text-white tracking-tight">
                  RM {{ isPreviewEmpty ? '0' : '2,700' }}
                </div>
                <p class="text-[11px] text-gray-400 font-medium">{{ isPreviewEmpty ? 'No earnings yet' : 'Lifetime earnings' }}</p>
              </div>

            </div>

          </div>
        </div>

        <!-- ═════════════════════════════════════════════════════════
             SECTION 2: COMPACT REFERRAL PIPELINE FUNNEL
             Clean status indicators, interactive filter triggers
             ═════════════════════════════════════════════════════════ -->
        <div class="bg-white dark:bg-[#0E131F] border border-gray-200/80 dark:border-gray-800/80 rounded-2xl p-4 sm:p-5 shadow-xs">
          <!-- Top Bar: Title & Filter Controls -->
          <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-3.5">
            <div class="flex items-center gap-2">
              <h3 class="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">Referral Pipeline</h3>
            </div>
            <div class="flex items-center gap-2 text-xs text-gray-500">
              <div class="flex items-center gap-1.5">
                <span>Filter:</span>
                <span class="px-2 py-0.5 rounded-md font-bold bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                  {{ activePipelineFilter }}
                </span>
              </div>
              <button
                v-if="activePipelineFilter !== 'All'"
                @click="setPipelineFilter('All')"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold text-[#23B750] hover:text-[#1fa848] bg-emerald-50/70 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-300/60 dark:border-emerald-800/60 transition-colors cursor-pointer"
                title="Reset pipeline filter to All"
              >
                <RotateCcw class="w-3 h-3" />
                <span>Reset Filter</span>
              </button>
            </div>
          </div>

          <!-- Overall Referral Flow Donut Chart + 4 Pipeline Stage Cards -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            
            <!-- Left: Overall Referral Flow Ring Piechart using ApexCharts -->
            <div class="md:col-span-4 lg:col-span-4 p-3.5 bg-gray-50/90 dark:bg-gray-900/60 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center gap-3.5">
              <!-- Compact ApexCharts Donut Chart with Center Total Number -->
              <div class="relative w-[78px] h-[78px] shrink-0 flex items-center justify-center">
                <apexchart
                  type="donut"
                  width="78"
                  height="78"
                  :options="pipelineApexDonutOptions"
                  :series="pipelineApexDonutSeries"
                />
                <div class="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                  <span class="text-sm font-extrabold font-mono text-gray-900 dark:text-white leading-none">
                    {{ isPreviewEmpty ? 0 : 16 }}
                  </span>
                </div>
              </div>

              <!-- Designed Flow Legend with Connected Progression Styling -->
              <div class="space-y-1 min-w-0 flex-1">
                <!-- Interactive Stage Flow Steps with Color Match -->
                <div class="space-y-1">
                  <!-- Flow Step 1: Active Trials (Amber) -->
                  <button
                    type="button"
                    @click="setPipelineFilter('Trial Active')"
                    class="w-full flex items-center justify-between px-2 py-1 rounded-lg transition-all text-left cursor-pointer group hover:bg-white dark:hover:bg-gray-800/80 border border-transparent hover:border-amber-200/50 dark:hover:border-amber-800/40"
                    :class="activePipelineFilter === 'Trial Active' ? 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800/60 shadow-2xs' : ''"
                    title="Filter by Active Trials"
                  >
                    <div class="flex items-center gap-1.5 min-w-0">
                      <span class="w-2 h-2 rounded-full bg-amber-500 shrink-0 group-hover:scale-125 transition-transform"></span>
                      <span class="text-[11px] font-medium text-gray-600 dark:text-gray-300 truncate group-hover:text-gray-900 dark:group-hover:text-white">
                        Active Trials
                      </span>
                    </div>
                    <span class="text-[10.5px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-100/70 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 shrink-0">
                      {{ isPreviewEmpty ? 0 : 4 }}
                    </span>
                  </button>

                  <!-- Flow Step 2: Awaiting Payment (Rose) -->
                  <button
                    type="button"
                    @click="setPipelineFilter('Awaiting Payment')"
                    class="w-full flex items-center justify-between px-2 py-1 rounded-lg transition-all text-left cursor-pointer group hover:bg-white dark:hover:bg-gray-800/80 border border-transparent hover:border-rose-200/50 dark:hover:border-rose-800/40"
                    :class="activePipelineFilter === 'Awaiting Payment' ? 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800/60 shadow-2xs' : ''"
                    title="Filter by Awaiting Payment"
                  >
                    <div class="flex items-center gap-1.5 min-w-0">
                      <span class="w-2 h-2 rounded-full bg-rose-500 shrink-0 group-hover:scale-125 transition-transform"></span>
                      <span class="text-[11px] font-medium text-gray-600 dark:text-gray-300 truncate group-hover:text-gray-900 dark:group-hover:text-white">
                        Awaiting Payment
                      </span>
                    </div>
                    <span class="text-[10.5px] font-mono font-bold px-1.5 py-0.2 rounded bg-rose-100/70 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 shrink-0">
                      {{ isPreviewEmpty ? 0 : 3 }}
                    </span>
                  </button>

                  <!-- Flow Step 3: Converted Deals (Emerald Green) -->
                  <button
                    type="button"
                    @click="setPipelineFilter('Converted')"
                    class="w-full flex items-center justify-between px-2 py-1 rounded-lg transition-all text-left cursor-pointer group hover:bg-white dark:hover:bg-gray-800/80 border border-transparent hover:border-emerald-200/50 dark:hover:border-emerald-800/40"
                    :class="activePipelineFilter === 'Converted' ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800/60 shadow-2xs' : ''"
                    title="Filter by Converted Deals"
                  >
                    <div class="flex items-center gap-1.5 min-w-0">
                      <span class="w-2 h-2 rounded-full bg-[#23B750] shrink-0 group-hover:scale-125 transition-transform"></span>
                      <span class="text-[11px] font-semibold text-gray-800 dark:text-gray-200 truncate group-hover:text-[#23B750]">
                        Converted Deals
                      </span>
                    </div>
                    <span class="text-[10.5px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-100/70 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 shrink-0">
                      {{ isPreviewEmpty ? 0 : 9 }}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Right: 4 Stage Cards (Clean, Filter-Trigger Cards without individual rings) -->
            <div class="md:col-span-8 lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              
              <!-- Stage 1: All Signups -->
              <button
                @click="setPipelineFilter('All')"
                class="p-3 rounded-xl border text-left transition-all cursor-pointer group"
                :class="activePipelineFilter === 'All' ? 'border-[#23B750] bg-emerald-50/40 dark:bg-emerald-950/20 shadow-xs' : 'border-gray-200/80 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'"
              >
                <div class="flex items-center justify-between">
                  <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">Signups</p>
                  <span class="w-2 h-2 rounded-full bg-blue-500"></span>
                </div>
                <p class="text-lg font-bold font-mono text-gray-900 dark:text-white mt-1">{{ isPreviewEmpty ? 0 : 12 }}</p>
                <p class="text-[10px] text-gray-400 mt-0.5">Total registered</p>
              </button>

              <!-- Stage 2: Active Trial -->
              <button
                @click="setPipelineFilter('Trial Active')"
                class="p-3 rounded-xl border text-left transition-all cursor-pointer group"
                :class="activePipelineFilter === 'Trial Active' ? 'border-[#23B750] bg-emerald-50/40 dark:bg-emerald-950/20 shadow-xs' : 'border-gray-200/80 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'"
              >
                <div class="flex items-center justify-between">
                  <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">Active Trials</p>
                  <span class="w-2 h-2 rounded-full bg-amber-500"></span>
                </div>
                <p class="text-lg font-bold font-mono text-gray-900 dark:text-white mt-1">{{ isPreviewEmpty ? 0 : 4 }}</p>
                <p class="text-[10px] text-gray-400 mt-0.5">Evaluating product</p>
              </button>

              <!-- Stage 3: Awaiting Payment -->
              <button
                @click="setPipelineFilter('Awaiting Payment')"
                class="p-3 rounded-xl border text-left transition-all cursor-pointer group"
                :class="activePipelineFilter === 'Awaiting Payment' ? 'border-[#23B750] bg-emerald-50/40 dark:bg-emerald-950/20 shadow-xs' : 'border-gray-200/80 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'"
              >
                <div class="flex items-center justify-between">
                  <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">Awaiting Payment</p>
                  <span class="w-2 h-2 rounded-full bg-rose-500"></span>
                </div>
                <p class="text-lg font-bold font-mono text-gray-900 dark:text-white mt-1">{{ isPreviewEmpty ? 0 : 3 }}</p>
                <p class="text-[10px] text-gray-400 mt-0.5">Invoice pending</p>
              </button>

              <!-- Stage 4: Converted -->
              <button
                @click="setPipelineFilter('Converted')"
                class="p-3 rounded-xl border text-left transition-all cursor-pointer group"
                :class="activePipelineFilter === 'Converted' ? 'border-[#23B750] bg-emerald-50/40 dark:bg-emerald-950/20 shadow-xs' : 'border-gray-200/80 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'"
              >
                <div class="flex items-center justify-between">
                  <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">Converted Deals</p>
                  <span class="w-2 h-2 rounded-full bg-[#23B750]"></span>
                </div>
                <p class="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">{{ isPreviewEmpty ? 0 : 9 }}</p>
                <p class="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 mt-0.5">{{ isPreviewEmpty ? '0% win rate' : '75% win rate' }}</p>
              </button>

            </div>
          </div>
        </div>

        <!-- ═════════════════════════════════════════════════════════
             SECTION 3: TWO-COLUMN WORKSPACE
             (Left 7 Cols: Data Ledger | Right 5 Cols: Partner Tiers)
             ═════════════════════════════════════════════════════════ -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          <!-- Left 7 Cols: Data Ledger (Referrals & Commissions) -->
          <div class="lg:col-span-7 bg-white dark:bg-[#0E131F] border border-gray-200/80 dark:border-gray-800/80 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between h-full">
            
            <!-- Table Subheader -->
            <div class="px-4 py-3 border-b border-gray-200/80 dark:border-gray-800/80 flex items-center gap-2 shrink-0">
              <button
                @click="activeLedgerTab = 'referrals'"
                :class="[
                  'whitespace-nowrap inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0',
                  activeLedgerTab === 'referrals'
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-[#1a943e] dark:text-[#62D816] border border-emerald-200 dark:border-emerald-800/80'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                ]"
              >
                <span>Referrals</span>
                <span
                  :class="[
                    'px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold shrink-0',
                    activeLedgerTab === 'referrals'
                      ? 'bg-emerald-200/60 dark:bg-emerald-800/60 text-[#157a33] dark:text-emerald-300'
                      : 'bg-gray-200/70 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  ]"
                >
                  {{ filteredReferrals.length }}
                </span>
              </button>
              <button
                @click="activeLedgerTab = 'commissions'"
                :class="[
                  'whitespace-nowrap inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0',
                  activeLedgerTab === 'commissions'
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-[#1a943e] dark:text-[#62D816] border border-emerald-200 dark:border-emerald-800/80'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                ]"
              >
                <span>Commissions</span>
                <span
                  :class="[
                    'px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold shrink-0',
                    activeLedgerTab === 'commissions'
                      ? 'bg-emerald-200/60 dark:bg-emerald-800/60 text-[#157a33] dark:text-emerald-300'
                      : 'bg-gray-200/70 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  ]"
                >
                  {{ filteredCommissions.length }}
                </span>
              </button>
            </div>

            <!-- TAB 1: Referrals Table -->
            <div v-if="activeLedgerTab === 'referrals'" class="flex-1 overflow-x-auto overflow-y-auto">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="bg-gray-50/70 dark:bg-gray-800/40 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider border-b border-gray-200/80 dark:border-gray-800/80">
                    <th scope="col" class="px-4 py-2.5">Business</th>
                    <th scope="col" class="px-4 py-2.5">Stage</th>
                    <th scope="col" class="px-4 py-2.5">Date</th>
                    <th scope="col" class="px-4 py-2.5 text-right">Payout</th>
                    <th scope="col" class="px-3 py-2.5 text-right w-12"><span class="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-800/80">
                  <tr v-if="filteredReferrals.length === 0">
                    <td colspan="5" class="py-10 text-center text-gray-400">
                      <p class="font-semibold text-gray-600 dark:text-gray-300">No referrals found.</p>
                      <p class="text-xs mt-0.5">Try resetting filters or share your link.</p>
                    </td>
                  </tr>
                  <tr
                    v-for="referral in filteredReferrals"
                    :key="referral.id"
                    class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                  >
                    <td class="px-4 py-2.5">
                      <div class="flex items-center gap-2">
                        <div class="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold flex items-center justify-center text-xs shrink-0 border border-gray-200/60 dark:border-gray-700/60">
                          {{ referral.company.charAt(0) }}
                        </div>
                        <div class="min-w-0">
                          <p class="font-bold text-gray-900 dark:text-white truncate">{{ referral.company }}</p>
                          <p class="text-[11px] text-gray-400 truncate">{{ referral.contact }}</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-4 py-2.5">
                      <span
                        :class="[
                          'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border',
                          referral.status === 'Converted'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
                            : referral.status === 'Awaiting Payment'
                            ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800'
                            : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800'
                        ]"
                      >
                        {{ referral.status }}
                      </span>
                    </td>
                    <td class="px-4 py-2.5 font-mono text-gray-500 dark:text-gray-400 text-xs">
                      {{ referral.signupDate }}
                    </td>
                    <td class="px-4 py-2.5 text-right font-mono font-bold text-gray-900 dark:text-white text-xs">
                      RM {{ referral.payout }}
                    </td>
                    <td class="px-3 py-2.5 text-right relative">
                      <div class="inline-block text-left">
                        <button
                          @click.stop="toggleRowMenu(referral.id)"
                          class="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                          title="More options"
                          aria-label="More options"
                        >
                          <MoreVertical class="w-4 h-4" />
                        </button>

                        <!-- Kebab Dropdown Menu Popover -->
                        <div
                          v-if="openRowMenuId === referral.id"
                          @click.stop
                          class="absolute right-2 mt-1 w-36 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl py-1 z-30 text-xs space-y-0.5 animate-in fade-in zoom-in-95 duration-100 text-left"
                        >
                          <button
                            @click="handleRowAction('follow_up', referral)"
                            class="w-full text-left px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 hover:text-[#23B750] dark:hover:text-emerald-400 font-medium flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            <MessageCircle class="w-3.5 h-3.5 text-[#23B750]" />
                            <span>Follow Up</span>
                          </button>
                          <button
                            @click="handleRowAction('copy_details', referral)"
                            class="w-full text-left px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            <Copy class="w-3.5 h-3.5 text-gray-400" />
                            <span>Copy Details</span>
                          </button>
                          <div class="h-px bg-gray-100 dark:bg-gray-800 my-0.5"></div>
                          <button
                            @click="handleRowAction('archive', referral)"
                            class="w-full text-left px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 font-medium flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            <Archive class="w-3.5 h-3.5 text-gray-400" />
                            <span>Archive</span>
                          </button>
                          <button
                            @click="handleRowAction('delete', referral)"
                            class="w-full text-left px-3 py-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-medium flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            <Trash2 class="w-3.5 h-3.5 text-rose-500" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- TAB 2: Commission Ledger Table -->
            <div v-else class="flex-1 overflow-x-auto overflow-y-auto">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="bg-gray-50/70 dark:bg-gray-800/40 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider border-b border-gray-200/80 dark:border-gray-800/80">
                    <th scope="col" class="px-4 py-2.5">Source</th>
                    <th scope="col" class="px-4 py-2.5">Tier</th>
                    <th scope="col" class="px-4 py-2.5">Status</th>
                    <th scope="col" class="px-4 py-2.5 text-right">Credit</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-800/80">
                  <tr v-if="filteredCommissions.length === 0">
                    <td colspan="4" class="py-10 text-center text-gray-400">
                      <p class="font-semibold text-gray-600 dark:text-gray-300">No payout records found.</p>
                      <p class="text-xs mt-0.5">Commission credits will appear here when deals close.</p>
                    </td>
                  </tr>
                  <tr
                    v-for="comm in filteredCommissions"
                    :key="comm.id"
                    class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                  >
                    <td class="px-4 py-2.5">
                      <div class="flex items-center gap-2">
                        <div class="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold flex items-center justify-center text-xs shrink-0 border border-gray-200/60 dark:border-gray-700/60">
                          {{ comm.source.charAt(0) }}
                        </div>
                        <div class="min-w-0">
                          <p class="font-bold text-gray-900 dark:text-white truncate">{{ comm.source }}</p>
                          <p class="text-[11px] text-gray-400 truncate">{{ comm.contact }}</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-4 py-2.5 text-gray-500 dark:text-gray-400">
                      {{ comm.tier }}
                    </td>
                    <td class="px-4 py-2.5">
                      <span
                        :class="[
                          'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border',
                          comm.status === 'Cleared'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
                            : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800'
                        ]"
                      >
                        {{ comm.status }}
                      </span>
                    </td>
                    <td class="px-4 py-2.5 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      +RM {{ comm.payout }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Table Footer: Quick Navigation to Main Page -->
            <div class="px-4 py-2.5 bg-gray-50/60 dark:bg-gray-800/30 border-t border-gray-200/80 dark:border-gray-800/80 flex items-center justify-between text-xs shrink-0">
              <span class="text-gray-500 dark:text-gray-400">
                Showing recent {{ activeLedgerTab === 'referrals' ? 'referrals' : 'commissions' }}
              </span>
              <router-link
                :to="activeLedgerTab === 'referrals' ? { path: '/partner/referrals', query: { from: 'overview' } } : { path: '/partner/commissions', query: { from: 'overview' } }"
                class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-semibold inline-flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>Go to {{ activeLedgerTab === 'referrals' ? 'My Referral' : 'Commissions' }} main page</span>
                <ArrowRight class="w-3.5 h-3.5" />
              </router-link>
            </div>

          </div>

          <!-- Right 5 Cols: Partner Tiers Progression Card -->
          <div class="lg:col-span-5 bg-white dark:bg-[#0E131F] border border-gray-200/80 dark:border-gray-800/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 h-full">
            <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2.5">
              <div>
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">Partner Tiers</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400">Earn up to RM 500/deal as volume scales</p>
              </div>
              <button
                @click="showUpgradeModal = true"
                class="text-xs font-semibold text-[#23B750] hover:underline cursor-pointer"
              >
                View perks &rarr;
              </button>
            </div>

            <!-- Milestone Progress Indicator -->
            <div class="bg-gray-50 dark:bg-gray-800/50 border border-gray-200/80 dark:border-gray-700/80 rounded-xl p-3.5 space-y-2">
              <div class="flex items-center justify-between text-xs">
                <span class="font-bold text-gray-900 dark:text-white">Starter Tier &bull; {{ isPreviewEmpty ? '0 of 5 deals' : '2 of 5 deals' }}</span>
                <span class="font-mono font-bold text-[#23B750]">{{ isPreviewEmpty ? '0%' : '40%' }}</span>
              </div>
              <div class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  class="h-full bg-[#23B750] rounded-full transition-all duration-500"
                  :style="{ width: isPreviewEmpty ? '0%' : '40%' }"
                ></div>
              </div>
              <p class="text-[11px] text-gray-500 dark:text-gray-400">
                {{ isPreviewEmpty ? '5 more verified signups needed to reach Silver.' : '3 more verified signups needed to unlock Silver Tier (RM 350/deal).' }}
              </p>
            </div>

            <!-- Interactive Tier Threshold Cards -->
            <div class="space-y-2">
              <div
                v-for="tier in computedTiers"
                :key="tier.id"
                class="relative"
              >
                <button
                  type="button"
                  @click="handleTierClick(tier)"
                  @mouseleave="activeOverlayTierId = null"
                  :class="[
                    'relative w-full p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between group overflow-hidden',
                    tier.status === 'active'
                      ? 'border-emerald-400 dark:border-emerald-600/90 bg-emerald-50/40 dark:bg-emerald-950/25 shadow-xs'
                      : tier.status === 'achieved'
                      ? 'border-blue-200 dark:border-blue-900/60 bg-blue-50/30 dark:bg-blue-950/20'
                      : 'border-gray-200/80 dark:border-gray-800 bg-transparent hover:bg-gray-50/80 dark:hover:bg-gray-800/40 opacity-85 hover:opacity-100',
                    'hover:border-emerald-400 dark:hover:border-emerald-500 hover:scale-[1.01] active:scale-[0.99]',
                    clickedTierId === tier.id && clickedTierAnimation === 'shake' ? 'animate-tier-shake' : '',
                    clickedTierId === tier.id && clickedTierAnimation === 'glow' ? 'animate-tier-glow' : ''
                  ]"
                  :title="tier.status === 'active' ? 'Active Tier' : tier.status === 'achieved' ? 'Achieved Tier' : 'Locked Tier - Click for requirements'"
                >
                  <div class="flex items-center gap-2.5">
                    <span
                      :class="[
                        'w-2 h-2 rounded-full shrink-0 transition-transform duration-200 group-hover:scale-125',
                        tier.status === 'active'
                          ? 'bg-[#23B750]'
                          : tier.status === 'achieved'
                          ? 'bg-emerald-600 dark:bg-emerald-500'
                          : 'bg-gray-300 dark:bg-gray-600'
                      ]"
                    ></span>
                    <div>
                      <div class="flex items-center gap-1.5">
                        <p class="text-xs font-bold text-gray-900 dark:text-white group-hover:text-[#23B750] transition-colors">
                          {{ tier.name }} ({{ tier.range }})
                        </p>
                        <span
                          v-if="tier.status === 'active'"
                          class="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 uppercase tracking-wider"
                        >
                          Active
                        </span>
                        <span
                          v-else-if="tier.status === 'achieved'"
                          class="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 uppercase tracking-wider"
                        >
                          Achieved
                        </span>
                        <span
                          v-else
                          class="px-1.5 py-0.2 rounded text-[9px] font-medium bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 inline-flex items-center gap-0.5"
                        >
                          <Lock class="w-2.5 h-2.5" />
                          Locked
                        </span>
                      </div>
                      <p class="text-[11px] text-gray-400 mt-0.5">{{ tier.subtitle }}</p>
                    </div>
                  </div>
                  <span
                    :class="[
                      'text-xs font-mono font-bold shrink-0',
                      tier.status === 'active' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-700 dark:text-gray-300'
                    ]"
                  >
                    {{ tier.payout }} / deal
                  </span>

                  <!-- OVERLAY: Pops directly over the clicked card and vanishes on mouseleave with bulletproof contrast -->
                  <transition
                    enter-active-class="transition duration-150 ease-out"
                    enter-from-class="opacity-0 scale-98"
                    enter-to-class="opacity-100 scale-100"
                    leave-active-class="transition duration-150 ease-in"
                    leave-from-class="opacity-100 scale-100"
                    leave-to-class="opacity-0 scale-98"
                  >
                    <div
                      v-if="activeOverlayTierId === tier.id"
                      class="absolute inset-0 z-30 rounded-xl px-3.5 py-2 flex items-center justify-between shadow-2xl text-xs transition-all pointer-events-none"
                      :style="getTierOverlayStyle(tier)"
                    >
                      <div class="flex items-center gap-2.5 min-w-0 pr-2">
                        <Sparkles v-if="tier.status === 'active'" class="w-4 h-4 text-emerald-100 shrink-0 animate-pulse" />
                        <CheckCircle2 v-else-if="tier.status === 'achieved'" class="w-4 h-4 text-emerald-300 shrink-0" />
                        <Lock v-else class="w-4 h-4 text-emerald-300 shrink-0" />
                        <div class="min-w-0">
                          <p class="font-extrabold text-xs text-white leading-tight flex items-center gap-1.5 truncate">
                            <span>{{ tier.name }} Tier</span>
                            <span class="text-[10px] text-white/90 font-mono font-bold">({{ tier.payout }}/deal)</span>
                          </p>
                          <p class="text-[11px] font-medium text-white/95 leading-tight mt-0.5 truncate">
                            {{ getOverlayMessage(tier) }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </transition>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

        <!-- ═════════════════════════════════════════════════════════
             SECTION 4: BOTTOM PAGE BANNER (100% FULL WIDTH, 0 BOTTOM PADDING)
             ═════════════════════════════════════════════════════════ -->
        <div class="w-full bottom-page-banner pb-0 flex flex-col items-center justify-end text-center overflow-hidden" style="padding-top: 60px;">
          <!-- 100% Full Width Attached Mascot Image with Overlay Text (Positioned right above the mascots) -->
          <div class="relative w-full leading-none overflow-hidden flex justify-center">
            <img
              src="/images/partner-team-mascots.png"
              alt="RakanSales AI Sales Crew"
              class="w-full h-auto object-cover sm:object-contain object-bottom block"
            />

            <!-- Text overlay positioned right above the mascots where indicated -->
            <div class="absolute top-[8%] sm:top-[10%] md:top-[12%] inset-x-0 mx-auto px-4 max-w-md text-center pointer-events-none z-10">
              <h3 class="text-sm sm:text-base font-semibold text-gray-500 dark:text-gray-400 tracking-tight">
                You've reached the end, partner!
              </h3>
              <p class="text-xs text-gray-400 dark:text-gray-500 mt-0.5 leading-relaxed">
                Keep sharing your link to climb to the next tier!
              </p>
            </div>
          </div>
        </div>

    </main>

    <!-- ═════════════════════════════════════════════════════════
         MODAL 1: WITHDRAW EARNINGS
         ═════════════════════════════════════════════════════════ -->
    <div
      v-if="showWithdrawModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/70 backdrop-blur-xs animate-in fade-in duration-150"
      @click.self="showWithdrawModal = false"
    >
      <div class="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4.5 animate-in zoom-in-95 duration-150">
        <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-[#23B750] flex items-center justify-center">
              <Banknote class="w-4 h-4" />
            </div>
            <div>
              <h3 class="text-base font-bold text-gray-900 dark:text-white">Withdraw Earnings</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">Transfer to your Malaysian bank account</p>
            </div>
          </div>
          <button @click="showWithdrawModal = false" class="text-gray-400 hover:text-gray-700 p-1 cursor-pointer" aria-label="Close modal">✕</button>
        </div>

        <div class="space-y-3.5 text-xs">
          <!-- Available balance card -->
          <div class="bg-emerald-50/50 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800 flex justify-between items-center">
            <span class="text-gray-600 dark:text-gray-400 font-medium">Available Balance</span>
            <span class="font-mono font-extrabold text-base text-emerald-700 dark:text-emerald-400">RM {{ isPreviewEmpty ? '0' : '1,200' }}</span>
          </div>

          <!-- Bank selection -->
          <div class="space-y-1">
            <label class="font-semibold text-gray-700 dark:text-gray-300">Bank</label>
            <select
              v-model="withdrawBank"
              class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 text-xs focus:ring-1 focus:ring-[#23B750]"
            >
              <option value="Maybank">Malayan Banking Berhad (Maybank)</option>
              <option value="CIMB">CIMB Bank Berhad</option>
              <option value="PublicBank">Public Bank Berhad</option>
              <option value="RHB">RHB Bank Berhad</option>
              <option value="HongLeong">Hong Leong Bank Berhad</option>
            </select>
          </div>

          <!-- Account number -->
          <div class="space-y-1">
            <label class="font-semibold text-gray-700 dark:text-gray-300">Account Number</label>
            <input
              v-model="withdrawAccount"
              type="text"
              placeholder="e.g. 1140 1234 5678"
              class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 text-xs font-mono focus:ring-1 focus:ring-[#23B750]"
            />
          </div>

          <!-- Withdrawal Amount -->
          <div class="space-y-1">
            <label class="font-semibold text-gray-700 dark:text-gray-300">Amount (RM)</label>
            <input
              v-model="withdrawAmount"
              type="number"
              placeholder="1200"
              class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 text-xs font-mono focus:ring-1 focus:ring-[#23B750]"
            />
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
          <button
            @click="showWithdrawModal = false"
            class="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl cursor-pointer"
          >
            Cancel
          </button>
          <button
            @click="submitWithdrawal"
            class="px-5 py-2 bg-[#23B750] hover:bg-[#1fa848] text-white text-xs font-bold rounded-xl shadow-md shadow-[#23B750]/20 cursor-pointer"
          >
            Confirm Withdrawal
          </button>
        </div>
      </div>
    </div>

    <!-- ═════════════════════════════════════════════════════════
         MODAL 2: TIER PERKS & UPGRADE MODAL
         ═════════════════════════════════════════════════════════ -->
    <div
      v-if="showUpgradeModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/70 backdrop-blur-xs animate-in fade-in duration-150"
      @click.self="showUpgradeModal = false"
    >
      <div class="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl max-w-xl w-full p-6 space-y-4.5 animate-in zoom-in-95 duration-150">
        <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-[#23B750] flex items-center justify-center">
              <Award class="w-4 h-4" />
            </div>
            <div>
              <h3 class="text-base font-bold text-gray-900 dark:text-white">Partner Program Tracks</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">Commission rates and tier thresholds</p>
            </div>
          </div>
          <button @click="showUpgradeModal = false" class="text-gray-400 hover:text-gray-700 p-1 cursor-pointer" aria-label="Close modal">✕</button>
        </div>

        <div class="space-y-2.5">
          <div
            v-for="tier in tierDetails"
            :key="tier.name"
            class="p-3 rounded-xl border transition-all"
            :class="tier.current ? 'border-[#23B750] bg-emerald-50/20 dark:bg-emerald-950/10' : 'border-gray-200 dark:border-gray-800'"
          >
            <div class="flex items-center justify-between">
              <div>
                <span class="font-bold text-sm text-gray-900 dark:text-white">{{ tier.name }}</span>
                <span class="text-xs text-gray-500 ml-2">({{ tier.deals }})</span>
              </div>
              <span class="text-sm font-extrabold text-[#23B750] font-mono">{{ tier.payout }}</span>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ tier.description }}</p>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
          <button
            @click="showUpgradeModal = false"
            class="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl cursor-pointer"
          >
            Close
          </button>
          <button
            @click="applyForUpgrade"
            class="px-5 py-2 bg-[#23B750] hover:bg-[#1fa848] text-white text-xs font-bold rounded-xl shadow-md shadow-[#23B750]/20 cursor-pointer"
          >
            Request Track Upgrade
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import {
  Calendar, ChevronDown, Download, Check, CheckCircle2,
  Copy, Sparkles, Award, Banknote, Search, RotateCcw, Lock,
  MoreVertical, Archive, Trash2, MessageCircle, ArrowUpRight, ArrowRight
} from 'lucide-vue-next';

// State: Demo view switcher (Active vs Day 1 Empty)
const isPreviewEmpty = ref(false);

// State: Date Range popover
const isDateOpen = ref(false);
const datePresets = [
  { id: '30d', label: 'Last 30 Days' },
  { id: 'this_month', label: 'This Month' },
  { id: 'last_month', label: 'Last Month' },
  { id: 'all_time', label: 'All Time' },
];
const selectedPresetId = ref('30d');
const selectedDateRangeLabel = ref('Last 30 Days');

function setDateRange(preset: { id: string; label: string }) {
  selectedPresetId.value = preset.id;
  selectedDateRangeLabel.value = preset.label;
  isDateOpen.value = false;
  showToast(`Date range set to ${preset.label}`);
}

// Toast Feedback System
const toastMessage = ref('');
let toastTimer: number | null = null;
function showToast(msg: string) {
  toastMessage.value = msg;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toastMessage.value = '';
  }, 3500);
}

// Referral Program Constants
const referralCode = 'O45HKSYS';
const referralLink = `https://app.rakansales.com/ref/${referralCode}`;

// Copy Link handler
const isLinkCopied = ref(false);

async function copyReferralLink() {
  try {
    await navigator.clipboard.writeText(referralLink);
    isLinkCopied.value = true;
    showToast('Referral link copied to clipboard');
    setTimeout(() => {
      isLinkCopied.value = false;
    }, 2500);
  } catch (err) {
    showToast('Link copied: ' + referralLink);
  }
}

// Dedicated Partner Pipeline Filter State
const activePipelineFilter = ref('All');
function setPipelineFilter(stage: string) {
  activePipelineFilter.value = stage;
  showToast(`Filtered by ${stage}`);
}

// Ledger Tab & Search
const activeLedgerTab = ref<'referrals' | 'commissions'>('referrals');
const searchQuery = ref('');

// Modals
const showUpgradeModal = ref(false);
const showWithdrawModal = ref(false);
const route = useRoute();

watch(
  () => [route.path, route.query],
  () => {
    if (route.path === '/partner/withdrawal' || route.query?.action === 'withdraw') {
      showWithdrawModal.value = true;
    }
  },
  { immediate: true }
);
const withdrawBank = ref('Maybank');
const withdrawAccount = ref('1140 8923 8812');
const withdrawAmount = ref(1200);

function openWithdrawModal() {
  showWithdrawModal.value = true;
}

function submitWithdrawal() {
  showWithdrawModal.value = false;
  showToast(`Withdrawal of RM ${withdrawAmount.value} submitted to ${withdrawBank.value}`);
}

function applyForUpgrade() {
  showUpgradeModal.value = false;
  showToast('Track upgrade request submitted');
}

// Row Kebab Actions
const openRowMenuId = ref<number | null>(null);

function toggleRowMenu(id: number) {
  openRowMenuId.value = openRowMenuId.value === id ? null : id;
}

function handleRowAction(action: 'follow_up' | 'copy_details' | 'archive' | 'delete', referral: typeof sampleReferrals[0]) {
  openRowMenuId.value = null;
  if (action === 'follow_up') {
    showToast(`Opening WhatsApp follow-up for ${referral.company}`);
  } else if (action === 'copy_details') {
    navigator.clipboard.writeText(`${referral.company} - ${referral.contact}`);
    showToast(`Copied contact details for ${referral.company}`);
  } else if (action === 'archive') {
    showToast(`Archived referral: ${referral.company}`);
  } else if (action === 'delete') {
    showToast(`Removed referral: ${referral.company}`);
  }
}

// Ring Progress Calculator for Referral Table
function getRingProgress(status: string) {
  switch (status) {
    case 'Converted':
      return { percent: 100, stroke: 'stroke-[#23B750]', fill: 'text-[#15803D] dark:text-[#34D399]' };
    case 'Awaiting Payment':
      return { percent: 75, stroke: 'stroke-rose-500', fill: 'text-rose-600 dark:text-rose-400' };
    case 'Trial Active':
      return { percent: 40, stroke: 'stroke-amber-500', fill: 'text-amber-600 dark:text-amber-400' };
    default:
      return { percent: 20, stroke: 'stroke-gray-400', fill: 'text-gray-500 dark:text-gray-400' };
  }
}

// Real CSV Download
function downloadCSV() {
  const headers = ['Company', 'Contact', 'Pipeline Stage', 'Signed Up', 'Payout (RM)'];
  const rows = sampleReferrals.map(r => [
    `"${r.company}"`,
    `"${r.contact}"`,
    `"${r.status}"`,
    `"${r.signupDate}"`,
    r.payout
  ]);
  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'RakanSales_Partner_Referrals.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('Downloaded RakanSales_Partner_Referrals.csv');
}

// Partner Tier Criteria & Progression Configuration
interface PartnerTierItem {
  id: string;
  name: string;
  range: string;
  payout: string;
  threshold: number;
  max: number;
  subtitle: string;
}

const tiersData: PartnerTierItem[] = [
  { id: 'starter', name: 'Starter', range: '1–4 deals', payout: 'RM 300', threshold: 1, max: 4, subtitle: 'Current track' },
  { id: 'silver', name: 'Silver', range: '5–19 deals', payout: 'RM 350', threshold: 5, max: 19, subtitle: 'Next milestone' },
  { id: 'gold', name: 'Gold', range: '20–49 deals', payout: 'RM 400', threshold: 20, max: 49, subtitle: 'Agency track' },
  { id: 'elite', name: 'Elite', range: '50+ deals', payout: 'RM 500', threshold: 50, max: 999999, subtitle: 'Enterprise partner' },
];

const currentClosedDeals = computed(() => isPreviewEmpty.value ? 0 : 2);

function getTierStatus(tier: PartnerTierItem): 'active' | 'achieved' | 'locked' {
  const deals = currentClosedDeals.value;
  if (tier.id === 'starter') {
    if (deals > 4) return 'achieved';
    return 'active';
  }
  if (deals >= tier.threshold) {
    if (deals > tier.max) return 'achieved';
    return 'active';
  }
  return 'locked';
}

interface ComputedPartnerTier extends PartnerTierItem {
  status: 'active' | 'achieved' | 'locked';
}

const computedTiers = computed<ComputedPartnerTier[]>(() => {
  return tiersData.map(t => ({
    ...t,
    status: getTierStatus(t)
  }));
});

// Partner Tiers Click Animation & Card Overlay State
const clickedTierId = ref<string | null>(null);
const clickedTierAnimation = ref<'shake' | 'glow' | null>(null);
const activeOverlayTierId = ref<string | null>(null);

function handleTierClick(tier: ComputedPartnerTier) {
  clickedTierId.value = tier.id;
  activeOverlayTierId.value = tier.id;

  if (tier.status === 'active' || tier.status === 'achieved') {
    clickedTierAnimation.value = 'glow';
  } else {
    clickedTierAnimation.value = 'shake';
  }

  setTimeout(() => {
    clickedTierAnimation.value = null;
  }, 600);
}

function getOverlayMessage(tier: ComputedPartnerTier) {
  if (tier.status === 'active') {
    return `Currently active: Earning ${tier.payout} per closed deal.`;
  }
  if (tier.status === 'achieved') {
    return `Milestone unlocked and volume requirement met!`;
  }
  const remaining = tier.threshold - currentClosedDeals.value;
  return `Locked: ${remaining} more ${remaining === 1 ? 'deal' : 'deals'} needed to unlock.`;
}

function getTierOverlayStyle(tier: ComputedPartnerTier) {
  if (tier.id === 'starter' || tier.status === 'active') {
    return {
      background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
      border: '1.5px solid #22c55e',
      color: '#ffffff',
      boxShadow: '0 10px 25px -5px rgba(22, 163, 74, 0.4), 0 8px 10px -6px rgba(22, 163, 74, 0.3)'
    };
  }
  // Silver, Gold, Platinum: All share the same dark emerald styling
  return {
    background: 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)',
    border: '1.5px solid #10b981',
    color: '#ffffff',
    boxShadow: '0 10px 25px -5px rgba(6, 78, 59, 0.5), 0 8px 10px -6px rgba(6, 78, 59, 0.4)'
  };
}

// Referral Pipeline ApexCharts Donut Chart Configuration
const pipelineApexDonutOptions = computed(() => ({
  chart: {
    type: 'donut',
    fontFamily: 'Inter, sans-serif',
    sparkline: { enabled: true },
    parentHeightOffset: 0,
    animations: { enabled: true, dynamicAnimation: { speed: 400 } }
  },
  labels: isPreviewEmpty.value
    ? ['No Referrals Yet']
    : ['Active Trials', 'Awaiting Payment', 'Converted Deals'],
  colors: isPreviewEmpty.value
    ? ['#E5E7EB']
    : ['#F59E0B', '#F43F5E', '#23B750'],
  stroke: { width: 2, colors: ['transparent'] },
  legend: { show: false },
  dataLabels: { enabled: false },
  plotOptions: {
    pie: {
      customScale: 0.9,
      expandOnClick: false,
      donut: {
        size: '68%',
        labels: {
          show: false
        }
      }
    }
  },
  tooltip: {
    theme: 'dark',
    y: {
      formatter: (val: number) => isPreviewEmpty.value ? '0 deals' : `${val} deals`
    }
  }
}));

const pipelineApexDonutSeries = computed(() => {
  if (isPreviewEmpty.value) return [1];
  return [4, 3, 9];
});

// Tier Criteria (Modal)
const tierDetails = [
  { name: 'Starter', deals: '1–4 deals', payout: 'RM 300 / deal', current: true, description: 'Default track with zero deal commitments.' },
  { name: 'Silver', deals: '5–19 deals', payout: 'RM 350 / deal', current: false, description: '+RM 50 extra per deal after 5 confirmed subscriptions.' },
  { name: 'Gold', deals: '20–49 deals', payout: 'RM 400 / deal', current: false, description: 'Agency track with dedicated partner support.' },
  { name: 'Elite', deals: '50+ deals', payout: 'RM 500 / deal', current: false, description: 'Enterprise alliance track with co-marketing funds.' },
];

// Sample Partner Referrals Dataset
const sampleReferrals = [
  { id: 1, company: 'Apex Logistics Sdn Bhd', contact: 'Zul Hilmi (CTO)', status: 'Converted', signupDate: '18 Sep 2026', payout: '300' },
  { id: 2, company: 'Zenith Retail Chain', contact: 'Rachel Ong (Operations)', status: 'Converted', signupDate: '12 Sep 2026', payout: '300' },
  { id: 3, company: 'Innopay FinTech', contact: 'Arun Kumar (MD)', status: 'Awaiting Payment', signupDate: '09 Sep 2026', payout: '300' },
  { id: 4, company: 'Cahaya Pharmacy', contact: 'Dr. Noraini', status: 'Trial Active', signupDate: '04 Sep 2026', payout: '300' },
  { id: 5, company: 'Mega Jaya Wholesale', contact: 'Tan Sri Dato Lee', status: 'Converted', signupDate: '01 Sep 2026', payout: '300' },
  { id: 6, company: 'Vortex Global Tech', contact: 'Harith Iskandar', status: 'Trial Active', signupDate: '28 Aug 2026', payout: '300' },
];

// Filtered Referrals computed
const filteredReferrals = computed(() => {
  if (isPreviewEmpty.value) return [];
  return sampleReferrals.filter(r => {
    const matchesFilter = activePipelineFilter.value === 'All' || r.status === activePipelineFilter.value;
    const matchesQuery = !searchQuery.value ||
      r.company.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      r.contact.toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchesFilter && matchesQuery;
  });
});

const sampleCommissions = [
  { id: 101, source: 'Apex Logistics Sdn Bhd', contact: 'Zul Hilmi (CTO)', tier: 'Starter Tier Commission', status: 'Cleared', payout: '300' },
  { id: 102, source: 'Zenith Retail Chain', contact: 'Rachel Ong (Operations)', tier: 'Starter Tier Commission', status: 'Cleared', payout: '300' },
  { id: 103, source: 'Mega Jaya Wholesale', contact: 'Tan Sri Dato Lee', tier: 'Starter Tier Commission', status: 'Cleared', payout: '300' },
  { id: 104, source: 'Innopay FinTech', contact: 'Arun Kumar (MD)', tier: 'Starter Tier Commission', status: 'In Clearance (~30d)', payout: '300' },
  { id: 105, source: 'Cahaya Pharmacy', contact: 'Dr. Noraini', tier: 'Starter Tier Commission', status: 'In Clearance (~30d)', payout: '300' },
];

// Filtered Commissions computed
const filteredCommissions = computed(() => {
  if (isPreviewEmpty.value) return [];
  return sampleCommissions.filter(c => {
    return !searchQuery.value ||
      c.source.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      c.contact.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      c.tier.toLowerCase().includes(searchQuery.value.toLowerCase());
  });
});

// Close kebab dropdown when clicking outside
onMounted(() => {
  window.addEventListener('click', () => {
    openRowMenuId.value = null;
  });
});
</script>

<style scoped>
/* Vibrant Animated Abstract Green Gradient for Title Card */
@keyframes abstractGradientMove {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes abstractFloat1 {
  0%, 100% {
    transform: translate(0px, 0px) scale(1);
  }
  50% {
    transform: translate(30px, -20px) scale(1.2);
  }
}

@keyframes abstractFloat2 {
  0%, 100% {
    transform: translate(0px, 0px) scale(1);
  }
  50% {
    transform: translate(-25px, 25px) scale(1.15);
  }
}

@keyframes abstractFloat3 {
  0%, 100% {
    transform: translate(0px, 0px) scale(0.9);
    opacity: 0.35;
  }
  50% {
    transform: translate(20px, 15px) scale(1.25);
    opacity: 0.8;
  }
}

@keyframes shimmerWave {
  0% {
    transform: translateX(-100%) rotate(25deg);
  }
  100% {
    transform: translateX(200%) rotate(25deg);
  }
}

.partner-hero-card {
  background: linear-gradient(
    135deg,
    #02130a 0%,
    #052413 25%,
    #0a3d1e 50%,
    #041d0f 75%,
    #082e17 90%,
    #010d06 100%
  ) !important;
  background-size: 240% 240% !important;
  animation: abstractGradientMove 10s ease infinite !important;
}

.abstract-orb-1 {
  animation: abstractFloat1 10s ease-in-out infinite alternate;
}

.abstract-orb-2 {
  animation: abstractFloat2 12s ease-in-out infinite alternate;
}

.abstract-orb-3 {
  animation: abstractFloat3 9s ease-in-out infinite alternate;
}

.abstract-shimmer {
  animation: shimmerWave 10s ease-in-out infinite;
  opacity: 0.5;
}

/* Tier Card Micro-Animations */
@keyframes tierShake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-4px); }
  40%, 80% { transform: translateX(4px); }
}

@keyframes activeTierGlow {
  0% {
    box-shadow: 0 0 0 0 rgba(35, 183, 80, 0.7);
  }
  60% {
    box-shadow: 0 0 0 12px rgba(35, 183, 80, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(35, 183, 80, 0);
  }
}

.animate-tier-shake {
  animation: tierShake 0.4s ease-in-out;
}

.animate-tier-glow {
  animation: activeTierGlow 0.65s cubic-bezier(0, 0, 0.2, 1);
}

/* Bottom Page Banner Clearance */
.bottom-page-banner {
  padding-top: 60px;
}
</style>
