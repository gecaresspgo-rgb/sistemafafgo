<template>
  <Layout>
    <div class="min-h-screen flex justify-center items-stretch px-8">
      <div class="w-full max-w-7xl mx-auto space-y-8">
        <!-- Gráficos de Sumário -->
        <div class="flex justify-center flex-wrap gap-8">
          <ProcessosGraficos :processos="processos" />
        </div>
        <!-- Filtros -->
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
              <label class="text-slate-200 font-semibold mb-1">Processo SEI</label>
              <input
                v-model="filtroSEI"
                type="text"
                placeholder="Digite o número SEI"
                class="px-2 py-1 rounded border border-white/20 bg-slate-900 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 w-full"
              />
            </div>
            <div class="flex flex-col min-w-[120px]">
              <label class="text-slate-200 font-semibold mb-1">Ano do FAF</label>
              <select
                v-model="filtroAno"
                class="px-2 py-1 rounded border border-white/30 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-teal-400 w-full appearance-none"
                style="background-image: url('data:image/svg+xml;utf8,<svg fill=\'white\' height=\'20\' viewBox=\'0 0 20 20\' width=\'20\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7.293 7.293a1 1 0 011.414 0L10 8.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z\'/></svg>'); background-repeat: no-repeat; background-position: right 0.5rem center; background-size: 1.25em 1.25em;"
              >
                <option value="">Todos</option>
                <option v-for="ano in anos" :key="ano" :value="ano">{{ ano }}</option>
              </select>
            </div>
            <div class="flex flex-col min-w-[140px]">
              <label class="text-slate-200 font-semibold mb-1">Força</label>
              <select
                v-model="filtroForca"
                class="px-2 py-1 rounded border border-white/30 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-teal-400 w-full appearance-none"
                style="background-image: url('data:image/svg+xml;utf8,<svg fill=\'white\' height=\'20\' viewBox=\'0 0 20 20\' width=\'20\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7.293 7.293a1 1 0 011.414 0L10 8.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z\'/></svg>'); background-repeat: no-repeat; background-position: right 0.5rem center; background-size: 1.25em 1.25em;"
              >
                <option value="">Todas</option>
                <option v-for="forca in forcasResponsaveis" :key="forca.id" :value="forca.id">
                  {{ forca.code }}
                </option>
              </select>
            </div>
            <div class="flex flex-col min-w-[140px]">
              <label class="text-slate-200 font-semibold mb-1">Área Temática</label>
              <select
                v-model="filtroArea"
                class="px-2 py-1 rounded border border-white/30 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-teal-400 w-full appearance-none"
                style="background-image: url('data:image/svg+xml;utf8,<svg fill=\'white\' height=\'20\' viewBox=\'0 0 20 20\' width=\'20\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7.293 7.293a1 1 0 011.414 0L10 8.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z\'/></svg>'); background-repeat: no-repeat; background-position: right 0.5rem center; background-size: 1.25em 1.25em;"
              >
                <option value="">Todas</option>
                <option v-for="area in areasTematicas" :key="area.id" :value="area.id">
                  {{ area.code }}
                </option>
              </select>
            </div>
            <div class="flex flex-col min-w-[160px]">
              <label class="text-slate-200 font-semibold mb-1">Data de Criação</label>
              <input
                v-model="filtroData"
                type="date"
                class="px-2 py-1 rounded border border-white/20 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-teal-400 w-full [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:sepia [&::-webkit-calendar-picker-indicator]:saturate-[5] [&::-webkit-calendar-picker-indicator]:hue-rotate-[140deg] [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&:focus::-webkit-calendar-picker-indicator]:invert-[70%] [&:focus::-webkit-calendar-picker-indicator]:sepia [&:focus::-webkit-calendar-picker-indicator]:saturate-[8] [&:focus::-webkit-calendar-picker-indicator]:hue-rotate-[140deg] [&:focus::-webkit-calendar-picker-indicator]:brightness-150 placeholder:text-slate-400 [&::-webkit-input-placeholder]:text-slate-400 [&::-webkit-input-placeholder]:opacity-100 [&::-moz-placeholder]:text-slate-400 [&::-moz-placeholder]:opacity-100 [&::-ms-input-placeholder]:text-slate-400 [&::-ms-input-placeholder]:opacity-100"
              />
            </div>
            <div class="flex items-center gap-2 min-w-[170px] mt-5 md:mt-0">
              <input
                id="chkConcluidos"
                v-model="mostrarConcluidos"
                type="checkbox"
                class="accent-teal-500 w-5 h-5 border-white/20 bg-white/10"
              />
              <label for="chkConcluidos" class="text-slate-200 font-semibold select-none"
                >Mostrar Concluídos</label
              >
            </div>
            <div class="flex-1 flex justify-end min-w-[200px]">
              <router-link
                to="/processos/novo"
                class="px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-500 text-white rounded font-bold shadow hover:from-teal-700 hover:to-cyan-600 transition"
              >
                + Novo Processo
              </router-link>
            </div>
          </div>
        </div>
        <!-- Título -->
        <div class="flex items-center justify-between mb-4">
          <h1 class="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">Acompanhamento de Processos</h1>
          <div class="flex bg-slate-800 rounded-lg p-1">
            <button
              @click="viewMode = 'cards'"
              :class="[viewMode === 'cards' ? 'bg-gradient-to-r from-teal-600 to-cyan-500 text-white' : 'text-slate-300 hover:text-white', 'px-3 py-1 rounded-md font-medium transition-all']"
            >
              <span class="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Cards
              </span>
            </button>
            <button
              @click="viewMode = 'table'"
              :class="[viewMode === 'table' ? 'bg-gradient-to-r from-teal-600 to-cyan-500 text-white' : 'text-slate-300 hover:text-white', 'px-3 py-1 rounded-md font-medium transition-all']"
            >
              <span class="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Tabela
              </span>
            </button>
          </div>
        </div>
        <!-- Cards de Processo -->
          <div class="flex justify-center w-full">
            <div v-if="viewMode === 'cards'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <ProcessoCard
                v-for="processo in processosFiltrados"
                :key="processo.id"
                :processo="processo"
                @atualizar-processo="atualizarProcesso"
                @abrir-detalhes="(processo) => abrirModalProcesso(processo, 'detalhes')"
                @mostrar-etapas="(processo) => abrirModalProcesso(processo, 'etapas')"
              />
            </div>
            <!-- Visualização em Tabela -->
            <div v-else-if="viewMode === 'table'" class="w-full overflow-x-auto">
              <table class="w-full border-collapse">
                <thead>
                  <tr class="bg-slate-800 text-left">
                    
                    <th class="px-4 py-3 text-slate-300 font-semibold">Código da Ação</th> <th class="px-4 py-3 text-slate-300 font-semibold">Processo SEI</th>
                    <th class="px-4 py-3 text-slate-300 font-semibold">Nome da Ação</th>
                    <th class="px-4 py-3 text-slate-300 font-semibold">Força Responsável</th>
                    <th class="px-4 py-3 text-slate-300 font-semibold">Área Temática</th>
                    <th class="px-4 py-3 text-slate-300 font-semibold">Status</th>
                    <th class="px-4 py-3 text-slate-300 font-semibold">Progresso</th>
                    <th class="px-4 py-3 text-slate-300 font-semibold">Valor Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="processosFiltrados.length === 0">
                    <td colspan="7" class="px-4 py-6 text-center text-slate-400">Nenhum processo encontrado</td>
                  </tr>
                  <tr
                    v-for="processo in processosFiltrados"
                    :key="processo.id"
                    class="border-b border-slate-700 hover:bg-slate-800/50 cursor-pointer transition-colors"
                    @click="abrirModalProcesso(processo)"
                  >
                    <td class="px-4 py-3 text-white font-mono">{{ processo.codigo_da_acao || 'N/A' }}</td> <td class="px-4 py-3 text-white">{{ processo.codigo_transferegov || 'Não definido' }}</td>
                    <td class="px-4 py-3 text-white font-medium">{{ processo.nome_acao }}</td>
                    <td class="px-4 py-3">
                      <span class="bg-blue-600/20 text-blue-300 px-2 py-1 rounded-full text-xs font-semibold">
                        {{ processo.forca_code || 'Não definido' }}
                      </span>
                    </td>
                    <td class="px-4 py-3">
                      <span class="bg-teal-600/20 text-teal-300 px-2 py-1 rounded-full text-xs font-semibold">
                        {{ processo.area_code || 'Não definido' }}
                      </span>
                    </td>
                    <td class="px-4 py-3">
                      <span
                        :class="{
                          'bg-green-600/20 text-green-300': processo.status === 'Concluído',
                          'bg-yellow-600/20 text-yellow-300': processo.status === 'Em andamento',
                          'bg-slate-600/20 text-slate-300': !processo.status
                        }"
                        class="px-2 py-1 rounded-full text-xs font-semibold"
                      >
                        {{ processo.status || 'Não iniciado' }}
                      </span>
                    </td>
                    <td class="px-4 py-3">
                      <div class="w-full bg-slate-700 rounded-full h-2.5 mb-1">
                        <div
                          class="bg-gradient-to-r from-teal-500 to-cyan-400 h-2.5 rounded-full"
                          :style="{ width: `${processo.progresso || 0}%` }"
                        ></div>
                      </div>
                      <div class="text-xs text-slate-400">{{ processo.progresso || 0 }}%</div>
                    </td>
                    <td class="px-4 py-3 font-medium text-teal-400">
                      {{ processo.valor_total_destinado ? processo.valor_total_destinado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
      </div>
    </div>

    <!-- Modal de Detalhes do Processo -->
    <ProcessoDetalhesModal
  v-if="processoSelecionado"
  :show="showDetalhesModal"
  :processo="processoSelecionado"
  @close="fecharModalDetalhes"
  @atualizar-processo="atualizarProcesso"
  @switch-to-etapas="handleSwitchToEtapas"
  @switch-to-registros="handleSwitchToRegistros"
  :isAdmin="isAdmin"
  @status-changed="carregarProcessos"
/>

    <!-- Modal de Etapas do Processo -->
    <ProcessoEtapasModal
      v-if="processoSelecionado"
      :show="showEtapasModal"
      :processo="processoSelecionado"
      @close="fecharModalEtapas"
      @atualizar-processo="atualizarProcesso"
      @switch-to-detalhes="handleSwitchToDetalhes"
      @switch-to-registros="handleSwitchToRegistros"
    />

    <!-- Modal de Registros do Processo -->
    <ProcessoRegistrosModal
      v-if="processoSelecionado"
      :show="showRegistrosModal"
      :processo="processoSelecionado"
      @close="fecharModalRegistros"
      @atualizar-processo="atualizarProcesso"
      @switch-to-detalhes="switchToDetalhesFromRegistros"
      @switch-to-etapas="switchToEtapasFromRegistros"
    />


  </Layout>
</template>

<script setup lang="ts">
import Layout from '../components/Layout.vue'
import ProcessoCard from '../components/ProcessoCard.vue'
import ProcessosGraficos from '../components/ProcessosGraficos.vue'
import ProcessoDetalhesModal from '../components/ProcessoDetalhesModal.vue'
import ProcessoEtapasModal from '../components/ProcessoEtapasModal.vue'
import ProcessoRegistrosModal from '../components/ProcessoRegistrosModal.vue'
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '../services/supabase'
import { useAuth } from '../composables/useAuth'
import {
  buscarForcasResponsaveis,
  buscarAreasTematicas,
  buscarEtapasDoProcesso,
} from '../services/auth'
import { useDashboardFilters } from '../composables/useDashboardFilters'

const route = useRoute()
const router = useRouter()

function handleRouteChange(query) {
  const processoId = query.processo_id as string | null;
  const modalType = query.modal_type as string | null;

  // Se a URL tem um processo_id
  if (processoId) {
    // Garante que os processos estejam carregados antes de procurar
    if (processos.value.length > 0) {
      const processoParaAbrir = processos.value.find(p => p.id === processoId);
      if (processoParaAbrir) {
        // Se o modal correspondente não estiver aberto, abra-o
        if ((modalType === 'etapas' && !showEtapasModal.value) || (modalType !== 'etapas' && !showDetalhesModal.value)) {
          abrirModalProcesso(processoParaAbrir, modalType || 'detalhes');
        }
      } else {
        // Processo não encontrado, limpa a URL para evitar inconsistência
        router.push({ query: {} });
      }
    }
  } else {
    // Se a URL foi limpa (sem processo_id), garante que os modais estejam fechados
    showDetalhesModal.value = false;
    showEtapasModal.value = false;
    showRegistrosModal.value = false;
  }
}

// Use o watch para "escutar" as mudanças na query da URL
watch(() => route.query, (newQuery) => {
  handleRouteChange(newQuery);
});



// Opções de Ano do FAF (igual CadastroProcessoView.vue)
const anoAtual = new Date().getFullYear()
const anos = Array.from({ length: anoAtual - 2019 + 1 }, (_, i) => 2019 + i)

// Modo de visualização (cards ou tabela)
const viewMode = ref('cards')

const forcasResponsaveis = ref<{ id: number; code: string; name: string }[]>([])
const areasTematicas = ref<{ id: number; code: string; name: string }[]>([])
const filtroNome = ref('')
const filtroSEI = ref('')
const filtroAno = ref('')
const filtroForca = ref('')
const filtroArea = ref('')
const filtroData = ref('')
const mostrarConcluidos = ref(true)

interface Processo {
  id: string
  user_id: string
  codigo_da_acao?: string
  area_tematica?: string
  ano_faf?: number
  tipo_natureza_despesa?: string
  forca_responsavel?: string
  valor_inicial_padrao?: number
  data_encaminhamento_aprovacao?: string
  codigo_transferegov?: string
  qtd_itens?: number
  descricao_itens?: string
  destinacao_itens?: string
  valor_rendimentos?: number
  valor_economicidade?: number
  valor_total_destinado?: number
  descricao_geral?: string
  nome_acao?: string
  status: string
  etapaAtual: number
  totalEtapas: number
  progresso?: number
  sei?: string
  event_type?: string
  etapaAtualNome?: string

  forca_code: string
  area_code: string
  responsible_forces?: { id: number; code: string }
  thematic_areas?: { id: number; code: string }
  is_favorited?: boolean
}
const { user, fetchUser, isAdmin } = useAuth();
const processos = ref<Processo[]>([])
const loadingProcessos = ref(false)

const totalProcessos = ref(0)
const processosConcluidos = ref(0)
const processosEmAndamento = ref(0)
const processosCancelados = ref(0)

async function fetchDashboardCounts() {
  const { data, error } = await supabase.rpc('get_status_counts');

  if(error) {
    console.error("Erro ao buscar contagens do painel:", error)
    return;
  }

  const counts = data.reduce((acc, current) => {
    acc[current.status] = current.count;
    return acc;
  }, {})

   totalProcessos.value = (counts['Em Andamento'] || 0) + (counts['Concluído'] || 0) + (counts['Cancelado'] || 0);
   processosConcluidos.value = counts['Concluído'] || 0;
   processosEmAndamento.value = counts['Em Andamento'] || 0;
   processosCancelados.value = counts['Cancelado'] || 0;
}

async function carregarProcessos() {
  loadingProcessos.value = true;
  let usuario = user.value;
  if (!usuario) {
    usuario = await fetchUser();
  }
  if (!usuario) {
    processos.value = [];
    loadingProcessos.value = false;
    return;
  }

  // 1. Buscar favoritos do usuário
  const { data: favorites } = await supabase
    .from('user_favorites')
    .select('process_id')
    .eq('user_id', usuario.id);
  const favoriteIds = new Set((favorites || []).map(f => f.process_id));

  // 2. CHAMADA ÚNICA E OTIMIZADA para buscar todos os dados necessários
  const { data, error } = await supabase
    .from('processes')
    .select(`
      *, 
      codigo_da_acao, 
      responsible_forces (id, code), 
      thematic_areas (id, code),
      process_steps (
        is_current,
        step_templates (name)
      )
    `)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar processos:', error);
    processos.value = [];
    loadingProcessos.value = false;
    return;
  }

  if (data) {
    // 3. Mapeamento dos dados já completos, sem necessidade de buscas extras
    processos.value = data.map(proc => {
      const etapaAtual = proc.process_steps.find(step => step.is_current);
      const totalEtapas = proc.process_steps.length;
      const etapaAtualIndex = etapaAtual ? proc.process_steps.findIndex(s => s.is_current) : -1;
      
      return {
        ...proc,
        forca_code: proc.responsible_forces?.code || 'N/A',
        area_code: proc.thematic_areas?.code || 'N/A',
        etapaAtualNome: etapaAtual?.step_templates?.name || 'Não definida',
        is_favorited: favoriteIds.has(proc.id),
        // Lógica de progresso baseada nos dados já buscados
        progresso: etapaAtualIndex >= 0 && totalEtapas > 1 
          ? Math.round((etapaAtualIndex / (totalEtapas - 1)) * 100) 
          : (proc.status === 'Concluído' ? 100 : 0),
        etapaAtual: etapaAtualIndex,
        totalEtapas: totalEtapas
      };
    });
  } else {
    processos.value = [];
  }
  loadingProcessos.value = false;
}



const { filtroForcaId, limparFiltros } = useDashboardFilters()

onMounted(async () => {
  // Se vier filtro global do dashboard, aplicar e limpar
  if (filtroForcaId.value) {
    filtroForca.value = String(filtroForcaId.value)
    limparFiltros()
  }
  await carregarProcessos()
  await fetchDashboardCounts();
  const { data: forcas } = await buscarForcasResponsaveis()
  if (forcas) forcasResponsaveis.value = forcas
  const { data: areas } = await buscarAreasTematicas()
  if (areas) areasTematicas.value = areas

  // Verificar se há um processo_id na query string para abrir o modal
  handleRouteChange(route.query);
})

// Referência para o processo selecionado e controle dos modais
const processoSelecionado = ref<Processo | null>(null)
const showDetalhesModal = ref(false)
const showEtapasModal = ref(false)
const showRegistrosModal = ref(false)

// Função para abrir o modal de detalhes do processo
function abrirModalProcesso(processo: Processo, tipo: string = 'detalhes') {
  processoSelecionado.value = processo
  if (tipo === 'etapas') {
    showEtapasModal.value = true
  } else if (tipo === 'registros') {
    showRegistrosModal.value = true
  } else {
    showDetalhesModal.value = true
  }
  router.push({ query: { processo_id: processo.id, modal_type: tipo } })
}
// Função para fechar o modal de detalhes
function fecharModalDetalhes() {
  showDetalhesModal.value = false
  router.push({ query: {} });
}

// Função para fechar o modal de etapas
function fecharModalEtapas() {
  showEtapasModal.value = false
  router.push({ query: {} });
}

//Função para fechar o modal de registros
function fecharModalRegistros() {
  showRegistrosModal.value = false
  router.push({ query: {} });
}


// Função para alternar do modal de detalhes para o modal de etapas
function handleSwitchToEtapas() {
  showDetalhesModal.value = false
  showRegistrosModal.value = false
  showEtapasModal.value = true
  if (processoSelecionado.value) {
    router.push({
      query: {
        processo_id: processoSelecionado.value.id,
        modal_type: 'etapas'
      }
    })
  }
}

// Função para alternar do modal de etapas para o modal de detalhes
function handleSwitchToDetalhes() {
  showEtapasModal.value = false
  showRegistrosModal.value = false
  showDetalhesModal.value = true
  if (processoSelecionado.value) {
    router.push({
      query: {
        processo_id: processoSelecionado.value.id,
        modal_type: 'detalhes'
      }
    })
  }
}

// Função para alternar para o modal de registros
function handleSwitchToRegistros() {
  showDetalhesModal.value = false
  showEtapasModal.value = false
  showRegistrosModal.value = true
  if (processoSelecionado.value) {
    router.push({
      query: {
        processo_id: processoSelecionado.value.id,
        modal_type: 'registros'
      }
    })
  }
}

function switchToDetalhesFromRegistros() {
  handleSwitchToDetalhes();
}

function switchToEtapasFromRegistros() {
  handleSwitchToEtapas();
}

// Função para atualizar o processo após edição
// VERSÃO CORRIGIDA E REATIVA ✨
async function atualizarProcesso() {
  console.log("Atualizando a lista de processos após uma alteração...");
  
  // Simplesmente chama a função principal para recarregar todos os processos.
  // Isso garante que você sempre terá os dados mais recentes e corretos do banco,
  // incluindo o 'valor_total_destinado' que foi recalculado pela trigger.
  await carregarProcessos();
  
  // ✨ BÔNUS: Se um modal estava aberto, atualizamos seus dados também.
  if (processoSelecionado.value) {
    const processoAtualizadoDaLista = processos.value.find(p => p.id === processoSelecionado.value.id);
    if (processoAtualizadoDaLista) {
      processoSelecionado.value = processoAtualizadoDaLista;
    }
  }
}

const processosFiltrados = computed(() => {
  return processos.value.filter((proc) => {
    const nomeMatch = (proc.nome_acao || proc.area_code || '')
      .toLowerCase()
      .includes(filtroNome.value.toLowerCase())
    const seiMatch = !filtroSEI.value || (proc.codigo_transferegov || '').toLowerCase().includes(filtroSEI.value.toLowerCase())
    const anoMatch = !filtroAno.value || proc.ano_faf === Number(filtroAno.value)
    const forcaMatch =
      !filtroForca.value || proc.responsible_forces?.id === Number(filtroForca.value)
    const areaMatch = !filtroArea.value || proc.thematic_areas?.id === Number(filtroArea.value)
    const dataMatch =
      !filtroData.value ||
      (proc.data_encaminhamento_aprovacao &&
        proc.data_encaminhamento_aprovacao === filtroData.value)
    const statusMatch = mostrarConcluidos.value ? true : (proc.status !== 'Concluído' && proc.status !== 'Cancelado');
    return nomeMatch && seiMatch && anoMatch && forcaMatch && areaMatch && dataMatch && statusMatch
  })
})
</script>
