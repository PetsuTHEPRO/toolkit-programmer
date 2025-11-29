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
    <div class="main-content w-100 m-0" :class="isSidebarOpen ? 'open-menu' : 'close-menu'">
      <div class="content-wrapper">
        <!-- Header Section -->
        <div class="header-section mb-4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h1 class="page-title mb-2">{{ $t('sidebar.learn.articles') }}</h1>
              <nav aria-label="breadcrumb">
                <ol class="breadcrumb custom-breadcrumb mb-0">
                  <li class="breadcrumb-item">
                    <i class="bx bx-home-alt me-1"></i>
                    Home
                  </li>
                  <li class="breadcrumb-item active" aria-current="page">
                    {{ $t('sidebar.learn.articles') }}
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
              :placeholder="$t('search', { name: $t('sidebar.learn.articles').toLowerCase() })"
              @input="handleSearch"
            />
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="articles.length === 0" class="empty-state-card">
          <i class="bx bx-file empty-icon"></i>
          <h4>{{ $t('messages.he-empty', { name: $t('sidebar.learn.articles').toLowerCase() }) }}</h4>
          <p>Adicione seu primeiro artigo para começar</p>
          <button class="btn-modern btn-add" @click="showModal = true">
            <i class="bx bx-plus-circle me-2"></i>
            Adicionar Artigo
          </button>
        </div>

        <!-- Articles Grid -->
        <div v-else class="articles-grid">
          <div v-for="article in currentArticles" :key="article.id" class="article-card-wrapper">
            <div class="article-card">
              <!-- Header Section -->
              <div class="article-header">
                <div class="article-icon-wrapper">
                  <i class="bx bx-file-blank article-icon"></i>
                </div>
                <div class="article-meta">
                  <h5 class="article-title" :title="article.name">{{ article.name }}</h5>
                  <div class="article-info">
                    <span class="info-badge">
                      <i class="bx bx-file"></i>
                      PDF
                    </span>
                    <span v-if="article.pdfSize" class="info-badge">
                      <i class="bx bx-data"></i>
                      {{ formatFileSize(article.pdfSize) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Content Section -->
              <div class="article-content">
                <p class="article-description" :title="article.description">
                  {{ article.description }}
                </p>
              </div>

              <!-- Actions Section -->
              <div class="article-actions">
                <button class="btn-action btn-open" @click="handleOpenArticle(article.id)">
                  <i class="bx bx-book-open"></i>
                  <span>{{ $t('buttons.open') }}</span>
                </button>
                <button class="btn-action btn-edit" @click="editArticle(article.id)">
                  <i class="bx bx-pencil"></i>
                </button>
                <button class="btn-action btn-delete" @click="handleDelete(article.id)">
                  <i class="bx bx-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="articles.length > 0" class="pagination-card">
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

        <!-- Upload Modal -->
        <ArticleModal
          :key="idArticle"
          :visible="showModal"
          :idArticle="idArticle"
          @close="onCloseArticleModal"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SystemController from '../controller/SystemController'
import { getTheme } from '../service/userPreferences'
import Article from '../model/entity/article'

export default {
  data() {
    return {
      showModal: false,
      searchTerm: '',
      idArticle: -1,
      currentPage: 1,
      articlesPerPage: 6,
      themeMode: getTheme()
    }
  },
  computed: {
    ...mapGetters(['isSidebarOpen']),
    articles() {
      const storedArticles = this.$store.getters.getStorage('articlesStorage') || []
      return storedArticles.map(
        (a) => new Article(a.id, a.name, a.description, a.path, a.pdfFileName, a.pdfSize)
      )
    },
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
  methods: {
    handlePrevPage() {
      this.currentPage = Math.max(this.currentPage - 1, 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    handleNextPage() {
      this.currentPage = Math.min(this.currentPage + 1, this.totalPages)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    handleOpenArticle(index) {
      this.$router.push({ name: 'articlePreview', params: { id: index } })
    },
    handleDelete(index) {
      SystemController.deleteArticle(index)
    },
    onCloseArticleModal() {
      this.showModal = false
      this.idArticle = -1
    },
    editArticle(index) {
      this.idArticle = index
      this.showModal = true
    },
    formatFileSize(bytes) {
      if (!bytes) return 'N/A'
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(1024))
      return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i]
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

/* Articles Grid */
.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
  animation: fadeInUp 0.6s ease-out;
}

/* Article Card - TAMANHO FIXO */
.article-card-wrapper {
  animation: fadeInUp 0.6s ease-out backwards;
}

.article-card {
  background: var(--card-element-bg);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid var(--card-border, rgba(0, 0, 0, 0.1));
  display: flex;
  flex-direction: column;
  height: 320px; /* ALTURA FIXA */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.article-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

/* Header Section - ALTURA FIXA */
.article-header {
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  border-bottom: 1px solid var(--card-border, rgba(0, 0, 0, 0.05));
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%);
  flex-shrink: 0;
}

.article-icon-wrapper {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.article-icon {
  font-size: 1.75rem;
  color: white;
}

.article-meta {
  flex: 1;
  min-width: 0;
}

.article-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.4;
}

.article-info {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.info-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  background: var(--card-header, rgba(0, 0, 0, 0.05));
  border-radius: 6px;
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 500;
}

.info-badge i {
  font-size: 0.9rem;
}

/* Content Section - ALTURA FIXA COM SCROLL */
.article-content {
  padding: 1.25rem 1.5rem;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.article-description {
  font-size: 0.95rem;
  color: var(--text-muted);
  line-height: 1.6;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}

/* Actions Section - ALTURA FIXA */
.article-actions {
  display: flex;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--card-border, rgba(0, 0, 0, 0.1));
  background: var(--card-header, rgba(0, 0, 0, 0.02));
  flex-shrink: 0;
}

.btn-action {
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

.btn-open {
  flex: 1;
  background: linear-gradient(135deg, #a855f7 0%, #9333ea 100%);
  color: white;
}

.btn-open:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(168, 85, 247, 0.3);
}

.btn-edit {
  width: 44px;
  background: #3b82f6;
  color: white;
}

.btn-edit:hover {
  background: #2563eb;
  transform: translateY(-2px);
}

.btn-delete {
  width: 44px;
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

/* Responsividade */
@media (max-width: 1200px) {
  .articles-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 1rem;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .articles-grid {
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

  .article-actions {
    gap: 0.5rem;
  }

  .btn-open span {
    display: none;
  }

  .btn-open {
    width: 44px;
  }
}

@media (max-width: 480px) {
  .article-header {
    padding: 1rem;
  }

  .article-icon-wrapper {
    width: 48px;
    height: 48px;
  }

  .article-icon {
    font-size: 1.5rem;
  }

  .article-content {
    padding: 1rem;
  }

  .article-actions {
    padding: 0.75rem 1rem;
  }
}
</style>
