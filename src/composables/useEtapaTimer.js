import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useFormatters } from './useFormatters';
export function useEtapaTimer(etapas, etapaAtualRef) {
    var now = ref(Date.now());
    var interval = null;
    var formatarSegundos = useFormatters().formatarSegundos;
    onMounted(function () {
        interval = setInterval(function () {
            now.value = Date.now();
        }, 1000);
    });
    onUnmounted(function () {
        clearInterval(interval);
    });
    // Tempo da etapa atual
    var tempoEtapaAtual = computed(function () {
        var idx = etapaAtualRef.value;
        var etapa = etapas.value[idx];
        if (!etapa || !etapa.inicio)
            return 0;
        return Math.floor((now.value - etapa.inicio) / 1000);
    });
    // Tempo total do processo (soma das etapas já iniciadas)
    var tempoTotal = computed(function () {
        var total = 0;
        for (var i = 0; i <= etapaAtualRef.value; i++) {
            var etapa = etapas.value[i];
            if (etapa && etapa.inicio) {
                if (i < etapaAtualRef.value) {
                    // Etapas anteriores: diferença para a próxima etapa
                    var next = etapas.value[i + 1];
                    if (next && next.inicio) {
                        total += Math.floor((next.inicio - etapa.inicio) / 1000);
                    }
                    else {
                        total += Math.floor((now.value - etapa.inicio) / 1000);
                    }
                }
                else {
                    // Etapa atual: até agora
                    total += Math.floor((now.value - etapa.inicio) / 1000);
                }
            }
        }
        return total;
    });
    return { tempoEtapaAtual: tempoEtapaAtual, tempoTotal: tempoTotal, formatarSegundos: formatarSegundos };
}
// Calcula o tempo (em segundos) entre dois timestamps ISO ou timestamp + now
export function tempoGastoEtapa(started_at, ended_at) {
    if (!started_at)
        return 0;
    var inicio = new Date(started_at).getTime();
    var fim = ended_at ? new Date(ended_at).getTime() : Date.now();
    if (isNaN(inicio) || isNaN(fim))
        return 0;
    return Math.max(0, Math.floor((fim - inicio) / 1000));
}
// Soma o tempo de todas as etapas concluídas (com ended_at preenchido)
export function tempoTotalProcesso(etapas) {
    return etapas.reduce(function (total, etapa) {
        if (etapa.started_at && etapa.ended_at) {
            var inicio = new Date(etapa.started_at).getTime();
            var fim = new Date(etapa.ended_at).getTime();
            if (!isNaN(inicio) && !isNaN(fim) && fim > inicio) {
                total += Math.floor((fim - inicio) / 1000);
            }
        }
        return total;
    }, 0);
}
// Função formatarSegundos foi movida para useFormatters.ts
export { formatarSegundos } from './useFormatters';
