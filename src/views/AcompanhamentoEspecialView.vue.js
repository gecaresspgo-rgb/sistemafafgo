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
import ProcessoCard from '../components/ProcessoCard.vue';
import ProcessoDetalhesModal from '../components/ProcessoDetalhesModal.vue';
import ProcessoEtapasModal from '../components/ProcessoEtapasModal.vue';
import ProcessoRegistrosModal from '../components/ProcessoRegistrosModal.vue';
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { supabase } from '../services/supabase';
import { useAuth } from '../composables/useAuth';
import { buscarForcasResponsaveis, buscarAreasTematicas, } from '../services/auth';
var route = useRoute();
var router = useRouter();
var forcasResponsaveis = ref([]);
var areasTematicas = ref([]);
// Modo de visualização (cards ou tabela)
var viewMode = ref('cards');
// Filtros
var filtroNome = ref('');
var filtroAno = ref('');
var filtroForca = ref('');
var filtroArea = ref('');
var filtroData = ref('');
var mostrarConcluidos = ref(true);
var filtroSEI = ref('');
var anos = Array.from({ length: 10 }, function (_, i) { return 2019 + i; });
var _a = useAuth(), user = _a.user, fetchUser = _a.fetchUser, isAdmin = _a.isAdmin;
var processos = ref([]);
var loadingProcessos = ref(false);
// Em ProcessoView.vue -> <script setup>
function carregarProcessos() {
    return __awaiter(this, void 0, void 0, function () {
        var usuario, favorites, favoriteIds, _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    loadingProcessos.value = true;
                    usuario = user.value;
                    if (!!usuario) return [3 /*break*/, 2];
                    return [4 /*yield*/, fetchUser()];
                case 1:
                    usuario = _b.sent();
                    _b.label = 2;
                case 2:
                    if (!usuario) {
                        processos.value = [];
                        loadingProcessos.value = false;
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, supabase
                            .from('user_favorites')
                            .select('process_id')
                            .eq('user_id', usuario.id)];
                case 3:
                    favorites = (_b.sent()).data;
                    favoriteIds = new Set((favorites || []).map(function (f) { return f.process_id; }));
                    return [4 /*yield*/, supabase
                            .from('processes')
                            .select("\n      *, \n      codigo_da_acao, \n      responsible_forces (id, code), \n      thematic_areas (id, code),\n      process_steps (\n        is_current,\n        step_templates (name)\n      )\n    ")
                            .is('deleted_at', null)
                            .order('created_at', { ascending: false })];
                case 4:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        console.error('Erro ao buscar processos:', error);
                        processos.value = [];
                        loadingProcessos.value = false;
                        return [2 /*return*/];
                    }
                    if (data) {
                        // 3. Mapeamento dos dados já completos, sem necessidade de buscas extras
                        processos.value = data.map(function (proc) {
                            var _a, _b, _c;
                            var etapaAtual = proc.process_steps.find(function (step) { return step.is_current; });
                            var totalEtapas = proc.process_steps.length;
                            var etapaAtualIndex = etapaAtual ? proc.process_steps.findIndex(function (s) { return s.is_current; }) : -1;
                            return __assign(__assign({}, proc), { forca_code: ((_a = proc.responsible_forces) === null || _a === void 0 ? void 0 : _a.code) || 'N/A', area_code: ((_b = proc.thematic_areas) === null || _b === void 0 ? void 0 : _b.code) || 'N/A', etapaAtualNome: ((_c = etapaAtual === null || etapaAtual === void 0 ? void 0 : etapaAtual.step_templates) === null || _c === void 0 ? void 0 : _c.name) || 'Não definida', is_favorited: favoriteIds.has(proc.id), 
                                // Lógica de progresso baseada nos dados já buscados
                                progresso: etapaAtualIndex >= 0 && totalEtapas > 1
                                    ? Math.round((etapaAtualIndex / (totalEtapas - 1)) * 100)
                                    : (proc.status === 'Concluído' ? 100 : 0), etapaAtual: etapaAtualIndex, totalEtapas: totalEtapas });
                        });
                    }
                    else {
                        processos.value = [];
                    }
                    loadingProcessos.value = false;
                    return [2 /*return*/];
            }
        });
    });
}
// Em AcompanhamentoEspecialView.vue
function handleRouteChange(query) {
    var processoId = query.processo_id;
    var modalType = query.modal_type;
    if (processoId) {
        if (processos.value.length > 0) {
            var processoParaAbrir = processos.value.find(function (p) { return p.id === processoId; });
            if (processoParaAbrir) {
                abrirModalProcesso(processoParaAbrir, modalType || 'detalhes');
            }
            else {
                router.push({ query: {} }); // Limpa a URL se o processo não for encontrado
            }
        }
    }
    else {
        // Garante que os modais fechem se a URL for limpa
        showDetalhesModal.value = false;
        showEtapasModal.value = false;
        showRegistrosModal.value = false;
    }
}
// "Escuta" as mudanças na URL para abrir/fechar o modal dinamicamente
watch(function () { return route.query; }, function (newQuery) {
    handleRouteChange(newQuery);
});
onMounted(function () { return __awaiter(void 0, void 0, void 0, function () {
    var forcas, areas, processoId;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, carregarProcessos()];
            case 1:
                _a.sent();
                return [4 /*yield*/, buscarForcasResponsaveis()];
            case 2:
                forcas = (_a.sent()).data;
                if (forcas)
                    forcasResponsaveis.value = forcas;
                return [4 /*yield*/, buscarAreasTematicas()];
            case 3:
                areas = (_a.sent()).data;
                if (areas)
                    areasTematicas.value = areas;
                processoId = route.query.processo_id;
                if (processoId && typeof processoId === 'string') {
                    // Esperar um pouco para garantir que os processos foram carregados
                    setTimeout(function () {
                        var processo = processos.value.find(function (p) { return p.id === processoId; });
                        if (processo) {
                            abrirModalProcesso(processo);
                        }
                    }, 500);
                }
                return [2 /*return*/];
        }
    });
}); });
// Referência para o processo selecionado e controle dos modais
var processoSelecionado = ref(null);
var showDetalhesModal = ref(false);
var showEtapasModal = ref(false);
var showRegistrosModal = ref(false);
// Função para atualizar o processo após edição
// VERSÃO CORRIGIDA E REATIVA ✨
function atualizarProcesso(processoAtualizado) {
    return __awaiter(this, void 0, void 0, function () {
        var index;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Se o modal ou o card enviou um objeto com as mudanças...
                    if (processoAtualizado && processoAtualizado.id) {
                        index = processos.value.findIndex(function (p) { return p.id === processoAtualizado.id; });
                        // Se encontramos o processo na lista principal...
                        if (index !== -1) {
                            // 1. Atualiza o processo na lista principal (para o card no fundo)
                            processos.value[index] = __assign(__assign({}, processos.value[index]), processoAtualizado);
                            // 2. ✨ A LINHA MÁGICA: Atualiza também o processo que está no modal!
                            if (processoSelecionado.value && processoSelecionado.value.id === processoAtualizado.id) {
                                processoSelecionado.value = __assign(__assign({}, processoSelecionado.value), processoAtualizado);
                            }
                            return [2 /*return*/]; // Agora podemos retornar, pois ambas as fontes foram atualizadas.
                        }
                    }
                    // Se não recebemos um objeto ou o processo não foi encontrado,
                    // recarregamos tudo como uma medida de segurança.
                    return [4 /*yield*/, carregarProcessos()];
                case 1:
                    // Se não recebemos um objeto ou o processo não foi encontrado,
                    // recarregamos tudo como uma medida de segurança.
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// Função para abrir o modal de detalhes do processo
function abrirModalProcesso(processo, tipo) {
    if (tipo === void 0) { tipo = 'detalhes'; }
    processoSelecionado.value = processo;
    if (tipo === 'etapas') {
        showEtapasModal.value = true;
    }
    else if (tipo === 'registros') {
        showRegistrosModal.value = true;
    }
    else {
        showDetalhesModal.value = true;
    }
    router.push({ query: { processo_id: processo.id, modal_type: tipo } });
}
// Função para fechar o modal de registros
function fecharModalRegistros() {
    showRegistrosModal.value = false;
}
// Função para fechar o modal de detalhes
function fecharModalDetalhes() {
    showDetalhesModal.value = false;
}
// Função para fechar o modal de etapas
function fecharModalEtapas() {
    showEtapasModal.value = false;
}
// FUNÇÕES DE NAVEGAÇÃO ENTRE MODAIS (VERSÃO PADRONIZADA)
// Vindo de Detalhes ou Etapas -> para Etapas
function handleSwitchToEtapas() {
    showDetalhesModal.value = false;
    showRegistrosModal.value = false;
    showEtapasModal.value = true;
    if (processoSelecionado.value) {
        router.push({
            query: {
                processo_id: processoSelecionado.value.id,
                modal_type: 'etapas'
            }
        });
    }
}
// Vindo de Etapas ou Registros -> para Detalhes
function handleSwitchToDetalhes() {
    showEtapasModal.value = false;
    showRegistrosModal.value = false;
    showDetalhesModal.value = true;
    if (processoSelecionado.value) {
        router.push({
            query: {
                processo_id: processoSelecionado.value.id,
                modal_type: 'detalhes'
            }
        });
    }
}
// Vindo de Detalhes ou Etapas -> para Registros
function handleSwitchToRegistros() {
    showDetalhesModal.value = false;
    showEtapasModal.value = false;
    showRegistrosModal.value = true;
    if (processoSelecionado.value) {
        router.push({
            query: {
                processo_id: processoSelecionado.value.id,
                modal_type: 'registros'
            }
        });
    }
}
// As funções abaixo foram renomeadas para maior clareza e padronização,
// mas mantive os nomes antigos para compatibilidade com sua chamada no template.
// Vindo de Registros -> para Detalhes
function switchToDetalhesFromRegistros() {
    handleSwitchToDetalhes();
}
// Vindo de Registros -> para Etapas
function switchToEtapasFromRegistros() {
    handleSwitchToEtapas();
}
var processosFiltrados = computed(function () {
    return processos.value.filter(function (proc) {
        var _a, _b;
        var isFavorito = proc.is_favorited;
        var nomeMatch = (proc.nome_acao || proc.area_code || '')
            .toLowerCase()
            .includes(filtroNome.value.toLowerCase());
        var seiMatch = !filtroSEI.value || (proc.codigo_transferegov || '').toLowerCase().includes(filtroSEI.value.toLowerCase());
        var anoMatch = !filtroAno.value || proc.ano_faf === Number(filtroAno.value);
        var forcaMatch = !filtroForca.value || ((_a = proc.responsible_forces) === null || _a === void 0 ? void 0 : _a.id) === Number(filtroForca.value);
        var areaMatch = !filtroArea.value || ((_b = proc.thematic_areas) === null || _b === void 0 ? void 0 : _b.id) === Number(filtroArea.value);
        var dataMatch = !filtroData.value ||
            (proc.data_encaminhamento_aprovacao &&
                proc.data_encaminhamento_aprovacao === filtroData.value);
        var statusMatch = mostrarConcluidos.value ? true : proc.status !== 'Concluído';
        return isFavorito && nomeMatch && seiMatch && anoMatch && forcaMatch && areaMatch && dataMatch && statusMatch;
    });
});
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
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "min-h-screen flex justify-center items-stretch px-8 py-8" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "w-full max-w-7xl mx-auto space-y-8" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "w-full flex justify-center" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "w-full bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-lg flex flex-wrap items-center gap-4 px-6 py-3 mb-8" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex flex-col min-w-[180px]" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "text-slate-200 font-semibold mb-1" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign({ value: (__VLS_ctx.filtroNome), type: "text", placeholder: "Digite o nome da ação" }, { class: "px-2 py-1 rounded border border-white/20 bg-slate-900 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 w-full" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex flex-col min-w-[120px]" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "text-slate-200 font-semibold mb-1" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)(__assign(__assign({ value: (__VLS_ctx.filtroAno) }, { class: "px-2 py-1 rounded border border-white/30 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-teal-400 w-full appearance-none" }), { style: {} }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "",
});
for (var _i = 0, _b = __VLS_getVForSourceType((__VLS_ctx.anos)); _i < _b.length; _i++) {
    var ano = _b[_i][0];
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        key: (ano),
        value: (ano),
    });
    (ano);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex flex-col min-w-[140px]" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "text-slate-200 font-semibold mb-1" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)(__assign(__assign({ value: (__VLS_ctx.filtroForca) }, { class: "px-2 py-1 rounded border border-white/30 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-teal-400 w-full appearance-none" }), { style: {} }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "",
});
for (var _c = 0, _d = __VLS_getVForSourceType((__VLS_ctx.forcasResponsaveis)); _c < _d.length; _c++) {
    var forca = _d[_c][0];
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        key: (forca.id),
        value: (forca.id),
    });
    (forca.code);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex flex-col min-w-[140px]" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "text-slate-200 font-semibold mb-1" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)(__assign(__assign({ value: (__VLS_ctx.filtroArea) }, { class: "px-2 py-1 rounded border border-white/30 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-teal-400 w-full appearance-none" }), { style: {} }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "",
});
for (var _e = 0, _f = __VLS_getVForSourceType((__VLS_ctx.areasTematicas)); _e < _f.length; _e++) {
    var area = _f[_e][0];
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        key: (area.id),
        value: (area.id),
    });
    (area.code);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex flex-col min-w-[160px]" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "text-slate-200 font-semibold mb-1" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign({ value: (__VLS_ctx.filtroSEI), type: "text", placeholder: "Digite o número SEI" }, { class: "px-2 py-1 rounded border border-white/20 bg-slate-900 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 w-full" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex flex-col min-w-[160px]" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "text-slate-200 font-semibold mb-1" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign({ type: "date" }, { class: "px-2 py-1 rounded border border-white/20 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-teal-400 w-full custom-date-input" }));
