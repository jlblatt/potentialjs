var st = new Date();

var _LENGTH = $(window).width() < $(window).height() ? $(window).width() : $(window).height();
var _GRIDDEPTH = location.search != "" ? parseInt(location.search.replace('?', '')) : 6;
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

var _GRID = new Grid(_STAGE, _GRIDDEPTH, _MOVEMENT_MATRIX);
var _TOKEN = new Token(_STAGE);
_GRID.attachToken(_TOKEN);

var et = new Date();
console.log("init took: " + (et - st) + "ms");



$(window).keydown(function(e)
{
  var code = e.keyCode || e.which;
  var keysToUse = [12, 33, 36, 37, 38, 39, 65, 68, 69, 81, 83, 87];

  if($.inArray(code, keysToUse) > -1) //e.preventDefault();

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