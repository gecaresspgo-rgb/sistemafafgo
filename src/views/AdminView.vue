<template>
  <Layout>
    <div class="min-h-screen flex flex-col items-center px-8 py-8">
      <div class="w-full max-w-4xl bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-xl p-10">
        <h1 class="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent mb-6">Regras de Automação</h1>
        <div class="flex justify-between items-center mb-6">
          <button @click="abrirModalCriar" class="px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-500 text-white rounded font-bold shadow hover:from-teal-700 hover:to-cyan-600 transition">
            + Criar Nova Regra
          </button>
        </div>
        <table class="w-full text-left bg-white/5 rounded-lg overflow-hidden border-separate border-spacing-0">
          <thead>
            <tr class="text-teal-300 border-b border-white/10">
              <th class="py-2 px-3 border-r border-slate-800">Nome da Regra</th>
              <th class="py-2 px-3 border-r border-slate-800">Gatilho</th>
              <th class="py-2 px-3 border-r border-slate-800">Ação</th>
              <th class="py-2 px-3 border-r border-slate-800">Ativo</th>
              <th class="py-2 px-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(grupoDeRegras, categoria) in regrasAgrupadas" :key="categoria">
              <tr @click="toggleSecao(categoria)" class="cursor-pointer bg-slate-100 hover:bg-slate-200">
                <td :colspan="5" class="font-bold text-abyss-primary py-2">
                  <span class="mr-2">
                    <svg v-if="secoesAbertas[categoria]" class="inline w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                    <svg v-else class="inline w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                  </span>
                  {{ categoria }}
                </td>
              </tr>
              <template v-if="secoesAbertas[categoria]">
                <tr v-for="regra in grupoDeRegras" :key="regra.id">
                  <td class="py-2 px-3 border-r border-slate-800">{{ regra.rule_name }}</td>
                  <td class="py-2 px-3 border-r border-slate-800">{{ descricaoGatilho(regra) }}</td>
                  <td class="py-2 px-3 border-r border-slate-800">{{ descricaoAcao(regra) }}</td>
                  <td class="py-2 px-3 border-r border-slate-800">
                    <input type="checkbox" v-model="regra.is_active" @change="toggleAtivo(regra)" />
                  </td>
                  <td class="py-2 px-3 flex gap-2">
                    <button @click.stop="abrirModalEditar(regra)" class="text-teal-400 hover:underline">Editar</button>
                    <button @click.stop="confirmarExclusaoRegra(regra.id)" class="text-red-400 hover:underline">Excluir</button>
                  </td>
                </tr>
              </template>
            </template>
            <tr v-if="regras.length === 0">
              <td colspan="5" class="text-center text-slate-400 py-6">Nenhuma regra cadastrada.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal de Criação/Edição -->
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div class="bg-gradient-to-br from-slate-900/95 to-blue-900/95 backdrop-blur-md border border-white/20 text-white rounded-xl shadow-2xl p-8 max-w-2xl w-full relative max-h-[90vh] overflow-y-auto">
          <button class="absolute top-2 right-2 p-2 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors" @click="fecharModal">
            <svg xmlns='http://www.w3.org/2000/svg' class='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='2'><path stroke-linecap='round' stroke-linejoin='round' d='M18 6L6 18M6 6l12 12'/></svg>
          </button>
          <h2 class="text-2xl font-bold mb-4">{{ editandoRegra ? 'Editar Regra' : 'Criar Nova Regra' }}</h2>
          <form @submit.prevent="handleSaveRule">
            <div class="mb-4">
              <label class="block text-slate-300 mb-1">Nome da Regra</label>
              <input v-model="form.rule_name" type="text" class="w-full px-3 py-2 rounded bg-white/10 border border-white/20 text-white" required />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium mb-1">Categoria da Regra</label>
              <input type="text" v-model="form.category" placeholder="Ex: Notificações, Atribuições, etc."
                class="w-full border rounded bg-white text-gray-900 border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition" />
            </div>
            <div class="mb-4">
              <label class="block text-slate-300 mb-1">Gatilho (Quando...)</label>
              <select v-model="form.trigger_type" class="w-full px-3 py-2 rounded bg-slate-800 border border-white/20 text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/70" required>
                <option value="" class="text-slate-400">Selecione...</option>
                <option value="on_step_entry">Ao entrar em uma etapa</option>
                <option value="after_delay">Após um tempo em uma etapa</option>
                <option value="on_substep_creation">Ao criar uma subtarefa</option>
                <option value="on_substep_completion">Ao concluir uma subtarefa</option>
                <option value="on_overspending">Quando o valor utilizado excede o destinado</option>
              </select>
            </div>
            <div v-if="form.trigger_type === 'on_step_entry' || form.trigger_type === 'after_delay'" class="mb-4">
              <label class="block text-slate-300 mb-1">Etapa</label>
              <select v-model="form.trigger_step_template_id" class="w-full px-3 py-2 rounded bg-slate-800 border border-white/20 text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/70" required>
                <option value="" class="text-slate-400">Selecione a etapa...</option>
                <option v-for="etapa in etapas" :key="etapa.id" :value="etapa.id">{{ etapa.name }}</option>
              </select>
            </div>
            <div v-if="form.trigger_type === 'after_delay'" class="mb-4">
              <label class="block text-slate-300 mb-1">Dias de atraso</label>
              <input v-model.number="form.trigger_delay_days" type="number" min="1" class="w-full px-3 py-2 rounded bg-white/10 border border-white/20 text-white" required />
            </div>
            <div class="mb-4">
              <label class="block text-slate-300 mb-1">Ação (Então...)</label>
              <select v-model="form.action_type" class="w-full px-3 py-2 rounded bg-slate-800 border border-white/20 text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/70" required>
                <option value="">Selecione...</option>
                <option value="assign_user">Atribuir a um usuário</option>
                <option value="send_notification">Enviar uma notificação</option>
              </select>
            </div>
            <div v-if="form.action_type === 'assign_user'" class="mb-4">
              <label class="block text-slate-300 mb-1">Usuário</label>
              <select v-model="form.action_user_id" class="w-full px-3 py-2 rounded bg-slate-800 border border-white/20 text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/70" required>
                <option value="" class="text-slate-400">Selecione o usuário...</option>
                <option v-for="user in usuarios" :key="user.id" :value="user.id">{{ user.nome }}</option>
              </select>
            </div>
            <div v-if="form.action_type === 'assign_user'" class="mb-4">
              <label class="block text-slate-300 mb-1">Mensagem da Notificação</label>
              <textarea v-model="form.action_message" class="w-full px-3 py-2 rounded bg-white/10 border border-white/20 text-white" rows="2" placeholder="Mensagem que será enviada ao usuário ao ser atribuído à etapa."></textarea>
            </div>
            <div v-if="form.action_type === 'send_notification'" class="mb-4">
              <label class="block text-slate-300 mb-1">Destinatário</label>
              <select v-model="form.action_notification_target" class="w-full px-3 py-2 rounded bg-slate-800 border border-white/20 text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/70" required>
                <option value="">Selecione...</option>
                <option value="owner">Dono do processo</option>
                <option value="substep_creator">Criador da subtarefa</option>
                <option value="substep_assignee">Responsável da subtarefa</option>
                <option value="user">Usuário específico</option>
              </select>
              <div v-if="form.action_notification_target === 'user'" class="mt-2">
                <label class="block text-slate-300 mb-1">Usuário Destinatário</label>
                <select v-model="form.action_notification_user_id" class="w-full px-3 py-2 rounded bg-slate-800 border border-white/20 text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/70">
                  <option value="">Selecione o usuário...</option>
                  <option v-for="user in usuarios" :key="user.id" :value="user.id">{{ user.nome }}</option>
                </select>
              </div>
              <label class="block text-slate-300 mb-1 mt-2">Mensagem</label>
              <textarea v-model="form.action_notification_message" class="w-full px-3 py-2 rounded bg-white/10 border border-white/20 text-white" rows="2" required></textarea>
            </div>
            <div v-if="saveError" class="mt-4 text-center p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p class="text-red-400 text-sm font-semibold">{{ saveError }}</p>
            </div>
            <div class="flex justify-end gap-2 mt-6">
              <button type="button" @click="fecharModal" class="px-4 py-2 bg-slate-700 text-white rounded font-bold">Cancelar</button>
              <button type="submit" class="px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-500 text-white rounded font-bold shadow hover:from-teal-700 hover:to-cyan-600 transition">Salvar</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal de Gerenciamento de Processos -->
      <div v-if="showProcessManagerModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
        <div class="bg-[#1e293b] rounded-lg shadow-2xl w-full max-w-5xl p-6 relative border border-white/10">
          <button @click="showProcessManagerModal = false" class="absolute top-2 right-2 text-slate-400 hover:text-red-400 text-2xl font-bold">&times;</button>
          <h2 class="text-2xl font-bold mb-4 text-teal-400">Gerenciador de Processos</h2>
          <div class="flex gap-4 mb-4">
            <input v-model="searchTerm" type="text" placeholder="Buscar por nome da ação..." class="flex-1 bg-white/10 border border-white/20 text-white rounded px-3 py-2 placeholder:text-slate-400" />
            <select v-model="statusFilter" class="border rounded px-3 py-2">
              <option value="">Todos os Status</option>
              <option value="Em Andamento">Em Andamento</option>
              <option value="Concluído">Concluído</option>
              <!-- Adicione outros status se necessário -->
            </select>
          </div>
          <div class="overflow-x-auto max-h-[60vh]">
            <table class="min-w-full text-sm border border-white/10 text-white bg-white/5">
              <thead>
                <tr class="bg-white/10 text-teal-300">
                  <th class="px-3 py-2">Processo SEI</th>
                  <th class="px-3 py-2">Nome da Ação</th>
                  <th class="px-3 py-2">Status</th>
                  <th class="px-3 py-2">Criado em</th>
                  <th class="px-3 py-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="loadingProcessos">
                  <td colspan="5" class="text-center py-6">Carregando...</td>
                </tr>
                <tr v-else-if="processosListados.length === 0">
                  <td colspan="5" class="text-center py-6">Nenhum processo encontrado.</td>
                </tr>
                <tr v-for="(proc, index) in processosPaginados" :key="String(proc.id)" :class="index % 2 === 0 ? 'bg-white/5' : 'bg-white/0'">
                  <td class="px-3 py-2">{{ proc.codigo_transferegov as string }}</td>
                  <td class="px-3 py-2">{{ proc.nome_acao as string }}</td>
                  <td class="px-3 py-2">{{ proc.status as string }}</td>
                  <td class="px-3 py-2">{{ new Date(proc.created_at as string).toLocaleString() }}</td>
                  <td class="px-3 py-2">
                    <button @click="confirmarExclusaoProcesso(proc.id as string, proc.nome_acao as string)" class="text-red-600 hover:underline">Excluir</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="processosListados.length > processosVisiveis" class="flex justify-center mt-4">
            <button @click="mostrarMaisProcessos" class="px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-500 text-white rounded font-bold shadow hover:from-teal-700 hover:to-cyan-600 transition">
              Mostrar mais
            </button>
          </div>
        </div>
      </div>

      <!-- Nova seção de Gerenciador de Processos -->
      <div class="w-full max-w-4xl bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-xl p-10 mt-10">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
            {{ mostrandoLixeira ? 'Lixeira' : 'Gerenciador de Processos' }}
          </h1>
          <button
            @click="mostrandoLixeira = !mostrandoLixeira"
            class="px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-500 text-white rounded font-bold shadow hover:from-teal-700 hover:to-cyan-600 transition"
          >
            {{ mostrandoLixeira ? 'Voltar ao Gerenciador' : 'Ver Lixeira' }}
          </button>
        </div>

        <!-- Filtros (visíveis apenas quando não estiver na lixeira) -->
        <div v-if="!mostrandoLixeira" class="flex gap-4 mb-6">
          <input v-model="searchTerm" type="text" placeholder="Buscar por nome da ação..." class="flex-1 bg-white/10 border border-white/20 text-white rounded px-3 py-2 placeholder:text-slate-400" />
          <select v-model="statusFilter" class="border rounded px-3 py-2 bg-slate-800 border-white/20 text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/70">
            <option value="">Todos os Status</option>
            <option value="Em Andamento">Em Andamento</option>
            <option value="Concluído">Concluído</option>
            <!-- Adicione outros status se necessário -->
          </select>
        </div>
        <div class="overflow-x-auto max-h-[60vh]">
          <table class="min-w-full text-sm border border-white/10 text-white bg-white/5">
            <thead>
              <tr class="bg-white/10 text-teal-300">
                <th class="px-3 py-2">Processo SEI</th>
                <th class="px-3 py-2">Nome da Ação</th>
                <th class="px-3 py-2">Status</th>
                <th class="px-3 py-2">Criado em</th>
                <th class="px-3 py-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loadingProcessos">
                <td colspan="5" class="text-center py-6">Carregando...</td>
              </tr>
              <tr v-else-if="processosListados.length === 0">
                <td colspan="5" class="text-center py-6">
                  {{ mostrandoLixeira ? 'A lixeira está vazia.' : 'Nenhum processo encontrado.' }}
                </td>
              </tr>
              <tr v-for="(proc, index) in processosListados" :key="String(proc.id)" :class="index % 2 === 0 ? 'bg-white/5' : 'bg-white/0'">
                <td class="px-3 py-2">{{ proc.codigo_transferegov as string }}</td>
                <td class="px-3 py-2">{{ proc.nome_acao as string }}</td>
                <td class="px-3 py-2">{{ proc.status as string }}</td>
                <td class="px-3 py-2">{{ new Date(proc.created_at as string).toLocaleString() }}</td>
                <td class="px-3 py-2">
                  <!-- Botão condicional baseado no estado da lixeira -->
                  <button
  v-if="!mostrandoLixeira"
  @click="confirmarExclusaoProcesso(proc.id as string, proc.nome_acao as string)"
  class="text-red-600 hover:underline"
