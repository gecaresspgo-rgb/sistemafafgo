<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" @click.self="$emit('close')">
    <div class="bg-gradient-to-br from-slate-900/95 to-blue-900/95 backdrop-blur-md border border-white/20 text-white rounded-xl shadow-2xl p-8 max-w-4xl w-full relative max-h-[90vh] flex flex-col">
      
      <div class="flex items-center gap-4 mb-4">
        <div class="flex bg-slate-800/50 rounded-lg p-1">
          <button @click="trocarParaDetalhes" class="px-4 py-1.5 rounded-md font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors">
            Detalhes
          </button>
          <button @click="trocarParaEtapas" class="px-4 py-1.5 rounded-md font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors">
            Etapas
          </button>
          <button class="px-4 py-1.5 rounded-md font-medium bg-gradient-to-r from-teal-600 to-cyan-500 text-white">
            Registros
          </button>
        </div>
        <button @click="fecharModal" class="ml-auto p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-red-400 transition" title="Fechar">
          <svg class='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='2'><path stroke-linecap='round' stroke-linejoin='round' d='M18 6L6 18M6 6l12 12'/></svg>
        </button>
      </div>

      <div class="mb-6 bg-white/5 p-4 rounded-lg">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div class="text-center">
            <p class="text-sm text-slate-300">Valor Total Destinado</p>
            <p class="text-2xl font-bold text-green-400">{{ formatarMoeda(valorTotalDestinadoCalculado) }}</p>
          </div>
          <div class="text-center">
  <p class="text-sm text-slate-300 mb-1">Valor Utilizado (Empenhado)</p>
  
  <div v-if="!isEditingEmpenhado" class="flex items-center justify-center gap-3 h-10">
    <p class="text-2xl font-bold text-red-400">{{ formatarMoeda(props.processo.valor_utilizado_processo || 0) }}</p>
    <button @click="iniciarEdicaoEmpenhado" class="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-teal-400 transition" title="Editar Valor Empenhado">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 20h9" /><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 3.5a2.121 2.121 0 113 3L7 19.5 3 21l1.5-4L16.5 3.5z" /></svg>
    </button>
  </div>

  <div v-else class="flex items-center justify-center gap-2 h-10">
    <input 
      type="number"
      step="0.01"
      v-model.number="valorUtilizadoEditavel" 
      class="w-32 bg-transparent text-2xl font-bold text-red-400 text-center border border-slate-700 rounded-md focus:ring-teal-500 focus:border-teal-500"
    />
    <button @click="confirmarAtualizacaoValorUtilizado" :disabled="isSubmitting" class="p-2 bg-teal-600 rounded-md hover:bg-teal-500 transition disabled:opacity-50" title="Salvar">
      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg>
    </button>
    <button @click="cancelarEdicaoEmpenhado" class="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-red-400 transition" title="Cancelar">
      <svg class='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='2'><path stroke-linecap='round' stroke-linejoin='round' d='M6 18L18 6M6 6l12 12'/></svg>
    </button>
  </div>
