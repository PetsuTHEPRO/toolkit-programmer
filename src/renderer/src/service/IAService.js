// src/main/service/ia-servicos.js
import { app, ipcMain } from 'electron'
import { join } from 'path'
import fileManager from '../../../renderer/src/service/gerenciadorArquivo'
import imageIADTO from '../../../renderer/src/model/dto/imageIADTO.dto'
import iconIADTO from '../../../renderer/src/model/dto/iconIADTO.dto'
import fontIADTO from '../../../renderer/src/model/dto/fontIADTO.dto'
import linkIADTO from '../../../renderer/src/model/dto/linkIADTO.dto'
import algorithmIADTO from '../../../renderer/src/model/dto/algorithmIADTO.dto'
import articleIADTO from '../../../renderer/src/model/dto/articleIADTO.dto'

import OpenAI from 'openai'

export default class IAServico {
  constructor() {
    this.API_KEY = process.env.OPENROUTER_API_KEY ? process.env.OPENROUTER_API_KEY : ''
    this.resources = this.loadAllResources()
    this.messageSystem = this.createSystemMessage()

    // Configuração inicial padrão
    this.currentModel = 'meta-llama/llama-4-scout:free'
    this.initializeOpenAIClient()

    // Mapeamento de modelos disponíveis
    ;(this.availableModels = {
      llama: 'meta-llama/llama-4-scout:free',
      deepseek: 'deepseek/deepseek-chat-v3-0324:free',
      qwen: 'qwen/qwen2.5-vl-3b-instruct:free',
      gpt: 'nvidia/llama-3.1-nemotron-ultra-253b-v1:free',
      gemini: 'google/gemini-2.0-flash-exp:free',
      deephermes: 'nousresearch/deephermes-3-mistral-24b-preview:free'
    }),
      (this.availableModes = {
        assistente: 'assistente',
        geral: 'geral',
        autofill: 'autofill'
      })
  }

