<template>
  <div class="h-full flex flex-col bg-[#FAF5FF]/30 dark:bg-[#0B0F17] text-gray-900 dark:text-gray-100 font-sans antialiased overflow-hidden">
    
    <!-- 1-Line CRM Setup Status Bar on top of page -->
    <CrmSetupStatusBar @toast="showToast" />

    <!-- Top Header Bar -->
    <header class="bg-white/95 dark:bg-[#111827]/95 backdrop-blur-md border-b border-gray-200/90 dark:border-gray-800/90 px-6 py-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0 z-20">
      <div class="flex items-center gap-3">
        <!-- Navigation Tab Switcher -->
        <nav class="flex items-center p-1 bg-gray-100 dark:bg-gray-800/70 rounded-xl border border-gray-200/70 dark:border-gray-700/60" role="tablist" aria-label="Dashboard views">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            role="tab"
            :aria-selected="activeTab === tab.id"
            :class="[
              'px-4 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition-all duration-150 cursor-pointer select-none',
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-900 text-[#23B750] dark:text-[#23B750] shadow-xs font-bold'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white'
            ]"
          >
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <!-- Controls: Date Range Popover & Export CTA -->
      <div class="flex items-center gap-2 relative">
        <div class="relative">
          <button
            @click="isDateOpen = !isDateOpen"
            class="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium shadow-xs transition-colors cursor-pointer"
            aria-haspopup="true"
            :aria-expanded="isDateOpen"
            aria-label="Select date range period"
          >
            <Calendar class="w-3.5 h-3.5 text-gray-400" />
            <span class="tabular-nums font-semibold text-[11px]">{{ selectedDateRangeLabel }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400 transition-transform duration-200" :class="{ 'rotate-180': isDateOpen }" />
          </button>

          <!-- Date Range Dropdown Popover -->
          <div
            v-if="isDateOpen"
            class="fixed inset-0 z-40"
            @click="isDateOpen = false"
          ></div>
          <div
            v-if="isDateOpen"
            class="absolute right-0 mt-1.5 w-60 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg p-1.5 z-50 text-xs space-y-1 animate-in fade-in zoom-in-95 duration-100"
          >
            <button
              v-for="preset in datePresets"
              :key="preset.id"
              @click="setDateRange(preset)"
              :class="[
                'w-full text-left px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer flex items-center justify-between',
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

        <button
          @click="triggerExport"
          class="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#23B750] hover:bg-[#1a943e] active:scale-[0.98] text-white rounded-lg text-xs font-bold shadow-md shadow-[#23B750]/20 transition-all cursor-pointer"
          title="Download full analytics dataset as CSV"
        >
          <Download class="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>

        <!-- Kebab Menu (3 dots) -->
        <div class="relative">
          <button
            @click="isKebabOpen = !isKebabOpen"
            class="relative h-8 w-8 inline-flex items-center justify-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg text-xs font-medium shadow-xs transition-colors cursor-pointer"
            :title="hasSampleData ? 'More actions (Prepopulated sample data active)' : 'More actions'"
            aria-haspopup="true"
            :aria-expanded="isKebabOpen"
          >
            <MoreVertical class="w-4 h-4" />
            <!-- Red dot indicator beside 3-dot kebab -->
            <span
              v-if="hasSampleData"
              class="absolute -top-1 -right-1 flex h-2.5 w-2.5"
              title="Prepopulated sample data active"
            >
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 ring-2 ring-white dark:ring-gray-900"></span>
            </span>
          </button>

          <!-- Backdrop -->
          <div
            v-if="isKebabOpen"
            class="fixed inset-0 z-40"
            @click="isKebabOpen = false"
          ></div>

          <!-- Kebab Dropdown Menu -->
          <div
            v-if="isKebabOpen"
            class="absolute right-0 mt-1.5 w-64 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100"
          >
            <div class="px-3 py-2 border-b border-gray-100 dark:border-gray-800">
              <p class="font-bold text-gray-900 dark:text-white text-xs">Dashboard Actions</p>
              <p class="text-[11px] text-gray-500 dark:text-gray-400">Manage analytics &amp; workspace data</p>
            </div>

            <div class="p-1 space-y-0.5">
              <button
                @click="loadSampleData"
                class="w-full text-left px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <Sparkles class="w-4 h-4 text-[#23B750]" />
                <div class="flex-1 min-w-0">
                  <div class="font-medium text-gray-900 dark:text-white flex items-center justify-between">
                    <span>Load sample data</span>
                    <span v-if="hasSampleData" class="inline-flex items-center gap-1 text-[10px] text-red-500 font-semibold">
                      <span class="w-1.5 h-1.5 rounded-full bg-red-500"></span> Active
                    </span>
                  </div>
                  <div class="text-[10px] text-gray-400">Populate demo leads, deals &amp; metrics</div>
                </div>
              </button>

              <button
                @click="clearSampleData"
                class="w-full text-left px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                <Trash2 class="w-4 h-4 text-red-500" />
                <div class="flex-1 min-w-0">
                  <div class="font-medium">Clear prepopulated sample data</div>
                  <div class="text-[10px] text-red-400/80">Reset dashboard to zeroed state</div>
                </div>
              </button>
            </div>

            <div class="my-1 border-t border-gray-100 dark:border-gray-800"></div>

            <div class="p-1 space-y-0.5">
              <button
                @click="refreshData"
                class="w-full text-left px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <RotateCw class="w-4 h-4 text-gray-500" />
                <div class="flex-1 min-w-0">
                  <div class="font-medium text-gray-900 dark:text-white">Refresh data</div>
                  <div class="text-[10px] text-gray-400">Sync latest CRM pipeline changes</div>
                </div>
              </button>

              <button
                @click="printDashboard"
                class="w-full text-left px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <Printer class="w-4 h-4 text-gray-500" />
                <div class="flex-1 min-w-0">
                  <div class="font-medium text-gray-900 dark:text-white">Print / Export PDF</div>
                  <div class="text-[10px] text-gray-400">Generate printable executive summary</div>
                </div>
              </button>

              <button
                @click="openSettings"
                class="w-full text-left px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <SlidersHorizontal class="w-4 h-4 text-gray-500" />
                <div class="flex-1 min-w-0">
                  <div class="font-medium text-gray-900 dark:text-white">Dashboard settings</div>
                  <div class="text-[10px] text-gray-400">Configure widgets &amp; KPI targets</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Notification Toast Banner -->
    <div
      v-if="toastMessage"
      class="fixed top-4 right-4 z-50 bg-gray-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5 text-xs border border-gray-700 animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <span class="w-2 h-2 rounded-full bg-[#23B750]"></span>
      <span>{{ toastMessage }}</span>
      <button @click="toastMessage = ''" class="ml-2 text-gray-400 hover:text-white" aria-label="Dismiss message">✕</button>
    </div>

    <!-- Scrollable Content Canvas -->
    <main class="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
      <div class="max-w-7xl mx-auto space-y-6">

        <!-- ═════════════════════════════════════════════════════════
             TAB 1: OVERVIEW
             ═════════════════════════════════════════════════════════ -->
        <div v-if="activeTab === 'overview'" class="space-y-6 animate-in fade-in duration-200">
          
          <!-- Section Title & Context -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Commercial Overview</h1>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Real-time revenue, conversion velocity, and team pipeline health for {{ selectedDateRangeLabel }}.</p>
            </div>
            <div class="flex items-center gap-2">
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-[#1a943e] dark:bg-emerald-950/50 dark:text-[#62D816] border border-emerald-200/80 dark:border-emerald-800/60">
                <span class="w-2 h-2 rounded-full bg-[#23B750] animate-pulse"></span>
                Connected to WhatsApp &amp; Inbound Telemetry
              </span>
            </div>
          </div>

          <!-- Top KPI Strip (4 Focused Executive Metrics) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <!-- 1. Total Revenue Won -->
            <div class="bg-gradient-to-br from-[#23B750] via-[#1fa848] to-[#178537] text-white p-5 rounded-2xl shadow-md shadow-[#23B750]/15 relative overflow-hidden flex flex-col justify-between h-[154px]">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-1.5 group relative">
                  <span class="text-[11px] font-bold tracking-wider uppercase opacity-95">Total Revenue Won</span>
                  <Info class="w-3 h-3 opacity-75 cursor-help" />
                  <div class="absolute left-0 top-5 hidden group-hover:block bg-gray-900 text-white text-[10px] p-2 rounded-lg shadow-xl w-52 z-30 font-normal border border-gray-700 leading-normal">
                    <strong>Formula:</strong> Sum of deal values for all deals marked "Closed Won" in this date range.
                  </div>
                </div>
                <div class="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <DollarSign class="w-3.5 h-3.5 text-white" />
                </div>
              </div>
              <div>
                <div class="text-3xl font-extrabold tracking-tight tabular-nums">RM {{ activeRevenueStats.wonAmount }}</div>
                <div class="flex items-center justify-between text-[11px] font-semibold opacity-95 mt-2 pt-2 border-t border-white/20">
                  <span class="tabular-nums">{{ activeRevenueStats.growth }} vs prior period</span>
                  <span class="tabular-nums">{{ activeRevenueStats.dealsCount }} closed deals</span>
                </div>
              </div>
            </div>

            <!-- 2. Active Pipeline Value -->
            <div class="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-xs flex flex-col justify-between h-[154px] hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
              <div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-1.5 group relative">
                    <span class="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Active Pipeline</span>
                    <Info class="w-3 h-3 text-gray-400 cursor-help" />
                    <div class="absolute left-0 top-5 hidden group-hover:block bg-gray-900 text-white text-[10px] p-2 rounded-lg shadow-xl w-52 z-30 font-normal border border-gray-700 leading-normal">
                      <strong>Formula:</strong> Total value of all open deals across qualification, proposal, and negotiation.
                    </div>
                  </div>
                  <span class="text-[10px] font-bold text-[#23B750] bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-150 dark:border-emerald-900/50 tabular-nums">
                    {{ hasSampleData ? '+7.1%' : '0.0%' }}
                  </span>
                </div>
                <div class="text-2xl font-bold text-gray-900 dark:text-white tabular-nums mt-1">{{ hasSampleData ? 'RM 3.84M' : 'RM 0.00' }}</div>
              </div>
              <div class="h-9 w-full">
                <apexchart type="area" height="36" :options="sparklineBlueOptions" :series="sparklinePipelineSeries" />
              </div>
            </div>

            <!-- 3. Lead Conversion to Won -->
            <div class="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-xs flex flex-col justify-between h-[154px] hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
              <div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-1.5 group relative">
                    <span class="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Conversion to Won</span>
                    <Info class="w-3 h-3 text-gray-400 cursor-help" />
                    <div class="absolute left-0 top-5 hidden group-hover:block bg-gray-900 text-white text-[10px] p-2 rounded-lg shadow-xl w-52 z-30 font-normal border border-gray-700 leading-normal">
                      <strong>Formula:</strong> (Closed Won Deals / Total Inbound Leads) × 100 in this period.
                    </div>
                  </div>
                  <span class="text-[10px] font-bold text-[#7C3AED] dark:text-[#A78BFA] bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded-full border border-purple-150 dark:border-purple-900/50 tabular-nums">
                    {{ hasSampleData ? '+6.2 pts' : '0.0 pts' }}
                  </span>
                </div>
                <div class="text-2xl font-bold text-gray-900 dark:text-white tabular-nums mt-1">{{ hasSampleData ? '14.3%' : '0.0%' }}</div>
              </div>
              <div class="h-9 w-full">
                <apexchart type="area" height="36" :options="sparklinePurpleOptions" :series="sparklineConvSeries" />
              </div>
            </div>

            <!-- 4. Avg First Response SLA -->
            <div class="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-xs flex flex-col justify-between h-[154px] hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
              <div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-1.5 group relative">
                    <span class="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Avg First Response</span>
                    <Info class="w-3 h-3 text-gray-400 cursor-help" />
                    <div class="absolute left-0 top-5 hidden group-hover:block bg-gray-900 text-white text-[10px] p-2 rounded-lg shadow-xl w-52 z-30 font-normal border border-gray-700 leading-normal">
                      <strong>Formula:</strong> Average minutes from inbound lead generation to first outbound agent message.
                    </div>
                  </div>
                  <span class="text-[10px] font-bold text-[#F97316] bg-orange-50 dark:bg-orange-950/40 px-2 py-0.5 rounded-full border border-orange-150 dark:border-orange-900/50 tabular-nums">
                    {{ hasSampleData ? '-18% faster' : '0.0%' }}
                  </span>
                </div>
                <div class="text-2xl font-bold text-gray-900 dark:text-white tabular-nums mt-1">{{ hasSampleData ? '12m 45s' : '--' }}</div>
              </div>
              <div class="h-9 w-full">
                <apexchart type="area" height="36" :options="sparklineOrangeOptions" :series="sparklineRespSeries" />
              </div>
            </div>

          </div>

          <!-- Sales Health Pulse Section -->
          <div class="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pb-3 border-b border-gray-150 dark:border-gray-800/80">
              <div class="flex items-center gap-2.5">
                <span class="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-[#23B750]">
                  <Activity class="w-4 h-4" />
                </span>
                <div>
                  <h2 class="text-sm font-bold text-gray-900 dark:text-white">Pipeline Health Diagnostic</h2>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Response speed compliance, pipeline staleness, and historical win rate trend</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button
                  @click="nudgeAllStaleDeals"
                  class="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-orange-50 hover:bg-orange-100 text-[#F97316] dark:bg-orange-950/40 dark:hover:bg-orange-900/60 border border-orange-200 dark:border-orange-800/60 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  :title="hasSampleData ? 'Send automated WhatsApp follow-ups to 27 deals inactive for >3 days' : 'No stale deals requiring follow-up'"
                >
                  <Zap class="w-3.5 h-3.5 text-[#F97316] fill-current" />
                  <span>Send WhatsApp follow-up to {{ hasSampleData ? '27' : '0' }} stale deals</span>
                </button>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- SLA Compliance Radial Gauge -->
              <div class="flex items-center gap-4 p-3.5 bg-gray-50/60 dark:bg-gray-800/40 rounded-xl border border-gray-150 dark:border-gray-800">
                <div class="w-16 h-16 flex-shrink-0 flex items-center justify-center">
                  <apexchart type="radialBar" width="75" height="75" :options="slaRadialOptions" :series="[hasSampleData ? 92 : 0]" />
                </div>
                <div>
                  <div class="text-xs font-bold text-gray-900 dark:text-white">15-Minute SLA Compliance</div>
                  <p class="text-[11px] text-gray-500 dark:text-gray-400">{{ hasSampleData ? '92% of new leads contacted < 15 min' : '0 of 0 leads responded < 15 min' }}</p>
                  <span class="text-[10px] font-semibold" :class="hasSampleData ? 'text-[#23B750]' : 'text-gray-400'">{{ hasSampleData ? 'Target: 80%+ • Status: On Track' : 'Status: No Inbound Leads' }}</span>
                </div>
              </div>

              <!-- Pipeline Freshness -->
              <div class="p-3.5 bg-gray-50/60 dark:bg-gray-800/40 rounded-xl border border-gray-150 dark:border-gray-800 flex flex-col justify-between">
                <div class="flex justify-between items-center text-xs">
                  <span class="font-bold text-gray-900 dark:text-white">Opportunity Activity Status</span>
                  <span class="text-[11px] font-semibold" :class="hasSampleData ? 'text-[#EF4444]' : 'text-gray-400'">{{ hasSampleData ? 'Follow-up Needed' : 'All Clear' }}</span>
                </div>
                <div class="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex my-1.5">
                  <div class="bg-[#23B750] h-full transition-all duration-300" :style="{ width: hasSampleData ? '10%' : '0%' }"></div>
                  <div class="bg-[#EF4444] h-full transition-all duration-300" :style="{ width: hasSampleData ? '90%' : '0%' }"></div>
                </div>
                <div class="flex justify-between items-center text-[10px] font-semibold text-gray-500">
                  <span class="flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-[#23B750]"></span> {{ hasSampleData ? '3 active (≤3d)' : '0 active' }}</span>
                  <span class="flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-[#EF4444]"></span> {{ hasSampleData ? '27 stale (>3d)' : '0 stale' }}</span>
                </div>
              </div>

              <!-- Win Rate Trend -->
              <div class="p-3.5 bg-gray-50/60 dark:bg-gray-800/40 rounded-xl border border-gray-150 dark:border-gray-800 flex flex-col justify-between">
                <div class="flex justify-between items-center text-xs">
                  <span class="font-bold text-gray-900 dark:text-white">Win Rate Trend (6-Week)</span>
                  <span class="text-[#23B750] font-bold tabular-nums">{{ hasSampleData ? '+12.2 pts gain' : '+0.0 pts' }}</span>
                </div>
                <div class="h-8 w-full my-1">
                  <apexchart type="area" height="35" :options="winRateTrendOptions" :series="winRateTrendSeries" />
                </div>
                <div class="flex justify-between text-[10px] text-gray-400">
                  <span>{{ hasSampleData ? '6 weeks ago (6.3%)' : '6 weeks ago (0.0%)' }}</span>
                  <span class="font-bold text-gray-700 dark:text-gray-300">{{ hasSampleData ? 'Current: 18.5%' : 'Current: 0.0%' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Revenue vs Target & Funnel Charts -->
          <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            <!-- Revenue vs Target -->
            <div class="xl:col-span-6 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-xs flex flex-col justify-between">
              <div>
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h3 class="text-sm font-bold text-gray-900 dark:text-white">Revenue vs Target Quota</h3>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Cumulative closed revenue compared against team target</p>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="flex p-0.5 bg-gray-100 dark:bg-gray-800 rounded-lg" role="group" aria-label="Revenue time frame">
                      <button
                        v-for="p in ['30D', '90D', 'YTD']"
                        :key="p"
                        @click="revenuePeriod = p"
                        :class="[
                          'px-2.5 py-1 text-[11px] font-bold rounded-md transition-colors cursor-pointer',
                          revenuePeriod === p
                            ? 'bg-white dark:bg-gray-900 text-[#23B750] shadow-xs'
                            : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                        ]"
                      >
                        {{ p }}
                      </button>
                    </div>
                  </div>
                </div>

                <div class="flex items-baseline gap-2 mt-4">
                  <span class="text-3xl font-extrabold text-gray-900 dark:text-white tabular-nums">RM {{ activeRevenueStats.wonAmount }}</span>
                  <span class="text-xs font-semibold text-[#23B750]">of RM {{ activeRevenueStats.targetAmount }} target ({{ hasSampleData ? '119%' : '0%' }} attained)</span>
                </div>

                <!-- ApexCharts Spline Area Chart -->
                <div class="w-full mt-2 select-none">
                  <apexchart type="area" height="200" :options="revenueApexOptions" :series="revenueApexSeries" />
                </div>
              </div>

              <!-- Footer Statistics -->
              <div class="grid grid-cols-3 border-t border-gray-150 dark:border-gray-800 pt-4 mt-2 text-center">
                <div>
                  <p class="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Overall Conversion</p>
                  <p class="text-sm font-bold text-gray-900 dark:text-white mt-0.5 tabular-nums">{{ hasSampleData ? '14.3%' : '0.0%' }}</p>
                </div>
                <div class="border-x border-gray-150 dark:border-gray-800">
                  <p class="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Avg Deal Velocity</p>
                  <p class="text-sm font-bold text-gray-900 dark:text-white mt-0.5 tabular-nums">{{ hasSampleData ? '14.2 days' : '0.0 days' }}</p>
                </div>
                <div>
                  <p class="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Pipeline Value</p>
                  <p class="text-sm font-bold text-gray-900 dark:text-white mt-0.5 tabular-nums">{{ hasSampleData ? 'RM 3.84M' : 'RM 0.00' }}</p>
                </div>
              </div>
            </div>

            <!-- Pipeline Stage Funnel -->
            <div class="xl:col-span-6 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-xs flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-center pb-2">
                  <div>
                    <h3 class="text-sm font-bold text-gray-900 dark:text-white">Pipeline Stage Progression</h3>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Opportunity volume &amp; step-by-step conversion rate</p>
                  </div>
                  <div class="flex p-0.5 bg-gray-100 dark:bg-gray-800 rounded-lg" role="group" aria-label="Funnel metric unit">
                    <button
                      v-for="mode in ['Count', 'Value']"
                      :key="mode"
                      @click="funnelMode = mode"
                      :class="[
                        'px-3 py-1 text-[11px] font-bold rounded-md transition-colors cursor-pointer',
                        funnelMode === mode
                          ? 'bg-white dark:bg-gray-900 text-[#23B750] shadow-xs'
                          : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                      ]"
                    >
                      {{ mode === 'Count' ? 'Deal Count' : 'Deal Value' }}
                    </button>
                  </div>
                </div>

                <div class="w-full mt-2">
                  <apexchart type="bar" height="230" :options="funnelApexOptions" :series="funnelApexSeries" />
                </div>
              </div>

              <!-- Funnel Summary -->
              <div class="border-t border-gray-150 dark:border-gray-800 pt-3 mt-2 flex justify-between text-xs text-gray-500">
                <span>Top of Funnel: <strong class="text-gray-900 dark:text-white tabular-nums">{{ hasSampleData ? '349 Inbound Leads' : '0 Inbound Leads' }}</strong></span>
                <span>Final Win Rate: <strong class="text-[#23B750] tabular-nums">{{ hasSampleData ? '14.3% Closed Won' : '0.0% Closed Won' }}</strong></span>
              </div>
            </div>

          </div>

          <!-- Top Performing Agents & Channel Distribution -->
          <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            <!-- Top Performing Agents Leaderboard -->
            <div class="xl:col-span-6 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-xs">
              <div class="flex justify-between items-center pb-3 border-b border-gray-150 dark:border-gray-800">
                <div>
                  <h3 class="text-sm font-bold text-gray-900 dark:text-white">Top Performing Agents</h3>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Ranked by closed-won revenue in {{ selectedDateRangeLabel }}</p>
                </div>
                <span class="text-xs font-semibold text-gray-400">Sales Leaderboard</span>
              </div>

              <div class="divide-y divide-gray-150 dark:divide-gray-800/60 mt-1">
                <div v-if="activeTopAgents.length === 0" class="py-10 text-center text-xs text-gray-400">
                  No sales agent performance recorded for this period.
                </div>
                <div v-for="(agent, idx) in activeTopAgents" :key="idx" class="py-3 flex items-center justify-between hover:bg-gray-50/60 dark:hover:bg-gray-800/40 rounded-xl px-2 transition-colors">
                  <div class="flex items-center gap-3">
                    <span class="text-xs font-bold text-gray-400 tabular-nums w-4">0{{ idx + 1 }}</span>
                    <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white', agent.avatarBg]">
                      {{ agent.initials }}
                    </div>
                    <div>
                      <div class="text-xs font-bold text-gray-900 dark:text-white">{{ agent.name }}</div>
                      <div class="text-[11px] text-gray-400 tabular-nums">{{ agent.won }} won · {{ agent.open }} active deals</div>
                    </div>
                  </div>
                  <div class="text-right tabular-nums">
                    <div class="text-xs font-bold text-gray-900 dark:text-white">RM {{ agent.revenue }}</div>
                    <div class="text-[11px] font-semibold text-[#23B750]">{{ agent.winRate }}% win rate</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Leads by Channel Donut Chart -->
            <div class="xl:col-span-6 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-xs flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-center pb-3 border-b border-gray-150 dark:border-gray-800">
                  <div>
                    <h3 class="text-sm font-bold text-gray-900 dark:text-white">Leads by Communication Channel</h3>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Origin of {{ hasSampleData ? '389' : '0' }} inbound customer conversations</p>
                  </div>
                  <span class="text-xs font-bold text-gray-400 tabular-nums">{{ hasSampleData ? '389' : '0' }} Total Leads</span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center mt-3">
                  <div class="md:col-span-6 flex justify-center">
                    <apexchart type="donut" width="200" height="200" :options="channelDonutOptions" :series="channelDonutSeries" />
                  </div>

                  <div class="md:col-span-6 space-y-2">
                    <div v-for="(ch, idx) in activeOverviewChannels" :key="idx" class="flex justify-between items-center text-xs pb-1 border-b border-gray-100 dark:border-gray-800/50">
                      <div class="flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" :style="{ backgroundColor: ch.color }"></span>
                        <span class="font-medium text-gray-700 dark:text-gray-300">{{ ch.channel }}</span>
                      </div>
                      <div class="flex items-center gap-3 text-gray-900 dark:text-white tabular-nums">
                        <span class="font-bold">{{ ch.count }}</span>
                        <span class="text-gray-400 w-10 text-right font-medium">{{ ch.pct }}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Follow-up Week Strip -->
          <div class="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-xs space-y-3">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">Scheduled Follow-ups for This Week</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400">Scheduled client touches across all active pipelines</p>
              </div>
              <span class="text-xs font-semibold text-gray-400">Week 34 (August 2026)</span>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div
                v-for="day in activeCalendarDays"
                :key="day.date"
                :class="[
                  'p-3.5 rounded-xl border transition-all duration-150 flex flex-col justify-between h-24',
                  day.isToday && day.badge
                    ? 'bg-emerald-50/80 border-[#23B750] dark:bg-emerald-950/30 dark:border-emerald-800 text-[#1a943e] dark:text-[#62D816] shadow-sm shadow-[#23B750]/10'
                    : 'bg-gray-50/50 border-gray-200/80 dark:bg-gray-800/40 dark:border-gray-800 text-gray-600 dark:text-gray-400'
                ]"
              >
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-bold uppercase tracking-wider">{{ day.label }}</span>
                  <span v-if="day.badge" class="w-2 h-2 rounded-full bg-[#23B750]" title="Active meetings scheduled today"></span>
                </div>
                <div class="text-2xl font-black tabular-nums">{{ day.date }}</div>
              </div>
            </div>
          </div>

        </div>

        <!-- ═════════════════════════════════════════════════════════
             TAB 2: PIPELINE & SALES
             ═════════════════════════════════════════════════════════ -->
        <div v-if="activeTab === 'pipeline'" class="space-y-6 animate-in fade-in duration-200">
          
          <div>
            <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Pipeline Velocity &amp; Active Deals</h1>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Stage durations, bottleneck discovery, and real-time opportunity triage.</p>
          </div>

          <!-- Pipeline Top Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div class="bg-gradient-to-br from-[#23B750] to-[#178537] text-white p-5 rounded-2xl shadow-xs flex flex-col justify-between h-[142px]">
              <span class="text-[11px] font-bold tracking-wider uppercase opacity-90">Conversion Rate</span>
              <div>
                <div class="text-3xl font-extrabold tracking-tight tabular-nums">{{ hasSampleData ? '14.3%' : '0.0%' }}</div>
                <div class="text-xs text-emerald-100 mt-1 tabular-nums">{{ hasSampleData ? '↑ 6.2 pts vs prior period' : '0.0 pts vs prior period' }}</div>
              </div>
            </div>

            <div class="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-xs flex flex-col justify-between h-[142px]">
              <span class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Pipeline Value</span>
              <div>
                <div class="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">{{ hasSampleData ? 'RM 3.84M' : 'RM 0.00' }}</div>
                <div class="text-xs text-gray-400 mt-1 tabular-nums">{{ hasSampleData ? '30 open opportunities' : '0 open opportunities' }}</div>
              </div>
            </div>

            <div class="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-xs flex flex-col justify-between h-[142px]">
              <span class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Avg Deal Velocity</span>
              <div>
                <div class="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">{{ hasSampleData ? '14.2 days' : '--' }}</div>
                <div class="text-xs text-[#23B750] font-semibold mt-1 tabular-nums">{{ hasSampleData ? '↑ 3.4 days faster cycle' : 'No cycle data' }}</div>
              </div>
            </div>

            <div class="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-xs flex flex-col justify-between h-[142px]">
              <span class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Win / Loss Ratio</span>
              <div>
                <div class="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">{{ hasSampleData ? '0.23 : 1' : '0 : 0' }}</div>
                <div class="text-xs text-gray-400 mt-1 tabular-nums">{{ hasSampleData ? '5 won · 22 lost' : '0 won · 0 lost' }}</div>
              </div>
            </div>

            <div class="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-xs flex flex-col justify-between h-[142px]">
              <span class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">SLA Response Speed</span>
              <div>
                <div class="text-2xl font-bold text-[#23B750] tabular-nums">{{ hasSampleData ? '92%' : '0%' }}</div>
                <div class="text-xs text-gray-400 mt-1">{{ hasSampleData ? '< 15 min response time' : 'No responses recorded' }}</div>
              </div>
            </div>
          </div>

          <!-- Velocity by Stage & Lost Deals Analysis -->
          <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            <!-- Velocity by Stage -->
            <div class="xl:col-span-6 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-xs flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-center">
                  <div>
                    <h3 class="text-sm font-bold text-gray-900 dark:text-white">Deal Velocity by Pipeline Stage</h3>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Average duration deals spend in each qualification milestone</p>
                  </div>
                </div>

                <div class="w-full mt-2">
                  <apexchart type="bar" height="200" :options="velocityApexOptions" :series="velocityApexSeries" />
                </div>
              </div>

              <!-- Bottleneck Notice -->
              <div v-if="hasSampleData" class="mt-2 p-3.5 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/40 rounded-xl flex items-start gap-2.5 text-xs text-[#F97316]">
                <AlertCircle class="w-4 h-4 text-[#F97316] shrink-0 mt-0.5" />
                <span><strong>Bottleneck Identified:</strong> Deals spend an average of 8.9 days in Proposal/Quotation (31% of total cycle). Automate WhatsApp quote reminders to shorten conversion.</span>
              </div>
              <div v-else class="mt-2 p-3.5 bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800 rounded-xl flex items-start gap-2.5 text-xs text-gray-500">
                <Info class="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <span>No bottlenecks detected. Deal durations will calculate once opportunities progress through pipeline stages.</span>
              </div>
            </div>

            <!-- Lost Deal Reasons -->
            <div class="xl:col-span-6 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-xs">
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-gray-150 dark:border-gray-800">
                <div>
                  <h3 class="text-sm font-bold text-gray-900 dark:text-white">Lost Deal Root Causes</h3>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Analysis of {{ hasSampleData ? '22' : '0' }} lost opportunities</p>
                </div>
                <div class="relative w-44">
                  <Search class="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    v-model="lostReasonSearch"
                    type="text"
                    placeholder="Search root causes..."
                    class="w-full pl-8 pr-2 py-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#23B750]"
                    aria-label="Search lost deal reasons"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center mt-3">
                <div class="md:col-span-5 flex justify-center">
                  <apexchart type="donut" width="170" height="170" :options="lostReasonDonutOptions" :series="lostReasonDonutSeries" />
                </div>
                <div class="md:col-span-7 divide-y divide-gray-150 dark:divide-gray-800/60">
                  <div v-if="filteredLostReasons.length === 0" class="py-8 text-center text-xs text-gray-400">
                    No lost deals recorded in this period.
                  </div>
                  <div v-for="(r, idx) in filteredLostReasons" :key="idx" class="py-2.5 flex items-center justify-between text-xs hover:bg-gray-50/50 dark:hover:bg-gray-800/30 px-2 rounded-xl transition-colors">
                    <span class="font-bold text-gray-800 dark:text-gray-200">{{ r.title }}</span>
                    <div class="flex items-center gap-4 tabular-nums">
                      <span class="text-gray-500">{{ r.count }} deals</span>
                      <span class="font-bold text-gray-900 dark:text-white">RM {{ r.val.toLocaleString() }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Active Opportunities Data Grid with Slide-Over Drawer Trigger -->
          <div class="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xs p-6 space-y-4">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">Active Opportunities</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400">Select any opportunity to view deal details or send a WhatsApp follow-up</p>
              </div>

              <!-- Filter Toolbar -->
              <div class="flex items-center gap-2 w-full sm:w-auto">
                <div class="relative flex-1 sm:w-64">
                  <Search class="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    v-model="activeDealSearch"
                    type="text"
                    placeholder="Search opportunity or company..."
                    class="w-full pl-9 pr-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#23B750]"
                    aria-label="Search active opportunities by name or company"
                  />
                </div>
                <select
                  v-model="activeDealStageFilter"
                  class="px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-300 focus:ring-1 focus:ring-[#23B750]"
                  aria-label="Filter active opportunities by stage"
                >
                  <option value="All">All Stages</option>
                  <option value="New Leads">New Leads</option>
                  <option value="Acknowledged">Acknowledged</option>
                  <option value="Qualifying">Qualifying</option>
                  <option value="Proposal/Quotation">Proposal/Quotation</option>
                  <option value="Follow up/Negotiation">Follow up/Negotiation</option>
                </select>
              </div>
            </div>

            <!-- Table -->
            <div class="overflow-x-auto border border-gray-200 dark:border-gray-800 rounded-xl">
              <table class="w-full text-xs text-left whitespace-nowrap">
                <thead>
                  <tr class="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50/80 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                    <th class="px-4 py-3">OPPORTUNITY</th>
                    <th class="px-4 py-3 text-right">EST. VALUE</th>
                    <th class="px-4 py-3">PIPELINE STAGE</th>
                    <th class="px-4 py-3">INACTIVITY AGE</th>
                    <th class="px-4 py-3">ASSIGNED OWNER</th>
                    <th class="px-4 py-3">CHANNEL</th>
                    <th class="px-4 py-3 text-center">ACTION</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-800/60">
                  <tr
                    v-for="deal in filteredActiveDeals"
                    :key="deal.id"
                    @click="openDealDrawer(deal)"
                    class="hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20 transition-colors cursor-pointer"
                  >
                    <td class="px-4 py-3.5">
                      <div class="font-bold text-gray-900 dark:text-white hover:text-[#23B750] transition-colors">{{ deal.title }}</div>
                      <div class="text-[11px] text-gray-400">{{ deal.company }}</div>
                    </td>
                    <td class="px-4 py-3.5 font-bold text-right text-gray-900 dark:text-white tabular-nums">RM {{ deal.value }}</td>
                    <td class="px-4 py-3.5">
                      <span class="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                        {{ deal.stage }}
                      </span>
                    </td>
                    <td class="px-4 py-3.5">
                      <span :class="[
                        'text-[10px] font-bold px-2 py-0.5 rounded-full tabular-nums',
                        deal.isStale 
                          ? 'bg-red-50 text-[#EF4444] dark:bg-red-950/40 dark:text-red-400' 
                          : 'text-gray-500'
                      ]">
                        {{ deal.age }}
                      </span>
                    </td>
                    <td class="px-4 py-3.5 font-medium text-gray-800 dark:text-gray-200">{{ deal.owner }}</td>
                    <td class="px-4 py-3.5">
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                        {{ deal.source }}
                      </span>
                    </td>
                    <td class="px-4 py-3.5 text-center" @click.stop>
                      <button
                        @click="triggerWhatsAppChat(deal)"
                        class="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#23B750] dark:bg-emerald-950/40 transition-colors cursor-pointer"
                        title="Send WhatsApp follow-up message"
                      >
                        <MessageSquare class="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>

                  <!-- Clear Empty State with Specific Context -->
                  <tr v-if="filteredActiveDeals.length === 0">
                    <td colspan="7" class="py-12 text-center text-gray-400">
                      <div v-if="!hasSampleData" class="space-y-2">
                        <p class="font-medium text-sm text-gray-600 dark:text-gray-300">No active opportunities in workspace</p>
                        <p class="text-xs text-gray-400 max-w-sm mx-auto">Sample data is currently cleared. You can load demo data at any time to explore pipeline workflows.</p>
                        <button
                          @click="loadSampleData"
                          class="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#23B750] hover:bg-[#1a943e] text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                        >
                          <Sparkles class="w-3.5 h-3.5" />
                          <span>Load Sample Data</span>
                        </button>
                      </div>
                      <div v-else class="space-y-2">
                        <p class="font-medium text-sm text-gray-600 dark:text-gray-300">No active opportunities match "{{ activeDealSearch || activeDealStageFilter }}".</p>
                        <p class="text-xs text-gray-400">Try adjusting your search keywords or resetting stage filters.</p>
                        <button @click="clearActiveDealFilters" class="mt-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg text-xs font-bold transition-colors cursor-pointer">
                          Reset filters
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        <!-- ═════════════════════════════════════════════════════════
             TAB 3: MARKETING & ATTRIBUTION
             ═════════════════════════════════════════════════════════ -->
        <div v-if="activeTab === 'marketing'" class="space-y-6 animate-in fade-in duration-200">
          
          <div>
            <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Marketing &amp; Lead Attribution</h1>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Multi-touch attribution models, campaign lead generation, and acquisition origins.</p>
          </div>

          <!-- Top Marketing KPIs -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div class="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-xs flex flex-col justify-between h-[135px]">
              <span class="text-xs font-bold text-gray-500 uppercase">Total Sessions</span>
              <div>
                <div class="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">{{ hasSampleData ? '24,812' : '0' }}</div>
                <div class="text-[11px] font-bold text-[#23B750] mt-1 tabular-nums">{{ hasSampleData ? '↑ 9.4% vs prior period' : '0.0% vs prior period' }}</div>
              </div>
            </div>

            <div class="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-xs flex flex-col justify-between h-[135px]">
              <span class="text-xs font-bold text-gray-500 uppercase">Unique Visitors</span>
              <div>
                <div class="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">{{ hasSampleData ? '18,204' : '0' }}</div>
                <div class="text-[11px] font-bold text-[#23B750] mt-1 tabular-nums">{{ hasSampleData ? '↑ 7.1% vs prior period' : '0.0% vs prior period' }}</div>
              </div>
            </div>

            <div class="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-xs flex flex-col justify-between h-[135px]">
              <span class="text-xs font-bold text-gray-500 uppercase">Engagement Rate</span>
              <div>
                <div class="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">{{ hasSampleData ? '62.4%' : '0.0%' }}</div>
                <div class="text-[11px] font-bold text-[#23B750] mt-1 tabular-nums">{{ hasSampleData ? '↑ 3.2 pts vs prior period' : '0.0 pts vs prior period' }}</div>
              </div>
            </div>

            <div class="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-xs flex flex-col justify-between h-[135px]">
              <span class="text-xs font-bold text-gray-500 uppercase">Leads Generated</span>
              <div>
                <div class="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">{{ hasSampleData ? '847' : '0' }}</div>
                <div class="text-[11px] font-bold text-[#23B750] mt-1 tabular-nums">{{ hasSampleData ? '↑ 8.2% vs prior period' : '0.0% vs prior period' }}</div>
              </div>
            </div>

            <div class="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-xs flex flex-col justify-between h-[135px]">
              <span class="text-xs font-bold text-gray-500 uppercase">Lead to Customer</span>
              <div>
                <div class="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">{{ hasSampleData ? '18.3%' : '0.0%' }}</div>
                <div class="text-[11px] font-bold text-[#23B750] mt-1 tabular-nums">{{ hasSampleData ? '↑ 2.1 pts vs prior period' : '0.0 pts vs prior period' }}</div>
              </div>
            </div>
          </div>

          <!-- Attribution Donut & Channel Grouped Bar Chart -->
          <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            <!-- Attribution Model Selector & Donut -->
            <div class="xl:col-span-6 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-xs flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="text-sm font-bold text-gray-900 dark:text-white">Revenue Attribution by Channel</h3>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ attributionModel }} model · {{ hasSampleData ? 'RM 537.5K' : 'RM 0.00' }} attributed revenue</p>
                  </div>
                  <div class="flex p-0.5 bg-gray-100 dark:bg-gray-800 rounded-lg" role="group" aria-label="Attribution calculation model">
                    <button
                      v-for="model in ['First-touch', 'Last-touch', 'Linear']"
                      :key="model"
                      @click="attributionModel = model"
                      :class="[
                        'px-2.5 py-1 text-[10px] font-bold rounded-md transition-colors cursor-pointer',
                        attributionModel === model
                          ? 'bg-white dark:bg-gray-900 text-[#23B750] shadow-xs'
                          : 'text-gray-500 hover:text-gray-900'
                      ]"
                    >
                      {{ model }}
                    </button>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center mt-3">
                  <div class="md:col-span-6 flex justify-center">
                    <apexchart type="donut" width="200" height="200" :options="attributionApexOptions" :series="attributionApexSeries" />
                  </div>

                  <div class="md:col-span-6 space-y-2">
                    <div v-for="(item, idx) in activeAttributionChannels" :key="idx" class="flex justify-between items-center text-xs pb-1.5 border-b border-gray-100 dark:border-gray-800/50">
                      <div class="flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" :style="{ backgroundColor: item.color }"></span>
                        <span class="font-medium text-gray-700 dark:text-gray-300">{{ item.name }}</span>
                      </div>
                      <div class="flex items-center gap-4 text-gray-900 dark:text-white font-bold tabular-nums">
                        <span>RM {{ item.val }}</span>
                        <span class="text-gray-400 w-10 text-right">{{ item.pct }}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Grouped Bar Chart -->
            <div class="xl:col-span-6 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-xs flex flex-col justify-between">
              <div>
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">Channel Lead Generation &amp; Conversion</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Comparing total leads acquired vs closed deals per platform</p>

                <div class="w-full mt-2 select-none">
                  <apexchart type="bar" height="220" :options="channelBarApexOptions" :series="channelBarApexSeries" />
                </div>
              </div>
            </div>

          </div>

          <!-- Sessions & Key Events & Lead Quality Stacked -->
          <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            <div class="xl:col-span-6 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-xs flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-center pb-2">
                  <div>
                    <h3 class="text-sm font-bold text-gray-900 dark:text-white">Website Sessions &amp; Key Conversion Events</h3>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Form submissions, WhatsApp link clicks, and consultation inquiries</p>
                  </div>
                  <div class="flex p-0.5 bg-gray-100 dark:bg-gray-800 rounded-lg" role="group" aria-label="Session interval view">
                    <button
                      v-for="v in ['Daily', 'Weekly']"
                      :key="v"
                      @click="sessionsView = v"
                      :class="[
                        'px-3 py-1 text-[10px] font-bold rounded-md transition-colors cursor-pointer',
                        sessionsView === v
                          ? 'bg-white dark:bg-gray-900 text-[#23B750] shadow-xs'
                          : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                      ]"
                    >
                      {{ v }}
                    </button>
                  </div>
                </div>

                <div class="w-full mt-2 select-none">
                  <apexchart type="line" height="220" :options="sessionsDualApexOptions" :series="sessionsDualApexSeries" />
                </div>
              </div>
            </div>

            <!-- Lead Quality Stacked -->
            <div class="xl:col-span-6 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-xs flex flex-col justify-between">
              <div>
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">Commercial Lead Qualification Ratio</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Percentage of leads meeting sales qualification criteria</p>

                <div class="w-full mt-2">
                  <apexchart type="bar" height="220" :options="qualityStackedApexOptions" :series="qualityStackedApexSeries" />
                </div>
              </div>
            </div>

          </div>

          <!-- GA4 Traffic Sources Table -->
          <div class="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xs overflow-hidden p-6 space-y-4">
            <h3 class="text-sm font-bold text-gray-900 dark:text-white">Inbound Traffic Sources &amp; Conversion Rates (GA4)</h3>

            <div class="overflow-x-auto border border-gray-200 dark:border-gray-800 rounded-xl">
              <table class="w-full text-xs text-left whitespace-nowrap">
                <thead>
                  <tr class="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/50 font-bold">
                    <th class="px-4 py-3">SOURCE / MEDIUM</th>
                    <th class="px-4 py-3 text-right">SESSIONS</th>
                    <th class="px-4 py-3 text-right">VISITORS</th>
                    <th class="px-4 py-3 text-right">ENGAGEMENT</th>
                    <th class="px-4 py-3 text-right">KEY EVENTS</th>
                    <th class="px-4 py-3 text-right">LEADS</th>
                    <th class="px-4 py-3 text-right">CONV RATE</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-150 dark:divide-gray-800/60">
                  <tr v-if="activeMarketingSources.length === 0">
                    <td colspan="7" class="py-8 text-center text-gray-400 font-medium">
                      No inbound traffic sources recorded in this period.
                    </td>
                  </tr>
                  <tr v-for="(tr, idx) in activeMarketingSources" :key="idx" class="hover:bg-gray-50/70 dark:hover:bg-gray-800/30 transition-colors">
                    <td class="px-4 py-3.5 font-bold text-gray-800 dark:text-gray-200">{{ tr.source }}</td>
                    <td class="px-4 py-3.5 font-bold text-right text-gray-800 dark:text-white tabular-nums">{{ tr.sessions.toLocaleString() }}</td>
                    <td class="px-4 py-3.5 font-bold text-right text-gray-800 dark:text-white tabular-nums">{{ tr.users.toLocaleString() }}</td>
                    <td class="px-4 py-3.5 font-bold text-right text-gray-800 dark:text-white tabular-nums">{{ tr.engagement }}</td>
                    <td class="px-4 py-3.5 font-bold text-right text-gray-800 dark:text-white tabular-nums">{{ tr.events.toLocaleString() }}</td>
                    <td class="px-4 py-3.5 font-bold text-right text-gray-800 dark:text-white tabular-nums">{{ tr.leads.toLocaleString() }}</td>
                    <td class="px-4 py-3.5 font-bold text-right text-[#23B750] tabular-nums">{{ tr.convRate }}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Top Landing Pages & UTM Campaigns -->
          <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <div class="xl:col-span-6 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xs p-6 space-y-4">
              <h3 class="text-sm font-bold text-gray-900 dark:text-white">Top Converting Landing Pages</h3>
              <div class="overflow-x-auto border border-gray-200 dark:border-gray-800 rounded-xl">
                <table class="w-full text-xs text-left whitespace-nowrap">
                  <thead>
                    <tr class="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/50 font-bold">
                      <th class="px-4 py-3">PAGE URL</th>
                      <th class="px-4 py-3 text-right">SESSIONS</th>
                      <th class="px-4 py-3 text-right">BOUNCE RATE</th>
                      <th class="px-4 py-3 text-right">LEADS</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-150 dark:divide-gray-800/60">
                    <tr v-if="activeTopLandingPages.length === 0">
                      <td colspan="4" class="py-8 text-center text-gray-400 font-medium">
                        No landing page metrics recorded in this period.
                      </td>
                    </tr>
                    <tr v-for="(lp, idx) in activeTopLandingPages" :key="idx" class="hover:bg-gray-50/70 dark:hover:bg-gray-800/30 transition-colors">
                      <td class="px-4 py-3 font-semibold text-[#23B750] hover:underline cursor-pointer">{{ lp.page }}</td>
                      <td class="px-4 py-3 font-bold text-right text-gray-800 dark:text-white tabular-nums">{{ lp.sessions.toLocaleString() }}</td>
                      <td class="px-4 py-3 font-bold text-right text-gray-600 dark:text-gray-400 tabular-nums">{{ lp.bounce }}%</td>
                      <td class="px-4 py-3 font-bold text-right text-[#23B750] tabular-nums">{{ lp.leads }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="xl:col-span-6 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xs p-6 space-y-4">
              <h3 class="text-sm font-bold text-gray-900 dark:text-white">Active UTM Ad Campaigns</h3>
              <div class="overflow-x-auto border border-gray-200 dark:border-gray-800 rounded-xl">
                <table class="w-full text-xs text-left whitespace-nowrap">
                  <thead>
                    <tr class="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/50 font-bold">
                      <th class="px-4 py-3">CAMPAIGN NAME</th>
                      <th class="px-4 py-3">PLATFORM</th>
                      <th class="px-4 py-3 text-right">SESSIONS</th>
                      <th class="px-4 py-3 text-right">LEADS</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-150 dark:divide-gray-800/60">
                    <tr v-if="activeTopUtmCampaigns.length === 0">
                      <td colspan="4" class="py-8 text-center text-gray-400 font-medium">
                        No active UTM campaigns recorded in this period.
                      </td>
                    </tr>
                    <tr v-for="(camp, idx) in activeTopUtmCampaigns" :key="idx" class="hover:bg-gray-50/70 dark:hover:bg-gray-800/30 transition-colors">
                      <td class="px-4 py-3 font-bold text-gray-900 dark:text-white">{{ camp.campaign }}</td>
                      <td class="px-4 py-3 text-gray-600 dark:text-gray-400 font-medium">{{ camp.source }}</td>
                      <td class="px-4 py-3 font-bold text-right text-gray-800 dark:text-white tabular-nums">{{ camp.sessions.toLocaleString() }}</td>
                      <td class="px-4 py-3 font-bold text-right text-[#23B750] tabular-nums">{{ camp.leads }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>

      </div>
    </main>

    <!-- Slide-Over Opportunity Details Drawer -->
    <div v-if="selectedDeal" class="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
      <div class="absolute inset-0 bg-gray-950/60 backdrop-blur-xs transition-opacity" @click="selectedDeal = null"></div>
      
      <div class="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div class="w-screen max-w-md bg-white dark:bg-[#111827] border-l border-gray-200 dark:border-gray-800 p-6 shadow-2xl flex flex-col justify-between">
          <div class="space-y-5">
            <div class="flex justify-between items-start">
              <div>
                <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-[#1a943e] dark:bg-emerald-950/40 dark:text-[#62D816] border border-emerald-150">
                  {{ selectedDeal.stage }}
                </span>
                <h2 id="drawer-title" class="text-base font-bold text-gray-900 dark:text-white mt-2">{{ selectedDeal.title }}</h2>
                <p class="text-xs text-gray-400">{{ selectedDeal.company }}</p>
              </div>
              <button @click="selectedDeal = null" class="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer" aria-label="Close opportunity drawer">
                ✕
              </button>
            </div>

            <div class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-800 space-y-2 text-xs">
              <div class="flex justify-between">
                <span class="text-gray-400">Opportunity Value:</span>
                <span class="font-bold text-gray-900 dark:text-white tabular-nums">RM {{ selectedDeal.value }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Assigned Owner:</span>
                <span class="font-bold text-gray-900 dark:text-white">{{ selectedDeal.owner }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Primary Channel:</span>
                <span class="font-bold text-[#2E91E5]">{{ selectedDeal.source }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Inactivity Status:</span>
                <span class="font-bold text-[#F97316]">{{ selectedDeal.age }}</span>
              </div>
            </div>

            <!-- Action Sequence -->
            <div class="space-y-2">
              <label for="drawer-msg-input" class="text-xs font-bold text-gray-700 dark:text-gray-300">Follow-up Message Template:</label>
              <textarea
                id="drawer-msg-input"
                v-model="quickMessageText"
                rows="3"
                class="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-xs focus:ring-1 focus:ring-[#23B750] focus:outline-none"
              ></textarea>
            </div>
          </div>

          <div class="flex gap-2 pt-4 border-t border-gray-150 dark:border-gray-800">
            <button
              @click="sendQuickMessage"
              class="flex-1 py-2 bg-[#23B750] hover:bg-[#1a943e] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#23B750]/20 cursor-pointer"
            >
              Send via WhatsApp
            </button>
            <button
              @click="selectedDeal = null"
              class="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import CrmSetupStatusBar from '@/components/dashboard/CrmSetupStatusBar.vue'
import {
  Calendar,
  ChevronDown,
  Download,
  Info,
  Zap,
  Activity,
  AlertCircle,
  Search,
  MessageSquare,
  DollarSign,
  MoreVertical,
  Sparkles,
  Trash2,
  RotateCw,
  Printer,
  SlidersHorizontal,
  BarChart3,
  ArrowRight
} from 'lucide-vue-next'

const tabs = [
  { id: 'overview', label: 'Commercial Overview' },
  { id: 'pipeline', label: 'Pipeline Velocity' },
  { id: 'marketing', label: 'Marketing & Attribution' }
]

const activeTab = ref<string>('overview')
const toastMessage = ref('')

function showToast(msg: string) {
  toastMessage.value = msg
  setTimeout(() => {
    if (toastMessage.value === msg) {
      toastMessage.value = ''
    }
  }, 4000)
}

// ═════════════════════════════════════════════════════════
// SAMPLE DATA & KEBAB CONTROLS
// ═════════════════════════════════════════════════════════
const hasSampleData = ref(localStorage.getItem('rakansales_has_sample_data') !== 'false')
const isKebabOpen = ref(false)

function loadSampleData() {
  hasSampleData.value = true
  localStorage.setItem('rakansales_has_sample_data', 'true')
  activeDealsList.value = [...defaultActiveDeals]
  isKebabOpen.value = false
  showToast('Prepopulated sample data loaded successfully.')
}

function clearSampleData() {
  hasSampleData.value = false
  localStorage.setItem('rakansales_has_sample_data', 'false')
  activeDealsList.value = []
  isKebabOpen.value = false
  showToast('Prepopulated sample data cleared. Showing clean workspace state.')
}

function refreshData() {
  isKebabOpen.value = false
  showToast('Refreshing dashboard analytics & pipeline metrics...')
  setTimeout(() => {
    showToast('Dashboard metrics are up to date.')
  }, 800)
}

function printDashboard() {
  isKebabOpen.value = false
  showToast('Preparing executive summary print layout...')
  setTimeout(() => {
    window.print()
  }, 300)
}

function openSettings() {
  isKebabOpen.value = false
  showToast('Dashboard settings: Custom KPI targets and report widgets configured.')
}

// ═════════════════════════════════════════════════════════
// GLOBAL CONTROLS & DATE PRESETS
// ═════════════════════════════════════════════════════════
const isDateOpen = ref(false)
const selectedPresetId = ref('last30')
const selectedDateRangeLabel = ref('22 Jul 2026 — 20 Aug 2026')

const datePresets = [
  { id: 'last7', label: 'Last 7 Days (14 Aug — 20 Aug)' },
  { id: 'last30', label: 'Last 30 Days (22 Jul — 20 Aug)' },
  { id: 'thisMonth', label: 'This Month (1 Aug — 20 Aug)' },
  { id: 'ytd', label: 'Year to Date (1 Jan — 20 Aug)' }
]

function setDateRange(preset: { id: string; label: string }) {
  selectedPresetId.value = preset.id
  selectedDateRangeLabel.value = preset.label
  isDateOpen.value = false
  showToast(`Filtered dashboard to ${preset.label}`)
}

function triggerExport() {
  showToast(`Preparing CSV download for ${selectedDateRangeLabel.value}...`)
}

// ═════════════════════════════════════════════════════════
// TAB 1: OVERVIEW STATE & APEXCHARTS
// ═════════════════════════════════════════════════════════
const revenuePeriod = ref('30D')
const funnelMode = ref('Count')

const activeRevenueStats = computed(() => {
  if (!hasSampleData.value) {
    return { wonAmount: '0.00', targetAmount: '450.0K', growth: '0.0%', dealsCount: 0 }
  }
  if (revenuePeriod.value === '30D') {
    return { wonAmount: '537.5K', targetAmount: '450.0K', growth: '+27.4%', dealsCount: 5 }
  } else if (revenuePeriod.value === '90D') {
    return { wonAmount: '1.42M', targetAmount: '1.20M', growth: '+34.2%', dealsCount: 18 }
  } else {
    return { wonAmount: '4.85M', targetAmount: '4.00M', growth: '+42.1%', dealsCount: 62 }
  }
})

// Sparklines
const sparklineBlueOptions = {
  chart: { type: 'area', sparkline: { enabled: true } },
  stroke: { curve: 'smooth', width: 2 },
  fill: { type: 'gradient', gradient: { opacityFrom: 0.35, opacityTo: 0 } },
  colors: ['#2E91E5'],
  tooltip: { fixed: { enabled: false }, x: { show: false }, y: { title: { formatter: () => '' } } }
}
const sparklinePipelineSeries = computed(() => [
  { name: 'Pipeline', data: hasSampleData.value ? [2.8, 3.1, 3.0, 3.4, 3.2, 3.6, 3.84] : [0, 0, 0, 0, 0, 0, 0] }
])

const sparklinePurpleOptions = {
  chart: { type: 'area', sparkline: { enabled: true } },
  stroke: { curve: 'smooth', width: 2 },
  fill: { type: 'gradient', gradient: { opacityFrom: 0.35, opacityTo: 0 } },
  colors: ['#7C3AED'],
  tooltip: { fixed: { enabled: false }, x: { show: false } }
}
const sparklineConvSeries = computed(() => [
  { name: 'Conv Rate', data: hasSampleData.value ? [11.2, 12.0, 11.8, 13.2, 13.8, 14.1, 14.3] : [0, 0, 0, 0, 0, 0, 0] }
])

const sparklineOrangeOptions = {
  chart: { type: 'area', sparkline: { enabled: true } },
  stroke: { curve: 'smooth', width: 2 },
  fill: { type: 'gradient', gradient: { opacityFrom: 0.35, opacityTo: 0 } },
  colors: ['#F97316'],
  tooltip: { fixed: { enabled: false }, x: { show: false } }
}
const sparklineRespSeries = computed(() => [
  { name: 'Response (min)', data: hasSampleData.value ? [18.2, 16.5, 15.0, 14.2, 13.5, 13.0, 12.75] : [0, 0, 0, 0, 0, 0, 0] }
])

// Sales Health SLA Radial
const slaRadialOptions = {
  chart: { type: 'radialBar', sparkline: { enabled: true } },
  plotOptions: {
    radialBar: {
      hollow: { size: '60%' },
      track: { background: '#e5e7eb' },
      dataLabels: {
        name: { show: false },
        value: {
          fontSize: '12px',
          fontWeight: 700,
          offsetY: 4,
          formatter: (val: number) => val + '%'
        }
      }
    }
  },
  colors: ['#23B750']
}

const winRateTrendOptions = {
  chart: { type: 'area', sparkline: { enabled: true } },
  stroke: { curve: 'smooth', width: 2 },
  fill: { type: 'gradient', gradient: { opacityFrom: 0.4, opacityTo: 0 } },
  colors: ['#23B750']
}
const winRateTrendSeries = computed(() => [
  { name: 'Win Rate', data: hasSampleData.value ? [12.0, 14.5, 13.8, 16.2, 17.5, 18.5] : [0, 0, 0, 0, 0, 0] }
])

// Revenue vs Target Apex Chart
const revenueApexOptions = computed(() => ({
  chart: {
    type: 'area',
    toolbar: { show: false },
    fontFamily: 'Inter, sans-serif'
  },
  stroke: { curve: 'smooth', width: 2.5 },
  colors: ['#23B750'],
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.35,
      opacityTo: 0.05,
      stops: [0, 90, 100],
      colorStops: [
        { offset: 0, color: '#23B750', opacity: 0.35 },
        { offset: 100, color: '#62D816', opacity: 0.0 }
      ]
    }
  },
  dataLabels: { enabled: false },
  xaxis: {
    categories: revenuePeriod.value === '30D' 
      ? ['Week 1', 'Week 2', 'Week 3', 'Week 4']
      : revenuePeriod.value === '90D'
        ? ['Month 1', 'Month 2', 'Month 3']
        : ['Q1', 'Q2', 'Q3', 'Q4'],
    labels: { style: { colors: '#94a3b8', fontSize: '11px' } },
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: {
    labels: {
      style: { colors: '#94a3b8', fontSize: '11px' },
      formatter: (val: number) => `RM ${val}k`
    }
  },
  grid: { borderColor: '#e2e8f0', strokeDashArray: 3 },
  tooltip: {
    theme: 'dark',
    y: { formatter: (val: number) => `RM ${val.toLocaleString()}K` }
  }
}))

const revenueApexSeries = computed(() => {
  if (!hasSampleData.value) {
    return [{ name: 'Revenue Won', data: revenuePeriod.value === '90D' ? [0, 0, 0] : [0, 0, 0, 0] }]
  }
  if (revenuePeriod.value === '30D') {
    return [{ name: 'Revenue Won', data: [120, 245, 390, 537.5] }]
  } else if (revenuePeriod.value === '90D') {
    return [{ name: 'Revenue Won', data: [450, 920, 1420] }]
  } else {
    return [{ name: 'Revenue Won', data: [1100, 2300, 3600, 4850] }]
  }
})

// Pipeline Funnel Bar
const funnelApexOptions = computed(() => ({
  chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'Inter, sans-serif' },
  plotOptions: {
    bar: {
      horizontal: true,
      borderRadius: 4,
      barHeight: '55%',
      distributed: false
    }
  },
  colors: ['#23B750'],
  dataLabels: {
    enabled: true,
    formatter: (val: number) => funnelMode.value === 'Count' ? `${val} deals` : `RM ${val}k`,
    style: { fontSize: '10px', fontWeight: 700 }
  },
  xaxis: {
    labels: { show: false },
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: {
    categories: ['Won Deals', 'Proposal / Neg', 'Technical Qual', 'Contacted', 'Inbound Leads'],
    labels: { style: { colors: '#64748b', fontSize: '11px', fontWeight: 600 } }
  },
  grid: { show: false },
  tooltip: { theme: 'dark' }
}))

const funnelApexSeries = computed(() => {
  if (!hasSampleData.value) {
    return [{ name: funnelMode.value === 'Count' ? 'Deals' : 'Pipeline Value', data: [0, 0, 0, 0, 0] }]
  }
  if (funnelMode.value === 'Count') {
    return [{ name: 'Deals', data: [10, 48, 125, 210, 349] }]
  } else {
    return [{ name: 'Pipeline Value', data: [537.5, 410, 620, 890, 1200] }]
  }
})

const topAgents = [
  { rank: '01', name: 'Yee Ling', initials: 'YL', avatarBg: 'bg-[#23B750]', won: 2, open: 4, revenue: '522K', winRate: 68 },
  { rank: '02', name: 'Amirul Mokhtar', initials: 'AM', avatarBg: 'bg-[#7C3AED]', won: 2, open: 17, revenue: '15.3K', winRate: 100 },
  { rank: '03', name: 'Kausalya Saundarajan', initials: 'KS', avatarBg: 'bg-[#2E91E5]', won: 1, open: 1, revenue: '216', winRate: 100 }
]
const activeTopAgents = computed(() => hasSampleData.value ? topAgents : [])

const overviewChannels = [
  { channel: 'WhatsApp Direct', count: 238, pct: 61, color: '#2E91E5' },
  { channel: 'Email Inbound', count: 151, pct: 39, color: '#7C3AED' },
  { channel: 'Website LiveChat', count: 0, pct: 0, color: '#23B750' },
  { channel: 'Facebook Messenger', count: 0, pct: 0, color: '#3b82f6' }
]
const activeOverviewChannels = computed(() => {
  if (!hasSampleData.value) {
    return overviewChannels.map(c => ({ ...c, count: 0, pct: 0 }))
  }
  return overviewChannels
})

const channelDonutOptions = computed(() => ({
  chart: { type: 'donut', fontFamily: 'Inter, sans-serif' },
  labels: ['WhatsApp Direct', 'Email Inbound'],
  colors: ['#2E91E5', '#7C3AED'],
  legend: { show: false },
  dataLabels: { enabled: false },
  plotOptions: {
    pie: {
      donut: {
        size: '72%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Total Leads',
            fontSize: '10px',
            fontWeight: 600,
            formatter: () => hasSampleData.value ? '389' : '0'
          }
        }
      }
    }
  },
  tooltip: { theme: 'dark' }
}))
const channelDonutSeries = computed(() => hasSampleData.value ? [238, 151] : [0, 0])

const calendarDays = [
  { label: 'MON 17', date: '17', isToday: false, badge: false },
  { label: 'TUE 18', date: '18', isToday: false, badge: false },
  { label: 'WED 19', date: '19', isToday: false, badge: false },
  { label: 'THU · TODAY', date: '20', isToday: true, badge: true },
  { label: 'FRI 21', date: '21', isToday: false, badge: false }
]
const activeCalendarDays = computed(() => {
  if (!hasSampleData.value) {
    return calendarDays.map(d => ({ ...d, badge: false }))
  }
  return calendarDays
})

function nudgeAllStaleDeals() {
  if (!hasSampleData.value) {
    showToast('No stale opportunities detected in current workspace.')
    return
  }
  showToast('Automated WhatsApp follow-up sequence queued for 27 stale opportunities.')
}

// ═════════════════════════════════════════════════════════
// TAB 2: PIPELINE STATE & APEXCHARTS
// ═════════════════════════════════════════════════════════
const velocityApexOptions = {
  chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'Inter, sans-serif' },
  plotOptions: {
    bar: {
      horizontal: true,
      borderRadius: 4,
      barHeight: '50%',
      colors: {
        ranges: [
          { from: 8, to: 15, color: '#F97316' },
          { from: 0, to: 7.9, color: '#23B750' }
        ]
      }
    }
  },
  dataLabels: {
    enabled: true,
    formatter: (val: number) => `${val} days`,
    style: { fontSize: '10px', fontWeight: 700 }
  },
  xaxis: { labels: { show: false }, axisBorder: { show: false }, axisTicks: { show: false } },
  yaxis: {
    categories: ['Negotiation', 'Proposal/Quote', 'Tech Discovery', 'Contact SLA', 'Lead Intake'],
    labels: { style: { colors: '#64748b', fontSize: '11px', fontWeight: 600 } }
  },
  grid: { show: false },
  tooltip: { theme: 'dark' }
}
const velocityApexSeries = computed(() => [
  { name: 'Avg Duration', data: hasSampleData.value ? [3.2, 8.9, 4.1, 1.8, 2.1] : [0, 0, 0, 0, 0] }
])

const lostReasonSearch = ref('')
const lostReasonsList = [
  { title: 'Chose Competitor Solution', count: 8, val: 775550 },
  { title: 'Budget Constraints / Deferred', count: 6, val: 4207592 },
  { title: 'Unreachable / Lead Ghosted', count: 5, val: 580000 },
  { title: 'No Immediate Need / Timing', count: 3, val: 310000 }
]

const filteredLostReasons = computed(() => {
  if (!hasSampleData.value) return []
  if (!lostReasonSearch.value) return lostReasonsList
  const q = lostReasonSearch.value.toLowerCase()
  return lostReasonsList.filter(r => r.title.toLowerCase().includes(q))
})

const lostReasonDonutOptions = computed(() => ({
  chart: { type: 'donut', fontFamily: 'Inter, sans-serif' },
  labels: ['Competitor', 'Budget', 'Unreachable', 'Timing'],
  colors: ['#2E91E5', '#F97316', '#EF4444', '#23B750'],
  legend: { show: false },
  dataLabels: { enabled: false },
  plotOptions: {
    pie: {
      donut: {
        size: '70%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Lost Deals',
            fontSize: '10px',
            formatter: () => hasSampleData.value ? '22' : '0'
          }
        }
      }
    }
  },
  tooltip: { theme: 'dark' }
}))
const lostReasonDonutSeries = computed(() => hasSampleData.value ? [8, 6, 5, 3] : [0, 0, 0, 0])

const activeDealSearch = ref('')
const activeDealStageFilter = ref('All')

interface ActiveDeal {
  id: number
  title: string
  company: string
  value: string
  stage: string
  age: string
  isStale: boolean
  owner: string
  source: string
}

const defaultActiveDeals: ActiveDeal[] = [
  { id: 1, title: 'Whetstone Corporate Event Space booking [Jan-12] / 500 pax', company: 'Whetstone Corporate Events', value: '15.3K', stage: 'Follow up/Negotiation', age: '2 days inactive', isStale: false, owner: 'Kausalya', source: 'WhatsApp' },
  { id: 2, title: 'G2G B2B MATCH APP Enterprise Rollout', company: 'Touch Point Tech', value: '200.0K', stage: 'Follow up/Negotiation', age: '27 days (Stale >3d)', isStale: true, owner: 'Yee Ling', source: 'WhatsApp' },
  { id: 3, title: 'ERP Crystal Tech Implementation', company: 'Nova Star Systems', value: '97.2K', stage: 'Proposal/Quotation', age: '5 days inactive', isStale: false, owner: 'Amirul Mokhtar', source: 'WhatsApp' },
  { id: 4, title: 'HW02 Webinar Sponsorship Series', company: 'Whetstone Events', value: '32.7K', stage: 'Follow up/Negotiation', age: '5 days inactive', isStale: false, owner: 'Amirul Mokhtar', source: 'WhatsApp' },
  { id: 5, title: 'AMS Victory Logistics Integration', company: 'Victory Log Sdn Bhd', value: '26.1K', stage: 'Follow up/Negotiation', age: '6 days inactive', isStale: false, owner: 'Amirul Mokhtar', source: 'WhatsApp' },
  { id: 6, title: 'Realbox Pro E-Commerce Storefront', company: 'Real Box Co', value: '16.2K', stage: 'Follow up/Negotiation', age: '6 days inactive', isStale: false, owner: 'Amirul Mokhtar', source: 'WhatsApp' },
  { id: 7, title: 'Lemmex Corporate Portal', company: 'Lemmex Corp', value: '38.0K', stage: 'Proposal/Quotation', age: '20 days (Stale >3d)', isStale: true, owner: 'Amirul Mokhtar', source: 'WhatsApp' }
]

const activeDealsList = ref<ActiveDeal[]>(
  hasSampleData.value ? [...defaultActiveDeals] : []
)

const filteredActiveDeals = computed(() => {
  return activeDealsList.value.filter(d => {
    const matchesSearch = !activeDealSearch.value || d.title.toLowerCase().includes(activeDealSearch.value.toLowerCase()) || d.company.toLowerCase().includes(activeDealSearch.value.toLowerCase())
    const matchesStage = activeDealStageFilter.value === 'All' || d.stage === activeDealStageFilter.value
    return matchesSearch && matchesStage
  })
})

function clearActiveDealFilters() {
  activeDealSearch.value = ''
  activeDealStageFilter.value = 'All'
}

// Drawer State
const selectedDeal = ref<ActiveDeal | null>(null)
const quickMessageText = ref('Hi, checking in on the proposal we sent over. Let us know if you need any adjustments!')

function openDealDrawer(deal: ActiveDeal) {
  selectedDeal.value = deal
  quickMessageText.value = `Hi ${deal.owner}, checking in on the ${deal.title} with ${deal.company}. Let us know if you need any adjustments!`
}

function triggerWhatsAppChat(deal: ActiveDeal) {
  openDealDrawer(deal)
}

function sendQuickMessage() {
  showToast(`WhatsApp message sent to ${selectedDeal.value?.company}!`)
  selectedDeal.value = null
}

// ═════════════════════════════════════════════════════════
// TAB 3: MARKETING STATE & APEXCHARTS
// ═════════════════════════════════════════════════════════
const attributionModel = ref('Last-touch')
const sessionsView = ref('Weekly')

const activeAttributionChannels = computed(() => {
  if (!hasSampleData.value) {
    return [
      { name: 'WhatsApp Direct', val: '0.00', pct: 0, color: '#23B750' },
      { name: 'Direct Website Search', val: '0.00', pct: 0, color: '#62D816' },
      { name: 'Google Organic', val: '0.00', pct: 0, color: '#7C3AED' },
      { name: 'Meta Ads', val: '0.00', pct: 0, color: '#F97316' }
    ]
  }
  if (attributionModel.value === 'Last-touch') {
    return [
      { name: 'WhatsApp Direct (Last Touch)', val: '378K', pct: 70, color: '#23B750' },
      { name: 'Direct Website Search', val: '159K', pct: 30, color: '#62D816' },
      { name: 'Google Organic', val: '45K', pct: 8, color: '#7C3AED' },
      { name: 'Meta Ads', val: '28K', pct: 5, color: '#F97316' }
    ]
  } else if (attributionModel.value === 'First-touch') {
    return [
      { name: 'Google Organic (First Touch)', val: '268K', pct: 50, color: '#7C3AED' },
      { name: 'Meta Ads Campaign', val: '161K', pct: 30, color: '#F97316' },
      { name: 'WhatsApp Inbound', val: '108K', pct: 20, color: '#23B750' }
    ]
  } else {
    return [
      { name: 'WhatsApp Direct (Linear)', val: '215K', pct: 40, color: '#23B750' },
      { name: 'Google Organic (Linear)', val: '188K', pct: 35, color: '#7C3AED' },
      { name: 'Meta Ads (Linear)', val: '134K', pct: 25, color: '#F97316' }
    ]
  }
})

const attributionApexOptions = computed(() => ({
  chart: { type: 'donut', fontFamily: 'Inter, sans-serif' },
  labels: activeAttributionChannels.value.map(c => c.name),
  colors: activeAttributionChannels.value.map(c => c.color),
  legend: { show: false },
  dataLabels: { enabled: false },
  plotOptions: {
    pie: {
      donut: {
        size: '72%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Attributed',
            fontSize: '10px',
            formatter: () => hasSampleData.value ? 'RM 537.5K' : 'RM 0.00'
          }
        }
      }
    }
  },
  tooltip: { theme: 'dark' }
}))

