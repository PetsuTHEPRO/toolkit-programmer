// database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path')
const { app } = require('electron') // Para obter o caminho userData

// Caminho para o arquivo do banco de dados
// É uma boa prática salvar dados do usuário no diretório 'userData'
const dbPath = path.join(app.getPath('userData'), 'meuAppDatabase.sqlite')

let db = null // Variável para manter a instância do banco de dados

// Função para conectar/criar o banco de dados
function connectDB() {
  return new Promise((resolve, reject) => {
    if (db && db.open) { // Se já estiver conectado
      resolve(db);
      return;
    }
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Erro ao conectar ao SQLite:', err.message);
        reject(err);
      } else {
        console.log('Conectado ao banco de dados SQLite.');
        resolve(db);
      }
    });
  });
}

// Função para inicializar as tabelas
async function initializeDB() {
  const database = await connectDB();
  return new Promise((resolve, reject) => {
    database.serialize(() => {
      // Tabela para 'articles' (exemplo)
      // Assumindo que 'articles' são objetos com id, title, e talvez um path ou fileName
      database.run(`
        CREATE TABLE IF NOT EXISTS articles (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT,
          fileName TEXT UNIQUE,
          uploadDate TEXT
        )
      `, (err) => {
        if (err) return reject(err);
        console.log("Tabela 'articles' pronta.");
      });

      // Tabela para 'links' (exemplo)
      // Assumindo que 'links' são objetos com url e description
      database.run(`
        CREATE TABLE IF NOT EXISTS links (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          url TEXT NOT NULL,
          description TEXT
        )
      `, (err) => {
        if (err) return reject(err);
        console.log("Tabela 'links' pronta.");
      });

      // Adicione aqui a criação de outras tabelas conforme a necessidade:
      // fonts, frameworks, apis, videos, algorithms, images, icons, palettes, system_info etc.
      // Exemplo para system_info (chave-valor)
      database.run(`
        CREATE TABLE IF NOT EXISTS system_info (
          key TEXT PRIMARY KEY,
          value TEXT
        )
      `, (err) => {
        if (err) return reject(err);
        console.log("Tabela 'system_info' pronta.");
        resolve();
      });
    });
  });
}

// --- DAO para Artigos ---
class ArticleDAO {
  constructor(database) {
    this.db = database;
  }

  // Salva uma lista de artigos. Deleta os antigos e insere os novos.
  async saveArticles(articles) {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run("DELETE FROM articles", (err) => {
          if (err) return reject(err);

          const stmt = this.db.prepare("INSERT INTO articles (title, fileName, uploadDate) VALUES (?, ?, ?)");
          articles.forEach(article => {
            // Certifique-se de que article.title, article.fileName, article.uploadDate existam
            stmt.run(article.title || null, article.fileName || null, article.uploadDate || new Date().toISOString());
          });
          stmt.finalize((err) => {
            if (err) return reject(err);
            resolve({ success: true, message: 'Artigos salvos com sucesso' });
          });
        });
      });
    });
  }

  // Carrega todos os artigos
  async loadArticles() {
    return new Promise((resolve, reject) => {
      this.db.all("SELECT id, title, fileName, uploadDate FROM articles", [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }
}

// --- DAO para Links --- (Exemplo)
class LinkDAO {
  constructor(database) {
    this.db = database;
  }

  async saveLinks(links) {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run("DELETE FROM links", (err) => {
          if (err) return reject(err);
          const stmt = this.db.prepare("INSERT INTO links (url, description) VALUES (?, ?)");
          links.forEach(link => {
            stmt.run(link.url, link.description || null);
          });
          stmt.finalize((err) => {
            if (err) return reject(err);
            resolve({ success: true, message: 'Links salvos com sucesso' });
          });
        });
      });
    });
  }

  async loadLinks() {
    return new Promise((resolve, reject) => {
      this.db.all("SELECT id, url, description FROM links", [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }
}

// --- DAO para SystemInfo (Exemplo chave-valor) ---
class SystemInfoDAO {
  constructor(database) {
    this.db = database;
  }

  async saveSystemInfo(systemInfoObject) { // systemInfoObject é um objeto { key1: value1, key2: value2 }
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare("INSERT OR REPLACE INTO system_info (key, value) VALUES (?, ?)");
      for (const key in systemInfoObject) {
        if (Object.hasOwnProperty.call(systemInfoObject, key)) {
          stmt.run(key, JSON.stringify(systemInfoObject[key])); // Salva valores como JSON string
        }
      }
      stmt.finalize((err) => {
        if (err) return reject(err);
        resolve({ success: true, message: 'System info salvo com sucesso' });
      });
    });
  }

  async loadSystemInfo() {
    return new Promise((resolve, reject) => {
      this.db.all("SELECT key, value FROM system_info", [], (err, rows) => {
        if (err) return reject(err);
        const systemInfo = {};
        rows.forEach(row => {
          try {
            systemInfo[row.key] = JSON.parse(row.value);
          } catch (e) {
            systemInfo[row.key] = row.value; // Fallback se não for JSON válido
          }
        });
        resolve(systemInfo);
      });
    });
  }
}


// Exporta as funções e classes DAO
module.exports = {
  connectDB,
  initializeDB,
  getDBInstance: () => db, // Para acessar a instância 'db' diretamente se necessário
  ArticleDAO,
  LinkDAO,
  SystemInfoDAO
  // Exporte outros DAOs aqui
};