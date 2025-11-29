<template>
  <transition name="modal-fade">
    <div v-if="visible" class="modal-overlay" @click.self="closeModal">
      <div class="modal-container" :class="themeMode === 'dark' ? 'dark-theme' : 'light-theme'">
        <div class="modal-header">
          <div class="header-content">
            <div class="header-icon">
              <i class="bx bx-plug"></i>
            </div>
            <div>
              <h2 class="modal-title">Configurar Conexão Gemini</h2>
              <p class="modal-subtitle">Configure sua conexão com o Google Gemini</p>
            </div>
          </div>
          <button class="btn-close" @click="closeModal">
            <i class="bx bx-x"></i>
          </button>
        </div>

        <div class="modal-body">
          <!-- Connection Method Tabs -->
          <div class="connection-tabs">
            <button
              class="connection-tab"
              :class="{ active: connectionType === 'apikey' }"
              @click="connectionType = 'apikey'"
            >
              <i class="bx bx-key"></i>
              <span>API Key</span>
            </button>
            <button
              class="connection-tab"
              :class="{ active: connectionType === 'oauth' }"
              @click="connectionType = 'oauth'"
            >
              <i class="bx bxl-google"></i>
              <span>Conta Google</span>
            </button>
          </div>

          <!-- API Key Section -->
          <div v-if="connectionType === 'apikey'" class="connection-section">
            <div class="info-banner">
              <i class="bx bx-info-circle"></i>
              <div>
                <strong>Como obter sua API Key</strong>
                <p>
                  Acesse <a href="https://makersuite.google.com/app/apikey" target="_blank">Google AI Studio</a> 
                  e gere sua chave gratuitamente
                </p>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">
                <i class="bx bx-key me-2"></i>
                Chave da API
              </label>
              <div class="input-with-icon">
                <input
                  v-model="formData.apiKey"
                  :type="showApiKey ? 'text' : 'password'"
                  class="form-input"
                  placeholder="Digite sua API Key do Gemini"
                  @input="clearError"
                />
                <button
                  class="btn-toggle-visibility"
                  @click="showApiKey = !showApiKey"
                  type="button"
                >
                  <i class="bx" :class="showApiKey ? 'bx-hide' : 'bx-show'"></i>
                </button>
              </div>
              <span v-if="errors.apiKey" class="error-message">
                <i class="bx bx-error-circle"></i>
                {{ errors.apiKey }}
              </span>
            </div>

            <div class="form-group">
              <label class="form-label">
                <i class="bx bx-brain me-2"></i>
                Modelo Gemini
              </label>
              <div class="select-wrapper">
                <select v-model="formData.model" class="form-select">
                  <option value="gemini-pro">Gemini Pro</option>
                  <option value="gemini-pro-vision">Gemini Pro Vision</option>
                  <option value="gemini-ultra">Gemini Ultra</option>
                </select>
                <i class="bx bx-chevron-down select-icon"></i>
              </div>
            </div>

            <!-- Connection Status -->
            <div v-if="connectionStatus" class="status-banner" :class="connectionStatus.type">
              <i class="bx" :class="connectionStatus.icon"></i>
              <div>
                <strong>{{ connectionStatus.title }}</strong>
                <p>{{ connectionStatus.message }}</p>
              </div>
            </div>

            <!-- Test Connection Button -->
            <button
              class="btn-test"
              @click="testConnection"
              :disabled="!formData.apiKey || isTestingConnection"
            >
              <i class="bx" :class="isTestingConnection ? 'bx-loader-alt bx-spin' : 'bx-radio-circle-marked'"></i>
              {{ isTestingConnection ? 'Testando...' : 'Testar Conexão' }}
            </button>
          </div>

          <!-- OAuth Section -->
          <div v-else class="connection-section">
            <div class="oauth-container">
              <div class="oauth-icon">
                <i class="bx bxl-google"></i>
              </div>
              <h3 class="oauth-title">Conectar com Google</h3>
              <p class="oauth-description">
                Faça login com sua conta Google para usar o Gemini diretamente
              </p>

              <button class="btn-google" @click="handleGoogleLogin" :disabled="isConnectingOAuth">
                <i class="bx bxl-google"></i>
                {{ isConnectingOAuth ? 'Conectando...' : 'Continuar com Google' }}
              </button>

              <div v-if="formData.email" class="connected-account">
                <i class="bx bx-check-circle"></i>
                <div>
                  <strong>Conectado como</strong>
                  <p>{{ formData.email }}</p>
                </div>
                <button class="btn-disconnect" @click="disconnectGoogle">
                  <i class="bx bx-log-out"></i>
                </button>
              </div>

              <div class="oauth-features">
                <div class="feature">
                  <i class="bx bx-check"></i>
                  <span>Autenticação segura</span>
                </div>
                <div class="feature">
                  <i class="bx bx-check"></i>
                  <span>Sem necessidade de API Key</span>
                </div>
                <div class="feature">
                  <i class="bx bx-check"></i>
                  <span>Acesso a recursos premium</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-secondary" @click="closeModal">
            <i class="bx bx-x me-2"></i>
            Cancelar
          </button>
          <button
            class="btn-primary"
            @click="saveConnection"
            :disabled="!canSave || isSaving"
          >
            <i class="bx" :class="isSaving ? 'bx-loader-alt bx-spin me-2' : 'bx-save me-2'"></i>
            {{ isSaving ? 'Salvando...' : 'Salvar e Conectar' }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { getTheme } from '../../service/userPreferences'

export default {
  name: 'GeminiConnectionModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    currentConnection: {
      type: Object,
      default: () => ({
        apiKey: '',
        email: '',
        model: 'gemini-pro'
      })
    }
  },
  data() {
    return {
      themeMode: getTheme(),
      connectionType: 'apikey', // 'apikey' or 'oauth'
      showApiKey: false,
      formData: {
        apiKey: '',
        email: '',
        model: 'gemini-pro'
      },
      errors: {},
      isTestingConnection: false,
      isConnectingOAuth: false,
      isSaving: false,
      connectionStatus: null
    }
  },
  computed: {
    canSave() {
      if (this.connectionType === 'apikey') {
        return this.formData.apiKey.trim().length > 0 && this.connectionStatus?.type === 'success'
      } else {
        return this.formData.email.length > 0
      }
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.loadCurrentConnection()
        this.resetModal()
      }
    }
  },
  methods: {
    loadCurrentConnection() {
      if (this.currentConnection) {
        this.formData = { ...this.currentConnection }
        if (this.currentConnection.email) {
          this.connectionType = 'oauth'
        }
      }
    },
    resetModal() {
      this.errors = {}
      this.connectionStatus = null
      this.showApiKey = false
    },
    clearError() {
      this.errors.apiKey = ''
      this.connectionStatus = null
    },
    async testConnection() {
      if (!this.formData.apiKey.trim()) {
        this.errors.apiKey = 'Por favor, insira uma API Key'
        return
      }

      this.isTestingConnection = true
      this.connectionStatus = null

      try {
        // Simular teste de conexão - Substituir pela chamada real à API
        await this.simulateApiCall(2000)

        // Verificação básica de formato
        if (this.formData.apiKey.length < 20) {
          throw new Error('API Key inválida')
        }

        this.connectionStatus = {
          type: 'success',
          icon: 'bx-check-circle',
          title: 'Conexão bem-sucedida!',
          message: 'Sua API Key está funcionando corretamente'
        }
      } catch (error) {
        this.connectionStatus = {
          type: 'error',
          icon: 'bx-error-circle',
          title: 'Falha na conexão',
          message: error.message || 'Verifique sua API Key e tente novamente'
        }
      } finally {
        this.isTestingConnection = false
      }
    },
    async handleGoogleLogin() {
      this.isConnectingOAuth = true

      try {
        // Simular autenticação OAuth - Substituir pela implementação real
        await this.simulateApiCall(2000)

        // Em produção, aqui você implementaria o fluxo OAuth
        // const response = await window.api.authenticateWithGoogle()
        
        this.formData.email = 'usuario@gmail.com' // Exemplo
        
        this.$emit('notification', {
          type: 'success',
          message: 'Conectado com sucesso!'
        })
      } catch (error) {
        this.$emit('notification', {
          type: 'error',
          message: 'Erro ao conectar com Google'
        })
      } finally {
        this.isConnectingOAuth = false
      }
    },
    disconnectGoogle() {
      this.formData.email = ''
      this.$emit('notification', {
        type: 'info',
        message: 'Conta desconectada'
      })
    },
    async saveConnection() {
      this.isSaving = true

      try {
        await this.simulateApiCall(1000)

        const connectionConfig = {
          type: this.connectionType,
          ...this.formData
        }

        this.$emit('save', connectionConfig)
        this.$emit('notification', {
          type: 'success',
          message: 'Conexão salva com sucesso!'
        })
      } catch (error) {
        this.$emit('notification', {
          type: 'error',
          message: 'Erro ao salvar conexão'
        })
      } finally {
        this.isSaving = false
      }
    },
    closeModal() {
      this.$emit('close')
    },
    // Função auxiliar para simular chamadas de API
    simulateApiCall(delay) {
      return new Promise((resolve) => setTimeout(resolve, delay))
    }
  }
}
</script>

