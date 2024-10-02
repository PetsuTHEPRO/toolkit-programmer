<script setup>
import AlgorithmModal from '@renderer/components/AlgorithmModal.vue'
import Sidebar from '@renderer/components/Sidebar.vue'
</script>

<template>
  <div class="container-fluid d-flex p-0">
    <Sidebar />
    <div class="row w-100 m-0" :class="isSidebarOpen ? 'open-menu' : 'close-menu'">
      <!-- Título da Página -->
      <div class="col">
        <nav aria-label="breadcrumb" class="mt-3">
          <ol class="breadcrumb">
            <li class="breadcrumb-item active" aria-current="page">Algoritmo</li>
          </ol>
        </nav>
        <div class="card mt-5 mb-4">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="card-title">Pesquisar Algoritmos</h5>
          </div>

          <div class="card-body">
            <div class="input-group">
              <input
                v-model="searchTerm"
                type="text"
                class="form-control"
                placeholder="Digite o nome ou descrição do link"
                @input="handleSearch"
              />
              <button class="btn btn-outline-secondary" type="button">
                <i class="bx bx-search"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="card mb-2">
          <div class="card-header d-flex align-items-center justify-content-between">
            <h5 class="card-title">Lista de Algoritmos</h5>
            <button
              type="button"
              class="btn btn-outline-primary me-2 d-flex align-items-center"
              @click="showModal = true"
            >
              <i class="bx bx-plus-circle me-1"></i>
              Adicionar
            </button>
          </div>
          <div v-if="algorithms.length === 0" class="card-body py-0">
            <div class="overflow-auto" style="max-height: 400px">
              <ul class="list-unstyled">
                <li class="text-center text-gray mt-3">Nenhum algorithm encontrado.</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="row g-4 mb-4">
          <div v-for="algorithm in currentAlgorithms" :key="algorithm.index" class="col-4">
            <div class="card d-flex flex-column">
              <div class="card-header d-flex align-items-center">
                <h5 class="card-title">{{ algorithm.name }}</h5>
              </div>
              <div class="card-body">
                <p class="card-text">{{ algorithm.explanation }}</p>
              </div>
            </div>
          </div>

          <div
            v-if="filteredAlgorithms.length > algorithmsPerPage"
            class="my-4 d-flex align-items-center justify-content-between"
          >
            <button
              class="btn btn-outline-secondary"
              @click="handlePrevPage"
              :disabled="currentPage === 1"
            >
              Anterior
            </button>
            <span class="text-sm font-medium"> Página {{ currentPage }} de {{ totalPages }} </span>
            <button
              class="btn btn-outline-secondary"
              @click="handleNextPage"
              :disabled="currentPage === totalPages"
            >
              Próxima
            </button>
          </div>
          <!-- Modal -->
          <AlgorithmModal :visible="showModal" :programmingLanguages="programmingLanguages" @close="showModal = false"> </AlgorithmModal>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SystemController from '../controller/SystemController'

export default {
  data() {
    return {
      showModal: false,
      searchTerm: '',
      algorithms: [],
      currentPage: 1,
      algorithmsPerPage: 6,
      programmingLanguages: [
        'JavaScript',
        'Python',
        'Java',
        'C++',
        'Ruby',
        'Go',
        'Rust',
        'TypeScript'
      ]
    }
  },
  computed: {
    ...mapGetters(['isSidebarOpen']),
    filteredAlgorithms() {
      return this.algorithms.filter(
        (algorithm) =>
          algorithm.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          algorithm.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    },
    currentAlgorithms() {
      const indexOfLastAlgorithm = this.currentPage * this.algorithmsPerPage
      const indexOfFirstAlgorithm = indexOfLastAlgorithm - this.algorithmsPerPage
      return this.filteredAlgorithms.slice(indexOfFirstAlgorithm, indexOfLastAlgorithm)
    },
    totalPages() {
      return Math.ceil(this.filteredAlgorithms.length / this.algorithmsPerPage)
    }
  },
  created() {
    SystemController.updateSystem()
    this.algorithms = SystemController.getStorage('algorithmsStorage')
  },
  methods: {
    handlePrevPage() {
      this.currentPage = Math.max(this.currentPage - 1, 1)
    },
    handleNextPage() {
      this.currentPage = Math.min(this.currentPage + 1, this.totalPages)
    }
  }
}
</script>

<style>
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
