<script setup lang="ts">
defineProps<{
  isOpen: boolean;
}>();
</script>

<template>
  <svg
    class="w-8 h-8 text-gray-500 transition-transform duration-0 shrink-0 mb-5"
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
</template>
