import sqlite3
import pandas as pd
import sys

dosya_adi = 'veriler.xlsx'

print(f"1. {dosya_adi} Excel dosyası okunuyor...")
try:
    df = pd.read_excel(dosya_adi, engine='openpyxl')
except Exception as e:
    print(f"HATA: Excel dosyası okunamadı. Detay: {e}")
    sys.exit()

# Sütun isimlerini temizle
df.columns = df.columns.str.strip().str.lower()

print("2. Bulunan Sütunlar:", df.columns.tolist())

# Güvenlik kontrolü
if 'kategori' not in df.columns:
    print("\nKRİTİK HATA: Sütun isimleri temizlenmesine rağmen 'kategori' bulunamadı.")
    sys.exit()

print("3. Veritabanı oluşturuluyor...")
conn = sqlite3.connect('ytu_map.db')
cursor = conn.cursor()

# Tabloları oluştur
cursor.executescript('''
CREATE TABLE IF NOT EXISTS Kategoriler (
    kategori_id INTEGER PRIMARY KEY AUTOINCREMENT,
    kategori_adi TEXT UNIQUE
);

CREATE TABLE IF NOT EXISTS Mekanlar (
    mekan_id INTEGER PRIMARY KEY AUTOINCREMENT,
    isim TEXT,
    aciklama TEXT,
    kategori_id INTEGER,
    FOREIGN KEY(kategori_id) REFERENCES Kategoriler(kategori_id)
);

CREATE TABLE IF NOT EXISTS Konumlar (
    konum_id INTEGER PRIMARY KEY AUTOINCREMENT,
    mekan_id INTEGER,
    enlem REAL,
    boylam REAL,
    FOREIGN KEY(mekan_id) REFERENCES Mekanlar(mekan_id)
);
''')

# Eski view'lar varsa silip yeniden oluştur
cursor.executescript('''
DROP VIEW IF EXISTS vw_harita_verisi;
DROP VIEW IF EXISTS vw_kategori_listesi;
''')

# View'ları oluştur
cursor.executescript('''
CREATE VIEW vw_harita_verisi AS
SELECT
    m.mekan_id,
    m.isim,
    m.aciklama,
    k.kategori_adi,
    ko.enlem,
    ko.boylam
FROM Mekanlar m
JOIN Kategoriler k ON m.kategori_id = k.kategori_id
JOIN Konumlar ko ON m.mekan_id = ko.mekan_id;

CREATE VIEW vw_kategori_listesi AS
SELECT DISTINCT kategori_adi
FROM Kategoriler
ORDER BY kategori_adi;
''')

print("4. Veriler tablolara dağıtılıyor...")
kategoriler = df['kategori'].dropna().unique()

for kat in kategoriler:
    cursor.execute(
        "INSERT OR IGNORE INTO Kategoriler (kategori_adi) VALUES (?)",
        (str(kat).strip(),)
    )

for index, row in df.iterrows():
    if pd.isna(row.get('kategori')):
        continue

    cursor.execute(
        "SELECT kategori_id FROM Kategoriler WHERE kategori_adi = ?",
        (str(row['kategori']).strip(),)
    )
    k_id_result = cursor.fetchone()

    if k_id_result:
        k_id = k_id_result[0]

        cursor.execute(
            "INSERT INTO Mekanlar (isim, aciklama, kategori_id) VALUES (?, ?, ?)",
            (
                str(row.get('isim', '')),
                str(row.get('aciklama', '')),
                k_id
            )
        )

        m_id = cursor.lastrowid

        cursor.execute(
            "INSERT INTO Konumlar (mekan_id, enlem, boylam) VALUES (?, ?, ?)",
            (
                m_id,
                row.get('enlem', 0.0),
                row.get('boylam', 0.0)
            )
        )

conn.commit()

print("\n5. View testleri yapılıyor...")

# Kategori listesini göster
cursor.execute("SELECT * FROM vw_kategori_listesi")
kategoriler_listesi = cursor.fetchall()
print("\nKategori Listesi:")
for kategori in kategoriler_listesi:
    print(kategori[0])

# Tüm harita verisini göster
cursor.execute("SELECT * FROM vw_harita_verisi LIMIT 5")
ornek_veriler = cursor.fetchall()
print("\nHarita verisinden örnek 5 kayıt:")
for veri in ornek_veriler:
    print(veri)

# Kullanıcıdan kategori seçip filtreleme örneği
secilen_kategori = input("\nBir kategori girin (veya hepsi için boş bırakın): ").strip()

if secilen_kategori == "":
    cursor.execute("SELECT * FROM vw_harita_verisi")
else:
    cursor.execute(
        "SELECT * FROM vw_harita_verisi WHERE kategori_adi = ?",
        (secilen_kategori,)
    )

filtreli_veriler = cursor.fetchall()

print(f"\nSeçilen kategoriye göre bulunan kayıt sayısı: {len(filtreli_veriler)}")
for veri in filtreli_veriler[:10]:
    print(veri)

conn.close()

print("\nTEBRİKLER! Veritabanı, tablolar ve view'lar başarıyla oluşturuldu.")