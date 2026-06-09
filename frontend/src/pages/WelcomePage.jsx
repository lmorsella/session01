import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import styles from './WelcomePage.module.css';

export default function WelcomePage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerLogo}>
          <svg viewBox="0 0 24 24" className={styles.logoIcon} aria-hidden="true">
            <circle cx="12" cy="12" r="12" fill="#1ed760" />
            <path
              d="M17.9 10.9C14.7 9 9.35 8.8 6.3 9.75c-.5.15-1-.15-1.15-.6-.15-.5.15-1 .6-1.15 3.55-1.05 9.4-.85 13.1 1.35.45.25.6.85.35 1.3-.25.35-.85.5-1.3.25zm-.1 2.9c-.25.35-.75.5-1.1.25-2.7-1.65-6.8-2.15-9.95-1.15-.4.1-.85-.1-.95-.5-.1-.4.1-.85.5-.95 3.65-1.1 8.15-.55 11.25 1.35.3.15.45.65.25 1zm-1.25 2.85c-.2.3-.6.4-.9.2-2.35-1.45-5.3-1.75-8.8-.95-.35.1-.65-.15-.75-.45-.1-.35.15-.65.45-.75 3.8-.85 7.1-.5 9.7 1.1.3.15.4.55.3.85z"
              fill="#000"
            />
          </svg>
          <span className={styles.logoText}>Spotify Clone</span>
        </div>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          CERRAR SESIÓN
        </button>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>¡Bienvenido!</h1>
          <p className={styles.heroSubtitle}>
            Has iniciado sesión correctamente. Tu música te espera.
          </p>
          <div className={styles.playButtonWrapper}>
            <button className={styles.playButton} aria-label="Reproducir">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        </section>

        <section className={styles.cardsSection}>
          <h2 className={styles.sectionTitle}>Recomendado para ti</h2>
          <div className={styles.cardsGrid}>
            {MOCK_CARDS.map((card) => (
              <div key={card.id} className={styles.card}>
                <div className={styles.cardArt} style={{ backgroundColor: card.color }}>
                  <span className={styles.cardArtEmoji} role="img" aria-label={card.title}>
                    {card.emoji}
                  </span>
                </div>
                <div className={styles.cardBody}>
                  <p className={styles.cardTitle}>{card.title}</p>
                  <p className={styles.cardSubtitle}>{card.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

const MOCK_CARDS = [
  { id: 1, title: 'Top Hits 2024', subtitle: 'Los mejores éxitos del año', color: '#1e3a5f', emoji: '🎵' },
  { id: 2, title: 'Chill Vibes', subtitle: 'Relájate y escucha', color: '#2d4a22', emoji: '🌿' },
  { id: 3, title: 'Energía Total', subtitle: 'Para entrenar fuerte', color: '#5c1a1a', emoji: '⚡' },
  { id: 4, title: 'Jazz Clásico', subtitle: 'Improvisación pura', color: '#3d2b5e', emoji: '🎷' },
  { id: 5, title: 'Pop Latino', subtitle: 'Ritmo y sabor', color: '#5e3a1a', emoji: '💃' },
  { id: 6, title: 'Rock Alternativo', subtitle: 'Distorsión y rebeldía', color: '#1a1a2e', emoji: '🎸' },
];
