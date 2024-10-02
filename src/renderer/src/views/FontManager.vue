<script setup>
import Sidebar from '@renderer/components/Sidebar.vue'
import FontModal from '@renderer/components/FontModal.vue'
</script>

<template>
  <div class="container-fluid d-flex p-0">
    <Sidebar />
    <div class="row w-100 m-0" :class="isSidebarOpen ? 'open-menu' : 'close-menu'">
      <div class="col">
        <nav aria-label="breadcrumb" class="mt-3">
          <ol class="breadcrumb">
            <li class="breadcrumb-item active" aria-current="page">Fonte</li>
          </ol>
        </nav>

        <div class="card my-5">
          <div class="card-header">
            <h5 class="card-title">Pesquisar Fontes</h5>
          </div>
          <div class="card-body">
            <div class="input-group">
              <input
                v-model="searchTerm"
                type="text"
                class="form-control"
                placeholder="Digite o nome ou family da Fonte"
                @input="handleSearch"
              />
              <button class="btn btn-outline-secondary" type="button">
                <i class="bx bx-search"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="card mb-5">
          <div class="card-header d-flex align-items-center justify-content-between">
            <h5 class="card-title">Lista de Fontes</h5>
            <button
              type="button"
              class="btn btn-outline-primary me-2 d-flex align-items-center"
              @click="showModal = true"
            >
              <i class="bx bx-plus-circle me-1"></i>
              Adicionar
            </button>
          </div>
          <div class="card-body py-0">
            <div class="overflow-auto" style="max-height: 400px">
              <ul class="list-unstyled">
                <li v-if="currentItems.length === 0" class="text-center text-gray mt-3">
                  Nenhuma fonte encontrada.
                </li>
                <li
                  v-for="(item, index) in currentItems"
                  :key="item.id"
                  class="border-bottom pb-4 mt-4 d-flex"
                >
                  <div class="row w-100 m-0">
                    <!-- Thumbnail -->
                    <div class="col-2">
                      <img
                        :src="getImageSrc(item.path)"
                        alt="Thumbnail"
                        class="img-thumbnail me-3"
                        style="width: 150px; height: 150px"
                      />
                    </div>
                    <div class="col-10">
                      <h3 class="h6 font-semibold mt-2">{{ item.name }}</h3>
                      <p class="text-muted mt-1 my-0">font-family: {{ item.family }}</p>
                      <p v-if="item.uploadType === 'import'" class="text-muted my-0 break-text">
                        {{ item.url }}
                      </p>
                      <div class="buttons mt-2">
                        <a
                          v-if="item.uploadType === 'link'"
                          :href="item.url"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="btn btn-primary me-2"
                        >
                          Open Link
                        </a>

                        <!-- Botão para copiar o conteúdo da variável item.url, mostrado se uploadType for 'import' -->
                        <button
                          v-else
                          class="btn btn-success me-2"
                          @click="copyToClipboard(item.url)"
                        >
                          Copy Import
                        </button>
                        <button class="btn btn-warning me-2" @click="editFont(index)">
                          Editar
                          <i class="bx bx-box-arrow-up-right"></i>
                        </button>
                        <a class="btn btn-danger" @click="handleDelete(index)">
                          Delete
                          <i class="bx bx-box-arrow-up-right"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div v-if="items.length > 0" class="d-flex justify-content-between my-2">
              <button
                class="btn btn-outline-secondary btn-sm"
                :disabled="currentPage === 1"
                @click="handlePrevPage"
              >
                <i class="bx bx-chevron-left"></i> Anterior
              </button>
              <span class="text-sm font-medium">
                Página {{ currentPage }} de {{ totalPages }}
              </span>
              <button
                class="btn btn-outline-secondary btn-sm"
                :disabled="currentPage === totalPages"
                @click="handleNextPage"
              >
                Próxima <i class="bx bx-chevron-right"></i>
              </button>
            </div>
            <!-- Modal -->
            <FontModal
              :key="idFont"
              :fontId="idFont"
              :visible="showModal"
              @close="onCloseFontModal"
            >
            </FontModal>
          </div>
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
      items: [],
      idFont: -1,
      searchTerm: '',
      currentPage: 1,
      itemsPerPage: 5
    }
  },
  computed: {
    ...mapGetters(['isSidebarOpen']),
    filteredItems() {
      return this.items.filter(
        (item) =>
          item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          item.family.toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    },
    currentItems() {
      const indexOfLastItem = this.currentPage * this.itemsPerPage
      const indexOfFirstItem = indexOfLastItem - this.itemsPerPage
      return this.filteredItems.slice(indexOfFirstItem, indexOfLastItem)
    },
    totalPages() {
      return Math.ceil(this.filteredItems.length / this.itemsPerPage)
    }
  },
  created() {
    SystemController.updateSystem()
    this.items = SystemController.getStorage('fontsStorage')
  },
  methods: {
    getImageSrc(imagePath) {
      return new URL(imagePath, import.meta.url).href
    },
    onCloseFontModal() {
      this.showModal = false
      this.fonts = SystemController.getStorage('fontsStorage')
      this.idFont = -1
    },
    editFont(index) {
      this.idFont = index
      this.showModal = true
    },
    handleSearch() {
      this.currentPage = 1 // Reset to first page on new search
    },
    handlePrevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
      }
    },
    handleNextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
      }
    },
    handleDelete(index) {
      SystemController.deleteFont(index)
    },
    copyToClipboard(text) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          alert('Conteúdo copiado com sucesso!')
        })
        .catch((err) => {
          console.error('Erro ao copiar:', err)
        })
    }
  }
}
</script>

<style>
.text-gray {
  color: #6b7280;
}

.break-text {
  width: 800px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
