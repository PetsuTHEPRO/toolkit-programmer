import store from '../stores/sistema'
import notification from '../service/notificationService'

class SystemController {
  static updateSystem() {
    // Carregar os dados do sistema e armazená-los em variáveis
    const storageItems = {
      links: 'linksStorage',
      fonts: 'fontsStorage',
      frameworks: 'frameworksStorage',
      algorithms: 'algorithmsStorage',
      images: 'imagesStorage',
      icons: 'iconsStorage',
      palettes: 'palettesStorage'
    }

    // Carregar systemInfo e fazer os commits relacionados ao estado do sistema
    let systemInfo = window.api.loadSystemInfo()
    const data = JSON.parse(systemInfo)

    // Usar a mutação genérica para atualizar o estado
    store.commit('SET_STATE_PROPERTY', { key: 'colorCount', value: data.colorCount })
    store.commit('SET_STATE_PROPERTY', { key: 'linkCount', value: data.linkCount })
    store.commit('SET_STATE_PROPERTY', { key: 'fontCount', value: data.fontCount })
    store.commit('SET_STATE_PROPERTY', { key: 'log', value: data.log })
    store.commit('SET_STATE_PROPERTY', { key: 'dailyRoutine', value: data.routineDaily })

    // Iterar pelos dados de armazenamento e fazer os commits usando a mutação genérica
    for (const [key, storageKey] of Object.entries(storageItems)) {
      let loadedData = window.api[`load${key.charAt(0).toUpperCase() + key.slice(1)}`]()
      store.commit('SET_STATE_PROPERTY', { key: storageKey, value: JSON.parse(loadedData) })
    }

    // Salvar o sistema atualizado
    this.saveSystem()
  }

  static downloadImage(imageBuffer) {
    window.api.downloadImage(imageBuffer)
  }

  static resetCalendar(currentMonth) {
    store.commit('RESET_CALENDAR', currentMonth)

    let systemInfo = store.getters['getSistemaState']

    window.api.saveSystemInfo(JSON.stringify(systemInfo))
  }

  static getCurrentCalendar() {
    return store.getters['getCurrentCalendar']
  }

  static updateDiaryRoutine() {
    const day = new Date().getDate()
    let dailyRoutine = store.getters['getSistemaState']

    dailyRoutine[day] = (dailyRoutine[day] || 0) + 1

    store.commit('SET_DIARY_ROUTINE', dailyRoutine)
    this.saveSystem()
  }

  static addLink(change) {
    this.addToStorage('linksStorage', 'Link adicionado com sucesso!', change)
  }

  static editLink(change) {
    this.editFromStorage('linksStorage', 'Link editado com sucesso!', change)
  }

  static deleteLink(index) {
    this.deleteFromStorage('linksStorage', 'Link removido com sucesso!', index)
  }

  static addFont(change) {
    this.addToStorage('fontsStorage', 'Fonte adicionada com sucesso!', change)
  }

  static editFont(change) {
    this.editFromStorage('fontsStorage', 'Fonte editada com sucesso!', change)
  }

  static deleteFont(index) {
    this.deleteFromStorage('fontsStorage', 'Fonte removida com sucesso!', index)
  }

  static addFramework(change) {
    this.addToStorage('frameworksStorage', 'Framework adicionado com sucesso!', change)
  }

  static editFramework(change) {
    this.editFromStorage('frameworksStorage', 'Framework editado com sucesso!', change)
  }

  static deleteFramework(index) {
    this.deleteFromStorage('frameworksStorage', 'Framework removido com sucesso!', index)
  }

  static addAlgorithm(change) {
    this.addToStorage('algorithmsStorage', 'Algoritmo adicionado com sucesso!', change)
  }

  static deleteAlgorithm(index) {
    this.deleteFromStorage('algorithmsStorage', 'Algoritmo removido com sucesso!', index)
  }

  static addImage(change) {
    this.addToStorage('imagesStorage', 'Imagem adicionada com sucesso!', change)
  }

  static editImage(change) {
    this.editFromStorage('imagesStorage', 'Imagem editada com sucesso!', change)
  }

  static deleteImage(index) {
    this.deleteFromStorage('imagesStorage', 'Imagem removida com sucesso!', index)
  }

  static addIcon(change) {
    this.addToStorage('iconsStorage', 'Ícone adicionado com sucesso!', change)
  }

  static editIcon(change) {
    this.editFromStorage('iconsStorage', 'Ícone editado com sucesso!', change)
  }

  static deleteIcon(index) {
    this.deleteFromStorage('iconsStorage', 'Ícone removido com sucesso!', index)
  }

  static addPalette(change) {
    let count = change.colors.length
    this.addToStorage('palettesStorage', 'Paleta adicionada com sucesso!', change, count)
  }

  static editPalette(change) {
    this.editFromStorage('palettesStorage', 'Paleta editada com sucesso!', change)
  }

  static deletePalette(index, count) {
    this.deleteFromStorage('palettesStorage', 'Paleta removida com sucesso!', index, count)
  }
  static clearMessagesLog() {
    store.commit('CLEAR_LOG')
    this.saveSystem()
  }
  static getColor() {
    return store.getters['getColorCount']
  }

  static getLink() {
    return store.getters['getLinkCount']
  }

  static getFont() {
    return store.getters['getFontCount']
  }

  static getStorage(storageKey) {
    return store.getters['getStorage'](storageKey)
  }

  static getMessagesLog() {
    return store.getters['getLog']
  }

  static getDiaryRoutine() {
    return store.getters['getDiaryRoutine']
  }

  static saveSystem() {
    const storageItems = {
      links: 'getStorage',
      fonts: 'getStorage',
      frameworks: 'getStorage',
      algorithms: 'getStorage',
      images: 'getStorage',
      icons: 'getStorage',
      palettes: 'getStorage'
    }

    // Salva as informações do sistema
    window.api.saveSystemInfo(JSON.stringify(store.getters['getSistemaState']))

    // Itera sobre os itens de armazenamento e salva cada um
    for (const [key] of Object.entries(storageItems)) {
      const data = this.getStorage(key + 'Storage')
      window.api[`save${key.charAt(0).toUpperCase() + key.slice(1)}`](JSON.stringify(data)) // Salva os dados
    }
  }

  // Métodos auxiliares para adicionar e remover dados
  static addToStorage(storageKey, message, change, count) {
    let storage = this.getStorage(storageKey)
    storage.push(change)
    store.commit('ADD_ITEM', { storageKey, storage, count })

    notification.success(message)
    this.updateDiaryRoutine()
    this.saveSystem()
  }

  static deleteFromStorage(storageKey, message, change, count) {
    let storage = this.getStorage(storageKey)
    storage.splice(change, 1)
    store.commit('REMOVE_ITEM', { storageKey, storage, count })

    notification.success(message)
    this.updateDiaryRoutine()
    this.saveSystem()
  }
  static editFromStorage(storageKey, message, change) {
    store.commit('EDIT_ITEM', { storageKey, change })
    notification.success(message)
    this.updateDiaryRoutine()
    this.saveSystem()
  }
}

export default SystemController
