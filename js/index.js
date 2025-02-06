if (window.innerWidth < 1024) {
    alert('Please, visit from desktop!');
}

// Game Constants & Variables
let inputDir = { x: 0, y: 0 };
const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const moveSound = new Audio('music/move.mp3');
const musicSound = new Audio('music/music.mp3');
let speed = 4;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }];
let isPaused = false;
let gameLoop;
let food = { x: 6, y: 7 };

// Initialize High Score
let hiscoreval = localStorage.getItem("hiscore") || 0;
hiscoreBox.innerHTML = `HiScore: ${hiscoreval}`;

// Game Functions
function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
        clearInterval(gameLoop);
        musicSound.pause();
        document.getElementById("pauseButton").textContent = "Resume";
    } else {
        gameLoop = setInterval(main, 1000/speed);
        musicSound.play();
        document.getElementById("pauseButton").textContent = "Pause";
    }
}

document.getElementById("pauseButton").addEventListener("click", togglePause);

window.addEventListener('keydown', (e) => {
    if (e.code === "Space") {
        togglePause();
        return;
    }
    
    if (!isPaused) {
        const newDir = { x: 0, y: 0 };
        switch(e.key) {
            case "ArrowUp":
                if (inputDir.y !== 0) return;
                newDir.x = 0;
                newDir.y = -1;
                break;
            case "ArrowDown":
                if (inputDir.y !== 0) return;
                newDir.x = 0;
                newDir.y = 1;
                break;
            case "ArrowLeft":
                if (inputDir.x !== 0) return;
                newDir.x = -1;
                newDir.y = 0;
                break;
            case "ArrowRight":
                if (inputDir.x !== 0) return;
                newDir.x = 1;
                newDir.y = 0;
                break;
            default:
                return;
        }
        moveSound.play();
        inputDir = newDir;
    }
});

function main(ctime) {
    if (isPaused) return;
    
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime)/1000 < 1/speed) return;
    
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake) {
    // Self collision check
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    // Wall collision check
    return snake[0].x <= 0 || snake[0].x > 18 || snake[0].y <= 0 || snake[0].y > 18;
}

function gameEngine() {
    // Collision handling
    if (isCollide(snakeArr)) {
        gameOverSound.play();
        musicSound.pause();
        alert("Game Over! Press OK to restart");
        snakeArr = [{ x: 13, y: 15 }];
        inputDir = { x: 0, y: 0 };
        score = 0;
        scoreBox.innerHTML = `Score: ${score}`;
        musicSound.play();
    }

    // Food eating
    if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
        foodSound.play();
        score++;
        snakeArr.unshift({ 
            x: snakeArr[0].x + inputDir.x, 
            y: snakeArr[0].y + inputDir.y 
        });
        food = {
            x: Math.floor(Math.random() * 17) + 2,
            y: Math.floor(Math.random() * 17) + 2
        };
        scoreBox.innerHTML = `Score: ${score}`;
        
        if (score > hiscoreval) {
            hiscoreval = score;
            localStorage.setItem("hiscore", hiscoreval);
            hiscoreBox.innerHTML = `HiScore: ${hiscoreval}`;
        }
    } else {
        // Regular movement
        for (let i = snakeArr.length - 2; i >= 0; i--) {
            snakeArr[i + 1] = { ...snakeArr[i] };
        }
        snakeArr[0].x += inputDir.x;
        snakeArr[0].y += inputDir.y;
    }

    // Render elements
    board.innerHTML = '';
    snakeArr.forEach((e, index) => {
        const element = document.createElement('div');
        element.style.gridColumnStart = e.x;
        element.style.gridRowStart = e.y;
        element.classList.add(index === 0 ? 'head' : 'snake');
        board.appendChild(element);
    });

    const foodElement = document.createElement('div');
    foodElement.style.gridColumnStart = food.x;
    foodElement.style.gridRowStart = food.y;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

// Start game
musicSound.play();
gameLoop = setInterval(main, 1000/speed);
