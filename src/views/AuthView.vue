<template>
  <div class="h-full overflow-y-auto bg-gray-50 flex flex-col font-sans selection:bg-[#23B750]/20 selection:text-emerald-900 custom-scrollbar">
    <!-- CRM In-App Page Header Banner -->
    <div class="bg-white border-b border-gray-200 px-6 py-5 shrink-0">
      <div class="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-1">
            <span>Dashboard</span>
            <span>/</span>
            <span>Authentication</span>
            <span>/</span>
            <span class="text-[#23B750] font-bold">Portal Preview</span>
          </div>
          <div class="flex items-center gap-3">
            <h1 class="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
              Authentication Portal
            </h1>
            <span class="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              Interactive Flow
            </span>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2.5">
          <!-- Mode Switcher Tabs for Testing -->
          <div class="flex items-center gap-1 p-1 bg-gray-100 rounded-xl text-xs font-semibold">
            <button
              type="button"
              @click="mode = 'signup'"
              :class="[
                'px-3 py-1.5 rounded-lg transition-all cursor-pointer',
                mode === 'signup' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
              ]"
            >
              1. Sign Up
            </button>
            <button
              type="button"
              @click="mode = 'verify'"
              :class="[
                'px-3 py-1.5 rounded-lg transition-all cursor-pointer',
                mode === 'verify' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
              ]"
            >
              2. OTP Verification
            </button>
            <button
              type="button"
              @click="mode = 'login'"
              :class="[
                'px-3 py-1.5 rounded-lg transition-all cursor-pointer',
                mode === 'login' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
              ]"
            >
              3. Login
            </button>
          </div>

          <router-link
            to="/onboarding"
            class="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors flex items-center gap-1"
          >
            <span>Open Wizard</span>
            <span>→</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Main Content Canvas -->
    <div class="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <!-- 1. SIGN UP SCREEN -->
      <div
        v-if="mode === 'signup'"
        class="w-full max-w-md bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5 animate-in fade-in-50 duration-200 text-left"
      >
        <div class="text-center space-y-1">
          <div class="w-10 h-10 rounded-2xl bg-emerald-50 text-[#23B750] mx-auto flex items-center justify-center font-bold mb-2">
            <UserPlus class="w-5 h-5" />
          </div>
          <h2 class="text-2xl font-bold text-gray-900 tracking-tight">Create an account</h2>
          <p class="text-xs text-gray-500">Start your 14-day free trial. No credit card required.</p>
        </div>

        <form @submit.prevent="submitSignup" class="space-y-4">
          <!-- Name & Company (2 Columns) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
              <input
                v-model="signupForm.fullName"
                type="text"
                required
                placeholder="e.g. Bruce Wayne"
                class="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#23B750]/20 focus:border-[#23B750]"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1">Company Name</label>
              <input
                v-model="signupForm.companyName"
                type="text"
                required
                placeholder="e.g. Wayne Tech"
                class="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#23B750]/20 focus:border-[#23B750]"
              />
            </div>
          </div>

          <!-- Work Email -->
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Work Email</label>
            <input
              v-model="signupForm.email"
              type="email"
              required
              placeholder="bruce@waynetech.com"
              class="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#23B750]/20 focus:border-[#23B750]"
            />
          </div>

          <!-- Password -->
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Password</label>
            <div class="relative">
              <input
                v-model="signupForm.password"
                :type="showPassword ? 'text' : 'password'"
                required
                placeholder="••••••••"
                class="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#23B750]/20 focus:border-[#23B750] pr-8"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <Eye v-if="!showPassword" class="w-3.5 h-3.5" />
                <EyeOff v-else class="w-3.5 h-3.5" />
              </button>
            </div>

            <!-- Password Requirements Checklist -->
            <div class="mt-2.5 p-2.5 bg-gray-50 rounded-xl border border-gray-100 grid grid-cols-2 gap-1.5 text-[10px]">
              <div class="flex items-center gap-1.5" :class="signupForm.password.length >= 6 ? 'text-emerald-700 font-bold' : 'text-gray-400'">
                <span>{{ signupForm.password.length >= 6 ? '✓' : '○' }}</span>
                <span>Min 6 characters</span>
              </div>
              <div class="flex items-center gap-1.5" :class="/[A-Z]/.test(signupForm.password) ? 'text-emerald-700 font-bold' : 'text-gray-400'">
                <span>{{ /[A-Z]/.test(signupForm.password) ? '✓' : '○' }}</span>
                <span>Uppercase letter</span>
              </div>
              <div class="flex items-center gap-1.5" :class="/[a-z]/.test(signupForm.password) ? 'text-emerald-700 font-bold' : 'text-gray-400'">
                <span>{{ /[a-z]/.test(signupForm.password) ? '✓' : '○' }}</span>
                <span>Lowercase letter</span>
              </div>
              <div class="flex items-center gap-1.5" :class="/[0-9]/.test(signupForm.password) ? 'text-emerald-700 font-bold' : 'text-gray-400'">
                <span>{{ /[0-9]/.test(signupForm.password) ? '✓' : '○' }}</span>
                <span>At least one number</span>
              </div>
            </div>
          </div>

          <!-- Confirm Password -->
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Confirm Password</label>
            <input
              v-model="signupForm.confirmPassword"
              type="password"
              required
              placeholder="••••••••"
              class="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#23B750]/20 focus:border-[#23B750]"
            />
          </div>

          <button
            type="submit"
            class="w-full py-2.5 bg-[#23B750] hover:bg-[#1a943e] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Create account</span>
            <span>→</span>
          </button>
        </form>

        <div class="text-center text-[11px] text-gray-500 space-y-1">
          <p>
            By creating an account, you agree to our <a href="#" class="text-emerald-700 hover:underline">T & C</a> and <a href="#" class="text-emerald-700 hover:underline">Privacy policy</a>.
          </p>
          <p>
            Already have an account? <button type="button" @click="mode = 'login'" class="text-emerald-700 font-bold hover:underline cursor-pointer">Login to RakanSales</button>
          </p>
        </div>
      </div>

      <!-- 2. OTP VERIFICATION SCREEN -->
      <div
        v-else-if="mode === 'verify'"
        class="w-full max-w-md bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in-50 duration-200 text-center"
      >
        <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-[#23B750] mx-auto flex items-center justify-center font-bold">
          <Mail class="w-6 h-6" />
        </div>

        <div class="space-y-1">
          <h2 class="text-2xl font-bold text-gray-900 tracking-tight">Verify your email</h2>
          <p class="text-xs text-gray-500">
            Enter the 6-digit code we sent to <br /><strong class="text-gray-900 font-medium">{{ signupForm.email || 'justin+1@veecotech.com' }}</strong>
          </p>
        </div>

        <!-- 6 OTP Input Boxes -->
        <div class="flex items-center justify-center gap-2">
          <input
            v-for="(digit, idx) in otpDigits"
            :key="idx"
            :id="'otp-' + idx"
            v-model="otpDigits[idx]"
            type="text"
            maxlength="1"
            @input="handleOtpInput($event, idx)"
            @keydown.backspace="handleOtpBackspace($event, idx)"
            class="w-11 h-12 text-center text-lg font-bold font-mono bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#23B750] focus:bg-white transition-all shadow-xs"
          />
        </div>

        <button
          type="button"
          @click="submitOtp"
          class="w-full py-2.5 bg-[#23B750] hover:bg-[#1a943e] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>Verify & Start Setup Wizard</span>
          <span>→</span>
        </button>

        <div class="space-y-2 text-xs">
          <div class="text-gray-500">
            Didn't receive code?
            <button
              type="button"
              @click="resendOtp"
              :disabled="countdown > 0"
              class="text-emerald-700 font-bold hover:underline disabled:opacity-50 ml-1 cursor-pointer"
            >
              {{ countdown > 0 ? `Resend code in ${countdown}s` : 'Resend code' }}
            </button>
          </div>
          <div>
            <button type="button" @click="mode = 'login'" class="text-gray-400 hover:text-gray-700 font-medium">
              ← Back to login
            </button>
          </div>
        </div>
      </div>

      <!-- 3. LOGIN SCREEN (SPLIT VIEW) -->
      <div
        v-else-if="mode === 'login'"
        class="w-full max-w-4xl bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 animate-in fade-in-50 duration-200"
      >
        <!-- Left Login Form -->
        <div class="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between text-left space-y-6">
          <div>
            <div class="flex items-center gap-2 mb-6">
              <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-[#23B750] to-[#62D816] flex items-center justify-center text-white shadow-xs">
                <Zap class="w-4 h-4" />
              </div>
              <span class="font-bold text-gray-900 text-lg">
                Rakan<span class="text-[#23B750]">Sales</span>
              </span>
            </div>

            <div class="space-y-1 mb-6">
              <h2 class="text-2xl font-bold text-gray-900 tracking-tight">Log in</h2>
              <p class="text-xs text-gray-500">Welcome back! Please enter your details.</p>
            </div>

            <form @submit.prevent="submitLogin" class="space-y-4">
              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1">Email</label>
                <input
                  v-model="loginEmail"
                  type="email"
                  required
                  placeholder="justin+1@veecotech.com"
                  class="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#23B750]/20 focus:border-[#23B750]"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1">Password</label>
                <input
                  v-model="loginPassword"
                  type="password"
                  required
                  placeholder="••••••••••••"
                  class="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#23B750]/20 focus:border-[#23B750]"
                />
              </div>

              <div class="flex items-center justify-between text-xs">
                <label class="flex items-center gap-2 cursor-pointer text-gray-600">
                  <input type="checkbox" checked class="rounded border-gray-300 text-[#23B750] focus:ring-[#23B750]" />
                  <span>Remember for 30 days</span>
                </label>
                <a href="#" class="text-emerald-700 font-bold hover:underline">Forgot password</a>
              </div>

              <button
                type="submit"
                class="w-full py-2.5 bg-[#23B750] hover:bg-[#1a943e] text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Sign in →
              </button>
            </form>
          </div>

          <div class="text-center text-xs text-gray-500 pt-4 border-t border-gray-100">
            Don't have an account?
            <button type="button" @click="mode = 'signup'" class="text-emerald-700 font-bold hover:underline ml-1 cursor-pointer">
              Create a new account
            </button>
          </div>
        </div>

        <!-- Right Visual Showcase -->
        <div class="hidden lg:col-span-6 bg-gradient-to-br from-gray-900 to-gray-950 p-8 text-white flex flex-col justify-between relative overflow-hidden text-left">
          <div class="space-y-2 relative z-10">
            <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
              AI Sales CRM
            </span>
            <h3 class="text-xl font-bold text-white leading-snug">
              AI-Powered Sales Automation for Growing Businesses
            </h3>
            <p class="text-xs text-gray-400 leading-relaxed">
              Turns every WhatsApp chat into a qualified sales opportunity with auto-assign and instant closing workflows.
            </p>
          </div>

          <!-- Mini Omnichannel Graphic Representation -->
          <div class="mt-6 bg-gray-800/80 border border-gray-700/60 rounded-2xl p-3 shadow-xl space-y-2 backdrop-blur-sm relative z-10">
            <div class="flex items-center justify-between text-[11px] border-b border-gray-700/50 pb-2">
              <span class="font-bold text-gray-200">Conversations</span>
              <span class="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full font-mono text-[10px]">20 active</span>
            </div>
            <div class="space-y-1.5">
              <div class="p-2 bg-gray-900/80 rounded-xl flex items-center justify-between text-xs">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[10px]">
                    MW
                  </div>
                  <div>
                    <div class="font-bold text-gray-100 text-[11px]">Mel Wong</div>
                    <div class="text-[10px] text-gray-400">WhatsApp · High Intent</div>
                  </div>
                </div>
                <span class="text-[10px] text-emerald-400 font-mono">RM 45,000</span>
              </div>

              <div class="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-[11px] text-emerald-200">
                ✨ AI: "I'll send over the project quotation right away."
              </div>
            </div>
          </div>

          <div class="text-[10px] text-gray-500 relative z-10 mt-4">
            © 2026 RakanSales CRM. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { Zap, UserPlus, Mail, Eye, EyeOff } from 'lucide-vue-next';

const router = useRouter();
const mode = ref<'signup' | 'verify' | 'login'>('signup');
const showPassword = ref(false);
const countdown = ref(45);

const signupForm = reactive({
  fullName: 'Justin Wong',
  companyName: 'VeecoTech Solutions',
  email: 'justin+1@veecotech.com',
  password: 'Password123!',
  confirmPassword: 'Password123!',
});

const loginEmail = ref('justin+1@veecotech.com');
const loginPassword = ref('••••••••••••');

const otpDigits = reactive(['8', '3', '7', '1', '9', '2']);

function submitSignup() {
  mode.value = 'verify';
}

function handleOtpInput(e: Event, idx: number) {
  const target = e.target as HTMLInputElement;
  const val = target.value;
  if (val && idx < 5) {
    const nextInput = document.getElementById(`otp-${idx + 1}`);
    if (nextInput) nextInput.focus();
  }
}

function handleOtpBackspace(e: Event, idx: number) {
  if (!otpDigits[idx] && idx > 0) {
    const prevInput = document.getElementById(`otp-${idx - 1}`);
    if (prevInput) prevInput.focus();
  }
}

function submitOtp() {
  router.push('/onboarding');
}

function submitLogin() {
  router.push('/onboarding');
}

function resendOtp() {
  countdown.value = 60;
  alert('New verification code sent to your email.');
}
</script>