const attributionApexSeries = computed(() => activeAttributionChannels.value.map(c => c.pct))

// Channel Grouped Bar Chart
const channelBarApexOptions = {
  chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'Inter, sans-serif' },
  plotOptions: { bar: { horizontal: false, columnWidth: '50%', borderRadius: 3 } },
  colors: ['#23B750', '#2E91E5'],
  dataLabels: { enabled: false },
  stroke: { show: true, width: 2, colors: ['transparent'] },
  xaxis: {
    categories: ['WhatsApp', 'Facebook', 'Google', 'Instagram', 'Email', 'Direct'],
    labels: { style: { colors: '#64748b', fontSize: '11px' } }
  },
  yaxis: {
    labels: { style: { colors: '#94a3b8', fontSize: '11px' } }
  },
  legend: {
    position: 'top',
    horizontalAlign: 'center',
    labels: { colors: '#64748b' }
  },
  grid: { borderColor: '#e2e8f0', strokeDashArray: 3 },
  tooltip: { theme: 'dark' }
}
const channelBarApexSeries = computed(() => [
  { name: 'Leads Generated', data: hasSampleData.value ? [380, 190, 170, 70, 60, 75] : [0, 0, 0, 0, 0, 0] },
  { name: 'Leads Converted', data: hasSampleData.value ? [80, 35, 40, 15, 18, 12] : [0, 0, 0, 0, 0, 0] }
])

