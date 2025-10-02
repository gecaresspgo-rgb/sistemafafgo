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
import { createRouter, createWebHistory } from 'vue-router';
// 1. SUGESTÃO APLICADA: Importar o Supabase uma única vez, no topo do arquivo.
import { supabase } from '../services/supabase';
import ProcessosView from '../views/ProcessosView.vue';
import LoginView from '../views/LoginView.vue';
import CadastroProcessoView from '../views/CadastroProcessoView.vue';
import AnalisesView from '../views/AnalisesView.vue';
import MinhaContaView from '../views/MinhaContaView.vue';
import ControleDeAcoesView from '../views/ControleDeAcoesView.vue';
var router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: '/processos',
        },
        {
            path: '/processos',
            name: 'processos',
            component: ProcessosView,
        },
        {
            path: '/login',
            name: 'login',
            component: LoginView,
        },
        {
            path: '/processos/novo',
            name: 'cadastro-processo',
            component: CadastroProcessoView,
        },
        {
            path: '/analises',
            name: 'analises',
            component: AnalisesView,
        },
        {
            path: '/minha-conta',
            name: 'minha-conta',
            component: MinhaContaView,
        },
        {
            path: '/controle-acoes',
            name: 'controle-acoes',
            component: ControleDeAcoesView,
        },
        {
            path: '/acompanhamento-especial',
            name: 'AcompanhamentoEspecial',
            component: function () { return import('../views/AcompanhamentoEspecialView.vue'); },
        },
        {
            path: '/processo/:id',
            name: 'processo-detalhes',
            redirect: function (to) {
                return { path: '/processos', query: { processo_id: to.params.id } };
            },
        },
        {
            path: '/admin',
            name: 'admin',
            component: function () { return import('../views/AdminView.vue'); },
        },
        {
            path: '/admin/usuarios',
            name: 'gerenciamento-usuarios',
            component: function () { return import('../views/GerenciamentoUsuariosView.vue'); },
        },
    ],
});
router.beforeEach(function (to, from, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, userRole, profile, publicPages, authRequired, isAdminRoute;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, supabase.auth.getUser()];
            case 1:
                user = (_a.sent()).data.user;
                userRole = null;
                if (!user) return [3 /*break*/, 3];
                return [4 /*yield*/, supabase
                        .from('profiles')
                        .select('role')
                        .eq('id', user.id)
                        .single()];
            case 2:
                profile = (_a.sent()).data;
                userRole = profile === null || profile === void 0 ? void 0 : profile.role;
                _a.label = 3;
            case 3:
                publicPages = ['/login'];
                authRequired = !publicPages.includes(to.path);
                isAdminRoute = to.path.startsWith('/admin');
                // 1. Se a rota precisa de login e o usuário não está logado...
                if (authRequired && !user) {
                    // 2. SUGESTÃO APLICADA: Redireciona para o login, guardando a página que o usuário queria acessar.
                    return [2 /*return*/, next({ path: '/login', query: { redirect: to.fullPath } })];
                }
                // 2. Se a rota é de admin e o usuário não tem o papel 'Admin', redireciona
                if (isAdminRoute && userRole !== 'Admin') {
                    console.warn('Acesso negado: Rota de admin para usuário não-admin.');
                    return [2 /*return*/, next('/processos')];
                }
                // 3. Se tudo estiver ok, permite a navegação
                next();
                return [2 /*return*/];
        }
    });
}); });
export default router;
