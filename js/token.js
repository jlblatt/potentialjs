function Token(x, y, diameter, element)
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
    closed: true,
    scaleX: 0,
    scaleY: 0,
    rotation: -120,
    strokeWidth: len / 10,
    fillRed: 255,
    fillGreen: 255,
    fillBlue: 255,
    fillAlpha: 1,
    strokeRed: 255,
    strokeGreen: 255,
    strokeBlue: 255,
    strokeAlpha: .8,
    shadowColor: 'white',
    shadowBlur: len * 4,
    tension: .9
  });

  if(element)
  {
    this.element = element;
    this.icon = new Kinetic.Image({
      x: x,
      y: y,
      offsetX: (len / 2),
      offsetY: (len / 2),
      image: _ICONS[element],
      width: len,
      height: len,
      scaleX: 0,
      scaleY: 0,
      rotation: -120,
      opacity: .9
    });
  }
}

Token.prototype.moveTo = function(cid)
{
  if(cid === undefined) return;
  this.gridID = cid;
  var dx = this.grid.cells[cid].x() - this.k.x();
  var dy = this.grid.cells[cid].y() - this.k.y();
  var duration = Math.abs(Math.sqrt((dx * dx) + (dy * dy))) / (this.grid.stage.origWidth * 1.5);

  var thisToken = this;
  thisToken.k.rotation(-120);

  var tokenTween = new Kinetic.Tween({
    node: thisToken.k, 
    duration: duration,
    easing: Kinetic.Easings.BackEaseOut,
    x: this.grid.cells[cid].x(),
    y: this.grid.cells[cid].y(),
    rotation: 0
  });

  if(thisToken.element)
  {
    var iconTween = new Kinetic.Tween({
      node: thisToken.icon, 
      duration: duration,
      easing: Kinetic.Easings.BackEaseOut,
      x: this.grid.cells[cid].x(),
      y: this.grid.cells[cid].y()
    });
        
    iconTween.play();
  }

  tokenTween.play();

  _SOUNDS.swipe.currentTime = 0;
  _SOUNDS.swipe.play();
}

Token.prototype.collide = function(cid)
{
  if(cid === undefined) return;

  var thisToken = this;
  var otherToken = this.grid.cells[cid].heldToken;

  if(combineElements(thisToken.element, otherToken.element) == -1)
  {
    var dx = this.grid.cells[cid].x() - this.k.x();
    var dy = this.grid.cells[cid].y() - this.k.y();
    var duration = Math.abs(Math.sqrt((dx * dx) + (dy * dy))) / (this.grid.stage.origWidth * 1.5);

    setTimeout(function() {

      var thisTokenTween = new Kinetic.Tween({
        node: thisToken.k, 
        duration: duration * 3,
        easing: Kinetic.Easings.BackEaseIn,
        rotation: 180,
        scaleX: 0,
        scaleY: 0,
        opacity: 0,
        tension: 0
      });

      var thisIconTween = new Kinetic.Tween({
        node: thisToken.icon, 
        duration: duration * 3,
        easing: Kinetic.Easings.EaseOut,
        scaleX: 0,
        scaleY: 0,
        opacity: 0
      });

      var otherTokenTween = new Kinetic.Tween({
        node: otherToken.k, 
        duration: duration * 3,
        easing: Kinetic.Easings.BackEaseIn,
        rotation: 180,
        scaleX: 0,
        scaleY: 0,
        opacity: 0
      });

      var otherIconTween = new Kinetic.Tween({
        node: otherToken.icon, 
        duration: duration * 3,
        easing: Kinetic.Easings.EaseOut,
        scaleX: 0,
        scaleY: 0,
        opacity: 0
      });
      
      thisTokenTween.play();
      thisIconTween.play();
      otherTokenTween.play();
      otherIconTween.play();

      _SOUNDS.collide.currentTime = 0;
      _SOUNDS.collide.play();

      thisToken.grid.cells[cid].holding = false;
      thisToken.grid.cells[cid].heldToken = undefined;
      thisToken.grid.generateToken();

    }, duration);
  }
}

Token.prototype.moveByDir = function(dir)
{
  var currID = this.gridID;
  while(true)
  {
    var nextID = this.grid.cells[currID].neighbors[dir];
    
    if(nextID === undefined || nextID == currID) break;
    else if(this.grid.cells[nextID].holding)
    {
      this.collide(nextID);
      break;
    }
    else
    {
      currID = nextID;
      //if(currID == 0) break;
    }
  }

  this.moveTo(currID);
}