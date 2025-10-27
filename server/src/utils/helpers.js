/**
 * Helpers simples para operaciones comunes
 */

/**
 * Obtiene el ID de un owner/member de forma segura
 */
exports.getId = (obj) => {
  if (!obj) return null;
  return obj._id ? obj._id.toString() : obj.toString();
}

/**
 * Verifica si userId es el owner del grupo
 */
exports.isOwner = (group, userId) => {
  return this.getId(group.owner) === userId;
}

/**
 * Verifica si userId es miembro del grupo
 */
exports.isMember = (group, userId) => {
  const ownerId = this.getId(group.owner);
  if (ownerId === userId) return true;
  
  return group.members.some(m => this.getId(m) === userId);
}

/**
 * Verifica si userId es owner O admin del grupo (para permisos de contenido)
 */
exports.isOwnerOrAdmin = (group, userId) => {
  if (this.getId(group.owner) === userId) return true;
  return group.admins && group.admins.some(id => this.getId(id) === userId);
}
