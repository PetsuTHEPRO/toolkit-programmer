<script setup>
import Sidebar from '@renderer/components/Sidebar.vue'
import ColorModal from '@renderer/components/modals/ColorModal.vue'
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
              <h1 class="page-title mb-2">{{ $t('sidebar.resources.palette') }}</h1>
              <nav aria-label="breadcrumb">
                <ol class="breadcrumb custom-breadcrumb mb-0">
                  <li class="breadcrumb-item">
                    <i class="bx bx-home-alt me-1"></i>
                    Home
                  </li>
                  <li class="breadcrumb-item active" aria-current="page">
                    {{ $t('sidebar.resources.palette') }}
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
              :placeholder="$t('search', { name: $t('sidebar.resources.palette').toLowerCase() })"
              @input="handleSearch"
            />
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="palettes.length === 0" class="empty-state-card">
          <i class="bx bx-palette empty-icon"></i>
          <h4>{{ $t('messages.she-empty', { name: $t('pages.palette.title').toLowerCase() }) }}</h4>
          <p>Adicione sua primeira paleta de cores para começar</p>
          <button class="btn-modern btn-add" @click="openAddModal">
            <i class="bx bx-plus-circle me-2"></i>
            Adicionar Paleta
          </button>
        </div>

        <!-- Palettes Grid -->
        <div v-else class="palettes-grid">
          <div v-for="palette in currentItems" :key="palette.id" class="palette-card-wrapper">
            <div class="palette-card">
              <!-- Header with Colors Preview -->
              <div class="palette-header">
                <div class="color-preview-grid">
                  <div
                    v-for="(color, index) in palette.colors.slice(0, 5)"
                    :key="index"
                    class="color-preview-item"
                    :style="{ backgroundColor: color }"
                    :title="color"
                  ></div>
                </div>
              </div>

              <!-- Content -->
              <div class="palette-content">
                <h5 class="palette-title" :title="palette.name">
                  <i class="bx bx-palette me-2"></i>
                  {{ palette.name }}
                </h5>
                <p class="palette-description" :title="palette.description">
                  {{ palette.description }}
                </p>
                <div class="palette-info">
                  <span class="color-count-badge">
                    <i class="bx bx-brush"></i>
                    {{ palette.colors.length }} {{ palette.colors.length === 1 ? 'cor' : 'cores' }}
                  </span>
                </div>
              </div>

              <!-- Actions -->
              <div class="palette-actions">
                <button class="btn-action btn-view" @click="editPalette(palette.id)">
                  <i class="bx bx-show"></i>
                  <span>{{ $t('buttons.view') }}</span>
                </button>
                <button class="btn-action btn-edit" @click="editPalette(palette.id)">
                  <i class="bx bx-pencil"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="palettes.length > 0" class="pagination-card">
          <button
            class="btn-pagination"
            :disabled="currentPage === 1"
            @click="prevPage"
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
            @click="nextPage"
          >
            {{ $t('buttons.next') }}
            <i class="bx bx-chevron-right"></i>
          </button>
        </div>

        <!-- Modal -->
        <ColorModal
          :key="idPalette"
          :visible="showModal"
          :paletteId="idPalette"
          @close="onClosePaletteModal"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ColorPalette from '../components/ColorPalette.vue'
import { getTheme } from '../service/userPreferences'

export default {
  components: {
    ColorPalette
  },
  data() {
    return {
      showModal: false,
      idPalette: -1,
      currentPage: 1,
      itemsPerPage: 9,
      searchTerm: '',
      themeMode: getTheme()
    }
  },
  computed: {
    ...mapGetters(['isSidebarOpen']),
    palettes() {
      return this.$store.getters.getStorage('palettesStorage') || []
    },
    filteredItems() {
      return this.palettes.filter(
        (item) =>
          item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    },
    currentItems() {
      const indexOfLastItem = this.currentPage * this.itemsPerPage
      const indexOfFirstItem = indexOfLastItem - this.itemsPerPage
      return this.filteredItems.slice(indexOfFirstItem, indexOfLastItem)
    },
    totalPages() {
      let totalPages = Math.ceil(this.filteredItems.length / this.itemsPerPage)
      return totalPages === 0 ? 1 : totalPages
    }
  },
  methods: {
    handleSearch() {
      this.currentPage = 1
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },
    clearSearch() {
      this.searchTerm = ''
    },
    onClosePaletteModal() {
      this.showModal = false
      this.idPalette = -1
    },
    openAddModal() {
      this.idPalette = -1
      this.showModal = true
    },
    editPalette(paletteId) {
      this.idPalette = paletteId
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
  background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
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
  border-color: #ec4899;
  box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.1);
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

/* Palettes Grid */
.palettes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
  animation: fadeInUp 0.6s ease-out;
}

/* Palette Card */
.palette-card-wrapper {
  animation: fadeInUp 0.6s ease-out backwards;
}

.palette-card {
  background: var(--card-element-bg);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid var(--card-border, rgba(0, 0, 0, 0.1));
  display: flex;
  flex-direction: column;
  height: 280px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.palette-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  border-color: #ec4899;
}

/* Header with Color Preview */
.palette-header {
  height: 100px;
  overflow: hidden;
  flex-shrink: 0;
}

.color-preview-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  height: 100%;
}

.color-preview-item {
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.color-preview-item:hover {
  transform: scale(1.1);
  z-index: 1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* Content */
.palette-content {
  padding: 1.25rem 1.5rem;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.palette-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
  align-items: center;
}

.palette-title i {
  color: #ec4899;
}

.palette-description {
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.5;
  margin: 0 0 1rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  flex: 1;
}

.palette-info {
  display: flex;
  gap: 0.5rem;
  margin-top: auto;
}

.color-count-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.85rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
  color: #ec4899;
  border: 1px solid rgba(236, 72, 153, 0.2);
}

.color-count-badge i {
  font-size: 1rem;
}

/* Actions */
.palette-actions {
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
  background: linear-gradient(135deg, #ec4899 0%, #d946ef 100%);
  color: white;
}

.btn-view:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
}

.btn-edit {
  width: 44px;
  padding: 0.65rem;
  background: #8b5cf6;
  color: white;
}

.btn-edit:hover {
  background: #7c3aed;
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
  background: #ec4899;
  color: white;
  border-color: #ec4899;
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
  color: #ec4899;
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
  .palettes-grid {
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

  .palettes-grid {
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
}

@media (max-width: 480px) {
  .palette-content {
    padding: 1rem;
  }

  .palette-actions {
    padding: 0.75rem 1rem;
  }

  .color-preview-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>