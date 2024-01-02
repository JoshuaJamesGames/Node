const express = require('express');
const app = express();

const https = require('https');
const fs = require('fs');
const options = {
  key:fs.readFileSync(__dirname + '/certs/key.pem'),
  cert:fs.readFileSync(__dirname + '/certs/cert.pem')
}
const server = https.createServer(options, app);
const {Server} = require('socket.io');
const io = new Server(server);
const port = 5500;
const hostname = '127.0.0.1';

app.use(express.static('Client'));

app.get('/', (req, res) => {
  res.sendFile(__dirname +'/index.html');
});

const floorSize = 10;
const backendPlayers = {};
const backendObjects = {};
io.on('connection', (socket) =>{
  console.log('A Player has Connected');
  backendPlayers[socket.id] = {
    x: (floorSize*2 * Math.random())-floorSize,
    y: 1.6,
    z: (floorSize*2 * Math.random())-floorSize
  };
  
  
  io.emit('updatePlayers', backendPlayers);
  setTimeout(()=>{
    io.emit('updateObjects', backendObjects);
  }, 1000)
  //io.emit('updateObjects', backendObjects);

  socket.on('disconnect', (reason) =>{
    console.log(reason);
    delete backendPlayers[socket.id];
    io.emit('updatePlayers', backendPlayers);
  });  

  socket.on('updateObjects', (object) =>{
    console.log('Recieved object', object);
    backendObjects[object.uuid] = {
      color: object.color,
      roughness: object.roughness,
      metalness: object.metalness,
      position: object.position,
      quaternion: object.quaternion,
      rotation: object.rotation,
      scale: object.scale
    };
    io.emit('updateObjects', backendObjects);
  });

  console.log(backendPlayers);
});



server.listen(port, () => {
  console.log(`Server running at https://${hostname}:${port}/`);
});



