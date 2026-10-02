<!-- src/components/OrderPanel.vue -->
<script setup lang="ts">
import { computed, ref } from 'vue';
import MapIcon from '@/assets/icons/MapIcon.vue';
import ReloadButton from '@/assets/icons/ReloadButton.vue';
import ChevronUpDown from '@/assets/icons/ChevronUpDown.vue';
import { statusConfig, getStatusConfig } from '@/utils/orderPanelUtils';
import type { xRoutenTrackingData } from '@/types/trackingDataTypes';
import { useMapboxData } from '@/composables/useMapboxData';

const { flyToLocation } = useMapboxData();
const isOpen = defineModel<boolean>({ default: false });
const props = defineProps<{
  trackingData: xRoutenTrackingData | null;
  isMobile: boolean;
}>();
const isVisualLoading = ref(false);

// State für Copy-Feedback
const copiedField = ref<'phone' | 'email' | null>(null);

async function copyToClipboard(
  text: string | null | undefined,
  field: 'phone' | 'email'
) {
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    copiedField.value = field;
    setTimeout(() => {
      copiedField.value = null;
    }, 2000);
  } catch (err) {
    console.error('Fehler beim Kopieren:', err);
  }
}

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
    if (!props.trackingData.start) return;
    flyToLocation(props.trackingData.start.coordinates);
  } else if (type === 'destination') {
    const end = props.trackingData.end.coordinates;
    flyToLocation(end);
  }
}

const emit = defineEmits(['refresh']);

// Manuelle Aktualisierungsfunktion
function manuelRefresh() {
  if (isVisualLoading.value) return;
  isVisualLoading.value = true;
  if (props.trackingData?.status === 'pending') {
    emit('refresh');
  } else {
    handleCenterMap('destination');
  }
  setTimeout(() => {
    isVisualLoading.value = false;
  }, 1000);
}
</script>

<template>
  <!-- Header -->
  <div
    @click="isOpen = !isOpen"
    class="w-full p-6 text-left flex justify-between items-start transition-colors cursor-pointer"
    :class="isMobile ? '' : 'hover:bg-orange-50/50'"
  >
    <div>
      <p class="mt-2 text-2xl font-black text-gray-900 leading-none">
        Status
      </p>
    </div>

    <div class="flex flex-col items-end gap-1.5">
      <button
        class="inline-flex items-center rounded-lg px-3.5 py-1.5 text-xm font-bold ring-1 transition-all"
        :class="currentStatus.badge"
        @click.stop="manuelRefresh()"
      >
        <ReloadButton
          v-if="props.trackingData?.status === 'pending'"
          class="w-3.5 h-3.5 mr-2"
          :class="{
            'animate-spin': isVisualLoading,
            'animate-pulse': !isVisualLoading,
          }"
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

      <p
        class="text-[8px] uppercase tracking-wider font-bold text-gray-400 mr-1"
      >
        {{
          props.trackingData
            ? `Stand: ${new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr`
            : 'Lade Daten...'
        }}
      </p>
    </div>
    <ChevronUpDown
      v-if="props.isMobile"
      :is-open="isOpen"
      class="absolute left-1/2 -translate-x-1/2 top-0 text-gray-400 pointer-events-none"
    />
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
          <!-- Timeline Items -->
          <div
            v-for="(item, index) in timelineItems"
            :key="index"
            class="relative"
            :class="{ 'mb-9': index < timelineItems.length - 1 }"
          >
            <div
              v-if="index < timelineItems.length - 1"
              class="absolute left-2.5 top-0 bottom-[-2.35rem] w-0.5 bg-gray-200"
            ></div>

            <div
              class="absolute top-1 left-2.75 flex items-center justify-center -translate-x-1/2 -translate-y-1/7 z-10"
            >
              <div
                v-if="item.type === 'driver'"
                class="w-5 h-5 rounded-full bg-orange-500 ring-4 ring-white"
              ></div>
              <div
                v-else-if="item.type === 'destination'"
                class="w-5 h-5 rounded-full ring-4"
                :class="
                  props.trackingData?.status === 'completed'
                    ? 'bg-orange-500 ring-white'
                    : 'bg-white ring-gray-300'
                "
              ></div>
              <div
                v-else
                class="w-3 h-3 rounded-full bg-orange-500 ring-4 ring-white"
              ></div>
            </div>

            <div class="ml-8 pr-10">
              <p class="text-sm font-semibold text-gray-800 leading-tight">
                {{ item.title }}
              </p>
              <p class="text-xs text-gray-500 mt-0.5">{{ item.address }}</p>
            </div>

            <button
              v-if="item.type === 'driver' || item.type === 'destination'"
              @click.stop="handleCenterMap(item.type)"
              class="absolute right-1 top-3 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors p-2 -mr-2"
            >
              <MapIcon />
            </button>
          </div>
        </div>
      </div>

<!-- Footer Fahrerkontakt (Variante 2: Elegant Border) -->
<div class="p-6 text-left border-t border-gray-100">
  <p class="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">
    Kontakt aufnehmen
  </p>

  <div class="grid grid-cols-2 gap-2">
    <!-- Telefon Action -->
    <div class="relative group flex items-center">
      <a
        :href="props.trackingData?.contactPhone ? `tel:${props.trackingData.contactPhone}` : '#'"
        class="w-full flex items-center justify-center gap-1.5 py-2.5 pl-3 pr-8 rounded-xl bg-white border border-gray-200 hover:border-orange-500/40 hover:bg-orange-50/40 text-gray-800 font-medium text-xs transition-all min-w-0 shadow-xs"
        :class="{ 'opacity-50 pointer-events-none': !props.trackingData?.contactPhone }"
      >
        <svg class="w-3.5 h-3.5 text-orange-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        <span class="truncate">
          {{ props.trackingData?.contactPhone || 'Keine Nummer' }}
        </span>
      </a>
      <button
        v-if="props.trackingData?.contactPhone"
        @click="copyToClipboard(props.trackingData?.contactPhone, 'phone')"
        class="absolute right-1 p-1.5 rounded-lg text-gray-400 hover:text-orange-600 hover:bg-orange-100/50 transition-all shrink-0"
        title="Nummer kopieren"
      >
        <svg v-if="copiedField === 'phone'" class="w-3.5 h-3.5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>
        <svg v-else class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
      </button>
    </div>

    <!-- E-Mail Action -->
    <div class="relative group flex items-center">
      <a
        :href="props.trackingData?.contactEmail ? `mailto:${props.trackingData.contactEmail}` : '#'"
        class="w-full flex items-center justify-center gap-1.5 py-2.5 pl-3 pr-8 rounded-xl bg-white border border-gray-200 hover:border-orange-500/40 hover:bg-orange-50/40 text-gray-800 font-medium text-xs transition-all min-w-0 shadow-xs"
        :class="{ 'opacity-50 pointer-events-none': !props.trackingData?.contactEmail }"
      >
        <svg class="w-3.5 h-3.5 text-orange-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
        <span class="truncate">
          {{ props.trackingData?.contactEmail || 'Keine E-Mail' }}
        </span>
      </a>
      <button
        v-if="props.trackingData?.contactEmail"
        @click="copyToClipboard(props.trackingData?.contactEmail, 'email')"
        class="absolute right-1 p-1.5 rounded-lg text-gray-400 hover:text-orange-600 hover:bg-orange-100/50 transition-all shrink-0"
        title="E-Mail kopieren"
      >
        <svg v-if="copiedField === 'email'" class="w-3.5 h-3.5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>
        <svg v-else class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
      </button>
    </div>
  </div>
</div>
    </div>
  </div>
</template>
