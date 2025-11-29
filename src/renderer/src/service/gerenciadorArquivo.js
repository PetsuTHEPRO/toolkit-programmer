// src/renderer/src/service/gerenciadorArquivo.js

import { connect } from './database.js'
import fs from 'fs'
import { join } from 'path'

let paths = {} // Variável privada para guardar os caminhos (img, pdf, etc.)

// Função auxiliar para criar queries de UPDATE dinâmicas
const buildUpdateQuery = (table, data, id) => {
  const fields = Object.keys(data)
  const setClause = fields.map((field) => `${field} = ?`).join(', ')
  const values = [...Object.values(data), id]
  return {
    sql: `UPDATE ${table} SET ${setClause} WHERE id = ?`,
    values: values
  }
}

const fileManager = {
  // Inicialização
  initializeFileManager(appPaths) {
    paths = appPaths
  },

  // Operações de Arquivo (Upload)
  async uploadImage(buffer, fileName) {
    const filePath = join(paths.imgDir, fileName)
    await fs.promises.writeFile(filePath, Buffer.from(buffer))
    return filePath
  },
  async uploadIcon(buffer, fileName) {
    const iconDir = join(paths.dataDir, 'icon')
    await fs.promises.mkdir(iconDir, { recursive: true })
    const filePath = join(iconDir, fileName)
    await fs.promises.writeFile(filePath, Buffer.from(buffer))
    return filePath
  },
  async uploadPdf(buffer, fileName) {
    const filePath = join(paths.pdfDir, fileName)
    await fs.promises.writeFile(filePath, Buffer.from(buffer))
    return filePath
  },

  // Métodos CRUD genéricos internos
  async _loadAll(table) {
    const db = await connect()
    try {
      return await db.all(`SELECT * FROM ${table}`)
    } finally {
      await db.close()
    }
  },
  async _create(table, data, columns) {
    const placeholders = columns.map(() => '?').join(', ')
    const values = columns.map((col) => data[col])
    const db = await connect()

    console.log(`INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`, values)
    try {
      await db.run(`INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`, values)
    } finally {
      await db.close()
    }
  },
  async _update(table, id, data) {
    const { sql, values } = buildUpdateQuery(table, data, id)
    const db = await connect()
    try {
      await db.run(sql, values)
    } finally {
      await db.close()
    }
  },
  async _delete(table, id) {
    const db = await connect()
    try {
      await db.run(`DELETE FROM ${table} WHERE id = ?`, [id])
    } finally {
      await db.close()
    }
  },

  // Implementação do CRUD para cada entidade
  loadArticles() {
    return this._loadAll('articles')
  },
  saveArticle(data) {
    // Adicione 'path', 'pdfFileName', e 'pdfSize' na lista de colunas
    console.log("Vamos ver:", data)
    return this._create('articles', data, [
      'id',
      'name',
      'description',
      'path',
      'pdfFilename',
      'pdfSize'
    ])
  },
  updateArticle(id, data) {
    return this._update('articles', id, data)
  },
  deleteArticle(id) {
    return this._delete('articles', id)
  },

  loadLinks() {
    return this._loadAll('links')
  },
  saveLink(data) {
    return this._create('links', data, ['id', 'name', 'description', 'link'])
  },
  updateLink(id, data) {
    return this._update('links', id, data)
  },
  deleteLink(id) {
    return this._delete('links', id)
  },

  loadVideos() {
    return this._loadAll('videos')
  },
  saveVideo(data) {
    return this._create('videos', data, [
      'id',
      'name',
      'description',
      'link',
      'thumbnailUrl',
      'titulo',
      'apiIdVideo'
    ])
  },
  updateVideo(id, data) {
    return this._update('videos', id, data)
  },
  deleteVideo(id) {
    return this._delete('videos', id)
  },

  loadFonts() {
    return this._loadAll('fonts')
  },
  saveFont(data) {
    return this._create('fonts', data, ['id', 'name', 'path'])
  },
  updateFont(id, data) {
    return this._update('fonts', id, data)
  },
  deleteFont(id) {
    return this._delete('fonts', id)
  },

  loadFrameworks() {
    return this._loadAll('frameworks')
  },
  saveFramework(data) {
    return this._create('frameworks', data, [
      'id',
      'name',
      'description',
      'installation',
      'documentationLink'
    ])
  },
  updateFramework(id, data) {
    return this._update('frameworks', id, data)
  },
  deleteFramework(id) {
    return this._delete('frameworks', id)
  },

  loadApis() {
    return this._loadAll('apis')
  },
  saveApi(data) {
    return this._create('apis', data, ['id', 'name', 'description', 'key'])
  },
  updateApi(id, data) {
    return this._update('apis', id, data)
  },
  deleteApi(id) {
    return this._delete('apis', id)
  },

  // Algorithms e Code Snippets
  loadAlgorithms() {
    return this._loadAll('algorithms')
  },
  saveAlgorithm(data) {
    return this._create('algorithms', data, ['id', 'name', 'explanation'])
  }, // Corrigido
  updateAlgorithm(id, data) {
    return this._update('algorithms', id, data)
  },
  deleteAlgorithm(id) {
    return this._delete('algorithms', id)
  },

  async loadCodeSnippetsForAlgorithm(algorithmId) {
    const db = await connect()
    try {
      return await db.all('SELECT * FROM code_snippets WHERE algorithm_id = ?', [algorithmId])
    } finally {
      await db.close()
    }
  },
  saveCodeSnippet(data) {
    return this._create('code_snippets', data, ['algorithm_id', 'lang', 'code'])
  }, // 'id' removido
  updateCodeSnippet(id, data) {
    return this._update('code_snippets', id, data)
  },

  // Função de Transação (CORRIGIDA)
  async createAlgorithmWithFirstSnippet(data) {
    const db = await connect()
    try {
      await db.run('BEGIN TRANSACTION;')
      console.log(data)
      // 1. Insere o algoritmo SEM o ID
      await db.run('INSERT INTO algorithms (id, name, explanation) VALUES (?, ?, ?)', [
        data.id,
        data.name,
        data.explanation // Corrigido de 'explanation' para 'description'
      ])
      // 2. Insere o snippet SEM o ID, mas com a chave estrangeira correta
      await db.run('INSERT INTO code_snippets (algorithm_id, lang, code) VALUES (?, ?, ?)', [
        data.id,
        data.lang,
        data.code
      ])
      await db.run('COMMIT;')
      console.log(`Algoritmo '${data.name}' e seu snippet foram criados com sucesso.`)
    } catch (error) {
      await db.run('ROLLBACK;')
      console.error('Falha na transação de criação de algoritmo com snippet.', error)
      throw error
    } finally {
      await db.close()
    }
  },
  loadImages() {
    return this._loadAll('images')
  },
  saveImage(data) {
    return this._create('images', data, ['id', 'name', 'path'])
  },
  updateImage(id, data) {
    return this._update('images', id, data)
  },
  deleteImage(id) {
    return this._delete('images', id)
  },

  loadIcons() {
    return this._loadAll('icons')
  },
  saveIcon(data) {
    return this._create('icons', data, ['id', 'name', 'path'])
  },
  updateIcon(id, data) {
    return this._update('icons', id, data)
  },
  deleteIcon(id) {
    return this._delete('icons', id)
  },

  async loadPalettes() {
    // 1. Busca todas as paletas do banco.
    const palettesFromDB = await this._loadAll('palettes')

    // 2. Se não houver paletas, retorna um array vazio.
    if (!palettesFromDB) {
      return []
    }

    // 3. Usa .map() para transformar cada paleta.
    return palettesFromDB.map((palette) => {
      try {
        // Para cada paleta, transforma a string 'colors' de volta em um array.
        const parsedColors = JSON.parse(palette.colors || '[]')
        return { ...palette, colors: parsedColors }
      } catch (e) {
        // Se houver um erro no parse (ex: dados corrompidos), retorna um array vazio.
        console.error(`Erro ao parsear as cores para a paleta ID ${palette.id}:`, e)
        return { ...palette, colors: [] }
      }
    })
  },
  savePalette(data) {
    const dataToSave = { ...data, colors: JSON.stringify(data.colors) }
    // 'id' foi adicionado de volta à lista
    return this._create('palettes', dataToSave, ['id', 'name', 'description', 'colors'])
  },
  updatePalette(id, data) {
    const dataToUpdate = { ...data }
    console.log('Chaves do objeto (Object.keys):', dataToUpdate)
    if (data.colors && Array.isArray(data.colors)) {
      dataToUpdate.colors = JSON.stringify(data.colors)
    }
    return this._update('palettes', id, dataToUpdate)
  },
  deletePalette(id) {
    return this._delete('palettes', id)
  },
  async getDashboardStats() {
    const db = await connect()
    try {
      const linksCount = await db.get('SELECT COUNT(*) as count FROM links')
      const palettesCount = await db.get('SELECT COUNT(*) as count FROM palettes')
      const fontsCount = await db.get('SELECT COUNT(*) as count FROM fonts')

      return {
        links: linksCount.count,
        palettes: palettesCount.count,
        fonts: fontsCount.count
      }
    } finally {
      await db.close()
    }
  },
  // Em gerenciadorArquivo.js, dentro do objeto fileManager

  // ... seus outros métodos ...

  // --- NOVO MÉTODO PARA O CALENDÁRIO DE ATIVIDADES ---
  async getActivitiesForMonth(year, month) {
    const db = await connect()
    try {
      // Formata o mês para ter dois dígitos (ex: 6 -> '06')
      const monthStr = String(month).padStart(2, '0')
      const yearMonthStr = `${year}-${monthStr}`

      // Esta query SQL é o coração da funcionalidade:
      // 1. Filtra os logs para pegar apenas os do mês/ano desejado E que são atividades do usuário.
      // 2. Agrupa os resultados por dia.
      // 3. Conta quantos logs existem para cada dia.
      const rows = await db.all(
        `
        SELECT 
          strftime('%d', timestamp) as day, 
          COUNT(*) as activity_count
        FROM system_logs 
        WHERE 
          source = 'USER_ACTIVITY' AND
          strftime('%Y-%m', timestamp, 'localtime') = ?
        GROUP BY day
      `,
        [yearMonthStr]
      )

      // Transforma o resultado do SQL (ex: [{day: '01', count: 5}])
      // no formato que o componente precisa (ex: {'1': 5})
      return rows.reduce((acc, row) => {
        // Remove o zero à esquerda do dia (ex: '01' -> 1)
        const dayNumber = parseInt(row.day, 10)
        acc[dayNumber] = row.activity_count
        return acc
      }, {})
    } finally {
      await db.close()
    }
  },
  async addLog(level, source, message) {
    const db = await connect()
    console.log("level:", level, "fonte:", source, "mensagem:", message)
    try {
      // Adicionamos a coluna e o valor 'source' na query INSERT
      await db.run('INSERT INTO system_logs (level, source, message) VALUES (?, ?, ?)', [
        level,
        source,
        message
      ])
    } finally {
      await db.close()
    }
  },
  async getAppLogs() {
    const db = await connect()
    try {
      return await db.all(`
        SELECT * FROM system_logs 
        WHERE source = 'APP_EVENT'
        ORDER BY timestamp DESC
        LIMIT 100
      `)
    } finally {
      await db.close()
    }
  },
  async getRecentUserActivities(limit = 50) {
    // Pega os últimos 50 logs por padrão
    const db = await connect()
    try {
      // Busca apenas os logs onde a fonte é 'USER_ACTIVITY', os mais novos primeiro.
      return await db.all(
        `
        SELECT * FROM system_logs
        ORDER BY timestamp DESC
        LIMIT ?
      `,
        [limit]
      )
    } finally {
      await db.close()
    }
  },

  // Novo método para limpar APENAS os logs de atividade do usuário
  async clearUserLogs() {
    const db = await connect()
    try {
      await db.run("DELETE FROM system_logs")
    } finally {
      await db.close()
    }
  }
}

export default fileManager