// Sessions Dual-Axis Line Chart
const sessionsDualApexOptions = {
  chart: { type: 'line', toolbar: { show: false }, fontFamily: 'Inter, sans-serif' },
  stroke: { curve: 'smooth', width: 2.5 },
  colors: ['#2E91E5', '#23B750'],
  xaxis: {
    categories: ['Jul 1', 'Jul 7', 'Jul 13', 'Jul 19', 'Jul 25', 'Jul 29'],
    labels: { style: { colors: '#94a3b8', fontSize: '10px' } }
  },
  yaxis: [
    {
      title: { text: 'Sessions', style: { color: '#2E91E5', fontSize: '10px' } },
      labels: { style: { colors: '#2E91E5', fontSize: '10px' } }
    },
    {
      opposite: true,
      title: { text: 'Key Events', style: { color: '#23B750', fontSize: '10px' } },
      labels: { style: { colors: '#23B750', fontSize: '10px' } }
    }
  ],
  legend: { position: 'top', labels: { colors: '#64748b' } },
  grid: { borderColor: '#e2e8f0', strokeDashArray: 3 },
  tooltip: { theme: 'dark' }
}
const sessionsDualApexSeries = computed(() => [
  { name: 'Sessions', type: 'line', data: hasSampleData.value ? [2900, 3200, 3450, 3600, 3850, 4100] : [0, 0, 0, 0, 0, 0] },
  { name: 'Key Events', type: 'line', data: hasSampleData.value ? [145, 170, 185, 205, 220, 240] : [0, 0, 0, 0, 0, 0] }
])

