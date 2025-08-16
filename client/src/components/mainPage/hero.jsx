"use client"

import styles from "./hero.module.css";
import teamCollab from '../../assets/undraw_online-collaboration_xon8.svg';
import { useAuth } from '../common/UserContext';

export default function Hero({ onStart }) {
  const { user } = useAuth();
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroGrid}>
        {/* Content */}
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Organiza tareas en equipo de forma simple y efectiva
          </h1>
          <p className={styles.heroSubtitle}>
            WeDo Taskys te ayuda a coordinar proyectos, distribuir responsabilidades y hacer seguimiento del progreso en tiempo real.
          </p>
          <div className={styles.heroButtons}>
            <button type="button" className={styles.startButton} onClick={onStart}>
              Comenzar ahora
            </button>
            <button type="button" className={styles.demoButton}>
              Ver demostración
            </button>
          </div>
        </div>

        {/* Ilustración */}
        <div className={styles.heroIllustration}>
          <img 
            src={teamCollab} 
            alt="Colaboración en equipo" 
            className={styles.heroImage}
          />
        </div>
      </div>
      {/* Apartado destacado para grupos */}
      <div style={{
        margin: '2.5rem auto 0',
        maxWidth: 600,
        background: '#fff',
        borderRadius: '18px',
        boxShadow: '0 8px 32px rgba(102,126,234,0.10)',
        padding: '2.5rem 2rem',
        textAlign: 'center',
        border: '2px solid #667eea',
        position: 'relative',
        top: 0
      }}>
        <h2 style={{color:'#667eea', fontWeight:700, fontSize:'2rem', marginBottom:'1rem'}}>Grupos de Trabajo</h2>
        <p style={{color:'#4a5568', fontSize:'1.1rem', marginBottom:'2rem'}}>Gestiona tus grupos, colabora y comparte tareas con tu equipo.</p>
        {user ? (
          <button
            className={styles.startButton}
            style={{ fontSize: '1.1rem', padding: '1rem 2.5rem', background: '#667eea', color: 'white', borderRadius: '12px', marginTop: '0.5rem' }}
            onClick={() => window.dispatchEvent(new CustomEvent('goToGroups'))}
          >
            Ir a Mis Grupos
          </button>
        ) : (
          <>
            <p style={{color:'#dc2626', fontWeight:600, marginBottom:'1rem'}}>Debes iniciar sesión o registrarte para acceder a tus grupos.</p>
            <button
              className={styles.startButton}
              style={{ fontSize: '1.1rem', padding: '1rem 2.5rem', background: '#667eea', color: 'white', borderRadius: '12px', marginTop: '0.5rem' }}
              onClick={onStart}
            >
              Iniciar sesión o Registrarse
            </button>
          </>
        )}
      </div>
    </section>
  )
}
