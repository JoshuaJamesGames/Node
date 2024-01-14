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
    position:{},
    x: 0,
    y: 0,
    z: 0,
    head:{
      position:{},
      quaternion:{},
      rotation:{}
    },
    leftHand:{
      position:{},
      quaternion:{},
      rotation:{}
    },
    rightHand:{
      position:{},
      quaternion:{},
      rotation:{}
    }   
  };
  
  //When a player connects
  io.emit('updatePlayers', backendPlayers);

  //Update for new players needs to wait for three.js scene to initialize
  setTimeout(()=>{
    io.emit('createObjects', backendObjects);
  }, 1000)  

  socket.on('disconnect', (reason) =>{
    console.log(reason);
    delete backendPlayers[socket.id];
    io.emit('updatePlayers', backendPlayers);
  });  

  socket.on('createObject', (object) =>{
    console.log('New object');
    backendObjects[object.uuid] = {
      color: object.color,
      roughness: object.roughness,
      metalness: object.metalness,
      position: object.position,
      quaternion: object.quaternion,
      rotation: object.rotation,
      scale: object.scale
    };
    io.emit('createObjects', backendObjects);
  });

  socket.on('clientUpdateObject', (object) =>{
    //console.log(`updating ${object}`);
    backendObjects[object.uuid].position = object.position;
    backendObjects[object.uuid].quaternion = object.quaternion;
    backendObjects[object.uuid].rotation = object.rotation;
    backendObjects[object.uuid].scale = object.scale;
    socket.broadcast.emit('clientUpdateObject', object);
  });

  socket.on('playerHeadPosition', (object) =>{
    //console.log(object);
    backendPlayers[socket.id].head = object.head;
    
  });

  socket.on('playerHandUpdate', (hands)=>{
    //console.log(hands);
    backendPlayers[socket.id].leftHand = hands.leftHand;
    backendPlayers[socket.id].rightHand = hands.rightHand;
  });

  socket.on('playerPosition',(player)=>{
    backendPlayers[socket.id].position = player.position;    
  });

  console.log(backendPlayers);
});

setInterval(()=>{
  
    io.emit('updatePlayerPositions', backendPlayers);
    //console.log(backendPlayers);
  
}, 30);



server.listen(port, () => {
  console.log(`Server running at https://${hostname}:${port}/`);
});



