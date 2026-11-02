<script setup>
import { cn } from "@/lib/utils";

const props = defineProps({
  class: {
    type: [Boolean, null, String, Object, Array],
    required: false,
    skipCheck: true,
  },
});
</script>

<template>
  <div
    :class="
      cn('rounded-xl border border-border bg-card text-card-foreground shadow-soft transition-all duration-200', props.class)
    "
  >
    <slot />
  </div>
</template>
