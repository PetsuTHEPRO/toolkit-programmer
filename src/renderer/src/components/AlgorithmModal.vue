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
              <h5 class="modal-title" id="modalTitle">
                <slot name="title">{{ algorithmData.name }}</slot>
              </h5>
              <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <slot name="body">

                <div class="mb-3">
                    <span class="form-label fw-bold">Explicação</span>
                    <p class="text-light mt-2" style="overflow-x: hidden;">{{ algorithmData.explanation }}</p>
                </div>

                <div class="mb-3">
                  <span class="form-label fw-bold">Código( {{ algorithmData.language }} ):</span>
                  <pre class="bg-light text-black p-3 mt-3 rounded d-flex">
                    <code>{{ algorithmData.code }}</code>
                </pre>
                </div>

              </slot>
            </div>
            <div class="modal-footer">
              <slot name="footer">
                <button type="button" class="btn btn-secondary" @click="closeModal">Cancelar</button>
              </slot>
            </div>
          </div>
        </div>
      </div>
      <div v-if="visible" class="modal-backdrop fade show"></div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      algorithmData: {
        type: Object,
        default: () => {}
      }
    },
    data() {
      return {
        
      }
    },
    methods: {
      closeModal() {
        this.$emit('close')
      },
      submitImage() {
        // Lógica para adicionar o material
        this.$emit('submit', this.algorithmData)
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