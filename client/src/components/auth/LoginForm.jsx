"use client"

import { memo, useState } from "react"
import Logo from "../common/Logo"
import { authService } from "../../services/api"
import { useAuth } from "../common/UserContext"
import { useI18n } from "../common/I18nContext"

const LoginForm = memo(function LoginForm({ onToggle, onSuccess }) {
  const { login } = useAuth()
  const { t, lang } = useI18n()
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
      login(response)
      setIsLoading(false)
      if (onSuccess) onSuccess()
    } catch (error) {
      setError(error.response?.data?.message || "Error al iniciar sesión")
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-form">
      <div className="logo-container">
        <Logo />
        <div className="brand-text">
          <h1>WeDo Taskys</h1>
          <p>{t('login.tagline')}</p>
        </div>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}

        <div className="input-group">
          <label htmlFor="email">{lang === 'en' ? 'Email' : 'Correo Electrónico'}</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={lang === 'en' ? 'user@example.com' : 'usuario@ejemplo.com'}
            required
            disabled={isLoading}
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">{lang === 'en' ? 'Password' : 'Contraseña'}</label>
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
            {lang === 'en' ? 'Forgot your password?' : '¿Olvidaste tu contraseña?'}
          </a>
        </div>

        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? t('login.loggingIn') : t('auth.login')}
        </button>

        <p className="toggle-text">
          {lang === 'en' ? "Don't have an account?" : '¿No tienes una cuenta?'}
          <button type="button" onClick={onToggle} className="toggle-link" disabled={isLoading}>
            {lang === 'en' ? 'Sign up now' : 'Regístrate ahora'}
          </button>
        </p>
      </form>
    </div>
  )
})

export default LoginForm
