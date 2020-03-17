const $ = require("jquery");
const recordrtc = require('recordrtc');

const mediaConstraints = { video: true, audio: true };

let userStream;
let rtc;

navigator.mediaDevices.getUserMedia(mediaConstraints).then((result) => { userStream = result })

var socket = io();

var videoPreview = $('#video_preview')[0];

function init() {
    console.log("Initializing...");
}

function startRecording() {
    var options = {
        recorderType: recordrtc.StereoAudioRecorder,
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

        
        //console.log(blobUrl.audio);

        rtc.getDataURL((dataURL) => {
            videoPreview.src = dataURL;
            videoPreview.play();

            socket.emit('sendVideo', {screenID: 1, video: dataURL });
            console.log("Sent to server!");
        })

        //var recordedBlob = recordRTC.getBlob();
        //recordRTC.getDataURL(function(dataURL) {
        	//video1.src = dataURL;
        	//console.log(video1);
        	//video1.play();
        //});
    });
}

$( document ).ready(() => {
    init();
})

$( document ).mousedown(() => {
    startRecording();
})

$( document ).mouseup(() => {
    stopRecording();
})
