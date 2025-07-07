"use client"

import { useState, useCallback, useEffect } from "react"
import LoginForm from "./components/auth/LoginForm"
import RegisterForm from "./components/auth/RegisterForm"
import "./App.css"
import Header from "./components/mainPage/header"
import Hero from "./components/mainPage/hero"
import Features from "./components/mainPage/features"
import HowItWorks from "./components/mainPage/how-it-works"
import FAQ from "./components/mainPage/faq"
import Footer from "./components/mainPage/footer"
import GroupsDashboard from "./components/groups/GroupsDashboard"
import { useAuth } from "./components/common/UserContext"

function App() {
  const { user } = useAuth ? useAuth() : { user: null }
  const [view, setView] = useState("main") // main, login, register, groups
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const handler = () => {
      if (user) setView("groups")
      else setView("login")
    }
    window.addEventListener("goToGroups", handler)
    return () => window.removeEventListener("goToGroups", handler)
  }, [user])

  const goToLogin = () => setView("login")
  const goToRegister = () => setView("register")
  const goToMain = () => setView("main")
  const goToGroups = () => setView("groups")

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

  // Si el usuario está autenticado y quiere ver grupos
  if (user && view === "groups") {
    return <GroupsDashboard onBack={goToMain} />
  }

  // MainPage
  return (
    <>
      <Header onLogin={goToLogin} onRegister={goToRegister} onGroups={user ? goToGroups : null} />
      <section id="inicio"><Hero onStart={goToRegister} /></section>
      <section id="caracteristicas"><Features /></section>
      <section id="como-funciona"><HowItWorks /></section>
      <section id="faq"><FAQ /></section>
      <Footer />
    </>
  )
}

export default App
