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
              <slot name="title">{{ titleModal }} Artigo</slot>
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
                  v-model="article.name"
                  placeholder="Digite o nome do algoritmo"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="explanation" class="form-label">Descrição</label>
                <textarea
                  class="form-control"
                  id="explanation"
                  v-model="article.description"
                  placeholder="Explique como o algoritmo funciona"
                  required
                ></textarea>
              </div>
              <!-- Input para upload de PDF -->
              <div v-if="!articleEdit" class="mb-3">
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
                  v-if="article.pdfPreviewUrl"
                  :href="article.pdfPreviewUrl"
                  target="_blank"
                  class="btn btn-primary"
                >
                  Visualizar PDF
                </a>

                <!-- Exibe uma pré-visualização do PDF com iframe -->
                <iframe
                  v-if="article.pdfPreviewUrl"
                  :src="article.pdfPreviewUrl"
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
import Article from '../../model/entity/article'

const NO_ARTICLE_ID = -1

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    programmingLanguages: {
      type: Array,
      default: () => []
    },
    idArticle: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      titleModal: this.idArticle !== NO_ARTICLE_ID ? 'Editar' : 'Adicionar',
      article: new Article(-1, '', '', '', '', ''),
      articleEdit: null
    }
  },
  created() {
    if (this.idArticle !== -1) {
      const storedArticles = SystemController.getStorage('articlesStorage')
      const storedArticle = storedArticles.find((v) => v.id === this.idArticle)
      if (storedArticle) {
        this.article = new Article(
          storedArticle.id,
          storedArticle.name,
          storedArticle.description,
          storedArticle.pdfFileName,
          storedArticle.pdfSize,
          storedArticle.path
        )
      }
    }
  },
  methods: {
    closeModal() {
      this.article = new Article(-1, '', '', '', '', '')
      this.$emit('close')
    },
    handleFileUpload(event) {
      const file = event.target.files[0]
      if (file && file.type === 'application/pdf') {
        this.article.pdfFile = file
        this.article.pdfFileName = file.name
        this.article.pdfSize = (file.size / 1024).toFixed(2) + ' KB' // Converte o tamanho para KB
      } else {
        alert('Por favor, selecione um arquivo PDF.')
      }
    },
    generateId() {
      return (
        Date.now().toString(36) +
        Math.floor(Math.random() * 1000)
          .toString(36)
          .padStart(4, '0')
      )
    },
    async submitArticle() {
      const articleData = {
        ...this.article.toDTO(),
        id: this.generateId()
      }

      if (this.idArticle !== NO_ARTICLE_ID) {
        SystemController.editArticle({ ...articleData, id: this.idArticle })
      } else {
        // Modo criação
        if (!this.article.pdfFile) {
          alert('Por favor, faça upload de um arquivo PDF.')
          return
        }

        try {
          // Lê o conteúdo do arquivo PDF como base64 (ou você pode salvar diretamente o File)
          const pdfBase64 = await this.readFileAsDataURL(this.article.pdfFile)
          SystemController.addArticle({ ...articleData, path: pdfBase64 })
        } catch (error) {
          console.error('Erro ao fazer upload do PDF:', error)
          alert('Erro ao fazer upload do PDF.')
        }
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
