"use client"

import { FileText, Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">WeDo Taskys</span>
            </div>
            <p className="text-gray-400 leading-relaxed">Organiza tareas en equipo de forma simple y efectiva.</p>
          </div>

          {/* Producto */}
          <div>
            <h3 className="font-bold text-lg mb-4">Producto</h3>
            <ul className="space-y-3 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Características
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Actualizaciones
                </a>
              </li>
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h3 className="font-bold text-lg mb-4">Empresa</h3>
            <ul className="space-y-3 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Sobre nosotros
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-lg mb-4">Legal</h3>
            <ul className="space-y-3 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacidad
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Términos
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Cookies
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">© 2023 WeDo Taskys. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
