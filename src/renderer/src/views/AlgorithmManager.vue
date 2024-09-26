<script setup>
import AlgorithmModal from '@renderer/components/AlgorithmModal.vue'
import Sidebar from '@renderer/components/Sidebar.vue'
</script>

<template>
  <div class="container-fluid d-flex p-0">
    <Sidebar />
    <div class="row w-100 m-0" :class="isSidebarOpen ? 'open-menu' : 'close-menu'">
      <div class="col">
        <!-- Título da Página -->
        <nav aria-label="breadcrumb" class="mt-3">
          <ol class="breadcrumb">
            <li class="breadcrumb-item active" aria-current="page">Algoritmos</li>
          </ol>
        </nav>

        <div class="card mb-6">
          <div class="card-header">
            <h5 class="card-title">Adicionar Novo Algoritmo</h5>
          </div>
          <div class="card-body">
            <form @submit.prevent="handleSubmit" class="space-y-4">
              <div class="mb-3">
                <label for="name" class="form-label">Nome do Algoritmo</label>
                <input
                  type="text"
                  class="form-control"
                  id="name"
                  v-model="newAlgorithm.name"
                  placeholder="Digite o nome do algoritmo"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="image" class="form-label">URL da Imagem (opcional)</label>
                <input
                  type="text"
                  class="form-control"
                  id="image"
                  v-model="newAlgorithm.image"
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>
              <div class="mb-3">
                <label for="explanation" class="form-label">Explicação</label>
                <textarea
                  class="form-control"
                  id="explanation"
                  v-model="newAlgorithm.explanation"
                  placeholder="Explique como o algoritmo funciona"
                  required
                ></textarea>
              </div>
              <div class="mb-3">
                <label for="language" class="form-label">Linguagem</label>
                <select class="form-select" id="language" v-model="newAlgorithm.language" required>
                  <option value="" disabled>Selecione a linguagem</option>
                  <option v-for="lang in programmingLanguages" :key="lang" :value="lang">
                    {{ lang }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label for="code" class="form-label">Código</label>
                <textarea
                  class="form-control font-mono"
                  id="code"
                  v-model="newAlgorithm.code"
                  placeholder="Cole o código do algoritmo aqui"
                  required
                ></textarea>
              </div>
              <button type="submit" class="btn btn-primary">
                <i class="bx bx-plus mr-2"></i>
                Adicionar Algoritmo
              </button>
            </form>
          </div>
        </div>

        <div class="row">
          <div class="col-md-4" v-for="algorithm in currentAlgorithms" :key="algorithm.id">
            <div class="card mb-4">
              <div class="card-header">
                <h5 class="card-title d-flex align-items-center">
                  <i class="bx bx-code mr-2"></i>
                  {{ algorithm.name }}
                </h5>
              </div>
              <div class="card-body">
                <p class="text-sm text-gray-600 truncate">{{ algorithm.explanation }}</p>
                <p class="text-sm font-medium mt-2">Linguagem: {{ algorithm.language }}</p>
                <button class="btn btn-link" @click="openDialog(algorithm)">Ver Detalhes</button>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="algorithms.length > algorithmsPerPage"
          class="mt-6 d-flex justify-content-between"
        >
          <button
            @click="handlePrevPage"
            :disabled="currentPage === 1"
            class="btn btn-outline-secondary"
          >
            <i class="bx bx-chevron-left"></i> Anterior
          </button>
          <span class="text-sm font-medium"> Página {{ currentPage }} de {{ totalPages }} </span>
          <button
            @click="handleNextPage"
            :disabled="currentPage === totalPages"
            class="btn btn-outline-secondary"
          >
            Próxima <i class="bx bx-chevron-right"></i>
          </button>
        </div>

        <!-- Modal -->
        <AlgorithmModal
          :visible="showModal"
          :algorithmData="selectedAlgorithm"
          @close="showModal = false"
        >
        </AlgorithmModal>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      showModal: false,
      newAlgorithm: {
        name: '',
        image: '',
        explanation: '',
        language: '',
        code: ''
      },
      algorithms: [],
      currentPage: 1,
      selectedAlgorithm: null,
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
    currentAlgorithms() {
      const indexOfLastAlgorithm = this.currentPage * this.algorithmsPerPage
      const indexOfFirstAlgorithm = indexOfLastAlgorithm - this.algorithmsPerPage
      return this.algorithms.slice(indexOfFirstAlgorithm, indexOfLastAlgorithm)
    },
    totalPages() {
      return Math.ceil(this.algorithms.length / this.algorithmsPerPage)
    }
  },
  methods: {
    handleSubmit() {
      if (
        this.newAlgorithm.name &&
        this.newAlgorithm.explanation &&
        this.newAlgorithm.language &&
        this.newAlgorithm.code
      ) {
        const newAlgorithm = {
          id: Date.now(),
          name: this.newAlgorithm.name,
          image: this.newAlgorithm.image,
          explanation: this.newAlgorithm.explanation,
          language: this.newAlgorithm.language,
          code: this.newAlgorithm.code
        }
        this.algorithms.push(newAlgorithm) // Adiciona o novo algoritmo ao array
        this.resetForm()
      }
    },
    resetForm() {
      this.newAlgorithm = {
        name: '',
        image: '',
        explanation: '',
        language: '',
        code: ''
      }
    },
    handlePrevPage() {
      this.currentPage = Math.max(this.currentPage - 1, 1)
    },
    handleNextPage() {
      this.currentPage = Math.min(this.currentPage + 1, this.totalPages)
    },
    openDialog(algorithm) {
      this.selectedAlgorithm = algorithm
      this.showModal = true // Mostra o modal
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
