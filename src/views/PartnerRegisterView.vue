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
            <span>1. Account Setup</span>
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
            <span>2. {{ userType === 'existing' ? 'Link CRM' : 'Partner Track' }}</span>
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
            <span>3. {{ userType === 'existing' ? 'Partner Track' : 'Account Details' }}</span>
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
                    {{ currentStepIndicatorLabel }}
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

            <!-- 3. STEP CONTENT (Spacious Stage with Natural Top-Down Flow) -->
            <div class="min-h-[375px] h-[395px] shrink-0 flex flex-col justify-start">
          <!-- ============================================================== -->
          <!-- STEP 1: CHOOSE ACCOUNT STATUS (NEW USER VS EXISTING CUSTOMER)  -->
          <!-- ============================================================== -->
          <div v-if="currentStep === 1" class="flex flex-col justify-start animate-in fade-in-50 duration-200 pt-1">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <!-- Card 1: New Partner -->
              <div
                role="button"
                tabindex="0"
                @click="userType = 'new'"
                @keydown.enter.prevent="userType = 'new'"
                @keydown.space.prevent="userType = 'new'"
                class="group relative rounded-2xl border-2 p-6 sm:p-7 flex flex-col justify-start gap-4 cursor-pointer transition-all text-left focus-visible:ring-2 focus-visible:ring-[#23B750] focus-visible:outline-none min-h-[200px]"
                :class="[
                  userType === 'new'
                    ? 'border-[#23B750] bg-emerald-50/50 ring-2 ring-[#23B750]/15 shadow-xs'
                    : 'border-gray-200 bg-white/70 hover:border-gray-300 hover:bg-white'
                ]"
              >
                <!-- Top Header Row -->
                <div class="flex items-center justify-between">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300">
                    New
                  </span>
                  <div
                    class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                    :class="userType === 'new' ? 'border-[#23B750] bg-[#23B750] text-white shadow-xs' : 'border-gray-300 bg-white'"
                  >
                    <Check v-if="userType === 'new'" class="w-3 h-3 stroke-[3]" />
                  </div>
                </div>

                <!-- Info -->
                <div class="space-y-1.5">
                  <h3 class="font-bold text-gray-900 text-base sm:text-lg">New Partner Account</h3>
                  <p class="text-xs sm:text-sm text-gray-500 leading-relaxed">
                    Create a dedicated partner login to start referring businesses and receiving payouts.
                  </p>
                </div>
              </div>

              <!-- Card 2: Already Using RakanSales -->
              <div
                role="button"
                tabindex="0"
                @click="userType = 'existing'"
                @keydown.enter.prevent="userType = 'existing'"
                @keydown.space.prevent="userType = 'existing'"
                class="group relative rounded-2xl border-2 p-6 sm:p-7 flex flex-col justify-start gap-4 cursor-pointer transition-all text-left focus-visible:ring-2 focus-visible:ring-[#23B750] focus-visible:outline-none min-h-[200px]"
                :class="[
                  userType === 'existing'
                    ? 'border-[#23B750] bg-emerald-50/50 ring-2 ring-[#23B750]/15 shadow-xs'
                    : 'border-gray-200 bg-white/70 hover:border-gray-300 hover:bg-white'
                ]"
              >
                <!-- Top Header Row -->
                <div class="flex items-center justify-between">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300">
                    Existing
                  </span>
                  <div
                    class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                    :class="userType === 'existing' ? 'border-[#23B750] bg-[#23B750] text-white shadow-xs' : 'border-gray-300 bg-white'"
                  >
                    <Check v-if="userType === 'existing'" class="w-3 h-3 stroke-[3]" />
                  </div>
                </div>

                <!-- Info -->
                <div class="space-y-1.5">
                  <h3 class="font-bold text-gray-900 text-base sm:text-lg">Link Existing Account</h3>
                  <p class="text-xs sm:text-sm text-gray-500 leading-relaxed">
                    Connect your existing RakanSales login to manage CRM tools and partner earnings together.
                  </p>
                </div>
              </div>
            </div>

            <!-- Reassuring Footnote -->
            <p class="text-xs text-gray-500 text-center leading-relaxed mt-4">
              <Info class="inline-block w-3.5 h-3.5 text-gray-400 align-middle -translate-y-[1px] mr-1" />
              <span>Both paths include full access to referral tracking links, marketing kits, and automated payouts.</span>
            </p>
          </div>

          <!-- ============================================================== -->
          <!-- STEP 2 (EXISTING USER): LINK ACCOUNT FLOW (REFERENCE IMAGE)    -->
          <!-- ============================================================== -->
          <div
            v-else-if="currentStep === 2 && userType === 'existing'"
            class="space-y-5 animate-in fade-in-50 duration-200 text-left pt-2"
          >
            <!-- Callout Pill: One login for both -->
            <div class="p-4 sm:p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/90 flex items-start gap-3.5">
              <div class="w-9 h-9 rounded-xl bg-white border border-emerald-200 text-[#23B750] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <Link class="w-4.5 h-4.5 stroke-[2.5]" />
              </div>
              <p class="text-xs sm:text-[13px] text-gray-700 leading-relaxed font-normal">
                One login for both. Your CRM dashboard and partner earnings dashboard will share the same email and password.
              </p>
            </div>

            <!-- Input: CRM account email -->
            <div class="space-y-2">
              <label for="link-crm-email" class="block text-xs font-semibold text-gray-700">
                CRM account email <span class="text-red-500">*</span>
              </label>
              <input
                id="link-crm-email"
                v-model="crmLinkEmail"
                type="email"
                required
                autocomplete="email"
                placeholder="Enter your CRM account email"
                @keydown.enter.prevent="findAccountAndContinue"
                class="w-full px-3.5 py-2.5 bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-xs sm:text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#23B750]/30 focus:border-[#23B750] caret-[#23B750] shadow-2xs transition-all"
              />
              <p v-if="accountLinkError" class="text-xs text-red-600 mt-1">
                {{ accountLinkError }}
              </p>
            </div>
          </div>

          <!-- ============================================================== -->
          <!-- PARTNER TRACK SELECTION (STEP 2 FOR NEW, STEP 3 FOR EXISTING)  -->
          <!-- ============================================================== -->
          <div
            v-else-if="(currentStep === 2 && userType === 'new') || (currentStep === 3 && userType === 'existing')"
            class="flex flex-col justify-start animate-in fade-in-50 duration-200 pt-1"
          >
            <!-- Linked Account Indicator Banner (For existing customers) -->
            <div
              v-if="userType === 'existing' && isAccountLinked"
              class="mb-2.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center justify-between shadow-2xs"
            >
              <div class="flex items-center gap-2">
                <Check class="w-3.5 h-3.5 text-[#23B750] stroke-[3]" />
                <span>Linked CRM account: <strong class="text-gray-900 font-semibold">{{ crmLinkEmail }}</strong></span>
              </div>
              <button
                type="button"
                @click="goToStep(2)"
                class="text-[11px] text-[#23B750] hover:text-[#1a943e] hover:underline font-semibold cursor-pointer"
              >
                Change email
              </button>
            </div>
            <!-- 2 Polished Track Cards with Clear Terminology & Earning Heroes -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <!-- Card 1: Referral Partner -->
              <div
                role="button"
                tabindex="0"
                @click="selectedPartnerType = 'referral'"
                @keydown.enter.prevent="selectedPartnerType = 'referral'"
                @keydown.space.prevent="selectedPartnerType = 'referral'"
                class="group relative rounded-2xl border-2 p-4.5 sm:p-5 flex flex-col justify-between cursor-pointer transition-all text-left focus-visible:ring-2 focus-visible:ring-[#23B750] focus-visible:outline-none min-h-[275px] sm:min-h-[285px]"
                :class="[
                  selectedPartnerType === 'referral'
                    ? 'border-[#23B750] bg-emerald-50/50 ring-2 ring-[#23B750]/15 shadow-xs'
                    : 'border-gray-200 bg-white/70 hover:border-gray-300 hover:bg-white'
                ]"
              >
                <!-- Top Header Row: Status Badge & Selection Indicator -->
                <div class="flex items-center justify-between min-h-[24px]">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300">
                    Recommended to Start
                  </span>
                  <div
                    class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                    :class="selectedPartnerType === 'referral' ? 'border-[#23B750] bg-[#23B750] text-white shadow-xs' : 'border-gray-300 bg-white'"
                  >
                    <Check v-if="selectedPartnerType === 'referral'" class="w-3 h-3 stroke-[3]" />
                  </div>
                </div>

                <!-- Graphic Hero (Swapped & Enlarged) -->
                <div class="h-28 sm:h-30 w-full flex items-center justify-center py-0.5">
                  <img
                    src="/brand-assets/partner/sales-partner-illustration.png"
                    alt="Referral Partner Mascot"
                    class="max-h-26 sm:max-h-28 max-w-full object-contain filter drop-shadow-sm transition-transform group-hover:scale-105 duration-200"
                  />
                </div>

                <!-- Title & Description -->
                <div class="text-center space-y-1 pt-1">
                  <h3 class="font-bold text-gray-900 text-base sm:text-lg">Referral Partner</h3>
                  <p class="text-xs sm:text-[13px] text-gray-500 leading-relaxed px-1">
                    Share your link with contacts. Our sales team conducts demos & closes the sale.
                  </p>
                </div>
              </div>

              <!-- Card 2: Sales Partner (Locked with Inline Modal Trigger) -->
              <div
                role="button"
                tabindex="0"
                @click="openSalesPartnerModal"
                @keydown.enter.prevent="openSalesPartnerModal"
                @keydown.space.prevent="openSalesPartnerModal"
                class="group relative rounded-2xl border-2 p-4.5 sm:p-5 flex flex-col justify-between text-left transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#23B750] focus-visible:outline-none min-h-[275px] sm:min-h-[285px]"
                :class="[
                  !isSalesPartnerUnlocked
                    ? 'border-gray-200/90 bg-gray-100/70 opacity-60 hover:opacity-85 hover:border-gray-300'
                    : (selectedPartnerType === 'sales'
                      ? 'border-[#23B750] bg-emerald-50/50 ring-2 ring-[#23B750]/15 shadow-xs'
                      : 'border-gray-200 bg-white hover:border-gray-300')
                ]"
              >
                <!-- Top Header Row: Status Badge & Lock Indicator -->
                <div class="flex items-center justify-between min-h-[24px]">
                  <span
                    class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-colors"
                    :class="salesPartnerBadgeClass"
                  >
                    <Lock v-if="!isSalesPartnerUnlocked" class="w-3 h-3 text-gray-500" />
                    <Unlock v-else class="w-3 h-3 text-emerald-700" />
                    {{ isSalesPartnerUnlocked ? 'Unlocked' : 'Unlocks at 5 Deals' }}
                  </span>
                  <div
                    class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                    :class="selectedPartnerType === 'sales' ? 'border-[#23B750] bg-[#23B750] text-white shadow-xs' : 'border-gray-300 bg-white'"
                  >
                    <Check v-if="selectedPartnerType === 'sales'" class="w-3 h-3 stroke-[3]" />
                    <Lock v-else-if="!isSalesPartnerUnlocked" class="w-2.5 h-2.5 text-gray-400" />
                  </div>
                </div>

                <!-- Graphic Hero (Swapped & Enlarged) -->
                <div
                  class="h-28 sm:h-30 w-full flex items-center justify-center py-0.5 transition-all"
                  :class="!isSalesPartnerUnlocked ? 'opacity-70 grayscale-[50%]' : 'opacity-90'"
                >
                  <img
                    src="/brand-assets/partner/referral-partner-illustration.png"
                    alt="Sales Partner Mascot Team"
                    class="max-h-26 sm:max-h-28 max-w-full object-contain filter drop-shadow-sm transition-transform group-hover:scale-105 duration-200"
                  />
                </div>

                <!-- Title & Description -->
                <div class="text-center space-y-1 pt-1">
                  <h3
                    class="font-bold text-base sm:text-lg transition-colors"
                    :class="!isSalesPartnerUnlocked ? 'text-gray-500' : (selectedPartnerType === 'sales' ? 'text-gray-900' : 'text-gray-700')"
                  >
                    Sales Partner
                  </h3>
                  <p class="text-xs sm:text-[13px] text-gray-500 leading-relaxed px-1">
                    Pitch leads directly and manage the full client sales cycle.
                  </p>
                </div>
              </div>
            </div>

            <!-- Clear & Reassuring Footnote with Generous Breathing Room Below -->
            <p class="text-xs text-gray-500 text-center leading-relaxed mt-2.5 sm:mt-3 font-normal">
              <Info class="inline-block w-3.5 h-3.5 text-gray-400 align-middle -translate-y-[1px] mr-1" />
              <span>Every new partner starts on the Referral Track. Close 5 successful referrals to unlock the recurring Sales Track.</span>
            </p>
          </div>

          <!-- ============================================== -->
          <!-- STEP 3 (NEW USER): ACCOUNT DETAILS             -->
          <!-- ============================================== -->
          <div v-else-if="currentStep === 3 && userType === 'new'" class="space-y-5 sm:space-y-5.5 animate-in fade-in-50 duration-200 text-left pt-1">
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
          <!-- REFERRAL PROFILE (TEMPORARILY HIDDEN PER USER REQUEST)         -->
          <!-- ============================================================== -->
          <template v-if="false">
            <div class="space-y-5 sm:space-y-5.5 animate-in fade-in-50 duration-200 text-left pt-1">
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
          </template>

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
              {{ userType === 'existing' ? 'Partner Account Linked!' : 'Registration submitted!' }}
            </h2>
            <p class="text-sm text-gray-600 max-w-sm leading-relaxed mb-5">
              <span v-if="userType === 'existing'">
                Your partner dashboard has been connected to
                <strong class="text-gray-900">{{ crmLinkEmail }}</strong>. You can now use your existing CRM login to view referral leads and payouts.
              </span>
              <span v-else>
                We've sent a verification link to
                <strong class="text-gray-900">{{ partnerForm.email || 'your email' }}</strong>.
                Please check your inbox to activate your account.
              </span>
            </p>

            <!-- Minimal Resend Trigger -->
            <button
              v-if="userType === 'new'"
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
          <!-- Step 1 Actions (Account Status) -->
          <template v-if="currentStep === 1">
            <button
              type="button"
              @click="goToStep(2)"
              class="w-full h-12 bg-[#23B750] hover:bg-[#1a943e] active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#23B750] focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <span>{{ userType === 'existing' ? 'Continue to Link CRM Account' : 'Continue to Track Selection' }}</span>
              <ArrowRight class="w-4 h-4" />
            </button>
            <div class="text-center pt-1">
              <router-link
                to="/auth"
                class="text-xs text-gray-500 hover:text-gray-800 transition-colors inline-flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-[#23B750] focus-visible:outline-none rounded"
              >
                <span>Already registered as a partner?</span>
                <span class="font-semibold text-[#23B750] hover:text-[#1a943e] hover:underline">Sign in</span>
              </router-link>
            </div>
          </template>

          <!-- Step 2 Actions -->
          <template v-else-if="currentStep === 2">
            <!-- Case 2A: New User (Partner Track -> Account Details) -->
            <template v-if="userType === 'new'">
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
                  @click="goToStep(3)"
                  class="flex-1 h-12 bg-[#23B750] hover:bg-[#1a943e] text-white font-bold text-sm rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#23B750] focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  <span>{{ selectedPartnerType === 'sales' ? 'Continue as Sales Partner' : 'Continue as Referral Partner' }}</span>
                  <ArrowRight class="w-4 h-4" />
                </button>
              </div>
              <div class="text-center pt-1">
                <router-link
                  to="/auth"
                  class="text-xs text-gray-500 hover:text-gray-800 transition-colors inline-flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-[#23B750] focus-visible:outline-none rounded"
                >
                  <span>Already registered as a partner?</span>
                  <span class="font-semibold text-[#23B750] hover:text-[#1a943e] hover:underline">Sign in</span>
                </router-link>
              </div>
            </template>

            <!-- Case 2B: Existing User (Link Account -> Find my account & continue) -->
            <template v-else>
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
                  @click="findAccountAndContinue"
                  :disabled="!crmLinkEmail || isFindingAccount"
                  class="flex-1 h-12 bg-[#23B750] hover:bg-[#1a943e] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#23B750] focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  <Loader2 v-if="isFindingAccount" class="w-4 h-4 animate-spin text-white" />
                  <span v-else>Find my account & continue</span>
                </button>
              </div>
              <p class="text-xs text-gray-400 text-center pt-1">
                You'll pick your partner type next — no need to re-enter your details.
              </p>
            </template>
          </template>

          <!-- Step 3 Actions -->
          <template v-else-if="currentStep === 3">
            <!-- Case 3A: New User (Account Details -> Submit Registration) -->
            <template v-if="userType === 'new'">
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
                  :disabled="isSubmitting || !partnerForm.fullName || !partnerForm.email || !partnerForm.password"
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
                  <span>Already registered as a partner?</span>
                  <span class="font-semibold text-[#23B750] hover:text-[#1a943e] hover:underline">Sign in</span>
                </router-link>
              </div>
            </template>

            <!-- Case 3B: Existing User (Partner Track -> Complete Activation) -->
            <template v-else>
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
                  :disabled="isSubmitting"
                  class="flex-1 h-12 bg-[#23B750] hover:bg-[#1a943e] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#23B750] focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin text-white" />
                  <Sparkles v-else class="w-4 h-4" />
                  <span>{{ isSubmitting ? (selectedPartnerType === 'sales' ? 'Activating sales track...' : 'Activating referral track...') : (selectedPartnerType === 'sales' ? 'Complete Sales Partner Setup' : 'Complete Referral Partner Setup') }}</span>
                </button>
              </div>
              <div class="text-center pt-1">
                <router-link
                  to="/auth"
                  class="text-xs text-gray-500 hover:text-gray-800 transition-colors inline-flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-[#23B750] focus-visible:outline-none rounded"
                >
                  <span>Already registered as a partner?</span>
                  <span class="font-semibold text-[#23B750] hover:text-[#1a943e] hover:underline">Sign in</span>
                </router-link>
              </div>
            </template>
          </template>

          <!-- Step 4 Actions -->
          <template v-else-if="currentStep === 4">
            <button
              type="button"
              @click="goToPartnerOverview"
              class="w-full h-12 bg-[#23B750] hover:bg-[#1a943e] active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#23B750] focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <span>{{ userType === 'existing' ? 'Open Partner Dashboard' : 'Go to Partner Dashboard' }}</span>
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
    <!-- FRIENDLY SALES TRACK MODAL (OPTION 3 ACCORDION BYPASS)    -->
    <!-- ========================================================= -->
    <div
      v-if="showUnlockModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-xs p-4 animate-in fade-in-50 duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="unlock-modal-title"
    >
      <div class="bg-white w-full max-w-sm sm:max-w-[410px] rounded-2xl shadow-2xl border border-gray-100 p-6 sm:p-7 space-y-4 text-center relative overflow-hidden">
        <!-- Close Button Top Right -->
        <button
          type="button"
          @click="showUnlockModal = false"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-lg cursor-pointer focus-visible:outline-none transition-colors"
          aria-label="Close dialog"
        >
          <X class="w-4 h-4" />
        </button>

        <!-- Friendly Robot Illustration (Enlarged) -->
        <div class="pt-1 flex justify-center">
          <div class="w-full max-w-[260px] h-28 sm:h-32 flex items-center justify-center">
            <img
              src="/brand-assets/partner/referral-partner-illustration.png"
              alt="Sales Partner Mascot Team"
              class="max-h-full max-w-full object-contain pointer-events-none select-none drop-shadow-sm"
            />
          </div>
        </div>

        <!-- Title & Friendly Explanation -->
        <div class="space-y-2">
          <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200/70 text-amber-700 text-[11px] font-semibold">
            <Lock class="w-3 h-3 stroke-[2.2]" />
            <span>Unlocks at 5 Deals</span>
          </div>

          <h3 id="unlock-modal-title" class="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
            Sales Partner Track
          </h3>

          <p class="text-xs text-gray-600 leading-relaxed font-normal px-1">
            New partners begin on the Referral Track. Close 5 successful referrals to automatically unlock recurring sales commissions.
          </p>
        </div>

        <!-- Optional Expandable "Have a code?" Section -->
        <div class="pt-2 border-t border-gray-100">
          <button
            type="button"
            @click="showCodeInput = !showCodeInput"
            class="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors py-1 cursor-pointer"
          >
            <span>Have an approved bypass code? Enter here</span>
            <ChevronDown
              class="w-3.5 h-3.5 transition-transform duration-200 text-gray-400"
              :class="showCodeInput ? 'rotate-180 text-gray-700' : ''"
            />
          </button>

          <!-- Collapsible Code Input Container -->
          <div
            v-if="showCodeInput"
            class="mt-2.5 p-3 bg-gray-50 border border-gray-200/80 rounded-xl space-y-2 text-left animate-in fade-in-50 duration-150"
          >
            <p class="text-[11px] text-gray-500 font-normal">
              Enter your invitation code to bypass the 5-deal requirement:
            </p>
            <div class="flex items-center gap-2">
              <input
                v-model="partnerAccessCode"
                type="text"
                placeholder="ENTER CODE"
                @keydown.enter.prevent="submitAccessCode"
                class="flex-1 px-3 py-2 bg-white border border-gray-200 hover:border-gray-300 rounded-lg text-xs font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#23B750]/30 focus:border-[#23B750] caret-[#23B750] uppercase tracking-wider transition-all"
              />
              <button
                type="button"
                @click="submitAccessCode"
                class="px-3.5 py-2 bg-[#23B750] hover:bg-[#1a943e] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-2xs shrink-0"
              >
                Unlock
              </button>
            </div>
            <p v-if="codeError" class="text-[11px] text-red-600 font-medium">
              {{ codeError }}
            </p>
          </div>
        </div>

        <!-- Primary Welcoming Action -->
        <div class="pt-1">
          <button
            type="button"
            @click="selectReferralAndClose"
            class="w-full py-2.5 sm:py-3 bg-[#23B750] hover:bg-[#1a943e] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#23B750] focus-visible:outline-none"
          >
            <span>Continue on Referral Track</span>
            <ArrowRight class="w-4 h-4" />
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
  Link,
  UserPlus,
} from 'lucide-vue-next';

