const { z } = require('zod');

const sendInvitationSchema = z.object({
    body: z.object({
        userId: z.string({
            required_error: 'El ID del usuario es requerido'
        }).min(1, 'El ID del usuario no puede estar vacío')
    })
});

module.exports = {
    sendInvitationSchema
};
