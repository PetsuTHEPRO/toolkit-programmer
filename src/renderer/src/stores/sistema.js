import { createStore } from 'vuex'

const store = createStore({
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
    algorithmsStorage: [],
    imagesStorage: [],
    iconsStorage: [],
    palettesStorage: []
  },
  mutations: {
    RESET_CALENDAR(state, month) {
      state.currentMonth = month
      state.dailyRoutine = {}
    },

    // Função genérica para adicionar item
    ADD_ITEM(state, { storageKey, items, countKey }) {
      state.storageKey = items
      if (countKey) {
        state[countKey] += 1
      }

      const type = storageKey.replace('sStorage', '').toUpperCase()
      const genderMale = type == 'FONT' || type == 'IMAGE' || type == 'PALETTE' ? true : false
      this.commit('ADD_LOG_MESSAGE', {
        type: type,
        description: `${genderMale ? 'Uma' : 'Um'} ${type.toLowerCase()} foi adicionad${genderMale ? 'a' : 'o'} com sucesso.`
      })
    },

    // Função genérica para remover item
    REMOVE_ITEM(state, { storageKey, items, countKey }) {
      state.storageKey = items
      if (countKey) {
        state[countKey] -= 1
      }
      const type = storageKey.replace('sStorage', '').toUpperCase()
      const genderMale = type == 'FONT' || type == 'IMAGE' || type == 'PALETTE' ? true : false
      this.commit('ADD_LOG_MESSAGE', {
        type: type,
        description: `${genderMale ? 'Uma' : 'Um'} ${type.toLowerCase()} foi removid${genderMale ? 'a' : 'o'} com sucesso.`
      })
    },

    EDIT_ITEM(state, { storageKey, change }) {
      for (let index = 0; index < state[storageKey].length; index++) {
        if (index === change.id) {
          state[storageKey][index] = { ...state[storageKey][index], ...change }
          break
        }
      }
      this.commit('ADD_LOG_MESSAGE', {
        type: storageKey.toUpperCase(),
        description: `Um item foi editado com sucesso.`
      })
    },

    // Função genérica para adicionar mensagens de log
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
      state.submenus[submenu] = !state.submenus[submenu]
    },

    SET_SIDEBAR(state, isOpen) {
      state.sidebarOpen = isOpen
    },

    SET_SUBMENU(state, { submenu, isOpen }) {
      state.submenus[submenu] = isOpen
    },
    SET_STATE_PROPERTY(state, { key, value }) {
      state[key] = value
    }
  },

  actions: {
    updateCount({ commit }, { count, key }) {
      commit('SET_COUNT', { count, key })
    },

    updateStateProperty({ commit }, { key, value }) {
      commit('SET_STATE_PROPERTY', { key, value });
    },

    addItem({ commit }, payload) {
      commit('ADD_ITEM', payload)
    },

    removeItem({ commit }, payload) {
      commit('REMOVE_ITEM', payload)
    },

    editItem({ commit }, payload) {
      commit('EDIT_ITEM', payload)
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
    getSistemaState: (state) => {
      return {
        colorCount: state.colorCount,
        linkCount: state.linkCount,
        fontCount: state.fontCount,
        log: state.log,
        dailyRoutine: state.dailyRoutine,
        currentMonth: state.currentMonth
      }
    },
    getDiaryRoutine: (state) => state.dailyRoutine,
    getStorage: (state) => (storageKey) => state[storageKey],
    isSidebarOpen: (state) => state.sidebarOpen,
    isSubmenuOpen: (state) => (submenu) => state.submenus[submenu]
  }
})

export default store
