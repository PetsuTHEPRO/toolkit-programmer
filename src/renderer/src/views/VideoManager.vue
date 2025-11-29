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
    <div class="main-content w-100 m-0" :class="isSidebarOpen ? 'open-menu' : 'close-menu'">
      <div class="content-wrapper">
        <!-- Header Section -->
        <div class="header-section mb-4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h1 class="page-title mb-2">{{ $t('sidebar.learn.videos') }}</h1>
              <nav aria-label="breadcrumb">
                <ol class="breadcrumb custom-breadcrumb mb-0">
                  <li class="breadcrumb-item">
                    <i class="bx bx-home-alt me-1"></i>
                    Home
                  </li>
                  <li class="breadcrumb-item active" aria-current="page">
                    {{ $t('sidebar.learn.videos') }}
                  </li>
                </ol>
              </nav>
            </div>
            <button
              type="button"
              class="btn-modern btn-add"
              @click="showModal = true"
            >
              <i class="bx bx-plus-circle me-2"></i>
              {{ $t('buttons.upload') }}
            </button>
          </div>

          <!-- Search Bar -->
          <div class="search-container">
            <i class="bx bx-search search-icon"></i>
            <input
              v-model="searchTerm"
              type="text"
              class="search-input"
              :placeholder="$t('search', { name: $t('sidebar.learn.videos').toLowerCase() })"
              @input="handleSearch"
            />
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="videos.length === 0" class="empty-state-card">
          <i class="bx bx-video empty-icon"></i>
          <h4>{{ $t('messages.he-empty', { name: $t('sidebar.learn.videos').toLowerCase() }) }}</h4>
          <p>Adicione seu primeiro vídeo para começar</p>
          <button class="btn-modern btn-add" @click="showModal = true">
            <i class="bx bx-plus-circle me-2"></i>
            Adicionar Vídeo
          </button>
        </div>

        <!-- Videos Grid -->
        <div v-else class="videos-grid">
          <div v-for="video in currentVideos" :key="video.index" class="video-card-wrapper">
            <div class="video-card">
              <!-- Thumbnail Section -->
              <div class="video-thumbnail" @click="selectedVideo = video">
                <template v-if="isLoading">
                  <div class="skeleton skeleton-thumbnail"></div>
                </template>
                <template v-else>
                  <img
                    :src="video.thumbnailUrl"
                    :alt="video.name"
                    class="thumbnail-image"
                  />
                  <div class="play-overlay">
                    <i class="bx bx-play-circle play-icon"></i>
                  </div>
                </template>
              </div>

              <!-- Content Section -->
              <div class="video-content">
                <h5 class="video-title" :title="video.name">{{ video.name }}</h5>
                <p class="video-description" :title="video.description">
                  {{ video.description }}
                </p>
              </div>

              <!-- Actions Section -->
              <div class="video-actions">
                <button class="btn-action btn-edit" @click="editVideo(video.id)">
                  <i class="bx bx-pencil"></i>
                  <span>{{ $t('buttons.edit') }}</span>
                </button>
                <button class="btn-action btn-delete" @click="handleDelete(video.id)">
                  <i class="bx bx-trash"></i>
                  <span>{{ $t('buttons.delete') }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="videos.length > 0" class="pagination-card">
          <button
            class="btn-pagination"
            :disabled="currentPage === 1"
            @click="handlePrevPage"
          >
            <i class="bx bx-chevron-left"></i>
            {{ $t('buttons.previous') }}
          </button>
          <div class="pagination-info">
            <span class="current-page">{{ currentPage }}</span>
            <span class="separator">/</span>
            <span class="total-pages">{{ totalPages }}</span>
          </div>
          <button
            class="btn-pagination"
            :disabled="currentPage === totalPages"
            @click="handleNextPage"
          >
            {{ $t('buttons.next') }}
            <i class="bx bx-chevron-right"></i>
          </button>
        </div>

        <!-- Video Modal -->
        <div v-if="selectedVideo" class="video-modal-overlay" @click.self="selectedVideo = null">
          <div class="video-modal-container">
            <button class="modal-close-btn" @click="selectedVideo = null">
              <i class="bx bx-x"></i>
            </button>
            <div class="video-modal-content">
              <iframe
                :src="`https://www.youtube.com/embed/${selectedVideo.apiIdVideo}`"
                frameborder="0"
                allowfullscreen
                class="video-iframe"
              ></iframe>
            </div>
            <div class="video-modal-footer">
              <h5>{{ selectedVideo.name }}</h5>
              <p>{{ selectedVideo.description }}</p>
            </div>
          </div>
        </div>

        <!-- Upload Modal -->
        <VideoModal
          :key="idVideo"
          :visible="showModal"
          :idVideo="idVideo"
          @close="onCloseVideoModal"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SystemController from '../controller/SystemController'
import notificationService from '@renderer/service/notificationService'
import { getTheme } from '@renderer/service/userPreferences'
import Video from '../model/entity/video'

export default {
  data() {
    return {
      showModal: false,
      searchTerm: '',
      currentPage: 1,
      idVideo: -1,
      isLoading: true,
      videosPerPage: 9,
      selectedVideo: null,
      thumbnailUrl: '',
      themeMode: getTheme()
    }
  },
  computed: {
    ...mapGetters(['isSidebarOpen']),
    videos() {
      const storedVideos = this.$store.getters.getStorage('videosStorage') || []
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
    videos: {
      async handler(newVideoList) {
        if (!newVideoList || newVideoList.length === 0) {
          this.isLoading = false
          return
        }
        this.isLoading = true
        await this.preloadImages(newVideoList)
        this.isLoading = false
      },
      immediate: true
    }
  },
  methods: {
    async preloadImages(videosToLoad) {
      const promises = videosToLoad.map((video) => {
        return new Promise((resolve) => {
          if (!video.thumbnailUrl) {
            resolve()
            return
          }
          const img = new Image()
          img.src = video.thumbnailUrl
          img.onload = resolve
          img.onerror = resolve
        })
      })
      await Promise.all(promises)
    },
    handlePrevPage() {
      this.currentPage = Math.max(this.currentPage - 1, 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    handleNextPage() {
      this.currentPage = Math.min(this.currentPage + 1, this.totalPages)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    async handleDelete(index) {
      SystemController.deleteVideo(index)
      notificationService.success('Vídeo excluído com sucesso!')
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
    onCloseVideoModal() {
      this.showModal = false
      this.idVideo = -1
    }
  }
}
</script>

<style scoped>
@import url('../assets/base.css');

/* Layout Principal */
.main-content {
  background: linear-gradient(135deg, var(--container-bg) 0%, var(--container-bg-alt, var(--container-bg)) 100%);
  min-height: 100vh;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.close-menu {
  margin-left: 90px !important;
}

.open-menu {
  margin-left: 230px !important;
}

.content-wrapper {
  padding: 2rem;
  max-width: 1600px;
  margin: 0 auto;
}

/* Header Section */
.header-section {
  animation: fadeInDown 0.6s ease-out;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}

.custom-breadcrumb {
  background: transparent;
  padding: 0;
  font-size: 0.9rem;
}

.custom-breadcrumb .breadcrumb-item {
  color: var(--text-muted, #6c757d);
}

.custom-breadcrumb .breadcrumb-item.active {
  color: var(--text-primary, #333);
  font-weight: 500;
}

/* Search Bar */
.search-container {
  position: relative;
  margin-top: 1.5rem;
}

.search-icon {
  position: absolute;
  left: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.5rem;
  color: var(--text-muted);
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: 1rem 1.5rem 1rem 4rem;
  border: 2px solid var(--card-border, rgba(0, 0, 0, 0.1));
  border-radius: 16px;
  background: var(--card-element-bg);
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.search-input::placeholder {
  color: var(--text-muted);
}

/* Buttons */
.btn-modern {
  padding: 0.75rem 1.75rem;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  font-size: 0.95rem;
  display: inline-flex;
  align-items: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-add {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(34, 197, 94, 0.4);
}

/* Empty State */
.empty-state-card {
  text-align: center;
  padding: 4rem 2rem;
  background: var(--card-element-bg);
  border-radius: 20px;
  margin-top: 2rem;
  animation: fadeInUp 0.6s ease-out;
}

.empty-icon {
  font-size: 5rem;
  color: var(--text-muted);
  opacity: 0.3;
  margin-bottom: 1.5rem;
}

.empty-state-card h4 {
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.empty-state-card p {
  color: var(--text-muted);
  margin-bottom: 2rem;
}

/* Videos Grid */
.videos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
  animation: fadeInUp 0.6s ease-out;
}

/* Video Card - TAMANHO FIXO */
.video-card-wrapper {
  animation: fadeInUp 0.6s ease-out backwards;
}

.video-card {
  background: var(--card-element-bg);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid var(--card-border, rgba(0, 0, 0, 0.1));
  display: flex;
  flex-direction: column;
  height: 420px; /* ALTURA FIXA */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.video-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

/* Thumbnail Section - ALTURA FIXA */
.video-thumbnail {
  position: relative;
  width: 100%;
  height: 200px; /* ALTURA FIXA */
  overflow: hidden;
  cursor: pointer;
  flex-shrink: 0; /* Impede que o thumbnail encolha */
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.video-card:hover .thumbnail-image {
  transform: scale(1.1);
}

.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.video-thumbnail:hover .play-overlay {
  opacity: 1;
}

.play-icon {
  font-size: 4rem;
  color: white;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

/* Content Section - ALTURA FIXA COM SCROLL */
.video-content {
  padding: 1.25rem;
  flex: 1; /* Ocupa o espaço disponível */
  min-height: 0; /* Permite overflow */
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.video-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Limita a 2 linhas */
  -webkit-box-orient: vertical;
  line-height: 1.4;
  flex-shrink: 0;
}

.video-description {
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.6;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* Limita a 3 linhas */
  -webkit-box-orient: vertical;
  margin: 0;
}

/* Actions Section - ALTURA FIXA */
.video-actions {
  display: flex;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-top: 1px solid var(--card-border, rgba(0, 0, 0, 0.1));
  background: var(--card-header, rgba(0, 0, 0, 0.02));
  flex-shrink: 0; /* Impede que as ações encolham */
}

.btn-action {
  flex: 1;
  padding: 0.65rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-edit {
  background: #3b82f6;
  color: white;
}

.btn-edit:hover {
  background: #2563eb;
  transform: translateY(-2px);
}

.btn-delete {
  background: #ef4444;
  color: white;
}

.btn-delete:hover {
  background: #dc2626;
  transform: translateY(-2px);
}

/* Pagination */
.pagination-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: var(--card-element-bg);
  border-radius: 16px;
  margin-top: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.btn-pagination {
  padding: 0.75rem 1.5rem;
  border: 2px solid var(--card-border, rgba(0, 0, 0, 0.1));
  border-radius: 12px;
  background: transparent;
  color: var(--text-primary);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-pagination:hover:not(:disabled) {
  background: #667eea;
  color: white;
  border-color: #667eea;
  transform: translateY(-2px);
}

.btn-pagination:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
}

.current-page {
  font-weight: 700;
  color: #667eea;
  font-size: 1.3rem;
}

.separator {
  color: var(--text-muted);
}

.total-pages {
  color: var(--text-muted);
}

/* Video Modal */
.video-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease;
  padding: 2rem;
}

.video-modal-container {
  background: var(--card-element-bg);
  border-radius: 20px;
  width: 100%;
  max-width: 1000px;
  overflow: hidden;
  position: relative;
  animation: slideUp 0.3s ease;
}

.modal-close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.8);
  border: none;
  color: white;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
}

.modal-close-btn:hover {
  background: #ef4444;
  transform: rotate(90deg);
}

.video-modal-content {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
  height: 0;
}

.video-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.video-modal-footer {
  padding: 1.5rem 2rem;
  background: var(--card-header, rgba(0, 0, 0, 0.02));
  border-top: 1px solid var(--card-border);
}

.video-modal-footer h5 {
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.video-modal-footer p {
  color: var(--text-muted);
  margin: 0;
}

/* Skeleton Loader */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-thumbnail {
  width: 100%;
  height: 200px;
}

.dark-theme .skeleton {
  background: linear-gradient(90deg, #2a2a2a 25%, #1a1a1a 50%, #2a2a2a 75%);
  background-size: 200% 100%;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(100px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Responsividade */
@media (max-width: 1200px) {
  .videos-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 1rem;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .videos-grid {
    grid-template-columns: 1fr;
  }

  .header-section .d-flex {
    flex-direction: column;
    align-items: flex-start !important;
    gap: 1rem;
  }

  .btn-add {
    width: 100%;
    justify-content: center;
  }

  .pagination-card {
    flex-direction: column;
    gap: 1rem;
  }

  .video-modal-overlay {
    padding: 1rem;
  }
}
</style>