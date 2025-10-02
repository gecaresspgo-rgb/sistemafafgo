import { ref } from 'vue'

// Filtro global para Força Responsável
const filtroForcaId = ref<number | null>(null)

function setFiltroForca(id: number) {
  filtroForcaId.value = id
}

function limparFiltros() {
  filtroForcaId.value = null
}

export function useDashboardFilters() {
  return {
    filtroForcaId,
    setFiltroForca,
    limparFiltros,
  }
}
