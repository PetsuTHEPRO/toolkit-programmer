import { exec } from 'child_process'

// Função auxiliar simples para rodar o comando
function runCommand(command) {
  return new Promise((resolve, reject) => {
    // Importante: Passamos o process.env para herdar as configurações do sistema (PATH, HOME, etc)
    exec(command, { env: process.env }, (error, stdout, stderr) => {
      const fullOutput = (stdout + stderr).toString()

      // Filtra o log chato de credenciais (não é erro)
      const isCredentialLog = fullOutput.includes('Loaded cached credentials') && !error

      // Se houver erro REAL (exit code != 0) e não for apenas log
      if (error && !isCredentialLog) {
        // Detecta erros comuns para ajudar o frontend
        if (fullOutput.includes('quota') || fullOutput.includes('429')) {
          reject('Limite de cotas excedido. Aguarde um pouco.')
        } else if (fullOutput.includes('login') || fullOutput.includes('auth')) {
          reject('Não autenticado. Por favor, faça login no terminal.')
        } else {
          reject(stderr || error.message)
        }
      } else {
        // Sucesso: Limpa o output
        const cleanOutput = stdout.replace('Loaded cached credentials.', '').trim()
        resolve(cleanOutput)
      }
    })
  })
}

const geminiService = {
  // ---------------------------------------
  // 🔍 1. Verificar se está instalado
  // ---------------------------------------
  async isInstalled() {
    try {
      // Tenta apenas ver a versão. Se o comando não existir, vai cair no catch.
      await runCommand('gemini --version')
      // Retorna objeto para bater com seu Vue: "installStatus.installed"
      return { installed: true }
    } catch (error) {
      return { installed: false }
    }
  },
  // ---------------------------------------
  // 🔌 2. Verificar conexão (Login)
  // ---------------------------------------
  async checkConnection() {
    try {
      // "gemini auth status" geralmente retorna se está pronto ou pede login
      // Se falhar (não logado), o runCommand vai rejeitar.
      // O pipe "echo | gemini" não tem comando de status direto, então usamos o CLI puro aqui.
      const output = await runCommand('gemini auth status')

      // Se chegou aqui, o comando rodou sem erro de exit code
      // Validamos se a saída parece positiva
      const isReady =
        output.includes('Ready') || output.includes('Active') || output.includes('Logged in')

      if (isReady) {
        return { connected: true, type: 'google' }
      } else {
        // Caso o comando rode mas diga "Not logged in" sem dar erro de processo
        return { connected: false, type: null }
      }
    } catch (error) {
      return { connected: false, type: null }
    }
  },
  // ---------------------------------------
  // 🧠 Executar via Pipe (Simples e Robusto)
  // ---------------------------------------
  async run(prompt) {
    try {
      // Sanitização básica: escapa aspas duplas para não quebrar o bash
      const promptSanitized = prompt.replace(/"/g, '\\"')

      // O comando mágico.
      // O CLI vai usar o que tiver disponível (Login do gcloud OU API Key do env)
      const command = `echo "${promptSanitized}" | gemini`

      const output = await runCommand(command)

      return { success: true, output }
    } catch (err) {
      console.error('Gemini Error:', err)
      return { success: false, error: err }
    }
  }
}

export default geminiService
