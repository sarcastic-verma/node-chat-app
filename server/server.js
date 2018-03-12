const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected.');

  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the Chat Room!'));

  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New User Joined.'));

  // socket.emit('newEmail', {
  //   from: 'mike@example.com',
  //   text: 'Hey, what is up?',
  //   createdAt: 123
  // });

  // socket.emit('newMessage', {from: 'server', 'text': 'Welcome to the server!', createdAt: 123});
  socket.on('createMessage',(message, callback) => {
    console.log(message);
    io.emit('newMessage',generateMessage(message.from, message.text));
    callback('This is from the server');
    // socket.broadcast.emit('newMessage', {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime
    // });
  });

  // socket.on('createEmail', (newEmail) => {
  //   console.log('createEmail',newEmail);
  // });
  socket.on('createLocationMessage',(coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
  });

  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });
});


server.listen(port, ()=> {
  console.log(`Server is up on port ${port}`);
});
