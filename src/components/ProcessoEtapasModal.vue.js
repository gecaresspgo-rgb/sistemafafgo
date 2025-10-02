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
import { ref, defineProps, defineEmits, computed, watchEffect, onMounted, onUnmounted, watch } from 'vue';
import { tempoGastoEtapa, tempoTotalProcesso } from '../composables/useEtapaTimer';
import { buscarEtapasDoProcesso } from '../services/auth';
import { supabase } from '../services/supabase';
import { useAuth } from '../composables/useAuth';
import { useFormatters } from '../composables/useFormatters';
var _a = useAuth(); // Removido user e fetchUser pois não são utilizados
// Importar funções de formatação do composable
var _b = useFormatters(), formatarData = _b.formatarData, formatarSegundos = _b.formatarSegundos;
// Props e emits
var props = defineProps({
    show: {
        type: Boolean,
        default: false
    },
    processo: {
        type: Object,
        required: true
    }
});
var emit = defineEmits(['close', 'atualizar-processo', 'switch-to-detalhes', 'switch-to-registros']);
// Estado do modal
var etapas = ref([]);
var etapaAtual = ref(0);
var carregandoEtapas = ref(false);
var erroEtapas = ref('');
var tempoEtapaAtual = ref(0);
var timerInterval = null;
// NOVOS estados para controlar a UI do checklist
var etapaExpandidaId = ref(null);
var novaSubEtapaTexto = ref('');
var carregandoChecklist = ref(false);
// Computed properties
var tempoTotal = computed(function () { return tempoTotalProcesso(etapas.value); });
var etapaCanceladaIndex = computed(function () {
    // Se o processo não está cancelado, não há etapa cancelada.
    if (props.processo.status !== 'Cancelado') {
        return -1;
    }
    // Se estiver cancelado, encontramos o índice da última etapa que foi iniciada.
    // Procuramos de trás para frente para garantir que pegamos a mais avançada.
    var lastStartedIndex = -1;
    for (var i = etapas.value.length - 1; i >= 0; i--) {
        if (etapas.value[i].started_at) {
            lastStartedIndex = i;
            break;
        }
    }
    return lastStartedIndex;
});
// Funções
function carregarEtapas() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    carregandoEtapas.value = true;
                    erroEtapas.value = '';
                    etapas.value = [];
                    etapaAtual.value = 0;
                    return [4 /*yield*/, buscarEtapasDoProcesso(props.processo.id)];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        erroEtapas.value = 'Erro ao buscar etapas: ' + error.message;
                    }
                    else if (data && data.length > 0) {
                        etapas.value = data.map(function (e) { return ({
                            id: e.id,
                            nome: (e.step_templates && typeof e.step_templates === 'object' && 'name' in e.step_templates) ? e.step_templates.name || '' : '',
                            descricao: '',
                            cor: '#2196f3',
                            started_at: e.started_at,
                            ended_at: e.ended_at,
                            is_current: e.is_current,
                            step_order: e.step_order,
                            inicio: e.started_at ? new Date(e.started_at).getTime() : null,
                            fim: e.ended_at ? new Date(e.ended_at).getTime() : null,
                            accumulated_duration_seconds: e.accumulated_duration_seconds || 0,
                            checklist: Array.isArray(e.step_checklist_items) ? e.step_checklist_items : [],
                        }); });
                        etapaAtual.value = data.findIndex(function (e) { return Boolean(e.is_current); });
                        if (etapaAtual.value === -1)
                            etapaAtual.value = 0;
                    }
                    carregandoEtapas.value = false;
                    return [2 /*return*/];
            }
        });
    });
}
function startTimer() {
    stopTimer();
    var etapa = etapas.value[etapaAtual.value];
    if (etapa && etapa.started_at && !etapa.ended_at && etapa.is_current) {
        tempoEtapaAtual.value = tempoGastoEtapa(etapa.started_at);
        timerInterval = setInterval(function () {
            tempoEtapaAtual.value = tempoGastoEtapa(etapa.started_at);
        }, 1000);
    }
}
function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}
// Função para expandir/recolher uma etapa
function toggleEtapa(etapaId) {
    if (etapaExpandidaId.value === etapaId) {
        etapaExpandidaId.value = null;
    }
    else {
        etapaExpandidaId.value = etapaId;
    }
}
function getEtapaStyle(etapa, index) {
    var isConcluida = !!etapa.ended_at;
    // 1. VERIFICAÇÃO DE PRIORIDADE MÁXIMA: É a etapa onde o processo foi cancelado?
    if (props.processo.status === 'Cancelado' && index === etapaCanceladaIndex.value) {
        return {
            borderColor: '#ef4444', // Vermelho
            background: 'linear-gradient(to right, #ef4444cc, #dc2626cc)',
            color: '#fff',
        };
    }
    // 2. Se não for, verifica se a etapa foi concluída normalmente.
    if (isConcluida) {
        return {
            borderColor: '#22c55e', // Verde
            background: 'linear-gradient(to right, #22c55ecc, #16a34acc)',
            color: '#fff',
        };
    }
    // 3. Se não, verifica se é a etapa atual de um processo em andamento.
    if (etapa.is_current) {
        return {
            borderColor: '#14b8a6', // Teal
            background: 'linear-gradient(to right, #14b8a6cc, #06b6d4cc)',
            color: '#fff',
        };
    }
    // 4. Caso contrário, é uma etapa futura.
    return {
        borderColor: '#334155', // Cinza
        background: '#1e293b',
        color: '#94a3b8',
    };
}
// Função para adicionar uma nova subtarefa
function adicionarSubEtapa(etapa) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!novaSubEtapaTexto.value.trim())
                        return [2 /*return*/];
                    carregandoChecklist.value = true;
                    return [4 /*yield*/, supabase
                            .from('step_checklist_items')
                            .insert({
                            process_step_id: etapa.id,
                            task_description: novaSubEtapaTexto.value
                        })
                            .select()
                            .single()];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        console.error('Erro ao adicionar subtarefa:', error);
                    }
                    else if (data) {
                        etapa.checklist.push(data);
                        novaSubEtapaTexto.value = '';
                    }
                    carregandoChecklist.value = false;
                    return [2 /*return*/];
            }
        });
    });
}
// Função para excluir uma subtarefa
function excluirSubEtapa(etapa, itemId) {
    return __awaiter(this, void 0, void 0, function () {
        var error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, supabase
                        .from('step_checklist_items')
                        .delete()
                        .eq('id', itemId)];
                case 1:
                    error = (_a.sent()).error;
                    if (error) {
                        console.error('Erro ao excluir subtarefa:', error);
                    }
                    else {
                        etapa.checklist = etapa.checklist.filter(function (item) { return item.id !== itemId; });
                    }
                    return [2 /*return*/];
            }
        });
    });
}
// Função para marcar/desmarcar um item do checklist
function toggleChecklistItem(item) {
    return __awaiter(this, void 0, void 0, function () {
        var error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, supabase
                        .from('step_checklist_items')
                        .update({ is_completed: item.is_completed })
                        .eq('id', item.id)];
                case 1:
                    error = (_a.sent()).error;
                    if (error) {
                        console.error('Erro ao atualizar status da subtarefa:', error);
                        // Reverter a alteração local em caso de erro
                        item.is_completed = !item.is_completed;
                    }
                    return [2 /*return*/];
            }
        });
    });
}
// Copie esta função inteira...
function passarEtapa() {
    return __awaiter(this, void 0, void 0, function () {
        var error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!props.processo.id)
                        return [2 /*return*/];
                    return [4 /*yield*/, supabase.rpc('avancar_etapa_e_recalcular', {
                            p_processo_id: props.processo.id
                        })];
                case 1:
                    error = (_a.sent()).error;
                    if (!!error) return [3 /*break*/, 3];
                    // 2. Apenas notifica a tela principal para buscar os dados 100% atualizados do banco.
                    //    Não há mais cálculos ou "adivinhações" no frontend.
                    emit('atualizar-processo');
                    // 3. Recarrega a lista de etapas dentro do próprio modal para refletir a mudança.
                    return [4 /*yield*/, carregarEtapas()];
                case 2:
                    // 3. Recarrega a lista de etapas dentro do próprio modal para refletir a mudança.
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    console.error("Erro ao avançar etapa:", error);
                    alert("Ocorreu um erro ao tentar avançar a etapa.");
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function voltarEtapa() {
    return __awaiter(this, void 0, void 0, function () {
        var error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!props.processo.id)
                        return [2 /*return*/];
                    return [4 /*yield*/, supabase.rpc('devolver_etapa_e_recalcular', {
                            p_processo_id: props.processo.id
                        })];
                case 1:
                    error = (_a.sent()).error;
                    if (error) {
                        console.error('Erro ao voltar etapa:', error);
                        alert('Erro ao voltar etapa: ' + (error.message || 'Erro desconhecido'));
                        return [2 /*return*/];
                    }
                    // Após o sucesso, apenas notifica a tela principal para recarregar tudo do banco
                    emit('atualizar-processo');
                    // E recarrega as etapas no modal
                    return [4 /*yield*/, carregarEtapas()];
                case 2:
                    // E recarrega as etapas no modal
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// Função para fechar o modal
function fecharEtapas() {
    emit('close');
}
// Função para alternar para o modal de detalhes
function switchToDetalhes() {
    emit('switch-to-detalhes');
}
// Função para alternar para o modal de registros
function switchToRegistros() {
    emit('switch-to-registros');
}
// A função formatarData foi removida e agora é importada do composable useFormatters
// Watchers e lifecycle hooks
watchEffect(function () {
    startTimer();
});
watch(function () { return props.show; }, function (newVal) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!newVal) return [3 /*break*/, 2];
                return [4 /*yield*/, carregarEtapas()];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); });
onMounted(function () {
    if (props.show) {
        carregarEtapas();
    }
    startTimer();
});
onUnmounted(function () {
    stopTimer();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = {};
var __VLS_components;
var __VLS_directives;
if (__VLS_ctx.show) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ onClick: (__VLS_ctx.fecharEtapas) }, { class: "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "bg-gradient-to-br from-slate-900/95 to-blue-900/95 backdrop-blur-md border border-white/20 text-white rounded-xl shadow-2xl p-8 max-w-2xl w-full relative max-h-[80vh] overflow-y-auto" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.fecharEtapas) }, { class: "absolute top-2 right-2 p-2 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign(__assign({ xmlns: 'http://www.w3.org/2000/svg' }, { class: 'w-6 h-6' }), { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        d: 'M18 6L6 18M6 6l12 12',
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex items-center gap-4 mb-4" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex bg-slate-800/50 rounded-lg p-1" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.switchToDetalhes) }, { class: "px-4 py-1.5 rounded-md font-medium transition-all text-slate-300 hover:text-white hover:bg-white/10" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ class: "px-4 py-1.5 rounded-md font-medium transition-all bg-gradient-to-r from-teal-600 to-cyan-500 text-white" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.switchToRegistros) }, { class: "px-4 py-1.5 rounded-md font-medium transition-all text-slate-300 hover:text-white hover:bg-white/10" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)(__assign({ class: "text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent mb-2" }));
    (__VLS_ctx.processo.nome_acao || 'Processo sem nome');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "mb-4 text-slate-300" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "font-semibold" }));
    (__VLS_ctx.formatarSegundos(__VLS_ctx.tempoTotal));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex justify-between items-center mb-4" }));
    if (__VLS_ctx.etapaAtual > 0 && __VLS_ctx.processo.status !== 'Concluído') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.voltarEtapa) }, { class: "px-4 py-2 bg-red-700 hover:bg-red-500 text-white rounded-lg font-semibold shadow transition" }));
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    }
    if (__VLS_ctx.processo.status !== 'Concluído') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.passarEtapa) }, { class: "px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-700 hover:to-cyan-600 text-white rounded-lg font-semibold shadow transition" }));
        ((__VLS_ctx.processo.etapaAtual === __VLS_ctx.processo.totalEtapas - 1 && __VLS_ctx.processo.totalEtapas > 0) ? 'Concluir Processo' : 'Passar Etapa');
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "grid grid-cols-1 md:grid-cols-2 gap-4" }));
    var _loop_1 = function (etapa, idx) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (etapa.id),
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!(__VLS_ctx.show))
                    return;
                __VLS_ctx.toggleEtapa(etapa.id);
            } }, { class: "flex items-start gap-3 p-3 rounded-lg border border-white/20 bg-white/10 shadow-sm relative cursor-pointer hover:border-teal-400/50 transition-all" }), { class: ({ 'border-teal-400 bg-teal-600/20': idx === __VLS_ctx.etapaAtual }) }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "w-8 h-8 rounded-full flex items-center justify-center border-2 font-bold" }, { style: (__VLS_ctx.getEtapaStyle(etapa, idx)) }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (idx + 1);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex-1" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex items-center justify-between" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)(__assign({ class: "font-semibold text-white" }));
        (etapa.nome);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex items-center gap-1" }));
        if (idx === __VLS_ctx.etapaAtual && !etapa.ended_at) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "text-xs text-teal-400 font-semibold" }));
            (__VLS_ctx.formatarSegundos(__VLS_ctx.tempoEtapaAtual));
        }
        else if (etapa.accumulated_duration_seconds) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "text-xs text-slate-400" }));
            (__VLS_ctx.formatarSegundos(etapa.accumulated_duration_seconds));
        }
        if (__VLS_ctx.etapaExpandidaId === etapa.id) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign({ class: "w-4 h-4 text-teal-400" }, { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
                'stroke-linecap': "round",
                'stroke-linejoin': "round",
                'stroke-width': "2",
                d: "M5 15l7-7 7 7",
            });
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign({ class: "w-4 h-4 text-slate-400" }, { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
                'stroke-linecap': "round",
                'stroke-linejoin': "round",
                'stroke-width': "2",
                d: "M19 9l-7 7-7-7",
            });
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "text-xs text-slate-400 flex items-center gap-2" }));
        if (etapa.started_at) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (__VLS_ctx.formatarData(etapa.started_at));
        }
        if (etapa.ended_at) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (__VLS_ctx.formatarData(etapa.ended_at));
        }
        if (__VLS_ctx.etapaExpandidaId === etapa.id) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "pl-8 pr-2 pt-3 pb-2 bg-slate-800/50 rounded-b-lg" }));
            if (etapa.checklist && etapa.checklist.length > 0) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "space-y-2 mb-3" }));
                var _loop_2 = function (item) {
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ key: (item.id) }, { class: "flex items-center justify-between group" }));
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "flex items-center gap-3 text-sm text-slate-200 cursor-pointer" }));
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign(__assign(__assign({ onChange: function () {
                            var _a = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                _a[_i] = arguments[_i];
                            }
                            var $event = _a[0];
                            if (!(__VLS_ctx.show))
                                return;
                            if (!(__VLS_ctx.etapaExpandidaId === etapa.id))
                                return;
                            if (!(etapa.checklist && etapa.checklist.length > 0))
                                return;
                            __VLS_ctx.toggleChecklistItem(item);
                        } }, { onClick: function () { } }), { type: "checkbox" }), { class: "w-5 h-5 accent-teal-500 bg-slate-700 border-slate-600 rounded" }));
                    (item.is_completed);
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: ({ 'line-through text-slate-500': item.is_completed }) }));
                    (item.task_description);
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: function () {
                            var _a = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                _a[_i] = arguments[_i];
                            }
                            var $event = _a[0];
                            if (!(__VLS_ctx.show))
                                return;
                            if (!(__VLS_ctx.etapaExpandidaId === etapa.id))
                                return;
                            if (!(etapa.checklist && etapa.checklist.length > 0))
                                return;
                            __VLS_ctx.excluirSubEtapa(etapa, item.id);
                        } }, { class: "text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" }));
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign({ class: "w-4 h-4" }, { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }));
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
                        'stroke-linecap': "round",
                        'stroke-linejoin': "round",
                        'stroke-width': "2",
                        d: "M6 18L18 6M6 6l12 12",
                    });
                };
                for (var _e = 0, _f = __VLS_getVForSourceType((etapa.checklist)); _e < _f.length; _e++) {
                    var item = _f[_e][0];
                    _loop_2(item);
                }
            }
            else {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "text-sm text-slate-500 text-center mb-3" }));
            }
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex items-center gap-2" }));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign(__assign(__assign({ onKeyup: function () {
                    var _a = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        _a[_i] = arguments[_i];
                    }
                    var $event = _a[0];
                    if (!(__VLS_ctx.show))
                        return;
                    if (!(__VLS_ctx.etapaExpandidaId === etapa.id))
                        return;
                    __VLS_ctx.adicionarSubEtapa(etapa);
                } }, { onClick: function () { } }), { value: (__VLS_ctx.novaSubEtapaTexto), type: "text", placeholder: "Adicionar nova subtarefa..." }), { class: "flex-1 px-2 py-1 bg-slate-900/80 border border-slate-600 rounded text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-400 text-sm" }));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: function () {
                    var _a = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        _a[_i] = arguments[_i];
                    }
                    var $event = _a[0];
                    if (!(__VLS_ctx.show))
                        return;
                    if (!(__VLS_ctx.etapaExpandidaId === etapa.id))
                        return;
                    __VLS_ctx.adicionarSubEtapa(etapa);
                } }, { disabled: (__VLS_ctx.carregandoChecklist) }), { class: "px-3 py-1 bg-teal-600 text-white rounded text-sm font-semibold hover:bg-teal-500 disabled:opacity-50" }));
        }
    };
    for (var _i = 0, _c = __VLS_getVForSourceType((__VLS_ctx.etapas)); _i < _c.length; _i++) {
        var _d = _c[_i], etapa = _d[0], idx = _d[1];
        _loop_1(etapa, idx);
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
/** @type {__VLS_StyleScopedClasses['max-w-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['max-h-[80vh]']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-y-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['top-2']} */ ;
/** @type {__VLS_StyleScopedClasses['right-2']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['w-6']} */ ;
/** @type {__VLS_StyleScopedClasses['h-6']} */ ;
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
/** @type {__VLS_StyleScopedClasses['text-slate-300']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-white/10']} */ ;
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
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
/** @type {__VLS_StyleScopedClasses['from-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['to-cyan-300']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-clip-text']} */ ;
/** @type {__VLS_StyleScopedClasses['text-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-300']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-red-700']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-red-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
/** @type {__VLS_StyleScopedClasses['from-teal-600']} */ ;
/** @type {__VLS_StyleScopedClasses['to-cyan-500']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:from-teal-700']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:to-cyan-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-start']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:border-teal-400/50']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['border-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-teal-600/20']} */ ;
/** @type {__VLS_StyleScopedClasses['w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['border-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-8']} */ ;
/** @type {__VLS_StyleScopedClasses['pr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-800/50']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-b-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['accent-teal-500']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-700']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-600']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['line-through']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-500']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-red-400']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-0']} */ ;
/** @type {__VLS_StyleScopedClasses['group-hover:opacity-100']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-opacity']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-900/80']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-600']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['placeholder:text-slate-500']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-1']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-teal-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-teal-500']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:opacity-50']} */ ;
var __VLS_dollars;
var __VLS_self = (await import('vue')).defineComponent({
    setup: function () {
        return {
            formatarData: formatarData,
            formatarSegundos: formatarSegundos,
            etapas: etapas,
            etapaAtual: etapaAtual,
            tempoEtapaAtual: tempoEtapaAtual,
            etapaExpandidaId: etapaExpandidaId,
            novaSubEtapaTexto: novaSubEtapaTexto,
            carregandoChecklist: carregandoChecklist,
            tempoTotal: tempoTotal,
            toggleEtapa: toggleEtapa,
            getEtapaStyle: getEtapaStyle,
            adicionarSubEtapa: adicionarSubEtapa,
            excluirSubEtapa: excluirSubEtapa,
            toggleChecklistItem: toggleChecklistItem,
            passarEtapa: passarEtapa,
            voltarEtapa: voltarEtapa,
            fecharEtapas: fecharEtapas,
            switchToDetalhes: switchToDetalhes,
            switchToRegistros: switchToRegistros,
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
        }
    },
});
; /* PartiallyEnd: #4569/main.vue */
