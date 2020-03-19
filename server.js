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

var screens = {}

io.on('connection', (socket) => { 
    socket.on('registerScreen', data => {
        screens[data.screenID] = socket;

        console.log("Registered screen: " + data.screenID);
    })

    socket.on('sendVideo', (data) => {        
        screens[data.screenID].emit('receiveVideo', { video: data.video });
    })

    socket.on('getAvailableScreens', (data) => {
        socket.emit('receiveAvailableScreens', {ids: Object.keys(screens)})
    })
});

server.listen(port, () => console.log("Listening on port " + port));