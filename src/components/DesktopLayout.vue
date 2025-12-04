<!-- DesktopLayout -->
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

    <!-- Panel links oben -->
    <aside class="fixed top-40 left-4 w-96 z-40">
      <OrderPanel v-model="isOpen" />
    </aside>
  </main>
</template>
