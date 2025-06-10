import { app, shell, BrowserWindow, ipcMain, dialog, protocol, net } from 'electron'
import { join, basename, extname, normalize } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import fs from 'fs'
import dotenv from 'dotenv'
import crypto from 'crypto' // <-- CORRETO

// Importe os módulos de serviço e banco de dados
import fileManager from '../../src/renderer/src/service/gerenciadorArquivo'
import IAServico from '../../src/renderer/src/service/IAService'
import { BackupProcessor, setupBackupIPC } from '../../src/renderer/src/service/backup'
import { setDbPath, initialize } from '../renderer/src/service/database'

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config({ path: join(__dirname, '../../.env') })

// --- CONFIGURAÇÃO DE CAMINHOS E DIRETÓRIOS ---
const userDataDir = app.getPath('userData')
const paths = {
  dataDir: join(userDataDir, 'data'),
  imgDir: join(userDataDir, 'data', 'img'),
  pdfDir: join(userDataDir, 'data', 'pdf'),
  logDir: join(userDataDir, 'logs'),
  logFilePath: join(userDataDir, 'logs', 'app.log')
}

// --- FUNÇÕES DE LOG ---
function logMessage(message) {
  fs.appendFileSync(paths.logFilePath, `[${new Date().toISOString()}] ${message}\n`)
}
function logError(error) {
  fs.appendFileSync(
    paths.logFilePath,
    `[${new Date().toISOString()}] ERROR: ${error.stack || error}\n`
  )
}

// Garante que todos os diretórios necessários existam na inicialização
Object.values(paths).forEach((dirPath) => {
  if (dirPath.endsWith('.log')) return
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
    logMessage(`Diretório criado: ${dirPath}`)
  }
})

// --- CRIAÇÃO DA JANELA PRINCIPAL ---
function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    minWidth: 800, // Define a largura mínima
    minHeight: 600, // Define a altura mínima
    show: false,
    autoHideMenuBar: true,
    icon, // <- Ícone aplicado em todas as plataformas
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webviewTag: true
    }
  })

  mainWindow.maximize()

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    fileManager.addLog('INFO', 'APP_EVENT', 'Janela principal criada e exibida.')
    mainWindow.webContents.openDevTools({ mode: 'detach' })
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
    mainWindow
      .loadFile(join(__dirname, '../renderer/index.html'))
      .then(() => fileManager.addLog('INFO', 'APP_EVENT', `Janela criada com sucesso.`))
      .catch((error) =>
        fileManager.addLog('ERROR', 'APP_EVENT', `Problema ao criar a Janela: ${error}`)
      )
  }
}

// --- REGISTRO DE TODOS OS HANDLERS IPC ---
/**
 * Centraliza a criação de todos os canais de comunicação IPC.
 * Esta função é chamada uma única vez na inicialização do aplicativo.
 */
