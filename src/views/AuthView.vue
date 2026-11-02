<template>
  <div class="h-full overflow-y-auto bg-background flex flex-col font-sans selection:bg-primary/20 selection:text-primary custom-scrollbar">
    <!-- CRM In-App Page Header Banner -->
    <div class="bg-card border-b border-border px-6 py-5 shrink-0">
      <div class="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-1">
            <span>Dashboard</span>
            <span>/</span>
            <span>Authentication</span>
            <span>/</span>
            <span class="text-primary font-bold">Portal Preview</span>
          </div>
          <div class="flex items-center gap-3">
            <h1 class="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
              Authentication Portal
            </h1>
            <span class="px-2.5 py-0.5 rounded-full bg-success/10 text-success text-xs font-bold border border-success/20">
              Interactive Flow
            </span>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2.5">
          <!-- Mode Switcher Tabs for Testing -->
          <div class="flex items-center gap-1 p-1 bg-muted rounded-xl text-xs font-semibold">
            <button
              type="button"
              @click="mode = 'signup'"
              :class="[
                'px-3 py-1.5 rounded-lg transition-all cursor-pointer',
                mode === 'signup' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
              ]"
            >
              1. Sign Up
            </button>
            <button
              type="button"
              @click="mode = 'verify'"
              :class="[
                'px-3 py-1.5 rounded-lg transition-all cursor-pointer',
                mode === 'verify' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
              ]"
            >
              2. OTP Verification
            </button>
            <button
              type="button"
              @click="mode = 'login'"
              :class="[
                'px-3 py-1.5 rounded-lg transition-all cursor-pointer',
                mode === 'login' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
              ]"
            >
              3. Login
            </button>
          </div>

          <router-link
            to="/onboarding"
            class="text-xs font-bold text-success hover:text-success/90 bg-success/10 hover:bg-success/20 px-3 py-1.5 rounded-lg border border-success/20 transition-colors flex items-center gap-1"
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
        class="w-full max-w-md bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-5 animate-in fade-in-50 duration-200 text-left text-card-foreground"
      >
        <div class="text-center space-y-1">
          <div class="w-10 h-10 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center font-bold mb-2">
            <UserPlus class="w-5 h-5" />
          </div>
          <h2 class="text-2xl font-bold text-foreground tracking-tight">Create an account</h2>
          <p class="text-xs text-muted-foreground">Start your 14-day free trial. No credit card required.</p>
        </div>

        <form @submit.prevent="submitSignup" class="space-y-4">
          <!-- Name & Company (2 Columns) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-foreground mb-1">Full Name</label>
              <input
                v-model="signupForm.fullName"
                type="text"
                required
                placeholder="e.g. Bruce Wayne"
                class="w-full px-3 py-2 bg-background border border-input rounded-xl text-xs font-medium text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-foreground mb-1">Company Name</label>
              <input
                v-model="signupForm.companyName"
                type="text"
                required
                placeholder="e.g. Wayne Tech"
                class="w-full px-3 py-2 bg-background border border-input rounded-xl text-xs font-medium text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <!-- Work Email -->
          <div>
            <label class="block text-xs font-semibold text-foreground mb-1">Work Email</label>
            <input
              v-model="signupForm.email"
              type="email"
              required
              placeholder="bruce@waynetech.com"
              class="w-full px-3 py-2 bg-background border border-input rounded-xl text-xs font-medium text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <!-- Password -->
          <div>
            <label class="block text-xs font-semibold text-foreground mb-1">Password</label>
            <div class="relative">
              <input
                v-model="signupForm.password"
                :type="showPassword ? 'text' : 'password'"
                required
                placeholder="••••••••"
                class="w-full px-3 py-2 bg-background border border-input rounded-xl text-xs font-medium text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary pr-8"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <Eye v-if="!showPassword" class="w-3.5 h-3.5" />
                <EyeOff v-else class="w-3.5 h-3.5" />
              </button>
            </div>

            <!-- Password Requirements Checklist -->
            <div class="mt-2.5 p-2.5 bg-muted/50 rounded-xl border border-border grid grid-cols-2 gap-1.5 text-[10px]">
              <div class="flex items-center gap-1.5" :class="signupForm.password.length >= 6 ? 'text-success font-bold' : 'text-muted-foreground'">
                <span>{{ signupForm.password.length >= 6 ? '✓' : '○' }}</span>
                <span>Min 6 characters</span>
              </div>
              <div class="flex items-center gap-1.5" :class="/[A-Z]/.test(signupForm.password) ? 'text-success font-bold' : 'text-muted-foreground'">
                <span>{{ /[A-Z]/.test(signupForm.password) ? '✓' : '○' }}</span>
                <span>Uppercase letter</span>
              </div>
              <div class="flex items-center gap-1.5" :class="/[a-z]/.test(signupForm.password) ? 'text-success font-bold' : 'text-muted-foreground'">
                <span>{{ /[a-z]/.test(signupForm.password) ? '✓' : '○' }}</span>
                <span>Lowercase letter</span>
              </div>
              <div class="flex items-center gap-1.5" :class="/[0-9]/.test(signupForm.password) ? 'text-success font-bold' : 'text-muted-foreground'">
                <span>{{ /[0-9]/.test(signupForm.password) ? '✓' : '○' }}</span>
                <span>At least one number</span>
              </div>
            </div>
          </div>

          <!-- Confirm Password -->
          <div>
            <label class="block text-xs font-semibold text-foreground mb-1">Confirm Password</label>
            <input
              v-model="signupForm.confirmPassword"
              type="password"
              required
              placeholder="••••••••"
              class="w-full px-3 py-2 bg-background border border-input rounded-xl text-xs font-medium text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <button
            type="submit"
            class="w-full py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Create account</span>
            <span>→</span>
          </button>
        </form>

        <div class="text-center text-[11px] text-muted-foreground space-y-1">
          <p>
            By creating an account, you agree to our <a href="#" class="text-primary hover:underline">T & C</a> and <a href="#" class="text-primary hover:underline">Privacy policy</a>.
          </p>
          <p>
            Already have an account? <button type="button" @click="mode = 'login'" class="text-primary font-bold hover:underline cursor-pointer">Login to RakanSales</button>
          </p>
        </div>
      </div>

      <!-- 2. OTP VERIFICATION SCREEN -->
      <div
        v-else-if="mode === 'verify'"
        class="w-full max-w-md bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in-50 duration-200 text-center text-card-foreground"
      >
        <div class="w-12 h-12 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center font-bold">
          <Mail class="w-6 h-6" />
        </div>

        <div class="space-y-1">
          <h2 class="text-2xl font-bold text-foreground tracking-tight">Verify your email</h2>
          <p class="text-xs text-muted-foreground">
            Enter the 6-digit code we sent to <br /><strong class="text-foreground font-medium">{{ signupForm.email || 'justin+1@veecotech.com' }}</strong>
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
            class="w-11 h-12 text-center text-lg font-bold font-mono bg-muted/50 border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:bg-background transition-all shadow-xs"
          />
        </div>

        <button
          type="button"
          @click="submitOtp"
          class="w-full py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>Verify & Start Setup Wizard</span>
          <span>→</span>
        </button>

        <div class="space-y-2 text-xs">
          <div class="text-muted-foreground">
            Didn't receive code?
            <button
              type="button"
              @click="resendOtp"
              :disabled="countdown > 0"
              class="text-primary font-bold hover:underline disabled:opacity-50 ml-1 cursor-pointer"
            >
              {{ countdown > 0 ? `Resend code in ${countdown}s` : 'Resend code' }}
            </button>
          </div>
          <div>
            <button type="button" @click="mode = 'login'" class="text-muted-foreground hover:text-foreground font-medium">
              ← Back to login
            </button>
          </div>
        </div>
      </div>

      <!-- 3. LOGIN SCREEN (SPLIT VIEW) -->
      <div
        v-else-if="mode === 'login'"
        class="w-full max-w-4xl bg-card border border-border rounded-3xl shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 animate-in fade-in-50 duration-200 text-card-foreground"
      >
        <!-- Left Login Form -->
        <div class="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between text-left space-y-6">
          <div>
            <div class="flex items-center gap-2 mb-6">
              <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-brand-secondary flex items-center justify-center text-primary-foreground shadow-xs">
                <Zap class="w-4 h-4" />
              </div>
              <span class="font-bold text-foreground text-lg">
                Rakan<span class="text-primary">Sales</span>
              </span>
            </div>

            <div class="space-y-1 mb-6">
              <h2 class="text-2xl font-bold text-foreground tracking-tight">Log in</h2>
              <p class="text-xs text-muted-foreground">Welcome back! Please enter your details.</p>
            </div>

            <form @submit.prevent="submitLogin" class="space-y-4">
              <div>
                <label class="block text-xs font-semibold text-foreground mb-1">Email</label>
                <input
                  v-model="loginEmail"
                  type="email"
                  required
                  placeholder="justin+1@veecotech.com"
                  class="w-full px-3.5 py-2.5 bg-background border border-input rounded-xl text-xs font-medium text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-foreground mb-1">Password</label>
                <input
                  v-model="loginPassword"
                  type="password"
                  required
                  placeholder="••••••••••••"
                  class="w-full px-3.5 py-2.5 bg-background border border-input rounded-xl text-xs font-medium text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div class="flex items-center justify-between text-xs">
                <label class="flex items-center gap-2 cursor-pointer text-muted-foreground">
                  <input type="checkbox" checked class="rounded border-input text-primary focus:ring-primary bg-background" />
                  <span>Remember for 30 days</span>
                </label>
                <a href="#" class="text-primary font-bold hover:underline">Forgot password</a>
              </div>

              <button
                type="submit"
                class="w-full py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Sign in →
              </button>
            </form>
          </div>

          <div class="text-center text-xs text-muted-foreground pt-4 border-t border-border">
            Don't have an account?
            <button type="button" @click="mode = 'signup'" class="text-primary font-bold hover:underline ml-1 cursor-pointer">
              Create a new account
            </button>
          </div>
        </div>

        <!-- Right Visual Showcase -->
        <div class="hidden lg:col-span-6 bg-rail border-l border-rail-border p-8 text-rail-foreground flex flex-col justify-between relative overflow-hidden text-left">
          <div class="space-y-2 relative z-10">
            <span class="px-2.5 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider">
              AI Sales CRM
            </span>
            <h3 class="text-xl font-bold text-rail-foreground leading-snug">
              AI-Powered Sales Automation for Growing Businesses
            </h3>
            <p class="text-xs text-rail-muted-foreground leading-relaxed">
              Turns every WhatsApp chat into a qualified sales opportunity with auto-assign and instant closing workflows.
            </p>
          </div>

          <!-- Mini Omnichannel Graphic Representation -->
          <div class="mt-6 bg-rail-active/60 border border-rail-border rounded-2xl p-3 shadow-xl space-y-2 backdrop-blur-sm relative z-10">
            <div class="flex items-center justify-between text-[11px] border-b border-rail-border pb-2">
              <span class="font-bold text-rail-foreground">Conversations</span>
              <span class="px-2 py-0.5 bg-primary/20 text-primary rounded-full font-mono text-[10px]">20 active</span>
            </div>
            <div class="space-y-1.5">
              <div class="p-2 bg-rail/80 rounded-xl flex items-center justify-between text-xs">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-[10px]">
                    MW
                  </div>
                  <div>
                    <div class="font-bold text-rail-foreground text-[11px]">Mel Wong</div>
                    <div class="text-[10px] text-rail-muted-foreground">WhatsApp · High Intent</div>
                  </div>
                </div>
                <span class="text-[10px] text-primary font-mono">RM 45,000</span>
              </div>

              <div class="p-2 bg-primary/15 border border-primary/30 rounded-xl text-[11px] text-primary">
                ✨ AI: "I'll send over the project quotation right away."
              </div>
            </div>
          </div>

          <div class="text-[10px] text-rail-muted-foreground relative z-10 mt-4">
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
