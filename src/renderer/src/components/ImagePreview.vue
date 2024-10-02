<script setup>
import Sidebar from './Sidebar.vue'
import ImageModal from './ImageModal.vue'
</script>

<template>
  <div class="container-fluid d-flex p-0">
    <Sidebar />
    <div class="row w-100 m-0" :class="isSidebarOpen ? 'open-menu' : 'close-menu'">
      <nav aria-label="breadcrumb" class="mt-3">
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
      <div class="col">
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
              <h2 class="fs-2 fw-bold mb-4">{{ image.name }}</h2>
              <h3 class="fs-5 fw-bold">Image Specifications</h3>
              <div class="text-muted">
                <p><strong>Size:</strong> {{ image.width }} x {{ image.height }}</p>
                <p><strong>Format:</strong> {{ image.format }}</p>
                <p><strong>File Size:</strong> {{ image.size }}</p>
              </div>
            </div>
            <div class="mb-4">
              <h3 class="fs-5 fw-semibold">Description</h3>
              <p class="text-muted">{{ image.description }}</p>
            </div>
            <div class="d-flex gap-2">
              <a
                v-if="image.path"
                :href="image.path"
                target="_blank"
                class="btn btn-outline-primary"
              >
                <i class="bi bi-share"></i>
                Abrir Imagem
              </a>

              <button class="btn btn-outline-primary" @click="downloadImage(image)">
                <i class="bi bi-download"></i>
                Download
              </button>

              <!-- Botão para Editar -->
              <button class="btn btn-outline-warning" @click="editImage()">
                <i class="bi bi-pencil"></i>
                Editar
              </button>

              <!-- Botão para Excluir -->
              <button class="btn btn-outline-danger" @click="deleteImage(image)">
                <i class="bi bi-trash"></i>
                Excluir
              </button>
            </div>
            <ImageModal :visible="showModal" :image="image" @close="onCloseImageModal" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SystemController from '../controller/SystemController'
import notificationService from '../service/notificationService';
export default {
  data() {
    return {
      image: null,
      imageId: null,
      showModal: false
    }
  },
  computed: {
    ...mapGetters(['isSidebarOpen'])
  },
  created() {
    this.imageId = this.$route.params.id
    this.image = SystemController.getStorage('imagesStorage')[this.imageId]
  },
  methods: {
    getImageSrc(imagePath) {
      return new URL(imagePath, import.meta.url).href
    },
    async downloadImage() {
      let pathDefault = '/src/assets/images/'
      try {
        const imageFile = await this.createFileFromImageUrl(
          pathDefault + this.image.fileName,
          this.image.fileName
        )
        const imageBuffer = await this.readFileAsArrayBuffer(imageFile)
        SystemController.downloadImage(new Uint8Array(imageBuffer))
        notificationService.success('Imagem baixada com sucesso!')
      } catch (error) {
        console.log(error)
      }
    },
    editImage() {
      this.showModal = true
    },
    deleteImage(image) {
      SystemController.deleteImage(image)
      this.$router.push({ name: 'gallery' })
    },
    onCloseImageModal() {
      this.showModal = false
      this.image = SystemController.getStorage('imagesStorage')[this.imageId]
    },
    readFileAsArrayBuffer(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsArrayBuffer(file)
      })
    },
    async createFileFromImageUrl(imageUrl, fileName) {
      // Faz uma solicitação para obter os dados da imagem
      const response = await fetch(imageUrl)

      // Verifica se a resposta foi bem-sucedida
      if (!response.ok) {
        throw new Error('Falha ao carregar a imagem')
      }

      const contentType = response.headers.get('Content-Type')
      if (!contentType.startsWith('image/')) {
        throw new Error('A URL não aponta para uma imagem')
      }

      // Converte a resposta em um Blob
      const imageBlob = await response.blob()

      // Cria um novo objeto File a partir do Blob
      const imageFile = new File([imageBlob], fileName, { type: imageBlob.type })

      return imageFile
    }
  }
}
</script>