</div>
          <div class="text-center">
            <p class="text-sm text-slate-300">Saldo a Pagar</p>
            <p class="text-2xl font-bold text-teal-400">{{ formatarMoeda(saldoAPagar) }}</p>
          </div>
        </div>
        <div class="pt-4 border-t border-slate-700 text-center">
          <p class="text-sm text-slate-300">Economicidade Gerada</p>
          <p class="text-2xl font-bold text-cyan-400">{{ formatarMoeda(economicidadeGeradaProcesso) }}</p>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <div class="bg-white/5 p-4 rounded-lg mb-6">
          <h3 class="font-semibold text-white mb-3">Adicionar Novo Registro de Gasto</h3>
          <form @submit.prevent="salvarRegistro" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-1">Data de Solicitação</label>
                <input v-model="newRecord.request_date" type="date" class="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white custom-date-input">
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-1">Data de Aquisição</label>
                <input v-model="newRecord.acquisition_date" type="date" class="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white custom-date-input">
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-1">Valor Utilizado</label>
                <input v-model.number="newRecord.amount_used" type="number" step="0.01" placeholder="R$ 0,00" class="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white" required>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-1">Descrição dos Itens/Serviços</label>
              <textarea v-model="newRecord.description" rows="2" placeholder="Descreva o que foi adquirido..." class="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-1">Anexar Comprovante (Opcional)</label>
              <div class="flex items-center gap-4 bg-white/10 border border-white/20 rounded-lg px-3 py-2">
                <label for="record-file-input" class="px-3 py-1 bg-white/10 border border-white/20 rounded-md text-white text-sm font-semibold cursor-pointer hover:bg-white/20 transition">
                  Escolher Arquivo
                </label>
                <input id="record-file-input" type="file" @change="onFileChange" class="hidden" />
                <span class="text-sm text-slate-300 truncate">{{ newRecordFile?.name || 'Nenhum arquivo selecionado...' }}</span>
              </div>
            </div>
            <div class="flex justify-end">
              <button type="submit" :disabled="isSubmitting" class="px-5 py-2 bg-gradient-to-r from-teal-600 to-cyan-500 text-white rounded-lg font-semibold shadow disabled:opacity-50 disabled:cursor-not-allowed">
                {{ isSubmitting ? 'Salvando...' : 'Salvar Registro' }}
              </button>
            </div>
          </form>
        </div>

        <div>
          <h3 class="font-semibold text-white mb-3">Registros Salvos</h3>
          <div v-if="loadingRecords" class="text-center p-4 text-slate-400">Carregando registros...</div>
          <div v-else-if="records.length === 0" class="text-center text-slate-400 p-4">Nenhum registro de gasto encontrado.</div>
          <div v-else class="space-y-3">
            <div v-for="record in records" :key="record.id" class="bg-white/5 p-3 rounded-lg flex items-center justify-between gap-4 group">
              <div>
                <p class="font-semibold text-white">{{ record.description || 'Registro sem descrição' }}</p>
                <div class="flex items-center gap-4 text-sm text-slate-300 mt-1">
                  <span>Solicitado: {{ formatarData(record.request_date) }}</span>
                  <span>Adquirido: {{ formatarData(record.acquisition_date) }}</span>
                  <a v-if="record.file_url" :href="record.file_url" target="_blank" class="flex items-center gap-1 text-teal-400 hover:text-teal-300 hover:underline" title="Ver anexo">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                    Ver Comprovante
                  </a>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <p class="text-lg font-bold text-teal-300 flex-shrink-0">{{ formatarMoeda(record.amount_used) }}</p>
                <button @click="confirmarExclusaoRegistro(record)" class="p-2 text-red-400 hover:bg-red-500/20 rounded-full transition opacity-0 group-hover:opacity-100" title="Excluir Registro">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <ConfirmationModal
      :show="showConfirmationModal"
      :title="confirmationTitle"
      :message="confirmationMessage"
      @confirm="onConfirmAction"
      @cancel="onCancelAction"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue';
import { supabase } from '../services/supabase';
import { useAuth } from '../composables/useAuth';
import { useFormatters } from '../composables/useFormatters';
import ConfirmationModal from './ConfirmationModal.vue';
import type { PostgrestError } from '@supabase/supabase-js';

// --- Interfaces e Tipos ---
interface ProcessRecord {
  id: string;
  process_id: string;
  request_date: string | null;
  acquisition_date: string | null;
  amount_used: number;
  description: string | null;
  file_url?: string | null;
  storage_path?: string | null;
}

interface ProcessoCompleto {
  id: string;
  valor_total_destinado?: number;
  valor_inicial_padrao?: number;
  valor_rendimentos?: number;
  valor_economicidade?: number;
  valor_utilizado_processo?: number;
  status?: string;
  etapaAtualNome?: string;
}

// --- Props e Emits ---
const props = defineProps<{
  show: boolean;
  processo: ProcessoCompleto;
}>();

const emit = defineEmits(['close', 'atualizar-processo', 'switch-to-detalhes', 'switch-to-etapas']);

