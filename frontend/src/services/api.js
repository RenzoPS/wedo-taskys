import axios from "axios"

// Configuración base de axios
const API = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true, // Para enviar cookies automáticamente
  headers: {
    "Content-Type": "application/json",
  },
})

// Interceptor para manejar errores globalmente
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejo de errores personalizado
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error(error.message || "Error de conexión")
  },
)

// Servicios de autenticación
export const authService = {
  // Registro de usuario
  register: async (userData) => {
    try {
      const response = await API.post("/users/register", {
        userName: userData.userName, // Tu backend espera userName
        email: userData.email,
        password: userData.password,
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Login de usuario
  login: async (credentials) => {
    try {
      const response = await API.post("/users/login", {
        email: credentials.email,
        password: credentials.password,
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Logout de usuario
  logout: async () => {
    try {
      const response = await API.post("/users/logout")
      return response.data
    } catch (error) {
      throw error
    }
  },
}

export default API
