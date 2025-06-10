<template>
  <div v-if="visible" class="modal fade show d-block" tabindex="-1">
    <div class="modal-dialog modal-xl">
      <div class="modal-content bg-dark text-white">
        <div class="modal-header">
          <h5 class="modal-title">{{ titleModal }}</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <div class="editor-container" style="height: 60vh">
            <textarea
              v-model="codeContent"
              class="form-control font-mono"
              style="height: 60vh; background-color: #282a36; color: #f8f8f2"
              :placeholder="`// Adicione seu código em ${language} aqui...`"
            ></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Cancelar</button>
          <button type="button" class="btn btn-primary" @click="submitSnippet">
            Salvar Código
          </button>
        </div>
      </div>
    </div>
    <div v-if="visible" class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
import SystemController from '@renderer/controller/SystemController'

export default {
  props: {
    visible: { type: Boolean, required: true },
    algorithmId: { type: Number, required: true },
    language: { type: String, required: true },
    // A prop chave: recebe o snippet existente para edição.
    // Se for null, estamos no modo de adição.
    snippetToEdit: { type: Object, default: null }
  },
  data() {
    return {
      codeContent: '',
      titleModal: ''
    }
  },
  computed: {
    isEditMode() {
      // O modo de edição é definido pela existência de um snippet para editar.
      return this.snippetToEdit !== null
    }
  },
  watch: {
    // Usamos o watch para configurar o modal toda vez que ele se torna visível.
    visible(isNowVisible) {
      if (isNowVisible) {
        if (this.isEditMode) {
          // Modo Edição: Preenche com o código existente.
          this.titleModal = `Editar Código para ${this.language}`
          this.codeContent = this.snippetToEdit.code
        } else {
          // Modo Adição: Deixa o editor em branco.
          this.titleModal = `Adicionar Código para ${this.language}`
          this.codeContent = `// Adicione seu código em ${this.language} aqui...`
        }
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    async submitSnippet() {
      if (this.isEditMode) {
        // Lógica de Atualização
        const dataToUpdate = { code: this.codeContent }
        await SystemController.updateCodeSnippet(this.snippetToEdit.id, dataToUpdate)
      } else {
        // Lógica de Criação
        const snippetData = {
          algorithm_id: this.algorithmId,
          lang: this.language,
          code: this.codeContent
        }
        await SystemController.addCodeSnippet(snippetData)
      }
      this.closeModal()
    }
  }
}
</script>
