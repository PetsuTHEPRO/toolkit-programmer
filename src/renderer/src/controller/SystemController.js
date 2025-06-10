import store from '../stores/sistema'
import notification from '../service/notificationService'
import { getKeyApi } from '../service/userPreferences'

// Mapeia o tipo da entidade para a chave correspondente no estado do Vuex
const entityToStateKeyMap = {
  articles: 'articlesStorage',
  links: 'linksStorage',
  videos: 'videosStorage',
  fonts: 'fontsStorage',
  frameworks: 'frameworksStorage',
  apis: 'apisStorage',
  algorithms: 'algorithmsStorage',
  images: 'imagesStorage',
  icons: 'iconsStorage',
  palettes: 'palettesStorage'
}

class SystemController {
  /**
   * Inicializa o estado do sistema carregando todos os dados do banco de dados de forma concorrente.
   */
  static async initializeSystem() {
    console.log('Inicializando sistema e carregando dados...')
    try {
      window.chatAPI.setCurrentKey(getKeyApi())

      const loadPromises = Object.keys(entityToStateKeyMap).map((entityType) =>
        window.api.crud[entityType].loadAll()
      )

      const results = await Promise.all(loadPromises)

      Object.keys(entityToStateKeyMap).forEach((entityType, index) => {
        const stateKey = entityToStateKeyMap[entityType]
        const data = results[index]
        store.commit('SET_STATE_PROPERTY', { key: stateKey, value: data })
      })

      notification.success('Sistema carregado com sucesso!')
    } catch (error) {
      console.error('Erro ao inicializar o sistema:', error)
      notification.error('Falha ao carregar os dados do sistema.')
    }
  }

  /**
   * Carrega os dados de uma única entidade e atualiza o estado.
   * @param {string} entityType - O tipo da entidade (ex: 'articles', 'links').
   */
  static async loadEntity(entityType) {
    try {
      const data = await window.api.crud[entityType].loadAll()
      const stateKey = entityToStateKeyMap[entityType]
      store.commit('SET_STATE_PROPERTY', { key: stateKey, value: data })
    } catch (error) {
      console.error(`Erro ao carregar a entidade '${entityType}':`, error)
      notification.error(`Não foi possível atualizar os dados de ${entityType}.`)
    }
  }

  // --- MÉTODOS CRUD GENÉRICOS INTERNOS ---

  static async createItem(entityType, data, successMessage) {
    try {
      await window.api.crud[entityType].create(data)
      notification.success(successMessage)
      await this.loadEntity(entityType)
      // LOG AUTOMÁTICO
      await window.api.dashboard.logActivity(
        `${entityType.slice(0, -1)} '${data.name}' foi adicionado(a).`,
        `INFO`
      )
    } catch (error) {
      await window.api.dashboard.logActivity(
        `Ocorre um erro ao adicionar o(a) ${entityType.slice(0, -1)} '${data.name}': ${error}.`,
        `ERROR`
      )
    }
  }

  static async updateItem(entityType, id, data, successMessage) {
    try {
      await window.api.crud[entityType].update(id, data)
      notification.success(successMessage)
      await this.loadEntity(entityType)
      // LOG AUTOMÁTICO
      await window.api.dashboard.logActivity(
        `${entityType.slice(0, -1)} '${data.name}' foi atualizado(a).`,
        `INFO`
      )
    } catch (error) {
      await window.api.dashboard.logActivity(
        `Ocorreu um erro ao atualizar o(a) ${entityType.slice(0, -1)} '${data.name}': ${error}.`,
        `ERROR`
      )
    }
  }

  static async deleteItem(entityType, id, successMessage) {
    try {
      // Precisamos buscar o nome do item ANTES de deletar para usar no log
      const items = store.getters.getStorage(entityToStateKeyMap[entityType]) || []
      const itemToDelete = items.find((item) => item.id === id)
      const itemName = itemToDelete ? itemToDelete.name : `com ID ${id}`

      await window.api.crud[entityType].delete(id)
      notification.success(successMessage)
      await this.loadEntity(entityType)
      // LOG AUTOMÁTICO
      await window.api.dashboard.logActivity(
        `${entityType.slice(0, -1)} '${itemName}' foi removido(a).`,
        `INFO`
      )
    } catch (error) {
      await window.api.dashboard.logActivity(
        `Ocorreu um erro ao deletar o(a) ${entityType.slice(0, -1)} com ID ${id}: ${error}.`,
        `ERROR`
      )
    }
  }

  // --- NOVOS MÉTODOS PARA O DASHBOARD ---

  static async getDashboardStats() {
    return await window.api.dashboard.getStats()
  }

  static async getActivitiesForMonth(year, month) {
    return await window.api.dashboard.getActivitiesForMonth(year, month)
  }

  // --- INTERFACE PÚBLICA COMPLETA PARA O RESTO DA APLICAÇÃO ---

  static addLink(data) {
    this.createItem('links', data, 'Link adicionado com sucesso!')
  }
  static editLink(data) {
    this.updateItem('links', data.id, data, 'Link editado com sucesso!')
  }
  static deleteLink(id) {
    this.deleteItem('links', id, 'Link removido com sucesso!')
  }