<style scoped>
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

/* Modal Container */
.modal-container {
  background: var(--card-element-bg);
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Modal Header */
.modal-header {
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--card-border, rgba(0, 0, 0, 0.1));
  background: linear-gradient(135deg, rgba(66, 133, 244, 0.05) 0%, rgba(52, 168, 83, 0.05) 100%);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4285f4 0%, #34a853 100%);
  border-radius: 14px;
  color: white;
  font-size: 1.75rem;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
}

.modal-subtitle {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin: 0;
}

.btn-close {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid var(--card-border, rgba(0, 0, 0, 0.1));
  border-radius: 10px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1.5rem;
}

.btn-close:hover {
  background: var(--card-header, rgba(0, 0, 0, 0.05));
  color: #ea4335;
  transform: rotate(90deg);
}

/* Modal Body */
.modal-body {
  padding: 2rem;
  overflow-y: auto;
  flex: 1;
}

/* Connection Tabs */
.connection-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
}

.connection-tab {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--card-header, rgba(0, 0, 0, 0.05));
  border: 2px solid var(--card-border, rgba(0, 0, 0, 0.1));
  border-radius: 12px;
  color: var(--text-primary);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.connection-tab i {
  font-size: 1.5rem;
}

.connection-tab:hover {
  background: var(--card-border, rgba(0, 0, 0, 0.1));
  transform: translateY(-2px);
}

