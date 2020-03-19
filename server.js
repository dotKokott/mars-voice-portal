const fs = require('fs');
const express = require('express');
const app = express();
const server = require('https').createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
  }, app)
  
const io = require('socket.io')(server);

const port =  process.env.PORT || 3000;

app.use('/public', express.static('public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/phone.html');
});

// var screens = {}

const DIM_X = 5
const DIM_Y = 3

const screenArray = Array.from(Array(DIM_X), () => new Array(DIM_Y))

io.on('connection', (socket) => { 
    socket.on('registerScreen', data => {
        screenArray[data.x][data.y] = socket

        console.log("Registered X:" + data.x + ' Y:' + data.y);
    })

    socket.on('sendVideo', (data) => {        
        screenArray[data.x][data.y].emit('receiveVideo', { video: data.video });
    })

    // socket.on('getAvailableScreens', (data) => {
    //     socket.emit('receiveAvailableScreens', {ids: Object.keys(screens)})
    // })
});

server.listen(port, () => console.log("Listening on port " + port));