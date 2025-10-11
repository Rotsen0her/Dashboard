import { useState } from 'react';

function Layout({ children, currentPage, onNavigate, onLogout, username, token, onShowLogin, onShowRegister }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Inicio', icon: '🏠', public: true },
    { id: 'upload', label: 'Subir Wallpaper', icon: '⬆️', public: false },
    { id: 'my-wallpapers', label: 'Mis Wallpapers', icon: '🖼️', public: false },
    { id: 'favorites', label: 'Favoritos', icon: '⭐', public: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-950">
      {/* Overlay cuando el sidebar está abierto */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-black/90 backdrop-blur-sm border-r border-purple-900/30 transform transition-transform duration-300 z-50 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo / Header del Sidebar */}
        <div className="p-6 border-b border-purple-900/30">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">
            Wallpapers
          </h2>
          <p className="text-sm text-purple-300/60 mt-1">Galería Personal</p>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setIsSidebarOpen(false);
              }}
              disabled={!item.public && !token}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                currentPage === item.id
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/50'
                  : !item.public && !token
                  ? 'text-purple-300/40 cursor-not-allowed'
                  : 'text-purple-300/80 hover:bg-purple-900/30 hover:text-white'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
              {!item.public && !token && <span className="ml-auto text-xs">🔒</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-sm border-b border-purple-900/30">
          <div className="px-4 py-4 flex items-center justify-between">
            {/* Hamburger Button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg text-purple-300 hover:bg-purple-900/30 transition-colors"
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Page Title */}
            <h1 className="text-xl font-semibold text-white">
              {menuItems.find(item => item.id === currentPage)?.label || 'Dashboard'}
            </h1>

            {/* User Menu */}
            <div className="relative">
              {token ? (
                <>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-purple-900/30 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center text-white font-semibold">
                      {username ? username.charAt(0).toUpperCase() : 'U'}
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-black/95 backdrop-blur-sm border border-purple-900/30 rounded-lg shadow-xl shadow-purple-900/20 overflow-hidden">
                      <div className="px-4 py-3 border-b border-purple-900/30">
                        <p className="text-sm font-medium text-white">{username || 'Usuario'}</p>
                        <p className="text-xs text-purple-300/60">Configuración</p>
                      </div>
                      
                      <div className="py-2">
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            // Aquí iría la lógica para cambiar usuario
                            alert('Función de cambiar usuario');
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-purple-300 hover:bg-purple-900/30 transition-colors"
                        >
                          ✏️ Cambiar Usuario
                        </button>
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            // Aquí iría la lógica para cambiar contraseña
                            alert('Función de cambiar contraseña');
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-purple-300 hover:bg-purple-900/30 transition-colors"
                        >
                          🔑 Cambiar Contraseña
                        </button>
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            if (confirm('¿Estás seguro de que quieres borrar tu cuenta? Esta acción no se puede deshacer.')) {
                              // Aquí iría la lógica para borrar cuenta
                              alert('Función de borrar cuenta');
                            }
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-900/20 transition-colors"
                        >
                          🗑️ Borrar Cuenta
                        </button>
                        <div className="border-t border-purple-900/30 my-2"></div>
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            onLogout();
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-purple-300 hover:bg-purple-900/30 transition-colors"
                        >
                          🚪 Cerrar Sesión
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* Botones de Login/Register cuando no hay usuario */
                <div className="flex items-center gap-2">
                  <button
                    onClick={onShowLogin}
                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                  >
                    Iniciar Sesión
                  </button>
                  <button
                    onClick={onShowRegister}
                    className="px-4 py-2 text-sm font-medium text-purple-300 hover:text-white hover:bg-purple-900/30 rounded-lg transition-colors"
                  >
                    Registrarse
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
