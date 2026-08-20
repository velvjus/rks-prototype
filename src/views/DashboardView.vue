<template>
  <div class="h-full flex flex-col bg-gray-50 dark:bg-background overflow-hidden text-sm">
    <!-- Main Content Canvas (Scrollable) -->
    <main class="flex-1 overflow-y-auto bg-gray-50 dark:bg-background">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        <!-- Tab Navigation Buttons & Controls -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 dark:border-border pb-4">
          <div class="flex items-center gap-2 p-1 bg-gray-200/50 dark:bg-muted rounded-full">
            <button
              v-for="tab in ['overview', 'pipeline', 'marketing']"
              :key="tab"
              @click="activeTab = tab"
              :class="[
                'px-5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer',
                activeTab === tab
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-muted-foreground hover:text-gray-900 dark:hover:text-foreground'
              ]"
            >
              {{ tab }}
            </button>
          </div>

          <!-- Date Picker & Export Actions -->
          <div class="flex items-center gap-2 self-stretch sm:self-auto">
            <button class="inline-flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-card border border-gray-200 dark:border-border hover:bg-gray-50 dark:hover:bg-muted text-gray-700 dark:text-foreground rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer">
              <Calendar class="w-4 h-4 text-gray-400" />
              <span>May 25, 2026 – Jun 23, 2026</span>
            </button>
            <button class="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer">
              <Plus class="w-4 h-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        <!-- ═════════════════════════════════════════════════════════
             TAB 1: OVERVIEW
             ═════════════════════════════════════════════════════════ -->
        <div v-if="activeTab === 'overview'" class="space-y-6">
          <!-- Page title -->
          <div>
            <h1 class="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-foreground">Overview</h1>
            <p class="text-sm text-gray-500 dark:text-muted-foreground mt-0.5">Performance for 25 May — 23 Jun 2026 compared with the previous period.</p>
          </div>

          <!-- KPI Cards Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <!-- Total Revenue Card (Green background) -->
            <div class="bg-gradient-to-br from-emerald-600 to-emerald-500 dark:from-emerald-700 dark:to-emerald-600 text-white p-5 rounded-2xl shadow-sm relative overflow-hidden flex flex-col justify-between h-[150px]">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold opacity-90">Total revenue won</span>
                <div class="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                  <Zap class="w-4 h-4 text-white fill-current" />
                </div>
              </div>
              <div>
                <h3 class="text-3xl font-extrabold tracking-tight">RM 509.6K</h3>
                <p class="text-xs opacity-90 mt-1">+105.1% vs last period</p>
              </div>
            </div>

            <!-- Total Leads Card -->
            <div class="bg-white dark:bg-card border border-gray-200 dark:border-border p-5 rounded-2xl shadow-sm relative overflow-hidden flex flex-col justify-between h-[150px] group hover:shadow-md transition-shadow">
              <div class="flex items-start justify-between">
                <div>
                  <span class="text-xs text-gray-500 dark:text-muted-foreground font-semibold">Total Leads</span>
                  <h3 class="text-2xl font-bold text-gray-900 dark:text-foreground mt-1">281</h3>
                </div>
                <span class="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-150 dark:border-emerald-900/50 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <ArrowUpRight class="w-3 h-3" /> +5.4%
                </span>
              </div>
              <!-- Sparkline SVG -->
              <div class="h-8 w-full mt-2">
                <svg class="w-full h-full" viewBox="0 0 200 40" preserveAspectRatio="none">
                  <path d="M 0 35 C 20 30, 40 38, 60 22 C 80 18, 100 28, 120 12 C 140 8, 160 32, 180 20 C 190 15, 195 28, 200 5" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>
            </div>

            <!-- Conversion To Won Card -->
            <div class="bg-white dark:bg-card border border-gray-200 dark:border-border p-5 rounded-2xl shadow-sm relative overflow-hidden flex flex-col justify-between h-[150px] group hover:shadow-md transition-shadow">
              <div class="flex items-start justify-between">
                <div>
                  <span class="text-xs text-gray-500 dark:text-muted-foreground font-semibold">Conversion To Won</span>
                  <h3 class="text-2xl font-bold text-gray-900 dark:text-foreground mt-1">2.0%</h3>
                </div>
                <span class="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-150 dark:border-emerald-900/50 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <ArrowUpRight class="w-3 h-3" /> +2.3pts
                </span>
              </div>
              <!-- Sparkline SVG (Purple) -->
              <div class="h-8 w-full mt-2">
                <svg class="w-full h-full" viewBox="0 0 200 40" preserveAspectRatio="none">
                  <path d="M 0 32 C 20 38, 40 20, 60 30 C 80 35, 100 15, 120 25 C 140 32, 160 12, 180 18 C 190 20, 195 10, 200 8" fill="none" stroke="#8b5cf6" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>
            </div>

            <!-- AVG First Response Card -->
            <div class="bg-white dark:bg-card border border-gray-200 dark:border-border p-5 rounded-2xl shadow-sm relative overflow-hidden flex flex-col justify-between h-[150px] group hover:shadow-md transition-shadow">
              <div class="flex items-start justify-between">
                <div>
                  <span class="text-xs text-gray-500 dark:text-muted-foreground font-semibold">AVG First Response</span>
                  <h3 class="text-2xl font-bold text-gray-900 dark:text-foreground mt-1">8420.5</h3>
                </div>
                <span class="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-150 dark:border-emerald-900/50 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <ArrowUpRight class="w-3 h-3" /> +101.2% faster
                </span>
              </div>
              <!-- Sparkline SVG (Orange) -->
              <div class="h-8 w-full mt-2">
                <svg class="w-full h-full" viewBox="0 0 200 40" preserveAspectRatio="none">
                  <path d="M 0 15 C 30 20, 60 15, 90 28 C 120 38, 150 25, 180 32 C 190 35, 195 28, 200 30" fill="none" stroke="#f97316" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>
            </div>

            <!-- AVG Deal Value Card -->
            <div class="bg-white dark:bg-card border border-gray-200 dark:border-border p-5 rounded-2xl shadow-sm relative overflow-hidden flex flex-col justify-between h-[150px] group hover:shadow-md transition-shadow">
              <div class="flex items-start justify-between">
                <div>
                  <span class="text-xs text-gray-500 dark:text-muted-foreground font-semibold">AVG Deal Value</span>
                  <h3 class="text-2xl font-bold text-gray-900 dark:text-foreground mt-1">RM 756</h3>
                </div>
                <span class="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-150 dark:border-emerald-900/50 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <ArrowUpRight class="w-3 h-3" /> +99.4%
                </span>
              </div>
              <!-- Sparkline SVG (Blue) -->
              <div class="h-8 w-full mt-2">
                <svg class="w-full h-full" viewBox="0 0 200 40" preserveAspectRatio="none">
                  <path d="M 0 38 C 30 35, 60 25, 90 28 C 120 18, 150 22, 180 8 C 190 5, 195 10, 200 6" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Revenue vs Target & AI Assistant -->
          <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            <!-- Revenue vs Target Card -->
            <div class="xl:col-span-8 bg-white dark:bg-card border border-gray-200 dark:border-border p-6 rounded-2xl shadow-sm flex flex-col justify-between">
              <div>
                <!-- Header -->
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="text-base font-bold text-gray-900 dark:text-foreground flex items-center gap-1">
                      Revenue vs target
                      <Info class="w-3.5 h-3.5 text-gray-400 cursor-help" />
                    </h3>
                    <p class="text-xs text-gray-500 dark:text-muted-foreground mt-0.5">Cumulative revenue vs target for 23 Jun 2026</p>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="flex p-0.5 bg-gray-100 dark:bg-muted rounded-lg">
                      <button
                        v-for="p in ['30D', '90D', 'YTD']"
                        :key="p"
                        @click="revenuePeriod = p"
                        :class="[
                          'px-2.5 py-1 text-[10px] font-bold rounded-md transition-colors cursor-pointer',
                          revenuePeriod === p
                            ? 'bg-white dark:bg-card text-gray-950 dark:text-foreground shadow-sm'
                            : 'text-gray-500 hover:text-gray-900 dark:hover:text-foreground'
                        ]"
                      >
                        {{ p }}
                      </button>
                    </div>
                    <div class="relative">
                      <button class="inline-flex items-center gap-1 px-2.5 py-1 bg-white dark:bg-muted border border-gray-200 dark:border-border text-[10px] font-bold rounded-lg text-gray-700 dark:text-foreground hover:bg-gray-50 dark:hover:bg-muted/80 cursor-pointer">
                        <span>All Teams</span>
                        <ChevronDown class="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Main metrics -->
                <div class="flex items-baseline gap-2 mt-4">
                  <span class="text-3xl font-extrabold text-gray-900 dark:text-foreground">RM 509,612</span>
                  <span class="text-xs text-gray-500 dark:text-muted-foreground">of RM 372,685.14 target</span>
                  <span class="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                    <ArrowUpRight class="w-3 h-3" /> 105.1%
                  </span>
                </div>

                <!-- Achievement progress bar -->
                <div class="mt-4">
                  <div class="w-full h-2 bg-gray-100 dark:bg-muted rounded-full overflow-hidden">
                    <div class="h-full bg-emerald-500 rounded-full" style="width: 100%;"></div>
                  </div>
                  <div class="flex justify-between items-center text-[10px] text-gray-500 dark:text-muted-foreground font-semibold mt-1.5">
                    <span>136.74% achieved · 136.74% projected</span>
                    <span>100% of target</span>
                  </div>
                </div>

                <!-- Spline Interactive SVG Chart -->
                <div class="relative w-full aspect-[5/2] mt-6 select-none bg-gray-50/50 dark:bg-muted/10 rounded-xl p-3 border border-gray-100 dark:border-border/50" @mousemove="handleChartHover" @mouseleave="hoveredPoint = null">
                  <svg class="w-full h-full overflow-visible" viewBox="0 0 1000 220" preserveAspectRatio="none">
                    <!-- Grid Lines -->
                    <line x1="0" y1="36" x2="1000" y2="36" stroke="rgba(0,0,0,0.05)" dark:stroke="rgba(255,255,255,0.03)" stroke-dasharray="3" />
                    <line x1="0" y1="72" x2="1000" y2="72" stroke="rgba(0,0,0,0.05)" dark:stroke="rgba(255,255,255,0.03)" stroke-dasharray="3" />
                    <line x1="0" y1="108" x2="1000" y2="108" stroke="rgba(0,0,0,0.05)" dark:stroke="rgba(255,255,255,0.03)" stroke-dasharray="3" />
                    <line x1="0" y1="144" x2="1000" y2="144" stroke="rgba(0,0,0,0.05)" dark:stroke="rgba(255,255,255,0.03)" stroke-dasharray="3" />
                    <line x1="0" y1="180" x2="1000" y2="180" stroke="rgba(0,0,0,0.05)" dark:stroke="rgba(255,255,255,0.03)" stroke-dasharray="3" />

                    <!-- Target Dashed Line -->
                    <line x1="50" y1="150" x2="950" y2="90" stroke="rgba(100, 116, 139, 0.4)" stroke-width="1.5" stroke-dasharray="5 5" />
                    
                    <!-- Glow Shading Gradient -->
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="rgba(16, 185, 129, 0.25)" />
                        <stop offset="100%" stop-color="rgba(16, 185, 129, 0)" />
                      </linearGradient>
                    </defs>
                    <path d="M 50 150 Q 150 150, 250 135 T 450 120 T 650 130 T 800 80 T 950 60 L 950 220 L 50 220 Z" fill="url(#chartGradient)" />

                    <!-- Core Bezier Spline -->
                    <path d="M 50 150 Q 150 150, 250 135 T 450 120 T 650 130 T 800 80 T 950 60" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" />

                    <!-- Vertical tracking line when hovered -->
                    <line v-if="hoveredPoint" :x1="hoveredPoint.x" y1="0" :x2="hoveredPoint.x" y2="220" stroke="rgba(16, 185, 129, 0.4)" stroke-width="1.5" stroke-dasharray="3 3" />
                    
                    <!-- Labeled Points -->
                    <circle v-for="(p, index) in chartPoints" :key="index" :cx="p.x" :cy="p.y" :r="hoveredPoint && hoveredPoint.idx === index ? 6 : 4" :fill="hoveredPoint && hoveredPoint.idx === index ? '#62D816' : '#10b981'" stroke="white" dark:stroke="#1f2937" stroke-width="1.5" />
                  </svg>

                  <!-- Tooltip -->
                  <div v-if="hoveredPoint" class="absolute bg-gray-900/95 dark:bg-card/95 border border-gray-800 dark:border-border text-white p-3 rounded-lg shadow-xl pointer-events-none text-xs space-y-1 z-30" :style="{ left: hoveredPoint.x - 60 + 'px', top: hoveredPoint.y - 85 + 'px' }">
                    <p class="font-bold text-[10px] text-gray-400 font-mono">{{ hoveredPoint.date }}</p>
                    <p class="font-semibold text-emerald-400">Revenue: RM {{ hoveredPoint.val.toLocaleString() }}</p>
                    <p class="text-gray-300">Target: RM {{ hoveredPoint.target.toLocaleString() }}</p>
                  </div>

                  <!-- X-Axis Labels -->
                  <div class="flex justify-between items-center text-[10px] font-bold text-gray-400 dark:text-muted-foreground px-8 mt-2">
                    <span>May</span>
                    <span>Jun</span>
                  </div>
                </div>
              </div>

              <!-- Footer Statistics -->
              <div class="grid grid-cols-3 border-t border-gray-150 dark:border-border pt-4 mt-6 text-center">
                <div>
                  <p class="text-[10px] text-gray-500 dark:text-muted-foreground uppercase font-semibold tracking-wider">Overall conversion</p>
                  <p class="text-base font-bold text-gray-900 dark:text-foreground mt-0.5">2.0%</p>
                </div>
                <div class="border-x border-gray-150 dark:border-border">
                  <p class="text-[10px] text-gray-500 dark:text-muted-foreground uppercase font-semibold tracking-wider">Avg deal velocity</p>
                  <p class="text-base font-bold text-gray-900 dark:text-foreground mt-0.5">-0.1 days</p>
                </div>
                <div>
                  <p class="text-[10px] text-gray-500 dark:text-muted-foreground uppercase font-semibold tracking-wider">Pipeline value</p>
                  <p class="text-base font-bold text-gray-900 dark:text-foreground mt-0.5">RM 999.3K</p>
                </div>
              </div>
            </div>

            <!-- AI Assistant Card -->
            <div class="xl:col-span-4 bg-white dark:bg-card border border-gray-200 dark:border-border p-6 rounded-2xl shadow-sm flex flex-col justify-between">
              <div>
                <!-- Header -->
                <div class="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-border">
                  <div>
                    <h3 class="text-base font-bold text-gray-900 dark:text-foreground flex items-center gap-1.5">
                      <Sparkles class="w-4 h-4 text-yellow-500 fill-current" />
                      AI Assistant
                    </h3>
                  </div>
                  <span class="text-[10px] bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border border-purple-100 dark:border-purple-900 font-bold px-2 py-0.5 rounded-full">
                    3 new insights
                  </span>
                </div>

                <!-- Insights Stack -->
                <div class="space-y-4 py-4 max-h-[300px] overflow-y-auto pr-1">
                  <div
                    v-for="(insight, idx) in insights"
                    :key="idx"
                    class="p-4 rounded-xl border transition-all duration-200"
                    :class="[
                      insight.type === 'alert' ? 'bg-red-50/50 dark:bg-red-950/10 border-red-100 dark:border-red-900/50' :
                      insight.type === 'success' ? 'bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900/50' :
                      'bg-gray-55 dark:bg-muted/40 border-gray-150 dark:border-border/50'
                    ]"
                  >
                    <div class="flex items-start gap-3">
                      <div :class="[
                        'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border',
                        insight.type === 'alert' ? 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900' :
                        insight.type === 'success' ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900' :
                        'bg-gray-100 dark:bg-muted text-gray-500 dark:text-muted-foreground border-gray-200 dark:border-border'
                      ]">
                        <AlertCircle v-if="insight.type === 'alert'" class="w-4 h-4" />
                        <CheckCircle v-else-if="insight.type === 'success'" class="w-4 h-4" />
                        <MessageSquare v-else class="w-4 h-4" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <h4 class="text-xs font-bold text-gray-800 dark:text-foreground" v-html="insight.title"></h4>
                        <p class="text-[11px] text-gray-500 dark:text-muted-foreground mt-1" v-html="insight.text"></p>
                        <button class="mt-2 text-[10px] font-bold text-emerald-600 dark:text-emerald-450 hover:underline inline-flex items-center gap-0.5 cursor-pointer">
                          {{ insight.actionText }} <ArrowRight class="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Question Box Console -->
              <form @submit.prevent="submitAIQuestion" class="relative group mt-4">
                <input
                  v-model="aiQuery"
                  type="text"
                  placeholder="Ask anything about your sales..."
                  class="w-full pl-4 pr-12 py-2.5 bg-gray-50 dark:bg-muted border border-gray-200 dark:border-border rounded-xl text-xs text-gray-900 dark:text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white dark:focus:bg-card focus:border-emerald-500 transition-all shadow-inner"
                />
                <button
                  type="submit"
                  class="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-lg transition-all cursor-pointer shadow-sm"
                >
                  <Send class="w-3 h-3" />
                </button>
              </form>
            </div>
          </div>

          <!-- Pipeline Funnel & Leads by Channel -->
          <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            <!-- Pipeline Funnel Card -->
            <div class="xl:col-span-6 bg-white dark:bg-card border border-gray-200 dark:border-border p-6 rounded-2xl shadow-sm flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-center pb-4">
                  <div>
                    <h3 class="text-base font-bold text-gray-900 dark:text-foreground">Pipeline funnel</h3>
                    <p class="text-xs text-gray-500 dark:text-muted-foreground mt-0.5">Stage progression with conversion rates</p>
                  </div>
                  <div class="flex p-0.5 bg-gray-100 dark:bg-muted rounded-lg border border-gray-200 dark:border-border">
                    <button
                      v-for="mode in ['Count', 'Value']"
                      :key="mode"
                      @click="funnelMode = mode"
                      :class="[
                        'px-3 py-1 text-[10px] font-bold rounded-md transition-colors cursor-pointer',
                        funnelMode === mode
                          ? 'bg-white dark:bg-card text-gray-950 dark:text-foreground shadow-sm'
                          : 'text-gray-500 hover:text-gray-900 dark:hover:text-foreground'
                      ]"
                    >
                      {{ mode }}
                    </button>
                  </div>
                </div>

                <!-- Funnel Progression Bars -->
                <div class="space-y-3 mt-4">
                  <div v-for="(stage, idx) in funnelStages" :key="idx" class="space-y-1">
                    <div class="flex justify-between items-center text-xs font-semibold">
                      <span class="text-gray-700 dark:text-gray-300 font-bold">{{ stage.name }}</span>
                      <span class="text-gray-900 dark:text-foreground font-mono">{{ funnelMode === 'Count' ? stage.count : 'RM ' + stage.val.toLocaleString() }}</span>
                    </div>
                    <div class="flex items-center gap-3">
                      <div class="flex-1 h-7 bg-gray-100 dark:bg-muted rounded-lg overflow-hidden relative border border-gray-150 dark:border-border/30">
                        <div
                          class="h-full rounded-lg transition-all duration-500 flex items-center px-3"
                          :class="stage.name === 'Won' ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white' : 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white'"
                          :style="{ width: stage.pct + '%' }"
                        >
                          <span class="text-[10px] font-bold drop-shadow-sm select-none">{{ funnelMode === 'Count' ? stage.count : stage.count }}</span>
                        </div>
                      </div>
                      <span class="w-12 text-right text-[11px] font-bold text-gray-500 dark:text-muted-foreground font-mono" :class="{ 'text-emerald-600 dark:text-emerald-400': idx > 0 && stage.name !== 'Won' && stage.name !== 'New Leads' }">
                        {{ stage.conversion }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer Statistics Summary -->
              <div class="border-t border-gray-150 dark:border-border pt-4 mt-6 text-xs text-gray-500 dark:text-muted-foreground font-semibold flex justify-between items-center">
                <span>Overall conversion <strong>2.0%</strong></span>
                <span>Avg deal velocity <strong>-0.1 days</strong></span>
                <span>Pipeline value <strong>RM 999.3K</strong></span>
              </div>
            </div>

            <!-- Leads by Channel Card -->
            <div class="xl:col-span-6 bg-white dark:bg-card border border-gray-200 dark:border-border p-6 rounded-2xl shadow-sm">
              <h3 class="text-base font-bold text-gray-900 dark:text-foreground">Leads by channel</h3>
              <p class="text-xs text-gray-500 dark:text-muted-foreground mt-0.5">Volume & conversion rate</p>

              <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center mt-6">
                <!-- Donut Chart -->
                <div class="md:col-span-5 flex justify-center relative select-none">
                  <svg width="180" height="180" viewBox="0 0 200 200" class="transform -rotate-90">
                    <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(100,116,139,0.06)" stroke-width="26" />
                    <!-- WhatsApp 55% = stroke-dasharray="241.9 197.9", offset=0 -->
                    <!-- Email 45% = stroke-dasharray="197.9 241.9", offset="-241.9" -->
                    <circle cx="100" cy="100" r="70" fill="none" stroke="#f97316" stroke-width="26" stroke-dasharray="241.9 197.9" stroke-dashoffset="0" class="transition-all duration-500" />
                    <circle cx="100" cy="100" r="70" fill="none" stroke="#3b82f6" stroke-width="26" stroke-dasharray="197.9 241.9" stroke-dashoffset="-241.9" class="transition-all duration-500" />
                  </svg>
                  <!-- Absolute center text -->
                  <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span class="text-3xl font-extrabold text-gray-900 dark:text-foreground font-sans">368</span>
                    <span class="text-[10px] text-gray-400 dark:text-muted-foreground uppercase font-bold tracking-wider">Total Leads</span>
                  </div>
                </div>

                <!-- Legend & conversion volume table -->
                <div class="md:col-span-7 space-y-2">
                  <div v-for="(ch, idx) in leadsByChannel" :key="idx" class="flex justify-between items-center text-xs pb-1.5 border-b border-gray-100 dark:border-border/50">
                    <div class="flex items-center gap-2">
                      <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" :style="{ backgroundColor: ch.color }"></span>
                      <span class="font-bold text-gray-700 dark:text-gray-300">{{ ch.channel }}</span>
                    </div>
                    <div class="flex items-center gap-4 text-gray-900 dark:text-foreground font-mono">
                      <span>{{ ch.count }}</span>
                      <span class="text-gray-450 dark:text-muted-foreground font-bold w-10 text-right">{{ ch.pct }}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ═════════════════════════════════════════════════════════
             TAB 2: PIPELINE
             ═════════════════════════════════════════════════════════ -->
        <div v-if="activeTab === 'pipeline'" class="space-y-6">
          <!-- Page title -->
          <div>
            <h1 class="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-foreground">Pipeline & Sales</h1>
            <p class="text-sm text-gray-500 dark:text-muted-foreground mt-0.5">Pipeline activity for 25 May — 23 Jun 2026.</p>
          </div>

          <!-- KPI Cards Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <!-- Conversion Rate (Green) -->
            <div class="bg-gradient-to-br from-emerald-600 to-emerald-500 dark:from-emerald-700 dark:to-emerald-600 text-white p-5 rounded-2xl shadow-sm relative overflow-hidden flex flex-col justify-between h-[150px]">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold opacity-90">Conversion Rate</span>
              </div>
              <div>
                <h3 class="text-3xl font-extrabold tracking-tight">2%</h3>
                <p class="text-xs opacity-90 mt-1">↘ 2.3 pts vs last period</p>
              </div>
              <div class="h-6 w-full opacity-60">
                <svg class="w-full h-full" viewBox="0 0 200 30" preserveAspectRatio="none">
                  <path d="M 0 20 C 30 15, 60 25, 90 10 C 120 18, 150 5, 180 15 C 190 10, 195 25, 200 12" fill="none" stroke="white" stroke-width="1.5"/>
                </svg>
              </div>
            </div>

            <!-- Pipeline Value -->
            <div class="bg-white dark:bg-card border border-gray-200 dark:border-border p-5 rounded-2xl shadow-sm relative overflow-hidden flex flex-col justify-between h-[150px] group hover:shadow-md transition-shadow">
              <div class="flex items-start justify-between">
                <div>
                  <span class="text-xs text-gray-500 dark:text-muted-foreground font-semibold">Pipeline Value</span>
                  <h3 class="text-2xl font-bold text-gray-900 dark:text-foreground mt-1">RM200.3K</h3>
                </div>
              </div>
              <p class="text-xs text-gray-400 dark:text-muted-foreground font-bold mt-1">45 open deals</p>
              <div class="h-6 w-full mt-2">
                <svg class="w-full h-full" viewBox="0 0 200 30" preserveAspectRatio="none">
                  <path d="M 0 28 C 30 25, 60 12, 90 22 C 120 10, 150 18, 180 8 C 190 5, 195 22, 200 15" fill="none" stroke="#10b981" stroke-width="2"/>
                </svg>
              </div>
            </div>

            <!-- Deal Velocity -->
            <div class="bg-white dark:bg-card border border-gray-200 dark:border-border p-5 rounded-2xl shadow-sm relative overflow-hidden flex flex-col justify-between h-[150px] group hover:shadow-md transition-shadow">
              <div class="flex items-start justify-between">
                <div>
                  <span class="text-xs text-gray-500 dark:text-muted-foreground font-semibold">Deal Velocity</span>
                  <h3 class="text-2xl font-bold text-gray-900 dark:text-foreground mt-1">-0.1 days</h3>
                </div>
                <span class="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-150 dark:border-emerald-900/50 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  ↗ 24.7d faster
                </span>
              </div>
              <!-- Red Sparkline SVG -->
              <div class="h-6 w-full mt-2">
                <svg class="w-full h-full" viewBox="0 0 200 30" preserveAspectRatio="none">
                  <path d="M 0 5 C 30 10, 60 28, 90 20 C 120 32, 150 15, 180 25 C 190 28, 195 20, 200 24" fill="none" stroke="#ef4444" stroke-width="2"/>
                </svg>
              </div>
            </div>

            <!-- Win / loss -->
            <div class="bg-white dark:bg-card border border-gray-200 dark:border-border p-5 rounded-2xl shadow-sm relative overflow-hidden flex flex-col justify-between h-[150px] group hover:shadow-md transition-shadow">
              <div class="flex items-start justify-between">
                <div>
                  <span class="text-xs text-gray-500 dark:text-muted-foreground font-semibold">Win / loss</span>
                  <h3 class="text-2xl font-bold text-gray-900 dark:text-foreground mt-1">1 / 2</h3>
                </div>
                <span class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">0.50:1 ratio</span>
              </div>
              <div class="h-6 w-full mt-2">
                <svg class="w-full h-full" viewBox="0 0 200 30" preserveAspectRatio="none">
                  <path d="M 0 28 C 30 25, 60 28, 90 12 C 120 18, 150 8, 180 12 C 190 10, 195 22, 200 15" fill="none" stroke="#10b981" stroke-width="2"/>
                </svg>
              </div>
            </div>

            <!-- SLA Compliance -->
            <div class="bg-white dark:bg-card border border-gray-200 dark:border-border p-5 rounded-2xl shadow-sm relative overflow-hidden flex flex-col justify-between h-[150px] group hover:shadow-md transition-shadow">
              <div class="flex items-start justify-between">
                <div>
                  <span class="text-xs text-gray-500 dark:text-muted-foreground font-semibold">SLA Compliance</span>
                  <h3 class="text-2xl font-bold text-gray-900 dark:text-foreground mt-1">0%</h3>
                </div>
              </div>
              <p class="text-xs text-gray-400 dark:text-muted-foreground font-bold mt-1">Response &lt; 15 min</p>
              <div class="h-6 w-full mt-2">
                <div class="w-full h-1 bg-gray-150 dark:bg-muted rounded-full overflow-hidden">
                  <div class="h-full bg-red-500" style="width: 0%;"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Deal Velocity by Stage & Lost Deal Reasons -->
          <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            <!-- Deal Velocity by Stage Card -->
            <div class="xl:col-span-6 bg-white dark:bg-card border border-gray-200 dark:border-border p-6 rounded-2xl shadow-sm flex flex-col justify-between">
              <div>
                <h3 class="text-base font-bold text-gray-900 dark:text-foreground flex items-center gap-1.5">
                  Deal velocity by stage
                  <Info class="w-3.5 h-3.5 text-gray-400 cursor-help" />
                </h3>
                <p class="text-xs text-gray-500 dark:text-muted-foreground mt-0.5">Average time spent in each stage for the selected range</p>

                <div class="space-y-4 mt-6">
                  <div v-for="(st, idx) in dealVelocityStages" :key="idx" class="space-y-1">
                    <div class="flex justify-between items-center text-xs font-semibold">
                      <span class="text-gray-700 dark:text-gray-300 font-bold">{{ st.name }}</span>
                      <span class="text-gray-900 dark:text-foreground font-mono">{{ st.days }}d</span>
                    </div>
                    <div class="h-5 bg-gray-150 dark:bg-muted rounded-lg overflow-hidden relative border border-gray-200 dark:border-border/30">
                      <div
                        class="h-full rounded-lg transition-all duration-500"
                        :class="st.name === 'Proposal/ Quotation' ? 'bg-gradient-to-r from-blue-600 to-blue-500' : 'bg-gradient-to-r from-emerald-600 to-emerald-500'"
                        :style="{ width: (st.days / 10) * 100 + '%' }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Warning container -->
              <div class="mt-6 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-xl flex items-start gap-2.5">
                <AlertCircle class="w-4 h-4 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                <div class="text-[11px] leading-relaxed text-amber-800 dark:text-amber-400">
                  <strong>Bottleneck detected</strong> - Proposal / Quotation stage takes 23% of total cycle time. Consider automated follow-up sequences.
                </div>
              </div>
            </div>

            <!-- Lost Deal Reasons Card -->
            <div class="xl:col-span-6 bg-white dark:bg-card border border-gray-200 dark:border-border p-6 rounded-2xl shadow-sm flex flex-col justify-between">
              <div>
                <!-- Header -->
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-gray-100 dark:border-border/60">
                  <div>
                    <h3 class="text-base font-bold text-gray-900 dark:text-foreground flex items-center gap-1.5">
                      Lost deal reasons
                      <Info class="w-3.5 h-3.5 text-gray-400 cursor-help" />
                    </h3>
                    <p class="text-xs text-gray-500 dark:text-muted-foreground mt-0.5">13 lost deals this period - root-cause breakdown</p>
                  </div>
                  <div class="relative w-full sm:w-44">
                    <Search class="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search..."
                      class="w-full pl-8 pr-3 py-1 bg-gray-50 dark:bg-muted border border-gray-250 dark:border-border rounded-lg text-[10px] focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center mt-6">
                  <!-- Donut Chart -->
                  <div class="md:col-span-5 flex justify-center relative select-none">
                    <svg width="150" height="150" viewBox="0 0 200 200" class="transform -rotate-90">
                      <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(100,116,139,0.06)" stroke-width="24" />
                      <!-- Segment 1: Competitor 30.8% = 135.5, offset=0 (Blue) -->
                      <circle cx="100" cy="100" r="70" fill="none" stroke="#3b82f6" stroke-width="24" stroke-dasharray="135.5 304.3" stroke-dashoffset="0" />
                      <!-- Segment 2: Other 23.1% = 101.6, offset=-135.5 (Orange) -->
                      <circle cx="100" cy="100" r="70" fill="none" stroke="#f97316" stroke-width="24" stroke-dasharray="101.6 338.2" stroke-dashoffset="-135.5" />
                      <!-- Segment 3: Unreachable 23.1% = 101.6, offset=-237.1 (Red) -->
                      <circle cx="100" cy="100" r="70" fill="none" stroke="#ef4444" stroke-width="24" stroke-dasharray="101.6 338.2" stroke-dashoffset="-237.1" />
                      <!-- Segment 4: No Need 15.4% = 67.7, offset=-338.7 (Green) -->
                      <circle cx="100" cy="100" r="70" fill="none" stroke="#10b981" stroke-width="24" stroke-dasharray="67.7 372.1" stroke-dashoffset="-338.7" />
                    </svg>
                    <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span class="text-2xl font-extrabold text-gray-900 dark:text-foreground">13</span>
                      <span class="text-[9px] text-gray-400 dark:text-muted-foreground uppercase font-bold tracking-wider">Lost Deals</span>
                    </div>
                  </div>

                  <!-- Table breakdown -->
                  <div class="md:col-span-7">
                    <table class="w-full text-xs">
                      <thead>
                        <tr class="text-[10px] text-gray-400 uppercase tracking-wider text-left border-b border-gray-150 dark:border-border pb-1">
                          <th class="font-bold pb-2">#</th>
                          <th class="font-bold pb-2">Reason</th>
                          <th class="font-bold pb-2 text-right">Count</th>
                          <th class="font-bold pb-2 text-right">Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(reason, idx) in lostReasons" :key="idx" class="border-b border-gray-100 dark:border-border/50 hover:bg-gray-50 dark:hover:bg-muted/30 transition-colors">
                          <td class="py-2.5 font-bold text-gray-450">{{ idx + 1 }}</td>
                          <td class="py-2.5 font-bold text-gray-800 dark:text-gray-300">{{ reason.title }}</td>
                          <td class="py-2.5 font-bold text-right font-mono text-gray-750 dark:text-foreground">{{ reason.count }}</td>
                          <td class="py-2.5 font-bold text-right font-mono text-gray-900 dark:text-foreground">RM {{ reason.val.toLocaleString() }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Agent Performance Leaderboard -->
          <div class="bg-white dark:bg-card border border-gray-200 dark:border-border rounded-2xl shadow-sm overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-255 dark:border-border bg-gray-55 dark:bg-muted/40">
              <h3 class="text-base font-bold text-gray-900 dark:text-foreground">Agent Performance</h3>
              <p class="text-xs text-gray-500 dark:text-muted-foreground mt-0.5">Leaderboard for selected range - ranked by revenue won</p>
            </div>
            
            <div class="overflow-x-auto">
              <table class="w-full text-xs text-left whitespace-nowrap">
                <thead>
                  <tr class="text-[10px] text-gray-400 uppercase tracking-wider border-b border-gray-255 dark:border-border bg-gray-50/50 dark:bg-muted/20">
                    <th class="px-6 py-3 font-bold">#</th>
                    <th class="px-6 py-3 font-bold">Agent</th>
                    <th class="px-6 py-3 font-bold text-right">Revenue Won</th>
                    <th class="px-6 py-3 font-bold text-right">Deal Closed</th>
                    <th class="px-6 py-3 font-bold text-center">Win Rate</th>
                    <th class="px-6 py-3 font-bold text-right">AVG Response</th>
                    <th class="px-6 py-3 font-bold text-right">AVG Deal Value</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-150 dark:divide-border/60">
                  <tr v-for="(agent, idx) in agents" :key="idx" class="hover:bg-gray-50 dark:hover:bg-muted/30 transition-colors">
                    <td class="px-6 py-4 font-bold text-gray-450 font-sans" :class="{ 'text-emerald-600 dark:text-emerald-500 font-extrabold': idx === 0 }">{{ idx + 1 }}</td>
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <img :src="agent.avatar" class="w-8 h-8 rounded-full border border-gray-200 dark:border-border/60 object-cover" :alt="agent.name" />
                        <div>
                          <p class="font-bold text-gray-900 dark:text-foreground">{{ agent.name }}</p>
                          <p class="text-[10px] text-gray-400 dark:text-muted-foreground mt-0.5">{{ agent.won }} won · {{ agent.open }} open</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 font-bold text-right font-mono text-gray-800 dark:text-foreground">RM {{ agent.revenueWon.toLocaleString() }}</td>
                    <td class="px-6 py-4 font-bold text-right font-mono text-gray-800 dark:text-foreground">{{ agent.dealsClosed }}</td>
                    <td class="px-6 py-4 text-center">
                      <span :class="[
                        'px-2 py-0.5 rounded-full text-[10px] font-bold border',
                        agent.winRate === 100 
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900'
                          : 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-100 dark:border-red-900'
                      ]">
                        {{ agent.winRate }}%
                      </span>
                    </td>
                    <td class="px-6 py-4 font-bold text-right font-mono text-gray-800 dark:text-foreground">{{ agent.avgResponse }} min</td>
                    <td class="px-6 py-4 font-bold text-right font-mono text-gray-800 dark:text-foreground">RM {{ agent.avgDealValue.toLocaleString() }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ═════════════════════════════════════════════════════════
             TAB 3: MARKETING
             ═════════════════════════════════════════════════════════ -->
        <div v-if="activeTab === 'marketing'" class="space-y-6">
          <!-- Page title -->
          <div>
            <h1 class="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-foreground">Marketing & Attribution</h1>
            <p class="text-sm text-gray-500 dark:text-muted-foreground mt-0.5">Lead and attribution performance for 25 May — 23 Jun 2026.</p>
          </div>

          <!-- KPI Cards Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <!-- Sessions -->
            <div class="bg-white dark:bg-card border border-gray-200 dark:border-border p-5 rounded-2xl shadow-sm relative overflow-hidden flex flex-col justify-between h-[130px] group hover:shadow-md transition-shadow">
              <div class="flex items-start justify-between">
                <div>
                  <span class="text-xs text-gray-500 dark:text-muted-foreground font-semibold">Sessions</span>
                  <h3 class="text-2xl font-bold text-gray-900 dark:text-foreground mt-1">24,812</h3>
                </div>
                <span class="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-150 dark:border-emerald-900/50 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  ↗ 9.4%
                </span>
              </div>
            </div>

            <!-- Users -->
            <div class="bg-white dark:bg-card border border-gray-200 dark:border-border p-5 rounded-2xl shadow-sm relative overflow-hidden flex flex-col justify-between h-[130px] group hover:shadow-md transition-shadow">
              <div class="flex items-start justify-between">
                <div>
                  <span class="text-xs text-gray-500 dark:text-muted-foreground font-semibold">Users</span>
                  <h3 class="text-2xl font-bold text-gray-900 dark:text-foreground mt-1">18,204</h3>
                </div>
                <span class="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-150 dark:border-emerald-900/50 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  ↗ 7.1%
                </span>
              </div>
            </div>

            <!-- Engagement Rate -->
            <div class="bg-white dark:bg-card border border-gray-200 dark:border-border p-5 rounded-2xl shadow-sm relative overflow-hidden flex flex-col justify-between h-[130px] group hover:shadow-md transition-shadow">
              <div class="flex items-start justify-between">
                <div>
                  <span class="text-xs text-gray-500 dark:text-muted-foreground font-semibold">Engagement rate</span>
                  <h3 class="text-2xl font-bold text-gray-900 dark:text-foreground mt-1">62.4</h3>
                </div>
                <span class="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-150 dark:border-emerald-900/50 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  ↗ 3.2 pts
                </span>
              </div>
            </div>

            <!-- Leads Generated -->
            <div class="bg-white dark:bg-card border border-gray-200 dark:border-border p-5 rounded-2xl shadow-sm relative overflow-hidden flex flex-col justify-between h-[130px] group hover:shadow-md transition-shadow">
              <div class="flex items-start justify-between">
                <div>
                  <span class="text-xs text-gray-500 dark:text-muted-foreground font-semibold">Leads generated</span>
                  <h3 class="text-2xl font-bold text-gray-900 dark:text-foreground mt-1">847</h3>
                </div>
                <span class="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-150 dark:border-emerald-900/50 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  ↗ 8.2%
                </span>
              </div>
            </div>

            <!-- Lead-to-customer -->
            <div class="bg-white dark:bg-card border border-gray-200 dark:border-border p-5 rounded-2xl shadow-sm relative overflow-hidden flex flex-col justify-between h-[130px] group hover:shadow-md transition-shadow">
              <div class="flex items-start justify-between">
                <div>
                  <span class="text-xs text-gray-500 dark:text-muted-foreground font-semibold">Lead-to-customer</span>
                  <h3 class="text-2xl font-bold text-gray-900 dark:text-foreground mt-1">18.3</h3>
                </div>
                <span class="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-150 dark:border-emerald-900/50 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  ↗ 2.1 pts
                </span>
              </div>
            </div>
          </div>

          <!-- Revenue Attribution & Channel Performance -->
          <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            <!-- Revenue Attribution by Channel -->
            <div class="xl:col-span-6 bg-white dark:bg-card border border-gray-200 dark:border-border p-6 rounded-2xl shadow-sm flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="text-base font-bold text-gray-900 dark:text-foreground flex items-center gap-1.5">
                      Revenue attribution by channel
                      <Info class="w-3.5 h-3.5 text-gray-400 cursor-help" />
                    </h3>
                    <p class="text-xs text-gray-500 dark:text-muted-foreground mt-0.5">Last-touch model · RM 284,500 attributed</p>
                  </div>
                  <div class="flex p-0.5 bg-gray-100 dark:bg-muted rounded-lg border border-gray-250 dark:border-border">
                    <button
                      v-for="model in ['First-touch', 'Last-touch', 'Linear']"
                      :key="model"
                      @click="attributionModel = model"
                      :class="[
                        'px-2.5 py-1 text-[10px] font-bold rounded-md transition-colors cursor-pointer',
                        attributionModel === model
                          ? 'bg-white dark:bg-card text-gray-950 dark:text-foreground shadow-sm'
                          : 'text-gray-500 hover:text-gray-900 dark:hover:text-foreground'
                      ]"
                    >
                      {{ model }}
                    </button>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center mt-6">
                  <!-- Donut SVG -->
                  <div class="md:col-span-5 flex justify-center relative select-none">
                    <svg width="170" height="170" viewBox="0 0 200 200" class="transform -rotate-90">
                      <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(100,116,139,0.06)" stroke-width="26" />
                      <!-- Circumference = 439.8 -->
                      <!-- WhatsApp: 50% = 219.9, offset=0 (Orange) -->
                      <circle cx="100" cy="100" r="70" fill="none" stroke="#f97316" stroke-width="26" stroke-dasharray="219.9 219.9" stroke-dashoffset="0" />
                      <!-- Organic Search: 20% = 88.0, offset=-219.9 (Blue) -->
                      <circle cx="100" cy="100" r="70" fill="none" stroke="#3b82f6" stroke-width="26" stroke-dasharray="88.0 351.8" stroke-dashoffset="-219.9" />
                      <!-- Facebook: 15% = 66.0, offset=-307.9 (Green) -->
                      <circle cx="100" cy="100" r="70" fill="none" stroke="#10b981" stroke-width="26" stroke-dasharray="66.0 373.8" stroke-dashoffset="-307.9" />
                      <!-- Instagram: 6% = 26.4, offset=-373.9 (Red) -->
                      <circle cx="100" cy="100" r="70" fill="none" stroke="#ef4444" stroke-width="26" stroke-dasharray="26.4 413.4" stroke-dashoffset="-373.9" />
                      <!-- Email: 9% = 39.6, offset=-400.3 (Purple) -->
                      <circle cx="100" cy="100" r="70" fill="none" stroke="#8b5cf6" stroke-width="26" stroke-dasharray="39.6 400.2" stroke-dashoffset="-400.3" />
                    </svg>
                    <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span class="text-xl font-extrabold text-gray-900 dark:text-foreground">RM 284k</span>
                      <span class="text-[9px] text-gray-400 dark:text-muted-foreground uppercase font-bold tracking-wider">Attributed</span>
                    </div>
                  </div>

                  <!-- Legend -->
                  <div class="md:col-span-7 space-y-2">
                    <div v-for="(item, idx) in attributionChannels" :key="idx" class="flex justify-between items-center text-xs pb-1.5 border-b border-gray-100 dark:border-border/50">
                      <div class="flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" :style="{ backgroundColor: item.color }"></span>
                        <span class="font-bold text-gray-700 dark:text-gray-300">{{ item.name }}</span>
                      </div>
                      <div class="flex items-center gap-4 text-gray-900 dark:text-foreground font-mono">
                        <span>RM {{ item.val }}</span>
                        <span class="text-gray-450 dark:text-muted-foreground font-bold w-10 text-right">{{ item.pct }}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Channel Performance Card (Bar Chart) -->
            <div class="xl:col-span-6 bg-white dark:bg-card border border-gray-200 dark:border-border p-6 rounded-2xl shadow-sm flex flex-col justify-between">
              <div>
                <h3 class="text-base font-bold text-gray-900 dark:text-foreground flex items-center gap-1.5">
                  Channel performance
                  <Info class="w-3.5 h-3.5 text-gray-400 cursor-help" />
                </h3>
                <p class="text-xs text-gray-500 dark:text-muted-foreground mt-0.5">Leads generated vs converted</p>

                <!-- Grouped Bar Chart SVG -->
                <div class="relative w-full aspect-[5/3] mt-6 select-none bg-gray-50/50 dark:bg-muted/10 rounded-xl p-3 border border-gray-100 dark:border-border/50">
                  <svg class="w-full h-full overflow-visible" viewBox="0 0 500 240" preserveAspectRatio="none">
                    <!-- Grid Lines -->
                    <line x1="40" y1="40" x2="500" y2="40" stroke="rgba(0,0,0,0.05)" dark:stroke="rgba(255,255,255,0.03)" stroke-dasharray="3" />
                    <line x1="40" y1="90" x2="500" y2="90" stroke="rgba(0,0,0,0.05)" dark:stroke="rgba(255,255,255,0.03)" stroke-dasharray="3" />
                    <line x1="40" y1="140" x2="500" y2="140" stroke="rgba(0,0,0,0.05)" dark:stroke="rgba(255,255,255,0.03)" stroke-dasharray="3" />
                    <line x1="40" y1="190" x2="500" y2="190" stroke="rgba(0,0,0,0.05)" dark:stroke="rgba(255,255,255,0.03)" stroke-dasharray="3" />

                    <!-- Y-Axis Labels -->
                    <text x="30" y="44" text-anchor="end" class="text-[9px] fill-gray-400 font-mono font-bold">300</text>
                    <text x="30" y="94" text-anchor="end" class="text-[9px] fill-gray-400 font-mono font-bold">200</text>
                    <text x="30" y="144" text-anchor="end" class="text-[9px] fill-gray-400 font-mono font-bold">100</text>
                    <text x="30" y="194" text-anchor="end" class="text-[9px] fill-gray-400 font-mono font-bold">0</text>

                    <!-- Grouped columns (WhatsApp, Facebook, Google, Instagram, Email, Direct) -->
                    <!-- Center locations: 75, 150, 225, 300, 375, 450 -->
                    <!-- Green Bar (generated), Blue Bar (converted) -->
                    <!-- WhatsApp (generated: 380 -> h=190, converted: 70 -> h=35) -->
                    <rect x="65" y="50" width="10" height="140" fill="#10b981" rx="2" />
                    <rect x="77" y="155" width="10" height="35" fill="#3b82f6" rx="2" />

                    <!-- Facebook (generated: 180 -> h=90, converted: 30 -> h=15) -->
                    <rect x="140" y="100" width="10" height="90" fill="#10b981" rx="2" />
                    <rect x="152" y="175" width="10" height="15" fill="#3b82f6" rx="2" />

                    <!-- Google (generated: 160 -> h=80, converted: 35 -> h=17.5) -->
                    <rect x="215" y="110" width="10" height="80" fill="#10b981" rx="2" />
                    <rect x="227" y="172.5" width="10" height="17.5" fill="#3b82f6" rx="2" />

                    <!-- Instagram (generated: 70 -> h=35, converted: 15 -> h=7.5) -->
                    <rect x="290" y="155" width="10" height="35" fill="#10b981" rx="2" />
                    <rect x="302" y="182.5" width="10" height="7.5" fill="#3b82f6" rx="2" />

                    <!-- Email (generated: 60 -> h=30, converted: 12 -> h=6) -->
                    <rect x="365" y="160" width="10" height="30" fill="#10b981" rx="2" />
                    <rect x="377" y="184" width="10" height="6" fill="#3b82f6" rx="2" />

                    <!-- Direct (generated: 75 -> h=37.5, converted: 10 -> h=5) -->
                    <rect x="440" y="152.5" width="10" height="37.5" fill="#10b981" rx="2" />
                    <rect x="452" y="185" width="10" height="5" fill="#3b82f6" rx="2" />

                    <!-- X-Axis line -->
                    <line x1="40" y1="190" x2="500" y2="190" stroke="rgba(100,116,139,0.2)" stroke-width="1.5" />

                    <!-- X-Axis Labels -->
                    <text x="76" y="210" text-anchor="middle" class="text-[9px] fill-gray-400 font-bold">WhatsApp</text>
                    <text x="151" y="210" text-anchor="middle" class="text-[9px] fill-gray-400 font-bold">Facebook</text>
                    <text x="226" y="210" text-anchor="middle" class="text-[9px] fill-gray-400 font-bold">Google</text>
                    <text x="301" y="210" text-anchor="middle" class="text-[9px] fill-gray-400 font-bold">Instagram</text>
                    <text x="376" y="210" text-anchor="middle" class="text-[9px] fill-gray-400 font-bold">Email</text>
                    <text x="451" y="210" text-anchor="middle" class="text-[9px] fill-gray-400 font-bold">Direct</text>
                  </svg>
                </div>
                
                <!-- Chart Legend indicators -->
                <div class="flex items-center justify-center gap-4 text-[10px] font-bold text-gray-500 mt-2">
                  <div class="flex items-center gap-1.5">
                    <span class="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>
                    <span>Leads Generated</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <span class="w-2.5 h-2.5 bg-blue-500 rounded-full"></span>
                    <span>Leads Converted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sessions & Key Events & Lead Quality -->
          <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            <!-- Sessions & Key Events Card -->
            <div class="xl:col-span-6 bg-white dark:bg-card border border-gray-200 dark:border-border p-6 rounded-2xl shadow-sm flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-center pb-4">
                  <div>
                    <h3 class="text-base font-bold text-gray-900 dark:text-foreground flex items-center gap-1.5">
                      "Sessions & key events"
                      <Info class="w-3.5 h-3.5 text-gray-400 cursor-help" />
                    </h3>
                    <p class="text-xs text-gray-500 dark:text-muted-foreground mt-0.5">GA4 events — form submits, WhatsApp clicks, demo requests</p>
                  </div>
                  <div class="flex p-0.5 bg-gray-100 dark:bg-muted rounded-lg border border-gray-250 dark:border-border">
                    <button
                      v-for="v in ['Daily', 'Weekly']"
                      :key="v"
                      @click="sessionsView = v"
                      :class="[
                        'px-3 py-1 text-[10px] font-bold rounded-md transition-colors cursor-pointer',
                        sessionsView === v
                          ? 'bg-white dark:bg-card text-gray-950 dark:text-foreground shadow-sm'
                          : 'text-gray-500 hover:text-gray-900 dark:hover:text-foreground'
                      ]"
                    >
                      {{ v }}
                    </button>
                  </div>
                </div>

                <!-- Sessions Line Chart SVG -->
                <div class="relative w-full aspect-[5/3] mt-4 select-none bg-gray-50/50 dark:bg-muted/10 rounded-xl p-3 border border-gray-100 dark:border-border/50">
                  <svg class="w-full h-full overflow-visible" viewBox="0 0 500 200" preserveAspectRatio="none">
                    <!-- Y grid lines -->
                    <line x1="40" y1="30" x2="480" y2="30" stroke="rgba(0,0,0,0.05)" dark:stroke="rgba(255,255,255,0.03)" stroke-dasharray="3" />
                    <line x1="40" y1="70" x2="480" y2="70" stroke="rgba(0,0,0,0.05)" dark:stroke="rgba(255,255,255,0.03)" stroke-dasharray="3" />
                    <line x1="40" y1="110" x2="480" y2="110" stroke="rgba(0,0,0,0.05)" dark:stroke="rgba(255,255,255,0.03)" stroke-dasharray="3" />
                    <line x1="40" y1="150" x2="480" y2="150" stroke="rgba(0,0,0,0.05)" dark:stroke="rgba(255,255,255,0.03)" stroke-dasharray="3" />

                    <!-- Y-Axis labels (Left: Sessions 2.8k to 4k) -->
                    <text x="30" y="34" text-anchor="end" class="text-[8px] fill-gray-400 font-mono font-bold">4,000</text>
                    <text x="30" y="74" text-anchor="end" class="text-[8px] fill-gray-400 font-mono font-bold">3,600</text>
                    <text x="30" y="114" text-anchor="end" class="text-[8px] fill-gray-400 font-mono font-bold">3,200</text>
                    <text x="30" y="154" text-anchor="end" class="text-[8px] fill-gray-400 font-mono font-bold">2,800</text>

                    <!-- Right Axis labels (Events 140 to 240) -->
                    <text x="490" y="34" text-anchor="start" class="text-[8px] fill-emerald-500 font-mono font-bold">240</text>
                    <text x="490" y="74" text-anchor="start" class="text-[8px] fill-emerald-500 font-mono font-bold">210</text>
                    <text x="490" y="114" text-anchor="start" class="text-[8px] fill-emerald-500 font-mono font-bold">180</text>
                    <text x="490" y="154" text-anchor="start" class="text-[8px] fill-emerald-500 font-mono font-bold">140</text>

                    <!-- Green Trend line (Events) -->
                    <path d="M 40 130 C 80 135, 120 100, 160 110 C 200 95, 240 105, 280 85 C 320 90, 360 70, 400 80 C 440 60, 460 65, 480 40" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round"/>

                    <!-- Blue Trend line (Sessions) -->
                    <path d="M 40 150 C 80 148, 120 155, 160 140 C 200 142, 240 145, 280 132 C 320 135, 360 128, 400 130 C 440 122, 460 124, 480 115" fill="none" stroke="#3b82f6" stroke-width="2.5" stroke-linecap="round"/>

                    <!-- X axis -->
                    <line x1="40" y1="170" x2="480" y2="170" stroke="rgba(100,116,139,0.2)" stroke-width="1.5" />

                    <!-- X-Axis Labels -->
                    <text x="40" y="185" text-anchor="middle" class="text-[8px] fill-gray-400 font-bold">Jul 1</text>
                    <text x="113" y="185" text-anchor="middle" class="text-[8px] fill-gray-400 font-bold">Jul 7</text>
                    <text x="186" y="185" text-anchor="middle" class="text-[8px] fill-gray-400 font-bold">Jul 13</text>
                    <text x="259" y="185" text-anchor="middle" class="text-[8px] fill-gray-400 font-bold">Jul 19</text>
                    <text x="332" y="185" text-anchor="middle" class="text-[8px] fill-gray-400 font-bold">Jul 25</text>
                    <text x="480" y="185" text-anchor="middle" class="text-[8px] fill-gray-400 font-bold">Jul 29</text>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Lead Quality by Source Card -->
            <div class="xl:col-span-6 bg-white dark:bg-card border border-gray-200 dark:border-border p-6 rounded-2xl shadow-sm flex flex-col justify-between">
              <div>
                <h3 class="text-base font-bold text-gray-900 dark:text-foreground flex items-center gap-1.5">
                  Lead quality by source
                  <Info class="w-3.5 h-3.5 text-gray-400 cursor-help" />
                </h3>
                <p class="text-xs text-gray-500 dark:text-muted-foreground mt-0.5">Qualified vs unqualified split</p>

                <!-- Stacked Horizontal Bars -->
                <div class="space-y-4 mt-6">
                  <div v-for="(src, idx) in leadQualitySources" :key="idx" class="space-y-1">
                    <div class="flex justify-between items-center text-xs font-semibold">
                      <span class="text-gray-700 dark:text-gray-300 font-bold">{{ src.name }}</span>
                      <span class="text-gray-450 text-[10px] font-mono">Max 400</span>
                    </div>
                    <div class="h-6 w-full bg-gray-155 dark:bg-muted rounded-lg overflow-hidden flex border border-gray-200 dark:border-border/30">
                      <!-- Qualified (Green) -->
                      <div class="h-full bg-emerald-500 transition-all duration-500" :style="{ width: src.qualPct + '%' }"></div>
                      <!-- Unqualified (Blue or Gray) -->
                      <div class="h-full transition-all duration-500" :class="src.name === 'Instagram' ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-700'" :style="{ width: src.unqualPct + '%' }"></div>
                    </div>
                  </div>
                </div>

                <!-- Legend indicators -->
                <div class="flex items-center justify-center gap-4 text-[10px] font-bold text-gray-500 mt-4">
                  <div class="flex items-center gap-1.5">
                    <span class="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>
                    <span>Qualified</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <span class="w-2.5 h-2.5 bg-gray-300 dark:bg-gray-700 rounded-full"></span>
                    <span>Unqualified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Top Acquisition Traffic Origins Table -->
          <div class="bg-white dark:bg-card border border-gray-200 dark:border-border rounded-2xl shadow-sm overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-255 dark:border-border bg-gray-55 dark:bg-muted/40">
              <h3 class="text-base font-bold text-gray-900 dark:text-foreground">Source / medium</h3>
              <p class="text-xs text-gray-500 dark:text-muted-foreground mt-0.5">GA4 acquisition — top traffic origins</p>
            </div>
            
            <div class="overflow-x-auto">
              <table class="w-full text-xs text-left whitespace-nowrap">
                <thead>
                  <tr class="text-[10px] text-gray-400 uppercase tracking-wider border-b border-gray-255 dark:border-border bg-gray-50/50 dark:bg-muted/20">
                    <th class="px-6 py-3 font-bold">#</th>
                    <th class="px-6 py-3 font-bold">Source / Medium</th>
                    <th class="px-6 py-3 font-bold text-right">Users</th>
                    <th class="px-6 py-3 font-bold text-right">Sessions</th>
                    <th class="px-6 py-3 font-bold text-right">Engaged Sessions</th>
                    <th class="px-6 py-3 font-bold text-right">Avg Engagement Time</th>
                    <th class="px-6 py-3 font-bold text-right">GA4 Events</th>
                    <th class="px-6 py-3 font-bold text-right">Conversions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-150 dark:divide-border/60 font-sans">
                  <tr v-for="(tr, idx) in trafficOrigins" :key="idx" class="hover:bg-gray-50 dark:hover:bg-muted/30 transition-colors">
                    <td class="px-6 py-4 font-bold text-gray-450 font-sans">{{ idx + 1 }}</td>
                    <td class="px-6 py-4 font-bold text-gray-800 dark:text-gray-300 font-sans">{{ tr.source }}</td>
                    <td class="px-6 py-4 font-bold text-right font-mono text-gray-800 dark:text-foreground">{{ tr.users.toLocaleString() }}</td>
                    <td class="px-6 py-4 font-bold text-right font-mono text-gray-800 dark:text-foreground">{{ tr.sessions.toLocaleString() }}</td>
                    <td class="px-6 py-4 font-bold text-right font-mono text-gray-800 dark:text-foreground">{{ tr.engaged.toLocaleString() }}</td>
                    <td class="px-6 py-4 font-bold text-right font-mono text-gray-800 dark:text-foreground">{{ tr.avgTime }}</td>
                    <td class="px-6 py-4 font-bold text-right font-mono text-gray-800 dark:text-foreground">{{ tr.events.toLocaleString() }}</td>
                    <td class="px-6 py-4 font-bold text-right font-mono text-emerald-600 dark:text-emerald-450">{{ tr.conversions.toLocaleString() }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  Calendar,
  Plus,
  Info,
  ChevronDown,
  Sparkles,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  Send,
  ArrowUpRight,
  ArrowRight,
  Zap
} from 'lucide-vue-next'

