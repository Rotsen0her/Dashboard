import { useState, useEffect } from 'react';

const API_URL = '/api';

function Dashboard({ token, onLogout }) {
  const [wallpapers, setWallpapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  // Cargar wallpapers del usuario
  useEffect(() => {
    fetchWallpapers();
  }, []);

  const fetchWallpapers = async () => {
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
        setError('Error al cargar wallpapers');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar que sea imagen
    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten imágenes');
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setWallpapers([data.url, ...wallpapers]);
        alert('¡Wallpaper subido exitosamente!');
      } else {
        setError('Error al subir imagen');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-800/50">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Panel de Wallpapers</h1>
            <button
              onClick={onLogout}
              className="rounded-lg bg-black px-4 py-2 text-sm font-semibold hover:bg-red-500"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Upload Section */}
        <div className="mb-8">
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-600 bg-gray-800 p-8 hover:border-blue-500 hover:bg-gray-700">
            <svg
              className="mb-4 h-12 w-12 text-gray-400"
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
            <span className="text-sm text-gray-400">
              {uploading ? 'Subiendo...' : 'Haz clic o arrastra una imagen para subir'}
            </span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </label>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}

        {/* Wallpapers Grid */}
        <div>
          <h2 className="mb-4 text-xl font-semibold">Mis Wallpapers</h2>
          
          {loading ? (
            <p className="text-gray-400">Cargando...</p>
          ) : wallpapers.length === 0 ? (
            <p className="text-gray-400">No tienes wallpapers aún. ¡Sube tu primero!</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {wallpapers.map((url, index) => (
                <div key={index} className="overflow-hidden rounded-lg bg-gray-800">
                  <img
                    src={url}
                    alt={`Wallpaper ${index + 1}`}
                    className="h-64 w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
