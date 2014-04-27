
/* global constants */

var stage;
var grid = [];

var grid_size = 20;
var game_width = 50;
var game_height = 60;

var surface_height = 100;

var FPS = 30;

var colors = {
    'dirt': 'brown',
    'rock': 'gray',
    'iron': 'black'
};

function Tile(pixel_x, pixel_y, size, type, amount) {

    /* create the easeljs shape object that
     * draws this Tile, and add it to the
     * stage
     */
    this.shape = new createjs.Shape();
    this.shape.graphics.beginFill(colors[type]);
    this.shape.graphics.rect(0, 0, size, size);

    this.shape.x = pixel_x;
    this.shape.y = pixel_y;
    stage.addChild(this.shape);

    this.amount = amount;
    this.type = type;
    this.explored = false;

    this.getType = function() {
        return this.explored ? this.type : "dirt";
    };
}

function tick() {
    stage.update();
}

function init_stage(width, height, size, surface_px) {

    stage = new createjs.Stage("mainCanvas");

    for (var i = 0; i < width; i++) {
      var line = [];
      for (var j = 0; j < height; j++) {
        var resourceName = ["dirt", "rock", "iron"][Math.floor(Math.random() * 3)];
        if (j === 0) {
            resourceName = "dirt";
        }
        var amount = Math.floor(Math.random() * 20);
        var g = new Tile(i*size,
                             surface_px + j * size,
                             size,
                             resourceName,
                             amount);
        line.push(g);
      }
      grid.push(line);
    }

    stage.update();

    createjs.Ticker.addEventListener("tick", tick);
    createjs.Ticker.setFPS(FPS);
}

init_stage(game_width, game_height, grid_size, surface_height);
