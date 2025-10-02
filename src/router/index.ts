import { createRouter, createWebHistory } from 'vue-router'
// 1. SUGESTÃO APLICADA: Importar o Supabase uma única vez, no topo do arquivo.
import { supabase } from '../services/supabase'

import ProcessosView from '../views/ProcessosView.vue'
import LoginView from '../views/LoginView.vue'
import CadastroProcessoView from '../views/CadastroProcessoView.vue'
import AnalisesView from '../views/AnalisesView.vue'
import MinhaContaView from '../views/MinhaContaView.vue'
import ControleDeAcoesView from '../views/ControleDeAcoesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/processos',
    },
    {
      path: '/processos',
      name: 'processos',
      component: ProcessosView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/processos/novo',
      name: 'cadastro-processo',
      component: CadastroProcessoView,
    },
    {
      path: '/analises',
      name: 'analises',
      component: AnalisesView,
    },
    {
      path: '/minha-conta',
      name: 'minha-conta',
      component: MinhaContaView,
    },
    {
      path: '/controle-acoes',
      name: 'controle-acoes',
      component: ControleDeAcoesView,
    },
    {
      path: '/acompanhamento-especial',
      name: 'AcompanhamentoEspecial',
      component: () => import('../views/AcompanhamentoEspecialView.vue'),
    },
    {
      path: '/processo/:id',
      name: 'processo-detalhes',
      redirect: to => {
        return { path: '/processos', query: { processo_id: to.params.id } }
      },
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue'),
    },
    {
      path: '/admin/usuarios',
      name: 'gerenciamento-usuarios',
      component: () => import('../views/GerenciamentoUsuariosView.vue'),
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  // Agora 'supabase' já está disponível aqui, sem a necessidade de um novo import.
  const { data: { user } } = await supabase.auth.getUser()
  let userRole = null;

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    userRole = profile?.role
  }

  const publicPages = ['/login']
  const authRequired = !publicPages.includes(to.path)
  const isAdminRoute = to.path.startsWith('/admin')

  // 1. Se a rota precisa de login e o usuário não está logado...
  if (authRequired && !user) {
    // 2. SUGESTÃO APLICADA: Redireciona para o login, guardando a página que o usuário queria acessar.
    return next({ path: '/login', query: { redirect: to.fullPath } })
  }

  // 2. Se a rota é de admin e o usuário não tem o papel 'Admin', redireciona
  if (isAdminRoute && userRole !== 'Admin') {
    console.warn('Acesso negado: Rota de admin para usuário não-admin.');
    return next('/processos')
  }

  // 3. Se tudo estiver ok, permite a navegação
  next()
})

export default router
