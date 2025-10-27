"use client"

import { User } from "lucide-react"
import { useAuth } from "../common/UserContext"
import { useState } from "react"
import styles from "./header.module.css"
import LanguageSelector from "../common/LanguageSelector"
import { useI18n } from "../common/I18nContext"
import LogoIcon from "../common/LogoIcon"

export default function Header({ onLogin, onRegister, onGroups }) {
  const { user, logout } = useAuth()
  const [showMenu, setShowMenu] = useState(false)
  const { t } = useI18n()

  console.log('HEADER USER:', user)

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        {/* Logo */}
        <div className={styles.logoGroup}>
          <div className={styles.logoIcon}>
            <LogoIcon size={36} className={styles.logoSvg} />
          </div>
          <span className={styles.logoText}>WeDo Taskys</span>
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          <a href="#inicio" className={styles.navLink}>{t('nav.home')}</a>
          <a href="#caracteristicas" className={styles.navLink}>{t('nav.features')}</a>
          <a href="#como-funciona" className={styles.navLink}>{t('nav.how')}</a>
          <a href="#faq" className={styles.navLink}>{t('nav.faq')}</a>
        </nav>

        {/* Auth Buttons o User Icon */}
        <div className={styles.authGroup}>
          <div className={styles.languageSelector}>
            <LanguageSelector />
          </div>
          {user ? (
            <div className={styles.userMenuWrapper}>
              <button onClick={() => setShowMenu((v) => !v)} className={styles.userButton}>
                <span className={styles.userInfo}>
                  <User className={styles.userIcon} />
                  <span className={styles.userName}>{user.userName}</span>
                </span>
              </button>
              {showMenu && (
                <div className={styles.userMenu}>
                  {onGroups && (
                    <button onClick={() => { onGroups(); setShowMenu(false); }} className={styles.menuButton}>
                      {t('header.myGroups')}
                    </button>
                  )}
                  <button onClick={logout} className={styles.logoutButton}>{t('auth.logout')}</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button type="button" className={styles.loginButton} onClick={onLogin}>{t('auth.login')}</button>
              <button type="button" className={styles.registerButton} onClick={onRegister}>{t('auth.register')}</button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
