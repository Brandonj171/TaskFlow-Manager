const express = require('express');
const router = express.Router();
const Task = require('../models/Task'); // Import the Task model from the specified path

// POST route for adding tasks
router.post('/', async (req, res) => {
    try {
        const { name, date, time } = req.body; // Extract task details from the request body
        // Check if all required fields are provided
        if (!name || !date || !time) {
            return res.status(400).json({ message: "Missing required fields" }); // Respond with 400 Bad Request if any field is missing
        }

        // Create a new Task instance and save it to the database
        const newTask = new Task({ name, date, time });
        await newTask.save();
        res.status(201).json(newTask); // Respond with 201 Created and the newly added task
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ message: "Error adding task" }); // Respond with 500 Internal Server Error if something goes wrong
    }
});

// DELETE route for removing tasks
router.delete('/:id', async (req, res) => {
    try {
        const taskId = req.params.id; // Extract the task ID from the request parameters
        await Task.findByIdAndDelete(taskId); // Find and delete the task by its ID
        res.status(204).end(); // Respond with 204 No Content to indicate successful deletion
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ message: "Error deleting task" }); // Respond with 500 Internal Server Error if something goes wrong
    }
});

// GET route for fetching tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find(); // Fetch all tasks from the database
        res.status(200).json(tasks); // Respond with 200 OK and the list of tasks
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ message: "Error fetching tasks" }); // Respond with 500 Internal Server Error if something goes wrong
    }
});

module.exports = router; // Export the router to be used in other parts of the application