// --- Composables ---
const { user } = useAuth();
const { formatarValor: formatarMoeda, formatarData } = useFormatters();

// --- Estado Reativo ---
const records = ref<ProcessRecord[]>([]);
const loadingRecords = ref(false);
const isSubmitting = ref(false);
const newRecordFile = ref<File | null>(null);
const valorUtilizadoEditavel = ref(0);

const newRecord = reactive({
  request_date: '',
  acquisition_date: '',
  amount_used: null as number | null,
  description: '',
});

// --- Estado do Modal de Confirmação ---
const showConfirmationModal = ref(false);
const confirmationTitle = ref('');
const confirmationMessage = ref('');
const actionToConfirm = ref<(() => void) | null>(null);

// --- Propriedades Computadas (Lógica de Negócio) ---
const valorTotalDestinadoCalculado = computed(() => {
  const inicial = Number(props.processo.valor_inicial_padrao) || 0;
  const rendimentos = Number(props.processo.valor_rendimentos) || 0;
  const economicidade = Number(props.processo.valor_economicidade) || 0;
  return inicial + rendimentos + economicidade;
});

const totalPago = computed(() => {
  return records.value.reduce((sum, record) => sum + (record.amount_used || 0), 0);
});

const saldoAPagar = computed(() => {
  const empenhado = props.processo.valor_utilizado_processo || 0;
  return empenhado - totalPago.value;
});

const economicidadeGeradaProcesso = computed(() => {
  const etapasValidas = ['NOTA DE EMPENHO', 'CONTRATO', 'RECEBER BENS OU SERVIÇO', 'NOTA FISCAL', 'LIQUIDAR DEPESA'];
  const podeGerarEconomicidade = props.processo.status === 'Concluído' || etapasValidas.includes(props.processo.etapaAtualNome?.toUpperCase() ?? '');

  if (!podeGerarEconomicidade) {
    return 0;
  }

  const destinado = valorTotalDestinadoCalculado.value;
  const utilizado = props.processo.valor_utilizado_processo || 0;
  return Math.max(0, destinado - utilizado);
});

// --- Funções de Navegação e UI ---
const fecharModal = () => emit('close');
const trocarParaEtapas = () => emit('switch-to-etapas');
const trocarParaDetalhes = () => emit('switch-to-detalhes');

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  newRecordFile.value = target.files?.[0] || null;
};

const resetNewRecordForm = () => {
    newRecord.request_date = '';
    newRecord.acquisition_date = '';
    newRecord.amount_used = null;
    newRecord.description = '';
    newRecordFile.value = null;
    // Reseta o input de arquivo visualmente
    const fileInput = document.getElementById('record-file-input') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
};


// --- Lógica de Confirmação ---
const onConfirmAction = () => {
  actionToConfirm.value?.();
  closeConfirmationModal();
};

const onCancelAction = () => {
  closeConfirmationModal();
};

const closeConfirmationModal = () => {
  showConfirmationModal.value = false;
  actionToConfirm.value = null;
};

// --- Funções de Interação com a API (Supabase) ---

