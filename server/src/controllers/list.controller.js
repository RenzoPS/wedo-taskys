const List = require('../models/list');
const AppError = require('../utils/appError');

exports.createList = async (req, res, next) => {
    const { title } = req.body;
    
    try {
        const listExists = await List.findOne({ title });
        if (listExists) {
            throw new AppError('La lista ya existe', 400);
        }

        const list = new List({ title });
        await list.save();
        res.status(201).json(list); 

    } catch (e) {
        next(e);
    }
}

exports.getListById = async (req, res, next) => {
    const { listId } = req.params
    try {
        const list = await List.findById(listId);
        if (!list) {
            throw new AppError('La lista no existe', 404);
        }
        res.status(200).json(list);
    } catch (e) {
        next(e);
    }
}

exports.getLists = async (req, res, next) => {
    try {
        const lists = await List.find()
        res.status(200).json(lists);
    } catch (e) {
        next(e);
    }
}

exports.updateList = async (req, res, next) => {
    const { listId } = req.params
    const { title } = req.body
    try {
        const list = await List.findById(listId);
        if (!list) {
            throw new AppError('La lista no existe', 404);
        }
        await list.findByIdAndUpdate(
            listId, 
            { 
                $set: {
                    title
                }
            },
            { new: true }
        )
        res.status(200).json(list);
    } catch (e) {
        next(e);
    }
}

exports.deleteList = async (req, res, next) => {
    const { listId } = req.params
    try {
        const list = await List.findByIdAndDelete(listId);
        if (!list) {
            throw new AppError('La lista no existe', 404);
        }
        res.status(200).json({ message: 'Lista eliminada exitosamente' });
    } catch (e) {
        next(e);
    }
}