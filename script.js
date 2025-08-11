// Simple 2D "Lion's Jungle Run" game
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const CANVAS_W = canvas.width;
const CANVAS_H = canvas.height;

let lion = { x: 60, y: CANVAS_H/2 - 30, w: 60, h: 60, speed: 6, color: '#f0c419' };
let meats = [];
let obstacles = [];
let score = 0;
let gameOver = false;
let spawnTimers = { meat: 0, obstacle: 0 };

const scoreEl = document.getElementById('score');
const restartBtn = document.getElementById('restartBtn');

function resetGame(){
  meats = [];
  obstacles = [];
  score = 0;
  gameOver = false;
  lion.y = CANVAS_H/2 - lion.h/2;
  scoreEl.textContent = 'Score: 0';
  restartBtn.hidden = true;
}

function drawRect(obj){
  ctx.fillStyle = obj.color || 'white';
  ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
}

function spawnMeat(){
  meats.push({
    x: CANVAS_W + 20,
    y: Math.random() * (CANVAS_H - 30),
    w: 28,
    h: 28,
    vx: 4,
    color: '#d64545'
  });
}

function spawnObstacle(){
  obstacles.push({
    x: CANVAS_W + 20,
    y: Math.random() * (CANVAS_H - 50),
    w: 48,
    h: 48,
    vx: 6,
    color: '#6b3f26'
  });
}

function updateEntities(){
  // meats
  for(let i = meats.length-1; i >= 0; i--){
    meats[i].x -= meats[i].vx;
    if(meats[i].x + meats[i].w < 0) meats.splice(i,1);
    // collision
    if(rectIntersect(lion, meats[i])){
      score += 10;
      scoreEl.textContent = 'Score: ' + score;
      meats.splice(i,1);
    }
  }
  // obstacles
  for(let i = obstacles.length-1; i >= 0; i--){
    obstacles[i].x -= obstacles[i].vx;
    if(obstacles[i].x + obstacles[i].w < 0) obstacles.splice(i,1);
    if(rectIntersect(lion, obstacles[i])){
      gameOver = true;
      restartBtn.hidden = false;
    }
  }
}

function rectIntersect(a,b){
  return a.x < b.x + b.w &&
         a.x + a.w > b.x &&
         a.y < b.y + b.h &&
         a.y + a.h > b.y;
}

function drawBackground(){
  // subtle gradient sky - already canvas background but add some grass lines
  ctx.fillStyle = 'rgba(0,0,0,0.04)';
  for(let i=0;i<8;i++){
    ctx.fillRect(0, CANVAS_H - 20 + i*2, CANVAS_W, 1);
  }
}

function drawLion(){
  // body (simple stylized lion)
  ctx.fillStyle = lion.color;
  ctx.fillRect(lion.x, lion.y, lion.w, lion.h); // body square
  // mane (circle)
  ctx.beginPath();
  ctx.fillStyle = '#c38f1c';
  ctx.arc(lion.x + 15, lion.y + 15, 34, 0, Math.PI*2);
  ctx.fill();
  // eye
  ctx.fillStyle = '#111';
  ctx.fillRect(lion.x + 40, lion.y + 18, 6, 6);
}

function gameLoop(){
  if(!gameOver){
    ctx.clearRect(0,0,CANVAS_W,CANVAS_H);
    drawBackground();

    // draw entities
    drawLion();
    meats.forEach(m => drawRect({x:m.x,y:m.y,w:m.w,h:m.h,color:m.color}));
    obstacles.forEach(o => drawRect({x:o.x,y:o.y,w:o.w,h:o.h,color:o.color}));

    updateEntities();

    // spawn logic
    spawnTimers.meat += 1;
    spawnTimers.obstacle += 1;
    if(spawnTimers.meat > 110){
      spawnMeat(); spawnTimers.meat = 0;
    }
    if(spawnTimers.obstacle > 160){
      spawnObstacle(); spawnTimers.obstacle = 0;
    }
  } else {
    // show game over text
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0,0,CANVAS_W,CANVAS_H);
    ctx.fillStyle = '#fff';
    ctx.font = '32px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', CANVAS_W/2, CANVAS_H/2 - 10);
    ctx.font = '20px sans-serif';
    ctx.fillText('Final Score: ' + score, CANVAS_W/2, CANVAS_H/2 + 24);
  }

  requestAnimationFrame(gameLoop);
}

// controls
document.addEventListener('keydown', (e) => {
  if(gameOver) return;
  if(e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W'){
    lion.y = Math.max(0, lion.y - lion.speed * 2);
  }
  if(e.key === 'ArrowDown' || e.key === 's' || e.key === 'S'){
    lion.y = Math.min(CANVAS_H - lion.h, lion.y + lion.speed * 2);
  }
});

// touch support (simple)
let touchStartY = null;
canvas.addEventListener('touchstart', (e) => {
  touchStartY = e.touches[0].clientY;
});
canvas.addEventListener('touchmove', (e) => {
  if(touchStartY === null) return;
  const delta = e.touches[0].clientY - touchStartY;
  lion.y = Math.min(Math.max(0, lion.y + delta * 0.1), CANVAS_H - lion.h);
  touchStartY = e.touches[0].clientY;
});
canvas.addEventListener('touchend', () => touchStartY = null);

restartBtn.addEventListener('click', () => resetGame());

resetGame();
requestAnimationFrame(gameLoop);
