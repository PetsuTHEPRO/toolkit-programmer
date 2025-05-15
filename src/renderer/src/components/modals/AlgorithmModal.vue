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
      <div class="modal-dialog" style="max-width: 1200px; width: 90%;">
        <div class="modal-content bg-dark text-white">
          <div class="modal-header">
            <h5 id="modalTitle" class="modal-title">
              <slot name="title">{{ titleModal }} Algoritmo</slot>
            </h5>
            <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <slot name="body">
              <div class="row">
                <!-- Coluna Esquerda - Nome e Explicação -->
                <div class="col-md-4">
                  <div class="mb-3">
                    <label for="name" class="form-label">Nome do Algoritmo</label>
                    <input
                      type="text"
                      class="form-control"
                      id="name"
                      v-model="algorithm.name"
                      placeholder="Digite o nome do algoritmo"
                      required
                    />
                  </div>
                  <div class="mb-3">
                    <label for="explanation" class="form-label">Explicação</label>
                    <textarea
                      class="form-control"
                      id="explanation"
                      v-model="algorithm.explanation"
                      placeholder="Explique como o algoritmo funciona"
                      required
                      rows="8"
                    ></textarea>
                  </div>
                </div>
                <!-- Coluna Direita - Linguagem e Código -->
                <div class="col-md-8">
                  <div class="mb-3">
                    <label for="language" class="form-label">Linguagem</label>
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
                      class="form-control font-mono"
                      id="code"
                      v-model="algorithm.code"
                      placeholder="Cole o código do algoritmo aqui"
                      required
                      rows="12"
                    ></textarea>
                  </div>
                </div>
              </div>
            </slot>
          </div>
          <div class="modal-footer">
            <slot name="footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">Cancelar</button>
              <button type="button" class="btn btn-primary" @click="submitAlgorithm">
                {{ titleModal }}
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
    <div v-if="visible" class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
import SystemController from '../../controller/SystemController'
import Algorithm from '../../model/entity/algorithm'

const NO_ALGORITHM_ID = -1

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    programmingLanguages: {
      type: Array,
      default: () => []
    },
    idAlgorithm: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      titleModal: this.idAlgorithm !== NO_ALGORITHM_ID ? 'Editar' : 'Adicionar',
      algorithm: new Algorithm(NO_ALGORITHM_ID, '', '', '', '')
    }
  },
  created() {
    if (this.idAlgorithm !== -1) {
      const storedAlgorithms = SystemController.getStorage('algorithmsStorage')
      const storedAlgorithm = storedAlgorithms.find((v) => v.id === this.idAlgorithm)
      if (storedAlgorithm) {
        console.log(storedAlgorithm)
        this.algorithm = new Algorithm(
          storedAlgorithm.id,
          storedAlgorithm.name,
          storedAlgorithm.explanation,
          storedAlgorithm.lang,
          storedAlgorithm.code
        )
      }
    }
  },
  methods: {
    closeModal() {
      this.algorithm = new Algorithm(-1, '', '', '', '')
      this.$emit('close')
    },
    generateId() {
      return (
        Date.now().toString(36) +
        Math.floor(Math.random() * 1000)
          .toString(36)
          .padStart(4, '0')
      )
    },
    async submitAlgorithm() {
      const algorithmData = {
        ...this.algorithm.toDTO(),
        id: this.generateId()
      }

      if (this.algorithm !== NO_ALGORITHM_ID) {
        console.log(this.algorithm)
        SystemController.editAlgorithm({ ...algorithmData, id: this.idAlgorithm })
      } else {
        SystemController.addAlgorithm(algorithmData)
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
