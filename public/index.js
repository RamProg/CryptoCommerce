const socket = io();

socket.on("refresh", (data) => {
  const template = `<tr>
    <th scope="row">${data.id}</th>
    <td>${data.name}</td>
    <td>${data.price}</td>
    <td><img src=${data.thumbnail} width="25" height="25"></img></td>
    </tr>`;
  const tbody = document.getElementById("pl");
  tbody.innerHTML += template;
});

socket.on("newChat", (data) => {
  const template = `<tr>
    <td style="color: blue; font-weight: bold;">${data.mail}</td>
    <td style="color: brown;">${data.time}</td>
    <td style="color: green; font-style: italic;">${data.content}</td>
    </tr>`;
  const tbody = document.getElementById("cl");
  tbody.innerHTML += template;
  if (document.getElementById("empty-chat"))
    document.getElementById("empty-chat").style.display = "none";
  document.getElementById("chat-table").style.removeProperty("display");
});

function addProduct() {
  const name = document?.getElementsByName("title")[0]?.value;
  const price = document?.getElementsByName("price")[0]?.value;
  const thumbnail = document?.getElementsByName("thumbnail")[0]?.value;
  socket.emit("update", { name, price, thumbnail });
  return false;
}

function addChat() {
  const mail = document?.getElementsByName("mail")[0]?.value;
  const content = document?.getElementsByName("content")[0]?.value;
  socket.emit("newMessage", { mail, content });
  return false;
}

function login() {
  const name = document?.getElementsByName("name")[0]?.value;
  socket.emit("login", name);
  return false;
}
