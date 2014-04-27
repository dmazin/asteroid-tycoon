Robot.prototype.render = function() {
    if (this.energy <= 0) {
        this.animation.stop();
    }

    if (this.currentlyDigging) {
        x = (3 * this.position.x + this.currentlyDigging.x) / 4;
        y = (3 * this.position.y + this.currentlyDigging.y) / 4;
    } else {
        x = this.position.x;
        y = this.position.y;
    }

    this.healthbar.x = grid_size*x;
    this.healthbar.y = grid_size*y + surface_height - grid_size / 3;
    this.healthbar.gotoAndStop(Math.floor(this.energy / this.baseEnergy * 20));

    this.animation.rotation = 0;
    this.animation.scaleX = 1;
    if (this.direction == 'down') {
        this.animation.scaleX = -1;
        this.animation.rotation = 90;
        y++;
        x++;
    } else if (this.direction == 'up') {
        this.animation.scaleX = -1;
        this.animation.rotation = 270;
    } else if (this.direction == 'right') {
        this.animation.scaleX = -1;
        x++;
    } else if (this.direction == 'left') {
    }

    this.animation.x = grid_size*x;
    this.animation.y = grid_size*y + surface_height;

    var p = this.position;
    [p.x-1, p.x, p.x+1].forEach(function (x) {
        [p.y-1, p.y, p.y+1].forEach(function (y) {
            if (grid[x] && grid[x][y]) {
                grid[x][y].setExplored();
            }
        });
    });
};

var upgradeBot = function(type, level) {
    var cost = upgradeCosts[type][level];

    if (playerState.getResource('money') < cost) {
        return;
    }

    playerState.changeResource('money', -cost);
    playerState.setRobotLevel(type, level);
};

var spawnBot = function(type, startX) {
    var robotAttrs = robotLevels[type][state.getRobotLevel(type)];
    // Canvas act different if you can now spawn a bot
    $('canvas').addClass('botSpawner');

    // Have stage listen to mouseup once and make a new bot based on that
    stage.on('stagemouseup', function(e) {
        // Change canvas back
        $('canvas').removeClass('botSpawner');

        // Reset if the mouse is out of bounds.
        if(!stage.mouseInBounds) { return; }

        //Update the player
        updatePlayerMoney(type);

        // Make a new bot based on the position.
        var destX = parseInt(e.stageX / 40);
        var destY = parseInt(e.stageY / 40);
        var bot = new Robot(robotAttrs, startX, destX, destY);
        activeBots.push(bot);
        return bot;
    }, null, true);
};

var updatePlayerMoney = function(robotType) {
    playerState.changeResource('money', -robots[robotType].cost);
};
