<script setup>
import Sidebar from '@renderer/components/Sidebar.vue'
import Modal from '@renderer/components/ImageModal.vue'
import ModalIcon from '@renderer/components/IconModal.vue'
</script>

<template>
  <div class="container-fluid d-flex p-0">
    <Sidebar />
    <div class="row w-100 m-0" :class="isSidebarOpen ? 'open-menu' : 'close-menu'">
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

        <!-- Card dos Icones -->
        <div class="card mb-5">
          <div class="card-header d-flex align-items-center justify-content-between">
            <h5 class="card-title">Icones Recentes</h5>
            <div class="d-flex">
              <button
                type="button"
                class="btn btn-outline-primary me-2 d-flex align-items-center"
                @click="showModal[1] = true"
              >
                <i class="bx bx-upload me-1"></i>
                Upload
              </button>
              <!-- Alterar aqui(Mudar para Página Galeria de Icones) -->
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
              <div v-if="icons.length === 0" class="text-center text-gray my-3">
                Nenhum icone encontrado.
              </div>
              <div v-else class="row m-0">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th class="w-25">Icon</th>
                      <th>Name</th>
                      <th>Library</th>
                      <th class="d-none d-md-table-cell">Usage Example</th>
                      <th class="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(icon, index) in icons" :key="icon.index">
                      <td class="d-flex justify-content-center">
                        <img
                          :src="getImageSrc(icon.path)"
                          alt="Icon"
                          style="max-height: 64px; max-width: 64px"
                        />
                      </td>
                      <td class="fw-medium align-middle">{{ icon.name }}</td>
                      <td class="align-middle">{{ icon.library }}</td>
                      <td class="d-none d-md-table-cell align-middle">
                        <code class="px-2 py-1 bg-muted rounded">{{ icon.usage }}</code>
                      </td>
                      <td class="text-end align-middle">
                        <button class="btn btn-sm btn-danger me-2" @click="deleteIcon(index)">
                          <i class="bx bx-trash"></i>
                        </button>
                        <button class="btn btn-sm btn-warning me-2" @click="editIcon(index)">
                          <i class="bx bx-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-primary" @click="setSelectedIcon(icon.url)">
                          <i class="bx bx-link-external"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Component -->
        <Modal :visible="showModal[0]" @close="onCloseImageModal">
          <template #title>Adicionar Imagem</template>
        </Modal>

        <!-- Modal Component -->
        <ModalIcon :visible="showModal[1]" @close="onCloseIconModal">
          <template #title>Adicionar Icone</template>
        </ModalIcon>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SystemController from '../controller/SystemController'
export default {
  name: 'ImageManager',
  data() {
    return {
      showModal: [false, false],
      images: [],
      icons: []
    }
  },
  computed: {
    ...mapGetters(['isSidebarOpen'])
  },
  created() {
    SystemController.updateSystem()
    this.updateRecentImages()
    this.updateRecentIcons()
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
    updateRecentIcons() {
      let iconsDefault = SystemController.getIconStorage()
      if (iconsDefault.length > 0) {
        this.icons = iconsDefault.slice(-5)
      }else{
        this.icons = []
      }
    },
    onCloseImageModal() {
      this.showModal[0] = false
      this.updateRecentImages()
    },
    onCloseIconModal() {
      this.showModal[1] = false
      this.updateRecentIcons()
    },
    deleteIcon(index) {
      SystemController.deleteIcon(index)
      this.updateRecentIcons()
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
