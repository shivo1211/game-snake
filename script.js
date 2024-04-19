// Constants
const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const gridSize = 20; // Size of each grid cell
let score = 0;
let gameInterval;
const scoreDisplay = document.getElementById('score');
const gameOverMessage = document.getElementById('gameOverMessage');

// Initial snake position
let snake = [{ x: 10, y: 10 }];

// Initial food position
let food = { x: Math.floor(Math.random() * canvas.width / gridSize), y: Math.floor(Math.random() * canvas.height / gridSize) };

// Initial direction
let direction = 'RIGHT';

// Touch event tracking
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

// Start the game
function startGame() {
    gameInterval = setInterval(gameLoop, 200);
}

// Handle touch start
function handleTouchStart(event) {
    const touch = event.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
}

// Handle touch end
function handleTouchEnd(event) {
    const touch = event.changedTouches[0];
    touchEndX = touch.clientX;
    touchEndY = touch.clientY;

    // Calculate the distance and direction of the touch gesture
    const xDiff = touchEndX - touchStartX;
    const yDiff = touchEndY - touchStartY;

    // Determine the direction of the swipe
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        // Horizontal swipe
        if (xDiff > 0 && direction !== 'LEFT') {
            direction = 'RIGHT';
        } else if (xDiff < 0 && direction !== 'RIGHT') {
            direction = 'LEFT';
        }
    } else {
        // Vertical swipe
        if (yDiff > 0 && direction !== 'UP') {
            direction = 'DOWN';
        } else if (yDiff < 0 && direction !== 'DOWN') {
            direction = 'UP';
        }
    }
}

// Handle keydown events
function handleKeyDown(event) {
    const key = event.key;

    if (key === 'ArrowUp' && direction !== 'DOWN') {
        direction = 'UP';
    } else if (key === 'ArrowDown' && direction !== 'UP') {
        direction = 'DOWN';
    } else if (key === 'ArrowLeft' && direction !== 'RIGHT') {
        direction = 'LEFT';
    } else if (key === 'ArrowRight' && direction !== 'LEFT') {
        direction = 'RIGHT';
    }
}

// Draw the game
function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    snake.forEach(part => {
        context.fillStyle = 'green';
        context.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
    });

    // Draw food
    context.fillStyle = 'red';
    context.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

// Update the game
function update() {
    // Get the head of the snake
    let head = { ...snake[0] };

    // Update the head's position based on the direction
    switch (direction) {
        case 'UP':
            head.y -= 1;
            break;
        case 'DOWN':
            head.y += 1;
            break;
        case 'LEFT':
            head.x -= 1;
            break;
        case 'RIGHT':
            head.x += 1;
            break;
    }

    // Check if the snake has collided with the wall or itself
    if (head.x < 0 || head.x >= canvas.width / gridSize || head.y < 0 || head.y >= canvas.height / gridSize ||
        snake.some(part => part.x === head.x && part.y === head.y)) {
        // End the game
        clearInterval(gameInterval);
        gameOverMessage.style.display = 'block';
        return;
    }

    // Add the new head to the snake
    snake.unshift(head);

    // Check if the snake has eaten the food
    if (head.x === food.x && head.y === food.y) {
        // Increase the score
        score += 1;

        // Update the score display
        scoreDisplay.textContent = `Score: ${score}`;

        // Place new food
        food.x = Math.floor(Math.random() * (canvas.width / gridSize));
        food.y = Math.floor(Math.random() * (canvas.height / gridSize));
    } else {
        // Remove the last part of the snake
        snake.pop();
    }
}

// Game loop
function gameLoop() {
    update();
    draw();
}

// Add touch event listeners
canvas.addEventListener('touchstart', handleTouchStart);
canvas.addEventListener('touchend', handleTouchEnd);

// Add keyboard event listener
window.addEventListener('keydown', handleKeyDown);

// Add event listener to restart the game when tapping the game over message
gameOverMessage.addEventListener('click', function () {
    location.reload();
});

// Start the game
startGame();
