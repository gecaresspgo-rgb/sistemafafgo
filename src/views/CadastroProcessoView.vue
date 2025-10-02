<script setup lang="ts">
import Layout from '../components/Layout.vue'
import { ref, onMounted, computed, watch } from 'vue'
import { useDropZone } from '@vueuse/core'
import { supabase } from '../services/supabase'
import { useAuth } from '../composables/useAuth'
import {
  buscarForcasResponsaveis,
  buscarAreasTematicas,
  registrarEventoHistorico,
} from '../services/auth'
import { useFormatters } from '@/composables/useFormatters'


function parseCurrency(value: string): number {
  if (!value) return 0;
  // Remove "R$", espaços, pontos de milhar e troca a vírgula do decimal por ponto.
  const numberString = value.replace(/R\$\s?/, '').replace(/\./g, '').replace(',', '.');
  return parseFloat(numberString) || 0;
}

const anoAtual = new Date().getFullYear()
const anos = Array.from({ length: anoAtual - 2019 + 1 }, (_, i) => 2019 + i)

// Mapeamento de anos para áreas temáticas permitidas
const areasPorAno: { [key: string]: string[] } = {
  '2019': ['ECV', 'VPSP'],
  '2020': ['ECV', 'VPSP'],
  '2021': ['FISP', 'VPSP'],
  '2022': ['FISP', 'VPSP']
  // A partir de 2023, a lógica será tratada no computed
}

// Campos do formulário
const nomeAcao = ref('')
const areaTematica = ref('')
const codigoTransferegov = ref('')
const anoFaf = ref('')
const tipoNatureza = ref('')
const forcaResponsavel = ref('')
const dataCriacao = ref('')
const quantidadeItens = ref('')
const descricaoItens = ref('')
const destinacaoItens = ref('')
const valor = ref('')
const valorRendimentos = ref('')
const valorEconomicidade = ref('')
const descricaoGeral = ref('')
const feedback = ref('')
const loading = ref(false)
const arquivos = ref<{ file: File, description: string }[]>([])
const areaTematicaId = ref('')
const forcaResponsavelId = ref('');
const actionId = ref('');
const areasTematicas = ref<{ id: number; code: string; name: string }[]>([])
const forcasResponsaveis = ref<{ id: number; code: string; name: string }[]>([]);
const acoesDisponiveis = ref<{ id: string; name: string; action_code: string }[]>([]);
const dropZoneRef = ref<HTMLDivElement | null>(null)
const fileUpload = ref<HTMLInputElement | null>(null)
const codigoAcaoPrevisto = ref('.... .. .. .. ...'); // Placeholder
const isLoadingCodigo = ref(false);

// Estado reativo para economicidade
const saldoEconomicidadeDisponivel = ref(0)
const isLoadingSaldo = ref(false)

const economicidadeExcedeSaldo = computed(() => {
    // Se não houver valor, retorna false.
    if (!valorEconomicidade.value) {
        return false;
    }
    // Converte o valor para número antes de comparar
    return Number(valorEconomicidade.value) > saldoEconomicidadeDisponivel.value;
});

const { formatarValor: formatarMoeda } = useFormatters();
const feedbackErroEconomicidade = ref('');

const valorTotal = computed(() => {
  const v1 = parseCurrency(valor.value);
  const v2 = parseCurrency(valorRendimentos.value);
  const v3 = parseCurrency(valorEconomicidade.value);
  return v1 + v2 + v3;
});

function onDrop(files: File[] | null) {
  if (files) {
    arquivos.value = files.map(file => ({ file, description: '' }))
  }
}

const isOver = ref(false); // Declare isOver como uma ref inicializada com false

useDropZone(dropZoneRef, {
  onDrop,
  // Adiciona callbacks para atualizar isOver
  onOver: () => { isOver.value = true; },
  onLeave: () => { isOver.value = false; }
});

const { user, fetchUser } = useAuth()

// Variável computada para filtrar as áreas temáticas
const areasTematicasFiltradas = computed(() => {
  // Se nenhum ano foi selecionado, não mostre nenhuma área
  if (!anoFaf.value) {
    return [];
  }

  const anoSelecionado = Number(anoFaf.value);
  let codigosPermitidos: string[] = [];

  // Define os códigos permitidos com base no ano
  if (anoSelecionado >= 2023) {
    codigosPermitidos = ['EVM', 'MQV', 'RMVI'];
  } else if (areasPorAno[anoSelecionado]) {
    codigosPermitidos = areasPorAno[anoSelecionado];
  }

  // Filtra a lista completa de áreas temáticas (buscada do banco)
  return areasTematicas.value.filter(area => codigosPermitidos.includes(area.code));
});

