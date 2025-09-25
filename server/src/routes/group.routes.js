const express = require('express');
const router = express.Router();
const groupController = require('../controllers/group.controller'); // Importa el controlador de grupo
const { authRequired } = require('../middlewares/validateToken'); // Importa el middleware de autenticación
const { validateSchema } = require('../middlewares/validator.middleware'); // Importa el middleware de validación
const { createGroupSchema, addUserToGroupSchema, updateGroupSchema } = require('../schemas/group.schema'); // Importa los esquemas de validación

router.post('/', authRequired, validateSchema(createGroupSchema), groupController.createGroup); // Ruta para crear un grupo
router.get('/', authRequired, groupController.getAllGroups); // Ruta para obtener todos los grupos
router.get('/:groupId', authRequired, groupController.getGroupById); // Ruta para obtener un grupo por ID
router.get('/:groupId/available-users', authRequired, groupController.getAvailableUsers); // Ruta para obtener usuarios disponibles
router.post('/:groupId/users', authRequired, validateSchema(addUserToGroupSchema), groupController.addUserToGroup); // Ruta para añadir un usuario a un grupo
router.delete('/:groupId/users/:userId', authRequired, groupController.removeUserFromGroup); // Ruta para remover un usuario del grupo
router.post('/:groupId/lists', authRequired, groupController.addListToGroup); // Ruta para añadir listas a un grupo
router.patch('/:groupId', authRequired, validateSchema(updateGroupSchema), groupController.updateGroup); // Ruta para actualizar un grupo
router.delete('/:groupId', authRequired, groupController.deleteGroup); // Ruta para eliminar un grupo

module.exports = router