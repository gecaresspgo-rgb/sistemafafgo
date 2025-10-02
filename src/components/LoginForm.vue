<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'
import { useRouter, useRoute } from 'vue-router'

// Refs apenas para o login
const email = ref('')
const password = ref('')

// --- CORREÇÃO APLICADA AQUI ---
const { login, error } = useAuth()
const feedback = ref('') // 'feedback' é uma ref local para mensagens de UI
// ------------------------------

const router = useRouter()
const route = useRoute()

async function handleLogin(e: Event) {
  e.preventDefault()
  feedback.value = ''
  const { error: err } = await login(email.value, password.value)

  if (!err) {
    feedback.value = 'Login realizado com sucesso!' // Agora funciona
    const redirectPath = route.query.redirect as string;
    if (redirectPath) {
      router.push(redirectPath);
    } else {
      router.push('/processos');
    }
  }
}
</script>

<template>
  <div class="w-full max-w-md bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl shadow-2xl p-8 space-y-6">
    <h1 class="text-3xl font-bold text-center bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">GECARE Processos</h1>
    <p class="text-center text-slate-800 font-bold">Faça login para continuar</p>
    
    <form @submit.prevent="handleLogin" class="space-y-4">
      <div>
        <label for="email" class="block mb-1 text-slate-800 font-bold">Email</label>
        <input id="email" v-model="email" type="email" required class="w-full px-4 py-2 bg-white/80 border border-cyan-400 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder:text-slate-400" placeholder="Digite seu email" />
      </div>
      <div>
        <label for="password" class="block mb-1 text-slate-800 font-bold">Senha</label>
        <input id="password" v-model="password" type="password" required class="w-full px-4 py-2 bg-white/80 border border-cyan-400 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder:text-slate-400" placeholder="Digite sua senha" />
      </div>
      
      <button type="submit" class="w-full px-4 py-3 bg-gradient-to-r from-teal-600 to-cyan-500 text-white rounded-lg font-bold shadow-lg hover:from-teal-700 hover:to-cyan-600 transition">Entrar</button>
      
      <div v-if="error" class="text-red-500 text-center text-sm pt-2">{{ error }}</div>
      <div v-if="feedback && !error" class="text-green-600 text-center text-sm pt-2">{{ feedback }}</div>

      <div class="flex justify-end">
        <a href="#" class="text-sm text-cyan-600 hover:underline">Esqueci minha senha</a>
      </div>
    </form>
  </div>
</template>