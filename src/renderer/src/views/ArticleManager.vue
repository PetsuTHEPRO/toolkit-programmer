<script setup>
import ArticleModal from '@renderer/components/modals/ArticleModal.vue'
import Sidebar from '@renderer/components/Sidebar.vue'
</script>

<template>
  <div
    class="container-fluid d-flex p-0"
    :class="themeMode === 'dark' ? 'dark-theme' : 'light-theme'"
  >
    <Sidebar />
    <div class="row w-100 m-0" :class="isSidebarOpen ? 'open-menu' : 'close-menu'">
      <!-- Título da Página -->
      <div class="col">
        <nav aria-label="breadcrumb" class="mt-3">
          <ol class="breadcrumb">
            <li class="breadcrumb-item active" aria-current="page">
              {{ $t('sidebar.learn.articles') }}
            </li>
          </ol>
        </nav>
        <div class="input-group my-5">
          <input
            v-model="searchTerm"
            type="text"
            class="form-control search py-4"
            :placeholder="$t('search', { name: $t('sidebar.learn.articles').toLowerCase() })"
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

        <div class="card mb-2">
          <div class="card-header d-flex align-items-center justify-content-between">
            <h5 class="card-title">{{ $t('pages.articles.list') }}</h5>
            <button
              type="button"
              class="btn-system btn-adicionar me-2 d-flex align-items-center"
              @click="showModal = true"
            >
              <i class="bx bx-plus-circle me-1"></i>
              {{ $t('buttons.upload') }}
            </button>
          </div>
          <div v-if="articles.length === 0" class="card-body card-element py-0">
            <div class="overflow-auto" style="max-height: 400px">
              <ul class="list-unstyled">
                <li class="text-center text-gray mt-3">
                  {{
                    $t('messages.he-empty', { name: $t('sidebar.learn.articles').toLowerCase() })
                  }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="row g-4 mb-4">
          <div v-for="article in currentArticles" :key="article.id" class="col-4">
            <div class="card d-flex flex-column">
              <div class="card-header d-flex align-items-center justify-content-between">
                <h5 class="card-title">{{ article.name }}</h5>
                <button
                  class="btn-system btn-link ms-2 d-flex align-items-center"
                  @click="handleOpenArticle(index)"
                >
                  {{ $t('buttons.open') }}
                  <i class="bx bx-link-external ms-1"></i>
                </button>
              </div>
              <div class="card-body card-element">
                <p class="card-text">{{ article.description }}</p>
              </div>
              <div class="card-footer d-flex justify-content-between">
                <button class="btn btn-editar me-2" @click="editArticle(article.id)">
                  <i class="bx bx-pencil"></i> {{ $t('buttons.edit') }}
                </button>
                <button class="btn btn-deletar" @click="handleDelete(article.id)">
                  <i class="bx bx-trash"></i> {{ $t('buttons.delete') }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="card mb-4 d-flex flex-column border-top-0">
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
        </div>
        <!-- Modal -->
        <ArticleModal
          :key="idArticle"
          :visible="showModal"
          :idArticle="idArticle"
          @close="onCloseArticleModal"
        >
        </ArticleModal>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SystemController from '../controller/SystemController'
import { getTheme } from '../service/userPreferences'
import Article from '../model/entity/article' // Importar a classe Video

export default {
  data() {
    return {
      showModal: false,
      searchTerm: '',
      articles: [],
      idArticle: -1,
      currentPage: 1,
      articlesPerPage: 6,
      themeMode: getTheme()
    }
  },
  computed: {
    ...mapGetters(['isSidebarOpen']),
    filteredArticles() {
      return this.articles.filter(
        (article) =>
          article.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          article.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    },
    currentArticles() {
      const indexOfLastArticle = this.currentPage * this.articlesPerPage
      const indexOfFirstArticle = indexOfLastArticle - this.articlesPerPage
      return this.filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle)
    },

    totalPages() {
      let totalPages = Math.ceil(this.filteredArticles.length / this.articlesPerPage)
      return totalPages === 0 ? 1 : totalPages
    }
  },
  created() {
    SystemController.updateSystem()
    this.loadArticles()
  },
  methods: {
    handlePrevPage() {
      this.currentPage = Math.max(this.currentPage - 1, 1)
    },
    loadArticles() {
      const storedArticles = SystemController.getStorage('articlesStorage') || []
      this.articles = storedArticles.map(
        (a) => new Article(a.id, a.name, a.description, a.pdfFileName, a.pdfSize, a.path)
      )
    },
    handleNextPage() {
      this.currentPage = Math.min(this.currentPage + 1, this.totalPages)
    },
    handleOpenArticle(index) {
      this.$router.push({ name: 'articlePreview', params: { id: index } })
    },

    handleDelete(index) {
      SystemController.deleteArticle(index)
    },

    onCloseArticleModal() {
      this.showModal = false
      this.articles = SystemController.getStorage('articlesStorage')
      this.idArticle = -1
    },

    editArticle(index) {
      this.idArticle = index
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

.container-fluid {
  background-color: var(--container-bg);
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.btn-system {
  display: inline-block;
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
  padding: 0.65em 1.6em;
  margin: 0 0.3em 0.3em 0;
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

.btn-link {
  background-color: #a855f7;
  border: 2px solid #a855f7;
  padding: 0.5em 1em;
  border-radius: 5px;
  color: white;
}

.btn-link:hover {
  background-color: #9333ea;
  color: white;
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
</style>
