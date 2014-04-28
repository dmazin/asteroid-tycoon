
/* global constants */

var stage;
var spawner;

var grid_size = 40;
var game_width = 25;
var game_height = 30;
var surface_height = 180;
var FPS = 10;

function createSpawn(xpos){
    var spaceshipSpritesheet = new createjs.SpriteSheet({
        images: ["pics/other/spaceship.png"],
        frames: {width:240, height:120}
    });
    spawner = new createjs.Sprite(spaceshipSpritesheet);
    spawner.gotoAndPlay(0);
    spawner.x = grid_size*xpos - 110;
    spawner.y = grid_size - 20;

    spawner_back = new createjs.Shape();
    spawner_back.graphics.beginFill('red')
                         .rect(-120,-60,240,120);
    spawner_back.x = grid_size*(xpos + 0.5);
    spawner_back.y = grid_size*(0 + 0.5);
    spawner_back.alpha = 0.01;

    spawner_back.on("mousedown", function(evt) {
        this.offset = {x:this.x-evt.stageX, y:this.y-evt.stageY};
        spawner.offset = {x:spawner.x-evt.stageX, y:spawner.y-evt.stageY};
    });

    spawner_back.on("pressmove", function(evt) {
        var gs = grid_size;

        var x = Math.round((evt.stageX + this.offset.x - gs / 2) / gs) * gs + gs / 2;
        if (x < 0.5 * gs || x > gs * (game_width + 0.2)) {
            return;
        }
        this.x = x;
        spawner.x = Math.round((evt.stageX + spawner.offset.x - gs / 2) / gs) * gs + gs / 2;
    });

    stage.addChild(spawner_back);
    stage.addChild(spawner);
}

function tick() {
    activeBots.forEach(function(bot) {
        bot.handleMove(bot.destX, bot.destY);
    });

    var gs = grid_size;
    stage.destTile.x = Math.round((stage.mouseX - gs / 2) / gs) * gs - 2;
    stage.destTile.y = Math.round(((stage.mouseY + 20) - gs / 2) / gs) * gs - 22;
    stage.destTile.visible = $('canvas').hasClass('botSpawner')
        && stage.mouseInBounds && stage.destTile.y >= surface_height - 10;

    stage.update();
}

function init_ui() {
    window.statTemplate = _.template($('#mineral-stat-template').html());
    window.buy_button_template = _.template($('#robot-buy-button-template').html());

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
    stage.backdrop = new createjs.Bitmap('pics/other/upperlayer.png');
    stage.backdrop.x = 0;
    stage.backdrop.y = 0;
    stage.addChild(stage.backdrop);

    createSpawn(Math.floor(game_width/2));

    var reticuleSpritesheet = new createjs.SpriteSheet({
        images: ["pics/other/reticle.png"],
        frames: {width:44, height:44}
    });
    stage.destTile = new createjs.Sprite(reticuleSpritesheet);
    stage.destTile.gotoAndStop(0);
    $('canvas').on("mousedown", function() {
        stage.destTile.gotoAndStop(1);
    });
    $('canvas').on("mouseup", function() {
        stage.destTile.gotoAndStop(0);
    });
    stage.addChild(stage.destTile);

    createjs.Ticker.addEventListener("tick", tick);
    createjs.Ticker.setFPS(FPS);

    stage.enableMouseOver(10);
}
