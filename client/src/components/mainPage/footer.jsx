"use client"

import { Facebook, Instagram, Twitter } from "lucide-react"
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
            <p className={styles.brandDesc}>{t('footer.tagline')}</p>
          </div>

          {/* Producto */}
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>{lang === 'en' ? 'Product' : 'Producto'}</h3>
            <ul className={styles.footerList}>
              <li>
                <a href="#" className={styles.footerLink}>
                  {lang === 'en' ? 'Features' : 'Características'}
                </a>
              </li>
              <li>
                <a href="#" className={styles.footerLink}>
                  {lang === 'en' ? 'Updates' : 'Actualizaciones'}
                </a>
              </li>
            </ul>
          </div>

          {/* Empresa */}
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>{lang === 'en' ? 'Company' : 'Empresa'}</h3>
            <ul className={styles.footerList}>
              <li>
                <a href="#" className={styles.footerLink}>
                  {lang === 'en' ? 'About us' : 'Sobre nosotros'}
                </a>
              </li>
              <li>
                <a href="#" className={styles.footerLink}>
                  {lang === 'en' ? 'Contact' : 'Contacto'}
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>{lang === 'en' ? 'Legal' : 'Legal'}</h3>
            <ul className={styles.footerList}>
              <li>
                <a href="#" className={styles.footerLink}>
                  {lang === 'en' ? 'Privacy' : 'Privacidad'}
                </a>
              </li>
              <li>
                <a href="#" className={styles.footerLink}>
                  {lang === 'en' ? 'Terms' : 'Términos'}
                </a>
              </li>
              <li>
                <a href="#" className={styles.footerLink}>
                  {lang === 'en' ? 'Cookies' : 'Cookies'}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className={styles.footerBottom}>
          <p className={styles.footerCopyright}>
            {lang === 'en' ? '© 2023 WeDo Taskys. All rights reserved.' : '© 2023 WeDo Taskys. Todos los derechos reservados.'}
          </p>
          <div className={styles.footerSocials}>
            <a href="#" className={styles.footerSocialLink}>
              <Facebook />
            </a>
            <a href="#" className={styles.footerSocialLink}>
              <Instagram />
            </a>
            <a href="#" className={styles.footerSocialLink}>
              <Twitter />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