>
  Excluir
</button>
<button
  v-else
  @click="confirmarRestauracaoProcesso(proc.id as string, proc.nome_acao as string)"
  class="text-green-500 hover:underline"
>
  Restaurar
</button>
                </td>
              </tr>
            </tbody>
          </table>
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
  </Layout>
</template>

<script setup lang="ts">
import Layout from '../components/Layout.vue'
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { supabase } from '../services/supabase'
import { useAuth } from '../composables/useAuth'
import ConfirmationModal from '../components/ConfirmationModal.vue';

// Tipos explícitos para evitar 'any'
interface Regra {
  id: number;
  rule_name: string;
  trigger_type: string;
  trigger_metadata?: Record<string, unknown>;
  action_type: string;
  action_metadata?: Record<string, unknown>;
  is_active: boolean;
  category?: string; // Adicionado para categoria
}
interface Etapa { id: number; name: string }
interface Usuario { id: string; nome: string }

const regras = ref<Regra[]>([])
const etapas = ref<Etapa[]>([])
const usuarios = ref<Usuario[]>([])
const showModal = ref(false)
const editandoRegra = ref(false)
const regraEditadaId = ref<number | null>(null)
const saveError = ref('');

// [1] --- NOVO: Estado para modal de gerenciamento de processos ---
const showProcessManagerModal = ref(false)
const searchTerm = ref('')
const statusFilter = ref('')
const processosListados = ref<Record<string, unknown>[]>([])
const loadingProcessos = ref(false)

