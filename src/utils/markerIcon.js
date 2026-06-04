import L from 'leaflet';
import { getCategoryMeta } from '../config/categories.jsx';

export function createMarkerIcon(category, active = false) {
  const { color } = getCategoryMeta(category);
  const size = active ? 38 : 30;

  return L.divIcon({
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
    html: `
      <span
        class="map-marker ${active ? 'map-marker--active' : ''}"
        style="--marker-color: ${color}; width: ${size}px; height: ${size}px;"
      >
        <span></span>
      </span>
    `
  });
}
