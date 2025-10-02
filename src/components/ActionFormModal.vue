<template>
  <!-- Modal de Formulário de Ação -->
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
    @click.self="fecharModal"
  >
    <div
      class="bg-gradient-to-br from-slate-900/95 to-blue-900/95 backdrop-blur-md border border-white/20 text-white rounded-xl shadow-2xl p-8 max-w-2xl w-full relative max-h-[90vh] overflow-y-auto"
    >
      <!-- Cabeçalho do Modal -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
          {{ isEditing ? 'Editar Ação' : 'Nova Ação' }}
        </h2>
        <button
          @click="fecharModal"
          class="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-red-400 transition"
          title="Fechar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Formulário -->
      <form @submit.prevent="salvarAcao" class="space-y-6">
        <!-- Nome da Ação -->
        <div>
          <label class="block text-slate-300 font-semibold mb-2">Nome da Ação *</label>
          <input
            v-model="formData.name"
            type="text"
            required
            placeholder="Digite o nome da ação"
            class="w-full px-4 py-3 rounded-lg border border-white/20 bg-slate-900/50 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
          />
        </div>

        <!-- Ano -->
        <div>
          <label class="block text-slate-300 font-semibold mb-2">Ano *</label>
          <select
            v-model="formData.year"
            required
            class="w-full px-4 py-3 rounded-lg border border-white/20 bg-slate-900/50 text-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent appearance-none"
            style="background-image: url('data:image/svg+xml;utf8,<svg fill=\'white\' height=\'20\' viewBox=\'0 0 20 20\' width=\'20\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7.293 7.293a1 1 0 011.414 0L10 8.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z\'/></svg>'); background-repeat: no-repeat; background-position: right 1rem center; background-size: 1.25em 1.25em;"
          >
            <option value="">Selecione o ano</option>
            <option v-for="ano in anos" :key="ano" :value="ano">{{ ano }}</option>
          </select>
        </div>

        <!-- Área Temática -->
        <div>
          <label class="block text-slate-300 font-semibold mb-2">Área Temática *</label>
          <select
            v-model="formData.thematic_area_id"
            required
            class="w-full px-4 py-3 rounded-lg border border-white/20 bg-slate-900/50 text-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent appearance-none"
            style="background-image: url('data:image/svg+xml;utf8,<svg fill=\'white\' height=\'20\' viewBox=\'0 0 20 20\' width=\'20\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7.293 7.293a1 1 0 011.414 0L10 8.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z\'/></svg>'); background-repeat: no-repeat; background-position: right 1rem center; background-size: 1.25em 1.25em;"
          >
            <option value="">Selecione a área temática</option>
            <option v-for="area in areasTematicas" :key="area.id" :value="area.id">
              {{ area.code }} - {{ area.name }}
            </option>
          </select>
        </div>

        <!-- Força Responsável -->
        <div>
          <label class="block text-slate-300 font-semibold mb-2">Força Responsável *</label>
          <select
            v-model="formData.responsible_force_id"
            required
            class="w-full px-4 py-3 rounded-lg border border-white/20 bg-slate-900/50 text-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent appearance-none"
            style="background-image: url('data:image/svg+xml;utf8,<svg fill=\'white\' height=\'20\' viewBox=\'0 0 20 20\' width=\'20\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7.293 7.293a1 1 0 011.414 0L10 8.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z\'/></svg>'); background-repeat: no-repeat; background-position: right 1rem center; background-size: 1.25em 1.25em;"
          >
            <option value="">Selecione a força responsável</option>
            <option v-for="forca in forcasResponsaveis" :key="forca.id" :value="forca.id">
              {{ forca.code }} - {{ forca.name }}
            </option>
          </select>
        </div>

        <!-- Natureza da Despesa -->
         <div>
           <label class="block text-slate-300 font-semibold mb-2">Natureza da Despesa *</label>
           <select
             v-model="formData.expense_nature"
             required
             class="w-full px-4 py-3 rounded-lg border border-white/20 bg-slate-900/50 text-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent appearance-none"
             style="background-image: url('data:image/svg+xml;utf8,<svg fill=\'white\' height=\'20\' viewBox=\'0 0 20 20\' width=\'20\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7.293 7.293a1 1 0 011.414 0L10 8.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z\'/></svg>'); background-repeat: no-repeat; background-position: right 1rem center; background-size: 1.25em 1.25em;"
           >
             <option value="">Selecione a natureza da despesa</option>
             <option value="Custeio">Custeio</option>
             <option value="Investimento">Investimento</option>
           </select>
        </div>
        <div v-if="!isEditing">
          <label class="block text-slate-300 font-semibold mb-2">Sequencial do Código *</label>
          <input
            v-model.number="formData.sequential_number"
            type="number"
            required
            placeholder="Ex: 1"
            min="0"
            max="999"
            class="w-full px-4 py-3 rounded-lg border border-white/20 bg-slate-900/50 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
          />
          <p class="text-xs text-slate-400 mt-1">Os 3 últimos dígitos do código da ação (será formatado como 001, 002, etc.).</p>
        </div>
        
        <div v-if="!isEditing" class="mt-2">
          <label class="block text-slate-400 font-semibold text-sm mb-1">Prévia do Código</label>
          <div class="w-full px-4 py-3 rounded-lg bg-slate-800/50 text-slate-300 border border-white/20 font-mono font-semibold">
            {{ codigoAcaoPreview }}
          </div>
        </div>

        <!-- Código da Ação (somente leitura se editando) -->
        <div v-if="isEditing">
          <label class="block text-slate-300 font-semibold mb-2">Código da Ação</label>
          <input
            :value="acao?.action_code"
            type="text"
            readonly
            class="w-full px-4 py-3 rounded-lg border border-white/20 bg-slate-700/50 text-slate-400 cursor-not-allowed"
          />
          <p class="text-xs text-slate-400 mt-1">O código da ação não pode ser alterado após a criação.</p>
        </div>

        <!-- Mensagem de Erro -->
        <div v-if="erro" class="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="text-red-400 font-medium">{{ erro }}</span>
          </div>
        </div>

        <!-- Mensagem de Sucesso -->
        <div v-if="sucesso" class="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span class="text-green-400 font-medium">{{ sucesso }}</span>
          </div>
        </div>

        <!-- Botões de Ação -->
        <div class="flex gap-4 pt-4">
          <button
            type="button"
            @click="fecharModal"
            class="flex-1 px-6 py-3 border border-white/20 text-slate-300 rounded-lg font-semibold hover:bg-white/10 transition"
            :disabled="salvando"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-500 text-white rounded-lg font-semibold hover:from-teal-700 hover:to-cyan-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            :disabled="salvando || !formValido"
          >
            <svg v-if="salvando" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ salvando ? 'Salvando...' : (isEditing ? 'Atualizar Ação' : 'Criar Ação') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { supabase } from '../services/supabase'
