const Task = require('../models/task.js')
const List = require('../models/list.js')
const User = require('../models/user.js')
const appError = require('../utils/appError.js')
const Group = require('../models/group')

exports.createTask = async (req, res, next) => {
    const { title, description, listId } = req.body
    try {
        const list = await List.findById(listId)
        if (!list) {
            throw new appError('Lista no encontrada', 404)
        }

        const newTask = new Task({ title, description, list: listId })
        const taskExists = await Task.findOne({ title, list: listId })
        if (taskExists) {
            throw new appError('Tarea ya existe', 400)
        }

        list.tasksIds.push(newTask._id)
        await list.save()
        await newTask.save()

        res.status(201).json(newTask)
    } catch (e) {
        next(e)
    }
}

exports.getTasks = async (req, res, next) => {
    const { listId } = req.params
    try {
        const tasks = await Task.find({ list: listId })
        res.status(200).json(tasks)
    } catch (e) {
        next(e)
    }
}

exports.updateTask = async (req, res, next) => {
    const { taskId } = req.params
    const { title, description, completed } = req.body
    try {
        const task = await Task.findByIdAndUpdate(
            taskId, {
                $set: { title, description, completed }
            },
            { new: true }
        )
        if (!task) {
            throw new appError('Tarea no encontrada', 404)
        }
        res.status(200).json(task)
    } catch (e) {
        next(e)
    }
}

exports.asignTask = async (req, res, next) => {
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

        const ownerId = group.owner._id ? group.owner._id.toString() : group.owner.toString();
        if (ownerId !== currentUserId) {
            throw new appError('Solo el propietario del grupo puede asignar tareas', 403)
        }

        const user = await User.findById(userId)

        if (!group.members.includes(user._id)) {
            throw new appError('El usuario no pertenece al grupo', 403)
        }

        if(user.tasksToDo.includes(task._id)) {
            throw new appError('El usuario ya tiene esta tarea asignada', 403)
        }

        task.asignedTo.push(user._id)
        user.tasksToDo.push(task._id)
        await user.save()
        await task.save()
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

        const ownerId = group.owner._id ? group.owner._id.toString() : group.owner.toString();
        if (ownerId !== currentUserId) {
            throw new appError('Solo el propietario del grupo puede desasignar tareas', 403)
        }

        const user = await User.findById(userId)

        if (!group.members.includes(user._id)) {
            throw new appError('El usuario no pertenece al grupo', 403)
        }

        if(!user.tasksToDo.includes(task._id)) {
            throw new appError('El usuario no tiene esta tarea asignada', 403)
        }

        task.asignedTo.pull(user._id)
        user.tasksToDo.pull(task._id)
        await user.save()
        await task.save()
        res.status(200).json(task)
        
    } catch (e) {
        next(e)
    }
}

exports.createChecklist = async (req, res, next) => {
    const { taskId } = req.params
    const { title } = req.body
    try {
        const task = await Task.findById(taskId)
        if (!task) {
            throw new appError('Tarea no encontrada', 404)
        }
        
        const newChecklist = { title, elements: [] }
        task.checklist.push(newChecklist)
        await task.save()
        res.status(201).json(newChecklist)
    } catch (e) {
        next(e)
    }
}

exports.addChecklistElement = async (req, res, next) => {
    const { taskId, checklistId } = req.params
    const { title } = req.body
    try {
        const task = await Task.findById(taskId)
        if (!task) {
            throw new appError('Tarea no encontrada', 404)
        }
        
        const checklist = task.checklist.id(checklistId)
        if (!checklist) {
            throw new appError('Checklist no encontrada', 404)
        }
        
        const newElement = { title, completed: false }
        checklist.elements.push(newElement)
        await task.save()
        res.status(201).json(newElement)
    } catch (e) {
        next(e)
    }
}

