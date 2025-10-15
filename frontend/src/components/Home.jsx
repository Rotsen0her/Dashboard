import { useState, useEffect } from 'react';
import ImageView from './ImageView';

const API_URL = '/api';

function Home({ token }) {
  const [wallpapers, setWallpapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState(new Set());
  const [viewingImage, setViewingImage] = useState(null);

  useEffect(() => {
    fetchAllWallpapers();
    fetchFavorites();
  }, []);

  const fetchAllWallpapers = async () => {
    setLoading(true);
    try {
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      const response = await fetch(`${API_URL}/wallpapers`, {
        headers,
      });

      if (response.ok) {
        const data = await response.json();
        setWallpapers(data);
      } else {
        setError('Error al cargar wallpapers');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    if (!token) return; 
    
    try {
      const response = await fetch(`${API_URL}/favorites`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFavorites(new Set(data.map(fav => fav.wallpaper_url)));
      }
    } catch (err) {
      console.error('Error al cargar favoritos:', err);
    }
  };

  const toggleFavorite = async (wallpaperUrl) => {
    if (!token) {
      alert('Debes iniciar sesión para marcar favoritos');
      return;
    }

    const isFavorite = favorites.has(wallpaperUrl);
    
    try {
      const response = await fetch(`${API_URL}/favorites`, {
        method: isFavorite ? 'DELETE' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wallpaper_url: wallpaperUrl }),
      });

      if (response.ok) {
        setFavorites(prev => {
          const newFavorites = new Set(prev);
          if (isFavorite) {
            newFavorites.delete(wallpaperUrl);
          } else {
            newFavorites.add(wallpaperUrl);
          }
          return newFavorites;
        });
      }
    } catch (err) {
      console.error('Error al actualizar favorito:', err);
    }
  };

  const handleDownload = async (wallpaperUrl) => {
    try {
      const response = await fetch(wallpaperUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wallpaper-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert('Error al descargar el wallpaper');
    }
  };

  if (viewingImage) {
    return (
      <ImageView
        imageUrl={viewingImage}
        onClose={() => setViewingImage(null)}
        token={token}
        isFavorite={favorites.has(viewingImage)}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-300">Cargando wallpapers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-red-400 mb-4">❌ {error}</p>
          <button
            onClick={fetchAllWallpapers}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (wallpapers.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-6xl mb-4">🖼️</div>
          <h3 className="text-xl font-semibold text-white mb-2">No hay wallpapers disponibles</h3>
          <p className="text-purple-300/60">Sé el primero en subir un wallpaper</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Explora Wallpapers</h2>
        <p className="text-purple-300/60">Descubre wallpapers de toda la comunidad</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wallpapers.map((wallpaper, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-lg bg-gray-900 border border-purple-900/20 hover:border-purple-600/50 transition-all duration-300 shadow-lg hover:shadow-purple-600/20"
          >
            <div 
              className="relative aspect-video overflow-hidden cursor-pointer"
              onClick={() => setViewingImage(wallpaper.url || wallpaper)}
            >
              <img
                src={wallpaper.url || wallpaper}
                alt={`Wallpaper ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                loading="lazy"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center text-white text-xs font-semibold">
                        {wallpaper.username ? wallpaper.username.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <span className="text-sm text-white font-medium">
                        {wallpaper.username || 'Usuario'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(wallpaper.url || wallpaper);
                      }}
                      className="flex-1 py-2 px-3 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      Descargar
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(wallpaper.url || wallpaper);
                      }}
                      className="py-2 px-3 bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      {favorites.has(wallpaper.url || wallpaper) ? (
                        <span className="text-xl">⭐</span>
                      ) : (
                        <span className="text-xl">☆</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
