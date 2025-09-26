import React from 'react';
import { ArrowLeft, Users } from 'lucide-react';
import styles from './groups.module.css';
import { useI18n } from '../common/I18nContext';

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
          <Users size={24} />
          <span>{lang === 'en' ? 'WeDo Taskys - Groups' : 'WeDo Taskys - Grupos'}</span>
        </div>
      </div>
    </nav>
  );
};

export default GroupsNav; 