const Group = require('../models/group.js');
const List = require('../models/list.js');
const Task = require('../models/task.js');
const User = require('../models/user.js');
const AppError = require('../utils/appError.js');
const { getId, isOwner, isMember, isOwnerOrAdmin } = require('../utils/helpers.js');
const { logAudit } = require('../utils/auditLogger.js');

exports.createGroup = async (req, res, next) => {
    const { name, description } = req.body;
    const userId = req.user.id; // El usuario autenticado
    
    try {
        const groupExists = await Group.findOne({ name, owner: userId });
        if (groupExists) {
            throw new AppError('Ya tienes un grupo con ese nombre', 400);
        }
        
        const newGroup = new Group({ 
            name, 
            description, 
            owner: userId,
            members: [userId] // El creador se agrega automáticamente como miembro
        });
        
        await newGroup.save();
        
        // Populate owner and members info for response
        await newGroup.populate('owner', '_id userName email');
        await newGroup.populate('members', '_id userName email');
        
        // Registrar en auditoría
        logAudit('CREATE', 'GROUP', newGroup._id.toString(), userId, { name, description });
        
        res.status(201).json({
            _id: newGroup._id,
            name: newGroup.name,
            description: newGroup.description,
            owner: newGroup.owner,
            members: newGroup.members,
            createdAt: newGroup.createdAt,
            updatedAt: newGroup.updatedAt
        });
    } catch (e) {
        next(e);
    }
}

exports.getGroupById = async (req, res, next) => {
    const { groupId } = req.params;
    try {
        const group = await Group.findById(groupId)
            .populate('lists')
            .populate('owner', '_id userName email')
            .populate('members', '_id userName email')
            .populate('admins', '_id userName email');
        if (!group) {
            throw new AppError('Grupo no encontrado', 404);
        }
        res.status(200).json(group);
    } catch (e) {
        next(e);
    }
}

exports.getAllGroups = async (req, res, next) => {
    const userId = req.user.id;
    try {
        // Buscar grupos donde el usuario es propietario, miembro o admin
        const groups = await Group.find({
            $or: [
                { owner: userId },
                { members: userId },
                { admins: userId }
            ]
        }).populate('owner', '_id userName email')
          .populate('members', '_id userName email')
          .populate('admins', '_id userName email');
        
        res.status(200).json(groups);
    } catch (e) {
        next(e);
    }
}

exports.addListToGroup = async (req, res, next) => {
    const { groupId } = req.params;
    const { listId } = req.body;
    const userId = req.user.id;
    try {

        const list = await List.findById(listId);
        if (!list) {
            throw new AppError('List not found', 404);
        }

        const group = await Group.findById(groupId);
        if (!group) {
            throw new AppError('Group not found', 404);
        }

        if(!isOwnerOrAdmin(group, userId)){
            throw new AppError('No tienes permisos para agregar listas', 403)
        }

        if (group.lists.includes(listId)) {
            throw new AppError('List already in group', 400);
        }
        
        group.lists.push(listId);
        await group.save();
        
        // Registrar en auditoría
        logAudit('UPDATE', 'GROUP', groupId, userId, { action: 'addList', listId });
        
        res.status(200).json({
            message: 'Lista agregada al grupo exitosamente',
            groupId: group._id,
            listId: listId
        });
    } catch (e) {
        next(e)
    }
}

exports.updateGroup = async (req, res, next) => {
    const { groupId } = req.params;
    const { name, description, backgroundImage } = req.body;
    const userId = req.user.id;

    try {
        // Verificar que el usuario es el propietario del grupo
        const group = await Group.findById(groupId);
        if (!group) {
            throw new AppError('El grupo no existe', 404);
        }
        
        if (!isOwner(group, userId)) {
            throw new AppError('No tienes permisos para editar este grupo', 403);
        }

        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (backgroundImage !== undefined) updateData.backgroundImage = backgroundImage;

        const updatedGroup = await Group.findByIdAndUpdate(
            groupId, 
            { $set: updateData }, 
            { new: true }
        ).populate('owner', '_id userName email')
         .populate('members', '_id userName email');

        // Registrar en auditoría
        logAudit('UPDATE', 'GROUP', groupId, userId, updateData);

        res.status(200).json(updatedGroup);
    } catch (e) {
        next(e);
    }
}

exports.addAdmin = async (req, res, next) => {
    const { groupId } = req.params;
    const { userId } = req.body;
    const currentUserId = req.user.id;
    try {
        const group = await Group.findById(groupId);
        if (!group) {
            throw new AppError('El grupo no existe', 404);
        }
        
        if (!isOwner(group, currentUserId)) {
            throw new AppError('Solo el propietario puede agregar administradores', 403);
        }
        
        // Verificar que el usuario existe
        const User = require('../models/user.js');
        const userToAdd = await User.findById(userId);
        if (!userToAdd) {
            throw new AppError('Usuario no encontrado', 404);
        }
        
        // Verificar que el usuario es miembro del grupo
        if (!isMember(group, userId)) {
            throw new AppError('El usuario debe ser miembro del grupo primero', 400);
        }
        
        // Verificar que no es ya admin
        if (group.admins && group.admins.some(id => getId(id) === userId)) {
            throw new AppError('El usuario ya es administrador', 400);
        }
        
        group.admins.push(userId);
        await group.save();
        
        // Registrar en auditoría
        logAudit('UPDATE', 'GROUP', groupId, currentUserId, { action: 'addAdmin', adminUserId: userId });
        
        // Populate para la respuesta
        await group.populate('owner', '_id userName email');
        await group.populate('admins', '_id userName email');
        
        res.status(200).json({
            message: 'Administrador agregado al grupo exitosamente',
            group: group
        })
    } catch (e) {
        next(e);
    }
}

