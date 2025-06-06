const Group = require('../models/group.js');
const AppError = require('../utils/appError');

exports.createGroup = async (req, res, next) => {
    const { name, description } = req.body;
    try {
        const groupExists = await Group.findOne({name})
        if (groupExists) {
            throw new AppError('Group already exists', 400); // Si la tarea ya existe, lanza un error
        }
        const newGroup = new Group({ name, description })
        await newGroup.save()
        res.status(201).json({
            id: newGroup._id,
            name: newGroup.name,
            description: newGroup.description,
            createdAt: newGroup.createdAt,
            updatedAt: newGroup.updatedAt
        })
    } catch (e) {
        next(e);
    }
}

exports.getAllGroups = async (req, res, next) => {
    try {
        const groups = await Group.find();
        res.status(200).json(groups);
    } catch (e) {
        next(e);
    }
}

exports.addUserToGroup = async (req, res, next) => {
    const { groupId } = req.params
    const { userId } = req.body
    try {
        const group = await Group.findById(groupId);
        if (!group) {
            throw new AppError('Group not found', 404);
        }
        if (group.users.includes(userId)) {
            throw new AppError('User already in group', 400);
        }
        group.users.push(userId);
        await group.save();
        res.status(200).json({
            message: 'User added to group successfully',
            groupId: group._id,
            userId: userId
        });     
    } catch (e) {
        next(e);
    }
}

exports.addListToGroup = async (req, res, next) => {
    const { groupId } = req.params;
    const { listIds } = req.body;
    try {
        const group = await Group.findById(groupId);
        if (!group) {
            throw new AppError('Group not found', 404);
        }
        if (group.lists.includes(listIds)) {
            throw new AppError('List already in group', 400);
        }
        group.lists.push(...listIds);
        await group.save();
        res.status(200).json({
            message: 'Lists added to group successfully',
            groupId: group._id,
            listIds: listIds
        });
    } catch (e) {
        next(e);
    }
}

exports.deleteGroup = async (req, res, next) => {
    const { groupId } = req.params;
    try {
        const group = await Group.findByIdAndDelete(groupId);
        if (!group) {
            throw new AppError('Group not found', 404);
        }
        res.status(200).json({
            message: 'Group deleted successfully',
            groupId: group._id
        });
    }
    catch (e) {
        next(e);
    }
}