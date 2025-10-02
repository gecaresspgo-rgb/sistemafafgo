<template>
  <!-- Modal Detalhes com Documentos -->
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
    @click.self="fecharDetalhes"
  >
    <div
      class="bg-gradient-to-br from-slate-900/95 to-blue-900/95 backdrop-blur-md border border-white/20 text-white rounded-xl shadow-2xl p-8 max-w-4xl w-full relative max-h-[90vh] overflow-y-auto"
    >
      <!-- Painel de Controle dos Botões e Abas -->
      <div class="absolute top-4 right-6 flex items-center gap-4 z-20">
        <button
          @click.stop="isEditing ? salvarAlteracoes() : iniciarEdicao()"
          class="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-teal-400 transition flex items-center"
          :disabled="editLoading"
          title="Atualizar Dados"
        >
          <svg v-if="!isEditing" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 20h9" /><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 3.5a2.121 2.121 0 113 3L7 19.5 3 21l1.5-4L16.5 3.5z" /></svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
        </button>
        <button
          @click="fecharDetalhes"
          class="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-red-400 transition"
          title="Fechar"
        >
          <svg xmlns='http://www.w3.org/2000/svg' class='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='2'><path stroke-linecap='round' stroke-linejoin='round' d='M18 6L6 18M6 6l12 12'/></svg>
        </button>
      </div>
      <!-- Abas -->
      <div class="flex gap-2 mb-4 mt-2">
        <button @click="activeModalTab = 'detalhes'" :class="['p-2 rounded transition', activeModalTab === 'detalhes' ? 'text-teal-400 bg-white/10 font-bold' : 'text-slate-400 hover:text-teal-400']" title="Detalhes">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16V4a2 2 0 012-2h8a2 2 0 012 2v12M4 20h16M8 20v-4a2 2 0 012-2h4a2 2 0 012 2v4"/></svg>
        </button>
        <button @click="activeModalTab = 'comentarios'" :class="['p-2 rounded transition', activeModalTab === 'comentarios' ? 'text-teal-400 bg-white/10 font-bold' : 'text-slate-400 hover:text-teal-400']" title="Comentários">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
        </button>
      </div>
      <div v-if="isAdmin" class="flex flex-col mb-4">
  <label for="status-selector" class="block text-slate-200 mb-1 font-semibold">Status:</label>
  <div class="flex items-center gap-2">
    <select 
      id="status-selector"
      v-model="novoStatus"
      class="w-full px-4 py-2 rounded-lg bg-slate-900 text-white border border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400 appearance-none"
      style="background-image: url('data:image/svg+xml;utf8,<svg fill=\'white\' height=\'20\' viewBox=\'0 0 20 20\' width=\'20\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7.293 7.293a1 1 0 011.414 0L10 8.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z\'/></svg>'); background-repeat: no-repeat; background-position: right 0.75rem center; background-size: 1.25em 1.25em;"
    >
      <option value="Em Andamento">Em Andamento</option>
      <option value="Concluído">Concluído</option>
      <option value="Cancelado">Cancelado</option>
    </select>
    <button
      @click="abrirModalConfirmacao"
      class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition"
    >
      Alterar
    </button>
  </div>
</div>
      <!-- Conteúdo das Abas -->
      <div v-if="activeModalTab === 'detalhes'">
      <!-- Navegação entre modais -->
      <div class="flex items-center gap-4 mb-4">
        <div class="flex bg-slate-800/50 rounded-lg p-1">
          <button
            class="px-4 py-1.5 rounded-md font-medium transition-all bg-gradient-to-r from-teal-600 to-cyan-500 text-white"
          >
            Detalhes
          </button>
          <button
            @click="switchToEtapas"
            class="px-4 py-1.5 rounded-md font-medium transition-all text-slate-300 hover:text-white hover:bg-white/10"
          >
            Etapas
          </button>
          <button
            @click="switchToRegistros"
            class="px-4 py-1.5 rounded-md font-medium transition-all text-slate-300 hover:text-white hover:bg-white/10"
          >
            Registros
          </button>
        </div>
      </div>
      <div class="flex items-center gap-2 mb-4">
  <h2 class="text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
    {{ processo.nome_acao || 'Processo sem nome' }}
  </h2>
