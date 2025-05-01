const { ipcRenderer } = window.require('electron')

export async function sendToAI(message) {
  try {
    const response = await ipcRenderer.invoke('ask-chatgpt', message)
    return response
  } catch (error) {
    console.error('Erro ao se comunicar com a IA:', error)
    return 'Erro ao tentar acessar a IA.'
  }
}