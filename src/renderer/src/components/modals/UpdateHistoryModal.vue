<template>
  <div>
    <!-- Modal -->
    <div
      v-if="visible"
      class="modal fade show d-block"
      tabindex="-1"
      aria-labelledby="updateHistoryTitle"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content bg-dark text-white">
          <div class="modal-header border-secondary">
            <h5 id="updateHistoryTitle" class="modal-title">
              <i class="fas fa-history me-2"></i>Histórico de Atualizações
            </h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              aria-label="Close"
              @click="closeModal"
            ></button>
          </div>
          <div class="modal-body" style="max-height: 60vh; overflow-y: auto">
            <div v-for="(log, index) in logs" :key="index" class="mb-4">
              <div class="d-flex align-items-center mb-3">
                <h5 class="text-primary mb-0">{{ log.version }}</h5>
                <span class="badge bg-dark text-light ms-2 border border-secondary">{{
                  log.date
                }}</span>
              </div>
              <ul class="list-unstyled ps-3">
                <li
                  v-for="(item, itemIndex) in log.items"
                  :key="itemIndex"
                  class="mb-2 ps-2 d-flex align-items-start"
                >
                  <i
                    :class="getItemIcon(item)"
                    class="me-2 mt-1"
                    :style="{ color: getItemColor(item) }"
                  ></i>
                  <div>
                    <span :class="getBadgeClass(item)" class="me-2">{{ getPrefix(item) }}</span>
                    <span>{{ removePrefix(item) }}</span>
                  </div>
                </li>
              </ul>
              <hr v-if="index < logs.length - 1" class="bg-secondary mt-4" />
            </div>
          </div>
          <div class="modal-footer border-secondary">
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                id="dontShowAgain"
                v-model="dontShowAgain"
              />
              <label class="form-check-label" for="dontShowAgain"> Não mostrar novamente </label>
            </div>
            <button type="button" class="btn btn-primary" @click="closeModal">
              <i class="fas fa-times me-1"></i> Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="visible" class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      dontShowAgain: false,
      currentLogId: 'log-24-04-25/12:23',
      logs: [
      {
          version: 'Versão 1.2.3 - Melhoria de IA',
          date: '25/04/2025',
          items: [
            'Novo: Adicionado mais modos de IA para o sistema',
            'Melhoria: Melhoria do input do chat da IA'
          ]
        },
        {
          version: 'Versão 1.2.2 - Correções e Melhorias',
          date: '19/04/2025',
          items: [
            'Novo: Adicionado um icone minimalista ao sistema',
            'Correção: Problemas de exibição de vídeo corrigidos',
            'Correção: Erro de pasta logs corrigido',
            'Correção: Tema dark/light do artigo preview corrigido',
            'Correção: Corrigido mais inconsistência de idioma no sistema',
            'Melhoria: Adicionando opções de excluir/editar código'
          ]
        },
        {
          version: 'Versão 1.2.1 - Correções e Melhorias',
          date: '16/04/2025',
          items: [
            'Novo: Sistema completo de edição e exclusão para vídeos e artigos',
            'Correção: Resolvido problema de páginação das fontes',
            'Correção: Inconsistências refinadas entre os temas dark e light',
            'Correção: Ajustes de linguagem e localização em todo o sistema',
            'Correção: Problemas de renderização e exibição de fontes corrigidos',
            'Melhoria: Validação reforçada nos formulários de edição'
          ]
        },
        {
          version: 'Versão 1.2.0 - Melhorias de Estabilidade',
          date: '15/04/2025',
          items: [
            'Novo: Sistema de Histórico de Atualizações integrado',
            'Correção: Problemas de localização e idioma do sistema',
            'Correção: Inconsistências nos temas escuro e claro',
            'Correção: Problemas de compatibilidade com modelos de IA',
            'Melhoria: Performance geral do sistema otimizada'
          ]
        },
        {
          version: 'Versão 1.1.0 - Expansão de Funcionalidades',
          date: '10/04/2025',
          items: [
            'Novo: Assistente de ChatBot integrado para auxílio ao usuário',
            'Novo: Suporte a múltiplos modelos de IA (Deepseek, Gemini, NVIDIA LLaMA, Meta LLaMA)',
            'Novo: Painel de Configurações completo',
            'Novo: Sistema de gerenciamento de sessão com logout seguro',
            'Novo: Ferramentas de backup e restauração de dados',
            'Melhoria: Segurança reforçada em todas as comunicações'
          ]
        },
        {
          version: 'Versão 1.0.0 - Lançamento Inicial',
          date: '01/04/2025',
          items: [
            'Novo: Lançamento oficial do sistema',
            'Novo: Implementação do painel de controle principal (Dashboard)',
            'Novo: Sistema de temas personalizáveis (claro/escuro)',
            'Novo: Biblioteca de fontes e componentes visuais',
            'Novo: Arquitetura básica do sistema estabelecida'
          ]
        }
      ]
    }
  },
  methods: {
    closeModal() {
      if (this.dontShowAgain) {
        localStorage.setItem('hideUpdateHistory', 'true')
      }
      this.incrementShowCount()
      this.visible = false
    },
    getPrefix(item) {
      if (item.startsWith('Novo:')) return 'Novo'
      if (item.startsWith('Correção:')) return 'Correção'
      if (item.startsWith('Melhoria:')) return 'Melhoria'
      return ''
    },
    getBadgeClass(item) {
      if (item.startsWith('Novo:')) return 'badge bg-success bg-opacity-25 text-success'
      if (item.startsWith('Correção:')) return 'badge bg-danger bg-opacity-25 text-danger'
      if (item.startsWith('Melhoria:')) return 'badge bg-info bg-opacity-25 text-info'
      return ''
    },
    getItemIcon(item) {
      if (item.startsWith('Novo:')) return 'bx bx-plus-circle'
      if (item.startsWith('Correção:')) return 'bx bx-bug'
      if (item.startsWith('Melhoria:')) return 'bx bx-rocket'
      return 'bx bx-circle'
    },
    getItemColor(item) {
      if (item.startsWith('Novo:')) return '#28a745'
      if (item.startsWith('Correção:')) return '#dc3545'
      if (item.startsWith('Melhoria:')) return '#17a2b8'
      return '#6c757d'
    },
    removePrefix(item) {
      return item.replace(/^(Novo|Correção|Melhoria):\s*/, '')
    },
    getLogDisplaySettings() {
      const settings = localStorage.getItem('logDisplaySettings')
      return settings
        ? JSON.parse(settings)
        : {
            showCount: 0,
            lastLogId: ''
          }
    },
    saveLogDisplaySettings(settings) {
      localStorage.setItem('logDisplaySettings', JSON.stringify(settings))
    },
    checkShouldShow() {
      // Se usuário optou por não ver, ignora
      if (localStorage.getItem('hideUpdateHistory') === 'true') return false

      const settings = JSON.parse(localStorage.getItem('logDisplaySettings') || '{}')

      // Se é uma nova versão OU primeira execução
      if (settings.lastLogId !== this.currentLogId) {
        this.resetCounter()
        return true
      }

      // Mostra apenas se ainda não atingiu 4 vezes
      return settings.showCount < 4
    },
    resetCounter() {
      const settings = {
        showCount: 0,
        lastLogId: this.currentLogId
      }
      localStorage.setItem('logDisplaySettings', JSON.stringify(settings))
    },
    incrementShowCount() {
      const settings = this.getLogDisplaySettings()
      settings.showCount += 1
      this.saveLogDisplaySettings(settings)
    }
  },
  mounted() {
    if (this.checkShouldShow()) {
      this.visible = true
    }
  }
}
</script>

