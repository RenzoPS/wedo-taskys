"use client"

import styles from "./hero.module.css";
import teamCollab from '../../assets/undraw_online-collaboration_xon8.svg';

export default function Hero({ onStart }) {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroGrid}>
        {/* Content */}
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Organiza tareas en equipo de forma simple y efectiva
          </h1>
          <p className={styles.heroSubtitle}>
            WeDo Taskys te ayuda a coordinar proyectos, distribuir responsabilidades y hacer seguimiento del progreso en tiempo real.
          </p>
          <div className={styles.heroButtons}>
            <button type="button" className={styles.startButton} onClick={onStart}>
              Comenzar ahora
            </button>
            <button type="button" className={styles.demoButton}>
              Ver demostración
            </button>
          </div>
        </div>

        {/* Ilustración */}
        <div className={styles.heroIllustration}>
          <img 
            src={teamCollab} 
            alt="Colaboración en equipo" 
            className={styles.heroImage}
          />
        </div>
      </div>
    </section>
  )
}
