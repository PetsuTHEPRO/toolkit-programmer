import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  uploadImage: (imageBuffer, fileName) => ipcRenderer.invoke('upload-image', imageBuffer, fileName),
  uploadIcon: (imageBuffer, fileName) => ipcRenderer.invoke('upload-icon', imageBuffer, fileName),
  loadSystemInfo: () => ipcRenderer.sendSync('load-system-info'),
  loadLinks: () => ipcRenderer.sendSync('load-links'),
  loadFonts: () => ipcRenderer.sendSync('load-fonts'),
  loadFrameworks: () => ipcRenderer.sendSync('load-frameworks'),
  loadImages: () => ipcRenderer.sendSync('load-images'),
  loadPalettes: () => ipcRenderer.sendSync('load-palettes'),
  saveSystemInfo: (systemInfo) => ipcRenderer.invoke('save-system-info', systemInfo),
  saveLinks: (links) => ipcRenderer.invoke('save-links', links),
  saveFonts: (fonts) => ipcRenderer.invoke('save-fonts', fonts),
  saveFrameworks: (frameworks) => ipcRenderer.invoke('save-frameworks', frameworks),
  saveImages: (images) => ipcRenderer.invoke('save-images', images),
  savePalettes: (palettes) => ipcRenderer.invoke('save-palettes', palettes)
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
