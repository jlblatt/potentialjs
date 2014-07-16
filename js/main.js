//TODO:
//
//  -rules
//  -clean/refactor (always)
//  -do we need jquery?
//

var st = new Date();

var _LENGTH = $(window).width() < $(window).height() ? $(window).width() : $(window).height();
var _GRIDDEPTH = location.search != "" ? parseInt(location.search.replace('?', '')) : 5;

var _STAGE = new Kinetic.Stage({
  container: 'stage',
  width: _LENGTH,
  height: _LENGTH
});
_STAGE.origLength = _LENGTH;

resizeStage(_STAGE, _STAGE.width(), 1);
$(window).resize(function(){
  var newLength = $(window).width() < $(window).height() ? $(window).width() : $(window).height();
  resizeStage(_STAGE, newLength,  newLength / _STAGE.origLength);
});

var _HITLAYER = new Kinetic.Layer();
var _HITBOX = new Kinetic.Line({
  x: 0,
  y: 0,
  points: [0,0,0,_STAGE.height(),_STAGE.width(),_STAGE.height(),_STAGE.width(),0],
  fillRed: 0,
  fillGreen: 0,
  fillBlue: 0,
  fillAlpha: 0,
  closed: true
});
_HITLAYER.add(_HITBOX);
_STAGE.add(_HITLAYER);

$(window).on("mousedown touchstart", function(e){
  var posX, posY;

  if(e.originalEvent.touches)
  {
    posX = e.originalEvent.touches[0].pageX;
    posY = e.originalEvent.touches[0].pageY;
  }
  else
  {
    posX = e.originalEvent.pageX;
    posY = e.originalEvent.pageY;
  }

  if(posX !== undefined && posY !== undefined)
  {
    _STAGE.xdown = posX;
    _STAGE.ydown = posY;
  }
});

$(window).on("touchmove", function(e){
  //e.preventDefault();
});

$(window).on("mouseup touchend", function(e){
  var posX, posY;

  if(e.originalEvent.changedTouches)
  {
    posX = e.originalEvent.changedTouches[0].pageX;
    posY = e.originalEvent.changedTouches[0].pageY;
  }
  else
  {
    posX = e.originalEvent.pageX;
    posY = e.originalEvent.pageY;
  }

  if(posX !== undefined && posY !== undefined && _STAGE.xdown !== undefined && _STAGE.ydown !== undefined)
  {
    var dx = posX - _STAGE.xdown;
    var dy = posY - _STAGE.ydown;
    if(Math.abs(dx) + Math.abs(dy) > _GRID.cellDiameter)
    {
      //swipe - determine direction
      var theta = -Math.atan2(dy, dx) * 180 / Math.PI;
      
      if(theta < 120 && theta > 60) _GRID.currToken.moveByDir(0);
      else if(theta < 60 && theta > 0) _GRID.currToken.moveByDir(1);
      else if(theta < 0 && theta > -60) _GRID.currToken.moveByDir(2);
      else if(theta < -60 && theta > -120) _GRID.currToken.moveByDir(3);
      else if(theta < -120 && theta > -180) _GRID.currToken.moveByDir(4);
      else if(theta < 180 && theta > 120) _GRID.currToken.moveByDir(5);
    }

    else
    {
      //tap
      _GRID.captureToken();
    }
  }
});

$(window).on("keydown", function(e)
{
  var code = e.keyCode || e.which;
  var keysToUse = [32, 65, 68, 69, 81, 83, 87];

  if($.inArray(code, keysToUse) > -1) e.preventDefault();

  if(code == 87) _GRID.currToken.moveByDir(0); //w
  else if(code == 69) _GRID.currToken.moveByDir(1); //e
  else if(code == 68) _GRID.currToken.moveByDir(2); //d
  else if(code == 83) _GRID.currToken.moveByDir(3); //s
  else if(code == 65) _GRID.currToken.moveByDir(4); //a
  else if(code == 81) _GRID.currToken.moveByDir(5); //q
  else if(code == 32) _GRID.captureToken(); //space
});

var _THEMER = new Themer();
var _GRID = new Grid(_STAGE, _GRIDDEPTH, _MOVEMENT_MATRIX, null, _THEMER);
_GRID.generateToken();

_THEMER.applyTheme('bone');
//_THEMER.applyTheme('radial_rainbow');
//setInterval(function(){ _THEMER.currentTheme.swatches.push(_THEMER.currentTheme.swatches.shift()); _THEMER.applyTheme('radial_rainbow'); }, 100);

var et = new Date();
//console.log("init took: " + (et - st) + "ms");