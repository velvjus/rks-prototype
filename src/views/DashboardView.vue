<template>
  <div class="h-full flex flex-col bg-[#FAF5FF]/30 dark:bg-[#0B0F17] text-gray-900 dark:text-gray-100 font-sans antialiased overflow-hidden">
    
    <!-- Top Header Bar -->
    <header class="bg-white/95 dark:bg-[#111827]/95 backdrop-blur-md border-b border-gray-200/90 dark:border-gray-800/90 px-6 py-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0 z-20">
      <div class="flex items-center gap-3">
        <!-- Brand Nav Switcher -->
        <nav class="flex items-center p-1 bg-gray-100 dark:bg-gray-800/70 rounded-xl border border-gray-200/70 dark:border-gray-700/60" role="tablist">
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
          >
            <Calendar class="w-3.5 h-3.5 text-gray-400" />
            <span class="tabular-nums font-semibold text-[11px]">{{ selectedDateRangeLabel }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400 transition-transform duration-200" :class="{ 'rotate-180': isDateOpen }" />
          </button>

          <!-- Date Range Dropdown Popover -->
          <div
            v-if="isDateOpen"
            class="absolute right-0 mt-1.5 w-56 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg p-1.5 z-50 text-xs space-y-1 animate-in fade-in zoom-in-95 duration-100"
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
        >
          <Download class="w-3.5 h-3.5" />
          <span>Export report</span>
        </button>
      </div>
    </header>

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
                RakanSales CRM Live Sync
              </span>
            </div>
          </div>

          <!-- Top KPI Strip (4 High-Impact Visual Cards with Brand Tokens) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <!-- 1. Total Revenue Won Card -->
            <div class="bg-gradient-to-br from-[#23B750] via-[#1fa848] to-[#178537] text-white p-5 rounded-2xl shadow-md shadow-[#23B750]/15 relative overflow-hidden flex flex-col justify-between h-[154px]">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-1.5 group relative">
                  <span class="text-[11px] font-bold tracking-wider uppercase opacity-95">Total Revenue Won</span>
                  <Info class="w-3 h-3 opacity-75 cursor-help" />
                  <div class="absolute left-0 top-5 hidden group-hover:block bg-gray-900 text-white text-[10px] p-2 rounded-lg shadow-xl w-48 z-30 font-normal border border-gray-700">
                    Gross closed-won deal value across all sales pipelines in the selected period.
                  </div>
                </div>
                <div class="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <DollarSign class="w-3.5 h-3.5 text-white" />
                </div>
              </div>
              <div>
                <div class="text-3xl font-extrabold tracking-tight tabular-nums">RM {{ activeRevenueStats.wonAmount }}</div>
                <div class="flex items-center justify-between text-[11px] font-semibold opacity-95 mt-2 pt-2 border-t border-white/20">
                  <span class="tabular-nums">{{ activeRevenueStats.growth }} vs last period</span>
                  <span class="tabular-nums">{{ activeRevenueStats.dealsCount }} deals closed</span>
                </div>
              </div>
            </div>

            <!-- 2. Active Pipeline Value Card -->
            <div class="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-xs flex flex-col justify-between h-[154px] hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
              <div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-1.5 group relative">
                    <span class="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Active Pipeline</span>
                    <Info class="w-3 h-3 text-gray-400 cursor-help" />
                    <div class="absolute left-0 top-5 hidden group-hover:block bg-gray-900 text-white text-[10px] p-2 rounded-lg shadow-xl w-48 z-30 font-normal border border-gray-700">
                      Total value of all qualified opportunities in active pipeline stages.
                    </div>
                  </div>
                  <span class="text-[10px] font-bold text-[#23B750] bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-150 dark:border-emerald-900/50 tabular-nums">
                    +7.1%
                  </span>
                </div>
                <div class="text-2xl font-bold text-gray-900 dark:text-white tabular-nums mt-1">RM 3.84M</div>
              </div>
              <div class="h-9 w-full">
                <apexchart type="area" height="36" :options="sparklineBlueOptions" :series="sparklinePipelineSeries" />
              </div>
            </div>

            <!-- 3. Lead Conversion to Won (Purple: #7C3AED) -->
            <div class="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-xs flex flex-col justify-between h-[154px] hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
              <div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-1.5 group relative">
                    <span class="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Conversion to Won</span>
                    <Info class="w-3 h-3 text-gray-400 cursor-help" />
                    <div class="absolute left-0 top-5 hidden group-hover:block bg-gray-900 text-white text-[10px] p-2 rounded-lg shadow-xl w-48 z-30 font-normal border border-gray-700">
                      Closed Won Deals divided by Total Inbound Leads in this timeframe.
                    </div>
                  </div>
                  <span class="text-[10px] font-bold text-[#7C3AED] dark:text-[#A78BFA] bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded-full border border-purple-150 dark:border-purple-900/50 tabular-nums">
                    +6.2 pts
                  </span>
                </div>
                <div class="text-2xl font-bold text-gray-900 dark:text-white tabular-nums mt-1">14.3%</div>
              </div>
              <div class="h-9 w-full">
                <apexchart type="area" height="36" :options="sparklinePurpleOptions" :series="sparklineConvSeries" />
              </div>
            </div>

            <!-- 4. Avg First Response SLA (Orange: #F97316) -->
            <div class="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-xs flex flex-col justify-between h-[154px] hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
              <div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-1.5 group relative">
                    <span class="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Avg First Response</span>
                    <Info class="w-3 h-3 text-gray-400 cursor-help" />
                    <div class="absolute left-0 top-5 hidden group-hover:block bg-gray-900 text-white text-[10px] p-2 rounded-lg shadow-xl w-48 z-30 font-normal border border-gray-700">
                      Mean duration from inbound lead creation to first outbound WhatsApp/Email response by an agent.
                    </div>
                  </div>
                  <span class="text-[10px] font-bold text-[#F97316] bg-orange-50 dark:bg-orange-950/40 px-2 py-0.5 rounded-full border border-orange-150 dark:border-orange-900/50 tabular-nums">
                    -18% faster
                  </span>
                </div>
                <div class="text-2xl font-bold text-gray-900 dark:text-white tabular-nums mt-1">12m 45s</div>
              </div>
              <div class="h-9 w-full">
                <apexchart type="area" height="36" :options="sparklineOrangeOptions" :series="sparklineRespSeries" />
              </div>
            </div>

          </div>

          <!-- Sales Health Pulse Section (With ApexCharts Radial & Trend) -->
          <div class="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pb-3 border-b border-gray-150 dark:border-gray-800/80">
              <div class="flex items-center gap-2.5">
                <span class="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-[#23B750]">
                  <Activity class="w-4 h-4" />
                </span>
                <div>
                  <h2 class="text-sm font-bold text-gray-900 dark:text-white">Sales Health Pulse</h2>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Pipeline diagnostic telemetry and risk alerts</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button
                  @click="nudgeAllStaleDeals"
                  class="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-orange-50 hover:bg-orange-100 text-[#F97316] dark:bg-orange-950/40 dark:hover:bg-orange-900/60 border border-orange-200 dark:border-orange-800/60 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  <Zap class="w-3.5 h-3.5 text-[#F97316] fill-current" />
                  <span>Nudge 27 Stale Deals</span>
                </button>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- SLA Compliance Apex Radial Gauge -->
              <div class="flex items-center gap-4 p-3.5 bg-gray-50/60 dark:bg-gray-800/40 rounded-xl border border-gray-150 dark:border-gray-800">
                <div class="w-16 h-16 flex-shrink-0 flex items-center justify-center">
                  <apexchart type="radialBar" width="75" height="75" :options="slaRadialOptions" :series="[92]" />
                </div>
                <div>
                  <div class="text-xs font-bold text-gray-900 dark:text-white">SLA Compliance</div>
                  <p class="text-[11px] text-gray-500 dark:text-gray-400">Responded within 15 min</p>
                  <span class="text-[10px] font-semibold text-[#23B750]">Target: 80%+ • Status: On Track</span>
                </div>
              </div>

              <!-- Pipeline Freshness Split -->
              <div class="p-3.5 bg-gray-50/60 dark:bg-gray-800/40 rounded-xl border border-gray-150 dark:border-gray-800 flex flex-col justify-between">
                <div class="flex justify-between items-center text-xs">
                  <span class="font-bold text-gray-900 dark:text-white">Pipeline Freshness</span>
                  <span class="text-[11px] font-semibold text-[#EF4444]">Action Required</span>
                </div>
                <div class="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex my-1.5">
                  <div class="bg-[#23B750] h-full" style="width: 10%;"></div>
                  <div class="bg-[#EF4444] h-full" style="width: 90%;"></div>
                </div>
                <div class="flex justify-between items-center text-[10px] font-semibold text-gray-500">
                  <span class="flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-[#23B750]"></span> 3 active (10%)</span>
                  <span class="flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-[#EF4444]"></span> 27 stale &gt;3d (90%)</span>
                </div>
              </div>

              <!-- Win Rate Trend Apex Sparkline -->
              <div class="p-3.5 bg-gray-50/60 dark:bg-gray-800/40 rounded-xl border border-gray-150 dark:border-gray-800 flex flex-col justify-between">
                <div class="flex justify-between items-center text-xs">
                  <span class="font-bold text-gray-900 dark:text-white">Win Rate Trend</span>
                  <span class="text-[#23B750] font-bold tabular-nums">+12.2 pts</span>
                </div>
                <div class="h-8 w-full my-1">
                  <apexchart type="area" height="35" :options="winRateTrendOptions" :series="winRateTrendSeries" />
                </div>
                <div class="flex justify-between text-[10px] text-gray-400">
                  <span>6 weeks ago</span>
                  <span class="font-bold text-gray-700 dark:text-gray-300">Current: 18.5%</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Revenue vs Target & Funnel Charts (ApexCharts) -->
          <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            <!-- Revenue vs Target Area Chart (ApexCharts) -->
            <div class="xl:col-span-6 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-xs flex flex-col justify-between">
              <div>
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h3 class="text-sm font-bold text-gray-900 dark:text-white">Revenue vs Target</h3>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Cumulative closed revenue against monthly quota</p>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="flex p-0.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
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
                  <span class="text-xs font-semibold text-[#23B750]">of RM {{ activeRevenueStats.targetAmount }} target (119% attained)</span>
                </div>

                <!-- ApexCharts Interactive Spline Area Chart -->
                <div class="w-full mt-2 select-none">
                  <apexchart type="area" height="200" :options="revenueApexOptions" :series="revenueApexSeries" />
                </div>
              </div>

              <!-- Footer Statistics -->
              <div class="grid grid-cols-3 border-t border-gray-150 dark:border-gray-800 pt-4 mt-2 text-center">
                <div>
                  <p class="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Overall Conversion</p>
                  <p class="text-sm font-bold text-gray-900 dark:text-white mt-0.5 tabular-nums">14.3%</p>
                </div>
                <div class="border-x border-gray-150 dark:border-gray-800">
                  <p class="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Avg Deal Velocity</p>
                  <p class="text-sm font-bold text-gray-900 dark:text-white mt-0.5 tabular-nums">14.2 days</p>
                </div>
                <div>
                  <p class="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Pipeline Value</p>
                  <p class="text-sm font-bold text-gray-900 dark:text-white mt-0.5 tabular-nums">RM 3.84M</p>
                </div>
              </div>
            </div>

            <!-- Pipeline Funnel (ApexCharts Horizontal Bar) -->
            <div class="xl:col-span-6 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-xs flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-center pb-2">
                  <div>
                    <h3 class="text-sm font-bold text-gray-900 dark:text-white">Pipeline Stage Funnel</h3>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Stage volume with progression conversion rates</p>
                  </div>
                  <div class="flex p-0.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
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
                      {{ mode }}
                    </button>
                  </div>
                </div>

                <div class="w-full mt-2">
                  <apexchart type="bar" height="230" :options="funnelApexOptions" :series="funnelApexSeries" />
                </div>
              </div>

              <!-- Funnel Summary -->
              <div class="border-t border-gray-150 dark:border-gray-800 pt-3 mt-2 flex justify-between text-xs text-gray-500">
                <span>Top of Funnel: <strong class="text-gray-900 dark:text-white tabular-nums">349 Inbound Leads</strong></span>
                <span>Final Win Rate: <strong class="text-[#23B750] tabular-nums">14.3% Closed Won</strong></span>
              </div>
            </div>

          </div>

          <!-- Top Performing Agents & Channel Distribution (ApexCharts Donut) -->
          <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            <!-- Top Performing Agents Leaderboard -->
            <div class="xl:col-span-6 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-xs">
              <div class="flex justify-between items-center pb-3 border-b border-gray-150 dark:border-gray-800">
                <div>
                  <h3 class="text-sm font-bold text-gray-900 dark:text-white">Top Performing Agents</h3>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Ranked by revenue contribution this period</p>
                </div>
                <span class="text-xs font-semibold text-gray-400">Leaderboard</span>
              </div>

              <div class="divide-y divide-gray-150 dark:divide-gray-800/60 mt-1">
                <div v-for="(agent, idx) in topAgents" :key="idx" class="py-3 flex items-center justify-between hover:bg-gray-50/60 dark:hover:bg-gray-800/40 rounded-xl px-2 transition-colors">
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

            <!-- Leads by Channel Apex Donut Chart -->
            <div class="xl:col-span-6 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-xs flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-center pb-3 border-b border-gray-150 dark:border-gray-800">
                  <div>
                    <h3 class="text-sm font-bold text-gray-900 dark:text-white">Leads by Channel</h3>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Inbound volume across communications</p>
                  </div>
                  <span class="text-xs font-bold text-gray-400 tabular-nums">389 Total Leads</span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center mt-3">
                  <div class="md:col-span-6 flex justify-center">
                    <apexchart type="donut" width="200" height="200" :options="channelDonutOptions" :series="channelDonutSeries" />
                  </div>

                  <div class="md:col-span-6 space-y-2">
                    <div v-for="(ch, idx) in overviewChannels" :key="idx" class="flex justify-between items-center text-xs pb-1 border-b border-gray-100 dark:border-gray-800/50">
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
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">This Week's Scheduled Follow-ups</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400">Scheduled client touches across active pipelines</p>
              </div>
              <span class="text-xs font-semibold text-gray-400">Week 34 (August 2026)</span>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div
                v-for="day in calendarDays"
                :key="day.date"
                :class="[
                  'p-3.5 rounded-xl border transition-all duration-150 flex flex-col justify-between h-24',
                  day.isToday
                    ? 'bg-emerald-50/80 border-[#23B750] dark:bg-emerald-950/30 dark:border-emerald-800 text-[#1a943e] dark:text-[#62D816] shadow-sm shadow-[#23B750]/10'
                    : 'bg-gray-50/50 border-gray-200/80 dark:bg-gray-800/40 dark:border-gray-800 text-gray-600 dark:text-gray-400'
                ]"
              >
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-bold uppercase tracking-wider">{{ day.label }}</span>
                  <span v-if="day.badge" class="w-2 h-2 rounded-full bg-[#23B750]"></span>
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
                <div class="text-3xl font-extrabold tracking-tight tabular-nums">14.3%</div>
                <div class="text-xs text-emerald-100 mt-1 tabular-nums">↑ 6.2 pts vs last period</div>
              </div>
            </div>

            <div class="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-xs flex flex-col justify-between h-[142px]">
              <span class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Pipeline Value</span>
              <div>
                <div class="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">RM 3.84M</div>
                <div class="text-xs text-gray-400 mt-1 tabular-nums">30 open opportunities</div>
              </div>
            </div>

            <div class="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-xs flex flex-col justify-between h-[142px]">
              <span class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Avg Deal Velocity</span>
              <div>
                <div class="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">14.2 days</div>
                <div class="text-xs text-[#23B750] font-semibold mt-1 tabular-nums">↑ 3.4d faster closing</div>
              </div>
            </div>

            <div class="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-xs flex flex-col justify-between h-[142px]">
              <span class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Win / Loss Ratio</span>
              <div>
                <div class="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">0.23:1</div>
                <div class="text-xs text-gray-400 mt-1 tabular-nums">5 won · 22 lost</div>
              </div>
            </div>

            <div class="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-xs flex flex-col justify-between h-[142px]">
              <span class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">SLA Response</span>
              <div>
                <div class="text-2xl font-bold text-[#23B750] tabular-nums">92%</div>
                <div class="text-xs text-gray-400 mt-1">&lt; 15 min response time</div>
              </div>
            </div>
          </div>

          <!-- Velocity by Stage & Lost Deals Analysis -->
          <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            <!-- Velocity by Stage Apex Chart -->
            <div class="xl:col-span-6 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-xs flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-center">
                  <div>
                    <h3 class="text-sm font-bold text-gray-900 dark:text-white">Deal Velocity by Stage</h3>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Average duration spent in each qualification milestone</p>
                  </div>
                </div>

                <div class="w-full mt-2">
                  <apexchart type="bar" height="200" :options="velocityApexOptions" :series="velocityApexSeries" />
                </div>
              </div>

              <!-- Bottleneck Warning Card -->
              <div class="mt-2 p-3.5 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/40 rounded-xl flex items-start gap-2.5 text-xs text-[#F97316]">
                <AlertCircle class="w-4 h-4 text-[#F97316] shrink-0 mt-0.5" />
                <span><strong>Bottleneck Detected:</strong> Proposal / Quotation stage takes 31% of total cycle time. Consider automated WhatsApp quote nudges.</span>
              </div>
            </div>

            <!-- Lost Deal Reasons (ApexCharts Donut + List) -->
            <div class="xl:col-span-6 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-xs">
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-gray-150 dark:border-gray-800">
                <div>
                  <h3 class="text-sm font-bold text-gray-900 dark:text-white">Lost Deal Root Causes</h3>
                  <p class="text-xs text-gray-500 dark:text-gray-400">22 lost opportunities analysis</p>
                </div>
                <div class="relative w-40">
                  <Search class="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    v-model="lostReasonSearch"
                    type="text"
                    placeholder="Search reasons..."
                    class="w-full pl-8 pr-2 py-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#23B750]"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center mt-3">
                <div class="md:col-span-5 flex justify-center">
                  <apexchart type="donut" width="170" height="170" :options="lostReasonDonutOptions" :series="lostReasonDonutSeries" />
                </div>
                <div class="md:col-span-7 divide-y divide-gray-150 dark:divide-gray-800/60">
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
                <p class="text-xs text-gray-500 dark:text-gray-400">Click any deal to view full conversation history and audit drawer</p>
              </div>

              <!-- Filter Toolbar -->
              <div class="flex items-center gap-2 w-full sm:w-auto">
                <div class="relative flex-1 sm:w-64">
                  <Search class="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    v-model="activeDealSearch"
                    type="text"
                    placeholder="Search deal or company..."
                    class="w-full pl-9 pr-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#23B750]"
                  />
                </div>
                <select v-model="activeDealStageFilter" class="px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-300 focus:ring-1 focus:ring-[#23B750]">
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
                    <th class="px-4 py-3 text-right">VALUE</th>
                    <th class="px-4 py-3">STAGE</th>
                    <th class="px-4 py-3">AGE / STALENESS</th>
                    <th class="px-4 py-3">OWNER</th>
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
                        title="Send WhatsApp Nudge"
                      >
                        <MessageSquare class="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>

                  <!-- Empty State -->
                  <tr v-if="filteredActiveDeals.length === 0">
                    <td colspan="7" class="py-12 text-center text-gray-400">
                      <p class="font-medium text-sm">No active opportunities match your search.</p>
                      <button @click="clearActiveDealFilters" class="mt-2 text-xs font-bold text-[#23B750] hover:underline cursor-pointer">
                        Clear all filters
                      </button>
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
            <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Marketing &amp; Attribution</h1>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Multi-touch attribution models, campaign lead generation, and acquisition origins.</p>
          </div>

          <!-- Top Marketing KPIs -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div class="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-xs flex flex-col justify-between h-[135px]">
              <span class="text-xs font-bold text-gray-500 uppercase">Sessions</span>
              <div>
                <div class="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">24,812</div>
                <div class="text-[11px] font-bold text-[#23B750] mt-1 tabular-nums">↑ 9.4% vs last period</div>
              </div>
            </div>

            <div class="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-xs flex flex-col justify-between h-[135px]">
              <span class="text-xs font-bold text-gray-500 uppercase">Unique Users</span>
              <div>
                <div class="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">18,204</div>
                <div class="text-[11px] font-bold text-[#23B750] mt-1 tabular-nums">↑ 7.1% vs last period</div>
              </div>
            </div>

            <div class="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-xs flex flex-col justify-between h-[135px]">
              <span class="text-xs font-bold text-gray-500 uppercase">Engagement Rate</span>
              <div>
                <div class="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">62.4%</div>
                <div class="text-[11px] font-bold text-[#23B750] mt-1 tabular-nums">↑ 3.2 pts vs last period</div>
              </div>
            </div>

            <div class="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-xs flex flex-col justify-between h-[135px]">
              <span class="text-xs font-bold text-gray-500 uppercase">Leads Generated</span>
              <div>
                <div class="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">847</div>
                <div class="text-[11px] font-bold text-[#23B750] mt-1 tabular-nums">↑ 8.2% vs last period</div>
              </div>
            </div>

            <div class="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-xs flex flex-col justify-between h-[135px]">
              <span class="text-xs font-bold text-gray-500 uppercase">Lead to Customer</span>
              <div>
                <div class="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">18.3%</div>
                <div class="text-[11px] font-bold text-[#23B750] mt-1 tabular-nums">↑ 2.1 pts vs last period</div>
              </div>
            </div>
          </div>

          <!-- Attribution Donut & Channel Grouped Bar Chart (ApexCharts) -->
          <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            <!-- Attribution Model Selector & Apex Donut -->
            <div class="xl:col-span-6 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-xs flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="text-sm font-bold text-gray-900 dark:text-white">Revenue Attribution by Channel</h3>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ attributionModel }} model · RM 537.5K attributed</p>
                  </div>
                  <div class="flex p-0.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
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

            <!-- Grouped Bar Chart (ApexCharts) -->
            <div class="xl:col-span-6 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-xs flex flex-col justify-between">
              <div>
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">Channel Performance</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Leads generated vs converted across acquisition origins</p>

                <div class="w-full mt-2 select-none">
                  <apexchart type="bar" height="220" :options="channelBarApexOptions" :series="channelBarApexSeries" />
                </div>
              </div>
            </div>

          </div>

          <!-- Sessions & Key Events (Dual-Axis Apex Line) & Quality Split (Stacked Apex Bar) -->
          <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            <div class="xl:col-span-6 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-xs flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-center pb-2">
                  <div>
                    <h3 class="text-sm font-bold text-gray-900 dark:text-white">Sessions &amp; Key Events</h3>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Form submits, WhatsApp links, and demo inquiries</p>
                  </div>
                  <div class="flex p-0.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
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

            <!-- Lead Quality Stacked Horizontal Bars (ApexCharts) -->
            <div class="xl:col-span-6 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-xs flex flex-col justify-between">
              <div>
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">Lead Quality by Source</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Commercial Qualification Ratio (100% Stacked)</p>

                <div class="w-full mt-2">
                  <apexchart type="bar" height="220" :options="qualityStackedApexOptions" :series="qualityStackedApexSeries" />
                </div>
              </div>
            </div>

          </div>

          <!-- GA4 Traffic Sources Table -->
          <div class="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xs overflow-hidden p-6 space-y-4">
            <h3 class="text-sm font-bold text-gray-900 dark:text-white">Source / Medium (GA4 Inbound)</h3>

            <div class="overflow-x-auto border border-gray-200 dark:border-gray-800 rounded-xl">
              <table class="w-full text-xs text-left whitespace-nowrap">
                <thead>
                  <tr class="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/50 font-bold">
                    <th class="px-4 py-3">SOURCE / MEDIUM</th>
                    <th class="px-4 py-3 text-right">SESSIONS</th>
                    <th class="px-4 py-3 text-right">USERS</th>
                    <th class="px-4 py-3 text-right">ENGAGEMENT</th>
                    <th class="px-4 py-3 text-right">KEY EVENTS</th>
                    <th class="px-4 py-3 text-right">LEADS</th>
                    <th class="px-4 py-3 text-right">CONV RATE</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-150 dark:divide-gray-800/60">
                  <tr v-for="(tr, idx) in marketingSources" :key="idx" class="hover:bg-gray-50/70 dark:hover:bg-gray-800/30 transition-colors">
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
              <h3 class="text-sm font-bold text-gray-900 dark:text-white">Top Landing Pages</h3>
              <div class="overflow-x-auto border border-gray-200 dark:border-gray-800 rounded-xl">
                <table class="w-full text-xs text-left whitespace-nowrap">
                  <thead>
                    <tr class="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/50 font-bold">
                      <th class="px-4 py-3">PAGE</th>
                      <th class="px-4 py-3 text-right">SESSIONS</th>
                      <th class="px-4 py-3 text-right">BOUNCE</th>
                      <th class="px-4 py-3 text-right">LEADS</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-150 dark:divide-gray-800/60">
                    <tr v-for="(lp, idx) in topLandingPages" :key="idx" class="hover:bg-gray-50/70 dark:hover:bg-gray-800/30 transition-colors">
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
              <h3 class="text-sm font-bold text-gray-900 dark:text-white">Active UTM Campaigns</h3>
              <div class="overflow-x-auto border border-gray-200 dark:border-gray-800 rounded-xl">
                <table class="w-full text-xs text-left whitespace-nowrap">
                  <thead>
                    <tr class="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/50 font-bold">
                      <th class="px-4 py-3">CAMPAIGN</th>
                      <th class="px-4 py-3">SOURCE</th>
                      <th class="px-4 py-3 text-right">SESSIONS</th>
                      <th class="px-4 py-3 text-right">LEADS</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-150 dark:divide-gray-800/60">
                    <tr v-for="(camp, idx) in topUtmCampaigns" :key="idx" class="hover:bg-gray-50/70 dark:hover:bg-gray-800/30 transition-colors">
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

    <!-- Slide-Over Deal Drawer -->
    <div v-if="selectedDeal" class="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      <div class="absolute inset-0 bg-gray-950/60 backdrop-blur-xs transition-opacity" @click="selectedDeal = null"></div>
      
      <div class="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div class="w-screen max-w-md bg-white dark:bg-[#111827] border-l border-gray-200 dark:border-gray-800 p-6 shadow-2xl flex flex-col justify-between">
          <div class="space-y-5">
            <div class="flex justify-between items-start">
              <div>
                <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-[#1a943e] dark:bg-emerald-950/40 dark:text-[#62D816] border border-emerald-150">
                  {{ selectedDeal.stage }}
                </span>
                <h2 class="text-base font-bold text-gray-900 dark:text-white mt-2">{{ selectedDeal.title }}</h2>
                <p class="text-xs text-gray-400">{{ selectedDeal.company }}</p>
              </div>
              <button @click="selectedDeal = null" class="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer">
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
                <span class="text-gray-400">Status:</span>
                <span class="font-bold text-[#F97316]">{{ selectedDeal.age }}</span>
              </div>
            </div>

            <!-- Action Sequence -->
            <div class="space-y-2">
              <label class="text-xs font-bold text-gray-700 dark:text-gray-300">Quick WhatsApp Response:</label>
              <textarea
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
              Send WhatsApp Message
            </button>
            <button
              @click="selectedDeal = null"
              class="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
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
  DollarSign
} from 'lucide-vue-next'

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'pipeline', label: 'Pipeline' },
  { id: 'marketing', label: 'Marketing' }
]

const activeTab = ref<string>('overview')

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
}

function triggerExport() {
  alert('Exporting verified analytics dataset for ' + selectedDateRangeLabel.value)
}

// ═════════════════════════════════════════════════════════
// TAB 1: OVERVIEW STATE & APEXCHARTS
// ═════════════════════════════════════════════════════════
const revenuePeriod = ref('30D')
const funnelMode = ref('Count')

const activeRevenueStats = computed(() => {
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
const sparklinePipelineSeries = [{ name: 'Pipeline', data: [2.8, 3.1, 3.0, 3.4, 3.2, 3.6, 3.84] }]

const sparklinePurpleOptions = {
  chart: { type: 'area', sparkline: { enabled: true } },
  stroke: { curve: 'smooth', width: 2 },
  fill: { type: 'gradient', gradient: { opacityFrom: 0.35, opacityTo: 0 } },
  colors: ['#7C3AED'],
  tooltip: { fixed: { enabled: false }, x: { show: false } }
}
const sparklineConvSeries = [{ name: 'Conv Rate', data: [11.2, 12.0, 11.8, 13.2, 13.8, 14.1, 14.3] }]

const sparklineOrangeOptions = {
  chart: { type: 'area', sparkline: { enabled: true } },
  stroke: { curve: 'smooth', width: 2 },
  fill: { type: 'gradient', gradient: { opacityFrom: 0.35, opacityTo: 0 } },
  colors: ['#F97316'],
  tooltip: { fixed: { enabled: false }, x: { show: false } }
}
const sparklineRespSeries = [{ name: 'Response (min)', data: [18.2, 16.5, 15.0, 14.2, 13.5, 13.0, 12.75] }]

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
const winRateTrendSeries = [{ name: 'Win Rate', data: [12.0, 14.5, 13.8, 16.2, 17.5, 18.5] }]

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

const overviewChannels = [
  { channel: 'WhatsApp Direct', count: 238, pct: 61, color: '#2E91E5' },
  { channel: 'Email Inbound', count: 151, pct: 39, color: '#7C3AED' },
  { channel: 'Website LiveChat', count: 0, pct: 0, color: '#23B750' },
  { channel: 'Facebook Messenger', count: 0, pct: 0, color: '#3b82f6' }
]

const channelDonutOptions = {
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
            formatter: () => '389'
          }
        }
      }
    }
  },
  tooltip: { theme: 'dark' }
}
const channelDonutSeries = [238, 151]

