//TODO:
//
//  -rules
//  -clean globals out of class functions
//

var st = new Date();

var _LENGTH = $(window).width() < $(window).height() ? $(window).width() : $(window).height();
var _GRIDDEPTH = location.search != "" ? parseInt(location.search.replace('?', '')) : 5;
var _DIAMETER = _LENGTH / (_GRIDDEPTH * 2);

var _STAGE = new Kinetic.Stage({
  container: 'stage',
  width: _LENGTH,
  height: _LENGTH
});

resizeStage(_STAGE, _LENGTH, 1);
$(window).resize(function(){
  var newLength = $(window).width() < $(window).height() ? $(window).width() : $(window).height();
  resizeStage(_STAGE, newLength,  newLength / _LENGTH);
});

var _HITLAYER = new Kinetic.Layer();
var _HITBOX = new Kinetic.Line({
  x: 0,
  y: 0,
  points: [0,0,0,_LENGTH,_LENGTH,_LENGTH,_LENGTH,0],
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
    if(Math.abs(dx) + Math.abs(dy) > _DIAMETER)
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
  }
});

var _GRID = new Grid(_STAGE, _GRIDDEPTH, _MOVEMENT_MATRIX);
var _TOKEN = new Token(_STAGE);
_GRID.attachToken(_TOKEN);

//var _INFECTION = new Infection(_GRID, _GRIDDEPTH);
var _THEMER = new Themer();
_THEMER.applyTheme('default', _GRID, _TOKEN);
//setInterval(function(){ _THEMER.applyTheme('rainbow', _GRID, _TOKEN); }, 300);

var et = new Date();
//console.log("init took: " + (et - st) + "ms");



$(window).keydown(function(e)
{
  var code = e.keyCode || e.which;
  var keysToUse = [12, 33, 36, 37, 38, 39, 65, 68, 69, 81, 83, 87];

  if($.inArray(code, keysToUse) > -1) e.preventDefault();

  //w or 8
  if(code == 87 || code == 38)
    _TOKEN.moveByDir(0);
  
  //e or 9
  else if(code == 69 || code == 33)
    _TOKEN.moveByDir(1);
  
  //d or 6
  else if(code == 68 || code == 39)
    _TOKEN.moveByDir(2);

  //s or 5
  else if(code == 83 || code == 12)
    _TOKEN.moveByDir(3);

  //a or 4
  else if(code == 65 || code == 37)
    _TOKEN.moveByDir(4);

  //q or 7
  else if(code == 81 || code == 36)
    _TOKEN.moveByDir(5);

});