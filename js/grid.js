function Grid(stage, depth, matrix, token, themer)
{
  this.stage = stage;
  this.depth = depth;
  
  this.tokens = [];

  if(token)
  {
    this.currToken = token;
    token.grid = this;
  }

  if(themer)
  {
    this.themer = themer;
    themer.grid = this;
  }

  this.cellDiameter = stage.width() / (depth * 2);

  this.cells = [];

  var len = this.cellDiameter / Math.sqrt(3);

  //setup our first cell
  var originHex = new Kinetic.Line({
    x: stage.width()/2,
    y: stage.height()/2,
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
    closed: true
  });

  originHex.gridID = 0;
  originHex.level = 0;
  originHex.wrapper = this;

  originHex.holding = false;

  this.layer = new Kinetic.Layer();
  this.layer.add(originHex);
  this.cells.push(originHex);

  //each level of the grid
  for(var level = 1; level < depth; level++)
  {
    var alpha = 1 - ((1 / (depth)) * level);
    var currCellCoords = [0, -level * this.cellDiameter];

    //each cell in this level
    for(hex = 0; hex < level * 6; hex++)
    {
      //create the cell
      var thisHex = new Kinetic.Line({
        x: currCellCoords[0] + (stage.width()/2),
        y: currCellCoords[1] + (stage.height()/2),
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
        closed: true
      });

      thisHex.gridID = this.cells.length;
      thisHex.level = level; 
      thisHex.wrapper = this;

      thisHex.holding = false;

      this.layer.add(thisHex);
      this.cells.push(thisHex);

      //calculate coordinates of next cell (this is the fun part)
      currCellCoords[0] += this.cellDiameter * Math.cos((Math.floor(hex / level) * Math.PI/3) + Math.PI/6);
      currCellCoords[1] += this.cellDiameter * Math.sin((Math.floor(hex / level) * Math.PI/3) + Math.PI/6);
    }
  }

  if(depth < matrix.length)
  {
    for(var i = 0; i < this.cells.length; i++)
    {
      this.cells[i].neighbors = matrix[depth][i];
    }
  }

  else
  {
    //calculate neighbor cells for quick movement (if not in matrix already)- this takes a long time
    for(var i = 0; i < this.cells.length; i++)
    {
      this.cells[i].neighbors = [];
      this.cells[i].neighbors.push(this.findNearestFuzzy(this.cells[i].x(), this.cells[i].y() - this.cellDiameter));
      this.cells[i].neighbors.push(this.findNearestFuzzy(this.cells[i].x() + this.cellDiameter * Math.cos(Math.PI/6), this.cells[i].y() - this.cellDiameter * Math.sin(Math.PI/6)));
      this.cells[i].neighbors.push(this.findNearestFuzzy(this.cells[i].x() + this.cellDiameter * Math.cos(Math.PI/6), this.cells[i].y() + this.cellDiameter * Math.sin(Math.PI/6)));
      this.cells[i].neighbors.push(this.findNearestFuzzy(this.cells[i].x(), this.cells[i].y() + this.cellDiameter));
      this.cells[i].neighbors.push(this.findNearestFuzzy(this.cells[i].x() - this.cellDiameter * Math.cos(Math.PI/6), this.cells[i].y() + this.cellDiameter * Math.sin(Math.PI/6)));
      this.cells[i].neighbors.push(this.findNearestFuzzy(this.cells[i].x() - this.cellDiameter * Math.cos(Math.PI/6), this.cells[i].y() - this.cellDiameter * Math.sin(Math.PI/6)));
    }
  }

  stage.add(this.layer);
}



Grid.prototype.captureToken = function()
{
  if(this.currToken.gridID != 0)
  {
    this.cells[this.currToken.gridID].holding = true;
    this.tokens.push(this.currToken);
    this.generateToken();
    this.themer.refreshTheme();
  }
}




Grid.prototype.generateToken = function()
{
  this.currToken = new Token(this.stage.width() / (2 * this.stage.scaleX()), this.stage.height() / (2 * this.stage.scaleY()), this.cellDiameter);
  this.currToken.grid = this;
  this.layer.add(this.currToken.k);

  var tween = new Kinetic.Tween({
    node: this.currToken.k, 
    duration: .2,
    scaleX: 1,
    scaleY: 1,
    rotation: 0
  });
      
  tween.play();
}



Grid.prototype.findNearestFuzzy = function(x, y)
{
  for(var i = 0; i < this.cells.length; i++)
  {
    if( (Math.abs(x - this.cells[i].x())) < this.cellDiameter/1024 && (Math.abs(y - this.cells[i].y())) < this.cellDiameter/1024 )
    {
      return i;
    }
  }
}



Grid.prototype.findNearestExact = function(x, y)
{
  //account for scaling here
  x = x / this.stage.scaleX();
  y = y / this.stage.scaleY();

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