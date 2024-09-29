import store from '../stores/sistema'
import notification from '../service/notificationService'

class SystemController {
  static updateSystem() {
    let systemInfo = window.api.loadSystemInfo()
    let links = window.api.loadLinks()
    let fonts = window.api.loadFonts()
    let frameworks = window.api.loadFrameworks()
    let images = window.api.loadImages()
    let icons = window.api.loadIcons()
    let palettes = window.api.loadPalettes()

    const data = JSON.parse(systemInfo)
    store.commit('SET_COLOR_COUNT', data.colorCount)
    store.commit('SET_LINK_COUNT', data.linkCount)
    store.commit('SET_FONT_COUNT', data.fontCount)
    store.commit('SET_LOG', data.log)
    store.commit('SET_DIARY_ROUTINE', data.routineDaily)
    store.commit('SET_LINKS_STORAGE', JSON.parse(links))
    store.commit('SET_FONTS_STORAGE', JSON.parse(fonts))
    store.commit('SET_FRAMEWORKS_STORAGE', JSON.parse(frameworks))
    store.commit('SET_IMAGES_STORAGE', JSON.parse(images))
    store.commit('SET_ICONS_STORAGE', JSON.parse(icons))
    store.commit('SET_PALETTES_STORAGE', JSON.parse(palettes))
    this.saveSystem()
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
    let dailyRoutine = store.getters['getDiaryRoutine']

    dailyRoutine[day] = (dailyRoutine[day] || 0) + 1

    store.commit('SET_DIARY_ROUTINE', dailyRoutine)
    this.saveSystem()
  }

  static addLink(change) {
    this.addToStorage('ADD_LINK', 'Link adicionado com sucesso!', change)
  }

  static deleteLink(index) {
    this.deleteFromStorage('REMOVE_LINK', 'Link removido com sucesso!', index)
  }

  static addFont(change) {
    this.addToStorage('ADD_FONT', 'Fonte adicionada com sucesso!', change)
  }

  static deleteFont(index) {
    this.deleteFromStorage('REMOVE_FONT', 'Fonte removida com sucesso!', index)
  }

  static addFramework(change) {
    this.addToStorage('ADD_FRAMEWORK', 'Framework adicionado com sucesso!', change)
  }

  static deleteFramework(index) {
    this.deleteFromStorage('REMOVE_FRAMEWORK', 'Framework removido com sucesso!', index)
  }

  static addImage(change) {
    this.addToStorage('ADD_IMAGE', 'Imagem adicionada com sucesso!', change)
  }

  static deleteImage(index) {
    this.deleteFromStorage('REMOVE_IMAGE', 'Imagem removida com sucesso!', index)
  }

  static addIcon(change) {
    this.addToStorage('ADD_ICON', 'Ícone adicionado com sucesso!', change)
  }

  static deleteIcon(index) {
    this.deleteFromStorage('REMOVE_ICON', 'Ícone removido com sucesso!', index)
  }

  static addPalette(change) {
    let palettesStorage = store.getters['getPalettesStorage']
    let count = change.colors.length
    palettesStorage.push(change)
    store.commit('ADD_PALETTE', { palettesStorage, count })
    notification.success('Paleta adicionada com sucesso!')
    this.updateDiaryRoutine()
    this.saveSystem()
  }

  static deletePalette(index) {
    this.deleteFromStorage('REMOVE_PALETTE', 'Paleta removida com sucesso!', index)
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

  static getLinkStorage() {
    return store.getters['getLinksStorage']
  }

  static getFontStorage() {
    return store.getters['getFontsStorage']
  }

  static getFrameworkStorage() {
    return store.getters['getFrameworksStorage']
  }

  static getImageStorage() {
    return store.getters['getImagesStorage']
  }

  static getIconStorage() {
    return store.getters['getIconsStorage']
  }

  static getPaletteStorage() {
    return store.getters['getPalettesStorage']
  }

  static getMessagesLog() {
    return store.getters['getLog']
  }

  static getDiaryRoutine() {
    return store.getters['getDiaryRoutine']
  }

  static saveSystem() {
    let systemInfo = store.getters['getSistemaState']
    let links = store.getters['getLinksStorage']
    let fonts = store.getters['getFontsStorage']
    let frameworks = store.getters['getFrameworksStorage']
    let images = store.getters['getImagesStorage']
    let icons = store.getters['getIconsStorage']
    let palettes = store.getters['getPalettesStorage']

    window.api.saveSystemInfo(JSON.stringify(systemInfo))
    window.api.saveLinks(JSON.stringify(links))
    window.api.saveFonts(JSON.stringify(fonts))
    window.api.saveFrameworks(JSON.stringify(frameworks))
    window.api.saveImages(JSON.stringify(images))
    window.api.saveIcons(JSON.stringify(icons))
    window.api.savePalettes(JSON.stringify(palettes))
  }

  // Métodos auxiliares para adicionar e remover dados
  static addToStorage(mutation, message, change) {
    let getMutation =
      mutation.replace('ADD_', '').charAt(0).toUpperCase() +
      mutation.replace('ADD_', '').slice(1).toLowerCase()
    let storage = store.getters[`get${getMutation}sStorage`]
    storage.push(change)
    store.commit(mutation, storage)

    notification.success(message)
    this.updateDiaryRoutine()
    this.saveSystem()
  }

  static deleteFromStorage(mutation, message, index) {
    let getMutation =
      mutation.replace('REMOVE_', '').charAt(0).toUpperCase() +
      mutation.replace('REMOVE_', '').slice(1).toLowerCase()

    let storage = store.getters[`get${getMutation}sStorage`]
    storage.splice(index, 1)
    store.commit(mutation, storage)

    notification.success(message)
    this.updateDiaryRoutine()
    this.saveSystem()
  }
}

export default SystemController
