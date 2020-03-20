const $ = require("jquery");
const recordrtc = require('recordrtc');

const mediaConstraints = { video: true, audio: true };

let userStream;
let rtc;

let currentDataURL;

navigator.mediaDevices.getUserMedia(mediaConstraints).then((result) => { userStream = result })

var socket = io();

socket.on('receiveAvailableScreens', (data) => {
    data.ids.forEach((item) => {
        $('#listScreens').append(
            $('<option></option>').val(item).html(item)
        );
    })
})

var videoPreview = $('#video_preview')[0];

function init() {
    console.log("Initializing...");
    socket.emit('getAvailableScreens');
}

let firstTime = true;
function startRecording() {
    var options = {
        recorderType: recordrtc.StereoAudioRecorder,
        mimeType: 'audio/webm', // or video/webm\;codecs=h264 or video/webm\;codecs=vp9
        audioBitsPerSecond: 128000,
        videoBitsPerSecond: 128000,
        bitsPerSecond: 128000 // if this line is provided, skip above two
    };
    
    rtc = recordrtc(userStream, options);        

    rtc.startRecording();    
}

function stopRecording() {
    rtc.stopRecording((blobUrl) => {
        console.log("Stopped");
        rtc.getDataURL((dataURL) => {
            currentDataURL = dataURL;

            sendToScreen(0, 0);
        })
    });

}

function sendToScreen(x, y) {
    socket.emit('sendVideo', { x: x, y:y , video: currentDataURL });
    
    location.reload();
}

$( document ).ready(() => {
    init();
})

// $( document ).click(() => {
//     console.log($('#listScreens').val())
// })

// $( document ).mousedown(() => {
//     startRecording();
// })

// $( document ).mouseup(() => {
//     stopRecording();
// })
var recording = false;

$('#btnRecord').click(() => {
    if(!recording) {
        recording = true;
        startRecording();

        return;
    }

    if(recording) {
        recording = false;
        stopRecording();

        return;
    }
})

$('#btnSend').click(() => {
    var screen = $('#listScreens').val()
    
    // if (screen === '') {
    //     alert('Please choose a screen!')
    //     return
    // }

    sendToScreen(parseInt(screen));
})