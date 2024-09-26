<script setup>
import Sidebar from '../components/Sidebar.vue'
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
        <div class="card w-100 max-w-4xl">
          <div class="card-header">
            <h5 class="card-title text-center text-2xl font-bold mb-4">
              Galeria de Paletas de Cores
            </h5>
            <!-- Barra de Pesquisa -->
            <div class="input-group mb-3">
              <input
                type="text"
                class="form-control"
                placeholder="Pesquisar paletas..."
                v-model="searchQuery"
              />
              <button class="btn btn-outline-secondary" type="button" @click="clearSearch">
                Limpar
              </button>
            </div>
          </div>
          <div class="card-body">
            <div class="row g-4 mb-4">
              <div v-if="filteredPalettes.length === 0" class="text-center">
                <p>Nenhuma paleta encontrada.</p>
              </div>
              <div v-for="(palette, index) in displayedPalettes" :key="index" class="col-md-6">
                <ColorPalette
                  :colors="palette.colors"
                  :title="palette.title"
                  :description="palette.description"
                />
              </div>
            </div>
          </div>
          <div class="card-footer d-flex justify-content-between">
            <button class="btn btn-outline-primary" @click="prevPage" :disabled="currentPage === 1">
              <i class="bi bi-chevron-left me-2"></i> Anterior
            </button>
            <span>Página {{ currentPage }} de {{ totalPages }}</span>
            <button
              class="btn btn-outline-primary"
              @click="nextPage"
              :disabled="currentPage === totalPages"
            >
              Próxima <i class="bi bi-chevron-right ms-2"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ColorPalette from '../components/ColorPalette.vue'

function generateRandomPalette() {
  const numberOfColors = Math.floor(Math.random() * 5) + 1

  return Array(numberOfColors)
    .fill(null)
    .map(
      () =>
        '#' +
        Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, '0')
    )
}

const allPalettes = Array(50)
  .fill(null)
  .map((_, index) => ({
    colors: generateRandomPalette(),
    title: `Paleta ${index + 1}`,
    description: `Uma bela combinação de cores para inspirar seu próximo projeto.`
  }))

const PALETTES_PER_PAGE = 6

export default {
  components: {
    ColorPalette
  },
  data() {
    return {
      currentPage: 1,
      allPalettes,
      searchQuery: ''
    }
  },
  computed: {
    ...mapGetters(['isSidebarOpen']),
    totalPages() {
      return Math.ceil(this.filteredPalettes.length / PALETTES_PER_PAGE)
    },
    filteredPalettes() {
      // Filtra as paletas com base na pesquisa por título ou descrição
      return this.allPalettes.filter(
        (palette) =>
          palette.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          palette.description.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    },
    displayedPalettes() {
      const startIndex = (this.currentPage - 1) * PALETTES_PER_PAGE
      return this.filteredPalettes.slice(startIndex, startIndex + PALETTES_PER_PAGE)
    }
  },
  methods: {
    prevPage() {
      this.currentPage = Math.max(this.currentPage - 1, 1)
    },
    nextPage() {
      this.currentPage = Math.min(this.currentPage + 1, this.totalPages)
    },
    clearSearch() {
      this.searchQuery = ''
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
