<template>
  <div class="h-full flex flex-col bg-gray-50 dark:bg-background overflow-hidden text-sm relative">
    
    <!-- Toast Notification Banner -->
    <transition
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="toast.show"
        class="fixed bottom-5 right-5 z-[100] flex items-center gap-3 bg-white dark:bg-slate-900 border border-gray-255 dark:border-slate-800 px-4 py-3 rounded-xl shadow-lg"
        :class="toast.type === 'success' ? 'shadow-emerald-500/10' : 'shadow-red-500/10'"
      >
        <component
          :is="toast.type === 'success' ? CheckCircle2 : AlertTriangle"
          class="w-5 h-5 shrink-0"
          :class="toast.type === 'success' ? 'text-emerald-500' : 'text-red-500'"
        />
        <div class="flex flex-col">
          <span class="font-bold text-gray-950 dark:text-foreground text-xs">{{ toast.title }}</span>
          <span class="text-gray-500 dark:text-muted-foreground text-[11px] mt-0.5">{{ toast.message }}</span>
        </div>
        <button @click="toast.show = false" class="p-1 hover:bg-gray-150 dark:hover:bg-slate-850 rounded text-gray-400 cursor-pointer">
          <X class="w-3.5 h-3.5" />
        </button>
      </div>
    </transition>

    <!-- ═══════════════════════════════════════════════
         VIEW 1: EVENTS LIST DASHBOARD
         ═══════════════════════════════════════════════ -->
    <main v-if="!selectedEvent" class="flex-1 overflow-y-auto bg-gray-50 dark:bg-background">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        <!-- Header -->
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-foreground">Events</h1>
            <p class="text-xs text-muted-foreground mt-0.5">All events and leads in one place</p>
          </div>
          <Button
            variant="primary"
            class="gap-1.5 hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer shadow-sm rounded-lg"
            @click="openCreateModal"
          >
            <Plus class="w-4 h-4" />
            Create New Event
          </Button>
        </div>

        <!-- KPI Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Card 1: TOTAL LEAD (Green Gradient) -->
          <div class="bg-gradient-to-br from-emerald-600 to-emerald-500 dark:from-emerald-700 dark:to-emerald-600 text-white p-5 rounded-2xl shadow-sm relative overflow-hidden flex flex-col justify-between h-[135px]">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-semibold uppercase tracking-wider opacity-90">Total Lead</span>
              <div class="flex items-center gap-1">
                <button class="w-5 h-5 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center cursor-pointer" title="Info">
                  <Info class="w-3 h-3 text-white" />
                </button>
                <button class="w-5 h-5 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center cursor-pointer" title="Analytics">
                  <TrendingUp class="w-3 h-3 text-white" />
                </button>
              </div>
            </div>
            <div>
              <h3 class="text-3xl font-semibold tracking-tight leading-none">{{ totalLeads }}</h3>
              <p class="text-[11px] opacity-90 mt-1.5">Across {{ activeEventsCount }} events</p>
            </div>
          </div>

          <!-- Card 2: WON REVENUE (White Card) -->
          <div class="bg-white dark:bg-card border border-gray-250 dark:border-border p-5 rounded-2xl shadow-sm relative overflow-hidden flex flex-col justify-between h-[135px] group hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-semibold text-gray-500 dark:text-muted-foreground uppercase tracking-wider">Won Revenue</span>
              <div class="flex items-center gap-1">
                <button class="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors flex items-center justify-center cursor-pointer text-emerald-600 dark:text-emerald-400" title="Info">
                  <Info class="w-3 h-3" />
                </button>
                <button class="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors flex items-center justify-center cursor-pointer text-emerald-600 dark:text-emerald-400" title="Analytics">
                  <TrendingUp class="w-3 h-3" />
                </button>
              </div>
            </div>
            <div>
              <h3 class="text-3xl font-semibold tracking-tight leading-none text-gray-900 dark:text-foreground">RM{{ formatRevenue(totalWonRevenue) }}</h3>
              <p class="text-[11px] text-muted-foreground mt-1.5">{{ totalDealsClosed }} deals closed</p>
            </div>
          </div>

          <!-- Card 3: TOTAL CONVERTED (White Card) -->
          <div class="bg-white dark:bg-card border border-gray-250 dark:border-border p-5 rounded-2xl shadow-sm relative overflow-hidden flex flex-col justify-between h-[135px] group hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-semibold text-gray-500 dark:text-muted-foreground uppercase tracking-wider">Total Converted</span>
              <div class="flex items-center gap-1">
                <button class="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors flex items-center justify-center cursor-pointer text-emerald-600 dark:text-emerald-400" title="Info">
                  <Info class="w-3 h-3" />
                </button>
                <button class="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors flex items-center justify-center cursor-pointer text-emerald-600 dark:text-emerald-400" title="Analytics">
                  <TrendingUp class="w-3 h-3" />
                </button>
              </div>
            </div>
            <div>
              <h3 class="text-3xl font-semibold tracking-tight leading-none text-gray-900 dark:text-foreground">
                {{ totalConverted }}<span class="text-lg font-medium text-gray-400">/{{ totalLeads }}</span>
              </h3>
              <p class="text-[11px] text-muted-foreground mt-1.5">Across all events</p>
            </div>
          </div>

          <!-- Card 4: AVG CONVERSION (White Card) -->
          <div class="bg-white dark:bg-card border border-gray-250 dark:border-border p-5 rounded-2xl shadow-sm relative overflow-hidden flex flex-col justify-between h-[135px] group hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-semibold text-gray-500 dark:text-muted-foreground uppercase tracking-wider">Avg Conversion</span>
              <div class="flex items-center gap-1">
                <button class="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors flex items-center justify-center cursor-pointer text-emerald-600 dark:text-emerald-400" title="Info">
                  <Info class="w-3 h-3" />
                </button>
                <button class="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors flex items-center justify-center cursor-pointer text-emerald-600 dark:text-emerald-400" title="Analytics">
                  <TrendingUp class="w-3 h-3" />
                </button>
              </div>
            </div>
            <div>
              <h3 class="text-3xl font-semibold tracking-tight leading-none text-gray-900 dark:text-foreground">{{ avgConversion }}%</h3>
              <p class="text-[11px] text-muted-foreground mt-1.5">Across all events</p>
            </div>
          </div>
        </div>

        <!-- Filters Section -->
        <div class="bg-white dark:bg-card border border-gray-200 dark:border-border p-4 rounded-2xl shadow-sm">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-end">
            <!-- Search -->
            <div class="lg:col-span-4 space-y-1.5">
              <label class="text-[10px] font-bold text-gray-500 dark:text-muted-foreground uppercase tracking-wider">Search</label>
              <div class="relative">
                <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  v-model="filters.search"
                  type="text"
                  placeholder="Search by Event"
                  class="w-full pl-9 pr-12 py-1.5 bg-gray-50 dark:bg-muted border border-gray-250 dark:border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-gray-800 dark:text-foreground"
                />
                <span class="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] bg-white dark:bg-card border border-gray-200 dark:border-border px-1.5 py-0.5 rounded text-gray-400 font-mono select-none">
                  ⌘K
                </span>
              </div>
            </div>

            <!-- Time select -->
            <div class="lg:col-span-2 space-y-1.5">
              <label class="text-[10px] font-bold text-gray-500 dark:text-muted-foreground uppercase tracking-wider">Time</label>
              <select
                v-model="filters.time"
                class="w-full py-1.5 bg-gray-50 dark:bg-muted border border-gray-255 dark:border-border rounded-lg text-xs text-gray-700 dark:text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary px-3 cursor-pointer"
              >
                <option value="all">All time</option>
                <option value="this-month">This month</option>
                <option value="this-year">This year</option>
              </select>
            </div>

            <!-- Status select -->
            <div class="lg:col-span-2 space-y-1.5">
              <label class="text-[10px] font-bold text-gray-500 dark:text-muted-foreground uppercase tracking-wider">Status</label>
              <select
                v-model="filters.status"
                class="w-full py-1.5 bg-gray-50 dark:bg-muted border border-gray-250 dark:border-border rounded-lg text-xs text-gray-700 dark:text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary px-3 cursor-pointer"
              >
                <option value="all">All</option>
                <option value="Active">Active</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Ended">Ended</option>
              </select>
            </div>

            <!-- Tags -->
            <div class="lg:col-span-2.5 space-y-1.5">
              <label class="text-[10px] font-bold text-gray-500 dark:text-muted-foreground uppercase tracking-wider">Tags</label>
              <div class="relative flex items-center min-h-[30px] px-2 py-1 bg-gray-50 dark:bg-muted border border-gray-255 dark:border-border rounded-lg text-xs">
                <span class="flex items-center gap-1.5 px-2 py-0.5 bg-white dark:bg-card border border-gray-200 dark:border-border rounded-md text-[10px] font-semibold text-gray-600 dark:text-muted-foreground">
                  All
                  <button @click="clearTags" class="text-gray-400 hover:text-gray-600 dark:hover:text-foreground">
                    <X class="w-3 h-3" />
                  </button>
                </span>
              </div>
            </div>

            <!-- Buttons -->
            <div class="lg:col-span-1.5 flex gap-2">
              <button class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-gray-200 dark:border-border rounded-lg text-xs font-semibold text-gray-600 dark:text-muted-foreground bg-gray-50 dark:bg-muted hover:bg-gray-100 dark:hover:bg-card transition-colors cursor-pointer">
                <Filter class="w-3.5 h-3.5" />
                Filters
              </button>
              <button
                @click="resetFilters"
                title="Reset Filters"
                class="flex items-center justify-center p-2 border border-gray-200 dark:border-border rounded-lg text-gray-500 dark:text-muted-foreground bg-gray-50 dark:bg-muted hover:bg-gray-100 dark:hover:bg-card hover:text-gray-700 dark:hover:text-foreground transition-colors cursor-pointer"
              >
                <RotateCcw class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <!-- Tab & Table Card Section -->
        <div class="bg-white dark:bg-card border border-gray-200 dark:border-border rounded-2xl shadow-sm overflow-hidden">
          
          <!-- Table Toolbar -->
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 py-4 border-b border-gray-200 dark:border-border gap-4 bg-white dark:bg-card">
            <!-- Tabs -->
            <div class="flex items-center gap-1 p-0.5 bg-gray-100 dark:bg-muted rounded-lg border border-gray-200 dark:border-border">
              <button
                v-for="tab in ['all', 'mine', 'archived']"
                :key="tab"
                @click="activeTab = tab"
                :class="[
                  'px-4 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer',
                  activeTab === tab
                    ? 'bg-white dark:bg-card border border-gray-200 dark:border-border text-gray-900 dark:text-foreground shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 dark:text-muted-foreground dark:hover:text-foreground'
                ]"
              >
                {{ tab === 'all' ? 'All events' : tab === 'mine' ? 'My event' : 'Archived' }}
              </button>
            </div>

            <!-- Bulk actions on right -->
            <div class="flex items-center gap-1.5">
              <div class="text-[11px] text-gray-500 dark:text-muted-foreground mr-1.5" v-if="selectedEventIds.length > 0">
                {{ selectedEventIds.length }} selected
              </div>
              <div class="border border-gray-200 dark:border-border rounded-lg p-0.5 flex items-center gap-0.5 bg-gray-50 dark:bg-muted">
                <button
                  :disabled="selectedEventIds.length === 0"
                  @click="triggerBulkAction('send')"
                  title="Send campaigns"
                  class="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-foreground hover:bg-white dark:hover:bg-card rounded-md transition-all disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-400 cursor-pointer"
                >
                  <Send class="w-3.5 h-3.5" />
                </button>
                <button
                  :disabled="selectedEventIds.length === 0"
                  @click="triggerBulkAction('pause')"
                  title="Pause / Hold"
                  class="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-foreground hover:bg-white dark:hover:bg-card rounded-md transition-all disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-400 cursor-pointer"
                >
                  <Pause class="w-3.5 h-3.5" />
                </button>
                <button
                  :disabled="selectedEventIds.length === 0"
                  @click="triggerBulkAction('archive')"
                  title="Archive selected"
                  class="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-foreground hover:bg-white dark:hover:bg-card rounded-md transition-all disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-400 cursor-pointer"
                >
                  <Archive class="w-3.5 h-3.5" />
                </button>
                <button
                  :disabled="selectedEventIds.length === 0"
                  @click="triggerBulkAction('delete')"
                  title="Delete selected"
                  class="p-1.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-white dark:hover:bg-card rounded-md transition-all disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-400 cursor-pointer"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <!-- Table Container -->
          <div class="overflow-x-auto min-h-[300px]">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-gray-200 dark:border-border text-[11px] font-bold text-gray-500 dark:text-muted-foreground uppercase tracking-wider bg-gray-50/50 dark:bg-muted/10">
                  <th class="py-3 px-5 w-12 text-center">
                    <input
                      type="checkbox"
                      :checked="isAllSelected"
                      @change="toggleSelectAll"
                      class="rounded border-gray-300 dark:border-slate-800 text-primary w-4 h-4 cursor-pointer"
                    />
                  </th>
                  <th class="py-3 px-4 font-bold cursor-pointer hover:text-gray-700 dark:hover:text-foreground" @click="toggleSort">
                    <div class="flex items-center gap-1.5">
                      Events
                      <ChevronDown class="w-3.5 h-3.5 transition-transform duration-200" :class="sortDesc ? 'rotate-180' : ''" />
                    </div>
                  </th>
                  <th class="py-3 px-4 font-bold text-center w-24">Leads</th>
                  <th class="py-3 px-4 font-bold text-center w-36">Not Contacted</th>
                  <th class="py-3 px-4 font-bold text-right w-32">Won Revenue</th>
                  <th class="py-3 px-4 font-bold text-center w-32">Converted</th>
                  <th class="py-3 px-4 font-bold text-center w-28">Conversion</th>
                  <th class="py-3 px-4 font-bold text-center w-32">Status</th>
                  <th class="py-3 px-4 w-12"></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-border/50 bg-white dark:bg-card">
                <tr
                  v-for="event in paginatedEvents"
                  :key="event.id"
                  class="hover:bg-gray-50/40 dark:hover:bg-muted/10 transition-colors group"
                >
                  <!-- Checkbox -->
                  <td class="py-4 px-5 text-center">
                    <input
                      type="checkbox"
                      :checked="selectedEventIds.includes(event.id)"
                      @change="toggleSelectEvent(event.id)"
                      class="rounded border-gray-300 dark:border-slate-800 text-primary w-4 h-4 cursor-pointer"
                    />
                  </td>

                  <!-- Events Info -->
                  <td class="py-4 px-4" @click="viewEventDetail(event)">
                    <div class="flex flex-col cursor-pointer">
                      <span class="font-bold text-gray-900 dark:text-foreground text-[13px] hover:text-primary transition-colors">
                        {{ event.name }}
                      </span>
                      <span class="text-xs text-gray-400 dark:text-muted-foreground mt-0.5">
                        {{ event.location }} <span class="mx-1">|</span> {{ event.date }}
                      </span>
                    </div>
                  </td>

                  <!-- Leads -->
                  <td class="py-4 px-4 text-center font-medium text-gray-700 dark:text-muted-foreground">
                    {{ event.leads !== null && event.leads !== undefined ? event.leads : '-' }}
                  </td>

                  <!-- Not Contacted -->
                  <td class="py-4 px-4 text-center">
                    <span v-if="typeof event.notContacted === 'number'">
                      <span v-if="event.notContacted > 0" class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold"
                            :class="event.notContacted >= 5 ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40' : 'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40'">
                        <AlertTriangle class="w-3.5 h-3.5 shrink-0" />
                        {{ event.notContacted }}
                      </span>
                      <span v-else class="text-xs text-gray-500 dark:text-muted-foreground font-medium">All contacted</span>
                    </span>
                    <span v-else class="text-xs text-gray-500 dark:text-muted-foreground font-medium">
                      {{ event.notContacted }}
                    </span>
                  </td>

                  <!-- Won Revenue -->
                  <td class="py-4 px-4 text-right font-medium text-gray-700 dark:text-muted-foreground">
                    {{ event.wonRevenue !== null && event.wonRevenue !== undefined ? 'RM' + formatRevenue(event.wonRevenue) : '-' }}
                  </td>

                  <!-- Converted -->
                  <td class="py-4 px-4 text-center text-xs text-gray-400">
                    <span v-if="event.convertedCount !== null && event.convertedCount !== undefined">
                      <strong class="text-gray-900 dark:text-foreground font-bold">{{ formatTwoDigits(event.convertedCount) }}</strong>/{{ event.leads }}
                    </span>
                    <span v-else>-</span>
                  </td>

                  <!-- Conversion Rate -->
                  <td class="py-4 px-4 text-center font-semibold text-gray-800 dark:text-muted-foreground">
                    {{ event.leads ? calculateConversionRate(event.convertedCount, event.leads) + '%' : '-' }}
                  </td>

                  <!-- Status -->
                  <td class="py-4 px-4 text-center">
                    <span
                      class="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold"
                      :class="[
                        event.status === 'Active' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40' : '',
                        event.status === 'Ended' ? 'bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-slate-700' : '',
                        event.status === 'Upcoming' ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900/40' : '',
                      ]"
                    >
                      <span
                        class="w-1.5 h-1.5 rounded-full shrink-0"
                        :class="[
                          event.status === 'Active' ? 'bg-emerald-500' : '',
                          event.status === 'Ended' ? 'bg-gray-400 dark:bg-gray-500' : '',
                          event.status === 'Upcoming' ? 'bg-blue-500' : '',
                        ]"
                      ></span>
                      {{ event.status }}
                    </span>
                  </td>

                  <!-- Dropdown Actions -->
                  <td class="py-4 px-4 text-right">
                    <button class="p-1 rounded hover:bg-gray-150 dark:hover:bg-muted text-gray-400 hover:text-gray-700 dark:hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer">
                      <MoreVertical class="w-4 h-4" />
                    </button>
                  </td>
                </tr>

                <!-- No Results State -->
                <tr v-if="filteredEvents.length === 0">
                  <td colspan="9" class="py-12 px-4 text-center text-gray-400 dark:text-muted-foreground italic">
                    No events found matching current criteria.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination Footer -->
          <div class="flex justify-between items-center px-6 py-4 border-t border-gray-100 dark:border-border bg-white dark:bg-card">
            <!-- Buttons -->
            <div class="flex items-center gap-1">
              <button
                @click="currentPage = Math.max(1, currentPage - 1)"
                :disabled="currentPage === 1"
                class="p-1.5 rounded-lg border border-gray-200 dark:border-border hover:bg-gray-50 dark:hover:bg-muted text-gray-500 dark:text-muted-foreground disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft class="w-4 h-4" />
              </button>
              <button
                v-for="page in totalPages"
                :key="page"
                @click="currentPage = page"
                :class="[
                  'px-3 py-1 rounded-lg text-xs font-semibold transition-all border cursor-pointer',
                  currentPage === page
                    ? 'bg-white dark:bg-card border-gray-300 dark:border-border text-gray-900 dark:text-foreground shadow-sm'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-muted-foreground dark:hover:text-foreground hover:bg-gray-50 dark:hover:bg-muted'
                ]"
              >
                {{ page }}
              </button>
              <button
                @click="currentPage = Math.min(totalPages, currentPage + 1)"
                :disabled="currentPage === totalPages || totalPages === 0"
                class="p-1.5 rounded-lg border border-gray-200 dark:border-border hover:bg-gray-50 dark:hover:bg-muted text-gray-500 dark:text-muted-foreground disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight class="w-4 h-4" />
              </button>
            </div>

            <!-- Page indicator -->
            <div class="text-xs text-gray-500 dark:text-muted-foreground">
              Page {{ currentPage }} of {{ totalPages || 1 }}
            </div>
          </div>

        </div>

      </div>
    </main>

    <!-- ═══════════════════════════════════════════════
         VIEW 2: EVENT DETAILS (INNER PAGE)
         ═══════════════════════════════════════════════ -->
    <main v-else class="flex-1 overflow-y-auto bg-gray-50 dark:bg-background">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        <!-- Top Toolbar Header -->
        <div class="flex justify-between items-center bg-gray-50 dark:bg-background py-1">
          <div class="flex items-center gap-3">
            <button
              @click="backToList"
              class="p-1.5 rounded-lg bg-white dark:bg-card border border-gray-200 dark:border-border hover:bg-gray-100 dark:hover:bg-muted transition-colors cursor-pointer text-gray-700 dark:text-foreground"
              title="Back to all events"
            >
              <ArrowLeft class="w-4 h-4" />
            </button>
            <div>
              <h1 class="text-xl font-bold tracking-tight text-gray-900 dark:text-foreground flex items-center gap-2">
                Events
              </h1>
              <p class="text-xs text-muted-foreground mt-0.5">All events and leads in one place</p>
            </div>
          </div>
          
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-2 bg-white dark:bg-card border border-gray-200 dark:border-border rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-muted-foreground">
              <input
                type="checkbox"
                v-model="detailViewArchiveState"
                class="rounded border-gray-300 dark:border-slate-800 text-primary w-4 h-4 cursor-pointer"
              />
              <span>Archive</span>
            </div>
            
            <button class="px-4 py-1.5 bg-white dark:bg-card hover:bg-gray-100 dark:hover:bg-muted border border-gray-200 dark:border-border rounded-lg text-xs font-semibold text-gray-700 dark:text-foreground cursor-pointer">
              Edit Events
            </button>
            
            <!-- Three dots dropdown containing AI tool modal triggers -->
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <button class="p-1.5 rounded-lg bg-white dark:bg-card border border-gray-200 dark:border-border text-gray-400 hover:text-gray-700 dark:hover:text-foreground cursor-pointer transition-colors">
                  <MoreVertical class="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" class="w-56 bg-white dark:bg-card border border-gray-200 dark:border-border p-1 shadow-lg z-[99]">
                <DropdownMenuLabel class="text-[9px] font-bold text-gray-400 dark:text-muted-foreground uppercase tracking-wider px-2 py-1 select-none">AI Co-Pilot Tools</DropdownMenuLabel>
                <DropdownMenuItem @click="openAIModal('scanner')" class="cursor-pointer flex items-center gap-2 text-xs font-semibold py-2 px-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                  <Sparkles class="w-3.5 h-3.5 text-indigo-500" />
                  AI Name Card Scanner
                </DropdownMenuItem>
                <DropdownMenuItem @click="openAIModal('automation')" class="cursor-pointer flex items-center gap-2 text-xs font-semibold py-2 px-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                  <Bot class="w-3.5 h-3.5 text-emerald-500" />
                  AI Auto Message
                </DropdownMenuItem>
                <DropdownMenuItem @click="openAIModal('analytics')" class="cursor-pointer flex items-center gap-2 text-xs font-semibold py-2 px-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                  <TrendingUp class="w-3.5 h-3.5 text-blue-500" />
                  Event Analytics
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <!-- Event Details Poster Banner Card -->
        <div class="bg-white dark:bg-card border border-gray-200 dark:border-border p-4 rounded-2xl shadow-sm flex flex-col md:flex-row gap-5 items-start">
          <!-- CSS Styled Poster Thumbnail -->
          <div class="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden shrink-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-950 flex flex-col justify-between p-2.5 border border-slate-700/50 text-white relative select-none">
            <div class="text-[7px] tracking-widest font-black uppercase opacity-75">SAMENTA</div>
            <div class="text-[9px] font-black leading-none tracking-tight">AI FEST 2026</div>
            <div class="text-[7px] text-right opacity-80 font-semibold mt-auto">May 02, 2026</div>
            <div class="absolute -right-3 -top-3 w-8 h-8 rounded-full bg-emerald-500/20 blur-sm"></div>
          </div>
          
          <!-- Event metadata -->
          <div class="flex-1">
            <div class="flex flex-wrap items-center gap-2">
              <h2 class="text-lg font-bold text-gray-900 dark:text-foreground">SAMENTA AI Fest 2026</h2>
              <span class="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-250 dark:border-emerald-900/40 rounded-full text-[10px] font-bold">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
              </span>
              <span class="text-xs text-gray-400 dark:text-muted-foreground font-semibold px-2 py-0.5 bg-gray-50 dark:bg-muted border border-gray-200 dark:border-border rounded-md">
                May 02, 2026
              </span>
            </div>
            
            <div class="flex flex-wrap gap-x-6 gap-y-2 mt-3.5 text-xs text-gray-500 dark:text-muted-foreground">
              <span class="flex items-center gap-1.5">
                <MapPin class="w-4 h-4 text-gray-400" />
                Penang Convention Centre
              </span>
              <span class="flex items-center gap-1.5">
                <Building2 class="w-4 h-4 text-gray-400" />
                SAMENTA
              </span>
              <span class="flex items-center gap-1.5">
                <CreditCard class="w-4 h-4 text-gray-400" />
                Cost : RM 2,200
              </span>
              <span class="flex items-center gap-1.5">
                <Layers class="w-4 h-4 text-gray-400" />
                Exhibition
              </span>
            </div>
          </div>
        </div>

        <!-- Metrics Summary row -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-white dark:bg-card border border-gray-200 dark:border-border p-4.5 rounded-2xl shadow-sm flex flex-col justify-between h-[105px]">
            <span class="text-[10px] font-semibold text-gray-500 dark:text-muted-foreground uppercase tracking-wider">Total Leads</span>
            <div class="mt-2 flex items-baseline justify-between">
              <span class="text-2xl font-semibold text-gray-900 dark:text-foreground leading-none">{{ samentaLeads.length }}</span>
              <span class="text-[10px] text-gray-400 font-semibold">{{ samentaLeads.length - 3 }} new · 3 existing</span>
            </div>
          </div>
          <div class="bg-white dark:bg-card border border-gray-200 dark:border-border p-4.5 rounded-2xl shadow-sm flex flex-col justify-between h-[105px]">
            <span class="text-[10px] font-semibold text-gray-500 dark:text-muted-foreground uppercase tracking-wider">Won Revenue</span>
            <div class="mt-2 flex items-baseline justify-between">
              <span class="text-2xl font-semibold text-gray-900 dark:text-foreground leading-none">RM2.1K</span>
              <span class="text-[10px] text-gray-400 font-semibold">2 deals closed</span>
            </div>
          </div>
          <div class="bg-white dark:bg-card border border-gray-200 dark:border-border p-4.5 rounded-2xl shadow-sm flex flex-col justify-between h-[105px]">
            <span class="text-[10px] font-semibold text-gray-500 dark:text-muted-foreground uppercase tracking-wider">Active Pipeline</span>
            <div class="mt-2 flex items-baseline justify-between">
              <span class="text-2xl font-semibold text-gray-900 dark:text-foreground leading-none">RM9.4K</span>
              <span class="text-[10px] text-gray-400 font-semibold">7 deals in progress</span>
            </div>
          </div>
          <div class="bg-white dark:bg-card border border-gray-200 dark:border-border p-4.5 rounded-2xl shadow-sm flex flex-col justify-between h-[105px]">
            <span class="text-[10px] font-semibold text-gray-500 dark:text-muted-foreground uppercase tracking-wider">Event ROI (%)</span>
            <div class="mt-2 flex items-baseline justify-between">
              <span class="text-2xl font-semibold text-emerald-600 dark:text-emerald-455 leading-none">0.95</span>
              <span class="text-[10px] text-emerald-500/80 font-bold">Still active - growing</span>
            </div>
          </div>
        </div>

        <!-- Detail content columns -->
        <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          <!-- Left Column (Leads List Table - Always Default) -->
          <div class="xl:col-span-8 bg-white dark:bg-card border border-gray-200 dark:border-border rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[480px]">
            <div class="flex justify-between items-center px-6 py-4 border-b border-gray-150 dark:border-border bg-white dark:bg-card">
              <div>
                <h3 class="font-bold text-gray-950 dark:text-foreground text-[13px]">Leads</h3>
                <p class="text-[11px] text-muted-foreground mt-0.5">{{ samentaLeads.length }} captured · <span class="text-red-500 font-bold">3 not yet contacted</span></p>
              </div>
              <div class="flex gap-2">
                <button class="flex items-center gap-1 px-3 py-1.5 border border-gray-200 dark:border-border rounded-lg text-xs font-semibold text-gray-600 dark:text-muted-foreground bg-gray-50 dark:bg-muted hover:bg-gray-100 cursor-pointer">
                  <Filter class="w-3.5 h-3.5 text-gray-400" />
                  Filters
                </button>
                <button class="flex items-center gap-1 px-3 py-1.5 border border-gray-200 dark:border-border rounded-lg text-xs font-semibold text-gray-600 dark:text-muted-foreground bg-gray-50 dark:bg-muted hover:bg-gray-100 cursor-pointer">
                  <ArrowDownUp class="w-3.5 h-3.5 text-gray-400" />
                  Sort
                </button>
              </div>
            </div>

            <!-- Table -->
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="border-b border-gray-200 dark:border-border text-[11px] font-bold text-gray-500 dark:text-muted-foreground uppercase tracking-wider bg-gray-50/50 dark:bg-muted/10">
                    <th class="py-3 px-5 w-12 text-center">
                      <input type="checkbox" class="rounded border-gray-300 w-4 h-4 cursor-pointer" />
                    </th>
                    <th class="py-3 px-4 font-bold">Name & Company</th>
                    <th class="py-3 px-4 font-bold text-center">Source</th>
                    <th class="py-3 px-4 font-bold text-center">Stage</th>
                    <th class="py-3 px-4 font-bold text-center">Assigned To</th>
                    <th class="py-3 px-4 font-bold text-center">Captured</th>
                    <th class="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-border/50 bg-white dark:bg-card">
                  <tr
                    v-for="lead in samentaLeads"
                    :key="lead.id"
                    class="hover:bg-gray-50/40 dark:hover:bg-muted/10 transition-colors"
                  >
                    <!-- checkbox -->
                    <td class="py-3.5 px-5 text-center">
                      <input type="checkbox" :checked="lead.checked" class="rounded border-gray-300 w-4 h-4 cursor-pointer" />
                    </td>

                    <!-- Name & company -->
                    <td class="py-3.5 px-4">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-gray-100 bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-primary font-bold text-xs">
                          {{ lead.name.split(' ').map(n => n[0]).join('') }}
                        </div>
                        <div class="flex flex-col min-w-0">
                          <div class="flex items-center gap-1.5 min-w-0">
                            <span class="font-bold text-gray-900 dark:text-foreground text-xs truncate">{{ lead.name }}</span>
                            <!-- VIP Badge -->
                            <span v-if="lead.vip" class="inline-flex items-center px-1 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/40 text-[7px] font-extrabold uppercase scale-90 shrink-0">
                              VIP
                            </span>
                            <!-- Temperature dot indicator -->
                            <span
                              v-if="lead.temperature"
                              class="w-1.5 h-1.5 rounded-full shrink-0"
                              :class="[
                                lead.temperature === 'Hot' ? 'bg-red-500 shadow-sm shadow-red-500/50' : '',
                                lead.temperature === 'Warm' ? 'bg-amber-500 shadow-sm shadow-amber-500/50' : '',
                                lead.temperature === 'Cold' ? 'bg-blue-500 shadow-sm shadow-blue-500/50' : '',
                              ]"
                              :title="'Temperature: ' + lead.temperature"
                            ></span>
                          </div>
                          <span class="text-[10px] text-gray-400 dark:text-muted-foreground truncate mt-0.5">
                            {{ lead.role }}, <span class="font-medium text-gray-600 dark:text-gray-400">{{ lead.company }}</span>
                          </span>
                        </div>
                      </div>
                    </td>

                    <!-- Source -->
                    <td class="py-3.5 px-4 text-center text-xs text-gray-600 dark:text-muted-foreground font-medium">
                      {{ lead.source }}
                    </td>

                    <!-- Stage -->
                    <td class="py-3.5 px-4 text-center">
                      <span
                        class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                        :class="[
                          lead.stage === 'Won' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 border border-emerald-200 dark:border-emerald-900/40' : '',
                          lead.stage === 'Proposal Sent' ? 'bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-900/40' : '',
                          lead.stage === 'Demo Booked' ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-450 border border-blue-200 dark:border-blue-900/40' : '',
                          lead.stage === 'Not Contacted' ? 'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40' : '',
                        ]"
                      >
                        <Check v-if="lead.stage === 'Won'" class="w-2.5 h-2.5 shrink-0" />
                        <Send v-if="lead.stage === 'Proposal Sent'" class="w-2.5 h-2.5 shrink-0" />
                        <Calendar v-if="lead.stage === 'Demo Booked'" class="w-2.5 h-2.5 shrink-0" />
                        <AlertTriangle v-if="lead.stage === 'Not Contacted'" class="w-2.5 h-2.5 shrink-0" />
                        {{ lead.stage }}
                      </span>
                    </td>

                    <!-- Assigned To -->
                    <td class="py-3.5 px-4 text-center text-xs text-gray-700 dark:text-muted-foreground font-medium">
                      {{ lead.assignedTo }}
                    </td>

                    <!-- Captured -->
                    <td class="py-3.5 px-4 text-center text-xs text-gray-505 dark:text-muted-foreground">
                      {{ lead.capturedTime }}
                    </td>

                    <!-- Actions Kebab Dropdown -->
                    <td class="py-3.5 px-4 text-center relative">
                      <DropdownMenu>
                        <DropdownMenuTrigger as-child>
                          <button class="p-1 rounded hover:bg-gray-100 dark:hover:bg-muted text-gray-400 hover:text-gray-700 dark:hover:text-foreground cursor-pointer transition-colors">
                            <MoreVertical class="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" class="w-40 bg-white dark:bg-card border border-gray-250 dark:border-border p-1 shadow-md z-[90]">
                          <DropdownMenuItem @click="triggerLeadAction(lead, 'assign_view')" class="cursor-pointer flex items-center gap-2 text-xs font-semibold py-1.5 px-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                            <UserCheck class="w-3.5 h-3.5 text-slate-500" />
                            {{ lead.stage === 'Not Contacted' ? 'Assign Lead' : 'View Details' }}
                          </DropdownMenuItem>
                          <DropdownMenuItem @click="triggerLeadAction(lead, 'auto_message')" class="cursor-pointer flex items-center gap-2 text-xs font-semibold py-1.5 px-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                            <Bot class="w-3.5 h-3.5 text-emerald-500" />
                            AI Auto Message
                          </DropdownMenuItem>
                          <DropdownMenuItem @click="triggerLeadAction(lead, 'archive')" class="cursor-pointer flex items-center gap-2 text-xs font-semibold py-1.5 px-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-red-505">
                            <Archive class="w-3.5 h-3.5" />
                            Archive Lead
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Leads Pagination footer -->
            <div class="mt-auto flex justify-between items-center px-6 py-3.5 border-t border-gray-100 dark:border-border bg-white dark:bg-card">
              <div class="flex items-center gap-1">
                <button class="p-1 rounded border border-gray-200 dark:border-border text-gray-400 disabled:opacity-40 cursor-pointer"><ChevronLeft class="w-4 h-4" /></button>
                <button class="px-2.5 py-0.5 rounded border border-gray-300 dark:border-border bg-white dark:bg-card text-xs font-bold text-gray-805">1</button>
                <button class="px-2.5 py-0.5 rounded border border-transparent text-xs text-gray-500 hover:bg-gray-50">2</button>
                <button class="px-2.5 py-0.5 rounded border border-transparent text-xs text-gray-500 hover:bg-gray-50">3</button>
                <span class="text-gray-400 text-xs">...</span>
                <button class="px-2.5 py-0.5 rounded border border-transparent text-xs text-gray-500 hover:bg-gray-50">10</button>
                <button class="p-1 rounded border border-gray-200 dark:border-border text-gray-400 cursor-pointer"><ChevronRight class="w-4 h-4" /></button>
              </div>
              <div class="text-[11px] text-gray-500">Page 1 of 10</div>
            </div>
          </div>

          <!-- Right Column Sidebar -->
          <div class="xl:col-span-4 space-y-6">
            <!-- Widget 1: QR Code Card -->
            <div class="bg-white dark:bg-card border border-gray-200 dark:border-border p-5 rounded-2xl shadow-sm space-y-4">
              <h3 class="font-bold text-gray-950 dark:text-foreground text-xs uppercase tracking-wider">QR Code</h3>
              
              <div class="flex items-center justify-center p-3 bg-white dark:bg-muted rounded-xl border border-gray-100 dark:border-border">
                <img src="/rakansales_qr_code.png" class="w-32 h-32 object-contain" alt="RakanSales QR Code" />
              </div>

              <p class="text-xs text-gray-500 dark:text-muted-foreground text-center leading-relaxed">
                Start by just asking for an event registration and build on top agenda of that
              </p>

              <div class="grid grid-cols-2 gap-2 pt-2">
                <button
                  @click="copyEventLink"
                  class="py-2 bg-primary hover:bg-[#1a943e] text-white rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer text-center"
                >
                  Copy Link
                </button>
                <a
                  href="#"
                  class="py-2 bg-white dark:bg-card hover:bg-gray-50 dark:hover:bg-muted border border-gray-200 dark:border-border text-gray-700 dark:text-foreground rounded-lg text-xs font-bold shadow-sm text-center"
                >
                  Open New Tab
                </a>
              </div>
            </div>

            <!-- Widget 2: Conversion Funnel -->
            <div class="bg-white dark:bg-card border border-gray-200 dark:border-border p-5 rounded-2xl shadow-sm space-y-4">
              <div class="flex justify-between items-center">
                <h3 class="font-bold text-gray-955 dark:text-foreground text-xs uppercase tracking-wider">Conversion Funnel</h3>
                <input type="checkbox" class="rounded border-gray-300 w-3.5 h-3.5 cursor-pointer" checked />
              </div>

              <div class="space-y-3 py-2 text-xs">
                <div>
                  <div class="flex justify-between text-[11px] text-gray-500 mb-1">
                    <span>Total Leads</span>
                    <span class="font-bold text-gray-800 dark:text-foreground">{{ samentaLeads.length }}</span>
                  </div>
                  <div class="h-5 bg-gray-50 dark:bg-slate-800 rounded-md overflow-hidden relative border border-gray-200 dark:border-slate-700">
                    <div class="h-full bg-emerald-600 rounded-l" style="width: 100%"></div>
                  </div>
                </div>

                <div>
                  <div class="flex justify-between text-[11px] text-gray-500 mb-1">
                    <span>Contacted</span>
                    <span class="font-bold text-gray-800 dark:text-foreground">{{ funnelContactedCount }}</span>
                  </div>
                  <div class="h-5 bg-gray-50 dark:bg-slate-800 rounded-md overflow-hidden relative border border-gray-200 dark:border-slate-700">
                    <div class="h-full bg-emerald-500 rounded-l transition-all duration-300" :style="{ width: (funnelContactedCount / samentaLeads.length * 100) + '%' }"></div>
                  </div>
                </div>

                <div>
                  <div class="flex justify-between text-[11px] text-gray-500 mb-1">
                    <span>Demo Booked</span>
                    <span class="font-bold text-gray-800 dark:text-foreground">08</span>
                  </div>
                  <div class="h-5 bg-gray-50 dark:bg-slate-800 rounded-md overflow-hidden relative border border-gray-200 dark:border-slate-700">
                    <div class="h-full bg-emerald-400 rounded-l" style="width: 44.4%"></div>
                  </div>
                </div>

                <div>
                  <div class="flex justify-between text-[11px] text-gray-500 mb-1">
                    <span>Proposal Sent</span>
                    <span class="font-bold text-gray-800 dark:text-foreground">05</span>
                  </div>
                  <div class="h-5 bg-gray-50 dark:bg-slate-800 rounded-md overflow-hidden relative border border-gray-200 dark:border-slate-700">
                    <div class="h-full bg-emerald-350 rounded-l" style="width: 27.8%"></div>
                  </div>
                </div>

                <div>
                  <div class="flex justify-between text-[11px] text-gray-500 mb-1">
                    <span>Won</span>
                    <span class="font-bold text-gray-800 dark:text-foreground">03</span>
                  </div>
                  <div class="h-5 bg-gray-50 dark:bg-slate-800 rounded-md overflow-hidden relative border border-gray-200 dark:border-slate-700">
                    <div class="h-full bg-emerald-700 rounded-l" style="width: 16.7%"></div>
                  </div>
                </div>
              </div>

              <div class="border-t border-dashed border-gray-200 dark:border-slate-800 pt-3 flex flex-col gap-1.5 text-xs">
                <div class="flex justify-between">
                  <span class="text-gray-500">Lead : Won</span>
                  <span class="font-bold text-emerald-600 dark:text-emerald-400">11.1%</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Contacted rate</span>
                  <span class="font-bold text-gray-800 dark:text-foreground">{{ contactedRate }}%</span>
                </div>
              </div>
            </div>

            <!-- Widget 3: Lead Source -->
            <div class="bg-white dark:bg-card border border-gray-200 dark:border-border p-5 rounded-2xl shadow-sm space-y-4">
              <div class="flex justify-between items-center">
                <h3 class="font-bold text-gray-950 dark:text-foreground text-xs uppercase tracking-wider">Lead Source</h3>
                <input type="checkbox" class="rounded border-gray-300 w-3.5 h-3.5 cursor-pointer" checked />
              </div>

              <div class="flex items-center justify-center py-2 relative">
                <svg class="w-36 h-36 transform -rotate-95" viewBox="0 0 42 42">
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#e2e8f0" stroke-width="4.5" />
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#22c55e" stroke-width="4.5" stroke-dasharray="35 65" stroke-dashoffset="0" />
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#3b82f6" stroke-width="4.5" stroke-dasharray="15 85" stroke-dashoffset="-35" />
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#06b6d4" stroke-width="4.5" stroke-dasharray="40 60" stroke-dashoffset="-50" />
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f97316" stroke-width="4.5" stroke-dasharray="10 90" stroke-dashoffset="-90" />
                </svg>
                
                <div class="absolute flex flex-col items-center justify-center text-center">
                  <span class="text-xl font-black text-gray-900 dark:text-foreground leading-none">{{ samentaLeads.length }}</span>
                  <span class="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Leads</span>
                </div>
              </div>

              <div class="space-y-1.5 text-[11px] text-gray-500 pt-1">
                <div class="flex justify-between items-center">
                  <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded bg-emerald-500 shrink-0"></span>
                    <span>Web Form</span>
                  </div>
                  <span class="font-bold text-gray-800 dark:text-foreground">13.72%</span>
                </div>
                <div class="flex justify-between items-center">
                  <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded bg-blue-500 shrink-0"></span>
                    <span>Name Cards</span>
                  </div>
                  <span class="font-bold text-gray-800 dark:text-foreground">5.28%</span>
                </div>
                <div class="flex justify-between items-center">
                  <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded bg-cyan-500 shrink-0"></span>
                    <span>New</span>
                  </div>
                  <span class="font-bold text-gray-800 dark:text-foreground">14.78%</span>
                </div>
                <div class="flex justify-between items-center">
                  <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded bg-orange-500 shrink-0"></span>
                    <span>Existing</span>
                  </div>
                  <span class="font-bold text-gray-800 dark:text-foreground">5.28%</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </main>

    <!-- ═══════════════════════════════════════════════
         CREATE NEW EVENT MODAL
         ═══════════════════════════════════════════════ -->
    <Dialog v-model:open="createModalOpen">
      <DialogContent class="sm:max-w-[480px] rounded-2xl bg-white dark:bg-card border border-gray-250 dark:border-border p-6 shadow-2xl z-[90]">
        <DialogHeader class="border-b border-gray-155 dark:border-border pb-3">
          <DialogTitle class="text-base font-bold text-gray-955 dark:text-foreground">Create New Event</DialogTitle>
          <DialogDescription class="text-xs text-muted-foreground mt-0.5">
            Add a new event with metrics to the workspace database.
          </DialogDescription>
        </DialogHeader>

        <div class="py-4 space-y-4">
          <div class="space-y-1.5">
            <label class="text-[11px] font-bold text-gray-500 dark:text-muted-foreground uppercase tracking-wider">Event Name</label>
            <input
              v-model="newEvent.name"
              type="text"
              placeholder="e.g. SAMENTA AI Fest 2026"
              class="w-full px-3 py-2 bg-gray-50 dark:bg-muted border border-gray-250 dark:border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-gray-800 dark:text-foreground"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1.5">
              <label class="text-[11px] font-bold text-gray-500 dark:text-muted-foreground uppercase tracking-wider">Location</label>
              <input
                v-model="newEvent.location"
                type="text"
                placeholder="e.g. Penang, Online"
                class="w-full px-3 py-2 bg-gray-50 dark:bg-muted border border-gray-250 dark:border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-gray-800 dark:text-foreground"
              />
            </div>
            <div class="space-y-1.5">
              <label class="text-[11px] font-bold text-gray-500 dark:text-muted-foreground uppercase tracking-wider">Date</label>
              <input
                v-model="newEvent.date"
                type="text"
                placeholder="e.g. May 02, 2026"
                class="w-full px-3 py-2 bg-gray-50 dark:bg-muted border border-gray-255 dark:border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-gray-800 dark:text-foreground"
              />
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="text-[11px] font-bold text-gray-505 dark:text-muted-foreground uppercase tracking-wider">Status</label>
            <select
              v-model="newEvent.status"
              class="w-full py-2 bg-gray-50 dark:bg-muted border border-gray-250 dark:border-border rounded-lg text-xs text-gray-700 dark:text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary px-3 cursor-pointer"
            >
              <option value="Active">Active</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Ended">Ended</option>
            </select>
          </div>

          <div class="border-t border-dashed border-gray-200 dark:border-border pt-4">
            <span class="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-3">Event Metrics</span>
            
            <div class="grid grid-cols-2 gap-3.5">
              <div class="space-y-1.5">
                <label class="text-[11px] font-bold text-gray-500 dark:text-muted-foreground uppercase tracking-wider">Leads</label>
                <input
                  v-model.number="newEvent.leads"
                  type="number"
                  min="0"
                  class="w-full px-3 py-2 bg-gray-50 dark:bg-muted border border-gray-250 dark:border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-gray-800 dark:text-foreground"
                />
              </div>
              <div class="space-y-1.5">
                <label class="text-[11px] font-bold text-gray-500 dark:text-muted-foreground uppercase tracking-wider">Not Contacted</label>
                <input
                  v-model="newEvent.notContactedInput"
                  type="text"
                  placeholder="e.g. 3, Awaiting Event"
                  class="w-full px-3 py-2 bg-gray-50 dark:bg-muted border border-gray-250 dark:border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-gray-800 dark:text-foreground"
                />
              </div>
              <div class="space-y-1.5">
                <label class="text-[11px] font-bold text-gray-500 dark:text-muted-foreground uppercase tracking-wider">Converted</label>
                <input
                  v-model.number="newEvent.convertedCount"
                  type="number"
                  min="0"
                  class="w-full px-3 py-2 bg-gray-50 dark:bg-muted border border-gray-250 dark:border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-gray-800 dark:text-foreground"
                />
              </div>
              <div class="space-y-1.5">
                <label class="text-[11px] font-bold text-gray-500 dark:text-muted-foreground uppercase tracking-wider">Won Revenue (RM)</label>
                <input
                  v-model.number="newEvent.wonRevenue"
                  type="number"
                  min="0"
                  placeholder="e.g. 2100"
                  class="w-full px-3 py-2 bg-gray-50 dark:bg-muted border border-gray-250 dark:border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-gray-800 dark:text-foreground"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter class="border-t border-gray-150 dark:border-border pt-4 flex gap-2 justify-end">
          <DialogClose as-child>
            <button class="px-4 py-2 border border-gray-200 dark:border-border rounded-lg text-xs font-semibold text-gray-600 dark:text-muted-foreground bg-gray-50 dark:bg-muted hover:bg-gray-100 dark:hover:bg-card cursor-pointer">
              Cancel
            </button>
          </DialogClose>
          <button
            @click="saveEvent"
            class="px-4 py-2 bg-primary hover:bg-[#1a943e] text-white rounded-lg text-xs font-bold shadow-sm cursor-pointer"
          >
            Save Event
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- ═══════════════════════════════════════════════
         MODAL 1: AI NAME CARD SCANNER (POPUP MODAL)
         ═══════════════════════════════════════════════ -->
    <Dialog v-model:open="scannerModalOpen">
      <DialogContent class="sm:max-w-[720px] rounded-2xl bg-white dark:bg-card border border-gray-250 dark:border-border p-6 shadow-2xl z-[90]">
        <DialogHeader class="border-b border-gray-150 dark:border-border pb-3">
          <div class="flex items-center gap-2">
            <Sparkles class="w-5 h-5 text-indigo-500" />
            <DialogTitle class="text-base font-bold text-gray-955 dark:text-foreground">AI Name Card Scanner</DialogTitle>
          </div>
          <DialogDescription class="text-xs text-muted-foreground mt-0.5">
            Demonstrate optical card parsing turning instantly into lead record.
          </DialogDescription>
        </DialogHeader>

        <div class="py-4 flex flex-col md:flex-row gap-6">
          <!-- Left: Scanner Viewport Mockup -->
          <div class="flex-1 border border-gray-200 dark:border-border rounded-2xl p-5 bg-slate-900/5 dark:bg-slate-950/20 flex flex-col items-center justify-center relative overflow-hidden min-h-[260px]">
            <div v-if="scannerState.scanning" class="absolute inset-x-0 top-0 h-1 bg-emerald-500 shadow-md shadow-emerald-500/50 animate-scanner z-10"></div>
            
            <div class="w-full aspect-[1.6/1] bg-white border border-gray-300 rounded-xl shadow-lg relative p-4 flex flex-col justify-between overflow-hidden cursor-pointer hover:border-emerald-500/50 hover:shadow-emerald-500/5 transition-all duration-200"
                 @click="!scannerState.scanning && triggerScanner()"
                 :class="scannerState.scanning ? 'brightness-90 transition-all duration-300' : ''"
                 title="Click card to start scanning">
              <div class="flex items-center gap-1.5">
                <div class="w-4 h-4 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[7px] font-bold">TS</div>
                <span class="text-[8px] font-black text-indigo-900 tracking-wider">TechSolutions</span>
              </div>
              <div>
                <h4 class="text-sm font-black text-gray-900 leading-none">Cheah Kok Peng</h4>
                <p class="text-[9px] text-gray-500 mt-0.5">VP of Technology</p>
              </div>
              <div class="text-[7px] text-gray-400 space-y-0.5 border-t border-gray-100 pt-1.5 flex justify-between items-end">
                <div>
                  <p>kp.cheah@techsolutions.com</p>
                  <p>+60 12-345 6789</p>
                </div>
                <p class="font-semibold text-gray-600 text-[6px]">Kuala Lumpur, MY</p>
              </div>
            </div>

          </div>

          <!-- Right Panel: Step 1 (Scanned Metadata) -->
          <div v-if="scannerState.step === 1" class="flex-1 space-y-4">
            <div class="pb-1 border-b border-gray-100 flex justify-between items-center">
              <h4 class="font-bold text-gray-955 dark:text-foreground text-[12px] flex items-center gap-1.5">
                <Bot class="w-4 h-4 text-indigo-500" />
                AI Scanned Metadata
              </h4>
              <span class="text-[10px] font-semibold text-gray-400 bg-gray-50 dark:bg-slate-800 px-2 py-0.5 rounded border border-gray-100 dark:border-border">
                Step 1 of 2
              </span>
            </div>

            <!-- Scanner triggered by clicking name card directly -->

            <div class="space-y-3">
              <div class="space-y-1">
                <label class="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Scanned Name</label>
                <input
                  v-model="scannerState.result.name"
                  type="text"
                  placeholder="Waiting for scan..."
                  class="w-full px-3 py-1.5 bg-gray-50 border border-gray-250 rounded-lg text-xs font-semibold text-gray-800 focus:ring-1 focus:ring-primary"
                />
              </div>

              <div class="grid grid-cols-2 gap-2">
                <div class="space-y-1">
                  <label class="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Role</label>
                  <input
                    v-model="scannerState.result.role"
                    type="text"
                    placeholder="Waiting..."
                    class="w-full px-3 py-1.5 bg-gray-50 border border-gray-250 rounded-lg text-xs text-gray-800"
                  />
                </div>
                <div class="space-y-1">
                  <label class="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Company</label>
                  <input
                    v-model="scannerState.result.company"
                    type="text"
                    placeholder="Waiting..."
                    class="w-full px-3 py-1.5 bg-gray-50 border border-gray-250 rounded-lg text-xs text-gray-800"
                  />
                </div>
              </div>

              <div class="space-y-1">
                <label class="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                <input
                  v-model="scannerState.result.email"
                  type="text"
                  placeholder="Waiting for scan..."
                  class="w-full px-3 py-1.5 bg-gray-50 border border-gray-250 rounded-lg text-xs text-gray-800"
                />
              </div>
            </div>
          </div>

          <!-- Right Panel: Step 2 (Qualifiers) -->
          <div v-else class="flex-1 space-y-4">
            <div class="pb-1 border-b border-gray-100 flex justify-between items-center">
              <h4 class="font-bold text-gray-955 dark:text-foreground text-[12px] flex items-center gap-1.5">
                <Sparkles class="w-4 h-4 text-indigo-500" />
                Lead Qualifiers
              </h4>
              <span class="text-[10px] font-semibold text-gray-400 bg-gray-50 dark:bg-slate-800 px-2 py-0.5 rounded border border-gray-100 dark:border-border">
                Step 2 of 2
              </span>
            </div>

            <!-- Header details for context -->
            <div class="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 rounded-xl space-y-0.5">
              <span class="text-[9px] text-indigo-500 font-extrabold uppercase tracking-widest block">Qualifying Scanned Lead</span>
              <span class="text-xs font-bold text-gray-900 dark:text-foreground">{{ scannerState.result.name }}</span>
              <span class="text-[10px] text-gray-550 block">{{ scannerState.result.role }} at {{ scannerState.result.company }}</span>
            </div>

            <div class="space-y-4">
              <!-- Temperature Selector -->
              <div class="space-y-1.5">
                <label class="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Lead Temperature</label>
                <div class="flex gap-1.5">
                  <button
                    v-for="t in ['Cold', 'Warm', 'Hot']"
                    :key="t"
                    type="button"
                    @click="scannerState.qualifiers.temperature = t"
                    :class="[
                      'flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer text-center',
                      scannerState.qualifiers.temperature === t
                        ? t === 'Hot' ? 'bg-red-500 border-red-500 text-white shadow-sm shadow-red-500/20'
                          : t === 'Warm' ? 'bg-amber-500 border-amber-500 text-white shadow-sm shadow-amber-500/20'
                          : 'bg-blue-500 border-blue-500 text-white shadow-sm shadow-blue-500/20'
                        : 'border-gray-250 text-gray-505 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800'
                    ]"
                  >
                    {{ t }}
                  </button>
                </div>
              </div>

              <!-- Priority Selector -->
              <div class="space-y-1.5">
                <label class="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Sales Priority</label>
                <div class="flex gap-1.5">
                  <button
                    v-for="p in ['Low', 'Med', 'High']"
                    :key="p"
                    type="button"
                    @click="scannerState.qualifiers.priority = p"
                    :class="[
                      'flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer text-center',
                      scannerState.qualifiers.priority === p
                        ? 'bg-slate-900 border-slate-900 text-white dark:bg-slate-700 dark:border-slate-700'
                        : 'border-gray-250 text-gray-505 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800'
                    ]"
                  >
                    {{ p }}
                  </button>
                </div>
              </div>

              <!-- VIP Switch Toggle -->
              <div class="flex items-center justify-between py-2 px-3.5 bg-gray-50 dark:bg-slate-900/50 border border-gray-150 dark:border-slate-800 rounded-xl">
                <div class="flex flex-col text-left">
                  <span class="text-xs font-bold text-gray-800 dark:text-foreground">Mark as VIP Lead</span>
                  <span class="text-[9px] text-gray-400">Gives high-touch customer priority tag.</span>
                </div>
                <input
                  type="checkbox"
                  v-model="scannerState.qualifiers.vip"
                  class="rounded border-gray-300 text-primary w-4 h-4 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter class="border-t border-gray-150 dark:border-border pt-4 flex gap-2 justify-end">
          <template v-if="scannerState.step === 1">
            <DialogClose as-child>
              <button class="px-4 py-2 border border-gray-200 dark:border-border rounded-lg text-xs font-semibold text-gray-600 dark:text-muted-foreground bg-gray-50 dark:bg-muted hover:bg-gray-100 cursor-pointer">
                Cancel
              </button>
            </DialogClose>
            <button
              @click="scannerState.step = 2"
              class="px-5 py-2 bg-primary hover:bg-[#1a943e] text-white rounded-lg text-xs font-bold shadow-sm cursor-pointer disabled:opacity-40 disabled:hover:bg-primary"
              :disabled="!scannerState.scanned"
            >
              Next
            </button>
          </template>
          <template v-else>
            <button
              @click="scannerState.step = 1"
              class="px-4 py-2 border border-gray-200 dark:border-border rounded-lg text-xs font-semibold text-gray-600 dark:text-muted-foreground bg-gray-50 dark:bg-muted hover:bg-gray-100 cursor-pointer"
            >
              Back
            </button>
            <button
              @click="addScannedLead"
              class="px-5 py-2 bg-primary hover:bg-[#1a943e] text-white rounded-lg text-xs font-bold shadow-sm cursor-pointer"
            >
              Create Lead
            </button>
          </template>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- ═══════════════════════════════════════════════
         MODAL 2: AI AUTO MESSAGE AUTOMATION
         ═══════════════════════════════════════════════ -->
    <Dialog v-model:open="automationModalOpen">
      <DialogContent class="sm:max-w-[725px] rounded-2xl bg-white dark:bg-card border border-gray-250 dark:border-border p-6 shadow-2xl z-[90]">
        <DialogHeader class="border-b border-gray-150 dark:border-border pb-3">
          <div class="flex items-center gap-2">
            <Bot class="w-5 h-5 text-emerald-500" />
            <DialogTitle class="text-base font-bold text-gray-955 dark:text-foreground">AI Follow-up Automation</DialogTitle>
          </div>
          <DialogDescription class="text-xs text-muted-foreground mt-0.5">
            Draft automated event campaigns and follow-up templates dynamically.
          </DialogDescription>
        </DialogHeader>

        <div class="py-4 grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
          <!-- Controls left (4 cols) -->
          <div class="md:col-span-4 space-y-4">
            <div class="space-y-1.5">
              <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Target Lead</label>
              <select
                v-model="automationState.targetLeadId"
                class="w-full py-2 bg-gray-50 border border-gray-250 rounded-lg text-xs text-gray-700 focus:outline-none px-3 cursor-pointer"
              >
                <option v-for="l in samentaLeads" :key="l.id" :value="l.id">
                  {{ l.name }} ({{ l.company }})
                </option>
              </select>
            </div>

            <div class="space-y-1.5">
              <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Message Tone</label>
              <select
                v-model="automationState.tone"
                class="w-full py-2 bg-gray-50 border border-gray-250 rounded-lg text-xs text-gray-700 focus:outline-none px-3 cursor-pointer"
              >
                <option value="Professional">Professional & Direct</option>
                <option value="Friendly">Friendly & Collaborative</option>
                <option value="Urgent">Urgent Offer / Promotion</option>
              </select>
            </div>

            <div class="space-y-1.5">
              <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Channel</label>
              <div class="flex gap-2">
                <button
                  v-for="ch in ['email', 'whatsapp']"
                  :key="ch"
                  @click="automationState.channel = ch"
                  :class="[
                    'flex-1 py-1.5 border rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer text-center',
                    automationState.channel === ch
                      ? 'bg-slate-900 border-slate-900 text-white dark:bg-muted dark:border-border'
                      : 'border-gray-250 text-gray-600 bg-white hover:bg-gray-50'
                  ]"
                >
                  {{ ch }}
                </button>
              </div>
            </div>

            <Button
              variant="primary"
              class="w-full mt-4 font-bold"
              @click="generateAutomationMessage"
              :disabled="automationState.drafting"
            >
              {{ automationState.drafting ? 'Drafting...' : 'Draft Message' }}
            </Button>
          </div>

          <!-- Output right (8 cols) -->
          <div class="md:col-span-8 space-y-3 relative">
            <div>
              <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Drafted Content</label>
              <textarea
                v-model="automationState.message"
                rows="8"
                class="w-full p-3.5 bg-slate-900/5 border border-gray-255 rounded-xl text-xs font-medium text-gray-800 dark:text-foreground focus:outline-none leading-relaxed"
                placeholder="Choose options and click Generate..."
              ></textarea>
              
              <div v-if="automationState.drafting" class="absolute inset-0 bg-white/75 dark:bg-card/75 flex flex-col items-center justify-center gap-2">
                <span class="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></span>
                <span class="text-[11px] font-bold text-gray-600">AI is drafting personalized message...</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter class="border-t border-gray-150 dark:border-border pt-4 flex gap-2 justify-end">
          <DialogClose as-child>
            <button class="px-4 py-2 border border-gray-200 dark:border-border rounded-lg text-xs font-semibold text-gray-600 dark:text-muted-foreground bg-gray-50 dark:bg-muted hover:bg-gray-100 cursor-pointer">
              Cancel
            </button>
          </DialogClose>
          <button
            @click="sendAutomationMessage"
            class="px-4 py-2 bg-primary hover:bg-[#1a943e] text-white rounded-lg text-xs font-bold shadow-sm cursor-pointer"
            :disabled="!automationState.message"
          >
            Send Message
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- ═══════════════════════════════════════════════
         MODAL 3: LOCALIZED EVENT ANALYTICS
         ═══════════════════════════════════════════════ -->
    <Dialog v-model:open="analyticsModalOpen">
      <DialogContent class="sm:max-w-[650px] rounded-2xl bg-white dark:bg-card border border-gray-250 dark:border-border p-6 shadow-2xl z-[90]">
        <DialogHeader class="border-b border-gray-150 dark:border-border pb-3">
          <div class="flex items-center gap-2">
            <TrendingUp class="w-5 h-5 text-blue-500" />
            <DialogTitle class="text-base font-bold text-gray-955 dark:text-foreground">SAMENTA AI Fest 2026 Analytics</DialogTitle>
          </div>
          <DialogDescription class="text-xs text-muted-foreground mt-0.5">
            Real-time localized metrics converted specifically from this event.
          </DialogDescription>
        </DialogHeader>

        <div class="py-4 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- funnel chart -->
            <div class="border border-gray-200 dark:border-border rounded-xl p-4 space-y-3 bg-gray-50/50 dark:bg-muted/10">
              <span class="text-[10px] font-bold text-gray-400 dark:text-muted-foreground uppercase tracking-wider block">Lead Conversion Pipeline</span>
              <div class="space-y-2">
                <div>
                  <div class="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Lead-to-Contacted</span>
                    <span class="font-bold text-gray-900">83.3%</span>
                  </div>
                  <div class="h-1.5 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div class="h-full bg-emerald-500 rounded-full" style="width: 83.3%"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Lead-to-Demo</span>
                    <span class="font-bold text-gray-900">44.4%</span>
                  </div>
                  <div class="h-1.5 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div class="h-full bg-emerald-400 rounded-full" style="width: 44.4%"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Lead-to-Won</span>
                    <span class="font-bold text-gray-900">11.1%</span>
                  </div>
                  <div class="h-1.5 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div class="h-full bg-emerald-600 rounded-full" style="width: 11.1%"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- roi stats -->
            <div class="border border-gray-200 dark:border-border rounded-xl p-4 space-y-3 bg-gray-50/50 dark:bg-muted/10">
              <span class="text-[10px] font-bold text-gray-400 dark:text-muted-foreground uppercase tracking-wider block">ROI Financial Insights</span>
              <div class="space-y-1.5 text-xs text-gray-600 dark:text-muted-foreground">
                <p>• Total event budget spent: <span class="font-bold text-gray-950 dark:text-foreground">RM 2,200</span></p>
                <p>• Value generated from won deals: <span class="font-bold text-gray-950 dark:text-foreground">RM 2,100</span></p>
                <p>• Cost per Lead (CPL): <span class="font-bold text-gray-955 dark:text-foreground">RM 122.20</span></p>
                <p>• Potential pipeline conversion: <span class="font-bold text-gray-955 dark:text-foreground">RM 9,400</span></p>
                <p class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold border-t border-dashed border-gray-200 dark:border-slate-800 pt-2 mt-2">
                  ✔ ROI is at 0.95 and projected to exceed 4.5 upon pipeline closure.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter class="border-t border-gray-150 dark:border-border pt-4">
          <DialogClose as-child>
            <button class="px-4 py-2 bg-primary hover:bg-[#1a943e] text-white rounded-lg text-xs font-bold shadow-sm cursor-pointer">
              Close Dashboard
            </button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- ═══════════════════════════════════════════════
         MODAL 4: OMNICHANNEL SUCCESS MODAL
         ═══════════════════════════════════════════════ -->
    <Dialog v-model:open="successModalOpen">
      <DialogContent class="sm:max-w-[420px] rounded-2xl bg-white dark:bg-card border border-gray-250 dark:border-border p-6 shadow-2xl z-[90]">
        <DialogHeader class="text-center flex flex-col items-center">
          <div class="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-500 mb-3 border border-emerald-100 dark:border-emerald-900/40">
            <CheckCircle2 class="w-6 h-6" />
          </div>
          <DialogTitle class="text-base font-bold text-gray-955 dark:text-foreground">Follow-up Message Sent</DialogTitle>
          <DialogDescription class="text-xs text-muted-foreground mt-1 text-center">
            Your automated message has been successfully generated and dispatched to <strong class="text-gray-900 dark:text-foreground">{{ sentLeadName }}</strong> via {{ sentChannel }}.
          </DialogDescription>
        </DialogHeader>

        <div class="py-2.5 text-center text-xs text-muted-foreground border-t border-b border-dashed border-gray-150 dark:border-border my-4">
          <span class="block">Lead Stage updated to <strong class="text-emerald-600 dark:text-emerald-400">Proposal Sent</strong>.</span>
        </div>

        <DialogFooter class="flex flex-col sm:flex-row gap-2 w-full justify-center">
          <button
            @click="openOmnichannelChat"
            class="w-full sm:flex-1 px-4 py-2 bg-primary hover:bg-[#1a943e] text-white rounded-lg text-xs font-bold shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
          >
            <MessageSquare class="w-3.5 h-3.5" />
            Open Conversation
          </button>
          <DialogClose as-child>
            <button class="w-full sm:w-auto px-4 py-2 border border-gray-200 dark:border-border rounded-lg text-xs font-semibold text-gray-600 dark:text-muted-foreground bg-gray-50 dark:bg-muted hover:bg-gray-100 cursor-pointer">
              Done
            </button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Search, Plus, Filter, RotateCcw, Info, TrendingUp, MoreVertical,
  AlertTriangle, CheckCircle2, Trash2, Archive, Pause, Send, X,
  ChevronLeft, ChevronRight, ChevronDown, ArrowLeft, MapPin, Building2,
  CreditCard, Layers, Check, ArrowDownUp, Bot, Sparkles, UserCheck, MessageSquare
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu'

