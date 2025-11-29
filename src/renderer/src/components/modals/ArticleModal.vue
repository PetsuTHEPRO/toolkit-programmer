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
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <!-- Header -->
          <div class="modal-header">
            <div class="modal-header-content">
              <div class="modal-icon-wrapper">
                <i class="bx bx-file-blank"></i>
              </div>
              <div>
                <h5 class="modal-title" id="modalTitle">{{ titleModal }} Artigo</h5>
                <p class="modal-subtitle">
                  {{
                    isEditMode ? 'Edite as informações do artigo' : 'Adicione um novo artigo PDF'
                  }}
                </p>
              </div>
            </div>
            <button type="button" class="btn-close-custom" @click="closeModal" aria-label="Close">
              <i class="bx bx-x"></i>
            </button>
          </div>

          <!-- Body -->
          <div class="modal-body">
            <div class="row">
              <!-- Left Column - Form -->
              <div class="col-md-5">
                <!-- Name Field -->
                <div class="form-group" :class="{ 'has-error': errors.name }">
                  <label for="name" class="form-label">
                    <i class="bx bx-text"></i>
                    <span>Nome do Artigo</span>
                    <span class="required">*</span>
                  </label>
                  <div class="input-wrapper">
                    <input
                      type="text"
                      class="form-control-custom"
                      id="name"
                      v-model="article.name"
                      placeholder="Ex: Introdução ao Machine Learning"
                      @input="clearError('name')"
                      maxlength="150"
                    />
                    <span class="char-count">{{ article.name.length }}/150</span>
                  </div>
                  <span v-if="errors.name" class="error-message">
                    <i class="bx bx-error-circle"></i>
                    {{ errors.name }}
                  </span>
                </div>

                <!-- Description Field -->
                <div class="form-group" :class="{ 'has-error': errors.description }">
                  <label for="description" class="form-label">
                    <i class="bx bx-detail"></i>
                    <span>Descrição</span>
                    <span class="required">*</span>
                  </label>
                  <div class="input-wrapper">
                    <textarea
                      class="form-control-custom textarea-custom"
                      id="description"
                      v-model="article.description"
                      placeholder="Descreva o conteúdo do artigo..."
                      rows="5"
                      @input="clearError('description')"
                      maxlength="500"
                    ></textarea>
                    <span class="char-count">{{ article.description.length }}/500</span>
                  </div>
                  <span v-if="errors.description" class="error-message">
                    <i class="bx bx-error-circle"></i>
                    {{ errors.description }}
                  </span>
                </div>

                <!-- AI Auto-fill Button -->
                <div v-if="article.pdfFilename" class="ai-section">
                  <button
                    type="button"
                    class="btn-ai"
                    :disabled="isLoadingAI"
                    @click="autoFillWithAI"
                    title="Preencher automaticamente com IA"
                  >
                    <i class="bx" :class="isLoadingAI ? 'bx-loader-alt bx-spin' : 'bx-brain'"></i>
                    <span v-if="!isLoadingAI">Gerar Descrição com IA</span>
                    <span v-else>Analisando PDF...</span>
                  </button>
                  <span class="ai-hint">
                    <i class="bx bx-info-circle"></i>
                    A IA irá analisar o PDF e gerar título e descrição
                  </span>
                </div>

                <!-- PDF Upload Field -->
                <div v-if="!isEditMode" class="form-group" :class="{ 'has-error': errors.file }">
                  <label for="materialPdf" class="form-label">
                    <i class="bx bx-file"></i>
                    <span>Arquivo PDF</span>
                    <span class="required">*</span>
                  </label>
                  <div class="file-upload-wrapper">
                    <input
                      id="materialPdf"
                      type="file"
                      class="file-input"
                      accept="application/pdf"
                      @change="handleFileUpload"
                      ref="fileInput"
                    />
                    <button type="button" class="btn-file-upload" @click="$refs.fileInput.click()">
                      <i class="bx bx-upload"></i>
                      <span>{{ article.pdfFilename ? 'Alterar PDF' : 'Selecionar PDF' }}</span>
                    </button>
                  </div>
                  <span v-if="errors.file" class="error-message">
                    <i class="bx bx-error-circle"></i>
                    {{ errors.file }}
                  </span>
                </div>

                <!-- File Info -->
                <div v-if="article.pdfFilename" class="file-info-card">
                  <div class="file-info-header">
                    <i class="bx bx-file-blank"></i>
                    <span class="file-name">{{ article.pdfFilename }}</span>
                  </div>
                  <div class="file-info-details">
                    <span class="file-size">
                      <i class="bx bx-data"></i>
                      {{ article.pdfSize }}
                    </span>
                    <button
                      v-if="!isEditMode"
                      type="button"
                      class="btn-remove-file"
                      @click="removeFile"
                      title="Remover arquivo"
                    >
                      <i class="bx bx-trash"></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Right Column - PDF Preview -->
              <div class="col-md-7">
                <div class="preview-section">
                  <div class="preview-header">
                    <i class="bx bx-show"></i>
                    <span>Preview do PDF</span>
                  </div>
                  <div class="preview-container">
                    <webview
                      v-if="pdfPreviewUrl"
                      :src="pdfPreviewUrl"
                      class="pdf-preview"
                    ></webview>
                    <div v-else class="preview-placeholder">
                      <i class="bx bx-file-blank"></i>
                      <p>Nenhum PDF selecionado</p>
                      <span>Faça upload de um arquivo PDF para visualizar</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="modal-footer">
            <button type="button" class="btn-modal btn-cancel" @click="closeModal">
              <i class="bx bx-x"></i>
              <span>Cancelar</span>
            </button>
            <button type="button" class="btn-modal btn-submit" @click="submitArticle">
              <i class="bx" :class="isEditMode ? 'bx-check' : 'bx-plus'"></i>
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
import Article from '../../model/entity/article'

