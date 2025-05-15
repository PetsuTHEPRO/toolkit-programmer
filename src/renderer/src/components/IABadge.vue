<template>
  <span 
    class="ai-badge d-inline-flex align-items-center"
    :class="[sizeClass, {'ai-badge-clickable': clickable}]"
    :style="{ backgroundColor: bgColor, color: textColor }"
    @click="handleClick"
  >
    <span class="ai-icon me-1" :class="iconClass"></span>
    <span class="ai-name">{{ displayName }}</span>
  </span>
</template>

<script>
export default {
  name: 'IABadge',
  props: {
    ai: {
      type: String,
      required: true,
      validator: value => ['deepseek', 'gpt', 'gemini', 'llama', 'qwen', 'deephermes'].includes(value.toLowerCase())
    },
    size: {
      type: String,
      default: 'md',
      validator: value => ['sm', 'md', 'lg'].includes(value.toLowerCase())
    },
    clickable: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    bgColor() {
      const colors = {
        deepseek: '#6e48aa',
        gpt: '#10a37f',
        gemini: '#4285f4',
        llama: '#f8981d',
        qwen: '#613EDB',
        deephermes: '#4a4d52'
      }
      return colors[this.ai.toLowerCase()]
    },
    textColor() {
      // Retorna cor de texto contrastante
      return '#ffffff' // Branco para todos por enquanto
    },
    displayName() {
      const names = {
        deepseek: 'DeepSeek',
        gpt: 'ChatGPT',
        gemini: 'Gemini',
        llama: 'Llama',
        qwen: 'Qwen',
        deephermes: 'DeepHermes'
      }
      return names[this.ai.toLowerCase()]
    },
    iconClass() {
      return `ai-${this.ai.toLowerCase()}-icon`
    },
    sizeClass() {
      return {
        sm: 'px-2 py-1 small',
        md: 'px-3 py-1',
        lg: 'px-4 py-2 h5 mb-0'
      }[this.size.toLowerCase()]
    }
  },
  methods: {
    handleClick() {
      if (this.clickable) {
        this.$emit('click')
      }
    }
  }
}
</script>

<style scoped>
.ai-badge {
  border-radius: 20px;
  font-weight: 600;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.ai-badge-clickable {
  cursor: pointer;
}

.ai-badge-clickable:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* Ícones (usando classes pseudo-elementos ou podemos usar ícones reais) */
.ai-icon {
  width: 16px;
  height: 16px;
  display: inline-block;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.ai-deepseek-icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M12 2L4 12l8 10 8-10-8-10zm0 15a5 5 0 110-10 5 5 0 010 10z"/></svg>');
}

.ai-gpt-icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16z"/></svg>');
}

.ai-gemini-icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.8L18 7l-6 3.2L6 7l6-2.2zM6 9.5l6 3.2v6.6L6 16.1V9.5zm12 6.6l-6 3.2v-6.6l6-3.2v6.6z"/></svg>');
}

.ai-llama-icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm-2-8a2 2 0 104 0 2 2 0 00-4 0z"/></svg>');
}

.ai-qwen-icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2V7zm0 8h2v2h-2v-2z"/></svg>');
}

.ai-deephermes-icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="2"/><path d="M12 7v3" stroke="white" stroke-width="2"/><circle cx="12" cy="16" r="0.5" fill="white"/></svg>');
}
</style>
