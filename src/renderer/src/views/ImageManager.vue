<script setup>
import Sidebar from '@renderer/components/Sidebar.vue'
import Modal from '@renderer/components/ImageModal.vue'
import ModalIcon from '@renderer/components/IconModal.vue'
</script>

<template>
  <div class="container-fluid d-flex p-0">
    <Sidebar />
    <div class="row w-100 m-0">
      <div class="col">
        <!-- Título da Página -->
        <nav aria-label="breadcrumb" class="mt-3">
          <ol class="breadcrumb">
            <li class="breadcrumb-item active" aria-current="page">Imagens</li>
          </ol>
        </nav>

        <div class="card mb-5">
          <div class="card-header d-flex align-items-center justify-content-between">
            <h5 class="card-title">Imagens Recentes</h5>
            <div class="d-flex">
              <button
                type="button"
                class="btn btn-outline-primary me-2 d-flex align-items-center"
                @click="showModal[0] = true"
              >
                <i class="bx bx-upload me-1"></i>
                Upload
              </button>

              <router-link
                :to="{ name: 'gallery' }"
                class="btn btn-outline-primary d-flex align-items-center"
              >
                <i class="bx bx-plus-circle me-1"></i>
                Ver mais
              </router-link>
            </div>
          </div>

          <div class="card-body py-0">
            <div class="overflow-auto" style="max-height: 400px">
              <!-- Grid de Cards de Imagens -->
              <div v-if="images.length === 0" class="text-center text-gray my-3">
                Nenhuma imagem encontrada.
              </div>
              <div class="row m-0">
                <div v-for="image in images" :key="image.id" class="col-md-4 mt-3">
                  <div class="card mb-4 shadow-sm">
                    <img
                      :src="getImageSrc(image.path)"
                      class="card-img-top"
                      :alt="image.fileName"
                    />
                    <div class="card-body">
                      <p class="card-text">{{ image.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-between align-items-center mb-3">
          <h2>Icons</h2>
          <div class="d-flex">
            <button
              type="button"
              class="btn btn-outline-primary me-2 d-flex align-items-center"
              @click="showModal[1] = true"
            >
              <i class="bx bx-upload me-1"></i>
              Upload
            </button>
            <button type="button" class="btn btn-outline-primary d-flex align-items-center">
              <i class="bx bx-plus-circle me-1"></i>
              Ver mais
            </button>
          </div>
        </div>

        <!-- Grid de Cards de Imagens -->

        <div class="container py-4">
          <div class="row g-3">
            <!-- Repetindo os ícones dinamicamente -->
            <div
              v-for="(icon, index) in icons"
              :key="index"
              class="col-12 d-flex align-items-center gap-4"
            >
              <div
                class="d-flex align-items-center justify-content-center rounded-lg bg-primary text-primary-foreground"
                style="width: 48px; height: 48px"
              >
                <!-- Renderizando o ícone dinamicamente -->
              </div>
              <div class="text-sm font-medium">{{ icon.name }}</div>
              <div class="text-muted">{{ icon.framework }}</div>
              <code class="text-muted">&lt;i :class="{{ icon.class }}"&gt;&lt;/i&gt;</code>
              <a :href="icon.link" class="text-decoration-none">Ver no {{ icon.framework }}</a>
            </div>

            <!-- Modal Component -->
            <Modal :visible="showModal[0]" @close="onCloseImageModal">
              <template #title>Adicionar Imagem</template>
            </Modal>

            <!-- Modal Component -->
            <ModalIcon :visible="showModal[1]" @close="showModal[1] = false">
              <template #title>Adicionar Icone</template>
            </ModalIcon>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SystemController from '../controller/SystemController'
export default {
  name: 'ImageManager',
  data() {
    return {
      showModal: [false, false],
      images: [],
      // Lista de ícones com suas CDNs e dados
      icons: [
        {
          name: 'Smile Icon',
          framework: 'Boxicons',
          class: 'bx bx-smile',
          link: 'https://boxicons.com/',
          cdn: 'https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css'
        },
        {
          name: 'Heart Icon',
          framework: 'Bootstrap Icons',
          class: 'bi bi-tencent-qq',
          link: 'https://icons.getbootstrap.com/',
          cdn: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css'
        }
      ]
    }
  },
  created() {
    SystemController.updateSystem()
    this.updateRecentImages()
  },
  methods: {
    getImageSrc(imagePath) {
      return new URL(imagePath, import.meta.url).href
    },
    updateRecentImages() {
      let imagesDefault = SystemController.getImageStorage()
      if (imagesDefault.length > 0) {
        this.images = imagesDefault.slice(-3)
      }
    },
    onCloseImageModal() {
      this.showModal[0] = false
      this.updateRecentImages()
    }
  }
}
</script>

<style scoped>
.card {
  border-radius: 8px;
  overflow: hidden;
}

.card-text {
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Limita para 2 linhas */
  -webkit-box-orient: vertical;
  height: 50px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-img-top {
  object-fit: cover;
  max-height: 200px;
}

.bg-primary {
  background-color: #18181b !important;
  color: white;
}
</style>
