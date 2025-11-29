<template>
  <div>
    <!-- Modal -->
    <div
      v-if="visible"
      class="modal fade show d-block"
      tabindex="-1"
      aria-labelledby="modalTitle"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <!-- Header -->
          <div class="modal-header">
            <div class="modal-header-content">
              <div class="modal-icon-wrapper">
                <i class="bx bx-link-alt"></i>
              </div>
              <div>
                <h5 class="modal-title" id="modalTitle">{{ titleModal }} Link</h5>
                <p class="modal-subtitle">Preencha as informações do link</p>
              </div>
            </div>
            <button type="button" class="btn-close-custom" @click="closeModal" aria-label="Close">
              <i class="bx bx-x"></i>
            </button>
          </div>

          <!-- Body -->
          <div class="modal-body">
            <!-- URL Field -->
            <div class="form-group" :class="{ 'has-error': errors.link }">
              <label for="link" class="form-label">
                <i class="bx bx-link"></i>
                <span>URL do Link</span>
                <span class="required">*</span>
              </label>
              <div class="input-wrapper">
                <input
                  id="link"
                  v-model="link.link"
                  type="url"
                  class="form-control-custom"
                  placeholder="https://exemplo.com"
                  @input="clearError('link')"
                  @blur="validateUrl"
                />
                <button
                  v-if="link.link && !isLoadingAI"
                  class="btn-clear"
                  @click="clearField('link')"
                  title="Limpar campo"
                >
                  <i class="bx bx-x"></i>
                </button>
              </div>
              <span v-if="errors.link" class="error-message">
                <i class="bx bx-error-circle"></i>
                {{ errors.link }}
              </span>
            </div>

            <!-- AI Auto-fill Button -->
            <div class="ai-section">
              <button
                type="button"
                class="btn-ai"
                :disabled="!link.link || isLoadingAI"
                @click="autoFillWithAI"
                title="Preencher automaticamente com IA"
              >
                <i class="bx" :class="isLoadingAI ? 'bx-loader-alt bx-spin' : 'bx-brain'"></i>
                <span v-if="!isLoadingAI">Preencher com IA</span>
                <span v-else>Gerando...</span>
              </button>
              <span class="ai-hint">
                <i class="bx bx-info-circle"></i>
                A IA irá analisar o link e gerar título e descrição automaticamente
              </span>
            </div>

            <!-- Name Field -->
            <div class="form-group" :class="{ 'has-error': errors.name }">
              <label for="linkName" class="form-label">
                <i class="bx bx-text"></i>
                <span>Nome do Link</span>
                <span class="required">*</span>
              </label>
              <div class="input-wrapper">
                <input
                  id="linkName"
                  v-model="link.name"
                  type="text"
                  class="form-control-custom"
                  placeholder="Ex: Documentação oficial do Vue.js"
                  @input="clearError('name')"
                  maxlength="100"
                />
                <span class="char-count">{{ link.name.length }}/100</span>
              </div>
              <span v-if="errors.name" class="error-message">
                <i class="bx bx-error-circle"></i>
                {{ errors.name }}
              </span>
            </div>

            <!-- Description Field -->
            <div class="form-group" :class="{ 'has-error': errors.description }">
              <label for="linkDescription" class="form-label">
                <i class="bx bx-detail"></i>
                <span>Descrição</span>
                <span class="required">*</span>
              </label>
              <div class="input-wrapper">
                <textarea
                  id="linkDescription"
                  v-model="link.description"
                  class="form-control-custom textarea-custom"
                  placeholder="Descreva brevemente sobre o que é este link..."
                  rows="4"
                  @input="clearError('description')"
                  maxlength="500"
                ></textarea>
                <span class="char-count">{{ link.description.length }}/500</span>
              </div>
              <span v-if="errors.description" class="error-message">
                <i class="bx bx-error-circle"></i>
                {{ errors.description }}
              </span>
            </div>
          </div>

          <!-- Footer -->
          <div class="modal-footer">
            <button type="button" class="btn-modal btn-cancel" @click="closeModal">
              <i class="bx bx-x"></i>
              <span>Cancelar</span>
            </button>
            <button type="button" class="btn-modal btn-submit" @click="submitLink">
              <i class="bx" :class="linkId !== NO_LINK_ID ? 'bx-check' : 'bx-plus'"></i>
              <span>{{ titleModal }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="visible" class="modal-backdrop fade show" @click="closeModal"></div>
  </div>
</template>

<script>
import SystemController from '../../controller/SystemController'
import Link from '../../model/entity/link'

const NO_LINK_ID = -1

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    linkId: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      NO_LINK_ID,
      titleModal: this.linkId !== NO_LINK_ID ? 'Editar' : 'Adicionar',
      link: new Link(NO_LINK_ID, '', '', ''),
      errors: {
        name: '',
        description: '',
        link: ''
      },
      isLoadingAI: false
    }
  },
  created() {
    if (this.linkId !== NO_LINK_ID) {
      const storedLinks = SystemController.getStorage('linksStorage')
      const storedLink = storedLinks.find((v) => v.id === this.linkId)
      if (storedLink) {
        this.link = new Link(
          storedLink.id,
          storedLink.name,
          storedLink.description,
          storedLink.link
        )
      }
    }
  },
  methods: {
    closeModal() {
      this.link = new Link(NO_LINK_ID, '', '', '')
      this.errors = { name: '', description: '', link: '' }
      this.$emit('close')
    },

    clearError(field) {
      this.errors[field] = ''
    },

    clearField(field) {
      this.link[field] = ''
      this.clearError(field)
    },

    validateUrl() {
      if (!this.link.link) {
        this.errors.link = 'A URL é obrigatória'
        return false
      }

      try {
        new URL(this.link.link)
        this.errors.link = ''
        return true
      } catch {
        this.errors.link = 'URL inválida. Use o formato: https://exemplo.com'
        return false
      }
    },

    validateForm() {
      let isValid = true

      // Validate URL
      if (!this.link.link || !this.link.link.trim()) {
        this.errors.link = 'A URL é obrigatória'
        isValid = false
      } else if (!this.validateUrl()) {
        isValid = false
      }

      // Validate Name
      if (!this.link.name || !this.link.name.trim()) {
        this.errors.name = 'O nome do link é obrigatório'
        isValid = false
      } else if (this.link.name.trim().length < 3) {
        this.errors.name = 'O nome deve ter pelo menos 3 caracteres'
        isValid = false
      }

      // Validate Description
      if (!this.link.description || !this.link.description.trim()) {
        this.errors.description = 'A descrição é obrigatória'
        isValid = false
      } else if (this.link.description.trim().length < 10) {
        this.errors.description = 'A descrição deve ter pelo menos 10 caracteres'
        isValid = false
      }

      return isValid
    },

    async autoFillWithAI() {
      // Validação inicial
      if (!this.link.link) {
        this.errors.link = 'Insira uma URL válida antes de usar a IA'
        return
      }

      if (!this.validateUrl()) {
        return
      }

      this.isLoadingAI = true

      try {
        // Construção do prompt
        const prompt = `Analise esta URL: ${this.link.link}

Com base no domínio e caminho da URL, gere:
1. Um título descritivo e conciso (máximo 80 caracteres)
2. Uma descrição informativa (entre 50-200 caracteres)

IMPORTANTE: Responda APENAS com um objeto JSON válido, sem texto adicional, no seguinte formato:
{
  "title": "título aqui",
  "description": "descrição aqui"
}

Não inclua texto antes ou depois do JSON.`

        // Chamada via Bridge (Electron IPC)
        // O response aqui deve ser a string de texto retornada pela IA
        const responseText = await window.chatAPI.sendMessage(prompt)

        if (!responseText) {
          throw new Error('A IA não retornou conteúdo.')
        }

        // Limpeza de blocos de código markdown (caso a IA envie ```json ... ```)
        const cleanedText = responseText.replace(/```json\n?|\n?```/g, '').trim()

        // Parse do JSON
        const aiData = JSON.parse(cleanedText)

        if (aiData.title) {
          this.link.name = aiData.title.substring(0, 100)
          this.clearError('name')
        }

        if (aiData.description) {
          this.link.description = aiData.description.substring(0, 500)
          this.clearError('description')
        }
      } catch (error) {
        console.error('Erro ao preencher com IA:', error)
        this.errors.link =
          'Não foi possível gerar conteúdo com IA. Verifique a conexão ou a chave API.'
      } finally {
        this.isLoadingAI = false
      }
    },

    submitLink() {
      if (!this.validateForm()) {
        return
      }

      const linkData = {
        ...this.link.toDTO(),
        id: this.generateId()
      }

      if (this.linkId !== NO_LINK_ID) {
        SystemController.editLink({ ...linkData, id: this.linkId })
      } else {
        SystemController.addLink(linkData)
      }

      this.closeModal()
    },

    generateId() {
      return (
        Date.now().toString(36) +
        Math.floor(Math.random() * 1000)
          .toString(36)
          .padStart(4, '0')
      )
    }
  }
}
</script>

