<template>
  <div>
    <div v-if="visible" class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog" style="max-width: 1200px; width: 90%">
        <div class="modal-content bg-dark text-white">
          <div class="modal-header">
            <h5 class="modal-title">{{ titleModal }} Algoritmo</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-4">
                <div class="mb-3">
                  <label for="name" class="form-label">Nome do Algoritmo</label>
                  <input
                    type="text"
                    class="form-control"
                    id="name"
                    v-model="algorithm.name"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label for="explanation" class="form-label">Descrição</label>
                  <textarea
                    class="form-control"
                    id="explanation"
                    v-model="algorithm.explanation"
                    required
                    rows="8"
                  ></textarea>
                </div>
              </div>
              <div class="col-md-8" v-if="!isEditMode">
                <div class="mb-3">
                  <label for="language" class="form-label">Linguagem do Primeiro Snippet</label>
                  <select class="form-select" id="language" v-model="algorithm.lang" required>
                    <option value="" disabled>Selecione a linguagem</option>
                    <option v-for="lang in programmingLanguages" :key="lang" :value="lang">
                      {{ lang }}
                    </option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="code" class="form-label">Código</label>
                  <textarea
                    v-model="algorithm.code"
                    class="form-control font-mono"
                    style="height: 60vh; background-color: #282a36; color: #f8f8f2"
                    :placeholder="`// Adicione seu código em ${language} aqui...`"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Cancelar</button>
            <button type="button" class="btn btn-primary" @click="submitAlgorithm">
              {{ titleModal }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="visible" class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
import SystemController from '../../controller/SystemController'

export default {
  props: {
    visible: { type: Boolean, default: false },
    algorithmToEdit: { type: Object, default: null }
  },
  data() {
    return {
      titleModal: 'Adicionar',
      algorithm: { name: '', explanation: '', lang: 'JavaScript', code: '' },
      programmingLanguages: ['JavaScript', 'Python', 'Java', 'Ruby', 'Go', 'Rust', 'PHP', 'C++']
    }
  },
  computed: {
    isEditMode() {
      return this.algorithmToEdit !== null
    }
  },
  watch: {
    visible: {
      handler(isNowVisible) {
        if (isNowVisible) {
          if (this.isEditMode) {
            this.titleModal = 'Editar'
            this.algorithm.id = this.algorithmToEdit.id
            this.algorithm.name = this.algorithmToEdit.name
            this.algorithm.explanation = this.algorithmToEdit.explanation
            // No modo de edição, não mexemos no código/linguagem.
          } else {
            this.titleModal = 'Adicionar'
            this.resetForm()
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    resetForm() {
      this.algorithm = {
        id: '',
        name: '',
        explanation: '',
        lang: 'JavaScript',
        code: '// Seu código aqui...'
      }
    },
    closeModal() {
      this.resetForm()
      this.$emit('close')
    },
    async submitAlgorithm() {
      if (this.isEditMode) {
        // A lógica de edição já envia um objeto simples, então está correta.
        SystemController.editAlgorithm(this.algorithmToEdit.id, {
          name: this.algorithm.name,
          explanation: this.algorithm.explanation
        })
      } else {
        // --- MODO CRIAÇÃO ---
        if (
          !this.algorithm.name ||
          !this.algorithm.explanation ||
          !this.algorithm.lang ||
          !this.algorithm.code
        ) {
          alert('Por favor, preencha todos os campos.')
          return
        }

        // AQUI ESTÁ A CORREÇÃO:
        // Criamos um objeto simples e "plano" (POJO) a partir da instância da classe.
        // Este objeto é a nossa "carta" pronta para ser enviada.
        const plainAlgorithmData = {
          id: this.generateId(),
          name: this.algorithm.name,
          explanation: this.algorithm.explanation,
          lang: this.algorithm.lang,
          code: this.algorithm.code
        }

        // Enviamos apenas o objeto simples pela ponte IPC.
        await SystemController.addAlgorithmWithSnippet(plainAlgorithmData)
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
.modal-content {
  background-color: #1a001a;
}

.modal-backdrop {
  z-index: 1040;
}

.modal-dialog {
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 60px);
}

.form-control,
.form-select {
  background-color: #282a36;
  color: #f8f8f2;
  border: 1px solid #44475a;
}

.form-control:focus,
.form-select:focus {
  background-color: #282a36;
  color: #f8f8f2;
  border-color: #6272a4;
  box-shadow: 0 0 0 0.25rem rgba(98, 114, 164, 0.25);
}

.form-control::placeholder {
  color: #b1b4b8;
}

.font-mono {
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.9rem;
  line-height: 1.5;
}

textarea {
  resize: vertical;
  min-height: 100px;
}
</style>
