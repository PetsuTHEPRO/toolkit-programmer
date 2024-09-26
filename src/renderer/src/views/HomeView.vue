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
      languageData: [
        { name: 'JavaScript', value: 40 },
        { name: 'Python', value: 30 },
        { name: 'Java', value: 20 },
        { name: 'C++', value: 15 },
        { name: 'Ruby', value: 10 }
      ],
      trendData: [
        { month: 'Jan', JavaScript: 30, Python: 20, Java: 15, 'C++': 10, Ruby: 5 },
        { month: 'Feb', JavaScript: 35, Python: 22, Java: 18, 'C++': 12, Ruby: 7 },
        { month: 'Mar', JavaScript: 32, Python: 25, Java: 20, 'C++': 14, Ruby: 8 },
        { month: 'Apr', JavaScript: 38, Python: 28, Java: 22, 'C++': 15, Ruby: 9 },
        { month: 'May', JavaScript: 40, Python: 30, Java: 20, 'C++': 15, Ruby: 10 },
        { month: 'Jun', JavaScript: 42, Python: 32, Java: 21, 'C++': 16, Ruby: 11 }
      ],
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
          return 'text-danger'
        case 'LINK':
          return 'text-primary'
        case 'FONTE':
          return 'text-success'
        case 'LANG':
          return 'text-warning'
        case 'IMAGEM':
          return 'text-info'
        default:
          return 'text-secondary'
      }
    }
  }
}
</script>

<style>
.close-menu{
  margin-left: 90px !important;
  transition: margin-left 0.3s ease-in-out;
}

.open-menu{
  margin-left: 230px !important;
  transition: margin-left 0.3s ease-in-out;
}
body {
  background-color: #f8f9fa;
}
</style>
