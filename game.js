//Global variables
const listOfAliveCells = [];
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
  for(let i = 1; i < gridTable.rows.length-1; i++) {
    for(let j = 1; j < gridTable.rows[i].cells.length-1; j++) {
      //First proceed with the rule checking based on the whether the current
      //cell is alive
      let currentCell = gridTable.rows[i].cells.item(j);
      let leftNb = gridTable.rows[i].cells.item(j-1);
      let rightNb = gridTable.rows[i].cells.item(j+1);
      let topNb = gridTable.rows[i-1].cells.item(j);
      let topLeftNb = gridTable.rows[i-1].cells.item(j-1);
      let topRightNb = gridTable.rows[i-1].cells.item(j+1);
      let bottomNb = gridTable.rows[i+1].cells.item(j);
      let bottomLeftNb = gridTable.rows[i+1].cells.item(j-1);
      let bottomRightNb = gridTable.rows[i+1].cells.item(j+1);

      let liveCounter = 0;

      //TODO: No need to check neighbours at the boundaries
      //TODO: put the neighbours in a list and run a checking function on them
      if(IsAlive(currentCell)) {

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

        if(liveCounter < 2 || liveCounter > 3) {
          currentCell.classList.remove("alive");
        }
      }
      else {
        //Check if dead cell comes to life
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

        if(liveCounter === 3) {
          currentCell.classList.add("alive");
        }
      }
    }
  }
}

function IsAlive(cell) {
  if(cell.classList.contains("alive") !== false) {
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