// Adicione estas variáveis de estado para o modal de confirmação
const showConfirmationModal = ref(false);
const confirmationTitle = ref('');
const confirmationMessage = ref('');
// Esta variável "guarda" a ação a ser executada se o usuário clicar em "Confirmar"
const actionToConfirm = ref<(() => void) | null>(null);

// Estado para controlar a visualização da lixeira
const mostrandoLixeira = ref(false)

// [2] --- NOVO: Função para buscar processos (ativos ou excluídos) ---
async function fetchProcesses() {
  loadingProcessos.value = true
  let query = supabase.from('processes').select('*')

  // Filtrar por processos ativos ou excluídos com base no estado da lixeira
  if (mostrandoLixeira.value) {
    query = query.not('deleted_at', 'is', null)
  } else {
    query = query.is('deleted_at', null)
    // Aplicar filtros apenas na visualização normal (não na lixeira)
    if (searchTerm.value) {
      query = query.ilike('nome_acao', `%${searchTerm.value}%`)
    }
    if (statusFilter.value) {
      query = query.eq('status', statusFilter.value)
    }
  }

  const { data } = await query.order('created_at', { ascending: false })
  processosListados.value = data || []
  loadingProcessos.value = false
}

// [3] --- NOVO: Watchers para busca/filtro (com debounce para busca) ---
let searchTimeout: ReturnType<typeof setTimeout> | null = null
watch([searchTerm, statusFilter], ([term]) => {
  // Não aplicar filtros quando estiver na lixeira
  if (!mostrandoLixeira.value) {
    if (searchTimeout) clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      processosVisiveis.value = 5
      fetchProcesses()
    }, term ? 400 : 0)
  }
}, { immediate: false })

