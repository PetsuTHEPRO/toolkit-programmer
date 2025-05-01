<script setup>
import Sidebar from '@renderer/components/Sidebar.vue'
import LinkModal from '@renderer/components/modals/LinkModal.vue'
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
              {{ $t('sidebar.learn.links') }}
            </li>
          </ol>
        </nav>

        <div class="input-group my-5">
          <input
            v-model="searchTerm"
            type="text"
            class="form-control search py-4"
            :placeholder="$t('search', { name: $t('sidebar.learn.links').toLowerCase() })"
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
            <h5 class="card-title">{{ $t('pages.links.list') }}</h5>
            <button
              type="button"
              class="btn-system btn-adicionar me-2 d-flex align-items-center"
              @click="showModal = true"
            >
              <i class="bx bx-plus-circle me-1"></i>
              {{ $t('buttons.upload') }}
            </button>
          </div>
          <div class="card-body py-0 list-link">
            <div class="overflow-auto">
              <ul class="list-unstyled">
                <li v-if="currentLinks.length === 0" class="text-center text-white mt-3">
                  {{ $t('messages.he-empty', { name: $t('sidebar.learn.links').toLowerCase() }) }}
                </li>
                <li
                  v-for="(item, index) in currentLinks"
                  :key="item.id"
                  class="border-bottom pb-4 mt-4"
                >
                  <h3 class="h6 font-semibold">{{ item.name }}</h3>
                  <p class="text-link mt-1">{{ item.description }}</p>
                  <a
                    :href="item.link"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn-system btn-link me-2"
                  >
                    <div class="d-flex justitfy-content-between align-items-center text-white">
                      <i class="bx bx-link-external me-2"></i>
                      {{ $t('buttons.view') }}
                    </div>
                  </a>
                  <button
                    class="btn-system btn-editar me-2"
                    @click="editLink((currentPage - 1) * 5 + index)"
                  >
                    <div class="d-flex justitfy-content-between align-items-center">
                      <i class="bx bx-edit me-1"></i>
                      {{ $t('buttons.edit') }}
                    </div>
                  </button>
                  <a class="btn-system btn-deletar" @click="handleDelete(index)">
                    <div class="d-flex justify-content-center align-items-center">
                      <i class="bx bx-trash me-2"></i>
                      {{ $t('buttons.delete') }}
                    </div>
                  </a>
                </li>
              </ul>
            </div>
            <div
              class="d-flex justify-content-between my-2"
              :class="[links.length <= 0 ? 'border-top pt-3' : '']"
            >
              <button
                class="btn btn-control d-flex align-items-center"
                :disabled="currentPage === 1"
                @click="handlePrevPage"
              >
                <i class="bx bx-chevron-left"></i> {{ $t('buttons.previous') }}
              </button>
              <span class="text-sm font-medium"
                >{{ $t('pagination', { currentPage: currentPage, totalPages: totalPages }) }}
              </span>
              <button
                class="btn btn-control d-flex align-items-center"
                :disabled="currentPage === totalPages"
                @click="handleNextPage"
              >
                {{ $t('buttons.next') }} <i class="bx bx-chevron-right fs-5"></i>
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
import { getTheme } from '../service/userPreferences'

export default {
  data() {
    return {
      showModal: false,
      links: [],
      idLink: -1,
      searchTerm: '',
      currentPage: 1,
      linksPerPage: 5,
      themeMode: getTheme()
    }
  },
  computed: {
    ...mapGetters(['isSidebarOpen']),
    filteredLinks() {
      return this.links.filter(
        (item) =>
          item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    },
    currentLinks() {
      const indexOfLastItem = this.currentPage * this.linksPerPage
      const indexOfFirstItem = indexOfLastItem - this.linksPerPage
      return this.filteredLinks.slice(indexOfFirstItem, indexOfLastItem)
    },
    totalPages() {
      let totalPages = Math.ceil(this.filteredLinks.length / this.linksPerPage)
      return totalPages === 0 ? 1 : totalPages
    }
  },
  created() {
    SystemController.updateSystem()
    this.links = SystemController.getStorage('linksStorage')
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

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
@import url('../assets/base.css');

.breadcrumb-item {
  color: var(--breadcrumb-color);
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
  background-color: var(--card-header);
  color: var(--card-header-color);
}

.list-link {
  background-color: var(--list-link-bg);
  color: var(--list-link-header-color);
}

.text-link {
  color: var(--list-link-color);
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
