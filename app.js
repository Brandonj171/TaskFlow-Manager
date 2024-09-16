document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('task-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const taskName = document.getElementById('task-name').value;
        const taskDate = document.getElementById('task-date').value;

        if (!taskName || !taskDate) {
            alert('Please fill in all fields');
            return;
        }

        // Add task to server
        try {
            const response = await fetch('/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: taskName, date: taskDate }),
            });

            if (response.ok) {
                alert('Task added successfully!');
                loadTasks();
            } else {
                alert('Failed to add task');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error adding task');
        }
    });

    // Load tasks and display in the calendar
    async function loadTasks() {
        try {
            const response = await fetch('/tasks');
            const tasks = await response.json();

            const taskList = document.getElementById('task-list');
            taskList.innerHTML = ''; // Clear previous tasks

            tasks.forEach(task => {
                const listItem = document.createElement('li');
                listItem.textContent 
