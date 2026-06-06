# ytumap

An on-campus map project designed for Yıldız Technical University. The project stores campus locations such as faculties, cafes, ATMs, benches, trash bins, bus stops, and more, along with their category and coordinate information.

The database side is built with SQLite, while the web frontend utilizes React, Leaflet, and a minimal Express API.

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

To start the development server:

npm run dev

Application URL: http://localhost:5173

API URL: http://localhost:4174/api

To create a production build:

npm run build

To run the application via Express after building:

npm run preview

Sample Query

SQL
SELECT m.isim, m.aciklama, k.kategori_adi, ko.enlem, ko.boylam
FROM Mekanlar m
JOIN Kategoriler k ON m.kategori_id = k.kategori_id
JOIN Konumlar ko ON m.mekan_id = ko.mekan_id;

Note: SQL table and column names have been kept in their original Turkish form to match your database schema.

Note
When new coordinates are added to ytu_map.db, the map data updates automatically since the API reads from the same views. You can fetch the latest records while the app is running by clicking the refresh button on the left panel.
