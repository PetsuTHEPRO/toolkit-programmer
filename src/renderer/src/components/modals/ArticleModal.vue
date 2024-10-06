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
              <slot name="title">Adicionar Artigo</slot>
            </h5>
            <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <slot name="body">
              <div class="mb-3">
                <label for="name" class="form-label">Nome do Artigo</label>
                <input
                  type="text"
                  class="form-control"
                  id="name"
                  v-model="articleData.name"
                  placeholder="Digite o nome do algoritmo"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="explanation" class="form-label">Descrição</label>
                <textarea
                  class="form-control"
                  id="explanation"
                  v-model="articleData.description"
                  placeholder="Explique como o algoritmo funciona"
                  required
                ></textarea>
              </div>
              <!-- Input para upload de PDF -->
              <div v-if="!pdfEdit" class="mb-3">
                <label for="materialPdf" class="form-label">Arquivo PDF</label>
                <input
                  id="materialPdf"
                  type="file"
                  class="form-control"
                  accept="application/pdf"
                  @change="handleFileUpload"
                />
              </div>

              <div class="pdf-preview d-flex align-items-center justify-content-center">
                <!-- Exibe o link de visualização do PDF -->
                <a
                  v-if="articleData.pdfPreviewUrl"
                  :href="articleData.pdfPreviewUrl"
                  target="_blank"
                  class="btn btn-primary"
                >
                  Visualizar PDF
                </a>

                <!-- Exibe uma pré-visualização do PDF com iframe -->
                <iframe
                  v-if="articleData.pdfPreviewUrl"
                  :src="articleData.pdfPreviewUrl"
                  width="100"
                  height="100"
                  frameborder="0"
                ></iframe>
              </div>
            </slot>
          </div>
          <div class="modal-footer">
            <slot name="footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">Cancelar</button>
              <button type="button" class="btn btn-primary" @click="submitArticle">
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
import SystemController from '../../controller/SystemController'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    programmingLanguages: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      articleData: {
        name: '',
        description: '',
        pdfFile: null,
        pdfFileName: '',
        pdfSize: ''
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    handleFileUpload(event) {
      const file = event.target.files[0]
      if (file && file.type === 'application/pdf') {
        this.articleData.pdfFile = file
        this.articleData.pdfFileName = file.name
        this.articleData.pdfSize = (file.size / 1024).toFixed(2) + ' KB' // Converte o tamanho para KB
      } else {
        alert('Por favor, selecione um arquivo PDF.')
      }
    },
    async submitArticle() {
      try {
        // Ler o arquivo PDF como ArrayBuffer
        const pdfBuffer = await this.readFileAsArrayBuffer(this.articleData.pdfFile)
        await window.api.uploadPdf(new Uint8Array(pdfBuffer), this.articleData.pdfFileName)

        // Atualizar os dados do PDF
        this.pdfData = {
          name: this.articleData.name,
          description: this.articleData.description,
          pdfFileName: this.articleData.pdfFileName,
          pdfSize: this.articleData.pdfSize,
          path: '../../assets/pdfs/' + this.articleData.pdfFileName // Caminho do PDF
        }

        // Adicionar PDF ao sistema
        SystemController.addArticle(this.pdfData)
      } catch (error) {
        console.error('Erro ao fazer upload do PDF:', error)
        alert('Erro ao fazer upload do PDF.')
      }

      this.articleData = {
        name: '',
        explanation: '',
        pdfFile: null,
        pdfFileName: '',
        pdfSize: ''
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
