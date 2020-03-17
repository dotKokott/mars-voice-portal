const $ = require('jquery');
var socket = io();

var video = $('#video')[0];

$( document ).ready( () => {
    socket.emit('registerScreen', { screenID: 1 });
})

socket.on('receiveVideo', (data) => {
    console.log("Received video!");

    video.src = data.video;
    video.play();
});