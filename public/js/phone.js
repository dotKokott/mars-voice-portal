/** @format */

const $ = require('jquery');
const recordrtc = require('recordrtc');

const mediaConstraints = { video: false, audio: true };

let userStream;
let rtc;

let currentDataURL;

let isRecording = false;

navigator.mediaDevices.getUserMedia(mediaConstraints).then(result => {
  userStream = result;
});

var socket = io();

socket.on('receiveAvailableScreens', data => {
  console.log(data);
  var i = 0;
  // document.getElementById('listScreens').innerHTML = '';
  for (let screen of data.screens) {
    var btnInput = document.createElement('input');
    var btnLabel = document.createElement('label');
    if (i == 0) {
      btnInput.checked = true;
    }
    btnLabel.setAttribute('data-x', screen.x);
    btnLabel.setAttribute('data-y', screen.y);
    var id = `screen-${i++}`;
    btnInput.type = 'radio';
    btnInput.id = id;
    btnInput.name = 'screen';
    btnLabel.setAttribute('for', id);
    document.getElementById('listScreens').appendChild(btnInput);
    document.getElementById('listScreens').appendChild(btnLabel);
  }
});

function init() {
  console.log('Initializing...');
  socket.emit('getAvailableScreens');
}

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
  rtc.stopRecording(blobUrl => {
    console.log('Stopped');
    rtc.getDataURL(dataURL => {
      currentDataURL = dataURL;

      var selectedScreen = $('input[name="screen"]:checked+label')[0];
      var x = selectedScreen.getAttribute('data-x');
      var y = selectedScreen.getAttribute('data-y');

      sendToScreen(x, y);
    });
  });
}

function sendToScreen(x, y) {
  socket.emit('sendVideo', { x: x, y: y, video: currentDataURL });
  //location.reload();
}

$(document).ready(() => {
  init();
});

$('#btnRecord').mousedown(() => {
  startRecording();
  document.querySelector('#btnRecord').classList.add('recording');
  document.querySelector('#btnRecord').innerHTML = 'Record';
});

$('#btnRecord').mouseup(() => {
  stopRecording();
  document.querySelector('#btnRecord').classList.remove('recording');
  document.querySelector('#btnRecord').innerHTML = 'Recording';
});

$('#btnSend').click(() => {
  var screen = $('#listScreens').val();
  sendToScreen(parseInt(screen));
});
