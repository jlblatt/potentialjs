function resizeStage(stage, length, scale)
{
  $("#stage").css({
    'width' : length,
    'height' : length,
    'margin-left' : - parseInt(length/2),
    'margin-top' : - parseInt(length/2)
  });

  stage.setWidth(length);
  stage.setHeight(length);
  stage.scaleX(scale);
  stage.scaleY(scale);
  stage.draw();
}