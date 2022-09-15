import Grid from "./Grid.js";
import Tile from "./Tile.js";

console.info("%c 2048 by Ahmad Habib", "background: #000; color: #fff; border-radius: 6px;padding: 10px; font-size: 20px")

const score = document.getElementById("score");
const previousHigh = document.getElementById("previous-high");
score.textContent = 0;
if (localStorage.getItem("highscore"))
    previousHigh.textContent = localStorage.getItem("highscore");
else
    previousHigh.textContent = "0";

document.getElementById("restart").addEventListener("click", () => window.location.reload())

const gameBoard = document.getElementById("game-board");
const grid = new Grid(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);

const setupInput = () => {
    window.addEventListener("keydown", handleInput, { once: true });
};
let arrows = document.querySelectorAll(".arrow");
arrows.forEach(arrow => {
    arrow.addEventListener("click", (e) => {
        let key = arrow.getAttribute("data-key");
        handleInput({ key })
    })
})

const handleInput = async (e) => {
    let availableForMove = true;
    switch (e.key) {
        case "ArrowUp":
            if (!canMoveUp()) {
                setupInput();
                return;
            }
            availableForMove = true;
            await moveUp();
            break;
        case "ArrowDown":
            if (!canMoveDown()) {
                setupInput();
                return;
            }
            availableForMove = true;
            await moveDown();
            break;
        case "ArrowLeft":
            if (!canMoveLeft()) {
                setupInput();
                return;
            }
            availableForMove = true;
            await moveLeft();
            break;
        case "ArrowRight":
            if (!canMoveRight()) {
                setupInput();
                return;
            }
            availableForMove = true;
            await moveRight();
            break;
        default:
            availableForMove = false;
            setupInput();
            break;
    }
    if (!availableForMove) return;
    grid.cells.forEach(cell => cell.mergeTiles());
    const newTile = new Tile(gameBoard);
    grid.randomEmptyCell().tile = newTile;
    if (!canMoveUp() && !canMoveDown() && !canMoveRight() && !canMoveLeft()) {
        newTile.waitForTransition(true).then(() => {
            let highScore = localStorage.getItem("highscore");
            if (highScore && Number(highScore)) {
                if (Number(highScore) < Number(score.textContent)) {
                    localStorage.setItem("highscore", score.textContent);
                    alert(`Wow! you just made your new high score: ${score.textContent}`);
                }
                else if (Number(highScore) == Number(score.textContent))
                    alert(`Wow! you just equal your high score: ${score.textContent}`);
                else
                    alert(`You scored: ${score.textContent}`);
            } else {
                localStorage.setItem("highscore", score.textContent);
                alert(`Wow! you just made your new high score: ${score.textContent}`);
            }
        })
        return
    }

    setupInput();
};

const moveUp = () => {
    evaluateScore();
    return slideTiles(grid.cellsByColumn);
};
const moveDown = () => {
    evaluateScore();
    return slideTiles(grid.cellsByColumn.map(column => [...column].reverse()));
};
const moveRight = () => {
    evaluateScore();
    return slideTiles(grid.cellsByRow.map(row => [...row].reverse()));
};
const moveLeft = () => {
    evaluateScore();
    return slideTiles(grid.cellsByRow);
};

const slideTiles = (cells) => {
    return Promise.all(
        cells.flatMap(group => {
            const promises = [];
            for (let i = 1; i < group.length; i++) {
                const cell = group[i];
                if (cell.tile == null) continue;
                let lastValidCell;
                for (let j = i - 1; j >= 0; j--) {
                    const moveInCell = group[j];
                    if (!moveInCell.canAccept(cell.tile)) break;
                    lastValidCell = moveInCell;
                }


                if (lastValidCell != null) {
                    promises.push(cell.tile.waitForTransition())
                    if (lastValidCell.tile != null) {
                        lastValidCell.mergeTile = cell.tile;
                    } else {
                        lastValidCell.tile = cell.tile;
                    }

                    cell.tile = null;
                }
            }
            return promises;
        })
    )
};

const canMoveUp = () => {
    return canMove(grid.cellsByColumn);
}
const canMoveDown = () => {
    return canMove(grid.cellsByColumn.map(column => [...column].reverse()));
}
const canMoveLeft = () => {
    return canMove(grid.cellsByRow);
}
const canMoveRight = () => {
    return canMove(grid.cellsByRow.map(row => [...row].reverse()));
}

const canMove = (cells) => {
    return cells.some(group => {
        return group.some((cell, index) => {
            if (index === 0) return false;
            if (cell.tile == null) return false;
            const moveToCell = group[index - 1];
            return moveToCell.canAccept(cell.tile);
        });
    })
}

const evaluateScore = () => {
    let currentScore = Number(score.textContent);
    currentScore += 5;
    score.textContent = currentScore;
    if (localStorage.getItem("highscore")) {
        if (Number(currentScore) > Number(localStorage.getItem("highscore")))
            previousHigh.textContent = currentScore;
    }
    else
        previousHigh.textContent = currentScore;
    score.classList.add("animate-text");
    setTimeout(() => {
        score.classList.remove("animate-text");
    }, 200)
}

setupInput();
