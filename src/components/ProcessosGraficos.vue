<template>
  <div class="w-full max-w-3xl mx-auto flex flex-col md:flex-row gap-6 mb-8">

  <div class="flex-1 bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-lg p-4 flex flex-col items-center justify-center text-center">
    <div class="flex items-center justify-center mb-4 relative">
      <div class="w-16 h-16 rounded-full border-2 border-green-400/30 flex items-center justify-center bg-gradient-to-r from-green-500/20 to-emerald-500/20">
        <svg class="w-10 h-10 text-green-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <div class="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border border-white/20">
          <span class="text-white font-bold text-xs">✓</span>
        </div>
      </div>
    </div>
    <h3 class="text-green-400 font-semibold text-base mb-1">Processos Concluídos</h3>
    <div class="text-2xl font-bold text-green-400 mb-1">{{ concluidos }}</div>
    <p class="text-slate-300 text-xs">de {{ total }} processos</p>
  </div>

  <div class="flex-1 bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-lg p-4 flex flex-col items-center justify-center text-center">
    <div class="flex items-center justify-center mb-4 relative">
      <div class="w-16 h-16 rounded-full border-2 border-yellow-400/30 flex items-center justify-center bg-gradient-to-r from-yellow-500/20 to-orange-500/20">
        <svg class="w-10 h-10 text-yellow-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3" />
        </svg>
        <div class="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center border border-white/20">
          <span class="text-white font-bold text-xs">{{ abertos }}</span>
        </div>
      </div>
    </div>
    <h3 class="text-yellow-400 font-semibold text-base mb-1">Processos em Aberto</h3>
    <div class="text-2xl font-bold text-yellow-400 mb-1">{{ abertos }}</div>
    <p class="text-slate-300 text-xs">de {{ total }} processos</p>
  </div>

  <div class="flex-1 bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-lg p-4 flex flex-col items-center justify-center text-center">
    <div class="flex items-center justify-center mb-4 relative">
      <div class="w-16 h-16 rounded-full border-2 border-red-400/30 flex items-center justify-center bg-gradient-to-r from-red-500/20 to-rose-500/20">
        <svg class="w-10 h-10 text-red-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        <div class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center border border-white/20">
          <span class="text-white font-bold text-xs">{{ cancelados }}</span>
        </div>
      </div>
    </div>
    <h3 class="text-red-400 font-semibold text-base mb-1">Processos Cancelados</h3>
    <div class="text-2xl font-bold text-red-400 mb-1">{{ cancelados }}</div>
    <p class="text-slate-300 text-xs">de {{ total }} processos</p>
  </div>

</div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'
const props = defineProps<{ processos: Array<{ status: string }> }>()
const total = computed(() => props.processos.length)
const concluidos = computed(() => props.processos.filter((p) => p.status === 'Concluído').length)
const cancelados = computed(() => props.processos.filter((p) => p.status === 'Cancelado').length) // ✨ NOVO: Conta processos Cancelados
const abertos = computed(() => props.processos.filter((p) => p.status === 'Em Andamento').length) // ✨ CORRIGIDO: Agora conta apenas 'Em Andamento'
// concluidoPercent e abertoPercent removidos pois não são mais usados
</script>

<style scoped>
svg {
  display: block;
}
</style>