(__VLS_ctx.filtroData);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex items-center gap-2 min-w-[170px] mt-5 md:mt-0" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign({ id: "chkConcluidos", type: "checkbox" }, { class: "accent-teal-500 w-5 h-5 border-white/20 bg-white/10" }));
(__VLS_ctx.mostrarConcluidos);
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ for: "chkConcluidos" }, { class: "text-slate-200 font-semibold select-none" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex items-center justify-between mb-4" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)(__assign({ class: "text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex bg-slate-800 rounded-lg p-1" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.viewMode = 'cards';
    } }, { class: ([__VLS_ctx.viewMode === 'cards' ? 'bg-gradient-to-r from-teal-600 to-cyan-500 text-white' : 'text-slate-300 hover:text-white', 'px-3 py-1 rounded-md font-medium transition-all']) }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "flex items-center gap-1" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign(__assign({ xmlns: "http://www.w3.org/2000/svg" }, { class: "h-4 w-4" }), { fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
    'stroke-linecap': "round",
    'stroke-linejoin': "round",
    'stroke-width': "2",
    d: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.viewMode = 'table';
    } }, { class: ([__VLS_ctx.viewMode === 'table' ? 'bg-gradient-to-r from-teal-600 to-cyan-500 text-white' : 'text-slate-300 hover:text-white', 'px-3 py-1 rounded-md font-medium transition-all']) }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "flex items-center gap-1" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign(__assign({ xmlns: "http://www.w3.org/2000/svg" }, { class: "h-4 w-4" }), { fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
    'stroke-linecap': "round",
    'stroke-linejoin': "round",
    'stroke-width': "2",
    d: "M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex justify-center w-full" }));
