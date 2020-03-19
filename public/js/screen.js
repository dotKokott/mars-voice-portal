const $ = require('jquery');
const socket = io();

const video = $('#video')[0];

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (
        m,
        key,
        value
    ) {
        vars[key] = value;
    });
    return vars;
}

$(document).ready(() => {
    const vars = getUrlVars()

    const x = vars['x'] || 0;
    const y = vars['y'] || 0;

    console.log('X=>' + x + '  Y=>' + y)

    socket.emit('registerScreen', { x: x, y: y });
})

socket.on('receiveVideo', (data) => {
    console.log("Received video!");

    video.src = data.video;
    video.play();
});

socket.on('playVideo', (data) => {
    console.log("Received PLAY command!")

    //const delay = data.delay || 0;

    video.play();
})

