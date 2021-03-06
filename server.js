const fs = require('fs');
const express = require('express');
const app = express();
const server = require('https').createServer(
  {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
  },
  app
);

const io = require('socket.io')(server);

const port = process.env.PORT || 3000;

// app.use('/public', express.static('public'));

app.use('/public', express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/phone.html');
});

// var screens = {}

const DIM_X = 5;
const DIM_Y = 3;

const screenArray = Array.from(Array(DIM_X), () => new Array(DIM_Y));

io.on('connection', socket => {
  socket.on('registerScreen', data => {
    screenArray[data.x][data.y] = socket;

    console.log('Registered X:' + data.x + ' Y:' + data.y);
  });

  socket.on('sendVideo', data => {
    //console.log('SEND VIDEO COMMAND TO ' + data.x + ' ' + data.y);
    //console.log("On server data: " + data.video);
    if(screenArray[data.x][data.y] === undefined) return
    
    screenArray[data.x][data.y].emit('receiveVideo', { video: data.video });
  });

  socket.on('getAvailableScreens', data => {
    var screens = [];
    for (let y = 0; y < DIM_Y; y++) {
      for (let x = 0; x < DIM_X; x++) {
        screens.push({ x: x, y: y });
      }
    }
    socket.emit('receiveAvailableScreens', { screens: screens });
  });
});

let tickInterval = 5000;
let currentColumn = 0;

function tick() {
  var x = screenArray[currentColumn];

  for (var y = 0; y < DIM_Y; y++) {
    var screen = x[y];
    if (screen !== undefined) {
      screen.emit('playVideo', {});
    }
  }
}

setInterval(tick, tickInterval);

server.listen(port, () => console.log('Listening on port ' + port));
