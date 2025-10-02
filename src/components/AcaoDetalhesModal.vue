<template>
  <div v-if="show" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div class="bg-slate-900 border border-slate-700 rounded-lg shadow-xl w-full max-w-6xl mx-4 max-h-[90vh] flex flex-col overflow-hidden" @click.stop>
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-slate-700 flex-shrink-0">
        <div>
          <h2 class="text-xl font-bold text-white">{{ acao.action_code }} - {{ acao.name }}</h2>
          <p class="text-sm text-slate-400 mt-1">Ano: {{ acao.year }} | Natureza: {{ acao.expense_nature }}</p>
        </div>
        <button @click="fecharModal" class="text-slate-400 hover:text-white transition">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Tabs Navigation -->
      <div class="flex border-b border-slate-700 bg-slate-800/50 flex-shrink-0">
        <button
          @click="abaAtiva = 'processos'"
          :class="[
            'px-6 py-3 font-medium transition-colors border-b-2',
            abaAtiva === 'processos'
              ? 'text-teal-400 border-teal-400 bg-slate-800'
              : 'text-slate-400 border-transparent hover:text-white hover:bg-slate-700'
          ]"
        >
          Processos Vinculados ({{ processosVinculados.length }})
        </button>
        <button
          @click="abaAtiva = 'registros'"
          :class="[
            'px-6 py-3 font-medium transition-colors border-b-2',
            abaAtiva === 'registros'
              ? 'text-teal-400 border-teal-400 bg-slate-800'
              : 'text-slate-400 border-transparent hover:text-white hover:bg-slate-700'
          ]"
        >
          Registros de Gastos ({{ registrosGastos.length }})
        </button>
      </div>

      <!-- Tab Content -->
      <div class="flex-1 overflow-y-auto p-6">
        <!-- Aba Processos Vinculados -->
        <div v-if="abaAtiva === 'processos'" class="space-y-4">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-white">Processos Vinculados</h3>
            <button
              @click="abrirLinkProcessModal"
              class="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Vincular Processo
            </button>
          </div>

          <div v-if="loadingProcessos" class="flex justify-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400"></div>
          </div>

          <div v-else-if="processosVinculados.length === 0" class="text-center py-8 text-slate-400">
            Nenhum processo vinculado a esta ação.
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="processo in processosVinculados"
              :key="processo.id"
              class="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:bg-slate-700 transition-colors"
            >
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <h4 class="font-semibold text-white mb-1">
                    <span class="font-mono text-teal-400">{{ processo.codigo_transferegov || 'Sem SEI' }}</span> - {{ processo.name }}
                  </h4>
                  <div class="flex items-center gap-4 text-xs text-slate-400">
                    <span>Valor: {{ formatarMoeda(processo.valor_total_destinado || 0) }}</span>
                    <span>Status: {{ processo.status }}</span>
                    <span>Criado em: {{ formatarData(processo.created_at) }}</span>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <button
                    @click="visualizarProcesso(processo)"
                    class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition"
                  >
                    Ver
                  </button>
                  <button
                    @click="abrirModalConfirmacaoDesnviular(processo)"
                    class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition"
                  >
                    Desvincular
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Aba Registros de Gastos -->
        <div v-if="abaAtiva === 'registros'" class="space-y-4">
          <h3 class="text-lg font-semibold text-white">Registros de Gastos Consolidados</h3>

          <div v-if="loadingRegistros" class="flex justify-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400"></div>
          </div>

          <div v-else-if="registrosGastos.length === 0" class="text-center py-8 text-slate-400">
            Nenhum registro de gasto encontrado para os processos desta ação.
          </div>

          <div v-else class="space-y-3">
            <!-- Resumo dos gastos -->
            <div class="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-6">
              <h4 class="font-semibold text-white mb-2">Resumo Financeiro</h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span class="text-slate-400">Total Gasto:</span>
                  <p class="text-lg font-bold text-red-400">{{ formatarMoeda(totalGastos) }}</p>
                </div>
                <div>
                  <span class="text-slate-400">Valor Total Destinado:</span>
                  <p class="text-lg font-bold text-green-400">{{ formatarMoeda(totalDestinado) }}</p>
                </div>
                <div>
                  <span class="text-slate-400">Saldo Restante:</span>
                  <p class="text-lg font-bold" :class="saldoRestante >= 0 ? 'text-green-400' : 'text-red-400'">
                    {{ formatarMoeda(saldoRestante) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Lista de registros -->
            <div
              v-for="registro in registrosGastos"
              :key="registro.id"
              class="bg-slate-800 border border-slate-700 rounded-lg p-4"
            >
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <h4 class="font-semibold text-white mb-1">{{ registro.description || 'Sem descrição' }}</h4>
                  <div class="flex items-center gap-4 text-xs text-slate-400">
                    <span>Processo: {{ registro.process_sei }}</span>
                    <span v-if="registro.request_date">Solicitado em: {{ formatarData(registro.request_date) }}</span>
                    <span v-if="registro.acquisition_date">Adquirido em: {{ formatarData(registro.acquisition_date) }}</span>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-lg font-bold text-red-400">{{ formatarMoeda(registro.amount_used) }}</p>
                  <div v-if="registro.file_url" class="mt-1">
                    <a
                      :href="registro.file_url"
                      target="_blank"
                      class="text-xs text-teal-400 hover:text-teal-300 transition flex items-center gap-1"
                    >
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                      </svg>
                      Ver Comprovante
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Link Process Modal -->
    <div>
    <LinkProcessModal
      :show="showLinkProcessModal"
      :action-id="acao.id"
      @close="fecharLinkProcessModal"
      @process-linked="handleProcessLinked"
    />

    <ConfirmationModal
      :show="showConfirmationModal"
      title="Confirmar Desnvinculação"
      message="Tem certeza que deseja desnvicular este processo da ação?"
      @cancel="fecharConfirmationModal"
      @confirm="handleDesvincularConfirmado"
    />

    <ProcessoDetalhesModal
      v-if="processoSelecionado"
      :show="showProcessoDetalhesModal"
      :processo="processoSelecionado"
      @close="fecharModalDetalhesProcesso"
      @atualizar-processo="atualizarProcesso"
      @switch-to-etapas="handleSwitchToEtapas"
      @switch-to-registros="handleSwitchToRegistros"
      :isAdmin="user?.role === 'Admin'"
    />

    <ProcessoEtapasModal
      v-if="processoSelecionado"
      :show="showProcessoEtapasModal"
      :processo="processoSelecionado"
      @close="fecharModalDetalhesProcesso"
      @atualizar-processo="atualizarProcesso"
      @switch-to-detalhes="handleSwitchToDetalhes"
      @switch-to-registros="handleSwitchToRegistros"
      :isAdmin="user?.role === 'Admin'"
    />

    <ProcessoRegistrosModal
      v-if="processoSelecionado"
      :show="showProcessoRegistrosModal"
      :processo="processoSelecionado"
      @close="fecharModalDetalhesProcesso"
      @atualizar-processo="atualizarProcesso"
      @switch-to-detalhes="handleSwitchToDetalhes"
      @switch-to-etapas="handleSwitchToEtapas"
    />

    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { supabase } from '../services/supabase';
import { useFormatters } from '../composables/useFormatters';
import LinkProcessModal from './LinkProcessModal.vue';
import ConfirmationModal from './ConfirmationModal.vue';
import ProcessoDetalhesModal from './ProcessoDetalhesModal.vue';
import ProcessoEtapasModal from './ProcessoEtapasModal.vue';
import ProcessoRegistrosModal from './ProcessoRegistrosModal.vue';
import { useAuth } from '../composables/useAuth';


const { user } = useAuth();

// Interfaces
interface Action {
  id: string;
  name: string;
  action_code: string;
  year: number;
  expense_nature: string;
  thematic_area_id: number;
  responsible_force_id: number;
}

interface ProcessoVinculado {
  id: string;
  name: string;
  codigo_transferegov?: string;
  valor_total_destinado?: number;
  status: string;
  created_at: string;
}

interface RegistroGasto {
  id: string;
  description?: string;
  amount_used: number;
  request_date?: string;
  acquisition_date?: string;
  file_url?: string;
  process_name: string;
  process_sei?: string;
}

// Props e Emits
const props = defineProps<{
  show: boolean;
  acao: Action;
}>();

const emit = defineEmits<{
  close: [];
  'acao-atualizada': [];
  'visualizar-processo': [processo: ProcessoVinculado];
}>();

// Composables
const { formatarValor: formatarMoeda, formatarData } = useFormatters();

// Estado
const abaAtiva = ref<'processos' | 'registros'>('processos');
const processosVinculados = ref<ProcessoVinculado[]>([]);
const registrosGastos = ref<RegistroGasto[]>([]);
const loadingProcessos = ref(false);
const loadingRegistros = ref(false);
const showLinkProcessModal = ref(false);
const showConfirmationModal = ref(false);
const processoParaDesvincular = ref<ProcessoVinculado | null>(null);
const processoSelecionado = ref<ProcessoVinculado | null>(null);
const showProcessoDetalhesModal = ref(false);
const showProcessoEtapasModal = ref(false);
const showProcessoRegistrosModal = ref(false);

// Computed
const totalGastos = computed(() => {
  return registrosGastos.value.reduce((total, registro) => total + registro.amount_used, 0);
});

const totalDestinado = computed(() => {
  return processosVinculados.value.reduce((total, processo) => total + (processo.valor_total_destinado || 0), 0);
});

const saldoRestante = computed(() => {
  return totalDestinado.value - totalGastos.value;
});

// Funções
function fecharModal() {
  emit('close');
}

function abrirLinkProcessModal() {
  showLinkProcessModal.value = true;
}

function fecharLinkProcessModal() {
  showLinkProcessModal.value = false;
}

async function handleProcessLinked() {
  await buscarDadosDaAcao();
  emit('acao-atualizada');
  setTimeout(() => {
    fecharLinkProcessModal();
  }, 1500);
}


function abrirModalConfirmacaoDesnviular(processo: ProcessoVinculado) {
  processoParaDesvincular.value = processo;
  showConfirmationModal.value = true;
}

function fecharConfirmationModal() {
  showConfirmationModal.value = false;
  processoParaDesvincular.value = null;
}
function fecharModalDetalhesProcesso() {
  processoSelecionado.value = null
  
  showProcessoDetalhesModal.value = false;
  showProcessoEtapasModal.value = false;
  showProcessoRegistrosModal.value = false;
}

// DENTRO DE AcaoDetalhesModal.vue

async function visualizarProcesso(processo: ProcessoVinculado) {
  // Mostra um feedback de carregamento
  // O objeto temporário agora corresponde à interface ProcessoVinculado
  processoSelecionado.value = {
    id: processo.id,
    name: 'Carregando...',
    status: 'Carregando...',
    created_at: new Date().toISOString(),
    valor_total_destinado: 0,
    codigo_transferegov: '...'
  }; 
  showProcessoDetalhesModal.value = true;
  
  try {
    // Busca os dados COMPLETOS do processo usando o ID
    const { data: processoCompleto, error } = await supabase
      .from('processes')
      .select(`
        *,
        thematic_areas ( code ),
        responsible_forces ( code )
      `)
      .eq('id', processo.id)
      .single();

    if (error) throw error;
    if (!processoCompleto) throw new Error("Processo não encontrado.");

    // Atualiza a variável com os dados completos
    processoSelecionado.value = {
        ...processoCompleto,
        area_code: processoCompleto.thematic_areas?.code,
        forca_code: processoCompleto.responsible_forces?.code,
    };
    
    // Garante que a aba de detalhes seja a ativa
    showProcessoDetalhesModal.value = true;
    showProcessoEtapasModal.value = false;
    showProcessoRegistrosModal.value = false;

  } catch (err) {
    console.error("Erro ao buscar detalhes do processo:", err);
    alert("Não foi possível carregar os detalhes do processo.");
    fecharModalDetalhesProcesso(); 
  }
}

function handleSwitchToEtapas() {
  showProcessoDetalhesModal.value = false;
  showProcessoRegistrosModal.value = false;
  showProcessoEtapasModal.value = true;
}

function handleSwitchToDetalhes() {
  showProcessoDetalhesModal.value = true;
  showProcessoEtapasModal.value = false;
  showProcessoRegistrosModal.value = false;
}

function handleSwitchToRegistros() {
  showProcessoDetalhesModal.value = false;
  showProcessoEtapasModal.value = false;
  showProcessoRegistrosModal.value = true;
}

async function atualizarProcesso() {
  await buscarDadosDaAcao();
}

async function handleDesvincularConfirmado() {
  if (!processoParaDesvincular.value) return;
  try {
    const { error } = await supabase
      .from('processes')
      .update({ action_id: null })
      .eq('id', processoParaDesvincular.value.id);

    if (error) throw error;
    await buscarDadosDaAcao();
    emit('acao-atualizada');
  } catch (error) {
    console.error('Erro ao desvincular processo:', error);
    alert('Erro ao desvincular processo. Tente novamente.');
  } finally {
    fecharConfirmationModal(); // CORRIGIDO AQUI
  }
}

async function buscarDadosDaAcao() {
  if (!props.acao?.id) return;

  loadingProcessos.value = true;
  loadingRegistros.value = true;

  try {
    const { data, error } = await supabase.rpc('get_records_for_action', {
      p_action_id: props.acao.id
    });

    if (error) throw error;

    processosVinculados.value = data?.processes || [];
    registrosGastos.value = data?.records || [];
  } catch (error) {
    console.error('Erro ao buscar dados da ação:', error);
    processosVinculados.value = [];
    registrosGastos.value = [];
  } finally {
    loadingProcessos.value = false;
    loadingRegistros.value = false;
  }
}

// Watchers
watch(
  () => props.acao,
  (newAcao) => {
    if (newAcao && newAcao.id) {
      abaAtiva.value = 'processos';
      buscarDadosDaAcao();
    }
  },
  { immediate: true }
)

</script>
