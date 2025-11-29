<script setup>
import Sidebar from '../components/Sidebar.vue'
import ApiModal from '../components/modals/ApiModal.vue'
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
              <h1 class="page-title mb-2">{{ $t('sidebar.developers.api') }}</h1>
              <nav aria-label="breadcrumb">
                <ol class="breadcrumb custom-breadcrumb mb-0">
                  <li class="breadcrumb-item">
                    <i class="bx bx-home-alt me-1"></i>
                    Home
                  </li>
                  <li class="breadcrumb-item active" aria-current="page">
                    {{ $t('sidebar.developers.api') }}
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
              :placeholder="$t('search', { name: $t('sidebar.developers.api').toLowerCase() })"
              @input="handleSearch"
            />
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="apis.length === 0" class="empty-state-card">
          <i class="bx bx-cloud empty-icon"></i>
          <h4>{{ $t('messages.she-empty', { name: $t('sidebar.developers.api').toLowerCase() }) }}</h4>
          <p>Adicione sua primeira API para começar</p>
          <button class="btn-modern btn-add" @click="openAddModal">
            <i class="bx bx-plus-circle me-2"></i>
            Adicionar API
          </button>
        </div>

        <!-- APIs Grid -->
        <div v-else class="apis-grid">
          <div v-for="(api) in currentApis" :key="api.index" class="api-card-wrapper">
            <div class="api-card">
              <!-- Header -->
              <div class="api-header">
                <div class="api-icon-wrapper">
                  <i class="bx bx-plug api-icon"></i>
                </div>
                <div class="api-meta">
                  <h5 class="api-title" :title="api.name">{{ api.name }}</h5>
                  <div class="api-badge">
                    <i class="bx bx-shield-quarter"></i>
                    <span>API Key</span>
                  </div>
                </div>
              </div>

              <!-- Tabs Navigation -->
              <div class="tabs-navigation">
                <button
                  :class="['tab-btn', { active: activeTab[api.id] === 'description' }]"
                  @click="setActiveTab(api.id, 'description')"
                >
                  <i class="bx bx-info-circle"></i>
                  <span>{{ $t('buttons.description') }}</span>
                </button>
                <button
                  :class="['tab-btn', { active: activeTab[api.id] === 'key' }]"
                  @click="setActiveTab(api.id, 'key')"
                >
                  <i class="bx bx-key"></i>
                  <span>{{ $t('buttons.key') }}</span>
                </button>
              </div>

              <!-- Tab Content -->
              <div class="tab-content-area">
                <!-- Description Tab -->
                <div v-show="activeTab[api.id] === 'description'" class="tab-panel">
                  <p class="api-description">{{ api.description }}</p>
                </div>

                <!-- Key Tab -->
                <div v-show="activeTab[api.id] === 'key'" class="tab-panel">
                  <div class="key-container">
                    <div class="key-label">
                      <i class="bx bx-lock-alt"></i>
                      <span>Chave de API</span>
                    </div>
                    <div class="key-block">
                      <code class="key-text">{{ resumirKey(api.key) }}</code>
                      <button
                        class="btn-copy-key"
                        @click="copyCode(api.key)"
                        title="Copiar chave completa"
                      >
                        <i class="bx bx-copy"></i>
                      </button>
                    </div>
                    <div class="key-hint">
                      <i class="bx bx-info-circle"></i>
                      <span>Clique no ícone para copiar a chave completa</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="api-actions">
                <button class="btn-action btn-edit" @click="editApi(api.id)">
                  <i class="bx bx-pencil"></i>
                  <span>{{ $t('buttons.edit') }}</span>
                </button>
                <button class="btn-action btn-delete" @click="handleDelete(api.id)">
                  <i class="bx bx-trash"></i>
                  <span>{{ $t('buttons.delete') }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="apis.length > 0" class="pagination-card">
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
        <ApiModal
          :key="idApi"
          :visible="showModal"
          :idApi="idApi"
          @close="onCloseApiModal"
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
import Api from '../model/entity/api'

export default {
  data() {
    return {
      showModal: false,
      searchTerm: '',
      currentPage: 1,
      idApi: -1,
      apisPerPage: 6,
      themeMode: getTheme(),
      activeTab: {}
    }
  },
  computed: {
    ...mapGetters(['isSidebarOpen']),
    apis() {
      const storedApis = this.$store.getters.getStorage('apisStorage') || []
      return storedApis.map((a) => new Api(a.id, a.name, a.description, a.key))
    },
    filteredApis() {
      return this.apis.filter(
        (api) =>
          api.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          api.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    },
    currentApis() {
      const indexOfLastApi = this.currentPage * this.apisPerPage
      const indexOfFirstApi = indexOfLastApi - this.apisPerPage
      return this.filteredApis.slice(indexOfFirstApi, indexOfLastApi)
    },
    totalPages() {
      let totalPages = Math.ceil(this.filteredApis.length / this.apisPerPage)
      return totalPages === 0 ? 1 : totalPages
    }
  },
  watch: {
    apis: {
      handler(newApis) {
        newApis.forEach(api => {
          if (!this.activeTab[api.id]) {
            this.activeTab[api.id] = 'description'
          }
        })
      },
      immediate: true
    }
  },
  methods: {
    setActiveTab(apiId, tab) {
      this.activeTab[apiId] = tab
      this.$forceUpdate()
    },
    handlePrevPage() {
      this.currentPage = Math.max(this.currentPage - 1, 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    handleNextPage() {
      this.currentPage = Math.min(this.currentPage + 1, this.totalPages)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    handleDelete(apiId) {
      SystemController.deleteApi(apiId)
    },
    onCloseApiModal() {
      this.showModal = false
      this.idApi = -1
    },
    openAddModal() {
      this.idApi = -1
      this.showModal = true
    },
    editApi(apiId) {
      this.idApi = apiId
      this.showModal = true
    },
    copyCode(code) {
      navigator.clipboard.writeText(code).then(() => {
        notificationService.success('Chave copiada com sucesso!')
      })
    },
    resumirKey(key) {
      if (!key || key.length <= 24) {
        return key
      }
      const inicio = key.slice(0, 12)
      const fim = key.slice(-12)
      return `${inicio}...${fim}`
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

/* APIs Grid */
.apis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
  animation: fadeInUp 0.6s ease-out;
}

/* API Card - ALTURA FIXA */
.api-card-wrapper {
  animation: fadeInUp 0.6s ease-out backwards;
}

.api-card {
  background: var(--card-element-bg);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid var(--card-border, rgba(0, 0, 0, 0.1));
  display: flex;
  flex-direction: column;
  height: 420px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.api-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

/* Header */
.api-header {
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  border-bottom: 1px solid var(--card-border, rgba(0, 0, 0, 0.05));
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  flex-shrink: 0;
}

.api-icon-wrapper {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  transition: transform 0.3s ease;
}

.api-card:hover .api-icon-wrapper {
  transform: rotate(-10deg) scale(1.05);
}

.api-icon {
  font-size: 1.75rem;
  color: white;
}

.api-meta {
  flex: 1;
  min-width: 0;
}

.api-title {
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.api-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.75rem;
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.api-badge i {
  font-size: 0.9rem;
}

/* Tabs Navigation */
.tabs-navigation {
  display: flex;
  background: var(--card-header, rgba(0, 0, 0, 0.02));
  border-bottom: 2px solid var(--card-border, rgba(0, 0, 0, 0.05));
  flex-shrink: 0;
}

.tab-btn {
  flex: 1;
  padding: 0.875rem 1rem;
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  position: relative;
}

.tab-btn i {
  font-size: 1.1rem;
}

.tab-btn::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.tab-btn.active {
  color: #10b981;
  background: var(--card-element-bg);
}

.tab-btn.active::after {
  transform: scaleX(1);
}

.tab-btn:hover:not(.active) {
  color: var(--text-primary);
  background: rgba(16, 185, 129, 0.05);
}

/* Tab Content Area */
.tab-content-area {
  flex: 1;
  padding: 1.5rem;
  min-height: 0;
  overflow-y: auto;
}

.tab-content-area::-webkit-scrollbar {
  width: 6px;
}

.tab-content-area::-webkit-scrollbar-track {
  background: transparent;
}

.tab-content-area::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.tab-panel {
  animation: fadeIn 0.3s ease;
}

/* Description Panel */
.api-description {
  font-size: 0.95rem;
  color: var(--text-muted);
  line-height: 1.6;
  margin: 0;
}

/* Key Panel */
.key-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.key-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.key-label i {
  font-size: 1rem;
  color: #10b981;
}

.key-block {
  background: var(--code-background, #1e1e1e);
  border: 2px solid rgba(16, 185, 129, 0.2);
  border-radius: 12px;
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  position: relative;
  overflow: hidden;
}

.key-text {
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  color: #10b981;
  flex: 1;
  overflow-x: auto;
  white-space: nowrap;
}

.key-text::-webkit-scrollbar {
  height: 4px;
}

.key-text::-webkit-scrollbar-track {
  background: transparent;
}

.key-text::-webkit-scrollbar-thumb {
  background: rgba(16, 185, 129, 0.3);
  border-radius: 2px;
}

.btn-copy-key {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.btn-copy-key:hover {
  background: #10b981;
  color: white;
  transform: scale(1.1);
}

.btn-copy-key i {
  font-size: 1.2rem;
}

.key-hint {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--text-muted);
  opacity: 0.7;
}

.key-hint i {
  font-size: 0.9rem;
}

/* Actions */
.api-actions {
  display: flex;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--card-border, rgba(0, 0, 0, 0.1));
  background: var(--card-header, rgba(0, 0, 0, 0.02));
  flex-shrink: 0;
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

/* Responsividade */
@media (max-width: 1200px) {
  .apis-grid {
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

  .apis-grid {
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

  .tab-btn span {
    display: none;
  }

  .tab-btn {
    padding: 0.75rem;
  }
}
</style>