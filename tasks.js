const express = require('express');
const router = express.Router();
const Task = require('../models/Task'); // Adjust the path as necessary

// POST route for adding tasks
router.post('/', async (req, res) => {
    try {
        const { name, date, time } = req.body;
        if (!name || !date || !time) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const newTask = new Task({ name, date, time });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error adding task" });
    }
});

// DELETE route for removing tasks
router.delete('/:id', async (req, res) => {
    try {
        const taskId = req.params.id;
        await Task.findByIdAndDelete(taskId);
        res.status(204).end(); // No content
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error deleting task" });
    }
});

// GET route for fetching tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching tasks" });
    }
});

module.exports = router;