// --- View State ---
const activeTab = ref<string>('overview')

// ═════════════════════════════════════════════════════════
// OVERVIEW VIEW STATE & MOCK DATA
// ═════════════════════════════════════════════════════════
const revenuePeriod = ref('30D')
const funnelMode = ref('Count')

// Interactive Revenue Spline Points
const chartPoints = [
  { x: 50, y: 150, date: 'May 25', val: 300000, target: 280000 },
  { x: 150, y: 150, date: 'Jun 1', val: 320000, target: 295000 },
  { x: 250, y: 135, date: 'Jun 4', val: 345000, target: 310000 },
  { x: 350, y: 140, date: 'Jun 7', val: 350000, target: 325000 },
  { x: 450, y: 120, date: 'Jun 10', val: 385000, target: 340000 },
  { x: 550, y: 110, date: 'Jun 13', val: 405000, target: 355000 },
  { x: 650, y: 130, date: 'Jun 16', val: 395000, target: 370000 },
  { x: 750, y: 100, date: 'Jun 19', val: 435000, target: 385000 },
  { x: 850, y: 80, date: 'Jun 21', val: 468500, target: 400000 },
  { x: 950, y: 60, date: 'Jun 23', val: 509612, target: 372685 }
]

const hoveredPoint = ref<{ x: number; y: number; idx: number; date: string; val: number; target: number } | null>(null)