async function fetchRecords() {
  if (!props.processo.id) return;
  loadingRecords.value = true;
  try {
    const { data, error } = await supabase
      .from('process_records')
      .select('*')
      .eq('process_id', props.processo.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    records.value = data || [];
  } catch (err) {
    const error = err as PostgrestError;
    console.error('Erro ao buscar registros:', error.message);
    // TODO: Implementar um sistema de notificação (toast) para o usuário
  } finally {
    loadingRecords.value = false;
  }
}

async function salvarRegistro() {
  if (!newRecord.amount_used) {
    // TODO: Usar notificação de erro mais elegante
    alert('O campo "Valor Utilizado" é obrigatório.');
    return;
  }
  isSubmitting.value = true;
  
  let fileParams = { p_file_url: null as string | null, p_filename: null as string | null, p_storage_path: null as string | null };

  try {
    if (newRecordFile.value) {
      const file = newRecordFile.value;
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filePath = `${props.processo.id}/records/${Date.now()}_${sanitizedFileName}`;
      
      const { error: uploadError } = await supabase.storage.from('documents').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('documents').getPublicUrl(filePath);
      fileParams = {
        p_file_url: urlData.publicUrl,
        p_filename: file.name,
        p_storage_path: filePath,
      };
    }

    const { error } = await supabase.rpc('gerenciar_registro_de_gasto', {
      p_operacao: 'INSERT',
      p_process_id: props.processo.id,
      p_request_date: newRecord.request_date || null,
      p_acquisition_date: newRecord.acquisition_date || null,
      p_amount_used: newRecord.amount_used,
      p_description: newRecord.description,
      ...fileParams
    });

    if (error) throw error;

    resetNewRecordForm();
    await fetchRecords();
    emit('atualizar-processo');

  } catch (err) {
    const error = err as Error | PostgrestError;
    console.error('Erro ao salvar registro:', error.message);
    // TODO: Implementar notificação de erro para o usuário
  } finally {
    isSubmitting.value = false;
  }
}

const isEditingEmpenhado = ref(false);

// Adicione estas novas funções de controle
function iniciarEdicaoEmpenhado() {
  // Copia o valor atual do processo para o campo de edição
  valorUtilizadoEditavel.value = props.processo.valor_utilizado_processo || 0;
  isEditingEmpenhado.value = true;
}

function cancelarEdicaoEmpenhado() {
  isEditingEmpenhado.value = false;
}

function confirmarAtualizacaoValorUtilizado() {
  confirmationTitle.value = 'Confirmar Alteração de Valor';
  confirmationMessage.value = `Deseja salvar o Valor Utilizado (Empenhado) como ${formatarMoeda(valorUtilizadoEditavel.value)}?`;
  actionToConfirm.value = atualizarValorUtilizado;
  showConfirmationModal.value = true;
}

async function atualizarValorUtilizado() {
  isSubmitting.value = true;
  try {
    const { error } = await supabase.rpc('atualizar_valor_empenhado', {
      p_process_id: props.processo.id,
      p_novo_valor_empenhado: valorUtilizadoEditavel.value
    });
    if (error) throw error;
    emit('atualizar-processo');
    isEditingEmpenhado.value = false; // <-- Adicione esta linha para sair do modo de edição
  } catch (err) {
    // ... seu tratamento de erro
  } finally {
    isSubmitting.value = false;
  }
}

function confirmarExclusaoRegistro(record: ProcessRecord) {
  confirmationTitle.value = 'Confirmar Exclusão de Registro';
  confirmationMessage.value = `Tem certeza que deseja excluir o registro "${record.description || 'sem descrição'}" no valor de ${formatarMoeda(record.amount_used)}? Esta ação não pode ser desfeita.`;
  actionToConfirm.value = () => executarExclusaoRegistro(record);
  showConfirmationModal.value = true;
}

// Em ProcessoRegistrosModal.vue

async function executarExclusaoRegistro(record: ProcessRecord) {
  isSubmitting.value = true;
  try {
    if (record.storage_path) {
      await supabase.storage.from('documents').remove([record.storage_path]);
    }
    
    // ✨ MUDANÇA AQUI: Chame a nova função com os parâmetros corretos
    const { error } = await supabase.rpc('excluir_registro_de_gasto', {
      p_record_id: record.id
    });

    if (error) throw error;
    
    await fetchRecords();
    emit('atualizar-processo');
  } catch (err) {
    //... seu tratamento de erro
  } finally {
    isSubmitting.value = false;
  }
}

// --- Watcher ---
watch(() => props.show, (isVisible) => {
  if (isVisible) {
    valorUtilizadoEditavel.value = props.processo.valor_utilizado_processo || 0;
    fetchRecords();
  }
}, { immediate: true });

</script>

<style scoped>
.custom-date-input::-webkit-calendar-picker-indicator {
  filter: invert(1);
  cursor: pointer;
}

/* Scrollbar customizada para a área de conteúdo */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>