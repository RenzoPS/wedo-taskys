import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../common/UserContext';
import { useI18n } from '../common/I18nContext';
import styles from './final-cta.module.css';

export default function FinalCTA() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useI18n();

  const handleClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <section className={styles.ctaSection}>
      <div className={styles.container}>
        <div className={styles.badge}>{t('finalCta.badge')}</div>
        <h2 className={styles.title}>
          {t('finalCta.title')}
        </h2>
        <p className={styles.subtitle}>
          {t('finalCta.subtitle')}
        </p>
        
        <div className={styles.benefits}>
          <div className={styles.benefit}>
            <Check size={20} className={styles.checkIcon} />
            <span>{t('finalCta.benefit1')}</span>
          </div>
          <div className={styles.benefit}>
            <Check size={20} className={styles.checkIcon} />
            <span>{t('finalCta.benefit2')}</span>
          </div>
          <div className={styles.benefit}>
            <Check size={20} className={styles.checkIcon} />
            <span>{t('finalCta.benefit3')}</span>
          </div>
        </div>

        <button onClick={handleClick} className={styles.ctaButton}>
          {user ? t('finalCta.buttonLogged') : t('finalCta.button')}
          <ArrowRight size={20} />
        </button>
        <p className={styles.note}>
          {t('finalCta.note')}
        </p>
      </div>
    </section>
  );
}
