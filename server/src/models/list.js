const mongoose = require('mongoose')

const listSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    tasksIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true }
}, { timestamps: true })

const List = mongoose.model('List', listSchema)
module.exports = List