<template>
  <div class="space-y-6">
    <!-- ═══════════════════════════════════════════════════════════════
         MODE 1: ASSISTANTS LIST VIEW
    ════════════════════════════════════════════════════════════════ -->
    <div v-if="viewMode === 'list'" class="space-y-6 animate-fade-in">
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-xl font-bold text-gray-900 tracking-tight">AI Assistants</h1>
          </div>
          <p class="text-xs text-gray-500 mt-1 max-w-2xl leading-relaxed">
            Deploy AI agents for WhatsApp support and sales qualification with isolated knowledge and routing.
          </p>
        </div>
        <div class="flex items-center gap-2.5 shrink-0">
          <button
            @click="showGuideModal = true"
            class="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-xs rounded-xl cursor-pointer shadow-2xs transition-colors"
          >
            <HelpCircle class="w-4 h-4 text-gray-500" />
            Guide & Playbook
          </button>
          <button
            @click="openCreateModal"
            class="inline-flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-[#1ea446] text-white font-semibold text-xs rounded-xl cursor-pointer shadow-xs transition-colors"
          >
            <Plus class="w-3.5 h-3.5 stroke-[2.5]" />
            New Assistant
          </button>
        </div>
      </div>

      <!-- Summary strip -->
      <div class="grid grid-cols-1 sm:grid-cols-3 bg-white border border-gray-200 rounded-2xl shadow-2xs divide-y sm:divide-y-0 sm:divide-x divide-gray-100 overflow-hidden">
        <div class="px-6 py-4">
          <div class="text-xs font-medium text-gray-600">Live assistants</div>
          <div class="mt-1 flex items-baseline gap-2">
            <span class="text-2xl font-bold text-gray-900 leading-none tabular-nums">{{ liveCount }}</span>
            <span class="text-xs text-gray-500">of {{ assistants.length }}</span>
          </div>
          <div class="mt-1.5 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            2 channels connected
          </div>
        </div>
        <div class="px-6 py-4">
          <div class="text-xs font-medium text-gray-600">Qualified leads</div>
          <div class="mt-1 flex items-baseline gap-2">
            <span class="text-2xl font-bold text-gray-900 leading-none tabular-nums">142</span>
            <span class="text-xs font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-md">+18.4%</span>
          </div>
          <div class="mt-1.5 text-xs text-gray-500">Synced to Deals pipeline</div>
        </div>
        <div class="px-6 py-4">
          <div class="text-xs font-medium text-gray-600">Auto-resolution</div>
          <div class="mt-1 flex items-baseline gap-2">
            <span class="text-2xl font-bold text-gray-900 leading-none tabular-nums">86.4%</span>
            <span class="text-xs text-gray-500">1,280 chats</span>
          </div>
          <div class="mt-1.5 text-xs text-gray-500">13.6% escalated to reps</div>
        </div>
      </div>

      <!-- Search & Status Filter Row -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div class="relative w-full sm:w-80">
          <Search class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name, role, or channel..."
            class="w-full pl-10 pr-9 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary shadow-2xs transition-all"
          />
          <button
            v-if="searchQuery"
            @click="searchQuery = ''"
            class="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-gray-500 hover:text-gray-600 rounded-full cursor-pointer"
            title="Clear search"
          >
            <X class="w-3.5 h-3.5" />
          </button>
        </div>

        <div class="flex items-center gap-1.5 self-start sm:self-auto bg-gray-100/70 p-1 rounded-xl border border-gray-200/60">
          <button
            @click="statusFilter = 'all'"
            class="px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5"
            :class="statusFilter === 'all' ? 'bg-white text-primary shadow-2xs font-bold' : 'text-gray-600 hover:text-gray-900'"
          >
            <span>All</span>
            <span class="text-[10px] px-1.5 py-0.2 rounded-full" :class="statusFilter === 'all' ? 'bg-primary/10 text-primary' : 'bg-gray-200/80 text-gray-500'">
              {{ assistants.length }}
            </span>
          </button>
          <button
            @click="statusFilter = 'live'"
            class="px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5"
            :class="statusFilter === 'live' ? 'bg-white text-primary shadow-2xs font-bold' : 'text-gray-600 hover:text-gray-900'"
          >
            <span>Live</span>
            <span class="text-[10px] px-1.5 py-0.2 rounded-full" :class="statusFilter === 'live' ? 'bg-primary/10 text-primary' : 'bg-gray-200/80 text-gray-500'">
              {{ liveCount }}
            </span>
          </button>
          <button
            @click="statusFilter = 'draft'"
            class="px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5"
            :class="statusFilter === 'draft' ? 'bg-white text-primary shadow-2xs font-bold' : 'text-gray-600 hover:text-gray-900'"
          >
            <span>Draft</span>
            <span class="text-[10px] px-1.5 py-0.2 rounded-full" :class="statusFilter === 'draft' ? 'bg-primary/10 text-primary' : 'bg-gray-200/80 text-gray-500'">
              {{ draftCount }}
            </span>
          </button>
        </div>
      </div>

      <!-- Assistants List Cards -->
      <div v-if="filteredAssistants.length > 0" class="space-y-3">
        <div
          v-for="ast in filteredAssistants"
          :key="ast.id"
          @click="openAssistantDetail(ast)"
          class="bg-white border border-gray-200 hover:border-primary/60 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div class="flex items-center gap-4 min-w-0">
            <div class="w-11 h-11 rounded-xl bg-primary flex items-center justify-center text-white shrink-0 shadow-sm">
              <Bot class="w-5 h-5" />
            </div>

            <div class="min-w-0 space-y-1">
              <div class="flex flex-wrap items-center gap-2.5">
                <span class="font-bold text-sm text-gray-900 group-hover:text-primary transition-colors truncate">
                  {{ ast.name }}
                </span>
                <span
                  class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold"
                  :class="getStatusBadgeClass(ast.status)"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="ast.status === 'live' ? 'bg-emerald-500' : 'bg-slate-400'"></span>
                  {{ ast.status === 'live' ? 'Live' : 'Draft' }}
                </span>
              </div>

              <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
                <span class="inline-flex items-center gap-1.5">
                  <Phone class="w-3.5 h-3.5 text-emerald-600" />
                  {{ ast.connectedPhone }}
                </span>
                <span class="inline-flex items-center gap-1.5">
                  <BookOpen class="w-3.5 h-3.5 text-sky-600" />
                  {{ ast.docsCount }} knowledge docs
                </span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-3 self-end md:self-auto shrink-0" @click.stop>
            <div class="text-right hidden sm:block">
              <div class="text-sm font-bold text-gray-900 tabular-nums">{{ ast.resolutionRate }}</div>
              <div class="text-[11px] text-gray-500">auto-resolved</div>
            </div>

            <button
              @click.stop="openTestDrawer(ast)"
              class="px-3 py-1.5 bg-primary hover:bg-[#1ea446] text-white font-semibold text-xs rounded-xl cursor-pointer shadow-xs transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
            >
              <Play class="w-3.5 h-3.5 fill-current" />
              Test chat
            </button>

            <!-- Three-dots Menu -->
            <div class="relative">
              <button
                @click.stop="toggleMenu(ast.id)"
                class="p-2 hover:bg-gray-100 text-gray-500 hover:text-gray-800 rounded-xl cursor-pointer transition-colors"
                title="Options"
              >
                <MoreVertical class="w-4 h-4" />
              </button>

              <div
                v-if="openMenuId === ast.id"
                class="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-30 animate-fade-in"
              >
                <button
                  @click="openAssistantDetail(ast); openMenuId = null"
                  class="w-full text-left px-3.5 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer font-medium"
                >
                  <Pencil class="w-3.5 h-3.5 text-gray-500" /> Edit configuration
                </button>
                <button
                  @click="openTestDrawer(ast); openMenuId = null"
                  class="w-full text-left px-3.5 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer font-medium"
                >
                  <MessageSquare class="w-3.5 h-3.5 text-emerald-600" /> Test conversations
                </button>
                <button
                  @click="requestStatusToggle(ast); openMenuId = null"
                  class="w-full text-left px-3.5 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer font-medium"
                >
                  <CheckCircle2 class="w-3.5 h-3.5 text-gray-500" />
                  {{ ast.status === 'live' ? 'Switch to draft' : 'Pre-flight & publish' }}
                </button>
                <button
                  @click="duplicateAssistant(ast); openMenuId = null"
                  class="w-full text-left px-3.5 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer font-medium"
                >
                  <Copy class="w-3.5 h-3.5 text-gray-500" /> Duplicate
                </button>
                <div class="border-t border-gray-100 my-1"></div>
                <button
                  @click="promptDeleteAssistant(ast); openMenuId = null"
                  class="w-full text-left px-3.5 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer font-medium"
                >
                  <Trash2 class="w-3.5 h-3.5 text-red-500" /> Delete assistant
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Zero Search Results Empty State -->
      <div v-else class="bg-white border border-gray-200 rounded-2xl p-12 text-center space-y-3 shadow-2xs">
        <div class="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-500 mx-auto">
          <Search class="w-6 h-6" />
        </div>
        <h3 class="text-sm font-bold text-gray-900">No assistants match "{{ searchQuery }}"</h3>
        <p class="text-xs text-gray-500 max-w-sm mx-auto">
          Try adjusting your search terms or filter by status above.
        </p>
        <button
          @click="searchQuery = ''; statusFilter = 'all'"
          class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl cursor-pointer transition-colors"
        >
          Clear filters
        </button>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════
         MODE 2: ASSISTANT DETAIL / INNER WORKSPACE
    ════════════════════════════════════════════════════════════════ -->
    <div v-else-if="viewMode === 'detail' && currentAssistant" class="space-y-6 animate-fade-in">
      <!-- Detail Top Header Bar with Live Indicator & Test CTA -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-4">
        <div class="flex items-center gap-3 min-w-0">
          <button
            @click="backToList"
            class="p-2 hover:bg-gray-100 text-gray-500 hover:text-gray-900 rounded-xl cursor-pointer transition-colors shrink-0"
            title="Back to AI Assistants list"
          >
            <ArrowLeft class="w-4 h-4" />
          </button>
          <div class="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shrink-0 shadow-sm">
            <Bot class="w-5 h-5" />
          </div>
          <div class="min-w-0">
            <h2 class="text-base font-bold text-gray-900 tracking-tight truncate">{{ currentAssistant.name }}</h2>
            <div class="text-[11px] text-gray-500 font-medium mt-0.5 truncate">
              Fallback: {{ currentAssistant.fallbackRep }}
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2.5 shrink-0 flex-nowrap">
          <!-- In-Situ Test Simulator CTA -->
          <button
            @click="openTestDrawer(currentAssistant)"
            class="px-3.5 py-2 bg-primary hover:bg-[#1ea446] text-white text-xs font-semibold rounded-xl cursor-pointer shadow-xs transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <MessageSquare class="w-3.5 h-3.5 shrink-0" />
            <span>Test Live Conversations</span>
          </button>
          <button
            @click="requestStatusToggle(currentAssistant)"
            class="px-3.5 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-xl cursor-pointer shadow-2xs transition-colors whitespace-nowrap shrink-0"
          >
            <span>{{ currentAssistant.status === 'live' ? 'Switch to Draft' : 'Pre-flight & Publish' }}</span>
          </button>
        </div>
      </div>

      <!-- Inner High-Efficiency 3-Tab Workspace -->
      <div class="flex flex-col lg:flex-row gap-6 items-start">
        <!-- Inner Sub-Navigation (Grouped by Configuration vs Evaluation) -->
        <div class="w-full lg:w-56 shrink-0 bg-white border border-gray-200 rounded-2xl p-2 shadow-2xs space-y-1 select-none">
          <div class="px-3 pt-2 pb-1 text-[11px] font-semibold text-gray-500">
            Configuration
          </div>

          <!-- Tab 1: Identity -->
          <button
            @click="activeDetailTab = 'identity'"
            class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors text-left"
            :class="getSetupTabClass('identity')"
          >
            <div class="flex items-center gap-2.5">
              <User class="w-4 h-4" :class="activeDetailTab === 'identity' ? 'text-white' : 'text-violet-500'" />
              <span>Identity</span>
            </div>
          </button>

          <!-- Tab 2: Knowledge -->
          <button
            @click="activeDetailTab = 'knowledge'"
            class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors text-left"
            :class="getSetupTabClass('knowledge')"
          >
            <div class="flex items-center gap-2.5">
              <BookOpen class="w-4 h-4" :class="activeDetailTab === 'knowledge' ? 'text-white' : 'text-sky-500'" />
              <span>Knowledge</span>
            </div>
            <span class="text-[10px] bg-gray-100 text-gray-700 font-bold px-1.5 py-0.5 rounded-full tabular-nums">
              {{ knowledgeDocs.length }}
            </span>
          </button>

          <!-- Tab 3: Behavior -->
          <button
            @click="activeDetailTab = 'behavior'"
            class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors text-left"
            :class="getSetupTabClass('behavior')"
          >
            <div class="flex items-center gap-2.5">
              <Shield class="w-4 h-4" :class="activeDetailTab === 'behavior' ? 'text-white' : 'text-rose-500'" />
              <span>Behavior</span>
            </div>
            <span class="text-[10px] bg-gray-100 text-gray-700 font-bold px-1.5 py-0.5 rounded-full tabular-nums">
              {{ guardrailRules.length + scenarioRules.length }}
            </span>
          </button>

          <!-- Tab 4: Tools -->
          <button
            @click="activeDetailTab = 'tools'"
            class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors text-left"
            :class="getSetupTabClass('tools')"
          >
            <div class="flex items-center gap-2.5">
              <Wrench class="w-4 h-4" :class="activeDetailTab === 'tools' ? 'text-white' : 'text-amber-500'" />
              <span>Tools</span>
            </div>
            <span class="text-[10px] bg-gray-100 text-gray-700 font-bold px-1.5 py-0.5 rounded-full tabular-nums">
              {{ customTools.length }}
            </span>
          </button>

          <!-- Tab 6: Connect -->
          <button
            @click="activeDetailTab = 'connect'"
            class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors text-left"
            :class="getSetupTabClass('connect')"
          >
            <div class="flex items-center gap-2.5">
              <Zap class="w-4 h-4" :class="activeDetailTab === 'connect' || activeDetailTab === 'channels' ? 'text-white' : 'text-emerald-500'" />
              <span>Connect</span>
            </div>
            <span class="text-[10px] bg-gray-100 text-gray-700 font-bold px-1.5 py-0.5 rounded-full tabular-nums">
              {{ connectedInboxes.length }}
            </span>
          </button>

          <div class="pt-3 pb-1 px-3 text-[11px] font-semibold text-gray-500 border-t border-gray-100 mt-2">
            Test & Monitor
          </div>

          <!-- Tab 5: Playground -->
          <button
            @click="activeDetailTab = 'playground'"
            class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors text-left"
            :class="getSetupTabClass('playground')"
          >
            <div class="flex items-center gap-2.5">
              <Play class="w-4 h-4" :class="activeDetailTab === 'playground' ? 'text-white' : 'text-indigo-500'" />
              <span>Playground</span>
            </div>
          </button>

          <!-- Tab 7: Report -->
          <button
            @click="activeDetailTab = 'report'"
            class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors text-left"
            :class="getSetupTabClass('report')"
          >
            <div class="flex items-center gap-2.5">
              <BarChart2 class="w-4 h-4" :class="activeDetailTab === 'report' ? 'text-white' : 'text-teal-500'" />
              <span>Report</span>
            </div>
          </button>
        </div>

        <!-- Detail Main Content Area -->
        <div class="flex-1 w-full space-y-6">

          <!-- ══════════════ TAB 1: IDENTITY & SALES PERSONA ══════════════ -->
          <div v-if="activeDetailTab === 'identity'" class="space-y-6 animate-fade-in">
            <!-- Card 1: Basic Identity & Sales Persona -->
            <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-2xs space-y-5">
              <div class="space-y-1">
                <h3 class="text-sm font-bold text-gray-900">Identity & Persona</h3>
                <p class="text-xs text-gray-500">Configure how the assistant introduces itself, frames answers, and communicates.</p>
              </div>

              <!-- Form Inputs -->
              <div class="space-y-4 pt-1">
                <!-- Row 1: Name & Product Name -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="space-y-1.5">
                    <label class="block text-xs font-semibold text-gray-700">Assistant Name</label>
                    <input
                      v-model="editForm.name"
                      type="text"
                      class="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary shadow-2xs transition-all"
                    />
                  </div>
                  <div class="space-y-1.5">
                    <label class="block text-xs font-semibold text-gray-700">Supported Product / Service</label>
                    <input
                      v-model="editForm.productName"
                      type="text"
                      class="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary shadow-2xs transition-all"
                    />
                  </div>
                </div>

                <!-- Row 2: Tone of Voice & Sales Objective -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="space-y-1.5">
                    <label class="block text-xs font-semibold text-gray-700">Tone of Voice</label>
                    <select
                      v-model="editForm.tone"
                      class="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary shadow-2xs cursor-pointer"
                    >
                      <option value="Consultative & Helpful">Consultative & Helpful (Recommended for B2B)</option>
                      <option value="Energetic & Friendly">Energetic & Friendly (Best for WhatsApp E-Commerce)</option>
                      <option value="Direct & Technical">Direct & Technical (SOP & Specification focus)</option>
                    </select>
                  </div>
                  <div class="space-y-1.5">
                    <label class="block text-xs font-semibold text-gray-700">Primary Commercial Goal</label>
                    <select
                      v-model="editForm.commercialGoal"
                      class="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary shadow-2xs cursor-pointer"
                    >
                      <option value="Qualify Leads & Book Demo">Qualify Inbound Leads & Book Sales Demo</option>
                      <option value="Answer Inquiries & Send Quotation">Answer Technical Inquiries & Offer Pricing</option>
                      <option value="Customer Support & Issue Resolution">Resolve Post-Sales Tickets & Support</option>
                    </select>
                  </div>
                </div>

                <!-- Row 3: Description -->
                <div class="space-y-1.5">
                  <label class="block text-xs font-semibold text-gray-700">Internal Description / Scope</label>
                  <div class="relative">
                    <textarea
                      v-model="editForm.description"
                      rows="2"
                      maxlength="300"
                      class="w-full px-3.5 py-2.5 pb-6 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary shadow-2xs resize-none transition-all"
                    ></textarea>
                    <span class="absolute right-3 bottom-2 text-[10px] text-gray-500 font-mono">
                      {{ editForm.description.length }} / 300
                    </span>
                  </div>
                </div>

                <!-- Row 4: Identity Response -->
                <div class="space-y-1.5">
                  <label class="block text-xs font-semibold text-gray-700">AI Identity Disclosure Statement</label>
                  <input
                    v-model="editForm.identityResponse"
                    type="text"
                    placeholder="e.g. Hi! I am Golden Harvest F&B AI, here to assist with wholesale foodservice orders and dairy price lists."
                    class="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary shadow-2xs transition-all"
                  />
                  <p class="text-[11px] text-gray-500 italic">
                    Default response: <span class="text-gray-700 font-normal">"I am {{ editForm.name || 'an AI Assistant' }} from {{ editForm.productName || 'the team' }}."</span>
                  </p>
                </div>
              </div>

              <!-- Card Actions -->
              <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
                <button
                  @click="resetIdentityForm"
                  class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl cursor-pointer transition-colors"
                >
                  Discard
                </button>
                <button
                  @click="saveIdentityChanges"
                  class="px-5 py-2 bg-primary hover:bg-[#1ea446] text-white font-semibold text-xs rounded-xl cursor-pointer shadow-xs transition-colors"
                >
                  Save changes
                </button>
              </div>
            </div>

            <!-- Card 2: CRM Memory & Feedback Features -->
            <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-2xs space-y-5">
              <div class="space-y-1">
                <h3 class="text-sm font-bold text-gray-900">CRM Memory & Intelligence</h3>
                <p class="text-xs text-gray-500">Autonomous capture of lead facts, preferences, and recurring FAQ drafts.</p>
              </div>

              <!-- Switch Rows -->
              <div class="space-y-4 divide-y divide-gray-100 pt-1">
                <!-- Switch 1: FAQs -->
                <div class="flex items-start justify-between gap-4 pt-3 first:pt-0">
                  <div class="space-y-0.5">
                    <div class="text-xs font-bold text-gray-900">Turn resolved conversations into FAQs</div>
                    <div class="text-[11px] text-gray-500 leading-relaxed max-w-xl">
                      Drafts a verified FAQ card when similar customer questions repeat 3+ times. Requires your approval before going live.
                    </div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    :aria-checked="editForm.features.faqGeneration"
                    @click="editForm.features.faqGeneration = !editForm.features.faqGeneration"
                    class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                    :class="editForm.features.faqGeneration ? 'bg-primary' : 'bg-gray-200'"
                  >
                    <span
                      class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                      :class="editForm.features.faqGeneration ? 'translate-x-4' : 'translate-x-0'"
                    ></span>
                  </button>
                </div>

                <!-- Switch 2: Memory -->
                <div class="flex items-start justify-between gap-4 pt-4">
                  <div class="space-y-0.5">
                    <div class="text-xs font-bold text-gray-900">Remember customer details & preferences (PDPA Compliant)</div>
                    <div class="text-[11px] text-gray-500 leading-relaxed max-w-xl">
                      Extracts company size, budget tier, and preferred language directly to the Contact Drawer in RakanSales CRM.
                    </div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    :aria-checked="editForm.features.rememberDetails"
                    @click="editForm.features.rememberDetails = !editForm.features.rememberDetails"
                    class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                    :class="editForm.features.rememberDetails ? 'bg-primary' : 'bg-gray-200'"
                  >
                    <span
                      class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                      :class="editForm.features.rememberDetails ? 'translate-x-4' : 'translate-x-0'"
                    ></span>
                  </button>
                </div>

                <!-- Switch 3: Source citations -->
                <div class="flex items-start justify-between gap-4 pt-4">
                  <div class="space-y-0.5">
                    <div class="text-xs font-bold text-gray-900">Include source document citations</div>
                    <div class="text-[11px] text-gray-500 leading-relaxed max-w-xl">
                      Appends a source citation under responses (e.g. *Source: 2026 Pricing Guide.pdf*). Essential for internal sales teams; recommended off on WhatsApp.
                    </div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    :aria-checked="editForm.features.sourceCitations"
                    @click="editForm.features.sourceCitations = !editForm.features.sourceCitations"
                    class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                    :class="editForm.features.sourceCitations ? 'bg-primary' : 'bg-gray-200'"
                  >
                    <span
                      class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                      :class="editForm.features.sourceCitations ? 'translate-x-4' : 'translate-x-0'"
                    ></span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- ══════════════ TAB 2: BEHAVIOR & RULES ══════════════ -->
          <div v-else-if="activeDetailTab === 'behavior'" class="space-y-6 animate-fade-in">
            <!-- Sub-tab Navigation Bar -->
            <div class="bg-white border border-gray-200 rounded-2xl p-1.5 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div class="flex items-center gap-1.5 flex-wrap">
                <button
                  @click="activeBehaviorSubTab = 'guardrails'"
                  class="px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center gap-2"
                  :class="getBehaviorSubTabClass('guardrails')"
                >
                  <Shield class="w-3.5 h-3.5" />
                  <span>Guardrails</span>
                  <span class="px-1.5 py-0.2 rounded-full text-[10px] font-bold" :class="getBehaviorBadgeClass('guardrails')">
                    {{ guardrailRules.length }}
                  </span>
                </button>

                <button
                  @click="activeBehaviorSubTab = 'scenarios'"
                  class="px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center gap-2"
                  :class="getBehaviorSubTabClass('scenarios')"
                >
                  <LayoutGrid class="w-3.5 h-3.5" />
                  <span>Scenarios & SOPs</span>
                  <span class="px-1.5 py-0.2 rounded-full text-[10px] font-bold" :class="getBehaviorBadgeClass('scenarios')">
                    {{ scenarioRules.length }}
                  </span>
                </button>

                <button
                  @click="activeBehaviorSubTab = 'guidelines'"
                  class="px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center gap-2"
                  :class="getBehaviorSubTabClass('guidelines')"
                >
                  <Sparkles class="w-3.5 h-3.5" />
                  <span>Response Guidelines</span>
                  <span class="px-1.5 py-0.2 rounded-full text-[10px] font-bold" :class="getBehaviorBadgeClass('guidelines')">
                    {{ guidelineRules.length }}
                  </span>
                </button>

                <button
                  @click="activeBehaviorSubTab = 'handoff'"
                  class="px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center gap-2"
                  :class="getBehaviorSubTabClass('handoff')"
                >
                  <Sliders class="w-3.5 h-3.5" />
                  <span>Handoff & Engine Settings</span>
                </button>
              </div>

              <!-- Action button for active sub-tab -->
              <div class="pr-1.5 flex items-center gap-2">
                <button
                  v-if="activeBehaviorSubTab === 'guardrails'"
                  @click="showAddGuardrailModal = true"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-[#1ea446] text-white font-semibold text-xs rounded-xl cursor-pointer shadow-xs transition-colors"
                >
                  <Plus class="w-3.5 h-3.5" /> Add Guardrail
                </button>
                <button
                  v-else-if="activeBehaviorSubTab === 'scenarios'"
                  @click="showAddScenarioModal = true"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-[#1ea446] text-white font-semibold text-xs rounded-xl cursor-pointer shadow-xs transition-colors"
                >
                  <Plus class="w-3.5 h-3.5" /> Add Scenario
                </button>
                <button
                  v-else-if="activeBehaviorSubTab === 'guidelines'"
                  @click="showAddGuidelineModal = true"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-[#1ea446] text-white font-semibold text-xs rounded-xl cursor-pointer shadow-xs transition-colors"
                >
                  <Plus class="w-3.5 h-3.5" /> Add Guideline
                </button>
              </div>
            </div>

            <!-- ─── SUB-TAB 1: GUARDRAILS ─── -->
            <div v-if="activeBehaviorSubTab === 'guardrails'" class="space-y-6">
              <!-- Description Header Card -->
              <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-2xs space-y-4">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div class="space-y-1">
                    <h3 class="text-sm font-bold text-gray-900">Safety Guardrails</h3>
                    <p class="text-xs text-gray-500">
                      Prevent unauthorized discounts, enforce Halal compliance, and protect customer privacy.
                    </p>
                  </div>
                  <button
                    @click="showGuardrailExamples = !showGuardrailExamples"
                    class="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer self-start sm:self-auto"
                  >
                    <span>{{ showGuardrailExamples ? 'Hide Examples' : 'Show Example Presets' }}</span>
                    <component :is="showGuardrailExamples ? ChevronUp : ChevronDown" class="w-3.5 h-3.5" />
                  </button>
                </div>

                <!-- Collapsible Example Presets Card -->
                <div v-if="showGuardrailExamples" class="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                  <div class="flex items-center justify-between">
                    <div class="text-xs font-bold text-gray-800 flex items-center gap-2">
                      <Sparkles class="w-3.5 h-3.5 text-emerald-600" />
                      Recommended B2B Presets
                    </div>
                    <button
                      @click="adoptAllExampleGuardrails"
                      class="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
                    >
                      Adopt All (3)
                    </button>
                  </div>

                  <div class="space-y-2">
                    <div class="p-3 bg-white border border-gray-200 rounded-lg flex items-center justify-between gap-3">
                      <div class="min-w-0">
                        <div class="text-xs font-medium text-gray-800">
                          Block queries that share or request sensitive personal information (phone numbers, passwords, bank OTPs).
                        </div>
                        <div class="text-[10px] text-gray-500 mt-0.5">Category: Safety & PII • Action: Block & Deflect</div>
                      </div>
                      <button
                        @click="adoptExampleGuardrail({ name: 'Block queries that request sensitive financial credentials', category: 'Safety & PII', action: 'Block & Deflect', description: 'Block queries that share or request passwords, bank accounts, or OTPs.' })"
                        class="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 hover:text-emerald-900 text-xs font-semibold rounded-lg cursor-pointer shrink-0 transition-colors"
                      >
                        Adopt this
                      </button>
                    </div>

                    <div class="p-3 bg-white border border-gray-200 rounded-lg flex items-center justify-between gap-3">
                      <div class="min-w-0">
                        <div class="text-xs font-medium text-gray-800">
                          Reject queries that include offensive, discriminatory, or competitor-disparaging language.
                        </div>
                        <div class="text-[10px] text-gray-500 mt-0.5">Category: Scope & Conduct • Action: Block & Deflect</div>
                      </div>
                      <button
                        @click="adoptExampleGuardrail({ name: 'Reject abusive, discriminatory or threatening language', category: 'Scope & Conduct', action: 'Block & Deflect', description: 'Reject queries that include offensive or aggressive language.' })"
                        class="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 hover:text-emerald-900 text-xs font-semibold rounded-lg cursor-pointer shrink-0 transition-colors"
                      >
                        Adopt this
                      </button>
                    </div>

                    <div class="p-3 bg-white border border-gray-200 rounded-lg flex items-center justify-between gap-3">
                      <div class="min-w-0">
                        <div class="text-xs font-medium text-gray-800">
                          Deflect when the assistant is asked for legal guarantees or medical/dietary health diagnoses.
                        </div>
                        <div class="text-[10px] text-gray-500 mt-0.5">Category: Compliance & Halal • Action: Block & Deflect</div>
                      </div>
                      <button
                        @click="adoptExampleGuardrail({ name: 'Deflect legal claims or medical diagnosis queries', category: 'Compliance & Halal', action: 'Block & Deflect', description: 'Deflect when the assistant is asked for formal legal claims or medical diagnosis.' })"
                        class="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 hover:text-emerald-900 text-xs font-semibold rounded-lg cursor-pointer shrink-0 transition-colors"
                      >
                        Adopt this
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Active Guardrails Table Card -->
                <div class="pt-2">
                  <div class="flex items-center justify-between gap-3 pb-3 border-b border-gray-100">
                    <div class="flex items-center gap-2">
                      <h4 class="text-xs font-bold text-gray-900">Enforced Rules</h4>
                      <span class="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                        {{ filteredGuardrails.length }} Active
                      </span>
                    </div>

                    <div class="relative w-48 sm:w-64">
                      <Search class="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        v-model="guardrailSearchQuery"
                        type="text"
                        placeholder="Search guardrails..."
                        class="w-full pl-8 pr-3 py-1.5 bg-gray-50 hover:bg-white focus:bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs transition-all"
                      />
                    </div>
                  </div>

                  <!-- Guardrails Rows -->
                  <div v-if="filteredGuardrails.length > 0" class="divide-y divide-gray-100">
                    <div
                      v-for="rule in filteredGuardrails"
                      :key="rule.id"
                      class="py-3.5 flex items-start justify-between gap-4 group"
                    >
                      <div class="flex items-start gap-3 min-w-0">
                        <div class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100/80 mt-0.5">
                          <Shield class="w-4 h-4" />
                        </div>
                        <div class="space-y-1 min-w-0">
                          <div class="flex flex-wrap items-center gap-2">
                            <span class="text-xs font-bold text-gray-900 group-hover:text-primary transition-colors">
                              {{ rule.name }}
                            </span>
                            <span class="px-2 py-0.5 rounded-full text-[9px] font-bold" :class="getGuardrailCategoryBadge(rule.category)">
                              {{ rule.category }}
                            </span>
                            <span class="px-2 py-0.5 rounded-md text-[9px] font-bold bg-gray-100 text-gray-700">
                              {{ rule.action }}
                            </span>
                          </div>
                          <p class="text-xs text-gray-600 leading-relaxed">
                            {{ rule.description }}
                          </p>
                          <div class="text-[10px] text-gray-500 flex items-center gap-1.5 font-mono">
                            <CheckCircle2 class="w-3 h-3 text-emerald-500" />
                            <span>{{ rule.triggersCount }} triggers handled</span>
                          </div>
                        </div>
                      </div>

                      <div class="flex items-center gap-3 shrink-0 pt-0.5">
                        <button
                          type="button"
                          role="switch"
                          :aria-checked="rule.enabled"
                          @click="rule.enabled = !rule.enabled"
                          class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                          :class="rule.enabled ? 'bg-primary' : 'bg-gray-200'"
                        >
                          <span
                            class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                            :class="rule.enabled ? 'translate-x-4' : 'translate-x-0'"
                          ></span>
                        </button>
                        <button
                          @click="deleteGuardrail(rule)"
                          class="p-1.5 text-red-500/70 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                          title="Remove guardrail"
                        >
                          <Trash2 class="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Empty state -->
                  <div v-else class="py-10 text-center space-y-2">
                    <p class="text-xs text-gray-500">No guardrails matched your search. Add one of the presets above, or type below.</p>
                  </div>
                </div>

                <!-- Quick Inline Guardrail Input -->
                <div class="pt-4 border-t border-gray-100 flex items-center gap-2">
                  <input
                    v-model="quickGuardrailText"
                    type="text"
                    placeholder="Type in another guardrail (e.g. Reject requests for unverified Halal certification status)..."
                    class="flex-1 px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
                    @keydown.enter="submitQuickGuardrail"
                  />
                  <button
                    @click="submitQuickGuardrail"
                    class="px-4 py-2.5 bg-primary hover:bg-[#1ea446] text-white font-semibold text-xs rounded-xl cursor-pointer shadow-xs transition-colors shrink-0"
                  >
                    Add Guardrail
                  </button>
                </div>
              </div>
            </div>

            <!-- ─── SUB-TAB 2: SCENARIOS & SOPS ─── -->
            <div v-else-if="activeBehaviorSubTab === 'scenarios'" class="space-y-6">
              <!-- Header Card -->
              <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-2xs space-y-4">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div class="space-y-1">
                    <h3 class="text-sm font-bold text-gray-900">Scenarios & SOPs</h3>
                    <p class="text-xs text-gray-500">
                      Structured playbooks for lead qualification, payment verification, and delivery coordination.
                    </p>
                  </div>
                  <button
                    @click="showScenarioExamples = !showScenarioExamples"
                    class="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer self-start sm:self-auto"
                  >
                    <span>{{ showScenarioExamples ? 'Hide Examples' : 'Show Example Presets' }}</span>
                    <component :is="showScenarioExamples ? ChevronUp : ChevronDown" class="w-3.5 h-3.5" />
                  </button>
                </div>

                <!-- Example Scenarios Banner -->
                <div v-if="showScenarioExamples" class="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                  <div class="flex items-center justify-between">
                    <div class="text-xs font-bold text-gray-800 flex items-center gap-2">
                      <Sparkles class="w-3.5 h-3.5 text-emerald-600" />
                      Example Scenario: Prospective Buyer Qualification
                    </div>
                    <button
                      @click="showAddScenarioModal = true"
                      class="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
                    >
                      Customize in Builder
                    </button>
                  </div>

                  <div class="p-3.5 bg-white border border-gray-200 rounded-xl text-xs space-y-2">
                    <div class="font-bold text-gray-900">Prospective Buyer (B2B Foodservice)</div>
                    <p class="text-gray-600">
                      Handle customers showing interest in wholesale ingredient purchases or opening restaurant credit lines.
                    </p>
                    <div class="flex flex-wrap items-center gap-2 pt-1">
                      <span class="text-[10px] font-semibold text-gray-500">Bound CRM Tools:</span>
                      <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200/60">@add_private_note</span>
                      <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800">@add_label</span>
                      <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-50 text-sky-800 border border-sky-200/60">@handoff</span>
                    </div>
                  </div>
                </div>

                <!-- Scenarios Search & Filter Toolbar -->
                <div class="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 pb-3">
                  <div class="flex items-center gap-2 flex-wrap">
                    <div class="relative w-48 sm:w-64">
                      <Search class="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        v-model="scenarioSearchQuery"
                        type="text"
                        placeholder="Search scenarios..."
                        class="w-full pl-8 pr-3 py-1.5 bg-gray-50 hover:bg-white focus:bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs transition-all"
                      />
                    </div>
                    <select
                      v-model="scenarioCategoryFilter"
                      class="px-3 py-1.5 bg-gray-50 hover:bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-700 cursor-pointer shadow-2xs"
                    >
                      <option value="all">All Categories</option>
                      <option value="Lead Qualification">Lead Qualification</option>
                      <option value="Billing & Payment">Billing & Payment</option>
                      <option value="Cold-Chain Delivery">Cold-Chain Delivery</option>
                    </select>
                  </div>

                  <button
                    @click="showAddScenarioModal = true"
                    class="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs rounded-xl cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Plus class="w-3.5 h-3.5" />
                    New Playbook
                  </button>
                </div>

                <!-- Structured TCA Scenario Cards -->
                <div v-if="filteredScenarios.length > 0" class="space-y-4 pt-2">
                  <div
                    v-for="sc in filteredScenarios"
                    :key="sc.id"
                    class="p-5 border border-gray-200 rounded-2xl bg-white hover:border-emerald-300 transition-all space-y-4 shadow-2xs group"
                  >
                    <!-- Card Header -->
                    <div class="flex items-start justify-between gap-3">
                      <div class="flex items-center gap-2.5">
                        <GripVertical class="w-4 h-4 text-gray-300 group-hover:text-gray-500 cursor-grab" />
                        <div>
                          <div class="flex items-center gap-2">
                            <span class="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">
                              {{ sc.title }}
                            </span>
                            <span class="px-2 py-0.5 rounded-full text-[9px] font-bold" :class="getScenarioCategoryBadge(sc.category)">
                              {{ sc.category }}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div class="flex items-center gap-3 shrink-0">
                        <button
                          type="button"
                          role="switch"
                          :aria-checked="sc.enabled"
                          @click="sc.enabled = !sc.enabled"
                          class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                          :class="sc.enabled ? 'bg-primary' : 'bg-gray-200'"
                        >
                          <span
                            class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                            :class="sc.enabled ? 'translate-x-4' : 'translate-x-0'"
                          ></span>
                        </button>
                        <button
                          @click="deleteScenario(sc)"
                          class="p-1.5 text-red-500/70 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                          title="Remove scenario"
                        >
                          <Trash2 class="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <!-- Trigger condition box -->
                    <div class="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
                      <div class="text-[11px] font-semibold text-gray-500">Trigger Condition</div>
                      <div class="text-xs text-gray-800 font-medium leading-relaxed">
                        {{ sc.triggerPrompt }}
                      </div>
                    </div>

                    <!-- Steps List -->
                    <div class="space-y-1.5">
                      <div class="text-[11px] font-semibold text-gray-500">Qualifying Steps & Actions</div>
                      <ol class="space-y-1 text-xs text-gray-700 list-decimal list-inside pl-1">
                        <li v-for="(step, idx) in sc.qualifyingSteps" :key="idx" class="leading-relaxed">
                          {{ step }}
                        </li>
                      </ol>
                    </div>

                    <!-- Tool Chips & Footer -->
                    <div class="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div class="flex flex-wrap items-center gap-1.5">
                        <span class="text-[11px] font-medium text-gray-500 mr-1">Tools:</span>
                        <span
                          v-for="tool in sc.toolsUsed"
                          :key="tool"
                          class="px-2 py-0.5 rounded text-[10px] font-mono font-bold"
                          :class="getToolBadgeClass(tool)"
                        >
                          {{ tool }}
                        </span>
                      </div>
                      <div class="text-[11px] text-gray-500 font-mono flex items-center gap-1.5">
                        <CheckCircle2 class="w-3.5 h-3.5 text-emerald-500" />
                        <span>Executed {{ sc.executionsCount }} times • 98% resolution</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Empty state -->
                <div v-else class="py-12 text-center space-y-2">
                  <p class="text-xs text-gray-500">No scenarios matched your query. Click "+ Add Scenario" above to build a playbook.</p>
                </div>
              </div>
            </div>

            <!-- ─── SUB-TAB 3: RESPONSE GUIDELINES ─── -->
            <div v-if="activeBehaviorSubTab === 'guidelines'" class="space-y-6">
              <!-- Header Card -->
              <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-2xs space-y-4">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div class="space-y-1">
                    <h3 class="text-sm font-bold text-gray-900">Response Guidelines</h3>
                    <p class="text-xs text-gray-500">
                      Tone, language matching, and SST quote format guidelines.
                    </p>
                  </div>
                  <button
                    @click="showGuidelineExamples = !showGuidelineExamples"
                    class="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer self-start sm:self-auto"
                  >
                    <span>{{ showGuidelineExamples ? 'Hide Quick Presets' : 'Show Quick Presets' }}</span>
                    <component :is="showGuidelineExamples ? ChevronUp : ChevronDown" class="w-3.5 h-3.5" />
                  </button>
                </div>

                <!-- Quick Presets Bar -->
                <div v-if="showGuidelineExamples" class="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2.5">
                  <div class="text-xs font-bold text-gray-800 flex items-center gap-2">
                    <Sparkles class="w-3.5 h-3.5 text-emerald-600" />
                    Recommended Guidelines (Click to Adopt)
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <button
                      @click="adoptExampleGuideline('Keep replies under 3 sentences unless customer asks for more detail.', 'Length & Format')"
                      class="px-2.5 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 hover:text-emerald-900 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                    >
                      + Keep under 3 sentences
                    </button>
                    <button
                      @click="adoptExampleGuideline('Always reply in the exact language the customer used to write in (EN/MY).', 'Language & Locale')"
                      class="px-2.5 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 hover:text-emerald-900 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                    >
                      + Match language (EN/MY)
                    </button>
                    <button
                      @click="adoptExampleGuideline('Use a warm, consultative B2B wholesale tone — never overly casual, never robotic.', 'Tone & Voice')"
                      class="px-2.5 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 hover:text-emerald-900 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                    >
                      + Warm consultative tone
                    </button>
                    <button
                      @click="adoptExampleGuideline('Always quote wholesale prices with standard SST disclosures and state minimum order quantities clearly.', 'Pricing Policy')"
                      class="px-2.5 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 hover:text-emerald-900 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                    >
                      + SST & MOQ disclosures
                    </button>
                  </div>
                </div>

                <!-- Active Guidelines List -->
                <div class="pt-2 divide-y divide-gray-100">
                  <div
                    v-for="g in guidelineRules"
                    :key="g.id"
                    class="py-3 flex items-start justify-between gap-4 group"
                  >
                    <div class="flex items-start gap-3 min-w-0">
                      <div class="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Check class="w-3.5 h-3.5" />
                      </div>
                      <div class="space-y-1 min-w-0">
                        <div class="flex items-center gap-2">
                          <span class="text-xs font-bold text-gray-900 group-hover:text-primary transition-colors">
                            {{ g.rule }}
                          </span>
                          <span class="px-2 py-0.5 rounded-full text-[9px] font-bold" :class="getGuidelineCategoryBadge(g.category)">
                            {{ g.category }}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div class="flex items-center gap-3 shrink-0">
                      <button
                        type="button"
                        role="switch"
                        :aria-checked="g.enabled"
                        @click="g.enabled = !g.enabled"
                        class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                        :class="g.enabled ? 'bg-primary' : 'bg-gray-200'"
                      >
                        <span
                          class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                          :class="g.enabled ? 'translate-x-4' : 'translate-x-0'"
                        ></span>
                      </button>
                      <button
                        @click="deleteGuideline(g)"
                        class="p-1.5 text-red-500/70 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                        title="Remove guideline"
                      >
                        <Trash2 class="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Quick Add Guideline Input -->
                <div class="pt-4 border-t border-gray-100 flex items-center gap-2">
                  <input
                    v-model="quickGuidelineText"
                    type="text"
                    placeholder="Type a response guideline and press Enter..."
                    class="flex-1 px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
                    @keydown.enter="submitQuickGuideline"
                  />
                  <button
                    @click="submitQuickGuideline"
                    class="px-4 py-2.5 bg-primary hover:bg-[#1ea446] text-white font-semibold text-xs rounded-xl cursor-pointer shadow-xs transition-colors shrink-0"
                  >
                    Add Guideline
                  </button>
                </div>
              </div>
            </div>

            <!-- ─── SUB-TAB 4: HANDOFF & ENGINE SETTINGS ─── -->
            <div v-else-if="activeBehaviorSubTab === 'handoff'" class="space-y-6">
              <!-- Handoff & Escalation Card -->
              <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-2xs space-y-5">
                <div class="space-y-1">
                  <h3 class="text-sm font-bold text-gray-900">Handoff & Closing Messages</h3>
                  <p class="text-xs text-gray-500">
                    Automated messages sent during human agent transfers and ticket closures.
                  </p>
                </div>

                <!-- Handoff Message -->
                <div class="space-y-2 pt-1">
                  <div class="flex items-center justify-between">
                    <label class="block text-xs font-semibold text-gray-700">Handoff Message (When passing to human)</label>
                    <div class="flex items-center gap-1 text-[11px] text-gray-500">
                      <span class="font-mono">{{ handoffSettings.handoffMessage.length }}</span>
                      <span>/ 400</span>
                    </div>
                  </div>

                  <!-- Variable tokens chips -->
                  <div class="flex flex-wrap items-center gap-1.5 pb-1">
                    <span class="text-[11px] font-medium text-gray-500 mr-1">Variables:</span>
                    <button
                      @click="insertHandoffVariable('{rep_name}')"
                      class="px-2 py-0.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 hover:text-emerald-900 text-[10px] font-mono font-semibold rounded-md cursor-pointer transition-colors"
                    >
                      {rep_name}
                    </button>
                    <button
                      @click="insertHandoffVariable('{team_name}')"
                      class="px-2 py-0.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 hover:text-emerald-900 text-[10px] font-mono font-semibold rounded-md cursor-pointer transition-colors"
                    >
                      {team_name}
                    </button>
                    <button
                      @click="insertHandoffVariable('{wait_time}')"
                      class="px-2 py-0.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 hover:text-emerald-900 text-[10px] font-mono font-semibold rounded-md cursor-pointer transition-colors"
                    >
                      {wait_time}
                    </button>
                    <button
                      @click="insertHandoffVariable('{customer_name}')"
                      class="px-2 py-0.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 hover:text-emerald-900 text-[10px] font-mono font-semibold rounded-md cursor-pointer transition-colors"
                    >
                      {customer_name}
                    </button>
                  </div>

                  <textarea
                    v-model="handoffSettings.handoffMessage"
                    rows="3"
                    maxlength="400"
                    class="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs resize-none"
                  ></textarea>

                  <!-- Live WhatsApp Simulation bubble -->
                  <div class="p-3 bg-emerald-50/40 rounded-xl border border-emerald-100 flex items-start gap-2.5">
                    <div class="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      WA
                    </div>
                    <div class="min-w-0">
                      <div class="text-[11px] font-semibold text-emerald-800">Preview in WhatsApp:</div>
                      <div class="text-xs text-gray-800 italic mt-0.5">
                        "{{ handoffSettings.handoffMessage.replace('{rep_name}', 'Hafiz Rahman').replace('{team_name}', 'HoReCa Sales').replace('{wait_time}', 'under 5 minutes').replace('{customer_name}', 'Valued Customer') }}"
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Resolution Message -->
                <div class="space-y-2 pt-2">
                  <div class="flex items-center justify-between">
                    <label class="block text-xs font-semibold text-gray-700">Resolution & Ticket Closing Message</label>
                    <div class="flex items-center gap-1 text-[11px] text-gray-500">
                      <span class="font-mono">{{ handoffSettings.resolutionMessage.length }}</span>
                      <span>/ 400</span>
                    </div>
                  </div>

                  <!-- Variable tokens chips -->
                  <div class="flex flex-wrap items-center gap-1.5 pb-1">
                    <span class="text-[11px] font-medium text-gray-500 mr-1">Variables:</span>
                    <button
                      @click="insertResolutionVariable('{customer_name}')"
                      class="px-2 py-0.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 hover:text-emerald-900 text-[10px] font-mono font-semibold rounded-md cursor-pointer transition-colors"
                    >
                      {customer_name}
                    </button>
                    <button
                      @click="insertResolutionVariable('{company_name}')"
                      class="px-2 py-0.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 hover:text-emerald-900 text-[10px] font-mono font-semibold rounded-md cursor-pointer transition-colors"
                    >
                      {company_name}
                    </button>
                  </div>

                  <textarea
                    v-model="handoffSettings.resolutionMessage"
                    rows="2"
                    maxlength="400"
                    class="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs resize-none"
                  ></textarea>
                </div>
              </div>

              <!-- AI Engine Parameters Card -->
              <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-2xs space-y-6">
                <div class="space-y-1">
                  <h3 class="text-sm font-bold text-gray-900">Engine Calibration</h3>
                  <p class="text-xs text-gray-500">
                    Configure response precision, confidence thresholds, and typing cadence.
                  </p>
                </div>

                <!-- 1. Qualitative Temperature Tiers -->
                <div class="space-y-2">
                  <label class="block text-xs font-semibold text-gray-700">Response Behavior (Creativity & Precision)</label>
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      @click="handoffSettings.temperatureTier = 'strict'; handoffSettings.temperatureValue = 0.2"
                      class="p-3.5 rounded-xl border text-left cursor-pointer transition-all"
                      :class="handoffSettings.temperatureTier === 'strict' ? 'border-primary bg-emerald-50/50 ring-1 ring-primary' : 'border-gray-200 hover:bg-gray-50'"
                    >
                      <div class="text-xs font-bold text-gray-900 flex items-center justify-between">
                        <span>Strict & Factual</span>
                        <span class="text-[10px] font-mono text-gray-500">0.2</span>
                      </div>
                      <p class="text-[11px] text-gray-500 mt-1 leading-relaxed">
                        Deterministic. Strictly follows price matrices and product specs.
                      </p>
                    </button>

                    <button
                      type="button"
                      @click="handoffSettings.temperatureTier = 'balanced'; handoffSettings.temperatureValue = 0.35"
                      class="p-3.5 rounded-xl border text-left cursor-pointer transition-all"
                      :class="handoffSettings.temperatureTier === 'balanced' ? 'border-primary bg-emerald-50/50 ring-1 ring-primary' : 'border-gray-200 hover:bg-gray-50'"
                    >
                      <div class="text-xs font-bold text-gray-900 flex items-center justify-between">
                        <span>Balanced B2B (Recommended)</span>
                        <span class="text-[10px] font-mono text-gray-500">0.35</span>
                      </div>
                      <p class="text-[11px] text-gray-500 mt-1 leading-relaxed">
                        Natural sales dialogue grounded in verified knowledge base files.
                      </p>
                    </button>

                    <button
                      type="button"
                      @click="handoffSettings.temperatureTier = 'creative'; handoffSettings.temperatureValue = 0.65"
                      class="p-3.5 rounded-xl border text-left cursor-pointer transition-all"
                      :class="handoffSettings.temperatureTier === 'creative' ? 'border-primary bg-emerald-50/50 ring-1 ring-primary' : 'border-gray-200 hover:bg-gray-50'"
                    >
                      <div class="text-xs font-bold text-gray-900 flex items-center justify-between">
                        <span>Dynamic / Marketing</span>
                        <span class="text-[10px] font-mono text-gray-500">0.65</span>
                      </div>
                      <p class="text-[11px] text-gray-500 mt-1 leading-relaxed">
                        More phrasing variety. Best for open-ended marketing conversations.
                      </p>
                    </button>
                  </div>
                </div>

                <!-- 2. Qualitative Strictness Tiers -->
                <div class="space-y-2">
                  <label class="block text-xs font-semibold text-gray-700">Knowledge Base Confidence Threshold</label>
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      @click="handoffSettings.strictnessTier = 'high'; handoffSettings.strictnessValue = 0.85"
                      class="p-3.5 rounded-xl border text-left cursor-pointer transition-all"
                      :class="handoffSettings.strictnessTier === 'high' ? 'border-primary bg-emerald-50/50 ring-1 ring-primary' : 'border-gray-200 hover:bg-gray-50'"
                    >
                      <div class="text-xs font-bold text-gray-900 flex items-center justify-between">
                        <span>High Precision (85%+)</span>
                        <span class="text-[10px] font-mono text-gray-500">Strict</span>
                      </div>
                      <p class="text-[11px] text-gray-500 mt-1 leading-relaxed">
                        Escalates to human rep if match confidence is below 85%. Lowest hallucination risk.
                      </p>
                    </button>

                    <button
                      type="button"
                      @click="handoffSettings.strictnessTier = 'standard'; handoffSettings.strictnessValue = 0.70"
                      class="p-3.5 rounded-xl border text-left cursor-pointer transition-all"
                      :class="handoffSettings.strictnessTier === 'standard' ? 'border-primary bg-emerald-50/50 ring-1 ring-primary' : 'border-gray-200 hover:bg-gray-50'"
                    >
                      <div class="text-xs font-bold text-gray-900 flex items-center justify-between">
                        <span>Standard Matching (70%)</span>
                        <span class="text-[10px] font-mono text-gray-500">Balanced</span>
                      </div>
                      <p class="text-[11px] text-gray-500 mt-1 leading-relaxed">
                        Balanced semantic retrieval across all 8 indexed wholesale documents.
                      </p>
                    </button>

                    <button
                      type="button"
                      @click="handoffSettings.strictnessTier = 'broad'; handoffSettings.strictnessValue = 0.55"
                      class="p-3.5 rounded-xl border text-left cursor-pointer transition-all"
                      :class="handoffSettings.strictnessTier === 'broad' ? 'border-primary bg-emerald-50/50 ring-1 ring-primary' : 'border-gray-200 hover:bg-gray-50'"
                    >
                      <div class="text-xs font-bold text-gray-900 flex items-center justify-between">
                        <span>Broad Semantic (55%)</span>
                        <span class="text-[10px] font-mono text-gray-500">Broad</span>
                      </div>
                      <p class="text-[11px] text-gray-500 mt-1 leading-relaxed">
                        Matches looser phrasing and informal restaurant abbreviations.
                      </p>
                    </button>
                  </div>
                </div>

                <!-- 3. Human Typing Cadence & Reply Delay -->
                <div class="space-y-1.5">
                  <label class="block text-xs font-semibold text-gray-700">Human Typing Simulation & Reply Delay</label>
                  <div class="flex items-center gap-3">
                    <div class="flex items-center gap-2">
                      <span class="text-xs text-gray-500">Wait between</span>
                      <input
                        v-model.number="handoffSettings.replyDelayMin"
                        type="number"
                        min="0"
                        max="10"
                        class="w-16 px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-mono text-center font-bold text-gray-800"
                      />
                      <span class="text-xs text-gray-500">to</span>
                      <input
                        v-model.number="handoffSettings.replyDelayMax"
                        type="number"
                        min="0"
                        max="10"
                        class="w-16 px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-mono text-center font-bold text-gray-800"
                      />
                      <span class="text-xs text-gray-500">seconds before replying on WhatsApp.</span>
                    </div>
                  </div>
                  <p class="text-[11px] text-gray-500 pt-0.5">
                    Simulates natural reading and typing cadence. Prevents the "robotic instant response" drop-off on WhatsApp. Set both to 0 for instant responses.
                  </p>
                </div>
              </div>

              <!-- Handoff Action Footer -->
              <div class="flex items-center justify-end gap-2.5">
                <button
                  @click="emitToast('Discarded', 'Reverted handoff settings to default.', 'info')"
                  class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl cursor-pointer transition-colors"
                >
                  Discard
                </button>
                <button
                  @click="saveHandoffSettings"
                  class="px-5 py-2 bg-primary hover:bg-[#1ea446] text-white font-semibold text-xs rounded-xl cursor-pointer shadow-xs transition-colors"
                >
                  Save Handoff Settings
                </button>
              </div>
            </div>
          </div>

          <!-- ══════════════ TAB 2: KNOWLEDGE & DOCUMENTS ══════════════ -->
          <div v-else-if="activeDetailTab === 'knowledge'" class="space-y-6 animate-fade-in">
            <!-- Knowledge Hub Card -->
            <div class="bg-white border border-gray-200 rounded-2xl shadow-2xs overflow-hidden">
              <!-- Distilled Header -->
              <div class="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div class="flex items-center gap-2.5">
                    <h3 class="text-sm font-bold text-gray-900">Knowledge Base</h3>
                    <span class="text-[11px] font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                      {{ knowledgeDocs.length }} sources
                    </span>
                  </div>
                  <p class="text-xs text-gray-500 mt-0.5">Documents and URLs indexed for AI-grounded sales answers.</p>
                </div>

                <div class="flex items-center gap-2">
                  <button
                    @click="syncAllDocs"
                    class="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl cursor-pointer transition-colors border border-gray-200 inline-flex items-center gap-1.5 shadow-2xs"
                    :class="{ 'pointer-events-none': isSyncing }"
                    title="Re-index all documents"
                  >
                    <RefreshCw class="w-3.5 h-3.5 text-gray-500" :class="{ 'animate-spin': isSyncing }" />
                    <span>Sync Index</span>
                  </button>
                  <button
                    @click="showAddDocModal = true"
                    class="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary hover:bg-[#1ea446] text-white font-semibold text-xs rounded-xl cursor-pointer shadow-xs transition-colors"
                  >
                    <Plus class="w-3.5 h-3.5" />
                    <span>Add Source</span>
                  </button>
                </div>
              </div>

              <!-- Distilled Filter & Search Bar (Replaces redundant upload banner) -->
              <div class="px-5 py-3 bg-gray-50/60 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <button
                    v-for="filter in [
                      { id: 'all', label: 'All', count: knowledgeDocs.length },
                      { id: 'pdf', label: 'PDFs', count: knowledgeDocs.filter(d => d.type === 'pdf').length },
                      { id: 'url', label: 'Links', count: knowledgeDocs.filter(d => d.type === 'url').length },
                      { id: 'csv', label: 'CSV', count: knowledgeDocs.filter(d => d.type === 'csv').length },
                      { id: 'docx', label: 'DOCX', count: knowledgeDocs.filter(d => d.type === 'docx').length }
                    ]"
                    :key="filter.id"
                    @click="knowledgeTypeFilter = filter.id as any"
                    class="px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors"
                    :class="knowledgeTypeFilter === filter.id ? 'bg-white text-emerald-800 font-bold shadow-2xs border border-gray-200/80' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'"
                  >
                    {{ filter.label }} <span class="text-[10px] opacity-75">({{ filter.count }})</span>
                  </button>
                </div>

                <div class="relative w-full sm:w-64">
                  <Search class="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    v-model="knowledgeSearch"
                    type="text"
                    placeholder="Filter knowledge sources..."
                    class="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
                  />
                </div>
              </div>

              <!-- Documents List -->
              <div v-if="filteredKnowledgeDocs.length > 0" class="divide-y divide-gray-100">
                <div
                  v-for="doc in filteredKnowledgeDocs"
                  :key="doc.id"
                  class="p-4 flex items-center justify-between hover:bg-gray-50/60 transition-colors group"
                >
                  <div class="flex items-center gap-3.5 min-w-0">
                    <div
                      class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border"
                      :class="getDocBadgeBg(doc.type)"
                    >
                      <FileText v-if="doc.type === 'pdf'" class="w-4 h-4" />
                      <Globe v-else-if="doc.type === 'url'" class="w-4 h-4" />
                      <FileSpreadsheet v-else-if="doc.type === 'csv'" class="w-4 h-4" />
                      <FileText v-else class="w-4 h-4" />
                    </div>
                    <div class="min-w-0">
                      <div class="flex items-center gap-2">
                        <span class="text-xs font-semibold text-gray-900 group-hover:text-primary transition-colors truncate">
                          {{ doc.title }}
                        </span>
                      </div>
                      <div class="text-[11px] text-gray-500 mt-0.5 truncate flex items-center gap-2">
                        <span class="font-bold text-gray-600 uppercase text-[10px] tracking-wider">{{ doc.type }}</span>
                        <span v-if="doc.size">• {{ doc.size }}</span>
                        <span v-else-if="doc.type === 'url'" class="font-mono text-gray-500">• {{ doc.url }}</span>
                        <span>•</span>
                        <span class="text-emerald-700 font-medium flex items-center gap-1">
                          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          {{ doc.status || 'Indexed' }}
                        </span>
                        <span>•</span>
                        <span>{{ doc.time }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="flex items-center gap-2 shrink-0">
                    <button
                      @click="promptDeleteDoc(doc)"
                      class="p-1.5 text-red-600/70 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer transition-colors opacity-70 group-hover:opacity-100"
                      title="Remove document"
                    >
                      <Trash2 class="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <!-- Empty Knowledge State -->
              <div v-else class="p-12 text-center space-y-3">
                <BookOpen class="w-8 h-8 text-gray-300 mx-auto" />
                <div class="text-xs font-semibold text-gray-800">
                  {{ knowledgeSearch ? 'No sources match your filter' : 'No knowledge sources attached' }}
                </div>
                <p class="text-xs text-gray-500 max-w-sm mx-auto">
                  {{ knowledgeSearch ? 'Try a different keyword or switch to All.' : 'Add PDFs, price matrices, or web links to ground the assistant in verified facts.' }}
                </p>
                <button
                  v-if="!knowledgeSearch"
                  @click="showAddDocModal = true"
                  class="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary hover:bg-[#1ea446] text-white font-semibold text-xs rounded-xl cursor-pointer shadow-xs transition-colors"
                >
                  <Plus class="w-3.5 h-3.5" />
                  Add Source
                </button>
              </div>
            </div>
          </div>

          <!-- ══════════════ TAB 4: TOOLS & EXTERNAL APIS ══════════════ -->
          <div v-else-if="activeDetailTab === 'tools'" class="space-y-6 animate-fade-in">
            <!-- Tools Hub Card (matching media_1790915514472.png) -->
            <div class="bg-white border border-gray-200 rounded-2xl shadow-2xs overflow-hidden">
              <div class="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div class="flex items-center gap-2">
                    <h3 class="text-sm font-bold text-gray-900">API Tools</h3>
                    <span class="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                      {{ customTools.length }} Active
                    </span>
                  </div>
                  <p class="text-xs text-gray-500 mt-0.5">
                    Connect external APIs so the assistant can query live ERP and warehouse data.
                  </p>
                </div>

                <div class="flex items-center gap-2">
                  <button
                    @click="showCreateToolModal = true"
                    class="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary hover:bg-[#1ea446] text-white font-semibold text-xs rounded-xl cursor-pointer shadow-xs transition-colors"
                  >
                    <Plus class="w-3.5 h-3.5" />
                    Create a new tool
                  </button>
                </div>
              </div>

              <!-- When has tools -->
              <div v-if="customTools.length > 0" class="divide-y divide-gray-100">
                <div
                  v-for="tool in customTools"
                  :key="tool.id"
                  class="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors group"
                >
                  <div class="flex items-start gap-3.5 min-w-0">
                    <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-100">
                      <Wrench class="w-5 h-5" />
                    </div>
                    <div class="space-y-1 min-w-0">
                      <div class="flex items-center gap-2.5 flex-wrap">
                        <span class="text-xs font-bold text-gray-900 group-hover:text-primary transition-colors">
                          {{ tool.name }}
                        </span>
                        <span
                          class="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold"
                          :class="tool.method === 'GET' ? 'bg-sky-50 text-sky-800 border border-sky-200/60' : 'bg-emerald-50 text-emerald-900'"
                        >
                          {{ tool.method }}
                        </span>
                        <span class="text-[10px] text-gray-500 flex items-center gap-1 font-mono">
                          <Lock class="w-3 h-3 text-gray-500" />
                          {{ tool.authType }}
                        </span>
                      </div>
                      <div class="text-[11px] font-mono text-gray-500 truncate max-w-lg">
                        {{ tool.endpoint }}
                      </div>
                      <div class="text-xs text-gray-600 line-clamp-1">
                        {{ tool.description }}
                      </div>
                    </div>
                  </div>

                  <div class="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                    <button
                      @click="testToolConnection(tool)"
                      class="px-2.5 py-1 text-[11px] font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg cursor-pointer transition-colors inline-flex items-center gap-1 shadow-2xs"
                      title="Test live API endpoint connection"
                    >
                      <Zap class="w-3 h-3 text-emerald-600" />
                      Test Ping
                    </button>
                    <span class="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                      {{ tool.callsCount }} calls
                    </span>
                    <button
                      type="button"
                      role="switch"
                      :aria-checked="tool.enabled"
                      @click="tool.enabled = !tool.enabled"
                      class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                      :class="tool.enabled ? 'bg-primary' : 'bg-gray-200'"
                    >
                      <span
                        class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                        :class="tool.enabled ? 'translate-x-4' : 'translate-x-0'"
                      ></span>
                    </button>
                    <button
                      @click="promptDeleteTool(tool)"
                      class="p-1.5 text-red-500/70 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                      title="Delete tool"
                    >
                      <Trash2 class="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <!-- Empty State Overlay (Exact match to reference media_1790915514472.png) -->
              <div v-else class="relative p-8 overflow-hidden min-h-[320px] flex items-center justify-center">
                <!-- Ghosted background mock tools -->
                <div class="absolute inset-0 p-6 space-y-3 opacity-25 filter blur-[0.5px] select-none pointer-events-none">
                  <div class="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500"><Wrench class="w-4 h-4" /></div>
                      <div>
                        <div class="text-xs font-bold text-gray-800">Order Lookup</div>
                        <div class="text-[10px] font-mono text-gray-500">GET https://api.goldenharvest.com.my/v1/orders/{order_id}</div>
                      </div>
                    </div>
                    <div class="text-[10px] text-gray-500 font-mono">Bearer Token</div>
                  </div>
                  <div class="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500"><Wrench class="w-4 h-4" /></div>
                      <div>
                        <div class="text-xs font-bold text-gray-800">Account Status</div>
                        <div class="text-[10px] font-mono text-gray-500">GET https://api.goldenharvest.com.my/v1/accounts/{account_id}/status</div>
                      </div>
                    </div>
                    <div class="text-[10px] text-gray-500 font-mono">API Key</div>
                  </div>
                  <div class="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500"><Wrench class="w-4 h-4" /></div>
                      <div>
                        <div class="text-xs font-bold text-gray-800">Shipment Tracker</div>
                        <div class="text-[10px] font-mono text-gray-500">GET https://api.goldenharvest.com.my/v1/shipments/{tracking_id}</div>
                      </div>
                    </div>
                    <div class="text-[10px] text-gray-500 font-mono">Bearer Token</div>
                  </div>
                </div>

                <!-- Foreground callout -->
                <div class="relative z-10 text-center space-y-3 max-w-sm mx-auto bg-white/90 backdrop-blur-xs p-6 rounded-2xl border border-gray-200/80 shadow-lg">
                  <h4 class="text-sm font-bold text-gray-900">No custom tools available</h4>
                  <p class="text-xs text-gray-500">
                    No custom tools yet — most assistants work fine without one.
                  </p>
                  <button
                    @click="showCreateToolModal = true"
                    class="inline-flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-[#1ea446] text-white font-semibold text-xs rounded-xl cursor-pointer shadow-xs transition-colors"
                  >
                    <Plus class="w-3.5 h-3.5" />
                    Create a new tool
                  </button>
                </div>
              </div>
            </div>

            <!-- Quick-start templates Card (matching media_1790915514472.png) -->
            <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-2xs space-y-4">
              <div class="space-y-1">
                <h3 class="text-sm font-bold text-gray-900">Quick-start templates</h3>
                <p class="text-xs text-gray-500">Adopt pre-configured API tool actions tailored for Malaysian foodservice wholesale.</p>
              </div>

              <div class="space-y-3">
                <div class="p-4 bg-gray-50 border border-gray-200/80 rounded-xl flex items-center justify-between gap-4">
                  <div>
                    <div class="text-xs font-bold text-gray-900">Order Lookup</div>
                    <div class="text-[11px] text-gray-500 mt-0.5">Looks up live delivery status and item packing details by order ID.</div>
                  </div>
                  <button
                    @click="adoptTemplateTool('Order Lookup')"
                    class="px-3.5 py-1.5 bg-white hover:bg-gray-100 text-gray-700 hover:text-gray-900 font-semibold text-xs rounded-xl border border-gray-200 cursor-pointer shadow-2xs transition-colors shrink-0"
                  >
                    Use template
                  </button>
                </div>

                <div class="p-4 bg-gray-50 border border-gray-200/80 rounded-xl flex items-center justify-between gap-4">
                  <div>
                    <div class="text-xs font-bold text-gray-900">Account Status & Net Credit Limit</div>
                    <div class="text-[11px] text-gray-500 mt-0.5">Checks customer 30-day net credit facility balance and invoice status.</div>
                  </div>
                  <button
                    @click="adoptTemplateTool('Account Status')"
                    class="px-3.5 py-1.5 bg-white hover:bg-gray-100 text-gray-700 hover:text-gray-900 font-semibold text-xs rounded-xl border border-gray-200 cursor-pointer shadow-2xs transition-colors shrink-0"
                  >
                    Use template
                  </button>
                </div>

                <div class="p-4 bg-gray-50 border border-gray-200/80 rounded-xl flex items-center justify-between gap-4">
                  <div>
                    <div class="text-xs font-bold text-gray-900">Cold-Chain Reefer Route ETA</div>
                    <div class="text-[11px] text-gray-500 mt-0.5">Checks daily morning reefer truck ETA (-18°C / +4°C) by postal code.</div>
                  </div>
                  <button
                    @click="adoptTemplateTool('Cold-Chain Reefer Route ETA')"
                    class="px-3.5 py-1.5 bg-white hover:bg-gray-100 text-gray-700 hover:text-gray-900 font-semibold text-xs rounded-xl border border-gray-200 cursor-pointer shadow-2xs transition-colors shrink-0"
                  >
                    Use template
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- ══════════════ TAB 5: PLAYGROUND ══════════════ -->
          <div v-else-if="activeDetailTab === 'playground'" class="space-y-6 animate-fade-in">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <!-- Left Column: Interactive Chat Canvas (8 cols, matching media_1790915520373.png) -->
              <div class="lg:col-span-8 bg-white border border-gray-200 rounded-2xl shadow-2xs overflow-hidden flex flex-col h-[620px]">
                <!-- Header -->
                <div class="p-5 border-b border-gray-100 flex items-center justify-between gap-4">
                  <div>
                    <div class="flex items-center gap-2">
                      <h3 class="text-sm font-bold text-gray-900">Playground</h3>
                      <span class="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                        Live Model
                      </span>
                    </div>
                    <p class="text-xs text-gray-500 mt-0.5">
                      Test prompts and preview live responses before customer deployment.
                    </p>
                  </div>

                  <button
                    @click="resetPlayground"
                    class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl cursor-pointer transition-colors"
                    title="Reset conversation"
                  >
                    <RefreshCw class="w-4 h-4" />
                  </button>
                </div>

                <!-- Messages stream -->
                <div class="flex-1 p-5 overflow-y-auto space-y-3.5 bg-gray-50">
                  <div
                    v-for="(msg, idx) in playgroundMessages"
                    :key="idx"
                    class="flex flex-col"
                    :class="msg.sender === 'user' ? 'items-end' : 'items-start'"
                  >
                    <div
                      class="max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-2xs"
                      :class="msg.sender === 'user' ? 'bg-primary text-white rounded-br-xs' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-xs'"
                    >
                      <div v-if="msg.sender === 'bot'" class="flex items-center gap-1.5 pb-1 text-[10px] font-bold text-emerald-700">
                        <Bot class="w-3 h-3" />
                        <span>Golden Harvest F&B AI</span>
                      </div>
                      {{ msg.text }}
                    </div>
                    <span class="text-[9px] text-gray-500 px-1 pt-1">{{ msg.time }}</span>
                  </div>
                </div>

                <!-- Quick Test Prompts -->
                <div class="px-4 py-2 border-t border-gray-100 bg-white flex items-center gap-1.5 overflow-x-auto">
                  <button
                    v-for="chip in quickTestPrompts"
                    :key="chip"
                    @click="sendPlaygroundMessage(chip)"
                    class="whitespace-nowrap px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-[10px] font-semibold text-gray-700 rounded-lg cursor-pointer transition-colors"
                  >
                    {{ chip }}
                  </button>
                </div>

                <!-- Input area -->
                <div class="p-3.5 border-t border-gray-200 bg-white space-y-1.5">
                  <div class="flex items-center gap-2">
                    <input
                      v-model="playgroundInput"
                      type="text"
                      placeholder="Type your message..."
                      class="flex-1 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white"
                      @keydown.enter="sendPlaygroundMessage()"
                    />
                    <button
                      @click="sendPlaygroundMessage()"
                      class="p-2.5 bg-primary hover:bg-[#1ea446] text-white rounded-xl cursor-pointer shadow-xs transition-colors shrink-0"
                    >
                      <Send class="w-4 h-4" />
                    </button>
                  </div>
                  <p class="text-[10px] text-gray-500 text-center">
                    Messages sent here will count toward your AI Assistant credits.
                  </p>
                </div>
              </div>

              <!-- Right Column: Go-Live Checklist (4 cols, matching media_1790915520373.png) -->
              <div class="lg:col-span-4 bg-white border border-gray-200 rounded-2xl p-6 shadow-2xs space-y-5">
                <div class="space-y-1">
                  <h3 class="text-sm font-bold text-gray-900">Go-Live Checklist</h3>
                  <p class="text-xs text-gray-500">Essential verification steps before connecting live channels.</p>
                </div>

                <div class="space-y-3.5">
                  <div class="flex items-start gap-2.5">
                    <div class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                      <Check class="w-3 h-3 stroke-[2.5]" />
                    </div>
                    <div>
                      <div class="text-xs font-semibold text-gray-900">Assistant named</div>
                      <div class="text-[11px] text-gray-500">Golden Harvest F&B AI</div>
                    </div>
                  </div>

                  <div class="flex items-start gap-2.5">
                    <div class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                      <Check class="w-3 h-3 stroke-[2.5]" />
                    </div>
                    <div>
                      <div class="text-xs font-semibold text-gray-900">Knowledge added</div>
                      <div class="text-[11px] text-gray-500">{{ knowledgeDocs.length }} documents indexed</div>
                    </div>
                  </div>

                  <div class="flex items-start gap-2.5">
                    <div class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                      <Check class="w-3 h-3 stroke-[2.5]" />
                    </div>
                    <div>
                      <div class="text-xs font-semibold text-gray-900">At least 1 guardrail set</div>
                      <div class="text-[11px] text-gray-500">{{ guardrailRules.length }} guardrails active</div>
                    </div>
                  </div>

                  <div class="flex items-start gap-2.5">
                    <div class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                      <Check class="w-3 h-3 stroke-[2.5]" />
                    </div>
                    <div>
                      <div class="text-xs font-semibold text-gray-900">Response guidelines set</div>
                      <div class="text-[11px] text-gray-500">{{ guidelineRules.length }} rules active</div>
                    </div>
                  </div>

                  <div class="flex items-start gap-2.5">
                    <div
                      class="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      :class="getPlaygroundCheckmarkClass()"
                    >
                      <Check class="w-3 h-3 stroke-[2.5]" />
                    </div>
                    <div>
                      <div class="text-xs font-semibold text-gray-900">Tested in Playground</div>
                      <div class="text-[11px] text-gray-500">
                        {{ hasTestedInPlayground ? 'Verified conversational flow' : 'Send a test message to complete' }}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="pt-4 border-t border-gray-100 space-y-3">
                  <div class="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl space-y-1">
                    <div class="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                      <Sparkles class="w-3.5 h-3.5" />
                      100% Launch Ready
                    </div>
                    <p class="text-[11px] text-emerald-900/80 leading-relaxed">
                      All quality checks passed. This assistant is ready for live WhatsApp customer traffic.
                    </p>
                  </div>

                  <button
                    @click="showPreflightModal = true"
                    class="w-full py-2.5 bg-primary hover:bg-[#1ea446] text-white font-semibold text-xs rounded-xl cursor-pointer shadow-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Deploy Assistant Live</span>
                    <ArrowRight class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- ══════════════ TAB 6: CONNECT (INBOXES) ══════════════ -->
          <div v-else-if="activeDetailTab === 'connect' || activeDetailTab === 'channels'" class="space-y-6 animate-fade-in">
            <!-- Connected inboxes Card (matching media_1790915526728.png) -->
            <div class="bg-white border border-gray-200 rounded-2xl shadow-2xs overflow-hidden">
              <div class="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 class="text-sm font-bold text-gray-900">Connected Inboxes</h3>
                  <p class="text-xs text-gray-500 mt-0.5">Manage active communication channels and WhatsApp accounts.</p>
                </div>

                <button
                  @click="showConnectInboxModal = true"
                  class="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary hover:bg-[#1ea446] text-white font-semibold text-xs rounded-xl cursor-pointer shadow-xs transition-colors"
                >
                  <Plus class="w-3.5 h-3.5" />
                  Connect a new inbox
                </button>
              </div>

              <!-- List of inboxes -->
              <div class="divide-y divide-gray-100">
                <div
                  v-for="inbox in connectedInboxes"
                  :key="inbox.id"
                  class="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors"
                >
                  <div class="flex items-center gap-3.5 min-w-0">
                    <div
                      class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                      :class="inbox.type === 'whatsapp' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-sky-50 text-sky-700 border-sky-100'"
                    >
                      <component :is="inbox.type === 'whatsapp' ? Phone : Globe" class="w-5 h-5" />
                    </div>
                    <div class="min-w-0">
                      <div class="text-xs font-bold text-gray-900 flex items-center gap-2">
                        <span>{{ inbox.name }}</span>
                        <span class="text-[11px] font-mono text-gray-500">({{ inbox.identifier }})</span>
                      </div>
                      <div class="text-[10px] text-gray-500 mt-0.5">
                        {{ inbox.connectedAt }} • {{ inbox.todayChats }} conversations today
                      </div>
                    </div>
                  </div>

                  <div class="flex items-center gap-3 shrink-0">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800">
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Active
                    </span>
                    <button
                      @click="promptDeleteInbox(inbox)"
                      class="p-1.5 text-red-500/70 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                      title="Disconnect inbox"
                    >
                      <Trash2 class="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Escalation & Routing Card -->
            <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-2xs space-y-4">
              <div class="space-y-1">
                <h3 class="text-sm font-bold text-gray-900">Human Handoff Assignment</h3>
                <p class="text-xs text-gray-500">Route conversation to this desk when handoff rules or keyword triggers fire.</p>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div class="space-y-1.5">
                  <label class="block text-xs font-semibold text-gray-700">Designated Sales Rep / Desk</label>
                  <select
                    v-model="editForm.fallbackRep"
                    class="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs cursor-pointer"
                  >
                    <option value="Hafiz Rahman (Key Account Manager)">Hafiz Rahman (Key Account Manager - HoReCa)</option>
                    <option value="Sarah Tan (Commercial Director)">Sarah Tan (Commercial Director - Chains & Hotels)</option>
                    <option value="F&B Wholesale Support Desk">F&B Wholesale Support Desk (Round-Robin)</option>
                  </select>
                </div>
                <div class="space-y-1.5">
                  <div class="flex items-center justify-between">
                    <label class="block text-xs font-semibold text-gray-700">High-Priority Keyword Triggers</label>
                    <span class="text-[10px] text-gray-500 font-medium">{{ escalationKeywords.length }} triggers</span>
                  </div>
                  <div class="p-2 bg-gray-50 border border-gray-200 rounded-xl min-h-[44px] flex items-center gap-1.5 flex-wrap">
                    <span
                      v-for="(kw, idx) in escalationKeywords"
                      :key="kw"
                      class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-gray-200 text-gray-800 rounded-lg text-xs font-medium shadow-2xs group"
                    >
                      <span>{{ kw }}</span>
                      <button
                        @click="removeKeyword(idx)"
                        type="button"
                        class="text-gray-500 hover:text-red-500 cursor-pointer transition-colors"
                        title="Remove trigger"
                      >
                        <X class="w-3 h-3" />
                      </button>
                    </span>
                    <input
                      v-model="newKeywordInput"
                      @keydown.enter.prevent="addKeyword"
                      placeholder="+ Type keyword & press Enter"
                      class="px-2 py-1 text-xs bg-transparent border-none text-gray-800 placeholder-gray-400 focus:outline-none min-w-[160px] flex-1"
                    />
                  </div>
                  <p class="text-[10px] text-gray-500 leading-normal">
                    When customer WhatsApp messages contain any of these triggers, conversation immediately transfers to designated rep.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- ══════════════ TAB 7: REPORT (ANALYTICS) ══════════════ -->
          <div v-else-if="activeDetailTab === 'report'" class="space-y-6 animate-fade-in">
            <!-- Top Controls Header (matching media_1790915536296.png) -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 class="text-sm font-bold text-gray-900">Performance Report</h3>
                <div class="text-xs font-medium text-gray-500 mt-0.5">
                  26 Sep – 2 Oct 2026 • Compared with previous 7 days
                </div>
              </div>

              <div class="flex items-center gap-2 flex-wrap">
                <!-- Date range filter pills -->
                <div class="bg-gray-100 p-1 rounded-xl flex items-center gap-1">
                  <button
                    v-for="range in ['24h', '7d', '30d', '90d']"
                    :key="range"
                    @click="reportDateRange = range as any"
                    class="px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                    :class="reportDateRange === range ? 'bg-white text-emerald-800 font-bold shadow-2xs' : 'text-gray-600 hover:text-gray-900'"
                  >
                    {{ range }}
                  </button>
                </div>

                <!-- Channel dropdown -->
                <select
                  v-model="reportChannelFilter"
                  class="px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs cursor-pointer"
                >
                  <option value="all">All channels</option>
                  <option value="whatsapp">WhatsApp Business</option>
                  <option value="webchat">Web Chat</option>
                </select>

                <!-- Export CSV button -->
                <button
                  @click="emitToast('Report Exported', 'Downloaded assistant-analytics-7d.csv', 'success')"
                  class="px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-xl border border-gray-200 cursor-pointer shadow-2xs inline-flex items-center gap-1.5 transition-colors"
                >
                  <Download class="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            <!-- Provisional Alert Banner (matching media_1790915536296.png) -->
            <div class="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
              <Info class="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                The last 3 days are provisional. Conversations reopening within 72 hours are excluded from resolved metrics.
              </span>
            </div>

            <!-- Empty State View (natural fallback when no inboxes connected) -->
            <div
              v-if="connectedInboxes.length === 0"
              class="py-24 text-center bg-white border border-gray-200 rounded-2xl shadow-2xs space-y-2"
            >
              <BarChart2 class="w-8 h-8 text-gray-300 mx-auto" />
              <div class="text-xs font-medium text-gray-500">
                Not enough data yet for this period. Connect an inbox to start receiving conversations.
              </div>
            </div>

            <!-- Populated Analytics Suite -->
            <div v-else class="space-y-6">
              <!-- KPI Cards Row -->
              <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="p-4 bg-white border border-gray-200 rounded-2xl shadow-2xs space-y-1">
                  <div class="text-[11px] font-semibold text-gray-500">Total Conversations</div>
                  <div class="text-xl font-bold text-gray-900 tracking-tight">1,428</div>
                  <div class="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                    <span>↑ +18.4%</span>
                    <span class="text-gray-500 font-normal">vs prev 7 days</span>
                  </div>
                </div>

                <div class="p-4 bg-white border border-gray-200 rounded-2xl shadow-2xs space-y-1">
                  <div class="text-[11px] font-semibold text-gray-500">Auto-Resolution Rate</div>
                  <div class="text-xl font-bold text-emerald-600 tracking-tight">91.8%</div>
                  <div class="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                    <span>↑ +3.2%</span>
                    <span class="text-gray-500 font-normal">contained by AI</span>
                  </div>
                </div>

                <div class="p-4 bg-white border border-gray-200 rounded-2xl shadow-2xs space-y-1">
                  <div class="text-[11px] font-semibold text-gray-500">Escalated to Reps</div>
                  <div class="text-xl font-bold text-gray-900 tracking-tight">117</div>
                  <div class="text-[10px] text-gray-500 font-medium">
                    8.2% transferred to Hafiz R.
                  </div>
                </div>

                <div class="p-4 bg-white border border-gray-200 rounded-2xl shadow-2xs space-y-1">
                  <div class="text-[11px] font-semibold text-gray-500">Avg Response Speed</div>
                  <div class="text-xl font-bold text-gray-900 tracking-tight">1.2s</div>
                  <div class="text-[10px] text-emerald-600 font-semibold">
                    -0.4s faster with RAG cache
                  </div>
                </div>
              </div>

              <!-- Two-Column Analytics Charts -->
              <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <!-- Left: Daily Volume & Containment Trend (7 cols) -->
                <div class="lg:col-span-7 bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs space-y-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <h4 class="text-xs font-bold text-gray-900">Daily Conversation Volume & Containment</h4>
                      <p class="text-[11px] text-gray-500">Resolved chats vs human escalations</p>
                    </div>
                    <div class="flex items-center gap-3 text-[11px]">
                      <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span> AI Resolved</span>
                      <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-sm bg-slate-300"></span> Escalated</span>
                    </div>
                  </div>

                  <!-- SVG Bar Chart -->
                  <div class="pt-4 h-48 flex items-end justify-between gap-3 px-2 border-b border-gray-100 pb-2">
                    <div
                      v-for="(day, dIdx) in [
                        { day: 'Sat (26)', total: 180, res: 165, esc: 15 },
                        { day: 'Sun (27)', total: 110, res: 102, esc: 8 },
                        { day: 'Mon (28)', total: 240, res: 221, esc: 19 },
                        { day: 'Tue (29)', total: 260, res: 238, esc: 22 },
                        { day: 'Wed (30)', total: 235, res: 216, esc: 19 },
                        { day: 'Thu (01)', total: 215, res: 198, esc: 17 },
                        { day: 'Fri (02)', total: 188, res: 171, esc: 17 }
                      ]"
                      :key="dIdx"
                      class="flex-1 flex flex-col items-center gap-1.5 group cursor-pointer"
                    >
                      <div class="text-[10px] font-mono text-gray-500 group-hover:text-gray-700 transition-colors">
                        {{ day.total }}
                      </div>
                      <div class="w-full max-w-[28px] flex flex-col rounded-t-md overflow-hidden bg-gray-100" style="height: 120px; justify-content: flex-end;">
                        <div class="bg-slate-300 w-full" :style="{ height: `${(day.esc / 260) * 120}px` }" title="Escalated"></div>
                        <div class="bg-emerald-500 w-full" :style="{ height: `${(day.res / 260) * 120}px` }" title="AI Resolved"></div>
                      </div>
                      <div class="text-[10px] font-medium text-gray-500 group-hover:text-gray-900 transition-colors">
                        {{ day.day }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Right: Top Inquired Customer Intents (5 cols) -->
                <div class="lg:col-span-5 bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs space-y-4">
                  <div>
                    <h4 class="text-xs font-bold text-gray-900">Top Foodservice Inquiries</h4>
                    <p class="text-[11px] text-gray-500">Distribution of customer questions on WhatsApp</p>
                  </div>

                  <div class="space-y-3 pt-1">
                    <div class="space-y-1">
                      <div class="flex items-center justify-between text-xs font-medium">
                        <span class="text-gray-800">JAKIM Halal & Import Certs</span>
                        <span class="text-gray-500 font-mono">34% (485)</span>
                      </div>
                      <div class="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div class="h-full bg-emerald-500 rounded-full" style="width: 34%"></div>
                      </div>
                    </div>

                    <div class="space-y-1">
                      <div class="flex items-center justify-between text-xs font-medium">
                        <span class="text-gray-800">Wholesale MOQ & Volume Pricing</span>
                        <span class="text-gray-500 font-mono">28% (400)</span>
                      </div>
                      <div class="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div class="h-full bg-emerald-500 rounded-full" style="width: 28%"></div>
                      </div>
                    </div>

                    <div class="space-y-1">
                      <div class="flex items-center justify-between text-xs font-medium">
                        <span class="text-gray-800">Cold-Chain Reefer Schedule</span>
                        <span class="text-gray-500 font-mono">22% (314)</span>
                      </div>
                      <div class="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div class="h-full bg-emerald-500 rounded-full" style="width: 22%"></div>
                      </div>
                    </div>

                    <div class="space-y-1">
                      <div class="flex items-center justify-between text-xs font-medium">
                        <span class="text-gray-800">Net-30 Credit Terms Application</span>
                        <span class="text-gray-500 font-mono">16% (229)</span>
                      </div>
                      <div class="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div class="h-full bg-emerald-500 rounded-full" style="width: 16%"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════
         IN-SITU INTERACTIVE LIVE CHAT TESTING DRAWER
    ════════════════════════════════════════════════════════════════ -->
    <div
      v-if="showTestDrawer"
      class="fixed inset-0 z-50 flex justify-end bg-gray-950/40 backdrop-blur-xs animate-fade-in"
      @click.self="showTestDrawer = false"
    >
      <div class="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between border-l border-gray-200 animate-slide-left">
        <!-- Drawer Header -->
        <div class="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Bot class="w-4 h-4" />
            </div>
            <div>
              <div class="text-xs font-bold text-gray-900">{{ currentTestAssistant?.name || 'AI Assistant' }} (Live Sandbox)</div>
              <div class="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Testing against {{ knowledgeDocs.length }} documents
              </div>
            </div>
          </div>
          <button
            @click="showTestDrawer = false"
            class="p-1 text-gray-500 hover:text-gray-700 rounded-lg cursor-pointer"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Chat Message Canvas -->
        <div class="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50/30">
          <div
            v-for="(msg, index) in testChatMessages"
            :key="index"
            class="flex flex-col"
            :class="msg.sender === 'user' ? 'items-end' : 'items-start'"
          >
            <div
              class="max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-2xs"
              :class="msg.sender === 'user' ? 'bg-primary text-white rounded-br-xs' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-xs'"
            >
              {{ msg.text }}
            </div>
            <span class="text-[9px] text-gray-500 px-1 pt-1">{{ msg.time }}</span>
          </div>
        </div>

        <!-- Pre-built Quick Prompt Chips -->
        <div class="px-4 py-2 border-t border-gray-100 bg-white flex items-center gap-1.5 overflow-x-auto">
          <button
            v-for="chip in quickTestPrompts"
            :key="chip"
            @click="sendTestMessage(chip)"
            class="whitespace-nowrap px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-[10px] font-semibold text-gray-700 rounded-lg cursor-pointer transition-colors"
          >
            {{ chip }}
          </button>
        </div>

        <!-- Drawer Input Composer -->
        <div class="p-3 border-t border-gray-200 bg-white flex items-center gap-2">
          <input
            v-model="testInputText"
            type="text"
            placeholder="Type a test customer message..."
            class="flex-1 px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white"
            @keydown.enter="sendTestMessage(testInputText)"
          />
          <button
            @click="sendTestMessage(testInputText)"
            class="p-2 bg-primary hover:bg-[#1ea446] text-white rounded-xl cursor-pointer shadow-xs transition-colors"
          >
            <Send class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════
         MODAL: CREATE ASSISTANT
    ════════════════════════════════════════════════════════════════ -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/50 backdrop-blur-xs animate-fade-in"
      @click.self="showCreateModal = false"
      @keydown.esc="showCreateModal = false"
    >
      <div class="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 p-6 space-y-5 animate-scale-up">
        <div class="space-y-1">
          <h2 class="text-base font-bold text-gray-900 tracking-tight">Create an assistant</h2>
          <p class="text-xs text-gray-500 leading-relaxed">
            Fill out the details below to configure your sales or support agent.
          </p>
        </div>

        <div class="space-y-4">
          <div class="space-y-1.5">
            <label class="block text-xs font-semibold text-gray-700">Name</label>
            <input
              v-model="createForm.name"
              type="text"
              placeholder="e.g. F&B Wholesale Assistant"
              class="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary shadow-2xs"
              v-focus
            />
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs font-semibold text-gray-700">Product / Service Line</label>
            <input
              v-model="createForm.productName"
              type="text"
              placeholder="e.g. Golden Harvest Foodservice"
              class="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary shadow-2xs"
            />
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs font-semibold text-gray-700">Description</label>
            <div class="relative">
              <textarea
                v-model="createForm.description"
                rows="3"
                maxlength="200"
                placeholder="Describe this assistant's primary goal..."
                class="w-full px-3.5 py-2.5 pb-6 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary shadow-2xs resize-none"
              ></textarea>
              <span class="absolute right-3 bottom-2 text-[10px] text-gray-500 font-mono">
                {{ createForm.description.length }} / 200
              </span>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
          <button
            @click="showCreateModal = false"
            class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            @click="submitCreateAssistant"
            class="px-5 py-2 bg-primary hover:bg-[#1ea446] text-white font-semibold text-xs rounded-xl cursor-pointer shadow-xs transition-colors"
          >
            Create Assistant
          </button>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════
         MODAL: DESTRUCTIVE DELETE CONFIRMATION SAFETY SHIELD
    ════════════════════════════════════════════════════════════════ -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/50 backdrop-blur-xs animate-fade-in"
      @click.self="showDeleteModal = false"
      @keydown.esc="showDeleteModal = false"
    >
      <div class="bg-white rounded-2xl w-full max-w-sm shadow-2xl border border-gray-100 p-6 space-y-4 animate-scale-up">
        <div class="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
          <AlertTriangle class="w-5 h-5" />
        </div>
        <div class="space-y-1">
          <h3 class="text-sm font-bold text-gray-900">
            {{ deleteTargetType === 'inbox' ? `Disconnect "${deleteTargetName}"?` : `Delete "${deleteTargetName}"?` }}
          </h3>
          <p class="text-xs text-gray-500 leading-relaxed">
            <template v-if="deleteTargetType === 'assistant'">
              This will permanently delete this assistant, all configured behavioral guardrails, documents, and historical analytics.
            </template>
            <template v-else-if="deleteTargetType === 'tool'">
              This custom API tool will be deleted. The assistant will no longer be able to execute this action during customer conversations.
            </template>
            <template v-else-if="deleteTargetType === 'inbox'">
              This channel inbox will be disconnected. Incoming customer messages on this number or endpoint will no longer route to this AI assistant.
            </template>
            <template v-else>
              This document will be permanently removed from the knowledge base and excluded from AI retrieval-augmented generation (RAG).
            </template>
          </p>
        </div>
        <div class="flex items-center justify-end gap-2.5 pt-2">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl cursor-pointer"
          >
            Cancel
          </button>
          <button
            @click="executeConfirmedDelete"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-xl cursor-pointer shadow-xs"
          >
            {{ deleteTargetType === 'inbox' ? 'Disconnect Inbox' : 'Confirm Delete' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════
         MODAL: PRE-FLIGHT LIVE CHECKLIST MODAL
    ════════════════════════════════════════════════════════════════ -->
    <div
      v-if="showPreflightModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/50 backdrop-blur-xs animate-fade-in"
      @click.self="showPreflightModal = false"
      @keydown.esc="showPreflightModal = false"
    >
      <div class="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 p-6 space-y-5 animate-scale-up">
        <div class="space-y-1">
          <h3 class="text-base font-bold text-gray-900 tracking-tight">Pre-Flight Live Checklist</h3>
          <p class="text-xs text-gray-500">
            Verify readiness before activating this assistant on live WhatsApp customer conversations.
          </p>
        </div>

        <div class="space-y-3">
          <div class="p-3 rounded-xl border border-emerald-200/80 bg-emerald-50/50 flex items-center gap-3 text-xs text-emerald-950 font-medium">
            <CheckCircle2 class="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{{ knowledgeDocs.length }} Knowledge documents indexed and verified.</span>
          </div>
          <div class="p-3 rounded-xl border border-emerald-200/80 bg-emerald-50/50 flex items-center gap-3 text-xs text-emerald-950 font-medium">
            <CheckCircle2 class="w-4 h-4 text-emerald-600 shrink-0" />
            <span>WhatsApp Business channel connected (+6013-882 1928).</span>
          </div>
          <div class="p-3 rounded-xl border border-emerald-200/80 bg-emerald-50/50 flex items-center gap-3 text-xs text-emerald-950 font-medium">
            <CheckCircle2 class="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Human escalation fallback assigned to Hafiz Rahman (Key Account Manager).</span>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
          <button
            @click="showPreflightModal = false"
            class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl cursor-pointer"
          >
            Keep in Draft
          </button>
          <button
            @click="confirmPublishLive"
            class="px-5 py-2 bg-primary hover:bg-[#1ea446] text-white font-semibold text-xs rounded-xl cursor-pointer shadow-xs"
          >
            Publish Live Now
          </button>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════
         MODAL: ADD GUARDRAIL
    ════════════════════════════════════════════════════════════════ -->
    <div
      v-if="showAddGuardrailModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/50 backdrop-blur-xs animate-fade-in"
      @click.self="showAddGuardrailModal = false"
      @keydown.esc="showAddGuardrailModal = false"
    >
      <div class="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 p-6 space-y-4 animate-scale-up">
        <div class="space-y-1">
          <h2 class="text-base font-bold text-gray-900 tracking-tight">Add Safety Guardrail</h2>
          <p class="text-xs text-gray-500">Define a topic refusal, PII block, or commercial authorization limit.</p>
        </div>

        <div class="space-y-3 pt-1">
          <div class="space-y-1.5">
            <label class="block text-xs font-semibold text-gray-700">Rule Name</label>
            <input
              v-model="newGuardrailForm.name"
              type="text"
              placeholder="e.g. Prevent Unapproved Volume Discounts"
              class="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
              v-focus
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1.5">
              <label class="block text-xs font-semibold text-gray-700">Category</label>
              <select
                v-model="newGuardrailForm.category"
                class="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs cursor-pointer"
              >
                <option value="Commercial & Pricing">Commercial & Pricing</option>
                <option value="Safety & PII">Safety & PII</option>
                <option value="Compliance & Halal">Compliance & Halal</option>
                <option value="Scope & Conduct">Scope & Conduct</option>
              </select>
            </div>

            <div class="space-y-1.5">
              <label class="block text-xs font-semibold text-gray-700">Action On Trigger</label>
              <select
                v-model="newGuardrailForm.action"
                class="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs cursor-pointer"
              >
                <option value="Block & Deflect">Block & Deflect</option>
                <option value="Warn & Rephrase">Warn & Rephrase</option>
                <option value="Instant Escalate">Instant Escalate</option>
              </select>
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs font-semibold text-gray-700">Rule Instructions / Scope</label>
            <textarea
              v-model="newGuardrailForm.description"
              rows="3"
              placeholder="Describe what to detect and how the bot should deflect..."
              class="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs resize-none"
            ></textarea>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
          <button
            @click="showAddGuardrailModal = false"
            class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl cursor-pointer"
          >
            Cancel
          </button>
          <button
            @click="submitAddGuardrail"
            class="px-5 py-2 bg-primary hover:bg-[#1ea446] text-white font-semibold text-xs rounded-xl cursor-pointer shadow-xs"
          >
            Save Guardrail
          </button>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════
         MODAL: ADD SCENARIO PLAYBOOK
    ════════════════════════════════════════════════════════════════ -->
    <div
      v-if="showAddScenarioModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/50 backdrop-blur-xs animate-fade-in"
      @click.self="showAddScenarioModal = false"
      @keydown.esc="showAddScenarioModal = false"
    >
      <div class="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-gray-100 p-6 space-y-4 animate-scale-up max-h-[90vh] overflow-y-auto">
        <div class="space-y-1">
          <h2 class="text-base font-bold text-gray-900 tracking-tight">Create Scenario Playbook</h2>
          <p class="text-xs text-gray-500">Configure trigger conditions, required questions, and automated CRM tools.</p>
        </div>

        <div class="space-y-3 pt-1">
          <div class="space-y-1.5">
            <label class="block text-xs font-semibold text-gray-700">Scenario Title</label>
            <input
              v-model="newScenarioForm.title"
              type="text"
              placeholder="e.g. Catering & Event Bulk Order Inquiries"
              class="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
              v-focus
            />
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs font-semibold text-gray-700">Category</label>
            <select
              v-model="newScenarioForm.category"
              class="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs cursor-pointer"
            >
              <option value="Lead Qualification">Lead Qualification</option>
              <option value="Billing & Payment">Billing & Payment</option>
              <option value="Cold-Chain Delivery">Cold-Chain Delivery</option>
              <option value="Damaged Goods & Return">Damaged Goods & Return</option>
            </select>
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs font-semibold text-gray-700">Trigger Condition (When to execute)</label>
            <textarea
              v-model="newScenarioForm.triggerPrompt"
              rows="2"
              placeholder="e.g. When customer asks for custom catering quote or orders above RM15,000..."
              class="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs resize-none"
            ></textarea>
          </div>

          <div class="space-y-2">
            <label class="block text-xs font-semibold text-gray-700">Qualifying Steps (Required Questions)</label>
            <input
              v-model="newScenarioForm.step1"
              type="text"
              placeholder="Step 1: Ask for event date and outlet branch..."
              class="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
            />
            <input
              v-model="newScenarioForm.step2"
              type="text"
              placeholder="Step 2: Collect itemized ingredient requirements..."
              class="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
            />
            <input
              v-model="newScenarioForm.step3"
              type="text"
              placeholder="Step 3 (Optional): Check temperature storage capability..."
              class="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
            />
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs font-semibold text-gray-700">Bind CRM Automated Tools</label>
            <div class="flex flex-wrap gap-2 pt-1">
              <span class="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200/60">@add_private_note</span>
              <span class="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-emerald-50 text-emerald-800">@add_label</span>
              <span class="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-sky-50 text-sky-800 border border-sky-200/60">@handoff</span>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
          <button
            @click="showAddScenarioModal = false"
            class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl cursor-pointer"
          >
            Cancel
          </button>
          <button
            @click="submitAddScenario"
            class="px-5 py-2 bg-primary hover:bg-[#1ea446] text-white font-semibold text-xs rounded-xl cursor-pointer shadow-xs"
          >
            Create Playbook
          </button>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════
         MODAL: ADD RESPONSE GUIDELINE
    ════════════════════════════════════════════════════════════════ -->
    <div
      v-if="showAddGuidelineModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/50 backdrop-blur-xs animate-fade-in"
      @click.self="showAddGuidelineModal = false"
      @keydown.esc="showAddGuidelineModal = false"
    >
      <div class="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 p-6 space-y-4 animate-scale-up">
        <div class="space-y-1">
          <h2 class="text-base font-bold text-gray-900 tracking-tight">Add Response Guideline</h2>
          <p class="text-xs text-gray-500">Add a tone, language, or length standard for assistant responses.</p>
        </div>

        <div class="space-y-3 pt-1">
          <div class="space-y-1.5">
            <label class="block text-xs font-semibold text-gray-700">Category</label>
            <select
              v-model="newGuidelineForm.category"
              class="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs cursor-pointer"
            >
              <option value="Length & Format">Length & Format</option>
              <option value="Language & Locale">Language & Locale</option>
              <option value="Tone & Voice">Tone & Voice</option>
              <option value="Pricing Policy">Pricing Policy</option>
            </select>
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs font-semibold text-gray-700">Guideline Rule</label>
            <textarea
              v-model="newGuidelineForm.rule"
              rows="3"
              placeholder="e.g. Always structure itemized price lists with bullet points..."
              class="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs resize-none"
              v-focus
            ></textarea>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
          <button
            @click="showAddGuidelineModal = false"
            class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl cursor-pointer"
          >
            Cancel
          </button>
          <button
            @click="guidelineRules.unshift({ id: Date.now(), rule: newGuidelineForm.rule.trim(), category: newGuidelineForm.category, enabled: true }); showAddGuidelineModal = false; emitToast('Guideline Saved', 'New rule active.', 'success')"
            class="px-5 py-2 bg-primary hover:bg-[#1ea446] text-white font-semibold text-xs rounded-xl cursor-pointer shadow-xs"
          >
            Save Guideline
          </button>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════
         MODAL: ADD KNOWLEDGE DOCUMENT OR FILE
    ════════════════════════════════════════════════════════════════ -->
    <div
      v-if="showAddDocModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/50 backdrop-blur-xs animate-fade-in"
      @click.self="showAddDocModal = false"
      @keydown.esc="showAddDocModal = false"
    >
      <div class="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 p-6 space-y-4 animate-scale-up">
        <div class="space-y-1">
          <h2 class="text-base font-bold text-gray-900 tracking-tight">Add Knowledge Document</h2>
          <p class="text-xs text-gray-500">Provide a PDF catalog, website link, CSV sheet, or DOCX SOP for vector indexing.</p>
        </div>

        <div class="space-y-3 pt-1">
          <div class="space-y-1.5">
            <label class="block text-xs font-semibold text-gray-700">Document Title</label>
            <input
              v-model="newDocTitle"
              type="text"
              placeholder="e.g. 2026 Bakery & Dairy Wholesale Catalog.pdf"
              class="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
              v-focus
            />
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs font-semibold text-gray-700">Source Type</label>
            <select
              v-model="newDocType"
              class="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs cursor-pointer"
            >
              <option value="pdf">PDF Document / Wholesale Catalog (.PDF)</option>
              <option value="url">Website URL / B2B Webpage (Link)</option>
              <option value="csv">Daily Spot Prices / Price Matrix (.CSV)</option>
              <option value="docx">Supply Agreement / SOP (.DOCX)</option>
            </select>
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs font-semibold text-gray-700">
              {{ newDocType === 'url' ? 'Webpage URL' : 'File Name / Reference Path' }}
            </label>
            <input
              v-model="newDocUrl"
              type="text"
              :placeholder="getDocPlaceholder(newDocType)"
              class="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs font-mono"
            />
          </div>
        </div>

        <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
          <button
            @click="showAddDocModal = false"
            class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl cursor-pointer"
          >
            Cancel
          </button>
          <button
            @click="submitAddDocument"
            class="px-5 py-2 bg-primary hover:bg-[#1ea446] text-white font-semibold text-xs rounded-xl cursor-pointer shadow-xs"
          >
            Add & Index Document
          </button>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════
         MODAL: GUIDE & PLAYBOOK
    ════════════════════════════════════════════════════════════════ -->
    <div
      v-if="showGuideModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/50 backdrop-blur-xs animate-fade-in"
      @click.self="showGuideModal = false"
      @keydown.esc="showGuideModal = false"
    >
      <div class="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-gray-100 p-6 space-y-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <HelpCircle class="w-5 h-5" />
          </div>
          <div>
            <h2 class="text-base font-bold text-gray-900 tracking-tight">AI Assistants Playbook</h2>
            <p class="text-xs text-gray-500">Best practices for high-conversion WhatsApp sales automation.</p>
          </div>
        </div>

        <div class="text-xs text-gray-600 space-y-3 leading-relaxed">
          <p>
            <strong>1. Commercial Lead Qualification:</strong> Configure your assistant's primary goal to collect customer requirements and estimate budget before escalating to sales reps.
          </p>
          <p>
            <strong>2. High-Intent Fallback:</strong> If a customer explicitly requests quotation or asks for discounts, routing kicks in immediately to preserve buyer momentum.
          </p>
          <p>
            <strong>3. Test Frequently:</strong> Use the built-in Sandbox Simulator to test real Malaysian customer inquiries before deploying prompt revisions live.
          </p>
        </div>

        <div class="flex justify-end pt-3 border-t border-gray-100">
          <button
            @click="showGuideModal = false"
            class="px-4 py-2 bg-primary hover:bg-[#1ea446] text-white font-semibold text-xs rounded-xl cursor-pointer shadow-xs transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════
         MODAL: CREATE NEW CUSTOM API TOOL
    ════════════════════════════════════════════════════════════════ -->
    <div
      v-if="showCreateToolModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/50 backdrop-blur-xs animate-fade-in"
      @click.self="showCreateToolModal = false"
      @keydown.esc="showCreateToolModal = false"
    >
      <div class="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 p-6 space-y-4 animate-scale-up">
        <div class="space-y-1">
          <h2 class="text-base font-bold text-gray-900 tracking-tight">Create External API Tool</h2>
          <p class="text-xs text-gray-500">Connect a REST API endpoint so the AI assistant can fetch real-time operational data.</p>
        </div>

        <div class="space-y-3 pt-1">
          <div class="space-y-1.5">
            <label class="block text-xs font-semibold text-gray-700">Tool Name</label>
            <input
              v-model="newToolForm.name"
              type="text"
              placeholder="e.g. Order Lookup"
              class="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
              v-focus
            />
          </div>

          <div class="grid grid-cols-3 gap-3">
            <div class="space-y-1.5 col-span-1">
              <label class="block text-xs font-semibold text-gray-700">Method</label>
              <select
                v-model="newToolForm.method"
                class="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs cursor-pointer font-mono"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
              </select>
            </div>
            <div class="space-y-1.5 col-span-2">
              <label class="block text-xs font-semibold text-gray-700">Authentication</label>
              <select
                v-model="newToolForm.authType"
                class="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs cursor-pointer"
              >
                <option value="Bearer Token">Bearer Token</option>
                <option value="API Key">API Key Header</option>
                <option value="None">None (Public)</option>
              </select>
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs font-semibold text-gray-700">Endpoint URL</label>
            <input
              v-model="newToolForm.endpoint"
              type="text"
              placeholder="https://api.goldenharvest.com.my/v1/orders/{order_id}"
              class="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-mono text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
            />
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs font-semibold text-gray-700">Description for Assistant</label>
            <textarea
              v-model="newToolForm.description"
              rows="2"
              placeholder="Tell the model when to execute this tool (e.g. Call when customer asks for order status)..."
              class="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs resize-none"
            ></textarea>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
          <button
            @click="showCreateToolModal = false"
            class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl cursor-pointer"
          >
            Cancel
          </button>
          <button
            @click="submitCreateTool"
            class="px-5 py-2 bg-primary hover:bg-[#1ea446] text-white font-semibold text-xs rounded-xl cursor-pointer shadow-xs"
          >
            Create Tool
          </button>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════
         MODAL: CONNECT NEW INBOX
    ════════════════════════════════════════════════════════════════ -->
    <div
      v-if="showConnectInboxModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/50 backdrop-blur-xs animate-fade-in"
      @click.self="showConnectInboxModal = false"
      @keydown.esc="showConnectInboxModal = false"
    >
      <div class="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 p-6 space-y-4 animate-scale-up">
        <div class="space-y-1">
          <h2 class="text-base font-bold text-gray-900 tracking-tight">Connect Communication Inbox</h2>
          <p class="text-xs text-gray-500">Deploy this assistant to automatically respond across WhatsApp or Web Chat.</p>
        </div>

        <div class="space-y-3 pt-1">
          <div class="space-y-1.5">
            <label class="block text-xs font-semibold text-gray-700">Channel Type</label>
            <select
              v-model="newInboxForm.type"
              class="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs cursor-pointer"
            >
              <option value="whatsapp">WhatsApp Business API (Official)</option>
              <option value="webchat">Website Chat Widget</option>
              <option value="telegram">Telegram Bot</option>
            </select>
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs font-semibold text-gray-700">Inbox Display Label</label>
            <input
              v-model="newInboxForm.name"
              type="text"
              placeholder="e.g. HoReCa Wholesale Inbound"
              class="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
              v-focus
            />
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs font-semibold text-gray-700">Phone Number or Endpoint ID</label>
            <input
              v-model="newInboxForm.phone"
              type="text"
              placeholder="e.g. +6013-882 1928"
              class="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-mono text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
            />
          </div>
        </div>

        <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
          <button
            @click="showConnectInboxModal = false"
            class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl cursor-pointer"
          >
            Cancel
          </button>
          <button
            @click="submitConnectInbox"
            class="px-5 py-2 bg-primary hover:bg-[#1ea446] text-white font-semibold text-xs rounded-xl cursor-pointer shadow-xs"
          >
            Link Inbox
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import {
  Bot, Plus, Search, CheckCircle2, Pencil, LayoutGrid,
  Shield, FileText, FileSpreadsheet, Zap, Clock, MoreVertical, Trash2,
  Copy, ArrowLeft, User, BookOpen, Wrench, Play,
  BarChart2, Globe, RefreshCw, HelpCircle, X, AlertTriangle,
  MessageSquare, Send, Sparkles, Sliders, ChevronRight, ChevronDown, ChevronUp, Upload,
  Phone, Check, ArrowRight, UserCheck, Flame, GripVertical, Tag,
  Download, ExternalLink, Info, Lock
} from 'lucide-vue-next';

// Focus directive helper
const vFocus = {
  mounted: (el: HTMLElement) => el.focus()
};

const emit = defineEmits<{
  (e: 'toast', title: string, message: string, type?: 'success' | 'warning' | 'info'): void;
}>();

function emitToast(title: string, message: string, type: 'success' | 'warning' | 'info' = 'success') {
  emit('toast', title, message, type);
}

// ═══════════════════ STATE: VIEW MODES ═══════════════════
const viewMode = ref<'list' | 'detail'>('list');
const activeDetailTab = ref<'identity' | 'knowledge' | 'behavior' | 'tools' | 'playground' | 'connect' | 'channels' | 'report'>('identity');
const activeBehaviorSubTab = ref<'guardrails' | 'scenarios' | 'guidelines' | 'handoff'>('guardrails');

function getStatusBadgeClass(status: 'live' | 'draft') {
  return status === 'live'
    ? 'bg-emerald-100 text-emerald-700'
    : 'bg-slate-100 text-slate-600';
}

function getDocBadgeBg(type: 'pdf' | 'url' | 'csv' | 'docx') {
  switch (type) {
    case 'pdf':
      return 'bg-red-50 text-red-600 border-red-100';
    case 'url':
      return 'bg-sky-50 text-sky-600 border-sky-100';
    case 'csv':
      return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    case 'docx':
      return 'bg-indigo-50 text-indigo-600 border-indigo-100';
    default:
      return 'bg-gray-50 text-gray-600 border-gray-200';
  }
}

function getDocTypePillClass(type: 'pdf' | 'url' | 'csv' | 'docx') {
  switch (type) {
    case 'pdf':
      return 'bg-red-100 text-red-800';
    case 'url':
      return 'bg-sky-100 text-sky-800';
    case 'csv':
      return 'bg-emerald-100 text-emerald-800';
    case 'docx':
      return 'bg-indigo-100 text-indigo-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function getDocPlaceholder(type: 'pdf' | 'url' | 'csv' | 'docx') {
  switch (type) {
    case 'pdf':
      return 'e.g. 2026_Bakery_Dairy_Ingredients_Catalog.pdf';
    case 'url':
      return 'order.goldenharvest.com.my/horeca-terms';
    case 'csv':
      return 'Daily_Fresh_Seafood_Spot_Prices.csv';
    case 'docx':
      return 'HoReCa_Standard_Purchasing_Terms.docx';
    default:
      return 'document_reference.pdf';
  }
}

function getSetupTabClass(tab: 'identity' | 'knowledge' | 'behavior' | 'tools' | 'playground' | 'connect' | 'channels' | 'report') {
  const isMatch = activeDetailTab.value === tab || (tab === 'connect' && activeDetailTab.value === 'channels');
  return isMatch
    ? 'bg-primary text-white font-bold shadow-xs'
    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900';
}

function getBehaviorSubTabClass(subTab: 'guardrails' | 'scenarios' | 'guidelines' | 'handoff') {
  return activeBehaviorSubTab.value === subTab
    ? 'bg-primary text-white font-bold shadow-xs'
    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100';
}

function getBehaviorBadgeClass(subTab: 'guardrails' | 'scenarios' | 'guidelines' | 'handoff') {
  return activeBehaviorSubTab.value === subTab
    ? 'bg-white text-primary'
    : 'bg-gray-100 text-gray-700';
}

function getPlaygroundCheckmarkClass() {
  if (hasTestedInPlayground.value) {
    return 'bg-emerald-100 text-emerald-800';
  }
  return 'bg-gray-100 text-gray-500';
}

// ═══════════════════ STATE: ASSISTANTS DATA ═══════════════════
interface AssistantItem {
  id: number;
  name: string;
  productName: string;
  description: string;
  identityResponse: string;
  tone: string;
  commercialGoal: string;
  fallbackRep: string;
  connectedPhone: string;
  status: 'live' | 'draft';
  guardrailsCount: number;
  docsCount: number;
  inboxCount: number;
  resolutionRate: string;
  lastEdited: string;
  features: {
    faqGeneration: boolean;
    rememberDetails: boolean;
    sourceCitations: boolean;
  };
}

const assistants = ref<AssistantItem[]>([
  {
    id: 1,
    name: 'Golden Harvest F&B AI',
    productName: 'Golden Harvest Foodservice & Wholesale',
    description: 'AI wholesale ordering and account management assistant for restaurants, cafes, hotels, and catering businesses across Malaysia.',
    identityResponse: 'Hi! I am Golden Harvest F&B AI, dedicated to assisting you with wholesale ingredient orders, cold-chain delivery schedules, bulk price lists, and Halal certifications.',
    tone: 'Consultative & Helpful',
    commercialGoal: 'Qualify Accounts & Take Orders',
    fallbackRep: 'Hafiz Rahman (Key Account Manager)',
    connectedPhone: '+6013-882 1928',
    status: 'live',
    guardrailsCount: 3,
    docsCount: 8,
    inboxCount: 4,
    resolutionRate: '91.8%',
    lastEdited: '2 hours ago',
    features: {
      faqGeneration: true,
      rememberDetails: true,
      sourceCitations: true
    }
  }
]);

const currentAssistant = ref<AssistantItem | null>(null);

// Form edit model for Identity tab
const editForm = ref({
  name: '',
  productName: '',
  description: '',
  identityResponse: '',
  tone: 'Consultative & Helpful',
  commercialGoal: 'Qualify Accounts & Take Orders',
  fallbackRep: 'Hafiz Rahman (Key Account Manager)',
  features: {
    faqGeneration: true,
    rememberDetails: true,
    sourceCitations: true
  }
});

// Create Assistant Form
const showCreateModal = ref(false);
const createForm = ref({
  name: '',
  description: '',
  productName: ''
});

// Delete Confirmation Modal
const showDeleteModal = ref(false);
const deleteTargetId = ref<number | null>(null);
const deleteTargetType = ref<'assistant' | 'doc' | 'tool' | 'inbox'>('assistant');
const deleteTargetName = ref('');

// Pre-flight Live Checklist Modal
const showPreflightModal = ref(false);
const pendingPublishAssistant = ref<AssistantItem | null>(null);

// Guide Modal
const showGuideModal = ref(false);
const openMenuId = ref<number | null>(null);

// ═══════════════════ IN-SITU LIVE TESTING SIMULATOR ═══════════════════
const showTestDrawer = ref(false);
const currentTestAssistant = ref<AssistantItem | null>(null);
const testInputText = ref('');
const quickTestPrompts = [
  'What is the MOQ for Anchor butter & whipping cream?',
  'Do you deliver chilled beef to Penang and Johor Bahru?',
  'Can our cafe apply for 30-day credit terms?'
];

interface ChatMsg {
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

const testChatMessages = ref<ChatMsg[]>([
  {
    sender: 'bot',
    text: 'Hello! I am Golden Harvest F&B AI. How can I assist you with your restaurant or cafe wholesale supply orders today?',
    time: '12:00 PM'
  }
]);

function openTestDrawer(ast: AssistantItem) {
  currentTestAssistant.value = ast;
  showTestDrawer.value = true;
}

function sendTestMessage(text: string) {
  if (!text || !text.trim()) return;
  const userText = text.trim();
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  testChatMessages.value.push({ sender: 'user', text: userText, time });
  testInputText.value = '';

  setTimeout(() => {
    let reply = `Thank you for contacting Golden Harvest Foodservice. Based on our 2026 wholesale product index, all our dairy, poultry, and dry goods are 100% JAKIM Halal certified with cold-chain batch tracking.`;
    const lower = userText.toLowerCase();
    if (lower.includes('moq') || lower.includes('butter') || lower.includes('cream') || lower.includes('minimum') || lower.includes('harga') || lower.includes('price')) {
      reply = 'For commercial dairy (Anchor, Tatua, Elle & Vire), our MOQ is 5 cartons per order. Bulk discount of 8% applies for orders above 30 cartons with next-day cold chain delivery.';
    } else if (lower.includes('deliver') || lower.includes('cold') || lower.includes('penang') || lower.includes('johor') || lower.includes('klang')) {
      reply = 'Yes, we operate daily temperature-controlled reefers (-18°C to +4°C) across Klang Valley, with scheduled Tuesday/Thursday runs to Penang, Ipoh, and Johor Bahru.';
    } else if (lower.includes('credit') || lower.includes('term') || lower.includes('payment') || lower.includes('invoice')) {
      reply = 'Registered HoReCa businesses with minimum 3 months ordering history can apply for our 30-Day Net Credit Facility. Would you like me to connect you with Hafiz Rahman to submit your SSM & financial docs?';
    } else if (lower.includes('speak') || lower.includes('human') || lower.includes('rep') || lower.includes('agent')) {
      reply = 'I am routing this wholesale chat to Hafiz Rahman (Key Account Manager) right away. He will attend to you on WhatsApp within 5 minutes.';
    }
    testChatMessages.value.push({ sender: 'bot', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
  }, 600);
}

// ═══════════════════ BEHAVIOR & RULES DATA ═══════════════════
interface GuardrailItem {
  id: number;
  name: string;
  category: 'Safety & PII' | 'Compliance & Halal' | 'Commercial & Pricing' | 'Scope & Conduct';
  action: 'Block & Deflect' | 'Warn & Rephrase' | 'Instant Escalate';
  description: string;
  enabled: boolean;
  triggersCount: number;
}

interface ScenarioItem {
  id: number;
  title: string;
  category: 'Lead Qualification' | 'Billing & Payment' | 'Cold-Chain Delivery' | 'Damaged Goods & Return';
  triggerPrompt: string;
  qualifyingSteps: string[];
  toolsUsed: string[];
  enabled: boolean;
  executionsCount: number;
}

interface ResponseGuidelineItem {
  id: number;
  rule: string;
  category: 'Tone & Voice' | 'Length & Format' | 'Language & Locale' | 'Pricing Policy';
  enabled: boolean;
}

interface HandoffSettings {
  handoffMessage: string;
  resolutionMessage: string;
  temperatureTier: 'strict' | 'balanced' | 'creative';
  temperatureValue: number;
  strictnessTier: 'high' | 'standard' | 'broad';
  strictnessValue: number;
  replyDelayMin: number;
  replyDelayMax: number;
  fallbackDepartment: string;
}

const showGuardrailExamples = ref(true);
const showScenarioExamples = ref(true);
const showGuidelineExamples = ref(true);

const guardrailSearchQuery = ref('');
const quickGuardrailText = ref('');
const showAddGuardrailModal = ref(false);
const newGuardrailForm = ref<{
  name: string;
  category: GuardrailItem['category'];
  action: GuardrailItem['action'];
  description: string;
}>({
  name: '',
  category: 'Commercial & Pricing',
  action: 'Block & Deflect',
  description: ''
});

const guardrailRules = ref<GuardrailItem[]>([
  {
    id: 1,
    name: 'Block Sensitive Personal & Financial Data (PII)',
    category: 'Safety & PII',
    action: 'Block & Deflect',
    description: 'Block queries that ask for or share customer passwords, online banking PINs, credit card numbers, or confidential supplier bank accounts.',
    enabled: true,
    triggersCount: 14
  },
  {
    id: 2,
    name: 'Deflect Medical, Dietary & Allergy Treatment Inquiries',
    category: 'Compliance & Halal',
    action: 'Block & Deflect',
    description: 'Deflect when asked for medical advice or diagnostic treatment regarding food allergens; advise consulting certified medical professionals.',
    enabled: true,
    triggersCount: 8
  },
  {
    id: 3,
    name: 'Prevent Below-MOQ Approvals & Excessive Discounts',
    category: 'Commercial & Pricing',
    action: 'Instant Escalate',
    description: 'Never approve discounts exceeding standard wholesale brackets or orders below 5-carton MOQ without key account manager authorization.',
    enabled: true,
    triggersCount: 32
  },
  {
    id: 4,
    name: 'Reject Profanity, Offensive Language & Competitor Defamation',
    category: 'Scope & Conduct',
    action: 'Block & Deflect',
    description: 'Politely reject queries containing abusive language, profanity, or defamatory comparisons against competitor distributors.',
    enabled: true,
    triggersCount: 6
  }
]);

const scenarioSearchQuery = ref('');
const scenarioCategoryFilter = ref('all');
const showAddScenarioModal = ref(false);
const newScenarioForm = ref<{
  title: string;
  category: ScenarioItem['category'];
  triggerPrompt: string;
  step1: string;
  step2: string;
  step3: string;
  toolsUsed: string[];
}>({
  title: '',
  category: 'Lead Qualification',
  triggerPrompt: '',
  step1: '',
  step2: '',
  step3: '',
  toolsUsed: ['@add_private_note', '@add_label']
});

const scenarioRules = ref<ScenarioItem[]>([
  {
    id: 1,
    title: 'Prospective Wholesale Buyer Qualification',
    category: 'Lead Qualification',
    triggerPrompt: 'Handle incoming inquiries from new restaurants, cafes, or hotels interested in commercial pricing and opening wholesale accounts.',
    qualifyingSteps: [
      'Ask for business name, outlet type (e.g. Cafe, Bakery, Hotel), and delivery location.',
      'Inquire estimated weekly or monthly purchase volume for dairy, poultry, or frozen items.',
      'Check if migrating from another distributor or opening a new branch.'
    ],
    toolsUsed: ['@add_private_note', '@add_label', '@handoff'],
    enabled: true,
    executionsCount: 46
  },
  {
    id: 2,
    title: 'Billing, Invoices & Payment Receipt Verification',
    category: 'Billing & Payment',
    triggerPrompt: 'Handle customers who submit bank transfer slips, request official tax invoices, or inquire on monthly billing statements.',
    qualifyingSteps: [
      'Ask customer for the specific invoice number (e.g. INV-2026-XXXX) or sales order ID.',
      'Request clear screenshot of payment transaction slip with transaction date and reference.'
    ],
    toolsUsed: ['@add_private_note', '@attach_payment_slip', '@route_finance'],
    enabled: true,
    executionsCount: 62
  },
  {
    id: 3,
    title: 'Cold-Chain Delivery Route & Schedule Inquiry',
    category: 'Cold-Chain Delivery',
    triggerPrompt: 'Handle urgent inquiries regarding daily morning reefer truck arrival times or coverage for outstation branches (Penang, Ipoh, JB).',
    qualifyingSteps: [
      'Confirm delivery postal code and outlet branch name.',
      'Check if temperature-controlled loading dock or receiving bay is ready for chilled arrival.'
    ],
    toolsUsed: ['@check_delivery_route', '@add_label'],
    enabled: true,
    executionsCount: 29
  }
]);

const quickGuidelineText = ref('');
const showAddGuidelineModal = ref(false);
const newGuidelineForm = ref<{
  rule: string;
  category: ResponseGuidelineItem['category'];
}>({
  rule: '',
  category: 'Tone & Voice'
});

const guidelineRules = ref<ResponseGuidelineItem[]>([
  {
    id: 1,
    rule: 'Keep WhatsApp replies under 3 sentences unless customer explicitly requests detailed itemized specifications.',
    category: 'Length & Format',
    enabled: true
  },
  {
    id: 2,
    rule: 'Always reply in the exact language the customer used to write in (Bahasa Malaysia or English).',
    category: 'Language & Locale',
    enabled: true
  },
  {
    id: 3,
    rule: 'Use a warm, consultative B2B wholesale tone — never overly casual, never robotic.',
    category: 'Tone & Voice',
    enabled: true
  },
  {
    id: 4,
    rule: 'Always quote wholesale prices with standard SST disclosures and state minimum order quantities clearly.',
    category: 'Pricing Policy',
    enabled: true
  }
]);

const handoffSettings = ref<HandoffSettings>({
  handoffMessage: 'A team member from our HoReCa sales desk will take over shortly. In the meantime, feel free to share your outlet name and delivery location.',
  resolutionMessage: 'Glad we could assist you! We will close this wholesale ticket for now. If you need any further help or restocks, just send us a message anytime.',
  temperatureTier: 'balanced',
  temperatureValue: 0.35,
  strictnessTier: 'high',
  strictnessValue: 0.85,
  replyDelayMin: 1,
  replyDelayMax: 3,
  fallbackDepartment: 'HoReCa Key Account Team'
});

function getGuardrailCategoryBadge(cat: GuardrailItem['category']) {
  switch (cat) {
    case 'Safety & PII': return 'bg-rose-100 text-rose-700';
    case 'Compliance & Halal': return 'bg-emerald-100 text-emerald-700';
    case 'Commercial & Pricing': return 'bg-amber-100 text-amber-800';
    case 'Scope & Conduct': return 'bg-violet-100 text-violet-700';
    default: return 'bg-slate-100 text-slate-700';
  }
}

function getScenarioCategoryBadge(cat: ScenarioItem['category']) {
  switch (cat) {
    case 'Lead Qualification': return 'bg-emerald-100 text-emerald-700';
    case 'Billing & Payment': return 'bg-violet-100 text-violet-700';
    case 'Cold-Chain Delivery': return 'bg-sky-100 text-sky-700';
    case 'Damaged Goods & Return': return 'bg-amber-100 text-amber-800';
    default: return 'bg-slate-100 text-slate-700';
  }
}

function getGuidelineCategoryBadge(cat: ResponseGuidelineItem['category']) {
  switch (cat) {
    case 'Tone & Voice': return 'bg-violet-100 text-violet-700';
    case 'Length & Format': return 'bg-sky-100 text-sky-700';
    case 'Language & Locale': return 'bg-emerald-100 text-emerald-700';
    case 'Pricing Policy': return 'bg-amber-100 text-amber-800';
    default: return 'bg-slate-100 text-slate-700';
  }
}

function getToolBadgeClass(tool: string) {
  if (tool.includes('note')) return 'bg-amber-100 text-amber-800';
  if (tool.includes('label')) return 'bg-emerald-100 text-emerald-700';
  if (tool.includes('handoff')) return 'bg-sky-100 text-sky-700';
  return 'bg-violet-100 text-violet-700';
}

const filteredGuardrails = computed(() => {
  const q = guardrailSearchQuery.value.trim().toLowerCase();
  return guardrailRules.value.filter(r => !q || r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.category.toLowerCase().includes(q));
});

const filteredScenarios = computed(() => {
  const q = scenarioSearchQuery.value.trim().toLowerCase();
  const cat = scenarioCategoryFilter.value;
  return scenarioRules.value.filter(s => {
    const matchesSearch = !q || s.title.toLowerCase().includes(q) || s.triggerPrompt.toLowerCase().includes(q);
    const matchesCategory = cat === 'all' || s.category === cat;
    return matchesSearch && matchesCategory;
  });
});

function submitQuickGuardrail() {
  if (!quickGuardrailText.value.trim()) return;
  const newRule: GuardrailItem = {
    id: Date.now(),
    name: quickGuardrailText.value.trim(),
    category: 'Commercial & Pricing',
    action: 'Block & Deflect',
    description: quickGuardrailText.value.trim(),
    enabled: true,
    triggersCount: 0
  };
  guardrailRules.value.unshift(newRule);
  quickGuardrailText.value = '';
  emitToast('Guardrail Added', `"${newRule.name}" is now enforced.`, 'success');
}

function submitAddGuardrail() {
  if (!newGuardrailForm.value.name.trim()) {
    emitToast('Name Required', 'Please enter a guardrail rule name.', 'warning');
    return;
  }
  const newRule: GuardrailItem = {
    id: Date.now(),
    name: newGuardrailForm.value.name.trim(),
    category: newGuardrailForm.value.category,
    action: newGuardrailForm.value.action,
    description: newGuardrailForm.value.description.trim() || newGuardrailForm.value.name.trim(),
    enabled: true,
    triggersCount: 0
  };
  guardrailRules.value.unshift(newRule);
  newGuardrailForm.value = { name: '', category: 'Commercial & Pricing', action: 'Block & Deflect', description: '' };
  showAddGuardrailModal.value = false;
  emitToast('Guardrail Enforced', `"${newRule.name}" created.`, 'success');
}

function adoptExampleGuardrail(item: { name: string; category: GuardrailItem['category']; action: GuardrailItem['action']; description: string }) {
  const newRule: GuardrailItem = {
    id: Date.now(),
    name: item.name,
    category: item.category,
    action: item.action,
    description: item.description,
    enabled: true,
    triggersCount: 0
  };
  guardrailRules.value.unshift(newRule);
  emitToast('Rule Adopted', `Adopted "${item.name}".`, 'success');
}

function adoptAllExampleGuardrails() {
  guardrailRules.value.unshift(
    {
      id: Date.now() + 1,
      name: 'Block queries that request sensitive financial credentials',
      category: 'Safety & PII',
      action: 'Block & Deflect',
      description: 'Block queries that share or request passwords, bank accounts, or OTPs.',
      enabled: true,
      triggersCount: 0
    },
    {
      id: Date.now() + 2,
      name: 'Reject abusive, discriminatory or threatening language',
      category: 'Scope & Conduct',
      action: 'Block & Deflect',
      description: 'Reject queries that include offensive or aggressive language.',
      enabled: true,
      triggersCount: 0
    },
    {
      id: Date.now() + 3,
      name: 'Deflect legal claims or medical diagnosis queries',
      category: 'Compliance & Halal',
      action: 'Block & Deflect',
      description: 'Deflect when the assistant is asked for formal legal claims or medical diagnosis.',
      enabled: true,
      triggersCount: 0
    }
  );
  emitToast('Rules Adopted', 'All 3 example guardrails added to active rules.', 'success');
}

function deleteGuardrail(rule: GuardrailItem) {
  guardrailRules.value = guardrailRules.value.filter(r => r.id !== rule.id);
  emitToast('Guardrail Removed', `"${rule.name}" was removed.`, 'warning');
}

function submitAddScenario() {
  if (!newScenarioForm.value.title.trim()) {
    emitToast('Title Required', 'Please enter a scenario title.', 'warning');
    return;
  }
  const steps: string[] = [];
  if (newScenarioForm.value.step1.trim()) steps.push(newScenarioForm.value.step1.trim());
  if (newScenarioForm.value.step2.trim()) steps.push(newScenarioForm.value.step2.trim());
  if (newScenarioForm.value.step3.trim()) steps.push(newScenarioForm.value.step3.trim());

  const newSc: ScenarioItem = {
    id: Date.now(),
    title: newScenarioForm.value.title.trim(),
    category: newScenarioForm.value.category,
    triggerPrompt: newScenarioForm.value.triggerPrompt.trim() || `Inquiries regarding ${newScenarioForm.value.title}`,
    qualifyingSteps: steps.length > 0 ? steps : ['Collect customer requirements and branch outlet location.'],
    toolsUsed: [...newScenarioForm.value.toolsUsed],
    enabled: true,
    executionsCount: 0
  };
  scenarioRules.value.unshift(newSc);
  newScenarioForm.value = { title: '', category: 'Lead Qualification', triggerPrompt: '', step1: '', step2: '', step3: '', toolsUsed: ['@add_private_note', '@add_label'] };
  showAddScenarioModal.value = false;
  emitToast('Scenario Playbook Added', `"${newSc.title}" created.`, 'success');
}

function deleteScenario(sc: ScenarioItem) {
  scenarioRules.value = scenarioRules.value.filter(s => s.id !== sc.id);
  emitToast('Scenario Removed', `"${sc.title}" was removed.`, 'warning');
}

function submitQuickGuideline() {
  if (!quickGuidelineText.value.trim()) return;
  const newG: ResponseGuidelineItem = {
    id: Date.now(),
    rule: quickGuidelineText.value.trim(),
    category: 'Tone & Voice',
    enabled: true
  };
  guidelineRules.value.unshift(newG);
  quickGuidelineText.value = '';
  emitToast('Guideline Added', 'New response guideline saved.', 'success');
}

function adoptExampleGuideline(text: string, cat: ResponseGuidelineItem['category']) {
  guidelineRules.value.unshift({
    id: Date.now(),
    rule: text,
    category: cat,
    enabled: true
  });
  emitToast('Guideline Adopted', `Adopted "${text}".`, 'success');
}

function deleteGuideline(g: ResponseGuidelineItem) {
  guidelineRules.value = guidelineRules.value.filter(item => item.id !== g.id);
  emitToast('Guideline Removed', 'Response guideline removed.', 'warning');
}

function insertHandoffVariable(token: string) {
  handoffSettings.value.handoffMessage += ` ${token}`;
}

function insertResolutionVariable(token: string) {
  handoffSettings.value.resolutionMessage += ` ${token}`;
}

function saveHandoffSettings() {
  emitToast('Settings Saved', 'Handoff message and engine parameters updated.', 'success');
}

// ═══════════════════ FILTERS & SEARCH ═══════════════════
const searchQuery = ref('');
const statusFilter = ref<'all' | 'live' | 'draft'>('all');

const liveCount = computed(() => assistants.value.filter(a => a.status === 'live').length);
const draftCount = computed(() => assistants.value.filter(a => a.status === 'draft').length);

const filteredAssistants = computed(() => {
  return assistants.value.filter(ast => {
    const q = searchQuery.value.trim().toLowerCase();
    const matchesSearch =
      !q ||
      ast.name.toLowerCase().includes(q) ||
      ast.productName.toLowerCase().includes(q) ||
      ast.description.toLowerCase().includes(q);

    const matchesStatus =
      statusFilter.value === 'all' || ast.status === statusFilter.value;

    return matchesSearch && matchesStatus;
  });
});

// ═══════════════════ KNOWLEDGE DOCUMENTS DATA ═══════════════════
interface KnowledgeDocItem {
  id: number;
  title: string;
  url: string;
  type: 'pdf' | 'url' | 'csv' | 'docx';
  size?: string;
  time: string;
  status: string;
}

const knowledgeDocs = ref<KnowledgeDocItem[]>([
  {
    id: 1,
    title: '2026_Foodservice_Dairy_&_Beverages_Wholesale_Catalog.pdf',
    url: 'internal://catalogs/2026-dairy-beverage-wholesale.pdf',
    type: 'pdf',
    size: '12.4 MB',
    time: '2 hours ago',
    status: 'Trained'
  },
  {
    id: 2,
    title: 'JAKIM_Halal_Compliance_&_Meat_Import_Certificates_2026.pdf',
    url: 'internal://compliance/jakim-halal-import-cert-2026.pdf',
    type: 'pdf',
    size: '4.8 MB',
    time: '1 day ago',
    status: 'Trained'
  },
  {
    id: 3,
    title: 'Daily_Fresh_Seafood_&_Poultry_Spot_Price_Index.csv',
    url: 'internal://data-feeds/spot-prices-daily.csv',
    type: 'csv',
    size: '860 KB',
    time: 'Today, 06:30 AM',
    status: 'Trained'
  },
  {
    id: 4,
    title: 'B2B Foodservice Portal & Ordering Terms (MOQ & Delivery)',
    url: 'order.goldenharvest.com.my/horeca-terms',
    type: 'url',
    time: '3 days ago',
    status: 'Trained'
  },
  {
    id: 5,
    title: 'Cold-Chain Logistics Routes & Klang Valley Delivery Schedules',
    url: 'goldenharvest.com.my/logistics/cold-chain-coverage',
    type: 'url',
    time: '5 days ago',
    status: 'Trained'
  },
  {
    id: 6,
    title: 'Q1_Australian_Wagyu_&_Chilled_Beef_Wholesale_Price_Matrix.pdf',
    url: 'internal://catalogs/q1-wagyu-beef-cut-specs.pdf',
    type: 'pdf',
    size: '2.1 MB',
    time: '1 week ago',
    status: 'Trained'
  },
  {
    id: 7,
    title: 'Credit_Terms_&_30-Day_Net_Facility_Policy.docx',
    url: 'internal://finance/credit-terms-application-sop.docx',
    type: 'docx',
    size: '1.2 MB',
    time: '2 weeks ago',
    status: 'Trained'
  },
  {
    id: 8,
    title: 'HoReCa Quality Guarantee & Damaged Goods Return SOP',
    url: 'goldenharvest.com.my/policies/return-and-replacement-sop',
    type: 'url',
    time: '1 month ago',
    status: 'Trained'
  }
]);

const showAddDocModal = ref(false);
const newDocTitle = ref('');
const newDocType = ref<'pdf' | 'url' | 'csv' | 'docx'>('pdf');
const newDocUrl = ref('');
const isSyncing = ref(false);
const knowledgeSearch = ref('');
const knowledgeTypeFilter = ref<'all' | 'pdf' | 'url' | 'csv' | 'docx'>('all');

const filteredKnowledgeDocs = computed(() => {
  return knowledgeDocs.value.filter(doc => {
    const q = knowledgeSearch.value.trim().toLowerCase();
    const matchesSearch = !q ||
      doc.title.toLowerCase().includes(q) ||
      (doc.url && doc.url.toLowerCase().includes(q));
    const matchesType = knowledgeTypeFilter.value === 'all' || doc.type === knowledgeTypeFilter.value;
    return matchesSearch && matchesType;
  });
});

// ═══════════════════ TOOLS DATA ═══════════════════
interface CustomToolItem {
  id: number;
  name: string;
  method: 'GET' | 'POST';
  endpoint: string;
  authType: 'Bearer Token' | 'API Key' | 'None';
  description: string;
  enabled: boolean;
  callsCount: number;
}

const customTools = ref<CustomToolItem[]>([
  {
    id: 1,
    name: 'Order Lookup',
    method: 'GET',
    endpoint: 'https://api.goldenharvest.com.my/v1/orders/{order_id}',
    authType: 'Bearer Token',
    description: 'Looks up real-time delivery status, items list, and dispatch truck plate number.',
    enabled: true,
    callsCount: 84
  },
  {
    id: 2,
    name: 'Account & Credit Facility Status',
    method: 'GET',
    endpoint: 'https://api.goldenharvest.com.my/v1/accounts/{account_id}/credit',
    authType: 'API Key',
    description: 'Checks customer 30-day net credit balance, remaining limit, and overdue invoice status.',
    enabled: true,
    callsCount: 126
  }
]);

const showCreateToolModal = ref(false);
const newToolForm = ref<{
  name: string;
  method: 'GET' | 'POST';
  endpoint: string;
  authType: 'Bearer Token' | 'API Key' | 'None';
  description: string;
}>({
  name: '',
  method: 'GET',
  endpoint: '',
  authType: 'Bearer Token',
  description: ''
});

function submitCreateTool() {
  if (!newToolForm.value.name.trim()) {
    emitToast('Name Required', 'Please provide a tool name.', 'warning');
    return;
  }
  const cleanName = newToolForm.value.name.trim();
  const slug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const endpoint = newToolForm.value.endpoint.trim() || `https://api.goldenharvest.com.my/v1/${slug}`;

  if (!endpoint.startsWith('http://') && !endpoint.startsWith('https://')) {
    emitToast('Invalid Protocol', 'Endpoint URL must begin with http:// or https://', 'warning');
    return;
  }

  customTools.value.unshift({
    id: Date.now(),
    name: cleanName,
    method: newToolForm.value.method,
    endpoint,
    authType: newToolForm.value.authType,
    description: newToolForm.value.description.trim() || `Custom API integration for ${cleanName}.`,
    enabled: true,
    callsCount: 0
  });

  newToolForm.value = { name: '', method: 'GET', endpoint: '', authType: 'Bearer Token', description: '' };
  showCreateToolModal.value = false;
  emitToast('Tool Created', `"${cleanName}" is now available for the assistant.`, 'success');
}

function testToolConnection(tool: CustomToolItem) {
  emitToast('Endpoint Verified', `200 OK — "${tool.name}" responded in 38ms latency.`, 'success');
}

function adoptTemplateTool(templateName: string) {
  let toolData: Partial<CustomToolItem> = {
    name: templateName,
    method: 'GET',
    authType: 'Bearer Token',
    description: `Lookup details for ${templateName}.`,
    endpoint: 'https://api.goldenharvest.com.my/v1/action'
  };

  if (templateName === 'Order Lookup') {
    toolData = {
      name: 'Order Lookup',
      method: 'GET',
      authType: 'Bearer Token',
      description: 'Looks up live delivery status and item packing details by order ID.',
      endpoint: 'https://api.goldenharvest.com.my/v1/orders/{order_id}'
    };
  } else if (templateName.includes('Credit') || templateName.includes('Account')) {
    toolData = {
      name: 'Account Status & Net Credit Limit',
      method: 'GET',
      authType: 'API Key',
      description: 'Checks customer 30-day net credit facility balance and invoice status.',
      endpoint: 'https://api.goldenharvest.com.my/v1/accounts/{account_id}/credit'
    };
  } else {
    toolData = {
      name: 'Cold-Chain Reefer Route ETA',
      method: 'GET',
      authType: 'Bearer Token',
      description: 'Checks daily morning reefer truck ETA (-18°C / +4°C) by postal code.',
      endpoint: 'https://api.goldenharvest.com.my/v1/logistics/routes?postal={postal_code}'
    };
  }

  customTools.value.unshift({
    id: Date.now(),
    name: toolData.name!,
    method: toolData.method as 'GET' | 'POST',
    endpoint: toolData.endpoint!,
    authType: toolData.authType as 'Bearer Token' | 'API Key' | 'None',
    description: toolData.description!,
    enabled: true,
    callsCount: 0
  });
  emitToast('Template Adopted', `"${toolData.name}" added to custom tools.`, 'success');
}

function promptDeleteTool(tool: CustomToolItem) {
  deleteTargetId.value = tool.id;
  deleteTargetType.value = 'tool';
  deleteTargetName.value = tool.name;
  showDeleteModal.value = true;
}

function deleteTool(tool: CustomToolItem) {
  promptDeleteTool(tool);
}

// ═══════════════════ PLAYGROUND DATA ═══════════════════
const playgroundInput = ref('');
const hasTestedInPlayground = ref(true);
const playgroundMessages = ref<ChatMsg[]>([
  {
    sender: 'bot',
    text: 'Hello! I am Golden Harvest F&B AI. How can I assist you with wholesale food ingredients, cold-chain schedules, or account onboarding today?',
    time: '12:00 PM'
  }
]);

function sendPlaygroundMessage(text?: string) {
  const query = text || playgroundInput.value;
  if (!query || !query.trim()) return;
  const userText = query.trim();
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  playgroundMessages.value.push({ sender: 'user', text: userText, time });
  playgroundInput.value = '';
  hasTestedInPlayground.value = true;

  setTimeout(() => {
    let reply = 'Thank you for contacting Golden Harvest Foodservice. All our dairy, poultry, and dry goods are 100% JAKIM Halal certified with cold-chain batch tracking.';
    const lower = userText.toLowerCase();
    if (lower.includes('moq') || lower.includes('butter') || lower.includes('cream') || lower.includes('minimum') || lower.includes('price') || lower.includes('harga')) {
      reply = 'For commercial dairy (Anchor, Tatua, Elle & Vire), our MOQ is 5 cartons per order. Bulk discount of 8% applies for orders above 30 cartons with next-day cold chain delivery.';
    } else if (lower.includes('deliver') || lower.includes('cold') || lower.includes('penang') || lower.includes('johor') || lower.includes('klang')) {
      reply = 'Yes, we operate daily temperature-controlled reefers (-18°C to +4°C) across Klang Valley, with scheduled Tuesday/Thursday runs to Penang, Ipoh, and Johor Bahru.';
    } else if (lower.includes('credit') || lower.includes('term') || lower.includes('payment') || lower.includes('invoice')) {
      reply = 'Registered HoReCa businesses with minimum 3 months ordering history can apply for our 30-Day Net Credit Facility. Would you like me to connect you with Hafiz Rahman to submit your SSM & financial docs?';
    } else if (lower.includes('speak') || lower.includes('human') || lower.includes('rep') || lower.includes('agent')) {
      reply = 'I am routing this wholesale chat to Hafiz Rahman (Key Account Manager) right away. He will attend to you on WhatsApp within 5 minutes.';
    }
    playgroundMessages.value.push({ sender: 'bot', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
  }, 450);
}

function resetPlayground() {
  playgroundMessages.value = [
    {
      sender: 'bot',
      text: 'Hello! I am Golden Harvest F&B AI. How can I assist you with wholesale food ingredients, cold-chain schedules, or account onboarding today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ];
  emitToast('Playground Reset', 'Conversation cleared.', 'info');
}

// ═══════════════════ CONNECT / INBOXES DATA ═══════════════════
interface ConnectedInboxItem {
  id: number;
  name: string;
  identifier: string;
  type: 'whatsapp' | 'webchat' | 'telegram';
  status: 'active' | 'inactive';
  todayChats: number;
  connectedAt: string;
}

const connectedInboxes = ref<ConnectedInboxItem[]>([
  {
    id: 1,
    name: 'Golden Harvest WhatsApp (+6013-882 1928)',
    identifier: '+6013-882 1928',
    type: 'whatsapp',
    status: 'active',
    todayChats: 42,
    connectedAt: 'Connected 12 days ago'
  },
  {
    id: 2,
    name: 'B2B Wholesale Order Portal',
    identifier: 'order.goldenharvest.com.my',
    type: 'webchat',
    status: 'active',
    todayChats: 18,
    connectedAt: 'Connected 3 weeks ago'
  }
]);

const showConnectInboxModal = ref(false);
const newInboxForm = ref<{
  type: 'whatsapp' | 'webchat' | 'telegram';
  name: string;
  phone: string;
}>({
  type: 'whatsapp',
  name: '',
  phone: ''
});

function submitConnectInbox() {
  if (!newInboxForm.value.name.trim()) {
    emitToast('Name Required', 'Please enter an inbox display name.', 'warning');
    return;
  }
  const cleanName = newInboxForm.value.name.trim();
  const identifier = newInboxForm.value.phone.trim() || '+6013-882 1928';

  connectedInboxes.value.unshift({
    id: Date.now(),
    name: cleanName,
    identifier,
    type: newInboxForm.value.type,
    status: 'active',
    todayChats: 0,
    connectedAt: 'Connected just now'
  });

  newInboxForm.value = { type: 'whatsapp', name: '', phone: '' };
  showConnectInboxModal.value = false;
  emitToast('Inbox Connected', `"${cleanName}" linked to AI Assistant.`, 'success');
}

function promptDeleteInbox(inbox: ConnectedInboxItem) {
  deleteTargetId.value = inbox.id;
  deleteTargetType.value = 'inbox';
  deleteTargetName.value = inbox.name;
  showDeleteModal.value = true;
}

function deleteInbox(inbox: ConnectedInboxItem) {
  promptDeleteInbox(inbox);
}

// ═══════════════════ ESCALATION KEYWORDS ═══════════════════
const escalationKeywords = ref<string[]>([
  'MOQ',
  'Quotation',
  'Credit Terms',
  'Urgent Restock'
]);
const newKeywordInput = ref('');

function addKeyword() {
  const kw = newKeywordInput.value.trim();
  if (kw && !escalationKeywords.value.includes(kw)) {
    escalationKeywords.value.push(kw);
    emitToast('Trigger Added', `Keyword "${kw}" will now trigger rep handoff.`, 'success');
  }
  newKeywordInput.value = '';
}

function removeKeyword(index: number) {
  const removed = escalationKeywords.value.splice(index, 1)[0];
  emitToast('Trigger Removed', `"${removed}" removed from handoff keywords.`, 'info');
}

// ═══════════════════ REPORT / ANALYTICS DATA ═══════════════════
const reportDateRange = ref<'24h' | '7d' | '30d' | '90d'>('7d');
const reportChannelFilter = ref('all');

// ═══════════════════ METHODS ═══════════════════
function openAssistantDetail(ast: AssistantItem) {
  currentAssistant.value = ast;
  editForm.value = {
    name: ast.name,
    productName: ast.productName,
    description: ast.description,
    identityResponse: ast.identityResponse,
    tone: ast.tone || 'Consultative & Helpful',
    commercialGoal: ast.commercialGoal || 'Qualify Accounts & Take Orders',
    fallbackRep: ast.fallbackRep || 'Hafiz Rahman (Key Account Manager)',
    features: { ...ast.features }
  };
  activeDetailTab.value = 'identity';
  viewMode.value = 'detail';
}

function backToList() {
  viewMode.value = 'list';
  currentAssistant.value = null;
}

function openCreateModal() {
  createForm.value = {
    name: '',
    description: '',
    productName: ''
  };
  showCreateModal.value = true;
}

function submitCreateAssistant() {
  if (!createForm.value.name.trim()) {
    emitToast('Name Required', 'Please provide a name for your new assistant.', 'warning');
    return;
  }

  const newAssistant: AssistantItem = {
    id: Date.now(),
    name: createForm.value.name.trim(),
    productName: createForm.value.productName.trim() || 'Golden Harvest Foodservice',
    description: createForm.value.description.trim() || `${createForm.value.name} assistant`,
    identityResponse: `Hi! I am ${createForm.value.name.trim()} here to assist with wholesale foodservice orders.`,
    tone: 'Consultative & Helpful',
    commercialGoal: 'Qualify Accounts & Take Orders',
    fallbackRep: 'Hafiz Rahman (Key Account Manager)',
    connectedPhone: '+6013-882 1928',
    status: 'draft',
    guardrailsCount: 0,
    docsCount: 0,
    inboxCount: 1,
    resolutionRate: '0%',
    lastEdited: 'Just now',
    features: {
      faqGeneration: true,
      rememberDetails: true,
      sourceCitations: true
    }
  };

  assistants.value.unshift(newAssistant);
  showCreateModal.value = false;
  emitToast('Assistant Created', `${newAssistant.name} was created as a Draft.`, 'success');
  openAssistantDetail(newAssistant);
}

function saveIdentityChanges() {
  if (!currentAssistant.value) return;
  currentAssistant.value.name = editForm.value.name;
  currentAssistant.value.productName = editForm.value.productName;
  currentAssistant.value.description = editForm.value.description;
  currentAssistant.value.identityResponse = editForm.value.identityResponse;
  currentAssistant.value.tone = editForm.value.tone;
  currentAssistant.value.commercialGoal = editForm.value.commercialGoal;
  currentAssistant.value.fallbackRep = editForm.value.fallbackRep;
  currentAssistant.value.features = { ...editForm.value.features };
  currentAssistant.value.lastEdited = 'Just now';
  emitToast('Changes Saved', 'Sales persona and CRM intelligence settings updated.', 'success');
}

function resetIdentityForm() {
  if (!currentAssistant.value) return;
  editForm.value = {
    name: currentAssistant.value.name,
    productName: currentAssistant.value.productName,
    description: currentAssistant.value.description,
    identityResponse: currentAssistant.value.identityResponse,
    tone: currentAssistant.value.tone || 'Consultative & Helpful',
    commercialGoal: currentAssistant.value.commercialGoal || 'Qualify Accounts & Take Orders',
    fallbackRep: currentAssistant.value.fallbackRep || 'Hafiz Rahman (Key Account Manager)',
    features: { ...currentAssistant.value.features }
  };
  emitToast('Discarded', 'Reverted to last saved settings.', 'info');
}

function requestStatusToggle(ast: AssistantItem) {
  if (ast.status === 'draft') {
    pendingPublishAssistant.value = ast;
    showPreflightModal.value = true;
  } else {
    ast.status = 'draft';
    ast.lastEdited = 'Just now';
    emitToast('Moved to Draft', `${ast.name} is now offline.`, 'info');
  }
}

function confirmPublishLive() {
  if (pendingPublishAssistant.value) {
    pendingPublishAssistant.value.status = 'live';
    pendingPublishAssistant.value.lastEdited = 'Just now';
    emitToast('Live on WhatsApp', `${pendingPublishAssistant.value.name} is now active across connected channels.`, 'success');
  }
  showPreflightModal.value = false;
  pendingPublishAssistant.value = null;
}

function duplicateAssistant(ast: AssistantItem) {
  const dup: AssistantItem = {
    ...ast,
    id: Date.now(),
    name: `${ast.name} (Copy)`,
    status: 'draft',
    lastEdited: 'Just now'
  };
  assistants.value.push(dup);
  emitToast('Assistant Duplicated', `Created copy of ${ast.name}.`, 'success');
}

function promptDeleteAssistant(ast: AssistantItem) {
  deleteTargetId.value = ast.id;
  deleteTargetType.value = 'assistant';
  deleteTargetName.value = ast.name;
  showDeleteModal.value = true;
}

function promptDeleteDoc(doc: KnowledgeDocItem) {
  deleteTargetId.value = doc.id;
  deleteTargetType.value = 'doc';
  deleteTargetName.value = doc.title;
  showDeleteModal.value = true;
}

function executeConfirmedDelete() {
  if (!deleteTargetId.value) return;

  if (deleteTargetType.value === 'assistant') {
    assistants.value = assistants.value.filter(a => a.id !== deleteTargetId.value);
    if (currentAssistant.value?.id === deleteTargetId.value) {
      backToList();
    }
    emitToast('Assistant Deleted', `${deleteTargetName.value} removed.`, 'warning');
  } else if (deleteTargetType.value === 'doc') {
    knowledgeDocs.value = knowledgeDocs.value.filter(d => d.id !== deleteTargetId.value);
    if (currentAssistant.value) {
      currentAssistant.value.docsCount = knowledgeDocs.value.length;
    }
    emitToast('Document Removed', `${deleteTargetName.value} deleted from knowledge base.`, 'warning');
  } else if (deleteTargetType.value === 'tool') {
    customTools.value = customTools.value.filter(t => t.id !== deleteTargetId.value);
    emitToast('Tool Deleted', `"${deleteTargetName.value}" removed.`, 'warning');
  } else if (deleteTargetType.value === 'inbox') {
    connectedInboxes.value = connectedInboxes.value.filter(i => i.id !== deleteTargetId.value);
    emitToast('Inbox Disconnected', `"${deleteTargetName.value}" was unlinked.`, 'warning');
  }

  showDeleteModal.value = false;
  deleteTargetId.value = null;
}

function toggleMenu(id: number) {
  openMenuId.value = openMenuId.value === id ? null : id;
}

function submitAddDocument() {
  if (!newDocTitle.value.trim()) {
    emitToast('Title Required', 'Please provide a document title.', 'warning');
    return;
  }
  const cleanTitle = newDocTitle.value.trim();
  const slug = cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const fallbackUrl = newDocType.value === 'url'
    ? 'order.goldenharvest.com.my'
    : `internal://${newDocType.value}/${slug}`;

  const newDoc: KnowledgeDocItem = {
    id: Date.now(),
    title: cleanTitle,
    url: newDocUrl.value.trim() || fallbackUrl,
    type: newDocType.value,
    size: newDocType.value === 'url' ? undefined : '2.4 MB',
    time: 'Just now',
    status: 'Trained'
  };
  knowledgeDocs.value.unshift(newDoc);
  if (currentAssistant.value) {
    currentAssistant.value.docsCount = knowledgeDocs.value.length;
  }
  showAddDocModal.value = false;
  newDocTitle.value = '';
  newDocUrl.value = '';
  newDocType.value = 'pdf';
  emitToast('Knowledge Indexed', `${newDoc.title} added to assistant knowledge.`, 'success');
}

function syncAllDocs() {
  isSyncing.value = true;
  setTimeout(() => {
    isSyncing.value = false;
    emitToast('Knowledge Synced', `${knowledgeDocs.value.length} documents vector re-indexed.`, 'success');
  }, 1200);
}

// Global click-outside & Escape key handlers
function handleGlobalKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    if (showTestDrawer.value) showTestDrawer.value = false;
    if (showCreateModal.value) showCreateModal.value = false;
    if (showDeleteModal.value) showDeleteModal.value = false;
    if (showPreflightModal.value) showPreflightModal.value = false;
    if (showAddDocModal.value) showAddDocModal.value = false;
    if (showGuideModal.value) showGuideModal.value = false;
    if (showAddGuardrailModal.value) showAddGuardrailModal.value = false;
    if (showAddScenarioModal.value) showAddScenarioModal.value = false;
    if (showAddGuidelineModal.value) showAddGuidelineModal.value = false;
    if (showCreateToolModal.value) showCreateToolModal.value = false;
    if (showConnectInboxModal.value) showConnectInboxModal.value = false;
    if (openMenuId.value) openMenuId.value = null;
  }
}

function handleGlobalClick() {
  if (openMenuId.value) openMenuId.value = null;
}

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown);
  window.addEventListener('click', handleGlobalClick);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown);
  window.removeEventListener('click', handleGlobalClick);
});
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes scaleUp {
  from { opacity: 0; transform: scale(0.97); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes slideLeft {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.animate-fade-in {
  animation: fadeIn 0.18s ease-out forwards;
}

.animate-scale-up {
  animation: scaleUp 0.18s ease-out forwards;
}

.animate-slide-left {
  animation: slideLeft 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