// Lead Quality Stacked Horizontal
const qualityStackedApexOptions = {
  chart: { type: 'bar', stacked: true, stackType: '100%', toolbar: { show: false }, fontFamily: 'Inter, sans-serif' },
  plotOptions: { bar: { horizontal: true, barHeight: '50%', borderRadius: 2 } },
  colors: ['#23B750', '#cbd5e1'],
  xaxis: { labels: { style: { colors: '#94a3b8', fontSize: '10px' } } },
  yaxis: {
    categories: ['Email', 'Instagram', 'Google', 'Facebook', 'WhatsApp'],
    labels: { style: { colors: '#64748b', fontSize: '11px', fontWeight: 600 } }
  },
  legend: { position: 'top', labels: { colors: '#64748b' } },
  grid: { show: false },
  tooltip: { theme: 'dark' }
}
const qualityStackedApexSeries = computed(() => [
  { name: 'Qualified (%)', data: hasSampleData.value ? [75, 0, 67, 83, 70] : [0, 0, 0, 0, 0] },
  { name: 'Unqualified (%)', data: hasSampleData.value ? [25, 100, 33, 17, 30] : [0, 0, 0, 0, 0] }
])

const marketingSources = [
  { source: 'Direct / (none)', sessions: 18420, users: 14200, engagement: '68.4%', events: 34200, leads: 520, convRate: 2.8 },
  { source: 'google / organic', sessions: 6200, users: 4850, mechanical: '61.2%', engagement: '61.2%', events: 12400, leads: 185, convRate: 3.0 },
  { source: 'facebook / cpc', sessions: 4150, users: 3200, engagement: '54.6%', events: 8900, leads: 94, convRate: 2.3 },
  { source: 'whatsapp / direct', sessions: 2900, users: 2450, engagement: '82.1%', events: 9800, leads: 238, convRate: 8.2 },
  { source: 'email / newsletter', sessions: 1850, users: 1520, engagement: '74.5%', events: 4500, leads: 151, convRate: 8.1 }
]
const activeMarketingSources = computed(() => hasSampleData.value ? marketingSources : [])

