"use client"

import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20 px-4">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Content */}
        <div className="space-y-8">
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
            Organiza tareas en equipo de forma simple y efectiva
          </h1>
          <p className="text-xl text-blue-100 leading-relaxed">
            WeDo Taskys te ayuda a coordinar proyectos, distribuir responsabilidades y hacer seguimiento del progreso en
            tiempo real.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
              Comenzar ahora
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg font-semibold bg-transparent"
            >
              Ver demostración
            </Button>
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
