
const videoPlayer = document.querySelector("#main");
const videobtn= document.querySelector("#videobtn");
const videoinput= document.querySelector("#videoinput");
const totalTimeElem = document.querySelector("#totalTime");
const currentTimeElem = document.querySelector("#currentTime");
const slider = document.querySelector("#slider");


let video = ""
let duration;
let timerObj;
let currentPlayTime = 0;
let isPlaying = false;

const handleInput=()=>{
// console.log("input is clicked");
// you have to make it click
videoinput.click();
}

const acceptInputHandler=(obj)=>{
//    console.log("event",obj);
   let selectedVideo;
   if (obj.type == "drop") {
    selectedVideo = obj.dataTransfer.files[0]

} else {
    selectedVideo = obj.target.files[0];

}
const fileType = selectedVideo.type.split("/")[0];
//    src file-> base64
 const link= URL.createObjectURL(selectedVideo);
//  console.log(link);

if(fileType === "video"){
const videoElement= document.createElement("video");
videoElement.src= link;
 videoElement.setAttribute("class", "video");
//  videoElement.controls="true";
  // check if there are any video already present
  if (videoPlayer.children.length > 0) {

    // if present -> remove it 
    videoPlayer.removeChild(videoPlayer.children[0]);
}
const existingCoverImg = videoPlayer.querySelector("img");
        if (existingCoverImg) {
            existingCoverImg.remove();
        }
// now after the above check -> add the videoElement
 videoPlayer.appendChild(videoElement);
 video = videoElement
    isPlaying = true;
    setPlayPause();
 videoElement.play();
 videoElement.volume= 0.3;
 videoElement.addEventListener("loadedmetadata", function () {
    // it gives in decimal value -> convert that into seconds
    duration = Math.round(videoElement.duration);
    // convert seconds into hrs:mins:secs
    let time = timeFormat(duration);
    totalTimeElem.innerText = time;
    slider.setAttribute("max", duration);
    startTimer();

})
}
else if (fileType === "audio") {
    // Handle audio file
    const audioElement = document.createElement("audio");
    audioElement.src = link;
    audioElement.setAttribute("class", "audio");

    if (videoPlayer.children.length > 0) {
        videoPlayer.removeChild(videoPlayer.children[0]);
    }
    videoPlayer.appendChild(audioElement);

    video = audioElement; // Use the same `video` variable for unified handling
    isPlaying = true;
    setPlayPause();
    audioElement.play();
    audioElement.volume = 0.3;

    audioElement.addEventListener("loadedmetadata", function () {
        duration = Math.round(audioElement.duration);
        const time = timeFormat(duration);
        totalTimeElem.innerText = time;
        slider.setAttribute("max", duration);
        startTimer();
    });
    console.log(typeof jsmediatags);

    jsmediatags.read(selectedVideo, {
        onSuccess: function (tag) {
            const existingCoverImg = videoPlayer.querySelector("img");
            // if cover page is alredy there
        if (existingCoverImg) {
            existingCoverImg.remove();
        }
            if (tag.tags.picture) {
                const picture = tag.tags.picture;
                const base64String = arrayBufferToBase64(picture.data);
                const coverImage = `data:${picture.format};base64,${base64String}`;
                
                const coverImg = document.createElement("img");
                coverImg.src = coverImage;
                coverImg.style.width = "20%"; // Adjust size here (e.g., 50% of container width)
                
                videoPlayer.appendChild(coverImg);
                videoPlayer.style.backgroundSize = "cover";
                videoPlayer.style.backgroundPosition = "center";
            } else {
                resetToDefaultBackground();
                
            }
        },
        onError: function (error) {
            console.error("Error reading metadata:", error);
            
        },
    });
}
}
function resetToDefaultBackground() {
    // Remove any dynamic background image
    videoPlayer.style.backgroundImage = "";
    videoPlayer.style.backgroundSize = "";
    videoPlayer.style.backgroundPosition = "";

    // Add the default logo and animation back
    if (!document.querySelector(".main-img")) {
        const imgElement = document.createElement("img");
        imgElement.src = "./logo.png"; // Path to your default image
        imgElement.alt = "logo";
        imgElement.className = "main-img";
        const existingCoverImg = videoPlayer.querySelector("img");
        if (existingCoverImg) {
            existingCoverImg.remove();
        }
        videoPlayer.appendChild(imgElement);
    }
}
function arrayBufferToBase64(buffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}
videobtn.addEventListener("click",handleInput);
// when file is selected
videoinput.addEventListener("change",acceptInputHandler);

