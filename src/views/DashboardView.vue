<template>
  <div class="h-full flex flex-col bg-background text-foreground font-sans antialiased overflow-hidden">
    
    <!-- 1-Line CRM Setup Status Bar on top of page -->
    <CrmSetupStatusBar @toast="showToast" />

    <!-- Top Header Bar -->
    <header class="bg-card/95 backdrop-blur-md border-b border-border/90 px-6 py-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0 z-20">
      <div class="flex items-center gap-3">
        <!-- Navigation Tab Switcher -->
        <nav class="flex items-center p-1 bg-muted/70 rounded-xl border border-border" role="tablist" aria-label="Dashboard views">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            role="tab"
            :aria-selected="activeTab === tab.id"
            :class="[
              'px-4 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition-all duration-150 cursor-pointer select-none',
              activeTab === tab.id
                ? 'bg-card text-primary shadow-xs font-bold'
                : 'text-muted-foreground hover:text-foreground'
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
            class="inline-flex items-center gap-2 px-3.5 py-1.5 bg-card border border-border hover:border-input text-foreground rounded-lg text-xs font-medium shadow-xs transition-colors cursor-pointer"
            aria-haspopup="true"
            :aria-expanded="isDateOpen"
            aria-label="Select date range period"
          >
            <Calendar class="w-3.5 h-3.5 text-muted-foreground" />
            <span class="tabular-nums font-semibold text-[11px]">{{ selectedDateRangeLabel }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-muted-foreground transition-transform duration-200" :class="{ 'rotate-180': isDateOpen }" />
          </button>

          <!-- Date Range Dropdown Popover -->
          <div
            v-if="isDateOpen"
            class="fixed inset-0 z-40"
            @click="isDateOpen = false"
          ></div>
          <div
            v-if="isDateOpen"
            class="absolute right-0 mt-1.5 w-60 bg-card border border-border rounded-xl shadow-lg p-1.5 z-50 text-xs space-y-1 animate-in fade-in zoom-in-95 duration-100"
          >
            <button
              v-for="preset in datePresets"
              :key="preset.id"
              @click="setDateRange(preset)"
              :class="[
                'w-full text-left px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer flex items-center justify-between',
                selectedPresetId === preset.id
                  ? 'bg-primary/10 text-primary font-bold'
                  : 'text-foreground hover:bg-muted'
              ]"
            >
              <span>{{ preset.label }}</span>
              <span v-if="selectedPresetId === preset.id" class="w-1.5 h-1.5 rounded-full bg-primary"></span>
            </button>
          </div>
        </div>

        <button
          @click="triggerExport"
          class="inline-flex items-center gap-1.5 px-4 py-1.5 bg-primary hover:bg-primary/90 active:scale-[0.98] text-primary-foreground rounded-lg text-xs font-bold shadow-md shadow-primary/20 transition-all cursor-pointer"
          title="Download full analytics dataset as CSV"
        >
          <Download class="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>

        <!-- Kebab Menu (3 dots) -->
        <div class="relative">
          <button
            @click="isKebabOpen = !isKebabOpen"
            class="relative h-8 w-8 inline-flex items-center justify-center bg-card border border-border hover:border-input text-muted-foreground hover:text-foreground rounded-lg text-xs font-medium shadow-xs transition-colors cursor-pointer"
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
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-destructive ring-2 ring-card"></span>
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
            class="absolute right-0 mt-1.5 w-64 bg-card border border-border rounded-xl shadow-xl py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100"
          >
            <div class="px-3 py-2 border-b border-border">
              <p class="font-bold text-foreground text-xs">Dashboard Actions</p>
              <p class="text-[11px] text-muted-foreground">Manage analytics &amp; workspace data</p>
            </div>

            <div class="p-1 space-y-0.5">
              <button
                @click="loadSampleData"
                class="w-full text-left px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-2.5 text-foreground hover:bg-muted"
              >
                <Sparkles class="w-4 h-4 text-primary" />
                <div class="flex-1 min-w-0">
                  <div class="font-medium text-foreground flex items-center justify-between">
                    <span>Load sample data</span>
                    <span v-if="hasSampleData" class="inline-flex items-center gap-1 text-[10px] text-destructive font-semibold">
                      <span class="w-1.5 h-1.5 rounded-full bg-destructive"></span> Active
                    </span>
                  </div>
                  <div class="text-[10px] text-muted-foreground">Populate demo leads, deals &amp; metrics</div>
                </div>
              </button>

              <button
                @click="clearSampleData"
                class="w-full text-left px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-2.5 text-destructive hover:bg-destructive/10"
              >
                <Trash2 class="w-4 h-4 text-destructive" />
                <div class="flex-1 min-w-0">
                  <div class="font-medium">Clear prepopulated sample data</div>
                  <div class="text-[10px] text-destructive/80">Reset dashboard to zeroed state</div>
                </div>
              </button>
            </div>

            <div class="my-1 border-t border-border"></div>

            <div class="p-1 space-y-0.5">
              <button
                @click="refreshData"
                class="w-full text-left px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-2.5 text-foreground hover:bg-muted"
              >
                <RotateCw class="w-4 h-4 text-muted-foreground" />
                <div class="flex-1 min-w-0">
                  <div class="font-medium text-foreground">Refresh data</div>
                  <div class="text-[10px] text-muted-foreground">Sync latest CRM pipeline changes</div>
                </div>
              </button>

              <button
                @click="printDashboard"
                class="w-full text-left px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-2.5 text-foreground hover:bg-muted"
              >
                <Printer class="w-4 h-4 text-muted-foreground" />
                <div class="flex-1 min-w-0">
                  <div class="font-medium text-foreground">Print / Export PDF</div>
                  <div class="text-[10px] text-muted-foreground">Generate printable executive summary</div>
                </div>
              </button>

              <button
                @click="openSettings"
                class="w-full text-left px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-2.5 text-foreground hover:bg-muted"
              >
                <SlidersHorizontal class="w-4 h-4 text-muted-foreground" />
                <div class="flex-1 min-w-0">
                  <div class="font-medium text-foreground">Dashboard settings</div>
                  <div class="text-[10px] text-muted-foreground">Configure widgets &amp; KPI targets</div>
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
      class="fixed top-4 right-4 z-50 bg-popover text-popover-foreground px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5 text-xs border border-border animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <span class="w-2 h-2 rounded-full bg-primary"></span>
      <span>{{ toastMessage }}</span>
      <button @click="toastMessage = ''" class="ml-2 text-muted-foreground hover:text-foreground" aria-label="Dismiss message">✕</button>
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
              <h1 class="text-2xl font-bold tracking-tight text-foreground">Commercial Overview</h1>
              <p class="text-xs text-muted-foreground mt-0.5">Real-time revenue, conversion velocity, and team pipeline health for {{ selectedDateRangeLabel }}.</p>
            </div>
            <div class="flex items-center gap-2">
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-success/10 text-success border border-success/30">
                <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                Connected to WhatsApp &amp; Inbound Telemetry
              </span>
            </div>
          </div>

          <!-- Top KPI Strip (4 Focused Executive Metrics) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <!-- 1. Total Revenue Won -->
            <div class="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground p-5 rounded-2xl shadow-md shadow-primary/15 relative overflow-hidden flex flex-col justify-between h-[154px]">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-1.5 group relative">
                  <span class="text-[11px] font-bold tracking-wider uppercase opacity-95">Total Revenue Won</span>
                  <Info class="w-3 h-3 opacity-75 cursor-help" />
                  <div class="absolute left-0 top-5 hidden group-hover:block bg-popover text-popover-foreground text-[10px] p-2 rounded-lg shadow-xl w-52 z-30 font-normal border border-border leading-normal">
                    <strong>Formula:</strong> Sum of deal values for all deals marked "Closed Won" in this date range.
                  </div>
                </div>
                <div class="w-6 h-6 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <DollarSign class="w-3.5 h-3.5 text-primary-foreground" />
                </div>
              </div>
              <div>
                <div class="text-3xl font-extrabold tracking-tight tabular-nums">RM {{ activeRevenueStats.wonAmount }}</div>
                <div class="flex items-center justify-between text-[11px] font-semibold opacity-95 mt-2 pt-2 border-t border-primary-foreground/20">
                  <span class="tabular-nums">{{ activeRevenueStats.growth }} vs prior period</span>
                  <span class="tabular-nums">{{ activeRevenueStats.dealsCount }} closed deals</span>
                </div>
              </div>
            </div>

            <!-- 2. Active Pipeline Value -->
            <div class="bg-card border border-border p-5 rounded-2xl shadow-xs flex flex-col justify-between h-[154px] hover:border-input transition-colors">
              <div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-1.5 group relative">
                    <span class="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Active Pipeline</span>
                    <Info class="w-3 h-3 text-muted-foreground cursor-help" />
                    <div class="absolute left-0 top-5 hidden group-hover:block bg-popover text-popover-foreground text-[10px] p-2 rounded-lg shadow-xl w-52 z-30 font-normal border border-border leading-normal">
                      <strong>Formula:</strong> Total value of all open deals across qualification, proposal, and negotiation.
                    </div>
                  </div>
                  <span class="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20 tabular-nums">
                    {{ hasSampleData ? '+7.1%' : '0.0%' }}
                  </span>
                </div>
                <div class="text-2xl font-bold text-foreground tabular-nums mt-1">{{ hasSampleData ? 'RM 3.84M' : 'RM 0.00' }}</div>
              </div>
              <div class="h-9 w-full">
                <apexchart type="area" height="36" :options="sparklineBlueOptions" :series="sparklinePipelineSeries" />
              </div>
            </div>

            <!-- 3. Lead Conversion to Won -->
            <div class="bg-card border border-border p-5 rounded-2xl shadow-xs flex flex-col justify-between h-[154px] hover:border-input transition-colors">
              <div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-1.5 group relative">
                    <span class="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Conversion to Won</span>
                    <Info class="w-3 h-3 text-muted-foreground cursor-help" />
                    <div class="absolute left-0 top-5 hidden group-hover:block bg-popover text-popover-foreground text-[10px] p-2 rounded-lg shadow-xl w-52 z-30 font-normal border border-border leading-normal">
                      <strong>Formula:</strong> (Closed Won Deals / Total Inbound Leads) × 100 in this period.
                    </div>
                  </div>
                  <span class="text-[10px] font-bold text-tag-4-foreground bg-tag-4/10 px-2 py-0.5 rounded-full border border-tag-4/30 tabular-nums">
                    {{ hasSampleData ? '+6.2 pts' : '0.0 pts' }}
                  </span>
                </div>
                <div class="text-2xl font-bold text-foreground tabular-nums mt-1">{{ hasSampleData ? '14.3%' : '0.0%' }}</div>
              </div>
              <div class="h-9 w-full">
                <apexchart type="area" height="36" :options="sparklinePurpleOptions" :series="sparklineConvSeries" />
              </div>
            </div>

            <!-- 4. Avg First Response SLA -->
            <div class="bg-card border border-border p-5 rounded-2xl shadow-xs flex flex-col justify-between h-[154px] hover:border-input transition-colors">
              <div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-1.5 group relative">
                    <span class="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Avg First Response</span>
                    <Info class="w-3 h-3 text-muted-foreground cursor-help" />
                    <div class="absolute left-0 top-5 hidden group-hover:block bg-popover text-popover-foreground text-[10px] p-2 rounded-lg shadow-xl w-52 z-30 font-normal border border-border leading-normal">
                      <strong>Formula:</strong> Average minutes from inbound lead generation to first outbound agent message.
                    </div>
                  </div>
                  <span class="text-[10px] font-bold text-warning bg-warning/10 px-2 py-0.5 rounded-full border border-warning/30 tabular-nums">
                    {{ hasSampleData ? '-18% faster' : '0.0%' }}
                  </span>
                </div>
                <div class="text-2xl font-bold text-foreground tabular-nums mt-1">{{ hasSampleData ? '12m 45s' : '--' }}</div>
              </div>
              <div class="h-9 w-full">
                <apexchart type="area" height="36" :options="sparklineOrangeOptions" :series="sparklineRespSeries" />
              </div>
            </div>

          </div>

          <!-- Sales Health Pulse Section -->
          <div class="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-4">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pb-3 border-b border-border">
              <div class="flex items-center gap-2.5">
                <span class="p-1.5 rounded-lg bg-primary/10 text-primary">
                  <Activity class="w-4 h-4" />
                </span>
                <div>
                  <h2 class="text-sm font-bold text-foreground">Pipeline Health Diagnostic</h2>
                  <p class="text-xs text-muted-foreground">Response speed compliance, pipeline staleness, and historical win rate trend</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button
                  @click="nudgeAllStaleDeals"
                  class="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-warning/10 hover:bg-warning/20 text-warning border border-warning/30 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  :title="hasSampleData ? 'Send automated WhatsApp follow-ups to 27 deals inactive for >3 days' : 'No stale deals requiring follow-up'"
                >
                  <Zap class="w-3.5 h-3.5 text-warning fill-current" />
                  <span>Send WhatsApp follow-up to {{ hasSampleData ? '27' : '0' }} stale deals</span>
                </button>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- SLA Compliance Radial Gauge -->
              <div class="flex items-center gap-4 p-3.5 bg-muted/30 rounded-xl border border-border">
                <div class="w-16 h-16 flex-shrink-0 flex items-center justify-center">
                  <apexchart type="radialBar" width="75" height="75" :options="slaRadialOptions" :series="[hasSampleData ? 92 : 0]" />
                </div>
                <div>
                  <div class="text-xs font-bold text-foreground">15-Minute SLA Compliance</div>
                  <p class="text-[11px] text-muted-foreground">{{ hasSampleData ? '92% of new leads contacted < 15 min' : '0 of 0 leads responded < 15 min' }}</p>
                  <span class="text-[10px] font-semibold" :class="hasSampleData ? 'text-primary' : 'text-muted-foreground'">{{ hasSampleData ? 'Target: 80%+ • Status: On Track' : 'Status: No Inbound Leads' }}</span>
                </div>
              </div>

              <!-- Pipeline Freshness -->
              <div class="p-3.5 bg-muted/30 rounded-xl border border-border flex flex-col justify-between">
                <div class="flex justify-between items-center text-xs">
                  <span class="font-bold text-foreground">Opportunity Activity Status</span>
                  <span class="text-[11px] font-semibold" :class="hasSampleData ? 'text-destructive' : 'text-muted-foreground'">{{ hasSampleData ? 'Follow-up Needed' : 'All Clear' }}</span>
                </div>
                <div class="w-full h-2.5 bg-muted rounded-full overflow-hidden flex my-1.5">
                  <div class="bg-primary h-full transition-all duration-300" :style="{ width: hasSampleData ? '10%' : '0%' }"></div>
                  <div class="bg-destructive h-full transition-all duration-300" :style="{ width: hasSampleData ? '90%' : '0%' }"></div>
                </div>
                <div class="flex justify-between items-center text-[10px] font-semibold text-muted-foreground">
                  <span class="flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-primary"></span> {{ hasSampleData ? '3 active (≤3d)' : '0 active' }}</span>
                  <span class="flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-destructive"></span> {{ hasSampleData ? '27 stale (>3d)' : '0 stale' }}</span>
                </div>
              </div>

              <!-- Win Rate Trend -->
              <div class="p-3.5 bg-muted/30 rounded-xl border border-border flex flex-col justify-between">
                <div class="flex justify-between items-center text-xs">
                  <span class="font-bold text-foreground">Win Rate Trend (6-Week)</span>
                  <span class="text-primary font-bold tabular-nums">{{ hasSampleData ? '+12.2 pts gain' : '+0.0 pts' }}</span>
                </div>
                <div class="h-8 w-full my-1">
                  <apexchart type="area" height="35" :options="winRateTrendOptions" :series="winRateTrendSeries" />
                </div>
                <div class="flex justify-between text-[10px] text-muted-foreground">
                  <span>{{ hasSampleData ? '6 weeks ago (6.3%)' : '6 weeks ago (0.0%)' }}</span>
                  <span class="font-bold text-foreground">{{ hasSampleData ? 'Current: 18.5%' : 'Current: 0.0%' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Revenue vs Target & Funnel Charts -->
          <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            <!-- Revenue vs Target -->
            <div class="xl:col-span-6 bg-card border border-border p-6 rounded-2xl shadow-xs flex flex-col justify-between">
              <div>
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h3 class="text-sm font-bold text-foreground">Revenue vs Target Quota</h3>
                    <p class="text-xs text-muted-foreground mt-0.5">Cumulative closed revenue compared against team target</p>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="flex p-0.5 bg-muted rounded-lg" role="group" aria-label="Revenue time frame">
                      <button
                        v-for="p in ['30D', '90D', 'YTD']"
                        :key="p"
                        @click="revenuePeriod = p"
                        :class="[
                          'px-2.5 py-1 text-[11px] font-bold rounded-md transition-colors cursor-pointer',
                          revenuePeriod === p
                            ? 'bg-card text-primary shadow-xs'
                            : 'text-muted-foreground hover:text-foreground hover:text-foreground'
                        ]"
                      >
                        {{ p }}
                      </button>
                    </div>
                  </div>
                </div>

                <div class="flex items-baseline gap-2 mt-4">
                  <span class="text-3xl font-extrabold text-foreground tabular-nums">RM {{ activeRevenueStats.wonAmount }}</span>
                  <span class="text-xs font-semibold text-primary">of RM {{ activeRevenueStats.targetAmount }} target ({{ hasSampleData ? '119%' : '0%' }} attained)</span>
                </div>

                <!-- ApexCharts Spline Area Chart -->
                <div class="w-full mt-2 select-none">
                  <apexchart type="area" height="200" :options="revenueApexOptions" :series="revenueApexSeries" />
                </div>
              </div>

              <!-- Footer Statistics -->
              <div class="grid grid-cols-3 border-t border-border pt-4 mt-2 text-center">
                <div>
                  <p class="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Overall Conversion</p>
                  <p class="text-sm font-bold text-foreground mt-0.5 tabular-nums">{{ hasSampleData ? '14.3%' : '0.0%' }}</p>
                </div>
                <div class="border-x border-border">
                  <p class="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Avg Deal Velocity</p>
                  <p class="text-sm font-bold text-foreground mt-0.5 tabular-nums">{{ hasSampleData ? '14.2 days' : '0.0 days' }}</p>
                </div>
                <div>
                  <p class="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Pipeline Value</p>
                  <p class="text-sm font-bold text-foreground mt-0.5 tabular-nums">{{ hasSampleData ? 'RM 3.84M' : 'RM 0.00' }}</p>
                </div>
              </div>
            </div>

            <!-- Pipeline Stage Funnel -->
            <div class="xl:col-span-6 bg-card border border-border p-6 rounded-2xl shadow-xs flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-center pb-2">
                  <div>
                    <h3 class="text-sm font-bold text-foreground">Pipeline Stage Progression</h3>
                    <p class="text-xs text-muted-foreground mt-0.5">Opportunity volume &amp; step-by-step conversion rate</p>
                  </div>
                  <div class="flex p-0.5 bg-muted rounded-lg" role="group" aria-label="Funnel metric unit">
                    <button
                      v-for="mode in ['Count', 'Value']"
                      :key="mode"
                      @click="funnelMode = mode"
                      :class="[
                        'px-3 py-1 text-[11px] font-bold rounded-md transition-colors cursor-pointer',
                        funnelMode === mode
                          ? 'bg-card text-primary shadow-xs'
                          : 'text-muted-foreground hover:text-foreground hover:text-foreground'
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
              <div class="border-t border-border pt-3 mt-2 flex justify-between text-xs text-muted-foreground">
                <span>Top of Funnel: <strong class="text-foreground tabular-nums">{{ hasSampleData ? '349 Inbound Leads' : '0 Inbound Leads' }}</strong></span>
                <span>Final Win Rate: <strong class="text-primary tabular-nums">{{ hasSampleData ? '14.3% Closed Won' : '0.0% Closed Won' }}</strong></span>
              </div>
            </div>

          </div>

          <!-- Top Performing Agents & Channel Distribution -->
          <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            <!-- Top Performing Agents Leaderboard -->
            <div class="xl:col-span-6 bg-card border border-border p-6 rounded-2xl shadow-xs">
              <div class="flex justify-between items-center pb-3 border-b border-border">
                <div>
                  <h3 class="text-sm font-bold text-foreground">Top Performing Agents</h3>
                  <p class="text-xs text-muted-foreground">Ranked by closed-won revenue in {{ selectedDateRangeLabel }}</p>
                </div>
                <span class="text-xs font-semibold text-muted-foreground">Sales Leaderboard</span>
              </div>

              <div class="divide-y divide-border mt-1">
                <div v-if="activeTopAgents.length === 0" class="py-10 text-center text-xs text-muted-foreground">
                  No sales agent performance recorded for this period.
                </div>
                <div v-for="(agent, idx) in activeTopAgents" :key="idx" class="py-3 flex items-center justify-between hover:bg-muted/30 rounded-xl px-2 transition-colors">
                  <div class="flex items-center gap-3">
                    <span class="text-xs font-bold text-muted-foreground tabular-nums w-4">0{{ idx + 1 }}</span>
                    <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold', agent.avatarBg]">
                      {{ agent.initials }}
                    </div>
                    <div>
                      <div class="text-xs font-bold text-foreground">{{ agent.name }}</div>
                      <div class="text-[11px] text-muted-foreground tabular-nums">{{ agent.won }} won · {{ agent.open }} active deals</div>
                    </div>
                  </div>
                  <div class="text-right tabular-nums">
                    <div class="text-xs font-bold text-foreground">RM {{ agent.revenue }}</div>
                    <div class="text-[11px] font-semibold text-primary">{{ agent.winRate }}% win rate</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Leads by Channel Donut Chart -->
            <div class="xl:col-span-6 bg-card border border-border p-6 rounded-2xl shadow-xs flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-center pb-3 border-b border-border">
                  <div>
                    <h3 class="text-sm font-bold text-foreground">Leads by Communication Channel</h3>
                    <p class="text-xs text-muted-foreground">Origin of {{ hasSampleData ? '389' : '0' }} inbound customer conversations</p>
                  </div>
                  <span class="text-xs font-bold text-muted-foreground tabular-nums">{{ hasSampleData ? '389' : '0' }} Total Leads</span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center mt-3">
                  <div class="md:col-span-6 flex justify-center">
                    <apexchart type="donut" width="200" height="200" :options="channelDonutOptions" :series="channelDonutSeries" />
                  </div>

                  <div class="md:col-span-6 space-y-2">
                    <div v-for="(ch, idx) in activeOverviewChannels" :key="idx" class="flex justify-between items-center text-xs pb-1 border-b border-border/50">
                      <div class="flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" :style="{ backgroundColor: ch.color }"></span>
                        <span class="font-medium text-foreground">{{ ch.channel }}</span>
                      </div>
                      <div class="flex items-center gap-3 text-foreground tabular-nums">
                        <span class="font-bold">{{ ch.count }}</span>
                        <span class="text-muted-foreground w-10 text-right font-medium">{{ ch.pct }}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Follow-up Week Strip -->
          <div class="bg-card border border-border p-5 rounded-2xl shadow-xs space-y-3">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="text-sm font-bold text-foreground">Scheduled Follow-ups for This Week</h3>
                <p class="text-xs text-muted-foreground">Scheduled client touches across all active pipelines</p>
              </div>
              <span class="text-xs font-semibold text-muted-foreground">Week 34 (August 2026)</span>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div
                v-for="day in activeCalendarDays"
                :key="day.date"
                :class="[
                  'p-3.5 rounded-xl border transition-all duration-150 flex flex-col justify-between h-24',
                  day.isToday && day.badge
                    ? 'bg-success/10 border-success text-success shadow-sm shadow-success/10'
                    : 'bg-muted/30 border-border text-muted-foreground'
                ]"
              >
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-bold uppercase tracking-wider">{{ day.label }}</span>
                  <span v-if="day.badge" class="w-2 h-2 rounded-full bg-primary" title="Active meetings scheduled today"></span>
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
            <h1 class="text-2xl font-bold tracking-tight text-foreground">Pipeline Velocity &amp; Active Deals</h1>
            <p class="text-xs text-muted-foreground mt-0.5">Stage durations, bottleneck discovery, and real-time opportunity triage.</p>
          </div>

          <!-- Pipeline Top Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div class="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-5 rounded-2xl shadow-xs flex flex-col justify-between h-[142px]">
              <span class="text-[11px] font-bold tracking-wider uppercase opacity-90">Conversion Rate</span>
              <div>
                <div class="text-3xl font-extrabold tracking-tight tabular-nums">{{ hasSampleData ? '14.3%' : '0.0%' }}</div>
                <div class="text-xs text-primary-foreground/80 mt-1 tabular-nums">{{ hasSampleData ? '↑ 6.2 pts vs prior period' : '0.0 pts vs prior period' }}</div>
              </div>
            </div>

            <div class="bg-card border border-border p-5 rounded-2xl shadow-xs flex flex-col justify-between h-[142px]">
              <span class="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Pipeline Value</span>
              <div>
                <div class="text-2xl font-bold text-foreground tabular-nums">{{ hasSampleData ? 'RM 3.84M' : 'RM 0.00' }}</div>
                <div class="text-xs text-muted-foreground mt-1 tabular-nums">{{ hasSampleData ? '30 open opportunities' : '0 open opportunities' }}</div>
              </div>
            </div>

            <div class="bg-card border border-border p-5 rounded-2xl shadow-xs flex flex-col justify-between h-[142px]">
              <span class="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Avg Deal Velocity</span>
              <div>
                <div class="text-2xl font-bold text-foreground tabular-nums">{{ hasSampleData ? '14.2 days' : '--' }}</div>
                <div class="text-xs text-primary font-semibold mt-1 tabular-nums">{{ hasSampleData ? '↑ 3.4 days faster cycle' : 'No cycle data' }}</div>
              </div>
            </div>

            <div class="bg-card border border-border p-5 rounded-2xl shadow-xs flex flex-col justify-between h-[142px]">
              <span class="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Win / Loss Ratio</span>
              <div>
                <div class="text-2xl font-bold text-foreground tabular-nums">{{ hasSampleData ? '0.23 : 1' : '0 : 0' }}</div>
                <div class="text-xs text-muted-foreground mt-1 tabular-nums">{{ hasSampleData ? '5 won · 22 lost' : '0 won · 0 lost' }}</div>
              </div>
            </div>

            <div class="bg-card border border-border p-5 rounded-2xl shadow-xs flex flex-col justify-between h-[142px]">
              <span class="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">SLA Response Speed</span>
              <div>
                <div class="text-2xl font-bold text-primary tabular-nums">{{ hasSampleData ? '92%' : '0%' }}</div>
                <div class="text-xs text-muted-foreground mt-1">{{ hasSampleData ? '< 15 min response time' : 'No responses recorded' }}</div>
              </div>
            </div>
          </div>

          <!-- Velocity by Stage & Lost Deals Analysis -->
          <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            <!-- Velocity by Stage -->
            <div class="xl:col-span-6 bg-card border border-border p-6 rounded-2xl shadow-xs flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-center">
                  <div>
                    <h3 class="text-sm font-bold text-foreground">Deal Velocity by Pipeline Stage</h3>
                    <p class="text-xs text-muted-foreground mt-0.5">Average duration deals spend in each qualification milestone</p>
                  </div>
                </div>

                <div class="w-full mt-2">
                  <apexchart type="bar" height="200" :options="velocityApexOptions" :series="velocityApexSeries" />
                </div>
              </div>

              <!-- Bottleneck Notice -->
              <div v-if="hasSampleData" class="mt-2 p-3.5 bg-warning/10 border border-warning/30 rounded-xl flex items-start gap-2.5 text-xs text-warning">
                <AlertCircle class="w-4 h-4 text-warning shrink-0 mt-0.5" />
                <span><strong>Bottleneck Identified:</strong> Deals spend an average of 8.9 days in Proposal/Quotation (31% of total cycle). Automate WhatsApp quote reminders to shorten conversion.</span>
              </div>
              <div v-else class="mt-2 p-3.5 bg-muted/30 border border-border rounded-xl flex items-start gap-2.5 text-xs text-muted-foreground">
                <Info class="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                <span>No bottlenecks detected. Deal durations will calculate once opportunities progress through pipeline stages.</span>
              </div>
            </div>

            <!-- Lost Deal Reasons -->
            <div class="xl:col-span-6 bg-card border border-border p-6 rounded-2xl shadow-xs">
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-border">
                <div>
                  <h3 class="text-sm font-bold text-foreground">Lost Deal Root Causes</h3>
                  <p class="text-xs text-muted-foreground">Analysis of {{ hasSampleData ? '22' : '0' }} lost opportunities</p>
                </div>
                <div class="relative w-44">
                  <Search class="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    v-model="lostReasonSearch"
                    type="text"
                    placeholder="Search root causes..."
                    class="w-full pl-8 pr-2 py-1 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    aria-label="Search lost deal reasons"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center mt-3">
                <div class="md:col-span-5 flex justify-center">
                  <apexchart type="donut" width="170" height="170" :options="lostReasonDonutOptions" :series="lostReasonDonutSeries" />
                </div>
                <div class="md:col-span-7 divide-y divide-border">
                  <div v-if="filteredLostReasons.length === 0" class="py-8 text-center text-xs text-muted-foreground">
                    No lost deals recorded in this period.
                  </div>
                  <div v-for="(r, idx) in filteredLostReasons" :key="idx" class="py-2.5 flex items-center justify-between text-xs hover:bg-muted/30 px-2 rounded-xl transition-colors">
                    <span class="font-bold text-foreground">{{ r.title }}</span>
                    <div class="flex items-center gap-4 tabular-nums">
                      <span class="text-muted-foreground">{{ r.count }} deals</span>
                      <span class="font-bold text-foreground">RM {{ r.val.toLocaleString() }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Active Opportunities Data Grid with Slide-Over Drawer Trigger -->
          <div class="bg-card border border-border rounded-2xl shadow-xs p-6 space-y-4">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 class="text-sm font-bold text-foreground">Active Opportunities</h3>
                <p class="text-xs text-muted-foreground">Select any opportunity to view deal details or send a WhatsApp follow-up</p>
              </div>

              <!-- Filter Toolbar -->
              <div class="flex items-center gap-2 w-full sm:w-auto">
                <div class="relative flex-1 sm:w-64">
                  <Search class="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    v-model="activeDealSearch"
                    type="text"
                    placeholder="Search opportunity or company..."
                    class="w-full pl-9 pr-3 py-1.5 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    aria-label="Search active opportunities by name or company"
                  />
                </div>
                <select
                  v-model="activeDealStageFilter"
                  class="px-3 py-1.5 bg-card border border-border rounded-lg text-xs font-semibold text-foreground focus:ring-1 focus:ring-primary"
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
            <div class="overflow-x-auto border border-border rounded-xl">
              <table class="w-full text-xs text-left whitespace-nowrap">
                <thead>
                  <tr class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-muted/30 border-b border-border">
                    <th class="px-4 py-3">OPPORTUNITY</th>
                    <th class="px-4 py-3 text-right">EST. VALUE</th>
                    <th class="px-4 py-3">PIPELINE STAGE</th>
                    <th class="px-4 py-3">INACTIVITY AGE</th>
                    <th class="px-4 py-3">ASSIGNED OWNER</th>
                    <th class="px-4 py-3">CHANNEL</th>
                    <th class="px-4 py-3 text-center">ACTION</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-border">
                  <tr
                    v-for="deal in filteredActiveDeals"
                    :key="deal.id"
                    @click="openDealDrawer(deal)"
                    class="hover:bg-primary/10 transition-colors cursor-pointer"
                  >
                    <td class="px-4 py-3.5">
                      <div class="font-bold text-foreground hover:text-primary transition-colors">{{ deal.title }}</div>
                      <div class="text-[11px] text-muted-foreground">{{ deal.company }}</div>
                    </td>
                    <td class="px-4 py-3.5 font-bold text-right text-foreground tabular-nums">RM {{ deal.value }}</td>
                    <td class="px-4 py-3.5">
                      <span class="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-muted text-foreground">
                        {{ deal.stage }}
                      </span>
                    </td>
                    <td class="px-4 py-3.5">
                      <span :class="[
                        'text-[10px] font-bold px-2 py-0.5 rounded-full tabular-nums',
                        deal.isStale 
                          ? 'bg-destructive/10 text-destructive' 
                          : 'text-muted-foreground'
                      ]">
                        {{ deal.age }}
                      </span>
                    </td>
                    <td class="px-4 py-3.5 font-medium text-foreground">{{ deal.owner }}</td>
                    <td class="px-4 py-3.5">
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-muted text-muted-foreground">
                        {{ deal.source }}
                      </span>
                    </td>
                    <td class="px-4 py-3.5 text-center" @click.stop>
                      <button
                        @click="triggerWhatsAppChat(deal)"
                        class="p-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors cursor-pointer"
                        title="Send WhatsApp follow-up message"
                      >
                        <MessageSquare class="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>

                  <!-- Clear Empty State with Specific Context -->
                  <tr v-if="filteredActiveDeals.length === 0">
                    <td colspan="7" class="py-12 text-center text-muted-foreground">
                      <div v-if="!hasSampleData" class="space-y-2">
                        <p class="font-medium text-sm text-muted-foreground">No active opportunities in workspace</p>
                        <p class="text-xs text-muted-foreground max-w-sm mx-auto">Sample data is currently cleared. You can load demo data at any time to explore pipeline workflows.</p>
                        <button
                          @click="loadSampleData"
                          class="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                        >
                          <Sparkles class="w-3.5 h-3.5" />
                          <span>Load Sample Data</span>
                        </button>
                      </div>
                      <div v-else class="space-y-2">
                        <p class="font-medium text-sm text-muted-foreground">No active opportunities match "{{ activeDealSearch || activeDealStageFilter }}".</p>
                        <p class="text-xs text-muted-foreground">Try adjusting your search keywords or resetting stage filters.</p>
                        <button @click="clearActiveDealFilters" class="mt-2 px-3 py-1.5 bg-muted hover:bg-muted text-foreground rounded-lg text-xs font-bold transition-colors cursor-pointer">
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
            <h1 class="text-2xl font-bold tracking-tight text-foreground">Marketing &amp; Lead Attribution</h1>
            <p class="text-xs text-muted-foreground mt-0.5">Multi-touch attribution models, campaign lead generation, and acquisition origins.</p>
          </div>

          <!-- Top Marketing KPIs -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div class="bg-card border border-border p-5 rounded-2xl shadow-xs flex flex-col justify-between h-[135px]">
              <span class="text-xs font-bold text-muted-foreground uppercase">Total Sessions</span>
              <div>
                <div class="text-2xl font-bold text-foreground tabular-nums">{{ hasSampleData ? '24,812' : '0' }}</div>
                <div class="text-[11px] font-bold text-primary mt-1 tabular-nums">{{ hasSampleData ? '↑ 9.4% vs prior period' : '0.0% vs prior period' }}</div>
              </div>
            </div>

            <div class="bg-card border border-border p-5 rounded-2xl shadow-xs flex flex-col justify-between h-[135px]">
              <span class="text-xs font-bold text-muted-foreground uppercase">Unique Visitors</span>
              <div>
                <div class="text-2xl font-bold text-foreground tabular-nums">{{ hasSampleData ? '18,204' : '0' }}</div>
                <div class="text-[11px] font-bold text-primary mt-1 tabular-nums">{{ hasSampleData ? '↑ 7.1% vs prior period' : '0.0% vs prior period' }}</div>
              </div>
            </div>

            <div class="bg-card border border-border p-5 rounded-2xl shadow-xs flex flex-col justify-between h-[135px]">
              <span class="text-xs font-bold text-muted-foreground uppercase">Engagement Rate</span>
              <div>
                <div class="text-2xl font-bold text-foreground tabular-nums">{{ hasSampleData ? '62.4%' : '0.0%' }}</div>
                <div class="text-[11px] font-bold text-primary mt-1 tabular-nums">{{ hasSampleData ? '↑ 3.2 pts vs prior period' : '0.0 pts vs prior period' }}</div>
              </div>
            </div>

            <div class="bg-card border border-border p-5 rounded-2xl shadow-xs flex flex-col justify-between h-[135px]">
              <span class="text-xs font-bold text-muted-foreground uppercase">Leads Generated</span>
              <div>
                <div class="text-2xl font-bold text-foreground tabular-nums">{{ hasSampleData ? '847' : '0' }}</div>
                <div class="text-[11px] font-bold text-primary mt-1 tabular-nums">{{ hasSampleData ? '↑ 8.2% vs prior period' : '0.0% vs prior period' }}</div>
              </div>
            </div>

            <div class="bg-card border border-border p-5 rounded-2xl shadow-xs flex flex-col justify-between h-[135px]">
              <span class="text-xs font-bold text-muted-foreground uppercase">Lead to Customer</span>
              <div>
                <div class="text-2xl font-bold text-foreground tabular-nums">{{ hasSampleData ? '18.3%' : '0.0%' }}</div>
                <div class="text-[11px] font-bold text-primary mt-1 tabular-nums">{{ hasSampleData ? '↑ 2.1 pts vs prior period' : '0.0 pts vs prior period' }}</div>
              </div>
            </div>
          </div>

          <!-- Attribution Donut & Channel Grouped Bar Chart -->
          <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            <!-- Attribution Model Selector & Donut -->
            <div class="xl:col-span-6 bg-card border border-border p-6 rounded-2xl shadow-xs flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="text-sm font-bold text-foreground">Revenue Attribution by Channel</h3>
                    <p class="text-xs text-muted-foreground mt-0.5">{{ attributionModel }} model · {{ hasSampleData ? 'RM 537.5K' : 'RM 0.00' }} attributed revenue</p>
                  </div>
                  <div class="flex p-0.5 bg-muted rounded-lg" role="group" aria-label="Attribution calculation model">
                    <button
                      v-for="model in ['First-touch', 'Last-touch', 'Linear']"
                      :key="model"
                      @click="attributionModel = model"
                      :class="[
                        'px-2.5 py-1 text-[10px] font-bold rounded-md transition-colors cursor-pointer',
                        attributionModel === model
                          ? 'bg-card text-primary shadow-xs'
                          : 'text-muted-foreground hover:text-foreground'
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
                    <div v-for="(item, idx) in activeAttributionChannels" :key="idx" class="flex justify-between items-center text-xs pb-1.5 border-b border-border/50">
                      <div class="flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" :style="{ backgroundColor: item.color }"></span>
                        <span class="font-medium text-foreground">{{ item.name }}</span>
                      </div>
                      <div class="flex items-center gap-4 text-foreground font-bold tabular-nums">
                        <span>RM {{ item.val }}</span>
                        <span class="text-muted-foreground w-10 text-right">{{ item.pct }}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Grouped Bar Chart -->
            <div class="xl:col-span-6 bg-card border border-border p-6 rounded-2xl shadow-xs flex flex-col justify-between">
              <div>
                <h3 class="text-sm font-bold text-foreground">Channel Lead Generation &amp; Conversion</h3>
                <p class="text-xs text-muted-foreground mt-0.5">Comparing total leads acquired vs closed deals per platform</p>

                <div class="w-full mt-2 select-none">
                  <apexchart type="bar" height="220" :options="channelBarApexOptions" :series="channelBarApexSeries" />
                </div>
              </div>
            </div>

          </div>

          <!-- Sessions & Key Events & Lead Quality Stacked -->
          <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            <div class="xl:col-span-6 bg-card border border-border p-6 rounded-2xl shadow-xs flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-center pb-2">
                  <div>
                    <h3 class="text-sm font-bold text-foreground">Website Sessions &amp; Key Conversion Events</h3>
                    <p class="text-xs text-muted-foreground mt-0.5">Form submissions, WhatsApp link clicks, and consultation inquiries</p>
                  </div>
                  <div class="flex p-0.5 bg-muted rounded-lg" role="group" aria-label="Session interval view">
                    <button
                      v-for="v in ['Daily', 'Weekly']"
                      :key="v"
                      @click="sessionsView = v"
                      :class="[
                        'px-3 py-1 text-[10px] font-bold rounded-md transition-colors cursor-pointer',
                        sessionsView === v
                          ? 'bg-card text-primary shadow-xs'
                          : 'text-muted-foreground hover:text-foreground hover:text-foreground'
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
            <div class="xl:col-span-6 bg-card border border-border p-6 rounded-2xl shadow-xs flex flex-col justify-between">
              <div>
                <h3 class="text-sm font-bold text-foreground">Commercial Lead Qualification Ratio</h3>
                <p class="text-xs text-muted-foreground mt-0.5">Percentage of leads meeting sales qualification criteria</p>

                <div class="w-full mt-2">
                  <apexchart type="bar" height="220" :options="qualityStackedApexOptions" :series="qualityStackedApexSeries" />
                </div>
              </div>
            </div>

          </div>

          <!-- GA4 Traffic Sources Table -->
          <div class="bg-card border border-border rounded-2xl shadow-xs overflow-hidden p-6 space-y-4">
            <h3 class="text-sm font-bold text-foreground">Inbound Traffic Sources &amp; Conversion Rates (GA4)</h3>

            <div class="overflow-x-auto border border-border rounded-xl">
              <table class="w-full text-xs text-left whitespace-nowrap">
                <thead>
                  <tr class="text-[10px] text-muted-foreground uppercase tracking-wider border-b border-border bg-muted/30 font-bold">
                    <th class="px-4 py-3">SOURCE / MEDIUM</th>
                    <th class="px-4 py-3 text-right">SESSIONS</th>
                    <th class="px-4 py-3 text-right">VISITORS</th>
                    <th class="px-4 py-3 text-right">ENGAGEMENT</th>
                    <th class="px-4 py-3 text-right">KEY EVENTS</th>
                    <th class="px-4 py-3 text-right">LEADS</th>
                    <th class="px-4 py-3 text-right">CONV RATE</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-border">
                  <tr v-if="activeMarketingSources.length === 0">
                    <td colspan="7" class="py-8 text-center text-muted-foreground font-medium">
                      No inbound traffic sources recorded in this period.
                    </td>
                  </tr>
                  <tr v-for="(tr, idx) in activeMarketingSources" :key="idx" class="hover:bg-muted/30 transition-colors">
                    <td class="px-4 py-3.5 font-bold text-foreground">{{ tr.source }}</td>
                    <td class="px-4 py-3.5 font-bold text-right text-foreground tabular-nums">{{ tr.sessions.toLocaleString() }}</td>
                    <td class="px-4 py-3.5 font-bold text-right text-foreground tabular-nums">{{ tr.users.toLocaleString() }}</td>
                    <td class="px-4 py-3.5 font-bold text-right text-foreground tabular-nums">{{ tr.engagement }}</td>
                    <td class="px-4 py-3.5 font-bold text-right text-foreground tabular-nums">{{ tr.events.toLocaleString() }}</td>
                    <td class="px-4 py-3.5 font-bold text-right text-foreground tabular-nums">{{ tr.leads.toLocaleString() }}</td>
                    <td class="px-4 py-3.5 font-bold text-right text-primary tabular-nums">{{ tr.convRate }}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Top Landing Pages & UTM Campaigns -->
          <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <div class="xl:col-span-6 bg-card border border-border rounded-2xl shadow-xs p-6 space-y-4">
              <h3 class="text-sm font-bold text-foreground">Top Converting Landing Pages</h3>
              <div class="overflow-x-auto border border-border rounded-xl">
                <table class="w-full text-xs text-left whitespace-nowrap">
                  <thead>
                    <tr class="text-[10px] text-muted-foreground uppercase tracking-wider border-b border-border bg-muted/30 font-bold">
                      <th class="px-4 py-3">PAGE URL</th>
                      <th class="px-4 py-3 text-right">SESSIONS</th>
                      <th class="px-4 py-3 text-right">BOUNCE RATE</th>
                      <th class="px-4 py-3 text-right">LEADS</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-border">
                    <tr v-if="activeTopLandingPages.length === 0">
                      <td colspan="4" class="py-8 text-center text-muted-foreground font-medium">
                        No landing page metrics recorded in this period.
                      </td>
                    </tr>
                    <tr v-for="(lp, idx) in activeTopLandingPages" :key="idx" class="hover:bg-muted/30 transition-colors">
                      <td class="px-4 py-3 font-semibold text-primary hover:underline cursor-pointer">{{ lp.page }}</td>
                      <td class="px-4 py-3 font-bold text-right text-foreground tabular-nums">{{ lp.sessions.toLocaleString() }}</td>
                      <td class="px-4 py-3 font-bold text-right text-muted-foreground tabular-nums">{{ lp.bounce }}%</td>
                      <td class="px-4 py-3 font-bold text-right text-primary tabular-nums">{{ lp.leads }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="xl:col-span-6 bg-card border border-border rounded-2xl shadow-xs p-6 space-y-4">
              <h3 class="text-sm font-bold text-foreground">Active UTM Ad Campaigns</h3>
              <div class="overflow-x-auto border border-border rounded-xl">
                <table class="w-full text-xs text-left whitespace-nowrap">
                  <thead>
                    <tr class="text-[10px] text-muted-foreground uppercase tracking-wider border-b border-border bg-muted/30 font-bold">
                      <th class="px-4 py-3">CAMPAIGN NAME</th>
                      <th class="px-4 py-3">PLATFORM</th>
                      <th class="px-4 py-3 text-right">SESSIONS</th>
                      <th class="px-4 py-3 text-right">LEADS</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-border">
                    <tr v-if="activeTopUtmCampaigns.length === 0">
                      <td colspan="4" class="py-8 text-center text-muted-foreground font-medium">
                        No active UTM campaigns recorded in this period.
                      </td>
                    </tr>
                    <tr v-for="(camp, idx) in activeTopUtmCampaigns" :key="idx" class="hover:bg-muted/30 transition-colors">
                      <td class="px-4 py-3 font-bold text-foreground">{{ camp.campaign }}</td>
                      <td class="px-4 py-3 text-muted-foreground font-medium">{{ camp.source }}</td>
                      <td class="px-4 py-3 font-bold text-right text-foreground tabular-nums">{{ camp.sessions.toLocaleString() }}</td>
                      <td class="px-4 py-3 font-bold text-right text-primary tabular-nums">{{ camp.leads }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>

        <!-- ═════════════════════════════════════════════════════════
             TAB 4: SUPPORT
             ═════════════════════════════════════════════════════════ -->
        <div v-if="activeTab === 'support'" class="space-y-6 animate-in fade-in duration-200">
          
          <!-- Section Title & Context -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 class="text-2xl font-bold tracking-tight text-foreground">
                Support <span class="font-normal text-muted-foreground">overview</span>
              </h1>
              <p class="text-xs text-muted-foreground mt-0.5">
                Support performance for {{ selectedDateRangeLabel }} compared with the previous period.
              </p>
            </div>
          </div>

          <!-- Top KPI Strip (4 Focused Support Metrics) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <!-- 1. AI Deflection Rate -->
            <div class="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground p-5 rounded-2xl shadow-md shadow-primary/15 relative overflow-hidden flex flex-col justify-between h-[154px]">
              <div>
                <div class="flex items-center justify-between">
                  <span class="text-[11px] font-bold tracking-wider uppercase opacity-95">AI Deflection Rate</span>
                </div>
                <div class="text-3xl font-extrabold tracking-tight tabular-nums mt-1">0%</div>
              </div>
              <div>
                <div class="flex items-center justify-between text-[11px] font-semibold opacity-95">
                  <span class="tabular-nums">{{ hasSampleData ? '↓ 16.7 pts vs last period' : '0.0 pts vs last period' }}</span>
                  <span class="tabular-nums">{{ hasSampleData ? '0 of 5 conversations' : '0 of 0 conversations' }}</span>
                </div>
                <div class="text-[10px] opacity-80 pt-1.5 mt-1.5 border-t border-primary-foreground/20">
                  Closed RES-BOT · no human hand-off
                </div>
              </div>
            </div>

            <!-- 2. Total Conversations -->
            <div class="bg-card border border-border p-5 rounded-2xl shadow-xs flex flex-col justify-between h-[154px] hover:border-input transition-colors">
              <div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-1.5 group relative">
                    <span class="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Total Conversations</span>
                    <Info class="w-3 h-3 text-muted-foreground cursor-help" />
                    <div class="absolute left-0 top-5 hidden group-hover:block bg-popover text-popover-foreground text-[10px] p-2 rounded-lg shadow-xl w-52 z-30 font-normal border border-border leading-normal">
                      Total customer support conversations opened across all connected inboxes.
                    </div>
                  </div>
                </div>
                <div class="flex items-baseline gap-2 mt-1">
                  <span class="text-2xl font-bold text-foreground tabular-nums">{{ hasSampleData ? '5' : '0' }}</span>
                  <span class="text-[10px] font-bold text-destructive tabular-nums">{{ hasSampleData ? '↓ 16.7% vs last period' : '0.0%' }}</span>
                </div>
              </div>
              <div class="h-9 w-full">
                <apexchart type="line" height="36" :options="supportConversationsSparklineOptions" :series="supportConversationsSparklineSeries" />
              </div>
              <div class="text-[10px] text-muted-foreground">All channels combined</div>
            </div>

            <!-- 3. Resolved Without Human -->
            <div class="bg-card border border-border p-5 rounded-2xl shadow-xs flex flex-col justify-between h-[154px] hover:border-input transition-colors">
              <div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-1.5 group relative">
                    <span class="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Resolved Without Human</span>
                    <Info class="w-3 h-3 text-muted-foreground cursor-help" />
                    <div class="absolute left-0 top-5 hidden group-hover:block bg-popover text-popover-foreground text-[10px] p-2 rounded-lg shadow-xl w-52 z-30 font-normal border border-border leading-normal">
                      Percentage of conversations fully resolved by AI Assistant without human agent transfer.
                    </div>
                  </div>
                </div>
                <div class="flex items-baseline gap-2 mt-1">
                  <span class="text-2xl font-bold text-foreground tabular-nums">{{ hasSampleData ? '0%' : '0%' }}</span>
                  <span class="text-[10px] font-bold text-destructive tabular-nums">{{ hasSampleData ? '↓ 50 pts vs last period' : '0.0 pts' }}</span>
                </div>
              </div>
              <div class="h-9 w-full">
                <apexchart type="line" height="36" :options="supportResolvedSparklineOptions" :series="supportResolvedSparklineSeries" />
              </div>
              <div class="text-[10px] text-muted-foreground">{{ hasSampleData ? '0 of 1 closed conversations' : '0 of 0 closed conversations' }}</div>
            </div>

            <!-- 4. Avg First Response — Human -->
            <div class="bg-card border border-border p-5 rounded-2xl shadow-xs flex flex-col justify-between h-[154px] hover:border-input transition-colors">
              <div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-1.5 group relative">
                    <span class="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Avg First Response — Human</span>
                    <Info class="w-3 h-3 text-muted-foreground cursor-help" />
                    <div class="absolute left-0 top-5 hidden group-hover:block bg-popover text-popover-foreground text-[10px] p-2 rounded-lg shadow-xl w-52 z-30 font-normal border border-border leading-normal">
                      Average time taken for a human support agent to send the initial reply.
                    </div>
                  </div>
                </div>
                <div class="text-2xl font-bold text-foreground tabular-nums mt-1">
                  {{ hasSampleData ? '0.0 sec' : '--' }}
                </div>
              </div>
              <div class="h-9 w-full">
                <apexchart type="line" height="36" :options="supportAvgResponseSparklineOptions" :series="supportAvgResponseSparklineSeries" />
              </div>
              <div class="text-[10px] text-muted-foreground">AI Assistant ack: {{ hasSampleData ? '3.9 min' : '--' }}</div>
            </div>

          </div>

          <!-- Support Health Pulse -->
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <h2 class="text-sm font-bold text-foreground">Support Health Pulse</h2>
              <span class="text-xs text-muted-foreground">Is my support team keeping up with demand?</span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- SLA Compliance -->
              <div class="bg-card border border-border rounded-2xl p-5 shadow-xs flex flex-col justify-between h-36">
                <div class="flex justify-between items-center">
                  <span class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">SLA Compliance</span>
                  <span class="text-[10px] font-semibold bg-muted text-muted-foreground px-2 py-0.5 rounded-full">No data</span>
                </div>
                <div class="text-2xl font-bold text-muted-foreground my-1">—</div>
                <p class="text-xs text-muted-foreground">No SLA policies applied in this period.</p>
              </div>

              <!-- Awaiting-Customer Ageing -->
              <div class="bg-card border border-border rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div class="flex justify-between items-center">
                    <span class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Awaiting-Customer Ageing</span>
                    <span class="text-[10px] font-bold bg-destructive/10 text-destructive px-2 py-0.5 rounded-full border border-destructive/30">Critical</span>
                  </div>
                  <div class="text-2xl font-bold text-warning tabular-nums mt-1">
                    {{ hasSampleData ? '100% aged' : '0% aged' }}
                  </div>
                  <p class="text-xs text-muted-foreground mt-0.5">
                    {{ hasSampleData ? '2 conversations awaiting reply · 2 beyond 48h' : '0 conversations awaiting reply' }}
                  </p>
                </div>

                <div class="my-2.5">
                  <div class="w-full h-2 bg-muted rounded-full overflow-hidden flex">
                    <div class="bg-primary h-full transition-all duration-300" :style="{ width: '0%' }"></div>
                    <div class="bg-warning h-full transition-all duration-300" :style="{ width: hasSampleData ? '100%' : '0%' }"></div>
                  </div>
                  <div class="flex items-center gap-3 mt-1.5 text-[10px] font-medium text-muted-foreground">
                    <span class="flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-primary"></span> 0% within 48h</span>
                    <span class="flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-warning"></span> {{ hasSampleData ? '100%' : '0%' }} aged</span>
                  </div>
                </div>

                <div class="text-[10px] text-muted-foreground pt-2 border-t border-border">
                  Latest reply came from an agent · aged after 48h
                </div>
              </div>

              <!-- Reopen Rate -->
              <div class="bg-card border border-border rounded-2xl p-5 shadow-xs flex flex-col justify-between h-36">
                <div class="flex justify-between items-center">
                  <span class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Reopen Rate</span>
                  <span class="text-[10px] font-semibold bg-muted text-muted-foreground px-2 py-0.5 rounded-full">No data</span>
                </div>
                <div class="text-2xl font-bold text-muted-foreground my-1">—</div>
                <p class="text-xs text-muted-foreground">No conversations reopened in this period.</p>
              </div>
            </div>
          </div>

          <!-- Agent Hours Recovered Derived Banner -->
          <div class="bg-warning/10 border border-warning/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
            <div class="flex items-center gap-4 shrink-0">
              <div>
                <div class="text-2xl font-extrabold text-warning tabular-nums">{{ hasSampleData ? '0 hrs' : '0 hrs' }}</div>
                <div class="text-[11px] font-medium text-muted-foreground">Agent hours recovered</div>
              </div>
            </div>
            <div class="text-xs text-foreground max-w-2xl leading-relaxed">
              0 AI-resolved conversations × 7.2 min avg handling time — an account-supplied constant, not a RakanSales measurement. Configurable in Support Settings; never hardcoded.
            </div>
            <div class="shrink-0">
              <span class="text-[10px] font-bold tracking-wider text-warning bg-warning/20 px-2.5 py-1 rounded-md border border-warning/30">
                DERIVED
              </span>
            </div>
          </div>

          <!-- Where Enquiries Come From -->
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <h2 class="text-sm font-bold text-foreground">Where enquiries come from</h2>
              <span class="text-xs text-muted-foreground">Category mix and channel entry points</span>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              <!-- Enquiry Mix by Category -->
              <div class="lg:col-span-7 bg-card border border-border rounded-2xl p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div class="flex justify-between items-center pb-2">
                    <div>
                      <h3 class="text-sm font-bold text-foreground">Enquiry mix by category</h3>
                      <p class="text-xs text-muted-foreground mt-0.5">Placeholder data — pending the enquiry category attribute</p>
                    </div>
                    <span class="text-[10px] font-bold bg-warning/20 text-warning px-2.5 py-0.5 rounded-full">
                      31.8% Billing
                    </span>
                  </div>

                  <div class="space-y-2.5 mt-4">
                    <div v-for="cat in activeSupportCategories" :key="cat.code" class="flex items-center gap-3 text-xs">
                      <div class="w-36 shrink-0 flex items-center gap-1.5">
                        <span class="font-medium text-foreground truncate">{{ cat.name }}</span>
                        <span class="text-[9px] font-semibold text-muted-foreground uppercase">{{ cat.code }}</span>
                      </div>
                      <div class="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                        <div
                          class="h-full rounded-full transition-all duration-300"
                          :style="{ width: `${cat.pct}%`, backgroundColor: cat.color }"
                        ></div>
                      </div>
                      <div class="w-20 text-right text-foreground font-bold tabular-nums text-xs">
                        {{ cat.count }} · {{ cat.pct }}%
                      </div>
                    </div>
                  </div>
                </div>

                <div class="text-[11px] text-muted-foreground pt-3 mt-4 border-t border-border">
                  Billing-related 327 — of which 281 answered without an agent
                </div>
              </div>

              <!-- Conversations by Channel -->
              <div class="lg:col-span-5 bg-card border border-border rounded-2xl p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div class="pb-2">
                    <h3 class="text-sm font-bold text-foreground">Conversations by channel</h3>
                    <p class="text-xs text-muted-foreground mt-0.5">Volume and deflection rate per entry point</p>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center mt-4">
                    <div class="sm:col-span-6 flex justify-center">
                      <apexchart type="donut" width="180" height="180" :options="supportChannelDonutOptions" :series="supportChannelDonutSeries" />
                    </div>

                    <div class="sm:col-span-6 space-y-3">
                      <div class="flex justify-between items-center text-xs pb-1.5 border-b border-border/50">
                        <div class="flex items-center gap-2">
                          <span class="w-2.5 h-2.5 rounded-full bg-chart-1"></span>
                          <span class="font-medium text-foreground">Website</span>
                        </div>
                        <div class="flex items-center gap-3 tabular-nums">
                          <span class="font-bold text-foreground">{{ hasSampleData ? '3' : '0' }}</span>
                          <span class="font-bold text-primary">{{ hasSampleData ? '33.3%' : '0%' }}</span>
                        </div>
                      </div>

                      <div class="flex justify-between items-center text-xs pb-1.5 border-b border-border/50">
                        <div class="flex items-center gap-2">
                          <span class="w-2.5 h-2.5 rounded-full bg-destructive"></span>
                          <span class="font-medium text-foreground">Email</span>
                        </div>
                        <div class="flex items-center gap-3 tabular-nums">
                          <span class="font-bold text-foreground">{{ hasSampleData ? '1' : '0' }}</span>
                          <span class="font-bold text-muted-foreground">{{ hasSampleData ? '0%' : '0%' }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="flex justify-between items-center text-[10px] text-muted-foreground pt-3 mt-4 border-t border-border">
                  <span>Website share 75%</span>
                  <span>Percentages show deflection, not volume share</span>
                </div>
              </div>

            </div>
          </div>

          <!-- Handling Load Section -->
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <h2 class="text-sm font-bold text-foreground">Handling load</h2>
              <span class="text-xs text-muted-foreground">Distribution across the AI Assistant and support agents — not a ranking</span>
            </div>

            <div class="bg-card border border-border rounded-2xl p-6 shadow-xs">
              <div class="overflow-x-auto">
                <table class="w-full text-xs text-left whitespace-nowrap">
                  <thead>
                    <tr class="text-[10px] text-muted-foreground uppercase tracking-wider border-b border-border pb-2">
                      <th class="py-2.5 font-bold">HANDLED BY</th>
                      <th class="py-2.5 text-right font-bold">CONVERSATIONS</th>
                      <th class="py-2.5 text-right font-bold">AVG FIRST RESPONSE</th>
                      <th class="py-2.5 text-right font-bold">REOPEN</th>
                      <th class="py-2.5 text-right font-bold">SLA</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-border">
                    <tr v-for="agent in activeSupportAgents" :key="agent.name" class="hover:bg-muted/30 transition-colors">
                      <td class="py-3 flex items-center gap-3">
                        <div v-if="agent.isBot" class="w-8 h-8 rounded-full bg-tag-4 text-tag-4-foreground flex items-center justify-center">
                          <Bot class="w-4 h-4" />
                        </div>
                        <div v-else :class="['w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold', agent.avatarBg]">
                          {{ agent.initials }}
                        </div>
                        <div>
                          <div class="font-bold text-foreground">{{ agent.name }}</div>
                          <div class="text-[11px] text-muted-foreground">{{ agent.role }}</div>
                        </div>
                      </td>
                      <td class="py-3 text-right font-bold text-foreground tabular-nums">
                        {{ agent.conversations }}
                      </td>
                      <td class="py-3 text-right text-muted-foreground tabular-nums">
                        {{ agent.firstResponse }}
                      </td>
                      <td class="py-3 text-right text-muted-foreground tabular-nums">
                        {{ agent.reopen }}
                      </td>
                      <td class="py-3 text-right">
                        <span class="text-[10px] font-semibold bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                          {{ agent.sla }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="text-xs text-muted-foreground pt-3 mt-2 border-t border-border">
                No CSAT responses in this period
              </div>
            </div>
          </div>

        </div>

      </div>
    </main>

    <!-- Slide-Over Opportunity Details Drawer -->
    <div v-if="selectedDeal" class="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
      <div class="absolute inset-0 bg-background/80 backdrop-blur-xs transition-opacity" @click="selectedDeal = null"></div>
      
      <div class="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div class="w-screen max-w-md bg-card border-l border-border p-6 shadow-2xl flex flex-col justify-between">
          <div class="space-y-5">
            <div class="flex justify-between items-start">
              <div>
                <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-success/10 text-success border border-success/30">
                  {{ selectedDeal.stage }}
                </span>
                <h2 id="drawer-title" class="text-base font-bold text-foreground mt-2">{{ selectedDeal.title }}</h2>
                <p class="text-xs text-muted-foreground">{{ selectedDeal.company }}</p>
              </div>
              <button @click="selectedDeal = null" class="p-1 rounded-lg text-muted-foreground hover:text-muted-foreground hover:text-foreground cursor-pointer" aria-label="Close opportunity drawer">
                ✕
              </button>
            </div>

            <div class="p-4 bg-muted/30 rounded-xl border border-border space-y-2 text-xs">
              <div class="flex justify-between">
                <span class="text-muted-foreground">Opportunity Value:</span>
                <span class="font-bold text-foreground tabular-nums">RM {{ selectedDeal.value }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">Assigned Owner:</span>
                <span class="font-bold text-foreground">{{ selectedDeal.owner }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">Primary Channel:</span>
                <span class="font-bold text-tag-1-foreground">{{ selectedDeal.source }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">Inactivity Status:</span>
                <span class="font-bold text-warning">{{ selectedDeal.age }}</span>
              </div>
            </div>

            <!-- Action Sequence -->
            <div class="space-y-2">
              <label for="drawer-msg-input" class="text-xs font-bold text-foreground">Follow-up Message Template:</label>
              <textarea
                id="drawer-msg-input"
                v-model="quickMessageText"
                rows="3"
                class="w-full p-2.5 bg-background border border-border rounded-xl text-xs focus:ring-1 focus:ring-primary focus:outline-none"
              ></textarea>
            </div>
          </div>

          <div class="flex gap-2 pt-4 border-t border-border">
            <button
              @click="sendQuickMessage"
              class="flex-1 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-xs font-bold transition-all shadow-md shadow-primary/20 cursor-pointer"
            >
              Send via WhatsApp
            </button>
            <button
              @click="selectedDeal = null"
              class="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-xl text-xs font-bold transition-colors cursor-pointer"
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
import { useChartTheme } from '@/composables/useChartTheme'

const { isDark, chartBase, colors } = useChartTheme()
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
  ArrowRight,
  Bot
} from 'lucide-vue-next'

const tabs = [
  { id: 'overview', label: 'Sale' },
  { id: 'pipeline', label: 'Pipeline' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'support', label: 'Support' }
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
  { id: 'sep2026', label: '1 Sep 2026 — 30 Sep 2026' },
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
const sparklineBlueOptions = computed(() => ({
  ...chartBase.value,
  chart: { ...chartBase.value.chart, type: 'area', sparkline: { enabled: true } },
  stroke: { curve: 'smooth', width: 2 },
  fill: { type: 'gradient', gradient: { opacityFrom: 0.35, opacityTo: 0 } },
  colors: [colors.value.chart1],
  tooltip: { theme: chartBase.value.tooltip.theme, fixed: { enabled: false }, x: { show: false }, y: { title: { formatter: () => '' } } }
}))
const sparklinePipelineSeries = computed(() => [
  { name: 'Pipeline', data: hasSampleData.value ? [2.8, 3.1, 3.0, 3.4, 3.2, 3.6, 3.84] : [0, 0, 0, 0, 0, 0, 0] }
])

const sparklinePurpleOptions = computed(() => ({
  ...chartBase.value,
  chart: { ...chartBase.value.chart, type: 'area', sparkline: { enabled: true } },
  stroke: { curve: 'smooth', width: 2 },
  fill: { type: 'gradient', gradient: { opacityFrom: 0.35, opacityTo: 0 } },
  colors: [colors.value.chart4],
  tooltip: { theme: chartBase.value.tooltip.theme, fixed: { enabled: false }, x: { show: false } }
}))
const sparklineConvSeries = computed(() => [
  { name: 'Conv Rate', data: hasSampleData.value ? [11.2, 12.0, 11.8, 13.2, 13.8, 14.1, 14.3] : [0, 0, 0, 0, 0, 0, 0] }
])

const sparklineOrangeOptions = computed(() => ({
  ...chartBase.value,
  chart: { ...chartBase.value.chart, type: 'area', sparkline: { enabled: true } },
  stroke: { curve: 'smooth', width: 2 },
  fill: { type: 'gradient', gradient: { opacityFrom: 0.35, opacityTo: 0 } },
  colors: [colors.value.chart7],
  tooltip: { theme: chartBase.value.tooltip.theme, fixed: { enabled: false }, x: { show: false } }
}))
const sparklineRespSeries = computed(() => [
  { name: 'Response (min)', data: hasSampleData.value ? [18.2, 16.5, 15.0, 14.2, 13.5, 13.0, 12.75] : [0, 0, 0, 0, 0, 0, 0] }
])

// Sales Health SLA Radial
const slaRadialOptions = computed(() => ({
  ...chartBase.value,
  chart: { ...chartBase.value.chart, type: 'radialBar', sparkline: { enabled: true } },
  plotOptions: {
    radialBar: {
      hollow: { size: '60%' },
      track: { background: colors.value.muted },
      dataLabels: {
        name: { show: false },
        value: {
          fontSize: '12px',
          fontWeight: 700,
          offsetY: 4,
          color: chartBase.value.chart.foreColor,
          formatter: (val: number) => val + '%'
        }
      }
    }
  },
  colors: [colors.value.primary]
}))

const winRateTrendOptions = computed(() => ({
  ...chartBase.value,
  chart: { ...chartBase.value.chart, type: 'area', sparkline: { enabled: true } },
  stroke: { curve: 'smooth', width: 2 },
  fill: { type: 'gradient', gradient: { opacityFrom: 0.4, opacityTo: 0 } },
  colors: [colors.value.primary],
  tooltip: { theme: chartBase.value.tooltip.theme }
}))
const winRateTrendSeries = computed(() => [
  { name: 'Win Rate', data: hasSampleData.value ? [12.0, 14.5, 13.8, 16.2, 17.5, 18.5] : [0, 0, 0, 0, 0, 0] }
])

// Revenue vs Target Apex Chart
const revenueApexOptions = computed(() => ({
  ...chartBase.value,
  chart: {
    ...chartBase.value.chart,
    type: 'area'
  },
  stroke: { curve: 'smooth', width: 2.5 },
  colors: [colors.value.primary],
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.35,
      opacityTo: 0.05,
      stops: [0, 90, 100],
      colorStops: [
        { offset: 0, color: colors.value.primary, opacity: 0.35 },
        { offset: 100, color: colors.value.brandSecondary, opacity: 0.0 }
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
    labels: { style: { colors: colors.value.mutedForeground, fontSize: '11px' } },
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: {
    labels: {
      style: { colors: colors.value.mutedForeground, fontSize: '11px' },
      formatter: (val: number) => `RM ${val}k`
    }
  },
  grid: { borderColor: colors.value.border, strokeDashArray: 3 },
  tooltip: {
    theme: chartBase.value.tooltip.theme,
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
  ...chartBase.value,
  chart: { ...chartBase.value.chart, type: 'bar' },
  plotOptions: {
    bar: {
      horizontal: true,
      borderRadius: 4,
      barHeight: '55%',
      distributed: false
    }
  },
  colors: [colors.value.primary],
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
    labels: { style: { colors: colors.value.mutedForeground, fontSize: '11px', fontWeight: 600 } }
  },
  grid: { show: false },
  tooltip: { theme: chartBase.value.tooltip.theme }
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
  { rank: '01', name: 'Yee Ling', initials: 'YL', avatarBg: 'bg-tag-2 text-tag-2-foreground', won: 2, open: 4, revenue: '522K', winRate: 68 },
  { rank: '02', name: 'Amirul Mokhtar', initials: 'AM', avatarBg: 'bg-tag-4 text-tag-4-foreground', won: 2, open: 17, revenue: '15.3K', winRate: 100 },
  { rank: '03', name: 'Kausalya Saundarajan', initials: 'KS', avatarBg: 'bg-tag-1 text-tag-1-foreground', won: 1, open: 1, revenue: '216', winRate: 100 }
]
const activeTopAgents = computed(() => hasSampleData.value ? topAgents : [])

const overviewChannels = computed(() => [
  { channel: 'WhatsApp Direct', count: 238, pct: 61, color: colors.value.chart1 },
  { channel: 'Email Inbound', count: 151, pct: 39, color: colors.value.chart4 },
  { channel: 'Website LiveChat', count: 0, pct: 0, color: colors.value.chart2 },
  { channel: 'Facebook Messenger', count: 0, pct: 0, color: colors.value.chart5 }
])
const activeOverviewChannels = computed(() => {
  if (!hasSampleData.value) {
    return overviewChannels.value.map(c => ({ ...c, count: 0, pct: 0 }))
  }
  return overviewChannels.value
})

const channelDonutOptions = computed(() => ({
  ...chartBase.value,
  chart: { ...chartBase.value.chart, type: 'donut' },
  labels: ['WhatsApp Direct', 'Email Inbound'],
  colors: [colors.value.chart1, colors.value.chart4],
  stroke: { show: false, width: 0, colors: [colors.value.card] },
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
            color: colors.value.mutedForeground,
            fontSize: '10px',
            fontWeight: 600,
            formatter: () => hasSampleData.value ? '389' : '0'
          }
        }
      }
    }
  },
  tooltip: { theme: chartBase.value.tooltip.theme }
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
const velocityApexOptions = computed(() => ({
  ...chartBase.value,
  chart: { ...chartBase.value.chart, type: 'bar' },
  plotOptions: {
    bar: {
      horizontal: true,
      borderRadius: 4,
      barHeight: '50%',
      colors: {
        ranges: [
          { from: 8, to: 15, color: colors.value.warning },
          { from: 0, to: 7.9, color: colors.value.primary }
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
    labels: { style: { colors: colors.value.mutedForeground, fontSize: '11px', fontWeight: 600 } }
  },
  grid: { show: false },
  tooltip: { theme: chartBase.value.tooltip.theme }
}))
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
  ...chartBase.value,
  chart: { ...chartBase.value.chart, type: 'donut' },
  labels: ['Competitor', 'Budget', 'Unreachable', 'Timing'],
  colors: [colors.value.chart1, colors.value.chart3, colors.value.destructive, colors.value.chart2],
  stroke: { show: false, width: 0, colors: [colors.value.card] },
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
            color: colors.value.mutedForeground,
            fontSize: '10px',
            formatter: () => hasSampleData.value ? '22' : '0'
          }
        }
      }
    }
  },
  tooltip: { theme: chartBase.value.tooltip.theme }
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
      { name: 'WhatsApp Direct', val: '0.00', pct: 0, color: colors.value.chart1 },
      { name: 'Direct Website Search', val: '0.00', pct: 0, color: colors.value.chart2 },
      { name: 'Google Organic', val: '0.00', pct: 0, color: colors.value.chart4 },
      { name: 'Meta Ads', val: '0.00', pct: 0, color: colors.value.chart3 }
    ]
  }
  if (attributionModel.value === 'Last-touch') {
    return [
      { name: 'WhatsApp Direct (Last Touch)', val: '378K', pct: 70, color: colors.value.chart1 },
      { name: 'Direct Website Search', val: '159K', pct: 30, color: colors.value.chart2 },
      { name: 'Google Organic', val: '45K', pct: 8, color: colors.value.chart4 },
      { name: 'Meta Ads', val: '28K', pct: 5, color: colors.value.chart3 }
    ]
  } else if (attributionModel.value === 'First-touch') {
    return [
      { name: 'Google Organic (First Touch)', val: '268K', pct: 50, color: colors.value.chart4 },
      { name: 'Meta Ads Campaign', val: '161K', pct: 30, color: colors.value.chart3 },
      { name: 'WhatsApp Inbound', val: '108K', pct: 20, color: colors.value.chart1 }
    ]
  } else {
    return [
      { name: 'WhatsApp Direct (Linear)', val: '215K', pct: 40, color: colors.value.chart1 },
      { name: 'Google Organic (Linear)', val: '188K', pct: 35, color: colors.value.chart4 },
      { name: 'Meta Ads (Linear)', val: '134K', pct: 25, color: colors.value.chart3 }
    ]
  }
})

const attributionApexOptions = computed(() => ({
  ...chartBase.value,
  chart: { ...chartBase.value.chart, type: 'donut' },
  labels: activeAttributionChannels.value.map(c => c.name),
  colors: activeAttributionChannels.value.map(c => c.color),
  stroke: { show: false, width: 0, colors: [colors.value.card] },
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
            color: colors.value.mutedForeground,
            fontSize: '10px',
            formatter: () => hasSampleData.value ? 'RM 537.5K' : 'RM 0.00'
          }
        }
      }
    }
  },
  tooltip: { theme: chartBase.value.tooltip.theme }
}))

