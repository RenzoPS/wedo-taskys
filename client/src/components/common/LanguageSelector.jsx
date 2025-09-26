import { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';

const LanguageSelector = () => {
  const [language, setLanguage] = useState('es'); // Español por defecto
  const [showMenu, setShowMenu] = useState(false);

  // Función para cambiar el idioma
  const changeLanguage = (lang) => {
    setLanguage(lang);
    setShowMenu(false);
    
    // Insertar el script de Google Translate directamente
    if (lang === 'en') {
      // Traducir a inglés
      translatePage('en');
    } else {
      // Volver a español (recargar la página)
      window.location.reload();
    }
  };

  // Función para traducir la página
  const translatePage = (targetLang) => {
    // Crear el elemento de script de Google Translate
    const googleTranslateScript = document.createElement('script');
    googleTranslateScript.type = 'text/javascript';
    googleTranslateScript.innerHTML = `
      function googleTranslateElementInit() {
        new google.translate.TranslateElement({
          pageLanguage: 'es',
          includedLanguages: 'en,es',
          autoDisplay: false,
          layout: google.translate.TranslateElement.InlineLayout.SIMPLE
        }, 'google_translate_element');
        
        // Traducir automáticamente al idioma seleccionado
        var select = document.querySelector('.goog-te-combo');
        if (select) {
          select.value = '${targetLang}';
          select.dispatchEvent(new Event('change'));
          
          // Intentar varias veces para asegurar que se aplique la traducción
          var attempts = 0;
          var translateInterval = setInterval(function() {
            select.value = '${targetLang}';
            select.dispatchEvent(new Event('change'));
            attempts++;
            if (attempts >= 5) {
              clearInterval(translateInterval);
            }
          }, 300);
        }
        
        // Ocultar la barra de Google Translate
        setTimeout(function() {
          var translateBar = document.querySelector('.skiptranslate');
          if (translateBar) {
            translateBar.style.display = 'none';
            document.body.style.top = '0px';
          }
          
          // Ocultar el widget de valoración
          var feedbackWidget = document.querySelector('.goog-te-banner-frame');
          if (feedbackWidget) {
            feedbackWidget.style.display = 'none';
          }
        }, 500);
      }
    `;
    document.body.appendChild(googleTranslateScript);

    // Cargar el script de Google Translate API
    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.body.appendChild(script);
    
    // Agregar CSS para ocultar elementos de Google Translate
    const style = document.createElement('style');
    style.textContent = `
      .goog-te-banner-frame, .skiptranslate, .goog-te-balloon-frame, #goog-gt-tt, .goog-te-balloon-frame {
        display: none !important;
      }
      body {
        top: 0px !important;
      }
      .VIpgJd-ZVi9od-l4eHX-hSRGPd, .VIpgJd-ZVi9od-aZ2wEe-wOHMyf, .VIpgJd-ZVi9od-aZ2wEe-OiiCO {
        display: none !important;
      }
      .goog-te-gadget {
        font-size: 0px !important;
      }
    `;
    document.head.appendChild(style);
  };

  // Crear el div para el widget de Google Translate y aplicar estilos para ocultar elementos
  useEffect(() => {
    if (!document.getElementById('google_translate_element')) {
      const div = document.createElement('div');
      div.id = 'google_translate_element';
      div.style.display = 'none';
      document.body.appendChild(div);
    }
    
    // Agregar CSS para ocultar elementos de Google Translate
    const style = document.createElement('style');
    style.textContent = `
      .goog-te-banner-frame, .skiptranslate, .goog-te-balloon-frame, #goog-gt-tt, .goog-te-balloon-frame {
        display: none !important;
      }
      body {
        top: 0px !important;
      }
      .VIpgJd-ZVi9od-l4eHX-hSRGPd, .VIpgJd-ZVi9od-aZ2wEe-wOHMyf, .VIpgJd-ZVi9od-aZ2wEe-OiiCO {
        display: none !important;
      }
      .goog-te-gadget {
        font-size: 0px !important;
      }
    `;
    document.head.appendChild(style);
    
    // Verificar si hay un idioma guardado en localStorage
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage === 'en') {
      setLanguage('en');
      translatePage('en');
    }
    
    // Ocultar elementos de Google Translate periódicamente
    const hideInterval = setInterval(() => {
      const elements = [
        '.goog-te-banner-frame',
        '.skiptranslate',
        '.goog-te-balloon-frame',
        '#goog-gt-tt',
        '.VIpgJd-ZVi9od-l4eHX-hSRGPd'
      ];
      
      elements.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
          element.style.display = 'none';
        }
      });
      
      document.body.style.top = '0px';
    }, 1000);
    
    return () => clearInterval(hideInterval);
  }, []);

  // Guardar el idioma seleccionado en localStorage
  useEffect(() => {
    localStorage.setItem('preferredLanguage', language);
  }, [language]);

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
        <span>{language === 'es' ? 'ES' : 'EN'}</span>
      </button>
      
      {showMenu && (
        <div style={menuStyle}>
          <button 
            style={{...menuItemStyle, fontWeight: language === 'es' ? 'bold' : 'normal'}}
            onClick={() => changeLanguage('es')}
          >
            Español
          </button>
          <button 
            style={{...menuItemStyle, fontWeight: language === 'en' ? 'bold' : 'normal'}}
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