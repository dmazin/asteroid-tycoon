
/* global constants */

var stage;
var grid = [];
var spawn = {};

var grid_size = 40;
var game_width = 25;
var game_height = 30;

var surface_height = 75;

var FPS = 10;

var colors = {
    'dirt': '#292426',
    'rock': 'gray',
    'iron': '#0D0B0C',
    'backfill': 'pink',
    'unexplored': 'black'
};

// constants for scaling robot attributes for balancing purposes
var energy_scale = .2;

function createSpawn(xpos){
    spawn.shape = new createjs.Shape();
    spawn.shape.graphics.beginFill('#22B709')
                       .drawCircle(0,0,8);
    spawn.shape.x = grid_size*(xpos + 0.5);
    spawn.shape.y = grid_size*(0 + 0.5) + surface_height;

    spawn.shape.on("mousedown", function(evt) {
        this.offset = {x:this.x-evt.stageX, y:this.y-evt.stageY};
    });

    spawn.shape.on("pressmove", function(evt) {
        var gs = grid_size;
        this.x = Math.round((evt.stageX + this.offset.x - gs / 2) / gs) * gs + gs / 2;
        if (this.x < 0) {
            this.x = 0;
        } else if (this.x > gs * game_width) {
            this.x = gs * game_width;
        }
    });

    stage.addChild(spawn.shape);
}

function Tile(pixel_x, pixel_y, size, type, amount, pos) {
    /* create the easeljs shape object that
     * draws this Tile, and add it to the
     * stage
     */

    this.init = function () {
        this.shape = new createjs.Bitmap(resources[this.getType()].image);
        this.shape.x = pixel_x;
        this.shape.y = pixel_y;
        stage.addChild(this.shape);

        this.amount = amount;
        this.baseAmount = amount;
        this.type = type;
        this.explored = false; // true to disable fog of war
        if (pos[1] < 2) { // no FOW on first two rows, let's say
            this.explored = true;
        }

        this.refresh();
    };

    this.refresh = function () {
        stage.removeChild(this.shape);
        this.shape = new createjs.Bitmap(resources[this.getType()].image);
        this.shape.x = pixel_x;
        this.shape.y = pixel_y;
        stage.addChildAt(this.shape, 0);
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
                             amount,
                             [i, j]);

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

    stage.enableMouseOver(10);
}

function normalize(array) {
    var total = _.reduce(array,
            function(m, n) { return m + n;},
            0);
    return _.map(array, function(x) { return x / total; });
}

function generate_terrain(depth) {
    var resources = [];
    var maxDepth = game_height;
    var probs = _.map(resource_weights, function(x, r) {
        resources.push(r);
        if (depth < x.minDepth) {
            return 0;
        } else {
            return (maxDepth - depth) * x.pTop + depth * x.pBottom;
        }
    });

    probs = normalize(probs);
    var rand = Math.random();

    var accum = 0;
    for (var i = 0; i < resources.length; i++) {
        accum += probs[i];
        if (rand < accum) {
            return resources[i];
        }
    }
}

init_stage(game_width, game_height, grid_size, surface_height);
