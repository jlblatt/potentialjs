function Token(stage)
{
  this.layer = new Kinetic.Layer();
  this.gridID = 0;

  this.k = new Kinetic.Circle({
    x: _WIDTH/2,
    y: _HEIGHT/2,
    radius: _DIAMETER / 2,
    fillRed: 255,
    fillGreen: 147,
    fillBlue: 15,
    fillAlpha: 1,
    stroke: "#000",
    strokeWidth: _DIAMETER/8,
    draggable: true
  });

  this.k.wrapper = this;

  this.k.on("dragend", function() {
    var pos = stage.getPointerPosition();
    this.wrapper.moveToNearest(pos.x, pos.y);
  });

  this.layer.add(this.k);
  stage.add(this.layer);
}

Token.prototype.moveTo = function(cid)
{
  if(cid === undefined) return;
  this.gridID = cid;
  this.k.x(this.grid.cells[cid].x());
  this.k.y(this.grid.cells[cid].y());
  this.grid.colorize(cid);
  this.layer.draw();
}

Token.prototype.moveToNearest = function(x, y)
{
  var nearestID = this.grid.findNearestExact(x, y);

  if(nearestID === undefined) return;
  
  this.gridID = nearestID;
  this.k.x(this.grid.cells[nearestID].x());
  this.k.y(this.grid.cells[nearestID].y());
  this.grid.colorize(nearestID);
  this.layer.draw();
}

Token.prototype.moveByDir = function(dir)
{
  this.moveTo(this.grid.cells[this.gridID].neighbors[dir]);
}