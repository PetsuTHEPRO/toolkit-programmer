<script setup>
import Sidebar from '@renderer/components/Sidebar.vue'
import FontModal from '@renderer/components/modals/FontModal.vue'
</script>

<template>
  <div
    class="container-fluid d-flex p-0"
    :class="themeMode === 'dark' ? 'dark-theme' : 'light-theme'"
  >
    <Sidebar />
    <div class="row w-100 m-0" :class="isSidebarOpen ? 'open-menu' : 'close-menu'">
      <div class="col">
        <nav aria-label="breadcrumb" class="mt-3">
          <ol class="breadcrumb">
            <li class="breadcrumb-item active" aria-current="page">
              {{ $t('pages.fonts.title') }}
            </li>
          </ol>
        </nav>

        <div class="input-group my-5">
          <input
            v-model="searchTerm"
            type="text"
            class="form-control search py-4"
            :placeholder="$t('search', { name: $t('pages.fonts.title').toLowerCase() })"
            @input="handleSearch"
          />
          <button
            class="btn btn-outline-secondary search d-flex align-items-center p-4"
            style="background-color: #727ddc; color: white"
            type="button"
          >
            <i class="bx bx-search fs-4" style="font-weight: bold"></i>
          </button>
        </div>

        <div class="card mb-5">
          <div class="card-header d-flex align-items-center justify-content-between">
            <h5 class="card-title">{{ $t('pages.fonts.list') }}</h5>
            <button
              type="button"
              class="btn-system btn-adicionar me-2 d-flex align-items-center"
              @click="showModal = true"
            >
              <i class="bx bx-plus-circle me-1"></i>
              {{ $t('buttons.upload') }}
            </button>
          </div>
          <div class="card-body card-element py-0">
            <div class="overflow-auto">
              <ul class="list-unstyled">
                <li v-if="currentItems.length === 0" class="text-center mt-3">
                  {{
                    $t('messages.she-empty', {
                      name: $t('pages.fonts.title').toLowerCase().slice(0, -1)
                    })
                  }}
                </li>
                <li v-for="(item, index) in currentItems" :key="item.id" class="pb-4 mt-4 d-flex">
                  <div class="row w-100 m-0">
                    <!-- Thumbnail -->
                    <div class="col-2">
                      <img
                        :src="item.thumbnail"
                        alt="Thumbnail"
                        class="img-thumbnail me-3"
                        style="width: 150px; height: 150px"
                      />
                    </div>
                    <div class="col-10">
                      <h3 class="h6 font-semibold mt-2">{{ item.name }}</h3>
                      <p class="text-font mt-1 my-0">font-family: {{ item.family }}</p>
                      <p v-if="item.uploadType === 'import'" class="text-font my-0 break-text">
                        {{ item.link }}
                      </p>
                      <div class="buttons mt-2">
                        <a
                          v-if="item.uploadType === 'link'"
                          :href="item.link"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="btn-system btn-link me-2 align-items-center justify-content-center"
                        >
                          <div class="d-flex align-items-center justify-content-center">
                            <i class="bx bx-link-external me-2"></i>
                            Open Link
                          </div>
                        </a>
                        <button
                          v-else
                          class="btn-system btn-copy me-2"
                          @click="copyToClipboard(item.link)"
                        >
                          <div class="d-flex align-items-center justify-content-center">
                            <i class="bx bx-copy me-2"></i>
                            Copy
                          </div>
                        </button>
                        <button class="btn-system btn-editar me-2" @click="editFont(index)">
                          <div class="d-flex align-items-center justify-content-center">
                            <i class="bx bx-pencil me-2"></i>
                            Editar
                          </div>
                        </button>
                        <a class="btn-system btn-deletar" @click="handleDelete(index)">
                          <i class="bx bx-trash me-2"></i>
                          Delete
                        </a>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div class="card-footer d-flex align-items-center justify-content-between">
            <button
              class="btn btn-control d-flex align-items-center"
              :disabled="currentPage === 1"
              @click="handlePrevPage"
            >
              <i class="bx bx-chevron-left me-2"></i> {{ $t('buttons.previous') }}
            </button>
            <span>{{
              $t('pagination', { currentPage: currentPage, totalPages: totalPages })
            }}</span>
            <button
              class="btn btn-control d-flex align-items-center"
              :disabled="currentPage === totalPages"
              @click="handleNextPage"
            >
              {{ $t('buttons.next') }} <i class="bx bx-chevron-right fs-5"></i>
            </button>
          </div>

          <!-- Modal -->
          <FontModal :key="idFont" :fontId="idFont" :visible="showModal" @close="onCloseFontModal">
          </FontModal>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SystemController from '../controller/SystemController'
