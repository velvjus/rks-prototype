<script setup lang="ts">
import AppShell from './components/layout/AppShell.vue'
</script>

<template>
  <AppShell>
    <RouterView />
  </AppShell>
</template>

<style>
/* Global styles for the app container */
#app {
  height: 100vh;
  width: 100vw;
}
</style>