// Observador para limpar a área temática ao mudar o ano
watch(anoFaf, () => {
  // Limpa o valor selecionado da área temática
  areaTematicaId.value = ''
})

// Watcher para buscar saldo quando campos relevantes mudarem
watch([anoFaf, areaTematicaId, tipoNatureza], () => {
  fetchSaldoEconomicidade()
}, { immediate: true })

// Watcher para validar economicidade quando valor mudar
watch(valorEconomicidade, () => {
  validateEconomicidadeEntrada()
})

async function carregarAcoes() {
  try {
    const { data, error } = await supabase
      .from('actions')
      .select('id, name, action_code')
      .order('action_code');

    if (error) {
      console.error('Erro ao carregar ações:', error);
      return;
    }

    if (data) {
      acoesDisponiveis.value = data;
    }
  } catch (error) {
    console.error('Erro ao carregar ações:', error);
  }
}

const codigoAcaoParcial = computed(() => {
  const ano = anoFaf.value || '....';
  
  // ✨ CORREÇÃO: Removemos o .padStart() para usar apenas 1 dígito
  const area = areaTematicaId.value ? String(areaTematicaId.value) : '..';
  
  // ✨ CORREÇÃO: Alterado para 1 dígito
  const natureza = tipoNatureza.value === 'Custeio' ? '3' : (tipoNatureza.value === 'Investimento' ? '4' : '.');
  
  // ✨ CORREÇÃO: Removemos o .padStart() para usar apenas 1 dígito
  const forca = forcaResponsavelId.value ? String(forcaResponsavelId.value) : '.';
  
  // A função que busca o sequencial ('fetchProximoSequencial') não precisa de alterações.
  return `${ano}.${area}.${natureza}.${forca}.`;
});

async function fetchProximoSequencial() {
  // Pega os valores atuais dos filtros
  const ano = anoFaf.value;
  const areaId = areaTematicaId.value;
  const natureza = tipoNatureza.value;
  const forcaId = forcaResponsavelId.value;

  // Monta a prévia com placeholders se algum campo estiver faltando
  const anoPart = ano || '....';
  const areaPart = areaId ? String(areaId) : '.';
  const naturezaPart = natureza === 'Custeio' ? '3' : (natureza === 'Investimento' ? '4' : '.');
  const forcaPart = forcaId ? String(forcaId) : '.';
  
  // Condição para buscar o sequencial: só busca se os campos chave estiverem preenchidos
  if (!ano || !areaId) {
    codigoAcaoPrevisto.value = `${anoPart}.${areaPart}.${naturezaPart}.${forcaPart}.ERR`;
    return;
  }

  isLoadingCodigo.value = true;
  try {
    const { data: sequencial, error } = await supabase.rpc('prever_codigo_da_acao', {
      p_ano_faf: Number(ano),
      p_thematic_area_id: Number(areaId)
    });

    if (error) throw error;
    
    // Monta o código final completo com o sequencial retornado
    if (sequencial) {
      codigoAcaoPrevisto.value = `${anoPart}.${areaPart}.${naturezaPart}.${forcaPart}.${sequencial}`;
    } else {
      // Se a RPC retornar nulo por algum motivo, mostramos NULL na prévia
      codigoAcaoPrevisto.value = `${anoPart}.${areaPart}.${naturezaPart}.${forcaPart}.NULL`;
    }
    
  } catch (e: any) {
    console.error("Erro ao prever código da ação:", e);
    codigoAcaoPrevisto.value = `${anoPart}.${areaPart}.${naturezaPart}.${forcaPart}.ERR`;
  } finally {
    isLoadingCodigo.value = false;
  }
}
// Chame a função sempre que os campos relevantes mudarem
watch([anoFaf, areaTematicaId, tipoNatureza, forcaResponsavelId], fetchProximoSequencial);


