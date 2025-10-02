<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { supabase } from '../services/supabase'
import { useToast } from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import Modal from '../components/ModalDialog.vue'
import Layout from '../components/Layout.vue'
import { useAuth } from '../composables/useAuth'

interface Usuario {
  id: string
  email: string
  nome: string
  telefone: string
  setor_id: string
  setor_nome: string
  role: 'Admin' | 'User'
  status: 'ativo' | 'inativo'
  created_at: string
}

interface UsuarioEdicao extends Usuario {
  roleAnterior: string
  statusAnterior: string
  nomeAnterior: string
  telefoneAnterior: string
  setor_idAnterior: string
}

const modalCriacaoAberto = ref(false)
const novoUsuario = ref({
  email: '',
  password: '',
  nome: '',
  setor_id: null,
  role: 'User' // Papel padrão
})
const criandoUsuario = ref(false)

const toast = useToast()
const usuarios = ref<Usuario[]>([])
const carregando = ref(true)
const erro = ref('')
const modalAberto = ref(false)
const usuarioEmEdicao = ref<UsuarioEdicao | null>(null)
const setores = ref<{ id: string; nome: string }[]>([])

// Opções para o dropdown de papel (role)
const opcoesRole = [
  { valor: 'Admin', texto: 'Administrador' },
  { valor: 'User', texto: 'Usuário' }
]

// Opções para o dropdown de status
const opcoesStatus = [
  { valor: 'ativo', texto: 'Ativo' },
  { valor: 'inativo', texto: 'Inativo' }
]

function abrirModalCriacao() {
  // Reseta o formulário
  novoUsuario.value = {
    email: '',
    password: '',
    nome: '',
    setor_id: null,
    role: 'User'
  }
  modalCriacaoAberto.value = true
}

function fecharModalCriacao() {
  modalCriacaoAberto.value = false
}

async function criarNovoUsuario() {
  if (!novoUsuario.value.email || !novoUsuario.value.password || !novoUsuario.value.nome) {
    toast.error('Preencha pelo menos Nome, Email e Senha.')
    return
  }

  criandoUsuario.value = true
  try {
    // Chama a nova função segura do Supabase (vamos criá-la no Passo 3)
    const { error } = await supabase.rpc('create_new_user', {
      email: novoUsuario.value.email,
      password: novoUsuario.value.password,
      nome: novoUsuario.value.nome,
      role: novoUsuario.value.role,
      setor_id: novoUsuario.value.setor_id
    })

    if (error) throw error

    toast.success(`Usuário ${novoUsuario.value.email} criado com sucesso!`)
    fecharModalCriacao()
    await buscarUsuarios() // Atualiza a lista da tabela

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
    toast.error(`Erro ao criar usuário: ${errorMessage}`)
    console.error('Erro ao criar usuário:', error)
  } finally {
    criandoUsuario.value = false
  }
}


// Função para buscar todos os usuários (CORRIGIDA)
async function buscarUsuarios() {
  try {
    carregando.value = true
    erro.value = ''

    // Chama a função segura (RPC) que criamos no Supabase
    const { data: usuariosCombinados, error } = await supabase.rpc('get_all_users_with_profiles')

    if (error) {
      // Este erro agora será mais específico se houver um problema de permissão na função
      throw error
    }

    // O Supabase já retorna os dados combinados e prontos para uso
    usuarios.value = usuariosCombinados || []

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
    console.error('Erro ao buscar usuários:', error)
    erro.value = `Erro ao buscar usuários: ${errorMessage}`
    toast.error(erro.value)
  } finally {
    carregando.value = false
  }
}

// Função para abrir o modal de edição
function abrirModalEdicao(usuario: Usuario) {
  usuarioEmEdicao.value = {
    ...usuario,
    roleAnterior: usuario.role,
    statusAnterior: usuario.status,
    nomeAnterior: usuario.nome,
    telefoneAnterior: usuario.telefone,
    setor_idAnterior: usuario.setor_id
  }
  modalAberto.value = true
}

// ADICIONE ESTA NOVA FUNÇÃO COMPLETA
async function buscarSetores() {
  try {
    const { data, error } = await supabase.from('setores').select('id, nome')
    if (error) throw error
    setores.value = data || []
  } catch (error) {
    toast.error('Não foi possível carregar a lista de setores.')
    console.error('Erro ao buscar setores:', error)
  }
}
// Função para fechar o modal
function fecharModal() {
  modalAberto.value = false
  usuarioEmEdicao.value = null
}