// ═══════════════════════════════════════════════
// MOCK DATA INITIALIZATION
// ═══════════════════════════════════════════════
interface EventItem {
  id: string
  name: string
  location: string
  date: string
  leads: number | null
  notContacted: number | string
  wonRevenue: number | null
  convertedCount: number | null
  status: 'Active' | 'Ended' | 'Upcoming' | 'Archived'
  owner: 'me' | 'others'
  archived?: boolean
}

const events = ref<EventItem[]>([
  {
    id: 'e1',
    name: 'SAMENTA AI Fest 2026',
    location: 'Penang',
    date: 'May 02, 2026',
    leads: 18,
    notContacted: 3,
    wonRevenue: 2100,
    convertedCount: 9,
    status: 'Active',
    owner: 'me'
  },
  {
    id: 'e2',
    name: 'SME CEO Forum 2026',
    location: 'Kuala Lumpur',
    date: 'Apr 22, 2026',
    leads: 25,
    notContacted: 2,
    wonRevenue: 4800,
    convertedCount: 14,
    status: 'Ended',
    owner: 'others'
  },
  {
    id: 'e3',
    name: 'Cradle LIVE!',
    location: 'Online',
    date: 'Apr 24, 2026',
    leads: 12,
    notContacted: 5,
    wonRevenue: 1400,
    convertedCount: 4,
    status: 'Ended',
    owner: 'me'
  },
  {
    id: 'e4',
    name: 'Penang Digital Summit',
    location: 'Penang',
    date: 'Apr 10, 2026',
    leads: 36,
    notContacted: 0,
    wonRevenue: 1000,
    convertedCount: 10,
    status: 'Ended',
    owner: 'me'
  },
  {
    id: 'e5',
    name: 'SME Digitalisation Roadshow',
    location: 'Johor Bharu',
    date: 'May 15, 2026',
    leads: 0,
    notContacted: 'Awaiting Event',
    wonRevenue: 0,
    convertedCount: 0,
    status: 'Upcoming',
    owner: 'others'
  },
  {
    id: 'e6',
    name: 'Tech Innovation Day',
    location: 'Penang',
    date: 'Mar 15, 2026',
    leads: 8,
    notContacted: 0,
    wonRevenue: 0,
    convertedCount: 0,
    status: 'Ended',
    owner: 'me'
  },
  {
    id: 'e7',
    name: 'AI in Retail Webinar',
    location: 'Online',
    date: 'Feb 18, 2026',
    leads: 4,
    notContacted: 0,
    wonRevenue: 0,
    convertedCount: 0,
    status: 'Ended',
    owner: 'others'
  }
])

