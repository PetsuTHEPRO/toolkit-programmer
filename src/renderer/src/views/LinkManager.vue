<script setup>
import Sidebar from '@renderer/components/Sidebar.vue'
import LinkModal from '@renderer/components/modals/LinkModal.vue'
</script>

<template>
  <div class="container-fluid d-flex p-0">
    <Sidebar />
    <div class="row w-100 m-0" :class="isSidebarOpen ? 'open-menu' : 'close-menu'">
      <div class="col">
        <nav aria-label="breadcrumb" class="mt-3">
          <ol class="breadcrumb">
            <li class="breadcrumb-item active" aria-current="page" style="color: #e4e4e4">Link</li>
          </ol>
        </nav>

        <div class="input-group my-5">
          <input
            v-model="searchTerm"
            type="text"
            class="form-control search"
            placeholder="Type here..."
            @input="handleSearch"
          />
          <button class="btn btn-outline-secondary search d-flex align-items-center" style="background-color: #727DDC; color: white;" type="button">
            <i class="bx bx-search fs-5" style="font-weight: bold"></i>
          </button>
        </div>

        <div class="card mb-5">
          <div class="card-header d-flex align-items-center justify-content-between">
            <h5 class="card-title">Lista de Links</h5>
            <button
              type="button"
              class="btn-system btn-adicionar me-2 d-flex align-items-center"
              @click="showModal = true"
            >
              <i class="bx bx-plus-circle me-1"></i>
              Adicionar
            </button>
          </div>
          <div class="card-body py-0 list-link">
            <div class="overflow-auto">
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
                    class="btn-system btn-link me-2"
                  >
                    <div class="d-flex justitfy-content-between align-items-center text-white">
                      <i class="bx bx-link-external me-2"></i>
                      Open Link
                    </div>
                  </a>
                  <button
                    class="btn-system btn-editar me-2"
                    @click="editLink((currentPage - 1) * 5 + index)"
                  >
                    <div class="d-flex justitfy-content-between align-items-center">
                      <i class="bx bx-edit me-1"></i>
                      Editar
                    </div>
                  </button>
                  <a class="btn-system btn-deletar" @click="handleDelete(index)">
                    <div class="d-flex justify-content-center align-items-center">
                      <i class="bx bx-trash me-2"></i>
                      Delete
                    </div>
                  </a>
                </li>
              </ul>
            </div>
            <div v-if="items.length > 0" class="d-flex justify-content-between my-2">
              <button
                class="btn btn-control d-flex align-items-center"
                :disabled="currentPage === 1"
                @click="handlePrevPage"
              >
                <i class="bx bx-chevron-left"></i> Anterior
              </button>
              <span class="text-sm font-medium">
                Página {{ currentPage }} de {{ totalPages }}
              </span>
              <button
                class="btn btn-control d-flex align-items-center"
                :disabled="currentPage === totalPages"
                @click="handleNextPage"
              >
                Próxima <i class="bx bx-chevron-right fs-5"></i>
              </button>
            </div>
            <!-- Modal -->
            <LinkModal
              :key="idLink"
              :linkId="idLink"
              :visible="showModal"
              @close="onCloseLinkModal"
            ></LinkModal>
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
      idLink: -1,
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
    this.items = SystemController.getStorage('linksStorage')
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
    },
    onCloseLinkModal() {
      this.showModal = false
      this.links = SystemController.getStorage('linksStorage')
      this.idLink = -1
    },
    editLink(index) {
      this.idLink = index
      this.showModal = true
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

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

.btn-editar {
  background-color: #3b82f6;
  border: 2px solid #3b82f6;
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
  border-radius: 5px;
  color: white;
}

.btn-deletar:hover {
  background-color: #dc2626;
}

.btn-link {
  background-color: #a855f7;
  border: 2px solid #a855f7;
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

.card-header {
  background-color: #141414;
  color: white;
}

.list-link {
  background-color: #212529;
  color: white;
}

.text-muted {
  color: rgba(255, 255, 255, 0.6) !important;
}

.text-gray {
  color: #6b7280;
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
</style>
