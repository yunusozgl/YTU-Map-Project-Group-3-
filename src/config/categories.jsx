import { renderToStaticMarkup } from 'react-dom/server';
import {
  Armchair,
  Bath,
  Bed,
  Building2,
  Bus,
  Car,
  CircleDollarSign,
  Coffee,
  Dumbbell,
  Church,
  Landmark,
  MapPin,
  School,
  ShoppingBasket,
  Store,
  Trees,
  Trash2,
  Utensils
} from 'lucide-react';

// Generate SVG strings from Lucide React icons
function generateIconSVG(IconComponent) {
  try {
    return renderToStaticMarkup(
      <IconComponent size={20} strokeWidth={2.2} color="white" />
    );
  } catch (error) {
    console.error('Error generating SVG:', error);
    return '';
  }
}

// Custom SVG icons for maps
const customSVGs = {
  tuvalet: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
    <rect x="2" y="4" width="20" height="16" rx="1"/>
    <foreignObject x="4" y="8" width="16" height="8">
      <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 12px; font-family: Arial, sans-serif; color: white;">WC</div>
    </foreignObject>
  </svg>`,
  ytu_ozel: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>`
};

const meta = {
  ataturk: { label: 'Atatürk', color: '#69a7f5', icon: Landmark },
  atm: { label: 'ATM', color: '#53b6d7', icon: CircleDollarSign },
  bank: { label: 'Bank', color: '#7db5ff', icon: Armchair },
  cafe: { label: 'Kafe', color: '#f1a875', icon: Coffee },
  cop_kovasi: { label: 'Çöp Kovası', color: '#62b987', icon: Trash2 },
  diger: { label: 'Diğer', color: '#8b98a8', icon: MapPin },
  fakulteler: { label: 'Fakülteler', color: '#5d91df', icon: School },
  ibadethane: { label: 'İbadethane', color: '#69b0ba', icon: Church },
  idari_binalar: { label: 'İdari Binalar', color: '#8fa2cf', icon: Building2 },
  is_yerleri: { label: 'İş Yerleri', color: '#c69be8', icon: Store },
  market: { label: 'Market', color: '#f2c96d', icon: ShoppingBasket },
  ogrenci_yurdu: { label: 'Öğrenci Yurdu', color: '#7fcaad', icon: Bed },
  otobus_duragi: { label: 'Otobüs Durağı', color: '#53a7e0', icon: Bus },
  otopark: { label: 'Otopark', color: '#98a8bd', icon: Car },
  sosyal_alanlar: { label: 'Sosyal Alanlar', color: '#75c9d5', icon: Trees },
  spor_alanlari: { label: 'Spor Alanları', color: '#ef8f93', icon: Dumbbell },
  tuvalet: { label: 'Tuvalet', color: '#72aee6', icon: null, customSvg: customSVGs.tuvalet },
  ytu_ozel: { label: 'YTÜ Özel', color: '#4da3ff', icon: null, customSvg: customSVGs.ytu_ozel }
};

// Memoize SVG generation
const svgCache = {};

export function getIconSVG(category) {
  if (svgCache[category]) {
    return svgCache[category];
  }
  const categoryMeta = meta[category] || meta.diger;
  
  // Use custom SVG if available
  if (categoryMeta.customSvg) {
    svgCache[category] = categoryMeta.customSvg;
    return categoryMeta.customSvg;
  }
  
  // Otherwise generate from Lucide icon
  const svg = generateIconSVG(categoryMeta.icon);
  svgCache[category] = svg;
  return svg;
}

export function getCategoryMeta(category) {
  return meta[category] || meta.diger;
}

export function CategoryIcon({ category, size = 18 }) {
  const categoryMeta = getCategoryMeta(category);
  
  // Custom rendering for special categories
  if (category === 'tuvalet') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size, width: size, height: size }}>
        🚻
      </div>
    );
  }
  
  if (category === 'ytu_ozel') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    );
  }
  
  // Default Lucide icon
  const Icon = categoryMeta.icon;
  return Icon ? <Icon size={size} strokeWidth={2.2} /> : null;
}
