"use client"

import styles from "./hero.module.css";
import teamCollab from '../../assets/undraw_online-collaboration_xon8.svg';
import { useAuth } from '../common/UserContext';
import { useI18n } from '../common/I18nContext';

export default function Hero({ onStart }) {
  const { user } = useAuth();
  const { t } = useI18n();
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroGrid}>
        {/* Content */}
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            {t('hero.title')}
          </h1>
          <p className={styles.heroSubtitle}>
            {t('hero.subtitle')}
          </p>
          <div className={styles.heroButtons}>
            <button type="button" className={styles.startButton} onClick={onStart}>
              {t('hero.start')}
            </button>
            <button type="button" className={styles.demoButton}>
              {t('hero.demo')}
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
        <h2 style={{color:'#667eea', fontWeight:700, fontSize:'2rem', marginBottom:'1rem'}}>{t('hero.groupTitle')}</h2>
        <p style={{color:'#4a5568', fontSize:'1.1rem', marginBottom:'2rem'}}>{t('hero.groupSubtitle')}</p>
        {user ? (
          <button
            className={styles.startButton}
            style={{ fontSize: '1.1rem', padding: '1rem 2.5rem', background: '#667eea', color: 'white', borderRadius: '12px', marginTop: '0.5rem' }}
            onClick={() => window.dispatchEvent(new CustomEvent('goToGroups'))}
          >
            {t('hero.goGroups')}
          </button>
        ) : (
          <>
            <p style={{color:'#dc2626', fontWeight:600, marginBottom:'1rem'}}>{t('hero.needLogin')}</p>
            <button
              className={styles.startButton}
              style={{ fontSize: '1.1rem', padding: '1rem 2.5rem', background: '#667eea', color: 'white', borderRadius: '12px', marginTop: '0.5rem' }}
              onClick={onStart}
            >
              {t('hero.loginOrRegister')}
            </button>
          </>
        )}
      </div>
    </section>
  )
}
