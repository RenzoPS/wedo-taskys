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
  assignTask: (taskId, assignData) => API.put(`/tasks/${taskId}/asign`, assignData).then(res => res.data),

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
