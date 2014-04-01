function Grid(stage, depth)
{
  this.layer = new Kinetic.Layer();
  this.cells = [];

  //setup our first cell
  var originHex = new Kinetic.Circle({
    x: _WIDTH/2,
    y: _HEIGHT/2,
    radius: _DIAMETER / 2,
    fillRed: 200,
    fillGreen: 200,
    fillBlue: 255,
    fillAlpha: 1
  });

  originHex.origFillRed = 200;
  originHex.origFillGreen = 200;
  originHex.origFillBlue = 255;
  originHex.origFillAlpha = 1;
  originHex.gridID = 0;
  originHex.level = 0;
  originHex.wrapper = this;

  this.layer.add(originHex);
  this.cells.push(originHex);

  //each level of the grid
  for(var level = 1; level < depth; level++)
  {
    var alpha = 1- ((1 / (depth * 1.2)) * level);
    var currCellCoords = [0, -level * _DIAMETER];

    //each cell in this level
    for(hex = 0; hex < level * 6; hex++)
    {
      //create the cell
      var thisHex = new Kinetic.Circle({
        x: currCellCoords[0] + (_WIDTH/2),
        y: currCellCoords[1] + (_HEIGHT/2),
        radius: _DIAMETER / 2,
        fillRed: 200,
        fillGreen: 200,
        fillBlue: 255,
        fillAlpha: alpha
      });

      thisHex.origFillRed = 200;
      thisHex.origFillGreen = 200;
      thisHex.origFillBlue = 255;
      thisHex.origFillAlpha = alpha;
      thisHex.gridID = this.cells.length;
      thisHex.level = level; 
      thisHex.wrapper = this;

      this.layer.add(thisHex);
      this.cells.push(thisHex);

      //calculate coordinates of next cell (this is the fun part)
      currCellCoords[0] += _DIAMETER * Math.cos((Math.floor(hex / level) * Math.PI/3) + Math.PI/6);
      currCellCoords[1] += _DIAMETER * Math.sin((Math.floor(hex / level) * Math.PI/3) + Math.PI/6);
    }
  }

  //calculate neighbor cells for quick movement
  for(var i = 0; i < this.cells.length; i++)
  {
    this.cells[i].neighbors = [];
    this.cells[i].neighbors.push(this.findNearestFuzzy(this.cells[i].x(), this.cells[i].y() - _DIAMETER));
    this.cells[i].neighbors.push(this.findNearestFuzzy(this.cells[i].x() + _DIAMETER * Math.cos(Math.PI/6), this.cells[i].y() - _DIAMETER * Math.sin(Math.PI/6)));
    this.cells[i].neighbors.push(this.findNearestFuzzy(this.cells[i].x() + _DIAMETER * Math.cos(Math.PI/6), this.cells[i].y() + _DIAMETER * Math.sin(Math.PI/6)));
    this.cells[i].neighbors.push(this.findNearestFuzzy(this.cells[i].x(), this.cells[i].y() + _DIAMETER));
    this.cells[i].neighbors.push(this.findNearestFuzzy(this.cells[i].x() - _DIAMETER * Math.cos(Math.PI/6), this.cells[i].y() + _DIAMETER * Math.sin(Math.PI/6)));
    this.cells[i].neighbors.push(this.findNearestFuzzy(this.cells[i].x() - _DIAMETER * Math.cos(Math.PI/6), this.cells[i].y() - _DIAMETER * Math.sin(Math.PI/6)));
  }

  stage.add(this.layer);
}



Grid.prototype.attachToken = function(token)
{
  this.token = token;
  token.grid = this;


  //attach events
  for(var i = 0; i < this.cells.length; i++)
  {
    this.cells[i].on('mousedown touchdown', function() {
      this.wrapper.token.moveTo(this.gridID);
    });
  }
}



Grid.prototype.findNearestFuzzy = function(x, y)
{
  for(var i = 0; i < this.cells.length; i++)
  {
    if( (Math.abs(x - this.cells[i].x())) < _DIAMETER/1024 && (Math.abs(y - this.cells[i].y())) < _DIAMETER/1024 )
    {
      return i;
    }
  }
}



Grid.prototype.findNearestExact = function(x, y)
{
  var closestIndex = 0;
  var closestDist = Number.MAX_VALUE;
  for(var i = 0; i < this.cells.length; i++)
  {
    var dist = Math.sqrt(Math.pow(Math.abs(x - this.cells[i].x()), 2) + Math.pow(Math.abs(y - this.cells[i].y()), 2));

    if(dist < closestDist)
    {
      closestIndex = i;
      closestDist = dist;
    }
  }

  return closestIndex;
}




Grid.prototype.colorize = function(cid)
{
  for(var i = 0; i < this.cells.length; i++)
  {
    this.cells[i].fillRed(this.cells[i].origFillRed);
    this.cells[i].fillGreen(this.cells[i].origFillGreen);
    this.cells[i].fillBlue(this.cells[i].origFillBlue);
    this.cells[i].fillAlpha(this.cells[i].origFillAlpha);
  }

  //choose a random orientation
  var start = Math.random() < 0.5 ? 0 : 0;

  for(var i = start; i < 6; i += 1)
  {
    var currID = cid;
    while(true)
    {
      nextID = this.cells[currID].neighbors[i];
      
      if(nextID === undefined || nextID == currID) break;
      else
      {
        currID = nextID;
        this.cells[currID].fillRed(255);
        this.cells[currID].fillGreen(147);
        this.cells[currID].fillBlue(15);
        this.cells[currID].fillAlpha(1);
      }

    }
  }

  this.layer.draw();
}
