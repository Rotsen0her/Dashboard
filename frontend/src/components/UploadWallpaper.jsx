import { useState } from 'react';

const API_URL = '/api';

function UploadWallpaper({ token }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar que sea imagen
    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten imágenes');
      return;
    }

    // Validar tamaño (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('La imagen no debe superar los 10MB');
      return;
    }

    setSelectedFile(file);
    setError('');
    setSuccess('');

    // Crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Por favor selecciona una imagen');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || 'Error al subir imagen');
        return;
      }

      const data = await response.json();
      setSuccess('¡Wallpaper subido exitosamente! 🎉');
      setPreview(null);
      setSelectedFile(null);
      // Reset file input
      const fileInput = document.getElementById('file-input');
      if (fileInput) fileInput.value = '';
      
    } catch (err) {
      console.error('Error en upload:', err);
      setError('Error de conexión con el servidor');
    } finally {
      setUploading(false);
    }
  };

  const clearPreview = () => {
    setPreview(null);
    setSelectedFile(null);
    setError('');
    setSuccess('');
    document.getElementById('file-input').value = '';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Subir Wallpaper</h2>
        <p className="text-purple-300/60">Comparte tus mejores wallpapers con la comunidad</p>
      </div>

      <div className="space-y-6">
        {/* Upload Area */}
        {!preview ? (
          <label
            htmlFor="file-input"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-purple-600/50 rounded-lg cursor-pointer bg-black/30 hover:bg-purple-900/20 hover:border-purple-600 transition-all duration-300"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-16 h-16 mb-4 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="mb-2 text-lg font-semibold text-purple-300">
                Click para seleccionar imagen
              </p>
              <p className="text-sm text-purple-400/60">PNG, JPG, JPEG (MAX. 10MB)</p>
            </div>
            <input
              id="file-input"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileSelect}
            />
          </label>
        ) : (
          /* Preview Area */
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden bg-black border border-purple-900/30">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-auto max-h-96 object-contain"
              />
              <button
                onClick={clearPreview}
                className="absolute top-4 right-4 p-2 bg-black/70 backdrop-blur-sm rounded-full hover:bg-red-600/70 transition-colors"
              >
                <svg
                  className="w-6 h-6 text-white"
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
            </div>

            {/* File Info */}
            <div className="flex items-center justify-between p-4 bg-purple-900/20 rounded-lg border border-purple-900/30">
              <div>
                <p className="text-white font-medium">{selectedFile?.name}</p>
                <p className="text-sm text-purple-300/60">
                  {(selectedFile?.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={clearPreview}
                className="px-4 py-2 text-sm text-purple-300 hover:text-white transition-colors"
              >
                Cambiar imagen
              </button>
            </div>

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-purple-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-600/30"
            >
              {uploading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Subiendo...
                </span>
              ) : (
                '⬆️ Subir Wallpaper'
              )}
            </button>
          </div>
        )}

        {/* Messages */}
        {error && (
          <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-center">❌ {error}</p>
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-900/20 border border-green-500/50 rounded-lg">
            <p className="text-green-400 text-center">✅ {success}</p>
          </div>
        )}

        {/* Tips */}
        <div className="p-6 bg-purple-900/10 border border-purple-900/30 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-3">💡 Consejos para subir wallpapers</h3>
          <ul className="space-y-2 text-purple-300/80 text-sm">
            <li>• Usa imágenes de alta calidad para mejores resultados</li>
            <li>• Formatos recomendados: JPG, PNG</li>
            <li>• Resolución mínima recomendada: 1920x1080</li>
            <li>• Tamaño máximo de archivo: 10MB</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default UploadWallpaper;
