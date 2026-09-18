let tasks = [];
let currentFilter = "all";

window.onload = function () {
  const saved = localStorage.getItem("myTasks");
  if (saved) {
    tasks = JSON.parse(saved);
  }
  renderTasks(currentFilter);
};

document.getElementById("addBtn").addEventListener("click", addTask);

function addTask() {
  const input = document.getElementById("taskInput");
  const dateInput = document.getElementById("dueDateInput");
  const text = input.value.trim();
  const dueDate = dateInput.value;

  if (text === "") return;

  const newTask = {
    id: Date.now(),
    text: text,
    dueDate: dueDate,
    completed: false
  };

  tasks.push(newTask);
  saveAndRender();
  input.value = "";
  dateInput.value = "";
}

function toggleTask(id) {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === id) {
      tasks[i].completed = !tasks[i].completed;
      break;
    }
  }
  saveAndRender();
}

function editTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  const newText = prompt("Edit your task description:", task.text);
  if (newText === null || newText.trim() === "") return;

  const newDate = prompt("Edit deadline (YYYY-MM-DD):", task.dueDate || "");

  task.text = newText.trim();
  task.dueDate = newDate ? newDate.trim() : "";
  saveAndRender();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveAndRender();
}

function saveAndRender() {
  localStorage.setItem("myTasks", JSON.stringify(tasks));
  renderTasks(currentFilter);
}

function renderTasks(filter) {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];

    if (filter === "pending" && task.completed) continue;
    if (filter === "completed" && !task.completed) continue;

    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    const dateDisplay = task.dueDate ? `📅 Due: ${task.dueDate}` : "No deadline set";

    li.innerHTML = `
      <div class="task-info">
        <span class="task-text" onclick="toggleTask(${task.id})">${task.text}</span>
        <span class="task-date">${dateDisplay}</span>
      </div>
      <div class="actions">
        <button class="edit-btn" onclick="editTask(${task.id})">Edit</button>
        <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
      </div>
    `;

    list.appendChild(li);
  }
}

function filterTasks(type) {
  currentFilter = type;
  const btns = document.querySelectorAll(".filter-btn");
  btns.forEach(btn => btn.classList.remove("active"));

  if (window.event && window.event.target) {
    window.event.target.classList.add("active");
  }

  renderTasks(type);
}
