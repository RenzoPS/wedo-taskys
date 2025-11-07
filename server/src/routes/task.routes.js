const express = require('express')
const router = express.Router()

const { authRequired } = require('../middlewares/validateToken.js')
const taskController = require('../controllers/task.controller.js')
const { validateSchema } = require('../middlewares/validator.middleware')
const { 
    taskSchema, 
    taskUpdateSchema, 
    checklistSchema, 
    checklistElementSchema, 
    checklistElementUpdateSchema, 
    tagSchema,
    assignTaskSchema
} = require('../schemas/task.schema')

router.post('/', authRequired, validateSchema(taskSchema), taskController.createTask)
router.get('/:listId', authRequired, taskController.getTasks)
router.put('/:taskId', authRequired, validateSchema(taskUpdateSchema), taskController.updateTask)
router.put('/:taskId/assign', authRequired, validateSchema(assignTaskSchema), taskController.assignTask)
router.delete('/:taskId/assign', authRequired, validateSchema(assignTaskSchema), taskController.removeTaskAssignee)
router.post('/:taskId/checklist', authRequired, validateSchema(checklistSchema), taskController.createChecklist)
router.post('/:taskId/checklist/:checklistId/element', authRequired, validateSchema(checklistElementSchema), taskController.addChecklistElement)
router.put('/:taskId/checklist/:checklistId/element/:elementId', authRequired, validateSchema(checklistElementUpdateSchema), taskController.updateChecklistElement)
router.delete('/:taskId/checklist/:checklistId/element/:elementId', authRequired, taskController.deleteChecklistElement)
router.delete('/:taskId/checklist/:checklistId', authRequired, taskController.deleteChecklist)
router.delete('/:taskId', authRequired, taskController.deleteTask)
router.post('/:taskId/tag', authRequired, validateSchema(tagSchema), taskController.addTag)
router.put('/:taskId/tag/:tagId', authRequired, validateSchema(tagSchema), taskController.updateTag)
router.delete('/:taskId/tag/:tagId', authRequired, taskController.deleteTag)

module.exports = router