// Toast state
const toast = ref({
  show: false,
  type: 'success',
  title: '',
  message: ''
})

const showToast = (type: 'success' | 'error', title: string, message: string) => {
  toast.value = { show: true, type, title, message }
  setTimeout(() => {
    toast.value.show = false
  }, 4000)
}

// ═══════════════════════════════════════════════
// FILTER & INTERACTIVE STATE
// ═══════════════════════════════════════════════
const filters = ref({
  search: '',
  time: 'all',
  status: 'all'
})

const activeTab = ref('all')
const selectedEventIds = ref<string[]>([])
const sortDesc = ref(false)
const currentPage = ref(1)
const itemsPerPage = 5

function resetFilters() {
  filters.value.search = ''
  filters.value.time = 'all'
  filters.value.status = 'all'
  activeTab.value = 'all'
  showToast('success', 'Filters Reset', 'All search filters have been cleared.')
}

function clearTags() {
  showToast('success', 'Tags Cleared', 'Tag filters have been set to default.')
}

function toggleSort() {
  sortDesc.value = !sortDesc.value
}

// Filtered Events
const filteredEvents = computed(() => {
  return events.value.filter(event => {
    if (filters.value.search) {
      const q = filters.value.search.toLowerCase()
      const matchName = event.name.toLowerCase().includes(q)
      const matchLoc = event.location.toLowerCase().includes(q)
      if (!matchName && !matchLoc) return false
    }

    if (activeTab.value === 'mine' && event.owner !== 'me') return false
    if (activeTab.value === 'archived' && event.status !== 'Archived') return false
    if (activeTab.value !== 'archived' && event.status === 'Archived') return false

    if (filters.value.status !== 'all' && event.status !== filters.value.status) return false

    if (filters.value.time === 'this-month') {
      return event.date.includes('May') || event.date.includes('Jun')
    } else if (filters.value.time === 'this-year') {
      return event.date.includes('2026')
    }

    return true
  }).sort((a, b) => {
    const dateA = new Date(a.date).getTime() || 0
    const dateB = new Date(b.date).getTime() || 0
    return sortDesc.value ? dateA - dateB : dateB - dateA
  })
})

