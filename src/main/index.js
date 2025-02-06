import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import fs from 'fs'
import fileManager from '../../src/renderer/src/service/gerenciadorArquivo'

// Verifica se o ambiente é executável portátil (como AppImage)
const executableDir = app.getPath('userData')
const logDir = join(executableDir, 'logs')
const logFilePath = join(logDir, 'app.log')

// Verifica se o diretório de logs existe e cria se necessário
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true })
  logMessage("Criou pasta")
}else{
  logError("Pasta ja existe")
}

// Função de log para gravar no arquivo
function logMessage(message) {
  const timestamp = new Date().toISOString()
  fs.appendFileSync(logFilePath, `[${timestamp}] ${message}\n`)
}

// Função de log para erros
function logError(error) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logFilePath, `[${timestamp}] ERROR: ${error.stack || error}\n`);
}

// Obtém o caminho do diretório de dados do usuário
const userPath = app.getPath('userData')
const uploadsPath = join(userPath, 'assets/images')
const uploadsIconsPath = join(userPath, 'assets/icons')
const uploadsPdfPath = join(userPath, 'assets/pdfs')

// Cria as pastas se não existirem
try{
  // Verifica se a pasta existe e cria se não existir
  if (!fs.existsSync(uploadsPdfPath)) {
    fs.mkdirSync(uploadsPdfPath, { recursive: true })
    logMessage(`Pasta criada com sucesso: ${uploadsPdfPath}`)
  } else {
    logMessage(`A pasta já existe: ${uploadsPdfPath}`)
  }
} catch (error) {
  logError(`Erro ao criar a pasta ${uploadsPdfPath}: ${error}`)
}

try {
  // Verifica se a pasta existe e cria se não existir
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true })
  } else {
    logMessage(`Pasta criada com sucesso: ${uploadsPath}`)
  }
} catch (error) {
  logError(`Erro ao criar a pasta ${uploadsPath}: ${error}`)
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
  console.error('Erro ao criar a pasta:', error, uploadsIconsPath)
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
    mainWindow.webContents.openDevTools()
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
      .then(() => logMessage('Janela carregada com sucesso'))
      .catch((error) => logError(`Erro ao carregar a janela: ${error}`))
  }
}

ipcMain.handle('download-image', async (event, imageBuffer) => {
  // Exibe o diálogo de salvar arquivo e aguarda a resposta
  // Opções para o diálogo de salvar
  const options = {
    title: 'Salvar Imagem',
    defaultPath: join(uploadsPath, 'imagem.png'),
    buttonLabel: 'Salvar',
    filters: [
      { name: 'Imagens', extensions: ['jpg', 'jpeg', 'png', 'gif'] },
      { name: 'Todos os Arquivos', extensions: ['*'] }
    ]
  }

  const result = await dialog.showSaveDialog(options)

  // Verifica se o usuário não cancelou a operação
  if (!result.canceled && result.filePath) {
    const uploadsPath = result.filePath
    // Aqui você pode escrever a imagem no caminho escolhido
    fileManager.downloadImage(imageBuffer, uploadsPath)
  } else {
    logError('Erro no salvamento da imagem.')
    return false
  }

  return true
})

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

ipcMain.on('load-articles', (event) => {
  let articles = fileManager.loadArticles()
  event.returnValue = articles
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

ipcMain.on('load-algorithms', (event) => {
  let algorithms = fileManager.loadAlgorithms()
  event.returnValue = algorithms
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

ipcMain.handle('save-articles', async (event, articles) => {
  fileManager.saveArticles(articles)
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

ipcMain.handle('save-algorithms', async (event, algorithms) => {
  fileManager.saveAlgorithms(algorithms)
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

ipcMain.handle('upload-image-font', async (event, imageBuffer, fileName) => {
  const filePath = join(uploadsPath + '/fontStorage', fileName)
  fs.writeFileSync(filePath, Buffer.from(imageBuffer))
  return filePath
})

ipcMain.handle('upload-pdf', async (event, pdfBuffer, fileName) => {
  const filePath = join(uploadsPdfPath, fileName)
  fs.writeFileSync(filePath, Buffer.from(pdfBuffer))
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
  ipcMain.on('ping', () => logMessage('Pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    logMessage('Janela carregada com sucesso')
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  logMessage('Janela fechada com sucesso')
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
