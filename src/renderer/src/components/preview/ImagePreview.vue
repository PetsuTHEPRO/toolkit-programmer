<script setup>
import Sidebar from '../Sidebar.vue'
import ImageModal from '../modals/ImageModal.vue'
</script>

<template>
  <div class="container-fluid d-flex p-0" :class="themeMode === 'dark' ? 'dark-theme' : 'light-theme'">
    <Sidebar />
    <div class="row w-100 m-0" :class="isSidebarOpen ? 'open-menu' : 'close-menu'">
      <nav aria-label="breadcrumb" class="mt-3">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <router-link :to="{ name: 'image' }" class="breadcrumb-link"> Imagens </router-link>
          </li>
          <li class="breadcrumb-item">
            <router-link :to="{ name: 'gallery' }" class="breadcrumb-link"> Galeria </router-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">{{ image.name }}</li>
        </ol>
      </nav>
      <div class="col">
        <div class="row g-4">
          <!-- Imagem -->
          <div class="col-md-6 d-flex align-items-center justify-content-center">
            <div class="thumbnail-container">
              <img
              :src="image.base64 || '../assets/images/no-image.png'"
              class="img-fluid rounded-3 object-fit-cover"
              :alt="image.fileName"
              style="aspect-ratio: 800/600"
              />
            </div>
          </div>

          <!-- Detalhes da Imagem -->
          <div class="col-md-6">
            <div class="mb-4">
              <h2 class="fs-2 fw-bold mb-4">{{ image.name }}</h2>
              <h3 class="fs-5 fw-bold">Image Specifications</h3>
              <div>
                <p><strong>Size:</strong> {{ image.width }} x {{ image.height }}</p>
                <p><strong>Format:</strong> {{ image.format }}</p>
                <p><strong>File Size:</strong> {{ image.size }}</p>
              </div>
            </div>
            <div class="mb-4">
              <h3 class="fs-5 fw-semibold">Description</h3>
              <p>{{ image.description }}</p>
            </div>
            <div class="d-flex align-items-center justify-content-between">
              <a
                v-if="image.path"
                :href="image.path"
                target="_blank"
                class="btn-system btn-link d-flex align-items-center"
              >
                <i class="bx bx-share me-2"></i>
                Abrir Imagem
              </a>

              <button
                class="btn-system btn-copy d-flex align-items-center"
                @click="downloadImage(image)"
              >
                <i class="bx bx-download me-2"></i>
                Download
              </button>

              <!-- Botão para Editar -->
              <button class="btn-system btn-editar d-flex align-items-center" @click="editImage()">
                <i class="bx bx-edit me-2"></i>
                Editar
              </button>

              <!-- Botão para Excluir -->
              <button
                class="btn-system btn-deletar d-flex align-items-center"
                @click="deleteImage(image)"
              >
                <i class="bx bx-trash me-2"></i>
                Excluir
              </button>
            </div>
            <ImageModal :visible="showModal" :imageId="imageId" :image="image" @close="onCloseImageModal" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SystemController from '../../controller/SystemController'
import notificationService from '../../service/notificationService'
import { getTheme } from '../../service/userPreferences'

export default {
  data() {
    return {
      image: null,
      imageId: null,
      showModal: false,
      themeMode: getTheme()
    }
  },
  computed: {
    ...mapGetters(['isSidebarOpen'])
  },
  created() {
    this.imageId = Number(this.$route.params.id)
    this.image = SystemController.getStorage('imagesStorage')[this.imageId]
  },
  methods: {
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
<style scoped>
@import url('../../assets/base.css');

.thumbnail-container {
  background: repeating-conic-gradient(#e5e7eb 0% 25%, #d1d5db 0% 50%) 50% / 20px 20px;
  padding: 4px;
  border-radius: 4px;
  display: inline-block;
}

.container-fluid {
  background-color: var(--container-bg);
  color: var(--container-color);
}

.breadcrumb-item,
.breadcrumb-item::before {
  color: var(--breadcrumb-color);
}

.breadcrumb-link {
  color: #1e90ff;
}

.btn-system {
  display: inline-block;
  margin: 0 0.3em 0.3em 0;
  box-sizing: border-box;
  text-decoration: none;
  font-family: 'Roboto', sans-serif;
  font-weight: 300;
  text-align: center;
  position: relative;
  cursor: pointer;
}

.btn-editar {
  background-color: #3b82f6;
  border: 2px solid #3b82f6;
  padding: 0.65em 0.9em;
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
  padding: 0.65em 1em;
  border-radius: 5px;
  color: white;
}

.btn-deletar:hover {
  background-color: #dc2626;
}

.btn-link {
  background-color: #a855f7;
  border: 2px solid #a855f7;
  padding: 0.65em 1em;
  border-radius: 5px;
  color: white;
}

.btn-link:hover {
  background-color: #9333ea;
  color: white;
}

.btn-copy {
  background-color: #6366f1;
  border: 2px solid #6366f1;
  padding: 0.65em 1.2em;
  border-radius: 5px;
  color: white;
}

.btn-copy:hover {
  background-color: #4f46e5;
}
</style>
