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
      <div class="modal-dialog modal-lg">
        <div class="modal-content bg-dark text-white">
          <div class="modal-header">
            <h5 id="modalTitle" class="modal-title">
              <slot name="title">Adicionar Algoritmo</slot>
            </h5>
            <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <slot name="body">
              <div class="mb-3">
                <label for="name" class="form-label">Nome do Algoritmo</label>
                <input
                  type="text"
                  class="form-control"
                  id="name"
                  v-model="algorithmData.name"
                  placeholder="Digite o nome do algoritmo"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="explanation" class="form-label">Explicação</label>
                <textarea
                  class="form-control"
                  id="explanation"
                  v-model="algorithmData.explanation"
                  placeholder="Explique como o algoritmo funciona"
                  required
                ></textarea>
              </div>
              <div class="mb-3">
                <label for="language" class="form-label">Linguagem</label>
                <select class="form-select" id="language" v-model="algorithmData.language" required>
                  <option value="" disabled>Selecione a linguagem</option>
                  <option v-for="lang in programmingLanguages" :key="lang" :value="lang">
                    {{ lang }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label for="code" class="form-label">Código</label>
                <textarea
                  class="form-control font-mono"
                  id="code"
                  v-model="algorithmData.code"
                  placeholder="Cole o código do algoritmo aqui"
                  required
                ></textarea>
              </div>
            </slot>
          </div>
          <div class="modal-footer">
            <slot name="footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">Cancelar</button>
              <button type="button" class="btn btn-primary" @click="submitAlgorithm">Adicionar</button>
            </slot>
          </div>
        </div>
      </div>
    </div>
    <div v-if="visible" class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
import SystemController from '../controller/SystemController'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    programmingLanguages: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      algorithmData: {
        name: '',
        explanation: '',
        language: '',
        code: ''
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    submitAlgorithm() {
      SystemController.addAlgorithm(this.algorithmData)

      this.algorithmData = {
        name: '',
        explanation: '',
        language: '',
        code: ''
      }

      this.closeModal()
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
  min-height: 100vh;
}
</style>
