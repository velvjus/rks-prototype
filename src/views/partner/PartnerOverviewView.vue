<template>
  <div class="h-full flex flex-col bg-gray-50/50 dark:bg-[#0B0F19] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200">
    
    <!-- ═════════════════════════════════════════════════════════
         TOP HEADER BAR
         ═════════════════════════════════════════════════════════ -->
    <header class="h-16 px-4 sm:px-6 lg:px-8 border-b border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-[#0E131F]/80 backdrop-blur-md flex items-center justify-between shrink-0 sticky top-0 z-20">
      <div class="flex items-center gap-3">
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-base sm:text-lg font-bold tracking-tight text-gray-900 dark:text-white">Partner Portal</h1>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ partnerStore.activeTrack === 'sales'
              ? 'B2B client pipelines, 120-day exclusive locks, and recurring MRR RevShare'
              : 'Referral pipeline, active trials, and payout commissions'
            }}
          </p>
        </div>
      </div>

      <!-- Header Controls: Date Filter, CSV Export & Withdrawal CTA -->
      <div class="flex items-center gap-2">
        
        <!-- Date Range Filter -->
        <div class="relative">
          <button
            @click="isDateOpen = !isDateOpen"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#23B750] focus-visible:outline-none"
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
          class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#23B750] focus-visible:outline-none"
          :title="partnerStore.activeTrack === 'sales' ? 'Export deals ledger as CSV' : 'Export referral commissions as CSV'"
        >
          <Download class="w-3.5 h-3.5 text-gray-400" />
          <span class="hidden sm:inline">Export CSV</span>
        </button>

        <!-- Primary Action: Withdraw / Payouts -->
        <router-link
          to="/partner/withdrawal?from=overview"
          class="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#23B750] hover:bg-[#1fa848] active:scale-[0.98] text-white rounded-xl text-xs font-bold shadow-sm shadow-[#23B750]/20 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#23B750] focus-visible:outline-none"
        >
          <Banknote class="w-3.5 h-3.5" />
          <span>{{ partnerStore.activeTrack === 'sales' ? 'Payouts' : 'Withdraw' }}</span>
        </router-link>

        <!-- Preview State Switcher -->
        <div class="inline-flex items-center p-0.5 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-xs">
          <button
            type="button"
            @click="isPreviewEmpty = false"
            :class="[
              'px-2 py-0.5 rounded-lg font-semibold transition-all text-[11px] cursor-pointer',
              !isPreviewEmpty ? 'bg-white dark:bg-gray-900 text-[#23B750] shadow-2xs' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            ]"
            title="Preview with active deals and data"
          >
            Active
          </button>
          <button
            type="button"
            @click="isPreviewEmpty = true"
            :class="[
              'px-2 py-0.5 rounded-lg font-semibold transition-all text-[11px] cursor-pointer',
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
    <main class="flex-1 min-h-0 overflow-y-auto scroll-smooth w-full [scrollbar-gutter:stable]">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 w-full">

        <!-- ═════════════════════════════════════════════════════════
             SECTION 1: QUIET EXECUTIVE HERO COMMAND BANNER
             Refined obsidian matte card with quiet accenting
             ═════════════════════════════════════════════════════════ -->
        <div 
          class="relative bg-gray-950 dark:bg-[#0B0F19] border border-gray-800 rounded-2xl p-6 sm:p-7 shadow-xs text-white overflow-hidden"
        >
          <!-- Subtle quiet top edge accent line -->
          <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#23B750]/40 to-transparent"></div>

          <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            <!-- Left 7 Cols: Value Prop & Action Console -->
            <div class="lg:col-span-7 space-y-4">
              <div class="flex items-center gap-2 text-xs font-semibold">
                <span class="text-[#23B750]">
                  {{ partnerStore.activeTrack === 'sales' ? 'Official Reseller Track' : 'Official Partner Program' }}
                </span>
                <span class="text-gray-500">·</span>
                <span class="text-gray-300">
                  {{ partnerStore.activeTrack === 'sales' ? 'Certified Solutions Partner (20% RevShare)' : 'Fixed RM 300 Bounty' }}
                </span>
              </div>

              <div>
                <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                  <template v-if="partnerStore.activeTrack === 'sales'">
                    Earn <span class="text-[#23B750]">20% Recurring MRR</span> on every client.
                  </template>
                  <template v-else>
                    Earn <span class="text-[#23B750]">RM 300</span> for every deal.
                  </template>
                </h2>
                <p class="text-xs sm:text-sm text-gray-400 mt-1.5 max-w-lg leading-relaxed">
                  {{ partnerStore.activeTrack === 'sales'
                    ? 'Manage B2B sales pipelines, lock 120-day client domains, and earn monthly recurring payouts for 12 months per client.'
                    : 'Share your link with businesses. When their paid plan activates, your commission is credited instantly.'
                  }}
                </p>
              </div>

              <!-- Console: Sales Action Buttons vs Referral Link -->
              <div v-if="partnerStore.activeTrack === 'sales'" class="pt-1 flex flex-wrap items-center gap-2.5">
                <router-link
                  to="/partner/referrals"
                  class="px-4 py-2 bg-[#23B750] hover:bg-[#1fa848] text-white text-xs font-bold rounded-xl shadow-xs transition-all inline-flex items-center gap-1.5 cursor-pointer active:scale-98"
                >
                  <Plus class="w-3.5 h-3.5" />
                  <span>Register Deal</span>
                </router-link>
                <router-link
                  to="/partner/referrals"
                  class="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold rounded-xl border border-white/10 hover:border-white/20 transition-all inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Briefcase class="w-3.5 h-3.5 text-gray-300" />
                  <span>Pipeline ({{ partnerStore.deals.length }} Deals)</span>
                </router-link>
                <span class="text-[11px] font-mono text-emerald-400 px-2.5 py-1 rounded-lg bg-black/40 border border-gray-800">
                  Reseller ID: RKS-MY-8821
                </span>
              </div>

              <div v-else class="pt-1 max-w-lg">
                <div class="relative flex items-center">
                  <input
                    type="text"
                    readonly
                    :value="referralLink"
                    aria-label="Direct referral link"
                    class="w-full pl-3.5 pr-26 py-2.5 text-xs bg-black/40 border border-gray-800 hover:border-gray-700 rounded-xl text-gray-200 font-mono focus:outline-none focus:border-[#23B750] focus:ring-1 focus:ring-[#23B750]/30 transition-all select-all shadow-inner"
                  />
                  <button
                    @click="copyReferralLink"
                    class="absolute right-1 px-3 py-1.5 bg-[#23B750] hover:bg-[#1fa848] active:scale-98 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                    title="Copy Link to Clipboard"
                  >
                    <component :is="isLinkCopied ? Check : Copy" class="w-3.5 h-3.5" />
                    <span>{{ isLinkCopied ? 'Copied' : 'Copy Link' }}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Right 5 Cols: Quiet High-Contrast Commercial Metrics Cluster -->
            <div class="lg:col-span-5 bg-white/[0.03] border border-gray-800 rounded-xl p-4.5 grid grid-cols-2 gap-3.5 shadow-xs">
              
              <!-- Metric 1 -->
              <div class="space-y-1">
                <div class="text-xs text-gray-400 font-medium leading-tight">
                  {{ partnerStore.activeTrack === 'sales' ? 'Monthly RevShare' : 'Available Balance' }}
                </div>
                <div class="text-2xl font-bold font-mono text-[#23B750] tracking-tight">
                  RM {{ isPreviewEmpty ? '0' : (partnerStore.activeTrack === 'sales' ? partnerStore.monthlyRecurringCommission.toLocaleString() : '1,200') }}
                </div>
                <router-link
                  :to="partnerStore.activeTrack === 'sales' ? '/partner/commissions' : '/partner/withdrawal?from=overview'"
                  class="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 hover:underline inline-flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>{{ partnerStore.activeTrack === 'sales' ? 'Recurring schedule' : 'Withdraw balance' }}</span>
                  <span>&rarr;</span>
                </router-link>
              </div>

              <!-- Metric 2 -->
              <div class="space-y-1">
                <div class="text-xs text-gray-400 font-medium leading-tight">
                  {{ partnerStore.activeTrack === 'sales' ? 'Active Accounts' : 'In Clearance' }}
                </div>
                <div class="text-2xl font-bold font-mono text-white tracking-tight">
                  {{ isPreviewEmpty ? '0' : (partnerStore.activeTrack === 'sales' ? `${partnerStore.activeAccountsCount} Accounts` : 'RM 1,500') }}
                </div>
                <p class="text-[11px] text-gray-400 font-medium">
                  {{ isPreviewEmpty ? 'None' : (partnerStore.activeTrack === 'sales' ? '100% quarterly retention' : 'Clearing in 30 days') }}
                </p>
              </div>

              <!-- Metric 3 -->
              <div class="space-y-1 border-t border-gray-800/80 pt-2.5">
                <div class="text-xs text-gray-400 font-medium leading-tight">
                  {{ partnerStore.activeTrack === 'sales' ? 'Pipeline ARR' : 'Converted Deals' }}
                </div>
                <div class="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
                  {{ isPreviewEmpty ? '0' : (partnerStore.activeTrack === 'sales' ? `RM ${partnerStore.totalPipelineARR.toLocaleString()}` : '9') }}
                </div>
                <p class="text-[11px] text-gray-400 font-medium">
                  {{ isPreviewEmpty ? 'None' : (partnerStore.activeTrack === 'sales' ? `Across ${partnerStore.activeDeals.length} active deals` : '75% conversion rate') }}
                </p>
              </div>

              <!-- Metric 4 -->
              <div class="space-y-1 border-t border-gray-800/80 pt-2.5">
                <div class="text-xs text-gray-400 font-medium leading-tight">
                  {{ partnerStore.activeTrack === 'sales' ? '120-Day Locks' : 'Total Commission Earned' }}
                </div>
                <div class="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
                  {{ isPreviewEmpty ? '0' : (partnerStore.activeTrack === 'sales' ? `${partnerStore.protectedDealsCount} Protected` : 'RM 2,700') }}
                </div>
                <p class="text-[11px] text-gray-400 font-medium">
                  {{ isPreviewEmpty ? 'None' : (partnerStore.activeTrack === 'sales' ? 'Domain exclusivity active' : 'Lifetime earnings') }}
                </p>
              </div>

            </div>

          </div>
        </div>

        <!-- ═════════════════════════════════════════════════════════
             SECTION 2: PIPELINE FUNNEL (Dynamic for Sales vs Referral)
             ═════════════════════════════════════════════════════════ -->
        <div class="bg-white dark:bg-[#0E131F] border border-gray-200/80 dark:border-gray-800/80 rounded-2xl p-4 sm:p-5 shadow-xs">
          <!-- Top Bar: Title & Filter Controls -->
          <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-3.5">
            <div class="flex items-center gap-2">
              <h3 class="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                {{ partnerStore.activeTrack === 'sales' ? 'B2B Sales Deal Pipeline' : 'Referral Pipeline' }}
              </h3>
            </div>
            <div class="flex items-center gap-2 text-xs text-gray-500">
              <div class="flex items-center gap-1.5">
                <span>Filter:</span>
                <span class="px-2 py-0.5 rounded-md font-bold bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                  {{ currentFilterLabel }}
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

          <!-- ================= SALES TRACK FUNNEL ================= -->
          <div v-if="partnerStore.activeTrack === 'sales'" class="grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch">
            
            <!-- Left: Donut Chart -->
            <div class="md:col-span-4 lg:col-span-4 p-3.5 bg-gray-50/90 dark:bg-gray-900/60 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center gap-3.5 h-full">
              <div class="relative w-[78px] h-[78px] shrink-0 flex items-center justify-center">
                <apexchart
                  type="donut"
                  width="78"
                  height="78"
                  :options="salesApexDonutOptions"
                  :series="salesApexDonutSeries"
                />
                <div class="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                  <span class="text-sm font-bold font-mono text-gray-900 dark:text-white leading-none">
                    {{ isPreviewEmpty ? 0 : salesActivePipelineCount }}
                  </span>
                </div>
              </div>

              <!-- Designed Stage Flow Steps -->
              <div class="space-y-1 min-w-0 flex-1">
                <button
                  type="button"
                  @click="setPipelineFilter('discovery')"
                  class="w-full flex items-center justify-between px-2 py-1 rounded-lg transition-colors text-left cursor-pointer hover:bg-white dark:hover:bg-gray-800 border border-transparent"
                  :class="activePipelineFilter === 'discovery' ? 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800/60' : ''"
                >
                  <div class="flex items-center gap-1.5 min-w-0">
                    <span class="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                    <span class="text-[11px] font-medium text-gray-600 dark:text-gray-300 truncate">Discovery</span>
                  </div>
                  <span class="text-[10.5px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-100/70 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 shrink-0">
                    {{ isPreviewEmpty ? 0 : 1 }}
                  </span>
                </button>

                <button
                  type="button"
                  @click="setPipelineFilter('proposal')"
                  class="w-full flex items-center justify-between px-2 py-1 rounded-lg transition-colors text-left cursor-pointer hover:bg-white dark:hover:bg-gray-800 border border-transparent"
                  :class="activePipelineFilter === 'proposal' ? 'bg-purple-50/70 dark:bg-purple-950/40 border-purple-300 dark:border-purple-800/60' : ''"
                >
                  <div class="flex items-center gap-1.5 min-w-0">
                    <span class="w-2 h-2 rounded-full bg-purple-500 shrink-0"></span>
                    <span class="text-[11px] font-medium text-gray-600 dark:text-gray-300 truncate">Proposal</span>
                  </div>
                  <span class="text-[10.5px] font-mono font-bold px-1.5 py-0.2 rounded bg-purple-100/70 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300 shrink-0">
                    {{ isPreviewEmpty ? 0 : 1 }}
                  </span>
                </button>

                <button
                  type="button"
                  @click="setPipelineFilter('in_clearance')"
                  class="w-full flex items-center justify-between px-2 py-1 rounded-lg transition-colors text-left cursor-pointer hover:bg-white dark:hover:bg-gray-800 border border-transparent"
                  :class="activePipelineFilter === 'in_clearance' ? 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800/60' : ''"
                >
                  <div class="flex items-center gap-1.5 min-w-0">
                    <span class="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
                    <span class="text-[11px] font-medium text-gray-600 dark:text-gray-300 truncate">Clearance</span>
                  </div>
                  <span class="text-[10.5px] font-mono font-bold px-1.5 py-0.2 rounded bg-rose-100/70 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 shrink-0">
                    {{ isPreviewEmpty ? 0 : 1 }}
                  </span>
                </button>

                <button
                  type="button"
                  @click="setPipelineFilter('closed_won')"
                  class="w-full flex items-center justify-between px-2 py-1 rounded-lg transition-colors text-left cursor-pointer hover:bg-white dark:hover:bg-gray-800 border border-transparent"
                  :class="activePipelineFilter === 'closed_won' ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800/60' : ''"
                >
                  <div class="flex items-center gap-1.5 min-w-0">
                    <span class="w-2 h-2 rounded-full bg-[#23B750] shrink-0"></span>
                    <span class="text-[11px] font-semibold text-gray-800 dark:text-gray-200 truncate">Closed Won</span>
                  </div>
                  <span class="text-[10.5px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-100/70 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 shrink-0">
                    {{ isPreviewEmpty ? 0 : 2 }}
                  </span>
                </button>
              </div>
            </div>

            <!-- Right: 5 Clean Stage Cards with Height Matching Donut Container -->
            <div class="md:col-span-8 lg:col-span-8 grid grid-cols-2 sm:grid-cols-5 gap-2 h-full">
              
              <!-- Stage: Registered -->
              <button
                @click="setPipelineFilter('registered')"
                class="p-2.5 rounded-xl border text-left transition-all cursor-pointer group h-full flex flex-col justify-between"
                :class="activePipelineFilter === 'registered' ? 'border-[#23B750] bg-emerald-50/40 dark:bg-emerald-950/20 shadow-xs' : 'border-gray-200/80 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'"
              >
                <div class="flex items-center justify-between">
                  <p class="text-[11px] text-gray-500 dark:text-gray-400 font-medium truncate">Registered</p>
                  <span class="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
                </div>
                <div>
                  <p class="text-base font-bold font-mono text-gray-900 dark:text-white mt-1">{{ isPreviewEmpty ? 0 : 1 }}</p>
                  <p class="text-[10px] text-gray-400 font-mono mt-0.5">RM 7.2k ARR</p>
                </div>
              </button>

              <!-- Stage: Discovery -->
              <button
                @click="setPipelineFilter('discovery')"
                class="p-2.5 rounded-xl border text-left transition-all cursor-pointer group h-full flex flex-col justify-between"
                :class="activePipelineFilter === 'discovery' ? 'border-[#23B750] bg-emerald-50/40 dark:bg-emerald-950/20 shadow-xs' : 'border-gray-200/80 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'"
              >
                <div class="flex items-center justify-between">
                  <p class="text-[11px] text-gray-500 dark:text-gray-400 font-medium truncate">Discovery</p>
                  <span class="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                </div>
                <div>
                  <p class="text-base font-bold font-mono text-gray-900 dark:text-white mt-1">{{ isPreviewEmpty ? 0 : 1 }}</p>
                  <p class="text-[10px] text-gray-400 font-mono mt-0.5">RM 14.4k ARR</p>
                </div>
              </button>

              <!-- Stage: Proposal -->
              <button
                @click="setPipelineFilter('proposal')"
                class="p-2.5 rounded-xl border text-left transition-all cursor-pointer group h-full flex flex-col justify-between"
                :class="activePipelineFilter === 'proposal' ? 'border-[#23B750] bg-emerald-50/40 dark:bg-emerald-950/20 shadow-xs' : 'border-gray-200/80 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'"
              >
                <div class="flex items-center justify-between">
                  <p class="text-[11px] text-gray-500 dark:text-gray-400 font-medium truncate">Proposal</p>
                  <span class="w-2 h-2 rounded-full bg-purple-500 shrink-0"></span>
                </div>
                <div>
                  <p class="text-base font-bold font-mono text-gray-900 dark:text-white mt-1">{{ isPreviewEmpty ? 0 : 1 }}</p>
                  <p class="text-[10px] text-gray-400 font-mono mt-0.5">RM 28.8k ARR</p>
                </div>
              </button>

              <!-- Stage: Clearance -->
              <button
                @click="setPipelineFilter('in_clearance')"
                class="p-2.5 rounded-xl border text-left transition-all cursor-pointer group h-full flex flex-col justify-between"
                :class="activePipelineFilter === 'in_clearance' ? 'border-[#23B750] bg-emerald-50/40 dark:bg-emerald-950/20 shadow-xs' : 'border-gray-200/80 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'"
              >
                <div class="flex items-center justify-between">
                  <p class="text-[11px] text-gray-500 dark:text-gray-400 font-medium truncate">Clearance</p>
                  <span class="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
                </div>
                <div>
                  <p class="text-base font-bold font-mono text-gray-900 dark:text-white mt-1">{{ isPreviewEmpty ? 0 : 1 }}</p>
                  <p class="text-[10px] text-gray-400 font-mono mt-0.5">RM 38.4k ARR</p>
                </div>
              </button>

              <!-- Stage: Closed Won -->
              <button
                @click="setPipelineFilter('closed_won')"
                class="p-2.5 rounded-xl border text-left transition-all cursor-pointer group h-full flex flex-col justify-between"
                :class="activePipelineFilter === 'closed_won' ? 'border-[#23B750] bg-emerald-50/40 dark:bg-emerald-950/20 shadow-xs' : 'border-gray-200/80 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'"
              >
                <div class="flex items-center justify-between">
                  <p class="text-[11px] text-gray-500 dark:text-gray-400 font-medium truncate">Closed Won</p>
                  <span class="w-2 h-2 rounded-full bg-[#23B750] shrink-0"></span>
                </div>
                <div>
                  <p class="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">{{ isPreviewEmpty ? 0 : 2 }}</p>
                  <p class="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 font-mono mt-0.5">RM 21.6k ARR</p>
                </div>
              </button>

            </div>
          </div>

          <!-- ================= REFERRAL TRACK FUNNEL ================= -->
          <div v-else class="grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch">
            
            <!-- Left: Donut Chart -->
            <div class="md:col-span-4 lg:col-span-4 p-3.5 bg-gray-50/90 dark:bg-gray-900/60 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center gap-3.5 h-full">
              <div class="relative w-[78px] h-[78px] shrink-0 flex items-center justify-center">
                <apexchart
                  type="donut"
                  width="78"
                  height="78"
                  :options="pipelineApexDonutOptions"
                  :series="pipelineApexDonutSeries"
                />
                <div class="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                  <span class="text-sm font-bold font-mono text-gray-900 dark:text-white leading-none">
                    {{ isPreviewEmpty ? 0 : 16 }}
                  </span>
                </div>
              </div>

              <!-- Designed Flow Legend -->
              <div class="space-y-1 min-w-0 flex-1">
                <button
                  type="button"
                  @click="setPipelineFilter('Trial Active')"
                  class="w-full flex items-center justify-between px-2 py-1 rounded-lg transition-colors text-left cursor-pointer hover:bg-white dark:hover:bg-gray-800 border border-transparent"
                  :class="activePipelineFilter === 'Trial Active' ? 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800/60' : ''"
                >
                  <div class="flex items-center gap-1.5 min-w-0">
                    <span class="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                    <span class="text-[11px] font-medium text-gray-600 dark:text-gray-300 truncate">Active Trials</span>
                  </div>
                  <span class="text-[10.5px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-100/70 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 shrink-0">
                    {{ isPreviewEmpty ? 0 : 4 }}
                  </span>
                </button>

                <button
                  type="button"
                  @click="setPipelineFilter('Awaiting Payment')"
                  class="w-full flex items-center justify-between px-2 py-1 rounded-lg transition-colors text-left cursor-pointer hover:bg-white dark:hover:bg-gray-800 border border-transparent"
                  :class="activePipelineFilter === 'Awaiting Payment' ? 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800/60' : ''"
                >
                  <div class="flex items-center gap-1.5 min-w-0">
                    <span class="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
                    <span class="text-[11px] font-medium text-gray-600 dark:text-gray-300 truncate">Awaiting Payment</span>
                  </div>
                  <span class="text-[10.5px] font-mono font-bold px-1.5 py-0.2 rounded bg-rose-100/70 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 shrink-0">
                    {{ isPreviewEmpty ? 0 : 3 }}
                  </span>
                </button>

                <button
                  type="button"
                  @click="setPipelineFilter('Converted')"
                  class="w-full flex items-center justify-between px-2 py-1 rounded-lg transition-colors text-left cursor-pointer hover:bg-white dark:hover:bg-gray-800 border border-transparent"
                  :class="activePipelineFilter === 'Converted' ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800/60' : ''"
                >
                  <div class="flex items-center gap-1.5 min-w-0">
                    <span class="w-2 h-2 rounded-full bg-[#23B750] shrink-0"></span>
                    <span class="text-[11px] font-semibold text-gray-800 dark:text-gray-200 truncate">Converted Deals</span>
                  </div>
                  <span class="text-[10.5px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-100/70 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 shrink-0">
                    {{ isPreviewEmpty ? 0 : 9 }}
                  </span>
                </button>
              </div>
            </div>

            <!-- Right: 4 Stage Cards with Matching Height -->
            <div class="md:col-span-8 lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-2.5 h-full">
              
              <button
                @click="setPipelineFilter('All')"
                class="p-2.5 sm:p-3 rounded-xl border text-left transition-all cursor-pointer group h-full flex flex-col justify-between"
                :class="activePipelineFilter === 'All' ? 'border-[#23B750] bg-emerald-50/40 dark:bg-emerald-950/20 shadow-xs' : 'border-gray-200/80 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'"
              >
                <div class="flex items-center justify-between">
                  <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">Signups</p>
                  <span class="w-2 h-2 rounded-full bg-blue-500"></span>
                </div>
                <div>
                  <p class="text-lg font-bold font-mono text-gray-900 dark:text-white mt-1">{{ isPreviewEmpty ? 0 : 12 }}</p>
                  <p class="text-[10px] text-gray-400 mt-0.5">Total registered</p>
                </div>
              </button>

              <button
                @click="setPipelineFilter('Trial Active')"
                class="p-2.5 sm:p-3 rounded-xl border text-left transition-all cursor-pointer group h-full flex flex-col justify-between"
                :class="activePipelineFilter === 'Trial Active' ? 'border-[#23B750] bg-emerald-50/40 dark:bg-emerald-950/20 shadow-xs' : 'border-gray-200/80 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'"
              >
                <div class="flex items-center justify-between">
                  <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">Active Trials</p>
                  <span class="w-2 h-2 rounded-full bg-amber-500"></span>
                </div>
                <div>
                  <p class="text-lg font-bold font-mono text-gray-900 dark:text-white mt-1">{{ isPreviewEmpty ? 0 : 4 }}</p>
                  <p class="text-[10px] text-gray-400 mt-0.5">Evaluating product</p>
                </div>
              </button>

              <button
                @click="setPipelineFilter('Awaiting Payment')"
                class="p-2.5 sm:p-3 rounded-xl border text-left transition-all cursor-pointer group h-full flex flex-col justify-between"
                :class="activePipelineFilter === 'Awaiting Payment' ? 'border-[#23B750] bg-emerald-50/40 dark:bg-emerald-950/20 shadow-xs' : 'border-gray-200/80 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'"
              >
                <div class="flex items-center justify-between">
                  <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">Awaiting Payment</p>
                  <span class="w-2 h-2 rounded-full bg-rose-500"></span>
                </div>
                <div>
                  <p class="text-lg font-bold font-mono text-gray-900 dark:text-white mt-1">{{ isPreviewEmpty ? 0 : 3 }}</p>
                  <p class="text-[10px] text-gray-400 mt-0.5">Invoice pending</p>
                </div>
              </button>

              <button
                @click="setPipelineFilter('Converted')"
                class="p-2.5 sm:p-3 rounded-xl border text-left transition-all cursor-pointer group h-full flex flex-col justify-between"
                :class="activePipelineFilter === 'Converted' ? 'border-[#23B750] bg-emerald-50/40 dark:bg-emerald-950/20 shadow-xs' : 'border-gray-200/80 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'"
              >
                <div class="flex items-center justify-between">
                  <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">Converted Deals</p>
                  <span class="w-2 h-2 rounded-full bg-[#23B750]"></span>
                </div>
                <div>
                  <p class="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">{{ isPreviewEmpty ? 0 : 9 }}</p>
                  <p class="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 mt-0.5">{{ isPreviewEmpty ? '0% win rate' : '75% win rate' }}</p>
                </div>
              </button>

            </div>
          </div>

        </div>

        <!-- ═════════════════════════════════════════════════════════
             SECTION 3: TWO-COLUMN WORKSPACE
             (Left 7 Cols: Data Ledger | Right 5 Cols: Partner Tiers)
             ═════════════════════════════════════════════════════════ -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          <!-- Left 7 Cols: Data Ledger -->
          <div class="lg:col-span-7 bg-white dark:bg-[#0E131F] border border-gray-200/80 dark:border-gray-800/80 rounded-2xl shadow-xs overflow-hidden flex flex-col">
            
            <!-- Table Subheader Tabs -->
            <div class="px-4 py-3 border-b border-gray-200/80 dark:border-gray-800/80 flex items-center justify-between shrink-0">
              <div class="flex items-center gap-2">
                <!-- Tab 1 -->
                <button
                  @click="activeLedgerTab = 'primary'"
                  :class="[
                    'whitespace-nowrap inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0',
                    activeLedgerTab === 'primary'
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-[#1a943e] dark:text-[#62D816] border border-emerald-200 dark:border-emerald-800/80'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  ]"
                >
                  <span>{{ partnerStore.activeTrack === 'sales' ? 'Client Deals' : 'Referrals' }}</span>
                  <span
                    :class="[
                      'px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold shrink-0',
                      activeLedgerTab === 'primary'
                        ? 'bg-emerald-200/60 dark:bg-emerald-800/60 text-[#157a33] dark:text-emerald-300'
                        : 'bg-gray-200/70 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    ]"
                  >
                    {{ partnerStore.activeTrack === 'sales' ? filteredSalesDeals.length : filteredReferrals.length }}
                  </span>
                </button>

                <!-- Tab 2 -->
                <button
                  @click="activeLedgerTab = 'secondary'"
                  :class="[
                    'whitespace-nowrap inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0',
                    activeLedgerTab === 'secondary'
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-[#1a943e] dark:text-[#62D816] border border-emerald-200 dark:border-emerald-800/80'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  ]"
                >
                  <span>{{ partnerStore.activeTrack === 'sales' ? 'Monthly RevShare' : 'Commissions' }}</span>
                  <span
                    :class="[
                      'px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold shrink-0',
                      activeLedgerTab === 'secondary'
                        ? 'bg-emerald-200/60 dark:bg-emerald-800/60 text-[#157a33] dark:text-emerald-300'
                        : 'bg-gray-200/70 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    ]"
                  >
                    {{ partnerStore.activeTrack === 'sales' ? partnerStore.recurringCommissions.length : filteredCommissions.length }}
                  </span>
                </button>
              </div>

              <!-- Quick Search -->
              <div class="relative w-40 sm:w-48">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Filter client..."
                  class="w-full pl-7 pr-2 py-1 text-xs bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-200 focus:outline-none focus:border-[#23B750]"
                />
                <Search class="w-3.5 h-3.5 text-gray-400 absolute left-2 top-2" />
              </div>
            </div>

            <!-- ================= SALES TAB 1: CLIENT DEALS TABLE ================= -->
            <div v-if="partnerStore.activeTrack === 'sales' && activeLedgerTab === 'primary'" class="flex-1 overflow-x-auto overflow-y-auto">
              <table class="w-full text-left text-xs border-collapse min-w-[580px] whitespace-nowrap">
                <thead>
                  <tr class="bg-gray-50/70 dark:bg-gray-800/40 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider border-b border-gray-200/80 dark:border-gray-800/80">
                    <th scope="col" class="px-4 py-2.5">Company &amp; Domain</th>
                    <th scope="col" class="px-3.5 py-2.5">Stage</th>
                    <th scope="col" class="px-4 py-2.5">Contract Value</th>
                    <th scope="col" class="px-3.5 py-2.5">120-Day Lock</th>
                    <th scope="col" class="px-3 py-2.5 text-right w-12"><span class="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-800/80">
                  <tr v-if="filteredSalesDeals.length === 0">
                    <td colspan="5" class="py-10 text-center text-gray-400">
                      <p class="font-semibold text-gray-600 dark:text-gray-300">No deals match this stage filter.</p>
                      <p class="text-xs mt-0.5">Try resetting the stage filter or register a new deal.</p>
                    </td>
                  </tr>
                  <tr
                    v-for="deal in filteredSalesDeals"
                    :key="deal.id"
                    class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                  >
                    <td class="px-4 py-2.5">
                      <div class="flex items-center gap-2">
                        <div class="w-7 h-7 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-[#23B750] font-bold flex items-center justify-center text-xs shrink-0 border border-emerald-200 dark:border-emerald-800">
                          {{ deal.companyName.charAt(0) }}
                        </div>
                        <div class="min-w-0 max-w-[150px] sm:max-w-[180px]">
                          <p class="font-bold text-gray-900 dark:text-white truncate">{{ deal.companyName }}</p>
                          <p class="text-[11px] text-gray-400 font-mono truncate">{{ deal.domain }}</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-3.5 py-2.5">
                      <span
                        :class="[
                          'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border shrink-0',
                          getSalesStageBadgeClass(deal.stage)
                        ]"
                      >
                        {{ formatStageLabel(deal.stage) }}
                      </span>
                    </td>
                    <td class="px-4 py-2.5">
                      <p class="font-mono font-bold text-gray-900 dark:text-white text-xs">
                        RM {{ deal.arrValue.toLocaleString() }} ARR
                      </p>
                      <p class="text-[10.5px] text-gray-400">
                        {{ deal.planTier }} · RM {{ deal.mrrValue.toLocaleString() }}/mo
                      </p>
                    </td>
                    <td class="px-3.5 py-2.5">
                      <span
                        v-if="deal.stage === 'closed_won'"
                        class="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 shrink-0"
                      >
                        <ShieldCheck class="w-3.5 h-3.5 shrink-0" />
                        <span>Active Book</span>
                      </span>
                      <span
                        v-else-if="deal.protectionDaysRemaining > 0"
                        class="inline-flex items-center gap-1 text-[11px] font-mono text-gray-600 dark:text-gray-300 shrink-0"
                      >
                        <Lock class="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>{{ deal.protectionDaysRemaining }}d left</span>
                      </span>
                      <span v-else class="text-[11px] text-gray-400 shrink-0">Expired</span>
                    </td>
                    <td class="px-3 py-2.5 text-right relative">
                      <div class="inline-block text-left">
                        <button
                          @click.stop="toggleRowMenu(deal.id)"
                          class="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                          title="More options"
                          aria-label="More options"
                        >
                          <MoreVertical class="w-4 h-4" />
                        </button>

                        <div
                          v-if="openRowMenuId === deal.id"
                          @click.stop
                          class="absolute right-2 mt-1 w-44 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl py-1 z-30 text-xs space-y-0.5 animate-in fade-in zoom-in-95 duration-100 text-left"
                        >
                          <router-link
                            to="/partner/referrals"
                            class="w-full text-left px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 hover:text-[#23B750] dark:hover:text-emerald-400 font-medium flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            <Briefcase class="w-3.5 h-3.5 text-[#23B750]" />
                            <span>View in Pipeline</span>
                          </router-link>
                          <button
                            @click="handleSalesDealAction('copy_domain', deal)"
                            class="w-full text-left px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            <Copy class="w-3.5 h-3.5 text-gray-400" />
                            <span>Copy Domain</span>
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- ================= SALES TAB 2: MONTHLY REVSHARE COHORTS ================= -->
            <div v-else-if="partnerStore.activeTrack === 'sales' && activeLedgerTab === 'secondary'" class="flex-1 overflow-x-auto overflow-y-auto">
              <table class="w-full text-left text-xs border-collapse min-w-[540px] whitespace-nowrap">
                <thead>
                  <tr class="bg-gray-50/70 dark:bg-gray-800/40 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider border-b border-gray-200/80 dark:border-gray-800/80">
                    <th scope="col" class="px-4 py-2.5">Client Account</th>
                    <th scope="col" class="px-3.5 py-2.5">RevShare Plan</th>
                    <th scope="col" class="px-4 py-2.5">Disbursement Cohort</th>
                    <th scope="col" class="px-4 py-2.5 text-right">Monthly Payout</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-800/80">
                  <tr
                    v-for="rec in filteredSalesCommissions"
                    :key="rec.id"
                    class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                  >
                    <td class="px-4 py-2.5">
                      <div class="flex items-center gap-2">
                        <div class="w-7 h-7 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-[#23B750] font-bold flex items-center justify-center text-xs shrink-0 border border-emerald-200 dark:border-emerald-800">
                          {{ rec.clientName.charAt(0) }}
                        </div>
                        <div class="min-w-0 max-w-[150px] sm:max-w-[180px]">
                          <p class="font-bold text-gray-900 dark:text-white truncate">{{ rec.clientName }}</p>
                          <p class="text-[11px] text-gray-400 truncate">{{ rec.plan }} Plan · RM {{ rec.clientMRR }}/mo MRR</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-3.5 py-2.5">
                      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800 shrink-0">
                        {{ rec.revSharePercent }}% RevShare
                      </span>
                    </td>
                    <td class="px-4 py-2.5">
                      <p class="text-xs font-semibold text-gray-800 dark:text-gray-200 font-mono">
                        Month {{ rec.monthElapsed }} of {{ rec.totalMonths }}
                      </p>
                      <p class="text-[10.5px] text-gray-400">Next payout: {{ rec.nextDisbursementDate }}</p>
                    </td>
                    <td class="px-4 py-2.5 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      +RM {{ rec.monthlyCommission }}/mo
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- ================= REFERRAL TAB 1: REFERRALS TABLE ================= -->
            <div v-else-if="partnerStore.activeTrack === 'referral' && activeLedgerTab === 'primary'" class="flex-1 overflow-x-auto overflow-y-auto">
              <table class="w-full text-left text-xs border-collapse min-w-[540px] whitespace-nowrap">
                <thead>
                  <tr class="bg-gray-50/70 dark:bg-gray-800/40 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider border-b border-gray-200/80 dark:border-gray-800/80">
                    <th scope="col" class="px-4 py-2.5">Business</th>
                    <th scope="col" class="px-3.5 py-2.5">Stage</th>
                    <th scope="col" class="px-3.5 py-2.5">Date</th>
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
                        <div class="min-w-0 max-w-[150px] sm:max-w-[180px]">
                          <p class="font-bold text-gray-900 dark:text-white truncate">{{ referral.company }}</p>
                          <p class="text-[11px] text-gray-400 truncate">{{ referral.contact }}</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-3.5 py-2.5">
                      <span
                        :class="[
                          'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border shrink-0',
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
                    <td class="px-3.5 py-2.5 font-mono text-gray-500 dark:text-gray-400 text-xs">
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
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- ================= REFERRAL TAB 2: COMMISSIONS TABLE ================= -->
            <div v-else class="flex-1 overflow-x-auto overflow-y-auto">
              <table class="w-full text-left text-xs border-collapse min-w-[500px] whitespace-nowrap">
                <thead>
                  <tr class="bg-gray-50/70 dark:bg-gray-800/40 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider border-b border-gray-200/80 dark:border-gray-800/80">
                    <th scope="col" class="px-4 py-2.5">Source</th>
                    <th scope="col" class="px-4 py-2.5">Commission Type</th>
                    <th scope="col" class="px-3.5 py-2.5">Status</th>
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
                        <div class="min-w-0 max-w-[150px] sm:max-w-[180px]">
                          <p class="font-bold text-gray-900 dark:text-white truncate">{{ comm.source }}</p>
                          <p class="text-[11px] text-gray-400 truncate">{{ comm.contact }}</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-4 py-2.5 text-gray-500 dark:text-gray-400">
                      {{ comm.tier }}
                    </td>
                    <td class="px-3.5 py-2.5">
                      <span
                        :class="[
                          'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border shrink-0',
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

            <!-- Table Footer: Navigation CTA -->
            <div class="px-4 py-2.5 bg-gray-50/60 dark:bg-gray-800/30 border-t border-gray-200/80 dark:border-gray-800/80 flex items-center justify-between text-xs shrink-0">
              <span class="text-gray-500 dark:text-gray-400">
                Showing {{ partnerStore.activeTrack === 'sales' ? (activeLedgerTab === 'primary' ? 'active client deals' : 'recurring payouts') : (activeLedgerTab === 'primary' ? 'recent referrals' : 'commissions') }}
              </span>
              <router-link
                :to="partnerStore.activeTrack === 'sales' ? (activeLedgerTab === 'primary' ? '/partner/referrals?from=overview' : '/partner/commissions?from=overview') : (activeLedgerTab === 'primary' ? '/partner/referrals?from=overview' : '/partner/commissions?from=overview')"
                class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-semibold inline-flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>
                  {{ partnerStore.activeTrack === 'sales' ? (activeLedgerTab === 'primary' ? 'Go to Deals Pipeline main page' : 'Go to Recurring Schedule') : (activeLedgerTab === 'primary' ? 'Go to My Referral main page' : 'Go to Commissions main page') }}
                </span>
                <ArrowRight class="w-3.5 h-3.5" />
              </router-link>
            </div>

          </div>

          <!-- Right 5 Cols: Partner Tier & Compensation Card (Quiet, Clarified, Action-Oriented) -->
          <div class="lg:col-span-5 bg-white dark:bg-[#0E131F] border border-gray-200/80 dark:border-gray-800/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-4">
            
            <!-- Top Section: Header & Active Benefits -->
            <div class="space-y-4">
              <!-- Header: Current Tier & Status -->
              <div class="flex items-start justify-between gap-3 border-b border-gray-100 dark:border-gray-800/80 pb-3">
                <div class="min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-[#23B750] shrink-0"></span>
                    <h3 class="text-sm font-bold text-gray-900 dark:text-white truncate">
                      {{ partnerStore.activeTrack === 'sales' ? 'Certified Solutions Partner' : 'Referral Partner' }}
                    </h3>
                  </div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {{ partnerStore.activeTrack === 'sales' ? 'Official Reseller Track · Active Tier' : 'Standard Affiliate Track · Active Model' }}
                  </p>
                </div>

                <!-- Rate / Compensation Pill -->
                <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/50 shrink-0">
                  {{ partnerStore.activeTrack === 'sales' ? '20% Recurring MRR' : 'RM 300 / Deal' }}
                </span>
              </div>

              <!-- Active Entitlements / Benefits -->
              <div class="space-y-2">
                <div class="flex items-center justify-between text-xs">
                  <span class="font-semibold text-gray-700 dark:text-gray-300">Your Current Benefits</span>
                  <span class="text-[11px] text-gray-400 font-medium">Included in this tier</span>
                </div>

                <!-- Sales Track Benefits List -->
                <div v-if="partnerStore.activeTrack === 'sales'" class="space-y-1.5">
                  <div class="flex items-start gap-2 p-2 rounded-lg bg-gray-50/70 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800/60 text-xs">
                    <Check class="w-3.5 h-3.5 text-[#23B750] shrink-0 mt-0.5" />
                    <div class="min-w-0">
                      <span class="font-semibold text-gray-800 dark:text-gray-200">20% Monthly RevShare:</span>
                      <span class="text-gray-500 dark:text-gray-400 ml-1">Disbursed monthly for 12 months per closed client</span>
                    </div>
                  </div>

                  <div class="flex items-start gap-2 p-2 rounded-lg bg-gray-50/70 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800/60 text-xs">
                    <Check class="w-3.5 h-3.5 text-[#23B750] shrink-0 mt-0.5" />
                    <div class="min-w-0">
                      <span class="font-semibold text-gray-800 dark:text-gray-200">120-Day Domain Exclusivity:</span>
                      <span class="text-gray-500 dark:text-gray-400 ml-1">Deal registrations are protected and locked to your ID</span>
                    </div>
                  </div>

                  <div class="flex items-start gap-2 p-2 rounded-lg bg-gray-50/70 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800/60 text-xs">
                    <Check class="w-3.5 h-3.5 text-[#23B750] shrink-0 mt-0.5" />
                    <div class="min-w-0">
                      <span class="font-semibold text-gray-800 dark:text-gray-200">Dedicated Account Manager:</span>
                      <span class="text-gray-500 dark:text-gray-400 ml-1">Direct RFP & pricing support for client pitches</span>
                    </div>
                  </div>
                </div>

                <!-- Referral Track Benefits List -->
                <div v-else class="space-y-1.5">
                  <div class="flex items-start gap-2 p-2 rounded-lg bg-gray-50/70 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800/60 text-xs">
                    <Check class="w-3.5 h-3.5 text-[#23B750] shrink-0 mt-0.5" />
                    <div class="min-w-0">
                      <span class="font-semibold text-gray-800 dark:text-gray-200">Fixed RM 300 Cash Bounty:</span>
                      <span class="text-gray-500 dark:text-gray-400 ml-1">Paid out on every verified paid software subscription</span>
                    </div>
                  </div>

                  <div class="flex items-start gap-2 p-2 rounded-lg bg-gray-50/70 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800/60 text-xs">
                    <Check class="w-3.5 h-3.5 text-[#23B750] shrink-0 mt-0.5" />
                    <div class="min-w-0">
                      <span class="font-semibold text-gray-800 dark:text-gray-200">90-Day Cookie Tracking:</span>
                      <span class="text-gray-500 dark:text-gray-400 ml-1">Clients clicking your link are credited to you for 90 days</span>
                    </div>
                  </div>

                  <div class="flex items-start gap-2 p-2 rounded-lg bg-gray-50/70 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800/60 text-xs">
                    <Check class="w-3.5 h-3.5 text-[#23B750] shrink-0 mt-0.5" />
                    <div class="min-w-0">
                      <span class="font-semibold text-gray-800 dark:text-gray-200">Zero Volume Quotas:</span>
                      <span class="text-gray-500 dark:text-gray-400 ml-1">No monthly minimums, no penalties, no tier degradation</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Next Upgrade Milestone Block (Appetizing Green Gradient & Vibrant Progress) -->
              <div class="relative overflow-hidden p-3.5 rounded-xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-teal-500/10 dark:from-emerald-950/40 dark:via-[#092215]/60 dark:to-[#0B1520] border border-emerald-500/25 dark:border-emerald-500/30 shadow-xs space-y-2.5">
                <template v-if="partnerStore.activeTrack === 'sales'">
                  <div class="flex items-start justify-between gap-2 text-xs">
                    <div>
                      <div class="flex items-center gap-1.5 font-bold text-gray-900 dark:text-white">
                        <Sparkles class="w-3.5 h-3.5 text-[#23B750]" />
                        <span>Next Upgrade: Premier Reseller</span>
                      </div>
                      <p class="text-[11px] text-gray-600 dark:text-gray-300 mt-0.5">
                        Unlocks <strong class="text-emerald-700 dark:text-emerald-400 font-bold">25% MRR (+5%)</strong> + <strong class="text-gray-800 dark:text-white font-semibold">RM 10,000 Co-Op MDF</strong>
                      </p>
                    </div>
                    <span class="font-mono font-bold text-xs text-[#23B750] bg-emerald-500/10 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/20 shrink-0">
                      {{ isPreviewEmpty ? '0%' : '62.4%' }}
                    </span>
                  </div>

                  <!-- Progress Bar: Appetizing Green Gradient Fill -->
                  <div class="w-full h-2 bg-emerald-950/10 dark:bg-emerald-950/60 rounded-full overflow-hidden p-0.5 border border-emerald-500/15">
                    <div
                      class="h-full bg-gradient-to-r from-emerald-500 via-[#23B750] to-teal-400 rounded-full shadow-xs transition-all duration-500"
                      :style="{ width: isPreviewEmpty ? '0%' : '62.4%' }"
                    ></div>
                  </div>

                  <!-- Progress Status Line -->
                  <div class="flex items-center justify-between text-[11px] font-mono text-gray-600 dark:text-gray-400">
                    <span>
                      {{ isPreviewEmpty ? 'RM 0 of RM 200,000 ARR' : 'RM 124,800 of RM 200,000 ARR' }}
                    </span>
                    <span class="font-bold text-emerald-700 dark:text-emerald-300">
                      {{ isPreviewEmpty ? 'RM 200,000 to upgrade' : 'RM 75,200 to upgrade' }}
                    </span>
                  </div>
                </template>

                <template v-else>
                  <div class="flex items-start justify-between gap-2 text-xs">
                    <div>
                      <div class="flex items-center gap-1.5 font-bold text-gray-900 dark:text-white">
                        <Sparkles class="w-3.5 h-3.5 text-[#23B750]" />
                        <span>Next Upgrade: Reseller Track</span>
                      </div>
                      <p class="text-[11px] text-gray-600 dark:text-gray-300 mt-0.5">
                        Graduate to <strong class="text-emerald-700 dark:text-emerald-400 font-bold">15% – 25% recurring MRR</strong> on closed deals
                      </p>
                    </div>
                    <span class="font-mono font-bold text-xs text-[#23B750] bg-emerald-500/10 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/20 shrink-0">
                      {{ isPreviewEmpty ? '0 / 5' : '4 / 5' }}
                    </span>
                  </div>

                  <!-- Progress Bar: Appetizing Green Gradient Fill -->
                  <div class="w-full h-2 bg-emerald-950/10 dark:bg-emerald-950/60 rounded-full overflow-hidden p-0.5 border border-emerald-500/15">
                    <div
                      class="h-full bg-gradient-to-r from-emerald-500 via-[#23B750] to-teal-400 rounded-full shadow-xs transition-all duration-500"
                      :style="{ width: isPreviewEmpty ? '0%' : '80%' }"
                    ></div>
                  </div>

                  <!-- Progress Status Line -->
                  <div class="flex items-center justify-between text-[11px] font-mono text-gray-600 dark:text-gray-400">
                    <span>
                      {{ isPreviewEmpty ? '0 conversions so far' : '4 conversions completed' }}
                    </span>
                    <span class="font-bold text-emerald-700 dark:text-emerald-300">
                      {{ isPreviewEmpty ? '5 conversions to fast-track' : '1 more to fast-track' }}
                    </span>
                  </div>
                </template>
              </div>
            </div>

            <!-- Bottom Section: Direct CTA to Partner Program Page -->
            <div class="pt-2 border-t border-gray-100 dark:border-gray-800/80">
              <router-link
                to="/partner/program"
                class="w-full py-2 px-3 text-xs font-bold text-[#23B750] hover:text-white bg-emerald-50/70 hover:bg-[#23B750] dark:bg-emerald-950/30 dark:hover:bg-[#23B750] border border-emerald-200/70 hover:border-[#23B750] dark:border-emerald-800/50 dark:hover:border-[#23B750] rounded-xl transition-all duration-150 cursor-pointer inline-flex items-center justify-center gap-1.5 active:scale-[0.99] shadow-2xs group"
              >
                <span>{{ partnerStore.activeTrack === 'sales' ? 'View Partner Program & All Tiers' : 'View Partner Program & Reseller Benefits' }}</span>
                <ArrowRight class="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
              </router-link>
            </div>

          </div>

        </div>

      </div>

      <!-- ═════════════════════════════════════════════════════════
           SECTION 4: BOTTOM PAGE BANNER (Clean, quiet Mascot Artwork)
           ═════════════════════════════════════════════════════════ -->
      <div class="w-full bottom-page-banner pb-0 flex flex-col items-center justify-end text-center overflow-hidden" style="padding-top: 50px;">
        <div class="relative w-full leading-none overflow-hidden flex justify-center">
          <img
            src="/images/partner-team-mascots.png"
            alt="RakanSales AI Sales Crew"
            class="w-full h-auto object-cover sm:object-contain object-bottom block"
          />

          <div class="absolute top-[8%] sm:top-[10%] md:top-[12%] inset-x-0 mx-auto px-4 max-w-md text-center pointer-events-none z-10">
            <h3 class="text-sm sm:text-base font-semibold text-gray-500 dark:text-gray-400 tracking-tight">
              {{ partnerStore.activeTrack === 'sales' ? 'Enterprise B2B Partner Ecosystem' : "You've reached the end, partner!" }}
            </h3>
            <p class="text-xs text-gray-400 dark:text-gray-500 mt-0.5 leading-relaxed">
              {{ partnerStore.activeTrack === 'sales' ? 'Register and close client deals to unlock Premier Reseller status and 25% recurring rev share.' : 'Share your unique referral link to earn a fixed RM 300 for every business that subscribes.' }}
            </p>
          </div>
        </div>
      </div>

    </main>

    <!-- ═════════════════════════════════════════════════════════
         MODAL 1: WITHDRAW / DISBURSEMENT MODAL
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
              <h3 class="text-base font-bold text-gray-900 dark:text-white">
                {{ partnerStore.activeTrack === 'sales' ? 'RevShare Disbursements' : 'Withdraw Earnings' }}
              </h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">Transfer to your Malaysian bank account</p>
            </div>
          </div>
          <button @click="showWithdrawModal = false" class="text-gray-400 hover:text-gray-700 p-1 cursor-pointer" aria-label="Close modal">✕</button>
        </div>

        <div class="space-y-3.5 text-xs">
          <!-- Available balance card -->
          <div class="bg-emerald-50/50 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800 flex justify-between items-center">
            <span class="text-gray-600 dark:text-gray-400 font-medium">
              {{ partnerStore.activeTrack === 'sales' ? 'Available Monthly RevShare' : 'Available Balance' }}
            </span>
            <span class="font-mono font-bold text-base text-emerald-700 dark:text-emerald-400">
              RM {{ isPreviewEmpty ? '0' : (partnerStore.activeTrack === 'sales' ? partnerStore.monthlyRecurringCommission.toLocaleString() : '1,200') }}
            </span>
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
            class="px-5 py-2 bg-[#23B750] hover:bg-[#1fa848] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
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
              <h3 class="text-base font-bold text-gray-900 dark:text-white">
                {{ partnerStore.activeTrack === 'sales' ? 'Reseller Accreditation Tracks' : 'Referral Program Parameters' }}
              </h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ partnerStore.activeTrack === 'sales' ? 'Accreditation tiers, recurring RevShare rates, and co-marketing perks' : 'Fixed commission structure, clearance timeline, and tracking rules' }}
              </p>
            </div>
          </div>
          <button @click="showUpgradeModal = false" class="text-gray-400 hover:text-gray-700 p-1 cursor-pointer" aria-label="Close modal">✕</button>
        </div>

        <div class="space-y-2.5">
          <template v-if="partnerStore.activeTrack === 'sales'">
            <div
              v-for="tier in salesTierDetails"
              :key="tier.name"
              class="p-3 rounded-xl border transition-all"
              :class="tier.current ? 'border-[#23B750] bg-emerald-50/20 dark:bg-emerald-950/10' : 'border-gray-200 dark:border-gray-800'"
            >
              <div class="flex items-center justify-between">
                <div>
                  <span class="font-bold text-sm text-gray-900 dark:text-white">{{ tier.name }}</span>
                  <span class="text-xs text-gray-500 ml-2">({{ tier.range }})</span>
                </div>
                <span class="text-sm font-bold text-[#23B750] font-mono">{{ tier.payout }}</span>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ tier.description }}</p>
            </div>
          </template>
          <template v-else>
            <div
              v-for="item in referralProgramParameters"
              :key="item.name"
              class="p-3 rounded-xl border border-gray-200 dark:border-gray-800 transition-all"
            >
              <div class="flex items-center justify-between">
                <div>
                  <span class="font-bold text-sm text-gray-900 dark:text-white">{{ item.name }}</span>
                  <span class="text-xs text-gray-500 ml-2">({{ item.scope }})</span>
                </div>
                <span class="text-sm font-bold text-[#23B750] font-mono">{{ item.value }}</span>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ item.description }}</p>
            </div>
          </template>
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
            class="px-5 py-2 bg-[#23B750] hover:bg-[#1fa848] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
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
import { useRoute, useRouter } from 'vue-router';
import { usePartnerStore, type DealItem, type DealStage } from '@/stores/partner';
import {
  Calendar, ChevronDown, Download, Check, CheckCircle2,
  Copy, Sparkles, Award, Banknote, Search, RotateCcw, Lock,
  MoreVertical, Archive, Trash2, MessageCircle, ArrowRight,
  Briefcase, ShieldCheck, Plus, Users
} from 'lucide-vue-next';

