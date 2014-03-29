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



function createGrid(depth)
{
  var layer = new Kinetic.Layer();
  var hexes = [];

  //calculate diamter
  var diameter = _HEIGHT / (depth * 2);

  //setup our first cell
  var originHex = new Kinetic.Circle({
    x: _WIDTH/2,
    y: _HEIGHT/2,
    radius: diameter / 2,
    fillRed: 200,
    fillGreen: 200,
    fillBlue: 255,
    fillAlpha: 1,
    draggable: true
  });

  layer.add(originHex);
  hexes.push(originHex);

  //each level of the grid
  for(var level = 1; level < depth; level++)
  {
    var alpha = 1- ((1 / (depth * 1.2)) * level);
    var currCellCoords = [0, -level * diameter];

    //each cell in this level
    for(hex = 0; hex < level * 6; hex++)
    {
      //create the cell
      var thisHex = new Kinetic.Circle({
        x: currCellCoords[0] + (_WIDTH/2),
        y: currCellCoords[1] + (_HEIGHT/2),
        radius: diameter / 2,
        fillRed: 200,
        fillGreen: 200,
        fillBlue: 255,
        fillAlpha: alpha
      });

      layer.add(thisHex);
      hexes.push(thisHex);

      //calculate coordinates of next cell (this is the fun part)
      currCellCoords[0] += diameter * Math.cos((Math.floor(hex / level) * Math.PI/3) + Math.PI/6);
      currCellCoords[1] += diameter * Math.sin((Math.floor(hex / level) * Math.PI/3) + Math.PI/6);
    }
  }

  _STAGE.add(layer);
  return hexes;
}