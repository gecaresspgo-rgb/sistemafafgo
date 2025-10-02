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
var _a, _b, _c, _d;
import { ref, computed, watch } from 'vue';
import { supabase } from '../services/supabase';
import { useFormatters } from '../composables/useFormatters';
import LinkProcessModal from './LinkProcessModal.vue';
import ConfirmationModal from './ConfirmationModal.vue';
import ProcessoDetalhesModal from './ProcessoDetalhesModal.vue';
import ProcessoEtapasModal from './ProcessoEtapasModal.vue';
import ProcessoRegistrosModal from './ProcessoRegistrosModal.vue';
import { useAuth } from '../composables/useAuth';
var user = useAuth().user;
var props = defineProps();
var emit = defineEmits();
// Composables
var _e = useFormatters(), formatarMoeda = _e.formatarValor, formatarData = _e.formatarData;
// Estado
var abaAtiva = ref('processos');
var processosVinculados = ref([]);
var registrosGastos = ref([]);
var loadingProcessos = ref(false);
var loadingRegistros = ref(false);
var showLinkProcessModal = ref(false);
var showConfirmationModal = ref(false);
var processoParaDesvincular = ref(null);
var processoSelecionado = ref(null);
var showProcessoDetalhesModal = ref(false);
var showProcessoEtapasModal = ref(false);
var showProcessoRegistrosModal = ref(false);
// Computed
var totalGastos = computed(function () {
    return registrosGastos.value.reduce(function (total, registro) { return total + registro.amount_used; }, 0);
});
var totalDestinado = computed(function () {
    return processosVinculados.value.reduce(function (total, processo) { return total + (processo.valor_total_destinado || 0); }, 0);
});
var saldoRestante = computed(function () {
    return totalDestinado.value - totalGastos.value;
});
// Funções
function fecharModal() {
    emit('close');
}
function abrirLinkProcessModal() {
    showLinkProcessModal.value = true;
}
function fecharLinkProcessModal() {
    showLinkProcessModal.value = false;
}
function handleProcessLinked() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, buscarDadosDaAcao()];
                case 1:
                    _a.sent();
                    emit('acao-atualizada');
                    setTimeout(function () {
                        fecharLinkProcessModal();
                    }, 1500);
                    return [2 /*return*/];
            }
        });
    });
}
function abrirModalConfirmacaoDesnviular(processo) {
    processoParaDesvincular.value = processo;
    showConfirmationModal.value = true;
}
function fecharConfirmationModal() {
    showConfirmationModal.value = false;
    processoParaDesvincular.value = null;
}
function fecharModalDetalhesProcesso() {
    processoSelecionado.value = null;
    showProcessoDetalhesModal.value = false;
    showProcessoEtapasModal.value = false;
    showProcessoRegistrosModal.value = false;
}
// DENTRO DE AcaoDetalhesModal.vue
function visualizarProcesso(processo) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, processoCompleto, error, err_1;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    // Mostra um feedback de carregamento
                    // O objeto temporário agora corresponde à interface ProcessoVinculado
                    processoSelecionado.value = {
                        id: processo.id,
                        name: 'Carregando...',
                        status: 'Carregando...',
                        created_at: new Date().toISOString(),
                        valor_total_destinado: 0,
                        codigo_transferegov: '...'
                    };
                    showProcessoDetalhesModal.value = true;
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, supabase
                            .from('processes')
                            .select("\n        *,\n        thematic_areas ( code ),\n        responsible_forces ( code )\n      ")
                            .eq('id', processo.id)
                            .single()];
                case 2:
                    _a = _d.sent(), processoCompleto = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    if (!processoCompleto)
                        throw new Error("Processo não encontrado.");
                    // Atualiza a variável com os dados completos
                    processoSelecionado.value = __assign(__assign({}, processoCompleto), { area_code: (_b = processoCompleto.thematic_areas) === null || _b === void 0 ? void 0 : _b.code, forca_code: (_c = processoCompleto.responsible_forces) === null || _c === void 0 ? void 0 : _c.code });
                    // Garante que a aba de detalhes seja a ativa
                    showProcessoDetalhesModal.value = true;
                    showProcessoEtapasModal.value = false;
                    showProcessoRegistrosModal.value = false;
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _d.sent();
                    console.error("Erro ao buscar detalhes do processo:", err_1);
                    alert("Não foi possível carregar os detalhes do processo.");
                    fecharModalDetalhesProcesso();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function handleSwitchToEtapas() {
    showProcessoDetalhesModal.value = false;
    showProcessoRegistrosModal.value = false;
    showProcessoEtapasModal.value = true;
}
function handleSwitchToDetalhes() {
    showProcessoDetalhesModal.value = true;
    showProcessoEtapasModal.value = false;
    showProcessoRegistrosModal.value = false;
}
function handleSwitchToRegistros() {
    showProcessoDetalhesModal.value = false;
    showProcessoEtapasModal.value = false;
    showProcessoRegistrosModal.value = true;
}
function atualizarProcesso() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, buscarDadosDaAcao()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function handleDesvincularConfirmado() {
    return __awaiter(this, void 0, void 0, function () {
        var error, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!processoParaDesvincular.value)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, supabase
                            .from('processes')
                            .update({ action_id: null })
                            .eq('id', processoParaDesvincular.value.id)];
                case 2:
                    error = (_a.sent()).error;
                    if (error)
                        throw error;
                    return [4 /*yield*/, buscarDadosDaAcao()];
                case 3:
                    _a.sent();
                    emit('acao-atualizada');
                    return [3 /*break*/, 6];
                case 4:
                    error_1 = _a.sent();
                    console.error('Erro ao desvincular processo:', error_1);
                    alert('Erro ao desvincular processo. Tente novamente.');
                    return [3 /*break*/, 6];
                case 5:
                    fecharConfirmationModal(); // CORRIGIDO AQUI
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function buscarDadosDaAcao() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error, error_2;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!((_b = props.acao) === null || _b === void 0 ? void 0 : _b.id))
                        return [2 /*return*/];
                    loadingProcessos.value = true;
                    loadingRegistros.value = true;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, supabase.rpc('get_records_for_action', {
                            p_action_id: props.acao.id
                        })];
                case 2:
                    _a = _c.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    processosVinculados.value = (data === null || data === void 0 ? void 0 : data.processes) || [];
                    registrosGastos.value = (data === null || data === void 0 ? void 0 : data.records) || [];
                    return [3 /*break*/, 5];
                case 3:
                    error_2 = _c.sent();
                    console.error('Erro ao buscar dados da ação:', error_2);
                    processosVinculados.value = [];
                    registrosGastos.value = [];
                    return [3 /*break*/, 5];
                case 4:
                    loadingProcessos.value = false;
                    loadingRegistros.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// Watchers
