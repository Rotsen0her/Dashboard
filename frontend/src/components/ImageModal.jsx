import { useState, useEffect } from 'react';

function ImageModal({ image, username, onClose, onToggleFavorite, isFavorite, onDownload, token }) {
  useEffect(() => {
    // Prevenir scroll del body cuando el modal está abierto
    document.body.style.overflow = 'hidden';
    
    // Cerrar con tecla ESC
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      {/* Contenido del modal */}
      <div 
        className="relative max-w-7xl max-h-[90vh] w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-2xl font-bold transition-colors z-10"
        >
          ×
        </button>

        {/* Imagen */}
        <div className="relative rounded-lg overflow-hidden shadow-2xl">
          <img
            src={image}
            alt="Wallpaper en grande"
            className="w-full h-auto max-h-[80vh] object-contain"
          />
          
          {/* Overlay con información y botones */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6">
            <div className="flex items-center justify-between">
              {/* Info del usuario */}
              {username && (
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center text-white font-semibold">
                    {username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-medium">{username}</p>
                    <p className="text-purple-300/60 text-sm">Subido por</p>
                  </div>
                </div>
              )}

              {/* Botones de acción */}
              <div className="flex items-center gap-3">
                {/* Botón de descarga */}
                <button
                  onClick={() => onDownload(image)}
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
                  Descargar
                </button>
                
                {/* Botón de favorito */}
                {token && onToggleFavorite && (
                  <button
                    onClick={() => onToggleFavorite(image)}
                    className="px-6 py-3 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white font-medium rounded-lg transition-colors flex items-center gap-2 shadow-lg"
                  >
                    {isFavorite ? (
                      <>
                        <span className="text-2xl">⭐</span>
                        <span>En Favoritos</span>
                      </>
                    ) : (
                      <>
                        <span className="text-2xl">☆</span>
                        <span>Favorito</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Instrucción */}
        <p className="text-center text-purple-300/60 text-sm mt-4">
          Presiona ESC o haz clic fuera de la imagen para cerrar
        </p>
      </div>
    </div>
  );
}

export default ImageModal;
