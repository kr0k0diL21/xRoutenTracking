<!-- App.vue -->
<script setup lang="ts">
import { useBreakpoints, breakpointsTailwind } from '@vueuse/core';
import OrderPanel from '@/components/OrderPanel.vue';
import MapBox from '@/components/MapBox.vue';
import { ref, watch } from 'vue';
import { useXRoutenData } from '@/composables/useXRoutenData';

const { xRoutenTrackingObject, getTrackingData, isLoading, error } = useXRoutenData();
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
    <MapBox :tracking-data="xRoutenTrackingObject" />

    <header class="fixed left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 select-none">
      <div class="flex items-center justify-center gap-1 py-4 px-6">
        <img src="/logo_dark.png" alt="xRouten" class="h-10 w-10 object-contain" />
        <h1 class="text-2xl font-black text-gray-900 tracking-tight">xRouten</h1>
      </div>
    </header>

    <aside
      class="fixed z-40 bg-white/70 backdrop-blur rounded-3xl shadow-2xl border border-orange-500/30 overflow-hidden max-w-sm w-full transform transition-all duration-300 hover:shadow-3xl"
      :class="isMobile ? 'bottom-0 left-1/2 -translate-x-1/2' : 'top-25 left-4'"
    >

      <div v-if="error" class="p-8 text-center animate-in fade-in zoom-in duration-300">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <h2 class="text-xl font-black text-gray-900 mb-2">
          {{ error === 'INVALID_UUID' ? 'Ungültiger Link' : 'Nicht gefunden' }}
        </h2>

        <p class="text-sm text-gray-600 mb-6 leading-relaxed">
          <template v-if="error === 'INVALID_UUID'">
            Das Format der Sendungs-ID ist nicht korrekt. Bitte prüfe den Link erneut.
          </template>
          <template v-else-if="error === 'NOT_FOUND'">
            Wir konnten keine aktive Lieferung zu dieser ID finden.
          </template>
          <template v-else>
            Ein technischer Fehler ist aufgetreten. Bitte versuche es in ein paar Minuten noch einmal.
          </template>
        </p>
      </div>

      <OrderPanel
        v-else
        v-model="isOpen"
        :is-mobile="isMobile"
        :tracking-data="xRoutenTrackingObject"
        :is-loading="isLoading"
        @refresh="getTrackingData"
      />
    </aside>
  </main>
</template>
