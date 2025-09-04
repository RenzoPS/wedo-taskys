const { z } = require('zod')

exports.createListSchema = z.object({
    title: z.string({
        required_error: 'The title is required'
    })
})

exports.updateListSchema = z.object({
    title: z.string({
        required_error: 'The title is required'
    })
})