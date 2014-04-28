Robot.prototype.render = function() {
    var _this = this;

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

    this.capacitybar.x = grid_size*x;
    this.capacitybar.y = grid_size*y + surface_height - grid_size / 3 + 6;
    if (this.storage == 0) {
        this.capacitybar.visible = false;
    } else {
        this.capacitybar.gotoAndStop(Math.floor(this.currentCapacity() / this.storage * 20));
    }

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
            if (_this.getGrid()[x] && _this.getGrid()[x][y]) {
                _this.getGrid()[x][y].setExplored();
            }
        });
    });
};

Robot.unlocked = function(type) {
    needMineral = robots[type].lockedTil;
    return needMineral ? (playerState.getResource(needMineral) > 0) : true;
}

// Determines if an upgrad is possible for a bot
// based on it's type, which level it wants to upgrade to
// and whether the player has collected enough of the right
// mineral.
var canUpgrade = function(type, level) {
    var upgrade = upgrades[type];
    var cost = upgrade.costs[level];
    var mineralReq = upgrade.mineralReqs[level];
    var mineral = upgrade.mineral;
    return playerState.getResource('money') >= cost &&
        playerState.getResource(mineral) >= mineralReq;
};

var upgradeBot = function(type, level) {
    if (!canUpgrade(type, level)) {
        return;
    }

    var cost = upgrades[type].costs[level];
    playerState.changeResource('money', -cost);
    playerState.setRobotLevel(type, level);
};

var remainingMineralsTillUpgrade = function(type, level) {
    var upgrade = upgrades[type];
    var cost = upgrade.costs[level];
    var mineralReq = upgrade.mineralReqs[level];
    var mineral = upgrade.mineral;
    return mineralReq - playerState.getResource(mineral);
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
        var destX = parseInt(e.stageX / grid_size);
        var destY = parseInt((e.stageY - surface_height) / grid_size);
        var bot = new Robot(robotAttrs, startX, destX, destY, playerState.getAsteroid());
        activeBots.push(bot);
        return bot;
    }, null, true);
};

var updatePlayerMoney = function(robotType) {
    playerState.changeResource('money', -robots[robotType].cost);
};
