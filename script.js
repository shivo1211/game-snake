// Get canvas, context, and other DOM elements
const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const gameOverMessage = document.getElementById("gameOverMessage");

// Define initial game variables
let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let direction = "RIGHT";
let score = 0;
const gridSize = 20;

// Function to update the score display
function updateScoreDisplay() {
    scoreDisplay.textContent = `Score: ${score}`;
}

// Function to draw the snake and food
function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    snake.forEach(part => {
        context.fillStyle = "green";
        context.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
    });

    // Draw food
    context.fillStyle = "red";
    context.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

// Function to update the snake's position
function update() {
    // Get the head of the snake
    let head = { ...snake[0] };

    // Update head based on the current direction
    switch (direction) {
        case "UP":
            head.y -= 1;
            break;
        case "DOWN":
            head.y += 1;
            break;
        case "LEFT":
            head.x -= 1;
            break;
        case "RIGHT":
            head.x += 1;
            break;
    }

    // Check if the snake has collided with the wall or itself
    if (head.x < 0 || head.x >= canvas.width / gridSize || head.y < 0 || head.y >= canvas.height / gridSize ||
        snake.some(part => part.x === head.x && part.y === head.y)) {
        endGame();
        return;
    }

    // Add the new head to the snake
    snake.unshift(head);

    // Check if the snake has eaten the food
    if (head.x === food.x && head.y === food.y) {
        // Increase the score
        score += 10; // You can adjust the points value as desired

        // Update the score display
        updateScoreDisplay();

        // Place new food
        placeFood();
    } else {
        // Remove the last part of the snake
        snake.pop();
    }
}

// Function to place food at a random location
function placeFood() {
    food.x = Math.floor(Math.random() * (canvas.width / gridSize));
    food.y = Math.floor(Math.random() * (canvas.height / gridSize));
}

// Function to handle user input
document.addEventListener("keydown", event => {
    switch (event.key) {
        case "ArrowUp":
            if (direction !== "DOWN") direction = "UP";
            break;
        case "ArrowDown":
            if (direction !== "UP") direction = "DOWN";
            break;
        case "ArrowLeft":
            if (direction !== "RIGHT") direction = "LEFT";
            break;
        case "ArrowRight":
            if (direction !== "LEFT") direction = "RIGHT";
            break;
        case "Enter":
            if (gameOverMessage.style.display === "block") {
                restartGame();
            }
            break;
    }
});

// Add touch event handlers
canvas.addEventListener("touchstart", handleTouchStart, false);
canvas.addEventListener("touchmove", handleTouchMove, false);

let xStart = null;
let yStart = null;

// Function to handle touch start
function handleTouchStart(event) {
    const touch = event.touches[0];
    xStart = touch.clientX;
    yStart = touch.clientY;
}

// Function to handle touch move
function handleTouchMove(event) {
    if (!xStart || !yStart) return;

    const touch = event.touches[0];
    const xEnd = touch.clientX;
    const yEnd = touch.clientY;

    const xDiff = xStart - xEnd;
    const yDiff = yStart - yEnd;

    // Determine the swipe direction
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        // Horizontal swipe
        if (xDiff > 0 && direction !== "RIGHT") {
            direction = "LEFT";
        } else if (xDiff < 0 && direction !== "LEFT") {
            direction = "RIGHT";
        }
    } else {
        // Vertical swipe
        if (yDiff > 0 && direction !== "DOWN") {
            direction = "UP";
        } else if yDiff < 0 && direction !== "UP") {
            direction = "DOWN";
        }
    }

    // Reset touch coordinates
    xStart = null;
    yStart = null;
}

// Function to end the game
function endGame() {
    clearInterval(gameInterval);
    gameOverMessage.style.display = "block";
}

// Function to restart the game
function restartGame() {
    snake = [{ x: 10, y: 10 }];
    food = { x: 15, y: 15 };
    direction = "RIGHT";
    score = 0;
    gameOverMessage.style.display = "none";
    updateScoreDisplay();
    gameInterval = setInterval(gameLoop, 200);
}

// Function for the game loop
function gameLoop() {
    update();
    draw();
}

// Start the game
let gameInterval = setInterval(gameLoop, 200);