// Função para buscar saldo de economicidade via RPC do Supabase
async function fetchSaldoEconomicidade() {
  feedbackErroEconomicidade.value = '';

  if (!anoFaf.value || !areaTematicaId.value || !tipoNatureza.value) {
    saldoEconomicidadeDisponivel.value = 0;
    return;
  }

  isLoadingSaldo.value = true;
  
  // SEU BLOCO DE CÓDIGO VEM AQUI DENTRO
  try {
    const { data, error } = await supabase.rpc('get_saldo_economicidade_disponivel', {
      p_ano_faf: Number(anoFaf.value),
      p_thematic_area_id: Number(areaTematicaId.value),
      p_tipo_natureza_despesa: tipoNatureza.value,
      p_processo_id_excluir: null
    });

    if (error) {
      console.error('Erro ao buscar saldo de economicidade:', error);
      saldoEconomicidadeDisponivel.value = 0;
      feedbackErroEconomicidade.value = 'Erro ao carregar saldo: ' + error.message;
    } else {
      saldoEconomicidadeDisponivel.value = data || 0;
    }
  } catch (error) {
    console.error('Erro inesperado ao buscar saldo:', error);
    saldoEconomicidadeDisponivel.value = 0;
    feedbackErroEconomicidade.value = 'Erro inesperado ao carregar saldo: ' + (error as Error).message;
  } finally {
    isLoadingSaldo.value = false;
    // Removi validateEconomicidadeEntrada() daqui para evitar loops, é melhor chamá-lo em um watch separado.
  }
}



// Função para validar se o valor de economicidade excede o saldo disponível
function validateEconomicidadeEntrada() {
  // A computada 'economicidadeExcedeSaldo' já fez o cálculo e tem o valor true/false.
  // Nós apenas lemos o resultado dela para definir a mensagem de feedback.
  if (economicidadeExcedeSaldo.value) {
    feedbackErroEconomicidade.value = 'O valor de Economicidade de Entrada excede o saldo disponível. Por favor, ajuste o valor.';
  } else {
    // Se não excede, limpa o feedback de erro específico da economicidade.
    feedbackErroEconomicidade.value = '';
  }
}

onMounted(async () => {
  const { data: areas } = await buscarAreasTematicas()
  if (areas) areasTematicas.value = areas
  const { data: forcas } = await buscarForcasResponsaveis()
  if (forcas) forcasResponsaveis.value = forcas
  await carregarAcoes()
})

