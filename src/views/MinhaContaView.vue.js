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
import { ref, onMounted } from 'vue';
import { useAuth } from '../composables/useAuth';
import { supabase } from '../services/supabase';
export default await (function () { return __awaiter(void 0, void 0, void 0, function () {
    function carregarEstatisticas() {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, stats;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!user.value)
                            return [2 /*return*/];
                        return [4 /*yield*/, supabase.rpc('get_user_process_stats', { user_id: user.value.id })];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            console.error('Erro ao buscar estatísticas:', error);
                            alert('Erro ao buscar estatísticas: ' + (error.message || JSON.stringify(error)));
                            estatisticas.value = { totalProcessos: 0, processosAtivos: 0, processosConcluidos: 0 };
                            return [2 /*return*/];
                        }
                        if (!data || data.length === 0) {
                            estatisticas.value = { totalProcessos: 0, processosAtivos: 0, processosConcluidos: 0 };
                            return [2 /*return*/];
                        }
                        stats = data[0];
                        estatisticas.value = {
                            totalProcessos: stats.total_processos || 0,
                            processosAtivos: stats.processos_ativos || 0,
                            processosConcluidos: stats.processos_concluidos || 0
                        };
                        return [2 /*return*/];
                }
            });
        });
    }
    function salvarInformacoes() {
        return __awaiter(this, void 0, void 0, function () {
            var errorAuth, errorProfile, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!user.value)
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, supabase.auth.updateUser({
                                data: {
                                    name: userInfo.value.name
                                }
                            })
                            // Faz upsert no profile: se não existir, cria; se existir, atualiza
                        ];
                    case 2:
                        errorAuth = (_a.sent()).error;
                        return [4 /*yield*/, supabase
                                .from('profiles')
                                .upsert({
                                id: user.value.id,
                                nome: userInfo.value.name, // salva nome também na tabela profiles
                                telefone: userInfo.value.phone,
                                setor_id: userInfo.value.setor_id
                            }, { onConflict: 'id' })];
                    case 3:
                        errorProfile = (_a.sent()).error;
                        if (errorAuth || errorProfile) {
                            alert('Erro ao salvar informações: ' + ((errorAuth === null || errorAuth === void 0 ? void 0 : errorAuth.message) || (errorProfile === null || errorProfile === void 0 ? void 0 : errorProfile.message)));
                        }
                        else {
                            alert('Informações salvas com sucesso!');
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        alert('Erro ao salvar informações');
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    function alterarSenha() {
        return __awaiter(this, void 0, void 0, function () {
            var error, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (novaSenha.value !== confirmarSenha.value) {
                            alert('As senhas não coincidem!');
                            return [2 /*return*/];
                        }
                        if (novaSenha.value.length < 6) {
                            alert('A senha deve ter pelo menos 6 caracteres!');
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, supabase.auth.updateUser({
                                password: novaSenha.value
                            })];
                    case 2:
                        error = (_a.sent()).error;
                        if (error) {
                            alert('Erro ao alterar senha: ' + error.message);
                        }
                        else {
                            alert('Senha alterada com sucesso!');
                            novaSenha.value = '';
                            confirmarSenha.value = '';
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        alert('Erro ao alterar senha');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    var user, userInfo, setores, novaSenha, confirmarSenha, estatisticas, __VLS_ctx, __VLS_components, __VLS_directives, __VLS_0, __VLS_1, __VLS_3, _i, _a, setor, __VLS_2, __VLS_dollars, __VLS_self;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                user = useAuth().user;
                userInfo = ref({
                    name: '',
                    email: '',
                    phone: '',
                    setor_id: ''
                });
                setores = ref([]);
                novaSenha = ref('');
                confirmarSenha = ref('');
                estatisticas = ref({
                    totalProcessos: 0,
                    processosAtivos: 0,
                    processosConcluidos: 0
                });
                onMounted(function () { return __awaiter(void 0, void 0, void 0, function () {
                    var perfil, setoresData;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                if (!user.value) return [3 /*break*/, 4];
                                userInfo.value.name = ((_a = user.value.user_metadata) === null || _a === void 0 ? void 0 : _a.name) || '';
                                userInfo.value.email = user.value.email || '';
                                return [4 /*yield*/, supabase
                                        .from('profiles')
                                        .select('telefone, setor_id')
                                        .eq('id', user.value.id)
                                        .single()];
                            case 1:
                                perfil = (_b.sent()).data;
                                if (perfil) {
                                    userInfo.value.phone = perfil.telefone || '';
                                    userInfo.value.setor_id = perfil.setor_id || '';
                                }
                                return [4 /*yield*/, supabase
                                        .from('setores')
                                        .select('id, nome')
                                        .order('nome', { ascending: true })];
                            case 2:
                                setoresData = (_b.sent()).data;
                                if (setoresData)
                                    setores.value = setoresData;
                                return [4 /*yield*/, carregarEstatisticas()];
                            case 3:
                                _b.sent();
                                _b.label = 4;
                            case 4: return [2 /*return*/];
                        }
                    });
                }); });
                debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
                __VLS_ctx = {};
                /** @type {[typeof Layout, typeof Layout, ]} */ ;
                __VLS_0 = __VLS_asFunctionalComponent(Layout, new Layout({}));
                __VLS_1 = __VLS_0.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_0), false));
                __VLS_3 = {};
                __VLS_2.slots.default;
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "min-h-screen flex justify-center items-stretch px-8 py-8" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "w-full max-w-5xl mx-auto" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)(__assign({ class: "text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent mb-4" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "text-slate-300 mb-6" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "grid grid-cols-1 lg:grid-cols-2 gap-8" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-xl p-6" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)(__assign({ class: "text-xl font-semibold bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent mb-4" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "space-y-4" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
                __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "block text-slate-200 font-medium mb-2" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign(__assign({ value: (__VLS_ctx.userInfo.name), type: "text" }, { class: "w-full px-3 py-2 bg-slate-900 border border-teal-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder:text-slate-400" }), { placeholder: "Seu nome completo" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
                __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "block text-slate-200 font-medium mb-2" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign(__assign({ type: "email" }, { class: "w-full px-3 py-2 bg-slate-900 border border-teal-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder:text-slate-400" }), { placeholder: "seu@email.com", disabled: true }));
                (__VLS_ctx.userInfo.email);
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
                __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "block text-slate-200 font-medium mb-2" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign(__assign({ type: "tel" }, { class: "w-full px-3 py-2 bg-slate-900 border border-teal-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder:text-slate-400" }), { placeholder: "(00) 00000-0000" }));
                (__VLS_ctx.userInfo.phone);
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
                __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "block text-slate-200 font-medium mb-2" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)(__assign(__assign({ value: (__VLS_ctx.userInfo.setor_id) }, { class: "w-full px-3 py-2 bg-slate-900 border border-teal-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 appearance-none" }), { style: {} }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
                    value: "",
                });
                for (_i = 0, _a = __VLS_getVForSourceType((__VLS_ctx.setores)); _i < _a.length; _i++) {
                    setor = _a[_i][0];
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
                        key: (setor.id),
                        value: (setor.id),
                    });
                    (setor.nome);
                }
                __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.salvarInformacoes) }, { class: "mt-4 px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-500 text-white rounded-lg font-semibold shadow hover:from-teal-700 hover:to-cyan-600 transition" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-xl p-6" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)(__assign({ class: "text-xl font-semibold bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent mb-4" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "space-y-4" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
                __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "block text-slate-200 font-medium mb-2" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign(__assign({ type: "password" }, { class: "w-full px-3 py-2 bg-slate-900 border border-teal-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder:text-slate-400" }), { placeholder: "Nova senha" }));
                (__VLS_ctx.novaSenha);
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
                __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "block text-slate-200 font-medium mb-2" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign(__assign({ type: "password" }, { class: "w-full px-3 py-2 bg-slate-900 border border-teal-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder:text-slate-400" }), { placeholder: "Confirme a nova senha" }));
                (__VLS_ctx.confirmarSenha);
                __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.alterarSenha) }, { class: "mt-4 px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-500 text-white rounded-lg font-semibold shadow hover:from-teal-700 hover:to-cyan-600 transition" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-xl p-6 md:col-span-2" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)(__assign({ class: "text-xl font-semibold bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent mb-4" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "grid grid-cols-1 md:grid-cols-3 gap-4" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "text-center p-4 bg-white/5 rounded-lg shadow" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "text-2xl font-bold text-teal-400" }));
                (__VLS_ctx.estatisticas.totalProcessos);
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "text-slate-300" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "text-center p-4 bg-white/5 rounded-lg shadow" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "text-2xl font-bold text-teal-400" }));
                (__VLS_ctx.estatisticas.processosAtivos);
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "text-slate-300" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "text-center p-4 bg-white/5 rounded-lg shadow" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "text-2xl font-bold text-teal-400" }));
                (__VLS_ctx.estatisticas.processosConcluidos);
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "text-slate-300" }));
                /** @type {__VLS_StyleScopedClasses['min-h-screen']} */ ;
                /** @type {__VLS_StyleScopedClasses['flex']} */ ;
                /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
                /** @type {__VLS_StyleScopedClasses['items-stretch']} */ ;
                /** @type {__VLS_StyleScopedClasses['px-8']} */ ;
                /** @type {__VLS_StyleScopedClasses['py-8']} */ ;
                /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
                /** @type {__VLS_StyleScopedClasses['max-w-5xl']} */ ;
                /** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
                /** @type {__VLS_StyleScopedClasses['text-3xl']} */ ;
                /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
                /** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
                /** @type {__VLS_StyleScopedClasses['from-teal-400']} */ ;
                /** @type {__VLS_StyleScopedClasses['to-cyan-300']} */ ;
                /** @type {__VLS_StyleScopedClasses['bg-clip-text']} */ ;
                /** @type {__VLS_StyleScopedClasses['text-transparent']} */ ;
                /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
                /** @type {__VLS_StyleScopedClasses['text-slate-300']} */ ;
                /** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
                /** @type {__VLS_StyleScopedClasses['grid']} */ ;
                /** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
                /** @type {__VLS_StyleScopedClasses['lg:grid-cols-2']} */ ;
                /** @type {__VLS_StyleScopedClasses['gap-8']} */ ;
                /** @type {__VLS_StyleScopedClasses['bg-white/10']} */ ;
                /** @type {__VLS_StyleScopedClasses['backdrop-blur-md']} */ ;
                /** @type {__VLS_StyleScopedClasses['border']} */ ;
                /** @type {__VLS_StyleScopedClasses['border-white/20']} */ ;
                /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
                /** @type {__VLS_StyleScopedClasses['shadow-xl']} */ ;
                /** @type {__VLS_StyleScopedClasses['p-6']} */ ;
                /** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
                /** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
                /** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
                /** @type {__VLS_StyleScopedClasses['from-teal-400']} */ ;
                /** @type {__VLS_StyleScopedClasses['to-cyan-300']} */ ;
                /** @type {__VLS_StyleScopedClasses['bg-clip-text']} */ ;
                /** @type {__VLS_StyleScopedClasses['text-transparent']} */ ;
                /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
                /** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
                /** @type {__VLS_StyleScopedClasses['block']} */ ;
                /** @type {__VLS_StyleScopedClasses['text-slate-200']} */ ;
                /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
                /** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
                /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
                /** @type {__VLS_StyleScopedClasses['px-3']} */ ;
                /** @type {__VLS_StyleScopedClasses['py-2']} */ ;
                /** @type {__VLS_StyleScopedClasses['bg-slate-900']} */ ;
                /** @type {__VLS_StyleScopedClasses['border']} */ ;
                /** @type {__VLS_StyleScopedClasses['border-teal-400']} */ ;
                /** @type {__VLS_StyleScopedClasses['text-white']} */ ;
                /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
                /** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
                /** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
                /** @type {__VLS_StyleScopedClasses['focus:ring-teal-400']} */ ;
                /** @type {__VLS_StyleScopedClasses['placeholder:text-slate-400']} */ ;
                /** @type {__VLS_StyleScopedClasses['block']} */ ;
                /** @type {__VLS_StyleScopedClasses['text-slate-200']} */ ;
                /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
                /** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
                /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
                /** @type {__VLS_StyleScopedClasses['px-3']} */ ;
                /** @type {__VLS_StyleScopedClasses['py-2']} */ ;
                /** @type {__VLS_StyleScopedClasses['bg-slate-900']} */ ;
                /** @type {__VLS_StyleScopedClasses['border']} */ ;
                /** @type {__VLS_StyleScopedClasses['border-teal-400']} */ ;
                /** @type {__VLS_StyleScopedClasses['text-white']} */ ;
                /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
                /** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
                /** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
                /** @type {__VLS_StyleScopedClasses['focus:ring-teal-400']} */ ;
                /** @type {__VLS_StyleScopedClasses['placeholder:text-slate-400']} */ ;
                /** @type {__VLS_StyleScopedClasses['block']} */ ;
                /** @type {__VLS_StyleScopedClasses['text-slate-200']} */ ;
                /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
                /** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
                /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
                /** @type {__VLS_StyleScopedClasses['px-3']} */ ;
                /** @type {__VLS_StyleScopedClasses['py-2']} */ ;
                /** @type {__VLS_StyleScopedClasses['bg-slate-900']} */ ;
                /** @type {__VLS_StyleScopedClasses['border']} */ ;
                /** @type {__VLS_StyleScopedClasses['border-teal-400']} */ ;
                /** @type {__VLS_StyleScopedClasses['text-white']} */ ;
                /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
                /** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
                /** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
                /** @type {__VLS_StyleScopedClasses['focus:ring-teal-400']} */ ;
                /** @type {__VLS_StyleScopedClasses['placeholder:text-slate-400']} */ ;
                /** @type {__VLS_StyleScopedClasses['block']} */ ;
                /** @type {__VLS_StyleScopedClasses['text-slate-200']} */ ;
                /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
                /** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
                /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
                /** @type {__VLS_StyleScopedClasses['px-3']} */ ;
                /** @type {__VLS_StyleScopedClasses['py-2']} */ ;
                /** @type {__VLS_StyleScopedClasses['bg-slate-900']} */ ;
                /** @type {__VLS_StyleScopedClasses['border']} */ ;
                /** @type {__VLS_StyleScopedClasses['border-teal-400']} */ ;
                /** @type {__VLS_StyleScopedClasses['text-white']} */ ;
                /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
                /** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
                /** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
                /** @type {__VLS_StyleScopedClasses['focus:ring-teal-400']} */ ;
                /** @type {__VLS_StyleScopedClasses['appearance-none']} */ ;
                /** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
                /** @type {__VLS_StyleScopedClasses['px-4']} */ ;
                /** @type {__VLS_StyleScopedClasses['py-2']} */ ;
                /** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
                /** @type {__VLS_StyleScopedClasses['from-teal-600']} */ ;
                /** @type {__VLS_StyleScopedClasses['to-cyan-500']} */ ;
                /** @type {__VLS_StyleScopedClasses['text-white']} */ ;
                /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
                /** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
                /** @type {__VLS_StyleScopedClasses['shadow']} */ ;
                /** @type {__VLS_StyleScopedClasses['hover:from-teal-700']} */ ;
                /** @type {__VLS_StyleScopedClasses['hover:to-cyan-600']} */ ;
                /** @type {__VLS_StyleScopedClasses['transition']} */ ;
                /** @type {__VLS_StyleScopedClasses['bg-white/10']} */ ;
                /** @type {__VLS_StyleScopedClasses['backdrop-blur-md']} */ ;
                /** @type {__VLS_StyleScopedClasses['border']} */ ;
                /** @type {__VLS_StyleScopedClasses['border-white/20']} */ ;
                /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
                /** @type {__VLS_StyleScopedClasses['shadow-xl']} */ ;
                /** @type {__VLS_StyleScopedClasses['p-6']} */ ;
                /** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
                /** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
                /** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
                /** @type {__VLS_StyleScopedClasses['from-teal-400']} */ ;
                /** @type {__VLS_StyleScopedClasses['to-cyan-300']} */ ;
                /** @type {__VLS_StyleScopedClasses['bg-clip-text']} */ ;
                /** @type {__VLS_StyleScopedClasses['text-transparent']} */ ;
                /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
                /** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
                /** @type {__VLS_StyleScopedClasses['block']} */ ;
                /** @type {__VLS_StyleScopedClasses['text-slate-200']} */ ;
                /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
                /** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
                /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
                /** @type {__VLS_StyleScopedClasses['px-3']} */ ;
                /** @type {__VLS_StyleScopedClasses['py-2']} */ ;
                /** @type {__VLS_StyleScopedClasses['bg-slate-900']} */ ;
                /** @type {__VLS_StyleScopedClasses['border']} */ ;
                /** @type {__VLS_StyleScopedClasses['border-teal-400']} */ ;
                /** @type {__VLS_StyleScopedClasses['text-white']} */ ;
                /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
                /** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
                /** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
                /** @type {__VLS_StyleScopedClasses['focus:ring-teal-400']} */ ;
                /** @type {__VLS_StyleScopedClasses['placeholder:text-slate-400']} */ ;
                /** @type {__VLS_StyleScopedClasses['block']} */ ;
                /** @type {__VLS_StyleScopedClasses['text-slate-200']} */ ;
                /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
                /** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
                /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
                /** @type {__VLS_StyleScopedClasses['px-3']} */ ;
                /** @type {__VLS_StyleScopedClasses['py-2']} */ ;
                /** @type {__VLS_StyleScopedClasses['bg-slate-900']} */ ;
                /** @type {__VLS_StyleScopedClasses['border']} */ ;
                /** @type {__VLS_StyleScopedClasses['border-teal-400']} */ ;
                /** @type {__VLS_StyleScopedClasses['text-white']} */ ;
                /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
                /** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
                /** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
                /** @type {__VLS_StyleScopedClasses['focus:ring-teal-400']} */ ;
                /** @type {__VLS_StyleScopedClasses['placeholder:text-slate-400']} */ ;
                /** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
                /** @type {__VLS_StyleScopedClasses['px-4']} */ ;
                /** @type {__VLS_StyleScopedClasses['py-2']} */ ;
                /** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
                /** @type {__VLS_StyleScopedClasses['from-teal-600']} */ ;
                /** @type {__VLS_StyleScopedClasses['to-cyan-500']} */ ;
                /** @type {__VLS_StyleScopedClasses['text-white']} */ ;
                /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
                /** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
                /** @type {__VLS_StyleScopedClasses['shadow']} */ ;
                /** @type {__VLS_StyleScopedClasses['hover:from-teal-700']} */ ;
                /** @type {__VLS_StyleScopedClasses['hover:to-cyan-600']} */ ;
                /** @type {__VLS_StyleScopedClasses['transition']} */ ;
                /** @type {__VLS_StyleScopedClasses['bg-white/10']} */ ;
                /** @type {__VLS_StyleScopedClasses['backdrop-blur-md']} */ ;
                /** @type {__VLS_StyleScopedClasses['border']} */ ;
                /** @type {__VLS_StyleScopedClasses['border-white/20']} */ ;
                /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
                /** @type {__VLS_StyleScopedClasses['shadow-xl']} */ ;
                /** @type {__VLS_StyleScopedClasses['p-6']} */ ;
                /** @type {__VLS_StyleScopedClasses['md:col-span-2']} */ ;
                /** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
                /** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
                /** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
                /** @type {__VLS_StyleScopedClasses['from-teal-400']} */ ;
                /** @type {__VLS_StyleScopedClasses['to-cyan-300']} */ ;
                /** @type {__VLS_StyleScopedClasses['bg-clip-text']} */ ;
                /** @type {__VLS_StyleScopedClasses['text-transparent']} */ ;
                /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
                /** @type {__VLS_StyleScopedClasses['grid']} */ ;
                /** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
                /** @type {__VLS_StyleScopedClasses['md:grid-cols-3']} */ ;
                /** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
                /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
                /** @type {__VLS_StyleScopedClasses['p-4']} */ ;
                /** @type {__VLS_StyleScopedClasses['bg-white/5']} */ ;
                /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
                /** @type {__VLS_StyleScopedClasses['shadow']} */ ;
                /** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
                /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
                /** @type {__VLS_StyleScopedClasses['text-teal-400']} */ ;
                /** @type {__VLS_StyleScopedClasses['text-slate-300']} */ ;
                /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
                /** @type {__VLS_StyleScopedClasses['p-4']} */ ;
                /** @type {__VLS_StyleScopedClasses['bg-white/5']} */ ;
                /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
                /** @type {__VLS_StyleScopedClasses['shadow']} */ ;
                /** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
                /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
                /** @type {__VLS_StyleScopedClasses['text-teal-400']} */ ;
                /** @type {__VLS_StyleScopedClasses['text-slate-300']} */ ;
                /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
                /** @type {__VLS_StyleScopedClasses['p-4']} */ ;
                /** @type {__VLS_StyleScopedClasses['bg-white/5']} */ ;
                /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
                /** @type {__VLS_StyleScopedClasses['shadow']} */ ;
                /** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
                /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
                /** @type {__VLS_StyleScopedClasses['text-teal-400']} */ ;
                /** @type {__VLS_StyleScopedClasses['text-slate-300']} */ ;
                return [4 /*yield*/, import('vue')];
            case 1:
                __VLS_self = (_b.sent()).defineComponent({
                    setup: function () {
                        return {
                            Layout: Layout,
                            userInfo: userInfo,
                            setores: setores,
                            novaSenha: novaSenha,
                            confirmarSenha: confirmarSenha,
                            estatisticas: estatisticas,
                            salvarInformacoes: salvarInformacoes,
                            alterarSenha: alterarSenha,
                        };
                    },
                    name: 'MinhaContaView',
                });
                return [4 /*yield*/, import('vue')];
            case 2: return [2 /*return*/, (_b.sent()).defineComponent({
                    setup: function () {
                        return {};
                    },
                    name: 'MinhaContaView',
                })];
        }
    });
}); })(); /* PartiallyEnd: #4569/main.vue */
