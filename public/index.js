const socket = io();

socket.on("refresh", (data) => {
  const template = `<tr>
    <th scope="row">${data.id}</th>
    <td>${data.title}</td>
    <td>${data.price}</td>
    <td><img src=${data.thumbnail} width="25" height="25"></img></td>
    </tr>`;
  const tbody = document.getElementsByTagName("TBODY")[0];
  tbody.innerHTML += template;
});

function addProduct() {
  const title = document?.getElementsByName("title")[0]?.value;
  const price = document?.getElementsByName("price")[0]?.value;
  const thumbnail = document?.getElementsByName("thumbnail")[0]?.value;
  socket.emit("update", { title, price, thumbnail });
  return false;
}

