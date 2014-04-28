
/* global constants */

var stage;
var spawner;

var grid_size = 40;
var game_width = 25;
var game_height = 30;
var surface_height = 75;
var FPS = 10;

function createSpawn(xpos){
    spawner = new createjs.Shape();
    spawner.graphics.beginFill('#22B709')
                       .drawCircle(0,0,8);
    spawner.x = grid_size*(xpos + 0.5);
    spawner.y = grid_size*(0 + 0.5) + surface_height;

    spawner.on("mousedown", function(evt) {
        this.offset = {x:this.x-evt.stageX, y:this.y-evt.stageY};
    });

    spawner.on("pressmove", function(evt) {
        var gs = grid_size;
        this.x = Math.round((evt.stageX + this.offset.x - gs / 2) / gs) * gs + gs / 2;
        if (this.x < 0) {
            this.x = 0;
        } else if (this.x > gs * game_width) {
            this.x = gs * game_width;
        }
    });

    stage.addChild(spawner);
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
        this.shape.image = resources[this.getType()].image;
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
        bot.handleMove(bot.destX, bot.destY);
    });

    var gs = grid_size;
    stage.destTile.x = Math.round((stage.mouseX - gs / 2) / gs) * gs + gs / 2;
    stage.destTile.y = Math.round((stage.mouseY - gs / 2) / gs) * gs + gs / 2;
    stage.destTile.visible = $('canvas').hasClass('botSpawner')
        && stage.mouseInBounds && stage.destTile.y >= surface_height;

    stage.update();
}

function init_stage() {
    window.stage = new createjs.Stage("mainCanvas");

    playerState.getAsteroid().init();

    createSpawn(Math.floor(game_width/2));
    stage.update();

    stage.destTile = new createjs.Shape();
    stage.destTile.graphics.beginFill('blue')
                            .drawCircle(0,0,8);
    stage.addChild(stage.destTile);

    createjs.Ticker.addEventListener("tick", tick);
    createjs.Ticker.setFPS(FPS);

    stage.enableMouseOver(10);
}
