import { useEffect, useMemo } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import { CategoryIcon } from '../config/categories.jsx';
import { createMarkerIcon } from '../utils/markerIcon.js';

const defaultCenter = [41.0274, 28.8904];

function MapViewport({ places, selectedPlace }) {
  const map = useMap();

  useEffect(() => {
    if (selectedPlace) {
      map.flyTo([selectedPlace.lat, selectedPlace.lng], 18, { duration: 0.6 });
      return;
    }

    if (places.length > 1) {
      const bounds = L.latLngBounds(places.map((place) => [place.lat, place.lng]));
      map.fitBounds(bounds, { padding: [42, 42], maxZoom: 18 });
    } else if (places.length === 1) {
      map.flyTo([places[0].lat, places[0].lng], 18, { duration: 0.5 });
    }
  }, [map, places, selectedPlace]);

  return null;
}

export default function CampusMap({ places, selectedPlace, onSelectPlace }) {
  const activeId = selectedPlace?.id;
  const center = useMemo(() => {
    if (!places.length) {
      return defaultCenter;
    }

    return [
      places.reduce((sum, place) => sum + place.lat, 0) / places.length,
      places.reduce((sum, place) => sum + place.lng, 0) / places.length
    ];
  }, [places]);

  return (
    <MapContainer center={center} zoom={16} minZoom={14} maxZoom={20} zoomControl={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapViewport places={places} selectedPlace={selectedPlace} />

      {places.map((place) => (
        <Marker
          key={place.id}
          position={[place.lat, place.lng]}
          icon={createMarkerIcon(place.category, activeId === place.id)}
          eventHandlers={{
            click: () => onSelectPlace(place)
          }}
        >
          <Popup>
            <div className="popup-card">
              <div className="popup-category">
                <CategoryIcon category={place.category} size={15} />
                <span>{place.categoryLabel}</span>
              </div>
              <strong>{place.name}</strong>
              {place.description && <p>{place.description}</p>}
              <small>
                {place.lat.toFixed(6)}, {place.lng.toFixed(6)}
              </small>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
