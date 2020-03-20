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

const WIDTH = 1280;
const HEIGHT = 720;

var canvas = new p5((p) => {
    let now = Date.now();
    let then = Date.now();
    const INTERVAL_60 = 0.0166666; //60 fps

    p.setup = () => {
        p.colorMode(p.HSL);

        var c = p.createCanvas(WIDTH, HEIGHT);
        c.canvas.style.width = "100%";
        c.canvas.style.height = "100%";

        console.log("setup")
    }

    p.draw = () => {
        then = now;
        now = Date.now();
        
        p.background(0, 0, 0, 360);

        p.ellipse(50, 50, 80, 80);
    }
})