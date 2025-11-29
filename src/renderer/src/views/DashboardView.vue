<script setup>
import Sidebar from '@renderer/components/Sidebar.vue'
import ActivityCalendar from '@renderer/components/ActivityCalendar.vue'
import UpdateHistoryModal from '@renderer/components/modals/UpdateHistoryModal.vue'
import AdsCard from '@renderer/components/AdsCard.vue'
</script>

<template>
  <div
    class="container-fluid d-flex p-0"
    :class="themeMode === 'dark' ? 'dark-theme' : 'light-theme'"
  >
    <UpdateHistoryModal />
    <Sidebar />
    <div class="row w-100 m-0" :class="isSidebarOpen ? 'open-menu' : 'close-menu'">
      <div class="col">
        <nav aria-label="breadcrumb" class="my-3">
          <ol class="breadcrumb">
            <li class="breadcrumb-item active" aria-current="page">
              {{ $t('sidebar.dashboard') }}
            </li>
          </ol>
        </nav>
        <div class="row g-4 mb-4">
          <div v-for="(stat, index) in stats" :key="index" class="col">
            <div class="card card-dashboard">
              <div class="card-body d-flex align-items-center" :class="stat.class">
                <i class="me-3 fs-1" :class="stat.icon"></i>
                <div>
                  <h5 class="card-title mb-0">{{ stat.title }}</h5>
                  <h2>{{ stat.value }}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        <AdsCard />

        <!-- Log de Atividades -->
        <!-- Log de Atividades -->
        <div class="row mb-4">
          <div class="col">
            <div class="card">
              <div class="card-header d-flex align-items-center justify-content-between">
                <div class="console d-flex align-items-center">
                  <i class="bx bx-history fs-4 me-2" style="color: #727ddc"></i>
                  <h5 class="mt-2">{{ $t('pages.dashboard.activityLog.title') }}</h5>
                </div>
                <button class="btn btn-danger" @click="clearLog">{{ $t('buttons.clear') }}</button>
              </div>
              <div class="card-body p-0">
                <pre class="log-box p-3" style="max-height: 250px">
                  <div v-if="logData.length === 0" class="d-flex align-items-center justify-content-center text-center text-gray mt-3">
                    <span class="text-secondary me-2">{{ $t('pages.dashboard.activityLog.empty') }}</span>
                  </div>
                  <!-- ESTRUTURA DO LOG CORRIGIDA -->
                  <div v-for="log in logData" :key="log.id" class="log-line d-flex">
                    <!-- Parte 1: O prefixo que NÃO quebra a linha -->
                    <div class="log-prefix me-2">
                      <span class="text-secondary">[{{ new Date(log.timestamp).toLocaleString() }}]</span>
                      <span class="ms-2" :class="log.level === 'ERROR' || log.level === 'FATAL' ? 'text-danger' : 'text-warning'">[{{ log.level }}]</span>
                      <span class="ms-2 text-info">{{ log.source === 'USER_ACTIVITY' ? 'USER' : log.source === 'APP_EVENT' ? 'SYSTEM' : log.source }}</span>
                    </div>
                    <!-- Parte 2: A mensagem que PODE quebrar a linha -->
                    <span class="log-message">{{ log.message }}</span>
                  </div>
                </pre>
              </div>
            </div>
          </div>
        </div>

        <!-- Atividade Diária -->
        <div class="row mb-4">
          <div class="col">
            <div class="card">
              <div class="card-header d-flex align-items-center justify-content-between">
                <h5>{{ $t('pages.dashboard.dailyActivity.title') }}</h5>
                <div class="d-flex align-items-center">
                  <div class="d-flex align-items-center me-2">
                    <span class="me-2">{{ $t('buttons.less') }}</span>
                    <div
                      style="
                        background-color: #161b22;
                        width: 20px;
                        height: 20px;
                        border-radius: 3px;
                      "
                    ></div>
                  </div>

                  <div class="d-flex align-items-center me-2">
                    <div
                      style="
                        background-color: #39d353;
                        width: 20px;
                        height: 20px;
                        border-radius: 3px;
                      "
                    ></div>
                  </div>

                  <div class="d-flex align-items-center me-2">
                    <div
                      style="
                        background-color: #26a641;
                        width: 20px;
                        height: 20px;
                        border-radius: 3px;
                      "
                    ></div>
                  </div>

                  <div class="d-flex align-items-center me-2">
                    <div
                      style="
                        background-color: #006d32;
                        width: 20px;
                        height: 20px;
                        border-radius: 3px;
                      "
                    ></div>
                  </div>

                  <div class="d-flex align-items-center">
                    <div
                      style="
                        background-color: #0e4429;
                        width: 20px;
                        height: 20px;
                        border-radius: 5px;
                      "
                    ></div>
                    <span class="ms-2">{{ $t('buttons.more') }}</span>
                  </div>
                </div>
              </div>
              <div class="card-body">
                <ActivityCalendar />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SystemController from '../controller/SystemController' // Ajuste o caminho conforme necessário
