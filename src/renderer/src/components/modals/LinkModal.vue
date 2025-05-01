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
              <div name="title">{{ !linkEdit ? 'Adicionar Link' : 'Editar Link' }}</div>
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
              <button type="button" class="btn btn-primary" @click="submitLink">
                {{ !linkEdit ? 'Adicionar' : 'Editar' }}
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
      linkData: {
        name: '',
        description: '',
        link: ''
      },
      linkEdit: null
    }
  },
  created() {
    if (this.linkId !== -1) {
      this.linkEdit = SystemController.getStorage('linksStorage')[this.linkId]
      this.linkData = {
        name: this.linkEdit.name,
        description: this.linkEdit.description,
        link: this.linkEdit.link
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    submitLink() {
      if (this.linkEdit) {
        this.linkEdit = {
          id: this.linkId,
          name: this.linkData.name,
          description: this.linkData.description,
          link: this.linkData.link
        }

        SystemController.editLink(this.linkEdit)
      } else {
        SystemController.addLink(this.linkData)
      }

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

.form-control, .form-select {
  background-color: #282A36;
  color: #F8F8F2;
}

.form-control::placeholder {
  color: #B1B4B8;
}

.form-control button{
  color: #F8F8F2;
}

.btn-adicionar {
  background-color: #a855f7;
  border: 2px solid #a855f7;
  padding: 0.5em 0.8em;
  border-radius: 5px;
  color: white;
}

.btn-adicionar:hover {
  background-color: #9333ea;
  color: white;
}

.btn-cancelar {
  background-color: #3b82f6;
  border: 2px solid #3b82f6;
  padding: 0.5em 0.8em;
  border-radius: 5px;
  color: white;
}

.btn-cancelar:hover {
  background-color: #2563eb;
  color: white;
}
</style>