// *************************Volume and Speed*************************************************

const speedUp = document.querySelector("#speedUp");
const speedDown = document.querySelector("#speedDown");
const volumeUp = document.querySelector("#volumeUp");
const volumeDown = document.querySelector("#volumeDown");
const toast= document.querySelector(".toast");
/********************Speed Up********************/ 
const speedUpHandler=() =>{
const videoElement= document.querySelector("video");

if(videoElement ==null){
    return;
}
if(videoElement.playbackRate>3){
    return;
}
const incresedSpeed= videoElement.playbackRate+ 0.5;
videoElement.playbackRate=incresedSpeed;
showToast(incresedSpeed+"X");

}
/***********************Speed Down**************************/ 
const speedDownHandler=()=>{
    
if(videoElement ==null){
    return;
}
if(videoElement.playbackRate>0){
    const deccresedSpeed= videoElement.playbackRate - 0.5;
    videoElement.playbackRate=deccresedSpeed;
    // console.log("decresed speed",deccresedSpeed);
    showToast(deccresedSpeed+"X");
}
}

/***********************Volume Up**********************/ 
const volumeUpHandler=()=>{
     // select the video
     const videoElement = document.querySelector("video");
     if (videoElement == null) {
         return;
     }
     // property to play with volume 
     if (videoElement.volume >= 0.99) {
         return;
     }
     const increasedVolume = videoElement.volume + 0.1
     videoElement.volume = increasedVolume;
     // console.log("increseas volume", increasedVolume);
     const percentage= increasedVolume*100 +"%";
     showToast(percentage);
}

/************************Volume Down****************************/ 
const volumeDownHandler = () => {
    // select the video
    const videoElement = document.querySelector("video");
    if (videoElement == null) {
        return;
    }
    // property to play with volume 
    if (videoElement.volume <= 0.1) {
        videoElement.volume = 0;
        return
    }
    const decreaseVolume = videoElement.volume - 0.1;
    videoElement.volume = decreaseVolume
    const percentage= decreaseVolume*100 +"%";
     showToast(percentage);
}

function showToast(message){
    toast.textContent=message;
    toast.style.display="block";
    setTimeout(()=>{
        toast.style.display="none";
    },1000);
}
speedUp.addEventListener("click",speedUpHandler);
speedDown.addEventListener("click",speedDownHandler);
volumeUp.addEventListener("click",volumeUpHandler);
volumeDown.addEventListener("click",volumeDownHandler);



/*******************Controls********************************/ 

const handleFullScreen = () => {
    videoPlayer.requestFullscreen();
}

const fullScreenElem = document.querySelector("#fullScreen");
fullScreenElem.addEventListener("click", handleFullScreen)
// adding seek behavior in slider
slider.addEventListener("change", function (e) {
    let value = e.target.value;
    video.currentTime = value;
})

/***********forward and backward button*************/
function forward() {
    currentPlayTime = Math.round(video.currentTime) + 5;
    video.currentTime = currentPlayTime;
    slider.setAttribute("value", currentPlayTime);
    showToast("Forward by 5 sec");
    let time = timeFormat(currentPlayTime);
    currentTimeElem.innerText = time;
}

