const express = require('express');
const path = require('path');
const app = express();
const socket = require('socket.io');

app.use(express.static(path.join(__dirname, '/client')));

const messages = [];
const users = [];

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'));
});

const server = app.listen(8000, () => {
  console.log('server running on port 8000');
});
const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);

  socket.on('userName', (user) => {
    console.log(socket.id + " has chosen the name! it's: " + user);
    users.push({ name: user, id: socket.id });
    console.log('users logged in:', users);
    socket.broadcast.emit('message', {
      author: 'Chat Bot',
      content: user + ' has joined the conversation!',
    });
  });

  socket.on('message', (message) => {
    console.log("Oh, I've got something from " + socket.id);
    messages.push(message);
    socket.broadcast.emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('Oh, socket ' + socket.id + ' has left');
    const index = users.findIndex((element) => element.id === socket.id);
    const name = users[index].name;
    users.splice(index, 1);
    console.log('users logged in:', users);
    socket.broadcast.emit('message', {
      author: 'Chat Bot',
      content: name + ' has left the conversation... :(',
    });
  });

  console.log("I've added a listener on message and disconnect events \n");
});
