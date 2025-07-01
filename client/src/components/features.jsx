"use client"

import { CheckSquare, Users, BarChart3 } from "lucide-react"

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
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Características principales</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Todo lo que necesitas para gestionar tareas en equipo de manera eficiente
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                  <IconComponent className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
