import { useState } from 'react';

const API_URL = '/api';

function Register({ onRegisterSuccess, onSwitchToLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('¡Registro exitoso! Ahora puedes iniciar sesión');
        onRegisterSuccess();
      } else {
        setError(data.message || 'Error al registrarse');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-950/20 via-black to-purple-950/20" />
      <div className="relative w-full max-w-md">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-900 rounded-2xl blur-xl opacity-20" />
        <div className="relative space-y-8 rounded-2xl border border-purple-900/30 bg-black/90 p-8 backdrop-blur-sm">
          <div className="text-center">
            <div className="mb-2 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-purple-900">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className="text-3xl font-light tracking-tight text-white">
              Crear cuenta
            </h2>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="username" className="text-xs font-medium uppercase tracking-wider text-purple-400/80">
                Usuario
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full rounded-lg border border-purple-900/30 bg-black/50 px-4 py-3 text-white placeholder-purple-400/30 transition-all focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/30"
                placeholder="Elige un usuario"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-xs font-medium uppercase tracking-wider text-purple-400/80">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-lg border border-purple-900/30 bg-black/50 px-4 py-3 text-white placeholder-purple-400/30 transition-all focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/30"
                placeholder="Crea una contraseña"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-xs font-medium uppercase tracking-wider text-purple-400/80">
                Confirmar Contraseña
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full rounded-lg border border-purple-900/30 bg-black/50 px-4 py-3 text-white placeholder-purple-400/30 transition-all focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/30"
                placeholder="Confirma tu contraseña"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-red-900/30 bg-red-950/20 p-3">
                <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-purple-600 to-purple-900 px-4 py-3 font-medium text-white transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-600/50 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creando cuenta...
                  </>
                ) : (
                  <>
                    Crear cuenta
                    <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </span>
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-purple-900/30" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black px-2 text-purple-400/60">o</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onSwitchToLogin}
              className="w-full rounded-lg border border-purple-900/30 px-4 py-3 text-sm font-medium text-purple-300 transition-all hover:border-purple-600/50 hover:bg-purple-950/20"
            >
              ¿Ya tienes cuenta? Inicia sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;

