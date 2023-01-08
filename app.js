const toggleCheckBox = document.getElementsByTagName('input')[0]
const grid = document.querySelector('.grid')
const user = document.createElement('div')
const ball = document.createElement('div')
const comment = document.querySelector('.comment')
// constants

let blockGap = 10;
let noOfBlocksPerLine = 10
let currentBallSpeedX = 5
let currentBallSpeedY = 5
let usingMouse = true;
let ballTimerId = null;
let gamePaused = false;
let userSpeed = 15

const blockWidth = Math.floor((grid.clientWidth - (blockGap * noOfBlocksPerLine + 1) - 10) / noOfBlocksPerLine);
const blockHeight = Math.floor(grid.clientHeight / 16);

const userStartPosition = [grid.clientWidth / 2 - blockWidth / 2, grid.clientHeight - blockHeight - 10]
let currentUserPosition = userStartPosition;

const ballStartPosition = [Math.floor(Math.random() * grid.clientWidth), grid.clientHeight - 3 * blockHeight]
console.log(ballStartPosition);
let currentBallPosition = ballStartPosition;
class Block {
    constructor(xAxis, yAxis) {
        this.xAxis = xAxis;
        this.yAxis = yAxis;
        this.bottomLeft = [xAxis, yAxis + blockHeight];
        this.bottomRight = [xAxis + blockWidth, yAxis + blockHeight]
        this.topLeft = [xAxis, yAxis]
        this.topRight = [xAxis + blockWidth, yAxis]
    }
}


const blocks = [
    new Block(blockGap, blockGap),
    new Block(2 * blockGap + blockWidth, blockGap),
    new Block(3 * blockGap + 2 * blockWidth, blockGap),
    new Block(4 * blockGap + 3 * blockWidth, blockGap),
    new Block(5 * blockGap + 4 * blockWidth, blockGap),
    new Block(6 * blockGap + 5 * blockWidth, blockGap),
    new Block(7 * blockGap + 6 * blockWidth, blockGap),
    new Block(8 * blockGap + 7 * blockWidth, blockGap),
    new Block(9 * blockGap + 8 * blockWidth, blockGap),
    new Block(10 * blockGap + 9 * blockWidth, blockGap),

    new Block(blockGap, 2 * blockGap + 1 * blockHeight),
    new Block(2 * blockGap + blockWidth, 2 * blockGap + 1 * blockHeight),
    new Block(3 * blockGap + 2 * blockWidth, 2 * blockGap + 1 * blockHeight),
    new Block(4 * blockGap + 3 * blockWidth, 2 * blockGap + 1 * blockHeight),
    new Block(5 * blockGap + 4 * blockWidth, 2 * blockGap + 1 * blockHeight),
    new Block(6 * blockGap + 5 * blockWidth, 2 * blockGap + 1 * blockHeight),
    new Block(7 * blockGap + 6 * blockWidth, 2 * blockGap + 1 * blockHeight),
    new Block(8 * blockGap + 7 * blockWidth, 2 * blockGap + 1 * blockHeight),
    new Block(9 * blockGap + 8 * blockWidth, 2 * blockGap + 1 * blockHeight),
    new Block(10 * blockGap + 9 * blockWidth, 2 * blockGap + 1 * blockHeight),

    new Block(blockGap, 3 * blockGap + 2 * blockHeight),
    new Block(2 * blockGap + blockWidth, 3 * blockGap + 2 * blockHeight),
    new Block(3 * blockGap + 2 * blockWidth, 3 * blockGap + 2 * blockHeight),
    new Block(4 * blockGap + 3 * blockWidth, 3 * blockGap + 2 * blockHeight),
    new Block(5 * blockGap + 4 * blockWidth, 3 * blockGap + 2 * blockHeight),
    new Block(6 * blockGap + 5 * blockWidth, 3 * blockGap + 2 * blockHeight),
    new Block(7 * blockGap + 6 * blockWidth, 3 * blockGap + 2 * blockHeight),
    new Block(8 * blockGap + 7 * blockWidth, 3 * blockGap + 2 * blockHeight),
    new Block(9 * blockGap + 8 * blockWidth, 3 * blockGap + 2 * blockHeight),
    new Block(10 * blockGap + 9 * blockWidth, 3 * blockGap + 2 * blockHeight),
]

// create block and draw. 
function addBlocks() {
    for (let i = 0; i < blocks.length; i++) {
        const block = document.createElement('div')
        block.classList.add('block');
        block.style.width = blockWidth + 'px'
        block.style.height = blockHeight + 'px'
        block.style.left = blocks[i].xAxis + 'px';
        block.style.top = blocks[i].yAxis + 'px';
        grid.appendChild(block);
    }
}

function drawUser() {
    user.style.left = currentUserPosition[0] + 'px';
    user.style.top = currentUserPosition[1] + 'px';
}

function drawBall() {
    ball.style.left = currentBallPosition[0] + 'px';
    ball.style.top = currentBallPosition[1] + 'px';
}


