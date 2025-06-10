import { createStore } from 'vuex'

const store = createStore({
  state: {
    // Estado da UI
    sidebarOpen: true,
    submenus: {
      Resources: false,
      Developers: false,
      Learn: false
    },

    // Estado de configurações e logs
    log: [],
    dailyRoutine: {},
    currentMonth: 0,

    // Arrays de dados (cache do banco de dados)
    linksStorage: [],
    fontsStorage: [],
    frameworksStorage: [],
    apisStorage: [],
    videosStorage: [],
    algorithmsStorage: [],
    imagesStorage: [],
    iconsStorage: [],
    palettesStorage: [],
    articlesStorage: []
  },
  mutations: {
    /**
     * Mutação genérica e central para definir qualquer propriedade no estado.
     * É a única forma de atualizar os arrays de dados com informações do backend.
     */
    SET_STATE_PROPERTY(state, { key, value }) {
      if (Object.prototype.hasOwnProperty.call(state, key)) {
        state[key] = value
      } else {
        console.warn(`[Vuex] Tentativa de definir uma propriedade de estado inexistente: ${key}`)
      }
    },

    // --- Mutações de UI e Logs (específicas do cliente) ---

    RESET_CALENDAR(state, month) {
      state.currentMonth = month
      state.dailyRoutine = {}
    },

    ADD_LOG_MESSAGE(state, { type, description }) {
      const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ')
      const logEntry = { timestamp, type, description }
      state.log.unshift(logEntry)
      if (state.log.length > 20) {
        state.log.pop()
      }
    },

    CLEAR_LOG(state) {
      state.log = []
    },

    TOGGLE_SIDEBAR(state) {
      state.sidebarOpen = !state.sidebarOpen
    },

    TOGGLE_SUBMENU(state, submenu) {
      for (let key in state.submenus) {
        if (key !== submenu) {
          state.submenus[key] = false
        } else {
          state.submenus[submenu] = !state.submenus[submenu]
        }
      }
    },

    SET_SIDEBAR(state, isOpen) {
      state.sidebarOpen = isOpen
    },

    SET_SUBMENU(state, { submenu, isOpen }) {
      state.submenus[submenu] = isOpen
    }
  },
  actions: {
    // Ações agora são focadas em UI ou lógicas assíncronas que não envolvem o CRUD principal.
    // A lógica de CRUD foi movida para o SystemController para melhor organização.
    toggleSidebar({ commit }) {
      commit('TOGGLE_SIDEBAR')
    },

    toggleSubmenu({ commit }, submenu) {
      commit('TOGGLE_SUBMENU', submenu)
    },

    addLogMessage({ commit }, { type, description }) {
      commit('ADD_LOG_MESSAGE', { type, description })
    }
  },
  getters: {
    // Getters de contagem são calculados a partir do estado, garantindo consistência.
    getColorCount: (state) =>
      state.palettesStorage.reduce(
        (sum, palette) => sum + (Array.isArray(palette.colors) ? palette.colors.length : 0),
        0
      ),
    getLinkCount: (state) => state.linksStorage.length,
    getFontCount: (state) => state.fontsStorage.length,

    // Getters de dados e UI
    getLog: (state) => state.log,
    getDiaryRoutine: (state) => state.dailyRoutine,
    getCurrentCalendar: (state) => state.currentMonth,
    getStorage: (state) => (storageKey) => state[storageKey],
    isSidebarOpen: (state) => state.sidebarOpen,
    isSubmenuOpen: (state) => (submenu) => state.submenus[submenu]
  }
})

export default store
