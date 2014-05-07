function Token(stage)
{
  this.layer = new Kinetic.Layer();
  this.gridID = 0;

  var len = _DIAMETER / Math.sqrt(3);

  this.k = new Kinetic.Line({
    x: _LENGTH/2,
    y: _LENGTH/2,
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
    strokeWidth: _DIAMETER/10,
    //draggable: true,
    closed: true
  });

  this.k.wrapper = this;

  /*this.k.on("dragend", function() {
    var pos = stage.getPointerPosition();
    if(pos !== undefined) this.wrapper.moveToNearest(pos.x, pos.y);
    else this.wrapper.moveTo(this.wrapper.gridID);
  });*/

  this.layer.add(this.k);
  stage.add(this.layer);
}

Token.prototype.moveTo = function(cid)
{
  if(cid === undefined) return;
  this.gridID = cid;

  var dx = this.grid.cells[cid].x() - this.k.x();
  var dy = this.grid.cells[cid].y() - this.k.y();
  var duration = Math.abs(Math.sqrt((dx * dx) + (dy * dy))) / 800;

  //this.grid.setActivePaths(cid);

  var thisToken = this;
  var tween = new Kinetic.Tween({
    node: thisToken.k, 
    duration: duration,
    x: this.grid.cells[cid].x(),
    y: this.grid.cells[cid].y(),
    rotation: (thisToken.k.rotation() + 180) % 360
  });
      
  tween.play();
}

Token.prototype.moveToNearest = function(x, y)
{
  var nearestID = this.grid.findNearestExact(x, y);

  if(nearestID === undefined) return;
  
  this.gridID = nearestID;
  this.k.x(this.grid.cells[nearestID].x());
  this.k.y(this.grid.cells[nearestID].y());
  this.layer.draw();
}

Token.prototype.moveByDir = function(dir)
{
  var currID = this.gridID;
  while(true)
  {
    var nextID = this.grid.cells[currID].neighbors[dir];
    
    if(nextID === undefined || nextID == currID) break;
    else
    {
      currID = nextID;
      if(currID == 0) break;
    }
  }

  this.moveTo(currID);
}