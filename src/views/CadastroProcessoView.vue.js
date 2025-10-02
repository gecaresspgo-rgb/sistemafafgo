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
import Layout from '../components/Layout.vue';
import { ref, onMounted, computed, watch } from 'vue';
import { useDropZone } from '@vueuse/core';
import { supabase } from '../services/supabase';
import { useAuth } from '../composables/useAuth';
import { buscarForcasResponsaveis, buscarAreasTematicas, registrarEventoHistorico, } from '../services/auth';
import { useFormatters } from '@/composables/useFormatters';
function parseCurrency(value) {
    if (!value)
        return 0;
    // Remove "R$", espaços, pontos de milhar e troca a vírgula do decimal por ponto.
    var numberString = value.replace(/R\$\s?/, '').replace(/\./g, '').replace(',', '.');
    return parseFloat(numberString) || 0;
}
var anoAtual = new Date().getFullYear();
var anos = Array.from({ length: anoAtual - 2019 + 1 }, function (_, i) { return 2019 + i; });
// Mapeamento de anos para áreas temáticas permitidas
var areasPorAno = {
    '2019': ['ECV', 'VPSP'],
    '2020': ['ECV', 'VPSP'],
    '2021': ['FISP', 'VPSP'],
    '2022': ['FISP', 'VPSP']
    // A partir de 2023, a lógica será tratada no computed
};
// Campos do formulário
var nomeAcao = ref('');
var areaTematica = ref('');
var codigoTransferegov = ref('');
var anoFaf = ref('');
var tipoNatureza = ref('');
var forcaResponsavel = ref('');
var dataCriacao = ref('');
var quantidadeItens = ref('');
var descricaoItens = ref('');
var destinacaoItens = ref('');
var valor = ref('');
var valorRendimentos = ref('');
var valorEconomicidade = ref('');
var descricaoGeral = ref('');
var feedback = ref('');
var loading = ref(false);
var arquivos = ref([]);
var areaTematicaId = ref('');
var forcaResponsavelId = ref('');
var actionId = ref('');
var areasTematicas = ref([]);
var forcasResponsaveis = ref([]);
var acoesDisponiveis = ref([]);
var dropZoneRef = ref(null);
var fileUpload = ref(null);
var codigoAcaoPrevisto = ref('.... .. .. .. ...'); // Placeholder
var isLoadingCodigo = ref(false);
// Estado reativo para economicidade
var saldoEconomicidadeDisponivel = ref(0);
var isLoadingSaldo = ref(false);
var economicidadeExcedeSaldo = computed(function () {
    // Se não houver valor, retorna false.
    if (!valorEconomicidade.value) {
        return false;
    }
    // Converte o valor para número antes de comparar
    return Number(valorEconomicidade.value) > saldoEconomicidadeDisponivel.value;
});
var formatarMoeda = useFormatters().formatarValor;
var feedbackErroEconomicidade = ref('');
var valorTotal = computed(function () {
    var v1 = parseCurrency(valor.value);
    var v2 = parseCurrency(valorRendimentos.value);
    var v3 = parseCurrency(valorEconomicidade.value);
    return v1 + v2 + v3;
});
function onDrop(files) {
    if (files) {
        arquivos.value = files.map(function (file) { return ({ file: file, description: '' }); });
    }
}
var isOver = ref(false); // Declare isOver como uma ref inicializada com false
useDropZone(dropZoneRef, {
    onDrop: onDrop,
    // Adiciona callbacks para atualizar isOver
    onOver: function () { isOver.value = true; },
    onLeave: function () { isOver.value = false; }
});
var _a = useAuth(), user = _a.user, fetchUser = _a.fetchUser;
// Variável computada para filtrar as áreas temáticas
var areasTematicasFiltradas = computed(function () {
    // Se nenhum ano foi selecionado, não mostre nenhuma área
    if (!anoFaf.value) {
        return [];
    }
    var anoSelecionado = Number(anoFaf.value);
    var codigosPermitidos = [];
    // Define os códigos permitidos com base no ano
    if (anoSelecionado >= 2023) {
        codigosPermitidos = ['EVM', 'MQV', 'RMVI'];
    }
    else if (areasPorAno[anoSelecionado]) {
        codigosPermitidos = areasPorAno[anoSelecionado];
    }
    // Filtra a lista completa de áreas temáticas (buscada do banco)
    return areasTematicas.value.filter(function (area) { return codigosPermitidos.includes(area.code); });
});
// Observador para limpar a área temática ao mudar o ano
watch(anoFaf, function () {
    // Limpa o valor selecionado da área temática
    areaTematicaId.value = '';
});
// Watcher para buscar saldo quando campos relevantes mudarem
watch([anoFaf, areaTematicaId, tipoNatureza], function () {
    fetchSaldoEconomicidade();
}, { immediate: true });
// Watcher para validar economicidade quando valor mudar
watch(valorEconomicidade, function () {
    validateEconomicidadeEntrada();
});
function carregarAcoes() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, supabase
                            .from('actions')
                            .select('id, name, action_code')
                            .order('action_code')];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        console.error('Erro ao carregar ações:', error);
                        return [2 /*return*/];
                    }
                    if (data) {
                        acoesDisponiveis.value = data;
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _b.sent();
                    console.error('Erro ao carregar ações:', error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
var codigoAcaoParcial = computed(function () {
    var ano = anoFaf.value || '....';
    // ✨ CORREÇÃO: Removemos o .padStart() para usar apenas 1 dígito
    var area = areaTematicaId.value ? String(areaTematicaId.value) : '..';
    // ✨ CORREÇÃO: Alterado para 1 dígito
    var natureza = tipoNatureza.value === 'Custeio' ? '3' : (tipoNatureza.value === 'Investimento' ? '4' : '.');
    // ✨ CORREÇÃO: Removemos o .padStart() para usar apenas 1 dígito
    var forca = forcaResponsavelId.value ? String(forcaResponsavelId.value) : '.';
    // A função que busca o sequencial ('fetchProximoSequencial') não precisa de alterações.
    return "".concat(ano, ".").concat(area, ".").concat(natureza, ".").concat(forca, ".");
});
function fetchProximoSequencial() {
    return __awaiter(this, void 0, void 0, function () {
        var ano, areaId, natureza, forcaId, anoPart, areaPart, naturezaPart, forcaPart, _a, sequencial, error, e_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    ano = anoFaf.value;
                    areaId = areaTematicaId.value;
                    natureza = tipoNatureza.value;
                    forcaId = forcaResponsavelId.value;
                    anoPart = ano || '....';
                    areaPart = areaId ? String(areaId) : '.';
                    naturezaPart = natureza === 'Custeio' ? '3' : (natureza === 'Investimento' ? '4' : '.');
                    forcaPart = forcaId ? String(forcaId) : '.';
                    // Condição para buscar o sequencial: só busca se os campos chave estiverem preenchidos
                    if (!ano || !areaId) {
                        codigoAcaoPrevisto.value = "".concat(anoPart, ".").concat(areaPart, ".").concat(naturezaPart, ".").concat(forcaPart, ".ERR");
                        return [2 /*return*/];
                    }
                    isLoadingCodigo.value = true;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, supabase.rpc('prever_codigo_da_acao', {
                            p_ano_faf: Number(ano),
                            p_thematic_area_id: Number(areaId)
                        })];
                case 2:
                    _a = _b.sent(), sequencial = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    // Monta o código final completo com o sequencial retornado
                    if (sequencial) {
                        codigoAcaoPrevisto.value = "".concat(anoPart, ".").concat(areaPart, ".").concat(naturezaPart, ".").concat(forcaPart, ".").concat(sequencial);
                    }
                    else {
                        // Se a RPC retornar nulo por algum motivo, mostramos NULL na prévia
                        codigoAcaoPrevisto.value = "".concat(anoPart, ".").concat(areaPart, ".").concat(naturezaPart, ".").concat(forcaPart, ".NULL");
                    }
                    return [3 /*break*/, 5];
                case 3:
                    e_1 = _b.sent();
                    console.error("Erro ao prever código da ação:", e_1);
                    codigoAcaoPrevisto.value = "".concat(anoPart, ".").concat(areaPart, ".").concat(naturezaPart, ".").concat(forcaPart, ".ERR");
                    return [3 /*break*/, 5];
                case 4:
                    isLoadingCodigo.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// Chame a função sempre que os campos relevantes mudarem
watch([anoFaf, areaTematicaId, tipoNatureza, forcaResponsavelId], fetchProximoSequencial);
// Função para buscar saldo de economicidade via RPC do Supabase
function fetchSaldoEconomicidade() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    feedbackErroEconomicidade.value = '';
                    if (!anoFaf.value || !areaTematicaId.value || !tipoNatureza.value) {
                        saldoEconomicidadeDisponivel.value = 0;
                        return [2 /*return*/];
                    }
                    isLoadingSaldo.value = true;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, supabase.rpc('get_saldo_economicidade_disponivel', {
                            p_ano_faf: Number(anoFaf.value),
                            p_thematic_area_id: Number(areaTematicaId.value),
                            p_tipo_natureza_despesa: tipoNatureza.value,
                            p_processo_id_excluir: null
                        })];
                case 2:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        console.error('Erro ao buscar saldo de economicidade:', error);
                        saldoEconomicidadeDisponivel.value = 0;
                        feedbackErroEconomicidade.value = 'Erro ao carregar saldo: ' + error.message;
                    }
                    else {
                        saldoEconomicidadeDisponivel.value = data || 0;
                    }
                    return [3 /*break*/, 5];
                case 3:
                    error_2 = _b.sent();
                    console.error('Erro inesperado ao buscar saldo:', error_2);
                    saldoEconomicidadeDisponivel.value = 0;
                    feedbackErroEconomicidade.value = 'Erro inesperado ao carregar saldo: ' + error_2.message;
                    return [3 /*break*/, 5];
                case 4:
                    isLoadingSaldo.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// Função para validar se o valor de economicidade excede o saldo disponível
function validateEconomicidadeEntrada() {
    // A computada 'economicidadeExcedeSaldo' já fez o cálculo e tem o valor true/false.
    // Nós apenas lemos o resultado dela para definir a mensagem de feedback.
    if (economicidadeExcedeSaldo.value) {
        feedbackErroEconomicidade.value = 'O valor de Economicidade de Entrada excede o saldo disponível. Por favor, ajuste o valor.';
    }
    else {
        // Se não excede, limpa o feedback de erro específico da economicidade.
        feedbackErroEconomicidade.value = '';
    }
}
onMounted(function () { return __awaiter(void 0, void 0, void 0, function () {
    var areas, forcas;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, buscarAreasTematicas()];
            case 1:
                areas = (_a.sent()).data;
                if (areas)
                    areasTematicas.value = areas;
                return [4 /*yield*/, buscarForcasResponsaveis()];
            case 2:
                forcas = (_a.sent()).data;
                if (forcas)
                    forcasResponsaveis.value = forcas;
                return [4 /*yield*/, carregarAcoes()];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
function registrarProcesso() {
    return __awaiter(this, void 0, void 0, function () {
        var usuario, _a, data, error, processoId, arquivosEnviados, arquivosComErro, _i, _b, item, filePath, _c, uploadData, uploadError, urlData, fileUrl, _d, insertData, insertError, error_3;
        var _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    feedback.value = '';
                    feedbackErroEconomicidade.value = '';
                    loading.value = true;
                    // Validação final antes de enviar
                    validateEconomicidadeEntrada();
                    if (economicidadeExcedeSaldo.value) {
                        loading.value = false;
                        return [2 /*return*/];
                    }
                    usuario = user.value;
                    if (!!usuario) return [3 /*break*/, 2];
                    return [4 /*yield*/, fetchUser()];
                case 1:
                    usuario = _f.sent();
                    _f.label = 2;
                case 2:
                    if (!usuario) {
                        feedback.value = 'Usuário não autenticado.';
                        loading.value = false;
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, supabase
                            .from('processes')
                            .insert([
                            {
                                user_id: usuario.id,
                                nome_acao: nomeAcao.value,
                                thematic_area_id: Number(areaTematicaId.value),
                                ano_faf: anoFaf.value ? Number(anoFaf.value) : null,
                                tipo_natureza_despesa: tipoNatureza.value,
                                responsible_force_id: Number(forcaResponsavelId.value),
                                valor_inicial_padrao: valor.value ? Number(valor.value) : null,
                                data_encaminhamento_aprovacao: dataCriacao.value || null,
                                codigo_transferegov: codigoTransferegov.value,
                                qtd_itens: quantidadeItens.value ? Number(quantidadeItens.value) : null,
                                descricao_itens: descricaoItens.value,
                                destinacao_itens: destinacaoItens.value,
                                valor_rendimentos: valorRendimentos.value ? Number(valorRendimentos.value) : null,
                                valor_economicidade: valorEconomicidade.value ? Number(valorEconomicidade.value) : null,
                                valor_total_destinado: valorTotal.value,
                                descricao_geral: descricaoGeral.value,
                                action_id: actionId.value || null,
                            },
                        ])
                            .select('id')];
                case 3:
                    _a = _f.sent(), data = _a.data, error = _a.error;
                    if (error || !data || !((_e = data[0]) === null || _e === void 0 ? void 0 : _e.id)) {
                        feedback.value = 'Erro ao registrar processo: ' + ((error === null || error === void 0 ? void 0 : error.message) || 'ID não retornado');
                        loading.value = false;
                        return [2 /*return*/];
                    }
                    processoId = data[0].id;
                    // Registrar evento no histórico
                    return [4 /*yield*/, registrarEventoHistorico(processoId, 'Processo criado.')
                        // 2. Upload dos arquivos e vinculação na tabela documents
                    ];
                case 4:
                    // Registrar evento no histórico
                    _f.sent();
                    arquivosEnviados = 0;
                    arquivosComErro = 0;
                    console.log('Iniciando upload de arquivos:', arquivos.value.length, 'arquivos');
                    _i = 0, _b = arquivos.value;
                    _f.label = 5;
                case 5:
                    if (!(_i < _b.length)) return [3 /*break*/, 14];
                    item = _b[_i];
                    _f.label = 6;
                case 6:
                    _f.trys.push([6, 12, , 13]);
                    console.log('Processando arquivo:', item.file.name, 'Tamanho:', item.file.size, 'Tipo:', item.file.type);
                    // Verificar se o arquivo é válido
                    if (!item.file || item.file.size === 0) {
                        console.error('Arquivo inválido:', item.file);
                        arquivosComErro++;
                        feedback.value += "\nArquivo inv\u00E1lido: ".concat(item.file.name);
                        return [3 /*break*/, 13];
                    }
                    filePath = "".concat(processoId, "/").concat(Date.now(), "_").concat(item.file.name.replace(/[^a-zA-Z0-9.-]/g, '_'));
                    console.log('Caminho do arquivo:', filePath);
                    return [4 /*yield*/, supabase.storage
                            .from('documents')
                            .upload(filePath, item.file, {
                            cacheControl: '3600',
                            upsert: false,
                        })];
                case 7:
                    _c = _f.sent(), uploadData = _c.data, uploadError = _c.error;
                    if (uploadError) {
                        console.error('Erro no upload:', uploadError);
                        arquivosComErro++;
                        feedback.value += "\nFalha ao enviar ".concat(item.file.name, ": ").concat(uploadError.message);
                        return [3 /*break*/, 13];
                    }
                    console.log('Upload bem-sucedido:', uploadData);
                    urlData = supabase.storage.from('documents').getPublicUrl(filePath).data;
                    fileUrl = urlData.publicUrl;
                    console.log('URL pública:', fileUrl);
                    return [4 /*yield*/, supabase.from('documents').insert([
                            {
                                process_id: processoId,
                                filename: item.file.name,
                                file_url: fileUrl,
                                file_size: item.file.size,
                                mime_type: item.file.type,
                                storage_path: filePath,
                                description: item.description,
                            },
                        ])];
                case 8:
                    _d = _f.sent(), insertData = _d.data, insertError = _d.error;
                    if (!insertError) return [3 /*break*/, 10];
                    console.error('Erro ao inserir no banco:', insertError);
                    arquivosComErro++;
                    feedback.value += "\nFalha ao registrar ".concat(item.file.name, " no banco: ").concat(insertError.message);
                    // Tentar deletar o arquivo do storage se falhou no banco
                    return [4 /*yield*/, supabase.storage.from('documents').remove([filePath])];
                case 9:
                    // Tentar deletar o arquivo do storage se falhou no banco
                    _f.sent();
                    return [3 /*break*/, 11];
                case 10:
                    console.log('Inserção no banco bem-sucedida:', insertData);
                    arquivosEnviados++;
                    _f.label = 11;
                case 11: return [3 /*break*/, 13];
                case 12:
                    error_3 = _f.sent();
                    console.error('Erro geral no processamento do arquivo:', error_3);
                    arquivosComErro++;
                    feedback.value += "\nErro inesperado ao processar ".concat(item.file.name, ": ").concat(error_3.message);
                    return [3 /*break*/, 13];
                case 13:
                    _i++;
                    return [3 /*break*/, 5];
                case 14:
                    // Feedback final
                    if (arquivos.value.length > 0) {
                        if (arquivosEnviados > 0) {
                            feedback.value = "Processo cadastrado com sucesso! ".concat(arquivosEnviados, " arquivo(s) anexado(s).");
                        }
                        if (arquivosComErro > 0) {
                            feedback.value += "\n".concat(arquivosComErro, " arquivo(s) com erro no envio.");
                        }
                    }
                    else {
                        feedback.value = 'Processo cadastrado com sucesso!';
                    }
                    limparFormulario();
                    arquivos.value = [];
                    loading.value = false;
                    return [2 /*return*/];
            }
        });
    });
}
function limparFormulario() {
    nomeAcao.value = '';
    areaTematica.value = '';
    codigoTransferegov.value = '';
    anoFaf.value = '';
    tipoNatureza.value = '';
    forcaResponsavel.value = '';
    dataCriacao.value = '';
    quantidadeItens.value = '';
    descricaoItens.value = '';
    destinacaoItens.value = '';
    valor.value = '';
    valorRendimentos.value = '';
    valorEconomicidade.value = '';
    descricaoGeral.value = '';
    areaTematicaId.value = '';
    forcaResponsavelId.value = '';
    actionId.value = '';
    feedbackErroEconomicidade.value = '';
}
function handleFileSelected(event) {
    var target = event.target;
    if (target.files) {
        arquivos.value = Array.from(target.files).map(function (file) { return ({
            file: file,
            description: ''
        }); });
    }
    else {
        arquivos.value = [];
    }
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = {};
var __VLS_components;
var __VLS_directives;
/** @type {[typeof Layout, typeof Layout, ]} */ ;
// @ts-ignore
var __VLS_0 = __VLS_asFunctionalComponent(Layout, new Layout({}));
var __VLS_1 = __VLS_0.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_0), false));
var __VLS_3 = {};
__VLS_2.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "max-w-3xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-xl p-8 mt-8" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)(__assign({ class: "text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent mb-6" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.form, __VLS_intrinsicElements.form)(__assign({ onSubmit: (__VLS_ctx.registrarProcesso) }, { class: "flex flex-col gap-6" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "block text-slate-200 mb-1 font-semibold" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign(__assign({ value: (__VLS_ctx.nomeAcao), type: "text" }, { class: "w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400" }), { placeholder: "Digite o nome da ação" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "grid grid-cols-1 md:grid-cols-2 gap-6" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "block text-slate-200 mb-1 font-semibold" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)(__assign(__assign({ value: (__VLS_ctx.anoFaf) }, { class: "w-full px-4 py-2 rounded-lg bg-slate-900 text-white border border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400 appearance-none" }), { style: {} }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "",
});
for (var _i = 0, _b = __VLS_getVForSourceType((__VLS_ctx.anos)); _i < _b.length; _i++) {
    var ano = _b[_i][0];
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        key: (ano),
    });
    (ano);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "block text-slate-200 mb-1 font-semibold" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign(__assign({ value: (__VLS_ctx.codigoTransferegov), type: "text" }, { class: "w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400" }), { placeholder: "Digite o código" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "grid grid-cols-1 md:grid-cols-2 gap-6" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "block text-slate-200 mb-1 font-semibold" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)(__assign(__assign(__assign({ value: (__VLS_ctx.areaTematicaId) }, { class: "w-full px-4 py-2 rounded-lg bg-slate-900 text-white border border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400 appearance-none" }), { style: {} }), { disabled: (!__VLS_ctx.anoFaf) }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "",
});
for (var _c = 0, _d = __VLS_getVForSourceType((__VLS_ctx.areasTematicasFiltradas)); _c < _d.length; _c++) {
    var area = _d[_c][0];
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        key: (area.id),
        value: (area.id),
    });
    (area.code);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "block text-slate-200 mb-1 font-semibold" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)(__assign(__assign({ value: (__VLS_ctx.tipoNatureza) }, { class: "w-full px-4 py-2 rounded-lg bg-slate-900 text-white border border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400 appearance-none" }), { style: {} }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "grid grid-cols-1 md:grid-cols-2 gap-6" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "block text-slate-200 mb-1 font-semibold" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)(__assign(__assign({ value: (__VLS_ctx.forcaResponsavelId) }, { class: "w-full px-4 py-2 rounded-lg bg-slate-900 text-white border border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400 appearance-none" }), { style: {} }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "",
});
for (var _e = 0, _f = __VLS_getVForSourceType((__VLS_ctx.forcasResponsaveis)); _e < _f.length; _e++) {
    var forca = _f[_e][0];
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        key: (forca.id),
        value: (forca.id),
    });
    (forca.code);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "block text-slate-200 mb-1 font-semibold" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign({ type: "date" }, { class: "w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-teal-400" }));
(__VLS_ctx.dataCriacao);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "block text-slate-200 mb-1 font-semibold" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)(__assign(__assign({ value: (__VLS_ctx.actionId) }, { class: "w-full px-4 py-2 rounded-lg bg-slate-900 text-white border border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400 appearance-none" }), { style: {} }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "",
});
for (var _g = 0, _h = __VLS_getVForSourceType((__VLS_ctx.acoesDisponiveis)); _g < _h.length; _g++) {
    var acao = _h[_g][0];
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        key: (acao.id),
        value: (acao.id),
    });
    (acao.action_code);
    (acao.name);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "grid grid-cols-1 md:grid-cols-2 gap-6" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "block text-slate-200 mb-1 font-semibold" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign({ type: "number", min: "0" }, { class: "w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-teal-400" }));