const partnerStore = usePartnerStore();
const router = useRouter();
const route = useRoute();

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

// Dedicated Pipeline Filter State
const activePipelineFilter = ref('All');

function setPipelineFilter(stage: string) {
  if (activePipelineFilter.value === stage) {
    activePipelineFilter.value = 'All';
    showToast('Filter reset to All');
  } else {
    activePipelineFilter.value = stage;
    showToast(`Filtered by ${formatStageLabel(stage)}`);
  }
}

const currentFilterLabel = computed(() => {
  if (activePipelineFilter.value === 'All') return 'All';
  return formatStageLabel(activePipelineFilter.value);
});

function formatStageLabel(stage: string) {
  switch (stage) {
    case 'registered': return 'Registered';
    case 'discovery': return 'Discovery & Demo';
    case 'proposal': return 'Proposal Sent';
    case 'in_clearance': return 'In Clearance';
    case 'closed_won': return 'Closed Won';
    case 'closed_lost': return 'Closed Lost';
    default: return stage;
  }
}

function getSalesStageBadgeClass(stage: DealStage) {
  switch (stage) {
    case 'registered':
      return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800';
    case 'discovery':
      return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800';
    case 'proposal':
      return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800';
    case 'in_clearance':
      return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800';
    case 'closed_won':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
  }
}

