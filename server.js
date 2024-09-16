const express = require('express'); // Import Express framework
const mongoose = require('mongoose'); // Import Mongoose for MongoDB interactions
const cors = require('cors'); // Import CORS middleware for handling cross-origin requests
const bcrypt = require('bcrypt'); // Import bcrypt for hashing passwords
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for generating and verifying JWTs
const path = require('path'); // Import path module for file path manipulations
const app = express(); // Create an Express application

app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cors()); // Middleware to enable CORS for cross-origin requests

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB using Mongoose
mongoose.connect('mongodb://localhost:27017/task-manager', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
});

// Define User schema and model
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }, // Unique and required username field
    password: { type: String, required: true } // Required password field
});

const User = mongoose.model('User', userSchema); // Create User model from schema

// Define Task schema and model
const taskSchema = new mongoose.Schema({
    name: String, // Task name
    date: String, // Task date, typically in ISO format
    time: String // Task time
});

const Task = mongoose.model('Task', taskSchema); // Create Task model from schema

// POST endpoint for user registration
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        // Hash the user's password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save(); // Save new user to the database
        res.status(201).json({ message: 'User registered' }); // Respond with success message
    } catch (error) {
        console.error('Error registering user:', error); // Log error
        res.status(500).json({ message: 'Error registering user' }); // Respond with error message
    }
});

// POST endpoint for user login
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username }); // Find user by username
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ message: 'Invalid credentials' }); // Check credentials
        }
        // Generate JWT token for the user
        const token = jwt.sign({ userId: user._id }, 'your_jwt_secret_key', { expiresIn: '1h' });
        res.status(200).json({ token }); // Respond with token
    } catch (error) {
        console.error('Error logging in:', error); // Log error
        res.status(500).json({ message: 'Error logging in' }); // Respond with error message
    }
});

// Middleware to check authentication using JWT
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers['authorization']; // Get authorization header
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from header
    if (token == null) return res.sendStatus(401); // If no token, return unauthorized

    // Verify the token
    jwt.verify(token, 'your_jwt_secret_key', (err, user) => {
        if (err) return res.sendStatus(403); // If verification fails, return forbidden
        req.user = user; // Attach user information to request object
        next(); // Proceed to the next middleware/route handler
    });
};

// POST endpoint to add a new task
app.post('/tasks', authenticateJWT, async (req, res) => {
    try {
        const task = new Task(req.body); // Create a new task from request body
        await task.save(); // Save new task to the database
        res.status(201).json(task); // Respond with the created task
    } catch (error) {
        console.error('Error saving task:', error); // Log error
        res.status(500).json({ message: 'Error saving task' }); // Respond with error message
    }
});

// GET endpoint to retrieve all tasks
app.get('/tasks', authenticateJWT, async (req, res) => {
    try {
        const tasks = await Task.find(); // Find all tasks in the database
        res.status(200).json(tasks); // Respond with list of tasks
    } catch (error) {
        console.error('Error retrieving tasks:', error); // Log error
        res.status(500).json({ message: 'Error retrieving tasks' }); // Respond with error message
    }
});

// DELETE endpoint to remove a task by ID
app.delete('/tasks/:id', authenticateJWT, async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id); // Find and delete task by ID
        res.status(200).json({ message: 'Task deleted' }); // Respond with success message
    } catch (error) {
        console.error('Error deleting task:', error); // Log error
        res.status(500).json({ message: 'Error deleting task' }); // Respond with error message
    }
});

// Start the server on port 3000
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000'); // Log server start
});
