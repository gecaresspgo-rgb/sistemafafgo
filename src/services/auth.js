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
import { supabase } from './supabase';
export function login(email, password) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, supabase.auth.signInWithPassword({ email: email, password: password })];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    return [2 /*return*/, { user: data === null || data === void 0 ? void 0 : data.user, session: data === null || data === void 0 ? void 0 : data.session, error: error }];
            }
        });
    });
}
export function criarConta(email, password, nome) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, supabase.auth.signUp({
                        email: email,
                        password: password,
                        options: {
                            data: nome ? { name: nome } : undefined,
                        },
                    })];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    return [2 /*return*/, { user: data === null || data === void 0 ? void 0 : data.user, session: data === null || data === void 0 ? void 0 : data.session, error: error }];
            }
        });
    });
}
export function logout() {
    return __awaiter(this, void 0, void 0, function () {
        var error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, supabase.auth.signOut()];
                case 1:
                    error = (_a.sent()).error;
                    return [2 /*return*/, { error: error }];
            }
        });
    });
}
export function obterUsuario() {
    return __awaiter(this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, supabase.auth.getUser()];
                case 1:
                    data = (_a.sent()).data;
                    return [2 /*return*/, data === null || data === void 0 ? void 0 : data.user];
            }
        });
    });
}
// Buscar etapas de um processo
export function buscarEtapasDoProcesso(processId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, supabase
                        .from('process_steps')
                        .select('*, step_templates(name), step_checklist_items(*)') // <--- MUDANÇA AQUI
                        .eq('process_id', processId)
                        .order('step_order', { ascending: true })
                        .order('created_at', { referencedTable: 'step_checklist_items', ascending: true })];
                case 1: 
                // A consulta agora busca as etapas e, para cada uma, seus itens de checklist associados
                return [2 /*return*/, _a.sent()]; // Ordena os itens do checklist
            }
        });
    });
}
// Avançar etapa do processo
export function avancarEtapa(processId, idxAtual, totalEtapas) {
    return __awaiter(this, void 0, void 0, function () {
        var etapas, etapaAtual, errorAtual, proximaEtapa, errorProx, errorUltima, errorProc;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, supabase
                        .from('process_steps')
                        .select('*')
                        .eq('process_id', processId)
                        .order('step_order', { ascending: true })];
                case 1:
                    etapas = (_a.sent()).data;
                    if (!etapas || etapas.length === 0)
                        return [2 /*return*/, { error: { message: 'Nenhuma etapa encontrada' } }];
                    etapaAtual = etapas[idxAtual];
                    if (!etapaAtual)
                        return [2 /*return*/, { error: { message: 'Etapa atual não encontrada' } }];
                    if (!(idxAtual + 1 < totalEtapas)) return [3 /*break*/, 4];
                    return [4 /*yield*/, supabase
                            .from('process_steps')
                            .update({ ended_at: new Date().toISOString(), is_current: false })
                            .eq('id', etapaAtual.id)
                        // Marca a próxima etapa como atual e define started_at
                    ];
                case 2:
                    errorAtual = (_a.sent()).error;
                    proximaEtapa = etapas[idxAtual + 1];
                    return [4 /*yield*/, supabase
                            .from('process_steps')
                            .update({ started_at: new Date().toISOString(), is_current: true })
                            .eq('id', proximaEtapa.id)];
                case 3:
                    errorProx = (_a.sent()).error;
                    return [2 /*return*/, { error: errorAtual || errorProx }];
                case 4: return [4 /*yield*/, supabase
                        .from('process_steps')
                        .update({ ended_at: new Date().toISOString(), is_current: false })
                        .eq('id', etapaAtual.id)];
                case 5:
                    errorUltima = (_a.sent()).error;
                    return [4 /*yield*/, supabase
                            .from('processes')
                            .update({ status: 'Concluído' })
                            .eq('id', processId)];
                case 6:
                    errorProc = (_a.sent()).error;
                    return [2 /*return*/, { error: errorUltima || errorProc }];
            }
        });
    });
}
// Buscar forças responsáveis
export function buscarForcasResponsaveis() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, supabase
                        .from('responsible_forces')
                        .select('id, code, name')
                        .order('name', { ascending: true })];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    return [2 /*return*/, { data: data, error: error }];
            }
        });
    });
}
// Buscar áreas temáticas
export function buscarAreasTematicas() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, supabase
                        .from('thematic_areas')
                        .select('id, code, name')
                        .order('name', { ascending: true })];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    return [2 /*return*/, { data: data, error: error }];
            }
        });
    });
}
// Registrar evento no histórico do processo
export function registrarEventoHistorico(processId, description) {
    return __awaiter(this, void 0, void 0, function () {
        var user, _a, data, error;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, supabase.auth.getUser()];
                case 1:
                    user = (_c.sent()).data;
                    return [4 /*yield*/, supabase
                            .from('process_history')
                            .insert([
                            {
                                process_id: processId,
                                user_id: (_b = user === null || user === void 0 ? void 0 : user.user) === null || _b === void 0 ? void 0 : _b.id,
                                description: description,
                            },
                        ])
                            .select()];
                case 2:
                    _a = _c.sent(), data = _a.data, error = _a.error;
                    return [2 /*return*/, { data: data, error: error }];
            }
        });
    });
}
// Buscar histórico de um processo
export function buscarHistoricoProcesso(processId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, supabase
                        .from('process_history')
                        .select('*')
                        .eq('process_id', processId)
                        .order('changed_at', { ascending: false })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
