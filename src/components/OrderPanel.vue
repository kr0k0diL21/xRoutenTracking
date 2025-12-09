<!-- OrderPanel -->
<script setup lang="ts">
import { ref, computed } from 'vue';
import ChevronRight from '@/assets/icons/ChevronRight.vue';
import MapIcon from '@/assets/icons/MapIcon.vue';
import ChevronUpDown from '@/assets/icons/ChevronUpDown.vue';

const isOpen = defineModel<boolean>({ default: false });
const status = ref(['Unterwegs', 'Erledigt']);
const stopps = ref(2);
const subtitleStopps = ref(['Auf dem Weg', 'Fast da']);

const timelineItems = computed(() => {
  const items = [];

  if (stopps.value > 0) {
    items.push(
      {
        type: 'driver',
        title: 'Fahrer',
        subtitle: 'Musterstraße 123, 10115 Berlin',
      },
      {
        type: 'stop',
        title: 'Verbleibende Stopps: ' + stopps.value,
        subtitle:
          stopps.value > 1 ? subtitleStopps.value[0] : subtitleStopps.value[1],
      }
    );
  }

  items.push({
    type: 'destination',
    title: 'Ziel',
    subtitle: 'Beispielweg 456, 20457 Hamburg',
    eta: '14:30 Uhr',
    status: stopps.value > 0 ? 'Ankunft ca. ' : 'Abgeschlossen um ',
    coords: { lng: 9.9844, lat: 53.5413 },
  });

  return items;
});
</script>

<template>
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
        <ChevronRight />
        <span class="truncate">Hamburg</span>
      </div>
    </div>

    <div
      class="inline-flex items-center rounded-full mb-5 px-3.5 py-1.5 text-xs font-bold ring-1"
      :class="
        stopps <= 0
          ? 'bg-green-100 text-green-800 ring-green-200'
          : 'bg-blue-100 text-blue-800 ring-blue-200'
      "
    >
      <span
        class="w-2 h-2 rounded-full mr-2 animate-pulse"
        :class="stopps <= 0 ? 'bg-green-500' : 'bg-blue-500'"
      ></span>
      {{ stopps <= 0 ? status[1] : status[0] }}
    </div>
    <ChevronUpDown :isOpen="isOpen" />
  </button>
  <!-- Ausklappbarer Inhalt -->
  <div
    class="grid transition-[grid-template-rows] duration-500 ease-in-out"
    :class="isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
  >
    <div class="overflow-hidden">
      <!-- Mittlerer Inhalt -->
      <div class="mx-6 py-6 border-t border-b border-orange-500/10">
        <!-- Schlichte Timeline -->
        <div class="relative py-1">
          <!-- Timeline Linie -->
          <div
            class="absolute top-2.5 left-2.5 bottom-9 w-0.5 bg-gray-200"
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
              class="absolute top-[4px] left-[11px] flex items-center justify-center -translate-x-1/2"
            >
              <!-- Fahrer Icon -->
              <div
                v-if="item.type === 'driver'"
                class="w-5 h-5 rounded-full bg-orange-500 ring-4 ring-white"
              ></div>
              <!-- Ziel Icon -->
              <div
                v-else-if="item.type === 'destination'"
                class="w-5 h-5 rounded-full ring-4"
                :class="
                  stopps <= 0
                    ? 'bg-orange-500 ring-white'
                    : 'bg-white ring-gray-300'
                "
              ></div>
              <!-- Zwischenstopp Icon -->
              <div
                v-else
                class="w-3 h-3 rounded-full bg-orange-500 ring-4 ring-white"
              ></div>
            </div>
            <!-- Text -->
            <div class="ml-8 mr-10">
              <p class="text-sm font-semibold text-gray-800">
                {{ item.title }}
              </p>
              <p class="text-xs text-gray-500">{{ item.subtitle }}</p>
              <p
                v-if="item.eta"
                class="text-xs font-semibold mt-1"
                :class="stopps <= 0 ? 'text-green-800' : 'text-blue-800'"
              >
                {{ item.status + item.eta }}
              </p>
            </div>

            <!-- Center Button -->
            <button
              v-if="item.type === 'driver' || item.type === 'destination'"
              class="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors p-2 -mr-2"
            >
              <MapIcon />
            </button>
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
</template>
