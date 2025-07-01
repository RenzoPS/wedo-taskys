"use client"

import { useState, useCallback } from "react"
import LoginForm from "./components/auth/LoginForm"
import RegisterForm from "./components/auth/RegisterForm"
import "./App.css"
import Header from "./components/mainPage/header"
import Hero from "./components/mainPage/hero"
import Features from "./components/mainPage/features"
import HowItWorks from "./components/mainPage/how-it-works"
import FAQ from "./components/mainPage/faq"
import Footer from "./components/mainPage/footer"
import { useAuth } from "./components/common/UserContext"

function App() {
  const { user } = useAuth ? useAuth() : { user: null }
  const [view, setView] = useState("main") // main, login, register
  const [isTransitioning, setIsTransitioning] = useState(false)

  const goToLogin = () => setView("login")
  const goToRegister = () => setView("register")
  const goToMain = () => setView("main")

  const toggleForm = useCallback(() => {
    setIsTransitioning(true)

    setTimeout(() => {
      setView((prev) => (prev === "login" ? "register" : "login"))

      setTimeout(() => {
        setIsTransitioning(false)
      }, 100)
    }, 200)
  }, [])

  if (!user && (view === "login" || view === "register")) {
    return (
      <div className="app">
        <div className="container">
          <div
            className={`form-container ${view === "login" ? "login-mode" : "register-mode"} ${isTransitioning ? "transitioning" : ""}`}
          >
            <div className="form-wrapper">
              <div className="form-content">
                {view === "login" ? <LoginForm onToggle={toggleForm} onSuccess={goToMain} /> : <RegisterForm onToggle={toggleForm} onSuccess={goToMain} />}
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

  // MainPage
  return (
    <>
      <Header onLogin={goToLogin} onRegister={goToRegister} />
      <Hero onStart={goToRegister} />
      <Features />
      <HowItWorks />
      <FAQ />
      <Footer />
    </>
  )
}

export default App
