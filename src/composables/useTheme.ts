import { ref, computed, watch, type Ref, type ComputedRef } from 'vue'

export type ThemeMode = 'light' | 'dark' | 'system'

export interface UseThemeReturn {
  mode: Ref<ThemeMode>
  isDark: ComputedRef<boolean>
  setMode: (mode: ThemeMode) => void
  toggleTheme: () => void
}

const STORAGE_KEY = 'rks-theme'
const LEGACY_STORAGE_KEY = 'rks-dark'

function getInitialMode(): ThemeMode {
  if (typeof window === 'undefined') return 'system'
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      return saved
    }
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY)
    if (legacy === 'true') return 'dark'
    if (legacy === 'false') return 'light'
  } catch {
    // ignore storage access errors in restricted environments
  }
  return 'system'
}

function applyThemeClass(dark: boolean) {
  if (typeof document === 'undefined') return
  if (dark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// Module-level shared singleton reactive state
const mode = ref<ThemeMode>(getInitialMode())
const systemPrefersDark = ref(false)

if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  systemPrefersDark.value = mediaQuery.matches
  if (typeof mediaQuery?.addEventListener === 'function') {
    mediaQuery.addEventListener('change', (e) => {
      systemPrefersDark.value = e.matches
      if (mode.value === 'system') {
        applyThemeClass(e.matches)
      }
    })
  }
}

const isDark = computed(() => {
  if (mode.value === 'system') return systemPrefersDark.value
  return mode.value === 'dark'
})

// Immediately apply class on module initialization and watch for changes
watch(isDark, (val) => {
  applyThemeClass(val)
}, { immediate: true })

export function useTheme(): UseThemeReturn {
  function setMode(newMode: ThemeMode) {
    mode.value = newMode
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, newMode)
        localStorage.setItem(LEGACY_STORAGE_KEY, String(isDark.value))
      } catch {
        // ignore storage errors
      }
    }
    applyThemeClass(isDark.value)
  }

  function toggleTheme() {
    setMode(isDark.value ? 'light' : 'dark')
  }

  return {
    mode,
    isDark,
    setMode,
    toggleTheme,
  }
}