// Ledger Tab & Search
const activeLedgerTab = ref<'primary' | 'secondary'>('primary');
const searchQuery = ref('');

// Modals
const showUpgradeModal = ref(false);
const showWithdrawModal = ref(false);

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

function submitWithdrawal() {
  showWithdrawModal.value = false;
  showToast(`Withdrawal of RM ${withdrawAmount.value} submitted to ${withdrawBank.value}`);
}

function applyForUpgrade() {
  showUpgradeModal.value = false;
  showToast('Track upgrade request submitted');
}

// Row Kebab Actions
const openRowMenuId = ref<string | number | null>(null);

function toggleRowMenu(id: string | number) {
  openRowMenuId.value = openRowMenuId.value === id ? null : id;
}

function handleRowAction(action: 'follow_up' | 'copy_details' | 'archive', referral: typeof sampleReferrals[0]) {
  openRowMenuId.value = null;
  if (action === 'follow_up') {
    showToast(`Opening WhatsApp follow-up for ${referral.company}`);
  } else if (action === 'copy_details') {
    navigator.clipboard.writeText(`${referral.company} - ${referral.contact}`);
    showToast(`Copied contact details for ${referral.company}`);
  } else if (action === 'archive') {
    showToast(`Archived referral: ${referral.company}`);
  }
}

