const List = require('../models/list');
const AppError = require('../utils/appError');

// Controlador de listas con permisos basados en propiedad del grupo:
// - Solo el propietario del grupo puede crear, editar y eliminar listas
// - Los miembros del grupo pueden visualizar las listas
// - Las listas solo tienen un nombre que puede ser editado por el propietario

exports.createList = async (req, res, next) => {
    const { title, groupId } = req.body;
    const userId = req.user.id; // El usuario autenticado
    
    try {
        // Verificar que el grupo existe
        const Group = require('../models/group');
        const group = await Group.findById(groupId);
        if (!group) {
            throw new AppError('El grupo no existe', 404);
        }
        
        // Verificar que el usuario es el propietario del grupo
        const ownerId = group.owner._id ? group.owner._id.toString() : group.owner.toString();
        console.log('Debug - User ID:', userId);
        console.log('Debug - Group Owner:', group.owner);
        console.log('Debug - Owner ID:', ownerId);
        if (ownerId !== userId) {
            throw new AppError('Solo el propietario del grupo puede crear listas', 403);
        }
        
        // Verificar que no exista una lista con el mismo título en el mismo grupo
        const listExists = await List.findOne({ title, groupId });
        if (listExists) {
            throw new AppError('Ya existe una lista con ese título en este grupo', 400);
        }

        // Crear la lista con el groupId
        const list = new List({ title, groupId });
        await list.save();
        
        // Actualizar el grupo para incluir la nueva lista
        group.lists.push(list._id);
        await group.save();
        
        res.status(201).json(list); 

    } catch (e) {
        next(e);
    }
}

exports.getListById = async (req, res, next) => {
    const { listId } = req.params
    const userId = req.user.id; // El usuario autenticado
    
    try {
        // Verificar que la lista existe
        const list = await List.findById(listId);
        if (!list) {
            throw new AppError('La lista no existe', 404);
        }
        
        // Verificar que el usuario tiene permisos para ver la lista
        const Group = require('../models/group');
        const group = await Group.findById(list.groupId);
        if (!group) {
            throw new AppError('El grupo asociado no existe', 404);
        }
        
        // Verificar que el usuario es miembro o propietario del grupo
        const ownerId = group.owner._id ? group.owner._id.toString() : group.owner.toString();
        if (!group.members.includes(userId) && ownerId !== userId) {
            throw new AppError('No tienes permisos para ver esta lista', 403);
        }
        
        res.status(200).json(list);
    } catch (e) {
        next(e);
    }
}

exports.getLists = async (req, res, next) => {
    const userId = req.user.id; // El usuario autenticado
    
    try {
        // Obtener todos los grupos donde el usuario es miembro o propietario
        const Group = require('../models/group');
        const userGroups = await Group.find({
            $or: [
                { owner: userId },
                { members: userId }
            ]
        });
        
        // Obtener los IDs de los grupos
        const groupIds = userGroups.map(group => group._id);
        
        // Obtener todas las listas que pertenecen a esos grupos
        const lists = await List.find({ groupId: { $in: groupIds } });
        
        res.status(200).json(lists);
    } catch (e) {
        next(e);
    }
}

exports.getListsByGroup = async (req, res, next) => {
    const { groupId } = req.params;
    const userId = req.user.id; // El usuario autenticado
    
    try {
        // Verificar que el grupo existe
        const Group = require('../models/group');
        const group = await Group.findById(groupId);
        if (!group) {
            throw new AppError('El grupo no existe', 404);
        }
        
        // Verificar que el usuario es miembro o propietario del grupo
        const ownerId = group.owner._id ? group.owner._id.toString() : group.owner.toString();
        if (!group.members.includes(userId) && ownerId !== userId) {
            throw new AppError('No tienes permisos para ver las listas de este grupo', 403);
        }
        
        // Obtener todas las listas del grupo
        const lists = await List.find({ groupId });
        
        res.status(200).json(lists);
    } catch (e) {
        next(e);
    }
}

exports.updateList = async (req, res, next) => {
    const { listId } = req.params
    const { title } = req.body
    const userId = req.user.id; // El usuario autenticado
    
    try {
        // Verificar que la lista existe
        const list = await List.findById(listId);
        if (!list) {
            throw new AppError('La lista no existe', 404);
        }
        
        // Verificar que el usuario tiene permisos para actualizar la lista
        const Group = require('../models/group');
        const group = await Group.findById(list.groupId);
        if (!group) {
            throw new AppError('El grupo asociado no existe', 404);
        }
        
        // Verificar que el usuario es el propietario del grupo
        const ownerId = group.owner._id ? group.owner._id.toString() : group.owner.toString();
        if (ownerId !== userId) {
            throw new AppError('Solo el propietario del grupo puede editar el nombre de las listas', 403);
        }
        
        // Verificar que no exista otra lista con el mismo título en el mismo grupo (excluyendo la lista actual)
        const listExists = await List.findOne({ 
            title, 
            groupId: list.groupId,
            _id: { $ne: listId } // Excluir la lista actual
        });
        if (listExists) {
            throw new AppError('Ya existe una lista con ese título en este grupo', 400);
        }
        
        // Actualizar la lista
        const updatedList = await List.findByIdAndUpdate(
            listId, 
            { 
                $set: {
                    title
                }
            },
            { new: true }
        )
        res.status(200).json(updatedList);
    } catch (e) {
        next(e);
    }
}

exports.deleteList = async (req, res, next) => {
    const { listId } = req.params
    const userId = req.user.id; // El usuario autenticado
    
    try {
        // Verificar que la lista existe
        const list = await List.findById(listId);
        if (!list) {
            throw new AppError('La lista no existe', 404);
        }
        
        // Verificar que el usuario tiene permisos para eliminar la lista
        const Group = require('../models/group');
        const group = await Group.findById(list.groupId);
        if (!group) {
            throw new AppError('El grupo asociado no existe', 404);
        }
        
        // Verificar que el usuario es el propietario del grupo
        const ownerId = group.owner._id ? group.owner._id.toString() : group.owner.toString();
        if (ownerId !== userId) {
            throw new AppError('Solo el propietario del grupo puede eliminar listas', 403);
        }
        
        // Eliminar la lista
        await List.findByIdAndDelete(listId);
        
        // Eliminar la referencia de la lista en el grupo
        group.lists = group.lists.filter(id => id.toString() !== listId);
        await group.save();
        
        res.status(200).json({ message: 'Lista eliminada exitosamente' });
    } catch (e) {
        next(e);
    }
}