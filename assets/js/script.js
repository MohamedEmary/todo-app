let username = localStorage.getItem("username");
let apiKey = localStorage.getItem("apiKey");
let allTodos;

async function getApiKey() {
  let response = await fetch("https://todos.routemisr.com/api/v1/getApiKey");
  response = await response.json();
  let apiKey = response.apiKey;
  localStorage.setItem("apiKey", apiKey);
  console.log(apiKey);
}

function getUserData() {
  if (apiKey == null) {
    getApiKey();
  }

  if (username == null) {
    // TODO use a modal instead of prompt
    username = prompt("Please Enter Your Name:");
    localStorage.setItem("username", `${username}`);
  } else {
    username = localStorage.getItem("username");
  }

  document.querySelector("header h3").textContent = `Hey, ${username}`;
}

async function addTodo() {
  let todo = document.querySelector("input");
  document
    .querySelector(".submit-todo")
    .addEventListener("click", async function () {
      let todoVal = todo.value;
      todo.value = "";
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
      // TODO use a better was of informing the user his todo was added
      if (response.message == "success") {
        alert("Your Todo Was Added");
      } else {
        alert("Please Try Again");
      }
    });
  allTodos = await getTodos();
  console.log(allTodos);
}

async function getTodos() {
  let response = await fetch(
    `https://todos.routemisr.com/api/v1/todos/${apiKey}`
  );
  response = await response.json();
  return response.todos;
}

async function main() {
  allTodos = await getTodos();
  getUserData();
  addTodo();
}

main();
