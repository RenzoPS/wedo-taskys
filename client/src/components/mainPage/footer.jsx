"use client"

import { Mail, Heart, Github } from "lucide-react"
import styles from "./footer.module.css"
import { useI18n } from "../common/I18nContext"
import LogoIcon from "../common/LogoIcon"

export default function Footer() {
  const { t, lang } = useI18n()
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerGrid}>
          {/* Brand */}
          <div className={styles.brand}>
            <div className={styles.brandRow}>
              <LogoIcon size={36} className={styles.brandIcon} />
              <span className={styles.brandText}>WeDo Taskys</span>
            </div>
            <p className={styles.brandDesc}>
              {lang === 'en' 
                ? 'Task management made simple. Free forever.' 
                : 'Gestión de tareas simplificada. Gratis para siempre.'}
            </p>
            <div className={styles.madeWith}>
              <span>{t('footer.madeWith')}</span>
              <Heart size={16} className={styles.heartIcon} />
              <span>{t('footer.byDevelopers')}</span>
            </div>
          </div>

          {/* Navegación */}
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>{lang === 'en' ? 'Navigation' : 'Navegación'}</h3>
            <ul className={styles.footerList}>
              <li><a href="#inicio" className={styles.footerLink}>Inicio</a></li>
              <li><a href="#como-funciona" className={styles.footerLink}>Cómo funciona</a></li>
              <li><a href="#caracteristicas" className={styles.footerLink}>Características</a></li>
              <li><a href="#nosotros" className={styles.footerLink}>Nosotros</a></li>
              <li><a href="#faq" className={styles.footerLink}>FAQ</a></li>
            </ul>
          </div>

          {/* Soporte */}
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>{lang === 'en' ? 'Support' : 'Soporte'}</h3>
            <ul className={styles.footerList}>
              <li>
                <a 
                  href="https://forms.gle/tu-form-id" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={styles.footerLink}
                >
                  <Mail size={16} />
                  {lang === 'en' ? 'Contact us' : 'Contáctanos'}
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/tu-repo" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={styles.footerLink}
                >
                  <Github size={16} />
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>{lang === 'en' ? 'Legal' : 'Legal'}</h3>
            <ul className={styles.footerList}>
              <li><a href="#" className={styles.footerLink}>Privacidad</a></li>
              <li><a href="#" className={styles.footerLink}>Términos de Uso</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className={styles.footerBottom}>
          <p className={styles.footerCopyright}>
            © {new Date().getFullYear()} WeDo Taskys. {lang === 'en' ? 'All rights reserved.' : 'Todos los derechos reservados.'}
          </p>
          <p className={styles.footerNote}>
            {lang === 'en' 
              ? 'Non-profit project' 
              : 'Proyecto sin fines de lucro'}
          </p>
        </div>
      </div>
    </footer>
  )
}
