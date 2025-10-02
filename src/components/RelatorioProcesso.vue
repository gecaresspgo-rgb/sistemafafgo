<template>
  <div id="relatorio-processo" style="background: #fff; color: #222; font-family: Arial, sans-serif; width: 800px; padding: 32px;">
    <h1 style="text-align:center; font-size: 2em; margin-bottom: 0.5em;">Relatório do Processo</h1>
    <div style="text-align:right; font-size: 0.9em; margin-bottom: 1em;">Gerado em: {{ new Date().toLocaleString('pt-BR') }}</div>
    <h2 style="margin-top: 0;">Dados Gerais</h2>
    <table style="width:100%; border-collapse: collapse; margin-bottom: 1.5em;">
      <tbody>
        <tr><td><b>Nome:</b></td><td>{{ processo.nome_acao }}</td></tr>
        <tr><td><b>Status:</b></td><td>{{ processo.status }}</td></tr>
        <tr><td><b>Valor Inicial:</b></td><td>{{ processo.valor_inicial_padrao }}</td></tr>
        <tr><td><b>Área Temática:</b></td><td>{{ processo.area_code || 'Não definido' }}</td></tr>
        <tr><td><b>Força Responsável:</b></td><td>{{ processo.forca_code || 'Não definido' }}</td></tr>
        <tr><td><b>Data de Criação:</b></td><td>{{ formatarDataHora(processo.created_at) }}</td></tr>
        <tr><td><b>Processo SEI:</b></td><td>{{ processo.codigo_transferegov }}</td></tr>
      </tbody>
    </table>
    <h2>Linha do Tempo de Etapas</h2>
    <ol style="margin-bottom: 1.5em;">
      <li v-for="evento in historicoEtapas" :key="(evento as any).id">
        <b>{{ (evento as any).description }}</b>
        <span v-if="(evento as any).started_at && (evento as any).ended_at">
          — Tempo gasto: {{ calcularTempoGasto((evento as any).started_at, (evento as any).ended_at, (evento as any).accumulated_duration_seconds) }}
        </span>
        <span v-else style="color:#b91c1c;"> — Tempo não disponível</span>
      </li>
    </ol>
    <h2>Resumo dos Checklists</h2>
    <ul style="margin-bottom: 1.5em;">
      <li v-for="check in checklists" :key="(check as any).id">
        <span style="font-weight:bold; color: #059669;">[{{ (check as any).is_completed ? 'X' : ' ' }}]</span>
        {{ (check as any).task_description }} <span style="color:#64748b;">(Etapa: {{ (check as any).etapa_nome || (check as any).process_step_id }})</span>
      </li>
    </ul>
    <h2>Log de Alterações</h2>
    <ul style="margin-bottom: 1.5em;">
      <li v-for="evento in historicoAlteracoes" :key="(evento as any).id">
        <b>{{ (evento as any).user?.nome || 'Usuário' }}</b> alterou <b>{{ (evento as any).field_name }}</b> de
        <span style="color: #b91c1c;">'{{ (evento as any).old_value || 'vazio' }}'</span> para
        <span style="color: #059669;">'{{ (evento as any).new_value || 'vazio' }}'</span> em {{ new Date((evento as any).changed_at as string).toLocaleString('pt-BR') }}
      </li>
    </ul>
    <h2>Documentos Anexados</h2>
    <ul style="margin-bottom: 1.5em;">
      <li v-for="doc in documentos" :key="(doc as any).id">
        <div>
          <span v-if="isPDF((doc as any).filename)">
            <a :href="(doc as any).file_url" target="_blank" rel="noopener" style="color:#2563eb; text-decoration:underline;">{{ (doc as any).filename }} (Download PDF)</a>
          </span>
          <span v-else>{{ (doc as any).filename }}</span>
          <div v-if="isImagem((doc as any).filename)">
            <img :src="(doc as any).file_url" alt="preview" style="max-width: 200px; max-height: 120px; margin-top: 4px; border: 1px solid #eee;" />
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useFormatters } from '../composables/useFormatters'

defineProps<{
  processo: Record<string, unknown>,
  historicoEtapas: Array<Record<string, unknown>>,
  historicoAlteracoes: Array<Record<string, unknown>>,
  documentos: Array<Record<string, unknown>>,
  checklists: Array<Record<string, unknown>>,
  responsavelNome?: string,
}>()

// Importar funções de formatação do composable
const { formatarSegundos } = useFormatters()

// Função formatarDataHora é específica deste componente e não foi centralizada
// pois tem um formato diferente das outras funções de formatação de data
function formatarDataHora(data: unknown) {
  if (!data) return '';
  const d = new Date(data as string);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function calcularTempoGasto(started_at: string, ended_at: string, accumulated_duration_seconds?: number) {
  let segundos = 0;
  if (accumulated_duration_seconds !== undefined && accumulated_duration_seconds !== null) {
    segundos = Number(accumulated_duration_seconds);
  } else {
    const start = new Date(started_at).getTime();
    const end = new Date(ended_at).getTime();
    segundos = Math.floor((end - start) / 1000);
  }
  return formatarSegundos(segundos);
}

function isImagem(filename: string) {
  return /\.(png|jpe?g|gif|bmp|webp)$/i.test(filename);
}

function isPDF(filename: string) {
  return /\.pdf$/i.test(filename);
}
</script>
