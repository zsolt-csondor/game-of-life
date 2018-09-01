//Global variables
const listOfAliveCells = []; //Is this needed?
const gridTable = document.getElementById("grid");

//Create the grid where the game is played
function CreateGrid(width, height) {

  for(let i = 0; i < width; i++) {
    let row = gridTable.insertRow(i);

    for(let j = 0; j < height; j++) {
      row.insertCell(j);
    }
  }
}

function ClearGrid() {
  listOfAliveCells.length = 0;
  const cells = gridTable.getElementsByTagName("td");

  for(let i = 0; i < cells.length; i++) {
    cells[i].classList.remove("alive");
  }
}

//Populate the grid randomly with live cells at the start of the game
function CreateRandomCells(width, height) {
  ClearGrid();
  const numberOfCells = (width * height) / 12; //What would be a good initial cell number?

  for(let i = 0; i < numberOfCells; i++) {
    let randomPosition = {
          row: Math.floor(Math.random() * (width)),
          column: Math.floor(Math.random() * (height))
        }
    //Dont't allow duplicate cells
    if(!ContainsSameCell(randomPosition, listOfAliveCells)) {
      listOfAliveCells.push(randomPosition);
      let randomCell = gridTable.rows[randomPosition.row].cells.item(randomPosition.column);
      randomCell.classList.add("alive");
    }
  }
}

//TODO: This is the brute force solution; make this more efficient
function LivesOrDies() {

  //Iterating through every cells in each row
  for(let i = 0; i < gridTable.rows.length; i++) {
    for(let j = 0; j < gridTable.rows[i].cells.length; j++) {
      //First proceed with the rule checking based on the whether the current
      //cell is alive
      let currentCell = gridTable.rows[i].cells.item(j);
      let leftNb = (typeof(gridTable.rows[i]) !== "undefined") ? gridTable.rows[i].cells.item(j-1) : null;
      let rightNb = (typeof(gridTable.rows[i]) !== "undefined") ? gridTable.rows[i].cells.item(j+1) : null;
      let topNb = (typeof(gridTable.rows[i-1]) !== "undefined") ? gridTable.rows[i-1].cells.item(j) : null;
      let topLeftNb = (typeof(gridTable.rows[i-1]) !== "undefined") ? gridTable.rows[i-1].cells.item(j-1) : null;
      let topRightNb = (typeof(gridTable.rows[i-1]) !== "undefined") ? gridTable.rows[i-1].cells.item(j+1) : null;
      let bottomNb = (typeof(gridTable.rows[i+1]) !== "undefined") ? gridTable.rows[i+1].cells.item(j) : null;
      let bottomLeftNb = (typeof(gridTable.rows[i+1]) !== "undefined") ? gridTable.rows[i+1].cells.item(j-1) : null;
      let bottomRightNb = (typeof(gridTable.rows[i+1]) !== "undefined") ? gridTable.rows[i+1].cells.item(j+1) : null;

      let liveCounter = 0;

      //TODO: put the neighbours in a list and run a checking function on them

        if(IsAlive(leftNb)) {
          liveCounter++;
        }
        if(IsAlive(rightNb)) {
          liveCounter++;
        }
        if(IsAlive(topNb)) {
          liveCounter++;
        }
        if(IsAlive(topLeftNb)) {
          liveCounter++;
        }
        if(IsAlive(topRightNb)) {
          liveCounter++;
        }
        if(IsAlive(bottomNb)) {
          liveCounter++;
        }
        if(IsAlive(bottomLeftNb)) {
          liveCounter++;
        }
        if(IsAlive(bottomRightNb)) {
          liveCounter++;
        }

        if(IsAlive(currentCell) && (liveCounter < 2 || liveCounter > 3)) {
          currentCell.classList.remove("alive");
        }
        else if(!IsAlive(currentCell) && liveCounter === 3) {
          currentCell.classList.add("alive");
        }
    }
  }
}

function IsAlive(cell) {
  if(cell !== null && cell.classList.contains("alive") !== false) {
    return true;
  }
  else {
    return false;
  }
}

//Check whether a list contains the same randomPosition object by value.
//It is used to prevent duplicates for the list of live cells when they are
//randomly created.
function ContainsSameCell(object, list) {

  for(let i = 0; i < list.length; i++) {
    if(list[i].row === object.row && list[i].column === object.column) {
      return true;
    }
  }
  return false;
}
