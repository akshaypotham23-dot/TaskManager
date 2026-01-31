const API_URL = "http://127.0.0.1:5000/tasks";

let editTaskId = null;

const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const titleInput = document.getElementById("title");
const descInput = document.getElementById("description");
const statusInput = document.getElementById("status");

function loadTasks(filter = "All") {
  fetch(API_URL)
    .then(res => res.json())
    .then(tasks => {
      taskList.innerHTML = "";

      tasks
        .filter(task => filter === "All" || task.status === filter)
        .forEach(task => {
          const li = document.createElement("li");

          li.innerHTML = `
            <div>
              <strong>${task.title}</strong>
              <span class="badge ${task.status.toLowerCase()}">${task.status}</span>
              <br>
              <small>${task.description}</small>
            </div>
            <div class="actions">
              <button class="edit">Edit</button>
              <button class="delete">Delete</button>
            </div>
          `;

          li.querySelector(".edit").addEventListener("click", () => {
            startEdit(task);
          });

          li.querySelector(".delete").addEventListener("click", () => {
            deleteTask(task.id);
          });

          taskList.appendChild(li);
        });
    });
}

taskForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const data = {
    title: titleInput.value.trim(),
    description: descInput.value.trim(),
    status: statusInput.value
  };

  if (editTaskId) {
    fetch(`${API_URL}/${editTaskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(() => {
      editTaskId = null;
      taskForm.querySelector("button").textContent = "Add Task";
      loadTasks();
      taskForm.reset();
    });
  } else {
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(() => {
      loadTasks();
      taskForm.reset();
    });
  }
});

function startEdit(task) {
  editTaskId = task.id;
  titleInput.value = task.title;
  descInput.value = task.description;
  statusInput.value = task.status;
  taskForm.querySelector("button").textContent = "Update Task";
}

function deleteTask(id) {
  fetch(`${API_URL}/${id}`, { method: "DELETE" })
    .then(() => loadTasks());
}

function filterTasks(value) {
  loadTasks(value);
}

loadTasks();