// Observar mudanças no estado da lixeira
watch(mostrandoLixeira, () => {
  // Resetar filtros ao alternar para a lixeira
  if (mostrandoLixeira.value) {
    searchTerm.value = ''
    statusFilter.value = ''
  }
  processosVisiveis.value = 5
  fetchProcesses()
})

// [4] --- NOVO: Função de exclusão (soft delete) ---


// 2. A função que realmente faz o trabalho (sua lógica antiga, sem o confirm)
function confirmarExclusaoProcesso(processoId: string, processoNome: string) {
  confirmationTitle.value = 'Confirmar Exclusão';
  confirmationMessage.value = `Tem certeza que deseja mover o processo "${processoNome}" para a lixeira?`;
  actionToConfirm.value = () => executarExclusaoProcesso(processoId);
  showConfirmationModal.value = true;
}

async function executarExclusaoProcesso(processoId: string) {
  try {
    // 1. Tenta fazer o soft delete
    const { error: updateError } = await supabase
      .from('processes')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', processoId);

    if (updateError) throw updateError;

    // 2. Tenta registrar a auditoria
    const { error: auditError } = await supabase.from('audit_log').insert({
      process_id: processoId,
      user_id: user.value?.id,
      field_name: 'deleted_at',
      old_value: 'NULL',
      new_value: 'data de exclusão'
    });

    if (auditError) {
      // Mesmo que a auditoria falhe, o processo foi excluído.
      // Apenas avisamos sobre a falha no log.
      console.warn('O processo foi excluído, mas houve uma falha ao registrar a auditoria:', auditError);
    }

    // 3. Atualiza a lista de processos na tela
    fetchProcesses();

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error) || 'Erro desconhecido';
    console.error('Erro ao excluir processo:', error);
    // Agora, qualquer erro (seja no update ou na auditoria) será exibido
    alert('Erro ao excluir processo: ' + errorMessage);
  }
}

