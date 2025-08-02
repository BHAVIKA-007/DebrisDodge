const spaceship = document.querySelector("#spaceship");
const game = document.querySelector("#game");
const moveSound = document.getElementById("moveSound");
const gameOverSound = document.getElementById("gameOverSound");

let score=0;

//detecting the level from the url
const urlParams = new URLSearchParams(window.location.search);
const level = urlParams.get('level'); // will be 'easy', 'medium', or 'hard'


const debrisImages = [
  "debris1.webp",
  "debris2.webp",
  "debris3.jpg",
  "fireball.webp"
];

//finding spaceships original position
let left = window.getComputedStyle(spaceship).getPropertyValue("left");
let leftInt = parseInt(left);
let leftPercent = (leftInt / window.innerWidth) * 100;

//function that detects collision based on spaceships and debris location
function isColliding(obj1, obj2) {
  const rect1 = obj1.getBoundingClientRect();
  const rect2 = obj2.getBoundingClientRect();
  return !(
    rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom
  );
}

//deciding the initial number, min and maxspeed of debris as per level
let num, minSpeed, maxSpeed;
if (level === 'easy') {
  num = 3;
  minSpeed = 80;
  maxSpeed = 150;
} else if (level === 'medium') {
  num = 5;
  minSpeed = 50;
  maxSpeed = 120;
} else if (level === 'hard') {
  num = 8;
  minSpeed = 20;
  maxSpeed = 100;
}



let debrisList = [];//stores the present debris on screen

//function to create debris using setinterval, remove if reaches bottom and increment score,check if collides
function createDebris(speed) {
  const deb = document.createElement("img");
  const randomIndex = Math.floor(Math.random() * debrisImages.length);//selecting random debris
  deb.src = debrisImages[randomIndex];

  deb.classList.add("debris");
  deb.style.position = "absolute";
  deb.style.top = "0px";
  deb.style.left = `${Math.random() * 90}%`;
  deb.style.width = "50px";
  deb.style.height = "auto";

  game.appendChild(deb);
  debrisList.push(deb);

  let topNumber = 0;

  const st = setInterval(() => {
    topNumber += 10;
    deb.style.top = `${topNumber}px`;

    if (isColliding(spaceship, deb)) {
  clearInterval(st);
   gameOverSound.currentTime = 0;
  gameOverSound.play();
    setTimeout(() => {
    window.location.href = `result.html?level=${level}&score=${score}`;
  }, 1500); // 1.5 seconds delay so that we hear sound
}


    if (topNumber > window.innerHeight) {
      score++;
      clearInterval(st);
      deb.remove();
    }
  }, speed);
}

let debrisInterval = 2000; // initial delay between debris
let spawnRate = 1; // how many debris to fall per interval
setInterval(() => {
  for (let i = 0; i < spawnRate; i++) {
    let speed = Math.floor(Math.random() * (maxSpeed - minSpeed)) + minSpeed;
    createDebris(speed);
  }
  // Optionally increase difficulty over time
  if (spawnRate < 10) spawnRate++; // increase number of debris gradually
  if (debrisInterval > 500) debrisInterval -= 50; // decrease interval for faster spawns
}, debrisInterval);


//event listener to move spaceship 
window.addEventListener("keydown", (evt) => {
  if (evt.key === "ArrowLeft") {
    leftPercent = Math.max(0, leftPercent - 5);
    spaceship.style.left = `${leftPercent}%`;
    moveSound.currentTime = 0; // rewind
    moveSound.play();
  } else if (evt.key === "ArrowRight") {
    leftPercent = Math.min(95, leftPercent + 5);
    spaceship.style.left = `${leftPercent}%`;
    moveSound.currentTime = 0; // rewind
    moveSound.play();
  }
});
