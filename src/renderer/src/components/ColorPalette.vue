<template>
  <div class="card overflow-visible">
    <div class="card-header p-4">
      <div class="d-flex justify-content-between align-items-center">
        <h5 class="card-title text-lg">{{ title }}</h5>
        <div class="icons d-flex align-items-center">
          <i
            class="bx bx-trash me-1 cursor-pointer"
            @click="handleDelete(index, colors.length)"
          ></i>
          <i class="bx bx-edit cursor-pointer" @click="editPalette(index)"></i>
        </div>
      </div>
      <p class="card-text text-muted">{{ description }}</p>
    </div>
    <div class="card-body p-0">
      <div class="d-flex h-24">
        <div
          v-for="(color, index) in colors"
          :key="index"
          class="color-box flex-fill position-relative"
          :style="{ backgroundColor: color }"
          @click="copyToClipboard(color)"
        >
          <span
            class="color-code"
            :style="{ color: getTextColor(color) }"
            v-text="color.toUpperCase()"
          ></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import notificationService from '@renderer/service/notificationService.js'
import SystemController from '@renderer/controller/SystemController.js'
export default {
  props: {
    index: {
      type: Number,
      required: true
    },
    colors: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      idPalette: -1
    }
  },
  methods: {
    // Função para determinar a cor do texto com base na cor de fundo
    getTextColor(color) {
      const brightness = this.getBrightness(color)
      return brightness > 128 ? 'black' : 'white' // Retorna preto se a cor for clara e branco se for escura
    },
    // Função auxiliar para converter hex para rgb
    getBrightness(hex) {
      var r, g, b, longo
      hex = hex.replace('#', '')
      longo = hex.length > 3

      r = longo ? parseInt(hex.substr(0, 2), 16) : parseInt(hex.substr(0, 1), 16) * 17
      g = longo ? parseInt(hex.substr(2, 2), 16) : parseInt(hex.substr(1, 1), 16) * 17
      b = longo ? parseInt(hex.substr(4, 2), 16) : parseInt(hex.substr(2, 1), 16) * 17

      return (r * 299 + g * 587 + b * 114) / 1000
    },
    copyToClipboard(color) {
      navigator.clipboard
        .writeText(color)
        .then(() => {
          this.copiedColor = color.toUpperCase()
          notificationService.success('Código da cor copiada com sucesso!')
        })
        .catch((err) => {
          console.error('Erro ao copiar o texto: ', err)
        })
    },
    handleDelete(index, count) {
      SystemController.deletePalette(index, count)
    },
    editPalette(index) {
      this.$emit('edit-palette', index)
    }
  }
}
</script>

<style scoped>
/* Certifica que o card permite overflow */
.card {
  position: relative;
  overflow: visible;
}

.h-24 {
  height: 6rem;
}

.color-box {
  position: relative;
  transition: flex-grow 0.3s ease, transform 0.3s ease, z-index 0s;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: visible; /* Permite que o conteúdo transborde */
  flex-grow: 1;
  z-index: 1;
  box-sizing: border-box !important;
  border: 1px solid black;
}

.color-box:hover {
  z-index: 10; /* Traz o elemento para frente */
  flex-grow: 2; /* Expande a cor ao passar o mouse */
  transform: scale(1.1); /* Aumenta ligeiramente o tamanho */
}

.color-code {
  opacity: 0;
  font-size: 0.75rem;
  color: #fff;
  font-weight: bold;
  transition: opacity 0.3s ease;
}

.color-box:hover .color-code {
  opacity: 1; /* Mostra o código da cor quando o mouse está sobre ela */
}

.card-text{
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Limita para 2 linhas */
  -webkit-box-orient: vertical;
  height: 50px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bx{
  font-size: 20px;
  width: 25px;
  height: 25px;
  display: flex;
  cursor: pointer;
  justify-content: center;
  align-items: center;
}

.bx-trash:hover{
  background-color: rgba(255, 107, 107, 0.884);
  border-radius: 15px;
}

.bx-edit:hover{
  background-color: rgba(107, 220, 255, 0.884);
  border-radius: 15px;
}
</style>
