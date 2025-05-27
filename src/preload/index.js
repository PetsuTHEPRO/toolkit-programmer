import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  getImageDir: () => ipcRenderer.invoke('get-image-dir'),
  getIconDir: () => ipcRenderer.invoke('get-icon-dir'),
  getImageBase64: (imagePath) => {
    return ipcRenderer.invoke('get-image-base64', imagePath)
  },
  getIconBase64: (iconPath) => {
    return ipcRenderer.invoke('get-icon-base64', iconPath)
  },
  uploadImage: (imageBuffer, fileName) => ipcRenderer.invoke('upload-image', imageBuffer, fileName),
  uploadIcon: (imageBuffer, fileName) => ipcRenderer.invoke('upload-icon', imageBuffer, fileName),
  uploadImageFont: (imageBuffer, fileName) =>
    ipcRenderer.invoke('upload-image-font', imageBuffer, fileName),
  uploadPdf: (pdfBuffer, fileName) => ipcRenderer.invoke('upload-pdf', pdfBuffer, fileName),
  loadSystemInfo: () => ipcRenderer.sendSync('load-system-info'),
  loadLinks: () => ipcRenderer.sendSync('load-links'),
  loadFonts: () => ipcRenderer.sendSync('load-fonts'),
  loadFrameworks: () => ipcRenderer.sendSync('load-frameworks'),
  loadAlgorithms: () => ipcRenderer.sendSync('load-algorithms'),
  loadVideos: () => ipcRenderer.sendSync('load-videos'),
  loadApis: () => ipcRenderer.sendSync('load-apis'),
  loadImages: () => ipcRenderer.sendSync('load-images'),
  loadIcons: () => ipcRenderer.sendSync('load-icons'),
  loadPalettes: () => ipcRenderer.sendSync('load-palettes'),
  loadArticles: () => ipcRenderer.sendSync('load-articles'),
  saveSystemInfo: (systemInfo) => ipcRenderer.invoke('save-system-info', systemInfo),
  saveLinks: (links) => ipcRenderer.invoke('save-links', links),
  saveFonts: (fonts) => ipcRenderer.invoke('save-fonts', fonts),
  saveFrameworks: (frameworks) => ipcRenderer.invoke('save-frameworks', frameworks),
  saveApis: (apis) => ipcRenderer.invoke('save-apis', apis),
  saveVideos: (videos) => ipcRenderer.invoke('save-videos', videos),
  saveAlgorithms: (algorithms) => ipcRenderer.invoke('save-algorithms', algorithms),
  saveImages: (images) => ipcRenderer.invoke('save-images', images),
  saveIcons: (icons) => ipcRenderer.invoke('save-icons', icons),
  savePalettes: (palettes) => ipcRenderer.invoke('save-palettes', palettes),
  saveArticles: (articles) => ipcRenderer.invoke('save-articles', articles),
  downloadImage: (imageBuffer) => ipcRenderer.invoke('download-image', imageBuffer),
  // Métodos para backup
  createBackup: (backupPath) => ipcRenderer.invoke('create-backup', backupPath),
  restoreBackup: (backupPath) => ipcRenderer.invoke('restore-backup', backupPath),
  getDefaultBackupPath: () => ipcRenderer.invoke('get-default-backup-path'),
  selectDirectory: () => ipcRenderer.invoke('dialog:selectDirectory')
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}

contextBridge.exposeInMainWorld('chatAPI', {
  // Método existente
  sendMessage: (message) => ipcRenderer.invoke('ask-ai', message),
  // Novos métodos adicionados
  sendMessageWithModel: (message, model, mode) => ipcRenderer.invoke('ask-ai-with-model', { message, model, mode }, ),
  setCurrentKey: (apiKey) => ipcRenderer.invoke('set-current-key', apiKey),
  getAvailableModels: () => ipcRenderer.invoke('get-ai-models'),
  setCurrentModel: (modelName) => ipcRenderer.invoke('set-ai-model', modelName),
  // Método utilitário para verificar conexão com a API
  testConnection: () => ipcRenderer.invoke('ask-ai', 'Teste de conexão').then(() => true).catch(() => false)
})

contextBridge.exposeInMainWorld('env', {
  getApiKey: () => ipcRenderer.invoke('get-api-key')
})
