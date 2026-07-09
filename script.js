/* ======================================
   ❤️ LDR MEMORY BOOTH
   PROFESSIONAL PHOTOBOOTH ENGINE V2
====================================== */


/* ===============================
   ELEMENTS
================================ */

const homeScreen = document.getElementById("homeScreen");
const lobbyScreen = document.getElementById("lobbyScreen");
const boothScreen = document.getElementById("boothScreen");
const memoryScreen = document.getElementById("memoryScreen");


const createRoomBtn = document.getElementById("createRoomBtn");
const joinModeBtn = document.getElementById("joinModeBtn");


const createPanel = document.getElementById("createPanel");
const joinPanel = document.getElementById("joinPanel");


const generateRoomBtn =
document.getElementById("generateRoomBtn");


const joinRoomBtn =
document.getElementById("joinRoomBtn");


const roomCode =
document.getElementById("roomCode");


const copyCodeBtn =
document.getElementById("copyCodeBtn");


const enterBoothBtn =
document.getElementById("enterBoothBtn");



const localVideo =
document.getElementById("localVideo");


const remoteVideo =
document.getElementById("remoteVideo");



const countdown =
document.getElementById("countdown");


const startSessionBtn =
document.getElementById("startSessionBtn");


const captureBtn =
document.getElementById("captureBtn");


const photoCounter =
document.getElementById("photoCounter");



const canvas =
document.getElementById("photoCanvas");


const ctx =
canvas.getContext("2d");



const finalStrip =
document.getElementById("finalStrip");


const stripCtx =
finalStrip.getContext("2d");



const downloadBtn =
document.getElementById("downloadBtn");





/* ===============================
   VARIABLES
================================ */


let currentRoom = "";

let photos = [];

let photoNumber = 0;

let stream = null;

let selectedTheme = "love";

let sessionRunning = false;





/* ===============================
   ROOM SYSTEM
================================ */


createRoomBtn.onclick = ()=>{


createPanel.classList.remove("hidden");

joinPanel.classList.add("hidden");


};





joinModeBtn.onclick = ()=>{


joinPanel.classList.remove("hidden");

createPanel.classList.add("hidden");


};







generateRoomBtn.onclick = ()=>{


const code =
Math.random()
.toString(36)
.substring(2,7)
.toUpperCase();



currentRoom =
"LOVE-" + code;



roomCode.innerText =
currentRoom;



showLobby();


};






joinRoomBtn.onclick = ()=>{


const input =
document.getElementById("inviteInput").value.trim();



if(input.length>3){


currentRoom =
input.toUpperCase();


showLobby();


}

else{


alert(
"Please enter a valid code"
);


}


};







function showLobby(){


homeScreen.classList.add("hidden");

lobbyScreen.classList.remove("hidden");


document.querySelector(".connection-status")
.innerHTML =
"🟢 Couple connected ❤️";


}






copyCodeBtn.onclick = ()=>{


navigator.clipboard.writeText(currentRoom);


copyCodeBtn.innerText =
"Copied ❤️";


};








/* ===============================
   CAMERA
================================ */


enterBoothBtn.onclick = async()=>{


lobbyScreen.classList.add("hidden");

boothScreen.classList.remove("hidden");


await startCamera();


};







async function startCamera(){


try{


stream =
await navigator.mediaDevices.getUserMedia({

video:{
width:1280,
height:720
},

audio:false

});



localVideo.srcObject = stream;


// mirror camera

localVideo.style.transform =
"scaleX(-1)";


}


catch(error){


alert(
"Camera permission denied"
);


}


}








/* ===============================
   THEME
================================ */


document
.querySelectorAll(".theme-selector button")
.forEach(button=>{


button.onclick=()=>{


selectedTheme =
button.dataset.theme;


};


});








/* ===============================
   PHOTO SESSION
================================ */


startSessionBtn.onclick = ()=>{


photos=[];

photoNumber=0;

sessionRunning=true;


captureNext();


};







async function captureNext(){



if(photoNumber>=6){


sessionRunning=false;


generateStrip();


return;


}



photoNumber++;



photoCounter.innerText =
`Photo ${photoNumber} / 6`;



await countdownTimer();



capturePhoto();



setTimeout(()=>{


captureNext();


},2500);



}







function countdownTimer(){


return new Promise(resolve=>{


let number=3;


countdown.innerText =
number;



const timer =
setInterval(()=>{


number--;



if(number===0){


clearInterval(timer);


flashEffect();


countdown.innerText="📸";


setTimeout(()=>{


countdown.innerText="";

resolve();


},500);



}

else{


countdown.innerText =
number;


}



},1000);



});


}








/* ===============================
   FLASH EFFECT
================================ */


function flashEffect(){


const flash =
document.createElement("div");


flash.className="camera-flash";


document.body.appendChild(flash);



setTimeout(()=>{


flash.remove();


},300);



}









/* ===============================
   CAPTURE PHOTO
================================ */


function capturePhoto(){



canvas.width=1000;

canvas.height=600;



// background


ctx.fillStyle="#ffffff";

ctx.fillRect(
0,
0,
canvas.width,
canvas.height
);





// YOUR CAMERA


ctx.save();


ctx.scale(-1,1);



ctx.drawImage(

localVideo,

-500,

0,

500,

600

);



ctx.restore();





// PARTNER AREA
// Ready for WebRTC stream later


if(remoteVideo.srcObject){


ctx.drawImage(

remoteVideo,

500,

0,

500,

600

);


}

else{


ctx.fillStyle="#ffd6e8";


ctx.fillRect(

500,

0,

500,

600

);



ctx.font =
"45px Poppins";


ctx.fillStyle =
"#ff4d8d";


ctx.fillText(

"Partner ❤️",

620,

320

);


}






// DECORATION


ctx.font =
"45px Poppins";


ctx.fillStyle =
"#ff4d8d";


ctx.fillText(

"❤️ LDR MEMORY",

350,

550

);







photos.push(
canvas.toDataURL("image/png")
);



}









// ===============================
// MEMORY STRIP
// ===============================



async function generateStrip(){



boothScreen.classList.add("hidden");

memoryScreen.classList.remove("hidden");



finalStrip.width=600;

finalStrip.height=1600;



stripCtx.fillStyle="white";

stripCtx.fillRect(
0,
0,
600,
1600
);



stripCtx.fillStyle="#ff4d8d";

stripCtx.font=
"60px Poppins";


stripCtx.fillText(

"❤️ LDR",

210,

80

);



let y=140;



for(const photo of photos){


await drawStripPhoto(
photo,
y
);


y+=230;


}





stripCtx.font =
"35px Poppins";


stripCtx.fillText(

"Two places.",
180,

1450

);


stripCtx.fillText(

"One memory ❤️",

120,

1510

);



}








function drawStripPhoto(src,y){


return new Promise(resolve=>{


const img =
new Image();



img.onload=()=>{


stripCtx.drawImage(

img,

75,

y,

450,

200

);



resolve();


};



img.src=src;



});


}








// ===============================
// DOWNLOAD
// ===============================


downloadBtn.onclick=()=>{


const link =
document.createElement("a");


link.download =
"LDR-Memory-Booth.png";


link.href =
finalStrip.toDataURL();


link.click();


};
