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
              <div name="title">{{ !paletteEdit ? 'Adicionar Paleta' : 'Editar Paleta' }}</div>
            </h5>
            <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <slot name="body">
              <!-- Input para o nome do link -->
              <div class="mb-3">
                <label for="paletteName" class="form-label">Nome</label>
                <input
                  id="paletteName"
                  v-model="paletteData.name"
                  type="text"
                  class="form-control"
                  placeholder="Ex: Color Palette"
                />
              </div>
              <div class="mb-3">
                <label for="paletteDescription" class="form-label">Descrição</label>
                <input
                  id="paletteDescription"
                  v-model="paletteData.description"
                  type="text"
                  class="form-control"
                  placeholder="Ex: Descricão da Paleta de Cores"
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Cores da Paleta</label>
                <br />
                <div
                  v-for="(color, index) in paletteData.colors"
                  :key="index"
                  class="d-flex align-items-center mb-2"
                >
                  <input
                    v-model="paletteData.colors[index]"
                    type="color"
                    class="form-control-color me-2"
                  />
                  <input
                    v-model="paletteData.colors[index]"
                    type="text"
                    placeholder="#FFFFFF"
                    class="form-control flex-grow-1 me-2"
                    maxlength="7"
                    @input="updateColor(index, $event.target.value)"
                  />
                  <button type="button" class="btn btn-outline-danger" @click="removeColor(index)">
                    <span>&times;</span>
                  </button>
                </div>
                <button
                  v-if="paletteData.colors.length < 5"
                  class="btn btn-outline-secondary"
                  type="button"
                  @click="addColor"
                >
                  <span class="me-1">+</span> Adicionar Cor
                </button>
              </div>
            </slot>
          </div>
          <div class="modal-footer">
            <slot name="footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">Cancelar</button>
              <button type="button" class="btn btn-primary" @click="submitPalette">Adicionar</button>
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
    paletteId: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      paletteData: {
        name: '',
        description: '',
        colors: []
      },
      paletteEdit: null
    }
  },
  created() {
    if (this.paletteId !== -1) {
      this.paletteEdit = SystemController.getStorage('palettesStorage')[this.paletteId]
      this.paletteData = {
        name: this.paletteEdit.name,
        description: this.paletteEdit.description,
        colors: this.paletteEdit.colors
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    submitPalette() {
      if (this.paletteEdit) {
        this.paletteEdit = {
          id: this.paletteId,
          name: this.paletteData.name,
          description: this.paletteData.description,
          colors: this.paletteData.colors
        }

        SystemController.editPalette(this.paletteEdit)
      } else {
        SystemController.addPalette(this.paletteData)
      }

      this.paletteData = {
        name: '',
        description: '',
        colors: []
      }

      // Lógica para fechar o modal
      this.closeModal()
    },
    addColor() {
      if (this.paletteData.colors.length < 5) {
        this.paletteData.colors.push('#FFFFFF')
      }
    },
    removeColor(index) {
      this.paletteData.colors.splice(index, 1)
    },
    updateColor(index, value) {
      this.paletteData.colors[index] = value
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
