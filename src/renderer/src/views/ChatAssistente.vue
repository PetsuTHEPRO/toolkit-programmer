<script setup>
import Sidebar from '../components/Sidebar.vue'
import ConnectionModal from '../components/modals/GeminiConnectionModal.vue'
import WorkspaceModal from '../components/modals/WorkspaceModal.vue'
</script>

<template>
  <div
    class="container-fluid d-flex p-0"
    :class="themeMode === 'dark' ? 'dark-theme' : 'light-theme'"
  >
    <Sidebar />
    <div class="main-content w-100 m-0" :class="isSidebarOpen ? 'open-menu' : 'close-menu'">
      <div class="content-wrapper">
        <!-- Header Section -->
        <div class="header-section">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h1 class="page-title mb-2">
                <i class="bx bx-brain me-2"></i>
                Gemini Workspace
              </h1>
              <nav aria-label="breadcrumb">
                <ol class="breadcrumb custom-breadcrumb mb-0">
                  <li class="breadcrumb-item">
                    <i class="bx bx-home-alt me-1"></i>
                    Home
                  </li>
                  <li class="breadcrumb-item active" aria-current="page">Assistente IA</li>
                </ol>
              </nav>
            </div>
          </div>

          <!-- Not Installed Banner -->
          <div v-if="!isInstalled" class="connection-banner error-banner">
            <i class="bx bx-error-circle banner-icon"></i>
            <div class="banner-content">
              <strong>Gemini CLI não instalado</strong>
              <p>Instale o Gemini CLI para usar o assistente de IA</p>
            </div>
            <button class="btn-modern btn-danger" @click="openInstallInstructions">
              <i class="bx bx-download me-2"></i>
              Ver Instruções
            </button>
          </div>

        </div>

        <!-- Main Layout -->
        <div class="workspace-layout">
          <!-- Workspaces Sidebar -->
          <div class="workspaces-sidebar" :class="{ hidden: isWorkspaceHidden }">
            <div class="sidebar-header">
              <h3 class="sidebar-title">
                <i class="bx bx-folder-open me-2"></i>
                Áreas de Trabalho
              </h3>
              <div class="sidebar-header-actions">
                <button
                  class="btn-add-workspace"
                  @click="openWorkspaceModal"
                  :disabled="!isInstalled"
                  title="Nova área de trabalho"
                >
                  <i class="bx bx-plus"></i>
                </button>
                <button
                  class="btn-toggle-sidebar"
                  @click="toggleWorkspaceSidebar"
                  title="Ocultar/Mostrar áreas de trabalho"
                >
                  <i class="bx" :class="isWorkspaceHidden ? 'bx-show' : 'bx-hide'"></i>
                </button>
              </div>
            </div>

            <!-- Workspace List -->
            <div class="workspaces-list">
              <div
                v-for="workspace in workspaces"
                :key="workspace.id"
                class="workspace-item"
                :class="{ active: activeWorkspace?.id === workspace.id }"
                @click="selectWorkspace(workspace)"
              >
                <div class="workspace-icon" :style="{ background: workspace.color }">
                  <i :class="workspace.icon"></i>
                </div>
                <div class="workspace-info">
                  <span class="workspace-name">{{ workspace.title }}</span>
                  <span class="workspace-messages">{{ workspace.messageCount }} mensagens</span>
                </div>
                <div class="workspace-actions">
                  <button class="btn-workspace-action" @click.stop="editWorkspace(workspace)">
                    <i class="bx bx-pencil"></i>
                  </button>
                  <button class="btn-workspace-action" @click.stop="deleteWorkspace(workspace.id)">
                    <i class="bx bx-trash"></i>
                  </button>
                </div>
              </div>

              <!-- Empty State -->
              <div v-if="workspaces.length === 0" class="empty-workspaces">
                <i class="bx bx-folder-plus empty-icon"></i>
                <p class="empty-text">Nenhuma área de trabalho</p>
                <button
                  class="btn-create-first"
                  @click="openWorkspaceModal"
                  :disabled="!isInstalled"
                >
                  Criar primeira área
                </button>
              </div>
            </div>
          </div>

          <!-- Toggle Button (quando sidebar está oculta) -->
          <button
            v-if="isWorkspaceHidden"
            class="btn-show-sidebar"
            @click="toggleWorkspaceSidebar"
            title="Mostrar áreas de trabalho"
          >
            <i class="bx bx-folder-open"></i>
          </button>

          <!-- Chat Area -->
          <div class="chat-area" :class="{ expanded: isWorkspaceHidden }">
            <!-- Workspace Header -->
            <div v-if="activeWorkspace" class="workspace-header">
              <div class="workspace-header-info">
                <div class="workspace-header-icon" :style="{ background: activeWorkspace.color }">
                  <i :class="activeWorkspace.icon"></i>
                </div>
                <div>
                  <h2 class="workspace-header-title">{{ activeWorkspace.title }}</h2>
                  <p class="workspace-header-description">{{ activeWorkspace.description }}</p>
                </div>
              </div>
              <div class="workspace-header-actions">
                <button class="btn-header-action" title="Exportar conversa">
                  <i class="bx bx-export"></i>
                </button>
                <button class="btn-header-action" title="Limpar histórico" @click="clearHistory">
                  <i class="bx bx-trash"></i>
                </button>
              </div>
            </div>

            <!-- Messages Container -->
            <div class="messages-container" ref="messagesContainer">
              <!-- Welcome State -->
              <div v-if="!activeWorkspace" class="welcome-state">
                <div class="welcome-icon">
                  <i class="bx bx-brain"></i>
                </div>
                <h2 class="welcome-title">Bem-vindo ao Gemini Workspace</h2>
                <p class="welcome-text">
                  Selecione uma área de trabalho ou crie uma nova para começar
                </p>
                <div class="welcome-features">
                  <div class="feature-item">
                    <i class="bx bx-folder-open"></i>
                    <span>Organize por projetos</span>
                  </div>
                  <div class="feature-item">
                    <i class="bx bx-history"></i>
                    <span>Histórico persistente</span>
                  </div>
                  <div class="feature-item">
                    <i class="bx bx-brain"></i>
                    <span>Contexto inteligente</span>
                  </div>
                </div>
              </div>

              <!-- Messages -->
              <div v-else-if="currentMessages.length > 0" class="messages-list">
                <div
                  v-for="(message, index) in currentMessages"
                  :key="index"
                  class="message"
                  :class="message.role"
                >
                  <div class="message-avatar">
                    <i class="bx" :class="message.role === 'user' ? 'bx-user' : 'bx-brain'"></i>
                  </div>
                  <div class="message-content">
                    <div class="message-header">
                      <span class="message-author">{{
                        message.role === 'user' ? 'Você' : 'Gemini'
                      }}</span>
                      <span class="message-time">{{ formatTime(message.timestamp) }}</span>
                    </div>
                    <div class="message-text" v-html="formatMessage(message.content)"></div>
                    <div v-if="message.role === 'assistant'" class="message-actions">
                      <button class="btn-message-action" title="Copiar">
                        <i class="bx bx-copy"></i>
                      </button>
                      <button class="btn-message-action" title="Regenerar">
                        <i class="bx bx-refresh"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Loading State -->
                <div v-if="isLoading" class="message assistant">
                  <div class="message-avatar">
                    <i class="bx bx-brain"></i>
                  </div>
                  <div class="message-content">
                    <div class="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Empty Chat State -->
              <div v-else class="empty-chat">
                <i class="bx bx-message-square-dots empty-chat-icon"></i>
                <h3>Inicie uma conversa</h3>
                <p>Faça uma pergunta ou descreva o que precisa</p>
                <div class="suggested-prompts">
                  <button
                    v-for="(prompt, index) in suggestedPrompts"
                    :key="index"
                    class="prompt-suggestion"
                    @click="useSuggestedPrompt(prompt)"
                  >
                    <i :class="prompt.icon"></i>
                    <span>{{ prompt.text }}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Input Area -->
            <div v-if="activeWorkspace" class="input-area">
              <div class="input-container">
                <button class="btn-input-tool" title="Anexar arquivo">
                  <i class="bx bx-paperclip"></i>
                </button>
                <textarea
                  v-model="userInput"
                  class="message-input"
                  placeholder="Digite sua mensagem..."
                  rows="1"
                  @keydown.enter.exact.prevent="sendMessage"
                  @input="autoResizeTextarea"
                  :disabled="!isInstalled || isLoading"
                  ref="messageInput"
                ></textarea>
                <button
                  class="btn-send"
                  @click="sendMessage"
                  :disabled="!userInput.trim() || !isInstalled || isLoading"
                >
                  <i class="bx bx-send"></i>
                </button>
              </div>
              <div class="input-footer">
                <span class="input-hint">
                  <i class="bx bx-info-circle me-1"></i>
                  Pressione Enter para enviar, Shift+Enter para nova linha
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Modals -->
        <ConnectionModal
          :visible="showConnectionModal"
          :currentConnection="connectionConfig"
          :isInstalled="isInstalled"
          @close="closeConnectionModal"
          @save="saveConnection"
        />

        <WorkspaceModal
          :visible="showWorkspaceModal"
          :workspace="editingWorkspace"
          @close="closeWorkspaceModal"
          @save="saveWorkspace"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getTheme } from '../service/userPreferences'

