<!-- MobileLayout -->
<template>
  <div class="fixed inset-0 flex flex-col bg-gray-50">
    <!-- ========== Header ========== -->
    <header class="p-8 border-b border-gray-200">
      <h2 class="text-2xl text-center font-bold text-gray-900">xRouten</h2>
    </header>
    <!-- ========== Main ========== -->
    <main class="flex-1 overflow-y-auto pb-16"></main>
    <!-- Navigation -->
    <footer class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div class="flex justify-around py-3 text-gray-600">
        <button class="p-3 hover:bg-gray-100 rounded-lg transition">Bli</button>
        <button class="p-3 hover:bg-gray-100 rounded-lg transition">Bla</button>
        <button class="p-3 hover:bg-gray-100 rounded-lg transition">Blub</button>
        <button class="p-3 hover:bg-gray-100 rounded-lg transition">Status</button>
      </div>
    </footer>
  </div>
</template>