const attributionApexSeries = computed(() => activeAttributionChannels.value.map(c => c.pct))

// Channel Grouped Bar Chart
const channelBarApexOptions = computed(() => ({
  ...chartBase.value,
  chart: { ...chartBase.value.chart, type: 'bar' },
  plotOptions: { bar: { horizontal: false, columnWidth: '50%', borderRadius: 3 } },
  colors: [colors.value.primary, colors.value.info],
  dataLabels: { enabled: false },
  stroke: { show: true, width: 2, colors: ['transparent'] },
  xaxis: {
    categories: ['WhatsApp', 'Facebook', 'Google', 'Instagram', 'Email', 'Direct'],
    labels: { style: { colors: colors.value.mutedForeground, fontSize: '11px' } }
  },
  yaxis: {
    labels: { style: { colors: colors.value.mutedForeground, fontSize: '11px' } }
  },
  legend: {
    position: 'top',
    horizontalAlign: 'center',
    labels: { colors: colors.value.mutedForeground }
  },
  grid: { borderColor: colors.value.border, strokeDashArray: 3 },
  tooltip: { theme: chartBase.value.tooltip.theme }
}))
const channelBarApexSeries = computed(() => [
  { name: 'Leads Generated', data: hasSampleData.value ? [380, 190, 170, 70, 60, 75] : [0, 0, 0, 0, 0, 0] },
  { name: 'Leads Converted', data: hasSampleData.value ? [80, 35, 40, 15, 18, 12] : [0, 0, 0, 0, 0, 0] }
])

