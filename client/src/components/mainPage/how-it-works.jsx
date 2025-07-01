"use client"

import { User, FolderPlus, Users } from "lucide-react"

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
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Cómo funciona</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre la experiencia de WeDo Taskys en tres simples pasos
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-20">
          {steps.map((step, index) => {
            const IconComponent = step.icon
            return (
              <div
                key={index}
                className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? "lg:grid-flow-col-dense" : ""}`}
              >
                {/* Content */}
                <div className={`space-y-6 ${index % 2 === 1 ? "lg:col-start-2" : ""}`}>
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
                      {step.number}
                    </div>
                    <IconComponent className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">{step.title}</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">{step.description}</p>
                </div>

                {/* Illustration */}
                <div className={`${index % 2 === 1 ? "lg:col-start-1" : ""}`}>
                  <div className="bg-gray-50 rounded-2xl p-8 shadow-sm">
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                      {/* Placeholder for illustration */}
                      <div className="space-y-4">
                        {step.number === "1" && (
                          <div className="space-y-3">
                            <div className="bg-blue-600 h-6 w-32 rounded"></div>
                            <div className="bg-gray-300 h-4 w-28 rounded"></div>
                            <div className="bg-blue-600 h-8 w-24 rounded"></div>
                          </div>
                        )}
                        {step.number === "2" && (
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="bg-blue-600 h-4 w-full rounded"></div>
                              <div className="bg-blue-300 h-3 w-3/4 rounded"></div>
                              <div className="bg-blue-300 h-3 w-1/2 rounded"></div>
                              <div className="bg-blue-600 h-4 w-full rounded"></div>
                            </div>
                            <div className="space-y-2">
                              <div className="bg-blue-300 h-4 w-full rounded"></div>
                              <div className="bg-blue-600 h-3 w-2/3 rounded"></div>
                              <div className="bg-gray-300 h-3 w-3/4 rounded"></div>
                              <div className="bg-gray-300 h-3 w-1/2 rounded"></div>
                            </div>
                          </div>
                        )}
                        {step.number === "3" && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-2">
                              <div className="bg-blue-600 h-4 rounded"></div>
                              <div className="bg-blue-600 h-4 rounded"></div>
                              <div className="bg-blue-600 h-4 rounded"></div>
                            </div>
                            <div className="bg-blue-100 p-4 rounded-lg">
                              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm">✓</span>
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
