import Grid from "./Grid.js";
import Tile from "./Tile.js";

const gameBoard = document.getElementById("game-board");
const grid = new Grid(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);

const setupInput = () => {
    window.addEventListener("keydown", handleInput, { once: true });
};

const handleInput = (e) => {
    switch (e.key) {
        case "ArrowUp":
            moveUp()
            break;
        case "ArrowDown":
            moveDown()
            break;
        case "ArrowLeft":
            moveLeft()
            break;
        case "ArrowRight":
            moveRight()
            break;
        default:
            setupInput();
            break;
    }

    setupInput();
};

const moveUp = () => {
    return slideTiles(grid.cellsByColumn);
};

const slideTiles = (cells) => {
    cells.forEach(group => {
        for (let i = 1; i < group.length; i++) {
            const cell = group[i];
            if(cell.tile == null) continue;
            let lastValidCell;
            for (let j = i - 1; j >= 0; j--) {
                const moveInCell = group[j];
                if (!moveInCell.canAccept(cell.tile)) break;
                lastValidCell = moveInCell;
            }


            if (lastValidCell != null) {
                if (lastValidCell.tile != null) {
                    lastValidCell.mergeTile = cell.tile;
                } else {
                    lastValidCell.tile = cell.tile;
                }

                cell.tile = null;
            }
        }
    })
};

setupInput();