// Sessions Dual-Axis Line Chart
const sessionsDualApexOptions = computed(() => ({
  ...chartBase.value,
  chart: { ...chartBase.value.chart, type: 'line' },
  stroke: { curve: 'smooth', width: 2.5 },
  colors: [colors.value.info, colors.value.primary],
  xaxis: {
    categories: ['Jul 1', 'Jul 7', 'Jul 13', 'Jul 19', 'Jul 25', 'Jul 29'],
    labels: { style: { colors: colors.value.mutedForeground, fontSize: '10px' } }
  },
  yaxis: [
    {
      title: { text: 'Sessions', style: { color: colors.value.info, fontSize: '10px' } },
      labels: { style: { colors: colors.value.info, fontSize: '10px' } }
    },
    {
      opposite: true,
      title: { text: 'Key Events', style: { color: colors.value.primary, fontSize: '10px' } },
      labels: { style: { colors: colors.value.primary, fontSize: '10px' } }
    }
  ],
  legend: { position: 'top', labels: { colors: colors.value.mutedForeground } },
  grid: { borderColor: colors.value.border, strokeDashArray: 3 },
  tooltip: { theme: chartBase.value.tooltip.theme }
}))
const sessionsDualApexSeries = computed(() => [
  { name: 'Sessions', type: 'line', data: hasSampleData.value ? [2900, 3200, 3450, 3600, 3850, 4100] : [0, 0, 0, 0, 0, 0] },
  { name: 'Key Events', type: 'line', data: hasSampleData.value ? [145, 170, 185, 205, 220, 240] : [0, 0, 0, 0, 0, 0] }
])