function moveUser(e) {
    if (usingMouse && !gamePaused) {

        if (e.clientX - grid.getClientRects()[0]['x'] >= 0 && e.clientX - grid.getClientRects()[0]['x'] <= grid.clientWidth - blockWidth) {
            currentUserPosition[0] = e.clientX - grid.getClientRects()[0]['x'];
            drawUser();
        }
    } else if (!usingMouse && !gamePaused) {
        switch (e.key) {
            case 'ArrowLeft':
                if (currentUserPosition[0] > 10) {
                    currentUserPosition[0] -= userSpeed;
                    drawUser();
                }
                break;
            case 'ArrowRight':
                if (currentUserPosition[0] + blockWidth + 10 < grid.clientWidth) {
                    currentUserPosition[0] += userSpeed;
                    drawUser();
                }
                break;
        }
    }
}

function moveBall() {
    if (!gamePaused) {
        currentBallPosition[0] += currentBallSpeedX;
        currentBallPosition[1] -= currentBallSpeedY;
        drawBall();
        checkForCollisions();
    }
}

function changeBallDirection() {
    if (currentBallSpeedX >= 0 && currentBallSpeedY >= 0) {
        currentBallSpeedX = -currentBallSpeedX
        currentBallSpeedY = -currentBallSpeedY
        return
    }
}

function checkForCollisions() {

    // WALL COLLISIONS //
    // right edge
    if (currentBallPosition[0] + ball.clientWidth >= grid.clientWidth) {
        // changeBallDirection()
        currentBallSpeedX = -currentBallSpeedX;
        return
    }
    // left edge
    else if (currentBallPosition[0] <= 0) {
        // changeBallDirection()
        currentBallSpeedX = -currentBallSpeedX;
        return
    }
    // top edge
    else if (currentBallPosition[1] <= 0) {
        // changeBallDirection()
        currentBallSpeedY = -currentBallSpeedY;
        return
    }
    // bottom edge -- you lose here. 
    else if (currentBallPosition[1] + ball.clientHeight >= grid.clientHeight) {
        // changeBallDirection()
        currentBallSpeedY = -currentBallSpeedY;
        clearInterval(ballTimerId)
        if (blocks.length > 10) {
            comment.innerHTML = 'You lose...that too badly'
        } else {
            comment.innerHTML = 'You lose...But A for effort...'
        }
        document.removeEventListener('keydown', moveUser)
        document.removeEventListener('mousemove', moveUser)
        return
    }

    // USER COLLISION
    // left side
    if ((currentBallPosition[0] + ball.clientWidth >= currentUserPosition[0] &&
        currentBallPosition[0] + ball.clientWidth <= currentUserPosition[0] + blockWidth &&
        currentBallPosition[0] < currentUserPosition[0] &&
        currentBallPosition[1] + ball.clientHeight >= currentUserPosition[1])) {
        currentBallSpeedX = -currentBallSpeedX;
        currentBallSpeedY = -currentBallSpeedY
    }
    // center
    if (currentBallPosition[0] >= currentUserPosition[0] &&
        currentBallPosition[0] + ball.clientWidth <= currentUserPosition[0] + blockWidth &&
        currentBallPosition[1] + ball.clientHeight >= currentUserPosition[1]) {
        currentBallSpeedY = -currentBallSpeedY
        }
    // right side
    if ((currentBallPosition[0] <= currentUserPosition[0] + blockWidth &&
        currentBallPosition[0] > currentUserPosition[0] &&
        currentBallPosition[0] + ball.clientWidth > currentUserPosition[0] + blockWidth &&
        currentBallPosition[1] + ball.clientHeight >= currentUserPosition[1])) {
        currentBallSpeedX = -currentBallSpeedX;
        currentBallSpeedY = -currentBallSpeedY
    }

    // check collision with all blocks
    for (let i = 0; i < blocks.length; i++) {
        if (((currentBallPosition[0] > blocks[i].bottomLeft[0] && currentBallPosition[0] < blocks[i].bottomRight[0])
            && (currentBallPosition[1] < blocks[i].bottomLeft[1])) ||
            ((currentBallPosition[0] > blocks[i].bottomLeft[0] && currentBallPosition[0] < blocks[i].bottomRight[0])
            && (currentBallPosition[1] + ball.clientHeight < blocks[i].topLeft[1]))) {
            const allBlocks = Array.from(document.querySelectorAll('.block'))
            allBlocks[i].classList.remove('block')
            blocks.splice(i, 1)
            currentBallSpeedY = -currentBallSpeedY
            console.log('hi');
        }
    }
}

function main() {

    addBlocks();

    // Add user
    user.style.width = blockWidth + 'px'
    user.style.height = blockHeight + 'px'
    user.classList.add('user')
    drawUser();
    grid.appendChild(user);

    // Add ball
    ball.classList.add('ball')
    drawBall();
    grid.appendChild(ball)

    ballTimerId = setInterval(moveBall, 30)
    document.addEventListener('keydown', moveUser)
    document.addEventListener('mousemove', moveUser)
    toggleCheckBox.addEventListener('change', () => {
        if (toggleCheckBox.checked) {
            usingMouse = false;
        } else {
            usingMouse = true;
        }
        console.log(usingMouse);
    })
    document.addEventListener('keypress', (e) => {
        if (e.key == ' ' && gamePaused == false) {
            gamePaused = true;
        } else if (e.key == ' ' && gamePaused == true) {
            gamePaused = false;
        }
    })
}

main();