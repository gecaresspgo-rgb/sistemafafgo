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
import { watch, ref } from 'vue';
import { useAuth } from '../composables/useAuth';
import { useRouter } from 'vue-router';
import { supabase } from '../services/supabase';
export default await (function () { return __awaiter(void 0, void 0, void 0, function () {
    function fetchProfileRole() {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!user.value) {
                            isAdmin.value = false;
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, supabase.from('profiles').select('role').eq('id', user.value.id).single()];
                    case 1:
                        data = (_a.sent()).data;
                        isAdmin.value = (data === null || data === void 0 ? void 0 : data.role) === 'Admin';
                        return [2 /*return*/];
                }
            });
        });
    }
    function handleLogout() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, logout()];
                    case 1:
                        _a.sent();
                        router.push('/login');
                        return [2 /*return*/];
                }
            });
        });
    }
    var _a, user, logout, router, isAdmin, __VLS_ctx, __VLS_components, __VLS_directives, __VLS_0, __VLS_1, __VLS_2, __VLS_3, __VLS_4, __VLS_5, __VLS_6, __VLS_7, __VLS_8, __VLS_9, __VLS_10, __VLS_11, __VLS_12, __VLS_13, __VLS_14, __VLS_15, __VLS_16, __VLS_17, __VLS_18, __VLS_19, __VLS_20, __VLS_21, __VLS_22, __VLS_23, __VLS_24, __VLS_25, __VLS_26, __VLS_27, __VLS_dollars, __VLS_self;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = useAuth(), user = _a.user, logout = _a.logout;
                router = useRouter();
                isAdmin = ref(false);
                watch(user, function () {
                    fetchProfileRole();
                }, { immediate: true });
                debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
                __VLS_ctx = {};
                __VLS_asFunctionalElement(__VLS_intrinsicElements.nav, __VLS_intrinsicElements.nav)(__assign({ class: "flex flex-col h-screen w-64 bg-abyss-dark p-6 shadow-lg" }));
                __VLS_0 = {}.RouterLink;
                /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
                __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0(__assign(__assign({ to: "/" }, { class: "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 mb-2" }), { class: (__VLS_ctx.$route.path === '/' ? 'bg-gradient-to-r from-teal-600 to-cyan-500 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-700/50 hover:text-teal-400') })));
                __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign(__assign({ to: "/" }, { class: "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 mb-2" }), { class: (__VLS_ctx.$route.path === '/' ? 'bg-gradient-to-r from-teal-600 to-cyan-500 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-700/50 hover:text-teal-400') })], __VLS_functionalComponentArgsRest(__VLS_1), false));
                __VLS_3.slots.default;
                __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign({ class: "w-5 h-5" }, { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
                    d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "font-medium" }));
                __VLS_4 = {}.RouterLink;
                /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
                __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4(__assign(__assign({ to: "/analises" }, { class: "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 mb-2" }), { class: (__VLS_ctx.$route.path === '/analises' ? 'bg-gradient-to-r from-teal-600 to-cyan-500 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-700/50 hover:text-teal-400') })));
                __VLS_6 = __VLS_5.apply(void 0, __spreadArray([__assign(__assign({ to: "/analises" }, { class: "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 mb-2" }), { class: (__VLS_ctx.$route.path === '/analises' ? 'bg-gradient-to-r from-teal-600 to-cyan-500 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-700/50 hover:text-teal-400') })], __VLS_functionalComponentArgsRest(__VLS_5), false));
                __VLS_7.slots.default;
                __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign({ class: "w-5 h-5" }, { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
                    d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "font-medium" }));
                __VLS_8 = {}.RouterLink;
                /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
                __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8(__assign(__assign({ to: "/minha-conta" }, { class: "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 mb-2" }), { class: (__VLS_ctx.$route.path === '/minha-conta' ? 'bg-gradient-to-r from-teal-600 to-cyan-500 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-700/50 hover:text-teal-400') })));
                __VLS_10 = __VLS_9.apply(void 0, __spreadArray([__assign(__assign({ to: "/minha-conta" }, { class: "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 mb-2" }), { class: (__VLS_ctx.$route.path === '/minha-conta' ? 'bg-gradient-to-r from-teal-600 to-cyan-500 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-700/50 hover:text-teal-400') })], __VLS_functionalComponentArgsRest(__VLS_9), false));
                __VLS_11.slots.default;
                __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign({ class: "w-5 h-5" }, { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
                    d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "font-medium" }));
                __VLS_12 = {}.RouterLink;
                /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
                __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12(__assign(__assign({ to: "/acompanhamento-especial" }, { class: "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 mb-2" }), { class: (__VLS_ctx.$route.path === '/acompanhamento-especial' ? 'bg-gradient-to-r from-teal-600 to-cyan-500 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-700/50 hover:text-teal-400') })));
                __VLS_14 = __VLS_13.apply(void 0, __spreadArray([__assign(__assign({ to: "/acompanhamento-especial" }, { class: "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 mb-2" }), { class: (__VLS_ctx.$route.path === '/acompanhamento-especial' ? 'bg-gradient-to-r from-teal-600 to-cyan-500 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-700/50 hover:text-teal-400') })], __VLS_functionalComponentArgsRest(__VLS_13), false));
                __VLS_15.slots.default;
                __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign({ class: "w-5 h-5" }, { fill: "none", stroke: "currentColor", 'stroke-width': "2", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
                    'stroke-linecap': "round",
                    'stroke-linejoin': "round",
                    d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z",
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
                    'stroke-linecap': "round",
                    'stroke-linejoin': "round",
                    d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "font-medium" }));
                __VLS_16 = {}.RouterLink;
                /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
                __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16(__assign(__assign({ to: "/controle-acoes" }, { class: "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 mb-2" }), { class: (__VLS_ctx.$route.path === '/controle-acoes' ? 'bg-gradient-to-r from-teal-600 to-cyan-500 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-700/50 hover:text-teal-400') })));
                __VLS_18 = __VLS_17.apply(void 0, __spreadArray([__assign(__assign({ to: "/controle-acoes" }, { class: "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 mb-2" }), { class: (__VLS_ctx.$route.path === '/controle-acoes' ? 'bg-gradient-to-r from-teal-600 to-cyan-500 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-700/50 hover:text-teal-400') })], __VLS_functionalComponentArgsRest(__VLS_17), false));
                __VLS_19.slots.default;
                __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign({ class: "w-5 h-5" }, { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
                    'stroke-linecap': "round",
                    'stroke-linejoin': "round",
                    'stroke-width': "2",
                    d: "M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "font-medium" }));
                if (__VLS_ctx.isAdmin) {
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "mb-2" }));
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "text-slate-400 text-xs uppercase font-semibold mb-2 px-4" }));
                    __VLS_20 = {}.RouterLink;
                    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
                    __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20(__assign(__assign({ to: "/admin" }, { class: "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 mb-2" }), { class: (__VLS_ctx.$route.path === '/admin' ? 'bg-gradient-to-r from-amber-600 to-yellow-500 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-700/50 hover:text-amber-400') })));
                    __VLS_22 = __VLS_21.apply(void 0, __spreadArray([__assign(__assign({ to: "/admin" }, { class: "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 mb-2" }), { class: (__VLS_ctx.$route.path === '/admin' ? 'bg-gradient-to-r from-amber-600 to-yellow-500 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-700/50 hover:text-amber-400') })], __VLS_functionalComponentArgsRest(__VLS_21), false));
                    __VLS_23.slots.default;
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign({ class: "w-5 h-5" }, { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }));
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
                        'stroke-linecap': "round",
                        'stroke-linejoin': "round",
                        'stroke-width': "2",
                        d: "M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 10c-4.418 0-8-1.79-8-4V6a2 2 0 012-2h12a2 2 0 012 2v8c0 2.21-3.582 4-8 4z",
                    });
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "font-medium" }));
                    __VLS_24 = {}.RouterLink;
                    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
                    __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24(__assign(__assign({ to: "/admin/usuarios" }, { class: "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 mb-2" }), { class: (__VLS_ctx.$route.path === '/admin/usuarios' ? 'bg-gradient-to-r from-amber-600 to-yellow-500 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-700/50 hover:text-amber-400') })));
                    __VLS_26 = __VLS_25.apply(void 0, __spreadArray([__assign(__assign({ to: "/admin/usuarios" }, { class: "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 mb-2" }), { class: (__VLS_ctx.$route.path === '/admin/usuarios' ? 'bg-gradient-to-r from-amber-600 to-yellow-500 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-700/50 hover:text-amber-400') })], __VLS_functionalComponentArgsRest(__VLS_25), false));
                    __VLS_27.slots.default;
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign({ class: "w-5 h-5" }, { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }));
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
                        'stroke-linecap': "round",
                        'stroke-linejoin': "round",
                        'stroke-width': "2",
                        d: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
                    });
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "font-medium" }));
                }
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex-1" }));
                if (__VLS_ctx.user) {
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "text-abyss-primary font-semibold mb-4 block" }));
                    (((_b = __VLS_ctx.user.user_metadata) === null || _b === void 0 ? void 0 : _b.name) || __VLS_ctx.user.email);
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.handleLogout) }, { class: "px-3 py-1 bg-abyss-primary text-white rounded shadow hover:bg-abyss-secondary transition" }));
                }
                /** @type {__VLS_StyleScopedClasses['flex']} */ ;
                /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
                /** @type {__VLS_StyleScopedClasses['h-screen']} */ ;
                /** @type {__VLS_StyleScopedClasses['w-64']} */ ;
                /** @type {__VLS_StyleScopedClasses['bg-abyss-dark']} */ ;
                /** @type {__VLS_StyleScopedClasses['p-6']} */ ;
                /** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
                /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
                /** @type {__VLS_StyleScopedClasses['flex']} */ ;
                /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
                /** @type {__VLS_StyleScopedClasses['space-x-3']} */ ;
                /** @type {__VLS_StyleScopedClasses['px-4']} */ ;
                /** @type {__VLS_StyleScopedClasses['py-3']} */ ;
                /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
                /** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
                /** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
                /** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
                /** @type {__VLS_StyleScopedClasses['w-5']} */ ;
                /** @type {__VLS_StyleScopedClasses['h-5']} */ ;
                /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
                /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
                /** @type {__VLS_StyleScopedClasses['flex']} */ ;
                /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
                /** @type {__VLS_StyleScopedClasses['space-x-3']} */ ;
                /** @type {__VLS_StyleScopedClasses['px-4']} */ ;
                /** @type {__VLS_StyleScopedClasses['py-3']} */ ;
                /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
                /** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
                /** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
                /** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
                /** @type {__VLS_StyleScopedClasses['w-5']} */ ;
                /** @type {__VLS_StyleScopedClasses['h-5']} */ ;
                /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
                /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
                /** @type {__VLS_StyleScopedClasses['flex']} */ ;
                /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
                /** @type {__VLS_StyleScopedClasses['space-x-3']} */ ;
                /** @type {__VLS_StyleScopedClasses['px-4']} */ ;
                /** @type {__VLS_StyleScopedClasses['py-3']} */ ;
                /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
                /** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
                /** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
                /** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
                /** @type {__VLS_StyleScopedClasses['w-5']} */ ;
                /** @type {__VLS_StyleScopedClasses['h-5']} */ ;
                /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
                /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
                /** @type {__VLS_StyleScopedClasses['flex']} */ ;
                /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
                /** @type {__VLS_StyleScopedClasses['space-x-3']} */ ;
                /** @type {__VLS_StyleScopedClasses['px-4']} */ ;
                /** @type {__VLS_StyleScopedClasses['py-3']} */ ;
                /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
                /** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
                /** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
                /** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
                /** @type {__VLS_StyleScopedClasses['w-5']} */ ;
                /** @type {__VLS_StyleScopedClasses['h-5']} */ ;
                /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
                /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
                /** @type {__VLS_StyleScopedClasses['flex']} */ ;
                /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
                /** @type {__VLS_StyleScopedClasses['space-x-3']} */ ;
                /** @type {__VLS_StyleScopedClasses['px-4']} */ ;
                /** @type {__VLS_StyleScopedClasses['py-3']} */ ;
                /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
                /** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
                /** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
                /** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
                /** @type {__VLS_StyleScopedClasses['w-5']} */ ;
                /** @type {__VLS_StyleScopedClasses['h-5']} */ ;
                /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
                /** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
                /** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
                /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
                /** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
                /** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
                /** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
                /** @type {__VLS_StyleScopedClasses['px-4']} */ ;
                /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
                /** @type {__VLS_StyleScopedClasses['flex']} */ ;
                /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
                /** @type {__VLS_StyleScopedClasses['space-x-3']} */ ;
                /** @type {__VLS_StyleScopedClasses['px-4']} */ ;
                /** @type {__VLS_StyleScopedClasses['py-3']} */ ;
                /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
                /** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
                /** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
                /** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
                /** @type {__VLS_StyleScopedClasses['w-5']} */ ;
                /** @type {__VLS_StyleScopedClasses['h-5']} */ ;
                /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
                /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
                /** @type {__VLS_StyleScopedClasses['flex']} */ ;
                /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
                /** @type {__VLS_StyleScopedClasses['space-x-3']} */ ;
                /** @type {__VLS_StyleScopedClasses['px-4']} */ ;
                /** @type {__VLS_StyleScopedClasses['py-3']} */ ;
                /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
                /** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
                /** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
                /** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
                /** @type {__VLS_StyleScopedClasses['w-5']} */ ;
                /** @type {__VLS_StyleScopedClasses['h-5']} */ ;
                /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
                /** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
                /** @type {__VLS_StyleScopedClasses['text-abyss-primary']} */ ;
                /** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
                /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
                /** @type {__VLS_StyleScopedClasses['block']} */ ;
                /** @type {__VLS_StyleScopedClasses['px-3']} */ ;
                /** @type {__VLS_StyleScopedClasses['py-1']} */ ;
                /** @type {__VLS_StyleScopedClasses['bg-abyss-primary']} */ ;
                /** @type {__VLS_StyleScopedClasses['text-white']} */ ;
                /** @type {__VLS_StyleScopedClasses['rounded']} */ ;
                /** @type {__VLS_StyleScopedClasses['shadow']} */ ;
                /** @type {__VLS_StyleScopedClasses['hover:bg-abyss-secondary']} */ ;
                /** @type {__VLS_StyleScopedClasses['transition']} */ ;
                return [4 /*yield*/, import('vue')];
            case 1:
                __VLS_self = (_c.sent()).defineComponent({
                    setup: function () {
                        return {
                            user: user,
                            isAdmin: isAdmin,
                            handleLogout: handleLogout,
                        };
                    },
                    name: 'AppMenu',
                });
                return [4 /*yield*/, import('vue')];
            case 2: return [2 /*return*/, (_c.sent()).defineComponent({
                    setup: function () {
                        return {};
                    },
                    name: 'AppMenu',
                })];
        }
    });
}); })(); /* PartiallyEnd: #4569/main.vue */
