//TODO:
//
//  -rules
//  -clean/refactor (always)
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

_STAGE.on("mousedown touchdown touchstart", function(){
  var pos = _STAGE.getPointerPosition();
  if(pos !== undefined)
  {
    _STAGE.xdown = pos.x;
    _STAGE.ydown = pos.y;
  }
});

_STAGE.on("mouseup touchup touchend", function(){
  var pos = _STAGE.getPointerPosition();
  if(pos !== undefined && _STAGE.xdown !== undefined && _STAGE.ydown !== undefined)
  {
    var dx = pos.x - _STAGE.xdown;
    var dy = pos.y - _STAGE.ydown;
    if(Math.abs(dx) + Math.abs(dy) > _GRID.cellDiameter)
    {
      //swipe - determine direction
      var theta = -Math.atan2(dy, dx) * 180 / Math.PI;
      
      if(theta < 120 && theta > 60) _TOKEN.moveByDir(0);
      else if(theta < 60 && theta > 0) _TOKEN.moveByDir(1);
      else if(theta < 0 && theta > -60) _TOKEN.moveByDir(2);
      else if(theta < -60 && theta > -120) _TOKEN.moveByDir(3);
      else if(theta < -120 && theta > -180) _TOKEN.moveByDir(4);
      else if(theta < 180 && theta > 120) _TOKEN.moveByDir(5);
    }

    else
    {
      //tap

    }
  }
});

var _THEMER = new Themer();
var _GRID = new Grid(_STAGE, _GRIDDEPTH, _MOVEMENT_MATRIX, null, _THEMER);
var _TOKEN = new Token(_STAGE, _GRID, _THEMER);

var _INFECTION = new Infection(_GRID, _GRID.depth);

_THEMER.applyTheme('radial_rainbow');
setInterval(function(){ _THEMER.currentTheme.swatches.push(_THEMER.currentTheme.swatches.shift()); _THEMER.applyTheme('radial_rainbow'); }, 100);

var et = new Date();
//console.log("init took: " + (et - st) + "ms");



$(window).keydown(function(e)
{
  var code = e.keyCode || e.which;
  var keysToUse = [65, 68, 69, 81, 83, 87];

  if($.inArray(code, keysToUse) > -1) e.preventDefault();

  //w
  if(code == 87)
    _TOKEN.moveByDir(0);
  
  //e
  else if(code == 69)
    _TOKEN.moveByDir(1);
  
  //d
  else if(code == 68)
    _TOKEN.moveByDir(2);

  //s
  else if(code == 83)
    _TOKEN.moveByDir(3);

  //a
  else if(code == 65)
    _TOKEN.moveByDir(4);

  //q
  else if(code == 81)
    _TOKEN.moveByDir(5);

});