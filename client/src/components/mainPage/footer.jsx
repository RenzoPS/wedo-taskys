"use client"

import { FileText, Facebook, Instagram, Twitter } from "lucide-react"
import styles from "./footer.module.css"

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerGrid}>
          {/* Brand */}
          <div className={styles.brand}>
            <div className={styles.brandRow}>
              <div className={styles.brandIcon}>
                <FileText />
              </div>
              <span className={styles.brandText}>WeDo Taskys</span>
            </div>
            <p className={styles.brandDesc}>Organiza tareas en equipo de forma simple y efectiva.</p>
          </div>

          {/* Producto */}
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>Producto</h3>
            <ul className={styles.footerList}>
              <li>
                <a href="#" className={styles.footerLink}>
                  Características
                </a>
              </li>
              <li>
                <a href="#" className={styles.footerLink}>
                  Actualizaciones
                </a>
              </li>
            </ul>
          </div>

          {/* Empresa */}
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>Empresa</h3>
            <ul className={styles.footerList}>
              <li>
                <a href="#" className={styles.footerLink}>
                  Sobre nosotros
                </a>
              </li>
              <li>
                <a href="#" className={styles.footerLink}>
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>Legal</h3>
            <ul className={styles.footerList}>
              <li>
                <a href="#" className={styles.footerLink}>
                  Privacidad
                </a>
              </li>
              <li>
                <a href="#" className={styles.footerLink}>
                  Términos
                </a>
              </li>
              <li>
                <a href="#" className={styles.footerLink}>
                  Cookies
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className={styles.footerBottom}>
          <p className={styles.footerCopyright}>
            © 2023 WeDo Taskys. Todos los derechos reservados.
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
