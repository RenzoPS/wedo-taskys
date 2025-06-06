const express = require('express');
const router = express.Router();
const groupController = require('../controllers/group.controller'); // Importa el controlador de grupo
const { authRequired } = require('../middlewares/validateToken'); // Importa el middleware de autenticación
const { validateSchema } = require('../middlewares/validator.middleware'); // Importa el middleware de validación

router.post('/', authRequired, groupController.createGroup); // Ruta para crear un grupo
router.get('/', authRequired, groupController.getAllGroups); // Ruta para obtener todos los grupos
router.post('/:groupId/users', authRequired, groupController.addUserToGroup); // Ruta para añadir un usuario a un grupo
router.post('/:groupId/lists', authRequired, groupController.addListsToGroup); // Ruta para añadir listas a un grupo
router.get('/:groupId', authRequired, groupController.getGroupById); // Ruta para obtener un grupo por ID
router.delete('/:groupId', authRequired, groupController.deleteGroup); // Ruta para eliminar un grupo

