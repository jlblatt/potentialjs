function Infection(grid, aggro)
{
  this.grid = grid;
  this.aggro = aggro;
  //this.spawnInt = setInterval(this.spawn, 10000/this.aggro);
}

Infection.prototype.spawn = function()
{
  //pick a random cell that's not infected already
  var cell = _GRID.cells[Math.floor(Math.random() * _GRID.cells.length)];

  if(!cell.infected)
  {
    cell.infected = true;
    cell.fillRed(255);
    cell.fillGreen(200);
    cell.fillBlue(200);
    cell.fillAlpha(1);
    cell.infection = setInterval(function(){
      cell.fillGreen(cell.fillGreen() - 2);
      cell.fillBlue(cell.fillBlue() - 2);
      cell.fillAlpha(cell.fillAlpha() - .02);
      _GRID.layer.draw();
    }, 1000/_INFECTION.aggro);
  }


}

