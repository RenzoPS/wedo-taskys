"use client"

import { User, FolderPlus, Users } from "lucide-react"
import styles from "./how-it-works.module.css"

export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      icon: User,
      title: "Crea tu cuenta",
      description:
        "Regístrate en segundos con tu correo electrónico o cuenta de Google. Configura tu perfil y personaliza tus preferencias.",
      illustration: "/step1-illustration.png",
    },
    {
      number: "2",
      icon: FolderPlus,
      title: "Crea tu primer proyecto",
      description:
        "Configura un nuevo proyecto, invita a los miembros de tu equipo y comienza a crear tareas. Organiza todo según tus necesidades.",
      illustration: "/step2-illustration.png",
    },
    {
      number: "3",
      icon: Users,
      title: "Colabora y haz seguimiento",
      description:
        "Trabaja con tu equipo en tiempo real, asigna tareas, comenta y haz seguimiento del progreso. Recibe notificaciones y mantente al día con todo.",
      illustration: "/step3-illustration.png",
    },
  ]

  return (
    <section className={styles.hiwSection}>
      <div className={styles.hiwContainer}>
        {/* Header */}
        <div className={styles.hiwHeader}>
          <h2 className={styles.hiwTitle}>Cómo funciona</h2>
          <p className={styles.hiwSubtitle}>
            Descubre la experiencia de WeDo Taskys en tres simples pasos
          </p>
        </div>

        {/* Steps */}
        <div className={styles.hiwSteps}>
          {steps.map((step, index) => {
            const IconComponent = step.icon
            const isReverse = index % 2 === 1
            return (
              <div
                key={index}
                className={`${styles.hiwStep} ${isReverse ? styles.reverse : ''}`}
              >
                {/* Content */}
                <div className={styles.hiwStepContent}>
                  <div className={styles.hiwStepNumberIcon}>
                    <div className={styles.hiwStepNumber}>
                      {step.number}
                    </div>
                    <IconComponent className={styles.hiwStepIcon} />
                  </div>
                  <h3 className={styles.hiwStepTitle}>{step.title}</h3>
                  <p className={styles.hiwStepDesc}>{step.description}</p>
                </div>

                {/* Illustration */}
                <div className={styles.hiwStepIllustration}>
                  <div className={styles.hiwStepIllustrationInner}>
                    <div className={styles.hiwStepIllustrationCard}>
                      {/* Placeholder for illustration */}
                      <div className={styles.hiwStepIllustrationContent}>
                        {step.number === "1" && (
                          <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                            <div className={styles.hiwBlockBlue} style={{height: '1.5rem', width: '8rem'}}></div>
                            <div className={styles.hiwBlockGray} style={{height: '1rem', width: '7rem'}}></div>
                            <div className={styles.hiwBlockBlue} style={{height: '2rem', width: '6rem'}}></div>
                          </div>
                        )}
                        {step.number === "2" && (
                          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                            <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                              <div className={styles.hiwBlockBlue} style={{height: '1rem', width: '100%'}}></div>
                              <div className={styles.hiwBlockBlueLight} style={{height: '0.75rem', width: '75%'}}></div>
                              <div className={styles.hiwBlockBlueLight} style={{height: '0.75rem', width: '50%'}}></div>
                              <div className={styles.hiwBlockBlue} style={{height: '1rem', width: '100%'}}></div>
                            </div>
                            <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                              <div className={styles.hiwBlockBlueLight} style={{height: '1rem', width: '100%'}}></div>
                              <div className={styles.hiwBlockBlue} style={{height: '0.75rem', width: '66%'}}></div>
                              <div className={styles.hiwBlockGray} style={{height: '0.75rem', width: '75%'}}></div>
                              <div className={styles.hiwBlockGray} style={{height: '0.75rem', width: '50%'}}></div>
                            </div>
                          </div>
                        )}
                        {step.number === "3" && (
                          <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem'}}>
                              <div className={styles.hiwBlockBlue} style={{height: '1rem'}}></div>
                              <div className={styles.hiwBlockBlue} style={{height: '1rem'}}></div>
                              <div className={styles.hiwBlockBlue} style={{height: '1rem'}}></div>
                            </div>
                            <div className={styles.hiwBlockBlue100}>
                              <div className={styles.hiwCheckCircle}>
                                <span style={{fontSize: '1rem'}}>✓</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
