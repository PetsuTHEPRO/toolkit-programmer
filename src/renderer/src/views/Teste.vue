<template>
  <div class="container mt-4 settings-container">
    <h2 class="mb-4"><i class="bi bi-gear-fill"></i> Configurações</h2>

    <div class="row">
      <!-- Menu lateral -->
      <div class="col-md-3">
        <div class="list-group">
          <a
            href="#"
            class="list-group-item list-group-item-action active"
            @click.prevent="activeTab = 'personal'"
          >
            <i class="bi bi-person"></i> Área Pessoal
          </a>
          <a
            href="#"
            class="list-group-item list-group-item-action"
            @click.prevent="activeTab = 'backup'"
          >
            <i class="bi bi-cloud-arrow-up"></i> Backup
          </a>
          <a
            href="#"
            class="list-group-item list-group-item-action"
            @click.prevent="activeTab = 'app'"
          >
            <i class="bi bi-phone"></i> Aplicativo
          </a>
        </div>
      </div>

      <!-- Conteúdo -->
      <div class="col-md-9">
        <!-- Área Pessoal -->
        <div v-if="activeTab === 'personal'" class="settings-section">
          <h3 class="mb-4"><i class="bi bi-person"></i> Área Pessoal</h3>

          <div class="card mb-4">
            <div class="card-header">Configurações de Conta</div>
            <div class="card-body">
              <div class="mb-3">
                <label for="userName" class="form-label">Nome</label>
                <input type="text" class="form-control" id="userName" v-model="user.name" />
              </div>

              <button class="btn btn-primary" @click="changePassword">
                <i class="bi bi-key"></i> Mudar Senha
              </button>

              <!-- Modal para mudança de senha -->
              <div class="modal fade" id="passwordModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title">Mudar Senha</h5>
                      <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div class="modal-body">
                      <div class="mb-3">
                        <label for="currentPassword" class="form-label">Senha Atual</label>
                        <input
                          type="password"
                          class="form-control"
                          id="currentPassword"
                          v-model="password.current"
                        />
                      </div>
                      <div class="mb-3">
                        <label for="newPassword" class="form-label">Nova Senha</label>
                        <input
                          type="password"
                          class="form-control"
                          id="newPassword"
                          v-model="password.new"
                        />
                      </div>
                      <div class="mb-3">
                        <label for="confirmPassword" class="form-label">Confirmar Nova Senha</label>
                        <input
                          type="password"
                          class="form-control"
                          id="confirmPassword"
                          v-model="password.confirm"
                        />
                      </div>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        Cancelar
                      </button>
                      <button type="button" class="btn btn-primary" @click="savePassword">
                        Salvar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="card border-danger">
            <div class="card-header bg-danger text-white">Zona de Perigo</div>
            <div class="card-body">
              <p class="text-danger">
                Esta ação não pode ser desfeita. Todos os seus dados serão permanentemente apagados.
              </p>
              <button class="btn btn-danger" @click="confirmDelete">
                <i class="bi bi-trash"></i> Apagar Todos os Dados
              </button>

              <!-- Modal de confirmação -->
              <div class="modal fade" id="deleteModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header bg-danger text-white">
                      <h5 class="modal-title">Confirmar Exclusão</h5>
                      <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div class="modal-body">
                      <p>
                        Tem certeza que deseja apagar todos os seus dados? Esta ação não pode ser
                        desfeita.
                      </p>
                      <div class="form-check mb-3">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          id="confirmDelete"
                          v-model="deleteConfirmed"
                        />
                        <label class="form-check-label" for="confirmDelete">
                          Sim, eu entendo e quero apagar todos os meus dados.
                        </label>
                      </div>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        Cancelar
                      </button>
                      <button
                        type="button"
                        class="btn btn-danger"
                        :disabled="!deleteConfirmed"
                        @click="deleteAllData"
                      >
                        Apagar Tudo
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Configurações de Backup -->
        <div v-if="activeTab === 'backup'" class="settings-section">
          <h3 class="mb-4"><i class="bi bi-cloud-arrow-up"></i> Configurações de Backup</h3>

          <div class="card mb-4">
            <div class="card-header">Exportar Backup</div>
            <div class="card-body">
              <p class="card-text">Exporte todos os seus dados para um arquivo de backup.</p>
              <div class="mb-3">
                <label for="backupLocation" class="form-label">Local para salvar</label>
                <input
                  type="text"
                  class="form-control"
                  id="backupLocation"
                  v-model="backup.exportPath"
                  readonly
                />
              </div>
              <button class="btn btn-primary me-2" @click="selectExportLocation">
                <i class="bi bi-folder"></i> Escolher Local
              </button>
              <button class="btn btn-success" :disabled="!backup.exportPath" @click="exportBackup">
                <i class="bi bi-download"></i> Exportar Backup
              </button>
            </div>
          </div>

          <div class="card">
            <div class="card-header">Importar Backup</div>
            <div class="card-body">
              <p class="card-text">Importe dados de um arquivo de backup anterior.</p>
              <div class="mb-3">
                <label for="importLocation" class="form-label">Arquivo de backup</label>
                <input
                  type="text"
                  class="form-control"
                  id="importLocation"
                  v-model="backup.importPath"
                  readonly
                />
              </div>
              <button class="btn btn-primary me-2" @click="selectImportFile">
                <i class="bi bi-file-earmark-arrow-up"></i> Selecionar Arquivo
              </button>
              <button class="btn btn-warning" :disabled="!backup.importPath" @click="importBackup">
                <i class="bi bi-upload"></i> Importar Backup
              </button>
            </div>
          </div>
        </div>

        <!-- Configurações do Aplicativo -->
        <div v-if="activeTab === 'app'" class="settings-section">
          <h3 class="mb-4"><i class="bi bi-phone"></i> Configurações do Aplicativo</h3>

          <div class="card mb-4">
            <div class="card-header">Idioma</div>
            <div class="card-body">
              <select class="form-select" v-model="appSettings.language">
                <option value="pt">Português</option>
                <option value="en">Inglês</option>
                <option value="es">Espanhol</option>
              </select>
            </div>
          </div>

          <!-- Dentro da div v-if="activeTab === 'app'", após as configurações de tema -->
          <div class="card mt-4">
            <div class="card-header">Configurações de IA</div>
            <div class="card-body">
              <div class="mb-3">
                <label for="aiSelection" class="form-label">Modelo de IA preferido</label>
                <select class="form-select" id="aiSelection" v-model="appSettings.preferredAI">
                  <option value="deepseek">DeepSeek</option>
                  <option value="gpt">ChatGPT</option>
                  <option value="gemini">Gemini</option>
                  <option value="llama">Llama</option>
                  <option value="moonshot">Moonshot</option>
                </select>
              </div>

              <!-- Aviso para ChatGPT -->
              <div v-if="appSettings.preferredAI === 'gpt'" class="alert alert-warning mt-3">
                <i class="bi bi-exclamation-triangle-fill"></i> Atenção: O uso do ChatGPT requer
                assinatura paga da API da OpenAI.
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">Tema</div>
            <div class="card-body">
              <div class="form-check form-switch">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="themeSwitch"
                  v-model="appSettings.darkMode"
                />
                <label class="form-check-label" for="themeSwitch">
                  {{ appSettings.darkMode ? 'Tema Escuro' : 'Tema Claro' }}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap'

