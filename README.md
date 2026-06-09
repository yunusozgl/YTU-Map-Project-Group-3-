# YTU-MAP-Project-Group-3-

🔗 **[Repository Link](Buraya_Repository_Linkini_Ekle)** | 📽️ **[Presentation Link](https://drive.google.com/file/d/1GV71pccpn4U7_tCPkrsy0X3UO66oaUFT/view?usp=drivesdk)**

An on-campus map project designed for Yıldız Technical University. The project stores campus locations such as faculties, cafes, ATMs, benches, trash bins, bus stops, and more, along with their category and coordinate information.

The database side is built with SQLite, while the web frontend utilizes React, Leaflet, and a minimal Express API.

---

## Team Members

* Ahmet Tuğrul Aki : 22058011
* Muhammet AL: 22058607
* Ömer Özyurt: 20058060
* Salih Çelik: 21058011
* Yunus Özgül: 21058062

---

## Features

* Interactive Map: View faculties, cafes, ATMs, and other campus spots using Leaflet.
* Category Filtering: Easily filter locations by their categories.
* Real-time Updates: Refresh map data instantly with the sidebar refresh button.
* Dynamic Database: Automated updates via SQLite views (vw_harita_verisi).

---

## Tech Stack

* SQLite
* Python
* Pandas
* OpenPyXL
* React
* Vite
* Leaflet
* Express

---

## Database Structure

### Main tables:
* Kategoriler (Categories): Stores category names.
* Mekanlar (Places): Stores place name, description, and category information.
* Konumlar (Locations): Stores the latitude and longitude details of the places.

### Relationships:
* A category can contain multiple places.
* A place has exactly one coordinate record.

### Views:
* vw_harita_verisi: Combines place, category, and coordinate data for the map.
* vw_kategori_listesi: Provides the list of categories for the filter menu.

---

## Getting Started

To install the dependencies:
```bash
npm install
