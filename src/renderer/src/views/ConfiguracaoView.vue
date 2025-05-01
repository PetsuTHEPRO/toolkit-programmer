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
    <div class="row w-100 m-0" :class="isSidebarOpen ? 'open-menu' : 'close-menu'">
      <!-- Cabeçalho superior -->
      <div class="col">
        <nav aria-label="breadcrumb" class="mt-3">
          <ol class="breadcrumb">
            <li class="breadcrumb-item active" aria-current="page">
              {{ $t('sidebar.settings') }}
            </li>
          </ol>
        </nav>
        <!-- Conteúdo principal -->
        <div class="col-12 mt-5">
          <div class="row">
            <!-- Menu lateral -->
            <div
              class="col-md-3 mb-4"
              :class="[appSettings.darkMode === 'dark' ? 'dark-theme' : 'light-theme']"
            >
              <div class="list-group sticky-top" style="top: 20px">
                <a
                  href="#"
                  class="list-group-item list-group-item-action"
                  :class="{ active: activeTab === 'personal' }"
                  @click.prevent="activeTab = 'personal'"
                >
                  <i class="bi bi-person me-2"></i> {{ $t('pages.settings.personal.title') }}
                </a>
                <a
                  href="#"
                  class="list-group-item list-group-item-action"
                  :class="{ active: activeTab === 'backup' }"
                  @click.prevent="activeTab = 'backup'"
                >
                  <i class="bi bi-cloud-arrow-up me-2"></i> {{ $t('pages.settings.backup.title') }}
                </a>
                <a
                  href="#"
                  class="list-group-item list-group-item-action"
                  :class="{ active: activeTab === 'app' }"
                  @click.prevent="activeTab = 'app'"
                >
                  <i class="bi bi-phone me-2"></i> {{ $t('pages.settings.app') }}
                </a>
              </div>
            </div>

            <!-- Conteúdo das configurações -->
            <div class="col-md-9 pt-0 mb-5">
              <AreaPessoal :activeTab="activeTab" />

              <Backup :activeTab="activeTab" />

              <!-- Configurações do Aplicativo -->
              <div v-if="activeTab === 'app'" class="settings-section" :class="[appSettings.darkMode === 'dark' ? 'dark-theme' : 'light-theme']">
                <div>
                  <h3 class="mb-4 title">
                    <i class="bx bx-cog"></i> {{ $t('pages.settings.app') }}
                  </h3>
                </div>

                <div class="card mb-4">
                  <div class="card-header">
                    <i class="bx bx-globe me-2 fs-5 text-primary"></i>
                    <strong>{{ $t('pages.settings.language.title') }}</strong>
                  </div>
                  <div class="card-body">
                    <label for="aiSelection" class="form-label">{{
                      $t('pages.settings.language.title')
                    }}</label>
                    <select
                      class="form-select border-start-0 rounded-end"
                      v-model="appSettings.language"
                      @change="updateLanguage(appSettings.language)"
                    >
                      <option value="pt">🇧🇷 {{ $t('pages.settings.language.portuguese') }}</option>
                      <option value="en">🇺🇸 {{ $t('pages.settings.language.english') }}</option>
                      <option value="es">🇪🇸 {{ $t('pages.settings.language.spanish') }}</option>
                    </select>
                  </div>
                </div>

                <div class="card mb-4">
                  <div class="card-header">
                    <strong>🔧 {{ $t('pages.settings.ia.title') }}</strong>
                  </div>
                  <div class="card-body">
                    <div class="mb-3">
                      <label for="aiSelection" class="form-label">{{
                        $t('pages.settings.ia.ia-header')
                      }}</label>
                      <select
                        class="form-select custom-select"
                        id="aiSelection"
                        v-model="appSettings.preferredAI"
                        @change="updateModel(appSettings.preferredAI)"
                      >
                        <option value="deepseek">DeepSeek</option>
                        <option value="gpt">ChatGPT</option>
                        <option value="gemini">Gemini</option>
                        <option value="llama">Llama</option>
                        <option value="qwen">Qwen</option>
                      </select>
                    </div>

                    <div v-if="appSettings.preferredAI === 'gpt'" class="alert alert-warning mt-3">
                      <i class="bx bx-error me-2"></i>
                      {{ $t('pages.settings.ia.ia-warning') }}
                    </div>
                  </div>
                </div>

                <div class="card">
                  <div class="card-header">
                    <strong>🎨 {{ $t('pages.settings.theme.title') }}</strong>
                  </div>
                  <div class="card-body d-flex align-items-center justify-content-between">
                    <div class="d-flex align-items-center">
                      <i
                        class="me-2 bx"
                        :class="
                          appSettings.darkMode === 'dark'
                            ? 'bx-moon text-primary'
                            : 'bx-sun text-warning'
                        "
                      ></i>

                      <span class="me-3">
                        {{
                          appSettings.darkMode === 'dark'
                            ? $t('pages.settings.theme.dark')
                            : $t('pages.settings.theme.light')
                        }}
                      </span>
                    </div>
                    <label class="switch">
                      <input
                        type="checkbox"
                        id="themeSwitch"
                        v-model="appSettings.darkMode"
                        true-value="dark"
                        false-value="light"
                        @change="setThemePage"
                      />
                      <span class="slider round"></span>
                    </label>
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
  setTheme
} from '../service/userPreferences'

