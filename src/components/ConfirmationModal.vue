<template>
  <div v-if="show" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" @click="$emit('cancel')">
    <div class="bg-slate-800 border border-slate-700 rounded-lg shadow-xl w-full max-w-md mx-4 p-8" @click.stop>
      <h3 class="text-xl font-bold text-white mb-4">{{ title }}</h3>
      <p class="text-slate-300 mb-7">{{ message }}</p>
      <div class="flex justify-end gap-4">
        <button
          @click="$emit('cancel')"
          class="px-6 py-2 border border-slate-600 text-slate-300 rounded-lg font-semibold hover:bg-slate-700 transition"
        >
          Cancelar
        </button>
        <button
          @click="$emit('confirm')"
          class="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
        >
          Confirmar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

defineProps<{
  show: boolean;
  title: string;
  message: string;
}>();

defineEmits<{
  confirm: [];
  cancel: [];
}>();

</script>