// Lead Quality Stacked Horizontal
const qualityStackedApexOptions = computed(() => ({
  ...chartBase.value,
  chart: { ...chartBase.value.chart, type: 'bar', stacked: true, stackType: '100%' },
  plotOptions: { bar: { horizontal: true, barHeight: '50%', borderRadius: 2 } },
  colors: [colors.value.primary, colors.value.muted],
  xaxis: { labels: { style: { colors: colors.value.mutedForeground, fontSize: '10px' } } },
  yaxis: {
    categories: ['Email', 'Instagram', 'Google', 'Facebook', 'WhatsApp'],
    labels: { style: { colors: colors.value.mutedForeground, fontSize: '11px', fontWeight: 600 } }
  },
  legend: { position: 'top', labels: { colors: colors.value.mutedForeground } },
  grid: { show: false },
  tooltip: { theme: chartBase.value.tooltip.theme }
}))
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

// ═════════════════════════════════════════════════════════
// TAB 4: SUPPORT STATE & APEXCHARTS
// ═════════════════════════════════════════════════════════
const supportConversationsSparklineOptions = computed(() => ({
  ...chartBase.value,
  chart: { ...chartBase.value.chart, type: 'line', sparkline: { enabled: true } },
  stroke: { curve: 'straight', width: 2 },
  colors: [colors.value.info],
  tooltip: { theme: chartBase.value.tooltip.theme, fixed: { enabled: false }, x: { show: false } }
}))
const supportConversationsSparklineSeries = computed(() => [
  { name: 'Conversations', data: hasSampleData.value ? [0, 4, 0, 5, 0, 4, 0, 4, 0] : [0, 0, 0, 0, 0, 0, 0, 0, 0] }
])

