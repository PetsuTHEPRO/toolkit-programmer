<script setup>
import Sidebar from '@renderer/components/Sidebar.vue'
import AreaPessoal from '@renderer/components/AreaPessoal.vue'
import Backup from '@renderer/components/Backup.vue'
</script>

<template>
  <div
    class="container-fluid d-flex p-0"
    :class="appSettings.darkMode === 'dark' ? 'dark-theme' : 'light-theme'"
  >
    <Sidebar :theme="appSettings.darkMode" />
    <div class="main-content w-100 m-0" :class="isSidebarOpen ? 'open-menu' : 'close-menu'">
      <div class="content-wrapper">
        <!-- Header Section -->
        <div class="header-section mb-4">
          <div>
            <h1 class="page-title mb-2">{{ $t('sidebar.settings') }}</h1>
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb custom-breadcrumb mb-0">
                <li class="breadcrumb-item">
                  <i class="bx bx-home-alt me-1"></i>
                  Home
                </li>
                <li class="breadcrumb-item active" aria-current="page">
                  {{ $t('sidebar.settings') }}
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <!-- Settings Layout -->
        <div class="settings-layout">
          <!-- Sidebar Menu -->
          <div class="settings-sidebar">
            <div class="settings-nav">
              <button
                class="settings-nav-item"
                :class="{ active: activeTab === 'personal' }"
                @click="activeTab = 'personal'"
              >
                <div class="nav-item-icon">
                  <i class="bx bx-user"></i>
                </div>
                <div class="nav-item-content">
                  <span class="nav-item-title">{{ $t('pages.settings.personal.title') }}</span>
                  <span class="nav-item-desc">Perfil e preferências</span>
                </div>
                <i class="bx bx-chevron-right nav-item-arrow"></i>
              </button>

              <button
                class="settings-nav-item"
                :class="{ active: activeTab === 'backup' }"
                @click="activeTab = 'backup'"
              >
                <div class="nav-item-icon">
                  <i class="bx bx-cloud-upload"></i>
                </div>
                <div class="nav-item-content">
                  <span class="nav-item-title">{{ $t('pages.settings.backup.title') }}</span>
                  <span class="nav-item-desc">Backup e restauração</span>
                </div>
                <i class="bx bx-chevron-right nav-item-arrow"></i>
              </button>

              <button
                class="settings-nav-item"
                :class="{ active: activeTab === 'app' }"
                @click="activeTab = 'app'"
              >
                <div class="nav-item-icon">
                  <i class="bx bx-cog"></i>
                </div>
                <div class="nav-item-content">
                  <span class="nav-item-title">{{ $t('pages.settings.app') }}</span>
                  <span class="nav-item-desc">Configurações gerais</span>
                </div>
                <i class="bx bx-chevron-right nav-item-arrow"></i>
              </button>
            </div>
          </div>

          <!-- Settings Content -->
          <div class="settings-content">
            <!-- Personal Settings -->
            <div v-if="activeTab === 'personal'" class="settings-section">
              <AreaPessoal :activeTab="activeTab" />
            </div>

            <!-- Backup Settings -->
            <div v-if="activeTab === 'backup'" class="settings-section">
              <Backup :activeTab="activeTab" />
            </div>

            <!-- App Settings -->
            <div v-if="activeTab === 'app'" class="settings-section">
              <div class="section-header mb-4">
                <h2 class="section-title">
                  <i class="bx bx-cog me-2"></i>
                  {{ $t('pages.settings.app') }}
                </h2>
                <p class="section-description">Configure o comportamento do aplicativo</p>
              </div>

              <!-- Language Card -->
              <div class="settings-card">
                <div class="settings-card-header">
                  <div class="card-icon language-icon">
                    <i class="bx bx-world"></i>
                  </div>
                  <div>
                    <h3 class="card-title">{{ $t('pages.settings.language.title') }}</h3>
                    <p class="card-subtitle">Escolha o idioma da interface</p>
                  </div>
                </div>
                <div class="settings-card-body">
                  <div class="form-group-modern">
                    <label class="form-label-modern">Idioma do Sistema</label>
                    <div class="select-wrapper">
                      <select
                        class="form-select-modern"
                        v-model="appSettings.language"
                        @change="updateLanguage(appSettings.language)"
                      >
                        <option value="pt">🇧🇷 {{ $t('pages.settings.language.portuguese') }}</option>
                        <option value="en">🇺🇸 {{ $t('pages.settings.language.english') }}</option>
                        <option value="es">🇪🇸 {{ $t('pages.settings.language.spanish') }}</option>
                      </select>
                      <i class="bx bx-chevron-down select-icon"></i>
                    </div>
                  </div>
                </div>
              </div>

              <!-- AI Settings Card -->
              <div class="settings-card">
                <div class="settings-card-header">
                  <div class="card-icon ai-icon">
                    <i class="bx bx-brain"></i>
                  </div>
                  <div>
                    <h3 class="card-title">{{ $t('pages.settings.ia.title') }}</h3>
                    <p class="card-subtitle">Configure o modelo de IA preferido</p>
                  </div>
                </div>
                <div class="settings-card-body">
                  <div class="form-group-modern">
                    <label class="form-label-modern">{{ $t('pages.settings.ia.ia-header') }}</label>
                    <div class="select-wrapper">
                      <select
                        class="form-select-modern"
                        v-model="appSettings.preferredAI"
                        @change="updateModel(appSettings.preferredAI)"
                      >
                        <option value="deepseek">🤖 DeepSeek</option>
                        <option value="gpt">🧠 ChatGPT</option>
                        <option value="gemini">💎 Gemini</option>
                        <option value="llama">🦙 Llama</option>
                        <option value="qwen">🔮 Qwen</option>
                        <option value="deephermes">⚡ DeepHermes</option>
                      </select>
                      <i class="bx bx-chevron-down select-icon"></i>
                    </div>
                  </div>

                  <div v-if="appSettings.preferredAI === 'gpt'" class="alert-modern alert-warning">
                    <i class="bx bx-error-circle alert-icon"></i>
                    <div class="alert-content">
                      <strong>Atenção!</strong>
                      <p>{{ $t('pages.settings.ia.ia-warning') }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Theme Card -->
              <div class="settings-card">
                <div class="settings-card-header">
                  <div class="card-icon theme-icon">
                    <i class="bx" :class="appSettings.darkMode === 'dark' ? 'bx-moon' : 'bx-sun'"></i>
                  </div>
                  <div>
                    <h3 class="card-title">{{ $t('pages.settings.theme.title') }}</h3>
                    <p class="card-subtitle">Personalize a aparência</p>
                  </div>
                </div>
                <div class="settings-card-body">
                  <div class="theme-toggle-container">
                    <div class="theme-info">
                      <i
                        class="theme-current-icon bx"
                        :class="appSettings.darkMode === 'dark' ? 'bx-moon' : 'bx-sun'"
                      ></i>
                      <div>
                        <span class="theme-current-label">Tema Atual</span>
                        <span class="theme-current-value">
                          {{
                            appSettings.darkMode === 'dark'
                              ? $t('pages.settings.theme.dark')
                              : $t('pages.settings.theme.light')
                          }}
                        </span>
                      </div>
                    </div>
                    <label class="theme-switch">
                      <input
                        type="checkbox"
                        v-model="appSettings.darkMode"
                        true-value="dark"
                        false-value="light"
                        @change="setThemePage"
                      />
                      <span class="theme-slider">
                        <i class="bx bx-sun light-icon"></i>
                        <i class="bx bx-moon dark-icon"></i>
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <!-- API Key Card -->
              <div class="settings-card">
                <div class="settings-card-header">
                  <div class="card-icon key-icon">
                    <i class="bx bx-key"></i>
                  </div>
                  <div>
                    <h3 class="card-title">{{ $t('pages.settings.key.title') }}</h3>
                    <p class="card-subtitle">{{ $t('pages.settings.key.description') }}</p>
                  </div>
                </div>
                <div class="settings-card-body">
                  <div class="form-group-modern">
                    <label class="form-label-modern">{{ $t('pages.settings.key.key') }}</label>
                    <div class="input-group-modern">
                      <input
                        type="text"
                        class="form-control-modern"
                        :class="{ disabled: !isEdit }"
                        :disabled="!isEdit"
                        v-model="key"
                        placeholder="Insira sua chave da API"
                      />
                      <button
                        v-if="!isEdit"
                        class="btn-input-action"
                        @click="isEdit = !isEdit"
                        title="Editar"
                      >
                        <i class="bx bx-pencil"></i>
                      </button>
                    </div>
                  </div>

                  <div class="action-buttons">
                    <button
                      class="btn-modern btn-primary"
                      :disabled="!isEdit"
                      @click="setKeyApiLocale(key)"
                    >
                      <i class="bx bx-save me-2"></i>
                      {{ $t('buttons.save') }}
                    </button>
                    <button
                      class="btn-modern btn-secondary"
                      v-if="isEdit"
                      @click="isEdit = false"
                    >
                      <i class="bx bx-x me-2"></i>
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  setAIModel,
  getAIModel,
  getLanguage,
  setLanguage,
  getTheme,
  setTheme,
  getKeyApi,
  setKeyApi
} from '../service/userPreferences'
import notificationService from '../service/notificationService'

