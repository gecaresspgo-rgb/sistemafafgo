<template>
  <Layout>
    <div class="min-h-screen flex justify-center items-stretch px-8 py-8">
      <div class="w-full max-w-5xl mx-auto">
        <h1 class="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent mb-4">Minha Conta</h1>
        <p class="text-slate-300 mb-6">Gerencie suas informações pessoais e configurações.</p>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Informações do Usuário -->
          <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-xl p-6">
            <h2 class="text-xl font-semibold bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent mb-4">Informações Pessoais</h2>
            <div class="space-y-4">
              <div>
                <label class="block text-slate-200 font-medium mb-2">Nome</label>
                <input
                  v-model="userInfo.name"
                  type="text"
                  class="w-full px-3 py-2 bg-slate-900 border border-teal-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder:text-slate-400"
                  placeholder="Seu nome completo"
                />
              </div>
              <div>
                <label class="block text-slate-200 font-medium mb-2">Email</label>
                <input
                  v-model="userInfo.email"
                  type="email"
                  class="w-full px-3 py-2 bg-slate-900 border border-teal-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder:text-slate-400"
                  placeholder="seu@email.com"
                  disabled
                />
              </div>
              <div>
                <label class="block text-slate-200 font-medium mb-2">Telefone</label>
                <input
                  v-model="userInfo.phone"
                  type="tel"
                  class="w-full px-3 py-2 bg-slate-900 border border-teal-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder:text-slate-400"
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div>
                <label class="block text-slate-200 font-medium mb-2">Setor</label>
                <select
                  v-model="userInfo.setor_id"
                  class="w-full px-3 py-2 bg-slate-900 border border-teal-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 appearance-none"
                  style="background-image: url('data:image/svg+xml;utf8,<svg fill=\'white\' height=\'20\' viewBox=\'0 0 20 20\' width=\'20\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7.293 7.293a1 1 0 011.414 0L10 8.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z\'/></svg>'); background-repeat: no-repeat; background-position: right 0.75rem center; background-size: 1.25em 1.25em;"
                >
                  <option value="">Selecione o setor</option>
                  <option v-for="setor in setores" :key="setor.id" :value="setor.id">
                    {{ setor.nome }}
                  </option>
                </select>
              </div>
            </div>
            <button
              @click="salvarInformacoes"
              class="mt-4 px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-500 text-white rounded-lg font-semibold shadow hover:from-teal-700 hover:to-cyan-600 transition"
            >
              Salvar Alterações
            </button>
          </div>

          <!-- Configurações da Conta -->
          <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-xl p-6">
            <h2 class="text-xl font-semibold bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent mb-4">Configurações</h2>
            <div class="space-y-4">
              <div>
                <label class="block text-slate-200 font-medium mb-2">Alterar Senha</label>
                <input
                  v-model="novaSenha"
                  type="password"
                  class="w-full px-3 py-2 bg-slate-900 border border-teal-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder:text-slate-400"
                  placeholder="Nova senha"
                />
              </div>
              <div>
                <label class="block text-slate-200 font-medium mb-2">Confirmar Nova Senha</label>
                <input
                  v-model="confirmarSenha"
                  type="password"
                  class="w-full px-3 py-2 bg-slate-900 border border-teal-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder:text-slate-400"
                  placeholder="Confirme a nova senha"
                />
              </div>
            </div>
            <button
              @click="alterarSenha"
              class="mt-4 px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-500 text-white rounded-lg font-semibold shadow hover:from-teal-700 hover:to-cyan-600 transition"
            >
              Alterar Senha
            </button>
          </div>

          <!-- Estatísticas -->
          <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-xl p-6 md:col-span-2">
            <h2 class="text-xl font-semibold bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent mb-4">Estatísticas da Conta</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="text-center p-4 bg-white/5 rounded-lg shadow">
                <div class="text-2xl font-bold text-teal-400">{{ estatisticas.totalProcessos }}</div>
                <div class="text-slate-300">Total de Processos</div>
              </div>
              <div class="text-center p-4 bg-white/5 rounded-lg shadow">
                <div class="text-2xl font-bold text-teal-400">{{ estatisticas.processosAtivos }}</div>
                <div class="text-slate-300">Processos Ativos</div>
              </div>
              <div class="text-center p-4 bg-white/5 rounded-lg shadow">
                <div class="text-2xl font-bold text-teal-400">{{ estatisticas.processosConcluidos }}</div>
                <div class="text-slate-300">Processos Concluídos</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import Layout from '../components/Layout.vue'