const calendarDays = [
  { label: 'MON 17', date: '17', isToday: false, badge: false },
  { label: 'TUE 18', date: '18', isToday: false, badge: false },
  { label: 'WED 19', date: '19', isToday: false, badge: false },
  { label: 'THU · TODAY', date: '20', isToday: true, badge: true },
  { label: 'FRI 21', date: '21', isToday: false, badge: false }
]

function nudgeAllStaleDeals() {
  alert('Automated WhatsApp follow-up sequence triggered for 27 stale opportunities.')
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
const velocityApexSeries = [{ name: 'Avg Duration', data: [3.2, 8.9, 4.1, 1.8, 2.1] }]

const lostReasonSearch = ref('')
const lostReasonsList = [
  { title: 'Chose Competitor Solution', count: 8, val: 775550 },
  { title: 'Budget Constraints / Deferred', count: 6, val: 4207592 },
  { title: 'Unreachable / Lead Ghosted', count: 5, val: 580000 },
  { title: 'No Immediate Need / Timing', count: 3, val: 310000 }
]

const filteredLostReasons = computed(() => {
  if (!lostReasonSearch.value) return lostReasonsList
  const q = lostReasonSearch.value.toLowerCase()
  return lostReasonsList.filter(r => r.title.toLowerCase().includes(q))
})

const lostReasonDonutOptions = {
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
            formatter: () => '22'
          }
        }
      }
    }
  },
  tooltip: { theme: 'dark' }
}
const lostReasonDonutSeries = [8, 6, 5, 3]

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

