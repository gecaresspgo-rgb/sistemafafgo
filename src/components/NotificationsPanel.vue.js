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
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../services/supabase';
import { useAuth } from '../composables/useAuth';
var router = useRouter();
var soundEnabled = ref(true);
var notifications = ref([]);
var showPanel = ref(false);
var _a = useAuth(), user = _a.user, fetchUser = _a.fetchUser;
var markLoading = ref(false);
var lastViewed = ref(null);
var unreadCount = computed(function () {
    if (!lastViewed.value) {
        return notifications.value.filter(function (n) { return !n.is_read; }).length;
    }
    var lastViewedDate = new Date(lastViewed.value);
    return notifications.value.filter(function (n) { return new Date(n.created_at) > lastViewedDate; }).length;
});
function toggleSound() {
    soundEnabled.value = !soundEnabled.value;
}
watch(soundEnabled, function (newValue) {
    localStorage.setItem('notification_sound_enabled', JSON.stringify(newValue));
});
function formatarData(data) {
    if (!data)
        return '';
    return new Date(data).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}
// ✅ FUNÇÃO CORRIGIDA
function markAllAsRead() {
    return __awaiter(this, void 0, void 0, function () {
        var unreadIds, _a, data, error, count;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (markLoading.value)
                        return [2 /*return*/];
                    unreadIds = notifications.value.filter(function (n) { return !n.is_read; }).map(function (n) { return n.id; });
                    if (unreadIds.length === 0) {
                        return [2 /*return*/];
                    }
                    markLoading.value = true;
                    return [4 /*yield*/, supabase
                            .from('notifications')
                            .update({ is_read: true })
                            .in('id', unreadIds)
                            .select()];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    count = data ? data.length : 0;
                    if (error) {
                        console.error('Erro ao marcar notificações como lidas:', error.message);
                    }
                    else if (count === unreadIds.length) {
                        notifications.value = notifications.value.map(function (n) {
                            return unreadIds.includes(n.id) ? __assign(__assign({}, n), { is_read: true }) : n;
                        });
                    }
                    else {
                        console.warn("Tentativa de atualizar ".concat(unreadIds.length, " notifica\u00E7\u00F5es, mas apenas ").concat(count, " foram alteradas. Verifique as pol\u00EDticas RLS."));
                    }
                    markLoading.value = false;
                    return [2 /*return*/];
            }
        });
    });
}
function updateLastViewedTimestamp() {
    return __awaiter(this, void 0, void 0, function () {
        var usuario, now, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    usuario = user.value;
                    if (!usuario)
                        return [2 /*return*/];
                    now = new Date().toISOString();
                    return [4 /*yield*/, supabase
                            .from('profiles')
                            .update({ last_notification_view_at: now })
                            .eq('id', usuario.id)];
                case 1:
                    error = (_a.sent()).error;
                    if (!error) {
                        lastViewed.value = now;
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function togglePanel() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    showPanel.value = !showPanel.value;
                    if (!showPanel.value) return [3 /*break*/, 3];
                    return [4 /*yield*/, updateLastViewedTimestamp()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, markAllAsRead()];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function initializePanel() {
    return __awaiter(this, void 0, void 0, function () {
        var usuario, _a, notificationsResponse, profileResponse;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    usuario = user.value;
                    if (!!usuario) return [3 /*break*/, 2];
                    return [4 /*yield*/, fetchUser()];
                case 1:
                    usuario = _b.sent();
                    _b.label = 2;
                case 2:
                    if (!usuario)
                        return [2 /*return*/];
                    return [4 /*yield*/, Promise.all([
                            supabase
                                .from('notifications')
                                .select('*')
                                .eq('user_id', usuario.id)
                                .order('created_at', { ascending: false }),
                            supabase
                                .from('profiles')
                                .select('last_notification_view_at')
                                .eq('id', usuario.id)
                                .single()
                        ])];
                case 3:
                    _a = _b.sent(), notificationsResponse = _a[0], profileResponse = _a[1];
                    if (notificationsResponse.data) {
                        notifications.value = notificationsResponse.data;
                    }
                    if (profileResponse.data) {
                        lastViewed.value = profileResponse.data.last_notification_view_at;
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function handleNotificationClick(notification) {
    return __awaiter(this, void 0, void 0, function () {
        var index, modalType;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!notification.process_id) return [3 /*break*/, 3];
                    if (!!notification.is_read) return [3 /*break*/, 2];
                    return [4 /*yield*/, supabase.from('notifications').update({ is_read: true }).eq('id', notification.id)];
                case 1:
                    _a.sent();
                    index = notifications.value.findIndex(function (n) { return n.id === notification.id; });
                    if (index !== -1) {
                        notifications.value[index].is_read = true;
                    }
                    _a.label = 2;
                case 2:
                    showPanel.value = false;
                    modalType = 'etapas';
                    // Se a notificação for do tipo 'overspending', muda para 'registros'
                    if (notification.type === 'overspending') {
                        modalType = 'registros';
                    }
                    // Usa a variável para construir a URL final
                    router.push("/processos?processo_id=".concat(notification.process_id, "&modal_type=").concat(modalType));
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
var channel = null;
onMounted(function () { return __awaiter(void 0, void 0, void 0, function () {
    var savedPreference, usuario;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                savedPreference = localStorage.getItem('notification_sound_enabled');
                if (savedPreference !== null) {
                    soundEnabled.value = JSON.parse(savedPreference);
                }
                return [4 /*yield*/, initializePanel()];
            case 1:
                _a.sent();
                usuario = user.value;
                if (!usuario)
                    return [2 /*return*/];
                channel = supabase.channel('notifications_' + usuario.id)
                    .on('postgres_changes', {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: "user_id=eq.".concat(usuario.id)
                }, function (payload) {
                    if (payload.new) {
                        notifications.value.unshift(payload.new);
                        if (soundEnabled.value) {
                            var audio = new Audio('/notification.wav');
                            audio.play().catch(function (error) {
                                console.warn('Erro ao reproduzir som de notificação:', error);
                            });
                        }
                    }
                })
                    .subscribe();
                return [2 /*return*/];
        }
    });
}); });
onUnmounted(function () {
    if (channel) {
        channel.unsubscribe();
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = {};
var __VLS_components;
var __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "relative inline-block text-left" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.togglePanel) }, { class: "relative focus:outline-none" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign({ class: "w-7 h-7 text-slate-300 hover:text-teal-400 transition" }, { fill: "none", stroke: "currentColor", 'stroke-width': "2", viewBox: "0 0 24 24" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
    'stroke-linecap': "round",
    'stroke-linejoin': "round",
    d: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
});
if (__VLS_ctx.unreadCount > 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 border-2 border-slate-900 animate-pulse" }));
    (__VLS_ctx.unreadCount);
}
if (__VLS_ctx.showPanel) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "origin-top-right absolute right-0 mt-2 w-80 rounded-lg shadow-lg bg-slate-900/95 ring-1 ring-black/10 z-50" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "p-4 border-b border-white/10 flex items-center justify-between" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex items-center gap-2" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "font-bold text-teal-400 text-lg" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.toggleSound) }, { title: (__VLS_ctx.soundEnabled ? 'Desativar som' : 'Ativar som') }));
    if (__VLS_ctx.soundEnabled) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign({ class: "w-5 h-5 text-teal-400 hover:text-teal-200" }, { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
            'stroke-linecap': "round",
            'stroke-linejoin': "round",
            'stroke-width': "2",
            d: "M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.858 5.858a3 3 0 014.243 0l2.828 2.829a3 3 0 010 4.242L5.858 20.97a1 1 0 01-1.414 0l-4.243-4.243a1 1 0 010-1.414l15.556-15.556z",
        });
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign({ class: "w-5 h-5 text-slate-500 hover:text-white" }, { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
            'stroke-linecap': "round",
            'stroke-linejoin': "round",
            'stroke-width': "2",
            d: "M5.586 15.142A2 2 0 014.172 14H2a1 1 0 01-1-1v-4a1 1 0 011-1h2.172a2 2 0 011.414.586l4.293 4.293a1 1 0 010 1.414l-4.293 4.293zM10 15V9m6 10l-6-6m0-4l6-6",
        });
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: (__VLS_ctx.markAllAsRead) }, { disabled: (__VLS_ctx.markLoading) }), { class: "text-xs text-teal-400 hover:underline disabled:opacity-50" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "max-h-96 overflow-y-auto divide-y divide-white/10" }));
    if (__VLS_ctx.notifications.length === 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "p-6 text-center text-slate-400" }));
    }
    var _loop_1 = function (n) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!(__VLS_ctx.showPanel))
                    return;
                __VLS_ctx.handleNotificationClick(n);
            } }, { key: (n.id) }), { class: (['p-4 flex flex-col gap-1 hover:bg-teal-500/10 transition cursor-pointer', { 'bg-white/5': !n.is_read }]) }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: (['text-sm', n.is_read ? 'text-slate-400' : 'text-white font-semibold']) }));
        (n.message);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "text-xs text-slate-500" }));
        (__VLS_ctx.formatarData(n.created_at));
    };
    for (var _i = 0, _b = __VLS_getVForSourceType((__VLS_ctx.notifications)); _i < _b.length; _i++) {
        var n = _b[_i][0];
        _loop_1(n);
    }
}
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-left']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['w-7']} */ ;
/** @type {__VLS_StyleScopedClasses['h-7']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-300']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['-top-1']} */ ;
/** @type {__VLS_StyleScopedClasses['-right-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-red-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['px-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['py-0.5']} */ ;
/** @type {__VLS_StyleScopedClasses['border-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-900']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-pulse']} */ ;
/** @type {__VLS_StyleScopedClasses['origin-top-right']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['right-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-80']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-900/95']} */ ;
/** @type {__VLS_StyleScopedClasses['ring-1']} */ ;
/** @type {__VLS_StyleScopedClasses['ring-black/10']} */ ;
/** @type {__VLS_StyleScopedClasses['z-50']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-teal-200']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-500']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:underline']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:opacity-50']} */ ;
/** @type {__VLS_StyleScopedClasses['max-h-96']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-y-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['divide-y']} */ ;
/** @type {__VLS_StyleScopedClasses['divide-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-teal-500/10']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-500']} */ ;
var __VLS_dollars;
var __VLS_self = (await import('vue')).defineComponent({
    setup: function () {
        return {
            soundEnabled: soundEnabled,
            notifications: notifications,
            showPanel: showPanel,
            markLoading: markLoading,
            unreadCount: unreadCount,
            toggleSound: toggleSound,
            formatarData: formatarData,
            markAllAsRead: markAllAsRead,
            togglePanel: togglePanel,
            handleNotificationClick: handleNotificationClick,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup: function () {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
