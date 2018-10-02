//Globals
const listOfProcessedCells = []; //Every cell is stored here with a state (alive or dead) and is flushed before the start of a new round.

//Game controls
//TODO: extend it with all the user interface controls (move logic from html here)
const Controls = {
    StartOrStop: null,

    Start: function Start() {
        LivesOrDies();
        StartOrStop = setTimeout(Start, 300);
    },
    Stop: function Stop() {
        clearTimeout(StartOrStop);
    }
};

//All the grid-related functions
//TODO: maybe later create a separate object for preset configurations?
const Grid = {
    gridTable: document.getElementById("grid"),
    //Width and height are zero before CreateGrid is called
    width: 0,
    height: 0,
    //Create the grid where the game is played
    CreateGrid: function CreateGrid(gridWidth, gridHeight) {
            this.width = gridWidth;
            this.height = gridHeight;

            for (let i = 0; i < gridWidth; i++) {
                let row = this.gridTable.insertRow(i);

                for (let j = 0; j < gridHeight; j++) {
                    row.insertCell(j);
                }
            }
            const cells = this.gridTable.getElementsByTagName("td");
            for (let i = 0; i < cells.length; i++) {
                cells[i].addEventListener("click", PaintCell);
            }
        },
    ClearGrid: function ClearGrid() {
        listOfProcessedCells.length = 0;
        const cells = this.gridTable.getElementsByTagName("td");

        for (let i = 0; i < cells.length; i++) {
            cells[i].classList.remove("alive");
        }
    },
    //Populate the grid randomly with live cells at the start of the game
    GenerateRandomCells: function GenerateRandomCells(numberOfCells) {
        this.ClearGrid();

        for (let i = 0; i < numberOfCells; i++) {
            let randomRow = Math.floor(Math.random() * (this.height));
            let randomCol = Math.floor(Math.random() * (this.width));

            let randomCell = this.gridTable.rows[randomRow].cells.item(randomCol);
            randomCell.classList.add("alive");
        }
    }
};

const GameMechanism = {
    //Check whether a list contains the same randomPosition object by value.
    ContainsSameCell: function ContainsSameCell(object, list) {
        for (let i = 0; i < list.length; i++) {
            if (list[i].row === object.row && list[i].column === object.column) {
                return true;
            }
        }
        return false;
    },
    IsAlive: function IsAlive(cell) {
        if (cell !== null && cell.classList.contains("alive") !== false) {
            return true;
        }
        else {
            return false;
        }
    },
    UpdateGridStates: function UpdateGridStates(listOfProcessedCells) {

        for (let i = 0; i < listOfProcessedCells.length; i++) {
            let currentCell = Grid.gridTable.rows[listOfProcessedCells[i].row].cells.item(listOfProcessedCells[i].column);

            if (listOfProcessedCells[i].staysAlive === true) {
                if (!currentCell.classList.contains("alive")) {
                    currentCell.classList.add("alive");
                }
            }
            else {
                currentCell.classList.remove("alive");
            }
        }
        //Clear the list of cells for the next round
        listOfProcessedCells.length = 0;
    },

    GetNeighbourList: function GetNeighbourList(rowIndex, colIndex) {

        let leftNb = (Grid.gridTable.rows[rowIndex].cells.item(colIndex - 1) !== null) ? Grid.gridTable.rows[rowIndex].cells.item(colIndex - 1) : Grid.gridTable.rows[rowIndex].cells.item(Grid.height - 1);
        let rightNb = (Grid.gridTable.rows[rowIndex].cells.item(colIndex + 1) !== null) ? Grid.gridTable.rows[rowIndex].cells.item(colIndex + 1) : Grid.gridTable.rows[rowIndex].cells.item(0);
        let topNb = (typeof (Grid.gridTable.rows[rowIndex - 1]) !== "undefined") ? Grid.gridTable.rows[rowIndex - 1].cells.item(colIndex) : Grid.gridTable.rows[Grid.width - 1].cells.item(colIndex);
        let topLeftNb = (typeof (Grid.gridTable.rows[rowIndex - 1]) !== "undefined") ? Grid.gridTable.rows[rowIndex - 1].cells.item(colIndex - 1) : Grid.gridTable.rows[Grid.width - 1].cells.item(colIndex - 1);
        let topRightNb = (typeof (Grid.gridTable.rows[rowIndex - 1]) !== "undefined") ? Grid.gridTable.rows[rowIndex - 1].cells.item(colIndex + 1) : Grid.gridTable.rows[Grid.width - 1].cells.item(colIndex + 1);
        let bottomNb = (typeof (Grid.gridTable.rows[rowIndex + 1]) !== "undefined") ? Grid.gridTable.rows[rowIndex + 1].cells.item(colIndex) : Grid.gridTable.rows[0].cells.item(colIndex);
        let bottomLeftNb = (typeof (Grid.gridTable.rows[rowIndex + 1]) !== "undefined") ? Grid.gridTable.rows[rowIndex + 1].cells.item(colIndex - 1) : Grid.gridTable.rows[0].cells.item(colIndex - 1);
        let bottomRightNb = (typeof (Grid.gridTable.rows[rowIndex + 1]) !== "undefined") ? Grid.gridTable.rows[rowIndex + 1].cells.item(colIndex + 1) : Grid.gridTable.rows[0].cells.item(colIndex + 1);

        return [leftNb, rightNb, topNb, topLeftNb, topRightNb, bottomNb, bottomLeftNb, bottomRightNb];
    }
};


//This is the core of the game. One function run corresponds to one round in the game.
//The function goes through every cell in the grid and checks whether the given cell stays alive or
//dies after the round, and then calls for the grid update.
function LivesOrDies() {

    for (let i = 0; i < Grid.height; i++) {
        for (let j = 0; j < Grid.width; j++) {

            //Identify the current cell and its neighbours
            let currentCell = Grid.gridTable.rows[i].cells.item(j);
            let neighbourList = GameMechanism.GetNeighbourList(i, j);

            //Increment the counter every time a neighbour is a live cell, then apply the game rules accordingly
            let liveCounter = 0;
            neighbourList.map(nb => {
                if (GameMechanism.IsAlive(nb)) {
                    liveCounter++;
                }
            });

            //If the current cell is alive but has less than 2 or more than 3 alive neighbours it dies in the next round
            if (GameMechanism.IsAlive(currentCell) && (liveCounter < 2 || liveCounter > 3)) {
                let deadCell = { row: i, column: j, staysAlive: false };
                listOfProcessedCells.push(deadCell);
            }
            //If the current cell is alive and has the right number of neighbours it stays alive in the next round
            else if (GameMechanism.IsAlive(currentCell) && (liveCounter === 2 || liveCounter === 3)) {
                let liveCell = { row: i, column: j, staysAlive: true };
            }
            //If the current cell is dead, but has exactly 3 neighbours alive it becomes alive in the next round
            else if (!GameMechanism.IsAlive(currentCell) && liveCounter === 3) {
                let liveCell = { row: i, column: j, staysAlive: true };
                listOfProcessedCells.push(liveCell);
            }
            //Otherwise if the current cell is dead ir stays dead in the next round
            else if (!GameMechanism.IsAlive(currentCell)) {
                let deadCell = { row: i, column: j, staysAlive: false };
                listOfProcessedCells.push(deadCell);
            }
        }
    }

    GameMechanism.UpdateGridStates(listOfProcessedCells);
}

//If a cell is clicked on, make it alive. If already alive, make it dead.
function PaintCell() {
    if (this.classList.contains("alive")) {
        this.classList.remove("alive");
    }
    else {
        this.classList.add("alive");
    }
}

