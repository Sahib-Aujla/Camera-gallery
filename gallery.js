// setTimeout(() => {
//     // if(db){
//         // console.log("hello jatta")
//         // let dbTransaction=db.transaction("video","readonly");
//         // let videoStore=dbTransaction.objectStore("video");
//         // let videoRequest=videoStore.getAll();
//         // videoRequest.onsuccess=(e)=>{
//         // let videoResult=videoRequest.result;
//         // videoResult.forEach((videoObj) => {
//         //     let galleryCont=document.querySelector(".gallery-cont")
//         //     let mediaElem=document.createElement("div");
//         //     mediaElem.setAttribute("class","media-cont");
//         //     mediaElem.setAttribute("id",videoObj.id);

//         //     let url=URL.createObjectURL(videoObj.blobData);

//         //     mediaElem.innerHTML=`
//         //     <div class="media">
//         //     <video  autoplay loop src=""></video>
//         //     </div>
//         //     <div class="delete action-btn">DELETE</div>
//         //     <div class="download action-btn">DOWNLOAD</div>
//         //     `;
            
//         // });    

//         // galleryCont.appendChild(mediaElem);
        
//         // }
    
            
// }, 100);

setTimeout(() => {
    if (db) {
        // videos retieval
        let videoDBTransaction = db.transaction("video", "readonly");
        let videoStore = videoDBTransaction.objectStore("video");
        let videoRequest = videoStore.getAll();  //Event driven
        videoRequest.onsuccess = (e) => {
            let videoResult = videoRequest.result;
            let galleryCont = document.querySelector(".gallery-cont");
            videoResult.forEach((videoObj) => {
                let mediaElem = document.createElement("div");
                mediaElem.setAttribute("class", "media-cont");
                mediaElem.setAttribute("id", videoObj.id);

                let url = URL.createObjectURL(videoObj.blobData);

                mediaElem.innerHTML = `
                <div class="media">
                    <video autoplay loop src="${url}"></video>
                </div>
                <div class="delete action-btn">DELETE</div>
                <div class="download action-btn">DOWNLOAD</div>
                `;

                galleryCont.appendChild(mediaElem);

                //Listeners
                let deleteBtn = mediaElem.querySelector(".delete");
                deleteBtn.addEventListener("click", deleteListener);
                 let downloadBtn = mediaElem.querySelector(".download");
                 downloadBtn.addEventListener("click", downloadListener);
            })
        }


        let imageDBTransaction = db.transaction("image", "readonly");
        let imageStore = imageDBTransaction.objectStore("image");
        let imageRequest = imageStore.getAll();  //Event driven
        imageRequest.onsuccess = (e) => {
            let imageResult = imageRequest.result;
            let galleryCont = document.querySelector(".gallery-cont");
            imageResult.forEach((imageObj) => {
                let mediaElem = document.createElement("div");
                mediaElem.setAttribute("class", "media-cont");
                mediaElem.setAttribute("id", imageObj.id);

                let url = imageObj.url;

                mediaElem.innerHTML = `
                <div class="media">
                    <img src="${url}" />
                </div>
                <div class="delete action-btn">DELETE</div>
                <div class="download action-btn">DOWNLOAD</div>
                `;

               

                galleryCont.appendChild(mediaElem);
                let deleteBtn = mediaElem.querySelector(".delete");
                deleteBtn.addEventListener("click", deleteListener);
                 let downloadBtn = mediaElem.querySelector(".download");
                 downloadBtn.addEventListener("click", downloadListener);
                
            })
        }

    }
}, 100)


function deleteListener(e){
    let id=e.target.parentElement.getAttribute("id");
    if(id.slice(0,3)==="vid"){
        let videoDBTransaction = db.transaction("video", "readwrite");
        let videoStore = videoDBTransaction.objectStore("video");
        videoStore.delete(id);
        e.target.parentElement.remove();

    }
    else if(id.slice(0,3)==="img"){
        let imageDBTransaction = db.transaction("image", "readwrite");
        let imageStore = imageDBTransaction.objectStore("image");
        imageStore.delete(id);
        e.target.parentElement.remove();

    }
}

function downloadBtn(e){
    let id=e.target.parentElement.getAttribute("id");
    if(id.slice(0,3)==="vid"){
        let videoDBTransaction = db.transaction("video", "readwrite");
        let videoStore = videoDBTransaction.objectStore("video");
        let videoRequest=videoStore.get(id);
        videoRequest.onsuccess=(e)=>{
            let videoResult=videoRequest.result;
            
        }
    }
    else if(id.slice(0,3)==="img"){
        let imageDBTransaction = db.transaction("image", "readwrite");
        let imageStore = imageDBTransaction.objectStore("image");
       

    }
}