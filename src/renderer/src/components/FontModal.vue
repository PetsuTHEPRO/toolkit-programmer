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
            <h5 id="modalTitle" class="modal-title">
              <div name="title">{{ !fontEdit ? 'Adicionar Fonte' : 'Editar Fonte' }}</div>
            </h5>
            <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <slot name="body">
              <!-- Input para o nome do link -->
              <div class="mb-3">
                <label for="linkName" class="form-label">Nome</label>
                <input
                  id="fontName"
                  v-model="fontData.name"
                  type="text"
                  class="form-control"
                  placeholder="Ex: Open Sans"
                />
              </div>

              <div class="mb-3">
                <label for="fontFamily" class="form-label">Font-family</label>
                <input
                  id="fontFamily"
                  v-model="fontData.family"
                  type="text"
                  class="form-control"
                  placeholder="Ex: 'Open Sans', sans-serif"
                />
              </div>
              <div class="mb-3">
                <div class="form-check">
                  <input
                    id="link"
                    v-model="fontData.uploadType"
                    class="form-check-input"
                    type="radio"
                    name="flexRadioDefault"
                    value="link"
                    checked
                  />
                  <label class="form-check-label" for="link">Link da Fonte</label>
                </div>
                <div class="form-check">
                  <input
                    id="import"
                    v-model="fontData.uploadType"
                    class="form-check-input"
                    type="radio"
                    name="flexRadioDefault"
                    value="import"
                  />
                  <label class="form-check-label" for="import">@import</label>
                </div>
              </div>

              <div v-if="fontData.uploadType === 'link'" class="mb-3">
                <label for="fontLink" class="form-label">Link da Fonte</label>
                <input
                  id="fontLink"
                  v-model="fontData.link"
                  type="url"
                  class="form-control"
                  placeholder="https://exemplo.com/fonte.woff2"
                />
              </div>

              <div v-else-if="fontData.uploadType === 'import'" class="mb-3">
                <label for="fontLink" class="form-label">Import da Fonte</label>
                <input
                  id="fontLink"
                  v-model="fontData.link"
                  type="url"
                  class="form-control"
                  placeholder="@import url('https://example.com/styles.css');"
                />
              </div>
              <!-- Input para upload de imagem -->
              <div v-if="!fontEdit" class="mb-3">
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
                  v-if="fontData.fontPreviewUrl"
                  :src="fontData.fontPreviewUrl"
                  style="width: 100px; height: 100px"
                  alt="Preview"
                />
              </div>
            </slot>
          </div>
          <div class="modal-footer">
            <slot name="footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">Cancelar</button>
              <button type="button" class="btn btn-primary" @click="submitFont">Adicionar</button>
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
import notificationService from '../service/notificationService'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    fontId: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      fontData: {
        name: '',
        family: '',
        uploadType: 'link',
        link: '',
        fontFile: null, // Armazena o arquivo de imagem
        fontFileName: '', // Armazena o arquivo de imagem
        fontPreviewUrl: ''
      },
      fontEdit: null
    }
  },
  created() {
    if (this.fontId !== -1) {
      this.fontEdit = SystemController.getStorage('fontsStorage')[this.fontId]
      this.fontData = {
        name: this.fontEdit.name,
        library: this.fontEdit.library,
        uploadType: this.fontEdit.uploadType,
        family: this.fontEdit.family,
        link: this.fontEdit.link
      }
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
              if (img.width > 120 || img.height > 120) {
                notificationService.error('A imagem deve ter menos que 120x120 pixels.')
                // Limpa o campo de input
                inputElement.value = ''
              } else {
                this.fontData.fontFile = file
                this.fontData.fontFileName = file.name
                this.fontData.fontPreviewUrl = reader.result
              }
            }
          }
          reader.readAsDataURL(file) // Lê o arquivo como Data URL
        }
      }
    },

    async submitFont() {
      if (this.fontEdit) {
        this.fontEdit = {
          ...this.fontEdit,
          id: this.fontId,
          name: this.fontData.name,
          family: this.fontData.family,
          uploadType: this.fontData.uploadType,
          link: this.fontData.link
        }

        SystemController.editFont(this.fontEdit)
      } else {
        if (!this.fontData.fontFile) {
          alert('Por favor, faça upload de uma imagem.')
          return
        }

        try {
          // Envia a imagem e os dados para o backend
          const imageBuffer = await this.readFileAsArrayBuffer(this.fontData.fontFile)
          await window.api.uploadImageFont(new Uint8Array(imageBuffer), this.fontData.fontFileName)

          this.fontData = {
            name: this.fontData.name,
            family: this.fontData.family,
            uploadType: this.fontData.uploadType,
            link: this.fontData.link,
            path: '../assets/images/fontStorage/' + this.fontData.fontFileName
          }
          SystemController.addFont(this.fontData)
        } catch (error) {
          console.error('Erro ao fazer upload da imagem da fonte:', error)
          alert('Erro ao fazer upload da imagem da fonte.')
        }
      }
      // Limpar os campos e fechar o modal
      this.fontData = {
        name: '',
        family: '',
        uploadType: '',
        link: '',
        fontFile: null,
        fontFileName: '',
        fontPreviewUrl: ''
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