async function registrarProcesso() {
  feedback.value = ''
  feedbackErroEconomicidade.value = '';
  loading.value = true

  // Validação final antes de enviar
  validateEconomicidadeEntrada()
  if (economicidadeExcedeSaldo.value) {
    loading.value = false
    return
  }

  let usuario = user.value
  if (!usuario) {
    usuario = await fetchUser()
  }
  if (!usuario) {
    feedback.value = 'Usuário não autenticado.'
    loading.value = false
    return
  }
  // 1. Cadastrar processo
  const { data, error } = await supabase
    .from('processes')
    .insert([
      {
        user_id: usuario.id,
        nome_acao: nomeAcao.value,
        thematic_area_id: Number(areaTematicaId.value), 
        ano_faf: anoFaf.value ? Number(anoFaf.value) : null,
        tipo_natureza_despesa: tipoNatureza.value,
        responsible_force_id: Number(forcaResponsavelId.value),
        valor_inicial_padrao: valor.value ? Number(valor.value) : null,
        data_encaminhamento_aprovacao: dataCriacao.value || null,
        codigo_transferegov: codigoTransferegov.value,
        qtd_itens: quantidadeItens.value ? Number(quantidadeItens.value) : null,
        descricao_itens: descricaoItens.value,
        destinacao_itens: destinacaoItens.value,
        valor_rendimentos: valorRendimentos.value ? Number(valorRendimentos.value) : null,
        valor_economicidade: valorEconomicidade.value ? Number(valorEconomicidade.value) : null,
        valor_total_destinado: valorTotal.value,
        descricao_geral: descricaoGeral.value,
        action_id: actionId.value || null,
      },
    ])
    .select('id')
  if (error || !data || !data[0]?.id) {
    feedback.value = 'Erro ao registrar processo: ' + (error?.message || 'ID não retornado')
    loading.value = false
    return
  }
  const processoId = data[0].id

  // Registrar evento no histórico
  await registrarEventoHistorico(processoId, 'Processo criado.')

  // 2. Upload dos arquivos e vinculação na tabela documents
  let arquivosEnviados = 0
  let arquivosComErro = 0

  console.log('Iniciando upload de arquivos:', arquivos.value.length, 'arquivos')

  for (const item of arquivos.value) {
    try {
      console.log('Processando arquivo:', item.file.name, 'Tamanho:', item.file.size, 'Tipo:', item.file.type)

      // Verificar se o arquivo é válido
      if (!item.file || item.file.size === 0) {
        console.error('Arquivo inválido:', item.file)
        arquivosComErro++
        feedback.value += `\nArquivo inválido: ${item.file.name}`
        continue
      }

      const filePath = `${processoId}/${Date.now()}_${item.file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      console.log('Caminho do arquivo:', filePath)

      // Upload para o storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, item.file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        console.error('Erro no upload:', uploadError)
        arquivosComErro++
        feedback.value += `\nFalha ao enviar ${item.file.name}: ${uploadError.message}`
        continue
      }

      console.log('Upload bem-sucedido:', uploadData)

      // Obter URL pública
      const { data: urlData } = supabase.storage.from('documents').getPublicUrl(filePath)
      const fileUrl = urlData.publicUrl
      console.log('URL pública:', fileUrl)

      // Inserir na tabela documents
      const { data: insertData, error: insertError } = await supabase.from('documents').insert([
        {
          process_id: processoId,
          filename: item.file.name,
          file_url: fileUrl,
          file_size: item.file.size,
          mime_type: item.file.type,
          storage_path: filePath,
          description: item.description,
        },
      ])

      if (insertError) {
        console.error('Erro ao inserir no banco:', insertError)
        arquivosComErro++
        feedback.value += `\nFalha ao registrar ${item.file.name} no banco: ${insertError.message}`

        // Tentar deletar o arquivo do storage se falhou no banco
        await supabase.storage.from('documents').remove([filePath])
      } else {
        console.log('Inserção no banco bem-sucedida:', insertData)
        arquivosEnviados++
      }
    } catch (error) {
      console.error('Erro geral no processamento do arquivo:', error)
      arquivosComErro++
      feedback.value += `\nErro inesperado ao processar ${item.file.name}: ${(error as Error).message}`
    }
  }

  // Feedback final
  if (arquivos.value.length > 0) {
    if (arquivosEnviados > 0) {
      feedback.value = `Processo cadastrado com sucesso! ${arquivosEnviados} arquivo(s) anexado(s).`
    }
    if (arquivosComErro > 0) {
      feedback.value += `\n${arquivosComErro} arquivo(s) com erro no envio.`
    }
  } else {
    feedback.value = 'Processo cadastrado com sucesso!'
  }

  limparFormulario()
  arquivos.value = []
  loading.value = false
}

function limparFormulario() {
  nomeAcao.value = ''
  areaTematica.value = ''
  codigoTransferegov.value = ''
  anoFaf.value = ''
  tipoNatureza.value = ''
  forcaResponsavel.value = ''
  dataCriacao.value = ''
  quantidadeItens.value = ''
  descricaoItens.value = ''
  destinacaoItens.value = ''
  valor.value = ''
  valorRendimentos.value = ''
  valorEconomicidade.value = ''
  descricaoGeral.value = ''
  areaTematicaId.value = ''
  forcaResponsavelId.value = ''
  actionId.value = ''
  feedbackErroEconomicidade.value = ''
}

function handleFileSelected(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    arquivos.value = Array.from(target.files).map(file => ({
      file: file,
      description: ''
    }));
  } else {
    arquivos.value = [];
  }
}
</script>

<template>
  <Layout>
    <div class="max-w-3xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-xl p-8 mt-8">
      <h1 class="text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent mb-6">Cadastro de Novo Processo</h1>
      <form class="flex flex-col gap-6" @submit.prevent="registrarProcesso">
        <div>
          <label class="block text-slate-200 mb-1 font-semibold">Nome da Ação</label>
          <input
            v-model="nomeAcao"
            type="text"
            class="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
            placeholder="Digite o nome da ação"
          />
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-slate-200 mb-1 font-semibold">Ano do FAF</label>
            <select
              v-model="anoFaf"
              class="w-full px-4 py-2 rounded-lg bg-slate-900 text-white border border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400 appearance-none"
              style="background-image: url('data:image/svg+xml;utf8,<svg fill=\'white\' height=\'20\' viewBox=\'0 0 20 20\' width=\'20\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7.293 7.293a1 1 0 011.414 0L10 8.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z\'/></svg>'); background-repeat: no-repeat; background-position: right 0.75rem center; background-size: 1.25em 1.25em;"
            >
              <option value="">Selecione</option>
              <option v-for="ano in anos" :key="ano">{{ ano }}</option>
            </select>
          </div>
          <div>
            <label class="block text-slate-200 mb-1 font-semibold">Processo SEI</label>
            <input
              v-model="codigoTransferegov"
              type="text"
              class="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
              placeholder="Digite o código"
            />
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-slate-200 mb-1 font-semibold">Área Temática</label>
            <select
              v-model="areaTematicaId"
              class="w-full px-4 py-2 rounded-lg bg-slate-900 text-white border border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400 appearance-none"
              style="background-image: url('data:image/svg+xml;utf8,<svg fill=\'white\' height=\'20\' viewBox=\'0 0 20 20\' width=\'20\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7.293 7.293a1 1 0 011.414 0L10 8.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z\'/></svg>'); background-repeat: no-repeat; background-position: right 0.75rem center; background-size: 1.25em 1.25em;"
              :disabled="!anoFaf"
            >
              <option value="">Selecione</option>
              <option v-for="area in areasTematicasFiltradas" :key="area.id" :value="area.id">
                {{ area.code }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-slate-200 mb-1 font-semibold"
              >Tipo de Natureza de Despesa</label
            >
            <select
              v-model="tipoNatureza"
              class="w-full px-4 py-2 rounded-lg bg-slate-900 text-white border border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400 appearance-none"
              style="background-image: url('data:image/svg+xml;utf8,<svg fill=\'white\' height=\'20\' viewBox=\'0 0 20 20\' width=\'20\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7.293 7.293a1 1 0 011.414 0L10 8.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z\'/></svg>'); background-repeat: no-repeat; background-position: right 0.75rem center; background-size: 1.25em 1.25em;"
            >
              <option value="">Selecione</option>
              <option>Custeio</option>
              <option>Investimento</option>
            </select>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-slate-200 mb-1 font-semibold">Força Responsável</label>
            <select
              v-model="forcaResponsavelId"
              class="w-full px-4 py-2 rounded-lg bg-slate-900 text-white border border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400 appearance-none"
              style="background-image: url('data:image/svg+xml;utf8,<svg fill=\'white\' height=\'20\' viewBox=\'0 0 20 20\' width=\'20\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7.293 7.293a1 1 0 011.414 0L10 8.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z\'/></svg>'); background-repeat: no-repeat; background-position: right 0.75rem center; background-size: 1.25em 1.25em;"
            >
              <option value="">Selecione</option>
              <option v-for="forca in forcasResponsaveis" :key="forca.id" :value="forca.id">
                {{ forca.code }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-slate-200 mb-1 font-semibold"
              >Data de Encaminhamento para Aprovação do MJSP</label
            >
            <input
              v-model="dataCriacao"
              type="date"
              class="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>
          
        </div>
        <div>
          <label class="block text-slate-200 mb-1 font-semibold">Vincular à Ação (Opcional)</label>
          <select
            v-model="actionId"
            class="w-full px-4 py-2 rounded-lg bg-slate-900 text-white border border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400 appearance-none"
            style="background-image: url('data:image/svg+xml;utf8,<svg fill=\'white\' height=\'20\' viewBox=\'0 0 20 20\' width=\'20\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7.293 7.293a1 1 0 011.414 0L10 8.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z\'/></svg>'); background-repeat: no-repeat; background-position: right 0.75rem center; background-size: 1.25em 1.25em;"
          >
            <option value="">Nenhuma ação selecionada</option>
            <option v-for="acao in acoesDisponiveis" :key="acao.id" :value="acao.id">
              {{ acao.action_code }} - {{ acao.name }}
            </option>
          </select>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-slate-200 mb-1 font-semibold">Quantidade de Itens</label>
            <input
              v-model="quantidadeItens"
              type="number"
              min="0"
              class="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>
          <div>
            <label class="block text-slate-200 mb-1 font-semibold">Descrição dos Itens</label>
            <textarea
              v-model="descricaoItens"
              rows="2"
              class="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-teal-400"
            ></textarea>
          </div>
        </div>
        <div>
          <label class="block text-slate-200 mb-1 font-semibold">Destinação dos Itens</label>
          <textarea
            v-model="destinacaoItens"
            rows="2"
            class="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-teal-400"
          ></textarea>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-slate-200 mb-1 font-semibold">Valor Inicial Padrão</label>
            <input
              v-model="valor"
              type="text"
              class="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
              placeholder="R$ 0,00"
            />
          </div>
          <div>
            <label class="block text-slate-200 mb-1 font-semibold">Valor de Rendimentos</label>
            <input
              v-model="valorRendimentos"
              type="text"
              class="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
              placeholder="R$ 0,00"
            />
          </div>
          <div>
  <label class="block text-slate-200 mb-1 font-semibold">Valor de Economicidade</label>
  <input
    v-model="valorEconomicidade"
    type="text"
    class="w-full px-4 py-2 rounded-lg bg-white/10 text-white border placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    :class="{'border-red-500': economicidadeExcedeSaldo, 'border-white/20': !economicidadeExcedeSaldo}"
    placeholder="R$ 0,00"
    :disabled="!anoFaf || !areaTematicaId || !tipoNatureza"
  />

  <div class="mt-2 text-sm h-5"> <p v-if="isLoadingSaldo" class="text-teal-300 animate-pulse">
      Calculando saldo disponível...
    </p>
    <div v-else-if="anoFaf && areaTematicaId && tipoNatureza">
      <p v-if="feedbackErroEconomicidade" class="font-semibold text-red-400">
        {{ feedbackErroEconomicidade }}
      </p>
      <p v-else class="text-slate-400">
        Saldo disponível: 
        <span class="font-bold text-teal-400">{{ formatarMoeda(saldoEconomicidadeDisponivel) }}</span>
      </p>
    </div>
    <p v-else class="text-slate-500">
      Preencha Ano, Área e Tipo para ver o saldo.
    </p>
  </div>
  </div>
          <div>
            <label class="block text-slate-200 mb-1 font-semibold"
              >Valor Total Destinado à Ação</label
            >
            <div class="w-full px-4 py-2 rounded-lg bg-slate-800/50 text-slate-300 border border-white/20 font-semibold">
            {{
              valorTotal.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })
            }}
            </div>
          </div>
        </div>
        <div>
          <label class="block text-slate-200 mb-1 font-semibold">Descrição Geral da Ação</label>
          <textarea
            v-model="descricaoGeral"
            rows="4"
            class="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-teal-400"
          ></textarea>
        </div>
        <div>
          <label class="block text-slate-200 mb-1 font-semibold">
            Anexar Nota Técnica ou Documento de Aprovação
          </label>
          <div
            ref="dropZoneRef"
            class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors"
            :class="isOver ? 'border-teal-400 bg-teal-500/10' : 'border-white/20 hover:bg-white/5'"
            @click="fileUpload && fileUpload.click()"
          >
            <div class="flex flex-col items-center justify-center pt-5 pb-6">
              <svg class="w-8 h-8 mb-3 text-slate-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M7 16V4a1 1 0 011-1h8a1 1 0 011 1v12M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              <p class="mb-2 text-sm text-slate-400">
                <span class="font-semibold text-teal-400">Clique para escolher</span> ou arraste e solte os arquivos aqui
              </p>
              <input id="file-upload" ref="fileUpload" type="file" multiple class="hidden" @change="handleFileSelected" />
            </div>
          </div>
          <div v-if="arquivos.length > 0" class="mt-4 space-y-2">
            <div v-for="item in arquivos" :key="item.file.name" class="flex flex-col gap-1">
              <span class="text-sm text-white font-bold">{{ item.file.name }}</span>
              <textarea v-model="item.description" placeholder="Descrição do anexo (opcional)" class="bg-white/10 border border-white/20 rounded px-2 py-1 w-full text-white text-sm"></textarea>
            </div>
        </div>
        </div>
        <div class="flex justify-end">
          <button
            type="submit"
            class="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-500 text-white rounded-lg shadow hover:from-teal-700 hover:to-cyan-600 transition font-bold"
            :disabled="loading || economicidadeExcedeSaldo"
          >
            Registrar Ação
          </button>
        </div>
        <div
          v-if="feedback"
          class="mt-4 text-center font-semibold"
          :class="feedback.includes('sucesso') ? 'text-green-400' : 'text-red-400'"
        >
          {{ feedback }}
        </div>
      </form>
    </div>
  </Layout>
</template>

