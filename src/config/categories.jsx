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
  tuvalet: { label: 'Tuvalet', color: '#72aee6', icon: Bath },
  ytu_ozel: { label: 'YTÜ Özel', color: '#4da3ff', icon: Utensils }
};

export function getCategoryMeta(category) {
  return meta[category] || meta.diger;
}

export function CategoryIcon({ category, size = 18 }) {
  const Icon = getCategoryMeta(category).icon;
  return <Icon size={size} strokeWidth={2.2} />;
}
