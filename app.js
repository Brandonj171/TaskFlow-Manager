// Wait for the DOM content to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', () => {

    // Add an event listener to the form's submit event
    document.getElementById('task-form').addEventListener('submit', async (e) => {
        // Prevent the default form submission behavior
        e.preventDefault();

        // Retrieve the values from the input fields
        const taskName = document.getElementById('task-name').value;
        const taskDate = document.getElementById('task-date').value;

        // Check if both input fields are filled
        if (!taskName || !taskDate) {
            // Alert the user to fill in all fields if any are missing
            alert('Please fill in all fields');
            return;
        }

        // Try to send the task data to the server
        try {
            const response = await fetch('/tasks', {
                method: 'POST', // Use POST method to send data
                headers: {
                    'Content-Type': 'application/json', // Specify the content type as JSON
                },
                body: JSON.stringify({ name: taskName, date: taskDate }), // Convert task data to JSON format
            });

            // Check if the server responded with a success status
            if (response.ok) {
                // Notify the user that the task was added successfully
                alert('Task added successfully!');
                // Reload the tasks to reflect the new task
                loadTasks();
            } else {
                // Notify the user if there was a failure to add the task
                alert('Failed to add task');
            }
        } catch (error) {
            // Log the error and notify the user if an exception occurs
            console.error('Error:', error);
            alert('Error adding task');
        }
    });
});
