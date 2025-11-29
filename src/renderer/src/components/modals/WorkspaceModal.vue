<template>
  <transition name="modal-fade">
    <div v-if="visible" class="modal-overlay" @click.self="closeModal">
      <div class="modal-container" :class="themeMode === 'dark' ? 'dark-theme' : 'light-theme'">
        
        <!-- HEADER -->
        <div class="modal-header">
          <div class="header-content">
            <div class="header-icon" :style="{ background: formData.color }">
              <i :class="formData.icon"></i>
            </div>
            <div>
              <h2 class="modal-title">
                {{ isEditing ? 'Editar Área de Trabalho' : 'Nova Área de Trabalho' }}
              </h2>
              <p class="modal-subtitle">
                {{ isEditing ? 'Atualize as informações do workspace' : 'Crie um novo ambiente organizado para seu projeto' }}
              </p>
            </div>
          </div>
          <button class="btn-close" @click="closeModal">
            <i class="bx bx-x"></i>
          </button>
        </div>

        <!-- BODY -->
        <div class="modal-body">
          
          <!-- Título -->
          <div class="form-group">
            <label class="form-label required">Título do Workspace</label>
            <input
              v-model="formData.title"
              type="text"
              class="form-input"
              :class="{ error: errors.title }"
              placeholder="Ex: Desenvolvimento de Site Institucional"
              maxlength="80"
              @input="clearError('title')"
            />
            <div class="input-footer">
              <span v-if="errors.title" class="error-message">{{ errors.title }}</span>
              <span class="char-counter" :class="{ warning: safeTitle.length > 70 }">
                {{ safeTitle.length }}/80
              </span>
            </div>
          </div>

          <!-- Descrição -->
          <div class="form-group">
            <label class="form-label required">Descrição Detalhada</label>
            <textarea
              v-model="formData.description"
              class="form-textarea"
              :class="{ error: errors.description }"
              placeholder="Descreva o objetivo deste workspace..."
              rows="5"
              maxlength="500"
              @input="clearError('description')"
            ></textarea>
            <div class="input-footer">
              <span v-if="errors.description" class="error-message">{{ errors.description }}</span>
              <span class="char-counter" :class="{ warning: safeDescription.length > 450 }">
                {{ safeDescription.length }}/500
              </span>
            </div>
          </div>

          <!-- Ícones -->
          <div class="form-group">
            <label class="form-label">Ícone</label>
            <div class="icon-grid">
              <button
                v-for="icon in availableIcons"
                :key="icon"
                class="icon-option"
                :class="{ active: formData.icon === icon }"
                @click="formData.icon = icon"
                type="button"
              >
                <i :class="icon"></i>
              </button>
            </div>
          </div>

          <!-- Cores -->
          <div class="form-group">
            <label class="form-label">Cor</label>
            <div class="color-grid">
              <button
                v-for="color in availableColors"
                :key="color.value"
                class="color-option"
                :class="{ active: formData.color === color.value }"
                :style="{ background: color.value }"
                @click="formData.color = color.value"
                type="button"
              >
                <i v-if="formData.color === color.value" class="bx bx-check"></i>
              </button>
            </div>
          </div>

          <!-- Preview -->
          <div class="preview-section">
            <label class="form-label">Pré-visualização</label>
            <div class="workspace-preview">
              <div class="preview-icon" :style="{ background: formData.color }">
                <i :class="formData.icon"></i>
              </div>
              <div class="preview-content">
                <h4 class="preview-title">{{ formData.title || 'Título do Workspace' }}</h4>
                <p class="preview-description">
                  {{ formData.description || 'Descrição do workspace aparecerá aqui...' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Avançado -->
          <div class="advanced-section">
            <button class="advanced-toggle" @click="showAdvanced = !showAdvanced">
              <i :class="showAdvanced ? 'bx bx-chevron-up' : 'bx bx-chevron-down'"></i>
              <span>Opções Avançadas</span>
            </button>

            <transition name="slide-fade">
              <div v-if="showAdvanced" class="advanced-content">

                <!-- Tags -->
                <div class="form-group">
                  <label class="form-label">Tags</label>
                  <div class="tags-input-container">
                    <div class="tags-list">
                      <span
                        v-for="(tag, index) in formData.tags"
                        :key="index"
                        class="tag-item"
                      >
                        {{ tag }}
                        <button type="button" @click="removeTag(index)">
                          <i class="bx bx-x"></i>
                        </button>
                      </span>
                    </div>
                    <input
                      v-model="newTag"
                      class="tag-input"
                      placeholder="Adicionar tag"
                      @keydown.enter.prevent="addTag"
                    />
                  </div>
                </div>

                <!-- AI Mode -->
                <div class="form-group">
                  <label class="form-label">Comportamento da IA</label>
                  <select v-model="formData.aiMode" class="form-select">
                    <option value="creative">Criativo</option>
                    <option value="balanced">Balanceado</option>
                    <option value="precise">Preciso</option>
                  </select>
                </div>

                <div class="form-group">
                  <input
                    type="checkbox"
                    id="autoSave"
                    v-model="formData.autoSave"
                  />
                  <label for="autoSave">Auto-salvar conversas</label>
                </div>

              </div>
            </transition>
          </div>
        </div>

        <!-- FOOTER -->
        <div class="modal-footer">
          <button class="btn-secondary" @click="closeModal">Cancelar</button>
          <button class="btn-primary" @click="saveWorkspace" :disabled="!canSave || isSaving">
            {{ isSaving ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Criar Workspace') }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { getTheme } from '../../service/userPreferences'

export default {
  name: 'WorkspaceModal',
  props: {
    visible: Boolean,
    workspace: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      themeMode: getTheme(),
      formData: {
        title: '',
        description: '',
        icon: 'bx bx-code-alt',
        color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        tags: [],
        aiMode: 'balanced',
        autoSave: true
      },
      errors: {},
      newTag: '',
      isSaving: false,
      showAdvanced: false,

      availableIcons: [
        'bx bx-code-alt', 'bx bx-book-open', 'bx bx-briefcase', 'bx bx-bulb',
        'bx bx-palette', 'bx bx-pencil', 'bx bx-chart', 'bx bx-camera',
        'bx bx-music', 'bx bx-game', 'bx bx-rocket', 'bx bx-heart',
        'bx bx-star', 'bx bx-target-lock', 'bx bx-shopping-bag', 'bx bx-atom'
      ],

      availableColors: [
        { name: 'Roxo', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
        { name: 'Rosa', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
        { name: 'Azul', value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
        { name: 'Verde', value: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }
      ]
    }
  },

  computed: {
    isEditing() {
      return this.workspace !== null
    },
    canSave() {
      return (
        this.safeTitle.length > 0 &&
        this.safeDescription.length > 0
      )
    },

    safeTitle() {
      return this.formData.title || ''
    },

    safeDescription() {
      return this.formData.description || ''
    }
  },

  watch: {
    visible(val) {
      if (val) {
        this.loadWorkspaceData()
        this.resetErrors()
      }
    }
  },

  methods: {
    loadWorkspaceData() {
      if (this.workspace) {
        this.formData = {
          title: this.workspace.title || '',
          description: this.workspace.description || '',
          icon: this.workspace.icon || 'bx bx-code-alt',
          color: this.workspace.color || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          tags: Array.isArray(this.workspace.tags) ? this.workspace.tags : [],
          aiMode: this.workspace.aiMode || 'balanced',
          autoSave: this.workspace.autoSave !== false
        }
      } else {
        this.resetForm()
      }
    },

    resetForm() {
      this.formData = {
        title: '',
        description: '',
        icon: 'bx bx-code-alt',
        color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        tags: [],
        aiMode: 'balanced',
        autoSave: true
      }
      this.newTag = ''
      this.showAdvanced = false
    },

    resetErrors() {
      this.errors = {}
    },

    clearError(field) {
      this.errors[field] = ''
    },

    addTag() {
      const t = this.newTag.trim()
      if (t && !this.formData.tags.includes(t) && this.formData.tags.length < 5) {
        this.formData.tags.push(t)
      }
      this.newTag = ''
    },

    removeTag(index) {
      this.formData.tags.splice(index, 1)
    },

    validateForm() {
      this.resetErrors()

      if (!this.safeTitle) this.errors.title = 'Título obrigatório'
      if (!this.safeDescription) this.errors.description = 'Descrição obrigatória'

      return Object.keys(this.errors).length === 0
    },

    async saveWorkspace() {
      if (!this.validateForm()) return

      this.isSaving = true
      await new Promise(r => setTimeout(r, 800))

      const data = {
        ...this.formData,
        id: this.workspace?.id || null
      }

      this.$emit('save', data)
      this.closeModal()
      this.isSaving = false
    },

    closeModal() {
      this.$emit('close')
      setTimeout(() => {
        this.resetForm()
        this.resetErrors()
      }, 300)
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
  max-width: 700px;
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
  flex: 1;
}

.header-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  color: white;
  font-size: 1.75rem;
  flex-shrink: 0;
  transition: all 0.3s ease;
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
  flex-shrink: 0;
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

.form-label.required::after {
  content: '*';
  color: #ea4335;
  margin-left: 0.25rem;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid var(--card-border, rgba(0, 0, 0, 0.1));
  border-radius: 12px;
  background: var(--form-bg);
  color: var(--text-primary);
  font-size: 0.95rem;
  transition: all 0.3s ease;
  font-family: inherit;
}

.form-input:hover,
.form-textarea:hover {
  border-color: #4285f4;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #4285f4;
  box-shadow: 0 0 0 4px rgba(66, 133, 244, 0.1);
}

.form-input.error,
.form-textarea.error {
  border-color: #ea4335;
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
  line-height: 1.6;
}

.input-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #ea4335;
  font-size: 0.85rem;
}

.char-counter {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.char-counter.warning {
  color: #fbbc04;
  font-weight: 600;
}

.description-tip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: linear-gradient(135deg, rgba(66, 133, 244, 0.1) 0%, rgba(52, 168, 83, 0.1) 100%);
  border-radius: 8px;
  margin-top: 0.75rem;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.description-tip i {
  color: #4285f4;
  font-size: 1rem;
}

/* Icon Grid */
.icon-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 0.5rem;
}

.icon-option {
  width: 100%;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--card-header, rgba(0, 0, 0, 0.05));
  border: 2px solid transparent;
  border-radius: 10px;
  color: var(--text-primary);
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.icon-option:hover {
  background: var(--card-border, rgba(0, 0, 0, 0.1));
  transform: scale(1.1);
}

.icon-option.active {
  background: linear-gradient(135deg, rgba(66, 133, 244, 0.2) 0%, rgba(52, 168, 83, 0.2) 100%);
  border-color: #4285f4;
  color: #4285f4;
}

/* Color Grid */
.color-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.75rem;
}

.color-option {
  width: 100%;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  font-size: 1.25rem;
}

.color-option:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.color-option.active {
  border-color: white;
  box-shadow: 0 0 0 2px var(--card-element-bg), 0 0 0 4px #4285f4;
}

/* Preview Section */
.preview-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--card-border, rgba(0, 0, 0, 0.1));
}

.workspace-preview {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem;
  background: var(--card-header, rgba(0, 0, 0, 0.05));
  border: 1px solid var(--card-border, rgba(0, 0, 0, 0.1));
  border-radius: 12px;
}

.preview-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  color: white;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.preview-content {
  flex: 1;
  min-width: 0;
}

.preview-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.preview-description {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.5;
}

/* Advanced Section */
.advanced-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--card-border, rgba(0, 0, 0, 0.1));
}

.advanced-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--card-header, rgba(0, 0, 0, 0.05));
  border: 1px solid var(--card-border, rgba(0, 0, 0, 0.1));
  border-radius: 10px;
  color: var(--text-primary);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.advanced-toggle:hover {
  background: var(--card-border, rgba(0, 0, 0, 0.1));
}

.advanced-toggle i {
  font-size: 1.25rem;
}

.advanced-content {
  margin-top: 1.5rem;
}

/* Tags Input */
.tags-input-container {
  border: 2px solid var(--card-border, rgba(0, 0, 0, 0.1));
  border-radius: 12px;
  padding: 0.5rem;
  background: var(--form-bg);
  transition: all 0.3s ease;
}

.tags-input-container:focus-within {
  border-color: #4285f4;
  box-shadow: 0 0 0 4px rgba(66, 133, 244, 0.1);
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.tag-item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  background: linear-gradient(135deg, #4285f4 0%, #34a853 100%);
  color: white;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
}

.tag-item button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tag-item button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.tag-input {
  flex: 1;
  min-width: 150px;
  padding: 0.375rem;
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-size: 0.9rem;
  outline: none;
}

.input-hint {
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-top: 0.5rem;
}

/* Form Select */
.form-select {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid var(--card-border, rgba(0, 0, 0, 0.1));
  border-radius: 12px;
  background: var(--form-bg);
  color: var(--text-primary);
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.form-select:hover {
  border-color: #4285f4;
}

.form-select:focus {
  outline: none;
  border-color: #4285f4;
  box-shadow: 0 0 0 4px rgba(66, 133, 244, 0.1);
}

/* Checkbox Option */
.checkbox-option {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--card-header, rgba(0, 0, 0, 0.05));
  border: 2px solid var(--card-border, rgba(0, 0, 0, 0.1));
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.checkbox-option:hover {
  background: var(--card-border, rgba(0, 0, 0, 0.1));
  border-color: #4285f4;
}

.checkbox-input {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #4285f4;
  margin-top: 0.125rem;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  flex: 1;
  cursor: pointer;
}

.checkbox-label i {
  font-size: 1.25rem;
  color: #4285f4;
  margin-top: 0.125rem;
}

.checkbox-label strong {
  display: block;
  font-size: 0.95rem;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.checkbox-label span {
  display: block;
  font-size: 0.85rem;
  color: var(--text-muted);
}

/* Modal Footer */
.modal-footer {
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
  border-top: 1px solid var(--card-border, rgba(0, 0, 0, 0.1));
  background: var(--card-header, rgba(0, 0, 0, 0.02));
}

.btn-secondary,
.btn-primary {
  display: flex;
  align-items: center;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  gap: 0.5rem;
}

.btn-secondary {
  background: var(--card-border, rgba(0, 0, 0, 0.1));
  color: var(--text-primary);
}

.btn-secondary:hover {
  background: var(--card-header, rgba(0, 0, 0, 0.15));
  transform: translateY(-2px);
}

.btn-primary {
  background: linear-gradient(135deg, #4285f4 0%, #34a853 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(66, 133, 244, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(66, 133, 244, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-primary .bx-spin {
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

/* Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}

.slide-fade-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(-5px);
  opacity: 0;
}

/* Dark Theme */
.dark-theme {
  --card-element-bg: #1e1e1e;
  --card-header: rgba(255, 255, 255, 0.05);
  --card-border: rgba(255, 255, 255, 0.1);
  --text-primary: #e8eaed;
  --text-muted: #9aa0a6;
  --form-bg: #2d2d2d;
}

/* Light Theme */
.light-theme {
  --card-element-bg: #ffffff;
  --card-header: rgba(0, 0, 0, 0.02);
  --card-border: rgba(0, 0, 0, 0.08);
  --text-primary: #202124;
  --text-muted: #5f6368;
  --form-bg: #f8f9fa;
}

/* Scrollbar */
.modal-body::-webkit-scrollbar {
  width: 8px;
}

.modal-body::-webkit-scrollbar-track {
  background: transparent;
}

.modal-body::-webkit-scrollbar-thumb {
  background: var(--card-border, rgba(0, 0, 0, 0.2));
  border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}

/* Responsive */
@media (max-width: 768px) {
  .modal-container {
    max-width: 100%;
    max-height: 100vh;
    border-radius: 0;
    margin: 0;
  }

  .modal-header {
    padding: 1.5rem;
  }

  .modal-body {
    padding: 1.5rem;
  }

  .modal-footer {
    padding: 1rem 1.5rem;
    flex-direction: column-reverse;
  }

  .btn-secondary,
  .btn-primary {
    width: 100%;
    justify-content: center;
  }

  .icon-grid {
    grid-template-columns: repeat(6, 1fr);
  }

  .color-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .header-content {
    gap: 0.75rem;
  }

  .header-icon {
    width: 48px;
    height: 48px;
    font-size: 1.5rem;
  }

  .modal-title {
    font-size: 1.25rem;
  }

  .modal-subtitle {
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .icon-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .color-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Utility classes */
.me-1 {
  margin-right: 0.25rem;
}

.me-2 {
  margin-right: 0.5rem;
}


</style>