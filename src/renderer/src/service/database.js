import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'path'

let dbPath = null

function setDbPath(baseDir) {
  dbPath = path.join(baseDir, 'data.db')
}

async function connect() {
  if (!dbPath) throw new Error('dbPath não foi definido!')
  return open({
    filename: dbPath,
    driver: sqlite3.Database
  })
}

async function initialize() {
  const db = await connect()

  await db.exec(`
    CREATE TABLE IF NOT EXISTS links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      link TEXT NOT NULL
    );
  `)

  await db.close()
}

export { setDbPath, connect, initialize }
