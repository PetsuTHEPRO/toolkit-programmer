import notification from '../service/notificationService'

class BackupController {

  static async createDefaultBackup() {
    try {
      const backupPath = await window.api.getDefaultBackupPath()
      console.log(backupPath + 'backupPathDefault')
      await window.api.createBackup(backupPath)
      notification.success('Backup criado com sucesso!')
      return true
    } catch (error) {
      notification.error('Falha ao criar backup: ' + error.message)
      return false
    }
  }

  /**
   * Cria um backup em um caminho específico
   * @param {string} backupPath Caminho completo do arquivo de backup
   * @returns {Promise<boolean>} True se o backup foi criado com sucesso
   */
  static async createCustomBackup(backupPath) {
    try {
      const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '')
      const timeStr = new Date().toTimeString().split(' ')[0].replace(/:/g, '')
      backupPath += `/backup_${dateStr}_${timeStr}.bin`
      await window.api.createBackup(backupPath)
      notification.success('Backup exportado com sucesso!')
      return true
    } catch (error) {
      notification.error('Falha ao criar backup: ' + error.message)
      return false
    }
  }

  /**
   * Restaura um backup de um arquivo específico
   * @param {string} backupPath Caminho completo do arquivo de backup
   * @returns {Promise<boolean>} True se a restauração foi bem sucedida
   */
  static async restoreBackup(backupPath) {
    try {
      const result = await window.api.restoreBackup(backupPath)
      if (result.success) {
        notification.success('Backup restaurado com sucesso!')
        return true
      } else {
        notification.error('Falha ao restaurar backup: ' + result.error)
        return false
      }
    } catch (error) {
      notification.error('Erro durante a restauração: ' + error.message)
      return false
    }
  }

  /**
   * Obtém o caminho padrão para backups (apenas para exibição)
   * @returns {Promise<string>} Caminho padrão para backups
   */
  static async getDefaultBackupLocation() {
    try {
      return await window.api.getDefaultBackupPath()
    } catch (error) {
      console.error('Error getting default backup location:', error)
      return 'Não disponível'
    }
  }
}

export default BackupController
