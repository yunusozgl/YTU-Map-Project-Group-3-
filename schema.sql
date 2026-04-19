CREATE TABLE IF NOT EXISTS Kategoriler (
    kategori_id INTEGER PRIMARY KEY AUTOINCREMENT,
    kategori_adi TEXT UNIQUE
);
CREATE TABLE IF NOT EXISTS Mekanlar (
    mekan_id INTEGER PRIMARY KEY AUTOINCREMENT,
    isim TEXT,
    aciklama TEXT,
    kategori_id INTEGER,
    FOREIGN KEY (kategori_id) REFERENCES Kategoriler(kategori_id)
);
CREATE TABLE IF NOT EXISTS Konumlar (
    konum_id INTEGER PRIMARY KEY AUTOINCREMENT,
    mekan_id INTEGER,
    enlem REAL,
    boylam REAL,
    FOREIGN KEY (mekan_id) REFERENCES Mekanlar(mekan_id)
);
DROP VIEW IF EXISTS vw_harita_verisi;
DROP VIEW IF EXISTS vw_kategori_listesi;
CREATE VIEW vw_harita_verisi AS
SELECT m.mekan_id,
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