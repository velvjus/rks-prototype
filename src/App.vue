<script setup lang="ts">
import AppShell from './components/layout/AppShell.vue'
import { Toaster } from '@/components/ui/sonner'
</script>

<template>
  <AppShell>
    <RouterView />
  </AppShell>
  <Toaster position="bottom-right" richColors />
</template>

<style>
/* Global styles for the app container */
#app {
  height: 100vh;
  width: 100vw;
}
</style>
