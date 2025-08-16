const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true, trim: true },  // Trim: elimina los espacios en blanco al principio y al final
    email: { type: String, required: true, unique: true, trim: true},  
    password: { type: String, required: true, trim: true },
    role: { type: String, default: 'user' },
    tasksToDo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }]  //A REVISAR BIEN
}, { timestamps: true })

const User = mongoose.model('User', userSchema)
module.exports = User