import { ref, onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'
import { supabase } from '../services/supabase'

const { user } = useAuth()

const userInfo = ref({
  name: '',
  email: '',
  phone: '',
  setor_id: ''
})
const setores = ref<{ id: number; nome: string }[]>([])

const novaSenha = ref('')
const confirmarSenha = ref('')

const estatisticas = ref({
  totalProcessos: 0,
  processosAtivos: 0,
  processosConcluidos: 0
})

onMounted(async () => {
  if (user.value) {
    userInfo.value.name = user.value.user_metadata?.name || ''
    userInfo.value.email = user.value.email || ''
    // Buscar perfil do usuário na tabela profiles
    const { data: perfil } = await supabase
      .from('profiles')
      .select('telefone, setor_id')
      .eq('id', user.value.id)
      .single()
    if (perfil) {
      userInfo.value.phone = perfil.telefone || ''
      userInfo.value.setor_id = perfil.setor_id || ''
    }
    // Buscar setores disponíveis
    const { data: setoresData } = await supabase
      .from('setores')
      .select('id, nome')
      .order('nome', { ascending: true })
    if (setoresData) setores.value = setoresData
    await carregarEstatisticas()
  }
})

async function carregarEstatisticas() {
  if (!user.value) return;

  const { data, error } = await supabase.rpc('get_user_process_stats', { user_id: user.value.id });
  if (error) {
    console.error('Erro ao buscar estatísticas:', error);
    alert('Erro ao buscar estatísticas: ' + (error.message || JSON.stringify(error)));
    estatisticas.value = { totalProcessos: 0, processosAtivos: 0, processosConcluidos: 0 };
    return;
  }
  if (!data || data.length === 0) {
    estatisticas.value = { totalProcessos: 0, processosAtivos: 0, processosConcluidos: 0 };
    return;
  }
  const stats = data[0];
  estatisticas.value = {
    totalProcessos: stats.total_processos || 0,
    processosAtivos: stats.processos_ativos || 0,
    processosConcluidos: stats.processos_concluidos || 0
  };
}

async function salvarInformacoes() {
  if (!user.value) return
  try {
    // Atualiza nome no auth (user_metadata)
    const { error: errorAuth } = await supabase.auth.updateUser({
      data: {
        name: userInfo.value.name
      }
    })
    // Faz upsert no profile: se não existir, cria; se existir, atualiza
    const { error: errorProfile } = await supabase
      .from('profiles')
      .upsert({
        id: user.value.id,
        nome: userInfo.value.name, // salva nome também na tabela profiles
        telefone: userInfo.value.phone,
        setor_id: userInfo.value.setor_id
      }, { onConflict: 'id' })
    if (errorAuth || errorProfile) {
      alert('Erro ao salvar informações: ' + (errorAuth?.message || errorProfile?.message))
    } else {
      alert('Informações salvas com sucesso!')
    }
  } catch (error) {
    alert('Erro ao salvar informações')
  }
}

async function alterarSenha() {
  if (novaSenha.value !== confirmarSenha.value) {
    alert('As senhas não coincidem!')
    return
  }

  if (novaSenha.value.length < 6) {
    alert('A senha deve ter pelo menos 6 caracteres!')
    return
  }

  try {
    const { error } = await supabase.auth.updateUser({
      password: novaSenha.value
    })

    if (error) {
      alert('Erro ao alterar senha: ' + error.message)
    } else {
      alert('Senha alterada com sucesso!')
      novaSenha.value = ''
      confirmarSenha.value = ''
    }
  } catch (error) {
    alert('Erro ao alterar senha')
  }
}
</script>

<script lang="ts">
export default {
  name: 'MinhaContaView',
}
</script>
