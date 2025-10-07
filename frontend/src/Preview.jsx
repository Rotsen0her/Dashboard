//BORRAR CUANDO TERMINES EL DISEÑO

import { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

// Componente temporal para diseño - Ver todas las páginas sin autenticación
function Preview() {
  const [view, setView] = useState('login'); // 'login', 'register', 'dashboard'

  return (
    <div>
      {/* Navegación temporal para cambiar entre vistas */}
      <div style={{ 
        position: 'fixed', 
        top: 10, 
        right: 10, 
        zIndex: 9999,
        background: 'rgba(0,0,0,0.8)',
        padding: '10px',
        borderRadius: '8px',
        display: 'flex',
        gap: '10px'
      }}>
        <button 
          onClick={() => setView('login')}
          style={{
            padding: '8px 16px',
            background: view === 'login' ? '#7C3AED' : '#374151',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: view === 'login' ? 'bold' : 'normal'
          }}
        >
          Login
        </button>
        <button 
          onClick={() => setView('register')}
          style={{
            padding: '8px 16px',
            background: view === 'register' ? '#7C3AED' : '#374151',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: view === 'register' ? 'bold' : 'normal'
          }}
        >
          Register
        </button>
        <button 
          onClick={() => setView('dashboard')}
          style={{
            padding: '8px 16px',
            background: view === 'dashboard' ? '#7C3AED' : '#374151',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: view === 'dashboard' ? 'bold' : 'normal'
          }}
        >
          Dashboard
        </button>
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
