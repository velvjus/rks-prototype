<template>
  <div class="h-screen w-full bg-[#f9fafb] flex flex-col font-sans selection:bg-[#23B750]/20 selection:text-emerald-900 text-slate-800 overflow-hidden relative">
    <!-- ========================================================= -->
    <!-- PERSISTENT TOP-LEFT BRAND LOGO                            -->
    <!-- ========================================================= -->
    <div class="fixed top-5 left-6 sm:left-8 lg:left-10 z-40">
      <router-link
        to="/dashboard"
        class="inline-block transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[#23B750] focus-visible:outline-none rounded"
        title="Return to RakanSales CRM"
      >
        <img :src="lightLogoUrl" class="h-7 sm:h-8 w-auto" alt="RakanSales Logo" />
      </router-link>
    </div>

    <!-- ========================================================= -->
    <!-- GLOBAL TOP HEADER (TOTALLY HIDDEN, REVEALS ONLY ON HOVER) -->
    <!-- ========================================================= -->
    <div class="fixed top-0 left-0 w-full z-50 group pointer-events-none">
      <!-- Invisible hover sensor strip at the top edge of viewport (absolute, zero layout impact) -->
      <div class="absolute top-0 left-0 h-6 w-full pointer-events-auto"></div>

      <!-- Hidden navigation bar, slides down smoothly flush against the top edge -->
      <header
        class="w-full bg-white/95 backdrop-blur-md border-b border-gray-200/80 px-6 sm:px-10 py-3 flex items-center justify-between shadow-md transition-all duration-300 ease-out transform -translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 pointer-events-auto"
      >
        <!-- Brand Logo & Context -->
        <div class="flex items-center gap-3">
          <router-link to="/dashboard" class="flex items-center gap-2.5 group/logo" title="Return to RakanSales">
            <svg class="h-7 w-auto text-[#23B750] transition-transform group-hover/logo:scale-102" viewBox="0 0 1085 160" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill="#23b750" d="M256.46,25.78A38.7,38.7,0,0,1,270,32.54a28.91,28.91,0,0,1,8.39,10.8,34.87,34.87,0,0,1,2.87,14.45q0,12-5.9,19.88T258.71,89.32l22.83,38.21H253.43l-20.51-35.1H218.16v35.1H194.24V23.45h44A65.53,65.53,0,0,1,256.46,25.78ZM237.58,73.63a29.66,29.66,0,0,0,7.77-.93A17.41,17.41,0,0,0,251.17,70a11.71,11.71,0,0,0,3.65-4.35,13.48,13.48,0,0,0,0-11.34A11.1,11.1,0,0,0,251.17,50a19.36,19.36,0,0,0-5.82-2.72,27.56,27.56,0,0,0-7.77-1H218.16V73.63Z"/>
              <path fill="#23b750" d="M378.48,127.53H355.33V117.9a25.23,25.23,0,0,1-9.24,8.08q-5.67,3-14.37,3a39.14,39.14,0,0,1-15.93-3.18,35.9,35.9,0,0,1-12.34-8.86,40.81,40.81,0,0,1-8-13.43,47.89,47.89,0,0,1-2.88-16.78,49.46,49.46,0,0,1,2.88-17.17,39.16,39.16,0,0,1,8.07-13.43A38.45,38.45,0,0,1,316,47.22,38,38,0,0,1,331.72,44q8.7,0,14.37,3a25.59,25.59,0,0,1,9.24,8.32V45.51h23.15Zm-23.15-43.8a17.49,17.49,0,0,0-1.94-6.68,18.57,18.57,0,0,0-4.2-5.36,20.86,20.86,0,0,0-21.35-3.34,17,17,0,0,0-6.06,4.35,20.74,20.74,0,0,0-5.28,14,20.27,20.27,0,0,0,1.39,7.45,19,19,0,0,0,3.89,6.22,17.76,17.76,0,0,0,6.14,4.19,21.26,21.26,0,0,0,15.37.24,20.76,20.76,0,0,0,5.9-3.5,17.58,17.58,0,0,0,4.2-5.28,17.3,17.3,0,0,0,1.94-6.52Z"/>
              <path fill="#23b750" d="M395.88,15.68H419V75h5.75l18.49-29.52h28.12L446.21,85.9l28.9,41.63H445.28l-20-30.75H419v30.75H395.88Z"/>
              <path fill="#23b750" d="M564.58,127.53H541.44V117.9a25.34,25.34,0,0,1-9.25,8.08q-5.67,3-14.37,3a39.09,39.09,0,0,1-15.92-3.18,35.84,35.84,0,0,1-12.35-8.86,41,41,0,0,1-8-13.43,47.89,47.89,0,0,1-2.88-16.78,49.46,49.46,0,0,1,2.88-17.17,39.34,39.34,0,0,1,8.08-13.43,38.41,38.41,0,0,1,12.42-8.86A38,38,0,0,1,517.82,44q8.7,0,14.37,3a25.71,25.71,0,0,1,9.25,8.32V45.51h23.14Zm-23.14-43.8a17.67,17.67,0,0,0-1.94-6.68,18.57,18.57,0,0,0-4.2-5.36,20.34,20.34,0,0,0-5.9-3.58,21.51,21.51,0,0,0-15.46.24,17.16,17.16,0,0,0-6.06,4.35,20.87,20.87,0,0,0-5.28,14,20.28,20.28,0,0,0,1.4,7.45,19,19,0,0,0,3.88,6.22,17.85,17.85,0,0,0,6.14,4.19,21.29,21.29,0,0,0,15.38.24,21,21,0,0,0,5.9-3.5,17.81,17.81,0,0,0,6.14-11.8Z"/>
              <path fill="#23b750" d="M582,45.51h23.15v12a30.75,30.75,0,0,1,11-9.94A31.47,31.47,0,0,1,631.23,44a29.68,29.68,0,0,1,11.88,2.25A25.87,25.87,0,0,1,652,52.42a28.3,28.3,0,0,1,5.67,9.48,35.4,35.4,0,0,1,2,12.2v53.43H636.51V82.17a17,17,0,0,0-1.09-6.29,15.3,15.3,0,0,0-2.95-4.74,12.84,12.84,0,0,0-4.35-3.1A13.73,13.73,0,0,0,622.53,67a14.77,14.77,0,0,0-7,1.63,17.47,17.47,0,0,0-5.36,4.35,21.64,21.64,0,0,0-3.58,6.21,23.63,23.63,0,0,0-1.47,7.38v41H582Z"/>
              <path fill="#23b750" d="M679.38,54.21q0-15.54,10.64-23.93t30.37-8.38q20.36,0,30.84,9.09t10.64,25.09H737.32a15.65,15.65,0,0,0-1.08-5.83,12.14,12.14,0,0,0-3.19-4.59,14.33,14.33,0,0,0-5.44-2.87,27.89,27.89,0,0,0-8-1c-5,0-8.89,1-11.73,2.88a9.24,9.24,0,0,0-4.27,8.15,8.91,8.91,0,0,0,1.7,5.52,13.91,13.91,0,0,0,4.59,3.8,30.41,30.41,0,0,0,6.68,2.57q3.79,1,8,1.94,6.52,1.39,13.51,3a50.09,50.09,0,0,1,12.82,4.82,27.25,27.25,0,0,1,9.55,8.61q3.74,5.45,3.73,14.45a31.89,31.89,0,0,1-2.56,13,25.34,25.34,0,0,1-7.92,9.94,39.21,39.21,0,0,1-13.37,6.37,70.52,70.52,0,0,1-18.87,2.25,72.06,72.06,0,0,1-19.34-2.33,39.21,39.21,0,0,1-13.9-6.76,28,28,0,0,1-8.39-10.72,34.52,34.52,0,0,1-2.8-14.21H701.6q.61,7,5.67,10.64t14.37,3.65q8.39,0,13-2.87t4.58-7.7a8.56,8.56,0,0,0-1.79-5.59,13.16,13.16,0,0,0-4.89-3.57,38.3,38.3,0,0,0-7.22-2.33c-2.75-.62-5.62-1.19-8.63-1.71q-6.36-1.25-13-2.87a43.56,43.56,0,0,1-12-4.9,25.57,25.57,0,0,1-8.85-8.93Q679.38,63.22,679.38,54.21Z"/>
              <path fill="#23b750" d="M861,127.53H837.83V117.9a25.23,25.23,0,0,1-9.24,8.08q-5.67,3-14.37,3a39.05,39.05,0,0,1-15.92-3.18A35.84,35.84,0,0,1,786,116.89a40.81,40.81,0,0,1-8-13.43,47.89,47.89,0,0,1-2.88-16.78A49.46,49.46,0,0,1,778,69.51,39.16,39.16,0,0,1,786,56.08a38.56,38.56,0,0,1,12.43-8.86A38,38,0,0,1,814.22,44q8.7,0,14.37,3a25.59,25.59,0,0,1,9.24,8.32V45.51H861Zm-23.15-43.8a17.31,17.31,0,0,0-1.94-6.68,18.71,18.71,0,0,0-4.19-5.36,20.34,20.34,0,0,0-5.9-3.58,21.51,21.51,0,0,0-15.46.24,17.07,17.07,0,0,0-6.06,4.35,21.09,21.09,0,0,0-3.89,6.36A20.82,20.82,0,0,0,799,86.68a20.27,20.27,0,0,0,1.39,7.45,19.17,19.17,0,0,0,3.89,6.22,17.85,17.85,0,0,0,6.14,4.19,21.29,21.29,0,0,0,15.38.24,21,21,0,0,0,5.9-3.5A17.7,17.7,0,0,0,835.89,96a17.12,17.12,0,0,0,1.94-6.52Z"/>
              <path fill="#23b750" d="M878.38,15.68h23.14V127.53H878.38Z"/>
              <path fill="#23b750" d="M938.34,91.65a21.47,21.47,0,0,0,2.25,6.6,18.11,18.11,0,0,0,9.94,8.62,21,21,0,0,0,7.38,1.24,17.63,17.63,0,0,0,9.17-2.48,17.9,17.9,0,0,0,6.37-6.06h25a36,36,0,0,1-14.14,21.36,41.25,41.25,0,0,1-12.11,5.91,50.39,50.39,0,0,1-14.76,2.09,45.31,45.31,0,0,1-17.17-3.18,41,41,0,0,1-13.59-8.86,39.83,39.83,0,0,1-8.93-13.43,44.13,44.13,0,0,1-3.19-16.94,44.7,44.7,0,0,1,3.19-17,39.79,39.79,0,0,1,22.29-22.37A44.68,44.68,0,0,1,957.14,44a47.42,47.42,0,0,1,16.08,2.64,41.56,41.56,0,0,1,13,7.38,39.39,39.39,0,0,1,9.16,11.26,37.25,37.25,0,0,1,4.35,14.45q.31,3.42.39,6.13t-.07,5.83Zm36.82-12.74a15.26,15.26,0,0,0-2-5.67,17,17,0,0,0-3.88-4.43,18.86,18.86,0,0,0-11.81-4,20.81,20.81,0,0,0-6.6,1,17.37,17.37,0,0,0-5.36,2.88,17,17,0,0,0-4,4.51,20.13,20.13,0,0,0-2.41,5.74Z"/>
              <path fill="#23b750" d="M1011.66,69.9q0-12.42,9-19.18T1045.84,44q16.94,0,25.71,7.07t9.09,19.8h-23.46a8.79,8.79,0,0,0-3-6.76q-2.87-2.4-8.15-2.4-5.61,0-8.47,1.86a6.08,6.08,0,0,0-2.87,5.44,6.26,6.26,0,0,0,3.49,5.82A32.12,32.12,0,0,0,1047,77.9q5.35,1.17,11.49,2.33A49.28,49.28,0,0,1,1070,83.88a24.33,24.33,0,0,1,8.94,7q3.57,4.51,3.57,12.28,0,11.8-8.93,18.72t-27,6.91a61.55,61.55,0,0,1-16.16-1.87,33.92,33.92,0,0,1-11.5-5.35,21.64,21.64,0,0,1-6.91-8.55,27,27,0,0,1-2.25-11.11h23.3a8.71,8.71,0,0,0,3.65,7c2.23,1.56,5.51,2.33,9.87,2.33,4.14,0,7.24-.62,9.32-1.86a6,6,0,0,0,3.1-5.44,5.69,5.69,0,0,0-3.57-5.44,39.17,39.17,0,0,0-8.78-2.79q-5.2-1.08-11.34-2.18a44.7,44.7,0,0,1-11.41-3.57,22.78,22.78,0,0,1-8.78-7.22Q1011.67,78,1011.66,69.9Z"/>
              <path fill="#23b750" d="M2.5,10.85V120.08a9,9,0,0,0,14.23,7.41l31-21.69V24a8.66,8.66,0,0,1,8.66-8.66h0a8.64,8.64,0,0,1,7.42,4.2l51.74,86.23h13.57a9,9,0,0,0,9-9V10.85a9,9,0,0,0-9-9H11.54A9,9,0,0,0,2.5,10.85Z"/>
              <path fill="#62d816" d="M47.72,105.8v45.44a7,7,0,0,0,3.84,6.22h0a7,7,0,0,0,8.68-2.05l20.26-27a7.86,7.86,0,0,1,8.75-2.73L122,136.6a6.56,6.56,0,0,0,5-.36h0a6.54,6.54,0,0,0,2.51-9.47l-14-21Z"/>
            </svg>
          </router-link>
          <span class="text-xs font-semibold text-gray-400 select-none">/</span>
          <span class="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 select-none">
            Partner Network
          </span>
        </div>

        <!-- Center: Prototype Step Switcher -->
        <nav aria-label="Step progress switcher" class="hidden md:flex items-center gap-1 bg-gray-100/90 p-1 rounded-xl text-xs font-semibold">
          <button
            type="button"
            @click="goToStep(1)"
            :class="[
              'px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#23B750] focus-visible:outline-none',
              currentStep === 1 ? 'bg-white text-gray-900 shadow-xs font-bold' : 'text-gray-500 hover:text-gray-900'
            ]"
          >
            <span class="w-1.5 h-1.5 rounded-full" :class="currentStep === 1 ? 'bg-[#23B750]' : 'bg-transparent'"></span>
            <span>1. Track</span>
          </button>
          <button
            type="button"
            @click="goToStep(2)"
            :class="[
              'px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#23B750] focus-visible:outline-none',
              currentStep === 2 ? 'bg-white text-gray-900 shadow-xs font-bold' : 'text-gray-500 hover:text-gray-900'
            ]"
          >
            <span class="w-1.5 h-1.5 rounded-full" :class="currentStep === 2 ? 'bg-[#23B750]' : 'bg-transparent'"></span>
            <span>2. Account</span>
          </button>
          <button
            type="button"
            @click="goToStep(3)"
            :class="[
              'px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#23B750] focus-visible:outline-none',
              currentStep === 3 ? 'bg-white text-gray-900 shadow-xs font-bold' : 'text-gray-500 hover:text-gray-900'
            ]"
          >
            <span class="w-1.5 h-1.5 rounded-full" :class="currentStep === 3 ? 'bg-[#23B750]' : 'bg-transparent'"></span>
            <span>3. Profile</span>
          </button>
          <button
            type="button"
            @click="goToStep(4)"
            :class="[
              'px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#23B750] focus-visible:outline-none',
              currentStep === 4 ? 'bg-[#23B750] text-white shadow-xs font-bold' : 'text-gray-500 hover:text-gray-900'
            ]"
          >
            <span>Success</span>
          </button>
        </nav>

        <!-- Right: Escape hatch back to CRM Dashboard -->
        <div class="flex items-center gap-3">
          <router-link
            to="/dashboard"
            class="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors border border-gray-200 shadow-2xs focus-visible:ring-2 focus-visible:ring-[#23B750] focus-visible:outline-none"
          >
            <ArrowLeft class="w-3.5 h-3.5" />
            <span>Back to CRM</span>
          </router-link>
        </div>
      </header>
    </div>

    <!-- Full-Screen Split Stage: Form Area (Left) + Visual Canvas (Right) -->
    <div class="flex-1 flex flex-col lg:flex-row w-full h-full min-h-0 relative overflow-hidden">
      <!-- ========================================================= -->
      <!-- LEFT PANE: PIXEL-PERFECT ANCHORED REGISTRATION WIZARD    -->
      <!-- ========================================================= -->
      <section
        aria-label="Registration Form Container"
        :class="[
          isRightPaneHovered ? 'lg:w-1/2' : 'lg:w-[70%]',
          'w-full h-full flex flex-col justify-between px-6 sm:px-12 md:px-16 lg:px-14 xl:px-20 pt-6 sm:pt-8 pb-3 sm:pb-4 bg-[#f9fafb] border-r border-gray-200/70 overflow-y-auto relative transition-all duration-500 ease-out'
        ]"
      >
        <!-- BALANCED WIZARD CONTAINER (Generous Breathing Room, Never Mushed) -->
        <div class="w-full max-w-xl mx-auto flex-1 flex flex-col justify-center min-h-0 py-2 my-auto">
          <!-- FIXED-HEIGHT WIZARD STAGE (Progress Bar Higher, Buttons Lower) -->
          <div class="w-full h-[660px] flex flex-col justify-between shrink-0">
            <!-- 1. STEPPER PROGRESS BAR (Fixed Height & Position - Moved Higher) -->
            <div class="h-[32px] shrink-0">
              <div v-if="currentStep <= 3" class="w-full space-y-1.5">
                <div class="flex items-center justify-between text-xs">
                  <span class="font-semibold text-[#23B750] tracking-wide uppercase text-[11px]">
                    Step {{ currentStep }} of 3
                  </span>
                  <span class="text-gray-400 font-medium text-[11px]">
                    {{ currentStep === 1 ? 'Select partner track' : currentStep === 2 ? 'Account information' : 'Referral reach & details' }}
                  </span>
                </div>

                <!-- Progress Segment Bars -->
                <div class="grid grid-cols-3 gap-2" role="progressbar" :aria-valuenow="currentStep" aria-valuemin="1" aria-valuemax="3">
                  <div class="h-1.5 rounded-full transition-all duration-300" :class="currentStep >= 1 ? 'bg-[#23B750]' : 'bg-gray-100'"></div>
                  <div class="h-1.5 rounded-full transition-all duration-300" :class="currentStep >= 2 ? 'bg-[#23B750]' : 'bg-gray-100'"></div>
                  <div class="h-1.5 rounded-full transition-all duration-300" :class="currentStep >= 3 ? 'bg-[#23B750]' : 'bg-gray-100'"></div>
                </div>
              </div>
              <div v-else class="h-[27px]"></div>
            </div>

            <!-- 2. STEP TITLE & SUBTITLE BLOCK -->
            <div
              class="h-[54px] shrink-0 text-center flex flex-col justify-center transition-opacity duration-200"
              :class="currentStep === 4 ? 'opacity-0 pointer-events-none' : ''"
            >
              <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight leading-tight">
                {{ currentStepTitle }}
              </h1>
              <p class="text-xs sm:text-sm text-gray-500 leading-relaxed mt-0.5">
                {{ currentStepSubtitle }}
              </p>
            </div>

            <!-- 3. STEP CONTENT (Spacious 375px Stage with Natural Top-Down Flow) -->
            <div class="h-[375px] shrink-0 flex flex-col justify-start">
          <!-- ============================================================== -->
          <!-- STEP 1: PARTNER TYPE (SPACIOUS, NO SCROLLBAR, SUBTLE GREEN TINT) -->
          <!-- ============================================================== -->
          <div v-if="currentStep === 1" class="flex flex-col justify-start animate-in fade-in-50 duration-200 pt-1">
            <!-- 2 Polished Track Cards with Clear Terminology & Earning Heroes -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <!-- Card 1: Referral Partner -->
              <div
                role="button"
                tabindex="0"
                @click="selectedPartnerType = 'referral'"
                @keydown.enter.prevent="selectedPartnerType = 'referral'"
                @keydown.space.prevent="selectedPartnerType = 'referral'"
                class="group relative rounded-2xl border-2 p-4 sm:p-4.5 flex flex-col justify-between cursor-pointer transition-all text-left focus-visible:ring-2 focus-visible:ring-[#23B750] focus-visible:outline-none"
                :class="[
                  selectedPartnerType === 'referral'
                    ? 'border-[#23B750] bg-emerald-50/50 ring-2 ring-[#23B750]/15 shadow-xs'
                    : 'border-gray-200 bg-white/70 hover:border-gray-300 hover:bg-white'
                ]"
              >
                <!-- Top Header Row: Status Badge & Selection Indicator -->
                <div class="flex items-center justify-between min-h-[24px]">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300">
                    Start Here
                  </span>
                  <div
                    class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                    :class="selectedPartnerType === 'referral' ? 'border-[#23B750] bg-[#23B750] text-white shadow-xs' : 'border-gray-300 bg-white'"
                  >
                    <Check v-if="selectedPartnerType === 'referral'" class="w-3 h-3 stroke-[3]" />
                  </div>
                </div>

                <!-- Mascot & Title with Harmonious Breathing Room -->
                <div class="text-center py-0.5 space-y-1.5">
                  <h3 class="font-bold text-gray-900 text-base">Referral Partner</h3>

                  <!-- Authentic Live Robot Mascot Group Graphic -->
                  <div class="h-18 sm:h-20 w-full flex items-center justify-center">
                    <img
                      src="/brand-assets/partner/referral-partner-illustration.png"
                      alt="Referral Partner Mascot Team"
                      class="max-h-18 sm:max-h-20 max-w-full object-contain filter drop-shadow-sm transition-transform group-hover:scale-105 duration-200"
                    />
                  </div>

                  <p class="text-xs text-gray-500 leading-normal px-1">
                    Share your link with contacts. We handle demos & closing.
                  </p>
                </div>

                <!-- Commission Earning Hero Box (Balanced & Spacious) -->
                <div class="py-1.5 px-2.5 rounded-lg bg-white/90 border border-emerald-200/80 text-center space-y-0.5 shadow-2xs">
                  <span class="text-[9px] font-bold text-emerald-900 uppercase tracking-wider block">Direct Payout</span>
                  <div class="text-sm sm:text-base font-semibold text-emerald-900 font-mono leading-tight">RM 300 – RM 500</div>
                  <span class="text-[10px] text-emerald-800 font-medium block">Flat fee per closed deal</span>
                </div>

                <!-- Key Highlights Checklist -->
                <div class="space-y-1.5 pt-2 text-[11px] text-gray-600 border-t border-gray-100/90">
                  <div class="flex items-center gap-2">
                    <Check class="w-3.5 h-3.5 text-[#23B750] shrink-0 stroke-[2.5]" />
                    <span>100% hands-off · No selling needed</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <Check class="w-3.5 h-3.5 text-[#23B750] shrink-0 stroke-[2.5]" />
                    <span>Bi-weekly payout directly to bank</span>
                  </div>
                </div>
              </div>

              <!-- Card 2: Sales Partner (Locked with Inline Modal Trigger) -->
              <div
                role="button"
                tabindex="0"
                @click="openSalesPartnerModal"
                @keydown.enter.prevent="openSalesPartnerModal"
                @keydown.space.prevent="openSalesPartnerModal"
                class="group relative rounded-2xl border-2 p-4 sm:p-4.5 flex flex-col justify-between text-left transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#23B750] focus-visible:outline-none"
                :class="[
                  selectedPartnerType === 'sales'
                    ? 'border-[#23B750] bg-emerald-50/50 ring-2 ring-[#23B750]/15 shadow-xs'
                    : 'border-gray-200 bg-gray-50/60 hover:bg-white hover:border-gray-300'
                ]"
              >
                <!-- Top Header Row: Status Badge & Lock Indicator -->
                <div class="flex items-center justify-between min-h-[24px]">
                  <span
                    class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-colors"
                    :class="salesPartnerBadgeClass"
                  >
                    <Lock v-if="!isSalesPartnerUnlocked" class="w-3 h-3" />
                    <Unlock v-else class="w-3 h-3" />
                    {{ isSalesPartnerUnlocked ? 'Unlocked Preview' : 'Unlocks at 5 Deals' }}
                  </span>
                  <div
                    class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                    :class="selectedPartnerType === 'sales' ? 'border-[#23B750] bg-[#23B750] text-white shadow-xs' : 'border-gray-300 bg-white'"
                  >
                    <Check v-if="selectedPartnerType === 'sales'" class="w-3 h-3 stroke-[3]" />
                    <Lock v-else-if="!isSalesPartnerUnlocked" class="w-2.5 h-2.5 text-gray-400" />
                  </div>
                </div>

                <!-- Mascot & Title with Harmonious Breathing Room -->
                <div class="text-center py-0.5 space-y-1.5">
                  <h3 class="font-bold text-gray-700 text-base">Sales Partner</h3>

                  <!-- Authentic Live Single Robot Mascot Graphic -->
                  <div class="h-18 sm:h-20 w-full flex items-center justify-center opacity-85">
                    <img
                      src="/brand-assets/partner/sales-partner-illustration.png"
                      alt="Sales Partner Mascot Robot"
                      class="max-h-18 sm:max-h-20 max-w-full object-contain filter drop-shadow-sm transition-transform group-hover:scale-105 duration-200"
                    />
                  </div>

                  <p class="text-xs text-gray-500 leading-normal px-1">
                    Pitch leads directly and manage the full sales cycle.
                  </p>
                </div>

                <!-- Commission Earning Hero Box (Balanced & Spacious) -->
                <div
                  class="py-1.5 px-2.5 rounded-lg text-center space-y-0.5 transition-colors"
                  :class="selectedPartnerType === 'sales' ? 'bg-white/90 border border-emerald-200/80 shadow-2xs' : 'bg-gray-100/80 border border-gray-200/80'"
                >
                  <span class="text-[9px] font-bold uppercase tracking-wider block" :class="selectedPartnerType === 'sales' ? 'text-emerald-900' : 'text-gray-600'">Recurring Revenue</span>
                  <div class="text-sm sm:text-base font-semibold font-mono leading-tight" :class="selectedPartnerType === 'sales' ? 'text-emerald-900' : 'text-gray-900'">10% – 25% MRR</div>
                  <span class="text-[10px] font-medium block" :class="selectedPartnerType === 'sales' ? 'text-emerald-800' : 'text-gray-500'">Paid monthly for 12 months</span>
                </div>

                <!-- Key Highlights Checklist -->
                <div class="space-y-1.5 pt-2 text-[11px] text-gray-600 border-t border-gray-100/90">
                  <div class="flex items-center gap-2">
                    <Check class="w-3.5 h-3.5 shrink-0 stroke-[2.5]" :class="selectedPartnerType === 'sales' ? 'text-[#23B750]' : 'text-gray-400'" />
                    <span>Higher long-term compound income</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <Check class="w-3.5 h-3.5 shrink-0 stroke-[2.5]" :class="selectedPartnerType === 'sales' ? 'text-[#23B750]' : 'text-gray-400'" />
                    <span>Dedicated CRM deal registration portal</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Clear & Reassuring Footnote with Generous Breathing Room Below -->
            <p class="text-xs text-gray-500 text-center leading-relaxed mt-3.5">
              <Info class="inline-block w-3.5 h-3.5 text-gray-400 align-middle -translate-y-[1px] mr-1" />
              <span>All new partners start on the <strong class="text-gray-700">Referral Track</strong>. Close 5 successful referrals to unlock the recurring <strong class="text-gray-700">Sales Track</strong>.</span>
            </p>
          </div>

          <!-- ============================================== -->
          <!-- STEP 2: YOUR DETAILS (ONE VIEWPORT, NO SCROLL) -->
          <!-- ============================================== -->
          <div v-else-if="currentStep === 2" class="space-y-5 sm:space-y-5.5 animate-in fade-in-50 duration-200 text-left pt-1">
            <!-- Full Name & Company Name (No Redundant "optional") -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <label for="step2-fullname" class="block text-xs font-semibold text-gray-700 mb-2">
                  Full name <span class="text-red-500">*</span>
                </label>
                <input
                  id="step2-fullname"
                  v-model="partnerForm.fullName"
                  type="text"
                  required
                  autocomplete="name"
                  placeholder="e.g. Ahmad Haziq"
                  class="w-full px-3.5 py-2.5 bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#23B750]/30 focus:border-[#23B750] caret-[#23B750] shadow-2xs transition-all"
                />
              </div>
              <div>
                <label for="step2-company" class="block text-xs font-semibold text-gray-700 mb-2">
                  Company or agency name
                </label>
                <input
                  id="step2-company"
                  v-model="partnerForm.companyName"
                  type="text"
                  autocomplete="organization"
                  placeholder="e.g. Syarikat Sdn Bhd or Studio Name"
                  class="w-full px-3.5 py-2.5 bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#23B750]/30 focus:border-[#23B750] caret-[#23B750] shadow-2xs transition-all"
                />
              </div>
            </div>

            <!-- Email Address & WhatsApp Number -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <label for="step2-email" class="block text-xs font-semibold text-gray-700 mb-2">
                  Work email address <span class="text-red-500">*</span>
                </label>
                <input
                  id="step2-email"
                  v-model="partnerForm.email"
                  type="email"
                  required
                  autocomplete="email"
                  placeholder="ahmad@company.com"
                  class="w-full px-3.5 py-2.5 bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#23B750]/30 focus:border-[#23B750] caret-[#23B750] shadow-2xs transition-all"
                />
              </div>
              <div>
                <label for="step2-whatsapp" class="block text-xs font-semibold text-gray-700 mb-2">
                  WhatsApp mobile number <span class="text-red-500">*</span>
                </label>
                <div class="relative flex items-center">
                  <div class="absolute left-3 flex items-center gap-1.5 text-xs font-semibold text-gray-600 select-none border-r border-gray-200 pr-2">
                    <span class="text-sm leading-none">🇲🇾</span>
                    <span>+60</span>
                  </div>
                  <input
                    id="step2-whatsapp"
                    v-model="partnerForm.whatsapp"
                    type="tel"
                    required
                    autocomplete="tel"
                    placeholder="12-345 6789"
                    class="w-full pl-20 pr-3.5 py-2.5 bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#23B750]/30 focus:border-[#23B750] caret-[#23B750] shadow-2xs transition-all"
                  />
                </div>
              </div>
            </div>

            <!-- Password & Confirm Password -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <label for="step2-password" class="block text-xs font-semibold text-gray-700 mb-2">
                  Create password <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <input
                    id="step2-password"
                    v-model="partnerForm.password"
                    :type="showPassword ? 'text' : 'password'"
                    required
                    autocomplete="new-password"
                    placeholder="Minimum 8 characters"
                    class="w-full pl-3.5 pr-9 py-2.5 bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#23B750]/30 focus:border-[#23B750] caret-[#23B750] shadow-2xs transition-all"
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer focus-visible:outline-none rounded"
                    title="Toggle password view"
                    :aria-label="showPassword ? 'Hide password' : 'Show password'"
                  >
                    <Eye v-if="!showPassword" class="w-3.5 h-3.5" />
                    <EyeOff v-else class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div>
                <label for="step2-confirm-pwd" class="block text-xs font-semibold text-gray-700 mb-2">
                  Confirm password <span class="text-red-500">*</span>
                </label>
                <input
                  id="step2-confirm-pwd"
                  v-model="partnerForm.confirmPassword"
                  type="password"
                  required
                  autocomplete="new-password"
                  placeholder="Re-enter your password"
                  class="w-full px-3.5 py-2.5 bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#23B750]/30 focus:border-[#23B750] caret-[#23B750] shadow-2xs transition-all"
                />
              </div>
            </div>

            <!-- Redesigned Password Security Strength Card -->
            <div class="p-3 sm:p-3.5 bg-white/95 rounded-xl border border-gray-200/90 shadow-2xs space-y-2.5">
              <!-- Top Header: Shield Icon, Title, and Dynamic Status Pill -->
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-1.5">
                  <div
                    v-if="passwordStrengthScore === 4"
                    class="w-5 h-5 rounded-lg flex items-center justify-center bg-emerald-100 text-emerald-800 transition-colors"
                  >
                    <ShieldCheck class="w-3.5 h-3.5" />
                  </div>
                  <div
                    v-else
                    class="w-5 h-5 rounded-lg flex items-center justify-center bg-gray-100 text-gray-500 transition-colors"
                  >
                    <ShieldCheck class="w-3.5 h-3.5" />
                  </div>
                  <span class="text-xs font-semibold text-gray-700">Password security</span>
                </div>
                <span
                  class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-all duration-200"
                  :class="passwordStrengthBadgeClass"
                >
                  <Sparkles v-if="passwordStrengthScore === 4" class="w-2.5 h-2.5 text-emerald-600" />
                  {{ passwordStrengthLabel }}
                </span>
              </div>

              <!-- Segmented Progress Track with Smooth Pulse Fill -->
              <div class="grid grid-cols-4 gap-1.5 h-1.5">
                <div class="rounded-full transition-all duration-300" :class="passwordStrengthScore >= 1 ? passwordStrengthBg : 'bg-gray-100'"></div>
                <div class="rounded-full transition-all duration-300" :class="passwordStrengthScore >= 2 ? passwordStrengthBg : 'bg-gray-100'"></div>
                <div class="rounded-full transition-all duration-300" :class="passwordStrengthScore >= 3 ? passwordStrengthBg : 'bg-gray-100'"></div>
                <div class="rounded-full transition-all duration-300" :class="passwordStrengthScore >= 4 ? passwordStrengthBg : 'bg-gray-100'"></div>
              </div>

              <!-- Sleek Criteria Checklist with Micro Indicator Pills -->
              <div class="grid grid-cols-2 gap-x-3 gap-y-1.5 pt-0.5 text-[11px]">
                <div
                  class="flex items-center gap-1.5 transition-colors duration-150"
                  :class="partnerForm.password.length >= 8 ? 'text-emerald-700 font-medium' : 'text-gray-400'"
                >
                  <div
                    v-if="partnerForm.password.length >= 8"
                    class="w-3.5 h-3.5 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-700 shrink-0"
                  >
                    <Check class="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <div
                    v-else
                    class="w-3.5 h-3.5 rounded-full flex items-center justify-center bg-gray-100 shrink-0"
                  >
                    <div class="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                  </div>
                  <span>Min 8 characters</span>
                </div>

                <div
                  class="flex items-center gap-1.5 transition-colors duration-150"
                  :class="/[A-Z]/.test(partnerForm.password) ? 'text-emerald-700 font-medium' : 'text-gray-400'"
                >
                  <div
                    v-if="/[A-Z]/.test(partnerForm.password)"
                    class="w-3.5 h-3.5 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-700 shrink-0"
                  >
                    <Check class="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <div
                    v-else
                    class="w-3.5 h-3.5 rounded-full flex items-center justify-center bg-gray-100 shrink-0"
                  >
                    <div class="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                  </div>
                  <span>Uppercase letter</span>
                </div>

                <div
                  class="flex items-center gap-1.5 transition-colors duration-150"
                  :class="/[a-z]/.test(partnerForm.password) ? 'text-emerald-700 font-medium' : 'text-gray-400'"
                >
                  <div
                    v-if="/[a-z]/.test(partnerForm.password)"
                    class="w-3.5 h-3.5 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-700 shrink-0"
                  >
                    <Check class="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <div
                    v-else
                    class="w-3.5 h-3.5 rounded-full flex items-center justify-center bg-gray-100 shrink-0"
                  >
                    <div class="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                  </div>
                  <span>Lowercase letter</span>
                </div>

                <div
                  class="flex items-center gap-1.5 transition-colors duration-150"
                  :class="partnerForm.password && partnerForm.password === partnerForm.confirmPassword ? 'text-emerald-700 font-medium' : 'text-gray-400'"
                >
                  <div
                    v-if="partnerForm.password && partnerForm.password === partnerForm.confirmPassword"
                    class="w-3.5 h-3.5 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-700 shrink-0"
                  >
                    <Check class="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <div
                    v-else
                    class="w-3.5 h-3.5 rounded-full flex items-center justify-center bg-gray-100 shrink-0"
                  >
                    <div class="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                  </div>
                  <span>Passwords match</span>
                </div>
              </div>
            </div>
          </div>

          <!-- ============================================================== -->
          <!-- STEP 3: REFERRAL PROFILE (ALL 5 QUESTIONS IN AIRY UN-NESTED UI) -->
          <!-- ============================================================== -->
          <div v-else-if="currentStep === 3" class="space-y-5 sm:space-y-5.5 animate-in fade-in-50 duration-200 text-left pt-1">
            <!-- Row 1: Industry + Discovery Source (2 Cols) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <label for="step3-industry" class="block text-xs font-semibold text-gray-700 mb-2">
                  Primary client industry
                </label>
                <div class="relative">
                  <select
                    id="step3-industry"
                    v-model="partnerForm.industry"
                    class="w-full pl-3.5 pr-8 py-2.5 bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#23B750]/30 focus:border-[#23B750] shadow-2xs transition-all cursor-pointer appearance-none"
                    :class="partnerForm.industry ? 'text-gray-900' : 'text-gray-400'"
                  >
                    <option value="" class="text-gray-400">Select one (optional)</option>
                    <option value="ecommerce" class="text-gray-900">Retail & E-commerce</option>
                    <option value="realestate" class="text-gray-900">Real Estate & Property Development</option>
                    <option value="agency" class="text-gray-900">Marketing & Digital Agency</option>
                    <option value="tech" class="text-gray-900">IT Consulting & Software Services</option>
                    <option value="fnb" class="text-gray-900">Food & Beverage / Hospitality</option>
                    <option value="financial" class="text-gray-900">Financial Services & Insurance</option>
                    <option value="other" class="text-gray-900">Other B2B Sector</option>
                  </select>
                  <ChevronDown class="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label for="step3-source" class="block text-xs font-semibold text-gray-700 mb-2">
                  How did you discover our program?
                </label>
                <div class="relative">
                  <select
                    id="step3-source"
                    v-model="partnerForm.source"
                    class="w-full pl-3.5 pr-8 py-2.5 bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#23B750]/30 focus:border-[#23B750] shadow-2xs transition-all cursor-pointer appearance-none"
                    :class="partnerForm.source ? 'text-gray-900' : 'text-gray-400'"
                  >
                    <option value="" class="text-gray-400">Select one (optional)</option>
                    <option value="friend" class="text-gray-900">Colleague or Friend</option>
                    <option value="social" class="text-gray-900">LinkedIn / Social Media</option>
                    <option value="search" class="text-gray-900">Google Search</option>
                    <option value="event" class="text-gray-900">Tech Event / Webinar</option>
                    <option value="customer" class="text-gray-900">Existing RakanSales Customer</option>
                    <option value="other" class="text-gray-900">Other Channel</option>
                  </select>
                  <ChevronDown class="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            <!-- Row 2: Referral Method + Monthly Reach (2 Cols) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <label for="step3-refer-channel" class="block text-xs font-semibold text-gray-700 mb-2">
                  Primary referral channel
                </label>
                <div class="relative">
                  <select
                    id="step3-refer-channel"
                    v-model="partnerForm.referMethod"
                    class="w-full pl-3.5 pr-8 py-2.5 bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#23B750]/30 focus:border-[#23B750] shadow-2xs transition-all cursor-pointer appearance-none"
                    :class="partnerForm.referMethod ? 'text-gray-900' : 'text-gray-400'"
                  >
                    <option value="" class="text-gray-400">Select one (optional)</option>
                    <option value="network" class="text-gray-900">Personal & Business Network</option>
                    <option value="clients" class="text-gray-900">Existing Corporate Client Base</option>
                    <option value="whatsapp" class="text-gray-900">WhatsApp & Business Communities</option>
                    <option value="content" class="text-gray-900">Content Marketing & Social Media</option>
                    <option value="other" class="text-gray-900">Direct Outreach</option>
                  </select>
                  <ChevronDown class="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label for="step3-monthly-reach" class="block text-xs font-semibold text-gray-700 mb-2">
                  Estimated monthly reach
                </label>
                <div class="relative">
                  <select
                    id="step3-monthly-reach"
                    v-model="partnerForm.monthlyReach"
                    class="w-full pl-3.5 pr-8 py-2.5 bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#23B750]/30 focus:border-[#23B750] shadow-2xs transition-all cursor-pointer appearance-none"
                    :class="partnerForm.monthlyReach ? 'text-gray-900' : 'text-gray-400'"
                  >
                    <option value="" class="text-gray-400">Select one (optional)</option>
                    <option value="1-10" class="text-gray-900">1 – 10 businesses / month</option>
                    <option value="11-50" class="text-gray-900">11 – 50 businesses / month</option>
                    <option value="51-200" class="text-gray-900">51 – 200 businesses / month</option>
                    <option value="200+" class="text-gray-900">200+ businesses / month</option>
                  </select>
                  <ChevronDown class="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            <!-- Row 3: Prior B2B/SaaS Referral Experience -->
            <div>
              <label for="step3-prev-exp" class="block text-xs font-semibold text-gray-700 mb-2">
                Have you referred SaaS or B2B tools before?
              </label>
              <div class="relative">
                <select
                  id="step3-prev-exp"
                  v-model="partnerForm.previousReferral"
                  class="w-full pl-3.5 pr-8 py-2.5 bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#23B750]/30 focus:border-[#23B750] shadow-2xs transition-all cursor-pointer appearance-none"
                  :class="partnerForm.previousReferral ? 'text-gray-900' : 'text-gray-400'"
                >
                  <option value="" class="text-gray-400">Select one (optional)</option>
                  <option value="yes-regularly" class="text-gray-900">Yes, I regularly refer software and tools</option>
                  <option value="yes-few" class="text-gray-900">Yes, I have referred business services occasionally</option>
                  <option value="no-first-time" class="text-gray-900">No, this is my first referral program</option>
                </select>
                <ChevronDown class="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <!-- Quality Checkbox (Clean & Light) -->
            <div class="pt-1.5">
              <label class="flex items-start gap-2.5 cursor-pointer text-xs text-gray-600 leading-relaxed">
                <input
                  type="checkbox"
                  v-model="partnerForm.confirmedActiveBusinesses"
                  required
                  class="mt-0.5 rounded border-gray-300 text-[#23B750] focus:ring-[#23B750] w-4 h-4 cursor-pointer"
                />
                <span class="text-[11px] sm:text-xs">
                  I confirm that I will refer active, genuine businesses and will not submit spam or cold scraped lists.
                </span>
              </label>
            </div>

            <!-- Agreement disclaimer -->
            <p class="text-[10px] text-gray-400 text-center pt-0.5">
              By registering, you agree to the <a href="#" class="text-[#23B750] font-medium hover:underline">Partner Agreement</a> and <a href="#" class="text-[#23B750] font-medium hover:underline">Privacy Policy</a>.
            </p>
          </div>

          <!-- ============================================== -->
          <!-- STEP 4: SUCCESS / CONFIRMATION (CLEAN & SIMPLE) -->
          <!-- ============================================== -->
          <div v-else-if="currentStep === 4" class="h-full flex flex-col items-center justify-center text-center px-4 animate-in fade-in-50 duration-300">
            <!-- Celebratory Checkmark Icon Badge -->
            <div class="w-16 h-16 rounded-2xl bg-emerald-50 border-2 border-emerald-200/80 flex items-center justify-center text-[#23B750] shadow-sm mb-5">
              <Check class="w-8 h-8 stroke-[2.5]" />
            </div>

            <!-- Heading & Clarity Subtext -->
            <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-2.5">
              Registration submitted!
            </h2>
            <p class="text-sm text-gray-600 max-w-sm leading-relaxed mb-5">
              We've sent a verification link to
              <span class="font-semibold text-gray-900">{{ partnerForm.email || 'your email' }}</span>.
              Please check your inbox to activate your account.
            </p>

            <!-- Minimal Resend Trigger -->
            <button
              type="button"
              @click="resendVerificationEmail"
              class="text-xs text-gray-500 hover:text-gray-700 transition-colors cursor-pointer focus-visible:outline-none"
            >
              <span v-if="emailResent" class="text-emerald-700 font-bold inline-flex items-center gap-1">
                <Check class="w-3.5 h-3.5" /> Verification email resent
              </span>
              <span v-else>
                Didn't receive the email? <span class="text-[#23B750] font-semibold underline hover:text-[#1a943e]">Click to resend</span>
              </span>
            </button>
          </div>
        </div>

        <!-- 4. ACTION CONTROLS (Consistent h-12 Height & text-sm Typography) -->
        <div class="h-[88px] shrink-0 pt-4.5 border-t border-gray-100/90 flex flex-col justify-between">
          <!-- Step 1 Actions -->
          <template v-if="currentStep === 1">
            <button
              type="button"
              @click="goToStep(2)"
              class="w-full h-12 bg-[#23B750] hover:bg-[#1a943e] active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#23B750] focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <span>Continue to Account Details</span>
              <ArrowRight class="w-4 h-4" />
            </button>
            <div class="text-center pt-1">
              <router-link
                to="/auth"
                class="text-xs text-gray-500 hover:text-gray-800 transition-colors inline-flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-[#23B750] focus-visible:outline-none rounded"
              >
                <span>Already a partner?</span>
                <span class="font-semibold text-[#23B750] hover:text-[#1a943e] hover:underline">Sign in</span>
              </router-link>
            </div>
          </template>

          <!-- Step 2 Actions -->
          <template v-else-if="currentStep === 2">
            <div class="flex items-center gap-3">
              <button
                type="button"
                @click="goToStep(1)"
                class="px-5 h-12 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-sm rounded-xl transition-colors cursor-pointer min-w-[88px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-[#23B750] focus-visible:outline-none"
              >
                Back
              </button>
              <button
                type="button"
                @click="submitStep2"
                class="flex-1 h-12 bg-[#23B750] hover:bg-[#1a943e] text-white font-bold text-sm rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#23B750] focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                <span>Continue to Referral Profile</span>
                <ArrowRight class="w-4 h-4" />
              </button>
            </div>
            <div class="text-center pt-1">
              <router-link
                to="/auth"
                class="text-xs text-gray-500 hover:text-gray-800 transition-colors inline-flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-[#23B750] focus-visible:outline-none rounded"
              >
                <span>Already a partner?</span>
                <span class="font-semibold text-[#23B750] hover:text-[#1a943e] hover:underline">Sign in</span>
              </router-link>
            </div>
          </template>

          <!-- Step 3 Actions -->
          <template v-else-if="currentStep === 3">
            <div class="flex items-center gap-3">
              <button
                type="button"
                :disabled="isSubmitting"
                @click="goToStep(2)"
                class="px-5 h-12 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-sm rounded-xl transition-colors cursor-pointer disabled:opacity-50 min-w-[88px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-[#23B750] focus-visible:outline-none"
              >
                Back
              </button>
              <button
                type="button"
                @click="submitRegistration"
                :disabled="!partnerForm.confirmedActiveBusinesses || isSubmitting"
                class="flex-1 h-12 bg-[#23B750] hover:bg-[#1a943e] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#23B750] focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin text-white" />
                <Sparkles v-else class="w-4 h-4" />
                <span>{{ isSubmitting ? 'Creating partner account...' : 'Complete Partner Registration' }}</span>
              </button>
            </div>
            <div class="text-center pt-1">
              <router-link
                to="/auth"
                class="text-xs text-gray-500 hover:text-gray-800 transition-colors inline-flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-[#23B750] focus-visible:outline-none rounded"
              >
                <span>Already a partner?</span>
                <span class="font-semibold text-[#23B750] hover:text-[#1a943e] hover:underline">Sign in</span>
              </router-link>
            </div>
          </template>

          <!-- Step 4 Actions -->
          <template v-else-if="currentStep === 4">
            <button
              type="button"
              @click="goToLogin"
              class="w-full h-12 bg-[#23B750] hover:bg-[#1a943e] active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#23B750] focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <span>Proceed to Login</span>
              <ArrowRight class="w-4 h-4" />
            </button>
            <div class="text-center pt-1">
              <button
                type="button"
                @click="resetForm"
                class="text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors cursor-pointer focus-visible:outline-none"
              >
                Register another partner account
              </button>
            </div>
          </template>
        </div>
      </div>
    </div>

        <!-- 5. FOOTER (Anchored at Bottom Edge) -->
        <footer class="w-full max-w-xl mx-auto shrink-0 pt-3 pb-2 flex items-center justify-between text-xs text-gray-400 border-t border-gray-100/60">
          <p>© 2026 RakanSales</p>
          <div class="flex items-center gap-3 text-xs">
            <a href="#" class="hover:text-gray-600 transition-colors">Terms</a>
            <span>·</span>
            <a href="#" class="hover:text-gray-600 transition-colors">Privacy</a>
            <span>·</span>
            <a href="#" class="hover:text-gray-600 transition-colors">Help Center</a>
          </div>
        </footer>
      </section>

      <!-- ========================================================= -->
      <!-- RIGHT PANE: BRAND GRAPHIC & TITLE (EXPANDS 50% ON HOVER)  -->
      <!-- ========================================================= -->
      <section
        aria-label="Partner Program Showcase"
        @mouseenter="isRightPaneHovered = true"
        @mouseleave="isRightPaneHovered = false"
        :class="[
          isRightPaneHovered ? 'lg:w-1/2' : 'lg:w-[30%]',
          'hidden lg:flex bg-gradient-to-b from-[#f8fcf9] to-[#edf7f1] flex-col justify-end items-center relative overflow-hidden select-none border-l border-emerald-100/60 p-0 transition-all duration-500 ease-out cursor-default'
        ]"
      >
        <!-- Title: Aligned middle initially, glides to top position and scales when pane expands -->
        <div
          :class="[
            isRightPaneHovered
              ? 'top-[10%] xl:top-[12%] 2xl:top-[14%] -translate-y-0 scale-120 xl:scale-130'
              : 'top-[30%] -translate-y-1/2 scale-100',
            'absolute inset-x-0 text-center px-6 z-20 pointer-events-none select-none transition-all duration-500 ease-out origin-center'
          ]"
        >
          <h2 class="text-2xl sm:text-3xl xl:text-3xl font-semibold text-gray-900 tracking-tight leading-[1.2]">
            Grow Together,<br />
            <span class="text-[#23B750]">Earn Together.</span>
          </h2>
        </div>

        <!-- 100% Width Graphic Aligned Bottom (Scales with Pane) -->
        <img
          src="/brand-assets/partner/partner-earnings-hero.png"
          alt="Grow Together, Earn Together with RakanSales CRM"
          class="w-full h-auto object-contain object-bottom pointer-events-none select-none block relative z-10 transition-all duration-500 ease-out"
        />
      </section>
    </div>

    <!-- ========================================================= -->
    <!-- INLINE UNLOCK MODAL DIALOG (CRAFT-POLISHED, NO BROWSER CONFIRM) -->
    <!-- ========================================================= -->
    <div
      v-if="showUnlockModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-xs p-4 animate-in fade-in-50 duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="unlock-modal-title"
    >
      <div class="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 p-6 space-y-4 text-left">
        <div class="flex items-center justify-between">
          <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
            <Award class="w-5 h-5" />
          </div>
          <button
            type="button"
            @click="showUnlockModal = false"
            class="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg cursor-pointer focus-visible:outline-none"
            aria-label="Close dialog"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <div class="space-y-1.5">
          <h3 id="unlock-modal-title" class="text-lg font-semibold text-gray-900">
            Unlock Sales Partner Track Preview?
          </h3>
          <p class="text-xs text-gray-600 leading-relaxed">
            In live production, the <strong>Sales Partner Track</strong> unlocks automatically after your <strong>5th closed referral</strong>.
          </p>
          <p class="text-xs text-gray-500 leading-relaxed pt-1">
            As this is an interactive prototype, you can unlock preview mode right now to explore the sales tier and recurring commission terms.
          </p>
        </div>

        <div class="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
          <div class="font-bold">Sales Partner Benefits:</div>
          <ul class="space-y-0.5 text-[11px] text-amber-800 list-disc list-inside">
            <li>10% – 25% recurring monthly revenue share (12 months)</li>
            <li>Dedicated Partner Manager & co-pitch collateral</li>
            <li>Direct CRM deal registration portal</li>
          </ul>
        </div>

        <div class="flex items-center gap-3 pt-2">
          <button
            type="button"
            @click="showUnlockModal = false"
            class="flex-1 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#23B750] focus-visible:outline-none"
          >
            Stay on Referral Track
          </button>
          <button
            type="button"
            @click="confirmUnlockSalesPartner"
            class="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
          >
            <Unlock class="w-3.5 h-3.5" />
            <span>Unlock Preview</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import lightLogoUrl from '@/assets/logo/RKS Logo Lockup 01.svg';
