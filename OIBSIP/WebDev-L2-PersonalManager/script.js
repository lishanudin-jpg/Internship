// =========================================
// GET HTML ELEMENTS
// =========================================

const taskForm = document.getElementById("taskForm");

const taskInput = document.getElementById("taskInput");

const inputError = document.getElementById("inputError");

const pendingTasksContainer =
    document.getElementById("pendingTasks");

const completedTasksContainer =
    document.getElementById("completedTasks");

const pendingCount =
    document.getElementById("pendingCount");

const completedCount =
    document.getElementById("completedCount");

const totalPending =
    document.getElementById("totalPending");

const totalCompleted =
    document.getElementById("totalCompleted");

const totalTasks =
    document.getElementById("totalTasks");

const dateDisplay =
    document.getElementById("dateDisplay");


// =========================================
// APPLICATION DATA
// =========================================

let tasks = [];


// =========================================
// LOAD SAVED TASKS
// =========================================

loadTasks();


// =========================================
// DISPLAY CURRENT DATE
// =========================================

displayCurrentDate();


// =========================================
// INITIAL RENDER
// =========================================

renderTasks();


// =========================================
// ADD TASK FORM
// =========================================

taskForm.addEventListener("submit", function (event) {

    event.preventDefault();

    addTask();

});


// =========================================
// ADD TASK
// =========================================

function addTask() {

    const taskText =
        taskInput.value.trim();


    // Validate empty task
    if (taskText === "") {

        inputError.textContent =
            "Please enter a task before adding it.";

        taskInput.focus();

        return;
    }


    // Clear error
    inputError.textContent = "";


    // Create task object
    const newTask = {

        id: Date.now(),

        text: taskText,

        completed: false,

        createdAt: new Date().toISOString(),

        completedAt: null

    };


    // Add task
    tasks.push(newTask);


    // Save
    saveTasks();


    // Refresh UI
    renderTasks();


    // Clear input
    taskInput.value = "";

    taskInput.focus();

}


// =========================================
// RENDER TASKS
// =========================================

function renderTasks() {

    // Clear existing lists
    pendingTasksContainer.innerHTML = "";

    completedTasksContainer.innerHTML = "";


    // Separate tasks
    const pendingTasks =
        tasks.filter(task => !task.completed);

    const completedTasks =
        tasks.filter(task => task.completed);


    // Render pending tasks
    if (pendingTasks.length === 0) {

        pendingTasksContainer.innerHTML =
            createEmptyState(
                "No pending tasks",
                "You're all caught up!"
            );

    }

    else {

        pendingTasks.forEach(task => {

            pendingTasksContainer.appendChild(
                createTaskElement(task)
            );

        });

    }


    // Render completed tasks
    if (completedTasks.length === 0) {

        completedTasksContainer.innerHTML =
            createEmptyState(
                "No completed tasks",
                "Complete a task and it will appear here."
            );

    }

    else {

        completedTasks.forEach(task => {

            completedTasksContainer.appendChild(
                createTaskElement(task)
            );

        });

    }


    // Update counters
    updateCounters();
}


// =========================================
// CREATE TASK ELEMENT
// =========================================

function createTaskElement(task) {

    const taskItem =
        document.createElement("div");


    taskItem.className =
        "task-item";


    if (task.completed) {

        taskItem.classList.add(
            "completed-item"
        );

    }


    // =====================================
    // COMPLETE BUTTON
    // =====================================

    const completeButton =
        document.createElement("button");

    completeButton.className =
        "complete-button";

    completeButton.type =
        "button";

    completeButton.title =
        task.completed
            ? "Mark as pending"
            : "Mark complete";

    completeButton.textContent =
        task.completed ? "✓" : "";


    completeButton.addEventListener(
        "click",
        function () {

            toggleTask(task.id);

        }
    );


    // =====================================
    // TASK CONTENT
    // =====================================

    const taskContent =
        document.createElement("div");

    taskContent.className =
        "task-content";


    const taskText =
        document.createElement("div");

    taskText.className =
        "task-text";

    taskText.textContent =
        task.text;


    const taskTime =
        document.createElement("span");

    taskTime.className =
        "task-time";


    if (task.completed && task.completedAt) {

        taskTime.textContent =
            `Completed ${formatDate(task.completedAt)}`;

    }

    else {

        taskTime.textContent =
            `Added ${formatDate(task.createdAt)}`;

    }


    taskContent.appendChild(taskText);

    taskContent.appendChild(taskTime);


    // =====================================
    // ACTIONS
    // =====================================

    const actions =
        document.createElement("div");

    actions.className =
        "task-actions";


    // Edit button
    const editButton =
        document.createElement("button");

    editButton.className =
        "action-button edit-button";

    editButton.type =
        "button";

    editButton.textContent =
        "Edit";


    editButton.addEventListener(
        "click",
        function () {

            editTask(
                task.id,
                taskText,
                taskTime,
                editButton
            );

        }
    );


    // Delete button
    const deleteButton =
        document.createElement("button");

    deleteButton.className =
        "action-button delete-button";

    deleteButton.type =
        "button";

    deleteButton.textContent =
        "Delete";


    deleteButton.addEventListener(
        "click",
        function () {

            deleteTask(task.id);

        }
    );


    actions.appendChild(editButton);

    actions.appendChild(deleteButton);


    // =====================================
    // ADD ELEMENTS TO TASK
    // =====================================

    taskItem.appendChild(
        completeButton
    );

    taskItem.appendChild(
        taskContent
    );

    taskItem.appendChild(
        actions
    );


    return taskItem;
}


