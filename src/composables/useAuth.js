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
import { ref, watch } from 'vue';
import { login as loginService, criarConta as criarContaService, logout as logoutService, obterUsuario, } from '../services/auth';
// ✨ Importe o cliente Supabase aqui
import { supabase } from '@/services/supabase';
var user = ref(null);
var loading = ref(true);
var error = ref(null);
var isAdmin = ref(false); // Variável reativa para o status de admin
// ✨ FUNÇÃO CENTRALIZADA: Verifica a role do perfil
function checkAdminStatus(currentUser) {
    return __awaiter(this, void 0, void 0, function () {
        var profile, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!currentUser) {
                        isAdmin.value = false;
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, supabase
                            .from('profiles')
                            .select('role')
                            .eq('id', currentUser.id)
                            .single()];
                case 2:
                    profile = (_a.sent()).data;
                    isAdmin.value = (profile === null || profile === void 0 ? void 0 : profile.role) === 'Admin';
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    console.error('Erro ao verificar status de admin:', err_1);
                    isAdmin.value = false;
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
export function useAuth() {
    var _this = this;
    function login(email, password) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, u, err;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        loading.value = true;
                        error.value = null;
                        return [4 /*yield*/, loginService(email, password)];
                    case 1:
                        _a = _b.sent(), u = _a.user, err = _a.error;
                        user.value = u;
                        error.value = (err === null || err === void 0 ? void 0 : err.message) || null;
                        loading.value = false;
                        return [2 /*return*/, { user: u, error: err }];
                }
            });
        });
    }
    function criarConta(email, password, nome) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, u, err;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        loading.value = true;
                        error.value = null;
                        return [4 /*yield*/, criarContaService(email, password, nome)];
                    case 1:
                        _a = _b.sent(), u = _a.user, err = _a.error;
                        user.value = u;
                        error.value = (err === null || err === void 0 ? void 0 : err.message) || null;
                        loading.value = false;
                        return [2 /*return*/, { user: u, error: err }];
                }
            });
        });
    }
    function logout() {
        return __awaiter(this, void 0, void 0, function () {
            var err;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loading.value = true;
                        error.value = null;
                        return [4 /*yield*/, logoutService()];
                    case 1:
                        err = (_a.sent()).error;
                        user.value = null;
                        error.value = (err === null || err === void 0 ? void 0 : err.message) || null;
                        loading.value = false;
                        return [2 /*return*/, { error: err }];
                }
            });
        });
    }
    function fetchUser() {
        return __awaiter(this, void 0, void 0, function () {
            var fetchedUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loading.value = true;
                        error.value = null;
                        return [4 /*yield*/, obterUsuario()];
                    case 1:
                        fetchedUser = _a.sent();
                        user.value = fetchedUser;
                        loading.value = false;
                        return [2 /*return*/, user.value];
                }
            });
        });
    }
    // Watcher que observa mudanças na variável 'user'
    // Este é o único ponto onde a role é verificada
    watch(user, function (novoUser) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading.value = true;
                    return [4 /*yield*/, checkAdminStatus(novoUser)];
                case 1:
                    _a.sent();
                    loading.value = false;
                    return [2 /*return*/];
            }
        });
    }); }, { immediate: true });
    return {
        user: user,
        loading: loading,
        error: error,
        login: login,
        criarConta: criarConta,
        logout: logout,
        fetchUser: fetchUser,
        isAdmin: isAdmin,
    };
}
