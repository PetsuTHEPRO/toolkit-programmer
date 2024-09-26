<script setup>
import Sidebar from '../../components/Sidebar.vue'
</script>

<template>
  <div class="container-fluid d-flex flex-column p-0">
    <div class="row w-100 m-0">
      <Sidebar />
      <div class="col">
      <nav aria-label="breadcrumb" class="my-3">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
              <router-link :to="{ name: 'image' }">Imagens</router-link>
            </li>
            <li class="breadcrumb-item active" aria-current="page">Galeria</li>
          </ol>
        </nav>
        
        <!-- Search Bar -->
        <div class="input-group mb-4">
          <input
            type="text"
            class="form-control"
            placeholder="Pesquisar imagens..."
            v-model="searchTerm"
          />
          <button class="btn btn-outline-secondary" type="button">
            <i class="bx bx-search"></i>
          </button>
        </div>

        <!-- Image Gallery Grid -->
        <div class="row g-4">
          <div
            class="col-sm-6 col-md-4 col-lg-3"
            v-for="(image, index) in filteredImages"
            :key="image.id"
          >
            <div class="card h-100">
              <img
                :src="getImageSrc(image.path)"
                :alt="image.fileName"
                class="card-img-top"
                style="height: 200px; object-fit: cover"
                @click="handleOpenImage(index)"
              />
              <div class="card-body">
                <p class="card-text">{{ image.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="mt-4 d-flex justify-content-between align-items-center">
          <button
            class="btn btn-outline-primary"
            :disabled="currentPage === 1"
            @click="handlePrevPage"
          >
            <i class="bi bi-chevron-left me-2"></i>
            Anterior
          </button>
          <span>Página {{ currentPage }} de {{ totalPages }}</span>
          <button
            class="btn btn-outline-primary"
            :disabled="currentPage === totalPages"
            @click="handleNextPage"
          >
            Próxima
            <i class="bi bi-chevron-right ms-2"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SystemController from '../../controller/SystemController'
export default {
  data() {
    return {
      images: [],
      searchTerm: '',
      currentPage: 1,
      imagesPerPage: 12
    }
  },
  computed: {
    // Imagens filtradas de acordo com o termo de busca
    filteredImages() {
      return this.images.filter(
        (item) =>
          item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    },
    currentItems() {
      const indexOfLastItem = this.currentPage * this.imagesPerPage
      const indexOfFirstItem = indexOfLastItem - this.imagesPerPage
      return this.filteredImages.slice(indexOfFirstItem, indexOfLastItem)
    },
    totalPages() {
      return Math.ceil(this.filteredImages.length / this.imagesPerPage)
    }
  },
  created() {
    this.images = SystemController.getImageStorage()
  },
  methods: {
    getImageSrc(imagePath) {
      return new URL('../' + imagePath, import.meta.url).href
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
    handleOpenImage(index) {
      console.log('entrou, la ele', index)
      this.$router.push({ name: 'preview', params: { id: index } })
    }
  }
}
</script>

<style scoped>
/* Opcional: estilos customizados */
.card-img-top {
  transition: transform 0.3s;
}

.card-text {
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Limita para 2 linhas */
  -webkit-box-orient: vertical;
  height: 50px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-img-top:hover {
  transform: scale(1.05);
}
</style>