<style scoped>
/* Modal Base */
.modal {
  overflow-y: auto;
}

.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  z-index: 1040;
}

.modal-dialog {
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  margin: 2rem auto;
  max-width: 600px;
}

.modal-content {
  background: var(--card-element-bg, #1a1a1a);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-50px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Modal Header */
.modal-header {
  padding: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.modal-header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.modal-icon-wrapper {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary, #fff);
  margin: 0;
}

.modal-subtitle {
  font-size: 0.875rem;
  color: var(--text-muted, #999);
  margin: 0.25rem 0 0 0;
}

.btn-close-custom {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-muted, #999);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.btn-close-custom:hover {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  transform: rotate(90deg);
}

.btn-close-custom i {
  font-size: 1.5rem;
}

/* Modal Body */
.modal-body {
  padding: 2rem;
  max-height: calc(100vh - 300px);
  overflow-y: auto;
}

.modal-body::-webkit-scrollbar {
  width: 6px;
}

.modal-body::-webkit-scrollbar-track {
  background: transparent;
}

.modal-body::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

/* Form Groups */
.form-group {
  margin-bottom: 1.5rem;
}

.form-group.has-error .form-control-custom,
.form-group.has-error .textarea-custom {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.05);
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary, #fff);
  margin-bottom: 0.5rem;
}

.form-label i {
  font-size: 1.1rem;
  color: #667eea;
}

.required {
  color: #ef4444;
  font-weight: 700;
}

/* Input Wrapper */
.input-wrapper {
  position: relative;
}

.form-control-custom {
  width: 100%;
  padding: 0.875rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: var(--text-primary, #fff);
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.form-control-custom:focus {
  outline: none;
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.05);
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.form-control-custom::placeholder {
  color: var(--text-muted, #666);
}

.textarea-custom {
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  line-height: 1.6;
}

.char-count {
  position: absolute;
  bottom: 0.75rem;
  right: 1rem;
  font-size: 0.75rem;
  color: var(--text-muted, #666);
  pointer-events: none;
}

.textarea-custom + .char-count {
  bottom: 0.75rem;
}

.btn-clear {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-muted, #999);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-clear:hover {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.btn-clear i {
  font-size: 1.2rem;
}

/* Error Message */
.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: #ef4444;
  animation: errorShake 0.3s ease;
}

@keyframes errorShake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}

.error-message i {
  font-size: 1rem;
}

/* AI Section */
.ai-section {
  margin: 1.5rem 0;
  padding: 1.25rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%);
  border: 2px dashed rgba(102, 126, 234, 0.3);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.btn-ai {
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 10px;
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-ai:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-ai:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-ai i {
  font-size: 1.5rem;
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

.ai-hint {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--text-muted, #999);
  line-height: 1.5;
}

.ai-hint i {
  font-size: 1rem;
  margin-top: 0.1rem;
  flex-shrink: 0;
  color: #667eea;
}

/* Modal Footer */
.modal-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-modal {
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-muted, #999);
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary, #fff);
}

.btn-submit {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-modal i {
  font-size: 1.2rem;
}

/* Responsive */
@media (max-width: 768px) {
  .modal-dialog {
    margin: 1rem;
  }

  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 1.5rem;
  }

  .modal-title {
    font-size: 1.25rem;
  }

  .btn-modal {
    padding: 0.65rem 1.25rem;
    font-size: 0.9rem;
  }
}
</style>
