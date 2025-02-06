<script setup>
import Sidebar from '../components/Sidebar.vue'
import FrameworkModal from '../components/modals/FrameworkModal.vue'
</script>

<template>
  <div class="container-fluid d-flex p-0">
    <Sidebar />
    <div class="row w-100 m-0" :class="isSidebarOpen ? 'open-menu' : 'close-menu'">
      <!-- Título da Página -->
      <div class="col">
        <nav aria-label="breadcrumb" class="mt-3">
          <ol class="breadcrumb">
            <li class="breadcrumb-item active" aria-current="page" style="color: #e4e4e4">
              Framework
            </li>
          </ol>
        </nav>
        <div class="input-group my-5">
          <input
            v-model="searchTerm"
            type="text"
            class="form-control search py-4"
            placeholder="Type here..."
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
            <h5 class="card-title">Lista de Framework/Libs</h5>
            <button
              type="button"
              class="btn-system btn-adicionar me-2 d-flex align-items-center"
              @click="showModal = true"
            >
              <i class="bx bx-plus-circle me-1"></i>
              Adicionar
            </button>
          </div>
          <div v-if="frameworks.length === 0" class="card-body card-element py-0">
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
              </div>

              <div class="card-body card-element p-0 py-2 ps-1">
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
                <div
                  class="tab-content mt-3 px-3 d-flex align-items-center"
                  style="min-height: 100px"
                >
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
                  <pre
                    class="bg-code p-2 rounded d-flex align-items-center justify-content-between"
                    style="min-width: 310px;"
                  >
                    <code ref="codeText">{{ framework.installation }}</code>

                    <button
                      class="btn btn-copy d-flex align-items-center justify-content-center"
                      title="Copiar código"
                      @click="copyCode(framework.installation)"
                    >
                      <i class="bx bx-copy" style="font-size: 1.2rem;"></i>
                    </button>
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
                      class="btn-system btn-link w-100 mt-2 d-flex align-items-center justify-content-center"
                    >
                      Acessar Documentação
                      <i class="bx bx-link-external ms-2"></i>
                    </a>
                  </div>
                </div>
              </div>

              <!-- Card footer com os botões de editar e excluir -->
              <div class="card-footer d-flex justify-content-between">
                <button class="btn btn-editar me-2" @click="editFramework(index)">
                  <i class="bx bx-pencil"></i> Editar
                </button>
                <button class="btn btn-deletar" @click="handleDelete(index)">
                  <i class="bx bx-trash"></i> Excluir
                </button>
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
import notificationService from '@renderer/service/notificationService'

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
    copyCode(code) {
      navigator.clipboard.writeText(code) .then(() => {
        notificationService.success('Código copiado com sucesso!')
      })
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

<style scoped>
.object-contain {
  object-fit: contain;
}

/* Estilo do botão de copiar */
.btn-copy {
  background: transparent;
  width: 30px;
  height: 30px;
  border: none;
  color: #6c757d; /* Cor padrão do ícone */
  cursor: pointer;
  transition: color 0.3s;
  z-index: 10; /* Garantindo que o botão fique visível acima do conteúdo */
}


.btn-copy:hover {
  color: #007bff; /* Cor ao passar o mouse */
}

.btn-system {
  display: inline-block;
  padding: 0.65em 1.6em;
  margin: 0 0.3em 0.3em 0;
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

.btn-link {
  background-color: #a855f7;
  border: 2px solid #a855f7;
  border-radius: 5px;
  color: white;
}

.btn-link:hover {
  background-color: #9333ea;
  color: white;
}

@keyframes bn13bouncy {
  0% {
    top: 0em;
  }
  40% {
    top: 0em;
  }
  43% {
    top: -0.9em;
  }
  46% {
    top: 0em;
  }
  48% {
    top: -0.4em;
  }
  50% {
    top: 0em;
  }
  100% {
    top: 0em;
  }
}

.card-header,
.card-footer {
  background-color: #141414;
  color: white;
}

.search{
  font-family: 'Poppins', sans-serif;
  border-radius: 20px;
  border: none;
  height: 40px;
  background-color: #3D444D;
  color: white;
}

.search:focus{
  background-color: #3D444D;
  color: white;
}

.search::-webkit-input-placeholder{
  color: #B1B4B8;
}

.bg-code{
  background-color: #282A36;
  border: 2px solid #3D444D;
  position: relative;
  overflow: hidden;
}

.nav-tabs{
  border-bottom: 1px solid #3D444D;
}

/* Estilo geral para as abas */
.nav-tabs .nav-link {
  color: #5C707A;
  background-color: #1C2431;
  border: 1px solid #3D444D;
  border-radius: 0.30rem 0.30rem 0 0;
  margin-right: 5px; /* Espaçamento entre as abas */
  padding: 10px 15px; /* Espaçamento interno */
  transition: background-color 0.3s, color 0.3s; /* Transição suave nas alterações */
}

.nav-tabs .nav-link:hover {
  color: white;
  background-color: #374151;
}

/* Estilo para a aba ativa */
.nav-tabs .nav-link.active {
  color: white;
  background-color: #374151;
  border-color: #3D444D;
}
</style>