function handleChartHover(event: MouseEvent) {
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const mouseX = ((event.clientX - rect.left) / rect.width) * 1000 // scale to SVG viewBox width 1000
  
  // Find closest point by x coordinate
  let closestIdx = 0
  let minDist = Math.abs(chartPoints[0].x - mouseX)
  
  for (let i = 1; i < chartPoints.length; i++) {
    const dist = Math.abs(chartPoints[i].x - mouseX)
    if (dist < minDist) {
      minDist = dist
      closestIdx = i
    }
  }
  
  const pt = chartPoints[closestIdx]
  // Map back to relative DOM position for tooltip placement
  const tooltipX = (pt.x / 1000) * rect.width
  const tooltipY = (pt.y / 220) * rect.height
  
  hoveredPoint.value = {
    x: tooltipX,
    y: tooltipY,
    idx: closestIdx,
    date: pt.date,
    val: pt.val,
    target: pt.target
  }
}

// AI Assistant Insights Stack
const insights = ref([
  {
    type: 'alert',
    title: '13 deals were lost in this range',
    text: 'Use the lost-deals breakdown to identify the main reason and recover <strong>at-risk pipeline</strong> earlier.',
    actionText: 'Review losses'
  },
  {
    type: 'success',
    title: 'Yee Ling leads revenue won',
    text: '<strong>Yee Ling</strong> contributed <strong>RM 500K</strong> in won revenue during this range.',
    actionText: 'View leaderboard'
  },
  {
    type: 'default',
    title: 'Website is the largest lead source',
    text: '<strong>0</strong> leads came from <strong>Website</strong> in this range.',
    actionText: 'View channels'
  }
])