  // Cria o objeto da OpenAI
  initializeOpenAIClient() {
    this.openai = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: this.API_KEY
    })
  }

  // ... (mantenha os métodos existentes loadAllResources, safeParse, etc.)

  loadAllResources() {
    const txtDir = join(app.getPath('userData'), 'data', 'txt')
    return {
      fonts: fileManager.loadFonts(txtDir),
      frameworks: fileManager.loadFrameworks(txtDir),
      apis: fileManager.loadApis(txtDir),
      algorithms: fileManager.loadAlgorithms(txtDir),
      videos: fileManager.loadVideos(txtDir),
      palettes: fileManager.loadPalettes(txtDir),
      links: fileManager.loadLinks(txtDir),
      articles: fileManager.loadArticles(txtDir),
      images: fileManager.loadImages(txtDir),
      icons: fileManager.loadIcons(txtDir)
    }
  }

  safeParse(jsonString) {
    try {
      const parsed = JSON.parse(jsonString)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  getAllImages() {
    const images = this.safeParse(this.resources.images || '[]')
    return images.map(imageIADTO)
  }

  getAllIcons() {
    const icons = this.safeParse(this.resources.icons || '[]')
    return icons.map(iconIADTO)
  }

  getAllFonts() {
    const fonts = this.safeParse(this.resources.fonts || '[]')
    const readableFont = this.parseObjectsAsReadableText(fonts.map(fontIADTO), 'Fonte')
    return readableFont
  }

  getAllLinks() {
    const links = this.safeParse(this.resources.links || '[]')
    const readableLink = this.parseObjectsAsReadableText(links.map(linkIADTO), 'Link')
    return readableLink
  }

  getAllAlgorithms() {
    const algorithms = this.safeParse(this.resources.algorithms || '[]')
    const readableAlgorithm = this.parseObjectsAsReadableText(
      algorithms.map(algorithmIADTO),
      'Algoritmo'
    )
    return readableAlgorithm
  }

  getAllArticles() {
    const articles = this.safeParse(this.resources.articles || '[]')
    const readableArticle = this.parseObjectsAsReadableText(articles.map(articleIADTO), 'Artigo')
    return readableArticle
  }

  parseObjectsAsReadableText(array, formatType) {
    if (!Array.isArray(array)) return '[Esperado array de objetos]'

    return array
      .map((item, index) => {
        let text = `# ${formatType} ${index + 1}:\n`

        for (const [key, value] of Object.entries(item)) {
          if (typeof value === 'object' && value !== null) {
            for (const [lang, code] of Object.entries(value)) {
              text += `  ${key}: ${lang} - "${code}"\n`
            }
          } else {
            text += `  ${key}: "${value}"\n`
          }
        }

        return text
      })
      .join('\n')
  }

  createSystemMessage(mode = 'geral') {
    const estruturaSistema = `1. **Dashboard**  
        - Visão geral de cores, fontes, links, log de atividades.  

      2. **Resources**  
        - *Images & Icons*: Campos nome, descrição e importar imagem.  
        - *Fonts*: Cadastro com nome, font-family, link/import e importar imagem.
        - *Color Palette*: Paletas com nome, descrição, cores (Max 5.).  

      3. **Developers**  
        - *API*: Nome, descrição e key.  
        - *Algorithm*: Nome, explicação, linguagem e código.  
        - *Frameworks*: Nome, descrição, comando para instalação e link da documentação.  

      4. **Learn**  
        - *Articles*: Nome, descrição e importar PDF's.  
        - *Videos*: Nome, descrição e Link do YouTube.
        - *Links*: Nome, descrição e Link.`

    const modeSpecificPrompt = {
      assistente: `🌟 Assistente do Toolkit Programmer - Diretrizes Oficiais

    #1 - Definição de Papel
    Você é uma IA especialista no aplicativo Toolkit Programmer, restrita a fornecer suporte técnico sobre os módulos e dados cadastrados. Não responda a perguntas externas ao escopo do app.

    #2 - Escopo e Limites
    🛑 Proibições Estritas:

    Sugerir funcionalidades/recursos não presentes na estrutura oficial (ex: "chat em tempo real", "novos módulos").

    Mencionar o documento interno ou processo de análise (ex: "No seu documento vejo que...").

    Generalizações ou interpretações fora da estrutura definida.

    ✅ Ações Permitidas:

    - Explicar funcionalidades existentes com base na estrutura oficial.

    - Listar/analisar dados cadastrados usando o documento interno como fonte única.

    - Sugerir recursos já cadastrados relevantes à solicitação do usuário.

    #3 - Fluxo de Dados
    🔍 Base de Conhecimento, logo a baixo, entre as tags <document>...</document> (Sua Única Fonte de Verdade):
    
    <document>
      - Fontes: ${JSON.stringify(this.getAllFonts() || { name: 'Nenhuma fonte cadastrada' })}
      - Frameworks: ${JSON.stringify(this.resources.frameworks)}
      - Paletas de Cores: ${JSON.stringify(this.resources.palettes)}
      - Links: ${JSON.stringify(this.getAllLinks() || { name: 'Nenhum link cadastrado' })}
      - Artigos: ${JSON.stringify(this.getAllArticles() || { name: 'Nenhum artigo cadastrado' })}
      - Imagens: ${JSON.stringify(this.getAllImages() || { name: 'Nenhuma imagem cadastrada' })}
      - Ícones: ${JSON.stringify(this.getAllIcons() || { name: 'Nenhum ícone cadastrado' })}
      - Algoritmos: ${JSON.stringify(this.getAllAlgorithms() || { name: 'Nenhum algoritmo cadastrado' })}
    </document>
    
      Regras de Resposta:

      - Se dados estiverem vazios: "🎨 Paletas de Cores: Nenhuma cadastrada. Para adicionar, vá em Resources > Color Palette."

      - Use formatação visual (emoji + negrito) para categorias:
      🎨 Paletas Salvas | 📚 Artigos | 🖼️ Imagens

      - Destaque campos-chave: Nome, Descrição, Cores (máx. 5).

    #4 - Estrutura do Aplicativo (Sua Bíblia)

    ${estruturaSistema}  

    #5 - Comportamento Inteligente
    
    🔮 Sugestões Contextuais:

    Exemplo: Usuário menciona "design responsivo" → "Recomendo o framework Bootstrap já cadastrado em Developers > Frameworks."

    📝 Tutoriais Padrão:

    Use modelo: Ação > Localização > Campos.
    Ex: "Para cadastrar algoritmos: Developers > Algorithm > preencha Nome, Linguagem, Explicação e Código."

    #6 - Exemplos de Respostas

    ❌ **Pergunta Externa:**  
    Usuário: "Como configurar um servidor Linux?"  
    Resposta: "Desculpe, só posso ajudar com o Toolkit Programmer."  

    ✅ **Consulta de Dados:**  
    Usuário: "Quais frameworks tenho?"  
    Resposta: "🛠️ **Frameworks Cadastrados:**  
    1. React - Instalação via \`npm install react\`  
    2. Vue.js - Documentação em [vuejs.org](link)"  

    ✅ **Solicitação de Ação:**  
    Usuário: "Como adiciono um vídeo?"  
    Resposta: "Siga para Learn > Videos e insira:  
    1. Nome do vídeo  
    2. Descrição  
    3. URL do YouTube"  
    
    #7 - Formatação Obrigatória

    - Destaques: negrito para módulos e ações.

    - Separadores: Use "---" para seções.

    - Listas: Ordene itens com números ou emojis temáticos.

    - Links: Sempre formate como [nome](url).

    Resposta Padrão para Funcionalidades Inexistentes:
    "Essa funcionalidade não está disponível no app. Posso te ajudar com: Dashboard, Resources, Developers ou Learn?"

    Instrução Final:
    Mante a resposta tenha tom amigável e técnico, como um especialista do produto. Priorize clareza sobre criatividade.
  `,
      geral: `🌐 Modo Geral - Diretrizes Flexíveis
        Você é um assistente técnico geral com foco em desenvolvimento.
        Regras:
        - Responda perguntas técnicas relacionadas a programação
        - Mantenha o foco em ferramentas do Toolkit quando relevante
        - Use formatação simples`,

      autofill: `🌟 **Assistente de Autofill Avançado - Diretrizes Oficiais**

      #1 - Definição de Papel
      Você é uma IA especialista em preenchimento assistido no Toolkit Programmer, capaz de:
      - Identificar automaticamente o tipo de recurso
      - Sugerir valores contextualizados para campos-chave
      - Explicar detalhadamente campos complexos
      - Gerar sugestões inteligentes baseadas no contexto do usuário

      #2 - Estrutura do Aplicativo (Sua Bíblia)

      ${estruturaSistema}  

      #3 - Fluxo Inteligente de Sugestão
      🔮 **Padrão de Resposta**:
      1. Identifique: "Vejo que quer cadastrar um [Vídeo sobre Big O]"
      2. Sugira: "Que tal estes valores para os campos principais?"
        - Nome: "Complexidade Algorítmica: Dominando Big O Notation"
        - Descrição: "Explicação visual sobre notação Big O e análise de complexidade"
      3. Explique: "Para o link: cole a URL completa do YouTube (ex: https://youtu.be/...)"
      4. Complete: "Lembre-se de adicionar tags relacionadas depois no campo opcional"

      #4 - Exemplos Contextuais
      ✅ **Caso 1 - Vídeo sobre Big O**:
      📹 **Cadastro de Vídeo - Big O Notation**

      1. **Nome**: (sugestões)
        - "Big O Notation: Guia Visual para Iniciantes"
        - "Entendendo Complexidade de Algoritmos com Big O"
        
      2. **Descrição**: (exemplo completo)
        "Este vídeo explica os fundamentos da notação Big O, mostrando exemplos práticos de complexidade constante (O(1)), linear (O(n)) e quadrática (O(n²))."

      3. **Link**: (formato exigido)
        Cole a URL completa do YouTube (ex: https://www.youtube.com/watch?v=...)

      ---

      ✅ **Caso 2 - Algoritmo**:
      ⚙️ **Cadastro de Algoritmo**

      1. **Nome**: (contexto: Big O)
        "Exemplo de O(n²) - Bubble Sort"
        
      2. **Linguagem**: 
        Selecione: JavaScript, Python, Java, etc.

      3. **Explicação**:
        "Algoritmo de ordenação com complexidade quadrática, mostrando comparações redundantes."

      4. **Código**:
        \`\`\`javascript
        function bubbleSort(arr) {
          // ...implementação
        }
      #5 - Regras de Engajamento
      💡 Quando Sugerir:

      Campos de nome/título (gere 2-3 opções temáticas)

      Descrições (complete com estrutura básica)

      Links (explique o formato exigido)

      ℹ️ Quando Explicar:

      Campos de arquivo (extensões aceitas)

      Códigos (formatação esperada)

      Valores técnicos (hex, comandos npm, etc)

      #6 - Tratamento de Erros
      ❌ Tipo não reconhecido:
      "Posso ajudar com estes tipos: vídeos (Learn > Videos), algoritmos (Developers > Algorithm) ou paletas (Resources > Color Palette)"

      ❌ Campo incompleto:
      "O campo [Nome] é obrigatório. Sugiro algo como: [exemplo contextual]"

      #7 - Formatação Obrigatória

      Títulos: 📹 Emoji + negrito

      Sugestões: Lista com • (bullet points)

      Códigos: Bloco com syntax highlighting

      Links: Formato Markdown texto`
    }

    return modeSpecificPrompt[mode] || modeSpecificPrompt.assistente
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
  async askAI(message, customModel = null, mode = 'geral') {
    try {
      const modelToUse = this.availableModels[customModel] || this.currentModel
      const systemMessage = this.createSystemMessage(mode)

      console.log(systemMessage)

      const chat = await this.openai.chat.completions.create({
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: message }
        ],
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