const paginatedEvents = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredEvents.value.slice(start, start + itemsPerPage)
})

const totalPages = computed(() => {
  return Math.ceil(filteredEvents.value.length / itemsPerPage)
})

// ═══════════════════════════════════════════════
// SELECTION STATE HANDLERS
// ═══════════════════════════════════════════════
const isAllSelected = computed(() => {
  const visible = paginatedEvents.value
  if (visible.length === 0) return false
  return visible.every(e => selectedEventIds.value.includes(e.id))
})

function toggleSelectAll() {
  const visibleIds = paginatedEvents.value.map(e => e.id)
  if (isAllSelected.value) {
    selectedEventIds.value = selectedEventIds.value.filter(id => !visibleIds.includes(id))
  } else {
    const newSelection = [...selectedEventIds.value]
    visibleIds.forEach(id => {
      if (!newSelection.includes(id)) newSelection.push(id)
    })
    selectedEventIds.value = newSelection
  }
}

function toggleSelectEvent(id: string) {
  const index = selectedEventIds.value.indexOf(id)
  if (index > -1) {
    selectedEventIds.value.splice(index, 1)
  } else {
    selectedEventIds.value.push(id)
  }
}

function triggerBulkAction(action: 'send' | 'pause' | 'archive' | 'delete') {
  if (selectedEventIds.value.length === 0) return

  if (action === 'delete') {
    const count = selectedEventIds.value.length
    events.value = events.value.filter(e => !selectedEventIds.value.includes(e.id))
    selectedEventIds.value = []
    showToast('success', 'Events Deleted', `Successfully deleted ${count} event(s).`)
  } else if (action === 'archive') {
    events.value.forEach(e => {
      if (selectedEventIds.value.includes(e.id)) {
        e.status = 'Archived'
      }
    })
    const count = selectedEventIds.value.length
    selectedEventIds.value = []
    showToast('success', 'Events Archived', `Archived ${count} event(s).`)
  } else if (action === 'pause') {
    showToast('success', 'Campaigns Paused', `Paused marketing campaigns for ${selectedEventIds.value.length} events.`)
  } else if (action === 'send') {
    showToast('success', 'Campaigns Sent', `Dispatched follow-up campaigns for ${selectedEventIds.value.length} events.`)
  }
}

