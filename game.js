
/* global constants */

var stage;
var grid = [];
var spawn = {};

var grid_size = 40;
var game_width = 25;
var game_height = 30;

var surface_height = 50;

var FPS = 10;

var colors = {
    'dirt': '#292426',
    'rock': 'gray',
    'iron': '#0D0B0C',
    'backfill': 'pink',
    'unexplored': 'black'
};

function createSpawn(xpos){
    spawn.shape = new createjs.Shape();
    spawn.shape.graphics.beginFill('#22B709')
                       .drawCircle(0,0,8);                       
    spawn.shape.x = grid_size*(xpos + 0.5);
    spawn.shape.y = grid_size*(0 + 0.5) + surface_height;
    stage.addChild(spawn.shape);
}

function moveSpawn(direction){
  if (direction=="left"){
    spawn.shape.x = spawn.shape.x - grid_size;

  }
  else if (direction=="right"){
    spawn.shape.x = spawn.shape.x + grid_size;

  }
}

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
        this.baseAmount = amount;
        this.type = type;
        this.explored = false; // true to disable for of war

        this.refresh();
    };

    this.refresh = function () {
        this.shape.graphics.clear();
        this.shape.graphics.beginFill(colors[this.getType()]);
        this.shape.graphics.rect(0, 0, size, size);
    };

    this.getType = function() {
        return this.explored ? (this.type || type) : "unexplored";
    };

    this.setExplored = function() {
        this.explored = true;
        this.refresh();
    };

   this.setType = function (newType) {
        this.type = newType;
        this.refresh();
    };

    this.init();
}

function tick() {
    activeBots.forEach(function(bot) {
        bot.moveToward(bot.destX, bot.destY);
    });

    stage.update();
}

function init_stage(width, height, size, surface_px) {

    window.stage = new createjs.Stage("mainCanvas");


    for (var i = 0; i < width; i++) {
      var line = [];
      for (var j = 0; j < height; j++) {
        var resourceName = generate_terrain(j, height);
        if (j === 0) {
            resourceName = "dirt";
        }
        var amount = Math.floor(Math.random() * 20);
        var g = new Tile(i*size,
                             surface_px + j * size,
                             size,
                             resourceName,
                             amount);

        //Backbone.trigger('stageClick

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
    createSpawn(Math.floor(width/2));
    stage.update();

    createjs.Ticker.addEventListener("tick", tick);
    createjs.Ticker.setFPS(FPS);
}

/* maps resources to function from depth to prob at depth */
var resource_weights = {
    'iron': {p: 0.01, d_weight: 0.2},
    'stone': {p: 0.1, d_weight: 0.1},
    'dirt': {p: 1, d_weight: 0}
}

function normalize(array) {
    var total = _.reduce(array,
            function(m, n) { return m + n;},
            0);
    return _.map(array, function(x) { return x / total; });
}

function generate_terrain(depth) {

  var probs = _.map(resource_weights, function(x) {
      return x.p * Math.exp(x.d_weight * depth);
  });

  probs = normalize(probs);
  var rand = Math.random();


  var dirtProbability = 1;
  var stoneProbability = 0.1*Math.exp(depth*0.1);
  var ironProbability = 0.01*Math.exp(depth*0.2);
  var normalization = dirtProbability+stoneProbability+ironProbability;
  dirtProbability = dirtProbability/normalization;
  stoneProbability = stoneProbability/normalization;
  ironProbability = ironProbability/normalization;
  var mineralSelect = Math.random();
  if(mineralSelect <=ironProbability){
    return "iron";
  }
  else if (mineralSelect <=ironProbability + stoneProbability){
    return "rock";
  }
  else {
    return "dirt";
  }
}


init_stage(game_width, game_height, grid_size, surface_height);


document.onkeydown = checkKey;



function checkKey(key) {

    key = key || window.event;

    if (key.keyCode == '37') {
        // left arrow
        moveSpawn("left")
    }
    else if (key.keyCode == '39') {
        // right arrow
        moveSpawn("right")
    }
}

