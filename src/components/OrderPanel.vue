<!-- OrderPanel -->
<script setup lang="ts">
import { computed } from 'vue';
import MapIcon from '@/assets/icons/MapIcon.vue';
import ReloadButton from '@/assets/icons/ReloadButton.vue';
import ChevronRight from '@/assets/icons/ChevronRight.vue';
import { useTrackingData } from '@/composables/useTrackingData';

const isOpen = defineModel<boolean>({ default: false });
const isMobile = window.innerWidth < 768;
const {
  driverData,
  timelineItems,
  isLoading,
  handleCenterMap,
  fetchXroutenStatus,
} = useTrackingData();

const manualRefresh = async () => {
  if (isLoading.value || driverData.value.status !== 'pending') return;
  await fetchXroutenStatus();
};

const statusConfig = {
  pending: {
    label: 'Unterwegs',
    badge:
      'bg-blue-100 text-blue-800 ring-blue-200 hover:bg-blue-200 cursor-pointer',
    dot: 'bg-blue-500',
    text: 'text-blue-800',
  },
  completed: {
    label: 'Erledigt',
    badge: 'bg-green-100 text-green-800 ring-green-200 cursor-default',
    dot: 'bg-green-500',
    text: 'text-green-800',
  },
  failed: {
    label: 'Fehlgeschlagen',
    badge: 'bg-red-100 text-red-800 ring-red-200 cursor-default',
    dot: 'bg-red-500',
    text: 'text-red-800',
  },
  unknown: {
    label: 'Unbekannt',
    badge: 'bg-gray-100 text-gray-800 ring-gray-200 cursor-default',
    dot: 'bg-gray-500',
    text: 'text-gray-800',
  },
};
const currentStatus = computed(() => {
  const s = driverData.value.status as keyof typeof statusConfig;
  return statusConfig[s] || statusConfig.unknown;
});
</script>

<template>
  <!-- Header -->
  <button
    @click="isOpen = !isOpen"
    class="w-full p-6 text-left flex items-center gap-4 transition-colors"
    :class="isMobile ? '' : 'hover:bg-orange-50/50'"
  >
    <div class="flex-1 min-w-0">
      <div
        class="text-xl font-bold text-gray-900 tracking-tight wrap-break-word"
      >
        {{ driverData.orderId }}
      </div>
      <div class="text-sm text-gray-600 mt-1 flex items-center gap-2">
        <template v-if="driverData.status === 'pending'">
          <span class="truncate">{{ driverData.driver.address }}</span>
          <ChevronRight />
        </template>
        <span class="truncate">{{ driverData.destination.address }}</span>
      </div>
    </div>

    <div
      class="inline-flex items-center rounded-full mb-5 px-3.5 py-1.5 text-xs font-bold ring-1 transition-all"
      :class="currentStatus.badge"
      @click.stop="manualRefresh"
    >
      <ReloadButton
        v-if="driverData.status === 'pending'"
        class="w-3.5 h-3.5 mr-2"
        :class="{
          'animate-spin': isLoading,
          'animate-pulse': !isLoading,
        }"
      />
      <span
        v-else
        class="w-2 h-2 rounded-full mr-2"
        :class="[
          currentStatus.dot,
          { 'animate-pulse': driverData.status === 'completed' },
        ]"
      ></span>
      {{ currentStatus.label }}
    </div>
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
                  driverData.status === 'completed'
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
              <p class="text-xs text-gray-500">{{ item.subtitle }}</p>
              <p
                v-if="item.eta"
                class="text-xs font-semibold mt-1"
                :class="currentStatus.text"
              >
                {{ item.status }}
                <template
                  v-if="
                    driverData.status === 'pending' ||
                    driverData.status === 'completed'
                  "
                >
                  {{ item.eta }}
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
      <div class="m-7 flex justify-between items-center text-left">
        <div class="text-sm text-gray-600">
          <p class="font-medium">Fragen zur Lieferung?</p>
          <p class="text-xs text-gray-400">Unser Support ist für Sie da.</p>
        </div>
        <button
          class="bg-orange-500 text-white px-5 py-2 rounded-lg hover:bg-orange-600 transition text-sm font-medium shadow-sm active:scale-95"
        >
          Kontaktieren
        </button>
      </div>
    </div>
  </div>
</template>
