<script setup>
import Sidebar from '../components/Sidebar.vue'
import FrameworkModal from '../components/FrameworkModal.vue'
</script>

<template>
  <div class="container-fluid d-flex p-0">
    <Sidebar />
    <div class="row w-100 m-0" :class="isSidebarOpen ? 'open-menu' : 'close-menu'">
      <!-- Título da Página -->
      <div class="col">
        <nav aria-label="breadcrumb" class="mt-3">
          <ol class="breadcrumb">
            <li class="breadcrumb-item active" aria-current="page">Framework</li>
          </ol>
        </nav>
        <div class="card mt-5 mb-4">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="card-title">Pesquisar Framework</h5>
          </div>

          <div class="card-body">
            <div class="input-group">
              <input
                v-model="searchTerm"
                type="text"
                class="form-control"
                placeholder="Digite o nome ou descrição do framework"
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
            <h5 class="card-title">Lista de Framework/API</h5>
            <button
              type="button"
              class="btn btn-outline-primary me-2 d-flex align-items-center"
              @click="showModal = true"
            >
              <i class="bx bx-plus-circle me-1"></i>
              Adicionar
            </button>
          </div>
          <div v-if="frameworks.length === 0" class="card-body py-0">
            <div class="overflow-auto" style="max-height: 400px">
              <ul class="list-unstyled">
                <li class="text-center text-gray mt-3">Nenhum framework/API encontrado.</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="row g-4 mb-4">
          <div v-for="(framework, index) in currentFrameworks" :key="framework.index" class="col-4">
            <div class="card d-flex flex-column">
              <div class="card-header d-flex align-items-center justify-content-between">
                <h5 class="card-title">{{ framework.name }}</h5>
                <div class="btn-group">
                  <button class="btn btn-warning" @click="editFramework(index)">
                    <i class="bx bx-pencil"></i>
                  </button>
                  <button class="btn btn-danger" @click="handleDelete(index)">
                    <i class="bx bx-trash"></i>
                  </button>
                </div>
              </div>
              <div class="card-body p-0 my-2 ms-1">
                <div id="myTab" class="nav nav-tabs" role="tablist">
                  <button
                    :id="`description-tab-${index}`"
                    class="nav-link active"
                    data-bs-toggle="tab"
                    :data-bs-target="`#description-${index}`"
                    role="tab"
                    aria-controls="description"
                    aria-selected="true"
                  >
                    Descrição <i class="bx bx-info-circle" style="font-size: 0.9rem"></i>
                  </button>
                  <button
                    :id="`installation-tab-${index}`"
                    class="nav-link"
                    data-bs-toggle="tab"
                    :data-bs-target="`#installation-${index}`"
                    role="tab"
                    aria-controls="installation"
                    aria-selected="false"
                  >
                    Instalação <i class="bx bx-download" style="font-size: 0.9rem"></i>
                  </button>
                  <button
                    :id="`documentation-tab-${index}`"
                    class="nav-link"
                    data-bs-toggle="tab"
                    :data-bs-target="`#documentation-${index}`"
                    role="tab"
                    aria-controls="documentation"
                    aria-selected="false"
                  >
                    Docs <i class="bx bx-book-open ms-1" style="font-size: 0.9rem"></i>
                  </button>
                </div>
                <div class="tab-content mt-3 px-3">
                  <div
                    :id="`description-${index}`"
                    class="tab-pane fade show active"
                    role="tabpanel"
                    :aria-labelledby="`description-tab-${index}`"
                  >
                    <p class="text-sm text-gray-600">{{ framework.description }}</p>
                  </div>
                  <div
                    :id="`installation-${index}`"
                    class="tab-pane fade"
                    role="tabpanel"
                    :aria-labelledby="`installation-tab-${index}`"
                  >
                    <pre class="bg-light p-2 rounded d-flex">
                  <code>{{ framework.installation }}</code>
                </pre>
                  </div>
                  <div
                    :id="`documentation-${index}`"
                    class="tab-pane fade"
                    role="tabpanel"
                    :aria-labelledby="`documentation-tab-${index}`"
                  >
                    <span>Para mais informação sobre esse framework. Acesse a documentação:</span>
                    <a
                      :href="framework.documentationLink"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="btn btn-outline-primary w-100 mt-2 d-flex align-items-center justify-content-center"
                    >
                      Acessar Documentação
                      <i class="bx bx-link-external ms-2"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="filteredFrameworks.length > frameworksPerPage"
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
        <FrameworkModal
          :key="idFramework"
          :visible="showModal"
          :idFramework="idFramework"
          @close="onCloseFrameworkModal"
        >
        </FrameworkModal>
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
      currentPage: 1,
      idFramework: -1,
      frameworksPerPage: 6,
      frameworks: []
    }
  },
  computed: {
    ...mapGetters(['isSidebarOpen']),
    filteredFrameworks() {
      return this.frameworks.filter(
        (framework) =>
          framework.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          framework.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    },
    currentFrameworks() {
      const indexOfLastFramework = this.currentPage * this.frameworksPerPage
      const indexOfFirstFramework = indexOfLastFramework - this.frameworksPerPage
      return this.filteredFrameworks.slice(indexOfFirstFramework, indexOfLastFramework)
    },
    totalPages() {
      return Math.ceil(this.filteredFrameworks.length / this.frameworksPerPage)
    }
  },
  created() {
    SystemController.updateSystem()
    this.frameworks = SystemController.getStorage('frameworksStorage')
  },
  methods: {
    handlePrevPage() {
      this.currentPage = Math.max(this.currentPage - 1, 1)
    },
    handleNextPage() {
      this.currentPage = Math.min(this.currentPage + 1, this.totalPages)
    },
    handleDelete(index) {
      SystemController.deleteFramework(index)
    },
    onCloseFrameworkModal() {
      this.showModal = false
      this.frameworks = SystemController.getStorage('frameworksStorage')
      this.idFramework = -1
    },
    editFramework(index) {
      this.idFramework = index
      this.showModal = true
    }
  }
}
</script>

<style>
.object-contain {
  object-fit: contain;
}
</style>
