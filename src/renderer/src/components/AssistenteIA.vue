<script setup>
import AIBadge from './IABadge.vue'
import { getAIModel } from '../service/userPreferences'
</script>

<template>
  <div class="ai-chat container-fluid">
    <div class="d-flex justify-content-end align-items-center mb-2">
    </div>

    <div class="chat-box card p-3 mb-3" ref="messagesContainer">
      <div
        v-for="(msg, index) in messages"
        :key="index"
        :class="['message', msg.sender]"
        v-html="msg.sender === 'ia' ? renderMarkdown(msg.text) : msg.text"
      ></div>
      <div v-if="isThinking" class="message ia">
        <em>Digitando...</em>
      </div>
    </div>

    <div class="chat-input-container">
      <div class="input-wrapper">
        <textarea
          v-model="userInput"
          @keyup.enter.exact.prevent="sendMessage"
          class="message-input"
          placeholder="Digite sua pergunta..."
          rows="1"
        ></textarea>
        <button class="send-button" @click="sendMessage">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M7 11L12 6L17 11M12 6V18"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>

      <!-- Footer com opções -->
      <div class="input-footer">
        <div class="quick-actions">
          <button
            class="footer-button"
            :class="{ active: activeButton === 'assistente' }"
            @click="modoAssistente"
          >
            <span>🎨 Assistente</span>
          </button>
          <button
            class="footer-button"
            :class="{ active: activeButton === 'autofill' }"
            @click="modoAutofill"
          >
            <span>🔄 Preencha pra mim</span>
          </button>
        </div>
        <div class="model-info">
          <button class="btn btn-outline-danger btn-sm" @click="clearMessages">Limpar Chat</button>
          <span class="badge">v2.4.1</span>
          <span class="separator">|</span>
          <AIBadge :ai="currentModel" size="sm" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { marked } from 'marked'

export default {
  data() {
    return {
      userInput: '',
      messages: [],
      isThinking: false,
      activeButton: 'geral' // Novo estado para controlar o botão ativo
    }
  },
  computed: {
    currentModel() {
      return getAIModel()
    }
  },
  watch: {
    messages: {
      handler() {
        this.$nextTick(this.scrollToBottom)
      },
      deep: true
    }
  },
  mounted() {
    this.loadMessages()
  },
  methods: {
    renderMarkdown(text) {
      return marked.parse(text)
    },
    async sendMessage() {
      const input = this.userInput.trim()
      if (!input) return

      this.messages.push({ sender: 'user', text: input })
      this.userInput = ''
      this.isThinking = true
      this.saveMessages()

      try {
        const aiResponse = await window.chatAPI.sendMessageWithModel(input, this.currentModel, this.activeButton)
        this.messages.push({ sender: 'ia', text: aiResponse })
      } catch (error) {
        this.messages.push({ sender: 'ia', text: '❌ Erro ao se comunicar com a IA.' })
        console.error(error)
      } finally {
        this.isThinking = false
        this.saveMessages()
      }
    },
    getModel() {
      console.log('Modelo alterado para:', this.currentModel)
    },
    saveMessages() {
      // Mantém apenas as 10 últimas mensagens
      if (this.messages.length > 10) {
        this.messages = this.messages.slice(this.messages.length - 10)
      }
      sessionStorage.setItem('chatMessages', JSON.stringify(this.messages))
    },
    loadMessages() {
      const stored = sessionStorage.getItem('chatMessages')
      if (stored) {
        this.messages = JSON.parse(stored)
      } else {
        this.clearMessages()
      }
    },
    modoAssistente() {
      this.activeButton = this.activeButton === 'assistente' ? 'geral' : 'assistente'
    },
    modoAutofill() {
      this.activeButton = this.activeButton === 'autofill' ? 'geral' : 'autofill'
    },
    clearMessages() {
      this.messages = []
      this.isThinking = false

      const welcomeMessage = `Olá! Bem-vindo ao **Toolkit Programmer**. Como posso te ajudar hoje? 🚀  

Por exemplo, você pode perguntar: 
- *"Como cadastrar uma paleta de cores?"*  
- *"Quais frameworks já tenho salvos?"*  
- *"Como adicionar um link útil na seção Learn?"*
- *"Vou criar um site educacional. Tenho alguma paleta, imagem ou fonte que ajude?"*

Digite \`help\` para ver todas as áreas que posso explicar.😊`

      this.messages.push({ sender: 'ia', text: this.renderMarkdown(welcomeMessage) })
      sessionStorage.removeItem('chatMessages')
      this.saveMessages()
    },
    scrollToBottom() {
      const container = this.$refs.messagesContainer
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    },
    // Adicione este método para autoajustar a altura
    autoResize() {
      this.$nextTick(() => {
        const textarea = this.$el.querySelector('.message-input')
        textarea.style.height = 'auto'
        textarea.style.height = `${textarea.scrollHeight}px`
      })
    }
  }
}
</script>

