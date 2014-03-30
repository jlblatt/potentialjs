function resizeStage(x, y)
{
  $("#stage").css({
    'width' : x,
    'height' : y,
    'margin-left' : - parseInt(x/2),
    'margin-top' : - parseInt(y/2)
  });

  _STAGE.setWidth(x);
  _STAGE.setHeight(y);
}



function move(currCell, rads)
{
  var newx = currCell.x() + _DIAMETER * Math.cos(rads);
  var newy = currCell.y() - _DIAMETER * Math.sin(rads);

  var newCell = findNearest(newx, newy);
  return newCell;
}



function createGrid(depth)
{
  _GRIDLAYER = new Kinetic.Layer();
  var hexes = [];

  //calculate diamter
  _DIAMETER = _HEIGHT / (depth * 2);

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

  _GRIDLAYER.add(originHex);
  hexes.push(originHex);

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
      thisHex.gridID = hexes.length;

      _GRIDLAYER.add(thisHex);
      hexes.push(thisHex);

      //calculate coordinates of next cell (this is the fun part)
      currCellCoords[0] += _DIAMETER * Math.cos((Math.floor(hex / level) * Math.PI/3) + Math.PI/6);
      currCellCoords[1] += _DIAMETER * Math.sin((Math.floor(hex / level) * Math.PI/3) + Math.PI/6);
    }
  }

  //attach events
  for(var i = 0; i < hexes.length; i++)
  {
    hexes[i].on('mousedown touchdown', function() {
      _TOKEN.x(this.x());
      _TOKEN.y(this.y());
      colorize();
      _TOKENLAYER.draw();
    });
  }

  _STAGE.add(_GRIDLAYER);
  return hexes;
}



function createToken()
{
  _TOKENLAYER = new Kinetic.Layer();

  var token = new Kinetic.Circle({
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

  token.on("dragend", function() {
    var pos = _STAGE.getPointerPosition();
    dropNearest(this, pos.x, pos.y);
  });

  _TOKENLAYER.add(token);
  _STAGE.add(_TOKENLAYER);

  return token;
}



function findNearest(x, y)
{
  var closestIndex = 0;
  var closestDist = Number.MAX_VALUE;
  for(var i = 0; i < _GRID.length; i++)
  {
    var dist = Math.sqrt(Math.pow(Math.abs(x - _GRID[i].x()), 2) + Math.pow(Math.abs(y - _GRID[i].y()), 2));

    if(dist < closestDist)
    {
      closestIndex = i;
      closestDist = dist;
    }
  }

  return _GRID[closestIndex];
}

function dropNearest(node, x, y)
{
  var nearest = findNearest(x, y);

  node.x(nearest.x());
  node.y(nearest.y());
  colorize();
  _TOKENLAYER.draw();
}



function colorize()
{
  for(var i = 0; i < _GRID.length; i++)
  {
    _GRID[i].fillRed(_GRID[i].origFillRed);
    _GRID[i].fillGreen(_GRID[i].origFillGreen);
    _GRID[i].fillBlue(_GRID[i].origFillBlue);
    _GRID[i].fillAlpha(_GRID[i].origFillAlpha);
  }

  var startCell = findNearest(_TOKEN.x(), _TOKEN.y());

  //choose a random orientation
  var sign = Math.random() < 0.5 ? -1 : 1;
  var startRad = Math.PI / 6 * sign;

  for(var rads = startRad; rads < (2 * Math.PI) + startRad; rads += (2 * Math.PI / 3))
  {
    var currCell = startCell;
    while(true)
    {
      nextCell = move(currCell, rads);
      
      if(nextCell == currCell) break;
      else
      {
        currCell = nextCell;
        currCell.fillRed(255);
        currCell.fillGreen(147);
        currCell.fillBlue(15);
        currCell.fillAlpha(1);
        currCell = nextCell;
      }

    }
  }

  _GRIDLAYER.draw();
}