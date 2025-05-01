<template>
  <!-- Configurações de Backup -->
  <div v-if="activeTab === 'backup'" class="settings-section">
    <h3 class="mb-4 title"><i class="bx bx-cloud-upload me-2"></i> {{ $t('pages.settings.backup.title') }}</h3>

    <div class="card mb-4">
      <div class="card-header">{{ $t('pages.settings.backup.export-header') }}</div>
      <div class="card-body">
        <p class="card-text">{{ $t('pages.settings.backup.export-description') }}</p>
        <div class="mb-3">
          <label for="backupLocation" class="form-label">{{ $t('pages.settings.backup.export-label') }}</label>
          <input
            type="text"
            class="form-control"
            id="backupLocation"
            v-model="backup.exportPath"
            readonly
          />
        </div>
        <button class="btn btn-primary me-2" @click="selectExportLocation">
          <i class="bi bi-folder me-2"></i> Escolher Local
        </button>
        <button class="btn btn-success" :disabled="!backup.exportPath" @click="exportBackup">
          <i class="bi bi-download me-2"></i> Exportar Backup
        </button>
      </div>
    </div>

    <div class="card">
      <div class="card-header">{{ $t('pages.settings.backup.import-header') }}</div>
      <div class="card-body">
        <p class="card-text">{{ $t('pages.settings.backup.import-description') }}</p>
        <div class="mb-3">
          <label for="importLocation" class="form-label">{{ $t('pages.settings.backup.import-label') }}</label>
          <input
            type="text"
            class="form-control"
            id="importLocation"
            v-model="backup.importPath"
            readonly
          />
        </div>
        <!-- Substitua o input type="file" por um botão que aciona a seleção -->
        <button class="btn btn-primary me-2" @click="selectImportFile">
          <i class="bi bi-folder me-2"></i> Escolher Arquivo
        </button>
        <button
          class="btn btn-warning"
          :disabled="!backup.importPath"
          @click="handleBackupRestoration"
        >
          <i class="bi bi-upload me-2"></i> Importar Backup
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import BackupController from '../controller/BackupController'
import Notification from '../service/notificationService'

export default {
  name: 'Backup',
  props: {
    activeTab: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      backup: {
        exportPath: '',
        importPath: ''
      }
    }
  },
  methods: {
    async selectExportLocation() {
      try {
        const path = await window.electron.ipcRenderer.invoke('select-backup-directory')

        if (path) {
          this.backup.exportPath = path
        }
      } catch (error) {
        Notification.error('Erro ao escolher pasta:', error)
      }
    },

    async exportBackup() {
      const exportTo = this.backup.exportPath

      try {
        if (exportTo) {
          await BackupController.createCustomBackup(exportTo)
        } else {
          await BackupController.createDefaultBackup()
          Notification.warning(
            'Backup exportado para o caminho padrão! /home/.config/toolkit-programmer/backup/'
          )
        }
      } catch (error) {
        console.error('Erro ao exportar backup:', error)
        this.showMessage('Erro ao exportar o backup.', 'danger')
      }
    },

    async selectImportFile() {
      // Cria um input file dinamicamente (melhor UX)
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.bin' // Aceita apenas .bin

      input.onchange = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        // Atualiza o caminho (usando file.path no Electron ou file.name no navegador)
        this.backup.importPath = file.path || file.name

        // Se quiser ler o conteúdo do arquivo (opcional):
        // const content = await this.readFileAsText(file);
      }

      input.click() // Abre a janela de seleção
    },

    async handleBackupRestoration() {
      if (!this.backup.importPath) {
        console.error('Nenhum arquivo selecionado!')
        return false
      }

      try {
        const success = await BackupController.restoreBackup(this.backup.importPath)
        if (success) {
          console.log('Backup restaurado com sucesso!')
          // Adicione feedback visual (ex: toast de sucesso)
        }
        return success
      } catch (error) {
        console.error('Erro ao restaurar backup:', error.message)
        return false
      }
    }
  }
}
</script>
<style scope>
@import url('../assets/base.css');

h3.title {
  color: var(--text-color);
}

.card-header {
  background-color: var(--card-header);
  border-bottom-color: var(--card-border);
  color: var(--card-header-color);
}

.form-control,
.form-select {
  background-color: var(--card-element-bg);
  color: var(--card-element-text);
  border-color: var(--card-border);
}

</style>