// =========================================
// MARK TASK COMPLETE / PENDING
// =========================================

function toggleTask(taskId) {

    const task =
        tasks.find(
            item => item.id === taskId
        );


    if (!task) {

        return;
    }


    task.completed =
        !task.completed;


    if (task.completed) {

        task.completedAt =
            new Date().toISOString();

    }

    else {

        task.completedAt = null;

    }


    saveTasks();

    renderTasks();
}


// =========================================
// EDIT TASK
// =========================================

function editTask(
    taskId,
    taskTextElement,
    taskTimeElement,
    editButton
) {

    const task =
        tasks.find(
            item => item.id === taskId
        );


    if (!task) {

        return;
    }


    // Already editing
    if (
        editButton.dataset.editing === "true"
    ) {

        return;
    }


    editButton.dataset.editing =
        "true";

    editButton.textContent =
        "Save";


    // Create input
    const editInput =
        document.createElement("input");

    editInput.type =
        "text";

    editInput.className =
        "edit-input";

    editInput.value =
        task.text;

    editInput.maxLength =
        150;


    // Replace text with input
    taskTextElement.replaceWith(
        editInput
    );


    editInput.focus();

    editInput.select();


    // Save function
    function saveEdit() {

        const newText =
            editInput.value.trim();


        if (newText === "") {

            alert("Task cannot be empty.");

            editInput.focus();

            return;
        }


        task.text =
            newText;


        saveTasks();

        renderTasks();
    }


    // Save on button click
    editButton.onclick =
        saveEdit;


    // Save using Enter
    editInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                saveEdit();

            }


            if (event.key === "Escape") {

                renderTasks();

            }

        }
    );

}


// =========================================
// DELETE TASK
// =========================================

function deleteTask(taskId) {

    const task =
        tasks.find(
            item => item.id === taskId
        );


    if (!task) {

        return;
    }


    const confirmed =
        confirm(
            `Delete "${task.text}"?`
        );


    if (!confirmed) {

        return;
    }


    tasks =
        tasks.filter(
            item => item.id !== taskId
        );


    saveTasks();

    renderTasks();
}


// =========================================
// UPDATE COUNTERS
// =========================================

function updateCounters() {

    const pending =
        tasks.filter(
            task => !task.completed
        ).length;


    const completed =
        tasks.filter(
            task => task.completed
        ).length;


    const total =
        tasks.length;


    pendingCount.textContent =
        `${pending} pending`;


    completedCount.textContent =
        `${completed} completed`;


    totalPending.textContent =
        pending;


    totalCompleted.textContent =
        completed;


    totalTasks.textContent =
        total;
}


// =========================================
// EMPTY STATE
// =========================================

function createEmptyState(
    title,
    message
) {

    const empty =
        document.createElement("div");

    empty.className =
        "empty-state";


    empty.innerHTML = `
        <div class="empty-icon">✓</div>

        <h3>${title}</h3>

        <p>${message}</p>
    `;


    return empty;
}


// =========================================
// SAVE TASKS TO LOCAL STORAGE
// =========================================

function saveTasks() {

    localStorage.setItem(
        "taskFlowTasks",
        JSON.stringify(tasks)
    );
}


// =========================================
// LOAD TASKS FROM LOCAL STORAGE
// =========================================

function loadTasks() {

    const savedTasks =
        localStorage.getItem(
            "taskFlowTasks"
        );


    if (!savedTasks) {

        tasks = [];

        return;
    }


    try {

        const parsedTasks =
            JSON.parse(savedTasks);


        if (Array.isArray(parsedTasks)) {

            tasks = parsedTasks;

        }

        else {

            tasks = [];

        }

    }

    catch (error) {

        console.error(
            "Could not load tasks:",
            error
        );

        tasks = [];
    }
}


// =========================================
// FORMAT DATE AND TIME
// =========================================

function formatDate(dateString) {

    const date =
        new Date(dateString);


    return date.toLocaleString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}


// =========================================
// CURRENT DATE
// =========================================

function displayCurrentDate() {

    const today =
        new Date();


    dateDisplay.textContent =
        today.toLocaleDateString(
            "en-IN",
            {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );
}