const mongoose = require('mongoose')

const groupSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    lists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'List' }],
    backgroundImage: { type: String, default: null }, // URL o path de la imagen de fondo
}, { timestamps: true })

const Group = mongoose.model('Group', groupSchema)
module.exports = Group