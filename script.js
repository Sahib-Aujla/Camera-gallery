let video = document.querySelector("video");
let RecordBtnCont = document.querySelector(".record-btn-cont");
let RecordBtn = document.querySelector(".record-btn");

let CaptureBtnCont = document.querySelector(".capture-btn-cont");
let CaptureBtn = document.querySelector(".capture-btn");
let recordFlag = false;
let timer=document.querySelector(".timer");
let transparentColor="transparent";

let recorder;
let chunks =[];

let constraint = {
    video: true,
    audio: false
}

navigator.mediaDevices.getUserMedia(constraint)
    .then((stream) => {
        video.srcObject = stream;

        recorder = new MediaRecorder(stream);

        recorder.addEventListener("start",(e)=>{
            chunks=[];

        })
        recorder.addEventListener("dataavailable",(e)=>{
            chunks.push(e.data);
        })
        recorder.addEventListener("stop",(e)=>{
            //converting media chunks to video
            let blob=new Blob(chunks,{type : "video/mp4"})
            //let videoURL=URL.createObjectURL(blob);

            if(db){
                let videoID=shortid();
                let dbTransaction=db.transaction("video","readwrite");
                let videoStore=dbTransaction.objectStore("video");
                let videoEntry={
                    id: `vid-${videoID}`,
                    blobData: blob
                }
                videoStore.add(videoEntry);

            }

            // let a=document.createElement("a");
            // a.href=videoURL;
            // a.download="stream.mp4";
            // a.click();


        })

    })

RecordBtnCont.addEventListener("click", (e) => {
    if (!recorder) return;

    recordFlag = !recordFlag;

    if (recordFlag) {
        recorder.start();

        RecordBtn.classList.add("scale-record");
        startTimer();
        timer.style.display='block';

    }
    else {
        recorder.stop();
        RecordBtn.classList.remove("scale-record");
        stopTimer();
        timer.style.display='none';
        

    }

})

CaptureBtnCont.addEventListener("click",(e)=>{
    let canvas=document.createElement("canvas");
    canvas.width=video.videoWidth;
    canvas.height=video.videoHeight;

    let tool=canvas.getContext("2d");
    tool.drawImage(video,0,0,canvas.width,canvas.height);

    tool.fillStyle=transparentColor;
    tool.fillRect(0,0,canvas.width,canvas.height);

    let imageURL=canvas.toDataURL();

    if(db){

        let imageID=shortid();
        let dbTransaction=db.transaction("image","readwrite");
        let imageStore=dbTransaction.objectStore("image");
        let imageEntry={
            id: `img-${imageID}`,
            url: imageURL
        }
        imageStore.add(imageEntry);
    }

    // let a=document.createElement("a");
    // a.href=imageURL;
    // a.download="image.jpg";
    // a.click();
})

let timerID;
let counter=0;
function startTimer(){
    function displayTimer(){
        let totalSeconds=counter;
        let hours=Number.parseInt(totalSeconds/3600);
        totalSeconds=totalSeconds%3600;
        let minutes=Number.parseInt(totalSeconds/60);
        totalSeconds=totalSeconds%60;
        let seconds=totalSeconds;

        hours=(hours<10) ? `0${hours}` : hours;
        minutes=(minutes<10) ? `0${minutes}` : minutes;
        seconds=(seconds<10) ? `0${seconds}` : seconds;


        timer.innerText=`${hours}:${minutes}:${seconds}`;

        counter++;


    }
    timerID=setInterval(displayTimer,1000);

}
function stopTimer(){
    clearInterval(timerID);
    timer.innerText="00:00:00";
    counter=0;
}

let filterLayer=document.querySelector(".filter-layer");
let allFilters=document.querySelectorAll(".filter");

allFilters.forEach((filterElem)=> {
    filterElem.addEventListener("click",(e)=>{
        //get color from filterElem
        transparentColor=getComputedStyle(filterElem).getPropertyValue("background-color");
        filterLayer.style.backgroundColor=transparentColor;

    })

});