function Token(stage)
{
  this.layer = new Kinetic.Layer();
  this.gridID = 0;

  var len = _DIAMETER / Math.sqrt(3);

  this.k = new Kinetic.Line({
    x: _WIDTH/2,
    y: _HEIGHT/2,
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
    fillRed: 210,
    fillGreen: 210,
    fillBlue: 255,
    fillAlpha: 1,
    stroke: "#D2D2FF",
    strokeWidth: _DIAMETER/10,
    draggable: true,
    closed: true
  });

  this.k.wrapper = this;

  this.k.on("dragend", function() {
    var pos = stage.getPointerPosition();
    if(pos !== undefined) this.wrapper.moveToNearest(pos.x, pos.y);
    else this.wrapper.moveTo(this.wrapper.gridID);
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