let username = localStorage.getItem("username");
let apiKey = localStorage.getItem("apiKey");

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

function main() {
  getUserData();
}

main();
