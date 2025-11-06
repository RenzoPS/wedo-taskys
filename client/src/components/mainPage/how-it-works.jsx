"use client"

import { UserPlus, FolderPlus, ListChecks, Rocket } from "lucide-react"
import styles from "./how-it-works.module.css"
import { useI18n } from "../common/I18nContext"

export default function HowItWorks() {
  const { t, lang } = useI18n()
  const steps = [
    {
      number: "1",
      icon: UserPlus,
      title: lang === 'en' ? 'Create your account' : 'Crea tu cuenta',
      description: lang === 'en' ? 'Sign up in seconds. No credit card required, completely free.' : 'Regístrate en segundos. Sin tarjeta de crédito, completamente gratis.',
    },
    {
      number: "2",
      icon: FolderPlus,
      title: lang === 'en' ? 'Create a group' : 'Crea un grupo',
      description: lang === 'en' ? 'Organize your projects by creating groups. Add lists and customize them to your needs.' : 'Organiza tus proyectos creando grupos. Añade listas y personalízalas a tu medida.',
    },
    {
      number: "3",
      icon: ListChecks,
      title: lang === 'en' ? 'Add tasks' : 'Agrega tareas',
      description: lang === 'en' ? 'Create tasks, set deadlines, add tags and checklists. Keep everything organized.' : 'Crea tareas, establece fechas límite, añade etiquetas y checklists. Mantén todo organizado.',
    },
    {
      number: "4",
      icon: Rocket,
      title: lang === 'en' ? 'Collaborate and achieve' : 'Colabora y logra',
      description: lang === 'en' ? 'Invite your team, assign tasks and work together to achieve your goals.' : 'Invita a tu equipo, asigna tareas y trabajen juntos para lograr sus objetivos.',
    },
  ]

  return (
    <section className={styles.hiwSection}>
      <div className={styles.hiwContainer}>
        {/* Header */}
        <div className={styles.hiwHeader}>
          <h2 className={styles.hiwTitle}>{t('how.title')}</h2>
          <p className={styles.hiwSubtitle}>
            {t('how.subtitle')}
          </p>
        </div>

        {/* Steps */}
        <div className={styles.hiwStepsGrid}>
          {steps.map((step, index) => {
            const IconComponent = step.icon
            return (
              <div key={index} className={styles.hiwStepCard}>
                <div className={styles.hiwStepNumber}>{step.number}</div>
                <div className={styles.hiwStepIconWrapper}>
                  <IconComponent className={styles.hiwStepIcon} />
                </div>
                <h3 className={styles.hiwStepTitle}>{step.title}</h3>
                <p className={styles.hiwStepDesc}>{step.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
