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
import { ref, onMounted, watch, computed } from 'vue';
import { supabase } from '../services/supabase';
import { useAuth } from '../composables/useAuth';
import { useDashboardFilters } from '../composables/useDashboardFilters';
import { useRouter } from 'vue-router';
import { useFormatters } from '../composables/useFormatters';
import { Combobox, ComboboxInput, ComboboxButton, ComboboxOptions, ComboboxOption } from '@headlessui/vue';
// IMPORTAÇÃO DOS COMPONENTES DE GRÁFICO
import { Bar, Pie } from 'vue-chartjs';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement, Title } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels, ArcElement, Title);
// COMPONENTE DE GRÁFICO REUTILIZÁVEL
var BarChart = Bar;
var PieChart = Pie;
// Remover interfaces não utilizadas
// --- DADOS E ESTADOS REATIVOS ---
var _a = useAuth(), user = _a.user, fetchUser = _a.fetchUser;
var processos = ref([]);
var processoSelecionado = ref('');
var loading = ref(false);
var painelAtivo = ref('processos');
var subPainelFinanceiroAtivo = ref('resumo');
var filtroAno = ref([]);
var anos = computed(function () {
    var anoAtual = new Date().getFullYear();
    var lista = [];
    for (var ano = 2019; ano <= anoAtual; ano++) {
        lista.push(ano);
    }
    return lista.reverse();
});
var dropdownAberto = ref(false);
var textoFiltroAno = computed(function () {
    var count = filtroAno.value.length;
    if (count === 0)
        return 'Todos os Anos';
    if (count === 1)
        return filtroAno.value[0].toString();
    return "".concat(count, " Anos Selecionados");
});
// NOVO: Estado para controlar a aba ativa
var abaAtiva = ref('etapas');
// NOVO: Arrays de histórico separados
var historicoEtapas = ref([]);
var historicoAlteracoes = ref([]);
// Dados dos gráficos
var dadosProcessosPorForca = ref([]);
var dadosTempoMedioEtapa = ref([]);
var totalProcessosGrafico = computed(function () { return dadosProcessosPorForca.value.reduce(function (acc, f) { return acc + f.total; }, 0); });
var dadosValoresPorOrgao = ref([]);
var _b = useFormatters(), formatarDataSimples = _b.formatarData, formatarMoeda = _b.formatarValor;
var dadosGastosPorOrgao = ref([]);
var totalEconomicidade = ref(0);
var dadosEconomicidadeDetalhada = ref([]);
var filtroAnoEconomicidade = ref('');
var filtroForcaProjetos = ref(null);
var dadosValoresEspecificos = ref([]);
var dadosDistribuicaoValores = ref(null);
var dadosProcessosCarregados = ref(false);
var dadosFinanceiroResumoCarregados = ref(false);
var dadosFinanceiroEconomicidadeCarregados = ref(false);
var dadosFinanceiroProjetosCarregados = ref(false);
// Timer para o Debounce do filtro de ano
var debounceTimer;
// Adicione esta propriedade computada junto com as outras
var tituloGraficoValorEspecifico = computed(function () {
    var forcaIdSelecionada = filtroForcaProjetos.value;
    // Se o filtro estiver em "Todas as Forças" (valor nulo)
    if (!forcaIdSelecionada) {
        return 'Valor Específico Total';
    }
    // Se uma força específica estiver selecionada, encontra o 'code' dela
    var forcaSelecionada = forcasMem.value.find(function (f) { return f.id === forcaIdSelecionada; });
    // Retorna o título dinâmico com o código da força
    if (forcaSelecionada) {
        return "Valor Espec\u00EDfico ".concat(forcaSelecionada.code);
    }
    // Fallback caso algo dê errado
    return 'Valor Específico';
});
// Propriedade computada para largura dinâmica do gráfico de etapas (barras verticais)
// --- FUNÇÕES DE BUSCA PARA OS GRÁFICOS ---
var router = useRouter();
var setFiltroForca = useDashboardFilters().setFiltroForca;
// Array de forças para mapear code -> id
var forcasMem = ref([]);
// Atualizar forcasMem ao buscar forças
function fetchForcas() {
    return __awaiter(this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, supabase
                        .from('responsible_forces')
                        .select('id, code, name')
                        .order('code', { ascending: true })];
                case 1:
                    data = (_a.sent()).data;
                    forcasMem.value = data || [];
                    return [2 /*return*/, forcasMem.value];
            }
        });
    });
}
// Busca todas as etapas cadastradas
function fetchEtapas() {
    return __awaiter(this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, supabase
                        .from('step_templates')
                        .select('id, name')
                        .order('id', { ascending: true })];
                case 1:
                    data = (_a.sent()).data;
                    return [2 /*return*/, data || []];
            }
        });
    });
}
// Corrigida: conta processos por code da força e mostra todas as forças
function fetchProcessosPorForca() {
    return __awaiter(this, void 0, void 0, function () {
        var forcas, _a, data, contagem, _i, data_1, proc, id;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!forcasMem.value.length) return [3 /*break*/, 1];
                    _a = forcasMem.value;
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, fetchForcas()];
                case 2:
                    _a = _b.sent();
                    _b.label = 3;
                case 3:
                    forcas = _a;
                    return [4 /*yield*/, supabase.rpc('get_processos_por_forca', { p_anos: filtroAno.value })];
                case 4:
                    data = (_b.sent()).data;
                    contagem = {};
                    if (data) {
                        for (_i = 0, data_1 = data; _i < data_1.length; _i++) {
                            proc = data_1[_i];
                            id = proc.responsible_force_id;
                            if (!contagem[id])
                                contagem[id] = 0;
                            contagem[id]++;
                        }
                    }
                    dadosProcessosPorForca.value = forcas.map(function (f) { return ({
                        code: f.code,
                        total: contagem[f.id] || 0,
                    }); });
                    return [2 /*return*/];
            }
        });
    });
}
function fetchTempoMedioPorEtapa() {
    return __awaiter(this, void 0, void 0, function () {
        var etapas, _a, data, error, grupos, _i, data_2, step, diffHoras, id;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, fetchEtapas()];
                case 1:
                    etapas = _b.sent();
                    return [4 /*yield*/, supabase.rpc('get_dados_tempo_etapa', { p_anos: filtroAno.value })];
                case 2:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        console.error('Erro ao buscar dados de tempo por etapa:', error);
                        dadosTempoMedioEtapa.value = []; // Zera os dados em caso de erro
                        return [2 /*return*/];
                    }
                    grupos = {};
                    if (data) {
                        for (_i = 0, data_2 = data; _i < data_2.length; _i++) {
                            step = data_2[_i];
                            diffHoras = (step.accumulated_duration_seconds || 0) / 3600;
                            id = step.step_template_id;
                            if (!grupos[id])
                                grupos[id] = { total: 0, soma: 0 };
                            grupos[id].total++;
                            grupos[id].soma += diffHoras;
                        }
                    }
                    // Mapeia os resultados para garantir que todas as etapas apareçam no gráfico
                    dadosTempoMedioEtapa.value = etapas.map(function (e) {
                        var _a;
                        return ({
                            name: e.name,
                            media_horas: ((_a = grupos[e.id]) === null || _a === void 0 ? void 0 : _a.total)
                                ? Number((grupos[e.id].soma / grupos[e.id].total).toFixed(2))
                                : 0,
                        });
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function fetchValoresPorOrgao() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, supabase.rpc('get_valores_por_orgao', { p_anos: filtroAno.value })];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        console.error('Erro ao buscar valores por órgão:', error);
                        dadosValoresPorOrgao.value = [];
                        return [2 /*return*/];
                    }
                    dadosValoresPorOrgao.value = data || [];
                    return [2 /*return*/];
            }
        });
    });
}
function fetchGastosPorOrgao() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, supabase.rpc('get_gastos_por_orgao', { p_anos: filtroAno.value })];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        console.error('Erro ao buscar gastos por órgão:', error);
                        dadosGastosPorOrgao.value = [];
                        return [2 /*return*/];
                    }
                    dadosGastosPorOrgao.value = data || [];
                    return [2 /*return*/];
            }
        });
    });
}
function fetchTotaisFinanceiros() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, economicidadeData, economicidadeError, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, supabase.rpc('get_saldo_liquido_economicidade', { p_anos: filtroAno.value })];
                case 1:
                    _a = _b.sent(), economicidadeData = _a.data, economicidadeError = _a.error;
                    if (economicidadeError) {
                        console.error('Erro ao buscar saldo líquido de economicidade:', economicidadeError);
                        totalEconomicidade.value = 0;
                    }
                    else {
                        totalEconomicidade.value = economicidadeData || 0;
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _b.sent();
                    console.error('Erro geral ao buscar totais financeiros:', error_1);
                    // Apenas a 'economicidade' precisa ser zerada aqui em caso de erro geral
                    totalEconomicidade.value = 0;
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function fetchDistribuicaoValores() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, supabase.rpc('get_distribuicao_valores', {
                        p_anos: filtroAno.value,
                        p_forca_id: filtroForcaProjetos.value
                    })];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        console.error('Erro ao buscar distribuição de valores:', error);
                    else
                        dadosDistribuicaoValores.value = (data && data.length > 0) ? data[0] : null;
                    return [2 /*return*/];
            }
        });
    });
}
// Funções de carregamento específicas para cada painel/sub-painel
function carregarDadosPainelProcessos() {
    return __awaiter(this, void 0, void 0, function () {
        var e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading.value = true;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, Promise.all([
                            fetchProcessosPorForca(),
                            fetchTempoMedioPorEtapa(),
                        ])];
                case 2:
                    _a.sent();
                    dadosProcessosCarregados.value = true; // Marca como carregado
                    return [3 /*break*/, 5];
                case 3:
                    e_1 = _a.sent();
                    console.error("Erro ao carregar dados de processos:", e_1);
                    return [3 /*break*/, 5];
                case 4:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function carregarDadosPainelFinanceiroResumo() {
    return __awaiter(this, void 0, void 0, function () {
        var e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading.value = true;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, Promise.all([
                            fetchValoresPorOrgao(),
                            fetchGastosPorOrgao(),
                            fetchTotaisFinanceiros(),
                            fetchProcessosPorForca(),
                        ])];
                case 2:
                    _a.sent();
                    dadosFinanceiroResumoCarregados.value = true; // Marca como carregado
                    return [3 /*break*/, 5];
                case 3:
                    e_2 = _a.sent();
                    console.error("Erro ao carregar resumo financeiro:", e_2);
                    return [3 /*break*/, 5];
                case 4:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function carregarDadosPainelFinanceiroEconomicidade() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetchEconomicidadeDetalhada()];
                case 1:
                    _a.sent();
                    dadosFinanceiroEconomicidadeCarregados.value = true; // Marca como carregado
                    return [2 /*return*/];
            }
        });
    });
}
function carregarDadosPainelFinanceiroProjetos() {
    return __awaiter(this, void 0, void 0, function () {
        var e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading.value = true;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, fetchDistribuicaoValores()];
                case 2:
                    _a.sent();
                    dadosFinanceiroProjetosCarregados.value = true; // Marca como carregado
                    return [3 /*break*/, 5];
                case 3:
                    e_3 = _a.sent();
                    console.error("Erro ao carregar dados de projetos:", e_3);
                    return [3 /*break*/, 5];
                case 4:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// Função principal que decide qual painel recarregar
function recarregarDadosDoPainelAtual() {
    if (painelAtivo.value === 'processos') {
        carregarDadosPainelProcessos();
    }
    else if (painelAtivo.value === 'financeiro') {
        switch (subPainelFinanceiroAtivo.value) {
            case 'resumo':
                carregarDadosPainelFinanceiroResumo();
                break;
            case 'economicidade':
                carregarDadosPainelFinanceiroEconomicidade();
                break;
            case 'projetos':
                carregarDadosPainelFinanceiroProjetos();
                break;
        }
    }
}
function handleCardClick(card) {
    subPainelFinanceiroAtivo.value = card;
}
// ✨ OTIMIZAÇÃO: Watch com Debounce para o filtro de ano
watch(filtroAno, function () {
    clearTimeout(debounceTimer); // Cancela o timer anterior se o usuário clicar de novo
    debounceTimer = setTimeout(function () {
        // Zera as flags para forçar o recarregamento com os novos filtros
        dadosProcessosCarregados.value = false;
        dadosFinanceiroResumoCarregados.value = false;
        dadosFinanceiroEconomicidadeCarregados.value = false;
        dadosFinanceiroProjetosCarregados.value = false;
        // Recarrega apenas os dados do painel que está visível no momento
        recarregarDadosDoPainelAtual();
    }, 500); // Espera 500ms após a última mudança para executar
});
watch(filtroAnoEconomicidade, function () {
    if (painelAtivo.value === 'financeiro' && subPainelFinanceiroAtivo.value === 'economicidade') {
        fetchEconomicidadeDetalhada();
    }
});
watch(subPainelFinanceiroAtivo, function (novoSubPainel) {
    // Se o usuário foi para economicidade E os dados ainda não foram carregados...
    if (novoSubPainel === 'economicidade' && !dadosFinanceiroEconomicidadeCarregados.value) {
        carregarDadosPainelFinanceiroEconomicidade();
    }
    // Se o usuário foi para projetos E os dados ainda não foram carregados...
    else if (novoSubPainel === 'projetos' && !dadosFinanceiroProjetosCarregados.value) {
        carregarDadosPainelFinanceiroProjetos();
    }
});
watch(filtroForcaProjetos, function () {
    if (subPainelFinanceiroAtivo.value === 'projetos') {
        fetchDistribuicaoValores();
    }
});
watch(painelAtivo, function (novoPainel) {
    // Se o usuário foi para o painel de processos E os dados ainda não foram carregados...
    if (novoPainel === 'processos' && !dadosProcessosCarregados.value) {
        carregarDadosPainelProcessos();
    }
    // Se o usuário foi para o painel financeiro E o resumo ainda não foi carregado...
    else if (novoPainel === 'financeiro' && !dadosFinanceiroResumoCarregados.value) {
        // Carrega o resumo, que é a tela inicial do financeiro
        carregarDadosPainelFinanceiroResumo();
    }
});
function fetchEconomicidadeDetalhada() {
    return __awaiter(this, void 0, void 0, function () {
        var anosParaFiltrar, _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    loading.value = true;
                    anosParaFiltrar = filtroAnoEconomicidade.value ? [filtroAnoEconomicidade.value] : filtroAno.value;
                    return [4 /*yield*/, supabase.rpc('get_economicidade_detalhada_chart', { p_anos: anosParaFiltrar })];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        console.error('Erro ao buscar economicidade detalhada:', error);
                        dadosEconomicidadeDetalhada.value = [];
                    }
                    else {
                        dadosEconomicidadeDetalhada.value = data || [];
                    }
                    loading.value = false;
                    return [2 /*return*/];
            }
        });
    });
}
// --- CHART DATA/OPTIONS PARA OS GRÁFICOS ---
// Gráfico de barras de processos por força (usando code)
var chartDataForca = computed(function () { return ({
    labels: dadosProcessosPorForca.value.map(function (f) { return f.code; }),
    datasets: [
        {
            label: 'Total de Processos',
            data: dadosProcessosPorForca.value.map(function (f) { return f.total; }),
            backgroundColor: '#2dd4bf', // teal-400 vibrante
            borderRadius: 8,
        },
    ],
}); });
var chartOptionsForca = {
    responsive: true,
    maintainAspectRatio: false, // Adicionado para consistência
    plugins: {
        legend: { display: false },
        tooltip: {
            enabled: true,
            backgroundColor: 'rgba(0,0,0,0.7)',
            titleColor: '#fff',
            bodyColor: '#fff',
        },
    },
    scales: {
        y: {
            beginAtZero: true,
            ticks: { color: '#cbd5e1', font: { weight: 'bold' } },
            grid: { color: 'rgba(255,255,255,0.1)' },
        },
        x: {
            ticks: { color: '#cbd5e1', font: { weight: 'bold' } },
            grid: { color: 'rgba(255,255,255,0.05)' },
        },
    },
    onClick: function (event, elements, chart) {
        var _a;
        if (!elements.length)
            return;
        var idx = elements[0].index;
        var code = (_a = chart.data.labels) === null || _a === void 0 ? void 0 : _a[idx];
        if (code) {
            var forca = forcasMem.value.find(function (f) { return f.code === code; });
            if (forca) {
                setFiltroForca(forca.id);
                router.push('/');
            }
        }
    },
};
// Gráfico de barras horizontais de tempo médio por etapa
var chartDataEtapa = computed(function () { return ({
    labels: dadosTempoMedioEtapa.value.map(function (e) { return e.name; }),
    datasets: [
        {
            label: 'Média (horas)',
            data: dadosTempoMedioEtapa.value.map(function (e) { return e.media_horas; }),
            backgroundColor: dadosTempoMedioEtapa.value.map(function (_, index) {
                return index % 2 === 0 ? '#4ade80' : '#22d3ee';
            }),
            borderRadius: 6,
        },
    ],
}); });
// SUBSTITUA TODO O SEU 'chartOptionsEtapa' POR ESTE
var chartOptionsEtapa = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    datasets: {
        bar: {
            barPercentage: 0.7, // A barra ocupa 70% do espaço disponível
            categoryPercentage: 0.8, // O grupo de barras ocupa 80% da categoria
        }
    },
    plugins: {
        legend: { display: false },
        tooltip: {
            enabled: true,
            backgroundColor: 'rgba(0,0,0,0.7)',
            titleColor: '#fff',
            bodyColor: '#fff',
            callbacks: {
                // CORRIGIDO: Garante que a função seja executada
                label: function (context) {
                    var label = context.dataset.label || '';
                    if (label) {
                        label += ': ';
                    }
                    if (context.parsed.x !== null) {
                        label += context.parsed.x.toFixed(2) + ' horas';
                    }
                    return label;
                }
            }
        },
        datalabels: {
            color: '#ffffff',
            anchor: 'end',
            align: 'end',
            offset: 8, // Offset positivo para colocar o texto fora da barra
            font: {
                weight: 'bold',
                size: 12,
            },
            // CORRIGIDO: Garante que a função formatter seja executada
            formatter: function (value, context) {
                if (value > 0) {
                    return "".concat(Number(value).toFixed(2), "h");
                }
                return '';
            }
        }
    },
    scales: {
        y: {
            ticks: { color: '#cbd5e1', font: { weight: 'bold' } },
            grid: { color: 'rgba(255,255,255,0.05)' },
        },
        x: {
            beginAtZero: true,
            ticks: {
                color: '#cbd5e1', font: { weight: 'bold' },
                // CORRIGIDO: Garante que a função callback seja executada
                callback: function (value, index, ticks) {
                    return "".concat(Number(value), "h");
                }
            },
            grid: { color: 'rgba(255,255,255,0.1)' },
        },
    },
};
var totalProjetosCorrigido = computed(function () {
    // A função 'reduce' soma todos os 'valor_total' de cada órgão na lista
    return dadosValoresPorOrgao.value.reduce(function (total, orgao) { return total + (orgao.valor_total || 0); }, 0);
});
var chartDataValores = computed(function () { return ({
    labels: dadosFinanceirosCombinados.value.map(function (d) { return d.code; }),
    datasets: [
        {
            label: 'Pagamento',
            data: dadosFinanceirosCombinados.value.map(function (d) { return d.gasto; }),
            backgroundColor: '#4ade80',
            borderRadius: 6,
        },
        {
            label: 'Projetos',
            data: dadosFinanceirosCombinados.value.map(function (d) { return d.destinado; }),
            backgroundColor: '#22d3ee',
            borderRadius: 6,
        }
    ]
}); });
var chartOptionsValores = computed(function () {
    // Encontra o valor máximo em todos os datasets para usar como referência
    var maxValue = 0;
    chartDataValores.value.datasets.forEach(function (dataset) {
        dataset.data.forEach(function (value) {
            if (value > maxValue) {
                maxValue = value;
            }
        });
    });
    return {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    color: '#cbd5e1',
                    font: { size: 14 }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.7)',
                titleColor: '#fff',
                bodyColor: '#fff',
                callbacks: {
                    label: function (_a) {
                        var dataset = _a.dataset, parsed = _a.parsed;
                        var label = dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (parsed.x !== null) {
                            label += formatarMoeda(parsed.x);
                        }
                        return label;
                    }
                }
            },
            // ✨ A LÓGICA INTELIGENTE PARA OS RÓTULOS ESTÁ AQUI ✨
            datalabels: {
                anchor: 'end',
                // O alinhamento muda com base no tamanho da barra
                align: function (context) {
                    var value = context.dataset.data[context.dataIndex];
                    // Se a barra for longa (> 70% do máximo), o texto fica DENTRO à esquerda
                    return value > maxValue * 0.7 ? 'start' : 'end';
                },
                // A cor também muda para garantir a legibilidade
                color: function (context) {
                    var value = context.dataset.data[context.dataIndex];
                    // Se a barra é longa (texto dentro), a cor é branca. Senão, é a cor do eixo.
                    return value > maxValue * 0.7 ? '#ffffff' : '#cbd5e1';
                },
                offset: 8, // Um pequeno espaçamento da borda da barra
                font: {
                    weight: 'bold',
                    size: 12,
                },
                formatter: function (value) {
                    if (value > 0) {
                        return formatarMoeda(value);
                    }
                    return '';
                }
            }
        },
        scales: {
            y: {
                ticks: {
                    color: '#cbd5e1',
                    font: { weight: 'bold' }
                },
                grid: { color: 'rgba(255,255,255,0.05)' },
            },
            x: {
                // Adiciona um 'respiro' de 20% no eixo para os rótulos externos caberem
                grace: '20%',
                ticks: {
                    color: '#cbd5e1',
                    callback: function (value) {
                        var num = Number(value);
                        if (num >= 1000000)
                            return 'R$' + (num / 1000000).toFixed(1) + 'M';
                        if (num >= 1000)
                            return 'R$' + (num / 1000) + 'K';
                        return formatarMoeda(num);
                    }
                },
                grid: { color: 'rgba(255,255,255,0.1)' },
            },
        },
    };
});
var chartDataRankingPagamento = computed(function () { return ({
    labels: dadosRankingPagamento.value.map(function (d) { return d.code; }),
    datasets: [{
            label: 'Percentual Pago',
            data: dadosRankingPagamento.value.map(function (d) { return d.percentual; }),
            backgroundColor: '#06b6d4',
            borderRadius: 6,
        }]
}); });
var chartOptionsRankingPagamento = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: {
            callbacks: {
                label: function (_a) {
                    var dataset = _a.dataset, parsed = _a.parsed;
                    return "".concat(dataset.label, ": ").concat(parsed.y.toFixed(2), "%");
                }
            }
        },
        datalabels: {
            anchor: 'end',
            align: 'top',
            color: 'white',
            font: { weight: 'bold' },
            formatter: function (value) { return "".concat(value.toFixed(2), "%"); },
        }
    },
    scales: {
        y: {
            suggestedMax: 100,
            ticks: {
                color: '#cbd5e1',
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                callback: function (value, index, ticks) { return "".concat(Number(value), "%"); }
            },
            grid: { color: 'rgba(255,255,255,0.1)' },
        },
        x: {
            ticks: {
                color: '#cbd5e1',
            },
            grid: { display: false },
        }
    }
};
var chartDataQuantidadeProcessos = computed(function () { return ({
    labels: dadosProcessosPorForca.value.map(function (d) { return d.code; }),
    datasets: [{
            label: 'Nº de Processos',
            data: dadosProcessosPorForca.value.map(function (d) { return d.total; }),
            backgroundColor: '#4f46e5',
            borderRadius: 6,
        }]
}); });
var chartOptionsQuantidadeProcessos = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: {
            callbacks: {
                label: function (_a) {
                    var dataset = _a.dataset, parsed = _a.parsed;
                    return "".concat(dataset.label, ": ").concat(parsed.y);
                }
            }
        },
        datalabels: {
            anchor: 'end',
            align: 'top',
            color: 'white',
            font: { weight: 'bold' },
            formatter: function (value) { return value; },
        }
    },
    scales: {
        y: {
            beginAtZero: true,
            ticks: {
                color: '#cbd5e1',
                stepSize: 1,
            },
            grid: { color: 'rgba(255,255,255,0.1)' },
        },
        x: {
            ticks: {
                color: '#cbd5e1',
            },
            grid: { display: false },
        }
    }
};
// ... (depois de chartOptionsQuantidadeProcessos)
var chartDataEconomicidadeDetalhada = computed(function () {
    var dados = dadosEconomicidadeDetalhada.value;
    if (!dados || dados.length === 0) {
        return { labels: [], datasets: [] };
    }
    // 1. Pega todos os códigos de área únicos e os ordena alfabeticamente para consistência.
    var labels = Array.from(new Set(dados.map(function (d) { return d.thematic_area_code; }))).sort();
    // 2. Cria um mapa para facilitar a busca de dados.
    // A chave será "CODE-TIPO", ex: "VPSP-Custeio"
    var dadosMapeados = new Map();
    for (var _i = 0, dados_1 = dados; _i < dados_1.length; _i++) {
        var item = dados_1[_i];
        var chave = "".concat(item.thematic_area_code, "-").concat(item.tipo_despesa.toLowerCase());
        dadosMapeados.set(chave, item.total_economicidade);
    }
    // 3. Monta os datasets de forma segura, garantindo a ordem e as cores.
    var datasets = [
        {
            label: 'Investimento',
            // Para cada área (label), busca o valor correspondente no mapa. Se não encontrar, o valor é 0.
            data: labels.map(function (label) { return dadosMapeados.get("".concat(label, "-investimento")) || 0; }),
            backgroundColor: '#00ff00', // Verde para Investimento
            borderRadius: 6,
        },
        {
            label: 'Custeio',
            // Faz o mesmo para Custeio.
            data: labels.map(function (label) { return dadosMapeados.get("".concat(label, "-custeio")) || 0; }),
            backgroundColor: '#00ffff', // Ciano para Custeio
            borderRadius: 6,
        }
    ];
    return {
        labels: labels,
        datasets: datasets
    };
});
var chartOptionsEconomicidadeDetalhada = {
    indexAxis: 'y', // Barras horizontais
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: true,
            position: 'top',
            labels: {
                color: '#cbd5e1',
                font: { size: 14 }
            }
        },
        tooltip: {
            backgroundColor: 'rgba(0,0,0,0.7)',
            titleColor: '#fff',
            bodyColor: '#fff',
            callbacks: {
                label: function (_a) {
                    var dataset = _a.dataset, parsed = _a.parsed;
                    var label = dataset.label || '';
                    if (label) {
                        label += ': ';
                    }
                    if (parsed.x !== null) {
                        label += formatarMoeda(parsed.x);
                    }
                    return label;
                }
            }
        },
        datalabels: {
            color: '#ffffff',
            anchor: 'end',
            align: 'end',
            offset: -8, // Dentro da barra
            font: {
                weight: 'bold',
                size: 12,
            },
            formatter: function (value) {
                if (value > 0) {
                    return formatarMoeda(value);
                }
                return '';
            }
        }
    },
    scales: {
        y: {
            ticks: {
                color: '#cbd5e1',
                font: { weight: 'bold' }
            },
            grid: { color: 'rgba(255,255,255,0.01)' },
        },
        x: {
            ticks: {
                color: '#cbd5e1',
                callback: function (value) {
                    var num = Number(value);
                    if (num >= 1000000)
                        return 'R$' + (num / 1000000).toFixed(1) + 'M';
                    if (num >= 1000)
                        return 'R$' + (num / 1000) + 'K';
                    return formatarMoeda(num);
                }
            },
            grid: { color: 'rgba(255,255,255,0.1)' },
        },
    },
};
// Para o novo gráfico de Barras
// Para o novo gráfico de Barras
var chartDataValoresEspecificos = computed(function () {
    var dados = dadosDistribuicaoValores.value;
    if (!dados)
        return { labels: [], datasets: [] };
    return {
        labels: ['Valor Inicial', 'Rendimentos', 'Economicidade'],
        datasets: [
            {
                label: 'Valor Total',
                data: [dados.total_inicial, dados.total_rendimentos, dados.total_economicidade],
                backgroundColor: ['#10b981', '#3b82f6', '#8b5cf6'],
                borderRadius: 6,
            }
        ]
    };
});
var chartOptionsValoresEspecificos = computed(function () {
    var _a;
    // Pega os dados do gráfico para descobrir o valor máximo
    var datasetData = ((_a = chartDataValoresEspecificos.value.datasets[0]) === null || _a === void 0 ? void 0 : _a.data) || [];
    var maxValue = Math.max.apply(Math, datasetData);
    return {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        datasets: {
            bar: {
                barPercentage: 0.6,
                categoryPercentage: 0.7,
            }
        },
        scales: {
            x: {
                // Adiciona um pouco de espaço extra no final do eixo X
                // para garantir que os rótulos externos caibam.
                grace: '15%', // Aumenta o eixo em 15% além do valor máximo
                ticks: {
                    color: '#ffffff',
                    callback: function (value) {
                        var num = Number(value);
                        if (num >= 1000000)
                            return 'R$' + (num / 1000000).toFixed(1) + 'M';
                        if (num >= 1000)
                            return 'R$' + (num / 1000) + 'K';
                        return formatarMoeda(num);
                    }
                },
                grid: { color: 'rgba(255,255,255,0.1)' },
            },
            y: {
                ticks: { color: '#ffffff', font: { weight: 'bold' } },
                grid: { display: false },
            }
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: function (context) { return formatarMoeda(context.parsed.x || 0); }
                }
            },
            // ✨ A MÁGICA ACONTECE AQUI ✨
            datalabels: {
                anchor: 'end',
                // O alinhamento agora é uma função que decide a posição
                align: function (context) {
                    var value = context.dataset.data[context.dataIndex];
                    // Se a barra for maior que 60% do valor máximo, alinha o texto DENTRO, à esquerda.
                    return value > maxValue * 0.6 ? 'start' : 'end';
                },
                // A cor também é dinâmica
                color: function (context) {
                    var value = context.dataset.data[context.dataIndex];
                    // Se a barra for longa (texto dentro), a cor é branca. Senão, é a cor do eixo.
                    return value > maxValue * 0.6 ? '#ffffff' : '#ffffff';
                },
                offset: 8, // Um pequeno espaçamento
                font: { weight: 'bold' },
                formatter: function (value) {
                    if (value > 0)
                        return formatarMoeda(value);
                    return '';
                }
            }
        },
    };
});
// Para o novo gráfico de Pizza (adicione o componente PieChart no template)
// <PieChart v-if="dadosDistribuicaoValores" :data="chartDataDistribuicaoValores" :options="chartOptionsDistribuicaoValores" />
var chartDataDistribuicaoValores = computed(function () {
    var dados = dadosDistribuicaoValores.value;
    if (!dados)
        return { labels: [], datasets: [] };
    // Calcula o total para encontrar a porcentagem
    var total = dados.total_inicial + dados.total_rendimentos + dados.total_economicidade;
    // Evita divisão por zero
    if (total === 0) {
        return {
            labels: ['Valor Inicial', 'Rendimentos', 'Economicidade'],
            datasets: [{ data: [0, 0, 0] }]
        };
    }
    return {
        labels: ['Valor Inicial', 'Rendimentos', 'Economicidade'],
        datasets: [{
                data: [
                    (dados.total_inicial / total) * 100,
                    (dados.total_rendimentos / total) * 100,
                    (dados.total_economicidade / total) * 100
                ],
                backgroundColor: ['#10b981', '#3b82f6', '#8b5cf6'],
            }]
    };
});
var chartOptionsDistribuicaoValores = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom',
            labels: { color: '#ffffff' }
        },
        tooltip: {
            callbacks: {
                // Formata o tooltip para mostrar porcentagem
                label: function (context) {
                    var label = context.label || '';
                    var value = context.parsed || 0;
                    return "".concat(label, ": ").concat(value.toFixed(2), "%");
                }
            }
        },
        datalabels: {
            color: '#ffffff',
            font: { weight: 'bold' },
            // Formata o rótulo para mostrar porcentagem
            formatter: function (value) {
                if (value < 5)
                    return ''; // Esconde rótulos muito pequenos
                return "".concat(value.toFixed(1), "%");
            }
        }
    }
};
var chartHeightEconomicidade = computed(function () {
    // Pega a quantidade de 'labels' (áreas) que serão exibidas no gráfico
    var itemsCount = chartDataEconomicidadeDetalhada.value.labels.length;
    // Se não houver itens, usa uma altura padrão
    if (itemsCount === 0)
        return 400;
    // Calcula uma altura dinâmica (ex: 60px por item) mas com um mínimo de 400px
    return Math.max(itemsCount * 60, 400);
});
var chartHeightEtapa = computed(function () {
    var itemsCount = dadosTempoMedioEtapa.value.length;
    if (itemsCount === 0)
        return 400;
    return Math.max(itemsCount * 50, 400);
});
// --- LINHA DO TEMPO (JÁ EXISTENTE) ---
// ATUALIZADO: Função para buscar os dois tipos de histórico
function buscarHistorico(id) {
    return __awaiter(this, void 0, void 0, function () {
        var historyData, auditData, userIds, userMap_1, users;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Buscando histórico para processoSelecionado:', id);
                    if (!id) {
                        historicoEtapas.value = [];
                        historicoAlteracoes.value = [];
                        return [2 /*return*/];
                    }
                    loading.value = true;
                    // Reseta os arrays e a aba
                    historicoEtapas.value = [];
                    historicoAlteracoes.value = [];
                    abaAtiva.value = 'etapas'; // Volta para a aba padrão
                    return [4 /*yield*/, supabase
                            .from('process_history')
                            .select('*, profiles(id, nome)')
                            .eq('process_id', id)
                            .order('changed_at', { ascending: false })];
                case 1:
                    historyData = (_a.sent()).data;
                    if (historyData) {
                        historicoEtapas.value = historyData;
                    }
                    return [4 /*yield*/, supabase
                            .from('audit_log')
                            .select('*')
                            .eq('process_id', id)
                            .order('changed_at', { ascending: false })];
                case 2:
                    auditData = (_a.sent()).data;
                    if (!(auditData && auditData.length > 0)) return [3 /*break*/, 5];
                    userIds = auditData
                        .map(function (item) { return item.user_id; })
                        .filter(function (id, idx, arr) { return id && arr.indexOf(id) === idx; });
                    userMap_1 = {};
                    if (!(userIds.length > 0)) return [3 /*break*/, 4];
                    return [4 /*yield*/, supabase
                            .from('profiles')
                            .select('id, nome')
                            .in('id', userIds)];
                case 3:
                    users = (_a.sent()).data;
                    if (users) {
                        userMap_1 = Object.fromEntries(users.map(function (u) { return [u.id, u.nome]; }));
                    }
                    _a.label = 4;
                case 4:
                    // Adicionar o nome ao log
                    historicoAlteracoes.value = auditData.map(function (item) { return (__assign(__assign({}, item), { user: { nome: userMap_1[item.user_id] || 'Usuário desconhecido' } })); });
                    return [3 /*break*/, 6];
                case 5:
                    historicoAlteracoes.value = [];
                    _a.label = 6;
                case 6:
                    console.log('Histórico de Etapas:', historicoEtapas.value);
                    console.log('Histórico de Alterações:', historicoAlteracoes.value);
                    loading.value = false;
                    return [2 /*return*/];
            }
        });
    });
}
// --- NOVOS TRADUTORES PARA O HISTÓRICO ---
// 1. Mapeia nomes técnicos dos campos para nomes amigáveis
var nomesAmigaveisCampos = {
    deleted_at: 'Status do Processo', // ou 'Data de Exclusão' se preferir
    descricao_itens: 'Descrição dos Itens',
    nome_acao: 'Nome da Ação',
    valor_total_destinado: 'Valor Total Destinado',
    // Adicione outros campos da tabela 'processes' aqui conforme precisar
};
// 2. Função que traduz o nome do campo
function formatarCampo(fieldName) {
    return nomesAmigaveisCampos[fieldName] || fieldName;
}
// 3. Função que traduz o valor, com lógica especial para o 'deleted_at'
function formatarValor(value, fieldName) {
    var isNullish = value === null || value === 'NULL' || value === '';
    // Lógica específica para o campo 'deleted_at'
    if (fieldName === 'deleted_at') {
        // Se o valor for nulo, significa que o processo está ATIVO.
        // Se tiver uma data, significa que foi EXCLUÍDO.
        return isNullish ? 'Ativo' : 'Excluído';
    }
    // Lógica padrão para outros campos
    return isNullish ? 'vazio' : value;
}
// WATCH: Observa mudanças no processoSelecionado
watch(processoSelecionado, function (novoId) {
    if (novoId) {
        buscarHistorico(novoId);
    }
    else {
        historicoEtapas.value = [];
        historicoAlteracoes.value = [];
    }
});
// Adiciona um event listener global para refresh
if (typeof window !== 'undefined') {
    window.addEventListener('refresh-historico', function () {
        if (processoSelecionado.value) {
            buscarHistorico(processoSelecionado.value);
        }
    });
}
// Carrega a lista de processos e os gráficos ao montar o componente
onMounted(function () { return __awaiter(void 0, void 0, void 0, function () {
    var usuario, data;
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
                if (!usuario) {
                    processos.value = [];
                    return [2 /*return*/];
                }
                return [4 /*yield*/, supabase
                        .from('processes')
                        .select('id, nome_acao, codigo_transferegov, thematic_areas(id, code)')
                        .is('deleted_at', null)
                        .order('created_at', { ascending: false })];
            case 3:
                data = (_a.sent()).data;
                if (data) {
                    processos.value = data.map(function (proc) {
                        var area_code = '';
                        if (Array.isArray(proc.thematic_areas) && proc.thematic_areas.length > 0) {
                            area_code = proc.thematic_areas[0].code;
                        }
                        else if (proc.thematic_areas && typeof proc.thematic_areas === 'object') {
                            area_code = proc.thematic_areas.code;
                        }
                        return {
                            id: proc.id,
                            nome_acao: proc.nome_acao,
                            area_code: area_code,
                        };
                    });
                }
                // ✨ MUDANÇA AQUI: Chamamos apenas a função principal de carregamento.
                // Ela agora já cuida de buscar as forças se necessário.
                return [4 /*yield*/, carregarDadosPainelProcessos()];
            case 4:
                // ✨ MUDANÇA AQUI: Chamamos apenas a função principal de carregamento.
                // Ela agora já cuida de buscar as forças se necessário.
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
var dadosFinanceirosCombinados = computed(function () {
    var mapa = new Map();
    dadosValoresPorOrgao.value.forEach(function (orgao) {
        mapa.set(orgao.code, {
            code: orgao.code,
            destinado: orgao.valor_total || 0,
            gasto: 0,
        });
    });
    dadosGastosPorOrgao.value.forEach(function (gasto) {
        if (mapa.has(gasto.code)) {
            mapa.get(gasto.code).gasto = gasto.total_gasto || 0;
        }
    });
    return Array.from(mapa.values()).sort(function (a, b) { return b.destinado - a.destinado; });
});
var dadosRankingPagamento = computed(function () {
    return dadosFinanceirosCombinados.value
        .map(function (orgao) { return ({
        code: orgao.code,
        percentual: orgao.destinado > 0 ? (orgao.gasto / orgao.destinado) * 100 : 0,
    }); })
        .sort(function (a, b) { return b.percentual - a.percentual; });
});
// Adicione esta computed property
var processosFiltrados = computed(function () {
    return queryHistorico.value === ''
        ? processos.value
        : processos.value.filter(function (processo) {
            var _a, _b;
            var nome = ((_a = processo.nome_acao) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || '';
            var sei = ((_b = processo.codigo_transferegov) === null || _b === void 0 ? void 0 : _b.toLowerCase()) || '';
            var query = queryHistorico.value.toLowerCase();
            return nome.includes(query) || sei.includes(query);
        });
});
var queryHistorico = ref('');
// Importar funções de formatação do composable
// Usar formatarDataSimples para datas sem hora
// Formata a data/hora para exibição amigável com hora e minuto (específica para análises)
function limparSelecaoHistorico() {
    processoSelecionado.value = ''; // Limpa o valor selecionado
    queryHistorico.value = ''; // Limpa o texto do campo de busca
}
// ATUALIZADO: Função para obter nome do usuário (mais robusta)
function obterNomeUsuario(profileOrId) {
    if (typeof profileOrId === 'string')
        return profileOrId || 'Usuário desconhecido';
    return (profileOrId === null || profileOrId === void 0 ? void 0 : profileOrId.nome) || 'Usuário desconhecido';
}
// [FUNÇÃO UTILITÁRIA DE EXPORTAÇÃO CSV]
function exportToCSV(headers, rows, filename) {
    if (!rows || rows.length === 0)
        return;
    // Cabeçalho
    var headerLine = headers.join(',');
    // Linhas de dados
    var dataLines = rows.map(function (row) {
        return headers.map(function (h) {
            var val = row[h] !== undefined && row[h] !== null ? String(row[h]) : '';
            if (val.includes(',') || val.includes('"')) {
                val = '"' + val.replace(/"/g, '""') + '"';
            }
            return val;
        }).join(',');
    });
    var csvContent = __spreadArray([headerLine], dataLines, true).join('\n');
    var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    var link = document.createElement('a');
    var url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
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
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "min-h-screen w-full flex flex-col items-center px-8 py-8" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "w-full max-w-7xl mb-12" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex flex-col md:flex-row justify-between items-center gap-4" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)(__assign({ class: "text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "w-full max-w-7xl mb-12" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex flex-col md:flex-row justify-between items-center gap-4" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)(__assign({ class: "text-3xl ..." }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex items-center gap-4" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex flex-col" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "text-xs text-slate-400 mb-1 text-center" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "relative" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.dropdownAberto = !__VLS_ctx.dropdownAberto;
    } }, { class: "px-3 py-2 w-48 text-center rounded-lg bg-slate-800/80 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm" }));
(__VLS_ctx.textoFiltroAno);
if (__VLS_ctx.dropdownAberto) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "absolute top-full mt-2 w-48 bg-slate-800 border border-white/20 rounded-lg shadow-lg z-10 p-2" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.dropdownAberto))
                return;
            __VLS_ctx.filtroAno = [];
        } }, { class: "w-full text-left text-sm px-2 py-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-md mb-1" }));
    for (var _i = 0, _c = __VLS_getVForSourceType((__VLS_ctx.anos)); _i < _c.length; _i++) {
        var ano = _c[_i][0];
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (ano),
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ for: ('ano-' + ano) }, { class: "w-full flex items-center p-2 hover:bg-slate-700/50 rounded-md cursor-pointer" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign({ type: "checkbox", id: ('ano-' + ano), value: (ano) }, { class: "w-4 h-4 accent-teal-500 bg-slate-700 border-slate-600 rounded" }));
        (__VLS_ctx.filtroAno);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "ml-3 text-white" }));
        (ano);
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex bg-slate-800/80 rounded-lg p-1.5 backdrop-blur-sm border border-white/10" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.painelAtivo = 'processos';
    } }, { class: ([
        'px-5 py-2 text-sm font-semibold rounded-md transition-all duration-300',
        __VLS_ctx.painelAtivo === 'processos'
            ? 'bg-gradient-to-r from-teal-600 to-cyan-500 text-white shadow-md'
            : 'text-slate-300 hover:bg-white/5'
    ]) }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.painelAtivo = 'financeiro';
    } }, { class: ([
        'px-5 py-2 text-sm font-semibold rounded-md transition-all duration-300',
        __VLS_ctx.painelAtivo === 'financeiro'
            ? 'bg-gradient-to-r from-teal-600 to-cyan-500 text-white shadow-md'
            : 'text-slate-300 hover:bg-white/5'
    ]) }));
