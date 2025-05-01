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
              <slot name="title">{{ !imageEdit ? 'Adicionar Imagem' : 'Editar Imagem' }}</slot>
            </h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              @click="closeModal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <slot name="body">
              <!-- Input para o nome do material -->
              <div class="mb-3">
                <label for="materialName" class="form-label">🆔 Nome</label>
                <input
                  type="text"
                  id="materialName"
                  v-model="imagemData.name"
                  :disabled="editarImagem"
                  class="form-control"
                  placeholder="Digite o nome do material"
                />
              </div>

              <!-- Input para a descrição do material -->
              <div class="mb-3">
                <label for="materialDescription" class="form-label">✏️ Descrição</label>
                <textarea
                  id="materialDescription"
                  v-model="imagemData.description"
                  class="form-control"
                  placeholder="Digite a descrição do material"
                ></textarea>
              </div>

              <!-- Input para upload de imagem -->
              <div v-if="!imageEdit" class="mb-3">
                <label for="materialImage" class="form-label">📁 Escolher imagem</label>
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
                  v-if="imagemData.imagePreviewUrl"
                  :src="imagemData.imagePreviewUrl"
                  style="width: 100px; height: 100px"
                  alt="Preview"
                />
              </div>
            </slot>
          </div>
          <div class="modal-footer">
            <slot name="footer">
              <button type="button" class="btn-cancelar" @click="closeModal">Cancelar</button>
              <button type="button" class="btn-adicionar" @click="submitImage">
                {{ !imageEdit ? 'Adicionar' : 'Editar' }}
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
    image: {
      type: Object,
      default: null
    },
    imageId: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      imagemData: {
        name: !this.image ? '' : this.image.name,
        fileName: '',
        description: !this.image ? '' : this.image.description,
        size: '',
        format: '',
        width: '',
        height: '',
        imageFile: null,
        imageFileName: '',
        imagePreviewUrl: ''
      },
      imageEdit: this.image
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    handleFileUpload(event) {
      const file = event.target.files[0]
      if (file) {
        this.imagemData.imageFile = file
        this.imagemData.imageFileName = file.name
        const format = file.type.split('/')[1] // Extrai o formato a partir do MIME type (ex: 'jpeg', 'png')
        this.imagemData.format = format
        this.imagemData.size = (file.size / 1024).toFixed(2) + ' KB'

        // Pré-visualização da imagem
        const reader = new FileReader()
        reader.onload = (e) => {
          this.imagemData.imagePreviewUrl = reader.result // URL de pré-visualização

          // Criar uma nova imagem para obter as dimensões
          const img = new Image()
          img.src = e.target.result
          img.onload = () => {
            this.imagemData.width = img.width // Largura da imagem
            this.imagemData.height = img.height // Altura da imagem
          }
        }
        reader.readAsDataURL(file) // Lê o arquivo como Data URL
      }
    },
    async submitImage() {
      if (this.imageEdit) {
        this.imageEdit = {
          ...this.imageEdit,
          id: this.imageId,
          name: this.imagemData.name,
          description: this.imagemData.description
        }
        console.log(this.imageEdit)
        SystemController.editImage(this.imageEdit)
      } else {
        if (!this.imagemData.imageFile) {
          alert('Por favor, faça upload de uma imagem.')
          return
        }

        try {
          const base64Data = await this.readFileAsDataURL(this.imagemData.imageFile)

          this.imageData = {
            name: this.imagemData.name,
            fileName: this.imagemData.imageFileName,
            description: this.imagemData.description,
            width: this.imagemData.width,
            height: this.imagemData.height,
            size: this.imagemData.size,
            format: this.imagemData.format,
            base64: base64Data
          }

          SystemController.addImage(this.imageData)
        } catch (error) {
          console.error('Erro ao fazer upload da imagem:', error)
          alert('Erro ao fazer upload da imagem.')
        }
      }

      this.imagemData = {
        name: '',
        description: '',
        imageFile: null,
        imageFileName: '',
        imagePreviewUrl: ''
      }

      this.closeModal()
    },
    readFileAsDataURL(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(file)
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

.form-control,
.form-select {
  background-color: #282a36;
  color: #f8f8f2;
}

.form-control::placeholder {
  color: #b1b4b8;
}

.form-control button {
  color: #f8f8f2;
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
