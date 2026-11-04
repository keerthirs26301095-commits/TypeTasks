
import {
  addTask,
  completeTask,
  deleteTask,
  filterByStatus,
  type Task,
  type TaskStatus
} from "./model.js";

// Get HTML elements
const titleInput = document.getElementById("title") as HTMLInputElement;
const addBtn = document.getElementById("addBtn") as HTMLButtonElement;
const taskList = document.getElementById("taskList") as HTMLUListElement;

// Store tasks
let tasks: Task[] = [];

// Store the selected filter
let currentFilter: TaskStatus | "all" = "all";

// Display tasks on the page
function renderTasks(): void {
  taskList.replaceChildren();

  const visibleTasks =
    currentFilter === "all"
      ? tasks
      : filterByStatus(tasks, currentFilter);

  if (visibleTasks.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.textContent = "No tasks to display.";
    taskList.appendChild(emptyMessage);
    return;
  }

  visibleTasks.forEach((task: Task) => {
    const li = document.createElement("li");
    li.className = "task-item";

    const info = document.createElement("div");
    info.className = "task-info";

    const taskTitle = document.createElement("strong");
    taskTitle.textContent = task.title;

    const status = document.createElement("p");
    status.className = "status";
    status.textContent = "Status: " + task.status;

    info.appendChild(taskTitle);
    info.appendChild(status);

    const completeBtn = document.createElement("button");
    completeBtn.textContent =
      task.status === "done" ? "Completed" : "Complete";

    completeBtn.disabled = task.status === "done";

    completeBtn.addEventListener("click", () => {
      tasks = completeTask(tasks, task.id);
      renderTasks();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";

    deleteBtn.addEventListener("click", () => {
      tasks = deleteTask(tasks, task.id);
      renderTasks();
    });

    li.appendChild(info);
    li.appendChild(completeBtn);
    li.appendChild(deleteBtn);

    taskList.appendChild(li);
  });
}

// Add a new task
addBtn.addEventListener("click", () => {
  const title = titleInput.value.trim();

  if (title === "") {
    alert("Please enter a task.");
    return;
  }

  tasks = addTask(tasks, title);

  titleInput.value = "";
  renderTasks();
});

// Allow Enter key to add a task
titleInput.addEventListener("keydown", (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    addBtn.click();
  }
});

// Filter tasks
const filterButtons =
  document.querySelectorAll<HTMLButtonElement>("[data-filter]");

filterButtons.forEach((button: HTMLButtonElement) => {
  button.addEventListener("click", () => {
    const selectedFilter =
      button.dataset.filter as TaskStatus | "all";

    currentFilter = selectedFilter;
    renderTasks();
  });
});

// Initial display
renderTasks();