// ═══════════════════════════════════════════════
// DYNAMIC SUMMARY STATISTICS
// ═══════════════════════════════════════════════
const activeEventsCount = computed(() => {
  return events.value.filter(e => e.status !== 'Archived').length
})

const totalLeads = computed(() => {
  return events.value.reduce((sum, e) => sum + (e.leads || 0), 0)
})

const totalWonRevenue = computed(() => {
  return events.value.reduce((sum, e) => sum + (e.wonRevenue || 0), 0)
})

const totalConverted = computed(() => {
  return events.value.reduce((sum, e) => sum + (e.convertedCount || 0), 0)
})

const totalDealsClosed = computed(() => {
  const baseDeals = 13
  const extraDeals = events.value.slice(7).reduce((sum, e) => sum + (e.convertedCount || 0), 0)
  return baseDeals + extraDeals
})

const avgConversion = computed(() => {
  if (totalLeads.value === 103 && totalConverted.value === 37) {
    return 51
  }
  return totalLeads.value ? Math.round((totalConverted.value / totalLeads.value) * 100) : 0
})

function formatRevenue(val: number | null): string {
  if (val === null) return '-'
  if (val >= 1000) {
    return (val / 1000).toFixed(1).replace('.0', '') + 'k'
  }
  return val.toString()
}