const aiQuery = ref('')

function submitAIQuestion() {
  if (!aiQuery.value.trim()) return
  
  const query = aiQuery.value.toLowerCase()
  let replyTitle = 'AI Response Insight'
  let replyText = "I couldn't find specific stats on that query. Try asking about 'revenue', 'top agent', or 'channels'."
  
  if (query.includes('revenue') || query.includes('target') || query.includes('won')) {
    replyTitle = 'Revenue vs Target Summary'
    replyText = 'Total revenue won is <strong>RM 509.6K</strong>, exceeding target by <strong>136.74%</strong>. Main contributor is WhatsApp channel.'
  } else if (query.includes('agent') || query.includes('leaderboard') || query.includes('top')) {
    replyTitle = 'Top Performing Agent'
    replyText = '<strong>Amirul Mokhtar</strong> is the top agent with <strong>RM 756</strong> revenue won and <strong>100%</strong> win rate across 19 active deals.'
  } else if (query.includes('channel') || query.includes('platform') || query.includes('whatsapp')) {
    replyTitle = 'Channel Volume Breakdown'
    replyText = '<strong>WhatsApp</strong> is the active driver making up <strong>55%</strong> of leads (202 total), followed by <strong>Email</strong> with <strong>45%</strong> (166 total).'
  }
  
  insights.value.unshift({
    type: 'default',
    title: replyTitle,
    text: replyText,
    actionText: 'Analyze query details'
  })
  
  aiQuery.value = ''
}

