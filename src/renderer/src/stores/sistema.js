import { createStore } from 'vuex'

const store = createStore({
  // store/modules/sistema.js
  state: {
    sidebarOpen: true,
    submenus: {
      Resources: false,
      Developers: false,
      Learn: false
    },
    colorCount: 0,
    linkCount: 0,
    fontCount: 0,
    log: [],
    dailyRoutine: {},
    currentMonth: 0,
    linksStorage: [],
    fontsStorage: [],
    frameworksStorage: [],
    imagesStorage: [],
    palettesStorage: []
  },
  mutations: {
    RESET_CALENDAR(state, month) {
      state.currentMonth = month
      state.dailyRoutine = {}
    },
    ADD_LINK(state, links) {
      state.linkCount += 1
      state.linksStorage = links
      // Cria uma mensagem de log
      const logEntry = {
        type: 'LINK', // Tipo de log, por exemplo, 'COR'
        description: `Um link foi adicionado com sucesso. Total de links: [${state.linkCount}].`
      }

      // Adiciona a mensagem ao log
      this.commit('ADD_LOG_MESSAGE', logEntry)
    },
    REMOVE_LINK(state, links) {
      state.linkCount -= 1
      state.linksStorage = links

      const logEntry = {
        type: 'LINK', // Tipo de log, por exemplo, 'COR'
        description: `Um link foi removido com sucesso. Total de links: [${state.linkCount}].`
      }
      this.commit('ADD_LOG_MESSAGE', logEntry)
    },
    ADD_FONT(state, fonts) {
      state.fontCount += 1
      state.fontsStorage = fonts
      // Cria uma mensagem de log
      const logEntry = {
        type: 'FONTE',
        description: `Uma fonte foi adicionado com sucesso. Total de fonts: [${state.fontCount}].`
      }

      this.commit('ADD_LOG_MESSAGE', logEntry)
    },
    REMOVE_FONT(state, fonts) {
      state.fontCount -= 1
      state.fontsStorage = fonts

      const logEntry = {
        type: 'FONTE', // Tipo de log, por exemplo, 'COR'
        description: `Uma fonte foi removida com sucesso. Total de fonts: [${state.fontCount}].`
      }
      this.commit('ADD_LOG_MESSAGE', logEntry)
    },
    ADD_FRAMEWORK(state, frameworks) {
      state.frameworksStorage = frameworks
      // Cria uma mensagem de log
      const logEntry = {
        type: 'FRAMEWORK',
        description: `Uma framework foi adicionado com sucesso.`
      }

      this.commit('ADD_LOG_MESSAGE', logEntry)
    },
    REMOVE_FRAMEWORK(state, frameworks) {
      state.frameworksStorage = frameworks

      const logEntry = {
        type: 'FRAMEWORK', // Tipo de log, por exemplo, 'COR'
        description: `Um framework foi removido com sucesso.`
      }
      this.commit('ADD_LOG_MESSAGE', logEntry)
    },
    ADD_IMAGE(state, images) {
      state.imagesStorage = images
      // Cria uma mensagem de log
      const logEntry = {
        type: 'IMAGEM',
        description: `Uma imagem foi adicionada com sucesso.`
      }

      this.commit('ADD_LOG_MESSAGE', logEntry)
    },
    REMOVE_IMAGE(state, images) {
      state.imagesStorage = images

      const logEntry = {
        type: 'IMAGEM', // Tipo de log, por exemplo, 'COR'
        description: `Uma imagem foi removida com sucesso.`
      }
      this.commit('ADD_LOG_MESSAGE', logEntry)
    },
    ADD_PALETTE(state, payload) {
      state.colorCount += payload.count
      state.palettesStorage = payload.palettesStorage
      
      const logEntry = {
        type: 'COR', // Tipo de log, por exemplo, 'COR'
        description: `Uma paleta foi adicionada com sucesso! Com ${payload.count} cores adicionadas.`
      }
      this.commit('ADD_LOG_MESSAGE', logEntry)
    },
    REMOVE_PALETTE(state, payload) {
      state.colorCount -= payload.count
      state.palettesStorage = payload.palettesStorage

      const logEntry = {
        type: 'COR', // Tipo de log, por exemplo, 'COR'
        description: `Uma paleta foi removida com sucesso!  Com ${payload.count} cores removidas.`
      }
      this.commit('ADD_LOG_MESSAGE', logEntry)
    },
    CLEAR_LOG(state){
      state.log = []
    },
    SET_COLOR_COUNT(state, count) {
      state.colorCount = count
    },
    SET_LINK_COUNT(state, count) {
      state.linkCount = count
    },
    SET_FONT_COUNT(state, count) {
      state.fontCount = count
    },
    SET_LINKS_STORAGE(state, links) {
      state.linksStorage = links
    },
    SET_FONTS_STORAGE(state, fonts) {
      state.fontsStorage = fonts
    },
    SET_FRAMEWORKS_STORAGE(state, frameworks) {
      state.frameworksStorage = frameworks
    },
    SET_IMAGES_STORAGE(state, images) {
      state.imagesStorage = images
    },
    SET_PALETTES_STORAGE(state, palettes) {
      state.palettesStorage = palettes
    },
    SET_LOG(state, log) {
      state.log = log
    },
    SET_DIARY_ROUTINE(state, routine) {
      state.dailyRoutine = routine
    },
    ADD_LOG_MESSAGE(state, { type, description }) {
      const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ') // Formato YYYY-MM-DD HH:mm:ss
      const logEntry = { timestamp, type, description }

      state.log.unshift(logEntry)
      if (state.log.length > 20) {
        state.log.pop()
      }
    },
    TOGGLE_SIDEBAR(state) {
      state.sidebarOpen = !state.sidebarOpen
    },
    TOGGLE_SUBMENU(state, submenu) {
      state.submenus[submenu] = !state.submenus[submenu]
    },
    SET_SIDEBAR(state, isOpen) {
      state.sidebarOpen = isOpen
    },
    SET_SUBMENU(state, { submenu, isOpen }) {
      state.submenus[submenu] = isOpen
    }
  },
  actions: {
    updateColorCount({ commit }, count) {
      commit('SET_COLOR_COUNT', count)
    },
    updateLinkCount({ commit }, count) {
      commit('SET_LINK_COUNT', count)
    },
    updateFontCount({ commit }, count) {
      commit('SET_FONT_COUNT', count)
    },
    update({ commit }, log) {
      commit('SET_LOG', log)
    },
    addLogMessage({ commit }, { type, description }) {
      commit('ADD_LOG_MESSAGE', { type, description })
    },
    toggleSidebar({ commit }) {
      commit('TOGGLE_SIDEBAR')
    },
    toggleSubmenu({ commit }, submenu) {
      commit('TOGGLE_SUBMENU', submenu)
    }
  },
  getters: {
    getColorCount: (state) => state.colorCount,
    getLinkCount: (state) => state.linkCount,
    getFontCount: (state) => state.fontCount,
    getLog: (state) => state.log,
    getDiaryRoutine: (state) => state.dailyRoutine,
    getSistemaState: (state) => {
      return {
        colorCount: state.colorCount,
        linkCount: state.linkCount,
        fontCount: state.fontCount,
        log: state.log,
        routineDaily: state.dailyRoutine,
        currentMonth: state.currentMonth
      }
    },
    getLinksStorage: (state) => state.linksStorage,
    getFontsStorage: (state) => state.fontsStorage,
    getFrameworksStorage: (state) => state.frameworksStorage,
    getImagesStorage: (state) => state.imagesStorage,
    getPalettesStorage: (state) => state.palettesStorage,
    getCurrentCalendar: (state) => state.currentMonth,
    isSidebarOpen: state => state.sidebarOpen,
    isSubmenuOpen: state => submenu => state.submenus[submenu]
  }
})

export default store
