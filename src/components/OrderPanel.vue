<!-- OrderPanel -->
<script setup lang="ts">
import { ref } from 'vue';

const isOpen = defineModel<boolean>();

const timelineItems = ref([
  {
    type: 'driver',
    title: 'Fahrer Position',
    subtitle: 'Musterstraße 123, 10115 Berlin',
  },
  {
    type: 'stop',
    title: 'Verbleibende Stopps: 2',
    subtitle: 'Auf dem Weg',
  },
  {
    type: 'stop',
    title: 'Verbleibende Stopps: 1',
    subtitle: 'Fast am Ziel',
  },
  {
    type: 'destination',
    title: 'Ziel',
    subtitle: 'Beispielweg 456, 20457 Hamburg',
    eta: 'Ankunft: ca. 14:30 Uhr',
  },
]);
</script>

<template>
  <!-- Order-Box-->
  <div
    class="bg-white/70 backdrop-blur rounded-3xl shadow-2xl border border-orange-500/30 overflow-hidden max-w-sm w-full mx-auto transform transition-all duration-300 hover:shadow-3xl"
  >
    <!-- Header -->
    <button
      @click="isOpen = !isOpen"
      class="w-full p-6 text-left flex items-center gap-4 hover:bg-orange-50/50 transition-colors"
    >
      <div class="flex-1 min-w-0">
        <div
          class="text-xl font-bold text-gray-900 tracking-tight wrap-break-word"
        >
          SH-2025-00421
        </div>
        <div class="text-sm text-gray-600 mt-1 flex items-center gap-2">
          <span class="truncate">Fahrer Position</span>
          <svg
            class="w-3 h-3 text-gray-400 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M14 5l7 7-7 7"
            />
          </svg>
          <span class="truncate">Hamburg</span>
        </div>
      </div>

      <div
        class="inline-flex items-center rounded-full bg-green-100 mb-5 px-3.5 py-1.5 text-xs font-bold text-green-800 ring-1 ring-green-200"
      >
        <span
          class="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"
        ></span>
        Unterwegs
      </div>

      <svg
        class="w-8 h-8 text-gray-500 transition-transform duration-0 shrink-0 mb-5"
        :class="{ 'rotate-180': isOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>
    <!-- Ausklappbares Inhalt -->
    <div
      class="grid transition-[grid-template-rows] duration-500 ease-in-out"
      :class="isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
    >
      <div class="overflow-hidden">
        <!-- Mittlerer Inhalt -->
        <div class="ml-6 mr-6 pt-6 pb-6 border-t border-b border-orange-500/10">
          <div class="relative">
            <!-- Schlichte Timeline -->
            <div class="relative py-2">
              <!-- Timeline Linie -->
              <div
                class="absolute top-[10px] left-[10px] bottom-9 w-0.5 bg-gray-200"
              ></div>

              <!-- Timeline Items -->
              <div
                v-for="(item, index) in timelineItems"
                :key="index"
                class="relative"
                :class="{ 'mb-8': index < timelineItems.length - 1 }"
              >
                <!-- Icon -->
                <div
                  class="absolute top-[3px] left-[10px] flex items-center justify-center -translate-x-1/2"
                >
                  <!-- Fahrer Icon -->
                  <div
                    v-if="item.type === 'driver'"
                    class="w-5 h-5 rounded-full bg-orange-500 ring-4 ring-white"
                  ></div>
                  <!-- Ziel Icon -->
                  <div
                    v-else-if="item.type === 'destination'"
                    class="w-5 h-5 rounded-full bg-white ring-4 ring-gray-300"
                  ></div>
                  <!-- Zwischenstopp Icon -->
                  <div
                    v-else
                    class="w-3 h-3 rounded-full bg-gray-400 ring-2 ring-white"
                  ></div>
                </div>
                <!-- Text -->
                <div class="ml-8">
                  <p class="text-sm font-semibold text-gray-800">
                    {{ item.title }}
                  </p>
                  <p class="text-xs text-gray-500">{{ item.subtitle }}</p>
                  <p
                    v-if="item.eta"
                    class="text-xs text-orange-600 font-semibold mt-1"
                  >
                    {{ item.eta }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Footer Fahrerkontakt -->
        <div class="m-7 flex justify-between items-center text-left">
          <div class="text-sm text-gray-600">
            <p><span class="font-medium">Fahrer:</span> xxx</p>
            <p class="text-xs text-gray-500 mt-1">Tel: xxx</p>
          </div>
          <button
            class="bg-orange-500 text-white px-5 py-2 rounded-lg hover:bg-orange-600 transition text-sm font-medium"
          >
            Kontaktieren
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