watch(function () { return props.acao; }, function (newAcao) {
    if (newAcao && newAcao.id) {
        abaAtiva.value = 'processos';
        buscarDadosDaAcao();
    }
}, { immediate: true });
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = {};
var __VLS_components;
var __VLS_directives;
if (__VLS_ctx.show) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ onClick: function () { } }, { class: "bg-slate-900 border border-slate-700 rounded-lg shadow-xl w-full max-w-6xl mx-4 max-h-[90vh] flex flex-col overflow-hidden" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex items-center justify-between p-6 border-b border-slate-700 flex-shrink-0" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)(__assign({ class: "text-xl font-bold text-white" }));
    (__VLS_ctx.acao.action_code);
    (__VLS_ctx.acao.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "text-sm text-slate-400 mt-1" }));
    (__VLS_ctx.acao.year);
    (__VLS_ctx.acao.expense_nature);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.fecharModal) }, { class: "text-slate-400 hover:text-white transition" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign({ class: "w-6 h-6" }, { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
        'stroke-width': "2",
        d: "M6 18L18 6M6 6l12 12",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex border-b border-slate-700 bg-slate-800/50 flex-shrink-0" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.show))
                return;
            __VLS_ctx.abaAtiva = 'processos';
        } }, { class: ([
            'px-6 py-3 font-medium transition-colors border-b-2',
            __VLS_ctx.abaAtiva === 'processos'
                ? 'text-teal-400 border-teal-400 bg-slate-800'
                : 'text-slate-400 border-transparent hover:text-white hover:bg-slate-700'
        ]) }));
    (__VLS_ctx.processosVinculados.length);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.show))
                return;
            __VLS_ctx.abaAtiva = 'registros';
        } }, { class: ([
            'px-6 py-3 font-medium transition-colors border-b-2',
            __VLS_ctx.abaAtiva === 'registros'
                ? 'text-teal-400 border-teal-400 bg-slate-800'
                : 'text-slate-400 border-transparent hover:text-white hover:bg-slate-700'
        ]) }));
    (__VLS_ctx.registrosGastos.length);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex-1 overflow-y-auto p-6" }));
    if (__VLS_ctx.abaAtiva === 'processos') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "space-y-4" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex justify-between items-center" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)(__assign({ class: "text-lg font-semibold text-white" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.abrirLinkProcessModal) }, { class: "px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition flex items-center gap-2" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign({ class: "w-4 h-4" }, { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
            'stroke-linecap': "round",
            'stroke-linejoin': "round",
            'stroke-width': "2",
            d: "M12 6v6m0 0v6m0-6h6m-6 0H6",
        });
        if (__VLS_ctx.loadingProcessos) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex justify-center py-8" }));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400" }));
        }
        else if (__VLS_ctx.processosVinculados.length === 0) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "text-center py-8 text-slate-400" }));
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "space-y-3" }));
            var _loop_1 = function (processo) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ key: (processo.id) }, { class: "bg-slate-800 border border-slate-700 rounded-lg p-4 hover:bg-slate-700 transition-colors" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex items-center justify-between" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex-1" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)(__assign({ class: "font-semibold text-white mb-1" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "font-mono text-teal-400" }));
                (processo.codigo_transferegov || 'Sem SEI');
                (processo.name);
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex items-center gap-4 text-xs text-slate-400" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
                (__VLS_ctx.formatarMoeda(processo.valor_total_destinado || 0));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
                (processo.status);
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
                (__VLS_ctx.formatarData(processo.created_at));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex items-center gap-2" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: function () {
                        var _a = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            _a[_i] = arguments[_i];
                        }
                        var $event = _a[0];
                        if (!(__VLS_ctx.show))
                            return;
                        if (!(__VLS_ctx.abaAtiva === 'processos'))
                            return;
                        if (!!(__VLS_ctx.loadingProcessos))
                            return;
                        if (!!(__VLS_ctx.processosVinculados.length === 0))
                            return;
                        __VLS_ctx.visualizarProcesso(processo);
                    } }, { class: "px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: function () {
                        var _a = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            _a[_i] = arguments[_i];
                        }
                        var $event = _a[0];
                        if (!(__VLS_ctx.show))
                            return;
                        if (!(__VLS_ctx.abaAtiva === 'processos'))
                            return;
                        if (!!(__VLS_ctx.loadingProcessos))
                            return;
                        if (!!(__VLS_ctx.processosVinculados.length === 0))
                            return;
                        __VLS_ctx.abrirModalConfirmacaoDesnviular(processo);
                    } }, { class: "px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition" }));
            };
            for (var _i = 0, _f = __VLS_getVForSourceType((__VLS_ctx.processosVinculados)); _i < _f.length; _i++) {
                var processo = _f[_i][0];
                _loop_1(processo);
            }
        }
    }
    if (__VLS_ctx.abaAtiva === 'registros') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "space-y-4" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)(__assign({ class: "text-lg font-semibold text-white" }));
        if (__VLS_ctx.loadingRegistros) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex justify-center py-8" }));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400" }));
        }
        else if (__VLS_ctx.registrosGastos.length === 0) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "text-center py-8 text-slate-400" }));
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "space-y-3" }));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "bg-slate-800 border border-slate-700 rounded-lg p-4 mb-6" }));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)(__assign({ class: "font-semibold text-white mb-2" }));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "grid grid-cols-1 md:grid-cols-3 gap-4 text-sm" }));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "text-slate-400" }));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "text-lg font-bold text-red-400" }));
            (__VLS_ctx.formatarMoeda(__VLS_ctx.totalGastos));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "text-slate-400" }));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "text-lg font-bold text-green-400" }));
            (__VLS_ctx.formatarMoeda(__VLS_ctx.totalDestinado));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "text-slate-400" }));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "text-lg font-bold" }, { class: (__VLS_ctx.saldoRestante >= 0 ? 'text-green-400' : 'text-red-400') }));
            (__VLS_ctx.formatarMoeda(__VLS_ctx.saldoRestante));
            for (var _g = 0, _h = __VLS_getVForSourceType((__VLS_ctx.registrosGastos)); _g < _h.length; _g++) {
                var registro = _h[_g][0];
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ key: (registro.id) }, { class: "bg-slate-800 border border-slate-700 rounded-lg p-4" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex items-center justify-between" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex-1" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)(__assign({ class: "font-semibold text-white mb-1" }));
                (registro.description || 'Sem descrição');
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex items-center gap-4 text-xs text-slate-400" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
                (registro.process_sei);
                if (registro.request_date) {
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
                    (__VLS_ctx.formatarData(registro.request_date));
                }
                if (registro.acquisition_date) {
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
                    (__VLS_ctx.formatarData(registro.acquisition_date));
                }
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "text-right" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "text-lg font-bold text-red-400" }));
                (__VLS_ctx.formatarMoeda(registro.amount_used));
                if (registro.file_url) {
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "mt-1" }));
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)(__assign({ href: (registro.file_url), target: "_blank" }, { class: "text-xs text-teal-400 hover:text-teal-300 transition flex items-center gap-1" }));
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign({ class: "w-3 h-3" }, { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }));
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
                        'stroke-linecap': "round",
                        'stroke-linejoin': "round",
                        'stroke-width': "2",
                        d: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1",
                    });
                }
            }
        }
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    /** @type {[typeof LinkProcessModal, ]} */ ;
    // @ts-ignore
    var __VLS_0 = __VLS_asFunctionalComponent(LinkProcessModal, new LinkProcessModal(__assign(__assign({ 'onClose': {} }, { 'onProcessLinked': {} }), { show: (__VLS_ctx.showLinkProcessModal), actionId: (__VLS_ctx.acao.id) })));
    var __VLS_1 = __VLS_0.apply(void 0, __spreadArray([__assign(__assign({ 'onClose': {} }, { 'onProcessLinked': {} }), { show: (__VLS_ctx.showLinkProcessModal), actionId: (__VLS_ctx.acao.id) })], __VLS_functionalComponentArgsRest(__VLS_0), false));
    var __VLS_3 = void 0;
    var __VLS_4 = void 0;
    var __VLS_5 = void 0;
    var __VLS_6 = {
        onClose: (__VLS_ctx.fecharLinkProcessModal)
    };
    var __VLS_7 = {
        onProcessLinked: (__VLS_ctx.handleProcessLinked)
    };
    var __VLS_2;
    /** @type {[typeof ConfirmationModal, ]} */ ;
    // @ts-ignore
    var __VLS_8 = __VLS_asFunctionalComponent(ConfirmationModal, new ConfirmationModal(__assign(__assign({ 'onCancel': {} }, { 'onConfirm': {} }), { show: (__VLS_ctx.showConfirmationModal), title: "Confirmar Desnvinculação", message: "Tem certeza que deseja desnvicular este processo da ação?" })));
    var __VLS_9 = __VLS_8.apply(void 0, __spreadArray([__assign(__assign({ 'onCancel': {} }, { 'onConfirm': {} }), { show: (__VLS_ctx.showConfirmationModal), title: "Confirmar Desnvinculação", message: "Tem certeza que deseja desnvicular este processo da ação?" })], __VLS_functionalComponentArgsRest(__VLS_8), false));
    var __VLS_11 = void 0;
    var __VLS_12 = void 0;
    var __VLS_13 = void 0;
    var __VLS_14 = {
        onCancel: (__VLS_ctx.fecharConfirmationModal)
    };
    var __VLS_15 = {
        onConfirm: (__VLS_ctx.handleDesvincularConfirmado)
    };
    var __VLS_10;
    if (__VLS_ctx.processoSelecionado) {
        /** @type {[typeof ProcessoDetalhesModal, ]} */ ;
        // @ts-ignore
        var __VLS_16 = __VLS_asFunctionalComponent(ProcessoDetalhesModal, new ProcessoDetalhesModal(__assign(__assign(__assign(__assign({ 'onClose': {} }, { 'onAtualizarProcesso': {} }), { 'onSwitchToEtapas': {} }), { 'onSwitchToRegistros': {} }), { show: (__VLS_ctx.showProcessoDetalhesModal), processo: (__VLS_ctx.processoSelecionado), isAdmin: (((_a = __VLS_ctx.user) === null || _a === void 0 ? void 0 : _a.role) === 'Admin') })));
        var __VLS_17 = __VLS_16.apply(void 0, __spreadArray([__assign(__assign(__assign(__assign({ 'onClose': {} }, { 'onAtualizarProcesso': {} }), { 'onSwitchToEtapas': {} }), { 'onSwitchToRegistros': {} }), { show: (__VLS_ctx.showProcessoDetalhesModal), processo: (__VLS_ctx.processoSelecionado), isAdmin: (((_b = __VLS_ctx.user) === null || _b === void 0 ? void 0 : _b.role) === 'Admin') })], __VLS_functionalComponentArgsRest(__VLS_16), false));
        var __VLS_19 = void 0;
        var __VLS_20 = void 0;
        var __VLS_21 = void 0;
        var __VLS_22 = {
            onClose: (__VLS_ctx.fecharModalDetalhesProcesso)
        };
        var __VLS_23 = {
            onAtualizarProcesso: (__VLS_ctx.atualizarProcesso)
        };
        var __VLS_24 = {
            onSwitchToEtapas: (__VLS_ctx.handleSwitchToEtapas)
        };
        var __VLS_25 = {
            onSwitchToRegistros: (__VLS_ctx.handleSwitchToRegistros)
        };
        var __VLS_18;
    }
    if (__VLS_ctx.processoSelecionado) {
        /** @type {[typeof ProcessoEtapasModal, ]} */ ;
        // @ts-ignore
        var __VLS_26 = __VLS_asFunctionalComponent(ProcessoEtapasModal, new ProcessoEtapasModal(__assign(__assign(__assign(__assign({ 'onClose': {} }, { 'onAtualizarProcesso': {} }), { 'onSwitchToDetalhes': {} }), { 'onSwitchToRegistros': {} }), { show: (__VLS_ctx.showProcessoEtapasModal), processo: (__VLS_ctx.processoSelecionado), isAdmin: (((_c = __VLS_ctx.user) === null || _c === void 0 ? void 0 : _c.role) === 'Admin') })));
        var __VLS_27 = __VLS_26.apply(void 0, __spreadArray([__assign(__assign(__assign(__assign({ 'onClose': {} }, { 'onAtualizarProcesso': {} }), { 'onSwitchToDetalhes': {} }), { 'onSwitchToRegistros': {} }), { show: (__VLS_ctx.showProcessoEtapasModal), processo: (__VLS_ctx.processoSelecionado), isAdmin: (((_d = __VLS_ctx.user) === null || _d === void 0 ? void 0 : _d.role) === 'Admin') })], __VLS_functionalComponentArgsRest(__VLS_26), false));
        var __VLS_29 = void 0;
        var __VLS_30 = void 0;
        var __VLS_31 = void 0;
        var __VLS_32 = {
            onClose: (__VLS_ctx.fecharModalDetalhesProcesso)
        };
        var __VLS_33 = {
            onAtualizarProcesso: (__VLS_ctx.atualizarProcesso)
        };
        var __VLS_34 = {
            onSwitchToDetalhes: (__VLS_ctx.handleSwitchToDetalhes)
        };
        var __VLS_35 = {
            onSwitchToRegistros: (__VLS_ctx.handleSwitchToRegistros)
        };
        var __VLS_28;
    }
    if (__VLS_ctx.processoSelecionado) {
        /** @type {[typeof ProcessoRegistrosModal, ]} */ ;
        // @ts-ignore
        var __VLS_36 = __VLS_asFunctionalComponent(ProcessoRegistrosModal, new ProcessoRegistrosModal(__assign(__assign(__assign(__assign({ 'onClose': {} }, { 'onAtualizarProcesso': {} }), { 'onSwitchToDetalhes': {} }), { 'onSwitchToEtapas': {} }), { show: (__VLS_ctx.showProcessoRegistrosModal), processo: (__VLS_ctx.processoSelecionado) })));
        var __VLS_37 = __VLS_36.apply(void 0, __spreadArray([__assign(__assign(__assign(__assign({ 'onClose': {} }, { 'onAtualizarProcesso': {} }), { 'onSwitchToDetalhes': {} }), { 'onSwitchToEtapas': {} }), { show: (__VLS_ctx.showProcessoRegistrosModal), processo: (__VLS_ctx.processoSelecionado) })], __VLS_functionalComponentArgsRest(__VLS_36), false));
        var __VLS_39 = void 0;
        var __VLS_40 = void 0;
        var __VLS_41 = void 0;
        var __VLS_42 = {
            onClose: (__VLS_ctx.fecharModalDetalhesProcesso)
        };
        var __VLS_43 = {
            onAtualizarProcesso: (__VLS_ctx.atualizarProcesso)
        };
        var __VLS_44 = {
            onSwitchToDetalhes: (__VLS_ctx.handleSwitchToDetalhes)
        };
        var __VLS_45 = {
            onSwitchToEtapas: (__VLS_ctx.handleSwitchToEtapas)
        };
        var __VLS_38;
    }
}
/** @type {__VLS_StyleScopedClasses['fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black/50']} */ ;
/** @type {__VLS_StyleScopedClasses['backdrop-blur-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['z-50']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-900']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-700']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-6xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-4']} */ ;
/** @type {__VLS_StyleScopedClasses['max-h-[90vh]']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-700']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['w-6']} */ ;
/** @type {__VLS_StyleScopedClasses['h-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-700']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-800/50']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-y-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-teal-600']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-teal-700']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-8']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-8']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-3']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-800']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-700']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-slate-700']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-mono']} */ ;
/** @type {__VLS_StyleScopedClasses['text-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-blue-700']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-red-600']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-red-700']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-8']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-8']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-3']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-800']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-700']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-3']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-green-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-800']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-700']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-right']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-teal-300']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
/** @type {__VLS_StyleScopedClasses['w-3']} */ ;
/** @type {__VLS_StyleScopedClasses['h-3']} */ ;
var __VLS_dollars;
var __VLS_self = (await import('vue')).defineComponent({
    setup: function () {
        return {
            LinkProcessModal: LinkProcessModal,
            ConfirmationModal: ConfirmationModal,
            ProcessoDetalhesModal: ProcessoDetalhesModal,
            ProcessoEtapasModal: ProcessoEtapasModal,
            ProcessoRegistrosModal: ProcessoRegistrosModal,
            user: user,
            formatarMoeda: formatarMoeda,
            formatarData: formatarData,
            abaAtiva: abaAtiva,
            processosVinculados: processosVinculados,
            registrosGastos: registrosGastos,
            loadingProcessos: loadingProcessos,
            loadingRegistros: loadingRegistros,
            showLinkProcessModal: showLinkProcessModal,
            showConfirmationModal: showConfirmationModal,
            processoSelecionado: processoSelecionado,
            showProcessoDetalhesModal: showProcessoDetalhesModal,
            showProcessoEtapasModal: showProcessoEtapasModal,
            showProcessoRegistrosModal: showProcessoRegistrosModal,
            totalGastos: totalGastos,
            totalDestinado: totalDestinado,
            saldoRestante: saldoRestante,
            fecharModal: fecharModal,
            abrirLinkProcessModal: abrirLinkProcessModal,
            fecharLinkProcessModal: fecharLinkProcessModal,
            handleProcessLinked: handleProcessLinked,
            abrirModalConfirmacaoDesnviular: abrirModalConfirmacaoDesnviular,
            fecharConfirmationModal: fecharConfirmationModal,
            fecharModalDetalhesProcesso: fecharModalDetalhesProcesso,
            visualizarProcesso: visualizarProcesso,
            handleSwitchToEtapas: handleSwitchToEtapas,
            handleSwitchToDetalhes: handleSwitchToDetalhes,
            handleSwitchToRegistros: handleSwitchToRegistros,
            atualizarProcesso: atualizarProcesso,
            handleDesvincularConfirmado: handleDesvincularConfirmado,
        };
    },
    __typeEmits: {},
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup: function () {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
