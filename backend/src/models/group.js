const mongoose = require('mongoose')

const groupSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    memembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    lists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'List' }],
}, { timestamps: true })

const Group = mongoose.model('Group', groupSchema)
module.exports = Group