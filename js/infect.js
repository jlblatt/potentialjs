function Infection(grid, aggro)
{
  this.grid = grid;
  this.aggro = aggro;
  
  this.sequence = new Array(grid.cells.length);
  for(var i = 0; i < this.sequence.length; i++)
  {
    this.sequence[i] = i;
  }
  this.sequence.shuffle();

  this.spawnInt = setInterval(this.spawn.bind(this), 4000/this.aggro);

}

Infection.prototype.spawn = function()
{
  if(this.sequence.length < 1) 
  {
    clearInterval(this.spawnInt);
    return;
  }

  var cell = this.grid.cells[this.sequence.shift()];

  if(!cell.infected)
  {
    cell.infected = true;
    cell.fillRed(255);
    cell.fillGreen(255);
    cell.fillBlue(255);
    cell.fillAlpha(.5);

    var tween = new Kinetic.Tween({
      node: cell, 
      duration: this.aggro,
      fillRed: 0,
      fillGreen: 0,
      fillBlue: 0,
      fillAlpha: 0
    });
          
    tween.play();
  }
}

