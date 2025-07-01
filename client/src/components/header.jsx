"use client"

import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-100 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">WeDo Taskys</span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#inicio" className="text-gray-700 hover:text-blue-600 font-medium">
            Inicio
          </a>
          <a href="#caracteristicas" className="text-gray-700 hover:text-blue-600 font-medium">
            Características
          </a>
          <a href="#como-funciona" className="text-gray-700 hover:text-blue-600 font-medium">
            Cómo funciona
          </a>
          <a href="#testimonios" className="text-gray-700 hover:text-blue-600 font-medium">
            Testimonios
          </a>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
            Iniciar sesión
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">Registrarse</Button>
        </div>
      </div>
    </header>
  )
}
