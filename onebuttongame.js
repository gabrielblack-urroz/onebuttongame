// --------------------------------------------------
// VARIABLES
// --------------------------------------------------
let circleX, circleY;
let circleSize = 40;

let squareX, squareY;
let squareW = 120;
let squareH = 20;

let jumpSpeed = 0;
let gravity = 1.1;
let jumping = false;

let level = 1;
let score = 0;

let gameState = "start";
let bgColor;

// --------------------------------------------------
// SETUP
// --------------------------------------------------
function setup() {
  createCanvas(600, 400);

  circleX = width / 2;
  circleY = height - 100;

  squareX = width / 2;
  squareY = height - 50;

  bgColor = color(30);

  textAlign(CENTER, CENTER);
  textSize(32);
}

// --------------------------------------------------
// DRAW
// --------------------------------------------------
function draw() {
  background(bgColor);

  if (gameState === "start") {
    fill(255);
    text("Click to Start", width/2, height/2);
  }

  else if (gameState === "playing") {
    updateSquare();
    updateCircle();
    checkLanding();
    drawObjects();
  }

  else if (gameState === "gameOver") {
    fill(255, 0, 0);
    text("GAME OVER", width/2, height/2 - 30);
    textSize(20);
    text("Final Score: " + score, width/2, height/2 + 10);
    text("Refresh to Restart", width/2, height/2 + 40);
  }
}

// --------------------------------------------------
// INPUT — CLICK TO JUMP + TELEPORT PLATFORM
// --------------------------------------------------
function mousePressed() {
  if (gameState === "start") {
    gameState = "playing";
    return;
  }

  if (gameState === "playing" && !jumping) {
    jumping = true;
    jumpSpeed = -25; // HIGH jump

    // ---- TELEPORT THAT INCREASES WITH LEVEL ----
    let teleportDist = 40 + level * 12;  
    let angle = random(TWO_PI);

    let dx = teleportDist * cos(angle);
    let dy = teleportDist * sin(angle);

    squareX += dx;
    squareY += dy;

    // keep square in visible area
    squareX = constrain(squareX, 0, width - squareW);
    squareY = constrain(squareY, 100, height - 50);
  }
}

// --------------------------------------------------
// SQUARE MOVES WITH CURSOR (HORIZONTALLY ONLY)
// --------------------------------------------------
function updateSquare() {
  squareX = mouseX - squareW / 2;  // follow cursor horizontally
  squareX = constrain(squareX, 0, width - squareW); // keep in bounds
}

// --------------------------------------------------
// REALISTIC JUMP + FALL
// --------------------------------------------------
function updateCircle() {
  if (jumping) {
    circleY += jumpSpeed;
    jumpSpeed += gravity;
  }

  if (circleY > height - 100) {
    circleY = height - 100;
    jumping = false;
  }
}

// --------------------------------------------------
// LANDING CHECK
// --------------------------------------------------
function checkLanding() {
  // landed on square
  if (!jumping &&
      circleY >= squareY - circleSize/2 &&
      circleX + circleSize/2 > squareX &&
      circleX - circleSize/2 < squareX + squareW) {

    level++;
    score++;

    squareW *= 0.96; // gets harder
    bgColor = color(random(255), random(255), random(255));
  }

  // hit ground but missed square
  if (!jumping && circleY === height - 100) {
    if (!(circleX + circleSize/2 > squareX &&
          circleX - circleSize/2 < squareX + squareW)) {
      gameState = "gameOver";
    }
  }
}

// --------------------------------------------------
// DRAW ALL OBJECTS
// --------------------------------------------------
function drawObjects() {

  // platform
  fill(0, 200, 255);
  rect(squareX, squareY, squareW, squareH);

  // circle
  fill(255, 200, 0);
  ellipse(circleX, circleY, circleSize);

  // HUD
  fill(255);
  textSize(20);
  text("Level: " + level, 70, 20);
  text("Score: " + score, 70, 45);
}
