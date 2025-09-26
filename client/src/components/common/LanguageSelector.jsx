import { useState } from 'react';
import { Globe } from 'lucide-react';
import { useI18n } from './I18nContext';

const LanguageSelector = () => {
  const { lang, setLang } = useI18n();
  const [showMenu, setShowMenu] = useState(false);

  const changeLanguage = (newLang) => {
    setLang(newLang);
    setShowMenu(false);
  };

  // Componente reducido: sólo alterna idioma en el contexto

  // Crear el div para el widget de Google Translate y aplicar estilos para ocultar elementos
  // Sin efectos: ya no hay Google Translate ni DOM hacks


  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '8px 12px',
    borderRadius: '4px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    color: '#333',
    fontWeight: '500',
    position: 'relative'
  };

  const menuStyle = {
    position: 'absolute',
    top: '100%',
    right: '0',
    backgroundColor: 'white',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    borderRadius: '4px',
    padding: '8px 0',
    zIndex: 1000,
    minWidth: '120px'
  };

  const menuItemStyle = {
    display: 'block',
    padding: '8px 16px',
    textAlign: 'left',
    width: '100%',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontSize: '14px'
  };

  return (
    <div style={{ position: 'relative' }}>
      <button 
        style={buttonStyle}
        onClick={() => setShowMenu(!showMenu)}
      >
        <Globe size={18} />
        <span>{lang === 'es' ? 'ES' : 'EN'}</span>
      </button>
      
      {showMenu && (
        <div style={menuStyle}>
          <button 
            style={{...menuItemStyle, fontWeight: lang === 'es' ? 'bold' : 'normal'}}
            onClick={() => changeLanguage('es')}
          >
            Español
          </button>
          <button 
            style={{...menuItemStyle, fontWeight: lang === 'en' ? 'bold' : 'normal'}}
            onClick={() => changeLanguage('en')}
          >
            English
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;