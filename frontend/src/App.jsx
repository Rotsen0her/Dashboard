import { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Layout from './components/Layout';
import Home from './components/Home';
import UploadWallpaper from './components/UploadWallpaper';
import MyWallpapers from './components/MyWallpapers';
import Favorites from './components/Favorites';

function App() {
  const [showAuthModal, setShowAuthModal] = useState(null); // 'login', 'register', null
  const [currentPage, setCurrentPage] = useState('home');
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [username, setUsername] = useState(localStorage.getItem('username') || null);

  const handleLoginSuccess = (newToken, user) => {
    setToken(newToken);
    setUsername(user);
    localStorage.setItem('token', newToken);
    localStorage.setItem('username', user);
    setShowAuthModal(null);
  };

  const handleLogout = () => {
    setToken(null);
    setUsername(null);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setCurrentPage('home');
  };

  const handleNavigate = (page) => {
    if (!token && (page === 'upload' || page === 'my-wallpapers' || page === 'favorites')) {
      setShowAuthModal('login');
      return;
    }
    setCurrentPage(page);
  };
  return (
    <>
      <Layout
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        username={username}
        token={token}
        onShowLogin={() => setShowAuthModal('login')}
        onShowRegister={() => setShowAuthModal('register')}
      >
        {currentPage === 'home' && <Home token={token} />}
        {currentPage === 'upload' && token && <UploadWallpaper token={token} />}
        {currentPage === 'my-wallpapers' && token && <MyWallpapers token={token} />}
        {currentPage === 'favorites' && token && <Favorites token={token} />}
      </Layout>

      {showAuthModal === 'login' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="relative">
            <button
              onClick={() => setShowAuthModal(null)}
              className="absolute -top-4 -right-4 z-10 w-10 h-10 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg"
            >
              ×
            </button>
            <Login 
              onLoginSuccess={handleLoginSuccess}
              onSwitchToRegister={() => setShowAuthModal('register')}
            />
          </div>
        </div>
      )}

      {showAuthModal === 'register' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="relative">
            <button
              onClick={() => setShowAuthModal(null)}
              className="absolute -top-4 -right-4 z-10 w-10 h-10 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg"
            >
              ×
            </button>
            <Register 
              onRegisterSuccess={() => setShowAuthModal('login')}
              onSwitchToLogin={() => setShowAuthModal('login')}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default App;