const supportResolvedSparklineOptions = computed(() => ({
  ...chartBase.value,
  chart: { ...chartBase.value.chart, type: 'line', sparkline: { enabled: true } },
  stroke: { curve: 'straight', width: 2 },
  colors: [colors.value.tag4],
  tooltip: { theme: chartBase.value.tooltip.theme, fixed: { enabled: false }, x: { show: false } }
}))
const supportResolvedSparklineSeries = computed(() => [
  { name: 'Resolved', data: [0, 0, 0, 0, 0, 0, 0, 0] }
])

const supportAvgResponseSparklineOptions = computed(() => ({
  ...chartBase.value,
  chart: { ...chartBase.value.chart, type: 'line', sparkline: { enabled: true } },
  stroke: { curve: 'straight', width: 2 },
  colors: [colors.value.warning],
  tooltip: { theme: chartBase.value.tooltip.theme, fixed: { enabled: false }, x: { show: false } }
}))
const supportAvgResponseSparklineSeries = computed(() => [
  { name: 'Response', data: [0, 0, 0, 0, 0, 0, 0, 0] }
])

const supportChannelDonutOptions = computed(() => ({
  ...chartBase.value,
  chart: { ...chartBase.value.chart, type: 'donut' },
  labels: ['Website', 'Email'],
  colors: [colors.value.chart1, colors.value.destructive],
  stroke: { show: false, width: 0, colors: [colors.value.card] },
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
            label: 'TOTAL',
            color: colors.value.mutedForeground,
            fontSize: '9px',
            fontWeight: 700,
            formatter: () => hasSampleData.value ? '4' : '0'
          }
        }
      }
    }
  },
  tooltip: { theme: chartBase.value.tooltip.theme }
}))

