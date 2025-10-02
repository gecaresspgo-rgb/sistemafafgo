var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _a, _b, _c, _d, _e, _f;
import { ref, reactive, watch, onMounted, nextTick, computed } from 'vue';
import { supabase } from '../services/supabase';
import { useAuth } from '../composables/useAuth';
import { useFormatters } from '../composables/useFormatters';
import RelatorioProcesso from './RelatorioProcesso.vue';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import Tribute from 'tributejs';
import ConfirmationModal from './ConfirmationModal.vue';
// Props e emits
var props = defineProps({
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
});
var emit = defineEmits(['close', 'atualizar-processo', 'switch-to-etapas', 'switch-to-registros', 'status-changed']);
var novoStatus = ref(props.processo.status);
var showConfirmationModal = ref(false);
var confirmationMessage = ref('');
var newStatusToConfirm = ref('');
// Estado do modal
var activeModalTab = ref('detalhes');
var documentos = ref([]);
var carregandoDocumentos = ref(false);
var erroDocumentos = ref('');
// Estado de edição
var isEditing = ref(false);
var editLoading = ref(false);
var editError = ref('');
var editableData = reactive({
    valor_inicial_padrao: 0,
    qtd_itens: '',
    descricao_itens: '',
    destinacao_itens: '',
    valor_rendimentos: 0,
    valor_economicidade: 0,
    valor_total_destinado: 0,
    descricao_geral: ''
});
// Estado de upload
var novoAnexo = ref(null);
var novoAnexoDesc = ref('');
var uploadLoading = ref(false);
var uploadError = ref('');
var isOverModal = ref(false);
var dropZoneModalRef = ref(null);
// Estado de comentários
var _g = useAuth(), user = _g.user, isAdmin = _g.isAdmin;
var comments = ref([]);
var loadingComments = ref(false);
var newComment = ref('');
var newCommentTextarea = ref(null);
var editingCommentId = ref(null);
var editingCommentText = ref('');
var allUsers = ref([]);
var tribute = ref(null);
var commentLoading = ref(false);
// Estado de relatório PDF
var gerandoPDF = ref(false);
var dadosRelatorio = ref(null);
var abrirModalConfirmacao = function () {
    // Apenas seta as variáveis de estado para exibir o modal de confirmação
    confirmationMessage.value = "Voc\u00EA tem certeza que deseja mudar o status para \"".concat(novoStatus.value, "\"?");
    newStatusToConfirm.value = novoStatus.value;
    showConfirmationModal.value = true;
};
var handleConfirmation = function () { return __awaiter(void 0, void 0, void 0, function () {
    var error, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                showConfirmationModal.value = false;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, supabase.rpc('update_process_status', {
                        p_process_id: props.processo.id,
                        p_new_status: newStatusToConfirm.value
                    })];
            case 2:
                error = (_a.sent()).error;
                if (error) {
                    throw error;
                }
                emit('status-changed');
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                alert('Erro ao atualizar status: ' + error_1.message);
                console.error(error_1);
                novoStatus.value = props.processo.status;
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var handleCancellation = function () {
    showConfirmationModal.value = false;
    novoStatus.value = props.processo.status;
};
// sincronizar o novoStatus quando a prop mudar
watch(function () { var _a; return (_a = props.processo) === null || _a === void 0 ? void 0 : _a.status; }, function (newStatus) {
    novoStatus.value = newStatus;
});
// Importar funções de formatação do composable
var _h = useFormatters(), formatarValor = _h.formatarValor, formatarData = _h.formatarData, formatarTamanhoArquivo = _h.formatarTamanhoArquivo;
var valorTotalDestinadoCalculado = computed(function () {
    var inicial = Number(editableData.valor_inicial_padrao) || 0;
    var rendimentos = Number(editableData.valor_rendimentos) || 0;
    var economicidade = Number(editableData.valor_economicidade) || 0;
    return inicial + rendimentos + economicidade;
});
// Adicione esta nova propriedade computada
var valorTotalDestinadoVisualizacao = computed(function () {
    var inicial = Number(props.processo.valor_inicial_padrao) || 0;
    var rendimentos = Number(props.processo.valor_rendimentos) || 0;
    var economicidade = Number(props.processo.valor_economicidade) || 0;
    return inicial + rendimentos + economicidade;
});
watch(function () { return props.show; }, function (newValue, oldValue) {
    console.log("[FILHO] Propriedade 'show' mudou de '".concat(oldValue, "' para '").concat(newValue, "'"));
});
// Funções de documentos
function carregarDocumentos() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    carregandoDocumentos.value = true;
                    erroDocumentos.value = '';
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, supabase
                            .from('documents')
                            .select('*')
                            // CORREÇÃO 1: 'processo_id' alterado para 'process_id'
                            .eq('process_id', props.processo.id)
                            .order('created_at', { ascending: false })];
                case 2:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    documentos.value = data || [];
                    return [3 /*break*/, 5];
                case 3:
                    error_2 = _b.sent();
                    console.error('Erro ao carregar documentos:', error_2);
                    erroDocumentos.value = 'Erro ao carregar documentos. Tente novamente.';
                    return [3 /*break*/, 5];
                case 4:
                    carregandoDocumentos.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function adicionarAnexo() {
    return __awaiter(this, void 0, void 0, function () {
        var file, sanitizedFileName, filePath, uploadErrorObj, publicUrlData, fileUrl, dbError, error_3;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!novoAnexo.value)
                        return [2 /*return*/];
                    uploadLoading.value = true;
                    uploadError.value = '';
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 7, 8, 9]);
                    file = novoAnexo.value;
                    sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
                    filePath = "".concat(props.processo.id, "/").concat(Date.now(), "_").concat(sanitizedFileName);
                    return [4 /*yield*/, supabase.storage
                            .from('documents') // Usando o bucket 'documents'
                            .upload(filePath, file, { cacheControl: '3600', upsert: false })];
                case 2:
                    uploadErrorObj = (_b.sent()).error;
                    if (uploadErrorObj)
                        throw uploadErrorObj;
                    publicUrlData = supabase.storage.from('documents').getPublicUrl(filePath).data;
                    fileUrl = publicUrlData.publicUrl;
                    return [4 /*yield*/, supabase.from('documents').insert([
                            {
                                // CORREÇÃO: 'processo_id' alterado para 'process_id'
                                process_id: props.processo.id,
                                filename: file.name,
                                file_url: fileUrl,
                                file_size: file.size,
                                mime_type: file.type,
                                storage_path: filePath,
                                description: novoAnexoDesc.value,
                                user_id: (_a = user.value) === null || _a === void 0 ? void 0 : _a.id
                            }
                        ])];
                case 3:
                    dbError = (_b.sent()).error;
                    if (!dbError) return [3 /*break*/, 5];
                    // Se a inserção no banco falhar, remover o arquivo do storage
                    return [4 /*yield*/, supabase.storage.from('documents').remove([filePath])];
                case 4:
                    // Se a inserção no banco falhar, remover o arquivo do storage
                    _b.sent();
                    throw dbError;
                case 5: return [4 /*yield*/, carregarDocumentos()];
                case 6:
                    _b.sent();
                    novoAnexo.value = null;
                    novoAnexoDesc.value = '';
                    return [3 /*break*/, 9];
                case 7:
                    error_3 = _b.sent();
                    console.error('Erro ao adicionar anexo:', error_3);
                    uploadError.value = 'Erro ao adicionar anexo. Tente novamente.';
                    return [3 /*break*/, 9];
                case 8:
                    uploadLoading.value = false;
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    });
}
function onNovoAnexoChange(event) {
    var files = event.target.files;
    if (files.length > 0) {
        novoAnexo.value = files[0];
    }
}
function visualizarArquivo(url) {
    window.open(url, '_blank');
}
function baixarArquivo(url, filename) {
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
function excluirDocumento(documento) {
    return __awaiter(this, void 0, void 0, function () {
        var storageError, dbError, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!confirm('Tem certeza que deseja excluir este documento?'))
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, supabase.storage
                            .from('documents')
                            .remove([documento.storage_path])];
                case 2:
                    storageError = (_a.sent()).error;
                    // Mesmo que haja um erro no storage (ex: arquivo já removido), prosseguir para remover do DB
                    if (storageError)
                        console.warn('Erro ao excluir arquivo do storage (pode já ter sido removido):', storageError);
                    return [4 /*yield*/, supabase
                            .from('documents')
                            .delete()
                            .eq('id', documento.id)];
                case 3:
                    dbError = (_a.sent()).error;
                    if (dbError)
                        throw dbError;
                    return [4 /*yield*/, carregarDocumentos()];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    error_4 = _a.sent();
                    console.error('Erro ao excluir documento:', error_4);
                    alert('Erro ao excluir documento. Tente novamente.');
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
// Funções de comentários
function fetchComments() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error, error_5;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    loadingComments.value = true;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, supabase
                            // CORREÇÃO 2: Tabela 'document_comments' alterada para 'process_comments'
                            .from('process_comments')
                            .select('*, profiles(nome)')
                            // CORREÇÃO 1: 'processo_id' alterado para 'process_id'
                            .eq('process_id', props.processo.id)
                            .order('created_at', { ascending: false })];
                case 2:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    comments.value = data || [];
                    return [3 /*break*/, 5];
                case 3:
                    error_5 = _b.sent();
                    console.error('Erro ao carregar comentários:', error_5);
                    return [3 /*break*/, 5];
                case 4:
                    loadingComments.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function postComment() {
    return __awaiter(this, void 0, void 0, function () {
        var error, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!newComment.value.trim())
                        return [2 /*return*/];
                    commentLoading.value = true;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, supabase.rpc('post_comment_with_mentions', {
                            p_process_id: props.processo.id,
                            p_comment_text: newComment.value
                        })];
                case 2:
                    error = (_a.sent()).error;
                    if (error)
                        throw error;
                    newComment.value = '';
                    return [4 /*yield*/, fetchComments()];
                case 3:
                    _a.sent();
                    console.log('Dados recebidos APÓS o fetchComments:', JSON.parse(JSON.stringify(comments.value)));
                    return [3 /*break*/, 6];
                case 4:
                    error_6 = _a.sent();
                    console.error('Erro ao postar comentário:', error_6);
                    alert('Erro ao postar comentário. Tente novamente.');
                    return [3 /*break*/, 6];
                case 5:
                    commentLoading.value = false;
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function startEdit(comment) {
    editingCommentId.value = comment.id;
    editingCommentText.value = comment.comment_text;
}
function cancelEdit() {
    editingCommentId.value = null;
    editingCommentText.value = '';
}
function saveComment() {
    return __awaiter(this, void 0, void 0, function () {
        var error, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!editingCommentText.value.trim() || commentLoading.value)
                        return [2 /*return*/];
                    commentLoading.value = true;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, supabase
                            .from('process_comments')
                            .update({ comment_text: editingCommentText.value })
                            .eq('id', editingCommentId.value)];
                case 2:
                    error = (_a.sent()).error;
                    if (error)
                        throw error;
                    cancelEdit();
                    return [4 /*yield*/, fetchComments()];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4:
                    error_7 = _a.sent();
                    console.error('Erro ao editar comentário:', error_7);
                    alert('Erro ao editar comentário. Tente novamente.');
                    return [3 /*break*/, 6];
                case 5:
                    commentLoading.value = false;
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function deleteComment(commentId) {
    return __awaiter(this, void 0, void 0, function () {
        var error, error_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!confirm('Tem certeza que deseja excluir este comentário?'))
                        return [2 /*return*/];
                    commentLoading.value = true;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, supabase
                            .from('process_comments')
                            .delete()
                            .eq('id', commentId)];
                case 2:
                    error = (_a.sent()).error;
                    if (error)
                        throw error;
                    return [4 /*yield*/, fetchComments()];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4:
                    error_8 = _a.sent();
                    console.error('Erro ao excluir comentário:', error_8);
                    alert('Erro ao excluir comentário. Tente novamente.');
                    return [3 /*break*/, 6];
                case 5:
                    commentLoading.value = false;
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function fetchAllUsers() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error, error_9;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, supabase.from('profiles').select('id, nome')];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    allUsers.value = data || [];
                    return [3 /*break*/, 3];
                case 2:
                    error_9 = _b.sent();
                    console.error('Erro ao carregar usuários:', error_9);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function initTribute() {
    if (tribute.value && newCommentTextarea.value) {
        tribute.value.detach(newCommentTextarea.value);
        tribute.value = null;
    }
    if (allUsers.value.length > 0 && newCommentTextarea.value) {
        tribute.value = new Tribute({
            values: allUsers.value.map(function (user) { return ({
                key: user.nome,
                value: user.nome,
                id: user.id
            }); }),
            selectTemplate: function (item) {
                return '@' + item.original.key;
            }
        });
        tribute.value.attach(newCommentTextarea.value);
    }
}
// Funções de edição
function iniciarEdicao() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, processoAtualizado, error, error_10;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, supabase
                            .from('processes')
                            .select('*')
                            .eq('id', props.processo.id)
                            .single()];
                case 1:
                    _a = _b.sent(), processoAtualizado = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    if (!processoAtualizado)
                        throw new Error("Processo não encontrado.");
                    // 2. Preenche o formulário de edição com os dados frescos
                    editableData.valor_inicial_padrao = processoAtualizado.valor_inicial_padrao || 0;
                    editableData.qtd_itens = processoAtualizado.qtd_itens || '';
                    editableData.descricao_itens = processoAtualizado.descricao_itens || '';
                    editableData.destinacao_itens = processoAtualizado.destinacao_itens || '';
                    editableData.valor_rendimentos = processoAtualizado.valor_rendimentos || 0;
                    editableData.valor_economicidade = processoAtualizado.valor_economicidade || 0;
                    editableData.descricao_geral = processoAtualizado.descricao_geral || '';
                    isEditing.value = true; // Só entra em modo de edição se os dados foram carregados com sucesso
                    return [3 /*break*/, 3];
                case 2:
                    error_10 = _b.sent();
                    console.error("Erro ao carregar dados para edição:", error_10);
                    alert("Não foi possível carregar os dados mais recentes para edição: " + error_10.message);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function salvarAlteracoes() {
    return __awaiter(this, void 0, void 0, function () {
        var dadosParaAtualizar, error, processoAtualizado, error_11;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    editLoading.value = true;
                    editError.value = '';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    dadosParaAtualizar = {
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
                    return [4 /*yield*/, supabase
                            .from('processes')
                            .update(dadosParaAtualizar)
                            .eq('id', props.processo.id)];
                case 2:
                    error = (_a.sent()).error;
                    if (error)
                        throw error;
                    isEditing.value = false;
                    processoAtualizado = __assign(__assign({}, props.processo), dadosParaAtualizar);
                    // O valor_total_destinado será recalculado automaticamente no componente pai
                    emit('atualizar-processo');
                    return [3 /*break*/, 5];
                case 3:
                    error_11 = _a.sent();
                    console.error('Erro ao salvar alterações:', error_11);
                    editError.value = 'Erro ao salvar alterações. Tente novamente.';
                    return [3 /*break*/, 5];
                case 4:
                    editLoading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function fecharDetalhes() {
    emit('close');
}
// Função para alternar para o modal de etapas
function switchToEtapas() {
    emit('switch-to-etapas');
}
// Função para alternar para o modal de registros
function switchToRegistros() {
    emit('switch-to-registros');
}
// Função para gerar relatório PDF (sem alterações)
function gerarRelatorioPDF() {
    return __awaiter(this, void 0, void 0, function () {
        var checklists, relatorioElement, canvas, imgData, pdf, pdfWidth, pdfHeight, error_12;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    gerandoPDF.value = true;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, 6, 7]);
                    checklists = [];
                    dadosRelatorio.value = {
                        processo: props.processo,
                        documentos: documentos.value,
                        historicoEtapas: [], // Adicione a lógica para buscar histórico
                        historicoAlteracoes: [], // Adicione a lógica para buscar alterações
                        checklists: checklists
                    };
                    return [4 /*yield*/, nextTick()];
                case 2:
                    _a.sent();
                    relatorioElement = document.getElementById('relatorio-processo');
                    if (!relatorioElement) return [3 /*break*/, 4];
                    return [4 /*yield*/, html2canvas(relatorioElement, { scale: 2 })];
                case 3:
                    canvas = _a.sent();
                    imgData = canvas.toDataURL('image/png');
                    pdf = new jsPDF('p', 'mm', 'a4');
                    pdfWidth = pdf.internal.pageSize.getWidth();
                    pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                    pdf.save("relatorio-processo-".concat(props.processo.id, ".pdf"));
                    _a.label = 4;
                case 4: return [3 /*break*/, 7];
                case 5:
                    error_12 = _a.sent();
                    console.error("Erro ao gerar PDF:", error_12);
                    alert("Falha ao gerar o relatório PDF.");
                    return [3 /*break*/, 7];
                case 6:
                    dadosRelatorio.value = null;
                    gerandoPDF.value = false;
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    });
}
// Watchers e lifecycle hooks
// CÓDIGO NOVO E CORRIGIDO em ProcessoDetalhesModal.vue
watch(user, function (novoUser) {
    if (novoUser) {
        console.log('Dados do usuário carregados:', novoUser);
        console.log('Role do usuário:', novoUser.role);
    }
}, { immediate: true });
watch([function () { return props.show; }, function () { var _a; return (_a = props.processo) === null || _a === void 0 ? void 0 : _a.id; }], function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var newShow = _b[0], newProcessoId = _b[1];
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!(newShow && newProcessoId)) return [3 /*break*/, 3];
                comments.value = [];
                activeModalTab.value = 'detalhes';
                isEditing.value = false;
                return [4 /*yield*/, carregarDocumentos()];
            case 1:
                _c.sent();
                return [4 /*yield*/, fetchAllUsers()];
            case 2:
                _c.sent();
                nextTick(function () {
                    initTribute();
                });
                _c.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); }, { immediate: false });
// Em ProcessoDetalhesModal.vue
// ✨ NOVO WATCH PARA CARREGAR DADOS SOB DEMANDA ✨
watch(activeModalTab, function (newTab) {
    if (newTab === 'comentarios') {
        fetchComments();
    }
});
onMounted(function () {
    if (dropZoneModalRef.value) {
        var dropZone = dropZoneModalRef.value;
        dropZone.addEventListener('dragover', function (e) {
            e.preventDefault();
            isOverModal.value = true;
        });
        dropZone.addEventListener('dragleave', function () {
            isOverModal.value = false;
        });
        dropZone.addEventListener('drop', function (e) {
            e.preventDefault();
            isOverModal.value = false;
            if (e.dataTransfer && e.dataTransfer.files.length > 0) {
                novoAnexo.value = e.dataTransfer.files[0];
            }
        });
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = {};
var __VLS_components;
var __VLS_directives;
if (__VLS_ctx.show) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ onClick: (__VLS_ctx.fecharDetalhes) }, { class: "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "bg-gradient-to-br from-slate-900/95 to-blue-900/95 backdrop-blur-md border border-white/20 text-white rounded-xl shadow-2xl p-8 max-w-4xl w-full relative max-h-[90vh] overflow-y-auto" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "absolute top-4 right-6 flex items-center gap-4 z-20" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.show))
                return;
            __VLS_ctx.isEditing ? __VLS_ctx.salvarAlteracoes() : __VLS_ctx.iniciarEdicao();
        } }, { class: "p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-teal-400 transition flex items-center" }), { disabled: (__VLS_ctx.editLoading), title: "Atualizar Dados" }));
    if (!__VLS_ctx.isEditing) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign({ class: "w-5 h-5" }, { fill: "none", stroke: "currentColor", 'stroke-width': "2", viewBox: "0 0 24 24" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
            'stroke-linecap': "round",
            'stroke-linejoin': "round",
            d: "M12 20h9",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
            'stroke-linecap': "round",
            'stroke-linejoin': "round",
            d: "M16.5 3.5a2.121 2.121 0 113 3L7 19.5 3 21l1.5-4L16.5 3.5z",
        });
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign({ class: "w-5 h-5" }, { fill: "none", stroke: "currentColor", 'stroke-width': "2", viewBox: "0 0 24 24" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
            'stroke-linecap': "round",
            'stroke-linejoin': "round",
            d: "M5 13l4 4L19 7",
        });
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: (__VLS_ctx.fecharDetalhes) }, { class: "p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-red-400 transition" }), { title: "Fechar" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign(__assign({ xmlns: 'http://www.w3.org/2000/svg' }, { class: 'w-6 h-6' }), { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        d: 'M18 6L6 18M6 6l12 12',
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex gap-2 mb-4 mt-2" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.show))
                return;
            __VLS_ctx.activeModalTab = 'detalhes';
        } }, { class: (['p-2 rounded transition', __VLS_ctx.activeModalTab === 'detalhes' ? 'text-teal-400 bg-white/10 font-bold' : 'text-slate-400 hover:text-teal-400']) }), { title: "Detalhes" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign({ class: "w-6 h-6" }, { fill: "none", stroke: "currentColor", 'stroke-width': "2", viewBox: "0 0 24 24" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
        d: "M4 16V4a2 2 0 012-2h8a2 2 0 012 2v12M4 20h16M8 20v-4a2 2 0 012-2h4a2 2 0 012 2v4",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.show))
                return;
            __VLS_ctx.activeModalTab = 'comentarios';
        } }, { class: (['p-2 rounded transition', __VLS_ctx.activeModalTab === 'comentarios' ? 'text-teal-400 bg-white/10 font-bold' : 'text-slate-400 hover:text-teal-400']) }), { title: "Comentários" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign({ class: "w-6 h-6" }, { fill: "none", stroke: "currentColor", 'stroke-width': "2", viewBox: "0 0 24 24" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
        d: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z",
    });
    if (__VLS_ctx.isAdmin) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex flex-col mb-4" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ for: "status-selector" }, { class: "block text-slate-200 mb-1 font-semibold" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex items-center gap-2" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)(__assign(__assign({ id: "status-selector", value: (__VLS_ctx.novoStatus) }, { class: "w-full px-4 py-2 rounded-lg bg-slate-900 text-white border border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400 appearance-none" }), { style: {} }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
            value: "Em Andamento",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
            value: "Concluído",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
            value: "Cancelado",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.abrirModalConfirmacao) }, { class: "px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition" }));
    }
    if (__VLS_ctx.activeModalTab === 'detalhes') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex items-center gap-4 mb-4" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex bg-slate-800/50 rounded-lg p-1" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ class: "px-4 py-1.5 rounded-md font-medium transition-all bg-gradient-to-r from-teal-600 to-cyan-500 text-white" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.switchToEtapas) }, { class: "px-4 py-1.5 rounded-md font-medium transition-all text-slate-300 hover:text-white hover:bg-white/10" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.switchToRegistros) }, { class: "px-4 py-1.5 rounded-md font-medium transition-all text-slate-300 hover:text-white hover:bg-white/10" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex items-center gap-2 mb-4" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)(__assign({ class: "text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent" }));
        (__VLS_ctx.processo.nome_acao || 'Processo sem nome');
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "mb-6" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "grid grid-cols-1 md:grid-cols-2 gap-6 text-sm mb-4" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex justify-between items-center md:col-span-2" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "text-slate-300" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "font-mono tracking-widest text-lg font-semibold text-teal-300" }));
        (__VLS_ctx.processo.codigo_da_acao || 'Não gerado');
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex justify-between items-center" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "text-slate-300" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "bg-teal-600/20 text-teal-300 px-3 py-1 rounded-full text-xs font-semibold" }));
        (__VLS_ctx.processo.area_code || 'Não definido');
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex justify-between items-center" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "text-slate-300" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.processo.ano_faf || 'Não definido');
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex justify-between items-center" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "text-slate-300" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "text-white" }));
        (__VLS_ctx.processo.tipo_natureza_despesa || 'Não definido');
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex justify-between items-center" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "text-slate-300" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.processo.forca_code || 'Não definido');
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex justify-between items-center" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "text-slate-300" }));
        if (!__VLS_ctx.isEditing) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "font-bold text-teal-400" }));
            (__VLS_ctx.formatarValor(__VLS_ctx.processo.valor_inicial_padrao || 0));
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign({ type: "number" }, { class: "bg-white/10 border border-white/20 rounded px-2 py-1 w-32 text-teal-400 font-bold" }));
            (__VLS_ctx.editableData.valor_inicial_padrao);
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex justify-between items-center" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "text-slate-300" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.formatarData(__VLS_ctx.processo.data_encaminhamento_aprovacao || __VLS_ctx.processo.created_at));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex justify-between items-center" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "text-slate-300" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.processo.codigo_transferegov || 'Não definido');
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex justify-between items-center" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "text-slate-300" }));
        if (!__VLS_ctx.isEditing) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (__VLS_ctx.processo.qtd_itens || 'Não definido');
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign({ type: "number" }, { class: "bg-white/10 border border-white/20 rounded px-2 py-1 w-24 text-white" }));
            (__VLS_ctx.editableData.qtd_itens);
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.hr)(__assign({ class: "my-4 bg-white/20 h-px border-0" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "mb-4" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "mb-2" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "text-slate-300" }));
        if (!__VLS_ctx.isEditing) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "text-white" }));
            (__VLS_ctx.processo.descricao_itens || 'Não definido');
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.textarea, __VLS_intrinsicElements.textarea)(__assign({ value: (__VLS_ctx.editableData.descricao_itens) }, { class: "bg-white/10 border border-white/20 rounded px-2 py-1 w-full text-white" }));
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "mb-2" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "text-slate-300" }));
        if (!__VLS_ctx.isEditing) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "text-white" }));
            (__VLS_ctx.processo.destinacao_itens || 'Não definido');
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.textarea, __VLS_intrinsicElements.textarea)(__assign({ value: (__VLS_ctx.editableData.destinacao_itens) }, { class: "bg-white/10 border border-white/20 rounded px-2 py-1 w-full text-white" }));
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "bg-white/5 rounded-lg p-4 mb-4" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "font-bold text-teal-400 mb-4" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "grid grid-cols-1 md:grid-cols-3 gap-4" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "bg-white/5 rounded-lg p-4 text-center" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "text-slate-300 text-xs mb-1" }));
        if (!__VLS_ctx.isEditing) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "text-green-400 font-bold text-lg" }));
            (__VLS_ctx.formatarValor(__VLS_ctx.processo.valor_rendimentos || 0));
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign({ type: "number" }, { class: "bg-white/10 border border-white/20 rounded px-2 py-1 w-full text-green-400 font-bold text-lg" }));
            (__VLS_ctx.editableData.valor_rendimentos);
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "bg-white/5 rounded-lg p-4 text-center" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "text-slate-300 text-xs mb-1" }));
        if (!__VLS_ctx.isEditing) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "text-blue-400 font-bold text-lg" }));
            (__VLS_ctx.formatarValor(__VLS_ctx.processo.valor_economicidade || 0));
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign({ type: "number" }, { class: "bg-white/10 border border-white/20 rounded px-2 py-1 w-full text-blue-400 font-bold text-lg" }));
            (__VLS_ctx.editableData.valor_economicidade);
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "bg-white/5 rounded-lg p-4 text-center" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "text-slate-300 text-xs mb-1" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "text-teal-400 font-bold text-lg" }));
        (__VLS_ctx.formatarValor(__VLS_ctx.isEditing ? __VLS_ctx.valorTotalDestinadoCalculado : __VLS_ctx.valorTotalDestinadoVisualizacao));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "mb-4" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "text-slate-300 mb-1" }));
        if (!__VLS_ctx.isEditing) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "bg-white/5 rounded px-3 py-2 text-white" }));
            (__VLS_ctx.processo.descricao_geral || 'Não definido');
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.textarea, __VLS_intrinsicElements.textarea)(__assign({ value: (__VLS_ctx.editableData.descricao_geral) }, { class: "bg-white/10 border border-white/20 rounded px-2 py-1 w-full text-white" }));
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.hr)(__assign({ class: "my-4 bg-white/20 h-px border-0" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "pt-2" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)(__assign({ class: "text-lg font-bold text-teal-400 mb-4 flex items-center gap-2" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign({ class: "w-5 h-5" }, { fill: "none", stroke: "currentColor", 'stroke-width': "2", viewBox: "0 0 24 24" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
            'stroke-linecap': "round",
            'stroke-linejoin': "round",
            d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
        });
        if (__VLS_ctx.carregandoDocumentos) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "text-center py-4" }));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400" }));
        }
        else if (__VLS_ctx.erroDocumentos) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "text-red-400 text-center py-4" }));
            (__VLS_ctx.erroDocumentos);
        }
        else if (__VLS_ctx.documentos.length === 0) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "text-center py-8 text-slate-500" }));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign({ class: "w-16 h-16 mx-auto text-slate-600 mb-4" }, { fill: "none", stroke: "currentColor", 'stroke-width': "2", viewBox: "0 0 24 24" }));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
                d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "font-semibold" }));
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-6" }));
            var _loop_1 = function (documento) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ key: (documento.id) }, { class: "bg-white/5 border border-white/10 rounded-lg p-4 flex flex-col justify-between hover:bg-white/10 transition" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex items-start gap-3 flex-1" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "w-10 h-10 bg-teal-600/10 rounded-lg flex-shrink-0 flex items-center justify-center mt-1" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign({ class: "w-6 h-6 text-teal-400" }, { fill: "none", stroke: "currentColor", 'stroke-width': "2", viewBox: "0 0 24 24" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
                    d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex flex-col flex-1 min-w-0" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)(__assign({ class: "font-semibold text-white text-sm break-words" }));
                (documento.filename);
                if (documento.description) {
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "text-xs text-slate-300 mt-1 italic break-words" }));
                    (documento.description);
                }
                __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "text-xs text-slate-400 mt-1" }));
                (__VLS_ctx.formatarTamanhoArquivo(documento.file_size));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "text-xs text-slate-500 mt-1" }));
                (documento.created_at ? __VLS_ctx.formatarData(documento.created_at) : 'Documento anexado');
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex gap-2 mt-4 self-end" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: function () {
                        var _a = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            _a[_i] = arguments[_i];
                        }
                        var $event = _a[0];
                        if (!(__VLS_ctx.show))
                            return;
                        if (!(__VLS_ctx.activeModalTab === 'detalhes'))
                            return;
                        if (!!(__VLS_ctx.carregandoDocumentos))
                            return;
                        if (!!(__VLS_ctx.erroDocumentos))
                            return;
                        if (!!(__VLS_ctx.documentos.length === 0))
                            return;
                        __VLS_ctx.visualizarArquivo(documento.file_url);
                    } }, { class: "px-3 py-2 bg-gradient-to-r from-teal-600 to-cyan-500 text-white text-sm rounded font-semibold hover:from-teal-700 hover:to-cyan-600 transition flex items-center gap-1" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: function () {
                        var _a = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            _a[_i] = arguments[_i];
                        }
                        var $event = _a[0];
                        if (!(__VLS_ctx.show))
                            return;
                        if (!(__VLS_ctx.activeModalTab === 'detalhes'))
                            return;
                        if (!!(__VLS_ctx.carregandoDocumentos))
                            return;
                        if (!!(__VLS_ctx.erroDocumentos))
                            return;
                        if (!!(__VLS_ctx.documentos.length === 0))
                            return;
                        __VLS_ctx.baixarArquivo(documento.file_url, documento.filename);
                    } }, { class: "px-3 py-2 border border-white/20 text-slate-300 hover:bg-white/10 bg-transparent text-sm rounded font-semibold transition flex items-center gap-1" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: function () {
                        var _a = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            _a[_i] = arguments[_i];
                        }
                        var $event = _a[0];
                        if (!(__VLS_ctx.show))
                            return;
                        if (!(__VLS_ctx.activeModalTab === 'detalhes'))
                            return;
                        if (!!(__VLS_ctx.carregandoDocumentos))
                            return;
                        if (!!(__VLS_ctx.erroDocumentos))
                            return;
                        if (!!(__VLS_ctx.documentos.length === 0))
                            return;
                        __VLS_ctx.excluirDocumento(documento);
                    } }, { class: "p-2 border border-red-500/50 text-red-400 hover:bg-red-500/20 bg-transparent rounded font-semibold transition flex items-center" }), { title: "Excluir Documento" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign({ class: "w-4 h-4" }, { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
                    'stroke-linecap': "round",
                    'stroke-linejoin': "round",
                    'stroke-width': "2",
                    d: "M3 6l3 18h6l3-18H3zM5 6h14M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m-6 6v6m4-6v6",
                });
            };
            for (var _i = 0, _j = __VLS_getVForSourceType((__VLS_ctx.documentos)); _i < _j.length; _i++) {
                var documento = _j[_i][0];
                _loop_1(documento);
            }
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "mt-6 pt-6 border-t border-white/10" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)(__assign({ class: "font-semibold text-white mb-3" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "space-y-4" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign(__assign({ ref: "dropZoneModalRef" }, { class: "p-4 border-2 border-dashed rounded-lg transition-colors" }), { class: (__VLS_ctx.isOverModal ? 'border-teal-400 bg-teal-500/10' : 'border-white/20') }));
        /** @type {typeof __VLS_ctx.dropZoneModalRef} */ ;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex items-center gap-4" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ for: "novo-anexo-input" }, { class: "px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white font-semibold cursor-pointer hover:bg-white/20 transition" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign(__assign({ onChange: (__VLS_ctx.onNovoAnexoChange) }, { id: "novo-anexo-input", type: "file" }), { class: "hidden" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "text-sm text-slate-300 truncate" }));
        (((_a = __VLS_ctx.novoAnexo) === null || _a === void 0 ? void 0 : _a.name) || 'Arraste um arquivo aqui...');
        __VLS_asFunctionalElement(__VLS_intrinsicElements.textarea, __VLS_intrinsicElements.textarea)(__assign({ value: (__VLS_ctx.novoAnexoDesc), placeholder: "Descrição do anexo (opcional)", rows: "2" }, { class: "w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex items-center gap-4" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: (__VLS_ctx.adicionarAnexo) }, { disabled: (__VLS_ctx.uploadLoading || !__VLS_ctx.novoAnexo) }), { class: "px-5 py-2 bg-gradient-to-r from-teal-600 to-cyan-500 text-white rounded-lg font-semibold shadow disabled:opacity-50 disabled:cursor-not-allowed transition" }));
        if (__VLS_ctx.uploadLoading) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "w-5 h-5 border-b-2 border-white rounded-full animate-spin" }));
        }
        if (__VLS_ctx.uploadError) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "text-red-400 text-sm" }));
            (__VLS_ctx.uploadError);
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex justify-between mt-6 w-full" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: (__VLS_ctx.gerarRelatorioPDF) }, { disabled: (__VLS_ctx.gerandoPDF) }), { class: "px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-500 text-white rounded font-bold shadow disabled:opacity-50 disabled:cursor-not-allowed transition" }));
        if (__VLS_ctx.gerandoPDF) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.fecharDetalhes) }, { class: "px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-500 text-white rounded font-bold shadow hover:from-teal-700 hover:to-cyan-600 transition" }));
        if (__VLS_ctx.editError) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "text-red-500 text-sm mt-2" }));
            (__VLS_ctx.editError);
        }
    }
    else if (__VLS_ctx.activeModalTab === 'comentarios') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "mb-4" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)(__assign({ class: "text-lg font-bold text-teal-400 mb-2 flex items-center gap-2" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign({ class: "w-5 h-5" }, { fill: "none", stroke: "currentColor", 'stroke-width': "2", viewBox: "0 0 24 24" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
            'stroke-linecap': "round",
            'stroke-linejoin': "round",
            d: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z",
        });
        if (__VLS_ctx.loadingComments) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "text-center py-4" }));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400" }));
        }
        else if (__VLS_ctx.comments.length === 0) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "text-slate-400 text-center py-4" }));
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "space-y-4 max-h-64 overflow-y-auto" }));
            var _loop_2 = function (comment) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ key: (comment.id) }, { class: "flex items-start gap-3 py-3 border-b border-white/10" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex-shrink-0 w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center font-bold" }));
                (((_c = (_b = comment.profiles) === null || _b === void 0 ? void 0 : _b.nome) === null || _c === void 0 ? void 0 : _c.charAt(0)) || 'U');
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex-1" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex justify-between items-center" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "font-semibold text-white" }));
                (((_d = comment.profiles) === null || _d === void 0 ? void 0 : _d.nome) || 'Usuário');
                if (__VLS_ctx.user && __VLS_ctx.user.id === comment.user_id && __VLS_ctx.editingCommentId !== comment.id) {
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex items-center gap-2" }));
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: function () {
                            var _a = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                _a[_i] = arguments[_i];
                            }
                            var $event = _a[0];
                            if (!(__VLS_ctx.show))
                                return;
                            if (!!(__VLS_ctx.activeModalTab === 'detalhes'))
                                return;
                            if (!(__VLS_ctx.activeModalTab === 'comentarios'))
                                return;
                            if (!!(__VLS_ctx.loadingComments))
                                return;
                            if (!!(__VLS_ctx.comments.length === 0))
                                return;
                            if (!(__VLS_ctx.user && __VLS_ctx.user.id === comment.user_id && __VLS_ctx.editingCommentId !== comment.id))
                                return;
                            __VLS_ctx.startEdit(comment);
                        } }, { title: "Editar" }));
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign({ class: "w-4 h-4 text-slate-400 hover:text-teal-400" }, { fill: "none", stroke: "currentColor", 'stroke-width': "2", viewBox: "0 0 24 24" }));
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
                        'stroke-linecap': "round",
                        'stroke-linejoin': "round",
                        d: "M15.232 5.232l3.536 3.536M9 11l6 6M3 17v4h4l10.293-10.293a1 1 0 00-1.414-1.414L3 17z",
                    });
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: function () {
                            var _a = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                _a[_i] = arguments[_i];
                            }
                            var $event = _a[0];
                            if (!(__VLS_ctx.show))
                                return;
                            if (!!(__VLS_ctx.activeModalTab === 'detalhes'))
                                return;
                            if (!(__VLS_ctx.activeModalTab === 'comentarios'))
                                return;
                            if (!!(__VLS_ctx.loadingComments))
                                return;
                            if (!!(__VLS_ctx.comments.length === 0))
                                return;
                            if (!(__VLS_ctx.user && __VLS_ctx.user.id === comment.user_id && __VLS_ctx.editingCommentId !== comment.id))
                                return;
                            __VLS_ctx.deleteComment(comment.id);
                        } }, { title: "Excluir" }));
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign({ class: "w-4 h-4 text-slate-400 hover:text-red-400" }, { fill: "none", stroke: "currentColor", 'stroke-width': "2", viewBox: "0 0 24 24" }));
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
                        'stroke-linecap': "round",
                        'stroke-linejoin': "round",
                        d: "M6 18L18 6M6 6l12 12",
                    });
                }
                __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "text-xs text-slate-500" }));
                (__VLS_ctx.formatarData(comment.created_at));
                if (__VLS_ctx.editingCommentId !== comment.id) {
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "text-slate-200 mt-2 whitespace-pre-wrap" }));
                    (comment.comment_text);
                }
                else {
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "mt-2" }));
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.textarea, __VLS_intrinsicElements.textarea)(__assign({ value: (__VLS_ctx.editingCommentText), rows: "3" }, { class: "w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm" }));
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex gap-2 mt-2" }));
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.saveComment) }, { class: "px-3 py-1 bg-teal-600 text-white rounded font-bold" }));
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.cancelEdit) }, { class: "px-3 py-1 bg-slate-600 text-white rounded font-bold" }));
                }
            };
            for (var _k = 0, _l = __VLS_getVForSourceType((__VLS_ctx.comments)); _k < _l.length; _k++) {
                var comment = _l[_k][0];
                _loop_2(comment);
            }
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "mt-6" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.textarea, __VLS_intrinsicElements.textarea)(__assign({ ref: "newCommentTextarea", value: (__VLS_ctx.newComment), rows: "2", placeholder: "Escreva um comentário..." }, { class: "w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400" }));
        /** @type {typeof __VLS_ctx.newCommentTextarea} */ ;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex justify-end mt-2" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: (__VLS_ctx.postComment) }, { disabled: (!__VLS_ctx.newComment.trim()) }), { class: "px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-500 text-white rounded font-bold shadow disabled:opacity-50 disabled:cursor-not-allowed transition" }));
    }
    /** @type {[typeof ConfirmationModal, ]} */ ;
    // @ts-ignore
    var __VLS_0 = __VLS_asFunctionalComponent(ConfirmationModal, new ConfirmationModal(__assign(__assign({ 'onConfirm': {} }, { 'onCancel': {} }), { show: (__VLS_ctx.showConfirmationModal), title: "Confirmação de Alteração de Status", message: (__VLS_ctx.confirmationMessage) })));
    var __VLS_1 = __VLS_0.apply(void 0, __spreadArray([__assign(__assign({ 'onConfirm': {} }, { 'onCancel': {} }), { show: (__VLS_ctx.showConfirmationModal), title: "Confirmação de Alteração de Status", message: (__VLS_ctx.confirmationMessage) })], __VLS_functionalComponentArgsRest(__VLS_0), false));
    var __VLS_3 = void 0;
    var __VLS_4 = void 0;
    var __VLS_5 = void 0;
    var __VLS_6 = {
        onConfirm: (__VLS_ctx.handleConfirmation)
    };
    var __VLS_7 = {
        onCancel: (__VLS_ctx.handleCancellation)
    };
    var __VLS_2;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ style: {} }));
    if (__VLS_ctx.dadosRelatorio) {
        /** @type {[typeof RelatorioProcesso, ]} */ ;
        // @ts-ignore
        var __VLS_8 = __VLS_asFunctionalComponent(RelatorioProcesso, new RelatorioProcesso(__assign(__assign({}, (__VLS_ctx.dadosRelatorio)), { responsavelNome: (__VLS_ctx.processo.responsavel_nome || __VLS_ctx.processo.nome_responsavel || ((_e = __VLS_ctx.processo.profiles) === null || _e === void 0 ? void 0 : _e.nome) || '') })));
        var __VLS_9 = __VLS_8.apply(void 0, __spreadArray([__assign(__assign({}, (__VLS_ctx.dadosRelatorio)), { responsavelNome: (__VLS_ctx.processo.responsavel_nome || __VLS_ctx.processo.nome_responsavel || ((_f = __VLS_ctx.processo.profiles) === null || _f === void 0 ? void 0 : _f.nome) || '') })], __VLS_functionalComponentArgsRest(__VLS_8), false));
    }
}
/** @type {__VLS_StyleScopedClasses['fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['z-50']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-opacity-40']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-br']} */ ;
/** @type {__VLS_StyleScopedClasses['from-slate-900/95']} */ ;
/** @type {__VLS_StyleScopedClasses['to-blue-900/95']} */ ;
/** @type {__VLS_StyleScopedClasses['backdrop-blur-md']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['p-8']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-4xl']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['max-h-[90vh]']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-y-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['top-4']} */ ;
/** @type {__VLS_StyleScopedClasses['right-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['z-20']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-red-400']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['w-6']} */ ;
/** @type {__VLS_StyleScopedClasses['h-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['w-6']} */ ;
/** @type {__VLS_StyleScopedClasses['h-6']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['w-6']} */ ;
/** @type {__VLS_StyleScopedClasses['h-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-900']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['appearance-none']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-red-600']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-red-700']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-800/50']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-1']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
/** @type {__VLS_StyleScopedClasses['from-teal-600']} */ ;
/** @type {__VLS_StyleScopedClasses['to-cyan-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-300']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-300']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
/** @type {__VLS_StyleScopedClasses['from-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['to-cyan-300']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-clip-text']} */ ;
/** @type {__VLS_StyleScopedClasses['text-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['md:col-span-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-300']} */ ;
/** @type {__VLS_StyleScopedClasses['font-mono']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-widest']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-teal-300']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-300']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-teal-600/20']} */ ;
/** @type {__VLS_StyleScopedClasses['text-teal-300']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-300']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-300']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-300']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-300']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['w-32']} */ ;
/** @type {__VLS_StyleScopedClasses['text-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-300']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-300']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-300']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['w-24']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['my-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['h-px']} */ ;
/** @type {__VLS_StyleScopedClasses['border-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-300']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-300']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/5']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-3']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/5']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-300']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-green-400']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-green-400']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/5']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-300']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-400']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-400']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/5']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-300']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-300']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/5']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['my-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['h-px']} */ ;
/** @type {__VLS_StyleScopedClasses['border-0']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-block']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-8']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-500']} */ ;
/** @type {__VLS_StyleScopedClasses['w-16']} */ ;
/** @type {__VLS_StyleScopedClasses['h-16']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-600']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/5']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-start']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['w-10']} */ ;
/** @type {__VLS_StyleScopedClasses['h-10']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-teal-600/10']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['w-6']} */ ;
/** @type {__VLS_StyleScopedClasses['h-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-0']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['break-words']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-300']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['italic']} */ ;
/** @type {__VLS_StyleScopedClasses['break-words']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-500']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['self-end']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
/** @type {__VLS_StyleScopedClasses['from-teal-600']} */ ;
/** @type {__VLS_StyleScopedClasses['to-cyan-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:from-teal-700']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:to-cyan-600']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-300']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-red-500/50']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-400']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-red-500/20']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-6']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-6']} */ ;
/** @type {__VLS_StyleScopedClasses['border-t']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['border-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-dashed']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-300']} */ ;
/** @type {__VLS_StyleScopedClasses['truncate']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['placeholder:text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['px-5']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
/** @type {__VLS_StyleScopedClasses['from-teal-600']} */ ;
/** @type {__VLS_StyleScopedClasses['to-cyan-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:opacity-50']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:cursor-not-allowed']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-6']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
/** @type {__VLS_StyleScopedClasses['from-teal-600']} */ ;
/** @type {__VLS_StyleScopedClasses['to-cyan-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:opacity-50']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:cursor-not-allowed']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
/** @type {__VLS_StyleScopedClasses['from-teal-600']} */ ;
/** @type {__VLS_StyleScopedClasses['to-cyan-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:from-teal-700']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:to-cyan-600']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-block']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['max-h-64']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-y-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-start']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-10']} */ ;
/** @type {__VLS_StyleScopedClasses['h-10']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-700']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-red-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['whitespace-pre-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-teal-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-6']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['placeholder:text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
/** @type {__VLS_StyleScopedClasses['from-teal-600']} */ ;
/** @type {__VLS_StyleScopedClasses['to-cyan-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:opacity-50']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:cursor-not-allowed']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
var __VLS_dollars;
var __VLS_self = (await import('vue')).defineComponent({
    setup: function () {
        return {
            RelatorioProcesso: RelatorioProcesso,
            ConfirmationModal: ConfirmationModal,
            novoStatus: novoStatus,
            showConfirmationModal: showConfirmationModal,
            confirmationMessage: confirmationMessage,
            activeModalTab: activeModalTab,
            documentos: documentos,
            carregandoDocumentos: carregandoDocumentos,
            erroDocumentos: erroDocumentos,
            isEditing: isEditing,
            editLoading: editLoading,
            editError: editError,
            editableData: editableData,
            novoAnexo: novoAnexo,
            novoAnexoDesc: novoAnexoDesc,
            uploadLoading: uploadLoading,
            uploadError: uploadError,
            isOverModal: isOverModal,
            dropZoneModalRef: dropZoneModalRef,
            user: user,
            isAdmin: isAdmin,
            comments: comments,
            loadingComments: loadingComments,
            newComment: newComment,
            newCommentTextarea: newCommentTextarea,
            editingCommentId: editingCommentId,
            editingCommentText: editingCommentText,
            gerandoPDF: gerandoPDF,
            dadosRelatorio: dadosRelatorio,
            abrirModalConfirmacao: abrirModalConfirmacao,
            handleConfirmation: handleConfirmation,
            handleCancellation: handleCancellation,
            formatarValor: formatarValor,
            formatarData: formatarData,
            formatarTamanhoArquivo: formatarTamanhoArquivo,
            valorTotalDestinadoCalculado: valorTotalDestinadoCalculado,
            valorTotalDestinadoVisualizacao: valorTotalDestinadoVisualizacao,
            adicionarAnexo: adicionarAnexo,
            onNovoAnexoChange: onNovoAnexoChange,
            visualizarArquivo: visualizarArquivo,
            baixarArquivo: baixarArquivo,
            excluirDocumento: excluirDocumento,
            postComment: postComment,
            startEdit: startEdit,
            cancelEdit: cancelEdit,
            saveComment: saveComment,
            deleteComment: deleteComment,
            iniciarEdicao: iniciarEdicao,
            salvarAlteracoes: salvarAlteracoes,
            fecharDetalhes: fecharDetalhes,
            switchToEtapas: switchToEtapas,
            switchToRegistros: switchToRegistros,
            gerarRelatorioPDF: gerarRelatorioPDF,
        };
    },
    emits: {},
    props: {
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
    },
});
export default (await import('vue')).defineComponent({
    setup: function () {
        return {};
    },
    emits: {},
    props: {
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
    },
});
; /* PartiallyEnd: #4569/main.vue */
