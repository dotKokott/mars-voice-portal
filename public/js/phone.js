const $ = require("jquery");
const recordrtc = require('recordrtc');

const mediaConstraints = { video: true, audio: true };

let userStream;
let rtc;
//let currentDataURL = undefined;

navigator.mediaDevices.getUserMedia(mediaConstraints).then((result) => { userStream = result })

var socket = io();

var videoPreview = $('#video_preview')[0];

function init() {
    console.log("Initializing...");
}

function startRecording() {
    var options = {
        //recorderType: recordrtc.StereoAudioRecorder,
        mimeType: 'video/webm', // or video/webm\;codecs=h264 or video/webm\;codecs=vp9
        audioBitsPerSecond: 128000,
        videoBitsPerSecond: 128000,
        bitsPerSecond: 128000 // if this line is provided, skip above two
    };

    rtc = recordrtc(userStream, options);
    rtc.startRecording();    
}

function stopRecording() {
    rtc.stopRecording((blobUrl) => {
        rtc.getDataURL((dataURL) => {
            videoPreview.src = dataURL;
            videoPreview.play();
        })
    });
}

function sendToScreen(screen) {
    socket.emit('sendVideo', {screenID: screen, video: videoPreview.src });
    console.log("Sent to server!");
}

$( document ).ready(() => {
    init();
})

// $( document ).mousedown(() => {
//     startRecording();
// })

// $( document ).mouseup(() => {
//     stopRecording();
// })

$('#btnRecord').mousedown(() => {
    startRecording();
})

$('#btnRecord').mouseup(() => {
    stopRecording();
})

$('#btnSend').click(() => {
    sendToScreen(1);
})
