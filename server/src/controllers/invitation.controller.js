const Invitation = require('../models/invitation');
const Group = require('../models/group');
const User = require('../models/user');
const AppError = require('../utils/appError');
const { isOwner } = require('../utils/helpers');
const { logAudit } = require('../utils/auditLogger');

// Enviar invitación a un usuario
exports.sendInvitation = async (req, res, next) => {
    const { groupId } = req.params;
    const { userId } = req.body;
    const senderId = req.user.id;

    try {
        const group = await Group.findById(groupId);
        if (!group) {
            throw new AppError('Grupo no encontrado', 404);
        }

        if (!isOwner(group, senderId)) {
            throw new AppError('Solo el propietario puede enviar invitaciones', 403);
        }

        const receiver = await User.findById(userId);
        if (!receiver) {
            throw new AppError('Usuario no encontrado', 404);
        }

        // Verificar si el usuario ya es miembro
        if (group.members.some(m => m.toString() === userId)) {
            throw new AppError('El usuario ya es miembro del grupo', 400);
        }

        // Verificar si el receptor ha bloqueado al sender
        if (receiver.blockedUsers && receiver.blockedUsers.some(id => id.toString() === senderId)) {
            throw new AppError('No puedes enviar invitaciones a este usuario', 403);
        }

        // Verificar si ya existe una invitación pendiente
        const existingInvitation = await Invitation.findOne({
            group: groupId,
            receiver: userId,
            status: 'pending'
        });

        if (existingInvitation) {
            throw new AppError('Ya existe una invitación pendiente para este usuario', 400);
        }

        const invitation = new Invitation({
            group: groupId,
            sender: senderId,
            receiver: userId
        });

        await invitation.save();

        await invitation.populate('group', 'name description');
        await invitation.populate('sender', 'userName email');

        logAudit('CREATE', 'INVITATION', invitation._id.toString(), senderId, { groupId, receiverId: userId });

        res.status(201).json(invitation);
    } catch (e) {
        next(e);
    }
};

// Obtener invitaciones del usuario actual
exports.getMyInvitations = async (req, res, next) => {
    const userId = req.user.id;

    try {
        const invitations = await Invitation.find({
            receiver: userId,
            status: 'pending'
        })
        .populate('group', 'name description')
        .populate('sender', 'userName email')
        .sort({ createdAt: -1 });

        res.status(200).json(invitations);
    } catch (e) {
        next(e);
    }
};

// Aceptar invitación
exports.acceptInvitation = async (req, res, next) => {
    const { invitationId } = req.params;
    const userId = req.user.id;

    try {
        const invitation = await Invitation.findById(invitationId);
        if (!invitation) {
            throw new AppError('Invitación no encontrada', 404);
        }

        if (invitation.receiver.toString() !== userId) {
            throw new AppError('No tienes permisos para aceptar esta invitación', 403);
        }

        if (invitation.status !== 'pending') {
            throw new AppError('Esta invitación ya fue respondida', 400);
        }

        const group = await Group.findById(invitation.group);
        if (!group) {
            throw new AppError('El grupo ya no existe', 404);
        }

        // Agregar usuario al grupo
        if (!group.members.some(m => m.toString() === userId)) {
            group.members.push(userId);
            await group.save();
        }

        // Actualizar invitación
        invitation.status = 'accepted';
        invitation.respondedAt = new Date();
        await invitation.save();

        await group.populate('owner', '_id userName email');
        await group.populate('members', '_id userName email');

        logAudit('UPDATE', 'INVITATION', invitationId, userId, { action: 'accept', groupId: group._id.toString() });

        res.status(200).json({ message: 'Invitación aceptada', group });
    } catch (e) {
        next(e);
    }
};

// Rechazar invitación
exports.rejectInvitation = async (req, res, next) => {
    const { invitationId } = req.params;
    const userId = req.user.id;

    try {
        const invitation = await Invitation.findById(invitationId);
        if (!invitation) {
            throw new AppError('Invitación no encontrada', 404);
        }

        if (invitation.receiver.toString() !== userId) {
            throw new AppError('No tienes permisos para rechazar esta invitación', 403);
        }

        if (invitation.status !== 'pending') {
            throw new AppError('Esta invitación ya fue respondida', 400);
        }

        invitation.status = 'rejected';
        invitation.respondedAt = new Date();
        await invitation.save();

        logAudit('UPDATE', 'INVITATION', invitationId, userId, { action: 'reject', groupId: invitation.group.toString() });

        res.status(200).json({ message: 'Invitación rechazada' });
    } catch (e) {
        next(e);
    }
};

// Bloquear usuario
exports.blockUser = async (req, res, next) => {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    try {
        if (userId === currentUserId) {
            throw new AppError('No puedes bloquearte a ti mismo', 400);
        }

        const user = await User.findById(currentUserId);
        const userToBlock = await User.findById(userId);

        if (!userToBlock) {
            throw new AppError('Usuario no encontrado', 404);
        }

        if (user.blockedUsers && user.blockedUsers.some(id => id.toString() === userId)) {
            throw new AppError('Este usuario ya está bloqueado', 400);
        }

        user.blockedUsers.push(userId);
        await user.save();

        // Rechazar todas las invitaciones pendientes de este usuario
        await Invitation.updateMany(
            {
                receiver: currentUserId,
                sender: userId,
                status: 'pending'
            },
            {
                status: 'rejected',
                respondedAt: new Date()
            }
        );

        logAudit('UPDATE', 'USER', currentUserId, currentUserId, { action: 'blockUser', blockedUserId: userId });

        res.status(200).json({ message: 'Usuario bloqueado' });
    } catch (e) {
        next(e);
    }
};

// Desbloquear usuario
exports.unblockUser = async (req, res, next) => {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    try {
        const user = await User.findById(currentUserId);

        if (!user.blockedUsers || !user.blockedUsers.some(id => id.toString() === userId)) {
            throw new AppError('Este usuario no está bloqueado', 400);
        }

        user.blockedUsers = user.blockedUsers.filter(id => id.toString() !== userId);
        await user.save();

        logAudit('UPDATE', 'USER', currentUserId, currentUserId, { action: 'unblockUser', unblockedUserId: userId });

        res.status(200).json({ message: 'Usuario desbloqueado' });
    } catch (e) {
        next(e);
    }
};

// Obtener usuarios bloqueados
exports.getBlockedUsers = async (req, res, next) => {
    const userId = req.user.id;

    try {
        const user = await User.findById(userId).populate('blockedUsers', 'userName email');
        res.status(200).json(user.blockedUsers || []);
    } catch (e) {
        next(e);
    }
};