const router = useRouter();

// User flow selection ('new' user vs 'existing' CRM customer)
const userType = ref<'new' | 'existing'>('new');
const crmLinkEmail = ref('');
const isFindingAccount = ref(false);
const accountLinkError = ref('');
const isAccountLinked = ref(false);

// Current active wizard step (1 to 4)
const currentStep = ref<number>(1);
const selectedPartnerType = ref<'referral' | 'sales'>('referral');
const isSalesPartnerUnlocked = ref(false);
const showUnlockModal = ref(false);
const showCodeInput = ref(false);
const partnerAccessCode = ref('');
const codeError = ref('');
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
      return 'Partner Account Setup';
    case 2:
      return userType.value === 'existing' ? 'Link your account' : 'Select your partner track';
    case 3:
      return userType.value === 'existing' ? 'Select your partner track' : 'Account details';
    case 4:
      return userType.value === 'existing' ? 'Partner Account Linked!' : 'Registration submitted!';
    default:
      return '';
  }
});

const currentStepSubtitle = computed(() => {
  switch (currentStep.value) {
    case 1:
      return 'Create a new partner account, or link your existing RakanSales login to manage everything in one place.';
    case 2:
      return userType.value === 'existing'
        ? "Already a RakanSales CRM customer? Use the same email — we'll link your partner earnings to your existing login, no new password needed."
        : 'Choose how you want to earn — share links for quick cash bonuses, or manage sales for recurring revenue.';
    case 3:
      return userType.value === 'existing'
        ? 'Choose how you want to earn — share links for quick cash bonuses, or manage sales for recurring revenue.'
        : "Create the partner login you'll use to view tracked leads and commission payouts.";
    case 4:
      return userType.value === 'existing'
        ? `Your partner access has been linked to ${crmLinkEmail.value || 'your CRM account'}.`
        : `We've sent a verification link to ${partnerForm.email || 'your email'}. Please check your inbox to activate your account.`;
    default:
      return '';
  }
});

