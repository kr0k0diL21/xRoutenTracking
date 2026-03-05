<!-- src/components/OrderPanel.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import MapIcon from '@/assets/icons/MapIcon.vue';
import ReloadButton from '@/assets/icons/ReloadButton.vue';
import { statusConfig, getStatusConfig } from '@/utils/orderPanelUtils';
import type { xRoutenTrackingData } from '@/types/trackingDataTypes';
import { useMapboxData } from '@/composables/useMapboxData';

const { flyToLocation } = useMapboxData();
const isOpen = defineModel<boolean>({ default: false });
const props = defineProps<{
  trackingData: xRoutenTrackingData | null;
  isMobile: boolean;
  isLoading: boolean;
}>();

// Timeline-Daten
const currentStatus = computed(() => {
  if (!props.trackingData) {
    return statusConfig.loading;
  }
  const s = props.trackingData.status;
  if (s === 'pending') return statusConfig.pending;
  if (s === 'completed') return statusConfig.completed;
  if (s === 'failed') return statusConfig.failed;
  if (s === 'unknown') return statusConfig.unknown;

  return statusConfig.loading;
});

// Timeline-Logik basierend auf den neuen Props
const timelineItems = computed(() => {
  return getStatusConfig(props.trackingData);
});

// Funktion zum Zentrieren der Karte auf Fahrer oder Ziel
function handleCenterMap(type: string) {
  if (!props.trackingData) return;

  if (type === 'driver') {
    const start = props.trackingData.start.coordinates;
    flyToLocation(start);
  } else if (type === 'destination') {
    const end = props.trackingData.end.coordinates;
    flyToLocation(end);
  }
}

const emit = defineEmits(['refresh']);

// Manuelle Aktualisierungsfunktion
function manuelRefresh() {
  emit('refresh');
}
</script>

<template>
  <!-- Header -->
  <div
    @click="isOpen = !isOpen"
    class="w-full p-6 text-left flex justify-between items-center transition-colors"
    :class="isMobile ? '' : 'hover:bg-orange-50/50'"
  >
    <div>
      <p class="text-2xl font-black text-gray-900 leading-none">Lieferstatus</p>
    </div>

    <button
      class="inline-flex items-center rounded-full px-3.5 py-1.5 text-xm font-bold ring-1 transition-all"
      :class="currentStatus.badge"
      @click.stop="manuelRefresh()"
    >
      <div
        v-if="props.isMobile"
        class="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-300 rounded-full"
      ></div>
      <ReloadButton
        v-if="props.trackingData?.status === 'pending'"
        class="w-3.5 h-3.5 mr-2"
        :class="{ 'animate-spin': isLoading, 'animate-pulse': !isLoading }"
      />
      <span
        v-else
        class="w-2 h-2 rounded-full mr-2"
        :class="[
          currentStatus.dot,
          { 'animate-pulse': props.trackingData?.status === 'completed' },
        ]"
      ></span>
      {{ currentStatus.label }}
    </button>
  </div>

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
            :class="{ 'mb-9': index < timelineItems.length - 1 }"
          >
            <!-- Icon -->
            <div
              class="absolute top-1 left-[11px] flex items-center justify-center -translate-x-1/2 -translate-y-1/7"
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
                  props.trackingData?.status === 'completed'
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
            <div class="ml-8">
              <p class="text-sm font-semibold text-gray-800">
                {{ item.title }}
              </p>
              <p class="text-xs text-gray-500">{{ item.address }}</p>
              <p
                v-if="item.timestamp"
                class="text-xs font-semibold mt-1"
                :class="currentStatus.text"
              >
                {{ item.status }}
                <template
                  v-if="
                    props.trackingData?.status === 'pending' ||
                    props.trackingData?.status === 'completed'
                  "
                >
                  {{ item.timestamp }}
                </template>
              </p>
            </div>

            <!-- Center Button -->
            <button
              v-if="item.type === 'driver' || item.type === 'destination'"
              @click.stop="handleCenterMap(item.type)"
              class="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors p-2 -mr-2"
            >
              <MapIcon />
            </button>
          </div>
        </div>
      </div>
      <!-- Footer Fahrerkontakt -->
      <div class="p-6 flex justify-between items-center text-left">
        <div class="text-sm text-gray-600">
          <p class="font-medium">Fragen zur Lieferung?</p>
        </div>
        <div class="flex gap-4">
          <a
            href="tel:..."
            class="flex items-center justify-center py-3.5 px-4 bg-orange-500 rounded-2xl shadow-lg shadow-orange-200"
          >
            <img src="/phone.png" class="w-5 h-5" />
          </a>
          <a
            href="mailto:..."
            class="flex items-center justify-center py-3.5 px-4 bg-orange-500 rounded-2xl shadow-lg shadow-orange-200"
          >
            <img src="/mail.png" class="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
