<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-teal-700 flex flex-row">
    <Menu />
    <main class="flex-1 flex flex-col">
      <header class="w-full flex justify-end p-4 flex-shrink-0">
        <NotificationsPanel />
      </header>
      <div class="flex-1 flex flex-col items-center justify-center overflow-y-auto">
      <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import Menu from './Menu.vue'
import NotificationsPanel from './NotificationsPanel.vue'
</script>

<script lang="ts">
export default {
  name: 'AppLayout',
}
</script>