function handleSalesDealAction(action: 'copy_domain', deal: DealItem) {
  openRowMenuId.value = null;
  if (action === 'copy_domain') {
    navigator.clipboard.writeText(deal.domain);
    showToast(`Copied domain: ${deal.domain}`);
  }
}

// Real CSV Download
function downloadCSV() {
  if (partnerStore.activeTrack === 'sales') {
    const headers = ['Deal ID', 'Company', 'Domain', 'Plan', 'MRR (MYR)', 'ARR (MYR)', 'Stage', 'Exclusivity Days Left'];
    const rows = partnerStore.deals.map(d => [
      `"${d.id}"`,
      `"${d.companyName}"`,
      `"${d.domain}"`,
      `"${d.planTier}"`,
      d.mrrValue,
      d.arrValue,
      `"${d.stage}"`,
      d.protectionDaysRemaining
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', 'RakanSales_Sales_Deals_Ledger.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Downloaded RakanSales_Sales_Deals_Ledger.csv');
  } else {
    const headers = ['Company', 'Contact', 'Pipeline Stage', 'Signed Up', 'Payout (RM)'];
    const rows = sampleReferrals.map(r => [
      `"${r.company}"`,
      `"${r.contact}"`,
      `"${r.status}"`,
      `"${r.signupDate}"`,
      r.payout
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', 'RakanSales_Partner_Referrals.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Downloaded RakanSales_Partner_Referrals.csv');
  }
}

// -------------------------------------------------------------
// SALES TRACK STAGE COUNTS & DONUT CHART CONFIG
// -------------------------------------------------------------
const salesActivePipelineCount = computed(() => {
  return partnerStore.deals.filter(d => d.stage !== 'closed_lost').length;
});

const salesApexDonutOptions = computed(() => ({
  chart: {
    type: 'donut',
    fontFamily: 'Inter, sans-serif',
    sparkline: { enabled: true },
    parentHeightOffset: 0,
    animations: { enabled: true, dynamicAnimation: { speed: 300 } }
  },
  labels: isPreviewEmpty.value
    ? ['No Active Deals']
    : ['Discovery & Demo', 'Proposal Sent', 'In Clearance', 'Closed Won'],
  colors: isPreviewEmpty.value
    ? ['#E5E7EB']
    : ['#F59E0B', '#8B5CF6', '#F43F5E', '#23B750'],
  stroke: { width: 2, colors: ['transparent'] },
  legend: { show: false },
  dataLabels: { enabled: false },
  plotOptions: {
    pie: {
      customScale: 0.9,
      expandOnClick: false,
      donut: {
        size: '68%',
        labels: { show: false }
      }
    }
  },
  tooltip: {
    theme: 'dark',
    y: {
      formatter: (val: number) => isPreviewEmpty.value ? '0 deals' : `${val} ${val === 1 ? 'deal' : 'deals'}`
    }
  }
}));

const salesApexDonutSeries = computed(() => {
  if (isPreviewEmpty.value) return [1];
  return [1, 1, 1, 2];
});

// -------------------------------------------------------------
// REFERRAL TRACK PIPELINE DONUT CONFIG
// -------------------------------------------------------------
const pipelineApexDonutOptions = computed(() => ({
  chart: {
    type: 'donut',
    fontFamily: 'Inter, sans-serif',
    sparkline: { enabled: true },
    parentHeightOffset: 0,
    animations: { enabled: true, dynamicAnimation: { speed: 300 } }
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
        labels: { show: false }
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

// -------------------------------------------------------------
// DATASETS & COMPUTED LEDGER TABLES
// -------------------------------------------------------------
const filteredSalesDeals = computed(() => {
  if (isPreviewEmpty.value) return [];
  return partnerStore.deals.filter(d => {
    const matchesFilter = activePipelineFilter.value === 'All' || d.stage === activePipelineFilter.value;
    const matchesQuery = !searchQuery.value ||
      d.companyName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      d.domain.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      d.contactName.toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchesFilter && matchesQuery;
  });
});

const filteredSalesCommissions = computed(() => {
  if (isPreviewEmpty.value) return [];
  return partnerStore.recurringCommissions.filter(c => {
    return !searchQuery.value ||
      c.clientName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      c.plan.toLowerCase().includes(searchQuery.value.toLowerCase());
  });
});

// Sample Partner Referrals Dataset
const sampleReferrals = [
  { id: 1, company: 'Apex Logistics Sdn Bhd', contact: 'Zul Hilmi (CTO)', status: 'Converted', signupDate: '18 Sep 2026', payout: '300' },
  { id: 2, company: 'Zenith Retail Chain', contact: 'Rachel Ong (Operations)', status: 'Converted', signupDate: '12 Sep 2026', payout: '300' },
  { id: 3, company: 'Innopay FinTech', contact: 'Arun Kumar (MD)', status: 'Awaiting Payment', signupDate: '09 Sep 2026', payout: '300' },
  { id: 4, company: 'Cahaya Pharmacy', contact: 'Dr. Noraini', status: 'Trial Active', signupDate: '04 Sep 2026', payout: '300' },
  { id: 5, company: 'Mega Jaya Wholesale', contact: 'Tan Sri Dato Lee', status: 'Converted', signupDate: '01 Sep 2026', payout: '300' },
  { id: 6, company: 'Vortex Global Tech', contact: 'Harith Iskandar', status: 'Trial Active', signupDate: '28 Aug 2026', payout: '300' },
];

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
  { id: 101, source: 'Apex Logistics Sdn Bhd', contact: 'Zul Hilmi (CTO)', tier: 'Fixed Referral Bounty', status: 'Cleared', payout: '300' },
  { id: 102, source: 'Zenith Retail Chain', contact: 'Rachel Ong (Operations)', tier: 'Fixed Referral Bounty', status: 'Cleared', payout: '300' },
  { id: 103, source: 'Mega Jaya Wholesale', contact: 'Tan Sri Dato Lee', tier: 'Fixed Referral Bounty', status: 'Cleared', payout: '300' },
  { id: 104, source: 'Innopay FinTech', contact: 'Arun Kumar (MD)', tier: 'Fixed Referral Bounty', status: 'In Clearance (~30d)', payout: '300' },
  { id: 105, source: 'Cahaya Pharmacy', contact: 'Dr. Noraini', tier: 'Fixed Referral Bounty', status: 'In Clearance (~30d)', payout: '300' },
];

const filteredCommissions = computed(() => {
  if (isPreviewEmpty.value) return [];
  return sampleCommissions.filter(c => {
    return !searchQuery.value ||
      c.source.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      c.contact.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      c.tier.toLowerCase().includes(searchQuery.value.toLowerCase());
  });
});

// -------------------------------------------------------------
// SALES ACCREDITATION TIERS (Details for Perks Modal)
// -------------------------------------------------------------
const salesTierDetails = [
  { name: 'Registered Reseller', range: 'Up to RM 50k ARR Book', payout: '15% Recurring MRR', current: false, description: 'Zero minimum commitments. Standard partner portal and deal registration.' },
  { name: 'Certified Solutions Partner', range: 'RM 50k – RM 200k ARR Book', payout: '20% Recurring MRR', current: true, description: 'Dedicated Partner Account Manager, 120-day exclusivity locks, prioritized clearance.' },
  { name: 'Premier Reseller', range: 'RM 200k+ ARR Book', payout: '25% Recurring MRR + RM 10k MDF', current: false, description: 'Dedicated Enterprise Account Manager, executive sponsorship, quarterly co-marketing funds.' },
];

// -------------------------------------------------------------
// REFERRAL PROGRAM CONFIG (Parameters for Details Modal)
// -------------------------------------------------------------

const referralProgramParameters = [
  { name: 'Fixed Commission Bounty', scope: 'All Deals', value: 'RM 300 / deal', description: 'Fixed flat cash bounty paid out per verified new subscription with no volume tiers.' },
  { name: 'Attribution Tracking', scope: 'Cookie Window', value: '90 Days', description: 'Clients clicking your link are permanently attributed to your account for 90 days.' },
  { name: 'Settlement Window', scope: 'Payment Clearance', value: '30 Days', description: 'Commissions clear for withdrawal 30 calendar days post customer invoice settlement.' },
  { name: 'Volume Requirement', scope: 'Commitment', value: 'None', description: 'Zero minimum quota or tier maintenance. Full earnings flexibility with no tier degradation.' },
];

// Close kebab dropdown when clicking outside
onMounted(() => {
  window.addEventListener('click', () => {
    openRowMenuId.value = null;
  });
});
</script>

<style scoped>
/* Bottom Page Banner Clearance */
.bottom-page-banner {
  padding-top: 50px;
}
</style>
