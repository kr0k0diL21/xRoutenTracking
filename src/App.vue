<!-- App.vue -->
<script setup lang="ts">
import { useBreakpoints, breakpointsTailwind } from '@vueuse/core';
import MobileLayout from '@/components/MobileLayout.vue';
import DesktopLayout from '@/components/DesktopLayout.vue';
const breakpoints = useBreakpoints(breakpointsTailwind);
const isMobile = breakpoints.smaller('md');
</script>

<template>
  <MobileLayout v-if="isMobile" />
  <DesktopLayout v-else />
</template>
