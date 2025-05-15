<script setup>
import AIBadge from './IABadge.vue'
import { getAIModel } from '../service/userPreferences'
</script>

<template>
  <div class="ai-chat container-fluid">
    <div class="chat-box card p-3 mb-3" ref="messagesContainer">
      <div v-for="(msg, index) in messages" :key="index" :class="['message', msg.sender]">
        <div
          class="message-content"
          v-html="msg.sender === 'ia' ? renderMarkdown(msg.text) : msg.text"
        ></div>
      </div>
      <!-- Indicador de pensamento (NOVO) -->
      <div v-if="isThinking" class="message ia thinking-indicator">
        <div class="message-content">
          <span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>
        </div>
      </div>
    </div>

    <!-- No template - substituir a textarea e botão existentes -->
    <div class="input-wrapper">
      <div class="d-flex align-items-center justify-content-center">
        <textarea
          v-model="userInput"
          @keyup.enter.exact.prevent="sendMessage"
          class="message-input me-3"
          placeholder="Digite sua pergunta..."
          rows="1"
          @input="autoResize"
        ></textarea>
        <button class="send-button" @click="sendMessage">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M4.5 19.5L19.5 4.5M19.5 4.5L8.25 4.5M19.5 4.5V15.75"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>

      <!-- Footer com opções -->
      <div class="input-footer px-0 mt-3">
        <div class="quick-actions">
          <button
            class="footer-button"
            :class="{ active: activeButton === 'assistente' }"
            @click="modoAssistente"
          >
            <span>🔍 Assistente</span>
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
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css' // Tema escuro recomendado

// Importe os componentes de linguagem necessários
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-bash'

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
      deep: true,
      immediate: true // Adicione se precisar rodar na montagem inicial
    }
  },
  mounted() {
    this.loadMessages()
  },
  methods: {
    renderMarkdown(text) {
      // Configuração do marked para usar Prism
      marked.setOptions({
        highlight: (code, lang) => {
          const language = Prism.languages[lang] ? lang : 'markup'
          return Prism.highlight(code, Prism.languages[language], language)
        }
      })

      const rendered = marked.parse(text)

      this.$nextTick(() => {
        // Atualiza o highlight para qualquer bloco novo
        Prism.highlightAllUnder(this.$refs.messagesContainer)
      })

      return rendered
    },
    // No método sendMessage():
    async sendMessage() {
      const input = this.userInput.trim()
      if (!input) return

      this.messages.push({ sender: 'user', text: input })
      this.userInput = ''
      this.isThinking = true // ← Estado ativado
      this.saveMessages()

      try {
        const aiResponse = await window.chatAPI.sendMessageWithModel(
          input,
          this.currentModel,
          this.activeButton
        )
        this.messages.push({ sender: 'ia', text: aiResponse })
      } catch (error) {
        this.messages.push({ sender: 'ia', text: '❌ Erro ao se comunicar com a IA.' })
        console.error(error)
      } finally {
        this.isThinking = false // ← Estado desativado
        this.saveMessages()
      }
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
        // Usamos scrollTo para uma animação suave
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth'
        })
      }
    },
    // Adicione este método para autoajustar a altura
    autoResize() {
      this.$nextTick(() => {
        const textarea = this.$el.querySelector('.message-input')
        textarea.style.height = 'auto'
        const newHeight = Math.min(Math.max(textarea.scrollHeight, 44), 120)
        textarea.style.height = `${newHeight}px`
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
  overflow-x: hidden; /* Impede scroll horizontal no container principal */
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
  width: fit-content;
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

.btn-ia {
  background-color: #7c3aed;
  color: white;
}

.btn-ia:hover {
  background-color: #6d28d9;
  color: white;
}

.input-wrapper {
  position: relative;
  padding: 12px 16px;
  background: var(--ia-input-bg);
  border-radius: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.message-input {
  width: 95%;
  border: none;
  background: transparent;
  color: var(--ia-input-color);
  resize: none;
  padding: 8px 40px 8px 16px;
  font-size: 15px;
  line-height: 1.5;
  min-height: 44px;
  max-height: 120px;
  overflow-y: auto;
  border-radius: 8px;
}

.message-input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.2);
}

.send-button {
  right: 16px;
  bottom: 16px;
  background: #7c3aed;
  border: none;
  color: white;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  padding: 5px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(124, 58, 237, 0.2);
}

.send-button:hover {
  background: #6d28d9;
  transform: translateY(-1px) scale(1.05);
}

.send-button:active {
  transform: scale(0.95);
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

.message-content {
  /* Substitua ou adicione: */
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  word-break: break-word;
}

.message-content p {
  margin-bottom: 1rem;
  line-height: 1.6;
}

.message-content h1,
.message-content h2,
.message-content h3 {
  color: var(--purple);
  margin: 1.5rem 0 1rem;
  border-bottom: 1px solid var(--comment);
  padding-bottom: 0.5rem;
}

.message-content code {
  font-family: 'Fira Code', monospace;
  background-color: var(--background);
  padding: 0.2em 0.4em;
  border-radius: 4px;
  color: var(--yellow);
}

.message-content pre {
  background-color: var(--background) !important;
  padding: 1rem;
  border-radius: 8px;
  margin: 1.5rem 0;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.3);
}

.message-content pre code {
  background-color: transparent !important;
  padding: 0;
  color: inherit;
  font-size: 0.9em;
}

.message-content blockquote {
  border-left: 3px solid var(--purple);
  margin: 1rem 0;
  padding: 0.5rem 1rem;
  background-color: var(--current-line);
  color: var(--comment);
  border-radius: 4px;
}

.message-content a {
  color: var(--cyan);
  text-decoration: none;
  border-bottom: 1px dashed var(--cyan);
}

.message-content a:hover {
  color: var(--pink);
  border-bottom-style: solid;
}

/* Adicione ao seu <style scoped> */
/* Ajustes específicos para blocos de código */
:deep(pre[class*='language-']) {
  max-width: 100%;
  overflow-x: auto;
  white-space: pre-wrap; /* Permite quebra de linha */
  word-wrap: break-word;
  background: #1e1e2a !important;
  border-radius: 8px;
  margin: 1.5rem 0;
  padding: 1.5rem 1rem 1rem !important;
}

:deep(code[class*='language-']) {
  white-space: pre-wrap; /* Permite quebra de linha no código */
  word-break: break-all; /* Quebra palavras longas */
  display: inline-block; /* Melhora o comportamento de quebra */
  max-width: 100%;
}

:deep(pre[class*='language-']:before) {
  content: attr(data-language);
  position: absolute;
  top: 0;
  right: 10px;
  color: #6272a4;
  font-size: 0.8em;
  text-transform: uppercase;
}

:deep(code[class*='language-']) {
  font-family: 'Fira Code', monospace !important;
  font-size: 0.9em;
  background: transparent !important;
}

/* Substitua o CSS existente do .dot por: */
.thinking-indicator .dot {
  animation: blink 1.4s infinite;
  opacity: 0;
  font-size: 22px; /* Tamanho aumentado */
  margin: 0 2px; /* Espaçamento entre pontos */
  vertical-align: middle;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}
.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes blink {
  50% {
    opacity: 1;
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}
</style>
