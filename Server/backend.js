const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);

const port = 5500;

app.use(express.static('Client'))

app.get('/', (req, res) => {
  res.sendFile(__dirname +'/index.html')
})
const hostname = '127.0.0.1';

server.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});