//Create the grid where the game is played
function CreateGrid(width, height) {
  const gridTable = document.getElementById("grid");

  for(let i = 0; i < width; i++) {
    let row = gridTable.insertRow(i);

    for(let j = 0; j < height; j++) {
      row.insertCell(j);
    }
  }
}

//TODO: remove duplicates?
//Populate the grid randomly with live cells at the start of the game
function CreateRandomCells(width, height) {
  const numberOfCells = (width * height) / 10; //What would be a good initial cell number?
  const gridTable = document.getElementById("grid");

  for(let i = 0; i < numberOfCells; i++) {
    let randomPosition = {
          row: Math.floor(Math.random() * (width)),
          column: Math.floor(Math.random() * (height))
        }

    let randomCell = gridTable.rows[randomPosition.row].cells.item(randomPosition.column);

    randomCell.classList.add("alive");
  }
}