// Pipeline Funnel data
const funnelStages = [
  { name: 'New Leads', count: 978, val: 978000, pct: 100, conversion: '—' },
  { name: 'Acknowledged', count: 31, val: 31000, pct: 15, conversion: '3%' },
  { name: 'Qualifying', count: 39, val: 39000, pct: 20, conversion: '126%' },
  { name: 'Proposal/Quotation', count: 21, val: 21000, pct: 12, conversion: '54%' },
  { name: 'Follow Up/Negotiation', count: 20, val: 20000, pct: 11, conversion: '95%' },
  { name: 'Won', count: 0, val: 0, pct: 1, conversion: '0%' }
]

// Leads by Channel legend list
const leadsByChannel = [
  { channel: 'WebWidget', count: 0, pct: 0, color: '#10b981' },
  { channel: 'Facebook', count: 0, pct: 0, color: '#3b82f6' },
  { channel: 'WhatsApp', count: 202, pct: 55, color: '#f97316' },
  { channel: 'SMS', count: 0, pct: 0, color: '#ef4444' },
  { channel: 'Email', count: 166, pct: 45, color: '#3b82f6' },
  { channel: 'API', count: 0, pct: 0, color: '#10b981' },
  { channel: 'Telegram', count: 0, pct: 0, color: '#a7f3d0' },
  { channel: 'Line', count: 0, pct: 0, color: '#34d399' },
  { channel: 'Instagram', count: 0, pct: 0, color: '#059669' }
]

