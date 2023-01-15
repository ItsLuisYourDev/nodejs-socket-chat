const express = require('express');
const { readdir } = require('fs/promises');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const usuarios = [];
var cliente = "no_definido";

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.get('/chat', (req, res) => {
  if (cliente == "no_definido") {
    res.redirect("/")
  } else {
    // console.log(cliente)
    res.sendFile(__dirname + '/chat.html');

  }
});

io.on('connection', (socket) => {
  io.emit('ioGlobal', socket.id, cliente);

  socket.on('chat message', (msg, userID) => {
    var nomCliente = '';
    for (let i = 0; i < usuarios.length; i++) {
      const element = usuarios[i];
      if (element.id == userID) {
        nomCliente = element.nombre;
      }
    }
    io.emit('chat message', nomCliente, msg);
  });

  socket.on('chat users', (userName) => {
    io.emit('chat users', userName);

    cliente = userName;
    // console.log(userName)
    // console.log(usuarios)
  });

  socket.on('chat carga', (userNameid) => {
    usuarios.push({
      id: socket.id,
      nombre: cliente
    })
    cliente = "no_definido"
  });

  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000 http://127.0.0.1:3000');
});