export default {
  name: 'SettingsView',
  data() {
    return {
      activeTab: sessionStorage.getItem('settingsActiveTab') || 'personal',
      appSettings: {
        language: getLanguage(),
        darkMode: getTheme() || 'light',
        preferredAI: getAIModel()
      },
      key: getKeyApi() || 'NO_KEY_SET',
      isEdit: false
    }
  },
  computed: {
    ...mapGetters(['isSidebarOpen'])
  },
  watch: {
    activeTab(newValue) {
      sessionStorage.setItem('settingsActiveTab', newValue)
    }
  },
  methods: {
    updateModel(model) {
      setAIModel(model)
      notificationService.success('Modelo de IA atualizado!')
    },
    updateLanguage(lang) {
      setLanguage(lang)
      this.$i18n.locale = lang
      notificationService.success('Idioma atualizado!')
    },
    setThemePage() {
      setTheme(this.appSettings.darkMode)
      notificationService.success('Tema atualizado!')
    },
    setKeyApiLocale(api) {
      this.isEdit = !this.isEdit
      setKeyApi(api)
      notificationService.success('API Key atualizada com sucesso!')
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
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
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

/* Settings Layout */
.settings-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
  animation: fadeInUp 0.6s ease-out;
}

/* Settings Sidebar */
.settings-sidebar {
  position: sticky;
  top: 2rem;
  height: fit-content;
}

.settings-nav {
  background: var(--card-element-bg);
  border-radius: 16px;
  padding: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.settings-nav-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: none;
  background: transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 0.5rem;
  text-align: left;
}

.settings-nav-item:hover {
  background: var(--card-header, rgba(0, 0, 0, 0.05));
  transform: translateX(4px);
}

.settings-nav-item.active {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.settings-nav-item.active .nav-item-icon,
.settings-nav-item.active .nav-item-content,
.settings-nav-item.active .nav-item-arrow {
  color: white;
}

.nav-item-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--card-header, rgba(0, 0, 0, 0.05));
  border-radius: 10px;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.settings-nav-item.active .nav-item-icon {
  background: rgba(255, 255, 255, 0.2);
}

.nav-item-icon i {
  font-size: 1.5rem;
  color: var(--text-primary);
}

.nav-item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.nav-item-title {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--text-primary);
}

.nav-item-desc {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.settings-nav-item.active .nav-item-desc {
  color: rgba(255, 255, 255, 0.8);
}

.nav-item-arrow {
  font-size: 1.25rem;
  color: var(--text-muted);
  transition: transform 0.3s ease;
}

.settings-nav-item:hover .nav-item-arrow {
  transform: translateX(4px);
}

/* Settings Content */
.settings-content {
  animation: fadeInUp 0.6s ease-out;
}

.settings-section {
  animation: fadeIn 0.4s ease-out;
}

.section-header {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
}

.section-description {
  color: var(--text-muted);
  margin: 0;
}

/* Settings Card */
.settings-card {
  background: var(--card-element-bg);
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 1.5rem;
  border: 1px solid var(--card-border, rgba(0, 0, 0, 0.1));
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.settings-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.settings-card-header {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%);
  border-bottom: 1px solid var(--card-border, rgba(0, 0, 0, 0.1));
}

.card-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  flex-shrink: 0;
}

.card-icon i {
  font-size: 1.75rem;
  color: white;
}

.language-icon {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.ai-icon {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.theme-icon {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.key-icon {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
}

.card-subtitle {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 0;
}

.settings-card-body {
  padding: 1.5rem;
}

/* Form Elements */
.form-group-modern {
  margin-bottom: 1.5rem;
}

.form-group-modern:last-child {
  margin-bottom: 0;
}

.form-label-modern {
  display: block;
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.select-wrapper {
  position: relative;
}

.form-select-modern {
  width: 100%;
  padding: 0.875rem 3rem 0.875rem 1rem;
  border: 2px solid var(--card-border, rgba(0, 0, 0, 0.1));
  border-radius: 12px;
  background: var(--form-bg);
  color: var(--text-primary);
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  appearance: none;
}

.form-select-modern:hover {
  border-color: #6366f1;
}

.form-select-modern:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

.select-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.25rem;
  color: var(--text-muted);
  pointer-events: none;
}

.input-group-modern {
  position: relative;
  display: flex;
  align-items: center;
}

.form-control-modern {
  flex: 1;
  padding: 0.875rem 3.5rem 0.875rem 1rem;
  border: 2px solid var(--card-border, rgba(0, 0, 0, 0.1));
  border-radius: 12px;
  background: var(--form-bg);
  color: var(--text-primary);
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.form-control-modern:hover:not(.disabled) {
  border-color: #6366f1;
}

.form-control-modern:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

.form-control-modern.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-input-action {
  position: absolute;
  right: 0.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  border-radius: 8px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-input-action:hover {
  background: var(--card-header, rgba(0, 0, 0, 0.05));
  color: #6366f1;
}

/* Alert Modern */
.alert-modern {
  padding: 1rem;
  border-radius: 12px;
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.alert-warning {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%);
  border: 1px solid rgba(251, 191, 36, 0.3);
}

.alert-icon {
  font-size: 1.5rem;
  color: #f59e0b;
  flex-shrink: 0;
}

.alert-content strong {
  display: block;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.alert-content p {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.9rem;
}

/* Theme Toggle */
.theme-toggle-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: var(--card-header, rgba(0, 0, 0, 0.02));
  border-radius: 12px;
}

.theme-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.theme-current-icon {
  font-size: 2rem;
  color: #f59e0b;
}

.theme-current-label {
  display: block;
  font-size: 0.8rem;
  color: var(--text-muted);
}

.theme-current-value {
  display: block;
  font-weight: 600;
  color: var(--text-primary);
}

.theme-switch {
  position: relative;
  width: 70px;
  height: 36px;
  cursor: pointer;
}

.theme-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.theme-slider {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #cbd5e1;
  border-radius: 34px;
  transition: 0.4s;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
}

.theme-slider::before {
  content: '';
  position: absolute;
  height: 28px;
  width: 28px;
  left: 4px;
  background: white;
  border-radius: 50%;
  transition: 0.4s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.theme-switch input:checked + .theme-slider {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
}

.theme-switch input:checked + .theme-slider::before {
  transform: translateX(34px);
}

.light-icon,
.dark-icon {
  font-size: 1rem;
  z-index: 1;
  transition: opacity 0.3s;
}

.light-icon {
  color: #f59e0b;
}

.dark-icon {
  color: white;
  opacity: 0.5;
}

.theme-switch input:checked + .theme-slider .light-icon {
  opacity: 0.5;
}

.theme-switch input:checked + .theme-slider .dark-icon {
  opacity: 1;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.btn-modern {
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  font-size: 0.95rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background: var(--card-header, rgba(0, 0, 0, 0.05));
  color: var(--text-primary);
  border: 2px solid var(--card-border, rgba(0, 0, 0, 0.1));
}

.btn-secondary:hover {
  background: var(--card-border, rgba(0, 0, 0, 0.1));
  transform: translateY(-2px);
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
  .settings-layout {
    grid-template-columns: 250px 1fr;
    gap: 1.5rem;
  }
}

@media (max-width: 992px) {
  .settings-layout {
    grid-template-columns: 1fr;
  }

  .settings-sidebar {
    position: static;
  }

  .settings-nav {
    display: flex;
    overflow-x: auto;
    padding: 0.5rem;
    gap: 0.5rem;
  }

  .settings-nav-item {
    min-width: 200px;
    margin-bottom: 0;
  }
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 1rem;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .settings-nav {
    flex-direction: column;
  }

  .settings-nav-item {
    min-width: auto;
    width: 100%;
  }

  .settings-card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .card-icon {
    width: 48px;
    height: 48px;
  }

  .card-icon i {
    font-size: 1.5rem;
  }

  .theme-toggle-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .action-buttons {
    flex-direction: column;
  }

  .btn-modern {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .settings-card-body {
    padding: 1rem;
  }

  .form-control-modern,
  .form-select-modern {
    font-size: 0.9rem;
    padding: 0.75rem 1rem;
  }

  .nav-item-icon {
    width: 36px;
    height: 36px;
  }

  .nav-item-icon i {
    font-size: 1.25rem;
  }

  .nav-item-title {
    font-size: 0.9rem;
  }

  .nav-item-desc {
    font-size: 0.7rem;
  }
}

/* Modo Escuro - Ajustes Específicos */
.dark-theme .settings-nav-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.dark-theme .nav-item-icon {
  background: rgba(255, 255, 255, 0.1);
}

.dark-theme .settings-nav-item.active .nav-item-icon {
  background: rgba(255, 255, 255, 0.2);
}

.dark-theme .form-control-modern,
.dark-theme .form-select-modern {
  border-color: rgba(255, 255, 255, 0.1);
}

.dark-theme .form-control-modern:hover:not(.disabled),
.dark-theme .form-select-modern:hover {
  border-color: #6366f1;
}

.dark-theme .btn-input-action:hover {
  background: rgba(255, 255, 255, 0.1);
}

.dark-theme .theme-toggle-container {
  background: rgba(255, 255, 255, 0.05);
}

.dark-theme .alert-warning {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(245, 158, 11, 0.15) 100%);
  border-color: rgba(251, 191, 36, 0.4);
}

.dark-theme .btn-secondary {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
}

.dark-theme .btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* Transições Suaves */
* {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

/* Scrollbar Personalizada */
.settings-nav::-webkit-scrollbar {
  height: 6px;
}

.settings-nav::-webkit-scrollbar-track {
  background: var(--card-header, rgba(0, 0, 0, 0.05));
  border-radius: 10px;
}

.settings-nav::-webkit-scrollbar-thumb {
  background: var(--card-border, rgba(0, 0, 0, 0.2));
  border-radius: 10px;
}

.settings-nav::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}

/* Estados de Foco Acessíveis */
.settings-nav-item:focus-visible {
  outline: 2px solid #6366f1;
  outline-offset: 2px;
}

.btn-modern:focus-visible {
  outline: 2px solid #6366f1;
  outline-offset: 2px;
}

.form-control-modern:focus-visible,
.form-select-modern:focus-visible {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

/* Loading States */
.btn-modern.loading {
  position: relative;
  pointer-events: none;
}

.btn-modern.loading::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  top: 50%;
  left: 50%;
  margin-left: -8px;
  margin-top: -8px;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Success/Error States */
.form-control-modern.success {
  border-color: #10b981;
}

.form-control-modern.error {
  border-color: #ef4444;
}

.form-feedback {
  font-size: 0.85rem;
  margin-top: 0.5rem;
}

.form-feedback.success {
  color: #10b981;
}

.form-feedback.error {
  color: #ef4444;
}

/* Tooltip Styles */
[title] {
  position: relative;
  cursor: help;
}

/* Card Skeleton Loading */
.settings-card.loading {
  pointer-events: none;
  opacity: 0.6;
}

.settings-card.loading .settings-card-body::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Badge Styles */
.badge-new {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  font-size: 0.7rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-radius: 6px;
  margin-left: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Improved Select Dropdown */
.form-select-modern option {
  padding: 0.75rem;
  background: var(--card-element-bg);
  color: var(--text-primary);
}

/* Divider */
.settings-divider {
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--card-border, rgba(0, 0, 0, 0.1)),
    transparent
  );
  margin: 2rem 0;
}

/* Info Box */
.info-box {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 12px;
  margin-top: 1rem;
}

.info-box-icon {
  font-size: 1.5rem;
  color: #3b82f6;
  flex-shrink: 0;
}

.info-box-content {
  flex: 1;
}

.info-box-title {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.info-box-text {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin: 0;
}

/* Toggle Switch Variants */
.toggle-switch-small {
  width: 50px;
  height: 28px;
}

.toggle-switch-small .theme-slider::before {
  height: 20px;
  width: 20px;
}

.toggle-switch-small input:checked + .theme-slider::before {
  transform: translateX(22px);
}

/* Grid Layout for Settings */
.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

/* Stats Cards */
.stats-card {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
}

.stats-value {
  font-size: 2rem;
  font-weight: 700;
  color: #6366f1;
  margin-bottom: 0.5rem;
}

.stats-label {
  font-size: 0.9rem;
  color: var(--text-muted);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
}

.empty-state-icon {
  font-size: 4rem;
  color: var(--text-muted);
  opacity: 0.3;
  margin-bottom: 1rem;
}

.empty-state-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.empty-state-text {
  color: var(--text-muted);
  margin-bottom: 1.5rem;
}
</style>