// ═════════════════════════════════════════════════════════
// PIPELINE VIEW STATE & MOCK DATA
// ═════════════════════════════════════════════════════════
const dealVelocityStages = [
  { name: 'New Leads', days: 6.4 },
  { name: 'Acknowledged', days: 7.6 },
  { name: 'Qualifying', days: 6.4 },
  { name: 'Proposal/ Quotation', days: 8.4 },
  { name: 'Follow Up/ Negotiation', days: 7.2 }
]

const lostReasons = [
  { title: 'Chose Competitor', count: 4, val: 35770 },
  { title: 'Other', count: 3, val: 1620 },
  { title: 'Unreachable', count: 3, val: 413000 },
  { title: 'No Need', count: 2, val: 270000 }
]

const agents = [
  {
    name: 'Amirul Mokhtar',
    avatar: '/avatars/agent_10_malay_male_coral.png',
    won: 1,
    open: 19,
    revenueWon: 756,
    dealsClosed: 1,
    winRate: 100,
    avgResponse: 0,
    avgDealValue: 756
  },
  {
    name: 'Poorneka',
    avatar: '/avatars/agent_11_chinese_female_mint.png',
    won: 0,
    open: 2,
    revenueWon: 0,
    dealsClosed: 0,
    winRate: 0,
    avgResponse: 0,
    avgDealValue: 0
  },
  {
    name: 'Dheeba',
    avatar: '/avatars/agent_12_indian_male_lavender.png',
    won: 0,
    open: 2,
    revenueWon: 0,
    dealsClosed: 0,
    winRate: 0,
    avgResponse: 0,
    avgDealValue: 0
  },
  {
    name: 'Kavitha Krishnan',
    avatar: '/avatars/agent_06_indian_female_young.png',
    won: 0,
    open: 1,
    revenueWon: 0,
    dealsClosed: 0,
    winRate: 0,
    avgResponse: 0,
    avgDealValue: 0
  },
  {
    name: 'Chong Wei Jian',
    avatar: '/avatars/chong-wei-jian.png',
    won: 0,
    open: 1,
    revenueWon: 0,
    dealsClosed: 0,
    winRate: 0,
    avgResponse: 0,
    avgDealValue: 0
  }
]

