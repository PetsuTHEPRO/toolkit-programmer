<template>
  <main class="flex-1 overflow-auto mt-5">
    <section class="py-8">
      <div class="container px-4 md:px-6">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <router-link :to="{ name: 'image' }"> Imagens </router-link>
            </li>
            <li class="breadcrumb-item">
              <router-link :to="{ name: 'gallery' }"> Galeria </router-link>
            </li>
            <li class="breadcrumb-item active" aria-current="page">{{ image.name }}</li>
          </ol>
        </nav>

        <div class="row g-4">
          <!-- Imagem -->
          <div class="col-md-6">
            <img
              :src="getImageSrc(image.path) || '../assets/images/no-image.png'"
              class="img-fluid rounded-3 object-fit-cover"
              :alt="image.fileName"
              style="aspect-ratio: 800/600"
            />
          </div>

          <!-- Detalhes da Imagem -->
          <div class="col-md-6">
            <div class="mb-4">
              <h2 class="fs-2 fw-bold">{{ image.name }}</h2>
              <h3 class="fs-5 fw-bold">Image Specifications</h3>
              <div class="text-muted">
                <p><strong>Size:</strong> {{ image.width }} x {{ image.height }}</p>
                <p><strong>Format:</strong> {{ image.format }}</p>
                <p><strong>File Size:</strong> {{ image.size }} Teste</p>
              </div>
            </div>
            <div class="mb-4">
              <h3 class="fs-5 fw-semibold">Description</h3>
              <p class="text-muted">{{ image.description }}</p>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-outline-primary">
                <i class="bi bi-download"></i>
                Download
              </button>

              <a v-if="image.path" :href="image.path" target="_blank" class="btn btn-outline-primary">
                <i class="bi bi-share"></i>
                Abrir Imagem
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import SystemController from '../controller/SystemController'
export default {
  data() {
    return {
      image: null,
    }
  },
  created() {
    const imageId = this.$route.params.id
    this.image = SystemController.getImageStorage()[imageId]
  },
  methods: {
    getImageSrc(imagePath) {
      return new URL(imagePath, import.meta.url).href
    }
  }
}
</script>

<style scoped>
/* Adicione seus estilos personalizados aqui, se necessário */
</style>
