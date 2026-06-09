import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import styles from './LoginPage.module.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.detail || 'Credenciales inválidas. Intenta de nuevo.');
        return;
      }

      const data = await response.json();
      login(data.access_token, data.refresh_token);
      navigate('/welcome', { replace: true });
    } catch {
      setError('No se pudo conectar con el servidor. Verifica que el backend esté corriendo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logo}>
          <svg viewBox="0 0 24 24" className={styles.logoIcon} aria-hidden="true">
            <circle cx="12" cy="12" r="12" fill="#1ed760" />
            <path
              d="M17.9 10.9C14.7 9 9.35 8.8 6.3 9.75c-.5.15-1-.15-1.15-.6-.15-.5.15-1 .6-1.15 3.55-1.05 9.4-.85 13.1 1.35.45.25.6.85.35 1.3-.25.35-.85.5-1.3.25zm-.1 2.9c-.25.35-.75.5-1.1.25-2.7-1.65-6.8-2.15-9.95-1.15-.4.1-.85-.1-.95-.5-.1-.4.1-.85.5-.95 3.65-1.1 8.15-.55 11.25 1.35.3.15.45.65.25 1zm-1.25 2.85c-.2.3-.6.4-.9.2-2.35-1.45-5.3-1.75-8.8-.95-.35.1-.65-.15-.75-.45-.1-.35.15-.65.45-.75 3.8-.85 7.1-.5 9.7 1.1.3.15.4.55.3.85z"
              fill="#000"
            />
          </svg>
          <span className={styles.logoText}>Spotify Clone</span>
        </div>

        <h1 className={styles.title}>Inicia sesión en Spotify</h1>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label htmlFor="username" className={styles.label}>
              Nombre de usuario
            </label>
            <input
              id="username"
              type="text"
              className={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nombre de usuario"
              autoComplete="username"
              required
              disabled={loading}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              autoComplete="current-password"
              required
              disabled={loading}
            />
          </div>

          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading || !username || !password}
          >
            {loading ? 'INICIANDO SESIÓN...' : 'INICIAR SESIÓN'}
          </button>
        </form>

        <p className={styles.hint}>
          Credenciales de prueba: <strong>admin</strong> / <strong>admin123</strong>
        </p>
      </div>
    </div>
  );
}
