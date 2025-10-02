<template>
  <Layout>
    <div class="min-h-screen flex justify-center items-stretch px-8">
      <div class="w-full max-w-7xl mx-auto space-y-8">
        <div class="w-full flex justify-center">
          <div class="w-full bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-lg flex flex-wrap items-center gap-4 px-6 py-3 mb-8">
            <div class="flex flex-col min-w-[180px]">
              <label class="text-slate-200 font-semibold mb-1">Pesquisar por Nome</label>
              <input
                v-model="filtroNome"
                type="text"
                placeholder="Digite o nome da ação"
                class="px-2 py-1 rounded border border-white/20 bg-slate-900 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 w-full"
              />
            </div>
            <div class="flex flex-col min-w-[180px]">
              <label class="text-slate-200 font-semibold mb-1">Código da Ação</label>
              <input
                v-model="filtroCodigo"
                type="text"
                placeholder="Digite o código da ação"
                class="px-2 py-1 rounded border border-white/20 bg-slate-900 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 w-full"
              />
            </div>
            <div class="flex flex-col min-w-[120px]">
              <label class="text-slate-200 font-semibold mb-1">Ano</label>
              <select
                v-model="filtroAno"
                class="px-2 py-1 rounded border border-white/30 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-teal-400 w-full appearance-none"
                style="background-image: url('data:image/svg+xml;utf8,<svg fill=\'white\' height=\'20\' viewBox=\'0 0 20 20\' width=\'20\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7.293 7.293a1 1 0 011.414 0L10 8.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z\'/></svg>'); background-repeat: no-repeat; background-position: right 0.5rem center; background-size: 1.25em 1.25em;"
              >
                <option value="">Todos</option>
                <option v-for="ano in anos" :key="ano" :value="ano">{{ ano }}</option>
              </select>
            </div>
            <div class="flex-1 flex justify-end min-w-[200px]">
              <button
                @click="abrirModalNovaAcao"
                class="px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-500 text-white rounded font-bold shadow hover:from-teal-700 hover:to-cyan-600 transition"
              >
                + Nova Ação
              </button>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between mb-4">
          <h1 class="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
            Controle de Ações
          </h1>
        </div>

        <div v-if="loadingAcoes" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400"></div>
        </div>

        <div v-else class="w-full overflow-x-auto">
          <table class="w-full border-collapse bg-white/5 backdrop-blur-md border border-white/20 shadow-xl rounded-lg">
            <thead>
              <tr class="bg-slate-800 text-left">
                <th class="px-4 py-3 text-slate-300 font-semibold">Código</th>
                <th class="px-4 py-3 text-slate-300 font-semibold">Nome da Ação</th>
                <th class="px-4 py-3 text-slate-300 font-semibold">Ano</th>
                <th class="px-4 py-3 text-slate-300 font-semibold">Processos</th>
                <th class="px-4 py-3 text-slate-300 font-semibold">Taxa Conclusão</th>
                <th class="px-4 py-3 text-slate-300 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="acoesFiltradas.length === 0">
                <td colspan="6" class="px-4 py-6 text-center text-slate-400">
                  {{ loadingAcoes ? 'Carregando...' : 'Nenhuma ação encontrada' }}
                </td>
              </tr>
              <tr
                v-for="acao in acoesFiltradas"
                :key="acao.id"
                class="border-b border-slate-700 hover:bg-slate-800/50 transition-colors"
              >
                <td class="px-4 py-3 text-white font-mono text-sm">{{ acao.action_code }}</td>
                <td class="px-4 py-3 text-white font-medium">{{ acao.name }}</td>
                <td class="px-4 py-3 text-white">{{ acao.year }}</td>
                <td class="px-4 py-3 text-center">
                  <span class="text-white font-semibold">{{ acao.statistics?.total_processes || 0 }}</span>
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <div class="w-16 bg-slate-700 rounded-full h-2">
                      <div
                        class="bg-gradient-to-r from-teal-500 to-cyan-400 h-2 rounded-full"
                        :style="{ width: `${acao.statistics?.completion_rate || 0}%` }"
                      ></div>
                    </div>
                    <span class="text-xs text-slate-400">{{ acao.statistics?.completion_rate || 0 }}%</span>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <div class="flex gap-2">
                    <button @click="visualizarAcao(acao)" class="px-3 py-1 bg-blue-600/20 text-blue-300 rounded text-xs font-semibold hover:bg-blue-600/30 transition">Ver</button>
                    <button @click="editarAcao(acao)" class="px-3 py-1 bg-yellow-600/20 text-yellow-300 rounded text-xs font-semibold hover:bg-yellow-600/30 transition">Editar</button>
                    <button
                      @click="abrirModalConfirmacaoExclusao(acao)"
                      class="p-2 text-slate-400 hover:text-red-500 rounded-full hover:bg-red-500/10 transition"
                      title="Excluir Ação"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="acaoSelecionada" class="mt-8">
            </div>
      </div>
    </div>

    <ActionFormModal v-if="showActionModal" :show="showActionModal" :acao="acaoParaEdicao" :forcas-responsaveis="forcasResponsaveis" :areas-tematicas="areasTematicas" @close="fecharModalAcao" @acao-salva="handleAcaoSalva" />
    <AcaoDetalhesModal
      v-if="acaoSelecionada"
      :show="showAcaoDetalhesModal" :acao="acaoSelecionada"
      @close="fecharDetalhesAcao"
      @acao-atualizada="carregarAcoes"
    />
    <ConfirmationModal v-if="showDeleteActionModal" :show="showDeleteActionModal" title="Confirmar Exclusão" message="Tem certeza que deseja excluir esta ação?" @cancel="fecharModalConfirmacaoExclusao" @confirm="handleExcluirAcaoConfirmado" />
  </Layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { supabase } from '../services/supabase'