import { useAuth } from '../composables/useAuth'

// Interfaces
interface Action {
  id: string;
  name: string;
  action_code: string;
  year: number;
  expense_nature: string;
  thematic_area_id: number;
  responsible_force_id: number;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface FormData {
  name: string
  year: number | string
  thematic_area_id: number | string
  expense_nature: string
  responsible_force_id: number | string
  sequential_number: number // MODIFICADO
}

// Props
const props = defineProps<{
  show: boolean
  acao?: Action | null
  forcasResponsaveis: Array<{ id: number; code: string; name: string }>
  areasTematicas: Array<{ id: number; code: string; name: string }>
}>()

// Emits
const emit = defineEmits<{
  close: []
  'acao-salva': []
}>()

// Composables
const { user, fetchUser } = useAuth()

// Estados
const salvando = ref(false)
const erro = ref('')
const sucesso = ref('')

// Opções de Ano
const anoAtual = new Date().getFullYear()
const anos = Array.from({ length: anoAtual - 2019 + 1 }, (_, i) => 2019 + i).reverse()

// Dados do formulário
const formData = ref<FormData>({
  name: '',
  year: '',
  thematic_area_id: '',
  expense_nature: '',
  responsible_force_id: '',
  sequential_number: 1, // MODIFICADO
})

// Computed
const isEditing = computed(() => !!props.acao)

const formValido = computed(() => {
  return (
    formData.value.name.trim() !== '' &&
    formData.value.year !== '' &&
    formData.value.thematic_area_id !== '' &&
    formData.value.expense_nature !== '' &&
    formData.value.responsible_force_id !== ''
  )
})



// Funções
function resetForm() {
  formData.value = {
    name: '',
    year: '',
    thematic_area_id: '',
    expense_nature: '',
    responsible_force_id: '',
    sequential_number: 1, // MODIFICADO
  }
  erro.value = ''
  sucesso.value = ''
}

function preencherForm() {
  if (props.acao) {
    formData.value = {
      name: props.acao.name,
      year: props.acao.year,
      thematic_area_id: props.acao.thematic_area_id,
      expense_nature: props.acao.expense_nature,
      responsible_force_id: props.acao.responsible_force_id,
      sequential_number: 1, // Mantém o padrão, pois não é editável na sua UI atual
    }
  }
}

const codigoAcaoPreview = computed(() => {

  const ano = formData.value.year;
  const areaId = formData.value.thematic_area_id;
  const natureza = formData.value.expense_nature;
  const forcaId = formData.value.responsible_force_id;
  const sequencial = formData.value.sequential_number;

  const partA = ano ? String(ano).slice(-2) : 'XX';

  const partB = areaId || 'X';

  let partC = 'X';
  if (natureza === 'Custeio') {
    partC = '3';
  } else if (natureza === 'Investimento') {
    partC = '4';
  }

  const partD = '1';

  const partE = forcaId || 'X';

  const partF = String(sequencial || 0).padStart(3, '0');

  return `${partA}.${partB}.${partC}.${partD}.${partE}.${partF}`
})

function fecharModal() {
  // Apenas emite o evento, o watcher cuidará do reset
  emit('close')
}



async function salvarAcao() {
  if (!formValido.value) {
    erro.value = 'Por favor, preencha todos os campos obrigatórios.'
    return
  }

  salvando.value = true
  erro.value = ''
  sucesso.value = ''

  try {
    let usuario = user.value
    if (!usuario) {
      const { data } = await supabase.auth.getUser();
      usuario = data.user
    }
    if (!usuario) {
      erro.value = 'Usuário não autenticado.'
      throw new Error(erro.value)
    }

    if (isEditing.value && props.acao) {
      // Atualizar ação existente (lógica mantida)
      const { error } = await supabase
        .from('actions')
        .update({
          name: formData.value.name.trim(),
          year: Number(formData.value.year),
          thematic_area_id: Number(formData.value.thematic_area_id),
          expense_nature: formData.value.expense_nature,
          responsible_force_id: Number(formData.value.responsible_force_id),
          updated_at: new Date().toISOString()
        })
        .eq('id', props.acao.id)

      if (error) throw error

      sucesso.value = 'Ação atualizada com sucesso!'
    } else {
      // MODIFICADO: Criar nova ação usando a nova função RPC
      const { data, error } = await supabase.rpc('create_or_update_action', {
        p_id: null,
        p_name: formData.value.name.trim(),
        p_year: Number(formData.value.year),
        p_thematic_area_id: Number(formData.value.thematic_area_id),
        p_expense_nature: formData.value.expense_nature,
        p_responsible_force_id: Number(formData.value.responsible_force_id),
        p_sequential_number: formData.value.sequential_number,
        p_user_id: usuario.id
      })

      if (error) throw error
      
      sucesso.value = `Ação criada com sucesso! Código: ${data.action_code}`
    }

    setTimeout(() => {
      emit('acao-salva')
      // fecharModal() será chamado pelo componente pai ao receber 'acao-salva'
    }, 1500)

  } catch (err: any) {
    console.error('Erro ao salvar ação:', err)
    erro.value = err.message || 'Ocorreu uma falha ao salvar a ação.'
  } finally {
    salvando.value = false
  }
}

// Watchers
watch(() => props.show, (newVal) => {
  if (newVal) {
    if (isEditing.value && props.acao) {
      preencherForm()
    } else {
      resetForm()
    }
  }
})

// Lifecycle
onMounted(() => {
  if (props.show && isEditing.value) {
    preencherForm()
  }
})
</script>
