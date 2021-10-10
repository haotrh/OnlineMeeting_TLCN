const io = require('socket.io-client')
const socket = io("/mediasoup")

socket.on('connection-success', ({ socketId }) => {
  console.log(socketId)
})

let params = {
  // mediasoup params
}

const cameraSuccess = async (stream) => {
  cameraVideo.srcObject = stream
  const track = stream.getVideoTracks()[0]
  params = {
    track,
    ...params
  }
}

const stopCamera = async() => {
  let cameraTracks = await cameraVideo.srcObject.getTracks();

  await cameraTracks.forEach(track => track.stop());
  cameraVideo.srcObject = null;
}

const screenSuccess = async (stream) => {
  screenVideo.srcObject = stream
  const track = stream.getVideoTracks()[0]
  params = {
    track,
    ...params
  }
}

const stopScreen = async() => {
  let screenTracks = await screenVideo.srcObject.getTracks();

  await screenTracks.forEach(track => track.stop());
  screenVideo.srcObject = null;
}

const getLocalStream = () => {
  navigator.getUserMedia({
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      sampleRate: 44100
    },
    video: {
      width: {
        min: 640,
        max: 1920,
      },
      heigh: {
        min: 400,
        max: 1080,
      }
    }
  }, cameraSuccess, error => {
    console.log(error.message)
  })
}

const getScreenCapture = async () => {
  try 
  {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100
      },
      video: {
        cursor: "always"
      }
    })

    await screenSuccess(stream)
  } 
  catch(error) 
  {
    console.log(error.message);
  }
}

btnCamera.addEventListener('click', getLocalStream)
btnStopCamera.addEventListener('click', stopCamera)
btnScreen.addEventListener('click', getScreenCapture)
btnStopScreen.addEventListener('click', stopScreen)