const currentStepIndicatorLabel = computed(() => {
  if (currentStep.value === 1) return 'Account setup';
  if (currentStep.value === 2) {
    return userType.value === 'existing' ? 'Link CRM account' : 'Select partner track';
  }
  if (currentStep.value === 3) {
    return userType.value === 'existing' ? 'Select partner track' : 'Account details';
  }
  return '';
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
    partnerAccessCode.value = '';
    codeError.value = '';
    showCodeInput.value = false;
    showUnlockModal.value = true;
  } else {
    selectedPartnerType.value = 'sales';
  }
}

function selectReferralAndClose() {
  selectedPartnerType.value = 'referral';
  showUnlockModal.value = false;
}

function submitAccessCode() {
  codeError.value = '';
  if (!partnerAccessCode.value.trim()) {
    codeError.value = 'Please enter an access code.';
    return;
  }
  isSalesPartnerUnlocked.value = true;
  selectedPartnerType.value = 'sales';
  showUnlockModal.value = false;
}

function confirmUnlockSalesPartner() {
  isSalesPartnerUnlocked.value = true;
  selectedPartnerType.value = 'sales';
  showUnlockModal.value = false;
}

function findAccountAndContinue() {
  accountLinkError.value = '';
  if (!crmLinkEmail.value || !crmLinkEmail.value.includes('@')) {
    accountLinkError.value = 'Please enter a valid CRM account email address.';
    return;
  }
  isFindingAccount.value = true;
  setTimeout(() => {
    isFindingAccount.value = false;
    isAccountLinked.value = true;
    currentStep.value = 3;
  }, 400);
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

function goToPartnerOverview() {
  router.push('/partner/overview');
}

function goToLogin() {
  goToPartnerOverview();
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
  userType.value = 'new';
  crmLinkEmail.value = '';
  isAccountLinked.value = false;
  accountLinkError.value = '';
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
