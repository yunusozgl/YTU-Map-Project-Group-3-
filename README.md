# YTU-Map-Project-Group-3-
## Project Description
This project is a campus map database designed for Yildiz Technical University. Its purpose is to store important campus locations such as faculty buildings, cafeterias, libraries, sports areas, and other facilities together with their categories and geographic coordinates.

The system allows map-based access to campus data and supports filtering by category. It is designed as a relational SQL project using SQLite and Python.

## Why This Project Matters
Finding locations inside a university campus can be difficult for students, visitors, and staff. This project helps organize campus location data in a structured way and makes it easier to retrieve and display places on a digital map. It is a practical real-life database application.

## Technologies Used
- SQLite
- Python
- Pandas
- OpenPyXL

## Database Schema
The core schema currently includes the following tables:
- **Kategoriler**: stores category names
- **Mekanlar**: stores place names and descriptions
- **Konumlar**: stores latitude and longitude values for each place

### Relationships
- One category can have many places
- One place has one coordinate record

## Planned / Implemented SQL Features
- JOINs
- Views
- Aggregation with COUNT and GROUP BY
- Filtering by category
- Sample queries for map display

## Views
- **vw_harita_verisi**: combines places, categories, and coordinates in one logical structure
- **vw_kategori_listesi**: provides category names for the filter menu

## Example Queries
### 1. Get all map data
```sql
SELECT m.isim, m.aciklama, k.kategori_adi, ko.enlem, ko.boylam
FROM Mekanlar m
JOIN Kategoriler k ON m.kategori_id = k.kategori_id
JOIN Konumlar ko ON m.mekan_id = ko.mekan_id;
