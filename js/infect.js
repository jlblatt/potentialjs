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

    var tween = new Kinetic.Tween({
      node: cell, 
      duration: this.aggro / 2,
      fillAlpha: .2
    });
          
    tween.play();
  }
}

