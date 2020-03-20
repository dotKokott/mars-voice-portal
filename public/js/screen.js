const $ = require('jquery');
const socket = io();
const p5 = require('p5');

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
    video.src = data.video;
});

socket.on('playVideo', (data) => {
    console.log("Received PLAY command!")

    video.play();
})

