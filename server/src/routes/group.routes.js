const express = require('express');
const router = express.Router();
const groupController = require('../controllers/group.controller');
const { authRequired } = require('../middlewares/validateToken');
const { validateSchema } = require('../middlewares/validator.middleware');
const { createGroupSchema, addUserToGroupSchema, updateGroupSchema, addListToGroupSchema, addAdminSchema } = require('../schemas/group.schema');

router.post('/', authRequired, validateSchema(createGroupSchema), groupController.createGroup); // Ruta para crear un grupo
router.get('/', authRequired, groupController.getAllGroups); // Ruta para obtener todos los grupos
router.get('/:groupId', authRequired, groupController.getGroupById); // Ruta para obtener un grupo por ID
router.get('/:groupId/available-users', authRequired, groupController.getAvailableUsers); // Ruta para obtener usuarios disponibles
router.delete('/:groupId/users/:userId', authRequired, groupController.removeUserFromGroup); // Ruta para remover un usuario del grupo
router.post('/:groupId/admins', authRequired, validateSchema(addAdminSchema), groupController.addAdmin); // Ruta para añadir un administrador
router.delete('/:groupId/admins/:userId', authRequired, groupController.removeAdmin); // Ruta para remover un administrador
router.post('/:groupId/lists', authRequired, validateSchema(addListToGroupSchema), groupController.addListToGroup); // Ruta para añadir listas a un grupo
router.patch('/:groupId', authRequired, validateSchema(updateGroupSchema), groupController.updateGroup); // Ruta para actualizar un grupo (incluye backgroundImage)
router.delete('/:groupId', authRequired, groupController.deleteGroup); // Ruta para eliminar un grupo

module.exports = router