if (__VLS_ctx.viewMode === 'cards') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" }));
    for (var _g = 0, _h = __VLS_getVForSourceType((__VLS_ctx.processosFiltrados)); _g < _h.length; _g++) {
        var processo = _h[_g][0];
        /** @type {[typeof ProcessoCard, ]} */ ;
        // @ts-ignore
        var __VLS_4 = __VLS_asFunctionalComponent(ProcessoCard, new ProcessoCard(__assign(__assign(__assign({ 'onAtualizarProcesso': {} }, { 'onAbrirDetalhes': {} }), { 'onMostrarEtapas': {} }), { key: (processo.id), processo: (processo) })));
        var __VLS_5 = __VLS_4.apply(void 0, __spreadArray([__assign(__assign(__assign({ 'onAtualizarProcesso': {} }, { 'onAbrirDetalhes': {} }), { 'onMostrarEtapas': {} }), { key: (processo.id), processo: (processo) })], __VLS_functionalComponentArgsRest(__VLS_4), false));
        var __VLS_7 = void 0;
        var __VLS_8 = void 0;
        var __VLS_9 = void 0;
        var __VLS_10 = {
            onAtualizarProcesso: (function (processoAtualizado) { return __VLS_ctx.atualizarProcesso(processoAtualizado); })
        };
        var __VLS_11 = {
            onAbrirDetalhes: (function (processo) { return __VLS_ctx.abrirModalProcesso(processo, 'detalhes'); })
        };
        var __VLS_12 = {
            onMostrarEtapas: (function (processo) { return __VLS_ctx.abrirModalProcesso(processo, 'etapas'); })
        };
        var __VLS_6;
    }
}
else if (__VLS_ctx.viewMode === 'table') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "w-full overflow-x-auto" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.table, __VLS_intrinsicElements.table)(__assign({ class: "w-full border-collapse" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.thead, __VLS_intrinsicElements.thead)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)(__assign({ class: "bg-slate-800 text-left" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)(__assign({ class: "px-4 py-3 text-slate-300 font-semibold" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)(__assign({ class: "px-4 py-3 text-slate-300 font-semibold" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)(__assign({ class: "px-4 py-3 text-slate-300 font-semibold" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)(__assign({ class: "px-4 py-3 text-slate-300 font-semibold" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)(__assign({ class: "px-4 py-3 text-slate-300 font-semibold" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)(__assign({ class: "px-4 py-3 text-slate-300 font-semibold" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)(__assign({ class: "px-4 py-3 text-slate-300 font-semibold" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.tbody, __VLS_intrinsicElements.tbody)({});
    if (__VLS_ctx.processosFiltrados.length === 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)(__assign({ colspan: "7" }, { class: "px-4 py-6 text-center text-slate-400" }));
    }
    var _loop_1 = function (processo) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)(__assign(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!!(__VLS_ctx.viewMode === 'cards'))
                    return;
                if (!(__VLS_ctx.viewMode === 'table'))
                    return;
                __VLS_ctx.abrirModalProcesso(processo);
            } }, { key: (processo.id) }), { class: "border-b border-slate-700 hover:bg-slate-800/50 cursor-pointer transition-colors" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)(__assign({ class: "px-4 py-3 text-white" }));
        (processo.codigo_transferegov || 'Não definido');
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)(__assign({ class: "px-4 py-3 text-white font-medium" }));
        (processo.nome_acao);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)(__assign({ class: "px-4 py-3" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "bg-blue-600/20 text-blue-300 px-2 py-1 rounded-full text-xs font-semibold" }));
        (processo.forca_code || 'Não definido');
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)(__assign({ class: "px-4 py-3" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "bg-teal-600/20 text-teal-300 px-2 py-1 rounded-full text-xs font-semibold" }));
        (processo.area_code || 'Não definido');
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)(__assign({ class: "px-4 py-3" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: ({
                'bg-green-600/20 text-green-300': processo.status === 'Concluído',
                'bg-yellow-600/20 text-yellow-300': processo.status === 'Em andamento',
                'bg-slate-600/20 text-slate-300': !processo.status
            }) }, { class: "px-2 py-1 rounded-full text-xs font-semibold" }));
        (processo.status || 'Não iniciado');
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)(__assign({ class: "px-4 py-3" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "w-full bg-slate-700 rounded-full h-2.5 mb-1" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "bg-gradient-to-r from-teal-500 to-cyan-400 h-2.5 rounded-full" }, { style: ({ width: "".concat(processo.progresso || 0, "%") }) }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "text-xs text-slate-400" }));
        (processo.progresso || 0);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)(__assign({ class: "px-4 py-3 font-medium text-teal-400" }));
        (processo.valor_inicial_padrao ? processo.valor_inicial_padrao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00');
    };
    for (var _j = 0, _k = __VLS_getVForSourceType((__VLS_ctx.processosFiltrados)); _j < _k.length; _j++) {
        var processo = _k[_j][0];
        _loop_1(processo);
    }
}
if (__VLS_ctx.processoSelecionado) {
    /** @type {[typeof ProcessoDetalhesModal, ]} */ ;
    // @ts-ignore
    var __VLS_13 = __VLS_asFunctionalComponent(ProcessoDetalhesModal, new ProcessoDetalhesModal(__assign(__assign(__assign(__assign(__assign({ 'onClose': {} }, { 'onAtualizarProcesso': {} }), { 'onSwitchToEtapas': {} }), { 'onSwitchToRegistros': {} }), { 'onStatusChanged': {} }), { show: (__VLS_ctx.showDetalhesModal), processo: (__VLS_ctx.processoSelecionado), isAdmin: (__VLS_ctx.isAdmin) })));
    var __VLS_14 = __VLS_13.apply(void 0, __spreadArray([__assign(__assign(__assign(__assign(__assign({ 'onClose': {} }, { 'onAtualizarProcesso': {} }), { 'onSwitchToEtapas': {} }), { 'onSwitchToRegistros': {} }), { 'onStatusChanged': {} }), { show: (__VLS_ctx.showDetalhesModal), processo: (__VLS_ctx.processoSelecionado), isAdmin: (__VLS_ctx.isAdmin) })], __VLS_functionalComponentArgsRest(__VLS_13), false));
    var __VLS_16 = void 0;
    var __VLS_17 = void 0;
    var __VLS_18 = void 0;
    var __VLS_19 = {
        onClose: (__VLS_ctx.fecharModalDetalhes)
    };
    var __VLS_20 = {
        onAtualizarProcesso: (__VLS_ctx.atualizarProcesso)
    };
    var __VLS_21 = {
        onSwitchToEtapas: (__VLS_ctx.handleSwitchToEtapas)
    };
    var __VLS_22 = {
        onSwitchToRegistros: (__VLS_ctx.handleSwitchToRegistros)
    };
    var __VLS_23 = {
        onStatusChanged: (__VLS_ctx.carregarProcessos)
    };
    var __VLS_15;
}
if (__VLS_ctx.processoSelecionado) {
    /** @type {[typeof ProcessoEtapasModal, ]} */ ;
    // @ts-ignore
    var __VLS_24 = __VLS_asFunctionalComponent(ProcessoEtapasModal, new ProcessoEtapasModal(__assign(__assign(__assign(__assign({ 'onClose': {} }, { 'onAtualizarProcesso': {} }), { 'onSwitchToDetalhes': {} }), { 'onSwitchToRegistros': {} }), { show: (__VLS_ctx.showEtapasModal), processo: (__VLS_ctx.processoSelecionado) })));
    var __VLS_25 = __VLS_24.apply(void 0, __spreadArray([__assign(__assign(__assign(__assign({ 'onClose': {} }, { 'onAtualizarProcesso': {} }), { 'onSwitchToDetalhes': {} }), { 'onSwitchToRegistros': {} }), { show: (__VLS_ctx.showEtapasModal), processo: (__VLS_ctx.processoSelecionado) })], __VLS_functionalComponentArgsRest(__VLS_24), false));
    var __VLS_27 = void 0;
    var __VLS_28 = void 0;
    var __VLS_29 = void 0;
    var __VLS_30 = {
        onClose: (__VLS_ctx.fecharModalEtapas)
    };
    var __VLS_31 = {
        onAtualizarProcesso: (__VLS_ctx.atualizarProcesso)
    };
    var __VLS_32 = {
        onSwitchToDetalhes: (__VLS_ctx.handleSwitchToDetalhes)
    };
    var __VLS_33 = {
        onSwitchToRegistros: (__VLS_ctx.handleSwitchToRegistros)
    };
    var __VLS_26;
}
if (__VLS_ctx.processoSelecionado) {
    /** @type {[typeof ProcessoRegistrosModal, ]} */ ;
    // @ts-ignore
    var __VLS_34 = __VLS_asFunctionalComponent(ProcessoRegistrosModal, new ProcessoRegistrosModal(__assign(__assign(__assign(__assign({ 'onClose': {} }, { 'onAtualizarProcesso': {} }), { 'onSwitchToDetalhes': {} }), { 'onSwitchToEtapas': {} }), { show: (__VLS_ctx.showRegistrosModal), processo: (__VLS_ctx.processoSelecionado) })));
    var __VLS_35 = __VLS_34.apply(void 0, __spreadArray([__assign(__assign(__assign(__assign({ 'onClose': {} }, { 'onAtualizarProcesso': {} }), { 'onSwitchToDetalhes': {} }), { 'onSwitchToEtapas': {} }), { show: (__VLS_ctx.showRegistrosModal), processo: (__VLS_ctx.processoSelecionado) })], __VLS_functionalComponentArgsRest(__VLS_34), false));
    var __VLS_37 = void 0;
    var __VLS_38 = void 0;
    var __VLS_39 = void 0;
    var __VLS_40 = {
        onClose: (__VLS_ctx.fecharModalRegistros)
    };
    var __VLS_41 = {
        onAtualizarProcesso: (__VLS_ctx.atualizarProcesso)
    };
    var __VLS_42 = {
        onSwitchToDetalhes: (__VLS_ctx.switchToDetalhesFromRegistros)
    };
    var __VLS_43 = {
        onSwitchToEtapas: (__VLS_ctx.switchToEtapasFromRegistros)
    };
    var __VLS_36;
}
var __VLS_2;
/** @type {__VLS_StyleScopedClasses['min-h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['items-stretch']} */ ;
/** @type {__VLS_StyleScopedClasses['px-8']} */ ;
/** @type {__VLS_StyleScopedClasses['py-8']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-7xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-8']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['backdrop-blur-md']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-[180px]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-900']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['placeholder:text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-[120px]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/30']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-900']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['appearance-none']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-[140px]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/30']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-900']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['appearance-none']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-[140px]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/30']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-900']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['appearance-none']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-[160px]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-900']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['placeholder:text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-[160px]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-900']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-date-input']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-[170px]']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-5']} */ ;
/** @type {__VLS_StyleScopedClasses['md:mt-0']} */ ;
/** @type {__VLS_StyleScopedClasses['accent-teal-500']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['select-none']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
/** @type {__VLS_StyleScopedClasses['from-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['to-cyan-300']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-clip-text']} */ ;
/** @type {__VLS_StyleScopedClasses['text-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-800']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-1']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:grid-cols-3']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-8']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-x-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['border-collapse']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-800']} */ ;
/** @type {__VLS_StyleScopedClasses['text-left']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-300']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-300']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-300']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-300']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-300']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-300']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-300']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-700']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-slate-800/50']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-blue-600/20']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-300']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-teal-600/20']} */ ;
/** @type {__VLS_StyleScopedClasses['text-teal-300']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-green-600/20']} */ ;
/** @type {__VLS_StyleScopedClasses['text-green-300']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-yellow-600/20']} */ ;
/** @type {__VLS_StyleScopedClasses['text-yellow-300']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-600/20']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-300']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-700']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-2.5']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
/** @type {__VLS_StyleScopedClasses['from-teal-500']} */ ;
/** @type {__VLS_StyleScopedClasses['to-cyan-400']} */ ;
/** @type {__VLS_StyleScopedClasses['h-2.5']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-teal-400']} */ ;
var __VLS_dollars;
var __VLS_self = (await import('vue')).defineComponent({
    setup: function () {
        return {
            Layout: Layout,
            ProcessoCard: ProcessoCard,
            ProcessoDetalhesModal: ProcessoDetalhesModal,
            ProcessoEtapasModal: ProcessoEtapasModal,
            ProcessoRegistrosModal: ProcessoRegistrosModal,
            forcasResponsaveis: forcasResponsaveis,
            areasTematicas: areasTematicas,
            viewMode: viewMode,
            filtroNome: filtroNome,
            filtroAno: filtroAno,
            filtroForca: filtroForca,
            filtroArea: filtroArea,
            filtroData: filtroData,
            mostrarConcluidos: mostrarConcluidos,
            filtroSEI: filtroSEI,
            anos: anos,
            isAdmin: isAdmin,
            carregarProcessos: carregarProcessos,
            processoSelecionado: processoSelecionado,
            showDetalhesModal: showDetalhesModal,
            showEtapasModal: showEtapasModal,
            showRegistrosModal: showRegistrosModal,
            atualizarProcesso: atualizarProcesso,
            abrirModalProcesso: abrirModalProcesso,
            fecharModalRegistros: fecharModalRegistros,
            fecharModalDetalhes: fecharModalDetalhes,
            fecharModalEtapas: fecharModalEtapas,
            handleSwitchToEtapas: handleSwitchToEtapas,
            handleSwitchToDetalhes: handleSwitchToDetalhes,
            handleSwitchToRegistros: handleSwitchToRegistros,
            switchToDetalhesFromRegistros: switchToDetalhesFromRegistros,
            switchToEtapasFromRegistros: switchToEtapasFromRegistros,
            processosFiltrados: processosFiltrados,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup: function () {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
