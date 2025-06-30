"use client"

import { memo, useState } from "react"
import Logo from "./Logo"
import { authService } from "../services/api"

const LoginForm = memo(function LoginForm({ onToggle }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await authService.login(formData)
      console.log("Login exitoso:", response)

      // Aquí puedes manejar el éxito del login
      // Por ejemplo, guardar datos del usuario en contexto o localStorage
      alert(`¡Bienvenido ${response.userName}!`)

      // Limpiar formulario
      setFormData({ email: "", password: "" })
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-form">
      <div className="logo-container">
        <Logo />
        <div className="brand-text">
          <h1>WeDo Taskys</h1>
          <p>Organiza tareas en equipo, logra más juntos</p>
        </div>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}

        <div className="input-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="usuario@ejemplo.com"
            required
            disabled={isLoading}
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
            disabled={isLoading}
            minLength={6}
          />
          <a href="#" className="forgot-password">
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
        </button>

        <p className="toggle-text">
          ¿No tienes una cuenta?
          <button type="button" onClick={onToggle} className="toggle-link" disabled={isLoading}>
            Regístrate ahora
          </button>
        </p>
      </form>
    </div>
  )
})

export default LoginForm
