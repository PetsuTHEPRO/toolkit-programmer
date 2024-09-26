<script setup>
import Sidebar from '../components/Sidebar.vue'
import ColorModal from '../components/ColorModal.vue'
</script>

<template>
  <div class="container-fluid d-flex p-0">
    <Sidebar />
    <div class="row w-100 m-0" :class="isSidebarOpen ? 'open-menu' : 'close-menu'">
      <nav aria-label="breadcrumb" class="my-3">
        <ol class="breadcrumb">
          <li class="breadcrumb-item active" aria-current="page">Color Palette</li>
        </ol>
      </nav>
      <div class="col d-flex align-items-center justify-content-center">
        <div class="card w-100">
          <div class="card-header">
            <h5 class="card-title text-center font-bold mb-4">Galeria de Paletas de Cores</h5>
            <!-- Barra de Pesquisa -->
            <div class="input-group mb-3">
              <input
                v-model="searchTerm"
                type="text"
                class="form-control"
                placeholder="Pesquisar paletas..."
                @input="handleSearch"
              />
              <button class="btn btn-outline-secondary" type="button" @click="clearSearch">
                Limpar
              </button>
            </div>
          </div>
          <div class="card-body">
            <div class="row g-4">
              <div class="w-100 d-flex justify-content-end">
                <button
                  type="button"
                  class="btn btn-outline-primary me-2 d-flex align-items-center"
                  @click="showModal = true"
                >
                  Add Palette
                </button>
              </div>
              <div v-if="palettes.length === 0" class="text-center">
                <p>Nenhuma paleta encontrada.</p>
              </div>
              <div v-for="(palette, index) in palettes" :key="index" class="col-md-4">
                <ColorPalette
                  :colors="palette.colors"
                  :title="palette.name"
                  :description="palette.description"
                />
              </div>
            </div>
          </div>
          <div class="card-footer d-flex justify-content-between">
            <button class="btn btn-outline-primary" :disabled="currentPage === 1" @click="prevPage" >
              <i class="bi bi-chevron-left me-2"></i> Anterior
            </button>
            <span>Página {{ currentPage }} de {{ totalPages }}</span>
            <button
              class="btn btn-outline-primary"
              :disabled="currentPage === totalPages"
              @click="nextPage"
            >
              Próxima <i class="bi bi-chevron-right ms-2"></i>
            </button>
          </div>
          <ColorModal :visible="showModal" @close="showModal = false"></ColorModal>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ColorPalette from '../components/ColorPalette.vue'
import SystemController from '../controller/SystemController'

export default {
  components: {
    ColorPalette
  },
  data() {
    return {
      showModal: false,
      palettes: [],
      currentPage: 1,
      itemsPerPage: 9,
      searchTerm: ''
    }
  },
  computed: {
    ...mapGetters(['isSidebarOpen']),
    filteredItems() {
      return this.palettes.filter(
        (item) =>
          item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    },
    currentItems() {
      const indexOfLastItem = this.currentPage * this.itemsPerPage
      const indexOfFirstItem = indexOfLastItem - this.itemsPerPage
      return this.filteredItems.slice(indexOfFirstItem, indexOfLastItem)
    },
    totalPages() {
      let totalPages = Math.ceil(this.filteredItems.length / this.itemsPerPage)
      return totalPages === 0 ? 1 : totalPages
    }
  },
  created() {
    this.palettes = SystemController.getPaletteStorage()
  },
  methods: {
    handleSearch() {
      this.currentPage = 1 // Reset to first page on new search
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
      }
    },
    clearSearch() {
      this.searchTerm = ''
    }
  }
}
</script>

<style>
.min-vh-100 {
  min-height: 100vh;
}
.max-w-4xl {
  max-width: 56rem;
}
</style>
