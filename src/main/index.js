import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import fs from 'fs'
import fileManager from '../../src/renderer/src/service/gerenciadorArquivo'

// Obtém o caminho do diretório de dados do usuário

const uploadsPath = join(__dirname, '../../src/renderer/src/assets/images')
const uploadsIconsPath = join(__dirname, '../../src/renderer/src/assets/icons')

try {
  // Verifica se a pasta existe e cria se não existir
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true })
  } else {
    console.log('A pasta já existe:', uploadsPath)
  }
} catch (error) {
  console.error('Erro ao criar a pasta:', error)
}

try {
  // Verifica se a pasta existe e cria se não existir
  if (!fs.existsSync(uploadsIconsPath)) {
    fs.mkdirSync(uploadsIconsPath, { recursive: true })
    console.log('Pasta criada com sucesso:', uploadsIconsPath)
  } else {
    console.log('A pasta já existe:', uploadsIconsPath)
  }
} catch (error) {
  console.error('Erro ao criar a pasta:', error)
}

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    minWidth: 800, // Define a largura mínima
    minHeight: 600, // Define a altura mínima
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.maximize()

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// Comunicação IPC para carregar os links no frontend
ipcMain.on('load-system-info', (event) => {
  let systemInfo = fileManager.loadSystemInfo()
  event.returnValue = systemInfo // Envia os links para o renderer
})

// Comunicação IPC para carregar os links no frontend
ipcMain.on('load-links', (event) => {
  let links = fileManager.loadLinks()
  event.returnValue = links
})

// Comunicação IPC para carregar os links no frontend
ipcMain.on('load-fonts', (event) => {
  let fonts = fileManager.loadFonts()
  event.returnValue = fonts
})

// Comunicação IPC para carregar os links no frontend
ipcMain.on('load-frameworks', (event) => {
  let frameworks = fileManager.loadFrameworks()
  event.returnValue = frameworks
})

ipcMain.on('load-images', (event) => {
  let images = fileManager.loadImages()
  event.returnValue = images
})

ipcMain.on('load-icons', (event) => {
  let icons = fileManager.loadIcons()
  event.returnValue = icons
})

ipcMain.on('load-palettes', (event) => {
  let palettes = fileManager.loadPalettes()
  event.returnValue = palettes
})
// Comunicação IPC para salvar os links no arquivo
ipcMain.handle('save-system-info', async (event, systemInfo) => {
  fileManager.saveSystemInfo(systemInfo)
  return true
})

ipcMain.handle('save-links', async (event, links) => {
  fileManager.saveLinks(links)
  return true
})

ipcMain.handle('save-fonts', async (event, fonts) => {
  fileManager.saveFonts(fonts)
  return true
})

ipcMain.handle('save-frameworks', async (event, frameworks) => {
  fileManager.saveFrameworks(frameworks)
  return true
})

ipcMain.handle('save-images', async (event, images) => {
  fileManager.saveImages(images)
  return true
})

ipcMain.handle('save-icons', async (event, icons) => {
  fileManager.saveIcons(icons)
  return true
})

ipcMain.handle('save-palettes', async (event, palettes) => {
  fileManager.savePalettes(palettes)
  return true
})

// Manipulador IPC para upload de imagem
ipcMain.handle('upload-image', async (event, imageBuffer, fileName) => {
  const filePath = join(uploadsPath, fileName)
  fs.writeFileSync(filePath, Buffer.from(imageBuffer))
  return filePath
})

// Manipulador IPC para upload de icon
ipcMain.handle('upload-icon', async (event, imageBuffer, fileName) => {
  const filePath = join(uploadsIconsPath, fileName)
  fs.writeFileSync(filePath, Buffer.from(imageBuffer))
  return filePath
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
