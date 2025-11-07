const { z } = require('zod')

exports.taskSchema = z.object({
    title: z.string({
        required_error: 'The title is required'
    }),
    description: z.string().optional(),
    listId: z.string().optional()
})


exports.removeTaskAssigneeSchema = z.object({
    userId: z.string({
        required_error: 'The userId is required'
    }),
    groupId: z.string({
        required_error: 'The groupId is required'
    })
})

exports.taskUpdateSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    completed: z.boolean().optional()
})

exports.checklistSchema = z.object({
    title: z.string({
        required_error: 'The title is required'
    })
})

exports.checklistElementSchema = z.object({
    title: z.string({
        required_error: 'The title is required'
    })
})

exports.checklistElementUpdateSchema = z.object({
    title: z.string().optional(),
    completed: z.boolean().optional()
})

exports.tagSchema = z.object({
    name: z.string({
        required_error: 'The name is required'
    }),
    color: z.string({
        required_error: 'The color is required'
    })
})

exports.assignTaskSchema = z.object({
    userId: z.string({
        required_error: 'The userId is required'
    }),
    groupId: z.string({
        required_error: 'The groupId is required'
    })
})