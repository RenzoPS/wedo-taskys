"use client"

import { CheckSquare, Users, BarChart3 } from "lucide-react"
import styles from "./features.module.css"
import { useI18n } from "../common/I18nContext"

export default function Features() {
  const { t, lang } = useI18n()
  const features = [
    {
      icon: CheckSquare,
      title: lang === 'en' ? 'Intuitive task management' : 'Gestión de tareas intuitiva',
      description:
        lang === 'en'
          ? 'Create, assign and organize tasks with ease. Set deadlines, priorities and categories to keep everything tidy.'
          : 'Crea, asigna y organiza tareas con facilidad. Establece fechas límite, prioridades y categorías para mantener todo en orden.',
    },
    {
      icon: Users,
      title: lang === 'en' ? 'Real-time collaboration' : 'Colaboración en tiempo real',
      description:
        lang === 'en'
          ? 'Work with your team simultaneously. Comment, share files, and keep contextual conversations for each task.'
          : 'Trabaja con tu equipo simultáneamente. Comenta, comparte archivos y mantén conversaciones contextuales sobre cada tarea.',
    },
    {
      icon: BarChart3,
      title: lang === 'en' ? 'Progress tracking' : 'Seguimiento de progreso',
      description:
        lang === 'en'
          ? 'See your project progress with Kanban boards, progress charts, and custom reports.'
          : 'Visualiza el avance de tus proyectos con tableros Kanban, gráficos de progreso y reportes personalizados.',
    },
  ]

  return (
    <section className={styles.featuresSection}>
      <div className={styles.featuresContainer}>
        {/* Header */}
        <div className={styles.featuresHeader}>
          <h2 className={styles.featuresTitle}>{t('features.title')}</h2>
          <p className={styles.featuresSubtitle}>
            {lang === 'en'
              ? 'Everything you need to manage team tasks efficiently'
              : 'Todo lo que necesitas para gestionar tareas en equipo de manera eficiente'}
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