function registerAllIpcHandlers() {
  fileManager.addLog('INFO', 'APP_EVENT', `Registrando os IpcHandlers...`)

  //Mapas para o sistema CRUD genérico
  const dataLoaders = {
    articles: () => fileManager.loadArticles(),
    links: () => fileManager.loadLinks(),
    videos: () => fileManager.loadVideos(),
    fonts: () => fileManager.loadFonts(),
    frameworks: () => fileManager.loadFrameworks(),
    apis: () => fileManager.loadApis(),
    algorithms: () => fileManager.loadAlgorithms(),
    images: () => fileManager.loadImages(),
    icons: () => fileManager.loadIcons(),
    palettes: () => fileManager.loadPalettes()
  }

  const dataCreators = {
    // CORRIGIDO: Todas as chaves agora estão no plural
    articles: (data) => fileManager.saveArticle(data),
    links: (data) => fileManager.saveLink(data),
    videos: (data) => fileManager.saveVideo(data),
    fonts: (data) => fileManager.saveFont(data),
    frameworks: (data) => fileManager.saveFramework(data),
    apis: (data) => fileManager.saveApi(data),
    algorithms: (data) => fileManager.saveAlgorithm(data),
    images: (data) => fileManager.saveImage(data),
    icons: (data) => fileManager.saveIcon(data),
    palettes: (data) => fileManager.savePalette(data)
  }

  const dataUpdaters = {
    // CORRIGIDO: Todas as chaves agora estão no plural
    articles: (id, data) => fileManager.updateArticle(id, data),
    links: (id, data) => fileManager.updateLink(id, data),
    videos: (id, data) => fileManager.updateVideo(id, data),
    fonts: (id, data) => fileManager.updateFont(id, data),
    frameworks: (id, data) => fileManager.updateFramework(id, data),
    apis: (id, data) => fileManager.updateApi(id, data),
    algorithms: (id, data) => fileManager.updateAlgorithm(id, data),
    images: (id, data) => fileManager.updateImage(id, data),
    icons: (id, data) => fileManager.updateIcon(id, data),
    palettes: (id, data) => fileManager.updatePalette(id, data)
  }

  const dataDeleters = {
    // CORRIGIDO: Todas as chaves agora estão no plural
    articles: (id) => fileManager.deleteArticle(id),
    links: (id) => fileManager.deleteLink(id),
    videos: (id) => fileManager.deleteVideo(id),
    fonts: (id) => fileManager.deleteFont(id),
    frameworks: (id) => fileManager.deleteFramework(id),
    apis: (id) => fileManager.deleteApi(id),
    algorithms: (id) => fileManager.deleteAlgorithm(id),
    images: (id) => fileManager.deleteImage(id),
    icons: (id) => fileManager.deleteIcon(id),
    palettes: (id) => fileManager.deletePalette(id)
  }

  // --- Handlers IPC (não precisam de mudança) ---
  ipcMain.handle('load-data', (_, { type }) => dataLoaders[type]())
  ipcMain.handle('save-data', (_, { type, data }) => dataCreators[type](data))
  ipcMain.handle('update-data', (_, { type, payload }) =>
    dataUpdaters[type](payload.id, payload.data)
  )
  ipcMain.handle('delete-data', (_, { type, id }) => dataDeleters[type](id))

  // Em main.js, dentro de registerAllIpcHandlers()
  ipcMain.handle('get-dashboard-stats', () => fileManager.getDashboardStats())
  ipcMain.handle('add-log', (_, { message, source, level }) =>
    fileManager.addLog(level, source, message)
  )
  ipcMain.handle('get-activities-for-month', (_, { year, month }) =>
    fileManager.getActivitiesForMonth(year, month)
  )

  ipcMain.handle('load-code-snippets', (_, algorithmId) =>
    fileManager.loadCodeSnippetsForAlgorithm(algorithmId)
  )
  ipcMain.handle('save-code-snippet', (_, data) => fileManager.saveCodeSnippet(data))

  ipcMain.handle('create-algorithm-with-snippet', (_, data) => {
    // Este handler chama a função de transação que criamos no gerenciador de arquivos.
    return fileManager.createAlgorithmWithFirstSnippet(data)
  })

  // Handlers de Arquivos e Sistema
  ipcMain.handle('get-image-dir', () => paths.imgDir)
  ipcMain.handle('get-icon-dir', () => join(paths.dataDir, 'icon')) // Exemplo se houver um subdiretório

  ipcMain.handle('get-image-base64', async (_, imagePath) => {
    try {
      const data = await fs.promises.readFile(imagePath)
      const ext = imagePath.split('.').pop()
      return `data:image/${ext};base64,${data.toString('base64')}`
    } catch (err) {
      logError(err)
      return null
    }
  })

  ipcMain.handle('download-image', async (_, imageBuffer) => {
    const { canceled, filePath } = await dialog.showSaveDialog({
      title: 'Salvar Imagem',
      defaultPath: join(paths.imgDir, 'imagem.png'),
      filters: [{ name: 'Imagens', extensions: ['png', 'jpg'] }]
    })
    if (!canceled && filePath) {
      await fs.promises.writeFile(filePath, Buffer.from(imageBuffer))
      return true
    }
    return false
  })

  // Handlers de upload (agora usam o 'fileManager' que sabe onde salvar)
  ipcMain.handle('upload-image', (_, { buffer, fileName }) =>
    fileManager.uploadImage(buffer, fileName)
  )
  ipcMain.handle('upload-icon', (_, { buffer, fileName }) =>
    fileManager.uploadIcon(buffer, fileName)
  )
  ipcMain.handle('upload-pdf', (_, { buffer, fileName }) => fileManager.uploadPdf(buffer, fileName))

  // ADICIONE ESTE NOVO HANDLER PARA UPLOAD DE ARQUIVOS
  // Dentro da sua função registerAllIpcHandlers()

  // Dentro da sua função registerAllIpcHandlers() no main.js

  ipcMain.handle('handle-file-upload', async (_, originalPath) => {
    try {
      const fileBuffer = await fs.promises.readFile(originalPath)
      const originalFileName = basename(originalPath)
      const fileExtension = extname(originalFileName)
      const safeFileName = `${crypto.randomUUID()}${fileExtension}`

      // --- A MUDANÇA É APENAS NESTA LINHA ---
      // ANTES: const destinationPath = join(paths.articlesDir, safeFileName);
      // DEPOIS (CORRETO):
      const destinationPath = join(paths.pdfDir, safeFileName)

      await fs.promises.writeFile(destinationPath, fileBuffer)

      logMessage(`Arquivo copiado para: ${destinationPath}`)
      return destinationPath
    } catch (error) {
      logError(error)
      fileManager.addLog('ERROR', 'APP_EVENT', `Falha ao processar o upload do arquivo: ${error}`)
      throw new Error('Falha ao processar o upload do arquivo.')
    }
  })

  // Em main.js
  ipcMain.handle('get-recent-activities', () => fileManager.getRecentUserActivities())
  ipcMain.handle('clear-user-logs', () => fileManager.clearUserLogs())

  ipcMain.handle('show-file-in-folder', (_, filePath) => {
    if (filePath) {
      // O método showItemInFolder abre a pasta e seleciona o arquivo.
      shell.showItemInFolder(filePath)
    }
  })

  // Handler de Chave de API (Seguro)
  ipcMain.handle('get-api-key', () => {
    if (!process.env.YOUTUBE_API_KEY) {
      // A chave de API do YouTube deve estar definida no arquivo .env
      fileManager.addLog(
        'ERROR',
        'APP_EVENT',
        'A chave de API do YouTube não está definida no arquivo .env!'
      )
      logError('A chave de API do YouTube não está definida no arquivo .env!')
      return null
    }
    return process.env.YOUTUBE_API_KEY
  })

  // Handlers de Backup
  const backupProcessor = new BackupProcessor(fileManager) // Não precisa mais do txtDir
  setupBackupIPC(backupProcessor)

  // Handlers de Serviços Adicionais
  const iaServico = new IAServico()
  iaServico.registerHandlers()

  // Registra os handlers de IPC
  fileManager.addLog('INFO', 'APP_EVENT', 'Handlers IPC registrados com sucesso.')
  logMessage('Handlers IPC registrados com sucesso.')
}

