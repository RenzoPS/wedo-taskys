const Task = require('../models/task.js')
const List = require('../models/list.js')
const User = require('../models/user.js')
const appError = require('../utils/appError.js')
const Group = require('../models/group')
const { getId, isOwner, isMember, isOwnerOrAdmin } = require('../utils/helpers.js')
const { logAudit } = require('../utils/auditLogger.js')

exports.createTask = async (req, res, next) => {
    const { title, description, listId } = req.body
    const userId = req.user.id
    try {
        const list = await List.findById(listId)
        if (!list) {
            throw new appError('Lista no encontrada', 404)
        }

        const group = await Group.findById(list.groupId)
        if (!group) {
            throw new appError('Grupo no encontrado', 404)
        }

        if (!isOwnerOrAdmin(group, userId)) {
            throw new appError('No tienes permisos para crear tareas', 403)
        }

        const newTask = new Task({ title, description, list: listId })
        const taskExists = await Task.findOne({ title, list: listId })
        if (taskExists) {
            throw new appError('Tarea ya existe', 400)
        }

        list.tasksIds.push(newTask._id)
        await list.save()
        await newTask.save()

        // Registrar en auditoría
        logAudit('CREATE', 'TASK', newTask._id.toString(), userId, { title, listId })

        res.status(201).json(newTask)
    } catch (e) {
        next(e)
    }
}

exports.getTasks = async (req, res, next) => {
    const { listId } = req.params;
    const userId = req.user.id
    try {
        const list = await List.findById(listId);
        if (!list) {
            throw new appError('Lista no encontrada', 404);
        }

        const group = await Group.findById(list.groupId);
        if (!group) {
            throw new appError('Grupo no encontrado', 404);
        }

        if (!isMember(group, req.user.id)) {
            throw new appError('No tienes permisos para obtener tareas', 403);
        }

        const tasks = await Task.find({ list: listId }).populate('assignedTo', 'userName email');
        res.status(200).json(tasks);
    } catch (e) {
        next(e);
    }
}

exports.updateTask = async (req, res, next) => {
    const { taskId } = req.params
    const { title, description, completed } = req.body
    const userId = req.user.id
    try {
        const task = await Task.findById(taskId)
        if (!task) {
            throw new appError('Tarea no encontrada', 404)
        }

        const list = await List.findById(task.list)
        if (!list) {
            throw new appError('Lista no encontrada', 404)
        }

        const group = await Group.findById(list.groupId)
        if (!group) {
            throw new appError('Grupo no encontrado', 404)
        }

        const isAssigned = task.assignedTo && task.assignedTo.some(id => id.toString() === userId.toString())
        if (!isOwnerOrAdmin(group, userId) && !isAssigned) {
            throw new appError('No tienes permisos para actualizar tareas', 403)
        }

        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            {
                $set: {
                    title,
                    description,
                    completed
                }
            },
            { new: true }
        ).populate('assignedTo', 'userName email')

        // Registrar en auditoría
        logAudit('UPDATE', 'TASK', taskId, userId, { title, description, completed })

        res.status(200).json(updatedTask)
    } catch (e) {
        next(e)
    }
}

exports.assignTask = async (req, res, next) => {
    const { taskId } = req.params
    const { userId, groupId } = req.body
    const currentUserId = req.user.id
    try {
        const task = await Task.findById(taskId)
        if (!task) {
            throw new appError('Tarea no encontrada', 404)
        }

        const group = await Group.findById(groupId)
        if (!group) {
            throw new appError('Grupo no encontrado', 404)
        }
        if (!isOwnerOrAdmin(group, currentUserId)) {
            throw new appError('No tienes permisos para asignar tareas', 403)
        }

        const user = await User.findById(userId)

        if(!isMember(group, userId)){
            throw new appError('El usuario no pertenece al grupo', 403)
        }

        if(user.tasksToDo.includes(task._id)) {
            throw new appError('El usuario ya tiene esta tarea asignada', 403)
        }

        task.assignedTo.push(user._id)
        await task.save()
        user.tasksToDo.push(task._id)
        await user.save()
        
        // Registrar en auditoría
        logAudit('UPDATE', 'TASK', taskId, currentUserId, { action: 'assign', assignedUserId: userId })
        
        // Poblar assignedTo antes de devolver
        await task.populate('assignedTo', 'userName email')
        res.status(200).json(task)
        
    } catch (e) {
        next(e)
    }
}

