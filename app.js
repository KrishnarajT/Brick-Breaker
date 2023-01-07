
const grid = document.querySelector('.grid')
const blockWidth = 100;
const blockHeight = 20;
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
    new Block(10, 10)
]

// create block and draw. 
function addBlocks() {
    for (let i = 0; i < blocks.length; i++) {
        const block = document.createElement('div')
        block.classList.add('block');
        block.style.left = blocks[i].xAxis + 'px';
        block.style.top = blocks[i].yAxis + 'px';
        grid.appendChild(block);
    }
}

addBlocks();