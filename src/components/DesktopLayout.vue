<!-- DesktopLayout.vue -->
<script setup lang="ts">
import { ref } from 'vue'
const isOpen = ref(false)
</script>

<template>
  <div class="flex h-screen bg-gray-50">
    <!-- ========== Sidebar ========== -->
    <aside class="shadow-xl w-96 flex flex-col bg-white border border-gray-200 rounded-2xl m-4">
      <!-- Header bleibt immer oben -->
      <header class="p-8 border-b border-gray-200 rounded-t-2xl shrink-0">
        <h2 class="text-2xl text-center font-bold text-gray-900">xRouten</h2>
      </header>

      <!-- Scrollbare Liste der Aufträge -->
      <div class="flex-1 overflow-y-auto px-6 pt-4">
        <!-- Eine Auftragskarte -->
        <div
          class="w-full bg-white shadow-xl border border-orange-500 rounded-2xl overflow-hidden mb-6"
        >
          <!-- Button – Titel links, Status mittig, Pfeil rechts -->
          <button
            @click="isOpen = !isOpen"
            class="w-full px-6 py-5 text-left hover:bg-gray-50 transition flex items-center justify-between"
          >
            <div class="flex-1">
              <div class="text-lg font-semibold text-gray-900">SH-2025-00421</div>
              <div class="text-sm text-gray-600 mt-1">xxx → xxx</div>
            </div>

            <div class="text-right mr-4">
              <span class="text-sm font-medium text-gray-600">Status:</span><br />
              <span class="text-green-600 font-bold">In Transit</span>
            </div>

            <svg
              class="w-6 h-6 text-gray-500 transition-transform duration-33 shrink-0"
              :class="{ 'rotate-180': !isOpen }"
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
            class="overflow-hidden transition-all duration-300 ease-in-out"
            :style="
              isOpen
                ? { 'max-height': '800px', opacity: '1' }
                : { 'max-height': '0px', opacity: '0' }
            "
          >
            <div
              class="border-t-2 border-orange-500 px-6 pt-5 pb-6 text-sm text-gray-600 space-y-3"
            >
              <div><span class="font-medium">Start:</span> xxx</div>
              <div><span class="font-medium">Ziel:</span> xxx</div>
              <div><span class="font-medium">Zwischenhalte:</span> xxx → xxx → xxx</div>
              <div><span class="font-medium">Fahrer:</span> xxx</div>
              <div><span class="font-medium">Geplante Ankunft:</span> xxx</div>
              <div>
                <span class="font-medium">Verspätung:</span>
                <span class="font-medium"> xxx</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <!-- ========== Hauptbereich rechts ========== -->
    <main class="flex-1 overflow-y-auto bg-white m-4 rounded-2xl shadow-xl p-8">
      <!-- Platzhalter für die Karte -->
      <div
        class="w-full h-full bg-gray-200 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center text-gray-500"
      >
        Kartenansicht hier
      </div>
    </main>
  </div>
</template>
