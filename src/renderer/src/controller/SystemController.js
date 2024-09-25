import store from '../stores/sistema'

class SystemController {
  static updateSystem() {
    let systemInfo = window.api.loadSystemInfo()
    let links = window.api.loadLinks()
    let fonts = window.api.loadFonts()
    let frameworks = window.api.loadFrameworks()
    let images = window.api.loadImages()

    const data = JSON.parse(systemInfo)
    store.commit('SET_COLOR_COUNT', data.colorCount)
    store.commit('SET_LINK_COUNT', data.linkCount)
    store.commit('SET_FONT_COUNT', data.fontCount)
    store.commit('SET_LOG', data.log)
    store.commit('SET_LINKS_STORAGE', JSON.parse(links))
    store.commit('SET_FONTS_STORAGE', JSON.parse(fonts))
    store.commit('SET_FRAMEWORKS_STORAGE', JSON.parse(frameworks))
    store.commit('SET_IMAGES_STORAGE', JSON.parse(images))
    this.saveSystem()
  }

  static updateColor(change) {
    const data = JSON.parse(change)
    store.commit('ADD_COLOR_COUNT', { type: 'color', data })
    this.saveSystem()
  }

  static addLink(change) {
    let linksStorage = store.getters['getLinksStorage']
    linksStorage.push(change)
    store.commit('ADD_LINK', linksStorage)
    this.saveSystem()
  }
  static deleteLink(change) {
    let linksStorage = store.getters['getLinksStorage']
    linksStorage.splice(change, 1)
    store.commit('REMOVE_LINK', linksStorage)
    this.saveSystem()
  }
  static addFont(change) {
    let fontsStorage = store.getters['getFontsStorage']
    fontsStorage.push(change)
    store.commit('ADD_FONT', fontsStorage)
    this.saveSystem()
  }
  static deleteFont(change) {
    let fontsStorage = store.getters['getFontsStorage']
    fontsStorage.splice(change, 1)
    store.commit('REMOVE_FONT', fontsStorage)
    this.saveSystem()
  }
  static addFramework(change) {
    let frameworksStorage = store.getters['getFrameworksStorage']
    frameworksStorage.push(change)
    store.commit('ADD_FRAMEWORK', frameworksStorage)
    this.saveSystem()
  }
  static deleteFramework(change) {
    let frameworksStorage = store.getters['getFrameworksStorage']
    frameworksStorage.splice(change, 1)
    store.commit('REMOVE_FRAMEWORK', frameworksStorage)
    this.saveSystem()
  }
  static addImage(change) {
    let imagesStorage = store.getters['getImagesStorage']
    imagesStorage.push(change)
    store.commit('ADD_IMAGE', imagesStorage)
    this.saveSystem()
  }
  static deleteImage(change) {
    let imagesStorage = store.getters['getImagesStorage']
    imagesStorage.splice(change, 1)
    store.commit('REMOVE_IMAGE', imagesStorage)
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

  static getMessagesLog() {
    return store.getters['getLog']
  }

  static saveSystem() {
    let systemInfo = store.getters['getSistemaState']
    let links = store.getters['getLinksStorage']
    let fonts = store.getters['getFontsStorage']
    let frameworks = store.getters['getFrameworksStorage']
    let images = store.getters['getImagesStorage']
    window.api.saveSystemInfo(JSON.stringify(systemInfo))
    window.api.saveLinks(JSON.stringify(links))
    window.api.saveFonts(JSON.stringify(fonts))
    window.api.saveFrameworks(JSON.stringify(frameworks))
    window.api.saveImages(JSON.stringify(images))
  }
}

export default SystemController