.connection-tab.active {
  background: linear-gradient(135deg, rgba(66, 133, 244, 0.1) 0%, rgba(52, 168, 83, 0.1) 100%);
  border-color: #4285f4;
  color: #4285f4;
}

/* Connection Section */
.connection-section {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Info Banner */
.info-banner {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(66, 133, 244, 0.1) 0%, rgba(52, 168, 83, 0.1) 100%);
  border: 1px solid rgba(66, 133, 244, 0.3);
  border-radius: 12px;
  margin-bottom: 1.5rem;
}

.info-banner i {
  font-size: 1.5rem;
  color: #4285f4;
  flex-shrink: 0;
}

.info-banner strong {
  display: block;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.info-banner p {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin: 0;
}

.info-banner a {
  color: #4285f4;
  text-decoration: none;
  font-weight: 600;
}

.info-banner a:hover {
  text-decoration: underline;
}

/* Form Group */
.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.form-input {
  width: 100%;
  padding: 0.875rem 3rem 0.875rem 1rem;
  border: 2px solid var(--card-border, rgba(0, 0, 0, 0.1));
  border-radius: 12px;
  background: var(--form-bg);
  color: var(--text-primary);
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.form-input:hover {
  border-color: #4285f4;
}

.form-input:focus {
  outline: none;
  border-color: #4285f4;
  box-shadow: 0 0 0 4px rgba(66, 133, 244, 0.1);
}

.btn-toggle-visibility {
  position: absolute;
  right: 0.5rem;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-toggle-visibility:hover {
  background: var(--card-header, rgba(0, 0, 0, 0.05));
  color: #4285f4;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #ea4335;
  font-size: 0.85rem;
  margin-top: 0.5rem;
}

/* Select Wrapper */
.select-wrapper {
  position: relative;
}

.form-select {
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

.form-select:hover {
  border-color: #4285f4;
}

.form-select:focus {
  outline: none;
  border-color: #4285f4;
  box-shadow: 0 0 0 4px rgba(66, 133, 244, 0.1);
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

/* Status Banner */
.status-banner {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
}

.status-banner i {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.status-banner strong {
  display: block;
  margin-bottom: 0.25rem;
}

.status-banner p {
  font-size: 0.9rem;
  margin: 0;
}

.status-banner.success {
  background: linear-gradient(135deg, rgba(52, 168, 83, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%);
  border: 1px solid rgba(52, 168, 83, 0.3);
}

.status-banner.success i {
  color: #34a853;
}

.status-banner.error {
  background: linear-gradient(135deg, rgba(234, 67, 53, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%);
  border: 1px solid rgba(234, 67, 53, 0.3);
}

.status-banner.error i {
  color: #ea4335;
}

/* Test Button */
.btn-test {
  width: 100%;
  padding: 0.875rem;
  background: linear-gradient(135deg, rgba(66, 133, 244, 0.1) 0%, rgba(52, 168, 83, 0.1) 100%);
  border: 2px solid #4285f4;
  border-radius: 12px;
  color: #4285f4;
  font-weight: 600;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-test:hover:not(:disabled) {
  background: linear-gradient(135deg, #4285f4 0%, #34a853 100%);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 133, 244, 0.3);
}

.btn-test:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.bx-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* OAuth Container */
.oauth-container {
  text-align: center;
  padding: 2rem 0;
}

.oauth-icon {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4285f4 0%, #34a853 100%);
  border-radius: 50%;
  margin: 0 auto 1.5rem;
  color: white;
  font-size: 2.5rem;
}

.oauth-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.oauth-description {
  color: var(--text-muted);
  margin-bottom: 2rem;
}

.btn-google {
  width: 100%;
  padding: 1rem;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  color: #5f6368;
  font-weight: 600;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.btn-google:hover:not(:disabled) {
  background: #f8f9fa;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.btn-google:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-google i {
  font-size: 1.5rem;
  color: #4285f4;
}

/* Connected Account */
.connected-account {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(52, 168, 83, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%);
  border: 1px solid rgba(52, 168, 83, 0.3);
  border-radius: 12px;
  margin-top: 1.5rem;
}

.connected-account i:first-child {
  font-size: 1.5rem;
  color: #34a853;
}

.connected-account > div {
  flex: 1;
  text-align: left;
}

.connected-account strong {
  display: block;
  color: var(--text-primary);
  font-size: 0.85rem;
  margin-bottom: 0.25rem;
}

.connected-account p {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.btn-disconnect {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid var(--card-border, rgba(0, 0, 0, 0.1));
  border-radius: 8px;
  color: #ea4335;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-disconnect:hover {
  background: rgba(234, 67, 53, 0.1);
}

/* OAuth Features */
.oauth-features {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.feature {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-align: left;
}

.feature i {
  font-size: 1.25rem;
  color: #34a853;
}

.feature span {
  color: var(--text-muted);
  font-size: 0.9rem;
}

/* Modal Footer */
.modal-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid var(--card-border, rgba(0, 0, 0, 0.1));
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  background: var(--card-header, rgba(0, 0, 0, 0.02));
}

.btn-secondary,
.btn-primary {
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  font-size: 0.95rem;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary {
  background: transparent;
  border: 2px solid var(--card-border, rgba(0, 0, 0, 0.1));
  color: var(--text-primary);
}

.btn-secondary:hover {
  background: var(--card-header, rgba(0, 0, 0, 0.05));
}

.btn-primary {
  background: linear-gradient(135deg, #4285f4 0%, #34a853 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(66, 133, 244, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(66, 133, 244, 0.4);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Modal Fade Transition */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-container,
.modal-fade-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-fade-enter-from .modal-container,
.modal-fade-leave-to .modal-container {
  transform: translateY(-30px) scale(0.95);
}

/* Scrollbar */
.modal-body::-webkit-scrollbar {
  width: 6px;
}

.modal-body::-webkit-scrollbar-track {
  background: transparent;
}

.modal-body::-webkit-scrollbar-thumb {
  background: var(--card-border, rgba(0, 0, 0, 0.2));
  border-radius: 10px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}

/* Responsividade */
@media (max-width: 768px) {
  .modal-container {
    max-width: 100%;
    margin: 0;
    border-radius: 20px 20px 0 0;
    max-height: 95vh;
  }

  .modal-header {
    padding: 1.5rem;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
  }

  .header-icon {
    width: 48px;
    height: 48px;
    font-size: 1.5rem;
  }

  .modal-title {
    font-size: 1.25rem;
  }

  .modal-body {
    padding: 1.5rem;
  }

  .connection-tabs {
    gap: 0.75rem;
  }

  .connection-tab {
    padding: 0.875rem;
    font-size: 0.9rem;
  }

  .modal-footer {
    padding: 1rem 1.5rem;
    flex-direction: column;
  }

  .btn-secondary,
  .btn-primary {
    width: 100%;
    justify-content: center;
  }
}

/* Dark Theme Adjustments */
.dark-theme .btn-google {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
}

.dark-theme .btn-google:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
}

.dark-theme .btn-close:hover {
  background: rgba(255, 255, 255, 0.05);
}

.dark-theme .btn-toggle-visibility:hover {
  background: rgba(255, 255, 255, 0.05);
}

.dark-theme .connection-tab {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

.dark-theme .connection-tab:hover {
  background: rgba(255, 255, 255, 0.1);
}

.dark-theme .btn-secondary {
  border-color: rgba(255, 255, 255, 0.1);
}

.dark-theme .btn-secondary:hover {
  background: rgba(255, 255, 255, 0.05);
}

/* Loading State */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-radius: 20px;
}

.dark-theme .loading-overlay {
  background: rgba(0, 0, 0, 0.9);
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid var(--card-border, rgba(0, 0, 0, 0.1));
  border-top-color: #4285f4;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
</style>