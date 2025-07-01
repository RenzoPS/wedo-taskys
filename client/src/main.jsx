import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"

// Punto de montaje en index.html
const rootElement = document.getElementById("root")

// Crea el “root” con la nueva API de React 18
const root = ReactDOM.createRoot(rootElement)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
