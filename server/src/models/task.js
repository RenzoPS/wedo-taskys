const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true},
    completed: { type: Boolean, default: false },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    checklist: [{
        title: { type: String, default: 'Checklist', trim: true },
        elements: [{ 
            title: { type: String, required: true, trim: true },
            completed: { type: Boolean, default: false }
        }]
    }],
    list: { type: mongoose.Schema.Types.ObjectId, ref: 'List' },
    tags: [{
        name: { type: String, required: true, trim: true },
        color: { type: String, required: true, trim: true }
    }]
    }, { timestamps: true })

const Task = mongoose.model('Task', taskSchema)
module.exports = Task