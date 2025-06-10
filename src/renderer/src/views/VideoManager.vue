<script setup>
import Sidebar from '../components/Sidebar.vue'
import VideoModal from '../components/modals/VideoModal.vue'
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
              {{ $t('sidebar.learn.videos') }}
            </li>
          </ol>
        </nav>
        <div class="input-group my-5">
          <input
            v-model="searchTerm"
            type="text"
            class="form-control search py-4"
            :placeholder="$t('search', { name: $t('sidebar.learn.videos').toLowerCase() })"
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
            <h5 class="card-title">{{ $t('pages.videos.list') }}</h5>
            <button
              type="button"
              class="btn-system btn-adicionar me-2 d-flex align-items-center"
              @click="showModal = true"
            >
              <i class="bx bx-plus-circle me-1"></i>
              {{ $t('buttons.upload') }}
            </button>
          </div>
          <div v-if="videos.length === 0" class="card-body card-element py-0">
            <div class="overflow-auto" style="max-height: 400px">
              <ul class="list-unstyled">
                <li class="text-center text-gray mt-3">
                  {{ $t('messages.he-empty', { name: $t('sidebar.learn.videos').toLowerCase() }) }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="row g-4 mb-4">
          <div v-for="video in currentVideos" :key="video.index" class="col-4">
            <div class="card d-flex flex-column" style="min-height: 500px">
              <div class="card-header d-flex align-items-center justify-content-between">
                <h5 class="card-title">{{ video.name }}</h5>
              </div>

              <div class="card-body card-element p-0 py-2 ps-1">
                <div class="mt-3 d-flex flex-column">
                  <!-- Skeleton ou imagem real -->
                  <template v-if="isLoading">
                    <div class="skeleton skeleton-img"></div>
                  </template>
                  <template v-else>
                    <img
                      :src="video.thumbnailUrl"
                      alt="Carregando..."
                      class="img-fluid mb-2"
                      @click="selectedVideo = video"
                      style="cursor: pointer"
                    />
                  </template>
                </div>
                <div class="mt-3 px-3 d-flex flex-column align-items-center">
                  <p class="text-sm text-gray-600">Descrição: {{ video.description }}</p>
                </div>
                <!-- Modal do vídeo -->
                <div v-if="selectedVideo" class="modal d-block bg-dark bg-opacity-75">
                  <div class="modal-dialog modal-lg">
                    <div class="modal-content bg-black">
                      <div class="modal-body p-0">
                        <iframe
                          width="100%"
                          height="400"
                          :src="`https://www.youtube.com/embed/${selectedVideo.apiIdVideo}`"
                          frameborder="0"
                          allowfullscreen
                        ></iframe>
                      </div>
                      <div class="modal-footer bg-dark d-flex justify-content-between">
                        <h5 class="card-title">
                          {{ selectedVideo.name }}
                        </h5>
                        <button class="btn btn-secondary" @click="selectedVideo = null">
                          Fechar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Card footer com os botões de editar e excluir -->
              <div class="card-footer d-flex justify-content-between">
                <button class="btn btn-editar me-2" @click="editVideo(video.id)">
                  <i class="bx bx-pencil"></i> {{ $t('buttons.edit') }}
                </button>
                <button class="btn btn-deletar" @click="handleDelete(video.id)">
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
        <VideoModal
          :key="idVideo"
          :visible="showModal"
          :idVideo="idVideo"
          @close="onCloseVideoModal"
        >
        </VideoModal>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SystemController from '../controller/SystemController'
import notificationService from '@renderer/service/notificationService'
import { getTheme } from '@renderer/service/userPreferences'
import Video from '../model/entity/video' // Importar a classe Video

export default {
  data() {
    return {
      showModal: false,
      searchTerm: '',
      currentPage: 1,
      idVideo: -1,
      isLoading: true, // Adicione esta linha
      videosPerPage: 9,
      selectedVideo: null, // Controla qual vídeo está sendo assistido
      thumbnailUrl: '',
      themeMode: getTheme()
    }
  },
  computed: {
    ...mapGetters(['isSidebarOpen']),
    // 1. ESTA É A MUDANÇA PRINCIPAL. 'videos' agora é um espelho reativo da store.
    videos() {
      const storedVideos = this.$store.getters.getStorage('videosStorage') || []
      // Mapeia para a classe Video, como você já fazia, o que está correto.
      return storedVideos.map(
        (v) =>
          new Video(v.id, v.name, v.description, v.link, v.thumbnailUrl, v.titulo, v.apiIdVideo)
      )
    },
    filteredVideos() {
      return this.videos.filter((video) => {
        const search = this.searchTerm.toLowerCase()
        const name = video.name?.toLowerCase() || ''
        const description = video.description?.toLowerCase() || ''
        return name.includes(search) || description.includes(search)
      })
    },
    currentVideos() {
      const indexOfLastVideo = this.currentPage * this.videosPerPage
      const indexOfFirstVideo = indexOfLastVideo - this.videosPerPage
      return this.filteredVideos.slice(indexOfFirstVideo, indexOfLastVideo)
    },
    totalPages() {
      let totalPages = Math.ceil(this.filteredVideos.length / this.videosPerPage)
      return totalPages === 0 ? 1 : totalPages
    }
  },
  watch: {
    // ESTE É O OBSERVADOR. Ele será acionado sempre que a 'computed property' `videos` mudar.
    videos: {
      // O 'handler' é a função que executa quando há uma mudança.
      async handler(newVideoList) {
        if (!newVideoList || newVideoList.length === 0) {
          this.isLoading = false
          return
        }
        this.isLoading = true // Ativa o skeleton loader
        await this.preloadImages(newVideoList) // Espera as imagens carregarem
        this.isLoading = false // Desativa o skeleton loader
      },
      // 'immediate: true' força a execução do handler assim que o componente é criado,
      // para carregar as imagens da lista inicial que vem da store.
      immediate: true
    }
  },
  methods: {
    // Reintroduzimos o preloadImages como um método normal.
    async preloadImages(videosToLoad) {
      const promises = videosToLoad.map((video) => {
        return new Promise((resolve) => {
          if (!video.thumbnailUrl) {
            resolve() // Resolve imediatamente se não houver URL
            return
          }
          const img = new Image()
          img.src = video.thumbnailUrl
          img.onload = resolve // Resolve quando a imagem carrega
          img.onerror = resolve // Resolve também em caso de erro para não travar a UI
        })
      })
      await Promise.all(promises)
    },
    handlePrevPage() {
      this.currentPage = Math.max(this.currentPage - 1, 1)
    },
    handleNextPage() {
      this.currentPage = Math.min(this.currentPage + 1, this.totalPages)
    },
    copyCode(code) {
      navigator.clipboard.writeText(code).then(() => {
        notificationService.success('Código copiado com sucesso!')
      })
    },
    resumirKey(key) {
      if (!key || key.length <= 24) {
        return key // se a key for muito curta, retorna ela inteira
      }

      const inicio = key.slice(0, 12)
      const fim = key.slice(-12)
      return `${inicio}...${fim}`
    },
    async handleDelete(index) {
      SystemController.deleteVideo(index)
    },
    editVideo(index) {
      const videoToEdit = this.currentVideos

      for (const video of videoToEdit) {
        if (video.id === index) {
          this.idVideo = video.id
        }
      }

      this.showModal = true
    },
    // ... outros métodos permanecem iguais ...
    onCloseVideoModal() {
      this.showModal = false
      this.idVideo = -1
    }
  }
}
</script>

<style scoped>
@import url('../assets/base.css');

.container-fluid {
  background-color: var(--container-bg);
}

.breadcrumb-item {
  color: var(--breadcrumb-color);
}

.object-contain {
  object-fit: contain;
}

/* Estilo do botão de copiar */
.btn-copy {
  background: transparent;
  width: 30px;
  height: 30px;
  border: none;
  color: #6c757d; /* Cor padrão do ícone */
  cursor: pointer;
  transition: color 0.3s;
  z-index: 10; /* Garantindo que o botão fique visível acima do conteúdo */
}

.btn-copy:hover {
  color: #007bff; /* Cor ao passar o mouse */
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

.card-header,
.card-footer {
  background-color: var(--card-header);
  color: var(--card-header-color);
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

.nav-tabs {
  border-bottom: 1px solid #3d444d;
}

/* Estilo geral para as abas */
.nav-tabs .nav-link {
  color: #5c707a;
  background-color: #1c2431;
  border: 1px solid #3d444d;
  border-radius: 0.3rem 0.3rem 0 0;
  margin-right: 5px; /* Espaçamento entre as abas */
  padding: 10px 15px; /* Espaçamento interno */
  transition:
    background-color 0.3s,
    color 0.3s; /* Transição suave nas alterações */
}

.nav-tabs .nav-link:hover {
  color: white;
  background-color: #374151;
}

/* Estilo para a aba ativa */
.nav-tabs .nav-link.active {
  color: white;
  background-color: #374151;
  border-color: #3d444d;
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

/* Adicione isso no seu bloco de estilos */
.skeleton {
  background-color: #e0e0e0;
  border-radius: 4px;
  animation: pulse 1.5s infinite ease-in-out;
}

.skeleton-img {
  width: 100%;
  height: 200px; /* Ajuste conforme necessário */
  margin-bottom: 10px;
}

.skeleton-text {
  width: 100%;
  height: 16px;
  margin-bottom: 8px;
}

.skeleton-text-sm {
  width: 70%;
  height: 12px;
}

@keyframes pulse {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.6;
  }
}

/* Para o tema escuro */
.dark-theme .skeleton {
  background-color: #3d444d;
}
</style>