const topLandingPages = [
  { page: '/pricing', sessions: 8420, bounce: 32.4, leads: 240 },
  { page: '/home', sessions: 7650, bounce: 41.2, leads: 180 },
  { page: '/features/omnichannel', sessions: 4210, bounce: 28.5, leads: 165 },
  { page: '/contact', sessions: 2150, bounce: 19.8, leads: 142 },
  { page: '/solutions/whatsapp-crm', sessions: 1980, bounce: 24.1, leads: 120 }
]
const activeTopLandingPages = computed(() => hasSampleData.value ? topLandingPages : [])

const topUtmCampaigns = [
  { campaign: 'c4_launch_google', source: 'Google Ads', sessions: 4200, leads: 145, convRate: 3.4 },
  { campaign: 'summer_promo_2026', source: 'Facebook', sessions: 3100, leads: 88, convRate: 2.8 },
  { campaign: 'whatsapp_direct_q3', source: 'WhatsApp', sessions: 2400, leads: 210, convRate: 8.7 },
  { campaign: 'newsletter_august', source: 'Email', sessions: 1850, leads: 151, convRate: 8.1 },
  { campaign: 'linkedin_b2b_enterprise', source: 'LinkedIn', sessions: 1200, leads: 62, convRate: 5.1 }
]
const activeTopUtmCampaigns = computed(() => hasSampleData.value ? topUtmCampaigns : [])
</script>

<style scoped>
.divide-y > :not([hidden]) ~ :not([hidden]) {
  border-top-width: 1px;
}
</style>
