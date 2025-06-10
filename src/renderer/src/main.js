import './assets/base.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'boxicons/css/boxicons.min.css'

import App from './App.vue'
import router from '@renderer/router'
import store from '@renderer/stores/sistema'
import Toast from 'vue-toastification'
import ptMsg from '@renderer/assets/locales/pt.json'
import enMsg from '@renderer/assets/locales/en.json'
import esMsg from '@renderer/assets/locales/es.json'

import { getLanguage } from '@renderer/service/userPreferences'

// --- CONFIGURAÇÃO DO PDF.JS WORKER ---
// Importamos a configuração global da biblioteca pdfjs-dist (que vue-pdf usa por baixo dos panos)
import { GlobalWorkerOptions } from 'pdfjs-dist/build/pdf'

// Dizemos a ela para carregar o worker a partir da sua localização em node_modules.
// O Vite vai entender isso e empacotar o worker corretamente.
GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs', // Usamos a versão .mjs para compatibilidade com Vite
  import.meta.url
).toString()
// --- FIM DA CONFIGURAÇÃO ---

// Import the CSS or use your own!
import 'vue-toastification/dist/index.css'
const i18n = createI18n({
  legacy: false, // Usar Composition API
  locale: getLanguage() || 'pt',
  fallbackLocale: 'pt',
  messages: {
    pt: ptMsg,
    en: enMsg,
    es: esMsg
  }
})

// Configuração do CDN (use a versão mais recente do Monaco)

i18n.global.t('messages.she-log', { action: 'adicionada' })

const app = createApp(App)

app.use(i18n)
app.use(createPinia())
app.use(Toast)
app.use(router)
app.use(store)

app.mount('#app')
