<!-- OrderPanel -->
<script setup lang="ts">
const isOpen = defineModel<boolean>({ default: false });
</script>

<template>
  <div
    class="bg-white rounded-3xl shadow-xl border border-orange-500 overflow-hidden"
  >
    <!-- Button -->
    <button
      @click="isOpen = !isOpen"
      class="w-full px-6 py-5 text-left hover:bg-gray-100 transition flex items-center justify-between"
    >
      <div class="flex-1">
        <div class="text-lg font-semibold text-gray-900">SH-2025-00421</div>
        <div class="text-sm text-gray-600 mt-1">xxx → xxx</div>
      </div>

      <div class="text-right mr-4">
        <span class="text-sm font-medium text-gray-600">Status:</span><br />
        <span class="text-green-600 font-bold">In Transit</span>
      </div>
      <!-- Pfeil Icon -->
      <svg
        class="w-6 h-6 text-gray-500 transition-transform duration-0 shrink-0"
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
      <div
        class="px-6 pt-5 pb-6 text-sm text-gray-600 space-y-3 border-t border-orange-500"
      >
        <p><span class="font-medium">Start:</span> xxx</p>
        <p><span class="font-medium">Ziel:</span> xxx</p>
        <p><span class="font-medium">Zwischenhalte:</span> xxx → xxx</p>
        <p><span class="font-medium">Fahrer:</span> xxx</p>
        <p><span class="font-medium">Geplante Ankunft:</span> xxx</p>
        <p>
          <span class="font-medium">Verspätung:</span>
          <span class="font-medium"> xxx</span>
        </p>
      </div>
      <!-- Kontakt + Button -->
      <div
        class="px-6 py-6 flex justify-between items-center border-t border-orange-500"
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
