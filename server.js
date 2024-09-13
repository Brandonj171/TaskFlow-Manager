const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// Route for the home page
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Route for about page
app.get('/about', (req, res) => {
  res.send('This is the About Page');
});

// Route for handling POST requests
app.post('/data', (req, res) => {
  const receivedData = req.body;
  res.send(`Data received: ${JSON.stringify(receivedData)}`);
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

