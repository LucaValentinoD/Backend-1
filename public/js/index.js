const socket = io(); 

let user;

let chatBox = document.getElementById("chatBox");


Swal.fire({
  title: "Identificate",
  input: "text",
  text: "Ingrese el usuario para identificarte",
  inputValidator: (value) => {
    return !value && "Por favor debe ingresar el nombre de un usuario";
  },
  allowOutsideClick: false,
}).then((result) => {
  user = result.value;


  socket.emit("newUser", user);
});



chatBox.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    if (chatBox.value.trim().length > 0) {
      socket.emit("message", { user: user, message: chatBox.value });
      chatBox.value = "";
    }
  }
});


socket.on("messageLogs2", (data) => {
  let messagesLogs = document.getElementById("messageLogs");
  let messages = "";

  data.forEach((messageLog) => {
      messages = messages + `${messageLog.user} dice: ${messageLog.message} </br>`
  });

  messagesLogs.innerHTML = messages;
});