import {
  Check,
  CheckCheck,
  ArrowRight,
  ArrowLeft,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Sparkles,
  Copy,
  Loader2,
  ChevronDown,
  X,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Zap,
  Award,
  Info,
} from 'lucide-vue-next';

const router = useRouter();

// Current active wizard step (1 to 4)
const currentStep = ref<number>(1);
const selectedPartnerType = ref<'referral' | 'sales'>('referral');
const isSalesPartnerUnlocked = ref(false);
const showUnlockModal = ref(false);
const showPassword = ref(false);
const isSubmitting = ref(false);
const isChatOpen = ref(false);
const copiedLink = ref(false);
const copiedCode = ref(false);
const isRightPaneHovered = ref(false);

// Partner registration form state
const partnerForm = reactive({
  fullName: '',
  companyName: '',
  email: '',
  whatsapp: '',
  password: '',
  confirmPassword: '',
  industry: '',
  source: '',
  referMethod: '',
  monthlyReach: '',
  previousReferral: '',
  confirmedActiveBusinesses: true,
});

const currentStepTitle = computed(() => {
  switch (currentStep.value) {
    case 1:
      return 'Partner Registration';
    case 2:
      return 'Account details';
    case 3:
      return 'Referral profile';
    case 4:
      return 'Verify your work email address';
    default:
      return '';
  }
});