</div>

      <!-- Informações do Processo -->
      <div class="mb-6">

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm mb-4">
          <div class="flex justify-between items-center md:col-span-2">
      <span class="text-slate-300">Código da Ação:</span>
      <span class="font-mono tracking-widest text-lg font-semibold text-teal-300">{{ processo.codigo_da_acao || 'Não gerado' }}</span>
    </div>
          <div class="flex justify-between items-center">
            <span class="text-slate-300">Área Temática:</span>
            <span class="bg-teal-600/20 text-teal-300 px-3 py-1 rounded-full text-xs font-semibold">{{ processo.area_code || 'Não definido' }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-slate-300">Ano do FAF:</span>
            <span>{{ processo.ano_faf || 'Não definido' }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-slate-300">Tipo de Natureza:</span>
            <span class="text-white">{{ processo.tipo_natureza_despesa || 'Não definido' }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-slate-300">Força Responsável:</span>
            <span>{{ processo.forca_code || 'Não definido' }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-slate-300">Valor Inicial:</span>
            <span v-if="!isEditing" class="font-bold text-teal-400">{{ formatarValor(processo.valor_inicial_padrao || 0) }}</span>
            <input v-else v-model.number="editableData.valor_inicial_padrao" type="number" class="bg-white/10 border border-white/20 rounded px-2 py-1 w-32 text-teal-400 font-bold" />
          </div>
          <div class="flex justify-between items-center">
            <span class="text-slate-300">Data de Encaminhamento:</span>
            <span>{{ formatarData(processo.data_encaminhamento_aprovacao || processo.created_at) }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-slate-300">Processo SEI:</span>
            <span>{{ processo.codigo_transferegov || 'Não definido' }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-slate-300">Quantidade de Itens:</span>
            <span v-if="!isEditing">{{ processo.qtd_itens || 'Não definido' }}</span>
            <input v-else v-model="editableData.qtd_itens" type="number" class="bg-white/10 border border-white/20 rounded px-2 py-1 w-24 text-white" />
          </div>
        </div>

        <hr class="my-4 bg-white/20 h-px border-0" />

        <div class="mb-4">
          <div class="mb-2"><span class="text-slate-300">Descrição dos Itens:</span> <span class="text-white" v-if="!isEditing">{{ processo.descricao_itens || 'Não definido' }}</span><textarea v-else v-model="editableData.descricao_itens" class="bg-white/10 border border-white/20 rounded px-2 py-1 w-full text-white"></textarea></div>
          <div class="mb-2"><span class="text-slate-300">Destinação dos Itens:</span> <span class="text-white" v-if="!isEditing">{{ processo.destinacao_itens || 'Não definido' }}</span><textarea v-else v-model="editableData.destinacao_itens" class="bg-white/10 border border-white/20 rounded px-2 py-1 w-full text-white"></textarea></div>
        </div>

        <!-- Card Informações Financeiras -->
        <div class="bg-white/5 rounded-lg p-4 mb-4">
          <div class="font-bold text-teal-400 mb-4">Informações Financeiras</div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-white/5 rounded-lg p-4 text-center">
              <div class="text-slate-300 text-xs mb-1">Valor de Rendimentos</div>
              <div v-if="!isEditing" class="text-green-400 font-bold text-lg">{{ formatarValor(processo.valor_rendimentos || 0) }}</div>
              <input v-else v-model.number="editableData.valor_rendimentos" type="number" class="bg-white/10 border border-white/20 rounded px-2 py-1 w-full text-green-400 font-bold text-lg" />
            </div>
            <div class="bg-white/5 rounded-lg p-4 text-center">
              <div class="text-slate-300 text-xs mb-1">Valor de Economicidade</div>
              <div v-if="!isEditing" class="text-blue-400 font-bold text-lg">{{ formatarValor(processo.valor_economicidade || 0) }}</div>
              <input v-else v-model.number="editableData.valor_economicidade" type="number" class="bg-white/10 border border-white/20 rounded px-2 py-1 w-full text-blue-400 font-bold text-lg" />
            </div>
            <div class="bg-white/5 rounded-lg p-4 text-center">
  <div class="text-slate-300 text-xs mb-1">Valor Total Destinado</div>
    <div class="text-teal-400 font-bold text-lg">
      {{ formatarValor(isEditing ? valorTotalDestinadoCalculado : valorTotalDestinadoVisualizacao) }}
    </div>
</div>
          </div>
        </div>

        <div class="mb-4">
          <div class="text-slate-300 mb-1">Descrição Geral:</div>
          <div v-if="!isEditing" class="bg-white/5 rounded px-3 py-2 text-white">{{ processo.descricao_geral || 'Não definido' }}</div>
          <textarea v-else v-model="editableData.descricao_geral" class="bg-white/10 border border-white/20 rounded px-2 py-1 w-full text-white"></textarea>
        </div>
      </div>

      <hr class="my-4 bg-white/20 h-px border-0" />

      <!-- Seção de Documentos -->
      <div class="pt-2">
        <h3 class="text-lg font-bold text-teal-400 mb-4 flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          Documentos Anexados
        </h3>

        <div v-if="carregandoDocumentos" class="text-center py-4">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400"></div>
        </div>
        <div v-else-if="erroDocumentos" class="text-red-400 text-center py-4">
          {{ erroDocumentos }}
        </div>
        <div v-else-if="documentos.length === 0" class="text-center py-8 text-slate-500">
          <svg class="w-16 h-16 mx-auto text-slate-600 mb-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          <p class="font-semibold">Nenhum documento anexado.</p>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div v-for="documento in documentos" :key="documento.id" class="bg-white/5 border border-white/10 rounded-lg p-4 flex flex-col justify-between hover:bg-white/10 transition">
              <div class="flex items-start gap-3 flex-1">
                  <div class="w-10 h-10 bg-teal-600/10 rounded-lg flex-shrink-0 flex items-center justify-center mt-1">
                      <svg class="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  </div>
                  <div class="flex flex-col flex-1 min-w-0">
                      <h4 class="font-semibold text-white text-sm break-words">{{ documento.filename }}</h4>
                      <p v-if="documento.description" class="text-xs text-slate-300 mt-1 italic break-words">"{{ documento.description }}"</p>
                      <p class="text-xs text-slate-400 mt-1">{{ formatarTamanhoArquivo(documento.file_size) }}</p>
                      <p class="text-xs text-slate-500 mt-1">{{ documento.created_at ? formatarData(documento.created_at) : 'Documento anexado' }}</p>
                  </div>
              </div>
              <div class="flex gap-2 mt-4 self-end">
                  <button @click="visualizarArquivo(documento.file_url)" class="px-3 py-2 bg-gradient-to-r from-teal-600 to-cyan-500 text-white text-sm rounded font-semibold hover:from-teal-700 hover:to-cyan-600 transition flex items-center gap-1">Visualizar</button>
                  <button @click="baixarArquivo(documento.file_url, documento.filename)" class="px-3 py-2 border border-white/20 text-slate-300 hover:bg-white/10 bg-transparent text-sm rounded font-semibold transition flex items-center gap-1">Baixar</button>
                    <button
                      @click="excluirDocumento(documento)"
                      class="p-2 border border-red-500/50 text-red-400 hover:bg-red-500/20 bg-transparent rounded font-semibold transition flex items-center"
                      title="Excluir Documento"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 18h6l3-18H3zM5 6h14M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m-6 6v6m4-6v6"></path></svg>
                    </button>
              </div>
          </div>
        </div>

        <div class="mt-6 pt-6 border-t border-white/10">
          <h4 class="font-semibold text-white mb-3">Adicionar Novo Anexo</h4>
          <div class="space-y-4">

              <div
                ref="dropZoneModalRef"
                class="p-4 border-2 border-dashed rounded-lg transition-colors"
                :class="isOverModal ? 'border-teal-400 bg-teal-500/10' : 'border-white/20'"
              >
            <div class="flex items-center gap-4">
              <label for="novo-anexo-input" class="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white font-semibold cursor-pointer hover:bg-white/20 transition">
                Escolher arquivo
              </label>
              <input id="novo-anexo-input" type="file" @change="onNovoAnexoChange" class="hidden" />
                  <span class="text-sm text-slate-300 truncate">{{ novoAnexo?.name || 'Arraste um arquivo aqui...' }}</span>
                </div>
            </div>
            <textarea
              v-model="novoAnexoDesc"
              placeholder="Descrição do anexo (opcional)"
              rows="2"
              class="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
            ></textarea>

            <div class="flex items-center gap-4">
              <button
                @click="adicionarAnexo"
                :disabled="uploadLoading || !novoAnexo"
                class="px-5 py-2 bg-gradient-to-r from-teal-600 to-cyan-500 text-white rounded-lg font-semibold shadow disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Anexar
              </button>
              <div v-if="uploadLoading" class="w-5 h-5 border-b-2 border-white rounded-full animate-spin"></div>
              <span v-if="uploadError" class="text-red-400 text-sm">{{ uploadError }}</span>
            </div>

          </div>
        </div>
      </div>

      <div class="flex justify-between mt-6 w-full">
      <button
        @click="gerarRelatorioPDF"
        :disabled="gerandoPDF"
        class="px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-500 text-white rounded font-bold shadow disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <span v-if="gerandoPDF">Gerando PDF...</span>
        <span v-else>Gerar Relatório (PDF)</span>
      </button>
      <button
        class="px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-500 text-white rounded font-bold shadow hover:from-teal-700 hover:to-cyan-600 transition"
        @click="fecharDetalhes"
      >
        Fechar
      </button>
    </div>
      <div v-if="editError" class="text-red-500 text-sm mt-2">{{ editError }}</div>
      </div>
      <div v-else-if="activeModalTab === 'comentarios'">
        <div class="mb-4">
          <h3 class="text-lg font-bold text-teal-400 mb-2 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
            Comentários do Processo
          </h3>
          <div v-if="loadingComments" class="text-center py-4">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400"></div>
          </div>
          <div v-else-if="comments.length === 0" class="text-slate-400 text-center py-4">
            Nenhum comentário ainda.
          </div>
          <div v-else class="space-y-4 max-h-64 overflow-y-auto">
            <div v-for="comment in comments" :key="comment.id" class="flex items-start gap-3 py-3 border-b border-white/10">
              <div class="flex-shrink-0 w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center font-bold">
                {{ comment.profiles?.nome?.charAt(0) || 'U' }}
              </div>
              <div class="flex-1">
                <div class="flex justify-between items-center">
                  <p class="font-semibold text-white">{{ comment.profiles?.nome || 'Usuário' }}</p>
                  <div v-if="user && user.id === comment.user_id && editingCommentId !== comment.id" class="flex items-center gap-2">
                    <button @click="startEdit(comment)" title="Editar">
                      <svg class="w-4 h-4 text-slate-400 hover:text-teal-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536M9 11l6 6M3 17v4h4l10.293-10.293a1 1 0 00-1.414-1.414L3 17z"/></svg>
                    </button>
                    <button @click="deleteComment(comment.id)" title="Excluir">
                      <svg class="w-4 h-4 text-slate-400 hover:text-red-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                  </div>
                </div>
                <p class="text-xs text-slate-500">{{ formatarData(comment.created_at) }}</p>
                <div v-if="editingCommentId !== comment.id" class="text-slate-200 mt-2 whitespace-pre-wrap">
                  {{ comment.comment_text }}
                </div>
                <div v-else class="mt-2">
                  <textarea v-model="editingCommentText" rows="3" class="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"></textarea>
                  <div class="flex gap-2 mt-2">
                    <button @click="saveComment" class="px-3 py-1 bg-teal-600 text-white rounded font-bold">Salvar</button>
                    <button @click="cancelEdit" class="px-3 py-1 bg-slate-600 text-white rounded font-bold">Cancelar</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-6">
            <textarea ref="newCommentTextarea" v-model="newComment" rows="2" placeholder="Escreva um comentário..." class="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400"></textarea>
            <div class="flex justify-end mt-2">
              <button @click="postComment" :disabled="!newComment.trim()" class="px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-500 text-white rounded font-bold shadow disabled:opacity-50 disabled:cursor-not-allowed transition">Enviar</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ConfirmationModal
  :show="showConfirmationModal"
  title="Confirmação de Alteração de Status"
  :message="confirmationMessage"
  @confirm="handleConfirmation"
  @cancel="handleCancellation"
/>
    
    <!-- Componente de relatório oculto para captura do PDF -->
    <div style="position: fixed; left: -9999px; top: 0; width: 800px;">
      <RelatorioProcesso
        v-if="dadosRelatorio"
        v-bind="dadosRelatorio"
        :responsavelNome="(processo.responsavel_nome || processo.nome_responsavel || processo.profiles?.nome || '') as string"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, nextTick, computed } from 'vue'
import { supabase } from '../services/supabase'
import { useAuth } from '../composables/useAuth'
import { useFormatters } from '../composables/useFormatters'
import RelatorioProcesso from './RelatorioProcesso.vue'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import Tribute from 'tributejs'
import ConfirmationModal from './ConfirmationModal.vue'

// Props e emits
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  processo: {
    type: Object,
    required: true
  },
  isAdmin: {
    type: Boolean,
    required: true
  }
})



// Interface para o objeto de dados editáveis
interface EditableData {
  valor_inicial_padrao: number | string;
  qtd_itens: number | string;
  descricao_itens: string;
  destinacao_itens: string;
  valor_rendimentos: number | string;
  valor_economicidade: number | string;
  valor_total_destinado: number | string;
  descricao_geral: string;
}

const emit = defineEmits(['close', 'atualizar-processo', 'switch-to-etapas', 'switch-to-registros', 'status-changed']) 

const novoStatus = ref(props.processo.status);

const showConfirmationModal = ref(false)
const confirmationMessage = ref('')
const newStatusToConfirm = ref('')

// Estado do modal
const activeModalTab = ref('detalhes')
const documentos = ref([])
const carregandoDocumentos = ref(false)
const erroDocumentos = ref('')

// Estado de edição
const isEditing = ref(false)
const editLoading = ref(false)
const editError = ref('')
const editableData = reactive<EditableData>({
  valor_inicial_padrao: 0,
  qtd_itens: '',
  descricao_itens: '',
  destinacao_itens: '',
  valor_rendimentos: 0,
  valor_economicidade: 0,
  valor_total_destinado: 0,
  descricao_geral: ''
})

// Estado de upload
const novoAnexo = ref(null)
const novoAnexoDesc = ref('')
const uploadLoading = ref(false)
const uploadError = ref('')
const isOverModal = ref(false)
const dropZoneModalRef = ref(null)

// Estado de comentários
const { user, isAdmin } = useAuth()
const comments = ref([])
const loadingComments = ref(false)
const newComment = ref('')
const newCommentTextarea = ref(null)
const editingCommentId = ref(null)
const editingCommentText = ref('')
const allUsers = ref([])
const tribute = ref(null)
const commentLoading = ref(false)

// Estado de relatório PDF
const gerandoPDF = ref(false)
const dadosRelatorio = ref(null)

const abrirModalConfirmacao = () => {
  // Apenas seta as variáveis de estado para exibir o modal de confirmação
  confirmationMessage.value = `Você tem certeza que deseja mudar o status para "${novoStatus.value}"?`;
  newStatusToConfirm.value = novoStatus.value;
  showConfirmationModal.value = true;
};

const handleConfirmation = async () => {
  showConfirmationModal.value = false;
  try {
    const { error } = await supabase.rpc('update_process_status', {
      p_process_id: props.processo.id,
      p_new_status: newStatusToConfirm.value
    });

    if (error) {
      throw error;
    }

    emit('status-changed');
  } catch (error) {
    alert('Erro ao atualizar status: ' + error.message);
    console.error(error);
    novoStatus.value = props.processo.status;
  }
};

const handleCancellation = () => {
  showConfirmationModal.value = false;
  novoStatus.value = props.processo.status;
};

// sincronizar o novoStatus quando a prop mudar
watch(() => props.processo?.status, (newStatus) => {
  novoStatus.value = newStatus;
});

// Importar funções de formatação do composable
const { formatarValor, formatarData, formatarTamanhoArquivo } = useFormatters()

const valorTotalDestinadoCalculado = computed(() => {
  const inicial = Number(editableData.valor_inicial_padrao) || 0;
  const rendimentos = Number(editableData.valor_rendimentos) || 0;
  const economicidade = Number(editableData.valor_economicidade) || 0;
  return inicial + rendimentos + economicidade;
});

// Adicione esta nova propriedade computada
const valorTotalDestinadoVisualizacao = computed(() => {
  const inicial = Number(props.processo.valor_inicial_padrao) || 0;
  const rendimentos = Number(props.processo.valor_rendimentos) || 0;
  const economicidade = Number(props.processo.valor_economicidade) || 0;
  return inicial + rendimentos + economicidade;
});


watch(() => props.show, (newValue, oldValue) => {
  console.log(`[FILHO] Propriedade 'show' mudou de '${oldValue}' para '${newValue}'`);
});


// Funções de documentos
async function carregarDocumentos() {
  carregandoDocumentos.value = true
  erroDocumentos.value = ''

  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      // CORREÇÃO 1: 'processo_id' alterado para 'process_id'
      .eq('process_id', props.processo.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    documentos.value = data || []
  } catch (error) {
    console.error('Erro ao carregar documentos:', error)
    erroDocumentos.value = 'Erro ao carregar documentos. Tente novamente.'
  } finally {
    carregandoDocumentos.value = false
  }
}

async function adicionarAnexo() {
  if (!novoAnexo.value) return

  uploadLoading.value = true
  uploadError.value = ''

  try {
    const file = novoAnexo.value
    // Sanitizar nome do arquivo para o path
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filePath = `${props.processo.id}/${Date.now()}_${sanitizedFileName}`

    // 1. Upload do arquivo para o storage (bucket 'documents')
    const { error: uploadErrorObj } = await supabase.storage
      .from('documents') // Usando o bucket 'documents'
      .upload(filePath, file, { cacheControl: '3600', upsert: false })

    if (uploadErrorObj) throw uploadErrorObj

    // 2. Obter a URL pública do arquivo
    const { data: publicUrlData } = supabase.storage.from('documents').getPublicUrl(filePath)
    const fileUrl = publicUrlData.publicUrl

    // 3. Salvar o registro do documento na tabela 'documents'
    const { error: dbError } = await supabase.from('documents').insert([
      {
        // CORREÇÃO: 'processo_id' alterado para 'process_id'
        process_id: props.processo.id,
        filename: file.name,
        file_url: fileUrl,
        file_size: file.size,
        mime_type: file.type,
        storage_path: filePath,
        description: novoAnexoDesc.value,
        user_id: user.value?.id
      }
    ])

    if (dbError) {
      // Se a inserção no banco falhar, remover o arquivo do storage
      await supabase.storage.from('documents').remove([filePath])
      throw dbError
    }

    await carregarDocumentos()
    novoAnexo.value = null
    novoAnexoDesc.value = ''
  } catch (error) {
    console.error('Erro ao adicionar anexo:', error)
    uploadError.value = 'Erro ao adicionar anexo. Tente novamente.'
  } finally {
    uploadLoading.value = false
  }
}

function onNovoAnexoChange(event) {
  const files = event.target.files
  if (files.length > 0) {
    novoAnexo.value = files[0]
  }
}

function visualizarArquivo(url) {
  window.open(url, '_blank')
}

function baixarArquivo(url, filename) {
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

async function excluirDocumento(documento) {
  if (!confirm('Tem certeza que deseja excluir este documento?')) return

  try {
    // 1. Excluir o arquivo do storage
    const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([documento.storage_path]);

    // Mesmo que haja um erro no storage (ex: arquivo já removido), prosseguir para remover do DB
    if (storageError) console.warn('Erro ao excluir arquivo do storage (pode já ter sido removido):', storageError);

    // 2. Excluir o registro do banco
    const { error: dbError } = await supabase
      .from('documents')
      .delete()
      .eq('id', documento.id)

    if (dbError) throw dbError

    await carregarDocumentos()
  } catch (error) {
    console.error('Erro ao excluir documento:', error)
    alert('Erro ao excluir documento. Tente novamente.')
  }
}

// Funções de comentários
async function fetchComments() {
  loadingComments.value = true
  try {
    const { data, error } = await supabase
      // CORREÇÃO 2: Tabela 'document_comments' alterada para 'process_comments'
      .from('process_comments')
      .select('*, profiles(nome)')
      // CORREÇÃO 1: 'processo_id' alterado para 'process_id'
      .eq('process_id', props.processo.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    comments.value = data || []
  } catch (error) {
    console.error('Erro ao carregar comentários:', error)
  } finally {
    loadingComments.value = false
  }
}

async function postComment() {
  if (!newComment.value.trim()) return
  commentLoading.value = true

  try {
    const { error } = await supabase.rpc('post_comment_with_mentions', {
      p_process_id: props.processo.id,
      p_comment_text: newComment.value
    });

    if (error) throw error

    newComment.value = '';
    await fetchComments()


    console.log('Dados recebidos APÓS o fetchComments:', JSON.parse(JSON.stringify(comments.value)));


  } catch (error) {
    console.error('Erro ao postar comentário:', error)
    alert('Erro ao postar comentário. Tente novamente.')
  }finally{
    commentLoading.value = false;
  }
}

function startEdit(comment) {
  editingCommentId.value = comment.id
  editingCommentText.value = comment.comment_text
}

function cancelEdit() {
  editingCommentId.value = null
  editingCommentText.value = ''
}

async function saveComment() {
  if (!editingCommentText.value.trim() || commentLoading.value)  return

  commentLoading.value = true
  try {
    const { error } = await supabase
      .from('process_comments')
      .update({ comment_text: editingCommentText.value })
      .eq('id', editingCommentId.value)

    if (error) throw error

    cancelEdit()
    await fetchComments()
  } catch (error) {
    console.error('Erro ao editar comentário:', error)
    alert('Erro ao editar comentário. Tente novamente.')
  }finally{
    commentLoading.value = false;
  }
}

async function deleteComment(commentId) {
  if (!confirm('Tem certeza que deseja excluir este comentário?')) return
  commentLoading.value = true

  try {
    const { error } = await supabase
    .from('process_comments')
    .delete()
    .eq('id', commentId)

    if (error) throw error

    await fetchComments()
  } catch (error) {
    console.error('Erro ao excluir comentário:', error)
    alert('Erro ao excluir comentário. Tente novamente.')
  } finally{
    commentLoading.value = false;
  }
}

async function fetchAllUsers() {
  try {
    const { data, error } = await supabase.from('profiles').select('id, nome')

    if (error) throw error
    allUsers.value = data || []
  } catch (error) {
    console.error('Erro ao carregar usuários:', error)
  }
}

function initTribute() {
  if (tribute.value && newCommentTextarea.value) {
    tribute.value.detach(newCommentTextarea.value);
    tribute.value = null;
  }
  if (allUsers.value.length > 0 && newCommentTextarea.value) {
    tribute.value = new Tribute({
      values: allUsers.value.map(user => ({
        key: user.nome,
        value: user.nome,
        id: user.id
      })),
      selectTemplate: function (item) {
        return '@' + item.original.key;
      }
    })
    tribute.value.attach(newCommentTextarea.value)
  }
}

// Funções de edição
async function iniciarEdicao() {
  try {
    // 1. Busca os dados mais recentes do processo no banco
    const { data: processoAtualizado, error } = await supabase
      .from('processes')
      .select('*')
      .eq('id', props.processo.id)
      .single();

    if (error) throw error;
    if (!processoAtualizado) throw new Error("Processo não encontrado.");

    // 2. Preenche o formulário de edição com os dados frescos
    editableData.valor_inicial_padrao = processoAtualizado.valor_inicial_padrao || 0;
    editableData.qtd_itens = processoAtualizado.qtd_itens || '';
    editableData.descricao_itens = processoAtualizado.descricao_itens || '';
    editableData.destinacao_itens = processoAtualizado.destinacao_itens || '';
    editableData.valor_rendimentos = processoAtualizado.valor_rendimentos || 0;
    editableData.valor_economicidade = processoAtualizado.valor_economicidade || 0;
    editableData.descricao_geral = processoAtualizado.descricao_geral || '';
    
    isEditing.value = true; // Só entra em modo de edição se os dados foram carregados com sucesso

  } catch (error: any) {
    console.error("Erro ao carregar dados para edição:", error);
    alert("Não foi possível carregar os dados mais recentes para edição: " + error.message);
  }
}

async function salvarAlteracoes() {
  editLoading.value = true
  editError.value = ''

  try {
    const dadosParaAtualizar = {
      // Campos de texto
      descricao_itens: editableData.descricao_itens,
      destinacao_itens: editableData.destinacao_itens,
      descricao_geral: editableData.descricao_geral,

      // Campos numéricos
      valor_inicial_padrao: String(editableData.valor_inicial_padrao) === '' ? null : Number(editableData.valor_inicial_padrao),
      qtd_itens: editableData.qtd_itens === '' ? null : Number(editableData.qtd_itens),
      valor_rendimentos: editableData.valor_rendimentos === '' ? null : Number(editableData.valor_rendimentos),
      valor_economicidade: editableData.valor_economicidade === '' ? null : Number(editableData.valor_economicidade),

      // A linha 'valor_total_destinado' foi removida. O banco cuidará disso!
    };

    const { error } = await supabase
      .from('processes')
      .update(dadosParaAtualizar)
      .eq('id', props.processo.id)

    if (error) throw error

    isEditing.value = false
    
    const processoAtualizado = {
      ...props.processo,
      ...dadosParaAtualizar
    }
    // O valor_total_destinado será recalculado automaticamente no componente pai
    emit('atualizar-processo')
  } catch (error) {
    console.error('Erro ao salvar alterações:', error)
    editError.value = 'Erro ao salvar alterações. Tente novamente.'
  } finally {
    editLoading.value = false
  }
}

function fecharDetalhes() {
  emit('close')
}

// Função para alternar para o modal de etapas
function switchToEtapas() {
  emit('switch-to-etapas')
}

// Função para alternar para o modal de registros
function switchToRegistros() {
  emit('switch-to-registros')
}

// Função para gerar relatório PDF (sem alterações)
async function gerarRelatorioPDF() {
    gerandoPDF.value = true
    try {
        const checklists = []; // Adicione a lógica para buscar checklists se necessário
        dadosRelatorio.value = {
            processo: props.processo,
            documentos: documentos.value,
            historicoEtapas: [], // Adicione a lógica para buscar histórico
            historicoAlteracoes: [], // Adicione a lógica para buscar alterações
            checklists: checklists
        };
        await nextTick();
        const relatorioElement = document.getElementById('relatorio-processo');
        if (relatorioElement) {
            const canvas = await html2canvas(relatorioElement, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`relatorio-processo-${props.processo.id}.pdf`);
        }
    } catch (error) {
        console.error("Erro ao gerar PDF:", error);
        alert("Falha ao gerar o relatório PDF.");
    } finally {
        dadosRelatorio.value = null;
        gerandoPDF.value = false;
    }
}


// Watchers e lifecycle hooks
// CÓDIGO NOVO E CORRIGIDO em ProcessoDetalhesModal.vue

watch(user, (novoUser) => {
  if (novoUser) {
    console.log('Dados do usuário carregados:', novoUser);
    console.log('Role do usuário:', novoUser.role);
  }
}, { immediate: true });

watch(
  [() => props.show, () => props.processo?.id],

  async ([newShow, newProcessoId]) => {
    if (newShow && newProcessoId) {
      comments.value = [];

      activeModalTab.value = 'detalhes';
      isEditing.value = false;

      await carregarDocumentos();

      await fetchAllUsers();
      nextTick(() => {
        initTribute();
      });
    }
  },
  { immediate: false }
);

// Em ProcessoDetalhesModal.vue

// ✨ NOVO WATCH PARA CARREGAR DADOS SOB DEMANDA ✨
watch(activeModalTab, (newTab) =>{
    if(newTab === 'comentarios'){
        fetchComments();
    }
})

onMounted(() => {
  if (dropZoneModalRef.value) {
    const dropZone = dropZoneModalRef.value
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault()
      isOverModal.value = true
    })
    dropZone.addEventListener('dragleave', () => {
      isOverModal.value = false
    })
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault()
      isOverModal.value = false
      if (e.dataTransfer && e.dataTransfer.files.length > 0) {
        novoAnexo.value = e.dataTransfer.files[0]
      }
    })
  }
})
</script>
