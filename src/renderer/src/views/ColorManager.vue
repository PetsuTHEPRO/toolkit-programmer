<template>
  <div
    class="container mx-auto p-4 d-flex justify-content-center align-items-center min-vh-100 bg-light"
  >
    <div class="card w-100 max-w-4xl">
      <div class="card-header">
        <h5 class="card-title text-center text-2xl font-bold mb-4">Galeria de Paletas de Cores</h5>
      </div>
      <div class="card-body">
        <div class="row g-4 mb-4">
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
</template>

<script>
import ColorPalette from '../components/ColorPalette.vue'

function generateRandomPalette() {
  return Array(5)
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
      allPalettes
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.allPalettes.length / PALETTES_PER_PAGE)
    },
    displayedPalettes() {
      const startIndex = (this.currentPage - 1) * PALETTES_PER_PAGE
      return this.allPalettes.slice(startIndex, startIndex + PALETTES_PER_PAGE)
    }
  },
  methods: {
    prevPage() {
      this.currentPage = Math.max(this.currentPage - 1, 1)
    },
    nextPage() {
      this.currentPage = Math.min(this.currentPage + 1, this.totalPages)
    }
  }
}
</script>

<style scoped>
.min-vh-100 {
  min-height: 100vh;
}
.max-w-4xl {
  max-width: 56rem;
}
</style>
