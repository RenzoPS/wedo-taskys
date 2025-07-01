"use client"

import { useState, useCallback } from "react"
import LoginForm from "./components/LoginForm"
import RegisterForm from "./components/RegisterForm"
import "./App.css"

function App() {
  const [isLogin, setIsLogin] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const toggleForm = useCallback(() => {
    setIsTransitioning(true)

    setTimeout(() => {
      setIsLogin((prev) => !prev)

      setTimeout(() => {
        setIsTransitioning(false)
      }, 100)
    }, 200)
  }, [])

  return (
    <div className="app">
      <div className="container">
        <div
          className={`form-container ${isLogin ? "login-mode" : "register-mode"} ${isTransitioning ? "transitioning" : ""}`}
        >
          <div className="form-wrapper">
            <div className="form-content">
              {isLogin ? <LoginForm onToggle={toggleForm} /> : <RegisterForm onToggle={toggleForm} />}
            </div>
          </div>

          <div className="illustration-panel">
            <div className="illustration-content">
              <div className="task-card">
                <div className="task-item completed"></div>
                <div className="task-item active"></div>
                <div className="task-item active"></div>
                <div className="task-letters">A M T</div>
              </div>
              <h2>Colabora sin límites</h2>
              <p>
                Organiza, asigna y completa tareas en equipo. WeDo Taskys hace que el trabajo colaborativo sea simple y
                efectivo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
