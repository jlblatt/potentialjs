_WIDTH = 600;
_HEIGHT = 600;
_DIAMETER = 0;
_GRIDDEPTH = location.search != "" ? parseInt(location.search.replace('?', '')) : 3;

_STAGE = new Kinetic.Stage({
  container: 'stage',
  width: _WIDTH,
  height: _HEIGHT
});

resizeStage(_WIDTH, _HEIGHT);

_GRID = createGrid(_GRIDDEPTH);

_TOKEN = createToken();

$(window).keyup(function(e)
{
  var code = e.keyCode || e.which;
  e.preventDefault();

  //q or 7
  if(code == 81 || code == 36)
    dropNearest(_TOKEN, _TOKEN.x() - _DIAMETER * Math.cos(Math.PI/6), _TOKEN.y() - _DIAMETER * Math.sin(Math.PI/6));
  
  //w or 8
  else if(code == 87 || code == 38)
    dropNearest(_TOKEN, _TOKEN.x(), _TOKEN.y() - _DIAMETER);
  
  //e or 9
  else if(code == 69 || code == 33)
    dropNearest(_TOKEN, _TOKEN.x() + _DIAMETER * Math.cos(Math.PI/6), _TOKEN.y() - _DIAMETER * Math.sin(Math.PI/6));
  
  //a or 4
  else if(code == 65 || code == 37)
    dropNearest(_TOKEN, _TOKEN.x() - _DIAMETER * Math.cos(Math.PI/6), _TOKEN.y() + _DIAMETER * Math.sin(Math.PI/6));
  
  
  //s or 5
  else if(code == 83 || code == 12)
    dropNearest(_TOKEN, _TOKEN.x(), _TOKEN.y() + _DIAMETER);
  
  //d or 6
  else if(code == 68 || code == 39)
    dropNearest(_TOKEN, _TOKEN.x() + _DIAMETER * Math.cos(Math.PI/6), _TOKEN.y() + _DIAMETER * Math.sin(Math.PI/6));

  _TOKENLAYER.draw();
});