exports.removeTaskAssignee = async (req, res, next) => {
    const { taskId } = req.params
    const { userId, groupId } = req.body
    const currentUserId = req.user.id
    try {
        const task = await Task.findById(taskId)
        if (!task) {
            throw new appError('Tarea no encontrada', 404)
        }

        const group = await Group.findById(groupId)
        if (!group) {
            throw new appError('Grupo no encontrado', 404)
        }

        if (!isOwnerOrAdmin(group, currentUserId)) {
            throw new appError('No tienes permisos para desasignar tareas', 403)
        }

        const user = await User.findById(userId)

        if (!isMember(group, userId)) {
            throw new appError('El usuario no pertenece al grupo', 403)
        }

        if(!user.tasksToDo.includes(task._id)) {
            throw new appError('El usuario no tiene esta tarea asignada', 403)
        }

        task.assignedTo.pull(user._id)
        await task.save()
        user.tasksToDo.pull(task._id)
        await user.save()
        
        // Registrar en auditoría
        logAudit('UPDATE', 'TASK', taskId, currentUserId, { action: 'unassign', unassignedUserId: userId })
        
        // Poblar assignedTo antes de devolver
        await task.populate('assignedTo', 'userName email')
        res.status(200).json(task)
        
    } catch (e) {
        next(e)
    }
}

exports.createChecklist = async (req, res, next) => {
    const { taskId } = req.params
    const { title } = req.body
    const userId = req.user.id
    try {
        const task = await Task.findById(taskId)
        if (!task) {
            throw new appError('Tarea no encontrada', 404)
        }
        
        const list = await List.findById(task.list)
        const group = await Group.findById(list.groupId)
        const isAssigned = task.assignedTo && task.assignedTo.some(id => id.toString() === userId.toString())
        
        if (!isOwnerOrAdmin(group, userId) && !isAssigned) {
            throw new appError('No tienes permisos para modificar esta tarea', 403)
        }
        
        const newChecklist = { title, elements: [] }
        task.checklist.push(newChecklist)
        await task.save()
        
        // Registrar en auditoría
        logAudit('CREATE', 'TASK_CHECKLIST', taskId, req.user.id, { checklistTitle: title })
        
        res.status(201).json(newChecklist)
    } catch (e) {
        next(e)
    }
}

exports.addChecklistElement = async (req, res, next) => {
    const { taskId, checklistId } = req.params
    const { title } = req.body
    const userId = req.user.id
    try {
        const task = await Task.findById(taskId)
        if (!task) {
            throw new appError('Tarea no encontrada', 404)
        }
        
        const list = await List.findById(task.list)
        const group = await Group.findById(list.groupId)
        const isAssigned = task.assignedTo && task.assignedTo.some(id => id.toString() === userId.toString())
        
        if (!isOwnerOrAdmin(group, userId) && !isAssigned) {
            throw new appError('No tienes permisos para modificar esta tarea', 403)
        }
        
        const checklist = task.checklist.id(checklistId)
        if (!checklist) {
            throw new appError('Checklist no encontrada', 404)
        }
        
        const newElement = { title, completed: false }
        checklist.elements.push(newElement)
        await task.save()
        
        // Registrar en auditoría
        logAudit('CREATE', 'TASK_CHECKLIST_ELEMENT', taskId, req.user.id, { checklistId, elementTitle: title })
        
        res.status(201).json(newElement)
    } catch (e) {
        next(e)
    }
}

