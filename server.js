import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import bodyParser from 'body-parser';
import os from 'os';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Configuração para ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

// Configuração para permitir arquivos grandes (imagens Base64)
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors());

// Conexão com Banco de Dados SQLite (arquivo local)
const db = new sqlite3.Database('./techyprint.db', (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log('✅ Conectado ao banco de dados SQLite (techyprint.db).');
    
    // OTIMIZAÇÃO PARA HARDWARE MAIS ANTIGO (CELERON/i3)
    // Ativa o modo WAL (Write-Ahead Logging)
    db.run("PRAGMA journal_mode = WAL;", (err) => {
      if (err) console.warn("Aviso: Não foi possível ativar WAL (não crítico).");
      else console.log("🚀 Modo Turbo (WAL) ativado para SSD/Celeron.");
    });
    
    db.run("PRAGMA synchronous = NORMAL;");
  }
});

// Inicialização das Tabelas
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT,
    description TEXT,
    price REAL,
    category TEXT,
    material TEXT,
    imageUrl TEXT,
    isNew INTEGER
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  )`);

  db.run(`INSERT OR IGNORE INTO settings (key, value) VALUES ('hero_image', 'https://picsum.photos/1000/800?grayscale')`);
});

// --- ROTAS DA API ---

app.get('/api/products', (req, res) => {
  db.all("SELECT * FROM products", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const products = rows.map(p => ({ ...p, isNew: p.isNew === 1 }));
    res.json(products);
  });
});

app.post('/api/products', (req, res) => {
  const p = req.body;
  const isNewInt = p.isNew ? 1 : 0;
  
  const stmt = db.prepare("INSERT INTO products (id, name, description, price, category, material, imageUrl, isNew) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
  stmt.run(p.id, p.name, p.description, p.price, p.category, p.material, p.imageUrl, isNewInt, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Produto criado", id: p.id });
  });
  stmt.finalize();
});

app.put('/api/products/:id', (req, res) => {
  const p = req.body;
  const { id } = req.params;
  const isNewInt = p.isNew ? 1 : 0;

  const stmt = db.prepare("UPDATE products SET name=?, description=?, price=?, category=?, material=?, imageUrl=?, isNew=? WHERE id=?");
  stmt.run(p.name, p.description, p.price, p.category, p.material, p.imageUrl, isNewInt, id, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Produto atualizado" });
  });
  stmt.finalize();
});

app.get('/api/settings/hero', (req, res) => {
  db.get("SELECT value FROM settings WHERE key='hero_image'", (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ url: row ? row.value : '' });
  });
});

app.post('/api/settings/hero', (req, res) => {
  const { url } = req.body;
  db.run("UPDATE settings SET value = ? WHERE key = 'hero_image'", [url], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Capa atualizada" });
  });
});

// --- DETECÇÃO DE IP LOCAL ---
function getLocalIp() {
  try {
    const interfaces = os.networkInterfaces();
    if (!interfaces) return 'localhost';

    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name]) {
        // Verifica família: algumas versões Node retornam string 'IPv4', outras número 4
        const isIPv4 = iface.family === 'IPv4' || iface.family === 4;
        // Pula endereços internos (127.0.0.1) e não-IPv4
        if (isIPv4 && !iface.internal) {
          return iface.address;
        }
      }
    }
  } catch (e) {
    console.warn("Erro ao detectar IP (usando localhost):", e.message);
  }
  return 'localhost';
}

app.listen(PORT, '0.0.0.0', () => {
  const ip = getLocalIp();
  console.log('\n=================================================');
  console.log(`🤖 TechyPrint 3D Server - ONLINE`);
  console.log(`💻 Local:   http://localhost:${PORT}`);
  console.log(`📱 Rede:    http://${ip}:${PORT}`);
  console.log('=================================================\n');
});