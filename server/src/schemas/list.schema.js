const { z } = require('zod')

exports.createListSchema = z.object({
    title: z.string({
        required_error: 'The title is required'
    }),
    groupId: z.string({
        required_error: 'The group ID is required'
    })
})

exports.updateListSchema = z.object({
    title: z.string({
        required_error: 'The title is required'
    })
})