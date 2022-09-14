import Grid from "./Grid.js";
import Tile from "./Tile.js";

const gameBoard = document.getElementById("game-board");
const grid = new Grid(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);

const setupInput = () => {
    window.addEventListener("keypress", handleInput, { once: true });
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

setupInput();