const supportChannelDonutSeries = computed(() => hasSampleData.value ? [3, 1] : [0, 0])

const defaultSupportCategories = computed(() => [
  { name: 'Order status', code: 'ORDER-STATUS', color: colors.value.chart1, count: 296, pct: 22.6 },
  { name: 'Payment / billing', code: 'BILLING', color: colors.value.chart3, count: 210, pct: 16.1 },
  { name: 'Delivery / shipping', code: 'SHIPPING', color: colors.value.chart2, count: 174, pct: 13.3 },
  { name: 'Product enquiry', code: 'PRODUCT-INFO', color: colors.value.chart4, count: 153, pct: 11.7 },
  { name: 'Returns & refunds', code: 'RETURNS', color: colors.value.chart7, count: 129, pct: 9.9 },
  { name: 'Technical support', code: 'TECH-SUPPORT', color: colors.value.chart5, count: 95, pct: 7.3 },
  { name: 'Unclassified', code: 'OTHER', color: colors.value.mutedForeground, count: 34, pct: 2.6 }
])

const activeSupportCategories = computed(() => {
  if (!hasSampleData.value) {
    return defaultSupportCategories.value.map(c => ({ ...c, count: 0, pct: 0 }))
  }
  return defaultSupportCategories.value
})

interface SupportAgentItem {
  name: string
  role: string
  isBot: boolean
  initials?: string
  avatarBg?: string
  conversations: number
  firstResponse: string
  reopen: string
  sla: string
}