import { getTheme } from '../service/userPreferences'
export default {
  data() {
    return {
      imageSrc: null,
      themeMode: getTheme() || 'light',
      showUpdateHistory: true,
      stats: [], // Começa como um array vazio, que será preenchido
      logEntries: [] // Armazena os logs de atividade
    }
  },
  computed: {
    ...mapGetters(['isSidebarOpen', 'isSubmenuOpen']),
    logData() {
      // Ordena os logs mais recentes primeiro
      return this.logEntries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    }
  },
  async created() {
    // Busca os dados quando o componente é criado
    this.statsDashboard = await SystemController.getDashboardStats()
  },
  mounted() {
    // Atualiza baseado no localStorage APÓS a inicialização
    this.showUpdateHistory = localStorage.getItem('hideUpdateHistory') !== 'true'
    this.loadDashboardData()
  },
  methods: {
    // Função central para carregar todos os dados do dashboard
    async loadDashboardData() {
      // Promise.all busca as estatísticas e os logs ao mesmo tempo, é mais rápido.
      const [statsData, activities] = await Promise.all([
        SystemController.getDashboardStats(),
        SystemController.getRecentActivities()
      ])

      // AJUSTE: Construímos o array de stats aqui para combinar com o template
      this.stats = [
        {
          title: this.$t('pages.dashboard.stats.colors'),
          value: statsData.palettes || 0, // Usamos os valores recebidos
          icon: 'bx bx-palette',
          class: 'card-palette'
        },
        {
          title: this.$t('pages.dashboard.stats.links'),
          value: statsData.links || 0,
          icon: 'bx bx-link',
          class: 'card-link'
        },
        {
          title: this.$t('pages.dashboard.stats.fonts'),
          value: statsData.fonts || 0,
          icon: 'bx bx-text',
          class: 'card-font'
        }
      ]

      this.logEntries = activities
    },

    async clearLog() {
      await SystemController.clearUserLogs()
      // Atualiza a lista na tela (agora estará vazia)
      this.logEntries = []
    },
    getLogTypeColor(type) {
      switch (type) {
        case 'PALETTE':
          return 'text-cor'
        case 'LINK':
          return 'text-link'
        case 'FONT':
          return 'text-font'
        case 'ICON':
          return 'text-icon'
        case 'IMAGE':
          return 'text-image'
        case 'ALGORITHM':
          return 'text-algorithm'
        case 'FRAMEWORK':
          return 'text-framework'
        case 'ARTICLE':
          return 'text-article'
        default:
          return 'text-secondary' // Cinza padrão
      }
    }
  }
}
</script>

<style scoped>
@import url('../assets/base.css');

.breadcrumb-item {
  color: var(--breadcrumb-color);
}
</style>

<style>
@import url('../assets/base.css');

.card-dashboard,
.card-dashboard > .card-body {
  border-radius: 20px;
  box-shadow: 1px 1px 10px rgba(255, 255, 255, 0.3);
}

.card-body {
  background-color: var(--card-element-bg);
  color: var(--card-element-text);
}

.container-fluid {
  background-color: var(--container-bg);
  min-height: 100vh;
}

.card {
  border: 1px solid var(--card-border);
}

.card-header {
  background-color: var(--card-header);
  color: var(--card-header-color);
}

.card-palette {
  background-color: #dbeafe;
  color: #1e40af;
}

.card-link {
  background-color: #dcfce7;
  color: #166333;
}

.card-font {
  background-color: #f3e8ff;
  color: var(--font-text);
}

.close-menu {
  margin-left: 90px !important;
  transition: margin-left 0.3s ease-in-out;
}

.open-menu {
  margin-left: 230px !important;
  transition: margin-left 0.3s ease-in-out;
}
body {
  background-color: var(--bg-body);
}

.text-cor {
  color: var(--text-cor);
}

.text-link {
  color: var(--text-link);
}

.text-font {
  color: var(--text-font);
}

.text-icon {
  color: var(--text-icon);
}

.text-image {
  color: var(--text-image);
}

.text-algorithm {
  color: var(--text-algorithm);
}

.text-framework {
  color: var(--text-framework);
}

.text-article {
  color: var(--text-article);
}

/* ESTILOS CORRIGIDOS PARA O LOG */
.log-box {
  margin: 0;
  background-color: var(--card-element-bg);
}

.log-prefix {
  /* Impede que o prefixo (timestamp, level, source) quebre a linha */
  white-space: nowrap;
  flex-shrink: 0; /* Impede que o prefixo seja "esmagado" pela mensagem longa */
}

.log-message {
  /* Permite que apenas a mensagem quebre a linha */
  white-space: pre-wrap;
  /* CORREÇÃO: Impede que palavras sejam cortadas no meio, quebrando apenas quando necessário */
  overflow-wrap: break-word;
}
</style>