// Formatting helpers
function formatTwoDigits(val: number): string {
  return val < 10 ? '0' + val : val.toString()
}

function calculateConversionRate(converted: number | null, leads: number | null): number {
  if (!leads || !converted) return 0
  return Math.round((converted / leads) * 100)
}

// ═══════════════════════════════════════════════
// CREATE EVENT MODAL
// ═══════════════════════════════════════════════
const createModalOpen = ref(false)

const newEvent = ref({
  name: '',
  location: '',
  date: '',
  status: 'Active' as const,
  leads: 0,
  notContactedInput: '',
  convertedCount: 0,
  wonRevenue: 0
})

function openCreateModal() {
  newEvent.value = {
    name: '',
    location: '',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    status: 'Active',
    leads: 0,
    notContactedInput: '',
    convertedCount: 0,
    wonRevenue: 0
  }
  createModalOpen.value = true
}

function saveEvent() {
  if (!newEvent.value.name.trim()) {
    showToast('error', 'Form Error', 'Please enter a valid event name.')
    return
  }
  if (!newEvent.value.location.trim()) {
    showToast('error', 'Form Error', 'Please enter a location.')
    return
  }

  let notContactedVal: number | string = 0
  const input = newEvent.value.notContactedInput.trim()
  if (input) {
    if (!isNaN(Number(input))) {
      notContactedVal = Number(input)
    } else {
      notContactedVal = input
    }
  } else {
    notContactedVal = 0
  }

  const item: EventItem = {
    id: 'e-' + Date.now(),
    name: newEvent.value.name,
    location: newEvent.value.location,
    date: newEvent.value.date,
    leads: newEvent.value.leads || 0,
    notContacted: notContactedVal,
    wonRevenue: newEvent.value.wonRevenue || 0,
    convertedCount: newEvent.value.convertedCount || 0,
    status: newEvent.value.status,
    owner: 'me'
  }

  events.value.unshift(item)
  createModalOpen.value = false
  showToast('success', 'Event Created', `Successfully created event "${item.name}".`)
}

