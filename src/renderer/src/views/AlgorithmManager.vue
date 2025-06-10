<script setup>
import AlgorithmModal from '@renderer/components/modals/AlgorithmModal.vue'
import Sidebar from '@renderer/components/Sidebar.vue'
</script>

<template>
  <div
    class="container-fluid d-flex p-0"
    :class="themeMode === 'dark' ? 'dark-theme' : 'light-theme'"
  >
    <Sidebar />
    <div class="row w-100 m-0" :class="isSidebarOpen ? 'open-menu' : 'close-menu'">
      <!-- Título da Página -->
      <div class="col">
        <nav aria-label="breadcrumb" class="mt-3">
          <ol class="breadcrumb">
            <li class="breadcrumb-item active" aria-current="page">
              {{ $t('sidebar.developers.code') }}
            </li>
          </ol>
        </nav>
        <div class="input-group my-5">
          <input
            v-model="searchTerm"
            type="text"
            class="form-control search py-4"
            :placeholder="$t('search', { name: $t('sidebar.developers.code').toLowerCase() })"
            @input="handleSearch"
          />
          <button
            class="btn btn-outline-secondary search d-flex align-items-center p-4"
            style="background-color: #727ddc; color: white"
            type="button"
          >
            <i class="bx bx-search fs-4" style="font-weight: bold"></i>
          </button>
        </div>

        <div class="card mb-2">
          <div class="card-header d-flex align-items-center justify-content-between">
            <h5 class="card-title">{{ $t('pages.algorithms.list') }}</h5>
            <button
              type="button"
              class="btn-system btn-adicionar me-2 d-flex align-items-center"
              @click="openAddModal"
            >
              <i class="bx bx-plus-circle me-1"></i>
              {{ $t('buttons.upload') }}
            </button>
          </div>
          <div v-if="algorithms.length === 0" class="card-body card-element py-0">
            <div class="overflow-auto" style="max-height: 400px">
              <ul class="list-unstyled">
                <li class="text-center text-gray mt-3">
                  {{
                    $t('messages.she-empty', { name: $t('sidebar.developers.code').toLowerCase() })
                  }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="row g-4 mb-4">
          <div v-for="algorithm in currentAlgorithms" :key="algorithm.index" class="col-4">
            <div class="card d-flex flex-column" style="min-height: 300px">
              <div class="card-header d-flex align-items-center justify-content-between">
                <h5 class="card-title">{{ algorithm.name }}</h5>
                <button
                  class="btn-system btn-link ms-2 d-flex align-items-center"
                  @click="handleOpenAlgorithm(algorithm.id)"
                >
                  {{ $t('buttons.view') }}
                  <i class="bx bx-link-external ms-1"></i>
                </button>
              </div>
              <div class="card-body card-element">
                <p class="card-text truncate-text">{{ algorithm.explanation }}</p>
              </div>
              <div class="card-footer d-flex justify-content-between">
                <button class="btn btn-editar me-2" @click="editAlgorithm(algorithm.id)">
                  <i class="bx bx-pencil"></i> {{ $t('buttons.edit') }}
                </button>
                <button class="btn btn-deletar" @click="handleDelete(algorithm.id)">
                  <i class="bx bx-trash"></i> {{ $t('buttons.delete') }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="card mb-4 d-flex flex-column border-top-0">
          <div class="card-footer d-flex align-items-center justify-content-between">
            <button
              class="btn btn-control d-flex align-items-center"
              :disabled="currentPage === 1"
              @click="handlePrevPage"
            >
              <i class="bx bx-chevron-left me-2"></i> {{ $t('buttons.previous') }}
            </button>
            <span>{{
              $t('pagination', { currentPage: currentPage, totalPages: totalPages })
            }}</span>
            <button
              class="btn btn-control d-flex align-items-center"
              :disabled="currentPage === totalPages"
              @click="handleNextPage"
            >
              {{ $t('buttons.next') }} <i class="bx bx-chevron-right fs-5"></i>
            </button>
          </div>
        </div>
        <!-- Modal -->
        <AlgorithmModal
          :key="idAlgorithm"
          :visible="showModal"
          :programmingLanguages="programmingLanguages"
          :idAlgorithm="idAlgorithm"
          @close="onCloseAlgorithmModal"
        >
        </AlgorithmModal>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SystemController from '../controller/SystemController'
import Algorithm from '../model/entity/algorithm'
import { getTheme } from '../service/userPreferences'

export default {
  data() {
    return {
      showModal: false,
      searchTerm: '',
      idAlgorithm: -1,
      currentPage: 1,
      algorithmsPerPage: 6,
      programmingLanguages: ['JavaScript', 'Python', 'Java', 'Ruby', 'Go', 'Rust', 'PHP', 'C/C++'],
      themeMode: getTheme()
    }
  },
  computed: {
    ...mapGetters(['isSidebarOpen']),
    // 1. A PROPRIEDADE REATIVA que lê da store.
    algorithms() {
      const storedAlgorithms = this.$store.getters.getStorage('algorithmsStorage') || []
      // Mapeia para sua classe de modelo. Note que usei 'explanation' para consistência com seu filtro.
      // Se o campo for 'explanation' no banco, ajuste aqui e no filtro.
      return storedAlgorithms.map((v) => new Algorithm(v.id, v.name, v.explanation))
    },
    filteredAlgorithms() {
      return this.algorithms.filter((algorithm) => {
        const name = algorithm.name?.toLowerCase() ?? ''
        const explanation = algorithm.explanation?.toLowerCase() ?? ''
        const term = this.searchTerm.toLowerCase()

        return name.includes(term) || explanation.includes(term)
      })
    },
    currentAlgorithms() {
      const indexOfLastAlgorithm = this.currentPage * this.algorithmsPerPage
      const indexOfFirstAlgorithm = indexOfLastAlgorithm - this.algorithmsPerPage
      return this.filteredAlgorithms.slice(indexOfFirstAlgorithm, indexOfLastAlgorithm)
    },
    totalPages() {
      let totalPages = Math.ceil(this.filteredAlgorithms.length / this.algorithmsPerPage)
      return totalPages === 0 ? 1 : totalPages
    }
  },
  methods: {
    handlePrevPage() {
      this.currentPage = Math.max(this.currentPage - 1, 1)
    },
    handleNextPage() {
      this.currentPage = Math.min(this.currentPage + 1, this.totalPages)
    },
    handleOpenAlgorithm(algorithmId) {
      // CORRIGIDO: Recebe e passa o ID real do banco de dados.
      if (!algorithmId) {
        console.error('Tentativa de navegar sem um ID de algoritmo válido!')
        return
      }
      this.$router.push({ name: 'algorithmPreview', params: { id: algorithmId } })
    },
    openAddModal() {
      this.idAlgorithm = -1;
      this.showModal = true;
    },
    getLanguage(algorithm) {
      if (!algorithm.lang) {
        return 'N/A'
      }

      return algorithm.lang
    },
    getBadgeClass(algorithm) {
      const lang = this.getLanguage(algorithm)

      switch (lang.toLowerCase()) {
        case 'java':
          return 'bg-warning text-dark'
        case 'python':
          return 'bg-info text-dark'
        case 'ruby':
          return 'bg-danger text-dark'
        case 'javascript':
          return 'bg-primary text-dark'
        case 'rust':
          return 'bg-secondary text-dark'
        case 'go':
          return 'bg-success text-dark'
        case 'php':
          return 'bg-success text-dark'
        case 'c++':
          return 'bg-success text-dark'
        default:
          return 'bg-light text-dark'
      }
    },
    onCloseAlgorithmModal() {
      this.showModal = false
      this.idAlgorithm = -1
    },
    handleDelete(algorithmId) {
      SystemController.deleteAlgorithm(algorithmId)
    },
    editAlgorithm(algorithmId) {
      this.idAlgorithm = algorithmId
      this.showModal = true
    }
  }
}
</script>

<style scoped>
@import url('../assets/base.css');

.breadcrumb-item {
  color: var(--breadcrumb-color);
}

.container-fluid {
  background-color: var(--container-bg);
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.btn-system {
  display: inline-block;
  box-sizing: border-box;
  text-decoration: none;
  font-family: 'Roboto', sans-serif;
  font-weight: 300;
  text-align: center;
  position: relative;
  cursor: pointer;
}

.btn-adicionar {
  background-color: rgba(0, 0, 0, 0);
  padding: 0.65em 1.6em;
  margin: 0 0.3em 0.3em 0;
  border-radius: 25px;
  border: 2px solid #22c55e;
  color: #22c55e;
  transition: all 0.2s;
  animation: bn13bouncy 5s infinite linear;
}

.btn-adicionar:hover {
  background-color: #22c55e;
  color: #000000;
}

.btn-link {
  background-color: #a855f7;
  border: 2px solid #a855f7;
  padding: 0.5em 1em;
  border-radius: 5px;
  color: white;
}

.btn-link:hover {
  background-color: #9333ea;
  color: white;
}

.btn-editar {
  background-color: #3b82f6;
  border: 2px solid #3b82f6;
  border-radius: 5px;
  color: white;
}

.btn-editar:hover {
  background-color: #2563eb;
  color: white;
}

.btn-deletar {
  background-color: #ef4444;
  border: 2px solid #ef4444;
  border-radius: 5px;
  color: white;
}

.btn-deletar:hover {
  background-color: #dc2626;
}

.search {
  font-family: 'Poppins', sans-serif;
  border-radius: 20px;
  border: none;
  height: 40px;
  background-color: #3d444d;
  color: white;
}

.search:focus {
  background-color: #3d444d;
  color: white;
}

.search::-webkit-input-placeholder {
  color: #b1b4b8;
}

.card-header,
.card-footer {
  background-color: var(--card-header);
  color: var(--card-header-color);
}

.btn-control {
  background-color: var(--pagination-bg);
  border-radius: 25px;
  border: 2px solid var(--pagination-border);
  color: var(--pagination-color);
  transition: all 0.2s;
  animation: bn13bouncy 5s infinite linear;
}

.btn-control:hover {
  background-color: var(--pagination-hover-bg);
  color: var(--pagination-hover-color);
}

.truncate-text {
  display: -webkit-box;
  -webkit-line-clamp: 4; /* Mostra no máximo 3 linhas */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 6.3em; /* Aproximadamente 3 linhas de texto */
  line-height: 1.5em; /* Altura da linha */
  cursor: pointer; /* Mostra que é clicável/interativo */
}
</style>
