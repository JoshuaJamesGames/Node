const express = require('express');
const app = express();

const https = require('https');
const fs = require('fs');
const options = {
  key:fs.readFileSync(__dirname + '/certs/key.pem'),
  cert:fs.readFileSync(__dirname + '/certs/cert.pem')
}
const port = 8443;
const server = https.createServer(options, app);
const {Server} = require('socket.io');
const io = new Server(server);

const hostname = 'joshuajamesgames.net';

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
    rotation:{},
    color: Math.random() * 0xffffff,
    x: 0,
    y: 0,
    z: 0,
    head:{},
    leftHand:{},
    rightHand:{},
    inventory:{}   
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

  socket.on('createWorldObject', (object) =>{
    console.log(`Adding ${object.uuid}`);
    //Possible filtering or limiting here?
    backendObjects[object.uuid] = {
      object3d: object.object3d,
      position: object.position,
      rotation: object.rotation,
      quaternion: object.quaternion,
      scale: object.scale
    }
    
    //console.log(backendObjects[object.uuid]);
    io.emit('spawnWorldObject', {uuid: object.uuid, object3d: backendObjects[object.uuid]});
  });

  socket.on('createPlayerObject', (object) =>{
    console.log(`Adding ${object.uuid} to ${socket.id}`);
    //Possible filtering or limiting here?
    backendPlayers[socket.id].inventory[object.uuid] = {
      object3d: object.object3d,
      position: object.position,
      rotation: object.rotation,
      quaternion: object.quaternion,
      scale: object.scale
    }
    
    //console.log(backendObjects[object.uuid]);
    io.emit('spawnPlayerObject', {playerId: socket.id, uuid: object.uuid, object3d: backendPlayers[socket.id].inventory[object.uuid]});
  });

  socket.on('deleteObject', (object) =>{
    console.log('Remove Object');
    delete backendObjects[object.uuid];
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
    backendPlayers[socket.id].rotation = player.rotation;
        
  });

  socket.on('playerAttributeUpdate', (player)=>{
    backendPlayers[socket.id].color = player.color;
  })

  //console.log(backendPlayers);
});

setInterval(()=>{
  
    io.emit('updatePlayerPositions', backendPlayers);
    //console.log(backendPlayers);
  
}, 30);



server.listen(port, () => {
  console.log(`Server running at https://${hostname}:${port}/`);
});



