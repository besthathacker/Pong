const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game constants
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 100;
const BALL_RADIUS = 10;
const PADDLE_MARGIN = 20;

// Left paddle (player)
const leftPaddle = {
    x: PADDLE_MARGIN,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    color: '#0f0'
};

// Right paddle (AI)
const rightPaddle = {
    x: canvas.width - PADDLE_MARGIN - PADDLE_WIDTH,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    color: '#f00',
    speed: 4
};

// Ball
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: BALL_RADIUS,
    speed: 6,
    dx: 6 * (Math.random() > 0.5 ? 1 : -1),
    dy: 6 * (Math.random() > 0.5 ? 1 : -1),
    color: '#fff'
};

// Score
let leftScore = 0;
let rightScore = 0;

// Draw paddle
function drawPaddle(paddle) {
    ctx.fillStyle = paddle.color;
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// Draw ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

// Draw center line
function drawCenterLine() {
    ctx.strokeStyle = "#888";
    ctx.setLineDash([10, 15]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

// Draw score
function drawScore() {
    ctx.font = "32px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText(leftScore, canvas.width / 4, 40);
    ctx.fillText(rightScore, canvas.width * 3 / 4, 40);
}

// Mouse movement controls left paddle
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    leftPaddle.y = mouseY - leftPaddle.height / 2;
    // Clamp to canvas
    if (leftPaddle.y < 0) leftPaddle.y = 0;
    if (leftPaddle.y + leftPaddle.height > canvas.height) leftPaddle.y = canvas.height - leftPaddle.height;
});

// Basic AI for right paddle
function moveAIPaddle() {
    const paddleCenter = rightPaddle.y + rightPaddle.height / 2;
    if (ball.y < paddleCenter - 10) {
        rightPaddle.y -= rightPaddle.speed;
    } else if (ball.y > paddleCenter + 10) {
        rightPaddle.y += rightPaddle.speed;
    }
    // Clamp to canvas
    if (rightPaddle.y < 0) rightPaddle.y = 0;
    if (rightPaddle.y + rightPaddle.height > canvas.height) rightPaddle.y = canvas.height - rightPaddle.height;
}

// Reset ball to center
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = ball.speed * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = ball.speed * (Math.random() > 0.5 ? 1 : -1);
}

// Ball and paddle collision detection
function paddleCollision(paddle) {
    return (
        ball.x - ball.radius < paddle.x + paddle.width &&
        ball.x + ball.radius > paddle.x &&
        ball.y + ball.radius > paddle.y &&
        ball.y - ball.radius < paddle.y + paddle.height
    );
}

// Update game state
function update() {
    // Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Top/bottom wall collision
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.dy *= -1;
    }

    // Left paddle collision
    if (paddleCollision(leftPaddle)) {
        ball.dx = Math.abs(ball.dx);
        // Add some "spin" depending on hit location
        let collidePoint = (ball.y - (leftPaddle.y + leftPaddle.height / 2)) / (leftPaddle.height / 2);
        ball.dy = ball.speed * collidePoint;
    }

    // Right paddle collision
    if (paddleCollision(rightPaddle)) {
        ball.dx = -Math.abs(ball.dx);
        let collidePoint = (ball.y - (rightPaddle.y + rightPaddle.height / 2)) / (rightPaddle.height / 2);
        ball.dy = ball.speed * collidePoint;
    }

    // Left wall (AI scores)
    if (ball.x - ball.radius < 0) {
        rightScore++;
        resetBall();
    }

    // Right wall (Player scores)
    if (ball.x + ball.radius > canvas.width) {
        leftScore++;
        resetBall();
    }

    moveAIPaddle();
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCenterLine();
    drawPaddle(leftPaddle);
    drawPaddle(rightPaddle);
    drawBall();
    drawScore();
}

// Main game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();