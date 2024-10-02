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
              <div name="title">{{ !frameworkEdit ? 'Adicionar Framework' : 'Editar Framework' }}</div>
            </h5>
            <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <slot name="body">
              <!-- Input para o nome do link -->
              <div class="mb-3">
                <label for="frameworkName" class="form-label">Nome</label>
                <input
                  id="frameworkName"
                  v-model="frameworkData.name"
                  type="text"
                  class="form-control"
                  placeholder="Digite o nome do framework"
                />
              </div>

              <!-- Input para a descrição do link -->
              <div class="mb-3">
                <label for="frameworkDescription" class="form-label">Descrição</label>
                <textarea
                  id="frameworkDescription"
                  v-model="frameworkData.description"
                  class="form-control"
                  placeholder="Digite a descrição do framework"
                ></textarea>
              </div>

              <!-- Input para o nome do link -->
              <div class="mb-3">
                <label for="comando" class="form-label">Comando para instalação</label>
                <input
                  id="comando"
                  v-model="frameworkData.installation"
                  type="text"
                  class="form-control"
                  placeholder="Digite o comando para a instalação do framework"
                />
              </div>

              <!-- Input para o nome do link -->
              <div class="mb-3">
                <label for="linkDocumentation" class="form-label">Link da Documentação</label>
                <input
                  id="linkDocumentation"
                  v-model="frameworkData.documentationLink"
                  type="text"
                  class="form-control"
                  placeholder="Digite o link para a documentação do framework"
                />
              </div>
            </slot>
          </div>
          <div class="modal-footer">
            <slot name="footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">Cancelar</button>
              <button type="button" class="btn btn-primary" @click="submitFramework">Adicionar</button>
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
    idFramework: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      frameworkData: {
        name: '',
        description: '',
        installation: '',
        documentationLink: ''
      },
      frameworkEdit: null
    }
  },
  created() {
    if (this.idFramework !== -1) {
      this.frameworkEdit = SystemController.getStorage('frameworksStorage')[this.idFramework]
      this.frameworkData = {
        name: this.frameworkEdit.name,
        description: this.frameworkEdit.description,
        installation: this.frameworkEdit.installation,
        documentationLink: this.frameworkEdit.documentationLink
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    submitFramework() {
      // Lógica para adicionar o link
      if (this.frameworkEdit) {
        this.frameworkEdit = {
          id: this.idFramework,
          name: this.frameworkData.name,
          description: this.frameworkData.description,
          installation: this.frameworkData.installation,
          documentationLink: this.frameworkData.documentationLink
        }

        SystemController.editFramework(this.frameworkEdit)
      } else {
        SystemController.addFramework(this.frameworkData)
      }
      // Limpa o formulário após adicionar o link
      this.frameworkData = {
        name: '',
        description: '',
        installation: '',
        documentationLink: ''
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