export default {
  name: 'SettingsView',
  data() {
    return {
      activeTab: sessionStorage.getItem('settingsActiveTab') || 'personal',
      appSettings: {
        language: getLanguage(),
        darkMode: getTheme() || 'light',
        preferredAI: getAIModel()
      }
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
    },
    updateLanguage(lang) {
      setLanguage(lang)
      this.$i18n.locale = lang
    },
    setThemePage() {
      setTheme(this.appSettings.darkMode)
    }
  }
}
</script>

<style scoped>
@import url('../assets/base.css');

.breadcrumb-item {
  color: var(--breadcrumb-color);
}

.containder-fluid{
  background-color: var(--container-bg);
}

.settings-container {
  max-width: 1200px;
}

.settings-section {
  animation: fadeIn 0.3s ease-in-out;
}

.settings-section {
  padding-top: 0;
}
.card {
  border-radius: 0;
  border-top: 1px solid var(--card-border);
  box-shadow: none;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.list-group-item.active {
  background-color: var(--list-active-bg);
  color: var(--list-active-color);
  border-color: var(--list-active-bg);
}

h3.title {
  color: var(--text-color);
}

.card {
  background-color: var(--card-bg);
  border-color: var(--card-border);
  color: var(--text-color);
}

.card-header {
  background-color: var(--card-header);
  border-bottom-color: var(--card-border);
  color: var(--text-color);
}

.list-group-item {
  background-color: var(--list-bg);
  color: var(--list-color);
  border-color: var(--list-border);
}

.form-control,
.form-select {
  background-color: var(--form-bg);
  color: var(--form-color);
  border-color: var(--form-border);
}

.modal-content {
  background-color: var(--modal-bg);
  color: var(--modal-color);
}

.modal-header {
  border-bottom-color: var(--modal-border);
  color: var(--modal-color);
}

/* Adicione ao seu CSS existente */
.alert-warning {
  background-color: var(--alert-warning-bg);
  border-left: 4px solid var(--alert-warning-border);
  color: var(--alert-warning-text); /* Texto mais claro para melhor contraste */
}

.alert-warning .bi-exclamation-triangle-fill {
  color: var(--alert-warning-icon); /* Mantém a cor do ícone consistente */
}

.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: '';
  height: 20px;
  width: 20px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #4f46e5;
}

input:checked + .slider:before {
  transform: translateX(24px);
}

.custom-select {
  transition:
    border-color 0.3s,
    box-shadow 0.3s;
  border-radius: 0.5rem;
}

.custom-select:focus {
  border-color: #6a11cb;
  box-shadow: 0 0 0 0.2rem rgba(106, 17, 203, 0.25);
}
</style>
