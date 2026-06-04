# ytumap

Yıldız Teknik Üniversitesi için hazırlanmış kampüs içi harita projesidir. Projede fakülteler, kafeler, ATM'ler, banklar, çöp kovaları, otobüs durakları ve benzeri kampüs noktaları kategori ve koordinat bilgileriyle tutulur.

Veri tarafı SQLite ile hazırlanmıştır. Web tarafında React, Leaflet ve küçük bir Express API kullanılır.

## Kullanılan Teknolojiler

- SQLite
- Python
- Pandas
- OpenPyXL
- React
- Vite
- Leaflet
- Express

## Veritabanı Yapısı

Ana tablolar:

- **Kategoriler**: kategori adlarını tutar
- **Mekanlar**: mekan adı, açıklama ve kategori bilgisini tutar
- **Konumlar**: mekanların enlem ve boylam bilgisini tutar

İlişkiler:

- Bir kategoride birden fazla mekan bulunabilir
- Bir mekanın bir koordinat kaydı vardır

View'lar:

- **vw_harita_verisi**: mekan, kategori ve koordinat bilgilerini harita için birleştirir
- **vw_kategori_listesi**: filtre menüsü için kategori listesini verir

## Çalıştırma

Bağımlılıkları kurmak için:

```bash
npm install
```

Geliştirme sunucusunu başlatmak için:

```bash
npm run dev
```

Uygulama adresi:

```text
http://localhost:5173
```

API adresi:

```text
http://localhost:4174/api
```

Production build almak için:

```bash
npm run build
```

Build sonrası uygulamayı Express üzerinden çalıştırmak için:

```bash
npm run preview
```

## Örnek Sorgu

```sql
SELECT m.isim, m.aciklama, k.kategori_adi, ko.enlem, ko.boylam
FROM Mekanlar m
JOIN Kategoriler k ON m.kategori_id = k.kategori_id
JOIN Konumlar ko ON m.mekan_id = ko.mekan_id;
```

## Not

Yeni koordinatlar `ytu_map.db` içine eklendiğinde API aynı view'ları okuduğu için harita verisi de güncellenir. Uygulama açıkken sol paneldeki yenile butonu ile güncel kayıtlar tekrar alınabilir.
