function resizeStage(stage, x, y)
{
  $("#stage").css({
    'width' : x,
    'height' : y,
    'margin-left' : - parseInt(x/2),
    'margin-top' : - parseInt(y/2)
  });

  stage.setWidth(x);
  stage.setHeight(y);
}