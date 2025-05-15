import sqlite from 'sqlite-electron'

export default {
  openDb: async (path) => {
    const db = await sqlite.open(path)
    return db
  },
  closeDb: async (db) => {
    await db.close()
  },
  setdbPathInMemory() {
    const db = sqlite.setdbPath(':memory:')
    return db
  }
}
