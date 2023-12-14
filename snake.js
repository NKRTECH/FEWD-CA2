window.onload = function() {
    if (performance.navigation.type === 1) {
      // Page is reloaded, redirect to home page
      window.location.href = './index.html';
    }
};

const startbutton = document.getElementById('startbutton');
const proceed = document.getElementById('proceedbutton');

const playerName = document.getElementById('name');
const playerNickname = document.getElementById('nickname');
 // Store the player's name and nickname in an object
 const player = {
  name: '',
  nickname: ''
 };

if (playerName && playerNickname) {
  playerName.addEventListener('input', (e) => {
    player.name = e.target.value;
    console.log(player.name);
    localStorage.setItem('playerName', player.name);
  });

  playerNickname.addEventListener('input', (e) => {
    player.nickname = e.target.value;
    console.log(player.nickname);
    localStorage.setItem('playerNickname', player.nickname);
  });

  proceed.addEventListener('click', (e) => {
    if (player.name.trim() === '' || player.nickname.trim() === '') {
      e.preventDefault();
      alert('Please provide input for both Name and Nickname.');
      return;
    }
  });}


// // Retrieve the player's name and nickname from local storage
const playername = localStorage.getItem('playerName');
const playernickname = localStorage.getItem('playerNickname');


// Clear the stored values from local storage
localStorage.removeItem('playerName');
localStorage.removeItem('playerNickname');

const canvas = document.getElementById('gameCanvas');

if (canvas) {
  const getplayername = document.getElementById('playername');
  getplayername.innerHTML = `USERNAME: ${playername} alias ${playernickname}`;

const ctx = canvas.getContext('2d');

const gridSize = 20;
const tileCount = canvas.width / gridSize;
const gameSound = new Audio("./Original Tetris theme (Tetris Soundtrack).mp3");
const eatingSound = new Audio("./Eating.mp3");
const backgroundSound = new Audio('./Tetris 99 - Main Theme.mp3');

let keyboardActivated = false;


function deactivateKeyboard() {
  document.removeEventListener('keydown', handleInput);
      document.removeEventListener('touchstart', handleInput);
  document.removeEventListener('touchend', handleInput);
  keyboardActivated = false;
  console.log('keyboard deactivated');
}
deactivateKeyboard();
function activateKeyboard() {
  document.addEventListener('keydown', handleInput);
    document.addEventListener('touchstart', handleInput);
    document.addEventListener('touchend', handleInput);
  keyboardActivated = true;
  console.log('keyboard activated');
}

startbutton.addEventListener('click', ()=>{
    gameSound.play();
    gameSound.loop = true;
    startbutton.style.display = 'none';
    startTimer();
    activateKeyboard();
})
let time = 0; // Initialize the time variable
let timerElement = document.getElementById('timer');
let timerInterval;

function startTimer() {
  timerInterval = setInterval(updateTimer, 1000); // Update the timer every second
}

function updateTimer() {
  time++; // Increment the time variable
  timerElement.innerHTML = `Time: ${time}`; // Update the timer element with the new time
}
function stopTimer() {
    clearInterval(timerInterval); // Clear the interval to stop the timer
  }

let score = 0; // Initialize the score variable

// Update the IDs based on the given HTML
let scoreElement = document.getElementById('score');
let gameoverElement = document.getElementById('gameover');

let snake = [
    { x: 10, y: 10 },
];

let apple = { x: 5, y: 5 };

let dx = 0;
let dy = 0;

const winningPhrases = ["You played Well", "Keep up the good work"];
const losingPhrases = ["Go Study, You fool", "Better luck next time! Go Study now."];

// Randomly select a phrase from the winningPhrases or losingPhrases arrays
const getRandomPhrase = (phrases) => phrases[Math.floor(Math.random() * phrases.length)];


function drawSnake() {
    snake.forEach((segment) => {
        ctx.fillStyle = '#333';
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });
}

function drawApple() {
    ctx.fillStyle = 'red';
    ctx.fillRect(apple.x * gridSize, apple.y * gridSize, gridSize, gridSize);

}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    if (head.x === apple.x && head.y === apple.y) {
        generateApple();
        score += 10; // Increase the score by 10 for each consumed apple
        scoreElement.textContent = `Score: ${score}`; // Update the score element with the new score
        gameSound.volume = 0.6;
        eatingSound.play();
        eatingSound.addEventListener('ended', () => {
            gameSound.volume = 1;
        });
    } else {
        snake.pop();
    }
}

