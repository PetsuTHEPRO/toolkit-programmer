<script setup>
import Sidebar from '@renderer/components/Sidebar.vue'
import LinkModal from '@renderer/components/LinkModal.vue'
</script>

<template>
  <div class="container-fluid d-flex p-0">
    <Sidebar />
    <div class="row w-100 m-0" :class="isSidebarOpen ? 'open-menu' : 'close-menu'">
      <div class="col">
        <nav aria-label="breadcrumb" class="mt-3">
          <ol class="breadcrumb">
            <li class="breadcrumb-item active" aria-current="page">Link</li>
          </ol>
        </nav>

        <div class="card my-5">
          <div class="card-header">
            <h5 class="card-title">Pesquisar Links</h5>
          </div>
          <div class="card-body">
            <div class="input-group">
              <input
                v-model="searchTerm"
                type="text"
                class="form-control"
                placeholder="Digite o nome ou descrição do link"
                @input="handleSearch"
              />
              <button class="btn btn-outline-secondary" type="button">
                <i class="bx bx-search"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="card mb-5">
          <div class="card-header d-flex align-items-center justify-content-between">
            <h5 class="card-title">Lista de Links</h5>
            <button
              type="button"
              class="btn btn-outline-primary me-2 d-flex align-items-center"
              @click="showModal = true"
            >
              <i class="bx bx-plus-circle me-1"></i>
              Adicionar
            </button>
          </div>
          <div class="card-body py-0">
            <div class="overflow-auto" style="max-height: 400px">
              <ul class="list-unstyled">
                <li v-if="currentItems.length === 0" class="text-center text-gray mt-3">
                  Nenhum link encontrado.
                </li>
                <li
                  v-for="(item, index) in currentItems"
                  :key="item.id"
                  class="border-bottom pb-4 mt-4"
                >
                  <h3 class="h6 font-semibold">{{ item.name }}</h3>
                  <p class="text-muted mt-1">{{ item.description }}</p>
                  <a
                    :href="item.link"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn btn-primary me-2"
                  >
                    Open Link
                    <i class="bx bx-box-arrow-up-right"></i>
                  </a>
                  <a
                    :href="item.link"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn btn-warning me-2"
                  >
                    Editar
                    <i class="bx bx-box-arrow-up-right"></i>
                  </a>
                  <a class="btn btn-danger" @click="handleDelete(index)">
                    Delete
                    <i class="bx bx-box-arrow-up-right"></i>
                  </a>
                </li>
              </ul>
            </div>
            <div v-if="items.length > 0" class="d-flex justify-content-between my-2">
              <button
                class="btn btn-outline-secondary btn-sm"
                :disabled="currentPage === 1"
                @click="handlePrevPage"
              >
                <i class="bx bx-chevron-left"></i> Anterior
              </button>
              <span class="text-sm font-medium">
                Página {{ currentPage }} de {{ totalPages }}
              </span>
              <button
                class="btn btn-outline-secondary btn-sm"
                :disabled="currentPage === totalPages"
                @click="handleNextPage"
              >
                Próxima <i class="bx bx-chevron-right"></i>
              </button>
            </div>
            <!-- Modal -->
            <LinkModal :visible="showModal" @close="showModal = false"> </LinkModal>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SystemController from '../controller/SystemController'
export default {
  data() {
    return {
      showModal: false,
      items: [],
      searchTerm: '',
      currentPage: 1,
      itemsPerPage: 5
    }
  },
  computed: {
    ...mapGetters(['isSidebarOpen']),
    filteredItems() {
      return this.items.filter(
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
      return Math.ceil(this.filteredItems.length / this.itemsPerPage)
    }
  },
  created() {
    SystemController.updateSystem()
    this.items = SystemController.getLinkStorage()
  },
  methods: {
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
      SystemController.deleteLink(index)
    }
  }
}
</script>

<style>
.text-gray {
  color: #6b7280;
}
</style>
