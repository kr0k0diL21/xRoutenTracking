<!-- OrderPanel -->
<script setup lang="ts">
const isOpen = defineModel<boolean>();
</script>

<template>
  <div
    class="bg-white/60 backdrop-blur rounded-3xl shadow-2xl border border-orange-500/30 overflow-hidden max-w-sm w-full mx-auto transform transition-all duration-300 hover:shadow-3xl"
  >
    <!-- Button -->
    <button
      @click="isOpen = !isOpen"
      class="w-full px-6 py-5 text-left flex items-center gap-4 hover:bg-orange-50/50 transition-colors"
    >
      <div class="flex-1 min-w-0">
        <div
          class="text-xl font-bold text-gray-900 tracking-tight wrap-break-word"
        >
          SH-2025-00421
        </div>
        <div class="text-sm text-gray-600 mt-1 flex items-center gap-2">
          <span class="truncate">Irgendwie</span>
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
          <span class="truncate">Irgendwo</span>
        </div>
      </div>

      <div
        class="inline-flex items-center rounded-full bg-green-100 px-3.5 py-1.5 text-xs font-bold text-green-800 ring-1 ring-green-200"
      >
        <span
          class="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"
        ></span>
        Unterwegs
      </div>

      <!-- Pfeil Icon -->
      <svg
        class="w-8 h-8 text-gray-500 transition-transform duration-0 shrink-0"
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

    <!-- Aufklappbarer Inhalt -->
    <div
      class="transition-all duration-300 ease-in-out overflow-hidden"
      :class="isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'"
    >
      <!-- Route & Zeit -->
      <div class="px-6 pt-5 pb-4 space-y-4 border-t border-orange-500/10">
        <div class="grid grid-cols-2 gap-10">
          <div>
            <div class="font-semibold text-gray-900 uppercase tracking-wider">
              Start
            </div>
            <div class="text-xs mt-1 font-semibold text-gray-500 flex flex-col">
              <span> Irgendwie 123, </span>
              <span>Berlin 10231</span>
            </div>
          </div>
          <div>
            <div class="font-semibold text-gray-900 uppercase tracking-wider">
              Ziel
            </div>
            <div class="text-xs mt-1 font-semibold text-gray-500 flex flex-col">
              <span> Irgendwo 456, </span>
              <span>Hamburg 20457</span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-10">
          <div class="flex flex-col">
            <div class="font-semibold text-gray-900 uppercase tracking-wider">
              Status
            </div>
            <div class="text-xs mt-1 font-semibold text-gray-500">
              3 Stopps verbleiben
            </div>
          </div>
          <div>
            <div class="font-semibold text-gray-900 uppercase tracking-wider">
              Ankunft
            </div>
            <div class="mt-1 text-xs font-bold text-orange-600">14:45 Uhr</div>
          </div>
        </div>
      </div>
      <!-- Kontakt + Button -->
      <div
        class="px-6 py-6 flex justify-between items-center border-t border-orange-500/10"
      >
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
