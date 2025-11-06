import { useState } from 'react';
import { Globe, Check } from 'lucide-react';
import { useI18n } from './I18nContext';
import styles from './LanguageSelector.module.css';

const LanguageSelector = () => {
  const { lang, setLang } = useI18n();
  const [showMenu, setShowMenu] = useState(false);

  const changeLanguage = (newLang) => {
    setLang(newLang);
    setShowMenu(false);
  };

  return (
    <div className={styles.container}>
      <button 
        className={styles.button}
        onClick={() => setShowMenu(!showMenu)}
      >
        <Globe size={18} />
        <span>{lang === 'es' ? 'ES' : 'EN'}</span>
      </button>
      
      {showMenu && (
        <div className={styles.menu}>
          <button 
            className={`${styles.menuItem} ${lang === 'es' ? styles.active : ''}`}
            onClick={() => changeLanguage('es')}
          >
            <span>🇪🇸 Español</span>
            {lang === 'es' && <Check size={16} />}
          </button>
          <button 
            className={`${styles.menuItem} ${lang === 'en' ? styles.active : ''}`}
            onClick={() => changeLanguage('en')}
          >
            <span>🇬🇧 English</span>
            {lang === 'en' && <Check size={16} />}
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;