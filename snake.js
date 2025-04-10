// Game settings
const boardSize = 400;
const gridSize = 20;
const initialSpeed = 150;

// Game variables
let snake = [];
let food = {};
let direction = 'right';
let nextDirection = 'right';
let gameInterval;
let score = 0;
let gameRunning = false;

// DOM elements
const gameBoard = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
const gameOverScreen = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');

// Initialize the game
function initGame() {
    // Clear previous game state
    clearInterval(gameInterval);
    gameBoard.innerHTML = '';
    snake = [];
    score = 0;
    scoreElement.textContent = score;
    gameOverScreen.style.display = 'none';
    
    // Create initial snake (3 parts)
    const initialX = Math.floor((boardSize / gridSize) / 2) * gridSize;
    const initialY = Math.floor((boardSize / gridSize) / 2) * gridSize;
    
    for (let i = 0; i < 3; i++) {
        snake.push({
            x: initialX - (i * gridSize),
            y: initialY
        });
    }
    
    // Set direction
    direction = 'right';
    nextDirection = 'right';
    
    // Create food
    createFood();
    
    // Render initial state
    render();
    
    // Start game loop
    gameRunning = true;
    gameInterval = setInterval(gameLoop, initialSpeed);
}

// Game loop
function gameLoop() {
    moveSnake();
    checkCollision();
    if (gameRunning) {
        render();
    }
}

// Move the snake
function moveSnake() {
    // Update direction
    direction = nextDirection;
    
    // Calculate new head position
    const head = Object.assign({}, snake[0]);
    
    switch (direction) {
        case 'up':
            head.y -= gridSize;
            break;
        case 'right':
            head.x += gridSize;
            break;
        case 'down':
            head.y += gridSize;
            break;
        case 'left':
            head.x -= gridSize;
            break;
    }
    
    // Add new head
    snake.unshift(head);
    
    // Check if snake eats food
    if (head.x === food.x && head.y === food.y) {
        // Increase score
        score++;
        scoreElement.textContent = score;
        
        // Create new food
        createFood();
    } else {
        // Remove tail if no food eaten
        snake.pop();
    }
}

// Check for collisions
function checkCollision() {
    const head = snake[0];
    
    // Check wall collision
    if (
        head.x < 0 || 
        head.x >= boardSize || 
        head.y < 0 || 
        head.y >= boardSize
    ) {
        gameOver();
        return;
    }
    
    // Check self collision (skip the head)
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
            return;
        }
    }
}

// Create food at random position
function createFood() {
    // Generate random position
    let newFood;
    let validPosition = false;
    
    while (!validPosition) {
        newFood = {
            x: Math.floor(Math.random() * (boardSize / gridSize)) * gridSize,
            y: Math.floor(Math.random() * (boardSize / gridSize)) * gridSize
        };
        
        // Check if food is not on snake
        validPosition = true;
        for (const part of snake) {
            if (part.x === newFood.x && part.y === newFood.y) {
                validPosition = false;
                break;
            }
        }
    }
    
    food = newFood;
}

// Render game elements
function render() {
    // Clear board
    gameBoard.innerHTML = '';
    
    // Render snake
    snake.forEach((part, index) => {
        const snakePart = document.createElement('div');
        snakePart.className = 'snake-part';
        if (index === 0) {
            snakePart.classList.add('snake-head');
        }
        snakePart.style.left = part.x + 'px';
        snakePart.style.top = part.y + 'px';
        gameBoard.appendChild(snakePart);
    });
    
    // Render food
    const foodElement = document.createElement('div');
    foodElement.className = 'food';
    foodElement.style.left = food.x + 'px';
    foodElement.style.top = food.y + 'px';
    gameBoard.appendChild(foodElement);
}

// Game over
function gameOver() {
    gameRunning = false;
    clearInterval(gameInterval);
    finalScoreElement.textContent = Score: ${score};
    gameOverScreen.style.display = 'flex';
}

// Handle keyboard controls
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            if (direction !== 'down') nextDirection = 'up';
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            if (direction !== 'left') nextDirection = 'right';
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            if (direction !== 'up') nextDirection = 'down';
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            if (direction !== 'right') nextDirection = 'left';
            break;
    }
});

// Restart button event
restartButton.addEventListener('click', initGame);

// Start the game initially
window.addEventListener('DOMContentLoaded', initGame);
