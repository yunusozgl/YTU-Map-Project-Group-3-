import {
  Database,
  Layers,
  MapPin,
  RefreshCw,
  Search,
  Sparkles
} from 'lucide-react';
import { CategoryIcon, getCategoryMeta } from '../config/categories.jsx';

function CategoryButton({ category, active, onClick }) {
  const meta = getCategoryMeta(category.id);

  return (
    <button
      className={`category-button ${active ? 'is-active' : ''}`}
      type="button"
      onClick={onClick}
      style={{ '--category-color': meta.color }}
      title={category.label}
    >
      <CategoryIcon category={category.id} size={17} />
      <span>{category.label}</span>
      <small>{category.count}</small>
    </button>
  );
}

function PlaceRow({ place, active, onClick }) {
  const meta = getCategoryMeta(place.category);

  return (
    <button
      className={`place-row ${active ? 'is-active' : ''}`}
      type="button"
      onClick={onClick}
      style={{ '--category-color': meta.color }}
    >
      <span className="place-row__icon">
        <CategoryIcon category={place.category} size={17} />
      </span>
      <span className="place-row__content">
        <strong>{place.name}</strong>
        <span>{place.description || place.categoryLabel}</span>
      </span>
    </button>
  );
}

export default function Sidebar({
  categories,
  places,
  selectedCategory,
  search,
  stats,
  loading,
  error,
  selectedPlace,
  onCategoryChange,
  onSearchChange,
  onSelectPlace,
  onRefresh
}) {
  const allCategory = {
    id: 'all',
    label: 'Tümü',
    count: stats?.totalPlaces || places.length
  };

  return (
    <aside className="sidebar">
      <header className="brand">
        <span className="brand__mark">
          <MapPin size={22} />
        </span>
        <span>
          <h1>ytumap</h1>
          <p>Yıldız Teknik Üniversitesi</p>
        </span>
      </header>

      <section className="stats-grid" aria-label="Özet">
        <div>
          <Database size={17} />
          <strong>{stats?.totalPlaces ?? places.length}</strong>
          <span>konum</span>
        </div>
        <div>
          <Layers size={17} />
          <strong>{stats?.totalCategories ?? categories.length}</strong>
          <span>kategori</span>
        </div>
      </section>

      <label className="search-box">
        <Search size={18} />
        <input
          type="search"
          value={search}
          placeholder="Mekan, açıklama veya kategori ara"
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </label>

      <section className="category-section" aria-label="Kategoriler">
        <CategoryButton
          category={allCategory}
          active={selectedCategory === 'all'}
          onClick={() => onCategoryChange('all')}
        />

        {categories.map((category) => (
          <CategoryButton
            key={category.id}
            category={category}
            active={selectedCategory === category.id}
            onClick={() => onCategoryChange(category.id)}
          />
        ))}
      </section>

      <section className="places-panel" aria-label="Mekanlar">
        <div className="places-panel__header">
          <span>
            <Sparkles size={16} />
            {loading ? 'Yükleniyor' : `${places.length} kayıt`}
          </span>
          <button className="icon-button" type="button" onClick={onRefresh} title="Veriyi yenile">
            <RefreshCw size={17} />
          </button>
        </div>

        {error && <div className="notice">{error}</div>}

        <div className="place-list">
          {!loading && !places.length && <div className="notice">Sonuç bulunamadı.</div>}

          {places.map((place) => (
            <PlaceRow
              key={place.id}
              place={place}
              active={selectedPlace?.id === place.id}
              onClick={() => onSelectPlace(place)}
            />
          ))}
        </div>
      </section>
    </aside>
  );
}
