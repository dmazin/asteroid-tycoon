
/* global constants */

var stage;
var spawner;

var grid_size = 40;
var game_width = 25;
var game_height = 30;
var surface_height = 100;
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

function init_ui() {
    window.statTemplate = _.template($('#mineral-stat-template').html());

    _.each(resources, function(val, key) {
        if (val.harvestable) {
            $('.general-stats').append(statTemplate({
                name: key,
                amount: 0
            }));
        }
    });
}

function init_stage() {
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
