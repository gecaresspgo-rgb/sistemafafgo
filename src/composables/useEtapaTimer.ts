import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useFormatters } from './useFormatters'

export function useEtapaTimer(etapas, etapaAtualRef) {
  const now = ref(Date.now())
  let interval: ReturnType<typeof setInterval> | null = null
  const { formatarSegundos } = useFormatters()

  onMounted(() => {
    interval = setInterval(() => {
      now.value = Date.now()
    }, 1000)
  })
  onUnmounted(() => {
    clearInterval(interval)
  })

  // Tempo da etapa atual
  const tempoEtapaAtual = computed(() => {
    const idx = etapaAtualRef.value
    const etapa = etapas.value[idx]
    if (!etapa || !etapa.inicio) return 0
    return Math.floor((now.value - etapa.inicio) / 1000)
  })

  // Tempo total do processo (soma das etapas já iniciadas)
  const tempoTotal = computed(() => {
    let total = 0
    for (let i = 0; i <= etapaAtualRef.value; i++) {
      const etapa = etapas.value[i]
      if (etapa && etapa.inicio) {
        if (i < etapaAtualRef.value) {
          // Etapas anteriores: diferença para a próxima etapa
          const next = etapas.value[i + 1]
          if (next && next.inicio) {
            total += Math.floor((next.inicio - etapa.inicio) / 1000)
          } else {
            total += Math.floor((now.value - etapa.inicio) / 1000)
          }
        } else {
          // Etapa atual: até agora
          total += Math.floor((now.value - etapa.inicio) / 1000)
        }
      }
    }
    return total
  })

  return { tempoEtapaAtual, tempoTotal, formatarSegundos }
}

// Calcula o tempo (em segundos) entre dois timestamps ISO ou timestamp + now
export function tempoGastoEtapa(started_at?: string, ended_at?: string) {
  if (!started_at) return 0
  const inicio = new Date(started_at).getTime()
  const fim = ended_at ? new Date(ended_at).getTime() : Date.now()
  if (isNaN(inicio) || isNaN(fim)) return 0
  return Math.max(0, Math.floor((fim - inicio) / 1000))
}

// Soma o tempo de todas as etapas concluídas (com ended_at preenchido)
export function tempoTotalProcesso(etapas: Array<{ started_at?: string; ended_at?: string }>) {
  return etapas.reduce((total, etapa) => {
    if (etapa.started_at && etapa.ended_at) {
      const inicio = new Date(etapa.started_at).getTime()
      const fim = new Date(etapa.ended_at).getTime()
      if (!isNaN(inicio) && !isNaN(fim) && fim > inicio) {
        total += Math.floor((fim - inicio) / 1000)
      }
    }
    return total
  }, 0)
}

// Função formatarSegundos foi movida para useFormatters.ts
export { formatarSegundos } from './useFormatters'
