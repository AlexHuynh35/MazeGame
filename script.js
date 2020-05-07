var gameStarted = false;
var grid = {};
var visitedCells = [];
var xLoc = 0;
var yLoc = 0;

function makeGrid(width, length, size) {
    $(".container").html("");
    for (var x = 0; x < width; x++) {
        $(".container").append(`<div id='column${x}'>`);
        grid[`x${x}`] = {};
        for (var y = 0; y < length; y++) {
            $(`#column${x}`).append(`<div class='box ${x} 0${y}'></div>`);
            grid[`x${x}`][`y${y}`] = {
                visited: false,
                uBor: true,
                dBor: true,
                lBor: true,
                rBor: true
            };
        }
        $(".container").append("</div>");
    }
    $(".box").css({
        "border": "1px black solid",
        "height": size,
        "width": size
    });
}

function carveMaze(grid, currentCell) {
    grid[`x${currentCell[0]}`][`y${currentCell[1]}`].visited = true;
    let newCell = toNewCell(grid, currentCell);
    if (visitedCells.length === Object.keys(grid).length * Object.keys(grid["x0"]).length) {
        return true;
    }
    if (newCell === false) {
        carveMaze(grid, visitedCells[visitedCells.indexOf(currentCell) - 1]);
    } else {
        visitedCells.push(newCell);
        carveMaze(grid, newCell);
    }
}

function toNewCell(grid, currentCell) {
    let direction = ["up", "down", "left", "right"];
    while (true) {
        let ranDirection = direction[Math.floor(Math.random() * direction.length)];
        let cell = currentCell.split("");
        let newC = currentCell.split("");
        if (direction.length === 0) {
            return false;
        }
        if (ranDirection === "up" && cell[1] !== "0" && grid[`x${cell[0]}`][`y${String(parseInt(cell[1]) - 1)}`].visited === false) {
            newC[1] = String(parseInt(cell[1]) - 1);
            grid[`x${cell[0]}`][`y${cell[1]}`].uBor = false;
            grid[`x${newC[0]}`][`y${newC[1]}`].dBor = false;
            return newC.join("");
        }
        if (ranDirection === "down" && cell[1] !== String(Object.keys(grid["x0"]).length - 1) && grid[`x${cell[0]}`][`y${String(parseInt(cell[1]) + 1)}`].visited === false) {
            newC[1] = String(parseInt(cell[1]) + 1);
            grid[`x${cell[0]}`][`y${cell[1]}`].dBor = false;
            grid[`x${newC[0]}`][`y${newC[1]}`].uBor = false;
            return newC.join("");
        }
        if (ranDirection === "left" && cell[0] !== "0" && grid[`x${String(parseInt(cell[0]) - 1)}`][`y${cell[1]}`].visited === false) {
            newC[0] = String(parseInt(cell[0]) - 1);
            grid[`x${cell[0]}`][`y${cell[1]}`].lBor = false;
            grid[`x${newC[0]}`][`y${newC[1]}`].rBor = false;
            return newC.join("");
        }
        if (ranDirection === "right" && cell[0] !== String(Object.keys(grid).length - 1) && grid[`x${String(parseInt(cell[0]) + 1)}`][`y${cell[1]}`].visited === false) {
            newC[0] = String(parseInt(cell[0]) + 1);
            grid[`x${cell[0]}`][`y${cell[1]}`].rBor = false;
            grid[`x${newC[0]}`][`y${newC[1]}`].lBor = false;
            return newC.join("");
        }
        direction.splice(direction.indexOf(ranDirection), 1);
    }
}

function drawMaze(grid) {
    for (var x = 0; x < Object.keys(grid).length; x++) {
        for (var y = 0; y < Object.keys(grid["x0"]).length; y++) {
            if (grid[`x${x}`][`y${y}`].uBor === false) {
                $(`.${x}.0${y}`).css("border-top", "1px solid white");
            }
            if (grid[`x${x}`][`y${y}`].dBor === false) {
                $(`.${x}.0${y}`).css("border-bottom", "1px solid white");
            }
            if (grid[`x${x}`][`y${y}`].lBor === false) {
                $(`.${x}.0${y}`).css("border-left", "1px solid white");
            }
            if (grid[`x${x}`][`y${y}`].rBor === false) {
                $(`.${x}.0${y}`).css("border-right", "1px solid white");
            }
        }
    }
    $(`.${Object.keys(grid).length - 1}.0${0}`).css("background-color", "green")
}

function resetMaze() {
    grid = {};
    visitedCells = [];
    makeGrid(10, 10, 50);
    xLoc = 0;
    yLoc = Object.keys(grid["x0"]).length - 1;
    playerLoc(xLoc, yLoc);
    visitedCells.push(String(xLoc) + String(yLoc));
    carveMaze(grid, visitedCells[0]);
    drawMaze(grid);
}

function playerLoc(x, y) {
    $(`.${x}.0${y}`).css("background-color", "gray");
}

function clearPath(x, y) {
    $(`.${x}.0${y}`).css("background-color", "white");
}

function winner(x, y) {
    if (x === Object.keys(grid).length - 1 && y === 0) {
        alert("Nice!")
        resetMaze();
    }
}

$("#reset").click(function() {
    gameStarted = true;
    $("#reset").text("Reset Maze");
    $("#direction").text("Facing Up");
    resetMaze();
});

$("body").keydown(function(e) {
    if (e.key === "ArrowUp" && gameStarted) {
        $("#direction").text("Facing Up");
        if (yLoc !== 0 && grid[`x${xLoc}`][`y${yLoc}`].uBor === false) {
            clearPath(xLoc, yLoc);
            yLoc = yLoc - 1;
            playerLoc(xLoc, yLoc);
            winner(xLoc, yLoc);
        }
    }
    if (e.key === "ArrowDown" && gameStarted) {
        $("#direction").text("Facing Down");
        if (yLoc !== Object.keys(grid["x0"]).length - 1 && grid[`x${xLoc}`][`y${yLoc}`].dBor === false) {
            clearPath(xLoc, yLoc);
            yLoc = yLoc + 1;
            playerLoc(xLoc, yLoc);
            winner(xLoc, yLoc);
        }
    }
    if (e.key === "ArrowLeft" && gameStarted) {
        $("#direction").text("Facing Left");
        if (xLoc !== 0 && grid[`x${xLoc}`][`y${yLoc}`].lBor === false) {
            clearPath(xLoc, yLoc);
            xLoc = xLoc - 1;
            playerLoc(xLoc, yLoc);
            winner(xLoc, yLoc);
        }
    }
    if (e.key === "ArrowRight" && gameStarted) {
        $("#direction").text("Facing Right");
        if (xLoc !== Object.keys(grid).length - 1 && grid[`x${xLoc}`][`y${yLoc}`].rBor === false) {
            clearPath(xLoc, yLoc);
            xLoc = xLoc + 1;
            playerLoc(xLoc, yLoc);
            winner(xLoc, yLoc);
        }
    }
});