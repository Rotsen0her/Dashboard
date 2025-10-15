import { useEffect, useState } from 'react';

const API_URL = '/api';

function ImageView({ imageUrl, username, onClose, token, isFavorite: initialFavorite, onToggleFavorite }) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite || false);

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
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

  const handleToggleFavorite = async () => {
    if (!token) {
      alert('Debes iniciar sesión para marcar favoritos');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/favorites`, {
        method: isFavorite ? 'DELETE' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wallpaper_url: imageUrl }),
      });

      if (response.ok) {
        setIsFavorite(!isFavorite);
        if (onToggleFavorite) onToggleFavorite(imageUrl);
      }
    } catch (err) {
      console.error('Error al actualizar favorito:', err);
    }
  };

  useEffect(() => {
    // Prevenir scroll cuando está abierto
    document.body.style.overflow = 'hidden';
    
    // Cerrar con ESC
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="min-h-screen p-4 md:p-6 lg:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar flotante */}
        <button
          onClick={onClose}
          className="fixed top-4 right-4 z-10 w-12 h-12 bg-black/80 hover:bg-purple-600 border border-purple-900/50 rounded-full flex items-center justify-center text-white transition-all shadow-lg hover:scale-110"
          aria-label="Cerrar"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Container principal */}
        <div className="max-w-7xl mx-auto space-y-4 md:space-y-6 pt-16 md:pt-4">
          {/* Imagen */}
          <div className="relative rounded-xl overflow-hidden shadow-2xl shadow-purple-900/30 border border-purple-900/30 bg-black">
            <img
              src={imageUrl}
              alt="Wallpaper"
              className="w-full h-auto max-h-[70vh] object-contain"
            />
          </div>

          {/* Panel de información y acciones */}
          <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-md border border-purple-900/30 rounded-xl p-4 md:p-6 shadow-xl">
            <div className="space-y-4">
              {/* Info del usuario */}
              {username && (
                <div className="flex items-center space-x-3 pb-4 border-b border-purple-900/30">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center text-white text-lg md:text-xl font-semibold shadow-lg">
                    {username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-medium text-base md:text-lg">{username}</p>
                    <p className="text-purple-300/70 text-xs md:text-sm">Subido por</p>
                  </div>
                </div>
              )}

              {/* Botones de acción - Responsive */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Botón de descarga */}
                <button
                  onClick={handleDownload}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-600/50 hover:scale-[1.02]"
                >
                  <svg
                    className="w-5 h-5"
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
                  <span className="hidden sm:inline">Descargar</span>
                  <span className="sm:hidden">Descargar Wallpaper</span>
                </button>
                
                {/* Botón de favorito */}
                {token && (
                  <button
                    onClick={handleToggleFavorite}
                    className={`flex-1 px-4 py-3 font-medium rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] ${
                      isFavorite 
                        ? 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white hover:shadow-yellow-600/50' 
                        : 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-purple-600 hover:to-purple-700 text-white hover:shadow-purple-600/50'
                    }`}
                  >
                    <span className="text-xl">
                      {isFavorite ? '⭐' : '☆'}
                    </span>
                    <span className="hidden sm:inline">
                      {isFavorite ? 'En Favoritos' : 'Favorito'}
                    </span>
                    <span className="sm:hidden">
                      {isFavorite ? 'Quitar de Favoritos' : 'Marcar como Favorito'}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageView;