if (__VLS_ctx.painelAtivo === 'processos') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "w-full max-w-7xl mx-auto space-y-12" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "grid grid-cols-1 md:grid-cols-1 gap-12" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-xl p-8 flex flex-col max-h-[500px] overflow-y-auto" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex items-center gap-3 mb-4 self-start" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign({ class: "w-6 h-6 text-teal-400" }, { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
        'stroke-width': "2",
        d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)(__assign({ class: "text-xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex-1 w-full overflow-x-auto" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ style: ({ height: __VLS_ctx.chartHeightEtapa + 'px', minWidth: '500px' }) }));
    if (__VLS_ctx.dadosTempoMedioEtapa.length) {
        var __VLS_4 = {}.BarChart;
        /** @type {[typeof __VLS_components.BarChart, ]} */ ;
        // @ts-ignore
        var __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4(__assign(__assign({ data: (__VLS_ctx.chartDataEtapa), options: (__VLS_ctx.chartOptionsEtapa) }, { class: "w-full" }), { height: (320), width: (__VLS_ctx.chartHeightEtapa) })));
        var __VLS_6 = __VLS_5.apply(void 0, __spreadArray([__assign(__assign({ data: (__VLS_ctx.chartDataEtapa), options: (__VLS_ctx.chartOptionsEtapa) }, { class: "w-full" }), { height: (320), width: (__VLS_ctx.chartHeightEtapa) })], __VLS_functionalComponentArgsRest(__VLS_5), false));
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "text-slate-400 text-center py-12" }));
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex items-center gap-3 mt-4" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.painelAtivo === 'processos'))
                return;
            __VLS_ctx.exportToCSV(['Etapa', 'Media_Horas'], __VLS_ctx.dadosTempoMedioEtapa.map(function (item) { return ({ 'Etapa': item.name, 'Media_Horas': item.media_horas }); }), 'tempo_medio_por_etapa.csv');
        } }, { class: "ml-auto px-3 py-1 text-xs bg-white/10 border border-teal-400 text-teal-400 rounded hover:bg-teal-400 hover:text-white transition" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-xl p-8" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)(__assign({ class: "text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent mb-4" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "text-slate-300 mb-6" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "mb-8 w-full md:w-96" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "block text-white font-semibold mb-2" }));
    var __VLS_8 = {}.Combobox;
    /** @type {[typeof __VLS_components.Combobox, typeof __VLS_components.Combobox, ]} */ ;
    // @ts-ignore
    var __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
        modelValue: (__VLS_ctx.processoSelecionado),
    }));
    var __VLS_10 = __VLS_9.apply(void 0, __spreadArray([{
            modelValue: (__VLS_ctx.processoSelecionado),
        }], __VLS_functionalComponentArgsRest(__VLS_9), false));
    __VLS_11.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "relative" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "relative w-full cursor-default overflow-hidden rounded-lg bg-slate-900 text-left border border-teal-400 focus-within:ring-2 focus-within:ring-white/75 sm:text-sm" }));
    var __VLS_12 = {}.ComboboxInput;
    /** @type {[typeof __VLS_components.ComboboxInput, ]} */ ;
    // @ts-ignore
    var __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12(__assign(__assign({ 'onChange': {} }, { class: "w-full border-none bg-transparent py-2 pl-3 pr-10 text-sm leading-5 text-white focus:ring-0 h-10" }), { displayValue: (function (id) { var _a; return ((_a = __VLS_ctx.processos.find(function (p) { return p.id === id; })) === null || _a === void 0 ? void 0 : _a.nome_acao) || ''; }) })));
    var __VLS_14 = __VLS_13.apply(void 0, __spreadArray([__assign(__assign({ 'onChange': {} }, { class: "w-full border-none bg-transparent py-2 pl-3 pr-10 text-sm leading-5 text-white focus:ring-0 h-10" }), { displayValue: (function (id) { var _a; return ((_a = __VLS_ctx.processos.find(function (p) { return p.id === id; })) === null || _a === void 0 ? void 0 : _a.nome_acao) || ''; }) })], __VLS_functionalComponentArgsRest(__VLS_13), false));
    var __VLS_16 = void 0;
    var __VLS_17 = void 0;
    var __VLS_18 = void 0;
    var __VLS_19 = {
        onChange: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.painelAtivo === 'processos'))
                return;
            __VLS_ctx.queryHistorico = $event.target.value;
        }
    };
    var __VLS_15;
    if (__VLS_ctx.processoSelecionado) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: (__VLS_ctx.limparSelecaoHistorico) }, { class: "absolute inset-y-0 right-10 flex items-center pr-2" }), { title: "Limpar seleção" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign(__assign({ xmlns: "http://www.w3.org/2000/svg" }, { class: "h-4 w-4 text-red-400 hover:text-white" }), { viewBox: "0 0 20 20", fill: "currentColor" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
            'fill-rule': "evenodd",
            d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z",
            'clip-rule': "evenodd",
        });
    }
    var __VLS_20 = {}.ComboboxButton;
    /** @type {[typeof __VLS_components.ComboboxButton, typeof __VLS_components.ComboboxButton, ]} */ ;
    // @ts-ignore
    var __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20(__assign({ class: "absolute inset-y-0 right-0 flex items-center pr-2" })));
    var __VLS_22 = __VLS_21.apply(void 0, __spreadArray([__assign({ class: "absolute inset-y-0 right-0 flex items-center pr-2" })], __VLS_functionalComponentArgsRest(__VLS_21), false));
    __VLS_23.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign({ class: "h-5 w-5 text-red-400" }, { viewBox: "0 0 20 20", fill: "currentColor" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
        'fill-rule': "evenodd",
        d: "M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z",
        'clip-rule': "evenodd",
    });
    var __VLS_23;
    var __VLS_24 = {}.transition;
    /** @type {[typeof __VLS_components.Transition, typeof __VLS_components.transition, typeof __VLS_components.Transition, typeof __VLS_components.transition, ]} */ ;
    // @ts-ignore
    var __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
        leaveActiveClass: "transition duration-100 ease-in",
        leaveFromClass: "opacity-100",
        leaveToClass: "opacity-0",
    }));
    var __VLS_26 = __VLS_25.apply(void 0, __spreadArray([{
            leaveActiveClass: "transition duration-100 ease-in",
            leaveFromClass: "opacity-100",
            leaveToClass: "opacity-0",
        }], __VLS_functionalComponentArgsRest(__VLS_25), false));
    __VLS_27.slots.default;
    var __VLS_28 = {}.ComboboxOptions;
    /** @type {[typeof __VLS_components.ComboboxOptions, typeof __VLS_components.ComboboxOptions, ]} */ ;
    // @ts-ignore
    var __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28(__assign({ class: "absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-slate-800 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-10" })));
    var __VLS_30 = __VLS_29.apply(void 0, __spreadArray([__assign({ class: "absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-slate-800 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-10" })], __VLS_functionalComponentArgsRest(__VLS_29), false));
    __VLS_31.slots.default;
    if (__VLS_ctx.processosFiltrados.length === 0 && __VLS_ctx.queryHistorico !== '') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "relative cursor-default select-none py-2 px-4 text-gray-400" }));
    }
    for (var _d = 0, _e = __VLS_getVForSourceType((__VLS_ctx.processosFiltrados)); _d < _e.length; _d++) {
        var processo = _e[_d][0];
        var __VLS_32 = {}.ComboboxOption;
        /** @type {[typeof __VLS_components.ComboboxOption, typeof __VLS_components.ComboboxOption, ]} */ ;
        // @ts-ignore
        var __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
            key: (processo.id),
            value: (processo.id),
        }));
        var __VLS_34 = __VLS_33.apply(void 0, __spreadArray([{
                key: (processo.id),
                value: (processo.id),
            }], __VLS_functionalComponentArgsRest(__VLS_33), false));
        {
            var __VLS_thisSlot = __VLS_35.slots.default;
            var _f = __VLS_getSlotParams(__VLS_thisSlot)[0], selected = _f.selected, active = _f.active;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)(__assign({ class: ({ 'bg-teal-600 text-white': active, 'text-slate-200': !active }) }, { class: "relative cursor-default select-none py-2 pl-4 pr-4" }));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: ({ 'font-medium': selected, 'font-normal': !selected }) }, { class: "block" }));
            (processo.nome_acao || 'Processo sem nome');
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "text-xs text-slate-400 block" }));
            (processo.codigo_transferegov || 'Sem SEI');
            __VLS_35.slots['' /* empty slot name completion */];
        }
        var __VLS_35;
    }
    var __VLS_31;
    var __VLS_27;
    var __VLS_11;
    if (__VLS_ctx.loading) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "text-center py-12" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "text-lg font-semibold text-teal-400" }));
    }
    else if (__VLS_ctx.processoSelecionado) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "mb-6 flex justify-center border-b border-white/20" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!(__VLS_ctx.painelAtivo === 'processos'))
                    return;
                if (!!(__VLS_ctx.loading))
                    return;
                if (!(__VLS_ctx.processoSelecionado))
                    return;
                __VLS_ctx.abaAtiva = 'etapas';
            } }, { class: (['px-6 py-2 text-lg font-semibold transition-colors duration-200', __VLS_ctx.abaAtiva === 'etapas' ? 'text-teal-300 border-b-2 border-teal-300' : 'text-slate-400 hover:text-white']) }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!(__VLS_ctx.painelAtivo === 'processos'))
                    return;
                if (!!(__VLS_ctx.loading))
                    return;
                if (!(__VLS_ctx.processoSelecionado))
                    return;
                __VLS_ctx.abaAtiva = 'alteracoes';
            } }, { class: (['px-6 py-2 text-lg font-semibold transition-colors duration-200', __VLS_ctx.abaAtiva === 'alteracoes' ? 'text-teal-300 border-b-2 border-teal-300' : 'text-slate-400 hover:text-white']) }));
        if (__VLS_ctx.abaAtiva === 'etapas') {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "max-h-[400px] overflow-y-auto pr-4" }));
            if (__VLS_ctx.historicoEtapas.length > 0) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "space-y-6" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "relative" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "absolute left-6 top-0 bottom-0 w-0.5 bg-teal-400/50" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "space-y-6" }));
                for (var _g = 0, _h = __VLS_getVForSourceType((__VLS_ctx.historicoEtapas)); _g < _h.length; _g++) {
                    var evento = _h[_g][0];
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ key: (evento.id) }, { class: "relative flex items-start" }));
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "absolute left-4 w-4 h-4 bg-cyan-400 rounded-full border-4 border-white shadow-lg z-10" }));
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "ml-12 bg-white/5 rounded-lg p-4 flex-1 shadow-sm" }));
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex items-start justify-between mb-2" }));
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)(__assign({ class: "font-semibold text-white" }));
                    (evento.description);
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "text-sm text-slate-400" }));
                    (__VLS_ctx.formatarDataSimples(evento.changed_at));
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex items-center gap-2 text-sm text-slate-300" }));
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign({ class: "w-4 h-4" }, { fill: "none", stroke: "currentColor", 'stroke-width': "2", viewBox: "0 0 24 24" }));
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
                        'stroke-linecap': "round",
                        'stroke-linejoin': "round",
                        d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
                    });
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
                    (__VLS_ctx.obterNomeUsuario(evento.profiles));
                }
            }
            else {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "text-center py-12" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "text-lg font-semibold text-slate-400" }));
            }
        }
        if (__VLS_ctx.abaAtiva === 'alteracoes') {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "max-h-[400px] overflow-y-auto pr-4" }));
            if (__VLS_ctx.historicoAlteracoes.length > 0) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "space-y-6" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "relative" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "absolute left-6 top-0 bottom-0 w-0.5 bg-teal-400/50" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "space-y-6" }));
                for (var _j = 0, _k = __VLS_getVForSourceType((__VLS_ctx.historicoAlteracoes)); _j < _k.length; _j++) {
                    var evento = _k[_j][0];
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ key: (evento.id) }, { class: "relative flex items-start" }));
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "absolute left-4 w-4 h-4 bg-cyan-400 rounded-full border-4 border-white shadow-lg z-10" }));
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "ml-12 bg-white/5 rounded-lg p-4 flex-1 shadow-sm" }));
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex items-start justify-between" }));
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "font-semibold text-white text-base leading-relaxed" }));
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "text-slate-300" }));
                    (__VLS_ctx.obterNomeUsuario(evento.user));
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.b, __VLS_intrinsicElements.b)({});
                    (__VLS_ctx.formatarCampo(evento.field_name));
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "text-red-400 font-mono bg-black/20 px-1 rounded" }));
                    (__VLS_ctx.formatarValor(evento.old_value, evento.field_name));
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "text-green-400 font-mono bg-black/20 px-1 rounded" }));
                    (__VLS_ctx.formatarValor(evento.new_value, evento.field_name));
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "text-sm text-slate-400 flex-shrink-0 ml-4" }));
                    (__VLS_ctx.formatarDataSimples(evento.changed_at));
                }
            }
            else {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "text-center py-12" }));
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "text-lg font-semibold text-slate-400" }));
            }
        }
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "text-center py-12" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "text-lg font-semibold text-slate-400" }));
    }
}
else if (__VLS_ctx.painelAtivo === 'financeiro') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "w-full max-w-7xl space-y-8" }));
    if (__VLS_ctx.subPainelFinanceiroAtivo === 'resumo') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "grid grid-cols-1 sm:grid-cols-2 gap-8" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!!(__VLS_ctx.painelAtivo === 'processos'))
                    return;
                if (!(__VLS_ctx.painelAtivo === 'financeiro'))
                    return;
                if (!(__VLS_ctx.subPainelFinanceiroAtivo === 'resumo'))
                    return;
                __VLS_ctx.handleCardClick('projetos');
            } }, { class: "bg-slate-800/50 backdrop-blur-md border border-white/10 rounded-xl shadow-xl p-6 flex items-center gap-6 cursor-pointer hover:bg-slate-700/50 transition-colors" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex-shrink-0 w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign({ class: "w-8 h-8 text-white" }, { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
            'stroke-linecap': "round",
            'stroke-linejoin': "round",
            'stroke-width': "2",
            d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)(__assign({ class: "text-lg font-semibold text-teal-300" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "text-3xl font-bold text-white tracking-tight" }));
        (__VLS_ctx.formatarMoeda(__VLS_ctx.totalProjetosCorrigido));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!!(__VLS_ctx.painelAtivo === 'processos'))
                    return;
                if (!(__VLS_ctx.painelAtivo === 'financeiro'))
                    return;
                if (!(__VLS_ctx.subPainelFinanceiroAtivo === 'resumo'))
                    return;
                __VLS_ctx.handleCardClick('economicidade');
            } }, { class: "bg-slate-800/50 backdrop-blur-md border border-white/10 rounded-xl shadow-xl p-6 flex items-center gap-6 cursor-pointer hover:bg-slate-700/50 transition-colors" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex-shrink-0 w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign({ class: "w-8 h-8 text-white" }, { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
            'stroke-linecap': "round",
            'stroke-linejoin': "round",
            'stroke-width': "2",
            d: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)(__assign({ class: "text-lg font-semibold text-cyan-300" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "text-3xl font-bold text-white tracking-tight" }));
        (__VLS_ctx.formatarMoeda(__VLS_ctx.totalEconomicidade));
    }
    else if (__VLS_ctx.subPainelFinanceiroAtivo === 'economicidade') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex items-center gap-4 mb-6" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!!(__VLS_ctx.painelAtivo === 'processos'))
                    return;
                if (!(__VLS_ctx.painelAtivo === 'financeiro'))
                    return;
                if (!!(__VLS_ctx.subPainelFinanceiroAtivo === 'resumo'))
                    return;
                if (!(__VLS_ctx.subPainelFinanceiroAtivo === 'economicidade'))
                    return;
                __VLS_ctx.subPainelFinanceiroAtivo = 'resumo';
            } }, { class: "px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white font-semibold flex items-center gap-2 hover:bg-white/20 transition-colors" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign({ class: "w-5 h-5" }, { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
            'stroke-linecap': "round",
            'stroke-linejoin': "round",
            'stroke-width': "2",
            d: "M10 19l-7-7m0 0l7-7m-7 7h18",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)(__assign({ class: "text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "text-slate-400 mb-8" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "grid grid-cols-1 lg:grid-cols-3 gap-8" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "lg:col-span-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-xl p-8 flex flex-col min-h-[500px]" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)(__assign({ class: "text-xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent mb-4" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex-1 w-full" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ style: ({ height: __VLS_ctx.chartHeightEconomicidade + 'px', minWidth: '500px' }) }));
        if (__VLS_ctx.dadosEconomicidadeDetalhada.length && !__VLS_ctx.loading) {
            var __VLS_36 = {}.BarChart;
            /** @type {[typeof __VLS_components.BarChart, ]} */ ;
            // @ts-ignore
            var __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
                data: (__VLS_ctx.chartDataEconomicidadeDetalhada),
                options: (__VLS_ctx.chartOptionsEconomicidadeDetalhada),
            }));
            var __VLS_38 = __VLS_37.apply(void 0, __spreadArray([{
                    data: (__VLS_ctx.chartDataEconomicidadeDetalhada),
                    options: (__VLS_ctx.chartOptionsEconomicidadeDetalhada),
                }], __VLS_functionalComponentArgsRest(__VLS_37), false));
        }
        else if (!__VLS_ctx.loading) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "text-slate-400 text-center pt-24" }));
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "text-slate-400 text-center pt-24" }));
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex items-center gap-3 mt-4" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!!(__VLS_ctx.painelAtivo === 'processos'))
                    return;
                if (!(__VLS_ctx.painelAtivo === 'financeiro'))
                    return;
                if (!!(__VLS_ctx.subPainelFinanceiroAtivo === 'resumo'))
                    return;
                if (!(__VLS_ctx.subPainelFinanceiroAtivo === 'economicidade'))
                    return;
                __VLS_ctx.exportToCSV(['Area', 'Tipo_Despesa', 'Economicidade'], __VLS_ctx.dadosEconomicidadeDetalhada.map(function (item) { return ({ 'Area': item.thematic_area_code, 'Tipo_Despesa': item.tipo_despesa, 'Economicidade': item.total_economicidade }); }), 'economicidade_detalhada.csv');
            } }, { class: "ml-auto px-3 py-1 text-xs bg-white/10 border border-teal-400 text-teal-400 rounded hover:bg-teal-400 hover:text-white transition" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "lg:col-span-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-xl p-6 flex flex-col" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)(__assign({ class: "text-xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent mb-6" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!!(__VLS_ctx.painelAtivo === 'processos'))
                    return;
                if (!(__VLS_ctx.painelAtivo === 'financeiro'))
                    return;
                if (!!(__VLS_ctx.subPainelFinanceiroAtivo === 'resumo'))
                    return;
                if (!(__VLS_ctx.subPainelFinanceiroAtivo === 'economicidade'))
                    return;
                __VLS_ctx.filtroAnoEconomicidade = '';
            } }, { class: ([
                'px-4 py-2 rounded-lg text-lg font-semibold transition-colors duration-200',
                __VLS_ctx.filtroAnoEconomicidade === '' ? 'bg-gradient-to-r from-teal-600 to-cyan-500 text-white shadow-md' : 'text-slate-300 hover:bg-white/10'
            ]) }));
        var _loop_1 = function (ano) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: function () {
                    var _a = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        _a[_i] = arguments[_i];
                    }
                    var $event = _a[0];
                    if (!!(__VLS_ctx.painelAtivo === 'processos'))
                        return;
                    if (!(__VLS_ctx.painelAtivo === 'financeiro'))
                        return;
                    if (!!(__VLS_ctx.subPainelFinanceiroAtivo === 'resumo'))
                        return;
                    if (!(__VLS_ctx.subPainelFinanceiroAtivo === 'economicidade'))
                        return;
                    __VLS_ctx.filtroAnoEconomicidade = ano;
                } }, { key: (ano) }), { class: ([
                    'px-4 py-2 rounded-lg text-lg font-semibold transition-colors duration-200',
                    __VLS_ctx.filtroAnoEconomicidade === ano ? 'bg-gradient-to-r from-teal-600 to-cyan-500 text-white shadow-md' : 'text-slate-300 hover:bg-white/5'
                ]) }));
            (ano);
        };
        for (var _l = 0, _m = __VLS_getVForSourceType((__VLS_ctx.anos)); _l < _m.length; _l++) {
            var ano = _m[_l][0];
            _loop_1(ano);
        }
    }
    else if (__VLS_ctx.subPainelFinanceiroAtivo === 'projetos') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "space-y-8" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex items-center gap-4" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!!(__VLS_ctx.painelAtivo === 'processos'))
                    return;
                if (!(__VLS_ctx.painelAtivo === 'financeiro'))
                    return;
                if (!!(__VLS_ctx.subPainelFinanceiroAtivo === 'resumo'))
                    return;
                if (!!(__VLS_ctx.subPainelFinanceiroAtivo === 'economicidade'))
                    return;
                if (!(__VLS_ctx.subPainelFinanceiroAtivo === 'projetos'))
                    return;
                __VLS_ctx.subPainelFinanceiroAtivo = 'resumo';
            } }, { class: "px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white font-semibold flex items-center gap-2 hover:bg-white/20 transition-colors" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(__assign({ class: "w-5 h-5" }, { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
            'stroke-linecap': "round",
            'stroke-linejoin': "round",
            'stroke-width': "2",
            d: "M10 19l-7-7m0 0l7-7m-7 7h18",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)(__assign({ class: "text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "grid grid-cols-1 lg:grid-cols-3 gap-8" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "lg:col-span-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-xl p-8 flex flex-col min-h-[500px]" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)(__assign({ class: "text-xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent mb-4" }));
        (__VLS_ctx.tituloGraficoValorEspecifico);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex-1 w-full" }));
        if (__VLS_ctx.dadosDistribuicaoValores && !__VLS_ctx.loading) {
            var __VLS_40 = {}.BarChart;
            /** @type {[typeof __VLS_components.BarChart, ]} */ ;
            // @ts-ignore
            var __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
                data: (__VLS_ctx.chartDataValoresEspecificos),
                options: (__VLS_ctx.chartOptionsValoresEspecificos),
            }));
            var __VLS_42 = __VLS_41.apply(void 0, __spreadArray([{
                    data: (__VLS_ctx.chartDataValoresEspecificos),
                    options: (__VLS_ctx.chartOptionsValoresEspecificos),
                }], __VLS_functionalComponentArgsRest(__VLS_41), false));
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "text-slate-400 text-center pt-24" }));
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "lg:col-span-1 flex flex-col gap-8" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-xl p-6 flex flex-col" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)(__assign({ class: "text-lg font-bold text-slate-200 mb-4" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)(__assign({ value: (__VLS_ctx.filtroForcaProjetos) }, { class: "w-full px-3 py-2 rounded bg-slate-800 border border-white/20 text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/70" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
            value: (null),
        });
        for (var _o = 0, _p = __VLS_getVForSourceType((__VLS_ctx.forcasMem)); _o < _p.length; _o++) {
            var forca = _p[_o][0];
            __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
                key: (forca.id),
                value: (forca.id),
            });
            (forca.code);
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-xl p-6 flex flex-col flex-1" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)(__assign({ class: "text-lg font-bold text-slate-200 mb-4 text-center" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex-1 w-full flex items-center justify-center min-h-[250px]" }));
        if (__VLS_ctx.dadosDistribuicaoValores) {
            var __VLS_44 = {}.PieChart;
            /** @type {[typeof __VLS_components.PieChart, ]} */ ;
            // @ts-ignore
            var __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
                data: (__VLS_ctx.chartDataDistribuicaoValores),
                options: (__VLS_ctx.chartOptionsDistribuicaoValores),
            }));
            var __VLS_46 = __VLS_45.apply(void 0, __spreadArray([{
                    data: (__VLS_ctx.chartDataDistribuicaoValores),
                    options: (__VLS_ctx.chartOptionsDistribuicaoValores),
                }], __VLS_functionalComponentArgsRest(__VLS_45), false));
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "text-slate-400 text-center" }));
        }
    }
    if (__VLS_ctx.subPainelFinanceiroAtivo === 'resumo') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "grid grid-cols-1 lg:grid-cols-3 gap-8" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "lg:col-span-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-xl p-8 flex flex-col min-h-[500px]" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)(__assign({ class: "text-xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent mb-4" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex-1 w-full" }));
        if (__VLS_ctx.dadosValoresPorOrgao.length && !__VLS_ctx.loading) {
            var __VLS_48 = {}.BarChart;
            /** @type {[typeof __VLS_components.BarChart, ]} */ ;
            // @ts-ignore
            var __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
                data: (__VLS_ctx.chartDataValores),
                options: (__VLS_ctx.chartOptionsValores),
            }));
            var __VLS_50 = __VLS_49.apply(void 0, __spreadArray([{
                    data: (__VLS_ctx.chartDataValores),
                    options: (__VLS_ctx.chartOptionsValores),
                }], __VLS_functionalComponentArgsRest(__VLS_49), false));
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "text-slate-400 text-center pt-24" }));
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "lg:col-span-1 flex flex-col gap-8" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-xl p-6 flex flex-col min-h-[350px]" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)(__assign({ class: "text-lg font-bold text-slate-200 mb-4 text-center" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex-1 w-full" }));
        if (__VLS_ctx.dadosRankingPagamento.length) {
            var __VLS_52 = {}.BarChart;
            /** @type {[typeof __VLS_components.BarChart, ]} */ ;
            // @ts-ignore
            var __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
                data: (__VLS_ctx.chartDataRankingPagamento),
                options: (__VLS_ctx.chartOptionsRankingPagamento),
            }));
            var __VLS_54 = __VLS_53.apply(void 0, __spreadArray([{
                    data: (__VLS_ctx.chartDataRankingPagamento),
                    options: (__VLS_ctx.chartOptionsRankingPagamento),
                }], __VLS_functionalComponentArgsRest(__VLS_53), false));
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "text-slate-400 text-center pt-16" }));
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-xl p-6 flex flex-col min-h-[350px]" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)(__assign({ class: "text-lg font-bold text-slate-200 mb-4 text-center" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex-1 w-full" }));
        if (__VLS_ctx.dadosProcessosPorForca.length) {
            var __VLS_56 = {}.BarChart;
            /** @type {[typeof __VLS_components.BarChart, ]} */ ;
            // @ts-ignore
            var __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
                data: (__VLS_ctx.chartDataQuantidadeProcessos),
                options: (__VLS_ctx.chartOptionsQuantidadeProcessos),
            }));
            var __VLS_58 = __VLS_57.apply(void 0, __spreadArray([{
                    data: (__VLS_ctx.chartDataQuantidadeProcessos),
                    options: (__VLS_ctx.chartOptionsQuantidadeProcessos),
                }], __VLS_functionalComponentArgsRest(__VLS_57), false));
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "text-slate-400 text-center pt-16" }));
        }
    }
}
var __VLS_2;
/** @type {__VLS_StyleScopedClasses['min-h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['px-8']} */ ;
/** @type {__VLS_StyleScopedClasses['py-8']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-7xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['md:flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
/** @type {__VLS_StyleScopedClasses['from-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['to-cyan-300']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-clip-text']} */ ;
/** @type {__VLS_StyleScopedClasses['text-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-7xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['md:flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['...']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-48']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-800/80']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['top-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-48']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-800']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['z-10']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-left']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-slate-700/50']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-slate-700/50']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['accent-teal-500']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-700']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-600']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-800/80']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['backdrop-blur-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['px-5']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['px-5']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-7xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-12']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-12']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['backdrop-blur-md']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['p-8']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['max-h-[500px]']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-y-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['self-start']} */ ;
/** @type {__VLS_StyleScopedClasses['w-6']} */ ;
/** @type {__VLS_StyleScopedClasses['h-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
/** @type {__VLS_StyleScopedClasses['from-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['to-cyan-300']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-clip-text']} */ ;
/** @type {__VLS_StyleScopedClasses['text-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-x-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-12']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['backdrop-blur-md']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['p-8']} */ ;
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
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['md:w-96']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-default']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-900']} */ ;
/** @type {__VLS_StyleScopedClasses['text-left']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['focus-within:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus-within:ring-white/75']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['border-none']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-3']} */ ;
/** @type {__VLS_StyleScopedClasses['pr-10']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-0']} */ ;
/** @type {__VLS_StyleScopedClasses['h-10']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-y-0']} */ ;
/** @type {__VLS_StyleScopedClasses['right-10']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-400']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-y-0']} */ ;
/** @type {__VLS_StyleScopedClasses['right-0']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-400']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['max-h-60']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-800']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['ring-1']} */ ;
/** @type {__VLS_StyleScopedClasses['ring-black/5']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['z-10']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-default']} */ ;
/** @type {__VLS_StyleScopedClasses['select-none']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-teal-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-default']} */ ;
/** @type {__VLS_StyleScopedClasses['select-none']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pr-4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['font-normal']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-12']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['max-h-[400px]']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-y-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['pr-4']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['left-6']} */ ;
/** @type {__VLS_StyleScopedClasses['top-0']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-0.5']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-teal-400/50']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-start']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['left-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-cyan-400']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['border-4']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['z-10']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-12']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/5']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-start']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-300']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-12']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['max-h-[400px]']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-y-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['pr-4']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['left-6']} */ ;
/** @type {__VLS_StyleScopedClasses['top-0']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-0.5']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-teal-400/50']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-start']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['left-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-cyan-400']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['border-4']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['z-10']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-12']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/5']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-start']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-relaxed']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-300']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-400']} */ ;
/** @type {__VLS_StyleScopedClasses['font-mono']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black/20']} */ ;
/** @type {__VLS_StyleScopedClasses['px-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['text-green-400']} */ ;
/** @type {__VLS_StyleScopedClasses['font-mono']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black/20']} */ ;
/** @type {__VLS_StyleScopedClasses['px-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-12']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-12']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-7xl']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-8']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-8']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-800/50']} */ ;
/** @type {__VLS_StyleScopedClasses['backdrop-blur-md']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-slate-700/50']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-16']} */ ;
/** @type {__VLS_StyleScopedClasses['h-16']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-br']} */ ;
/** @type {__VLS_StyleScopedClasses['from-teal-500']} */ ;
/** @type {__VLS_StyleScopedClasses['to-cyan-500']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-teal-300']} */ ;
/** @type {__VLS_StyleScopedClasses['text-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-tight']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-800/50']} */ ;
/** @type {__VLS_StyleScopedClasses['backdrop-blur-md']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-slate-700/50']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-16']} */ ;
/** @type {__VLS_StyleScopedClasses['h-16']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-br']} */ ;
/** @type {__VLS_StyleScopedClasses['from-cyan-500']} */ ;
/** @type {__VLS_StyleScopedClasses['to-blue-500']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-cyan-300']} */ ;
/** @type {__VLS_StyleScopedClasses['text-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-tight']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
/** @type {__VLS_StyleScopedClasses['from-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['to-cyan-300']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-clip-text']} */ ;
/** @type {__VLS_StyleScopedClasses['text-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:grid-cols-3']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-8']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:col-span-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['backdrop-blur-md']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['p-8']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['min-h-[500px]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
/** @type {__VLS_StyleScopedClasses['from-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['to-cyan-300']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-clip-text']} */ ;
/** @type {__VLS_StyleScopedClasses['text-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-24']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-24']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:col-span-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['backdrop-blur-md']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
/** @type {__VLS_StyleScopedClasses['from-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['to-cyan-300']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-clip-text']} */ ;
/** @type {__VLS_StyleScopedClasses['text-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['max-h-[400px]']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-y-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['pr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-8']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
/** @type {__VLS_StyleScopedClasses['from-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['to-cyan-300']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-clip-text']} */ ;
/** @type {__VLS_StyleScopedClasses['text-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:grid-cols-3']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-8']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:col-span-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['backdrop-blur-md']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['p-8']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['min-h-[500px]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
/** @type {__VLS_StyleScopedClasses['from-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['to-cyan-300']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-clip-text']} */ ;
/** @type {__VLS_StyleScopedClasses['text-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-24']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:col-span-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-8']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['backdrop-blur-md']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-800']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:border-teal-500']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-teal-500/70']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['backdrop-blur-md']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['min-h-[250px]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:grid-cols-3']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-8']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:col-span-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['backdrop-blur-md']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['p-8']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['min-h-[500px]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
/** @type {__VLS_StyleScopedClasses['from-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['to-cyan-300']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-clip-text']} */ ;
/** @type {__VLS_StyleScopedClasses['text-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-24']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:col-span-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-8']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['backdrop-blur-md']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['min-h-[350px]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['backdrop-blur-md']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/20']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['min-h-[350px]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-16']} */ ;
var __VLS_dollars;
var __VLS_self = (await import('vue')).defineComponent({
    setup: function () {
        return {
            Layout: Layout,
            Combobox: Combobox,
            ComboboxInput: ComboboxInput,
            ComboboxButton: ComboboxButton,
            ComboboxOptions: ComboboxOptions,
            ComboboxOption: ComboboxOption,
            BarChart: BarChart,
            PieChart: PieChart,
            processos: processos,
            processoSelecionado: processoSelecionado,
            loading: loading,
            painelAtivo: painelAtivo,
            subPainelFinanceiroAtivo: subPainelFinanceiroAtivo,
            filtroAno: filtroAno,
            anos: anos,
            dropdownAberto: dropdownAberto,
            textoFiltroAno: textoFiltroAno,
            abaAtiva: abaAtiva,
            historicoEtapas: historicoEtapas,
            historicoAlteracoes: historicoAlteracoes,
            dadosProcessosPorForca: dadosProcessosPorForca,
            dadosTempoMedioEtapa: dadosTempoMedioEtapa,
            dadosValoresPorOrgao: dadosValoresPorOrgao,
            formatarDataSimples: formatarDataSimples,
            formatarMoeda: formatarMoeda,
            totalEconomicidade: totalEconomicidade,
            dadosEconomicidadeDetalhada: dadosEconomicidadeDetalhada,
            filtroAnoEconomicidade: filtroAnoEconomicidade,
            filtroForcaProjetos: filtroForcaProjetos,
            dadosDistribuicaoValores: dadosDistribuicaoValores,
            tituloGraficoValorEspecifico: tituloGraficoValorEspecifico,
            forcasMem: forcasMem,
            handleCardClick: handleCardClick,
            chartDataEtapa: chartDataEtapa,
            chartOptionsEtapa: chartOptionsEtapa,
            totalProjetosCorrigido: totalProjetosCorrigido,
            chartDataValores: chartDataValores,
            chartOptionsValores: chartOptionsValores,
            chartDataRankingPagamento: chartDataRankingPagamento,
            chartOptionsRankingPagamento: chartOptionsRankingPagamento,
            chartDataQuantidadeProcessos: chartDataQuantidadeProcessos,
            chartOptionsQuantidadeProcessos: chartOptionsQuantidadeProcessos,
            chartDataEconomicidadeDetalhada: chartDataEconomicidadeDetalhada,
            chartOptionsEconomicidadeDetalhada: chartOptionsEconomicidadeDetalhada,
            chartDataValoresEspecificos: chartDataValoresEspecificos,
            chartOptionsValoresEspecificos: chartOptionsValoresEspecificos,
            chartDataDistribuicaoValores: chartDataDistribuicaoValores,
            chartOptionsDistribuicaoValores: chartOptionsDistribuicaoValores,
            chartHeightEconomicidade: chartHeightEconomicidade,
            chartHeightEtapa: chartHeightEtapa,
            formatarCampo: formatarCampo,
            formatarValor: formatarValor,
            dadosRankingPagamento: dadosRankingPagamento,
            processosFiltrados: processosFiltrados,
            queryHistorico: queryHistorico,
            limparSelecaoHistorico: limparSelecaoHistorico,
            obterNomeUsuario: obterNomeUsuario,
            exportToCSV: exportToCSV,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup: function () {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