let touchStartX;
let touchStartY;

function handleInput(event) {
  const key = event.keyCode;

  if ([37, 65].includes(key) && dx !== 1) { // Left arrow key or A key
    dx = -1;
    dy = 0;
  } else if ([38, 87].includes(key) && dy !== 1) { // Up arrow key or W key
    dx = 0;
    dy = -1;
  } else if ([39, 68].includes(key) && dx !== -1) { // Right arrow key or D key
    dx = 1;
    dy = 0;
  } else if ([40, 83].includes(key) && dy !== -1) { // Down arrow key or S key
    dx = 0;
    dy = 1;
  }

  // Check for touch events
  if (event.type === 'touchstart') {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
  } else if (event.type === 'touchend') {
    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    // Determine the swipe direction based on the change in touch position
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0 && dx !== -1) { // Swipe right
        dx = 1;
        dy = 0;
      } else if (deltaX < 0 && dx !== 1) { // Swipe left
        dx = -1;
        dy = 0;
      }
    } else {
      if (deltaY > 0 && dy !== -1) { // Swipe down
        dx = 0;
        dy = 1;
      } else if (deltaY < 0 && dy !== 1) { // Swipe up
        dx = 0;
        dy = -1;
      }
    }
  }

  // Prevent the default behavior of arrow keys and W, A, S, D keys (scrolling the page)
  if ([37, 38, 39, 40, 65, 87, 68, 83].includes(key) || event.type === 'touchstart' || event.type === 'touchend') {
    event.preventDefault();
  }
}

function generateApple() {
    apple.x = Math.floor(Math.random() * tileCount);
    apple.y = Math.floor(Math.random() * tileCount);


    snake.forEach((segment) => {
        if (segment.x === apple.x && segment.y === apple.y) {
            generateApple();
        }
    });
}

function checkCollision() {
  const head = snake[0];

  if (
    head.x < 0 ||
    head.x >= tileCount ||
    head.y < 0 ||
    head.y >= tileCount ||
    snake.some((segment, index) => index !== 0 && segment.x === head.x && segment.y === head.y)
  ) {
    clearInterval(gameLoop);
    const gameOverPhrase = getRandomPhrase(score === 0 ? losingPhrases : winningPhrases);
    backgroundSound.currentTime = 0;
    backgroundSound.play();
    gameSound.pause();
    gameoverElement.textContent = gameOverPhrase;
    startbutton.style.display = 'none';
    document.getElementById('playagain').style.display = 'block';
    document.getElementById('home').style.display = 'block';
    stopTimer();
    deactivateKeyboard();
  }
}
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawSnake();
    drawApple();

    moveSnake();
    checkCollision();
    
}
generateApple();
let gameLoop = setInterval(drawGame, 200); // Decreased speed to 200 milliseconds
let playagain = document.getElementById('playagain');
playagain.addEventListener('click', () => {
    playagain.style.display = 'none'
    document.getElementById('home').style.display = 'none'
    activateKeyboard();
    // Reset game state
    backgroundSound.pause();
    gameSound.currentTime = 0;
    gameSound.play();
    snake = [{ x: 10, y: 10 }];
    apple = { x: 5, y: 5 };
    dx = 0;
    dy = 0;
    score = 0;
    time = 0;
    startTimer();
    // Reset HTML elements
    scoreElement.textContent = '';
    gameoverElement.textContent = '';
    timerElement.textContent = '';

    // Start the game loop again
    gameLoop = setInterval(drawGame, 200);
});
}
