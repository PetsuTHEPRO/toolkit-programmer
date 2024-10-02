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
              <div name="title">{{ !iconEdit ? 'Adicionar Icone' : 'Editar Icone' }}</div>
            </h5>
            <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <slot name="body">
              <!-- Input para o nome do material -->
              <div class="mb-3">
                <label for="materialName" class="form-label">Nome</label>
                <input
                  type="text"
                  id="materialName"
                  v-model="iconeData.name"
                  class="form-control"
                  placeholder="Digite o nome do material"
                />
              </div>

              <!-- Input para a biblioteca do material -->
              <div class="mb-3">
                <label for="iconLibrary" class="form-label">Biblioteca</label>
                <input
                  type="text"
                  id="iconLibrary"
                  v-model="iconeData.library"
                  class="form-control"
                  placeholder="Digite a biblioteca do icone"
                />
              </div>

              <!-- Input para a descrição do material -->
              <div class="mb-3">
                <label for="iconLinkLibrary" class="form-label">Link da Biblioteca</label>
                <input
                  id="iconLinkLibrary"
                  v-model="iconeData.link"
                  type="text"
                  class="form-control"
                  placeholder="Digite o link da biblioteca do icone"
                />
              </div>

              <!-- Input para a descrição do material -->
              <div class="mb-3">
                <label for="iconUsage" class="form-label">Exemplo do Código</label>
                <input
                  id="iconUsage"
                  v-model="iconeData.usage"
                  type="text"
                  class="form-control"
                  placeholder="Digite o exemplo do código do icone"
                />
              </div>

              <!-- Input para upload de imagem -->
              <div v-if="!iconEdit" class="mb-3">
                <label for="materialImage" class="form-label">Imagem</label>
                <input
                  id="materialImage"
                  type="file"
                  class="form-control"
                  accept="image/*"
                  @change="handleFileUpload"
                />
              </div>
              <div class="image-preview d-flex align-items-center justify-content-center">
                <img
                  v-if="iconeData.iconePreviewUrl"
                  :src="iconeData.iconePreviewUrl"
                  style="width: 100px; height: 100px"
                  alt="Preview"
                />
              </div>
            </slot>
          </div>
          <div class="modal-footer">
            <slot name="footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">Cancelar</button>
              <button type="button" class="btn btn-primary" @click="submitIcone">
                {{ !iconEdit ? 'Adicionar' : 'Editar' }}
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
import SystemController from '../controller/SystemController'
import notificationService from '@renderer/service/notificationService.js'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    icon: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      iconeData: {
        name: '',
        library: '',
        usage: '',
        link: '',
        iconeFile: null, // Armazena o arquivo de imagem
        iconeFileName: '', // Armazena o arquivo de imagem
        iconePreviewUrl: ''
      },
      iconEdit: null
    }
  },
  created() {
    this.iconEdit = SystemController.getStorage('iconsStorage')[this.icon]
    this.iconeData = {
      name: !this.iconEdit ? '' : this.iconEdit.name,
      library: !this.iconEdit ? '' : this.iconEdit.library,
      usage: !this.iconEdit ? '' : this.iconEdit.usage,
      link: !this.iconEdit ? '' : this.iconEdit.link
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    handleFileUpload(event) {
      const file = event.target.files[0]
      const inputElement = event.target // Referência ao input

      if (file) {
        if (!file.type.startsWith('image/')) {
          notificationService.error('O arquivo deve ser uma imagem.')
          // Limpa o campo de input
          inputElement.value = ''
        } else {
          const img = new Image()
          const reader = new FileReader()

          reader.onload = (e) => {
            img.src = e.target.result

            img.onload = () => {
              if (img.width > 64 || img.height > 64) {
                notificationService.error('A imagem deve ter menos que 64x64 pixels.')
                // Limpa o campo de input
                inputElement.value = ''
              } else {
                // Atualiza os dados do ícone após validar a imagem
                this.iconeData.iconeFile = file
                this.iconeData.iconeFileName = file.name
                this.iconeData.iconePreviewUrl = reader.result // URL de pré-visualização
              }
            }
          }
          reader.readAsDataURL(file) // Lê o arquivo como Data URL
        }
      }
    },

    async submitIcone() {
      if (this.iconEdit) {
        this.iconEdit = {
          ...this.iconEdit,
          id: this.icon,
          name: this.iconeData.name,
          usage: this.iconeData.usage,
          library: this.iconeData.library,
          link: this.iconeData.link
        }

        SystemController.editIcon(this.iconEdit)
      } else {
        if (!this.iconeData.iconeFile) {
          alert('Por favor, faça upload de uma imagem.')
          return
        }

        try {
          // Envia a imagem e os dados para o backend
          const imageBuffer = await this.readFileAsArrayBuffer(this.iconeData.iconeFile)
          await window.api.uploadIcon(new Uint8Array(imageBuffer), this.iconeData.iconeFileName)

          // Emitir os dados do material para o componente pai
          this.iconeData = {
            name: this.iconeData.name,
            usage: this.iconeData.usage,
            library: this.iconeData.library,
            link: this.iconeData.link,
            path: '../assets/icons/' + this.iconeData.iconeFileName
          }

          SystemController.addIcon(this.iconeData)
        } catch (error) {
          console.error('Erro ao fazer upload da imagem do icone:', error)
          alert('Erro ao fazer upload da imagem do icone.')
        }
      }
      // Limpar os campos e fechar o modal
      this.iconeData = {
        name: '',
        usage: '',
        library: '',
        link: '',
        iconeFile: null,
        iconeFileName: '',
        iconePreviewUrl: ''
      }
      this.closeModal()
    },
    readFileAsArrayBuffer(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsArrayBuffer(file)
      })
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
