import { useState, useRef } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

// ⚠️ MODO DISEÑO ACTIVADO - Cambiar DESIGN_MODE a false para volver a producción
const DESIGN_MODE = true;

function App() {
  const [currentView, setCurrentView] = useState('login'); // 'login', 'register', 'dashboard'
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [position, setPosition] = useState({ x: window.innerWidth - 410, y: 16 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const navRef = useRef(null);

  const handleMouseDown = (e) => {
    if (e.target.classList.contains('drag-handle')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

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
      <div 
        className="min-h-screen bg-gray-900"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Navegador flotante para diseño - ARRASTRABLE */}
        <div 
          ref={navRef}
          style={{ 
            position: 'fixed', 
            left: `${position.x}px`,
            top: `${position.y}px`,
            zIndex: 9999,
            background: 'rgba(0,0,0,0.9)',
            padding: '4px',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            border: '1px solid rgba(124, 58, 237, 0.3)',
            boxShadow: '0 10px 40px rgba(124, 58, 237, 0.3)',
            cursor: isDragging ? 'grabbing' : 'default',
            userSelect: 'none'
          }}
          onMouseDown={handleMouseDown}
        >
          {/* Área de arrastre */}
          <div 
            className="drag-handle"
            style={{
              padding: '8px',
              textAlign: 'center',
              cursor: 'grab',
              borderBottom: '1px solid rgba(124, 58, 237, 0.2)',
              color: '#A78BFA',
              fontSize: '10px',
              fontWeight: 'bold',
              letterSpacing: '1px',
              textTransform: 'uppercase'
            }}
          >
            ⋮⋮⋮ Modo Diseño
          </div>

          {/* Botones */}
          <div style={{ display: 'flex', gap: '6px', padding: '4px' }}>
            <button 
              onClick={() => setCurrentView('login')}
              style={{
                padding: '8px 16px',
                background: currentView === 'login' ? 'linear-gradient(135deg, #7C3AED, #6B21A8)' : '#374151',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: currentView === 'login' ? 'bold' : 'normal',
                fontSize: '12px',
                transition: 'all 0.2s',
                boxShadow: currentView === 'login' ? '0 4px 12px rgba(124, 58, 237, 0.4)' : 'none'
              }}
            >
              Login
            </button>
            <button 
              onClick={() => setCurrentView('register')}
              style={{
                padding: '8px 16px',
                background: currentView === 'register' ? 'linear-gradient(135deg, #7C3AED, #6B21A8)' : '#374151',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: currentView === 'register' ? 'bold' : 'normal',
                fontSize: '12px',
                transition: 'all 0.2s',
                boxShadow: currentView === 'register' ? '0 4px 12px rgba(124, 58, 237, 0.4)' : 'none'
              }}
            >
              Register
            </button>
            <button 
              onClick={() => setCurrentView('dashboard')}
              style={{
                padding: '8px 16px',
                background: currentView === 'dashboard' ? 'linear-gradient(135deg, #7C3AED, #6B21A8)' : '#374151',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: currentView === 'dashboard' ? 'bold' : 'normal',
                fontSize: '12px',
                transition: 'all 0.2s',
                boxShadow: currentView === 'dashboard' ? '0 4px 12px rgba(124, 58, 237, 0.4)' : 'none'
              }}
            >
              Dashboard
            </button>
          </div>
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
