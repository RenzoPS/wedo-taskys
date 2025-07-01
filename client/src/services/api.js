import axios from "axios"

// Configuración base de axios
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
})

// Servicios de autenticación
export const authService = {
  // Registro de usuario
  register: (userData) => API.post("/users/register", userData).then(res => res.data),

  // Login de usuario
  login: (credentials) => API.post("/users/login", credentials).then(res => res.data),

  // Logout de usuario
  logout: () => API.post("/users/logout").then(res => res.data)
}

export default API