const currentStepSubtitle = computed(() => {
  switch (currentStep.value) {
    case 1:
      return 'Earn money by referring businesses to our CRM platform';
    case 2:
      return "Create the partner login you'll use to view tracked leads and commission payouts.";
    case 3:
      return 'Help us tailor your partner resources and commission routing.';
    case 4:
      return `We've dispatched an account verification token to ${partnerForm.email || 'your email'}. Confirm within 24 hours to begin earning commission.`;
    default:
      return '';
  }
});

const referralUrl = computed(() => `https://app.rakansales.com/ref/RKS-8821`);

const salesPartnerBadgeClass = computed(() => {
  return isSalesPartnerUnlocked.value
    ? 'bg-amber-100 text-amber-900 border border-amber-300'
    : 'bg-slate-100 text-slate-700 border border-slate-200';
});

// Password strength calculation
const passwordStrengthScore = computed(() => {
  if (!partnerForm.password) return 0;
  let score = 0;
  if (partnerForm.password.length >= 8) score++;
  if (/[A-Z]/.test(partnerForm.password)) score++;
  if (/[a-z]/.test(partnerForm.password)) score++;
  if (
    (/[0-9!@#$%^&*(),.?":{}|<>]/.test(partnerForm.password) && partnerForm.password.length >= 8) ||
    (partnerForm.confirmPassword && partnerForm.password === partnerForm.confirmPassword)
  ) {
    score++;
  }
  return Math.min(score, 4);
});

const passwordStrengthLabel = computed(() => {
  if (!partnerForm.password) return 'Enter password';
  switch (passwordStrengthScore.value) {
    case 1:
      return 'Weak';
    case 2:
      return 'Fair';
    case 3:
      return 'Good';
    case 4:
      return 'Strong';
    default:
      return 'Enter password';
  }
});

const passwordStrengthBadgeClass = computed(() => {
  if (!partnerForm.password) {
    return 'bg-gray-100 text-gray-500 border border-gray-200/60';
  }
  switch (passwordStrengthScore.value) {
    case 1:
      return 'bg-rose-50 text-rose-700 border border-rose-200/80';
    case 2:
      return 'bg-amber-50 text-amber-700 border border-amber-200/80';
    case 3:
      return 'bg-sky-50 text-sky-700 border border-sky-200/80';
    case 4:
      return 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold';
    default:
      return 'bg-gray-100 text-gray-500 border border-gray-200/60';
  }
});

const passwordStrengthBg = computed(() => {
  switch (passwordStrengthScore.value) {
    case 1:
      return 'bg-rose-500';
    case 2:
      return 'bg-amber-500';
    case 3:
      return 'bg-sky-500';
    case 4:
      return 'bg-[#23B750]';
    default:
      return 'bg-gray-200';
  }
});

function goToStep(step: number) {
  currentStep.value = step;
}

function openSalesPartnerModal() {
  if (!isSalesPartnerUnlocked.value) {
    showUnlockModal.value = true;
  } else {
    selectedPartnerType.value = 'sales';
  }
}

function confirmUnlockSalesPartner() {
  isSalesPartnerUnlocked.value = true;
  selectedPartnerType.value = 'sales';
  showUnlockModal.value = false;
}

function submitStep2() {
  currentStep.value = 3;
}

function submitRegistration() {
  isSubmitting.value = true;
  setTimeout(() => {
    isSubmitting.value = false;
    currentStep.value = 4;
  }, 750);
}

function copyReferralLink() {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(referralUrl.value).catch(() => {});
  }
  copiedLink.value = true;
  setTimeout(() => {
    copiedLink.value = false;
  }, 2200);
}

function copyPartnerCode() {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText('RKS-PARTNER-8821').catch(() => {});
  }
  copiedCode.value = true;
  setTimeout(() => {
    copiedCode.value = false;
  }, 2200);
}

function goToLogin() {
  router.push('/auth');
}

const emailResent = ref(false);

function resendVerificationEmail() {
  emailResent.value = true;
  setTimeout(() => {
    emailResent.value = false;
  }, 3500);
}

function resetForm() {
  currentStep.value = 1;
  selectedPartnerType.value = 'referral';
  isSalesPartnerUnlocked.value = false;
  isSubmitting.value = false;
  emailResent.value = false;
  partnerForm.fullName = '';
  partnerForm.companyName = '';
  partnerForm.email = '';
  partnerForm.whatsapp = '';
  partnerForm.password = '';
  partnerForm.confirmPassword = '';
  partnerForm.industry = '';
  partnerForm.source = '';
  partnerForm.referMethod = '';
  partnerForm.monthlyReach = '';
  partnerForm.previousReferral = '';
  partnerForm.confirmedActiveBusinesses = true;
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 9999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
