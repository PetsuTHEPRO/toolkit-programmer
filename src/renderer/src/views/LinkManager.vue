<script setup>
import Sidebar from '@renderer/components/Sidebar.vue'
import LinkModal from '@renderer/components/modals/LinkModal.vue'
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
              <h1 class="page-title mb-2">{{ $t('sidebar.learn.links') }}</h1>
              <nav aria-label="breadcrumb">
                <ol class="breadcrumb custom-breadcrumb mb-0">
                  <li class="breadcrumb-item">
                    <i class="bx bx-home-alt me-1"></i>
                    Home
                  </li>
                  <li class="breadcrumb-item active" aria-current="page">
                    {{ $t('sidebar.learn.links') }}
                  </li>
                </ol>
              </nav>
            </div>
            <button type="button" class="btn-modern btn-add" @click="showModal = true">
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
              :placeholder="$t('search', { name: $t('sidebar.learn.links').toLowerCase() })"
              @input="handleSearch"
            />
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="links.length === 0" class="empty-state-card">
          <i class="bx bx-link empty-icon"></i>
          <h4>{{ $t('messages.he-empty', { name: $t('sidebar.learn.links').toLowerCase() }) }}</h4>
          <p>Adicione seu primeiro link para começar</p>
          <button class="btn-modern btn-add" @click="showModal = true">
            <i class="bx bx-plus-circle me-2"></i>
            Adicionar Link
          </button>
        </div>

        <!-- Links List -->
        <div v-else class="links-container">
          <div
            v-for="(link, index) in currentLinks"
            :key="link.id"
            class="link-card"
            :style="{ animationDelay: `${index * 0.05}s` }"
          >
            <!-- Link Icon -->
            <div class="link-icon-wrapper">
              <i class="bx bx-link-alt link-icon"></i>
            </div>

            <!-- Link Content -->
            <div class="link-content">
              <h5 class="link-title" :title="link.name">{{ link.name }}</h5>
              <p class="link-description" :title="link.description">{{ link.description }}</p>
              <div class="link-url">
                <i class="bx bx-globe"></i>
                <a :href="link.link" target="_blank" rel="noopener noreferrer" class="url-text">
                  {{ formatUrl(link.link) }}
                </a>
              </div>
            </div>

            <!-- Link Actions -->
            <div class="link-actions">
              <a
                :href="link.link"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-action btn-view"
                :title="$t('buttons.view')"
              >
                <i class="bx bx-link-external"></i>
                <span class="action-text">{{ $t('buttons.view') }}</span>
              </a>
              <button
                class="btn-action btn-edit"
                @click="editLink(link.id)"
                :title="$t('buttons.edit')"
              >
                <i class="bx bx-pencil"></i>
              </button>
              <button
                class="btn-action btn-delete"
                @click="handleDelete(link.id)"
                :title="$t('buttons.delete')"
              >
                <i class="bx bx-trash"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="links.length > 0" class="pagination-card">
          <button class="btn-pagination" :disabled="currentPage === 1" @click="handlePrevPage">
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
        <LinkModal :key="idLink" :linkId="idLink" :visible="showModal" @close="onCloseLinkModal" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SystemController from '../controller/SystemController'
import { getTheme } from '../service/userPreferences'
import Link from '../model/entity/link'

