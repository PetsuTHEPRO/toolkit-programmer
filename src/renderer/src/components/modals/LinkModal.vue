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
              <div name="title">{{ titleModal }} Link</div>
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
                  v-model="link.name"
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
                  v-model="link.description"
                  class="form-control"
                  placeholder="Digite a descrição do link"
                ></textarea>
              </div>

              <!-- Input para o nome do link -->
              <div class="mb-3">
                <label for="link" class="form-label">Url</label>
                <input
                  id="link"
                  v-model="link.link"
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
      titleModal: this.linkId !== NO_LINK_ID ? 'Editar' : 'Adicionar',
      link: new Link(NO_LINK_ID, '', '', '')
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
      this.link = new Link(NO_LINK_ID, '', '', '', '', '')
      this.$emit('close')
    },
    submitLink() {
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