// ═════════════════════════════════════════════════════════
// MARKETING VIEW STATE & MOCK DATA
// ═════════════════════════════════════════════════════════
const attributionModel = ref('Last-touch')
const sessionsView = ref('Weekly')

const attributionChannels = [
  { name: 'WhatsApp', val: '142k', pct: 50, color: '#f97316' },
  { name: 'Organic Search', val: '58k', pct: 20, color: '#3b82f6' },
  { name: 'Facebook', val: '42k', pct: 15, color: '#10b981' },
  { name: 'Instagram', val: '18k', pct: 6, color: '#ef4444' },
  { name: 'Email', val: '25k', pct: 9, color: '#8b5cf6' }
]

const leadQualitySources = [
  { name: 'WhatsApp', qualPct: 70, unqualPct: 30 },
  { name: 'Facebook', qualPct: 83, unqualPct: 17 },
  { name: 'Google', qualPct: 67, unqualPct: 33 },
  { name: 'Instagram', qualPct: 0, unqualPct: 100 },
  { name: 'Email', qualPct: 75, unqualPct: 25 }
]

const trafficOrigins = [
  { source: 'WhatsApp / cpc', users: 10402, sessions: 14810, engaged: 8950, avgTime: '1m 12s', events: 12400, conversions: 202 },
  { source: 'google / organic', users: 4120, sessions: 5600, engaged: 3800, avgTime: '2m 04s', events: 6100, conversions: 88 },
  { source: 'facebook / referral', users: 2800, sessions: 3450, engaged: 2100, avgTime: '0m 58s', events: 4500, conversions: 42 },
  { source: 'email / newsletter', users: 1150, sessions: 1400, engaged: 950, avgTime: '1m 45s', events: 2100, conversions: 166 },
  { source: 'direct / none', users: 850, sessions: 910, engaged: 520, avgTime: '0m 35s', events: 1100, conversions: 12 }
]
</script>

<style scoped>
.divide-y > :not([hidden]) ~ :not([hidden]) {
  border-top-width: 1px;
}
</style>