export default {
  data() {
    return {
      showModal: false,
      idLink: -1,
      searchTerm: '',
      currentPage: 1,
      linksPerPage: 8,
      themeMode: getTheme()
    }
  },
  computed: {
    ...mapGetters(['isSidebarOpen']),
    links() {
      const storedLinks = this.$store.getters.getStorage('linksStorage') || []
      return storedLinks.map((v) => new Link(v.id, v.name, v.description, v.link))
    },
    filteredLinks() {
      return this.links.filter(
        (item) =>
          item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    },
    currentLinks() {
      const indexOfLastItem = this.currentPage * this.linksPerPage
      const indexOfFirstItem = indexOfLastItem - this.linksPerPage
      return this.filteredLinks.slice(indexOfFirstItem, indexOfLastItem)
    },
    totalPages() {
      let totalPages = Math.ceil(this.filteredLinks.length / this.linksPerPage)
      return totalPages === 0 ? 1 : totalPages
    }
  },
  created() {
    this.loadLinks()
  },
  methods: {
    handleSearch() {
      this.currentPage = 1
    },
    handlePrevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },
    handleNextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },
    async handleDelete(index) {
      SystemController.deleteLink(index)
      await this.loadLinks()
    },
    async loadLinks() {
      const storedLinks = await SystemController.getStorage('linksStorage')
      this.links = storedLinks.map((v) => new Link(v.id, v.name, v.description, v.link))
    },
    async onCloseLinkModal() {
      this.showModal = false
      await this.loadLinks()
      this.idLink = -1
    },
    editLink(index) {
      const linkToEdit = this.currentLinks
      for (const link of linkToEdit) {
        if (link.id === index) {
          this.idLink = link.id
        }
      }
      this.showModal = true
    },
    formatUrl(url) {
      try {
        const urlObj = new URL(url)
        return urlObj.hostname.replace('www.', '')
      } catch {
        return url
      }
    }
  }
}
</script>

<style scoped>
@import url('../assets/base.css');

/* Layout Principal */
.main-content {
  background: linear-gradient(
    135deg,
    var(--container-bg) 0%,
    var(--container-bg-alt, var(--container-bg)) 100%
  );
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

/* Links Container */
.links-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
}

/* Link Card - ALTURA FIXA */
.link-card {
  background: var(--card-element-bg);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  border: 1px solid var(--card-border, rgba(0, 0, 0, 0.1));
  transition: all 0.3s ease;
  min-height: 140px;
  max-height: 140px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  animation: fadeInUp 0.6s ease-out backwards;
}

.link-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  border-color: #667eea;
}

/* Link Icon */
.link-icon-wrapper {
  width: 64px;
  height: 64px;
  min-width: 64px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  transition: transform 0.3s ease;
}

.link-card:hover .link-icon-wrapper {
  transform: rotate(10deg) scale(1.05);
}

.link-icon {
  font-size: 2rem;
  color: white;
}

/* Link Content */
.link-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.link-title {
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.link-description {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.4;
}

.link-url {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #667eea;
}

.link-url i {
  font-size: 1rem;
}

.url-text {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.2s ease;
}

.url-text:hover {
  color: #764ba2;
  text-decoration: underline;
}

/* Link Actions */
.link-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-shrink: 0;
}

.btn-action {
  padding: 0.65rem 1.25rem;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.btn-view {
  background: linear-gradient(135deg, #a855f7 0%, #9333ea 100%);
  color: white;
}

.btn-view:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(168, 85, 247, 0.3);
  color: white;
}

.btn-edit {
  width: 44px;
  padding: 0.65rem;
  background: #3b82f6;
  color: white;
  justify-content: center;
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
  justify-content: center;
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
@media (max-width: 992px) {
  .link-card {
    flex-direction: column;
    align-items: flex-start;
    min-height: auto;
    max-height: none;
    padding: 1.25rem;
  }

  .link-icon-wrapper {
    width: 56px;
    height: 56px;
    min-width: 56px;
  }

  .link-icon {
    font-size: 1.75rem;
  }

  .link-actions {
    width: 100%;
    justify-content: space-between;
  }

  .btn-view {
    flex: 1;
  }

  .action-text {
    display: inline;
  }
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 1rem;
  }

  .page-title {
    font-size: 1.5rem;
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

  .link-content {
    gap: 0.25rem;
  }

  .link-title {
    font-size: 1rem;
  }

  .link-description {
    font-size: 0.85rem;
  }
}

@media (max-width: 576px) {
  .link-card {
    padding: 1rem;
  }

  .link-icon-wrapper {
    width: 48px;
    height: 48px;
    min-width: 48px;
  }

  .link-icon {
    font-size: 1.5rem;
  }

  .btn-action {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }

  .action-text {
    display: none;
  }

  .btn-view {
    width: 44px;
    padding: 0.65rem;
    justify-content: center;
  }
}
</style>
