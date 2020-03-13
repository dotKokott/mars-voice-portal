const $ = require("jquery");

const mediaConstraints = { video: true, audio: true };
let stream;

navigator.mediaDevices.getUserMedia(mediaConstraints).then(function(result) { stream = result })

function init() {
    console.log("Initializing...");
}

$( document ).ready(function() {
    init();
});