_WIDTH = 600;
_HEIGHT = 600;
_GRIDDEPTH = location.search != "" ? location.search.replace('?', '') : 3;

_STAGE = new Kinetic.Stage({
  container: 'stage',
  width: _WIDTH,
  height: _HEIGHT
});

resizeStage(_WIDTH, _HEIGHT);

_GRID = createGrid(_GRIDDEPTH);