import { useState, useEffect } from 'react';
import ImageView from './ImageView';

const API_URL = '/api';

function MyWallpapers({ token }) {
  const [wallpapers, setWallpapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewingImage, setViewingImage] = useState(null);

  useEffect(() => {
    fetchMyWallpapers();
  }, []);

  const fetchMyWallpapers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/my-wallpapers`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setWallpapers(data);
      } else {
        setError('Error al cargar tus wallpapers');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (wallpaperUrl) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este wallpaper?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/wallpaper`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: wallpaperUrl }),
      });

      if (response.ok) {
        setWallpapers(wallpapers.filter(w => w !== wallpaperUrl && w.url !== wallpaperUrl));
        alert('Wallpaper eliminado exitosamente');
      } else {
        alert('Error al eliminar el wallpaper');
      }
    } catch (err) {
      alert('Error de conexión');
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
        isFavorite={false}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-300">Cargando tus wallpapers...</p>
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
            onClick={fetchMyWallpapers}
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
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-xl font-semibold text-white mb-2">No tienes wallpapers aún</h3>
          <p className="text-purple-300/60 mb-6">Sube tu primer wallpaper para empezar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Mis Wallpapers</h2>
        <p className="text-purple-300/60">
          {wallpapers.length} {wallpapers.length === 1 ? 'wallpaper' : 'wallpapers'} en tu colección
        </p>
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
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center justify-between gap-2">
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
                        handleDelete(wallpaper.url || wallpaper);
                      }}
                      className="py-2 px-3 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="px-2 py-1 bg-black/70 backdrop-blur-sm text-xs text-white rounded-full">
                  Tuyo
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyWallpapers;
