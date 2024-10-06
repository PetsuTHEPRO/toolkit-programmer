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
        <div class="card mt-5 mb-4">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="card-title">Pesquisar Artigos</h5>
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

        <div class="card mb-2">
          <div class="card-header d-flex align-items-center justify-content-between">
            <h5 class="card-title">Lista de Artigos</h5>
            <button
              type="button"
              class="btn btn-outline-primary me-2 d-flex align-items-center"
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
                <button class="btn btn-outline-primary ms-2" @click="handleOpenArticle(index)">
                  Abrir
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

<style>
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

</style>
