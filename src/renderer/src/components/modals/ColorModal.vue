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
              <button type="button" class="btn btn-primary" @click="submitPalette">
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

const NO_PALETTE_ID = -1

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
      titleModal: 'Adicionar',
      // 'paletteData' é o estado local do nosso formulário. É sempre um objeto simples.
      paletteData: {
        name: '',
        description: '',
        colors: ['#FFFFFF'] // Começa com uma cor padrão
      }
    }
  },
  computed: {
    // Computed property para saber claramente em qual modo estamos.
    isEditMode() {
      return this.paletteId !== NO_PALETTE_ID
    }
  },
  watch: {
    // Este "observador" é acionado sempre que o modal se torna visível.
    // Esta é a forma mais robusta de preparar o estado do modal.
    visible: {
      handler(isNowVisible) {
        if (isNowVisible) {
          if (this.isEditMode) {
            this.titleModal = 'Editar'
            this.loadPaletteForEditing()
          } else {
            this.titleModal = 'Adicionar'
            this.resetForm()
          }
        }
      },
      immediate: true // Garante que rode uma vez na criação do componente
    }
  },
  methods: {
    // Limpa o formulário para o modo de adição.
    resetForm() {
      this.paletteData = {
        id: NO_PALETTE_ID,
        name: '',
        description: '',
        colors: ['#FFFFFF']
      }
    },
    closeModal() {
      this.$emit('close')
    },
    // Busca os dados da forma correta para o modo de edição.
    loadPaletteForEditing() {
      const storedPalettes = this.$store.getters.getStorage('palettesStorage')
      const paletteToEdit = storedPalettes.find((p) => p.id === this.paletteId)

      if (paletteToEdit) {
        // Criamos uma cópia profunda para evitar modificar a store diretamente.
        this.paletteData = JSON.parse(JSON.stringify(paletteToEdit))
      }
    },
    // O método de submissão agora é simples e seguro.
    // Em ColorModal.vue, dentro de 'methods'

    // Em ColorModal.vue, dentro de 'methods'

    async submitPalette() {
      if (!this.paletteData.name || this.paletteData.colors.length === 0) {
        alert('Por favor, preencha o nome e adicione pelo menos uma cor.')
        return
      }

      // AQUI ESTÁ A CORREÇÃO FINAL:
      // Criamos um objeto "plano" manualmente para garantir 100% de pureza.
      const plainPaletteData = {
        name: this.paletteData.name,
        description: this.paletteData.description,
        // Usamos JSON.parse(JSON.stringify(...)) para criar uma cópia "morta"
        // e não reativa do array de cores, resolvendo o problema do clone.
        colors: JSON.parse(JSON.stringify(this.paletteData.colors))
      }

      if (this.isEditMode) {
        // Para editar, passamos o ID existente e o objeto limpo.
        // --- AQUI ESTÁ A CORREÇÃO QUE VOCÊ PEDIU ---

        // 1. Criamos um novo objeto combinando os dados do formulário com o ID existente.
        // O '...' (spread operator) copia as chaves de plainPaletteData (name, description, colors)
        // e em seguida nós adicionamos a chave 'id'.
        const dataWithId = {
          ...plainPaletteData,
          id: this.paletteId
        }

        // 2. Enviamos este ÚNICO objeto para o controller, como você queria.
        await SystemController.editPalette(dataWithId)
      } else {
        // Para criar, geramos um novo ID e o adicionamos ao objeto limpo.
        plainPaletteData.id = this.generateId()
        await SystemController.addPalette(plainPaletteData)
      }

      this.closeModal()
    },

    // Métodos de UI para manipular o array de cores.
    addColor() {
      if (this.paletteData.colors.length < 5) {
        this.paletteData.colors.push('#FFFFFF')
      }
    },
    removeColor(index) {
      this.paletteData.colors.splice(index, 1)
    },
    updateColor(index, value) {
      // Garante que o input de texto atualize a cor corretamente
      if (/^#[0-9A-F]{6}$/i.test(value)) {
        this.paletteData.colors[index] = value
      }
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