const activeDealsList = ref<ActiveDeal[]>([
  { id: 1, title: 'Whetstone Corporate Event Space booking [Jan-12] / 500 pax', company: 'Whetstone Corporate Events', value: '15.3K', stage: 'Follow up/Negotiation', age: '2 days', isStale: false, owner: 'Kausalya', source: 'WhatsApp' },
  { id: 2, title: 'G2G B2B MATCH APP Enterprise Rollout', company: 'Touch Point Tech', value: '200.0K', stage: 'Follow up/Negotiation', age: '27d ago (Stale)', isStale: true, owner: 'Yee Ling', source: 'WhatsApp' },
  { id: 3, title: 'ERP Crystal Tech Implementation', company: 'Nova Star Systems', value: '97.2K', stage: 'Proposal/Quotation', age: '5d ago', isStale: false, owner: 'Amirul Mokhtar', source: 'WhatsApp' },
  { id: 4, title: 'HW02 Webinar Sponsorship Series', company: 'Whetstone Events', value: '32.7K', stage: 'Follow up/Negotiation', age: '5d ago', isStale: false, owner: 'Amirul Mokhtar', source: 'WhatsApp' },
  { id: 5, title: 'AMS Victory Logistics Integration', company: 'Victory Log Sdn Bhd', value: '26.1K', stage: 'Follow up/Negotiation', age: '6d ago', isStale: false, owner: 'Amirul Mokhtar', source: 'WhatsApp' },
  { id: 6, title: 'Realbox Pro E-Commerce Storefront', company: 'Real Box Co', value: '16.2K', stage: 'Follow up/Negotiation', age: '6d ago', isStale: false, owner: 'Amirul Mokhtar', source: 'WhatsApp' },
  { id: 7, title: 'Lemmex Corporate Portal', company: 'Lemmex Corp', value: '38.0K', stage: 'Proposal/Quotation', age: '20d ago (Stale)', isStale: true, owner: 'Amirul Mokhtar', source: 'WhatsApp' }
])

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
  alert(`Message sent to ${selectedDeal.value?.company} via WhatsApp!`)
  selectedDeal.value = null
}