// --- 4. Refatore a lógica de RESTAURAR ---
// Função que abre o modal de confirmação para a restauração
function confirmarRestauracaoProcesso(processoId: string, processoNome: string) {
  confirmationTitle.value = 'Confirmar Restauração';
  confirmationMessage.value = `Tem certeza que deseja restaurar o processo "${processoNome}"? Ele voltará para a lista de processos ativos.`;
  // Guarda a função de execução que será chamada se o usuário confirmar
  actionToConfirm.value = () => executarRestauracaoProcesso(processoId);
  showConfirmationModal.value = true; // Mostra o modal
}

// Função que executa a restauração (sua lógica antiga, sem confirm e sem alert de sucesso)
async function executarRestauracaoProcesso(processoId: string) {
  try {
    const { error: updateError } = await supabase
      .from('processes')
      .update({ deleted_at: null })
      .eq('id', processoId);

    if (updateError) throw updateError;

    // Sua lógica de auditoria (opcional, mas recomendado)
    await supabase.from('audit_log').insert({
      process_id: processoId,
      user_id: user.value?.id,
      field_name: 'deleted_at',
      old_value: 'data de exclusão',
      new_value: 'NULL'
    });

    fetchProcesses(); // Atualiza a lista, o que já é um feedback visual

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error) || 'Erro desconhecido';
    console.error('Erro ao restaurar processo:', error);
    // Para erros, um alert ainda pode ser útil, ou você pode usar um componente de notificação mais elegante
    alert('Erro ao restaurar processo: ' + errorMessage);
  }
}


function onConfirmAction() {
  if (actionToConfirm.value) {
    actionToConfirm.value(); // Executa a ação que foi guardada
  }
  closeConfirmationModal();
}

function onCancelAction() {
  closeConfirmationModal();
}

function closeConfirmationModal() {
  showConfirmationModal.value = false;
  actionToConfirm.value = null; // Limpa a ação guardada
}


// [1] --- NOVO: Estado para categoria no formulário ---
const form = reactive({
  rule_name: '',
  trigger_type: '',
  trigger_step_template_id: '',
  trigger_delay_days: null as number | null,
  action_type: '',
  action_user_id: '',
  action_message: '', // <-- novo campo
  action_notification_target: '',
  action_notification_user_id: '',
  action_notification_message: '',
  is_active: true,
  category: '', // <-- Adicionado
})

