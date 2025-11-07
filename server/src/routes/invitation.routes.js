const express = require('express');
const router = express.Router();
const invitationController = require('../controllers/invitation.controller');
const { authRequired } = require('../middlewares/validateToken');
const { validateSchema } = require('../middlewares/validator.middleware');
const { sendInvitationSchema } = require('../schemas/invitation.schema');

// Todas las rutas requieren autenticación
router.use(authRequired);

// Enviar invitación
router.post('/groups/:groupId/invite', invitationController.sendInvitation);
router.get('/my-invitations', invitationController.getMyInvitations);
router.post('/:invitationId/accept', invitationController.acceptInvitation);
router.post('/:invitationId/reject', invitationController.rejectInvitation);
router.post('/block/:userId', invitationController.blockUser);
router.delete('/block/:userId', invitationController.unblockUser);
router.get('/blocked-users', invitationController.getBlockedUsers);

module.exports = router;
