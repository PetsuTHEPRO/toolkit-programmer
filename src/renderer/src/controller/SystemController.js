import store from '../stores/sistema'
import notification from '../service/notificationService'

class SystemController {
  static updateSystem() {
    let systemInfo = window.api.loadSystemInfo()
    let links = window.api.loadLinks()
    let fonts = window.api.loadFonts()
    let frameworks = window.api.loadFrameworks()
    let images = window.api.loadImages()
    let palettes = window.api.loadPalettes()

    const data = JSON.parse(systemInfo)
    store.commit('SET_COLOR_COUNT', data.colorCount)
    store.commit('SET_LINK_COUNT', data.linkCount)
    store.commit('SET_FONT_COUNT', data.fontCount)
    store.commit('SET_LOG', data.log)
    store.commit('SET_LINKS_STORAGE', JSON.parse(links))
    store.commit('SET_FONTS_STORAGE', JSON.parse(fonts))
    store.commit('SET_FRAMEWORKS_STORAGE', JSON.parse(frameworks))
    store.commit('SET_IMAGES_STORAGE', JSON.parse(images))
    store.commit('SET_PALETTES_STORAGE', JSON.parse(palettes))
    this.saveSystem()
  }

  static updateColor(change) {
    const data = JSON.parse(change)
    store.commit('ADD_COLOR_COUNT', { type: 'color', data })
    notification.success('Cor adicionada com sucesso!')
    this.saveSystem()
  }

  static addLink(change) {
    let linksStorage = store.getters['getLinksStorage']
    linksStorage.push(change)
    store.commit('ADD_LINK', linksStorage)
    notification.success('Link adicionado com sucesso!')
    this.saveSystem()
  }
  static deleteLink(change) {
    let linksStorage = store.getters['getLinksStorage']
    linksStorage.splice(change, 1)
    store.commit('REMOVE_LINK', linksStorage)
    notification.success('Link removido com sucesso!')
    this.saveSystem()
  }
  static addFont(change) {
    let fontsStorage = store.getters['getFontsStorage']
    fontsStorage.push(change)
    store.commit('ADD_FONT', fontsStorage)
    notification.success('Fonte adicionada com sucesso!')
    this.saveSystem()
  }
  static deleteFont(change) {
    let fontsStorage = store.getters['getFontsStorage']
    fontsStorage.splice(change, 1)
    store.commit('REMOVE_FONT', fontsStorage)
    notification.success('Fonte removida com sucesso!')
    this.saveSystem()
  }
  static addFramework(change) {
    let frameworksStorage = store.getters['getFrameworksStorage']
    frameworksStorage.push(change)
    store.commit('ADD_FRAMEWORK', frameworksStorage)
    notification.success('Framework adicionado com sucesso!')
    this.saveSystem()
  }
  static deleteFramework(change) {
    let frameworksStorage = store.getters['getFrameworksStorage']
    frameworksStorage.splice(change, 1)
    store.commit('REMOVE_FRAMEWORK', frameworksStorage)
    notification.success('Framework removido com sucesso!')
    this.saveSystem()
  }
  static addImage(change) {
    let imagesStorage = store.getters['getImagesStorage']
    imagesStorage.push(change)
    store.commit('ADD_IMAGE', imagesStorage)
    notification.success('Imagem adicionada com sucesso!')
    this.saveSystem()
  }
  static deleteImage(change) {
    let imagesStorage = store.getters['getImagesStorage']
    imagesStorage.splice(change, 1)
    store.commit('REMOVE_IMAGE', imagesStorage)
    notification.success('Imagem removida com sucesso!')
    this.saveSystem()
  }

  static addPalette(change) {
    let palettesStorage = store.getters['getPalettesStorage']
    let count = change.colors.length
    palettesStorage.push(change)
    store.commit('ADD_PALETTE', { palettesStorage, count })
    notification.success('Paleta adicionada com sucesso!')
    this.saveSystem()
  }

  static deletePalette(change, count) {
    let palettesStorage = store.getters['getPalettesStorage']
    palettesStorage.splice(change, 1)
    store.commit('REMOVE_PALETTE', { palettesStorage, count })
    notification.success('Paleta removida com sucesso!')
    this.saveSystem()
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

  static getPaletteStorage() {
    return store.getters['getPalettesStorage']
  }

  static getMessagesLog() {
    return store.getters['getLog']
  }

  static saveSystem() {
    let systemInfo = store.getters['getSistemaState']
    let links = store.getters['getLinksStorage']
    let fonts = store.getters['getFontsStorage']
    let frameworks = store.getters['getFrameworksStorage']
    let images = store.getters['getImagesStorage']
    let palettes = store.getters['getPalettesStorage']
    window.api.saveSystemInfo(JSON.stringify(systemInfo))
    window.api.saveLinks(JSON.stringify(links))
    window.api.saveFonts(JSON.stringify(fonts))
    window.api.saveFrameworks(JSON.stringify(frameworks))
    window.api.saveImages(JSON.stringify(images))
    window.api.savePalettes(JSON.stringify(palettes))
  }
}

export default SystemController