<style scoped>
@import url('../assets/base.css');

.ai-chat {
  background-color: var(--ia-bg);
  color: var(--ia-color);
  padding: 1rem;
  min-height: 500px;
}

.chat-box {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  height: 520px;
  overflow-y: auto;
  background: var(--ia-chat-bg);
  border-radius: 12px;
  padding: 1rem;
}

.message {
  max-width: 75%;
  padding: 10px 15px;
  border-radius: 16px;
  white-space: pre-wrap;
  line-height: 1.5;
  word-wrap: break-word;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.user {
  align-self: flex-end;
  background-color: #0d6efd;
  color: white;
  border-bottom-right-radius: 0;
}

.ia {
  align-self: flex-start;
  background-color: var(--ia-balloon-bg);
  color: var(--ia-balloon-color);
  border-bottom-left-radius: 0;
}

.input-group {
  margin-top: 0.5rem;
}

.form-control {
  background-color: var(--ia-input-bg);
  border: 1px solid var(--ia-input-border);
  color: var(--ia-input-color);
}

.form-control::placeholder {
  color: var(--ia-input-placeholder);
}

.btn-ia {
  background-color: #7c3aed;
  color: white;
}

.btn-ia:hover {
  background-color: #6d28d9;
  color: white;
}

.chat-input-container {
  margin-top: 1rem;
  border: 1px solid var(--ia-input-border);
  border-radius: 12px;
  background: var(--ia-input-bg);
}

.input-wrapper {
  position: relative;
  padding: 12px 16px;
}

.message-input {
  width: 100%;
  border: none;
  background: transparent;
  color: var(--ia-input-color);
  resize: none;
  max-height: 200px;
  padding-right: 40px;
  font-family: inherit;
  font-size: 16px;
}

.message-input:focus {
  outline: none;
  box-shadow: none;
}

.send-button {
  position: absolute;
  right: 12px;
  bottom: 12px;
  background: none;
  border: none;
  color: #7c3aed;
  padding: 4px;
  cursor: pointer;
  transition: transform 0.2s;
}

.send-button:hover {
  transform: translateY(-2px);
}

.input-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  border-top: 1px solid var(--ia-input-border);
}

.quick-actions {
  display: flex;
  gap: 8px;
}

.footer-button {
  background: rgba(124, 58, 237, 0.1);
  border: none;
  border-radius: 8px;
  padding: 6px 12px;
  color: #7c3aed;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.footer-button:hover {
  background: rgba(124, 58, 237, 0.2);
}

.footer-button.active {
  background: rgba(124, 58, 237, 0.3) !important;
  color: white;
  transform: scale(0.98);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.model-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--ia-input-placeholder);
}

.badge {
  background: rgba(0, 0, 0, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.8em;
}

.separator {
  opacity: 0.5;
  margin: 0 4px;
}
</style>
