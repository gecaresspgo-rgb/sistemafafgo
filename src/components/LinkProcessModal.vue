<template>
  <div v-if="show" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" @click="fecharModal">
    <div class="bg-slate-900 border border-slate-700 rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col overflow-hidden" @click.stop>
      <div class="flex items-center justify-between p-6 border-b border-slate-700 flex-shrink-0">
        <h2 class="text-xl font-bold text-white">Vincular Processo Existente</h2>
        <button @click="fecharModal" class="text-slate-400 hover:text-white transition">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <div class="p-6 flex-shrink-0">
        <label class="block text-sm font-medium text-slate-300 mb-2">Filtrar Processo</label>
        <input v-model="searchTerm" type="text" placeholder="Digite para filtrar por nome ou número SEI..." class="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"/>
      </div>

      <div class="px-6 pb-6 flex-1 overflow-y-auto">
        <div v-if="loading" class="flex justify-center py-8"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400"></div></div>
        <div v-else-if="todosProcessos.length === 0" class="text-center py-8 text-slate-400">Não há processos disponíveis para vincular.</div>
        <div v-else>
          <div v-if="processosFiltrados.length === 0" class="text-center py-8 text-slate-400">Nenhum processo encontrado para "{{ searchTerm }}"</div>
          <div v-else class="space-y-3">
            <div v-for="processo in processosFiltrados" :key="processo.id" class="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:bg-slate-700 transition-colors cursor-pointer" @click="vincularProcesso(processo)">
              <div class="flex items-center justify-between">
                <div class="flex-1">
                   <h3 class="font-semibold text-white mb-1">
                  <span class="font-mono text-teal-400">{{ processo.codigo_transferegov || 'Sem SEI' }}</span> - {{ processo.nome_acao }}
                </h3>

                <div class="flex items-center gap-4 text-xs text-slate-500">
                  <span>Criado em: {{ formatarData(processo.created_at) }}</span>
                  <span :class="{ 'text-green-400': processo.status === 'Concluído', 'text-yellow-400': processo.status === 'Em Andamento', 'text-slate-400': processo.status === 'Não Iniciado' }">
                    {{ processo.status }}
                  </span>
                </div>
              </div>
              <div class="ml-4">
                <button class="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white text-sm rounded transition">
                  Vincular
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="mensagem" class="px-6 pb-6 flex-shrink-0">
        <div :class="{'bg-green-600/20 text-green-300 border-green-600/30': tipoMensagem === 'sucesso', 'bg-red-600/20 text-red-300 border-red-600/30': tipoMensagem === 'erro'}" class="border rounded-lg p-3 text-sm">{{ mensagem }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { supabase } from '../services/supabase';

// ✨ CORREÇÃO: Adicionada a prop 'show'
interface Props {
  show: boolean;
  actionId: string;
}
const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  processLinked: [];
}>();

// ✨ CORREÇÃO: Adicionada a função 'fecharModal'
function fecharModal() {
  emit('close');
}

// Interfaces
interface ProcessoNaoVinculado {
  id: string;
  nome_acao: string;
  codigo_transferegov: string;
  description: string;
  created_at: string;
  status: string;
}

// Estado
const searchTerm = ref('');
const todosProcessos = ref<ProcessoNaoVinculado[]>([]);
const loading = ref(false);
const mensagem = ref('');
const tipoMensagem = ref<'sucesso' | 'erro'>('sucesso');

const processosFiltrados = computed(() => {
  if (!searchTerm.value.trim()) {
    return todosProcessos.value;
  }
  const termo = searchTerm.value.toLowerCase().trim();
  return todosProcessos.value.filter(p =>
    p.nome_acao.toLowerCase().includes(termo) ||
    (p.codigo_transferegov && p.codigo_transferegov.toLowerCase().includes(termo))
  );
});

// Funções
async function carregarProcessosNaoVinculados() {
  loading.value = true;
  try {
    const { data, error } = await supabase
      .rpc('search_unlinked_processes', { p_search_term: null });
    if (error) throw error;
    todosProcessos.value = data || [];
  } catch (error) {
    console.error('Erro ao buscar processos:', error);
    mostrarMensagem('Erro ao carregar a lista de processos.', 'erro');
  } finally {
    loading.value = false;
  }
}

const vincularProcesso = async (processo: ProcessoNaoVinculado) => {
  loading.value = true;
  try {
    const { data, error } = await supabase
      .rpc('link_process_to_action', {
        p_process_id: processo.id,
        p_action_id: props.actionId
      });

    if (error) throw error;

    if (data) {
      mostrarMensagem(`Processo "${processo.nome_acao}" vinculado com sucesso!`, 'sucesso');
      // ✨ CORREÇÃO: Modificando a lista original 'todosProcessos'
      todosProcessos.value = todosProcessos.value.filter(p => p.id !== processo.id);

      setTimeout(() => {
        emit('processLinked');
      }, 1500);
    } else {
      mostrarMensagem('Não foi possível vincular o processo', 'erro');
    }
  } catch (error) {
    console.error('Erro ao vincular processo:', error);
    mostrarMensagem('Erro ao vincular processo', 'erro');
  } finally {
    loading.value = false;
  }
};

const mostrarMensagem = (texto: string, tipo: 'sucesso' | 'erro') => {
  mensagem.value = texto;
  tipoMensagem.value = tipo;
  setTimeout(() => {
    mensagem.value = '';
  }, 3000);
};

const formatarData = (data: string) => {
  return new Date(data).toLocaleDateString('pt-BR');
};

onMounted(() => {
  carregarProcessosNaoVinculados();
});
</script>
