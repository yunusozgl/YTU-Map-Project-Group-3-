import { useCallback, useEffect, useState } from 'react';
import CampusMap from './components/CampusMap.jsx';
import Sidebar from './components/Sidebar.jsx';
import { getCategories, getPlaces, getStats } from './api/mapApi.js';

export default function App() {
  const [categories, setCategories] = useState([]);
  const [places, setPlaces] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadMeta() {
      try {
        const [categoryData, statData] = await Promise.all([
          getCategories(),
          getStats()
        ]);

        if (!cancelled) {
          setCategories(categoryData.categories);
          setStats(statData);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message);
        }
      }
    }

    loadMeta();

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    const timeoutId = window.setTimeout(async () => {
      try {
        const data = await getPlaces({
          category: selectedCategory,
          query: search.trim()
        });

        if (!cancelled) {
          setPlaces(data.places);
          setSelectedPlace((current) => {
            if (!current) {
              return null;
            }

            return data.places.some((place) => place.id === current.id) ? current : null;
          });
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }, 180);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [selectedCategory, search, refreshKey]);

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
    setSelectedPlace(null);
  }, []);

  return (
    <main className="app-shell">
      <Sidebar
        categories={categories}
        places={places}
        selectedCategory={selectedCategory}
        search={search}
        stats={stats}
        loading={loading}
        error={error}
        selectedPlace={selectedPlace}
        onCategoryChange={handleCategoryChange}
        onSearchChange={setSearch}
        onSelectPlace={setSelectedPlace}
        onRefresh={() => setRefreshKey((key) => key + 1)}
      />
      <section className="map-stage" aria-label="YTU kampüs haritası">
        <CampusMap
          places={places}
          selectedPlace={selectedPlace}
          onSelectPlace={setSelectedPlace}
        />
        <div className="map-badge">
          <strong>{selectedCategory === 'all' ? 'Tüm kampüs' : categories.find((item) => item.id === selectedCategory)?.label}</strong>
          <span>{loading ? 'Veri güncelleniyor' : `${places.length} nokta gösteriliyor`}</span>
        </div>
      </section>
    </main>
  );
}
