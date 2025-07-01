"use client"

import { FileText, User } from "lucide-react"
import { useAuth } from "../common/UserContext"
import { useState } from "react"
import styles from "./header.module.css"

export default function Header({ onLogin, onRegister }) {
  const { user, logout } = useAuth()
  const [showMenu, setShowMenu] = useState(false)

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        {/* Logo */}
        <div className={styles.logoGroup}>
          <div className={styles.logoIcon}>
            <FileText className={styles.logoSvg} />
          </div>
          <span className={styles.logoText}>WeDo Taskys</span>
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          <a href="#inicio" className={styles.navLink}>Inicio</a>
          <a href="#caracteristicas" className={styles.navLink}>Características</a>
          <a href="#como-funciona" className={styles.navLink}>Cómo funciona</a>
          <a href="#testimonios" className={styles.navLink}>Testimonios</a>
        </nav>

        {/* Auth Buttons o User Icon */}
        <div className={styles.authGroup}>
          {user ? (
            <div className={styles.userMenuWrapper}>
              <button onClick={() => setShowMenu((v) => !v)} className={styles.userButton}>
                <User className={styles.userIcon} />
              </button>
              {showMenu && (
                <div className={styles.userMenu}>
                  <button onClick={logout} className={styles.logoutButton}>Cerrar sesión</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button type="button" className={styles.loginButton} onClick={onLogin}>Iniciar sesión</button>
              <button type="button" className={styles.registerButton} onClick={onRegister}>Registrarse</button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
