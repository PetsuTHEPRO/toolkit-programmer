// src/renderer/src/service/database.js

import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import { join } from 'path'

let dbPath = ''

/**
 * Define o caminho para o arquivo do banco de dados.
 * Deve ser chamado na inicialização do app no main.js.
 * @param {string} directory - O diretório de dados do usuário.
 */
export function setDbPath(directory) {
  dbPath = join(directory, 'toolkit.db')
  console.log(`Caminho do banco de dados definido para: ${dbPath}`)
}

/**
 * Abre e retorna uma conexão com o banco de dados.
 */
export async function connect() {
  if (!dbPath) {
    throw new Error('O caminho do banco de dados não foi definido. Chame setDbPath() primeiro.')
  }
  return open({
    filename: dbPath,
    driver: sqlite3.Database
  })
}

/**
 * Cria todas as tabelas necessárias no banco de dados se elas não existirem.
 */
export async function initialize() {
  const db = await connect()
  await db.exec(`
    CREATE TABLE IF NOT EXISTS links (id TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT, link TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS videos (id TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT, link TEXT NOT NULL, thumbnailUrl TEXT, titulo TEXT, apiIdVideo TEXT);
    CREATE TABLE IF NOT EXISTS articles (id TEXT PRIMARY KEY, name TEXT NOT NULL,description TEXT, path TEXT, pdfFileName TEXT, pdfSize TEXT);
    CREATE TABLE IF NOT EXISTS frameworks (id TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT, installation TEXT, documentationLink TEXT);
    CREATE TABLE IF NOT EXISTS apis (id TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT NOT NULL, key TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS algorithms (id TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT, code TEXT);
    CREATE TABLE IF NOT EXISTS code_snippets (id INTEGER PRIMARY KEY AUTOINCREMENT,algorithm_id INTEGER NOT NULL,lang TEXT NOT NULL,code TEXT NOT NULL,FOREIGN KEY (algorithm_id) REFERENCES algorithms (id) ON DELETE CASCADE);
    CREATE TABLE IF NOT EXISTS fonts (id TEXT PRIMARY KEY, name TEXT NOT NULL, path TEXT);
    CREATE TABLE IF NOT EXISTS images (id TEXT PRIMARY KEY, name TEXT NOT NULL, path TEXT);
    CREATE TABLE IF NOT EXISTS icons (id TEXT PRIMARY KEY, name TEXT NOT NULL, path TEXT);
    CREATE TABLE IF NOT EXISTS palettes (id TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT NOT NULL, colors TEXT);
    CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT);
    CREATE TABLE IF NOT EXISTS system_logs (id INTEGER PRIMARY KEY AUTOINCREMENT, level TEXT NOT NULL, source TEXT NOT NULL, message TEXT NOT NULL, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP);
  `)

  await db.close()
  console.log('Tabelas do banco de dados verificadas/criadas com sucesso.')
}
