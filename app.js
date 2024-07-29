document.addEventListener("DOMContentLoaded", () => {
  const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  if (storedTasks.length) {
    storedTasks.forEach((task) => tasks.push(task));
    updateTaskList();
    updateStats();
  }
});

let tasks = [];

// Save tasks to local storage
const saveTasks = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

// Add task
const addTask = () => {
  const taskInput = document.getElementById("taskInput");
  const text = taskInput.value.trim();
  if (text) {
    tasks.push({ text: text, completed: false });
    taskInput.value = "";
    updateTaskList();
    updateStats();
    saveTasks();
  } else {
    alert("Please enter a task.");
  }
};

// Toggle task completion
const toggleTaskComplete = (idx) => {
  tasks[idx].completed = !tasks[idx].completed;
  updateTaskList();
  updateStats();
  saveTasks();
};

// Delete task
const deleteTask = (idx) => {
  tasks.splice(idx, 1);
  updateTaskList();
  updateStats();
  saveTasks();
};

// Edit task
const editTask = (idx) => {
  const taskInput = document.getElementById("taskInput");
  if (!tasks[idx].completed) {
    // Prevent editing completed tasks
    taskInput.value = tasks[idx].text;
    tasks.splice(idx, 1);
    updateTaskList();
    updateStats();
    saveTasks();
  } else {
    alert("Cannot edit a completed task.");
  }
};

// Update stats
const updateStats = () => {
  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks ? (completedTasks / totalTasks) * 100 : 0;
  const progressBar = document.getElementById("progress");
  progressBar.style.width = `${progress}%`;

  document.getElementById(
    "numbers"
  ).innerText = `${completedTasks}/${totalTasks}`;

  if (totalTasks && completedTasks === totalTasks) {
    blastConfetti();
  }
};

// Update task list
const updateTaskList = () => {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = ""; // Clear existing tasks

  tasks.forEach((task, idx) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
          <div class="taskItem">
              <div class="task ${task.completed ? "completed" : ""}">
                  <input type="checkbox" class="checkbox" ${
                    task.completed ? "checked" : ""
                  }/>
                  <p>${task.text}</p>
              </div>
              <div class="icons">
                  <img src="./assets/edit.png" onclick="editTask(${idx})" alt="edit-img" />
                  <img src="./assets/bin.png" onclick="deleteTask(${idx})" alt="bin-img" />
              </div>
          </div>
      `;
    const checkbox = listItem.querySelector(".checkbox");
    checkbox.addEventListener("change", () => {
      toggleTaskComplete(idx);
    });
    taskList.appendChild(listItem);
  });
};

// Handle form submission
document.getElementById("taskForm").addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent form submission
  addTask();
});

// JS confetti
const blastConfetti = () => {
  const duration = 6 * 1000,
    animationEnd = Date.now() + duration,
    defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    // since particles fall down, start a bit higher than random
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
    );
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    );
  }, 250);
};
