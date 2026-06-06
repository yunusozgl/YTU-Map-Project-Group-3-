import L from 'leaflet';
import { getCategoryMeta, getIconSVG } from '../config/categories.jsx';

export function createMarkerIcon(category, active = false) {
  const { color } = getCategoryMeta(category);
  const size = active ? 38 : 30;
  const iconSize = size * 0.65;
  
  let html = '';
  
  // Special handling for tuvalet - use emoji
  if (category === 'tuvalet') {
    const fontSize = Math.round(size * 0.5); // Daha küçük boyut
    html = `
      <span class="map-marker ${active ? 'map-marker--active' : ''}" style="--marker-color: ${color}; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center; font-size: ${fontSize}px; line-height: 1;">
        🚻
      </span>
    `;
  } else {
    const svg = getIconSVG(category);
    html = `
      <span class="map-marker ${active ? 'map-marker--active' : ''}" style="--marker-color: ${color}; width: ${size}px; height: ${size}px;">
        <span class="map-marker-icon" style="width: ${iconSize}px; height: ${iconSize}px;">
          ${svg}
        </span>
      </span>
    `;
  }

  return L.divIcon({
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
    html: html
  });
}
