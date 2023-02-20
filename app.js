'use strict';

var gameStart = {},
  gameSpeed = {},
  gameArea = {},
  gameAreaContext = {},
  snake = [],
  gameAreaWidth = 0,
  gameAreaHeight = 0,
  cellWidth = 0,
  playerScore = 0,
  snakeFood = {},
  snakeDirection = '',
  speedSize = 0,
  timer = {};

function initElement() {
  gameStart = document.querySelector('#gameStart');
  gameSpeed = document.querySelector('#gameSpeed');
  gameArea = document.querySelector('#gameArea');

  gameAreaContext = gameArea.getContext('2d');
  gameAreaWidth = 400;
  gameAreaHeight = 600;
  cellWidth = 20;
  gameArea.width = gameAreaWidth;
  gameArea.height = gameAreaHeight;
}

function createFood() {
  snakeFood = {
    x: Math.round(Math.random() * (gameAreaWidth - cellWidth) / cellWidth),
    y: Math.round(Math.random() * (gameAreaHeight - cellWidth) / cellWidth),
  };
}

function control(x, y, array) {
  for (var index = 0, length = array.length; index < length; index++) {
    if (array[index].x == x && array[index].y == y) return true;
  }
  return false;
}

function writeScore() {
  gameAreaContext.font = '50px sans-serif';
  gameAreaContext.fillStyle = '#FF0000';
  gameAreaContext.fillText('Score: ' + playerScore, (gameAreaWidth / 2) - 100, gameAreaHeight / 2);
}

function createSquare(x, y) {
  gameAreaContext.fillStyle = '#000000';
  gameAreaContext.fillRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth);
}

function createGameArea() {
  var snakeX = snake[0].x;
  var snakeY = snake[0].y;

  gameAreaContext.fillStyle = '#FFFFFF';
  gameAreaContext.fillRect(0, 0, gameAreaWidth, gameAreaHeight);

  gameAreaContext.strokeStyle = '#000000';
  gameAreaContext.strokeRect(0, 0, gameAreaWidth, gameAreaHeight);

  if (snakeDirection == 'right') {
    snakeX++;
  } else if (snakeDirection == 'left') {
    snakeX--;
  } else if (snakeDirection == 'down') {
    snakeY++;
  } else if (snakeDirection == 'up') {
    snakeY--;
  }

  if ((snakeX == -1) || (snakeX == gameAreaWidth / cellWidth) || (snakeY == -1) || (snakeY == gameAreaHeight / cellWidth) || control(snakeX, snakeY, snake)) {
    writeScore();
    clearInterval(timer);
    gameStart.disabled = false;
    return;
  }

  if (snakeX == snakeFood.x && snakeY == snakeFood.y) {
    var newHead = { x: snakeX, y: snakeY };
    playerScore += speedSize;
    createFood();
  } else {
    var newHead = snake.pop();
    newHead.x = snakeX;
    newHead.y = snakeY;
  }

  snake.unshift(newHead);

  for (var index = 0, length = snake.length; index < length; index++) {
    createSquare(snake[index].x, snake[index].y);
  }

  createSquare(snakeFood.x, snakeFood.y);
}

function startGame() {
  snake = [];
  snake.push({ x: 0, y: cellWidth });

  createFood();

  clearInterval(timer);
  timer = setInterval(createGameArea, 500 / speedSize);
}

function onStartGame() {
  this.disabled = true;

  playerScore = 0;
  snakeDirection = 'right';
  speedSize = parseInt(gameSpeed.value);

  if (speedSize > 9) {
    speedSize = 9;
  } else if (speedSize < 0) {
    speedSize = 1;
  }

  startGame();
}

function changeDirection(e) {
  var keys = e.which;
  if (keys == '40' && snakeDirection != 'up') snakeDirection = 'down';
  else if (keys == '39' && snakeDirection != 'left') snakeDirection = 'right';
  else if (keys == '38' && snakeDirection != 'down') snakeDirection = 'up';
  else if (keys == '37' && snakeDirection != 'right') snakeDirection = 'left';
}

function initEvent() {
  gameStart.addEventListener('click', onStartGame);
  window.addEventListener('keydown', changeDirection);
}

function init() {
  initElement();
  initEvent();
}

window.addEventListener('DOMContentLoaded', init);
