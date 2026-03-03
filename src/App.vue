<!-- App.vue -->
<script setup lang="ts">
import { useBreakpoints, breakpointsTailwind } from '@vueuse/core';
import OrderPanel from '@/components/OrderPanel.vue';
import MapBox from '@/components/MapBox.vue';
import { ref, watch} from 'vue';
import { useXRoutenData } from '@/composables/useXRoutenData';

const { xRoutenTrackingObject, getTrackingData, isLoading } = useXRoutenData();
const breakpoints = useBreakpoints(breakpointsTailwind);
const isMobile = breakpoints.smaller('md');
const isOpen = ref(false);

// Reagiere auf Änderungen der Bildschirmgröße, um das Panel entsprechend zu öffnen oder zu schließen
watch(
  isMobile,
  (value: boolean) => {
    isOpen.value = !value;
  },
  { immediate: true }
);

getTrackingData();
</script>

<template>
  <main class="fixed inset-0 bg-gray-200 flex flex-col">
    <!-- Karte -->
    <MapBox :tracking-data="xRoutenTrackingObject" />

    <!-- Header -->
    <header
      class="fixed left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 select-none"
    >
      <div class="flex items-center justify-center gap-1 py-4 px-6">
        <img
          src="/logo_dark.png"
          alt="xRouten"
          class="h-10 w-10 object-contain"
        />
        <h1 class="text-2xl font-black text-gray-900 tracking-tight">
          xRouten
        </h1>
      </div>
    </header>

    <!-- Panel links oben bzw unten je nach Bildschirmgröße -->
    <aside
      class="fixed z-40 bg-white/70 backdrop-blur rounded-3xl shadow-2xl border border-orange-500/30 overflow-hidden max-w-sm w-full transform transition-all duration-300 hover:shadow-3xl"
      :class="isMobile ? 'bottom-0 left-1/2 -translate-x-1/2' : 'top-25 left-4'"
    >
      <OrderPanel
        v-model="isOpen"
        :is-mobile="isMobile"
        :tracking-data="xRoutenTrackingObject"
        :is-loading="isLoading"
        @refresh="getTrackingData"
      />
    </aside>
  </main>
</template>
