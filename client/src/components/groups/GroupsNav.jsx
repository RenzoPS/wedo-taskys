import React from 'react';
import { ArrowLeft } from 'lucide-react';
import styles from './groups.module.css';
import { useI18n } from '../common/I18nContext';
import LogoIcon from '../common/LogoIcon';

const GroupsNav = ({ onBack }) => {
  const { t, lang } = useI18n();
  return (
    <nav className={styles['groups-nav']}>
      <div className={styles['nav-container']}>
        <button onClick={onBack} className={styles['back-button']}>
          <ArrowLeft size={20} />
          <span>{t('groups.backHome')}</span>
        </button>
        
        <div className={styles['nav-brand']}>
          <LogoIcon size={28} />
          <span>{lang === 'en' ? 'WeDo Taskys - Groups' : 'WeDo Taskys - Grupos'}</span>
        </div>
      </div>
    </nav>
  );
};

export default GroupsNav; 