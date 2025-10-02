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
import { ref, defineProps, defineEmits, watch, computed } from 'vue';
// As importações desnecessárias (onMounted, reactive, etc.) e as de bibliotecas
// que foram movidas (Tribute, jsPDF, etc.) foram removidas.
import { registrarEventoHistorico } from '../services/auth';
import { supabase } from '../services/supabase';
import { useAuth } from '../composables/useAuth';
import { useFormatters } from '../composables/useFormatters';
var _a = useAuth(), user = _a.user, fetchUser = _a.fetchUser;
// Importar funções de formatação do composable
var _b = useFormatters(), formatarValor = _b.formatarValor, formatarData = _b.formatarData;
// Definir eventos que este componente pode emitir
var emit = defineEmits(['abrir-detalhes', 'mostrar-etapas', 'atualizar-processo']);
var props = defineProps({
    processo: {
        type: Object,
        required: true,
    },
});
// Lógica para favoritar, que pertence ao card
var isFavorited = ref(props.processo.is_favorited);
watch(function () { return props.processo.is_favorited; }, function (val) { isFavorited.value = val; });
// Funções de ação do card
function abrirEtapas(e) {
    e.stopPropagation();
    // Emitir evento para o componente pai (ProcessosView.vue) abrir o modal de etapas
    emit('mostrar-etapas', props.processo);
}
var valorTotalDestinadoCalculado = computed(function () {
    var inicial = Number(props.processo.valor_inicial_padrao) || 0;
    var rendimentos = Number(props.processo.valor_rendimentos) || 0;
    var economicidade = Number(props.processo.valor_economicidade) || 0;
    return inicial + rendimentos + economicidade;
});
// Em ProcessoCard.vue -> <script setup>
function passarEtapa(e) {
    return __awaiter(this, void 0, void 0, function () {
        var error, isFinalStep, nomeEtapa;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.stopPropagation();
                    if (!props.processo.id)
                        return [2 /*return*/];
                    return [4 /*yield*/, supabase.rpc('avancar_etapa_e_recalcular', {
                            p_processo_id: props.processo.id
                        })];
                case 1:
                    error = (_a.sent()).error;
                    if (!!error) return [3 /*break*/, 3];
                    isFinalStep = props.processo.etapaAtual === props.processo.totalEtapas - 1 && props.processo.totalEtapas > 0;
                    nomeEtapa = isFinalStep ? 'Processo Concluído.' : "Etapa avan\u00E7ada.";
                    return [4 /*yield*/, registrarEventoHistorico(props.processo.id, nomeEtapa)];
                case 2:
                    _a.sent();
                    // 3. Apenas notifica a tela principal para buscar os dados 100% atualizados do banco.
                    emit('atualizar-processo');
                    return [3 /*break*/, 4];
                case 3:
                    console.error("Erro ao avançar a etapa:", error);
                    alert("Ocorreu um erro ao avançar a etapa: " + error.message);
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function toggleFavorite() {
    return __awaiter(this, void 0, void 0, function () {
        var usuario, processoAtualizado;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    usuario = user.value;
                    if (!!usuario) return [3 /*break*/, 2];
                    return [4 /*yield*/, fetchUser()];
                case 1:
                    usuario = _a.sent();
                    _a.label = 2;
                case 2:
                    if (!usuario)
                        return [2 /*return*/];
                    if (!isFavorited.value) return [3 /*break*/, 4];
                    // Desfavoritar
                    return [4 /*yield*/, supabase.from('user_favorites').delete().match({ user_id: usuario.id, process_id: props.processo.id })];
                case 3:
                    // Desfavoritar
                    _a.sent();
                    isFavorited.value = false;
                    return [3 /*break*/, 6];
                case 4: 
                // Favoritar
                return [4 /*yield*/, supabase.from('user_favorites').insert({ user_id: usuario.id, process_id: props.processo.id })];
                case 5:
                    // Favoritar
                    _a.sent();
                    isFavorited.value = true;
                    _a.label = 6;
                case 6:
                    processoAtualizado = __assign(__assign({}, props.processo), { is_favorited: isFavorited.value });
                    emit('atualizar-processo', processoAtualizado);
                    return [2 /*return*/];
            }
        });
    });
}
// Todas as outras variáveis e funções (edição, documentos, comentários, PDF) foram removidas
// pois sua lógica foi movida para os modais correspondentes.
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = {};
var __VLS_components;
var __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "processo-card" }, { 'data-processo-id': (__VLS_ctx.processo.id) }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-xl p-6 mb-6 hover:bg-white/15 hover:scale-105 transition-all relative w-full h-full min-h-[350px]" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex items-center justify-center mb-2" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign({ class: "w-5 h-5 mr-2 text-cyan-300" }, { fill: "none", stroke: "currentColor", 'stroke-width': "2", viewBox: "0 0 24 24" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
    'stroke-linecap': "round",
    'stroke-linejoin': "round",
    d: "M12 6v6l4 2",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "text-sm text-slate-200 font-semibold text-center" }));
(__VLS_ctx.processo.etapaAtualNome ? "Etapa Atual: ".concat(__VLS_ctx.processo.etapaAtualNome) : 'Etapa Atual: Não definida');
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "w-full h-2 bg-white/10 rounded mb-3 overflow-hidden" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "h-2 rounded bg-gradient-to-r from-teal-400 to-cyan-300 transition-all" }, { style: ({ width: __VLS_ctx.processo.progresso + '%' }) }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex items-center justify-between mb-2" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: ([
        'text-xs font-bold px-3 py-1 rounded-full',
        __VLS_ctx.processo.status === 'Em Andamento'
            ? 'bg-gradient-to-r from-teal-600 to-cyan-500 text-white' :
            (__VLS_ctx.processo.status === 'Concluído'
                ? 'bg-gradient-to-r from-green-600 to-emerald-500 text-white'
                : 'bg-gradient-to-r from-red-600 to-rose-500 text-white')
    ]) }));
