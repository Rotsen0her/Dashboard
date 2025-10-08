//BORRAR CUANDO TERMINES EL DISEÑO

import { useState, useRef } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

// Componente temporal para diseño - Ver todas las páginas sin autenticación
function Preview() {
  const [view, setView] = useState('login'); // 'login', 'register', 'dashboard'
  const [position, setPosition] = useState({ x: window.innerWidth - 410, y: 10 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const navRef = useRef(null);

  const handleMouseDown = (e) => {
    // Solo permitir arrastrar si se hace clic en el área de arrastre (no en los botones)
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

  return (
    <div 
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Navegación temporal para cambiar entre vistas */}
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
            onClick={() => setView('login')}
            style={{
              padding: '8px 16px',
              background: view === 'login' ? 'linear-gradient(135deg, #7C3AED, #6B21A8)' : '#374151',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: view === 'login' ? 'bold' : 'normal',
              fontSize: '12px',
              transition: 'all 0.2s',
              boxShadow: view === 'login' ? '0 4px 12px rgba(124, 58, 237, 0.4)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (view !== 'login') e.target.style.background = '#4B5563';
            }}
            onMouseLeave={(e) => {
              if (view !== 'login') e.target.style.background = '#374151';
            }}
          >
            Login
          </button>
          <button 
            onClick={() => setView('register')}
            style={{
              padding: '8px 16px',
              background: view === 'register' ? 'linear-gradient(135deg, #7C3AED, #6B21A8)' : '#374151',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: view === 'register' ? 'bold' : 'normal',
              fontSize: '12px',
              transition: 'all 0.2s',
              boxShadow: view === 'register' ? '0 4px 12px rgba(124, 58, 237, 0.4)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (view !== 'register') e.target.style.background = '#4B5563';
            }}
            onMouseLeave={(e) => {
              if (view !== 'register') e.target.style.background = '#374151';
            }}
          >
            Register
          </button>
          <button 
            onClick={() => setView('dashboard')}
            style={{
              padding: '8px 16px',
              background: view === 'dashboard' ? 'linear-gradient(135deg, #7C3AED, #6B21A8)' : '#374151',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: view === 'dashboard' ? 'bold' : 'normal',
              fontSize: '12px',
              transition: 'all 0.2s',
              boxShadow: view === 'dashboard' ? '0 4px 12px rgba(124, 58, 237, 0.4)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (view !== 'dashboard') e.target.style.background = '#4B5563';
            }}
            onMouseLeave={(e) => {
              if (view !== 'dashboard') e.target.style.background = '#374151';
            }}
          >
            Dashboard
          </button>
        </div>
      </div>

      {/* Renderizar la vista seleccionada */}
      {view === 'login' && (
        <Login 
          onLoginSuccess={() => console.log('Login mock')}
          onSwitchToRegister={() => setView('register')}
        />
      )}
      
      {view === 'register' && (
        <Register 
          onRegisterSuccess={() => console.log('Register mock')}
          onSwitchToLogin={() => setView('login')}
        />
      )}
      
      {view === 'dashboard' && (
        <Dashboard 
          token="mock-token-for-preview"
          onLogout={() => setView('login')}
        />
      )}
    </div>
  );
}

export default Preview;
