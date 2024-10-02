<script setup>
import Sidebar from '@renderer/components/Sidebar.vue'
import ActivityCalendar from '@renderer/components/ActivityCalendar.vue'
</script>

<template>
  <div class="container-fluid d-flex p-0">
    <Sidebar />
    <div class="row w-100 m-0" :class="isSidebarOpen ? 'open-menu' : 'close-menu'">
      <div class="col">
        <nav aria-label="breadcrumb" class="my-3">
          <ol class="breadcrumb">
            <li class="breadcrumb-item active" aria-current="page">Dashboard</li>
          </ol>
        </nav>
        <div class="row g-4 mb-4">
          <div v-for="(stat, index) in stats" :key="index" class="col">
            <div class="card">
              <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="card-title">{{ stat.title }}</h5>
                <i :class="stat.icon"></i>
              </div>
              <div class="card-body">
                <h2>{{ stat.value }}</h2>
              </div>
            </div>
          </div>
        </div>

        <!-- Log de Atividades -->
        <div class="row mb-4">
          <div class="col">
            <div class="card">
              <div class="card-header d-flex align-items-center justify-content-between">
                <h5>Log de Atividades</h5>
                <button class="btn btn-danger" @click="clearLog">Clear Log</button>
              </div>
              <div class="card-body p-0">
                <pre class="bg-dark text-light p-3 m-0" style="max-height: 250px">
              <div v-if="logData.length === 0" class="d-flex align-items-center justify-content-center text-center text-gray mt-3">
                <span class="text-secondary me-2">Sem logs registrados.</span>
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
              <div class="card-header">
                <h5>Atividade Diária</h5>
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

export default {
  data() {
    return {
      imageSrc: null
    }
  },
  computed: {
    ...mapGetters(['isSidebarOpen', 'isSubmenuOpen']),
    stats() {
      return [
        { title: 'Cores', value: SystemController.getColor(), icon: 'bx bx-palette' },
        { title: 'Links', value: SystemController.getLink(), icon: 'bx bx-link' },
        { title: 'Fontes', value: SystemController.getFont(), icon: 'bx bx-type' }
      ]
    },
    logData() {
      return SystemController.getMessagesLog()
    }
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
        case 'COR':
          return 'text-cor'
        case 'LINK':
          return 'text-link'
        case 'FONT':
          return 'text-font'
        case 'ICON':
          return 'text-icon'
        case 'IMAGEM':
          return 'text-image'
        case 'ALGORITHM':
          return 'text-algorithm'
        case 'FRAMEWORK':
          return 'text-framework'
        default:
          return 'text-secondary' // Cinza padrão
      }
    }
  }
}
</script>

<style>
.close-menu {
  margin-left: 90px !important;
  transition: margin-left 0.3s ease-in-out;
}

.open-menu {
  margin-left: 230px !important;
  transition: margin-left 0.3s ease-in-out;
}
body {
  background-color: #f8f9fa;
}

.text-cor {
  color: #ff5733;
}

.text-link {
  color: #ffc107;
}

.text-font {
  color: #28a745;
}

.text-icon {
  color: #17a2b8;
}

.text-image {
  color: #007bff;
}

.text-algorithm {
  color: #dc3545;
}

.text-framework {
  color: #6c757d;
}
</style>
