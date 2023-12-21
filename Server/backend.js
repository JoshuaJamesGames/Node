const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server);
const port = 5500;
const hostname = '127.0.0.1';

app.use(express.static('Client'));

app.get('/', (req, res) => {
  res.sendFile(__dirname +'/index.html');
});

const backendPlayers = {};
io.on('connection', (socket) =>{
  console.log('A Player has Connected');
  backendPlayers[socket.id] = {
    x: 0,
    y: 1.6,
    z: 3
  };

  io.emit('updatePlayers', backendPlayers);

  console.log(backendPlayers);
});


server.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});