// Verificar se houve alterações no usuário em edição
const houveAlteracoes = computed(() => {
  if (!usuarioEmEdicao.value) return false

  return (
    usuarioEmEdicao.value.role !== usuarioEmEdicao.value.roleAnterior ||
    usuarioEmEdicao.value.status !== usuarioEmEdicao.value.statusAnterior ||
    usuarioEmEdicao.value.nome !== usuarioEmEdicao.value.nomeAnterior ||
    usuarioEmEdicao.value.telefone !== usuarioEmEdicao.value.telefoneAnterior ||
    usuarioEmEdicao.value.setor_id !== usuarioEmEdicao.value.setor_idAnterior
  )
})

// Função para salvar as alterações
async function salvarAlteracoes() {
  if (!usuarioEmEdicao.value) return
  if (!houveAlteracoes.value) {
    toast.info('Nenhuma alteração foi feita')
    fecharModal()
    return
  }

  try {
    const usuario = usuarioEmEdicao.value
    let alteracoesSalvas = false

    // Atualizar o papel (role) se foi alterado
    if (usuario.role !== usuario.roleAnterior) {
      const { error: roleError } = await supabase.rpc(
        'update_user_role',
        {
          user_id: usuario.id,
          new_role: usuario.role
        }
      )

      if (roleError) throw roleError
      alteracoesSalvas = true
    }

    // Atualizar o status se foi alterado
    if (usuario.status !== usuario.statusAnterior) {
      const { error: statusError } = await supabase.rpc(
        'update_user_status',
        {
          user_id: usuario.id,
          new_status: usuario.status
        }
      )

      if (statusError) throw statusError
      alteracoesSalvas = true
    }

    // Atualizar os detalhes do perfil se foram alterados
    if (
      usuario.nome !== usuario.nomeAnterior ||
      usuario.telefone !== usuario.telefoneAnterior ||
      usuario.setor_id !== usuario.setor_idAnterior
    ) {
      const { error: profileError } = await supabase.rpc(
        'update_user_profile_details',
        {
          user_id: usuario.id,
          new_nome: usuario.nome,
          new_telefone: usuario.telefone,
          new_setor_id: usuario.setor_id
        }
      )

      if (profileError) throw profileError
      alteracoesSalvas = true
    }

    if (alteracoesSalvas) {
      toast.success('Alterações salvas com sucesso')
      // Atualizar a lista de usuários
      await buscarUsuarios()
    } else {
      toast.info('Nenhuma alteração foi feita')
    }

    fecharModal()
  } catch (error) {
    console.error('Erro ao salvar alterações:', error)
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
    toast.error(`Erro ao salvar alterações: ${errorMessage}`)
  }
}

// Carregar usuários quando o componente for montado
onMounted(() => {
  buscarUsuarios()
  buscarSetores()
})
</script>

