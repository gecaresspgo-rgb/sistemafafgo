import { supabase } from './supabase'

export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { user: data?.user, session: data?.session, error }
}

export async function criarConta(email: string, password: string, nome?: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: nome ? { name: nome } : undefined,
    },
  })
  return { user: data?.user, session: data?.session, error }
}

export async function logout() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function obterUsuario() {
  const { data } = await supabase.auth.getUser()
  return data?.user
}

// Buscar etapas de um processo
export async function buscarEtapasDoProcesso(processId: string) {
  // A consulta agora busca as etapas e, para cada uma, seus itens de checklist associados
  return await supabase
    .from('process_steps')
    .select('*, step_templates(name), step_checklist_items(*)') // <--- MUDANÇA AQUI
    .eq('process_id', processId)
    .order('step_order', { ascending: true })
    .order('created_at', { referencedTable: 'step_checklist_items', ascending: true }); // Ordena os itens do checklist
}

// Avançar etapa do processo
export async function avancarEtapa(processId: string, idxAtual: number, totalEtapas: number) {
  // Busca as etapas ordenadas
  const { data: etapas } = await supabase
    .from('process_steps')
    .select('*')
    .eq('process_id', processId)
    .order('step_order', { ascending: true })

  if (!etapas || etapas.length === 0) return { error: { message: 'Nenhuma etapa encontrada' } }

  const etapaAtual = etapas[idxAtual]
  if (!etapaAtual) return { error: { message: 'Etapa atual não encontrada' } }

  if (idxAtual + 1 < totalEtapas) {
    // Finaliza a etapa atual
    const { error: errorAtual } = await supabase
      .from('process_steps')
      .update({ ended_at: new Date().toISOString(), is_current: false })
      .eq('id', etapaAtual.id)
    // Marca a próxima etapa como atual e define started_at
    const proximaEtapa = etapas[idxAtual + 1]
    const { error: errorProx } = await supabase
      .from('process_steps')
      .update({ started_at: new Date().toISOString(), is_current: true })
      .eq('id', proximaEtapa.id)
    return { error: errorAtual || errorProx }
  } else {
    // Se for a última etapa, finalizar a etapa e atualizar status do processo
    const { error: errorUltima } = await supabase
      .from('process_steps')
      .update({ ended_at: new Date().toISOString(), is_current: false })
      .eq('id', etapaAtual.id)
    const { error: errorProc } = await supabase
      .from('processes')
      .update({ status: 'Concluído' })
      .eq('id', processId)
    return { error: errorUltima || errorProc }
  }
}

// Buscar forças responsáveis
export async function buscarForcasResponsaveis() {
  const { data, error } = await supabase
    .from('responsible_forces')
    .select('id, code, name')
    .order('name', { ascending: true })
  return { data, error }
}

// Buscar áreas temáticas
export async function buscarAreasTematicas() {
  const { data, error } = await supabase
    .from('thematic_areas')
    .select('id, code, name')
    .order('name', { ascending: true })
  return { data, error }
}

// Registrar evento no histórico do processo
export async function registrarEventoHistorico(processId: string, description: string) {
  const { data: user } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('process_history')
    .insert([
      {
        process_id: processId,
        user_id: user?.user?.id,
        description: description,
      },
    ])
    .select()
  return { data, error }
}

// Buscar histórico de um processo
export async function buscarHistoricoProcesso(processId: string) {
  return await supabase
    .from('process_history')
    .select('*')
    .eq('process_id', processId)
    .order('changed_at', { ascending: false })
}
