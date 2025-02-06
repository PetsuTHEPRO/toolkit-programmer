<script setup>
import Sidebar from '../../components/Sidebar.vue'
</script>

<template>
  <div class="container-fluid d-flex p-0">
    <Sidebar />
    <div class="row w-100 m-0" :class="isSidebarOpen ? 'open-menu' : 'close-menu'">
      <div class="col">
      <nav aria-label="breadcrumb" class="my-3">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
              <router-link :to="{ name: 'image' }" class="breadcrumb-link">Imagens</router-link>
            </li>
            <li class="breadcrumb-item active" aria-current="page">Galeria</li>
          </ol>
        </nav>
        
        <!-- Search Bar -->
        <div class="input-group my-5">
          <input
            v-model="searchTerm"
            type="text"
            class="form-control search py-4"
            placeholder="Type here..."
            @input="handleSearch"
          />
          <button class="btn btn-outline-secondary search d-flex align-items-center p-4" style="background-color: #727DDC; color: white;" type="button">
            <i class="bx bx-search fs-4" style="font-weight: bold"></i>
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
            class="btn btn-control d-flex align-items-center"
            :disabled="currentPage === 1"
            @click="handlePrevPage"
          >
          <i class="bx bx-chevron-left fs-5"></i>
            Anterior
          </button>
          <span class="text-white">Página {{ currentPage }} de {{ totalPages }}</span>
          <button
            class="btn btn-control d-flex align-items-center"
            :disabled="currentPage === totalPages"
            @click="handleNextPage"
          >
            Próxima
            <i class="bx bx-chevron-right fs-5"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
    ...mapGetters(['isSidebarOpen']),
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
      let totalPages = Math.ceil(this.filteredImages.length / this.imagesPerPage)
      return totalPages === 0 ? 1 : totalPages
    }
  },
  created() {
    this.images = SystemController.getStorage('imagesStorage')
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

.btn-control {
  background-color: rgba(0, 0, 0, 0);
  border-radius: 25px;
  border: 2px solid #ffffff;
  color: #ffffff;
  transition: all 0.2s;
  animation: bn13bouncy 5s infinite linear;
}

.btn-control:hover {
  background-color: #ffffff;
  color: #000000;
}

.card-img-top:hover {
  transform: scale(1.05);
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

.breadcrumb-link {
  color: #1e90ff;
}

.breadcrumb-item::before {
  color: #e4e4e4;
}

.breadcrumb-item.active {
  color: #e4e4e4;
}
</style>
