// src/utils/userPreferences.js

// Valores padrão
const DEFAULT_PREFERENCES = {
  aiModel: 'llama',
  theme: 'dark',
  language: 'pt',
  name: ''
  // Adicione outros campos conforme necessário
}

// Inicializa as preferências se não existirem
const initializePreferences = () => {
  if (!localStorage.getItem('userPreferences')) {
    localStorage.setItem('userPreferences', JSON.stringify(DEFAULT_PREFERENCES))
  }
}

// Obtém todas as preferências
const getPreferences = () => {
  initializePreferences()
  return JSON.parse(localStorage.getItem('userPreferences'))
}

// Obtém um valor específico
const getPreference = (key) => {
  const preferences = getPreferences()
  return preferences[key] || DEFAULT_PREFERENCES[key]
}

// Atualiza uma ou várias preferências
const updatePreferences = (updates) => {
  const currentPreferences = getPreferences()
  const newPreferences = { ...currentPreferences, ...updates }
  localStorage.setItem('userPreferences', JSON.stringify(newPreferences))
  return newPreferences
}

// Redefine todas as preferências para os valores padrão
const resetPreferences = () => {
  localStorage.setItem('userPreferences', JSON.stringify(DEFAULT_PREFERENCES))
  return DEFAULT_PREFERENCES
}

// Remove todas as preferências
const clearPreferences = () => {
  localStorage.removeItem('userPreferences')
}

// Métodos específicos para cada preferência
const getAIModel = () => getPreference('aiModel')
const setAIModel = (model) => updatePreferences({ aiModel: model })

const getTheme = () => getPreference('theme')
const setTheme = (theme) => updatePreferences({ theme })

const getLanguage = () => getPreference('language')
const setLanguage = (language) => updatePreferences({ language })

const getName = () => getPreference('name')
const setName = (name) => updatePreferences({ name })

export {
  getPreferences,
  getPreference,
  updatePreferences,
  resetPreferences,
  clearPreferences,
  getAIModel,
  setAIModel,
  getTheme,
  setTheme,
  getLanguage,
  setLanguage,
  getName,
  setName,
  DEFAULT_PREFERENCES
}
