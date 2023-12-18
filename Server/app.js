const express = require('express');
const app = express();
const port = 5500;

app.use(express.static('Client'))
app.get('/', (req, res) => {
  res.sendFile(__dirname +'../Client/index.html')
})
const hostname = '127.0.0.1';
/*
const http = require('http');


const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('You have connected');
});
*/


app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});