// gerenciadorArquivo.js
import fs from 'fs'

// Caminho para o arquivo linkStorage.txt const filePath = path.join(__dirname, '../../src/renderer/src/data')

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
  loadSystemInfo(executableDir) {
    try {
      if (fs.existsSync(executableDir + '/systemInfo.txt')) {
        const data = fs.readFileSync(executableDir + '/systemInfo.txt', 'utf-8')
        return JSON.parse(data)
      } else {
        fs.writeFileSync(executableDir + '/systemInfo.txt', '"{\\"colorCount\\":0,\\"linkCount\\":0,\\"fontCount\\":0,\\"log\\":[],\\"dailyRoutine\\":{}}"', 'utf-8')
        const data = fs.readFileSync(executableDir + '/systemInfo.txt', 'utf-8')
        return JSON.parse(data)
      }
    } catch (error) {
      return [] // Em caso de erro, retorna uma lista vazia
    }
  },

  // Função para salvar os links no arquivo
  loadLinks(executableDir) {
    try {
      if (fs.existsSync(executableDir + '/linkStorage.txt')) {
        const data = fs.readFileSync(executableDir + '/linkStorage.txt', 'utf-8')
        return JSON.parse(data)
      } else {
        fs.writeFileSync(executableDir + '/linkStorage.txt', '"[]"', 'utf-8')
        return '[]' // Retorna uma lista vazia
      }
    } catch (error) {
      return [] // Em caso de erro, retorna uma lista vazia
    }
  },
  loadArticles(executableDir) {
    try {
      if (fs.existsSync(executableDir + '/articleStorage.txt')) {
        const data = fs.readFileSync(executableDir + '/articleStorage.txt', 'utf-8')
        return JSON.parse(data)
      } else {
        fs.writeFileSync(executableDir + '/articleStorage.txt', '"[]"', 'utf-8')
        return '[]' // Retorna uma lista vazia
      }
    } catch (error) {
      return [] // Em caso de erro, retorna uma lista vazia
    }
  },
  loadFonts(executableDir) {
    try {
      if (fs.existsSync(executableDir + '/fontStorage.txt')) {
        const data = fs.readFileSync(executableDir + '/fontStorage.txt', 'utf-8')
        return JSON.parse(data)
      } else {
        fs.writeFileSync(executableDir + '/fontStorage.txt', '"[]"', 'utf-8')
        return '[]' // Retorna uma lista vazia
      }
    } catch (error) {
      return [] // Em caso de erro, retorna uma lista vazia
    }
  },
  loadFrameworks(executableDir) {
    try {
      if (fs.existsSync(executableDir + '/frameworkStorage.txt')) {
        const data = fs.readFileSync(executableDir + '/frameworkStorage.txt', 'utf-8')
        return JSON.parse(data)
      } else {
        fs.writeFileSync(executableDir + '/frameworkStorage.txt', '"[]"', 'utf-8')
        return '[]' // Retorna uma lista vazia
      }
    } catch (error) {
      return [] // Em caso de erro, retorna uma lista vazia
    }
  },
  loadApis(executableDir) {
    try {
      if (fs.existsSync(executableDir + '/apiStorage.txt')) {
        const data = fs.readFileSync(executableDir + '/apiStorage.txt', 'utf-8')
        return JSON.parse(data)
      } else {
        fs.writeFileSync(executableDir + '/apiStorage.txt', '"[]"', 'utf-8')
        return '[]' // Retorna uma lista vazia
      }
    } catch (error) {
      return [] // Em caso de erro, retorna uma lista vazia
    }
  },
  loadAlgorithms(executableDir) {
    try {
      if (fs.existsSync(executableDir + '/algorithmStorage.txt')) {
        const data = fs.readFileSync(executableDir + '/algorithmStorage.txt', 'utf-8')
        return JSON.parse(data)
      } else {
        fs.writeFileSync(executableDir + '/algorithmStorage.txt', '"[]"', 'utf-8')
        return '[]' // Retorna uma lista vazia
      }
    } catch (error) {
      return [] // Em caso de erro, retorna uma lista vazia
    }
  },
  loadImages(executableDir) {
    try {
      if (fs.existsSync(executableDir + '/imageStorage.txt')) {
        const data = fs.readFileSync(executableDir + '/imageStorage.txt', 'utf-8')
        return JSON.parse(data)
      } else {
        fs.writeFileSync(executableDir + '/imageStorage.txt', '"[]"', 'utf-8')
        return '[]' // Retorna uma lista vazia
      }
    } catch (error) {
      return [] // Em caso de erro, retorna uma lista vazia
    }
  },

  loadIcons(executableDir) {
    try {
      if (fs.existsSync(executableDir + '/iconStorage.txt')) {
        const data = fs.readFileSync(executableDir + '/iconStorage.txt', 'utf-8')
        return JSON.parse(data)
      } else {
        fs.writeFileSync(executableDir + '/iconStorage.txt', '"[]"', 'utf-8')
        return '[]' // Retorna uma lista vazia
      }
    } catch (error) {
      return [] // Em caso de erro, retorna uma lista vazia
    }
  },

  loadVideos(executableDir) {
    try {
      if (fs.existsSync(executableDir + '/videoStorage.txt')) {
        const data = fs.readFileSync(executableDir + '/videoStorage.txt', 'utf-8')
        return JSON.parse(data)
      } else {
        fs.writeFileSync(executableDir + '/videoStorage.txt', '"[]"', 'utf-8')
        return '[]' // Retorna uma lista vazia
      }
    } catch (error) {
      return [] // Em caso de erro, retorna uma lista vazia
    }
  },

  loadPalettes(executableDir) {
    try {
      if (fs.existsSync(executableDir + '/paletteStorage.txt')) {
        const data = fs.readFileSync(executableDir + '/paletteStorage.txt', 'utf-8')
        return JSON.parse(data)
      } else {
        fs.writeFileSync(executableDir + '/paletteStorage.txt', '"[]"', 'utf-8')
        return '[]' // Retorna uma lista vazia
      }
    } catch (error) {
      return [] // Em caso de erro, retorna uma lista vazia
    }
  },

  saveSystemInfo(executableDir, systemInfo) {
    fs.writeFileSync(executableDir + '/systemInfo.txt', JSON.stringify(systemInfo, null, 2), 'utf-8')
  },
  saveLinks(executableDir, links) {
    fs.writeFileSync(executableDir + '/linkStorage.txt', JSON.stringify(links, null, 2), 'utf-8')
  },
  saveFonts(executableDir, fonts) {
    fs.writeFileSync(executableDir + '/fontStorage.txt', JSON.stringify(fonts, null, 2), 'utf-8')
  },
  saveArticles(executableDir, articles) {
    fs.writeFileSync(executableDir + '/articleStorage.txt', JSON.stringify(articles, null, 2), 'utf-8')
  },
  saveVideos(executableDir, videos) {
    fs.writeFileSync(executableDir + '/videoStorage.txt', JSON.stringify(videos, null, 2), 'utf-8')
  },
  saveFrameworks(executableDir, frameworks) {
    fs.writeFileSync(
      executableDir + '/frameworkStorage.txt',
      JSON.stringify(frameworks, null, 2),
      'utf-8'
    )
  },
  saveApis(executableDir, apis) {
    fs.writeFileSync(executableDir + '/apiStorage.txt', JSON.stringify(apis, null, 2), 'utf-8')
  },
  saveAlgorithms(executableDir, algorithms) {
    fs.writeFileSync(
      executableDir + '/algorithmStorage.txt',
      JSON.stringify(algorithms, null, 2),
      'utf-8'
    )
  },
  saveImages(executableDir, images) {
    fs.writeFileSync(executableDir + '/imageStorage.txt', JSON.stringify(images, null, 2), 'utf-8')
  },
  saveIcons(executableDir, icons) {
    fs.writeFileSync(executableDir + '/iconStorage.txt', JSON.stringify(icons, null, 2), 'utf-8')
  },
  savePalettes(executableDir, palettes) {
    fs.writeFileSync(executableDir + '/paletteStorage.txt', JSON.stringify(palettes, null, 2), 'utf-8')
  }
}
