<!-- OrderPanel -->
<script setup lang="ts">
import MapIcon from '@/assets/icons/MapIcon.vue';
import ChevronRight from '@/assets/icons/ChevronRight.vue';
import ChevronUpDown from '@/assets/icons/ChevronUpDown.vue';
import { useTrackingData } from '@/composables/useTrackingData';

const isOpen = defineModel<boolean>({ default: false });
const isMobile = window.innerWidth < 768;
const { driverData, timelineItems, handleCenterMap } = useTrackingData();
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
        <template v-if="!driverData.isDelivered">
          <span class="truncate">{{ driverData.driver.address }}</span>
          <ChevronRight />
        </template>
        <span class="truncate">{{ driverData.destination.address }}</span>
      </div>
    </div>

    <div
      class="inline-flex items-center rounded-full mb-5 px-3.5 py-1.5 text-xs font-bold ring-1"
      :class="
        driverData.isDelivered
          ? 'bg-green-100 text-green-800 ring-green-200'
          : 'bg-blue-100 text-blue-800 ring-blue-200'
      "
    >
      <span
        class="w-2 h-2 rounded-full mr-2 animate-pulse"
        :class="driverData.isDelivered ? 'bg-green-500' : ' bg-blue-500'"
      ></span>
      {{ driverData.isDelivered ? 'Erledigt' : 'Unterwegs' }}
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
                  driverData.isDelivered
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
                :class="
                  driverData.isDelivered ? 'text-green-800' : 'text-blue-800'
                "
              >
                {{ item.status + item.eta }}
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
          <p>
            <span class="font-medium">Fragen?</span>
          </p>
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