export default {
  name: 'SettingsView',
  data() {
    return {
      activeTab: 'personal',
      user: {
        name: 'João Silva',
        email: 'joao@exemplo.com'
      },
      password: {
        current: '',
        new: '',
        confirm: ''
      },
      deleteConfirmed: false,
      backup: {
        exportPath: '',
        importPath: ''
      },
      appSettings: {
        language: 'pt',
        darkMode: false,
        preferredAI: 'llama' // Valor padrão
      }
    }
  },
  methods: {
    changePassword() {
      this.password = { current: '', new: '', confirm: '' }
      const modal = new Modal(document.getElementById('passwordModal'))
      modal.show()
    },
    savePassword() {
      // Validação da senha
      if (this.password.new !== this.password.confirm) {
        alert('As senhas não coincidem!')
        return
      }

      // Lógica para salvar a senha
      console.log('Senha alterada:', this.password)

      // Fechar modal
      const modal = Modal.getInstance(document.getElementById('passwordModal'))
      modal.hide()
    },
    confirmDelete() {
      this.deleteConfirmed = false
      const modal = new Modal(document.getElementById('deleteModal'))
      modal.show()
    },
    deleteAllData() {
      // Lógica para apagar dados
      console.log('Todos os dados foram apagados')

      // Fechar modal
      const modal = Modal.getInstance(document.getElementById('deleteModal'))
      modal.hide()
    },
    selectExportLocation() {
      // Lógica para selecionar local de exportação
      // Em um app real, isso usaria APIs específicas da plataforma
      this.backup.exportPath =
        'C:/backups/meu_backup_' + new Date().toISOString().slice(0, 10) + '.bak'
    },
    exportBackup() {
      // Lógica para exportar backup
      console.log('Backup exportado para:', this.backup.exportPath)
    },
    selectImportFile() {
      // Lógica para selecionar arquivo de importação
      this.backup.importPath = 'C:/backups/meu_backup_2023-01-01.bak'
    },
    importBackup() {
      // Lógica para importar backup
      console.log('Backup importado de:', this.backup.importPath)
    }
  },
  watch: {
    'appSettings.darkMode'(newVal) {
      // Aplicar tema
      if (newVal) {
        document.body.classList.add('dark-theme')
      } else {
        document.body.classList.remove('dark-theme')
      }
    },
    'appSettings.language'(newVal) {
      // Mudar idioma
      console.log('Idioma alterado para:', newVal)
    }
  }
}
</script>

<style scoped>
.settings-container {
  max-width: 1200px;
}

.settings-section {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.list-group-item.active {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.dark-theme {
  background-color: #1a1a1a;
  color: #f8f9fa;
}

.dark-theme .card {
  background-color: #2d2d2d;
  border-color: #444;
  color: #f8f9fa;
}

.dark-theme .card-header {
  background-color: #333;
  border-bottom-color: #444;
  color: #f8f9fa;
}

.dark-theme .list-group-item {
  background-color: #2d2d2d;
  color: #f8f9fa;
  border-color: #444;
}

.dark-theme .form-control,
.dark-theme .form-select {
  background-color: #333;
  color: #f8f9fa;
  border-color: #444;
}

.dark-theme .modal-content {
  background-color: #2d2d2d;
  color: #f8f9fa;
}

.dark-theme .modal-header {
  border-bottom-color: #444;
  color: #f8f9fa;
}

.dark-theme .modal-footer {
  border-top-color: #444;
  color: #f8f9fa;
}

/* Adicione ao seu CSS existente */
.alert-warning {
  background-color: rgba(255, 193, 7, 0.1);
  border-left: 4px solid #ffc107;
}
/* Adicione ao seu CSS existente dentro do .dark-theme */
.dark-theme .alert-warning {
  background-color: rgba(255, 193, 7, 0.15);
  border-left: 4px solid #ffc107;
  color: #ffd700; /* Texto mais claro para melhor contraste */
}

.dark-theme .alert-warning .bi-exclamation-triangle-fill {
  color: #ffc107; /* Mantém a cor do ícone consistente */
}
</style>
