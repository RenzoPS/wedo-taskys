const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true},
    completed: { type: Boolean, default: false },
    usersIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    checklist: [{
        title: { type: String, default: 'Checklist', trim: true },
        elements: [{ 
            title: { type: String, required: true, trim: true },
            completed: { type: Boolean, default: false }
        }]
    }]
    }, { timestamps: true })

const Task = mongoose.model('Task', taskSchema)
module.exports = Task