<style scoped>
.modal-content {
  background-color: #1a1a2e;
  border: 1px solid #444;
}

.modal-header,
.modal-footer {
  border-color: #444 !important;
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

.text-primary {
  color: #6ea8fe !important;
}

hr {
  opacity: 0.2;
}

.form-check-input:checked {
  background-color: #6ea8fe;
  border-color: #6ea8fe;
}

/* Estilização da barra de scroll */
.modal-body::-webkit-scrollbar {
  width: 8px;
}

.modal-body::-webkit-scrollbar-track {
  background: #2d2d2d;
  border-radius: 10px;
}

.modal-body::-webkit-scrollbar-thumb {
  background: #6ea8fe;
  border-radius: 10px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: #5d8ddb;
}

/* Estilos para os badges */
.badge {
  padding: 0.35em 0.65em;
  font-weight: 500;
  border-radius: 0.25rem;
  display: inline-flex;
  align-items: center;
}

/* Ícones */
.fa-plus-circle {
  color: #17a2b8;
}

.fa-bug {
  color: #dc3545;
}

.fa-rocket {
  color: #28a745;
}

.btn-close-white {
  filter: invert(1) grayscale(100%) brightness(200%);
}
.badge {
  padding: 0.25em 0.6em;
  font-size: 0.75em;
  font-weight: 600;
  border-radius: 0.25rem;
  display: inline-block;
  line-height: 1.5;
}

li {
  line-height: 1.6;
}
</style>
