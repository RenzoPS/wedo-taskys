const Group = require('../models/group.js');
const AppError = require('../utils/appError.js');

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
        await newGroup.populate('owner', 'name email');
        await newGroup.populate('members', 'name email');
        
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
        const group = await Group.findById(groupId);
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
        // Buscar grupos donde el usuario es propietario o miembro
        const groups = await Group.find({
            $or: [
                { owner: userId },
                { members: userId }
            ]
        }).populate('owner', 'name email')
          .populate('members', 'name email');
        
        res.status(200).json(groups);
    } catch (e) {
        next(e);
    }
}

exports.addUserToGroup = async (req, res, next) => {
    const { groupId } = req.params;
    const { userId } = req.body;
    const currentUserId = req.user.id;
    
    try {
        const group = await Group.findById(groupId);
        if (!group) {
            throw new AppError('Grupo no encontrado', 404);
        }
        
        // Verificar que el usuario actual es propietario del grupo
        if (group.owner.toString() !== currentUserId) {
            throw new AppError('Solo el propietario puede agregar usuarios', 403);
        }
        
        // Verificar que el usuario a agregar existe
        const User = require('../models/user.js');
        const userToAdd = await User.findById(userId);
        if (!userToAdd) {
            throw new AppError('Usuario no encontrado', 404);
        }
        
        // Verificar que el usuario no esté ya en el grupo
        if (group.members.includes(userId)) {
            throw new AppError('El usuario ya está en este grupo', 400);
        }
        
        group.members.push(userId);
        await group.save();
        
        // Populate para la respuesta con owner y members
        await group.populate('owner', 'name email');
        await group.populate('members', 'name email');
        
        res.status(200).json({
            message: 'Usuario agregado al grupo exitosamente',
            group: group
        });     
    } catch (e) {
        next(e);
    }
}

// exports.addListToGroup = async (req, res, next) => {
//     const { groupId } = req.params;
//     const { listIds } = req.body;
//     try {
//         const group = await Group.findById(groupId);
//         if (!group) {
//             throw new AppError('Group not found', 404);
//         }
//         if (group.lists.includes(listIds)) {
//             throw new AppError('List already in group', 400);
//         }
//         group.lists.push(...listIds);
//         await group.save();
//         res.status(200).json({
//             message: 'Lists added to group successfully',
//             groupId: group._id,
//             listIds: listIds
//         });
//     } catch (e) {
//         next(e);
//     }
// }

exports.updateGroup = async (req, res, next) => {
    const { groupId } = req.params;
    const { name, description } = req.body;
    const userId = req.user.id;

    try {
        // Verificar que el usuario es el propietario del grupo
        const group = await Group.findById(groupId);
        if (!group) {
            throw new AppError('El grupo no existe', 404);
        }
        
        if (group.owner.toString() !== userId) {
            throw new AppError('No tienes permisos para editar este grupo', 403);
        }

        const updatedGroup = await Group.findByIdAndUpdate(
            groupId, 
            { 
                $set: { 
                    name, 
                    description
                } 
            }, 
            { new: true }
        ).populate('owner', 'name email')
         .populate('members', 'name email');

        res.status(200).json(updatedGroup);
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
        
        if (group.owner.toString() !== userId) {
            throw new AppError('No tienes permisos para eliminar este grupo', 403);
        }
        
        await Group.findByIdAndDelete(groupId);
        
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
        if (group.owner.toString() !== currentUserId) {
            throw new AppError('Solo el propietario puede ver usuarios disponibles', 403);
        }
        
        const User = require('../models/user.js');
        // Obtener todos los usuarios excepto los que ya están en el grupo y el propietario
        const availableUsers = await User.find({
            _id: { 
                $nin: [...group.members, group.owner] 
            }
        }).select('name email');
        
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
        if (group.owner.toString() !== currentUserId) {
            throw new AppError('Solo el propietario puede remover usuarios', 403);
        }
        
        // Verificar que no se está intentando remover al propietario
        if (group.owner.toString() === userId) {
            throw new AppError('No puedes remover al propietario del grupo', 400);
        }
        
        // Verificar que el usuario está en el grupo
        if (!group.members.includes(userId)) {
            throw new AppError('El usuario no está en este grupo', 400);
        }
        
        // Remover el usuario del grupo
        group.members = group.members.filter(memberId => memberId.toString() !== userId);
        await group.save();
        
        // Populate para la respuesta
        await group.populate('owner', 'name email');
        await group.populate('members', 'name email');
        
        res.status(200).json({
            message: 'Usuario removido del grupo exitosamente',
            group: group
        });
    } catch (e) {
        next(e);
    }
}