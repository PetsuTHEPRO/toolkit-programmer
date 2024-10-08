// gerenciadorArquivo.js
import fs from 'fs'
import path from 'path'

// Caminho para o arquivo linkStorage.txt
const filePath = path.join(__dirname, '../../src/renderer/src/data')

export default {
  downloadImage(image, path) {
    // Aqui você pode escrever a imagem no caminho escolhido
    fs.writeFileSync(path, Buffer.from(image), (err) => {
      if (err) {
        console.error('Erro ao salvar a imagem:', err)
        alert('Erro ao salvar a imagem.')
        return
      }
      alert('Imagem salva com sucesso!')
    })
  },
  // Função para carregar os links do arquivo
  loadSystemInfo() {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath + '/systemInfo.txt', 'utf-8')
      return JSON.parse(data)
    } else {
      return [] // Se o arquivo não existir, retorna uma lista vazia
    }
  },

  // Função para salvar os links no arquivo
  loadLinks() {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath + '/linkStorage.txt', 'utf-8')
      return JSON.parse(data)
    } else {
      return [] // Se o arquivo não existir, retorna uma lista vazia
    }
  },
  loadFonts() {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath + '/fontStorage.txt', 'utf-8')
      return JSON.parse(data)
    } else {
      return [] // Se o arquivo não existir, retorna uma lista vazia
    }
  },
  loadFrameworks() {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath + '/frameworkStorage.txt', 'utf-8')
      return JSON.parse(data)
    } else {
      return [] // Se o arquivo não existir, retorna uma lista vazia
    }
  },
  loadAlgorithms() {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath + '/algorithmStorage.txt', 'utf-8')
      return JSON.parse(data)
    } else {
      return [] // Se o arquivo não existir, retorna uma lista vazia
    }
  },
  loadImages() {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath + '/imageStorage.txt', 'utf-8')
      return JSON.parse(data)
    } else {
      return [] // Se o arquivo não existir, retorna uma lista vazia
    }
  },

  loadIcons() {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath + '/iconStorage.txt', 'utf-8')
      return JSON.parse(data)
    } else {
      return [] // Se o arquivo não existir, retorna uma lista vazia
    }
  },

  loadPalettes() {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath + '/paletteStorage.txt', 'utf-8')
      return JSON.parse(data)
    } else {
      return [] // Se o arquivo não existir, retorna uma lista vazia
    }
  },

  saveSystemInfo(systemInfo) {
    fs.writeFileSync(filePath + '/systemInfo.txt', JSON.stringify(systemInfo, null, 2), 'utf-8')
  },
  saveLinks(links) {
    fs.writeFileSync(filePath + '/linkStorage.txt', JSON.stringify(links, null, 2), 'utf-8')
  },
  saveFonts(fonts) {
    fs.writeFileSync(filePath + '/fontStorage.txt', JSON.stringify(fonts, null, 2), 'utf-8')
  },
  saveFrameworks(frameworks) {
    fs.writeFileSync(
      filePath + '/frameworkStorage.txt',
      JSON.stringify(frameworks, null, 2),
      'utf-8'
    )
  },
  saveAlgorithms(algorithms) {
    fs.writeFileSync(
      filePath + '/algorithmStorage.txt',
      JSON.stringify(algorithms, null, 2),
      'utf-8'
    )
  },
  saveImages(images) {
    fs.writeFileSync(filePath + '/imageStorage.txt', JSON.stringify(images, null, 2), 'utf-8')
  },
  saveIcons(icons) {
    fs.writeFileSync(filePath + '/iconStorage.txt', JSON.stringify(icons, null, 2), 'utf-8')
  },
  savePalettes(palettes) {
    fs.writeFileSync(filePath + '/paletteStorage.txt', JSON.stringify(palettes, null, 2), 'utf-8')
  }
}
