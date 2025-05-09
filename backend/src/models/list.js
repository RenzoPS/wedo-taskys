const mongoose = require('mongoose')

const listSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    tasksIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
}, { timestamps: true })

const List = mongoose.model('List', listSchema)
module.exports = List