(__VLS_ctx.processo.status);
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.toggleFavorite) }, { 'aria-label': (__VLS_ctx.isFavorited ? 'Desfavoritar' : 'Favoritar') }));
if (__VLS_ctx.isFavorited) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign(__assign({ xmlns: "http://www.w3.org/2000/svg" }, { class: "text-red-400 w-6 h-6" }), { fill: "currentColor", viewBox: "0 0 24 24", stroke: "currentColor", 'stroke-width': "2" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
        d: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
    });
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign(__assign({ xmlns: "http://www.w3.org/2000/svg" }, { class: "text-slate-400 hover:text-red-400 cursor-pointer transition-colors w-6 h-6" }), { fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", 'stroke-width': "2" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
        d: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)(__assign({ class: "text-xl font-bold text-white mb-1" }));
(__VLS_ctx.processo.nome_acao || 'Processo sem nome');
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "text-slate-300 mb-2" }));
(__VLS_ctx.processo.descricao_geral || 'Sem descrição');
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex items-center gap-2 text-sm text-slate-400 mb-2" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign({ class: "w-4 h-4 text-teal-400" }, { fill: "none", stroke: "currentColor", 'stroke-width': "2", viewBox: "0 0 24 24" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
    'stroke-linecap': "round",
    'stroke-linejoin': "round",
    d: "M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
    'stroke-linecap': "round",
    'stroke-linejoin': "round",
    d: "M15 11a3 3 0 11-6 0 3 3 0 016 0z",
});
(__VLS_ctx.processo.forca_code || 'Não definido');
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent mb-2" }));
(__VLS_ctx.formatarValor(__VLS_ctx.valorTotalDestinadoCalculado));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex flex-wrap gap-2 mb-2" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "border border-teal-400/50 text-teal-300 bg-teal-500/10 text-xs px-2 py-1 rounded" }));
(__VLS_ctx.processo.tipo_natureza_despesa || 'Não definido');
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex items-center justify-between text-xs text-slate-400 mt-4 border-t border-white/10 pt-2" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
(__VLS_ctx.formatarData(__VLS_ctx.processo.data_encaminhamento_aprovacao || __VLS_ctx.processo.created_at));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
(__VLS_ctx.processo.ano_faf || 'Não definido');
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex gap-2 mt-4" }));
if (__VLS_ctx.processo.status !== 'Concluído') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.processo.status !== 'Concluído'))
                return;
            __VLS_ctx.passarEtapa($event);
        } }, { class: "px-3 py-1 bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-700 hover:to-cyan-600 text-white rounded font-semibold shadow flex-1" }));
    ((__VLS_ctx.processo.etapaAtual === __VLS_ctx.processo.totalEtapas - 1 && __VLS_ctx.processo.totalEtapas > 0) ? 'Concluir Processo' : 'Passar Etapa');
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.abrirEtapas) }, { class: "px-3 py-1 border border-white/20 text-slate-300 hover:bg-white/10 bg-transparent rounded font-semibold shadow flex-1" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (function ($event) { return __VLS_ctx.emit('abrir-detalhes', __VLS_ctx.processo); }) }, { class: "px-3 py-1 border border-white/20 text-slate-300 hover:bg-white/10 bg-transparent rounded font-semibold shadow flex-1" }));
/** @type {__VLS_StyleScopedClasses['processo-card']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['backdrop-blur-md']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-white/15']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:scale-105']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['min-h-[350px]']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-cyan-300']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['h-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
/** @type {__VLS_StyleScopedClasses['from-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['to-cyan-300']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-400']} */ ;
/** @type {__VLS_StyleScopedClasses['w-6']} */ ;
/** @type {__VLS_StyleScopedClasses['h-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-red-400']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['w-6']} */ ;
/** @type {__VLS_StyleScopedClasses['h-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-300']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
/** @type {__VLS_StyleScopedClasses['from-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['to-cyan-300']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-clip-text']} */ ;
/** @type {__VLS_StyleScopedClasses['text-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-teal-400/50']} */ ;
/** @type {__VLS_StyleScopedClasses['text-teal-300']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-teal-500/10']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['border-t']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
/** @type {__VLS_StyleScopedClasses['from-teal-600']} */ ;
/** @type {__VLS_StyleScopedClasses['to-cyan-500']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:from-teal-700']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:to-cyan-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-300']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-300']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
var __VLS_dollars;
var __VLS_self = (await import('vue')).defineComponent({
    setup: function () {
        return {
            formatarValor: formatarValor,
            formatarData: formatarData,
            emit: emit,
            isFavorited: isFavorited,
            abrirEtapas: abrirEtapas,
            valorTotalDestinadoCalculado: valorTotalDestinadoCalculado,
            passarEtapa: passarEtapa,
            toggleFavorite: toggleFavorite,
        };
    },
    emits: {},
    props: {
        processo: {
            type: Object,
            required: true,
        },
    },
});
export default (await import('vue')).defineComponent({
    setup: function () {
        return {};
    },
    emits: {},
    props: {
        processo: {
            type: Object,
            required: true,
        },
    },
});
; /* PartiallyEnd: #4569/main.vue */