exports.updateChecklistElement = async (req, res, next) => {
    const { taskId, checklistId, elementId } = req.params
    const { title, completed } = req.body
    const userId = req.user.id
    try {
        const task = await Task.findById(taskId)
        if (!task) {
            throw new appError('Tarea no encontrada', 404)
        }
        
        const list = await List.findById(task.list)
        const group = await Group.findById(list.groupId)
        const isAssigned = task.assignedTo && task.assignedTo.some(id => id.toString() === userId.toString())
        
        if (!isOwnerOrAdmin(group, userId) && !isAssigned) {
            throw new appError('No tienes permisos para modificar esta tarea', 403)
        }
        
        const checklist = task.checklist.id(checklistId)
        if (!checklist) {
            throw new appError('Checklist no encontrada', 404)
        }
        
        const element = checklist.elements.id(elementId)
        if (!element) {
            throw new appError('Elemento no encontrado', 404)
        }
        
        if (title !== undefined) element.title = title
        if (completed !== undefined) element.completed = completed
        await task.save()
        
        // Registrar en auditoría
        logAudit('UPDATE', 'TASK_CHECKLIST_ELEMENT', taskId, req.user.id, { checklistId, elementId, title, completed })
        
        res.status(200).json(element)
    } catch (e) {
        next(e)
    }
}

exports.addTag = async (req, res, next) => {
    const { taskId } = req.params
    const { name, color } = req.body
    const userId = req.user.id
    try {
        const task = await Task.findById(taskId)
        if (!task) {
            throw new appError('Tarea no encontrada', 404)
        }
        
        const list = await List.findById(task.list)
        const group = await Group.findById(list.groupId)
        const isAssigned = task.assignedTo && task.assignedTo.some(id => id.toString() === userId.toString())
        
        if (!isOwnerOrAdmin(group, userId) && !isAssigned) {
            throw new appError('No tienes permisos para modificar esta tarea', 403)
        }
        
        const newTag = { name, color }
        task.tags.push(newTag)
        await task.save()
        
        // Registrar en auditoría
        logAudit('CREATE', 'TASK_TAG', taskId, req.user.id, { name, color })
        
        res.status(201).json(newTag)
    } catch (e) {
        next(e)
    }
}

exports.updateTag = async (req, res, next) => {
    const { taskId, tagId } = req.params
    const { name, color } = req.body
    const userId = req.user.id
    try {
        const task = await Task.findById(taskId)
        if (!task) {
            throw new appError('Tarea no encontrada', 404)
        }
        
        const list = await List.findById(task.list)
        const group = await Group.findById(list.groupId)
        const isAssigned = task.assignedTo && task.assignedTo.some(id => id.toString() === userId.toString())
        
        if (!isOwnerOrAdmin(group, userId) && !isAssigned) {
            throw new appError('No tienes permisos para modificar esta tarea', 403)
        }
        
        const tag = task.tags.id(tagId)
        if (!tag) {
            throw new appError('Etiqueta no encontrada', 404)
        }
        
        tag.name = name
        tag.color = color
        await task.save()
        
        // Registrar en auditoría
        logAudit('UPDATE', 'TASK_TAG', taskId, req.user.id, { tagId, name, color })
        
        res.status(200).json(tag)
    } catch (e) {
        next(e)
    }
}

