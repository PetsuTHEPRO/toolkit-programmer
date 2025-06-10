<script setup>
import Sidebar from '@renderer/components/Sidebar.vue'
import Modal from '@renderer/components/modals/ImageModal.vue'
import ModalIcon from '@renderer/components/modals/IconModal.vue'
</script>

<template>
  <div 
    class="container-fluid d-flex p-0"
    :class="themeMode === 'dark' ? 'dark-theme' : 'light-theme'"
  >
    <Sidebar />
    <div class="row w-100 m-0" :class="isSidebarOpen ? 'open-menu' : 'close-menu'">
      <div class="col">
        <!-- Título da Página -->
        <nav aria-label="breadcrumb" class="mt-3">
          <ol class="breadcrumb">
            <li class="breadcrumb-item active" aria-current="page">
              {{ $t('sidebar.resources.images') }}
            </li>
          </ol>
        </nav>

        <div class="card mb-5">
          <div class="card-header d-flex align-items-center justify-content-between">
            <h5 class="card-title">{{ $t('pages.images.recent') }}</h5>
            <div class="d-flex">
              <button
                type="button"
                class="btn-system btn-adicionar me-2 d-flex align-items-center"
                @click="showModal[0] = true"
              >
                <i class="bx bx-upload me-1"></i>
                {{ $t('buttons.upload') }}
              </button>

              <router-link
                :to="{ name: 'gallery' }"
                class="btn-system btn-link d-flex align-items-center"
              >
                <i class="bx bx-plus-circle me-1"></i>
                {{ $t('buttons.viewMore') }}
              </router-link>
            </div>
          </div>

          <div class="card-body card-element py-0">
            <div class="overflow-auto" style="max-height: 400px">
              <!-- Grid de Cards de Imagens -->
              <div v-if="images.length === 0" class="text-center text-gray my-3">
                {{ $t('messages.she-empty', { name: $t('sidebar.resources.images').toLowerCase() }) }}
              </div>
              <div class="row m-0">
                <div v-for="image in images" :key="image.id" class="col-md-4 mt-3">
                  <div class="card mb-4 shadow-sm">
                    <div class="thumbnail-container">
                      <img :src="image.base64" class="card-img-top" :alt="image.fileName" />
                    </div>
                    <div class="card-body card-element">
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
            <h5 class="card-title mx-3">{{ $t('pages.icons') }}</h5>
            <!-- Search Bar -->
            <div class="input-group">
              <input
                v-model="searchTerm"
                type="text"
                class="form-control search"
                :placeholder="$t('search', { name: $t('pages.icons').toLowerCase() })"
              />
              <button
                class="btn btn-outline-secondary search px-3 d-flex align-items-center"
                style="background-color: #727ddc; color: white"
                type="button"
              >
                <i class="bx bx-search"></i>
              </button>
            </div>
            <div class="d-flex ms-3">
              <button
                type="button"
                class="btn-system btn-adicionar me-2 d-flex align-items-center"
                @click="showModal[1] = true"
              >
                <i class="bx bx-upload me-1"></i>
                {{ $t('buttons.upload') }}
              </button>
            </div>
          </div>

          <div class="card-body card-element py-0">
            <div class="overflow-auto" style="max-height: 420px">
              <!-- Grid de Cards de Imagens -->
              <div v-if="icons.length === 0" class="text-center my-3">
                {{ $t('messages.he-empty', { name: $t('pages.icons').toLowerCase() }) }}
              </div>
              <div v-else class="row mx-0 mt-5">
                <table class="table-custom mb-3">
                  <thead class="header">
                    <tr>
                      <th class="w-25 px-3">Icone</th>
                      <th>Nome</th>
                      <th>Biblioteca</th>
                      <th class="d-none d-md-table-cell">Exemplo de Uso</th>
                      <th class="text-end px-3">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(icon, index) in currentItems" :key="icon.index">
                      <td class="d-flex justify-content-center">
                        <img
                          :src="icon.base64"
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
                        <button class="btn btn-sm btn-delete me-2" @click="deleteIcon(index)">
                          <i class="bx bx-trash"></i>
                        </button>
                        <button class="btn btn-sm btn-edit me-2" @click="editIcon(index)">
                          <i class="bx bx-edit"></i>
                        </button>
                        <a class="btn btn-sm btn-primary me-3" :href="icon.link" target="_blank">
                          <i class="bx bx-link-external"></i>
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <!-- Controle de Paginação -->
                <div class="card-footer d-flex align-items-center justify-content-between">
                  <button
                    class="btn btn-control d-flex align-items-center"
                    :disabled="currentPage === 1"
                    @click="prevPage"
                  >
                    <i class="bx bx-chevron-left me-2"></i> Anterior
                  </button>
                  <span>Página {{ currentPage }} de {{ totalPages }}</span>
                  <button
                    class="btn btn-control d-flex align-items-center"
                    :disabled="currentPage === totalPages"
                    @click="nextPage"
                  >
                    Próxima <i class="bx bx-chevron-right fs-5"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Component -->
        <Modal :visible="showModal[0]" @close="onCloseImageModal">
          <template #title>Adicionar Imagem</template>
        </Modal>

        <!-- Modal Component -->
        <ModalIcon
          :visible="showModal[1]"
          :icon="idIcon"
          :key="idIcon"
          @close="onCloseIconModal"
        ></ModalIcon>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SystemController from '../controller/SystemController'