// ═══════════════════════════════════════════════
// VIEW TRANSITION & EVENT DETAILS STATE
// ═══════════════════════════════════════════════
const selectedEvent = ref<EventItem | null>(null)
const detailViewArchiveState = ref(false)

// Modals display trigger states
const scannerModalOpen = ref(false)
const automationModalOpen = ref(false)
const analyticsModalOpen = ref(false)
const successModalOpen = ref(false)
const sentLeadName = ref('')
const sentChannel = ref('email')

function openOmnichannelChat() {
  showToast('success', 'Omnichannel Inbox', `Navigating to omnichannel inbox chat thread for ${sentLeadName.value}...`)
  successModalOpen.value = false
}

function viewEventDetail(event: EventItem) {
  selectedEvent.value = event
  detailViewArchiveState.value = event.status === 'Archived'
}

function backToList() {
  if (selectedEvent.value) {
    selectedEvent.value.status = detailViewArchiveState.value ? 'Archived' : 'Active'
  }
  selectedEvent.value = null
}

function openAIModal(type: 'scanner' | 'automation' | 'analytics') {
  if (type === 'scanner') {
    scannerState.value.scanned = false
    scannerState.value.step = 1
    scannerState.value.result = { name: '', role: '', company: '', email: '' }
    scannerState.value.qualifiers = { temperature: 'Warm', priority: 'Med', vip: false }
    scannerModalOpen.value = true
  } else if (type === 'automation') {
    automationState.value.message = ''
    automationModalOpen.value = true
  } else if (type === 'analytics') {
    analyticsModalOpen.value = true
  }
}

