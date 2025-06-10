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
              <div v-if="!isEditMode" class="mb-3">
                <label for="materialPdf" class="form-label">Arquivo PDF</label>
                <input
                  id="materialPdf"
                  type="file"
                  class="form-control"
                  accept="application/pdf"
                  @change="handleFileUpload"
                />
              </div>

              <div class="pdf-preview d-flex flex-column align-items-center justify-content-center">
                <webview
                  v-if="pdfPreviewUrl"
                  :src="pdfPreviewUrl"
                  style="width: 100%; height: 300px; border: none"
                ></webview>
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
    idArticle: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      titleModal: 'Adicionar',
      article: new Article(-1, '', '', null, '', ''),
      selectedFilePath: null
    }
  },
  computed: {
    isEditMode() {
      return this.idArticle !== NO_ARTICLE_ID
    },
    pdfPreviewUrl() {
      if (this.article.path) {
        return `app://${this.article.path}`
      }
      return null
    }
  },
  // O 'watch' foi removido e substituído pelo 'created'
  created() {
    // Esta lógica agora roda no momento da criação do modal
    if (this.isEditMode) {
      this.titleModal = 'Editar'
      this.loadArticleForEditing()
    } else {
      this.titleModal = 'Adicionar'
      this.resetForm()
    }
  },
  methods: {
    resetForm() {
      this.article = new Article(-1, '', '', null, '', '')
      this.selectedFilePath = null
    },
    closeModal() {
      this.$emit('close')
    },
    loadArticleForEditing() {
      // --- CORREÇÃO APLICADA AQUI ---
      // Buscamos os dados diretamente da store para garantir a reatividade.
      const storedArticles = this.$store.getters.getStorage('articlesStorage')
      console.log(storedArticles)
      const storedArticle = storedArticles.find((v) => v.id === this.idArticle)
      if (storedArticle) {
        // Preenche o formulário com TODOS os dados existentes
        this.article = new Article(
          storedArticle.id,
          storedArticle.name,
          storedArticle.description,
          storedArticle.path,
          storedArticle.pdfFilename,
          storedArticle.pdfSize
        )
        console.log("created: ", this.article)
      }
    },
    // Em ArticleModal.vue, dentro de 'methods'

    handleFileUpload(event) {
      const file = event.target.files[0]
      if (file) {
        this.selectedFilePath = file.path
        // GARANTA QUE A ORDEM AQUI TAMBÉM ESTEJA CORRETA:
        this.article = new Article(
          this.article.id,
          this.article.name,
          this.article.description,
          file.path, // 4. O caminho do arquivo para o preview
          file.name, // 5. O nome original do arquivo
          `${(file.size / 1024).toFixed(2)} KB` // 6. O tamanho do arquivo
        )
      }
    },
    async submitArticle() {
      let finalArticlePath = this.article.path

      // 1. Se um novo arquivo foi selecionado, faz o upload e obtém o novo caminho
      if (this.selectedFilePath) {
        try {
          finalArticlePath = await window.api.files.handleFileUpload(this.selectedFilePath)
        } catch (error) {
          console.error('Erro no upload:', error)
          alert('Erro ao fazer upload do arquivo.')
          return
        }
      }

      if (this.idArticle === NO_ARTICLE_ID && !finalArticlePath) {
        alert('Por favor, anexe um documento para o novo artigo.')
        return
      }
      console.log("Article antes:", this.article)
      // 2. Monta o objeto final com TODOS os campos necessários
      const articleData = {
        id: this.generateId(),
        name: this.article.name,
        description: this.article.description,
        path: finalArticlePath, // O caminho para o arquivo salvo
        pdfFilename: this.article.pdfFilename, // O nome original do arquivo
        pdfSize: this.article.pdfSize // O tamanho do arquivo
      }
      console.log("Depois:", articleData)

      // 3. Salva ou Edita no banco de dados
      if (this.idArticle !== NO_ARTICLE_ID) {
        console.log(articleData)
        SystemController.editArticle({ ...articleData, id: this.idArticle })
      } else {
        SystemController.addArticle(articleData)
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