function backward() {
    currentPlayTime = Math.round(video.currentTime) - 5;
    video.currentTime = currentPlayTime;
    slider.setAttribute("value", currentPlayTime);
    showToast("Backward by 5 sec");
    let time = timeFormat(currentPlayTime);
    currentTimeElem.innerText = time;
}


const forwardBtn = document.querySelector("#forwardBtn");
const backwardBtn = document.querySelector("#backBtn");
forwardBtn.addEventListener("click", forward);
backwardBtn.addEventListener("click", backward);
/****************play pause********************/
const playPauseContainer = document.querySelector("#playPause");
function setPlayPause() {
    if (isPlaying === true) {
        playPauseContainer.innerHTML = `<i class="fas fa-pause state"></i>`;
        video.play();
    }
    else {
        playPauseContainer.innerHTML = `<i class="fas fa-play state"></i>`;
        video.pause();
    }
}

playPauseContainer.addEventListener("click", function (e) {
    if (video) {
        isPlaying = !isPlaying;
        setPlayPause();
    }
})

/******stop btn********/
const stopBtn = document.querySelector("#stopBtn");
const stopHandler = () => {
    if (video) {
        // remove the video from ui 
        video.remove();
        // reset all the varibales
        isPlaying = false;
        currentPlayTime = 0;
        slider.value = 0;
        video = "";
        duration = "";
        totalTimeElem.innerText = '--/--';
        currentTimeElem.innerText = '00:00';
        slider.setAttribute("value", 0);
        stopTimer();
        setPlayPause();
    }
}

stopBtn.addEventListener("click", stopHandler)

/***************utility function to convert secs into hrs :mns : seconds*****************/
function timeFormat(timeCount) {
    let time = '';
    const sec = parseInt(timeCount, 10);
    let hours = Math.floor(sec / 3600);
    let minutes = Math.floor((sec - (hours * 3600)) / 60);
    let seconds = sec - (hours * 3600) - (minutes * 60);
    if (hours < 10)
        hours = "0" + hours;
    if (minutes < 10)
        minutes = "0" + minutes;
    if (seconds < 10)
        seconds = "0" + seconds
    time = `${hours}:${minutes}:${seconds}`;
    return time;
}

// function that runs the slider and timer  
function startTimer() {
    timerObj = setInterval(function () {
        currentPlayTime = Math.round(video.currentTime);
        slider.value = currentPlayTime;
        const time = timeFormat(currentPlayTime);
        currentTimeElem.innerText = time;
        if (currentPlayTime == duration) {
            state = "pause";
            stopTimer();
            setPlayPause();
            video.remove();
            slider.value = 0;
            currentTimeElem.innerText = "00:00:00";
            totalTimeElem.innerText = '--/--/--';
        }
    }, 1000);
}
function stopTimer() {
    clearInterval(timerObj);
}



/**********************enable drag and drop**********************/
// Prevent default behavior for dragover and dragleave events
videoPlayer.addEventListener('dragenter', (e) => {
    e.preventDefault();
})

videoPlayer.addEventListener('dragover', (e) => {
    e.preventDefault();
})

videoPlayer.addEventListener('dragleave', (e) => {
    e.preventDefault();
})


videoPlayer.addEventListener('drop', (e) => {
    e.preventDefault();
    acceptInputHandler(e);
})




/*********keyboard support***************/
const body = document.querySelector("body");
// keyboard inputs
body.addEventListener("keyup", function (e) {
    console.log(e.key);
    if (!video) return;
    if (e.code == "Space") {
        isPlaying = !isPlaying
        setPlayPause();
    }
    else if (e.key == "ArrowUp" ) {
        volumeUpHandler()
    }
    else if (e.key == "ArrowDown") {
        volumeDownHandler();
    }
    else if (e.key == "+") {
        speedUpHandler();
    }
    else if (e.key == "-") {
        speedDownhandler();
    }
    else if (e.key == "ArrowRight") {
        forward();
    }
    else if (e.key == "ArrowLeft") {
        backward();
    }
})