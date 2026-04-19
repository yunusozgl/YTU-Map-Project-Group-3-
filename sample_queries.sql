-- Query 1: Show all map data
SELECT m.isim,
    m.aciklama,
    k.kategori_adi,
    ko.enlem,
    ko.boylam
FROM Mekanlar m
    JOIN Kategoriler k ON m.kategori_id = k.kategori_id
    JOIN Konumlar ko ON m.mekan_id = ko.mekan_id;
-- Query 2: Filter map data by category
SELECT *
FROM vw_harita_verisi
WHERE kategori_adi = 'Kafeterya';
-- Query 3: Count places in each category
SELECT k.kategori_adi,
    COUNT(*) AS mekan_sayisi
FROM Mekanlar m
    JOIN Kategoriler k ON m.kategori_id = k.kategori_id
GROUP BY k.kategori_adi
ORDER BY mekan_sayisi DESC;
-- Query 4: Show category list for filter menu
SELECT *
FROM vw_kategori_listesi;