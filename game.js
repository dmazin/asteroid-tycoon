
/* global constants */

var stage;
var spawner;
var cratebeam;

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
    $('#circle').css('left', spawner.x + 126);

    spawner_back = new createjs.Shape();
    spawner_back.graphics.beginFill('red')
                         .rect(-120,-60,240,120);
    spawner_back.x = grid_size*(xpos + 0.5);
    spawner_back.y = grid_size*(0 + 0.5);
    spawner_back.alpha = 0.01;

    var cratebeamSpritesheet = new createjs.SpriteSheet({
        images: ["pics/other/cratebeam.png"],
        frames: {width:80, height:160},
        animations: {
            beam: [0,9,'idle',2],
            idle: [10]
        }
    });
    cratebeam = new createjs.Sprite(cratebeamSpritesheet);
    cratebeam.x = spawner.x + 90;
    cratebeam.y = spawner.y + 50;
    stage.addChild(cratebeam);
    cratebeam.gotoAndStop('idle');

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
        cratebeam.x = spawner.x + 90;
        cratebeam.y = spawner.y + 50;
        $('#circle').css('left', spawner.x + 126);
    });

    stage.addChild(cratebeam);
    stage.addChild(spawner_back);
    stage.addChild(spawner);
}

function tick() {
    activeBots.forEach(function(bot) {
        bot.handleMove(bot.destX, bot.destY);
    });

    if (stage.destTile) {
        var gs = grid_size;
        stage.destTile.x = Math.round((stage.mouseX - gs / 2) / gs) * gs - 2;
        stage.destTile.y = Math.round(((stage.mouseY + 20) - gs / 2) / gs) * gs - 22;
        stage.destTile.visible = $('canvas').hasClass('botSpawner')
            && stage.mouseInBounds && stage.destTile.y >= surface_height - 10;
    }

    stage.update();
}

function init_ui() {
    window.statTemplate = _.template($('#mineral-stat-template').html());
    window.buy_button_template = _.template($('#robot-buy-button-template').html());

    _.each(resources, function(val, key) {
        if (val.harvestable) {
            $('.general-stats').append(statTemplate({
                name: key,
                abbrev: val.abbrev,
                amount: 0
            }));
        }
    });
}

function init_stage() {
    $('canvas')[0].height = game_height * grid_size + surface_height;

    stage.backdrop = new createjs.Bitmap(playerState.getAsteroid().bgImage);
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
        if (stage.destTile) {
            stage.destTile.gotoAndStop(1);
        }
    });
    $('canvas').on("mouseup", function() {
        if (stage.destTile) {
            stage.destTile.gotoAndStop(0);
        }
    });
    stage.addChild(stage.destTile);

    createjs.Ticker.addEventListener("tick", tick);
    createjs.Ticker.setFPS(FPS);

    stage.enableMouseOver(10);
}

function setup_stage_event_handler() {
    stage.on('stagemouseup', function(e) {
        if ($('canvas').hasClass('asteroidSelect')) {
            return;
        } else if ($('canvas').hasClass('botSpawner')) {
            hidePopups();

            // Change canvas back
            $('canvas').removeClass('botSpawner');

            // Reset if the mouse is out of bounds.
            if(!stage.mouseInBounds) { return; }

            //Update the player
            updatePlayerMoney(currentlySpawning.type);

            playSound('beam');
            cratebeam.gotoAndPlay('beam');

            // Make a new bot based on the position.

            var bot;
            setTimeout(function () {
                var destX = parseInt(e.stageX / grid_size);
                var destY = parseInt((e.stageY - surface_height) / grid_size);
                bot = new Robot(currentlySpawning.type, currentlySpawning.robotAttrs, currentlySpawning.startX, destX, destY, playerState.getAsteroid());
                activeBots.push(bot);
            }, 320);

            return bot;
        } else if (stage.mouseInBounds) {
            infoPopupClickOnStage(e);
        }
    });
}

document.onkeydown = checkKey;

function moveSpawn(direction){
  if (direction=="left"){
    spawn.shape.x = spawn.shape.x - grid_size;

  }
  else if (direction=="right"){
    spawn.shape.x = spawn.shape.x + grid_size;

  }
}

function checkKey(key) {

    key = key || window.event;

    if (key.keyCode == '83') {
        // s
        robotType = 'squirrelBot';
    }
    else if (key.keyCode == '66') {
        // b
        robotType = 'bearBot';
    }
    else if (key.keyCode == '65') {
        // a
        robotType = 'antBot';
    }
    else if (key.keyCode == '71') {
        // g
        robotType = 'goatBot';
    }
    else if (key.keyCode == '86') {
        // v
        robotType = 'vultureBot';
    }
    else{
        return;
    }

    var money = playerState.getResource('money');
    if (money > robots[robotType].cost && Robot.unlocked(robotType)) {
        spawnBot(robotType, Math.floor(spawner.x/grid_size + 3));
    }
}
