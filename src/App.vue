<!-- App.vue -->
<script setup lang="ts">
import { useBreakpoints, breakpointsTailwind } from '@vueuse/core';
import OrderPanel from '@/components/OrderPanel.vue';
import MapBox from '@/components/MapBox.vue';
import { ref, watch } from 'vue';
import { useXRoutenData } from '@/composables/useXRoutenData';

const { xRoutenTrackingObject, getTrackingData, isLoading, error } =
  useXRoutenData();
const breakpoints = useBreakpoints(breakpointsTailwind);
const isMobile = breakpoints.smaller('md');
const isOpen = ref(false);

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
    <MapBox
      :tracking-data="xRoutenTrackingObject"
      class="transition-all duration-500"
      :class="{ 'blur-md grayscale-[0.2] pointer-events-none': error }"
    />

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

    <div
      v-if="error "
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/5"
    >
      <aside
        class="bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-orange-500/20 max-w-md w-full p-10 text-center animate-in zoom-in duration-300"
      >
        <div
          class="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-orange-100 text-orange-600 mb-6 shadow-inner"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-10 h-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h2 class="text-2xl font-black text-gray-900 mb-3">
          {{ error === 'INVALID_UUID' ? 'Ungültiger Link' : 'Nicht gefunden' }}
        </h2>
        <p class="text-gray-600 mb-8 leading-relaxed">
          <template v-if="error === 'INVALID_UUID'">
            Das Format der Sendungs-ID ist nicht korrekt. Bitte prüfe den Link
            in deiner Bestätigung erneut.
          </template>

          <template v-else>
            Ein technischer Fehler ist aufgetreten. Bitte versuche es in ein
            paar Minuten noch einmal.
          </template>
        </p>
        <button
          v-if="error !== 'INVALID_UUID'"
          @click="getTrackingData"
          :disabled="isLoading"
          class="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl transition-all shadow-lg active:scale-95 disabled:opacity-70 flex items-center justify-center gap-3"
        >
          <div
            v-if="isLoading"
            class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
          ></div>
          {{ isLoading ? 'Prüfe Verbindung...' : 'Erneut versuchen' }}
        </button>
      </aside>
    </div>

    <div
      v-else-if="isLoading && !xRoutenTrackingObject"
      class="fixed inset-0 z-40 flex items-center justify-center bg-white/10 backdrop-blur-sm"
    >
      <div class="flex flex-col items-center gap-4">
        <div
          class="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"
        ></div>
        <span
          class="text-orange-600 font-bold tracking-widest text-xs uppercase"
          >Lade Daten...</span
        >
      </div>
    </div>

    <aside
      v-else-if="xRoutenTrackingObject"
      class="fixed z-40 bg-white/70 backdrop-blur rounded-3xl shadow-2xl border border-orange-500/30 overflow-hidden max-w-sm w-full transform transition-all duration-300"
      :class="isMobile ? 'bottom-0 left-1/2 -translate-x-1/2' : 'top-25 left-4'"
    >
      <OrderPanel
        v-model="isOpen"
        :is-mobile="isMobile"
        :tracking-data="xRoutenTrackingObject"
        @refresh="getTrackingData"
      />
    </aside>
  </main>
</template>
