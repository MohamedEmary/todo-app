// TODO
// 1. Review the flow of the application again
// 2. Show spinner when any part of the application is loading
// 3. see if i need an async main function or not
// 4. Handle Cache

let username = localStorage.getItem("username");
let apiKey = localStorage.getItem("apiKey");
let allTodos;

async function getApiKey() {
  let response = await fetch("https://todos.routemisr.com/api/v1/getApiKey");
  response = await response.json();
  let apiKey = response.apiKey;
  localStorage.setItem("apiKey", apiKey);
}

const unsernameModal = new bootstrap.Modal(
  document.getElementById("nameInputModal")
);

const usernameInput = document.getElementById("username");
const saveBtn = document.querySelector(".save-name");

saveBtn.addEventListener("click", () => {
  username = usernameInput.value.trim();
  localStorage.setItem("username", username);
  document.querySelector("header h3").textContent = `Hey, ${username}`;
  unsernameModal.hide();
});

function getUserData() {
  let values = [null, "null", ""];

  if (values.includes(apiKey)) {
    getApiKey();
  } else {
    allTodos = getTodos();
    display();
  }

  username = localStorage.getItem("username");
  if (values.includes(username)) {
    unsernameModal.show();
  } else {
    document.querySelector("header h3").textContent = `Hey, ${username}`;
  }
}

async function addTodo(todoVal) {
  let response = await fetch(`https://todos.routemisr.com/api/v1/todos`, {
    method: "POST",
    body: JSON.stringify({
      title: todoVal,
      apiKey: apiKey,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  response = await response.json();
  return response;
}

// Modal input autofocus
const modal = document.getElementById("todoInputModal");
const todoInput = document.getElementById("todoInput");
modal.addEventListener("shown.bs.modal", () => {
  todoInput.focus();
});

// Plus icons for adding a task
document
  .querySelector(".submit-todo")
  .addEventListener("click", async function () {
    response = await addTodo(todoInput.value);
    if (todoInput.value.trim() !== "" && response.message === "success") {
      todoInput.value = "";
      document
        .querySelector('button.btn-close[data-bs-dismiss="modal"]')
        .click();
    } else {
      alert("Please Try Again");
    }
    display();
  });

// Rotate animation of the down arrow in the dropdown list
document
  .querySelector(".finished-tasks button")
  .addEventListener("click", function () {
    let icon = document.querySelector(".fa-chevron-down");
    icon.style.rotate = icon.style.rotate === "180deg" ? "0deg" : "180deg";
  });

async function getTodos() {
  let response = await fetch(
    `https://todos.routemisr.com/api/v1/todos/${apiKey}`
  );
  response = await response.json();
  return response.todos;
}

async function display() {
  let onGoing = document.querySelector(".list-group");
  let finished = document.querySelector(".finished-tasks ul");
  allTodos = await getTodos();
  onGoing.innerHTML = "";
  finished.innerHTML = "";
  for (const todo of allTodos) {
    if (!todo.completed) {
      onGoing.innerHTML += `
      <li
        class="list-group-item bg-black bg-opacity-10 d-flex justify-content-between align-items-center">
        <span>
          <i data-unique-id="${todo._id}" class="fa-regular fa-square me-2"></i> ${todo.title}
        </span>
        <span>
          <i data-unique-id="${todo._id}" class="fa-regular fa-trash-can"></i>
        </span>
      </li>`;
    } else {
      finished.innerHTML += `
      <li
        class="dropdown-item py-2 d-flex justify-content-between align-items-center px-3 rounded-1">
        <span>
          <i data-unique-id="${todo._id}" class="fa-regular fa-square-check me-2"></i>
          <span class="text-decoration-line-through">${todo.title}</span>
        </span>
        <span>
          <i data-unique-id="${todo._id}" class="fa-regular fa-trash-can"></i>
        </span>
      </li>
      `;
    }
  }
  addIconFunctionality();
  updateFinishedNum();
}

function updateFinishedNum() {
  let finishedTasksNum = document.querySelector(".finised-no");
  let counter = 0;
  for (const todo of allTodos) {
    if (todo.completed) {
      counter++;
    }
  }
  finishedTasksNum.textContent = counter;
}

async function updateTodo(id, action) {
  let method;
  let body = { todoId: id };
  if (action === "markFinished") {
    method = "PUT";
  } else if (action === "delete") {
    method = "DELETE";
  } else {
    throw new Error("Invalid action");
  }

  let response = await fetch(`https://todos.routemisr.com/api/v1/todos`, {
    method: method,
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
  response = await response.json();
  if (action === "add") {
    response = await response.json();
    return response;
  } else if (response.message === "success") {
    display();
  }
}

function markUnfinished(id) {
  // This is a workaround as the API does not support marking unfinished
  let title;
  for (const todo of allTodos) {
    if (todo._id === id) {
      title = todo.title;
      break;
    }
  }
  updateTodo(id, "delete");
  addTodo(title);
}

async function addIconFunctionality() {
  document.querySelectorAll(".fa-trash-can").forEach((element) => {
    element.addEventListener("click", function (e) {
      updateTodo(this.getAttribute("data-unique-id"), "delete");
    });
  });

  document.querySelectorAll(".fa-square").forEach((element) => {
    element.addEventListener("click", function (e) {
      updateTodo(this.getAttribute("data-unique-id"), "markFinished");
    });
  });

  document.querySelectorAll(".fa-square-check").forEach((element) => {
    element.addEventListener("click", function (e) {
      markUnfinished(this.getAttribute("data-unique-id"));
    });
  });
}

getUserData();
display();
