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
              <slot name="title">Adicionar API</slot>
            </h5>
            <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <slot name="body">
              <div class="mb-3">
                <label for="name" class="form-label">Nome da Api</label>
                <input
                  type="text"
                  class="form-control"
                  id="name"
                  v-model="apiData.name"
                  placeholder="Digite o nome da API"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="description" class="form-label">Descrição</label>
                <textarea
                  class="form-control"
                  id="description"
                  v-model="apiData.description"
                  placeholder="Digite a descrição da api"
                  required
                ></textarea>
              </div>
              <div class="mb-3">
                <label for="code" class="form-label">Key</label>
                <input
                  type="text"
                  class="form-control"
                  id="code"
                  v-model="apiData.key"
                  placeholder="Cole a key da API aqui"
                  required
                />
              </div>
            </slot>
          </div>
          <div class="modal-footer">
            <slot name="footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">Cancelar</button>
              <button type="button" class="btn btn-primary" @click="submitApi">Adicionar</button>
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
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    idApi: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      apiData: {
        name: '',
        description: '',
        key: ''
      },
      apiEdit: null
    }
  },
  created() {
    if (this.idApi !== -1) {
      this.apiEdit = SystemController.getStorage('apisStorage')[this.idApi]
      this.apiData = {
        name: this.apiEdit.name,
        description: this.apiEdit.description,
        key: this.apiEdit.key
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    submitApi() {// Lógica para adicionar o link
      if (this.apiEdit) {
        this.apiEdit = {
          id: this.idApi,
          name: this.apiData.name,
          description: this.apiData.description,
          key: this.apiData.key
        }

        SystemController.editApi(this.apiEdit)
      } else {
        SystemController.addApi(this.apiData)
      }
      // Limpa o formulário após adicionar o link
      this.apiData = {
        name: '',
        description: '',
        key: ''
      }

      // Lógica para fechar o modal
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

.form-control, .form-select {
  background-color: #282A36;
  color: #F8F8F2;
}

.form-control::placeholder {
  color: #B1B4B8;
}
</style>
