'use strict';
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'sync.json');
const MAX_CODES = 5000;  // limite para evitar crescimento ilimitado

// CORS aberto (app é estático no GitHub Pages)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(express.json({ limit: '8mb' }));

// ─── persistência simples ─────────────────────────────────────────────────
function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (_) {}
  return {};
}

function saveData(data) {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(data));
  } catch (e) { console.error('Erro ao salvar dados:', e.message); }
}

// ─── rotas ────────────────────────────────────────────────────────────────
// GET /api/sync/:code   → retorna payload do código
app.get('/api/sync/:code', (req, res) => {
  const code = req.params.code.toUpperCase().trim();
  if (!code || code.length < 3) return res.status(400).json({ error: 'código inválido' });
  const data = loadData();
  const entry = data[code];
  if (!entry) return res.status(404).json({ error: 'não encontrado' });
  res.json(entry);
});

// PUT /api/sync/:code   → salva ou atualiza payload
app.put('/api/sync/:code', (req, res) => {
  const code = req.params.code.toUpperCase().trim();
  if (!code || code.length < 3) return res.status(400).json({ error: 'código inválido' });
  const payload = req.body && req.body.payload;
  if (!payload) return res.status(400).json({ error: 'payload ausente' });

  const data = loadData();

  // se atingiu o limite, remove o mais antigo para não crescer infinitamente
  const keys = Object.keys(data);
  if (keys.length >= MAX_CODES && !data[code]) {
    const oldest = keys.sort((a, b) => {
      const ta = data[a].updatedAt || '';
      const tb = data[b].updatedAt || '';
      return ta.localeCompare(tb);
    })[0];
    delete data[oldest];
  }

  data[code] = { payload, updatedAt: new Date().toISOString() };
  saveData(data);
  res.json({ ok: true });
});

// Health check
app.get('/health', (_req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

// ─── start ────────────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Sync API rodando na porta ${PORT}`);
  console.log(`   Arquivo de dados: ${DATA_FILE}`);
});