const defaultSupportAgents: SupportAgentItem[] = [
  {
    name: 'AI Assistant',
    role: 'AI Assistant',
    isBot: true,
    conversations: 0,
    firstResponse: '3.9 min',
    reopen: '—',
    sla: 'n/a'
  },
  {
    name: 'Unassigned',
    role: 'Support agent',
    isBot: false,
    initials: 'U',
    avatarBg: 'bg-tag-4 text-tag-4-foreground',
    conversations: 3,
    firstResponse: '—',
    reopen: '—',
    sla: 'n/a'
  },
  {
    name: 'Azhar',
    role: 'Support agent',
    isBot: false,
    initials: 'A',
    avatarBg: 'bg-tag-1 text-tag-1-foreground',
    conversations: 1,
    firstResponse: '—',
    reopen: '—',
    sla: 'n/a'
  },
  {
    name: 'Bryan Lee',
    role: 'Support agent',
    isBot: false,
    initials: 'BL',
    avatarBg: 'bg-tag-2 text-tag-2-foreground',
    conversations: 1,
    firstResponse: '—',
    reopen: '—',
    sla: 'n/a'
  }
]

const activeSupportAgents = computed(() => {
  if (!hasSampleData.value) {
    return defaultSupportAgents.map(a => ({
      ...a,
      conversations: 0,
      firstResponse: a.isBot ? '--' : '—'
    }))
  }
  return defaultSupportAgents
})
</script>

<style scoped>
.divide-y > :not([hidden]) ~ :not([hidden]) {
  border-top-width: 1px;
}
</style>
