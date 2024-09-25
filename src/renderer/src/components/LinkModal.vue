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
        <div class="modal-content bg-dark text-white">
          <div class="modal-header">
            <h5 class="modal-title" id="modalTitle">
              <slot name="title">Adicionar Link</slot>
            </h5>
            <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <slot name="body">
              <!-- Input para o nome do link -->
              <div class="mb-3">
                <label for="linkName" class="form-label">Nome</label>
                <input
                  id="linkName"
                  v-model="linkData.name"
                  type="text"
                  class="form-control"
                  placeholder="Digite o nome do link"
                />
              </div>

              <!-- Input para a descrição do link -->
              <div class="mb-3">
                <label for="linkDescription" class="form-label">Descrição</label>
                <textarea
                  id="linkDescription"
                  v-model="linkData.description"
                  class="form-control"
                  placeholder="Digite a descrição do link"
                ></textarea>
              </div>

              <!-- Input para o nome do link -->
              <div class="mb-3">
                <label for="link" class="form-label">Url</label>
                <input
                  id="link"
                  v-model="linkData.link"
                  type="text"
                  class="form-control"
                  placeholder="Digite o nome do link"
                />
              </div>
            </slot>
          </div>
          <div class="modal-footer">
            <slot name="footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">Cancelar</button>
              <button type="button" class="btn btn-primary" @click="submitLink">Adicionar</button>
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
    }
  },
  data() {
    return {
      linkData: {
        name: '',
        description: '',
        link: ''
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    submitLink() {
      // Lógica para adicionar o link
      SystemController.addLink(this.linkData)

      // Limpa o formulário após adicionar o link
      this.linkData = {
        name: '',
        description: '',
        link: ''
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
</style>
