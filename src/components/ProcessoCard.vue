<script setup lang="ts">
import { ref, defineProps, defineEmits, watch, computed } from 'vue'
// As importações desnecessárias (onMounted, reactive, etc.) e as de bibliotecas
// que foram movidas (Tribute, jsPDF, etc.) foram removidas.
import {registrarEventoHistorico } from '../services/auth'
import { supabase } from '../services/supabase'
import { useAuth } from '../composables/useAuth'
import { useFormatters } from '../composables/useFormatters'

const { user, fetchUser } = useAuth()

// Importar funções de formatação do composable
const { formatarValor, formatarData } = useFormatters()

// Definir eventos que este componente pode emitir
const emit = defineEmits(['abrir-detalhes', 'mostrar-etapas', 'atualizar-processo'])

const props = defineProps({
  processo: {
    type: Object,
    required: true,
  },
})

// Lógica para favoritar, que pertence ao card
const isFavorited = ref(props.processo.is_favorited)
watch(() => props.processo.is_favorited, (val) => { isFavorited.value = val })

// Funções de ação do card
function abrirEtapas(e: Event) {
  e.stopPropagation()
  // Emitir evento para o componente pai (ProcessosView.vue) abrir o modal de etapas
  emit('mostrar-etapas', props.processo)
}

const valorTotalDestinadoCalculado = computed(() => {
  const inicial = Number(props.processo.valor_inicial_padrao) || 0;
  const rendimentos = Number(props.processo.valor_rendimentos) || 0;
  const economicidade = Number(props.processo.valor_economicidade) || 0;
  return inicial + rendimentos + economicidade;
});

// Em ProcessoCard.vue -> <script setup>

async function passarEtapa(e: Event) {
  e.stopPropagation();
  if (!props.processo.id) return;

  // 1. ✨ MUDANÇA PRINCIPAL: Chama a nova função RPC 'avancar_etapa_e_recalcular'
  //    que já tem as permissões corretas (SECURITY DEFINER) e faz o recálculo.
  const { error } = await supabase.rpc('avancar_etapa_e_recalcular', { 
    p_processo_id: props.processo.id 
  });

  if (!error) {
    // 2. Registra o evento no histórico.
    const isFinalStep = props.processo.etapaAtual === props.processo.totalEtapas - 1 && props.processo.totalEtapas > 0;
    const nomeEtapa = isFinalStep ? 'Processo Concluído.' : `Etapa avançada.`;
    await registrarEventoHistorico(props.processo.id, nomeEtapa);

    // 3. Apenas notifica a tela principal para buscar os dados 100% atualizados do banco.
    emit('atualizar-processo');
    
  } else {
    console.error("Erro ao avançar a etapa:", error);
    alert("Ocorreu um erro ao avançar a etapa: " + error.message);
  }
}

async function toggleFavorite() {
  let usuario = user.value
  if (!usuario) usuario = await fetchUser()
  if (!usuario) return
  if (isFavorited.value) {
    // Desfavoritar
    await supabase.from('user_favorites').delete().match({ user_id: usuario.id, process_id: props.processo.id })
    isFavorited.value = false
  } else {
    // Favoritar
    await supabase.from('user_favorites').insert({ user_id: usuario.id, process_id: props.processo.id })
    isFavorited.value = true
  }
  // Criar um objeto com as atualizações em vez de emitir apenas o evento
  const processoAtualizado = {
    ...props.processo,
    is_favorited: isFavorited.value
  }
  emit('atualizar-processo', processoAtualizado)
}

// Todas as outras variáveis e funções (edição, documentos, comentários, PDF) foram removidas
// pois sua lógica foi movida para os modais correspondentes.
</script>

<template>
  <div class="processo-card" :data-processo-id="processo.id">
    <div
      class="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-xl p-6 mb-6 hover:bg-white/15 hover:scale-105 transition-all relative w-full h-full min-h-[350px]"
    >
      <div class="flex items-center justify-center mb-2">
        <svg class="w-5 h-5 mr-2 text-cyan-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2"/></svg>
        <span class="text-sm text-slate-200 font-semibold text-center">
          {{ processo.etapaAtualNome ? `Etapa Atual: ${processo.etapaAtualNome}` : 'Etapa Atual: Não definida' }}
        </span>
      </div>
      <div class="w-full h-2 bg-white/10 rounded mb-3 overflow-hidden">
        <div
          class="h-2 rounded bg-gradient-to-r from-teal-400 to-cyan-300 transition-all"
          :style="{ width: processo.progresso + '%' }"
        ></div>
      </div>
      <div class="flex items-center justify-between mb-2">
        <span :class="[
          'text-xs font-bold px-3 py-1 rounded-full',
          processo.status === 'Em Andamento'
            ? 'bg-gradient-to-r from-teal-600 to-cyan-500 text-white':
            (processo.status === 'Concluído'
              ?'bg-gradient-to-r from-green-600 to-emerald-500 text-white'
              : 'bg-gradient-to-r from-red-600 to-rose-500 text-white')
            
        ]">
          {{ processo.status }}
        </span>
        <button @click.stop="toggleFavorite" :aria-label="isFavorited ? 'Desfavoritar' : 'Favoritar'">
          <svg v-if="isFavorited" xmlns="http://www.w3.org/2000/svg" class="text-red-400 w-6 h-6" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="text-slate-400 hover:text-red-400 cursor-pointer transition-colors w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </button>
      </div>
      <h2 class="text-xl font-bold text-white mb-1">
        {{ processo.nome_acao || 'Processo sem nome' }}
      </h2>
      <p class="text-slate-300 mb-2">{{ processo.descricao_geral || 'Sem descrição' }}</p>
      <div class="flex items-center gap-2 text-sm text-slate-400 mb-2">
        <svg class="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
        {{ processo.forca_code || 'Não definido' }}
      </div>
      <div class="text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent mb-2">
  {{ formatarValor(valorTotalDestinadoCalculado) }}
</div>
      <div class="flex flex-wrap gap-2 mb-2">
        <span class="border border-teal-400/50 text-teal-300 bg-teal-500/10 text-xs px-2 py-1 rounded">
          {{ processo.tipo_natureza_despesa || 'Não definido' }}
        </span>
      </div>
      <div class="flex items-center justify-between text-xs text-slate-400 mt-4 border-t border-white/10 pt-2">
        <span>Criado em {{ formatarData(processo.data_encaminhamento_aprovacao || processo.created_at) }}</span>
        <span>Ano FAF: {{ processo.ano_faf || 'Não definido' }}</span>
      </div>
      <div class="flex gap-2 mt-4">
        <button
          v-if="processo.status !== 'Concluído'"
          class="px-3 py-1 bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-700 hover:to-cyan-600 text-white rounded font-semibold shadow flex-1"
          @click.stop="passarEtapa($event)"
        >
          {{ (processo.etapaAtual === processo.totalEtapas - 1 && processo.totalEtapas > 0) ? 'Concluir Processo' : 'Passar Etapa' }}
        </button>
        <button
          class="px-3 py-1 border border-white/20 text-slate-300 hover:bg-white/10 bg-transparent rounded font-semibold shadow flex-1"
          @click.stop="abrirEtapas"
        >
          Ver Etapas
        </button>
        <button
          class="px-3 py-1 border border-white/20 text-slate-300 hover:bg-white/10 bg-transparent rounded font-semibold shadow flex-1"
          @click.stop="$event => emit('abrir-detalhes', processo)"
        >
          Ver Detalhes
        </button>
      </div>
    </div>
    </div>
</template>
