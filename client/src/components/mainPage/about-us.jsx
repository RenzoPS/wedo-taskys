import React from 'react';
import { Heart, Code, Users, Sparkles } from 'lucide-react';
import styles from './about-us.module.css';
import { useI18n } from '../common/I18nContext';

export default function AboutUs() {
  const { t } = useI18n();
  
  return (
    <section className={styles.aboutSection}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.badge}>
            <Sparkles size={16} />
            <span>{t('aboutUs.badge')}</span>
          </div>
          
          <h2 className={styles.title}>
            {t('aboutUs.title')} <Heart size={32} className={styles.heartIcon} /> {t('aboutUs.titleEnd')}
          </h2>
          
          <p className={styles.description}>
            {t('aboutUs.description')}
          </p>

          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <Code size={24} />
              </div>
              <h3>{t('aboutUs.feature1Title')}</h3>
              <p>{t('aboutUs.feature1Desc')}</p>
            </div>

            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <Users size={24} />
              </div>
              <h3>{t('aboutUs.feature2Title')}</h3>
              <p>{t('aboutUs.feature2Desc')}</p>
            </div>

            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <Heart size={24} />
              </div>
              <h3>{t('aboutUs.feature3Title')}</h3>
              <p>{t('aboutUs.feature3Desc')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