import { buscarForcasResponsaveis, buscarAreasTematicas } from '../services/auth'
import Layout from '../components/Layout.vue'
import ActionFormModal from '../components/ActionFormModal.vue'
import AcaoDetalhesModal from '../components/AcaoDetalhesModal.vue'
import ConfirmationModal from '../components/ConfirmationModal.vue'

// Interfaces
// Em ControleDeAcoesView.vue -> <script setup>

// SUBSTITUA SUA INTERFACE 'Action' ATUAL POR ESTA VERSÃO COMPLETA:
interface Action {
  id: string;
  name: string;
  action_code: string;
  year: number;
  expense_nature: string;
  thematic_area_id: number;
  responsible_force_id: number;
  thematic_area?: { id: number; code: string };
  responsible_force?: { id: number; code: string };
  statistics?: {
    total_processes: number;
    completed_processes: number;
    completion_rate: number;
  };
  created_at: string;
  updated_at: string;
  user_id: string;
}

// Estados
const acoes = ref<Action[]>([]);
const loadingAcoes = ref(false);
const forcasResponsaveis = ref<{ id: number; code: string; name: string } []>([]);
const areasTematicas = ref<{ id: number, code: string; name: string } []>([]);
const filtroNome = ref('');
const filtroCodigo = ref('');
const filtroAno = ref('');
const showActionModal = ref(false);
const acaoParaEdicao = ref<Action | null>(null);
const acaoSelecionada = ref<Action | null>(null);
const showAcaoDetalhesModal = ref(false);
const showDeleteActionModal = ref(false);
const acaoParaExcluir = ref<Action | null>(null);

const anoAtual = new Date().getFullYear();
const anos = Array.from({ length: anoAtual - 2019 + 1 }, (_, i) => 2019 + i).reverse();

// Funções
async function carregarAcoes() {
  loadingAcoes.value = true;
  try {
    const { data, error } = await supabase.rpc('get_all_actions_with_stats', {
      p_year: filtroAno.value ? Number(filtroAno.value) : null
    });
    if (error) throw error;
    acoes.value = data?.actions || [];
  } catch (error) {
    console.error('Erro ao carregar ações:', error);
  } finally {
    loadingAcoes.value = false;
  }
}

const acoesFiltradas = computed(() => {
  return acoes.value.filter((acao) => {
    const nomeMatch = !filtroNome.value || acao.name.toLowerCase().includes(filtroNome.value.toLowerCase());
    const codigoMatch = !filtroCodigo.value || acao.action_code.toLowerCase().includes(filtroCodigo.value.toLowerCase());
    return nomeMatch && codigoMatch;
  });
});

function abrirModalNovaAcao() {
  acaoParaEdicao.value = null;
  showActionModal.value = true;
}
function editarAcao(acao: Action) {
  acaoParaEdicao.value = acao;
  showActionModal.value = true;
}
function fecharModalAcao() {
  showActionModal.value = false;
  acaoParaEdicao.value = null;
}
function handleAcaoSalva() {
  fecharModalAcao();
  carregarAcoes();
}


function visualizarAcao(acao: Action) {
  acaoSelecionada.value = acao;
  showAcaoDetalhesModal.value = true;
}
function fecharDetalhesAcao() {
  acaoSelecionada.value = null;
  showAcaoDetalhesModal.value = false;
}

function abrirModalConfirmacaoExclusao(acao: Action) {
  acaoParaExcluir.value = acao;
  showDeleteActionModal.value = true;
}
function fecharModalConfirmacaoExclusao() {
  showDeleteActionModal.value = false;
  acaoParaExcluir.value = null;
}
async function handleExcluirAcaoConfirmado() {
  if (!acaoParaExcluir.value) return;
  const { error } = await supabase.rpc('delete_action_and_unlink_processes', {
    p_action_id: acaoParaExcluir.value.id
  });
  if (error) {
    console.error("Erro ao excluir ação:", error);
    alert("Falha ao excluir a ação.");
  } else {
    carregarAcoes();
    fecharModalConfirmacaoExclusao();
  }
}

watch(filtroAno, carregarAcoes);

onMounted(async () => {
  carregarAcoes();
  const { data: forcas } = await buscarForcasResponsaveis();
  if (forcas) forcasResponsaveis.value = forcas;
  const { data: areas } = await buscarAreasTematicas();
  if (areas) areasTematicas.value = areas;
});
</script>
