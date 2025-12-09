<!-- MobileLayout -->
<script setup lang="ts">
import OrderPanel from '@/components/OrderPanel.vue';
import MapBox from '@/components/MapBox.vue';
import { ref } from 'vue';

const isOpen = ref(false);
</script>

<template>
  <main class="fixed inset-0 bg-gray-200 flex flex-col">
    <!-- Karte -->
    <MapBox />

    <!-- Header -->
    <header
      class="fixed left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 select-none"
    >
      <div class="flex items-center justify-center gap-3 py-4 px-6">
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

    <!-- Panel unten -->
    <aside
      class="fixed bottom-0 left-1/2 -translate-x-1/2 z-40 bg-white/70 backdrop-blur rounded-3xl shadow-2xl border border-orange-500/30 overflow-hidden max-w-sm w-full transform transition-all duration-300 hover:shadow-3xl"
    >
      <OrderPanel v-model="isOpen" />
    </aside>
  </main>
</template>
