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
