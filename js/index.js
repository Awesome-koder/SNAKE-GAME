if (window.innerWidth < 1024) {
    alert('Please, visit from desktop!');
}

// Game Constants & Variables
let inputDir = { x: 0, y: 0 }; // Direction of the snake
const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const moveSound = new Audio('music/move.mp3');
const musicSound = new Audio('music/music.mp3');
let speed = 4; // Game speed
let score = 0; // Current score
let lastPaintTime = 0; // Time of the last frame
let snakeArr = [{ x: 13, y: 15 }]; // Initial snake position
let isPaused = false; // Pause state
let gameLoop; // Game loop reference

musicSound.play(); // Play background music

// Food position
let food = { x: 6, y: 7 };

// High score
let hiscoreval = localStorage.getItem("hiscore") ? JSON.parse(localStorage.getItem("hiscore")) : 0;
hiscoreBox.innerHTML = "HiScore: " + hiscoreval;

// Function to toggle pause state
function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
        clearInterval(gameLoop); // Stop the game loop
        musicSound.pause(); // Pause background music
        document.getElementById("pauseButton").textContent = "Resume";
    } else {
        gameLoop = setInterval(main, 1000 / speed); // Resume the game loop
        musicSound.play(); // Resume background music
        document.getElementById("pauseButton").textContent = "Pause";
    }
}

// Event listener for the pause button
document.getElementById("pauseButton").addEventListener("click", togglePause);

// Event listener for keyboard input
window.addEventListener('keydown', (e) => {
    if (e.code === "Space") {
        togglePause(); // Pause/resume on spacebar
    } else if (!isPaused && (e.code === "ArrowUp" || e.code === "ArrowDown" || e.code === "ArrowLeft" || e.code === "ArrowRight")) {
        // Only allow arrow keys to change direction when not paused
        moveSound.play(); // Play move sound
        switch (e.code) {
            case "ArrowUp":
                if (inputDir.y === 0) { // Prevent reversing direction
                    inputDir.x = 0;
                    inputDir.y = -1;
                }
                break;

            case "ArrowDown":
                if (inputDir.y === 0) { // Prevent reversing direction
                    inputDir.x = 0;
                    inputDir.y = 1;
                }
                break;

            case "ArrowLeft":
                if (inputDir.x === 0) { // Prevent reversing direction
                    inputDir.x = -1;
                    inputDir.y = 0;
                }
                break;

            case "ArrowRight":
                if (inputDir.x === 0) { // Prevent reversing direction
                    inputDir.x = 1;
                    inputDir.y = 0;
                }
                break;

            default:
                break;
        }
    }
});

// Main game function
function main(ctime) {
    if (isPaused) return; // Do nothing if the game is paused

    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

// Function to check collision
function isCollide(snake) {
    // If snake bumps into itself
    for (let i = 1; i < snakeArr.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    // If snake bumps into the wall
    if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) {
        return true;
    }
    return false;
}

// Game engine function
function gameEngine() {
    // Part 1: Updating the snake array & Food
    if (isCollide(snakeArr)) {
        gameOverSound.play();
        musicSound.pause();
        inputDir = { x: 0, y: 0 };
        alert("Game Over. Press any key to play again!");
        snakeArr = [{ x: 13, y: 15 }];
        musicSound.play();
        score = 0;
        scoreBox.innerHTML = "Score: " + score;
    }

    // If snake eats the food, increment the score and regenerate the food
    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        foodSound.play();
        score += 1;
        if (score > hiscoreval) {
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
        }
        scoreBox.innerHTML = "Score: " + score;
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
        let a = 2;
        let b = 16;
        food = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };
    }

    // Moving the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Part 2: Display the snake and Food
    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;

        if (index === 0) {
            snakeElement.classList.add('head');
        } else {
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);
    });

    // Display the food
    foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

// Start the game loop
gameLoop = setInterval(main, 1000 / speed);
