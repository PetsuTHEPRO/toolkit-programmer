<script setup>
import ArticleModal from '@renderer/components/modals/ArticleModal.vue'
import Sidebar from '@renderer/components/Sidebar.vue'
</script>

<template>
  <div class="container-fluid d-flex p-0">
    <Sidebar />
    <div class="row w-100 m-0" :class="isSidebarOpen ? 'open-menu' : 'close-menu'">
      <!-- Título da Página -->
      <div class="col">
        <nav aria-label="breadcrumb" class="mt-3">
          <ol class="breadcrumb">
            <li class="breadcrumb-item active" aria-current="page" style="color: #e4e4e4">Artigo</li>
          </ol>
        </nav>
        <div class="input-group my-5">
          <input
            v-model="searchTerm"
            type="text"
            class="form-control search py-4"
            placeholder="Type here..."
            @input="handleSearch"
          />
          <button class="btn btn-outline-secondary search d-flex align-items-center p-4" style="background-color: #727DDC; color: white;" type="button">
            <i class="bx bx-search fs-4" style="font-weight: bold"></i>
          </button>
        </div>

        <div class="card mb-2">
          <div class="card-header d-flex align-items-center justify-content-between">
            <h5 class="card-title">Lista de Artigos</h5>
            <button
              type="button"
              class="btn-system btn-adicionar me-2 d-flex align-items-center"
              @click="showModal = true"
            >
              <i class="bx bx-plus-circle me-1"></i>
              Adicionar
            </button>
          </div>
          <div v-if="articles.length === 0" class="card-body py-0">
            <div class="overflow-auto" style="max-height: 400px">
              <ul class="list-unstyled">
                <li class="text-center text-gray mt-3">Nenhum artigo encontrado.</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="row g-4 mb-4">
          <div v-for="(article, index) in currentArticles" :key="article.index" class="col-4">
            <div class="card d-flex flex-column">
              <div class="card-header d-flex align-items-center justify-content-between">
                <h5 class="card-title">{{ article.name }}</h5>
                <button class="btn-system btn-link ms-2 d-flex align-items-center" @click="handleOpenArticle(index)">
                  Abrir
                  <i class="bx bx-link-external ms-1"></i>
                </button>
              </div>
              <div class="card-body card-element">
                <p class="card-text">{{ article.description }}</p>
              </div>
            </div>
          </div>

          <div
            v-if="filteredArticles.length > articlesPerPage"
            class="my-4 d-flex align-items-center justify-content-between"
          >
            <button
              class="btn btn-outline-secondary"
              @click="handlePrevPage"
              :disabled="currentPage === 1"
            >
              Anterior
            </button>
            <span class="text-sm font-medium"> Página {{ currentPage }} de {{ totalPages }} </span>
            <button
              class="btn btn-outline-secondary"
              @click="handleNextPage"
              :disabled="currentPage === totalPages"
            >
              Próxima
            </button>
          </div>
          <!-- Modal -->
          <ArticleModal :visible="showModal" @close="showModal = false"> </ArticleModal>
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
      searchTerm: '',
      articles: [],
      currentPage: 1,
      articlesPerPage: 6
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
      return Math.ceil(this.filteredArticles.length / this.articlesPerPage)
    }
  },
  created() {
    SystemController.updateSystem()
    this.articles = SystemController.getStorage('articlesStorage')
  },
  methods: {
    handlePrevPage() {
      this.currentPage = Math.max(this.currentPage - 1, 1)
    },
    handleNextPage() {
      this.currentPage = Math.min(this.currentPage + 1, this.totalPages)
    },
    handleOpenArticle(index) {
      this.$router.push({ name: 'articlePreview', params: { id: index } })
    }
  }
}
</script>

<style scoped>
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