export default {
  data() {
    return {
      themeMode: getTheme(),
      showConnectionModal: false,
      showWorkspaceModal: false,
      isInstalled: false,
      isWorkspaceHidden: false,
      workspaces: [
        {
          id: 1,
          title: 'Desenvolvimento Web',
          description: 'Projeto de site institucional com React e Node.js',
          icon: 'bx bx-code-alt',
          color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          messageCount: 45,
          createdAt: new Date()
        },
        {
          id: 2,
          title: 'Criação de Ebook',
          description: 'Ebook sobre inteligência artificial para iniciantes',
          icon: 'bx bx-book-open',
          color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          messageCount: 23,
          createdAt: new Date()
        }
      ],
      activeWorkspace: null,
      messages: {},
      userInput: '',
      isLoading: false,
      editingWorkspace: null,
      suggestedPrompts: [
        { icon: 'bx bx-code-alt', text: 'Ajude-me a criar uma função' },
        { icon: 'bx bx-bulb', text: 'Sugira ideias para o projeto' },
        { icon: 'bx bx-help-circle', text: 'Explique um conceito' },
        { icon: 'bx bx-search-alt', text: 'Pesquise informações' }
      ]
    }
  },
  computed: {
    ...mapGetters(['isSidebarOpen']),
    connectionStatus() {
      if (!this.isInstalled) {
        return {
          text: 'Não Instalado',
          class: 'not-installed'
        }
      }

      return {
        text: 'Instalado',
        class: 'connected'
      }
    },
    currentMessages() {
      if (!this.activeWorkspace) return []
      return this.messages[this.activeWorkspace.id] || []
    }
  },
  async mounted() {
    await this.checkInstallationAndConnection()
  },
  methods: {
    async checkInstallationAndConnection() {
      try {
        // Verifica se o Gemini CLI está instalado
        const installStatus = await window.GeminiCLI.isInstalled()
        this.isInstalled = installStatus.installed
      } catch (error) {
        console.error('Erro ao verificar instalação/conexão:', error)
        this.isInstalled = false
      }
    },
    openConnectionModal() {
      this.showConnectionModal = true
    },
    closeConnectionModal() {
      this.showConnectionModal = false
    },
    async saveConnection() {
      this.showConnectionModal = false

      // Apenas salva a configuração e recarrega o status
      await this.checkInstallationAndConnection()
    },
    toggleWorkspaceSidebar() {
      this.isWorkspaceHidden = !this.isWorkspaceHidden
    },
    openWorkspaceModal(workspace = null) {
      this.editingWorkspace = workspace
      this.showWorkspaceModal = true
    },
    closeWorkspaceModal() {
      this.showWorkspaceModal = false
      this.editingWorkspace = null
    },
    saveWorkspace(workspace) {
      if (workspace.id) {
        // Edit existing
        const index = this.workspaces.findIndex((w) => w.id === workspace.id)
        this.workspaces[index] = { ...workspace }
      } else {
        // Create new
        const newWorkspace = {
          ...workspace,
          id: Date.now(),
          messageCount: 0,
          createdAt: new Date()
        }
        this.workspaces.push(newWorkspace)
        this.messages[newWorkspace.id] = []
      }
      this.closeWorkspaceModal()
    },
    selectWorkspace(workspace) {
      this.activeWorkspace = workspace
      if (!this.messages[workspace.id]) {
        this.messages[workspace.id] = []
      }
      this.$nextTick(() => {
        this.scrollToBottom()
      })
    },
    editWorkspace(workspace) {
      this.openWorkspaceModal(workspace)
    },
    deleteWorkspace(id) {
      if (confirm('Deseja realmente excluir esta área de trabalho?')) {
        this.workspaces = this.workspaces.filter((w) => w.id !== id)
        delete this.messages[id]
        if (this.activeWorkspace?.id === id) {
          this.activeWorkspace = null
        }
      }
    },
    clearHistory() {
      if (confirm('Deseja limpar todo o histórico desta conversa?')) {
        this.messages[this.activeWorkspace.id] = []
      }
    },
    openInstallInstructions() {
      alert('Instruções de instalação:\n\n1. Baixe o Gemini CLI\n2. Execute o instalador\n3. Reinicie o aplicativo')
      // Aqui você pode abrir uma modal com instruções detalhadas ou redirecionar para uma página
    },
    async sendMessage() {
      // Validações básicas
      if (!this.userInput.trim() || !this.isInstalled || this.isLoading) return

      // 1. Cria o objeto da mensagem do usuário
      const userMessage = {
        role: 'user',
        content: this.userInput,
        timestamp: new Date()
      }

      // Garante que o array de mensagens existe para esse workspace
      if (!this.messages[this.activeWorkspace.id]) {
        this.messages[this.activeWorkspace.id] = []
      }

      // Adiciona mensagem do usuário na tela
      this.messages[this.activeWorkspace.id].push(userMessage)
      
      // Guarda o prompt numa variável local antes de limpar o input
      const promptParaEnviar = this.userInput
      
      this.userInput = ''
      this.isLoading = true

      this.$nextTick(() => {
        this.scrollToBottom()
      })

      try {
        // Chama a ponte que vai ao Electron -> geminiService
        // Passamos o texto e o tipo de conexão ('apikey' ou 'google')
        const result = await window.GeminiCLI.run(promptParaEnviar, this.connectionType)

        let aiContent = ''

        if (result.success) {
          aiContent = result.output
        } else {
          aiContent = `Erro: ${result.error || 'Falha na comunicação com o Gemini.'}`
        }

        // Cria a mensagem de resposta da IA
        const aiMessage = {
          role: 'assistant',
          content: aiContent,
          timestamp: new Date()
        }

        // Adiciona a resposta na tela
        this.messages[this.activeWorkspace.id].push(aiMessage)
        this.activeWorkspace.messageCount++

      } catch (error) {
        // Tratamento de erro geral (caso a ponte falhe)
        const errorMessage = {
          role: 'assistant',
          content: 'Erro crítico ao tentar comunicar com o sistema.',
          timestamp: new Date()
        }
        this.messages[this.activeWorkspace.id].push(errorMessage)
        console.error(error)
      } finally {
        // Desativa o loading independente de sucesso ou erro
        this.isLoading = false
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      }
    },
    useSuggestedPrompt(prompt) {
      this.userInput = prompt.text
      this.$refs.messageInput.focus()
    },
    autoResizeTextarea(event) {
      const textarea = event.target
      textarea.style.height = 'auto'
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px'
    },
    scrollToBottom() {
      const container = this.$refs.messagesContainer
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    },
    formatMessage(content) {
      // Aqui você pode adicionar formatação markdown, syntax highlighting, etc
      return content.replace(/\n/g, '<br>')
    },
    formatTime(timestamp) {
      return new Date(timestamp).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }
}
</script>

<style scoped>
@import url('../assets/base.css');

/* Layout Principal */
.main-content {
  background: linear-gradient(
    135deg,
    var(--container-bg) 0%,
    var(--container-bg-alt, var(--container-bg)) 100%
  );
  min-height: 100vh;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.close-menu {
  margin-left: 90px !important;
}

.open-menu {
  margin-left: 230px !important;
}

.content-wrapper {
  padding: 0.8rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

/* Header Section */
.header-section {
  animation: fadeInDown 0.6s ease-out;
  margin-bottom: 1.5rem;
  flex-shrink: 0;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #4285f4 0%, #34a853 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  display: flex;
  align-items: center;
}

.custom-breadcrumb {
  background: transparent;
  padding: 0;
  font-size: 0.9rem;
}

.custom-breadcrumb .breadcrumb-item {
  color: var(--text-muted, #6c757d);
}

.custom-breadcrumb .breadcrumb-item.active {
  color: var(--text-primary, #333);
  font-weight: 500;
}

.connection-indicator {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  position: relative;
}

.status-dot::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.connected .status-dot {
  background: #34a853;
}

.connected .status-dot::before {
  background: #34a853;
}

.disconnected .status-dot {
  background: #ea4335;
}

.disconnected .status-dot::before {
  background: #ea4335;
}

.not-installed .status-dot {
  background: #fbbc04;
}

.not-installed .status-dot::before {
  background: #fbbc04;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.status-info {
  display: flex;
  flex-direction: column;
}

.status-label {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.status-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
}

.btn-connection-config {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid var(--card-border, rgba(0, 0, 0, 0.1));
  border-radius: 8px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-connection-config:hover {
  background: var(--card-header, rgba(0, 0, 0, 0.05));
  color: #4285f4;
  transform: rotate(90deg);
}

/* Connection Banner */
.connection-banner {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: linear-gradient(135deg, rgba(66, 133, 244, 0.1) 0%, rgba(52, 168, 83, 0.1) 100%);
  border: 1px solid rgba(66, 133, 244, 0.3);
  border-radius: 12px;
  padding: 1rem 1.5rem;
  margin-top: 1rem;
}

.connection-banner.error-banner {
  background: linear-gradient(135deg, rgba(251, 188, 4, 0.1) 0%, rgba(234, 67, 53, 0.1) 100%);
  border-color: rgba(251, 188, 4, 0.3);
}

.banner-icon {
  font-size: 2rem;
  color: #4285f4;
  flex-shrink: 0;
}

.error-banner .banner-icon {
  color: #fbbc04;
}

.banner-content {
  flex: 1;
}

.banner-content strong {
  display: block;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.banner-content p {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.btn-modern {
  padding: 0.65rem 1.25rem;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #4285f4 0%, #34a853 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(66, 133, 244, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(66, 133, 244, 0.4);
}

.btn-danger {
  background: linear-gradient(135deg, #ea4335 0%, #c5221f 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(234, 67, 53, 0.3);
}

.btn-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(234, 67, 53, 0.4);
}

/* Workspace Layout */
.workspace-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 1.5rem;
  flex: 1;
  min-height: 0;
  animation: fadeInUp 0.6s ease-out;
  transition: all 0.3s ease;
}

/* Workspaces Sidebar */
.workspaces-sidebar {
  background: var(--card-element-bg);
  border-radius: 16px;
  border: 1px solid var(--card-border, rgba(0, 0, 0, 0.1));
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s ease;
}

.workspaces-sidebar.hidden {
  display: none;
}

.sidebar-header {
  padding: 1.25rem;
  border-bottom: 1px solid var(--card-border, rgba(0, 0, 0, 0.1));
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, rgba(66, 133, 244, 0.05) 0%, rgba(52, 168, 83, 0.05) 100%);
}

.sidebar-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  display: flex;
  align-items: center;
}

.sidebar-header-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-toggle-sidebar {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-toggle-sidebar:hover {
  background: var(--card-header, rgba(0, 0, 0, 0.05));
  color: #4285f4;
}

.btn-show-sidebar {
  position: absolute;
  left: 20px;
  top: 50%; /* Ajuste conforme necessário dependendo do layout */
  transform: translateY(-50%);
  z-index: 10;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--card-element-bg);
  border: 1px solid var(--card-border, rgba(0, 0, 0, 0.1));
  border-radius: 0 8px 8px 0;
  box-shadow: 2px 0 8px rgba(0,0,0,0.1);
  color: var(--text-muted);
  cursor: pointer;
}

/* Ajuste específico para quando o botão 'show' está dentro do layout grid */
.workspace-layout .btn-show-sidebar {
  position: static;
  margin-right: -10px; /* Hack visual se necessário */
  align-self: flex-start;
  margin-top: 1.25rem;
}

.btn-add-workspace {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4285f4 0%, #34a853 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-add-workspace:hover:not(:disabled) {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(66, 133, 244, 0.3);
}

.btn-add-workspace:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.workspaces-list {
  flex: 1;
  overflow-y: auto;
  padding: 0.75rem;
}

.workspace-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 0.5rem;
  position: relative;
}

.workspace-item:hover {
  background: var(--card-header, rgba(0, 0, 0, 0.05));
}

.workspace-item.active {
  background: linear-gradient(135deg, rgba(66, 133, 244, 0.1) 0%, rgba(52, 168, 83, 0.1) 100%);
  border: 1px solid rgba(66, 133, 244, 0.3);
}

.workspace-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 70%;
  background: linear-gradient(135deg, #4285f4 0%, #34a853 100%);
  border-radius: 0 3px 3px 0;
}

.workspace-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  flex-shrink: 0;
  color: white;
  font-size: 1.25rem;
}

.workspace-info {
  flex: 1;
  min-width: 0;
}

.workspace-name {
  display: block;
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.workspace-messages {
  display: block;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.workspace-actions {
  display: none;
  gap: 0.25rem;
}

.workspace-item:hover .workspace-actions {
  display: flex;
}

.btn-workspace-action {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-workspace-action:hover {
  background: var(--card-border, rgba(0, 0, 0, 0.1));
  color: #4285f4;
}

/* Empty Workspaces */
.empty-workspaces {
  text-align: center;
  padding: 3rem 1rem;
}

.empty-icon {
  font-size: 4rem;
  color: var(--text-muted);
  opacity: 0.3;
  margin-bottom: 1rem;
}

.empty-text {
  color: var(--text-muted);
  margin-bottom: 1.5rem;
}

.btn-create-first {
  padding: 0.65rem 1.25rem;
  background: linear-gradient(135deg, #4285f4 0%, #34a853 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-create-first:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 133, 244, 0.3);
}

.btn-create-first:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Chat Area */
.chat-area {
  background: var(--card-element-bg);
  border-radius: 16px;
  border: 1px solid var(--card-border, rgba(0, 0, 0, 0.1));
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s ease;
}

/* Expande a área de chat quando a sidebar está oculta */
.chat-area.expanded {
  grid-column: 1 / -1;
}

/* Workspace Header */
.workspace-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--card-border, rgba(0, 0, 0, 0.1));
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, rgba(66, 133, 244, 0.05) 0%, rgba(52, 168, 83, 0.05) 100%);
}

.workspace-header-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  min-width: 0;
}

.workspace-header-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  color: white;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.workspace-header-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.workspace-header-description {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.workspace-header-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-header-action {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid var(--card-border, rgba(0, 0, 0, 0.1));
  border-radius: 8px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-header-action:hover {
  background: var(--card-header, rgba(0, 0, 0, 0.05));
  color: #4285f4;
}

/* Messages Container */
.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  max-height: calc(100vh - 400px);
  min-height: 400px;
}

/* Welcome State */
.welcome-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: 2rem;
}

.welcome-icon {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4285f4 0%, #34a853 100%);
  border-radius: 50%;
  margin-bottom: 2rem;
}

.welcome-icon i {
  font-size: 3rem;
  color: white;
}

.welcome-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
}

.welcome-text {
  font-size: 1rem;
  color: var(--text-muted);
  margin-bottom: 2rem;
  max-width: 500px;
}

.welcome-features {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.feature-item i {
  font-size: 2rem;
  color: #4285f4;
}

.feature-item span {
  font-size: 0.9rem;
  color: var(--text-muted);
}

/* Messages List */
.messages-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.message {
  display: flex;
  gap: 0.75rem;
  animation: messageSlideIn 0.3s ease-out;
}

@keyframes messageSlideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message.user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  flex-shrink: 0;
  font-size: 1.25rem;
}

.message.user .message-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.message.assistant .message-avatar {
  background: linear-gradient(135deg, #4285f4 0%, #34a853 100%);
  color: white;
}

.message-content {
  flex: 1;
}

.message.user .message-content {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.message-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.message.user .message-header {
  flex-direction: row-reverse;
}

.message-author {
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--text-primary);
}

.message-time {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.message-text {
  padding: 0.875rem 1.125rem;
  border-radius: 12px;
  line-height: 1.6;
  font-size: 0.95rem;
}

.message.user .message-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px 12px 4px 12px;
}

.message.assistant .message-text {
  background: var(--card-header, rgba(0, 0, 0, 0.05));
  color: var(--text-primary);
  border-radius: 12px 12px 12px 4px;
}

.message-actions {
  display: flex;
  gap: 0.25rem;
  margin-top: 0.5rem;
}

.btn-message-action {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid var(--card-border, rgba(0, 0, 0, 0.1));
  border-radius: 6px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-message-action:hover {
  background: var(--card-header, rgba(0, 0, 0, 0.05));
  color: #4285f4;
}

/* Typing Indicator */
.typing-indicator {
  display: flex;
  gap: 0.35rem;
  padding: 0.875rem 1.125rem;
  background: var(--card-header, rgba(0, 0, 0, 0.05));
  border-radius: 12px 12px 12px 4px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: var(--text-muted);
  border-radius: 50%;
  animation: typingBounce 1.4s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typingBounce {
  0%,
  60%,
  100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10px);
  }
}

/* Empty Chat State */
.empty-chat {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: 2rem;
}

.empty-chat-icon {
  font-size: 4rem;
  color: var(--text-muted);
  opacity: 0.3;
  margin-bottom: 1rem;
}

.empty-chat h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.empty-chat p {
  color: var(--text-muted);
  margin-bottom: 2rem;
}

.suggested-prompts {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  max-width: 600px;
}

.prompt-suggestion {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--card-header, rgba(0, 0, 0, 0.05));
  border: 1px solid var(--card-border, rgba(0, 0, 0, 0.1));
  border-radius: 10px;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.prompt-suggestion:hover {
  background: linear-gradient(135deg, rgba(66, 133, 244, 0.1) 0%, rgba(52, 168, 83, 0.1) 100%);
  border-color: #4285f4;
  transform: translateY(-2px);
}

.prompt-suggestion i {
  font-size: 1.5rem;
  color: #4285f4;
}

.prompt-suggestion span {
  font-size: 0.9rem;
  font-weight: 500;
}

/* Input Area */
.input-area {
  padding: 1.25rem 1.5rem;
  border-top: 1px solid var(--card-border, rgba(0, 0, 0, 0.1));
  background: var(--card-bg);
}

.input-container {
  display: flex;
  align-items: flex-end;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: var(--form-bg);
  border: 2px solid var(--card-border, rgba(0, 0, 0, 0.1));
  border-radius: 12px;
  transition: all 0.3s ease;
}

.input-container:focus-within {
  border-color: #4285f4;
  box-shadow: 0 0 0 4px rgba(66, 133, 244, 0.1);
}

.btn-input-tool {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.btn-input-tool:hover {
  background: var(--card-header, rgba(0, 0, 0, 0.05));
  color: #4285f4;
}

.message-input {
  flex: 1;
  border: none;
  background: transparent;
  color: var(--text-primary);
  font-size: 0.95rem;
  resize: none;
  outline: none;
  max-height: 200px;
  font-family: inherit;
  line-height: 1.5;
}

.message-input::placeholder {
  color: var(--text-muted);
}

.btn-send {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4285f4 0%, #34a853 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.btn-send:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(66, 133, 244, 0.3);
}

.btn-send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.input-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.75rem;
}

.input-hint {
  font-size: 0.75rem;
  color: var(--text-muted);
  display: flex;
  align-items: center;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Scrollbar Customization */
.workspaces-list::-webkit-scrollbar,
.messages-container::-webkit-scrollbar {
  width: 6px;
}

.workspaces-list::-webkit-scrollbar-track,
.messages-container::-webkit-scrollbar-track {
  background: transparent;
}

.workspaces-list::-webkit-scrollbar-thumb,
.messages-container::-webkit-scrollbar-thumb {
  background: var(--card-border, rgba(0, 0, 0, 0.2));
  border-radius: 10px;
}

.workspaces-list::-webkit-scrollbar-thumb:hover,
.messages-container::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}

/* Responsividade */
@media (max-width: 1200px) {
  .workspace-layout {
    grid-template-columns: 280px 1fr;
  }
}

@media (max-width: 992px) {
  .workspace-layout {
    grid-template-columns: 1fr;
  }

  .workspaces-sidebar {
    max-height: 300px;
    /* Em mobile, não usamos a classe hidden da mesma forma, 
       mas se usar, o comportamento de display:none funciona */
  }

  .suggested-prompts {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 1rem;
    height: calc(100vh - 2rem);
  }

  .page-title {
    font-size: 1.5rem;
  }

  .connection-banner {
    flex-direction: column;
    text-align: center;
  }

  .workspace-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .workspace-header-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .message-content {
    max-width: 90%;
  }
}

@media (max-width: 480px) {
  .workspace-header-icon {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
  }

  .welcome-icon {
    width: 80px;
    height: 80px;
  }

  .welcome-icon i {
    font-size: 2.5rem;
  }

  .welcome-title {
    font-size: 1.5rem;
  }

  .feature-item {
    flex: 1 1 100%;
  }
}

/* Dark Mode Adjustments */
.dark-theme .workspace-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.dark-theme .btn-workspace-action:hover {
  background: rgba(255, 255, 255, 0.1);
}

.dark-theme .btn-header-action:hover {
  background: rgba(255, 255, 255, 0.05);
}

.dark-theme .message.assistant .message-text {
  background: rgba(255, 255, 255, 0.05);
}

.dark-theme .btn-message-action:hover {
  background: rgba(255, 255, 255, 0.05);
}

.dark-theme .prompt-suggestion {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

.dark-theme .prompt-suggestion:hover {
  background: linear-gradient(135deg, rgba(66, 133, 244, 0.2) 0%, rgba(52, 168, 83, 0.2) 100%);
}

.dark-theme .input-container {
  border-color: rgba(255, 255, 255, 0.1);
}

.dark-theme .btn-input-tool:hover {
  background: rgba(255, 255, 255, 0.05);
}
</style>