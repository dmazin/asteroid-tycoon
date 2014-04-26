var stage;
var grid = [];

function GridElem(pixel_x, pixel_y, size) {

    /* create the easeljs shape object that
     * draws this GridElem, and add it to the
     * stage
     */
    this.shape = new createjs.Shape();
    this.shape.graphics.beginFill("brown");
    this.shape.graphics.rect(0, 0, size, size);

    this.shape.x = pixel_x;
    this.shape.y = pixel_y;
    stage.addChild(this.shape);

    this.terrain_type = 'unexplored';
}

GridElem.prototype.changeTerrainType = function(new_type) {
    this.terrain_type = new_type;
    /* this is where we redraw the GridElem 
     * if we need to based on the new terrain type
     */
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