(__VLS_ctx.quantidadeItens);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "block text-slate-200 mb-1 font-semibold" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.textarea, __VLS_intrinsicElements.textarea)(__assign({ value: (__VLS_ctx.descricaoItens), rows: "2" }, { class: "w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-teal-400" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "block text-slate-200 mb-1 font-semibold" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.textarea, __VLS_intrinsicElements.textarea)(__assign({ value: (__VLS_ctx.destinacaoItens), rows: "2" }, { class: "w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-teal-400" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "grid grid-cols-1 md:grid-cols-2 gap-6" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "block text-slate-200 mb-1 font-semibold" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign(__assign({ value: (__VLS_ctx.valor), type: "text" }, { class: "w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400" }), { placeholder: "R$ 0,00" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "block text-slate-200 mb-1 font-semibold" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign(__assign({ value: (__VLS_ctx.valorRendimentos), type: "text" }, { class: "w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400" }), { placeholder: "R$ 0,00" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "block text-slate-200 mb-1 font-semibold" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign(__assign(__assign({ value: (__VLS_ctx.valorEconomicidade), type: "text" }, { class: "w-full px-4 py-2 rounded-lg bg-white/10 text-white border placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" }), { class: ({ 'border-red-500': __VLS_ctx.economicidadeExcedeSaldo, 'border-white/20': !__VLS_ctx.economicidadeExcedeSaldo }) }), { placeholder: "R$ 0,00", disabled: (!__VLS_ctx.anoFaf || !__VLS_ctx.areaTematicaId || !__VLS_ctx.tipoNatureza) }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "mt-2 text-sm h-5" }));
if (__VLS_ctx.isLoadingSaldo) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "text-teal-300 animate-pulse" }));
}
else if (__VLS_ctx.anoFaf && __VLS_ctx.areaTematicaId && __VLS_ctx.tipoNatureza) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    if (__VLS_ctx.feedbackErroEconomicidade) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "font-semibold text-red-400" }));
        (__VLS_ctx.feedbackErroEconomicidade);
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "text-slate-400" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "font-bold text-teal-400" }));
        (__VLS_ctx.formatarMoeda(__VLS_ctx.saldoEconomicidadeDisponivel));
    }
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "text-slate-500" }));
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "block text-slate-200 mb-1 font-semibold" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "w-full px-4 py-2 rounded-lg bg-slate-800/50 text-slate-300 border border-white/20 font-semibold" }));
(__VLS_ctx.valorTotal.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
}));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "block text-slate-200 mb-1 font-semibold" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.textarea, __VLS_intrinsicElements.textarea)(__assign({ value: (__VLS_ctx.descricaoGeral), rows: "4" }, { class: "w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-teal-400" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "block text-slate-200 mb-1 font-semibold" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign(__assign(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.fileUpload && __VLS_ctx.fileUpload.click();
    } }, { ref: "dropZoneRef" }), { class: "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors" }), { class: (__VLS_ctx.isOver ? 'border-teal-400 bg-teal-500/10' : 'border-white/20 hover:bg-white/5') }));
