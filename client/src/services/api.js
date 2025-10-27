import axios from "axios"

// Configuración base de axios
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
})

// Interceptor para manejar la renovación automática de tokens
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Si el error es 401 (sin token), redirigir directamente al login
    if (error.response?.status === 401) {
      window.location.href = '/login'
      return Promise.reject(error)
    }

    // Si el error es 403 (token inválido/expirado) y no se ha intentado refrescar
    // Evitar loop infinito: no intentar refrescar si la petición fallida es el refresh mismo
    if (error.response?.status === 403 && !originalRequest._retry && !originalRequest.url.includes('/users/refresh')) {
      if (isRefreshing) {
        // Si ya se está refrescando, agregar a la cola
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => {
            return API(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // Intentar refrescar el token
        await API.post("/users/refresh")
        processQueue(null)
        isRefreshing = false
        // Reintentar la petición original con el nuevo token
        return API(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        isRefreshing = false
        // Si falla el refresh, redirigir al login
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// Diccionario de traducciones de errores del backend
const backendErrors = {
  // Errores en español (del backend)
  'Ya existe una lista con ese título en este grupo': 'A list with that title already exists in this group',
  'El usuario ya existe': 'User already exists',
  'El usuario no existe': 'User does not exist',
  'La contraseña es incorrecta': 'Password is incorrect',
  'Grupo no encontrado': 'Group not found',
  'Lista no encontrada': 'List not found',
  'Tarea no encontrada': 'Task not found',
  'No tienes permisos para crear listas': 'You do not have permission to create lists',
  'No tienes permisos para editar listas': 'You do not have permission to edit lists',
  'No tienes permisos para eliminar listas': 'You do not have permission to delete lists',
  'No tienes permisos para crear tareas': 'You do not have permission to create tasks',
  'No tienes permisos para editar este grupo': 'You do not have permission to edit this group',
  'No tienes permisos para eliminar este grupo': 'You do not have permission to delete this group',
  
  // Errores en inglés (del backend)
  'A list with that title already exists in this group': 'Ya existe una lista con ese título en este grupo',
  'User already exists': 'El usuario ya existe',
  'User does not exist': 'El usuario no existe',
  'Password is incorrect': 'La contraseña es incorrecta',
  'Group not found': 'Grupo no encontrado',
  'List not found': 'Lista no encontrada',
  'Task not found': 'Tarea no encontrada',
  'You do not have permission to create lists': 'No tienes permisos para crear listas',
  'You do not have permission to edit lists': 'No tienes permisos para editar listas',
  'You do not have permission to delete lists': 'No tienes permisos para eliminar listas',
  'You do not have permission to create tasks': 'No tienes permisos para crear tareas',
  'You do not have permission to edit this group': 'No tienes permisos para editar este grupo',
  'You do not have permission to delete this group': 'No tienes permisos para eliminar este grupo',
  'Internal Server Error': 'Error interno del servidor'
};

// Interceptor para traducir errores del backend
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const lang = localStorage.getItem('preferredLanguage') || 'es';
    if (error.response?.data?.message) {
      const originalMsg = error.response.data.message;
      // Traducir según el idioma seleccionado
      error.response.data.message = backendErrors[originalMsg] || originalMsg;
    }
    return Promise.reject(error);
  }
);

// Servicios de autenticación
export const authService = {
  // Registro de usuario
  register: (userData) => API.post("/users/register", userData).then(res => res.data),

  // Login de usuario
  login: (credentials) => API.post("/users/login", credentials).then(res => res.data),

  // Refresh token
  refreshToken: () => API.post("/users/refresh").then(res => res.data),

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

  // Agregar admin a un grupo
  addAdmin: (groupId, userId) => API.post(`/groups/${groupId}/admins`, { userId }).then(res => res.data),

  // Remover admin de un grupo
  removeAdmin: (groupId, userId) => API.delete(`/groups/${groupId}/admins/${userId}`).then(res => res.data),

  // Actualizar un grupo (incluye backgroundImage)
  updateGroup: (groupId, groupData) => API.patch(`/groups/${groupId}`, groupData).then(res => res.data),

  // Eliminar un grupo
  deleteGroup: (groupId) => API.delete(`/groups/${groupId}`).then(res => res.data)
}

// Servicios de listas
export const listService = {
  // Crear una nueva lista
  createList: (listData) => API.post("/lists", listData).then(res => res.data),

  // Obtener todas las listas
  getAllLists: () => API.get("/lists").then(res => res.data),

  // Obtener listas por grupo
  getListsByGroup: (groupId) => API.get(`/lists/group/${groupId}`).then(res => res.data),

  // Obtener una lista por ID
  getListById: (listId) => API.get(`/lists/${listId}`).then(res => res.data),

  // Actualizar una lista
  updateList: (listId, listData) => API.put(`/lists/${listId}`, listData).then(res => res.data),

  // Eliminar una lista
  deleteList: (listId) => API.delete(`/lists/${listId}`).then(res => res.data)
}

// Servicios de tareas
export const taskService = {
  // Crear una nueva tarea
  createTask: (taskData) => API.post("/tasks", taskData).then(res => res.data),

  // Obtener tareas por lista
  getTasksByList: (listId) => API.get(`/tasks/${listId}`).then(res => res.data),

  // Actualizar una tarea
  updateTask: (taskId, taskData) => API.put(`/tasks/${taskId}`, taskData).then(res => res.data),

  // Eliminar una tarea
  deleteTask: (taskId) => API.delete(`/tasks/${taskId}`).then(res => res.data),

  // Asignar tarea a usuario
  assignTask: (taskId, assignData) => API.put(`/tasks/${taskId}/assign`, assignData).then(res => res.data),

  // Desasignar tarea a usuario
  unassignTask: (taskId, payload) => API.delete(`/tasks/${taskId}/assign`, { data: payload }).then(res => res.data),

  // Crear checklist
  createChecklist: (taskId, checklistData) => API.post(`/tasks/${taskId}/checklist`, checklistData).then(res => res.data),

  // Agregar elemento a checklist
  addChecklistElement: (taskId, checklistId, elementData) => API.post(`/tasks/${taskId}/checklist/${checklistId}/element`, elementData).then(res => res.data),

  // Actualizar elemento de checklist
  updateChecklistElement: (taskId, checklistId, elementId, elementData) => API.put(`/tasks/${taskId}/checklist/${checklistId}/element/${elementId}`, elementData).then(res => res.data),

  // Eliminar elemento de checklist
  deleteChecklistElement: (taskId, checklistId, elementId) => API.delete(`/tasks/${taskId}/checklist/${checklistId}/element/${elementId}`).then(res => res.data),

  // Eliminar checklist
  deleteChecklist: (taskId, checklistId) => API.delete(`/tasks/${taskId}/checklist/${checklistId}`).then(res => res.data),

  // Agregar tag
  addTag: (taskId, tagData) => API.post(`/tasks/${taskId}/tag`, tagData).then(res => res.data),

  // Actualizar tag
  updateTag: (taskId, tagId, tagData) => API.put(`/tasks/${taskId}/tag/${tagId}`, tagData).then(res => res.data),

  // Eliminar tag
  deleteTag: (taskId, tagId) => API.delete(`/tasks/${taskId}/tag/${tagId}`).then(res => res.data)
}

export default API
