<script setup>
import Sidebar from '../components/Sidebar.vue'
import FrameworkModal from '../components/modals/FrameworkModal.vue'
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
              {{ $t('sidebar.developers.framework') }}
            </li>
          </ol>
        </nav>
        <div class="input-group my-5">
          <input
            v-model="searchTerm"
            type="text"
            class="form-control search py-4"
            :placeholder="$t('search', { name: $t('sidebar.developers.framework').toLowerCase() })"
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
            <h5 class="card-title">{{ $t('pages.frameworks.list') }}</h5>
            <button
              type="button"
              class="btn-system btn-adicionar me-2 d-flex align-items-center"
              @click="openAddModal"
            >
              <i class="bx bx-plus-circle me-1"></i>
              {{ $t('buttons.upload') }}
            </button>
          </div>
          <div v-if="frameworks.length === 0" class="card-body card-element py-0">
            <div class="overflow-auto" style="max-height: 400px">
              <ul class="list-unstyled">
                <li class="text-center text-gray mt-3">
                  {{
                    $t('messages.he-empty', {
                      name: $t('sidebar.developers.framework').toLowerCase()
                    })
                  }}
                </li>
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
                    {{ $t('buttons.description') }}
                    <i class="bx bx-info-circle" style="font-size: 0.9rem"></i>
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
                    {{ $t('buttons.installation') }}
                    <i class="bx bx-download" style="font-size: 0.9rem"></i>
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
                      style="min-width: 310px"
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
                <button class="btn btn-editar me-2" @click="editFramework(framework.id)">
                  <i class="bx bx-pencil"></i> {{ $t('buttons.edit') }}
                </button>
                <button class="btn btn-deletar" @click="handleDelete(framework.id)">
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
        <FrameworkModal
          :key="idFramework"
          :idFramework="idFramework"
          :visible="showModal"
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
import { getTheme } from '../service/userPreferences'
import Framework from '../model/entity/framework'

export default {
  data() {
    return {
      showModal: false,
      searchTerm: '',
      currentPage: 1,
      idFramework: -1,
      frameworksPerPage: 9,
      themeMode: getTheme()
    }
  },
  computed: {
    ...mapGetters(['isSidebarOpen']),
    frameworks() {
      const storedFrameworks = this.$store.getters.getStorage('frameworksStorage') || []
      return storedFrameworks.map(
        (v) => new Framework(v.id, v.name, v.description, v.installation, v.documentationLink)
      )
    },
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
      let totalPages = Math.ceil(this.filteredFrameworks.length / this.frameworksPerPage)
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
    copyCode(code) {
      navigator.clipboard.writeText(code).then(() => {
        notificationService.success('Código copiado com sucesso!')
      })
    },
    // 3. MÉTODOS DE AÇÃO SIMPLIFICADOS
    handleDelete(frameworkId) {
      SystemController.deleteFramework(frameworkId)
      // A linha 'this.loadFrameworks()' foi REMOVIDA.
    },
    onCloseFrameworkModal() {
      this.showModal = false
      this.idFramework = -1
      // A linha 'this.loadFrameworks()' foi REMOVIDA.
    },
    // Lógica corrigida para abrir o modal
    openAddModal() {
      this.idFramework = -1
      this.showModal = true
    },
    editFramework(index) {
      const frameworkToEdit = this.currentFrameworks

      for (const framework of frameworkToEdit) {
        if (framework.id === index) {
          this.idFramework = framework.id
        }
      }

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
  background-color: var(--card-header);
  color: var(--card-header-color);
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

.bg-code {
  background-color: var(--code-background);
  border: 2px solid var(--code-border);
  position: relative;
  overflow: hidden;
}

.nav-tabs {
  border-bottom: 1px solid var(--tabs-background-active);
}

/* Estilo geral para as abas */
.nav-tabs .nav-link {
  color: var(--tabs-color);
  background-color: var(--tabs-background);
  border: 1px solid var(--tabs-background-active);
  cursor: pointer;
  border-radius: 0.3rem 0.3rem 0 0;
  margin-right: 3px; /* Espaçamento entre as abas */
  padding: 10px 10px; /* Espaçamento interno */
  transition:
    background-color 0.3s,
    color 0.3s; /* Transição suave nas alterações */
}

.nav-tabs .nav-link:hover {
  color: var(--tabs-color-active);
  background-color: var(--tabs-background-active);
}

/* Estilo para a aba ativa */
.nav-tabs .nav-link.active {
  color: var(--tabs-color-active);
  cursor: default;
  background-color: var(--tabs-background-active);
  border-color: var(--tabs-background-active);
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
</style>
