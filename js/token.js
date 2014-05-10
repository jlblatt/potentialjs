function Token(x, y, diameter)
{
  this.gridID = 0;
  
  var len = diameter / Math.sqrt(3);

  this.k = new Kinetic.Line({
    x: x,
    y: y,
    points: [
      len * Math.cos(0),
      len * Math.sin(0),
      len * Math.cos(Math.PI/3),
      len * Math.sin(Math.PI/3),
      len * Math.cos(2 * Math.PI/3),
      len * Math.sin(2 * Math.PI/3),
      len * Math.cos(Math.PI),
      len * Math.sin(Math.PI),
      len * Math.cos(Math.PI + Math.PI/3),
      len * Math.sin(Math.PI + Math.PI/3),
      len * Math.cos(Math.PI + 2 * Math.PI/3),
      len * Math.sin(Math.PI + 2 * Math.PI/3)
    ],
    strokeWidth: diameter/10,
    closed: true,
    scaleX: 0,
    scaleY: 0,
    rotation: -120
  });
}

Token.prototype.moveTo = function(cid)
{
  if(cid === undefined) return;
  this.gridID = cid;

  var dx = this.grid.cells[cid].x() - this.k.x();
  var dy = this.grid.cells[cid].y() - this.k.y();
  var duration = Math.abs(Math.sqrt((dx * dx) + (dy * dy))) / 800;

  var thisToken = this;
  thisToken.k.rotation(0);

  var tween = new Kinetic.Tween({
    node: thisToken.k, 
    duration: duration,
    x: this.grid.cells[cid].x(),
    y: this.grid.cells[cid].y(),
    rotation: 120
  });
      
  tween.play();
}

Token.prototype.moveToNearest = function(x, y, grid)
{
  var nearestID = grid.findNearestExact(x, y);

  if(nearestID === undefined) return;
  
  this.gridID = nearestID;
  this.k.x(grid.cells[nearestID].x());
  this.k.y(grid.cells[nearestID].y());
  this.layer.draw();
}

Token.prototype.moveByDir = function(dir)
{
  var currID = this.gridID;
  while(true)
  {
    var nextID = this.grid.cells[currID].neighbors[dir];
    
    if(nextID === undefined || nextID == currID  || this.grid.cells[nextID].holding) break;
    else
    {
      currID = nextID;
      if(currID == 0) break;
    }
  }

  this.moveTo(currID);
}