function resetForm() {
  form.rule_name = ''
  form.trigger_type = ''
  form.trigger_step_template_id = ''
  form.trigger_delay_days = null
  form.action_type = ''
  form.action_user_id = ''
  form.action_message = '' // <-- novo campo
  form.action_notification_target = ''
  form.action_notification_user_id = ''
  form.action_notification_message = ''
  form.is_active = true
  form.category = '' // <-- Adicionado
  regraEditadaId.value = null
}

function abrirModalCriar() {
  resetForm()
  editandoRegra.value = false
  showModal.value = true
}

// [3] --- NOVO: Carregar categoria ao editar regra ---
function abrirModalEditar(regra: Regra) {
  resetForm()
  editandoRegra.value = true
  regraEditadaId.value = regra.id
  form.rule_name = regra.rule_name
  form.trigger_type = regra.trigger_type
  if (regra.trigger_metadata) {
    const meta = regra.trigger_metadata as Record<string, unknown>
    form.trigger_step_template_id = meta.step_template_id as string || ''
    form.trigger_delay_days = meta.delay_days as number || null
  }
  form.action_type = regra.action_type
  if (regra.action_metadata) {
    const meta = regra.action_metadata as Record<string, unknown>
    form.action_user_id = meta.user_id as string || ''
    form.action_message = meta.message as string || '' // <-- novo campo
    form.action_notification_target = meta.target as string || ''
    form.action_notification_user_id = meta.user_id as string || ''
    form.action_notification_message = meta.message as string || ''
  }
  form.is_active = regra.is_active
  form.category = regra.category || '' // <-- Adicionado
  showModal.value = true
}

function fecharModal() {
  showModal.value = false
}

async function fetchRules() {
  const { data } = await supabase.from('automation_rules').select('*').order('id', { ascending: false })
  regras.value = data || []
  // Após buscar regras:
  setTimeout(() => {
    for (const categoria of Object.keys(regrasAgrupadas.value)) {
      if (!(categoria in secoesAbertas.value)) {
        secoesAbertas.value[categoria] = true // padrão: aberto
      }
    }
  }, 0)
}

async function fetchEtapas() {
  const { data } = await supabase.from('step_templates').select('id, name').order('id')
  etapas.value = data || []
}

async function fetchUsuarios() {
  const { data } = await supabase.from('profiles').select('id, nome').order('nome')
  usuarios.value = data || []
}

function descricaoGatilho(regra: Regra): string {
  const metadata = regra.trigger_metadata as Record<string, unknown>;
  if (!metadata) return '-';

  const etapaId = metadata.step_template_id;
  const etapa = etapas.value.find(e => e.id === etapaId);
  const nomeEtapa = etapa ? `'${etapa.name}'` : `ID ${etapaId}`;

  if (regra.trigger_type === 'on_step_entry') {
    return `Ao entrar na etapa ${nomeEtapa}`;
  }
  if (regra.trigger_type === 'after_delay') {
    return `Após ${metadata.delay_days} dias na etapa ${nomeEtapa}`;
  }
  if (regra.trigger_type === 'on_substep_creation') {
    return 'Ao criar uma nova subtarefa';
  }
  if (regra.trigger_type === 'on_substep_completion') {
    return 'Ao concluir uma subtarefa';
  }
  if (regra.trigger_type === 'on_overspending') {
    return 'Ao exceder o valor destinado';
  }
  return 'Gatilho desconhecido';
}

function descricaoAcao(regra: Regra): string {
  const metadata = regra.action_metadata as Record<string, unknown>;
  if (!metadata) return '-';

  if (regra.action_type === 'assign_user') {
    const usuarioId = metadata.user_id;
    const usuario = usuarios.value.find(u => u.id === usuarioId);
    const nomeUsuario = usuario ? `'${usuario.nome}'` : `ID ${usuarioId}`;
    return `Atribuir ao usuário ${nomeUsuario}`
  }
  if (regra.action_type === 'send_notification') {
    const target = metadata.target as string;
    if (target === 'owner') {
      return 'Enviar notificação para o dono do processo';
    }
    if (target === 'user') {
      const userId = metadata.user_id;
      const usuario = usuarios.value.find(u => u.id === userId);
      const nomeUsuario = usuario ? `'${usuario.nome}'` : `ID ${userId}`;
      return `Enviar notificação para o usuário ${nomeUsuario}`;
    }
    if (target === 'substep_creator') {
      return 'Enviar notificação para o criador da subtarefa';
    }
    if (target === 'substep_assignee') {
      return 'Enviar notificação para o responsável da subtarefa';
    }
  }
  return 'Ação desconhecida';
}

