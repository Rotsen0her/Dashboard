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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-950">
      {/* Header con botón de volver */}
      <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-sm border-b border-purple-900/30">
        <div className="px-4 py-4 flex items-center justify-between max-w-7xl mx-auto">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 text-purple-300 hover:text-white transition-colors"
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Volver
          </button>

          <h1 className="text-xl font-semibold text-white">Ver Wallpaper</h1>

          <div className="w-24"></div> {/* Espaciador para centrar el título */}
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto p-4 lg:p-8">
        <div className="space-y-6">
          {/* Imagen */}
          <div className="relative rounded-lg overflow-hidden shadow-2xl shadow-purple-900/20 border border-purple-900/30">
            <img
              src={imageUrl}
              alt="Wallpaper"
              className="w-full h-auto"
            />
          </div>

          {/* Información y botones */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-900/30 rounded-lg p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              {/* Info del usuario */}
              {username && (
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center text-white text-lg font-semibold">
                    {username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-medium text-lg">{username}</p>
                    <p className="text-purple-300/60 text-sm">Subido por</p>
                  </div>
                </div>
              )}

              {/* Botones de acción */}
              <div className="flex items-center gap-3">
                {/* Botón de descarga */}
                <button
                  onClick={handleDownload}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2 shadow-lg"
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
                  Descargar Wallpaper
                </button>
                
                {/* Botón de favorito */}
                {token && (
                  <button
                    onClick={handleToggleFavorite}
                    className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2 shadow-lg"
                  >
                    {isFavorite ? (
                      <>
                        <span className="text-2xl">⭐</span>
                        <span>En Favoritos</span>
                      </>
                    ) : (
                      <>
                        <span className="text-2xl">☆</span>
                        <span>Marcar Favorito</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ImageView;
