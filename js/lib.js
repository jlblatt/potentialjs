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

//http://stackoverflow.com/a/10142256
Array.prototype.shuffle = function() {
  var i = this.length, j, temp;
  if ( i == 0 ) return this;
  while ( --i ) {
     j = Math.floor( Math.random() * ( i + 1 ) );
     temp = this[i];
     this[i] = this[j];
     this[j] = temp;
  }
  return this;
}