<script setup>
import Sidebar from '@renderer/components/Sidebar.vue'
import ColorModal from '@renderer/components/modals/ColorModal.vue'
</script>

<template>
  <div
    class="container-fluid d-flex p-0"
    :class="themeMode === 'dark' ? 'dark-theme' : 'light-theme'"
  >
    <Sidebar />
    <div class="row w-100 m-0" :class="isSidebarOpen ? 'open-menu' : 'close-menu'">
      <div class="col">
        <nav aria-label="breadcrumb" class="my-3">
          <ol class="breadcrumb">
            <li class="breadcrumb-item active" aria-current="page">
              {{ $t('sidebar.resources.palette') }}
            </li>
          </ol>
        </nav>

        <div class="input-group my-5">
          <input
            v-model="searchTerm"
            type="text"
            class="form-control search py-4"
            :placeholder="$t('search', { name: $t('sidebar.resources.palette').toLowerCase() })"
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

        <div class="card mb-5 p-0">
          <div class="card-header d-flex align-items-center justify-content-between">
            <h5 class="card-title">{{ $t('pages.palette.paletteList') }}</h5>
            <button
              type="button"
              class="btn-system btn-adicionar me-2 d-flex align-items-center"
              @click="openAddModal"
            >
              <i class="bx bx-plus-circle me-1"></i>
              {{ $t('buttons.upload') }}
            </button>
          </div>
          <div class="card-body card-element p-0">
            <div class="overflow-auto px-2" style="max-height: 790px">
              <ul class="list-unstyled row mx-0">
                <li v-if="currentItems.length === 0" class="text-center text-gray mt-3">
                  {{ $t('messages.she-empty', { name: $t('pages.palette.title').toLowerCase() }) }}
                </li>
                <div v-for="palette in currentItems" :key="palette.id" class="col-md-4 mt-4">
                  <ColorPalette
                    :id="palette.id"
                    :colors="palette.colors"
                    :title="palette.name"
                    :description="palette.description"
                    @edit-palette="editPalette"
                  />
                </div>
              </ul>
            </div>
          </div>
          <div class="card-footer d-flex align-items-center justify-content-between">
            <button
              class="btn btn-control d-flex align-items-center"
              :disabled="currentPage === 1"
              @click="prevPage"
            >
              <i class="bx bx-chevron-left me-2"></i> {{ $t('buttons.previous') }}
            </button>
            <span>{{
              $t('pagination', { currentPage: currentPage, totalPages: totalPages })
            }}</span>
            <button
              class="btn btn-control d-flex align-items-center"
              :disabled="currentPage === totalPages"
              @click="nextPage"
            >
              {{ $t('buttons.next') }} <i class="bx bx-chevron-right fs-5"></i>
            </button>
          </div>
          <ColorModal
            :key="idPalette"
            :visible="showModal"
            :paletteId="idPalette"
            @close="onClosePaletteModal"
          >
          </ColorModal>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ColorPalette from '../components/ColorPalette.vue'
import { getTheme } from '../service/userPreferences'

export default {
  components: {
    ColorPalette
  },
  data() {
    return {
      showModal: false,
      idPalette: -1,
      currentPage: 1,
      itemsPerPage: 9,
      searchTerm: '',
      themeMode: getTheme()
    }
  },
  computed: {
    ...mapGetters(['isSidebarOpen']),
    palettes() {
      // O 'loadPalettes' no gerenciador já faz o JSON.parse,
      // então os dados aqui já chegam com a propriedade 'colors' como um array.
      return this.$store.getters.getStorage('palettesStorage') || []
    },
    filteredItems() {
      return this.palettes.filter(
        (item) =>
          item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(this.searchTerm.toLowerCase())
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
  methods: {
    handleSearch() {
      this.currentPage = 1 // Reset to first page on new search
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
      }
    },
    clearSearch() {
      this.searchTerm = ''
    }, // 3. MÉTODOS DE AÇÃO E MODAL CORRIGIDOS
    onClosePaletteModal() {
      this.showModal = false
      this.idPalette = -1
      // A chamada de recarregamento manual foi REMOVIDA.
    },
    openAddModal() {
      this.idPalette = -1
      this.showModal = true
    },
    // Este método agora recebe o ID real da paleta, não o índice.
    editPalette(paletteId) {
      this.idPalette = paletteId
      this.showModal = true
    }
  }
}
</script>

<style scoped>
@import url('../assets/base.css');

.breadcrumb-item {
  color: var(--breadcrumb-color);
}

.min-vh-100 {
  min-height: 100vh;
}
.max-w-4xl {
  max-width: 56rem;
}

.btn-system {
  display: inline-block;
  padding: 0.65em 1.6em;
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
  color: #22c55e;
  transition: all 0.2s;
  animation: bn13bouncy 5s infinite linear;
}

.btn-adicionar:hover {
  background-color: #22c55e;
  color: #000000;
}

.card-header,
.card-footer {
  background-color: var(--card-header);
  color: var(--card-header-color);
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
