import { ref, watch } from 'vue'
import {
  login as loginService,
  criarConta as criarContaService,
  logout as logoutService,
  obterUsuario,
} from '../services/auth'
// ✨ Importe o cliente Supabase aqui
import { supabase } from '@/services/supabase'

const user = ref(null)
const loading = ref(true)
const error = ref<string | null>(null)
const isAdmin = ref(false) // Variável reativa para o status de admin

// ✨ FUNÇÃO CENTRALIZADA: Verifica a role do perfil
async function checkAdminStatus(currentUser: { id: string } | null) {
  if (!currentUser) {
    isAdmin.value = false;
    return;
  }
  
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', currentUser.id)
      .single();

    isAdmin.value = profile?.role === 'Admin';
  } catch (err) {
    console.error('Erro ao verificar status de admin:', err);
    isAdmin.value = false;
  }
}

export function useAuth() {
  async function login(email: string, password: string) {
    loading.value = true
    error.value = null
    const { user: u, error: err } = await loginService(email, password)
    user.value = u
    error.value = err?.message || null
    loading.value = false
    return { user: u, error: err }
  }

  async function criarConta(email: string, password: string, nome?: string) {
    loading.value = true
    error.value = null
    const { user: u, error: err } = await criarContaService(email, password, nome)
    user.value = u
    error.value = err?.message || null
    loading.value = false
    return { user: u, error: err }
  }

  async function logout() {
    loading.value = true
    error.value = null
    const { error: err } = await logoutService()
    user.value = null
    error.value = err?.message || null
    loading.value = false
    return { error: err }
  }

  async function fetchUser() {
    loading.value = true
    error.value = null
    const fetchedUser = await obterUsuario()
    user.value = fetchedUser
    loading.value = false
    return user.value
  }

  // Watcher que observa mudanças na variável 'user'
  // Este é o único ponto onde a role é verificada
  watch(user, async (novoUser) => {
    loading.value = true
    await checkAdminStatus(novoUser)
    loading.value = false
  }, { immediate: true });
  
  return {
    user,
    loading,
    error,
    login,
    criarConta,
    logout,
    fetchUser,
    isAdmin, // Expor a nova propriedade
  }
}