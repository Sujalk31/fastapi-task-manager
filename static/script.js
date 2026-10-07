// Load tasks when page opens
loadTasks();


// GET /tasks
async function loadTasks() {
    const response = await fetch("/tasks");
    const tasks = await response.json();

    displayTasks(tasks);
}


// Display tasks
function displayTasks(tasks) {
    const taskList = document.getElementById("taskList");

    taskList.innerHTML = "";

    tasks.forEach(task => {
        const taskDiv = document.createElement("div");

        taskDiv.className = "task";

        taskDiv.innerHTML = `
            <div>
                <input
                    type="checkbox"
                    ${task.completed ? "checked" : ""}
                    onchange="toggleTask(${task.id})"
                >

                <span class="${task.completed ? "completed" : ""}">
                    ${task.title}
                </span>
            </div>

            <div>
                <button onclick="updateTask(${task.id})">
                    Update
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteTask(${task.id})">
                    Delete
                </button>
            </div>
        `;

        taskList.appendChild(taskDiv);
    });
}


// POST /tasks
async function addTask() {
    const input = document.getElementById("taskInput");

    const title = input.value.trim();

    if (title === "") {
        alert("Please enter a task");
        return;
    }

    await fetch("/tasks", {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            title: title
        })
    });

    input.value = "";

    loadTasks();
}


// PUT /tasks/{id}
// Update task title
async function updateTask(id) {

    // Get existing task
    const response = await fetch(`/tasks/${id}`);

    const task = await response.json();

    // Ask user for new title
    const newTitle = prompt(
        "Enter new task title:",
        task.title
    );

    // User pressed Cancel
    if (newTitle === null) {
        return;
    }

    // Empty title
    if (newTitle.trim() === "") {
        alert("Task title cannot be empty");
        return;
    }

    // Send PUT request
    await fetch(`/tasks/${id}`, {
        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            title: newTitle.trim(),
            completed: task.completed
        })
    });

    // Refresh tasks
    loadTasks();
}


// PUT /tasks/{id}
// Mark task completed/uncompleted
async function toggleTask(id) {

    const response = await fetch(`/tasks/${id}`);

    const task = await response.json();

    await fetch(`/tasks/${id}`, {
        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            title: task.title,
            completed: !task.completed
        })
    });

    loadTasks();
}


// DELETE /tasks/{id}
async function deleteTask(id) {

    await fetch(`/tasks/${id}`, {
        method: "DELETE"
    });

    loadTasks();
}