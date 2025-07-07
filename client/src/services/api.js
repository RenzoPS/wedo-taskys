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

// Servicios de grupos
export const groupService = {
  // Crear un nuevo grupo
  createGroup: (groupData) => API.post("/groups", groupData).then(res => res.data),

  // Obtener todos los grupos
  getAllGroups: () => API.get("/groups").then(res => res.data),

  // Obtener un grupo por ID
  getGroupById: (groupId) => API.get(`/groups/${groupId}`).then(res => res.data),

  // Obtener usuarios disponibles para agregar al grupo
  getAvailableUsers: (groupId) => API.get(`/groups/${groupId}/available-users`).then(res => res.data),

  // Agregar usuario a un grupo
  addUserToGroup: (groupId, userId) => API.post(`/groups/${groupId}/users`, { userId }).then(res => res.data).catch(err => {
    console.error('Error in addUserToGroup:', err);
    throw err;
  }),

  // Remover usuario de un grupo
  removeUserFromGroup: (groupId, userId) => API.delete(`/groups/${groupId}/users/${userId}`).then(res => res.data).catch(err => {
    console.error('Error in removeUserFromGroup:', err);
    throw err;
  }),

  // Agregar listas a un grupo
  // addListToGroup: (groupId, listIds) => API.post(`/groups/${groupId}/lists`, { listIds }).then(res => res.data),

  // Actualizar un grupo
  updateGroup: (groupId, groupData) => API.patch(`/groups/${groupId}`, groupData).then(res => res.data),

  // Eliminar un grupo
  deleteGroup: (groupId) => API.delete(`/groups/${groupId}`).then(res => res.data)
}

export default API