/** @type {typeof __VLS_ctx.dropZoneRef} */ ;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex flex-col items-center justify-center pt-5 pb-6" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign({ class: "w-8 h-8 mb-3 text-slate-400" }, { fill: "none", stroke: "currentColor", 'stroke-width': "2", viewBox: "0 0 24 24" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
    'stroke-linecap': "round",
    'stroke-linejoin': "round",
    d: "M7 16V4a1 1 0 011-1h8a1 1 0 011 1v12M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "mb-2 text-sm text-slate-400" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "font-semibold text-teal-400" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign(__assign({ onChange: (__VLS_ctx.handleFileSelected) }, { id: "file-upload", ref: "fileUpload", type: "file", multiple: true }), { class: "hidden" }));
/** @type {typeof __VLS_ctx.fileUpload} */ ;
if (__VLS_ctx.arquivos.length > 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "mt-4 space-y-2" }));
    for (var _j = 0, _k = __VLS_getVForSourceType((__VLS_ctx.arquivos)); _j < _k.length; _j++) {
        var item = _k[_j][0];
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ key: (item.file.name) }, { class: "flex flex-col gap-1" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "text-sm text-white font-bold" }));
        (item.file.name);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.textarea, __VLS_intrinsicElements.textarea)(__assign({ value: (item.description), placeholder: "Descrição do anexo (opcional)" }, { class: "bg-white/10 border border-white/20 rounded px-2 py-1 w-full text-white text-sm" }));
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex justify-end" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ type: "submit" }, { class: "px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-500 text-white rounded-lg shadow hover:from-teal-700 hover:to-cyan-600 transition font-bold" }), { disabled: (__VLS_ctx.loading || __VLS_ctx.economicidadeExcedeSaldo) }));
if (__VLS_ctx.feedback) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "mt-4 text-center font-semibold" }, { class: (__VLS_ctx.feedback.includes('sucesso') ? 'text-green-400' : 'text-red-400') }));
    (__VLS_ctx.feedback);
}
var __VLS_2;
/** @type {__VLS_StyleScopedClasses['max-w-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['backdrop-blur-md']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['p-8']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
/** @type {__VLS_StyleScopedClasses['from-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['to-cyan-300']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-clip-text']} */ ;
/** @type {__VLS_StyleScopedClasses['text-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['placeholder:text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
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
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['placeholder:text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
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
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
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
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
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
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
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
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['placeholder:text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['placeholder:text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['placeholder:text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:opacity-50']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:cursor-not-allowed']} */ ;
/** @type {__VLS_StyleScopedClasses['border-red-500']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-teal-300']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-pulse']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-500']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-800/50']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-300']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-32']} */ ;
/** @type {__VLS_StyleScopedClasses['border-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-dashed']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-5']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
/** @type {__VLS_StyleScopedClasses['from-teal-600']} */ ;
/** @type {__VLS_StyleScopedClasses['to-cyan-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:from-teal-700']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:to-cyan-600']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
var __VLS_dollars;
var __VLS_self = (await import('vue')).defineComponent({
    setup: function () {
        return {
            Layout: Layout,
            anos: anos,
            nomeAcao: nomeAcao,
            codigoTransferegov: codigoTransferegov,
            anoFaf: anoFaf,
            tipoNatureza: tipoNatureza,
            dataCriacao: dataCriacao,
            quantidadeItens: quantidadeItens,
            descricaoItens: descricaoItens,
            destinacaoItens: destinacaoItens,
            valor: valor,
            valorRendimentos: valorRendimentos,
            valorEconomicidade: valorEconomicidade,
            descricaoGeral: descricaoGeral,
            feedback: feedback,
            loading: loading,
            arquivos: arquivos,
            areaTematicaId: areaTematicaId,
            forcaResponsavelId: forcaResponsavelId,
            actionId: actionId,
            forcasResponsaveis: forcasResponsaveis,
            acoesDisponiveis: acoesDisponiveis,
            dropZoneRef: dropZoneRef,
            fileUpload: fileUpload,
            saldoEconomicidadeDisponivel: saldoEconomicidadeDisponivel,
            isLoadingSaldo: isLoadingSaldo,
            economicidadeExcedeSaldo: economicidadeExcedeSaldo,
            formatarMoeda: formatarMoeda,
            feedbackErroEconomicidade: feedbackErroEconomicidade,
            valorTotal: valorTotal,
            isOver: isOver,
            areasTematicasFiltradas: areasTematicasFiltradas,
            registrarProcesso: registrarProcesso,
            handleFileSelected: handleFileSelected,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup: function () {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