exports.deleteChecklistElement = async (req, res, next) => {
    const { taskId, checklistId, elementId } = req.params
    const userId = req.user.id
    try {
        const task = await Task.findById(taskId)
        if (!task) {
            throw new appError('Tarea no encontrada', 404)
        }
        
        const list = await List.findById(task.list)
        const group = await Group.findById(list.groupId)
        const isAssigned = task.assignedTo && task.assignedTo.some(id => id.toString() === userId.toString())
        
        if (!isOwnerOrAdmin(group, userId) && !isAssigned) {
            throw new appError('No tienes permisos para modificar esta tarea', 403)
        }
        
        const checklist = task.checklist.id(checklistId)
        if (!checklist) {
            throw new appError('Checklist no encontrada', 404)
        }
        
        const element = checklist.elements.id(elementId)
        if (!element) {
            throw new appError('Elemento no encontrado', 404)
        }
        
        checklist.elements.pull(elementId)
        await task.save()
        
        // Registrar en auditoría
        logAudit('DELETE', 'TASK_CHECKLIST_ELEMENT', taskId, req.user.id, { checklistId, elementId })
        
        res.status(200).json(element)
    } catch (e) {
        next(e)
    }
}

exports.deleteChecklist = async (req, res, next) => {
    const { taskId, checklistId } = req.params
    const userId = req.user.id
    try {
        const task = await Task.findById(taskId)
        if (!task) {
            throw new appError('Tarea no encontrada', 404)
        }
        
        const list = await List.findById(task.list)
        const group = await Group.findById(list.groupId)
        const isAssigned = task.assignedTo && task.assignedTo.some(id => id.toString() === userId.toString())
        
        if (!isOwnerOrAdmin(group, userId) && !isAssigned) {
            throw new appError('No tienes permisos para modificar esta tarea', 403)
        }
        
        const checklist = task.checklist.id(checklistId)
        if (!checklist) {
            throw new appError('Checklist no encontrada', 404)
        }
        
        task.checklist.pull(checklistId)
        await task.save()
        
        // Registrar en auditoría
        logAudit('DELETE', 'TASK_CHECKLIST', taskId, req.user.id, { checklistId })
        
        res.status(200).json(checklist)
    } catch (e) {
        next(e)
    }
}

exports.deleteTag = async (req, res, next) => {
    const { taskId, tagId } = req.params
    const userId = req.user.id
    try {
        const task = await Task.findById(taskId)
        if (!task) {
            throw new appError('Tarea no encontrada', 404)
        }
        
        const list = await List.findById(task.list)
        const group = await Group.findById(list.groupId)
        const isAssigned = task.assignedTo && task.assignedTo.some(id => id.toString() === userId.toString())
        
        if (!isOwnerOrAdmin(group, userId) && !isAssigned) {
            throw new appError('No tienes permisos para modificar esta tarea', 403)
        }
        
        const tag = task.tags.id(tagId)
        if (!tag) {
            throw new appError('Etiqueta no encontrada', 404)
        }
        
        task.tags.pull(tagId)
        await task.save()
        
        // Registrar en auditoría
        logAudit('DELETE', 'TASK_TAG', taskId, req.user.id, { tagId })
        
        res.status(200).json(tag)
    } catch (e) {
        next(e)
    }
}

exports.deleteTask = async (req, res, next) => {
    const { taskId } = req.params
    const userId = req.user.id
    try {

        const task = await Task.findById(taskId)
        if (!task) {
            throw new appError('Tarea no encontrada', 404)
        }

        const list = await List.findById(task.list)
        if (!list) {
            throw new appError('Lista no encontrada', 404)
        }

        const group = await Group.findById(list.groupId)
        if (!group) {
            throw new appError('Grupo no encontrado', 404)
        }

        if(!isOwnerOrAdmin(group, userId)){
            throw new appError('No tienes permisos para eliminar tareas', 403)
        }
        

        // Limpiar lista
        list.tasksIds.pull(taskId)
        await list.save()
        
        // Limpiar TODOS los usuarios que tenían la tarea asignada
        if (task.assignedTo && task.assignedTo.length > 0) {
            await User.updateMany(
                { _id: { $in: task.assignedTo } },
                { $pull: { tasksToDo: taskId } }
            )
        }

        await task.deleteOne()
        
        // Registrar en auditoría
        logAudit('DELETE', 'TASK', taskId, userId, { title: task.title, listId: task.list })
        
        res.status(200).json(task)
    } catch (e) {
        next(e)
    }
}