"use client"

import styles from "./hero.module.css";

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

        {/* Mockup */}
        <div className="relative">
          <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="bg-blue-600 h-4 w-24 rounded"></div>
                <div className="bg-blue-300 h-4 w-16 rounded"></div>
              </div>
              <div className="flex gap-4">
                <div className="bg-blue-600 h-4 w-20 rounded"></div>
                <div className="bg-blue-600 h-4 w-18 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="bg-blue-300 h-3 w-full rounded"></div>
                <div className="bg-blue-300 h-3 w-3/4 rounded"></div>
                <div className="bg-blue-300 h-3 w-1/2 rounded"></div>
              </div>
              <div className="bg-blue-600 h-6 w-16 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