  static addVideo(data) {
    this.createItem('videos', data, 'Vídeo adicionado com sucesso!')
  }
  static editVideo(data) {
    this.updateItem('videos', data.id, data, 'Vídeo editado com sucesso!')
  }
  static deleteVideo(id) {
    this.deleteItem('videos', id, 'Vídeo removido com sucesso!')
  }

  static addArticle(data) {
    this.createItem('articles', data, 'Artigo adicionado com sucesso!')
  }
  static editArticle(data) {
    this.updateItem('articles', data.id, data, 'Artigo editado com sucesso!')
  }
  static deleteArticle(id) {
    this.deleteItem('articles', id, 'Artigo removido com sucesso!')
  }

  static addFont(data) {
    this.createItem('fonts', data, 'Fonte adicionada com sucesso!')
  }
  static editFont(data) {
    this.updateItem('fonts', data.id, data, 'Fonte editada com sucesso!')
  }
  static deleteFont(id) {
    this.deleteItem('fonts', id, 'Fonte removida com sucesso!')
  }

  static addFramework(data) {
    this.createItem('frameworks', data, 'Framework adicionado com sucesso!')
  }
  static editFramework(data) {
    this.updateItem('frameworks', data.id, data, 'Framework editado com sucesso!')
  }
  static deleteFramework(id) {
    this.deleteItem('frameworks', id, 'Framework removido com sucesso!')
  }

  // Dentro da classe SystemController
  static async loadCodeSnippets(algorithmId) {
    return window.api.crud.codeSnippets.loadForAlgorithm(algorithmId)
  }
  static async addCodeSnippet(data) {
    return window.api.crud.codeSnippets.create(data)
  }

  static addApi(data) {
    this.createItem('apis', data, 'API adicionada com sucesso!')
  }
  static editApi(data) {
    this.updateItem('apis', data.id, data, 'API editada com sucesso!')
  }
  static deleteApi(id) {
    this.deleteItem('apis', id, 'API removida com sucesso!')
  }

  static addAlgorithm(data) {
    this.createItem('algorithms', data, 'Algoritmo adicionado com sucesso!')
  }

  // ADICIONE ESTE NOVO MÉTODO COMPLETO
  static async addAlgorithmWithSnippet(data) {
    try {
      // Chama a nova função da nossa API que faz a transação no backend
      await window.api.crud.algorithms.createWithSnippet(data)
      notification.success('Algoritmo e código inicial salvos com sucesso!')

      // Atualiza a lista principal de algoritmos na store para garantir a reatividade
      await this.loadEntity('algorithms')
    } catch (error) {
      console.error('Erro ao criar algoritmo com snippet:', error)
      notification.error('Falha ao salvar o novo algoritmo.')
    }
  }

  static editAlgorithm(data) {
    this.updateItem('algorithms', data.id, data, 'Algoritmo editado com sucesso!')
  }
  static deleteAlgorithm(id) {
    this.deleteItem('algorithms', id, 'Algoritmo removido com sucesso!')
  }

  static addImage(data) {
    this.createItem('images', data, 'Imagem adicionada com sucesso!')
  }
  static editImage(data) {
    this.updateItem('images', data.id, data, 'Imagem editada com sucesso!')
  }
  static deleteImage(id) {
    this.deleteItem('images', id, 'Imagem removida com sucesso!')
  }

  static addIcon(data) {
    this.createItem('icons', data, 'Ícone adicionado com sucesso!')
  }
  static editIcon(data) {
    this.updateItem('icons', data.id, data, 'Ícone editado com sucesso!')
  }
  static deleteIcon(id) {
    this.deleteItem('icons', id, 'Ícone removido com sucesso!')
  }

  static addPalette(data) {
    this.createItem('palettes', data, 'Paleta adicionada com sucesso!')
  }
  static editPalette(data) {
    this.updateItem('palettes', data.id, data, 'Paleta editada com sucesso!')
  }
  static deletePalette(id) {
    this.deleteItem('palettes', id, 'Paleta removida com sucesso!')
  }

  // --- MÉTODOS DE LÓGICA DE NEGÓCIO E OUTROS ---

  static downloadImage(imageBuffer) {
    // A API de arquivos foi organizada sob a chave 'files' no preload
    window.api.files.downloadImage(imageBuffer)
  }

  static updateDiaryRoutine() {
    const day = new Date().getDate()
    let dailyRoutine = store.getters['getDiaryRoutine'] || {}
    dailyRoutine[day] = (dailyRoutine[day] || 0) + 1
    store.commit('SET_STATE_PROPERTY', { key: 'dailyRoutine', value: dailyRoutine })
    // TODO: Implementar a persistência desta configuração no banco, se necessário,
    // usando um método como `updateSetting('dailyRoutine', dailyRoutine)`.
  }

  // Getter para acessar o store, útil dentro de outros métodos do controller
  static getStorage(storageKey) {
    return store.getters['getStorage'](storageKey)
  }

  static async getRecentActivities() {
    return await window.api.dashboard.getRecentActivities()
  }

  static async clearUserLogs() {
    await window.api.dashboard.clearUserLogs()
  }
}

export default SystemController
