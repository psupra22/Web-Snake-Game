const gameContainer = document.getElementById("gameContainer");
const menu = document.getElementById("menu");
const prompt = document.getElementById("prompt");
const score = document.getElementById("score");
const GRID_SIZE = 10;  // 10x10
let SPEED = 350;  // ms per move

let gameStarted = false;
let finalScore = 0;
let game;
const gameState = {
    snake: [0],
    direction: "right",
    foodIndex: null,
    gameOver: false
};

initDOM();
const cells = Array.from(document.querySelectorAll(".cell"));
initGame();
document.addEventListener("keydown", handleKeyPress);



function initDOM() {
    for (let i = 0; i < (GRID_SIZE*GRID_SIZE); i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        gameContainer.appendChild(cell)
    }
}

function initGame() {
    cells[0].classList.add("bodyCell");
    spawnFood();
}

function gameLoop() {
    if (gameState.gameOver) {
        clearInterval(game);
        restartGame();
        return;
    }

    moveSnake();
    renderGame();
}

function handleKeyPress(event) {
    const opposite = {
        up: "down",
        down: "up",
        left: "right",
        right: "left"
    }
    const key = event.key.replace("Arrow", "").toLowerCase();

    if (opposite[key] && (gameState.direction !== opposite[key]))
        gameState.direction = key;
    if (event.key === " " && gameStarted === false) 
        startGame();
    if (event.key === "r" && gameStarted) {
        initGame();
        clearInterval(game);
        game = setInterval(gameLoop, SPEED);
        menu.style.display = "none";
    }
}

function startGame() {
    gameStarted = true;
    menu.style.display = "none";
    game = setInterval(gameLoop, SPEED);
}

function moveSnake() {
    let head = gameState.snake[0];
    let newHead;

    if (gameState.direction === "up") {
        newHead = head - GRID_SIZE;
        if (newHead < 0) {
            gameState.gameOver = true
            return;
        }
    }

    if (gameState.direction === "down") {
        newHead = head + GRID_SIZE;
        if (newHead > (GRID_SIZE * GRID_SIZE - 1)) {
            gameState.gameOver = true;
            return;
        }
    }

    if (gameState.direction === "left") {
        newHead = head - 1;
        if (head % GRID_SIZE === 0) {
            gameState.gameOver = true;
            return;
        }
    }

    if (gameState.direction === "right") {
        newHead = head + 1;
        if (newHead % GRID_SIZE === 0) {
            gameState.gameOver = true;
            return;
        }
    }

    if (gameState.snake.includes(newHead)) {
        gameState.gameOver = true;
        return;
    }

    if (newHead === gameState.foodIndex) {
        gameState.snake.push(gameState.snake[gameState.snake.length-1]);
        if (SPEED > 50){
            SPEED -= 5;
            clearInterval(game);
            game = setInterval(gameLoop, SPEED);
        }

        spawnFood();
        finalScore++;
    }

    gameState.snake.unshift(newHead);
    gameState.snake.pop()
}

function spawnFood() {
    do
        gameState.foodIndex = Math.floor(Math.random() * cells.length);
    while (gameState.snake.includes(gameState.foodIndex));
}

function renderGame() {
    cells.forEach(cell => cell.classList.remove("bodyCell", "food"))
    gameState.snake.forEach(index => cells[index].classList.add("bodyCell"));
    cells[gameState.foodIndex].classList.add("food");
}

function restartGame() {
    menu.style.display = "flex";
    prompt.textContent = "Press R to restart";
    score.textContent = `Score: ${finalScore}`;

    gameState.snake = [0];
    gameState.direction = "right";
    gameState.foodIndex = null;
    gameState.gameOver = false;
    finalScore = 0;
    SPEED = 350;

    cells.forEach(cell => cell.classList.remove("bodyCell", "food"));
}