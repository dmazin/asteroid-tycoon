
/* global constants */

var stage;
var grid = [];

var grid_size = 20;
var game_width = 50;
var game_height = 60;

function Tile(pixel_x, pixel_y, size, type, amount) {

    /* create the easeljs shape object that
     * draws this Tile, and add it to the
     * stage
     */
    this.shape = new createjs.Shape();
    this.shape.graphics.beginFill("brown");
    this.shape.graphics.rect(0, 0, size, size);

    this.shape.x = pixel_x;
    this.shape.y = pixel_y;
    stage.addChild(this.shape);

    this.type = type;
    this.amount = amount;
}


Tile.prototype.changeTerrainType = function(new_type) {
    this.terrain_type = new_type;
    /* this is where we redraw the Tile
     * if we need to based on the new terrain type
     */
}

function init_stage(width, height, size, surface_px) {

    stage = new createjs.Stage("mainCanvas");

    for (var i = 0; i < width; i++) {
      var line = [];
      for (var j = 0; j < height; j++) {
        var g = new Tile(i*size,
                             surface_px + j * size,
                             size);
        line.push(g);
      }
      grid.push(line);
    }

    stage.update();
}

init_stage(game_width, game_height, grid_size, 100);
