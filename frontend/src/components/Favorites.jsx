import { useState, useEffect } from 'react';
import ImageView from './ImageView';

const API_URL = '/api';

function Favorites({ token }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewingImage, setViewingImage] = useState(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/favorites`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFavorites(data);
      } else {
        setError('Error al cargar favoritos');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (wallpaperUrl) => {
    try {
      const response = await fetch(`${API_URL}/favorites`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wallpaper_url: wallpaperUrl }),
      });

      if (response.ok) {
        setFavorites(favorites.filter(fav => fav.wallpaper_url !== wallpaperUrl));
      }
    } catch (err) {
      alert('Error al quitar de favoritos');
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
        isFavorite={true}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-300">Cargando favoritos...</p>
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
            onClick={fetchFavorites}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-6xl mb-4">⭐</div>
          <h3 className="text-xl font-semibold text-white mb-2">No tienes favoritos aún</h3>
          <p className="text-purple-300/60">Marca wallpapers como favoritos para verlos aquí</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">⭐ Favoritos</h2>
        <p className="text-purple-300/60">
          {favorites.length} {favorites.length === 1 ? 'wallpaper favorito' : 'wallpapers favoritos'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((favorite, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-lg bg-gray-900 border border-purple-900/20 hover:border-purple-600/50 transition-all duration-300 shadow-lg hover:shadow-purple-600/20"
          >
            <div 
              className="relative aspect-video overflow-hidden cursor-pointer"
              onClick={() => setViewingImage(favorite.wallpaper_url)}
            >
              <img
                src={favorite.wallpaper_url}
                alt={`Favorito ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                loading="lazy"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center text-white text-xs font-semibold">
                      {favorite.username ? favorite.username.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="text-sm text-white font-medium">
                      {favorite.username || 'Usuario'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(favorite.wallpaper_url);
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
                        removeFavorite(favorite.wallpaper_url);
                      }}
                      className="py-2 px-3 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium rounded-lg transition-colors"
                      title="Quitar de favoritos"
                    >
                      <span className="text-lg">⭐</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="absolute top-2 right-2">
                <span className="px-3 py-1 bg-yellow-600/90 backdrop-blur-sm text-xs font-semibold text-white rounded-full flex items-center gap-1">
                  ⭐ Favorito
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Favorites;