// --- CICLO DE VIDA DA APLICAÇÃO ---

app.whenReady().then(async () => {
  // REGISTRO DE PROTOCOLO (VERSÃO MODERNA COM ASYNC/AWAIT)
  protocol.handle('app', (request) => {
    // 1. Extrai o caminho do arquivo da URL 'app://'
    const filePath = request.url.slice('app://'.length)

    // 2. Normaliza o caminho para o formato correto do sistema operacional
    // e decodifica caracteres especiais (como espaços %20)
    const normalizedPath = normalize(decodeURI(filePath))

    // 3. Usa net.fetch para acessar o recurso local de forma segura.
    // Ele retorna um objeto Response padrão, que o Electron entende perfeitamente.
    // É importante converter o caminho de volta para uma URL file:// aqui.
    return net.fetch(`file://${normalizedPath}`)
  })

  electronApp.setAppUserModelId('com.my-app.id') // Use um ID único para sua aplicação

  try {
    // 1. Define o caminho do banco de dados
    setDbPath(paths.dataDir)
    // 2. Garante que as tabelas do banco de dados existam
    await initialize()
    // 3. Inicializa o fileManager para que ele conheça os caminhos
    //fileManager.initializeFileManager(paths)
    logMessage('Banco de dados e gerenciador de arquivos inicializados.')
  } catch (err) {
    logError(err)
    // TODO: Mostrar um diálogo de erro crítico para o usuário
    app.quit()
  }

  // 4. Registra todos os handlers IPC
  registerAllIpcHandlers()

  // 5. Cria a janela principal
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  logMessage('Todas as janelas foram fechadas. Encerrando a aplicação.')
  fileManager.addLog(
    'INFO',
    'APP_EVENT',
    'Todas as janelas foram fechadas. Encerrando a aplicação.'
  )
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Otimizações do electron-toolkit
app.on('browser-window-created', (_, window) => {
  optimizer.watchWindowShortcuts(window)
})
