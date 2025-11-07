// Centralized translation for backend-originated messages.
// We translate well-known Spanish messages returned by the server to English when needed.

const ES_TO_EN = {
  // Groups
  'Ya tienes un grupo con ese nombre': 'You already have a group with that name',
  'Grupo no encontrado': 'Group not found',
  'El grupo no existe': 'The group does not exist',
  'Solo el propietario puede agregar usuarios': 'Only the owner can add users',
  'Usuario no encontrado': 'User not found',
  'El usuario ya está en este grupo': 'The user is already in this group',
  'Usuario agregado al grupo exitosamente': 'User successfully added to the group',
  'No tienes permisos para agregar listas': "You don't have permissions to add lists",
  'Lista agregada al grupo exitosamente': 'List successfully added to the group',
  'Solo el propietario puede agregar administradores': 'Only the owner can add administrators',
  'El usuario debe ser miembro del grupo primero': 'The user must be a member of the group first',
  'El usuario ya es administrador': 'The user is already an administrator',
  'Administrador agregado al grupo exitosamente': 'Administrator successfully added to the group',
  'Solo el propietario puede remover administradores': 'Only the owner can remove administrators',
  'El usuario no es administrador': 'The user is not an administrator',
  'Administrador removido del grupo exitosamente': 'Administrator successfully removed from the group',
  'No tienes permisos para eliminar este grupo': "You don't have permissions to delete this group",
  'Grupo eliminado exitosamente': 'Group successfully deleted',
  'Solo el propietario puede ver usuarios disponibles': 'Only the owner can view available users',
  'Solo el propietario puede remover usuarios': 'Only the owner can remove users',
  'No puedes remover al propietario del grupo': "You can't remove the group owner",
  'El usuario no está en este grupo': 'The user is not in this group',
  'Usuario removido del grupo exitosamente': 'User successfully removed from the group',
  'Ya existe una lista con ese título en este grupo': 'A list with that title already exists in this group',

  // Lists
  'Lista no encontrada': 'List not found',

  // Tasks
  'Tarea ya existe': 'Task already exists',
  'Tarea no encontrada': 'Task not found',
  'No tienes permisos para crear tareas': "You don't have permissions to create tasks",
  'No tienes permisos para obtener tareas': "You don't have permissions to get tasks",
  'No tienes permisos para actualizar tareas': "You don't have permissions to update tasks",
  'No tienes permisos para desasignar tareas': "You don't have permissions to unassign tasks",
  'No tienes permisos para eliminar tareas': "You don't have permissions to delete tasks",
  'No tienes permisos para asignar tareas': "You don't have permissions to assign tasks",
  'El usuario no pertenece al grupo': 'The user does not belong to the group',
  'El usuario ya tiene esta tarea asignada': 'The user already has this task assigned',
  'El usuario no tiene esta tarea asignada': 'The user does not have this task assigned',
  'Checklist no encontrada': 'Checklist not found',
  'Elemento no encontrado': 'Element not found',
  'Etiqueta no encontrada': 'Tag not found',

  // Auth and common
  'Token inválido': 'Invalid token',
  'No autorizado': 'Unauthorized',
  'Credenciales inválidas': 'Invalid credentials',
  'Usuario ya existe': 'User already exists',
  'El usuario ya existe': 'User already exists',
  'El usuario no existe': 'User does not exist',
  'Correo ya registrado': 'Email already registered',
  'La contraseña es incorrecta': 'Incorrect password',
};

export function translateBackendMessage(message, lang = 'es') {
  if (!message || typeof message !== 'string') return message;
  if (lang === 'en') {
    // If the backend already returned an English message, keep it.
    // Otherwise try to map from Spanish to English.
    return ES_TO_EN[message] || message;
  }
  // Default: return as-is for Spanish.
  return message;
}

export default translateBackendMessage;