import { getTheme } from '../service/userPreferences'
export default {
  name: 'ImageManager',
  data() {
    return {
      showModal: [false, false],
      images: [],
      icons: [],
      searchTerm: '',
      idIcon: -1,
      currentPage: 1,
      itemsPerPage: 5,
      imageCache: {},
      themeMode: getTheme() || 'light'
    }
  },
  computed: {
    ...mapGetters(['isSidebarOpen']),
    filteredIcons() {
      return this.icons.filter(
        (item) =>
          item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          item.library.toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    },
    currentItems() {
      const indexOfLastItem = this.currentPage * this.itemsPerPage
      const indexOfFirstItem = indexOfLastItem - this.itemsPerPage
      return this.filteredIcons.slice(indexOfFirstItem, indexOfLastItem)
    },
    totalPages() {
      let totalPages = Math.ceil(this.filteredIcons.length / this.itemsPerPage)
      return totalPages === 0 ? 1 : totalPages
    }
  },
  created() {
    SystemController.initializeSystem()
    this.images = SystemController.getStorage('imagesStorage')
    this.icons = SystemController.getStorage('iconsStorage')
  },
  methods: {
    onCloseImageModal() {
      this.showModal[0] = false
      this.updateRecentImages()
    },
    onCloseIconModal() {
      this.showModal[1] = false
      this.idIcon = -1
      this.icons = SystemController.getStorage('iconsStorage')
    },
    deleteIcon(index) {
      SystemController.deleteIcon(index)
      this.icons = SystemController.getStorage('iconsStorage')
    },
    editIcon(index) {
      this.idIcon = index
      this.showModal[1] = true
    },
    // Funções para controle de página
    handlePrevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
      }
    },
    handleNextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
      }
    }
  }
}
</script>

<style scoped>
@import url('../assets/base.css');

.thumbnail-container {
  background: repeating-conic-gradient(#e5e7eb 0% 25%, #d1d5db 0% 50%) 50% / 20px 20px;
  padding: 4px;
  border-radius: 4px;
  display: inline-block;
}

.breadcrumb-item {
  color: var(--breadcrumb-color);
}

.card {
  border-radius: 8px;
  overflow: hidden;
}

.card-header {
  background-color: var(--card-header);
  color: var(--card-header-color);
}

.card-text {
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Limita para 2 linhas */
  -webkit-box-orient: vertical;
  height: 50px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn-system {
  display: inline-block;
  margin: 0 0;
  box-sizing: border-box;
  text-decoration: none;
  font-family: 'Roboto', sans-serif;
  font-weight: 300;
  text-align: center;
  position: relative;
  cursor: pointer;
}

.btn-adicionar {
  background-color: rgba(0, 0, 0, 0);
  padding: 0.5em 1.1em;
  border-radius: 25px;
  border: 2px solid #22c55e;
  color: #22c55e;
  transition: all 0.2s;
  animation: bn13bouncy 5s infinite linear;
}

.btn-adicionar:hover {
  background-color: #22c55e;
  color: #000000;
}

.btn-delete {
  background-color: #ff331f;
  border: 2px solid #ff331f;
  border-radius: 5px;
  color: white;
}

.btn-edit {
  background-color: #ffb800;
  border: 2px solid #ffb800;
  border-radius: 5px;
  color: white;
}

.btn-open {
  background-color: #28afb0;
  border: 2px solid #28afb0;
  border-radius: 5px;
  color: white;
}

.btn-link {
  background-color: #a855f7;
  border: 2px solid #a855f7;
  padding: 0.5em 0.6em;
  border-radius: 5px;
  color: white;
}

.btn-link:hover {
  background-color: #9333ea;
  color: white;
}

.container-fluid {
  background-color: var(--container-bg);
  min-height: 100vh;
}

.card-img-top {
  object-fit: cover;
  max-height: 200px;
}

.search {
  font-family: 'Poppins', sans-serif;
  border-radius: 20px;
  border: none;
  height: 40px;
  background-color: #3d444d;
  color: white;
}

.search:focus {
  background-color: #3d444d;
  color: white;
}

.search::-webkit-input-placeholder {
  color: #b1b4b8;
}

.table-custom {
  color: #ffffff;
  background-color: #2a2a2a; /* Fundo da tabela */
  border-radius: 8px;
  overflow: hidden;
}

.table-custom thead {
  background-color: #141414;
  color: #ffffff;
}

.table-custom thead.header th {
  padding-top: 16px;
  padding-bottom: 16px;
}

.table-custom tbody tr:nth-child(odd) {
  background-color: #2a2a2a;
}

.table-custom tbody tr:nth-child(even) {
  background-color: #404040;
  color: #ffffff;
}

.table-custom tbody tr:hover {
  background-color: #565656; /* Um hover suave */
}

.table-custom img {
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.table-custom code {
  background-color: #eeeeee;
  color: #f97292;
  font-weight: 500;
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
</style>
