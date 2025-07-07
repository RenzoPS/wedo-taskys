const { z } = require('zod')

exports.createGroupSchema = z.object({
    name: z.string().min(1, 'El nombre es requerido').max(50, 'Máximo 50 caracteres'),
    description: z.string().max(200, 'Máximo 200 caracteres').optional()
})

exports.addUserToGroupSchema = z.object({
    userId: z.string().min(1, 'El ID del usuario es requerido')
})

exports.updateGroupSchema = z.object({
    name: z.string().min(1, 'El nombre es requerido').max(50, 'Máximo 50 caracteres').optional(),
    description: z.string().max(200, 'Máximo 200 caracteres').optional()
})

// exports.addListToGroupSchema = z.object({
//     listIds: z.array(z.string()).min(1, 'Debe proporcionar al menos una lista')
// })