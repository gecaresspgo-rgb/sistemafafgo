<template>
  <nav class="flex flex-col h-screen w-64 bg-abyss-dark p-6 shadow-lg">
    <router-link
      to="/"
      class="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 mb-2"
      :class="$route.path === '/' ? 'bg-gradient-to-r from-teal-600 to-cyan-500 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-700/50 hover:text-teal-400'"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
      <span class="font-medium">Processos</span>
    </router-link>
    <router-link
      to="/analises"
      class="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 mb-2"
      :class="$route.path === '/analises' ? 'bg-gradient-to-r from-teal-600 to-cyan-500 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-700/50 hover:text-teal-400'"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
      <span class="font-medium">Análises</span>
    </router-link>
    <router-link
      to="/minha-conta"
      class="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 mb-2"
      :class="$route.path === '/minha-conta' ? 'bg-gradient-to-r from-teal-600 to-cyan-500 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-700/50 hover:text-teal-400'"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
      <span class="font-medium">Minha Conta</span>
    </router-link>
    <router-link
      to="/acompanhamento-especial"
      class="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 mb-2"
      :class="$route.path === '/acompanhamento-especial' ? 'bg-gradient-to-r from-teal-600 to-cyan-500 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-700/50 hover:text-teal-400'"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
        <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
      </svg>
      <span class="font-medium">Acompanhamento Especial</span>
    </router-link>
    <router-link
      to="/controle-acoes"
      class="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 mb-2"
      :class="$route.path === '/controle-acoes' ? 'bg-gradient-to-r from-teal-600 to-cyan-500 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-700/50 hover:text-teal-400'"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
      <span class="font-medium">Controle de Ações</span>
    </router-link>
    <!-- Seção de Administração -->
    <div v-if="isAdmin" class="mb-2">
      <div class="text-slate-400 text-xs uppercase font-semibold mb-2 px-4">Administração</div>

      <!-- Botão de Admin - Regras de Automação -->
      <router-link
        to="/admin"
        class="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 mb-2"
        :class="$route.path === '/admin' ? 'bg-gradient-to-r from-amber-600 to-yellow-500 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-700/50 hover:text-amber-400'"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 10c-4.418 0-8-1.79-8-4V6a2 2 0 012-2h12a2 2 0 012 2v8c0 2.21-3.582 4-8 4z"/></svg>
        <span class="font-medium">Regras de Automação</span>
      </router-link>

      <!-- Botão de Gerenciamento de Usuários -->
      <router-link
        to="/admin/usuarios"
        class="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 mb-2"
        :class="$route.path === '/admin/usuarios' ? 'bg-gradient-to-r from-amber-600 to-yellow-500 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-700/50 hover:text-amber-400'"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
        <span class="font-medium">Usuários</span>
      </router-link>
    </div>
    <div class="flex-1"></div>
    <template v-if="user">
      <span class="text-abyss-primary font-semibold mb-4 block"
        >Olá, {{ user.user_metadata?.name || user.email }}</span
      >
      <button
        @click="handleLogout"
        class="px-3 py-1 bg-abyss-primary text-white rounded shadow hover:bg-abyss-secondary transition"
      >
        Sair
      </button>
    </template>
  </nav>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue'
import { useAuth } from '../composables/useAuth'
import { useRouter } from 'vue-router'
import { supabase } from '../services/supabase'

const { user, logout } = useAuth()
const router = useRouter()
const isAdmin = ref(false)

async function fetchProfileRole() {
  if (!user.value) {
    isAdmin.value = false
    return
  }
  const { data } = await supabase.from('profiles').select('role').eq('id', user.value.id).single()
  isAdmin.value = data?.role === 'Admin'
}

watch(user, () => {
  fetchProfileRole()
}, { immediate: true })

async function handleLogout() {
  await logout()
  router.push('/login')
}
</script>

<script lang="ts">
export default {
  name: 'AppMenu',
}
</script>