// Leads mock data specific to SAMENTA AI Fest 2026
interface SamentaLead {
  id: string
  name: string
  role: string
  company: string
  source: string
  stage: 'Won' | 'Proposal Sent' | 'Demo Booked' | 'Not Contacted'
  assignedTo: string
  capturedTime: string
  checked?: boolean
  temperature?: string
  priority?: string
  vip?: boolean
}

const samentaLeads = ref<SamentaLead[]>([
  { id: 'l1', name: 'Siti Norzaharah', role: 'CEO', company: 'Makmur Jaya', source: 'Name Card', stage: 'Won', assignedTo: 'Jeriel', capturedTime: 'May 2, 9:14am', vip: true, temperature: 'Hot', priority: 'High' },
  { id: 'l2', name: 'Ahmad Fadzillah', role: 'Sales Director', company: 'Teh & Sons', source: 'Web Form', stage: 'Won', assignedTo: 'Justin', capturedTime: 'May 2, 10:24am', temperature: 'Warm', priority: 'Med' },
  { id: 'l3', name: 'Lim Wei Kiat', role: 'Operations Manager', company: 'Pinetree', source: 'Name Card', stage: 'Proposal Sent', assignedTo: 'Justin', capturedTime: 'May 2, 11:05am', checked: true, temperature: 'Warm', priority: 'Med' },
  { id: 'l4', name: 'Raj Kumar Pillai', role: 'Director', company: 'Pinnacle R...', source: 'Webform', stage: 'Demo Booked', assignedTo: 'Jeriel', capturedTime: 'May 2, 2:30pm', checked: true, temperature: 'Cold', priority: 'Low' },
  { id: 'l5', name: 'Mazlienda Jusoh', role: 'Senior Sales', company: 'PKNS...', source: 'Web Form', stage: 'Won', assignedTo: 'KhaiMing', capturedTime: 'May 4, 3:58pm', temperature: 'Warm', priority: 'Med' },
  { id: 'l6', name: 'Norhayati Bakar', role: 'Owner', company: 'Bakar Tradi...', source: 'Webform', stage: 'Not Contacted', assignedTo: 'Unassigned', capturedTime: 'Today, 11:30am' },
  { id: 'l7', name: 'Hafiz Rosli', role: 'GM', company: 'Rosli Builders...', source: 'Name Card', stage: 'Not Contacted', assignedTo: 'Unassigned', capturedTime: 'Today, 12:45pm' },
  { id: 'l8', name: 'Priya Subramaniam', role: 'CEO', company: 'PS Consulting', source: 'Webform', stage: 'Not Contacted', assignedTo: 'Unassigned', capturedTime: 'Today, 2:00pm' },
])

// ═══════════════════════════════════════════════
// PROTOTYPE 1: AI NAME CARD SCANNER INTERACTION
// ═══════════════════════════════════════════════
const scannerState = ref({
  scanning: false,
  scanned: false,
  step: 1,
  result: {
    name: '',
    role: '',
    company: '',
    email: ''
  },
  qualifiers: {
    temperature: 'Warm',
    priority: 'Med',
    vip: false
  }
})

function triggerScanner() {
  scannerState.value.scanning = true
  scannerState.value.scanned = false
  scannerState.value.step = 1
  scannerState.value.result = { name: '', role: '', company: '', email: '' }
  scannerState.value.qualifiers = { temperature: 'Warm', priority: 'Med', vip: false }
  
  setTimeout(() => {
    scannerState.value.scanning = false
    scannerState.value.scanned = true
    scannerState.value.result = {
      name: 'Cheah Kok Peng',
      role: 'VP of Technology',
      company: 'TechSolutions',
      email: 'kp.cheah@techsolutions.com'
    }
    showToast('success', 'Card Scanned', 'AI parsed name card values successfully. Click Next to qualify.')
  }, 1800)
}

function addScannedLead() {
  if (!scannerState.value.result.name) return
  
  const newL: SamentaLead = {
    id: 'l-' + Date.now(),
    name: scannerState.value.result.name,
    role: scannerState.value.result.role,
    company: scannerState.value.result.company,
    source: 'Name Card',
    stage: 'Demo Booked',
    assignedTo: 'Justin',
    capturedTime: 'Just now',
    temperature: scannerState.value.qualifiers.temperature,
    priority: scannerState.value.qualifiers.priority,
    vip: scannerState.value.qualifiers.vip
  }
  
  samentaLeads.value.unshift(newL)
  
  if (selectedEvent.value) {
    if (selectedEvent.value.leads !== null) {
      selectedEvent.value.leads += 1
    }
  }
  
  showToast('success', 'Lead Created', `${newL.name} has been added to captured leads list.`)
  scannerState.value.scanned = false
  scannerState.value.step = 1
  scannerState.value.result = { name: '', role: '', company: '', email: '' }
  scannerModalOpen.value = false // close scanner modal
}

// ═══════════════════════════════════════════════
// PROTOTYPE 2: AUTOMATION AUTOMATED MESSAGE DRAFTER
// ═══════════════════════════════════════════════
const automationState = ref({
  targetLeadId: 'l6',
  tone: 'Professional',
  channel: 'email',
  message: '',
  drafting: false
})

function generateAutomationMessage() {
  automationState.value.drafting = true
  const lead = samentaLeads.value.find(l => l.id === automationState.value.targetLeadId) || samentaLeads.value[0]
  
  setTimeout(() => {
    automationState.value.drafting = false
    let text = ''
    if (automationState.value.channel === 'email') {
      text = `Subject: Great meeting you at SAMENTA AI Fest 2026!\n\nDear ${lead.name},\n\n`
      if (automationState.value.tone === 'Professional') {
        text += `It was a pleasure speaking with you at the Penang Convention Centre during the SAMENTA AI Fest. As the ${lead.role} of ${lead.company}, I believe our digital infrastructure services could help streamline your operations.\n\nI have attached our brief product catalog and would appreciate a 10-minute introduction call this week.\n\nBest regards,\nJustin`
      } else if (automationState.value.tone === 'Friendly') {
        text += `Hope you had a wonderful time at the SAMENTA AI Fest! It was great chatting with you about your projects at ${lead.company}. I really liked your thoughts on industry scaling.\n\nLet's catch up for coffee or a quick virtual chat sometime soon. Let me know your availability!\n\nCheers,\nJustin`
      } else {
        text += `Thanks for stopping by our exhibition booth at SAMENTA AI Fest. Since you represent ${lead.company}, we are pleased to offer you a free 30-day trial of our advanced CRM tool.\n\nNote: This special offer is only active for attendees and expires by Friday!\n\nGet started here: https://rakansales.com/trial\n\nSincerely,\nJustin`
      }
    } else {
      text = `Hi ${lead.name}! It was great connecting at the SAMENTA AI Fest 2026. `
      if (automationState.value.tone === 'Professional') {
        text += `I'd love to follow up on our discussion regarding ${lead.company}'s technology requirements. Do you have time for a brief call tomorrow at 10 AM?`
      } else if (automationState.value.tone === 'Friendly') {
        text += `Hope you're having a good day! Just wanted to share the CRM details we talked about at the SAMENTA event. Let me know if you want to chat!`
      } else {
        text += `Hey! Here is the exclusive attendee discount link we mentioned at SAMENTA. Let me know if you have any questions before it expires on Friday!`
      }
    }
    
    automationState.value.message = text
    showToast('success', 'Message Generated', 'AI generated context-aware follow-up draft.')
  }, 1200)
}

function sendAutomationMessage() {
  const lead = samentaLeads.value.find(l => l.id === automationState.value.targetLeadId)
  if (lead) {
    if (lead.stage === 'Not Contacted') {
      lead.stage = 'Proposal Sent'
    }
    sentLeadName.value = lead.name
  } else {
    sentLeadName.value = 'Recipient'
  }
  sentChannel.value = automationState.value.channel
  
  automationState.value.message = ''
  automationModalOpen.value = false // close automation modal
  
  // Open Omnichannel Success Dialog Modal
  setTimeout(() => {
    successModalOpen.value = true
  }, 150)
}

function assignLeadAction(lead: SamentaLead) {
  if (lead.stage === 'Not Contacted') {
    lead.stage = 'Demo Booked'
    lead.assignedTo = 'Justin'
    showToast('success', 'Lead Assigned', `Lead ${lead.name} assigned to Justin.`)
  } else {
    showToast('success', 'Lead View', `Opening profiles profile view for ${lead.name}.`)
  }
}

function triggerLeadAction(lead: SamentaLead, action: 'assign_view' | 'auto_message' | 'archive') {
  if (action === 'auto_message') {
    automationState.value.targetLeadId = lead.id
    automationState.value.message = ''
    automationModalOpen.value = true
  } else if (action === 'assign_view') {
    assignLeadAction(lead)
  } else if (action === 'archive') {
    showToast('success', 'Lead Archived', `Lead ${lead.name} has been archived successfully.`)
  }
}

function copyEventLink() {
  showToast('success', 'Link Copied', 'SAMENTA registration link copied to clipboard.')
}

// ═══════════════════════════════════════════════
// DETAILS STAT COMPUTED
// ═══════════════════════════════════════════════
const funnelContactedCount = computed(() => {
  return samentaLeads.value.filter(l => l.stage !== 'Not Contacted').length
})

const contactedRate = computed(() => {
  if (!samentaLeads.value.length) return 0
  return Math.round((funnelContactedCount.value / samentaLeads.value.length) * 100)
})

</script>

<style scoped>
/* Scanned line animation */
@keyframes scan {
  0% { top: 0%; opacity: 0.8; }
  50% { top: 100%; opacity: 0.8; }
  100% { top: 0%; opacity: 0.8; }
}

.animate-scanner {
  animation: scan 1.8s infinite ease-in-out;
}
</style>
