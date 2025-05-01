import fs from 'fs'
import { ipcMain } from 'electron'
import { encode, decode } from '@msgpack/msgpack'

export class BackupProcessor {
  constructor(fileManager, txtDir) {
    this.fileManager = fileManager
    this.txtDir = txtDir
    this.dataTypes = [
      'fonts',
      'frameworks',
      'apis',
      'algorithms',
      'videos',
      'palettes',
      'links',
      'articles',
      'images',
      'icons'
    ]
  }

  /**
   * Carrega todos os recursos como um objeto JSON
   * @returns {Promise<Object>} Objeto contendo todos os dados
   */
  async loadAllResources() {
    const result = {}

    for (const type of this.dataTypes) {
      const methodName = `load${this.capitalizeFirstLetter(type)}`
      if (typeof this.fileManager[methodName] === 'function') {
        result[type] = await this.fileManager[methodName](this.txtDir)
      }
    }

    return result
  }

  /**
   * Carrega um arquivo JSON
   * @param {string} filePath Caminho do arquivo JSON
   * @returns {Promise<Object>} Dados carregados
   */
  async loadJsonFile(filePath) {
    try {
      const data = await fs.promises.readFile(filePath, 'utf8')
      return JSON.parse(data)
    } catch (error) {
      console.error(`Error loading JSON file ${filePath}:`, error)
      throw error
    }
  }

  /**
   * Converte dados para binário e salva em um arquivo
   * @param {Object} data Dados a serem salvos
   * @param {string} outputPath Caminho do arquivo de saída
   * @returns {Promise<void>}
   */
  async saveAsBinary(data, outputPath) {
    try {
      const jsonString = JSON.stringify(data)
      const binaryData = encode(jsonString)
      const buffer = Buffer.from(binaryData, 'utf8')
      await fs.promises.writeFile(outputPath, buffer)
    } catch (error) {
      console.error('Error saving binary file:', error)
      throw error
    }
  }

  /**
   * Lê um arquivo binário e converte de volta para JSON
   * @param {string} filePath Caminho do arquivo binário
   * @returns {Promise<Object>} Dados convertidos
   */
  async readBinaryFile(filePath) {
    try {
      const buffer = await fs.promises.readFile(filePath)
      const originalData = decode(buffer);
      const jsonString = originalData.toString('utf8')
      return JSON.parse(jsonString)
    } catch (error) {
      console.error('Error reading binary file:', error)
      throw error
    }
  }

  /**
   * Restaura dados do backup para o sistema
   * @param {string} backupPath Caminho do arquivo de backup
   * @returns {Promise<void>}
   */
  async restoreFromBackup(backupPath) {
    try {
      const backupData = await this.readBinaryFile(backupPath)

      for (const type of this.dataTypes) {
        if (backupData[type]) {
          const methodName = `save${this.capitalizeFirstLetter(type)}`
          if (typeof this.fileManager[methodName] === 'function') {
            await this.fileManager[methodName](this.txtDir, backupData[type])
          }
        }
      }

      // Salva systemInfo separadamente se existir
      if (backupData.systemInfo) {
        await this.fileManager.saveSystemInfo(this.txtDir, backupData.systemInfo)
      }
    } catch (error) {
      console.error('Error restoring from backup:', error)
      throw error
    }
  }

  /**
   * Cria um backup completo e salva como binário
   * @param {string} outputPath Caminho do arquivo de backup
   * @returns {Promise<void>}
   */
  async createFullBackup(outputPath) {
    try {
      const allData = await this.loadAllResources()
      await this.saveAsBinary(allData, outputPath)
    } catch (error) {
      console.error('Error creating full backup:', error)
      throw error
    }
  }

  /**
   * Utilitário para capitalizar a primeira letra de uma string
   * @param {string} string
   * @returns {string}
   */
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }
}

// Função para configurar os IPC handlers
export function setupBackupIPC(backupProcessor) {
  // Handler para criar backup
  ipcMain.handle('create-backup', async (event, outputPath) => {
    try {
      await backupProcessor.createFullBackup(outputPath)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  // Handler para restaurar backup
  ipcMain.handle('restore-backup', async (event, backupPath) => {
    try {
      await backupProcessor.restoreFromBackup(backupPath)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })
}
