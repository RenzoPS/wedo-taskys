"use client"

import { CheckSquare, Users, BarChart3 } from "lucide-react"
import styles from "./features.module.css"

export default function Features() {
  const features = [
    {
      icon: CheckSquare,
      title: "Gestión de tareas intuitiva",
      description:
        "Crea, asigna y organiza tareas con facilidad. Establece fechas límite, prioridades y categorías para mantener todo en orden.",
    },
    {
      icon: Users,
      title: "Colaboración en tiempo real",
      description:
        "Trabaja con tu equipo simultáneamente. Comenta, comparte archivos y mantén conversaciones contextuales sobre cada tarea.",
    },
    {
      icon: BarChart3,
      title: "Seguimiento de progreso",
      description:
        "Visualiza el avance de tus proyectos con tableros Kanban, gráficos de progreso y reportes personalizados.",
    },
  ]

  return (
    <section className={styles.featuresSection}>
      <div className={styles.featuresContainer}>
        {/* Header */}
        <div className={styles.featuresHeader}>
          <h2 className={styles.featuresTitle}>Características principales</h2>
          <p className={styles.featuresSubtitle}>
            Todo lo que necesitas para gestionar tareas en equipo de manera eficiente
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