<template>
  <Layout>
    <div class="flex justify-between items-center mb-8 w-full max-w-6xl">

    <h1 class="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
      Gerenciamento de Usuários
    </h1>
  
      <button 
      @click="abrirModalCriacao" 
        class="px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-500 text-white rounded font-bold shadow hover:from-teal-700 hover:to-cyan-600 transition"
        >
          Adicionar Novo Usuário
      </button>

    </div>

    <div v-if="carregando" class="flex flex-col items-center justify-center p-10 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl">
      <div class="w-12 h-12 border-4 border-teal-400 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p class="text-slate-300">Carregando usuários...</p>
    </div>

    <div v-else-if="erro" class="w-full max-w-6xl bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl p-6 text-center">
      <p class="text-red-400 mb-4">{{ erro }}</p>
      <button @click="buscarUsuarios" class="px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-500 text-white rounded font-bold shadow hover:from-teal-700 hover:to-cyan-600 transition">
        Tentar novamente
      </button>
    </div>

    <div v-else class="w-full max-w-6xl bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl p-6">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-white/20 border-b border-white/10">
            <tr>
              <th class="px-6 py-3 text-left text-sm font-medium text-slate-200 uppercase tracking-wider">Nome</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-slate-200 uppercase tracking-wider">Email</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-slate-200 uppercase tracking-wider">Setor</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-slate-200 uppercase tracking-wider">Papel</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-slate-200 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-slate-200 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/10">
            <tr v-for="usuario in usuarios" :key="usuario.id" class="hover:bg-white/5 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{{ usuario.nome || 'Não informado' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{{ usuario.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{{ usuario.setor_nome || 'Não informado' }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="{
                    'bg-teal-500/30 text-teal-200': usuario.role === 'Admin',
                    'bg-slate-500/30 text-slate-300': !usuario.role || usuario.role === 'User'
                  }"
                >
                  {{ usuario.role || 'Não definido' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="{
                    'bg-emerald-500/30 text-emerald-200': usuario.status === 'ativo',
                    'bg-slate-500/30 text-slate-300': usuario.status === 'inativo' || !usuario.status
                  }"
                >
                  {{ usuario.status === 'ativo' ? 'Ativo' : 'Inativo' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button
                  class="px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-500 text-white rounded font-bold shadow hover:from-teal-700 hover:to-cyan-600 transition"
                  @click="abrirModalEdicao(usuario)"
                >
                  Gerenciar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de edição -->
    <Modal :show="modalAberto" @close="fecharModal" title="Gerenciar Usuário">
      <div v-if="usuarioEmEdicao" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-slate-200 mb-1">Email:</label>
          <input
            type="text"
            id="email"
            v-model="usuarioEmEdicao.email"
            disabled
            class="w-full px-3 py-2 bg-slate-800/50 border border-white/20 rounded text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <small class="text-slate-400 text-xs">O email não pode ser alterado</small>
        </div>

        <div>
          <label for="nome" class="block text-sm font-medium text-slate-200 mb-1">Nome:</label>
          <input
            type="text"
            id="nome"
            v-model="usuarioEmEdicao.nome"
            class="w-full px-3 py-2 bg-slate-800/50 border border-white/20 rounded text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>

        <div>
          <label for="telefone" class="block text-sm font-medium text-slate-200 mb-1">Telefone:</label>
          <input
            type="text"
            id="telefone"
            v-model="usuarioEmEdicao.telefone"
            class="w-full px-3 py-2 bg-slate-800/50 border border-white/20 rounded text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>

        <div>
          <label for="setor" class="block text-sm font-medium text-slate-200 mb-1">Setor:</label>
            <select
                id="setor"
                v-model="usuarioEmEdicao.setor_id"
                class="w-full px-3 py-2 bg-slate-800/50 border border-white/20 rounded text-white focus:outline-none focus:ring-2 focus:ring-teal-400 appearance-none"
                style="background-image: url('data:image/svg+xml;utf8,<svg fill=\'white\' height=\'20\' viewBox=\'0 0 20 20\' width=\'20\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7.293 7.293a1 1 0 011.414 0L10 8.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z\'/></svg>'); background-repeat: no-repeat; background-position: right 0.5rem center; background-size: 1.25em 1.25em;"
                >
                <option :value="null">Nenhum setor</option>
                <option v-for="setor in setores" :key="setor.id" :value="setor.id">
              {{ setor.nome }}
            </option>
          </select>
        </div>

        <div>
          <label for="role" class="block text-sm font-medium text-slate-200 mb-1">Papel:</label>
          <select
            id="role"
            v-model="usuarioEmEdicao.role"
            class="w-full px-3 py-2 bg-slate-800/50 border border-white/20 rounded text-white focus:outline-none focus:ring-2 focus:ring-teal-400 appearance-none"
            style="background-image: url('data:image/svg+xml;utf8,<svg fill=\'white\' height=\'20\' viewBox=\'0 0 20 20\' width=\'20\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7.293 7.293a1 1 0 011.414 0L10 8.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z\'/></svg>'); background-repeat: no-repeat; background-position: right 0.5rem center; background-size: 1.25em 1.25em;"
          >
            <option v-for="opcao in opcoesRole" :key="opcao.valor" :value="opcao.valor">
              {{ opcao.texto }}
            </option>
          </select>
        </div>

        <div>
          <label for="status" class="block text-sm font-medium text-slate-200 mb-1">Status:</label>
          <select
            id="status"
            v-model="usuarioEmEdicao.status"
            class="w-full px-3 py-2 bg-slate-800/50 border border-white/20 rounded text-white focus:outline-none focus:ring-2 focus:ring-teal-400 appearance-none"
            style="background-image: url('data:image/svg+xml;utf8,<svg fill=\'white\' height=\'20\' viewBox=\'0 0 20 20\' width=\'20\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7.293 7.293a1 1 0 011.414 0L10 8.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z\'/></svg>'); background-repeat: no-repeat; background-position: right 0.5rem center; background-size: 1.25em 1.25em;"
          >
            <option v-for="opcao in opcoesStatus" :key="opcao.valor" :value="opcao.valor">
              {{ opcao.texto }}
            </option>
          </select>
        </div>

        <div class="flex justify-end space-x-4 pt-4">
          <button
            @click="fecharModal"
            class="px-4 py-2 bg-white/10 border border-white/20 text-slate-200 rounded font-medium hover:bg-white/20 transition"
          >
            Cancelar
          </button>
          <button
            @click="salvarAlteracoes"
            class="px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-500 text-white rounded font-bold shadow hover:from-teal-700 hover:to-cyan-600 transition disabled:opacity-50"
            :disabled="!houveAlteracoes"
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    </Modal>
    <Modal :show="modalCriacaoAberto" @close="fecharModalCriacao" title="Criar Novo Usuário">
      <div class="space-y-4">
        <div>
          <label for="novo-nome" class="block text-sm font-medium text-slate-200 mb-1">Nome Completo</label>
          <input type="text" id="novo-nome" v-model="novoUsuario.nome" class="w-full px-3 py-2 bg-slate-800/50 border border-white/20 rounded text-white focus:outline-none focus:ring-2 focus:ring-teal-400" placeholder="Nome do novo usuário" />
        </div>
        <div>
          <label for="novo-email" class="block text-sm font-medium text-slate-200 mb-1">Email</label>
          <input type="email" id="novo-email" v-model="novoUsuario.email" class="w-full px-3 py-2 bg-slate-800/50 border border-white/20 rounded text-white focus:outline-none focus:ring-2 focus:ring-teal-400" placeholder="email@dominio.com" />
        </div>
        <div>
          <label for="novo-senha" class="block text-sm font-medium text-slate-200 mb-1">Senha Inicial</label>
          <input type="password" id="novo-senha" v-model="novoUsuario.password" class="w-full px-3 py-2 bg-slate-800/50 border border-white/20 rounded text-white focus:outline-none focus:ring-2 focus:ring-teal-400" placeholder="Senha forte" />
          <small class="text-slate-400 text-xs">O usuário poderá alterar esta senha depois.</small>
        </div>
        <div>
          <label for="novo-setor" class="block text-sm font-medium text-slate-200 mb-1">Setor</label>
          <select id="novo-setor" v-model="novoUsuario.setor_id" class="w-full px-3 py-2 bg-slate-800/50 border border-white/20 rounded text-white focus:outline-none focus:ring-2 focus:ring-teal-400">
            <option :value="null">Nenhum setor</option>
            <option v-for="setor in setores" :key="setor.id" :value="setor.id">{{ setor.nome }}</option>
          </select>
        </div>
        <div>
          <label for="novo-role" class="block text-sm font-medium text-slate-200 mb-1">Papel (Role)</label>
          <select id="novo-role" v-model="novoUsuario.role" class="w-full px-3 py-2 bg-slate-800/50 border border-white/20 rounded text-white focus:outline-none focus:ring-2 focus:ring-teal-400">
            <option v-for="opcao in opcoesRole" :key="opcao.valor" :value="opcao.valor">{{ opcao.texto }}</option>
          </select>
        </div>

        <div class="flex justify-end space-x-4 pt-4">
          <button @click="fecharModalCriacao" class="px-4 py-2 bg-white/10 border border-white/20 text-slate-200 rounded font-medium hover:bg-white/20 transition">Cancelar</button>
          <button @click="criarNovoUsuario" :disabled="criandoUsuario" class="px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-500 text-white rounded font-bold shadow hover:from-teal-700 hover:to-cyan-600 transition disabled:opacity-50">
            {{ criandoUsuario ? 'Criando...' : 'Criar Usuário' }}
          </button>
        </div>
      </div>
    </Modal>
  </Layout>
</template>
