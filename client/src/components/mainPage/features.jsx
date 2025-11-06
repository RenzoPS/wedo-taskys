"use client"

import { CheckSquare, Users, Zap, Shield, Clock, Sparkles } from "lucide-react"
import styles from "./features.module.css"
import { useI18n } from "../common/I18nContext"

export default function Features() {
  const { t, lang } = useI18n()
  const features = [
    {
      icon: CheckSquare,
      title: lang === 'en' ? 'Smart Task Management' : 'Gestión Inteligente',
      description:
        lang === 'en'
          ? 'Create, organize and prioritize tasks with an intuitive interface. Tags, checklists and deadlines in one place.'
          : 'Crea, organiza y prioriza tareas con una interfaz intuitiva. Etiquetas, checklists y fechas límite en un solo lugar.',
    },
    {
      icon: Users,
      title: lang === 'en' ? 'Team Collaboration' : 'Colaboración en Equipo',
      description:
        lang === 'en'
          ? 'Invite members, assign tasks and work together in real time. Perfect for remote teams.'
          : 'Invita miembros, asigna tareas y trabaja en conjunto en tiempo real. Perfecto para equipos remotos.',
    },
    {
      icon: Zap,
      title: lang === 'en' ? 'Lightning Fast' : 'Velocidad Relámpago',
      description:
        lang === 'en'
          ? 'Optimized performance for instant loading. Work without interruptions or delays.'
          : 'Rendimiento optimizado para carga instantánea. Trabaja sin interrupciones ni demoras.',
    },
    {
      icon: Shield,
      title: lang === 'en' ? 'Secure & Private' : 'Seguro y Privado',
      description:
        lang === 'en'
          ? 'Your data is protected with industry-standard encryption. Privacy is our priority.'
          : 'Tus datos protegidos con encriptación estándar de la industria. La privacidad es nuestra prioridad.',
    },
    {
      icon: Clock,
      title: lang === 'en' ? '24/7 Access' : 'Acceso 24/7',
      description:
        lang === 'en'
          ? 'Access your tasks from anywhere, anytime. Available on all your devices.'
          : 'Accede a tus tareas desde cualquier lugar, en cualquier momento. Disponible en todos tus dispositivos.',
    },
    {
      icon: Sparkles,
      title: lang === 'en' ? '100% Free' : '100% Gratis',
      description:
        lang === 'en'
          ? 'All features available at no cost. No hidden fees, no credit card required.'
          : 'Todas las funciones disponibles sin costo. Sin tarifas ocultas, sin tarjeta de crédito requerida.',
    },
  ]

  return (
    <section className={styles.featuresSection}>
      <div className={styles.featuresContainer}>
        {/* Header */}
        <div className={styles.featuresHeader}>
          <h2 className={styles.featuresTitle}>{t('features.title')}</h2>
          <p className={styles.featuresSubtitle}>
            {t('features.subtitle')}
          </p>
        </div>
        {/* Features Grid */}
        <div className={styles.featuresGrid}>
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div key={index} className={styles.featureCard}>
                <div className={styles.featureIconBg}>
                  <IconComponent className={styles.featureIcon} />
                </div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
