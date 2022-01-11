// Canvas Setup
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;

let score = 0;
let gameFrame = 0;
ctx.font = '50px Georgia'

// Mouse Interactivity
let canvasPosition = canvas.getBoundingClientRect();

const mouse = {
  x: canvas.width/2,
  y: canvas.height/2,
  click: false
}

canvas.addEventListener('mousedown', function(event){
  mouse.click = true;
  mouse.x = event.x - canvasPosition.left;
  mouse.y = event.y - canvasPosition.top;

  console.log(mouse.x, mouse.y)
})

canvas.addEventListener('mouseup', function(){
  mouse.click = false;
})

// Player
class Player {
  constructor(){
    this.x = 0;
    this.y = canvas.height/2;
    this.radius = 50;
    this.angle = 0;
    this.frameX = 0;
    this.frameY = 0;
    this.frame = 0
    this.spriteWidth = 498;
    this.spriteWidth = 327;
  }

  update(){
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;
    if (mouse.x != this.x){
      this.x -= dx/30 ;
    }
    if (mouse.y != this.y){
      this.y -= dy/30;
    }
  }

  draw(){
    if (mouse.click) {
      ctx.lineWidth = 0.2;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.stroke();
    }
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }
}

const player = new Player();

// Food Items

const foodItems = [];

class Food {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + Math.random() * canvas.height;
    this.radius = 50;
    this.speed = Math.random() * 5 + 1;
    this.distance;
    this.counted = false;
    this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound2';
  }

  update(){
    this.y -= this.speed;
    const dx = this.x - player.x;
    const dy = this.y - player.y;
    this.distance = Math.sqrt(dx*dx + dy*dy);
  }

  draw(){
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
  }
}

const foodCrunch1 = document.createElement('audio');
foodCrunch1.src = 'media/crunch.3.ogg'
const foodCrunch2 = document.createElement('audio');
foodCrunch2.src = 'media/crunch.7.ogg'

function handleFoodItems(){
  if (gameFrame % 50 == 0){
    foodItems.push(new Food());
  }
  for (let i = 0; i < foodItems.length; i++){
    foodItems[i].update();
    foodItems[i].draw();
  }
  for (let i = 0; i < foodItems.length; i++){
    if (foodItems[i].y < -50){
      foodItems.splice(i, 1);
    }
    if (foodItems[i].distance < foodItems[i].radius + player.radius){
      if (!foodItems[i].counted){
        if (foodItems[i].sound == 'sound1'){
          foodCrunch1.play();
        } else {
          foodCrunch2.play();
        }
        score++;
        foodItems[i].counted = true;
        foodItems.splice(i, 1);
      }
    }
  }
}

// Animation Loop

function animate(){
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  handleFoodItems();
  player.update();
  player.draw();
  ctx.fillStyle = 'black';
  ctx.fillText('score: ' + score, 10, 50);
  gameFrame++;
  requestAnimationFrame(animate);
}

animate();