const NO_ARTICLE_ID = -1

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    idArticle: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      titleModal: 'Adicionar',
      article: new Article(-1, '', '', null, '', ''),
      selectedFilePath: null,
      errors: {
        name: '',
        description: '',
        file: ''
      },
      isLoadingAI: false
    }
  },
  computed: {
    isEditMode() {
      return this.idArticle !== NO_ARTICLE_ID
    },
    pdfPreviewUrl() {
      if (this.article.path) {
        return `app://${this.article.path}`
      }
      return null
    }
  },
  created() {
    if (this.isEditMode) {
      this.titleModal = 'Editar'
      this.loadArticleForEditing()
    } else {
      this.titleModal = 'Adicionar'
      this.resetForm()
    }
  },
  methods: {
    resetForm() {
      this.article = new Article(-1, '', '', null, '', '')
      this.selectedFilePath = null
      this.errors = { name: '', description: '', file: '' }
    },

    closeModal() {
      this.resetForm()
      this.$emit('close')
    },

    clearError(field) {
      this.errors[field] = ''
    },

    loadArticleForEditing() {
      const storedArticles = this.$store.getters.getStorage('articlesStorage')
      const storedArticle = storedArticles.find((v) => v.id === this.idArticle)
      if (storedArticle) {
        this.article = new Article(
          storedArticle.id,
          storedArticle.name,
          storedArticle.description,
          storedArticle.path,
          storedArticle.pdfFilename,
          storedArticle.pdfSize
        )
      }
    },

    handleFileUpload(event) {
      const file = event.target.files[0]
      if (file) {
        if (file.type !== 'application/pdf') {
          this.errors.file = 'Por favor, selecione apenas arquivos PDF'
          return
        }

        if (file.size > 50 * 1024 * 1024) {
          // 50MB
          this.errors.file = 'O arquivo não pode ser maior que 50MB'
          return
        }

        this.selectedFilePath = file.path
        this.article = new Article(
          this.article.id,
          this.article.name,
          this.article.description,
          file.path,
          file.name,
          `${(file.size / 1024).toFixed(2)} KB`
        )
        this.clearError('file')
      }
    },

    removeFile() {
      this.article.path = null
      this.article.pdfFilename = ''
      this.article.pdfSize = ''
      this.selectedFilePath = null
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = ''
      }
    },

    validateForm() {
      let isValid = true

      if (!this.article.name || !this.article.name.trim()) {
        this.errors.name = 'O nome do artigo é obrigatório'
        isValid = false
      } else if (this.article.name.trim().length < 3) {
        this.errors.name = 'O nome deve ter pelo menos 3 caracteres'
        isValid = false
      }

      if (!this.article.description || !this.article.description.trim()) {
        this.errors.description = 'A descrição é obrigatória'
        isValid = false
      } else if (this.article.description.trim().length < 10) {
        this.errors.description = 'A descrição deve ter pelo menos 10 caracteres'
        isValid = false
      }

      if (!this.isEditMode && !this.selectedFilePath) {
        this.errors.file = 'Por favor, selecione um arquivo PDF'
        isValid = false
      }

      return isValid
    },

    async autoFillWithAI() {
      // Validação inicial
      if (!this.article.pdfFilename) {
        // Certifique-se que 'file' é a chave correta no seu objeto 'errors'
        this.errors.file = 'Selecione um PDF primeiro para usar a IA'
        return
      }

      this.isLoadingAI = true

      try {
        // Construção do prompt
        const prompt = `Com base no nome do arquivo PDF: "${this.article.pdfFilename}"

Gere:
1. Um título apropriado e descritivo para o artigo (máximo 100 caracteres)
2. Uma descrição informativa sobre o possível conteúdo (entre 100-300 caracteres)

IMPORTANTE: Responda APENAS com um objeto JSON válido, sem texto adicional, no seguinte formato:
{
  "title": "título aqui",
  "description": "descrição aqui"
}

Não inclua texto antes ou depois do JSON.`

        // Chamada via Bridge (Electron IPC)
        const responseText = await window.chatAPI.sendMessage(prompt)

        if (!responseText) {
          throw new Error('A IA não retornou conteúdo.')
        }

        // Limpeza de blocos de código markdown e espaços
        const cleanedText = responseText.replace(/```json\n?|\n?```/g, '').trim()

        // Parse do JSON
        const aiData = JSON.parse(cleanedText)

        // Preenchimento dos campos
        if (aiData.title) {
          this.article.name = aiData.title.substring(0, 150)
          this.clearError('name')
        }

        if (aiData.description) {
          this.article.description = aiData.description.substring(0, 500)
          this.clearError('description')
        }
      } catch (error) {
        console.error('Erro ao preencher com IA:', error)
        // Ajustei a mensagem de erro para ser genérica sobre a conexão/serviço
        this.errors.description = 'Não foi possível gerar conteúdo com IA. Verifique a conexão.'
      } finally {
        this.isLoadingAI = false
      }
    },

    async submitArticle() {
      if (!this.validateForm()) {
        return
      }

      let finalArticlePath = this.article.path

      if (this.selectedFilePath) {
        try {
          finalArticlePath = await window.api.files.handleFileUpload(this.selectedFilePath)
        } catch (error) {
          console.error('Erro no upload:', error)
          this.errors.file = 'Erro ao fazer upload do arquivo'
          return
        }
      }

      if (this.idArticle === NO_ARTICLE_ID && !finalArticlePath) {
        this.errors.file = 'Por favor, anexe um documento para o novo artigo'
        return
      }

      const articleData = {
        id: this.generateId(),
        name: this.article.name,
        description: this.article.description,
        path: finalArticlePath,
        pdfFilename: this.article.pdfFilename,
        pdfSize: this.article.pdfSize
      }

      if (this.idArticle !== NO_ARTICLE_ID) {
        SystemController.editArticle({ ...articleData, id: this.idArticle })
      } else {
        SystemController.addArticle(articleData)
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
  max-width: 1200px;
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
  min-height: 120px;
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

/* File Upload */
.file-upload-wrapper {
  position: relative;
}

.file-input {
  display: none;
}

.btn-file-upload {
  width: 100%;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border: 2px dashed rgba(102, 126, 234, 0.3);
  border-radius: 12px;
  color: var(--text-primary, #fff);
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-file-upload:hover {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);
  border-color: #667eea;
}

.btn-file-upload i {
  font-size: 1.5rem;
}

/* File Info Card */
.file-info-card {
  background: rgba(102, 126, 234, 0.08);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 12px;
  padding: 1rem;
  margin-top: 1rem;
}

.file-info-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.file-info-header i {
  font-size: 1.5rem;
  color: #667eea;
}

.file-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary, #fff);
  word-break: break-word;
}

.file-info-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.file-size {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-muted, #999);
}

.btn-remove-file {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-remove-file:hover {
  background: #ef4444;
  color: white;
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

/* Preview Section */
.preview-section {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px 12px 0 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: none;
  font-weight: 600;
  color: var(--text-primary, #fff);
}

.preview-header i {
  font-size: 1.25rem;
  color: #667eea;
}

.preview-container {
  flex: 1;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0 0 12px 12px;
  overflow: hidden;
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pdf-preview {
  width: 100%;
  height: 100%;
  min-height: 500px;
  border: none;
}

.preview-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
}

.preview-placeholder i {
  font-size: 5rem;
  color: var(--text-muted, #666);
  opacity: 0.3;
  margin-bottom: 1rem;
}

.preview-placeholder p {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary, #fff);
  margin-bottom: 0.5rem;
}

.preview-placeholder span {
  font-size: 0.9rem;
  color: var(--text-muted, #999);
}

/* Modal Footer */
.modal-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

/* Modal Footer Buttons */
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
  transition: all 0.3s ease;
}

/* Cancel Button */
.btn-cancel {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-muted, #bbb);
}

.btn-cancel:hover {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

/* Submit Button */
.btn-submit {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(102, 126, 234, 0.4);
}

/* Responsive */
@media (max-width: 991px) {
  .modal-dialog {
    margin: 1rem;
  }

  .preview-container {
    min-height: 300px;
  }
}

@media (max-width: 768px) {
  .modal-body {
    padding: 1.5rem;
  }

  .modal-header {
    padding: 1.5rem;
  }

  .modal-footer {
    padding: 1.25rem 1.5rem;
  }
}

@media (max-width: 576px) {
  .modal-header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .btn-modal {
    width: 100%;
    justify-content: center;
  }

  .modal-footer {
    flex-direction: column-reverse;
  }
}
</style>
