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
              <slot name="title">Adicionar Fonte</slot>
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
                  <label class="form-check-label" for="link">Url da Fonte</label>
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
                  v-model="fontData.url"
                  type="url"
                  class="form-control"
                  placeholder="https://exemplo.com/fonte.woff2"
                />
              </div>

              <div v-else-if="fontData.uploadType === 'import'" class="mb-3">
                <label for="fontLink" class="form-label">Import da Fonte</label>
                <input
                  id="fontLink"
                  v-model="fontData.url"
                  type="url"
                  class="form-control"
                  placeholder="@import url('https://example.com/styles.css');"
                />
              </div>
            </slot>
          </div>
          <div class="modal-footer">
            <slot name="footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">Cancelar</button>
              <button type="button" class="btn btn-primary" @click="submitLink">Adicionar</button>
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
      fontData: {
        name: '',
        family: '',
        uploadType: 'link',
        url: ''
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    submitLink() {
      SystemController.addFont(this.fontData)

      // Limpa o formulário após adicionar o link
      this.fontData = {
        name: '',
        family: '',
        uploadType: 'link',
        url: ''
      }

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
