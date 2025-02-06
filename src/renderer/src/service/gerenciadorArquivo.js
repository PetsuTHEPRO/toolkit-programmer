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
    try {
      if (fs.existsSync(filePath + '/systemInfo.txt')) {
        const data = fs.readFileSync(filePath + '/systemInfo.txt', 'utf-8')
        return JSON.parse(data)
      } else {
        fs.writeFileSync(filePath + '/systemInfo.txt', '"{\\"colorCount\\":0,\\"linkCount\\":0,\\"fontCount\\":0,\\"log\\":[],\\"dailyRoutine\\":{}}"', 'utf-8')
        const data = fs.readFileSync(filePath + '/systemInfo.txt', 'utf-8')
        return JSON.parse(data)
      }
    } catch (error) {
      return [] // Em caso de erro, retorna uma lista vazia
    }
  },

  // Função para salvar os links no arquivo
  loadLinks() {
    try {
      if (fs.existsSync(filePath + '/linkStorage.txt')) {
        const data = fs.readFileSync(filePath + '/linkStorage.txt', 'utf-8')
        return JSON.parse(data)
      } else {
        fs.writeFileSync(filePath + '/linkStorage.txt', '"[]"', 'utf-8')
        return '[]' // Retorna uma lista vazia
      }
    } catch (error) {
      return [] // Em caso de erro, retorna uma lista vazia
    }
  },
  loadArticles() {
    try {
      if (fs.existsSync(filePath + '/articleStorage.txt')) {
        const data = fs.readFileSync(filePath + '/articleStorage.txt', 'utf-8')
        return JSON.parse(data)
      } else {
        fs.writeFileSync(filePath + '/articleStorage.txt', '"[]"', 'utf-8')
        return '[]' // Retorna uma lista vazia
      }
    } catch (error) {
      return [] // Em caso de erro, retorna uma lista vazia
    }
  },
  loadFonts() {
    try {
      if (fs.existsSync(filePath + '/fontStorage.txt')) {
        const data = fs.readFileSync(filePath + '/fontStorage.txt', 'utf-8')
        return JSON.parse(data)
      } else {
        fs.writeFileSync(filePath + '/fontStorage.txt', '"[]"', 'utf-8')
        return '[]' // Retorna uma lista vazia
      }
    } catch (error) {
      return [] // Em caso de erro, retorna uma lista vazia
    }
  },
  loadFrameworks() {
    try {
      if (fs.existsSync(filePath + '/frameworkStorage.txt')) {
        const data = fs.readFileSync(filePath + '/frameworkStorage.txt', 'utf-8')
        return JSON.parse(data)
      } else {
        fs.writeFileSync(filePath + '/frameworkStorage.txt', '"[]"', 'utf-8')
        return '[]' // Retorna uma lista vazia
      }
    } catch (error) {
      return [] // Em caso de erro, retorna uma lista vazia
    }
  },
  loadAlgorithms() {
    try {
      if (fs.existsSync(filePath + '/algorithmStorage.txt')) {
        const data = fs.readFileSync(filePath + '/algorithmStorage.txt', 'utf-8')
        return JSON.parse(data)
      } else {
        fs.writeFileSync(filePath + '/algorithmStorage.txt', '"[]"', 'utf-8')
        return '[]' // Retorna uma lista vazia
      }
    } catch (error) {
      return [] // Em caso de erro, retorna uma lista vazia
    }
  },
  loadImages() {
    try {
      if (fs.existsSync(filePath + '/imageStorage.txt')) {
        const data = fs.readFileSync(filePath + '/imageStorage.txt', 'utf-8')
        return JSON.parse(data)
      } else {
        fs.writeFileSync(filePath + '/imageStorage.txt', '"[]"', 'utf-8')
        return '[]' // Retorna uma lista vazia
      }
    } catch (error) {
      return [] // Em caso de erro, retorna uma lista vazia
    }
  },

  loadIcons() {
    try {
      if (fs.existsSync(filePath + '/iconStorage.txt')) {
        const data = fs.readFileSync(filePath + '/iconStorage.txt', 'utf-8')
        return JSON.parse(data)
      } else {
        fs.writeFileSync(filePath + '/iconStorage.txt', '"[]"', 'utf-8')
        return '[]' // Retorna uma lista vazia
      }
    } catch (error) {
      return [] // Em caso de erro, retorna uma lista vazia
    }
  },

  loadPalettes() {
    try {
      if (fs.existsSync(filePath + '/paletteStorage.txt')) {
        const data = fs.readFileSync(filePath + '/paletteStorage.txt', 'utf-8')
        return JSON.parse(data)
      } else {
        fs.writeFileSync(filePath + '/paletteStorage.txt', '"[]"', 'utf-8')
        return '[]' // Retorna uma lista vazia
      }
    } catch (error) {
      return [] // Em caso de erro, retorna uma lista vazia
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
  saveArticles(articles) {
    fs.writeFileSync(filePath + '/articleStorage.txt', JSON.stringify(articles, null, 2), 'utf-8')
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
