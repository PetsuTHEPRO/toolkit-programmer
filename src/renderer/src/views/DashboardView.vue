<script setup>
import Sidebar from '@renderer/components/Sidebar.vue'
import ActivityCalendar from '@renderer/components/ActivityCalendar.vue'
import UpdateHistoryModal from '@renderer/components/modals/UpdateHistoryModal.vue'
</script>

<template>
  <div
    class="container-fluid d-flex p-0"
    :class="themeMode === 'dark' ? 'dark-theme' : 'light-theme'"
  >
    <UpdateHistoryModal />
    <Sidebar />
    <div
      class="row w-100 m-0"
      :class="isSidebarOpen ? 'open-menu' : 'close-menu'"
    >
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

        <!-- Log de Atividades -->
        <div class="row mb-4">
          <div class="col">
            <div class="card">
              <div
                class="card-header d-flex align-items-center justify-content-between">
                <div class="console d-flex align-items-center">
                  <i class="bx bx-history fs-4 me-2" style="color: #727ddc"></i>
                  <h5 class="mt-2">{{ $t('pages.dashboard.activityLog.title') }}</h5>
                </div>
                <button class="btn btn-danger" @click="clearLog">{{ $t('buttons.clear') }}</button>
              </div>
              <div class="card-body p-0">
                <pre class="p-3 m-0" style="max-height: 250px">
              <div v-if="logData.length === 0" class="d-flex align-items-center justify-content-center text-center text-gray mt-3">
                <span class="text-secondary me-2">{{ $t('pages.dashboard.activityLog.empty') }}</span>
              </div>
              <div v-for="(log, index) in logData" v-else :key="index" class="d-flex align-items-center">
                <span class="text-secondary me-2">[{{ log.timestamp }}]</span>
                <span class="me-2" :class="getLogTypeColor(log.type)">{{ log.type }}</span>
                <span>{{ log.description }}</span>
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
              <div
                class="card-header d-flex align-items-center justify-content-between">
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
      showUpdateHistory: true
    }
  },
  computed: {
    ...mapGetters(['isSidebarOpen', 'isSubmenuOpen']),
    stats() {
      return [
        {
          title: this.$t('pages.dashboard.stats.colors'),
          value: SystemController.getColor(),
          icon: 'bx bx-palette',
          class: 'card-palette'
        },
        {
          title: this.$t('pages.dashboard.stats.links'),
          value: SystemController.getLink(),
          icon: 'bx bx-link',
          class: 'card-link'
        },
        {
          title: this.$t('pages.dashboard.stats.fonts'),
          value: SystemController.getFont(),
          icon: 'bx bx-text',
          class: 'card-font'
        }
      ]
    },
    logData() {
      return SystemController.getMessagesLog()
    }
  },
  mounted(){
      // Atualiza baseado no localStorage APÓS a inicialização
      this.showUpdateHistory = localStorage.getItem('hideUpdateHistory') !== 'true'
  },
  created() {
    SystemController.updateSystem()
  },
  methods: {
    clearLog() {
      SystemController.clearMessagesLog()
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
</style>
