
/* global constants */

var stage;
var grid = [];

var grid_size = 20;
var game_width = 50;
var game_height = 60;

var surface_height = 50;

var FPS = 30;

var colors = {
    'dirt': '#292426',
    'rock': 'gray',
    'iron': 'black',
    'backfill': 'pink',
    'unexplored': '#0D0B0C'
};

function Tile(pixel_x, pixel_y, size, type, amount) {
    /* create the easeljs shape object that
     * draws this Tile, and add it to the
     * stage
     */

    this.init = function () {
        this.shape = new createjs.Shape();
        this.shape.x = pixel_x;
        this.shape.y = pixel_y;
        stage.addChild(this.shape);

        this.amount = amount;
        this.type = type;
        this.explored = false;

        this.refresh();
    }

    this.refresh = function () {
        this.shape.graphics.clear();
        this.shape.graphics.beginFill(colors[this.getType()]);
        this.shape.graphics.rect(0, 0, size, size);
    }

    this.getType = function() {
        return this.explored ? (this.type || type) : "unexplored";
    };

    this.setExplored = function() {
        this.explored = true;
        this.refresh();
    };

<<<<<<< HEAD
    this.shape = new createjs.Shape();
    this.shape.graphics.beginFill(colors[type]);
    this.shape.graphics.rect(0, 0, size, size);

    this.shape.x = pixel_x;
    this.shape.y = pixel_y;
    stage.addChild(this.shape);

    this.amount = amount;
    this.type = type;
    this.explored = true;
=======
    this.setType = function (newType) {
        this.type = newType;
        this.refresh();
    }

    this.init();
>>>>>>> 1b07ea87a9eebf74a3a3e63142bdaf1a8818a935
}

function tick() {
    stage.update();
}

function init_stage(width, height, size, surface_px) {

    stage = new createjs.Stage("mainCanvas");

    for (var i = 0; i < width; i++) {
      var line = [];
      for (var j = 0; j < height; j++) {
        var resourceName = generate_terrain(j);
        if (j === 0) {
            resourceName = "dirt";
        }
        var amount = Math.floor(Math.random() * 20);
        var g = new Tile(i*size,
                             surface_px + j * size,
                             size,
                             resourceName,
                             amount);

        // Mouseover crap - bad
        //stage.enableMouseOver();
        //g.shape.on('mouseover', function(event) {
            //event.target.graphics.clear().beginFill('#fff').drawRect(0, 0, 20, 20).endFill();
        //});
        //g.shape.on('mouseout', function(event) {
            //event.target.graphics.clear().beginFill(colors[g.getType()]).drawRect(0, 0, 20, 20).endFill();
        //});

        line.push(g);
      }
      grid.push(line);
    }

    stage.update();

    createjs.Ticker.addEventListener("tick", tick);
    createjs.Ticker.setFPS(FPS);
}

function generate_terrain(depth){
  var dirtProbability = 1;
  var stoneProbability= .1*Math.exp(depth*.1);
  var ironProbability= .01*Math.exp(depth*.2);
  var normalization = dirtProbability+stoneProbability+ironProbability;
  dirtProbability = dirtProbability/normalization;
  stoneProbability = stoneProbability/normalization;
  ironProbability = ironProbability/normalization;
  var mineralSelect = Math.random();
  if(mineralSelect <=ironProbability){
    return "iron";
  }
  else if (mineralSelect <=ironProbability + stoneProbability){
    return "stone";
  }
  else {
    return "dirt";
  }
}


init_stage(game_width, game_height, grid_size, surface_height);
