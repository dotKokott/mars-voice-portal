const $ = require('jquery');
const socket = io();
//const p5 = require('p5');

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
    //video.src = data.video;

    sketch.soundFile = sketch.loadSound(data.video)
});

socket.on('playVideo', (data) => {
    console.log("Received PLAY command!")

    //video.play();
    if(sketch.soundFile === undefined) return; 

    sketch.soundFile.play();
})

const WIDTH = 1280;
const HEIGHT = 720;

let sketch;

var canvas = new p5((p) => {
    let now = Date.now();
    let then = Date.now();
    const INTERVAL_60 = 0.0166666; //60 fps

    let mic, fft, soundFile;

    p.setup = () => {
        sketch = p;

        p.colorMode(p.HSL);

        var c = p.createCanvas(WIDTH, HEIGHT);
        c.canvas.style.width = "100%";
        c.canvas.style.height = "100%";

        //soundFile = p.loadSound(video.src)



        // mic = new p5.AudioIn();
        // mic.start();
        fft = new p5.FFT();
        //fft.setInput(soundFile);

    
    }

    p.draw = () => {
        then = now;
        now = Date.now();

        p.background(180);

        let spectrum = fft.analyze();

        p.beginShape();
        for (i = 0; i < spectrum.length; i++) {
            p.vertex(i, p.map(spectrum[i], 0, 255, HEIGHT, 0));
        }
        p.endShape();
    }
})