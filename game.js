var stage;
var grid = [];

function GridElem(pixel_x, pixel_y, size) {
    this.shape = new createjs.Shape();
    this.shape.graphics.beginFill("brown");
    this.shape.graphics.rect(0, 0, size, size);

    this.shape.x = pixel_x;
    this.shape.y = pixel_y;
    stage.addChild(this.shape);
}

function init() {

    var width = 100;
    var height = 30;

    var start_at = 100;

    var size = 10;

    stage = new createjs.Stage("mainCanvas");

    for (var i = 0; i < width; i++) {
      var line = [];
      for (var j = 0; j < height; j++) {
        var g = new GridElem(i*size,start_at+j*size, size);
        line.push(g);
      }
      grid.push(line);
    }

    stage.update();
}

init();
