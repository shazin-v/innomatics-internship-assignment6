const todoInput = document.getElementById("todo-input");
const dueDateInput = document.getElementById("due-date");
const taskPriorityInput = document.getElementById("task-priority");
const addTodoBtn = document.getElementById("add-todo-btn");
const filterAllBtn = document.getElementById("filter-all");
const filterCompletedBtn = document.getElementById("filter-completed");
const filterPendingBtn = document.getElementById("filter-pending");
const todoList = document.getElementById("todo-list");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

function renderTodos(filter = "all") {
  todoList.innerHTML = "";
  todos.forEach((todo, index) => {
    const todoItem = document.createElement("li");
    todoItem.classList.add("todo-item", "list-group-item");
    todoItem.textContent = `${todo.task} - Due: ${todo.dueDate} - Priority: ${todo.priority}`;

    if (todo.completed) {
      todoItem.classList.add("completed-task");
    }

    const deleteBtn = document.createElement("span");
    deleteBtn.textContent = " (Delete)";
    deleteBtn.style.color = "red";
    deleteBtn.style.cursor = "pointer";
    todoItem.appendChild(deleteBtn);
    deleteBtn.addEventListener("click", () => {
      todos = todos.filter((t, i) => i !== index);
      localStorage.setItem("todos", JSON.stringify(todos));
      renderTodos(filter);
    });

    const editBtn = document.createElement("span");
    editBtn.textContent = " (Edit)";
    editBtn.style.color = "blue";
    editBtn.style.cursor = "pointer";
    todoItem.appendChild(editBtn);
    editBtn.addEventListener("click", () => {
      editTodo(todo, index);
    });

    const completeBtn = document.createElement("span");
    completeBtn.textContent = " (Complete)";
    completeBtn.style.color = "green";
    completeBtn.style.cursor = "pointer";
    todoItem.appendChild(completeBtn);
    completeBtn.addEventListener("click", () => {
      todo.completed = !todo.completed;
      localStorage.setItem("todos", JSON.stringify(todos));
      renderTodos(filter);
    });

    if (
      filter === "all" ||
      (filter === "completed" && todo.completed) ||
      (filter === "pending" && !todo.completed)
    ) {
      todoList.appendChild(todoItem);
    }
  });
}

function editTodo(todo, index) {
  const todoItem = todoList.children[index];
  todoItem.innerHTML = "";

  const taskInput = document.createElement("input");
  taskInput.type = "text";
  taskInput.value = todo.task;
  todoItem.appendChild(taskInput);

  const dateInput = document.createElement("input");
  dateInput.type = "date";
  dateInput.value = todo.dueDate;
  todoItem.appendChild(dateInput);

  const prioritySelect = document.createElement("select");
  ["low", "medium", "high"].forEach((priorityLevel) => {
    const option = document.createElement("option");
    option.value = priorityLevel;
    option.textContent =
      priorityLevel.charAt(0).toUpperCase() + priorityLevel.slice(1);
    if (priorityLevel === todo.priority) {
      option.selected = true;
    }
    prioritySelect.appendChild(option);
  });
  todoItem.appendChild(prioritySelect);

  const saveBtn = document.createElement("span");
  saveBtn.textContent = " (Save)";
  saveBtn.style.color = "green";
  saveBtn.style.cursor = "pointer";
  todoItem.appendChild(saveBtn);
  saveBtn.addEventListener("click", () => {
    todo.task = taskInput.value.trim();
    todo.dueDate = dateInput.value;
    todo.priority = prioritySelect.value;
    localStorage.setItem("todos", JSON.stringify(todos));
    renderTodos();
  });

  const cancelBtn = document.createElement("span");
  cancelBtn.textContent = " (Cancel)";
  cancelBtn.style.color = "red";
  cancelBtn.style.cursor = "pointer";
  todoItem.appendChild(cancelBtn);
  cancelBtn.addEventListener("click", () => {
    renderTodos();
  });
}

addTodoBtn.addEventListener("click", () => {
  const task = todoInput.value.trim();
  const dueDate = dueDateInput.value;
  const priority = taskPriorityInput.value;
  if (task !== "") {
    const todo = { task, dueDate, priority, completed: false };
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
    todoInput.value = "";
    dueDateInput.value = "";
    taskPriorityInput.value = "low";
    renderTodos();
  }
});

filterAllBtn.addEventListener("click", () => renderTodos("all"));
filterCompletedBtn.addEventListener("click", () => renderTodos("completed"));
filterPendingBtn.addEventListener("click", () => renderTodos("pending"));

renderTodos();
