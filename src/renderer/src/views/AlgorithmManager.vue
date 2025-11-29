<script setup>
import AlgorithmModal from '@renderer/components/modals/AlgorithmModal.vue'
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
              <h1 class="page-title mb-2">{{ $t('sidebar.developers.code') }}</h1>
              <nav aria-label="breadcrumb">
                <ol class="breadcrumb custom-breadcrumb mb-0">
                  <li class="breadcrumb-item">
                    <i class="bx bx-home-alt me-1"></i>
                    Home
                  </li>
                  <li class="breadcrumb-item active" aria-current="page">
                    {{ $t('sidebar.developers.code') }}
                  </li>
                </ol>
              </nav>
            </div>
            <button
              type="button"
              class="btn-modern btn-add"
              @click="openAddModal"
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
              :placeholder="$t('search', { name: $t('sidebar.developers.code').toLowerCase() })"
              @input="handleSearch"
            />
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="algorithms.length === 0" class="empty-state-card">
          <i class="bx bx-code-alt empty-icon"></i>
          <h4>{{ $t('messages.she-empty', { name: $t('sidebar.developers.code').toLowerCase() }) }}</h4>
          <p>Adicione seu primeiro algoritmo para começar</p>
          <button class="btn-modern btn-add" @click="openAddModal">
            <i class="bx bx-plus-circle me-2"></i>
            Adicionar Algoritmo
          </button>
        </div>

        <!-- Algorithms Grid -->
        <div v-else class="algorithms-grid">
          <div v-for="(algorithm) in currentAlgorithms" :key="algorithm.index" class="algorithm-card-wrapper">
            <div class="algorithm-card">
              <!-- Header -->
              <div class="algorithm-header">
                <div class="algorithm-icon-wrapper">
                  <i class="bx bx-code-curly algorithm-icon"></i>
                </div>
                <div class="algorithm-meta">
                  <h5 class="algorithm-title" :title="algorithm.name">{{ algorithm.name }}</h5>
                  <div class="algorithm-badges">
                    <span v-if="algorithm.lang" class="language-badge" :class="getBadgeClass(algorithm)">
                      <i class="bx bx-code-alt"></i>
                      {{ getLanguage(algorithm) }}
                    </span>
                    <span class="complexity-badge">
                      <i class="bx bx-brain"></i>
                      Algoritmo
                    </span>
                  </div>
                </div>
              </div>

              <!-- Content -->
              <div class="algorithm-content">
                <p class="algorithm-explanation" :title="algorithm.explanation">
                  {{ algorithm.explanation }}
                </p>
              </div>

              <!-- Actions -->
              <div class="algorithm-actions">
                <button class="btn-action btn-view" @click="handleOpenAlgorithm(algorithm.id)">
                  <i class="bx bx-show"></i>
                  <span>{{ $t('buttons.view') }}</span>
                </button>
                <button class="btn-action btn-edit" @click="editAlgorithm(algorithm.id)">
                  <i class="bx bx-pencil"></i>
                </button>
                <button class="btn-action btn-delete" @click="handleDelete(algorithm.id)">
                  <i class="bx bx-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="algorithms.length > 0" class="pagination-card">
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

        <!-- Modal -->
        <AlgorithmModal
          :key="idAlgorithm"
          :visible="showModal"
          :programmingLanguages="programmingLanguages"
          :idAlgorithm="idAlgorithm"
          @close="onCloseAlgorithmModal"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SystemController from '../controller/SystemController'
import Algorithm from '../model/entity/algorithm'
import { getTheme } from '../service/userPreferences'

