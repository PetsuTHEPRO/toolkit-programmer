<script setup>
import { ref } from 'vue'
import { VuePDF, usePDF } from '@tato30/vue-pdf'

// Referência para a página atual
const page = ref(1)

// Referência para o arquivo PDF carregado
const pdfFile = ref(null)

// Carrega o PDF com a função usePDF
const { pdf, pages } = usePDF(pdfFile)

// Estado para controlar o nível de zoom
const zoom = ref(1.2) // 1 = 100%

// Função para lidar com a mudança do input de arquivo
const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file && file.type === 'application/pdf') {
    const reader = new FileReader()
    reader.onload = (e) => {
      // Carrega o PDF a partir do arquivo selecionado
      pdfFile.value = e.target.result
      page.value = 1 // Reseta a página para 1 após o upload
    }
    reader.readAsArrayBuffer(file) // Lê o arquivo como ArrayBuffer
  }
}

// Métodos para aumentar e diminuir o zoom
const zoomIn = () => {
  if (zoom.value <= 1.7) {
    zoom.value += 0.1 // Aumenta o zoom em 10%
  }
}

const zoomOut = () => {
  if (zoom.value >= 0.75) {
    zoom.value -= 0.1 // Diminui o zoom em 10% (mínimo de 20%)
  }
}

const zoomReset = () => {
  zoom.value = 1.2
}
</script>

<template>
  <div class="container mx-auto p-4 max-w-4xl">
    <div class="card shadow-lg">
      <div class="card-header">
        <h5 class="card-title text-center">Visualizador de PDF</h5>
      </div>
      <div class="card-body">
        <div class="mb-4">
          <input
            id="pdfFile"
            type="file"
            accept="application/pdf"
            class="form-control-file"
            @change="handleFileUpload"
          />
        </div>
        <div class="d-flex justify-content-center">
          <div
            class="border rounded overflow-hidden bg-white shadow-inner"
            style="width: 800px; height: 1000px"
          >
            <div
              v-if="!pdf"
              class="w-100 h-100 d-flex flex-column align-items-center justify-content-center text-secondary"
            >
              <svg class="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p class="h5 fw-bold">Visualização de PDF</p>
              <p class="small">Este é o local para visualizar o conteúdo do PDF</p>
            </div>
            <VuePDF v-else :pdf="pdf" :page="page" :scale="zoom" />
          </div>
        </div>
      </div>
      <div class="card-footer d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center">
          <button
            class="btn btn-outline-secondary btn-sm me-2"
            @click="page = page > 1 ? page - 1 : page"
          >
            <span class="bx bx-chevron-left"></span>
          </button>
          <span>Página {{ page }} de {{ pages }}</span>
          <button
            class="btn btn-outline-secondary btn-sm ms-2"
            @click="page = page < pages ? page + 1 : page"
          >
            <span class="bx bx-chevron-right"></span>
          </button>
        </div>
        <div class="d-flex align-items-center">
          <button class="btn btn-outline-secondary btn-sm me-2" @click="zoomOut">
            <span class="bx bx-zoom-out"></span>
          </button>
          <button @click="zoomReset" class="btn btn-sm">{{ (zoom * 100 - 20).toFixed(0) }}%</button>
          <button class="btn btn-outline-secondary btn-sm ms-2" @click="zoomIn">
            <span class="bx bx-zoom-in"></span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PdfViewer'
}
</script>

<style scoped>
/* Estilos adicionais, se necessário */
</style>
