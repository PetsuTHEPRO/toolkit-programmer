// preload.js
import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Helper para criar um conjunto de funções CRUD para uma entidade
const createCrudApi = (entityType) => ({
  /**
   * Carrega todos os itens da entidade.
   * @returns {Promise<Array<Object>>}
   */
  loadAll: () => ipcRenderer.invoke('load-data', { type: entityType }),

  /**
   * Cria um novo item.
   * @param {Object} data - O objeto de dados do novo item.
   * @returns {Promise<boolean>}
   */
  create: (data) => ipcRenderer.invoke('save-data', { type: entityType, data }),

  /**
   * Atualiza um item existente pelo seu ID.
   * @param {string} id - O ID do item a ser atualizado.
   * @param {Object} data - Um objeto com os campos a serem atualizados.
   * @returns {Promise<boolean>}
   */
  update: (id, data) =>
    ipcRenderer.invoke('update-data', { type: entityType, payload: { id, data } }),

  /**
   * Deleta um item pelo seu ID.
   * @param {string} id - O ID do item a ser deletado.
   * @returns {Promise<boolean>}
   */
  delete: (id) => ipcRenderer.invoke('delete-data', { type: entityType, id })
})

// API principal exposta para o renderer
const api = {
  // Agrupamos todas as operações de dados sob a chave 'crud'
  crud: {
    articles: createCrudApi('articles'),
    links: createCrudApi('links'),
    videos: createCrudApi('videos'),
    fonts: createCrudApi('fonts'),
    frameworks: createCrudApi('frameworks'),
    apis: createCrudApi('apis'),
    algorithms: {
      // 1. Isso copia os métodos padrão: loadAll, create (simples), update, delete
      ...createCrudApi('algorithms'),

      // 2. E aqui adicionamos a nossa nova função para criar com o primeiro snippet
      createWithSnippet: (data) => ipcRenderer.invoke('create-algorithm-with-snippet', data)
    },
    images: createCrudApi('images'),
    icons: createCrudApi('icons'),
    palettes: createCrudApi('palettes'),
    codeSnippets: {
      loadForAlgorithm: (algorithmId) => ipcRenderer.invoke('load-code-snippets', algorithmId),
      create: (data) => ipcRenderer.invoke('save-code-snippet', data)
    }
  },

  dashboard: {
    getStats: () => ipcRenderer.invoke('get-dashboard-stats'),
    logActivity: (message, level = 'INFO') =>
      ipcRenderer.invoke('add-log', { level, source: 'USER_ACTIVITY', message }),
    getActivitiesForMonth: (year, month) =>
      ipcRenderer.invoke('get-activities-for-month', { year, month }),

    // NOVAS FUNÇÕES PARA O LOG
    getRecentActivities: () => ipcRenderer.invoke('get-recent-activities'),
    clearUserLogs: () => ipcRenderer.invoke('clear-user-logs')
  },

  // APIs de sistema e arquivos (não se encaixam no CRUD genérico)
  files: {
    getImageDir: () => ipcRenderer.invoke('get-image-dir'),
    getIconDir: () => ipcRenderer.invoke('get-icon-dir'),
    getImageBase64: (imagePath) => ipcRenderer.invoke('get-image-base64', imagePath),
    getIconBase64: (iconPath) => ipcRenderer.invoke('get-icon-base64', iconPath),
    uploadImage: (imageBuffer, fileName) =>
      ipcRenderer.invoke('upload-image', imageBuffer, fileName),
    uploadIcon: (imageBuffer, fileName) => ipcRenderer.invoke('upload-icon', imageBuffer, fileName),
    uploadPdf: (pdfBuffer, fileName) => ipcRenderer.invoke('upload-pdf', pdfBuffer, fileName),
    downloadImage: (imageBuffer) => ipcRenderer.invoke('download-image', imageBuffer),
    handleFileUpload: (originalPath) => ipcRenderer.invoke('handle-file-upload', originalPath),
    showInFolder: (filePath) => ipcRenderer.invoke('show-file-in-folder', filePath)
  },

  // APIs de Backup
  backup: {
    create: (backupPath) => ipcRenderer.invoke('create-backup', backupPath),
    restore: (backupPath) => ipcRenderer.invoke('restore-backup', backupPath),
    getDefaultPath: () => ipcRenderer.invoke('get-default-backup-path'),
    selectDirectory: () => ipcRenderer.invoke('dialog:selectDirectory')
  }
}

// As outras APIs permanecem como estão, pois já eram boas
const chatAPI = {
  sendMessage: (message) => ipcRenderer.invoke('ask-ai', message),
  sendMessageWithModel: (message, model, mode) =>
    ipcRenderer.invoke('ask-ai-with-model', { message, model, mode }),
  setCurrentKey: (apiKey) => ipcRenderer.invoke('set-current-key', apiKey),
  getAvailableModels: () => ipcRenderer.invoke('get-ai-models'),
  setCurrentModel: (modelName) => ipcRenderer.invoke('set-ai-model', modelName),
  testConnection: () =>
    ipcRenderer
      .invoke('ask-ai', 'Teste de conexão')
      .then(() => true)
      .catch(() => false)
}

const env = {
  getApiKey: () => ipcRenderer.invoke('get-api-key')
}

// Exposição segura das APIs para o renderer
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('chatAPI', chatAPI)
    contextBridge.exposeInMainWorld('env', env)
  } catch (error) {
    console.error(error)
  }
} else {
  // Fallback para quando contextIsolation está desativado (não recomendado)
  window.electron = electronAPI
  window.api = api
  window.chatAPI = chatAPI
  window.env = env
}
