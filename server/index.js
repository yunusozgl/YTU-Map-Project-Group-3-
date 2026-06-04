import cors from 'cors';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import initSqlJs from 'sql.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const dbPath = process.env.DB_PATH
  ? path.resolve(process.env.DB_PATH)
  : path.join(rootDir, 'ytu_map.db');
const port = Number(process.env.PORT || 4174);

const app = express();
const SQL = await initSqlJs();

let database = null;
let loadedMtime = 0;

const categoryLabels = {
  ataturk: 'Atatürk',
  atm: 'ATM',
  bank: 'Bank',
  cafe: 'Kafe',
  cop_kovasi: 'Çöp Kovası',
  diger: 'Diğer',
  fakulteler: 'Fakülteler',
  ibadethane: 'İbadethane',
  idari_binalar: 'İdari Binalar',
  is_yerleri: 'İş Yerleri',
  market: 'Market',
  ogrenci_yurdu: 'Öğrenci Yurdu',
  otobus_duragi: 'Otobüs Durağı',
  otopark: 'Otopark',
  sosyal_alanlar: 'Sosyal Alanlar',
  spor_alanlari: 'Spor Alanları',
  tuvalet: 'Tuvalet',
  ytu_ozel: 'YTÜ Özel'
};

function getCategoryLabel(category) {
  return categoryLabels[category] || category
    .split('_')
    .map((word) => word.charAt(0).toLocaleUpperCase('tr-TR') + word.slice(1))
    .join(' ');
}

function getDatabase() {
  const stat = fs.statSync(dbPath);

  if (!database || stat.mtimeMs !== loadedMtime) {
    if (database) {
      database.close();
    }

    const fileBuffer = fs.readFileSync(dbPath);
    database = new SQL.Database(fileBuffer);
    loadedMtime = stat.mtimeMs;
  }

  return database;
}

function all(sql, params = []) {
  const statement = getDatabase().prepare(sql);
  const rows = [];

  try {
    statement.bind(params);

    while (statement.step()) {
      rows.push(statement.getAsObject());
    }
  } finally {
    statement.free();
  }

  return rows;
}

function getDatabaseUpdatedAt() {
  return fs.statSync(dbPath).mtime.toISOString();
}

function toPlace(row) {
  return {
    id: Number(row.mekan_id),
    name: row.isim,
    description: row.aciklama || '',
    category: row.kategori_adi,
    categoryLabel: getCategoryLabel(row.kategori_adi),
    lat: Number(row.enlem),
    lng: Number(row.boylam)
  };
}

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    database: path.basename(dbPath),
    updatedAt: getDatabaseUpdatedAt()
  });
});

app.get('/api/categories', (_req, res, next) => {
  try {
    const rows = all(`
      SELECT
        k.kategori_adi,
        COUNT(m.mekan_id) AS mekan_sayisi
      FROM Kategoriler k
      LEFT JOIN Mekanlar m ON m.kategori_id = k.kategori_id
      GROUP BY k.kategori_id, k.kategori_adi
      ORDER BY k.kategori_adi
    `);

    res.json({
      categories: rows.map((row) => ({
        id: row.kategori_adi,
        label: getCategoryLabel(row.kategori_adi),
        count: Number(row.mekan_sayisi)
      })),
      updatedAt: getDatabaseUpdatedAt()
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/places', (req, res, next) => {
  try {
    const category = String(req.query.category || '').trim();
    const search = String(req.query.q || '').trim().toLocaleLowerCase('tr-TR');
    const params = [];
    const where = ['enlem IS NOT NULL', 'boylam IS NOT NULL'];

    if (category) {
      where.push('kategori_adi = ?');
      params.push(category);
    }

    if (search) {
      where.push(`(
        LOWER(isim) LIKE ?
        OR LOWER(aciklama) LIKE ?
        OR LOWER(kategori_adi) LIKE ?
      )`);
      const token = `%${search}%`;
      params.push(token, token, token);
    }

    const rows = all(`
      SELECT mekan_id, isim, aciklama, kategori_adi, enlem, boylam
      FROM vw_harita_verisi
      WHERE ${where.join(' AND ')}
      ORDER BY kategori_adi, isim, mekan_id
    `, params);

    res.json({
      places: rows.map(toPlace),
      total: rows.length,
      updatedAt: getDatabaseUpdatedAt()
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/stats', (_req, res, next) => {
  try {
    const [row] = all(`
      SELECT
        COUNT(*) AS total_places,
        COUNT(DISTINCT kategori_adi) AS total_categories,
        AVG(enlem) AS center_lat,
        AVG(boylam) AS center_lng,
        MIN(enlem) AS min_lat,
        MAX(enlem) AS max_lat,
        MIN(boylam) AS min_lng,
        MAX(boylam) AS max_lng
      FROM vw_harita_verisi
      WHERE enlem IS NOT NULL AND boylam IS NOT NULL
    `);

    res.json({
      totalPlaces: Number(row.total_places),
      totalCategories: Number(row.total_categories),
      center: [Number(row.center_lat), Number(row.center_lng)],
      bounds: [
        [Number(row.min_lat), Number(row.min_lng)],
        [Number(row.max_lat), Number(row.max_lng)]
      ],
      updatedAt: getDatabaseUpdatedAt()
    });
  } catch (error) {
    next(error);
  }
});

const distDir = path.join(rootDir, 'dist');
const indexFile = path.join(distDir, 'index.html');

if (fs.existsSync(indexFile)) {
  app.use(express.static(distDir));

  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      res.sendFile(indexFile);
      return;
    }

    next();
  });
}

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({
    error: 'Sunucu veritabanını okurken bir sorun yaşadı.'
  });
});

app.listen(port, () => {
  console.log(`ytumap API http://localhost:${port}`);
});
