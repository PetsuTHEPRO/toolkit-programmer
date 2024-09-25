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
              <slot name="title">Adicionar Material</slot>
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
                  v-model="imagemData.name"
                  class="form-control"
                  placeholder="Digite o nome do material"
                />
              </div>

              <!-- Input para a descrição do material -->
              <div class="mb-3">
                <label for="materialDescription" class="form-label">Descrição</label>
                <textarea
                  id="materialDescription"
                  v-model="imagemData.description"
                  class="form-control"
                  placeholder="Digite a descrição do material"
                ></textarea>
              </div>

              <!-- Input para upload de imagem -->
              <div class="mb-3">
                <label for="materialImage" class="form-label">Imagem</label>
                <input
                  type="file"
                  id="materialImage"
                  @change="handleFileUpload"
                  class="form-control"
                  accept="image/*"
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
              <button type="button" class="btn btn-secondary" @click="closeModal">Cancelar</button>
              <button type="button" class="btn btn-primary" @click="submitImage">
                Adicionar
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

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      imagemData: {
        name: '',
        fileName: '',
        description: '',
        size: '',
        format: '',
        width: '',
        height: '',
        imageFile: null,
        imageFileName: '',
        imagePreviewUrl: ''
      }
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
          };
        }
        reader.readAsDataURL(file) // Lê o arquivo como Data URL
      }
    },
    async submitImage() {
      if (!this.imagemData.imageFile) {
        alert('Por favor, faça upload de uma imagem.')
        return
      }

      try {
        // Envia a imagem e os dados para o backend
        const imageBuffer = await this.readFileAsArrayBuffer(this.imagemData.imageFile);
        await window.api.uploadImage(new Uint8Array(imageBuffer), this.imagemData.imageFileName);

        this.imageData = {
          name: this.imagemData.name,
          fileName: this.imagemData.imageFileName,
          description: this.imagemData.description,
          width: this.imagemData.width,
          height: this.imagemData.height,
          size: this.imagemData.size,
          format: this.imagemData.format,
          path: '../assets/images/' + this.imagemData.imageFileName
        }
        SystemController.addImage(this.imageData)

        // Limpar os campos e fechar o modal
        this.imagemData = {
          name: '',
          description: '',
          imageFile: null,
          imageFileName: '',
          imagePreviewUrl: ''
        };
        this.closeModal();
      } catch (error) {
        console.error('Erro ao fazer upload da imagem:', error);
        alert('Erro ao fazer upload da imagem.');
      }
    },
    readFileAsArrayBuffer(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      });
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
