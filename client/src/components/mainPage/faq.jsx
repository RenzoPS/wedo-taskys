"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: "¿Qué es WeDo Taskys y cómo puede ayudar a mi equipo?",
      answer:
        "WeDo Taskys es una plataforma de gestión de tareas diseñada para equipos que buscan organizar proyectos de manera eficiente. Te permite crear, asignar y hacer seguimiento de tareas en tiempo real, facilitando la colaboración y mejorando la productividad del equipo.",
    },
    {
      question: "¿Es gratuito usar WeDo Taskys?",
      answer:
        "Ofrecemos un plan gratuito que incluye funcionalidades básicas para equipos pequeños. También tenemos planes premium con características avanzadas como reportes detallados, integraciones adicionales y mayor capacidad de almacenamiento.",
    },
    {
      question: "¿Puedo invitar a miembros de mi equipo?",
      answer:
        "Sí, puedes invitar a todos los miembros de tu equipo mediante correo electrónico. Cada miembro puede tener diferentes roles y permisos según las necesidades del proyecto. La colaboración en tiempo real es una de nuestras características principales.",
    },
    {
      question: "¿Cómo funciona la colaboración en tiempo real?",
      answer:
        "Los cambios se sincronizan instantáneamente entre todos los miembros del equipo. Puedes ver quién está trabajando en qué tarea, recibir notificaciones de actualizaciones, comentar en tareas específicas y compartir archivos directamente en la plataforma.",
    },
    {
      question: "¿Qué tipos de proyectos puedo gestionar?",
      answer:
        "WeDo Taskys es versátil y se adapta a cualquier tipo de proyecto: desarrollo de software, marketing, diseño, eventos, investigación, y más. Puedes personalizar tableros, etiquetas y flujos de trabajo según tus necesidades específicas.",
    },
    {
      question: "¿Mis datos están seguros?",
      answer:
        "La seguridad es nuestra prioridad. Utilizamos encriptación de extremo a extremo, copias de seguridad automáticas y cumplimos con los estándares internacionales de protección de datos. Tus proyectos y información están completamente protegidos.",
    },
    {
      question: "¿Puedo acceder desde dispositivos móviles?",
      answer:
        "Sí, WeDo Taskys es completamente responsive y funciona perfectamente en computadoras, tablets y smartphones. También estamos desarrollando aplicaciones móviles nativas para iOS y Android.",
    },
    {
      question: "¿Ofrecen soporte técnico?",
      answer:
        "Proporcionamos soporte técnico completo a través de chat en vivo, correo electrónico y una base de conocimientos detallada. Nuestro equipo de soporte está disponible para ayudarte con cualquier pregunta o problema técnico.",
    },
  ]

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Preguntas Frecuentes</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Encuentra respuestas a las preguntas más comunes sobre WeDo Taskys
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
              </button>

              {openIndex === index && (
                <div className="px-6 pb-5">
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-12 p-8 bg-blue-50 rounded-2xl">
          <h3 className="text-xl font-bold text-gray-900 mb-2">¿No encuentras lo que buscas?</h3>
          <p className="text-gray-600 mb-6">Nuestro equipo de soporte está aquí para ayudarte</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            Contactar Soporte
          </button>
        </div>
      </div>
    </section>
  )
}