// ═════════════════════════════════════════════════════════
// TAB 3: MARKETING STATE & APEXCHARTS
// ═════════════════════════════════════════════════════════
const attributionModel = ref('Last-touch')
const sessionsView = ref('Weekly')

const activeAttributionChannels = computed(() => {
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
            formatter: () => 'RM 537.5K'
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
const channelBarApexSeries = [
  { name: 'Leads Generated', data: [380, 190, 170, 70, 60, 75] },
  { name: 'Leads Converted', data: [80, 35, 40, 15, 18, 12] }
]

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
const sessionsDualApexSeries = [
  { name: 'Sessions', type: 'line', data: [2900, 3200, 3450, 3600, 3850, 4100] },
  { name: 'Key Events', type: 'line', data: [145, 170, 185, 205, 220, 240] }
]

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
const qualityStackedApexSeries = [
  { name: 'Qualified (%)', data: [75, 0, 67, 83, 70] },
  { name: 'Unqualified (%)', data: [25, 100, 33, 17, 30] }
]

const marketingSources = [
  { source: 'Direct / (none)', sessions: 18420, users: 14200, engagement: '68.4%', events: 34200, leads: 520, convRate: 2.8 },
  { source: 'google / organic', sessions: 6200, users: 4850, engagement: '61.2%', events: 12400, leads: 185, convRate: 3.0 },
  { source: 'facebook / cpc', sessions: 4150, users: 3200, engagement: '54.6%', events: 8900, leads: 94, convRate: 2.3 },
  { source: 'whatsapp / direct', sessions: 2900, users: 2450, engagement: '82.1%', events: 9800, leads: 238, convRate: 8.2 },
  { source: 'email / newsletter', sessions: 1850, users: 1520, engagement: '74.5%', events: 4500, leads: 151, convRate: 8.1 }
]

const topLandingPages = [
  { page: '/pricing', sessions: 8420, bounce: 32.4, leads: 240 },
  { page: '/home', sessions: 7650, bounce: 41.2, leads: 180 },
  { page: '/features/omnichannel', sessions: 4210, bounce: 28.5, leads: 165 },
  { page: '/contact', sessions: 2150, bounce: 19.8, leads: 142 },
  { page: '/solutions/whatsapp-crm', sessions: 1980, bounce: 24.1, leads: 120 }
]

const topUtmCampaigns = [
  { campaign: 'c4_launch_google', source: 'Google Ads', sessions: 4200, leads: 145, convRate: 3.4 },
  { campaign: 'summer_promo_2026', source: 'Facebook', sessions: 3100, leads: 88, convRate: 2.8 },
  { campaign: 'whatsapp_direct_q3', source: 'WhatsApp', sessions: 2400, leads: 210, convRate: 8.7 },
  { campaign: 'newsletter_august', source: 'Email', sessions: 1850, leads: 151, convRate: 8.1 },
  { campaign: 'linkedin_b2b_enterprise', source: 'LinkedIn', sessions: 1200, leads: 62, convRate: 5.1 }
]
</script>

<style scoped>
.divide-y > :not([hidden]) ~ :not([hidden]) {
  border-top-width: 1px;
}
</style>
