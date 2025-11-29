// src/main/service/ia-servicos.js
import { ipcMain } from 'electron'
import fileManager from '../../../renderer/src/service/gerenciadorArquivo'

import OpenAI from 'openai'

export default class IAServico {
  constructor() {
    this.API_KEY = process.env.OPENROUTER_API_KEY ? process.env.OPENROUTER_API_KEY : ''

    // Configuração inicial padrão
    this.currentModel = 'openai/gpt-oss-20b:free'
    this.initializeOpenAIClient()

    // Mapeamento de modelos disponíveis
    ;(this.availableModels = {
      llama: 'meta-llama/llama-4-scout:free',
      deepseek: 'deepseek/deepseek-chat-v3-0324:free',
      qwen: 'qwen/qwen2.5-vl-3b-instruct:free',
      gpt: 'nvidia/llama-3.1-nemotron-ultra-253b-v1:free',
      gemini: 'google/gemini-2.0-flash-exp:free',
      deephermes: 'nousresearch/deephermes-3-mistral-24b-preview:free'
    })
  }

  // Cria o objeto da OpenAI
  initializeOpenAIClient() {
    this.openai = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: this.API_KEY
    })
  }

  /**
   * Define o modelo de IA a ser usado
   * @param {string} modelName - Nome do modelo (ex: 'gpt-4', 'llama')
   */
  setModel(modelName) {
    if (this.availableModels[modelName]) {
      this.currentModel = this.availableModels[modelName]
      return true
    }
    return false
  }

  setCurrentKey(apiKey) {
    this.API_KEY = apiKey
    this.initializeOpenAIClient()
  }

  /**
   * Obtém a lista de modelos disponíveis
   * @returns {Object} - Dicionário de modelos disponíveis
   */
  getAvailableModels() {
    return this.availableModels
  }

  /**
   * Executa a consulta à IA com o modelo atual
   * @param {string} message - Mensagem do usuário
   * @param {string} [customModel] - Modelo opcional para esta chamada específica
   * @returns {Promise<string>} - Resposta da IA
   */
  async askAI(message, customModel = null) {
    try {
      const modelToUse = this.availableModels[customModel] || this.currentModel

      const chat = await this.openai.chat.completions.create({
        messages: [{ role: 'user', content: message }],
        model: modelToUse
      })

      return this.processResponse(chat)
    } catch (err) {
      // 1. Loga o erro completo no console do terminal para depuração profunda.
      console.error('Erro na chamada da IA:', err)

      // 2. Define valores padrão para a mensagem e o nível do erro.
      let errorMessage = `❌ Ocorreu um erro desconhecido: ${err.message || 'Verifique os logs do aplicativo.'}`
      let errorLevel = 'ERROR'

      // 3. Lógica para determinar a mensagem e o nível de erro específicos.
      if (err.error) {
        // Erros da API OpenRouter
        const status = err.error.code
        const errorData = err.error
        switch (status) {
          case 400:
            errorMessage = `❌ Erro 400: Solicitação inválida - ${errorData.error?.message || 'Verifique os parâmetros.'}`
            break
          case 401:
            errorMessage = '🔑 Erro 401: Não autorizado - Verifique sua API_KEY do OpenRouter.'
            break
          case 402:
            errorMessage =
              '💳 Erro 402: Pagamento necessário - Você pode ter excedido seu limite gratuito.'
            break
          case 403:
            errorMessage = '🚫 Erro 403: Proibido - Seu acesso a este modelo foi negado.'
            break
          case 404:
            errorMessage = '🔍 Erro 404: Modelo não encontrado - Verifique o nome do modelo.'
            break
          case 429:
            errorMessage = `🐌 Erro 429: Muitas requisições - Tente novamente mais tarde.`
            break
          case 500:
          case 503:
            errorMessage = `⚙️ Erro ${status}: Problema no servidor OpenRouter. O serviço pode estar temporariamente indisponível.`
            break
          default:
            errorMessage = `❌ Erro ${status}: ${errorData.error?.message || 'Erro desconhecido na API.'}`
        }
      } else if (err.code === 'ENOTFOUND' || err.code === 'ECONNABORTED') {
        errorMessage =
          '🌐 Erro de conexão: Verifique sua internet ou o OpenRouter pode estar offline.'
      } else if (err.message && err.message.includes('API_KEY')) {
        errorMessage = '🔐 Erro de autenticação: API_KEY inválida ou não configurada.'
      } else if (err.name === 'AbortError') {
        errorMessage = '⏰ Erro: Timeout - A requisição demorou muito para responder.'
      }

      // 4. Salva o log no banco de dados com a mensagem e o nível corretos.
      fileManager.addLog(errorLevel, 'AI_SERVICE', errorMessage)

      // 5. Retorna a mensagem de erro específica para ser exibida na interface.
      return errorMessage
    }
  }

  // Novo método para processar resposta
  processResponse(chat) {
    const resposta = chat?.choices?.[0]?.message?.content
    if (!resposta) return '❌ Resposta vazia da IA'

    return resposta
      .replace(/◁think▷[\s\S]*?◁\/think▷/g, '')
      .replace(/<think>[\s\S]*?<\/think>/g, '')
  }

  registerHandlers() {
    // Handler para perguntas com modelo padrão
    ipcMain.handle('ask-ai', async (event, message) => {
      return this.askAI(message)
    })

    // Handler para perguntas com modelo específico
    ipcMain.handle('ask-ai-with-model', async (event, { message, model, mode }) => {
      return this.askAI(message, model, mode)
    })

    // Handler para listar modelos disponíveis
    ipcMain.handle('get-ai-models', async () => {
      return this.getAvailableModels()
    })

    // Handler para alterar o modelo padrão
    ipcMain.handle('set-ai-model', async (event, modelName) => {
      return this.setModel(modelName)
    })

    ipcMain.handle('set-current-key', async (event, apiKey) => {
      this.setCurrentKey(apiKey)
      return true
    })
  }
}
