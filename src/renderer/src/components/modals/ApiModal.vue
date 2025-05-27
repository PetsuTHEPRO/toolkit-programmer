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
              <slot name="title">{{ titleModal }} API</slot>
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
                  v-model="api.name"
                  placeholder="Digite o nome da API"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="description" class="form-label">Descrição</label>
                <textarea
                  class="form-control"
                  id="description"
                  v-model="api.description"
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
                  v-model="api.key"
                  placeholder="Cole a key da API aqui"
                  required
                />
              </div>
            </slot>
          </div>
          <div class="modal-footer">
            <slot name="footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">Cancelar</button>
              <button type="button" class="btn btn-primary" @click="submitApi">{{ titleModal }}</button>
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
import Api from '../../model/entity/api'

const NO_API_ID = -1

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
      titleModal: this.idApi !== NO_API_ID ? 'Editar' : 'Adicionar',
      api: new Api(NO_API_ID, '', '', '')
    }
  },
  created() {
    if (this.idApi !== NO_API_ID) {
      const storedApis = SystemController.getStorage('apisStorage')
      const storedApi = storedApis.find((v) => v.id === this.idApi)
      if (storedApi) {
        this.api = new Api(
          storedApi.id,
          storedApi.name,
          storedApi.description,
          storedApi.key
        )
      }
    }
  },
  methods: {
    closeModal() {
      this.api = new Api(NO_API_ID, '', '', '')
      this.$emit('close')
    },
    submitApi() {
      const apiData = {
        ...this.api.toDTO(),
        id: this.generateId()
      }

      if (this.idApi !== NO_API_ID) {
        SystemController.editApi({ ...apiData, id: this.idApi })
      } else {
        SystemController.addApi(apiData)
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
