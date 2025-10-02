import { ref } from 'vue';
// Filtro global para Força Responsável
var filtroForcaId = ref(null);
function setFiltroForca(id) {
    filtroForcaId.value = id;
}
function limparFiltros() {
    filtroForcaId.value = null;
}
export function useDashboardFilters() {
    return {
        filtroForcaId: filtroForcaId,
        setFiltroForca: setFiltroForca,
        limparFiltros: limparFiltros,
    };
}