import notificationService from '../service/notificationService'
import { getTheme } from '../service/userPreferences'

export default {
  data() {
    return {
      showModal: false,
      items: [],
      idFont: -1,
      searchTerm: '',
      currentPage: 1,
      itemsPerPage: 5,
      themeMode: getTheme() || 'light'
    }
  },
  computed: {
    ...mapGetters(['isSidebarOpen']),
    filteredItems() {
      return this.items.filter(
        (item) =>
          item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          item.family.toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    },
    currentItems() {
      const indexOfLastItem = this.currentPage * this.itemsPerPage
      const indexOfFirstItem = indexOfLastItem - this.itemsPerPage
      return this.filteredItems.slice(indexOfFirstItem, indexOfLastItem)
    },
    totalPages() {
      let totalPages = Math.ceil(this.filteredItems.length / this.itemsPerPage)
      return totalPages === 0 ? 1 : totalPages
    }
  },
  created() {
    SystemController.updateSystem()
    this.items = SystemController.getStorage('fontsStorage')
  },
  methods: {
    onCloseFontModal() {
      this.showModal = false
      this.fonts = SystemController.getStorage('fontsStorage')
      this.idFont = -1
    },
    editFont(index) {
      this.idFont = index
      this.showModal = true
    },
    handleSearch() {
      this.currentPage = 1 // Reset to first page on new search
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
    handleDelete(index) {
      SystemController.deleteFont(index)
    },
    copyToClipboard(text) {
      console.log('Texto:', text)
      navigator.clipboard
        .writeText(text)
        .then(() => {
          notificationService.success('Copiado para Área de Transferencia!')
        })
        .catch((err) => {
          console.error('Erro ao copiar:', err)
        })
    }
  }
}
</script>

<style scoped>
@import url('../assets/base.css');

.breadcrumb-item {
  color: var(--breadcrumb-color);
}

.text-font {
  color: var(--list-link-color);
}

.break-text {
  width: 800px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-header,
.card-footer {
  background-color: var(--card-header);
  color: var(--card-header-color);
}

.container-fluid {
  background-color: var(--container-bg);
  min-height: 100vh;
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

.btn-control {
  background-color: var(--pagination-bg);
  border-radius: 25px;
  border: 2px solid var(--pagination-border);
  color: var(--pagination-color);
  transition: all 0.2s;
  animation: bn13bouncy 5s infinite linear;
}

.btn-control:hover {
  background-color: var(--pagination-hover-bg);
  color: var(--pagination-hover-color);
}

.btn-adicionar {
  background-color: rgba(0, 0, 0, 0);
  border-radius: 25px;
  border: 2px solid #22c55e;
  padding: 0.65em 1.6em;
  color: #22c55e;
  transition: all 0.2s;
  animation: bn13bouncy 5s infinite linear;
}

.btn-adicionar:hover {
  background-color: #22c55e;
  color: #000000;
}

.btn-editar {
  background-color: #3b82f6;
  border: 2px solid #3b82f6;
  padding: 0.5em 0.8em;
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
  padding: 0.5em 0.8em;
  border-radius: 5px;
  color: white;
}

.btn-deletar:hover {
  background-color: #dc2626;
}

.btn-link {
  background-color: #a855f7;
  border: 2px solid #a855f7;
  padding: 0.5em 0.8em;
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
  padding: 0.5em 0.8em;
  border-radius: 5px;
  color: white;
}

.btn-copy:hover {
  background-color: #4f46e5;
}

@keyframes bn13bouncy {
  0% {
    top: 0em;
  }
  40% {
    top: 0em;
  }
  43% {
    top: -0.9em;
  }
  46% {
    top: 0em;
  }
  48% {
    top: -0.4em;
  }
  50% {
    top: 0em;
  }
  100% {
    top: 0em;
  }
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
</style>