exports.removeAdmin = async (req, res, next) => {
    const { groupId, userId } = req.params;
    const currentUserId = req.user.id;
    try {
        const group = await Group.findById(groupId);
        if (!group) {
            throw new AppError('El grupo no existe', 404);
        }
        
        if (!isOwner(group, currentUserId)) {
            throw new AppError('Solo el propietario puede remover administradores', 403);
        }
        
        // Verificar que el usuario es admin
        const isAdmin = group.admins && group.admins.some(id => getId(id) === userId);
        if (!isAdmin) {
            throw new AppError('El usuario no es administrador', 400);
        }
        
        group.admins.pull(userId);
        await group.save();
        
        // Registrar en auditoría
        logAudit('UPDATE', 'GROUP', groupId, currentUserId, { action: 'removeAdmin', removedAdminUserId: userId });
        
        res.status(200).json({
            message: 'Administrador removido del grupo exitosamente',
            groupId: group._id
        })
    } catch (e) {
        next(e);
    }
}

exports.deleteGroup = async (req, res, next) => {
    const { groupId } = req.params;
    const userId = req.user.id;
    
    try {
        // Verificar que el usuario es el propietario del grupo
        const group = await Group.findById(groupId);
        if (!group) {
            throw new AppError('El grupo no existe', 404);
        }
        if (!isOwner(group, userId)) {
            throw new AppError('No tienes permisos para eliminar este grupo', 403);
        }
        
        // Obtener IDs de tareas ANTES de eliminarlas
        const taskIds = await Task.find({ list: { $in: group.lists } }).distinct('_id');
        
        // Eliminar el grupo y sus dependencias
        await Group.findByIdAndDelete(groupId);
        await List.deleteMany({ groupId });
        await Task.deleteMany({ list: { $in: group.lists } });
        
        // Limpiar referencias de tareas en users
        if (taskIds.length > 0) {
            await User.updateMany(
                { tasksToDo: { $in: taskIds } },
                { $pull: { tasksToDo: { $in: taskIds } } }
            );
        }
        
        // Registrar en auditoría
        logAudit('DELETE', 'GROUP', groupId, userId, { name: group.name });
        
        res.status(200).json({
            message: 'Grupo eliminado exitosamente',
            groupId: group._id
        });
    }
    catch (e) {
        next(e);
    }
}

// Obtener usuarios disponibles para agregar al grupo
exports.getAvailableUsers = async (req, res, next) => {
    const { groupId } = req.params;
    const currentUserId = req.user.id;
    
    try {
        const group = await Group.findById(groupId);
        if (!group) {
            throw new AppError('Grupo no encontrado', 404);
        }
        
        // Verificar que el usuario actual es propietario del grupo
        if (!isOwner(group, currentUserId)) {
            throw new AppError('Solo el propietario puede ver usuarios disponibles', 403);
        }
        
        const User = require('../models/user.js');
        // Obtener todos los usuarios excepto los que ya están en el grupo y el propietario
        const availableUsers = await User.find({
            _id: { 
                $nin: [...group.members, group.owner] 
            }
        }).select('_id userName email');
        
        res.status(200).json(availableUsers);
    } catch (e) {
        next(e);
    }
}

// Remover usuario del grupo
exports.removeUserFromGroup = async (req, res, next) => {
    const { groupId, userId } = req.params;
    const currentUserId = req.user.id;
    
    try {
        const group = await Group.findById(groupId);
        if (!group) {
            throw new AppError('Grupo no encontrado', 404);
        }
        
        // Verificar que el usuario actual es propietario del grupo
        if (!isOwner(group, currentUserId)) {
            throw new AppError('Solo el propietario puede remover usuarios', 403);
        }
        
        // Verificar que no se está intentando remover al propietario
        if (isOwner(group, userId)) {
            throw new AppError('No puedes remover al propietario del grupo', 400);
        }
        
        // Verificar que el usuario está en el grupo
        if (!isMember(group, userId)) {
            throw new AppError('El usuario no está en este grupo', 400);
        }
        
        // Remover el usuario del grupo
        group.members = group.members.filter(memberId => memberId.toString() !== userId);
        await group.save();
        
        // Registrar en auditoría
        logAudit('UPDATE', 'GROUP', groupId, currentUserId, { action: 'removeUser', removedUserId: userId });
        
        // Populate para la respuesta
        await group.populate('owner', '_id userName email');
        await group.populate('members', '_id userName email');
        
        res.status(200).json({
            message: 'Usuario removido del grupo exitosamente',
            group: group
        });
    } catch (e) {
        next(e);
    }
}
