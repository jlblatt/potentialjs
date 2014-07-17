function resizeStage(stage, width, height)
{
  stage.setWidth(width);
  stage.setHeight(height);

  /*var scalex = width / stage.origWidth;
  var scaley = height / stage.origHeight;
  var newscale = scalex < scaley ? scalex : scaley;
  stage.scaleX(newscale);
  stage.scaleY(newscale);*/

  stage.offsetX((stage.origWidth - width) / 2);
  stage.offsetY((stage.origHeight - height) / 2);

  stage.draw();
}

function loadIcons()
{
  var imgs = {};

  for(var i = 0; i < _ELEMENTS.length; i++)
  {
    var img = new Image(); img.src = 'img/elements/png/white/' + _ELEMENTS[i] + '.png';
    imgs[_ELEMENTS[i]] = img;
  }

  return imgs;
}

function loadSounds()
{
  return {
    "spawn" : new Audio('sfx/spawn.wav'),
    "swipe" : new Audio('sfx/swipe.wav'),
    "drop" : new Audio('sfx/drop.wav'),
    "collide" : new Audio('sfx/collide.wav')
  }
}

function combineElements(ele1, ele2)
{
  if(
    (ele1 == "fire"  && ele2 == "water") ||
    (ele1 == "water" && ele2 == "fire")  ||
    (ele1 == "earth" && ele2 == "air")   ||
    (ele1 == "air"   && ele2 == "earth") ||
    (ele1 == "dark"  && ele2 == "light") ||
    (ele1 == "light" && ele2 == "dark")
  ) return -1
  
  else if(
    (ele1 == "fire"  && ele2 == "fire") ||
    (ele1 == "water" && ele2 == "water")  ||
    (ele1 == "earth" && ele2 == "earth")   ||
    (ele1 == "air"   && ele2 == "air") ||
    (ele1 == "dark"  && ele2 == "dark") ||
    (ele1 == "light" && ele2 == "light")  
  ) return 1;
  
  else return 0;
}