import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import { I18nProvider } from "./components/common/I18nContext.jsx"
import { AuthProvider } from "./components/common/UserContext"

// Punto de montaje en index.html
const rootElement = document.getElementById("root")

// Crea el "root" con la nueva API de React 18
const root = ReactDOM.createRoot(rootElement)

root.render(
  <React.StrictMode>
    <AuthProvider>
      <I18nProvider>
        <App />
      </I18nProvider>
    </AuthProvider>
  </React.StrictMode>,
)