export default {
  data() {
    return {
      showModal: false,
      searchTerm: '',
      idAlgorithm: -1,
      currentPage: 1,
      algorithmsPerPage: 6,
      programmingLanguages: ['JavaScript', 'Python', 'Java', 'Ruby', 'Go', 'Rust', 'PHP', 'C/C++'],
      themeMode: getTheme()
    }
  },
  computed: {
    ...mapGetters(['isSidebarOpen']),
    algorithms() {
      const storedAlgorithms = this.$store.getters.getStorage('algorithmsStorage') || []
      return storedAlgorithms.map((v) => new Algorithm(v.id, v.name, v.explanation))
    },
    filteredAlgorithms() {
      return this.algorithms.filter((algorithm) => {
        const name = algorithm.name?.toLowerCase() ?? ''
        const explanation = algorithm.explanation?.toLowerCase() ?? ''
        const term = this.searchTerm.toLowerCase()
        return name.includes(term) || explanation.includes(term)
      })
    },
    currentAlgorithms() {
      const indexOfLastAlgorithm = this.currentPage * this.algorithmsPerPage
      const indexOfFirstAlgorithm = indexOfLastAlgorithm - this.algorithmsPerPage
      return this.filteredAlgorithms.slice(indexOfFirstAlgorithm, indexOfLastAlgorithm)
    },
    totalPages() {
      let totalPages = Math.ceil(this.filteredAlgorithms.length / this.algorithmsPerPage)
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
    handleOpenAlgorithm(algorithmId) {
      if (!algorithmId) {
        console.error('Tentativa de navegar sem um ID de algoritmo válido!')
        return
      }
      this.$router.push({ name: 'algorithmPreview', params: { id: algorithmId } })
    },
    openAddModal() {
      this.idAlgorithm = -1
      this.showModal = true
    },
    getLanguage(algorithm) {
      if (!algorithm.lang) {
        return 'N/A'
      }
      return algorithm.lang
    },
    getBadgeClass(algorithm) {
      const lang = this.getLanguage(algorithm).toLowerCase()
      const badgeMap = {
        'java': 'badge-java',
        'python': 'badge-python',
        'ruby': 'badge-ruby',
        'javascript': 'badge-javascript',
        'rust': 'badge-rust',
        'go': 'badge-go',
        'php': 'badge-php',
        'c++': 'badge-cpp',
        'c/c++': 'badge-cpp'
      }
      return badgeMap[lang] || 'badge-default'
    },
    onCloseAlgorithmModal() {
      this.showModal = false
      this.idAlgorithm = -1
    },
    handleDelete(algorithmId) {
      SystemController.deleteAlgorithm(algorithmId)
    },
    editAlgorithm(algorithmId) {
      this.idAlgorithm = algorithmId
      this.showModal = true
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

/* Algorithms Grid */
.algorithms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
  animation: fadeInUp 0.6s ease-out;
}

/* Algorithm Card - ALTURA FIXA */
.algorithm-card-wrapper {
  animation: fadeInUp 0.6s ease-out backwards;
}

.algorithm-card {
  background: var(--card-element-bg);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid var(--card-border, rgba(0, 0, 0, 0.1));
  display: flex;
  flex-direction: column;
  height: 340px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.algorithm-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  border-color: #667eea;
}

/* Header */
.algorithm-header {
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  border-bottom: 1px solid var(--card-border, rgba(0, 0, 0, 0.05));
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  flex-shrink: 0;
}

.algorithm-icon-wrapper {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  transition: transform 0.3s ease;
}

.algorithm-card:hover .algorithm-icon-wrapper {
  transform: rotate(10deg) scale(1.05);
}

.algorithm-icon {
  font-size: 1.75rem;
  color: white;
}

.algorithm-meta {
  flex: 1;
  min-width: 0;
}

.algorithm-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.algorithm-badges {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.language-badge,
.complexity-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.language-badge i,
.complexity-badge i {
  font-size: 0.9rem;
}

/* Language Badge Colors */
.badge-java {
  background: linear-gradient(135deg, #f89820 0%, #d97706 100%);
  color: white;
}

.badge-python {
  background: linear-gradient(135deg, #3776ab 0%, #2563eb 100%);
  color: white;
}

.badge-ruby {
  background: linear-gradient(135deg, #cc342d 0%, #dc2626 100%);
  color: white;
}

.badge-javascript {
  background: linear-gradient(135deg, #f7df1e 0%, #eab308 100%);
  color: #1a1a1a;
}

.badge-rust {
  background: linear-gradient(135deg, #ce422b 0%, #b91c1c 100%);
  color: white;
}

.badge-go {
  background: linear-gradient(135deg, #00add8 0%, #0891b2 100%);
  color: white;
}

.badge-php {
  background: linear-gradient(135deg, #8892be 0%, #6366f1 100%);
  color: white;
}

.badge-cpp {
  background: linear-gradient(135deg, #00599c 0%, #1e40af 100%);
  color: white;
}

.badge-default {
  background: var(--card-header, rgba(0, 0, 0, 0.1));
  color: var(--text-muted);
}

.complexity-badge {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border: 1px solid rgba(102, 126, 234, 0.2);
}

/* Content */
.algorithm-content {
  padding: 1.25rem 1.5rem;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.algorithm-explanation {
  font-size: 0.95rem;
  color: var(--text-muted);
  line-height: 1.6;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
}

/* Actions */
.algorithm-actions {
  display: flex;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--card-border, rgba(0, 0, 0, 0.1));
  background: var(--card-header, rgba(0, 0, 0, 0.02));
  flex-shrink: 0;
}

.btn-action {
  padding: 0.65rem 1.25rem;
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

.btn-view {
  flex: 1;
  background: linear-gradient(135deg, #a855f7 0%, #9333ea 100%);
  color: white;
}

.btn-view:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(168, 85, 247, 0.3);
}

.btn-edit {
  width: 44px;
  padding: 0.65rem;
  background: #3b82f6;
  color: white;
}

.btn-edit:hover {
  background: #2563eb;
  transform: translateY(-2px);
}

.btn-delete {
  width: 44px;
  padding: 0.65rem;
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
  .algorithms-grid {
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

  .algorithms-grid {
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

  .btn-view span {
    display: none;
  }

  .btn-view {
    width: 44px;
    padding: 0.65rem;
  }

  .algorithm-badges {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .algorithm-header {
    padding: 1rem;
  }

  .algorithm-icon-wrapper {
    width: 48px;
    height: 48px;
  }

  .algorithm-icon {
    font-size: 1.5rem;
  }

  .algorithm-content {
    padding: 1rem;
  }

  .algorithm-actions {
    padding: 0.75rem 1rem;
  }
}
</style>
