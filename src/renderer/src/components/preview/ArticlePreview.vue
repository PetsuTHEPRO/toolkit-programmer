<script setup>
import Sidebar from '@renderer/components/Sidebar.vue'
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
            <li class="breadcrumb-item">
              <router-link :to="{ name: 'article' }" class="breadcrumb-link">Artigo</router-link>
            </li>
            <li v-if="article" class="breadcrumb-item active" aria-current="page">
              {{ article.name }}
            </li>
          </ol>
        </nav>

        <div v-if="article" class="card shadow-lg mb-3">
          <div class="card-header">
            <h5 class="card-title text-center">{{ article.name }}</h5>
          </div>
          <div class="card-body card-element">
            <div class="d-flex justify-content-center">
              <div
                class="border rounded overflow-hidden bg-white shadow-inner"
                style="width: 95%; height: 85vh"
              >
                <div v-if="!pdfSrc" class="w-100 h-100 d-flex ...">
                  <p>Carregando documento...</p>
                </div>
                <webview v-else :src="pdfSrc" style="width: 100%; height: 100%"></webview>
              </div>
            </div>
          </div>
          <div class="card-footer d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center text-sm">
              <i class="bx bxs-file-pdf me-2 fs-5 text-danger"></i>
              <span class="me-2 fw-bold text-color">{{ article.pdfFilename }}</span>
              <span class="me-2"> - </span>
              <span class="text-color">({{ article.pdfSize }})</span>
            </div>
            <button class="btn-mostrar" @click="showInFolder">
              <i class="bx bx-folder-open me-2"></i>
              Abrir Pasta
            </button>
          </div>
        </div>

        <div v-else class="text-center p-5">
          <p>Carregando artigo...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getTheme } from '../../service/userPreferences'

export default {
  data() {
    return {
      article: {}, // Inicialização segura
      pdfSrc: null, // Guarda a URL do PDF
      themeMode: getTheme()
    }
  },
  computed: {
    ...mapGetters(['isSidebarOpen'])
  },
  created() {
    this.loadArticleData()
  },
  methods: {
    loadArticleData() {
      const articleId = this.$route.params.id

      const articles = this.$store.getters.getStorage('articlesStorage')
      if (!articles) return

      this.article = articles.find((a) => a.id === articleId)

      if (this.article && this.article.path) {
        this.pdfSrc = `app://${this.article.path}`
      }
    },
    showInFolder() {
      if (this.article && this.article.path) {
        // Chama a nova função da nossa API do preload
        window.api.files.showInFolder(this.article.path)
      }
    }
  }
}
</script>

<style scoped>
@import url('../../assets/base.css');

.container-fluid {
  background-color: var(--container-bg);
  color: var(--container-color);
}
.breadcrumb-item,
.breadcrumb-item::before {
  color: var(--breadcrumb-color);
}
.card-header,
.card-footer {
  background-color: var(--card-header);
  color: var(--card-header-color);
}
.card-element {
  background-color: var(--card-element-bg);
}
.breadcrumb-link {
  color: #1e90ff;
}

.text-color{
  color: var(--text-color);
}

.btn-mostrar{
  background-color: #3b82f6;
  border: 2px solid #3b82f6;
  border-radius: 5px;
  color: white;
}

.btn-mostrar:hover {
  background-color: #2563eb;
  color: white;
}
</style>
