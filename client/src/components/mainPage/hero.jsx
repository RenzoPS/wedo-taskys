"use client"

import styles from "./hero.module.css";
import teamCollab from '../../assets/undraw_online-collaboration_xon8.svg';
import { useAuth } from '../common/UserContext';
import { useI18n } from '../common/I18nContext';

export default function Hero({ onStart, onGroups }) {
  const { user } = useAuth();
  const { t } = useI18n();
  
  const handleStartClick = () => {
    if (user) {
      onGroups();
    } else {
      onStart();
    }
  };
  
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroGrid}>
        {/* Content */}
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span>{t('hero.badge')}</span>
          </div>
          <h1 className={styles.heroTitle}>
            {t('hero.title')}
          </h1>
          <p className={styles.heroSubtitle}>
            {t('hero.subtitle')}
          </p>
          <div className={styles.heroButtons}>
            <button type="button" className={styles.startButton} onClick={handleStartClick}>
              {user ? t('hero.goGroups') : t('hero.start')}
            </button>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>100%</span>
              <span className={styles.statLabel}>{t('hero.stat1Label')}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>∞</span>
              <span className={styles.statLabel}>{t('hero.stat2Label')}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>24/7</span>
              <span className={styles.statLabel}>{t('hero.stat3Label')}</span>
            </div>
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
    </section>
  )
}
