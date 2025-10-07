import { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

// ⚠️ MODO DISEÑO ACTIVADO - Cambiar DESIGN_MODE a false para volver a producción
const DESIGN_MODE = true;

function App() {
  const [currentView, setCurrentView] = useState('login'); // 'login', 'register', 'dashboard'
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  const handleLoginSuccess = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    setCurrentView('login');
  };

  //BORRAR CUANDO TERMINES EL DISEÑO
  // MODO DISEÑO: Muestra navegador para cambiar entre páginas
  if (DESIGN_MODE) {
    return (
      <div className="min-h-screen bg-gray-900">
        {/* Navegador flotante para diseño */}
        <div className="fixed top-4 right-4 z-50 flex gap-2 bg-gray-800 p-3 rounded-lg shadow-lg border border-purple-500">
          <button 
            onClick={() => setCurrentView('login')}
            className={`px-4 py-2 rounded-md font-semibold transition-all ${
              currentView === 'login' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Login
          </button>
          <button 
            onClick={() => setCurrentView('register')}
            className={`px-4 py-2 rounded-md font-semibold transition-all ${
              currentView === 'register' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Register
          </button>
          <button 
            onClick={() => setCurrentView('dashboard')}
            className={`px-4 py-2 rounded-md font-semibold transition-all ${
              currentView === 'dashboard' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Dashboard
          </button>
        </div>

        {/* Renderizar vista seleccionada */}
        {currentView === 'login' && (
          <Login 
            onLoginSuccess={() => {}}
            onSwitchToRegister={() => setCurrentView('register')}
          />
        )}
        
        {currentView === 'register' && (
          <Register 
            onRegisterSuccess={() => {}}
            onSwitchToLogin={() => setCurrentView('login')}
          />
        )}
        
        {currentView === 'dashboard' && (
          <Dashboard 
            token="design-mode-token"
            onLogout={() => setCurrentView('login')}
          />
        )}
      </div>
    );
  }




  
  // MODO PRODUCCIÓN: Flujo normal con autenticación
  return (
    <div className="min-h-screen bg-gray-900">
      {!token ? (
        <>
          {currentView === 'login' ? (
            <Login 
              onLoginSuccess={handleLoginSuccess}
              onSwitchToRegister={() => setCurrentView('register')}
            />
          ) : (
            <Register 
              onRegisterSuccess={() => setCurrentView('login')}
              onSwitchToLogin={() => setCurrentView('login')}
            />
          )}
        </>
      ) : (
        <Dashboard token={token} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