exports.updateChecklistElement = async (req, res, next) => {
    const { taskId, checklistId, elementId } = req.params
    const { title, completed } = req.body
    try {
        const task = await Task.findById(taskId)
        if (!task) {
            throw new appError('Tarea no encontrada', 404)
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
        res.status(200).json(element)
    } catch (e) {
        next(e)
    }
}

exports.addTag = async (req, res, next) => {
    const { taskId } = req.params
    const { name, color } = req.body
    try {
        const task = await Task.findById(taskId)
        if (!task) {
            throw new appError('Tarea no encontrada', 404)
        }
        
        const newTag = { name, color }
        task.tags.push(newTag)
        await task.save()
        res.status(201).json(newTag)
    } catch (e) {
        next(e)
    }
}

exports.updateTag = async (req, res, next) => {
    const { taskId, tagId } = req.params
    const { name, color } = req.body
    try {
        const task = await Task.findById(taskId)
        if (!task) {
            throw new appError('Tarea no encontrada', 404)
        }
        
        const tag = task.tags.id(tagId)
        if (!tag) {
            throw new appError('Etiqueta no encontrada', 404)
        }
        
        tag.name = name
        tag.color = color
        await task.save()
        res.status(200).json(tag)
    } catch (e) {
        next(e)
    }
}

exports.deleteChecklistElement = async (req, res, next) => {
    const { taskId, checklistId, elementId } = req.params
    try {
        const task = await Task.findById(taskId)
        if (!task) {
            throw new appError('Tarea no encontrada', 404)
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
        res.status(200).json(element)
    } catch (e) {
        next(e)
    }
}

exports.deleteChecklist = async (req, res, next) => {
    const { taskId, checklistId } = req.params
    try {
        const task = await Task.findById(taskId)
        if (!task) {
            throw new appError('Tarea no encontrada', 404)
        }
        
        const checklist = task.checklist.id(checklistId)
        if (!checklist) {
            throw new appError('Checklist no encontrada', 404)
        }
        
        task.checklist.pull(checklistId)
        await task.save()
        res.status(200).json(checklist)
    } catch (e) {
        next(e)
    }
}

exports.deleteTag = async (req, res, next) => {
    const { taskId, tagId } = req.params
    try {
        const task = await Task.findById(taskId)
        if (!task) {
            throw new appError('Tarea no encontrada', 404)
        }
        
        const tag = task.tags.id(tagId)
        if (!tag) {
            throw new appError('Etiqueta no encontrada', 404)
        }
        
        task.tags.pull(tagId)
        await task.save()
        res.status(200).json(tag)
    } catch (e) {
        next(e)
    }
}

// Desasignar tarea a un usuario (solo propietario del grupo)
exports.removeTaskAssignee = async (req, res, next) => {
    const { taskId } = req.params
    const { userId, groupId } = req.body
    const currentUserId = req.user.id
    try {
        const task = await Task.findById(taskId)
        if (!task) {
            throw new appError('Tarea no encontrada', 404)
        }

        const Group = require('../models/group')
        const group = await Group.findById(groupId)
        if (!group) {
            throw new appError('Grupo no encontrado', 404)
        }

        const ownerId = group.owner._id ? group.owner._id.toString() : group.owner.toString();
        if (ownerId !== currentUserId) {
            throw new appError('Solo el propietario del grupo puede desasignar tareas', 403)
        }

        const user = await User.findById(userId)
        if (!user) {
            throw new appError('Usuario no encontrado', 404)
        }

        if (!group.members.includes(user._id)) {
            throw new appError('El usuario no pertenece al grupo', 403)
        }

        if(!user.tasksToDo.includes(task._id)) {
            throw new appError('El usuario no tiene esta tarea asignada', 403)
        }

        task.asignedTo.pull(user._id)
        user.tasksToDo.pull(task._id)
        await Promise.all([user.save(), task.save()])
        res.status(200).json(task)
        
    } catch (e) {
        next(e)
    }
}

exports.deleteTask = async (req, res, next) => {
    const { taskId } = req.params
    try {
        const task = await Task.findByIdAndDelete(taskId)
        if (!task) {
            throw new appError('Tarea no encontrada', 404)
        }
        res.status(200).json(task)
    } catch (e) {
        next(e)
    }
}