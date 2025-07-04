"use client"

import { memo, useState } from "react"
import Logo from "../common/Logo"
import { authService } from "../../services/api"
import { useAuth } from "../common/UserContext"

const RegisterForm = memo(function RegisterForm({ onToggle, onSuccess }) {
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
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

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      return false
    }
    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setError("")

    try {
      const response = await authService.register({
        userName: formData.userName,
        email: formData.email,
        password: formData.password,
      })

      login(response.user || { email: formData.email })

      // Aquí puedes manejar el éxito del registro
      alert(`¡Registro exitoso! Bienvenido ${response.userName}!`)

      // Limpiar formulario
      setFormData({
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
      })

      if (onSuccess) onSuccess()
    } catch (error) {
      setError(error.response?.data?.message || "Error al registrarse")
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
          <label htmlFor="userName">Nombre de usuario</label>
          <input
            type="text"
            id="userName"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            placeholder="Tu nombre de usuario"
            required
            disabled={isLoading}
          />
        </div>

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
        </div>

        <div className="input-group">
          <label htmlFor="confirmPassword">Confirmar contraseña</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            required
            disabled={isLoading}
            minLength={6}
          />
        </div>

        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? "Registrando..." : "Registrarse"}
        </button>

        <p className="toggle-text">
          ¿Ya tienes una cuenta?
          <button type="button" onClick={onToggle} className="toggle-link" disabled={isLoading}>
            Inicia Sesión
          </button>
        </p>
      </form>
    </div>
  )
})

export default RegisterForm