async function handleSaveRule() {
  if (!form.rule_name || !form.trigger_type || !form.action_type) {
    saveError.value = 'Por favor, preencha todos os campos obrigatórios.';
    return;
  }

  // Não tipar como Regra, pois id é gerado pelo banco
  const ruleData: Record<string, unknown> = {
    rule_name: form.rule_name,
    trigger_type: form.trigger_type,
    action_type: form.action_type,
    is_active: form.is_active,
    category: form.category,
  };

  if (form.trigger_type === 'on_step_entry') {
    ruleData.trigger_metadata = { step_template_id: form.trigger_step_template_id };
  } else if (form.trigger_type === 'after_delay') {
    ruleData.trigger_metadata = { step_template_id: form.trigger_step_template_id, delay_days: form.trigger_delay_days };
  }

  if (form.action_type === 'assign_user') {
    ruleData.action_metadata = { user_id: form.action_user_id, message: form.action_message };
  } else if (form.action_type === 'send_notification') {
    ruleData.action_metadata = {
      target: form.action_notification_target,
      user_id: form.action_notification_target === 'user' ? form.action_notification_user_id : undefined,
      message: form.action_notification_message,
    };
  }

  if (editandoRegra.value) {
    await supabase.from('automation_rules').update(ruleData).eq('id', regraEditadaId.value);
  } else {
    const { data, error } = await supabase.from('automation_rules').insert(ruleData).select().single();
    if (error) {
      saveError.value = `Erro ao salvar regra: ${error.message}`;
      return;
    }
    regras.value.unshift(data); // Adiciona a nova regra no início da lista
  }
  fecharModal();
  await fetchRules();
  resetForm();
}

function confirmarExclusaoRegra(regraId: number) {
  // Encontra o nome da regra para a mensagem ser mais amigável
  const regra = regras.value.find(r => r.id === regraId);
  const nomeRegra = regra ? regra.rule_name : 'esta regra';

  confirmationTitle.value = 'Confirmar Exclusão de Regra';
  confirmationMessage.value = `Tem certeza que deseja excluir a regra "${nomeRegra}"? Esta ação não pode ser desfeita.`;
  actionToConfirm.value = () => executarExclusaoRegra(regraId); // Guarda a ação
  showConfirmationModal.value = true; // Abre o modal
}

// Nova função que REALMENTE faz o trabalho (sua lógica antiga, sem o confirm)
async function executarExclusaoRegra(id: number) {
  try {
    await supabase.from('automation_rules').delete().eq('id', id);
    await fetchRules();
  } catch (error: any) {
    alert('Erro ao excluir a regra: ' + error.message);
  }
}

async function toggleAtivo(regra: Regra) {
  await supabase.from('automation_rules').update({ is_active: regra.is_active }).eq('id', regra.id)
}

// [5] --- Computed para agrupar regras por categoria ---
const regrasAgrupadas = computed(() => {
  const grupos: Record<string, Regra[]> = {}
  for (const regra of regras.value) {
    const categoria = regra.category && regra.category.trim() ? regra.category : 'Geral'
    if (!grupos[categoria]) grupos[categoria] = []
    grupos[categoria].push(regra)
  }
  return grupos
})

// [6] --- Estado para seções abertas/fechadas ---
const secoesAbertas = ref<{ [key: string]: boolean }>({})
function toggleSecao(categoria: string) {
  secoesAbertas.value[categoria] = !secoesAbertas.value[categoria]
}

const { user, isAdmin } = useAuth()


const processosVisiveis = ref(5)

const processosPaginados = computed(() => {
  return processosListados.value.slice(0, processosVisiveis.value)
})

function mostrarMaisProcessos() {
  processosVisiveis.value += 5
}

onMounted(async () => {
  await fetchRules()
  await fetchEtapas()
  await fetchUsuarios()
  await fetchProcesses() // Inicializa a busca de processos
})
</script>
