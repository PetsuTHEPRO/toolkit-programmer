<script setup>
import Sidebar from '@renderer/components/Sidebar.vue'
import { VuePDF, usePDF } from '@tato30/vue-pdf'
</script>
<template>
  <div class="container-fluid d-flex p-0" :class="themeMode === 'dark' ? 'dark-theme' : 'light-theme'">
    <Sidebar />
    <div class="row w-100 m-0" :class="isSidebarOpen ? 'open-menu' : 'close-menu'">
      <div class="col">
        <nav aria-label="breadcrumb" class="my-3">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <router-link :to="{ name: 'article' }" class="breadcrumb-link">Artigo</router-link>
            </li>
            <li class="breadcrumb-item active" aria-current="page">{{ article.name }}</li>
          </ol>
        </nav>

        <div class="card shadow-lg mb-3">
          <div class="card-header">
            <h5 class="card-title text-center">Visualizador de PDF</h5>
          </div>
          <div class="card-body card-element">
            <div class="d-flex justify-content-center">
              <div
                class="border rounded overflow-hidden bg-white shadow-inner"
                style="width: 800px; height: 1000px"
              >
                <div
                  v-if="!pdf"
                  class="w-100 h-100 d-flex flex-column align-items-center justify-content-center text-secondary"
                >
                  <svg class="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p class="h5 fw-bold">Visualização de PDF</p>
                  <p class="small">Este é o local para visualizar o conteúdo do PDF</p>
                </div>
                <VuePDF v-else :pdf="pdf" :page="page" :scale="zoom" />
              </div>
            </div>
          </div>
          <div class="card-footer d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center">
              <button
                class="btn btn-control btn-sm me-2"
                :disabled="page === 1"
                @click="page = page > 1 ? page - 1 : page"
              >
                <span class="bx bx-chevron-left"></span>
              </button>
              <span class="text-sm font-medium">Página {{ page }} de {{ pages }}</span>
              <button
                class="btn btn-control btn-sm ms-2"
                :disabled="page === pages"
                @click="page = page < pages ? page + 1 : page"
              >
                <span class="bx bx-chevron-right"></span>
              </button>
            </div>
            <div class="d-flex align-items-center">
              <button
                class="btn btn-control btn-sm me-2 p-2 d-flex align-items-center"
                :disabled="zoom <= 0.75"
                @click="zoomOut"
              >
                <span class="bx bx-zoom-out"></span>
              </button>
              <button class="btn btn-reset btn-sm" :disabled="zoom === 1.2" @click="zoomReset">
                {{ (zoom * 100 - 20).toFixed(0) }}%
              </button>
              <button
                class="btn btn-control btn-sm ms-2 p-2 d-flex align-items-center"
                :disabled="zoom >= 1.7"
                @click="zoomIn"
              >
                <span class="bx bx-zoom-in"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SystemController from '@renderer/controller/SystemController'
import { getTheme } from '../../service/userPreferences'

export default {
  data() {
    return {
      page: 1,
      pages: null,
      pdf: null,
      pdfFile: null,
      zoom: 1.2,
      article: null,
      articleId: null,
      themeMode: getTheme()
    }
  },
  mounted() {
    window.addEventListener('keydown', this.handleKeyDown)
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown)
  },
  computed: {
    ...mapGetters(['isSidebarOpen'])
  },
  async created() {
    SystemController.updateSystem()
    this.articleId = this.$route.params.id
    this.article = SystemController.getStorage('articlesStorage')[this.articleId]
    try {
      const base64 = this.article.path // ou como você estiver guardando o conteúdo base64
      const cleanBase64 = base64.replace(/^data:application\/pdf;base64,/, '')
      const uint8Array = this.base64ToUint8Array(cleanBase64)
      const { pdf, pages } = await usePDF(uint8Array)
      console.log('PDF carregado:', pdf)
      console.log('Páginas:', pages)
      this.pdf = pdf
      this.pages = pages
    } catch (error) {
      console.error('Erro ao carregar PDF:', error)
    }
  },
  methods: {
    zoomIn() {
      if (this.zoom <= 1.7) {
        this.zoom += 0.1 // Aumenta o zoom em 10%
      }
    },
    handleKeyDown(event) {
      if (event.key === 'ArrowRight') {
        if (this.page < this.pages) {
          this.page++
        }
      } else if (event.key === 'ArrowLeft') {
        if (this.page > 1) {
          this.page--
        }
      }
    },
    zoomOut() {
      if (this.zoom >= 0.75) {
        this.zoom -= 0.1 // Diminui o zoom em 10% (mínimo de 20%)
      }
    },
    zoomReset() {
      this.zoom = 1.2
    },
    base64ToUint8Array(base64) {
      const raw = atob(base64)
      const uint8Array = new Uint8Array(raw.length)
      for (let i = 0; i < raw.length; i++) {
        uint8Array[i] = raw.charCodeAt(i)
      }
      return uint8Array
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
  background-color: --var(--card-element-bg);
  color: --var(--card-element-text);
}

.btn-control {
  background-color: var(--pagination-bg);
  border-radius: 10px;
  border: 2px solid var(--pagination-border);
  color: var(--pagination-color);
  transition: all 0.2s;
  animation: bn13bouncy 5s infinite linear;
}

.btn-control:hover {
  background-color: var(--pagination-hover-bg);
  color: var(--pagination-hover-color);
}

.btn-reset {
  background-color: var(--pagination-bg);
  border: 2px solid var(--pagination-border);
  border-radius: 10px;
  color: var(--pagination-color);
}

.btn-reset:hover {
  background-color: var(--pagination-hover-bg);
  color: var(--pagination-hover-color);
}

.breadcrumb-link {
  color: #1e90ff;
}
</style>
